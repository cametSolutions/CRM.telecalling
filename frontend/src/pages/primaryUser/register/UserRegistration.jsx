import React from "react"
import UserAdd from "../../../components/primaryUser/UserAdd"
import api from "../../../api/api"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
function UserRegistration() {
  const navigate = useNavigate()
  const handleSubmit = async (userData, image) => {
    console.log("image", image)
    try {
      const response = await api.post(
        "/auth/userRegistration",
        { userData, image },
        {
          withCredentials: true
        }
      )
      toast.success("user created successfully:")
      navigate("/admin/masters/users-&-passwords")
    } catch (error) {
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
