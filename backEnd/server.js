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
      // Fetch all calls from the database with populated product field
      const calls = await CallRegistration.find({})
        .populate({
          path: "callregistration.product", // Populate the product field inside callregistration array
          select: "productName" // Optionally select fields from the Product schema you need
        })
        .exec()

      // Function to batch populate the attendedBy field
      async function populateAttendedBy(attendedByArray) {
        console.log("attttednnnd")
        const callerIds = attendedByArray
          .filter((attendee) => attendee.callerId)
          .map((attendee) => attendee.callerId)

        if (callerIds.length === 0) return attendedByArray

        try {
          // Batch query to fetch all staff or admin users
          const users = await mongoose
            .model("Staff")
            .find({ _id: { $in: callerIds } })
            .select("name _id")

          const adminUsers = await mongoose
            .model("Admin")
            .find({ _id: { $in: callerIds } })
            .select("name _id")

          const allUsers = [...users, ...adminUsers]

          // Create a lookup map for callerId => name
          const userMap = new Map()
          allUsers.forEach((user) =>
            userMap.set(user._id.toString(), user.name)
          )

          // Attach the populated callerId to the attendees
          return attendedByArray.map((attendee) => {
            if (
              attendee.callerId &&
              userMap.has(attendee.callerId.toString())
            ) {
              return {
                ...attendee,
                callerId: { name: userMap.get(attendee.callerId.toString()) }
              }
            }
            return attendee
          })
        } catch (error) {
          console.error("Error populating attendedBy:", error)
          return attendedByArray // Return original if there's an error
        }
      }

      // Populate attendedBy and completedBy
      for (const call of calls) {
        for (const callEntry of call.callregistration) {
          if (
            callEntry.formdata.attendedBy &&
            callEntry.formdata.attendedBy.length > 0
          ) {
            // Populate the attendedBy field
            callEntry.formdata.attendedBy = await populateAttendedBy(
              callEntry.formdata.attendedBy
            )
          }
          console.log("hiiii")

          if (callEntry.formdata.completedBy) {
            console.log("commmmmmm")
            // Populate completedBy field (single object)
            const { callerId, role } = callEntry.formdata.completedBy[0]
            console.log("calleriedssdsdsds",callEntry.formdata.completedBy)
            if (callerId) {
              console.log("callerid", callerId)
              const model = role === "Staff" ? "Staff" : "Admin"
              try {
                const populatedCompletedBy = await mongoose
                  .model(model)
                  .findById(callerId)
                  .select("name")
                console.log("completedbu", populatedCompletedBy)
                callEntry.formdata.completedBy = populatedCompletedBy
              } catch (error) {
                console.error("Error populating completedBy:", error)
              }
            }
          }
        }
      }

      // Find the user (Staff or Admin)
      const objectId = new mongoose.Types.ObjectId(userId)
      let user = await Staff.findOne({ _id: objectId })

      if (!user) {
        user = await Admin.findOne({ _id: objectId })
      }

      // Emit the updated calls and user data to the client
      io.emit("updatedCalls", { calls, user })
    } catch (error) {
      console.error("Error fetching call data:", error)
      socket.emit("error", "Error fetching data")
    }
  })

  //handle initial call data
  ////second socket///
  // socket.on("updatedCalls", async (userId) => {
  //   console.log("Received request for initial data")

  //   let user
  //   try {
  //     // Fetch all calls from the database
  //     const calls = await CallRegistration.find({})
  //       .populate({
  //         path: "callregistration.product", // Populate the product field inside callregistration array
  //         select: "productName" // Optionally select fields from the Product schema you need
  //       })
  //       .exec()

  //     // Function to populate attendedBy with callerId's name
  //     async function populateAttendedBy(attendedByArray) {
  //       const populationPromises = attendedByArray.map(async (attendee) => {
  //         if (attendee.callerId && attendee.role) {
  //           // Check if callerId and role are present

  //           const model = attendee.role === "Staff" ? "Staff" : "Admin" // Determine the model based on role

  //           try {
  //             // Fetch the document based on the callerId and populate the 'callerId' field with the 'name' field
  //             const populatedAttendee = await mongoose
  //               .model(model)
  //               .findById(attendee.callerId) // Fetch the full document based on callerId
  //               .select("name") // Only select the 'name' field

  //             // Attach the populated callerId to the attendee
  //             return { ...attendee, callerId: populatedAttendee } // Add populated 'callerId' with 'name'
  //           } catch (error) {
  //             console.error(`Error populating attendedBy: ${error.message}`)
  //             return attendee // Return the original attendee if an error occurs
  //           }
  //         }
  //         return attendee // Return the attendee as is if callerId or role is missing
  //       })
  //       ////

  //       // Using Promise.allSettled to handle all promises concurrently
  //       const results = await Promise.allSettled(populationPromises)

  //       // Handle and log rejected promises (in case of errors)
  //       results.forEach((result, idx) => {
  //         if (result.status === "rejected") {
  //           // console.error(
  //           //   `Error populating attendedBy at index ${idx}: ${result.reason}`
  //           // )
  //         }
  //       })

  //       // Return the populated attendees (with or without populated callerId)
  //       return results.map((result) => result.value) // Map to get the final values
  //     }

  //     // Iterate and populate attendedBy only if necessary
  //     for (const call of calls) {
  //       for (const callEntry of call.callregistration) {
  //         if (
  //           callEntry.formdata.attendedBy &&
  //           callEntry.formdata.attendedBy.length > 0
  //         ) {
  //           // Populate the attendedBy field only if it contains attendees
  //           callEntry.formdata.attendedBy = await populateAttendedBy(
  //             callEntry.formdata.attendedBy
  //           )
  //         }
  //         if (callEntry.formdata.completedBy) {
  //           // If completedBy exists and is a single object (not an array)
  //           const model =
  //             callEntry.formdata.completedBy.role === "Staff"
  //               ? "Staff"
  //               : "Admin" // Get the correct model based on role
  //           try {
  //             // Populate the completedBy field with the caller's name

  //             const populatedCompletedBy = await mongoose
  //               .model(model)
  //               .findById(callEntry?.formdata?.completedBy[0]?.callerId) // Fetch the full document based on completedBy's callerId
  //               .select("name") // Only select the 'name' field

  //             // Attach the populated callerId to completedBy
  //             callEntry.formdata.completedBy = populatedCompletedBy
  //           } catch (error) {
  //             // console.error(`Error populating completedBy: ${error.message}`)
  //           }
  //         }
  //       }
  //     }

  //     // Find the user (Staff or Admin)
  //     const objectId = new mongoose.Types.ObjectId(userId)
  //     const staff = await Staff.findOne({ _id: objectId })

  //     if (staff) {
  //       user = staff // User is Staff
  //     } else {
  //       const admin = await Admin.findOne({ _id: objectId })
  //       user = admin // User is Admin
  //     }

  //     // Emit the updated calls and user data to the client
  //     io.emit("updatedCalls", { calls, user })
  //   } catch (error) {
  //     console.error("Error fetching call data:", error)
  //     socket.emit("error", "Error fetching data")
  //   }
  // })

  ///////first socket//
  // socket.on("updatedCalls", async (userId) => {
  //   console.log("Received request for initial data")
  //   let user
  //   try {
  //     // Fetch all calls from the database
  //     const calls = await CallRegistration.find({})
  //       .populate({
  //         path: "callregistration.product", // Populate the product field inside callregistration array
  //         select: "productName" // Optionally select fields from the Product schema you need
  //       })
  //       .exec()

  //     async function populateAttendedBy(attendedByArray) {
  //       const populationPromises = attendedByArray.map(async (attendee) => {
  //         if (attendee.callerId && attendee.role) {
  //           // Check if callerId and role are present
  //           console.log("attendee", attendee)

  //           const model = attendee.role === "Staff" ? "Staff" : "Admin" // Determine the model based on role

  //           try {
  //             // Fetch the document based on the callerId and populate the 'callerId' field with the 'name' field
  //             const populatedAttendee = await mongoose
  //               .model(model)
  //               .findById(attendee.callerId) // Fetch the full document based on callerId
  //               .select("name") // Only select the 'name' field
  //             console.log("name", populatedAttendee)
  //             // Attach the populated callerId to the attendee
  //             return { ...attendee, callerId: populatedAttendee }
  //           } catch (error) {
  //             console.error(`Error populating attendedBy: ${error.message}`)
  //             return attendee // Return the original attendee if an error occurs
  //           }
  //         }
  //         return attendee // Return the attendee as is if callerId or role is missing
  //       })

  //       // Using Promise.allSettled to handle all promises concurrently
  //       const results = await Promise.allSettled(populationPromises)

  //       // Handle and log rejected promises (in case of errors)
  //       results.forEach((result, idx) => {
  //         if (result.status === "rejected") {
  //           console.error(
  //             `Error populating attendedBy at index ${idx}: ${result.reason}`
  //           )
  //         }
  //       })

  //       // Return the populated attendees (with or without populated callerId)
  //       return results.map((result) => result.value) // Map to get the final values
  //     }

  //     // Iterate and populate attendedBy only if necessary
  //     for (const call of calls) {
  //       for (const callEntry of call.callregistration) {
  //         if (
  //           callEntry.formdata.attendedBy &&
  //           callEntry.formdata.attendedBy.length > 0
  //         ) {
  //           await populateAttendedBy(callEntry.formdata.attendedBy)
  //         }
  //       }
  //     }

  //     const objectId = new mongoose.Types.ObjectId(userId)
  //     const staff = await Staff.findOne({ _id: objectId })
  //     if (staff) {
  //       console.log("useridin", userId)
  //       console.log("staff", staff)
  //       console.log("oljljljlllj")
  //       user = staff
  //     } else {
  //       console.log("hiiiiiii")
  //       const admin = await Admin.findOne({ _id: objectId })
  //       user = admin
  //     }

  //     io.emit("updatedCalls", { calls, user })
  //   } catch (error) {
  //     console.error("Error fetching call data:", error)
  //     socket.emit("error", "Error fetching data")
  //   }
  // })

  // Handle Excel to JSON conversion
  socket.on("startConversion", (fileData) => {
    ExceltoJson(socket, fileData)
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
