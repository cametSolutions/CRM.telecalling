import { useEffect, useState } from "react"
import { PropagateLoader } from "react-spinners"
import MyDatePicker from "../../../components/common/MyDatePicker"
import BarLoader from "react-spinners/BarLoader"
import api from "../../../api/api"
import { formatDate } from "../../../utils/dateUtils"
import UseFetch from "../../../hooks/useFetch"
import Tiles from "../../../components/common/Tiles"
import { parseISO, differenceInDays } from "date-fns"

const ExpiredCustomer = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [dates, setDates] = useState({ startDate: "", endDate: "" })
  const [noofCalls, setnoofCalls] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [searchList, setSearchList] = useState([])
  const [hasMounted, setHasMounted] = useState(false)
  const [user, setUser] = useState(null)
  const [Calls, setCalls] = useState([])
  const [callList, setCallList] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [individualData, setIndividualData] = useState([])
  const [branch, setBranch] = useState([])
  const [expiredCustomerId, setExpiredCustomerId] = useState([])
  const [expiredCustomerList, setexpiryRegisterList] = useState([])

  const [userBranchId, setUserBranchId] = useState([])
  const [isToggled, setIsToggled] = useState(false)
  const [isCallsToggled, setIscallsToggled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState("All")
  const [expiredCustomerCalls, setExpiredCustomerCalls] = useState([])
  const { data: branches } = UseFetch("/branch/getBranch")
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
    if (branches) {
      const userData = localStorage.getItem("user")
      const user = JSON.parse(userData)
      setUser(user)
      if (user.role !== "Admin") {
        const branchid = user.selected.map((branch) => branch.branch_id)
        setUserBranchId(branchid)
      } else {
        const branchid = branches.map((id) => id._id)
        setUserBranchId(branchid)
      }
    }
  }, [branches])
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

  useEffect(() => {
    if (branches) {
      setBranch(branches)
    }
  }, [branches])

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
    if (callList) {
      const customerSummaries = callList
        .filter(
          (customer) =>
            selectedBranch === "All" ||
            customer?.callregistration?.some((call) =>
              call?.branchName?.includes(selectedBranch)
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
        const filtered = expiredCustomerList.filter((item) =>
          String(item.customerName || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
        setSearchList(filtered)
        // setexpiryRegisterList(filtered)
      }, 300)
      return () => clearTimeout(delay)
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
            if (user.role === "Admin") {
              setCallList(data.calls)
            } else {
              const userBranchName = new Set(
                user?.selected?.map((branch) => branch.branchName)
              )

              const branchNamesArray = Array.from(userBranchName)

              const filtered = data.calls.filter(
                (call) =>
                  Array.isArray(call?.callregistration) && // Check if callregistration is an array
                  call.callregistration.some((registration) => {
                    const hasMatchingBranch =
                      Array.isArray(registration?.branchName) && // Check if branchName is an array
                      registration.branchName.some(
                        (branch) => branchNamesArray.includes(branch) // Check if any branch matches user's branches
                      )

                    // If user has only one branch, ensure it matches exactly and no extra branches
                    if (branchNamesArray.length === 1) {
                      return (
                        hasMatchingBranch &&
                        registration.branchName.length === 1 &&
                        registration.branchName[0] === branchNamesArray[0]
                      )
                    }

                    // If user has more than one branch, just check for any match
                    return hasMatchingBranch
                  })
              )

              setCallList(filtered)
            }
          } else {
            if (user.role === "Admin") {
              setexpiryRegisterList(data.data)
            } else {
              const userBranchName = new Set(
                user?.selected?.map((branch) => branch.branchName)
              )

              const branchNamesArray = Array.from(userBranchName)

              const filtered = data.data.filter((customer) =>
                customer.selected.some((selection) =>
                  branchNamesArray.includes(selection.branchName)
                )
              )
              setexpiryRegisterList(filtered)
            }
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
  return (
    <div className="antialiased font-sans container mx-auto px-4 sm:px-8">
      {loading && (
        <BarLoader
          cssOverride={{ width: "100%", height: "4px" }} // Tailwind's `h-4` corresponds to `16px`
          color="#4A90E2" // Change color as needed
        />
      )}
      <div className="py-4 ">
        <div className="flex justify-center text-2xl font-semibold ">
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-600">
            {/* {isToggled
              ? "Upcoming Month Expired Customer's"
              : "Expired Customer's"} */}
            {isToggled
              ? isCallsToggled
                ? "Upcoming Month Expired Customer Calls"
                : "Upcoming Month Expired Customer's"
              : isCallsToggled
              ? "Expired Customer Calls"
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search"
              className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
            />
          </div>

          <div className="flex justify-end flex-grow">
            <div className="mr-4">
              {dates && dates.startDate && (
                <MyDatePicker setDates={setDates} dates={dates} />
              )}
            </div>

            <span className="text-gray-600 mr-4 font-bold">
              Upcoming Month Expiry
            </span>
            <button
              onClick={toggle}
              className={`${
                isToggled ? "bg-green-500" : "bg-gray-300"
              } w-14 h-6 flex items-center rounded-full p-0 mr-2 transition-colors duration-300`}
            >
              <div
                className={`${
                  isToggled ? "translate-x-8" : "translate-x-0"
                } w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300`}
              ></div>
            </button>
            <span className="text-gray-600 mr-4 font-bold">
              Expired Customer Calls
            </span>
            <button
              onClick={callstoggle}
              className={`${
                isCallsToggled ? "bg-green-500" : "bg-gray-300"
              } w-14 h-6 flex items-center rounded-full p-0 transition-colors duration-300`}
            >
              <div
                className={`${
                  isCallsToggled ? "translate-x-8" : "translate-x-0"
                } w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300`}
              ></div>
            </button>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="text-blue-700">
            {/* {customerSummary.length} Total Customers */}
            {isCallsToggled
              ? `Total customer-${expiredCustomerCalls.length}`
              : `Total Customer-${expiredCustomerList.length}`}
          </div>
        </div>
        <div className="w-full mx-auto shadow-lg mt-6">
          <div className="inline-block w-full mx-auto shadow rounded-lg overflow-x-auto lg:max-h-[440px] overflow-y-auto md:max-h-[390px]">
            <table className="min-w-full leading-normal text-left max-w-7xl mx-auto table-fixed">
              <thead className="sticky top-0 z-30 bg-purple-300">
                {isCallsToggled && (
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-xs font-semibold text-gray-600 w-auto">
                      Customer Name
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Mobile No
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider max-w-[130px]">
                      License No
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                      Total Calls
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                      Solved Calls
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                      Pending Calls
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                      Today's Calls
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                      View
                    </th>
                  </tr>
                )}
                {!isCallsToggled && (
                  <tr>
                    <th className=" px-5 py-3 border-b-2 border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left">
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
                )}
              </thead>
              <tbody>
                {isCallsToggled &&
                  expiredCustomerCalls?.map((item) => (
                    <tr key={item._id || item.customerId}>
                      <td className="px-5 py-2 border-b border-gray-200 text-sm  bg-white text-wrap max-w-72">
                        {isToggled ? item.name : item.customerName}
                      </td>
                      <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm max-w-[120px]">
                        {isToggled ? "" : item.mobileNumbers?.join(", ")}
                      </td>
                      <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                        {isToggled ? "" : item.serialNumbers?.join(", ")}
                      </td>
                      <td className="px-5 py-2 border-b border-gray-200 bg-white text-center text-sm">
                        {isToggled
                          ? item.callstatus.totalCall
                          : item.totalCalls}
                      </td>
                      <td className="px-5 py-2 border-b border-gray-200 bg-white text-center text-sm">
                        {isToggled
                          ? item.callstatus.solvedCalls
                          : item.solvedCalls}
                      </td>
                      <td className="px-5 py-2 border-b border-gray-200 bg-white text-center text-sm">
                        {isToggled
                          ? item.callstatus.pendingCalls
                          : item.pendingCalls}
                      </td>

                      <td className="px-5 py-2 border-b border-gray-200 bg-white text-center text-sm">
                        {item.todaysCalls}
                      </td>

                      <td className="px-5 py-2 border-b border-gray-200 bg-white text-center text-sm">
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
                  ))}
                {!isCallsToggled &&
                (Array.isArray(searchList) && searchTerm.trim() !== ""
                  ? searchList
                  : expiredCustomerList
                ).length > 0 ? (
                  (Array.isArray(searchList) && searchTerm.trim() !== ""
                    ? searchList
                    : expiredCustomerList
                  ).map((customer) =>
                    Array.isArray(customer.selected) &&
                    customer.selected.length > 0 ? (
                      customer.selected.map((item) => (
                        <tr key={`${customer._id}-${item._id}`}>
                          <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm text-left max-w-72">
                            {customer?.customerName || "N/A"}
                          </td>
                          <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm text-center">
                            {customer?.mobile || "N/A"}
                          </td>
                          <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm text-center text-nowrap">
                            {item?.productName || "N/A"}
                          </td>

                          <td className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm">
                            {item?.licensenumber || "N/A"}
                          </td>
                          <td className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm">
                            {item?.amcstartDate
                              ? new Date(item.amcstartDate).toLocaleDateString(
                                  "en-GB",
                                  {
                                    timeZone: "UTC",
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric"
                                  }
                                )
                              : "N/A"}
                          </td>
                          <td className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm">
                            {item?.amcendDate
                              ? new Date(item.amcendDate).toLocaleDateString(
                                  "en-GB",
                                  {
                                    timeZone: "UTC",
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric"
                                  }
                                )
                              : "N/A"}
                          </td>
                          <td className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm">
                            {item?.tvuexpiryDate
                              ? new Date(
                                  item.tvuexpiryDate
                                ).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm">
                            {item?.licenseExpiryDate
                              ? new Date(
                                  item.licenseExpiryDate
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
                        <td colSpan="11" className="text-center text-sm py-4">
                          No products selected
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center py-4">
                      {loading ? (
                        <div className="justify-center">
                          <PropagateLoader color="#3b82f6" size={10} />
                        </div>
                      ) : (
                        <div>No data available</div>
                      )}
                    </td>
                  </tr>
                )}
                {/* 
                {!isCallsToggled && (
                  (Array.isArray(searchList) &&
                  searchTerm.trim() !== ""
                    ? searchList
                    : expiredCustomerList
                  ).map((customer) =>
                    Array.isArray(customer.selected) &&
                    customer.selected.length > 0 ? (
                      customer.selected.map((item) => (
                        <tr key={`${customer._id}-${item._id}`}>
                          <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm text-left max-w-72">
                            {customer?.customerName || "N/A"}
                          </td>
                          <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm text-center">
                            {customer?.mobile || "N/A"}
                          </td>
                          <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm text-center text-nowrap">
                            {item?.productName || "N/A"}
                          </td>

                          <td className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm">
                            {item?.licensenumber || "N/A"}
                          </td>
                          <td className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm">
                            {item?.amcstartDate
                              ? new Date(item.amcstartDate).toLocaleDateString(
                                  "en-GB",
                                  {
                                    timeZone: "UTC",
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric"
                                  }
                                )
                              : "N/A"}
                          </td>
                          <td className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm">
                            {item?.amcendDate
                              ? new Date(item.amcendDate).toLocaleDateString(
                                  "en-GB",
                                  {
                                    timeZone: "UTC",
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric"
                                  }
                                )
                              : "N/A"}
                          </td>
                          <td className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm">
                            {item?.tvuexpiryDate
                              ? new Date(
                                  item.tvuexpiryDate
                                ).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm">
                            {item?.licenseExpiryDate
                              ? new Date(
                                  item.licenseExpiryDate
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
                          colSpan="11"
                          className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm"
                        >
                          {loading ? (
                            <div className="justify-center">
                              <PropagateLoader color="#3b82f6" size={10} />
                            </div>
                          ) : (
                            <div>No data available</div>
                          )}
                        </td>
                      </tr>
                    )
                  )
                ) } */}

                {/* {!isCallsToggled &&
(searchTerm.trim() !=="" && Array.isArray(searchList) && searchList.length >0 ? searchList:expiredCustomerList).map((customer) =>
                    Array.isArray(customer.selected) &&
                    customer.selected.length > 0 ? (
                      customer.selected.map((item) => (
                        <tr key={`${customer._id}-${item._id}`}>
                          
                          <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm text-left max-w-72">
                            {customer?.customerName || "N/A"}
                          </td>
                          <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm text-center">
                            {customer?.mobile || "N/A"}
                          </td>
                          <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm text-center">
                            {customer?.isActive || "N/A"}
                          </td>
                          
                          <td className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm">
                            {item?.licensenumber || "N/A"}
                          </td>
                          <td className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm">
                            {item?.amcstartDate
                              ? new Date(item?.amcstartDate).toLocaleDateString(
                                  "en-GB",
                                  {
                                    timeZone: "UTC",
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric"
                                  }
                                )
                              : "N/A"}
                          </td>
                          <td className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm">
                            {item?.amcendDate
                              ? new Date(item?.amcendDate).toLocaleDateString(
                                  "en-GB",
                                  {
                                    timeZone: "UTC",
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric"
                                  }
                                )
                              : "N/A"}
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
                          colSpan="11"
                          className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm"
                        >
                          No Products Selected
                        </td>
                      </tr>
                    )
                  
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center py-4">
                      {loading ? (
                        <div className="justify-center">
                          <PropagateLoader color="#3b82f6" size={10} />
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </td>
                  </tr>
                )}  */}
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
                  {/* <div className="flex justify-between items-center px-4 lg:px-6 xl:px-8 mb-2">
                    
                    <div className="mx-4 md:block items-center">
                      <div className="relative">
                        <FaSearch className="absolute w-5 h-5 left-2 top-2 text-gray-500" />
                      </div>
                      <input
                        type="text"
                        // value={searchQuery}
                        // onChange={handleChange}
                        className=" w-full border border-gray-300 rounded-full py-1 px-4 pl-10 focus:outline-none"
                        placeholder="Search for..."
                      />
                    </div>
                  </div>
                
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
                      // count={result?.todaysCall || customerCalls?.todaysCalls}
                      count={noofCalls?.todaysCalls ?? 0}
                      style={{
                        background: `linear-gradient(135deg, rgba(255, 255, 1, 1), rgba(255, 255, 128, 1))`
                      }}
                      // onClick={() => {
                      //   setActiveFilter("Today")
                      //   setFilteredCalls(applyFilter()) // Update filteredCalls when tile is clicked
                      // }}
                    />
                  </div>
                  <h1 className="text-black">{individualData?.customerName}</h1>
                  <div className="overflow-y-auto overflow-x-auto max-h-60 sm:max-h-80 md:max-h-[380px] lg:max-h-[398px] shadow-md rounded-lg mt-2 ">
                    <table className="divide-y divide-gray-200 w-full text-center">
                      <thead className="bg-purple-300 sticky top-0 z-40  ">
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
