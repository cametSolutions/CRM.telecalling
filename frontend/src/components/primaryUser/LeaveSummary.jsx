import React, { useState, useEffect } from "react"

import UseFetch from "../../hooks/useFetch"
import { useNavigate } from "react-router-dom"

const leaveSummary = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [leaves, setleaves] = useState([])
  const [attendance, setAttendance] = useState([])
  const [showModal, setShowModal] = useState(null)
  const { data: userData, refreshHook, loading } = UseFetch("/auth/getallUsers")
  const { data: usersleaves } = UseFetch("/auth/getallusersLeaves")
  const { data: usersAttendance } = UseFetch("/auth/getallusersAttendance")
  console.log(usersAttendance)
  console.log(usersleaves)
  useEffect(() => {
    setleaves(usersleaves)
    setAttendance(usersAttendance)
  }, [usersleaves, usersAttendance])
  useEffect(() => {
    if (userData && leaves) {
      const { allusers } = userData
      // Assuming allusers and leaves are arrays, and userId is already available.
      const updatedUsers = allusers.map((user) => {
        // Filter leaves for the current user and check if admin has approved them
        const userLeaves = leaves.filter(
          (leave) => leave.userId === user._id && leave.adminverified
        )

        // Add a new field `totalLeaves` to the user object
        return {
          ...user,
          totalLeaves: userLeaves.length // Total count of approved leaves for this user
        }
      })
      setUser(updatedUsers)
    }
  }, [userData, leaves, attendance])
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
      <h1 className="text-2xl font-bold mb-1">User Leave Summary</h1>
      {loading ? (
        <div className="text-lg font-semibold text-blue-600">
          Loading users...
        </div>
      ) : (
        // {/* Outer div with max height for scrolling the user list */}
        <div className="text-center max-h-60 sm:max-h-80 md:max-h-96 lg:max-h-[500px] overflow-y-auto ">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-300 sticky top-0 z-40">
              <tr>
                <th className="border-l border-gray-300 py-3">No</th>
                <th className="py-3">User Name</th>
                <th className="py-3">Designation</th>
                <th className="py-3">Total leaves</th>
                <th className="py-3">Total Late</th>
                <th className="py-3">Department</th>
                <th className="py-3">Branch</th>
                <th className="border-r border-gray-300 py-3">Leaves</th>
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
                    {user.totalLeaves}
                  </td>
                  <td className="border border-gray-300 py-1">{"0"}</td>
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
                      onClick={() =>
                        navigate(
                          `/admin/usersleave-application?userid=${user._id}&userName=${user.name}`,
                          {
                            state: {
                              selectedusersleaves: usersleaves,
                              selectedusersattendance: usersAttendance
                            }
                          }
                        )
                      }
                      className=" p-1 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-600 shadow-lg rounded-xl"
                    >
                      View Leave
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default leaveSummary
