import express from "express"
import {
  ProductSubdetailsRegistration,
  GetproductsubDetails,
  UpdateProductDetails,
  DeleteproductDetails,
  CreateHsn,
  GetHsnDetails,
  DeleteHsn,
  UpdateHsn,
  GetBrands
} from "../../controller/primaryUserController/inventoryConroller.js"
import authMiddleware from "../../middleware/authMiddleware.js"

const router = express.Router()

router.post(
  "/productSubdetailsRegistration/",
  authMiddleware,
  ProductSubdetailsRegistration
)
router.get("/getproductsubDetails", authMiddleware, GetproductsubDetails)
router.put("/productSubdetailsEdit", authMiddleware, UpdateProductDetails)
router.delete("/productSubdetailsDelete", authMiddleware, DeleteproductDetails)
router.post("/hsnCreation", authMiddleware, CreateHsn)
router.get("/hsnlist", authMiddleware, GetHsnDetails)
router.delete("/hsndelete", authMiddleware, DeleteHsn)
router.put("/hsnEdit", authMiddleware, UpdateHsn)
router.get("/getBrand", authMiddleware, GetBrands)
export default router
