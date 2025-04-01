import express from "express"
import authMiddleware from "../../middleware/authMiddleware.js"
import {
  LeadRegister,
  GetAllservices
} from "../../controller/primaryUserController/leadController.js"
const router = express.Router()

router.post("/leadRegister", authMiddleware, LeadRegister)
router.get("/getallServices", authMiddleware, GetAllservices)

export default router
