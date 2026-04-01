// import { useState, useEffect, useMemo } from "react"
// import { useNavigate } from "react-router-dom"
// import ReportTable from "../../../components/primaryUser/ReportTable"
// import { MonthRangePicker } from "../../../components/primaryUser/MonthRangePicker"
// import UseFetch from "../../../hooks/useFetch"
// import { useSelector } from "react-redux"
// import { getLocalStorageItem } from "../../../helper/localstorage"

// export default function ProductWiseleadReport() {
//   const [filterRange, setFilterRange] = useState({
//     startDate: null,
//     endDate: null,
//     startMonth: "",
//     endMonth: "",
//     firstDay: null,
//     lastDay: null
//   })

//   const [data, setData] = useState([])

//   const [viewMode, setViewMode] = useState("staff") // "staff" | "product"
//   console.log(viewMode)
//   const [selectedStaff, setSelectedStaff] = useState(null)
//   const [drillDown, setDrillDown] = useState(false)

//   const [userbranches, setuserBranches] = useState([])
//   const [selectedBranch, setselectedBranch] = useState(null)

//   const navigate = useNavigate()

//   // get logged user branches from localStorage
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

//   // API call – now includes branchId and date range
//   const { data: report } = UseFetch(
//     filterRange.firstDay &&
//       filterRange.lastDay &&
//       selectedBranch &&
//       `/lead/getallproductwisereport?startDate=${filterRange.firstDay}&endDate=${filterRange.lastDay}&branchId=${selectedBranch}`
//   )
//   console.log(filterRange?.firstDay)
//   console.log(filterRange?.lastDay)
//   console.log(report?.mappeddata)
// const a=report?.mappeddata.filter((item)=>item.staffId==="67220ce51c400b86242fe178")
// console.log(a)
// console.log(report?.re)
//   // aggregate per staff for initial view
//   // useEffect(() => {
//   //   console.log(!report)

//   //   console.log(!report || !selectedBranch)
//   //   if (!report || !selectedBranch) return

//   //   // report rows expected with fields:
//   //   // staffId, staffName, productId, productName, branch, totalLeads, totalConverted, totalPending, totalLost, totalValue, convertedValue, ...
//   //   const staffMap = {}
//   //   console.log(report.mappeddata)

//   //   report.re.forEach((row) => {
//   //     if (String(row.branch) !== String(selectedBranch)) {
//   //       return // acts like "continue" for this row
//   //     }
//   //     console.log(row)
//   //     const staffKey = row.staffId
//   //     if (!staffKey) return

//   //     if (!staffMap[staffKey]) {
//   //       staffMap[staffKey] = {
//   //         staffId: row.staffId,
//   //         staffRole: row.staffRole,
//   //         productId: null,
//   //         branchId: row.branch, // or row.branchId if your API uses that key
//   //         Staff: row.staffName,
//   //         Product: "",

//   //         // numeric metrics initial
//   //         totalLeads: 0,
//   //         totalConverted: 0,
//   //         totalLost: 0,
//   //         totalPending: 0,
//   //         totalNetAmount: 0,
//   //         totalConvertedAmount: 0,
//   //         totalLostAmount: 0,
//   //         totalPendingAmount: 0
//   //       }
//   //     }

//   //     staffMap[staffKey].totalLeads += Number(row.leadCount || 0)
//   //     staffMap[staffKey].totalConverted += Number(row.totalConverted || 0)
//   //     staffMap[staffKey].totalLost += Number(row.totalLost || 0)
//   //     staffMap[staffKey].totalPending += Number(row.totalPending || 0)
//   //     // staffMap[staffKey].totalValue += Number(row.totalNetAmount || 0)
//   //     // staffMap[staffKey].convertedValue += Number(row.convertedNetAmount || 0)
//   //     staffMap[staffKey].totalNetAmount += Number(row.totalNetAmount || 0)
//   //     staffMap[staffKey].totalConvertedAmount += Number(
//   //       row.convertedNetAmount || 0
//   //     )

//   //     staffMap[staffKey].totalLostAmount += Number(row.lostNetAmount || 0)
//   //     staffMap[staffKey].totalPendingAmount += Number(
//   //       row.totalPendingAmount || 0
//   //     )
//   //   })

//   //   const aggregatedStaffRows = Object.values(staffMap)
//   //   console.log(aggregatedStaffRows)
//   //   setData(aggregatedStaffRows)
//   //   setSelectedStaff(null)
//   //   setDrillDown(false)
//   //   setViewMode("staff")
//   // }, [report, selectedBranch])
//   useEffect(() => {
//     if (!report || !selectedBranch) return

//     const rows = Array.isArray(report.re) ? report.re : []

//     const staffMap = {}

//     rows.forEach((row) => {
//       if (String(row.branch) !== String(selectedBranch)) return
//       const staffKey = row.staffId
//       if (!staffKey) return

//       if (!staffMap[staffKey]) {
//         staffMap[staffKey] = {
//           staffId: row.staffId,
//           staffRole: row.staffRole,
//           productId: null,
//           branchId: row.branch,
//           Staff: row.staffName,
//           Product: "",
//           totalLeads: 0,
//           totalConverted: 0,
//           totalLost: 0,
//           totalPending: 0,
//           totalNetAmount: 0,
//           totalConvertedAmount: 0,
//           totalLostAmount: 0,
//           totalPendingAmount: 0
//         }
//       }

//       staffMap[staffKey].totalLeads += Number(row.leadCount || 0)
//       staffMap[staffKey].totalConverted += Number(row.totalConverted || 0)
//       staffMap[staffKey].totalLost += Number(row.totalLost || 0)
//       staffMap[staffKey].totalPending += Number(row.totalPending || 0)
//       staffMap[staffKey].totalNetAmount += Number(row.totalNetAmount || 0)
//       staffMap[staffKey].totalConvertedAmount += Number(
//         row.convertedNetAmount || 0
//       )
//       staffMap[staffKey].totalLostAmount += Number(row.lostNetAmount || 0)
//       staffMap[staffKey].totalPendingAmount += Number(
//         row.totalPendingAmount || 0
//       )
//     })

//     setData(Object.values(staffMap))
//     setSelectedStaff(null)
//     setDrillDown(false)
//     setViewMode("staff")
//   }, [report, selectedBranch])
//   console.log(data)
//   const headersName = [
//     "staffId",
//     "productId",
//     "branchId",
//     "staffRole",
//     "Staff",
//     "Product",
//     "Total Leads",
//     "Converted",
//     "Lost",
//     "Pending"
//   ]

//   const handleDateRange = (range) => {
//     setFilterRange(range)
//   }

//   const formattedRange = useMemo(() => {
//     if (!filterRange.startMonth || !filterRange.endMonth) return ""
//     return `${filterRange.startMonth} – ${filterRange.endMonth}`
//   }, [filterRange.startMonth, filterRange.endMonth])

//   // const handleStaffClick = (staffName) => {
//   //   if (!report) return

//   //   setSelectedStaff(staffName)
//   //   setDrillDown(true)
//   //   setViewMode("product")

//   //   // when drill‑down, switch data to product‑wise rows for that staff
//   //   const filtered = report.filter(
//   //     (row) => row?.staffName?.toLowerCase() === staffName.toLowerCase()
//   //   )
//   //   console.log(filtered)
//   //   const mapped = filtered.map((row) => ({
//   //     staffId: row.staffId,
//   //     productId: row.productId,
//   //     branchId: row.branch, // or row.branchId
//   //     Staff: row.staffName,
//   //     Product: row.productName,
//   //     totalLeads: Number(row.leadCount || 0),
//   //     totalConverted: Number(row.totalConverted || 0),
//   //     totalLost: Number(row.totalLost || 0),
//   //     totalPending: Number(row.totalPending || 0),
//   //     totalValue: Number(row.totalNetAmount || 0),
//   //     convertedValue: Number(row.convertedNetAmount || 0)
//   //   }))

//   //   setData(mapped)
//   // }
//   const handleStaffClick = (staffName) => {
//     if (!report) return

//     const rows = Array.isArray(report.mappeddata) ? report.mappeddata : []

//     setSelectedStaff(staffName)
//     setDrillDown(true)
//     setViewMode("product")

//     const filtered = rows.filter(
//       (row) => row?.staffName?.toLowerCase() === staffName.toLowerCase()
//     )

//     const mapped = filtered.map((row) => ({
//       staffId: row.staffId,
//       productId: row.productId,
//       branchId: row.branch,
//       Staff: row.staffName,
//       Product: row.productName,
//       totalLeads: Number(row.leadCount || 0),
//       totalConverted: Number(row.totalConverted || 0),
//       totalLost: Number(row.totalLost || 0),
//       totalPending: Number(row.totalPending || 0),
//       totalNetAmount: Number(row.totalNetAmount || 0),
//       totalConvertedAmount: Number(row.convertedNetAmount || 0),
//       totalLostAmount: Number(row.lostNetAmount || 0),
//       totalPendingAmount: Number(row.totalPendingAmount || 0)
//     }))

//     setData(mapped)
//   }
//   console.log(data)
//   // const handleSeeAll = () => {
//   //   setSelectedStaff(null)
//   //   setDrillDown(false)
//   //   setViewMode("staff")

//   //   if (!report || !Array.isArray(report)) {
//   //     setData([])
//   //     return
//   //   }

//   //   // rebuild staff aggregation from report when coming back
//   //   const staffMap = {}
//   //   console.log(report)
//   //   report.forEach((row) => {
//   //     if (String(row.branch) !== String(selectedBranch)) {
//   //       return
//   //     }
//   //     const staffKey = row.staffId
//   //     if (!staffKey) return

//   //     if (!staffMap[staffKey]) {
//   //       staffMap[staffKey] = {
//   //         staffId: row.staffId,
//   //         productId: null,
//   //         branchId: row.branch,
//   //         Staff: row.staffName,
//   //         Product: "",
//   //         totalLeads: 0,
//   //         totalConverted: 0,
//   //         totalLost: 0,
//   //         totalPending: 0,
//   //         totalValue: 0,
//   //         convertedValue: 0
//   //       }
//   //     }

//   //     staffMap[staffKey].totalLeads += Number(row.leadCount || 0)
//   //     staffMap[staffKey].totalConverted += Number(row.totalConverted || 0)
//   //     staffMap[staffKey].totalLost += Number(row.totalLost || 0)
//   //     staffMap[staffKey].totalPending += Number(row.totalPending || 0)
//   //     staffMap[staffKey].totalValue += Number(row.totalNetAmount || 0)
//   //     staffMap[staffKey].convertedValue += Number(row.convertedNetAmount || 0)
//   //   })

//   //   const aggregatedStaffRows = Object.values(staffMap)
//   //   setData(aggregatedStaffRows)
//   // }
//   const handleSeeAll = () => {
//     setSelectedStaff(null)
//     setDrillDown(false)
//     setViewMode("staff")

//     if (!report) {
//       setData([])
//       return
//     }

//     const rows = Array.isArray(report.re) ? report.re : []
//     const staffMap = {}

//     rows.forEach((row) => {
//       if (String(row.branch) !== String(selectedBranch)) return
//       const staffKey = row.staffId
//       if (!staffKey) return

//       if (!staffMap[staffKey]) {
//         staffMap[staffKey] = {
//           staffId: row.staffId,
//           productId: null,
//           branchId: row.branch,
//           Staff: row.staffName,
//           Product: "",
//           totalLeads: 0,
//           totalConverted: 0,
//           totalLost: 0,
//           totalPending: 0,
//           totalNetAmount: 0,
//           totalConvertedAmount: 0,
//           totalLostAmount: 0,
//           totalPendingAmount: 0
//         }
//       }

//       staffMap[staffKey].totalLeads += Number(row.leadCount || 0)
//       staffMap[staffKey].totalConverted += Number(row.totalConverted || 0)
//       staffMap[staffKey].totalLost += Number(row.totalLost || 0)
//       staffMap[staffKey].totalPending += Number(row.totalPending || 0)
//       staffMap[staffKey].totalNetAmount += Number(row.totalNetAmount || 0)
//       staffMap[staffKey].totalConvertedAmount += Number(
//         row.convertedNetAmount || 0
//       )
//       staffMap[staffKey].totalLostAmount += Number(row.lostNetAmount || 0)
//       staffMap[staffKey].totalPendingAmount += Number(
//         row.totalPendingAmount || 0
//       )
//     })

//     setData(Object.values(staffMap))
//   }
//   console.log(drillDown)
//   const handleTotalLeadsClick = (row, header) => {
//     console.log(header)
//     console.log(row)
//     // Only navigate when there is positive count
//     if (header === "Converted" && row.totalConverted <= 0) return
//     if (header === "Pending" && row.totalPending <= 0) return
//     if (header === "Lost" && row.totalLost <= 0) return

//     if (header === "Lost") {
//       navigate("/admin/transaction/lead/lostLeads", {
//         state: {
//           staffId: row.staffId,
//           productId: row.productId,
//           branchId: row.branchId
//         }
//       })
//     } else {
//       console.log(viewMode)
//       console.log(header)
//       console.log(header === "Pending")
// console.log(row)
//       navigate("/admin/transaction/lead/leadFollowUp", {
//         state: {
//           staffId: row.staffId,
//           pending: header === "Pending"||(row.totalPending>0&&row.totalConverted===0) ||header !=="Converted",
//           productId: row.productId,
//           branchId: row.branchId,
//           viewMode,
//           istotal: !drillDown,
//           staffRole: row.staffRole
//         }
//       })
//     }
//   }

//   // effectiveData is just data now, since aggregation/drill‑down is handled in setData
//   const effectiveData = data

//   return (
//     <div className="h-full bg-[#ADD8E6] flex flex-col">
//       {/* Top bar */}
//       <div className="px-4 md:px-6 py-3 bg-[#ADD8E6] ">
//         <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//           {/* Left: title + range */}
//           <div className="flex flex-col gap-1">
//             <h1 className="text-lg md:text-xl font-bold text-gray-900">
//               Product‑Wise Lead Report
//             </h1>
//             {formattedRange && (
//               <p className="text-xs text-slate-500">
//                 Period{" "}
//                 <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
//                   {formattedRange}
//                 </span>
//               </p>
//             )}
//           </div>

//           {/* Right: branch + toggle + date range */}
//           <div className="flex flex-wrap items-center gap-3 md:gap-4">
//             {/* Branch select */}
//             <div className="flex flex-col gap-1">
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
//             </div>

//             {/* Toggle */}
//             <div className="flex items-center bg-white rounded-full px-1 py-0.5 text-xs font-medium shadow-sm border border-gray-200 mt-4">
//               <button
//                 type="button"
//                 onClick={handleSeeAll}
//                 className={`px-3 py-1 rounded-full transition-colors ${
//                   viewMode === "staff" && !drillDown
//                     ? "bg-blue-600 text-white shadow"
//                     : "text-gray-600"
//                 }`}
//               >
//                 Staff
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setViewMode("product")}
//                 className={`px-3 py-1 rounded-full transition-colors ${
//                   viewMode === "product"
//                     ? "bg-blue-600 text-white shadow"
//                     : "text-gray-600"
//                 }`}
//               >
//                 Product
//               </button>
//             </div>

//             {/* MonthRangePicker */}
//             <div className="bg-white rounded-lg px-3 py-1.5 shadow-sm border border-gray-200 flex items-center">
//               <MonthRangePicker onChange={handleDateRange} />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Table wrapper */}
//       <div className="flex-1 overflow-hidden mb-3 mx-3">
//         <ReportTable
//           headers={headersName}
//           reportName="Product-Wise Lead Report"
//           data={effectiveData}
//           mode={viewMode}
//           selectedStaff={selectedStaff}
//           drillDown={drillDown}
//           onStaffClick={handleStaffClick}
//           onSeeAll={handleSeeAll}
//           onTotalLeadsClick={handleTotalLeadsClick}
//         />
//       </div>
//     </div>
//   )
// }

import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import ReportTable from "../../../components/primaryUser/ReportTable"
import { MonthRangePicker } from "../../../components/primaryUser/MonthRangePicker"
import UseFetch from "../../../hooks/useFetch"
import { useSelector } from "react-redux"
import { getLocalStorageItem } from "../../../helper/localstorage"

export default function ProductWiseleadReport() {
  const [filterRange, setFilterRange] = useState({
    startDate: null,
    endDate: null,
    startMonth: "",
    endMonth: "",
    firstDay: null,
    lastDay: null
  })
  console.log(filterRange)
  const [data, setData] = useState([])
  const [viewMode, setViewMode] = useState("staff") // "staff" | "product"
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [drillDown, setDrillDown] = useState(false)
  const [userbranches, setuserBranches] = useState([])
  const [selectedBranch, setselectedBranch] = useState(null)

  const navigate = useNavigate()

  // Get logged user branches from localStorage
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

  // API call – includes branchId and date range
  const { data: report } = UseFetch(
    filterRange.firstDay &&
      filterRange.lastDay &&
      selectedBranch &&
      `/lead/getallproductwisereport?startDate=${filterRange.firstDay}&endDate=${filterRange.lastDay}&branchId=${selectedBranch}`
  )
  console.log(report?.re)
  // Aggregate staff data when report or branch changes
  useEffect(() => {
    if (!report || !selectedBranch) return

    const rows = Array.isArray(report.re) ? report.re : []
    const staffMap = {}
console.log(rows)
    rows.forEach((row) => {
      if (String(row.branch) !== String(selectedBranch)) return
      const staffKey = row.staffId
      if (!staffKey) return

      if (!staffMap[staffKey]) {
        staffMap[staffKey] = {
          staffId: row.staffId,
          staffRole: row.staffRole,
          productId: null,
          branchId: row.branch,
          Staff: row.staffName,
          Product: "",
          totalLeads: 0,
          totalConverted: 0,
          totalLost: 0,
          totalPending: 0,
          totalNetAmount: 0,
          totalConvertedAmount: 0,
          totalLostAmount: 0,
          totalPendingAmount: 0
        }
      }

      staffMap[staffKey].totalLeads += Number(row.leadCount || 0)
      staffMap[staffKey].totalConverted += Number(row.totalConverted || 0)
      staffMap[staffKey].totalLost += Number(row.totalLost || 0)
      staffMap[staffKey].totalPending += Number(row.totalPending || 0)
      staffMap[staffKey].totalNetAmount += Number(row.totalNetAmount || 0)
      staffMap[staffKey].totalConvertedAmount += Number(
        row.convertedNetAmount || 0
      )
      staffMap[staffKey].totalLostAmount += Number(row.lostNetAmount || 0)
      staffMap[staffKey].totalPendingAmount += Number(
        row.pendingNetAmount || 0
      )
    })

    setData(Object.values(staffMap))
    setSelectedStaff(null)
    setDrillDown(false)
    setViewMode("staff")
  }, [report, selectedBranch])

  const headersName = [
    "staffId",
    "productId",
    "branchId",
    "staffRole",
    "Staff",
    "Product",
    "Total Leads",
    "Converted",
    "Lost",
    "Pending"
  ]

  const handleDateRange = (range) => {
    setFilterRange(range)
  }

  const formattedRange = useMemo(() => {
    if (!filterRange.startMonth || !filterRange.endMonth) return ""
    return `${filterRange.startMonth} – ${filterRange.endMonth}`
  }, [filterRange.startMonth, filterRange.endMonth])

  // Handle staff click - drill down to product view
  const handleStaffClick = (staffName) => {
    if (!report) return

    const rows = Array.isArray(report.mappeddata) ? report.mappeddata : []

    setSelectedStaff(staffName)
    setDrillDown(true)
    setViewMode("product")

    const filtered = rows.filter(
      (row) => row?.staffName?.toLowerCase() === staffName.toLowerCase()
    )
    console.log(filtered)
    const mapped = filtered.map((row) => ({
      staffId: row.staffId,
      productId: row.productId,
      branchId: row.branch,
      staffRole: row.staffRole,
      Staff: row.staffName,
      Product: row.productName,
      totalLeads: Number(row.leadCount || 0),
      totalConverted: Number(row.totalConverted || 0),
      totalLost: Number(row.totalLost || 0),
      totalPending: Number(row.totalPending || 0),
      totalNetAmount: Number(row.totalNetAmount || 0),
      totalConvertedAmount: Number(row.convertedNetAmount || 0),
      totalLostAmount: Number(row.lostNetAmount || 0),
      totalPendingAmount: Number(row.totalPendingAmount || 0)
    }))

    setData(mapped)
  }

  // Handle "See All" - return to staff aggregated view
  const handleSeeAll = () => {
    setSelectedStaff(null)
    setDrillDown(false)
    setViewMode("staff")

    if (!report) {
      setData([])
      return
    }

    const rows = Array.isArray(report.re) ? report.re : []
    const staffMap = {}

    rows.forEach((row) => {
      if (String(row.branch) !== String(selectedBranch)) return
      const staffKey = row.staffId
      if (!staffKey) return

      if (!staffMap[staffKey]) {
        staffMap[staffKey] = {
          staffId: row.staffId,
          staffRole: row.staffRole,
          productId: null,
          branchId: row.branch,
          Staff: row.staffName,
          Product: "",
          totalLeads: 0,
          totalConverted: 0,
          totalLost: 0,
          totalPending: 0,
          totalNetAmount: 0,
          totalConvertedAmount: 0,
          totalLostAmount: 0,
          totalPendingAmount: 0
        }
      }

      staffMap[staffKey].totalLeads += Number(row.leadCount || 0)
      staffMap[staffKey].totalConverted += Number(row.totalConverted || 0)
      staffMap[staffKey].totalLost += Number(row.totalLost || 0)
      staffMap[staffKey].totalPending += Number(row.totalPending || 0)
      staffMap[staffKey].totalNetAmount += Number(row.totalNetAmount || 0)
      staffMap[staffKey].totalConvertedAmount += Number(
        row.convertedNetAmount || 0
      )
      staffMap[staffKey].totalLostAmount += Number(row.lostNetAmount || 0)
      staffMap[staffKey].totalPendingAmount += Number(
        row.totalPendingAmount || 0
      )
    })

    setData(Object.values(staffMap))
  }

  // Handle toggle switch to Product view (without drill-down)
  const handleProductToggle = () => {
    if (!report) return

    setSelectedStaff(null)
    setDrillDown(false)
    setViewMode("product")

    const rows = Array.isArray(report.mappeddata) ? report.mappeddata : []

    // Filter by selected branch and map to product view
    const productData = rows
      .filter((row) => String(row.branch) === String(selectedBranch))
      .map((row) => ({
        staffId: row.staffId,
        productId: row.productId,
        branchId: row.branch,
        staffRole: row.staffRole,
        Staff: row.staffName,
        Product: row.productName,
        totalLeads: Number(row.leadCount || 0),
        totalConverted: Number(row.totalConverted || 0),
        totalLost: Number(row.totalLost || 0),
        totalPending: Number(row.totalPending || 0),
        totalNetAmount: Number(row.totalNetAmount || 0),
        totalConvertedAmount: Number(row.convertedNetAmount || 0),
        totalLostAmount: Number(row.lostNetAmount || 0),
        totalPendingAmount: Number(row.totalPendingAmount || 0)
      }))

    setData(productData)
  }

  const handleTotalLeadsClick = (row, header) => {
    console.log(viewMode)
    console.log("hhh")
    // Only navigate when there is positive count
    if (header === "Converted" && row.totalConverted <= 0) return
    if (header === "Pending" && row.totalPending <= 0) return
    if (header === "Lost" && row.totalLost <= 0) return

    if (header === "Lost") {
      navigate("/admin/transaction/lead/lostLeads", {
        state: {
          staffId: row.staffId,
          productId: row.productId,
          branchId: row.branchId
        }
      })
    } else {
      console.log(row)
      console.log()
      console.log(header)
      console.log(
        header === "Pending" ||
          (row.totalPending > 0 && header !== "Converted") ||
          !row.totalConverted > 0
      )
      console.log(!row.totalConverted > 0)
      navigate("/admin/transaction/lead/leadFollowUp", {
        state: {
          staffId: row.staffId,
          pending:
            header === "Pending" ||
            (row.totalPending > 0 && header !== "Converted") ||
            !row.totalConverted > 0,
          productId: row.productId,
          branchId: row.branchId,
          viewMode,
          header,
          istotal: !drillDown,
          staffRole: row.staffRole,
          filterRange
        }
      })
    }
  }

  const effectiveData = data
console.log(data)
  return (
    <div className="h-full bg-[#ADD8E6] flex flex-col">
      {/* Top bar */}
      <div className="px-4 md:px-6 py-3 bg-[#ADD8E6]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Left: title + range */}
          <div className="flex flex-col gap-1">
            <h1 className="text-lg md:text-xl font-bold text-gray-900">
              Product‑Wise Lead Report
            </h1>
            {formattedRange && (
              <p className="text-xs text-slate-500">
                Period{" "}
                <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
                  {formattedRange}
                </span>
              </p>
            )}
          </div>

          {/* Right: branch + toggle + date range */}
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            {/* Branch select */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Branch
              </span>
              <div className="relative">
                <select
                  value={selectedBranch || ""}
                  onChange={(e) => setselectedBranch(e.target.value)}
                  className="h-8 min-w-[150px] rounded-md border border-slate-300 bg-white cursor-pointer pr-7 pl-3 text-xs text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                >
                  {userbranches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.branchName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Toggle */}
            <div className="flex items-center bg-white rounded-full px-1 py-0.5 text-xs font-medium shadow-sm border border-gray-200 mt-4">
              <button
                type="button"
                onClick={handleSeeAll}
                className={`px-3 py-1 rounded-full transition-colors ${
                  viewMode === "staff"
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-600"
                }`}
              >
                Staff
              </button>
              <button
                type="button"
                onClick={handleProductToggle}
                className={`px-3 py-1 rounded-full transition-colors ${
                  viewMode === "product"
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-600"
                }`}
              >
                Product
              </button>
            </div>

            {/* MonthRangePicker */}
            <div className="bg-white rounded-lg px-3 py-1.5 shadow-sm border border-gray-200 flex items-center">
              <MonthRangePicker onChange={handleDateRange} />
            </div>
          </div>
        </div>
      </div>

      {/* Table wrapper */}
      <div className="flex-1 overflow-hidden mb-3 mx-3">
        <ReportTable
          headers={headersName}
          reportName="Product-Wise Lead Report"
          data={effectiveData}
          mode={viewMode}
          selectedStaff={selectedStaff}
          drillDown={drillDown}
          onStaffClick={handleStaffClick}
          onSeeAll={handleSeeAll}
          onTotalLeadsClick={handleTotalLeadsClick}
        />
      </div>
    </div>
  )
}
