import express from "express"

import authMiddleware from "../../middleware/authMiddleware.js"
import {
  ProductRegistration,
  GetallProducts,
  GetProducts,
  EditProduct
} from "../../controller/primaryUserController/productController.js"

const router = express.Router()
router.post("/productRegistration", authMiddleware, ProductRegistration)
router.get("/getallProducts", authMiddleware, GetallProducts)
router.get("/getProducts", authMiddleware, GetProducts)
router.post("/productEdit", authMiddleware, EditProduct)

export default router

// import express from "express"
// import authMiddleware from "../../middleware/authMiddleware"

// const router = express.Router()

// router.post(
//   "/productSubdetailsRegistration",
//   authMiddleware,
//   ProductSubdetailsRegistration
// )

// export default router
