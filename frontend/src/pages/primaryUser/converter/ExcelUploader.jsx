import React, { useState } from "react"

const ExcelUploader = () => {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleUpload = async () => {
    setLoading(true)
    if (!file) {
      setMessage("Please select a file.")
      return
    }

    const formData = new FormData()
    formData.append("file", file)
    // https://www.crm.camet.in/api/excel/uploadExcel
    try {
      const response = await fetch(
        "http://localhost:9000/api/excel/uploadExcel",
        {
          method: "POST",
          body: formData
        }
      )

      if (response.ok) {
        setLoading(false)
        setMessage("File uploaded successfully!")
      } else {
        setMessage("File upload failed.")
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      setMessage("Error uploading file.")
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Upload Excel File
      </h2>

      <div className="mb-4">
        <input
          type="file"
          accept=".xls,.xlsx"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <button
        onClick={handleUpload}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
        disabled={loading}
      >
        {loading ? "Loading..." : "Upload"}
      </button>

      {message && <p className="mt-4 text-green-600 text-sm">{message}</p>}
    </div>
  )
}

export default ExcelUploader
