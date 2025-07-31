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
