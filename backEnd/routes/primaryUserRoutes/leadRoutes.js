import express from "express"
import authMiddleware from "../../middleware/authMiddleware.js"
import {
  LeadRegister,
  GetAllservices,
  GetallLead,
  UpadateOrLeadAllocationRegister,
  GetselectedLeadData,
  UpdateLeadfollowUpDate,
  UpdateLeadRegister,
  GetownLeadList,
  GetallfollowupList,
SetDemoallocation,
GetrepecteduserDemo,
UpdaeOrSubmitdemofollowByfollower
} from "../../controller/primaryUserController/leadController.js"
const router = express.Router()

router.post("/leadRegister", authMiddleware, LeadRegister)
router.put("/leadRegisterUpdate", authMiddleware, UpdateLeadRegister)
router.put("/followupDateUpdate", authMiddleware, UpdateLeadfollowUpDate)
router.get("/getSelectedLead", authMiddleware, GetselectedLeadData)
router.post("/leadAllocation", authMiddleware, UpadateOrLeadAllocationRegister)
router.get("/getallLead", authMiddleware, GetallLead)
router.get("/getallLeadFollowUp", authMiddleware, GetallfollowupList)
router.get("/getallServices", authMiddleware, GetAllservices)
router.get("/ownregisteredLead", authMiddleware, GetownLeadList)
router.post("/setdemolead",authMiddleware,SetDemoallocation)
router.get("/getrespecteddemolead",authMiddleware,GetrepecteduserDemo)
router.post("/demosubmitbyfollower",authMiddleware,UpdaeOrSubmitdemofollowByfollower)

export default router
