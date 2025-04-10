import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

import LeadMaster from "../../common/LeadMaster"
import api from "../../../api/api"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
function LeadEdit() {
  const navigate = useNavigate()
  const location = useLocation()
  const { leadId } = location.state || {}
  console.log(leadId)
  useEffect(() => {
    if (leadId) {
      const fetchselectedLeadData = async () => {
        console.log("h")
        const response = await api.get(
          `/lead/getSelectedLead?leadId=${leadId}`
        )

        if (response.status >= 200 && response.status < 300) {
        }
      }
      fetchselectedLeadData()
    }
  }, [])

  const handleSubmit = async (branchData, branchId) => {
    try {
      const response = await api.post(
        "/branch/branchEdit",
        { branchData, branchId },
        {
          withCredentials: true
        }
      )
      toast.success("Branch updated successfully:")
      navigate("/admin/masters/branch")
    } catch (error) {
      console.error("Error updating branch:", error)
    }
  }
  return (
    <div>
      <LeadMaster
        process="edit"
        handleEditData={handleSubmit}
        // branchdata={branch}
      />
    </div>
  )
}

export default LeadEdit
