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

// import { useState, useEffect } from "react"
// import ReportTable from "../../../components/primaryUser/ReportTable"
// import UseFetch from "../../../hooks/useFetch"
// import { getLocalStorageItem } from "../../../helper/localstorage"

// export default function FollowupSummaryDashboard() {
//   const [date, setdate] = useState({
//     startDate: new Date().toLocaleDateString("en-CA"),
//     endDate: ""
//   })
//   const [data, setData] = useState([])
//   const [selectedBranch, setselectedBranch] = useState(null)
//   const [userbranches, setuserBranches] = useState([])

//   const { data: followup } = UseFetch(
//     date.startDate &&
//       date.endDate &&
//       `/lead/getfollowupsummaryReport?startDate=${date.startDate}&endDate=${date.endDate}`
//   )
//   console.log(followup)

//   // set end of current month once
//   useEffect(() => {
//     const now = new Date()
//     const endDate = new Date(
//       now.getFullYear(),
//       now.getMonth() + 1,
//       0
//     ).toLocaleDateString("en-CA")
//     setdate((prev) => ({ ...prev, endDate }))
//   }, [])
//   useEffect(() => {
//     const userData = getLocalStorageItem("user")
//     if (!userData?.selected?.length) return

//     setselectedBranch(userData.selected[0]?.branch_id)

//     const branches = userData.selected.map((branch) => ({
//       id: branch.branch_id,
//       branchName: branch.branchName
//     }))
//     setuserBranches(branches)
//   }, [])

//   useEffect(() => {
//     if (followup) {
//       setData(followup)
//     }
//   }, [followup])

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

//   const handleStartChange = (value) => {
//     setdate((prev) => ({ ...prev, startDate: value }))
//   }

//   const handleEndChange = (value) => {
//     setdate((prev) => ({ ...prev, endDate: value }))
//   }

//   return (
//     // <div className="h-full bg-blue-50 flex flex-col">
//     //   {/* Top header bar */}
//     //   <div className="flex items-center justify-between px-6 py-3 bg-blue-50">
//     //     <h1 className="text-lg font-bold text-gray-900">
//     //       Follow‑Up Summary Report
//     //     </h1>

//     //     <div className="flex items-center gap-4">
//     //       <div className="flex flex-col">
//     //         <label className="text-xs font-medium text-gray-600 mb-0.5">
//     //           Start Date
//     //         </label>
//     //         <input
//     //           type="date"
//     //           value={date.startDate}
//     //           onChange={(e) => handleStartChange(e.target.value)}
//     //           className="px-3 py-1 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//     //         />
//     //       </div>

//     //       <div className="flex flex-col">
//     //         <label className="text-xs font-medium text-gray-600 mb-0.5">
//     //           End Date
//     //         </label>
//     //         <input
//     //           type="date"
//     //           value={date.endDate}
//     //           onChange={(e) => handleEndChange(e.target.value)}
//     //           className="px-3 py-1 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//     //         />
//     //       </div>
//     //     </div>
//     //   </div>

//     //   {/* Table area */}
//     //   <div className="flex-1 overflow-hidden">
//     //     <ReportTable
//     //       headers={headersName}
//     //       reportName="Follow-Up Summary"
//     //       data={data}
//     //     />
//     //   </div>
//     // </div>
//     <div className="h-full bg-blue-50 flex flex-col">
//       {/* Top bar */}
//       <div className="px-4 md:px-6 py-3 bg-blue-50 border-b border-blue-100">
//         <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//           {/* Title */}
//           <h1 className="text-lg md:text-xl font-bold text-gray-900">
//             Follow‑Up Summary Report
//           </h1>
//           <div className="flex flex-wrap items-center gap-3 md:gap-4">
//             {/* Branch select */}
//             {/* <div className="flex flex-col gap-1">
//               <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
//                 Branch
//               </span>
//               <div className="relative ">
//                 <select
//                   value={selectedBranch || ""}
//                   onChange={(e) => setselectedBranch(e.target.value)}
//                   className="h-8 min-w-[150px] rounded-md border border-slate-300 bg-white cursor-pointer pr-7 pl-3 text-xs text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
//                 >
//                   {userbranches.map((b) => (
//                     <option key={b.id} value={b.id}>
//                       {b.branchName}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div> */}
//             <div className="flex flex-col gap-1">
//               <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
//                 Branch
//               </label>

//               <div className="relative inline-flex items-center">
//                 <select
//                   value={selectedBranch || ""}
//                   onChange={(e) => setselectedBranch(e.target.value)}
//                   className="h-9 min-w-[180px] rounded-md border border-slate-200 bg-white pr-9 pl-3 text-xs font-medium text-slate-800 shadow-sm
//                  outline-none transition-colors duration-150
//                  focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
//                  hover:border-slate-300 cursor-pointer appearance-none"
//                 >
//                   {userbranches.map((b) => (
//                     <option key={b.id} value={b.id}>
//                       {b.branchName}
//                     </option>
//                   ))}
//                 </select>

//                 {/* Chevron icon */}
//                 <span className="pointer-events-none absolute right-2.5 text-slate-400">
//                   <svg
//                     className="h-3.5 w-3.5"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     strokeWidth="1.8"
//                     stroke="currentColor"
//                   >
//                     <path
//                       d="M7 10l5 5 5-5"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>
//                 </span>
//               </div>
//             </div>

//             {/* Date range (Start / End) */}
//             {/* <div className="flex flex-wrap items-center gap-3">
//               <div className="bg-white rounded-lg px-3 py-1.5 shadow-sm border border-gray-200 flex flex-col">
//                 <label className="text-xs font-medium text-gray-600 mb-0.5">
//                   Start Date
//                 </label>
//                 <input
//                   type="date"
//                   value={date.startDate}
//                   onChange={(e) => handleStartChange(e.target.value)}
//                   className="px-2 py-1 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>

//               <div className="bg-white rounded-lg px-3 py-1.5 shadow-sm border border-gray-200 flex flex-col">
//                 <label className="text-xs font-medium text-gray-600 mb-0.5">
//                   End Date
//                 </label>
//                 <input
//                   type="date"
//                   value={date.endDate}
//                   onChange={(e) => handleEndChange(e.target.value)}
//                   className="px-2 py-1 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//             </div> */}
//             <div className="inline-flex items-center gap-3 rounded-xl bg-white px-3 py-2 shadow-sm border border-slate-200">
//               {/* Label + icon */}
//               <div className="flex items-center gap-2 pr-3 border-r border-slate-200">
//                 <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-slate-500">
//                   <svg
//                     className="h-4 w-4"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     strokeWidth="1.7"
//                     stroke="currentColor"
//                   >
//                     <rect x="3" y="4" width="18" height="17" rx="2" />
//                     <path d="M8 3v3M16 3v3M3 10h18" strokeLinecap="round" />
//                   </svg>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
//                     Date Range
//                   </span>
//                   <span className="text-[11px] text-slate-400">
//                     Filter reports by period
//                   </span>
//                 </div>
//               </div>

//               {/* Start date */}
//               <div className="flex flex-col gap-1">
//                 <span className="text-[11px] font-medium text-slate-500">
//                   From
//                 </span>
//                 <input
//                   type="date"
//                   value={date.startDate}
//                   onChange={(e) => handleStartChange(e.target.value)}
//                   className="h-8 rounded-md border border-slate-200 bg-slate-50 px-2 text-xs text-slate-800
//                  shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
//                 />
//               </div>

//               {/* End date */}
//               <div className="flex flex-col gap-1">
//                 <span className="text-[11px] font-medium text-slate-500">
//                   To
//                 </span>
//                 <input
//                   type="date"
//                   value={date.endDate}
//                   onChange={(e) => handleEndChange(e.target.value)}
//                   className="h-8 rounded-md border border-slate-200 bg-slate-50 px-2 text-xs text-slate-800
//                  shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Table wrapper */}
//       <div className="flex-1 overflow-hidden">
//         <div className="h-full px-3 md:px-6 pb-4">
//           <div className="h-full bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
//             <ReportTable
//               headers={headersName}
//               reportName="Follow-Up Summary"
//               data={data}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
// FollowupSummaryDashboard.jsx
import { useState, useEffect } from "react"
import ReportTable from "../../../components/primaryUser/ReportTable"
import UseFetch from "../../../hooks/useFetch"
import { getLocalStorageItem } from "../../../helper/localstorage"
import { useNavigate } from "react-router-dom"

export default function FollowupSummaryDashboard() {
  const navigate = useNavigate()

  const [date, setdate] = useState({
    startDate: new Date().toLocaleDateString("en-CA"),
    endDate: ""
  })
  const [data, setData] = useState([])
  const [selectedBranch, setselectedBranch] = useState(null)
  const [userbranches, setuserBranches] = useState([])

  const { data: followup } = UseFetch(
    date.startDate &&
      date.endDate &&
      selectedBranch &&
      `/lead/getfollowupsummaryReport?startDate=${date.startDate}&endDate=${date.endDate}&branchId=${selectedBranch}`
  )

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

  // branches
  useEffect(() => {
    const userData = getLocalStorageItem("user")
    if (!userData?.selected?.length) return

    setselectedBranch(userData.selected[0]?.branch_id)
    const branches = userData.selected.map((branch) => ({
      id: branch.branch_id,
      branchName: branch.branchName
    }))
    setuserBranches(branches)
  }, [])

  // followup data
  useEffect(() => {
    if (followup) {
console.log(followup)
const filteredbranchwisedata=followup.filter((item)=>item.branchIds.includes(selectedBranch))
console.log(filteredbranchwisedata)

      setData(filteredbranchwisedata)
    }
  }, [followup])
console.log(data)
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

  // navigation logic for metric cells
  const handleMetricClick = (row, header, key) => {
    // row has: staffName, leadCount, dueToday, overDue, future, converted, lost, leadid[]
    const staffName = row.staffName

    if (header === "Lost") {
      navigate("/lostleads", {
        state: {
          staffName,
          branchId: selectedBranch,
          startDate: date.startDate,
          endDate: date.endDate,
          count: row[key],
          leadIds: row.leadid
        }
      })
      return
    }

    // all others go to followup page
    navigate("/leadfollowup", {
      state: {
        staffName,
        branchId: selectedBranch,
        startDate: date.startDate,
        endDate: date.endDate,
        type: header, // "Total Leads", "Due Today", etc.
        count: row[key],
        leadIds: row.leadid
      }
    })
  }

  const handleStaffClick = (row) => {
    // you can later use this for staff drill-down if needed
    // example:
    // navigate("/staff-followup-summary", { state: { staffName: row.staffName, ... } });
  }

  return (
    <div className="h-full bg-blue-50 flex flex-col">
      {/* Top bar */}
      <div className="px-4 md:px-6 py-3 bg-blue-50 border-b border-blue-100">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Title */}
          <h1 className="text-lg md:text-xl font-bold text-gray-900">
            Follow‑Up Summary Report
          </h1>

          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            {/* Branch select */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Branch
              </label>

              <div className="relative inline-flex items-center">
                <select
                  value={selectedBranch || ""}
                  onChange={(e) => setselectedBranch(e.target.value)}
                  className="h-9 min-w-[180px] rounded-md border border-slate-200 bg-white pr-9 pl-3 text-xs font-medium text-slate-800 shadow-sm
                 outline-none transition-colors duration-150
                 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
                 hover:border-slate-300 cursor-pointer appearance-none"
                >
                  {userbranches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.branchName}
                    </option>
                  ))}
                </select>

                <span className="pointer-events-none absolute right-2.5 text-slate-400">
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="1.8"
                    stroke="currentColor"
                  >
                    <path
                      d="M7 10l5 5 5-5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </div>

            {/* Date range */}
            <div className="inline-flex items-center gap-3 rounded-xl bg-white px-3 py-2 shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 pr-3 border-r border-slate-200">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-slate-500">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="1.7"
                    stroke="currentColor"
                  >
                    <rect x="3" y="4" width="18" height="17" rx="2" />
                    <path d="M8 3v3M16 3v3M3 10h18" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Date Range
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Filter reports by period
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-medium text-slate-500">
                  From
                </span>
                <input
                  type="date"
                  value={date.startDate}
                  onChange={(e) => handleStartChange(e.target.value)}
                  className="h-8 rounded-md border border-slate-200 bg-slate-50 px-2 text-xs text-slate-800
                 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-medium text-slate-500">
                  To
                </span>
                <input
                  type="date"
                  value={date.endDate}
                  onChange={(e) => handleEndChange(e.target.value)}
                  className="h-8 rounded-md border border-slate-200 bg-slate-50 px-2 text-xs text-slate-800
                 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                />
              </div>
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
              onStaffClick={handleStaffClick}
              onMetricClick={handleMetricClick}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
