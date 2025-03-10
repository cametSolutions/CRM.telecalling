import React, { useState, useCallback, useEffect } from "react"
import { CiEdit } from "react-icons/ci"
import { useNavigate } from "react-router-dom"
import api from "../../../api/api"
import DeleteAlert from "../../../components/common/DeleteAlert"
import {
  FaUserPlus,
  FaSearch,
  FaRegFileExcel,
  FaFilePdf,
  FaPrint
} from "react-icons/fa"
import { Link } from "react-router-dom"
import debounce from "lodash.debounce"
import UseFetch from "../../../hooks/useFetch"

const UserListform = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUser] = useState([])
  const [loggeduser, setloggeduser] = useState(null)
  const { data, loading } = UseFetch("/auth/getallUsers")
  const loggeduserData = localStorage.getItem("user")
  const logged = JSON.parse(loggeduserData)
  useEffect(() => {
    if (data) {
      const { allusers } = data
      setUser(allusers)
      setloggeduser(logged)
    }
  }, [data])
  const handleSearch = debounce((query) => {
    const { allusers } = data
    const input = query.trim()

    const lowerCaseQuery = input.toLowerCase()

    const filteredName = allusers.filter((user) =>
      user.name.toLowerCase().includes(lowerCaseQuery)
    )
    const filteredMobile = allusers.filter((user) =>
      user.mobile.toString().toLowerCase().includes(lowerCaseQuery)
    )

    if (filteredName.length > 0) {
      setUser(filteredName)
    } else if (filteredMobile.length > 0) {
      setUser(filteredMobile)
    }

    // Reset to initial count after filtering
  }, 300)
  const handleDelete = async (id) => {
    try {
      await api.delete(`/auth/userDelete?id=${id}`)

      // Remove the deleted item from the items array
      setUser((prevItems) => prevItems.filter((item) => item._id !== id))
    } catch (error) {
      console.error("Failed to delete item", error)
      // toast.error("Failed to delete item. Please try again.")
    }
  }

  return (
    <div className="container  mx-auto  p-8 bg-gray-100">
      <div className="w-full  bg-white shadow-lg rounded p-10  ">
        <div className="flex justify-between items-center px-4 lg:px-6 xl:px-8 mb-2">
          <h3 className="text-2xl text-black font-bold">Users List</h3>
          {/* Search Bar for large screens */}
          <div className="mx-4 md:block">
            <div className="relative">
              <FaSearch className="absolute w-5 h-5 left-2 top-3 text-gray-500" />
            </div>
            <input
              type="text"
              onChange={(e) => handleSearch(e.target.value)}
              className=" w-full border border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none"
              placeholder="Search for..."
            />
          </div>
        </div>

        <hr className="border-t-2 border-gray-300 mb-3" />
        <div className="flex flex-wrap space-x-4 mb-2">
          <Link
            to={
              loggeduser?.role === "Admin"
                ? "/admin/masters/userRegistration"
                : "/staff/masters/userRegistration"
            }
            className="hover:bg-gray-100 text-black font-bold py-2 px-2 rounded inline-flex items-center"
          >
            <FaUserPlus className="mr-2" />
          </Link>
          <button className="hover:bg-gray-100 text-black font-bold py-2 px-2 rounded inline-flex items-center">
            <FaRegFileExcel className="mr-2" />
          </button>
          <button className="hover:bg-gray-100 text-black font-bold py-2 px-2 rounded inline-flex items-center">
            <FaFilePdf className="mr-2" />
          </button>
          <button className="hover:bg-gray-100 text-black font-bold py-2 px-2 rounded inline-flex items-center">
            <FaPrint className="mr-2" />
          </button>
        </div>
        <div className="max-h-60 sm:max-h-80 md:max-h-96 lg:max-h-[400px]  overflow-x-auto overflow-y-auto">
          <table className="min-w-full text-center ">
            <thead className="text-center  sticky top-0 z-10 bg-green-300">
              <tr>
                <th className="py-2 px-4 border-b border-gray-300">No</th>
                <th className="py-2 px-4 border-b border-gray-300">Branch</th>

                <th className="py-2 px-4 border-b border-gray-300">
                  User Name
                </th>
                <th className="py-2 px-4 border-b border-gray-300">id</th>
                <th className="py-2 px-4 border-b border-gray-300">UserId</th>
                <th className="py-2 px-4 border-b border-gray-300">Mobile</th>
                <th className="py-2 px-4 border-b border-gray-300">
                  Designation
                </th>
                <th className="py-2 px-4 border-b border-gray-300">Role</th>
                <th className="py-2 px-4 border-b border-gray-300">
                  AssignedTo
                </th>

                <th className="py-2 px-4 border-b border-gray-300">Edit</th>
                <th className="py-2 px-4 border-b border-gray-300">Delete</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-center">
              {users?.length > 0 ? (
                users.map((user, index) => {
                  // If user has a 'selected' array, map over it; otherwise, return a single row with user details
                  if (user?.selected?.length > 0) {
                    return user.selected.map((item, itemIndex) => (
                      <tr
                        key={`${user._id}-${itemIndex}`}
                        className="text-center"
                      >
                        <td className="py-3 text-sm text-black">
                          {itemIndex === 0 ? index + 1 : ""}
                        </td>
                        <td className="py-3 whitespace-nowrap text-sm text-black">
                          {item?.branchName}
                        </td>
                        <td className="py-3 whitespace-nowrap text-sm text-black">
                          {user?.name}
                        </td>
                        <td className="py-3 whitespace-nowrap text-sm text-black">
                          {user?.attendanceId}
                        </td>
                        <td className="py-3 whitespace-nowrap text-sm text-black">
                          {user?.email}
                        </td>
                        <td className="py-3 whitespace-nowrap text-sm text-black">
                          {user?.mobile}
                        </td>
                        <td className="py-3 whitespace-nowrap text-sm text-black">
                          {user?.designation}
                        </td>
                        <td className="py-3 whitespace-nowrap text-sm text-black">
                          {user?.role}
                        </td>
                        <td className="py-3 whitespace-nowrap text-sm text-black">
                          {user.assignedto
                            ? user.assignedto?.name
                            : "Not assigned"}
                        </td>

                        <td className="py-3 whitespace-nowrap text-xl text-black text-center">
                          <div className="flex justify-center items-center">
                            <CiEdit
                              onClick={() => {
                                if (loggeduser?.role === "Admin") {
                                  navigate("/admin/masters/userEdit", {
                                    state: {
                                      user,
                                      selected: item
                                    }
                                  })
                                } else if (loggeduser?.role === "Staff") {
                                  navigate("/staff/masters/userEdit", {
                                    state: {
                                      user,
                                      selected: item
                                    }
                                  })
                                }
                              }}
                              className="cursor-pointer"
                            />
                          </div>
                        </td>
                        <td className="py-3 whitespace-nowrap  text-black">
                          <DeleteAlert onDelete={handleDelete} Id={user._id} />
                        </td>
                      </tr>
                    ))
                  } else {
                    // If user has no 'selected' items, render a single row
                    return (
                      <tr key={user._id} className="text-center">
                        <td className="py-3 text-sm text-black">{index + 1}</td>
                        <td className="py-3 whitespace-nowrap text-sm text-black">
                          {/* No branchName if 'selected' is empty */}
                        </td>
                        <td className="py-3 whitespace-nowrap text-sm text-black">
                          {user?.name}
                        </td>
                        <td className="py-3 whitespace-nowrap text-sm text-black">
                          {user?.email}
                        </td>
                        <td className="py-3 whitespace-nowrap text-sm text-black">
                          {user?.mobile}
                        </td>
                        <td className="py-3 whitespace-nowrap text-sm text-black">
                          {user?.designation}
                        </td>
                        <td className="py-3 whitespace-nowrap text-sm text-black">
                          {user?.role}
                        </td>
                        <td className="py-3 whitespace-nowrap text-sm text-black">
                          {user.assignedto
                            ? user.assignedto.name
                            : "Not assigned"}
                        </td>
                        <td className="py-3 whitespace-nowrap text-xl text-black text-center">
                          <div className="flex justify-center items-center">
                            <CiEdit
                              onClick={() => {
                                if (loggeduser?.role === "Admin") {
                                  navigate("/admin/masters/userEdit", {
                                    state: {
                                      user
                                    }
                                  })
                                } else if (loggeduser?.role === "Staff") {
                                  navigate("/staff/masters/userEdit", {
                                    state: {
                                      user
                                    }
                                  })
                                }
                              }}
                              className="cursor-pointer"
                            />
                          </div>
                        </td>
                        <td className="py-3 whitespace-nowrap  text-black">
                          <DeleteAlert onDelete={handleDelete} Id={user._id} />
                        </td>
                      </tr>
                    )
                  }
                })
              ) : (
                <tr>
                  <td
                    colSpan="11"
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    {loading ? loading : "No users found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default UserListform
