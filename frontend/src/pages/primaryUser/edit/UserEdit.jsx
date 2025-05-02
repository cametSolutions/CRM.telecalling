import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

import UserAdd from "../../../components/primaryUser/UserAdd"
import api from "../../../api/api"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { parse } from "date-fns"

function UserEdit() {
  const [loggeduser, setlogged] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const { user, selected } = location.state || {}
  const logged = localStorage.getItem("user")
  const parsedlogged = JSON.parse(logged)

  const handleSubmit = async (
    userData,
    userId,
    tabledata,
    userlevelPermission,
    imageData
  ) => {
    // console.log(userData)

    try {
      const response = await api.post(
        "/auth/userEdit",
        { userData, userId, tabledata, userlevelPermission, imageData },
        {
          withCredentials: true
        }
      )
      if (response) {
        toast.success("User updated successfully:")
        if (parsedlogged.role === "Admin") {
          navigate("/admin/masters/users-&-passwords")
        } else if (parsedlogged.role === "Staff") {
          navigate("/staff/masters/users-&-passwords")
        }
      }
    } catch (error) {
      toast.error("Error in updating")
      console.error("Error updating branch:", error)
    }
  }
  return (
    <div>
      <UserAdd
        process={"Edit"}
        handleEditedData={handleSubmit}
        User={user}
        Selected={selected}
      />
    </div>
  )
}

export default UserEdit
