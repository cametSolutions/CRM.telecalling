import { useEffect, useState } from "react"
import MyDatePicker from "../../../components/common/MyDatePicker"
import { PropagateLoader } from "react-spinners"
import { BarLoader } from "react-spinners"
import api from "../../../api/api"
import Tiles from "../../../components/common/Tiles"
import UseFetch from "../../../hooks/useFetch"
import BranchDropdown from "../../../components/primaryUser/BranchDropdown"

const Summary = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [totalcalls, setTotalCalls] = useState(0)
  const [selectedUser, setSelectedUser] = useState(null)
  const [cachedsummary, setCachedsummary] = useState([])
  const [cachedUserlistsummary, setcacheduserSummary] = useState([])
  const [Calls, setCalls] = useState([])
  const [searchTerm, setSearchTerm] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [customerSummary, setCustomerSummary] = useState([])
  const [customerCalls, setCustomerCalls] = useState([])
  const [userCalls, setUserCalls] = useState([])
  const [callList, setCallList] = useState([])
  const [result, setResult] = useState({})
  const [userList, setUserList] = useState([])
  const [branch, setBranch] = useState([])
  const [indiviDualCallList, setIndividualCallList] = useState([])
  const [loggedusers, setloggedUsers] = useState(null)
  const [selectedBranch, setSelectedBranch] = useState("All")
  const [selectedbranchName, setselectedBranchName] = useState(null)
  const [isToggled, setIsToggled] = useState(false)
  const [dates, setDates] = useState({ startDate: "", endDate: "" })
  const [loading, setLoading] = useState(true)
  const { data: branches, loading: branchLoader } =
    UseFetch("/branch/getBranch")
  const { data: staffCallList, loading: staffLoader } = UseFetch(
    isToggled &&
      dates.startDate &&
      dates.endDate &&
      `/auth/staffcallList?startDate=${dates.startDate}&endDate=${dates.endDate}`
  )
  console.log(staffCallList)
  useEffect(() => {
    if (branches && branches.length > 0) {
      const userData = localStorage.getItem("user")
      const user = JSON.parse(userData)
      setloggedUsers(user)

      user.selected.forEach((branches) =>
        setBranch((prev) => [
          ...prev,
          { id: branches.branch_id, branchName: branches.branchName }
        ])
      )
    }
    console.log("dh")
  }, [branches])
  console.log(branch)
  useEffect(() => {
    if (staffCallList) {
      setIndividualCallList(staffCallList)
    }
  }, [staffCallList])
  useEffect(() => {
    const startDate = new Date()

    setDates({ startDate, endDate: startDate })

    // Last date of the month
  }, [])
  console.log(userList)
  useEffect(() => {
    if (dates.startDate && dates.endDate && selectedBranch) {
      const fetchUserList = async () => {
        try {
          const query = `startDate=${dates.startDate}&endDate=${dates.endDate}`
          console.log(query)
          const response = await api.get(`/auth/getStaffCallStatus?${query}`)

          const result = response.data.data
          console.log(result)
          if (result) {
            const processDataAndUpdateList = (data) => {
              setUserList((prevList) => {
                const updatedList = []

                if (!Array.isArray(data)) {
                  console.error("Data is not an array", data)
                  return prevList // keep existing list if something went wrong
                }

                // Step 2: Flatten the nested `data` array
                const flattenedData = data.flat() // Flattens one level deep
                // Pick dataset based on branch selection
                const dataset =
                  selectedBranch === "All"
                    ? flattenedData
                    : flattenedData.filter((call) =>
                        call.selected?.some(
                          (sel) => selectedBranch === sel.branch_id
                        )
                      )

                dataset.forEach((item) => {
                  const call = item // first call in the group

                  const existingEntry = updatedList.find(
                    (entry) => entry._id === call.callerId
                  )

                  if (existingEntry) {
                    existingEntry.solvedCalls += call.solvedCalls || 0
                    existingEntry.pendingCalls += call.pendingCalls || 0
                    existingEntry.colleagueSolved += call.colleagueSolved || 0
                    existingEntry.todaysCalls += call.todaysCalls || 0
                    existingEntry.datecalls += call.datecalls || 0
                  } else {
                    updatedList.push({
                      _id: call.callerId,
                      name: call.callerName,
                      solvedCalls: call.solvedCalls || 0,
                      pendingCalls: call.pendingCalls || 0,
                      colleagueSolved: call.colleagueSolved || 0,
                      datecalls: call.datecalls || 0,
                      todaysCalls: call.todaysCalls || 0,
                      selected: call.selected || []
                    })
                  }
                })
                console.log(updatedList)
                return updatedList
              })
              setcacheduserSummary((prevList) => {
                const updatedList = []

                if (!Array.isArray(data)) {
                  console.error("Data is not an array", data)
                  return prevList // keep existing list if something went wrong
                }
                const branchIds = branch.map((b) => b.branch_id)

                // Step 2: Flatten the nested `data` array
                const flattenedData = data.flat() // Flattens one level deep
                // Step 3: Filter calls that have any selected branch matching `branchIds`
                const filtered = flattenedData.filter((call) =>
                  call.selected?.some((sel) =>
                    branchIds.includes(sel.branch_id)
                  )
                )
                filtered.forEach((item) => {
                  const call = item // first call in the group

                  const existingEntry = updatedList.find(
                    (entry) => entry._id === call.callerId
                  )

                  if (existingEntry) {
                    existingEntry.solvedCalls += call.solvedCalls || 0
                    existingEntry.pendingCalls += call.pendingCalls || 0
                    existingEntry.colleagueSolved += call.colleagueSolved || 0
                    existingEntry.todaysCalls += call.todaysCalls || 0
                    existingEntry.datecalls += call.datecalls || 0
                  } else {
                    updatedList.push({
                      _id: call.callerId,
                      name: call.callerName,
                      solvedCalls: call.solvedCalls || 0,
                      pendingCalls: call.pendingCalls || 0,
                      colleagueSolved: call.colleagueSolved || 0,
                      datecalls: call.datecalls || 0,
                      todaysCalls: call.todaysCalls || 0,
                      selected: call.selected || []
                    })
                  }
                })

                return updatedList
              })
            }
            processDataAndUpdateList(result)
            setLoading(false)
          }
        } catch (error) {
          console.error("Error fetching user list:", error)
        }
      }
      if (isToggled) {
        console.log("Hd")

        setTotalCalls(0)
        fetchUserList()
        setLoading(true)
      } else {
        if (callList && callList.length > 0 && selectedBranch) {
          console.log(callList)
          const customerSummaries = callList
            .filter(
              (customer) =>
                selectedBranch === "All" ||
                customer?.callregistration?.some((call) =>
                  call?.branchName?.includes(selectedbranchName)
                )
            )
            .map((customer) => {
              const totalCalls = customer.callregistration.length
              const startDate = new Date(dates.startDate)
                .toISOString()
                .split("T")[0] // Convert start date to a Date object
              const endDate = new Date(dates.endDate)
                .toISOString()
                .split("T")[0] // Convert end date to a Date object

              const dateCalls = customer.callregistration.filter((call) => {
                const callDate = new Date(call.timedata.startTime)
                  .toISOString()
                  .split("T")[0] // Convert call's startTime to a Date object

                return callDate >= startDate && callDate <= endDate // Check if call is within the range
              }).length

              const solvedCalls = customer.callregistration.filter((call) => {
                const callDate = new Date(call.timedata.startTime)
                  .toISOString()
                  .split("T")[0] // Convert call's startTime to a Date object
                return (
                  call.formdata.status === "solved" && // Check if status is solved
                  callDate >= startDate &&
                  callDate <= endDate // Check if within date range
                )
              }).length

              const pendingCalls = dateCalls - solvedCalls
              const today = new Date().toISOString().split("T")[0]

              const todaysCalls = customer.callregistration.filter((call) => {
                const callDate = new Date(call?.timedata?.startTime)
                  .toISOString()
                  .split("T")[0] // Convert call's startTime to a Date object
                const isInDateRange =
                  callDate >= startDate && callDate <= endDate // Check if within date range
                const isToday = callDate === today // Check if the call is for today
                return isInDateRange && isToday // Only include calls that match both criteria
              }).length
              // Extract unique last 3 mobile numbers (incomingNumber)
              const uniqueIncomingNumbers = []
              for (const call of customer.callregistration) {
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
                dateCalls,
                mobileNumbers: uniqueIncomingNumbers,
                serialNumbers: uniqueSerialNumbers
              }
            })
          if (customerSummaries) {
            setCustomerSummary(customerSummaries)
            setCachedsummary(customerSummaries)
          }
        } else {
          setCustomerSummary([])
          setCachedsummary([])
        }
      }
    }
  }, [callList, selectedBranch, isToggled, dates])

  useEffect(() => {
    if (isToggled && userList && userList.length) {
      userList.forEach((item) => setTotalCalls((prev) => prev + item.datecalls))
    } else if (customerSummary && customerSummary.length && !isToggled) {
      customerSummary.forEach((ite) =>
        setTotalCalls((prev) => prev + ite.totalCalls)
      )
    }
  }, [customerSummary, userList])
  useEffect(() => {
    if (cachedsummary && cachedsummary.length > 0) {
      if (isToggled) {
        if (searchTerm === null) {
          return
        } else if (searchTerm === "") {
          setUserList(cachedUserlistsummary)
        } else if (searchTerm) {
          const filteredCalls = cachedUserlistsummary.filter((call) =>
            call.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          setUserList(filteredCalls)
        }
      } else {
        if (searchTerm === null) {
          return
        } else if (searchTerm === "") {
          setCustomerSummary(cachedsummary)
        } else if (searchTerm) {
          const filteredCalls = cachedsummary.filter((call) =>
            call.customerName.toLowerCase().includes(searchTerm.toLowerCase())
          )
          setCustomerSummary(filteredCalls)
        }
      }
    }
  }, [searchTerm])

  useEffect(() => {
    if (isModalOpen && selectedCustomer) {
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

      setCustomerCalls(customerData)
      setCalls(sortedCalls)
    }
    if (isModalOpen && selectedUser) {
      const today = new Date().toISOString().split("T")[0] // Today's date in 'YYYY-MM-DD' format
      console.log(indiviDualCallList)
      const filteredCalls = indiviDualCallList
        .map((item) => {
          const matchedCallregistration = item.callregistration.filter((call) =>
            call.formdata.attendedBy.some(
              (attendee) => attendee.callerId === selectedUser
            )
          )

          if (matchedCallregistration.length > 0) {
            return {
              ...item, // Include other fields of the item
              callregistration: matchedCallregistration // Include only matched calls
            }
          }

          return null // Exclude calls without matches
        })
        .filter((item) => item !== null) // Remove `null` entries from the final array

      const result = filteredCalls.reduce(
        (acc, item) => {
          item.callregistration.forEach((call) => {
            const startTimeRaw = call?.timedata?.startTime
            const callDate = startTimeRaw
              ? new Date(startTimeRaw.split(" ")[0]).toISOString().split("T")[0]
              : null
            acc.totalCalls++ // Increment total calls

            if (today === callDate) {
              acc.todaysCall++
            }

            if (call.formdata.status.toLowerCase() === "solved") {
              const attendedByCallerIds = call.formdata.completedBy.map(
                (attendee) => attendee.callerId === selectedUser
              )
              if (attendedByCallerIds) {
                acc.solvedCalls++
              } else {
                acc.colleagueSolvedCalls++
              }
            } else {
              acc.pendingCalls++ // Increment pending calls
            }
          })
          return acc
        },
        {
          totalCalls: 0,
          solvedCalls: 0,
          pendingCalls: 0,
          todaysCall: 0,
          colleagueSolvedCalls: 0
        } // Initialize counters
      )

      setResult(result)

      // Helper function to check if a date is today's date
      const isToday = (dateString) => {
        const today = new Date()
        const date = new Date(dateString)
        return (
          today.getFullYear() === date.getFullYear() &&
          today.getMonth() === date.getMonth() &&
          today.getDate() === date.getDate()
        )
      }
      console.log(filteredCalls)
      // Sort calls
      const sortedCalls = filteredCalls
        .map((call) => {
          // Flatten call registrations with their parent
          return call.callregistration.map((registration) => ({
            ...registration,
            customerName: call?.customerName,
            customerId: call?.customerid,
            productName: call?.productDetails[0]?.productName
          }))
        })
        .flat()
        .sort((a, b) => {
          // Priority: Pending, Today's Calls, Solved
          const getPriority = (registration) => {
            if (registration.formdata.status !== "solved") return 1 // Pending
            if (isToday(registration.timedata.startTime)) return 2 // Today's calls
            return 3 // Solved
          }

          return getPriority(a) - getPriority(b)
        })
      // Group back by customer
      const groupedCalls = sortedCalls.reduce((acc, registration) => {
        const customerId = registration.customerId
        if (!acc[customerId]) {
          acc[customerId] = {
            customerid: {
              _id: customerId,
              customerName: registration.customerName
            },
            callregistration: []
          }
        }
        acc[customerId].callregistration.push(registration)
        return acc
      }, {})

      const finalResult = Object.values(groupedCalls)

      if (finalResult) {
        setCustomerCalls(result)
        setUserCalls(finalResult)

        setLoading(false)
      }
    }
  }, [isModalOpen, selectedUser, selectedCustomer])
  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const today = new Date().toISOString().split("T")[0]
        if (today < dates.endDate) {
          return
        }
        setLoading(true)
        setTotalCalls(0)
        const query = `startDate=${dates.startDate}&endDate=${dates.endDate}`
        const response = await api.get(
          `/customer/getselectedDateCalls?${query}`
        ) // Replace with your API endpoint
        const data = response.data.data

        setLoading(false)
        if (loggedusers?.role === "Admin") {
          setCallList(data)
        } else {
          const userBranchName = new Set(
            loggedusers?.selected.map((branch) => branch.branchName)
          )
          const branchNamesArray = Array.from(userBranchName)

          const filtered = data.filter(
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
      } catch (error) {
        console.error("Error fetching calls:", error)
      }
    }
    if (
      branch &&
      branch.length > 0 &&
      dates.startDate &&
      dates.endDate &&
      loggedusers &&
      !isToggled
    ) {
      setCallList([])
      fetchCalls()
    } else {
      return
    }
  }, [branch, loggedusers, dates])

  const handleBranchChange = (id, branchName) => {
    setTotalCalls(0)
    setselectedBranchName(branchName)
    setSelectedBranch(id)
  }

  const toggle = () => {
    setIsToggled(!isToggled)
    setTotalCalls(0)
  }
  console.log(isToggled)
  const openModal = (id) => {
    if (isToggled) {
      setSelectedUser(id)
    } else {
      setSelectedCustomer(id)
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    // setLoading(true)
    setIsModalOpen(false)
    setSelectedCustomer(null)
    setSelectedUser(null)
  }
  console.log(customerSummary)
  return (
    <div className="flex flex-col h-full">
      {loading && (
        <div>
          <BarLoader
            cssOverride={{ width: "100%", height: "4px" }} // Tailwind's `h-4` corresponds to `16px`
            color="#4A90E2" // Change color as needed
            // loader={true}
          />
        </div>
      )}
      <div className="md:px-5 lg:px-6 ">
        <div className="flex justify-center text-2xl font-semibold ">
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-600">
            {isToggled ? "User Summary" : "Customer Summary"}
          </h1>
        </div>

        <div>
          <h2 className="text-xl font-semibold leading-tight">Branches</h2>

          <div className="flex">
            <div className="flex md:w-1/4 gap-2">
              <BranchDropdown
                branches={branch}
                onBranchChange={handleBranchChange}
                branchSelected={selectedBranch}
              />

              <input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setTotalCalls(0)
                }}
                className="w-full border border-gray-300 rounded-full py-1 px-4 pl-10 focus:outline-none cursor-pointer"
                placeholder="Search Name.."
              />
            </div>

            <div className=" flex flex-grow justify-end items-center">
              <div className="flex gap-2">
                <span>{isToggled ? "User" : "Customer"}</span>
                <button
                  onClick={toggle}
                  className={`${
                    isToggled ? "bg-green-500" : "bg-gray-300"
                  } w-12 h-6 flex items-center rounded-full p-0 mr-2 transition-colors duration-300`}
                >
                  <div
                    className={`${
                      isToggled ? "translate-x-6" : "translate-x-0"
                    } w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300`}
                  ></div>
                </button>
              </div>

              {dates.startDate && (
                <MyDatePicker setDates={setDates} dates={dates} />
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between md:flex md:justify-start">
          <div className="text-blue-700">
            {isToggled
              ? `Total Staff-${userList.length}`
              : `Total customer-${customerSummary.length}`}
          </div>
          <div className="text-blue-700 ml-5">
            {`Total Calls-${totalcalls}`}
          </div>
        </div>
      </div>

      <div className="flex-1 md:mx-5 lg:mx-6 mb-3 mt-1 overflow-y-auto rounded-lg shadow-xl border border-gray-300">
        <table className="min-w-full leading-normal text-left max-w-7xl mx-auto  ">
          <thead className="sticky top-0 z-30 bg-purple-300">
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {isToggled ? "User Name" : "Customer Name"}
              </th>
              {!isToggled && (
                <th className="px-5 py-3 border-b-2 border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                  Total Calls
                </th>
              )}
              {!isToggled && (
                <th className="px-5 py-3 border-b-2 border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                  Mobile No
                </th>
              )}
              {!isToggled && (
                <th className="px-5 py-3 border-b-2 border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                  License No
                </th>
              )}

              <th className="px-5 py-3 border-b-2 border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                date Calls
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                Solved Calls
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                Pending Calls
              </th>
              {isToggled && (
                <th className="px-5 py-3 border-b-2 border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                  Colleague Solved
                </th>
              )}
              {!isToggled && (
                <th className="px-5 py-3 border-b-2 border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                  Today's Calls
                </th>
              )}
              <th className="px-5 py-3 border-b-2 border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                View
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(isToggled ? userList : customerSummary) &&
              ((isToggled ? userList : customerSummary).length > 0 ? (
                (isToggled ? userList : customerSummary).map((item) => (
                  <tr key={item._id || item.customerId}>
                    <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                      {isToggled ? item.name : item.customerName}
                    </td>
                    {!isToggled && (
                      <td className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm">
                        {item.totalCalls}
                      </td>
                    )}
                    {!isToggled && (
                      <td className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm">
                        {item.mobileNumbers?.join(", ")}
                      </td>
                    )}
                    {!isToggled && (
                      <td className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm">
                        {item.serialNumbers?.join(", ")}
                      </td>
                    )}

                    <td className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm">
                      {isToggled ? item.datecalls : item.dateCalls}
                    </td>
                    <td className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm">
                      {isToggled ? item.solvedCalls : item.solvedCalls}
                    </td>
                    <td className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm">
                      {isToggled ? item.pendingCalls : item.pendingCalls}
                    </td>
                    {isToggled && (
                      <td className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm">
                        {item.colleagueSolved}
                      </td>
                    )}
                    {!isToggled && (
                      <td className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm">
                        {item.todaysCalls}
                      </td>
                    )}
                    <td className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm">
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
                  <td colSpan="9" className="text-center py-4">
                    {loading || branchLoader || staffLoader ? (
                      <div className="justify center">
                        <PropagateLoader color="#3b82f6" size={10} />
                      </div>
                    ) : (
                      <div className="text-blue-500">No Data Available!.</div>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50  items-center justify-center z-50 h-screen p-8">
          <div className="w-full bg-white shadow-lg rounded md:px-8 md:py-3 flex flex-col  h-full ">
            <div className="flex justify-center text-indigo-500 text-2xl gap-2">
              {/* {isToggled ? selectedUser : customerCalls.customerName}call summary */}
              <span>
                {isToggled ? selectedUser : customerCalls.customerName}
              </span>
              <span>Call Summary</span>
            </div>

            <hr className="border-t-2 border-gray-300 m-1" />
            {/* <Tiles datas={registeredcalllist?.alltokens} /> */}
            <div className="flex justify-around">
              {!isToggled && (
                <Tiles
                  title="Pending Calls"
                  // count={result?.pendingCalls || customerCalls?.pendingCalls}
                  count={customerCalls?.pendingCalls ?? 0}
                  style={{
                    background: `linear-gradient(135deg, rgba(255, 0, 0, 1), rgba(255, 128, 128, 1))` // Adjust gradient here
                  }}
                  // onClick={() => {
                  //   setActiveFilter("Pending")
                  //   setFilteredCalls(applyFilter()) // Update filteredCalls when tile is clicked
                  // }}
                />
              )}

              {isToggled && (
                <Tiles
                  title="Pending Calls"
                  // count={result?.pendingCalls || customerCalls?.pendingCalls}
                  count={result?.pendingCalls ?? 0}
                  style={{
                    background: `linear-gradient(135deg, rgba(255, 0, 0, 1), rgba(255, 128, 128, 1))` // Adjust gradient here
                  }}
                  // onClick={() => {
                  //   setActiveFilter("Pending")
                  //   setFilteredCalls(applyFilter()) // Update filteredCalls when tile is clicked
                  // }}
                />
              )}
              {!isToggled && (
                <Tiles
                  title="Solved Calls"
                  color="bg-green-500"
                  // count={result?.solvedCalls ?? 0 || customerCalls?.solvedCalls??0}
                  count={customerCalls?.solvedCalls ?? 0}
                  style={{
                    background: `linear-gradient(135deg, rgba(0, 140, 0, 1), rgba(128, 255, 128,1 ))`
                  }}
                  // onClick={() => {
                  //   setActiveFilter("Solved")

                  //   setFilteredCalls(applyFilter()) // Update filteredCalls when tile is clicked
                  // }}
                />
              )}

              {isToggled && (
                <Tiles
                  title="Solved Calls"
                  color="bg-green-500"
                  // count={result?.solvedCalls ?? 0 || customerCalls?.solvedCalls??0}
                  count={result?.solvedCalls ?? 0}
                  style={{
                    background: `linear-gradient(135deg, rgba(0, 140, 0, 1), rgba(128, 255, 128,1 ))`
                  }}
                  // onClick={() => {
                  //   setActiveFilter("Solved")
                  //   setFilteredCalls(applyFilter()) // Update filteredCalls when tile is clicked
                  // }}
                />
              )}

              {isToggled && (
                <Tiles
                  title="Today's Calls"
                  color="bg-yellow-500"
                  // count={result?.todaysCall || customerCalls?.todaysCalls}
                  count={result?.todaysCall ?? 0}
                  style={{
                    background: `linear-gradient(135deg, rgba(255, 255, 1, 1), rgba(255, 255, 128, 1))`
                  }}
                />
              )}
              {!isToggled && (
                <Tiles
                  title="Today's Calls"
                  color="bg-yellow-500"
                  // count={result?.todaysCall || customerCalls?.todaysCalls}
                  count={customerCalls?.todaysCalls ?? 0}
                  style={{
                    background: `linear-gradient(135deg, rgba(255, 255, 1, 1), rgba(255, 255, 128, 1))`
                  }}
                  // onClick={() => {
                  //   setActiveFilter("Today")
                  //   setFilteredCalls(applyFilter()) // Update filteredCalls when tile is clicked
                  // }}
                />
              )}

              <Tiles
                title={isToggled ? "Colleague Solved" : "Online Call"}
                color="bg-blue-500"
                count={isToggled ? result?.colleagueSolvedCalls : "0"}
                style={{
                  background: `linear-gradient(135deg, rgba(0, 0, 270, 0.8), rgba(128, 128, 255, 0.8))`
                }}
                // onClick={() => {
                //   setActiveFilter("Online")
                //   setFilteredCalls(applyFilter()) // Update filteredCalls when tile is clicked
                // }}
              />
            </div>
            <div className="flex-1 overflow-x-auto shadow-md rounded-lg mt-2 border border-gray-300">
              <table className="table-auto divide-y divide-gray-200 w-full text-center">
                <thead className="bg-purple-300 sticky top-0 z-40  ">
                  <tr>
                    <th className="px-2 py-3 border-b border-gray-300 text-sm text-center whitespace-nowrap">
                      Token No
                    </th>
                    {isToggled && (
                      <th className="px-2 py-3 border-b border-gray-300 text-sm text-center whitespace-nowrap">
                        Customer Name
                      </th>
                    )}

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
                  {isToggled ? (
                    userCalls?.length > 0 ? (
                      userCalls?.map((call) =>
                        call?.callregistration.map((reg) => {
                          const startTimeRaw = reg?.timedata?.startTime
                          const callDate = startTimeRaw
                            ? new Date(startTimeRaw.split(" ")[0])
                                .toISOString()
                                .split("T")[0]
                            : null
                          const today = new Date().toISOString().split("T")[0]

                          const isToday = callDate === today
                          const isCompletedToday =
                            reg?.formdata?.status === "solved"
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
                                key={reg._id}
                                style={{ background: rowColor }}
                                className="border border-b-0 "
                              >
                                <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                  {reg?.timedata?.token}
                                </td>
                                <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                  {call?.customerid?.customerName}
                                </td>

                                <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                  {reg?.productName}
                                </td>
                                <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                  {reg?.license}
                                </td>
                                <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                  {new Date(
                                    reg?.timedata?.startTime
                                  ).toLocaleString()}
                                </td>

                                <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                  {new Date(
                                    reg?.timedata?.endTime
                                  ).toLocaleString()}
                                </td>

                                <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                  {reg?.formdata?.incomingNumber}
                                </td>
                                <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                  {reg?.formdata?.status}
                                </td>
                                <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                  {reg?.formdata?.attendedBy
                                    ?.map((attendee) => attendee?.callerId)
                                    .join(", ")}
                                </td>
                                <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                  {reg?.formdata?.completedBy
                                    ?.map((completer) => completer?.callerId)
                                    .join(", ")}
                                </td>
                              </tr>
                              <tr
                                className={`text-center border-t-0 border-gray-300 ${
                                  reg?.formdata?.status === "solved"
                                    ? "bg-[linear-gradient(135deg,_rgba(0,140,0,1),_rgba(128,255,128,1))]"
                                    : reg?.formdata?.status === "pending"
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
                                  {reg?.formdata?.description || "N/A"}
                                </td>

                                <td
                                  colSpan="2"
                                  className="py-2 px-8 text-sm text-black text-left"
                                >
                                  <strong>Duration:</strong>{" "}
                                  <span className="ml-2">
                                    {`${Math.floor(
                                      (new Date(
                                        reg?.formdata?.status === "solved"
                                          ? reg.timedata?.endTime // Use end date if the call is solved
                                          : new Date().setHours(0, 0, 0, 0) // Use today's date at midnight if not solved
                                      ) -
                                        new Date(
                                          new Date(
                                            reg.timedata?.startTime
                                          ).setHours(0, 0, 0, 0)
                                        )) /
                                        (1000 * 60 * 60 * 24)
                                    )} days`}
                                  </span>
                                  <span className="ml-1">
                                    {reg?.timedata?.duration || "N/A"}
                                  </span>
                                </td>
                                <td
                                  colSpan="6"
                                  className="py-2 px-12 text-sm text-black text-right"
                                >
                                  <strong>Solution:</strong>{" "}
                                  {reg?.formdata?.solution || "N/A"}
                                </td>
                              </tr>
                            </>
                          )
                        })
                      )
                    ) : (
                      <tr>
                        <td colSpan={5}>
                          {loading ? "Loading..." : "No calls"}
                        </td>
                      </tr>
                    )
                  ) : (
                    Calls.map((call) => {
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
                              {call?.productdetails?.productName}
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
                              {call?.attendeddetails?.name}
                            </td>
                            <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                              {call?.completedbydetails?.name}
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
                              <strong>Descriptions:</strong>{" "}
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
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center items-center mt-2">
              <button
                className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 p-2 text-white rounded-lg"
                onClick={closeModal}
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Summary
