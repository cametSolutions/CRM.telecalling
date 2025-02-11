import React, { useState, useEffect } from "react"
import io from "socket.io-client"
import * as XLSX from "xlsx" // Import XLSX for creating the Excel file

const socket = io("https://www.crm.camet.in") // Adjust based on your backend address
// const socket = io("http://localhost:9000")

const AttendanceExcelUploader = () => {
  const [file, setFile] = useState(null)
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [failMessage, setFailMessage] = useState("")
  const [success, setSuccess] = useState(false)
  const [nonsavedData, setNonsavedData] = useState([])

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile) // Save the selected file in state
    }
  }

  const handleUpload = () => {
    if (file) {
      setLoading(true) // Set loading state to true
      setSuccess(false) // Reset success state
      const reader = new FileReader()
      reader.onload = (event) => {
        const fileData = event.target.result

        // Emit event to start the conversion
        socket.emit("startattendanceConversion", fileData)
      }
      reader.readAsArrayBuffer(file)
    }
  }

  // Listen for progress updates
  useEffect(() => {
    socket.on("attendanceconversionProgress", (data) => {
      setProgress({
        current: data.current,
        total: data.total
      })
    })

    // Listen for completion message
    socket.on("attendanceconversionComplete", (data) => {
      setLoading(false) // Set loading to false on completion
      setMessage(data?.message)
      setFailMessage(data?.secondaryMessage)
      setNonsavedData(data?.nonsavingData) // Store failed data
      setSuccess(true)
      setFile(null) // Reset file selection after conversion
    })

    // Listen for error messages
    socket.on("attendanceconversionError", (error) => {
      setLoading(false) // Set loading to false on error
      setMessage(error?.message)
      // setNonsavedData(error.nonsavingData) // Store failed data
      setSuccess(false)
    })

    // Cleanup on component unmount
    return () => {
      socket.off("attendanceconversionProgress")
      socket.off("attendanceconversionComplete")
      socket.off("attendanceconversionError")
    }
  }, [])

  const handleDownloadFailedData = () => {
    if (nonsavedData.length > 0) {
      // Create a new workbook
      const workbook = XLSX.utils.book_new()

      // Convert failed data to sheet
      const worksheet = XLSX.utils.json_to_sheet(nonsavedData)

      // Append sheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Failed Data")

      // Generate Excel file and trigger download
      XLSX.writeFile(workbook, "failed_data.xlsx")
    }
  }

  return (
    <div className="w-full flex  justify-center items-center h-96">
      <div className=" w-2/6 mx-auto p-6   bg-gray-100 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">
          AttendanceExcel to JSON Conversion
        </h1>
        <input
          type="file"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {progress.total > 0 && (
          <div>
            <p className="text-blue-600 font-bold text-md">
              Uploaded {progress.current} of {progress.total}
            </p>
          </div>
        )}
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-2/5 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 mt-5"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        {message && (
          <div className={success ? "text-green-500" : "text-red-500"}>
            {message}
          </div>
        )}

        {nonsavedData.length > 0 && (
          <div className="mt-4 flex">
            <p className="text-red-400">{failMessage}</p>
            <button
              onClick={handleDownloadFailedData}
              className="bg-green-400 text-white py-2 px-2 rounded-lg hover:bg-green-500 transition-colors duration-300 text-sm"
            >
              Download Failed Data
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AttendanceExcelUploader
