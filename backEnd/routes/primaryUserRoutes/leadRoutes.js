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
  UpdateOrSubmittaskByfollower,
  GetallReallocatedLead,
  UpdateLeadTask,
  updateReallocation,
  GetallTask,
  GetalltaskanalysisLeads,
  LeadClosing,
  TaskRegistration,
  TaskDelete,
  TaskEdit,
  Checkexistinglead
} from "../../controller/primaryUserController/leadController.js"
const router = express.Router()

router.post("/leadRegister", authMiddleware, LeadRegister)
router.post("/taskRegistration", authMiddleware, TaskRegistration)
router.get("/checkexistinglead", authMiddleware, Checkexistinglead)
router.put("/leadRegisterUpdate", authMiddleware, UpdateLeadRegister)
router.get("/getallTask", authMiddleware, GetallTask)
router.delete("/taskDelete", authMiddleware, TaskDelete)
router.put("/taskEdit", authMiddleware, TaskEdit)
router.post("/leadClosingAmount", authMiddleware, LeadClosing)
router.put("/followupDateUpdate", authMiddleware, UpdateLeadfollowUpDate)
router.get("/getSelectedLead", authMiddleware, GetselectedLeadData)
router.post("/leadAllocation", authMiddleware, UpadateOrLeadAllocationRegister)
router.post("/leadReallocation", authMiddleware, updateReallocation)
router.post("/leadAllocationtask", authMiddleware, UpdateOrleadallocationTask)
router.get("/getallLead", authMiddleware, GetallLead)
router.get("/getallreallocatedLead", authMiddleware, GetallReallocatedLead)
router.get("/getalltaskAnalysisLeads", authMiddleware, GetalltaskanalysisLeads)
router.get("/getallLeadFollowUp", authMiddleware, GetallfollowupList)
router.get("/getallServices", authMiddleware, GetAllservices)
router.get("/ownregisteredLead", authMiddleware, GetownLeadList)
router.post("/setdemolead", authMiddleware, SetDemoallocation)
router.get("/getrespecteddemolead", authMiddleware, GetrepecteduserDemo)
router.get("/getrespectedleadprogramming", authMiddleware, GetrespectedprogrammingLead)
router.get("/demoleadcount", authMiddleware, GetdemoleadCount)
router.post("/taskSubmission", authMiddleware, UpdateLeadTask)
router.post("/demosubmitbyfollower", authMiddleware, UpdaeOrSubmitdemofollowByfollower)
router.post("/tasksubmitbyfollower", authMiddleware, UpdateOrSubmittaskByfollower)

export default router
