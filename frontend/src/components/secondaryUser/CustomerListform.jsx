// export default CustomerListform
import React, { useState, useEffect, useRef } from "react"
import { CiEdit } from "react-icons/ci"
import { useNavigate } from "react-router-dom"
import UseFetch from "../../hooks/useFetch"
import debounce from "lodash.debounce"
import { useDispatch } from "react-redux"
import ClipLoader from "react-spinners/ClipLoader"
import { setSearch, removeSearch } from "../../../slices/search"
import useSearch from "../../hooks/useSearch"
import {
  FaUserPlus,
  FaSearch,
  FaRegFileExcel,
  FaFilePdf,
  FaPrint,
  FaHourglassHalf
} from "react-icons/fa"
import { Link } from "react-router-dom"

const CustomerListform = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  // const tableContainerRef = useRef(null) // Ref to track table container scrolling

  const [searchQuery, setSearchQuery] = useState(true)
  const [loading, setLoading] = useState(true)
  const [displayedCustomers, setDisplayedCustomers] = useState([]) // Initially displayed customers
  const [loadMoreCount, setLoadMoreCount] = useState(10)
  const [allCustomers, setAllCustomers] = useState([]) // All customers list
  const [showFullAddress, setShowFullAddress] = useState({})
  const [searchAfterData, setAfterSearchData] = useState([])
  const [stringCustomers, setStringCustomers] = useState([])
  const [user, setUser] = useState(null)
  const [branch, setBranches] = useState([])
  const [userRole, setUserRole] = useState(null)
  const {
    data: customerData,

    error
  } = UseFetch(
    user &&
      branch &&
      `/customer/getCustomer?role=${user?.role}&userBranch=${encodeURIComponent(
        branch
      )}`
  )
  console.log("hi")
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
  //custom hook is used for search
  const searchData = useSearch({ fullData: customerData })
  useEffect(() => {
    if (searchData) {
      setAfterSearchData(searchData)
    }
  }, [searchData])
  useEffect(() => {
    if (searchAfterData) {
      setLoading(false)
    }
  }, [searchAfterData])

  //Handle search with lodash debounce to optimize search performance
  const handleSearch = debounce((query) => {
    if (query.trim() === "") {
      setLoading(true)
      dispatch(removeSearch())
    } else {
      setLoading(true)
      dispatch(setSearch(query))
    }
  }, 500)
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
    <div className=" mx-auto  overflow-y-hidden  ">
      <div className="w-auto shadow-lg rounded p-8 ">
        <div className="flex justify-between items-center px-4 lg:px-6 xl:px-8 mb-4">
          <h3 className="text-2xl text-black font-bold">Customer List</h3>
          {/* Search Bar for large screens */}
          <div className="mx-4 md:block relative ">
            {/* <div className="relative">
              <FaSearch className="absolute w-4 h-4 left-2 top-3 text-gray-500" />
            </div> */}
            <input
              type="text"
              // value={searchQuery}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-full py-1 px-4 pl-10 focus:outline-none"
              placeholder="Search for..."
            />
            {loading && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ClipLoader color="#36D7B7" loading={loading} size={20} />
              </div>
            )}
          </div>
        </div>

        <hr className="border-t-2 border-gray-300 mb-3" />
        <div className="flex justify-between">
          <div className="flex flex-wrap space-x-4 mb-4">
            <Link
              to={
                user?.role === "Admin"
                  ? "/admin/masters/customerRegistration"
                  : "/staff/masters/customerRegistration"
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

            <Link
              to={`/${user?.role.toLowerCase()}/masters/pendingCustomer`}
              className="hover:bg-gray-100 text-black font-bold py-2 px-2 rounded inline-flex items-center"
            >
              <FaHourglassHalf className="mr-2" />
            </Link>
          </div>
          <label className="px-6">{searchAfterData?.length}</label>
        </div>

        <div
          // ref={tableContainerRef}
          className="overflow-y-auto max-h-96" // Fixed height for scrolling
        >
          <table className="min-w-full bg-white ">
            <thead className="bg-gray-200 sticky top-0 z-40">
              {/* Table Headers */}
              <tr>
                <th className="py-1 px-2 border-b border-gray-300 text-left">
                  S.NO
                </th>
                <th className="py-1 px-2 border-b border-gray-300 text-left">
                  Branch Name
                </th>
                <th className="py-1 px-2 border-b border-gray-300 text-left">
                  Customer Name
                </th>
                <th className="py-1 px-2 border-b border-gray-300 text-left">
                  Product Name
                </th>
                <th className="py-1 px-2 border-b border-gray-300 text-left">
                  License
                </th>
                <th className="py-1 px-2 border-b border-gray-300 text-left">
                  Address1
                </th>

                <th className="py-1 px-2 border-b border-gray-300 text-left">
                  Pin code
                </th>
                <th className="py-1 px-2 border-b border-gray-300 text-left">
                  Mobile
                </th>
                <th className="py-1 px-2 border-b border-gray-300 text-left">
                  Email
                </th>
                <th className="py-1 px-2 border-b border-gray-300 text-left">
                  Status
                </th>
                <th className="py-1 px-2 border-b border-gray-300 text-left">
                  Edit
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {searchAfterData?.length > 0 ? (
                searchAfterData?.map((customer, index) =>
                  customer.selected.map((item, itemIndex) => (
                    <tr key={item.licensenumber}>
                      <td className="px-2 py-3 text-sm text-black">
                        {/* {index + 1} */}
                        {itemIndex === 0 ? index + 1 : ""}
                      </td>
                      <td className="px-2 py-3 text-sm text-black">
                        {item?.branchName}
                      </td>
                      <td className="px-2 py-3 text-sm text-black">
                        {customer?.customerName}
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap text-sm text-black">
                        {item?.productName}
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap text-sm text-black">
                        {item?.licensenumber}
                      </td>

                      <td className="px-2 py-3 whitespace-nowrap text-sm text-black">
                        {showFullAddress[customer?._id] ? (
                          <span>
                            {customer?.address1}{" "}
                            <button
                              onClick={() => handleShowMore(customer?._id)}
                              className="text-blue-500"
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
                                className="text-blue-500"
                              >
                                ...
                              </button>
                            )}
                          </span>
                        )}
                        {/* {customer?.address1} */}
                      </td>

                      <td className="px-2 py-3 whitespace-nowrap text-sm text-black">
                        {customer?.pincode}
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap text-sm text-black">
                        {customer?.mobile}
                      </td>

                      <td className="px-2 py-3 whitespace-nowrap text-sm text-black">
                        {customer?.email}
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap text-sm text-black">
                        {item.isActive}
                      </td>
                      <td className="px-2 py-3 text-xl text-black">
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
                          className="cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))
                )
              ) : (
                <tr>
                  <td
                    colSpan="11"
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    Loading...
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

export default CustomerListform
