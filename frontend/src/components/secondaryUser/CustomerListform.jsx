import { useState, useEffect, useRef, useMemo } from "react"
import { BarLoader } from "react-spinners"
import { getLocalStorageItem } from "../../helper/localstorage"
import { CiEdit } from "react-icons/ci"
import { PropagateLoader } from "react-spinners"
import { useNavigate } from "react-router-dom"
import UseFetch from "../../hooks/useFetch"
import debounce from "lodash.debounce"
import ClipLoader from "react-spinners/ClipLoader"
import TooltipIcon from "../TooltipIcon"
import BranchDropdown from "../primaryUser/BranchDropdown"
import {
  FaUserPlus,
  FaRegFileExcel,
  FaFilePdf,
  FaPrint,
  FaHourglassHalf,
  FaExclamationTriangle
} from "react-icons/fa"
import { useSelector } from "react-redux"

const CustomerListform = () => {
  const navigate = useNavigate()
  // const tableContainerRef = useRef(null) // Ref to track table container scrolling

  const [searchTerm, setsearchTerm] = useState("")
  const [pages, setPages] = useState(1)
  // const [loading, setLoading] = useState(true)
  const [selectedstatus, setselectedStatus] = useState("All customers")
  const [tableHeight, setTableHeight] = useState("auto")
  const [statusfilteredCustomer, setstatusfilteredcustomer] = useState([])
  const [showFullAddress, setShowFullAddress] = useState({})
  const [searchAfterData, setAfterSearchData] = useState([])
  const [alldata, setalldata] = useState([])
  const [user, setUser] = useState(null)
  const [selectedBranch, setselectedBranch] = useState(null)
  const [userBranches, setuserBranches] = useState([])
  const [userRole, setUserRole] = useState(null)
  const [apiSearchTerm, setApiSearchTerm] = useState("") // only when we want API call
  const headerRef = useRef(null)
  const scrollTriggeredRef = useRef(false)
  const containerRef = useRef(null)
  const firstLoad = useRef(true)
  const hasLoadedEmpty = useRef(false)
  // const url = useMemo(() => {
  //   if (!userbranches) return null

  //   // If search term is empty and we've already loaded empty data, don't fetch again
  //   if (apiSearchTerm === "" && hasLoadedEmpty.current && !firstLoad.current) {
  //     return null
  //   }

  //   // Allow fetch if: first load OR search term is not empty OR haven't loaded empty yet
  //   if (firstLoad.current || apiSearchTerm !== "" || !hasLoadedEmpty.current) {
  //     return `/customer/getcust?limit=100&page=${pages}&search=${apiSearchTerm}&loggeduserBranches=${JSON.stringify(
  //       userbranches
  //     )}`
  //   }

  //   return null
  // }, [userbranches, apiSearchTerm, pages])
  const url = useMemo(() => {
    if (!selectedBranch) return null

    // If it's first load, always allow
    if (firstLoad.current) {
      return `/customer/getcust?limit=100&page=${pages}&search=${apiSearchTerm}&loggeduserBranches=${selectedBranch}`
    }

    // If search term is NOT empty, always allow
    if (apiSearchTerm !== "") {
      return `/customer/getcust?limit=100&page=${pages}&search=${apiSearchTerm}&loggeduserBranches=${JSON.stringify(
        selectedBranch
      )}`
    }

    // If search term IS empty and we've already loaded empty data, block it
    if (apiSearchTerm === "" && hasLoadedEmpty.current) {
      return null
    }

    // If search term is empty but we haven't loaded empty data yet, allow it
    if (apiSearchTerm === "" && !hasLoadedEmpty.current) {
      return `/customer/getcust?limit=100&page=${pages}&search=${apiSearchTerm}&loggeduserBranches=${JSON.stringify(
        selectedBranch
      )}`
    }

    return null
  }, [selectedBranch, apiSearchTerm, pages])

  const { data: list, loading: scrollLoading } = UseFetch(url)
  // const companybranches = useSelector((state) => state.companyBranch.branches)
  useEffect(() => {
    const userData = getLocalStorageItem("user")
    setselectedBranch(userData.selected[0].branch_id)
    userData.selected.forEach((branch) => {
      setuserBranches((prev) => [
        ...prev,
        {
          id: branch.branch_id,
          branchName: branch.branchName
        }
      ])
    })
    setUser(userData)

    if (userData && userData.role) {
      setUserRole(userData.role.toLowerCase())
    } else {
      setUserRole(null) // Handle case where user or role doesn't exist
    }
  }, [])

  useEffect(() => {
    // Mark that we've loaded with empty search term (only when URL is not null and search is empty)
    if (apiSearchTerm === "" && url !== null) {
      hasLoadedEmpty.current = true
    }

    // After first render, mark as loaded
    if (firstLoad.current) {
      firstLoad.current = false
    }
  }, [apiSearchTerm, url])

  // Reset the hasLoadedEmpty flag when user branches change (if needed)
  useEffect(() => {
    hasLoadedEmpty.current = false
    firstLoad.current = true
  }, [selectedBranch])
  useEffect(() => {
    if (headerRef.current) {
      const headerHeight = headerRef.current.getBoundingClientRect().height
      setTableHeight(`calc(60vh - ${headerHeight}px)`) // Subtract header height from full viewport height
    }
  }, [])
  useEffect(() => {
    setAfterSearchData([])
    setalldata([])
    setPages(1)
    hasLoadedEmpty.current = false
    firstLoad.current = true
  }, [selectedBranch])

  useEffect(() => {
    if (list && list.length > 0) {
      if (!searchTerm) {
        scrollTriggeredRef.current = false
        setAfterSearchData((prev) =>
          pages === 1 ? [...list] : [...prev, ...list]
        )
        setalldata((prev) => (pages === 1 ? [...list] : [...prev, ...list]))
      } else {
        scrollTriggeredRef.current = false
        setAfterSearchData((prev) => [...prev, ...list])
        setalldata((prev) => [...prev, ...list])
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
  const handlestatus = (e) => {
    if (e.target.value === "All customers") {
      setstatusfilteredcustomer(searchAfterData)
    } else {
      const filteredcustomer = searchAfterData.filter((customer) =>
        customer.selected.some((sel) => sel.isActive === e.target.value)
      )
      setstatusfilteredcustomer(filteredcustomer)
    }
    setselectedStatus(e.target.value)
  }
  //Handle search with lodash debounce to optimize search performance
  const handleSearch = debounce((query) => {
    const term = query.trim().toLowerCase()
    setsearchTerm(query)

    setPages(1)
    if (!query) {
      setApiSearchTerm("")
      setAfterSearchData(alldata)

      return
    }

    // 1️⃣ check locally first
    const localMatches = alldata.filter(
      (cust) =>
        cust.customerName?.toLowerCase().includes(term) ||
        cust.mobile?.toLowerCase().includes(term) ||
        cust.selected?.some((sel) =>
          sel.licensenumber?.toString().toLowerCase().includes(term)
        )
    )

    if (localMatches.length > 0) {
      setAfterSearchData(localMatches)
    } else {
      // 2️⃣ only here trigger API
      setApiSearchTerm(query) // 👈 not searchTerm
      setAfterSearchData([])
      // setalldata([])
    }
  }, 600)
  const handleBranchChange = (e) => {
    setselectedBranch(e)
  }

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
                tooltip="Product missing customer"
                to={
                  user?.role === "Admin"
                    ? "/admin/masters/pendingCustomer"
                    : "/staff/masters/pendingCustomer"
                }
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
              <BranchDropdown
                branches={userBranches}
                onBranchChange={handleBranchChange}
                branchSelected={selectedBranch}
              />
              <select
                value={selectedstatus}
                onChange={(e) => handlestatus(e)}
                className="w-40 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-700 bg-white"
              >
                <option value="All customers">All Customer</option>
                <option value="Running">Running</option>
                <option value="Deactive">Deactive</option>
              </select>
            </div>

            <div className="bg-blue-100 px-4 py-2 rounded-lg">
              <span className="text-sm font-medium text-blue-800">
                Total:{" "}
                {selectedstatus === "All customers"
                  ? searchAfterData?.length
                  : statusfilteredCustomer?.length}
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
                {(selectedstatus === "All customers"
                  ? searchAfterData
                  : statusfilteredCustomer
                )?.length > 0 ? (
                  (selectedstatus === "All customers"
                    ? searchAfterData
                    : statusfilteredCustomer
                  ).map((customer, index) =>
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
                              item.isActive === "Running"
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
                              navigate(
                                userRole === "admin"
                                  ? "/admin/masters/customerEdit"
                                  : "/staff/masters/customerEdit",
                                {
                                  state: {
                                    customer: customer,
                                    selected: item,
                                    index: itemIndex
                                  }
                                }
                              )
                            }
                            className="cursor-pointer text-blue-600 hover:text-blue-800 transition-colors text-xl"
                            title="Edit Customer"
                          />
                          {/* <div className="text-red-500 hover:text-red-700 transition-colors p-1 rounded hover:bg-red-100">
                            <DeleteAlert
                              onDelete={handleDelete}
                              Id={customer._id}
                            />
                          </div> */}
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

                {/* {(selectedstatus === "All customers" 
  ? searchAfterData 
  : statusfilteredCustomer
)?.map((customer, index) =>
  customer.selected.map((item, itemIndex) =>(
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
                              item.isActive === "Running"
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
                              navigate(
                                userRole === "admin"
                                  ? "/admin/masters/customerEdit"
                                  : "/staff/masters/customerEdit",
                                {
                                  state: {
                                    customer: customer,
                                    selected: item,
                                    index: itemIndex
                                  }
                                }
                              )
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
                )} */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerListform
