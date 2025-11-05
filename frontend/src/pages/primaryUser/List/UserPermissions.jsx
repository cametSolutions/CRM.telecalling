import { useState, useEffect } from "react"

import UseFetch from "../../../hooks/useFetch"
import UserPermissionList from "../../../components/primaryUser/UserPermissionList"

import { Search,  Shield,  Users } from "lucide-react"
const UserPermissions = () => {
  const [user, setUser] = useState([])
  const [cachedusers, setcachedusers] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  // const [loading, setLoading] = useState(false)
  const { data: userData, refreshHook, loading } = UseFetch("/auth/getallUsers")

  useEffect(() => {
    if (userData) {
      const { allusers } = userData
      setcachedusers(allusers)
      setUser(allusers)
    }
  }, [userData])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 500)
    return () => clearTimeout(timer)
  }, [searchQuery])
  useEffect(() => {
    if (debouncedQuery !== "") {
      const filtered = cachedusers.filter((staff) =>
        staff.name.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
      setUser(filtered)
    } else {
      setUser(cachedusers)
    }
  }, [debouncedQuery])

  const openModal = (user) => {
    setSelectedUser(user)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedUser(null)
  }

  return (
    <div className="h-full  p-2 sm:p-3 md:p-4 bg-gray-50">
      <div className="w-full h-full mx-auto ">
        <div className="bg-white h-full shadow-lg rounded-xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 sm:p-4 text-white">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                <h1 className="text-base sm:text-lg md:text-xl font-bold">
                  User Permissions
                </h1>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="p-3 bg-gray-50 border-b">
            <div className="relative max-w-md">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                className="w-full pl-9 pr-3 py-1.5 text-sm border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-sm font-semibold text-gray-600">Loading...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="flex-1 overflow-y-auto">
                <table className="min-w-full">
                  <thead className="bg-purple-100 sticky top-0 z-10">
                    <tr>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-semibold text-gray-700 border-b-2 border-purple-200">
                        No
                      </th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-semibold text-gray-700 border-b-2 border-purple-200">
                        Name
                      </th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-semibold text-gray-700 border-b-2 border-purple-200">
                        Designation
                      </th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-semibold text-gray-700 border-b-2 border-purple-200">
                        Department
                      </th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-semibold text-gray-700 border-b-2 border-purple-200">
                        Branch
                      </th>
                      <th className="px-2 sm:px-3 py-2 text-center text-xs font-semibold text-gray-700 border-b-2 border-purple-200">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {user.length > 0 ? (
                      user.map((userData, index) => (
                        <tr key={userData._id} className="hover:bg-gray-50">
                          <td className="px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-700">
                            {index + 1}
                          </td>
                          <td className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-900">
                            {userData?.name}
                          </td>
                          <td className="px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-700">
                            {userData.designation}
                          </td>
                          <td className="px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-700">
                            {userData.department?.department}
                          </td>
                          <td className="px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-700">
                            {userData?.selected
                              ?.map((branch) => branch.branchName)
                              .join(", ")}
                          </td>
                          <td className="px-2 sm:px-3 py-2 text-center">
                            <button
                              onClick={() => openModal(userData)}
                              className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xs font-medium rounded-lg shadow hover:shadow-md transition-all"
                            >
                              <Shield className="w-3 h-3" />
                              <span>Manage</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-3 py-6 text-center text-gray-500"
                        >
                          <Users className="w-10 h-10 mx-auto mb-1 opacity-50" />
                          <p className="text-sm">No users found</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/*           
          <div className="p-2 sm:p-3 bg-gray-50 border-t text-xs text-center text-gray-600">
            {user.length} user{user.length !== 1 ? "s" : ""}
          </div> */}
        </div>
      </div>

      {showModal && (
        <UserPermissionList
          user={selectedUser}
          closeModal={closeModal}
          refresh={refreshHook}
        />
      )}
    </div>
  )
}

export default UserPermissions
