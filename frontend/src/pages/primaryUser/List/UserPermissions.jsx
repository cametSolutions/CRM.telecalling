import React, { useState, useEffect } from "react"

import UseFetch from "../../../hooks/useFetch"
import UserPermissionList from "../../../components/primaryUser/UserPermissionList"

const UserPermissions = () => {
  const [user, setUser] = useState([])
  // State for search input
  const [searchQuery, setSearchQuery] = useState("")
  // Debounced search query state
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showModal, setShowModal] = useState(null)
  const { data: userData, refreshHook, loading } = UseFetch("/auth/getallUsers")
  // Set up debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 500) // Delay of 500ms after the user stops typing

    // Cleanup the timer on component unmount or if searchQuery changes
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Filter data based on debounced query
  useEffect(() => {
    if (debouncedQuery) {
      const filtered = user.filter((staff) =>
        staff.name.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
      setUser(filtered)
    }
  }, [debouncedQuery])
  useEffect(() => {
    if (userData && debouncedQuery === "") {
      const { allusers } = userData
      setUser(allusers)
    }
    if (debouncedQuery) {
      const filtered = user.filter((staff) =>
        staff.name.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
      setUser(filtered)
    }
  }, [userData,debouncedQuery])
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
    <div className="text-center md:p-6 p-3">
      <div className=" shadow-xl border border-gray-100 rounded-lg p-3">
        <div className="w-full py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-center flex-grow">
            User/Admin Permissions
          </h1>
          <div className="ml-auto">
            <input
              className="py-1 px-2 border border-gray-300 rounded-md focus:outline-none"
              placeholder="Search Staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-lg font-semibold text-blue-600">
            Loading users...
          </div>
        ) : (
          // {/* Outer div with max height for scrolling the user list */}
          <div className="text-center max-h-60 sm:max-h-80 md:max-h-96 lg:max-h-[500px] overflow-y-auto rounded-lg">
            <table className="min-w-full table-auto ">
              <thead className="bg-purple-300 sticky top-0 z-40">
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
                    <td className="border border-gray-300 py-1">
                      {user?.name}
                    </td>
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
                        className="px-2 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800 shadow-lg rounded-lg text-white "
                      >
                        Select Permission
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Render the UserPermissionList component as a modal */}
        {showModal && (
          <UserPermissionList
            user={selectedUser}
            closeModal={closeModal}
            Loader={loading} // Pass the close modal function
          />
        )}
      </div>
    </div>
  )
}

export default UserPermissions
