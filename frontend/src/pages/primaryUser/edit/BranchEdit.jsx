import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

import BranchAdd from "../../../components/primaryUser/BranchAdd"
import api from "../../../api/api"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
function BranchEdit() {
  const [Branch, setBranch] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { branch } = location.state || {}

  const handleSubmit = async (branchData, branchId) => {
    try {
      const response = await api.post(
        "/branch/branchEdit",
        {branchData,
        branchId},
        {
          withCredentials: true
        }
      )
      toast.success("Branch updated successfully:")
      navigate("/admin/masters/company")
    } catch (error) {
      console.error("Error updating branch:", error)
    }
  }
  return (
    <div>
      <BranchAdd
        process="edit"
        handleEditData={handleSubmit}
        branchdata={branch}
      />
    </div>
  )
}

export default BranchEdit
