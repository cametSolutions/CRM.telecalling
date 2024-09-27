import React, { useEffect, useState } from "react"
import tippy from "tippy.js"
import UseFetch from "../../hooks/useFetch"
import "tippy.js/dist/tippy.css"

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
    onsite: false,
    reason: ""
  })
  const [isOnsite, setIsOnsite] = useState(formData.onsite)
  const [tableRows, setTableRows] = useState([])

  const userData = localStorage.getItem("user")
  const user = JSON.parse(userData)
  const { data: leaves, refreshHook } = UseFetch(
    `/auth/getallLeave?userid=${user._id}`
  )
  const formatEventData = (events) => {
    return events.map((event) => ({
      id: event._id,
      title: event.leaveType, // Display leave type as the title
      start: event.startDate.split("T")[0], // Convert to YYYY-MM-DD format
      end: event.endDate.split("T")[0], // Convert to YYYY-MM-DD format
      extendedProps: {
        reason: event.reason
      },
      classNames: event.verified ? "verified-event" : "unverified-event",
      allDay: true // Since the events are all-day
    }))
  }
  useEffect(() => {
    if (leaves) {
      const formattedEvents = formatEventData(leaves)
      setEvents(formattedEvents)
    }
  }, [leaves])

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
    // Set the start date to the clicked date and open the modal
    setFormData({
      ...formData,
      startDate: arg.dateStr,
      endDate: arg.dateStr
    })
    setShowModal(true)
  }
  const handleUpdate = async (eventId, updatedData) => {
    try {
      // Assuming you have an API endpoint for updating leave requests
      const response = await fetch(`/api/leave/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedData)
      })

      if (!response.ok) {
        throw new Error("Failed to update leave request")
      }

      // Update the event in the calendar (simplified example)
      setEvents(
        events.map((event) =>
          event.id === eventId ? { ...event, ...updatedData } : event
        )
      )

      // Close the modal
      setShowModal(false)
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    })
  }
  const handleApply = async () => {
    try {
      let updatedData = { ...formData, userid: user._id }

      // Assuming you have an API endpoint for creating leave requests
      const response = await fetch("https://www.crm.camet.in/api/auth/leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedData)
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error("Failed to apply for leave")
      }

      // Update calendar with new event (simplified example)
      const newEvent = {
        title: responseData.data.leaveType,

        start: responseData.data.startDate,
        end: responseData.data.endDate,
        extendedProps: {
          reason: responseData.data.reason // Store the reason in extendedProps
        },
        classNames: responseData.data.verified
          ? "verified-event"
          : "unverified-event",
        allDay: true
      }
      setEvents([...events, newEvent])
      setShowModal(false)

      // Close the modal
      setShowModal(false)
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

.verified-event {
  background: linear-gradient(to right, #34d399, #16a34a) !important; /* Green for verified */
  color: white;
  // width: 100%;
  // height: 100%;
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
        <label className="bg-gradient-to-r from-green-400 to-green-600 py-1 rounded-md shadow-xl transform hover:scale-105 transition duration-300 px-4">
          HR/Onsite Approved
        </label>
        <label className="bg-gradient-to-r from-yellow-400 to-yellow-600 py-1 rounded-md shadow-xl transform hover:scale-105 transition duration-300 px-4">
          Cancel Request
        </label>
        <label className="bg-gradient-to-r from-gray-400 to-gray-600 py-1 rounded-md shadow-xl transform hover:scale-105 transition duration-300 px-4">
          Cancelled
        </label>
        <label className="bg-gradient-to-r from-purple-400 to-purple-600 py-1 rounded-md shadow-xl transform hover:scale-105 transition duration-300 px-4">
          Onsite
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
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block mb-2">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block mb-2">Leave Type</label>
                <select
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full"
                >
                  <option value="Full Day">Full Day</option>
                  <option value="Half Day">Half Day</option>
                </select>
              </div>
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
                    {tableRows.map((row, index) => (
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
                        <td className="border p-2 w-52">
                          <select
                            value={row.place}
                            onChange={(e) =>
                              handleDropdownChange(index, e.target.value)
                            }
                            className="border p-1 rounded w-full"
                          >
                            <option value="Place1">Place1</option>
                            <option value="Place2">Place2</option>
                            {/* Add more options as needed */}
                          </select>
                        </td>
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
              </div>
            )}
            <div className="mb-4">
              <label className="block mb-2">Reason</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                rows="4"
                className="border p-2 rounded w-full"
              ></textarea>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                onClick={handleApply}
              >
                Apply
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                onClick={() => handleUpdate(selectedEventId, formData)}
              >
                Update
              </button>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                onClick={() => handleDelete(selectedEventId)}
              >
                Delete
              </button>
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
