import models from "../model/auth/authSchema.js"
import Leavemaster from "../model/secondaryUser/leavemasterSchema.js"
import mongoose from "mongoose"
import Attendance from "../model/primaryUser/attendanceSchema.js"
import Holymaster from "../model/secondaryUser/holydaymasterSchema.js"
import Onsite from "../model/primaryUser/onsiteSchema.js"
const { Staff, Admin } = models
import LeaveRequest from "../model/primaryUser/leaveRequestSchema.js"

export const PreviousmonthLeavesummary = async (month, year, Id, check) => {
    try {

        function getSundays(year, month) {
            const sundays = []
            const date = new Date(year, month - 1, 1) // Start from the 1st day of the month

            while (date.getMonth() === month - 1) {

                if (date.getDay() === 0) {
                    // 0 represents Sunday
                    sundays.push(date.getDate()) // Get only the day (1-31)
                }
                date.setDate(date.getDate() + 1) // Move to the next day
            }

            return sundays
        }
        function generateMonthDates(year, month) {
            const dates = {}
            const daysInMonth = new Date(year, month, 0).getDate()

            for (let day = 1;day <= daysInMonth;day++) {
                let date = new Date(year, month - 1, day)

                let dateKey =
                    date.getFullYear() +
                    "-" +
                    String(date.getMonth() + 1).padStart(2, "0") +
                    "-" +
                    String(date.getDate()).padStart(2, "0")

                dates[dateKey] = {
                    inTime: "",
                    outTime: "",
                    present: 0,
                    late: "",
                    onsite: [],
                    early: "",
                    reason: "",
                    description: "",
                    halfDayperiod: "",
                    notMarked: 1,
                    casualLeave: "",
                    privileageLeave: "",
                    compensatoryLeave: "",
                    otherLeave: "",
                    leaveDetails: {}
                } // Initialize empty object for each date
            }

            return dates
        }

        //
        const getMidTime = (startTime, endTime) => {
            const convertToMinutes = (timeString) => {
                const [time, period] = timeString.split(" ")
                let [hours, minutes] = time.split(":").map(Number)

                if (period === "PM" && hours !== 12) hours += 12
                if (period === "AM" && hours === 12) hours = 0

                return hours * 60 + minutes // Convert to total minutes
            }

            const convertToTimeString = (totalMinutes) => {
                let hours = Math.floor(totalMinutes / 60)
                let minutes = (totalMinutes % 60).toString().padStart(2, "0")
                const period = hours >= 12 ? "PM" : "AM"

                if (hours > 12) hours -= 12
                if (hours === 0) hours = 12

                return `${hours}:${minutes} ${period}`
            }

            const startMinutes = convertToMinutes(startTime)
            const endMinutes = convertToMinutes(endTime)
            const midMinutes = Math.floor((startMinutes + endMinutes) / 2)

            return convertToTimeString(midMinutes)
        }

        const sundays = getSundays(year, month)
        const sundayFulldate = createDates(sundays, month, year)
        const startDate = new Date(Date.UTC(year, month - 1, 1))
        const endDate = new Date(Date.UTC(year, month, 0))
        const staffObjectId = new mongoose.Types.ObjectId(Id)
        const user = await Staff.aggregate([
            {
                $match: {
                    _id: staffObjectId,
                    isVerified: true
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    attendanceId: 1,
                    assignedto: 1,
                    casualleavestartsfrom: { $ifNull: ["$casualleavestartsfrom", null] },
                    sickleavestartsfrom: { $ifNull: ["$sickleavestartsfrom", null] },
                    privilegeleavestartsfrom: {
                        $ifNull: ["$privilegeleavestartsfrom", null]
                    }
                }
            }
        ])

        const convertToMinutes = (timeStr) => {
            const [time, modifier] = timeStr.split(" ")
            let [hours, minutes] = time.split(":").map(Number)

            if (modifier === "PM" && hours !== 12) hours += 12 // Convert PM times correctly
            if (modifier === "AM" && hours === 12) hours = 0 // Midnight case

            return hours * 60 + minutes // Return total minutes since midnight
        }
        const leavemaster = await Leavemaster.find({})
        const latecuttingCount = leavemaster[0].deductSalaryMinute
        const addMinutesToTime = (timeString, minutesToAdd) => {
            // Convert to Date object
            const [time, period] = timeString.split(" ")
            let [hours, minutes] = time.split(":").map(Number)

            // Convert to 24-hour format
            if (period === "PM" && hours !== 12) hours += 12
            if (period === "AM" && hours === 12) hours = 0

            // Add minutes
            const newDate = new Date(2000, 0, 1, hours, minutes + minutesToAdd)

            // Convert back to 12-hour format
            let newHours = newDate.getHours()
            const newMinutes = newDate.getMinutes().toString().padStart(2, "0")
            const newPeriod = newHours >= 12 ? "PM" : "AM"

            if (newHours > 12) newHours -= 12
            if (newHours === 0) newHours = 12

            return `${newHours}:${newMinutes} ${newPeriod}`
        }

        function createDates(b, month, year) {
            return b.map((day) => {
                const date = new Date(year, month - 1, day)
                const yyyy = date.getFullYear() // Full year (4 digits)
                const mm = String(date.getMonth() + 1).padStart(2, "0") // Add leading zero
                const dd = String(date.getDate()).padStart(2, "0") // Add leading zero
                return `${yyyy}-${mm}-${dd}` // Full year format
            })
        }

        const morning = addMinutesToTime(
            leavemaster[0].checkIn,
            leavemaster[0].lateArrival
        )
        const evening = leavemaster[0].checkOut
        const noonTime = getMidTime(leavemaster[0].checkIn, leavemaster[0].checkOut)

        const morningLimit = convertToMinutes(morning)

        const lateLimit = convertToMinutes(leavemaster[0].checkInEndAt)
        const minOutTime = convertToMinutes(leavemaster[0].checkOutStartAt)
        const earlyLeaveLimit = convertToMinutes(leavemaster[0].checkOut)

        const noonLimit = convertToMinutes(noonTime)

        let staffAttendanceStats = []
        const holidays = await Holymaster.find({
            holyDate: {
                $gte: startDate,
                $lt: endDate
            }
        })

        const holiday = Array.isArray(holidays)
            ? holidays.map((date) => date.holyDate.getDate())
            : []


        const userId = user[0]?._id
        const attendanceId = user[0]?.attendanceId
        const userName = user[0]?.name
        const staffId = user[0]?.attendanceId
        const assignedto = user[0]?.assignedto
        const casualleavestartsfrom = user[0]?.casualleavestartsfrom
        const sickleavestartsfrom = user[0]?.sickleavestartsfrom
        const privilegeleavestartsfrom = user[0]?.privilegeleavestartsfrom

        // Fetch attendance-related data for the given month
        const results = await Promise.allSettled([
            Attendance.find({
                userId,
                attendanceDate: { $gte: startDate, $lte: endDate }
            }),
            Onsite.find({ userId, onsiteDate: { $gte: startDate, $lte: endDate } }),
            LeaveRequest.find({
                userId,
                leaveDate: { $gte: startDate, $lte: endDate }
            })
        ])

        const attendances =
            results[0].status === "fulfilled" ? results[0].value || [] : []
        const onsites =
            results[1].status === "fulfilled" ? results[1].value || [] : []
        const leaves =
            results[2].status === "fulfilled" ? results[2].value || [] : []

        let stats = {
            name: userName,
            casualleavestartsfrom,
            sickleavestartsfrom,
            privilegeleavestartsfrom,
            staffId,
            attendanceId,
            assignedto,
            userId: userId,
            present: 0,
            absent: 0,
            latecutting: 0,
            late: 0,
            earlyGoing: 0,
            halfDayLeave: 0,
            fullDayLeave: 0,
            onsite: 0,
            holiday: 0,
            notMarked: 0,
            attendancedates: generateMonthDates(year, month)
        }

        let daysInMonth = new Set(
            [...Array(endDate.getDate()).keys()].map((i) => i + 1)
        )
        function getTimeDifference(start, end) {
            // Convert times to Date objects using 12-hour format
            const startTime = new Date(`1970-01-01 ${start}`)
            const endTime = new Date(`1970-01-01 ${end}`)

            if (isNaN(startTime) || isNaN(endTime)) {
                return "Invalid date format"
            }

            // Calculate difference in minutes
            const differenceInMinutes = (endTime - startTime) / (1000 * 60)
            return differenceInMinutes >= 0
                ? differenceInMinutes
                : differenceInMinutes + 1440
        }

        const arr = []
        const present = []
        const fulldayarr = []
        const halfdayarr = []

        attendances?.length &&
            attendances?.forEach((att) => {
                const day = att.attendanceDate.getDate()
                const dayTime = att.attendanceDate.toISOString().split("T")[0]

                const punchIn = att.inTime ? convertToMinutes(att.inTime) : null
                const punchOut = att.outTime ? convertToMinutes(att.outTime) : null

                stats.attendancedates[dayTime].inTime = att?.inTime
                stats.attendancedates[dayTime].outTime = att?.outTime
                const isOnsite =
                    Array.isArray(onsites) &&
                    onsites.some(
                        (o) =>
                            o.onsiteDate.toISOString().split("T")[0] === dayTime &&
                            (o.departmentverified === true || o.adminverified === true)
                    )

                const onsiteRecord = Array.isArray(onsites)
                    ? onsites.find(
                        (o) =>
                            o.onsiteDate.toISOString().split("T")[0] === dayTime &&
                            (o.departmentverified === true || o.adminverified === true)
                    )
                    : null

                const onsiteDetails = onsiteRecord
                    ? {
                        onsiteData: onsiteRecord.onsiteData,
                        onsiteType: onsiteRecord.onsiteType,
                        halfDayPeriod:
                            onsiteRecord.onsiteType === "Half Day"
                                ? onsiteRecord.halfDayPeriod
                                : null
                    }
                    : null

                const isLeave =
                    Array.isArray(leaves) &&
                    leaves.some(
                        (l) =>
                            l.leaveDate.toISOString().split("T")[0] === dayTime &&
                            l.onsite === false &&
                            (l.departmentverified === true || l.adminverified === true)
                    )
                const leaveRecord = Array.isArray(leaves)
                    ? leaves.find(
                        (l) =>
                            l.leaveDate.toISOString().split("T")[0] === dayTime &&
                            l.onsite === false &&
                            (l.departmentverified === true || l.adminverified === true)
                    )
                    : null

                const leaveDetails = leaveRecord
                    ? {
                        _id: leaveRecord._id,
                        leaveDate: leaveRecord.leaveDate,
                        leaveType: leaveRecord.leaveType,
                        halfDayPeriod:
                            leaveRecord.leaveType === "Half Day"
                                ? leaveRecord.halfDayPeriod
                                : null,
                        leaveCategory: leaveRecord?.leaveCategory || null,
                        reason: leaveRecord?.reason || null
                    }
                    : null

                if (!punchIn || !punchOut) {
                    arr.push(day)

                    stats.attendancedates[dayTime].notMarked = 1
                    if (isOnsite && onsiteDetails.onsiteType === "Full Day") {
                        stats.attendancedates[dayTime].present = 1
                        stats.attendancedates[dayTime].notMarked = ""
                        stats.onsite++
                    } else if (isOnsite && onsiteDetails.onsiteType === "Half Day") {
                        stats.attendancedates[dayTime].present = 0.5
                        stats.attendancedates[dayTime].notMarked = 0.5
                    }
                    if (isLeave && leaveDetails.leaveType === "Full Day") {
                        if (leaveDetails.leaveCategory) {
                            switch (leaveDetails.leaveCategory) {
                                case "casual Leave":
                                    stats.attendancedates[dayTime].casualLeave = 1
                                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails

                                    break
                                case "other Leave":
                                    stats.attendancedates[dayTime].otherLeave = 1
                                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails

                                    break
                                case "privileage Leave":
                                    stats.attendancedates[dayTime].privileageLeave = 1
                                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails

                                    break
                                case "compensatory Leave":
                                    stats.attendancedates[dayTime].compensatoryLeave = 1
                                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                                    break
                                default:
                                    stats.attendancedates[dayTime].otherLeave = 1 // Default case
                                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                                    break
                            }
                        } else {
                            stats.attendancedates[dayTime].otherLeave = 1
                            stats.attendancedates[dayTime].reason = leaveDetails.reason
                            stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                        }
                        stats.attendancedates[dayTime].notMarked = ""
                    } else if (isLeave && leaveDetails.leaveType === "Half Day") {
                        if (leaveDetails.leaveCategory) {
                            switch (leaveDetails.leaveCategory) {
                                case "casual Leave":
                                    stats.attendancedates[dayTime].casualLeave = 0.5
                                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                                    stats.attendancedates[dayTime].halfDayperiod =
                                        leaveDetails.halfDayPeriod
                                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails

                                    break
                                case "other Leave":
                                    stats.attendancedates[dayTime].otherLeave = 0.5
                                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                                    stats.attendancedates[dayTime].halfDayperiod =
                                        leaveDetails.halfDayPeriod
                                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                                    break
                                case "privileage Leave":
                                    stats.attendancedates[dayTime].privileageLeave = 0.5
                                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                                    stats.attendancedates[dayTime].halfDayperiod =
                                        leaveDetails.halfDayPeriod
                                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                                    break
                                case "compensatory Leave":
                                    stats.attendancedates[dayTime].compensatoryLeave = 0.5
                                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                                    stats.attendancedates[dayTime].halfDayperiod =
                                        leaveDetails.halfDayPeriod
                                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                                    break
                                default:
                                    stats.attendancedates[dayTime].otherLeave = 0.5
                                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                                    stats.attendancedates[dayTime].halfDayperiod =
                                        leaveDetails.halfDayPeriod // Default case
                                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                                    break
                            }
                        } else {
                            stats.attendancedates[dayTime].otherLeave = 0.5

                            stats.attendancedates[dayTime].reason = leaveDetails.reason
                            stats.attendancedates[dayTime].halfDayperiod =
                                leaveDetails.halfDayPeriod
                            stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                        }
                        stats.attendancedates[dayTime].notMarked = 0.5
                    }
                } else if (punchIn <= morningLimit && punchOut >= earlyLeaveLimit) {
                    stats.attendancedates[dayTime].present = 1
                    stats.attendancedates[dayTime].inTime = att.inTime
                    stats.attendancedates[dayTime].outTime = att.outTime
                    stats.attendancedates[dayTime].notMarked = ""

                    if (isOnsite && onsiteDetails.onsiteType === "Full Day") {
                        stats.onsite++
                    } else if (isOnsite && onsiteDetails.onsiteType === "Half Day") {
                        stats.onsite += 0.5
                    }
                } else if (
                    punchIn >= morningLimit &&
                    punchIn <= lateLimit &&
                    punchOut >= earlyLeaveLimit
                ) {
                    const a = getTimeDifference(morning, att.inTime)

                    stats.attendancedates[dayTime].late = a
                    stats.late++
                    stats.attendancedates[dayTime].present = 1
                    stats.attendancedates[dayTime].inTime = att.inTime
                    stats.attendancedates[dayTime].outTime = att.outTime
                    stats.attendancedates[dayTime].notMarked = ""
                    if (isOnsite && onsiteDetails.onsiteType === "Full Day") {
                        stats.onsite++
                    } else if (isOnsite && onsiteDetails.onsiteType === "Half Day") {
                        stats.onsite += 0.5
                    }
                    present.push(day)
                } else if (
                    punchOut >= minOutTime &&
                    punchOut < earlyLeaveLimit &&
                    punchIn <= morningLimit
                ) {
                    const b = getTimeDifference(att.outTime, evening)
                    stats.attendancedates[dayTime].present = 1
                    stats.attendancedates[dayTime].early = b
                    stats.attendancedates[dayTime].inTime = att.inTime
                    stats.attendancedates[dayTime].outTime = att.outTime
                    stats.attendancedates[dayTime].notMarked = ""
                    stats.earlyGoing++
                    if (isOnsite && onsiteDetails.onsiteType === "Full Day") {
                        stats.onsite++
                    } else if (isOnsite && onsiteDetails.onsiteType === "Half Day") {
                        stats.onsite += 0.5
                    }
                    present.push(day)
                } else if (
                    punchIn <= lateLimit &&
                    punchIn > morningLimit &&
                    punchOut >= minOutTime &&
                    punchOut < earlyLeaveLimit
                ) {
                    const a = getTimeDifference(morning, att.inTime)
                    const b = getTimeDifference(att.outTime, evening)
                    stats.earlyGoing++
                    stats.late++
                    stats.attendancedates[dayTime].present = 1
                    stats.attendancedates[dayTime].inTime = att.inTime
                    stats.attendancedates[dayTime].outTime = att.outTime
                    stats.attendancedates[dayTime].notMarked = ""
                    stats.attendancedates[dayTime].early = b
                    stats.attendancedates[dayTime].late = a
                    if (isOnsite && onsiteDetails.onsiteType === "Full Day") {
                        stats.onsite++
                    } else if (isOnsite && onsiteDetails.onsiteType === "Half Day") {
                        stats.onsite += 0.5
                    }
                } else if (
                    (punchIn < noonLimit && punchOut < noonLimit) ||
                    (punchIn > noonLimit && punchOut > noonLimit) ||
                    (punchIn > lateLimit &&
                        punchIn < noonLimit &&
                        punchOut < minOutTime &&
                        punchOut > noonLimit)
                ) {
                    stats.attendancedates[dayTime].notMarked = 1
                    if (isOnsite && onsiteDetails.onsiteType === "Full Day") {
                        stats.onsite++
                        stats.attendancedates[dayTime].present = 1
                        stats.attendancedates[dayTime].notMarked = ""
                    } else if (isOnsite && onsiteDetails.onsiteType === "Half Day") {
                        stats.onsite += 0.5
                        stats.attendancedates[dayTime].present = 0.5
                        stats.attendancedates[dayTime].notMarked = 0.5
                    }
                    ///
                    fulldayarr.push(day)
                    if (isLeave && leaveDetails.leaveType === "Full Day") {
                        if (leaveDetails.leaveCategory) {
                            switch (leaveDetails.leaveCategory) {
                                case "casual Leave":
                                    stats.attendancedates[dayTime].casualLeave = 1
                                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                                    stats.attendancedates[dayTime].leaveId = leaveDetails.leaveId
                                    break
                                case "other Leave":
                                    stats.attendancedates[dayTime].otherLeave = 1
                                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                                    stats.attendancedates[dayTime].leaveId = leaveDetails.leaveId
                                    break
                                case "privileage Leave":
                                    stats.attendancedates[dayTime].privileageLeave = 1
                                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                                    stats.attendancedates[dayTime].leaveId = leaveDetails.leaveId
                                    break
                                case "compensatory Leave":
                                    stats.attendancedates[dayTime].compensatoryLeave = 1
                                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                                    stats.attendancedates[dayTime].leaveId = leaveDetails.leaveId
                                    break
                                default:
                                    stats.attendancedates[dayTime].otherLeave = 1 // Default case
                                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                                    stats.attendancedates[dayTime].leaveId = leaveDetails.leaveId
                                    break
                            }
                        } else {
                            stats.attendancedates[dayTime].otherLeave = 1
                            stats.attendancedates[dayTime].reason = leaveDetails.reason
                            stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                            stats.attendancedates[dayTime].leaveId = leaveDetails.leaveId
                        }
                        stats.attendancedates[dayTime].notMarked = ""
                    } else if (isLeave && leaveDetails.leaveType === "Half Day") {
                        if (leaveDetails.leaveCategory) {
                            switch (leaveDetails.leaveCategory) {
                                case "casual Leave":
                                    stats.attendancedates[dayTime].casualLeave = 0.5
                                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                                    stats.attendancedates[dayTime].halfDayperiod =
                                        leaveDetails.halfDayPeriod
                                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                                    break
                                case "other Leave":
                                    stats.attendancedates[dayTime].otherLeave = 0.5
                                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                                    stats.attendancedates[dayTime].halfDayperiod =
                                        leaveDetails.halfDayPeriod
                                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                                    break
                                case "privileage Leave":
                                    stats.attendancedates[dayTime].privileageLeave = 0.5

                                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                                    stats.attendancedates[dayTime].halfDayperiod =
                                        leaveDetails.halfDayPeriod
                                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                                    break
                                case "compensatory Leave":
                                    stats.attendancedates[dayTime].compensatoryLeave = 0.5
                                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                                    stats.attendancedates[dayTime].halfDayperiod =
                                        leaveDetails.halfDayPeriod
                                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                                    break
                                default:
                                    stats.attendancedates[dayTime].otherLeave = 0.5
                                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                                    stats.attendancedates[dayTime].halfDayperiod =
                                        leaveDetails.halfDayPeriod // Default case
                                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                                    break
                            }
                        } else {
                            stats.attendancedates[dayTime].otherLeave = 0.5
                            stats.attendancedates[dayTime].reason = leaveDetails.reason
                            stats.attendancedates[dayTime].halfDayperiod =
                                leaveDetails.halfDayPeriod
                            stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                        }
                        stats.attendancedates[dayTime].notMarked = 0.5
                    }
                } else if (
                    (punchIn == lateLimit &&
                        punchOut >= noonLimit &&
                        punchOut < minOutTime) ||
                    (punchIn <= noonLimit &&
                        punchOut == minOutTime &&
                        punchIn > lateLimit)
                ) {
                    stats.attendancedates[dayTime].present = 0.5
                    stats.attendancedates[dayTime].notMarked = 0.5
                    if (isOnsite && onsiteDetails.onsiteType === "Full Day") {
                        stats.onsite++
                        stats.attendancedates[dayTime].present = 1
                        stats.attendancedates[dayTime].notMarked = ""
                    } else if (isOnsite && onsiteDetails.onsiteType === "Half Day") {
                        if (
                            punchIn == lateLimit &&
                            punchOut >= noonLimit &&
                            onsiteDetails.halfDayPeriod === "Afternoon"
                        ) {
                            stats.onsite += 0.5
                            stats.attendancedates[dayTime].present = 1
                            stats.attendancedates[dayTime].notMarked = ""
                        } else if (
                            punchIn == lateLimit &&
                            punchOut >= noonLimit &&
                            onsiteDetails.halfDayPeriod === "Morning"
                        ) {
                            stats.onsite += 0.5
                        } else if (
                            punchIn <= noonLimit &&
                            punchOut >= minOutTime &&
                            onsiteDetails.halfDayPeriod === "Morning"
                        ) {
                            stats.onsite += 0.5
                            stats.attendancedates[dayTime].present = 1
                            stats.attendancedates[dayTime].notMarked = ""
                        }
                    }
                } else if (
                    (punchIn < lateLimit &&
                        punchOut >= noonLimit &&
                        punchOut < minOutTime) ||
                    (punchIn <= noonLimit &&
                        punchOut >= earlyLeaveLimit &&
                        punchIn > lateLimit)
                ) {
                    arr.push(day)
                    halfdayarr.push(day)
                    stats.attendancedates[dayTime].present = 0.5
                    stats.attendancedates[dayTime].notMarked = 0.5
                    if (isOnsite && onsiteDetails.onsiteType === "Full Day") {
                        stats.onsite++
                        stats.attendancedates[dayTime].present = 1
                        stats.attendancedates[dayTime].notMarked = ""
                    } else if (isOnsite && onsiteDetails.onsiteType === "Half Day") {
                        if (
                            punchIn < lateLimit &&
                            punchOut >= noonLimit &&
                            onsiteDetails.halfDayPeriod === "Afternoon"
                        ) {
                            stats.onsite += 0.5
                            stats.attendancedates[dayTime].present = 1
                            stats.attendancedates[dayTime].notMarked = ""
                        } else if (
                            punchIn < lateLimit &&
                            punchOut >= noonLimit &&
                            onsiteDetails.halfDayPeriod === "Morning"
                        ) {
                            stats.onsite += 0.5
                        } else if (
                            punchIn <= noonLimit &&
                            punchOut >= earlyLeaveLimit &&
                            onsiteDetails.halfDayPeriod === "Afternoon"
                        ) {
                            stats.onsite += 0.5
                        } else if (
                            punchIn <= noonLimit &&
                            punchOut >= earlyLeaveLimit &&
                            onsiteDetails.halfDayPeriod === "Morning"
                        ) {
                            stats.onsite += 0.5
                            stats.attendancedates[dayTime].present = 1
                            stats.attendancedates[dayTime].notMarked = ""
                        }
                    }

                    if (isLeave && leaveDetails.leaveType === "Full Day") {
                        if (leaveDetails.leaveCategory) {
                            switch (leaveDetails.leaveCategory) {
                                case "casual Leave":
                                    stats.attendancedates[dayTime].casualLeave = 1
                                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                                    stats.attendancedates[dayTime].leaveId = leaveDetails.
                                        break
                                case "other Leave":
                                    stats.attendancedates[dayTime].otherLeave = 1
                                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                                    break
                                case "privileage Leave":
                                    stats.attendancedates[dayTime].privileageLeave = 1
                                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                                    break
                                case "compensatory Leave":
                                    stats.attendancedates[dayTime].compensatoryLeave = 1
                                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                                    break
                                default:
                                    stats.attendancedates[dayTime].otherLeave = 1 // Default case
                                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                                    break
                            }
                        } else {
                            stats.attendancedates[dayTime].otherLeave = 1
                            stats.attendancedates[dayTime].reason = leaveDetails.reason
                            stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                        }
                        stats.attendancedates[dayTime].notMarked = ""
                    } else if (isLeave && leaveDetails.leaveType === "Half Day") {
                        if (leaveDetails.leaveCategory) {
                            switch (leaveDetails.leaveCategory) {
                                case "casual Leave":
                                    stats.attendancedates[dayTime].casualLeave = 0.5
                                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                                    stats.attendancedates[dayTime].halfDayperiod =
                                        leaveDetails.halfDayPeriod
                                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                                    break
                                case "other Leave":
                                    stats.attendancedates[dayTime].otherLeave = 0.5
                                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                                    stats.attendancedates[dayTime].halfDayperiod =
                                        leaveDetails.halfDayPeriod
                                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                                    break
                                case "privileage Leave":
                                    stats.attendancedates[dayTime].privileageLeave = 0.5

                                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                                    stats.attendancedates[dayTime].halfDayperiod =
                                        leaveDetails.halfDayPeriod
                                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                                    break
                                case "compensatory Leave":
                                    stats.attendancedates[dayTime].compensatoryLeave = 0.5
                                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                                    stats.attendancedates[dayTime].halfDayperiod =
                                        leaveDetails.halfDayPeriod
                                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                                    break
                                default:
                                    stats.attendancedates[dayTime].otherLeave = 0.5
                                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                                    stats.attendancedates[dayTime].halfDayperiod =
                                        leaveDetails.halfDayPeriod // Default case
                                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                                    break
                            }
                        } else {
                            stats.attendancedates[dayTime].otherLeave = 0.5
                            stats.attendancedates[dayTime].reason = leaveDetails.reason
                            stats.attendancedates[dayTime].halfDayperiod =
                                leaveDetails.halfDayPeriod
                            stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                        }
                        stats.attendancedates[dayTime].notMarked = ""
                    }
                }
                daysInMonth.delete(day)
            })

        onsites?.length &&
            onsites?.forEach((onsite) => {
                const onsiteDate = onsite.onsiteDate.toISOString().split("T")[0]

                const isAttendance =
                    Array.isArray(attendances) &&
                    attendances.some(
                        (o) => o.attendanceDate.toISOString().split("T")[0] === onsiteDate
                    )
                if (
                    Array.isArray(onsite.onsiteData) &&
                    (onsite.adminverified === true ||
                        onsite.departmentverified === true)
                ) {
                    onsite.onsiteData.flat().forEach((item) => {
                        stats.attendancedates[onsiteDate].onsite.push({
                            place: item?.place,
                            siteName: item?.siteName,
                            onsiteType: onsite?.onsiteType,
                            halfDayPeriod:
                                onsite?.onsiteType === "Half Day"
                                    ? onsite?.halfDayPeriod
                                    : null,
                            description: onsite?.description
                        })
                    })
                }

                if (
                    !isAttendance &&
                    (onsite.adminverified === true ||
                        onsite.departmentverified === true)
                ) {
                    if (onsite.onsiteType === "Full Day") {
                        stats.attendancedates[onsiteDate].present = 1
                        stats.attendancedates[onsiteDate].notMarked = ""
                        stats.onsite++
                    } else if (onsite.onsiteType === "Half Day") {
                        stats.attendancedates[onsiteDate].present = 0.5
                        stats.attendancedates[onsiteDate].notMarked = 0.5
                    }
                }
            })

        leaves?.length &&
            leaves.forEach((leave) => {
                const leaveDate = leave.leaveDate.toISOString().split("T")[0]

                const leaveCategory = leave?.leaveCategory

                const isAttendance =
                    Array.isArray(attendances) &&
                    attendances.some(
                        (o) => o.attendanceDate.toISOString().split("T")[0] === leaveDate
                    )

                if (!isAttendance) {
                    if (
                        leave.leaveType === "Full Day" &&
                        leave.onsite === false &&
                        (leave.adminverified === true ||
                            leave.departmentverified === true)
                    ) {
                        if (leaveCategory) {
                            switch (leaveCategory) {
                                case "casual Leave":
                                    stats.attendancedates[leaveDate].casualLeave = 1
                                    stats.attendancedates[leaveDate].reason = leave.reason
                                    stats.attendancedates[leaveDate].leaveDetails[leave._id] = leave
                                    // stats.attendancedates[leaveDate].leaveId.leadId = leave._id
                                    break
                                case "other Leave":
                                    stats.attendancedates[leaveDate].otherLeave = 1
                                    stats.attendancedates[leaveDate].reason = leave.reason
                                    // stats.attendancedates[leaveDate].leaveId = leave._id
                                    stats.attendancedates[leaveDate].leaveDetails[leave._id] = leave
                                    // stats.attendancedates[leaveDate].leaveId.leadId = leave._id
                                    break
                                case "privileage Leave":
                                    stats.attendancedates[leaveDate].privileageLeave = 1
                                    stats.attendancedates[leaveDate].reason = leave.reason
                                    // stats.attendancedates[leaveDate].leaveId = leave._id
                                    stats.attendancedates[leaveDate].leaveDetails[leave._id] = leave
                                    // stats.attendancedates[leaveDate].leaveId.leadId = leave._id
                                    break
                                case "compensatory Leave":
                                    stats.attendancedates[leaveDate].compensatoryLeave = 1
                                    stats.attendancedates[leaveDate].reason = leave.reason
                                    // stats.attendancedates[leaveDate].leaveId = leave._id
                                    stats.attendancedates[leaveDate].leaveDetails[leave._id] = leave
                                    // stats.attendancedates[leaveDate].leaveId.leadId = leave._id
                                    break
                                default:
                                    stats.attendancedates[leaveDate].otherLeave = 1 // Default case
                                    stats.attendancedates[leaveDate].reason = leave.reason
                                    stats.attendancedates[leaveDate].leaveDetails[leave._id] = leave
                                    break
                            }
                        } else {
                            stats.attendancedates[leaveDate].otherLeave = 1
                            stats.attendancedates[leaveDate].reason = leave.reason
                            stats.attendancedates[leaveDate].leaveDetails[leave._id] = leave
                        }

                        stats.attendancedates[leaveDate].notMarked = ""
                    } else if (
                        leave.leaveType === "Half Day" &&
                        leave.onsite === false &&
                        (leave.adminverified === true ||
                            leave.departmentverified === true)
                    ) {
                        if (leaveCategory) {
                            switch (leaveCategory) {
                                case "casual Leave":
                                    stats.attendancedates[leaveDate].casualLeave = (stats.attendancedates[leaveDate].casualLeave || 0) + 0.5
                                    stats.attendancedates[leaveDate].reason = leave.reason
                                    stats.attendancedates[leaveDate].halfDayperiod =
                                        leave.halfDayPeriod
                                    stats.attendancedates[leaveDate].leaveDetails[leave._id] = leave
                                    break
                                case "other Leave":
                                    stats.attendancedates[leaveDate].otherLeave = (stats.attendancedates[leaveDate].otherLeave || 0) + 0.5
                                    stats.attendancedates[leaveDate].reason = leave.reason
                                    stats.attendancedates[leaveDate].halfDayperiod =
                                        leave.halfDayPeriod
                                    stats.attendancedates[leaveDate].leaveDetails[leave._id] = leave
                                    break
                                case "privileage Leave":
                                    stats.attendancedates[leaveDate].privileageLeave = (stats.attendancedates[leaveDate].privileageLeave || 0) + 0.5
                                    stats.attendancedates[leaveDate].reason = leave.reason
                                    stats.attendancedates[leaveDate].halfDayperiod =
                                        leave.halfDayPeriod
                                    stats.attendancedates[leaveDate].leaveDetails[leave._id] = leave
                                    break
                                case "compensatory Leave":
                                    stats.attendancedates[leaveDate].compensatoryLeave = (stats.attendancedates[leaveDate].compensatoryLeave || 0) + 0.5
                                    stats.attendancedates[leaveDate].reason = leave.reason
                                    stats.attendancedates[leaveDate].halfDayperiod =
                                        leave.halfDayPeriod
                                    stats.attendancedates[leaveDate].leaveDetails[leave._id] = leave
                                    break
                                default:
                                    stats.attendancedates[leaveDate].otherLeave = (stats.attendancedates[leaveDate].otherLeave || 0) + 0.5
                                    stats.attendancedates[leaveDate].reason = leave.reason
                                    stats.attendancedates[leaveDate].halfDayperiod =
                                        leave.halfDayPeriod // Default case
                                    stats.attendancedates[leaveDate].leaveDetails[leave._id] = leave
                                    break
                            }
                        } else {
                            stats.attendancedates[leaveDate].otherLeave = (stats.attendancedates[leaveDate].otherLeave || 0) + 0.5
                            stats.attendancedates[leaveDate].reason = leave.reason
                            stats.attendancedates[leaveDate].halfDayperiod =
                                leave.halfDayPeriod
                            stats.attendancedates[leaveDate].leaveDetails[leave._id] = leave
                        }
                        const totalLeave =
                            (stats.attendancedates[leaveDate].casualLeave || 0) +
                            (stats.attendancedates[leaveDate].otherLeave || 0) +
                            (stats.attendancedates[leaveDate].privileageLeave || 0) +
                            (stats.attendancedates[leaveDate].compensatoryLeave || 0)

                        stats.attendancedates[leaveDate].notMarked = totalLeave > 0.5 ? "" : totalLeave === 0.5 ? 0.5 : totalLeave === 0 ? "" : ""
                    }
                }
            })


        const uniqueDates = [...new Set([...sundays, ...holiday])]

        const allholidays = createDates(uniqueDates, month, year)

        function getNextDate(dateString) {
            // Parse the date string (YYYY-MM-DD)

            const [year, month, day] = dateString.split("-").map(Number)

            // Create a date object
            const date = new Date(year, month - 1, day)

            // Add one day
            date.setDate(date.getDate() + 1)

            // Format the result back to 'YYYY-MM-DD'
            const nextDay = String(date.getDate()).padStart(2, "0")
            const nextMonth = String(date.getMonth() + 1).padStart(2, "0")
            const nextYear = date.getFullYear() // Full year

            return `${nextYear}-${nextMonth}-${nextDay}`
        }
        function getPreviousDate(dateString) {
            // Parse the date string (YYYY-MM-DD)
            const [year, month, day] = dateString.split("-").map(Number)

            // Create a date object
            const date = new Date(year, month - 1, day)

            // Subtract one day
            date.setDate(date.getDate() - 1)

            // Format the result back to 'YYYY-MM-DD'
            const prevDay = String(date.getDate()).padStart(2, "0")
            const prevMonth = String(date.getMonth() + 1).padStart(2, "0")
            const prevYear = date.getFullYear() // Full year

            return `${prevYear}-${prevMonth}-${prevDay}`
        }


        ; (function calculateAbsences(allholidayfulldate, attendances, onsites) {
            const isPresent = (date) => {

                const attendance = attendances.attendancedates[date]
                if (attendance) {
                    if (
                        attendance.otherLeave !== "" ||
                        attendance.privileageLeave !== "" ||
                        attendance.casualLeave !== "" ||
                        attendance.compensatoryLeave !== "" ||
                        attendance.notMarked !== ""
                    ) {
                        return {
                            status: false,
                            present: attendance.present,
                            otherLeave: attendance.otherLeave,
                            notMarked: attendance.notMarked
                        }
                    } else {
                        return {
                            status: true,
                            present: attendance.present,
                            notMarked: attendance.notMarked
                        }
                    }
                } else {

                }
            }
            // Sort dates first to ensure they are in order
            const sortedHolidays = allholidayfulldate.sort()


            // Find groups of consecutive holidays
            let groups = []
            let tempGroup = []

            for (let i = 0;i < sortedHolidays.length;i++) {
                const currDate = new Date(sortedHolidays[i])
                const prevDate = i > 0 ? new Date(sortedHolidays[i - 1]) : null

                if (
                    prevDate &&
                    currDate - prevDate === 24 * 60 * 60 * 1000 // 1 day gap
                ) {
                    if (!tempGroup.length) tempGroup.push(prevDate)
                    tempGroup.push(currDate)
                    groups.push(tempGroup)
                    tempGroup = []
                } else {
                    tempGroup.push(currDate)
                    groups.push(tempGroup)
                    tempGroup = []
                }
            }

            groups.forEach((group) => {
                const first = group[0]
                const stringfirst = first.toISOString().split("T")[0]
                const last = group[group.length - 1]
                const stringlast = last.toISOString().split("T")[0]

                const previousDay = getPreviousDate(stringfirst)
                const nextDay = getNextDate(stringlast)

                const prevFullPresent = isPresent(previousDay)

                const nextFullPresent = isPresent(nextDay)

                if (prevFullPresent?.status || nextFullPresent?.status) {

                    stats.attendancedates[stringfirst].present = 1

                    stats.attendancedates[stringlast].present = 1
                    stats.attendancedates[stringlast].notMarked = ""
                    // stats.attendancedates[nextDay].otherLeave = 1
                    stats.attendancedates[stringfirst].notMarked = ""
                }

            })
        })(allholidays, stats, onsites)



        for (const date in stats.attendancedates) {
            const day = stats.attendancedates[date]

            stats.present += day.present || 0

            // Sum all leave types
            const leaveTypes = [
                "casualLeave",
                "otherLeave",
                "privileageLeave",
                "compensatoryLeave"
            ]

            leaveTypes.forEach((type) => {
                if (!isNaN(day[type])) {
                    stats.absent += Number(day[type])
                }
            })

            stats.notMarked += day.notMarked !== "" ? Number(day.notMarked) : 0
        }


        const combined = stats.earlyGoing + stats.late
        stats.latecutting =
            Math.floor(combined / (latecuttingCount * 2)) * 1 +
            (Math.floor(combined / latecuttingCount) % 2) * 0.5

        stats.present -=
            Math.floor(combined / (latecuttingCount * 2)) * 1 +
            (Math.floor(combined / latecuttingCount) % 2) * 0.5

        staffAttendanceStats.push(stats)

        const listofHolidays = holidays.map((item) => ({
            date: item.holyDate.toISOString().split("T")[0],
            holyname: item.customTextInput
        }))


        const attendance = staffAttendanceStats[0]
        const alldate = Object.keys(attendance.attendancedates)
        const sortedDates = alldate.sort()
        let entry = null
        if (check == "previous") {
            const last = sortedDates[alldate.length - 1]
            entry = attendance.attendancedates[last]
        } else if (check === "next") {
            const first = sortedDates[0]
            entry = attendance.attendancedates[first]
        }

        let DateEntry = {};

        // 4. Normalize entry in case it's wrapped in an array or malformed
        if (Array.isArray(entry)) {
            DateEntry = typeof entry[0] === "object" ? entry[0] : {};
        } else if (typeof entry === "object" && entry !== null) {
            DateEntry = entry;
        } else {
            console.warn("⚠️ Invalid data format on last date");
        }

        const hasLeave = DateEntry.casualLeave !== "" || DateEntry.privileageLeave !== "" || DateEntry.compensatoryLeave !== "" || DateEntry.otherLeave !== ""


        return hasLeave


    } catch (error) {
        console.log("error", error)
    }
}