// import React, { useEffect, useState } from "react"
// import { toast } from "react-toastify"
// import dayjs from "dayjs"
// import { FaArrowRight } from "react-icons/fa"
// import BarLoader from "react-spinners/BarLoader"
// import { HiChevronLeft, HiChevronRight } from "react-icons/hi" // Impo
// import UseFetch from "../../hooks/useFetch"
// import api from "../../api/api"

// function LeaveApplication() {
//   const [events, setEvents] = useState([])
//   // const [ownCalander,setOwnCalander]=useState()
//   const [edit, setEdit] = useState(null)
//   const [showTypeSelector, setShowTypeSelector] = useState(false)
//   const [selectedType, setSelectedType] = useState("") // leave | onsite | mispunch
//   const [isHaveCompensatoryleave, setcompensatoryLeave] = useState(false)
//   const [selectedDate, setSelectedDate] = useState(new Date())
//   const [visibleDays, setVisibleDays] = useState([])
//   const [BalanceprivilegeleaveCount, setBalanceprivilegeLeaveCount] =
//     useState(0)
//   const [BalancesickleaveCount, setBalansickLeaveCount] = useState(0)
//   const [visibleMonth, setVisibleMonth] = useState("")
//   const [currentDate, setCurrentDate] = useState(new Date())
//   const [leaveBalance, setLeaveBalance] = useState({})
//   const [BalancedcasualleaveCount, setBalancecasualLeaveCount] = useState(0)
//   const [BalancecompensatoryleaveCount, setBalancecompensatoryLeaveCount] =
//     useState(0)
//   const [allleaves, setAllleaves] = useState([])
//   const [allOnsites, setAllOnsite] = useState([])
//   const [errors, setErrors] = useState({})

//   const [MonthData, setMonthData] = useState({})
//   const [currentMonthData, setcurrentMonthData] = useState({})
//   const [currentMonth, setCurrentMonth] = useState(null)
//   const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
//   const [message, setMessage] = useState({
//     top: "",
//     bottom: ""
//   })
//   console.log(message)
//   const [showModal, setShowModal] = useState(false)
//   console.log(showModal)
//   const [pastDate, setPastDate] = useState(null)
//   const [selectedTab, setSelectedTab] = useState("Leave")
//   const [formData, setFormData] = useState({
//     leaveDate: "",
//     onsiteDate: "",
//     formerOnsiteDate: "",
//     leaveType: "Full Day",
//     onsiteType: "Full Day",

//     halfDayPeriod: "Morning",
//     onsite: false,
//     leaveCategory: "",
//     reason: "",
//     description: "",
//     eventId: null
//   })

//   const [isOnsite, setIsOnsite] = useState(false)
//   const [loader, setLoader] = useState(false)
//   const [tableRows, setTableRows] = useState([])
//   const [clickedDate, setclickedDate] = useState(null)
//   const [currentmonthleaveData, setcurrentmonthLeaveData] = useState([])
//   const [currentmonthonsiteData, setcurrentmonthOnsiteData] = useState([])
//   const userData = localStorage.getItem("user")
//   const tabs = ["Leave", "Onsite"]
//   const user = JSON.parse(userData)
//   console.log(user)
//   const { data: leaves, refreshHook } = UseFetch(
//     user && `/auth/getallLeave?userid=${user._id}`
//   )
//   const { data: compensatoryleaves, refreshHook: refreshHookCompensatory } =
//     UseFetch(user && `/auth/getallcompensatoryleave?userid=${user._id}`)
//   const { data: monthlyHoly } = UseFetch(
//     currentMonth &&
//       `/customer/getallCurrentmonthHoly?currentmonth=${currentMonth}`
//   )
//   const { data: allonsite, refreshHook: refreshHookOnsite } = UseFetch(
//     user && `/auth/getallOnsite?userid=${user._id}`
//   )
//   const { data: leavemasterleavecount } = UseFetch(
//     "/auth/getleavemasterleavecount"
//   )
//   useEffect(() => {
//     if (MonthData && currentMonth) {
//       setcurrentMonthData(MonthData[currentMonth])
//     }
//   }, [currentMonth, MonthData])

//   useEffect(() => {
//     const year = currentDate.getFullYear()
//     const month = String(currentDate.getMonth() + 1).padStart(2, "0") // Convert to "01-12" format
//     setCurrentMonth(`${year}-${month}`)
//   }, [currentDate])
//   useEffect(() => {
//     const filteredcurrentmonthlyLeaves = allleaves?.filter((leaves) => {
//       ///leavedate is iso format like "2025-03-03T12:00:00Z" so here slice 0 takes the first part and get the first 7 means 2025-03 because current month includes year also 2025-03
//       const leaveMonth = leaves.leaveDate.split("T")[0].slice(0, 7)
//       //here currentMonth have year and month no date
//       return leaveMonth === currentMonth
//     })
//     setcurrentmonthLeaveData(filteredcurrentmonthlyLeaves)
//   }, [allleaves, currentDate, currentMonth])
//   useEffect(() => {
//     if ((leaves && leaves.length > 0) || (allonsite && allonsite.length) > 0) {
//       setAllleaves(leaves)
//       setAllOnsite(allonsite)
//     }
//   }, [leaves, allonsite])
//   useEffect(() => {
//     if (allOnsites && allOnsites.length > 0) {
//       const filteredcurrentmonthlyOnsites = allOnsites?.filter((onsites) => {
//         ///onsitedate is iso format like "2025-03-03T12:00:00Z" so here slice 0 takes the first part and get the first 7 means 2025-03 because current month includes year also 2025-03
//         const onsiteMonth = onsites.onsiteDate.split("T")[0].slice(0, 7)

//         //here currentMonth have year and month no date
//         return onsiteMonth === currentMonth
//       })
//       setcurrentmonthOnsiteData(filteredcurrentmonthlyOnsites)
//     }
//   }, [allOnsites, currentMonth])
//   useEffect(() => {
//     const days = []

//     const year = currentDate.getFullYear()
//     const month = currentDate.getMonth() + 1
//     setCurrentYear(year)

//     // Set month name
//     setVisibleMonth(
//       `${currentDate.toLocaleString("default", { month: "long" })} ${year}`
//     )

//     // Get last day of the month
//     const lastDay = new Date(year, month, 0).getDate()

//     // Generate all days in the month
//     for (let i = 1; i <= lastDay; i++) {
//       const date = new Date(year, month - 1, i + 1)

//       days.push({
//         fullDate: date.toISOString().split("T")[0], // Format: YYYY-MM-DD
//         fullMonthDay: date.toLocaleDateString("en-GB", {
//           day: "2-digit",
//           month: "long",
//           year: "numeric",
//           timeZone: "UTC"
//         }), // Format: 07 March 2025
//         day: date
//       })
//     }

//     setVisibleDays(days)
//   }, [currentDate])
//   useEffect(() => {
//     const today = dayjs().format("YYYY-MM-DD") // Get today's date in YYYY-MM-DD format

//     const isPastDate =
//       formData?.leaveDate && dayjs(formData.leaveDate).isBefore(today)

//     setPastDate(isPastDate)
//   }, [formData])
//   console.log(allleaves)
//   useEffect(() => {
//     if (
//       allleaves &&
//       allleaves.length > 0 &&
//       leavemasterleavecount &&
//       compensatoryleaves >= 0
//     ) {
//       const currentDate = new Date()
//       const currentYear = currentDate.getFullYear()
//       const currentmonth = currentDate.getMonth() + 1
//       const leaveDate = formData?.leaveDate
//         ? new Date(formData?.leaveDate)
//         : new Date()
//       const leaveYear = leaveDate.getFullYear()

//       const privileageDate = new Date(user?.privilegeleavestartsfrom)
//       const privileagestartYear = privileageDate.getFullYear()
//       const privileagestartmonth = privileageDate.getMonth() + 1 // 1-based month
//       const casualstartDate = new Date(user?.casualleavestartsfrom)
//       const casualstartYear = casualstartDate.getFullYear()
//       const casualstartmonth = casualstartDate.getMonth() + 1 // 1-based month
//       console.log(casualstartDate)
//       const totalprivilegeLeave = leavemasterleavecount?.totalprivilegeLeave
//       const privilegePerMonth = totalprivilegeLeave / 12
//       const totalcasualLeave = leavemasterleavecount?.totalcasualleave
//       const casualPerMonth = totalcasualLeave / 12
//       let ownedprivilegeCount = 0
//       let ownedcasualCount = 0
//       console.log(casualstartYear)
//       console.log(currentYear)
//       if (casualstartYear < currentYear) {
//         let casualCount

//         if (casualstartYear < leaveYear && leaveYear < currentYear) {
//           casualCount = casualPerMonth
//         } else if (casualstartYear < leaveYear) {
//           casualCount = casualPerMonth
//         } else if (casualstartYear === leaveYear) {
//           casualCount = casualPerMonth
//         }
//         ownedcasualCount = casualCount
//       } else if (casualstartYear === currentYear) {
//         console.log(currentmonth)
//         console.log(casualstartmonth)
//         // If privilege started this year, give leaves from start month to current month
//         if (currentmonth >= casualstartmonth) {
//           ownedcasualCount = casualPerMonth
//         } else {
//           ownedcasualCount = 0
//         }
//       } else {
//         ownedcasualCount = 0
//       }

//       if (privileagestartYear < currentYear) {
//         let privilegeCount

//         if (privileagestartYear < leaveYear && leaveYear < currentYear) {
//           privilegeCount = 12 * privilegePerMonth
//         } else if (privileagestartYear < leaveYear) {
//           privilegeCount = currentmonth * privilegePerMonth
//         } else if (privileagestartYear === leaveYear) {
//           const monthsRemainingInStartYear = 12 - privileagestartmonth + 1 // Calculate remaining months including startMonth
//           privilegeCount = monthsRemainingInStartYear * privilegePerMonth
//         }
//         ownedprivilegeCount = privilegeCount
//       } else if (privileagestartYear === currentYear) {
//         // If privilege started this year, give leaves from start month to current month
//         if (currentmonth >= privileagestartmonth) {
//           ownedprivilegeCount =
//             (currentmonth - privileagestartmonth + 1) * privilegePerMonth
//         } else {
//           ownedprivilegeCount = 0 // Not eligible yet
//         }
//       } else {
//         // If privilege starts in a future year, no leaves yet
//         ownedprivilegeCount = 0
//       }
//       const filteredcurrentmonthlyLeaves = allleaves.filter((leaves) => {
//         ///leavedate is iso format like "2025-03-03T12:00:00Z" so here slice 0 takes the first part and get the first 7 means 2025-03 because current month includes year also 2025-03
//         const leaveMonth = leaves.leaveDate.split("T")[0].slice(0, 7)
//         //here currentMonth have year and month no date
//         return leaveMonth === currentMonth
//       })
//       setcurrentmonthLeaveData(filteredcurrentmonthlyLeaves)

//       const usedCasualCount = allleaves?.reduce((count, leave) => {
//         if (!leave.leaveDate) return count
//         const leaveDate = new Date(formData.leaveDate)
//         const leaveMonthYear = `${leaveDate.getFullYear()}-${String(
//           leaveDate.getMonth() + 1
//         ).padStart(2, "0")}`

//         const leaveDateObj = new Date(leave.leaveDate)
//         const leaveMonthYearFromData = `${leaveDateObj.getFullYear()}-${String(
//           leaveDateObj.getMonth() + 1
//         ).padStart(2, "0")}`
//         if (
//           leave.leaveCategory === "casual Leave" &&
//           leaveMonthYear === leaveMonthYearFromData
//         ) {
//           return count + (leave.leaveType === "Half Day" ? 0.5 : 1)
//         }

//         return count
//       }, 0)

//       const takenPrivilegeCount = allleaves?.reduce((count, leave) => {
//         if (!leave.leaveDate) return count

//         const leaveYear = new Date(formData.leaveDate).getFullYear()
//         const leaveYearFromData = new Date(leave.leaveDate).getFullYear()

//         if (
//           leave.leaveCategory === "privileage Leave" &&
//           leaveYear === leaveYearFromData
//         ) {
//           return count + (leave.leaveType === "Half Day" ? 0.5 : 1)
//         }

//         return count
//       }, 0)
//       console.log(ownedcasualCount)
//       const balancecasualcount = ownedcasualCount - usedCasualCount
//       const balanceprivilege = ownedprivilegeCount - takenPrivilegeCount
//       console.log(compensatoryleaves)
//       setBalanceprivilegeLeaveCount(Math.max(balanceprivilege, 0))
//       setBalancecasualLeaveCount(Math.max(balancecasualcount, 0))
//       setBalancecompensatoryLeaveCount(compensatoryleaves)
//       setLeaveBalance({
//         ...leaveBalance,
//         casual: Math.max(balancecasualcount, 0),
//         privilege: Math.max(balanceprivilege, 0),
//         sick: BalancesickleaveCount,
//         compensatory: compensatoryleaves
//       })
//     } else if (
//       (!allleaves && leavemasterleavecount) ||
//       (allleaves && allleaves.length === 0 && leavemasterleavecount) ||
//       compensatoryleaves >= 0
//     ) {
//       const currentDate = new Date()
//       const currentYear = currentDate.getFullYear()
//       const currentmonth = currentDate.getMonth() + 1
//       const leaveDate = formData.leaveDate
//         ? new Date(formData.leaveDate)
//         : new Date()
//       const leaveYear = leaveDate.getFullYear()
//       const privileagestartDate = new Date(user?.privilegeleavestartsfrom)
//       const privileagestartYear = privileagestartDate.getFullYear()
//       const privileagestartmonth = privileagestartDate.getMonth() + 1 // 1-based month
//       const casualstartDate = new Date(user?.privilegeleavestartsfrom)
//       const casualstartYear = casualstartDate.getFullYear()
//       const casualstartmonth = casualstartDate.getMonth() + 1 // 1-based month
//       const totalprivilegeLeave =
//         leavemasterleavecount?.totalprivilegeLeave || 0
//       const privilegePerMonth = totalprivilegeLeave / 12 // 1 or 2 per month
//       const totalcasualLeave = leavemasterleavecount?.totalcasualleave || 0
//       const casualPerMonth = totalcasualLeave / 12

//       let ownedprivilegeCount = 0
//       let ownedcasualCount = 0
//       if (casualstartYear < currentYear) {
//         let casualCount
//         if (casualstartYear < leaveYear && leaveYear < currentYear) {
//           casualCount = casualPerMonth
//         } else if (casualstartYear < leaveYear) {
//           casualCount = casualPerMonth
//         } else if (casualstartYear === leaveYear) {
//           casualCount = casualPerMonth
//         }
//         ownedcasualCount = casualCount
//       } else if (casualstartYear === currentYear) {
//         // If privilege started this year, give leaves from start month to current month
//         if (currentmonth >= casualstartmonth) {
//           ownedcasualCount = casualPerMonth
//         } else {
//           ownedcasualCount = 0
//         }
//       } else {
//         ownedcasualCount = 0
//       }
//       if (privileagestartYear < currentYear) {
//         let privilegeCount
//         if (privileagestartYear < leaveYear && leaveYear < currentYear) {
//           privilegeCount = 12 * privilegePerMonth
//         } else if (privileagestartYear < leaveYear) {
//           privilegeCount = currentmonth * privilegePerMonth
//         } else if (privileagestartYear === leaveYear) {
//           const monthsRemainingInStartYear = 12 - privileagestartmonth + 1 // Calculate remaining months including startMonth
//           privilegeCount = monthsRemainingInStartYear * privilegePerMonth
//         }
//         ownedprivilegeCount = privilegeCount
//       } else if (privileagestartYear === currentYear) {
//         // If privilege started this year, give leaves from start month to current month
//         if (currentmonth >= privileagestartmonth) {
//           ownedprivilegeCount =
//             (currentmonth - privileagestartmonth + 1) * privilegePerMonth
//         } else {
//           ownedprivilegeCount = 0 // Not eligible yet
//         }
//       } else {
//         // If privilege starts in a future year, no leaves yet
//         ownedprivilegeCount = 0
//       }

//       setBalanceprivilegeLeaveCount(ownedprivilegeCount)
//       setBalancecasualLeaveCount(ownedcasualCount)
//       setBalancecompensatoryLeaveCount(compensatoryleaves)
//       setLeaveBalance({
//         ...leaveBalance,
//         casual: ownedcasualCount,
//         privilege: ownedprivilegeCount,
//         sick: BalancesickleaveCount,
//         compensatory: compensatoryleaves
//       })
//     }
//   }, [
//     currentMonth,
//     allleaves,
//     leavemasterleavecount,
//     formData,
//     compensatoryleaves
//   ])

//   useEffect(() => {
//     if (isOnsite) {
//       setFormData((prev) => ({
//         ...prev,
//         onsite: true
//       }))
//     }
//   }, [isOnsite])

//   useEffect(() => {
//     if (
//       allleaves &&
//       allleaves.length > 0 &&
//       allOnsites &&
//       allOnsites.length > 0
//     ) {
//       const events = [...allleaves, ...allOnsites]
//       setEvents(events)
//     } else if (
//       (allleaves && allleaves.length > 0) ||
//       (allOnsites && allOnsites.length > 0)
//     ) {
//       if (allleaves) {
//         setEvents(allleaves)
//       } else if (allOnsites) {
//         setEvents(allOnsites)
//       }
//     }
//   }, [allleaves, allOnsites])

//   useEffect(() => {
//     if (!showModal) {
//       setIsOnsite(false)
//     }
//   }, [showModal])
//   useEffect(() => {
//     if (isOnsite && clickedDate) {
//       // Find the event that matches the clicked date
//       const existingEvent = events.filter((event) => {
//         const eventDate = event?.onsiteDate
//         if (!eventDate) return false
//         return (
//           event.onsiteDate.toString().split("T")[0] === clickedDate &&
//           event.onsiteData
//         )
//       })

//       // If a matching event is found and it has onsite data
//       if (existingEvent && existingEvent.length > 0) {
//         const matchedOnsiteData = existingEvent[0]?.onsiteData
//           ?.flat()
//           ?.map((status) => ({
//             siteName: status.siteName,
//             place: status.place,
//             Start: status.Start,
//             End: status.End,
//             km: status.km,
//             kmExpense: status.kmExpense,
//             foodExpense: status.foodExpense
//           }))

//         // Now set the table rows with the matched onsite data and an empty row for new input
//         setTableRows(matchedOnsiteData)
//       }
//     }
//   }, [isOnsite, clickedDate])

//   const addRow = () => {
//     setTableRows([
//       ...tableRows,
//       {
//         siteName: "",
//         place: "",
//         Start: "",
//         End: "",
//         km: "",
//         kmExpense: "",
//         foodExpense: ""
//       }
//     ])
//   }
//   console.log(selectedTab)
//   const handledelete = async (data) => {
//     try {
//       setLoader(true)
//       const payload = {
//         ...(data.leaveType
//           ? {
//               leaveType: data.leaveType,
//               reason: data.reason,
//               leaveDate: data.leaveDate,
//               leaveCategory: data.leaveCategory,
//               prevCategory: formData.prevCategory
//             }
//           : {
//               docId: data?.onsiteId,
//               onsiteType: data.onsiteType,
//               description: data.description,
//               onsiteDate: data.onsiteDate
//             })
//       }
//       const isLeave = "leaveType" in payload
//       const isOnsite = "onsiteType" in payload
//       let type = ""
//       if (isLeave) {
//         type = "leave"
//         const response = await api.post(
//           `/auth/deleteEvent?type=${type}&userid=${user._id}`,
//           payload
//         )
//         const data = response?.data?.data

//         if (response.status === 200) {
//           setLoader(false)

//           setAllleaves(data)
//           setShowModal(false)
//           setFormData({
//             startDate: "",

//             leaveType: "Full Day",
//             onsiteType: "Full Day",
//             formerOnsiteType: "",

//             halfDayPeriod: "",
//             onsite: false,
//             leaveCategory: "",
//             reason: "",
//             description: ""
//           })
//           setSelectedTab("Leave")
//           toast.success(response.data.message)
//         } else if (response.status === 201) {
//           setLoader(false)
//           setAllleaves(data)
//           setAllleaves([])
//           setShowModal(false)
//           setSelectedTab("Leave")
//           setFormData({
//             startDate: "",

//             leaveType: "Full Day",
//             onsiteType: "Full Day",
//             formerOnsiteType: "",
//             halfDayPeriod: "",
//             onsite: false,
//             leaveCategory: "",
//             reason: "",
//             description: ""
//           })
//           setSelectedTab("Leave")
//           toast.success(response.data.message)
//         }
//       } else if (isOnsite) {
//         type = "onsite"
//         const response = await api.post(
//           `/auth/deleteEvent?type=${type}&userid=${user._id}`,
//           payload
//         )
//         const data = response.data.data
//         if (response.status === 200) {
//           setLoader(false)
//           setMessage({ top: "", bottom: "" })
//           setAllOnsite(data)
//           refreshHook()
//           refreshHookCompensatory()

//           setTableRows([])
//           setSelectedTab("Leave")
//           setShowModal(false)
//           setFormData({
//             startDate: "",

//             leaveType: "Full Day",
//             onsiteType: "Full Day",
//             formerOnsiteType: "",
//             halfDayPeriod: "",
//             onsite: false,
//             leaveCategory: "",
//             reason: "",
//             description: ""
//           })
//           setSelectedTab("Leave")
//           toast.success(response.data.message)
//         } else if (response.status === 201) {
//           setLoader(false)
//           setAllOnsite(data)
//           setShowModal(false)
//           setMessage({ top: "", bottom: "" })
//           setAllOnsite([])
//           setTableRows([])
//           setFormData({
//             startDate: "",

//             leaveType: "Full Day",
//             onsiteType: "Full Day",
//             formerOnsiteType: "",
//             halfDayPeriod: "",
//             onsite: false,
//             leaveCategory: "",
//             reason: "",
//             description: ""
//           })
//           setSelectedTab("Leave")
//           toast.success(response.data.message)
//         }
//       }
//     } catch (error) {
//       setLoader(false)
//       setMessage((prev) => ({ ...prev, bottom: error.response.data.message }))
//       console.log(error.response.data.message)
//     }
//   }
//   console.log(formData)
//   const handleDateClick = (date) => {
//     console.log(date)
//     setclickedDate(date)
//     const clickedDate = date
//     const dayOfWeek = new Date(clickedDate).getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
//     const isSunday = dayOfWeek === 0

//     const isHoliday = monthlyHoly?.some((holiday) => {
//       const formattedHolyDate = holiday.holyDate.split("T")[0] // Extract YYYY-MM-DD
//       return formattedHolyDate === date
//     })
//     if (isHoliday || isSunday) {
//       setcompensatoryLeave(true)
//     }

//     const existingEvent = events?.filter((event) => {
//       const eventDate = event?.leaveDate // Normalize to YYYY-MM-DD

//       if (!eventDate) return false
//       return eventDate.toString().split("T")[0] === clickedDate // Compare only the date part
//     })

//     if (existingEvent && existingEvent.length > 0) {
//       setFormData({
//         ...formData,
//         leaveDate: existingEvent[0]?.leaveDate.toString().split("T")[0],
//         halfDayPeriod: existingEvent?.halfDayPeriod || "",
//         leaveType: existingEvent?.leaveType || "Full Day",

//         reason: existingEvent?.reason || ""
//       })

//       // Set the form data dynamically based on the relevant event
//     } else {
//       setFormData({
//         ...formData,
//         leaveDate: clickedDate,
//         onsiteDate: clickedDate,
//         misspunchDate: new Date(clickedDate).toLocaleString("en-GB", {
//           day: "2-digit",
//           month: "short",
//           year: "numeric"
//         }),
//         leaveType: "Full Day",
//         reason: "",
//         description: ""
//       })
//     }

//     // setShowModal(true)
//     setSelectedType("") // reset previous selection
//     setShowTypeSelector(true) // open radio popup
//   }
//   const handleTypeContinue = () => {
//     setShowTypeSelector(false)

//     if (selectedType === "leave") setSelectedTab("Leave")
//     if (selectedType === "onsite") setSelectedTab("Onsite")
//     if (selectedType === "mispunch") setSelectedTab("Mispunch")

//     // handleDateClick(selectedDate.fullDate)
//     setShowModal(true)
//   }

//   // Check if a date is the currently selected date
//   const isSelected = (date) => {
//     return date.toDateString() === selectedDate.toDateString()
//   }

//   // Check if a date is today
//   const isToday = (date) => {
//     const today = new Date()
//     return date.toDateString() === today.toDateString()
//   }

//   // Navigate to previous month
//   const prevMonth = () => {
//     const newDate = new Date(currentDate)
//     newDate.setMonth(newDate.getMonth() - 1)
//     setCurrentDate(newDate)
//   }

//   // Navigate to next month
//   const nextMonth = () => {
//     const newDate = new Date(currentDate)
//     newDate.setMonth(newDate.getMonth() + 1)
//     setCurrentDate(newDate)
//   }

//   // Go to current month
//   const goToToday = () => {
//     setCurrentDate(new Date())
//   }
//   console.log(tabs)
//   const handleDataChange = (e) => {
//     console.log(formData)
//     console.log(e)
//     setMessage((prev) => ({
//       ...prev,
//       top: "",
//       bottom: ""
//     }))
//     const { name, value } = e.target
//     if (name === "onsiteDate") {
//       const dayOfWeek = new Date(value).getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
//       const isSunday = dayOfWeek === 0

//       const isHoliday = monthlyHoly?.some((holiday) => {
//         const formattedHolyDate = holiday.holyDate.split("T")[0] // Extract YYYY-MM-DD
//         return formattedHolyDate === value
//       })
//       if (isHoliday || isSunday) {
//         setcompensatoryLeave(true)
//       } else {
//         setcompensatoryLeave(false)
//       }
//     }
//     // Access current values for leave type & category
//     const selectedCategory =
//       name === "leaveCategory" ? value : formData.leaveCategory

//     // Define leave balances (you may already have these as props or state)
//     const balances = {
//       "casual Leave": BalancedcasualleaveCount,
//       "privileage Leave": BalanceprivilegeleaveCount,
//       "compensatory Leave": BalancecompensatoryleaveCount,
//       "sick Leave": BalancesickleaveCount,
//       "other Leave": 1
//     }

//     // Get selected balance
//     const selectedBalance = balances[selectedCategory] ?? 0

//     // Check if switching to Full Day requires >= 1 leave
//     if (
//       name === "leaveType" &&
//       value === "Full Day" &&
//       selectedCategory &&
//       (edit && formData.prevCategory === selectedCategory
//         ? selectedBalance + 0.5 < 1
//         : selectedBalance < 1)
//     ) {
//       setMessage((prev) => ({
//         ...prev,
//         top: `You don't have enough ${selectedCategory} for a Full Day leave.`
//       }))
//       // setMessage(
//       //   `You don't have enough ${selectedCategory} for a Full Day leave.`
//       // )
//       return
//     }
//     if (value === "Half Day") {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//         halfDayPeriod: "Morning"
//       }))
//     } else {
//       if (message) setMessage("")
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value
//       }))
//     }

//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" })) // ✅ Clear error
//     }
//   }
//   const handleTimeChange = (type, field, value) => {
//     setselectedAttendance((prev) => {
//       // Ensure the nested object exists for `type`
//       const currentType = prev[type] || { hours: "", minutes: "", amPm: "" }

//       return {
//         ...prev,
//         [type]: {
//           ...currentType, // Preserve existing fields
//           [field]: value // Update the specific field
//         }
//       }
//     })
//   }
//   // const handleSubmit = async (tab) => {
//   //   console.log("enddddddddddddddddddddddddddddddddddddddddd")
//   //   try {
//   //     if (tab === "New Leave" || tab === "Edit Leave") {
//   //       const dayOfWeek = new Date(formData.leaveDate).getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
//   //       const isSunday = dayOfWeek === 0

//   //       const isHoliday = monthlyHoly?.some((holiday) => {
//   //         const formattedHolyDate = holiday.holyDate.split("T")[0] // Extract YYYY-MM-DD
//   //         return formattedHolyDate === formData.leaveDate
//   //       })

//   //       if (isSunday || isHoliday) {
//   //         setMessage((prev) => ({
//   //           ...prev,
//   //           bottom: "It's a holiday—you can't request leave."
//   //         }))
//   //         return
//   //       }
//   //     }

//   //     if (tab === "Leave" || tab === "New Leave" || tab === "Edit Leave") {
//   //       // Validation
//   //       let newErrors = {}
//   //       if (!formData.leaveType) newErrors.leaveType = "Shift is required"
//   //       if (formData.leaveType === "Half Day" && !formData.halfDayPeriod)
//   //         newErrors.halfDayPeriod = "Please select Half Day period"
//   //       if (!formData.leaveDate) newErrors.leaveDate = "Leave Date is required"
//   //       if (!formData.leaveCategory)
//   //         newErrors.leaveCategory = "Leave Type is required"
//   //       if (!formData.reason) newErrors.reason = "Reason is required"
//   //       if (Object.keys(newErrors).length > 0) {
//   //         console.log(newErrors)
//   //         setErrors(newErrors)
//   //         return
//   //       }
//   //       let isApprovedLeave
//   //       if (formData.leaveId) {
//   //         isApprovedLeave = allleaves?.find((leave) => {
//   //           const matchedid = leave._id === formData.leaveId

//   //           return (
//   //             matchedid && (leave.adminverified || leave.departmentverified)
//   //           )
//   //         })
//   //       }

//   //       if (isApprovedLeave) {
//   //         setMessage((prev) => ({
//   //           ...prev,
//   //           bottom: "This leave is already approved. Do not make any changes."
//   //         }))
//   //       } else {
//   //         setMessage({ top: "", bottom: "" })

//   //         //Assuming you have an API endpoint for creating leave requests
//   //         const response = await fetch(
//   //           `http://localhost:9000/api/auth/leave?selectedid=${user._id}&assignedto=${user.assignedto}`,
//   //           {
//   //             method: "POST",
//   //             headers: {
//   //               "Content-Type": "application/json"
//   //             },
//   //             body: JSON.stringify(formData),
//   //             credentials: "include"
//   //           }
//   //         )

//   //         // const response = await fetch(
//   //         //   `https://www.crm.camet.in/api/auth/leave?selectedid=${user._id}&assignedto=${user.assignedto}`,
//   //         //   {
//   //         //     method: "POST",
//   //         //     headers: {
//   //         //       "Content-Type": "application/json"
//   //         //     },
//   //         //     body: JSON.stringify(formData),
//   //         //     credentials: "include"
//   //         //   }
//   //         // )

//   //         const responseData = await response.json()

//   //         if (!response.ok) {
//   //           throw new Error("Failed to apply for leave")
//   //         } else {
//   //           setLoader(false)
//   //           setEdit(false)
//   //           if (response.status === 200) {
//   //             setSelectedTab("Leave")
//   //             refreshHook()
//   //             refreshHookCompensatory()

//   //             setFormData({
//   //               leaveDate: "",

//   //               leaveType: "Full Day",
//   //               onsiteType: "Full Day",

//   //               halfDayPeriod: "Morning",
//   //               onsite: false,
//   //               leaveCategory: "",
//   //               reason: "",
//   //               description: ""
//   //             })
//   //             setErrors("")
//   //             setShowModal(false)
//   //             toast.success(responseData.message)
//   //           } else if (response.status === 201) {
//   //             setMessage((prev) => ({
//   //               ...prev,
//   //               bottom: responseData.message
//   //             }))
//   //           }
//   //         }
//   //       }
//   //     } else if (tab === "New Onsite" || tab === "Edit Onsite") {
//   //       console.log("hhhhdddddddd")
//   //       // Validation
//   //       let newErrors = {}
//   //       if (!formData.onsiteType) newErrors.onsiteType = "Shift is required"
//   //       if (formData.onsiteType === "Half Day" && !formData.halfDayPeriod)
//   //         newErrors.halfDayPeriod = "Please select Half Day period"
//   //       if (!formData.onsiteDate)
//   //         newErrors.onsiteDate = "Onsite Date is required"
//   //       if (tableRows.length === 0)
//   //         newErrors.tabledataError = "Please add table data"
//   //       if (!formData.description)
//   //         newErrors.description = "Description is required"
//   //       if (Object.keys(newErrors).length > 0) {
//   //         setErrors(newErrors)
//   //         return
//   //       }

//   //       // Helper function to check if an onsite for a given date is already approved
//   //     const checkApprovedOnsiteByDate = (date) => {
//   //       return allOnsites?.find((onsite) => {
//   //         const onsiteDate = new Date(onsite.onsiteDate)

//   //         const isSameDate =
//   //           onsiteDate.getFullYear() === date.getFullYear() &&
//   //           onsiteDate.getMonth() === date.getMonth() &&
//   //           onsiteDate.getDate() === date.getDate()

//   //         return (
//   //           isSameDate && (onsite.adminverified || onsite.departmentverified)
//   //         )
//   //       })
//   //     }

//   //     // Helper function to check if two dates are the same
//   //     const isSameDate = (date1, date2) => {
//   //       return (
//   //         date1.getFullYear() === date2.getFullYear() &&
//   //         date1.getMonth() === date2.getMonth() &&
//   //         date1.getDate() === date2.getDate()
//   //       )
//   //     }

//   //     // For Edit Onsite, check if the original onsite was approved
//   //     if (tab === "Edit Onsite" && formData.formerOnsiteDate) {
//   //       const approvedFormerOnsite = checkApprovedOnsiteByDate(
//   //         new Date(formData.formerOnsiteDate)
//   //       )

//   //       if (approvedFormerOnsite) {
//   //         // Check if user is trying to change the date or onsite type
//   //         const isDateChanged = !isSameDate(
//   //           new Date(formData.onsiteDate),
//   //           new Date(formData.formerOnsiteDate)
//   //         )

//   //         const isOnsiteTypeChanged = formData.onsiteType !== formData.formerOnsiteType

//   //         if (isDateChanged || isOnsiteTypeChanged) {
//   //           setMessage((prev) => ({
//   //             ...prev,
//   //             bottom: "This onsite is already approved. You cannot change the date or onsite type. Only table data and description can be edited."
//   //           }))
//   //           return // Stop execution
//   //         }

//   //         // If neither date nor type changed, allow editing table and description
//   //         console.log("Approved onsite - allowing table and description edit only")
//   //       }
//   //     }

//   //     // For New Onsite or Edit Onsite (if not approved or not changing restricted fields)
//   //     // Check if there's already an approved onsite on the new date
//   //     const approvedOnsiteOnNewDate = checkApprovedOnsiteByDate(
//   //       new Date(formData.onsiteDate)
//   //     )

//   //     if (approvedOnsiteOnNewDate && tab === "New Onsite") {
//   //       setMessage((prev) => ({
//   //         ...prev,
//   //         bottom: "An approved onsite already exists for this date."
//   //       }))
//   //       return
//   //     }

//   //     // Clear any previous messages
//   //     setMessage({ top: "", bottom: "" })

//   //     // Proceed with API call
//   //     setLoader(true)

//   //         console.log(formData)

//   //         setLoader(true)
//   //         const response = await api.post(
//   //           `http://localhost:9000/api/auth/onsiteRegister?selectedid=${user._id}&assignedto=${user.assignedto}&compensatoryLeave=${isHaveCompensatoryleave}`,
//   //           { formData, tableRows }
//   //         )

//   //         // const response = await api.post(
//   //         //   `https://www.crm.camet.in/api/auth/onsiteRegister?selectedid=${user._id}&assignedto=${user.assignedto}&compensatoryLeave=${isHaveCompensatoryleave}`,
//   //         //   { formData, tableRows }
//   //         // )

//   //         if (response.status === 200) {
//   //           setcompensatoryLeave(false)
//   //           setLoader(false)
//   //           toast.success("Onsite applied successfully")
//   //           setSelectedTab("Leave")
//   //           setFormData((prev) => ({
//   //             ...prev,
//   //             leaveDate: "",
//   //             description: "",
//   //             onsite: false,
//   //             halfDayPeriod: "Morning",
//   //             onsiteType: "Full Day",
//   //             leaveType: "Full Day"
//   //           }))
//   //           setTableRows((prev) => [
//   //             {
//   //               ...prev,
//   //               siteName: "",
//   //               place: "",
//   //               Start: "",
//   //               End: "",
//   //               km: "",
//   //               kmExpense: "",
//   //               foodExpense: ""
//   //             }
//   //           ])
//   //           setShowModal(false)
//   //           refreshHook()
//   //           refreshHookOnsite()
//   //           refreshHookCompensatory()
//   //         } else if (response.status === 201) {
//   //           setLoader(false)
//   //           setMessage((prev) => ({
//   //             ...prev,
//   //             bottom: response.data.message
//   //           }))
//   //         }
//   //       }
//   //     }
//   //   } catch (error) {
//   //     setLoader(false)
//   //     setMessage((prev) => ({
//   //       ...prev,
//   //       bottom: error?.response?.data?.message
//   //     }))
//   //     console.log("error:", error)
//   //   }
//   // }
//   const handleSubmit = async (tab) => {
//     console.log(tab)
//     console.log("enddddddddddddddddddddddddddddddddddddddddd")
//     try {
//       if (tab === "New Leave" || tab === "Edit Leave") {
//         const dayOfWeek = new Date(formData.leaveDate).getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
//         const isSunday = dayOfWeek === 0

//         const isHoliday = monthlyHoly?.some((holiday) => {
//           const formattedHolyDate = holiday.holyDate.split("T")[0] // Extract YYYY-MM-DD
//           return formattedHolyDate === formData.leaveDate
//         })

//         if (isSunday || isHoliday) {
//           setMessage((prev) => ({
//             ...prev,
//             bottom: "It's a holiday—you can't request leave."
//           }))
//           return
//         }
//       }

//       if (tab === "Leave" || tab === "New Leave" || tab === "Edit Leave") {
//         // Validation
//         let newErrors = {}
//         if (!formData.leaveType) newErrors.leaveType = "Shift is required"
//         if (formData.leaveType === "Half Day" && !formData.halfDayPeriod)
//           newErrors.halfDayPeriod = "Please select Half Day period"
//         if (!formData.leaveDate) newErrors.leaveDate = "Leave Date is required"
//         if (!formData.leaveCategory)
//           newErrors.leaveCategory = "Leave Type is required"
//         if (!formData.reason) newErrors.reason = "Reason is required"
//         if (Object.keys(newErrors).length > 0) {
//           console.log(newErrors)
//           setErrors(newErrors)
//           return
//         }
//         let isApprovedLeave
//         if (formData.leaveId) {
//           isApprovedLeave = allleaves?.find((leave) => {
//             const matchedid = leave._id === formData.leaveId

//             return (
//               matchedid && (leave.adminverified || leave.departmentverified)
//             )
//           })
//         }

//         if (isApprovedLeave) {
//           setMessage((prev) => ({
//             ...prev,
//             bottom: "This leave is already approved. Do not make any changes."
//           }))
//         } else {
//           setMessage({ top: "", bottom: "" })

//           //Assuming you have an API endpoint for creating leave requests
//           // const response = await fetch(
//           //   `http://localhost:9000/api/auth/leave?selectedid=${user._id}&assignedto=${user.assignedto}`,
//           //   {
//           //     method: "POST",
//           //     headers: {
//           //       "Content-Type": "application/json"
//           //     },
//           //     body: JSON.stringify(formData),
//           //     credentials: "include"
//           //   }
//           // )

//           const response = await fetch(
//             `https://www.crm.camet.in/api/auth/leave?selectedid=${user._id}&assignedto=${user.assignedto}`,
//             {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json"
//               },
//               body: JSON.stringify(formData),
//               credentials: "include"
//             }
//           )

//           const responseData = await response.json()

//           if (!response.ok) {
//             throw new Error("Failed to apply for leave")
//           } else {
//             setLoader(false)
//             setEdit(false)
//             if (response.status === 200) {
//               setSelectedTab("Leave")
//               refreshHook()
//               refreshHookCompensatory()

//               setFormData({
//                 leaveDate: "",
//                 leaveType: "Full Day",
//                 onsiteType: "Full Day",
//                 halfDayPeriod: "Morning",
//                 onsite: false,
//                 leaveCategory: "",
//                 reason: "",
//                 description: ""
//               })
//               setErrors("")
//               setShowModal(false)
//               toast.success(responseData.message)
//             } else if (response.status === 201) {
//               setMessage((prev) => ({
//                 ...prev,
//                 bottom: responseData.message
//               }))
//             }
//           }
//         }
//       } else if (tab === "New Onsite" || tab === "Edit Onsite") {
//         console.log("Processing onsite request")

//         // Validation
//         let newErrors = {}
//         if (!formData.onsiteType) newErrors.onsiteType = "Shift is required"
//         if (formData.onsiteType === "Half Day" && !formData.halfDayPeriod)
//           newErrors.halfDayPeriod = "Please select Half Day period"
//         if (!formData.onsiteDate)
//           newErrors.onsiteDate = "Onsite Date is required"
//         if (tableRows.length === 0)
//           newErrors.tabledataError = "Please add table data"
//         if (!formData.description)
//           newErrors.description = "Description is required"

//         if (Object.keys(newErrors).length > 0) {
//           setErrors(newErrors)
//           return
//         }

//         // Helper function to check if an onsite for a given date is already approved
//         const checkApprovedOnsiteByDate = (date) => {
//           return allOnsites?.find((onsite) => {
//             const onsiteDate = new Date(onsite.onsiteDate)

//             const isSameDate =
//               onsiteDate.getFullYear() === date.getFullYear() &&
//               onsiteDate.getMonth() === date.getMonth() &&
//               onsiteDate.getDate() === date.getDate()

//             return (
//               isSameDate && (onsite.adminverified || onsite.departmentverified)
//             )
//           })
//         }

//         // Helper function to check if two dates are the same
//         const isSameDate = (date1, date2) => {
//           return (
//             date1.getFullYear() === date2.getFullYear() &&
//             date1.getMonth() === date2.getMonth() &&
//             date1.getDate() === date2.getDate()
//           )
//         }

//         // For Edit Onsite, check if the original onsite was approved
//         if (tab === "Edit Onsite" && formData.formerOnsiteDate) {
//           const approvedFormerOnsite = checkApprovedOnsiteByDate(
//             new Date(formData.formerOnsiteDate)
//           )

//           if (approvedFormerOnsite) {
//             // Check if user is trying to change the date or onsite type
//             const isDateChanged = !isSameDate(
//               new Date(formData.onsiteDate),
//               new Date(formData.formerOnsiteDate)
//             )
//             console.log(isDateChanged)
//             const isOnsiteTypeChanged =
//               formData.onsiteType !== formData.formerOnsiteType
//             console.log(isOnsiteTypeChanged)
//             if (isDateChanged || isOnsiteTypeChanged) {
//               setMessage((prev) => ({
//                 ...prev,
//                 bottom:
//                   "This onsite is already approved. You cannot change the date or onsite type. Only table data and description can be edited."
//               }))
//               return // Stop execution
//             }

//             // If neither date nor type changed, allow editing table and description
//             console.log(
//               "Approved onsite - allowing table and description edit only"
//             )
//           }
//         }

//         // For New Onsite or Edit Onsite (if not approved or not changing restricted fields)
//         // Check if there's already an approved onsite on the new date
//         const approvedOnsiteOnNewDate = checkApprovedOnsiteByDate(
//           new Date(formData.onsiteDate)
//         )

//         if (approvedOnsiteOnNewDate && tab === "New Onsite") {
//           setMessage((prev) => ({
//             ...prev,
//             bottom: "An approved onsite already exists for this date."
//           }))
//           return
//         }

//         // Clear any previous messages
//         setMessage({ top: "", bottom: "" })

//         // Proceed with API call
//         setLoader(true)
//         // const response = await api.post(
//         //   `http://localhost:9000/api/auth/onsiteRegister?selectedid=${user._id}&assignedto=${user.assignedto}&compensatoryLeave=${isHaveCompensatoryleave}`,
//         //   { formData, tableRows }
//         // )

//         const response = await api.post(
//           `https://www.crm.camet.in/api/auth/onsiteRegister?selectedid=${user._id}&assignedto=${user.assignedto}&compensatoryLeave=${isHaveCompensatoryleave}`,
//           { formData, tableRows }
//         )

//         if (response.status === 200) {
//           setcompensatoryLeave(false)
//           setLoader(false)
//           toast.success("Onsite applied successfully")
//           setSelectedTab("Leave")
//           setFormData((prev) => ({
//             ...prev,
//             leaveDate: "",
//             description: "",
//             onsite: false,
//             halfDayPeriod: "Morning",
//             onsiteType: "Full Day",
//             leaveType: "Full Day"
//           }))
//           setTableRows([
//             {
//               siteName: "",
//               place: "",
//               Start: "",
//               End: "",
//               km: "",
//               kmExpense: "",
//               foodExpense: ""
//             }
//           ])
//           setShowModal(false)
//           refreshHook()
//           refreshHookOnsite()
//           refreshHookCompensatory()
//         } else if (response.status === 201) {
//           setLoader(false)
//           setMessage((prev) => ({
//             ...prev,
//             bottom: response.data.message
//           }))
//         }
//       } else if (tab === "Misspunch") {
//         console.log("hhhhhh")
//         let newErrors = {}
//         console.log(formData)

//         const misspunchData = {
//           misspunchDate: formData.misspunchDate,
//           remark: formData?.remark,
//           misspunchType: formData?.mispunchType,
//           userId: user?._id,
//           userModel: user?.role
//         }
//         // const response = await api.post(
//         //   "http://localhost:9000/api/auth/misspunchRegister",
//         //   misspunchData
//         // )

//         const response = await api.post(
//           "https://www.crm.camet.in/api/auth/misspunchRegister",
//           misspunchData
//         )
//         if (response.status === 201 || response.status === 200) {
//           console.log("Success:", response.data)
//           toast.success("Misspunch registered")
//         }
//         console.log(misspunchData)
//       }
//       console.log("H")
//     } catch (error) {
//       setLoader(false)
//       setMessage((prev) => ({
//         ...prev,
//         bottom: error?.response?.data?.message || "An error occurred"
//       }))
//       console.log("error:", error)
//     }
//   }
//   const selectedTabContent = (value) => {
//     let existingEvent
//     switch (true) {
//       case value === "Leave":
//         existingEvent = events?.filter((event) => {
//           const eventDate = event?.leaveDate
//           if (!eventDate) return false
//           return eventDate === clickedDate // Compare only the date part
//         })
//         if (existingEvent && existingEvent.length > 0) {
//           setFormData({
//             ...formData,
//             leaveDate: existingEvent?.leaveDate,
//             halfDayPeriod: existingEvent?.halfDayPeriod || "",
//             leaveType: existingEvent?.leaveType || "",
//             reason: existingEvent?.reason || "",
//             onsite: false
//           })
//         } else {
//           setFormData({
//             ...formData,
//             leaveDate: clickedDate,

//             leaveType: "Full Day",
//             reason: "",
//             onsiteType: "",
//             onsite: false
//           })
//         }

//         // Handle the case where the fields are missing or falsy
//         break

//       case value === "Onsite":
//         existingEvent = events?.filter((event) => {
//           const eventDate = event?.onsiteDate
//           if (!eventDate) return false
//           return eventDate.toString().split("T")[0] === clickedDate // Compare only the date part
//         })
//         if (existingEvent && existingEvent.length > 0) {
//           console.log("hhhhhh")
//           // Set the form data dynamically based on the relevant event
//           setFormData({
//             onsiteDate: existingEvent[0]?.onsiteDate.toString().split("T")[0],
//             formerOnsiteDate: existingEvent[0]?.onsiteDate
//               .toString()
//               .split("T")[0],
//             formerOnsiteType: existingEvent[0]?.onsiteType,

//             onsiteType: existingEvent[0]?.onsiteType || "",
//             halfDayPeriod: existingEvent[0]?.halfDayPeriod || "",
//             description: existingEvent[0]?.description || "",
//             onsite: true
//           })
//         } else {
//           setFormData({
//             ...formData,
//             onsiteDate: clickedDate,

//             onsiteType: "Full Day",
//             leaveType: "",
//             description: "",
//             onsite: true
//           })
//         }

//         break

//       default:
//         console.log("Default case: None of the above conditions met.")
//       // Handle other cases
//     }
//   }
//   const renderContent = () => {
//     switch (selectedTab) {
//       case "Leave":
//         return (
//           <div className=" rounded-lg shadow-lg max-w-[380px]  min-w-[300px] z-40 border border-gray-300 overflow-hidden">
//             {/* Leave Balance Section */}
//             <div className="p-2">
//               <h2 className="text-gray-600 font-semibold text-lg ">
//                 Leave Balance
//               </h2>
//               <p className="text-2xl font-bold text-gray-800">
//                 {BalanceprivilegeleaveCount +
//                   BalancedcasualleaveCount +
//                   BalancecompensatoryleaveCount}
//                 leaves
//               </p>
//               <div className="grid grid-cols-2 gap-1 border border-gray-300 rounded-lg p-2 bg-gray-50">
//                 <div className="font-semibold text-gray-700 text-left">
//                   Category
//                 </div>
//                 <div className="font-semibold text-gray-700 text-right">
//                   Balance
//                 </div>

//                 {Object.entries(leaveBalance).map(([category, balance]) => (
//                   <React.Fragment key={category}>
//                     <div className="capitalize text-gray-600 text-left">
//                       {category} Leave
//                     </div>
//                     <div className="text-gray-600 text-right font-medium">
//                       {balance}
//                     </div>
//                   </React.Fragment>
//                 ))}
//               </div>
//             </div>

//             {/* Divider */}
//             <div className="border-t border-gray-300"></div>

//             {/* Upcoming Leaves */}
//             <div className="p-2 text-center">
//               {currentmonthleaveData?.length > 0 && (
//                 <h2 className="text-gray-600 font-semibold text-sm mb-2">
//                   Upcoming Leaves
//                 </h2>
//               )}

//               <div className="space-y-3 max-h-36 overflow-y-auto">
//                 {currentmonthleaveData?.length > 0 ? (
//                   currentmonthleaveData.map((leave, index) => (
//                     <div
//                       key={index}
//                       className="flex items-center justify-between bg-gray-50 border border-gray-300 p-3 rounded-lg shadow-sm hover:cursor-pointer"
//                     >
//                       {/* Date */}
//                       <div className="text-gray-700 font-semibold w-24 text-sm">
//                         {leave.leaveDate
//                           .split("T")[0]
//                           .split("-")
//                           .reverse()
//                           .join("-")}
//                       </div>

//                       {/* Full/Half Day & Category */}
//                       <div className="flex flex-col text-gray-600">
//                         <span className="text-sm">{leave?.leaveType}</span>
//                         <span className="text-sm font-semibold">
//                           {leave?.leaveCategory}
//                         </span>
//                       </div>

//                       {/* Status: Oval Badge */}
//                       <div
//                         className={`px-3 py-1 text-sm rounded-full text-white ${
//                           leave.departmentstatus === "Dept Approved" ||
//                           leave.hrstatus === "HR/Onsite Approved"
//                             ? "bg-green-500"
//                             : leave.departmentstatus === "Not Approved" &&
//                                 leave.hrstatus === "Not Approved"
//                               ? "bg-yellow-500"
//                               : "bg-red-500"
//                         }`}
//                       >
//                         {leave.departmentstatus === "Dept Approved" ||
//                         leave.hrstatus === "HR/Onsite Approved"
//                           ? "Approved"
//                           : leave.departmentstatus === "Not Approved" &&
//                               leave.hrstatus === "Not Approved"
//                             ? "Pending"
//                             : ""}
//                       </div>

//                       {/* Forward Arrow */}
//                       <FaArrowRight
//                         className=" ml-2 text-gray-500 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-125"
//                         onClick={() => {
//                           setSelectedTab("Edit Leave")
//                           setEdit(true)

//                           setFormData({
//                             leaveId: leave._id,
//                             leaveDate: leave.leaveDate.toString().split("T")[0],
//                             leaveType: leave.leaveType,
//                             halfDayPeriod:
//                               leave.leaveType === "Half Day"
//                                 ? leave.halfDayPeriod
//                                 : undefined,
//                             leaveCategory: leave.leaveCategory,
//                             prevCategory: leave.leaveCategory,
//                             reason: leave.reason
//                           })
//                         }}
//                       />
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-gray-500 text-sm italic text-center">
//                     "No Upcoming Leaves"
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         )
//       case "Onsite":
//         return (
//           <div className="p-2  text-center border border-gray-300 rounded-lg min-w-[320px] max-w-[380px] ">
//             {currentmonthonsiteData?.length > 0 && (
//               <h2 className="text-gray-600 font-semibold text-sm mb-2">
//                 Upcoming Onsite
//               </h2>
//             )}

//             <div className="space-y-3 max-h-96  min-h-36 overflow-y-auto">
//               {currentmonthonsiteData?.length > 0 ? (
//                 [...currentmonthonsiteData]
//                   .sort(
//                     (a, b) => new Date(a.onsiteDate) - new Date(b.onsiteDate)
//                   )
//                   .map((onsite, index) => (
//                     <div
//                       key={index}
//                       className="flex items-center justify-between bg-gray-50 border border-gray-300 p-3 rounded-lg shadow-sm hover:cursor-pointer"
//                     >
//                       {/* Date */}
//                       <div className="text-gray-700 font-semibold w-24 text-sm">
//                         {onsite.onsiteDate
//                           .split("T")[0]
//                           .split("-")
//                           .reverse()
//                           .join("-")}
//                       </div>

//                       {/* Full/Half Day & Category */}
//                       <div className="flex flex-col text-gray-600">
//                         <span className="text-sm">{onsite?.onsiteType}</span>
//                         {/* <span className="text-sm font-semibold">
//                           {leave?.leaveCategory}
//                         </span> */}
//                       </div>

//                       {/* Status: Oval Badge */}
//                       <div
//                         className={`px-3 py-1 text-sm rounded-full text-white ${
//                           onsite.departmentstatus === "Dept Approved" ||
//                           onsite.hrstatus === "HR/Onsite Approved"
//                             ? "bg-green-500"
//                             : onsite.departmentstatus === "Not Approved" &&
//                                 onsite.hrstatus === "Not Approved"
//                               ? "bg-yellow-500"
//                               : "bg-red-500"
//                         }`}
//                       >
//                         {onsite.departmentstatus === "Dept Approved" ||
//                         onsite.hrstatus === "HR/Onsite Approved"
//                           ? "Approved"
//                           : onsite.departmentstatus === "Not Approved" &&
//                               onsite.hrstatus === "Not Approved"
//                             ? "Pending"
//                             : ""}
//                       </div>

//                       {/* Forward Arrow */}
//                       <FaArrowRight
//                         className="text-gray-500 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-125"
//                         onClick={() => {
//                           setSelectedTab("Edit Onsite")
//                           setEdit(true)

//                           setFormData({
//                             onsiteId: onsite._id,
//                             onsiteDate: onsite.onsiteDate
//                               .toString()
//                               .split("T")[0],
//                             formerOnsiteDate: onsite.onsiteDate
//                               .toString()
//                               .split("T")[0],
//                             formerOnsiteType: onsite.onsiteType,

//                             onsiteType: onsite.onsiteType,
//                             halfDayPeriod:
//                               onsite.onsiteType === "Half Day"
//                                 ? onsite.halfDayPeriod
//                                 : undefined,

//                             description: onsite.description
//                           })
//                           if (
//                             onsite.onsiteData &&
//                             onsite.onsiteData.length > 0
//                           ) {
//                             const matchedOnsiteData = onsite.onsiteData[0]
//                               ?.flat()
//                               ?.map((status) => ({
//                                 siteName: status.siteName,
//                                 place: status.place,
//                                 Start: status.Start,
//                                 End: status.End,
//                                 km: status.km,
//                                 kmExpense: status.kmExpense,
//                                 foodExpense: status.foodExpense
//                               }))
//                             // Now set the table rows with the matched onsite data and an empty row for new input
//                             setTableRows(matchedOnsiteData)
//                           }
//                         }}
//                       />
//                     </div>
//                   ))
//               ) : (
//                 <p className="text-gray-500 text-sm italic text-center">
//                   No Upcoming Onsites
//                 </p>
//               )}
//             </div>
//           </div>
//         )
//       case "New Onsite":
//       case "Edit Onsite":
//         return (
//           <div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
//               <div>
//                 <label className="block mb-1">Onsite Date</label>
//                 <input
//                   type="date"
//                   name="onsiteDate"
//                   defaultValue={formData.onsiteDate}
//                   onChange={handleDataChange}
//                   className="border p-2 rounded w-full"
//                 />
//               </div>

//               <div>
//                 <label className="block mb-1">Onsite Type</label>
//                 <select
//                   name="onsiteType"
//                   defaultValue={formData.onsiteType}
//                   onChange={handleDataChange}
//                   className="border p-2 rounded w-full"
//                 >
//                   <option value="Full Day">Full Day</option>
//                   <option value="Half Day">Half Day</option>
//                 </select>
//               </div>
//               {errors.onsiteType && (
//                 <p className="text-red-500">{errors.onsiteType}</p>
//               )}
//               {formData.onsiteType === "Half Day" && (
//                 <>
//                   <div className="">
//                     <label className="block mb-1">Select Half Day Period</label>
//                     <select
//                       name="halfDayPeriod"
//                       defaultValue={formData.halfDayPeriod}
//                       onChange={handleDataChange}
//                       className="border p-2 rounded w-full appearance-none"
//                     >
//                       <option value="Morning">Morning</option>
//                       <option value="Afternoon">Afternoon</option>
//                     </select>
//                   </div>
//                   {errors.halfDayPeriod && (
//                     <p className="text-red-500">{errors.halfDayPeriod}</p>
//                   )}
//                 </>
//               )}
//             </div>
//             <div className="mb-4">
//               <div className="overflow-x-auto overflow-y-auto ">
//                 <table className=" border border-gray-200 text-center w-full">
//                   <thead className="text-sm overflow-x-auto">
//                     <tr>
//                       <th className="border px-2 py-1 min-w-[150px]">
//                         Site Name
//                       </th>
//                       <th className="border px-2 py-1 min-w-[150px]">Place</th>
//                       <th className="border px-2 py-1  min-w-[80px]">Start</th>
//                       <th className="border px-2 py-1  min-w-[80px]">End</th>
//                       <th className="border px-2 py-1 min-w-[80px] ">KM</th>
//                       <th className="border px-2 py-1  min-w-[100px]">TA</th>
//                       <th className="border px-2 py-1  min-w-[100px]">Food </th>
//                       <th className="border px-2 py-1  min-w-[80px]">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {tableRows?.map((row, index) => (
//                       <tr key={index}>
//                         <td className="border p-1.5 ">
//                           <input
//                             type="text"
//                             value={row.siteName}
//                             onChange={(e) => {
//                               const updatedRows = [...tableRows]
//                               updatedRows[index].siteName = e.target.value
//                               setTableRows(updatedRows)
//                               setErrors((prev) => ({
//                                 ...prev,
//                                 tabledataError: ""
//                               }))
//                             }}
//                             className="border p-1 rounded w-full"
//                           />
//                         </td>
//                         <td className="border p-1.5 ">
//                           <input
//                             type="text"
//                             value={row.place}
//                             onChange={(e) => {
//                               const updatedRows = [...tableRows]
//                               updatedRows[index].place = e.target.value
//                               setTableRows(updatedRows)
//                               setErrors((prev) => ({
//                                 ...prev,
//                                 tabledataError: ""
//                               }))
//                             }}
//                             className="border p-1 rounded "
//                           />
//                         </td>
//                         <td className="border p-1.5">
//                           <input
//                             type="number"
//                             value={row.Start}
//                             onChange={(e) => {
//                               const updatedRows = [...tableRows]
//                               updatedRows[index].Start = e.target.value
//                               setTableRows(updatedRows)
//                               setErrors((prev) => ({
//                                 ...prev,
//                                 tabledataError: ""
//                               }))
//                             }}
//                             className="border p-1 rounded w-full"
//                           />
//                         </td>
//                         <td className="border p-1.5">
//                           <input
//                             type="number"
//                             value={row.End}
//                             onChange={(e) => {
//                               const updatedRows = [...tableRows]
//                               updatedRows[index].End = e.target.value
//                               setTableRows(updatedRows)
//                               setErrors((prev) => ({
//                                 ...prev,
//                                 tabledataError: ""
//                               }))
//                             }}
//                             className="border p-1 rounded w-full"
//                           />
//                         </td>
//                         <td className="border p-1.5">
//                           <input
//                             type="number"
//                             value={row.km}
//                             onChange={(e) => {
//                               const updatedRows = [...tableRows]
//                               updatedRows[index].km = e.target.value
//                               setTableRows(updatedRows)
//                               setErrors((prev) => ({
//                                 ...prev,
//                                 tabledataError: ""
//                               }))
//                             }}
//                             className="border p-1 rounded w-full"
//                           />
//                         </td>
//                         <td className="border p-1.5">
//                           <input
//                             type="number"
//                             value={row.kmExpense}
//                             onChange={(e) => {
//                               const updatedRows = [...tableRows]
//                               updatedRows[index].kmExpense = e.target.value
//                               setTableRows(updatedRows)
//                               setErrors((prev) => ({
//                                 ...prev,
//                                 tabledataError: ""
//                               }))
//                             }}
//                             className="border p-1 rounded w-full"
//                           />
//                         </td>
//                         <td className="border p-1.5 ">
//                           <input
//                             type="number"
//                             value={row.foodExpense}
//                             onChange={(e) => {
//                               const updatedRows = [...tableRows]
//                               updatedRows[index].foodExpense = e.target.value
//                               setTableRows(updatedRows)
//                               setErrors((prev) => ({
//                                 ...prev,
//                                 tabledataError: ""
//                               }))
//                             }}
//                             className="border p-1 rounded w-full"
//                           />
//                         </td>
//                         <td className="border p-1.5">
//                           <button
//                             onClick={() => {
//                               const updatedRows = [...tableRows]
//                               updatedRows.splice(index, 1)
//                               setTableRows(updatedRows)
//                             }}
//                             className="text-red-500"
//                           >
//                             Remove
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//               <button
//                 onClick={addRow}
//                 className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
//               >
//                 Add Row
//               </button>
//             </div>
//             {errors.tabledataError && (
//               <p className="text-red-500">{errors.tabledataError}</p>
//             )}
//             <div className="mb-4">
//               <label className="block mb-2">Description</label>
//               <textarea
//                 name="description"
//                 defaultValue={formData?.description}
//                 onChange={handleDataChange}
//                 rows="4"
//                 className="border p-2 rounded w-full"
//               ></textarea>
//             </div>

//             {errors.description && (
//               <p className="text-red-500">{errors.description}</p>
//             )}
//             <div className="text-center text-red-700 ">
//               <p>{message?.bottom}</p>
//             </div>
//           </div>
//         )
//       case "New Leave":
//       case "Edit Leave":
//         return (
//           <div className="bg-white rounded-lg shadow-lg max-w-[380px] min-w-[300px] z-40 border border-gray-100 px-5">
//             <h2 className="text-xl font-semibold text-center">
//               Leave Application
//             </h2>
//             <p className="mt-2 text-center text-red-600">{message.top}</p>
//             <div className="mt-4">
//               {/* Full Day / Half Day Selection */}
//               <div className="flex gap-4">
//                 <label>
//                   <input
//                     name="leaveType"
//                     type="radio"
//                     value="Full Day"
//                     checked={formData.leaveType === "Full Day"}
//                     onChange={handleDataChange}
//                   />
//                   Full Day
//                 </label>
//                 <label>
//                   <input
//                     name="leaveType"
//                     type="radio"
//                     value="Half Day"
//                     checked={formData.leaveType === "Half Day"}
//                     onChange={handleDataChange}
//                   />
//                   Half Day
//                 </label>
//                 {errors.leaveType && (
//                   <p className="text-red-500">{errors.leaveType}</p>
//                 )}
//                 {formData.leaveType === "Half Day" && (
//                   <>
//                     <select
//                       name="halfDayPeriod"
//                       className="border p-2 rounded w-auto"
//                       value={formData?.halfDayPeriod}
//                       // onChange={(e) => setLeaveOption(e.target.value)}
//                       // onChange={(e) => {
//                       //   setFormData((prev) => ({
//                       //     ...prev,
//                       //     halfDayPeriod: e.target.value // Replace newDate with the actual value you want to set
//                       //   }))
//                       // }}
//                       onChange={handleDataChange}
//                     >
//                       <option value="">Select Period</option>
//                       <option value="Morning">Morning</option>
//                       <option value="Afternoon">Afternoon</option>
//                     </select>
//                     {errors.halfDayPeriod && (
//                       <p className="text-red-500">{errors.halfDayPeriod}</p>
//                     )}
//                   </>
//                 )}
//               </div>
//               {/* Leave Dates */}
//               {formData.leaveType === "Full Day" ? (
//                 <>
//                   <div className="mt-1 flex flex-col">
//                     <label className="text-sm font-semibold">Leave Date</label>
//                     <input
//                       name="leaveDate"
//                       type="date"
//                       value={formData?.leaveDate}
//                       onChange={handleDataChange}
//                       className="border p-2 rounded"
//                     />
//                   </div>
//                   {errors.leaveDate && (
//                     <p className="text-red-500">{errors.leaveDate}</p>
//                   )}
//                 </>
//               ) : (
//                 <>
//                   <div className="mt-1">
//                     <label className="text-sm font-semibold">Leave Date</label>
//                     <input
//                       name="leaveDate"
//                       type="date"
//                       value={formData?.leaveDate}
//                       onChange={handleDataChange}
//                       className="border p-2 rounded w-full"
//                     />
//                   </div>
//                   {errors.leaveDate && (
//                     <p className="text-red-500">{errors.leaveDate}</p>
//                   )}
//                 </>
//               )}
//               {/* Leave Type Dropdown */}
//               <div className="mt-1 w-full">
//                 <label className="text-sm font-semibold">Leave Type</label>
//                 <select
//                   name="leaveCategory"
//                   className="border p-2 rounded w-full min-w-full"
//                   value={formData?.leaveCategory || ""}
//                   onChange={handleDataChange}
//                 >
//                   <option value="">Select Leave Type</option>
//                   {/* If the selected leave date is in the past, only show "Other Leave" */}
//                   {pastDate ? (
//                     <>
//                       <option value="other Leave">Other Leave</option>
//                       {formData.leaveCategory === "casual Leave" && (
//                         <option value="casual Leave">Casual Leave</option>
//                       )}
//                       {formData.leaveCategory === "privileage Leave" && (
//                         <option value="privileage Leave">
//                           Privileage Leave
//                         </option>
//                       )}
//                       {formData.leaveCategory === "compensatory Leave" && (
//                         <option value="compensatory Leave">
//                           Compensatory Leave
//                         </option>
//                       )}
//                       {formData.leaveCategory === "sick Leave" && (
//                         <option value="sick Leave">Sick Leave</option>
//                       )}
//                     </>
//                   ) : (
//                     <>
//                       {((formData.leaveType === "Full Day" &&
//                         BalancedcasualleaveCount >= 1) ||
//                         (formData.leaveType === "Half Day" &&
//                           BalancedcasualleaveCount >= 0.5) ||
//                         formData.leaveCategory === "casual Leave") && (
//                         <option value="casual Leave">Casual Leave</option>
//                       )}
//                       {((formData.leaveType === "Full Day" &&
//                         BalanceprivilegeleaveCount >= 1) ||
//                         (formData.leaveType === "Half Day" &&
//                           BalanceprivilegeleaveCount >= 0.5) ||
//                         formData.leaveCategory === "privileage Leave") && (
//                         <option value="privileage Leave">
//                           Privilege Leave
//                         </option>
//                       )}
//                       {((formData.leaveType === "Full Day" &&
//                         BalancecompensatoryleaveCount >= 1) ||
//                         (formData.leaveType === "Half Day" &&
//                           BalancecompensatoryleaveCount >= 0.5) ||
//                         formData.leaveCategory === "compensatory Leave") && (
//                         <option value="compensatory Leave">
//                           Compensatory Leave
//                         </option>
//                       )}
//                       {((formData.leaveType === "Full Day" &&
//                         BalancesickleaveCount >= 1) ||
//                         (formData.leaveType === "Half Day" &&
//                           BalancesickleaveCount >= 0.5) ||
//                         formData.leaveCategory === "sick Leave") && (
//                         <option value="sick Leave">Sick Leave</option>
//                       )}
//                       <option value="other Leave">Other Leave</option>
//                     </>
//                   )}
//                 </select>
//               </div>
//               {errors.leaveCategory && (
//                 <p className="text-red-500">{errors.leaveCategory}</p>
//               )}
//               {/* Reason */}
//               <div className="mt-1">
//                 <label className="text-sm font-semibold">Reason</label>
//                 <textarea
//                   name="reason"
//                   className="border p-2 rounded w-full"
//                   rows="3"
//                   placeholder="Enter reason"
//                   value={formData?.reason}
//                   onChange={handleDataChange}
//                 ></textarea>
//               </div>
//               {errors.reason && <p className="text-red-500">{errors.reason}</p>}
//               <div className="text-center text-red-700 py-3">
//                 <p>{message.bottom}</p>
//               </div>
//
//             </div>
//           </div>
//         )
//       default:
//         return <p>Select a tab to view the content.</p>
//     }
//   }
//   return (
//     // <div className="w-full ">
//     //   <div className="flex items-center justify-between sticky top-0 py-3 px-4 z-30 bg-white">
//     //     <h2 className="text-xl font-semibold">{visibleMonth}</h2>
//     //     <div className="flex space-x-2">

//     //       <button
//     //         onClick={prevMonth}
//     //         className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
//     //       >
//     //         <HiChevronLeft className="w-5 h-5" /> {/* Backward Icon */}
//     //       </button>
//     //       <button
//     //         onClick={goToToday}
//     //         className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
//     //       >
//     //         Today
//     //       </button>
//     //       <button
//     //         onClick={nextMonth}
//     //         className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
//     //       >
//     //         <HiChevronRight className="w-5 h-5" /> {/* Forward Icon */}
//     //       </button>
//     //     </div>
//     //   </div>

//     //   <div className="overflow-y-auto border rounded-lg mx-4">
//     //     {visibleDays.map((date, index) => (
//     //       <div
//     //         key={index}
//     //         onClick={() => {
//     //           setSelectedDate(date)
//     //           handleDateClick(date.fullDate)
//     //         }}
//     //         className="flex justify-between items-center px-4 py-2 mb-2  cursor-pointer bg-gray-200"
//     //       >
//     //         <div className="">
//     //           <div className=" flex-shrink-0 flex items-center justify-center rounded-full border mr-4 font-bold  text-sm sm:text-lg">
//     //             {date.fullMonthDay}
//     //           </div>
//     //           <div>
//     //             <div className="font-medium">
//     //               {new Date(date.fullDate).toLocaleString("default", {
//     //                 weekday: "long"
//     //               })}
//     //             </div>
//     //           </div>
//     //         </div>

//     //         <div className="flex flex-col">
//     //           {currentmonthleaveData?.length > 0
//     //             ? currentmonthleaveData
//     //                 .filter(
//     //                   (leave) =>
//     //                     new Date(leave.leaveDate)
//     //                       .toISOString()
//     //                       .split("T")[0] === date.fullDate
//     //                 ) // Matching dates correctly
//     //                 .map((leave, index) => (
//     //                   <div
//     //                     key={index}
//     //                     className="flex  items-center justify-between hover:cursor-pointer  mb-1"
//     //                   >
//     //                     <div className="flex flex-col text-gray-600">
//     //                       <span className="text-sm">{leave?.leaveType}</span>
//     //                       <span className="text-sm font-semibold">
//     //                         {leave?.leaveCategory}
//     //                       </span>
//     //                     </div>

//     //                     <div
//     //                       className={`px-3 ml-2 py-1 text-sm rounded-full text-white ${
//     //                         leave.departmentstatus === "Dept Approved" ||
//     //                         leave.hrstatus === "HR/Onsite Approved"
//     //                           ? "bg-green-500"
//     //                           : leave.departmentstatus === "Not Approved" &&
//     //                               leave.hrstatus === "Not Approved"
//     //                             ? "bg-yellow-500"
//     //                             : "bg-red-500"
//     //                       }`}
//     //                     >
//     //                       {leave.departmentstatus === "Dept Approved" ||
//     //                       leave.hrstatus === "HR/Onsite Approved"
//     //                         ? "Approved"
//     //                         : leave.departmentstatus === "Not Approved" &&
//     //                             leave.hrstatus === "Not Approved"
//     //                           ? "Pending"
//     //                           : ""}
//     //                     </div>
//     //                   </div>
//     //                 ))
//     //             : ""}
//     //         </div>
//     //       </div>
//     //     ))}
//     //   </div>

//     //   {/* Modal Popup */}
//     //   {showModal && leaveBalance && (
//     //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center  z-50">
//     //       <div
//     //         className={` bg-white rounded-lg shadow-lg  sm:w-auto mx-4 max-h-[90vh] overflow-y-auto flex flex-col  ${
//     //           selectedTab === "New Onsite" ? "md:w-3/4" : ""
//     //         }`}
//     //       >
//     //         {loader && (
//     //           <BarLoader
//     //             cssOverride={{ width: "100%", height: "6px" }} // Tailwind's `h-4` corresponds to `16px`
//     //             color="#4A90E2" // Change color as needed
//     //             // loader={true}
//     //           />
//     //         )}
//     //         <div className="p-3 w-full  ">
//     //           {/* Tab Navigation */}
//     //           <div className="flex justify-center space-x-4 ">
//     //             {tabs?.map((tab) => (
//     //               <span
//     //                 key={tab}
//     //                 onClick={() => {
//     //                   setSelectedTab(tab)
//     //                   setMessage("")
//     //                   selectedTabContent(tab)

//     //                   setIsOnsite(tab === "Onsite")
//     //                 }}
//     //                 className={`cursor-pointer ${
//     //                   selectedTab === tab
//     //                     ? "text-blue-500 font-semibold underline"
//     //                     : "text-black"
//     //                 }`}
//     //               >
//     //                 {tab}
//     //               </span>
//     //             ))}
//     //           </div>

//     //           <div className="mt-2">
//     //             <div>{renderContent()}</div>

//     //             {selectedTab === "Leave" ? (
//     //               <div className=" flex justify-center mt-3 mb-3">
//     //                 <button
//     //                   className="bg-blue-800 rounded-lg px-4 py-1 text-white hover:bg-blue-700"
//     //                   onClick={() => {
//     //                     setSelectedTab("New Leave")
//     //                     setFormData((prev) => ({
//     //                       ...prev,
//     //                       leaveType: "Full Day",
//     //                       leaveCategory: "",
//     //                       halfDayPeriod: "",
//     //                       reason: ""
//     //                     }))
//     //                   }}
//     //                 >
//     //                   Apply New Leaves
//     //                 </button>
//     //                 <button
//     //                   className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 ml-3"
//     //                   onClick={() => {
//     //                     setShowModal(false)
//     //                     setcompensatoryLeave(false)
//     //                     setEdit(false)
//     //                     setFormData({
//     //                       description: "",
//     //                       onsite: false,
//     //                       halfDayPeriod: "",
//     //                       leaveType: "Full Day"
//     //                     })

//     //                     setSelectedTab("Leave")
//     //                     setTableRows([])
//     //                     setMessage("")
//     //                     setErrors("")
//     //                   }}
//     //                 >
//     //                   Close
//     //                 </button>
//     //               </div>
//     //             ) : selectedTab === "Edit Onsite" ||
//     //               selectedTab === "Edit Leave" ||
//     //               selectedTab === "New Leave" ||
//     //               selectedTab === "New Onsite" ? (
//     //               <div className="col-span-2 gap-4 flex justify-center mt-4 mb-3">
//     //                 <button
//     //                   className="bg-gradient-to-b from-blue-400 to-blue-500 px-3 py-1 hover:from-blue-400 hover:to-blue-600 text-white rounded"
//     //                   onClick={() => handleSubmit(selectedTab)}
//     //                 >
//     //                   {selectedTab === "Edit Onsite" ||
//     //                   selectedTab === "Edit Leave"
//     //                     ? "Update"
//     //                     : "Submit"}
//     //                 </button>
//     //                 <button
//     //                   className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
//     //                   onClick={() => {
//     //                     setShowModal(false)
//     //                     setcompensatoryLeave(false)
//     //                     setFormData({
//     //                       description: "",
//     //                       onsite: false,
//     //                       halfDayPeriod: "",
//     //                       leaveType: "Full Day"
//     //                     })

//     //                     setSelectedTab("Leave")
//     //                     setTableRows([])
//     //                     setMessage("")
//     //                     setErrors("")
//     //                   }}
//     //                 >
//     //                   Close
//     //                 </button>
//     //                 <button
//     //                   className="bg-red-600 px-4 py-2 rounded-md text-white font-semibold shadow-lg hover:bg-red-700 active:shadow-md active:translate-y-[2px] transition-all duration-200"
//     //                   onClick={() => handledelete(formData)}
//     //                 >
//     //                   Delete
//     //                 </button>
//     //               </div>
//     //             ) : (
//     //               <div className="text-center">
//     //                 <button
//     //                   onClick={() => {
//     //                     setSelectedTab("New Onsite")
//     //                     setFormData((prev) => ({
//     //                       ...prev,
//     //                       onsiteType: "Full Day",
//     //                       halfDayPeriod: "",
//     //                       description: ""
//     //                     }))
//     //                     setTableRows([])
//     //                   }}
//     //                   className="py-2 m-2 bg-blue-800 shadow-lg text-white rounded-lg px-2 hover:bg-blue-900"
//     //                 >
//     //                   Apply New Onsite
//     //                 </button>
//     //                 <button
//     //                   className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
//     //                   onClick={() => {
//     //                     setShowModal(false)
//     //                     setcompensatoryLeave(false)
//     //                     setFormData({
//     //                       description: "",
//     //                       onsite: false,
//     //                       halfDayPeriod: "",
//     //                       leaveType: "Full Day"
//     //                     })

//     //                     setSelectedTab("Leave")
//     //                     setTableRows([])
//     //                     setMessage("")
//     //                     setErrors("")
//     //                   }}
//     //                 >
//     //                   Close
//     //                 </button>
//     //               </div>
//     //             )}
//     //           </div>
//     //         </div>
//     //       </div>
//     //     </div>
//     //   )}
//     // </div>

//     <div className="w-full ">
//       {/* HEADER */}
//       <div className="flex items-center justify-between sticky top-0 py-3 px-4 z-30 bg-white">
//         <h2 className="text-xl font-semibold">{visibleMonth}</h2>
//         <div className="flex space-x-2">
//           <button
//             onClick={prevMonth}
//             className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
//           >
//             <HiChevronLeft className="w-5 h-5" />
//           </button>

//           <button
//             onClick={goToToday}
//             className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
//           >
//             Today
//           </button>

//           <button
//             onClick={nextMonth}
//             className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
//           >
//             <HiChevronRight className="w-5 h-5" />
//           </button>
//         </div>
//       </div>

//       {/* DATE LIST */}
//       <div className="overflow-y-auto border rounded-lg mx-4">
//         {visibleDays.map((date, index) => (
//           <div
//             key={index}
//             onClick={() => {
//               setSelectedDate(date)
//               setSelectedType("")
//               setShowTypeSelector(true) // 🔥 FIRST POPUP
//             }}
//             className="flex justify-between items-center px-4 py-2 mb-2 cursor-pointer bg-gray-200"
//           >
//             <div>
//               <div className="flex items-center">
//                 <div className="rounded-full border mr-4 font-bold text-sm sm:text-lg px-2">
//                   {date.fullMonthDay}
//                 </div>
//                 <div className="font-medium">
//                   {new Date(date.fullDate).toLocaleString("default", {
//                     weekday: "long"
//                   })}
//                 </div>
//               </div>
//             </div>

//             {/* LEAVE DATA */}
//             <div className="flex flex-col">
//               {currentmonthleaveData?.length > 0 &&
//                 currentmonthleaveData
//                   .filter(
//                     (leave) =>
//                       new Date(leave.leaveDate).toISOString().split("T")[0] ===
//                       date.fullDate
//                   )
//                   .map((leave, i) => (
//                     <div key={i} className="flex items-center mb-1">
//                       <div className="flex flex-col text-gray-600">
//                         <span className="text-sm">{leave?.leaveType}</span>
//                         <span className="text-sm font-semibold">
//                           {leave?.leaveCategory}
//                         </span>
//                       </div>

//                       <div
//                         className={`px-3 ml-2 py-1 text-sm rounded-full text-white ${
//                           leave.departmentstatus === "Dept Approved" ||
//                           leave.hrstatus === "HR/Onsite Approved"
//                             ? "bg-green-500"
//                             : leave.departmentstatus === "Not Approved" &&
//                                 leave.hrstatus === "Not Approved"
//                               ? "bg-yellow-500"
//                               : "bg-red-500"
//                         }`}
//                       >
//                         {leave.departmentstatus === "Dept Approved" ||
//                         leave.hrstatus === "HR/Onsite Approved"
//                           ? "Approved"
//                           : leave.departmentstatus === "Not Approved" &&
//                               leave.hrstatus === "Not Approved"
//                             ? "Pending"
//                             : ""}
//                       </div>
//                     </div>
//                   ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* 🔴 TYPE SELECTOR POPUP */}
//       {showTypeSelector && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
//             <h3 className="text-lg font-semibold mb-4 text-center">
//               Select Request Type
//             </h3>

//             <div className="flex flex-col space-y-3">
//               {["leave", "onsite", "mispunch"].map((type) => (
//                 <label key={type} className="flex items-center space-x-2">
//                   <input
//                     type="radio"
//                     name="type"
//                     value={type}
//                     checked={selectedType === type}
//                     onChange={
//                       (e) => setSelectedType(e.target.value)
//                       // setFormData((prev)=>({
//                       // ...prev,
//                       // selectedDate:}))
//                     }
//                   />
//                   <span className="capitalize">{type}</span>
//                 </label>
//               ))}
//             </div>

//             <div className="flex justify-between mt-5">
//               <button
//                 className="bg-gray-400 text-white px-4 py-1 rounded"
//                 onClick={() => {
//                   setShowTypeSelector(false)
//                   setSelectedType("")
//                 }}
//               >
//                 Cancel
//               </button>

//               <button
//                 disabled={!selectedType}
//                 className={`px-4 py-1 rounded text-white ${
//                   selectedType ? "bg-blue-600" : "bg-gray-300"
//                 }`}
//                 onClick={() => {
//                   setShowTypeSelector(false)

//                   if (selectedType === "leave") setSelectedTab("Leave")
//                   if (selectedType === "onsite") setSelectedTab("Onsite")
//                   if (selectedType === "mispunch") setSelectedTab("Mispunch")

//                   handleDateClick(selectedDate.fullDate)
//                   setShowModal(true)
//                 }}
//               >
//                 Continue
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 🔴 MAIN MODAL */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-lg mx-4 max-h-[90vh] overflow-y-auto flex flex-col">
//             <div className="p-3">
//               {/* TABS (ONLY SELECTED TYPE) */}
//               <div className="flex justify-center space-x-4">
//                 {tabs
//                   ?.filter((tab) => {
//                     if (selectedType === "leave") return tab === "Leave"
//                     if (selectedType === "onsite") return tab === "Onsite"
//                     if (selectedType === "mispunch") return tab === "Mispunch"
//                     return false
//                   })
//                   .map((tab) => (
//                     <span
//                       key={tab}
//                       className="text-blue-500 font-semibold underline"
//                     >
//                       {tab}
//                     </span>
//                   ))}
//               </div>

//               {/* CONTENT */}
//               <div className="mt-4">
//                 {/* ✅ EXISTING CONTENT */}
//                 {selectedTab !== "Mispunch" && renderContent()}

//                 {selectedTab === "Mispunch" && (
//                   <div className="space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto px-1">
//                     {/* Date Display */}
//                     <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                           <svg
//                             className="w-4 h-4 text-blue-600"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//                             />
//                           </svg>
//                           <span className="text-xs font-medium text-blue-900">
//                             Request Date
//                           </span>
//                         </div>
//                         <span className="text-sm font-semibold text-blue-700">
//                           {(formData.misspunchDate
//                             ? new Date(formData.misspunchDate)
//                             : new Date()
//                           ).toLocaleDateString("en-GB", {
//                             day: "2-digit",
//                             month: "short",
//                             year: "numeric"
//                           })}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Header Section */}
//                     <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-lg p-3">
//                       <div className="flex items-start gap-2">
//                         <div className="bg-amber-100 rounded-full p-1.5 mt-0.5 flex-shrink-0">
//                           <svg
//                             className="w-4 h-4 text-amber-600"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                             />
//                           </svg>
//                         </div>
//                         <div>
//                           <h3 className="text-sm font-semibold text-gray-800 mb-0.5">
//                             Report a Misspunch
//                           </h3>
//                           <p className="text-xs text-gray-600 leading-tight">
//                             Missed clocking in or out? Let us know and we'll
//                             help correct your attendance.
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Form Fields */}
//                     <div className="space-y-4">
//                       {/* Misspunch Type */}
//                       <div>
//                         <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-2">
//                           <svg
//                             className="w-3.5 h-3.5 text-gray-500"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
//                             />
//                           </svg>
//                           Punch Type
//                         </label>
//                         <div className="grid grid-cols-2 gap-2.5">
//                           {["In", "Out"].map((type) => (
//                             <button
//                               key={type}
//                               type="button"
//                               onClick={() =>
//                                 setFormData((prev) => ({
//                                   ...prev,
//                                   mispunchType: type
//                                 }))
//                               }
//                               className={`
//                 relative px-3 py-2.5 rounded-lg border-2 transition-all duration-200
//                 ${
//                   formData.mispunchType === type
//                     ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
//                     : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
//                 }
//               `}
//                             >
//                               <div className="flex items-center justify-center gap-1.5">
//                                 {type === "In" ? (
//                                   <svg
//                                     className="w-4 h-4"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     viewBox="0 0 24 24"
//                                   >
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth={2}
//                                       d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
//                                     />
//                                   </svg>
//                                 ) : (
//                                   <svg
//                                     className="w-4 h-4"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     viewBox="0 0 24 24"
//                                   >
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth={2}
//                                       d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
//                                     />
//                                   </svg>
//                                 )}
//                                 <span className="text-sm font-medium">
//                                   Punch {type}
//                                 </span>
//                               </div>
//                               {formData.mispunchType === type && (
//                                 <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-0.5">
//                                   <svg
//                                     className="w-2.5 h-2.5"
//                                     fill="currentColor"
//                                     viewBox="0 0 20 20"
//                                   >
//                                     <path
//                                       fillRule="evenodd"
//                                       d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                                       clipRule="evenodd"
//                                     />
//                                   </svg>
//                                 </div>
//                               )}
//                             </button>
//                           ))}
//                         </div>
//                       </div>

//                       {/* Remark */}
//                       <div>
//                         <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-2">
//                           <svg
//                             className="w-3.5 h-3.5 text-gray-500"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
//                             />
//                           </svg>
//                           Reason for Misspunch
//                         </label>
//                         <textarea
//                           className="w-full border-2 border-gray-200 px-3 py-2 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 resize-none"
//                           rows={3}
//                           placeholder="Please explain why you missed the punch (e.g., forgot to clock in, system error, etc.)"
//                           value={formData.remark || ""}
//                           onChange={(e) =>
//                             setFormData((prev) => ({
//                               ...prev,
//                               remark: e.target.value
//                             }))
//                           }
//                         />
//                         <p className="text-xs text-gray-500 mt-1">
//                           Provide clear details to help us process your request
//                           faster
//                         </p>
//                       </div>
//                     </div>

//                     {/* Submit Button */}
//                   </div>
//                 )}
//               </div>

//               {/* CLOSE BUTTON */}
//               <div className="flex justify-center mt-4 gap-4">
//                 {selectedTab === "Mispunch" && (
//                   <button
//                     className="group relative bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                     onClick={() => handleSubmit("Misspunch")}
//                     disabled={!formData.mispunchType || !formData.remark}
//                   >
//                     <span className="flex items-center gap-1.5">
//                       Submit Request
//                       <svg
//                         className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M13 7l5 5m0 0l-5 5m5-5H6"
//                         />
//                       </svg>
//                     </span>
//                   </button>
//                 )}
//                 {selectedTab === "Leave" && (
//                   <button
//                     className="bg-blue-800 rounded-lg px-4 py-1 text-white hover:bg-blue-700"
//                     onClick={() => {
//                       setSelectedTab("New Leave")
//                       setFormData((prev) => ({
//                         ...prev,
//                         leaveType: "Full Day",
//                         leaveCategory: "",
//                         halfDayPeriod: "",
//                         reason: ""
//                       }))
//                     }}
//                   >
//                     Apply New Leaves
//                   </button>
//                 )}
//                 {selectedTab === "Onsite" && (
//                   <button
//                     onClick={() => {
//                       setSelectedTab("New Onsite")
//                       setFormData((prev) => ({
//                         ...prev,
//                         onsiteType: "Full Day",
//                         halfDayPeriod: "",
//                         description: ""
//                       }))
//                       setTableRows([])
//                     }}
//                     className="py-2 m-2 bg-blue-800 shadow-lg text-white rounded-lg px-2 hover:bg-blue-900"
//                   >
//                     Apply New Onsite
//                   </button>
//                 )}

//                 <button
//                   className="bg-gray-500 text-white px-4 py-2 rounded"
//                   onClick={() => {
//                     setShowModal(false)
//                     setSelectedType("")
//                   }}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default LeaveApplication

import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import dayjs from "dayjs"
import { FaArrowRight } from "react-icons/fa"
import BarLoader from "react-spinners/BarLoader"
import { HiChevronLeft, HiChevronRight } from "react-icons/hi" // Impo
import UseFetch from "../../hooks/useFetch"
import api from "../../api/api"

function LeaveApplication() {
  const [events, setEvents] = useState([])
  // const [ownCalander,setOwnCalander]=useState()
  const [edit, setEdit] = useState(null)
  const [showTypeSelector, setShowTypeSelector] = useState(false)
  const [selectedType, setSelectedType] = useState("") // leave | onsite | mispunch
  const [isHaveCompensatoryleave, setcompensatoryLeave] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [visibleDays, setVisibleDays] = useState([])
  const [BalanceprivilegeleaveCount, setBalanceprivilegeLeaveCount] =
    useState(0)
  const [BalancesickleaveCount, setBalansickLeaveCount] = useState(0)
  const [visibleMonth, setVisibleMonth] = useState("")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [leaveBalance, setLeaveBalance] = useState({})
  const [BalancedcasualleaveCount, setBalancecasualLeaveCount] = useState(0)
  const [BalancecompensatoryleaveCount, setBalancecompensatoryLeaveCount] =
    useState(0)
  const [allleaves, setAllleaves] = useState([])
  const [allOnsites, setAllOnsite] = useState([])
  const [errors, setErrors] = useState({})

  const [MonthData, setMonthData] = useState({})
  const [currentMonthData, setcurrentMonthData] = useState({})
  const [currentMonth, setCurrentMonth] = useState(null)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [message, setMessage] = useState({
    top: "",
    bottom: ""
  })
  console.log(message)
  const [showModal, setShowModal] = useState(false)
  console.log(showModal)
  const [pastDate, setPastDate] = useState(null)
  const [selectedTab, setSelectedTab] = useState("Leave")
  const [formData, setFormData] = useState({
    leaveDate: "",
    onsiteDate: "",
    formerOnsiteDate: "",
    leaveType: "Full Day",
    onsiteType: "Full Day",

    halfDayPeriod: "Morning",
    onsite: false,
    leaveCategory: "",
    reason: "",
    description: "",
    eventId: null
  })

  const [isOnsite, setIsOnsite] = useState(false)
  const [loader, setLoader] = useState(false)
  const [tableRows, setTableRows] = useState([])
  const [clickedDate, setclickedDate] = useState(null)
  const [currentmonthleaveData, setcurrentmonthLeaveData] = useState([])
  const [currentmonthonsiteData, setcurrentmonthOnsiteData] = useState([])
  const userData = localStorage.getItem("user")
  const tabs = ["Leave", "Onsite"]
  const user = JSON.parse(userData)
  console.log(user)
  const { data: leaves, refreshHook } = UseFetch(
    user && `/auth/getallLeave?userid=${user._id}`
  )
  const { data: compensatoryleaves, refreshHook: refreshHookCompensatory } =
    UseFetch(user && `/auth/getallcompensatoryleave?userid=${user._id}`)
  const { data: monthlyHoly } = UseFetch(
    currentMonth &&
      `/customer/getallCurrentmonthHoly?currentmonth=${currentMonth}`
  )
  const { data: allonsite, refreshHook: refreshHookOnsite } = UseFetch(
    user && `/auth/getallOnsite?userid=${user._id}`
  )
  const { data: leavemasterleavecount } = UseFetch(
    "/auth/getleavemasterleavecount"
  )
  useEffect(() => {
    if (MonthData && currentMonth) {
      setcurrentMonthData(MonthData[currentMonth])
    }
  }, [currentMonth, MonthData])

  useEffect(() => {
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, "0") // Convert to "01-12" format
    setCurrentMonth(`${year}-${month}`)
  }, [currentDate])
  useEffect(() => {
    const filteredcurrentmonthlyLeaves = allleaves?.filter((leaves) => {
      ///leavedate is iso format like "2025-03-03T12:00:00Z" so here slice 0 takes the first part and get the first 7 means 2025-03 because current month includes year also 2025-03
      const leaveMonth = leaves.leaveDate.split("T")[0].slice(0, 7)
      //here currentMonth have year and month no date
      return leaveMonth === currentMonth
    })
    setcurrentmonthLeaveData(filteredcurrentmonthlyLeaves)
  }, [allleaves, currentDate, currentMonth])
  useEffect(() => {
    if ((leaves && leaves.length > 0) || (allonsite && allonsite.length) > 0) {
      setAllleaves(leaves)
      setAllOnsite(allonsite)
    }
  }, [leaves, allonsite])
  useEffect(() => {
    if (allOnsites && allOnsites.length > 0) {
      const filteredcurrentmonthlyOnsites = allOnsites?.filter((onsites) => {
        ///onsitedate is iso format like "2025-03-03T12:00:00Z" so here slice 0 takes the first part and get the first 7 means 2025-03 because current month includes year also 2025-03
        const onsiteMonth = onsites.onsiteDate.split("T")[0].slice(0, 7)

        //here currentMonth have year and month no date
        return onsiteMonth === currentMonth
      })
      setcurrentmonthOnsiteData(filteredcurrentmonthlyOnsites)
    }
  }, [allOnsites, currentMonth])
  useEffect(() => {
    const days = []

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1
    setCurrentYear(year)

    // Set month name
    setVisibleMonth(
      `${currentDate.toLocaleString("default", { month: "long" })} ${year}`
    )

    // Get last day of the month
    const lastDay = new Date(year, month, 0).getDate()

    // Generate all days in the month
    for (let i = 1; i <= lastDay; i++) {
      const date = new Date(year, month - 1, i + 1)

      days.push({
        fullDate: date.toISOString().split("T")[0], // Format: YYYY-MM-DD
        fullMonthDay: date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          timeZone: "UTC"
        }), // Format: 07 March 2025
        day: date
      })
    }

    setVisibleDays(days)
  }, [currentDate])
  useEffect(() => {
    const today = dayjs().format("YYYY-MM-DD") // Get today's date in YYYY-MM-DD format

    const isPastDate =
      formData?.leaveDate && dayjs(formData.leaveDate).isBefore(today)

    setPastDate(isPastDate)
  }, [formData])
  console.log(allleaves)
  useEffect(() => {
    if (
      allleaves &&
      allleaves.length > 0 &&
      leavemasterleavecount &&
      compensatoryleaves >= 0
    ) {
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear()
      const currentmonth = currentDate.getMonth() + 1
      const leaveDate = formData?.leaveDate
        ? new Date(formData?.leaveDate)
        : new Date()
      const leaveYear = leaveDate.getFullYear()

      const privileageDate = new Date(user?.privilegeleavestartsfrom)
      const privileagestartYear = privileageDate.getFullYear()
      const privileagestartmonth = privileageDate.getMonth() + 1 // 1-based month
      const casualstartDate = new Date(user?.casualleavestartsfrom)
      const casualstartYear = casualstartDate.getFullYear()
      const casualstartmonth = casualstartDate.getMonth() + 1 // 1-based month
      console.log(casualstartDate)
      const totalprivilegeLeave = leavemasterleavecount?.totalprivilegeLeave
      const privilegePerMonth = totalprivilegeLeave / 12
      const totalcasualLeave = leavemasterleavecount?.totalcasualleave
      const casualPerMonth = totalcasualLeave / 12
      let ownedprivilegeCount = 0
      let ownedcasualCount = 0
      console.log(casualstartYear)
      console.log(currentYear)
      if (casualstartYear < currentYear) {
        let casualCount

        if (casualstartYear < leaveYear && leaveYear < currentYear) {
          casualCount = casualPerMonth
        } else if (casualstartYear < leaveYear) {
          casualCount = casualPerMonth
        } else if (casualstartYear === leaveYear) {
          casualCount = casualPerMonth
        }
        ownedcasualCount = casualCount
      } else if (casualstartYear === currentYear) {
        console.log(currentmonth)
        console.log(casualstartmonth)
        // If privilege started this year, give leaves from start month to current month
        if (currentmonth >= casualstartmonth) {
          ownedcasualCount = casualPerMonth
        } else {
          ownedcasualCount = 0
        }
      } else {
        ownedcasualCount = 0
      }

      if (privileagestartYear < currentYear) {
        let privilegeCount

        if (privileagestartYear < leaveYear && leaveYear < currentYear) {
          privilegeCount = 12 * privilegePerMonth
        } else if (privileagestartYear < leaveYear) {
          privilegeCount = currentmonth * privilegePerMonth
        } else if (privileagestartYear === leaveYear) {
          const monthsRemainingInStartYear = 12 - privileagestartmonth + 1 // Calculate remaining months including startMonth
          privilegeCount = monthsRemainingInStartYear * privilegePerMonth
        }
        ownedprivilegeCount = privilegeCount
      } else if (privileagestartYear === currentYear) {
        // If privilege started this year, give leaves from start month to current month
        if (currentmonth >= privileagestartmonth) {
          ownedprivilegeCount =
            (currentmonth - privileagestartmonth + 1) * privilegePerMonth
        } else {
          ownedprivilegeCount = 0 // Not eligible yet
        }
      } else {
        // If privilege starts in a future year, no leaves yet
        ownedprivilegeCount = 0
      }
      const filteredcurrentmonthlyLeaves = allleaves.filter((leaves) => {
        ///leavedate is iso format like "2025-03-03T12:00:00Z" so here slice 0 takes the first part and get the first 7 means 2025-03 because current month includes year also 2025-03
        const leaveMonth = leaves.leaveDate.split("T")[0].slice(0, 7)
        //here currentMonth have year and month no date
        return leaveMonth === currentMonth
      })
      setcurrentmonthLeaveData(filteredcurrentmonthlyLeaves)

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
      console.log(ownedcasualCount)
      const balancecasualcount = ownedcasualCount - usedCasualCount
      const balanceprivilege = ownedprivilegeCount - takenPrivilegeCount
      console.log(compensatoryleaves)
      setBalanceprivilegeLeaveCount(Math.max(balanceprivilege, 0))
      setBalancecasualLeaveCount(Math.max(balancecasualcount, 0))
      setBalancecompensatoryLeaveCount(compensatoryleaves)
      setLeaveBalance({
        ...leaveBalance,
        casual: Math.max(balancecasualcount, 0),
        privilege: Math.max(balanceprivilege, 0),
        sick: BalancesickleaveCount,
        compensatory: compensatoryleaves
      })
    } else if (
      (!allleaves && leavemasterleavecount) ||
      (allleaves && allleaves.length === 0 && leavemasterleavecount) ||
      compensatoryleaves >= 0
    ) {
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear()
      const currentmonth = currentDate.getMonth() + 1
      const leaveDate = formData.leaveDate
        ? new Date(formData.leaveDate)
        : new Date()
      const leaveYear = leaveDate.getFullYear()
      const privileagestartDate = new Date(user?.privilegeleavestartsfrom)
      const privileagestartYear = privileagestartDate.getFullYear()
      const privileagestartmonth = privileagestartDate.getMonth() + 1 // 1-based month
      const casualstartDate = new Date(user?.privilegeleavestartsfrom)
      const casualstartYear = casualstartDate.getFullYear()
      const casualstartmonth = casualstartDate.getMonth() + 1 // 1-based month
      const totalprivilegeLeave =
        leavemasterleavecount?.totalprivilegeLeave || 0
      const privilegePerMonth = totalprivilegeLeave / 12 // 1 or 2 per month
      const totalcasualLeave = leavemasterleavecount?.totalcasualleave || 0
      const casualPerMonth = totalcasualLeave / 12

      let ownedprivilegeCount = 0
      let ownedcasualCount = 0
      if (casualstartYear < currentYear) {
        let casualCount
        if (casualstartYear < leaveYear && leaveYear < currentYear) {
          casualCount = casualPerMonth
        } else if (casualstartYear < leaveYear) {
          casualCount = casualPerMonth
        } else if (casualstartYear === leaveYear) {
          casualCount = casualPerMonth
        }
        ownedcasualCount = casualCount
      } else if (casualstartYear === currentYear) {
        // If privilege started this year, give leaves from start month to current month
        if (currentmonth >= casualstartmonth) {
          ownedcasualCount = casualPerMonth
        } else {
          ownedcasualCount = 0
        }
      } else {
        ownedcasualCount = 0
      }
      if (privileagestartYear < currentYear) {
        let privilegeCount
        if (privileagestartYear < leaveYear && leaveYear < currentYear) {
          privilegeCount = 12 * privilegePerMonth
        } else if (privileagestartYear < leaveYear) {
          privilegeCount = currentmonth * privilegePerMonth
        } else if (privileagestartYear === leaveYear) {
          const monthsRemainingInStartYear = 12 - privileagestartmonth + 1 // Calculate remaining months including startMonth
          privilegeCount = monthsRemainingInStartYear * privilegePerMonth
        }
        ownedprivilegeCount = privilegeCount
      } else if (privileagestartYear === currentYear) {
        // If privilege started this year, give leaves from start month to current month
        if (currentmonth >= privileagestartmonth) {
          ownedprivilegeCount =
            (currentmonth - privileagestartmonth + 1) * privilegePerMonth
        } else {
          ownedprivilegeCount = 0 // Not eligible yet
        }
      } else {
        // If privilege starts in a future year, no leaves yet
        ownedprivilegeCount = 0
      }

      setBalanceprivilegeLeaveCount(ownedprivilegeCount)
      setBalancecasualLeaveCount(ownedcasualCount)
      setBalancecompensatoryLeaveCount(compensatoryleaves)
      setLeaveBalance({
        ...leaveBalance,
        casual: ownedcasualCount,
        privilege: ownedprivilegeCount,
        sick: BalancesickleaveCount,
        compensatory: compensatoryleaves
      })
    }
  }, [
    currentMonth,
    allleaves,
    leavemasterleavecount,
    formData,
    compensatoryleaves
  ])

  useEffect(() => {
    if (isOnsite) {
      setFormData((prev) => ({
        ...prev,
        onsite: true
      }))
    }
  }, [isOnsite])

  useEffect(() => {
    if (
      allleaves &&
      allleaves.length > 0 &&
      allOnsites &&
      allOnsites.length > 0
    ) {
      const events = [...allleaves, ...allOnsites]
      setEvents(events)
    } else if (
      (allleaves && allleaves.length > 0) ||
      (allOnsites && allOnsites.length > 0)
    ) {
      if (allleaves) {
        setEvents(allleaves)
      } else if (allOnsites) {
        setEvents(allOnsites)
      }
    }
  }, [allleaves, allOnsites])

  useEffect(() => {
    if (!showModal) {
      setIsOnsite(false)
    }
  }, [showModal])
  useEffect(() => {
    if (isOnsite && clickedDate) {
      // Find the event that matches the clicked date
      const existingEvent = events.filter((event) => {
        const eventDate = event?.onsiteDate
        if (!eventDate) return false
        return (
          event.onsiteDate.toString().split("T")[0] === clickedDate &&
          event.onsiteData
        )
      })

      // If a matching event is found and it has onsite data
      if (existingEvent && existingEvent.length > 0) {
        const matchedOnsiteData = existingEvent[0]?.onsiteData
          ?.flat()
          ?.map((status) => ({
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
  console.log(selectedTab)
  const handledelete = async (data) => {
    try {
      setLoader(true)
      const payload = {
        ...(data.leaveType
          ? {
              leaveType: data.leaveType,
              reason: data.reason,
              leaveDate: data.leaveDate,
              leaveCategory: data.leaveCategory,
              prevCategory: formData.prevCategory
            }
          : {
              docId: data?.onsiteId,
              onsiteType: data.onsiteType,
              description: data.description,
              onsiteDate: data.onsiteDate
            })
      }
      const isLeave = "leaveType" in payload
      const isOnsite = "onsiteType" in payload
      let type = ""
      if (isLeave) {
        type = "leave"
        const response = await api.post(
          `/auth/deleteEvent?type=${type}&userid=${user._id}`,
          payload
        )
        const data = response?.data?.data

        if (response.status === 200) {
          setLoader(false)

          setAllleaves(data)
          setShowModal(false)
          setFormData({
            startDate: "",

            leaveType: "Full Day",
            onsiteType: "Full Day",
            formerOnsiteType: "",

            halfDayPeriod: "",
            onsite: false,
            leaveCategory: "",
            reason: "",
            description: ""
          })
          setSelectedTab("Leave")
          toast.success(response.data.message)
        } else if (response.status === 201) {
          setLoader(false)
          setAllleaves(data)
          setAllleaves([])
          setShowModal(false)
          setSelectedTab("Leave")
          setFormData({
            startDate: "",

            leaveType: "Full Day",
            onsiteType: "Full Day",
            formerOnsiteType: "",
            halfDayPeriod: "",
            onsite: false,
            leaveCategory: "",
            reason: "",
            description: ""
          })
          setSelectedTab("Leave")
          toast.success(response.data.message)
        }
      } else if (isOnsite) {
        type = "onsite"
        const response = await api.post(
          `/auth/deleteEvent?type=${type}&userid=${user._id}`,
          payload
        )
        const data = response.data.data
        if (response.status === 200) {
          setLoader(false)
          setMessage({ top: "", bottom: "" })
          setAllOnsite(data)
          refreshHook()
          refreshHookCompensatory()

          setTableRows([])
          setSelectedTab("Leave")
          setShowModal(false)
          setFormData({
            startDate: "",

            leaveType: "Full Day",
            onsiteType: "Full Day",
            formerOnsiteType: "",
            halfDayPeriod: "",
            onsite: false,
            leaveCategory: "",
            reason: "",
            description: ""
          })
          setSelectedTab("Leave")
          toast.success(response.data.message)
        } else if (response.status === 201) {
          setLoader(false)
          setAllOnsite(data)
          setShowModal(false)
          setMessage({ top: "", bottom: "" })
          setAllOnsite([])
          setTableRows([])
          setFormData({
            startDate: "",

            leaveType: "Full Day",
            onsiteType: "Full Day",
            formerOnsiteType: "",
            halfDayPeriod: "",
            onsite: false,
            leaveCategory: "",
            reason: "",
            description: ""
          })
          setSelectedTab("Leave")
          toast.success(response.data.message)
        }
      }
    } catch (error) {
      setLoader(false)
      setMessage((prev) => ({ ...prev, bottom: error.response.data.message }))
      console.log(error.response.data.message)
    }
  }
  console.log(formData)
  const handleDateClick = (date) => {
    console.log(date)
    setclickedDate(date)
    const clickedDate = date
    const dayOfWeek = new Date(clickedDate).getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const isSunday = dayOfWeek === 0

    const isHoliday = monthlyHoly?.some((holiday) => {
      const formattedHolyDate = holiday.holyDate.split("T")[0] // Extract YYYY-MM-DD
      return formattedHolyDate === date
    })
    if (isHoliday || isSunday) {
      setcompensatoryLeave(true)
    }

    const existingEvent = events?.filter((event) => {
      const eventDate = event?.leaveDate // Normalize to YYYY-MM-DD

      if (!eventDate) return false
      return eventDate.toString().split("T")[0] === clickedDate // Compare only the date part
    })

    if (existingEvent && existingEvent.length > 0) {
      setFormData({
        ...formData,
        leaveDate: existingEvent[0]?.leaveDate.toString().split("T")[0],
        halfDayPeriod: existingEvent?.halfDayPeriod || "",
        leaveType: existingEvent?.leaveType || "Full Day",

        reason: existingEvent?.reason || ""
      })

      // Set the form data dynamically based on the relevant event
    } else {
      setFormData({
        ...formData,
        leaveDate: clickedDate,
        onsiteDate: clickedDate,
        misspunchDate: clickedDate,
        leaveType: "Full Day",
        reason: "",
        description: ""
      })
    }

    // setShowModal(true)
    setSelectedType("") // reset previous selection
    setShowTypeSelector(true) // open radio popup
  }
  const handleTypeContinue = () => {
    setShowTypeSelector(false)

    if (selectedType === "leave") setSelectedTab("Leave")
    if (selectedType === "onsite") setSelectedTab("Onsite")
    if (selectedType === "mispunch") setSelectedTab("Mispunch")

    // handleDateClick(selectedDate.fullDate)
    setShowModal(true)
  }

  // Check if a date is the currently selected date
  const isSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString()
  }

  // Check if a date is today
  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  // Navigate to previous month
  const prevMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() - 1)
    setCurrentDate(newDate)
  }

  // Navigate to next month
  const nextMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + 1)
    setCurrentDate(newDate)
  }

  // Go to current month
  const goToToday = () => {
    setCurrentDate(new Date())
  }
  console.log(tabs)
  const handleDataChange = (e) => {
    console.log(formData)
    console.log(e)
    setMessage((prev) => ({
      ...prev,
      top: "",
      bottom: ""
    }))
    const { name, value } = e.target
    if (name === "onsiteDate") {
      const dayOfWeek = new Date(value).getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const isSunday = dayOfWeek === 0

      const isHoliday = monthlyHoly?.some((holiday) => {
        const formattedHolyDate = holiday.holyDate.split("T")[0] // Extract YYYY-MM-DD
        return formattedHolyDate === value
      })
      if (isHoliday || isSunday) {
        setcompensatoryLeave(true)
      } else {
        setcompensatoryLeave(false)
      }
    }
    // Access current values for leave type & category
    const selectedCategory =
      name === "leaveCategory" ? value : formData.leaveCategory

    // Define leave balances (you may already have these as props or state)
    const balances = {
      "casual Leave": BalancedcasualleaveCount,
      "privileage Leave": BalanceprivilegeleaveCount,
      "compensatory Leave": BalancecompensatoryleaveCount,
      "sick Leave": BalancesickleaveCount,
      "other Leave": 1
    }

    // Get selected balance
    const selectedBalance = balances[selectedCategory] ?? 0

    // Check if switching to Full Day requires >= 1 leave
    if (
      name === "leaveType" &&
      value === "Full Day" &&
      selectedCategory &&
      (edit && formData.prevCategory === selectedCategory
        ? selectedBalance + 0.5 < 1
        : selectedBalance < 1)
    ) {
      setMessage((prev) => ({
        ...prev,
        top: `You don't have enough ${selectedCategory} for a Full Day leave.`
      }))
      // setMessage(
      //   `You don't have enough ${selectedCategory} for a Full Day leave.`
      // )
      return
    }
    if (value === "Half Day") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        halfDayPeriod: "Morning"
      }))
    } else {
      if (message) setMessage("")
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }))
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" })) // ✅ Clear error
    }
  }
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
  console.log(user)
  const handleSubmit = async (tab) => {
    console.log(tab)
    console.log("enddddddddddddddddddddddddddddddddddddddddd")
    try {
      if (tab === "New Leave" || tab === "Edit Leave") {
        const dayOfWeek = new Date(formData.leaveDate).getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const isSunday = dayOfWeek === 0

        const isHoliday = monthlyHoly?.some((holiday) => {
          const formattedHolyDate = holiday.holyDate.split("T")[0] // Extract YYYY-MM-DD
          return formattedHolyDate === formData.leaveDate
        })

        if (isSunday || isHoliday) {
          setMessage((prev) => ({
            ...prev,
            bottom: "It's a holiday—you can't request leave."
          }))
          return
        }
      }

      if (tab === "Leave" || tab === "New Leave" || tab === "Edit Leave") {
        // Validation
        let newErrors = {}
        if (!formData.leaveType) newErrors.leaveType = "Shift is required"
        if (formData.leaveType === "Half Day" && !formData.halfDayPeriod)
          newErrors.halfDayPeriod = "Please select Half Day period"
        if (!formData.leaveDate) newErrors.leaveDate = "Leave Date is required"
        if (!formData.leaveCategory)
          newErrors.leaveCategory = "Leave Type is required"
        if (!formData.reason) newErrors.reason = "Reason is required"
        if (Object.keys(newErrors).length > 0) {
          console.log(newErrors)
          setErrors(newErrors)
          return
        }
        let isApprovedLeave
        if (formData.leaveId) {
          isApprovedLeave = allleaves?.find((leave) => {
            const matchedid = leave._id === formData.leaveId

            return (
              matchedid && (leave.adminverified || leave.departmentverified)
            )
          })
        }

        if (isApprovedLeave) {
          setMessage((prev) => ({
            ...prev,
            bottom: "This leave is already approved. Do not make any changes."
          }))
        } else {
          setMessage({ top: "", bottom: "" })
          console.log("hhhhh")
          //Assuming you have an API endpoint for creating leave requests
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
          } else {
            setLoader(false)
            setEdit(false)
            if (response.status === 200) {
              setSelectedTab("Leave")
              refreshHook()
              refreshHookCompensatory()

              setFormData({
                leaveDate: "",
                leaveType: "Full Day",
                onsiteType: "Full Day",
                halfDayPeriod: "Morning",
                onsite: false,
                leaveCategory: "",
                reason: "",
                description: ""
              })
              setErrors("")
              setShowModal(false)
              toast.success(responseData.message)
            } else if (response.status === 201) {
              setMessage((prev) => ({
                ...prev,
                bottom: responseData.message
              }))
            }
          }
        }
      } else if (tab === "New Onsite" || tab === "Edit Onsite") {
        console.log("Processing onsite request")

        // Validation
        let newErrors = {}
        if (!formData.onsiteType) newErrors.onsiteType = "Shift is required"
        if (formData.onsiteType === "Half Day" && !formData.halfDayPeriod)
          newErrors.halfDayPeriod = "Please select Half Day period"
        if (!formData.onsiteDate)
          newErrors.onsiteDate = "Onsite Date is required"
        if (tableRows.length === 0)
          newErrors.tabledataError = "Please add table data"
        if (!formData.description)
          newErrors.description = "Description is required"

        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors)
          return
        }

        // Helper function to check if an onsite for a given date is already approved
        const checkApprovedOnsiteByDate = (date) => {
          return allOnsites?.find((onsite) => {
            const onsiteDate = new Date(onsite.onsiteDate)

            const isSameDate =
              onsiteDate.getFullYear() === date.getFullYear() &&
              onsiteDate.getMonth() === date.getMonth() &&
              onsiteDate.getDate() === date.getDate()

            return (
              isSameDate && (onsite.adminverified || onsite.departmentverified)
            )
          })
        }

        // Helper function to check if two dates are the same
        const isSameDate = (date1, date2) => {
          return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
          )
        }

        // For Edit Onsite, check if the original onsite was approved
        if (tab === "Edit Onsite" && formData.formerOnsiteDate) {
          const approvedFormerOnsite = checkApprovedOnsiteByDate(
            new Date(formData.formerOnsiteDate)
          )

          if (approvedFormerOnsite) {
            // Check if user is trying to change the date or onsite type
            const isDateChanged = !isSameDate(
              new Date(formData.onsiteDate),
              new Date(formData.formerOnsiteDate)
            )
            console.log(isDateChanged)
            const isOnsiteTypeChanged =
              formData.onsiteType !== formData.formerOnsiteType
            console.log(isOnsiteTypeChanged)
            if (isDateChanged || isOnsiteTypeChanged) {
              setMessage((prev) => ({
                ...prev,
                bottom:
                  "This onsite is already approved. You cannot change the date or onsite type. Only table data and description can be edited."
              }))
              return // Stop execution
            }

            // If neither date nor type changed, allow editing table and description
            console.log(
              "Approved onsite - allowing table and description edit only"
            )
          }
        }

        // For New Onsite or Edit Onsite (if not approved or not changing restricted fields)
        // Check if there's already an approved onsite on the new date
        const approvedOnsiteOnNewDate = checkApprovedOnsiteByDate(
          new Date(formData.onsiteDate)
        )

        if (approvedOnsiteOnNewDate && tab === "New Onsite") {
          setMessage((prev) => ({
            ...prev,
            bottom: "An approved onsite already exists for this date."
          }))
          return
        }

        // Clear any previous messages
        setMessage({ top: "", bottom: "" })

        // Proceed with API call
        setLoader(true)
        // const response = await api.post(
        //   `http://localhost:9000/api/auth/onsiteRegister?selectedid=${user._id}&assignedto=${user.assignedto}&compensatoryLeave=${isHaveCompensatoryleave}`,
        //   { formData, tableRows }
        // )

        const response = await api.post(
          `https://www.crm.camet.in/api/auth/onsiteRegister?selectedid=${user._id}&assignedto=${user.assignedto}&compensatoryLeave=${isHaveCompensatoryleave}`,
          { formData, tableRows }
        )

        if (response.status === 200) {
          setcompensatoryLeave(false)
          setLoader(false)
          toast.success("Onsite applied successfully")
          setSelectedTab("Leave")
          setFormData((prev) => ({
            ...prev,
            leaveDate: "",
            description: "",
            onsite: false,
            halfDayPeriod: "Morning",
            onsiteType: "Full Day",
            leaveType: "Full Day"
          }))
          setTableRows([
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
          setShowModal(false)
          refreshHook()
          refreshHookOnsite()
          refreshHookCompensatory()
        } else if (response.status === 201) {
          setLoader(false)
          setMessage((prev) => ({
            ...prev,
            bottom: response.data.message
          }))
        }
      } else if (tab === "Mispunch") {
        console.log("hhhhhh")
        console.log(formData)
        setLoader(true)
        const misspunchData = {
          misspunchDate: formData.misspunchDate,
          remark: formData?.remark,
          misspunchType: formData?.mispunchType,
          userId: user?._id,
          userModel: user?.role,
          assignedto: user?.assignedto
        }
        // const response = await api.post(
        //   "http://localhost:9000/api/auth/misspunchRegister",
        //   misspunchData
        // )

        const response = await api.post(
          "https://www.crm.camet.in/api/auth/misspunchRegister",
          misspunchData
        )
        if (response.status === 201 || response.status === 200) {
          console.log("Success:", response.data)
          toast.success("Misspunch registered")
          setLoader(false)
        }
        console.log(misspunchData)
      }
      console.log("H")
    } catch (error) {
      console.log(error)
      console.log(error?.response?.data?.message)
      setLoader(false)

      setMessage((prev) => ({
        ...prev,
        bottom: error?.response?.data?.message || "An error occurred"
      }))
      toast.error(error?.response?.data?.message || "error occured")
      console.log("error:", error)
    }
  }

  const resetApplicationFlow = () => {
    setShowModal(false)
    setShowTypeSelector(false)
    setSelectedType("")
    setSelectedDate(null)
    setcompensatoryLeave(false)
    setEdit(false)
    setSelectedTab("Leave")
    setTableRows([])
    setMessage("")
    setErrors("")
    setIsOnsite(false)
    setFormData({
      description: "",
      onsite: false,
      halfDayPeriod: "",
      leaveType: "Full Day",
      leaveCategory: "",
      reason: "",
      mispunchType: "",
      remark: ""
    })
  }

  const handleTypeSelection = (type, date) => {
    setSelectedType(type)

    if (type === "leave") {
      setSelectedTab("Leave")
      setIsOnsite(false)
    }

    if (type === "onsite") {
      setSelectedTab("Onsite")
      setIsOnsite(true)
    }

    if (type === "mispunch") {
      setSelectedTab("Mispunch")
      setIsOnsite(false)
    }

    handleDateClick(date.fullDate)
    setShowTypeSelector(false)
    setShowModal(true)
  }

  const handleSubmitAndReset = async (tabName) => {
    await handleSubmit(tabName)
    resetApplicationFlow()
  }

  const selectedTabContent = (value) => {
    let existingEvent
    switch (true) {
      case value === "Leave":
        existingEvent = events?.filter((event) => {
          const eventDate = event?.leaveDate
          if (!eventDate) return false
          return eventDate === clickedDate // Compare only the date part
        })
        if (existingEvent && existingEvent.length > 0) {
          setFormData({
            ...formData,
            leaveDate: existingEvent?.leaveDate,
            halfDayPeriod: existingEvent?.halfDayPeriod || "",
            leaveType: existingEvent?.leaveType || "",
            reason: existingEvent?.reason || "",
            onsite: false
          })
        } else {
          setFormData({
            ...formData,
            leaveDate: clickedDate,

            leaveType: "Full Day",
            reason: "",
            onsiteType: "",
            onsite: false
          })
        }

        // Handle the case where the fields are missing or falsy
        break

      case value === "Onsite":
        existingEvent = events?.filter((event) => {
          const eventDate = event?.onsiteDate
          if (!eventDate) return false
          return eventDate.toString().split("T")[0] === clickedDate // Compare only the date part
        })
        if (existingEvent && existingEvent.length > 0) {
          console.log("hhhhhh")
          // Set the form data dynamically based on the relevant event
          setFormData({
            onsiteDate: existingEvent[0]?.onsiteDate.toString().split("T")[0],
            formerOnsiteDate: existingEvent[0]?.onsiteDate
              .toString()
              .split("T")[0],
            formerOnsiteType: existingEvent[0]?.onsiteType,

            onsiteType: existingEvent[0]?.onsiteType || "",
            halfDayPeriod: existingEvent[0]?.halfDayPeriod || "",
            description: existingEvent[0]?.description || "",
            onsite: true
          })
        } else {
          setFormData({
            ...formData,
            onsiteDate: clickedDate,

            onsiteType: "Full Day",
            leaveType: "",
            description: "",
            onsite: true
          })
        }

        break

      default:
        console.log("Default case: None of the above conditions met.")
      // Handle other cases
    }
  }
  const renderContent = () => {
    switch (selectedTab) {
      case "Leave":
        return (
          <div className=" rounded-lg shadow-lg max-w-[380px]  min-w-[300px] z-40 border border-gray-300 overflow-hidden">
            {/* Leave Balance Section */}
            <div className="p-2">
              <h2 className="text-gray-600 font-semibold text-lg ">
                Leave Balance
              </h2>
              <p className="text-2xl font-bold text-gray-800">
                {BalanceprivilegeleaveCount +
                  BalancedcasualleaveCount +
                  BalancecompensatoryleaveCount}
                leaves
              </p>
              <div className="grid grid-cols-2 gap-1 border border-gray-300 rounded-lg p-2 bg-gray-50">
                <div className="font-semibold text-gray-700 text-left">
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
                    <div className="text-gray-600 text-right font-medium">
                      {balance}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-300"></div>

            {/* Upcoming Leaves */}
            <div className="p-2 text-center">
              {currentmonthleaveData?.length > 0 && (
                <h2 className="text-gray-600 font-semibold text-sm mb-2">
                  Upcoming Leaves
                </h2>
              )}

              <div className="space-y-3 max-h-36 overflow-y-auto">
                {currentmonthleaveData?.length > 0 ? (
                  currentmonthleaveData.map((leave, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 border border-gray-300 p-3 rounded-lg shadow-sm hover:cursor-pointer"
                    >
                      {/* Date */}
                      <div className="text-gray-700 font-semibold w-24 text-sm">
                        {leave.leaveDate
                          .split("T")[0]
                          .split("-")
                          .reverse()
                          .join("-")}
                      </div>

                      {/* Full/Half Day & Category */}
                      <div className="flex flex-col text-gray-600">
                        <span className="text-sm">{leave?.leaveType}</span>
                        <span className="text-sm font-semibold">
                          {leave?.leaveCategory}
                        </span>
                      </div>

                      {/* Status: Oval Badge */}
                      <div
                        className={`px-3 py-1 text-sm rounded-full text-white ${
                          leave.departmentstatus === "Dept Approved" ||
                          leave.hrstatus === "HR/Onsite Approved"
                            ? "bg-green-500"
                            : leave.departmentstatus === "Not Approved" &&
                                leave.hrstatus === "Not Approved"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      >
                        {leave.departmentstatus === "Dept Approved" ||
                        leave.hrstatus === "HR/Onsite Approved"
                          ? "Approved"
                          : leave.departmentstatus === "Not Approved" &&
                              leave.hrstatus === "Not Approved"
                            ? "Pending"
                            : ""}
                      </div>

                      {/* Forward Arrow */}
                      <FaArrowRight
                        className=" ml-2 text-gray-500 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-125"
                        onClick={() => {
                          setSelectedTab("Edit Leave")
                          setEdit(true)

                          setFormData({
                            leaveId: leave._id,
                            leaveDate: leave.leaveDate.toString().split("T")[0],
                            leaveType: leave.leaveType,
                            halfDayPeriod:
                              leave.leaveType === "Half Day"
                                ? leave.halfDayPeriod
                                : undefined,
                            leaveCategory: leave.leaveCategory,
                            prevCategory: leave.leaveCategory,
                            reason: leave.reason
                          })
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm italic text-center">
                    "No Upcoming Leaves"
                  </p>
                )}
              </div>
            </div>
          </div>
        )
      case "Onsite":
        return (
          <div className="p-2  text-center border border-gray-300 rounded-lg min-w-[320px] max-w-[380px] ">
            {currentmonthonsiteData?.length > 0 && (
              <h2 className="text-gray-600 font-semibold text-sm mb-2">
                Upcoming Onsite
              </h2>
            )}

            <div className="space-y-3 max-h-96  min-h-36 overflow-y-auto">
              {currentmonthonsiteData?.length > 0 ? (
                [...currentmonthonsiteData]
                  .sort(
                    (a, b) => new Date(a.onsiteDate) - new Date(b.onsiteDate)
                  )
                  .map((onsite, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 border border-gray-300 p-3 rounded-lg shadow-sm hover:cursor-pointer"
                    >
                      {/* Date */}
                      <div className="text-gray-700 font-semibold w-24 text-sm">
                        {onsite.onsiteDate
                          .split("T")[0]
                          .split("-")
                          .reverse()
                          .join("-")}
                      </div>

                      {/* Full/Half Day & Category */}
                      <div className="flex flex-col text-gray-600">
                        <span className="text-sm">{onsite?.onsiteType}</span>
                        {/* <span className="text-sm font-semibold">
                          {leave?.leaveCategory}
                        </span> */}
                      </div>

                      {/* Status: Oval Badge */}
                      <div
                        className={`px-3 py-1 text-sm rounded-full text-white ${
                          onsite.departmentstatus === "Dept Approved" ||
                          onsite.hrstatus === "HR/Onsite Approved"
                            ? "bg-green-500"
                            : onsite.departmentstatus === "Not Approved" &&
                                onsite.hrstatus === "Not Approved"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      >
                        {onsite.departmentstatus === "Dept Approved" ||
                        onsite.hrstatus === "HR/Onsite Approved"
                          ? "Approved"
                          : onsite.departmentstatus === "Not Approved" &&
                              onsite.hrstatus === "Not Approved"
                            ? "Pending"
                            : ""}
                      </div>

                      {/* Forward Arrow */}
                      <FaArrowRight
                        className="text-gray-500 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-125"
                        onClick={() => {
                          setSelectedTab("Edit Onsite")
                          setEdit(true)

                          setFormData({
                            onsiteId: onsite._id,
                            onsiteDate: onsite.onsiteDate
                              .toString()
                              .split("T")[0],
                            formerOnsiteDate: onsite.onsiteDate
                              .toString()
                              .split("T")[0],
                            formerOnsiteType: onsite.onsiteType,

                            onsiteType: onsite.onsiteType,
                            halfDayPeriod:
                              onsite.onsiteType === "Half Day"
                                ? onsite.halfDayPeriod
                                : undefined,

                            description: onsite.description
                          })
                          if (
                            onsite.onsiteData &&
                            onsite.onsiteData.length > 0
                          ) {
                            const matchedOnsiteData = onsite.onsiteData[0]
                              ?.flat()
                              ?.map((status) => ({
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
                        }}
                      />
                    </div>
                  ))
              ) : (
                <p className="text-gray-500 text-sm italic text-center">
                  No Upcoming Onsites
                </p>
              )}
            </div>
          </div>
        )
      case "New Onsite":
      case "Edit Onsite":
        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
              <div>
                <label className="block mb-1">Onsite Date</label>
                <input
                  type="date"
                  name="onsiteDate"
                  defaultValue={formData.onsiteDate}
                  onChange={handleDataChange}
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label className="block mb-1">Onsite Type</label>
                <select
                  name="onsiteType"
                  defaultValue={formData.onsiteType}
                  onChange={handleDataChange}
                  className="border p-2 rounded w-full"
                >
                  <option value="Full Day">Full Day</option>
                  <option value="Half Day">Half Day</option>
                </select>
              </div>
              {errors.onsiteType && (
                <p className="text-red-500">{errors.onsiteType}</p>
              )}
              {formData.onsiteType === "Half Day" && (
                <>
                  <div className="">
                    <label className="block mb-1">Select Half Day Period</label>
                    <select
                      name="halfDayPeriod"
                      defaultValue={formData.halfDayPeriod}
                      onChange={handleDataChange}
                      className="border p-2 rounded w-full appearance-none"
                    >
                      <option value="Morning">Morning</option>
                      <option value="Afternoon">Afternoon</option>
                    </select>
                  </div>
                  {errors.halfDayPeriod && (
                    <p className="text-red-500">{errors.halfDayPeriod}</p>
                  )}
                </>
              )}
            </div>
            <div className="mb-4">
              <div className="overflow-x-auto overflow-y-auto ">
                <table className=" border border-gray-200 text-center w-full">
                  <thead className="text-sm overflow-x-auto">
                    <tr>
                      <th className="border px-2 py-1 min-w-[150px]">
                        Site Name
                      </th>
                      <th className="border px-2 py-1 min-w-[150px]">Place</th>
                      <th className="border px-2 py-1  min-w-[80px]">Start</th>
                      <th className="border px-2 py-1  min-w-[80px]">End</th>
                      <th className="border px-2 py-1 min-w-[80px] ">KM</th>
                      <th className="border px-2 py-1  min-w-[100px]">TA</th>
                      <th className="border px-2 py-1  min-w-[100px]">Food </th>
                      <th className="border px-2 py-1  min-w-[80px]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows?.map((row, index) => (
                      <tr key={index}>
                        <td className="border p-1.5 ">
                          <input
                            type="text"
                            value={row.siteName}
                            onChange={(e) => {
                              const updatedRows = [...tableRows]
                              updatedRows[index].siteName = e.target.value
                              setTableRows(updatedRows)
                              setErrors((prev) => ({
                                ...prev,
                                tabledataError: ""
                              }))
                            }}
                            className="border p-1 rounded w-full"
                          />
                        </td>
                        <td className="border p-1.5 ">
                          <input
                            type="text"
                            value={row.place}
                            onChange={(e) => {
                              const updatedRows = [...tableRows]
                              updatedRows[index].place = e.target.value
                              setTableRows(updatedRows)
                              setErrors((prev) => ({
                                ...prev,
                                tabledataError: ""
                              }))
                            }}
                            className="border p-1 rounded "
                          />
                        </td>
                        <td className="border p-1.5">
                          <input
                            type="number"
                            value={row.Start}
                            onChange={(e) => {
                              const updatedRows = [...tableRows]
                              updatedRows[index].Start = e.target.value
                              setTableRows(updatedRows)
                              setErrors((prev) => ({
                                ...prev,
                                tabledataError: ""
                              }))
                            }}
                            className="border p-1 rounded w-full"
                          />
                        </td>
                        <td className="border p-1.5">
                          <input
                            type="number"
                            value={row.End}
                            onChange={(e) => {
                              const updatedRows = [...tableRows]
                              updatedRows[index].End = e.target.value
                              setTableRows(updatedRows)
                              setErrors((prev) => ({
                                ...prev,
                                tabledataError: ""
                              }))
                            }}
                            className="border p-1 rounded w-full"
                          />
                        </td>
                        <td className="border p-1.5">
                          <input
                            type="number"
                            value={row.km}
                            onChange={(e) => {
                              const updatedRows = [...tableRows]
                              updatedRows[index].km = e.target.value
                              setTableRows(updatedRows)
                              setErrors((prev) => ({
                                ...prev,
                                tabledataError: ""
                              }))
                            }}
                            className="border p-1 rounded w-full"
                          />
                        </td>
                        <td className="border p-1.5">
                          <input
                            type="number"
                            value={row.kmExpense}
                            onChange={(e) => {
                              const updatedRows = [...tableRows]
                              updatedRows[index].kmExpense = e.target.value
                              setTableRows(updatedRows)
                              setErrors((prev) => ({
                                ...prev,
                                tabledataError: ""
                              }))
                            }}
                            className="border p-1 rounded w-full"
                          />
                        </td>
                        <td className="border p-1.5 ">
                          <input
                            type="number"
                            value={row.foodExpense}
                            onChange={(e) => {
                              const updatedRows = [...tableRows]
                              updatedRows[index].foodExpense = e.target.value
                              setTableRows(updatedRows)
                              setErrors((prev) => ({
                                ...prev,
                                tabledataError: ""
                              }))
                            }}
                            className="border p-1 rounded w-full"
                          />
                        </td>
                        <td className="border p-1.5">
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
            </div>
            {errors.tabledataError && (
              <p className="text-red-500">{errors.tabledataError}</p>
            )}
            <div className="mb-4">
              <label className="block mb-2">Description</label>
              <textarea
                name="description"
                defaultValue={formData?.description}
                onChange={handleDataChange}
                rows="4"
                className="border p-2 rounded w-full"
              ></textarea>
            </div>

            {errors.description && (
              <p className="text-red-500">{errors.description}</p>
            )}
            <div className="text-center text-red-700 ">
              <p>{message?.bottom}</p>
            </div>
          </div>
        )
      case "New Leave":
      case "Edit Leave":
        return (
          <div className="bg-white rounded-lg shadow-lg max-w-[380px] min-w-[300px] z-40 border border-gray-100 px-5">
            <h2 className="text-xl font-semibold text-center">
              Leave Application
            </h2>
            <p className="mt-2 text-center text-red-600">{message.top}</p>
            <div className="mt-4">
              {/* Full Day / Half Day Selection */}
              <div className="flex gap-4">
                <label>
                  <input
                    name="leaveType"
                    type="radio"
                    value="Full Day"
                    checked={formData.leaveType === "Full Day"}
                    onChange={handleDataChange}
                  />
                  Full Day
                </label>
                <label>
                  <input
                    name="leaveType"
                    type="radio"
                    value="Half Day"
                    checked={formData.leaveType === "Half Day"}
                    onChange={handleDataChange}
                  />
                  Half Day
                </label>
                {errors.leaveType && (
                  <p className="text-red-500">{errors.leaveType}</p>
                )}
                {formData.leaveType === "Half Day" && (
                  <>
                    <select
                      name="halfDayPeriod"
                      className="border p-2 rounded w-auto"
                      value={formData?.halfDayPeriod}
                      // onChange={(e) => setLeaveOption(e.target.value)}
                      // onChange={(e) => {
                      //   setFormData((prev) => ({
                      //     ...prev,
                      //     halfDayPeriod: e.target.value // Replace newDate with the actual value you want to set
                      //   }))
                      // }}
                      onChange={handleDataChange}
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
              {/* Leave Dates */}
              {formData.leaveType === "Full Day" ? (
                <>
                  <div className="mt-1 flex flex-col">
                    <label className="text-sm font-semibold">Leave Date</label>
                    <input
                      name="leaveDate"
                      type="date"
                      value={formData?.leaveDate}
                      onChange={handleDataChange}
                      className="border p-2 rounded"
                    />
                  </div>
                  {errors.leaveDate && (
                    <p className="text-red-500">{errors.leaveDate}</p>
                  )}
                </>
              ) : (
                <>
                  <div className="mt-1">
                    <label className="text-sm font-semibold">Leave Date</label>
                    <input
                      name="leaveDate"
                      type="date"
                      value={formData?.leaveDate}
                      onChange={handleDataChange}
                      className="border p-2 rounded w-full"
                    />
                  </div>
                  {errors.leaveDate && (
                    <p className="text-red-500">{errors.leaveDate}</p>
                  )}
                </>
              )}
              {/* Leave Type Dropdown */}
              <div className="mt-1 w-full">
                <label className="text-sm font-semibold">Leave Type</label>
                <select
                  name="leaveCategory"
                  className="border p-2 rounded w-full min-w-full"
                  value={formData?.leaveCategory || ""}
                  onChange={handleDataChange}
                >
                  <option value="">Select Leave Type</option>
                  {/* If the selected leave date is in the past, only show "Other Leave" */}
                  {pastDate ? (
                    <>
                      <option value="other Leave">Other Leave</option>
                      {formData.leaveCategory === "casual Leave" && (
                        <option value="casual Leave">Casual Leave</option>
                      )}
                      {formData.leaveCategory === "privileage Leave" && (
                        <option value="privileage Leave">
                          Privileage Leave
                        </option>
                      )}
                      {formData.leaveCategory === "compensatory Leave" && (
                        <option value="compensatory Leave">
                          Compensatory Leave
                        </option>
                      )}
                      {formData.leaveCategory === "sick Leave" && (
                        <option value="sick Leave">Sick Leave</option>
                      )}
                    </>
                  ) : (
                    <>
                      {((formData.leaveType === "Full Day" &&
                        BalancedcasualleaveCount >= 1) ||
                        (formData.leaveType === "Half Day" &&
                          BalancedcasualleaveCount >= 0.5) ||
                        formData.leaveCategory === "casual Leave") && (
                        <option value="casual Leave">Casual Leave</option>
                      )}
                      {((formData.leaveType === "Full Day" &&
                        BalanceprivilegeleaveCount >= 1) ||
                        (formData.leaveType === "Half Day" &&
                          BalanceprivilegeleaveCount >= 0.5) ||
                        formData.leaveCategory === "privileage Leave") && (
                        <option value="privileage Leave">
                          Privilege Leave
                        </option>
                      )}
                      {((formData.leaveType === "Full Day" &&
                        BalancecompensatoryleaveCount >= 1) ||
                        (formData.leaveType === "Half Day" &&
                          BalancecompensatoryleaveCount >= 0.5) ||
                        formData.leaveCategory === "compensatory Leave") && (
                        <option value="compensatory Leave">
                          Compensatory Leave
                        </option>
                      )}
                      {((formData.leaveType === "Full Day" &&
                        BalancesickleaveCount >= 1) ||
                        (formData.leaveType === "Half Day" &&
                          BalancesickleaveCount >= 0.5) ||
                        formData.leaveCategory === "sick Leave") && (
                        <option value="sick Leave">Sick Leave</option>
                      )}
                      <option value="other Leave">Other Leave</option>
                    </>
                  )}
                </select>
              </div>
              {errors.leaveCategory && (
                <p className="text-red-500">{errors.leaveCategory}</p>
              )}
              {/* Reason */}
              <div className="mt-1">
                <label className="text-sm font-semibold">Reason</label>
                <textarea
                  name="reason"
                  className="border p-2 rounded w-full"
                  rows="3"
                  placeholder="Enter reason"
                  value={formData?.reason}
                  onChange={handleDataChange}
                ></textarea>
              </div>
              {errors.reason && <p className="text-red-500">{errors.reason}</p>}
              <div className="text-center text-red-700 py-3">
                <p>{message.bottom}</p>
              </div>
                        
            </div>
          </div>
        )
      default:
        return <p>Select a tab to view the content.</p>
    }
  }
  return (
    //updated
    // <div className="w-full ">
    //   {/* HEADER */}
    //   <div className="flex items-center justify-between sticky top-0 py-3 px-4 z-30 bg-white">
    //     <h2 className="text-xl font-semibold">{visibleMonth}</h2>
    //     <div className="flex space-x-2">
    //       <button
    //         onClick={prevMonth}
    //         className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
    //       >
    //         <HiChevronLeft className="w-5 h-5" />
    //       </button>

    //       <button
    //         onClick={goToToday}
    //         className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
    //       >
    //         Today
    //       </button>

    //       <button
    //         onClick={nextMonth}
    //         className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
    //       >
    //         <HiChevronRight className="w-5 h-5" />
    //       </button>
    //     </div>
    //   </div>

    //   {/* DATE LIST */}
    //   <div className="overflow-y-auto border rounded-lg mx-4">
    //     {visibleDays.map((date, index) => (
    //       <div
    //         key={index}
    //         onClick={() => {
    //           setSelectedDate(date)
    //           setSelectedType("")
    //           setShowTypeSelector(true) // 🔥 FIRST POPUP
    //         }}
    //         className="flex justify-between items-center px-4 py-2 mb-2 cursor-pointer bg-gray-200"
    //       >
    //         <div>
    //           <div className="flex items-center">
    //             <div className="rounded-full border mr-4 font-bold text-sm sm:text-lg px-2">
    //               {date.fullMonthDay}
    //             </div>
    //             <div className="font-medium">
    //               {new Date(date.fullDate).toLocaleString("default", {
    //                 weekday: "long"
    //               })}
    //             </div>
    //           </div>
    //         </div>

    //         {/* LEAVE DATA */}
    //         <div className="flex flex-col">
    //           {currentmonthleaveData?.length > 0 &&
    //             currentmonthleaveData
    //               .filter(
    //                 (leave) =>
    //                   new Date(leave.leaveDate).toISOString().split("T")[0] ===
    //                   date.fullDate
    //               )
    //               .map((leave, i) => (
    //                 <div key={i} className="flex items-center mb-1">
    //                   <div className="flex flex-col text-gray-600">
    //                     <span className="text-sm">{leave?.leaveType}</span>
    //                     <span className="text-sm font-semibold">
    //                       {leave?.leaveCategory}
    //                     </span>
    //                   </div>

    //                   <div
    //                     className={`px-3 ml-2 py-1 text-sm rounded-full text-white ${
    //                       leave.departmentstatus === "Dept Approved" ||
    //                       leave.hrstatus === "HR/Onsite Approved"
    //                         ? "bg-green-500"
    //                         : leave.departmentstatus === "Not Approved" &&
    //                             leave.hrstatus === "Not Approved"
    //                           ? "bg-yellow-500"
    //                           : "bg-red-500"
    //                     }`}
    //                   >
    //                     {leave.departmentstatus === "Dept Approved" ||
    //                     leave.hrstatus === "HR/Onsite Approved"
    //                       ? "Approved"
    //                       : leave.departmentstatus === "Not Approved" &&
    //                           leave.hrstatus === "Not Approved"
    //                         ? "Pending"
    //                         : ""}
    //                   </div>
    //                 </div>
    //               ))}
    //         </div>
    //       </div>
    //     ))}
    //   </div>

    //   {/* 🔴 TYPE SELECTOR POPUP */}
    //   {showTypeSelector && (
    //     <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    //       <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
    //         <h3 className="text-lg font-semibold mb-4 text-center">
    //           Select Request Type
    //         </h3>

    //         <div className="flex flex-col space-y-3">
    //           {["leave", "onsite", "mispunch"].map((type) => (
    //             <label key={type} className="flex items-center space-x-2">
    //               <input
    //                 type="radio"
    //                 name="type"
    //                 value={type}
    //                 checked={selectedType === type}
    //                 onChange={(e) => setSelectedType(e.target.value)}
    //               />
    //               <span className="capitalize">{type}</span>
    //             </label>
    //           ))}
    //         </div>

    //         <div className="flex justify-between mt-5">
    //           <button
    //             className="bg-gray-400 text-white px-4 py-1 rounded"
    //             onClick={() => {
    //               setShowTypeSelector(false)
    //               setSelectedType("")
    //             }}
    //           >
    //             Cancel
    //           </button>

    //           <button
    //             disabled={!selectedType}
    //             className={`px-4 py-1 rounded text-white ${
    //               selectedType ? "bg-blue-600" : "bg-gray-300"
    //             }`}
    //             onClick={() => {
    //               setShowTypeSelector(false)

    //               if (selectedType === "leave") setSelectedTab("Leave")
    //               if (selectedType === "onsite") setSelectedTab("Onsite")
    //               if (selectedType === "mispunch") setSelectedTab("Mispunch")

    //               handleDateClick(selectedDate.fullDate)
    //               setShowModal(true)
    //             }}
    //           >
    //             Continue
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   )}

    //   {/* 🔴 MAIN MODAL */}
    //   {showModal && leaveBalance && (
    //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    //       <div
    //         className={`bg-white rounded-lg shadow-lg mx-4 max-h-[90vh] overflow-y-auto flex flex-col ${
    //           selectedTab === "New Onsite" ? "md:w-3/4" : "sm:w-auto"
    //         }`}
    //       >
    //         {loader && (
    //           <BarLoader
    //             cssOverride={{ width: "100%", height: "6px" }}
    //             color="#4A90E2"
    //           />
    //         )}
    //         <div className="p-3">
    //           {/* TABS (ONLY SELECTED TYPE) */}
    //           <div className="flex justify-center space-x-4">
    //             {tabs
    //               ?.filter((tab) => {
    //                 if (selectedType === "leave")
    //                   return ["Leave", "New Leave", "Edit Leave"].includes(tab)
    //                 if (selectedType === "onsite")
    //                   return ["Onsite", "New Onsite", "Edit Onsite"].includes(
    //                     tab
    //                   )
    //                 if (selectedType === "mispunch") return tab === "Mispunch"
    //                 return false
    //               })
    //               .map((tab) => (
    //                 <span
    //                   key={tab}
    //                   onClick={() => {
    //                     setSelectedTab(tab)
    //                     setMessage("")
    //                     selectedTabContent(tab)
    //                     setIsOnsite(tab === "Onsite")
    //                   }}
    //                   className={`cursor-pointer ${
    //                     selectedTab === tab
    //                       ? "text-blue-500 font-semibold underline"
    //                       : "text-black"
    //                   }`}
    //                 >
    //                   {tab}
    //                 </span>
    //               ))}
    //           </div>

    //           {/* CONTENT */}
    //           <div className="mt-4">
    //             {/* ✅ EXISTING CONTENT FOR LEAVE & ONSITE */}
    //             {selectedTab !== "Mispunch" && renderContent()}

    //             {/* ✅ MISPUNCH CONTENT */}
    //             {selectedTab === "Mispunch" && (
    //               <div className="space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto px-1">
    //                 {/* Date Display */}
    //                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
    //                   <div className="flex items-center justify-between">
    //                     <div className="flex items-center gap-2">
    //                       <svg
    //                         className="w-4 h-4 text-blue-600"
    //                         fill="none"
    //                         stroke="currentColor"
    //                         viewBox="0 0 24 24"
    //                       >
    //                         <path
    //                           strokeLinecap="round"
    //                           strokeLinejoin="round"
    //                           strokeWidth={2}
    //                           d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    //                         />
    //                       </svg>
    //                       <span className="text-xs font-medium text-blue-900">
    //                         Request Date
    //                       </span>
    //                     </div>
    //                     <span className="text-sm font-semibold text-blue-700">
    //                       {(formData.misspunchDate
    //                         ? new Date(formData.misspunchDate)
    //                         : new Date()
    //                       ).toLocaleDateString("en-GB", {
    //                         day: "2-digit",
    //                         month: "short",
    //                         year: "numeric"
    //                       })}
    //                     </span>
    //                   </div>
    //                 </div>

    //                 {/* Header Section */}
    //                 <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-lg p-3">
    //                   <div className="flex items-start gap-2">
    //                     <div className="bg-amber-100 rounded-full p-1.5 mt-0.5 flex-shrink-0">
    //                       <svg
    //                         className="w-4 h-4 text-amber-600"
    //                         fill="none"
    //                         stroke="currentColor"
    //                         viewBox="0 0 24 24"
    //                       >
    //                         <path
    //                           strokeLinecap="round"
    //                           strokeLinejoin="round"
    //                           strokeWidth={2}
    //                           d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    //                         />
    //                       </svg>
    //                     </div>
    //                     <div>
    //                       <h3 className="text-sm font-semibold text-gray-800 mb-0.5">
    //                         Report a Misspunch
    //                       </h3>
    //                       <p className="text-xs text-gray-600 leading-tight">
    //                         Missed clocking in or out? Let us know and we'll
    //                         help correct your attendance.
    //                       </p>
    //                     </div>
    //                   </div>
    //                 </div>

    //                 {/* Form Fields */}
    //                 <div className="space-y-4">
    //                   {/* Misspunch Type */}
    //                   <div>
    //                     <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-2">
    //                       <svg
    //                         className="w-3.5 h-3.5 text-gray-500"
    //                         fill="none"
    //                         stroke="currentColor"
    //                         viewBox="0 0 24 24"
    //                       >
    //                         <path
    //                           strokeLinecap="round"
    //                           strokeLinejoin="round"
    //                           strokeWidth={2}
    //                           d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
    //                         />
    //                       </svg>
    //                       Punch Type
    //                     </label>
    //                     <div className="grid grid-cols-2 gap-2.5">
    //                       {["In", "Out"].map((type) => (
    //                         <button
    //                           key={type}
    //                           type="button"
    //                           onClick={() =>
    //                             setFormData((prev) => ({
    //                               ...prev,
    //                               mispunchType: type
    //                             }))
    //                           }
    //                           className={`
    //                         relative px-3 py-2.5 rounded-lg border-2 transition-all duration-200
    //                         ${
    //                           formData.mispunchType === type
    //                             ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
    //                             : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
    //                         }
    //                       `}
    //                         >
    //                           <div className="flex items-center justify-center gap-1.5">
    //                             {type === "In" ? (
    //                               <svg
    //                                 className="w-4 h-4"
    //                                 fill="none"
    //                                 stroke="currentColor"
    //                                 viewBox="0 0 24 24"
    //                               >
    //                                 <path
    //                                   strokeLinecap="round"
    //                                   strokeLinejoin="round"
    //                                   strokeWidth={2}
    //                                   d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
    //                                 />
    //                               </svg>
    //                             ) : (
    //                               <svg
    //                                 className="w-4 h-4"
    //                                 fill="none"
    //                                 stroke="currentColor"
    //                                 viewBox="0 0 24 24"
    //                               >
    //                                 <path
    //                                   strokeLinecap="round"
    //                                   strokeLinejoin="round"
    //                                   strokeWidth={2}
    //                                   d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    //                                 />
    //                               </svg>
    //                             )}
    //                             <span className="text-sm font-medium">
    //                               Punch {type}
    //                             </span>
    //                           </div>
    //                           {formData.mispunchType === type && (
    //                             <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-0.5">
    //                               <svg
    //                                 className="w-2.5 h-2.5"
    //                                 fill="currentColor"
    //                                 viewBox="0 0 20 20"
    //                               >
    //                                 <path
    //                                   fillRule="evenodd"
    //                                   d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
    //                                   clipRule="evenodd"
    //                                 />
    //                               </svg>
    //                             </div>
    //                           )}
    //                         </button>
    //                       ))}
    //                     </div>
    //                   </div>

    //                   {/* Remark */}
    //                   <div>
    //                     <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-2">
    //                       <svg
    //                         className="w-3.5 h-3.5 text-gray-500"
    //                         fill="none"
    //                         stroke="currentColor"
    //                         viewBox="0 0 24 24"
    //                       >
    //                         <path
    //                           strokeLinecap="round"
    //                           strokeLinejoin="round"
    //                           strokeWidth={2}
    //                           d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
    //                         />
    //                       </svg>
    //                       Reason for Misspunch
    //                     </label>
    //                     <textarea
    //                       className="w-full border-2 border-gray-200 px-3 py-2 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 resize-none"
    //                       rows={3}
    //                       placeholder="Please explain why you missed the punch (e.g., forgot to clock in, system error, etc.)"
    //                       value={formData.remark || ""}
    //                       onChange={(e) =>
    //                         setFormData((prev) => ({
    //                           ...prev,
    //                           remark: e.target.value
    //                         }))
    //                       }
    //                     />

    //                     <p className="text-xs text-gray-500 mt-1">
    //                       Provide clear details to help us process your request
    //                       faster
    //                     </p>
    //                   </div>
    //                 </div>
    //               </div>
    //             )}
    //           </div>

    //           {/* BUTTONS SECTION */}
    //           <div className="flex justify-center mt-4 gap-4">
    //             {/* MISPUNCH SUBMIT BUTTON */}
    //             {selectedTab === "Mispunch" && (
    //               <button
    //                 className="group relative bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    //                 onClick={() => handleSubmit("Mispunch")}
    //                 disabled={!formData.mispunchType || !formData.remark}
    //               >
    //                 <span className="flex items-center gap-1.5">
    //                   Submit Request
    //                   <svg
    //                     className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
    //                     fill="none"
    //                     stroke="currentColor"
    //                     viewBox="0 0 24 24"
    //                   >
    //                     <path
    //                       strokeLinecap="round"
    //                       strokeLinejoin="round"
    //                       strokeWidth={2}
    //                       d="M13 7l5 5m0 0l-5 5m5-5H6"
    //                     />
    //                   </svg>
    //                 </span>
    //               </button>
    //             )}

    //             {/* LEAVE - APPLY NEW BUTTON */}
    //             {selectedTab === "Leave" && (
    //               <button
    //                 className="bg-blue-800 rounded-lg px-4 py-2 text-white hover:bg-blue-700"
    //                 onClick={() => {
    //                   setSelectedTab("New Leave")
    //                   setFormData((prev) => ({
    //                     ...prev,
    //                     leaveType: "Full Day",
    //                     leaveCategory: "",
    //                     halfDayPeriod: "",
    //                     reason: ""
    //                   }))
    //                 }}
    //               >
    //                 Apply New Leaves
    //               </button>
    //             )}

    //             {/* ONSITE - APPLY NEW BUTTON */}
    //             {selectedTab === "Onsite" && (
    //               <button
    //                 onClick={() => {
    //                   setSelectedTab("New Onsite")
    //                   setFormData((prev) => ({
    //                     ...prev,
    //                     onsiteType: "Full Day",
    //                     halfDayPeriod: "",
    //                     description: ""
    //                   }))
    //                   setTableRows([])
    //                 }}
    //                 className="py-2 bg-blue-800 shadow-lg text-white rounded-lg px-4 hover:bg-blue-900"
    //               >
    //                 Apply New Onsite
    //               </button>
    //             )}

    //             {/* SUBMIT/UPDATE BUTTON FOR NEW LEAVE, EDIT LEAVE, NEW ONSITE, EDIT ONSITE */}
    //             {(selectedTab === "Edit Onsite" ||
    //               selectedTab === "Edit Leave" ||
    //               selectedTab === "New Leave" ||
    //               selectedTab === "New Onsite") && (
    //               <>
    //                 <button
    //                   className="bg-gradient-to-b from-blue-400 to-blue-500 px-4 py-2 hover:from-blue-400 hover:to-blue-600 text-white rounded"
    //                   onClick={() => handleSubmit(selectedTab)}
    //                 >
    //                   {selectedTab === "Edit Onsite" ||
    //                   selectedTab === "Edit Leave"
    //                     ? "Update"
    //                     : "Submit"}
    //                 </button>

    //                 {/* DELETE BUTTON */}
    //                 {(selectedTab === "Edit Onsite" ||
    //                   selectedTab === "Edit Leave") && (
    //                   <button
    //                     className="bg-red-600 px-4 py-2 rounded-md text-white font-semibold shadow-lg hover:bg-red-700 active:shadow-md active:translate-y-[2px] transition-all duration-200"
    //                     onClick={() => handledelete(formData)}
    //                   >
    //                     Delete
    //                   </button>
    //                 )}
    //               </>
    //             )}

    //             {/* CLOSE BUTTON - ALWAYS VISIBLE */}
    //             <button
    //               className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
    //               onClick={() => {
    //                 setShowModal(false)
    //                 setSelectedType("")
    //                 setcompensatoryLeave(false)
    //                 setEdit(false)
    //                 setFormData({
    //                   description: "",
    //                   onsite: false,
    //                   halfDayPeriod: "",
    //                   leaveType: "Full Day",
    //                   mispunchType: "",
    //                   remark: ""
    //                 })
    //                 setSelectedTab("Leave")
    //                 setTableRows([])
    //                 setMessage("")
    //                 setErrors("")
    //               }}
    //             >
    //               Close
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   )}
    // </div>
    <div className="w-full">
      {/* HEADER */}
      <div className="sticky top-0 z-30 flex items-center justify-between bg-white px-4 py-3">
        <h2 className="text-xl font-semibold">{visibleMonth}</h2>

        <div className="flex space-x-2">
          <button
            onClick={prevMonth}
            className="rounded-full bg-gray-100 p-2 transition hover:bg-gray-200"
          >
            <HiChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={goToToday}
            className="rounded-lg bg-gray-100 px-4 py-2 transition hover:bg-gray-200"
          >
            Today
          </button>

          <button
            onClick={nextMonth}
            className="rounded-full bg-gray-100 p-2 transition hover:bg-gray-200"
          >
            <HiChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* DATE LIST */}
      <div className="mx-4 overflow-y-auto rounded-lg border">
        {visibleDays.map((date, index) => (
          <div
            key={index}
            onClick={() => {
              setSelectedDate(date)
              setSelectedType("")
              setShowTypeSelector(true)
            }}
            className="mb-2 flex cursor-pointer items-center justify-between bg-gray-200 px-4 py-2"
          >
            <div>
              <div className="flex items-center">
                <div className="mr-4 rounded-full border px-2 text-sm font-bold sm:text-lg">
                  {date.fullMonthDay}
                </div>

                <div className="font-medium">
                  {new Date(date.fullDate).toLocaleString("default", {
                    weekday: "long"
                  })}
                </div>
              </div>
            </div>

            {/* LEAVE DATA */}
            <div className="flex flex-col">
              {currentmonthleaveData?.length > 0 &&
                currentmonthleaveData
                  .filter(
                    (leave) =>
                      new Date(leave.leaveDate).toISOString().split("T")[0] ===
                      date.fullDate
                  )
                  .map((leave, i) => (
                    <div key={i} className="mb-1 flex items-center">
                      <div className="flex flex-col text-gray-600">
                        <span className="text-sm">{leave?.leaveType}</span>
                        <span className="text-sm font-semibold">
                          {leave?.leaveCategory}
                        </span>
                      </div>

                      <div
                        className={`ml-2 rounded-full px-3 py-1 text-sm text-white ${
                          leave.departmentstatus === "Dept Approved" ||
                          leave.hrstatus === "HR/Onsite Approved"
                            ? "bg-green-500"
                            : leave.departmentstatus === "Not Approved" &&
                                leave.hrstatus === "Not Approved"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      >
                        {leave.departmentstatus === "Dept Approved" ||
                        leave.hrstatus === "HR/Onsite Approved"
                          ? "Approved"
                          : leave.departmentstatus === "Not Approved" &&
                              leave.hrstatus === "Not Approved"
                            ? "Pending"
                            : ""}
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        ))}
      </div>

      {/* TYPE SELECTOR POPUP */}
      {showTypeSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-80 rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-center text-lg font-semibold">
              Select Request Type
            </h3>

            <div className="flex flex-col space-y-3">
              {["leave", "onsite", "mispunch"].map((type) => (
                <label
                  key={type}
                  className="flex cursor-pointer items-center space-x-2 rounded-md px-2 py-2 transition hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="type"
                    value={type}
                    checked={selectedType === type}
                    onChange={(e) =>
                      handleTypeSelection(e.target.value, selectedDate)
                    }
                  />
                  <span className="capitalize">{type}</span>
                </label>
              ))}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                className="rounded bg-gray-400 px-4 py-1 text-white transition hover:bg-gray-500"
                onClick={() => {
                  setShowTypeSelector(false)
                  setSelectedType("")
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN MODAL */}
      {showModal && leaveBalance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className={`mx-4 flex max-h-[90vh] flex-col overflow-y-auto rounded-lg bg-white shadow-lg ${
              selectedTab === "New Onsite" ? "md:w-3/4" : "sm:w-auto"
            }`}
          >
            {loader && (
              <BarLoader
                cssOverride={{ width: "100%", height: "6px" }}
                color="#4A90E2"
              />
            )}

            <div className="p-3">
              {/* TABS */}
              <div className="flex justify-center space-x-4">
                {tabs
                  ?.filter((tab) => {
                    if (selectedType === "leave") {
                      return ["Leave", "New Leave", "Edit Leave"].includes(tab)
                    }
                    if (selectedType === "onsite") {
                      return ["Onsite", "New Onsite", "Edit Onsite"].includes(
                        tab
                      )
                    }
                    if (selectedType === "mispunch") {
                      return tab === "Mispunch"
                    }
                    return false
                  })
                  .map((tab) => (
                    <span
                      key={tab}
                      onClick={() => {
                        setSelectedTab(tab)
                        setMessage("")
                        selectedTabContent(tab)
                        setIsOnsite(tab === "Onsite")
                      }}
                      className={`cursor-pointer ${
                        selectedTab === tab
                          ? "font-semibold text-blue-500 underline"
                          : "text-black"
                      }`}
                    >
                      {tab}
                    </span>
                  ))}
              </div>

              {/* CONTENT */}
              <div className="mt-4">
                {selectedTab !== "Mispunch" && renderContent()}

                {selectedTab === "Mispunch" && (
                  <div className="max-h-[calc(100vh-280px)] space-y-4 overflow-y-auto px-1">
                    {/* Date Display */}
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg
                            className="h-4 w-4 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>

                          <span className="text-xs font-medium text-blue-900">
                            Request Date
                          </span>
                        </div>

                        <span className="text-sm font-semibold text-blue-700">
                          {(formData.misspunchDate
                            ? new Date(formData.misspunchDate)
                            : new Date()
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Header Section */}
                    <div className="rounded-lg border-l-4 border-amber-500 bg-gradient-to-r from-amber-50 to-orange-50 p-3">
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5 flex-shrink-0 rounded-full bg-amber-100 p-1.5">
                          <svg
                            className="h-4 w-4 text-amber-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>

                        <div>
                          <h3 className="mb-0.5 text-sm font-semibold text-gray-800">
                            Report a Misspunch
                          </h3>
                          <p className="text-xs leading-tight text-gray-600">
                            Missed clocking in or out? Let us know and we'll
                            help correct your attendance.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                      {/* Misspunch Type */}
                      <div>
                        <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-gray-700">
                          <svg
                            className="h-3.5 w-3.5 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                          Punch Type
                        </label>

                        <div className="grid grid-cols-2 gap-2.5">
                          {["In", "Out"].map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  mispunchType: type
                                }))
                              }
                              className={`relative rounded-lg border-2 px-3 py-2.5 transition-all duration-200 ${
                                formData.mispunchType === type
                                  ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center justify-center gap-1.5">
                                {type === "In" ? (
                                  <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                  </svg>
                                )}

                                <span className="text-sm font-medium">
                                  Punch {type}
                                </span>
                              </div>

                              {formData.mispunchType === type && (
                                <div className="absolute -right-1 -top-1 rounded-full bg-blue-500 p-0.5 text-white">
                                  <svg
                                    className="h-2.5 w-2.5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    />
                                  </svg>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Remark */}
                      <div>
                        <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-gray-700">
                          <svg
                            className="h-3.5 w-3.5 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                            />
                          </svg>
                          Reason for Misspunch
                        </label>

                        <textarea
                          className="w-full resize-none rounded-lg border-2 border-gray-200 px-3 py-2 text-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          rows={3}
                          placeholder="Please explain why you missed the punch (e.g., forgot to clock in, system error, etc.)"
                          value={formData.remark || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              remark: e.target.value
                            }))
                          }
                        />

                        <p className="mt-1 text-xs text-gray-500">
                          Provide clear details to help us process your request
                          faster
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* BUTTONS SECTION */}
              <div className="mt-4 flex justify-center gap-4">
                {/* MISPUNCH SUBMIT */}
                {selectedTab === "Mispunch" && (
                  <button
                    className="group relative rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-200 transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => handleSubmitAndReset("Mispunch")}
                    disabled={!formData.mispunchType || !formData.remark}
                  >
                    <span className="flex items-center gap-1.5">
                      Submit Request
                      <svg
                        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </span>
                  </button>
                )}

                {/* LEAVE APPLY NEW */}
                {selectedTab === "Leave" && (
                  <button
                    className="rounded-lg bg-blue-800 px-4 py-2 text-white hover:bg-blue-700"
                    onClick={() => {
                      setSelectedTab("New Leave")
                      setFormData((prev) => ({
                        ...prev,
                        leaveType: "Full Day",
                        leaveCategory: "",
                        halfDayPeriod: "",
                        reason: ""
                      }))
                    }}
                  >
                    Apply New Leaves
                  </button>
                )}

                {/* ONSITE APPLY NEW */}
                {selectedTab === "Onsite" && (
                  <button
                    onClick={() => {
                      setSelectedTab("New Onsite")
                      setFormData((prev) => ({
                        ...prev,
                        onsiteType: "Full Day",
                        halfDayPeriod: "",
                        description: ""
                      }))
                      setTableRows([])
                    }}
                    className="rounded-lg bg-blue-800 px-4 py-2 text-white shadow-lg hover:bg-blue-900"
                  >
                    Apply New Onsite
                  </button>
                )}

                {/* SUBMIT / UPDATE */}
                {(selectedTab === "Edit Onsite" ||
                  selectedTab === "Edit Leave" ||
                  selectedTab === "New Leave" ||
                  selectedTab === "New Onsite") && (
                  <>
                    <button
                      className="rounded bg-gradient-to-b from-blue-400 to-blue-500 px-4 py-2 text-white hover:from-blue-400 hover:to-blue-600"
                      onClick={() => handleSubmitAndReset(selectedTab)}
                    >
                      {selectedTab === "Edit Onsite" ||
                      selectedTab === "Edit Leave"
                        ? "Update"
                        : "Submit"}
                    </button>

                    {(selectedTab === "Edit Onsite" ||
                      selectedTab === "Edit Leave") && (
                      <button
                        className="rounded-md bg-red-600 px-4 py-2 font-semibold text-white shadow-lg transition-all duration-200 hover:bg-red-700 active:translate-y-[2px] active:shadow-md"
                        onClick={() => handledelete(formData)}
                      >
                        Delete
                      </button>
                    )}
                  </>
                )}

                {/* CLOSE */}
                <button
                  className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                  onClick={resetApplicationFlow}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LeaveApplication
