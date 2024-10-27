import React, { useState, useEffect } from "react"
import UseFetch from "../../../hooks/useFetch"
import UserPermissionList from "../../../components/primaryUser/UserPermissionList"

const UserPermissions = () => {
  const [user, setUser] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [showModal, setShowModal] = useState(null)
  const { data: userData, refreshHook, loading } = UseFetch("/auth/getallUsers")

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

  return (
    <div className="text-center p-8 ">
      <h1 className="text-2xl font-bold mb-1">User/Admin Permissions</h1>

      {/* Outer div with max height for scrolling the user list */}
      <div className="text-center  z-30">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-300 sticky top-0 z-40">
            <tr>
              <th className="border-l border-gray-300 py-3">No</th>
              <th className="py-3">User/Admin Name</th>
              <th className="py-3">Designation</th>
              <th className="py-3">Department</th>
              <th className="py-3">Branch</th>
              <th className="border-r border-gray-300 py-3">Permissions</th>
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
                <td className="border border-gray-300 py-1">
                  {user?.selected
                    ?.map((branch) => branch.branchName)
                    .join(", ")}
                </td>
                <td className="border border-gray-300 py-1 relative">
                  <button
                    onClick={() => openModal(user)} // Open modal on click
                    className=" p-1 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800 shadow-lg rounded-xl"
                  >
                    Select Permission
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Render the UserPermissionList component as a modal */}
      {showModal && (
        <UserPermissionList
          user={selectedUser}
          closeModal={closeModal}
          Loader={loading} // Pass the close modal function
        />
      )}
    </div>
  )
}

export default UserPermissions
