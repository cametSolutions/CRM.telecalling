import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import cors from "cors"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import departmentRoutes from "./routes/primaryUserRoutes/masterRoutes/departmentRoutes.js"
import companyRoutes from "./routes/primaryUserRoutes/companyRoutes.js"
import dashBoardRoutes from "./routes/primaryUserRoutes/dashBoardRoutes.js"
import branchRoutes from "./routes/primaryUserRoutes/branchRoutes.js"
import leadRoutes from "./routes/primaryUserRoutes/leadRoutes.js"
import inventoryRoutes from "./routes/primaryUserRoutes/inventoryRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import excelRoutes from "./routes/primaryUserRoutes/excelRoutes.js"
import secondaryUserRoutes from "./routes/secondaryUserRoutes/secondaryUserRoutes.js"
import productRoutes from "./routes/primaryUserRoutes/productRoutes.js"
import http from "http"
import path from "path"
import { Server } from "socket.io"
import { fileURLToPath } from "url"
import { ExceltoJson } from "./controller/primaryUserController/excelController.js"
import { ExceltoJsonProduct } from "./controller/primaryUserController/excelController.js"
import { AttendanceExceltoJson } from "./controller/primaryUserController/attendanceExcelController.js"
import { customerCallRegistration } from "./controller/secondaryUserController/customerController.js"
import CallRegistration from "./model/secondaryUser/CallRegistrationSchema.js"
import mongoose from "mongoose"
import models from "./model/auth/authSchema.js"
const { Staff, Admin } = models
const app = express()
dotenv.config()
const server = http.createServer(app)

// Running port configuration
const PORT = process.env.PORT

// MongoDB connection getting from config/db.js
connectDB()

const corsOptions = {
  origin: true,
  credentials: true
}
const io = new Server(server, {
  cors: corsOptions // Apply the same CORS options here
})
app.use(cors(corsOptions))

io.on("connection", (socket) => {
  console.log("New client connected")

  socket.on("error", (err) => {
    console.error("Socket.IO error:", err)
  })
  socket.on("updatedCalls", async (userId) => {
    console.log("Received request for initial data")

    try {
      const todayStart =
        new Date().toISOString().split("T")[0] + "T00:00:00.000Z"
      const todayEnd = new Date().toISOString().split("T")[0] + "T23:59:59.999Z"

      const pendingcalls = await CallRegistration.aggregate([
        {
          $set: {
            callregistration: {
              $filter: {
                input: "$callregistration",
                as: "cr",
                cond: { $eq: ["$$cr.formdata.status", "pending"] }
              }
            }
          }
        },
        {
          $match: { "callregistration.0": { $exists: true } } // Ensures only documents with at least one pending call remain
        },
        {
          $lookup: {
            from: "products", // Replace with actual product collection name
            localField: "callregistration.product", // Field in CallRegistration referencing products
            foreignField: "_id", // Matching field in the Product collection
            as: "productDetails"
          }
        }
      ])

      const todayscalls = await CallRegistration.aggregate([
        // Filter the callregistration array to keep only entries with today's attendance
        {
          $addFields: {
            callregistration: {
              $filter: {
                input: "$callregistration",
                as: "call",
                cond: {
                  $and: [{ $eq: ["$$call.formdata.status", "solved"] },
                  {
                    $anyElementTrue: {
                      $map: {
                        input: {
                          $cond: {
                            if: {
                              $isArray: {
                                $ifNull: ["$$call.formdata.attendedBy", []]
                              }
                            },
                            then: { $ifNull: ["$$call.formdata.attendedBy", []] },
                            else: []
                          }
                        },
                        as: "attendance",
                        in: {
                          $and: [
                            { $ifNull: ["$$attendance.calldate", false] },
                            {
                              $gte: [
                                {
                                  $ifNull: ["$$attendance.calldate", new Date(0)]
                                },
                                todayStart
                              ]
                            },
                            {
                              $lt: [
                                {
                                  $ifNull: ["$$attendance.calldate", new Date(0)]
                                },
                                todayEnd
                              ]
                            }
                          ]
                        }
                      }
                    }
                  }

                  ]

                }
              }
            }
          }
        },


        // Remove documents where the callregistration array is now empty
        {
          $match: {
            "callregistration.0": { $exists: true }
          }
        },

        // For each call in the filtered array, filter the attendedBy array to keep only today's records
        {
          $addFields: {
            callregistration: {
              $map: {
                input: "$callregistration",
                as: "call",
                in: {
                  $mergeObjects: [
                    "$$call",
                    {
                      formdata: {
                        $mergeObjects: [
                          "$$call.formdata",
                          {
                            attendedBy: {
                              $cond: {
                                if: {
                                  $isArray: {
                                    $ifNull: ["$$call.formdata.attendedBy", []]
                                  }
                                },
                                then: {
                                  $filter: {
                                    input: "$$call.formdata.attendedBy",
                                    as: "attendance",
                                    cond: {
                                      $and: [
                                        {
                                          $ifNull: [
                                            "$$attendance.calldate",
                                            false
                                          ]
                                        },
                                        {
                                          $gte: [
                                            {
                                              $ifNull: [
                                                "$$attendance.calldate",
                                                new Date(0)
                                              ]
                                            },
                                            todayStart
                                          ]
                                        },
                                        {
                                          $lt: [
                                            {
                                              $ifNull: [
                                                "$$attendance.calldate",
                                                new Date(0)
                                              ]
                                            },
                                            todayEnd
                                          ]
                                        }
                                      ]
                                    }
                                  }
                                },
                                else: "$$call.formdata.attendedBy" // Keep original if not an array
                              }
                            }
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            }
          }
        },

        // Lookup product details
        {
          $lookup: {
            from: "products",
            localField: "callregistration.product",
            foreignField: "_id",
            as: "productDetails"
          }
        }
      ])
      // Step 1: Use a Map to store unique merged entries by _id
      const mergedMap = new Map();
    
      pendingcalls.forEach((call) => {
        mergedMap.set(call._id, { ...call })
      })
      todayscalls.forEach((call) => {
        if (mergedMap.has(call._id)) {
          //Merge callregistration arrays
          const existing = mergedMap.get(call._id)
          existing.callregistration = [...existing.callregistration,
          ...call.callregistration]
          mergedMap.set(call._id, existing)
        } else {
          mergedMap.set(call._id, { ...call })
        }
      })
      // Final merged array
      const mergedCalls = Array.from(mergedMap.values());
      // Extract unique IDs for attendedBy and completedBy
      const attendedByIds = new Set()
      const completedByIds = new Set()
      mergedCalls.forEach((call) =>
        call.callregistration.forEach((entry) => {
          // Handle `attendedBy`
          const attendedBy = entry.formdata.attendedBy
          if (Array.isArray(attendedBy)) {
            // If it's an array, iterate over it
            attendedBy.forEach((attendee) => {
              if (attendee.callerId) {
                attendedByIds.add(attendee.callerId.toString())
              } else if (attendee.name) {
                attendedByIds.add(attendee.name)
              }
            })
          } else if (typeof attendedBy === "string") {
            // If it's a string, add it directly
            attendedByIds.add(attendedBy)
          }

          // Handle `completedBy`
          const completedBy = entry.formdata.completedBy
          if (Array.isArray(completedBy) && completedBy.length > 0) {
            const completedByEntry = completedBy[0]
            if (completedByEntry.callerId) {
              completedByIds.add(completedByEntry.callerId.toString())
            } else if (completedByEntry.name) {
              completedByIds.add(completedByEntry.name)
              // Optionally, handle cases where only the name exists
              console.warn(
                `CompletedBy has name but no callerId: ${completedByEntry.name}`
              )
            }
          } else if (typeof completedBy === "string") {
            // If it's a string, add it directly
            completedByIds.add(completedBy)
          }
        })
      )

      // Separate IDs and names from the Sets
      const attendedByIdsArray = Array.from(attendedByIds)
      const attendedByObjectIds = attendedByIdsArray.filter((id) =>
        mongoose.Types.ObjectId.isValid(id)
      )

      const attendedByNames = attendedByIdsArray
        .filter((id) => !mongoose.Types.ObjectId.isValid(id)) // Filter invalid ObjectIds (names)
        .map((name) => ({ name })) // Transform them into objects with a "name" property

      const completedByIdsArray = Array.from(completedByIds)
      const completedByObjectIds = completedByIdsArray.filter((id) =>
        mongoose.Types.ObjectId.isValid(id)
      )

      const completedByNames = completedByIdsArray
        .filter((id) => !mongoose.Types.ObjectId.isValid(id)) // Filter invalid ObjectIds (names)
        .map((name) => ({ name })) // Transform them into objects with a "name" property

      // Query for ObjectIds (staff/admin users)
      const [
        attendedByStaff,
        attendedByAdmin,
        completedByStaff,
        completedByAdmin
      ] = await Promise.all([
        // Search attendedBy IDs in Staff
        mongoose
          .model("Staff")
          .find({ _id: { $in: attendedByObjectIds } })
          .select("name _id ")
          .lean(),

        // Search attendedBy IDs in Admin
        mongoose
          .model("Admin")
          .find({ _id: { $in: attendedByObjectIds } })
          .select("name _id ")
          .lean(),

        // Search completedBy IDs in Staff
        mongoose
          .model("Staff")
          .find({ _id: { $in: completedByObjectIds } })
          .select("name _id ")
          .lean(),

        // Search completedBy IDs in Admin
        mongoose
          .model("Admin")
          .find({ _id: { $in: completedByObjectIds } })
          .select("name _id ")
          .lean()
      ])

      // Combine results for attendedBy and completedBy
      const attendedByUsers = [...attendedByStaff, ...attendedByAdmin]
      const completedByUsers = [...completedByStaff, ...completedByAdmin]

      // Optionally handle name-based entries as well
      const attendedByCombined = [...attendedByUsers, ...attendedByNames]

      const completedByCombined = [...completedByUsers, ...completedByNames]
      const userMap = new Map(
        [...attendedByCombined, ...completedByCombined].map((user) => [
          user._id ? user._id.toString() : user.name,
          user.name
        ])
      )
      mergedCalls.forEach((call) =>
        call.callregistration.forEach((entry) => {
          // Handle attendedBy field
          if (Array.isArray(entry?.formdata?.attendedBy)) {
            entry.formdata.attendedBy = entry.formdata.attendedBy
              .flat() // Flatten the array
              .map((attendee) => {
                const name = userMap.get(attendee?.callerId?.toString())
                // If name is found, attach it to the callerId
                return name ? { ...attendee, callerId: { name } } : attendee // Keep original if no name found
              })
          } else if (typeof entry?.formdata?.attendedBy === "string") {
            // If attendedBy is a string (not an array), map it to the name if it exists in userMap
            const name = userMap.get(entry?.formdata?.attendedBy)
            entry.formdata.attendedBy = name
              ? { callerId: { name } } // Map the string to an object with a name
              : { callerId: entry?.formdata?.attendedBy } // Keep the original if no name found
          }

          // Handle completedBy field
          if (
            Array.isArray(entry?.formdata?.completedBy) &&
            entry?.formdata?.completedBy.length > 0
          ) {
            // If completedBy is an array, map over each entry (assuming one entry)
            const completedUser = userMap.get(
              entry?.formdata?.completedBy[0]?.callerId?.toString()
            )
            entry.formdata.completedBy = completedUser
              ? [{ ...entry?.formdata?.completedBy[0], name: completedUser }] // Add the name to the first item
              : entry.formdata.completedBy // Keep as is if no name found
          } else if (typeof entry?.formdata?.completedBy === "string") {
            // If completedBy is a string, map it to the name if it exists in userMap
            const name = userMap.get(entry?.formdata?.completedBy)
            entry.formdata.completedBy = name
              ? { callerId: { name } } // Map the string to an object with a name
              : { callerId: entry?.formdata?.completedBy } // Keep the original if no name found
          }
        })
      )
      let user
      if (userId) {
        const objectId = new mongoose.Types.ObjectId(userId)
        user = await Staff.findOne({ _id: objectId })

        if (!user) {
          user = await Admin.findOne({ _id: objectId })
        }
      }

      io.emit("updatedCalls", { mergedCalls, user })
    } catch (error) {
      console.error("Error fetching call data:", error)
      socket.emit("error", "Error fetching data")
    }
  })

  // Handle Excel to JSON conversion
  socket.on("startConversion", (fileData) => {
    ExceltoJson(socket, fileData)
  })

  socket.on("startproduct", (fileData) => {
    ExceltoJsonProduct(socket, fileData)
  })
  socket.on("startattendanceConversion", (fileData) => {
    AttendanceExceltoJson(socket, fileData)
  })

  socket.on("disconnect", () => {
    console.log("Client disconnected")
  })
})

// Define __dirname in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "public")))

// Middleware
app.use(express.json({ limit: "100mb", parameterLimit: 50000 }))
app.use(
  express.urlencoded({ limit: "100mb", extended: true, parameterLimit: 50000 })
)
app.use(bodyParser.json({ limit: "100mb", parameterLimit: 50000 }))
app.use(
  bodyParser.urlencoded({
    limit: "100mb",
    extended: true,
    parameterLimit: 50000
  })
)

app.use(cookieParser())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/excel", excelRoutes)
app.use("/api/company", companyRoutes)
app.use("/api/lead", leadRoutes)
app.use("/api/branch", branchRoutes)
app.use("/api/inventory", inventoryRoutes)
app.use("/api/product", productRoutes)
app.use("/api/customer", secondaryUserRoutes)
app.use("/api/master", departmentRoutes)
app.use("/api/dashboard", dashBoardRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send("Something broke!")
})

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve()
  //  const parentDir = path.join(__dirname ,'..');
  const parentDir = path.join(__dirname, "..")
  app.use(express.static(path.join(parentDir, "/frontend/dist")))
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(parentDir, "frontend", "dist", "index.html"))
  )
} else {
  app.get("/", (req, res) => {
    res.send("Server is Ready")
  })
}
server.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`)
})
