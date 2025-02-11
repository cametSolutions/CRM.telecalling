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

  const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" }) // First row as array
  const filteredData = jsonData.map((row) => {
    const filteredRow = {}
    Object.keys(row).forEach((key) => {
      if (allowedHeaders.includes(key)) {
        filteredRow[key] = row[key]
      }
    })
    return filteredRow
  })

  // Loop through all the sheets in the workbook
  for (const item of filteredData) {
    try {
      const existingAttendance = await Attendance.findOne({
        attendanceId: item["User ID"],
        attendanceDate: excelDateToFormatString(item["Date"])
      })
      const outTime12 = item["Out"] ? convertTo12HourTime(item["Out"]) : null
      const inTime12 = item["In"]
        ? convertTo12HourTime(item["In"], item["User ID"])
        : null

      if (
        existingAttendance &&
        !existingAttendance.edited &&
        !existingAttendance.excel
      ) {
        totalData++
        const updated = await Attendance.updateOne(
          {
            attendanceId: item["User ID"],
            attendanceDate: excelDateToFormatString(item["Date"]),
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
          uploadedCount++
          socket.emit("attendanceconversionProgress", {
            current: uploadedCount,
            total: totalData
          })
        } else {
          failedData.push(item)
        }
      } else {
        if (item["User ID"] && (item["In"] || item["Out"])) {
          totalData++
          const staff = await Staff.findOne({ attendanceId: item["User ID"] })

          if (staff) {
            const a = excelDateToFormatString(item["Date"])

            const saveAttendance = await Attendance({
              userId: staff._id,
              attendanceId: item["User ID"],
              attendanceDate: a,
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
      failedData.push(item)
      console.log("error:", error.message)
    }
  }

  //Final socket emission
  if (uploadedCount > 0) {
    socket.emit("attendanceconversionComplete", {
      message:
        failedData.length === 0
          ? "Conversion completed"
          : "Conversion partially completed",
      secondaryMessage: "Some files were not saved due to have no Ids",
      nonsavingData: failedData
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
