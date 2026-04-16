import express from "express"
import authMiddleware from "../../middleware/authMiddleware.js"
import { SubmitTargetRegister } from "../../controller/primaryUserController/targetController.js"
import { createTargetConfiguration,getTargetConfigurations,gettargetResult } from "../../controller/primaryUserController/targetController.js"
const router = express.Router()
router.get("/getregisteredTarget",authMiddleware,getTargetConfigurations)
router.get("/gettargetresult",authMiddleware,gettargetResult)
router.post("/submitTargetRegister", authMiddleware, createTargetConfiguration)
export default router