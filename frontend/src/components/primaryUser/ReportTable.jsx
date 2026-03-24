// // export default function ReportTable({ headers, reportName, data }) {
// // console.log(data)
// // console.log(headers)
// //   return (
// //     <div className="h-full overflow-hidden flex flex-col">
// //       <div className="px-6 py-4 bg-white border-b border-gray-200">
// //         <h2 className="text-xl font-bold text-gray-900">{reportName}</h2>
// //       </div>

// //       <div className="flex-1 overflow-hidden">
// //         <div className="h-full overflow-auto">
// //           <table className="w-full">
// //             <thead>
// //               <tr>
// //                 {headers.map((header, idx) => (
// //                   <th
// //                     key={idx}
// //                     className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider sticky top-0 z-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm"
// //                   >
// //                     {header}
// //                   </th>
// //                 ))}
// //               </tr>
// //             </thead>
// //             <tbody className="divide-y divide-gray-200 bg-white">
// //               {data.length === 0 ? (
// //                 <tr>
// //                   <td
// //                     colSpan={headers.length}
// //                     className="px-6 py-12 text-center text-gray-500 text-sm"
// //                   >
// //                     No data available for selected range
// //                   </td>
// //                 </tr>
// //               ) : (
// //                 data.map((row, rowIdx) => (
// //                   <tr
// //                     key={rowIdx}
// //                     className="hover:bg-blue-50 transition-colors"
// //                   >
// //                     {Object.values(row).map((cell, cellIdx) => (
// //                       <td
// //                         key={cellIdx}
// //                         className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-t border-gray-100"
// //                       >
// //                         {cell}
// //                       </td>
// //                     ))}
// //                   </tr>
// //                 ))
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// export default function ReportTable({
//   headers,
//   reportName,
//   data,
//   mode = "staff", // "staff" | "product"
//   selectedStaff,
//   drillDown = false, // true when viewing one staff’s details
//   onStaffClick,
//   onSeeAll,
//   onTotalLeadsClick
// }) {
//   const isProductWise =
//     reportName?.toLowerCase().includes("product-wise") ||
//     reportName?.toLowerCase().includes("product wise")
//   const isSalesfunnel = reportName?.toLowerCase().includes("sales funnel")
//   console.log(reportName)
//   console.log(isSalesfunnel)

//   const headerIndexMap = headers.reduce((acc, h, idx) => {
//     acc[h] = idx
//     return acc
//   }, {})

//   // Column visibility:
//   // - normal staff mode: hide Product
//   // - normal product mode: hide Staff
//   // - drillDown: show all columns

//   //const visibleHeaders = headers.filter((h) => {
//   //   if (!isProductWise) return true
//   //   if (!drillDown) {
//   //     if (mode === "staff" && h === "Product") return false
//   //     if (mode === "product" && h === "Staff") return false
//   //   }
//   //   return true
//   // })
//   // Which headers to show
//   const visibleHeaders = headers.filter((h) => {
//     console.log(h)
//     console.log("h")
//     console.log(isProductWise)
//     if (
//       isProductWise &&
//       (h === "staffId" || h === "productId" || h === "branchId")
//     )
//       return false // 👈 skip StaffId
//     console.log("h")

//     if (isProductWise && !drillDown) {
//       if (mode === "staff" && h === "Product") return false
//       if (mode === "product" && h === "Staff") return false
//     }
//     console.log("hh")
//     return true
//   })
//   console.log(visibleHeaders)
//   console.log(data)
//   return (

//     <div className="h-full flex flex-col bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
//       {/* Optional top bar (drilldown info + See all) */}
//       {(drillDown && selectedStaff) || (drillDown && onSeeAll) ? (
//         <div className="px-4 md:px-6 py-2 bg-slate-50 border-b border-gray-200 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             {drillDown && selectedStaff && (
//               <span className="text-xs md:text-sm text-gray-600">
//                 Viewing details for{" "}
//                 <span className="font-semibold text-blue-600">
//                   {selectedStaff}
//                 </span>
//               </span>
//             )}
//           </div>

//           {drillDown && onSeeAll && (
//             <button
//               type="button"
//               onClick={onSeeAll}
//               className="text-xs md:text-sm px-3 py-1 rounded-full border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition"
//             >
//               See all
//             </button>
//           )}
//         </div>
//       ) : null}

//       {/* Table area */}
//       <div className="flex-1 overflow-hidden">
//         <div className="h-full overflow-auto">
//           <table className="w-full text-sm">
//             <thead>
//               <tr>
//                 {visibleHeaders.map((header) => (
//                   <th
//                     key={header}
//                     className="px-4 md:px-6 py-2.5 md:py-3 text-left text-xs font-semibold uppercase tracking-wide sticky top-0 z-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm"
//                   >
//                     {header}
//                   </th>
//                 ))}
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-gray-100 bg-white">
//               {data.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={visibleHeaders.length}
//                     className="px-4 md:px-6 py-10 text-center text-gray-500 text-sm"
//                   >
//                     No data available for selected range
//                   </td>
//                 </tr>
//               ) : (
//                 data.map((row, rowIdx) => {
//                   const values = Object.values(row)

//                   return (
//                     <tr
//                       key={rowIdx}
//                       className="hover:bg-blue-50/60 transition-colors"
//                     >
//                       {visibleHeaders.map((header) => {
//                         const originalIndex = headerIndexMap[header]
//                         const cellValue = values[originalIndex]

//                         // Staff clickable (product-wise, staff view, not drilldown)
//                         if (
//                           isProductWise &&
//                           header === "Staff" &&
//                           mode === "staff" &&
//                           !drillDown &&
//                           onStaffClick
//                         ) {
//                           return (
//                             <td
//                               key={header}
//                               className="px-4 md:px-6 py-3 whitespace-nowrap text-sm text-blue-600 font-semibold cursor-pointer underline decoration-dotted"
//                               onClick={() =>
//                                 typeof cellValue === "string" &&
//                                 onStaffClick(cellValue)
//                               }
//                             >
//                               {cellValue}
//                             </td>
//                           )
//                         }

//                         // Product-wise clickable cells
//                         if (
//                           isProductWise &&
//                           [
//                             "Total Leads",
//                             "Converted",
//                             "Pending",
//                             "Lost"
//                           ].includes(header) &&
//                           onTotalLeadsClick
//                         ) {
//                           return (
//                             <td
//                               key={header}
//                               className="px-4 md:px-6 py-3 whitespace-nowrap text-sm text-indigo-600 font-semibold cursor-pointer"
//                               onClick={() => onTotalLeadsClick(row, header)}
//                             >
//                               {cellValue}
//                             </td>
//                           )
//                         }

//                         // Sales funnel Count clickable
//                         if (
//                           isSalesfunnel &&
//                           header === "Count" &&
//                           onTotalLeadsClick
//                         ) {
//                           return (
//                             <td
//                               key={header}
//                               className="px-4 md:px-6 py-3 whitespace-nowrap text-sm text-indigo-600 font-semibold cursor-pointer"
//                               onClick={() => onTotalLeadsClick(row, header)}
//                             >
//                               {cellValue}
//                             </td>
//                           )
//                         }

//                         // Default cell
//                         return (
//                           <td
//                             key={header}
//                             className="px-4 md:px-6 py-3 whitespace-nowrap text-sm text-gray-900"
//                           >
//                             {cellValue}
//                           </td>
//                         )
//                       })}
//                     </tr>
//                   )
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>

//   )
// }
// DataTable.jsx
// Props (same as before — drop-in replacement):
//   data, visibleHeaders, headerIndexMap,
//   isProductWise, isSalesfunnel, mode, drillDown,
//   selectedStaff, onSeeAll, onStaffClick, onTotalLeadsClick

// export default function ReportTable({
//   data = [],
//   visibleHeaders = [],
//   headerIndexMap = {},
//   isProductWise = false,
//   isSalesfunnel = false,
//   mode,
//   drillDown = false,
//   selectedStaff,
//   onSeeAll,
//   onStaffClick,
//   onTotalLeadsClick
// }) {
//   const CLICKABLE_COLS = ["Total Leads", "Converted", "Pending", "Lost"]

//   const getCellType = (header, row) => {
//     if (
//       isProductWise &&
//       header === "Staff" &&
//       mode === "staff" &&
//       !drillDown &&
//       onStaffClick
//     )
//       return "staff"
//     if (isProductWise && CLICKABLE_COLS.includes(header) && onTotalLeadsClick)
//       return "metric"
//     if (isSalesfunnel && header === "Count" && onTotalLeadsClick)
//       return "metric"
//     return "default"
//   }

//   const showTopBar = (drillDown && selectedStaff) || (drillDown && onSeeAll)
//   const isEmpty = data.length === 0

//   return (
//     <div
//       className="h-full flex flex-col rounded-2xl overflow-hidden"
//       style={{
//         background: "#fff",
//         boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.07)",
//         border: "1px solid #e8ecf0"
//       }}
//     >
//       {/* ── Drilldown top bar ── */}
//       {showTopBar && (
//         <div
//           className="flex items-center justify-between px-5 py-2.5"
//           style={{
//             background: "#f8fafc",
//             borderBottom: "1px solid #e8ecf0"
//           }}
//         >
//           {drillDown && selectedStaff && (
//             <div className="flex items-center gap-2">
//               <span
//                 className="inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-[10px] font-bold"
//                 style={{ background: "#3b5bdb" }}
//               >
//                 {selectedStaff.charAt(0).toUpperCase()}
//               </span>
//               <span className="text-xs text-gray-500">
//                 Viewing details for{" "}
//                 <span className="font-semibold text-gray-800">
//                   {selectedStaff}
//                 </span>
//               </span>
//             </div>
//           )}
//           {drillDown && onSeeAll && (
//             <button
//               type="button"
//               onClick={onSeeAll}
//               className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
//               style={{
//                 color: "#3b5bdb",
//                 background: "#eef2ff",
//                 border: "1px solid #c5d0fa"
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.background = "#e0e7ff"
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.background = "#eef2ff"
//               }}
//             >
//               <svg
//                 width="12"
//                 height="12"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2.5"
//               >
//                 <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
//               </svg>
//               See all
//             </button>
//           )}
//         </div>
//       )}

//       {/* ── Table area ── */}
//       <div className="flex-1 overflow-hidden">
//         <div className="h-full overflow-auto">
//           <table className="w-full text-sm border-collapse">
//             <thead>
//               <tr>
//                 {visibleHeaders.map((header, i) => (
//                   <th
//                     key={header}
//                     className="sticky top-0 z-20 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
//                     style={{
//                       background: i === 0 ? "#1e3a5f" : "#1e3a5f",
//                       color: "rgba(255,255,255,0.85)",
//                       borderRight:
//                         i < visibleHeaders.length - 1
//                           ? "1px solid rgba(255,255,255,0.08)"
//                           : "none",
//                       letterSpacing: "0.06em"
//                     }}
//                   >
//                     {header}
//                   </th>
//                 ))}
//               </tr>
//             </thead>

//             <tbody>
//               {isEmpty ? (
//                 <tr>
//                   <td
//                     colSpan={visibleHeaders.length}
//                     className="px-5 py-16 text-center"
//                   >
//                     <div className="flex flex-col items-center gap-3">
//                       <div
//                         className="w-12 h-12 rounded-2xl flex items-center justify-center"
//                         style={{ background: "#f1f3f5" }}
//                       >
//                         <svg
//                           width="22"
//                           height="22"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="#adb5bd"
//                           strokeWidth="1.5"
//                         >
//                           <rect x="3" y="3" width="18" height="18" rx="3" />
//                           <path d="M3 9h18M9 21V9" strokeLinecap="round" />
//                         </svg>
//                       </div>
//                       <span className="text-sm font-medium text-gray-400">
//                         No data available for selected range
//                       </span>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 data.map((row, rowIdx) => {
//                   const values = Object.values(row)
//                   const isEven = rowIdx % 2 === 0

//                   return (
//                     <tr
//                       key={rowIdx}
//                       style={{
//                         background: isEven ? "#fff" : "#f8fafc",
//                         transition: "background 0.12s"
//                       }}
//                       onMouseEnter={(e) => {
//                         e.currentTarget.style.background = "#eef2ff"
//                       }}
//                       onMouseLeave={(e) => {
//                         e.currentTarget.style.background = isEven
//                           ? "#fff"
//                           : "#f8fafc"
//                       }}
//                     >
//                       {visibleHeaders.map((header, colIdx) => {
//                         const originalIndex = headerIndexMap[header]
//                         const cellValue = values[originalIndex]
//                         const type = getCellType(header, row)
//                         const isLastCol = colIdx === visibleHeaders.length - 1

//                         const baseTd = {
//                           padding: "10px 20px",
//                           whiteSpace: "nowrap",
//                           fontSize: "13px",
//                           borderBottom: "1px solid #f1f3f5",
//                           borderRight: !isLastCol ? "1px solid #f1f3f5" : "none"
//                         }

//                         // Staff clickable
//                         if (type === "staff") {
//                           return (
//                             <td
//                               key={header}
//                               style={{ ...baseTd, cursor: "pointer" }}
//                               onClick={() =>
//                                 typeof cellValue === "string" &&
//                                 onStaffClick(cellValue)
//                               }
//                             >
//                               <span
//                                 className="inline-flex items-center gap-2 font-medium transition-colors"
//                                 style={{ color: "#3b5bdb" }}
//                                 onMouseEnter={(e) => {
//                                   e.currentTarget.style.color = "#1a3bbf"
//                                 }}
//                                 onMouseLeave={(e) => {
//                                   e.currentTarget.style.color = "#3b5bdb"
//                                 }}
//                               >
//                                 <span
//                                   className="w-6 h-6 rounded-full inline-flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
//                                   style={{ background: "#3b5bdb" }}
//                                 >
//                                   {String(cellValue).charAt(0).toUpperCase()}
//                                 </span>
//                                 {cellValue}
//                                 <svg
//                                   width="12"
//                                   height="12"
//                                   viewBox="0 0 24 24"
//                                   fill="none"
//                                   stroke="currentColor"
//                                   strokeWidth="2.5"
//                                 >
//                                   <path
//                                     d="M9 18l6-6-6-6"
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                   />
//                                 </svg>
//                               </span>
//                             </td>
//                           )
//                         }

//                         // Metric clickable
//                         if (type === "metric") {
//                           const colorMap = {
//                             "Total Leads": {
//                               bg: "#eef2ff",
//                               text: "#3b5bdb",
//                               dot: "#3b5bdb"
//                             },
//                             Converted: {
//                               bg: "#f0fdf4",
//                               text: "#15803d",
//                               dot: "#22c55e"
//                             },
//                             Pending: {
//                               bg: "#fffbeb",
//                               text: "#b45309",
//                               dot: "#f59e0b"
//                             },
//                             Lost: {
//                               bg: "#fff1f2",
//                               text: "#be123c",
//                               dot: "#f43f5e"
//                             },
//                             Count: {
//                               bg: "#eef2ff",
//                               text: "#3b5bdb",
//                               dot: "#3b5bdb"
//                             }
//                           }
//                           const colors = colorMap[header] || {
//                             bg: "#f8fafc",
//                             text: "#374151",
//                             dot: "#6b7280"
//                           }

//                           return (
//                             <td
//                               key={header}
//                               style={{ ...baseTd, cursor: "pointer" }}
//                               onClick={() => onTotalLeadsClick(row, header)}
//                             >
//                               <span
//                                 className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all"
//                                 style={{
//                                   background: colors.bg,
//                                   color: colors.text
//                                 }}
//                                 onMouseEnter={(e) => {
//                                   e.currentTarget.style.opacity = "0.75"
//                                 }}
//                                 onMouseLeave={(e) => {
//                                   e.currentTarget.style.opacity = "1"
//                                 }}
//                               >
//                                 <span
//                                   className="w-1.5 h-1.5 rounded-full flex-shrink-0"
//                                   style={{ background: colors.dot }}
//                                 />
//                                 {cellValue}
//                               </span>
//                             </td>
//                           )
//                         }

//                         // Default
//                         return (
//                           <td
//                             key={header}
//                             style={{
//                               ...baseTd,
//                               color: colIdx === 0 ? "#111827" : "#374151",
//                               fontWeight: colIdx === 0 ? "500" : "400"
//                             }}
//                           >
//                             {cellValue ?? "—"}
//                           </td>
//                         )
//                       })}
//                     </tr>
//                   )
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* ── Row count footer ── */}
//       {!isEmpty && (
//         <div
//           className="flex items-center justify-between px-5 py-2"
//           style={{
//             borderTop: "1px solid #e8ecf0",
//             background: "#f8fafc"
//           }}
//         >
//           <span className="text-xs text-gray-400">
//             <span className="font-medium text-gray-600">{data.length}</span>{" "}
//             {data.length === 1 ? "row" : "rows"}
//           </span>
//           <div className="flex items-center gap-1">
//             {Array.from({ length: Math.min(data.length, 5) }).map((_, i) => (
//               <span
//                 key={i}
//                 className="w-1 h-1 rounded-full"
//                 style={{ background: i === 0 ? "#3b5bdb" : "#d1d5db" }}
//               />
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default function ReportTable({
//   headers,
//   reportName,
//   data,
//   mode = "staff",
//   selectedStaff,
//   drillDown = false,
//   onStaffClick,
//   onSeeAll,
//   onTotalLeadsClick
// }) {
// console.log(selectedStaff)
// console.log(drillDown)
// console.log(data)
//   const isProductWise =
//     reportName?.toLowerCase().includes("product-wise") ||
//     reportName?.toLowerCase().includes("product wise")
//   const isSalesfunnel = reportName?.toLowerCase().includes("sales funnel")

//   const headerIndexMap = headers.reduce((acc, h, idx) => {
//     acc[h] = idx
//     return acc
//   }, {})

//   const visibleHeaders = headers.filter((h) => {
//     if (
//       isProductWise &&
//       (h === "staffId" || h === "productId" || h === "branchId"||h==="staffRole")
//     )
//       return false
//     if (isProductWise && !drillDown) {
//       if (mode === "staff" && h === "Product") return false
//       if (mode === "product" && h === "Staff") return false
//     }
//     return true
//   })

//   const METRIC_CONFIG = {
//     "Total Leads": {
//       bg: "#dbeafe",
//       text: "#1e40af",
//       border: "#93c5fd",
//       dot: "#3b82f6",
//       glow: "rgba(59,130,246,0.18)"
//     },
//     Converted: {
//       bg: "#dcfce7",
//       text: "#166534",
//       border: "#86efac",
//       dot: "#22c55e",
//       glow: "rgba(34,197,94,0.18)"
//     },
//     Pending: {
//       bg: "#fef9c3",
//       text: "#854d0e",
//       border: "#fde047",
//       dot: "#eab308",
//       glow: "rgba(234,179,8,0.18)"
//     },
//     Lost: {
//       bg: "#ffe4e6",
//       text: "#9f1239",
//       border: "#fda4af",
//       dot: "#f43f5e",
//       glow: "rgba(244,63,94,0.18)"
//     },
//     Count: {
//       bg: "#dbeafe",
//       text: "#1e40af",
//       border: "#93c5fd",
//       dot: "#3b82f6",
//       glow: "rgba(59,130,246,0.18)"
//     }
//   }

//   const AVATAR_GRADIENTS = [
//     "linear-gradient(135deg,#6366f1,#8b5cf6)",
//     "linear-gradient(135deg,#0ea5e9,#6366f1)",
//     "linear-gradient(135deg,#ec4899,#f43f5e)",
//     "linear-gradient(135deg,#14b8a6,#0ea5e9)",
//     "linear-gradient(135deg,#f59e0b,#ef4444)",
//     "linear-gradient(135deg,#84cc16,#14b8a6)"
//   ]

//   const getGradient = (name = "") =>
//     AVATAR_GRADIENTS[name.charCodeAt(0) % AVATAR_GRADIENTS.length]

//   const initials = (name = "") =>
//     name
//       .split(" ")
//       .slice(0, 2)
//       .map((w) => w[0] || "")
//       .join("")
//       .toUpperCase()

//   const getCellType = (header) => {
// console.log(header)
//     if (
//       isProductWise &&
//       header === "Staff" &&
//       mode === "staff" &&
//       !drillDown &&
//       onStaffClick
//     )
//       return "staff"
//     if (
//       isProductWise &&
//       ["Total Leads", "Converted", "Pending", "Lost"].includes(header) &&
//       onTotalLeadsClick
//     )
//       return "metric"
//     if (isSalesfunnel && header === "Count" && onTotalLeadsClick)
//       return "metric"
//     return "default"
//   }

//   const showTopBar = (drillDown && selectedStaff) || (drillDown && onSeeAll)
//   const footerMetrics = ["Total Leads", "Converted", "Pending", "Lost"].filter(
//     (m) => visibleHeaders.includes(m)
//   )

//   return (
//     <div
//       className="h-full flex flex-col overflow-hidden"
//       style={{
//         background: "#fff",
//         borderRadius: 18,
//         border: "1px solid #e2e8f0",
//         boxShadow:
//           "0 0 0 1px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.07), 0 32px 64px rgba(0,0,0,0.05)"
//       }}
//     >
//       {/* ══════════════ HEADER BAR ══════════════ */}
//       <div
//         className="flex-shrink-0 flex items-center justify-between gap-4"
//         style={{
//           padding: "14px 22px",
//           background:
//             "linear-gradient(130deg, #0c1e3d 0%, #1a3560 55%, #1e4480 100%)",
//           borderRadius: "18px 18px 0 0",
//           borderBottom: "1px solid rgba(255,255,255,0.07)"
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//           <div
//             style={{
//               width: 38,
//               height: 38,
//               borderRadius: 11,
//               background: "rgba(255,255,255,0.09)",
//               border: "1px solid rgba(255,255,255,0.14)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               flexShrink: 0
//             }}
//           >
//             <svg
//               width="17"
//               height="17"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="rgba(255,255,255,0.82)"
//               strokeWidth="1.8"
//             >
//               <rect x="3" y="3" width="18" height="18" rx="3" />
//               <path d="M3 9h18M9 21V9" strokeLinecap="round" />
//             </svg>
//           </div>
//           <div>
//             <div
//               style={{
//                 fontSize: 14,
//                 fontWeight: 700,
//                 color: "#f1f5f9",
//                 letterSpacing: "0.01em",
//                 lineHeight: 1.25
//               }}
//             >
//               {reportName || "Report"}
//             </div>
//             <div
//               style={{
//                 fontSize: 11,
//                 color: "rgba(255,255,255,0.38)",
//                 marginTop: 3
//               }}
//             >
//               {drillDown && selectedStaff
//                 ? `Drill-down — ${selectedStaff}`
//                 : `${data.length} ${data.length === 1 ? "record" : "records"}`}
//             </div>
//           </div>
//         </div>

//         {showTopBar && (
//           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//             {drillDown && selectedStaff && (
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 8,
//                   padding: "5px 12px 5px 6px",
//                   borderRadius: 99,
//                   background: "rgba(255,255,255,0.08)",
//                   border: "1px solid rgba(255,255,255,0.13)"
//                 }}
//               >
//                 <div
//                   style={{
//                     width: 24,
//                     height: 24,
//                     borderRadius: "50%",
//                     background: getGradient(selectedStaff),
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     fontSize: 9,
//                     fontWeight: 800,
//                     color: "#fff",
//                     flexShrink: 0,
//                     letterSpacing: "0.02em",
//                     boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
//                   }}
//                 >
//                   {initials(selectedStaff)}
//                 </div>
//                 <span
//                   style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}
//                 >
//                   {selectedStaff}
//                 </span>
//               </div>
//             )}

//             {drillDown && onSeeAll && (
//               <button
//                 type="button"
//                 onClick={onSeeAll}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 6,
//                   padding: "6px 14px",
//                   borderRadius: 99,
//                   fontSize: 11,
//                   fontWeight: 700,
//                   letterSpacing: "0.05em",
//                   color: "#7dd3fc",
//                   background: "rgba(56,189,248,0.12)",
//                   border: "1px solid rgba(56,189,248,0.28)",
//                   cursor: "pointer",
//                   transition: "background 0.15s"
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.background = "rgba(56,189,248,0.22)"
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.background = "rgba(56,189,248,0.12)"
//                 }}
//               >
//                 <svg
//                   width="11"
//                   height="11"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2.5"
//                 >
//                   <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
//                 </svg>
//                 SEE ALL
//               </button>
//             )}
//           </div>
//         )}
//       </div>

//       {/* ══════════════ TABLE ══════════════ */}
//       <div className="flex-1 overflow-hidden">
//         <div
//           className="h-full overflow-auto"
//           style={{
//             scrollbarWidth: "thin",
//             scrollbarColor: "#cbd5e1 transparent"
//           }}
//         >
//           <table
//             style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
//           >
//             <thead>
//               <tr>
//                 {visibleHeaders.map((header, i) => (
//                   <th
//                     key={header}
//                     style={{
//                       position: "sticky",
//                       top: 0,
//                       zIndex: 20,
//                       padding: "11px 18px",
//                       textAlign: "left",
//                       fontSize: 10.5,
//                       fontWeight: 700,
//                       letterSpacing: "0.08em",
//                       textTransform: "uppercase",
//                       color: "#64748b",
//                       background: "#f8fafc",
//                       borderBottom: "2px solid #e2e8f0",
//                       borderRight:
//                         i < visibleHeaders.length - 1
//                           ? "1px solid #f1f5f9"
//                           : "none",
//                       whiteSpace: "nowrap"
//                     }}
//                   >
//                     {header}
//                   </th>
//                 ))}
//               </tr>
//             </thead>

//             <tbody>
//               {data.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={visibleHeaders.length}
//                     style={{ padding: "72px 24px", textAlign: "center" }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "center",
//                         gap: 14
//                       }}
//                     >
//                       <div
//                         style={{
//                           width: 54,
//                           height: 54,
//                           borderRadius: 16,
//                           background: "linear-gradient(135deg,#f1f5f9,#e2e8f0)",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           boxShadow: "inset 0 1px 3px rgba(0,0,0,0.07)"
//                         }}
//                       >
//                         <svg
//                           width="24"
//                           height="24"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="#94a3b8"
//                           strokeWidth="1.5"
//                         >
//                           <rect x="3" y="3" width="18" height="18" rx="3" />
//                           <path d="M3 9h18M9 21V9" strokeLinecap="round" />
//                         </svg>
//                       </div>
//                       <div>
//                         <p
//                           style={{
//                             fontSize: 14,
//                             fontWeight: 700,
//                             color: "#374151",
//                             margin: 0
//                           }}
//                         >
//                           No records found
//                         </p>
//                         <p
//                           style={{
//                             fontSize: 12,
//                             color: "#9ca3af",
//                             marginTop: 5
//                           }}
//                         >
//                           No data available for the selected range
//                         </p>
//                       </div>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 data.map((row, rowIdx) => {
//                   const values = Object.values(row)
//                   const isEven = rowIdx % 2 === 0

//                   return (
//                     <tr
//                       key={rowIdx}
//                       style={{
//                         background: isEven ? "#ffffff" : "#fafbfd",
//                         transition: "background 0.1s"
//                       }}
//                       onMouseEnter={(e) => {
//                         e.currentTarget.style.background = "#eff6ff"
//                       }}
//                       onMouseLeave={(e) => {
//                         e.currentTarget.style.background = isEven
//                           ? "#ffffff"
//                           : "#fafbfd"
//                       }}
//                     >
//                       {visibleHeaders.map((header, colIdx) => {
//                         const originalIndex = headerIndexMap[header]
//                         const cellValue = values[originalIndex]
//                         const type = getCellType(header)
//                         const isFirst = colIdx === 0
//                         const isLast = colIdx === visibleHeaders.length - 1

//                         const baseTd = {
//                           padding: "11px 18px",
//                           borderBottom: "1px solid #f1f5f9",
//                           borderRight: !isLast ? "1px solid #f8fafc" : "none",
//                           verticalAlign: "middle",
//                           whiteSpace: "nowrap"
//                         }

//                         /* ── Staff clickable ── */
//                         if (type === "staff") {
//                           return (
//                             <td
//                               key={header}
//                               style={{ ...baseTd, cursor: "pointer" }}
//                               onClick={() =>
//                                 typeof cellValue === "string" &&
//                                 onStaffClick(cellValue)
//                               }
//                             >
//                               <div
//                                 style={{
//                                   display: "flex",
//                                   alignItems: "center",
//                                   gap: 9
//                                 }}
//                               >
//                                 <div
//                                   style={{
//                                     width: 30,
//                                     height: 30,
//                                     borderRadius: "50%",
//                                     background: getGradient(String(cellValue)),
//                                     display: "flex",
//                                     alignItems: "center",
//                                     justifyContent: "center",
//                                     fontSize: 10,
//                                     fontWeight: 800,
//                                     color: "#fff",
//                                     flexShrink: 0,
//                                     boxShadow: "0 2px 6px rgba(0,0,0,0.18)"
//                                   }}
//                                 >
//                                   {initials(String(cellValue))}
//                                 </div>
//                                 <span
//                                   style={{
//                                     fontSize: 13,
//                                     fontWeight: 600,
//                                     color: "#1d4ed8",
//                                     transition: "color 0.1s"
//                                   }}
//                                   onMouseEnter={(e) => {
//                                     e.currentTarget.style.color = "#1e3a8a"
//                                   }}
//                                   onMouseLeave={(e) => {
//                                     e.currentTarget.style.color = "#1d4ed8"
//                                   }}
//                                 >
//                                   {cellValue}
//                                 </span>
//                                 <svg
//                                   width="12"
//                                   height="12"
//                                   viewBox="0 0 24 24"
//                                   fill="none"
//                                   stroke="#93c5fd"
//                                   strokeWidth="2.5"
//                                 >
//                                   <path
//                                     d="M9 18l6-6-6-6"
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                   />
//                                 </svg>
//                               </div>
//                             </td>
//                           )
//                         }

//                         /* ── Metric pill ── */
//                         if (type === "metric") {
//                           const cfg = METRIC_CONFIG[header] || {
//                             bg: "#f8fafc",
//                             text: "#374151",
//                             border: "#e2e8f0",
//                             dot: "#94a3b8",
//                             glow: "transparent"
//                           }
//                           return (
//                             <td
//                               key={header}
//                               style={{ ...baseTd, cursor: "pointer" }}
//                               onClick={() => onTotalLeadsClick(row, header)}
//                             >
//                               <span
//                                 style={{
//                                   display: "inline-flex",
//                                   alignItems: "center",
//                                   gap: 6,
//                                   padding: "4px 11px 4px 8px",
//                                   borderRadius: 99,
//                                   background: cfg.bg,
//                                   color: cfg.text,
//                                   border: `1.5px solid ${cfg.border}`,
//                                   fontSize: 12,
//                                   fontWeight: 700,
//                                   boxShadow: `0 0 0 3px ${cfg.glow}`,
//                                   transition: "box-shadow 0.15s"
//                                 }}
//                                 onMouseEnter={(e) => {
//                                   e.currentTarget.style.boxShadow = `0 0 0 5px ${cfg.glow}`
//                                 }}
//                                 onMouseLeave={(e) => {
//                                   e.currentTarget.style.boxShadow = `0 0 0 3px ${cfg.glow}`
//                                 }}
//                               >
//                                 <span
//                                   style={{
//                                     width: 7,
//                                     height: 7,
//                                     borderRadius: "50%",
//                                     background: cfg.dot,
//                                     flexShrink: 0,
//                                     boxShadow: `0 0 4px ${cfg.dot}`
//                                   }}
//                                 />
//                                 {cellValue ?? "—"}
//                               </span>
//                             </td>
//                           )
//                         }

//                         /* ── Default ── */
//                         return (
//                           <td
//                             key={header}
//                             style={{
//                               ...baseTd,
//                               fontSize: 13,
//                               color: isFirst ? "#0f172a" : "#4b5563",
//                               fontWeight: isFirst ? 600 : 400
//                             }}
//                           >
//                             {cellValue ?? (
//                               <span style={{ color: "#d1d5db" }}>—</span>
//                             )}
//                           </td>
//                         )
//                       })}
//                     </tr>
//                   )
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* ══════════════ FOOTER ══════════════ */}
//       {data.length > 0 && (
//         <div
//           className="flex-shrink-0 flex items-center justify-between gap-4 flex-wrap"
//           style={{
//             padding: "9px 20px",
//             background: "#f8fafc",
//             borderTop: "1px solid #e2e8f0",
//             borderRadius: "0 0 18px 18px"
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
//             <div
//               style={{
//                 width: 6,
//                 height: 6,
//                 borderRadius: "50%",
//                 background: "linear-gradient(135deg,#3b82f6,#6366f1)"
//               }}
//             />
//             <span style={{ fontSize: 11, color: "#94a3b8" }}>
//               <span style={{ fontWeight: 700, color: "#334155" }}>
//                 {data.length}
//               </span>{" "}
//               {data.length === 1 ? "record" : "records"}
//             </span>
//           </div>

//           {footerMetrics.length > 0 && (
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 6,
//                 flexWrap: "wrap"
//               }}
//             >
//               {footerMetrics.map((m) => {
//                 const cfg = METRIC_CONFIG[m]
//                 return (
//                   <span
//                     key={m}
//                     style={{
//                       display: "inline-flex",
//                       alignItems: "center",
//                       gap: 5,
//                       fontSize: 10,
//                       fontWeight: 700,
//                       letterSpacing: "0.04em",
//                       color: cfg.text,
//                       background: cfg.bg,
//                       border: `1px solid ${cfg.border}`,
//                       borderRadius: 99,
//                       padding: "2px 9px 2px 7px"
//                     }}
//                   >
//                     <span
//                       style={{
//                         width: 5,
//                         height: 5,
//                         borderRadius: "50%",
//                         background: cfg.dot,
//                         flexShrink: 0
//                       }}
//                     />
//                     {m}
//                   </span>
//                 )
//               })}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   )
// // }
// export default function ReportTable({
//   headers,
//   reportName,
//   data,
//   mode = "staff",
//   selectedStaff,
//   drillDown = false,
//   onStaffClick,
//   onSeeAll,
//   onTotalLeadsClick
// }) {
//   const isProductWise =
//     reportName?.toLowerCase().includes("product-wise") ||
//     reportName?.toLowerCase().includes("product wise")
//   const isSalesfunnel = reportName?.toLowerCase().includes("sales funnel")

//   // Map header -> index in headers array (still used for ordering)
//   const headerIndexMap = headers.reduce((acc, h, idx) => {
//     acc[h] = idx
//     return acc
//   }, {})

//   // 1) visibleHeaders: in drillDown, always show Staff + Product
//   // const visibleHeaders = headers.filter((h) => {
//   //   if (
//   //     isProductWise &&
//   //     (h === "staffId" ||
//   //       h === "productId" ||
//   //       h === "branchId" ||
//   //       h === "staffRole")
//   //   )
//   //     return false

//   //   // In drillDown, do NOT hide Staff/Product columns
//   //   if (isProductWise && !drillDown) {
//   //     if (mode === "staff" && h === "Product") return false
//   //     if (mode === "product" && h === "Staff") return false
//   //   }
//   //   return true
//   // })
//   const visibleHeaders = headers.filter((h) => {
//     if (
//       isProductWise &&
//       (h === "staffId" ||
//         h === "productId" ||
//         h === "branchId" ||
//         h === "staffRole")
//     )
//       return false

//     // Summary view: hide Product/Staff depending on mode
//     if (isProductWise && !drillDown) {
//       if (mode === "staff" && h === "Product") return false
//       if (mode === "product" && h === "Staff") return false
//     }

//     // Drilldown: hide Staff column completely
//     if (drillDown && h === "Staff") return false

//     return true
//   })

//   const METRIC_CONFIG = {
//     "Total Leads": {
//       bg: "#dbeafe",
//       text: "#1e40af",
//       border: "#93c5fd",
//       dot: "#3b82f6",
//       glow: "rgba(59,130,246,0.18)"
//     },
//     Converted: {
//       bg: "#dcfce7",
//       text: "#166534",
//       border: "#86efac",
//       dot: "#22c55e",
//       glow: "rgba(34,197,94,0.18)"
//     },
//     Pending: {
//       bg: "#fef9c3",
//       text: "#854d0e",
//       border: "#fde047",
//       dot: "#eab308",
//       glow: "rgba(234,179,8,0.18)"
//     },
//     Lost: {
//       bg: "#ffe4e6",
//       text: "#9f1239",
//       border: "#fda4af",
//       dot: "#f43f5e",
//       glow: "rgba(244,63,94,0.18)"
//     },
//     Count: {
//       bg: "#dbeafe",
//       text: "#1e40af",
//       border: "#93c5fd",
//       dot: "#3b82f6",
//       glow: "rgba(59,130,246,0.18)"
//     }
//   }

//   const AVATAR_GRADIENTS = [
//     "linear-gradient(135deg,#6366f1,#8b5cf6)",
//     "linear-gradient(135deg,#0ea5e9,#6366f1)",
//     "linear-gradient(135deg,#ec4899,#f43f5e)",
//     "linear-gradient(135deg,#14b8a6,#0ea5e9)",
//     "linear-gradient(135deg,#f59e0b,#ef4444)",
//     "linear-gradient(135deg,#84cc16,#14b8a6)"
//   ]

//   const getGradient = (name = "") =>
//     AVATAR_GRADIENTS[name.charCodeAt(0) % AVATAR_GRADIENTS.length]

//   const initials = (name = "") =>
//     name
//       .split(" ")
//       .slice(0, 2)
//       .map((w) => w[0] || "")
//       .join("")
//       .toUpperCase()

//   // 2) explicit header -> field mapping for your data
//   const FIELD_MAP = {
//     Staff: "Staff",
//     Product: "Product",
//     "Total Leads": "totalLeads",
//     Converted: "totalConverted",
//     Pending: "totalPending",
//     Lost: "totalLost",
//     "Total Value": "totalValue",
//     "Converted Value": "convertedValue",
//     staffId: "staffId",
//     productId: "productId",
//     branchId: "branchId",
//     staffRole: "staffRole"
//   }

//   const getCellType = (header) => {
//     if (
//       isProductWise &&
//       header === "Staff" &&
//       mode === "staff" &&
//       !drillDown && // clickable only in summary view
//       onStaffClick
//     )
//       return "staff"
//     if (
//       isProductWise &&
//       ["Total Leads", "Converted", "Pending", "Lost"].includes(header) &&
//       onTotalLeadsClick
//     )
//       return "metric"
//     if (isSalesfunnel && header === "Count" && onTotalLeadsClick)
//       return "metric"
//     return "default"
//   }

//   const showTopBar = (drillDown && selectedStaff) || (drillDown && onSeeAll)
//   const footerMetrics = ["Total Leads", "Converted", "Pending", "Lost"].filter(
//     (m) => visibleHeaders.includes(m)
//   )

//   return (
//     <div
//       className="h-full flex flex-col overflow-hidden"
//       style={{
//         background: "#fff",
//         borderRadius: 18,
//         border: "1px solid #e2e8f0",
//         boxShadow:
//           "0 0 0 1px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.07), 0 32px 64px rgba(0,0,0,0.05)"
//       }}
//     >
//       {/* HEADER BAR */}
//       <div
//         className="flex-shrink-0 flex items-center justify-between gap-4"
//         style={{
//           padding: "14px 22px",
//           background:
//             "linear-gradient(130deg, #0c1e3d 0%, #1a3560 55%, #1e4480 100%)",
//           borderRadius: "18px 18px 0 0",
//           borderBottom: "1px solid rgba(255,255,255,0.07)"
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//           <div
//             style={{
//               width: 38,
//               height: 38,
//               borderRadius: 11,
//               background: "rgba(255,255,255,0.09)",
//               border: "1px solid rgba(255,255,255,0.14)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               flexShrink: 0
//             }}
//           >
//             <svg
//               width="17"
//               height="17"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="rgba(255,255,255,0.82)"
//               strokeWidth="1.8"
//             >
//               <rect x="3" y="3" width="18" height="18" rx="3" />
//               <path d="M3 9h18M9 21V9" strokeLinecap="round" />
//             </svg>
//           </div>
//           <div>
//             <div
//               style={{
//                 fontSize: 14,
//                 fontWeight: 700,
//                 color: "#f1f5f9",
//                 letterSpacing: "0.01em",
//                 lineHeight: 1.25
//               }}
//             >
//               {reportName || "Report"}
//             </div>
//             <div
//               style={{
//                 fontSize: 11,
//                 color: "rgba(255,255,255,0.38)",
//                 marginTop: 3
//               }}
//             >
//               {drillDown && selectedStaff
//                 ? `Drill-down — ${selectedStaff}`
//                 : `${data.length} ${data.length === 1 ? "record" : "records"}`}
//             </div>
//           </div>
//         </div>

//         {showTopBar && (
//           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//             {drillDown && selectedStaff && (
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 8,
//                   padding: "5px 12px 5px 6px",
//                   borderRadius: 99,
//                   background: "rgba(255,255,255,0.08)",
//                   border: "1px solid rgba(255,255,255,0.13)"
//                 }}
//               >
//                 <div
//                   style={{
//                     width: 24,
//                     height: 24,
//                     borderRadius: "50%",
//                     background: getGradient(selectedStaff),
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     fontSize: 9,
//                     fontWeight: 800,
//                     color: "#fff",
//                     flexShrink: 0,
//                     letterSpacing: "0.02em",
//                     boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
//                   }}
//                 >
//                   {initials(selectedStaff)}
//                 </div>
//                 <span
//                   style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}
//                 >
//                   {selectedStaff}
//                 </span>
//               </div>
//             )}

//             {drillDown && onSeeAll && (
//               <button
//                 type="button"
//                 onClick={onSeeAll}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 6,
//                   padding: "6px 14px",
//                   borderRadius: 99,
//                   fontSize: 11,
//                   fontWeight: 700,
//                   letterSpacing: "0.05em",
//                   color: "#7dd3fc",
//                   background: "rgba(56,189,248,0.12)",
//                   border: "1px solid rgba(56,189,248,0.28)",
//                   cursor: "pointer",
//                   transition: "background 0.15s"
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.background = "rgba(56,189,248,0.22)"
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.background = "rgba(56,189,248,0.12)"
//                 }}
//               >
//                 <svg
//                   width="11"
//                   height="11"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2.5"
//                 >
//                   <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
//                 </svg>
//                 SEE ALL
//               </button>
//             )}
//           </div>
//         )}
//       </div>

//       {/* TABLE */}
//       <div className="flex-1 overflow-hidden">
//         <div
//           className="h-full overflow-auto"
//           style={{
//             scrollbarWidth: "thin",
//             scrollbarColor: "#cbd5e1 transparent"
//           }}
//         >
//           <table
//             style={{
//               width: "100%",
//               borderCollapse: "collapse",
//               fontSize: 13
//             }}
//           >
//             <thead>
//               <tr>
//                 {visibleHeaders.map((header, i) => (
//                   <th
//                     key={header}
//                     style={{
//                       position: "sticky",
//                       top: 0,
//                       zIndex: 20,
//                       padding: "11px 18px",
//                       textAlign: "left",
//                       fontSize: 10.5,
//                       fontWeight: 700,
//                       letterSpacing: "0.08em",
//                       textTransform: "uppercase",
//                       color: "#64748b",
//                       background: "#f8fafc",
//                       borderBottom: "2px solid #e2e8f0",
//                       borderRight:
//                         i < visibleHeaders.length - 1
//                           ? "1px solid #f1f5f9"
//                           : "none",
//                       whiteSpace: "nowrap"
//                     }}
//                   >
//                     {header}
//                   </th>
//                 ))}
//               </tr>
//             </thead>

//             <tbody>
//               {data.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={visibleHeaders.length}
//                     style={{ padding: "72px 24px", textAlign: "center" }}
//                   >
//                     {/* empty state */}
//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "center",
//                         gap: 14
//                       }}
//                     >
//                       <div
//                         style={{
//                           width: 54,
//                           height: 54,
//                           borderRadius: 16,
//                           background: "linear-gradient(135deg,#f1f5f9,#e2e8f0)",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           boxShadow: "inset 0 1px 3px rgba(0,0,0,0.07)"
//                         }}
//                       >
//                         <svg
//                           width="24"
//                           height="24"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="#94a3b8"
//                           strokeWidth="1.5"
//                         >
//                           <rect x="3" y="3" width="18" height="18" rx="3" />
//                           <path d="M3 9h18M9 21V9" strokeLinecap="round" />
//                         </svg>
//                       </div>
//                       <div>
//                         <p
//                           style={{
//                             fontSize: 14,
//                             fontWeight: 700,
//                             color: "#374151",
//                             margin: 0
//                           }}
//                         >
//                           No records found
//                         </p>
//                         <p
//                           style={{
//                             fontSize: 12,
//                             color: "#9ca3af",
//                             marginTop: 5
//                           }}
//                         >
//                           No data available for the selected range
//                         </p>
//                       </div>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 data.map((row, rowIdx) => {
//                   const isEven = rowIdx % 2 === 0

//                   return (
//                     <tr
//                       key={rowIdx}
//                       style={{
//                         background: isEven ? "#ffffff" : "#fafbfd",
//                         transition: "background 0.1s"
//                       }}
//                       onMouseEnter={(e) => {
//                         e.currentTarget.style.background = "#eff6ff"
//                       }}
//                       onMouseLeave={(e) => {
//                         e.currentTarget.style.background = isEven
//                           ? "#ffffff"
//                           : "#fafbfd"
//                       }}
//                     >
//                       {visibleHeaders.map((header, colIdx) => {
//                         const fieldName = FIELD_MAP[header] ?? header
//                         const cellValue = row[fieldName]
//                         const type = getCellType(header)
//                         const isFirst = colIdx === 0
//                         const isLast = colIdx === visibleHeaders.length - 1

//                         const baseTd = {
//                           padding: "11px 18px",
//                           borderBottom: "1px solid #f1f5f9",
//                           borderRight: !isLast ? "1px solid #f8fafc" : "none",
//                           verticalAlign: "middle",
//                           whiteSpace: "nowrap"
//                         }

//                         // Staff clickable in summary view
//                         if (type === "staff") {
//                           return (
//                             <td
//                               key={header}
//                               style={{ ...baseTd, cursor: "pointer" }}
//                               onClick={() =>
//                                 typeof cellValue === "string" &&
//                                 onStaffClick(cellValue)
//                               }
//                             >
//                               <div
//                                 style={{
//                                   display: "flex",
//                                   alignItems: "center",
//                                   gap: 9
//                                 }}
//                               >
//                                 <div
//                                   style={{
//                                     width: 30,
//                                     height: 30,
//                                     borderRadius: "50%",
//                                     background: getGradient(String(cellValue)),
//                                     display: "flex",
//                                     alignItems: "center",
//                                     justifyContent: "center",
//                                     fontSize: 10,
//                                     fontWeight: 800,
//                                     color: "#fff",
//                                     flexShrink: 0,
//                                     boxShadow: "0 2px 6px rgba(0,0,0,0.18)"
//                                   }}
//                                 >
//                                   {initials(String(cellValue))}
//                                 </div>
//                                 <span
//                                   style={{
//                                     fontSize: 13,
//                                     fontWeight: 600,
//                                     color: "#1d4ed8",
//                                     transition: "color 0.1s"
//                                   }}
//                                   onMouseEnter={(e) => {
//                                     e.currentTarget.style.color = "#1e3a8a"
//                                   }}
//                                   onMouseLeave={(e) => {
//                                     e.currentTarget.style.color = "#1d4ed8"
//                                   }}
//                                 >
//                                   {cellValue}
//                                 </span>
//                                 <svg
//                                   width="12"
//                                   height="12"
//                                   viewBox="0 0 24 24"
//                                   fill="none"
//                                   stroke="#93c5fd"
//                                   strokeWidth="2.5"
//                                 >
//                                   <path
//                                     d="M9 18l6-6-6-6"
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                   />
//                                 </svg>
//                               </div>
//                             </td>
//                           )
//                         }

//                         // Metric clickable
//                         if (type === "metric") {
//                           const cfg = METRIC_CONFIG[header] || {
//                             bg: "#f8fafc",
//                             text: "#374151",
//                             border: "#e2e8f0",
//                             dot: "#94a3b8",
//                             glow: "transparent"
//                           }
//                           return (
//                             <td
//                               key={header}
//                               style={{ ...baseTd, cursor: "pointer" }}
//                               onClick={() => onTotalLeadsClick(row, header)}
//                             >
//                               <span
//                                 style={{
//                                   display: "inline-flex",
//                                   alignItems: "center",
//                                   gap: 6,
//                                   padding: "4px 11px 4px 8px",
//                                   borderRadius: 99,
//                                   background: cfg.bg,
//                                   color: cfg.text,
//                                   border: `1.5px solid ${cfg.border}`,
//                                   fontSize: 12,
//                                   fontWeight: 700,
//                                   boxShadow: `0 0 0 3px ${cfg.glow}`,
//                                   transition: "box-shadow 0.15s"
//                                 }}
//                                 onMouseEnter={(e) => {
//                                   e.currentTarget.style.boxShadow = `0 0 0 5px ${cfg.glow}`
//                                 }}
//                                 onMouseLeave={(e) => {
//                                   e.currentTarget.style.boxShadow = `0 0 0 3px ${cfg.glow}`
//                                 }}
//                               >
//                                 <span
//                                   style={{
//                                     width: 7,
//                                     height: 7,
//                                     borderRadius: "50%",
//                                     background: cfg.dot,
//                                     flexShrink: 0,
//                                     boxShadow: `0 0 4px ${cfg.dot}`
//                                   }}
//                                 />
//                                 {cellValue ?? "—"}
//                               </span>
//                             </td>
//                           )
//                         }

//                         // Default
//                         return (
//                           <td
//                             key={header}
//                             style={{
//                               ...baseTd,
//                               fontSize: 13,
//                               color: isFirst ? "#0f172a" : "#4b5563",
//                               fontWeight: isFirst ? 600 : 400
//                             }}
//                           >
//                             {cellValue ?? (
//                               <span style={{ color: "#d1d5db" }}>—</span>
//                             )}
//                           </td>
//                         )
//                       })}
//                     </tr>
//                   )
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* FOOTER */}
//       {data.length > 0 && (
//         <div
//           className="flex-shrink-0 flex items-center justify-between gap-4 flex-wrap"
//           style={{
//             padding: "9px 20px",
//             background: "#f8fafc",
//             borderTop: "1px solid #e2e8f0",
//             borderRadius: "0 0 18px 18px"
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
//             <div
//               style={{
//                 width: 6,
//                 height: 6,
//                 borderRadius: "50%",
//                 background: "linear-gradient(135deg,#3b82f6,#6366f1)"
//               }}
//             />
//             <span style={{ fontSize: 11, color: "#94a3b8" }}>
//               <span style={{ fontWeight: 700, color: "#334155" }}>
//                 {data.length}
//               </span>{" "}
//               {data.length === 1 ? "record" : "records"}
//             </span>
//           </div>

//           {footerMetrics.length > 0 && (
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 6,
//                 flexWrap: "wrap"
//               }}
//             >
//               {footerMetrics.map((m) => {
//                 const cfg = METRIC_CONFIG[m]
//                 return (
//                   <span
//                     key={m}
//                     style={{
//                       display: "inline-flex",
//                       alignItems: "center",
//                       gap: 5,
//                       fontSize: 10,
//                       fontWeight: 700,
//                       letterSpacing: "0.04em",
//                       color: cfg.text,
//                       background: cfg.bg,
//                       border: `1px solid ${cfg.border}`,
//                       borderRadius: 99,
//                       padding: "2px 9px 2px 7px"
//                     }}
//                   >
//                     <span
//                       style={{
//                         width: 5,
//                         height: 5,
//                         borderRadius: "50%",
//                         background: cfg.dot,
//                         flexShrink: 0
//                       }}
//                     />
//                     {m}
//                   </span>
//                 )
//               })}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }
export default function ReportTable({
  headers,
  reportName,
  data,
  mode = "staff",
  selectedStaff,
  drillDown = false,
  onStaffClick,
  onSeeAll,
  onTotalLeadsClick
}) {
  const isProductWise =
    reportName?.toLowerCase().includes("product-wise") ||
    reportName?.toLowerCase().includes("product wise")
  const isSalesfunnel = reportName?.toLowerCase().includes("sales funnel")

  const headerIndexMap = headers.reduce((acc, h, idx) => {
    acc[h] = idx
    return acc
  }, {})

  const visibleHeaders = headers.filter((h) => {
    if (
      isProductWise &&
      (h === "staffId" ||
        h === "productId" ||
        h === "branchId" ||
        h === "staffRole")
    )
      return false

    // Summary view: hide Product/Staff depending on mode
    if (isProductWise && !drillDown) {
      if (mode === "staff" && h === "Product") return false
      if (mode === "product" && h === "Staff") return false
    }

    // Drilldown: hide Staff column completely
    if (drillDown && h === "Staff") return false

    return true
  })

  const METRIC_CONFIG = {
    "Total Leads": {
      bg: "#dbeafe",
      text: "#1e40af",
      border: "#93c5fd",
      dot: "#3b82f6",
      glow: "rgba(59,130,246,0.18)"
    },
    Converted: {
      bg: "#dcfce7",
      text: "#166534",
      border: "#86efac",
      dot: "#22c55e",
      glow: "rgba(34,197,94,0.18)"
    },
    Pending: {
      bg: "#fef9c3",
      text: "#854d0e",
      border: "#fde047",
      dot: "#eab308",
      glow: "rgba(234,179,8,0.18)"
    },
    Lost: {
      bg: "#ffe4e6",
      text: "#9f1239",
      border: "#fda4af",
      dot: "#f43f5e",
      glow: "rgba(244,63,94,0.18)"
    },
    Count: {
      bg: "#dbeafe",
      text: "#1e40af",
      border: "#93c5fd",
      dot: "#3b82f6",
      glow: "rgba(59,130,246,0.18)"
    }
  }

  const AVATAR_GRADIENTS = [
    "linear-gradient(135deg,#6366f1,#8b5cf6)",
    "linear-gradient(135deg,#0ea5e9,#6366f1)",
    "linear-gradient(135deg,#ec4899,#f43f5e)",
    "linear-gradient(135deg,#14b8a6,#0ea5e9)",
    "linear-gradient(135deg,#f59e0b,#ef4444)",
    "linear-gradient(135deg,#84cc16,#14b8a6)"
  ]

  const getGradient = (name = "") =>
    AVATAR_GRADIENTS[name.charCodeAt(0) % AVATAR_GRADIENTS.length]

  const initials = (name = "") =>
    name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0] || "")
      .join("")
      .toUpperCase()

  const FIELD_MAP = {
    Staff: "Staff",
    Product: "Product",
    "Total Leads": "totalLeads",
    Converted: "totalConverted",
    Pending: "totalPending",
    Lost: "totalLost",
    "Total Value": "totalValue",
    "Converted Value": "convertedValue",
    staffId: "staffId",
    productId: "productId",
    branchId: "branchId",
    staffRole: "staffRole"
  }

  const getCellType = (header) => {
    if (
      isProductWise &&
      header === "Staff" &&
      mode === "staff" &&
      !drillDown &&
      onStaffClick
    )
      return "staff"
    if (
      isProductWise &&
      ["Total Leads", "Converted", "Pending", "Lost"].includes(header) &&
      onTotalLeadsClick
    )
      return "metric"
    if (isSalesfunnel && header === "Count" && onTotalLeadsClick)
      return "metric"
    return "default"
  }

  const showTopBar = (drillDown && selectedStaff) || (drillDown && onSeeAll)
  const footerMetrics = ["Total Leads", "Converted", "Pending", "Lost"].filter(
    (m) => visibleHeaders.includes(m)
  )

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{
        background: "#fff",
        borderRadius: 18,
        border: "1px solid #e2e8f0",
        boxShadow:
          "0 0 0 1px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.07), 0 32px 64px rgba(0,0,0,0.05)"
      }}
    >
      {/* HEADER BAR */}
      <div
        className="flex-shrink-0 flex items-center justify-between gap-4"
        style={{
          padding: "14px 22px",
          background:
            "linear-gradient(130deg, #0c1e3d 0%, #1a3560 55%, #1e4480 100%)",
          borderRadius: "18px 18px 0 0",
          borderBottom: "1px solid rgba(255,255,255,0.07)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 11,
              background: "rgba(255,255,255,0.09)",
              border: "1px solid rgba(255,255,255,0.14)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.82)"
              strokeWidth="1.8"
            >
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <path d="M3 9h18M9 21V9" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#f1f5f9",
                letterSpacing: "0.01em",
                lineHeight: 1.25
              }}
            >
              {reportName || "Report"}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.38)",
                marginTop: 3
              }}
            >
              {drillDown && selectedStaff
                ? `Drill-down — ${selectedStaff}`
                : `${data.length} ${
                    data.length === 1 ? "record" : "records"
                  }`}
            </div>
          </div>
        </div>

        {showTopBar && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {drillDown && selectedStaff && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "5px 12px 5px 6px",
                  borderRadius: 99,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.13)"
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: getGradient(selectedStaff),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 9,
                    fontWeight: 800,
                    color: "#fff",
                    flexShrink: 0,
                    letterSpacing: "0.02em",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
                  }}
                >
                  {initials(selectedStaff)}
                </div>
                <span
                  style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}
                >
                  {selectedStaff}
                </span>
              </div>
            )}

            {drillDown && onSeeAll && (
              <button
                type="button"
                onClick={onSeeAll}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  borderRadius: 99,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  color: "#7dd3fc",
                  background: "rgba(56,189,248,0.12)",
                  border: "1px solid rgba(56,189,248,0.28)",
                  cursor: "pointer",
                  transition: "background 0.15s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(56,189,248,0.22)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(56,189,248,0.12)"
                }}
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
                </svg>
                SEE ALL
              </button>
            )}
          </div>
        )}
      </div>

      {/* TABLE */}
      <div className="flex-1 overflow-hidden">
        <div
          className="h-full overflow-auto"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#cbd5e1 transparent"
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13
            }}
          >
            <thead>
              <tr>
                {visibleHeaders.map((header, i) => (
                  <th
                    key={header}
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 20,
                      padding: "11px 18px",
                      textAlign: "left",
                      fontSize: 10.5,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#64748b",
                      background: "#f8fafc",
                      borderBottom: "2px solid #e2e8f0",
                      borderRight:
                        i < visibleHeaders.length - 1
                          ? "1px solid #f1f5f9"
                          : "none",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleHeaders.length}
                    style={{ padding: "72px 24px", textAlign: "center" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 14
                      }}
                    >
                      <div
                        style={{
                          width: 54,
                          height: 54,
                          borderRadius: 16,
                          background:
                            "linear-gradient(135deg,#f1f5f9,#e2e8f0)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.07)"
                        }}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#94a3b8"
                          strokeWidth="1.5"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="3" />
                          <path d="M3 9h18M9 21V9" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#374151",
                            margin: 0
                          }}
                        >
                          No records found
                        </p>
                        <p
                          style={{
                            fontSize: 12,
                            color: "#9ca3af",
                            marginTop: 5
                          }}
                        >
                          No data available for the selected range
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((row, rowIdx) => {
                  const isEven = rowIdx % 2 === 0

                  return (
                    <tr
                      key={rowIdx}
                      style={{
                        background: isEven ? "#ffffff" : "#fafbfd",
                        transition: "background 0.1s"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#eff6ff"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = isEven
                          ? "#ffffff"
                          : "#fafbfd"
                      }}
                    >
                      {visibleHeaders.map((header, colIdx) => {
                        const fieldName = FIELD_MAP[header] ?? header
                        const cellValue = row[fieldName]
                        const type = getCellType(header)
                        const isFirst = colIdx === 0
                        const isLast =
                          colIdx === visibleHeaders.length - 1

                        const baseTd = {
                          padding: "11px 18px",
                          borderBottom: "1px solid #f1f5f9",
                          borderRight: !isLast
                            ? "1px solid #f8fafc"
                            : "none",
                          verticalAlign: "middle",
                          whiteSpace: "nowrap"
                        }

                        // Staff clickable (summary)
                        if (type === "staff") {
                          return (
                            <td
                              key={header}
                              style={{ ...baseTd, cursor: "pointer" }}
                              onClick={() =>
                                typeof cellValue === "string" &&
                                onStaffClick(cellValue)
                              }
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 9
                                }}
                              >
                                <div
                                  style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: "50%",
                                    background: getGradient(
                                      String(cellValue)
                                    ),
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 10,
                                    fontWeight: 800,
                                    color: "#fff",
                                    flexShrink: 0,
                                    boxShadow:
                                      "0 2px 6px rgba(0,0,0,0.18)"
                                  }}
                                >
                                  {initials(String(cellValue))}
                                </div>
                                <span
                                  style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: "#1d4ed8",
                                    transition: "color 0.1s"
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.color =
                                      "#1e3a8a"
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.color =
                                      "#1d4ed8"
                                  }}
                                >
                                  {cellValue}
                                </span>
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#93c5fd"
                                  strokeWidth="2.5"
                                >
                                  <path
                                    d="M9 18l6-6-6-6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                            </td>
                          )
                        }

                        // Metric clickable
                        if (type === "metric") {
                          const cfg = METRIC_CONFIG[header] || {
                            bg: "#f8fafc",
                            text: "#374151",
                            border: "#e2e8f0",
                            dot: "#94a3b8",
                            glow: "transparent"
                          }
                          return (
                            <td
                              key={header}
                              style={{ ...baseTd, cursor: "pointer" }}
                              onClick={() =>
                                onTotalLeadsClick(row, header)
                              }
                            >
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 6,
                                  padding: "4px 11px 4px 8px",
                                  borderRadius: 99,
                                  background: cfg.bg,
                                  color: cfg.text,
                                  border: `1.5px solid ${cfg.border}`,
                                  fontSize: 12,
                                  fontWeight: 700,
                                  boxShadow: `0 0 0 3px ${cfg.glow}`,
                                  transition: "box-shadow 0.15s"
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.boxShadow = `0 0 0 5px ${cfg.glow}`
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.boxShadow = `0 0 0 3px ${cfg.glow}`
                                }}
                              >
                                <span
                                  style={{
                                    width: 7,
                                    height: 7,
                                    borderRadius: "50%",
                                    background: cfg.dot,
                                    flexShrink: 0,
                                    boxShadow: `0 0 4px ${cfg.dot}`
                                  }}
                                />
                                {cellValue ?? "—"}
                              </span>
                            </td>
                          )
                        }

                        // Default
                        return (
                          <td
                            key={header}
                            style={{
                              ...baseTd,
                              fontSize: 13,
                              color: isFirst ? "#0f172a" : "#4b5563",
                              fontWeight: isFirst ? 600 : 400
                            }}
                          >
                            {cellValue ?? (
                              <span style={{ color: "#d1d5db" }}>—</span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER */}
      {data.length > 0 && (
        <div
          className="flex-shrink-0 flex items-center justify-between gap-4 flex-wrap"
          style={{
            padding: "9px 20px",
            background: "#f8fafc",
            borderTop: "1px solid #e2e8f0",
            borderRadius: "0 0 18px 18px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#3b82f6,#6366f1)"
              }}
            />
            <span style={{ fontSize: 11, color: "#94a3b8" }}>
              <span style={{ fontWeight: 700, color: "#334155" }}>
                {data.length}
              </span>{" "}
              {data.length === 1 ? "record" : "records"}
            </span>
          </div>

          {footerMetrics.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                flexWrap: "wrap"
              }}
            >
              {footerMetrics.map((m) => {
                const cfg = METRIC_CONFIG[m]
                return (
                  <span
                    key={m}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      color: cfg.text,
                      background: cfg.bg,
                      border: `1px solid ${cfg.border}`,
                      borderRadius: 99,
                      padding: "2px 9px 2px 7px"
                    }}
                  >
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: cfg.dot,
                        flexShrink: 0
                      }}
                    />
                    {m}
                  </span>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

