import React, { useState, useEffect } from "react"
import UseFetch from "../../hooks/useFetch"
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"
// import UserPermissionList from "../../../components/primaryUser/UserPermissionList"

const LeaveApprovalAndPending = () => {
  const [user, setUser] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [showModal, setShowModal] = useState(null)
  const [leaveStatus, setLeaveStatus] = useState([])
  const [isToggled, setIsToggled] = useState({})
  const [isSelected, setIsSelected] = useState({})
  // const { data: userData, refreshHook } = UseFetch("/auth/getallUsers")
  const { data: leaveList, loading } = UseFetch("/auth/leaveList")

  useEffect(() => {
    if (leaveList) {
      // const { allusers } = userData
      setUser(leaveList)
    }
  }, [leaveList])
  console.log("leavelist", user)
  const openModal = (user) => {
    setSelectedUser(user)
    setShowModal(true)
  }
  const toggle = (id, userid) => {
    console.log("hii")
    console.log("id", id)
    console.log("userid", userid)
    setIsToggled((prevState) => ({
      ...prevState,
      [id]: !prevState[id] // Toggle the specific user's state
    }))
  }
  const toggleButton = (userId) => {
    setIsSelected((prevState) => ({
      ...prevState,
      [userId]: !prevState[userId] // Toggle the specific user's state
    }))
    setIsToggled((prevState) => ({
      ...prevState,
      [userId]: !prevState[userId] // Toggle the specific user's state
    }))
  }
  console.log(isToggled)
  // Function to close the modal
  const closeModal = () => {
    setShowModal(false)
    setSelectedUser(null)
    refreshHook()
  }
  const handleToggleStatus = (index) => {
    setLeaveStatus((prevStatus) => {
      const newStatus = [...prevStatus]
      newStatus[index] = !newStatus[index] // Toggle the status
      return newStatus
    })
  }

  return (
    <div className="text-center p-8 ">
      <h1 className="text-2xl font-bold mb-1">Leave Approval/Pending</h1>

      {/* Outer div with max height for scrolling the user list */}
      <div className="text-center max-h-60 sm:max-h-80 md:max-h-96 lg:max-h-[500px] overflow-y-auto overflow-x-axis">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-300 sticky top-0 z-40">
            <tr>
              <th className="border-l border-gray-300 py-3">No</th>
              <th className="py-3">User/Admin Name</th>

              <th className="py-3">Department</th>
              <th className="py-3">Branch</th>
              <th className="py-3">Apply Date</th>
              <th className="py-3">Leave Date</th>
              <th className="py-3">Reason</th>
              <th className="py-3">Depart. Status</th>
              <th className="py-3">Description</th>
              <th className="py-3">Approve</th>
              <th className="py-3">Approve All</th>

              <th className="py-3">Reject</th>
              {/* <th className="border-r border-gray-300 py-3">Permissions</th> */}
            </tr>
          </thead>
          <tbody>
            {user?.map((user, index) => (
              <tr key={user._id}>
                <td className="border border-gray-300 py-1">{index + 1}</td>
                <td className="border border-gray-300 py-1">
                  {user?.userId?.name}
                </td>

                <td className="border border-gray-300 py-1">
                  {user?.userId?.department?.department}
                </td>
                <td className="border border-gray-300 py-1 px-2">
                  {user?.userId?.selected
                    ?.map((branch) => branch?.branch_id?.branchName)
                    .join(", ")}
                </td>
                <td className="border border-gray-300 py-1">
                  {new Date(user?.createdAt).toLocaleDateString("en-GB", {
                    timeZone: "UTC",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                  })}
                </td>
                <td className="border border-gray-300 py-1">
                  {new Date(user?.leaveDate).toLocaleDateString("en-GB", {
                    timeZone: "UTC",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                  })}
                </td>
                <td className="border border-gray-300 py-1">{user.reason}</td>
                <td className="border border-gray-300 py-1">{user?.status}</td>
                <td className="border border-gray-300 py-1">
                  <input
                    type="text"
                    className="w-full px-2 py-1 border rounded focus:outline-none "
                  ></input>
                </td>
                <td className="border border-gray-300 py-1">
                  <div className="flex justify-center">
                    <button
                      onClick={() => toggle(user._id, user.userId._id)}
                      className={`${
                        isToggled[user.userId._id]
                          ? "bg-green-500"
                          : "bg-gray-300"
                      } w-12 h-6 flex items-center rounded-full  transition-colors duration-300`}
                    >
                      <div
                        className={`${
                          isToggled[user.userId._id]
                            ? "translate-x-6"
                            : "translate-x-0"
                        } w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300`}
                      ></div>
                    </button>
                  </div>
                </td>
                <td className="border border-gray-300 py-1">
                  <button
                    onClick={() => toggleButton(user.userId._id)}
                    className={` px-4 py-0 rounded text-white transition-colors duration-300 ${
                      isSelected[user.userId._id]
                        ? "bg-green-500"
                        : "bg-orange-500"
                    }`}
                  >
                    All
                  </button>
                </td>
                <td className="border border-gray-300 py-1 relative">
                  <button onClick={() => handleToggleStatus(index)}>
                    {leaveStatus[index] ? (
                      <FaCheckCircle className="text-green-500" />
                    ) : (
                      <FaTimesCircle className="text-red-500" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Render the UserPermissionList component as a modal */}
      {/* {showModal && (
        <UserPermissionList
          user={selectedUser}
          closeModal={closeModal}
          Loader={loading} // Pass the close modal function
        />
      )} */}
    </div>
  )
}

export default LeaveApprovalAndPending
