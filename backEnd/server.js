import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import cors from "cors"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
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

  //handle initial call data
  // socket.on("updatedCalls", async () => {
  //   console.log("Received request for initial data")
  //   try {
  //     // Fetch all calls from the database
  //     const calls = await CallRegistration.find({})
  //       .populate({
  //         path: "callregistration.product", // Populate the product field inside callregistration array
  //         select: "productName" // Optionally select fields from the Product schema you need
  //       })
  //       .exec()

  //     socket.emit("updatedCalls", { calls })
  //   } catch (error) {
  //     console.error("Error fetching call data:", error)
  //     socket.emit("error", "Error fetching data")
  //   }
  // })
  // socket.on("callregisterconversation", () => {
  //   customerCallRegistration(socket)
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
