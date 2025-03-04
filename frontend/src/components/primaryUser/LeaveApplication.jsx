import React, { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import dayjs from "dayjs"
import { FaArrowRight } from "react-icons/fa"
import tippy from "tippy.js"
import UseFetch from "../../hooks/useFetch"
import api from "../../api/api"
import "tippy.js/dist/tippy.css"
import debounce from "lodash.debounce"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import "tippy.js/themes/light.css" // Example for light theme

function LeaveApplication() {
  const [events, setEvents] = useState([])
  const [BalanceprivilegeleaveCount, setBalanceprivilegeLeaveCount] =
    useState(0)
  const [leaveBalance, setLeaveBalance] = useState({})
  const [BalancedcasualleaveCount, setBalancecasualLeaveCount] = useState(0)
  const [BalancesickleaveCount, setBalancesickLeaveCount] = useState(0)
  const [BalancecompensatoryleaveCount, setBalancecompensatoryLeaveCount] =
    useState(0)
  const [allleaves, setAllleaves] = useState([])
  const [allOnsites, setAllOnsite] = useState([])
  const [errors, setErrors] = useState({})

  const [MonthData, setMonthData] = useState({})
  const [currentMonthData, setcurrentMonthData] = useState({})
  // const [currentMonth, setCurrentMonth] = useState("")
  const [remainingDays, setRemainingDays] = useState(0)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [message, setMessage] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [pastDate, setPastDate] = useState(null)
  const [selectedTab, setSelectedTab] = useState("Leave")
  const [formData, setFormData] = useState({
    startDate: "",

    leaveType: "Full Day",
    onsiteType: "Full Day",

    halfDayPeriod: "",
    onsite: false,
    leaveCategory: "",
    reason: "",
    description: "",
    eventId: null
  })
  const [selectedAttendance, setselectedAttendance] = useState({
    attendanceDate: "",
    inTime: { hours: "12", minutes: "00", amPm: "AM" },
    outTime: { hours: "12", minutes: "00", amPm: "AM" }
  })
  const [isOnsite, setIsOnsite] = useState(false)

  const [tableRows, setTableRows] = useState([])
  const [clickedDate, setclickedDate] = useState(null)
  const [currentmonthleaveData, setcurrentmonthLeaveData] = useState([])
  const userData = localStorage.getItem("user")
  const tabs = ["Leave", "Onsite"]
  const user = JSON.parse(userData)

  const { data: leaves, refreshHook } = UseFetch(
    user && `/auth/getallLeave?userid=${user._id}`
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
    const today = dayjs().format("YYYY-MM-DD") // Get today's date in YYYY-MM-DD format
    const isPastDate =
      formData?.startDate && dayjs(formData.startDate).isBefore(today)
    setPastDate(isPastDate)
  }, [formData])
  useEffect(() => {
    if ((leaves && leaves.length > 0) || (allonsite && allonsite.length) > 0) {
      setAllleaves(leaves)
      setAllOnsite(allonsite)
    }
  }, [leaves, allonsite])
  useEffect(() => {
    if (allleaves && allleaves.length > 0 && leavemasterleavecount) {
      const currentDate = new Date()

      const currentYear = currentDate.getFullYear()
      const currentmonth = currentDate.getMonth() + 1
      const leaveDate = new Date(formData.startDate)
      const leaveYear = leaveDate.getFullYear()
      const startDate = new Date(user?.privilegeleavestartsfrom)
      const startYear = startDate.getFullYear()
      const startmonth = startDate.getMonth() + 1 // 1-based month
      const totalprivilegeLeave = leavemasterleavecount?.totalprivilegeLeave
      const privilegePerMonth = totalprivilegeLeave / 12
      const totalcasualLeave = leavemasterleavecount?.totalcasualleave
      const casualPerMonth = totalcasualLeave / 12
      let ownedprivilegeCount = 0
      let ownedcasualCount = 0
      if (startYear < currentYear) {
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
      } else if (startYear === currentYear) {
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
      const filteredcurrentmonthlyLeaves = allleaves.filter((leaves) => {
        ///leavedate is iso format like "2025-03-03T12:00:00Z" so here slice 0 takes the first part and get the first 7 means 2025-03 because current month includes year also 2025-03
        const leaveMonth = leaves.leaveDate.split("T")[0].slice(0, 7)
        //here currentMonth have year and month no date
        return leaveMonth === currentMonth
      })
      setcurrentmonthLeaveData(filteredcurrentmonthlyLeaves)

      const usedCasualCount = allleaves?.reduce((count, leave) => {
        if (!leave.leaveDate) return count
        const leaveDate = new Date(formData.startDate)
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

        const leaveYear = new Date(formData.startDate).getFullYear()
        const leaveYearFromData = new Date(leave.leaveDate).getFullYear()

        if (
          leave.leaveCategory === "privileage Leave" &&
          leaveYear === leaveYearFromData
        ) {
          return count + (leave.leaveType === "Half Day" ? 0.5 : 1)
        }

        return count
      }, 0)
      const balancecasualcount = usedCasualCount === ownedcasualCount ? 0 : 1
      const balanceprivilege = ownedprivilegeCount - takenPrivilegeCount
      setBalanceprivilegeLeaveCount(Math.max(balanceprivilege, 0))
      setBalancecasualLeaveCount(balancecasualcount)

      setLeaveBalance({
        casual: balancecasualcount,
        privilege: Math.max(balanceprivilege, 0),
        sick: BalancesickleaveCount,
        compensatory: BalancecompensatoryleaveCount
      })
    } else if (allleaves && allleaves.length === 0 && leavemasterleavecount) {
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear()
      const currentmonth = currentDate.getMonth() + 1
      const leaveDate = new Date(formData.startDate)
      const leaveYear = leaveDate.getFullYear()
      const startDate = new Date(user?.privilegeleavestartsfrom)
      const startYear = startDate.getFullYear()
      const startmonth = startDate.getMonth() + 1 // 1-based month
      const totalprivilegeLeave = leavemasterleavecount.totalprivilegeLeave
      const privilegePerMonth = totalprivilegeLeave / 12 // 1 or 2 per month
      const totalcasualLeave = leavemasterleavecount.totalcasualleave
      const casualPerMonth = totalcasualLeave / 12
      let ownedprivilegeCount = 0
      let ownedcasualCount = 0
      if (startYear < currentYear) {
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
      } else if (startYear === currentYear) {
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
  const { data: attendee, refreshHook: refreshattendee } = UseFetch(
    user && `/auth/getallAttendance?userid=${user._id}`
  )
  const calculateRemainingDays = (year, month) => {
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate()
    // const totalDaysInMonth = new Date(year, month + 1, 0).getDate() // Get last day of month
    const eventDates = new Set(
      events.map((event) => new Date(event.start).getDate())
    ) // Unique event days

    let sundayCount = 0
    let eventDayCount = eventDates.size

    // Loop through days of the month to count Sundays
    for (let day = 1; day <= totalDaysInMonth; day++) {
      const date = new Date(year, month, day)
      if (date.getDay() === 0) sundayCount++ // Count Sundays
    }

    // Calculate remaining days
    const remaining = totalDaysInMonth - eventDayCount - sundayCount
    setRemainingDays(remaining)
  }

  // Handle month change
  const handleMonthChange = (info) => {
    const newMonth = info.view.currentStart.getMonth()
    const newYear = info.view.currentStart.getFullYear()

    setCurrentMonth(newMonth)
    setCurrentYear(newYear)
    calculateRemainingDays(newYear, newMonth)
  }

  useEffect(() => {
    if (events && events.length > 0 && currentMonth && currentYear) {
      calculateRemainingDays(currentYear, currentMonth)
    }
  }, [events, currentMonth, currentYear])
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
      (allleaves && allleaves.length > 0) ||
      (attendee && attendee.length > 0) ||
      (allOnsites && allOnsites.length > 0)
    ) {
      let formattedonsite
      const formattedEvents = formatEventData(allleaves)
      if (allOnsites && allOnsites.length > 0) {
        formattedonsite = formatonsite(allOnsites)
      }

      let attendanceDetails
      if (
        formattedEvents &&
        formattedEvents.length > 0 &&
        attendee &&
        attendee.length > 0 &&
        formattedonsite &&
        formattedonsite.length > 0
      ) {
        const check = (date) => {
          const fdate = new Date(date)
          for (const entry of formattedonsite) {
            const a = fdate.toISOString().split("T")[0]
            // Check if onsiteType is Full Day or Half Day
            if (entry.start === a && entry.onsiteType === "Full Day") {
              entry.color = ""
              return true
            }
          }
          return false
        }
        //new code
        // let present = 0
        // let earlyGoing = 0
        // let lateComing = 0
        // let halfDay = 0
        // let fullDay = 0
        // let onsite = 0
        const monthlyAttendance = {}

        // Function to get month-year key
        const getMonthKey = (dateStr) => {
          const date = new Date(dateStr)
          return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}`
        }

        // Function to convert time string to Date object
        // const parseTime = (timeStr) => new Date(`2024-01-01 ${timeStr}`)
        // const parseTime = (timeStr) =>
        //   new Date(`2024-01-01 ${timeStr.replace(/([ap]m)/i, " $1")}`)
        const parseTime = (timeStr) => {
          if (!timeStr) {
            return false
          }
          // const [time, modifier] = timeStr.split(/(?<=\d)(?=[AP]M)/i) // Splits "1:31pm" -> ["1:31", "pm"]
          const [time, modifier] = timeStr?.split(" ")
          const [hours, minutes] = time.split(":").map(Number)

          if (timeStr !== "") {
            let hours24 =
              modifier.toLowerCase() === "pm" && hours !== 12
                ? hours + 12
                : hours
            if (modifier.toLowerCase() === "am" && hours === 12) hours24 = 0 // Midnight case

            return new Date(Date.UTC(2024, 0, 1, hours24, minutes))
          }
        }
        attendanceDetails = attendee?.map((item) => {
          const monthKey = getMonthKey(item?.attendanceDate)

          // Initialize if monthKey doesn't exist
          if (!monthlyAttendance[monthKey]) {
            monthlyAttendance[monthKey] = {
              present: 0,
              lateComing: 0,
              earlyGoing: 0,
              halfDay: 0,
              fullDay: 0,
              onsite: 0,
              absent: 0
            }
          }

          const inTimeDate = parseTime(item?.inTime)
          const outTimeDate = parseTime(item?.outTime)

          const morningLimit = parseTime("9:35 AM").getTime()
          const lateLimit = parseTime("10:00 AM").getTime()
          const minOutTime = parseTime("5:00 PM").getTime()
          const earlyLeaveLimit = parseTime("5:30 PM").getTime()
          const noonLimit = parseTime("1:30 PM").getTime()
          const halfDayLimit = parseTime("1:00 PM").getTime()
          let dayObject = {
            start: "",
            color: ""
          }

          if (isNaN(halfDayLimit)) {
            console.error("Error: halfDayLimit is NaN. Check time format!")
          }

          if (!item.inTime || !item.outTime) {
            monthlyAttendance[monthKey].present++
            monthlyAttendance[monthKey].halfDay++
            monthlyAttendance[monthKey].present -= Math.floor(
              monthlyAttendance[monthKey].halfDay / 2
            )

            const fdate = new Date(item?.attendanceDate) // Convert to Date object
            let date = fdate.toISOString().split("T")[0]

            dayObject.start = date

            dayObject.inTime = item?.inTime
            dayObject.outTime = item?.outTime
            dayObject.color = "green"
          } else if (
            inTimeDate.getTime() < noonLimit &&
            outTimeDate.getTime() < noonLimit
          ) {
            ////
            if (check(item?.attendanceDate)) {
              // Full Day: Increase present and decrease fullDay
              if (monthlyAttendance[monthKey]) {
                monthlyAttendance[monthKey].present++
                // monthlyAttendance[monthKey].fullDay--

                const fdate = new Date(item?.attendanceDate) // Convert to Date object
                let date = fdate.toISOString().split("T")[0]

                dayObject.start = date

                dayObject.inTime = item?.inTime
                dayObject.outTime = item?.outTime
                dayObject.color = "blue"
              }
            } else {
              monthlyAttendance[monthKey].fullDay++
              const fdate = new Date(item?.attendanceDate) // Convert to Date object
              let date = fdate.toISOString().split("T")[0]

              dayObject.start = date

              dayObject.inTime = item?.inTime
              dayObject.outTime = item?.outTime
              dayObject.color = "red"
            }
          } else if (
            inTimeDate.getTime() > noonLimit &&
            outTimeDate.getTime() > noonLimit
          ) {
            monthlyAttendance[monthKey].fullDay++

            const fdate = new Date(item.attendanceDate) // Convert to Date object
            let date = fdate.toISOString().split("T")[0]

            dayObject.start = date

            dayObject.inTime = item?.inTime
            dayObject.outTime = item?.outTime
            dayObject.color = "red"
          } else if (
            inTimeDate.getTime() <= lateLimit &&
            inTimeDate.getTime() > morningLimit &&
            outTimeDate.getTime() > earlyLeaveLimit
          ) {
            monthlyAttendance[monthKey].present++
            monthlyAttendance[monthKey].lateComing++
            const fdate = new Date(item?.attendanceDate) // Convert to Date object
            let date = fdate.toISOString().split("T")[0]

            dayObject.start = date

            dayObject.inTime = item?.inTime
            dayObject.outTime = item?.outTime
            dayObject.color = "green"
          } else if (
            inTimeDate.getTime() < morningLimit &&
            outTimeDate.getTime() > minOutTime &&
            outTimeDate.getTime() < earlyLeaveLimit
          ) {
            monthlyAttendance[monthKey].present++
            monthlyAttendance[monthKey].earlyGoing++
            const fdate = new Date(item.attendanceDate) // Convert to Date object
            let date = fdate.toISOString().split("T")[0]

            dayObject.start = date

            dayObject.inTime = item?.inTime
            dayObject.outTime = item?.outTime
            dayObject.color = "green"
          } else if (
            inTimeDate.getTime() > morningLimit &&
            inTimeDate.getTime() < lateLimit &&
            outTimeDate.getTime() > minOutTime &&
            outTimeDate.getTime() < earlyLeaveLimit
          ) {
            monthlyAttendance[monthKey].present++
            monthlyAttendance[monthKey].earlyGoing++
            monthlyAttendance[monthKey].lateComing++
            const fdate = new Date(item.attendanceDate) // Convert to Date object
            let date = fdate.toISOString().split("T")[0]

            dayObject.start = date

            dayObject.inTime = item?.inTime
            dayObject.outTime = item?.outTime
            dayObject.color = "green"
          } else if (
            inTimeDate.getTime() > minOutTime &&
            outTimeDate.getTime() > minOutTime &&
            outTimeDate.getTime() < earlyLeaveLimit
          ) {
            monthlyAttendance[monthKey].present++
            monthlyAttendance[monthKey].earlyGoing++
            monthlyAttendance[monthKey].halfDay++
            monthlyAttendance[monthKey].present -= Math.floor(
              monthlyAttendance[monthKey].halfDay / 2
            )

            const fdate = new Date(item.attendanceDate) // Convert to Date object
            let date = fdate.toISOString().split("T")[0]

            dayObject.start = date

            dayObject.inTime = item?.inTime
            dayObject.outTime = item?.outTime
            dayObject.color = "green"
          } else if (
            inTimeDate.getTime() > lateLimit &&
            inTimeDate.getTime() < noonLimit &&
            outTimeDate.getTime() > minOutTime &&
            outTimeDate.getTime() < earlyLeaveLimit
          ) {
            monthlyAttendance[monthKey].present++
            monthlyAttendance[monthKey].earlyGoing++
            monthlyAttendance[monthKey].halfDay++
            monthlyAttendance[monthKey].present -= Math.floor(
              monthlyAttendance[monthKey].halfDay / 2
            )

            const fdate = new Date(item.attendanceDate) // Convert to Date object
            let date = fdate.toISOString().split("T")[0]

            dayObject.start = date

            dayObject.inTime = item?.inTime
            dayObject.outTime = item?.outTime
            dayObject.color = "green"
          } else if (
            inTimeDate.getTime() > lateLimit &&
            inTimeDate.getTime() < noonLimit &&
            outTimeDate.getTime() > earlyLeaveLimit
          ) {
            monthlyAttendance[monthKey].present++
            monthlyAttendance[monthKey].halfDay++
            monthlyAttendance[monthKey].present -= Math.floor(
              monthlyAttendance[monthKey].halfDay / 2
            )

            const fdate = new Date(item.attendanceDate) // Convert to Date object
            let date = fdate.toISOString().split("T")[0]

            dayObject.start = date

            dayObject.inTime = item?.inTime
            dayObject.outTime = item?.outTime
            dayObject.color = "green"
          } else if (
            inTimeDate.getTime() < morningLimit &&
            noonLimit <= outTimeDate.getTime() &&
            outTimeDate.getTime() < minOutTime
          ) {
            monthlyAttendance[monthKey].present++
            monthlyAttendance[monthKey].halfDay++
            monthlyAttendance[monthKey].present -= Math.floor(
              monthlyAttendance[monthKey].halfDay / 2
            )

            const fdate = new Date(item.attendanceDate) // Convert to Date object
            let date = fdate.toISOString().split("T")[0]

            dayObject.start = date

            dayObject.inTime = item?.inTime
            dayObject.outTime = item?.outTime
            dayObject.color = "green"
          } else if (outTimeDate.getTime() < noonLimit) {
            monthlyAttendance[monthKey].fullDay++

            const fdate = new Date(item.attendanceDate) // Convert to Date object
            let date = fdate.toISOString().split("T")[0]

            dayObject.start = date

            dayObject.inTime = item?.inTime
            dayObject.outTime = item?.outTime
            dayObject.color = "red"
          } else if (
            inTimeDate.getTime() > noonLimit &&
            inTimeDate.getTime() > earlyLeaveLimit
          ) {
            monthlyAttendance[monthKey].fullDay++

            const fdate = new Date(item.attendanceDate) // Convert to Date object
            let date = fdate.toISOString().split("T")[0]

            dayObject.start = date

            dayObject.inTime = item?.inTime
            dayObject.outTime = item?.outTime
            dayObject.color = "red"
          } else if (
            inTimeDate.getTime() <= morningLimit &&
            outTimeDate.getTime() >= earlyLeaveLimit
          ) {
            monthlyAttendance[monthKey].present++
            const fdate = new Date(item.attendanceDate) // Convert to Date object
            let date = fdate.toISOString().split("T")[0]

            dayObject.start = date

            dayObject.inTime = item?.inTime
            dayObject.outTime = item?.outTime
            dayObject.color = "green"
          } else if (
            inTimeDate.getTime() >= morningLimit &&
            inTimeDate.getTime() < lateLimit &&
            outTimeDate.getTime() < noonLimit
          ) {
            monthlyAttendance[monthKey].present++
            monthlyAttendance[monthKey].lateComing++
            monthlyAttendance[monthKey].halfDay++
            monthlyAttendance[monthKey].present -= Math.floor(
              monthlyAttendance[monthKey].halfDay / 2
            )

            const fdate = new Date(item.attendanceDate) // Convert to Date object
            let date = fdate.toISOString().split("T")[0]

            dayObject.start = date

            dayObject.inTime = item?.inTime
            dayObject.outTime = item?.outTime
            dayObject.color = "green"
          }

          return dayObject
        })

        Object.keys(monthlyAttendance).forEach((monthKey) => {
          const monthData = monthlyAttendance[monthKey]

          // Calculate absent days as full days + half of half days
          const totalAbsent =
            monthData.fullDay + Math.floor(monthData.halfDay / 2)
          monthData.absent = totalAbsent
          const a = monthData?.lateComing
          const b = monthData?.earlyGoing

          // Check if lateComing is a multiple of 3
          if (a % 3 === 0 && a !== 0) {
            monthData.absent++ // Increase absent
            monthData.present-- // Decrease present
          }

          // Check if earlyGoing is a multiple of 3
          if (b % 3 === 0 && b !== 0) {
            monthData.absent++ // Increase absent
            monthData.present-- // Decrease present
          }
          // Update the absent field for the month
        })
        // Function to update monthlyAttendance based on formattedonsite

        setMonthData(monthlyAttendance)

        setEvents([
          ...formattedEvents,
          ...attendanceDetails,
          ...formattedonsite
        ])
      } else if (
        formattedEvents &&
        formattedEvents.length > 0 &&
        allOnsites &&
        allOnsites.length > 0
      ) {
        setEvents([...formattedEvents, ...formattedonsite])
      } else if (
        formattedEvents &&
        formattedEvents.length > 0 &&
        attendee &&
        attendee.length > 0
      ) {
        //new code
        let present = 0
        let earlyGoing = 0
        let lateComing = 0
        let halfDay = 0
        let fullDay = 0

        const parseTime = (timeStr) => {
          if (!timeStr) {
            return false
          }
          // const [time, modifier] = timeStr.split(/(?<=\d)(?=[AP]M)/i) // Splits "1:31pm" -> ["1:31", "pm"]
          const [time, modifier] = timeStr?.split(" ")
          const [hours, minutes] = time.split(":").map(Number)

          if (timeStr !== "") {
            let hours24 =
              modifier.toLowerCase() === "pm" && hours !== 12
                ? hours + 12
                : hours
            if (modifier.toLowerCase() === "am" && hours === 12) hours24 = 0 // Midnight case

            return new Date(Date.UTC(2024, 0, 1, hours24, minutes))
          }
        }
        attendanceDetails = attendee.map((item) => {
          const inTimeDate = parseTime(item?.inTime)
          const outTimeDate = parseTime(item?.outTime)

          const morningLimit = parseTime("9:35 AM").getTime()
          const lateLimit = parseTime("10:00 AM").getTime()
          const minOutTime = parseTime("5:00 PM").getTime()
          const earlyLeaveLimit = parseTime("5:30 PM").getTime()
          const noonLimit = parseTime("1:30 PM").getTime()
          const halfDayLimit = parseTime("1:00 PM").getTime()

          if (isNaN(halfDayLimit)) {
            console.error("Error: halfDayLimit is NaN. Check time format!")
          }

          if (!item.inTime || !item.outTime) {
            present++
            halfDay++
          } else if (inTimeDate && outTimeDate < noonLimit) {
            ////
            fullDay++
          } else if (inTimeDate && outTimeDate > noonLimit) {
            fullDay++
          } else if (
            inTimeDate.getTime() <= lateLimit &&
            inTimeDate.getTime() > morningLimit &&
            outTimeDate.getTime() > earlyLeaveLimit
          ) {
            present++
            lateComing++
          } else if (
            inTimeDate.getTime() < morningLimit &&
            outTimeDate.getTime() > minOutTime &&
            outTimeDate.getTime() < earlyLeaveLimit
          ) {
            present++
            earlyGoing++
          } else if (
            inTimeDate.getTime() > morningLimit &&
            inTimeDate.getTime() < lateLimit &&
            outTimeDate.getTime() > minOutTime &&
            outTimeDate.getTime() < earlyLeaveLimit
          ) {
            present++
            earlyGoing++
            lateComing++
          } else if (
            inTimeDate.getTime() > minOutTime &&
            outTimeDate.getTime() > minOutTime &&
            outTimeDate.getTime() < earlyLeaveLimit
          ) {
            present++
            earlyGoing++
            halfDay++
          } else if (
            inTimeDate.getTime() > lateLimit &&
            inTimeDate.getTime() < noonLimit &&
            outTimeDate.getTime() > minOutTime &&
            outTimeDate.getTime() < earlyLeaveLimit
          ) {
            present++
            earlyGoing++
            halfDay++
          } else if (
            inTimeDate.getTime() > lateLimit &&
            inTimeDate.getTime() < noonLimit &&
            outTimeDate.getTime() > earlyLeaveLimit
          ) {
            present++
            halfDay++
          } else if (
            inTimeDate.getTime() < morningLimit &&
            noonLimit <= outTimeDate.getTime() &&
            outTimeDate.getTime() < minOutTime
          ) {
            present++
            halfDay++
          } else if (outTimeDate.getTime() < noonLimit) {
            fullDay++
          } else if (
            inTimeDate.getTime() > noonLimit &&
            inTimeDate.getTime() > earlyLeaveLimit
          ) {
            fullDay++
          } else if (
            inTimeDate.getTime() <= morningLimit &&
            outTimeDate.getTime() >= earlyLeaveLimit
          ) {
            present++
          } else if (
            inTimeDate.getTime() >= morningLimit &&
            inTimeDate.getTime() < lateLimit &&
            outTimeDate.getTime() < noonLimit
          ) {
            present++
            lateComing++
            halfDay++
          }

          let dayObject = {
            start: "",
            color: "green"
          }
          const fdate = new Date(item?.attendanceDate) // Convert to Date object
          let date = fdate.toISOString().split("T")[0]

          let existingDate = formattedEvents?.find((event) => {
            return event.start === date
          })
          if (existingDate) {
            dayObject.start = item?.attendanceDate

            dayObject.inTime = item?.inTime
            dayObject.outTime = item?.outTime
            // dayObject.color = existingDate.color

            formattedEvents.filter((item) => item.start !== date)

            return dayObject
          } else {
            dayObject.start = date
            dayObject.inTime = item?.inTime
            dayObject.outTime = item?.outTime

            return dayObject
          }
        })

        setEvents([...formattedEvents, ...attendanceDetails])
      } else if (attendee && attendee.length > 0) {
        attendanceDetails = attendee.map((item) => {
          let dayObject = {
            start: "",
            reason: "No leave today",
            inTime: "On Leave",
            outTime: "On Leave",
            color: "green"
          }

          dayObject.start = item.attendanceDate
          dayObject.inTime = item?.inTime
          dayObject.outTime = item?.outTime

          return dayObject
        })
        setEvents(attendanceDetails)
      } else if (formattedEvents && formattedEvents.length > 0) {
        setEvents(formattedEvents)
      }
    }
  }, [allleaves, attendee, allOnsites])

  useEffect(() => {
    if (!showModal) {
      setIsOnsite(false)
    }
  }, [showModal])
  useEffect(() => {
    if (isOnsite && clickedDate) {
      // Find the event that matches the clicked date
      const existingEvent = events.filter((event) => {
        return event.start === clickedDate && event.onsiteData
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

  const formatonsite = (events) => {
    return events.map((event) => {
      const date = new Date(event.onsiteDate) // Convert to Date object
      const formattedDate = date.toISOString().split("T")[0] // Format as YYYY-MM-DD

      let dayObject = {
        start: "",
        onsiteType: "",
        halfDayPeriod: "",
        description: event?.description,
        onsiteData: event?.onsiteData,

        color: ""
      }

      if (formattedDate) {
        dayObject.start = formattedDate
      }
      if (event.departmentverified || event.adminverified) {
        dayObject.halfDayPeriod = event.halfDayPeriod
        dayObject.onsiteType = event.onsiteType
        dayObject.color = "blue"
      } else {
        dayObject.halfDayPeriod = event.halfDayPeriod
        dayObject.onsiteType = event.onsiteType
        dayObject.color = "orange"
      }
      return dayObject
    })
  }

  const formatEventData = (events) => {
    return events
      ?.filter((event) => !event.onsite)
      .map((event) => {
        const date = new Date(event.leaveDate) // Convert to Date object
        const formattedDate = date.toISOString().split("T")[0] // Format as YYYY-MM-DD
        let dayObject
        if (!event.onsite) {
          dayObject = {
            start: "",
            leaveType: "",
            halfDayPeriod: "",
            reason: event?.reason,

            color: ""
          }
        }
        if (formattedDate) {
          dayObject.start = formattedDate
        }
        if (
          (event.departmentverified && !event.onsite) ||
          (event.adminverified && !event.onsite)
        ) {
          dayObject.halfDayPeriod = event.halfDayPeriod
          dayObject.leaveType = event.leaveType
          dayObject.color = "red"
        } else {
          dayObject.halfDayPeriod = event.halfDayPeriod
          dayObject.leaveType = event.leaveType
          dayObject.color = "orange"
        }
        return dayObject
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
  const handledelete = async (data) => {
    try {
      const payload = {
        ...(data.leaveType
          ? {
              leaveType: data.leaveType,
              reason: data.reason,
              leaveDate: data.startDate
            }
          : {
              onsiteType: data.onsiteType,
              description: data.description,
              onsiteDate: data.startDate
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

        if (response.status === 200) {
          const data = response?.data?.data
          setAllleaves(data)
          setShowModal(false)
          setFormData({
            startDate: "",

            leaveType: "Full Day",
            onsiteType: "Full Day",

            halfDayPeriod: "",
            onsite: false,
            leaveCategory: "",
            reason: "",
            description: ""
          })
          toast.success("Leave deleted successfully")
        } else if (response.status === 404) {
          setAllleaves([])
          setSelectedTab("Leave")
          setFormData({
            startDate: "",

            leaveType: "Full Day",
            onsiteType: "Full Day",

            halfDayPeriod: "",
            onsite: false,
            leaveCategory: "",
            reason: "",
            description: ""
          })
          toast.success("Leave deleted successfully")
        }
      } else if (isOnsite) {
        type = "onsite"
        const response = await api.post(
          `/auth/deleteEvent?type=${type}&userid=${user._id}`,
          payload
        )
        const data = response.data.data
        if (response.status === 200) {
          setAllOnsite(data)
          setSelectedTab("Leave")
          setShowModal(false)
          setFormData({
            startDate: "",

            leaveType: "Full Day",
            onsiteType: "Full Day",

            halfDayPeriod: "",
            onsite: false,
            leaveCategory: "",
            reason: "",
            description: ""
          })
          toast.success("Onsite deleted successfully")
        } else if (response.status === 404) {
          setAllOnsite([])
          setFormData({
            startDate: "",

            leaveType: "Full Day",
            onsiteType: "Full Day",

            halfDayPeriod: "",
            onsite: false,
            leaveCategory: "",
            reason: "",
            description: ""
          })
          toast.success("Onsite deleted successfully")
        }
      }
    } catch (error) {
      setMessage(error.response.data.message)
      console.log(error.response.data.message)
    }
  }
  const handleDateClick = (arg) => {
    setclickedDate(arg.dateStr)
    const clickedDate = arg.dateStr
    setFormData((prev) => ({
      ...prev, // Keeps previous form data intact
      startDate: arg.dateStr // Updates only startDate
    }))

    const existingEvent = events?.filter((event) => {
      const eventDate = event.start // Normalize to YYYY-MM-DD

      return eventDate == clickedDate // Compare only the date part
    })

    if (existingEvent && existingEvent.length > 0) {
      // Parse the inTime and outTime (assuming they are in "hh:mm AM/PM" format)
      const parseTime = (timeString) => {
        if (!timeString) {
          // Return default or empty values if timeString is undefined or null
          return { hours: null, minutes: null, amPm: null }
        }
        const [time, amPm] = timeString.split(" ")
        const [hours, minutes] = time.split(":")
        return { hours, minutes, amPm }
      }
      const findRelevantEvent = (events) => {
        return events.find((event) => {
          // Example condition: prioritize events without inTime and outTime, or with specific keys like onsite
          return (
            !event.inTime &&
            !event.outTime &&
            !event.onsite &&
            !event.onsiteData
          )
        }) // Fallback to the first event if no specific match is found
      }

      // Find the relevant event
      const relevantEvent = findRelevantEvent(existingEvent)

      if (relevantEvent) {
        setFormData({
          ...formData,
          startDate: relevantEvent?.start,
          halfDayPeriod: relevantEvent?.halfDayPeriod || "",
          leaveType: relevantEvent?.leaveType || "Full Day",

          reason: relevantEvent?.reason || ""
        })
      }
      // Set the form data dynamically based on the relevant event
    } else {
      setFormData({
        ...formData,
        startDate: arg.dateStr,
        endDate: arg.dateStr,
        leaveType: "Full Day",
        reason: "",
        eventId: null
      })
      setselectedAttendance((prev) => ({
        ...prev, // Spread the existing state
        attendanceDate: arg.dateStr // Add or update the attendanceDate field
      }))
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

  const handleDatesSet = (info) => {
    const currentDate = new Date(info.view.currentStart) // Get the correct displayed month
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, "0") // Convert to "01-12" format

    setCurrentMonth(`${year}-${month}`)
  }

  const handleInputChange = debounce((e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value
    })
  }, 300)

  const handleChange = (e) => handleInputChange(e)

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

  const handleSubmit = async (tab) => {
    // e.preventDefault()
    try {
      if (tab === "Leave" || tab === "New Leave") {
        // Validation
        let newErrors = {}
        if (!formData.leaveType) newErrors.leaveType = "Shift is required"
        if (formData.leaveType === "Half Day" && !formData.halfDayPeriod)
          newErrors.halfDayPeriod = "Please select Half Day period"
        if (!formData.startDate) newErrors.startDate = "Leave Date is required"
        if (!formData.leaveCategory)
          newErrors.leaveCategory = "Leave Type is required"
        if (!formData.reason) newErrors.reason = "Reason is required"
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors)
          return
        }
        const formStartDate = new Date(formData.startDate)

        // Find a leave matching the date (ignoring time) and adminverified or departmentverified is true
        const existingLeave = allleaves?.find((leave) => {
          const leaveDate = new Date(leave.leaveDate) // Convert leave.leaveDate to Date object
          // Compare the year, month, and day only (ignoring time)
          const isSameDate =
            leaveDate.getFullYear() === formStartDate.getFullYear() &&
            leaveDate.getMonth() === formStartDate.getMonth() &&
            leaveDate.getDate() === formStartDate.getDate()

          // Check if adminverified or departmentverified is true
          return isSameDate && (leave.adminverified || leave.departmentverified)
        })

        if (existingLeave) {
          setMessage("This leave is already approved. Do not make any changes.")
        } else {
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
            toast.success("leave applied successfully")
            setSelectedTab("Leave")
            refreshHook()

            setShowModal(false)

            setFormData({
              startDate: "",

              leaveType: "Full Day",
              onsiteType: "Full Day",

              halfDayPeriod: "",
              onsite: false,
              leaveCategory: "",
              reason: "",
              description: ""
            })
            setErrors("")
          }
        }
      } else if (tab === "Onsite") {
        const formStartDate = new Date(formData.startDate)

        // Find a leave matching the date (ignoring time) and adminverified or departmentverified is true
        const existingOnsite = allOnsites?.find((onsite) => {
          const onsiteDate = new Date(onsite.onsiteDate) // Convert leave.leaveDate to Date object
          // Compare the year, month, and day only (ignoring time)
          const isSameDate =
            onsiteDate.getFullYear() === formStartDate.getFullYear() &&
            onsiteDate.getMonth() === formStartDate.getMonth() &&
            onsiteDate.getDate() === formStartDate.getDate()

          // Check if adminverified or departmentverified is true
          return (
            isSameDate && (onsite.adminverified || onsite.departmentverified)
          )
        })

        if (existingOnsite) {
          setMessage(
            "This onsite is already approved. Do not make any changes."
          )
        } else {
          // const response = await api.post(
          //   `http://localhost:9000/api/auth/onsiteRegister?selectedid=${user._id}&assignedto=${user.assignedto}`,
          //   { formData, tableRows }
          // )
          const response = await api.post(
            `https://www.crm.camet.in/api/auth/onsiteRegister?selectedid=${user._id}&assignedto=${user.assignedto}`,
            { formData, tableRows }
          )

          if (response.status === 200) {
            setSelectedTab("Leave")
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
            refreshHookOnsite()
          }
        }
      } else if (tab === "Attendance") {
        // const response = await fetch(
        //   `http://localhost:9000/api/auth/attendance?selectedid=${user._id}&attendanceId=${user.attendanceId}`,
        //   {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify(selectedAttendance),
        //     credentials: "include"
        //   }
        // )
        const response = await fetch(
          `https://www.crm.camet.in/api/auth/attendance?selectedid=${user._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(selectedAttendance),
            credentials: "include"
          }
        )

        await response.json()

        if (!response.ok) {
          throw new Error("Failed to apply for leave")
        } else {
          const response = await axios.get(
            `/auth/getallAttendance?userid=${user._id}`
          )
          const data = response.data

          if (response.status === 200) {
            setShowModal(false)
            // refreshHook()
            refreshattendee()
            setselectedAttendance({
              attendanceDate: "",
              inTime: { hours: "12", minutes: "00", amPm: "AM" },
              outTime: { hours: "12", minutes: "00", amPm: "AM" }
            })
          }
        }
      }
    } catch (error) {
      console.log("error:", error.message)
    }
  }

  ////time format
  const convertTo12HourTime = (time24) => {
    if (!time24) return null
    // Split the time string into hours, minutes, and seconds
    const [hours, minutes] = time24.split(":").map(Number)

    // Determine AM/PM
    const period = hours >= 12 ? "PM" : "AM"

    // Convert hours to 12-hour format
    const hours12 = hours % 12 || 12 // 0 should be converted to 12

    // Return formatted time
    return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`
  }

  const selectedTabContent = (value) => {
    let existingEvent
    switch (true) {
      case value === "Leave":
        existingEvent = events?.filter((event) => {
          const eventDate = new Date(event.start).toISOString().split("T")[0] // Normalize to YYYY-MM-DD
          return eventDate === clickedDate // Compare only the date part
        })
        if (existingEvent && existingEvent.length > 0) {
          const findRelevantEvent = (events) => {
            return events.find((event) => {
              // Example condition: prioritize events without inTime and outTime, or with specific keys like onsite
              return (
                !event.inTime &&
                !event.outTime &&
                !event.onsite &&
                !event.onsiteData
              )
            }) // Fallback to the first event if no specific match is found
          }

          // Find the relevant event
          const relevantEvent = findRelevantEvent(existingEvent)
          if (relevantEvent) {
            // Set the form data dynamically based on the relevant event
            setFormData({
              ...formData,
              startDate: relevantEvent?.start,
              halfDayPeriod: relevantEvent?.halfDayPeriod || "",
              leaveType: relevantEvent.leaveType || "",
              reason: relevantEvent.reason || "",
              onsite: false
            })
          }
        } else {
          setFormData({
            ...formData,
            startDate: clickedDate,

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
          const eventDate = event.start
          return eventDate === clickedDate // Compare only the date part
        })
        if (existingEvent && existingEvent.length > 0) {
          const findRelevantEvent = (events) => {
            return events.find(
              (event) =>
                // Example condition: prioritize events without inTime and outTime, or with specific keys like onsite
                !event.inTime &&
                !event.outTime &&
                event.onsiteData &&
                !event.leaveType
            )
          }
          // Fallback to the first event if no specific match is found

          // Find the relevant event

          const relevantEvent = findRelevantEvent(existingEvent)

          if (relevantEvent) {
            // Set the form data dynamically based on the relevant event
            setFormData({
              startDate: relevantEvent?.start,

              onsiteType: relevantEvent?.onsiteType || "",
              halfDayPeriod: relevantEvent?.halfDayPeriod || "",
              description: relevantEvent?.description || "",
              onsite: true
            })
          }
        } else {
          setFormData({
            ...formData,
            startDate: clickedDate,

            onsiteType: "Full Day",
            leaveType: "",
            description: "",
            onsite: true
          })
        }

        break

      case value === "Attendance":
        existingEvent = events?.filter((event) => {
          const eventDate = event.start // Normalize to YYYY-MM-DD
          return eventDate === clickedDate // Compare only the date part
        })
        if (existingEvent && existingEvent.length > 0) {
          const findRelevantEvent = (events) => {
            return events.find((event) => {
              // Example condition: prioritize events with both inTime and outTime
              return event.inTime && event.outTime
            })
          }

          // Find the relevant event
          const relevantEvent = findRelevantEvent(existingEvent)
          if (relevantEvent) {
            const parseTime = (timeString) => {
              if (!timeString) {
                // Return default or empty values if timeString is undefined or null
                return { hours: null, minutes: null, amPm: null }
              }
              const [time, amPm] = timeString.split(" ")
              const [hours, minutes] = time.split(":")
              return { hours, minutes, amPm }
            }
            // // Set selected attendance state
            setselectedAttendance((prev) => ({
              ...prev, // Spread the previous state to keep other values intact
              attendanceDate: relevantEvent?.start, // Set the attendance date
              inTime: {
                hours: parseTime(relevantEvent?.inTime)?.hours, // Update hours from parsed inTime
                minutes: parseTime(relevantEvent?.inTime)?.minutes, // Update minutes from parsed inTime
                amPm: parseTime(relevantEvent?.inTime)?.amPm // Update AM/PM from parsed inTime
              },
              outTime: {
                hours: parseTime(relevantEvent?.outTime)?.hours, // Update hours from parsed outTime
                minutes: parseTime(relevantEvent?.outTime)?.minutes, // Update minutes from parsed outTime
                amPm: parseTime(relevantEvent?.outTime)?.amPm // Update AM/PM from parsed outTime
              }
            }))
            setFormData((prev) => ({
              ...prev, // Spread the previous state
              onsite: false // Add or update the `attendanceDate` field
            }))
          } else {
            setselectedAttendance((prev) => ({
              ...prev, // Spread the previous state
              attendanceDate: clickedDate // Add or update the `attendanceDate` field
            }))
          }
        }

        // Handle the case where onsite is true but inTime or outTime is missing/falsy
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
          <div className="bg-white rounded-lg shadow-lg w-[380px] z-40 border border-gray-300 overflow-hidden">
            {/* Header */}
            {/* <div className="bg-gray-100 px-6 py-2 text-lg font-bold text-gray-700 border-b">
              {user?.name?.toUpperCase()}
            </div> */}

            {/* Leave Balance Section */}
            <div className="p-2">
              <h2 className="text-gray-600 font-semibold text-lg ">
                Leave Balance
              </h2>
              <p className="text-2xl font-bold text-gray-800">
                {BalanceprivilegeleaveCount + BalancedcasualleaveCount}leaves
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
            <div className="p-2">
              <h2 className="text-gray-600 font-semibold text-sm mb-2">
                Upcoming Leaves
              </h2>
              <div className="space-y-3 max-h-36 overflow-y-auto">
                {currentmonthleaveData?.length > 0 ? (
                  currentmonthleaveData.map((leave, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 border border-gray-300 p-3 rounded-lg shadow-sm hover:cursor-pointer"
                    >
                      {/* Date */}
                      <div className="text-gray-700 font-semibold w-24 text-sm">
                        {leave.leaveDate.toString().split("T")[0]}
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
                        className="text-gray-500 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-125"
                        onClick={() => {
                          setSelectedTab("New Leave")
                          setFormData({
                            startDate: leave.leaveDate.toString().split("T")[0],
                            leaveType: leave.leaveType,
                            halfDayPeriod:
                              leave.leaveType === "Half Day"
                                ? halfDayPeriod
                                : undefined,
                            leaveCategory: leave.leaveCategory,
                            reason: leave.reason
                          })
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm italic text-center">
                    No upcoming leaves
                  </p>
                )}
              </div>
            </div>
          </div>
        )
      case "Onsite":
        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-3">
              <div>
                <label className="block mb-2">Onsite Date</label>
                <input
                  type="date"
                  name="startDate"
                  defaultValue={formData.startDate}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label className="block mb-2">Onsite Type</label>
                <select
                  name="onsiteType"
                  defaultValue={formData.onsiteType}
                  onChange={(e) => {
                    const { value } = e.target
                    setFormData((prev) => ({
                      ...prev,
                      onsiteType: value,
                      halfDayPeriod: value === "Half Day" ? "Morning" : "" // Default to "Morning" for Half Day
                    }))
                  }}
                  className="border p-2 rounded w-full"
                >
                  <option value="Full Day">Full Day</option>
                  <option value="Half Day">Half Day</option>
                </select>
              </div>
              {formData.onsiteType === "Half Day" && (
                <div className="">
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
                    className="border p-2 rounded w-full appearance-none"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                  </select>
                </div>
              )}
            </div>
            <div className="mb-4">
              <div className="overflow-x-auto overflow-y-auto ">
                <table className=" border border-gray-200 text-center w-full">
                  <thead>
                    <tr>
                      <th className="border px-8 py-1 ">Site Name</th>
                      <th className="border px-8 py-1">Place</th>
                      <th className="border px-8 py-1">Start</th>
                      <th className="border px-8 py-1">End</th>
                      <th className="border px-10 py-1 ">KM</th>
                      <th className="border px-10 py-1">TA</th>
                      <th className="border px-8 py-1">Food </th>
                      <th className="border px-8 py-1">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows?.map((row, index) => (
                      <tr key={index}>
                        <td className="border p-1.5 w-60">
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
                        <td className="border p-1.5 w-60">
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
                        <td className="border p-1.5">
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
                        <td className="border p-1.5 W-20">
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
                        <td className="border p-1.5">
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
                        <td className="border p-1.5">
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
                        <td className="border p-1.5 w-28">
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
            <div className="mb-4">
              <label className="block mb-2">Description</label>
              <textarea
                name="description"
                defaultValue={formData?.description}
                onChange={handleChange}
                rows="4"
                className="border p-2 rounded w-full"
              ></textarea>
            </div>
            <div className="text-center text-red-700 ">
              <p>{message}</p>
            </div>
          </div>
        )
      case "New Leave":
        return (
          <div className="bg-white rounded-lg shadow-lg w-[380px] z-40 border border-gray-100 px-5">
            <h2 className="text-xl font-semibold text-center">
              Leave Application
            </h2>
            {/* <p className="mt-2 text-center text-gray-600">
              Selected Date: {clickedDate}
            </p> */}
            <div className="mt-4">
              {/* Full Day / Half Day Selection */}
              <div className="flex gap-4">
                <label>
                  <input
                    type="radio"
                    value="Full Day"
                    checked={formData.leaveType === "Full Day"}
                    // onChange={(e) => setLeaveOption(e.target.value)}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        leaveType: e.target.value,
                        halfDayPeriod: "" // Replace newDate with the actual value you want to set
                      }))
                    }}
                  />
                  Full Day
                </label>
                <label>
                  <input
                    type="radio"
                    value="Half Day"
                    checked={formData.leaveType === "Half Day"}
                    // onChange={(e) => setLeaveOption(e.target.value)}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        leaveType: e.target.value // Replace newDate with the actual value you want to set
                      }))
                    }}
                  />
                  Half Day
                </label>
                {errors.leaveType && (
                  <p className="text-red-500">{errors.leaveType}</p>
                )}
                {formData.leaveType === "Half Day" && (
                  <>
                    <select
                      className="border p-2 rounded w-auto"
                      value={formData?.halfDayPeriod || "Morning"}
                      // onChange={(e) => setLeaveOption(e.target.value)}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          halfDayPeriod: e.target.value // Replace newDate with the actual value you want to set
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
              {/* Leave Dates */}
              {formData.leaveType === "Full Day" ? (
                <>
                  <div className="mt-1 flex flex-col">
                    <label className="text-sm font-semibold">Leave Date</label>
                    <input
                      name="leavestartdate"
                      type="date"
                      value={formData?.startDate}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          leaveDate: e.target.value // Replace newDate with the actual value you want to set
                        }))
                      }}
                      className="border p-2 rounded"
                    />

                    {/* <label className="text-sm font-semibold mt-2">
                    Leave End Date
                  </label>
                  <input
                    name="leaveenddate"
                    type="date"
                    value={formData?.endDate}
                    // onChange={(e) => setLeaveEnd(e.target.value)}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        endDate: e.target.value // Replace newDate with the actual value you want to set
                      }))
                    }}
                    className="border p-2 rounded"
                  /> */}
                  </div>
                  {errors.startDate && (
                    <p className="text-red-500">{errors.startDate}</p>
                  )}
                </>
              ) : (
                <>
                  <div className="mt-1">
                    <label className="text-sm font-semibold">Leave Date</label>
                    <input
                      type="date"
                      value={formData?.startDate}
                      // onChange={(e) => setLeaveStart(e.target.value)}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          leaveDate: e.target.value // Replace newDate with the actual value you want to set
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
              {/* Leave Type Dropdown */}
              <div className="mt-1">
                <label className="text-sm font-semibold">Leave Type</label>
                <select
                  className="border p-2 rounded w-full"
                  value={formData?.leaveCategory || ""}
                  // onChange={(e) => setLeaveType(e.target.value)}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      leaveCategory: e.target.value // Replace newDate with the actual value you want to set
                    }))
                  }}
                >
                  <option value="">Select Leave Type</option>
                  {/* If the selected leave date is in the past, only show "Other Leave" */}
                  {pastDate ? (
                    <option value="other Leave">Other Leave</option>
                  ) : (
                    <>
                      {BalancedcasualleaveCount > 0 && (
                        <option value="casual Leave">Casual Leave</option>
                      )}
                      {BalanceprivilegeleaveCount > 0 && (
                        <option value="privileage Leave">
                          Privilege Leave
                        </option>
                      )}
                      {BalancecompensatoryleaveCount > 0 && (
                        <option value="compensatory Leave">
                          Compensatory Leave
                        </option>
                      )}
                      {BalancesickleaveCount > 0 && (
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
              {/* Description */}
              <div className="mt-1">
                <label className="text-sm font-semibold">Reason</label>
                <textarea
                  className="border p-2 rounded w-full"
                  rows="3"
                  placeholder="Enter reason"
                  value={formData?.reason || ""}
                  // onChange={(e) => setLeaveDescription(e.target.value)}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      reason: e.target.value // Replace newDate with the actual value you want to set
                    }))
                  }}
                ></textarea>
              </div>
              {errors.reason && <p className="text-red-500">{errors.reason}</p>}
              <div className="text-center text-red-700">
                <p>{message}</p>
              </div>
                        
            </div>
          </div>
        )
      default:
        return <p>Select a tab to view the content.</p>
    }
  }

  return (
    <div className=" p-4">
      <div className="w-full">
        <div className="calendar-header flex flex-wrap justify-center gap-4">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 bg-green-500 "></div>
            <span className="text-sm md:text-base">Present</span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 bg-red-500 "></div>
            <span className="text-sm md:text-base">Leave</span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 bg-orange-500 "></div>
            <span className="text-sm md:text-base">Pending</span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 bg-pink-300 "></div>
            <span className="text-sm md:text-base">Not selected</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 bg-blue-500 "></div>
            <span className="text-sm md:text-base">Onsite</span>
          </div>
        </div>
        {/* <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 justify-items-center">
          <div className="mr-5">
            <span>Present-{currentMonthData?.present}</span>
          </div>
          <div className="mr-5">
            <span>Absent-{currentMonthData?.absent}</span>
          </div>
          <div className="mr-5">
            <span>Latecoming-{currentMonthData?.lateComing}</span>
          </div>
          <div className="mr-5">
            <span>Earlygoing-{currentMonthData?.earlyGoing}</span>
          </div>
          <div className="mr-5">
            <span>Onsite-{currentMonthData?.onsite}</span>
          </div>
          <div>
            <span>Not Marked-{currentMonthData?.lateComing}</span>
          </div>
        </div> */}

        <FullCalendar
          key={events?.length}
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          dateClick={handleDateClick}
          headerToolbar={{
            left: "title", // Align these to the left
            center: "", // Month title in the center
            right: "prev,next today" // Leave right empty to avoid overcrowding
          }}
          selectable={true}
          height="auto"
          datesSet={handleDatesSet}
          // dayCellContent={(info) => handleEventRendering(info)} // Custom rendering logic
          dayCellDidMount={(info) => {
            // Normalize the date to "YYYY-MM-DD" format (UTC)
            const cellDate = info.date.toLocaleDateString("en-CA") // Simplified to handle UTC date

            const dayOfWeek = info.date.getDay() // Get the day of the week (0 = Sunday)

            // Find the matching event by comparing only the date part (YYYY-MM-DD)
            const matchingEvent = events?.filter((event) => {
              const eventDate = new Date(event.start).toLocaleDateString(
                "en-CA"
              )
              // Get event start date in "YYYY-MM-DD" format
              return eventDate === cellDate // Compare the date part (YYYY-MM-DD)
            })

            const dayCellBottom = info.el.querySelector(
              ".fc-daygrid-day-bottom"
            )

            if (matchingEvent && matchingEvent.length > 0) {
              matchingEvent.forEach((event) => {
                const {
                  color: squareColor,
                  reason = "No reason provided",
                  description = "No description provided",
                  inTime,
                  outTime
                } = event

                // Create the time container for the first event only
                if (
                  inTime &&
                  outTime &&
                  !info.el.querySelector(".time-container")
                ) {
                  const timeContainer = document.createElement("div")
                  timeContainer.className = "time-container"
                  timeContainer.innerHTML = `<div class="time-display">In: ${inTime}<br>Out: ${outTime}</div>`
                  info.el
                    .querySelector(".fc-daygrid-day-top")
                    .appendChild(timeContainer)
                }

                // Create and style the square marker
                const squareMarker = document.createElement("div")
                squareMarker.className = "square-marker"
                squareMarker.style.backgroundColor = squareColor

                // Append square marker to the day cell bottom
                dayCellBottom?.appendChild(squareMarker)

                // Initialize tippy tooltip on the square marker
                tippy(squareMarker, {
                  content: reason || description,
                  theme: "custom-tooltip",
                  placement: "top"
                })
              })
            } else if (dayOfWeek !== 0) {
              // Only add marker for days that are not Sunday (day 0)
              const squareColor = "HotPink" // Default marker color for days without events

              // Create the no-event marker and add it to the day cell bottom
              const noEventMarker = document.createElement("div")
              noEventMarker.className = "no-event-marker"
              noEventMarker.style.backgroundColor = squareColor

              dayCellBottom.appendChild(noEventMarker)
            }
          }}
        />
      </div>
      <style>
        {`
        .fc-daygrid-day-top {
  position: relative;
}
.fc-daygrid-day-bottom {
  position: relative; /* Ensure the container is the positioning reference */
   display: flex; /* Flexbox for marker alignment */
  justify-content: flex-end; /* Align markers to the right */
  align-items: flex-end; /* Align markers to the bottom */
  flex-wrap: wrap; /* Allow wrapping for multiple markers on smaller screens */
  gap: 4px; /* Space between markers */
  padding: 4px; /* Padding for better spacing inside the cell */
}
// .fc-daygrid-day-bottom {
//   position: relative !important;
// }

.fc-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1px;
}

.fc-toolbar-chunk {
  flex: 1;
  text-align: center;
}

@media (max-width: 600px) {
  .fc-toolbar {
    flex-direction: column;
  }
  .fc-toolbar-chunk {
    text-align: center;
    margin: 1px 0;
  }
}
  .square-marker {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  cursor: pointer;
  position: absolute; /* Position marker absolutely */
  top:28px; /* Distance from the bottom edge */

 // background-color: #FFA500; /* Default marker color */
  z-index: 1; /* Ensure it is above other content */
}
  .square-marker + .square-marker {
  right: calc(4px + 18px); /* Adjust spacing for subsequent markers */
}

// .square-marker {
//   width: 10px;
//   height: 10px;
//   margin: 2px auto;
//   border-radius: 2px;
//   cursor: pointer;
//   position: absolute;
//   top: 30px;
//   left: 80%;
//   transform: translateX(-50%);
//   background-color: #FFA500; /* Default marker color */
// }

// @media (max-width: 768px) {
//   .square-marker {
//     top: 30px;
//     left: 70%;
//   }
// }
@media (max-width: 768px) {
  .square-marker {
    width: 10px; /* Slightly smaller markers for mobile screens */
    height: 10px;
    top:30px;
  }
  .fc-daygrid-day-bottom {
    gap: 3px; /* Adjust gap for smaller markers */
    padding: 3px;
  }
}

.time-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 90%;
  margin-top: 3px;
}

.time-display {
  font-size: 0.75rem;
  margin-left: 1px;
  text-align: left;
}

.no-event-marker {
  width: 10px;
  height: 10px;
  margin: 2px auto;
  border-radius: 2px;
  cursor: pointer;
  position: absolute;
  top: 30px;
  left: 80%;
  transform: translateX(-50%);
}

@media (max-width: 768px) {
  .time-display {
    display: none;
  }
}

.tippy-box[data-theme~="custom-tooltip"] {
  background-color: #007BFF;
  color: #fff;
  border-radius: 4px;
}

.tippy-box[data-theme~="custom-tooltip"] .tippy-arrow {
  color: #007BFF;
}

  `}
      </style>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-3 rounded-lg shadow-lg  w-full sm:w-auto mx-4 overflow-y-auto">
            <div>
              {/* Tab Navigation */}
              <div className="flex justify-center space-x-4">
                {tabs?.map((tab) => (
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
                        ? "text-blue-500 font-semibold underline"
                        : "text-black"
                    }`}
                  >
                    {tab}
                  </span>
                ))}
              </div>

              <div className="mt-2">
                <div>{renderContent()}</div>

                {selectedTab === "Leave" ? (
                  <div className=" flex justify-center mt-3 mb-3">
                    <button
                      className="bg-blue-800 rounded-lg px-4 py-1 text-white hover:bg-blue-700"
                      onClick={() => setSelectedTab("New Leave")}
                    >
                      Apply New Leave
                    </button>
                    <button
                      className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 ml-3"
                      onClick={() => {
                        setShowModal(false)
                        setFormData({
                          description: "",
                          onsite: false,
                          halfDayPeriod: "",
                          leaveType: "Full Day"
                        })
                        setselectedAttendance({
                          attendanceDate: "",
                          inTime: { hours: "12", minutes: "00", amPm: "AM" },
                          outTime: { hours: "12", minutes: "00", amPm: "AM" }
                        })
                        setAttendance(false)

                        setSelectedTab("Leave")
                        setTableRows([])
                        setMessage("")
                        setErrors("")
                      }}
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <div className="col-span-2 gap-4 flex justify-center mt-4 mb-3">
                    <button
                      className="bg-gradient-to-b from-blue-400 to-blue-500 px-3 py-1 hover:from-blue-400 hover:to-blue-600 text-white rounded"
                      onClick={() => handleSubmit(selectedTab)}
                    >
                      Submit
                    </button>
                    <button
                      className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                      onClick={() => {
                        setShowModal(false)
                        setFormData({
                          description: "",
                          onsite: false,
                          halfDayPeriod: "",
                          leaveType: "Full Day"
                        })

                        setSelectedTab("Leave")
                        setTableRows([])
                        setMessage("")
                        setErrors("")
                      }}
                    >
                      Close
                    </button>
                    <button
                      className="bg-red-600 px-4 py-2 rounded-md text-white font-semibold shadow-lg hover:bg-red-700 active:shadow-md active:translate-y-[2px] transition-all duration-200"
                      onClick={() => handledelete(formData)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LeaveApplication
