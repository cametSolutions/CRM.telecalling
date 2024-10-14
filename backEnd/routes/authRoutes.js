import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import {
  Login,
  Register,
  GetallUsers,
  LeaveApply,
  GetallLeave,
  UpdateUserandAdmin,
  DeleteUser
} from "../controller/authController.js"
const router = express.Router()

router.post("/login", Login)
router.post("/register", authMiddleware, Register)
router.post("/userEdit", authMiddleware, UpdateUserandAdmin)
router.post("/userRegistration", authMiddleware, Register)
router.delete("/userDelete", authMiddleware, DeleteUser)
router.get("/getallUsers", authMiddleware, GetallUsers)
router.post("/leave", authMiddleware, LeaveApply)
router.get("/getallLeave", authMiddleware, GetallLeave)

export default router
