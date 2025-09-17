import { useState, useEffect } from "react"
import DeleteAlert from "../common/DeleteAlert"
import { CiEdit } from "react-icons/ci"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"
import api from "../../api/api"
import { FaSearch } from "react-icons/fa"

import UseFetch from "../../hooks/useFetch"

const WithoutProductdetailscustomer = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [showFullText, setShowFullText] = useState({})
  const [filteredCustomer, setFilteredCustomer] = useState([])
  const [userRole, setUserRole] = useState(null)
  const [loggeduserbranch, setloggeduserbranch] = useState(null)
  // const { data: productmissingCustomerData, loading } = UseFetch(
  //   loggeduserbranch &&
  //     `/customer/getproductmissingCustomer?branchselected=${loggeduserbranch}`
  // )
  const { data: productmissingCustomerData, loading } = UseFetch(
    loggeduserbranch &&
      `/customer/getproductmissingCustomer?${loggeduserbranch
        .map((id) => `branchselected=${encodeURIComponent(id)}`)
        .join("&")}`
  )
  useEffect(() => {
    if (productmissingCustomerData) {
      setFilteredCustomer(productmissingCustomerData)
    }
  }, [productmissingCustomerData])

  const companybranches = useSelector((state) => state.companyBranch.branches)

  useEffect(() => {
    const user = localStorage.getItem("user")
    const parseuser = JSON.parse(user)
    if (parseuser.role === "Admin") {
      if (parseuser?.selected) {
        setloggeduserbranch(parseuser.selected.map((element) => element._id))
      } else {
        setloggeduserbranch(companybranches.map((element) => element._id))
      }
    } else if (parseuser.role === "Staff") {
      setloggeduserbranch(parseuser.selected.map((element) => element._id))
    }
  }, [])

  useEffect(() => {
    if (productmissingCustomerData) {
      const userData = localStorage.getItem("user")
      const user = JSON.parse(userData)
      setFilteredCustomer(productmissingCustomerData)

      if (user && user.role) {
        setUserRole(user.role)
      }
    }
  }, [productmissingCustomerData])
  const toggleShowMore = (key) => {
    setShowFullText((prev) => ({
      ...prev,
      [key]: !prev[key]
    }))
  }
  const handleDelete = async (id) => {
    try {
      await api.delete(`/customer/deleteCustomer/?id=${id}`, {
        withCredentials: true
      })

      // Update the state to remove the deleted brand

      setFilteredCustomer((prevItems) =>
        prevItems.filter((item) => item._id !== id)
      )
      toast.success("Customer deleted successfully!")
    } catch (error) {
      console.error("Error deleting Customer:", error)
      toast.error("Failed to delete brand")
    }
  }
  return (
    <div className="container mx-auto h-full py-5 bg-gray-100">
      <div className="w-auto bg-white shadow-lg rounded p-5 h-full mx-8 flex flex-col">
        {/* Sticky Header Section */}
        <div className="flex-shrink-0 bg-white sticky top-0 z-20">
          {/* Title and Search Bar */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl text-black font-bold">
              Productmissing Customer List
            </h3>

            {/* Search Bar */}
            <div className="flex ">
              {" "}
              <div className="mx-4 relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaSearch className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search for..."
                />
              </div>
              <div className="flex justify-end items-center">
                <div className="bg-blue-100 px-4 py-2 rounded-lg">
                  <span className="text-sm font-medium text-blue-800">
                    Count: {filteredCustomer?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-t-2 border-gray-300 mb-4" />
        </div>

        {/* Scrollable Table Section */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto overflow-x-auto rounded-lg border border-gray-200 shadow-inner">
            <table className="min-w-full bg-white">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10 border-b-2 border-gray-200">
                <tr>
                  <th className="py-4 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Customer Name
                    </div>
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Address 1
                    </div>
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      Address 2
                    </div>
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      City
                    </div>
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    Pin Code
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      Mobile
                    </div>
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      Telephone
                    </div>
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      Email
                    </div>
                  </th>
                  <th className="py-4 px-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center justify-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                        />
                      </svg>
                      Actions
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {!loading && filteredCustomer?.length > 0 ? (
                  filteredCustomer.map((customer, index) => (
                    <tr
                      key={customer._id}
                      className={`hover:bg-blue-50 transition-all duration-200 ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="px-4 py-4 text-sm text-gray-900 font-medium border-r border-gray-100">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">
                            {customer.customerName?.charAt(0)?.toUpperCase()}
                          </div>
                          {customer.customerName}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 max-w-xs border-r border-gray-100">
                        {showFullText[`${customer._id}_address1`] ? (
                          <div className="leading-relaxed">
                            {customer.address1}
                            {customer.address1?.length > 30 && (
                              <button
                                onClick={() =>
                                  toggleShowMore(`${customer._id}_address1`)
                                }
                                className="ml-2 text-blue-600 hover:text-blue-800 font-medium text-xs bg-blue-100 px-2 py-1 rounded-full transition-colors"
                              >
                                ▲ Less
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="leading-relaxed">
                            {customer.address1?.length > 30
                              ? `${customer.address1.substring(0, 30)}...`
                              : customer.address1}
                            {customer.address1?.length > 30 && (
                              <button
                                onClick={() =>
                                  toggleShowMore(`${customer._id}_address1`)
                                }
                                className="ml-2 text-blue-600 hover:text-blue-800 font-medium text-xs bg-blue-100 px-2 py-1 rounded-full transition-colors"
                              >
                                ▼ More
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 max-w-xs border-r border-gray-100">
                        {showFullText[`${customer._id}_address2`] ? (
                          <div className="leading-relaxed">
                            {customer.address2}
                            {customer.address2?.length > 30 && (
                              <button
                                onClick={() =>
                                  toggleShowMore(`${customer._id}_address2`)
                                }
                                className="ml-2 text-blue-600 hover:text-blue-800 font-medium text-xs bg-blue-100 px-2 py-1 rounded-full transition-colors"
                              >
                                ▲ Less
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="leading-relaxed">
                            {customer.address2?.length > 30
                              ? `${customer.address2.substring(0, 30)}...`
                              : customer.address2}
                            {customer.address2?.length > 30 && (
                              <button
                                onClick={() =>
                                  toggleShowMore(`${customer._id}_address2`)
                                }
                                className="ml-2 text-blue-600 hover:text-blue-800 font-medium text-xs bg-blue-100 px-2 py-1 rounded-full transition-colors"
                              >
                                ▼ More
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 border-r border-gray-100">
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-2 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                          {customer.city}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 border-r border-gray-100">
                        <span className="bg-gray-100 px-2 py-1 rounded-md font-mono text-xs">
                          {customer.pincode}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 border-r border-gray-100">
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-2 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          <span className="font-mono">{customer.mobile}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 border-r border-gray-100">
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-2 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          <span className="font-mono">{customer.landline}</span>
                        </div>
                      </td>

                      {/* <td className="px-4 py-3 text-sm text-gray-900">
                        {customer.landline}
                      </td> */}
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {showFullText[`${customer._id}_email`] ? (
                          <div>
                            {customer.email}
                            {customer.email?.length > 25 && (
                              <button
                                onClick={() =>
                                  toggleShowMore(`${customer._id}_email`)
                                }
                                className="ml-2 text-blue-600 hover:text-blue-800 font-medium text-xs"
                              >
                                Show less
                              </button>
                            )}
                          </div>
                        ) : (
                          <div>
                            {customer.email?.length > 25
                              ? `${customer.email.substring(0, 25)}...`
                              : customer.email}
                            {customer.email?.length > 25 && (
                              <button
                                onClick={() =>
                                  toggleShowMore(`${customer._id}_email`)
                                }
                                className="ml-2 text-blue-600 hover:text-blue-800 font-medium text-xs"
                              >
                                more
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          {/* Edit Button */}
                          <button
                            onClick={() =>
                              navigate(
                                userRole === "Admin" && "Manager"
                                  ? "/admin/masters/customerEdit"
                                  : "/staff/masters/customerEdit",
                                {
                                  state: {
                                    customer: customer
                                  }
                                }
                              )
                            }
                            className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-100"
                            title="Edit Customer"
                          >
                            <CiEdit className="text-xl" />
                          </button>

                          {/* Delete Button */}
                          <div className="text-red-500 hover:text-red-700 transition-colors p-1 rounded hover:bg-red-100">
                            <DeleteAlert
                              onDelete={handleDelete}
                              Id={customer._id}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-4 py-16 text-center">
                      {loading ? (
                        // Loading State - when UseFetch is still fetching data
                        <div className="flex flex-col items-center justify-center py-12">
                          <div className="relative">
                            {/* Animated spinner */}
                            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                            <div
                              className="w-12 h-12 border-4 border-transparent border-t-purple-500 rounded-full animate-spin absolute top-2 left-2"
                              style={{
                                animationDirection: "reverse",
                                animationDuration: "1.5s"
                              }}
                            ></div>
                          </div>
                          <div className="mt-6 text-center">
                            <div className="flex items-center justify-center space-x-1">
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Search results but no matches
                        <div className="flex flex-col items-center justify-center py-12">
                          <div className="mb-6">
                            <svg
                              className="w-20 h-20 text-gray-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                              />
                            </svg>
                          </div>
                          <h3 className="text-lg font-medium text-gray-700 mb-2">
                            No Results Found
                          </h3>
                          <p className="text-gray-500 text-center max-w-sm mb-4">
                            We couldn't find any pending customers matching "
                            <span className="font-medium">{searchQuery}</span>".
                            Try adjusting your search terms.
                          </p>
                          <button
                            onClick={() => setSearchQuery("")}
                            className="inline-flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 font-medium border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            Clear Search
                          </button>
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

export default WithoutProductdetailscustomer
