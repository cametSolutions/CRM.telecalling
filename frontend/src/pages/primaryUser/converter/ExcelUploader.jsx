// import React, { useState } from "react";
// import * as XLSX from "xlsx";

// const ExcelUploader = () => {
//   const [data, setData] = useState([]);

//   // Handle file upload
//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];

//     if (file) {
//       const reader = new FileReader();

//       reader.onload = (e) => {
//         const binaryStr = e.target.result;
//         const workbook = XLSX.read(binaryStr, { type: "binary" });

//         // Get the first sheet from the workbook
//         const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

//         // Convert sheet to JSON
//         const sheetData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

//         // Set the parsed data
//         setData(sheetData);
//       };

//       reader.readAsBinaryString(file);
//     }
//   };

//   return (
//     <div className="excel-uploader">
//       <h2>Upload Excel File</h2>
//       <input type="file" accept=".xls,.xlsx" onChange={handleFileUpload} />

//       {data.length > 0 && (
//         <table>
//           <thead>
//             <tr>
//               {data[0].map((col, index) => (
//                 <th key={index}>{col}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {data.slice(1).map((row, rowIndex) => (
//               <tr key={rowIndex}>
//                 {row.map((cell, cellIndex) => (
//                   <td key={cellIndex}>{cell}</td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default ExcelUploader;
import React, { useState } from "react"

const ExcelUploader = () => {
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState("")

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file.")
      return
    }
    console.log("files", file)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch(
        "https://www.crm.camet.in/api",
        {
          method: "POST",
          body: formData
        }
      )

      if (response.ok) {
        setMessage("File uploaded successfullydddd!")
      } else {
        setMessage("File upload failed.")
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      setMessage("Error uploading file.")
    }
  }

  return (
    // <div>
    //   <h2>Upload Excel File</h2>
    //   <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} />
    //   <button onClick={handleUpload}>Upload</button>
    //   <p>{message}</p>
    // </div>
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
      >
        Upload
      </button>

      {message && <p className="mt-4 text-green-600 text-sm">{message}</p>}
    </div>
  )
}

export default ExcelUploader
