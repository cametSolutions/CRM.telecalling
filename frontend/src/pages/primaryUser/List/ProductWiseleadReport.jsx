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

import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import ReportTable from "../../../components/primaryUser/ReportTable"
import { MonthRangePicker } from "../../../components/primaryUser/MonthRangePicker"
import UseFetch from "../../../hooks/useFetch"

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
  const navigate = useNavigate()

  const { data: report } = UseFetch(
    filterRange.firstDay &&
      filterRange.lastDay &&
      `/lead/getallproductwisereport?startDate=${filterRange.firstDay}&endDate=${filterRange.lastDay}`
  )
  console.log(report)
  useEffect(() => {
    if (report) {
      setData(report)
      setSelectedStaff(null)
      setDrillDown(false)
      setViewMode("staff")
    }
  }, [report])

  const headersName = [
    "staffId",
    "productId",
    "branchId",
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
    setSelectedStaff(staffName)
    setDrillDown(true)
    setViewMode("product")
  }

  const handleSeeAll = () => {
    setSelectedStaff(null)
    setDrillDown(false)
    setViewMode("staff")
  }

  //   const handleTotalLeadsClick = (row,header) => {
  //     console.log(row)
  // console.log(row.totalPending)
  // console.log(row.totalConverted)
  // console.log(header)
  // console.log(header==="Pending"?row.totalPending > 0:header==="Converted"?row?.totalConverted>0:row?.totalPending)

  //     navigate("/admin/transaction/lead/leadFollowUp", {
  //       state: {
  //         staffId: row.staffId,
  //         pending: header==="Pending"?row.totalPending > 0:header==="Converted"?row?.totalConverted>0:row?.totalPending,
  //         productId: row.productId,
  //         branchId: row.branch
  //       }
  //     })
  //   }
  const handleTotalLeadsClick = (row, header) => {
    console.log(row)
console.log(header)

    // Only navigate for Converted when its count > 0
    if (header === "Converted" && row.totalConverted <= 0) {
      return
    }

    // You can add similar guards for other headers if needed
    if (header === "Pending" && row.totalPending <= 0) {
      return
    }
    if (header === "Lost" && row.totalLost <= 0) {
      return
    }
    if (header === "Lost") {
      navigate("/admin/transaction/lead/lostLeads", {
        state: {
          staffId: row.staffId,
          productId: row.productId,
          branchId: row.branch
        }
      })
    } else {
      navigate("/admin/transaction/lead/leadFollowUp", {
        state: {
          staffId: row.staffId,
          pending: header === "Pending",
          productId: row.productId,
          branchId: row.branch
        }
      })
    }
  }

  console.log(selectedStaff)
  console.log(data)
  const effectiveData =
    drillDown && selectedStaff
      ? data.filter(
          (row) => row?.staffName?.toLowerCase() === selectedStaff.toLowerCase()
        )
      : data
  console.log(effectiveData)

  return (
    // <div className="h-full bg-blue-50 flex flex-col">
    //   {/* Top bar */}
    //   <div className="flex items-center justify-between px-6 py-3 bg-blue-50 ">
    //     <h1 className="text-lg font-bold text-gray-900">
    //       Product‑Wise Lead Report
    //     </h1>

    //     <div className="flex items-center gap-4">

    //       {/* Month picker */}
    //       <MonthRangePicker onChange={handleDateRange} />

    //       {/* Toggle */}
    //       <div className="flex items-center bg-gray-100 rounded-full p-1 text-xs font-medium">
    //         <button
    //           type="button"
    //           onClick={() => {
    //             setViewMode("staff")
    //             setSelectedStaff(null)
    //             setDrillDown(false)
    //           }}
    //           className={`px-3 py-1 rounded-full transition-colors ${
    //             viewMode === "staff" && !drillDown
    //               ? "bg-blue-600 text-white shadow-sm"
    //               : "text-gray-600"
    //           }`}
    //         >
    //           Staff
    //         </button>
    //         <button
    //           type="button"
    //           onClick={() => setViewMode("product")}
    //           className={`px-3 py-1 rounded-full transition-colors ${
    //             viewMode === "product"
    //               ? "bg-blue-600 text-white shadow-sm"
    //               : "text-gray-600"
    //           }`}
    //         >
    //           Product
    //         </button>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Table */}
    //   <div className="flex-1 overflow-hidden">
    //     <ReportTable
    //       headers={headersName}
    //       reportName="Product-Wise Lead Report"
    //       data={effectiveData}
    //       mode={viewMode}
    //       selectedStaff={selectedStaff}
    //       drillDown={drillDown}
    //       onStaffClick={handleStaffClick}
    //       onSeeAll={handleSeeAll}
    //       onTotalLeadsClick={handleTotalLeadsClick}
    //     />
    //   </div>
    // </div>
    <div className="h-full bg-blue-50 flex flex-col">
      {/* Top bar */}
      <div className="px-4 md:px-6 py-3 bg-blue-50 border-b border-blue-100">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Left: title */}
          <h1 className="text-lg md:text-xl font-bold text-gray-900">
            Product‑Wise Lead Report
          </h1>

          {/* Right: toggle + date range */}
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            {/* Toggle */}
            <div className="flex items-center bg-white rounded-full px-1 py-0.5 text-xs font-medium shadow-sm border border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setViewMode("staff")
                  setSelectedStaff(null)
                  setDrillDown(false)
                }}
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

            {/* Start–End date (MonthRangePicker) */}
            <div className="bg-white rounded-lg px-3 py-1.5 shadow-sm border border-gray-200 flex items-center">
              <MonthRangePicker onChange={handleDateRange} />
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
      </div>
    </div>
  )
}
