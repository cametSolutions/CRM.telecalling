import XLSX from "xlsx" // Assuming you're using XLSX to parse Excel files
import Attendance from "../../model/primaryUser/attendanceSchema.js"
import models from "../../model/auth/authSchema.js"
const { Staff, Admin } = models
const excelDateToFormatNumber = (value) => {
  // Check if the value is a serial (number) or a string
  if (typeof value === "number") {
    // console.log("number", value)
    // console.log
    // const date1900 = new Date(Date.UTC(1900, 0, 1))
    // const jsDate = new Date(date1900.getTime() + (value - 2) * 86400000) // Subtract 2 for 1900 leap year bug
    // const year = jsDate.getUTCFullYear()
    // const month = String(jsDate.getUTCMonth() + 1).padStart(2, "0")
    // const day = String(jsDate.getUTCDate()).padStart(2, "0")
    // // Construct the date string in 'YYYY-MM-DD' format
    // const formattedDate = `${year}-${month}-${day}`
    // return formattedDate // Return the formatted date
  } else {
    console.log("hiiiiiiiii")
  }
}
const convertTo12HourTime = (time24, ID) => {
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

export const excelDateToFormatString = (value) => {
  if (typeof value === "string") {
    // Try to handle different string date formats
    let jsDate

    // Detect common date formats and parse
    if (/\d{2}\/\d{2}\/\d{2,4}/.test(value)) {
      // Handle 'dd/MM/yyyy' or 'dd/MM/yy'
      jsDate = new Date(value.split("/").reverse().join("-")) // Reformat for JS Date constructor
    } else if (/\d{2}-\d{2}-\d{2,4}/.test(value)) {
      // Handle 'dd-MM-yyyy' or 'dd-MM-yy'
      jsDate = new Date(value.split("-").reverse().join("-")) // Reformat for JS Date constructor
    } else if (/\d{2}-[a-zA-Z]{3}-\d{4}/.test(value)) {
      // Handle 'dd-MMM-yyyy'
      jsDate = new Date(value)
    }

    if (jsDate && !isNaN(jsDate)) {
      const year = jsDate.getUTCFullYear()
      const month = String(jsDate.getUTCMonth() + 1).padStart(2, "0") // Months are zero-indexed
      const day = String(jsDate.getUTCDate()).padStart(2, "0")

      // Construct the date string in 'YYYY-MM-DD' format
      return `${year}-${month}-${day}`
    } else {
      // If parsing fails, return the original value
      return value
    }
  } else {
    console.log("type", typeof value)
  }
}

export const AttendanceExceltoJson = async (socket, fileData) => {
  // Initialize tracking for uploads
  let uploadedCount = 0
  let totalData = 0
  let failedData = []
  let existingexcel = []
  const allowedHeaders = [
    "SNO",
    "User ID",
    "Full Name",
    "Department",
    "Designation",
    "Sex",
    "Date",
    "Day",
    "Timetable",
    "In",
    "Out",
    "Work",
    "OT",
    "Total",
    "Break",
    "Late",
    "Status",
    "Records",
    "Date"
  ]
  //Parse the uploaded Excel file
  const workbook = XLSX.read(fileData, { type: "buffer" })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const allRows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" })

  // Step 2: Find the row index that contains actual headers
  // const allowedHeaders = ["User ID", "Date", "In Time", "Out Time"] // Adjust headers as needed
  let headerIndex = allRows.findIndex((row) =>
    row.some((cell) => allowedHeaders.includes(cell))
  )

  // If no headers found, return an empty array
  if (headerIndex === -1) {
    console.error("No valid headers found in the Excel sheet.")
    return []
  }

  // Step 3: Extract table data (excluding unwanted text below)
  const tableData = allRows.slice(headerIndex) // Keep only rows after the header

  // Step 4: Convert the valid table data to JSON format
  const jsonData = XLSX.utils.sheet_to_json(sheet, {
    range: headerIndex,
    defval: ""
  })

  for (const item of jsonData) {
    try {
      const datestr = excelDateToFormatString(item["Date"])
      const searchDate = new Date(datestr)
      const startOfDay = new Date(
        Date.UTC(
          searchDate.getUTCFullYear(),
          searchDate.getUTCMonth(),
          searchDate.getUTCDate(),
          0,
          0,
          0,
          0
        )
      )

      const endOfDay = new Date(
        Date.UTC(
          searchDate.getUTCFullYear(),
          searchDate.getUTCMonth(),
          searchDate.getUTCDate(),
          23,
          59,
          59,
          999
        )
      )
      const existingAttendance = await Attendance.findOne({
        attendanceId: item["User ID"],
        attendanceDate: {
          $gte: startOfDay,
          $lte: endOfDay // Covers full day range
        }
      })

      const outTime12 = item["Out"] ? convertTo12HourTime(item["Out"]) : null
      const inTime12 = item["In"]
        ? convertTo12HourTime(item["In"], item["User ID"])
        : null

      if (
        (existingAttendance &&
          !existingAttendance.edited &&
          existingAttendance.excel) ||
        existingAttendance.own
      ) {
        totalData++
        const updated = await Attendance.updateOne(
          {
            attendanceId: item["User ID"],
            attendanceDate: {
              $gte: searchDate,
              $lt: new Date(searchDate.getTime() + 24 * 60 * 60 * 1000) // Covers full day range
            },
            edited: false
          },
          {
            $set: {
              inTime: inTime12,
              outTime: outTime12
            }
          }
        )
        if (updated.modifiedCount > 0) {
          existingexcel.push(item)
          socket.emit("attendanceconversionProgress", {
            current: uploadedCount,
            total: totalData
          })
        }
      } else {
        if (item["User ID"] && (item["In"] || item["Out"])) {
          totalData++
          const staff = await Staff.findOne({ attendanceId: item["User ID"] })

          if (staff) {
            const datestr = excelDateToFormatString(item["Date"])

            const date = new Date(datestr)

            const saveAttendance = await Attendance({
              userId: staff._id,
              attendanceId: item["User ID"],
              attendanceDate: date,
              inTime: inTime12,
              outTime: outTime12,
              excel: true
            })
            const uploadattendance = await saveAttendance.save()
            if (uploadattendance) {
              uploadedCount++
              socket.emit("attendanceconversionProgress", {
                current: uploadedCount,
                total: totalData
              })
            } else {
              failedData.push(item)
            }
          } else {
            failedData.push(item)
          }
        }
      }
    } catch (error) {
      console.log("error:", error.message)
    }
  }

  //Final socket emission
  if (uploadedCount > 0 && existingexcel.length > 0) {
    socket.emit("attendanceconversionComplete", {
      message:
        failedData.length === 0
          ? "Conversion completed"
          : "Conversion partially completed",
      secondaryMessage: "Some files were not saved due to have no Ids ",
      duplicateMessage: existingexcel.length > 0 ? "already uploaded" : "",

      nonsavingData: failedData,
      duplicateData: existingexcel
    })
  } else if (uploadedCount > 0 && existingexcel.length === 0) {
    socket.emit("attendanceconversionComplete", {
      message:
        failedData.length === 0
          ? "Conversion completed"
          : "Conversion partially completed",
      secondaryMessage: "Some files were not saved due to have no Ids",

      nonsavingData: failedData
    })
  } else if (uploadedCount === 0 && existingexcel.length > 0) {
    socket.emit("attendanceconversionComplete", {
      message: "all are duplicates",
      secondaryMessage:
        "Some files were not saved due to have no Ids or duplicate",
      duplicateMessage: "already uploaded",

      nonsavingData: failedData,
      duplicateData: existingexcel
    })
  } else {
    socket.emit("attendanceconversionError", {
      message:
        failedData.length === totalData
          ? "This file is already uploaded"
          : "Error occurred during upload"
    })
  }
}
