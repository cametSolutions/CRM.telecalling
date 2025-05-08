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
GetownLeadList
} from "../../controller/primaryUserController/leadController.js"
const router = express.Router()

router.post("/leadRegister", authMiddleware, LeadRegister)
router.put("/leadRegisterUpdate", authMiddleware, UpdateLeadRegister)
router.put("/followupDateUpdate", authMiddleware, UpdateLeadfollowUpDate)
router.get("/getSelectedLead", authMiddleware, GetselectedLeadData)
router.post("/leadAllocation", authMiddleware, UpadateOrLeadAllocationRegister)
router.get("/getallLead", authMiddleware, GetallLead)
router.get("/getallServices", authMiddleware, GetAllservices)
router.get("/ownregisteredLead",authMiddleware,GetownLeadList)

export default router
