import React from "react"
import UserAdd from "../../../components/primaryUser/UserAdd"
import api from "../../../api/api"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
function UserRegistration() {
  const navigate = useNavigate()
  const handleSubmit = async (userData, image, tabledata) => {
    console.log(tabledata)
    console.log("image", image)
    try {
      console.log("ravi")
      const response = await api.post(
        "/auth/userRegistration",
        { userData, image, tabledata },
        {
          withCredentials: true
        }
      )
      console.log("hiiljjfdldjl")
      if (response.status === 200) {
        toast.success(response?.data?.message)
        navigate("/admin/masters/users-&-passwords")
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
