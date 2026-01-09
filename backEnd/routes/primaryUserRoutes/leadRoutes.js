import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
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
  GetrespectedleadTask,
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
  Checkexistinglead,
  GetallleadOwned,
  GetlostLeads,
  GetcollectionLeads,
  UpdateCollection,
  UpdatereceivedAmount,
  UpdatepaymentVerification,
  fixLeadVerifiedField,
  GetallproductwiseReport,
GetfollowupsummaryReport,
Getallsalesfunnels
} from "../../controller/primaryUserController/leadController.js";
const router = express.Router();
router.get("/getsalesfunnels",authMiddleware,Getallsalesfunnels)
router.get("/getallproductwisereport", authMiddleware, GetallproductwiseReport);
router.get("/getfollowupsummaryReport",authMiddleware,GetfollowupsummaryReport)
router.post("/leadRegister", authMiddleware, LeadRegister);
router.put("/fix-leadverified", authMiddleware, fixLeadVerifiedField);
router.put("/paymentverification", authMiddleware, UpdatepaymentVerification);
router.post("/collectionUpdate", authMiddleware, UpdateCollection);
router.post("/updatereceivedAmount", authMiddleware, UpdatereceivedAmount);
router.post("/taskRegistration", authMiddleware, TaskRegistration);
router.get("/checkexistinglead", authMiddleware, Checkexistinglead);
router.put("/leadRegisterUpdate", authMiddleware, UpdateLeadRegister);
router.get("/getallTask", authMiddleware, GetallTask);
router.delete("/taskDelete", authMiddleware, TaskDelete);
router.put("/taskEdit", authMiddleware, TaskEdit);
router.post("/leadClosingAmount", authMiddleware, LeadClosing);
router.put("/followupDateUpdate", authMiddleware, UpdateLeadfollowUpDate);
router.get("/getSelectedLead", authMiddleware, GetselectedLeadData);
router.post("/leadAllocation", authMiddleware, UpadateOrLeadAllocationRegister);
router.post("/leadReallocation", authMiddleware, updateReallocation);
router.post("/leadAllocationtask", authMiddleware, UpdateOrleadallocationTask);
router.get("/getallLead", authMiddleware, GetallLead);
router.get("/getAllleadowned", authMiddleware, GetallleadOwned); //for getting allleads in own lead page
router.get("/getallreallocatedLead", authMiddleware, GetallReallocatedLead);
router.get("/getalltaskAnalysisLeads", authMiddleware, GetalltaskanalysisLeads);
router.get("/getallLeadFollowUp", authMiddleware, GetallfollowupList);
router.get("/getallServices", authMiddleware, GetAllservices);
router.get("/ownregisteredLead", authMiddleware, GetownLeadList);
router.get("/lostlead", authMiddleware, GetlostLeads);
router.post("/setdemolead", authMiddleware, SetDemoallocation);
router.get("/getrespecteddemolead", authMiddleware, GetrepecteduserDemo);
router.get("/getrespectedleadTask", authMiddleware, GetrespectedleadTask);
router.get("/demoleadcount", authMiddleware, GetdemoleadCount);
router.get("/collectionLeads", authMiddleware, GetcollectionLeads);
router.post("/taskSubmission", authMiddleware, UpdateLeadTask);
router.post(
  "/demosubmitbyfollower",
  authMiddleware,
  UpdaeOrSubmitdemofollowByfollower
);
router.post(
  "/tasksubmitbyfollower",
  authMiddleware,
  UpdateOrSubmittaskByfollower
);

export default router;
