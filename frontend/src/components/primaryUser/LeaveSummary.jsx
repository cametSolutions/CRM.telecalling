import React, { useState, useEffect } from "react"
import * as XLSX from "xlsx"
import FileSaver from "file-saver"

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
          (item) => item.userId === user._id || item.assignedto === user._id
        )
        setleaveSummary(filteredUser)
      }
    }
  }, [newattende])

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
      const matchedStaff = leavesummaryList.find(
        (staff) => staff.userId === staffId
      )
      const assignedTo = matchedStaff ? matchedStaff.assignedto : null
      const response = await api.post(
        `/auth/editLeave?userid=${staffId}&assignedto=${assignedTo}`,
        selected
      )
      const data = response.data.data.data
      if (response.status === 200) {
        toast.success("leave edited sucessfully")
        setleaveSummary(data)
        setIsApplying(false)
        handleClose()
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
      if (response.status === 200) {
        toast.success("Onsite edited successfully")
        setleaveSummary(data)
        setIsApplying(false)
        handleClose()
      }
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
  // const handleDownloadFailedData = () => {
  //   if (nonsavedData.length > 0) {
  //     // Define the desired headers
  //     const headers = [
  //       "Employ_Name",
  //       "EMP_ID",
  //       "Casual_Leave",
  //       "Privileage_Leave",
  //       "Comp_Leave",
  //       "Other_Leave",
  //       "Late_Cutting",
  //       "Total Present"
  //     ]
  //     const keyMapping = {
  //       name: "Name",
  //       email: "Email",
  //       phone: "Phone",
  //       errorReason: "Reason" // Example of renaming a key
  //     }

  //     // Filter and rename keys from nonsavedData
  //     const formattedData = nonsavedData.map((item) => {
  //       Employ_Name: item.name,
  //       EMP_ID:item.,
  //       Casual_Leave,
  //       Privileage_Leave,
  //       Privileage_Leave,
  //       Comp_Leave,
  //       Other_Leave,
  //       Late_Cutting,
  //       Total Present

  //     })

  //     // Create a new workbook
  //     const workbook = XLSX.utils.book_new()

  //     // Convert formatted data to sheet
  //     const worksheet = XLSX.utils.json_to_sheet(formattedData, {
  //       header: headers
  //     })

  //     // Append sheet to workbook
  //     XLSX.utils.book_append_sheet(workbook, worksheet, "Failed Data")

  //     // Generate Excel file and trigger download
  //     XLSX.writeFile(workbook, "failed_data.xlsx")
  //   }
  // }
  // const handleDownload = (data) => {
  //   const headers = [
  //     "Employ_Name",

  //     "Casual_Leave",
  //     "Privileage_Leave",
  //     "Comp_Leave",
  //     "Other_Leave",
  //     "Late_Cutting",
  //     "Total Present"
  //   ]

  //   // Convert JSON to array format
  //   const worksheetData = [headers] // Add headers to the first row

  //   data.forEach((user) => {
  //     let casualLeave = 0,
  //       privilegeLeave = 0,
  //       compensatoryLeave = 0,
  //       otherLeave = 0

  //     Object.values(user.attendancedates).forEach((details) => {
  //       casualLeave += details.casualLeave || 0
  //       privilegeLeave += details.privilegeLeave || 0
  //       compensatoryLeave += details.compensatoryLeave || 0
  //       otherLeave += details.otherLeave || 0
  //     })

  //     worksheetData.push([
  //       user.name,

  //       casualLeave,
  //       privilegeLeave,
  //       compensatoryLeave,
  //       otherLeave,
  //       user.latecutting,
  //       user.present
  //     ])
  //   })

  //   // Create a worksheet
  //   const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
  //   const workbook = XLSX.utils.book_new()
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance")

  //   // Convert to Excel file
  //   const excelBuffer = XLSX.write(workbook, {
  //     bookType: "xlsx",
  //     type: "array"
  //   })

  //   // Save file
  //   const fileData = new Blob([excelBuffer], {
  //     type: "application/octet-stream"
  //   })
  //   saveAs(fileData, "Attendance_Report.xlsx")
  // }
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

    data.forEach((user) => {
      let casualLeave = 0,
        privilegeLeave = 0,
        compensatoryLeave = 0,
        otherLeave = 0

      Object.values(user.attendancedates).forEach((details) => {
        casualLeave += details.casualLeave || 0
        privilegeLeave += details.privilegeLeave || 0
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
  return (
    <div className="w-full">
      {/* Header Section */}

      <div className=" text-center">
        <h1 className="text-2xl font-bold mb-1">User Leave Summary</h1>
        <div className="flex flex-wrap justify-end gap-4 mb-3">
          <button
            className="bg-blue-600 rounded px-2 py-0.5 text-white"
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
