import React from "react"

import api from "../../../api/api"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import LeadMaster from "../../common/LeadMaster"

function LeadRegister() {
  const userData = localStorage.getItem("user")
  const user = JSON.parse(userData)

  const navigate = useNavigate()
  const handleSubmit = async (leadData, selectedtableLeadData) => {
    try {
      const response = await api.post("/lead/leadRegister", {
        leadData,
        selectedtableLeadData
      })

      toast.success(response && response.data && response.data.message)
      if (user.role === "Admin") {
        navigate("/admin/transaction/lead/leadAllocation")
      } else {
        navigate("/staff/transaction/lead/leadAllocation")
      }
    } catch (error) {
      console.error("Error creating product:", error)
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message) // Display the backend error message
      } else {
        toast.error("An unexpected error occurred. Please try again.") // Fallback message
      }
    }
  }
  return (
    <div className="h-full ">
      <LeadMaster process="Registration" handleleadData={handleSubmit} />
    </div>
  )
}

export default LeadRegister
