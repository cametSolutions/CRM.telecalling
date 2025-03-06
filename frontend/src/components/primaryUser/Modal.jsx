import { useState } from "react"
import { FaSpinner } from "react-icons/fa"
import React, { useEffect } from "react"
import UseFetch from "../../hooks/useFetch"
// import api from "../../api/api"

const Modal = ({
  isOpen,
  onClose,
  selectedDate,
  type,
  formData,
  staffId,
  staffName,
  assingnedto,
  privilegeleavestartsfrom,
  sickleavestartsfrom,
  casualleavestartsfrom,

  handleApply
}) => {
  const [leaveOption, setLeaveOption] = useState({
    leaveType: formData.leaveType || "Full Day"
  })
  const [typeofMode, settypeofMode] = useState(null)
  const [BalanceprivilegeleaveCount, setBalanceprivilegeLeaveCount] =
    useState(0)
  const [leaveBalance, setLeaveBalance] = useState({})
  const [BalancedcasualleaveCount, setBalancecasualLeaveCount] = useState(0)
  const [BalancesickleaveCount, setBalancesickLeaveCount] = useState(0)
  const [BalancecompensatoryleaveCount, setBalancecompensatoryLeaveCount] =
    useState(0)
  const [allleaves, setallLeaves] = useState([])

  const [selectedAttendance, setselectedAttendance] = useState({
    attendanceDate: "",
    inTime: { hours: "00", minutes: "00", amPm: "AM" },
    outTime: { hours: "00", minutes: "00", amPm: "AM" }
  })
  const [selectedLeave, setselectedLeave] = useState({
    leaveDate: "",
    reason: "",
    leaveType: "",
    leaveCategory: "",
    halfDayPeriod: "",
    description: ""
  })
  const [selectedOnsite, setselectedOnsite] = useState({
    onsiteDate: "",
    onsiteType: "",
    halfDayPeriod: "",
    description: ""
  })
  const [isApplying, setIsApplying] = useState(false)
  const [errors, setErrors] = useState({})
  const parseTime = (timeString) => {
    if (!timeString) return { hours: "00", minutes: "00", amPm: "AM" }

    const [time, period] = timeString.split(" ")
    const [hours, minutes] = time.split(":")

    return { hours, minutes, amPm: period }
  }
  const currentMonth = new Date(formData?.leaveDate).toString().slice(0, 7)
  const { data: leaves, refreshHook } = UseFetch(
    staffId && `/auth/getallLeave?userid=${staffId}`
  )
  const { data: leavemasterleavecount } = UseFetch(
    "/auth/getleavemasterleavecount"
  )

  useEffect(() => {
    if (leaves && leaves.length > 0) {
      setallLeaves(leaves)
    }
  }, [leaves])
  useEffect(() => {
    if (formData && type === "Attendance") {
      settypeofMode(type)
      setselectedAttendance({
        attendanceDate: formData.attendanceDate || "",
        inTime: parseTime(formData.inTime),
        outTime: parseTime(formData.outTime)
      })
    } else if (formData && type === "Leave") {
      settypeofMode(type)
      setselectedLeave({
        leaveDate: formData?.leaveDate,
        reason: formData?.reason,
        leaveType: formData?.leaveType,
        halfDayPeriod: formData?.halfDayPeriod,
        leaveCategory: formData?.leaveCategory
      })
    } else if (formData && type === "Onsite") {
      settypeofMode(type)
      setselectedOnsite({
        onsiteDate: formData?.onsiteDate,
        onsiteType: formData?.onsiteType,
        halfDayPeriod: formData?.halfDayPeriod,
        description: formData?.description
      })
    }
  }, [formData])
  useEffect(() => {
    if (allleaves && allleaves.length > 0 && leavemasterleavecount) {
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear()
      const currentmonth = currentDate.getMonth() + 1
      const leaveDate = new Date(formData?.leaveDate)
      const leaveYear = leaveDate.getFullYear()
      const startDate = new Date(privilegeleavestartsfrom)
      const startYear = startDate.getFullYear()
      const startmonth = startDate.getMonth() + 1 // 1-based month
      const totalprivilegeLeave = leavemasterleavecount?.totalprivilegeLeave
      const privilegePerMonth = totalprivilegeLeave / 12
      const totalcasualLeave = leavemasterleavecount?.totalcasualleave
      const casualPerMonth = totalcasualLeave / 12

      let ownedprivilegeCount = 0
      let ownedcasualCount = 0
      if (startYear < currentYear && privilegeleavestartsfrom !== null) {
        let privilegeCount
        let casualCount

        if (startYear < leaveYear && leaveYear < currentYear) {
          casualCount = casualPerMonth
          privilegeCount = 12 * privilegePerMonth
        } else if (startYear < leaveYear) {
          casualCount = casualPerMonth
          privilegeCount = currentmonth * privilegePerMonth
        } else if (startYear === leaveYear) {
          casualCount = casualPerMonth
          const monthsRemainingInStartYear = 12 - startmonth + 1 // Calculate remaining months including startMonth
          privilegeCount = monthsRemainingInStartYear * privilegePerMonth
        }
        ownedcasualCount = casualCount
        ownedprivilegeCount = privilegeCount
      } else if (
        startYear === currentYear &&
        privilegeleavestartsfrom !== null
      ) {
        // If privilege started this year, give leaves from start month to current month
        if (currentmonth >= startmonth) {
          ownedcasualCount = casualPerMonth
          ownedprivilegeCount =
            (currentmonth - startmonth + 1) * privilegePerMonth
        } else {
          ownedcasualCount = 0
          ownedprivilegeCount = 0 // Not eligible yet
        }
      } else {
        ownedcasualCount = 0
        // If privilege starts in a future year, no leaves yet
        ownedprivilegeCount = 0
      }

      const usedCasualCount = allleaves?.reduce((count, leave) => {
        if (!leave.leaveDate) return count
        const leaveDate = new Date(formData.leaveDate)
        const leaveMonthYear = `${leaveDate.getFullYear()}-${String(
          leaveDate.getMonth() + 1
        ).padStart(2, "0")}`

        const leaveDateObj = new Date(leave.leaveDate)
        const leaveMonthYearFromData = `${leaveDateObj.getFullYear()}-${String(
          leaveDateObj.getMonth() + 1
        ).padStart(2, "0")}`
        if (
          leave.leaveCategory === "casual Leave" &&
          leaveMonthYear === leaveMonthYearFromData
        ) {
         
         
          return count + (leave.leaveType === "Half Day" ? 0.5 : 1)
        }
        return count
      }, 0)

      const takenPrivilegeCount = allleaves?.reduce((count, leave) => {
        if (!leave.leaveDate) return count
        const leaveYear = new Date(formData.leaveDate).getFullYear()
        const leaveYearFromData = new Date(leave.leaveDate).getFullYear()
        if (
          leave.leaveCategory === "privileage Leave" &&
          leaveYear === leaveYearFromData
        ) {
          return count + (leave.leaveType === "Half Day" ? 0.5 : 1)
        }

        return count
      }, 0)

      const balancecasualcount = ownedcasualCount - usedCasualCount

      const balanceprivilege = ownedprivilegeCount - takenPrivilegeCount
      setBalanceprivilegeLeaveCount(Math.max(balanceprivilege, 0))
      setBalancecasualLeaveCount(Math.max(balancecasualcount, 0))
      setLeaveBalance({
        casual:Math.max(balancecasualcount,0),
        privilege: Math.max(balanceprivilege, 0),
        sick: BalancesickleaveCount,
        compensatory: BalancecompensatoryleaveCount
      })
    } else if (allleaves && allleaves.length === 0 && leavemasterleavecount) {
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear()
      const currentmonth = currentDate.getMonth() + 1
      const leaveDate = new Date(formData.leaveDate)
      const leaveYear = leaveDate.getFullYear()
      const startDate = new Date(privilegeleavestartsfrom)
      const startYear = startDate.getFullYear()
      const startmonth = startDate.getMonth() + 1 // 1-based month

      const totalprivilegeLeave = leavemasterleavecount?.totalprivilegeLeave
      const privilegePerMonth = totalprivilegeLeave / 12
      const totalcasualLeave = leavemasterleavecount?.totalcasualleave
      const casualPerMonth = totalcasualLeave / 12
      let ownedprivilegeCount = 0
      let ownedcasualCount = 0
      if (startYear < currentYear && privilegeleavestartsfrom !== null) {
        let privilegeCount
        let casualCount
        if (startYear < leaveYear && leaveYear < currentYear) {
          casualCount = casualPerMonth
          privilegeCount = 12 * privilegePerMonth
        } else if (startYear < leaveYear) {
          casualCount = casualPerMonth
          privilegeCount = currentmonth * privilegePerMonth
        } else if (startYear === leaveYear) {
          casualCount = casualPerMonth
          const monthsRemainingInStartYear = 12 - startmonth + 1 // Calculate remaining months including startMonth
          privilegeCount = monthsRemainingInStartYear * privilegePerMonth
        }
        ownedcasualCount = casualCount
        ownedprivilegeCount = privilegeCount
      } else if (
        startYear === currentYear &&
        privilegeleavestartsfrom !== null
      ) {
        // If privilege started this year, give leaves from start month to current month
        if (currentmonth >= startmonth) {
          ownedcasualCount = casualPerMonth
          ownedprivilegeCount =
            (currentmonth - startmonth + 1) * privilegePerMonth
        } else {
          ownedcasualCount = 0
          ownedprivilegeCount = 0 // Not eligible yet
        }
      } else {
        // If privilege starts in a future year, no leaves yet
        ownedprivilegeCount = 0
        ownedcasualCount = 0
      }
      setBalanceprivilegeLeaveCount(ownedprivilegeCount)
      setBalancecasualLeaveCount(ownedcasualCount)

      setLeaveBalance({
        casual: ownedcasualCount,
        privilege: ownedprivilegeCount,
        sick: BalancesickleaveCount,
        compensatory: BalancecompensatoryleaveCount
      })
    }
  }, [currentMonth, allleaves, leavemasterleavecount, formData])
  const handleTimeChange = (type, field, value) => {
    setselectedAttendance((prev) => {
      // Ensure the nested object exists for `type`
      const currentType = prev[type] || {
        hours: "00",
        minutes: "00",
        amPm: "AM"
      }
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
    if (type === "Leave") {
      // Validation
      let newErrors = {}
      if (!selectedLeave.leaveType) newErrors.leaveType = "Shift is required"
      if (
        selectedLeave.leaveType === "Half Day" &&
        !selectedLeave.halfDayPeriod
      )
        newErrors.halfDayPeriod = "Please select Half Day period"
      if (!selectedLeave.leaveDate)
        newErrors.leaveDate = "Leave Date is required"
      if (!selectedLeave.leaveCategory)
        newErrors.leaveCategory = "Leave Type is required"
      if (!selectedLeave.reason) newErrors.reason = "Reason is required"
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        return
      }
      setIsApplying(true)

      handleApply(staffId, selectedLeave, setIsApplying, type)
    } else if (type === "Attendance") {
      setIsApplying(true)

      handleApply(staffId, selectedAttendance, setIsApplying, type)
    } else if (type === "Onsite") {
      setIsApplying(true)
      handleApply(staffId, selectedOnsite, setIsApplying, type)
    }
  }

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center  ">
        <div className="bg-green-50 p-5 rounded-lg shadow-lg w-[350px] z-40 mt-16">
          <h2 className="text-xl font-semibold text-center">
            {typeofMode} Application
          </h2>
          {/* <p className="mt-2 text-center text-gray-600">
            Selected Date: {selectedDate}
          </p> */}
          {typeofMode === "Edit Leave" && (
            <div className="bg-white rounded-lg shadow-lg w-[310px] z-40 border border-gray-300 overflow-hidden px-2">
              <div className="mt-4">
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
                          leaveType: e.target.value,
                          halfDayPeriod: "" // Replace `newDate` with the actual value you want to set
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
                          leaveType: e.target.value, // Replace `newDate` with the actual value you want to set
                          halfDayPeriod: "Morning"
                        }))
                      }}
                    />
                    Half Day
                  </label>
                  {errors.leaveType && (
                    <p className="text-red-500">{errors.leaveType}</p>
                  )}
                  {selectedLeave?.leaveType === "Half Day" && (
                    <>
                      <select
                        className="border py-1  rounded w-auto"
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
                      {errors.halfDayPeriod && (
                        <p className="text-red-500">{errors.halfDayPeriod}</p>
                      )}
                    </>
                  )}
                </div>

                {leaveOption.leaveType === "Full Day" ? (
                  <>
                    <div className="mt-1 flex flex-col">
                      <label className="text-sm font-semibold">
                        Leave Date
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

                      {/* <label className="text-sm font-semibold mt-2">
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
                  /> */}
                    </div>
                    {errors.leaveDate && (
                      <p className="text-red-500">{errors.leaveDate}</p>
                    )}
                  </>
                ) : (
                  <>
                    <div className="mt-1">
                      <label className="text-sm font-semibold">
                        Leave Date
                      </label>
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
                    {errors.leaveDate && (
                      <p className="text-red-500">{errors.leaveDate}</p>
                    )}
                  </>
                )}

                <div className="mt-1">
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
                    <option
                      value="casual Leave"
                      disabled={BalancedcasualleaveCount === 0}
                    >
                      Casual Leave
                    </option>
                    <option
                      value="privileage Leave"
                      disabled={BalanceprivilegeleaveCount === 0}
                    >
                      Privilege Leave
                    </option>
                    <option
                      value="compensatory Leave"
                      disabled={BalancecompensatoryleaveCount === 0}
                    >
                      Compensatory Leave
                    </option>
                    <option
                      value="sick Leave"
                      disabled={BalancesickleaveCount === 0}
                    >
                      Sick Leave
                    </option>

                    {/* {BalancedcasualleaveCount > 0 && (
                      <option value="casual Leave">Casual Leave</option>
                    )}
                    {BalanceprivilegeleaveCount > 0 && (
                      <option value="privileage Leave">Privilege Leave</option>
                    )}
                    {BalancecompensatoryleaveCount > 0 && (
                      <option value="compensatory Leave">
                        Compensatory Leave
                      </option>
                    )}
                    {BalancesickleaveCount > 0 && (
                      <option value="sick Leave">Sick Leave</option>
                    )} */}
                    <option value="other Leave">Other Leave</option>
                  </select>
                </div>
                {errors.leaveCategory && (
                  <p className="text-red-500">{errors.leaveCategory}</p>
                )}

                <div className="mt-1">
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
                {errors.reason && (
                  <p className="text-red-500">{errors.reason}</p>
                )}
              </div>
            </div>
          )}

          {/* Leave Balance */}
          {typeofMode === "Leave" && (
            <div className="bg-white rounded-lg shadow-lg w-[310px] z-40 border border-gray-300 overflow-hidden">
              {/* Header */}
              {/* <div className="bg-gray-100 px-6 py-2 text-lg font-bold text-gray-700 border-b">
              {user?.name?.toUpperCase()}
            </div> */}

              {/* Leave Balance Section */}
              <div>
                <div className="bg-gray-200 py-2 text-center">{staffName}</div>
                <p className="mt-2 text-center text-gray-600">
                  Selected Date: {selectedDate.split("-").reverse().join("-")}
                </p>
                <div className="p-2">
                  <h2 className="text-gray-600 font-semibold text-md ">
                    Leave Balance
                  </h2>
                  <p className="text-xl font-bold text-gray-800">
                    {BalanceprivilegeleaveCount + BalancedcasualleaveCount}
                    leaves
                  </p>
                  <div className="grid grid-cols-[3fr_1fr] gap-1 border border-gray-300 rounded-lg p-2 bg-gray-50">
                    <div className="font-semibold text-gray-700 text-left ">
                      Category
                    </div>
                    <div className="font-semibold text-gray-700 text-right">
                      Balance
                    </div>

                    {Object.entries(leaveBalance).map(([category, balance]) => (
                      <React.Fragment key={category}>
                        <div className="capitalize text-gray-600 text-left">
                          {category} Leave
                        </div>
                        <div className="text-gray-600 text-center font-medium">
                          {balance}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {/*Onsite Application*/}
          {typeofMode === "Onsite" && (
            <div className="mt-4">
              {/* Full Day / Half Day Selection */}
              <div className="flex gap-4">
                <label>
                  <input
                    type="radio"
                    value="Full Day"
                    checked={selectedOnsite.onsiteType === "Full Day"}
                    // onChange={(e) => setLeaveOption(e.target.value)}
                    onChange={(e) => {
                      setselectedOnsite((prev) => ({
                        ...prev,
                        onsiteType: e.target.value,
                        halfDayPeriod: "" // Replace `newDate` with the actual value you want to set
                      }))
                    }}
                  />
                  Full Day
                </label>
                <label>
                  <input
                    type="radio"
                    value="Half Day"
                    checked={selectedOnsite.onsiteType === "Half Day"}
                    // onChange={(e) => setLeaveOption(e.target.value)}
                    onChange={(e) => {
                      setselectedOnsite((prev) => ({
                        ...prev,
                        onsiteType: e.target.value // Replace `newDate` with the actual value you want to set
                      }))
                    }}
                  />
                  Half Day
                </label>
                {selectedOnsite.onsiteType === "Half Day" && (
                  <select
                    className="border p-2 rounded w-auto"
                    value={selectedOnsite?.halfDayPeriod || "Morning"}
                    // onChange={(e) => setLeaveOption(e.target.value)}
                    onChange={(e) => {
                      setselectedOnsite((prev) => ({
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

              <div className="mt-3">
                <label className="text-sm font-semibold">Onsite Date</label>
                <input
                  type="date"
                  value={selectedOnsite?.onsiteDate}
                  // onChange={(e) => setLeaveStart(e.target.value)}
                  onChange={(e) => {
                    setselectedLeave((prev) => ({
                      ...prev,
                      onsiteDate: e.target.value // Replace `newDate` with the actual value you want to set
                    }))
                  }}
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>
          )}

          {/* Attendance Application */}
          {typeofMode === "Attendance" && (
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
          {typeofMode === "Leave" ? (
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded w-full flex items-center justify-center hover:bg-blue-600"
              onClick={() => settypeofMode("Edit Leave")}
            >
              Edit Leave
            </button>
          ) : (
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded w-full flex items-center justify-center"
              onClick={Apply}
              disabled={isApplying}
            >
              {isApplying ? <FaSpinner className="animate-spin mr-2" /> : null}
              {isApplying ? "Processing..." : "Apply"}
            </button>
          )}

          <button
            className="mt-2 px-4 py-2 bg-gray-500 text-white rounded w-full hover:bg-gray-600"
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
