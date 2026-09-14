import React from "react"
import BrandAdd from "../../../components/primaryUser/BrandAdd"
import api from "../../../api/api"
import toast from "react-hot-toast"

function BrandEdit() {
  const handleSubmit = async (brandData, refreshHook, editingBrandId) => {
    try {
      const response = await api.put(brandData, {
        withCredentials: true,
      })
      toast.success(response.data)
    } catch (error) {
      console.error("Error updating branch:", error)
    }
  }
  return (
    <div>
      <BrandAdd process="Edit" handleBrandData={handleSubmit} />
    </div>
  )
}

export default BrandEdit
