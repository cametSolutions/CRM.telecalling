import React, { useState, useEffect, useRef, useCallback } from "react"
import { useLocation, Link } from "react-router-dom"

import "react-quill/dist/quill.snow.css" // Import Quill styles
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

import UseFetch from "../../../hooks/useFetch"
import Timer from "../../../components/primaryUser/Timer"
import PopUp from "../../../components/common/PopUp"
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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [afterCallsubmitting, setafterCallSubmitting] = useState(false)
  const [loggeduserCurrentDateCalls, setloggeduserCurrentDateCalls] = useState(
    []
  )
  const [showIncomingNumberToast, setshowinComingnumberToast] = useState(false)
  const [callreport, setcallReport] = useState({})
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
  const [branch, setBranches] = useState([])
  const [callnote, setCallnotes] = useState([])
  const debounceTimeoutRef = useRef(null)
  const location = useLocation()
  const { calldetails, token } = location?.state || {}

  const [tokenData, setTokenData] = useState(null)
  const { data: registeredCall, refreshHook } = UseFetch(
    selectedCustomer?._id &&
      `/customer/getcallregister?customerid=${selectedCustomer?._id || null}`
  )
  const { data } = UseFetch(
    user._id && `/customer/getloggeduserCurrentCalls?loggedUserId=${user._id}`
  )
  const { data: callnotes } = UseFetch("/customer/getallcallNotes")
  const handleQuillChange = (value) => {
    setValue("description", value, { shouldValidate: true }) // Update React Hook Form's value
  }
  useEffect(() => {
    setloggeduserCurrentDateCalls(data)
  }, [data])
  useEffect(() => {
    const submitCallRegistration = async () => {
      try {
        if (afterCallsubmitting) {
          const response = await api.get(
            `/customer/getloggeduserCurrentCalls?loggedUserId=${user._id}`
          )
          const data = response.data.data
          if (response.status === 200) setloggeduserCurrentDateCalls(data)
        }
      } catch (error) {
        console.error("Error submitting call registration:", error)
      }
    }

    submitCallRegistration()
  }, [afterCallsubmitting]) // Dependency array ensures it runs when 'afterCallsubmitting' changes
  useEffect(() => {
    if (callnotes && callnotes?.length > 0) {
      const userData = localStorage.getItem("user")
      const user = JSON.parse(userData)

      if (user.role !== "Admin") {
        const branches = user.selected.map((branch) => branch.branch_id)

        setBranches(branches)
      }

      setUser(user)
      setCallnotes(callnotes)
    }
  }, [callnotes])
  // Cleanup the timeout if the component unmounts
  useEffect(() => {
    return () => clearTimeout(debounceTimeoutRef.current)
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
          const productId = matchingRegistration
            ? matchingRegistration.product._id
            : null

          const matchingProducts =
            callData.callDetails.customerid.selected.filter(
              (product) => product.product_id === productId
            )
          setSearch(callData?.callDetails?.customerid?.customerName)
          setSelectedCustomer(callData?.callDetails?.customerid)

          setProductDetails([
            {
              product_id: matchingProducts[0].product_id,
              licensenumber: matchingProducts[0].licensenumber,
              productName: matchingProducts[0].productName,
              branchName: matchingProducts[0].branchName
            }
          ])
          const editData = {
            incomingNumber: matchingRegistration?.formdata?.incomingNumber,
            token: matchingRegistration?.timedata?.token,
            description: matchingRegistration?.formdata?.description,
            solution: matchingRegistration?.formdata?.solution,
            status: matchingRegistration?.formdata?.status,
            callnote: `${matchingRegistration?.formdata?.callnote._id}|${matchingRegistration?.formdata?.callnote.callNotes}`
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
      `https://www.crm.camet.in/api/customer/getcallregister/${callId}`,
      {
        method: "GET",
        credentials: "include" // This allows cookies to be sent with the request
      }
    )
    // const response = await fetch(
    //   `http://localhost:9000/api/customer/getcallregister/${callId}`,
    //   {
    //     method: "GET",
    //     credentials: "include" // This allows cookies to be sent with the request
    //   }
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
    }
    // else if (registeredCall && afterCallsubmitting) {
    // }
  }, [registeredCall])

  useEffect(() => {
    // Set the default product if there's only one
    if (productDetails?.length === 1) {
      setSelectedProducts([productDetails[0]])
    }
  }, [productDetails])

  const handleCheckboxChange = (e, product) => {
    if (e.target.checked) {
      // setSelectedProducts(product)
      setSelectedProducts((prev) => [...prev, product])
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
  const setDateandTime = (dateString) => {
    const dateObj = new Date(dateString)

    const date = dateObj.toLocaleDateString("en-GB") // Format: DD/MM/YYYY
    const time = dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true // ✅ Enables 12-hour format with AM/PM
    })

    return `${date} ${time}` // Example: "03/02/2025 02:48:57 PM"
  }

  const stopTimer = async (time, product) => {
    if (!product) {
      toast.error("No product selected.")
      return
    }

    setSubmitLoading(true)

    const userData = localStorage.getItem("user")
    const user = JSON.parse(userData)

    const endTime = new Date().toISOString()
    const durationInSeconds = timeStringToSeconds(time)
    // Save timer value in local storage
    if (!token) {
      const branchName = product.branchName

      const uniqueToken = generateUniqueNumericToken()
      setTokenData(uniqueToken)

      const timeData = {
        startTime: startTime.toISOString(),
        endTime: endTime,
        duration: durationInSeconds,
        time,
        token: uniqueToken
      }

      const updatedformData = { ...formData }
      const [selectedId, selectedText] = updatedformData.callnote.split("|")
      updatedformData.callnote = selectedId

      if (updatedformData.status === "pending") {
        updatedformData.attendedBy = {
          callerId: user._id,
          role: user.role,
          duration: timeData.duration,
          calldate: startTime
        }

        updatedformData.completedBy = "" // Clear completedBy if status is pending
      } else if (updatedformData.status === "solved") {
        updatedformData.attendedBy = {
          callerId: user._id,
          role: user?.role,
          duration: timeData?.duration,
          calldate: startTime
        }
        updatedformData.completedBy = {
          callerId: user._id,
          role: user.role
        }
        // Set both attendedBy and completedBy if status is solved
      }

      const calldata = {
        product: selectedProducts[0]?.product_id,
        license: selectedProducts[0]?.licensenumber,
        branchName:
          user?.role === "Admin"
            ? user.branchName.map((branch) => branch)
            : user.selected.map((branch) => branch.branchName),
        timedata: timeData,
        formdata: updatedformData,
        customeremail: selectedCustomer?.email,
        customerName: selectedCustomer?.customerName,
        productName: selectedProducts[0]?.productName
      }
      setcallReport(calldata)

      const response = await api.post(
        `/customer/callRegistration?customerid=${selectedCustomer._id}&customer=${selectedCustomer.customerName}&branchName=${branchName}&username=${user.name}`,
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
        // if (!selectedProducts[0]?.product_id) {
        //   setIsModalOpen(true) // Open popup if no product is selected
        // }
        setSelectedProducts([])
        setSelectedCustomer(null)
        setCustomerData([])
        setSearching(false)
        socket.emit("updatedCalls")
        sendWhatapp(calldata, selectedText)
        setSearch("")
        // setafterCallSubmitting(true)
      } else {
        toast.error(response.data.message)
      }
    } else {
      const branchName = product.branchName
      const timeData = {
        startTime: startTime.toISOString(),
        endTime: endTime,
        duration: durationInSeconds,
        time,
        token: token
      }

      const updatedformData = { ...formData }
      const [selectedId, selectedText] = updatedformData.callnote.split("|")
      updatedformData.callnote = selectedId

      if (updatedformData.status === "pending") {
        updatedformData.attendedBy = {
          callerId: user._id,
          role: user.role,
          duration: timeData.duration,
          calldate: startTime
        }

        updatedformData.completedBy = "" // Clear completedBy if status is pending
      } else if (updatedformData.status === "solved") {
        updatedformData.attendedBy = {
          callerId: user._id,
          role: user.role,
          duration: timeData.duration,
          calldate: startTime
        }
        updatedformData.completedBy = {
          callerId: user._id,
          role: user.role
        }
        // Set both attendedBy and completedBy if status is solved
      }

      const calldata = {
        product: selectedProducts[0]?.product_id,
        license: selectedProducts[0]?.licensenumber,
        branchName:
          user.role === "Admin"
            ? user.branchName.map((branch) => branch)
            : user.selected.map((branch) => branch.branchName),
        timedata: timeData,
        formdata: updatedformData,
        customeremail: selectedCustomer.email,
        customerName: selectedCustomer.customerName,
        productName: selectedProducts[0]?.productName
      }
      setcallReport(calldata)
      const response = await api.post(
        `/customer/callRegistration?customerid=${selectedCustomer._id}&customer=${selectedCustomer.customerName}&branchName=${branchName}&username=${user.name}`,
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
        // setafterCallSubmitting(true)
        setCustomerData([])
        setSearch("")
        setSearching(false)
        setSelectedCustomer(null)
        setSelectedProducts([])
        socket.emit("updatedCalls")
        sendWhatapp(calldata, selectedText)
      } else {
        toast.error(response.data.message)
      }
    }
  }
  const formatTableToText = (calldata, selectedText) => {
    const date = formatDate(calldata.timedata.startTime)
    return `
    Date:       \t${date}
Token:      \t${calldata?.timedata?.token}
Organization:\t${calldata?.customerName}
Contact No: \t+91 ${calldata?.formdata?.incomingNumber}
Product Name:\t${calldata?.productName}
Serial No:  \t${calldata?.license}
Call Status:\t${
      calldata.formdata.status === "solved"
        ? "Closed"
        : calldata?.formdata?.status
    }
Problem:    \t${selectedText}
  `.trim()
  }
  const sendWhatapp = (calldata, callnote) => {
    if (
      !calldata?.formdata?.incomingNumber ||
      calldata?.formdata?.status === "solved"
    ) {
      setafterCallSubmitting(true)
      console.error("Incoming number is missing in calldata.")
      return
    }

    // let whatsappWindow
    let whatsappUrl
    const phoneNumber = `+91${calldata.formdata.incomingNumber}`
    const textToShare = `${calldata.customerName} - ${phoneNumber}\nCallnote: ${callnote}`

    // if (calldata.formdata.status === "solved") {
    //   const message = formatTableToText(calldata, selectedText)

    //   whatsappUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(
    //     message
    //   )}&phone=${phoneNumber}`

    // } else {
    //   // Open WhatsApp Web with the message
    //   whatsappUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(
    //     textToShare
    //   )}`
    // }
    // const isMobile = /iPhone|Android/i.test(navigator.userAgent)

    whatsappUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(
      textToShare
    )}`
    const userConfirmed = window.confirm(
      "Do you have WhatsApp Web open and logged in? Click OK to continue, or Cancel to abort."
    )

    if (!userConfirmed) {
      console.log("userconfirmed", userConfirmed)
      setafterCallSubmitting(true)
      return
    }

    const whatsappWindow = window.open(whatsappUrl, "_blank")

    if (!whatsappWindow) {
      console.log(whatsappUrl)
      alert("whats app web is not connected please connect.")
    } else {
      console.log(whatsappUrl)
      setafterCallSubmitting(true)
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
  const fetchCustomerData = async (query) => {
    let url
    if (user.role === "Admin") {
      // url = `http://localhost:9000/api/customer/getCustomer?search=${query}&role=${user.role}`
      url = `https://www.crm.camet.in/api/customer/getCustomer?search=${query}&role=${user.role}`
    } else {
      const branches = JSON.stringify(branch)

      // url =
      //   branches &&
      //   branches.length > 0 &&
      //   `http://localhost:9000/api/customer/getCustomer?search=${query}&role=${
      //     user.role
      //   }&userBranch=${encodeURIComponent(branches)}`

      url =
        branches &&
        branches?.length > 0 &&
        `https://www.crm.camet.in/api/customer/getCustomer?search=${query}&role=${
          user.role
        }&userBranch=${encodeURIComponent(branches)}`
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        credentials: "include"
      })

      if (response.ok) {
        const result = await response.json()
        setCustomerData(result.data)
        if (result.data.length > 0) {
          setMessage("")
        } else {
          setMessage(result.message)
        }

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
    }
  }

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) {
      return "0 hr 0 min 0 sec"
    }
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs} hr ${mins} min ${secs} sec`
  }

  const handleInputChange = useCallback((e) => {
    setafterCallSubmitting(false)
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
        setMessage("")
        setCustomerData([])
      }
    }, 300) // Adjust the delay time to your preference (e.g., 300 ms)
  }, [])
  const handleRowClick = (customer) => {
    setSearching(false)
    setCallData([])
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
    if (selectedProducts && selectedProducts?.length === 0) {
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
    <div className="container  justify-center items-center p-8 h-auto">
      <div className="w-auto bg-white shadow-lg rounded  p-8 mx-auto h-auto">
        <div className="flex justify-between ">
          <h2 className="text-2xl font-semibold mb-4">Call Registration</h2>
          <div>
            <Link
              to={user?.role === "Admin" ? "/admin/home" : "/staff/home"}
              className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 px-2 py-1 rounded-md shadow-lg cursor-pointer"
            >
              Go Home
            </Link>
          </div>
        </div>

        <hr className="border-t-2 border-gray-300 mb-4"></hr>
        <div className="w-2/4 ">
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
                value={search}
                // defaultValue={calldetails ? name : search}
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
        {!search &&
          loggeduserCurrentDateCalls &&
          loggeduserCurrentDateCalls?.length > 0 && (
            <>
              {loggeduserCurrentDateCalls?.length > 0 && (
                <>
                  <h1 className="text-xl inline-block border-b-2 border-black mt-3">
                    Your Today's Call list
                  </h1>
                  <div className="mt-2 overflow-y-auto w-full max-h-[calc(100vh-300px)]  text-center relative rounded-lg">
                    <table className="w-full divide-y divide-gray-200 rounded-xl shadow-lg">
                      {/* Table Header */}
                      <thead
                        className={`${
                          isModalOpen ? "" : "sticky top-0 z-50"
                        } bg-purple-200  `}
                      >
                        <tr>
                          <th className="px-6 py-5 text-xs font-medium text-gray-800 uppercase tracking-wider">
                            Customer Name
                          </th>
                          <th className="px-6 py-5 text-xs font-medium text-gray-800 uppercase tracking-wider">
                            Token No
                          </th>
                          <th className="px-6 py-5 text-xs font-medium text-gray-800 uppercase tracking-wider">
                            Product Name
                          </th>
                          <th className="px-6 py-5 text-xs font-medium text-gray-800 uppercase tracking-wider">
                            Start Date
                          </th>
                          <th className="px-6 py-5 text-xs font-medium text-gray-800 uppercase tracking-wider">
                            End Date
                          </th>
                          <th className="px-6 py-5 text-xs font-medium text-gray-800 uppercase tracking-wider">
                            Duration
                          </th>
                          <th className="px-6 py-5 text-xs font-medium text-gray-800 uppercase tracking-wider">
                            Incoming Number
                          </th>
                          <th className="px-6 py-5 text-xs font-medium text-gray-800 uppercase tracking-wider">
                            AttendedBy
                          </th>
                          <th className="px-6 py-5 text-xs font-medium text-gray-800 uppercase tracking-wider">
                            CompletedBy
                          </th>
                          <th className="px-6 py-5 text-xs font-medium text-gray-800 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>

                      {/* Sorting Calls: Pending Calls First, Then Latest Calls */}
                      <tbody className="divide-gray-500">
                        {loggeduserCurrentDateCalls
                          .flatMap((customer) =>
                            customer.callregistration.map((call) => ({
                              ...call,
                              customerName: customer.customerName
                            }))
                          )
                          .sort((a, b) => {
                            if (
                              a.formdata?.status === "pending" &&
                              b.formdata?.status !== "pending"
                            )
                              return -1
                            if (
                              b.formdata?.status === "pending" &&
                              a.formdata?.status !== "pending"
                            )
                              return 1
                            return (
                              new Date(b.timedata?.startTime) -
                              new Date(a.timedata?.startTime)
                            )
                          })
                          .map((call, index) => {
                            const today = new Date().toISOString().split("T")[0]
                            const callDate = call.timedata?.startTime
                              ? new Date(call.timedata?.startTime.split(" ")[0])
                                  .toISOString()
                                  .split("T")[0]
                              : null

                            return (
                              <React.Fragment key={index}>
                                {/* Main Call Row */}
                                <tr
                                  className={`border-0 ${
                                    call.formdata?.status === "solved"
                                      ? "bg-[linear-gradient(135deg,_rgba(0,140,0,1),_rgba(128,255,128,1))]"
                                      : call.formdata?.status === "pending"
                                      ? callDate === today
                                        ? "bg-[linear-gradient(135deg,_rgba(255,255,1,1),_rgba(255,255,128,1))]"
                                        : "bg-[linear-gradient(135deg,_rgba(255,0,0,1),_rgba(255,128,128,1))]"
                                      : "bg-[linear-gradient(135deg,_rgba(255,0,0,1),_rgba(255,128,128,1))]"
                                  }`}
                                >
                                  <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
                                    {call.customerName}
                                  </td>
                                  <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
                                    {call.timedata?.token}
                                  </td>
                                  <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
                                    {call.productDetails[0]?.productName}
                                  </td>
                                  <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
                                    {new Date(
                                      call.timedata?.startTime
                                    ).toLocaleString()}
                                  </td>
                                  <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
                                    {new Date(
                                      call.timedata?.endTime
                                    ).toLocaleString()}
                                  </td>
                                  <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
                                    {call.timedata?.time}
                                  </td>
                                  <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
                                    {call.formdata?.incomingNumber}
                                  </td>
                                  <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
                                    {call.formdata?.attendedBy
                                      ?.map((attendee) => attendee.name)
                                      .join(", ") || ""}
                                  </td>
                                  <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
                                    {call.formdata?.completedBy
                                      ?.map((completer) => completer.name)
                                      .join(", ") || ""}
                                  </td>
                                  <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
                                    {call.formdata?.status}
                                  </td>
                                </tr>

                                {/* Description & Solution Row */}
                                <tr
                                  className={`text-center border-t-0 border-black ${
                                    call.formdata?.status === "solved"
                                      ? "bg-[linear-gradient(135deg,_rgba(0,140,0,1),_rgba(128,255,128,1))]"
                                      : call.formdata?.status === "pending"
                                      ? callDate === today
                                        ? "bg-[linear-gradient(135deg,_rgba(255,255,1,1),_rgba(255,255,128,1))]"
                                        : "bg-[linear-gradient(135deg,_rgba(255,0,0,1),_rgba(255,128,128,1))]"
                                      : "bg-[linear-gradient(135deg,_rgba(255,0,0,1),_rgba(255,128,128,1))]"
                                  }`}
                                  style={{ height: "5px" }}
                                >
                                  <td
                                    colSpan="5"
                                    className="py-1 px-8 text-sm text-black text-left"
                                  >
                                    <strong>Description:</strong>{" "}
                                    {call.formdata?.description || "N/A"}
                                  </td>
                                  <td
                                    colSpan="5"
                                    className="py-1 px-12 text-sm text-black text-left"
                                  >
                                    <strong>Solution:</strong>{" "}
                                    {call.formdata?.solution || "N/A"}
                                  </td>
                                </tr>
                              </React.Fragment>
                            )
                          })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </>
          )}

        {searching && customerData?.length > 0 ? (
          <div className=" w-2/4 max-h-40 overflow-y-auto overflow-x-auto  mt-4 border border-gray-200 shadow-md rounded-lg">
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
                  customer?.selected?.map((item, subIndex) => (
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
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-3 bg-[#4888b9] shadow-md rounded p-5">
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
                <h4 className="text-md font-bold text-white">Partnership</h4>
                <p className="text-white">
                  {selectedCustomer?.partner?.partner || "N/A"}
                </p>
              </div>
              <div className="">
                <h4 className="text-md font-bold text-white">Industry</h4>
                <p className="text-white">
                  {selectedCustomer?.industry || "N/A"}
                </p>
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
                <h4 className="text-md font-bold text-white">
                  Reason of Status
                </h4>
                <p className="text-white">
                  {selectedCustomer.reasonofStatus || "N/A"}
                </p>
              </div>
            </div>
            <div className="mt-6 w-lg ">
              <div className="mb-2 ">
                <h3 className="text-lg font-medium text-gray-900">
                  Product Details List
                </h3>
                {/* <button onClick={fetchData}>update</button>c */}
              </div>
              <div className=" w-lg max-h-30 overflow-x-auto text-center overflow-y-auto border border-gray-300 rounded-lg">
                <table className=" m-w-full divide-y divide-gray-200 shadow">
                  <thead
                    className={`${
                      isModalOpen ? "" : "sticky top-0 z-30"
                    } bg-green-300`}
                  >
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
                  <tbody className="divide-y divide-gray-300">
                    {productDetails?.map((product, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          <input
                            className="form-checkbox h-4 w-4 text-blue-600 hover:bg-blue-200 focus:ring-blue-500 cursor-pointer"
                            // checked={
                            //   selectedProducts?.productName ===
                            //   product?.productName
                            // }
                            checked={selectedProducts.some(
                              (p) => p.productName === product?.productName
                            )}
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
                          <span
                            style={{
                              color:
                                calculateRemainingDays(product?.amcendDate) ===
                                "Expired"
                                  ? "red"
                                  : "N/A"
                                  ? "black"
                                  : "black"
                            }}
                          >
                            {calculateRemainingDays(product?.amcendDate)}
                          </span>
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

              <div className=" container mt-12 ">
                <div className="flex container justify-center items-center">
                  <Timer
                    isRunning={isRunning}
                    startTime={startTime}
                    productDetails={productDetails}
                    selectedProducts={selectedProducts}
                    onStop={stopTimer}
                  />
                  <PopUp
                    isOpen={isModalOpen}
                    report={callreport}
                    onClose={() => setIsModalOpen(false)}
                    handleWhatsapp={sendWhatapp}
                    message="Product Name is missing in the current call please inform the admin to add product!"
                  />
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Updated parent div with justify-between */}

                  <div className="grid grid-cols-3 gap-6  ">
                    <div className="relative">
                      {/* Toast Message */}
                      {showIncomingNumberToast && (
                        <div className="absolute -top-10 left-0 bg-blue-500 text-white px-3 py-1 rounded-md text-sm z-10 shadow-md ">
                          Please enter the customer's incoming number. This
                          number will be sent to the customer's email
                        </div>
                      )}

                      <label
                        htmlFor="customerName"
                        className="block text-sm font-medium text-gray-700 "
                      >
                        Incoming Number
                      </label>
                      <input
                        type="Number"
                        id="incomingNumber"
                        {...register("incomingNumber", {
                          required: "Incoming number is required",
                          onChange: (e) => setshowinComingnumberToast(true)
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
                    <div>
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
                    <div>
                      {/* Adjust width and padding for spacing */}
                      <label
                        htmlFor="callnote"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Call Notes
                      </label>

                      <select
                        {...register("callnote", {
                          required: "please select a callnote"
                        })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none"
                        defaultValue="" // Default placeholder
                      >
                        <option value="" disabled>
                          Select Callnote
                        </option>
                        {callnote.map((callnotes) => (
                          <option
                            key={callnotes._id}
                            value={`${callnotes._id}|${callnotes.callNotes}`}
                            // value={`${callnotes._id}`}
                          >
                            {callnotes.callNotes}
                          </option>
                        ))}
                      </select>
                      {errors.callnote && (
                        <span className="mt-2 text-sm text-red-600">
                          {errors.callnote.message}
                        </span>
                      )}
                    </div>

                    <div>
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
                    <div>
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
                    <div>
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
                        {/* {submitLoading ? "Loading..." : "End call"} */}
                        {submitLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Loading...</span>
                          </div>
                        ) : (
                          <span>End call</span>
                        )}
                      </button>
                    </div>
                  )}
                </form>
                <div className="flex justify-end">
                  <Link
                    to={user?.role === "Admin" ? "/admin/home" : "/staff/home"}
                    className="text-blue-600"
                  >
                    Go Home
                  </Link>
                </div>
                {callData?.length > 0 && (
                  <div className="relative mt-8 overflow-y-auto w-full max-h-60 text-center">
                    <table className=" w-full divide-y divide-gray-200 rounded-xl shadow-lg ">
                      <thead
                        className={`${
                          isModalOpen ? "" : " sticky top-0 z-30"
                        } bg-purple-200`}
                      >
                        <tr className="">
                          <th className="px-6 py-5  text-xs font-medium text-gray-800 uppercase tracking-wider">
                            Token No
                          </th>
                          <th className="px-6 py-5  text-xs font-medium text-gray-800 uppercase tracking-wider">
                            Product Name
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
                      <tbody className=" divide-gray-500 border-gray-200">
                        {callData
                          ?.sort((a, b) => {
                            // Prioritize pending calls over solved calls
                            if (
                              a.formdata?.status === "pending" &&
                              b.formdata?.status !== "pending"
                            ) {
                              return -1
                            }
                            if (
                              a.formdata?.status !== "pending" &&
                              b.formdata?.status === "pending"
                            ) {
                              return 1
                            }

                            // If statuses are the same, sort by startTime (latest first)
                            const timeA = new Date(
                              a.timedata?.startTime || 0
                            ).getTime()
                            const timeB = new Date(
                              b.timedata?.startTime || 0
                            ).getTime()

                            return timeB - timeA // Sort in descending order (latest first)
                          })
                          .map((call, index) => {
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
                                  <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
                                    {call.timedata?.token}
                                  </td>
                                  <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
                                    {call.product?.productName}
                                  </td>
                                  <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
                                    {setDateandTime(call.timedata?.startTime)}
                                  </td>
                                  <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
                                    {call.formdata?.status === "solved"
                                      ? setDateandTime(call.timedata?.endTime)
                                      : ""}
                                  </td>
                                  <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
                                    {formatDuration(call?.timedata?.duration) ||
                                      "N/A"}
                                  </td>
                                  <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
                                    {call.formdata?.incomingNumber}
                                  </td>
                                  <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
                                    {Array.isArray(call?.formdata?.attendedBy)
                                      ? call?.formdata?.attendedBy
                                          ?.map(
                                            (attendee) =>
                                              attendee?.callerId?.name ||
                                              attendee?.name
                                          )
                                          .join(", ")
                                      : call?.formdata?.attendedBy?.callerId
                                          ?.name}
                                  </td>
                                  <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
                                    {call.formdata?.status
                                      ? Array.isArray(
                                          call?.formdata?.completedBy
                                        )
                                        ? call?.formdata?.completedBy
                                            ?.map(
                                              (attendee) =>
                                                attendee?.callerId?.name ||
                                                attendee?.name
                                            )
                                            .join(", ")
                                        : call?.formdata?.completedBy?.callerId
                                            ?.name
                                      : ""}
                                  </td>
                                  <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
                                    {call.formdata?.status}
                                  </td>
                                </tr>
                                <tr
                                  className={`text-center border-t-0 border-black ${
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
                                    colSpan="5"
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
