import React, { useEffect, useState } from "react"
import tippy from "tippy.js"
import UseFetch from "../../hooks/useFetch"
import api from "../../api/api"
import "tippy.js/dist/tippy.css"
import debounce from "lodash.debounce"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"

function LeaveApplication() {
  const [events, setEvents] = useState([])
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
  const [selectattendance, setselectAttendance] = useState({
    attendanceDate: "",
    inTime: "",
    outTime: ""
  })
  const [attendance, setAttendance] = useState(false)

  const [isOnsite, setIsOnsite] = useState(false)

  const [widthState, setWidthState] = useState("w-5/6")
  const [tableRows, setTableRows] = useState([])
  const [existingEvent, setexistingEvent] = useState([])
  const [clickedDate, setclickedDate] = useState(null)
  const userData = localStorage.getItem("user")
  const user = JSON.parse(userData)
  const { data: leaves, refreshHook } = UseFetch(
    `/auth/getallLeave?userid=${user._id}`
  )
  const { data: attendee } = UseFetch(
    `/auth/getallAttendance?userid=${user._id}`
  )
  console.log(attendee)
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
  console.log(t)
  useEffect(() => {
    if (leaves) {
      const formattedEvents = formatEventData(leaves)
      setIn("10.20")
      setEvents(formattedEvents)
    }
  }, [leaves])
  const formatEventData = (events) => {
    return events.map((event) => {
      const date = new Date(event.leaveDate) // Convert to Date object
      const formattedDate = date.toISOString().split("T")[0] // Format as YYYY-MM-DD
      // Determine classNames based on conditions
      let classNames = "unverified-event" // Default class
      if (event.cancelstatus) {
        classNames = "cancel-status"
      } else if (event.hrstatus === "HR Rejected") {
        classNames = "hr-rejected"
      } else if (
        event.adminverified &&
        event.hrstatus === "HR/Onsite Approved"
      ) {
        classNames = "fully-verified-event"
      } else if (event.departmentstatus === "Dept Rejected") {
        classNames = "dept-rejected"
      } else if (
        event.departmentverified &&
        event.departmentstatus === "Dept Approved"
      ) {
        classNames = "dept-approved-event"
      } else if (event.onsite && event.hrstatus === "HR/Onsite Approved") {
        classNames = "onsite-approved-event"
      } else if (event.onsite) {
        classNames = "onsite-pending-event"
      }
      return {
        id: event._id,
        // title: event.leaveType, // Display leave type as the title
        start: formattedDate, // Use formatted date,
        onsite: event?.onsite,
        onsitestatus: event?.onsitestatus,
        onsiteData: event?.onsiteData,
        extendedProps: {
          reason: event?.onsite ? event?.description : event?.reason
        },
        classNames,
        allDay: true // Since the events are all-day
      }
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
  const handleDateClick = (arg) => {
    const clickedDate = arg.dateStr
    setclickedDate(clickedDate)

    // Check if there's already an event on this date
    const existingEvent = events.find((event) => event.start === clickedDate)

    setexistingEvent(existingEvent)

    if (existingEvent) {
      // If an event exists, set the form data to edit the event
      setFormData({
        ...formData,
        startDate: existingEvent.start,
        endDate: existingEvent.start, // Assuming single-day events for simplicity
        leaveType: existingEvent.title,
        onsite: existingEvent.onsite,
        [existingEvent.onsite ? "description" : "reason"]:
          existingEvent.extendedProps.reason,
        eventId: existingEvent.id // Store the event ID for editing
      })
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

  //   const handleUpdate = async (id, updatedData) => {
  //     try {
  //       const response = await fetch(`/api/leaves/${id}`, {
  //         method: "PUT",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(updatedData)
  //       })
  //       const result = await response.json()
  //       setEvents(events.map((event) => (event._id === id ? result : event)))
  //       setShowModal(false)
  //     } catch (error) {
  //       console.error("Error updating leave:", error)
  //     }
  //   }
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
  const selectAttendance = (e) => {
    const { name, value } = e.target
    setselectAttendance((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

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

  const handleAttendance = () => {
    setAttendance(!attendance)
    setselectAttendance((prevState) => ({
      ...prevState,
      attendanceDate: formData.startDate
    }))
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
  console.log(selectattendance)
  const handleApplyAttendance = async () => {
    const response = await fetch(
      `http://localhost:9000/api/auth/attendance?selectedid=${user._id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(selectattendance),
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
      attendanceDate: "",
      inTime: "",
      outTime: ""
    }))
  }

  return (
    <div className=" p-2">
      <div className="calendar-header flex flex-wrap justify-center gap-4">
        {/* Attendance */}
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 bg-green-500 "></div>
          <span className="text-sm md:text-base">P</span>
        </div>

        {/* Leave */}
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 bg-red-500 "></div>
          <span className="text-sm md:text-base">L</span>
        </div>

        {/* Pending */}
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 bg-orange-500 "></div>
          <span className="text-sm md:text-base">Pending</span>
        </div>

        {/* Not Selected */}
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 bg-pink-500 "></div>
          <span className="text-sm md:text-base">Not selected</span>
        </div>
      </div>

      <div className="w-full ">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          // events={events}
          dateClick={handleDateClick}
          selectable={true}
          // height="80vh"
          height="auto"
          // eventContent={renderEventContent}
          dayCellDidMount={(info) => {
            // Example: Show "In" and "Out" times for specific dates
            const matchingEvent = events.find(
              (event) => event.start === info.date.toISOString().split("T")[0]
            )

            if (matchingEvent) {
              const inTime = "10.30" || "-"
              const outTime = "5.30" || "-"

              const timeContainer = document.createElement("div")
              timeContainer.innerHTML = `<small>In: ${inTime}<br>Out: ${outTime}</small>`
              info.el.appendChild(timeContainer)
            }
          }}
          eventDidMount={(info) => {
            tippy(info.el, {
              content: info.event.extendedProps.reason, // Show reason as tooltip content
              theme: "custom-tooltip",
              placement: "top" // Tooltip position
            })
          }}
        />
      </div>
      <style>
        {`

          .fc-daygrid-day-top{
          position: relative;
        }


 

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.
button {
  margin-right: 10px;
}
  .tippy-box[data-theme~='custom-tooltip'] {
  background-color: #007BFF;  /* Set background color */
  color: #fff;  /* Set text color */
  border-radius: 4px;
}

.tippy-box[data-theme~='custom-tooltip'] .tippy-arrow {
  color: #007BFF ;  /* Match the arrow color to the background */
}



        `}
      </style>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8  rounded-lg shadow-lg  sm:w-5/6 max-h-screen overflow-y-auto">
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
                    <label className="block mb-2">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      defaultValue={formData.startDate}
                      onChange={handleChange}
                      className="border p-2 rounded w-full"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      defaultValue={formData.endDate}
                      onChange={handleChange}
                      className="border p-2 rounded w-full"
                    />
                  </div>
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
              <div className="p-3">
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
                  <form className="grid grid-cols-2 gap-4">
                    {/* Start Time */}
                    <div className="grid ">
                      <label htmlFor="startTime" className="font-bold mb-1">
                        In Time
                      </label>
                      <input
                        type="time"
                        id="inTime"
                        name="inTime"
                        value={attendance.inTime}
                        onChange={selectAttendance}
                        className="border border-gray-300 py-1 px-2 sm:w-2/5 rounded justify-end"
                      />
                    </div>
                    {/* End Time */}
                    <div className="grid ">
                      <label
                        htmlFor="endTime"
                        className="font-bold mb-1 justify-self-end"
                      >
                        Out Time
                      </label>
                      <input
                        type="time"
                        id="outTime"
                        name="outTime"
                        value={attendance.outTime}
                        onChange={selectAttendance}
                        className="border border-gray-300 py-1 px-2 sm:w-2/5 rounded  justify-self-end"
                      />
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <button
                        className="bg-gradient-to-b from-blue-400 to-blue-500 px-3 py-1 hover:from-blue-400 hover:to-blue-600 text-white rounded"
                        onClick={handleApplyAttendance}
                      >
                        Submit
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

export default LeaveApplication
