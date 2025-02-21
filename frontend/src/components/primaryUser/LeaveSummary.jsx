import React, { useState, useEffect } from "react"
import ResponsiveTable from "./ResponsiveTable"
import Modal from "./Modal"
import api from "../../api/api"
import UseFetch from "../../hooks/useFetch"
import { toast } from "react-toastify"
const leaveSummary = () => {
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1 // JavaScript months are 0-based, so adding 1
  const [selectedStaff, setselectedStaff] = useState(null)
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [onsiteTypes, setOnsiteTypes] = useState({})
  const [editIndex, setEditIndex] = useState(null)
  const [formData, setFormData] = useState({})
  const [selectedDate, setselectedDate] = useState(null)
  const [Loading, setLoading] = useState(null)
  const [type, setType] = useState("")
  const [holiday, setHoly] = useState(null)

  const [leavesummaryList, setleaveSummary] = useState([])
  const userData = localStorage.getItem("user")
  const user = JSON.parse(userData)
  console.log(user)
  // API URL with selected year and month
  const apiUrl = `/auth/getsomeall?year=${selectedYear}&month=${selectedMonth}`

  // Use custom useFetch hook
  const {
    data: newattende,
    fulldateholiday: holy,
    loading,
    refreshHook
  } = UseFetch(apiUrl)
  useEffect(() => {
    if (newattende && newattende.length) {
      if (user.role === "Admin") {
        setHoly(holy)
        setleaveSummary(newattende)
      } else if (user.role === "Staff") {
        setHoly(holy)
        const filteredUser = newattende.filter(
          (item) => item.userId === user._id
        )
        setleaveSummary(filteredUser)
      }
    }
  }, [newattende])
  console.log(holy)

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
    const filteredAttendance = newattende.filter((id) => {
      return id.userId === attendeeid
    })
    setselectedStaff(filteredAttendance)
  }
  // Handle onsite type change
  const handleOnsiteTypeChange = (date, index, newType) => {
    setOnsiteTypes((prev) => ({
      ...prev,
      [`${date}-${index}`]: newType
    }))
  }
  const handleAttendance = (date, type, inTime, outTime) => {
    setModalOpen(true)
    setselectedDate(date)
    setType(type)
    if (type === "Attendance") {
      setFormData({
        attendanceDate: date,
        inTime,
        outTime
      })
    }
  }
  const handleLeave = (date, type, category, leaveType, halfDayperiod) => {
    setModalOpen(true)
    setselectedDate(date)
    setType(type)
    if (type === "Leave") {
      setFormData({
        leaveDate: date,
        leaveCategory: category,
        leaveType:
          leaveType === 1 ? "Full Day" : leaveType === 0.5 ? "Half Day" : null,
        halfDayPeriod: leaveType === 0.5 ? halfDayperiod : null
      })
    }
  }
  const handleScroll = (event) => {
    const tables = document.querySelectorAll(".scroll-container")
    tables.forEach((table) => {
      table.scrollLeft = event.target.scrollLeft
    })
  }
  const handleClose = () => {
    setModalOpen(false)
  }

  const handleUpdate = async (date) => {
    setLoading(true)
    try {
      const response = await api.post(
        `/auth/editLeaveSummary?userid=${selectedStaff[0].userId}`,
        formData
      )
      if (response.status === 200) {
        toast.success("Succesfully Edited")
        setLoading(false)
        refreshHook()
      }
    } catch (error) {
      toast.error(error.message)
      console.log("error:", error.message)
    }
  }
  const handleApply = async (staffId, selected, setIsApplying, type) => {
    if (type === "Leave") {
      const response = await api.post(
        `/auth/editLeave?userid=${staffId}`,
        selected
      )
      const data = response.data.data.data
      if (response.status === 200) {
        toast.success("leave edited sucessfully")
        setleaveSummary(data)
        setIsApplying(false)
      } else {
        toast.error("error in updating")
      }
    } else if (type === "Attendance") {
      const response = await api.post(
        `/auth/editAttendance?userid=${staffId}`,
        selected
      )
      const data = response.data.data.data
      if (response.status === 200) {
        toast.success("Attendance edited sucessfully")
        setleaveSummary(data)
        setIsApplying(false)
      } else {
        toast.error("error in updating")
      }
    }
  }
  return (
    <div className="w-full">
      {/* Header Section */}

      <div className=" text-center">
        <h1 className="text-2xl font-bold mb-1">User Leave Summary</h1>
        <div className="flex flex-wrap justify-end gap-4 mb-3">
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
      </div>
      {/* Main Content */}
      {loading ? (
        <div className="text-lg font-semibold text-blue-600 text-center">
          Loading users...
        </div>
      ) : (
        <>
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto px-5 ">
            {leavesummaryList &&
              leavesummaryList.length &&
              leavesummaryList?.map((attendee, index) => (
                <div key={index}>
                  {selectedIndex === null || selectedIndex === index ? (
                    <>
                      <div
                        className={`${
                          selectedIndex === index && !modalOpen
                            ? "sticky top-0 z-20 bg-white"
                            : ""
                        }`}
                      >
                        {/* Your existing summary card code */}
                        <div
                          className={`p-2 mr-4 shadow-lg rounded-xl border cursor-pointer
                      ${
                        selectedIndex === index
                          ? "bg-gray-300"
                          : "bg-gray-100 mb-2"
                      }`}
                          onClick={() => {
                            setSelectedIndex(
                              selectedIndex === index ? null : index
                            )
                            selectedUser(attendee.userId)
                            setEditIndex(null)
                            setFormData(
                              Object.fromEntries(
                                Object.keys(formData).map((key) => [key, ""])
                              )
                            )
                          }}
                        >
                          <div className="flex flex-wrap items-center">
                            <div className="text-md font-semibold text-gray-800 w-full md:w-[225px] p-2">
                              {attendee.name}
                            </div>

                            <div className="w-full md:w-10/12 flex flex-wrap justify-around">
                              {[
                                {
                                  label: "Present",
                                  value: attendee.present
                                  // width: "w-full sm:w-[230px]"
                                },
                                {
                                  label: "Leave",
                                  value: attendee.absent
                                  // width: "w-full sm:w-[115px]"
                                },
                                {
                                  label: "Late Cutting",
                                  value: attendee.latecutting
                                  // width: "w-full sm:w-[110px]"
                                },
                                {
                                  label: "Not Marked",
                                  value: attendee.notMarked
                                  // width: "w-full sm:w-[130px]"
                                },
                                {
                                  label: "Onsite",
                                  value: attendee.onsite
                                  // width: "w-full sm:w-[510px]"
                                }
                              ].map((item, idx) => (
                                <div
                                  key={idx}
                                  className={`flex flex-col items-center p-1 ${item.width}`}
                                >
                                  <span className="font-medium text-gray-600 text-sm">
                                    {item.label}
                                  </span>
                                  <span>{item.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        {selectedIndex === index && (
                          <ResponsiveTable
                            attendee={attendee}
                            user={user}
                            handleAttendance={handleAttendance}
                            handleLeave={handleLeave}
                            handleScroll={handleScroll}
                            modalOpen={modalOpen}
                            holiday={holiday}
                          />
                        )}

                        {/* Table Header - Hidden scrollbar but syncs with body */}
                        {/* {selectedIndex === index && !modalOpen && (
                          <div className="sticky top-0 z-20 bg-white mr-4">
                            <div
                              className="scroll-container overflow-x-auto max-h-[calc(100vh-200px)]"
                              style={{ overflow: "hidden" }}
                            >
                              <table className="w-full min-w-max border-collapse text-sm">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th
                                      rowSpan="2"
                                      className="border border-gray-300 p-2 sticky left-0 bg-gray-100 z-10"
                                    >
                                      Date
                                    </th>
                                    <th
                                      colSpan="2"
                                      className="border border-gray-300 p-1"
                                    >
                                      Present
                                    </th>
                                    <th
                                      colSpan="4"
                                      className="border border-gray-300 p-1"
                                    >
                                      Leave
                                    </th>
                                    <th
                                      rowSpan="2"
                                      className="border border-gray-300 p-2"
                                    >
                                      Early Out
                                    </th>
                                    <th
                                      rowSpan="2"
                                      className="border border-gray-300 p-2"
                                    >
                                      Late In
                                    </th>
                                    <th
                                      rowSpan="2"
                                      className="border border-gray-300 p-2"
                                    >
                                      Not Marked
                                    </th>
                                    <th
                                      colSpan="4"
                                      className="border border-gray-300 p-1"
                                    >
                                      Onsite
                                    </th>
                                  </tr>
                                  <tr>
                                    <th className="border border-gray-300 p-1">
                                      In Time
                                    </th>
                                    <th className="border border-gray-300 p-1">
                                      Out Time
                                    </th>
                                    <th className="border border-gray-300 p-1">
                                      CL
                                    </th>
                                    <th className="border border-gray-300 p-1">
                                      PL
                                    </th>
                                    <th className="border border-gray-300 p-1">
                                      Comp.leave
                                    </th>
                                    <th className="border border-gray-300 p-1">
                                      Others
                                    </th>
                                    <th className="border border-gray-300 p-1">
                                      Place
                                    </th>
                                    <th className="border border-gray-300 p-1">
                                      Site Name
                                    </th>
                                    <th className="border border-gray-300 p-1">
                                      Onsite Type
                                    </th>
                                    <th className="border border-gray-300 p-1">
                                      Period
                                    </th>
                                  </tr>
                                </thead>
                              </table>
                            </div>
                          </div>
                        )} */}
                      </div>

                      {/* Table Body - Visible scrollbar that controls both */}
                      {/* {selectedIndex === index && (
                        <div
                          className="scroll-container overflow-x-auto max-h-[calc(100vh-200px)]"
                          onScroll={handleScroll}
                        >
                          <table className="w-full min-w-max border-collapse text-sm">
                        
                            <tbody>
                              {Object.entries(attendee.attendancedates).map(
                                ([date, details], idx) => (
                                  <tr
                                    key={idx}
                                    className="hover:bg-gray-50 text-center"
                                  >
                                    <td className="border border-gray-300 p-2  sticky left-0 bg-white">
                                      {date}
                                    </td>
                                    <td
                                      className="border border-gray-300 p-2 "
                                      onClick={() => {
                                        console.log(user.role)
                                        if (user?.role === "Admin") {
                                          handleAttendance(
                                            date,
                                            "Attendance",
                                            details?.inTime,
                                            details?.outTime
                                          )
                                        }
                                      }}
                                    >
                                      {details?.inTime || "-"}
                                    </td>
                                    <td
                                      className="border border-gray-300 p-2"
                                      onClick={() => {
                                        if (user?.role === "Admin")
                                          handleAttendance(
                                            date,
                                            "Attendance",
                                            details?.inTime,
                                            details?.outTime
                                          )
                                      }}
                                    >
                                      {details?.outTime || "-"}
                                    </td>
                                    <td
                                      className="border border-gray-300 p-2 "
                                      onClick={() => {
                                        if (user?.role === "Admin") {
                                          handleLeave(
                                            date,
                                            "Leave",
                                            details?.otherLeave
                                              ? "other Leave"
                                              : details?.compensatoryLeave
                                              ? "compensatory Leave"
                                              : details?.privileageLeave
                                              ? "privileage Leave"
                                              : details?.casualLeave
                                              ? "casual Leave"
                                              : null,
                                            details?.otherLeave ||
                                              details?.compensatoryLeave ||
                                              details?.privileageLeave ||
                                              details?.casualLeave,
                                            details?.halfDayperiod
                                          )
                                        }
                                      }}
                                    >
                                      {details?.casualLeave || "-"}
                                    </td>
                                    <td
                                      className="border border-gray-300 p-2"
                                      onClick={() => {
                                        if (user?.role === "Admin") {
                                          handleLeave(
                                            date,
                                            "Leave",
                                            details?.otherLeave
                                              ? "other Leave"
                                              : details?.compensatoryLeave
                                              ? "compensatory Leave"
                                              : details?.privileageLeave
                                              ? "privileage Leave"
                                              : details?.casualLeave
                                              ? "casual Leave"
                                              : null,
                                            details?.otherLeave ||
                                              details?.compensatoryLeave ||
                                              details?.privileageLeave ||
                                              details?.casualLeave,
                                            details?.halfDayperiod
                                          )
                                        }
                                      }}
                                    >
                                      {details?.privileageLeave || "-"}
                                    </td>
                                    <td
                                      className="border border-gray-300 p-2 "
                                      onClick={() => {
                                        if (user?.role === "Admin") {
                                          handleLeave(
                                            date,
                                            "Leave",
                                            details?.otherLeave
                                              ? "other Leave"
                                              : details?.compensatoryLeave
                                              ? "compensatory Leave"
                                              : details?.privileageLeave
                                              ? "privileage Leave"
                                              : details?.casualLeave
                                              ? "casual Leave"
                                              : null,
                                            details?.otherLeave ||
                                              details?.compensatoryLeave ||
                                              details?.privileageLeave ||
                                              details?.casualLeave,
                                            details?.halfDayperiod
                                          )
                                        }
                                      }}
                                    >
                                      {details?.compensatoryLeave || "-"}
                                    </td>
                                    <td
                                      className="border border-gray-300 p-2"
                                      onClick={() => {
                                        if (user.role === "Admin") {
                                          handleLeave(
                                            date,
                                            "Leave",
                                            details?.otherLeave
                                              ? "other Leave"
                                              : details?.compensatoryLeave
                                              ? "compensatory Leave"
                                              : details?.privileageLeave
                                              ? "privileage Leave"
                                              : details?.casualLeave
                                              ? "casual Leave"
                                              : null,
                                            details?.otherLeave ||
                                              details?.compensatoryLeave ||
                                              details?.privileageLeave ||
                                              details?.casualLeave,
                                            details?.halfDayperiod
                                          )
                                        }
                                      }}
                                    >
                                      {details?.otherLeave || "-"}
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                      {details?.early
                                        ? `${details.early} minutes`
                                        : "-"}
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                      {details?.late
                                        ? `${details.late} minutes`
                                        : "-"}
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                      {details?.notMarked || "-"}
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                      {details?.onsite?.[0]?.place || "-"}
                                    </td>
                                    <td className="border border-gray-300 p-2 ">
                                      {details?.onsite?.[0]?.siteName || "-"}
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                      {details?.onsite?.[0]?.onsiteType || "-"}
                                    </td>
                                    <td className="border border-gray-300 p-2 ">
                                      {details?.onsite?.[0]?.onsiteType ===
                                      "Half Day"
                                        ? details?.onsite?.[0].halfDayPeriod
                                        : "-"}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      )} */}
                    </>
                  ) : null}
                </div>
              ))}
          </div>
        </>
      )}
      {modalOpen && (
        <Modal
          type={type}
          onClose={handleClose}
          selectedDate={selectedDate}
          isOpen={modalOpen}
          formData={formData}
          staffId={selectedStaff[0]?.userId}
          handleApply={handleApply}
        />
      )}
    </div>
  )
}

export default leaveSummary
