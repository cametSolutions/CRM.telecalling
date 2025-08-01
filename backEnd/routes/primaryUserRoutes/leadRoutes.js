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
  UpdaeOrSubmitdemofollowByfollower,
  GetdemoleadCount,
  GetrespectedprogrammingLead,
  UpdateOrleadallocationTask,
  UpdateOrSubmittaskfollowByfollower,
  GetallReallocatedLead,
  UpdateLeadTask,
  updateReallocation,
  GetallTask
} from "../../controller/primaryUserController/leadController.js"
const router = express.Router()

router.post("/leadRegister", authMiddleware, LeadRegister)
router.put("/leadRegisterUpdate", authMiddleware, UpdateLeadRegister)
router.get("/getallTask", authMiddleware, GetallTask)
router.put("/followupDateUpdate", authMiddleware, UpdateLeadfollowUpDate)
router.get("/getSelectedLead", authMiddleware, GetselectedLeadData)
router.post("/leadAllocation", authMiddleware, UpadateOrLeadAllocationRegister)
router.post("/leadReallocation", authMiddleware, updateReallocation)
router.post("/leadAllocationtask", authMiddleware, UpdateOrleadallocationTask)
router.get("/getallLead", authMiddleware, GetallLead)
router.get("/getallreallocatedLead", authMiddleware, GetallReallocatedLead)
router.get("/getallLeadFollowUp", authMiddleware, GetallfollowupList)
router.get("/getallServices", authMiddleware, GetAllservices)
router.get("/ownregisteredLead", authMiddleware, GetownLeadList)
router.post("/setdemolead", authMiddleware, SetDemoallocation)
router.get("/getrespecteddemolead", authMiddleware, GetrepecteduserDemo)
router.get("/getrespectedleadprogramming", authMiddleware, GetrespectedprogrammingLead)
router.get("/demoleadcount", authMiddleware, GetdemoleadCount)
router.post("/taskSubmission", authMiddleware, UpdateLeadTask)
router.post("/demosubmitbyfollower", authMiddleware, UpdaeOrSubmitdemofollowByfollower)
router.post("/tasksubmitbyfollower", authMiddleware, UpdateOrSubmittaskfollowByfollower)

export default router
