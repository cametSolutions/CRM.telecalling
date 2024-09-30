import React, { useEffect, useState } from "react"

import { useLocation } from "react-router-dom"
import UseFetch from "../../../hooks/useFetch"
import ProductAdd from "../../../components/primaryUser/ProductAdd"
import api from "../../../api/api"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
function ProductEdit() {
  const [data, setData] = useState([])
  const navigate = useNavigate()
  const location = useLocation()
  const { product, selected } = location.state
  const productId = product._id
  console.log("produid", productId)
  console.log("proddddddd", product)
  console.log("selevtd", selected)

  const handleSubmit = async (productData, editData) => {
    console.log("editdata", editData)
    console.log("prrp", productData)
    try {
      const response = await api.post(
        `/product/productEdit?productid=${productId}`,
        { productData, editData },
        {
          withCredentials: true
        }
      )
      toast.success("Company updated successfully:")
      navigate("/admin/masters/product")
    } catch (error) {
      console.error("Error updating company:", error)
    }
  }
  return (
    <div>
      <ProductAdd
        process="edit"
        handleEditedData={handleSubmit}
        product={product}
        selected={selected}
      />
    </div>
  )
}

export default ProductEdit
