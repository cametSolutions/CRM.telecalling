import { useState, useEffect, useRef } from "react"
import DeleteAlert from "./DeleteAlert"
import { toast } from "react-toastify"
import BarLoader from "react-spinners/BarLoader"
import MyDatePicker from "./MyDatePicker"
import api from "../../api/api"
// import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"
import dayjs from "dayjs"

const LeaveApprovalAndPending = () => {
const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loader, setLoader] = useState(false)
  const [leaveList, setLeaveList] = useState([])
  const [onsite, setonsite] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredlist, setFilteredlist] = useState([])
  const [allleaveRequest, setallleaveReques] = useState([])
  const [ispending, setPending] = useState(true)
  const [leaveStatus, setLeaveStatus] = useState({})
  const [isToggled, setIsToggled] = useState({})
  const [pendingOnsite, setpendingOnsite] = useState(false)
  const [pendingLeave, setPendingLeave] = useState(true)
  const [approvedLeave, setApprovedLeave] = useState(false)
  const [approvedOnsite, setapprovedOnsite] = useState(false)
  const [isSelected, setIsSelected] = useState({})
  const headerRef = useRef(null)
  const [tableHeight, setTableHeight] = useState("auto")
  const [dates, setDates] = useState({ startDate: "", endDate: "" })
useEffect(() => {
  const userData = localStorage.getItem("user")
  const user = JSON.parse(userData)
  setUser(user)
}, [])
  useEffect(() => {
    if (headerRef.current) {
      const headerHeight = headerRef.current.getBoundingClientRect().height
      setTableHeight(`calc(80vh - ${headerHeight}px)`) // Subtract header height from full viewport height
    }
  }, [])
  useEffect(() => {
    if (leaveList) {
      if (searchQuery) {
        const filtered = leaveList.filter((item) =>
          item.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        setFilteredlist(filtered)
      }
    } else {
      setFilteredlist([])
    }
  }, [searchQuery, leaveList])
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
    const fetchPendingList = async () => {
      if (
        (dates.startDate !== "" && dates.startDate !== null) &&
        (dates.endDate !== "" && dates.endDate !== null) &&
        user
      ) {
        try {

          setLoader(true)
          let response
          if (pendingLeave && !pendingOnsite) {

            response = await api.get(
              `/auth/pendingleaveList?onsite=false&startdate=${dates.startDate}&enddate=${dates.endDate}&role=${user?.role}&userid=${user?._id}`
            )
          } else if (pendingOnsite && !pendingLeave) {
            response = await api.get(
              `/auth/pendingOnsiteList?onsite=true&startdate=${dates.startDate}&enddate=${dates.endDate}&userid=${user?._id}&role=${user?.role}`
            )
          }

          const list = response.data.data
          setallleaveReques(list) // Assuming API returns data in response.data

          if (Array.isArray(list) && list.length > 0) {
            const filteredList =
              searchQuery.trim() === ""
                ? list // Show all data if search is empty
                : list?.filter((user) => {
                    const staffName = user?.userId?.name?.toLowerCase() || ""
                    return staffName.includes(searchQuery.toLowerCase())
                  })

            setLeaveList(filteredList) // Update state only if the list has items
            setLoading(false)
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
              initialToggles[userLeave?._id] =
                userLeave?.hrstatus === "HR/Onsite Approved" // Toggle on if approved
              initialReject[userLeave?._id] =
                userLeave?.hrstatus === "HR Rejected"
              initialSelectAll[userLeave?.userId?._id] =
                userLeave?.hrstatus === "HR/Onsite Approved"
            })
          } else {
            list.forEach((userLeave) => {
              // Check the `status` field for each leave and set the toggle accordingly
              initialToggles[userLeave?._id] =
                userLeave?.departmentstatus === "Dept Approved" // Toggle on if approved
              initialReject[userLeave._id] =
                userLeave?.departmentstatus === "Dept Rejected"
              initialSelectAll[userLeave?.userId?._id] =
                userLeave?.departmentstatus === "Dept Approved"
            })
          }
          setLoader(false)
          setIsToggled(initialToggles)
          setLeaveStatus(initialReject)
          setIsSelected(initialSelectAll)
        } catch (error) {
          console.error("Error fetching leave list:", error)
        }
      }
    }
    const fetchApprovedList = async () => {
      if (dates.startDate !== "" && dates.endDate !== "" && user) {
        try {
          setLoader(true)
          let response
          if (approvedOnsite && !approvedLeave) {
            response = await api.get(
              `/auth/approvedOnsiteList?onsite=true&startdate=${dates.startDate}&enddate=${dates.endDate}&role=${user?.role}&userid=${user?._id}`
            )
          } else if (approvedLeave && !approvedOnsite) {
            response = await api.get(
              `/auth/approvedLeaveList?onsite=false&startdate=${dates.startDate}&enddate=${dates.endDate}&userid=${user?._id}&role=${user?.role}`
            )
          }

          const list = response.data.data
          setallleaveReques(list) // Assuming API returns data in response.data

          if (Array.isArray(list) && list.length > 0) {
            const filteredList =
              searchQuery.trim() === ""
                ? list // Show all data if search is empty
                : list?.filter((user) => {
                    const staffName = user?.userId?.name?.toLowerCase() || ""
                    return staffName.includes(searchQuery.toLowerCase())
                  })

            setLeaveList(filteredList)
            setLoader(false)
            // Update state only if the list has items
          } else {
            setLoader(false)
            setLeaveList([])
          }

          // Initialize isToggled state based on the status of each leave request
          const initialToggles = {}
          const initialReject = {}
          const initialSelectAll = {}
          if (user.role === "Admin") {
            list.forEach((userLeave) => {
              const userId = userLeave?.userId?._id
              // Check the `status` field for each leave and set the toggle accordingly
              initialToggles[userLeave?._id] =
                userLeave?.hrstatus === "HR/Onsite Approved" // Toggle on if approved
              initialReject[userLeave?._id] =
                userLeave?.hrstatus === "HR Rejected"
              const userLeaves = list.filter(
                (leave) => leave?.userId?._id === userId
              )

              // Check if all are approved
              initialSelectAll[userId] = userLeaves.every(
                (leave) => leave.hrstatus === "HR/Onsite Approved"
              )
            })
          } else {
            list.forEach((userLeave) => {
              const userId = userLeave.userId._id
              // Check the `status` field for each leave and set the toggle accordingly
              initialToggles[userLeave?._id] =
                userLeave?.departmentstatus === "Dept Approved" // Toggle on if approved
              initialReject[userLeave?._id] =
                userLeave?.departmentstatus === "Dept Rejected"
              const userLeaves = list.filter(
                (leave) => leave?.userId?._id === userId
              )

              // Check if all are approved
              initialSelectAll[userId] = userLeaves.every(
                (leave) => leave.hrstatus === "Dept Approved"
              )
            })
          }
          setLoader(false)
          setIsToggled(initialToggles)
          setLeaveStatus(initialReject)
          setIsSelected(initialSelectAll)
        } catch (error) {
          console.error("Error fetching leave list:", error)
        }
      }
    }

    if (pendingLeave || pendingOnsite) {
      fetchPendingList()
    } else if (approvedLeave || approvedOnsite) {
      fetchApprovedList()
    } // Call the async function
  }, [dates, user, ispending])

  const ApprovedToggle = async () => {
    try {
      setLoader(true)
      setLoading(true)
      let response
      if (!approvedOnsite) {
        response = await api.get(
          `/auth/approvedOnsiteList?startdate=${dates.startDate}&enddate=${
            dates.endDate
          }&onsite=${true}&userid=${user?._id}&role=${user?.role}`
        )
        setapprovedOnsite(!approvedOnsite)
        setApprovedLeave(!approvedLeave)
        setonsite(true)
      } else {
        response = await api.get(
          `/auth/approvedLeaveList?onsite=${false}&startdate=${
            dates.startDate
          }&enddate=${dates.endDate}&userid=${user?._id}&role=${user?.role}`
        )
        setapprovedOnsite(!approvedOnsite)
        setApprovedLeave(!approvedLeave)
        setonsite(false)
      }

      const list = response.data.data // Assuming API returns data in response.data
      if (Array.isArray(list) && list.length > 0) {
        setLoader(false)
        setLoading(false)
        setLeaveList(list) // Update state only if the list has items
      } else {
        setLoader(false)
        setLoading(false)
        setLeaveList([])
      }

      // Initialize isToggled state based on the status of each leave request
      const initialToggles = {}
      const initialReject = {}
      const initialSelectAll = {}
      if (user?.role === "Admin") {
        list.forEach((userLeave) => {
          const userId = userLeave.userId._id
          // Check the `status` field for each leave and set the toggle accordingly
          initialToggles[userLeave?._id] =
            userLeave?.hrstatus === "HR/Onsite Approved" // Toggle on if approved
          initialReject[userLeave?._id] = userLeave.hrstatus === "HR Rejected"

          const userLeaves = list.filter(
            (leave) => leave?.userId?._id === userId
          )

          // Check if all are approved
          initialSelectAll[userId] = userLeaves.every(
            (leave) => leave.hrstatus === "HR/Onsite Approved"
          )
        })
      } else {
        list.forEach((userLeave) => {
          const userId = userLeave?.userId?._id
          // Check the `status` field for each leave and set the toggle accordingly
          initialToggles[userLeave?._id] =
            userLeave?.departmentstatus === "Dept Approved" // Toggle on if approved
          initialReject[userLeave?._id] =
            userLeave?.departmentstatus === "Dept Rejected"
          const userLeaves = list.filter((leave) => leave.userId._id === userId)

          // Check if all are approved
          initialSelectAll[userId] = userLeaves.every(
            (leave) => leave.hrstatus === "Dept Approved"
          )
        })
      }

      setIsSelected(initialSelectAll)
      setIsToggled(initialToggles)
      setLeaveStatus(initialReject)
    } catch (error) {
      console.log("error:", error.message)
    }
  }

  const PendingToggle = async () => {
    try {
      setLoader(true)
      setLoading(true)
      let response
      if (!pendingOnsite) {
        response = await api.get(
          `/auth/pendingonsiteList?onsite=true&startdate=${dates.startDate}&enddate=${dates.endDate}&userid=${user?._id}&role=${user?.role}`
        )
        setpendingOnsite(!pendingOnsite)
        setPendingLeave(!pendingLeave)
        setonsite(true)
      } else {
        response = await api.get(
          `/auth/pendingleaveList?onsite=false&startdate=${dates.startDate}&enddate=${dates.endDate}&userid=${user?._id}&role=${user?.role}`
        )
        setpendingOnsite(!pendingOnsite)
        setPendingLeave(!pendingLeave)
        setonsite(false)
      }

      const list = response.data.data // Assuming API returns data in response.data
      if (Array.isArray(list) && list.length > 0) {
        setLoader(false)
        setLoading(false)
        setLeaveList(list) // Update state only if the list has items
      } else {
        setLoader(false)
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
          initialToggles[userLeave?._id] =
            userLeave?.hrstatus === "HR/Onsite Approved" // Toggle on if approved
          initialReject[userLeave?._id] = userLeave.hrstatus === "HR Rejected"
          initialSelectAll[userLeave?.userId?._id] =
            userLeave?.hrstatus === "HR/Onsite Approved"
        })
      } else {
        list.forEach((userLeave) => {
          // Check the `status` field for each leave and set the toggle accordingly
          initialToggles[userLeave?._id] =
            userLeave?.departmentstatus === "Dept Approved" // Toggle on if approved
          initialReject[userLeave?._id] =
            userLeave?.departmentstatus === "Dept Rejected"
          initialSelectAll[userLeave?.userId?._id] =
            userLeave?.departmentstatus === "Dept Approved"
        })
      }

      setIsSelected(initialSelectAll)
      setIsToggled(initialToggles)
      setLeaveStatus(initialReject)
    } catch (error) {
      console.log("error:", error.message)
    }
  }
  const singleApprovalOrCancel = async (id, userId) => {
    try {
      const name = leaveList.find((item) => item._id === id)?.userId?.name

      setLoader(true)
      if (id in isToggled) {
        const isTrue = isToggled[id]
        if (isTrue) {
          let Cancel
          if (approvedLeave && !approvedOnsite) {
            Cancel = await api.put(
              `/auth/cancelLeaveApproval/?role=${
                user?.role
              }&selectedId=${id}&startDate=${dates.startDate}&endDate=${
                dates.endDate
              }&onsite=${false}&userId=${user?._id}&single=${true}&name=${name}`
            )
          } else if (approvedOnsite && !approvedLeave) {
            Cancel = await api.put(
              `/auth/cancelOnsiteApproval/?role=${
                user?.role
              }&selectedId=${id}&startDate=${dates.startDate}&endDate=${
                dates.endDate
              }&onsite=${true}&userId=${user?._id}&single=${true}&name=${name}`
            )
          }

          if (Cancel.status === 200) {
            const successCancel = Cancel.data.data
            toast.success(Cancel.data.message)
            setLeaveList(successCancel)
            setIsToggled((prevState) => ({
              ...prevState,
              [id]: !prevState[id] // Toggle the specific user's state
            }))
            setIsSelected((prevState) => ({
              ...prevState,
              [userId]: !prevState[userId] // Toggle the specific user's state
            }))

            setLoader(false)
          }
        } else {
          let Approve

          if (pendingOnsite && !pendingLeave) {
            Approve = await api.put(
              `/auth/approveOnsite/?role=${
                user?.role
              }&selectedId=${id}&startDate=${dates.startDate}&endDate=${
                dates.endDate
              }&onsite=${true}&userId=${
                user?._id
              }&single=${true}&name=${name}&isPending=true`
            )
          } else if (!pendingOnsite && pendingLeave) {
            Approve = await api.put(
              `/auth/approveLeave/?role=${user?.role}&selectedId=${id}&userId=${
                user?._id
              }&startDate=${dates.startDate}&endDate=${
                dates.endDate
              }&single=${true}&onsite=${false}&name=${name}&isPending=true`
            )
          } else if (approvedLeave && !approvedOnsite) {
            Approve = await api.put(
              `/auth/approveLeave/?role=${user?.role}&selectedId=${id}&userId=${
                user?._id
              }&startDate=${dates.startDate}&endDate=${
                dates.endDate
              }&single=${true}&onsite=${false}&name=${name}&isPending=false`
            )
          } else if (approvedOnsite && !approvedLeave) {
            Approve = await api.put(
              `/auth/approveOnsite/?role=${
                user?.role
              }&selectedId=${id}&startDate=${dates.startDate}&endDate=${
                dates.endDate
              }&onsite=${true}&userId=${
                user?._id
              }&single=${true}&name=${name}&isPending=false`
            )
          }
          if (Approve.status === 200) {
            const successApprove = Approve.data.data
            toast.success(Approve.data.message)
            setLeaveList(successApprove)
            setIsToggled((prevState) => ({
              ...prevState,
              [id]: !prevState[id] // Toggle the specific user's state
            }))
            setIsSelected((prevState) => ({
              ...prevState,
              [userId]: !prevState[userId] // Toggle the specific user's state
            }))

            setLoader(false)
          }
        }
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const toggleReject = async (id, category) => {
    try {
      setLoader(true)

      const states = {
        pendingOnsite,
        approvedOnsite,
        pendingLeave,
        approvedLeave
      }

      const trueState = Object.keys(states).find((key) => states[key] === true)

      const checkOnsite =
        pendingOnsite || approvedOnsite
          ? true
          : pendingLeave || approvedLeave
          ? false
          : false

      if (checkOnsite) {
        const onsiteReject = await api.put(
          `/auth/rejectOnsite/?role=${user.role}&selectedId=${id}&userId=${user._id}&startdate=${dates.startDate}&enddate=${dates.endDate}&feild=${trueState}`
        )

        if (onsiteReject.status === 200) {
          const list = onsiteReject.data.data

          const initialToggles = {}
          const initialSelectAll = {}

          if (user?.role === "Admin") {
            list.forEach((userOnsite) => {
              // Check the `status` field for each leave and set the toggle accordingly
              initialToggles[userOnsite?._id] =
                userOnsite?.hrstatus === "HR/Onsite Approved" // Toggle on if approved
              initialSelectAll[userOnsite._id] =
                userOnsite.hrstatus === "HR/Onsite Approved"
            })
          } else {
            list.forEach((userOnsite) => {
              // Check the `status` field for each leave and set the toggle accordingly
              initialToggles[userOnsite?._id] =
                userOnsite?.departmentstatus === "Dept Approved" // Toggle on if approved
              initialSelectAll[userOnsite.userId._id] =
                userOnsite?.departmentstatus === "Dept Approved"
            })
          }
          setIsToggled(initialToggles)
          setIsSelected(initialSelectAll)
          setLeaveList(list)

          setLeaveStatus((prevState) => ({
            ...prevState,
            [id]: !prevState[id] // Toggle the specific user's state
          }))
          toast.success(onsiteReject.data.message)
          setLoader(false)
        }
      } else if (!checkOnsite) {
        const leaveReject = await api.put(
          `/auth/rejectLeave/?role=${user.role}&selectedId=${id}&userId=${user._id}&startdate=${dates.startDate}&enddate=${dates.endDate}&feild=${trueState}&leaveCategory=${category}`
        )

        if (leaveReject.status === 200) {
          const list = leaveReject.data.data

          const initialToggles = {}
          const initialSelectAll = {}

          if (user?.role === "Admin") {
            list.forEach((userLeave) => {
              // Check the `status` field for each leave and set the toggle accordingly
              initialToggles[userLeave?._id] =
                userLeave?.hrstatus === "HR/Onsite Approved" // Toggle on if approved
              initialSelectAll[userLeave?._id] =
                userLeave?.hrstatus === "HR/Onsite Approved"
            })
          } else {
            list.forEach((userLeave) => {
              // Check the `status` field for each leave and set the toggle accordingly
              initialToggles[userLeave?._id] =
                userLeave?.departmentstatus === "Dept Approved" // Toggle on if approved
              initialSelectAll[userLeave?.userId?._id] =
                userLeave?.departmentstatus === "Dept Approved"
            })
          }
          setIsToggled(initialToggles)
          setIsSelected(initialSelectAll)
          setLeaveList(list)

          setLeaveStatus((prevState) => ({
            ...prevState,
            [id]: !prevState[id] // Toggle the specific user's state
          }))
          toast.success(leaveReject.data.message)
          setLoader(false)
        }
      }
    } catch (error) {
      setLoader(false)
      console.log("error:", error.message)
      toast.error("An error occured ")
    }
  }

  const approveAll = async (id, userId) => {
    const name = leaveList.find((item) => item._id === id)?.userId?.name

    // return
    setLoader(true)
    pendingOnsite
    pendingLeave
    approvedLeave
    approvedOnsite
    let approveAllRequest
    let successAll
    if (pendingLeave) {
      approveAllRequest = await api.put(
        `/auth/approveLeave/?role=${
          user?.role
        }&selectedId=${userId}&selectAll=${true}&startDate=${
          dates.startDate
        }&endDate=${dates.endDate}&userId=${
          user?._id
        }&onsite=false&name=${name}&isPending=true`
      )
      successAll = approveAllRequest.data.data
    } else if (pendingOnsite) {
      approveAllRequest = await api.put(
        `/auth/approveOnsite/?role=${
          user?.role
        }&selectedId=${userId}&selectAll=${true}&startDate=${
          dates.startDate
        }&endDate=${dates.endDate}&userId=${
          user?._id
        }&onsite=true&isPending=true`
      )
      successAll = approveAllRequest.data.data
    } else if (approvedLeave) {
      approveAllRequest = await api.put(
        `/auth/approveLeave/?role=${
          user?.role
        }&selectedId=${userId}&selectAll=${true}&startDate=${
          dates.startDate
        }&endDate=${dates.endDate}&userId=${
          user?._id
        }&onsite=true&isPending=false`
      )
      successAll = approveAllRequest.data.data
    } else if (approvedOnsite) {
      approveAllRequest = await api.put(
        `/auth/approveOnsite/?role=${
          user?.role
        }&selectedId=${userId}&selectAll=${true}&startDate=${
          dates.startDate
        }&endDate=${dates.endDate}&userId=${
          user?._id
        }&onsite=true&isPending=false`
      )
      successAll = approveAllRequest.data.data
    }
    if (approveAllRequest.status === 200) {
      toast.success(approveAllRequest.data.message)
      setLeaveList(successAll)
      const selectedid = successAll
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

  const handleDropdownSelect = (option) => {
    if (option === "pending") {
      if (onsite) {
        setpendingOnsite(true)
        setPendingLeave(false)
        setapprovedOnsite(false)
        setApprovedLeave(false)
      } else {
        setPendingLeave(true)
        setpendingOnsite(false)
        setapprovedOnsite(false)
        setApprovedLeave(false)
      }

      setLoader(true)
      setPending(true)
    } else if (option === "approved") {
      if (onsite) {
        setapprovedOnsite(true)
        setpendingOnsite(!pendingOnsite)
        setApprovedLeave(false)
        setPendingLeave(false)
      } else {
        setApprovedLeave(true)
        setapprovedOnsite(false)
        setpendingOnsite(false)
        setPendingLeave(false)
      }
      setLoader(true)

      setPending(false)
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

      <div className="text-center px-3 md:px-8">
        <div ref={headerRef}>
          <h1 className="text-md md:text-2xl font-bold mb-1 mt-1 md:mt-2">
            Leave & Onsite Approval
          </h1>
          <div className="grid grid-cols-2 md:flex md:justify-around md:items-center mb-3 gap-3 ">
            {/* Search Bar */}
            <div className="flex justify-center">
              <input
                type="text"
                placeholder="Search by Staff Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 px-3 rounded-md py-1 w-[170px] sm:w-[200px] md:w-[300px]"
              />
            </div>

            {/* Toggle Button */}
            <div className="md:col-span-1 flex justify-center text-sm md:text-md">
              {ispending ? (
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2 font-bold">
                    {pendingOnsite ? "Pending Onsite" : "Pending Leave"}
                  </span>
                  <button
                    onClick={PendingToggle}
                    className={`${
                      pendingOnsite ? "bg-green-500" : "bg-gray-300"
                    } w-11 h-6 flex items-center rounded-full transition-colors duration-300`}
                  >
                    <div
                      className={`${
                        pendingOnsite ? "translate-x-5" : "translate-x-0"
                      } w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300`}
                    ></div>
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2 font-bold">
                    {approvedOnsite ? "Approved Onsite" : "Approved Leave"}
                  </span>
                  <button
                    onClick={ApprovedToggle}
                    className={`${
                      approvedOnsite ? "bg-green-500" : "bg-gray-300"
                    } w-11 h-6 flex items-center rounded-full transition-colors duration-300`}
                  >
                    <div
                      className={`${
                        approvedOnsite ? "translate-x-5" : "translate-x-0"
                      } w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300`}
                    ></div>
                  </button>
                </div>
              )}
            </div>
            {/* Dropdown */}
            <div className="flex gap-3">
              <div>
                <select
                  onChange={(e) => handleDropdownSelect(e.target.value)}
                  className="border rounded px-2 py-1 w-[120px] sm:w-[200px] md:w-auto"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                </select>
              </div>

              {/* Date Picker */}
              {dates.startDate && (
                <MyDatePicker
                  // handleSelect={handleDate}
                  setDates={setDates}
                  dates={dates}
                  // loader={setLoader}
                />
              )}
            </div>
          </div>
        </div>

        {/* Outer div with max height for scrolling the user list */}
        <div
          className="text-center overflow-y-auto "
          style={{ height: tableHeight }} // Dynamically set table height
        >
          <table className="min-w-full ">
            <thead className="bg-gray-300 sticky top-0 z-20 text-sm">
              <tr>
                <th className="border-l border-gray-300 py-2">No</th>
                <th className="py-2">Staff Name</th>

                <th className="py-2">Department</th>
                <th className="py-2">Branch</th>
                <th className="py-2">Apply Date</th>
                <th className="py-2">
                  {pendingLeave || approvedLeave
                    ? "Leave Date"
                    : pendingOnsite || approvedOnsite
                    ? "Onsite Date"
                    : ""}
                </th>
                <th className="py-2">
                  {pendingLeave || approvedLeave
                    ? "Leave Type"
                    : pendingOnsite || approvedOnsite
                    ? "Onsite Type"
                    : ""}
                </th>
                <th className="py-2">Shift</th>
                <th className="py-2">{pendingOnsite ? "Remarks" : "Reason"}</th>
                <th className="py-2">Dpt.Status</th>
                <th className="py-2">Hr.Status</th>
                <th className="py-2">Approve</th>
                <th className="py-2">Approve All</th>

                <th className="py-2">Reject</th>
                {/* <th className="border-r border-gray-300 py-3">Permissions</th> */}
              </tr>
            </thead>
            <tbody>
              {(searchQuery ? filteredlist : leaveList)?.length > 0 ? (
                (searchQuery ? filteredlist : leaveList)
                  .slice()
                  .sort((a, b) => {
                    const dateA = new Date(a.leaveDate || a.onsiteDate)
                    const dateB = new Date(b.leaveDate || b.onsiteDate)
                    return dateA - dateB
                  })
                  .map((user, index) => (
                    <tr key={user._id}>
                      <td className="border border-gray-300 py-1">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 py-1 px-1">
                        {user?.userId?.name}
                      </td>

                      <td className="border border-gray-300 py-1 px-1 ">
                        {user?.userId?.department?.department}
                      </td>
                      <td className="border border-gray-300 py-1 px-1">
                        {user?.userId?.selected
                          ?.map((branch) => branch?.branch_id?.branchName)
                          .join(", ")}
                      </td>
                      <td className="border border-gray-300 py-1 px-1">
                        {new Date(user?.createdAt).toLocaleDateString("en-GB", {
                          timeZone: "UTC",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric"
                        })}
                      </td>
                      <td className="border border-gray-300 py-1 px-1">
                        {pendingLeave || approvedLeave
                          ? new Date(user?.leaveDate).toLocaleDateString(
                              "en-GB",
                              {
                                timeZone: "UTC",
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric"
                              }
                            )
                          : pendingOnsite || approvedOnsite
                          ? new Date(user?.onsiteDate).toLocaleDateString(
                              "en-GB",
                              {
                                timeZone: "UTC",
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric"
                              }
                            )
                          : new Date(user?.leaveDate).toLocaleDateString(
                              "en-GB",
                              {
                                timeZone: "UTC",
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric"
                              }
                            )}
                      </td>
                      <td className="border border-gray-300 py-1 px-1 ">
                        {pendingLeave || approvedLeave
                          ? user?.leaveType
                          : pendingOnsite || approvedOnsite
                          ? user?.onsiteType
                          : user?.leaveType}
                      </td>
                      <td className="border border-gray-300 py-1 px-2">
                        {user?.halfDayPeriod}
                      </td>
                      <td className="border border-gray-300 py-1 px-2 ">
                        {user?.reason || user?.description}
                      </td>

                      <td className="border border-gray-300 py-1 px-1">
                        {user?.departmentstatus}
                      </td>
                      <td className="border border-gray-300 py-1 px-1">
                        {user?.hrstatus}
                      </td>

                      <td className="border border-gray-300 py-1 px-1">
                        <div className="flex justify-center  ">
                          <button
                            onClick={() =>
                              singleApprovalOrCancel(
                                user?._id,
                                user?.userId?._id
                              )
                            }
                            className={` ${
                              isToggled[user?._id]
                                ? "bg-green-500"
                                : "bg-gray-300"
                            } w-12 h-6 flex items-center rounded-full  transition-colors duration-300`}
                          >
                            <div
                              className={`${
                                isToggled[user?._id]
                                  ? "translate-x-6"
                                  : "translate-x-0"
                              } w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300`}
                            ></div>
                          </button>
                        </div>
                      </td>
                      <td className="border border-gray-300 py-1 px-1">
                        <button
                          onClick={() =>
                            approveAll(user?._id, user?.userId?._id)
                          }
                          className={` px-4 py-0 rounded text-white transition-colors duration-300 ${
                            isSelected[user?.userId?._id]
                              ? "bg-green-500"
                              : "bg-orange-500"
                          }`}
                        >
                          All
                        </button>
                      </td>
                      <td className="border border-gray-300 py-1 relative px-1">
                        <DeleteAlert
                          onDelete={toggleReject}
                          Id={user._id} //pass document id
                          category={user?.leaveCategory}
                        />
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td
                    colSpan="14"
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    {loading
                      ? pendingOnsite
                        ? "Loading..."
                        : "Loading..."
                      : pendingOnsite
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

// import { useState } from "react"
// import dayjs from "dayjs"
// import { BarLoader } from "react-spinners"
// // import MyDatePicker from "./MyDatePicker";
// // import DeleteAlert from "./DeleteAlert";
// import UseFetch from "../../hooks/useFetch"
// import { useEffect } from "react"
// import api from "../../api/api"

// const MyDatePicker = ({ setDates, dates, compact = false }) => (
//   <div
//     className={`grid ${compact ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2"} gap-2`}
//   >
//     <input
//       type="date"
//       className="w-full h-9 px-3 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//       value={dayjs(dates.startDate).format("YYYY-MM-DD")}
//       onChange={(e) =>
//         setDates((prev) => ({
//           ...prev,
//           startDate: e.target.value,
//           endDate: dayjs(e.target.value).isAfter(dayjs(prev.endDate))
//             ? e.target.value
//             : prev.endDate
//         }))
//       }
//     />
//     <input
//       type="date"
//       className="w-full h-9 px-3 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//       value={dayjs(dates.endDate).format("YYYY-MM-DD")}
//       min={dayjs(dates.startDate).format("YYYY-MM-DD")}
//       onChange={(e) =>
//         setDates((prev) => ({
//           ...prev,
//           endDate: e.target.value
//         }))
//       }
//     />
//   </div>
// )

// const DeleteAlert = ({ onDelete, Id, category }) => (
//   <button
//     onClick={() => onDelete(Id, category)}
//     className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 transition-colors"
//     title="Reject"
//   >
//     <svg
//       className="w-4 h-4"
//       fill="none"
//       stroke="currentColor"
//       viewBox="0 0 24 24"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M6 18L18 6M6 6l12 12"
//       />
//     </svg>
//   </button>
// )

// const getStatusBadge = (status) => {
//   const s = status?.toLowerCase()
//   const map = {
//     approved: "bg-green-100 text-green-700 border-green-200",
//     pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
//     rejected: "bg-red-100 text-red-700 border-red-200"
//   }

//   return (
//     <span
//       className={`px-2 py-0.5 text-xs font-medium rounded-full border ${
//         map[s] || "bg-gray-100 text-gray-600 border-gray-200"
//       }`}
//     >
//       {status || "—"}
//     </span>
//   )
// }

// const statCardClasses = {
//   blue: "bg-blue-50 border-blue-200 text-blue-700 subtext-blue-600",
//   green: "bg-green-50 border-green-200 text-green-700 subtext-green-600",
//   yellow: "bg-yellow-50 border-yellow-200 text-yellow-700 subtext-yellow-600",
//   purple: "bg-purple-50 border-purple-200 text-purple-700 subtext-purple-600"
// }

// export default function LeaveOnsiteApproval() {
//   const [loader, setLoader] = useState(false)
// const [onsite, setonsite] = useState(false)
//   const [user, setUser] = useState(null)
//   const [approvedLeave, setApprovedLeave] = useState(false)
//   const [approvedOnsite, setapprovedOnsite] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [searchQuery, setSearchQuery] = useState("")
//   const [leaveList, setLeaveList] = useState([])
//   console.log(leaveList)
//   const [filteredlist, setFilteredlist] = useState([])
//   const [isToggled, setIsToggled] = useState({})
//   const [isSelected, setIsSelected] = useState({})
//   const [dates, setDates] = useState({
//     startDate: dayjs().startOf("month").toDate(),
//     endDate: dayjs().endOf("month").toDate()
//   })

//   const [ispending, setIspending] = useState(true)
//   const [pendingOnsite, setPendingOnsite] = useState(false)
//   const [mispunchMode, setMispunchMode] = useState(false)

//   const pendingLeave = ispending && !pendingOnsite
//   useEffect(() => {
//     const userData = localStorage.getItem("user")
//     const user = JSON.parse(userData)
//     setUser(user)
//   }, [])
//   const modeLabel = mispunchMode
//     ? "Mispunch"
//     : ispending
//       ? pendingOnsite
//         ? "Pending Onsite"
//         : "Pending Leave"
//       : approvedOnsite
//         ? "Approved Onsite"
//         : "Approved Leave"

//   const dateColHeader = mispunchMode
//     ? "Mispunch Date"
//     : pendingLeave || approvedLeave
//       ? "Leave Date"
//       : "Onsite Date"

//   const PendingToggle = () => setPendingOnsite((p) => !p)

//   const ApprovedToggle = async () => {
//     console.log("Hhh")
//     try {
//       setLoader(true)
//       setLoading(true)
//       let response
//       if (!approvedOnsite) {
//         console.log("Hhhh")
// console.log(dates)
//         response = await api.get(
//           `/auth/approvedOnsiteList?startdate=${dates.startDate}&enddate=${
//             dates.endDate
//           }&onsite=${true}&userid=${user?._id}&role=${user?.role}`
//         )
// console.log("hhhhhhh")
//         setapprovedOnsite(!approvedOnsite)
//         setApprovedLeave(!approvedLeave)
//         setonsite(true)
//         console.log("HH")
//       } else {
//         console.log("hhh")
//         response = await api.get(
//           `/auth/approvedLeaveList?onsite=${false}&startdate=${
//             dates.startDate
//           }&enddate=${dates.endDate}&userid=${user?._id}&role=${user?.role}`
//         )
//         setapprovedOnsite(!approvedOnsite)
//         setApprovedLeave(!approvedLeave)
//         setonsite(false)
//         console.log("hh")
//       }

//       const list = response.data.data // Assuming API returns data in response.data
//       console.log(list)
//       if (Array.isArray(list) && list.length > 0) {
//         setLoader(false)
//         setLoading(false)
//         setLeaveList(list) // Update state only if the list has items
//       } else {
//         setLoader(false)
//         setLoading(false)
//         setLeaveList([])
//       }

//       // Initialize isToggled state based on the status of each leave request
//       const initialToggles = {}
//       const initialReject = {}
//       const initialSelectAll = {}
//       if (user?.role === "Admin") {
//         list.forEach((userLeave) => {
//           const userId = userLeave.userId._id
//           // Check the `status` field for each leave and set the toggle accordingly
//           initialToggles[userLeave?._id] =
//             userLeave?.hrstatus === "HR/Onsite Approved" // Toggle on if approved
//           initialReject[userLeave?._id] = userLeave.hrstatus === "HR Rejected"

//           const userLeaves = list.filter(
//             (leave) => leave?.userId?._id === userId
//           )

//           // Check if all are approved
//           initialSelectAll[userId] = userLeaves.every(
//             (leave) => leave.hrstatus === "HR/Onsite Approved"
//           )
//         })
//       } else {
//         list.forEach((userLeave) => {
//           const userId = userLeave?.userId?._id
//           // Check the `status` field for each leave and set the toggle accordingly
//           initialToggles[userLeave?._id] =
//             userLeave?.departmentstatus === "Dept Approved" // Toggle on if approved
//           initialReject[userLeave?._id] =
//             userLeave?.departmentstatus === "Dept Rejected"
//           const userLeaves = list.filter((leave) => leave.userId._id === userId)

//           // Check if all are approved
//           initialSelectAll[userId] = userLeaves.every(
//             (leave) => leave.hrstatus === "Dept Approved"
//           )
//         })
//       }

//       setIsSelected(initialSelectAll)
//       setIsToggled(initialToggles)
//       setLeaveStatus(initialReject)
//     } catch (error) {
//       console.log("error:", error.message)
//     }
//   }
//   const handleDropdownSelect = (val) => setIspending(val === "pending")

//   const toggleMispunch = () => {
//     setMispunchMode((p) => !p)
//     // TODO: call mispunch API here
//   }

//   const singleApprovalOrCancel = (id, userId) => {
//     setIsToggled((prev) => ({ ...prev, [id]: !prev[id] }))
//     // TODO: API call here
//   }

//   const approveAll = (id, userId) => {
//     setIsSelected((prev) => ({ ...prev, [userId]: !prev[userId] }))
//     // TODO: API call here
//   }

//   const toggleReject = (id, category) => {
//     setLeaveList((prev) => prev.filter((r) => r._id !== id))
//     // TODO: API call here
//   }

//   const displayList = (searchQuery ? filteredlist : leaveList)
//     .slice()
//     .sort(
//       (a, b) =>
//         new Date(a.leaveDate || a.onsiteDate || a.mispunchDate) -
//         new Date(b.leaveDate || b.onsiteDate || b.mispunchDate)
//     )
//   console.log(leaveList)
//   console.log(displayList)
//   console.log(filteredlist)
//   const approvedCount = Object.values(isToggled).filter(Boolean).length
//   const pendingCount = Math.max(displayList.length - approvedCount, 0)

//   const stats = [
//     { label: "Total", value: leaveList.length, color: "blue" },
//     { label: "Approved", value: approvedCount, color: "green" },
//     { label: "Pending", value: pendingCount, color: "yellow" },
//     {
//       label: "Date Range",
//       value: `${dayjs(dates.startDate).format("MMM DD")} - ${dayjs(dates.endDate).format("MMM DD")}`,
//       color: "purple"
//     }
//   ]

//   return (
//     // <div className="h-full overflow-hidden bg-[#ADD8E6] flex flex-col">
//     //   {loader && (
//     //     <div className="fixed top-0 left-0 right-0 z-50">
//     //       <BarLoader
//     //         cssOverride={{ width: "100%", height: "4px" }}
//     //         color="#3B82F6"
//     //       />
//     //     </div>
//     //   )}

//     //   <div className="flex flex-col h-full px-3 sm:px-4 md:px-6 py-3 gap-3">

//     //     <div className="shrink-0 bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
//     //       {/* Row 1: title + search on right */}
//     //       <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
//     //         <div>
//     //           <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 leading-tight">
//     //             {mispunchMode
//     //               ? "Mispunch Approval"
//     //               : pendingOnsite || approvedOnsite
//     //                 ? "Onsite Approval"
//     //                 : "Leave Approval"}
//     //           </h1>
//     //           <p className="text-xs text-gray-500 mt-0.5">
//     //             {mispunchMode
//     //               ? "Manage and approve mispunch requests"
//     //               : "Manage and approve employee leave and onsite requests"}
//     //           </p>
//     //         </div>

//     //         {/* Search in top-right */}
//     //         <div className="w-full sm:w-64">
//     //           <label className="block text-[11px] font-medium text-gray-600 mb-1">
//     //             Search
//     //           </label>
//     //           <div className="relative">
//     //             <svg
//     //               className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
//     //               fill="none"
//     //               stroke="currentColor"
//     //               viewBox="0 0 24 24"
//     //             >
//     //               <path
//     //                 strokeLinecap="round"
//     //                 strokeLinejoin="round"
//     //                 strokeWidth={2}
//     //                 d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//     //               />
//     //             </svg>
//     //             <input
//     //               type="text"
//     //               placeholder="Search staff..."
//     //               value={searchQuery}
//     //               onChange={(e) => setSearchQuery(e.target.value)}
//     //               className="w-full h-9 pl-9 pr-3 text-xs sm:text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//     //             />
//     //           </div>
//     //         </div>
//     //       </div>

//     //       {/* Row 2: mispunch + request type + status + date range */}
//     //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
//     //         {/* Mispunch */}
//     //         <div>
//     //           <label className="block text-[11px] font-medium text-gray-600 mb-1">
//     //             Mispunch Mode
//     //           </label>
//     //           <div className="h-9 flex items-center justify-between rounded-lg border border-gray-300 bg-gray-50 px-3">
//     //             <span className="text-xs sm:text-sm font-medium text-gray-700">
//     //               Mispunch
//     //             </span>
//     //             <button
//     //               onClick={toggleMispunch}
//     //               aria-label="Toggle mispunch mode"
//     //               className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
//     //                 mispunchMode ? "bg-indigo-600" : "bg-gray-300"
//     //               }`}
//     //             >
//     //               <span
//     //                 className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
//     //                   mispunchMode ? "translate-x-5" : "translate-x-1"
//     //                 }`}
//     //               />
//     //             </button>
//     //           </div>
//     //         </div>

//     //         {/* Request Type */}
//     //         {!mispunchMode && (
//     //           <div>
//     //             <label className="block text-[11px] font-medium text-gray-600 mb-1">
//     //               Request Type
//     //             </label>
//     //             <div className="h-9 flex items-center justify-between rounded-lg border border-gray-300 bg-gray-50 px-3">
//     //               <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">
//     //                 {modeLabel}
//     //               </span>
//     //               <button
//     //                 onClick={ispending ? PendingToggle : ApprovedToggle}
//     //                 aria-label="Toggle onsite or leave"
//     //                 className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
//     //                   (ispending && pendingOnsite) ||
//     //                   (!ispending && approvedOnsite)
//     //                     ? "bg-blue-600"
//     //                     : "bg-gray-300"
//     //                 }`}
//     //               >
//     //                 <span
//     //                   className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
//     //                     (ispending && pendingOnsite) ||
//     //                     (!ispending && approvedOnsite)
//     //                       ? "translate-x-5"
//     //                       : "translate-x-1"
//     //                   }`}
//     //                 />
//     //               </button>
//     //             </div>
//     //           </div>
//     //         )}

//     //         {/* Status */}
//     //         {!mispunchMode && (
//     //           <div>
//     //             <label className="block text-[11px] font-medium text-gray-600 mb-1">
//     //               Status
//     //             </label>
//     //             <div className="relative">
//     //               <select
//     //                 onChange={(e) => handleDropdownSelect(e.target.value)}
//     //                 value={ispending ? "pending" : "approved"}
//     //                 className="w-full h-9 pl-3 pr-8 text-xs sm:text-sm border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer"
//     //               >
//     //                 <option value="pending">Pending</option>
//     //                 <option value="approved">Approved</option>
//     //               </select>
//     //               <svg
//     //                 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
//     //                 fill="none"
//     //                 stroke="currentColor"
//     //                 viewBox="0 0 24 24"
//     //               >
//     //                 <path
//     //                   strokeLinecap="round"
//     //                   strokeLinejoin="round"
//     //                   strokeWidth={2}
//     //                   d="M19 9l-7 7-7-7"
//     //                 />
//     //               </svg>
//     //             </div>
//     //           </div>
//     //         )}

//     //         {/* Date Range — stays on same row on desktop */}
//     //         {dates.startDate && (
//     //           <div>
//     //             <label className="block text-[11px] font-medium text-gray-600 mb-1">
//     //               Date Range
//     //             </label>
//     //             <MyDatePicker setDates={setDates} dates={dates} />
//     //           </div>
//     //         )}
//     //       </div>
//     //       {/* Stats */}
//     //       <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
//     //         {stats.map((item) => {
//     //           const cardBg =
//     //             item.color === "blue"
//     //               ? "bg-blue-50 border-blue-200"
//     //               : item.color === "green"
//     //                 ? "bg-green-50 border-green-200"
//     //                 : item.color === "yellow"
//     //                   ? "bg-yellow-50 border-yellow-200"
//     //                   : "bg-purple-50 border-purple-200"

//     //           const labelText =
//     //             item.color === "blue"
//     //               ? "text-blue-600"
//     //               : item.color === "green"
//     //                 ? "text-green-600"
//     //                 : item.color === "yellow"
//     //                   ? "text-yellow-600"
//     //                   : "text-purple-600"

//     //           const valueText =
//     //             item.color === "blue"
//     //               ? "text-blue-700"
//     //               : item.color === "green"
//     //                 ? "text-green-700"
//     //                 : item.color === "yellow"
//     //                   ? "text-yellow-700"
//     //                   : "text-purple-700"

//     //           return (
//     //             <div
//     //               key={item.label}
//     //               className={`rounded-lg p-2.5 border ${cardBg}`}
//     //             >
//     //               <p className={`text-xs font-medium ${labelText}`}>
//     //                 {item.label}
//     //               </p>
//     //               <p className={`text-sm font-bold mt-0.5 ${valueText}`}>
//     //                 {item.value}
//     //               </p>
//     //             </div>
//     //           )
//     //         })}
//     //       </div>
//     //     </div>

//     //     <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
//     //       <div className="flex-1 overflow-auto">
//     //         <table className="min-w-full divide-y divide-gray-200 text-xs">
//     //           <thead className="bg-gray-50 sticky top-0 z-10">
//     //             <tr>
//     //               <th className="px-2 py-2.5 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
//     //                 #
//     //               </th>
//     //               <th className="px-3 py-2.5 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
//     //                 Name
//     //               </th>
//     //               <th className="px-3 py-2.5 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">
//     //                 Dept
//     //               </th>
//     //               <th className="px-3 py-2.5 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">
//     //                 Branch
//     //               </th>
//     //               <th className="px-3 py-2.5 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">
//     //                 Apply Date
//     //               </th>
//     //               <th className="px-3 py-2.5 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
//     //                 {dateColHeader}
//     //               </th>
//     //               <th className="px-3 py-2.5 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">
//     //                 Type
//     //               </th>
//     //               <th className="px-3 py-2.5 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden xl:table-cell">
//     //                 Shift
//     //               </th>
//     //               <th className="px-3 py-2.5 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden xl:table-cell">
//     //                 Reason
//     //               </th>
//     //               <th className="px-3 py-2.5 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden xl:table-cell">
//     //                 Dept Status
//     //               </th>
//     //               <th className="px-3 py-2.5 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden xl:table-cell">
//     //                 HR Status
//     //               </th>
//     //               <th className="px-3 py-2.5 text-center font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
//     //                 Approve
//     //               </th>
//     //               <th className="px-3 py-2.5 text-center font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">
//     //                 All
//     //               </th>
//     //               <th className="px-3 py-2.5 text-center font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
//     //                 Reject
//     //               </th>
//     //             </tr>
//     //           </thead>

//     //           <tbody className="bg-white divide-y divide-gray-100">
//     //             {displayList.length > 0 ? (
//     //               displayList.map((user, index) => {
//     //                 const dateVal =
//     //                   pendingLeave || approvedLeave
//     //                     ? user?.leaveDate
//     //                     : mispunchMode
//     //                       ? user?.mispunchDate
//     //                       : user?.onsiteDate

//     //                 return (
//     //                   <tr
//     //                     key={user._id}
//     //                     className="hover:bg-blue-50 transition-colors duration-150"
//     //                   >
//     //                     <td className="px-2 py-2.5 whitespace-nowrap font-medium text-gray-500">
//     //                       {index + 1}
//     //                     </td>

//     //                     <td className="px-3 py-2.5 whitespace-nowrap">
//     //                       <div className="flex items-center gap-2">
//     //                         <div className="h-7 w-7 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shrink-0">
//     //                           <span className="text-white text-xs font-semibold">
//     //                             {user?.userId?.name?.charAt(0)?.toUpperCase()}
//     //                           </span>
//     //                         </div>
//     //                         <div className="min-w-0">
//     //                           <div className="font-medium text-gray-900 truncate max-w-[100px] sm:max-w-none">
//     //                             {user?.userId?.name}
//     //                           </div>
//     //                           <div className="text-gray-500 sm:hidden truncate max-w-[100px]">
//     //                             {user?.userId?.department?.department}
//     //                           </div>
//     //                         </div>
//     //                       </div>
//     //                     </td>

//     //                     <td className="px-3 py-2.5 text-gray-700 whitespace-nowrap hidden sm:table-cell">
//     //                       {user?.userId?.department?.department}
//     //                     </td>

//     //                     <td className="px-3 py-2.5 text-gray-700 hidden md:table-cell">
//     //                       <div className="max-w-[120px] truncate">
//     //                         {user?.userId?.selected
//     //                           ?.map((b) => b?.branch_id?.branchName)
//     //                           .join(", ")}
//     //                       </div>
//     //                     </td>

//     //                     <td className="px-3 py-2.5 text-gray-700 whitespace-nowrap hidden lg:table-cell">
//     //                       {new Date(user?.createdAt).toLocaleDateString(
//     //                         "en-GB",
//     //                         {
//     //                           timeZone: "UTC",
//     //                           day: "2-digit",
//     //                           month: "short",
//     //                           year: "numeric"
//     //                         }
//     //                       )}
//     //                     </td>

//     //                     <td className="px-3 py-2.5 text-gray-700 whitespace-nowrap">
//     //                       {dateVal
//     //                         ? new Date(dateVal).toLocaleDateString("en-GB", {
//     //                             timeZone: "UTC",
//     //                             day: "2-digit",
//     //                             month: "short",
//     //                             year: "numeric"
//     //                           })
//     //                         : "—"}
//     //                     </td>

//     //                     <td className="px-3 py-2.5 whitespace-nowrap hidden md:table-cell">
//     //                       <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700 border border-purple-200">
//     //                         {mispunchMode
//     //                           ? user?.mispunchType
//     //                           : pendingLeave || approvedLeave
//     //                             ? user?.leaveType
//     //                             : user?.onsiteType}
//     //                       </span>
//     //                     </td>

//     //                     <td className="px-3 py-2.5 text-gray-700 whitespace-nowrap hidden xl:table-cell">
//     //                       {user?.halfDayPeriod || "—"}
//     //                     </td>

//     //                     <td className="px-3 py-2.5 text-gray-700 hidden xl:table-cell">
//     //                       <div
//     //                         className="max-w-[160px] truncate"
//     //                         title={user?.reason || user?.description}
//     //                       >
//     //                         {user?.reason || user?.description || "—"}
//     //                       </div>
//     //                     </td>

//     //                     <td className="px-3 py-2.5 whitespace-nowrap hidden xl:table-cell">
//     //                       {getStatusBadge(user?.departmentstatus)}
//     //                     </td>

//     //                     <td className="px-3 py-2.5 whitespace-nowrap hidden xl:table-cell">
//     //                       {getStatusBadge(user?.hrstatus)}
//     //                     </td>

//     //                     <td className="px-3 py-2.5 whitespace-nowrap">
//     //                       <div className="flex justify-center">
//     //                         <button
//     //                           onClick={() =>
//     //                             singleApprovalOrCancel(
//     //                               user?._id,
//     //                               user?.userId?._id
//     //                             )
//     //                           }
//     //                           aria-label={
//     //                             isToggled[user?._id]
//     //                               ? "Revoke approval"
//     //                               : "Approve"
//     //                           }
//     //                           className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 ${
//     //                             isToggled[user?._id]
//     //                               ? "bg-green-500"
//     //                               : "bg-gray-300"
//     //                           }`}
//     //                         >
//     //                           <span
//     //                             className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
//     //                               isToggled[user?._id]
//     //                                 ? "translate-x-6"
//     //                                 : "translate-x-1"
//     //                             }`}
//     //                           />
//     //                         </button>
//     //                       </div>
//     //                     </td>

//     //                     <td className="px-3 py-2.5 whitespace-nowrap hidden md:table-cell">
//     //                       <div className="flex justify-center">
//     //                         <button
//     //                           onClick={() =>
//     //                             approveAll(user?._id, user?.userId?._id)
//     //                           }
//     //                           className={`px-3 py-1 rounded-lg text-xs font-medium text-white transition-all duration-200 ${
//     //                             isSelected[user?.userId?._id]
//     //                               ? "bg-green-500 hover:bg-green-600"
//     //                               : "bg-orange-500 hover:bg-orange-600"
//     //                           }`}
//     //                         >
//     //                           All
//     //                         </button>
//     //                       </div>
//     //                     </td>

//     //                     <td className="px-3 py-2.5 whitespace-nowrap">
//     //                       <div className="flex justify-center">
//     //                         <DeleteAlert
//     //                           onDelete={toggleReject}
//     //                           Id={user._id}
//     //                           category={user?.leaveCategory}
//     //                         />
//     //                       </div>
//     //                     </td>
//     //                   </tr>
//     //                 )
//     //               })
//     //             ) : (
//     //               <tr>
//     //                 <td colSpan="14" className="px-4 py-12 text-center">
//     //                   <div className="flex flex-col items-center justify-center gap-2">
//     //                     <svg
//     //                       className="w-12 h-12 text-gray-300"
//     //                       fill="none"
//     //                       stroke="currentColor"
//     //                       viewBox="0 0 24 24"
//     //                     >
//     //                       <path
//     //                         strokeLinecap="round"
//     //                         strokeLinejoin="round"
//     //                         strokeWidth={1.5}
//     //                         d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//     //                       />
//     //                     </svg>
//     //                     <p className="text-gray-500 text-sm font-medium">
//     //                       {loading
//     //                         ? "Loading requests..."
//     //                         : mispunchMode
//     //                           ? "No mispunch requests found"
//     //                           : pendingOnsite || approvedOnsite
//     //                             ? "No onsite requests found"
//     //                             : "No leave requests found"}
//     //                     </p>
//     //                     <p className="text-gray-400 text-xs">
//     //                       Try adjusting your filters or date range
//     //                     </p>
//     //                   </div>
//     //                 </td>
//     //               </tr>
//     //             )}
//     //           </tbody>
//     //         </table>
//     //       </div>
//     //     </div>
//     //   </div>
//     // </div>

//     <div className="h-full overflow-hidden bg-[#ADD8E6] flex flex-col">
//       {loader && (
//         <div className="fixed top-0 left-0 right-0 z-50">
//           <BarLoader
//             cssOverride={{ width: "100%", height: "4px" }}
//             color="#3B82F6"
//           />
//         </div>
//       )}

//       <div className="flex flex-col h-full px-3 sm:px-4 md:px-5 py-2 gap-2">
//         {/* Compact Header */}
//         <div className="shrink-0 bg-white rounded-xl shadow-sm border border-gray-200 p-3">
//           {/* Top row */}
//           <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-2 mb-2">
//             <div>
//               <h1 className="text-lg sm:text-xl font-bold text-gray-800 leading-tight">
//                 {mispunchMode
//                   ? "Mispunch Approval"
//                   : pendingOnsite || approvedOnsite
//                     ? "Onsite Approval"
//                     : "Leave Approval"}
//               </h1>
//             </div>

//             {/* Search on right */}
//             <div className="w-full lg:w-64">
//               <div className="relative">
//                 <svg
//                   className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                   />
//                 </svg>
//                 <input
//                   type="text"
//                   placeholder="Search staff..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full h-9 pl-9 pr-3 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Controls row */}
//           <div
//             className={`grid gap-2 ${
//               mispunchMode
//                 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2"
//                 : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
//             }`}
//           >
//             {/* Mispunch Toggle */}
//             <div className="h-9 flex items-center justify-between rounded-lg border border-gray-300 bg-gray-50 px-3">
//               <span className="text-sm font-medium text-gray-700">
//                 Mispunch
//               </span>
//               <button
//                 onClick={toggleMispunch}
//                 aria-label="Toggle mispunch mode"
//                 className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
//                   mispunchMode ? "bg-indigo-600" : "bg-gray-300"
//                 }`}
//               >
//                 <span
//                   className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
//                     mispunchMode ? "translate-x-5" : "translate-x-1"
//                   }`}
//                 />
//               </button>
//             </div>

//             {/* Request Type */}
//             {!mispunchMode && (
//               <div className="h-9 flex items-center justify-between rounded-lg border border-gray-300 bg-gray-50 px-3">
//                 <span className="text-sm font-medium text-gray-700 truncate">
//                   {modeLabel}
//                 </span>
//                 <button
//                   onClick={ispending ? PendingToggle : ApprovedToggle}
//                   aria-label="Toggle onsite or leave"
//                   className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
//                     (ispending && pendingOnsite) ||
//                     (!ispending && approvedOnsite)
//                       ? "bg-blue-600"
//                       : "bg-gray-300"
//                   }`}
//                 >
//                   <span
//                     className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
//                       (ispending && pendingOnsite) ||
//                       (!ispending && approvedOnsite)
//                         ? "translate-x-5"
//                         : "translate-x-1"
//                     }`}
//                   />
//                 </button>
//               </div>
//             )}

//             {/* Status */}
//             {!mispunchMode && (
//               <div className="relative">
//                 <select
//                   onChange={(e) => handleDropdownSelect(e.target.value)}
//                   value={ispending ? "pending" : "approved"}
//                   className="w-full h-9 pl-3 pr-8 text-sm border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer"
//                 >
//                   <option value="pending">Pending</option>
//                   <option value="approved">Approved</option>
//                 </select>
//                 <svg
//                   className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M19 9l-7 7-7-7"
//                   />
//                 </svg>
//               </div>
//             )}

//             {/* Date Range */}
//             {dates.startDate && (
//               <MyDatePicker setDates={setDates} dates={dates} compact />
//             )}
//           </div>
//         </div>

//         {/* Table */}
//         <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
//           <div className="flex-1 overflow-auto">
//             <table className="min-w-full divide-y divide-gray-200 text-xs">
//               <thead className="bg-gray-50 sticky top-0 z-10">
//                 <tr>
//                   <th className="px-2 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
//                     #
//                   </th>
//                   <th className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
//                     Name
//                   </th>
//                   <th className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">
//                     Dept
//                   </th>
//                   <th className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">
//                     Branch
//                   </th>
//                   <th className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">
//                     Apply Date
//                   </th>
//                   <th className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
//                     {dateColHeader}
//                   </th>
//                   <th className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">
//                     Type
//                   </th>
//                   <th className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden xl:table-cell">
//                     Shift
//                   </th>
//                   <th className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden xl:table-cell">
//                     Reason
//                   </th>
//                   <th className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden xl:table-cell">
//                     Dept Status
//                   </th>
//                   <th className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden xl:table-cell">
//                     HR Status
//                   </th>
//                   <th className="px-3 py-2 text-center font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
//                     Approve
//                   </th>
//                   <th className="px-3 py-2 text-center font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">
//                     All
//                   </th>
//                   <th className="px-3 py-2 text-center font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
//                     Reject
//                   </th>
//                 </tr>
//               </thead>

//               <tbody className="bg-white divide-y divide-gray-100">
//                 {displayList.length > 0 ? (
//                   displayList.map((user, index) => {
//                     const dateVal =
//                       pendingLeave || approvedLeave
//                         ? user?.leaveDate
//                         : mispunchMode
//                           ? user?.mispunchDate
//                           : user?.onsiteDate

//                     return (
//                       <tr
//                         key={user._id}
//                         className="hover:bg-blue-50 transition-colors duration-150"
//                       >
//                         <td className="px-2 py-2 whitespace-nowrap font-medium text-gray-500">
//                           {index + 1}
//                         </td>

//                         <td className="px-3 py-2 whitespace-nowrap">
//                           <div className="flex items-center gap-2">
//                             <div className="h-7 w-7 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shrink-0">
//                               <span className="text-white text-xs font-semibold">
//                                 {user?.userId?.name?.charAt(0)?.toUpperCase()}
//                               </span>
//                             </div>
//                             <div className="min-w-0">
//                               <div className="font-medium text-gray-900 truncate max-w-[100px] sm:max-w-none">
//                                 {user?.userId?.name}
//                               </div>
//                               <div className="text-gray-500 sm:hidden truncate max-w-[100px]">
//                                 {user?.userId?.department?.department}
//                               </div>
//                             </div>
//                           </div>
//                         </td>

//                         <td className="px-3 py-2 text-gray-700 whitespace-nowrap hidden sm:table-cell">
//                           {user?.userId?.department?.department}
//                         </td>

//                         <td className="px-3 py-2 text-gray-700 hidden md:table-cell">
//                           <div className="max-w-[120px] truncate">
//                             {user?.userId?.selected
//                               ?.map((b) => b?.branch_id?.branchName)
//                               .join(", ")}
//                           </div>
//                         </td>

//                         <td className="px-3 py-2 text-gray-700 whitespace-nowrap hidden lg:table-cell">
//                           {new Date(user?.createdAt).toLocaleDateString(
//                             "en-GB",
//                             {
//                               timeZone: "UTC",
//                               day: "2-digit",
//                               month: "short",
//                               year: "numeric"
//                             }
//                           )}
//                         </td>

//                         <td className="px-3 py-2 text-gray-700 whitespace-nowrap">
//                           {dateVal
//                             ? new Date(dateVal).toLocaleDateString("en-GB", {
//                                 timeZone: "UTC",
//                                 day: "2-digit",
//                                 month: "short",
//                                 year: "numeric"
//                               })
//                             : "—"}
//                         </td>

//                         <td className="px-3 py-2 whitespace-nowrap hidden md:table-cell">
//                           <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700 border border-purple-200">
//                             {mispunchMode
//                               ? user?.mispunchType
//                               : pendingLeave || approvedLeave
//                                 ? user?.leaveType
//                                 : user?.onsiteType}
//                           </span>
//                         </td>

//                         <td className="px-3 py-2 text-gray-700 whitespace-nowrap hidden xl:table-cell">
//                           {user?.halfDayPeriod || "—"}
//                         </td>

//                         <td className="px-3 py-2 text-gray-700 hidden xl:table-cell">
//                           <div
//                             className="max-w-[160px] truncate"
//                             title={user?.reason || user?.description}
//                           >
//                             {user?.reason || user?.description || "—"}
//                           </div>
//                         </td>

//                         <td className="px-3 py-2 whitespace-nowrap hidden xl:table-cell">
//                           {getStatusBadge(user?.departmentstatus)}
//                         </td>

//                         <td className="px-3 py-2 whitespace-nowrap hidden xl:table-cell">
//                           {getStatusBadge(user?.hrstatus)}
//                         </td>

//                         <td className="px-3 py-2 whitespace-nowrap">
//                           <div className="flex justify-center">
//                             <button
//                               onClick={() =>
//                                 singleApprovalOrCancel(
//                                   user?._id,
//                                   user?.userId?._id
//                                 )
//                               }
//                               aria-label={
//                                 isToggled[user?._id]
//                                   ? "Revoke approval"
//                                   : "Approve"
//                               }
//                               className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 ${
//                                 isToggled[user?._id]
//                                   ? "bg-green-500"
//                                   : "bg-gray-300"
//                               }`}
//                             >
//                               <span
//                                 className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
//                                   isToggled[user?._id]
//                                     ? "translate-x-6"
//                                     : "translate-x-1"
//                                 }`}
//                               />
//                             </button>
//                           </div>
//                         </td>

//                         <td className="px-3 py-2 whitespace-nowrap hidden md:table-cell">
//                           <div className="flex justify-center">
//                             <button
//                               onClick={() =>
//                                 approveAll(user?._id, user?.userId?._id)
//                               }
//                               className={`px-3 py-1 rounded-lg text-xs font-medium text-white transition-all duration-200 ${
//                                 isSelected[user?.userId?._id]
//                                   ? "bg-green-500 hover:bg-green-600"
//                                   : "bg-orange-500 hover:bg-orange-600"
//                               }`}
//                             >
//                               All
//                             </button>
//                           </div>
//                         </td>

//                         <td className="px-3 py-2 whitespace-nowrap">
//                           <div className="flex justify-center">
//                             <DeleteAlert
//                               onDelete={toggleReject}
//                               Id={user._id}
//                               category={user?.leaveCategory}
//                             />
//                           </div>
//                         </td>
//                       </tr>
//                     )
//                   })
//                 ) : (
//                   <tr>
//                     <td colSpan="14" className="px-4 py-10 text-center">
//                       <div className="flex flex-col items-center justify-center gap-2">
//                         <svg
//                           className="w-10 h-10 text-gray-300"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={1.5}
//                             d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                           />
//                         </svg>
//                         <p className="text-gray-500 text-sm font-medium">
//                           {loading
//                             ? "Loading requests..."
//                             : mispunchMode
//                               ? "No mispunch requests found"
//                               : pendingOnsite || approvedOnsite
//                                 ? "No onsite requests found"
//                                 : "No leave requests found"}
//                         </p>
//                         <p className="text-gray-400 text-xs">
//                           Try adjusting your filters or date range
//                         </p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
