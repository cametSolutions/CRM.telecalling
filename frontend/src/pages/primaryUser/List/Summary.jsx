import { useEffect, useState } from "react"
import api from "../../../api/api"
import { FaSearch, FaPhone } from "react-icons/fa"
import Tiles from "../../../components/common/Tiles"
import UseFetch from "../../../hooks/useFetch"
import io from "socket.io-client" // Import Socket.IO client
import { UNSAFE_useScrollRestoration } from "react-router-dom"
const socket = io("http://localhost:9000")

const Summary = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [pendingCallsCount, setPendingCallsCount] = useState(0)
  const [todayCallsCount, setTodayCallsCount] = useState(0)
  const [solvedCallsCount, setTodaysSolvedCount] = useState(0)
  const [selectedUser, setSelectedUser] = useState(null)
  const [Calls, setCalls] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [customerSummary, setCustomerSummary] = useState([])
  const [customerCalls, setCustomerCalls] = useState([])
  const [userCalls, setUserCalls] = useState([])
  const [callList, setCallList] = useState([])
  const [result, setResult] = useState({})
  const [userList, setUserList] = useState([])
  const [branch, setBranch] = useState([])
  const [indiviDualCallList, setIndividualCallList] = useState([])
  const { data: branches } = UseFetch("/branch/getBranch")
  const [users, setUsers] = useState(null)
  const [selectedBranch, setSelectedBranch] = useState("All")
  const [isToggled, setIsToggled] = useState(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const { data: staffCallList } = UseFetch("/auth/staffcallList")
  useEffect(() => {
    if (staffCallList) {
      console.log(staffCallList)

      setIndividualCallList(staffCallList)
    }
  }, [staffCallList])

  useEffect(() => {
    if (branches) {
      const userData = localStorage.getItem("user")
      const user = JSON.parse(userData)
      setUsers(user)
      setBranch(branches)
    }
  }, [branches])

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const response = await api.get("/auth/getStaffCallStatus")
        setData(response.data.data)
        setUserList(response.data.data)
      } catch (error) {
        console.error("Error fetching user list:", error)
      }
    }
    if (isToggled) {
      if (userList && userList.length > 0) {
        const staffCallStatus = userList.filter((user) => {
          if (selectedBranch === "All") {
            return true // Include all users if "All" is selected
          }

          const branchMatch = user.selected.some((item) => {
            return item.branchName === selectedBranch
          })

          return branchMatch
        })

        if (staffCallStatus) {
          setUserList(staffCallStatus)
        }
      } else {
        fetchUserList()
      }
    } else {
      console.log(callList)
      console.log(loading)
      console.log(branch)
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

            return {
              customerId: customer._id,
              customerName: customer.customerName,
              totalCalls,
              solvedCalls,
              pendingCalls,
              todaysCalls
            }
          })
        if (customerSummaries) {
          console.log(loading)
          setCustomerSummary(customerSummaries)
          // setLoading(false)
        }
        console.log(loading)
      }
    }
    console.log(callList)
    console.log(selectedBranch)
    console.log(isToggled)
  }, [callList, selectedBranch, isToggled])

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
      console.log(sortedCalls)
      setCustomerCalls(customerData)
      setCalls(sortedCalls)
    }
    if (isModalOpen && selectedUser) {
      const today = new Date().toISOString().split("T")[0] // Today's date in 'YYYY-MM-DD' format
      // Get today's date in YYYY-MM-DD format
      // const today = new Date().toISOString().slice(0, 10)
      // Filter the list by customerid
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
      console.log(filteredCalls)

      const result = filteredCalls.reduce(
        (acc, item) => {
          item.callregistration.forEach((call) => {
            const startTimeRaw = call?.timedata?.startTime
            const callDate = startTimeRaw
              ? new Date(startTimeRaw.split(" ")[0]).toISOString().split("T")[0]
              : null
            acc.totalCalls++ // Increment total calls
            console.log(today)
            console.log(call.timedata.startTime)
            if (today === callDate) {
              console.log(today)
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
      console.log(result)
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

      // Sort calls
      const sortedCalls = filteredCalls
        .map((call) => {
          // Flatten call registrations with their parent
          return call.callregistration.map((registration) => ({
            ...registration,
            customerName: call.customerid.customerName,
            customerId: call.customerid._id
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

      console.log(finalResult)
      if (finalResult) {
        setCustomerCalls(result)
        setUserCalls(finalResult)
        console.log(loading)
        setLoading(false)
      }
    }
  }, [isModalOpen])
  console.log(customerCalls)
  console.log(Calls)

  useEffect(() => {
    if (branch) {
      console.log("hiii")
      socket.emit("updatedCalls")
      // Listen for initial data from the server
      socket.on("updatedCalls", (data) => {
        console.log("hiii")
        if (users.role === "Admin") {
          setCallList(data.calls)
        } else {
          const userBranchName = new Set(
            users.selected.map((branch) => branch.branchName)
          )
          const branchNamesArray = Array.from(userBranchName)
          const filtered = data.calls.filter((call) =>
            call.callregistration.some((registration) => {
              const hasMatchingBranch = registration.branchName.some((branch) =>
                branchNamesArray.includes(branch)
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
      })

      // Cleanup the socket connection when the component unmounts
      return () => {
        socket.off("updatedCalls")
      }
    }
  }, [branch, users])

  const handleChange = (event) => {
    setUserList(data)
    const selected = event.target.value
    if (selected === "All") {
      setSelectedBranch("All")
    } else {
      const branchDetails = branch.find((item) => item._id === selected)
      setSelectedBranch(branchDetails ? branchDetails.branchName : "All")
    }
  }

  const toggle = () => setIsToggled(!isToggled)
  const openModal = (id) => {
    if (isToggled) {
      setSelectedUser(id)
    } else {
      setSelectedCustomer(id)
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setLoading(true)
    setIsModalOpen(false)
    setSelectedCustomer(null)
  }
  console.log(result)
  console.log(customerCalls)
  console.log(customerSummary)
  console.log(Calls)
  console.log(selectedCustomer)
  console.log(customerCalls.pendingCalls)
  return (
    <div className="antialiased font-sans container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <h2 className="text-2xl font-semibold leading-tight">Branches</h2>

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
            <span className="text-gray-600 mr-4 font-bold">User</span>
            <button
              onClick={toggle}
              className={`${
                isToggled ? "bg-green-500" : "bg-gray-300"
              } w-16 h-8 flex items-center rounded-full p-1 transition-colors duration-300`}
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
            {isToggled
              ? `Total Staff-${userList.length}`
              : `Total customer-${customerSummary.length}`}
          </div>
          <div></div>
        </div>

        <div className="w-full mx-auto shadow-lg mt-6">
          <div className="inline-block w-full mx-auto shadow rounded-lg overflow-x-auto lg:max-h-[440px] overflow-y-auto md:max-h-[390px]">
            <table className="min-w-full leading-normal text-left max-w-7xl mx-auto">
              <thead className="sticky top-0 z-30 bg-purple-300">
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Customer Name
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
                        <td className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm">
                          {isToggled
                            ? item.callstatus.totalCall
                            : item.totalCalls}
                        </td>
                        <td className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm">
                          {isToggled
                            ? item.callstatus.solvedCalls
                            : item.solvedCalls}
                        </td>
                        <td className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm">
                          {isToggled
                            ? item.callstatus.pendingCalls
                            : item.pendingCalls}
                        </td>
                        {isToggled && (
                          <td className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm">
                            {item.callstatus.colleagueSolved}
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
                      <td colSpan="7" className="text-center py-4">
                        {loading ? "Loading..." : "N data"}
                      </td>
                    </tr>
                  ))}

                {/* {customerSummary.map((customer) => (
                  <tr key={customer.customerName}>
                    <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                      {customer.customerName}
                    </td>
                    <td className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm">
                      {customer.totalCalls}
                    </td>
                    <td className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm">
                      {customer.solvedCalls}
                    </td>
                    <td className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm">
                      {customer.pendingCalls}
                    </td>
                    <td className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm">
                      {customer.todaysCalls}
                    </td>
                    <td className="px-5 py-3 border-b border-gray-200 bg-white text-center text-sm">
                      <button
                        onClick={() => openModal(customer.customerId)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        View Calls
                      </button>
                    </td>
                  </tr>
                ))} */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 h-screen">
          <div className="container mx-auto  p-8  h-screen">
            <div className="w-auto  bg-white shadow-lg rounded p-4  h-full ">
              <div className="flex justify-between items-center px-4 lg:px-6 xl:px-8 mb-2">
                {/* Search Bar for large screens */}
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
              <hr className="border-t-2 border-gray-300 mb-2 " />
              {/* <Tiles datas={registeredcalllist?.alltokens} /> */}
              <div className="flex justify-around">
                <Tiles
                  title="Pending Calls"
                  count={result?.pendingCalls || customerCalls?.pendingCalls}
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
                  count={result?.solvedCalls || customerCalls?.solvedCalls}
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
                  count={result?.todaysCall || customerCalls?.todaysCall}
                  style={{
                    background: `linear-gradient(135deg, rgba(255, 255, 1, 1), rgba(255, 255, 128, 1))`
                  }}
                  // onClick={() => {
                  //   setActiveFilter("Today")
                  //   setFilteredCalls(applyFilter()) // Update filteredCalls when tile is clicked
                  // }}
                />
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
              <div className="overflow-y-auto overflow-x-auto max-h-60 sm:max-h-80 md:max-h-[380px] lg:max-h-[398px] shadow-md rounded-lg mt-2 ">
                <table className="divide-y divide-gray-200 w-full text-center">
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
                                    {reg?.product?.productName}
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
                                  {/* <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                    {reg.timedata.duration}
                                  </td>
                                  <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                    {reg.formdata.description}
                                  </td>
                                  <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                    {reg.formdata.solution}
                                  </td> */}
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
                                          // console.log(
                                          //   call.formdata.status,
                                          //   attendee
                                          // )
                                          // console.log(attendee)
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
                      })
                    )}

                    {/* {Calls.map((call) => {
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
                            <td className="px-2 py-2 text-sm w-12 text-[#010101]"></td>
                            <td className="px-2 py-2 text-sm w-12 text-[#010101]"></td>
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
                    })} */}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-center items-center mt-8">
                <button
                  className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 p-2 text-white rounded-lg"
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

export default Summary
