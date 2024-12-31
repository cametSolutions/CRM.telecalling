import React, { useState, useEffect } from "react"

import BarLoader from "react-spinners/BarLoader"
import MyDatePicker from "./MyDatePicker"
import api from "../../api/api"
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"
import dayjs from "dayjs"

const LeaveApprovalAndPending = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loader, setLoader] = useState(false)
  const [leaveList, setLeaveList] = useState([])

  const [leaveStatus, setLeaveStatus] = useState({})
  const [isToggled, setIsToggled] = useState({})
  const [isOnsite, setOnsite] = useState(false)
  const [isSelected, setIsSelected] = useState({})
  const [dates, setDates] = useState({ startDate: "", endDate: "" })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    const user = JSON.parse(userData)
    setUser(user)
  }, [])

  useEffect(() => {
    const today = dayjs()

    // Get the start of the current month (1st day of the month, 00:00:00)
    const startDate = today.startOf("month").format("YYYY-MM-DD HH:mm:ss")

    // Get the end of the current month (last day of the month, 23:59:59)
    const endDate = today.endOf("month").format("YYYY-MM-DD HH:mm:ss")

    setDates({ startDate, endDate })

    // Last date of the month
  }, [])
  useEffect(() => {
    const fetchLeaveList = async () => {
      if (dates.startDate !== "" && dates.endDate !== "" && user) {
        try {
          let response
          if (isOnsite) {
            response = await api.get(
              `/auth/leaveList?startdate=${dates.startDate}&enddate=${
                dates.endDate
              }&role=${user?.role}&userid=${user?._id}&onsite=${true}`
            )
          } else {
            response = await api.get(
              `/auth/leaveList?startdate=${dates.startDate}&enddate=${
                dates.endDate
              }&userid=${user?._id}&role=${user?.role}&onsite=${false}`
            )
          }

          const list = response.data.data // Assuming API returns data in response.data
          if (Array.isArray(list) && list.length > 0) {
            setLoading(false)
            setLeaveList(list) // Update state only if the list has items
          } else {
            setLoading(false)
            setLeaveList([])
          }

          // Initialize isToggled state based on the status of each leave request
          const initialToggles = {}
          const initialReject = {}
          const initialSelectAll = {}
          if (user.role === "Admin") {
            list.forEach((userLeave) => {
              // Check the `status` field for each leave and set the toggle accordingly
              initialToggles[userLeave._id] =
                userLeave.hrstatus === "HR/Onsite Approved" // Toggle on if approved
              initialReject[userLeave._id] =
                userLeave.hrstatus === "HR Rejected"
              initialSelectAll[userLeave.userId._id] =
                userLeave.hrstatus === "HR/Onsite Approved"
            })
          } else {
            list.forEach((userLeave) => {
              // Check the `status` field for each leave and set the toggle accordingly
              initialToggles[userLeave._id] =
                userLeave.departmentstatus === "Dept Approved" // Toggle on if approved
              initialReject[userLeave._id] =
                userLeave.departmentstatus === "Dept Rejected"
              initialSelectAll[userLeave.userId._id] =
                userLeave.departmentstatus === "Dept Approved"
            })
          }

          setIsToggled(initialToggles)
          setLeaveStatus(initialReject)
          setIsSelected(initialSelectAll)
        } catch (error) {
          console.error("Error fetching leave list:", error)
        }
      }
    }

    fetchLeaveList() // Call the async function
  }, [dates, user])

  const onsitetoggle = async () => {
    try {
      setLoading(true)
      let response
      if (!isOnsite) {
        response = await api.get(
          `/auth/leaveList?startdate=${dates.startDate}&enddate=${
            dates.endDate
          }&onsite=${true}&userid=${user?._id}&role=${user?.role}`
        )
      } else {
        response = await api.get(
          `/auth/leaveList?startdate=${dates.startDate}&enddate=${dates.endDate}&userid=${user?._id}&role=${user?.role}`
        )
      }

      const list = response.data.data // Assuming API returns data in response.data
      if (Array.isArray(list) && list.length > 0) {
        setLoading(false)
        setLeaveList(list) // Update state only if the list has items
      } else {
        setLoading(false)
        setLeaveList([])
      }

      // Initialize isToggled state based on the status of each leave request
      const initialToggles = {}
      const initialReject = {}
      const initialSelectAll = {}
      if (user?.role === "Admin") {
        list.forEach((userLeave) => {
          // Check the `status` field for each leave and set the toggle accordingly
          initialToggles[userLeave._id] =
            userLeave.hrstatus === "HR/Onsite Approved" // Toggle on if approved
          initialReject[userLeave._id] = userLeave.hrstatus === "HR Rejected"
          initialSelectAll[userLeave.userId._id] =
            userLeave.hrstatus === "HR/Onsite Approved"
        })
      } else {
        list.forEach((userLeave) => {
          // Check the `status` field for each leave and set the toggle accordingly
          initialToggles[userLeave._id] =
            userLeave.departmentstatus === "Dept Approved" // Toggle on if approved
          initialReject[userLeave._id] =
            userLeave.departmentstatus === "Dept Rejected"
          initialSelectAll[userLeave.userId._id] =
            userLeave.departmentstatus === "Dept Approved"
        })
      }
      setOnsite(!isOnsite)
      setIsSelected(initialSelectAll)
      setIsToggled(initialToggles)
      setLeaveStatus(initialReject)
    } catch (error) {
      console.log("error:", error.message)
    }
  }

  const singleApproval = async (id, userId) => {
    setLoader(true)
    let leaveApprove
    if (isOnsite) {
      leaveApprove = await api.put(
        `/auth/approveLeave/?role=${user?.role}&selectedId=${id}&startDate=${
          dates.startDate
        }&endDate=${dates.endDate}&onsite=${true}&userId=${
          user?._id
        }&single=${true}`
      )
    } else {
      leaveApprove = await api.put(
        `/auth/approveLeave/?role=${user?.role}&selectedId=${id}&userId=${
          user?._id
        }&startDate=${dates.startDate}&endDate=${
          dates.endDate
        }&single=${true}&onsite=${false}`
      )
    }
    const successApprove = leaveApprove.data.data

    if (leaveApprove.status === 200) {
      setIsToggled((prevState) => ({
        ...prevState,
        [id]: !prevState[id] // Toggle the specific user's state
      }))
      const initialReject = {}

      if (user?.role === "Admin") {
        successApprove.forEach((userLeave) => {
          // Check the `status` field for each leave and set the toggle accordingly
          initialReject[userLeave._id] = userLeave.hrstatus === "HR Rejected" // Toggle on if approved
        })
      } else {
        successApprove.forEach((userLeave) => {
          // Check the `status` field for each leave and set the toggle accordingly
          initialReject[userLeave._id] =
            userLeave.departmentstatus === "Dept Rejected" // Toggle on if approved
        })
      }
      setLeaveStatus(initialReject)

      // Check if isSelected is not empty and has the userId as true
      if (Object.keys(isSelected).length > 0 && isSelected[userId]) {
        setIsSelected((prevState) => ({
          ...prevState,
          [userId]: !prevState[userId] // Toggle the specific user's state
        }))
      }
      setLeaveList(successApprove)
      setLoader(false)
    }
  }

  const toggleReject = async (id) => {
    setLoader(true)

    const checkOnsite = isOnsite ? true : false
    const leaveReject = await api.put(
      `/auth/rejectLeave/?role=${user.role}&selectedId=${id}&userId=${user._id}&startdate=${dates.startDate}&enddate=${dates.endDate}&onsite=${checkOnsite}`
    )

    if (leaveReject.status === 200) {
      const list = leaveReject.data.data

      const initialToggles = {}
      const initialSelectAll = {}

      if (user?.role === "Admin") {
        list.forEach((userLeave) => {
          // Check the `status` field for each leave and set the toggle accordingly
          initialToggles[userLeave._id] =
            userLeave.hrstatus === "HR/Onsite Approved" // Toggle on if approved
          initialSelectAll[userLeave._id] =
            userLeave.hrstatus === "HR/Onsite Approved"
        })
      } else {
        list.forEach((userLeave) => {
          // Check the `status` field for each leave and set the toggle accordingly
          initialToggles[userLeave._id] =
            userLeave.departmentstatus === "Dept Approved" // Toggle on if approved
          initialSelectAll[userLeave.userId._id] =
            userLeave.departmentstatus === "Dept Approved"
        })
      }
      setIsToggled(initialToggles)
      setIsSelected(initialSelectAll)
      setLeaveList(list)

      setLeaveStatus((prevState) => ({
        ...prevState,
        [id]: !prevState[id] // Toggle the specific user's state
      }))
      setLoader(false)
    }
  }

  const approveAll = async (userId) => {
    setLoader(true)

    const checkOnsite = isOnsite ? true : false
    const leaveApprove = await api.put(
      `/auth/approveLeave/?role=${
        user?.role
      }&selectedId=${userId}&selectAll=${true}&startDate=${
        dates.startDate
      }&endDate=${dates.endDate}&userId=${user?._id}&onsite=${checkOnsite}`
    )
    const sucessAll = leaveApprove.data.data
    if (leaveApprove.status === 200) {
      setLeaveList(sucessAll)
      const selectedid = sucessAll
        .filter((id) => id.userId._id === userId)
        .map((item) => item._id)

      setIsToggled((prevState) => {
        // Create a new state object with toggled values for all userIds in the selectedid array
        const newState = { ...prevState }

        // Iterate over each userId in the selectedid array and toggle its state
        selectedid.forEach((userId) => {
          newState[userId] = !newState[userId]
        })

        return newState
      })
      setLeaveStatus((prevState) => {
        // Create a new state object with toggled values for all userIds in the selectedid array
        const newState = { ...prevState }

        // Iterate over each userId in the selectedid array and toggle its state
        selectedid.forEach((userId) => {
          newState[userId] = !newState[userId]
        })

        return newState
      })

      setIsSelected((prevState) => ({
        ...prevState,
        [userId]: !prevState[userId] // Toggle the specific user's state
      }))
      setLoader(false)
    }
  }

  const handleToggleStatus = (index) => {
    setLeaveStatus((prevStatus) => {
      const newStatus = [...prevStatus]
      newStatus[index] = !newStatus[index] // Toggle the status
      return newStatus
    })
  }

  const handleDate = (selectedDate) => {
    const extractDateAndMonth = (date) => {
      const year = date.getFullYear()
      const month = date.getMonth() + 1 // getMonth() is 0-indexed
      const day = date.getDate()
      return `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`
    }

    if (
      selectedDate.startDate instanceof Date &&
      !isNaN(selectedDate.startDate.getTime()) &&
      selectedDate.endDate instanceof Date &&
      !isNaN(selectedDate.endDate.getTime())
    ) {
      // If both startDate and endDate are valid Date objects
      setDates({
        startDate: extractDateAndMonth(selectedDate.startDate),
        endDate: extractDateAndMonth(selectedDate.endDate)
      })
    } else {
      // If dates are not valid Date objects, use them as they are
      setDates({
        startDate: selectedDate.startDate,
        endDate: selectedDate.endDate
      })
    }
  }

  return (
    <div>
      {loader && (
        <BarLoader
          cssOverride={{ width: "100%", height: "4px" }} // Tailwind's `h-4` corresponds to `16px`
          color="#4A90E2" // Change color as needed
          // loader={true}
        />
      )}

      <div className="text-center p-8 ">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold mb-1">Leave Approval/Pending</h1>
          {/* <MyDatePicker handleSelect={handleDate} dates={dates} /> */}
          <div className="flex justify-end flex-grow mx-5">
            <span className="text-gray-600 mr-4 font-bold">On Site</span>
            <button
              onClick={onsitetoggle}
              className={`${
                isOnsite ? "bg-green-500" : "bg-gray-300"
              } w-11 h-6 flex items-center rounded-full p-0 transition-colors duration-300`}
            >
              <div
                className={`${
                  isOnsite ? "translate-x-5" : "translate-x-0"
                } w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300`}
              ></div>
            </button>
          </div>
          {dates.startDate && (
            <MyDatePicker handleSelect={handleDate} dates={dates} />
          )}
        </div>

        {/* Outer div with max height for scrolling the user list */}
        <div className="text-center max-h-60 sm:max-h-80 md:max-h-96 lg:max-h-[500px] overflow-y-auto overflow-x-axis">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-300 sticky top-0 z-40">
              <tr>
                <th className="border-l border-gray-300 py-3">No</th>
                <th className="py-3">User/Admin Name</th>

                <th className="py-3">Department</th>
                <th className="py-3">Branch</th>
                <th className="py-3">Apply Date</th>
                <th className="py-3">Leave Date</th>
                <th className="py-3">Leave Type</th>
                <th className="py-3">Shift</th>
                <th className="py-3">{isOnsite ? "Remarks" : "Reason"}</th>
                <th className="py-3">Dpt.Status</th>
                <th className="py-3">Hr.Status</th>
                <th className="py-3">Approve</th>
                <th className="py-3">Approve All</th>

                <th className="py-3">Reject</th>
                {/* <th className="border-r border-gray-300 py-3">Permissions</th> */}
              </tr>
            </thead>
            <tbody>
              {leaveList.length > 0 ? (
                leaveList?.map((user, index) => (
                  <tr key={user._id}>
                    <td className="border border-gray-300 py-1">{index + 1}</td>
                    <td className="border border-gray-300 py-1">
                      {user?.userId?.name}
                    </td>

                    <td className="border border-gray-300 py-1 px-1">
                      {user?.userId?.department?.department}
                    </td>
                    <td className="border border-gray-300 py-1 px-1">
                      {user?.userId?.selected
                        ?.map((branch) => branch?.branch_id?.branchName)
                        .join(", ")}
                    </td>
                    <td className="border border-gray-300 py-1 px-2">
                      {new Date(user?.createdAt).toLocaleDateString("en-GB", {
                        timeZone: "UTC",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                      })}
                    </td>
                    <td className="border border-gray-300 py-1 px-2">
                      {new Date(user?.leaveDate).toLocaleDateString("en-GB", {
                        timeZone: "UTC",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                      })}
                    </td>
                    <td className="border border-gray-300 py-1 px-4">
                      {user?.leaveType}
                    </td>
                    <td className="border border-gray-300 py-1 px-4">
                      {user?.halfDayPeriod}
                    </td>
                    <td className="border border-gray-300 py-1">
                      {user?.reason || user?.description}
                    </td>
                    <td className="border border-gray-300 py-1">
                      {user?.departmentstatus}
                    </td>
                    <td className="border border-gray-300 py-1">
                      {user?.hrstatus}
                    </td>
                    {/* <td className="border border-gray-300 py-1">
                      <input
                        type="text"
                        className="w-full px-2 py-1 border rounded focus:outline-none "
                      ></input>
                    </td> */}
                    <td className="border border-gray-300 py-1">
                      <div className="flex justify-center">
                        <button
                          onClick={() =>
                            singleApproval(user._id, user.userId._id)
                          }
                          className={`${
                            isToggled[user._id] ? "bg-green-500" : "bg-gray-300"
                          } w-12 h-6 flex items-center rounded-full  transition-colors duration-300`}
                        >
                          <div
                            className={`${
                              isToggled[user._id]
                                ? "translate-x-6"
                                : "translate-x-0"
                            } w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300`}
                          ></div>
                        </button>
                      </div>
                    </td>
                    <td className="border border-gray-300 py-1">
                      <button
                        onClick={() => approveAll(user.userId._id)}
                        className={` px-4 py-0 rounded text-white transition-colors duration-300 ${
                          isSelected[user.userId._id]
                            ? "bg-green-500"
                            : "bg-orange-500"
                        }`}
                      >
                        All
                      </button>
                    </td>
                    <td className="border border-gray-300 py-1 relative">
                      <button onClick={() => toggleReject(user._id)}>
                        {leaveStatus[user._id] ? (
                          <FaCheckCircle className="text-green-500" />
                        ) : (
                          <FaTimesCircle className="text-red-500" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="11"
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    {loading
                      ? isOnsite
                        ? "Loading..."
                        : "Loading..."
                      : isOnsite
                      ? "No Onsite Request"
                      : "No Leave Request"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default LeaveApprovalAndPending
