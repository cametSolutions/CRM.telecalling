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

      // const calls = await CallRegistration.aggregate([
      //   {
      //     $match: {
      //       $or: [
      //         { "callregistration.formdata.status": "pending" }, // Get pending calls (any date)
      //         {
      //           "callregistration.formdata.attendedBy": { $type: "array" }, // If attendedBy is an array
      //           "callregistration.formdata.attendedBy.calldate": {
      //             $exists: true,
      //             $gte: todayStart,
      //             $lt: todayEnd
      //           }
      //         }

      //       ],

      //     }
      //   }
      // ])
      // const calls = await CallRegistration.aggregate([
      //   {
      //     $match: {
      //       $or: [
      //         { "callregistration.formdata.status": "pending" }, // Get all pending calls (any date)
      //         {
      //           "callregistration.formdata.attendedBy": {
      //             $elemMatch: {
      //               calldate: { $gte: todayStart, $lt: todayEnd }
      //             }
      //           } // Efficient filtering inside the attendedBy array
      //         }
      //       ]
      //     }
      //   }
      // ])

      // const pendingcalls = await CallRegistration.aggregate([
      //   {
      //     $match: { "callregistration.formdata.status": "pending" }
      //   },
      //   {
      //     $lookup: {
      //       from: "products", // Replace with your actual product collection name
      //       localField: "callregistration.product", // The field in CallRegistration that references products
      //       foreignField: "_id", // The field in the Product collection that matches the reference
      //       as: "productDetails"
      //     }
      //   }
      // ])
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
        {
          $match: {
            "callregistration.formdata.attendedBy": {
              $elemMatch: {
                calldate: { $gte: todayStart, $lt: todayEnd }
              }
            }
          }
        },
        {
          $lookup: {
            from: "products", // Replace with your actual product collection name
            localField: "callregistration.product", // The field in CallRegistration that references products
            foreignField: "_id", // The field in the Product collection that matches the reference
            as: "productDetails"
          }
        }
      ])
      const uniqueCalls = new Map()
      ;[...pendingcalls, ...todayscalls].forEach((call) => {
        uniqueCalls.set(call._id.toString(), call) // Ensures only one instance per _id
      })

      const calls = Array.from(uniqueCalls.values())

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
