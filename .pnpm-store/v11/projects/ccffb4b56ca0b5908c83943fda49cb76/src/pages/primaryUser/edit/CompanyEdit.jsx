import React from "react"
import CompanyAdd from "../../../components/primaryUser/CompanyAdd"
import api from "../../../api/api"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
function BranchEdit() {
  const navigate = useNavigate()
  const handleSubmit = async companyData => {
    try {
      const response = await api.post("/companyEdit", companyData, {
        withCredentials: true,
      })
      toast.success("Company updated successfully:")
      navigate("/admin/masters/company")
    } catch (error) {
      console.error("Error updating company:", error)
    }
  }
  return (
    <div>
      <CompanyAdd process="edit" handleCompanyData={handleSubmit} />
    </div>
  )
}

export default BranchEdit
