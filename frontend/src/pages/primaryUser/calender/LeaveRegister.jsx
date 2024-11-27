import React from "react"
import LeaveApplication from "../../../components/primaryUser/LeaveApplication"
import api from "../../../api/api"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
function LeaveRegister() {
  const navigate = useNavigate()
  const handleSubmit = async () => {
    try {
      console.log("submittttt")
      const response = await api.post(
        "/branch/branchRegistration",
        branchData,
        {
          withCredentials: true
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
      <LeaveApplication process="Registration" handleleaveform={handleSubmit} />
    </div>
  )
}

export default LeaveRegister
