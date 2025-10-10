import { useState, useEffect } from "react"
import { CiEdit } from "react-icons/ci"
import { PropagateLoader } from "react-spinners"
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
import { getLocalStorageItem } from "../../../helper/localstorage"

const UserListform = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUser] = useState([])
  const [allusers, setallusers] = useState([])
  const [selectedBranch, setselectedBranch] = useState(null)
  const [loggeduser, setloggeduser] = useState(null)
  const { data, loading } = UseFetch("/auth/getallUsers")
  useEffect(() => {
    if (data) {
      const logged = getLocalStorageItem("user")
      const { allusers } = data

      setallusers(allusers)
      const filtereusers = allusers.filter((user) =>
        user.selected
          .map((branch) => branch.branch_id)
          .includes(logged.selected[0].branch_id)
      )
      setUser(filtereusers)
      setloggeduser(logged)
      setselectedBranch(logged.selected[0].branch_id)
    }
  }, [data])

  const handleSearch = debounce((query) => {
    const { allusers } = data
    const input = query.trim()
    setSearchQuery(input)

    const lowerCaseQuery = input.toLowerCase()

    const filteredName = allusers.filter((user) =>
      user.name.toLowerCase().startsWith(lowerCaseQuery)
    )
    const filteredMobile = allusers.filter((user) =>
      user.mobile.toString().toLowerCase().startsWith(lowerCaseQuery)
    )

    if (filteredName.length > 0) {
      const filtereusersbranchwise = filteredName.filter((user) =>
        user.selected.map((branch) => branch.branch_id).includes(selectedBranch)
      )

      setUser(filtereusersbranchwise)
    } else if (filteredMobile.length > 0) {
      const filtereusersbranchwise = filteredMobile.filter((user) =>
        user.selected.map((branch) => branch.branch_id).includes(selectedBranch)
      )

      setUser(filtereusersbranchwise)
    }

    // Reset to initial count after filtering
  }, 300)
  const handlebranchChange = (e) => {

    const [id, label] = e.target.value.split("||")
    setselectedBranch(id)
    if (searchQuery) {
      const filteredbyquery = allusers.filter((user) =>
        user.name.toLowerCase().startsWith(searchQuery.toLocaleLowerCase())
      )
      const filtereusersbranchwise = filteredbyquery.filter((user) =>
        user.selected.map((branch) => branch.branch_id).includes(id)
      )
      setUser(filtereusersbranchwise)
    } else {
      const filtereusersbranchwise = allusers.filter((user) =>
        user.selected.map((branch) => branch.branch_id).includes(id)
      )
      setUser(filtereusersbranchwise)
    }
  }
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
console.log()
  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header Section - Sticky */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-20 flex-shrink-0">
        {/* Title and Search Bar */}
        <div className="px-3 py-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Users List</h1>

            {/* Search Bar */}
            <div className="relative w-full sm:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                onChange={(e) => handleSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none
                         
                         placeholder-gray-400 text-sm transition-colors duration-200"
                placeholder="Search users..."
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-3 pb-2">
          <div className="flex md:flex-wrap gap-2 justify-between md:justify-start md:gap-2">
            <Link
              to={
                loggeduser?.role === "Admin"
                  ? "/admin/masters/userRegistration"
                  : "/staff/masters/userRegistration"
              }
              className="inline-flex items-center px-3 py-2 border border-gray-300 
                       rounded-md text-sm font-medium text-gray-700 bg-white 
                       hover:bg-gray-50 focus:outline-none focus:ring-2 
                       focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <FaUserPlus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Add User</span>
            </Link>

            <button
              className="inline-flex items-center px-3 py-2 border border-gray-300 
                             rounded-md text-sm font-medium text-gray-700 bg-white 
                             hover:bg-gray-50 focus:outline-none focus:ring-2 
                             focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            >
              <FaRegFileExcel className="w-4 h-4 mr-2 text-green-600" />
              <span className="hidden sm:inline">Excel</span>
            </button>

            <button
              className="inline-flex items-center px-3 py-2 border border-gray-300 
                             rounded-md text-sm font-medium text-gray-700 bg-white 
                             hover:bg-gray-50 focus:outline-none focus:ring-2 
                             focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              <FaFilePdf className="w-4 h-4 mr-2 text-red-600" />
              <span className="hidden sm:inline">PDF</span>
            </button>

            <button
              className="inline-flex items-center px-3 py-2 border border-gray-300 
                             rounded-md text-sm font-medium text-gray-700 bg-white 
                             hover:bg-gray-50 focus:outline-none focus:ring-2 
                             focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
            >
              <FaPrint className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <select
              onChange={(e) => handlebranchChange(e)}
              className="w-30 md:w-auto px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none  text-gray-700 bg-white"
            >
              {loggeduser &&
                loggeduser?.selected?.map((branch) => (
                  <option
                    key={branch._id}
                    value={`${branch.branch_id}||${branch.branchName}`}
                  >
                    {branch?.branchName}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden p-3">
        <div className="bg-white rounded-xl shadow overflow-hidden h-full flex flex-col">
          <div className="flex-1 overflow-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-300">
                <tr>
                  <th className="sticky top-0 z-10 px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-16 bg-green-300">
                    No
                  </th>
                  <th className="sticky top-0 z-10 px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-32 bg-green-300">
                    Branch
                  </th>
                  <th className="sticky top-0 z-10 px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-40 bg-green-300">
                    User Name
                  </th>
                  <th className="sticky top-0 z-10 px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-24 bg-green-300">
                    ID
                  </th>
                  <th className="sticky top-0 z-10 px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-48 bg-green-300">
                    User ID
                  </th>
                  <th className="sticky top-0 z-10 px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-32 bg-green-300">
                    Mobile
                  </th>
                  <th className="sticky top-0 z-10 px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-32 bg-green-300">
                    Designation
                  </th>
                  <th className="sticky top-0 z-10 px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-24 bg-green-300">
                    Role
                  </th>
                  <th className="sticky top-0 z-10 px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-32 bg-green-300">
                    Assigned To
                  </th>
                  <th className="sticky top-0 z-10 px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider min-w-24 bg-green-300">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {/* map rows here */}
                {users?.length > 0 ? (
                  users.map((user, index) => {
                    if (user?.selected?.length > 0) {
                      return user.selected.map((item, itemIndex) => (
                        <tr
                          key={`${user._id}-${itemIndex}`}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {itemIndex === 0 ? index + 1 : ""}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {item?.branchName}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {user?.name}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user?.attendanceId}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {user?.email}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user?.mobile}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {user?.designation}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user?.role === "Admin"
                                  ? "bg-purple-100 text-purple-800"
                                  : user?.role === "Manager"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {user?.role}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.assignedto ? (
                              user.assignedto?.name
                            ) : (
                              <span className="text-gray-400 italic">
                                Not assigned
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => {
                                  if (loggeduser?.role === "Admin") {
                                    navigate("/admin/masters/userEdit", {
                                      state: { user, selected: item }
                                    })
                                  } else if (
                                    loggeduser?.role === "Staff" ||
                                    loggeduser?.role === "Manager"
                                  ) {
                                    navigate("/staff/masters/userEdit", {
                                      state: { user, selected: item }
                                    })
                                  }
                                }}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors duration-200"
                                title="Edit User"
                              >
                                <CiEdit className="w-5 h-5" />
                              </button>
                              <DeleteAlert
                                onDelete={handleDelete}
                                Id={user._id}
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    } else {
                      return (
                        <tr
                          key={user._id}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">
                            -
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {user?.name}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user?.attendanceId}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {user?.email}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user?.mobile}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {user?.designation}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user?.role === "Admin"
                                  ? "bg-purple-100 text-purple-800"
                                  : user?.role === "Manager"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {user?.role}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.assignedto ? (
                              user.assignedto.name
                            ) : (
                              <span className="text-gray-400 italic">
                                Not assigned
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => {
                                  if (loggeduser?.role === "Admin") {
                                    navigate("/admin/masters/userEdit", {
                                      state: { user }
                                    })
                                  } else if (loggeduser?.role === "Staff") {
                                    navigate("/staff/masters/userEdit", {
                                      state: { user }
                                    })
                                  }
                                }}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors duration-200"
                                title="Edit User"
                              >
                                <CiEdit className="w-5 h-5" />
                              </button>
                              <DeleteAlert
                                onDelete={handleDelete}
                                Id={user._id}
                              />
                            </div>
                          </td>
                        </tr>
                      )
                    }
                  })
                ) : (
                  <tr>
                    <td colSpan="10" className="px-4 py-12 text-center">
                      {loading ? (
                        <div className="flex justify-center items-center">
                          <PropagateLoader color="#3b82f6" size={10} />
                        </div>
                      ) : (
                        <div className="text-gray-500">
                          <div className="text-lg font-medium mb-2">
                            No users found
                          </div>
                          <div className="text-sm">
                            Try adjusting your search criteria
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserListform
