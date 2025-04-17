import express from "express"
import authMiddleware from "../../middleware/authMiddleware.js"
import {
  GetcurrentAchiever,
  UpdateAcheivements
} from "../../controller/primaryUserController/dashBoardController.js"
const router = express.Router()

router.get("/getcurrentquarterlyAchiever", authMiddleware, GetcurrentAchiever)
router.post("/updateAcheivements", authMiddleware, UpdateAcheivements)

export default router
