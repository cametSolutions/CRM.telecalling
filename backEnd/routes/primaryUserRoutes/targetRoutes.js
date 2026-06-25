import express from "express"
import authMiddleware from "../../middleware/authMiddleware.js"

import { createOrUpdateTargetConfiguration,getTargetConfigurations,gettargetResult,deleteTargetConfiguration } from "../../controller/primaryUserController/targetController.js"
const router = express.Router()
router.get("/getregisteredTarget",authMiddleware,getTargetConfigurations)
router.get("/gettargetresult",authMiddleware,gettargetResult)
router.post("/createOrUpdateTargetConfiguration", authMiddleware, createOrUpdateTargetConfiguration)
router.delete("/deleteTargetConfiguration",authMiddleware,deleteTargetConfiguration)
export default router