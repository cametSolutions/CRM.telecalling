import React, { useState, useEffect, useCallback } from "react"
import debounce from "lodash.debounce"
import api from "../../../api/api"
import io from "socket.io-client" // Import Socket.IO client
import { FaSearch, FaPhone } from "react-icons/fa"
import Tiles from "../../../components/common/Tiles" // Import the Tile component
import { useNavigate } from "react-router-dom"

const socket = io("https://www.crm.camet.in")
// const socket = io("http://localhost:9000") // Adjust the URL to your backend

const CallregistrationList = () => {
  const navigate = useNavigate()

  const [today, setToday] = useState(null)
  const [users, setUser] = useState(null)

  const [callList, setCallList] = useState([])
  const [filteredCalls, setFilteredCalls] = useState([])

  // Define states for filtered call counts
  const [pendingCallsCount, setPendingCallsCount] = useState(0)
  const [todayCallsCount, setTodayCallsCount] = useState(0)
  const [solvedCallsCount, setTodaysSolvedCount] = useState(0)

  // State to track the active filter
  const [activeFilter, setActiveFilter] = useState("All")

  useEffect(() => {
    const userData = localStorage.getItem("user")
    const users = JSON.parse(userData)
    setUser(users)
  }, [])

  const filterCallData = useCallback((calls) => {
    const allCallRegistrations = calls.flatMap((call) => call.callregistration)

    // Filter based on status
    const pending = allCallRegistrations.filter(
      (call) => call.formdata?.status?.toLowerCase() === "pending"
    )

    const todaysSolvedCount = getTodaysSolved(calls)

    const todaysCallsCount = getTodaysCalls(calls)

    setPendingCallsCount(pending?.length)
    setTodayCallsCount(todaysCallsCount)
    setTodaysSolvedCount(todaysSolvedCount)
  }, [])

  useEffect(() => {
    if (callList.length > 0 && users) {
      const today = new Date().toISOString().split("T")[0]
      setToday(today)

      setFilteredCalls(callList)
      filterCallData(callList)
    }
  }, [callList])

  useEffect(() => {
    if (users) {
      socket.emit("updatedCalls")
      // Listen for initial data from the server
      socket.on("updatedCalls", (data) => {
        if (users.role === "Admin") {
          const allCallRegistrations = data.calls.flatMap(
            (call) => call.callregistration
          )

          setCallList(data.calls)
        } else {
          const userBranchName = new Set(
            users.selected.map((branch) => branch.branchName)
          )

          const branchNamesArray = Array.from(userBranchName)

          const filtered = data.calls.filter((call) =>
            call.callregistration.some((registration) => {
              const hasMatchingBranch = registration.branchName.some(
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
      })

      //Cleanup the socket connection when the component unmounts
      return () => {
        socket.off("updatedCalls")
        // socket.disconnect()
      }
    }
  }, [users])

  // const fetchData = async () => {
  //   console.log("hii")
  //   try {
  //     console.log(users)
  //     const response = await api.post("/customer/updatedbranch", users, {
  //       withCredentials: true,
  //       headers: {
  //         "Content-Type": "application/json" // Ensure the correct content type
  //       }
  //     })
  //   } catch (err) {
  //     console.log(err)
  //     // setError(err) // Set error state if fetching fails
  //   } finally {
  //     // setLoading(false) // Set loading to false after fetch is complete
  //   }
  // }

  const handleSearch = debounce((search) => {
    // Step 1: Filter for today's solved calls and all pending calls
    const relevantCalls = callList.filter((call) =>
      call.callregistration.some((registration) => {
        const isTodaySolved =
          registration.formdata?.status === "solved" &&
          registration.timedata?.startTime?.split("T")[0] === today
        const isPending = registration.formdata?.status === "pending"
        return isTodaySolved || isPending
      })
    )

    // Step 2: Filter based on search query
    let sortedCalls
    if (!isNaN(search)) {
      // Search by license if it's a number
      sortedCalls = relevantCalls.filter((call) =>
        call.callregistration.some((registration) => {
          const license = registration?.license
          return (
            typeof license === "number" && license.toString().includes(search)
          )
        })
      )
      // sortedCalls = relevantCalls.filter((call) => {
      //   call.callregistration.some((registration) => {
      //     const token = registration?.formdata.token
      //     return token.includes(search)
      //   })
      // })
    } else if (search) {
      // Search by customer name if searchQuery is not empty
      sortedCalls = relevantCalls.filter((call) =>
        call.customerName.toLowerCase().includes(search.toLowerCase())
      )
    } else {
      // If no search query, just use the relevant calls
      sortedCalls = relevantCalls
    }

    setFilteredCalls(sortedCalls)
  }, 300)

  const handleChange = (e) => handleSearch(e.target.value)

  // useEffect(() => {
  //   handleSearch(searchQuery)
  // }, [searchQuery, handleSearch])

  // Update the filteredCalls whenever activeFilter changes
  // useEffect(() => {
  //   setFilteredCalls(applyFilter())
  // }, [activeFilter, callList])
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

  const getTodaysCalls = (calls) => {
    const today = new Date().toISOString().split("T")[0] // Get today's date in 'YYYY-MM-DD' format

    let todaysCallsCount = 0

    calls.forEach((customer) => {
      customer.callregistration.forEach((call) => {
        const callDate = call.timedata.startTime.split("T")[0] // Get the call date in 'YYYY-MM-DD' format
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
  // const fetchData = async () => {
  //   try {
  //     const calldata = {
  //       userName: "Akhila thomas",
  //       product: "67051e69c6d1805013e91797",

  //       license: 737805573,
  //       branchName: ["CAMET"],
  //       timedata: {
  //         startTime: "2024-November-01 08:38:58",
  //         endTime: "2024-November-01 08:47:09",
  //         duration: "00:08:11",
  //         token: "6902297019"
  //       },
  //       formdata: {
  //         incomingNumber: "46646",
  //         token: "",
  //         description: "dfdfdf",
  //         solution: "",
  //         status: "pending",
  //         attendedBy: "abhi",
  //         completedBy: ""
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  return (
    <div className="container mx-auto  p-8 ">
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
              onChange={handleChange}
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

        <div className="overflow-y-auto overflow-x-auto max-h-60 sm:max-h-80 md:max-h-[380px] lg:max-h-[398px] shadow-md rounded-lg mt-2 ">
          <table className="divide-y divide-gray-200 w-full">
            <thead className="bg-purple-300 sticky top-0 z-40  ">
              <tr>
                {users?.role === "Admin" && (
                  <th className="px-2 py-3 border-b border-gray-300 text-sm text-center whitespace-nowrap">
                    Branch Name
                  </th>
                )}

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
                      const aDate = new Date(a?.timedata?.startTime)
                        .toISOString()
                        .split("T")[0]
                      const bDate = new Date(b?.timedata?.startTime)
                        .toISOString()
                        .split("T")[0]

                      // Prioritize today's date
                      if (aDate === today && bDate !== today) return -1
                      if (aDate !== today && bDate === today) return 1

                      // For both calls not on today, order by descending date
                      return (
                        new Date(b?.timedata?.startTime) -
                        new Date(a?.timedata?.startTime)
                      )
                    })
                    .map((item) => {
                      const today = new Date().toISOString().split("T")[0]
                      const startTimeRaw = item?.timedata?.startTime
                      const callDate = startTimeRaw
                        ? new Date(startTimeRaw.split(" ")[0])
                            .toISOString()
                            .split("T")[0]
                        : null

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
                            {users?.role === "Admin" && (
                              <td className="px-2 py-2 w-12 text-sm text-[#010101]">
                                {item.branchName}
                              </td>
                            )}

                            <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                              {item?.timedata.token}
                            </td>
                            <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                              {item.calls?.customerName}
                            </td>
                            <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                              {item?.product?.productName}
                            </td>
                            <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                              {item?.license}
                            </td>
                            <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                              {new Date(
                                item?.timedata?.startTime
                              ).toLocaleDateString("en-GB", {
                                timeZone: "UTC",
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric"
                              })}
                            </td>
                            <td className="px-2 py-2 text-sm w-12 text-[#010101]"></td>
                            <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                              {item?.formdata?.incomingNumber}
                            </td>
                            <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                              {item?.formdata?.status}
                            </td>
                            <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                              {item?.formdata?.attendedBy}
                            </td>
                            <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                              {item?.formdata?.completedBy}
                            </td>
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
                                              calldetails: item.calls._id,
                                              token: item.timedata.token
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
                              colSpan="2"
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
                                {item?.timedata?.duration || "N/A"}
                              </span>
                            </td>
                            <td
                              colSpan="6"
                              className="py-1 px-12 text-sm text-black text-right"
                            >
                              <strong>Solution:</strong>{" "}
                              {item?.formdata?.solution || "N/A"}
                            </td>
                          </tr>
                        </>
                      )
                    })}

                  {filteredCalls
                    .flatMap((calls) =>
                      calls.callregistration.map((item) => ({ ...item, calls }))
                    )
                    .filter((item) => {
                      // Ensure 'status' is 'solved'
                      const isSolved = item?.formdata?.status === "solved"

                      // Check if 'startTime' date matches today's date
                      const startTimeRaw = item?.timedata?.startTime
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
                      return (
                        <>
                          <tr
                            key={item.calls?._id}
                            className="text-center border border-b-0 border-gray-300 bg-[linear-gradient(135deg,_rgba(0,140,0,1),_rgba(128,255,128,1))]"
                          >
                            {users.role === "Admin" && (
                              <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                                {item.branchName}
                              </td>
                            )}

                            <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                              {item?.timedata.token}
                            </td>
                            <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                              {item.calls?.customerName}
                            </td>
                            <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                              {item?.product?.productName}
                            </td>
                            <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                              {item?.license}
                            </td>

                            <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                              {new Date(
                                item?.timedata?.startTime
                              ).toLocaleDateString("en-GB", {
                                timeZone: "UTC",
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric"
                              })}
                            </td>

                            <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                              {new Date(
                                item?.timedata?.endTime
                              ).toLocaleDateString("en-GB", {
                                timeZone: "UTC",
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric"
                              })}
                            </td>
                            <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                              {item?.formdata?.incomingNumber}
                            </td>
                            <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                              {item?.formdata?.status}
                            </td>
                            <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                              {item?.formdata?.attendedBy}
                            </td>
                            <td className="px-2 py-2 text-sm w-12 text-[#010101]">
                              {item?.formdata?.completedBy}
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
                              colSpan="2"
                              className="py-1 px-8 text-sm text-black text-left"
                            >
                              <strong>Duration:</strong>

                              <span className="ml-1">
                                {item?.timedata?.duration || "N/A"}
                              </span>
                            </td>
                            <td
                              colSpan="6"
                              className="py-1 px-12 text-sm text-black text-right"
                            >
                              <strong>Solution:</strong>{" "}
                              {item?.formdata?.solution || "N/A"}
                            </td>
                          </tr>
                        </>
                      )
                    })}
                </>
              ) : (
                <tr>
                  <td
                    colSpan="10"
                    className="px-4 py-4 text-center text-sm text-gray-500"
                  >
                    No calls found
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
