import React, { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { useLocation, Link } from "react-router-dom"
import BarLoader from "react-spinners/BarLoader"
import "react-quill/dist/quill.snow.css" // Import Quill styles
import ClipLoader from "react-spinners/ClipLoader"
import io from "socket.io-client"
import { formatDate } from "../../../utils/dateUtils"
// import { useForm } from "react-hook-form"
import { parseISO, differenceInDays } from "date-fns"
import { useSelector } from "react-redux"
import { useForm, Controller } from "react-hook-form"
import Select from "react-select"
import {
  Eye,
  Phone,
  Mail,
  Settings,
  MessageSquareText,
  User,
  Calendar,
  Clock,
  UserPlus,
  UserCheck,
  IndianRupee,
  BellRing,
  History,
  ChevronDown,
  ChevronRight,
  X,
  Check
} from "lucide-react"
import {
  FaEdit,
  FaTrash,
  FaTimes,
  FaUser,
  FaHashtag,
  FaBuilding,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaGlobeAsia,
  FaStar,
  FaLandmark
} from "react-icons/fa"
import api from "../../../api/api"
import { PerformanceModal } from "../../../components/primaryUser/PerformanceModal"
import { StaticSidebar } from "../../../components/primaryUser/StaticSidebar"
import AdminHeader from "../../../header/AdminHeader"
import StaffHeader from "../../../header/StaffHeader"
import UseFetch from "../../../hooks/useFetch"
import Timer from "../../../components/primaryUser/Timer"
import PopUp from "../../../components/common/PopUp"
import { toast } from "react-toastify"
import { getLocalStorageItem } from "../../../helper/localstorage"

// const socket = io("https://www.crm.camet.in")
const socket = io("http://localhost:9000")

export default function CallRegistration() {
  // const {
  //   register,
  //   handleSubmit,

  //   setValue,
  //   reset,
  //   formState: { errors }
  // } = useForm()
  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    clearErrors,
    getValues,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      productName: null,
      companyName: null,
      branchName: null,
      customerName: "",
      address1: "",
      address2: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
      contactPerson: "",
      email: "",
      mobile: "",
      landline: "",
      partner: "",
      industry: "",
      registrationType: "",
      gstNo: "",
      licensenumber: "",
      softwareTrade: "",
      applicationDate: "",
      nextDue: "",
      noofusers: "",
      productAmount: "",
      isActive: "Running",
      taggedLicenses: [],
      taggedLicenseDueDates: {}
    }
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [afterCallsubmitting, setafterCallSubmitting] = useState(false)
  const [loggeduserCurrentDateCalls, setloggeduserCurrentDateCalls] = useState(
    []
  )
  const [licenseAvailable, setLicenseAvailable] = useState(true)
  const [productOptions, setProductOptions] = useState([])
  const [companyOptions, setCompanyOptions] = useState([])
  const [branchOptions, setBranchOptions] = useState([])
  const [editIndex, setEditIndex] = useState(null)
  const [popupType, setPopupType] = useState("")
  const watchedLicense = watch("licensenumber")
  const watchedTaggedLicenses = watch("taggedLicenses") || []
  const watchedTaggedLicenseDueDates = watch("taggedLicenseDueDates") || {}
  const hasTaggedLicenses =
    popupType === "Additionalservice" && watchedTaggedLicenses.length > 0
  const selectedProduct = watch("productName")
  const [tableData, setTableData] = useState([])
  const [selectedLicenseNumber, setselectedlicense] = useState(null)
  const [issamecallnote, setissamecallnote] = useState(null)
  const [showCustomerDetails, setShowCustomerDetails] = useState(false)
  const [loader, setLoader] = useState(false)
  const [showIncomingNumberToast, setshowinComingnumberToast] = useState(false)
  const [callreport, setcallReport] = useState({})
  const [customerData, setCustomerData] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [loading, setloading] = useState(false)
  const [message, setMessage] = useState("")
  const [callList, setCallList] = useState([])
  const [productDetails, setProductDetails] = useState([])
  const [user, setUser] = useState(false)
  const [searching, setSearching] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [selectedProducts, setSelectedProducts] = useState([])
  const [isRunning, setIsRunning] = useState(false) // Start with the timer running
  const [startTime, setStartTime] = useState(Date.now())
  const [formData, setFormData] = useState(null)
  const [callData, setCallData] = useState([])
  const [branch, setBranches] = useState([])
  const [callnote, setCallnotes] = useState([])
  const [selectedUserName, setselecteduserName] = useState(null)
  const [selectedCategory, setselectedCategory] = useState(null)
  const [selectedDatapopup, setselectedDataPopup] = useState({})
  const [activeUserId, setActiveUserId] = useState(null)
  const now = new Date()
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()))
  const [periodMode, setperiodMode] = useState("all")
  const [targetData, settargetData] = useState([])
  console.log(targetData)
  const [showProductPopup, setShowProductPopup] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [productlist, setproductList] = useState([])
  const [achievedproducts, setacheivedProducts] = useState([])
  const [selectedPeriod, setselectedPeriod] = useState("")
  const debounceTimeoutRef = useRef(null)
  const location = useLocation()
  const [selectedcompanyBranch, setselectedcompanyBranch] = useState(null)
  const { calldetails, token } = location?.state || {}

  const { data: registeredCall, refreshHook } = UseFetch(
    selectedCustomer?._id &&
      `/customer/getcallregister?customerid=${selectedCustomer?._id || null}`
  )
  const loggeduserBranch = useSelector(
    (state) => state.companyBranch.loggeduserbranches
  )
  const { data: productData, error: productError } = UseFetch(
    loggeduserBranch &&
      `/product/getallProducts?branchselected=${encodeURIComponent(
        JSON.stringify(loggeduserBranch)
      )}`
  )
  console.log(productData)
  const { data: branchProduct } = UseFetch(
    selectedcompanyBranch &&
      `/product/getallbranchProduct?branch=${selectedcompanyBranch}`
  )
  const { data } = UseFetch(
    user._id && `/customer/getloggeduserCurrentCalls?loggedUserId=${user._id}`
  )
  // const { data: callscount } = UseFetch("/customer/getcallregistrationlist")
  const { data: callnotes } = UseFetch("/customer/getallcallNotes")
  const handleQuillChange = (value) => {
    setValue("description", value, { shouldValidate: true }) // Update React Hook Form's value
  }
  useEffect(() => {
    setloggeduserCurrentDateCalls(data)
  }, [data])
  useEffect(() => {
    if (productData) {
      console.log(productData)
      setProductOptions(
        productData.map((product) => ({
          label: product.productName,
          value: product._id,
          shortName: product?.shortName,
          productorservicetype: product.productorservicetype
        }))
      )
    }
  }, [productData])
  useEffect(() => {
    if (selectedCategory) {
      console.log("jj")
      const Datas = targetData?.userWiseResults

      const filteredList = branchProduct
        .filter(
          (item) =>
            item.selected?.some(
              (selectedItem) =>
                String(selectedItem.category_id) ===
                String(selectedCategory?.Id)
            ) || String(item.category_id) === String(selectedCategory?.Id)
        )
        .map((item) => item.productName || item.serviceName)
      console.log(filteredList)
      setproductList(filteredList)
      console.log("J")
      console.log(targetData)

      console.log("hhh")

      console.log(Datas)
      console.log("hhhh")

      const filteredselectedCategory = Datas.flatMap(
        (user) => user.categories || []
      ).filter((item) => item.categoryId === selectedCategory?.Id)
      console.log(filteredselectedCategory)
      console.log("Hh")
      const summary = filteredselectedCategory.reduce(
        (acc, cur) => {
          acc.target += Number(cur.target || 0)
          acc.achieved += Number(cur.achieved || 0)
          acc.balance += Number(cur.balance || 0)
          return acc
        },
        { target: 0, achieved: 0, balance: 0 }
      )
      console.log("hhh")
      setselectedDataPopup(summary)
      console.log(filteredselectedCategory && filteredselectedCategory.length)
      if (filteredselectedCategory && filteredselectedCategory.length) {
        console.log("hh")
        console.log(filteredselectedCategory)
        setacheivedProducts((prev) => [
          ...prev,
          ...filteredselectedCategory.flatMap((item) =>
            (item?.products || []).map((product) => ({
              productname: product.name,
              amount: product.achieved
            }))
          )
        ])
      } else {
        setacheivedProducts([])
      }
    }
  }, [targetData])
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
      const userData = getLocalStorageItem("user")
      setselectedcompanyBranch(userData.selected[0].branch_id)

      if (userData.role !== "Admin") {
        const branches = userData.selected.map((branch) => branch.branch_id)

        setBranches(branches)
      }

      setUser(userData)
      setCallnotes(callnotes)
    }
  }, [callnotes])
  // useEffect(() => {
  //   if (user && callscount) {
  //     if (user?.role === "Admin") {
  //       setCallList(callscount)
  //     } else {
  //       const userBranchName = new Set(
  //         user?.selected?.map((branch) => branch.branchName)
  //       )

  //       const branchNamesArray = Array.from(userBranchName)

  //       const filtered = callscount.filter(
  //         (call) =>
  //           Array.isArray(call?.callregistration) && // Check if callregistration is an array
  //           call.callregistration.some((registration) => {
  //             const hasMatchingBranch =
  //               Array.isArray(registration?.branchName) && // Check if branchName is an array
  //               registration.branchName.some(
  //                 (branch) => branchNamesArray.includes(branch) // Check if any branch matches user's branches
  //               )

  //             // If user has only one branch, ensure it matches exactly and no extra branches
  //             if (branchNamesArray.length === 1) {
  //               return (
  //                 hasMatchingBranch &&
  //                 registration.branchName.length === 1 &&
  //                 registration.branchName[0] === branchNamesArray[0]
  //               )
  //             }

  //             // If user has more than one branch, just check for any match
  //             return hasMatchingBranch
  //           })
  //       )

  //       setCallList(filtered)
  //     }
  //   }
  // }, [user, callscount])
  // useEffect(() => {
  //   if (user) {
  //     const userId = user._id
  //     socket.emit("updatedCalls", userId)
  //     // Listen for initial data from the server
  //     socket.on("updatedCalls", ({ calls, user }) => {
  //       if (user?.role === "Admin") {
  //         setCallList(calls)
  //       } else {
  //         const userBranchName = new Set(
  //           user?.selected?.map((branch) => branch.branchName)
  //         )

  //         const branchNamesArray = Array.from(userBranchName)

  //         const filtered = calls.filter(
  //           (call) =>
  //             Array.isArray(call?.callregistration) && // Check if callregistration is an array
  //             call.callregistration.some((registration) => {
  //               const hasMatchingBranch =
  //                 Array.isArray(registration?.branchName) && // Check if branchName is an array
  //                 registration.branchName.some(
  //                   (branch) => branchNamesArray.includes(branch) // Check if any branch matches user's branches
  //                 )

  //               // If user has only one branch, ensure it matches exactly and no extra branches
  //               if (branchNamesArray.length === 1) {
  //                 return (
  //                   hasMatchingBranch &&
  //                   registration.branchName.length === 1 &&
  //                   registration.branchName[0] === branchNamesArray[0]
  //                 )
  //               }

  //               // If user has more than one branch, just check for any match
  //               return hasMatchingBranch
  //             })
  //         )

  //         setCallList(filtered)
  //       }
  //     })

  //     //Cleanup the socket connection when the component unmounts
  //     return () => {
  //       socket.off("updatedCalls")
  //       socket.disconnect()
  //     }
  //   }
  // }, [user])
  // Cleanup the timeout if the component unmounts
  useEffect(() => {
    return () => clearTimeout(debounceTimeoutRef.current)
  }, [])

  useEffect(() => {
    const handler = setTimeout(() => {
      if (search && !selectedCustomer) {
        console.log("H")
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

          // /// If a matching registration is found, extract the product details
          const productId = matchingRegistration?.product?._id

          const matchingProducts =
            callData.callDetails?.customerid?.selected.filter(
              (product) => product?.product_id === productId
            )
          setSearch(callData?.callDetails?.customerid?.customerName)
          setSelectedCustomer(callData?.callDetails?.customerid)
          if (matchingProducts.length === 0 && productId) {
            setProductDetails([
              {
                product_id: matchingRegistration.product._id,
                licensenumber: matchingRegistration.license,
                productName: matchingRegistration.product.productName,
                branchName: matchingRegistration.product.selected[0].branchName,
                note: "The product has been upgraded or changed after your previous call and no longer exists for this customer."
              }
            ])
          } else if (productId === undefined) {
            const matchedLicenseofthecustomer = matchingRegistration.license

            const matchingproducts =
              callData.callDetails.customerid.selected.filter(
                (item) => item.licensenumber === matchedLicenseofthecustomer
              )
            setProductDetails(matchingproducts)
          } else {
            setProductDetails(matchingProducts)
          }

          const editData = {
            incomingNumber: matchingRegistration?.formdata?.incomingNumber,
            token: matchingRegistration?.timedata?.token,
            description: matchingRegistration?.formdata?.description,
            solution: matchingRegistration?.formdata?.solution,
            status: matchingRegistration?.formdata?.status,
            callnote: matchingRegistration?.formdata?.callnote
              ? `${matchingRegistration?.formdata?.callnote._id}|${matchingRegistration?.formdata?.callnote?.callNotes}`
              : ""
          }
          setLoader(false)
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
    setLoader(true)
    const response = await fetch(
      `https://www.crmtest.camet.in/api/customer/getcallregister/${callId}`,
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
      setSelectedProducts([product])
    } else if (selectedProducts.productName === product.productName) {
      setSelectedProducts([]) // Deselect if it was previously selected
    }
  }
  const formatDateToDDMMYYYY = (dateValue) => {
    if (!dateValue) return ""
    const date = new Date(dateValue)
    if (Number.isNaN(date.getTime())) return ""
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
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
  const handleMoreClick = (id, name) => {
    const Datas = targetData?.userWiseResults
    console.log(id)
    console.log(name)
    console.log("hh")
    const filteredList = branchProduct
      .filter(
        (item) =>
          item.selected?.some(
            (selectedItem) => String(selectedItem.category_id) === String(id)
          ) || String(item.category_id) === String(id)
      )
      .map((item) => item.productName || item.serviceName)
    console.log(filteredList)
    setproductList(filteredList)
    setselectedCategory({ Id: id, categoryName: name })
    console.log("J")
    console.log(targetData)
    console.log(user?._id)

    // const filteredselectedCategory =
    //   filteredloggedUserItem[0].categories.filter(
    //     (item) => item.categoryId === id
    //   )
    const filteredselectedCategory = Datas.flatMap(
      (user) => user.categories || []
    ).filter((item) => item.categoryId === id)
    console.log("Hh")
    const summary = filteredselectedCategory.reduce(
      (acc, cur) => {
        acc.target += Number(cur.target || 0)
        acc.achieved += Number(cur.achieved || 0)
        acc.balance += Number(cur.balance || 0)
        return acc
      },
      { target: 0, achieved: 0, balance: 0 }
    )
    console.log("hhh")
    setselectedDataPopup(summary)
    console.log(filteredselectedCategory && filteredselectedCategory.length)
    if (filteredselectedCategory && filteredselectedCategory.length) {
      setacheivedProducts((prev) => [
        ...prev,
        ...filteredselectedCategory.flatMap((item) =>
          (item?.products || []).map((product) => ({
            productname: product.name,
            amount: product.achieved
          }))
        )
      ])
    } else {
      setacheivedProducts([])
    }
    setOpenModal(true)
  }
  const handleSelectedUser = (category, userId, userName) => {
    setActiveUserId(userId)
    setselecteduserName(userName)
    setselectedCategory({
      Id: category.Id,
      categoryName: category.categoryName
    })
    const filteredloggedUserItem = data?.userWiseResults.filter(
      (item) => item.userId === userId
    )
    const filteredselectedCategory =
      filteredloggedUserItem[0].categories.filter(
        (item) => item.categoryId === category.Id
      )
    const summary = filteredselectedCategory.reduce(
      (acc, cur) => {
        acc.target += Number(cur.target || 0)
        acc.achieved += Number(cur.achieved || 0)
        acc.balance += Number(cur.balance || 0)
        return acc
      },
      { target: 0, achieved: 0, balance: 0 }
    )

    setselectedDataPopup(summary)
    if (filteredselectedCategory && filteredselectedCategory.length) {
      // setacheivedProducts(
      //   filteredselectedCategory[0]?.products?.map((product) => ({
      //     productname: product.name,
      //     amount: product.achieved
      //   })) || []
      // )
      setacheivedProducts(
        filteredselectedCategory.flatMap((item) =>
          (item.products || []).map((product) => ({
            productname: product.name,
            amount: product.achieved
          }))
        )
      )
    } else {
      setacheivedProducts([])
    }
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
    console.log(product)

    setSubmitLoading(true)

    const userData = localStorage.getItem("user")
    const user = JSON.parse(userData)

    const endTime = new Date().toISOString()
    const durationInSeconds = timeStringToSeconds(time)
    // Save timer value in local storage
    if (!token) {
      const branchName = product?.branch_id?.branchName

      const uniqueToken = generateUniqueNumericToken()

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

        updatedformData.completedBy = [] // Clear completedBy if status is pending
      } else if (updatedformData.status === "solved") {
        updatedformData.attendedBy = {
          callerId: user._id,
          role: user?.role,
          duration: timeData?.duration,
          calldate: startTime
        }
        updatedformData.completedBy = {
          callerId: user._id,
          role: user.role,
          duration: timeData?.duration,
          calldate: startTime
        }
        // Set both attendedBy and completedBy if status is solved
      }
      const calldata = {
        product: selectedProducts[0]?.product_id,
        license: selectedProducts[0]?.licensenumber,
        branchName: Array.isArray(selectedProducts[0]?.branch_id?.branchName)
          ? selectedProducts[0]?.branch_id?.branchName
          : [selectedProducts[0]?.branch_id?.branchName],

        timedata: timeData,
        formdata: updatedformData,
        customeremail: selectedCustomer?.email,
        customerName: selectedCustomer?.customerName,
        productName: selectedProducts[0]?.productName
      }

      setcallReport(calldata)

      if (!calldata.branchName) {
        console.log(calldata.branchName)
        alert("Unable to load branch details. Please refresh and try again.")

        return
      }
      console.log(calldata)

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
        setSubmitLoading(false)

        setSelectedProducts([])
        setSelectedCustomer(null)
        setCustomerData([])
        setSearching(false)
        // socket.emit("updatedCalls")
        sendWhatapp(calldata, selectedText)
        setSearch("")
      } else if (response.status === 207) {
        setSubmitLoading(false)
        toast.success(response.data.message)
        setSelectedProducts([])
        setSelectedCustomer(null)
        setCustomerData([])
        setSearching(false)
        // socket.emit("updatedCalls")
        sendWhatapp(calldata, selectedText)
        setSearch("")
      } else {
        toast.error(response.data.message)
      }
    } else {
      const branchName = product?.branch_id?.branchName
      console.log(branchName)
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
          role: user.role,
          duration: timeData.duration,
          calldate: startTime
        }
        // Set both attendedBy and completedBy if status is solved
      }

      const calldata = {
        product: selectedProducts[0]?.product_id,
        license: selectedProducts[0]?.licensenumber,

        branchName: Array.isArray(selectedProducts[0]?.branchName)
          ? selectedProducts[0]?.branchName
          : [selectedProducts[0]?.branchName],
        timedata: timeData,
        formdata: updatedformData,
        customeremail: selectedCustomer.email,
        customerName: selectedCustomer.customerName,
        productName: selectedProducts[0]?.productName
      }

      setcallReport(calldata)
      if (!calldata.branchName) {
        console.log("if branchname is null", calldata.branchName)
        alert("Unable to load branch details. Please refresh and try again.")

        return
      }
      console.log(calldata)

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
        setSubmitLoading(false)
        setCustomerData([])
        setSearch("")
        setSearching(false)
        setSelectedCustomer(null)
        setSelectedProducts([])
        // socket.emit("updatedCalls")
        sendWhatapp(calldata, selectedText)
      } else if (response.status === 207) {
        setSubmitLoading(false)
        setCustomerData([])
        setSearch("")
        setSearching(false)
        setSelectedCustomer(null)
        setSelectedProducts([])
        // socket.emit("updatedCalls")
        sendWhatapp(calldata, selectedText)
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message)
      }
    }
    setselectedlicense(null)
  }
  const closePopup = () => {
    setShowProductPopup(false)
    setPopupType("")
    setEditIndex(null)
    // clearErrors()
  }
  const handleEdit = (item, index) => {
    console.log(item)
    console.log(index)
    setPopupType(item?.productorservicetype)
    setEditIndex(index)

    const productOption = productOptions.find(
      (p) => p.value === item?.product_id
    ) || {
      label: item?.product_id?.productName,
      value: item?.product_id
    }

    const companyOption = item?.company_id
      ? { label: item?.company_id?.companyName, value: item?.company_id }
      : null

    const branchOption = item?.branch_id
      ? { label: item?.branch_id?.branchName, value: item?.branch_id }
      : null

    const taggedLicensesFromData =
      item?.taggeddata?.map((entry) => String(entry?.licensenumber)) ||
      item?.taggedLicenses ||
      []

    const taggedLicenseDueDatesFromData =
      item?.taggeddata?.reduce((acc, entry) => {
        if (entry?.licensenumber) {
          acc[String(entry.licensenumber)] = entry?.nextDue || ""
        }
        return acc
      }, {}) || {}

    setCompanyOptions(getCompaniesForProduct(item?.productid))
    setBranchOptions(getBranchesForCompany(item?.productid, item?.companyid))
    console.log(item)
    reset({
      ...getValues(),
      productName: productOption,
      companyName: companyOption,
      branchName: branchOption,
      licensenumber: item?.licensenumber || "",
      softwareTrade: item?.softwareTrade || "",
      applicationDate: item?.applicationDate || "",
      nextDue: item?.nextDue || "",
      noofusers: item?.noofusers || "",
      productAmount: item?.productAmount || "",
      isActive: item?.isActive || "Running",
      taggedLicenses: taggedLicensesFromData,
      taggedLicenseDueDates: taggedLicenseDueDatesFromData
    })

    setShowProductPopup(true)
  }
  console.log(selectedLicenseNumber)
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
    const Description = `${calldata.formdata.description}`
    const textToShare = `${calldata.customerName} - ${phoneNumber}\nCallnote: ${callnote}\nDescription:${Description}`

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
      url = `https://www.crmtest.camet.in/api/customer/getCustomer?search=${query}&role=${user.role}`
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
        branches.length > 0 &&
        `https://www.crmtest.camet.in/api/customer/getCustomer?search=${query}&role=${
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
  const softwareTrades = [
    "Agriculture",
    "Business Services",
    "Computer Hardware Software",
    "Electronics Electrical Supplies",
    "FMCG-Fast Moving Consumable Goods",
    "Garment,Fashion Apparel",
    "Health Beauty",
    "Industrial Supplies",
    "Jewelry Gemstones",
    "Mobile Accessories",
    "Pharmaceutical Chemicals",
    "Textiles Chemicals",
    "Textiles Fabrics",
    "Others",
    "Restaurant, Food And Beverage",
    "Accounts Chartered Account",
    "Stationery, Printing Publishing",
    "Hotel",
    "Pipes, Tubes Fittings"
  ]
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
    setselectedlicense(null)
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
  const getCompaniesForProduct = (productId) => {
    const product = productData?.find((item) => item._id === productId)
    if (!product) return []

    const seen = new Set()
    return product.selected.reduce((acc, company) => {
      if (!seen.has(company.company_id)) {
        seen.add(company.company_id)
        acc.push({
          label: company.companyName,
          value: company.company_id
        })
      }
      return acc
    }, [])
  }
  const primaryLicenseOptions = useMemo(() => {
    return [
      ...new Set(
        tableData
          .filter(
            (item) =>
              String(item?.productorservicetype).toLowerCase() ===
              "primaryproduct"
          )
          .map((item) => String(item?.licensenumber).trim())
          .filter(Boolean)
      )
    ]
  }, [tableData])
  const getBranchesForCompany = (productId, companyId) => {
    const product = productData?.find((item) => item._id === productId)
    if (!product) return []

    return product.selected
      .filter((c) => c.company_id === companyId)
      .map((branch) => ({
        label: branch.branchName,
        value: branch.branch_id
      }))
  }
  const handleRowClick = (customer, lic) => {
    console.log(customer)
    console.log(lic)
    const fetchCustomer = async () => {
      try {
        setLoader(true)
        // Replace with your actual API endpoint and customer id
        const response = await api.get(
          `/customer/getselectedcustomerforCall/${customer._id}`
        )
        setLoader(false)
        const data = response.data.data
        setSelectedCustomer(data[0])
        setSearch(data[0].customerName)

        // Do something with the fetched data
        console.log("Fetched customer:", response.data.data)
        setProductDetails(data[0].selected)
        const selectedData =
          data[0].selected?.map((sel) => ({
            company_id: sel?.company_id?._id,
            companyName: sel?.company_id?.companyName,
            branch_id: sel?.branch_id?._id,
            branchName: sel?.branch_id?.branchName,
            product_id: sel?.product_id?._id,
            productName: sel?.product_id?.productName,
            shortName: sel?.product_id?.shortName,
            licensenumber: sel?.licensenumber,
            softwareTrade: sel?.softwareTrade,
            applicationDate: sel?.applicationDate || sel?.customerAddDate,
            nextDue:
              sel?.nextDue ||
              sel?.amcendDate ||
              sel?.licenseExpiryDate ||
              sel?.tvuexpiryDate,
            noofusers: sel?.noofusers,
            productAmount:
              sel?.amount ||
              sel?.productAmount ||
              sel?.amcAmount ||
              sel?.tvuAmount,
            isActive: sel?.isActive || "Running",
            productorservicetype: sel?.product_id?.productorservicetype,
            taggedLicenses:
              sel?.taggedLicenses ||
              sel?.licenseNumbers ||
              sel?.taggeddata?.map((item) => String(item?.licensenumber)) ||
              [],
            taggeddata: sel?.taggeddata || []
          })) || []
        setTableData(selectedData)
        const filteredlicenseproduct = data[0].selected.filter(
          (item) => item.licensenumber === lic
        )
        console.log(filteredlicenseproduct)
        setSelectedProducts(filteredlicenseproduct)
        setselectedlicense(lic)
        // For example, set it to state to display in a modal or another component
        // setSelectedCustomer(data);
      } catch (error) {
        console.error("Error fetching customer:", error)
      }
    }

    fetchCustomer()
    setSearching(false)
    setCallData([])

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
    }

    // Additional actions can be performed here (e.g., populate form fields)
  }
  const hanldeCheckforsamecallnoteforsamecustomer = (data) => {
    const callnoteId = data.split("|")[0]

    const checkcallnote = async () => {
      try {
        const response = await api.get(
          `/customer/checkexistsamecallnote?customerId=${selectedCustomer._id}&callNoteId=${callnoteId}`
        )
        setissamecallnote(response.data.exists)

        setIsModalOpen(response.data.exists)

        console.log("checkcallnotexists", response.data.exists)
      } catch (error) {
        console.log("error", error)
      }
    }
    checkcallnote()
  }
  const primaryProducts = useMemo(() => {
    return productDetails.filter(
      (item) =>
        String(item?.productorservicetype).toLowerCase() === "primaryproduct"
    )
  }, [productDetails])
  const additionalServices = useMemo(() => {
    return productDetails.filter(
      (item) =>
        String(item?.productorservicetype).toLowerCase() === "additionalservice"
    )
  }, [productDetails])
  console.log(primaryProducts)
  const onSubmit = async (data) => {
    if (selectedProducts && selectedProducts?.length === 0) {
      // alert("please select aprodut")
      toast.error("Please select a product", {
        position: "top-center",
        autoClose: 3000 // 3 seconds
      })
      return
    } else if (issamecallnote) {
      setIsModalOpen(true)
    } else {
      setIsRunning(false)
    }

    setFormData(data)
  }
  const PopupField = ({ label, children, error }) => {
    return (
      <div>
        <label className="mb-1 block text-[12px] font-medium text-[#5d6983]">
          {label}
        </label>
        {children}
        {error ? (
          <p className="mt-1 text-[11px] text-red-500">{error}</p>
        ) : null}
      </div>
    )
  }
  const ProductCircleCard = ({
    item,
    actualIndex,
    variant,
    topBadgeIcon,
    isSelected,
    line1,
    line2,
    line3,
    line4,
    onEdit,
    onDelete
  }) => {
    const variantClass =
      variant === "danger"
        ? "bg-[#ffdedd] border-[#f4c6c2]"
        : variant === "service"
          ? "bg-[#fff3c9] border-[#f0e1a2]"
          : "bg-[#dff3d2] border-[#cce6bc]"
    console.log(line3)
console.log(line2)
    return (
     
      <div className="group relative">
        <button
          type="button"
          onClick={() => onEdit(item, actualIndex)}
          className={`relative flex h-[108px] w-[108px] flex-col items-center justify-center rounded-full border text-center shadow-sm transition hover:scale-[1.02] ${variantClass}`}
        >
          {isSelected && (
            <div className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full border border-emerald-200 bg-emerald-500 text-white shadow-md">
              <Check size={14} strokeWidth={3} />
            </div>
          )}

          <div className="mb-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-[#4e5a72] shadow-sm">
            {topBadgeIcon}
          </div>

          <p className="px-2 text-[9.5px] font-semibold leading-3 text-[#1e293b]">
            {line1}
          </p>

          {line2 ? (
            <p className="mt-1 px-2 text-[12px] leading-3 text-[#4b5563] font-medium">
              {line2}
            </p>
          ) : null}

          {line3 ? (
            <p className="mt-1 px-2 text-[12px] leading-3 text-[#4b5563] font-medium">
              {line3}
            </p>
          ) : null}

          {line4 ? (
            <p className="mt-1 px-2 text-[8.5px] font-semibold leading-3 text-[#d35c5c]">
              {line4}
            </p>
          ) : null}
        </button>
      </div>
    )
  }
  const filteredOptionsByType = useMemo(() => {
    return productOptions.filter(
      (item) =>
        String(item?.productorservicetype).toLowerCase() ===
        String(popupType).toLowerCase()
    )
  }, [productOptions, popupType])
  const compactSelectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "36px",
      borderRadius: "8px",
      borderColor: state.isFocused ? "#7ba7ff" : "#dfe5ee",
      boxShadow: "none",
      fontSize: "12px",
      "&:hover": {
        borderColor: "#7ba7ff"
      }
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0 8px"
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: "36px"
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999
    })
  }
  return (
    // <div className="h-full bg-[#ADD8E6] overflow-hidden">
    //   <div className="flex h-full flex-row">
    //     <StaticSidebar
    //       handleMoreClick={handleMoreClick}
    //       selectedCompanyBranch={selectedcompanyBranch}
    //       setselectedCompanyBranch={setselectedcompanyBranch}
    //       parenttargetData={settargetData}
    //       parentperiodmode={setperiodMode}
    //       parentyear={setSelectedYear}
    //       setselectedPeriod={setselectedPeriod}
    //     />
    //     <div className="flex flex-1 flex-col overflow-hideen">
    //       <header className="flex items-center justify-between border-b border-white/10 bg-[#0F172A]/95">
    //         {user?.role?.toLowerCase() === "admin" ? (
    //           <AdminHeader hide={true} />
    //         ) : (
    //           <StaffHeader hide={true} />
    //         )}

    //         <div className="flex items-center gap-1.5  border-b border-white/10 bg-[#0F172A]/95 pr-3 h-full">
    //           <button className="rounded-full p-1.5 transition bg-slate-100">
    //             <Mail size={15} strokeWidth={2.2} />
    //           </button>
    //           <div className="relative">
    //             <button className="rounded-full p-1.5 transition bg-slate-100">
    //               <MessageSquareText size={15} strokeWidth={2.2} />
    //             </button>
    //             <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-500" />
    //           </div>
    //           <button className="rounded-full p-1.5 transition bg-slate-100">
    //             <Settings size={15} strokeWidth={2.2} />
    //           </button>
    //           {/* <button className="rounded-full p-1.5 transition bg-slate-100">
    //             <User size={15} strokeWidth={2.2} />
    //           </button> */}

    //           <div className="relative">
    //             <button
    //               onClick={(e) => {
    //                 e.stopPropagation()
    //                 setShowUserMenu((prev) => !prev)
    //               }}
    //               className="rounded-full p-1.5 transition bg-slate-100"
    //             >
    //               <User size={15} strokeWidth={2.2} />
    //             </button>

    //             {/* {showUserMenu && (
    //               <div
    //                 onClick={(e) => e.stopPropagation()}
    //                 className="absolute right-0 mt-2 w-32 bg-white border border-slate-200 rounded-md shadow-lg z-50"
    //               >
    //                 <button
    //                   onClick={handleLogout}
    //                   className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
    //                 >
    //                   Logout
    //                 </button>
    //               </div>
    //             )} */}
    //           </div>
    //         </div>
    //       </header>
    //       {loader && (
    //         <BarLoader
    //           cssOverride={{ width: "100%", height: "4px" }} // Tailwind's `h-4` corresponds to `16px`
    //           color="#4A90E2" // Change color as needed
    //           // loader={true}
    //         />
    //       )}
    //       <div className=" justify-center items-center p-8 h-auto">
    //         <div className="w-auto bg-white shadow-lg rounded  p-8 mx-auto h-auto">
    //           <div className="flex justify-between ">
    //             <h2 className="text-2xl font-semibold mb-4">
    //               Call Registration
    //             </h2>
    //             <div>
    //               <Link
    //                 to={user?.role === "Admin" ? "/admin/home" : "/staff/home"}
    //                 className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 px-2 py-1 rounded-md shadow-lg cursor-pointer"
    //               >
    //                 Go Home
    //               </Link>
    //             </div>
    //           </div>

    //           <hr className="border-t-2 border-gray-300 mb-4"></hr>
    //           <div className="w-2/4 ">
    //             <div className="relative">
    //               <label
    //                 htmlFor="customerName"
    //                 className="block text-sm font-medium text-gray-700"
    //               >
    //                 Search Customer
    //               </label>
    //               <div className="relative">
    //                 <input
    //                   type="text"
    //                   id="customerName"
    //                   value={search}
    //                   // defaultValue={calldetails ? name : search}
    //                   onChange={handleInputChange}
    //                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 pr-10 sm:text-sm focus:border-gray-500 outline-none"
    //                   placeholder="Enter name or license..."
    //                 />
    //                 {loading && (
    //                   <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
    //                     <ClipLoader
    //                       color="#36D7B7"
    //                       loading={loading}
    //                       size={20}
    //                     />
    //                   </div>
    //                 )}
    //               </div>
    //             </div>
    //           </div>
    //           {!search &&
    //             loggeduserCurrentDateCalls &&
    //             loggeduserCurrentDateCalls?.length > 0 && (
    //               <>
    //                 {loggeduserCurrentDateCalls?.length > 0 && (
    //                   <>
    //                     <h1 className="text-xl inline-block border-b-2 border-black mt-3">
    //                       Your Today's Call list
    //                     </h1>
    //                     <div className="mt-2 overflow-y-auto w-full max-h-[calc(100vh-300px)]  text-center relative rounded-lg">
    //                       <table className="w-full divide-y divide-gray-200 rounded-xl shadow-lg">
    //                         {/* Table Header */}
    //                         <thead
    //                           className={`${
    //                             isModalOpen ? "" : "sticky top-0 z-50"
    //                           } bg-purple-200  `}
    //                         >
    //                           <tr>
    //                             <th className="px-6 py-5 text-xs font-medium text-gray-800 uppercase tracking-wider">
    //                               Customer Name
    //                             </th>
    //                             <th className="px-6 py-5 text-xs font-medium text-gray-800 uppercase tracking-wider">
    //                               Token No
    //                             </th>
    //                             <th className="px-6 py-5 text-xs font-medium text-gray-800 uppercase tracking-wider">
    //                               Product Name
    //                             </th>
    //                             <th className="px-6 py-5 text-xs font-medium text-gray-800 uppercase tracking-wider">
    //                               Start Date
    //                             </th>
    //                             <th className="px-6 py-5 text-xs font-medium text-gray-800 uppercase tracking-wider">
    //                               End Date
    //                             </th>
    //                             <th className="px-6 py-5 text-xs font-medium text-gray-800 uppercase tracking-wider">
    //                               Duration
    //                             </th>
    //                             <th className="px-6 py-5 text-xs font-medium text-gray-800 uppercase tracking-wider">
    //                               Incoming Number
    //                             </th>
    //                             <th className="px-6 py-5 text-xs font-medium text-gray-800 uppercase tracking-wider">
    //                               AttendedBy
    //                             </th>
    //                             <th className="px-6 py-5 text-xs font-medium text-gray-800 uppercase tracking-wider">
    //                               CompletedBy
    //                             </th>
    //                             <th className="px-6 py-5 text-xs font-medium text-gray-800 uppercase tracking-wider">
    //                               Status
    //                             </th>
    //                           </tr>
    //                         </thead>

    //                         {/* Sorting Calls: Pending Calls First, Then Latest Calls */}
    //                         <tbody className="divide-gray-500">
    //                           {loggeduserCurrentDateCalls
    //                             .flatMap((customer) =>
    //                               customer.callregistration.map((call) => ({
    //                                 ...call,
    //                                 customerName: customer.customerName
    //                               }))
    //                             )
    //                             .sort((a, b) => {
    //                               if (
    //                                 a.formdata?.status === "pending" &&
    //                                 b.formdata?.status !== "pending"
    //                               )
    //                                 return -1
    //                               if (
    //                                 b.formdata?.status === "pending" &&
    //                                 a.formdata?.status !== "pending"
    //                               )
    //                                 return 1
    //                               return (
    //                                 new Date(b.timedata?.startTime) -
    //                                 new Date(a.timedata?.startTime)
    //                               )
    //                             })
    //                             .map((call, index) => {
    //                               const today = new Date()
    //                                 .toISOString()
    //                                 .split("T")[0]
    //                               const callDate = call.timedata?.startTime
    //                                 ? new Date(
    //                                     call.timedata?.startTime.split(" ")[0]
    //                                   )
    //                                     .toISOString()
    //                                     .split("T")[0]
    //                                 : null

    //                               return (
    //                                 <React.Fragment key={index}>
    //                                   {/* Main Call Row */}
    //                                   <tr
    //                                     className={`border-0 ${
    //                                       call.formdata?.status === "solved"
    //                                         ? "bg-[linear-gradient(135deg,_rgba(0,140,0,1),_rgba(128,255,128,1))]"
    //                                         : call.formdata?.status ===
    //                                             "pending"
    //                                           ? callDate === today
    //                                             ? "bg-[linear-gradient(135deg,_rgba(255,255,1,1),_rgba(255,255,128,1))]"
    //                                             : "bg-[linear-gradient(135deg,_rgba(255,0,0,1),_rgba(255,128,128,1))]"
    //                                           : "bg-[linear-gradient(135deg,_rgba(255,0,0,1),_rgba(255,128,128,1))]"
    //                                     }`}
    //                                   >
    //                                     <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
    //                                       {call.customerName}
    //                                     </td>
    //                                     <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
    //                                       {call.timedata?.token}
    //                                     </td>
    //                                     <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
    //                                       {call.productDetails[0]?.productName}
    //                                     </td>
    //                                     <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
    //                                       {new Date(
    //                                         call.timedata?.startTime
    //                                       ).toLocaleString()}
    //                                     </td>
    //                                     <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
    //                                       {new Date(
    //                                         call.timedata?.endTime
    //                                       ).toLocaleString()}
    //                                     </td>
    //                                     <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
    //                                       {call.timedata?.time}
    //                                     </td>
    //                                     <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
    //                                       {call.formdata?.incomingNumber}
    //                                     </td>
    //                                     <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
    //                                       {call.formdata?.attendedBy
    //                                         ?.map((attendee) => attendee.name)
    //                                         .join(", ") || ""}
    //                                     </td>
    //                                     <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
    //                                       {call.formdata?.completedBy
    //                                         ?.map((completer) => completer.name)
    //                                         .join(", ") || ""}
    //                                     </td>
    //                                     <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
    //                                       {call.formdata?.status}
    //                                     </td>
    //                                   </tr>

    //                                   {/* Description & Solution Row */}
    //                                   <tr
    //                                     className={`text-center border-t-0 border-black ${
    //                                       call.formdata?.status === "solved"
    //                                         ? "bg-[linear-gradient(135deg,_rgba(0,140,0,1),_rgba(128,255,128,1))]"
    //                                         : call.formdata?.status ===
    //                                             "pending"
    //                                           ? callDate === today
    //                                             ? "bg-[linear-gradient(135deg,_rgba(255,255,1,1),_rgba(255,255,128,1))]"
    //                                             : "bg-[linear-gradient(135deg,_rgba(255,0,0,1),_rgba(255,128,128,1))]"
    //                                           : "bg-[linear-gradient(135deg,_rgba(255,0,0,1),_rgba(255,128,128,1))]"
    //                                     }`}
    //                                     style={{ height: "5px" }}
    //                                   >
    //                                     <td
    //                                       colSpan="5"
    //                                       className="py-1 px-8 text-sm text-black text-left"
    //                                     >
    //                                       <strong>Description:</strong>{" "}
    //                                       {call.formdata?.description || "N/A"}
    //                                     </td>
    //                                     <td
    //                                       colSpan="5"
    //                                       className="py-1 px-12 text-sm text-black text-left"
    //                                     >
    //                                       <strong>Solution:</strong>{" "}
    //                                       {call.formdata?.solution || "N/A"}
    //                                     </td>
    //                                   </tr>
    //                                 </React.Fragment>
    //                               )
    //                             })}
    //                         </tbody>
    //                       </table>
    //                     </div>
    //                   </>
    //                 )}
    //               </>
    //             )}

    //           {searching && customerData?.length > 0 ? (
    //             <div className=" w-2/4 max-h-40 overflow-y-auto overflow-x-auto  mt-4 border border-gray-200 shadow-md rounded-lg">
    //               {/* Wrap the table in a div with border */}
    //               <table className="min-w-full bg-white">
    //                 <thead className="sticky top-0 z-30 bg-green-300 border-b border-green-300 shadow">
    //                   {/* Add a bottom border to the <thead> */}
    //                   <tr>
    //                     <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
    //                       Customer Name
    //                     </th>
    //                     <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
    //                       License No
    //                     </th>
    //                     <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
    //                       Mobile No
    //                     </th>
    //                   </tr>
    //                 </thead>
    //                 <tbody className="divide-y divide-gray-200">
    //                   {customerData?.map((customer, index) =>
    //                     customer?.selected?.map((item, subIndex) => (
    //                       <tr
    //                         key={`${index}-${subIndex}`} // Ensure unique key for each row
    //                         onClick={() => handleRowClick(customer)}
    //                         className="cursor-pointer hover:bg-gray-50 transition-colors"
    //                       >
    //                         <td className="px-4 py-3 text-center text-sm text-gray-700">
    //                           {customer?.customerName}
    //                         </td>
    //                         <td className="px-4 py-3 text-center text-sm text-gray-700">
    //                           {item?.licensenumber}
    //                         </td>
    //                         <td className="px-4 py-3 text-center text-sm text-gray-700">
    //                           {customer?.mobile}
    //                         </td>
    //                       </tr>
    //                     ))
    //                   )}
    //                 </tbody>
    //               </table>
    //             </div>
    //           ) : (
    //             <div className="text-red-500 ml-5">{message}</div>
    //           )}

    //           {selectedCustomer && (
    //             <>
    //               <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-3 bg-[#4888b9] shadow-md rounded p-5">
    //                 <div className="">
    //                   <h4 className="text-md font-bold text-white">
    //                     Customer Name
    //                   </h4>
    //                   <p className="text-white">
    //                     {selectedCustomer.customerName}
    //                   </p>
    //                 </div>
    //                 <div className="">
    //                   <h4 className="text-md font-bold text-white">Email</h4>
    //                   <p className="text-white">{selectedCustomer.email}</p>
    //                 </div>
    //                 <div className="">
    //                   <h4 className="text-md font-bold text-white">Mobile</h4>
    //                   <p className="text-white">{selectedCustomer.mobile}</p>
    //                 </div>
    //                 <div className=" ">
    //                   <h4 className="text-md font-bold text-white">
    //                     Address 1
    //                   </h4>
    //                   <p className="text-white">{selectedCustomer.address1}</p>
    //                 </div>
    //                 <div className="">
    //                   <h4 className="text-md font-bold text-white">
    //                     Address 2
    //                   </h4>
    //                   <p className="text-white">{selectedCustomer.address2}</p>
    //                 </div>
    //                 <div className="">
    //                   <h4 className="text-md font-bold text-white">City</h4>
    //                   <p className="text-white">{selectedCustomer.city}</p>
    //                 </div>
    //                 <div className="">
    //                   <h4 className="text-md font-bold text-white">State</h4>
    //                   <p className="text-white">{selectedCustomer.state}</p>
    //                 </div>
    //                 <div className=" ">
    //                   <h4 className="text-md font-bold text-white">Country</h4>
    //                   <p className="text-white">{selectedCustomer.country}</p>
    //                 </div>
    //                 <div className="">
    //                   <h4 className="text-md font-bold text-white">Pincode</h4>
    //                   <p className="text-white">{selectedCustomer.pincode}</p>
    //                 </div>
    //                 <div className="">
    //                   <h4 className="text-md font-bold text-white">Landline</h4>
    //                   <p className="text-white">
    //                     {selectedCustomer.landline || "N/A"}
    //                   </p>
    //                 </div>
    //                 <div className="">
    //                   <h4 className="text-md font-bold text-white">
    //                     Partnership
    //                   </h4>
    //                   <p className="text-white">
    //                     {selectedCustomer?.partner?.[0]?.partner ||
    //                       selectedCustomer?.partner?.partner ||
    //                       "N/A"}
    //                   </p>
    //                 </div>
    //                 <div className="">
    //                   <h4 className="text-md font-bold text-white">Industry</h4>
    //                   <p className="text-white">
    //                     {selectedCustomer?.industry || "N/A"}
    //                   </p>
    //                 </div>
    //                 <div className="">
    //                   <h4 className="text-md font-bold text-white">Status</h4>
    //                   <p
    //                     className={`bg-clip-text text-transparent ${
    //                       selectedCustomer.selected.some(
    //                         (item) => item.isActive === "Running"
    //                       )
    //                         ? "bg-gradient-to-r from-lime-400 via-green-500 to-emerald-600"
    //                         : "bg-gradient-to-r from-red-400 via-red-500 to-orange-600"
    //                     } text-lg font-bold `}
    //                   >
    //                     {selectedCustomer.selected.some(
    //                       (item) => item.isActive === "Running"
    //                     )
    //                       ? "Active"
    //                       : "Inactive"}
    //                   </p>
    //                 </div>
    //                 <div className="">
    //                   <h4 className="text-md font-bold text-white">
    //                     Reason of Status
    //                   </h4>
    //                   <p className="text-white">
    //                     {selectedCustomer.reasonofStatus || "N/A"}
    //                   </p>
    //                 </div>
    //               </div>
    //               <div className="mt-6 w-lg ">
    //                 <div className="mb-2 ">
    //                   <h3 className="text-lg font-medium text-gray-900">
    //                     Product Details List
    //                   </h3>
    //                   {/* <button onClick={fetchData}>update</button>c */}
    //                 </div>
    //                 <div className=" w-lg max-h-30 overflow-x-auto text-center overflow-y-auto border border-gray-300 rounded-lg">
    //                   <table className=" m-w-full divide-y divide-gray-200 shadow">
    //                     <thead
    //                       className={`${
    //                         isModalOpen ? "" : "sticky top-0 z-30"
    //                       } bg-green-300`}
    //                     >
    //                       <tr>
    //                         <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                           select
    //                         </th>
    //                         <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                           Product Name
    //                         </th>
    //                         <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                           License No
    //                         </th>
    //                         <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                           Installed Date
    //                         </th>

    //                         <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                           License expiry
    //                         </th>
    //                         <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                           License Remaing
    //                         </th>

    //                         <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                           Amc startDate <br /> (D-M-Y)
    //                         </th>
    //                         <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                           Amc endDate <br /> (D-M-Y)
    //                         </th>
    //                         <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                           Amc Remaining
    //                         </th>

    //                         <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                           Tvu expiry
    //                         </th>
    //                         <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                           Tvu Remaining
    //                         </th>
    //                         <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                           No.of Users
    //                         </th>
    //                         <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                           Version
    //                         </th>

    //                         {user.role === "Admin" && (
    //                           <>
    //                             <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                               Company Name
    //                             </th>
    //                             <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                               Branch Name
    //                             </th>
    //                             <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                               Product Amount
    //                             </th>
    //                             <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                               Tvu Amount
    //                             </th>
    //                             <th className="px-4 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                               Amc Amount
    //                             </th>
    //                           </>
    //                         )}
    //                       </tr>
    //                     </thead>
    //                     <tbody className="divide-y divide-gray-300">
    //                       {productDetails?.map((product, index) => (
    //                         <tr key={index}>
    //                           <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
    //                             <input
    //                               className="form-checkbox h-4 w-4 text-blue-600 hover:bg-blue-200 focus:ring-blue-500 cursor-pointer"
    //                               checked={selectedProducts.some(
    //                                 (p) =>
    //                                   p.productName === product?.productName
    //                               )}
    //                               type="checkbox"
    //                               onChange={(e) =>
    //                                 handleCheckboxChange(e, product)
    //                               }
    //                             />
    //                           </td>
    //                           <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
    //                             {product?.productName}
    //                           </td>
    //                           <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
    //                             {product?.licensenumber}
    //                           </td>

    //                           {product?.note ? (
    //                             <td
    //                               colSpan={8}
    //                               className="py-2 px-4 text-sm text-red-600"
    //                             >
    //                               {product.note}
    //                             </td>
    //                           ) : (
    //                             <>
    //                               <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
    //                                 {formatDate(product?.customerAddDate)}
    //                               </td>

    //                               <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
    //                                 {formatDate(product?.licenseExpiryDate)}
    //                               </td>
    //                               <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
    //                                 {product?.licenseExpiryDate
    //                                   ? calculateRemainingDays(
    //                                       product?.licenseExpiryDate
    //                                     )
    //                                   : ""}
    //                               </td>

    //                               <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
    //                                 {formatDate(product?.amcstartDate)}
    //                               </td>
    //                               <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
    //                                 {formatDate(product?.amcendDate)}
    //                               </td>

    //                               <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
    //                                 <span
    //                                   style={{
    //                                     color:
    //                                       calculateRemainingDays(
    //                                         product?.amcendDate
    //                                       ) === "Expired"
    //                                         ? "red"
    //                                         : "black"
    //                                   }}
    //                                 >
    //                                   {calculateRemainingDays(
    //                                     product?.amcendDate
    //                                   )}
    //                                 </span>
    //                               </td>
    //                               <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
    //                                 {product?.tvuexpiryDate}
    //                               </td>
    //                               <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
    //                                 {calculateRemainingDays(
    //                                   product?.tvuexpiryDate
    //                                 )}
    //                               </td>

    //                               <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
    //                                 {product?.noofusers}
    //                               </td>
    //                               <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
    //                                 {product?.version}
    //                               </td>
    //                               {user.role === "Admin" && (
    //                                 <>
    //                                   <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
    //                                     {product?.companyName}
    //                                   </td>
    //                                   <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
    //                                     {product?.branchName}
    //                                   </td>
    //                                   <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
    //                                     {product?.productAmount}
    //                                   </td>
    //                                   <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
    //                                     {product?.tvuAmount}
    //                                   </td>
    //                                   <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
    //                                     {product?.amcAmount}
    //                                   </td>
    //                                 </>
    //                               )}
    //                             </>
    //                           )}
    //                         </tr>
    //                       ))}
    //                     </tbody>
    //                   </table>
    //                 </div>

    //                 <div className=" container mt-12 ">
    //                   <div className="flex container justify-center items-center">
    //                     <Timer
    //                       isRunning={isRunning}
    //                       startTime={startTime}
    //                       productDetails={productDetails}
    //                       selectedProducts={selectedProducts}
    //                       onStop={stopTimer}
    //                     />

    //                     <PopUp
    //                       isOpen={isModalOpen}
    //                       report={callreport}
    //                       onClose={() => setIsModalOpen(false)}
    //                       handleWhatsapp={sendWhatapp}
    //                       message="This customer already has a same call note with pending status please cleared that !"
    //                     />
    //                   </div>

    //                   <form onSubmit={handleSubmit(onSubmit)}>
    //                     {/* Updated parent div with justify-between */}

    //                     <div className="grid grid-cols-3 gap-6  ">
    //                       <div className="relative">
    //                         {/* Toast Message */}
    //                         {showIncomingNumberToast && (
    //                           <div className="absolute -top-10 left-0 bg-blue-500 text-white px-3 py-1 rounded-md text-sm z-10 shadow-md ">
    //                             Please enter the customer's incoming number.
    //                             This number will be sent to the customer's email
    //                           </div>
    //                         )}

    //                         <label
    //                           htmlFor="customerName"
    //                           className="block text-sm font-medium text-gray-700 "
    //                         >
    //                           Incoming Number
    //                         </label>
    //                         <input
    //                           type="Number"
    //                           id="incomingNumber"
    //                           {...register("incomingNumber", {
    //                             required: "Incoming number is required",
    //                             onChange: (e) =>
    //                               setshowinComingnumberToast(true)
    //                           })}
    //                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none"
    //                           placeholder="Enter Incoming Number"
    //                         />
    //                         {errors.incomingNumber && (
    //                           <span className="mt-2 text-sm text-red-600">
    //                             {errors.incomingNumber.message}
    //                           </span>
    //                         )}
    //                       </div>
    //                       {token && (
    //                         <div>
    //                           {/* Adjust width and padding for spacing */}
    //                           <label
    //                             htmlFor="token"
    //                             className="block text-sm font-medium text-gray-700"
    //                           >
    //                             Token
    //                           </label>
    //                           <input
    //                             disabled
    //                             type="text"
    //                             id="token"
    //                             {...register("token", {})}
    //                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none cursor-not-allowed"
    //                           />
    //                         </div>
    //                       )}

    //                       <div>
    //                         {/* Adjust width and padding for spacing */}
    //                         <label
    //                           htmlFor="callnote"
    //                           className="block text-sm font-medium text-gray-700"
    //                         >
    //                           Call Notes
    //                         </label>

    //                         <select
    //                           {...register("callnote", {
    //                             required: "please select a callnote",
    //                             onChange: (e) =>
    //                               hanldeCheckforsamecallnoteforsamecustomer(
    //                                 e.target.value
    //                               )
    //                           })}
    //                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none"
    //                           defaultValue="" // Default placeholder
    //                         >
    //                           <option value="" disabled>
    //                             Select Callnote
    //                           </option>
    //                           {callnote.map((callnotes) => (
    //                             <option
    //                               key={callnotes._id}
    //                               value={`${callnotes._id}|${callnotes.callNotes}`}
    //                               // value={`${callnotes._id}`}
    //                             >
    //                               {callnotes.callNotes}
    //                             </option>
    //                           ))}
    //                         </select>
    //                         {errors.callnote && (
    //                           <span className="mt-2 text-sm text-red-600">
    //                             {errors.callnote.message}
    //                           </span>
    //                         )}
    //                       </div>

    //                       <div>
    //                         <label
    //                           id="description"
    //                           className="block text-sm font-medium text-gray-700"
    //                         >
    //                           Description
    //                         </label>
    //                         <textarea
    //                           id="description"
    //                           rows="1"
    //                           {...register("description", {
    //                             maxLength: {
    //                               value: 500,
    //                               message:
    //                                 "Description cannot exceed 500 characters"
    //                             }
    //                           })}
    //                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
    //                           placeholder="Enter a description..."
    //                         />
    //                         {errors.description && (
    //                           <span className="mt-2 text-sm text-red-600">
    //                             {errors.description.message}
    //                           </span>
    //                         )}
    //                       </div>
    //                       <div>
    //                         <label
    //                           id="solution"
    //                           className="block text-sm font-medium text-gray-700"
    //                         >
    //                           Solution
    //                         </label>
    //                         <textarea
    //                           id="solution"
    //                           rows="1"
    //                           {...register("solution", {
    //                             maxLength: {
    //                               value: 500,
    //                               message:
    //                                 "Solution cannot exceed 500 characters"
    //                             }
    //                           })}
    //                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
    //                           placeholder="Enter a solution..."
    //                         />
    //                         {errors.solution && (
    //                           <span className="mt-2 text-sm text-red-600">
    //                             {errors.solution.message}
    //                           </span>
    //                         )}
    //                       </div>
    //                       <div>
    //                         <label
    //                           htmlFor="status"
    //                           className="block text-sm font-medium text-gray-700"
    //                         >
    //                           Status
    //                         </label>
    //                         <select
    //                           {...register("status", { required: true })}
    //                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none"
    //                         >
    //                           <option value="pending" selected>
    //                             Pending
    //                           </option>
    //                           <option value="solved">Solved</option>
    //                         </select>
    //                       </div>
    //                     </div>

    //                     {selectedCustomer && (
    //                       <div className=" flex justify-center items-center mt-4">
    //                         <button
    //                           type="submit"
    //                           className="px-4 py-2 font-medium text-white bg-gradient-to-r from-red-500 to-red-700 rounded-md shadow-md hover:shadow-lg focus:outline-none transition-shadow duration-200"
    //                         >
    //                           {submitLoading ? (
    //                             <div className="flex items-center gap-2">
    //                               <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
    //                               <span>Loading...</span>
    //                             </div>
    //                           ) : (
    //                             <span>End call</span>
    //                           )}
    //                         </button>
    //                       </div>
    //                     )}
    //                   </form>
    //                   <div className="flex justify-between">
    //                     <div className="font-semibold text-gray-700 flex-1">
    //                       <label
    //                         htmlFor="status"
    //                         className="block text-sm font-medium text-gray-700"
    //                       >
    //                         Email Send
    //                       </label>
    //                       <select
    //                         {...register("emailSend", { required: true })}
    //                         className="w-20 mt-1 block border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none"
    //                       >
    //                         <option value={true}>True</option>
    //                         <option value={false}>False</option>
    //                       </select>
    //                     </div>

    //                     <Link
    //                       to={
    //                         user?.role === "Admin"
    //                           ? "/admin/home"
    //                           : "/staff/home"
    //                       }
    //                       className="text-blue-600"
    //                     >
    //                       Go Home
    //                     </Link>
    //                   </div>
    //                   {callData?.length > 0 && (
    //                     <div className="relative mt-8 overflow-y-auto w-full max-h-60 text-center">
    //                       <table className=" w-full divide-y divide-gray-200 rounded-xl shadow-lg ">
    //                         <thead
    //                           className={`${
    //                             isModalOpen ? "" : " sticky top-0 z-30"
    //                           } bg-purple-200`}
    //                         >
    //                           <tr className="">
    //                             <th className="px-6 py-5  text-xs font-medium text-gray-800 uppercase tracking-wider">
    //                               Token No
    //                             </th>
    //                             <th className="px-6 py-5  text-xs font-medium text-gray-800 uppercase tracking-wider">
    //                               Product Name
    //                             </th>
    //                             <th className="px-6 py-5  text-xs font-medium text-gray-800 uppercase tracking-wider">
    //                               Start Date
    //                             </th>
    //                             <th className="px-6 py-5  text-xs font-medium text-gray-800 uppercase tracking-wider">
    //                               End Date
    //                             </th>
    //                             <th className="px-6 py-5  text-xs font-medium text-gray-800 uppercase tracking-wider">
    //                               Duration
    //                             </th>
    //                             <th className="px-6 py-5  text-xs font-medium text-gray-800 uppercase tracking-wider">
    //                               Incoming Number
    //                             </th>

    //                             <th className="px-6 py-5  text-xs font-medium text-gray-800 uppercase tracking-wider">
    //                               AttendedBy
    //                             </th>
    //                             <th className="px-6 py-5  text-xs font-medium text-gray-800 uppercase tracking-wider">
    //                               CompletedBy
    //                             </th>
    //                             <th className="px-6 py-5  text-xs font-medium text-gray-800 uppercase tracking-wider">
    //                               Status
    //                             </th>
    //                           </tr>
    //                         </thead>
    //                         <tbody className=" divide-gray-500 border-gray-200">
    //                           {callData
    //                             ?.sort((a, b) => {
    //                               // Prioritize pending calls over solved calls
    //                               if (
    //                                 a.formdata?.status === "pending" &&
    //                                 b.formdata?.status !== "pending"
    //                               ) {
    //                                 return -1
    //                               }
    //                               if (
    //                                 a.formdata?.status !== "pending" &&
    //                                 b.formdata?.status === "pending"
    //                               ) {
    //                                 return 1
    //                               }

    //                               // If statuses are the same, sort by startTime (latest first)
    //                               const timeA = new Date(
    //                                 a.timedata?.startTime || 0
    //                               ).getTime()
    //                               const timeB = new Date(
    //                                 b.timedata?.startTime || 0
    //                               ).getTime()

    //                               return timeB - timeA // Sort in descending order (latest first)
    //                             })
    //                             .map((call, index) => {
    //                               const today = new Date()
    //                                 .toISOString()
    //                                 .split("T")[0]
    //                               const startTimeRaw = call?.timedata?.startTime
    //                               const callDate = startTimeRaw
    //                                 ? new Date(startTimeRaw.split(" ")[0])
    //                                     .toISOString()
    //                                     .split("T")[0]
    //                                 : null

    //                               return (
    //                                 <>
    //                                   <tr
    //                                     key={index}
    //                                     className={`border-0 ${
    //                                       call.formdata?.status === "solved"
    //                                         ? "bg-[linear-gradient(135deg,_rgba(0,140,0,1),_rgba(128,255,128,1))]"
    //                                         : call?.formdata?.status ===
    //                                             "pending"
    //                                           ? callDate === today
    //                                             ? "bg-[linear-gradient(135deg,_rgba(255,255,1,1),_rgba(255,255,128,1))]"
    //                                             : "bg-[linear-gradient(135deg,_rgba(255,0,0,1),_rgba(255,128,128,1))]"
    //                                           : "bg-[linear-gradient(135deg,_rgba(255,0,0,1),_rgba(255,128,128,1))]"
    //                                     }`}
    //                                   >
    //                                     <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
    //                                       {call.timedata?.token}
    //                                     </td>
    //                                     <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
    //                                       {call.product?.productName}
    //                                     </td>
    //                                     <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
    //                                       {setDateandTime(
    //                                         call.timedata?.startTime
    //                                       )}
    //                                     </td>
    //                                     <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
    //                                       {call.formdata?.status === "solved"
    //                                         ? setDateandTime(
    //                                             call.timedata?.endTime
    //                                           )
    //                                         : ""}
    //                                     </td>
    //                                     <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
    //                                       {formatDuration(
    //                                         call?.timedata?.duration
    //                                       ) || "N/A"}
    //                                     </td>
    //                                     <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
    //                                       {call.formdata?.incomingNumber}
    //                                     </td>
    //                                     <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
    //                                       {Array.isArray(
    //                                         call?.formdata?.attendedBy
    //                                       )
    //                                         ? call?.formdata?.attendedBy
    //                                             ?.map(
    //                                               (attendee) =>
    //                                                 attendee?.callerId?.name ||
    //                                                 attendee?.name
    //                                             )
    //                                             .join(", ")
    //                                         : call?.formdata?.attendedBy
    //                                             ?.callerId?.name}
    //                                     </td>
    //                                     <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
    //                                       {call.formdata?.status
    //                                         ? Array.isArray(
    //                                             call?.formdata?.completedBy
    //                                           )
    //                                           ? call?.formdata?.completedBy
    //                                               ?.map(
    //                                                 (attendee) =>
    //                                                   attendee?.callerId
    //                                                     ?.name || attendee?.name
    //                                               )
    //                                               .join(", ")
    //                                           : call?.formdata?.completedBy
    //                                               ?.callerId?.name
    //                                         : ""}
    //                                     </td>
    //                                     <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
    //                                       {call.formdata?.status}
    //                                     </td>
    //                                   </tr>
    //                                   <tr
    //                                     className={`text-center border-t-0 border-black ${
    //                                       call?.formdata?.status === "solved"
    //                                         ? "bg-[linear-gradient(135deg,_rgba(0,140,0,1),_rgba(128,255,128,1))]"
    //                                         : call?.formdata?.status ===
    //                                             "pending"
    //                                           ? callDate === today
    //                                             ? "bg-[linear-gradient(135deg,_rgba(255,255,1,1),_rgba(255,255,128,1))]"
    //                                             : "bg-[linear-gradient(135deg,_rgba(255,0,0,1),_rgba(255,128,128,1))]"
    //                                           : "bg-[linear-gradient(135deg,_rgba(255,0,0,1),_rgba(255,128,128,1))]"
    //                                     }`}
    //                                     style={{ height: "5px" }}
    //                                   >
    //                                     <td
    //                                       colSpan="5"
    //                                       className="py-1 px-8 text-sm text-black text-left"
    //                                     >
    //                                       <strong>Description:</strong>{" "}
    //                                       {call?.formdata?.description || "N/A"}
    //                                     </td>
    //                                     <td
    //                                       colSpan="4"
    //                                       className="py-1 px-12 text-sm text-black text-left"
    //                                     >
    //                                       <strong>Solution:</strong>{" "}
    //                                       {call?.formdata?.solution || "N/A"}
    //                                     </td>
    //                                   </tr>
    //                                 </>
    //                               )
    //                             })}
    //                         </tbody>
    //                       </table>
    //                     </div>
    //                   )}
    //                 </div>
    //               </div>
    //             </>
    //           )}
    //         </div>
    //       </div>
    //     </div>
    //     <PerformanceModal
    //       modalOpen={openModal}
    //       splitType={targetData?.selectedMeasurementType}
    //       selectedperiod={selectedPeriod}
    //       allperiods={targetData?.periods}
    //       onselectedPeriodChange={(val, val2) => {
    //         setSelectedMonth(val2)
    //         setselectedPeriod(val)
    //       }}
    //       onMonthChange={(val) => {
    //         setcategorylist([])
    //         setacheivedProducts([])
    //         setselectedDataPopup([])
    //         setperiodMode(val)
    //       }}
    //       onYearChange={(val) => {
    //         setcategorylist([])
    //         setacheivedProducts([])
    //         setselectedDataPopup([])
    //         setSelectedYear(val)
    //       }}
    //       productlist={productlist}
    //       onClose={() => {
    //         setselecteduserName(user?.name)
    //         setacheivedProducts([])
    //         setOpenModal(false)
    //       }}
    //       selectedMonth={periodMode}
    //       selectedYear={selectedYear}
    //       summary={{
    //         target: selectedDatapopup?.target,
    //         achieved: selectedDatapopup?.achieved,
    //         balance:
    //           selectedDatapopup?.achieved > selectedDatapopup?.target
    //             ? 0
    //             : selectedDatapopup?.balance
    //       }}
    //       products={achievedproducts}
    //       targetData={targetData?.userWiseResults}
    //       loggedUser={user}
    //       selectedUser={selectedUserName}
    //       category={selectedCategory}
    //       handleSelectedUser={handleSelectedUser}
    //     />
    //   </div>
    // </div>
    <div className="h-full bg-[#ADD8E6] overflow-hidden">
      <div className="flex h-full flex-row overflow-hidden">
        <StaticSidebar
          handleMoreClick={handleMoreClick}
          selectedCompanyBranch={selectedcompanyBranch}
          setselectedCompanyBranch={setselectedcompanyBranch}
          parenttargetData={settargetData}
          parentperiodmode={periodMode}
          parentyear={selectedYear}
          setselectedPeriod={setselectedPeriod}
        />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <header className="flex shrink-0 items-center justify-between bg-[#ADD8E6]">
            {user?.role?.toLowerCase() === "admin" ? (
              <AdminHeader hide={true} />
            ) : (
              <StaffHeader hide={true} />
            )}

            <div className="flex h-full items-center gap-1.5 bg-[#ADD8E6] px-3">
              <button className="rounded-full bg-slate-100 p-1.5 transition">
                <Mail size={15} strokeWidth={2.2} />
              </button>

              <div className="relative">
                <button className="rounded-full bg-slate-100 p-1.5 transition">
                  <MessageSquareText size={15} strokeWidth={2.2} />
                </button>
                <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-500" />
              </div>

              <button className="rounded-full bg-slate-100 p-1.5 transition">
                <Settings size={15} strokeWidth={2.2} />
              </button>

              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowUserMenu((prev) => !prev)
                  }}
                  className="rounded-full bg-slate-100 p-1.5 transition"
                >
                  <User size={15} strokeWidth={2.2} />
                </button>

                {/* {showUserMenu && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 z-50 mt-2 w-32 rounded-md border border-slate-200 bg-white shadow-lg"
              >
                <button
                  onClick={handleLogout}
                  className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                >
                  Logout
                </button>
              </div>
            )} */}
              </div>
            </div>
          </header>

          {loader && (
            <BarLoader
              cssOverride={{ width: "100%", height: "4px" }}
              color="#4A90E2"
            />
          )}

          <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
            <div className="flex min-h-0 min-w-0 flex-1 justify-center overflow-y-auto p-3 sm:p-4 lg:p-6">
              <div className="flex h-fit min-h-full w-full max-w-7xl flex-col rounded-xl bg-white p-4 shadow-lg sm:p-6 lg:p-8">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-xl font-semibold sm:text-2xl">
                    Call Registration
                  </h2>

                  <div className="flex justify-start sm:justify-end">
                    <Link
                      to={
                        user?.role === "Admin" ? "/admin/home" : "/staff/home"
                      }
                      className="inline-flex items-center rounded-md bg-gradient-to-r from-blue-500 to-blue-700 px-3 py-2 text-sm font-medium text-white shadow-lg transition hover:from-blue-600 hover:to-blue-800"
                    >
                      Go Home
                    </Link>
                  </div>
                </div>

                <hr className="mb-4 border-t-2 border-gray-300" />

                <div className="w-full md:max-w-xl">
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
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 pr-10 text-sm shadow-sm outline-none focus:border-gray-500"
                        placeholder="Enter name or license..."
                      />

                      {loading && (
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <ClipLoader
                            color="#36D7B7"
                            loading={loading}
                            size={20}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {!search &&
                  loggeduserCurrentDateCalls &&
                  loggeduserCurrentDateCalls?.length > 0 && (
                    <>
                      <h1 className="mt-5 inline-block border-b-2 border-black text-lg font-semibold sm:text-xl">
                        Your Today's Call list
                      </h1>

                      <div className="mt-3 min-h-0 w-full overflow-hidden rounded-lg border border-gray-200">
                        <div className="max-h-[420px] overflow-auto">
                          <table className="min-w-[1100px] divide-y divide-gray-200 rounded-xl shadow-lg">
                            <thead
                              className={`${isModalOpen ? "" : "sticky top-0 z-20"} bg-purple-200`}
                            >
                              <tr>
                                <th className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-gray-800">
                                  Customer Name
                                </th>
                                <th className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-gray-800">
                                  Token No
                                </th>
                                <th className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-gray-800">
                                  Product Name
                                </th>
                                <th className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-gray-800">
                                  Start Date
                                </th>
                                <th className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-gray-800">
                                  End Date
                                </th>
                                <th className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-gray-800">
                                  Duration
                                </th>
                                <th className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-gray-800">
                                  Incoming Number
                                </th>
                                <th className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-gray-800">
                                  AttendedBy
                                </th>
                                <th className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-gray-800">
                                  CompletedBy
                                </th>
                                <th className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-gray-800">
                                  Status
                                </th>
                              </tr>
                            </thead>

                            <tbody className="divide-gray-500">
                              {loggeduserCurrentDateCalls
                                ?.flatMap((customer) =>
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
                                  const today = new Date()
                                    .toISOString()
                                    .split("T")[0]

                                  const callDate = call.timedata?.startTime
                                    ? new Date(
                                        call.timedata?.startTime.split(" ")[0]
                                      )
                                        .toISOString()
                                        .split("T")[0]
                                    : null

                                  const rowClass =
                                    call.formdata?.status === "solved"
                                      ? "bg-[linear-gradient(135deg,_rgba(0,140,0,1),_rgba(128,255,128,1))]"
                                      : call.formdata?.status === "pending"
                                        ? callDate === today
                                          ? "bg-[linear-gradient(135deg,_rgba(255,255,1,1),_rgba(255,255,128,1))]"
                                          : "bg-[linear-gradient(135deg,_rgba(255,0,0,1),_rgba(255,128,128,1))]"
                                        : "bg-[linear-gradient(135deg,_rgba(255,0,0,1),_rgba(255,128,128,1))]"

                                  return (
                                    <React.Fragment key={index}>
                                      <tr className={`border-0 ${rowClass}`}>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-black">
                                          {call.customerName}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-black">
                                          {call.timedata?.token}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-black">
                                          {call.productDetails[0]?.productName}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-black">
                                          {new Date(
                                            call.timedata?.startTime
                                          ).toLocaleString()}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-black">
                                          {new Date(
                                            call.timedata?.endTime
                                          ).toLocaleString()}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-black">
                                          {call.timedata?.time}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-black">
                                          {call.formdata?.incomingNumber}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-black">
                                          {call.formdata?.attendedBy
                                            ?.map((attendee) => attendee.name)
                                            .join(", ") || ""}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-black">
                                          {call.formdata?.completedBy
                                            ?.map((completer) => completer.name)
                                            .join(", ") || ""}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm capitalize text-black">
                                          {call.formdata?.status}
                                        </td>
                                      </tr>

                                      <tr
                                        className={`${rowClass} border-t-0 border-black text-center`}
                                      >
                                        <td
                                          colSpan="5"
                                          className="px-6 py-2 text-left text-sm text-black"
                                        >
                                          <strong>Description:</strong>{" "}
                                          {call.formdata?.description || "N/A"}
                                        </td>
                                        <td
                                          colSpan="5"
                                          className="px-6 py-2 text-left text-sm text-black"
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
                      </div>
                    </>
                  )}

                {searching && customerData?.length > 0 ? (
                  <div className="mt-4 w-full max-w-xl overflow-hidden rounded-lg border border-gray-200 shadow-md">
                    <div className="max-h-52 overflow-auto">
                      <table className="min-w-full bg-white">
                        <thead className="sticky top-0 z-20 border-b border-green-300 bg-green-300 shadow">
                          <tr>
                            <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                              Customer Name
                            </th>
                            <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                              License No
                            </th>
                            <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                              Mobile No
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                          {customerData?.map((customer, index) =>
                            customer?.selected?.map((item, subIndex) => (
                              <tr
                                key={`${index}-${subIndex}`}
                                onClick={() =>
                                  handleRowClick(customer, item?.licensenumber)
                                }
                                className="cursor-pointer transition-colors hover:bg-gray-50"
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
                  </div>
                ) : (
                  <div className="ml-1 mt-3 text-sm text-red-500">
                    {message}
                  </div>
                )}

                {selectedCustomer && (
                  <>
                    {/* <div className="mt-5 grid grid-cols-1 gap-3 rounded-lg bg-[#4888b9] p-4 shadow-md sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">Customer Name</h4>
                    <p className="break-words text-sm text-white">
                      {selectedCustomer.customerName}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">Email</h4>
                    <p className="break-words text-sm text-white">
                      {selectedCustomer.email}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">Mobile</h4>
                    <p className="break-words text-sm text-white">
                      {selectedCustomer.mobile}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">Address 1</h4>
                    <p className="break-words text-sm text-white">
                      {selectedCustomer.address1}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">Address 2</h4>
                    <p className="break-words text-sm text-white">
                      {selectedCustomer.address2}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">City</h4>
                    <p className="break-words text-sm text-white">
                      {selectedCustomer.city}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">State</h4>
                    <p className="break-words text-sm text-white">
                      {selectedCustomer.state}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">Country</h4>
                    <p className="break-words text-sm text-white">
                      {selectedCustomer.country}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">Pincode</h4>
                    <p className="break-words text-sm text-white">
                      {selectedCustomer.pincode}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">Landline</h4>
                    <p className="break-words text-sm text-white">
                      {selectedCustomer.landline || "N/A"}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">Partnership</h4>
                    <p className="break-words text-sm text-white">
                      {selectedCustomer?.partner?.[0]?.partner ||
                        selectedCustomer?.partner?.partner ||
                        "N/A"}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">Industry</h4>
                    <p className="break-words text-sm text-white">
                      {selectedCustomer?.industry || "N/A"}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">Status</h4>
                    <p
                      className={`text-lg font-bold ${
                        selectedCustomer.selected.some(
                          (item) => item.isActive === "Running"
                        )
                          ? "text-lime-200"
                          : "text-red-200"
                      }`}
                    >
                      {selectedCustomer.selected.some(
                        (item) => item.isActive === "Running"
                      )
                        ? "Active"
                        : "Inactive"}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Reason of Status
                    </h4>
                    <p className="break-words text-sm text-white">
                      {selectedCustomer.reasonofStatus || "N/A"}
                    </p>
                  </div>
                </div> */}
                    <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                      <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-sm font-semibold text-slate-800">
                            Customer Summary
                          </h3>
                          <p className="text-xs text-slate-500">
                            Basic customer information
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setShowCustomerDetails((prev) => !prev)
                          }
                          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white shadow-sm hover:bg-blue-700"
                        >
                          {showCustomerDetails
                            ? "Hide Details"
                            : "Expand Details"}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-3 bg-[#4888b9] p-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wide text-blue-100">
                            Customer Name
                          </h4>
                          <p className="mt-1 break-words text-sm font-medium text-white">
                            {selectedCustomer.customerName || "N/A"}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wide text-blue-100">
                            Mobile
                          </h4>
                          <p className="mt-1 break-words text-sm font-medium text-white">
                            {selectedCustomer.mobile || "N/A"}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wide text-blue-100">
                            Partnership
                          </h4>
                          <p className="mt-1 break-words text-sm font-medium text-white">
                            {selectedCustomer?.partner?.[0]?.partner ||
                              selectedCustomer?.partner?.partner ||
                              "N/A"}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wide text-blue-100">
                            Status
                          </h4>
                          <p
                            className={`mt-1 text-sm font-bold ${
                              selectedCustomer?.selected?.some(
                                (item) => item.isActive === "Running"
                              )
                                ? "text-lime-200"
                                : "text-red-200"
                            }`}
                          >
                            {selectedCustomer?.selected?.some(
                              (item) => item.isActive === "Running"
                            )
                              ? "Active"
                              : "Inactive"}
                          </p>
                        </div>
                      </div>

                      {showCustomerDetails && (
                        <div className="grid grid-cols-1 gap-3 border-t border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
                          <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Email
                            </h4>
                            <p className="mt-1 break-words text-sm text-slate-700">
                              {selectedCustomer.email || "N/A"}
                            </p>
                          </div>

                          <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Address 1
                            </h4>
                            <p className="mt-1 break-words text-sm text-slate-700">
                              {selectedCustomer.address1 || "N/A"}
                            </p>
                          </div>

                          <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Address 2
                            </h4>
                            <p className="mt-1 break-words text-sm text-slate-700">
                              {selectedCustomer.address2 || "N/A"}
                            </p>
                          </div>

                          <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              City
                            </h4>
                            <p className="mt-1 break-words text-sm text-slate-700">
                              {selectedCustomer.city || "N/A"}
                            </p>
                          </div>

                          <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              State
                            </h4>
                            <p className="mt-1 break-words text-sm text-slate-700">
                              {selectedCustomer.state || "N/A"}
                            </p>
                          </div>

                          <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Country
                            </h4>
                            <p className="mt-1 break-words text-sm text-slate-700">
                              {selectedCustomer.country || "N/A"}
                            </p>
                          </div>

                          <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Pincode
                            </h4>
                            <p className="mt-1 break-words text-sm text-slate-700">
                              {selectedCustomer.pincode || "N/A"}
                            </p>
                          </div>

                          <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Landline
                            </h4>
                            <p className="mt-1 break-words text-sm text-slate-700">
                              {selectedCustomer.landline || "N/A"}
                            </p>
                          </div>

                          <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Industry
                            </h4>
                            <p className="mt-1 break-words text-sm text-slate-700">
                              {selectedCustomer.industry || "N/A"}
                            </p>
                          </div>

                          <div className="sm:col-span-2 lg:col-span-2">
                            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Reason of Status
                            </h4>
                            <p className="mt-1 break-words text-sm text-slate-700">
                              {selectedCustomer.reasonofStatus || "N/A"}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 w-full">
                      {/* <div className="">
                        <h3 className="text-lg font-medium text-gray-900">
                          Product Details List
                        </h3>
                      </div> */}
                      <div className="min-h-[180px] px-4 py-5">
                        <h2 className="mb-2 font-medium">Prmimary Products</h2>
                        {primaryProducts.length > 0 ? (
                          <div className="flex flex-wrap gap-4">
                            {primaryProducts.map((item) => {
                              const actualIndex = primaryProducts.findIndex(
                                (x) => x === item
                              )
                              const isDeactive =
                                String(item?.isActive).toLowerCase() ===
                                "deactive"
                              const isSelected =
                                String(item?.licensenumber ?? "") ===
                                String(selectedLicenseNumber ?? "")

                              return (
                                <ProductCircleCard
                                  key={`primary-${actualIndex}`}
                                  item={item}
                                  actualIndex={actualIndex}
                                  isSelected={isSelected}
                                  variant={isDeactive ? "danger" : "success"}
                                  topBadgeIcon={<FaBuilding size={10} />}
                                  line1={
                                    item?.shortName
                                      ? item?.shortName
                                      : item?.product_id?.productName
                                  }
                                  line2={item?.licensenumber}
                                  line3={
                                    item?.nextDue
                                      ? formatDateToDDMMYYYY(item?.nextDue)
                                      : ""
                                  }
                                  line4={isDeactive ? "De Active" : ""}
                                  onEdit={handleEdit}
                                  // onDelete={handleDelete}
                                />
                              )
                            })}
                          </div>
                        ) : (
                          <div className="flex h-[140px] items-center justify-center rounded-[12px] border border-dashed border-[#e7ebf4] bg-[#fbfcff] text-[12px] text-[#8a95ab]">
                            No primary products added.
                          </div>
                        )}
                      </div>
                      <div className="min-h-[180px] px-4 py-5">
                        <h2 className="mb-2 font-medium">
                          Additional Services
                        </h2>
                        {additionalServices.length > 0 ? (
                          <div className="flex flex-wrap gap-4">
                            {additionalServices.map((item) => {
                              const actualIndex = additionalServices.findIndex(
                                (x) => x === item
                              )

                              return (
                                <ProductCircleCard
                                  key={`additional-${actualIndex}`}
                                  item={item}
                                  actualIndex={actualIndex}
                                  variant="service"
                                  topBadgeIcon={<FaBuilding size={10} />}
                                  line1={
                                    item?.shortName
                                      ? item?.shortName
                                      : item?.productName
                                  }
                                  line2={
                                    item?.amount ? `Rs. ${item.amount}` : ""
                                  }
                                  // line3={
                                  //   item?.taggeddata?.length > 0
                                  //     ? `Tagged ${item.taggeddata.length}`
                                  //     : item[0]?.nextDue
                                  //       ? formatDateToDDMMYYYY(item[0]?.nextDue)
                                  //       : ""
                                  // }

                                  line3={
                                    Array.isArray(item?.taggeddata) &&
                                    item.taggeddata.length > 0
                                      ? item.taggeddata
                                          .map((x) => x.licensenumber)
                                          .join(", ")
                                          .slice(0, 18)
                                      : ""
                                  }
                                  line4={
                                    item?.taggeddata?.length > 0
                                      ? formatDateToDDMMYYYY(
                                          item?.taggeddata?.[0]?.nextDue
                                        )
                                      : item?.nextDue
                                        ? formatDateToDDMMYYYY(item?.nextDue)
                                        : ""
                                  }
                                  onEdit={handleEdit}
                                  // onDelete={handleDelete}
                                />
                              )
                            })}
                          </div>
                        ) : (
                          <div className="flex h-[140px] flex-col items-center justify-center rounded-[12px] border border-dashed border-[#e7ebf4] bg-[#fbfcff] text-center">
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#f2f4f8] text-[#9ca8be]">
                              <FaBuilding size={12} />
                            </div>
                            <p className="text-[12px] text-[#76839d]">
                              No additional services added.
                            </p>
                            <p className="mt-1 text-[11px] text-[#a0abc0]">
                              Click Add Service to get started.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* <div className="w-full overflow-hidden rounded-lg border border-gray-300">
                        <div className="max-h-80 overflow-auto">
                          <table className="min-w-[1300px] divide-y divide-gray-200 shadow">
                            <thead
                              className={`${isModalOpen ? "" : "sticky top-0 z-20"} bg-green-300`}
                            >
                              <tr>
                                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                                  Select
                                </th>
                                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                                  Product Name
                                </th>
                                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                                  License No
                                </th>
                                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                                  Installed Date
                                </th>
                                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                                  License expiry
                                </th>
                                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                                  License Remaining
                                </th>
                                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                                  Amc startDate <br /> (D-M-Y)
                                </th>
                                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                                  Amc endDate <br /> (D-M-Y)
                                </th>
                                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                                  Amc Remaining
                                </th>
                                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                                  Tvu expiry
                                </th>
                                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                                  Tvu Remaining
                                </th>
                                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                                  No.of Users
                                </th>
                                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                                  Version
                                </th>

                                {user.role === "Admin" && (
                                  <>
                                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                                      Company Name
                                    </th>
                                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                                      Branch Name
                                    </th>
                                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                                      Product Amount
                                    </th>
                                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                                      Tvu Amount
                                    </th>
                                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                                      Amc Amount
                                    </th>
                                  </>
                                )}
                              </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-300">
                              {productDetails?.map((product, index) => (
                                <tr key={index}>
                                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                    <input
                                      className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                      checked={selectedProducts.some(
                                        (p) =>
                                          p.productName === product?.productName
                                      )}
                                      type="checkbox"
                                      onChange={(e) =>
                                        handleCheckboxChange(e, product)
                                      }
                                    />
                                  </td>

                                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                    {product?.productName}
                                  </td>

                                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                    {product?.licensenumber}
                                  </td>

                                  {product?.note ? (
                                    <td
                                      colSpan={8}
                                      className="px-4 py-2 text-sm text-red-600"
                                    >
                                      {product.note}
                                    </td>
                                  ) : (
                                    <>
                                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                        {formatDate(product?.customerAddDate)}
                                      </td>
                                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                        {formatDate(product?.licenseExpiryDate)}
                                      </td>
                                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                        {product?.licenseExpiryDate
                                          ? calculateRemainingDays(
                                              product?.licenseExpiryDate
                                            )
                                          : ""}
                                      </td>
                                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                        {formatDate(product?.amcstartDate)}
                                      </td>
                                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                        {formatDate(product?.amcendDate)}
                                      </td>
                                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                        <span
                                          style={{
                                            color:
                                              calculateRemainingDays(
                                                product?.amcendDate
                                              ) === "Expired"
                                                ? "red"
                                                : "black"
                                          }}
                                        >
                                          {calculateRemainingDays(
                                            product?.amcendDate
                                          )}
                                        </span>
                                      </td>
                                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                        {product?.tvuexpiryDate}
                                      </td>
                                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                        {calculateRemainingDays(
                                          product?.tvuexpiryDate
                                        )}
                                      </td>
                                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                        {product?.noofusers}
                                      </td>
                                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                        {product?.version}
                                      </td>

                                      {user.role === "Admin" && (
                                        <>
                                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                            {product?.companyName}
                                          </td>
                                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                            {product?.branchName}
                                          </td>
                                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                            {product?.productAmount}
                                          </td>
                                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                            {product?.tvuAmount}
                                          </td>
                                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                            {product?.amcAmount}
                                          </td>
                                        </>
                                      )}
                                    </>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div> */}

                      <div className="mt-10 w-full">
                        <div className="flex flex-col items-center justify-center gap-4">
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
                            message="This customer already has a same call note with pending status please cleared that !"
                          />
                        </div>

                        <form
                          onSubmit={handleSubmit(onSubmit)}
                          className="mt-6"
                        >
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                            <div className="relative">
                              {showIncomingNumberToast && (
                                <div className="absolute -top-12 left-0 z-10 rounded-md bg-blue-500 px-3 py-1 text-xs text-white shadow-md sm:text-sm">
                                  Please enter the customer's incoming number.
                                  This number will be sent to the customer's
                                  email
                                </div>
                              )}

                              <label
                                htmlFor="incomingNumber"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Incoming Number
                              </label>
                              <input
                                type="number"
                                id="incomingNumber"
                                {...register("incomingNumber", {
                                  required: "Incoming number is required",
                                  onChange: () =>
                                    setshowinComingnumberToast(true)
                                })}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm outline-none"
                                placeholder="Enter Incoming Number"
                              />
                              {errors.incomingNumber && (
                                <span className="mt-2 block text-sm text-red-600">
                                  {errors.incomingNumber.message}
                                </span>
                              )}
                            </div>

                            {token && (
                              <div>
                                <label
                                  htmlFor="token"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Token
                                </label>
                                <input
                                  disabled
                                  type="text"
                                  id="token"
                                  {...register("token", {})}
                                  className="mt-1 block w-full cursor-not-allowed rounded-md border border-gray-300 p-2 text-sm shadow-sm outline-none"
                                />
                              </div>
                            )}

                            <div>
                              <label
                                htmlFor="callnote"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Call Notes
                              </label>

                              <select
                                {...register("callnote", {
                                  required: "please select a callnote",
                                  onChange: (e) =>
                                    hanldeCheckforsamecallnoteforsamecustomer(
                                      e.target.value
                                    )
                                })}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm outline-none"
                                defaultValue=""
                              >
                                <option value="" disabled>
                                  Select Callnote
                                </option>
                                {callnote.map((callnotes) => (
                                  <option
                                    key={callnotes._id}
                                    value={`${callnotes._id}|${callnotes.callNotes}`}
                                  >
                                    {callnotes.callNotes}
                                  </option>
                                ))}
                              </select>

                              {errors.callnote && (
                                <span className="mt-2 block text-sm text-red-600">
                                  {errors.callnote.message}
                                </span>
                              )}
                            </div>

                            <div>
                              <label
                                htmlFor="description"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Description
                              </label>
                              <textarea
                                id="description"
                                rows="2"
                                {...register("description", {
                                  maxLength: {
                                    value: 500,
                                    message:
                                      "Description cannot exceed 500 characters"
                                  }
                                })}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm outline-none focus:border-gray-500"
                                placeholder="Enter a description..."
                              />
                              {errors.description && (
                                <span className="mt-2 block text-sm text-red-600">
                                  {errors.description.message}
                                </span>
                              )}
                            </div>

                            <div>
                              <label
                                htmlFor="solution"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Solution
                              </label>
                              <textarea
                                id="solution"
                                rows="2"
                                {...register("solution", {
                                  maxLength: {
                                    value: 500,
                                    message:
                                      "Solution cannot exceed 500 characters"
                                  }
                                })}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm outline-none focus:border-gray-500"
                                placeholder="Enter a solution..."
                              />
                              {errors.solution && (
                                <span className="mt-2 block text-sm text-red-600">
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
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm outline-none"
                                defaultValue="pending"
                              >
                                <option value="pending">Pending</option>
                                <option value="solved">Solved</option>
                              </select>
                            </div>
                          </div>

                          {selectedCustomer && (
                            <div className="mt-6 flex justify-center">
                              <button
                                type="submit"
                                className="rounded-md bg-gradient-to-r from-red-500 to-red-700 px-5 py-2 font-medium text-white shadow-md transition-shadow duration-200 hover:shadow-lg focus:outline-none"
                              >
                                {submitLoading ? (
                                  <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    <span>Loading...</span>
                                  </div>
                                ) : (
                                  <span>End call</span>
                                )}
                              </button>
                            </div>
                          )}
                        </form>

                        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                          <div className="font-semibold text-gray-700">
                            <label
                              htmlFor="emailSend"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Email Send
                            </label>
                            <select
                              {...register("emailSend", { required: true })}
                              className="mt-1 block w-24 rounded-md border border-gray-300 p-2 text-sm shadow-sm outline-none"
                            >
                              <option value={true}>True</option>
                              <option value={false}>False</option>
                            </select>
                          </div>

                          <Link
                            to={
                              user?.role === "Admin"
                                ? "/admin/home"
                                : "/staff/home"
                            }
                            className="text-sm font-medium text-blue-600"
                          >
                            Go Home
                          </Link>
                        </div>

                        {callData?.length > 0 && (
                          <div className="relative mt-8 w-full overflow-hidden rounded-lg border border-gray-200">
                            <div className="max-h-72 overflow-auto">
                              <table className="min-w-[1000px] divide-y divide-gray-200 shadow-lg">
                                <thead
                                  className={`${isModalOpen ? "" : "sticky top-0 z-20"} bg-purple-200`}
                                >
                                  <tr>
                                    <th className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-gray-800">
                                      Token No
                                    </th>
                                    <th className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-gray-800">
                                      Product Name
                                    </th>
                                    <th className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-gray-800">
                                      Start Date
                                    </th>
                                    <th className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-gray-800">
                                      End Date
                                    </th>
                                    <th className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-gray-800">
                                      Duration
                                    </th>
                                    <th className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-gray-800">
                                      Incoming Number
                                    </th>
                                    <th className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-gray-800">
                                      AttendedBy
                                    </th>
                                    <th className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-gray-800">
                                      CompletedBy
                                    </th>
                                    <th className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-gray-800">
                                      Status
                                    </th>
                                  </tr>
                                </thead>

                                <tbody className="divide-gray-500 border-gray-200">
                                  {callData
                                    ?.sort((a, b) => {
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

                                      const timeA = new Date(
                                        a.timedata?.startTime || 0
                                      ).getTime()
                                      const timeB = new Date(
                                        b.timedata?.startTime || 0
                                      ).getTime()

                                      return timeB - timeA
                                    })
                                    .map((call, index) => {
                                      const today = new Date()
                                        .toISOString()
                                        .split("T")[0]

                                      const startTimeRaw =
                                        call?.timedata?.startTime
                                      const callDate = startTimeRaw
                                        ? new Date(startTimeRaw.split(" ")[0])
                                            .toISOString()
                                            .split("T")[0]
                                        : null

                                      const rowClass =
                                        call.formdata?.status === "solved"
                                          ? "bg-[linear-gradient(135deg,_rgba(0,140,0,1),_rgba(128,255,128,1))]"
                                          : call?.formdata?.status === "pending"
                                            ? callDate === today
                                              ? "bg-[linear-gradient(135deg,_rgba(255,255,1,1),_rgba(255,255,128,1))]"
                                              : "bg-[linear-gradient(135deg,_rgba(255,0,0,1),_rgba(255,128,128,1))]"
                                            : "bg-[linear-gradient(135deg,_rgba(255,0,0,1),_rgba(255,128,128,1))]"

                                      return (
                                        <React.Fragment key={index}>
                                          <tr
                                            className={`border-0 ${rowClass}`}
                                          >
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-black">
                                              {call.timedata?.token}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-black">
                                              {call.product?.productName}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-black">
                                              {setDateandTime(
                                                call.timedata?.startTime
                                              )}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-black">
                                              {call.formdata?.status ===
                                              "solved"
                                                ? setDateandTime(
                                                    call.timedata?.endTime
                                                  )
                                                : ""}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-black">
                                              {formatDuration(
                                                call?.timedata?.duration
                                              ) || "N/A"}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-black">
                                              {call.formdata?.incomingNumber}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-black">
                                              {Array.isArray(
                                                call?.formdata?.attendedBy
                                              )
                                                ? call?.formdata?.attendedBy
                                                    ?.map(
                                                      (attendee) =>
                                                        attendee?.callerId
                                                          ?.name ||
                                                        attendee?.name
                                                    )
                                                    .join(", ")
                                                : call?.formdata?.attendedBy
                                                    ?.callerId?.name}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-black">
                                              {call.formdata?.status
                                                ? Array.isArray(
                                                    call?.formdata?.completedBy
                                                  )
                                                  ? call?.formdata?.completedBy
                                                      ?.map(
                                                        (attendee) =>
                                                          attendee?.callerId
                                                            ?.name ||
                                                          attendee?.name
                                                      )
                                                      .join(", ")
                                                  : call?.formdata?.completedBy
                                                      ?.callerId?.name
                                                : ""}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm capitalize text-black">
                                              {call.formdata?.status}
                                            </td>
                                          </tr>

                                          <tr
                                            className={`${rowClass} border-t-0 border-black text-center`}
                                          >
                                            <td
                                              colSpan="5"
                                              className="px-6 py-2 text-left text-sm text-black"
                                            >
                                              <strong>Description:</strong>{" "}
                                              {call?.formdata?.description ||
                                                "N/A"}
                                            </td>
                                            <td
                                              colSpan="4"
                                              className="px-6 py-2 text-left text-sm text-black"
                                            >
                                              <strong>Solution:</strong>{" "}
                                              {call?.formdata?.solution ||
                                                "N/A"}
                                            </td>
                                          </tr>
                                        </React.Fragment>
                                      )
                                    })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          {showProductPopup && (
            <div className="fixed inset-0 z-50 bg-black/30 p-2 sm:p-3">
              <div className="flex min-h-full items-center justify-center">
                <div className="flex w-full max-w-3xl max-h-[92vh] flex-col overflow-hidden rounded-[14px] bg-white shadow-2xl">
                  <div className="flex shrink-0 items-center justify-between border-b border-[#edf1f7] px-3 py-2.5">
                    <div>
                      <h3 className="text-[14px] font-semibold text-[#162033]">
                        {popupType === "Primaryproduct"
                          ? "Primary Product"
                          : "Additional Service"}
                      </h3>
                      <p className="text-[10px] text-[#7f8aa3]">
                        Add product or service details
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={closePopup}
                      className="rounded-full p-1 text-[#7f8aa3] hover:bg-[#f4f7fb]"
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto px-3 py-2.5">
                    <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-[11px] font-medium text-[#5d6983]">
                          Product / Service
                        </label>
                        <Controller
                          name="productName"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
 isDisabled={true}
                              options={filteredOptionsByType}
                              value={field.value}
                              onChange={(option) => {
                                field.onChange(option)
                                handleProductChange(option)
                              }}
                              placeholder="Select name"
                              styles={compactSelectStyles}
                            />
                          )}
                        />
                      </div>

                      <PopupField
                        label="Short Name"
                        error={errors.shortName?.message}
                      >
                        <input
                          readOnly
                          {...register("shortName")}
                          className="w-full cursor-not-allowed rounded-[8px] border border-[#dfe5ee] bg-[#f3f6fb] px-2.5 py-1.5 text-[12px] text-[#1f2a3d] outline-none"
                          placeholder="Enter Short Name"
                        />
                      </PopupField>

                      <PopupField label="Company">
                        <Controller
                          name="companyName"
readOnly
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
isDisabled={true}
                              options={companyOptions}
                              value={field.value}
                              onChange={(option) => {
                                field.onChange(option)
                                handleCompanyChange(option)
                              }}
                              placeholder="Select company"
                              isDisabled={!selectedProduct}
                              styles={compactSelectStyles}
                            />
                          )}
                        />
                      </PopupField>

                      <PopupField label="Branch">
                        <Controller
                          name="branchName"

                          control={control}
                          render={({ field }) => (
                            <Select

                              {...field}
isDisabled={true}
                              options={branchOptions}
                              value={field.value}
                              onChange={(option) => {
                                field.onChange(option)
                                handleBranchChange(option)
                              }}
                              placeholder="Select branch"
                              isDisabled={!watch("companyName")}
                              styles={compactSelectStyles}
                            />
                          )}
                        />
                      </PopupField>

                      <PopupField
                        label="License Number"
readOnly
                        error={
                          errors.licensenumber?.message ||
                          (!licenseAvailable && watchedLicense
                            ? "License number already exists"
                            : "")
                        }
                      >
                        <input
                          {...register("licensenumber")}
                          readOnly
                          className={`${compactPopupInputClass} ${
                            hasTaggedLicenses
                              ? "cursor-not-allowed bg-[#f3f6fb]"
                              : ""
                          }`}
                          placeholder={
                            popupType === "Primaryproduct"
                              ? "Enter license number"
                              : hasTaggedLicenses
                                ? "Auto handled by tagged licenses"
                                : "Enter license number"
                          }
                          onChange={(e) => {
                            console.log(primaryProducts.length)
                            console.log(additionalServices.length)
                            console.log(hasTaggedLicenses)
                            if (hasTaggedLicenses) return
                            let index = 0
                            if (popupType === "Primaryproduct") {
                              if (primaryProducts.length > 0) {
                                index++
                              }
                              console.log("hhh")
                            } else if (popupType === "Additionalservice") {
                              console.log("hh")
                              if (additionalServices.length > 0) {
                                index++
                              }
                            }
                            setValue("licensenumber", e.target.value)
                            console.log(index)
                            if (debounceTimersRef.current[index]) {
                              clearTimeout(debounceTimersRef.current[index])
                            }
                            const licenseValue = e.target.value
                            console.log(licenseValue)
                            debounceTimersRef.current[index] = setTimeout(
                              () => {
                                handleLicenseBlur(licenseValue)
                                delete debounceTimersRef.current[index]
                              },
                              1000
                            )
                            clearErrors("licensenumber")
                          }}
                        />
                      </PopupField>

                      {popupType === "Primaryproduct" && (
                        <PopupField label="Software Trade">
                          <select
disabled
                            {...register("softwareTrade")}
                            className={compactPopupInputClass}
                          >
                            <option value="">Select Software Trade</option>
                            {softwareTrades.map((trade, index) => (
                              <option key={index} value={trade}>
                                {trade}
                              </option>
                            ))}
                          </select>
                        </PopupField>
                      )}

                      {popupType === "Primaryproduct" && (
                        <PopupField label="Application Date">
                          <input
                            type="date"
readOnly
                            {...register("applicationDate")}
                            className={compactPopupInputClass}
                          />
                        </PopupField>
                      )}

                      {popupType === "Additionalservice" &&
                        !hasTaggedLicenses && (
                          <PopupField label="Next Due">
                            <input
readOnly
                              type="date"
                              {...register("nextDue")}
                              className={compactPopupInputClass}
                            />
                          </PopupField>
                        )}

                      <PopupField label="No of Quantity / Users">
                        <input
                          type="number"
readOnly
                          {...register("noofusers")}
                          // className={`${compactPopupInputClass} no-spinner`}
                          className={`${compactPopupInputClass} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0`}
                        />
                      </PopupField>

                      <PopupField label="Amount">
                        <input
readOnly
                          type="number"
                          {...register("productAmount")}
                          // className={compactPopupInputClass}
                          className={`${compactPopupInputClass} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0`}
                        />
                      </PopupField>

                      <PopupField label="Status">
                        <select
disabled
                          {...register("isActive")}
                          className={compactPopupInputClass}
                        >
                          <option value="Running">Active</option>
                          <option value="Deactive">Deactive</option>
                        </select>
                      </PopupField>

                      {popupType === "Additionalservice" && (
                        <div className="md:col-span-2">
                          <label className="mb-1 block text-[11px] font-medium text-[#5d6983]">
                            Tagged License Numbers
                          </label>

                          <div className="max-h-28 overflow-y-auto rounded-[8px] border border-[#e7ebf4] bg-[#fafcff] p-2">
                            {primaryLicenseOptions.length > 0 ? (
                              <div className="grid grid-cols-1 gap-1.5 md:grid-cols-2">
                                {primaryLicenseOptions.map((licenseNo) => {
                                  const selectedTaggedLicenses =
                                    watch("taggedLicenses") || []
                                  const checked =
                                    selectedTaggedLicenses.includes(
                                      String(licenseNo)
                                    )

                                  return (
                                    <label
                                      key={licenseNo}
                                      className="flex items-center gap-2 rounded-md border border-[#edf1f7] bg-white px-2 py-1.5 text-[11px] text-[#4f5d78]"
                                    >
                                      <input
                                        type="checkbox"
disabled
                                        checked={checked}
                                        onChange={(e) => {
                                          const prev =
                                            watch("taggedLicenses") || []
                                          const dueMap =
                                            watch("taggedLicenseDueDates") || {}

                                          if (e.target.checked) {
                                            setValue("taggedLicenses", [
                                              ...prev,
                                              String(licenseNo)
                                            ])
                                            setValue("licensenumber", "")
                                            setValue("taggedLicenseDueDates", {
                                              ...dueMap,
                                              [String(licenseNo)]:
                                                dueMap[String(licenseNo)] || ""
                                            })
                                          } else {
                                            const updatedLicenses = prev.filter(
                                              (item) =>
                                                String(item) !==
                                                String(licenseNo)
                                            )

                                            const updatedDueMap = { ...dueMap }
                                            delete updatedDueMap[
                                              String(licenseNo)
                                            ]

                                            setValue(
                                              "taggedLicenses",
                                              updatedLicenses
                                            )
                                            setValue(
                                              "taggedLicenseDueDates",
                                              updatedDueMap
                                            )

                                            if (updatedLicenses.length === 0) {
                                              setValue("licensenumber", "")
                                            }
                                          }
                                        }}
                                      />
                                      <span>{licenseNo}</span>
                                    </label>
                                  )
                                })}
                              </div>
                            ) : (
                              <p className="text-[11px] italic text-[#96a0b5]">
                                No primary product license numbers available.
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {popupType === "Additionalservice" &&
                        hasTaggedLicenses && (
                          <div className="md:col-span-2">
                            <label className="mb-1.5 block text-[11px] font-medium text-[#5d6983]">
                              Tagged License Due Details
                            </label>

                            <div className="overflow-hidden rounded-[8px] border border-[#e7ebf4]">
                              <div className="max-h-40 overflow-y-auto">
                                <table className="w-full border-collapse">
                                  <thead className="sticky top-0 bg-[#f8fafc]">
                                    <tr>
                                      <th className="border-b border-[#e7ebf4] px-2.5 py-1.5 text-left text-[11px] font-semibold text-[#43506a]">
                                        License Number
                                      </th>
                                      <th className="border-b border-[#e7ebf4] px-2.5 py-1.5 text-left text-[11px] font-semibold text-[#43506a]">
                                        Next Due
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {watchedTaggedLicenses.map((licenseNo) => (
                                      <tr key={licenseNo}>
                                        <td className="border-b border-[#eef2f7] px-2.5 py-1.5">
                                          <input
                                            value={licenseNo}
                                            readOnly
                                            className="w-full cursor-not-allowed rounded-[7px] border border-[#dfe5ee] bg-[#f3f6fb] px-2 py-1.5 text-[11px] text-[#1f2a3d] outline-none"
                                          />
                                        </td>
                                        <td className="border-b border-[#eef2f7] px-2.5 py-1.5">
                                          <input
                                            type="date"
readOnly
                                            value={
                                              watchedTaggedLicenseDueDates?.[
                                                licenseNo
                                              ] || ""
                                            }
                                            onChange={(e) => {
                                              const dueMap =
                                                watch(
                                                  "taggedLicenseDueDates"
                                                ) || {}
                                              setValue(
                                                "taggedLicenseDueDates",
                                                {
                                                  ...dueMap,
                                                  [licenseNo]: e.target.value
                                                }
                                              )
                                            }}
                                            className={compactPopupInputClass}
                                          />
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="flex shrink-0 justify-end gap-2 border-t border-[#edf1f7] bg-white px-3 py-2.5">
                    <button
                      type="button"
                      onClick={closePopup}
                      className="rounded-md border border-[#e4e9f2] px-3 py-1.5 text-[12px] text-[#5c6981] hover:bg-[#f8fafc]"
                    >
                      Cancel
                    </button>
                    {/* <button
                      type="button"
                      onClick={savePopupData}
                      className="rounded-md bg-[#2f80ed] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[#246cd0]"
                    >
                      {editIndex !== null ? "Update" : "Save"}
                    </button> */}
                  </div>
                </div>
              </div>
            </div>
          )}

          <PerformanceModal
            modalOpen={openModal}
            splitType={targetData?.selectedMeasurementType}
            selectedperiod={selectedPeriod}
            allperiods={targetData?.periods}
            onselectedPeriodChange={(val, val2) => {
              setSelectedMonth(val2)
              setselectedPeriod(val)
            }}
            onMonthChange={(val) => {
              setacheivedProducts([])
              setselectedDataPopup([])
              setperiodMode(val)
              setselecteduserName(null)
            }}
            onYearChange={(val) => {
              setacheivedProducts([])
              setselectedDataPopup([])
              setSelectedYear(val)
              setselecteduserName(null)
            }}
            productlist={productlist}
            onClose={() => {
              setselecteduserName(user?.name)
              setacheivedProducts([])
              setOpenModal(false)
              setActiveUserId(null)
            }}
            selectedMonth={periodMode}
            selectedYear={selectedYear}
            summary={{
              target: selectedDatapopup?.target,
              achieved: selectedDatapopup?.achieved,
              balance:
                selectedDatapopup?.achieved > selectedDatapopup?.target
                  ? 0
                  : selectedDatapopup?.balance
            }}
            products={achievedproducts}
            targetData={targetData?.userWiseResults}
            loggedUser={user}
            selectedUser={selectedUserName}
            category={selectedCategory}
            handleSelectedUser={handleSelectedUser}
            activeUserId={activeUserId}
          />
        </div>
      </div>
    </div>
  )
}
const tileInputClass =
  "w-full border-0 bg-transparent p-0 text-[12px] font-medium text-[#1f2a3d] outline-none placeholder:text-[#c0c8d8]"

const compactPopupInputClass =
  "w-full rounded-[8px] border border-[#dfe5ee] bg-white px-2.5 py-1.5 text-[12px] text-[#1f2a3d] outline-none focus:border-[#7ba7ff]"
