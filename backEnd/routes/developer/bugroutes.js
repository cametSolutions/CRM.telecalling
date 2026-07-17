import express from "express"
const router = express.Router()
// const {
//   createBugReport,
//   getBugReports,
//   updateBugReport
// } = require("../controllers/bugReport.controller")
// import { createBugReport,getBugReports,updateBugReport } from "../../controller/developer/bugreportController.js"
import { createBugReport,getBugReports,updateBugReport } from "../../controller/developer/bugreportController.js"
import authMiddleware from "../../middleware/authMiddleware.js"
// Adjust/add your existing auth middleware here, e.g.:
// const { requireAuth, requireAdmin } = require("../middleware/auth")

router.post("/createbug",authMiddleware, createBugReport)
router.get("/getbugreport",authMiddleware, getBugReports)
// router.patch("/:id", /* requireAuth, requireAdmin, */ updateBugReport)

export default router

// In your main app/server file, mount it with:
// const bugReportRoutes = require("./routes/bugReport.routes")
// app.use("/api/bugreports", bugReportRoutes)
