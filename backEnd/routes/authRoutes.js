import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import {
  Login,
  StaffRegister,
  GetallUsers,
  LeaveApply,
  GetallLeave,
  UpdateUserandAdmin,
  UpdateUserPermission,
  DeleteUser,
  resetCallStatus,
  GetStaffCallList,
  GetindividualStaffCall,
  ApproveLeave,
  ApproveOnsite,
  RejectLeave,
  mergeonsite,
  UpdateLeave,
  OnsiteApply,
  AttendanceApply,
  GetAllAttendance,
  GetallOnsite,
  GetallusersAttendance,
  GetallusersLeaves,
  OnsiteleaveApply,
  GetsomeAll,
  UpdateLeaveSummary,
  EditLeave,
  EditAttendance,
  EditOnsite,
  GetAllapprovedORonsiteRequest,
  GetAllpendingORonsiteRequest,
  Check,
  GetleavemasterLeavecount,
  DeleteEvent,
  RejectOnsite,
  cancelLeaveOrOnsiteApproval,
  Getallcompensatoryleave
} from "../controller/authController.js"
const router = express.Router()

router.post("/login", Login)
router.post("/resetAdminstatus", authMiddleware, resetCallStatus)
router.post("/userEdit", authMiddleware, UpdateUserandAdmin)
router.post("/userPermissionUpdate", authMiddleware, UpdateUserPermission)
router.get(
  "/getleavemasterleavecount",
  authMiddleware,
  GetleavemasterLeavecount
)
router.post("/deleteEvent", authMiddleware, DeleteEvent)
router.post("/userRegistration", authMiddleware, StaffRegister)
router.delete("/userDelete", authMiddleware, DeleteUser)
router.get("/getallUsers", authMiddleware, GetallUsers)
router.post("/leave", authMiddleware, LeaveApply)
router.get("/getallLeave", authMiddleware, GetallLeave)
router.get("/getallAttendance", authMiddleware, GetAllAttendance)
router.get("/getallOnsite", authMiddleware, GetallOnsite)
router.get("/getallcompensatoryleave", authMiddleware, Getallcompensatoryleave)
router.get("/getsomeall", authMiddleware, GetsomeAll)
router.get("/pendingonsiteList", authMiddleware, GetAllpendingORonsiteRequest)
router.get("/pendingleaveList", authMiddleware, GetAllpendingORonsiteRequest)
router.get("/approvedLeaveList", authMiddleware, GetAllapprovedORonsiteRequest)
router.get("/approvedOnsiteList", authMiddleware, GetAllapprovedORonsiteRequest)
router.get("/getStaffCallStatus", authMiddleware, GetStaffCallList)
router.get("/staffcallList", authMiddleware, GetindividualStaffCall)
router.put("/approveLeave", authMiddleware, ApproveLeave)
router.put("/approveOnsite", authMiddleware, ApproveOnsite)
router.put("/cancelLeaveApproval", authMiddleware, cancelLeaveOrOnsiteApproval)
router.put("/cancelOnsiteApproval", authMiddleware, cancelLeaveOrOnsiteApproval)
router.put("/rejectLeave", authMiddleware, RejectLeave)
router.put("/rejectOnsite", authMiddleware, RejectOnsite)
router.put("/updateLeave", authMiddleware, UpdateLeave)
router.get("/merge", authMiddleware, mergeonsite)
router.post("/onsiteRegister", authMiddleware, OnsiteApply)
router.post("/editLeaveSummary", authMiddleware, UpdateLeaveSummary)
router.get("/check", authMiddleware, Check)
router.post("/attendance", authMiddleware, AttendanceApply)
router.post("/editLeave", authMiddleware, EditLeave)
router.post("/editOnsite", authMiddleware, EditOnsite)
router.post("/editAttendance", authMiddleware, EditAttendance)
router.get("/getallusersLeaves", authMiddleware, GetallusersLeaves)
router.get("/getallusersAttendance", authMiddleware, GetallusersAttendance)

export default router
