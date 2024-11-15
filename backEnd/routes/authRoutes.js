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
  GetindividualStaffCall
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
router.get("leaveList", authMiddleware, GetAllLeaveRequest)
router.get("/getStaffCallStatus", authMiddleware, GetStaffCallList)
router.get("/staffcallList", authMiddleware, GetindividualStaffCall)

export default router
