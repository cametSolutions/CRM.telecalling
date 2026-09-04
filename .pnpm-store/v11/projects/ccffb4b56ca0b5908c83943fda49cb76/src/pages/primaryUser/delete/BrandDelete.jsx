import React from "react"
import BrandAdd from "../../../components/primaryUser/BrandAdd"
import api from "../../../api/api"
import toast from "react-hot-toast"

function BrandEdit() {
  const handleSubmit = async (deleteData) => {
    try {
      const response = await api.delete("/inventory/branddelete", deleteData, {
        withCredentials: true,
      })
      toast.success("Brand deleted successfully:")
    } catch (error) {
      console.error("Error updating branch:", error)
    }
  }
  return (
    <div>
      <BrandAdd process="Delete" handleDeleteData={handleSubmit} />
    </div>
  )
}

export default BrandEdit
