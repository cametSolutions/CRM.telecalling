import React, { useState, useRef } from "react"
import UseFetch from "../../../hooks/useFetch"

const UserPermissionsDropdown = () => {
  // Sample data for users
  const usersData = [
    { id: 1, name: "Alice", designation: "telecaller", department: "HR" },
    { id: 2, name: "Bob", designation: "support", department: "marketting" },
    { id: 3, name: "Charlie", designation: "hr", department: "finance" },

    { id: 4, name: "Charlie", designation: "Admin", department: "finance" },
    { id: 5, name: "Charlie", designation: "hr", department: "finance" },
    { id: 6, name: "Charlie", designation: "hr", department: "finance" },
    { id: 7, name: "Charlie", designation: "hr", department: "finance" },
    { id: 8, name: "Charlie", designation: "hr", department: "finance" },
    { id: 9, name: "Charlie", designation: "hr", department: "finance" },
    { id: 10, name: "Charlie", designation: "hr", department: "finance" },
    { id: 11, name: "Charlie", designation: "hr", department: "finance" },
    { id: 12, name: "Charlie", designation: "hr", department: "finance" },
    { id: 13, name: "Charlie", designation: "hr", department: "finance" }
  ]
  const [dropdownOpen, setDropdownOpen] = useState({})
  const dropdownRefs = useRef({})
  const dropdownButtonRefs = useRef({})
  // State to manage permissions for each user
  const [userPermissions, setUserPermissions] = useState(
    usersData.reduce((acc, user) => {
      acc[user.id] = {} // Initialize empty permissions object for each user
      return acc
    }, {})
  )
  const togglePermission = (userId, permission, value) => {
    setUserPermissions((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [permission]: value // true or false
      }
    }))
  }
  const toggleDropdown = (userId) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [userId]: !prev[userId] // Toggle the dropdown for the specific user
    }))
  }

  // Sample permissions
  const permissionsList = [
    "Read",
    "Write",
    "Delete",
    "Execute",
    "Manage Users",
    "View Reports",
    "Edit Settings",
    "Access Admin Panel",
    "Read",
    "Write",
    "Delete",
    "Execute",
    "Manage Users",
    "View Reports",
    "Edit Settings",
    "Access Admin Panel",
    "Read",
    "Write",
    "Delete",
    "Execute",
    "Manage Users",
    "View Reports",
    "Edit Settings",
    "Access Admin Panel",
    "Read",
    "Write",
    "Delete",
    "Execute",
    "Manage Users",
    "View Reports",
    "Edit Settings",
    "Access Admin Panel"
    // Add more permissions as needed
  ]

  // Toggle permission for a user
  //   const togglePermission = (userId, permission) => {
  //     setUserPermissions((prev) => ({
  //       ...prev,
  //       [userId]: {
  //         ...prev[userId],
  //         [permission]: !prev[userId][permission] // Toggle the permission
  //       }
  //     }))
  //   }

  return (
    <div className="text-center p-8 ">
      <h1 className="text-2xl font-bold mb-1">User/Admin Permissions</h1>
      <div className="text-center  lg:max-h-[500px]  overflow-y-auto">
        <table className="min-w-full">
          <thead className="bg-gray-300 sticky top-0 z-40">
            <tr>
              <th className="border-l border-gray-300 py-3">No</th>
              <th className=" py-3">User/Admin Name</th>
              <th className=" py-3">Designation</th>
              <th className=" py-3">Department</th>
              <th className=" py-3">Branch</th>
              <th className="border-r border-gray-300 py-3">Permissions</th>
            </tr>
          </thead>
          <tbody>
            {usersData.map((user, index) => (
              <tr key={user.id}>
                <td className="border border-gray-300 py-1">{index + 1}</td>
                <td className="border border-gray-300 py-1">{user.name}</td>
                <td className="border border-gray-300 py-1">
                  {user.designation}
                </td>
                <td className="border border-gray-300 py-1">
                  {user.department}
                </td>

                <td className="border border-gray-300 py-1">camet,accuanet</td>
                <td className="border border-gray-300 py-1">
                  <div className="relative inline-block">
                    <button
                      onClick={() => toggleDropdown(user.id)}
                      className="bg-blue-500 text-white px-4 py-1 rounded"
                    >
                      Select Permissions
                    </button>
                    {dropdownOpen[user.id] && (
                      <div className="absolute mt-1 w-56 bg-white border border-gray-300 rounded shadow-lg z-10 max-h-48 overflow-y-auto">
                        {/* Select All Checkbox */}
                        <label className="flex items-center p-2">
                          <input
                            type="checkbox"
                            checked={permissionsList.every(
                              (permission) =>
                                userPermissions[user.id]?.[permission]
                            )}
                            onChange={() => {
                              const allChecked = permissionsList.every(
                                (permission) =>
                                  userPermissions[user.id]?.[permission]
                              )
                              // Toggle all permissions based on current state
                              permissionsList.forEach((permission) => {
                                if (allChecked) {
                                  // If all are checked, uncheck them
                                  togglePermission(user.id, permission, false)
                                } else {
                                  // If not all are checked, check them
                                  togglePermission(user.id, permission, true)
                                }
                              })
                            }}
                          />
                          <span className="ml-2">Select All</span>
                        </label>

                        {/* Map over the permissions */}
                        {permissionsList.map((permission, index) => (
                          <label key={index} className="flex items-center p-2 ">
                            <input
                              type="checkbox"
                              checked={
                                userPermissions[user.id]?.[permission] || false
                              }
                              onChange={() =>
                                togglePermission(user.id, permission)
                              }
                            />
                            <span className="ml-2">{permission}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserPermissionsDropdown
