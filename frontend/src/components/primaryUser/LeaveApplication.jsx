import React, { useEffect, useState } from "react";
import tippy from "tippy.js";
import UseFetch from "../../hooks/useFetch";
import api from "../../api/api";
import "tippy.js/dist/tippy.css";
import debounce from "lodash.debounce";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "tippy.js/themes/light.css"; // Example for light theme

function LeaveApplication() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [t, setIn] = useState(null);
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    leaveType: "Full Day",
    halfDayPeriod: "",
    onsite: false,
    reason: "",
    description: "",
    eventId: null,
  });

  const [isOnsite, setIsOnsite] = useState(false);
  const [attendance, setAttendance] = useState(false);
  const [widthState, setWidthState] = useState("w-5/6");
  const [tableRows, setTableRows] = useState([]);
  const [existingEvent, setexistingEvent] = useState([]);
  const [clickedDate, setclickedDate] = useState(null);
  const userData = localStorage.getItem("user");
  const user = JSON.parse(userData);

  const { data: leaves, refreshHook } = UseFetch(
    `/auth/getallLeave?userid=${user._id}`
  );
  const { data: attendee } = UseFetch(
    `/auth/getallAttendance?userid=${user._id}`
  );

  useEffect(() => {
    if (leaves && attendee) {
      console.log(leaves);
      console.log(attendee);
      const formattedEvents = formatEventData(leaves);

      let attendaceDetails;
      if (formattedEvents.length > 0) {
        attendaceDetails = attendee.map((item) => {
          let dayObject = {
            start: "",
            reason: "No leave today",
            inTime: "On Leave",
            outTime: "On Leave",
            color: "green",
          };
          const fdate = new Date(item.attendanceDate); // Convert to Date object

          let date = fdate.toISOString().split("T")[0];
          let existingDate = formattedEvents.find((event) => {
            return event.start === date;
          });
          if (existingDate) {
            dayObject.start = existingDate?.start;
            dayObject.reason = existingDate?.reason;
            dayObject.inTime = item?.inTime;
            dayObject.outTime = item?.outTime;
            dayObject.color = existingDate.color;
            formattedEvents.filter((item) => item.start !== date);
            return dayObject;
          } else {
            dayObject.start = date;
            dayObject.inTime = item?.inTime;
            dayObject.outTime = item?.outTime;
            console.log(dayObject)
            return dayObject;
          }

        });
      }
      console.log(attendaceDetails);
      console.log(formattedEvents)
      setIn("10.20");
      setEvents( [...formattedEvents , ...attendaceDetails]);
    }
  }, [leaves, attendee]);

  console.log(events)
  useEffect(() => {
    if (!showModal) {
      setIsOnsite(false);
    }
  }, [showModal]);
  useEffect(() => {
    if (isOnsite && clickedDate) {
      // Find the event that matches the clicked date
      const existingEvent = events.find((event) => event.start === clickedDate);

      // If a matching event is found and it has onsite data
      if (existingEvent && existingEvent.onsitestatus) {
        const matchedOnsiteData = existingEvent.onsiteData[0].map((status) => ({
          siteName: status.siteName,
          place: status.place,
          Start: status.Start,
          End: status.End,
          km: status.km,
          kmExpense: status.kmExpense,
          foodExpense: status.foodExpense,
        }));

        // Now set the table rows with the matched onsite data and an empty row for new input
        setTableRows(matchedOnsiteData);
      }
    }
  }, [isOnsite, clickedDate]);
  console.log(t);
  const formatEventData = (events) => {
    return events.map((event) => {
      console.log(event);
      const date = new Date(event.leaveDate); // Convert to Date object
      const formattedDate = date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
      console.log(formattedDate);
      let dayObject = {
        start: "",
        reason: "No leave today",
        inTime: "On Leave",
        outTime: "On Leave",
        color: "",
      };
      if (formattedDate) {
        dayObject.start = formattedDate;
      }
      if (event.adminverified) {
        dayObject.color = "green";
      } else if (event.inTime) {
        dayObject.inTime = event.inTime;
      } else {
        dayObject.color = "red";
      }
      return dayObject;
    });
  };

  const handleOnsiteChange = () => {
    setIsOnsite(!isOnsite);

    setFormData({
      ...formData,
      onsite: !formData.onsite,
    });
  };

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
        foodExpense: "",
      },
    ]);
  };

  const handleDropdownChange = (index, value) => {
    const updatedRows = [...tableRows];
    updatedRows[index].place = value;
    setTableRows(updatedRows);
  };
  const handleDateClick = (arg) => {
    console.log(arg);
    const clickedDate = arg.dateStr;
    setclickedDate(clickedDate);

    // Check if there's already an event on this date
    const existingEvent = events.find((event) => event.start === clickedDate);

    setexistingEvent(existingEvent);

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
        eventId: existingEvent.id, // Store the event ID for editing
      });
      if (existingEvent.onsite) {
        setIsOnsite(true);
      }
    } else {
      setFormData({
        ...formData,
        startDate: arg.dateStr,
        endDate: arg.dateStr,
        leaveType: "Full Day",
        reason: "",
        eventId: null,
      });
    }

    setShowModal(true);
  };
  const handleUpdate = async (updatedData) => {
    try {
      const eventId = formData.eventId;

      // Assuming you have an API endpoint for updating leave requests
      const response = await api.put(`/auth/updateLeave?userId=${eventId}`, {
        updatedData,
      });
      if (response.status === 200) {
        // Close the modal
        setShowModal(false);
        refreshHook();
      }
    } catch (error) {
      console.error("Error updating leave request:", error);
    }
  };

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
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete leave request");
      }

      // Remove the event from the calendar (simplified example)
      setEvents(events.filter((event) => event.id !== eventId));

      // Close the modal
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting leave request:", error);
    }
  };

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
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  }, 300);

  const handleChange = (e) => handleInputChange(e);
  const renderEventContent = (eventInfo) => {
    return (
      <></>
      //   <div
      //   style={{
      //     position: "absolute", // Enables child element positioning
      //     width: "100%",
      //     height: "100%"
      //   }}
      // >
      //   {/* In and Out Times - Top Left */}
      //   <div
      //     // style={{
      //     //   position: "absolute", // Position relative to the parent
      //     //   top: "5%", // Adjust for spacing from the top
      //     //   left: "5%", // Adjust for spacing from the left
      //     //   color: "black",
      //     //   fontSize: "0.9em", // Ensure text fits within the cell
      //     //   lineHeight: "1.2" // Adjust for compact spacing
      //     // }}
      //   >
      //     <span className="text-black font-bold mt-4">{`In: ${eventInfo?.event?.extendedProps?.inTime || "-"}`}</span>
      //     <br />
      //     <span  className="text-black font-bold" >{`Out: ${eventInfo?.event?.extendedProps?.outTime || "-"}`}</span>
      //   </div>

      //   {/* Square Indicator - Bottom Right */}
      //   <span className="mt-6"
      //     style={{
      //       position: "absolute", // Position relative to the parent
      //       top:"50%",
      //       bottom: "5%", // Adjust for spacing from the bottom
      //       right: "5%", // Adjust for spacing from the right
      //       width: "10px", // Size of the square
      //       height: "10px",
      //       backgroundColor: getColorFromClassName(
      //         eventInfo?.event?.classNames[0]
      //       )
      //     }}
      //   ></span>
      // </div>

      // <div
      //   className="event-content"
      //   style={{
      //     position: "relative", // Enable positioning for children
      //     width: "100%",
      //     height: "100%"
      //   }}
      // >
      //   {/* In and Out Times - Top Left */}
      //   <div
      //     style={{
      //       position: "absolute", // Position within the parent
      //       bottom: "5%", // Adjust for spacing from the top
      //       left: "3%", // Adjust for spacing from the left
      //       color: "black",
      //       fontSize: "0.8em" // Adjust text size for better fit in cells
      //     }}
      //   >
      //     <span>{`In: ${eventInfo?.event?.extendedProps?.inTime || "-"}`}</span>
      //     <br />
      //     <span>{`Out: ${
      //       eventInfo?.event?.extendedProps?.outTime || "-"
      //     }`}</span>
      //   </div>

      //   {/* Square Indicator - Bottom Right */}
      //   <span
      //     style={{
      //       position: "absolute", // Position within the parent
      //       top: "50%",
      //       bottom: "5%", // Adjust for spacing from the bottom
      //       right: "1%", // Adjust for spacing from the right
      //       display: "inline-block",
      //       width: "8px", // Reduced size for better fit in small cells
      //       height: "8px",
      //       backgroundColor: getColorFromClassName(
      //         eventInfo?.event?.classNames[0]
      //       )
      //     }}
      //   ></span>
      // </div>

      // <div
      //   className="event-content"
      //   style={{
      //     position: "relative", // Enable positioning for children
      //     width: "100%",
      //     height: "100%"
      //   }}
      // >
      //   {/* In and Out Times - Top Left */}
      //   <div
      //     style={{
      //       position: "absolute", // Position within the parent
      //       bottom: "0vw", // Adjust for spacing from the top
      //       left: "vw", // Adjust for spacing from the left
      //       color: "black" // Ensure text is visible
      //     }}
      //   >
      //     <span>{`In: ${eventInfo?.event?.extendedProps?.inTime || "-"}`}</span>
      //     <br />
      //     <span>{`Out: ${
      //       eventInfo?.event?.extendedProps?.outTime || "-"
      //     }`}</span>
      //   </div>

      //   {/* Square Indicator - Bottom Right */}
      //   <span
      //     style={{
      //       position: "absolute", // Position within the parent
      //       top: "4vw", // Adjust for spacing from the bottom
      //       right: "1vw", // Adjust for spacing from the right
      //       display: "inline-block",
      //       width: "10px",
      //       height: "10px",
      //       backgroundColor: getColorFromClassName(
      //         eventInfo?.event?.classNames[0]
      //       )
      //     }}
      //   ></span>
      // </div>
    );
  };

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
      "onsite-pending-event": "#ff9900",
    };
    return colorMap[className] || "#cccccc"; // Default to grey if className is not mapped
  };

  const handleAttendance = () => {
    setAttendance(!attendance);
    setWidthState(widthState === "w-5/6" ? "w-2/6" : "w-5/6");
  };

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
        );

        if (response.status === 200) {
          setFormData((prev) => ({
            ...prev,
            description: "",
            onsite: false,
            halfDayPeriod: "",
            leaveType: "Full Day",
          }));
          setTableRows((prev) => [
            {
              ...prev,
              siteName: "",
              place: "",
              Start: "",
              End: "",
              km: "",
              kmExpense: "",
              foodExpense: "",
            },
          ]);
          setShowModal(false);
          refreshHook();
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
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
            credentials: "include",
          }
        );

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error("Failed to apply for leave");
        }
        refreshHook();

        setShowModal(false);
        setFormData((prev) => ({
          ...prev,
          reason: "",
        }));
      }
    } catch (error) {
      console.error("Error applying for leave:", error);
    }
  };

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
          dateClick={handleDateClick}
          selectable={true}
          height="auto"
          dayCellDidMount={(info) => {
            const matchingEvent = events.find(
              (event) => event.start === info.date.toISOString().split("T")[0]
            );

            if (matchingEvent) {
              const inTime = matchingEvent.inTime || "-";
              const outTime = matchingEvent.outTime || "-";
              const squareColor = matchingEvent.color || "blue";
              const reason = matchingEvent.reason || "No reason provided";

              const timeContainer = document.createElement("div");
              timeContainer.className = "time-container";
              timeContainer.innerHTML = `
              <div class="time-container">
                <small class="time-display">
                  In: ${inTime}<br>Out: ${outTime}
                </small>
              </div>
            `;
            
              const squareMarker = document.createElement("div");
              squareMarker.className = "square-marker";
              squareMarker.style.backgroundColor = squareColor;

              // Append the square marker to the time container
              timeContainer.appendChild(squareMarker);

              // Append the time container to the day cell
              info.el
                .querySelector(".fc-daygrid-day-top")
                .appendChild(timeContainer);

              // Initialize tippy on the squareMarker AFTER appending it
              tippy(squareMarker, {
                content: reason,
                theme: "custom-tooltip",
                placement: "top",
              });
            }
          }}
        />
      </div>
      <style>
        {`
   .fc-daygrid-day-top {
  position: relative;
}

.square-marker {
  width: 10px;
  height: 10px;
  margin: 2px auto;
  border-radius: 2px;
  cursor: pointer; /* Indicates interactivity */
  position: absolute;
  top: 70px; /* Adjust spacing */
  left: 80%;
  transform: translateX(-50%);
  background-color: #007BFF; /* Default marker color */
}

@media (max-width: 768px) {
  .square-marker {
    top: 50px; /* Adjust for smaller screens */
    left: 70%; /* Recalculate position */
  }
}


.time-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 5px;
}

.time-display {
  font-size: 0.75rem; /* Adjust size as needed */
  margin-left: 10px;
  text-align: left;
}

.tippy-box[data-theme~="custom-tooltip"] {
  background-color: #007BFF; /* Tooltip background color */
  color: #fff; /* Tooltip text color */
  border-radius: 4px;
}

.tippy-box[data-theme~="custom-tooltip"] .tippy-arrow {
  color: #007BFF; /* Match tooltip arrow color to the background */
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
                        const { value } = e.target;
                        setFormData((prev) => ({
                          ...prev,
                          leaveType: value,
                          halfDayPeriod: value === "Half Day" ? "Morning" : "", // Default to "Morning" for Half Day
                        }));
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
                            halfDayPeriod: e.target.value,
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
                                    const updatedRows = [...tableRows];
                                    updatedRows[index].siteName =
                                      e.target.value;
                                    setTableRows(updatedRows);
                                  }}
                                  className="border p-1 rounded w-full"
                                />
                              </td>
                              <td className="border p-2 w-60">
                                <input
                                  type="text"
                                  value={row.place}
                                  onChange={(e) => {
                                    const updatedRows = [...tableRows];
                                    updatedRows[index].place = e.target.value;
                                    setTableRows(updatedRows);
                                  }}
                                  className="border p-1 rounded w-full"
                                />
                              </td>
                              <td className="border p-2">
                                <input
                                  type="number"
                                  value={row.Start}
                                  onChange={(e) => {
                                    const updatedRows = [...tableRows];
                                    updatedRows[index].Start = e.target.value;
                                    setTableRows(updatedRows);
                                  }}
                                  className="border p-1 rounded w-full"
                                />
                              </td>
                              <td className="border p-2 W-20">
                                <input
                                  type="number"
                                  value={row.End}
                                  onChange={(e) => {
                                    const updatedRows = [...tableRows];
                                    updatedRows[index].End = e.target.value;
                                    setTableRows(updatedRows);
                                  }}
                                  className="border p-1 rounded w-full"
                                />
                              </td>
                              <td className="border p-2">
                                <input
                                  type="number"
                                  value={row.km}
                                  onChange={(e) => {
                                    const updatedRows = [...tableRows];
                                    updatedRows[index].km = e.target.value;
                                    setTableRows(updatedRows);
                                  }}
                                  className="border p-1 rounded w-full"
                                />
                              </td>
                              <td className="border p-2">
                                <input
                                  type="number"
                                  value={row.kmExpense}
                                  onChange={(e) => {
                                    const updatedRows = [...tableRows];
                                    updatedRows[index].kmExpense =
                                      e.target.value;
                                    setTableRows(updatedRows);
                                  }}
                                  className="border p-1 rounded w-full"
                                />
                              </td>
                              <td className="border p-2 w-28">
                                <input
                                  type="number"
                                  value={row.foodExpense}
                                  onChange={(e) => {
                                    const updatedRows = [...tableRows];
                                    updatedRows[index].foodExpense =
                                      e.target.value;
                                    setTableRows(updatedRows);
                                  }}
                                  className="border p-1 rounded w-full"
                                />
                              </td>
                              <td className="border p-2">
                                <button
                                  onClick={() => {
                                    const updatedRows = [...tableRows];
                                    updatedRows.splice(index, 1);
                                    setTableRows(updatedRows);
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
                        leaveType: "Full Day",
                      });
                      setTableRows([{}]);
                      setShowModal(false);
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
                      year: "numeric",
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
  );
}

export default LeaveApplication;
