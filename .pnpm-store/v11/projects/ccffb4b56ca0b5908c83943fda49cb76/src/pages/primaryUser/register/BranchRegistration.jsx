import React from "react"
import BranchAdd from "../../../components/primaryUser/BranchAdd"
import api from "../../../api/api"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
function BranchRegistration() {
  const navigate = useNavigate()
  const handleSubmit = async (branchData) => {
    try {
      const response = await api.post(
        "/branch/branchRegistration",
        branchData,
        {
          withCredentials: true,
        }
      )
      toast.success(response.data.message)
      navigate("/admin/masters/branch")
    } catch (error) {
      toast.error(error.response.data.message)
      console.error("Error creating company:", error)
    }
  }
  return (
    <div>
      <BranchAdd process="Registration" handleBranchData={handleSubmit} />
    </div>
  )
}

export default BranchRegistration
