// import { useState, useEffect } from "react"
// import ReportTable from "../../../components/primaryUser/ReportTable"
// import UseFetch from "../../../hooks/useFetch"

// export default function FollowupSummaryDashboard() {
//   const [date, setdate] = useState({
//     startDate: new Date().toLocaleDateString("en-CA"),
//     endDate: ""
//   })
//   const [data, setData] = useState([])
//   const { data: followup } = UseFetch(
//     date.startDate &&
//       date.endDate &&
//       `/lead/getfollowupsummaryReport?startDate=${date.startDate}&endDate=${date.endDate}`
//   )
//   useEffect(() => {
//     const endDate = new Date(
//       new Date().getFullYear(),
//       new Date().getMonth() + 1,
//       0
//     ).toLocaleDateString("en-CA")
//     setdate((prev) => ({
//       ...prev,
//       endDate
//     }))
//     console.log(new Date())
//     console.log(date)
//     console.log(endDate)
//   }, [])
//   useEffect(() => {
//     if (followup) {
//       console.log(followup)
//       setData(followup)
//     }
//   }, [followup])
//   console.log(date)
//   const headersName = [
//     "Staff",
//     "Total Leads",
//     "Due Today",
//     "Overdue",
//     "Future",
//     "Converted",
//     "Lost",
//     "Conversion %"
//   ]

//   console.log("jjjjjd")
//   return (
//     <div className="h-full bg-blue-50">

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
//         <div className="flex flex-col">
//           <label className="text-sm font-medium text-gray-600 mb-1">
//             Start Date
//           </label>
//           <input
//             type="date"
//             value={date.startDate}
//             onChange={(e) => console.log(e.target.value)}
//             className="px-3 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           />
//         </div>

//         <div className="flex flex-col">
//           <label className="text-sm font-medium text-gray-600 mb-1">
//             End Date
//           </label>
//           <input
//             type="date"
//             value={date.endDate}
//             className="px-3 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           />
//         </div>
//       </div>

//       <ReportTable
//         headers={headersName}
//         reportName="Follow-Up Summary"
//         data={data}
//       />
//     </div>
//   )
// }

import { useState, useEffect } from "react"
import ReportTable from "../../../components/primaryUser/ReportTable"
import UseFetch from "../../../hooks/useFetch"

export default function FollowupSummaryDashboard() {
  const [date, setdate] = useState({
    startDate: new Date().toLocaleDateString("en-CA"),
    endDate: ""
  })
  const [data, setData] = useState([])

  const { data: followup } = UseFetch(
    date.startDate &&
      date.endDate &&
      `/lead/getfollowupsummaryReport?startDate=${date.startDate}&endDate=${date.endDate}`
  )
  console.log(followup)

  // set end of current month once
  useEffect(() => {
    const now = new Date()
    const endDate = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).toLocaleDateString("en-CA")
    setdate((prev) => ({ ...prev, endDate }))
  }, [])

  useEffect(() => {
    if (followup) {
      setData(followup)
    }
  }, [followup])

  const headersName = [
    "Staff",
    "Total Leads",
    "Due Today",
    "Overdue",
    "Future",
    "Converted",
    "Lost",
    "Conversion %"
  ]

  const handleStartChange = (value) => {
    setdate((prev) => ({ ...prev, startDate: value }))
  }

  const handleEndChange = (value) => {
    setdate((prev) => ({ ...prev, endDate: value }))
  }

  return (
    // <div className="h-full bg-blue-50 flex flex-col">
    //   {/* Top header bar */}
    //   <div className="flex items-center justify-between px-6 py-3 bg-blue-50">
    //     <h1 className="text-lg font-bold text-gray-900">
    //       Follow‑Up Summary Report
    //     </h1>

    //     <div className="flex items-center gap-4">
    //       <div className="flex flex-col">
    //         <label className="text-xs font-medium text-gray-600 mb-0.5">
    //           Start Date
    //         </label>
    //         <input
    //           type="date"
    //           value={date.startDate}
    //           onChange={(e) => handleStartChange(e.target.value)}
    //           className="px-3 py-1 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    //         />
    //       </div>

    //       <div className="flex flex-col">
    //         <label className="text-xs font-medium text-gray-600 mb-0.5">
    //           End Date
    //         </label>
    //         <input
    //           type="date"
    //           value={date.endDate}
    //           onChange={(e) => handleEndChange(e.target.value)}
    //           className="px-3 py-1 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    //         />
    //       </div>
    //     </div>
    //   </div>

    //   {/* Table area */}
    //   <div className="flex-1 overflow-hidden">
    //     <ReportTable
    //       headers={headersName}
    //       reportName="Follow-Up Summary"
    //       data={data}
    //     />
    //   </div>
    // </div>
    <div className="h-full bg-blue-50 flex flex-col">
      {/* Top bar */}
      <div className="px-4 md:px-6 py-3 bg-blue-50 border-b border-blue-100">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Title */}
          <h1 className="text-lg md:text-xl font-bold text-gray-900">
            Follow‑Up Summary Report
          </h1>

          {/* Date range (Start / End) */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white rounded-lg px-3 py-1.5 shadow-sm border border-gray-200 flex flex-col">
              <label className="text-xs font-medium text-gray-600 mb-0.5">
                Start Date
              </label>
              <input
                type="date"
                value={date.startDate}
                onChange={(e) => handleStartChange(e.target.value)}
                className="px-2 py-1 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="bg-white rounded-lg px-3 py-1.5 shadow-sm border border-gray-200 flex flex-col">
              <label className="text-xs font-medium text-gray-600 mb-0.5">
                End Date
              </label>
              <input
                type="date"
                value={date.endDate}
                onChange={(e) => handleEndChange(e.target.value)}
                className="px-2 py-1 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table wrapper */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full px-3 md:px-6 pb-4">
          <div className="h-full bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <ReportTable
              headers={headersName}
              reportName="Follow-Up Summary"
              data={data}
            />
          </div>
        </div>
      </div>
    </div>
   
  )
}
