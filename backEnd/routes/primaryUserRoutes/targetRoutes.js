import express from "express"
import authMiddleware from "../../middleware/authMiddleware.js"
import { SubmitTargetRegister } from "../../controller/primaryUserController/targetController.js"
const router = express.Router()
router.post("/submitTargetRegister", authMiddleware, SubmitTargetRegister)
export default router