import React, { useEffect, useState } from "react"
import api from "../../../api/api"
import { formatDate } from "../../../utils/dateUtils"
import UseFetch from "../../../hooks/useFetch"
import {
  formatDistanceStrict,
  parseISO,
  differenceInDays,
  format
} from "date-fns"
import { UNSAFE_useScrollRestoration } from "react-router-dom"
// const socket = io("http://localhost:9000")
// const socket = io("https://www.crm.camet.in")

const ExpiredCustomerCalls = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [user, setUser] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [individualData, setIndividualData] = useState([])
  const [branch, setBranch] = useState([])

  const [expiredCustomerList, setexpiryRegisterList] = useState([])
  const { data: branches } = UseFetch("/branch/getBranch")
  const [isToggled, setIsToggled] = useState(false)

  const [loading, setLoading] = useState(true)
  const { data: expiryRegisterCustomer } = UseFetch(
    "/customer/getallExpiredCustomerCalls"
  )

  useEffect(() => {
    if (expiryRegisterCustomer) {
      const userData = localStorage.getItem("user")
      const user = JSON.parse(userData)
      setUser(user)
      setexpiryRegisterList(expiryRegisterCustomer)
    }
  }, [expiryRegisterCustomer])

  useEffect(() => {
    if (branches) {
      setBranch(branches)
    }
  }, [branches])

  useEffect(() => {
    const fetchExpiryRegisterList = async () => {
      try {
        const endpoint = isToggled
          ? `/customer/getallExpiryregisterCustomer?nextmonthReport=${isToggled}`
          : "/customer/getallExpiryregisterCustomer"

        const response = await api.get(endpoint)
        const data = response.data.data

        setexpiryRegisterList(data) // Update state with new data
        setLoading(false)
      } catch (error) {
        console.error("Error fetching user list:", error)
      }
    }

    fetchExpiryRegisterList()
  }, [isToggled])

  useEffect(() => {
    if (isModalOpen && selectedCustomer) {
      const selectedCustomerData = expiredCustomerList.find(
        (customer) => customer._id === selectedCustomer
      )
      setIndividualData(selectedCustomerData)
    }
  }, [isModalOpen, selectedCustomer])

  const handleChange = (event) => {
    const selected = event.target.value
    if (selected === "All") {
      setSelectedBranch("All")
    } else {
      const branchDetails = branch.find((item) => item._id === selected)
      setSelectedBranch(branchDetails ? branchDetails.branchName : "All")
    }
  }

  const toggle = () => {
    setexpiryRegisterList([])
    setLoading(true)
    setIsToggled(!isToggled)
  }
  console.log("loadinggggg", loading)

  const openModal = (id) => {
    setSelectedCustomer(id)

    setIsModalOpen(true)
  }

  const closeModal = () => {
    setLoading(true)
    setIsModalOpen(false)
    setSelectedCustomer(null)
  }

  const calculateRemainingDays = (expiryDate) => {
    if (!expiryDate) return "N/A"
    const expiry = parseISO(expiryDate) // Parse the expiry date
    const today = new Date() // Get current date
    const totalDays = differenceInDays(expiry, today) // Calculate total days difference

    if (totalDays <= 0) return "Expired" // If the date is past or today

    const months = Math.floor(totalDays / 30) // Approximate months by dividing by 30
    const days = totalDays % 30 // Remaining days after months

    let result = ""
    if (months > 0) result += `${months} month${months > 1 ? "s" : ""} `
    if (days > 0) result += `${days} day${days > 1 ? "s" : ""}`

    return result.trim()
  }
  return (
    <div className="antialiased font-sans container mx-auto px-4 sm:px-8">
      <div className="py-4 ">
        <div className="flex justify-center text-2xl font-semibold ">
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-600">
            {isToggled
              ? "Upcoming Month Expired Customer's"
              : "Expired Customer's"}
          </h1>
        </div>
        <h2 className="text-xl font-semibold leading-tight">Branches</h2>

        <div className="my-2 flex sm:flex-row flex-col">
          <div className="flex flex-row mb-1 sm:mb-0">
            <div className="relative">
              <select
                onChange={handleChange}
                className="h-full rounded-r border-t sm:rounded-r-none sm:border-r-0 border-r border-b block appearance-none w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-gray-500"
              >
                <option value="All">All</option>
                {branches?.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.branchName}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="block relative">
            <input
              placeholder="Search"
              className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
            />
          </div>

          <div className="flex justify-end flex-grow">
            <span className="text-gray-600 mr-4 font-bold">
              Next Month Expiry
            </span>
            <button
              onClick={toggle}
              className={`${
                isToggled ? "bg-green-500" : "bg-gray-300"
              } w-14 h-6 flex items-center rounded-full p-0 transition-colors duration-300`}
            >
              <div
                className={`${
                  isToggled ? "translate-x-8" : "translate-x-0"
                } w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300`}
              ></div>
            </button>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="text-blue-700">
            {/* {customerSummary.length} Total Customers */}
            {`Total Customer-${expiredCustomerList.length}`}
          </div>
        </div>
        <div className="w-full mx-auto shadow-lg mt-6">
          <div className="inline-block w-full mx-auto shadow rounded-lg overflow-x-auto lg:max-h-[440px] overflow-y-auto md:max-h-[390px]">
            <table className="min-w-full leading-normal text-left max-w-7xl mx-auto table-fixed">
              <thead className="sticky top-0 z-30 bg-purple-300">
                <tr>
                  <th className="w-1/12 px-5 py-3 border-b-2 border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                    Customer Name
                  </th>
                  <th className="w-1/12 px-5 py-3 border-b-2 border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                    Mobile/Phn
                  </th>
                  <th className="w-1/12 px-5 py-3 border-b-2 border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                    Product Name
                  </th>
                  <th className="w-1/12 px-5 py-3 border-b-2 border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                    License No
                  </th>
                  <th className="w-1/12 px-5 py-3 border-b-2 border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                    Amc Start
                    <br />
                    (D-M-Y)
                  </th>
                  <th className="w-1/12 px-5 py-3 border-b-2 border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                    Amc End
                    <br />
                    (D-M-Y)
                  </th>
                  <th className="w-1/12 px-5 py-3 border-b-2 border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                    Tuv Expiry
                    <br />
                    (D-M-Y)
                  </th>
                  <th className="w-1/12 px-5 py-3 border-b-2 border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                    License Expiry
                    <br />
                    (D-M-Y)
                  </th>
                  <th className="w-1/12 px-5 py-3 border-b-2 border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                    Status
                  </th>
                  <th className="w-1/12 px-5 py-3 border-b-2 border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                    View
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(expiredCustomerList) &&
                  (expiredCustomerList.length > 0 ? (
                    expiredCustomerList.map((customer) =>
                      Array.isArray(customer.selected) &&
                      customer.selected.length > 0 ? (
                        customer.selected.map((item) => (
                          <tr key={`${customer._id}-${item._id}`}>
                            {/* Customer data */}
                            <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm text-center">
                              {customer?.customerName || "N/A"}
                            </td>
                            <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm text-center">
                              {customer?.mobile || "N/A"}
                            </td>
                            <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm text-center">
                              {customer?.isActive || "N/A"}
                            </td>
                            {/* Selected item data */}
                            <td className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm">
                              {item?.licensenumber || "N/A"}
                            </td>
                            <td className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm">
                              {new Date(item?.amcstartDate).toLocaleDateString(
                                "en-GB",
                                {
                                  timeZone: "UTC",
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric"
                                }
                              )}
                            </td>
                            <td className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm">
                              {new Date(item?.amcendDate).toLocaleDateString(
                                "en-GB",
                                {
                                  timeZone: "UTC",
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric"
                                }
                              )}
                            </td>
                            <td className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm">
                              {item?.licenseExpiryDate
                                ? new Date(
                                    item?.licenseExpiryDate
                                  ).toLocaleDateString()
                                : "N/A"}
                            </td>
                            <td className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm">
                              {item?.tvuexpiryDate
                                ? new Date(
                                    item?.tvuexpiryDate
                                  ).toLocaleDateString()
                                : "N/A"}
                            </td>
                            <td className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm">
                              {customer?.isActive || "N/A"}
                            </td>
                            <td className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm">
                              <button
                                onClick={() => openModal(customer?._id)}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr key={customer?._id}>
                          <td
                            colSpan="8"
                            className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm"
                          >
                            No Products Selected
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td colSpan="11" className="text-center py-4">
                        {loading ? "Loading..." : "No expired customers"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 h-screen">
          <div className="container mx-auto  p-8  h-screen">
            <div className="w-auto  bg-white shadow-lg rounded p-8  h-full flex-col ">
              <div className="flex justify-center text-2xl font-semibold ">
                <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-600">
                  Expired Customer
                </h1>
              </div>

              {/* <Tiles datas={registeredcalllist?.alltokens} /> */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 m-5 bg-[#4888b9] shadow-md rounded p-5">
                <div className="">
                  <h4 className="text-md font-bold text-white">
                    Customer Name
                  </h4>
                  <p className="text-white">{individualData.customerName}</p>
                </div>
                <div className="">
                  <h4 className="text-md font-bold text-white">Email</h4>
                  <p className="text-white">{individualData.email}</p>
                </div>
                <div className="">
                  <h4 className="text-md font-bold text-white">Mobile</h4>
                  <p className="text-white">{individualData.mobile}</p>
                </div>
                <div className=" ">
                  <h4 className="text-md font-bold text-white">Address 1</h4>
                  <p className="text-white">{individualData.address1}</p>
                </div>
                <div className="">
                  <h4 className="text-md font-bold text-white">Address 2</h4>
                  <p className="text-white">{individualData.address2}</p>
                </div>
                <div className="">
                  <h4 className="text-md font-bold text-white">City</h4>
                  <p className="text-white">{individualData.city}</p>
                </div>
                <div className="">
                  <h4 className="text-md font-bold text-white">State</h4>
                  <p className="text-white">{individualData.state}</p>
                </div>
                <div className=" ">
                  <h4 className="text-md font-bold text-white">Country</h4>
                  <p className="text-white">{individualData.country}</p>
                </div>
                <div className="">
                  <h4 className="text-md font-bold text-white">Pincode</h4>
                  <p className="text-white">{individualData.pincode}</p>
                </div>
                <div className="">
                  <h4 className="text-md font-bold text-white">Landline</h4>
                  <p className="text-white">
                    {individualData.landline || "N/A"}
                  </p>
                </div>
                <div className="">
                  <h4 className="text-md font-bold text-white">Status</h4>
                  <p
                    className={` ${
                      individualData.isActive
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {individualData.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>

              <div className="mt-6 w-lg ">
                <div className="mb-2 ml-5">
                  <h3 className="text-lg font-medium text-gray-900">
                    Product Details List
                  </h3>
                  {/* <button onClick={fetchData}>update</button>c */}
                </div>
                <div className="m-5 w-lg max-h-30 overflow-x-auto text-center overflow-y-auto">
                  <table className=" m-w-full divide-y divide-gray-200 shadow">
                    <thead className="sticky  top-0 z-30 bg-green-300">
                      <tr>
                        <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
                          NO.
                        </th>
                        <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product Name
                        </th>
                        <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Installed Date
                        </th>
                        <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
                          License No
                        </th>
                        <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
                          License expiry
                        </th>
                        <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
                          License Remaing
                        </th>

                        <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amc startDate <br /> (D-M-Y)
                        </th>
                        <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amc endDate <br /> (D-M-Y)
                        </th>
                        <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amc Remaining
                        </th>

                        <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tvu expiry
                        </th>
                        <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tvu Remaining
                        </th>
                        <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
                          No.of Users
                        </th>
                        <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Version
                        </th>

                        {user.role === "Admin" && (
                          <>
                            <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Company Name
                            </th>
                            <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Branch Name
                            </th>
                            <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Product Amount
                            </th>
                            <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tvu Amount
                            </th>
                            <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amc Amount
                            </th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {individualData?.selected?.map((product, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {index + 1}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {product?.productName}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(product?.customerAddDate)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {product?.licensenumber}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(product?.licenseExpiryDate)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {product?.licenseExpiryDate
                              ? calculateRemainingDays(
                                  product?.licenseExpiryDate
                                )
                              : ""}
                          </td>

                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(product?.amcstartDate)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(product?.amcendDate)}
                          </td>

                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {calculateRemainingDays(product?.amcendDate)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {product?.tvuexpiryDate}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {product?.tvuexpiryDate
                              ? formatDate(product?.tvuexpiryDate)
                              : ""}
                          </td>

                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {product?.noofusers}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {product?.version}
                          </td>
                          {user.role === "Admin" && (
                            <>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {product?.companyName}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {product?.branchName}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {product?.productAmount}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {product?.tvuAmount}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {product?.amcAmount}
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex justify-center items-center ">
                <button
                  className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 px-4 py-2 text-white rounded-lg  hover:from-purple-500 hover:via-pink-500 hover:to-red-500"
                  onClick={closeModal}
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExpiredCustomerCalls
