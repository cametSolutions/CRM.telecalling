import { useState, useEffect, useRef, useCallback } from "react"
import ExcelJS from "exceljs"
import { saveAs } from "file-saver"
import BarLoader from "react-spinners/BarLoader"
import ResponsiveTable from "./ResponsiveTable"
import Modal from "./Modal"
import api from "../../api/api"
import BranchDropdown from "./BranchDropdown"
import UseFetch from "../../hooks/useFetch"
import { toast } from "react-toastify"
import { getLocalStorageItem } from "../../helper/localstorage"
const LeaveSummary = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [warningMessage, setWarningMessage] = useState("")
  const [newattende, setnewattendee] = useState([])
  const [selectedName, setSelectedName] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [userBranches, setuserBranches] = useState([])
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1 // JavaScript months are 0-based, so adding 1
  const [selectedStaff, setselectedStaff] = useState("")
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [formData, setFormData] = useState({})
  const [selectedDate, setselectedDate] = useState(null)
  const [type, setType] = useState("")
  const [user, setUser] = useState(null)
  const [holiday, setHoly] = useState(null)
  const [currentmonthSundays, setCurrentmonthSundays] = useState(null)
  const [selectedBranch, setselectedBranch] = useState(null)
  const [leavesummaryList, setleaveSummary] = useState([])
  const listRef = useRef(null)
  const isFirstRender = useRef(true)

  // API URL with selected year and month
  const {
    data,

    loading
  } = UseFetch(`/auth/getsomeall?year=${selectedYear}&month=${selectedMonth}`)
  useEffect(() => {
    const userData = getLocalStorageItem("user")
    if (userData.selected && userData.selected.length > 1) {
      setselectedBranch("All")
    } else {
      setselectedBranch(userData.selected[0]?.branch_id)
    }
    // setselectedBranch(userData.selected[0].branch_id)
    userData.selected.forEach((branch) => {
      setuserBranches((prev) => [
        ...prev,
        {
          id: branch.branch_id,
          branchName: branch.branchName
        }
      ])
    })
    setUser(userData)
  }, [])
  useEffect(() => {
    if (data) {
      const { staffAttendanceStats, listofHolidays, sundayFulldate } = data
      setnewattendee(staffAttendanceStats)
      setHoly(listofHolidays)
      setCurrentmonthSundays(sundayFulldate)
      setleaveSummary(
        filterAttendance(staffAttendanceStats, searchTerm, selectedBranch, user)
      )

      
    }
  }, [data, searchTerm])
  useEffect(() => {
    if (isFirstRender.current) {
      // 🚀 Skip first render
      isFirstRender.current = false
      return
    }
    if (newattende && newattende.length > 0) {
      setleaveSummary(
        filterAttendance(newattende, searchTerm, selectedBranch, user)
      )
     
    }
  }, [selectedBranch])

  // Restore scroll position after render
  useEffect(() => {
    const storedScrollPosition = sessionStorage.getItem("scrollPosition")
    if (storedScrollPosition && listRef.current) {
      listRef.current.scrollTop = parseInt(storedScrollPosition, 10)
      // sessionStorage.removeItem("scrollPosition") // Optional: Clear after restoring
    }
  }, [selectedName]) // Restore when selectedIndex changes
  const filterAttendance = (attendance, searchTerm, selectedBranch, user) => {
    let filtered = attendance
    // Role based filtering
    if (user.role === "Admin") {
      if (searchTerm) {
        filtered = filtered.filter((staff) =>
          staff.name.toLowerCase().startsWith(searchTerm.toLowerCase())
        )
      }
    } else {
      filtered = filtered.filter(
        (staff) => staff.userId === user._id || staff.assignedto === user._id
      )

      if (searchTerm) {
        filtered = filtered.filter((staff) =>
          staff.name.toLowerCase().startsWith(searchTerm.toLowerCase())
        )
      }
    }

    // Branch filtering
    if (selectedBranch !== "All") {
      filtered = filtered.filter((staff) =>
        staff.branches.some((b) => b.branch_id === selectedBranch)
      )
    }

    return filtered
  }

  const handleBranchChange = (e) => {
    setselectedBranch(e)
  }

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

  const handleAttendance = useCallback((date, type, inTime, outTime) => {
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
  }, [])
  const handleSelectAttendee = (attendee) => {
    if (listRef.current) {
      sessionStorage.setItem("scrollPosition", listRef.current.scrollTop)
    }

    setSelectedName(selectedName === attendee.name ? null : attendee.name)
    if (selectedName === attendee.name) {
      setselectedStaff("")
    } else {
      selectedUser(attendee.userId)
    }

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
  const handleLeave = (
    date,
    type,

    leaveData,
    leavetype
  ) => {
    // Find the matching leave entry
    const matchingLeave = Object.values(leaveData).find(
      (entry) => entry.leaveCategory === leavetype
    )

    setModalOpen(true)
    setselectedDate(date)
    setType(type)

    if (type === "Leave" && matchingLeave) {
      setFormData({
        leaveId: matchingLeave._id,
        leaveDate: matchingLeave.leaveDate,
        reason: matchingLeave.reason,
        leaveCategory: matchingLeave.leaveCategory,
        prevCategory: matchingLeave.leaveCategory,
        leaveType: matchingLeave.leaveType,

        halfDayPeriod: matchingLeave.halfDayPeriod
          ? matchingLeave.halfDayPeriod
          : null
      })
    } else {
      setFormData({ leaveDate: date, leaveType: "Full Day" })
    }
  }

  const handleScroll = (event) => {
    const tables = document.querySelectorAll(".scroll-container")
    tables.forEach((table) => {
      table.scrollLeft = event.target.scrollLeft
    })
  }
  const handleClose = (setMessage) => {
    setModalOpen(false)
    setMessage("")
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

        const data = response?.data?.data?.data
        const holy = response?.data?.data?.fulldateholiday
        if (response.status === 200) {
          toast.success("leave edited sucessfully")
          setleaveSummary(data)
          setHoly(holy)
          setIsApplying(false)
          handleClose()
        } else if (response.status === 201) {
          setWarningMessage(response.data.message)
          setIsApplying(false)
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

  const handleDownload = (data) => {
    // Using ExcelJS instead of XLSX for better styling control
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Attendance")

    // Define column structure with widths
    worksheet.columns = [
      { header: "Employ_Name", key: "name", width: 25 },
      { header: "EMP_ID", key: "staffId", width: 15 },
      { header: "Casual_Leave", key: "casualLeave", width: 15 },
      { header: "Privileage_Leave", key: "privLeave", width: 15 },
      { header: "Comp_Leave", key: "compLeave", width: 15 },
      { header: "Other_Leave", key: "otherLeave", width: 15 },
      { header: "Late_Cutting", key: "lateCutting", width: 15 },
      { header: "lateOrEarlyCount", key: "lateEarlyCount", width: 15 },
      { header: "Total Present", key: "totalPresent", width: 15 }
    ]

    // Style the header row
    worksheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFF0000" } // Light grey background
      }
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } } // Black bold text
      cell.alignment = { horizontal: "center", vertical: "middle" }
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      }
    })

    // Process and add data
    let dataToProcess = []

    if (user?.role === "Staff") {
      dataToProcess = newattende.filter(
        (item) => item.userId === user?._id || item?.assignedto === user._id
      )
    } else if (user?.role === "Admin") {
      dataToProcess = data
    }

    // Add data rows
    dataToProcess.forEach((user) => {
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

      const totalEarlyOrLateCount = user.late + user.earlyGoing || 0

      const row = worksheet.addRow({
        name: user.name,
        staffId: user.staffId,
        casualLeave: casualLeave,
        privLeave: privilegeLeave,
        compLeave: compensatoryLeave,
        otherLeave: otherLeave,
        lateCutting: user.latecutting,
        lateEarlyCount: totalEarlyOrLateCount,
        totalPresent: user.present
      })

      // Style data cells
      row.eachCell((cell, colNumber) => {
        // Center-align all cells except the name column (first column)
        if (colNumber > 1) {
          cell.alignment = { horizontal: "center", vertical: "middle" }
        }

        // Add borders to all cells
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" }
        }

        // Apply zebra striping for better readability
        if (row.number % 2 === 0) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFAFAFA" } // Very light grey for even rows
          }
        }
      })
    })

    // Write to buffer and download
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      })
      saveAs(blob, "Attendance_Report.xlsx")
    })
  }
console.log(leavesummaryList)
  return (
    <div className="w-full flex flex-col h-full">
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
        <div className="grid grid-cols-2 md:flex md:flex-row md:items-center md:justify-end gap-2 md:gap-4 mb-3 md:mr-8 mx-5">
          {leavesummaryList && leavesummaryList.length > 0 && (
            // If more than one leave summary exists,
            // it means the logged-in user is a manager/super manager
            // and has staff under them. Show branch dropdown in this case.
            <BranchDropdown
              branches={userBranches}
              onBranchChange={handleBranchChange}
              branchSelected={selectedBranch}
            />
          )}

          {/* Search Input */}
          <div className="w-full md:w-auto">
            <input
              value={selectedStaff !== "" ? selectedStaff[0]?.name : searchTerm}
              onChange={(e) => {
                if (selectedStaff !== "") {
                  setSelectedName(null)
                  setselectedStaff("") // Clear selected staff
                }
                setSearchTerm(e.target.value)
              }}
              placeholder="Search..."
              className="appearance-none border border-gray-400 rounded px-3 py-2 w-full md:w-auto bg-white text-sm placeholder-gray-400 text-gray-700 focus:outline-none"
            />
          </div>

          {/* Download Button */}
          <button
            className="bg-blue-600 rounded px-3 py-2 text-white text-sm"
            onClick={() => handleDownload(newattende)}
          >
            Download to Excel
          </button>

          {/* Year Select */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border p-2 rounded w-full md:w-auto"
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
            className="border p-2 rounded w-full md:w-auto"
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
          <div className="flex-1 flex flex-col overflow-y-auto mx-4 mb-4 overflow-hidden shadow-xl rounded-lg">
            {leavesummaryList && leavesummaryList.length > 0 ? (
              leavesummaryList?.map((attendee, index) => (
                <div key={index}>
                  {selectedName === null || selectedName === attendee.name ? (
                    <div
                      ref={listRef}
                      // className={`${
                      //   selectedName === attendee.name && !modalOpen
                      //     ? "sticky top-0 z-20 "
                      //     : ""
                      // }`}
                    >
                      {/* Your existing summary card code */}
                      <div
                        className={` md:h-20 md:mr-4 shadow-lg rounded-lg w-full border cursor-pointer
                      ${
                        selectedName === attendee.name
                          ? "bg-gray-200 sticky top-0 z-40"
                          : "bg-gray-200 mb-2"
                      }`}
                        onClick={() => handleSelectAttendee(attendee)}
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
                      {selectedName === attendee.name &&
                        currentmonthSundays &&
                        holiday && (
                          <div className="flex-1  ">
                            <ResponsiveTable
                              attendee={attendee}
                              user={user}
                              handleAttendance={handleAttendance}
                              handleOnsite={handleOnsite}
                              handleLeave={handleLeave}
                              handleScroll={handleScroll}
                              modalOpen={modalOpen}
                              sundays={currentmonthSundays}
                              holiday={holiday}
                            />
                          </div>
                        )}
                    </div>
                  ) : null}
                </div>
              ))
            ) : (
              <div className="text-blue-500 text-center">
                {loading ? "" : "Oops! No staff found."}
              </div>
            )}
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
          errorMessage={warningMessage}
          setErrorMessage={setWarningMessage}
        />
      )}
    </div>
  )
}

export default LeaveSummary
