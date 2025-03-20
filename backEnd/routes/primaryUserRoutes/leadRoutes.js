import express from "express"
import authMiddleware from "../../middleware/authMiddleware.js"
import { LeadRegister } from "../../controller/primaryUserController/leadController.js"
const router = express.Router()

router.post("/leadRegister", authMiddleware, LeadRegister)

export default router
