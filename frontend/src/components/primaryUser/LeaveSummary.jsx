import React, { useState, useEffect } from "react"
import { CiEdit } from "react-icons/ci"

import UseFetch from "../../hooks/useFetch"

const leaveSummary = () => {
  const [selectedIndex, setSelectedIndex] = useState(null)
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1 // JavaScript months are 0-based, so adding 1

  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [onsiteTypes, setOnsiteTypes] = useState({})

  // API URL with selected year and month
  const apiUrl = `/auth/getsomeall?year=${selectedYear}&month=${selectedMonth}`

  // Use custom useFetch hook
  const { data: newattende, loading, refreshHook } = UseFetch(apiUrl)
  const { data: attendance } = UseFetch(
    `/auth/getallAttendance?year=${selectedYear}&month=${selectedMonth}`
  )
  console.log(attendance)
  console.log(newattende)
  const a = newattende?.filter((item) => item.name === "abhi")
  console.log(a)
  // Refetch data when year or month changes
  // useEffect(() => {
  //   refreshHook()
  // }, [selectedYear, selectedMonth])

  const years = Array.from({ length: 10 }, (_, i) => currentYear - i)
  const months = [
    { name: "January", value: 1 },
    { name: "February", value: 2 },
    { name: "March", value: 3 },
    { name: "April", value: 4 },
    { name: "May", value: 5 },
    { name: "June", value: 6 },
    { name: "July", value: 7 },
    { name: "August", value: 8 },
    { name: "September", value: 9 },
    { name: "October", value: 10 },
    { name: "November", value: 11 },
    { name: "December", value: 12 }
  ]
  const selectedUser = (attendeeid) => {
    const filteredAttendance = attendance.filter((id) => {
      console.log(attendeeid)
      console.log(id.userId)
      return id.userId === attendeeid
    })
    console.log(filteredAttendance)
  }
  // Handle onsite type change
  const handleOnsiteTypeChange = (date, index, newType) => {
    setOnsiteTypes((prev) => ({
      ...prev,
      [`${date}-${index}`]: newType
    }))
  }
  return (
    <div className="p-3 text-center ">
      <h1 className="text-2xl font-bold mb-1">User Leave Summary</h1>
      <div className="flex justify-end space-x-4 m-4">
        {/* Year Select */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border p-2 rounded"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        {/* Month Select */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="border p-2 rounded"
        >
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.name}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="text-lg font-semibold text-blue-600">
          Loading users...
        </div>
      ) : (
        // {/* Outer div with max height for scrolling the user list */}
        <div className=" max-h-60 sm:max-h-80 md:max-h-96 lg:max-h-[500px] overflow-y-auto overflow-x-auto ">
          {newattende?.length > 0 &&
            newattende.map((attendee, index) => (
              <div key={index}>
                {/* Only show the selected div, hide others */}
                {selectedIndex === null || selectedIndex === index ? (
                  <>
                    {/* Clickable Attendee Div */}
                    <div
                      className="bg-white shadow-lg rounded-xl p-4 mb-2 border flex items-center cursor-pointer"
                      onClick={() => {
                        setSelectedIndex(selectedIndex === index ? null : index)
                        selectedUser(attendee.userId)
                      }}
                    >
                      {/* Name - Aligned Left */}
                      <div className="text-md font-semibold text-gray-800 w-1/6">
                        {attendee.name}
                      </div>

                      {/* Attendance Details - Labels & Values in a Flex Row */}
                      <div className="w-5/6 flex justify-evenly">
                        <div className="flex flex-col items-center">
                          <span className="font-medium text-gray-600">
                            Present
                          </span>
                          <span>{attendee.present}</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="font-medium text-gray-600">
                            Absent
                          </span>
                          <span>{attendee.absent}</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="font-medium text-gray-600">
                            Late
                          </span>
                          <span>{attendee.late}</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="font-medium text-gray-600">
                            Early
                          </span>
                          <span>{attendee.earlyGoing}</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="font-medium text-gray-600">
                            Onsite
                          </span>
                          <span>{attendee.onsite}</span>
                        </div>
                        <div className="flex flex-col items-center mr-4">
                          <span className="font-medium text-gray-600">
                            Not Marked
                          </span>
                          <span>{attendee.notMarked}</span>
                        </div>
                      </div>
                    </div>

                    {/* Show Selected Attendee Details Below */}
                    {selectedIndex === index && (
                      <div className="bg-gray-100 p-4 rounded-lg shadow-md mt-2">
                        <div className="overflow-auto max-h-80">
                          <table className="w-full ">
                            {/* Table Header */}
                            <thead className="bg-gray-200 sticky top-0 z-10 ">
                              <tr className="text-gray-800 font-semibold text-center">
                                <th className="p-2 ">Date</th>
                                <th className="p-2 ">In Time</th>
                                <th className="p-2 ">Out Time</th>
                                <th className="p-2 ">Place</th>
                                <th className="p-2 ">Onsite Name</th>
                                <th className="p-2 ">Onsite Type</th>
                                <th className="p-2 ">Onsite Shift</th>
                                <th className="p-2 ">Edit</th>
                              </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody className="divide-y divide-gray-300 bg-white">
                              {Object.entries(attendee.attendancedates).map(
                                ([date, details], idx) => {
                                  const hasOnsite = details?.onsite?.length > 0

                                  return (
                                    <React.Fragment key={idx}>
                                      {/* 🟢 Row for Date and Punch Time */}
                                      <tr className="text-center font-semibold bg-white">
                                        <td className="p-2 border border-gray-300">
                                          {date}
                                        </td>{" "}
                                        {/* Date (Read-Only) */}
                                        {/* Editable In Time */}
                                        <td className="p-2 border border-gray-300">
                                          <input
                                            type="text"
                                            className="w-full text-center border rounded p-1"
                                            defaultValue={details?.inTime || ""}
                                          />
                                        </td>
                                        {/* Editable Out Time */}
                                        <td className="p-2 border border-gray-300">
                                          <input
                                            type="text"
                                            className="w-full text-center border rounded p-1"
                                            defaultValue={
                                              details?.outTime || ""
                                            }
                                          />
                                        </td>
                                        {/* If onsite data exists, show first onsite entry in the main row */}
                                        {hasOnsite ? (
                                          <>
                                            {/* Editable Place */}
                                            <td className="p-2 border border-gray-300">
                                              <input
                                                type="text"
                                                className="w-full text-center border rounded p-1"
                                                defaultValue={
                                                  details.onsite[0]?.place || ""
                                                }
                                              />
                                            </td>

                                            {/* Editable Site Name */}
                                            <td className="p-2 border border-gray-300">
                                              <input
                                                type="text"
                                                className="w-full text-center border rounded p-1"
                                                defaultValue={
                                                  details.onsite[0]?.siteName ||
                                                  ""
                                                }
                                              />
                                            </td>

                                            {/* Onsite Type Dropdown */}
                                            <td className="p-2 border border-gray-300">
                                              <select
                                                className="w-full text-center border rounded p-1"
                                                defaultValue={
                                                  details.onsite[0]?.onsiteType
                                                }
                                                onChange={(e) =>
                                                  handleOnsiteTypeChange(
                                                    date,
                                                    0,
                                                    e.target.value
                                                  )
                                                }
                                              >
                                                <option value="Full Day">
                                                  Full Day
                                                </option>
                                                <option value="Half Day">
                                                  Half Day
                                                </option>
                                              </select>
                                            </td>

                                            {/* Show Period Dropdown Only if Half Day is Selected */}
                                            {onsiteTypes[`${date}-0`] ===
                                              "Half Day" ||
                                            details.onsite[0]?.onsiteType ===
                                              "Half Day" ? (
                                              <td className="p-2 border border-gray-300">
                                                <select
                                                  className="w-full text-center border rounded p-1"
                                                  defaultValue={
                                                    details.onsite[0]?.period
                                                  }
                                                >
                                                  <option value="Morning">
                                                    Morning
                                                  </option>
                                                  <option value="Afternoon">
                                                    Afternoon
                                                  </option>
                                                </select>
                                              </td>
                                            ) : (
                                              <td className="p-2 border">-</td>
                                            )}
                                          </>
                                        ) : (
                                          <>
                                            {/* No onsite data, keep these empty */}
                                            <td className="p-2 border border-gray-300">
                                              -
                                            </td>
                                            <td className="p-2 border border-gray-300">
                                              -
                                            </td>
                                            <td className="p-2 border border-gray-300">
                                              -
                                            </td>
                                            <td className="p-2 border border-gray-300">
                                              -
                                            </td>
                                          </>
                                        )}
                                        {/* Edit Icon for Punch Time */}
                                        <td className="p-2 border border-gray-300">
                                          <button className="text-blue-500 hover:text-blue-700">
                                            <CiEdit size={20} />
                                          </button>
                                        </td>
                                      </tr>

                                      {/* 🟢 Additional Rows for Extra Onsite Data */}
                                      {hasOnsite &&
                                        details.onsite
                                          .slice(1)
                                          .map((item, index) => (
                                            <tr
                                              key={index}
                                              className="text-center bg-white"
                                            >
                                              <td className="p-2 border border-gray-300"></td>{" "}
                                              {/* Empty for Date Alignment */}
                                              {/* Empty Punch Time Columns */}
                                              <td className="p-2 border border-gray-300">
                                                -
                                              </td>
                                              <td className="p-2 border border-gray-300">
                                                -
                                              </td>
                                              {/* Editable Place */}
                                              <td className="p-2 border border-gray-300">
                                                <input
                                                  type="text"
                                                  className="w-full text-center border rounded p-1"
                                                  defaultValue={
                                                    item?.place || ""
                                                  }
                                                />
                                              </td>
                                              {/* Editable Site Name */}
                                              <td className="p-2 border border-gray-300">
                                                <input
                                                  type="text"
                                                  className="w-full text-center border rounded p-1"
                                                  defaultValue={
                                                    item?.siteName || ""
                                                  }
                                                />
                                              </td>
                                              {/* Onsite Type Dropdown */}
                                              <td className="p-2 border border-gray-300">
                                                <select
                                                  className="w-full text-center border rounded p-1"
                                                  defaultValue={
                                                    item?.onsiteType
                                                  }
                                                  onChange={(e) =>
                                                    handleOnsiteTypeChange(
                                                      date,
                                                      index + 1,
                                                      e.target.value
                                                    )
                                                  }
                                                >
                                                  <option value="Full Day">
                                                    Full Day
                                                  </option>
                                                  <option value="Half Day">
                                                    Half Day
                                                  </option>
                                                </select>
                                              </td>
                                              {/* Show Period Dropdown Only if Half Day is Selected */}
                                              {onsiteTypes[
                                                `${date}-${index + 1}`
                                              ] === "Half Day" ||
                                              item?.onsiteType ===
                                                "Half Day" ? (
                                                <td className="p-2 border border-gray-300">
                                                  <select
                                                    className="w-full text-center border rounded p-1"
                                                    defaultValue={item?.period}
                                                  >
                                                    <option value="Morning">
                                                      Morning
                                                    </option>
                                                    <option value="Afternoon">
                                                      Afternoon
                                                    </option>
                                                  </select>
                                                </td>
                                              ) : (
                                                <td className="p-2 border border-gray-300">
                                                  -
                                                </td>
                                              )}
                                              {/* Edit Icon for Onsite Data */}
                                              <td className="p-2 border border-gray-300">
                                                <button className="text-blue-500 hover:text-blue-700">
                                                  <CiEdit size={20} />
                                                </button>
                                              </td>
                                            </tr>
                                          ))}
                                    </React.Fragment>
                                  )
                                }
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </>
                ) : null}
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default leaveSummary
