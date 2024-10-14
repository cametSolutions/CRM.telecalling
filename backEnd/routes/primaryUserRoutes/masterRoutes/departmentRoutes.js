import express from "express"
import authMiddleware from "../../../middleware/authMiddleware.js"
import {
  GetdepartmentList,
  DepartmentRegistration,
  UpdatedepartmentDetails,
  DeletedepartmentDetails
} from "../../../controller/primaryUserController/masterController/departmentController.js"

const router = express.Router()
router.get("/getDepartmentList", authMiddleware, GetdepartmentList)
router.post("/departmentRegistration", authMiddleware, DepartmentRegistration)
router.delete("/departmentDelete", authMiddleware, DeletedepartmentDetails)
router.put("/departmentEdit", authMiddleware, UpdatedepartmentDetails)

export default router
