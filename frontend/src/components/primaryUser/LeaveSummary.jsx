import React, { useState, useEffect, useRef } from "react"
import * as XLSX from "xlsx"
import FileSaver from "file-saver"
import BarLoader from "react-spinners/BarLoader"
import ResponsiveTable from "./ResponsiveTable"
import Modal from "./Modal"
import api from "../../api/api"
import UseFetch from "../../hooks/useFetch"
import { toast } from "react-toastify"
const leaveSummary = () => {
  const [searchTerm, setSearchTerm] = useState(null)
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
  const listRef = useRef(null)
  const userData = localStorage.getItem("user")
  const user = JSON.parse(userData)
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
      if (user?.role === "Admin") {
        setHoly(holy)
        setleaveSummary(newattende)
      } else if (user?.role === "Staff") {
        setHoly(holy)
        const filteredUser = newattende.filter(
          (item) => item.userId === user._id || item.assignedto === user._id
        )
        setleaveSummary(filteredUser)
      }
    }
  }, [newattende])
  useEffect(() => {
    if (newattende && newattende.length > 0 && searchTerm) {
      const filteredStaff = newattende.filter((staff) =>
        staff.name.toLowerCase().startsWith(searchTerm.toLowerCase())
      )
      setleaveSummary(filteredStaff)
    } else if (
      leavesummaryList &&
      leavesummaryList.length > 0 &&
      searchTerm === ""
    ) {
      if (user?.role === "Admin") {
        setleaveSummary(newattende)
      } else if (user?.role === "Staff") {
        const filteredUser = newattende.filter(
          (item) => item.userId === user._id || item.assignedto === user._id
        )
        setleaveSummary(filteredUser)
      }
    }
  }, [searchTerm])
  // Restore scroll position after render
  useEffect(() => {
    const storedScrollPosition = sessionStorage.getItem("scrollPosition")
    if (storedScrollPosition && listRef.current) {
      listRef.current.scrollTop = parseInt(storedScrollPosition, 10)
      // sessionStorage.removeItem("scrollPosition") // Optional: Clear after restoring
    }
  }, [selectedIndex]) // Restore when selectedIndex changes

  useEffect(() => {
    const storedScrollPosition = sessionStorage.getItem("scrollPosition")
    if (storedScrollPosition && listRef.current) {
      listRef.current.scrollTop = parseInt(storedScrollPosition, 10)
    }
  }, [selectedIndex])
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
  const handleSelectAttendee = (index, attendee) => {
    if (listRef.current) {
      sessionStorage.setItem("scrollPosition", listRef.current.scrollTop)
    }

    setSelectedIndex(selectedIndex === index ? null : index)
    selectedUser(attendee.userId)
    setEditIndex(null)
    setFormData(
      Object.fromEntries(Object.keys(formData).map((key) => [key, ""]))
    )
  }
  const handleOnsite = (date, type, onsiteType, halfDayperiod, description) => {
    setModalOpen(true)

    setselectedDate(date)
    setType(type)
    if (type === "Onsite") {
      setFormData({
        onsiteDate: date,
        onsiteType: onsiteType,
        halfDayPeriod: halfDayperiod ? halfDayperiod : null,
        description
      })
    }
  }
  const handleLeave = (date, type, leaveDetails, halfDayperiod, reason) => {
    setModalOpen(true)
    setselectedDate(date)
    setType(type)
    if (type === "Leave") {
      setFormData({
        leaveDate: date,
        reason,
        leaveCategory: leaveDetails.field,
        leaveType:
          leaveDetails.value === 1
            ? "Full Day"
            : leaveDetails.value === 0.5
            ? "Half Day"
            : null,
        halfDayPeriod: halfDayperiod ? halfDayperiod : null
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

  const handleApply = async (staffId, selected, setIsApplying, type) => {
    try {
      if (type === "Leave") {
        const matchedStaff = leavesummaryList.find(
          (staff) => staff.userId === staffId
        )
        const assignedTo = matchedStaff ? matchedStaff.assignedto : null
        const response = await api.post(
          `/auth/editLeave?userid=${staffId}&assignedto=${assignedTo}`,
          selected
        )
        const data = response.data.data.data
        const holy = response.data.data.fulldateholiday
        if (response.status === 200) {
          toast.success("leave edited sucessfully")
          setleaveSummary(data)
          setHoly(holy)
          setIsApplying(false)
          handleClose()
        } else {
          toast.error("error in updating")
        }
      } else if (type === "Attendance") {
        const matchedStaff = leavesummaryList.find(
          (staff) => staff.userId === staffId
        )
        const attendanceid = matchedStaff ? matchedStaff.attendanceId : null
        const response = await api.post(
          `/auth/editAttendance?userid=${staffId}&attendanceid=${attendanceid}`,
          selected
        )
        const data = response.data.data.data
        const holy = response.data.data.fulldateholiday

        if (response.status === 200) {
          toast.success("Attendance edited sucessfully")
          setleaveSummary(data)
          setHoly(holy)
          setIsApplying(false)
          handleClose()
        } else {
          toast.error("error in updating")
        }
      } else if (type === "Onsite") {
        const response = await api.post(
          `/auth/editOnsite?userid=${staffId}`,
          selected
        )
        const data = response.data.data.data
        const holy = response.data.data.fulldateholiday
        if (response.status === 200) {
          toast.success("Onsite edited successfully")
          setleaveSummary(data)
          setHoly(holy)
          setIsApplying(false)
          handleClose()
        }
      }
    } catch (error) {
      console.log(error.response.data.message)
      toast.error(error.response.data.message)
    }
  }
  const handleDownloadFailedData = () => {
    if (nonsavedData.length > 0) {
      // Create a new workbook
      const workbook = XLSX.utils.book_new()

      // Convert failed data to sheet
      const worksheet = XLSX.utils.json_to_sheet(nonsavedData)

      // Append sheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Failed Data")

      // Generate Excel file and trigger download
      XLSX.writeFile(workbook, "failed_data.xlsx")
    }
  }

  const handleDownload = (data) => {
    const headers = [
      "Employ_Name",
      "EMP_ID",
      "Casual_Leave",
      "Privileage_Leave",
      "Comp_Leave",
      "Other_Leave",
      "Late_Cutting",
      "Total Present"
    ]

    // Convert JSON to array format
    const worksheetData = [headers] // Add headers to the first row
    if (user?.role === "Staff") {
      const filteredUser = newattende.filter(
        (item) => item.userId === user?._id || item?.assignedto === user._id
      )
      filteredUser.forEach((user) => {
        let casualLeave = 0,
          privilegeLeave = 0,
          compensatoryLeave = 0,
          otherLeave = 0

        Object.values(user.attendancedates).forEach((details) => {
          casualLeave += details.casualLeave || 0
          privilegeLeave += details.privileageLeave || 0
          compensatoryLeave += details.compensatoryLeave || 0
          otherLeave += details.otherLeave || 0
        })

        worksheetData.push([
          user.name,
          user.staffId,
          casualLeave,
          privilegeLeave,
          compensatoryLeave,
          otherLeave,
          user.latecutting,
          user.present
        ])
      })

      // Create a worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance")

      // Apply styles to headers and other columns
      const headerRange = XLSX.utils.decode_range(worksheet["!ref"])
      for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C })
        if (!worksheet[cellAddress]) continue
        worksheet[cellAddress].s = {
          font: { bold: true }, // Make headers bold
          alignment: { horizontal: "center", vertical: "center" } // Center align all headers
        }
      }

      // Apply center alignment except for "Employ_Name" column (first column)
      for (let R = 1; R <= headerRange.e.r; ++R) {
        for (let C = 1; C <= headerRange.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C })
          if (!worksheet[cellAddress]) continue
          worksheet[cellAddress].s = {
            alignment: { horizontal: "center", vertical: "center" } // Center align all columns except name
          }
        }
      }

      // Adjust column widths
      worksheet["!cols"] = [
        { wch: 25 }, // Employ_Name (wider)
        { wch: 15 },
        { wch: 15 }, // Casual_Leave
        { wch: 15 }, // Privileage_Leave
        { wch: 15 }, // Comp_Leave
        { wch: 15 }, // Other_Leave
        { wch: 15 }, // Late_Cutting
        { wch: 15 } // Total Present
      ]

      // Convert to Excel file
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array"
      })

      // Save file
      const fileData = new Blob([excelBuffer], {
        type: "application/octet-stream"
      })

      FileSaver.saveAs(fileData, "Attendance_Report.xlsx")
    } else if (user?.role === "Admin") {
      data.forEach((user) => {
        let casualLeave = 0,
          privilegeLeave = 0,
          compensatoryLeave = 0,
          otherLeave = 0

        Object.values(user.attendancedates).forEach((details) => {
          casualLeave += details.casualLeave || 0
          privilegeLeave += details.privileageLeave || 0
          compensatoryLeave += details.compensatoryLeave || 0
          otherLeave += details.otherLeave || 0
        })

        worksheetData.push([
          user.name,
          user.staffId,
          casualLeave,
          privilegeLeave,
          compensatoryLeave,
          otherLeave,
          user.latecutting,
          user.present
        ])
      })

      // Create a worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance")

      // Apply styles to headers and other columns
      const headerRange = XLSX.utils.decode_range(worksheet["!ref"])
      for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C })
        if (!worksheet[cellAddress]) continue
        worksheet[cellAddress].s = {
          font: { bold: true }, // Make headers bold
          alignment: { horizontal: "center", vertical: "center" } // Center align all headers
        }
      }

      // Apply center alignment except for "Employ_Name" column (first column)
      for (let R = 1; R <= headerRange.e.r; ++R) {
        for (let C = 1; C <= headerRange.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C })
          if (!worksheet[cellAddress]) continue
          worksheet[cellAddress].s = {
            alignment: { horizontal: "center", vertical: "center" } // Center align all columns except name
          }
        }
      }

      // Adjust column widths
      worksheet["!cols"] = [
        { wch: 25 }, // Employ_Name (wider)
        { wch: 15 },
        { wch: 15 }, // Casual_Leave
        { wch: 15 }, // Privileage_Leave
        { wch: 15 }, // Comp_Leave
        { wch: 15 }, // Other_Leave
        { wch: 15 }, // Late_Cutting
        { wch: 15 } // Total Present
      ]

      // Convert to Excel file
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array"
      })

      // Save file
      const fileData = new Blob([excelBuffer], {
        type: "application/octet-stream"
      })

      FileSaver.saveAs(fileData, "Attendance_Report.xlsx")
    }
  }

  return (
    <div className="w-full">
      {loading && (
        <BarLoader
          cssOverride={{ width: "100%", height: "4px" }} // Tailwind's `h-4` corresponds to `16px`
          color="#4A90E2" // Change color as needed
        />
      )}
      {/* Header Section */}

      <div className=" text-center">
        <h1 className=" sm:text-md md:text-2xl font-bold mb-1">
          User Leave Summary
        </h1>

        <div className="flex justify-center md:justify-end md:gap-4 gap-2  mb-3 md:mr-8">
          <div>
            <input
              value={
                selectedStaff !== null ? selectedStaff[0].name : searchTerm
              }
              onChange={(e) => {
                if (selectedStaff !== null) {
                  setSelectedIndex(null)
                  setselectedStaff(null) // Clear selected staff
                }
                setSearchTerm(e.target.value)
              }}
              placeholder="Search..."
              className="appearance-none rounded-r rounded-l sm:rounded-lg-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-auto bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
            />
          </div>
          <button
            className="bg-blue-600 rounded px-1 py-0.5  text-white text-sm md:text-md"
            onClick={() => handleDownload(newattende)}
          >
            Download to Excel
          </button>
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
        ""
      ) : (
        <>
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto px-5 ">
            {leavesummaryList &&
              leavesummaryList.length>0 &&
              leavesummaryList?.map((attendee, index) => (
                <div key={index}>
                  {selectedIndex === null || selectedIndex === index ? (
                    <>
                      <div
                        ref={listRef}
                        className={`${
                          selectedIndex === index && !modalOpen
                            ? "sticky top-0 z-20 bg-white"
                            : ""
                        }`}
                      >
                        {/* Your existing summary card code */}
                        <div
                          className={` md:py-2 md:mr-4 shadow-lg rounded-lg w-full border cursor-pointer
                      ${
                        selectedIndex === index
                          ? "bg-gray-200"
                          : "bg-gray-200 mb-2"
                      }`}
                          onClick={() => handleSelectAttendee(index, attendee)}
                        >
                          <div className="md:flex w-full">
                            <div className=" text-sm md:text-md font-semibold text-gray-800 w-full  md:w-[225px] p-2">
                              {attendee.name}
                            </div>
                            <div className="w-full overflow-x-auto">
                              <table className="w-full ">
                                <thead className="bg-gray-200 text-gray-800">
                                  <tr>
                                    {[
                                      "Present",
                                      "Leave",
                                      "Late Cutting",
                                      "Not Marked",
                                      "Onsite"
                                    ].map((label, idx) => (
                                      <th
                                        key={idx}
                                        className="s py-1 text-gray-800 text-sm font-medium text-center min-w-[100px]"
                                      >
                                        {label}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="bg-gray-200 text-gray-800">
                                    {[
                                      attendee.present,
                                      attendee.absent,
                                      attendee.latecutting,
                                      attendee.notMarked,
                                      attendee.onsite
                                    ].map((value, idx) => (
                                      <td
                                        key={idx}
                                        className="px-4 py-2 text-lg font-semibold text-center "
                                      >
                                        {value}
                                      </td>
                                    ))}
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                        {selectedIndex === index && (
                          <ResponsiveTable
                            attendee={attendee}
                            user={user}
                            handleAttendance={handleAttendance}
                            handleOnsite={handleOnsite}
                            handleLeave={handleLeave}
                            handleScroll={handleScroll}
                            modalOpen={modalOpen}
                            holiday={holiday}
                          />
                        )}
                      </div>
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
          assignedto={selectedStaff[0]?.assignedto}
          staffName={selectedStaff[0]?.name}
          casualleavestartsfrom={selectedStaff[0]?.casualleavestartsfrom}
          sickleavestartsfrom={selectedStaff[0]?.sickleavestartsfrom}
          privilegeleavestartsfrom={selectedStaff[0]?.privilegeleavestartsfrom}
          handleApply={handleApply}
        />
      )}
    </div>
  )
}

export default leaveSummary
