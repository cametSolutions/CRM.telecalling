import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import cors from "cors"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import departmentRoutes from "./routes/primaryUserRoutes/masterRoutes/departmentRoutes.js"
import companyRoutes from "./routes/primaryUserRoutes/companyRoutes.js"
import branchRoutes from "./routes/primaryUserRoutes/branchRoutes.js"
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
console.log(PORT)

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
      const startOfDay = new Date()
      startOfDay.setHours(0, 0, 0, 0) // Start of today
      const endOfDay = new Date()
      endOfDay.setHours(23, 59, 59, 999)

      // const calls = await CallRegistration.aggregate([
      //   {
      //     $addFields: {
      //       "callregistration.formdata.attendedBy": {
      //         $cond: {
      //           if: { $isArray: "$callregistration.formdata.attendedBy" },
      //           then: "$callregistration.formdata.attendedBy", // Keep as array
      //           else: [{ calldate: "$callregistration.formdata.attendedBy" }] // Convert single value to array
      //         }
      //       }
      //     }
      //   },
      //   {
      //     $unwind: {
      //       path: "$callregistration.formdata.attendedBy",
      //       preserveNullAndEmptyArrays: true // Keeps documents that have no attendedBy
      //     }
      //   },
      //   {
      //     $addFields: {
      //       "callregistration.formdata.attendedBy.calldate": {
      //         $cond: {
      //           if: {
      //             $and: [
      //               {
      //                 $ne: [
      //                   "$callregistration.formdata.attendedBy.calldate",
      //                   ""
      //                 ]
      //               }, // Ensure it's not empty
      //               {
      //                 $not: {
      //                   $isArray:
      //                     "$callregistration.formdata.attendedBy.calldate"
      //                 }
      //               } // Ensure it's not an array
      //             ]
      //           },
      //           then: {
      //             $toDate: "$callregistration.formdata.attendedBy.calldate"
      //           }, // Convert to Date
      //           else: null // Set to null if it's missing or an array
      //         }
      //       }
      //     }
      //   },
      //   {
      //     $match: {
      //       "callregistration.formdata.attendedBy.calldate": {
      //         $gte: startOfDay,
      //         $lte: endOfDay
      //       }
      //     }
      //   }
      // ])

      // const calls = await CallRegistration.aggregate([
      //   {
      //     $addFields: {
      //       "callregistration.formdata.attendedBy": {
      //         $map: {
      //           input: "$callregistration.formdata.attendedBy",
      //           as: "attended",
      //           in: {
      //             calldate: { $toDate: "$$attended.calldate" }, // Convert calldate to Date
      //             otherFields: "$$attended"
      //           }
      //         }
      //       }
      //     }
      //   },
      //   {
      //     $match: {
      //       "callregistration.formdata.attendedBy.calldate": {
      //         $gte: startOfDay,
      //         $lte: endOfDay
      //       }
      //     }
      //   }
      // ]);

      const calls = await CallRegistration.find({})
        .populate([
          {
            path: "callregistration.product",
            select: "productName"
          },
          {
            path: "customerid",
            select: "customerName"
          }
        ])
        .lean()

      // Extract unique IDs for attendedBy and completedBy
      const attendedByIds = new Set()
      const completedByIds = new Set()

      calls.forEach((call) =>
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

      calls.forEach((call) =>
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
      

      io.emit("updatedCalls", { calls, user })
    } catch (error) {
      console.error("Error fetching call data:", error)
      socket.emit("error", "Error fetching data")
    }
  })

  // Handle Excel to JSON conversion
  socket.on("startConversion", (fileData) => {
    ExceltoJson(socket, fileData)
  })
  socket.on("startattendanceConversion", (fileData) => {
    AttendanceExceltoJson(socket, fileData)
  })
  // socket.on("updateUserCallStatus", async (userId) => {
  //   const objectId = new mongoose.Types.ObjectId(userId)
  //   let user = await Staff.findOne({ _id: objectId })

  //   if (!user) {
  //     user = await Admin.findOne({ _id: objectId })
  //   }

  //   // Emit the updated calls and user data to the client
  //   io.emit("updateUserCallStatus", { user })
  // })

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
app.use("/api/branch", branchRoutes)
app.use("/api/inventory", inventoryRoutes)
app.use("/api/product", productRoutes)
app.use("/api/customer", secondaryUserRoutes)
app.use("/api/master", departmentRoutes)

//   console.log(process.env.NODE_ENV) // if (process.env.NODE_ENV === "production") {
//   console.log("Serving static files from production build")
//   app.use(express.static(path.join(__dirname, "frondEnd", "dist")))
//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname, "frondEnd", "dist", "index.html"))
//   )
// } else {
//   app.get("/", (req, res) => {
//     res.send("Server is Ready")
//   })
// }

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send("Something broke!")
})

if (process.env.NODE_ENV === "production") {
  console.log(process.env.NODE_ENV)
  console.log("hai")
  const __dirname = path.resolve()
  //  const parentDir = path.join(__dirname ,'..');
  const parentDir = path.join(__dirname, "..")
  console.log(parentDir)
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
