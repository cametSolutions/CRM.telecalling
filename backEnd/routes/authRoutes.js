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
  GetAllLeaveRequest,
  resetCallStatus,
  GetStaffCallList,
  GetindividualStaffCall,
  ApproveLeave,
  RejectLeave,
  UpdateLeave,
  OnsiteleaveApply,
  AttendanceApply,
  GetAllAttendance,
  GetallusersAttendance,
  GetallusersLeaves
} from "../controller/authController.js"
const router = express.Router()

router.post("/login", Login)
router.post("/resetAdminstatus", authMiddleware, resetCallStatus)
router.post("/userEdit", authMiddleware, UpdateUserandAdmin)
router.post("/userPermissionUpdate", authMiddleware, UpdateUserPermission)
router.post("/userRegistration", authMiddleware, StaffRegister)
router.delete("/userDelete", authMiddleware, DeleteUser)
router.get("/getallUsers", authMiddleware, GetallUsers)
router.post("/leave", authMiddleware, LeaveApply)
router.get("/getallLeave", authMiddleware, GetallLeave)
router.get("/getallAttendance", authMiddleware, GetAllAttendance)
router.get("/leaveList", authMiddleware, GetAllLeaveRequest)
router.get("/getStaffCallStatus", authMiddleware, GetStaffCallList)
router.get("/staffcallList", authMiddleware, GetindividualStaffCall)
router.put("/approveLeave", authMiddleware, ApproveLeave)
router.put("/rejectLeave", authMiddleware, RejectLeave)
router.put("/updateLeave", authMiddleware, UpdateLeave)
router.post("/onsiteLeave", authMiddleware, OnsiteleaveApply)
router.post("/attendance", authMiddleware, AttendanceApply)
router.get("/getallusersLeaves", authMiddleware, GetallusersLeaves)
router.get("/getallusersAttendance", authMiddleware, GetallusersAttendance)

export default router
