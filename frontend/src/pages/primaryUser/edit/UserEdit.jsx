import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

import UserAdd from "../../../components/primaryUser/UserAdd"
import api from "../../../api/api"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

function UserEdit() {
  const [Branch, setBranch] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = location.state || {}
  console.log("user", user)

  const handleSubmit = async (userData, userId) => {
    try {
      const response = await api.post(
        "/auth/branchEdit",
        { userData, userId },
        {
          withCredentials: true
        }
      )
      toast.success("User updated successfully:")
      navigate("/admin/masters/userRegistration")
    } catch (error) {
      console.error("Error updating branch:", error)
    }
  }
  return (
    <div>
      <UserAdd
        process={"Edit"}
        handleEditedData={handleSubmit}
        UserData={user}
      />
    </div>
  )
}

export default UserEdit
