import React, { useState, useCallback, useEffect } from "react"
import { CiEdit } from "react-icons/ci"
import { useNavigate } from "react-router-dom"
import {
  FaUserPlus,
  FaSearch,
  FaRegFileExcel,
  FaFilePdf,
  FaPrint,
  FaHourglassHalf,
  FaPhone
} from "react-icons/fa"
import UseFetch from "../../../hooks/useFetch"
import { Link } from "react-router-dom"
import _, { join } from "lodash"

const CallregistrationList = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [user, setUser] = useState([])
  const [calllist, setcallList] = useState([])
  const [filteredCalls, setFilteredCalls] = useState([])
  const { data: registeredcalllist } = UseFetch("/customer/getallCalls")
  useEffect(() => {
    const userData = localStorage.getItem("user")
    const user = JSON.parse(userData)
    if (registeredcalllist) {
      setcallList(registeredcalllist)
      setUser(user)
    }
  }, [registeredcalllist])
  console.log("calllist", calllist)

  const handleSearch = useCallback(
    _.debounce((query) => {
      const lowerCaseQuery = query.toLowerCase()
      setFilteredCalls(
        calllist.filter((calls) =>
          calls.customerName.toLowerCase().includes(lowerCaseQuery)
        )
      )
    }, 300),
    [registeredcalllist]
  )

  useEffect(() => {
    handleSearch(searchQuery)
  }, [searchQuery, handleSearch])

  return (
    <div className="container mx-auto h-screen p-8 bg-gray-300 ">
      <div className="w-auto  bg-white shadow-lg rounded p-8  h-full ">
        <div className="flex justify-between items-center px-4 lg:px-6 xl:px-8 mb-4">
          {/* Search Bar for large screens */}
          <div className="mx-4 md:block">
            <div className="relative">
              <FaSearch className="absolute w-5 h-5 left-2 top-3 text-gray-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className=" w-full border border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none"
              placeholder="Search for..."
            />
          </div>
        </div>

        <hr className="border-t-2 border-gray-300 mb-4" />
        <div className="overflow-y-auto max-h-60 shadow-md rounded-lg">
          <table className="divide-y divide-gray-200 w-full">
            <thead className="bg-gray-400 sticky top-0 z-40">
              <tr>
                {user.role === "Admin" && (
                  <th className="px-4 py-3 border-b border-gray-300 text-center">
                    Branch Name
                  </th>
                )}
                <th className="px-4 py-3 border-b border-gray-300 text-center">
                  Token No
                </th>
                <th className="px-4 py-3 border-b border-gray-300 text-center">
                  Customer Name
                </th>
                <th className="px-4 py-3 border-b border-gray-300 text-center">
                  Product Name
                </th>
                <th className="px-4 py-3 border-b border-gray-300 text-center">
                  License No
                </th>
                {/* <th className="px-4 py-3 border-b border-gray-300 text-center">
                  Description
                </th> */}
                <th className="px-4 py-3 border-b border-gray-300 text-center">
                  Start
                </th>
                <th className="px-4 py-3 border-b border-gray-300 text-center">
                  End
                </th>
                <th className="px-4 py-3 border-b border-gray-300 text-center">
                  Duration
                </th>
                <th className="px-4 py-3 border-b border-gray-300 text-center">
                  Status
                </th>
                {/* <th className="px-4 py-3 border-b border-gray-300 text-center">
                  Incoming No
                </th> */}
                <th className="px-4 py-3 border-b border-gray-300 text-center">
                  Attended By
                </th>
                <th className="px-4 py-3 border-b border-gray-300 text-center">
                  Completed By
                </th>
                <th className="px-4 py-3 border-b border-gray-300 text-center">
                  Call
                </th>
              </tr>
            </thead>
            <tbody className="divide-gray-200">
              {calllist?.length > 0 ? (
                calllist.map((calls) =>
                  calls.callregistration.map((item) => {
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
                          key={calls?._id}
                          className={`text-center border border-b-0 border-gray-300 ${
                            item?.formdata?.status === "solved"
                              ? "bg-green-400"
                              : item?.formdata?.status === "pending"
                              ? callDate === today
                                ? "bg-yellow-400"
                                : "bg-red-400"
                              : "bg-red-400"
                          }`}
                        >
                          {user.role === "Admin" && (
                            <td className="px-4 py-2 text-sm text-[#010101]">
                              {item.branchName}
                            </td>
                          )}

                          <td className="px-4 py-2 text-sm text-[#010101]">
                            {item?.timedata.token}
                          </td>
                          <td className="px-4 py-2 text-sm text-[#010101]">
                            {calls?.customerName}
                          </td>
                          <td className="px-4 py-2 text-sm text-[#010101]">
                            {item?.product?.productName}
                          </td>
                          <td className="px-4 py-2 text-sm text-[#010101]">
                            {item?.license}
                          </td>
                          <td className="px-4 py-2 text-sm text-[#010101]">
                            {/* {item?.timedata?.startTime} */}
                            {new Date(
                              item?.timedata?.startTime
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit"
                            })}
                          </td>
                          <td className="px-4 py-2 text-sm text-[#010101]">
                            {/* {item?.timedata?.endTime} */}
                            {new Date(
                              item?.timedata?.endTime
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit"
                            })}
                          </td>
                          <td className="px-4 py-2 text-sm text-[#010101']">
                            {item?.timedata?.duration}
                          </td>
                          <td className="px-4 py-2 text-sm text-[#010101]">
                            {item?.formdata?.status}
                          </td>
                          {/* <td className="px-4 py-2 text-sm text-[##010101'']">
                            {item?.formdata?.incomingNumber}
                          </td> */}
                          <td className="px-4 py-2 text-sm text-[#010101]">
                            {item?.formdata?.attendedBy}
                          </td>
                          <td className="px-4 py-2 text-sm text-[#010101]">
                            {item?.formdata?.completedBy}
                          </td>
                          <td className="px-4 py-2 text-xl text-blue-800">
                            <FaPhone
                              onClick={() =>
                                user.role === "Admin"
                                  ? navigate(
                                      "/admin/transaction/call-registration",
                                      {
                                        state: {
                                          calldetails: calls._id,
                                          token: item.timedata.token
                                        }
                                      }
                                    )
                                  : navigate(
                                      "/staff/transaction/call-registration",
                                      {
                                        state: {
                                          calldetails: calls._id,
                                          token: item.timedata.token
                                        }
                                      }
                                    )
                              }
                            />
                          </td>
                        </tr>
                        <tr
                          className={`text-center border-t-0 border-gray-300 ${
                            item?.formdata?.status === "solved"
                              ? "bg-green-400"
                              : item?.formdata?.status === "pending"
                              ? callDate === today
                                ? "bg-yellow-400"
                                : "bg-red-400"
                              : "bg-red-400"
                          }`}
                          style={{ height: "5px" }}
                        >
                          <td
                            colSpan="6"
                            className="py-1 px-8 text-sm text-black text-left"
                          >
                            <strong>Description:</strong>{" "}
                            {item?.formdata?.description || "N/A"}
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
                  })
                )
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
