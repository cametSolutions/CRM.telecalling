import { useEffect, useState } from "react"
import { PropagateLoader } from "react-spinners"
import { CiEdit } from "react-icons/ci"
import MyDatePicker from "../../../components/common/MyDatePicker"
import BarLoader from "react-spinners/BarLoader"
import api from "../../../api/api"
import BranchDropdown from "../../../components/primaryUser/BranchDropdown"
import { useNavigate } from "react-router-dom"
import { formatDate } from "../../../utils/dateUtils"
import Tiles from "../../../components/common/Tiles"
import { parseISO, differenceInDays } from "date-fns"

const ExpiredCustomer = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [dates, setDates] = useState({ startDate: "", endDate: "" })
  const [noofCalls, setnoofCalls] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [searchList, setSearchList] = useState([])
  const [hasMounted, setHasMounted] = useState(false)
  const [showFullAddress, setShowFullAddress] = useState({})
  const [user, setUser] = useState(null)
  const [Calls, setCalls] = useState([])
  const [callList, setCallList] = useState([])
  const [cachedcallsummary, setcachedcallsummary] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [individualData, setIndividualData] = useState([])
  const [branch, setBranch] = useState([])
  const [expiredCustomerId, setExpiredCustomerId] = useState([])
  const [expiredCustomerList, setexpiryRegisterList] = useState([])
  const [cachedcustomerSummary, setcachedcustomerSummary] = useState([])
  const [userBranch, setUserBranch] = useState([])
  const [userBranchId, setUserBranchId] = useState([])
  const [isToggled, setIsToggled] = useState(false)
  const [isCallsToggled, setIscallsToggled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState("All")
  const [selectedBranchName, setselectedBranchName] = useState(null)
  const [expiredCustomerCalls, setExpiredCustomerCalls] = useState([])
  // const { data: branches } = UseFetch("/branch/getBranch")
  const navigate = useNavigate()
  useEffect(() => {
    const now = new Date()

    const startOfMonthUTC = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0)
    )

    const endOfMonthUTC = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 0, 0, 0, 0)
    )
    setDates({
      startDate: startOfMonthUTC.toISOString(),
      endDate: endOfMonthUTC.toISOString()
    })
  }, [])
  useEffect(() => {
    const userData = localStorage.getItem("user")
    const user = JSON.parse(userData)
    user.selected.forEach((branch) =>
      setUserBranch((prev) => [
        ...prev,
        { id: branch.branch_id, branchName: branch.branchName }
      ])
    )
    setUser(user)
    // if (user.role !== "Admin") {
    //   const branchid = user.selected.map((branch) => branch.branch_id)
    //   setUserBranchId(branchid)
    // } else {
    //   const branchid = branches.map((id) => id._id)
    //   setUserBranchId(branchid)
    // }
  }, [])
  // useEffect(() => {
  //   if (expiryRegisterCustomer) {
  //     const userData = localStorage.getItem("user")
  //     const user = JSON.parse(userData)
  //     setUser(user)
  //     if (user.role === "Admin") {
  //       setexpiryRegisterList(expiryRegisterCustomer)
  //     } else {
  //       const userBranchName = new Set(
  //         user?.selected?.map((branch) => branch.branchName)
  //       )

  //       const branchNamesArray = Array.from(userBranchName)

  //       const filtered = expiryRegisterCustomer.filter((customer) =>
  //         customer.selected.some((selection) =>
  //           branchNamesArray.includes(selection.branchName)
  //         )
  //       )
  //       setexpiryRegisterList(filtered)
  //     }
  //     const expiredCustomerIds = expiryRegisterCustomer.map(
  //       (customer) => customer._id
  //     )
  //     setExpiredCustomerId(expiredCustomerIds)
  //   }
  // }, [expiryRegisterCustomer])

  // useEffect(() => {
  //   if (branches) {
  //     setBranch(branches)
  //   }
  // }, [branches])

  // useEffect(() => {
  //   if (isFirstRender.current) {
  //     isFirstRender.current = false
  //     return // Prevent initial API call
  //   }
  //   const fetchExpiryRegisterList = async () => {
  //     try {
  //       const endpoint = isToggled
  //         ? `/customer/getallExpiryregisterCustomer?nextmonthReport=${isToggled}`
  //         : `/customer/getallExpiryregisterCustomer?startDate=${dates.startDate}&endDate=${dates.endDate}`
  //       console.log(endpoint)
  //       const response = await api.get(endpoint)
  //       const data = response.data.data
  //       if (user.role === "Admin") {
  //         setexpiryRegisterList(data)
  //       } else {
  //         const userBranchName = new Set(
  //           user?.selected?.map((branch) => branch.branchName)
  //         )

  //         const branchNamesArray = Array.from(userBranchName)

  //         const filtered = data.filter((customer) =>
  //           customer.selected.some((selection) =>
  //             branchNamesArray.includes(selection.branchName)
  //           )
  //         )
  //         setexpiryRegisterList(filtered)
  //       }
  //       const expiredCustomerIds = data.map((customer) => customer._id)
  //       setExpiredCustomerId(expiredCustomerIds)

  //       setTimeout(() => setLoading(false), 0)
  //     } catch (error) {
  //       console.error("Error fetching user list:", error)
  //     }
  //   }
  //   if (dates && dates.startDate && dates.endDate) {
  //     fetchExpiryRegisterList()
  //   }
  // }, [isToggled, dates])

  useEffect(() => {
    if (callList && callList.length > 0) {
      const customerSummaries = callList
        .filter(
          (customer) =>
            selectedBranch === "All" ||
            customer?.callregistration?.some((call) =>
              call?.branchName?.includes(selectedBranchName)
            )
        )
        .map((customer) => {
          const totalCalls = customer.callregistration.length
          const solvedCalls = customer.callregistration.filter(
            (call) => call.formdata.status === "solved"
          ).length

          const pendingCalls = totalCalls - solvedCalls
          const today = new Date().toISOString().split("T")[0]

          const todaysCalls = customer.callregistration.filter(
            (call) =>
              new Date(call?.timedata?.startTime)
                .toISOString()
                .split("T")[0] === today
          ).length
          // Sort calls by start time (latest first)
          const sortedCalls = [...customer.callregistration].sort(
            (a, b) =>
              new Date(b?.timedata?.startTime) -
              new Date(a?.timedata?.startTime)
          )

          // Extract unique last 3 mobile numbers (incomingNumber)
          const uniqueIncomingNumbers = []
          for (const call of sortedCalls) {
            const num = call?.formdata?.incomingNumber
            if (num && !uniqueIncomingNumbers.includes(num)) {
              uniqueIncomingNumbers.push(num)
            }
            if (uniqueIncomingNumbers.length === 3) break
          }
          // Extract unique last 3 mobile numbers (incomingNumber)
          const uniqueSerialNumbers = []
          for (const call of customer.callregistration) {
            const license = call?.license
            if (license && !uniqueSerialNumbers.includes(license)) {
              uniqueSerialNumbers.push(license)
            }
          }

          return {
            customerId: customer._id,
            customerName: customer.customerName,
            totalCalls,
            solvedCalls,
            pendingCalls,
            todaysCalls,
            mobileNumbers: uniqueIncomingNumbers,
            serialNumbers: uniqueSerialNumbers
          }
        })
      if (customerSummaries) {
        setExpiredCustomerCalls(customerSummaries)
        setcachedcallsummary(customerSummaries)
        setLoading(false)
      }
    }
  }, [callList])

  useEffect(() => {
    setHasMounted(true) // Set this to true AFTER the first render
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const delay = setTimeout(() => {
        const filtered = (
          isCallsToggled ? expiredCustomerCalls : expiredCustomerList
        ).filter((item) =>
          String(item.customerName)
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
        if (isCallsToggled) {
          setExpiredCustomerCalls(filtered)
        } else {
          setexpiryRegisterList(filtered)
        }
        setSearchList(filtered)
        // setexpiryRegisterList(filtered)
      }, 300)
      return () => clearTimeout(delay)
    } else {
      if (isCallsToggled) {
        setExpiredCustomerCalls(cachedcallsummary)
      } else {
        setexpiryRegisterList(cachedcustomerSummary)
      }
    }
  }, [searchTerm])

  useEffect(() => {
    if (!hasMounted) return

    const fetchExpiryRegisterList = async () => {
      try {
        let endpoint = ""
        let method = "get" // Default to GET method
        let payload = null // Initialize payload as null (for GET request)

        if (isCallsToggled) {
          // When calls are toggled, use POST request and send expiredCustomerIds as the payload
          endpoint = "/customer/getallExpiredCustomerCalls"
          payload = {
            expiredCustomerId,
            isAdmin: user.role === "Admin" ? true : false,
            startDate: dates.startDate,
            endDate: dates.endDate,
            userBranchId
          } // Send as body in POST request
          method = "post" // Change method to POST
        } else {
          endpoint = isToggled
            ? `/customer/getallExpiryregisterCustomer?nextmonthReport=${isToggled}`
            : `/customer/getallExpiryregisterCustomer?startDate=${dates.startDate}&endDate=${dates.endDate}`
          // When calls are not toggled, use GET request without a payload
          // endpoint = "/customer/getallExpiryregisterCustomer"
        }

        // Make the API request using either GET or POST
        const response = await api[method](endpoint, payload)

        const data = response.data
        if (data) {
          if (isCallsToggled) {
            if (selectedBranch === "All") {
              setCallList(data.calls)
              setcachedcallsummary(data.calls)
            } else {
              const filteredCalls = data.calls.filter((call) =>
                call?.callregistration?.some(
                  (registration) =>
                    registration?.branchName === selectedBranchName
                )
              )
              setCallList(filteredCalls)
              setcachedcallsummary(data.calls)
            }

            // else {
            //               const userBranchName = new Set(
            //                 user?.selected?.map((branch) => branch.branchName)
            //               )

            //               const branchNamesArray = Array.from(userBranchName)

            //               const filtered = data.calls.filter(
            //                 (call) =>
            //                   Array.isArray(call?.callregistration) && // Check if callregistration is an array
            //                   call.callregistration.some((registration) => {
            //                     const hasMatchingBranch =
            //                       Array.isArray(registration?.branchName) && // Check if branchName is an array
            //                       registration.branchName.some(
            //                         (branch) => branchNamesArray.includes(branch) // Check if any branch matches user's branches
            //                       )

            //                     // If user has only one branch, ensure it matches exactly and no extra branches
            //                     if (branchNamesArray.length === 1) {
            //                       return (
            //                         hasMatchingBranch &&
            //                         registration.branchName.length === 1 &&
            //                         registration.branchName[0] === branchNamesArray[0]
            //                       )
            //                     }

            //                     // If user has more than one branch, just check for any match
            //                     return hasMatchingBranch
            //                   })
            //               )

            //               setCallList(filtered)
            //             }
          } else {
            setcachedcustomerSummary(data.data)
            if (selectedBranch === "All") {
              setexpiryRegisterList(data.data)
            } else {
              const filtered = data.data.filter((customer) =>
                customer.selected.some((selection) =>
                  selectedBranch.includes(selection.branch_id)
                )
              )
              setexpiryRegisterList(filtered)
            }

            // else {
            //               const userBranchName = new Set(
            //                 user?.selected?.map((branch) => branch.branchName)
            //               )

            //               const branchNamesArray = Array.from(userBranchName)

            //               const filtered = data.data.filter((customer) =>
            //                 customer.selected.some((selection) =>
            //                   branchNamesArray.includes(selection.branchName)
            //                 )
            //               )
            //               setcachedcustomerSummary(filtered)
            //               setexpiryRegisterList(filtered)
            //             }
            const expiredCustomerIds = data.data.map((customer) => customer._id)
            setExpiredCustomerId(expiredCustomerIds)
          }
          setLoading(false)
        }
      } catch (error) {
        console.error("Error fetching user list:", error)
      }
    }

    if (dates && dates.startDate && dates.endDate) {
      setLoading(true)
      fetchExpiryRegisterList()
      setCallList([])
      setexpiryRegisterList([])
    }
  }, [isCallsToggled, isToggled, dates, userBranchId])
  useEffect(() => {
    if (isModalOpen && selectedCustomer) {
      const selectedCustomerData = expiredCustomerList.find(
        (customer) => customer._id === selectedCustomer
      )
      setIndividualData(selectedCustomerData)
    }
    if (isModalOpen && selectedCustomer && isCallsToggled) {
      const customerData = callList
        .filter((customer) => customer._id === selectedCustomer) // Filter for the selected customer
        .map((customer) => {
          const today = new Date().toISOString().slice(0, 10) // Get today's date in YYYY-MM-DD format

          // Get all calls for the selected customer
          const allCalls = customer.callregistration.map((call) => call)

          // Calculate summary counts
          const totalCalls = allCalls.length
          const solvedCalls = allCalls.filter(
            (call) => call.formdata?.status === "solved"
          ).length
          const pendingCalls = totalCalls - solvedCalls
          const todaysCalls = allCalls.filter((call) => {
            const callDate = new Date(call?.timedata?.startTime)
              .toISOString()
              .split("T")[0] // Extracts only the date
            return callDate === today
          }).length

          return {
            customerName: customer.customerName,
            totalCalls,
            solvedCalls,
            pendingCalls,
            todaysCalls,
            allCalls // Detailed call records for listing in a table
          }
        })[0] // Assuming there's only one customer with this name

      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().slice(0, 10)
      // Sort calls: pending calls first, today's calls second, and solved calls last
      const sortedCalls = customerData.allCalls.sort((a, b) => {
        const isAPending = a.formdata?.status === "pending"
        const isBPending = b.formdata?.status === "pending"
        const isAToday = a.timedata?.startTime?.slice(0, 10) === today
        const isBToday = b.timedata?.startTime?.slice(0, 10) === today
        const isASolved = a.formdata?.status === "solved"
        const isBSolved = b.formdata?.status === "solved"

        if (isAPending && !isBPending) return -1
        if (!isAPending && isBPending) return 1
        if (isAToday && !isBToday) return -1
        if (!isAToday && isBToday) return 1
        if (isASolved && !isBSolved) return 1
        if (!isASolved && isBSolved) return -1

        return 0
      })

      setnoofCalls(customerData)
      setCalls(sortedCalls)
    }
  }, [isModalOpen, selectedCustomer])

  const handleChange = (id, name) => {
    setSelectedBranch(id)

    setselectedBranchName(name)
    if (id === "All") {
      setexpiryRegisterList(cachedcustomerSummary)
    } else {
      let filtered = []
      if (isCallsToggled) {
        filtered = cachedcallsummary
          .filter((customer) =>
            customer?.callregistration?.some((call) =>
              call?.branchName?.includes(name)
            )
          )
          .map((customer) => {
            const totalCalls = customer.callregistration.length
            const solvedCalls = customer.callregistration.filter(
              (call) => call.formdata.status === "solved"
            ).length

            const pendingCalls = totalCalls - solvedCalls
            const today = new Date().toISOString().split("T")[0]

            const todaysCalls = customer.callregistration.filter(
              (call) =>
                new Date(call?.timedata?.startTime)
                  .toISOString()
                  .split("T")[0] === today
            ).length
            // Sort calls by start time (latest first)
            const sortedCalls = [...customer.callregistration].sort(
              (a, b) =>
                new Date(b?.timedata?.startTime) -
                new Date(a?.timedata?.startTime)
            )

            // Extract unique last 3 mobile numbers (incomingNumber)
            const uniqueIncomingNumbers = []
            for (const call of sortedCalls) {
              const num = call?.formdata?.incomingNumber
              if (num && !uniqueIncomingNumbers.includes(num)) {
                uniqueIncomingNumbers.push(num)
              }
              if (uniqueIncomingNumbers.length === 3) break
            }
            // Extract unique last 3 mobile numbers (incomingNumber)
            const uniqueSerialNumbers = []
            for (const call of customer.callregistration) {
              const license = call?.license
              if (license && !uniqueSerialNumbers.includes(license)) {
                uniqueSerialNumbers.push(license)
              }
            }

            return {
              customerId: customer._id,
              customerName: customer.customerName,
              totalCalls,
              solvedCalls,
              pendingCalls,
              todaysCalls,
              mobileNumbers: uniqueIncomingNumbers,
              serialNumbers: uniqueSerialNumbers
            }
          })

        setExpiredCustomerCalls(filtered)
      } else {
        filtered = cachedcustomerSummary.filter((customer) =>
          customer.selected.some((selection) =>
            id.includes(selection.branch_id)
          )
        )
        setexpiryRegisterList(filtered)
      }
    }
  }

  const toggle = () => {
    setexpiryRegisterList([])
    setLoading(true)
    setIsToggled(!isToggled)
    setIscallsToggled(false)
  }
  const callstoggle = () => {
    setexpiryRegisterList([])
    setLoading(true)
    setIscallsToggled(!isCallsToggled)
    setIsToggled(false)
  }

  const openModal = (id) => {
    setSelectedCustomer(id)

    setIsModalOpen(true)
  }

  const closeModal = () => {
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
    <div className="h-full">
      {loading && (
        <BarLoader
          cssOverride={{ width: "100%", height: "4px" }} // Tailwind's `h-4` corresponds to `16px`
          color="#4A90E2" // Change color as needed
        />
      )}
      <div className="">
        <div className="w-full border-b border-gray-200  sticky top-0 z-20 shadow-sm pb-3 bg-white">
          {/* Page Heading */}
          <div className="text-center mb-4 bg-blue-900 py-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-transparent bg-clip-text text-white">
              {isToggled
                ? isCallsToggled
                  ? "Upcoming Month Expired Customer Calls"
                  : "Upcoming Month Expired Customer's"
                : isCallsToggled
                ? "Expired Customer Calls"
                : "Expired Customer's"}
            </h1>
          </div>
          <div className="mx-3">
            <span className="text-blue-500">
              Count:{" "}
              {isCallsToggled
                ? expiredCustomerCalls.length
                : expiredCustomerList.length}
            </span>
          </div>

          {/* Filters Row */}
          <div className="w-full flex flex-col gap-3 lg:flex-row lg:items-center sm:justify-between px-3">
            {/* Left: Dropdown + Search + Date */}
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              {/* Branch Dropdown */}
              <div className="sm:w-48">
                <BranchDropdown
                  branches={userBranch}
                  branchSelected={selectedBranch}
                  onBranchChange={handleChange}
                />
              </div>

              {/* Search */}
              <div className="relative flex-1 min-w-40">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search customers..."
                  className="w-full pl-10 pr-4 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none"
                />
              </div>

              {/* Date Picker */}
              <div className="w-auto">
                {dates && dates.startDate && (
                  <MyDatePicker setDates={setDates} dates={dates} />
                )}
              </div>
            </div>

            {/* Right: Toggles */}
            <div className="flex flex-row gap-6 justify-end flex-wrap sm:flex-nowrap">
              {/* Upcoming Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 whitespace-nowrap">
                  Upcoming
                </span>
                <button
                  onClick={toggle}
                  className={`w-11 h-6 ${
                    isToggled ? "bg-green-500" : "bg-gray-300"
                  } rounded-full relative focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md absolute top-0.5 left-0.5 transform transition-transform duration-300 ${
                      isToggled ? "translate-x-5" : "translate-x-0"
                    }`}
                  ></div>
                </button>
              </div>

              {/* Calls Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 whitespace-nowrap">
                  Calls
                </span>
                <button
                  onClick={callstoggle}
                  className={`w-11 h-6 ${
                    isCallsToggled ? "bg-green-500" : "bg-gray-300"
                  } rounded-full relative focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md absolute top-0.5 left-0.5 transform transition-transform duration-300 ${
                      isCallsToggled ? "translate-x-5" : "translate-x-0"
                    }`}
                  ></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full shadow-lg mt-6 rounded-lg overflow-hidden px-3">
          <div className="overflow-x-auto lg:max-h-[440px] md:max-h-[390px] overflow-y-auto">
            <table className="min-w-full table-auto text-sm text-left border-collapse">
              <thead className="sticky top-0 bg-purple-300">
                {isCallsToggled ? (
                  <tr>
                    <th className="px-4 py-3 border-b text-gray-700 font-semibold">
                      Customer Name
                    </th>
                    <th className="px-4 py-3 border-b text-gray-700 font-semibold">
                      Mobile No
                    </th>
                    <th className="px-4 py-3 border-b text-gray-700 font-semibold">
                      License No
                    </th>
                    <th className="px-4 py-3 border-b text-gray-700 font-semibold text-center">
                      Total Calls
                    </th>
                    <th className="px-4 py-3 border-b text-gray-700 font-semibold text-center">
                      Solved Calls
                    </th>
                    <th className="px-4 py-3 border-b text-gray-700 font-semibold text-center">
                      Pending Calls
                    </th>
                    <th className="px-4 py-3 border-b text-gray-700 font-semibold text-center">
                      Today's Calls
                    </th>
                    <th className="px-4 py-3 border-b text-gray-700 font-semibold text-center">
                      View
                    </th>
                  </tr>
                ) : (
                  <tr>
                    <th className="px-4 py-3 border-b text-gray-700 font-semibold">
                      Customer Name
                    </th>
                    <th className="px-4 py-3 border-b text-gray-700 font-semibold text-center">
                      Mobile/Phn
                    </th>
                    <th className="px-4 py-3 border-b text-gray-700 font-semibold text-center">
                      Product Name
                    </th>
                    <th className="px-4 py-3 border-b text-gray-700 font-semibold text-center">
                      License No
                    </th>
                    <th className="px-4 py-3 border-b text-gray-700 font-semibold text-center">
                      AMC Start (D-M-Y)
                    </th>
                    <th className="px-4 py-3 border-b text-gray-700 font-semibold text-center">
                      AMC End (D-M-Y)
                    </th>
                    <th className="px-4 py-3 border-b text-gray-700 font-semibold text-center">
                      TUV Expiry (D-M-Y)
                    </th>
                    <th className="px-4 py-3 border-b text-gray-700 font-semibold text-center">
                      License Expiry (D-M-Y)
                    </th>
                    <th className="px-4 py-3 border-b text-gray-700 font-semibold text-center">
                      Status
                    </th>
                    <th className="px-4 py-3 border-b text-gray-700 font-semibold text-center">
                      Edit
                    </th>
                    <th className="px-4 py-3 border-b text-gray-700 font-semibold text-center">
                      View
                    </th>
                  </tr>
                )}
              </thead>

              <tbody>
                {isCallsToggled ? (
                  expiredCustomerCalls?.length > 0 ? (
                    expiredCustomerCalls.map((item) => (
                      <tr
                        key={item._id || item.customerId}
                        className="even:bg-gray-200"
                      >
                        <td className="px-4 py-2 border-b">
                          {showFullAddress[item?.id || item?.customerId] ? (
                            <span>
                              {item?.name || item?.customerName}
                              <button
                                onClick={() =>
                                  handleShowMore(item?.id || item?.customerId)
                                }
                                className="text-blue-600 hover:text-blue-800 font-medium"
                              >
                                Show less
                              </button>
                            </span>
                          ) : (
                            <span>
                              {truncateAddress(
                                item?.name || item?.customerName
                              )}
                              {(item?.name || item?.customerName)?.length >
                                20 && (
                                <button
                                  onClick={() =>
                                    handleShowMore(item?.id || item?.customerId)
                                  }
                                  className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                  ...more
                                </button>
                              )}
                            </span>
                          )}
                          {/* {isToggled ? item.name : item.customerName} */}
                        </td>
                        <td className="px-4 py-2 border-b">
                          {/* {item.mobileNumbers?.join(", ") ||"N/A"} */}
                          {item.mobileNumbers &&
                          item.mobileNumbers.length > 0 ? (
                            <div className="flex flex-col">
                              {item.mobileNumbers.map((num, idx) => (
                                <span key={idx} className="block">
                                  {num}
                                </span>
                              ))}
                            </div>
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td className="px-4 py-2 border-b">
                          {item.serialNumbers &&
                          item.serialNumbers.length > 0 ? (
                            <div className="flex flex-col">
                              {item.serialNumbers.map((num, idx) => (
                                <span key={idx} className="block">
                                  {num}
                                </span>
                              ))}
                            </div>
                          ) : (
                            "N/A"
                          )}
                          {/* {item.serialNumbers?.join(", ")} */}
                        </td>
                        <td className="px-4 py-2 border-b text-center">
                          {item.callstatus?.totalCall || item.totalCalls || "0"}
                        </td>
                        <td className="px-4 py-2 border-b text-center">
                          {item.callstatus?.solvedCalls ||
                            item.solvedCalls ||
                            "0"}
                        </td>
                        <td className="px-4 py-2 border-b text-center">
                          {item.callstatus?.pendingCalls ||
                            item.pendingCalls ||
                            "0"}
                        </td>
                        <td className="px-4 py-2 border-b text-center">
                          {item.todaysCalls || "0"}
                        </td>
                        <td className="px-4 py-2 border-b text-center">
                          <button
                            onClick={() =>
                              openModal(isToggled ? item.name : item.customerId)
                            }
                            className="text-blue-500 hover:text-blue-700"
                          >
                            View Calls
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        No data available
                      </td>
                    </tr>
                  )
                ) : (
                  expiredCustomerList?.map((customer) =>
                    customer.selected?.length > 0 ? (
                      customer.selected.map((item, index) => (
                        <tr
                          key={`${customer._id}-${index}`}
                          className="even:bg-gray-200"
                        >
                          <td className="px-4 py-2 border-b">
                            {customer.customerName || "N/A"}
                          </td>
                          <td className="px-4 py-2 border-b text-center">
                            {customer.mobile || "N/A"}
                          </td>
                          <td className="px-4 py-2 border-b text-center">
                            {item.productName || "N/A"}
                          </td>
                          <td className="px-4 py-2 border-b text-center">
                            {item.licensenumber || "N/A"}
                          </td>
                          <td className="px-4 py-2 border-b text-center">
                            {item.amcstartDate
                              ? new Date(item.amcstartDate).toLocaleDateString(
                                  "en-GB"
                                )
                              : "N/A"}
                          </td>
                          <td className="px-4 py-2 border-b text-center">
                            {item.amcendDate
                              ? new Date(item.amcendDate).toLocaleDateString(
                                  "en-GB"
                                )
                              : "N/A"}
                          </td>
                          <td className="px-4 py-2 border-b text-center">
                            {item.tvuexpiryDate
                              ? new Date(item.tvuexpiryDate).toLocaleDateString(
                                  "en-GB"
                                )
                              : "N/A"}
                          </td>
                          <td className="px-4 py-2 border-b text-center">
                            {item.licenseExpiryDate
                              ? new Date(
                                  item.licenseExpiryDate
                                ).toLocaleDateString("en-GB")
                              : "N/A"}
                          </td>
                          <td className="px-4 py-2 border-b text-center">
                            {customer.isActive || "N/A"}
                          </td>
                          <td className="px-4 py-2 border-b text-center">
                            <CiEdit
                              onClick={() =>
                                navigate(
                                  user.role === "Admin"
                                    ? "/admin/masters/customerEdit"
                                    : "/staff/masters/customerEdit",
                                  {
                                    state: {
                                      customerId:customer._id,
                                      
                                      index,
                                      navigatebackto:
                                        user.role === "Admin"
                                          ? "/admin/reports/expiry-register"
                                          : "/staff/reports/expiry-register"
                                    }
                                  }
                                )
                              }
                              className="cursor-pointer text-lg"
                            />
                          </td>
                          <td className="px-4 py-2 border-b text-center">
                            <button
                              onClick={() => openModal(customer._id)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr key={customer._id}>
                        <td colSpan="11" className="text-center py-4">
                          No Products Selected
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 h-screen">
          <div className="container mx-auto  p-8  h-screen">
            <div className="w-auto  bg-white shadow-lg rounded p-8  h-full flex-col ">
              {!isCallsToggled && (
                <>
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
                      <p className="text-white">
                        {individualData.customerName}
                      </p>
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
                      <h4 className="text-md font-bold text-white">
                        Address 1
                      </h4>
                      <p className="text-white">{individualData.address1}</p>
                    </div>
                    <div className="">
                      <h4 className="text-md font-bold text-white">
                        Address 2
                      </h4>
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
                </>
              )}
              {isCallsToggled && (
                <>
                  {/* <Tiles datas={registeredcalllist?.alltokens} /> */}
                  <div className="flex justify-center text-2xl font-semibold ">
                    <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-600">
                      {" "}
                      {`${noofCalls.customerName}`}
                    </h1>
                  </div>
                  <hr className="border-t-2 border-gray-300 mb-2 " />
                  <div className="flex justify-around mt-4">
                    <Tiles
                      title="Pending Calls"
                      // count={result?.pendingCalls || customerCalls?.pendingCalls}
                      count={noofCalls?.pendingCalls ?? 0}
                      style={{
                        background: `linear-gradient(135deg, rgba(255, 0, 0, 1), rgba(255, 128, 128, 1))` // Adjust gradient here
                      }}
                      // onClick={() => {
                      //   setActiveFilter("Pending")
                      //   setFilteredCalls(applyFilter()) // Update filteredCalls when tile is clicked
                      // }}
                    />

                    <Tiles
                      title="Solved Calls"
                      color="bg-green-500"
                      // count={result?.solvedCalls ?? 0 || customerCalls?.solvedCalls??0}
                      count={noofCalls?.solvedCalls ?? 0}
                      style={{
                        background: `linear-gradient(135deg, rgba(0, 140, 0, 1), rgba(128, 255, 128,1 ))`
                      }}
                      // onClick={() => {
                      //   setActiveFilter("Solved")

                      //   setFilteredCalls(applyFilter()) // Update filteredCalls when tile is clicked
                      // }}
                    />

                    <Tiles
                      title="Today's Calls"
                      color="bg-yellow-500"
                      count={noofCalls?.todaysCalls ?? 0}
                      style={{
                        background: `linear-gradient(135deg, rgba(255, 255, 1, 1), rgba(255, 255, 128, 1))`
                      }}
                    />
                  </div>
                  <h1 className="text-black">{individualData?.customerName}</h1>
                  <div className="overflow-y-auto overflow-x-auto max-h-60 sm:max-h-80 md:max-h-[380px] lg:max-h-[398px] shadow-md rounded-lg mt-2 ">
                    <table className="divide-y divide-gray-200 w-full text-center">
                      <thead className="bg-purple-300 sticky top-0 z-30 ">
                        <tr>
                          <th className="px-2 py-3 border-b border-gray-300 text-sm text-center whitespace-nowrap">
                            Token No
                          </th>

                          <th className="px-2 py-3 border-b border-gray-300 text-sm text-center whitespace-nowrap">
                            Product Name
                          </th>
                          <th className="px-2 py-3 border-b border-gray-300 text-sm text-center whitespace-nowrap">
                            License No
                          </th>

                          <th className="px-10 py-3 border-b border-gray-300 text-sm text-center whitespace-nowrap">
                            Start <br />
                            (D-M-Y)
                          </th>
                          <th className="px-10 py-3 border-b border-gray-300 text-sm text-center whitespace-nowrap">
                            End <br />
                            (D-M-Y)
                          </th>
                          <th className="px-2 py-3 border-b border-gray-300 text-sm text-center whitespace-nowrap">
                            Incoming No
                          </th>
                          <th className="px-2 py-3 border-b border-gray-300 text-sm text-center whitespace-nowrap">
                            Status
                          </th>

                          <th className="px-2 py-3 border-b border-gray-300 text-sm text-center whitespace-nowrap">
                            Attended By
                          </th>
                          <th className="px-2 py-3 border-b border-gray-300 text-sm text-center whitespace-nowrap">
                            Completed By
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-gray-200">
                        {Calls.map((call) => {
                          const startTimeRaw = call?.timedata?.startTime
                          const callDate = startTimeRaw
                            ? new Date(startTimeRaw.split(" ")[0])
                                .toISOString()
                                .split("T")[0]
                            : null
                          const today = new Date().toISOString().split("T")[0]

                          const isToday = callDate === today
                          const isCompletedToday =
                            call?.formdata?.status === "solved"
                          const isPast = callDate < today

                          // Determine row color based on conditions
                          const rowColor = isCompletedToday
                            ? "linear-gradient(135deg, rgba(0, 140, 0, 1), rgba(128, 255, 128, 1))"
                            : isToday
                            ? "linear-gradient(135deg,rgba(255,255,1,1),rgba(255,255,128,1))"
                            : isPast
                            ? "linear-gradient(135deg,rgba(255,0,0,1),rgba(255,128,128,1))"
                            : ""

                          return (
                            <>
                              <tr
                                key={call._id}
                                style={{ background: rowColor }}
                                className="border border-b-0 "
                              >
                                <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                  {call?.timedata?.token}
                                </td>
                                <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                  {call?.product?.productName}
                                </td>
                                <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                  {call?.license}
                                </td>
                                <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                  {new Date(
                                    call?.timedata?.startTime
                                  ).toLocaleDateString("en-GB", {
                                    timeZone: "UTC",
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric"
                                  })}
                                </td>
                                <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                  {call?.formdata?.status === "solved"
                                    ? new Date(
                                        call?.timedata?.endTime
                                      ).toLocaleDateString("en-GB", {
                                        timeZone: "UTC",
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric"
                                      })
                                    : ""}
                                </td>
                                <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                  {call?.formdata?.incomingNumber}
                                </td>
                                <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                  {call?.formdata?.status}
                                </td>
                                <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                  {Array.isArray(call?.formdata?.attendedBy)
                                    ? call?.formdata?.attendedBy
                                        .map(
                                          (attendee) =>
                                            attendee?.callerId?.name ||
                                            attendee?.name
                                        )
                                        .join(", ")
                                    : call?.formdata?.attendedBy?.callerId
                                        ?.name ||
                                      call?.formdata?.attendedBy ||
                                      call?.formdata?.attendedBy?.name}
                                </td>
                                <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                  {call?.formdata?.status === "solved"
                                    ? Array.isArray(call?.formdata?.completedBy)
                                      ? call?.formdata?.completedBy.map(
                                          (attendee) =>
                                            attendee?.callerId?.name ||
                                            attendee?.name
                                        )
                                      : call?.formdata?.completedBy?.callerId
                                          ?.name ||
                                        call?.formdata?.completedBy ||
                                        call?.formdata?.completedBy?.name
                                    : ""}
                                </td>
                              </tr>
                              <tr
                                className={`text-center border-t-0 border-gray-300 ${
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
                                  className="py-2 px-8 text-sm text-black text-left"
                                >
                                  <strong>Description:</strong>{" "}
                                  {call?.formdata?.description || "N/A"}
                                </td>

                                <td
                                  colSpan="2"
                                  className="py-2 px-8 text-sm text-black text-left"
                                >
                                  <strong>Duration:</strong>{" "}
                                  <span className="ml-2">
                                    {`${Math.floor(
                                      (new Date(
                                        call?.formdata?.status === "solved"
                                          ? call.timedata?.endTime // Use end date if the call is solved
                                          : new Date().setHours(0, 0, 0, 0) // Use today's date at midnight if not solved
                                      ) -
                                        new Date(
                                          new Date(
                                            call.timedata?.startTime
                                          ).setHours(0, 0, 0, 0)
                                        )) /
                                        (1000 * 60 * 60 * 24)
                                    )} days`}
                                  </span>
                                  <span className="ml-1">
                                    {call?.timedata?.duration || "N/A"}
                                  </span>
                                </td>
                                <td
                                  colSpan="6"
                                  className="py-2 px-12 text-sm text-black text-right"
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
                </>
              )}

              <div className="flex justify-center items-center mt-8 ">
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

export default ExpiredCustomer
