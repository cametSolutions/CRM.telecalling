import React, { useState, useEffect } from "react"
import UseFetch from "../../hooks/useFetch"
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"
// import UserPermissionList from "../../../components/primaryUser/UserPermissionList"

const LeaveApprovalAndPending = () => {
  const [user, setUser] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [showModal, setShowModal] = useState(null)
  const [leaveStatus, setLeaveStatus] = useState([])
  const { data: userData, refreshHook } = UseFetch("/auth/getallUsers")
  const { data: leaveList, loading } = UseFetch("auth/leaveList")

  useEffect(() => {
    if (userData) {
      const { allusers } = userData
      setUser(allusers)
    }
  }, [userData])
  const openModal = (user) => {
    setSelectedUser(user)
    setShowModal(true)
  }
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
              <th className="py-3">Designation</th>
              <th className="py-3">Department</th>
              <th className="py-3">Branch</th>
              <th className="py-3">Leave Date</th>
              <th className="py-3">Reason</th>
              <th className="py-3">Depart. Status</th>
              <th className="py-3">Approve</th>
              <th className="py-3">Reject</th>
              {/* <th className="border-r border-gray-300 py-3">Permissions</th> */}
            </tr>
          </thead>
          <tbody>
            {user?.map((user, index) => (
              <tr key={user._id}>
                <td className="border border-gray-300 py-1">{index + 1}</td>
                <td className="border border-gray-300 py-1">{user?.name}</td>
                <td className="border border-gray-300 py-1">
                  {user.designation}
                </td>
                <td className="border border-gray-300 py-1">
                  {user.department?.department}
                </td>
                <td className="border border-gray-300 py-1 px-2">
                  {user?.selected
                    ?.map((branch) => branch.branchName)
                    .join(", ")}
                </td>
                <td className="border border-gray-300 py-1">
                  {user.department?.department}
                </td>
                <td className="border border-gray-300 py-1">
                  {user.department?.department}
                </td>
                <td className="border border-gray-300 py-1">
                  {user.department?.department}
                </td>
                <td className="border border-gray-300 py-1">
                  {user.department?.department}
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
