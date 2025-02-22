import React, { useEffect, useState } from "react"
import axios from "axios"
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
  const [noEventCount, setNoEventCount] = useState(0)
  const [selectedMonth, setSelectedMonth] = useState("")
  const [MonthData, setMonthData] = useState({})
  const [currentMonthData, setcurrentMonthData] = useState({})
  // const [currentMonth, setCurrentMonth] = useState("")
  const [remainingDays, setRemainingDays] = useState(0)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [presentMonth, setpresentMonth] = useState(new Date().getMonth())
  const [message, setMessage] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [t, setIn] = useState(null)
  const [selectedTab, setSelectedTab] = useState("Leave")
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    leaveType: "Full Day",
    onsiteType: "Full Day",
    attendanceType: "",
    halfDayPeriod: "",
    onsite: false,
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
  const [totalAttendance, setTotalAttendance] = useState(null)
  const [totalLate, setTotalLate] = useState(null)
  const [attendance, setAttendance] = useState(false)
  const [widthState, setWidthState] = useState("w-5/6")
  const [tableRows, setTableRows] = useState([])
  const [clickedDate, setclickedDate] = useState(null)
  const userData = localStorage.getItem("user")
  const tabs = ["Leave", "Onsite", "Attendance"]
  const user = JSON.parse(userData)
  const { data: leaves, refreshHook } = UseFetch(
    user && `/auth/getallLeave?userid=${user._id}`
  )
  const { data: allonsite, refreshHook: refreshHookOnsite } = UseFetch(
    user && `/auth/getallOnsite?userid=${user._id}`
  )

  useEffect(() => {
    if (MonthData && currentMonth) {
      setcurrentMonthData(MonthData[currentMonth])
    }
  }, [currentMonth, MonthData])

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
      (leaves && leaves.length > 0) ||
      (attendee && attendee.length > 0) ||
      (allonsite && allonsite.length > 0)
    ) {
      let formattedonsite
      const formattedEvents = formatEventData(leaves)
      if (allonsite && allonsite.length > 0) {
        formattedonsite = formatonsite(allonsite)
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
          console.log(timeStr)
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

          console.log(item?.inTime, item?.attendanceDate)
          const inTimeDate = parseTime(item?.inTime)
          console.log(inTimeDate)
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
            // monthlyAttendance[monthKey].absent += Math.floor(
            //   monthlyAttendance[monthKey].halfDay / 2
            // )
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

            // monthlyAttendance[monthKey].absent +=
            //   monthlyAttendance[monthKey].fullDay
          } else if (
            inTimeDate.getTime() > noonLimit &&
            outTimeDate.getTime() > noonLimit
          ) {
            monthlyAttendance[monthKey].fullDay++
            // monthlyAttendance[monthKey].absent +=
            //   monthlyAttendance[monthKey].fullDay

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
            // monthlyAttendance[monthKey].absent += Math.floor(
            //   monthlyAttendance[monthKey].halfDay / 2
            // )
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
            // monthlyAttendance[monthKey].absent += Math.floor(
            //   monthlyAttendance[monthKey].halfDay / 2
            // )
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
            // monthlyAttendance[monthKey].absent += Math.floor(
            //   monthlyAttendance[monthKey].halfDay / 2
            // )
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
            // monthlyAttendance[monthKey].absent += Math.floor(
            //   monthlyAttendance[monthKey].halfDay / 2
            // )
            const fdate = new Date(item.attendanceDate) // Convert to Date object
            let date = fdate.toISOString().split("T")[0]

            dayObject.start = date

            dayObject.inTime = item?.inTime
            dayObject.outTime = item?.outTime
            dayObject.color = "green"
          } else if (outTimeDate.getTime() < noonLimit) {
            monthlyAttendance[monthKey].fullDay++
            // monthlyAttendance[monthKey].absent += Math.floor(
            //   monthlyAttendance[monthKey].fullDay
            // )
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
            // monthlyAttendance[monthKey].absent += Math.floor(
            //   monthlyAttendance[monthKey].fullDay
            // )
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
            // monthlyAttendance[monthKey].absent += Math.floor(
            //   monthlyAttendance[monthKey].halfDay / 2
            // )
            const fdate = new Date(item.attendanceDate) // Convert to Date object
            let date = fdate.toISOString().split("T")[0]

            dayObject.start = date

            dayObject.inTime = item?.inTime
            dayObject.outTime = item?.outTime
            dayObject.color = "green"
          }

          return dayObject

          // let existingDate = formattedEvents?.find((event) => {
          //   console.log(event.start)
          //   return event.start === date
          // })
          // if (existingDate) {
          //   dayObject.start = item?.attendanceDate

          //   dayObject.inTime = item?.inTime
          //   dayObject.outTime = item?.outTime
          //   dayObject.color = "green"

          //   console.log(existingDate)
          //   // console.log(formattedEvents)
          //   // formattedEvents.filter((item) => item.start !== date)

          //   return dayObject
          // } else {
          //   dayObject.start = date
          //   dayObject.inTime = item?.inTime
          //   dayObject.outTime = item?.outTime

          //   return dayObject
          // }
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
        allonsite &&
        allonsite.length > 0
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

        // Function to convert time string to Date object
        // const parseTime = (timeStr) => new Date(`2024-01-01 ${timeStr}`)
        // const parseTime = (timeStr) =>
        //   new Date(`2024-01-01 ${timeStr.replace(/([ap]m)/i, " $1")}`)
        const parseTime = (timeStr) => {
          if(!timeStr){
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
  }, [leaves, attendee, allonsite])

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
  // const handleEventRendering = (info) => {
  //   const eventDate = new Date(info.date)
  //   const eventMonth = eventDate.getMonth()
  //   const dayOfWeek = eventDate.getDay() // 0 = Sunday
  //   console.log(eventMonth)
  //   if (eventMonth !== currentMonth) {
  //     console.log("h")
  //     setpresentMonth(eventMonth)
  //     setNoEventCount(0) // Reset count for new month
  //   }
  //   console.log("hh")
  //   // Check if the day has any events
  //   const matchingEvents = events.filter(
  //     (event) =>
  //       new Date(event.start).toDateString() === eventDate.toDateString()
  //   )

  //   if (matchingEvents.length === 0 && dayOfWeek !== 0) {
  //     console.log("hhh")
  //     setNoEventCount((prevCount) => prevCount + 1) // Increment count only if no events
  //   }
  // }

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

        // if (
        //   (event.departmentverified && !event.onsite) ||
        //   (event.adminverified && !event.onsite)
        // ) {
        //   dayObject.halfDayPeriod = event.halfDayPeriod
        //   dayObject.leaveType = event.leaveType
        //   dayObject.color = "red"
        // } else if (event.onsiteData && event.onsite) {
        //   dayObject.onsiteData = event.onsiteData
        //   dayObject.halfDayPeriod = event.halfDayPeriod
        //   dayObject.leaveType = event.leaveType
        //   dayObject.color = "blue"
        // } else if (
        //   (!event.departmentverified || !event.adminverified) &&
        //   event.onsite
        // ) {
        //   dayObject.onsiteData = event.onsiteData
        //   dayObject.halfDayPeriod = event.halfDayPeriod
        //   dayObject.leaveType = event.leaveType
        //   dayObject.color = "orange"
        // } else if (event.inTime) {
        //   dayObject.inTime = event.inTime
        // } else {
        //   dayObject.halfDayPeriod = event.halfDayPeriod
        //   dayObject.leaveType = event.leaveType
        //   dayObject.color = "orange"
        // }
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
  const handleDateClick = (arg) => {
    setclickedDate(arg.dateStr)
    const clickedDate = arg.dateStr

    // Check if there's already an event on this date
    // const existingEvent = events?.filter((event) => event.start === clickedDate)
    const existingEvent = events?.filter((event) => {
      const eventDate = event.start // Normalize to YYYY-MM-DD

      return eventDate == clickedDate // Compare only the date part
    })

    // setexistingEvent(existingEvent)

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
        return (
          events.find((event) => {
            // Example condition: prioritize events without inTime and outTime, or with specific keys like onsite
            return (
              !event.inTime &&
              !event.outTime &&
              !event.onsite &&
              !event.onsiteData
            )
          }) || events[0]
        ) // Fallback to the first event if no specific match is found
      }

      // Find the relevant event
      const relevantEvent = findRelevantEvent(existingEvent)

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

      // Set the form data dynamically based on the relevant event
      setFormData({
        ...formData,
        startDate: relevantEvent?.start,
        halfDayPeriod: relevantEvent?.halfDayPeriod || "",
        leaveType: relevantEvent?.leaveType || "",
        onsiteType: relevantEvent?.onsiteType || "",

        reason: relevantEvent?.reason || "",
        description: relevantEvent?.description || ""
      })

      if (existingEvent?.onsite) {
        setIsOnsite(true)
      }
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
  const handleDatesSet = (info) => {
    const currentDate = new Date(info.view.currentStart) // Get the correct displayed month
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, "0") // Convert to "01-12" format

    setCurrentMonth(`${year}-${month}`)
    // const newMonth = info.view.currentStart.getMonth()
    // if (newMonth !== presentMonth) {
    //   setpresentMonth(newMonth)
    //   setNoEventCount(0)
    // }

    // const month = String(date.getMonth() + 1).padStart(2, "0") // Convert to 2-digit format (01-12)
    // console.log(month)

    // setCurrentMonth(`${year}-${month}`)
    // Get the current start date of the view (first day of the current month)
    // const monthName = info.view.currentStart.toLocaleString("default", {
    //   month: "long"
    // })
    // const monthMapping = {
    //   January: 1,
    //   February: 2,
    //   March: 3,
    //   April: 4,
    //   May: 5,
    //   June: 6,
    //   July: 7,
    //   August: 8,
    //   September: 9,
    //   October: 10,
    //   November: 11,
    //   December: 12
    // }
    // const monthNumber = monthMapping[monthName]

    // const filteredData = attendee?.filter((item) => {
    //   const attendanceMonth = new Date(item.attendanceDate).getMonth() + 1 // Get month from Date (1 = Jan, 12 = Dec)
    //   return attendanceMonth === monthNumber
    // })

    // setTotalAttendance(filteredData)
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
    try {
      if (tab === "Leave") {
        const formStartDate = new Date(formData.startDate)

        // Find a leave matching the date (ignoring time) and adminverified or departmentverified is true
        const existingLeave = leaves?.find((leave) => {
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
            refreshHook()

            setShowModal(false)
            setFormData((prev) => ({
              ...prev,
              reason: ""
            }))
          }
        }
      } else if (tab === "Onsite") {
        // const response = await api.post(
        //   `http://localhost:9000/api/auth/onsiteLeave?selectedid=${user._id}&assignedto=${user.assignedto}`,
        //   { formData, tableRows }
        // )
        const response = await api.post(
          `https://www.crm.camet.in/api/auth/onsiteLeave?selectedid=${user._id}&assignedto=${user.assignedto}`,
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
          // refreshHook()
          refreshHookOnsite()
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
        }

        // Handle the case where the fields are missing or falsy
        break

      case value === "Onsite":
        existingEvent = events?.filter((event) => {
          const eventDate = new Date(event.start).toISOString().split("T")[0] // Normalize to YYYY-MM-DD
          return eventDate === clickedDate // Compare only the date part
        })
        if (existingEvent && existingEvent.length > 0) {
          const findRelevantEvent = (events) => {
            return events.find((event) => {
              // Example condition: prioritize events without inTime and outTime, or with specific keys like onsite
              return !event.inTime && !event.outTime && event.onsiteData
            }) // Fallback to the first event if no specific match is found
          }
          // Find the relevant event
          const relevantEvent = findRelevantEvent(existingEvent)
          if (relevantEvent) {
            // Set the form data dynamically based on the relevant event
            setFormData({
              ...formData,
              startDate: relevantEvent?.start,

              onsiteType: relevantEvent?.onsiteType || "",
              halfDayPeriod: relevantEvent?.halfDayPeriod || "",
              description: relevantEvent?.description || "",
              onsite: true
            })
          }
        }

        break

      case value === "Attendance":
        existingEvent = events?.filter((event) => {
          const eventDate = new Date(event.start).toISOString().split("T")[0] // Normalize to YYYY-MM-DD
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
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block mb-2">Leave Date</label>
                <input
                  type="date"
                  name="startDate"
                  defaultValue={formData.startDate}
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
            </div>
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
          </div>
        )
      case "Onsite":
        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
              <div className="overflow-x-auto ">
                <table className=" border border-gray-200 text-center w-full">
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
                        <td className="border p-2">
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
                        <td className="border p-2 W-20">
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
                        <td className="border p-2">
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
                        <td className="border p-2">
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
                        <td className="border p-2">
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
                defaultValue={formData.description}
                onChange={handleChange}
                rows="4"
                className="border p-2 rounded w-full"
              ></textarea>
            </div>
          </div>
        )
      case "Attendance":
        return (
          <div className="">
            <div className="attendance-content mt-2 justify-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block mb-2">Attendance Date</label>
                  <input
                    type="date"
                    name="startDate"
                    defaultValue={formData.startDate}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div>
                  <label className="block mb-2">Attendance Type</label>
                  <select
                    name="attendanceType"
                    defaultValue={formData.attendanceType}
                    onChange={(e) => {
                      const { value } = e.target
                      setFormData((prev) => ({
                        ...prev,
                        attendanceType: value,
                        halfDayPeriod: value === "Half Day" ? "Morning" : "" // Default to "Morning" for Half Day
                      }))
                    }}
                    className="border p-2 rounded w-full"
                  >
                    <option value="Full Day">Full Day</option>
                    <option value="Half Day">Half Day</option>
                  </select>
                </div>

                {formData.attendanceType === "Half Day" && (
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
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid ">
                  <label htmlFor="startTime" className="font-bold mb-1">
                    In Time
                  </label>
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

                <div className="grid ">
                  <label
                    htmlFor="endTime"
                    className="font-bold mb-1 sm:justify-self-end"
                  >
                    Out Time
                  </label>
                  <div className=" flex sm:justify-end gap-2">
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
                <div className="text-center text-red-700">
                  <p>{message}</p>
                </div>

                <div className="col-span-2 gap-4 flex justify-center mt-4">
                  <button
                    className="bg-gradient-to-b from-blue-400 to-blue-500 px-3 py-1 hover:from-blue-400 hover:to-blue-600 text-white rounded"
                    onClick={() => handleSubmit(selectedTab)}
                  >
                    Submit
                  </button>
                  <button
                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                    onClick={() => {
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
                      setShowModal(false)
                      setSelectedTab("Leave")
                      setTableRows([])
                      setMessage("")
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LeaveApplication
