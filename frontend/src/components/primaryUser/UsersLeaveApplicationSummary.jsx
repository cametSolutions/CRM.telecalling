import React, { useEffect, useState } from "react"

import tippy from "tippy.js"
import UseFetch from "../../hooks/useFetch"
import { useLocation } from "react-router-dom"
import api from "../../api/api"
import "tippy.js/dist/tippy.css"
import debounce from "lodash.debounce"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import "tippy.js/themes/light.css" // Example for light theme

function UsersLeaveApplicationSummary() {
  const location = useLocation()
  // Extract query parameters
  const searchParams = new URLSearchParams(location.search)
  const userId = searchParams.get("userid") // Retrieve the 'userid' query parameter
  const userName = searchParams.get("userName")

  const { selectedusersleaves, selectedusersattendance } = location.state || {}
  const [events, setEvents] = useState([])
  const [selectedMonth, setSelectedMonth] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [t, setIn] = useState(null)
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    leaveType: "Full Day",
    halfDayPeriod: "",
    onsite: false,
    reason: "",
    description: "",
    eventId: null
  })

  const [selectedAttendance, setselectedAttendance] = useState({
    attendanceDate: "",
    inTime: { hours: "12", minutes: "00", amPm: "AM" },
    outTime: { hours: "12", minutes: "00", amPm: "AM" }
  })

  const [isOnsite, setIsOnsite] = useState(false)
  const [totalAttendance, setTotalAttendance] = useState(null)
  const [totalLate, setTotalLate] = useState(null)
  const [attendance, setAttendance] = useState(false)
  const [widthState, setWidthState] = useState("w-5/6")
  const [tableRows, setTableRows] = useState([])
  const [existingEvent, setexistingEvent] = useState([])
  const [clickedDate, setclickedDate] = useState(null)
  const [leaves, setLeaves] = useState([])
  const [attendee, setAttendee] = useState([])
  const userData = localStorage.getItem("user")
  const user = JSON.parse(userData)

  useEffect(() => {
    if ((selectedusersleaves, selectedusersattendance)) {
      const filteredLeaves = selectedusersleaves.filter(
        (leave) => leave.userId === userId
      )
      const filteredAttendance = selectedusersattendance.filter(
        (attendance) => attendance.userId === userId
      )
      setAttendee(filteredAttendance)
      setLeaves(filteredLeaves)
    }
  }, [])

  useEffect(() => {
    if ((leaves && leaves.length) || (attendee && attendee.length)) {
      const formattedEvents = formatEventData(leaves)

      let attendanceDetails
      if (formattedEvents.length > 0) {
        attendanceDetails = attendee.map((item) => {
          let dayObject = {
            start: "",
            reason: "No leave today",
            inTime: "On Leave",
            outTime: "On Leave",
            color: "green"
          }
          const fdate = new Date(item.attendanceDate) // Convert to Date object

          let date = fdate.toISOString().split("T")[0]
          let existingDate = formattedEvents.find((event) => {
            return event.start === date
          })
          if (existingDate) {
            dayObject.start = existingDate?.start
            dayObject.reason = existingDate?.reason
            dayObject.inTime = item?.inTime
            dayObject.outTime = item?.outTime
            dayObject.color = existingDate.color
            formattedEvents.filter((item) => item.start !== date)
            return dayObject
          } else {
            dayObject.start = date
            dayObject.inTime = item?.inTime
            dayObject.outTime = item?.outTime

            return dayObject
          }
        })
      }

      setEvents([...formattedEvents, ...attendanceDetails])
    }
  }, [leaves, attendee])

  useEffect(() => {
    if (!showModal) {
      setIsOnsite(false)
    }
  }, [showModal])
  useEffect(() => {
    if (isOnsite && clickedDate) {
      // Find the event that matches the clicked date
      const existingEvent = events.find((event) => event.start === clickedDate)

      // If a matching event is found and it has onsite data
      if (existingEvent && existingEvent.onsitestatus) {
        const matchedOnsiteData = existingEvent.onsiteData[0].map((status) => ({
          siteName: status.siteName,
          place: status.place,
          Start: status.Start,
          End: status.End,
          km: status.km,
          kmExpense: status.kmExpense,
          foodExpense: status.foodExpense
        }))

        // Now set the table rows with the matched onsite data and an empty row for new input
        setTableRows(matchedOnsiteData)
      }
    }
  }, [isOnsite, clickedDate])

  const formatEventData = (events) => {
    return events.map((event) => {
      const date = new Date(event.leaveDate) // Convert to Date object
      const formattedDate = date.toISOString().split("T")[0] // Format as YYYY-MM-DD

      let dayObject = {
        start: "",
        reason: event?.reason,
        inTime: "On Leave",
        outTime: "On Leave",
        color: ""
      }
      if (formattedDate) {
        dayObject.start = formattedDate
      }
      if (event.adminverified) {
        dayObject.color = "red"
      } else if (event.inTime) {
        dayObject.inTime = event.inTime
      } else {
        dayObject.color = "orange"
      }
      return dayObject
    })
  }

  const handleOnsiteChange = () => {
    setIsOnsite(!isOnsite)

    setFormData({
      ...formData,
      onsite: !formData.onsite
    })
  }

  const addRow = () => {
    setTableRows([
      ...tableRows,
      {
        siteName: "",
        place: "",
        Start: "",
        End: "",
        km: "",
        kmExpense: "",
        foodExpense: ""
      }
    ])
  }

  const handleDropdownChange = (index, value) => {
    const updatedRows = [...tableRows]
    updatedRows[index].place = value
    setTableRows(updatedRows)
  }
  const selectAttendance = (e) => {
    const { name, value } = e.target

    setselectedAttendance((prev) => ({
      ...prev, // Spread the existing state
      [name]: value // Dynamically update the property corresponding to 'name'
    }))
  }

  const handleDateClick = (arg) => {
    const clickedDate = arg.dateStr
    setclickedDate(clickedDate)

    // Check if there's already an event on this date

    const existingEvent = events.find((event) => event.start === clickedDate)

    setexistingEvent(existingEvent)

    if (existingEvent) {
      // Parse the inTime and outTime (assuming they are in "hh:mm AM/PM" format)
      const parseTime = (timeString) => {
        const [time, amPm] = timeString.split(" ")
        const [hours, minutes] = time.split(":")
        return { hours, minutes, amPm }
      }

      // If an event exists, set the form data to edit the event
      setFormData({
        ...formData,
        startDate: existingEvent?.start,

        leaveType: existingEvent?.title,
        onsite: existingEvent?.onsite,
        [existingEvent.onsite ? "description" : "reason"]:
          existingEvent?.reason,
        eventId: existingEvent?.id // Store the event ID for editing
      })
      // Set selected attendance state
      setselectedAttendance((prev) => ({
        ...prev, // Spread the previous state to keep other values intact
        attendanceDate: existingEvent.start, // Set the attendance date
        inTime: {
          hours: parseTime(existingEvent.inTime)?.hours, // Update hours from parsed inTime
          minutes: parseTime(existingEvent.inTime)?.minutes, // Update minutes from parsed inTime
          amPm: parseTime(existingEvent.inTime)?.amPm // Update AM/PM from parsed inTime
        },
        outTime: {
          hours: parseTime(existingEvent.outTime)?.hours, // Update hours from parsed outTime
          minutes: parseTime(existingEvent.outTime)?.minutes, // Update minutes from parsed outTime
          amPm: parseTime(existingEvent.outTime)?.amPm // Update AM/PM from parsed outTime
        }
      }))
      if (existingEvent.onsite) {
        setIsOnsite(true)
      }
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

  const handleUpdate = async (updatedData) => {
    try {
      const eventId = formData.eventId

      // Assuming you have an API endpoint for updating leave requests
      const response = await api.put(`/auth/updateLeave?userId=${eventId}`, {
        updatedData
      })
      if (response.status === 200) {
        // Close the modal
        setShowModal(false)
        refreshHook()
      }
    } catch (error) {
      console.error("Error updating leave request:", error)
    }
  }


  const handleDatesSet = (info) => {
    // Get the current start date of the view (first day of the current month)
    const monthName = info.view.currentStart.toLocaleString("default", {
      month: "long"
    })
    const monthMapping = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12
    }
    const monthNumber = monthMapping[monthName]

    const filteredData = attendee?.filter((item) => {
      const attendanceMonth = new Date(item.attendanceDate).getMonth() + 1 // Get month from Date (1 = Jan, 12 = Dec)
      return attendanceMonth === monthNumber
    })

    setTotalAttendance(filteredData)
  }

  const handleDelete = async (eventId) => {
    try {
      // Assuming you have an API endpoint for deleting leave requests
      const response = await fetch(`/api/leave/${eventId}`, {
        method: "DELETE"
      })

      if (!response.ok) {
        throw new Error("Failed to delete leave request")
      }

      // Remove the event from the calendar (simplified example)
      setEvents(events.filter((event) => event.id !== eventId))

      // Close the modal
      setShowModal(false)
    } catch (error) {
      console.error("Error deleting leave request:", error)
    }
  }

  //   const handleDelete = async (id) => {
  //     try {
  //       await fetch(`/api/leaves/${id}`, {
  //         method: "DELETE"
  //       })
  //       setEvents(events.filter((event) => event._id !== id))
  //     } catch (error) {
  //       console.error("Error deleting leave:", error)
  //     }
  //   }

  const handleInputChange = debounce((e) => {
    const { name, value, type, checked } = e.target

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    })
  }, 300)

  const handleChange = (e) => handleInputChange(e)

  // Function to map classNames to colors
  const getColorFromClassName = (className) => {
    const colorMap = {
      "unverified-event": "#ffcc00",
      "cancel-status": "#ff0000",
      "hr-rejected": "#cc0000",
      "fully-verified-event": "#00cc66",
      "dept-rejected": "#9900cc",
      "dept-approved-event": "#0066cc",
      "onsite-approved-event": "#33ccff",
      "onsite-pending-event": "#ff9900"
    }
    return colorMap[className] || "#cccccc" // Default to grey if className is not mapped
  }
  const handleHourChange = (e) => {
    setAttendance((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }))
  }
  const handleTimeChange = (type, field, value) => {
    setselectedAttendance((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }))
  }

  const handleMinuteChange = (e) => {
    setselectedAttendance({ ...selectedAttendance, minutes: e.target.value })
  }

  const handleAmPmChange = (e) => {
    setselectedAttendance({ ...selectedAttendance, amPm: e.target.value })
  }
  const handleAttendance = () => {
    setAttendance(!attendance)
    // setselectedAttendance((prev) => ({
    //   ...prev, // Spread the existing state
    //   attendanceDate: formData.startDate // Add or update the attendanceDate field

    // }))

    setWidthState(widthState === "w-5/6" ? "w-2/6" : "w-5/6")
  }

  const handleApply = async () => {
    try {
      if (formData.onsite) {
        // const response = await api.post(
        //   `http://localhost:9000/api/auth/onsiteLeave?selectedid=${user._id}&assignedto=${user.assignedto}`,
        //   { formData, tableRows }
        // )
        const response = await api.post(
          `https://www.crm.camet.in/api/auth/onsiteLeave?selectedid=${user._id}&assignedto=${user.assignedto}`,
          { formData, tableRows }
        )

        if (response.status === 200) {
          setFormData((prev) => ({
            ...prev,
            description: "",
            onsite: false,
            halfDayPeriod: "",
            leaveType: "Full Day"
          }))
          setTableRows((prev) => [
            {
              ...prev,
              siteName: "",
              place: "",
              Start: "",
              End: "",
              km: "",
              kmExpense: "",
              foodExpense: ""
            }
          ])
          setShowModal(false)
          refreshHook()
        }
      } else {
        // Assuming you have an API endpoint for creating leave requests
        // const response = await fetch(
        //   `http://localhost:9000/api/auth/leave?selectedid=${user._id}&assignedto=${user.assignedto}`,
        //   {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify(formData),
        //     credentials: "include"
        //   }
        // )
        const response = await fetch(
          `https://www.crm.camet.in/api/auth/leave?selectedid=${user._id}&assignedto=${user.assignedto}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(formData),
            credentials: "include"
          }
        )

        const responseData = await response.json()

        if (!response.ok) {
          throw new Error("Failed to apply for leave")
        }
        refreshHook()

        setShowModal(false)
        setFormData((prev) => ({
          ...prev,
          reason: ""
        }))
      }
    } catch (error) {
      console.error("Error applying for leave:", error)
    }
  }
  const handleApplyAttendance = async () => {
    const response = await fetch(
      `https://www.crm.camet.in/api/auth/attendance?selectedid=${user._id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(selectedAttendance),
        credentials: "include"
      }
    )

    const responseData = await response.json()

    if (!response.ok) {
      throw new Error("Failed to apply for leave")
    }
    refreshHook()

    setShowModal(false)
    setselectedAttendance({
      attendanceDate: "",
      inTime: "",
      outTime: ""
    })
  }

  return (
    <div className=" p-4">
      <div className="w-full">
        <div className="calendar-header flex flex-wrap justify-center gap-4">
          {/* Attendance */}
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 bg-green-500 "></div>
            <span className="text-sm md:text-base">Present</span>
          </div>

          {/* Leave */}
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 bg-red-500 "></div>
            <span className="text-sm md:text-base">Leave</span>
          </div>

          {/* Pending */}
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 bg-orange-500 "></div>
            <span className="text-sm md:text-base">Pending</span>
          </div>

          {/* Not Selected */}
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 bg-pink-300 "></div>
            <span className="text-sm md:text-base">Not selected</span>
          </div>
        </div>
        <div className="flex flex-wrap justify-between items-center p-3 mb-2 bg-gray-100 rounded-md shadow-md">
          {/* Left Section */}
          <div className="flex space-x-8">
            <div>
              <span className="font-semibold">Total Attendance: </span>
              <span>{totalAttendance?.length || 0}</span>
            </div>
            <div>
              <span className="font-semibold">Total Late Coming: </span>
              <span>{attendee?.length || 0}</span>
            </div>
          </div>

          {/* Center Section */}
          <div className="text-center w-full sm:w-auto mt-4 sm:mt-0">
            <h3 className="text-xl font-bold text-gray-800">
              {userName || "User Name"}
            </h3>
          </div>
        </div>

        {/* <div className="flex">
          <div className="flex justify-start">
            <div className="mr-5">
              <span>Total Attendance-</span>
              <span>{totalAttendance?.length}</span>
            </div>
            <div>
              <span>Total Latecoming-</span>
              <span>{attendee?.length}</span>
            </div>
          </div>

          <div className=" flex justify-center">
            <h3>{userName}</h3>
          </div>
        </div> */}

        <FullCalendar
          key={events.length}
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          dateClick={handleDateClick}
          headerToolbar={{
            left: "title", // Align these to the left
            center: "", // Month title in the center
            right: "prev,next today" // Leave right empty to avoid overcrowding
          }}
          selectable={true}
          height="auto"
          datesSet={handleDatesSet}
          dayCellDidMount={(info) => {
            // Normalize the date to "YYYY-MM-DD" format (UTC)
            const cellDate = info.date.toLocaleDateString("en-CA") // Simplified to handle UTC date

            const dayOfWeek = info.date.getDay() // Get the day of the week (0 = Sunday)

            // Find the matching event by comparing only the date part (YYYY-MM-DD)
            const matchingEvent = events.find((event) => {
              const eventDate = new Date(event.start).toLocaleDateString(
                "en-CA"
              )
              // Get event start date in "YYYY-MM-DD" format
              return eventDate === cellDate // Compare the date part (YYYY-MM-DD)
            })

            const dayCellBottom = info.el.querySelector(
              ".fc-daygrid-day-bottom"
            )

            if (matchingEvent) {
              const inTime = matchingEvent.inTime || "-"
              const outTime = matchingEvent.outTime || "-"
              const squareColor = matchingEvent.color || "blue"
              const reason = matchingEvent.reason || "No reason provided"

              // Create the time container and add it to the day cell
              const timeContainer = document.createElement("div")
              timeContainer.className = "time-container"
              timeContainer.innerHTML = `<div class="time-display">In: ${inTime}<br>Out: ${outTime}</div>`

              // Create and style the square marker
              const squareMarker = document.createElement("div")
              squareMarker.className = "square-marker"
              squareMarker.style.backgroundColor = squareColor

              // Append square marker to the day cell bottom
              dayCellBottom?.appendChild(squareMarker)

              // Append time container to the top of the day cell
              info.el
                .querySelector(".fc-daygrid-day-top")
                .appendChild(timeContainer)

              // Initialize tippy tooltips on the square marker
              tippy(squareMarker, {
                content: reason,
                theme: "custom-tooltip",
                placement: "top"
              })
            } else if (dayOfWeek !== 0) {
              // Only add marker for days that are not Sunday (day 0)
              const squareColor = "HotPink" // Default marker color for days without events

              // Create the no-event marker and add it to the day cell bottom
              const noEventMarker = document.createElement("div")
              noEventMarker.className = "no-event-marker"
              noEventMarker.style.backgroundColor = squareColor

              dayCellBottom.appendChild(noEventMarker)
            }
          }}
        />
      </div>
      <style>
        {`
        .fc-daygrid-day-top {
  position: relative;
}

.fc-daygrid-day-bottom {
  position: relative !important;
}

.fc-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1px;
}

.fc-toolbar-chunk {
  flex: 1;
  text-align: center;
}

@media (max-width: 600px) {
  .fc-toolbar {
    flex-direction: column;
  }
  .fc-toolbar-chunk {
    text-align: center;
    margin: 1px 0;
  }
}

.square-marker {
  width: 10px;
  height: 10px;
  margin: 2px auto;
  border-radius: 2px;
  cursor: pointer;
  position: absolute;
  top: 30px;
  left: 80%;
  transform: translateX(-50%);
  background-color: #FFA500; /* Default marker color */
}

@media (max-width: 768px) {
  .square-marker {
    top: 30px;
    left: 70%;
  }
}

.time-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 90%;
  margin-top: 3px;
}

.time-display {
  font-size: 0.75rem;
  margin-left: 1px;
  text-align: left;
}

.no-event-marker {
  width: 10px;
  height: 10px;
  margin: 2px auto;
  border-radius: 2px;
  cursor: pointer;
  position: absolute;
  top: 30px;
  left: 80%;
  transform: translateX(-50%);
}

@media (max-width: 768px) {
  .time-display {
    display: none;
  }
}


.tippy-box[data-theme~="custom-tooltip"] {
  background-color: #007BFF;
  color: #fff;
  border-radius: 4px;
}

.tippy-box[data-theme~="custom-tooltip"] .tippy-arrow {
  color: #007BFF;
}

//    .fc-daygrid-day-top {
//   position: relative;
// }
//   .fc-daygrid-day-bottom {
//   position: relative!important;
//   }
//   .fc-toolbar {
//   display: flex;
//   flex-wrap: wrap; /* Allows wrapping on smaller screens */
//   align-items: center;
//   justify-content: space-between; /* Distribute space evenly */
//   gap: 1px; /* Add spacing between items */
// }
  

// .fc-toolbar-chunk {
//   flex: 1; /* Adjust to take up available space */
//   text-align: center;
// }

// @media (max-width: 600px) {
//   .fc-toolbar {
//     flex-direction: column; /* Stack items vertically */
//   }
//   .fc-toolbar-chunk {
//     text-align: center; /* Center text for better readability */
//     margin: 1px 0;
//   }
// }


// .square-marker {
//   width: 10px;
//   height: 10px;
//   margin: 2px auto;
//   border-radius: 2px;
//   cursor: pointer; /* Indicates interactivity */
//   position: absolute;
//   top:30px; /* Adjust spacing */
//   right: 10%;
//   transform: translateX(-50%);
//   background-color: ##FFA500; /* Default marker color */
// }

// @media (max-width: 768px) {
//   .square-marker {
//     top: 30px; /* Adjust for smaller screens */
//     left: 70%; /* Recalculate position */
//   }
// }


// .time-container {
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   width: 100%;
//   margin-top: 3px;
// }

// .time-display {
//   font-size: 0.75rem; /* Adjust size as needed */
//   margin-left: 10px;
//   text-align: left;
// }
//   .no-event-marker {
//  width: 10px;
//   height: 10px;
//   margin: 2px auto;
//   border-radius: 2px;
//   cursor: pointer; /* Indicates interactivity */
//   position: absolute;
//   top: 30px; /* Adjust spacing */
//   left: 80%;
//   transform: translateX(-50%);
  
// }
  
// @media (max-width: 768px) {
//   .time-display {
//     display: none;
//   }
// }

// .tippy-box[data-theme~="custom-tooltip"] {
//   background-color: #007BFF; /* Tooltip background color */
//   color: #fff; /* Tooltip text color */
//   border-radius: 4px;
// }

// .tippy-box[data-theme~="custom-tooltip"] .tippy-arrow {
//   color: #007BFF; /* Match tooltip arrow color to the background */
// }

  `}
      </style>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8  rounded-lg shadow-lg  sm:w-2/3 max-h-screen overflow-y-auto">
            {!attendance ? (
              <div>
                {/* Content for Leave Application */}
                <div className="flex justify-between mb-1">
                  <h2 className="text-xl font-bold">Leave Application</h2>
                  <button
                    onClick={handleAttendance}
                    className="bg-gradient-to-b from-blue-200 to-blue-400 px-2 rounded-xl hover:from-blue-400 hover:to-blue-600"
                  >
                    Attendance
                  </button>
                </div>
                <hr />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block mb-2">Leave Date</label>
                    <input
                      type="date"
                      name="startDate"
                      defaultValue={formData.startDate}
                      onChange={handleChange}
                      className="border p-2 rounded w-full"
                    />
                  </div>
                  {/* <div>
                    <label className="block mb-2">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      defaultValue={formData.endDate}
                      onChange={handleChange}
                      className="border p-2 rounded w-full"
                    />
                  </div> */}
                  <div>
                    <label className="block mb-2">Leave Type</label>
                    <select
                      name="leaveType"
                      defaultValue={formData.leaveType}
                      onChange={(e) => {
                        const { value } = e.target
                        setFormData((prev) => ({
                          ...prev,
                          leaveType: value,
                          halfDayPeriod: value === "Half Day" ? "Morning" : "" // Default to "Morning" for Half Day
                        }))
                      }}
                      className="border p-2 rounded w-full"
                    >
                      <option value="Full Day">Full Day</option>
                      <option value="Half Day">Half Day</option>
                    </select>
                  </div>
                  {formData.leaveType === "Half Day" && (
                    <div>
                      <label className="block mb-2">
                        Select Half Day Period
                      </label>
                      <select
                        name="halfDayPeriod"
                        defaultValue={formData.halfDayPeriod}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            halfDayPeriod: e.target.value
                          }))
                        }
                        className="border p-2 rounded w-full"
                      >
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                      </select>
                    </div>
                  )}
                  <div className="flex items-center ">
                    <input
                      type="checkbox"
                      name="onsite"
                      checked={formData.onsite}
                      onChange={handleOnsiteChange}
                      className="w-5 h-5"
                    />
                    <label className="ml-2 ">Onsite</label>
                  </div>
                </div>
                {isOnsite && (
                  <div className="mb-4">
                    <div className="overflow-x-auto ">
                      <table className=" border border-gray-200 text-center">
                        <thead>
                          <tr>
                            <th className="border px-8">Site Name</th>
                            <th className="border px-8 ">Place</th>
                            <th className="border px-8 ">Start</th>
                            <th className="border px-8">End</th>
                            <th className="border px-10 ">KM</th>
                            <th className="border px-10">TA</th>
                            <th className="border px-8">Food </th>
                            <th className="border px-8">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tableRows?.map((row, index) => (
                            <tr key={index}>
                              <td className="border p-2 w-60">
                                <input
                                  type="text"
                                  value={row.siteName}
                                  onChange={(e) => {
                                    const updatedRows = [...tableRows]
                                    updatedRows[index].siteName = e.target.value
                                    setTableRows(updatedRows)
                                  }}
                                  className="border p-1 rounded w-full"
                                />
                              </td>
                              <td className="border p-2 w-60">
                                <input
                                  type="text"
                                  value={row.place}
                                  onChange={(e) => {
                                    const updatedRows = [...tableRows]
                                    updatedRows[index].place = e.target.value
                                    setTableRows(updatedRows)
                                  }}
                                  className="border p-1 rounded w-full"
                                />
                              </td>
                              <td className="border p-2">
                                <input
                                  type="number"
                                  value={row.Start}
                                  onChange={(e) => {
                                    const updatedRows = [...tableRows]
                                    updatedRows[index].Start = e.target.value
                                    setTableRows(updatedRows)
                                  }}
                                  className="border p-1 rounded w-full"
                                />
                              </td>
                              <td className="border p-2 W-20">
                                <input
                                  type="number"
                                  value={row.End}
                                  onChange={(e) => {
                                    const updatedRows = [...tableRows]
                                    updatedRows[index].End = e.target.value
                                    setTableRows(updatedRows)
                                  }}
                                  className="border p-1 rounded w-full"
                                />
                              </td>
                              <td className="border p-2">
                                <input
                                  type="number"
                                  value={row.km}
                                  onChange={(e) => {
                                    const updatedRows = [...tableRows]
                                    updatedRows[index].km = e.target.value
                                    setTableRows(updatedRows)
                                  }}
                                  className="border p-1 rounded w-full"
                                />
                              </td>
                              <td className="border p-2">
                                <input
                                  type="number"
                                  value={row.kmExpense}
                                  onChange={(e) => {
                                    const updatedRows = [...tableRows]
                                    updatedRows[index].kmExpense =
                                      e.target.value
                                    setTableRows(updatedRows)
                                  }}
                                  className="border p-1 rounded w-full"
                                />
                              </td>
                              <td className="border p-2 w-28">
                                <input
                                  type="number"
                                  value={row.foodExpense}
                                  onChange={(e) => {
                                    const updatedRows = [...tableRows]
                                    updatedRows[index].foodExpense =
                                      e.target.value
                                    setTableRows(updatedRows)
                                  }}
                                  className="border p-1 rounded w-full"
                                />
                              </td>
                              <td className="border p-2">
                                <button
                                  onClick={() => {
                                    const updatedRows = [...tableRows]
                                    updatedRows.splice(index, 1)
                                    setTableRows(updatedRows)
                                  }}
                                  className="text-red-500"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button
                      onClick={addRow}
                      className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                      Add Row
                    </button>
                    <div>
                      <div className="mb-4">
                        <label className="block mb-2">Description</label>
                        <textarea
                          name="description"
                          defaultValue={formData.description}
                          onChange={handleChange}
                          rows="4"
                          className="border p-2 rounded w-full"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                )}

                {!isOnsite && (
                  <div className="mb-4">
                    <label className="block mb-2">Reason</label>
                    <textarea
                      name="reason"
                      defaultValue={formData.reason}
                      onChange={handleChange}
                      rows="4"
                      className="border p-2 rounded w-full"
                    ></textarea>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  {!formData.eventId && (
                    <button
                      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                      onClick={handleApply}
                    >
                      Apply
                    </button>
                  )}
                  {formData.eventId && (
                    <button
                      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                      onClick={() => handleUpdate(formData)}
                    >
                      Update
                    </button>
                  )}
                  <button
                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                    onClick={() => {
                      setFormData({
                        description: "",
                        onsite: false,
                        halfDayPeriod: "",
                        leaveType: "Full Day"
                      })
                      setTableRows([{}])
                      setShowModal(false)
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-1">
                {/* Content for Attendance */}
                <div className="flex justify-between mb-1">
                  <h2 className="text-xl font-bold">Attendance</h2>
                  <button
                    onClick={handleAttendance}
                    className="bg-gradient-to-b from-blue-200 to-blue-400 px-1 rounded-xl hover:from-blue-400 hover:to-blue-600"
                  >
                    Leave Application
                  </button>
                </div>
                <hr />
                {/* You can add your attendance-related content here */}
                <div className="attendance-content mt-2 justify-center">
                  <p className="text-gray-500">
                    {new Date(formData.startDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })}
                  </p>
                  <form className="grid grid-cols-2 ">
                    {/* Start Time */}
                    <div className="grid ">
                      <label htmlFor="startTime" className="font-bold mb-1">
                        In Time
                      </label>
                      <div className="flex">
                        <select
                          id="hours"
                          name="hours"
                          value={selectedAttendance.inTime.hours}
                          onChange={(e) =>
                            handleTimeChange("inTime", "hours", e.target.value)
                          }
                          className="border border-gray-300 py-1 px-1 rounded"
                        >
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {String(i + 1).padStart(2, "0")}
                            </option>
                          ))}
                        </select>

                        <select
                          id="minutes"
                          name="minutes"
                          value={selectedAttendance.inTime.minutes}
                          onChange={(e) =>
                            handleTimeChange(
                              "inTime",
                              "minutes",
                              e.target.value
                            )
                          }
                          className="border border-gray-300 py-1 px-1 rounded"
                        >
                          {Array.from({ length: 60 }, (_, i) => (
                            <option key={i} value={i}>
                              {String(i).padStart(2, "0")}
                            </option>
                          ))}
                        </select>

                        <select
                          id="amPm"
                          name="amPm"
                          // value={selectedAttendance.amPm}
                          onChange={(e) =>
                            handleTimeChange("inTime", "amPm", e.target.value)
                          }
                          className="border border-gray-300 py-1 px-1 rounded"
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                    </div>
                    {/* End Time */}
                    <div className="grid ">
                      <label
                        htmlFor="endTime"
                        className="font-bold mb-1 justify-self-end"
                      >
                        Out Time
                      </label>
                      <div className=" flex justify-end">
                        <select
                          id="hours"
                          name="hours"
                          value={selectedAttendance.outTime.hours}
                          onChange={(e) =>
                            handleTimeChange("outTime", "hours", e.target.value)
                          }
                          className="border border-gray-300 py-1 px-1 rounded"
                        >
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {String(i + 1).padStart(2, "0")}
                            </option>
                          ))}
                        </select>

                        <select
                          id="minutes"
                          name="minutes"
                          value={selectedAttendance.outTime.minutes}
                          onChange={(e) =>
                            handleTimeChange(
                              "outTime",
                              "minutes",
                              e.target.value
                            )
                          }
                          className="border border-gray-300 py-1 px-1 rounded"
                        >
                          {Array.from({ length: 60 }, (_, i) => (
                            <option key={i} value={i}>
                              {String(i).padStart(2, "0")}
                            </option>
                          ))}
                        </select>

                        <select
                          id="amPm"
                          name="amPm"
                          value={selectedAttendance.outTime.amPm}
                          onChange={(e) =>
                            handleTimeChange("outTime", "amPm", e.target.value)
                          }
                          className="border border-gray-300 py-1 px-1 rounded"
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-span-2 gap-4 flex justify-center">
                      <button
                        className="bg-gradient-to-b from-blue-400 to-blue-500 px-3 py-1 hover:from-blue-400 hover:to-blue-600 text-white rounded"
                        onClick={handleApplyAttendance}
                      >
                        Submit
                      </button>
                      <button
                        className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                        onClick={() => {
                          setFormData({
                            description: "",
                            onsite: false,
                            halfDayPeriod: "",
                            leaveType: "Full Day"
                          })
                          setselectedAttendance({
                            attendanceDate: "",
                            intTime: "",
                            onTime: ""
                          })
                          setAttendance(false)
                          setShowModal(false)
                        }}
                      >
                        Cancel
                      </button>
                    </div>{" "}
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersLeaveApplicationSummary
