import { useState } from "react"
import { FaSpinner } from "react-icons/fa"
import { useEffect } from "react"
// import api from "../../api/api"

const Modal = ({
  isOpen,
  onClose,
  selectedDate,
  type,
  formData,
  staffId,
  handleApply
}) => {
 
  const [leaveType, setLeaveType] = useState({
    leaveDate: formData?.leaveDate,
    leaveCategory: formData?.leaveCategory || "",
    description: formData?.description || ""
  })
  const [leaveOption, setLeaveOption] = useState({
    leaveType: formData.leaveType || "Full Day"
  })
  const [leaveStart, setLeaveStart] = useState(selectedDate)
  const [leaveEnd, setLeaveEnd] = useState(selectedDate)
  const [leaveDescription, setLeaveDescription] = useState("")

  const [selectedAttendance, setselectedAttendance] = useState({
    attendanceDate: "",
    inTime: { hours: "00", minutes: "00", amPm: "AM" },
    outTime: { hours: "00", minutes: "00", amPm: "AM" }
  })
  const [selectedLeave, setselectedLeave] = useState({
    leaveDate: "",
    leaveType: "",
    leaveCategory: "",
    halfDayPeriod: "",
    description: ""
  })
  const [isApplying, setIsApplying] = useState(false)
  const parseTime = (timeString) => {
    if (!timeString) return { hours: "00", minutes: "00", amPm: "AM" }

    const [time, period] = timeString.split(" ")
    const [hours, minutes] = time.split(":")

    return { hours, minutes, amPm: period }
  }
  useEffect(() => {
    if (formData && type === "Attendance") {
      setselectedAttendance({
        attendanceDate: formData.attendanceDate || "",
        inTime: parseTime(formData.inTime),
        outTime: parseTime(formData.outTime)
      })
    } else if (formData && type === "Leave") {
      setselectedLeave({
        leaveDate: formData?.leaveDate,
        leaveType: formData?.leaveType,
        halfDayPeriod: formData?.halfDayPeriod,
        leaveCategory: formData?.leaveCategory,
        reason: formData?.description
      })
    }
  }, [formData])
  const handleTimeChange = (type, field, value) => {
    setselectedAttendance((prev) => {
      // Ensure the nested object exists for `type`
      const currentType = prev[type] || { hours: "", minutes: "", amPm: "" }

      return {
        ...prev,
        [type]: {
          ...currentType, // Preserve existing fields
          [field]: value // Update the specific field
        }
      }
    })
  }
  const Apply = async () => {
    setIsApplying(true)
    if (type === "Leave") {
      handleApply(staffId, selectedLeave, setIsApplying, type)
    } else if (type === "Attendance") {
      handleApply(staffId, selectedAttendance, setIsApplying, type)
    }
  }
  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center  ">
        <div className="bg-green-100 p-5 rounded-lg shadow-lg w-[350px] z-40 mt-16">
          <h2 className="text-xl font-semibold text-center">
            {type} Application
          </h2>
          <p className="mt-2 text-center text-gray-600">
            Selected Date: {selectedDate}
          </p>

          {/* Leave Application */}
          {type === "Leave" && (
            <div className="mt-4">
              {/* Full Day / Half Day Selection */}
              <div className="flex gap-4">
                <label>
                  <input
                    type="radio"
                    value="Full Day"
                    checked={selectedLeave.leaveType === "Full Day"}
                    // onChange={(e) => setLeaveOption(e.target.value)}
                    onChange={(e) => {
                      setselectedLeave((prev) => ({
                        ...prev,
                        leaveType: e.target.value ,
                        halfDayPeriod:""// Replace `newDate` with the actual value you want to set
                      }))
                    }}
                  />
                  Full Day
                </label>
                <label>
                  <input
                    type="radio"
                    value="Half Day"
                    checked={selectedLeave.leaveType === "Half Day"}
                    // onChange={(e) => setLeaveOption(e.target.value)}
                    onChange={(e) => {
                      setselectedLeave((prev) => ({
                        ...prev,
                        leaveType: e.target.value // Replace `newDate` with the actual value you want to set
                      }))
                    }}
                  />
                  Half Day
                </label>
                {selectedLeave.leaveType === "Half Day" && (
                  <select
                    className="border p-2 rounded w-auto"
                    value={selectedLeave?.halfDayPeriod || "Morning"}
                    // onChange={(e) => setLeaveOption(e.target.value)}
                    onChange={(e) => {
                      setselectedLeave((prev) => ({
                        ...prev,
                        halfDayPeriod: e.target.value // Replace `newDate` with the actual value you want to set
                      }))
                    }}
                  >
                    <option value="">Select Period</option>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                  </select>
                )}
              </div>

              {/* Leave Dates */}
              {leaveOption.leaveType === "Full Day" ? (
                <div className="mt-3 flex flex-col">
                  <label className="text-sm font-semibold">
                    Leave Start Date
                  </label>
                  <input
                    type="date"
                    value={selectedLeave?.leaveDate}
                    onChange={(e) => {
                      setselectedLeave((prev) => ({
                        ...prev,
                        leaveDate: e.target.value // Replace `newDate` with the actual value you want to set
                      }))
                    }}
                    className="border p-2 rounded"
                  />

                  <label className="text-sm font-semibold mt-2">
                    Leave End Date
                  </label>
                  <input
                    type="date"
                    value={selectedLeave?.leaveDate}
                    // onChange={(e) => setLeaveEnd(e.target.value)}
                    onChange={(e) => {
                      setselectedLeave((prev) => ({
                        ...prev,
                        leaveDate: e.target.value // Replace `newDate` with the actual value you want to set
                      }))
                    }}
                    className="border p-2 rounded"
                  />
                </div>
              ) : (
                <div className="mt-3">
                  <label className="text-sm font-semibold">Leave Date</label>
                  <input
                    type="date"
                    value={selectedLeave?.leaveDate}
                    // onChange={(e) => setLeaveStart(e.target.value)}
                    onChange={(e) => {
                      setselectedLeave((prev) => ({
                        ...prev,
                        leaveDate: e.target.value // Replace `newDate` with the actual value you want to set
                      }))
                    }}
                    className="border p-2 rounded w-full"
                  />
                </div>
              )}

              {/* Leave Type Dropdown */}
              <div className="mt-3">
                <label className="text-sm font-semibold">Leave Type</label>
                <select
                  className="border p-2 rounded w-full"
                  value={selectedLeave?.leaveCategory || ""}
                  // onChange={(e) => setLeaveType(e.target.value)}
                  onChange={(e) => {
                    setselectedLeave((prev) => ({
                      ...prev,
                      leaveCategory: e.target.value // Replace `newDate` with the actual value you want to set
                    }))
                  }}
                >
                  <option value="">Select Leave Type</option>
                  <option value="casual Leave">Casual Leave</option>
                  <option value="privileage Leave">Privilege Leave</option>
                  <option value="compensatory Leave">Compensatory Leave</option>
                  <option value="other Leave">Other Leave</option>
                </select>
              </div>

              {/* Description */}
              <div className="mt-3">
                <label className="text-sm font-semibold">Reason</label>
                <textarea
                  className="border p-2 rounded w-full"
                  rows="3"
                  placeholder="Enter reason"
                  value={selectedLeave?.reason || ""}
                  // onChange={(e) => setLeaveDescription(e.target.value)}
                  onChange={(e) => {
                    setselectedLeave((prev) => ({
                      ...prev,
                      reason: e.target.value // Replace `newDate` with the actual value you want to set
                    }))
                  }}
                ></textarea>
              </div>
            </div>
          )}

          {/* Attendance Application */}
          {type === "Attendance" && (
            <div className="mt-4">
              {/* Full Day / Half Day Selection */}
              {/* <div className="flex gap-4">
                <label>
                  <input
                    type="radio"
                    value="Full Day"
                    checked={leaveOption === "Full Day"}
                    onChange={(e) => setLeaveOption(e.target.value)}
                  />
                  Full Day
                </label>
                <label>
                  <input
                    type="radio"
                    value="Half Day"
                    checked={leaveOption === "Half Day"}
                    onChange={(e) => setLeaveOption(e.target.value)}
                  />
                  Half Day
                </label>
                {leaveOption === "Half Day" && (
                  <select
                    className="border p-2 rounded w-auto"
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                  >
                    <option value="">Select Period</option>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                  </select>
                )}
              </div> */}

              {/* Attendance Date */}
              <div className="mt-3">
                <label className="text-sm font-semibold">Attendance Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  className="border p-2 rounded w-full"
                  readOnly
                />
              </div>

              {/* In & Out Time */}
              <div className="mt-3">
                <label className="text-sm font-semibold">In Time</label>
                <div className="flex gap-2">
                  <select
                    id="hours"
                    name="hours"
                    value={selectedAttendance?.inTime?.hours}
                    onChange={(e) =>
                      handleTimeChange("inTime", "hours", e.target.value)
                    }
                    className="border border-gray-300 py-1 px-1 rounded "
                  >
                    {Array.from({ length: 13 }, (_, i) => (
                      <option key={i + 1} value={i}>
                        {String(i).padStart(2, "0")}
                      </option>
                    ))}
                  </select>

                  <select
                    id="minutes"
                    name="minutes"
                    value={selectedAttendance?.inTime?.minutes}
                    onChange={(e) =>
                      handleTimeChange("inTime", "minutes", e.target.value)
                    }
                    className="border border-gray-300 py-1 px-1 rounded "
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
                    value={selectedAttendance?.inTime?.amPm}
                    onChange={(e) =>
                      handleTimeChange("inTime", "amPm", e.target.value)
                    }
                    className="border border-gray-300 py-1 px-1 rounded "
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>

              <div className="mt-3">
                <label className="text-sm font-semibold">Out Time</label>
                <div className="flex gap-2">
                  <select
                    id="hours"
                    name="hours"
                    value={selectedAttendance?.outTime?.hours}
                    onChange={(e) =>
                      handleTimeChange("outTime", "hours", e.target.value)
                    }
                    className="border border-gray-300 py-1 px-1 rounded"
                  >
                    {Array.from({ length: 13 }, (_, i) => (
                      <option key={i + 1} value={i}>
                        {String(i).padStart(2, "0")}
                      </option>
                    ))}
                  </select>

                  <select
                    id="minutes"
                    name="minutes"
                    value={selectedAttendance?.outTime?.minutes}
                    onChange={(e) =>
                      handleTimeChange("outTime", "minutes", e.target.value)
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
                    value={selectedAttendance?.outTime?.amPm}
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
            </div>
          )}

          {/* Apply / Update Button with Spinner */}
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded w-full flex items-center justify-center"
            onClick={Apply}
            disabled={isApplying}
          >
            {isApplying ? <FaSpinner className="animate-spin mr-2" /> : null}
            {isApplying ? "Processing..." : "Apply"}
          </button>

          <button
            className="mt-2 px-4 py-2 bg-gray-500 text-white rounded w-full"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    )
  )
}

export default Modal
