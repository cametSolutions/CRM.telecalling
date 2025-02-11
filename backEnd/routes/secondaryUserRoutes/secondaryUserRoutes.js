import express from "express"
import authMiddleware from "../../middleware/authMiddleware.js"
import {
  CustomerRegister,
  GetCustomer,
  GetLicense,
  customerCallRegistration,
  GetCallRegister,
  CustomerEdit,
  GetAllExpiryRegister,
  getallExpiredCustomerCalls,
  DeleteCustomer,
  GetallCallnotes,
  CallnoteRegistration,
  PartnerRegistration,
  UpdateCallnotes,
  DeleteCallnotes,
  GetselectedDateCalls,
  GetallPartners,
  UpdatePartners,
  DeletePartner,
  LeavemasterRegister,
  GetallHoly,
  Getleavemaster
} from "../../controller/secondaryUserController/customerController.js"

const router = express.Router()

router.post("/customerRegistration", authMiddleware, CustomerRegister)
router.delete("/callnoteDelete", authMiddleware, DeleteCallnotes)
router.post("/callnotesRegistration", authMiddleware, CallnoteRegistration)
router.get("/getallcallNotes", authMiddleware, GetallCallnotes)
router.put("/callnotesEdit", authMiddleware, UpdateCallnotes)
router.post("/customerEdit", authMiddleware, CustomerEdit)
router.get("/getLicensenumber", authMiddleware, GetLicense)
router.get("/getCustomer", authMiddleware, GetCustomer)
router.post("/callRegistration", customerCallRegistration)
router.get("/getcallregister/:callId", GetCallRegister)
router.get("/getcallregister/", GetCallRegister)
router.get("/getselectedDateCalls", authMiddleware, GetselectedDateCalls)
router.delete("/deleteCustomer", authMiddleware, DeleteCustomer)
router.post("/partnerRegistration", authMiddleware, PartnerRegistration)
router.get("/getallpartners", authMiddleware, GetallPartners)
router.put("/partnerEdit", authMiddleware, UpdatePartners)
router.delete("/partnerDelete", authMiddleware, DeletePartner)
router.post("/leavemasterRegistration", authMiddleware, LeavemasterRegister)
router.get("/getallholy", authMiddleware, GetallHoly)
router.get("/getleavemaster", authMiddleware, Getleavemaster)
router.get(
  "/getallExpiryregisterCustomer",
  authMiddleware,
  GetAllExpiryRegister
)
router.post(
  "/getallExpiredCustomerCalls",
  authMiddleware,
  getallExpiredCustomerCalls
)
// router.get("/getallcalls", authMiddleware, GetallCalls)
// router.post("/updatedbranch", authMiddleware, updateBranchNames)

export default router
