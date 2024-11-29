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

  const [isOnsite, setIsOnsite] = useState(formData.onsite)
  const [tableRows, setTableRows] = useState([])
  const [existingEvent, setexistingEvent] = useState([])
  const [clickedDate, setclickedDate] = useState(null)
  const userData = localStorage.getItem("user")
  const user = JSON.parse(userData)
  const { data: leaves, refreshHook } = UseFetch(
    `/auth/getallLeave?userid=${user._id}`
  )
  useEffect(() => {
    if (!showModal) {
      setIsOnsite(false)
    }
  }, [showModal])
  useEffect(() => {
    if (formData.onsite && clickedDate) {
      // Find the event that matches the clicked date
      const existingEvent = events.find((event) => event.start === clickedDate)

      // If a matching event is found and it has onsite data
      if (existingEvent && existingEvent.onsitestatus) {
        const matchedOnsiteData = existingEvent.onsitestatus[0].map(
          (status) => ({
            siteName: status.siteName,
            place: status.place,
            Start: status.Start,
            End: status.End,
            km: status.km,
            kmExpense: status.kmExpense,
            foodExpense: status.foodExpense
          })
        )

        // Now set the table rows with the matched onsite data and an empty row for new input
        setTableRows(matchedOnsiteData)
      }
    }
  }, [isOnsite, clickedDate])

  useEffect(() => {
    if (leaves) {
      const formattedEvents = formatEventData(leaves)

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
        title: event.leaveType, // Display leave type as the title
        start: formattedDate, // Use formatted date,
        onsite: event?.onsite,
        onsitestatus: event?.onsitestatus,
        extendedProps: {
          reason: event.onsite ? event.description : event.reason
        },
        classNames,
        allDay: true // Since the events are all-day
      }
    })
  }
  // const formatEventData = (events) => {

  const labels = [
    {
      title: "Half Day",
      className: "bg-gradient-to-r from-red-400 to-red-600"
    },
    {
      title: "Full Day",
      className: "bg-gradient-to-r from-blue-400 to-blue-600"
    },
    {
      title: "Onsite",
      className: "bg-gradient-to-r from-green-400 to-green-600"
    },
    {
      title: "Cancel Request",
      className: "bg-gradient-to-r from-yellow-400 to-yellow-600"
    },
    {
      title: "Cancelled",
      className: "bg-gradient-to-r from-gray-400 to-gray-600"
    },
    {
      title: "Onsite",
      className: "bg-gradient-to-r from-purple-400 to-purple-600"
    }
  ]

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
    if (existingEvent) {
      handleOnsiteChange()
    }
    setexistingEvent(existingEvent)

    if (existingEvent) {
      // If an event exists, set the form data to edit the event
      setFormData({
        ...formData,
        startDate: existingEvent.start,
        endDate: existingEvent.start, // Assuming single-day events for simplicity
        leaveType: existingEvent.title,
        onsite: existingEvent.onsite,
        reason: existingEvent.extendedProps.reason,
        eventId: existingEvent.id // Store the event ID for editing
      })
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

  const handleEventClick = (arg) => {
    console.log(arg)
  }

  const handleInputChange = debounce((e) => {
    const { name, value, type, checked } = e.target

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    })
  }, 300)

  const handleChange = (e) => handleInputChange(e)

  const handleApply = async () => {
    try {
      if (formData.onsite) {
        const response = await api.post(
          `http://localhost:9000/api/auth/onsiteLeave?Userid=${user._id}`,
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
        const response = await fetch(
          `http://localhost:9000/api/auth/leave?Userid=${user._id}`,
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

  return (
    <div className="flex p-8">
      <div className="mr-8 w-5/6">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          dateClick={handleDateClick}
          selectable={true}
          height="80vh"
          eventDidMount={(info) => {
            tippy(info.el, {
              content: info.event.extendedProps.reason, // Show reason as tooltip content
              theme: "custom-tooltip",
              placement: "top" // Tooltip position
            })
          }}
          eventClassNames={({ event }) => {
            return event.classNames || "default-event-class"
            // return event.classNames ? event.classNames : "my-custom-event-class"
          }}
          // eventClassNames={() => "my-custom-event-class"}
        />
      </div>
      <style>
        {`
.cancel-status {
  background:linear-gradient(to right, #ffeb3b, #ff9800) !important; /* user cancelled leave */
  color: white;
  // width: 100%;
  // height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border:none;
}
  .hr-rejected {
  background: linear-gradient(to right, #22d3ee, #06b6d4)!important; /*hr rejected leave*/
  color: white;
  // width: 100%;
  // height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border:none;
}
.fully-verified-event {
  background: linear-gradient(to right, #34d399, #16a34a) !important; /* Green for HR verified */
  color: white;
  // width: 100%;
  // height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border:none;
}
  .dept-rejected {
  background: linear-gradient(to right, #9ca3af, #4b5563)!important; /*dept. rejected leave*/
  color: white;
  // width: 100%;
  // height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border:none;
}
  
  .dept-approved-event {
  background: linear-gradient(to right, #60a5fa, #2563eb); !important; /* blue for department verified */
  color: white;
  // width: 100%;
  // height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border:none;
}
   .onsite-approved-event {
  background: 'linear-gradient(to right, #9b4de2, #6b21a8); !important; /* onsite verified */
  color: white;
  // width: 100%;
  // height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border:none;
}
   .onsite-pending-event {
  background: linear-gradient(to right, #fb923c, #ea580c)!important; /* orange for unverified onsite*/
  color: white !important;
  // width: %;
  // height: %;
  display: flex;
  justify-content: center;
  align-items: center;
  border:none;
}
.unverified-event {
  background: linear-gradient(to right, #ff4d4d, #ff0000)!important; /* Red for unverified */
  color: white !important;
  // width: %;
  // height: %;
  display: flex;
  justify-content: center;
  align-items: center;
  border:none;
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

      <div className="flex flex-col space-y-2 w-1/6   pt-[65px]">
        <label className="bg-gradient-to-r from-red-400 to-red-600 py-1 rounded-md shadow-xl transform hover:scale-105 transition duration-300 px-4">
          Pending
        </label>
        <label className="bg-gradient-to-r from-blue-400 to-blue-600 py-1 rounded-md shadow-xl transform hover:scale-105 transition duration-300 px-4">
          Dept. Approved
        </label>
        <label className="bg-gradient-to-r from-gray-400 to-gray-600 py-1 rounded-md shadow-xl transform hover:scale-105 transition duration-300 px-4">
          Dpt.Rejected
        </label>
        <label className="bg-gradient-to-r from-green-400 to-green-600 py-1 rounded-md shadow-xl transform hover:scale-105 transition duration-300 px-4">
          HR/Onsite Approved
        </label>
        <label className="bg-gradient-to-r from-cyan-400 to-cyan-600 py-1 rounded-md shadow-xl transform hover:scale-105 transition duration-300 px-4">
          Hr Rejected
        </label>

        <label className="bg-gradient-to-r from-yellow-400 to-yellow-600 py-1 rounded-md shadow-xl transform hover:scale-105 transition duration-300 px-4">
          Cancel Request
        </label>

        <label className="bg-gradient-to-r from-purple-400 to-purple-600 py-1 rounded-md shadow-xl transform hover:scale-105 transition duration-300 px-4">
          Onsite Approval
        </label>
        <label className="bg-gradient-to-r from-orange-400 to-orange-600 py-1 rounded-md shadow-xl transform hover:scale-105 transition duration-300 px-4">
          Onsite Pending
        </label>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-5/6 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Leave Application</h2>
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
                  // value={formData.leaveType}
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
                  <label className="block mb-2">Select Half Day Period</label>
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
                  // onChange={handleInputChange}
                  className="w-5 h-5"
                />
                <label className="ml-2 ">Onsite</label>
              </div>
            </div>

            {isOnsite && (
              <div className="mb-4">
                <table className="min-w-full border border-gray-200 text-center">
                  <thead>
                    <tr>
                      <th className="border p-2">Site Name</th>
                      <th className="border p-2 ">Place</th>
                      <th className="border p-2 ">Start</th>
                      <th className="border p-2 ">End</th>
                      <th className="border py-2 ">KM</th>
                      <th className="border p-2">TA</th>
                      <th className="border p-2">Food </th>
                      <th className="border p-2">Actions</th>
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
                        {/* <td className="border p-2 w-52">
                          <select
                            value={row.place}
                            onChange={(e) =>
                              handleDropdownChange(index, e.target.value)
                            }
                            className="border p-1 rounded w-full"
                          >
                            <option value="Place1">Place1</option>
                            <option value="Place2">Place2</option>
                            
                          </select>
                        </td> */}
                        <td className="border p-2 ">
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
                        <td className="border p-2 W-20 ">
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
                        <td className="border p-2 ">
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
                        <td className="border p-2  ">
                          <input
                            type="number"
                            value={row.kmExpense}
                            onChange={(e) => {
                              const updatedRows = [...tableRows]
                              updatedRows[index].kmExpense = e.target.value
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
                              updatedRows[index].foodExpense = e.target.value
                              setTableRows(updatedRows)
                            }}
                            className="border p-1 rounded w-full"
                          />
                        </td>
                        <td className="border p-2 ">
                          <button
                            onClick={() => {
                              const updatedRows = [...tableRows]
                              updatedRows.splice(index, 1)
                              setTableRows(updatedRows)
                            }}
                            className="text-red-500 "
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                      // value={formData.description}
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
                  // value={formData.reason}
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

              {/* <button
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                onClick={() => handleDelete(selectedEventId)}
              >
                Delete
              </button> */}
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LeaveApplication
