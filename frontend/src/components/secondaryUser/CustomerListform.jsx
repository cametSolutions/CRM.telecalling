import { useState, useEffect, useRef } from "react"
import { BarLoader } from "react-spinners"
import { CiEdit } from "react-icons/ci"
import { PropagateLoader } from "react-spinners"
import { useNavigate } from "react-router-dom"
import UseFetch from "../../hooks/useFetch"
import debounce from "lodash.debounce"
import ClipLoader from "react-spinners/ClipLoader"
import TooltipIcon from "../TooltipIcon"
import {
  FaUserPlus,
  FaRegFileExcel,
  FaFilePdf,
  FaPrint,
  FaHourglassHalf,
  FaExclamationTriangle
} from "react-icons/fa"
import { Link } from "react-router-dom"

const CustomerListform = () => {
  const navigate = useNavigate()
  // const tableContainerRef = useRef(null) // Ref to track table container scrolling
  const scrollTriggeredRef = useRef(false)
  const [searchQuery, setSearchQuery] = useState(true)
  const [searchTerm, setsearchTerm] = useState("")
  const [pages, setPages] = useState(1)
  // const [loading, setLoading] = useState(true)
  const [tableHeight, setTableHeight] = useState("auto")
  const [showFullAddress, setShowFullAddress] = useState({})
  const [searchAfterData, setAfterSearchData] = useState([])
  const [user, setUser] = useState(null)
  const [branch, setBranches] = useState([])
  const [userRole, setUserRole] = useState(null)
  const headerRef = useRef(null)
  const containerRef = useRef(null)
  const { data: list, loading: scrollLoading } = UseFetch(
    `/customer/getcust?limit=100&page=${pages}&search=${searchTerm}`
  )
  useEffect(() => {
    if (headerRef.current) {
      const headerHeight = headerRef.current.getBoundingClientRect().height
      setTableHeight(`calc(60vh - ${headerHeight}px)`) // Subtract header height from full viewport height
    }
  }, [])
  useEffect(() => {
    const userData = localStorage.getItem("user")
    const user = JSON.parse(userData)
    setUser(user)
    if (user.role !== "Admin") {
      const branch = user.selected.map((branch) => branch.branch_id)
      const branches = JSON.stringify(branch)

      setBranches(branches)
    }
    if (user && user.role) {
      setUserRole(user.role.toLowerCase())
    } else {
      setUserRole(null) // Handle case where user or role doesn't exist
    }
  }, [])
  useEffect(() => {
    if (list) {
      if (!searchTerm) {
        scrollTriggeredRef.current = false

        setAfterSearchData((prev) => [...prev, ...list])
      } else {
        scrollTriggeredRef.current = false
        setAfterSearchData((prev) => [...prev, ...list])
      }
    }
  }, [list])

  const handleScroll = () => {
    const container = containerRef.current

    if (!container) return false

    const { clientHeight, scrollHeight, scrollTop } = container
    const totalScrollableDistance = scrollHeight - clientHeight

    // Calculate current scroll position as percentage
    const scrollPercentage = (scrollTop / totalScrollableDistance) * 100

    // Trigger when scroll reaches 80%
    if (scrollPercentage >= 90 && !scrollTriggeredRef.current) {
      scrollTriggeredRef.current = true

      setPages((prev) => prev + 1)
    }
  }
  //Handle search with lodash debounce to optimize search performance
  const handleSearch = debounce((query) => {
    if (query.trim() === "") {
      setsearchTerm(query)
      setPages(1)
      setAfterSearchData([])
    } else {
      setsearchTerm(query)
      setAfterSearchData([])
      setPages(1)
    }
  }, 1000)
  const handleChange = (e) => handleSearch(e.target.value)

  // Function to toggle showing full address
  const handleShowMore = (customerId) => {
    setShowFullAddress((prevState) => ({
      ...prevState,
      [customerId]: !prevState[customerId] // Toggle the state for the specific customer
    }))
  }

  const truncateAddress = (address) => {
    const maxLength = 20 // Define how many characters to show before truncating
    return address?.length > maxLength
      ? `${address?.slice(0, maxLength)}...`
      : address
  }
  return (
   
    <div className="h-full overflow-hidden">
      {scrollLoading && (
        <BarLoader
          cssOverride={{ width: "100%", height: "4px" }}
          color="#4A90E2"
        />
      )}

      <div className="w-full shadow-lg rounded p-8 h-full flex flex-col">
        {/* Sticky Header Section */}
        <div className="flex-shrink-0 bg-white">
          {/* Title and Search Bar */}
          <div className="flex justify-between items-center px-4 lg:px-6 xl:px-8 mb-4">
            <h3 className="text-2xl text-black font-bold">Customer List</h3>

            {/* Search Bar */}
            <div className="mx-4 relative flex-1 max-w-md">
              <input
                type="text"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search for..."
              />
              {scrollLoading && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ClipLoader
                    color="#36D7B7"
                    loading={scrollLoading}
                    size={20}
                  />
                </div>
              )}
            </div>
          </div>

          <hr className="border-t-2 border-gray-300 mb-4" />

          {/* Action Buttons and Counter */}
          <div className="flex justify-between items-center px-4 lg:px-6 xl:px-8 mb-4">
            <div className="flex flex-wrap gap-2">
              <TooltipIcon
                icon={FaUserPlus}
                tooltip="Add Customer"
                to={
                  user?.role === "Admin"
                    ? "/admin/masters/customerRegistration"
                    : "/staff/masters/customerRegistration"
                }
              />

              <TooltipIcon
                icon={FaRegFileExcel}
                tooltip="Excel Download"
                button
              />

              <TooltipIcon icon={FaFilePdf} tooltip="PDF Download" button />

              <TooltipIcon icon={FaPrint} tooltip="Print" button />

              <TooltipIcon
                icon={FaHourglassHalf}
                tooltip="Pending Customer"
                to={user?.role==="Admin"?"/admin/masters/pendingCustomer":"/staff/masters/pendingCustomer"}
              />

              <TooltipIcon
                icon={FaExclamationTriangle}
                tooltip="Product details missing customer"
                to={
                  user?.role === "Admin"
                    ? "/admin/masters/productmissingCustomer"
                    : "/staff/masters/productmissingCustomer"
                }
                className="text-red-500"
              />

             
            </div>

            <div className="bg-blue-100 px-4 py-2 rounded-lg">
              <span className="text-sm font-medium text-blue-800">
                Total: {searchAfterData?.length || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Table Section */}
        <div className="flex-1 overflow-hidden">
          <div
            onScroll={handleScroll}
            ref={containerRef}
            className="h-full overflow-y-auto overflow-x-auto rounded-lg border border-gray-200"
          >
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="py-3 px-4 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    S.NO
                  </th>
                  <th className="py-3 px-4 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Branch Name
                  </th>
                  <th className="py-3 px-4 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Name
                  </th>
                  <th className="py-3 px-4 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="py-3 px-4 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    License
                  </th>
                  <th className="py-3 px-4 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="py-3 px-4 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pin Code
                  </th>
                  <th className="py-3 px-4 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mobile
                  </th>
                  <th className="py-3 px-4 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="py-3 px-4 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-4 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {searchAfterData?.length > 0 ? (
                  searchAfterData?.map((customer, index) =>
                    customer.selected.map((item, itemIndex) => (
                      <tr
                        key={`${customer._id}-${item.licensenumber}-${itemIndex}`}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {itemIndex === 0 ? index + 1 : ""}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {item?.branchName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                          {customer?.customerName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {item?.productName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-mono">
                          {item?.licensenumber}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 max-w-xs">
                          {showFullAddress[customer?._id] ? (
                            <span>
                              {customer?.address1}{" "}
                              <button
                                onClick={() => handleShowMore(customer?._id)}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                              >
                                Show less
                              </button>
                            </span>
                          ) : (
                            <span>
                              {truncateAddress(customer?.address1)}{" "}
                              {customer?.address1?.length > 20 && (
                                <button
                                  onClick={() => handleShowMore(customer?._id)}
                                  className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                  ...more
                                </button>
                              )}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {customer?.pincode}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {customer?.mobile}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {customer?.email}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              item.isActive === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.isActive}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <CiEdit
                            onClick={() =>
                              navigate(`/${userRole}/masters/customerEdit`, {
                                state: {
                                  customer: customer,
                                  selected: item,
                                  index: itemIndex
                                }
                              })
                            }
                            className="cursor-pointer text-blue-600 hover:text-blue-800 transition-colors text-xl"
                            title="Edit Customer"
                          />
                        </td>
                      </tr>
                    ))
                  )
                ) : (
                  <tr>
                    <td
                      colSpan="11"
                      className="px-4 py-12 text-center text-gray-500"
                    >
                      {scrollLoading ? (
                        <div className="flex justify-center">
                          <PropagateLoader color="#3b82f6" size={10} />
                        </div>
                      ) : (
                        <div className="text-lg">No Data Found</div>
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

export default CustomerListform
