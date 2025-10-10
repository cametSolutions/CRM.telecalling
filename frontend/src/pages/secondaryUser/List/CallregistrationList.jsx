import { useState, useEffect, useCallback, useRef } from "react"
import debounce from "lodash.debounce"
import io from "socket.io-client" // Import Socket.IO client
import { FaSearch, FaPhone } from "react-icons/fa"
import Tiles from "../../../components/common/Tiles" // Import the Tile component
import { useNavigate } from "react-router-dom"
import { PropagateLoader } from "react-spinners"
import UseFetch from "../../../hooks/useFetch"
import { setBranches } from "../../../../slices/companyBranchSlice"
import BranchDropdown from "../../../components/primaryUser/BranchDropdown"
import { getLocalStorageItem } from "../../../helper/localstorage"
const socket = io("https://www.crm.camet.in")
// const socket = io("http://localhost:9000") // Adjust the URL to your backend

const CallregistrationList = () => {
  const navigate = useNavigate()
  const [loggedUserBranches, setLoggeduserBranches] = useState([])
  const [today, setToday] = useState(null)
  const [userBranch, setUserBranch] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUser] = useState(null)
  const [userCallStatus, setUserCallstatus] = useState([])
  const [callList, setCallList] = useState([])
  const [filteredCalls, setFilteredCalls] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedCompanyBranch, setSelectedCompanyBranch] = useState(null)
  // Define states for filtered call counts
  const [pendingCallsCount, setPendingCallsCount] = useState(0)
  const [todayCallsCount, setTodayCallsCount] = useState(0)
  const [solvedCallsCount, setTodaysSolvedCount] = useState(0)
  const [branchids, setbranchids] = useState(null)

  // State to track the active filter
  const [activeFilter, setActiveFilter] = useState("All")
  const { data: branches } = UseFetch("/branch/getbranch")
  const socketRef = useRef(null)
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:9000", {
        transports: ["websocket"], //helps avoid polling issues
        reconnection: true //auto reconnect if dropped
      })
    }
    const socket = socketRef.current
    socket.on("connect", () => {
      console.log("Connected", socket.id)
    })
    socket.on("disconnect", () => {
      socket.off("connect")
      socket.off("disconnect")
    })
  }, [])
  useEffect(() => {
    if (branches && branches.length > 0) {
      const userData = getLocalStorageItem("user")
      if (userData.role === "Admin") {
        const isselctedArray = userData?.selected
        if (isselctedArray) {
          const loggeduserBranches = userData.selected.map((item) => {
            return { value: item.branch_id, label: item.branchName }
          })
          setLoggeduserBranches(loggeduserBranches)
          setSelectedCompanyBranch(loggeduserBranches[0].label)
        } else {
          const loggeduserBranches = branches.map((item) => {
            return { value: item._id, label: item.branchName }
          })
          setLoggeduserBranches(loggeduserBranches)
          setSelectedCompanyBranch(loggeduserBranches[0].label)
        }
      } else {
        const loggeduserBranches = userData.selected.map((item) => {
          return { value: item.branch_id, label: item.branchName }
        })
        setLoggeduserBranches(loggeduserBranches)
        setSelectedCompanyBranch(loggeduserBranches[0].label)
      }
      setbranchids(userData.selected.map((item) => item.branch_id))

      // const users = JSON.parse(userData)
      if (userData.role === "Admin") {
        const userbranch = branches.map((item) => item.branchName)
        setUserBranch(userbranch)
      }

      setUser(userData)
    }
  }, [branches])
  console.log(selectedCompanyBranch)
  const filterCallData = useCallback(
    (calls) => {
      const allCallRegistrations = calls.flatMap(
        (call) => call.callregistration
      )

      // Filter based on status
      const pending = allCallRegistrations.filter(
        (call) => call.formdata?.status?.toLowerCase() === "pending"
      )

      const todaysSolvedCount = getTodaysSolved(calls)

      const todaysCallsCount = getTodaysCalls(calls)

      setPendingCallsCount(pending?.length)
      setTodayCallsCount(todaysCallsCount)
      setTodaysSolvedCount(todaysSolvedCount)
    },
    [users]
  )
  useEffect(() => {
    if (users && selectedCompanyBranch) {
      setLoading(true)
      const userId = users._id
      socket.emit("updatedCalls", userId)
      const brancharray = [selectedCompanyBranch]
      console.log(brancharray)
      // Listen for initial data from the server
      socket.on("updatedCalls", ({ mergedCalls, user }) => {
        // const userBranchName = new Set(
        //   users?.selected?.map((branch) => branch.branchName)
        // )

        // const branchNamesArray = Array.from(userBranchName)
        // console.log(branchNamesArray)
        // setUserBranch(brancharray)

        const filtered = mergedCalls.filter(
          (call) =>
            Array.isArray(call?.callregistration) && // Check if callregistration is an array
            call.callregistration.some((registration) => {
              const hasMatchingBranch =
                Array.isArray(registration?.branchName) && // Check if branchName is an array
                registration.branchName.some(
                  (branch) => brancharray.includes(branch) // Check if any branch matches user's branches
                )

              // If user has only one branch, ensure it matches exactly and no extra branches
              if (brancharray.length === 1) {
                return (
                  hasMatchingBranch &&
                  registration.branchName.length === 1 &&
                  registration.branchName[0] === brancharray[0]
                )
              }

              // If user has more than one branch, just check for any match
              return hasMatchingBranch
            })
        )
        setLoading(false)
        setCallList(filtered)
      })
      //Cleanup the socket connection when the component unmounts
      // return () => {
      //   socket.off("updatedCalls")
      //   socket.disconnect()
      // }
    }
  }, [users, branchids, selectedCompanyBranch])

  useEffect(() => {
    if (callList && callList.length > 0 && users) {
      const today = new Date().toISOString().split("T")[0]
      setToday(today)
      const stats = getCallStats(callList, users.name)

      setUserCallstatus(stats)

      setFilteredCalls(callList)

      filterCallData(callList)
      setLoading(false)
    }
  }, [callList])

  const handleSearch = debounce((search) => {
    setSearchTerm(search)
    const searchText = search.toString().toLowerCase()

    const filteredData = callList.filter((customer) => {
      // Check customerName
      const nameMatch = customer.customerName
        ?.toLowerCase()
        .includes(searchText)

      // Check mobile (if exists)
      const mobileMatch = customer.mobile?.toString().includes(searchText)

      // Check callregistration.incomingNumber or license
      const callMatch = customer.callregistration?.some((call) => {
        const incomingNumberMatch = call.formdata?.incomingNumber
          ?.toString()
          .includes(searchText)
        const branchMatch = call.branchName?.some((branch) =>
          branch.toLowerCase().includes(searchText)
        )
        const licenseMatch = call.license?.toString().includes(searchText)
        return incomingNumberMatch || licenseMatch || branchMatch
      })

      return nameMatch || mobileMatch || callMatch
    })

    setFilteredCalls(filteredData)
  }, 300)

  const handleChange = (e) => handleSearch(e.target.value)
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
  const getTodaysSolved = (calls) => {
    const today = new Date().toISOString().split("T")[0]
    let todaysSolvedCount = 0

    calls.forEach((customer) => {
      customer.callregistration.forEach((call) => {
        if (call.formdata.status === "solved") {
          const callDate = call.timedata.endTime.split("T")[0]
          if (callDate === today) {
            todaysSolvedCount++
          }
        }
      })
    })

    return todaysSolvedCount
  }
  const getCallStats = (calls, userName) => {
    let totalCalls = 0
    let pendingCalls = 0
    let solvedCalls = 0
    let collegeSolvedCalls = 0
    let totalDuration = 0

    const today = new Date().toISOString().split("T")[0] // Get today's date in YYYY-MM-DD format

    calls.forEach((call) => {
      call.callregistration.forEach((registration) => {
        const { formdata, timedata } = registration
        const callDate = timedata.endTime.split("T")[0]
        if (callDate === today) {
          const lastAttended = formdata?.attendedBy?.length
            ? formdata?.attendedBy[formdata.attendedBy.length - 1]
            : null
          if (lastAttended?.callerId?.name === userName) {
            totalCalls++
            // Count all calls for today

            if (
              formdata.status === "pending" &&
              lastAttended?.callerId?.name === userName
            ) {
              pendingCalls++ // Pending call count
            }

            if (
              formdata.status === "solved" &&
              lastAttended?.callerId?.name === userName
            ) {
              if (
                formdata?.completedBy?.length &&
                formdata?.completedBy[formdata?.completedBy?.length - 1]
                  .name === userName
              ) {
                solvedCalls++ // Solved call count
              }

              if (
                formdata?.completedBy?.length &&
                lastAttended?.callerId?.name !==
                  formdata?.completedBy[formdata?.completedBy?.length - 1].name
              ) {
                collegeSolvedCalls++ // College solved call count
              }
            }

            if (
              lastAttended &&
              lastAttended.duration &&
              lastAttended?.callerId?.name === userName
            ) {
              totalDuration += lastAttended.duration // Sum total duration
            }
          }
        }
      })
    })

    return {
      totalCalls,
      pendingCalls,
      solvedCalls,
      collegeSolvedCalls,
      totalDuration
    }
  }

  const getTodaysCalls = (calls) => {
    const today = new Date().toISOString().split("T")[0] // Get today's date in 'YYYY-MM-DD' format

    let todaysCallsCount = 0

    calls.forEach((customer) => {
      customer.callregistration.forEach((call) => {
        const callDate = call.timedata.endTime.split("T")[0] // Get the call date in 'YYYY-MM-DD' format
        if (callDate === today) {
          todaysCallsCount++
        }
      })
    })
    return todaysCallsCount
  }

  // Function to filter calls based on the active tile clicked
  const applyFilter = () => {
    if (activeFilter === "Pending") {
      return callList.filter((call) => call.status === "Pending")
    } else if (activeFilter === "Solved") {
      return callList.filter((call) => call.status === "Solved")
    } else if (activeFilter === "Today") {
      const todayDate = new Date().toISOString().slice(0, 10) // Format today's date as YYYY-MM-DD
      return callList.filter(
        (call) =>
          new Date(call.callDate).toISOString().slice(0, 10) === todayDate
      )
    }
    return callList // Return all if no specific filter is applied
  }

  const formatDuration = (seconds, name) => {
    if (!seconds || isNaN(seconds)) {
      return "0 hr 0 min 0 sec"
    }

    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs} hr ${mins} min ${secs} sec`
  }

  return (
    <div className=" mx-auto p-2  md:p-5 bg-white">
      <div className="w-auto shadow-lg rounded p-4 pt-1 h-full bg-neutral-50 ">
        <div className="flex justify-between items-center px-4 lg:px-6 xl:px-8 mb-2">
          {/* Search Bar for large screens */}

          <div className="mx-4 flex items-center space-x-4">
            {/* Search Input Wrapper */}
            <div className="relative flex items-center w-full">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                // value={searchTerm||""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none"
                placeholder="Search for..."
              />
            </div>

            {/* Label for Call */}
            <label
              onClick={() =>
                navigate(
                  `/${users.role.toLowerCase()}/transaction/call-registration`
                )
              }
              className="text-lg font-medium text-white ml-4 bg-blue-600 px-4 rounded-md hover:bg-blue-800 shadow-lg"
            >
              Call
            </label>
            <select
              // value={selectedCompanyBranch || ""}
              onChange={(e) => {
                setLoading(true)
                setFilteredCalls([])
                setSelectedCompanyBranch(e.target.value)
              }}
              className="border border-gray-300 py-1 rounded-md px-2 focus:outline-none min-w-[120px] cursor-pointer"
            >
              {loggedUserBranches?.map((branch) => (
                <option key={branch._id} value={branch.label}>
                  {branch.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <table className="text-center">
              <tbody>
                <tr>
                  <td
                    style={{
                      padding: "2px",
                      color: "#010bff",
                      fontWeight: "bold"
                    }}
                  >
                    Total Calls
                  </td>
                  <td
                    style={{
                      padding: "2px",
                      color: "#800080",
                      fontWeight: "bold"
                    }}
                  >
                    Colleague Solved
                  </td>
                  <td
                    style={{
                      padding: "2px",
                      color: "#dc3545",
                      fontWeight: "bold"
                    }}
                  >
                    Pending Calls
                  </td>
                  <td
                    style={{
                      padding: "2px",
                      color: "#28a745",
                      fontWeight: "bold"
                    }}
                  >
                    Solved Calls
                  </td>
                  <td
                    style={{
                      padding: "2px",
                      color: "#6c757d",
                      fontWeight: "bold"
                    }}
                  >
                    Total Duration
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "2px", color: "#010bff" }}>
                    {userCallStatus?.totalCalls}
                  </td>
                  <td style={{ padding: "2px", color: "#800080" }}>
                    {userCallStatus?.collegeSolvedCalls}
                  </td>
                  <td style={{ padding: "2px", color: "#dc3545" }}>
                    {userCallStatus?.pendingCalls}
                  </td>
                  <td style={{ padding: "2px", color: "#28a745" }}>
                    {userCallStatus?.solvedCalls}
                  </td>
                  <td style={{ padding: "2px", color: "#6c757d" }}>
                    {formatDuration(userCallStatus?.totalDuration)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* <div>
          <button onClick={handleupdateadmin}>update</button>
        </div> */}

        <hr className="border-t-2 border-gray-300 mb-2 " />
        {/* <Tiles datas={registeredcalllist?.alltokens} /> */}
        <div className="flex justify-around">
          <Tiles
            title="Pending Calls"
            count={pendingCallsCount}
            style={{
              background: `linear-gradient(135deg, rgba(255, 0, 0, 1), rgba(255, 128, 128, 1))` // Adjust gradient here
            }}
            onClick={() => {
              setActiveFilter("Pending")
              setFilteredCalls(applyFilter()) // Update filteredCalls when tile is clicked
            }}
          />

          <Tiles
            title="Solved Calls"
            color="bg-green-500"
            count={solvedCallsCount}
            style={{
              background: `linear-gradient(135deg, rgba(0, 140, 0, 1), rgba(128, 255, 128,1 ))`
            }}
            onClick={() => {
              setActiveFilter("Solved")
              setFilteredCalls(applyFilter()) // Update filteredCalls when tile is clicked
            }}
          />
          <Tiles
            title="Today's Calls"
            color="bg-yellow-500"
            count={todayCallsCount}
            style={{
              background: `linear-gradient(135deg, rgba(255, 255, 1, 1), rgba(255, 255, 128, 1))`
            }}
            onClick={() => {
              setActiveFilter("Today")
              setFilteredCalls(applyFilter()) // Update filteredCalls when tile is clicked
            }}
          />
          <Tiles
            title="Online Call"
            color="bg-blue-500"
            count={"0"}
            style={{
              background: `linear-gradient(135deg, rgba(0, 0, 270, 0.8), rgba(128, 128, 255, 0.8))`
            }}
            onClick={() => {
              setActiveFilter("Online")
              setFilteredCalls(applyFilter()) // Update filteredCalls when tile is clicked
            }}
          />
        </div>
        <div className="overflow-y-auto overflow-x-auto max-h-96 sm:max-h-80 md:max-h-[380px] lg:max-h-[398px] shadow-md rounded-lg mt-2 ">
          <table className="divide-y divide-gray-200 w-full">
            <thead className="bg-purple-300 sticky top-0 z-40  ">
              <tr>
                <th className="px-2 py-3 border-b border-gray-300 text-sm text-center whitespace-nowrap">
                  Branch Name
                </th>

                <th className="px-2 py-3 border-b border-gray-300 text-sm text-center whitespace-nowrap">
                  Token No
                </th>
                <th className="px-2 py-3 border-b border-gray-300 text-sm text-center whitespace-nowrap">
                  Customer Name
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
                <th className="px-2 py-3 border-b border-gray-300 text-sm text-center whitespace-nowrap">
                  Call
                </th>
              </tr>
            </thead>
            <tbody className="divide-gray-200">
              {/* ///for pending calls/// */}
              {filteredCalls?.length > 0 ? (
                <>
                  {filteredCalls
                    .flatMap((calls) =>
                      calls.callregistration.map((item) => ({
                        ...item,
                        calls
                      }))
                    )
                    .filter((item) => item?.formdata?.status === "pending")
                    .sort((a, b) => {
                      const today = new Date().toISOString().split("T")[0]
                      const aDate = new Date(a?.timedata?.endTime)
                        .toISOString()
                        .split("T")[0]
                      const bDate = new Date(b?.timedata?.endTime)
                        .toISOString()
                        .split("T")[0]

                      // Prioritize today's date
                      if (aDate === today && bDate !== today) return -1
                      if (aDate !== today && bDate === today) return 1

                      // For both calls not on today, order by descending date
                      return (
                        new Date(b?.timedata?.endTime) -
                        new Date(a?.timedata?.endTime)
                      )
                    })
                    .map((item) => {
                      const today = new Date().toISOString().split("T")[0]
                      const startTimeRaw = item?.timedata?.endTime
                      const callDate = startTimeRaw
                        ? new Date(startTimeRaw.split(" ")[0])
                            .toISOString()
                            .split("T")[0]
                        : null

                      if (
                        userBranch.some((branch) =>
                          item.branchName.includes(branch)
                        )
                      ) {
                        return (
                          <>
                            <tr
                              key={item.calls?._id}
                              className={`text-center border border-b-0  bg-gray-300 ${
                                callDate === today
                                  ? "bg-[linear-gradient(135deg,_rgba(255,255,1,1),_rgba(255,255,128,1))]"
                                  : "bg-[linear-gradient(135deg,_rgba(255,0,0,1),_rgba(255,128,128,1))]"
                              }`}
                            >
                              <td className="px-2 py-2 w-12 text-sm text-[#010101]">
                                {item.branchName}
                              </td>

                              <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                {item?.timedata.token}
                              </td>
                              <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                {item.calls?.customerName}
                              </td>
                              <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                {item?.calls?.productDetails[0]?.productName}
                              </td>
                              <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                {item?.license}
                              </td>
                              <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                {setDateandTime(item?.timedata?.startTime)}
                              </td>
                              <td className="px-2 py-2 text-sm w-12 text-[#010101]"></td>
                              <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                {item?.formdata?.incomingNumber}
                              </td>
                              <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                {item?.formdata?.status}
                              </td>
                              <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                {Array.isArray(item?.formdata?.attendedBy)
                                  ? item.formdata.attendedBy.length > 0
                                    ? item.formdata.attendedBy[
                                        item.formdata.attendedBy.length - 1
                                      ]?.callerId?.name ||
                                      item.formdata.attendedBy[
                                        item.formdata.attendedBy.length - 1
                                      ]?.name ||
                                      item.formdata.attendedBy[
                                        item.formdata.attendedBy.length - 1
                                      ]
                                    : null
                                  : item?.formdata?.attendedBy?.callerId?.name}
                              </td>
                              <td className="px-2 py-2 text-sm w-12 text-[#010101]"></td>
                              <td className="px-2 py-2 text-xl w-12 text-blue-800">
                                {item?.formdata?.status !== "solved" ? (
                                  <FaPhone
                                    onClick={() =>
                                      users.role === "Admin"
                                        ? navigate(
                                            "/admin/transaction/call-registration",
                                            {
                                              state: {
                                                calldetails: item.calls._id,
                                                token: item.timedata.token
                                              }
                                            }
                                          )
                                        : navigate(
                                            "/staff/transaction/call-registration",
                                            {
                                              state: {
                                                calldetails: item?.calls._id,
                                                token: item?.timedata?.token
                                              }
                                            }
                                          )
                                    }
                                  />
                                ) : (
                                  ""
                                )}
                              </td>
                            </tr>
                            <tr
                              className={`text-center border-t-0 border-gray-300 ${
                                item?.formdata?.status === "solved"
                                  ? "bg-[linear-gradient(135deg,_rgba(0,140,0,1),_rgba(128,255,128,1))]"
                                  : item?.formdata?.status === "pending"
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
                                {item?.formdata?.description || "N/A"}
                              </td>

                              <td
                                colSpan="3"
                                className="py-1 px-8 text-sm text-black text-left"
                              >
                                <strong>Duration:</strong>{" "}
                                <span className="ml-2">
                                  {`${Math.floor(
                                    (new Date(
                                      item?.formdata?.status === "solved"
                                        ? item.timedata?.endTime // Use end date if the call is solved
                                        : new Date().setHours(0, 0, 0, 0) // Use today's date at midnight if not solved
                                    ) -
                                      new Date(
                                        new Date(
                                          item.timedata?.startTime
                                        ).setHours(0, 0, 0, 0)
                                      )) /
                                      (1000 * 60 * 60 * 24)
                                  )} days`}
                                </span>
                                <span className="ml-1">
                                  {formatDuration(
                                    item?.timedata?.duration,
                                    item.calls?.customerName
                                  ) || "N/A"}
                                </span>
                              </td>
                              <td
                                colSpan="5"
                                className="py-1 px-12 text-sm text-black text-right"
                              >
                                <strong>Solution:</strong>{" "}
                                {item?.formdata?.solution || "N/A"}
                              </td>
                            </tr>
                          </>
                        )
                      }
                    })}

                  {filteredCalls
                    .flatMap((calls) =>
                      calls.callregistration.map((item) => ({ ...item, calls }))
                    )
                    .filter((item) => {
                      // Ensure 'status' is 'solved'
                      const isSolved = item?.formdata?.status === "solved"

                      // Check if 'startTime' date matches today's date
                      const startTimeRaw = item?.timedata?.endTime
                      const callDate = startTimeRaw
                        ? new Date(startTimeRaw.split(" ")[0])
                            .toISOString()
                            .split("T")[0]
                        : null

                      const isToday = callDate === today

                      return isSolved && isToday // Filter condition for both 'solved' and 'today'
                    })

                    .sort((a, b) => {
                      const endTimeA = new Date(a?.timedata?.endTime).getTime()
                      const endTimeB = new Date(b?.timedata?.endTime).getTime()
                      const startTimeA = new Date(
                        a?.timedata?.startTime
                      ).getTime()
                      const startTimeB = new Date(
                        b?.timedata?.startTime
                      ).getTime()

                      return endTimeB - endTimeA || startTimeB - startTimeA
                    })
                    .map((item) => {
                      if (
                        userBranch.some((branch) =>
                          item.branchName.includes(branch)
                        )
                      ) {
                        return (
                          <>
                            <tr
                              key={item.calls?._id}
                              className="text-center border border-b-0 border-gray-300 bg-[linear-gradient(135deg,_rgba(0,140,0,1),_rgba(128,255,128,1))]"
                            >
                              <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                {item.branchName}
                              </td>

                              <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                {item?.timedata.token}
                              </td>
                              <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                {item.calls?.customerName}
                              </td>
                              <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                {item?.calls?.productDetails[0]?.productName}
                              </td>
                              <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                {item?.license}
                              </td>

                              <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                {setDateandTime(item?.timedata?.startTime)}
                              </td>

                              <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                {setDateandTime(item?.timedata?.endTime)}
                              </td>
                              <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                {item?.formdata?.incomingNumber}
                              </td>
                              <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                {item?.formdata?.status}
                              </td>
                              <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                {Array.isArray(item?.formdata?.attendedBy)
                                  ? item.formdata.attendedBy.length > 0
                                    ? item.formdata.attendedBy[
                                        item.formdata.attendedBy.length - 1
                                      ]?.callerId?.name ||
                                      item.formdata.attendedBy[
                                        item.formdata.attendedBy.length - 1
                                      ]?.name ||
                                      item.formdata.attendedBy[
                                        item.formdata.attendedBy.length - 1
                                      ]
                                    : null
                                  : item?.formdata?.attendedBy?.callerId?.name}
                              </td>
                              <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                {Array.isArray(item?.formdata?.completedBy)
                                  ? item.formdata.completedBy.length > 0
                                    ? item.formdata.completedBy[
                                        item.formdata.completedBy.length - 1
                                      ]?.callerId?.name ||
                                      item.formdata.completedBy[
                                        item.formdata.completedBy.length - 1
                                      ]?.name
                                    : null
                                  : item?.formdata?.completedBy?.callerId
                                      ?.name ||
                                    item?.formdata?.completedBy?.name}
                              </td>
                              <td className="px-2 py-2 text-xl w-12 text-blue-800"></td>
                            </tr>
                            <tr
                              className={`text-center border-t-0 border-gray-300 ${
                                item?.formdata?.status === "solved"
                                  ? "bg-[linear-gradient(135deg,_rgba(0,140,0,1),_rgba(128,255,128,1))]"
                                  : item?.formdata?.status === "pending"
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
                                {item?.formdata?.description || "N/A"}
                              </td>
                              <td
                                colSpan="3"
                                className="py-1 px-8 text-sm text-black text-left"
                              >
                                <strong>Duration:</strong>
                                <span className="ml-2">
                                  {`${Math.floor(
                                    (new Date(
                                      item?.formdata?.status === "solved"
                                        ? item.timedata?.endTime // Use end date if the call is solved
                                        : new Date().setHours(0, 0, 0, 0) // Use today's date at midnight if not solved
                                    ) -
                                      new Date(
                                        new Date(
                                          item.timedata?.startTime
                                        ).setHours(0, 0, 0, 0)
                                      )) /
                                      (1000 * 60 * 60 * 24)
                                  )} days`}
                                </span>

                                <span className="ml-1">
                                  {formatDuration(item?.timedata?.duration) ||
                                    "N/A"}
                                </span>
                              </td>
                              <td
                                colSpan="5"
                                className="py-1 px-12 text-sm text-black text-right"
                              >
                                <strong>Solution:</strong>{" "}
                                {item?.formdata?.solution || "N/A"}
                              </td>
                            </tr>
                          </>
                        )
                      }
                    })}
                </>
              ) : (
                <tr>
                  <td
                    colSpan="12"
                    className="px-4 py-4 text-center text-sm text-gray-500"
                  >
                    {loading ? (
                      <div className="justify center">
                        <PropagateLoader color="#3b82f6" size={10} />
                      </div>
                    ) : (
                      <div>No Calls</div>
                    )}
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

export default CallregistrationList
