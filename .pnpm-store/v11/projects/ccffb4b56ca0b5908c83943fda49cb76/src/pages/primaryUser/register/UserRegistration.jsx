import React from "react"
import UserAdd from "../../../components/primaryUser/UserAdd"
import api from "../../../api/api"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
function UserRegistration() {
  const navigate = useNavigate()
  const userData = localStorage.getItem("user")
  const user = JSON.parse(userData)
  const handleSubmit = async (userData, image, tabledata) => {
    try {
      const response = await api.post(
        "/auth/userRegistration",
        { userData, image, tabledata },
        {
          withCredentials: true
        }
      )
      if (response.status === 200) {
        toast.success(response?.data?.message)
        if (user.role === "Staff") {
          navigate("/staff/masters/users-&-passwords")
        } else if (user.role === "Admin") {
          navigate("/admin/masters/users-&-passwords")
        }
      } else {
        toast.error(response?.data?.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message)
      console.error("Error creating user:", error)
    }
  }
  return (
    <div>
      <UserAdd process="Registration" handleUserData={handleSubmit} />
    </div>
  )
}

export default UserRegistration
