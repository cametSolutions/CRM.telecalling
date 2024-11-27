import React, { useState, useEffect, useRef, useCallback } from "react"

import { flushSync } from "react-dom"
import ClipLoader from "react-spinners/ClipLoader"

import { formatDate } from "../../../utils/dateUtils"
import { useForm } from "react-hook-form"
import {
  formatDistanceStrict,
  parseISO,
  differenceInDays,
  format
} from "date-fns"
import api from "../../../api/api"
import { formatTime } from "../../../utils/timeUtils"
// import debounce from "lodash.debounce"
import { debounce } from "lodash"
import UseFetch from "../../../hooks/useFetch"
import Timer from "../../../components/primaryUser/Timer"
import { toast } from "react-toastify"

export default function AccountSearch() {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    reset,
    formState: { errors }
  } = useForm()

  const [customerData, setCustomerData] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [productDetails, setProductDetails] = useState([])
  const [user, setUser] = useState(false)
  const [searching, setSearching] = useState(false)
  const [search, setSearch] = useState("")
  const [branches, setBranches] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [selectedProducts, setSelectedProducts] = useState([])

  // useRef to keep track of the latest timeout for debouncing
  const debounceTimeoutRef = useRef(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    const user = JSON.parse(userData)

    if (user.role !== "Admin") {
      const branches = user.selected.map((branch) => branch.branch_id)
      setBranches(branches)
    }

    setUser(user)
  }, [])

  useEffect(() => {
    // Set the default product if there's only one
    if (productDetails.length === 1) {
      setSelectedProducts(productDetails[0])
    }
  }, [productDetails])

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

  function timeStringToSeconds(timeString) {
    const [hours, minutes, seconds] = timeString.split(":").map(Number)
    return hours * 3600 + minutes * 60 + seconds
  }

  const formatDateTime = (date) => {
    const year = date.getFullYear()

    const month = date.toLocaleString("default", { month: "long" })

    const day = String(date.getDate()).padStart(2, "0")

    const hours = String(date.getHours()).padStart(2, "0")

    const minutes = String(date.getMinutes()).padStart(2, "0")

    const seconds = String(date.getSeconds()).padStart(2, "0")

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  // const fetchCustomerData = useCallback(
  //   debounce(async (query) => {
  //     const url = `http://localhost:9000/api/customer/getCustomer?search=${encodeURIComponent(
  //       query
  //     )}`
  //     // const url = `https://www.crm.camet.in/api/customer/getCustomer?search=${encodeURIComponent(
  //     //   query
  //     // )}`

  //     try {
  //       const response = await fetch(url, {
  //         method: "GET",
  //         credentials: "include"
  //       })

  //       if (response.ok) {
  //         const result = await response.json()
  //         setMessage("")
  //         setCustomerData(result.data)
  //         setSearching(true)
  //       } else {
  //         const errorData = await response.json()
  //         setCustomerData(errorData.data)
  //         setMessage(errorData.message)
  //         console.error("Error fetching customer data:", errorData.message)
  //       }
  //     } catch (error) {
  //       console.error("Error fetching customer data:", error.message)
  //     } finally {
  //       setloading(false)
  //       // setSearching(false)
  //     }
  //   }, 300),
  //   [] // The empty dependency array ensures that debounce is created only once
  // )
  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) {
      return "0 hr 0 min 0 sec"
    }
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs} hr ${mins} min ${secs} sec`
  }

  const handleInputChange = debounce(async (value) => {
    try {
      if (value === "") {
        setCustomerData([])
        setMessage("")
        setSearch("")
        return
      }
      setLoading(true)
      setSearch(value)
      setMessage("")
      setSearching(true)

      if (value) {
        // const customerdata = await api.get(
        //   `/customer/getCustomer?search=${value}&userBranch=${branches}`
        // )

        const branch = JSON.stringify(branches)
        // const url = `http://localhost:9000/api/customer/getCustomer?search=${value}&role=${
        //   user.role
        // }&userBranch=${encodeURIComponent(branch)}`
        const url = `https://www.crm.camet.in/api/customer/getCustomer?search=${value}&role=${
          user.role
        }&userBranch=${encodeURIComponent(branch)}`

        const customerdata = await api.get(url)

        const { data } = customerdata.data

        if (Array.isArray(data) && data.length === 0) {
          setLoading(false)
          setCustomerData(data)
          setMessage("No customers found")
        } else {
          setLoading(false)
          setCustomerData(data)
        }
      }
    } catch (error) {
      console.error("Error fetching customer data:", error)
      setLoading(false)
    }

    // Add your logic here
  }, 1000)
  const handleChange = (e) => handleInputChange(e.target.value)
  const handleRowClick = (customer) => {
    setSelectedCustomer(customer)
    setSearch(customer.customerName)
    setProductDetails(customer.selected)
    setSearching(false)

    // Additional actions can be performed here (e.g., populate form fields)
  }

  const onSubmit = async (data) => {
    if (selectedProducts && selectedProducts.length === 0) {
      // alert("please select aprodut")
      toast.error("Please select a product", {
        position: "top-center",
        autoClose: 3000 // 3 seconds
      })
      return
    } else {
      setIsRunning(false)
    }

    // let updatedData = { ...data }
    setFormData(data)
  }

  return (
    <div className="container min-h-screen justify-center items-center p-8 bg-gray-100">
      {/* <div className="flex justify-between ">
          <h2 className="text-2xl font-semibold mb-4">Call Registration</h2>
          <div>
            <Link
              to={user?.role === "Admin" ? "/admin/home" : "/staff/home"}
              className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 px-2 py-1 rounded-md shadow-lg cursor-pointer"
            >
              Go Home
            </Link>
          </div>
        </div> */}

      {/* <hr className="border-t-2 border-gray-300 mb-4"></hr> */}
      <div className="w-1/4 ml-5">
        <div className="relative">
          <label
            htmlFor="customerName"
            className="block text-sm font-medium text-gray-700"
          >
            Search Customer
          </label>
          <div className="relative">
            <input
              type="text"
              id="customerName"
              // value={search}

              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 pr-10 sm:text-sm focus:border-gray-500 outline-none"
              placeholder="Enter name or license..."
            />
            {loading && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ClipLoader color="#36D7B7" loading={loading} size={20} />
              </div>
            )}
          </div>
        </div>
      </div>

      {searching && customerData && customerData.length > 0 ? (
        <div className="ml-5 w-1/4 max-h-40 overflow-y-auto overflow-x-auto  mt-4 border border-gray-200 shadow-md rounded-lg">
          {/* Wrap the table in a div with border */}
          <table className="min-w-full bg-white">
            <thead className="sticky top-0 z-30 bg-green-300 border-b border-green-300 shadow">
              {/* Add a bottom border to the <thead> */}
              <tr>
                <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  License
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Mobile No
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customerData?.map((customer, index) =>
                customer.selected.map((item, subIndex) => (
                  <tr
                    key={`${index}-${subIndex}`} // Ensure unique key for each row
                    onClick={() => handleRowClick(customer)}
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-center text-sm text-gray-700">
                      {customer?.customerName}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700">
                      {item?.licensenumber}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700">
                      {customer?.mobile}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-red-500 ml-5">{message}</div>
      )}

      {selectedCustomer && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 m-5 bg-[#4888b9] shadow-md rounded p-5">
            <div className="">
              <h4 className="text-md font-bold text-white">Customer Name</h4>
              <p className="text-white">{selectedCustomer.customerName}</p>
            </div>
            <div className="">
              <h4 className="text-md font-bold text-white">Email</h4>
              <p className="text-white">{selectedCustomer.email}</p>
            </div>
            <div className="">
              <h4 className="text-md font-bold text-white">Mobile</h4>
              <p className="text-white">{selectedCustomer.mobile}</p>
            </div>
            <div className=" ">
              <h4 className="text-md font-bold text-white">Address 1</h4>
              <p className="text-white">{selectedCustomer.address1}</p>
            </div>
            <div className="">
              <h4 className="text-md font-bold text-white">Address 2</h4>
              <p className="text-white">{selectedCustomer.address2}</p>
            </div>
            <div className="">
              <h4 className="text-md font-bold text-white">City</h4>
              <p className="text-white">{selectedCustomer.city}</p>
            </div>
            <div className="">
              <h4 className="text-md font-bold text-white">State</h4>
              <p className="text-white">{selectedCustomer.state}</p>
            </div>
            <div className=" ">
              <h4 className="text-md font-bold text-white">Country</h4>
              <p className="text-white">{selectedCustomer.country}</p>
            </div>
            <div className="">
              <h4 className="text-md font-bold text-white">Pincode</h4>
              <p className="text-white">{selectedCustomer.pincode}</p>
            </div>
            <div className="">
              <h4 className="text-md font-bold text-white">Landline</h4>
              <p className="text-white">{selectedCustomer.landline || "N/A"}</p>
            </div>
            <div className="">
              <h4 className="text-md font-bold text-white">Status</h4>
              <p
                className={`bg-clip-text text-transparent ${
                  selectedCustomer.selected.some(
                    (item) => item.isActive === "Running"
                  )
                    ? "bg-gradient-to-r from-lime-400 via-green-500 to-emerald-600"
                    : "bg-gradient-to-r from-red-400 via-red-500 to-orange-600"
                } text-lg font-bold `}
              >
                {selectedCustomer.selected.some(
                  (item) => item.isActive === "Running"
                )
                  ? "Active"
                  : "Inactive"}
              </p>
            </div>
            <div className="">
              <h4 className="text-md font-bold text-white">Reason of Status</h4>
              <p className="text-white">
                {selectedCustomer.reasonofStatus || "N/A"}
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
                      select
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
                  {productDetails?.map((product, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        <input
                          className="form-checkbox h-4 w-4 text-blue-600 hover:bg-blue-200 focus:ring-blue-500 cursor-pointer"
                          checked={
                            selectedProducts?.productName ===
                            product?.productName
                          }
                          type="checkbox"
                          onChange={(e) => handleCheckboxChange(e, product)}
                        />
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
                          ? calculateRemainingDays(product?.licenseExpiryDate)
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
                        {calculateRemainingDays(product?.tvuexpiryDate)}
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
        </>
      )}
    </div>
  )
}
