import express from "express"
import authMiddleware from "../../middleware/authMiddleware.js"
import {
  GetcurrentAchiever,
  UpdateAcheivements,
  UpdateAnnouncement,
  GetcurrentAnnouncement
} from "../../controller/primaryUserController/dashBoardController.js"
const router = express.Router()

router.get("/getcurrentquarterlyAchiever", authMiddleware, GetcurrentAchiever)
router.get("/getcurrentAnnouncement", authMiddleware, GetcurrentAnnouncement)
router.post("/updateAcheivements", authMiddleware, UpdateAcheivements)
router.post("/updateAnnouncement", authMiddleware, UpdateAnnouncement)

export default router
