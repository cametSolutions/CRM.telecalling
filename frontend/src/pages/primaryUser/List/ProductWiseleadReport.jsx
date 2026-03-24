// import { useState, useEffect } from "react"
// import ReportTable from "../../../components/primaryUser/ReportTable"
// import { MonthRangePicker } from "../../../components/primaryUser/MonthRangePicker"

// import UseFetch from "../../../hooks/useFetch"
// export default function ProductWiseleadReport() {
//   const [filterRange, setFilterRange] = useState({
//     startDate: null,
//     endDate: null,
//     startMonth: "",
//     endMonth: "",
//     firstDay: null,
//     lastDay: null
//   })
//   const [data, setData] = useState([]) // Dynamic data
//   const [search, setsearch] = useState("")

//   const { data: report } = UseFetch(
//     filterRange.firstDay !== null &&
//       filterRange.lastDay !== null &&
//       `/lead/getallproductwisereport?startDate=${filterRange.firstDay}&endDate=${filterRange.lastDay}`
//   )
//   console.log(report)

//   console.log(filterRange)
//   const headersName = [
//     "Staff",
//     "Product",
//     "Total Leads",
//     "Converted",
//     "Lost",
//     "Pending",
//     "Total Value",
//     "Converted Value"
//   ]

//   // Mock data - replace with your API call
//   const mockData = [
//     {
//       Staff: "John Doe",
//       Product: "CRM Pro",
//       TotalLeads: 245,
//       Converted: 89,
//       Lost: 112,
//       Pending: 44,
//       TotalValue: "₹2,45,000",
//       ConvertedValue: "₹1,78,000"
//     },
//     {
//       Staff: "Jane Smith",
//       Product: "ERP Enterprise",
//       TotalLeads: 198,
//       Converted: 67,
//       Lost: 98,
//       Pending: 33,
//       TotalValue: "₹1,98,000",
//       ConvertedValue: "₹1,34,000"
//     }
//   ]
//   useEffect(() => {
//     if (report) {
//       setData(report) // Replace with API data
//     }
//   }, [report])

//   const handleDateRange = (range) => {
//     setFilterRange(range)
//     console.log("Filter range:", range)
//     // Fetch data from your Node.js API: /api/leads?start=${range.startDate}&end=${range.endDate}
//   }
//   const handleChange = (e) => {
//     console.log(e)
//     if (e === "") {
//       setData(report)
//       console.log(e)
//     }
//     console.log(data)
//     const filtered = report.filter((item) =>
//       item.staffName?.toLowerCase().includes(e.toLowerCase().trim())
//     )
//     console.log(filtered)

//     setData(filtered)
//     setsearch(e)
//   }
// console.log(data)
//   return (
//     <div className="h-full bg-gray-50 overflow-hidden items-center">
//       <div className="flex">
//         <MonthRangePicker onChange={handleDateRange} />
//         <div className="flex items-center w-96 px-4">
//           <input
//             type="text"
//             value={search}
//             onChange={(e) => handleChange(e.target.value)}
//             placeholder="Search..."
//             className="py-2 border border-gray-400 rounded-lg w-full px-4 "
//           />
//         </div>
//       </div>

//       <ReportTable
//         headers={headersName}
//         reportName={`Product-Wise Lead Report (${filterRange.startMonth} - ${filterRange.endMonth})`}
//         data={data}
//       />
//     </div>
//   )
// }

// import { useState, useEffect, useMemo } from "react"
// import { useNavigate } from "react-router-dom"
// import ReportTable from "../../../components/primaryUser/ReportTable"
// import { MonthRangePicker } from "../../../components/primaryUser/MonthRangePicker"
// import UseFetch from "../../../hooks/useFetch"

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
//   const [selectedStaff, setSelectedStaff] = useState(null) // for drill‑down
//   const navigate = useNavigate()

//   const { data: report } = UseFetch(
//     filterRange.firstDay &&
//       filterRange.lastDay &&
//       `/lead/getallproductwisereport?startDate=${filterRange.firstDay}&endDate=${filterRange.lastDay}`
//   )

//   useEffect(() => {
//     if (report) {
//       setData(report)
//       setSelectedStaff(null) // reset drill‑down when range changes
//     }
//   }, [report])

//   const handleDateRange = (range) => {
//     setFilterRange(range)
//   }

//   // Format dates for header right side
//   const formattedRange = useMemo(() => {
//     if (!filterRange.startMonth || !filterRange.endMonth) return ""
//     return `${filterRange.startMonth} – ${filterRange.endMonth}`
//   }, [filterRange.startMonth, filterRange.endMonth])

//   // When user clicks a staff name → drill‑down into that staff’s products
//   const handleStaffClick = (staffName) => {
//     setSelectedStaff(staffName)
//     // setViewMode("product")
//   }

//   // When user clicks Total Leads → navigate somewhere
//   const handleTotalLeadsClick = (row) => {
//     // adjust route & params as you need
//     navigate(
//       `/admin/reports/product-wise-detail?staff=${encodeURIComponent(
//         row.Staff
//       )}&product=${encodeURIComponent(row.Product || "")}`
//     )
//   }

//   const headersName = [
//     "Staff",
//     "Product",
//     "Total Leads",
//     "Converted",
//     "Lost",
//     "Pending",
//     "Total Value",
//     "Converted Value"
//   ]

//   // data for table when in product mode & a staff is selected
//   const effectiveData =
//     viewMode === "product" && selectedStaff
//       ? data.filter((row) => row.Staff === selectedStaff)
//       : data
// console.log(effectiveData)

//   return (
//     <div className="h-full bg-gray-50 flex flex-col">
//       {/* Top bar: title left, date + toggle right */}
//       <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
//         <h1 className="text-lg font-bold text-gray-900">
//           Product‑Wise Lead Report
//         </h1>

//         <div className="flex items-center gap-4">
//           {/* Date range text (right top) */}
//           <div className="text-xs text-gray-600">
//             {formattedRange && (
//               <>
//                 <span className="font-semibold text-gray-700 mr-1">
//                   Period:
//                 </span>
//                 <span>{formattedRange}</span>
//               </>
//             )}
//           </div>

//           {/* Month picker icon-only, but still functional */}
//           <MonthRangePicker onChange={handleDateRange} />

//           {/* Toggle: Staff / Product */}
//           <div className="flex items-center bg-gray-100 rounded-full p-1 text-xs font-medium">
//             <button
//               type="button"
//               onClick={() => {
//                 setViewMode("staff")
//                 setSelectedStaff(null)
//               }}
//               className={`px-3 py-1 rounded-full transition-colors ${
//                 viewMode === "staff"
//                   ? "bg-blue-600 text-white shadow-sm"
//                   : "text-gray-600"
//               }`}
//             >
//               Staff
//             </button>
//             <button
//               type="button"
//               onClick={() => setViewMode("product")}
//               disabled={!selectedStaff && viewMode === "staff"}
//               className={`px-3 py-1 rounded-full transition-colors ${
//                 viewMode === "product"
//                   ? "bg-blue-600 text-white shadow-sm"
//                   : "text-gray-600"
//               } ${
//                 !selectedStaff && viewMode === "staff"
//                   ? "opacity-40 cursor-not-allowed"
//                   : ""
//               }`}
//             >
//               Product
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="flex-1 overflow-hidden">
//         {/* <ReportTable
//           headers={headersName}
//           reportName={`Product‑Wise Lead Report`}
//           data={effectiveData}
//           mode={viewMode} // custom prop
//           selectedStaff={selectedStaff}
//           onStaffClick={handleStaffClick}
//           onTotalLeadsClick={handleTotalLeadsClick}
//         /> */}
//         <ReportTable
//           headers={headersName}
//           reportName="Product-Wise Lead Report"
//           data={effectiveData}
//           mode={viewMode}
//           selectedStaff={selectedStaff}
//           onStaffClick={handleStaffClick}
//           onTotalLeadsClick={handleTotalLeadsClick}
//         />
//       </div>
//     </div>
//   )
// }

// import { useState, useEffect, useMemo } from "react"
// import { useNavigate } from "react-router-dom"
// import ReportTable from "../../../components/primaryUser/ReportTable"
// import { MonthRangePicker } from "../../../components/primaryUser/MonthRangePicker"
// import UseFetch from "../../../hooks/useFetch"

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
//   const [selectedStaff, setSelectedStaff] = useState(null)
//   const [drillDown, setDrillDown] = useState(false)
//   const navigate = useNavigate()

//   const { data: report } = UseFetch(
//     filterRange.firstDay &&
//       filterRange.lastDay &&
//       `/lead/getallproductwisereport?startDate=${filterRange.firstDay}&endDate=${filterRange.lastDay}`
//   )
//   console.log(report)
//   useEffect(() => {
//     if (report) {
//       setData(report)
//       setSelectedStaff(null)
//       setDrillDown(false)
//       setViewMode("staff")
//     }
//   }, [report])

//   const headersName = [
//     "staffId",
//     "productId",
//     "branchId",
//     "Staff",
//     "Product",
//     "Total Leads",
//     "Converted",
//     "Lost",
//     "Pending",
//     "Total Value",
//     "Converted Value"
//   ]

//   const handleDateRange = (range) => {
//     setFilterRange(range)
//   }

//   const formattedRange = useMemo(() => {
//     if (!filterRange.startMonth || !filterRange.endMonth) return ""
//     return `${filterRange.startMonth} – ${filterRange.endMonth}`
//   }, [filterRange.startMonth, filterRange.endMonth])

//   const handleStaffClick = (staffName) => {
//     setSelectedStaff(staffName)
//     setDrillDown(true)
//     setViewMode("product")
//   }

//   const handleSeeAll = () => {
//     setSelectedStaff(null)
//     setDrillDown(false)
//     setViewMode("staff")
//   }

//   //   const handleTotalLeadsClick = (row,header) => {
//   //     console.log(row)
//   // console.log(row.totalPending)
//   // console.log(row.totalConverted)
//   // console.log(header)
//   // console.log(header==="Pending"?row.totalPending > 0:header==="Converted"?row?.totalConverted>0:row?.totalPending)

//   //     navigate("/admin/transaction/lead/leadFollowUp", {
//   //       state: {
//   //         staffId: row.staffId,
//   //         pending: header==="Pending"?row.totalPending > 0:header==="Converted"?row?.totalConverted>0:row?.totalPending,
//   //         productId: row.productId,
//   //         branchId: row.branch
//   //       }
//   //     })
//   //   }
//   const handleTotalLeadsClick = (row, header) => {
//     console.log(row)
// console.log(header)

//     // Only navigate for Converted when its count > 0
//     if (header === "Converted" && row.totalConverted <= 0) {
//       return
//     }

//     // You can add similar guards for other headers if needed
//     if (header === "Pending" && row.totalPending <= 0) {
//       return
//     }
//     if (header === "Lost" && row.totalLost <= 0) {
//       return
//     }
//     if (header === "Lost") {
//       navigate("/admin/transaction/lead/lostLeads", {
//         state: {
//           staffId: row.staffId,
//           productId: row.productId,
//           branchId: row.branch
//         }
//       })
//     } else {
//       navigate("/admin/transaction/lead/leadFollowUp", {
//         state: {
//           staffId: row.staffId,
//           pending: header === "Pending",
//           productId: row.productId,
//           branchId: row.branch
//         }
//       })
//     }
//   }

//   console.log(selectedStaff)
//   console.log(data)
//   const effectiveData =
//     drillDown && selectedStaff
//       ? data.filter(
//           (row) => row?.staffName?.toLowerCase() === selectedStaff.toLowerCase()
//         )
//       : data
//   console.log(effectiveData)

//   return (
//     // <div className="h-full bg-blue-50 flex flex-col">
//     //   {/* Top bar */}
//     //   <div className="flex items-center justify-between px-6 py-3 bg-blue-50 ">
//     //     <h1 className="text-lg font-bold text-gray-900">
//     //       Product‑Wise Lead Report
//     //     </h1>

//     //     <div className="flex items-center gap-4">

//     //       {/* Month picker */}
//     //       <MonthRangePicker onChange={handleDateRange} />

//     //       {/* Toggle */}
//     //       <div className="flex items-center bg-gray-100 rounded-full p-1 text-xs font-medium">
//     //         <button
//     //           type="button"
//     //           onClick={() => {
//     //             setViewMode("staff")
//     //             setSelectedStaff(null)
//     //             setDrillDown(false)
//     //           }}
//     //           className={`px-3 py-1 rounded-full transition-colors ${
//     //             viewMode === "staff" && !drillDown
//     //               ? "bg-blue-600 text-white shadow-sm"
//     //               : "text-gray-600"
//     //           }`}
//     //         >
//     //           Staff
//     //         </button>
//     //         <button
//     //           type="button"
//     //           onClick={() => setViewMode("product")}
//     //           className={`px-3 py-1 rounded-full transition-colors ${
//     //             viewMode === "product"
//     //               ? "bg-blue-600 text-white shadow-sm"
//     //               : "text-gray-600"
//     //           }`}
//     //         >
//     //           Product
//     //         </button>
//     //       </div>
//     //     </div>
//     //   </div>

//     //   {/* Table */}
//     //   <div className="flex-1 overflow-hidden">
//     //     <ReportTable
//     //       headers={headersName}
//     //       reportName="Product-Wise Lead Report"
//     //       data={effectiveData}
//     //       mode={viewMode}
//     //       selectedStaff={selectedStaff}
//     //       drillDown={drillDown}
//     //       onStaffClick={handleStaffClick}
//     //       onSeeAll={handleSeeAll}
//     //       onTotalLeadsClick={handleTotalLeadsClick}
//     //     />
//     //   </div>
//     // </div>
//     <div className="h-full bg-blue-50 flex flex-col">
//       {/* Top bar */}
//       <div className="px-4 md:px-6 py-3 bg-blue-50 border-b border-blue-100">
//         <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//           {/* Left: title */}
//           <h1 className="text-lg md:text-xl font-bold text-gray-900">
//             Product‑Wise Lead Report
//           </h1>

//           {/* Right: toggle + date range */}
//           <div className="flex flex-wrap items-center gap-3 md:gap-4">
//             {/* Toggle */}
//             <div className="flex items-center bg-white rounded-full px-1 py-0.5 text-xs font-medium shadow-sm border border-gray-200">
//               <button
//                 type="button"
//                 onClick={() => {
//                   setViewMode("staff")
//                   setSelectedStaff(null)
//                   setDrillDown(false)
//                 }}
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

//             {/* Start–End date (MonthRangePicker) */}
//             <div className="bg-white rounded-lg px-3 py-1.5 shadow-sm border border-gray-200 flex items-center">
//               <MonthRangePicker onChange={handleDateRange} />
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
//               reportName="Product-Wise Lead Report"
//               data={effectiveData}
//               mode={viewMode}
//               selectedStaff={selectedStaff}
//               drillDown={drillDown}
//               onStaffClick={handleStaffClick}
//               onSeeAll={handleSeeAll}
//               onTotalLeadsClick={handleTotalLeadsClick}
//             />
//           </div>
//         </div>
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

  const [data, setData] = useState([])
  const [viewMode, setViewMode] = useState("staff") // "staff" | "product"
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [drillDown, setDrillDown] = useState(false)

  const [userbranches, setuserBranches] = useState([])
  const [selectedBranch, setselectedBranch] = useState(null)

  const navigate = useNavigate()

  // get logged user branches from localStorage
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

  // API call – now includes branchId and date range
  const { data: report } = UseFetch(
    filterRange.firstDay &&
      filterRange.lastDay &&
      selectedBranch &&
      `/lead/getallproductwisereport?startDate=${filterRange.firstDay}&endDate=${filterRange.lastDay}&branchId=${selectedBranch}`
  )
  console.log(report)
  // aggregate per staff for initial view
  useEffect(() => {
    if (!report || !Array.isArray(report) || !selectedBranch) return

    // report rows expected with fields:
    // staffId, staffName, productId, productName, branch, totalLeads, totalConverted, totalPending, totalLost, totalValue, convertedValue, ...
    const staffMap = {}
console.log(report)
    report.forEach((row) => {
      if (String(row.branch) !== String(selectedBranch)) {
        return // acts like "continue" for this row
      }
      console.log(row)
      const staffKey = row.staffId
      if (!staffKey) return

      if (!staffMap[staffKey]) {
        staffMap[staffKey] = {
          staffId: row.staffId,
          staffRole: row.staffRole,
          productId: null,
          branchId: row.branch, // or row.branchId if your API uses that key
          Staff: row.staffName,
          Product: "",

          // numeric metrics initial
          totalLeads: 0,
          totalConverted: 0,
          totalLost: 0,
          totalPending: 0,
          totalValue: 0,
          convertedValue: 0
        }
      }

      staffMap[staffKey].totalLeads += Number(row.leadCount || 0)
      staffMap[staffKey].totalConverted += Number(row.totalConverted || 0)
      staffMap[staffKey].totalLost += Number(row.totalLost || 0)
      staffMap[staffKey].totalPending += Number(row.totalPending || 0)
      staffMap[staffKey].totalValue += Number(row.totalNetAmount || 0)
      staffMap[staffKey].convertedValue += Number(row.convertedNetAmount || 0)
    })

    const aggregatedStaffRows = Object.values(staffMap)
console.log(aggregatedStaffRows)
    setData(aggregatedStaffRows)
    setSelectedStaff(null)
    setDrillDown(false)
    setViewMode("staff")
  }, [report, selectedBranch])
  console.log(data)
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
    "Pending",
    "Total Value",
    "Converted Value"
  ]

  const handleDateRange = (range) => {
    setFilterRange(range)
  }

  const formattedRange = useMemo(() => {
    if (!filterRange.startMonth || !filterRange.endMonth) return ""
    return `${filterRange.startMonth} – ${filterRange.endMonth}`
  }, [filterRange.startMonth, filterRange.endMonth])

  const handleStaffClick = (staffName) => {
    if (!report) return

    setSelectedStaff(staffName)
    setDrillDown(true)
    setViewMode("product")

    // when drill‑down, switch data to product‑wise rows for that staff
    const filtered = report.filter(
      (row) => row?.staffName?.toLowerCase() === staffName.toLowerCase()
    )

    const mapped = filtered.map((row) => ({
      staffId: row.staffId,
      productId: row.productId,
      branchId: row.branch, // or row.branchId
      Staff: row.staffName,
      Product: row.productName,
      "Total Leads": Number(row.totalLeads || 0),
      Converted: Number(row.totalConverted || 0),
      Lost: Number(row.totalLost || 0),
      Pending: Number(row.totalPending || 0),
      "Total Value": Number(row.totalValue || 0),
      "Converted Value": Number(row.convertedValue || 0)
    }))

    setData(mapped)
  }

  const handleSeeAll = () => {
    setSelectedStaff(null)
    setDrillDown(false)
    setViewMode("staff")

    if (!report || !Array.isArray(report)) {
      setData([])
      return
    }

    // rebuild staff aggregation from report when coming back
    const staffMap = {}

    report.forEach((row) => {
      const staffKey = row.staffId
      if (!staffKey) return

      if (!staffMap[staffKey]) {
        staffMap[staffKey] = {
          staffId: row.staffId,
          productId: null,
          branchId: row.branch,
          Staff: row.staffName,
          Product: "",
          totalLeads: 0,
          totalConverted: 0,
          totalLost: 0,
          totalPending: 0,
          totalValue: 0,
          convertedValue: 0
        }
      }

      staffMap[staffKey].totalLeads += Number(row.totalLeads || 0)
      staffMap[staffKey].totalConverted += Number(row.totalConverted || 0)
      staffMap[staffKey].totalLost += Number(row.totalLost || 0)
      staffMap[staffKey].totalPending += Number(row.totalPending || 0)
      staffMap[staffKey].totalValue += Number(row.totalValue || 0)
      staffMap[staffKey].convertedValue += Number(row.convertedValue || 0)
    })

    const aggregatedStaffRows = Object.values(staffMap)
    setData(aggregatedStaffRows)
  }
console.log(drillDown)
  const handleTotalLeadsClick = (row, header) => {
    console.log(header)
    console.log(row)
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
console.log(header)
console.log(header==="Pending")
      navigate("/admin/transaction/lead/leadFollowUp", {
        state: {
          staffId: row.staffId,
          pending: header === "Pending",
          productId: row.productId,
          branchId: row.branchId,
          istotal:!drillDown,
          staffRole: row.staffRole
        }
      })
    }
  }

  // effectiveData is just data now, since aggregation/drill‑down is handled in setData
  const effectiveData = data

  return (
    <div className="h-full bg-[#ADD8E6] flex flex-col">
      {/* Top bar */}
      <div className="px-4 md:px-6 py-3 bg-[#ADD8E6] ">
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
              <div className="relative ">
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
                  viewMode === "staff" && !drillDown
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-600"
                }`}
              >
                Staff
              </button>
              <button
                type="button"
                onClick={() => setViewMode("product")}
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
