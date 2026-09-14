import React from "react"
import CompanyAdd from "../../../components/primaryUser/CompanyAdd"
import api from "../../../api/api"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
function CompanyRegistration() {
  const navigate = useNavigate()
  const handleSubmit = async companyData => {
    try {
      const response = await api.post(
        "/company/companyRegistration",
        companyData,
        {
          withCredentials: true,
        }
      )
      toast.success("Company created successfully:")
      navigate("/admin/masters/company")
    } catch (error) {
      console.error("Error creating company:", error)
    }
  }
  return (
    <div>
      <CompanyAdd process="Registration" handleCompanyData={handleSubmit} />
    </div>
  )
}

export default CompanyRegistration
