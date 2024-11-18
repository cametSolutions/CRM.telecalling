import React, { useState, useEffect, useRef, useCallback } from "react"
import { useLocation, Link } from "react-router-dom"
import { flushSync } from "react-dom"
import ClipLoader from "react-spinners/ClipLoader"
import io from "socket.io-client"
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
const socket = io("https://www.crm.camet.in")
// const socket = io("http://localhost:9000")

export default function CallRegistration() {
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
  const [loading, setloading] = useState(false)
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [editform, setEditformdata] = useState({})
  const [productDetails, setProductDetails] = useState([])
  const [user, setUser] = useState(false)
  const [searching, setSearching] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [selectedProducts, setSelectedProducts] = useState([])
  const [isRunning, setIsRunning] = useState(false) // Start with the timer running
  const [startTime, setStartTime] = useState(Date.now())
  const [endTime, setEndTime] = useState(null)
  const [formData, setFormData] = useState(null)
  const [callData, setCallData] = useState([])

  const [tokenData, setTokenData] = useState(null)

  const { data: registeredCall, refreshHook } = UseFetch(
    selectedCustomer &&
      `/customer/getcallregister?customerid=${selectedCustomer?._id || null}`
  )

  // useRef to keep track of the latest timeout for debouncing
  const debounceTimeoutRef = useRef(null)
  const location = useLocation()
  const { calldetails, token } = location.state || {}
  // Cleanup the timeout if the component unmounts
  useEffect(() => {
    return () => clearTimeout(debounceTimeoutRef.current)
  }, [])
  useEffect(() => {
    const userData = localStorage.getItem("user")
    const user = JSON.parse(userData)
    setUser(user)
  }, [])
  useEffect(() => {
    const handler = setTimeout(() => {
      if (search && !selectedCustomer) {
        fetchCustomerData(search)
        setloading(true)
      } else {
        setloading(false)
        setCustomerData([])
      }
    }, 500)

    return () => {
      clearTimeout(handler) // Cleanup the timeout on unmount or before the next call
    }
  }, [search]) // Only re-run the effect if search changes

  useEffect(() => {
    if (calldetails) {
      // Fetch the call details using the ID
      fetchCallDetails(calldetails)
        .then((callData) => {
          const matchingRegistration =
            callData.callDetails.callregistration.find(
              (registration) => registration.timedata.token === token
            )

          // If a matching registration is found, extract the product details
          const productName = matchingRegistration
            ? matchingRegistration.product.productName
            : null

          const matchingProducts =
            callData.callDetails.customerid.selected.filter(
              (product) => product.productName === productName
            )

          setSelectedCustomer(callData?.callDetails?.customerid)
          setName(callData?.callDetails?.customerid?.customerName)

          setProductDetails(matchingProducts)

          const editData = {
            incomingNumber: matchingRegistration?.formdata?.incomingNumber,
            token: matchingRegistration?.timedata?.token,
            description: matchingRegistration?.formdata?.description,
            solution: matchingRegistration?.formdata?.solution,
            status: matchingRegistration?.formdata?.status
          }

          reset(editData)
          setIsRunning(true)

          setStartTime(new Date())
          refreshHook()
        })
        .catch((error) => {
          console.error("Error fetching call details:", error)
        })
    }
  }, [calldetails])

  const fetchCallDetails = async (callId) => {
    const response = await fetch(
      `https://www.crm.camet.in/api/customer/getcallregister/${callId}`
    )
    // const response = await fetch(
    //   `http://localhost:9000/api/customer/getcallregister/${callId}`
    // )
    const data = await response.json()

    return data
  }

  useEffect(() => {
    if (registeredCall) {
      const sortedData = registeredCall.callregistration.sort((a, b) => {
        if (a.formdata.status === "pending" && b.formdata.status === "solved") {
          return -1
        }
        if (a.formdata.status === "solved" && b.formdata.status === "pending") {
          return 1
        }
        return 0 // No sorting for calls with the same status
      })
      setCallData(sortedData)
      setSubmitLoading(false)
      // setCallData(registeredCall.callregistration)
    }
  }, [registeredCall])

  useEffect(() => {
    // Set the default product if there's only one
    if (productDetails.length === 1) {
      setSelectedProducts(productDetails[0])
    }
  }, [productDetails])

  const handleCheckboxChange = (e, product) => {
    if (e.target.checked) {
      setSelectedProducts(product)
    } else if (selectedProducts.productName === product.productName) {
      setSelectedProducts([]) // Deselect if it was previously selected
    }
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

  function generateUniqueNumericToken(length = 10) {
    const timestamp = Math.floor(Date.now() / 1000) // Current time in seconds
    const randomPart = Math.floor(Math.random() * 10 ** (length - 6)) // Random number with remaining digits
    const token = `${timestamp % 10 ** 6}${randomPart
      .toString()
      .padStart(length - 6, "0")}` // Ensure length

    return token
  }
  function timeStringToSeconds(timeString) {
    const [hours, minutes, seconds] = timeString.split(":").map(Number)
    return hours * 3600 + minutes * 60 + seconds
  }

  const stopTimer = async (time) => {
    setSubmitLoading(true)
    const userData = localStorage.getItem("user")
    const user = JSON.parse(userData)
    const endTime = new Date().toISOString()
    const durationInSeconds = timeStringToSeconds(time)
    // Save timer value in local storage
    if (!token) {
      const uniqueToken = generateUniqueNumericToken()
      setTokenData(uniqueToken)

      const timeData = {
        startTime: startTime.toISOString(),
        endTime: endTime,
        duration: durationInSeconds,
        token: uniqueToken
      }

      const updatedformData = { ...formData }

      if (updatedformData.status === "pending") {
        updatedformData.attendedBy = {
          callerId: user._id,
          role: user.role,
          duration: timeData.duration
        }

        updatedformData.completedBy = "" // Clear completedBy if status is pending
      } else if (updatedformData.status === "solved") {
        updatedformData.attendedBy = {
          callerId: user._id,
          role: user.role,
          duration: timeData.duration
        }
        updatedformData.completedBy = {
          callerId: user._id,
          role: user.role
        }
        // Set both attendedBy and completedBy if status is solved
      }

      const calldata = {
        product: selectedProducts.product_id,
        license: selectedProducts.licensenumber,
        branchName:
          user.role === "Admin"
            ? user.branchName.map((branch) => branch)
            : user.selected.map((branch) => branch.branchName),
        timedata: timeData,
        formdata: updatedformData
      }

      const response = await api.post(
        `/customer/callRegistration?customerid=${selectedCustomer._id}&customer=${selectedCustomer.customerName}`,
        calldata,

        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json" // Ensure the correct content type
          }
        }
      )
      if (response.status === 200) {
        toast.success(response.data.message)
        socket.emit("updatedCalls")
        refreshHook()
      } else {
        toast.error(response.data.message)
      }
    } else {
      const timeData = {
        startTime: startTime.toISOString(),
        endTime: endTime,
        duration: durationInSeconds,
        token: token
      }
      const updatedformData = { ...formData }

      if (updatedformData.status === "pending") {
        updatedformData.attendedBy = {
          callerId: user._id,
          role: user.role,
          duration: timeData.duration
        }

        updatedformData.completedBy = "" // Clear completedBy if status is pending
      } else if (updatedformData.status === "solved") {
        updatedformData.attendedBy = {
          callerId: user._id,
          role: user.role,
          duration: timeData.duration
        }
        updatedformData.completedBy = {
          callerId: user._id,
          role: user.role
        }
        // Set both attendedBy and completedBy if status is solved
      }

      const calldata = {
        product: selectedProducts.product_id,
        license: selectedProducts.licensenumber,
        branchName:
          user.role === "Admin"
            ? user.branchName.map((branch) => branch)
            : user.selected.map((branch) => branch.branchName),
        timedata: timeData,
        formdata: updatedformData
      }

      const response = await api.post(
        `/customer/callRegistration?customerid=${selectedCustomer._id}&customer=${selectedCustomer.customerName}`,
        calldata,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json" // Ensure the correct content type
          }
        }
      )

      if (response.status === 200) {
        toast.success(response.data.message)
        refreshHook()
        // setCallData(response.data.updatedCall.callregistration)

        socket.emit("updatedCalls")
      } else {
        toast.error(response.data.message)
      }
    }
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

  const fetchCustomerData = useCallback(
    debounce(async (query) => {
      // const url = `http://localhost:9000/api/customer/getCustomer?search=${encodeURIComponent(
      //   query
      // )}`
      const url = `https://www.crm.camet.in/api/customer/getCustomer?search=${encodeURIComponent(
        query
      )}`

      try {
        const response = await fetch(url, {
          method: "GET",
          credentials: "include"
        })

        if (response.ok) {
          const result = await response.json()
          setMessage("")
          setCustomerData(result.data)
          setSearching(true)
          const userData = localStorage.getItem("user")
          const user = JSON.parse(userData)
          setUser(user)
        } else {
          const errorData = await response.json()
          setCustomerData(errorData.data)
          setMessage(errorData.message)
          console.error("Error fetching customer data:", errorData.message)
        }
      } catch (error) {
        console.error("Error fetching customer data:", error.message)
      } finally {
        setloading(false)
        // setSearching(false)
      }
    }, 300),
    [] // The empty dependency array ensures that debounce is created only once
  )
  const handleInputChange = useCallback((e) => {
    setSelectedCustomer(null)

    const value = e.target.value

    setSearch(value)

    // Clear the existing timeout whenever the user types
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    // Set a new timeout to update `message` and `customerData`
    debounceTimeoutRef.current = setTimeout(() => {
      if (value === "") {
        flushSync(() => {
          setMessage("")
          setCustomerData([])
        })
      }
    }, 300) // Adjust the delay time to your preference (e.g., 300 ms)
  }, [])

  // const handleInputChange = (e) => {
  //   setSelectedCustomer(null)
  //   const value = e.target.value

  //   // Clear previous timeout if the user is still typing
  //   if (typingTimeout) clearTimeout(typingTimeout)

  //   // Set a new timeout to handle the state updates after a short delay
  //   typingTimeout = setTimeout(() => {
  //     if (value === "") {
  //       setMessage("")
  //       setCustomerData([])
  //     }
  //   }, 200) // Adjust delay (in ms) as needed
  //   setSearch(value)
  // }

  const handleRowClick = (customer) => {
    flushSync(() => setSearching(false))
    flushSync(() => setCallData([]))
    setSelectedCustomer(customer)
    setSearch(customer.customerName)
    setProductDetails(customer.selected)

    if (customer) {
      reset({
        incomingNumber: "",
        token: "",
        description: "",
        solution: ""
      })
      setIsRunning(true)
      const currentTime = new Date()

      setStartTime(currentTime)
      // refreshHook()
    } else {
      setIsRunning(false)
      setTime(0) // Reset the timer when no customer is selected
    }

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
  // const fetchData = async () => {
  //   const uniqueToken = generateUniqueNumericToken()

  //   const startDate = new Date("2024-11-01T10:46:00")
  //   startDate.setHours(15, 46, 0, 0)
  //   // Set the end date by adding 66 seconds (66 * 1000 milliseconds) to the start date
  //   const endDate = new Date(startDate.getTime() + 66 * 1000)

  //   // Optionally, log in ISO format for reference
  //   console.log("Start Date (ISO):", startDate.toISOString())
  //   console.log("End Date (ISO):", endDate.toISOString())
  //   const timeDatasss = {
  //     startTime: startDate.toISOString(),
  //     endTime: endDate.toISOString(),
  //     duration: formatTime(66),
  //     token: uniqueToken
  //   }
  //   console.log("timedatafffuhh", timeDatasss)
  //   const form = {
  //     incomingNumber: "9846008802",
  //     token: "",
  //     description: "Excel import module",
  //     solution: "Cleared",
  //     status: "solved",
  //     attendedBy: "Akhila thomas",
  //     completedBy: "Akhila thomas"
  //   }
  //   console.log("forms", form)

  //   const editcall = {
  //     userName: "Akhila thomas",
  //     product: "67051e69c6d1805013e91797",
  //     license: 737805573,
  //     branchName: ["CAMET"],
  //     timedata: timeDatasss,
  //     formdata: form
  //   }
  //   console.log("calllldddddaataa", editcall)
  //   const response = await api.post(
  //     `/customer/callRegistration?customerid=${selectedCustomer._id}&customer=${selectedCustomer.customerName}`,
  //     editcall,
  //     {
  //       withCredentials: true,
  //       headers: {
  //         "Content-Type": "application/json" // Ensure the correct content type
  //       }
  //     }
  //   )
  //   if (response.status === 200) {
  //     console.log("okkk")
  //     // refreshHook()
  //     // // setCallData(response.data.updatedCall.callregistration)
  //     // socket.emit("updatedCalls")
  //   }
  // }

  return (
    <div className="container  justify-center items-center p-8 bg-gray-100">
      <div className="w-auto bg-white shadow-lg rounded min-h-screen p-8 mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Call Registration</h2>
        <hr className="border-t-2 border-gray-300 mb-4"></hr>
        <div className="w-2/4 ml-5">
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
                value={calldetails ? name : search}
                onChange={handleInputChange}
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

        {searching && customerData.length > 0 ? (
          <div className="ml-5 w-2/4 max-h-40 overflow-y-auto overflow-x-auto  mt-4 border border-gray-200 shadow-md rounded-lg">
            {/* Wrap the table in a div with border */}
            <table className="min-w-full bg-white">
              <thead className="sticky top-0 z-30 bg-green-300 border-b border-green-300 shadow">
                {/* Add a bottom border to the <thead> */}
                <tr>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Customer Name
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    License No
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
                <p className="text-white">
                  {selectedCustomer.landline || "N/A"}
                </p>
              </div>
              <div className="">
                <h4 className="text-md font-bold text-white">Status</h4>
                <p
                  className={` ${
                    selectedCustomer.isActive
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {selectedCustomer.isActive ? "Active" : "Inactive"}
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
                          {/* {product?.customerAddDate} */}
                          {formatDate(product?.customerAddDate)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {product?.licensenumber}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {/* {product?.customerAddDate} */}
                          {formatDate(product?.licenseExpiryDate)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {/* {product?.customerAddDate} */}
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
              <div className=" container mt-12 ">
                <div className="flex container justify-center items-center">
                  <Timer
                    isRunning={isRunning}
                    startTime={startTime}
                    onStop={stopTimer}
                  />
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Updated parent div with justify-between */}
                  <div className="flex justify-between m-5">
                    <div className="w-1/3 ">
                      {" "}
                      {/* Adjust width and padding for spacing */}
                      <label
                        htmlFor="customerName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Incoming Number
                      </label>
                      <input
                        type="Number"
                        id="incomingNumber"
                        {...register("incomingNumber", {
                          required: "Incoming number is required"
                        })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none"
                        placeholder="Enter Incoming Number"
                      />
                      {errors.incomingNumber && (
                        <span className="mt-2 text-sm text-red-600">
                          {errors.incomingNumber.message}
                        </span>
                      )}
                    </div>
                    <div className="w-1/3">
                      {" "}
                      {/* Adjust width and padding for spacing */}
                      <label
                        htmlFor="token"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Token
                      </label>
                      <input
                        type="text"
                        id="token"
                        {...register("token", {})}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between m-5">
                    <div className="w-1/3">
                      <label
                        id="description"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        rows="1"
                        {...register("description", {
                          maxLength: {
                            value: 500,
                            message: "Description cannot exceed 500 characters"
                          }
                        })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                        placeholder="Enter a description..."
                      />
                      {errors.description && (
                        <span className="mt-2 text-sm text-red-600">
                          {errors.description.message}
                        </span>
                      )}
                    </div>
                    <div className="w-1/3">
                      <label
                        id="solution"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Solution
                      </label>
                      <textarea
                        id="solution"
                        rows="1"
                        {...register("solution", {
                          maxLength: {
                            value: 500,
                            message: "Solution cannot exceed 500 characters"
                          }
                        })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                        placeholder="Enter a solution..."
                      />
                      {errors.solution && (
                        <span className="mt-2 text-sm text-red-600">
                          {errors.solution.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between m-5">
                    <div className="w-1/3">
                      <label
                        htmlFor="status"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Status
                      </label>
                      <select
                        {...register("status", { required: true })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none"
                      >
                        <option value="pending" selected>
                          Pending
                        </option>
                        <option value="solved">Solved</option>
                      </select>
                    </div>
                  </div>
                  {selectedCustomer && (
                    <div className=" flex justify-center items-center">
                      <button
                        type="submit"
                        className="px-4 py-2 font-medium text-white bg-gradient-to-r from-red-500 to-red-700 rounded-md shadow-md hover:shadow-lg focus:outline-none transition-shadow duration-200"
                      >
                        {submitLoading ? "Loading..." : "End call"}
                      </button>
                    </div>
                  )}
                </form>
                <div className="flex justify-end">
                  <Link to="/admin/home" className="text-blue-600">
                    Go Home
                  </Link>
                </div>
                {callData.length > 0 && (
                  <div className="mt-8 overflow-y-auto w-full max-h-60 text-center">
                    <table className=" w-full divide-y divide-gray-200 rounded-xl shadow-lg overflow-hidden ">
                      <thead className="sticky top-0 z-30 bg-purple-200 shadow-lg">
                        <tr className="">
                          <th className="px-6 py-5  text-xs font-medium text-gray-800 uppercase tracking-wider">
                            Token No
                          </th>
                          <th className="px-6 py-5  text-xs font-medium text-gray-800 uppercase tracking-wider">
                            Start Date
                          </th>
                          <th className="px-6 py-5  text-xs font-medium text-gray-800 uppercase tracking-wider">
                            End Date
                          </th>
                          <th className="px-6 py-5  text-xs font-medium text-gray-800 uppercase tracking-wider">
                            Duration
                          </th>
                          <th className="px-6 py-5  text-xs font-medium text-gray-800 uppercase tracking-wider">
                            Incoming Number
                          </th>

                          <th className="px-6 py-5  text-xs font-medium text-gray-800 uppercase tracking-wider">
                            AttendedBy
                          </th>
                          <th className="px-6 py-5  text-xs font-medium text-gray-800 uppercase tracking-wider">
                            CompletedBy
                          </th>
                          <th className="px-6 py-5  text-xs font-medium text-gray-800 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="  divide-gray-500">
                        {callData?.map((call, index) => {
                          const today = new Date().toISOString().split("T")[0]
                          const startTimeRaw = call?.timedata?.startTime
                          const callDate = startTimeRaw
                            ? new Date(startTimeRaw.split(" ")[0])
                                .toISOString()
                                .split("T")[0]
                            : null
                          return (
                            <>
                              <tr
                                key={index}
                                className={`border-0 ${
                                  call.formdata?.status === "solved"
                                    ? "bg-[linear-gradient(135deg,_rgba(0,140,0,1),_rgba(128,255,128,1))]"
                                    : call?.formdata?.status === "pending"
                                    ? callDate === today
                                      ? "bg-[linear-gradient(135deg,_rgba(255,255,1,1),_rgba(255,255,128,1))]"
                                      : "bg-[linear-gradient(135deg,_rgba(255,0,0,1),_rgba(255,128,128,1))]"
                                    : "bg-[linear-gradient(135deg,_rgba(255,0,0,1),_rgba(255,128,128,1))]"
                                }`}
                              >
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                                  {call.timedata?.token}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                                  {formatDate(call.timedata?.startTime)}
                                </td>

                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                                  {call.formdata?.status === "solved"
                                    ? formatDate(call.timedata?.endTime)
                                    : ""}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                                  {call.timedata?.duration}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                                  {call.formdata?.incomingNumber}
                                </td>

                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                                  {/* {call.formdata?.attendedBy} */}
                                  {Array.isArray(call?.formdata?.attendedBy)
                                    ? call.formdata?.attendedBy
                                        .map((attendee) => attendee.name)
                                        .join(", ")
                                    : call.formdata?.attendedBy}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                                  {/* {call.formdata?.completedBy} */}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                                  {call.formdata?.status}
                                </td>
                              </tr>
                              <tr
                                className={`text-center border-t-0 border-gray-500 ${
                                  call?.formdata?.status === "solved"
                                    ? "bg-[linear-gradient(135deg,_rgba(0,140,0,1),_rgba(128,255,128,1))]"
                                    : call?.formdata?.status === "pending"
                                    ? callDate === today
                                      ? "bg-[linear-gradient(135deg,_rgba(255,255,1,1),_rgba(255,255,128,1))]"
                                      : "bg-[linear-gradient(135deg,_rgba(255,0,0,1),_rgba(255,128,128,1))]"
                                    : "bg-[linear-gradient(135deg,_rgba(255,0,0,1),_rgba(255,128,128,1))]"
                                }`}
                                style={{ height: "5px" }}
                              >
                                <td
                                  colSpan="4"
                                  className="py-1 px-8 text-sm text-black text-left"
                                >
                                  <strong>Description:</strong>{" "}
                                  {call?.formdata?.description || "N/A"}
                                </td>
                                <td
                                  colSpan="4"
                                  className="py-1 px-12 text-sm text-black text-left"
                                >
                                  <strong>Solution:</strong>{" "}
                                  {call?.formdata?.solution || "N/A"}
                                </td>
                              </tr>
                            </>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
