import express from "express"

import authMiddleware from "../../middleware/authMiddleware.js"
import {
  ProductRegistration,
  GetallProducts,
  GetProducts,
  EditProduct,
  ServicesRegistration,
  GetallServices,
  UpdateServices,
  DeleteService
} from "../../controller/primaryUserController/productController.js"

const router = express.Router()
router.post("/productRegistration", authMiddleware, ProductRegistration)
router.get("/getallProducts", authMiddleware, GetallProducts)
router.get("/getProducts", authMiddleware, GetProducts)
router.post("/productEdit", authMiddleware, EditProduct)
router.post("/servicesRegistration", authMiddleware, ServicesRegistration)
router.get("/getallServices", authMiddleware, GetallServices)
router.put("/serviceEdit", authMiddleware, UpdateServices)
router.delete("/serviceDelete", authMiddleware, DeleteService)

export default router
