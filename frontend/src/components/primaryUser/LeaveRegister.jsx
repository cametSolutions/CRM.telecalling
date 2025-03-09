import React, { useEffect, useState } from "react"
import { HiChevronLeft, HiChevronRight } from "react-icons/hi" // Impo
import UseFetch from "../../hooks/useFetch"
function LeaveRegister() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [visibleDays, setVisibleDays] = useState([])
  const [currentmonthleaveData, setcurrentmonthLeaveData] = useState([])
  const [tableRows, setTableRows] = useState([])
  const [clickedDate, setclickedDate] = useState(null)
  const [visibleMonth, setVisibleMonth] = useState("")
  const [formData, setFormData] = useState({
    startDate: "",

    leaveType: "Full Day",
    onsiteType: "Full Day",

    halfDayPeriod: "",
    onsite: false,
    leaveCategory: "",
    reason: "",
    description: "",
    eventId: null
  })
  const startDate = new Date()
  const year = startDate.getFullYear()
  const month = startDate.getMonth()
  //   const [currentMonth, setCurrentMonth] = useState(month)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(year)

  const userData = localStorage.getItem("user")
  const users = JSON.parse(userData)

  const { data: allleaves } = UseFetch(`/auth/getallLeave?userid=${users._id}`)
  const { data: allonsite, refreshHook: refreshHookOnsite } = UseFetch(
    users && `/auth/getallOnsite?userid=${users._id}`
  )
  const { data: leavemasterleavecount } = UseFetch(
    "/auth/getleavemasterleavecount"
  )
  // Generate days for the calendar
  useEffect(() => {
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, "0") // Convert to "01-12" format
    console.log(month)
    setCurrentMonth(`${year}-${month}`)
  }, [currentDate])
  useEffect(() => {
    const filteredcurrentmonthlyLeaves = allleaves?.filter((leaves) => {
      ///leavedate is iso format like "2025-03-03T12:00:00Z" so here slice 0 takes the first part and get the first 7 means 2025-03 because current month includes year also 2025-03
      const leaveMonth = leaves.leaveDate.split("T")[0].slice(0, 7)
      console.log(currentMonth)
      //here currentMonth have year and month no date
      return leaveMonth === currentMonth
    })
    console.log(filteredcurrentmonthlyLeaves)
    setcurrentmonthLeaveData(filteredcurrentmonthlyLeaves)
  }, [allleaves, currentDate, currentMonth])
  console.log(currentmonthleaveData)
  useEffect(() => {
    const days = []

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1
    setCurrentYear(year)

    // Set month name
    setVisibleMonth(
      `${currentDate.toLocaleString("default", { month: "long" })} ${year}`
    )

    // Get last day of the month
    const lastDay = new Date(year, month, 0).getDate()
    console.log(lastDay)
    console.log(month)
    // Generate all days in the month
    for (let i = 1; i <= lastDay; i++) {
      const date = new Date(year, month - 1, i + 1)
      console.log(date)
      days.push({
        fullDate: date.toISOString().split("T")[0], // Format: YYYY-MM-DD
        fullMonthDay: date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric"
        }), // Format: 07 March 2025
        day: date
      })
    }

    setVisibleDays(days)
  }, [currentDate])
  console.log(visibleDays)
  console.log(currentmonthleaveData)
  const handleDateClick = (arg) => {
    console.log(arg)
    setclickedDate(arg.dateStr)
    const clickedDate = arg.dateStr
    setFormData((prev) => ({
      ...prev, // Keeps previous form data intact
      startDate: arg.dateStr // Updates only startDate
    }))

    const existingEvent = events?.filter((event) => {
      const eventDate = event.start // Normalize to YYYY-MM-DD

      return eventDate == clickedDate // Compare only the date part
    })

    if (existingEvent && existingEvent.length > 0) {
      // Parse the inTime and outTime (assuming they are in "hh:mm AM/PM" format)
      const parseTime = (timeString) => {
        if (!timeString) {
          // Return default or empty values if timeString is undefined or null
          return { hours: null, minutes: null, amPm: null }
        }
        const [time, amPm] = timeString.split(" ")
        const [hours, minutes] = time.split(":")
        return { hours, minutes, amPm }
      }
      const findRelevantEvent = (events) => {
        return events.find((event) => {
          // Example condition: prioritize events without inTime and outTime, or with specific keys like onsite
          return (
            !event.inTime &&
            !event.outTime &&
            !event.onsite &&
            !event.onsiteData
          )
        }) // Fallback to the first event if no specific match is found
      }

      // Find the relevant event
      const relevantEvent = findRelevantEvent(existingEvent)

      if (relevantEvent) {
        setFormData({
          ...formData,
          startDate: relevantEvent?.start,
          halfDayPeriod: relevantEvent?.halfDayPeriod || "",
          leaveType: relevantEvent?.leaveType || "Full Day",

          reason: relevantEvent?.reason || ""
        })
      }
      // Set the form data dynamically based on the relevant event
    } else {
      setFormData({
        ...formData,
        startDate: arg.dateStr,
        endDate: arg.dateStr,
        leaveType: "Full Day",
        reason: "",
        eventId: null
      })
      setselectedAttendance((prev) => ({
        ...prev, // Spread the existing state
        attendanceDate: arg.dateStr // Add or update the attendanceDate field
      }))
    }
    setShowModal(true)
  }
  // Check if a date is the currently selected date
  const isSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString()
  }

  // Check if a date is today
  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  // Navigate to previous month
  const prevMonth = () => {
    console.log(currentDate)
    const newDate = new Date(currentDate)
    console.log(newDate)
    newDate.setMonth(newDate.getMonth() - 1)
    console.log(newDate)
    setCurrentDate(newDate)
  }

  // Navigate to next month
  const nextMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + 1)
    setCurrentDate(newDate)
  }

  // Go to current month
  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Format date to show day of week, month and day
  const formatDate = (date) => {
    const options = { weekday: "long", month: "short", day: "numeric" }
    return date.toLocaleDateString("en-US", options)
  }
  console.log(visibleDays)
  console.log(currentmonthleaveData)
  return (
    <div className="w-full ">
      <div className="flex items-center justify-between sticky top-0 py-3 px-4 z-30 bg-white">
        <h2 className="text-xl font-semibold">{visibleMonth}</h2>
        <div className="flex space-x-2">
          <button
            onClick={prevMonth}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
          >
            <HiChevronLeft className="w-5 h-5" /> {/* Backward Icon */}
          </button>
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
          >
            <HiChevronRight className="w-5 h-5" /> {/* Forward Icon */}
          </button>
        </div>
      </div>

      <div className="overflow-y-auto border rounded-lg mx-4">
        {visibleDays.map((date, index) => (
          <div
            key={index}
            onClick={() => {
              setSelectedDate(date)
              handleDateClick(date.fullDate)
            }}
            className=" flex  justify-between items-center  mb-2  cursor-pointer bg-gray-200"
          >
            <div className="">
              <div className=" flex-shrink-0 flex items-center justify-center rounded-full border mr-4 font-bold text-lg">
                {date.fullDate}
              </div>
              <div>
                <div className="font-medium">
                  {new Date(date.fullDate).toLocaleString("default", {
                    weekday: "long"
                  })}
                  {/* {date.day.toLocaleString("default", { weekday: "long" })} */}
                </div>
              </div>
            </div>

            <div className="flex">
              {currentmonthleaveData?.length > 0 ? (
                currentmonthleaveData
                  .filter(
                    (leave) =>
                      new Date(leave.leaveDate).toISOString().split("T")[0] ===
                      date.fullDate
                  ) // Matching dates correctly
                  .map((leave, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between hover:cursor-pointer "
                    >
                      <div className="flex flex-col text-gray-600">
                        <span className="text-sm">{leave?.leaveType}</span>
                        <span className="text-sm font-semibold">
                          {leave?.leaveCategory}
                        </span>
                      </div>

                      <div
                        className={`px-3 py-1 text-sm rounded-full text-white ${
                          leave.departmentstatus === "Dept Approved" ||
                          leave.hrstatus === "HR/Onsite Approved"
                            ? "bg-green-500"
                            : leave.departmentstatus === "Not Approved" &&
                              leave.hrstatus === "Not Approved"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      >
                        {leave.departmentstatus === "Dept Approved" ||
                        leave.hrstatus === "HR/Onsite Approved"
                          ? "Approved"
                          : leave.departmentstatus === "Not Approved" &&
                            leave.hrstatus === "Not Approved"
                          ? "Pending"
                          : ""}
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-gray-500 text-sm italic text-center">
                  No upcoming leaves
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LeaveRegister
