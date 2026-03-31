// ///newly componet code//
// export default function ReportTable({
//   reportName,
//   data,
//   mode = "staff",
//   selectedStaff,
//   drillDown = false,
//   onStaffClick,
//   onSeeAll,
//   onTotalLeadsClick
// }) {
// console.log(data)
//   console.log("ReportTable data:", data)

//   const isProductWise =
//     reportName?.toLowerCase().includes("product-wise") ||
//     reportName?.toLowerCase().includes("product wise")
//   const isSalesfunnel = reportName?.toLowerCase().includes("sales funnel")

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
//     AVATAR_GRADIENTS[Math.abs(name.charCodeAt(0)) % AVATAR_GRADIENTS.length]

//   const initials = (name = "") =>
//     name
//       .split(" ")
//       .slice(0, 2)
//       .map((w) => w[0] || "")
//       .join("")
//       .toUpperCase()

//   // 1) Build columns from data keys
//   const rawColumns =
//     data && data.length > 0
//       ? Object.keys(data[0]).map((key) => ({

//           header: key,
//           accessor: key
//         }))
//       : []

//   // 2) Apply special types based on header name
//   const columns = rawColumns.map((col) => {
//     const h = col.header
//     if (["Staff", "staffName"].includes(h)) {
//       return { ...col, type: "staff" }
//     }
//     if (
//       [
//         "Total Leads",
//         "totalLeads",
//         "leadCount",
//         "Converted",
//         "Pending",
//         "Lost",
//         "Count"
//       ].includes(h)
//     ) {
//       return { ...col, type: "metric" }
//     }
//     return col
//   })

//   const getCellType = (col) => {
// console.log(col)
//     if (
//       isProductWise &&
//       col.type === "staff" &&
//       mode === "staff" &&
//       !drillDown &&
//       onStaffClick
//     )
//       return "staff"

//     if (
//       isProductWise &&
//       ["Total Leads", "Converted", "Pending", "Lost"].includes(col.header) &&
//       onTotalLeadsClick
//     )
//       return "metric"

//     if (isSalesfunnel && col.header === "Count" && onTotalLeadsClick)
//       return "metric"

//     if (col.type) return col.type
//     return "default"
//   }
// console.log(columns)
//   // 3) Product-wise visibility logic based on header text
//   const visibleColumns = columns.filter((col) => {
//     const h = col.header
// console.log(h)
//     if (!isProductWise) return true

//     // hide internal ids for product-wise
//     if (["staffId", "productId", "branchId"].includes(h)) return false

//     if (!drillDown) {
//       if (mode === "staff" && h === "Product") return false
//       if (mode === "product" && h === "Staff") return false
//     }
//     return true
//   })
// console.log(visibleColumns)

//   const showTopBar = (drillDown && selectedStaff) || (drillDown && onSeeAll)

//   const footerMetrics = ["Total Leads", "Converted", "Pending", "Lost"].filter(
//     (m) => visibleColumns.some((c) => c.header === m)
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
//                   style={{
//                     fontSize: 12,
//                     fontWeight: 600,
//                     color: "#e2e8f0"
//                   }}
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
//                 {visibleColumns.map((col, i) => (
//                   <th
//                     key={col.header || i}
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
//                         i < visibleColumns.length - 1
//                           ? "1px solid #f1f5f9"
//                           : "none",
//                       whiteSpace: "nowrap"
//                     }}
//                   >
//                     {col.header}
//                   </th>
//                 ))}
//               </tr>
//             </thead>

//             <tbody>
//               {data.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={visibleColumns.length || 1}
//                     style={{ padding: "72px 24px", textAlign: "center" }}
//                   >
//                     No records found
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
//                       {visibleColumns.map((col, colIdx) => {
//                         const isFirst = colIdx === 0
//                         const isLast = colIdx === visibleColumns.length - 1

//                         const baseTd = {
//                           padding: "11px 18px",
//                           borderBottom: "1px solid #f1f5f9",
//                           borderRight: !isLast ? "1px solid #f8fafc" : "none",
//                           verticalAlign: "middle",
//                           whiteSpace: "nowrap"
//                         }

//                         const value = row[col.accessor]

//                         const type = getCellType(col)

//                         if (type === "staff") {
//                           const name = String(value || "")
//                           return (
//                             <td
//                               key={col.header || colIdx}
//                               style={{ ...baseTd, cursor: "pointer" }}
//                               onClick={() =>
//                                 typeof name === "string" && onStaffClick?.(name)
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
//                                     background: getGradient(name),
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
//                                   {initials(name)}
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
//                                   {name}
//                                 </span>
//                               </div>
//                             </td>
//                           )
//                         }

//                         if (type === "metric") {
//                           const cfg = METRIC_CONFIG[col.header] || {
//                             bg: "#f8fafc",
//                             text: "#374151",
//                             border: "#e2e8f0",
//                             dot: "#94a3b8",
//                             glow: "transparent"
//                           }
//                           return (
//                             <td
//                               key={col.header || colIdx}
//                               style={{ ...baseTd, cursor: "pointer" }}
//                               onClick={() =>
//                                 onTotalLeadsClick?.(row, col.header)
//                               }
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
//                                 {value ?? "—"}
//                               </span>
//                             </td>
//                           )
//                         }

//                         return (
//                           <td
//                             key={col.header || colIdx}
//                             style={{
//                               ...baseTd,
//                               fontSize: 13,
//                               color: isFirst ? "#0f172a" : "#4b5563",
//                               fontWeight: isFirst ? 600 : 400
//                             }}
//                           >
//                             {value ?? (
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
//               <span
//                 style={{
//                   fontWeight: 700,
//                   color: "#334155"
//                 }}
//               >
//                 {data.length}
//               </span>{" "}
//               {data.length === 1 ? "record" : "records"}
//             </span>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
////new doee///
// components/primaryUser/ReportTable.jsx
// export default function ReportTable({
//   reportName,
//   data,
//   headers,                 // NEW: explicit list of headers we want to show
//   mode = "staff",
//   selectedStaff,
//   drillDown = false,
//   onStaffClick,
//   onSeeAll,
//   onTotalLeadsClick,       // kept for ProductWise compatibility
//   onCellClick              // NEW: generic click handler for other reports
// }) {
//   const isProductWise =
//     reportName?.toLowerCase().includes("product-wise") ||
//     reportName?.toLowerCase().includes("product wise")

//   const isFollowup =
//     reportName?.toLowerCase().includes("followup") ||
//     reportName?.toLowerCase().includes("follow-up")

//   const isDailyActivity =
//     reportName?.toLowerCase().includes("daily") &&
//     reportName?.toLowerCase().includes("activity")

//   const isSalesFunnel =
//     reportName?.toLowerCase().includes("sales funnel")

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
//     AVATAR_GRADIENTS[Math.abs(name.charCodeAt(0)) % AVATAR_GRADIENTS.length]

//   const initials = (name = "") =>
//     name
//       .split(" ")
//       .slice(0, 2)
//       .map((w) => w[0] || "")
//       .join("")
//       .toUpperCase()

//   // 1) Build base columns
//   //    Use headers prop as whitelist; fall back to keys of first row.
//   const sourceHeaders =
//     headers && headers.length
//       ? headers
//       : data && data.length
//       ? Object.keys(data[0])
//       : []

//   const rawColumns = sourceHeaders.map((key) => ({
//     header: key,
//     accessor: key
//   }))

//   // 2) Apply special types (staff / metric)
//   const columns = rawColumns.map((col) => {
//     const h = col.header

//     if (["Staff", "staffName", "staff"].includes(h)) {
//       return { ...col, type: "staff" }
//     }

//     if (
//       [
//         "Total Leads",
//         "totalLeads",
//         "leadCount",
//         "Converted",
//         "Pending",
//         "Lost",
//         "Count",
//         "Total Value",
//         "Converted Value",
//         "Due Today",
//         "Overdue",
//         "Future",
//         "Calls",
//         "New Leads"
//       ].includes(h)
//     ) {
//       return { ...col, type: "metric" }
//     }

//     return col
//   })

//   // 3) Visibility rules
//   const visibleColumns = columns.filter((col) => {
//     const h = col.header

//     // PRODUCT‑WISE: hide internal ids
//     if (isProductWise) {
//       if (["staffId", "productId", "branchId", "staffRole"].includes(h)) {
//         return false
//       }
//       // when drill‑down to product, hide Staff column
//       if (drillDown && h === "Staff") return false
//       // top‑level staff view: hide Product column
//       if (!drillDown && h === "Product") return false
//     }

//     // FOLLOWUP SUMMARY:
//     // allowed headers you listed; ignore any extra fields from API
//     if (isFollowup) {
//       const allowed = [
//         "Staff",
//         "leadCount",
//         "Lead Count",
//         "Due Today",
//         "Overdue",
//         "Future",
//         "Converted",
//         "Lost",
//         "Converted %",
//         "Converted Percentage"
//       ]
//       return allowed.includes(h)
//     }

//     // DAILY STAFF ACTIVITY:
//     // left side dynamic columns are provided via `headers` array.
//     if (isDailyActivity) {
//       const allowed = [
//         "Date",
//         "Staff",
//         "Calls",
//         "New Leads",
//         ...sourceHeaders.filter(
//           (x) => !["Date", "Staff", "Calls", "New Leads"].includes(x)
//         )
//       ]
//       return allowed.includes(h)
//     }

//     // SALES FUNNEL:
//     // you only show Stage, Count, Value, Conversion
//     if (isSalesFunnel) {
//       const allowed = ["Stage", "Count", "Value", "Conversion"]
//       return allowed.includes(h)
//     }

//     return true
//   })

//   const showTopBar = (drillDown && selectedStaff) || (drillDown && onSeeAll)

//   // regroup footer metrics per report
//   const footerMetrics = (() => {
//     if (isProductWise) {
//       return ["Total Leads", "Converted", "Pending", "Lost"].filter((m) =>
//         visibleColumns.some((c) => c.header === m)
//       )
//     }
//     if (isFollowup) {
//       return ["Lead Count", "Converted", "Lost"].filter((m) =>
//         visibleColumns.some((c) => c.header === m)
//       )
//     }
//     if (isDailyActivity) {
//       return ["Calls", "New Leads"].filter((m) =>
//         visibleColumns.some((c) => c.header === m)
//       )
//     }
//     if (isSalesFunnel) {
//       return ["Count"].filter((m) =>
//         visibleColumns.some((c) => c.header === m)
//       )
//     }
//     return []
//   })()

//   // decide how each cell behaves
//   const getCellType = (col) => {
//     const h = col.header

//     // clickable staff cells in product‑wise and followup reports
//     if (
//       col.type === "staff" &&
//       !drillDown &&
//       onStaffClick &&
//       (isProductWise || isFollowup)
//     )
//       return "staff"

//     // metric chips for product‑wise (Total Leads, Converted, Pending, Lost)
//     if (
//       isProductWise &&
//       ["Total Leads", "Converted", "Pending", "Lost"].includes(h)
//     )
//       return "metric"

//     // followup summary: all metrics except Converted Percentage are navigable
//     if (
//       isFollowup &&
//       !["Staff", "Converted Percentage", "Converted %"].includes(h)
//     )
//       return "metric"

//     // daily staff activity: every column except Date & Staff is navigable
//     if (
//       isDailyActivity &&
//       !["Date", "Staff"].includes(h)
//     )
//       return "metric"

//     // sales funnel: only Count is navigable
//     if (isSalesFunnel && h === "Count") return "metric"

//     if (col.type) return col.type
//     return "default"
//   }

//   const handleMetricClick = (row, header) => {
//     // Preserve current ProductWise behaviour (uses onTotalLeadsClick)
//     if (isProductWise && onTotalLeadsClick) {
//       onTotalLeadsClick(row, header)
//       return
//     }

//     // For all other reports, bubble event to parent via onCellClick
//     if (onCellClick) {
//       onCellClick({ row, header, reportName })
//     }
//   }

//   const effectiveData = data || []

//   const formatHeaderLabel = (h) => {
//     // optional prettifying
//     if (h === "leadCount") return "Lead Count"
//     return h
//   }

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
//                 : `${effectiveData.length} ${
//                     effectiveData.length === 1 ? "record" : "records"
//                   }`}
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
//                   style={{
//                     fontSize: 12,
//                     fontWeight: 600,
//                     color: "#e2e8f0"
//                   }}
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
//                 {visibleColumns.map((col, i) => (
//                   <th
//                     key={col.header || i}
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
//                         i < visibleColumns.length - 1
//                           ? "1px solid #f1f5f9"
//                           : "none",
//                       whiteSpace: "nowrap"
//                     }}
//                   >
//                     {formatHeaderLabel(col.header)}
//                   </th>
//                 ))}
//               </tr>
//             </thead>

//             <tbody>
//               {effectiveData.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={visibleColumns.length || 1}
//                     style={{ padding: "72px 24px", textAlign: "center" }}
//                   >
//                     No records found
//                   </td>
//                 </tr>
//               ) : (
//                 effectiveData.map((row, rowIdx) => {
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
//                       {visibleColumns.map((col, colIdx) => {
//                         const isFirst = colIdx === 0
//                         const isLast = colIdx === visibleColumns.length - 1

//                         const baseTd = {
//                           padding: "11px 18px",
//                           borderBottom: "1px solid #f1f5f9",
//                           borderRight: !isLast ? "1px solid #f8fafc" : "none",
//                           verticalAlign: "middle",
//                           whiteSpace: "nowrap"
//                         }

//                         const value = row[col.accessor]
//                         const type = getCellType(col)

//                         // STAFF CELL
//                         if (type === "staff") {
//                           const name = String(value || "")
//                           return (
//                             <td
//                               key={col.header || colIdx}
//                               style={{ ...baseTd, cursor: "pointer" }}
//                               onClick={() =>
//                                 typeof name === "string" &&
//                                 onStaffClick?.(name)
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
//                                     background: getGradient(name),
//                                     display: "flex",
//                                     alignItems: "center",
//                                     justifyContent: "center",
//                                     fontSize: 10,
//                                     fontWeight: 800,
//                                     color: "#fff",
//                                     flexShrink: 0,
//                                     boxShadow:
//                                       "0 2px 6px rgba(0,0,0,0.18)"
//                                   }}
//                                 >
//                                   {initials(name)}
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
//                                   {name}
//                                 </span>
//                               </div>
//                             </td>
//                           )
//                         }

//                         // METRIC CELL
//                         if (type === "metric") {
//                           const cfg = METRIC_CONFIG[col.header] || {
//                             bg: "#f8fafc",
//                             text: "#374151",
//                             border: "#e2e8f0",
//                             dot: "#94a3b8",
//                             glow: "transparent"
//                           }
//                           return (
//                             <td
//                               key={col.header || colIdx}
//                               style={{ ...baseTd, cursor: "pointer" }}
//                               onClick={() =>
//                                 handleMetricClick(row, col.header)
//                               }
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
//                                 {value ?? "—"}
//                               </span>
//                             </td>
//                           )
//                         }

//                         // DEFAULT CELL
//                         return (
//                           <td
//                             key={col.header || colIdx}
//                             style={{
//                               ...baseTd,
//                               fontSize: 13,
//                               color: isFirst ? "#0f172a" : "#4b5563",
//                               fontWeight: isFirst ? 600 : 400
//                             }}
//                           >
//                             {value ?? (
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

//       {effectiveData.length > 0 && (
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
//               <span
//                 style={{
//                   fontWeight: 700,
//                   color: "#334155"
//                 }}
//               >
//                 {effectiveData.length}
//               </span>{" "}
//               {effectiveData.length === 1 ? "record" : "records"}
//             </span>
//           </div>

//           {footerMetrics.length > 0 && (
//             <div
//               style={{
//                 display: "flex",
//                 flexWrap: "wrap",
//                 gap: 8,
//                 fontSize: 11
//               }}
//             >
//               {footerMetrics.map((m) => (
//                 <span
//                   key={m}
//                   style={{
//                     padding: "3px 9px",
//                     borderRadius: 999,
//                     background: "#e5f0ff",
//                     color: "#1d4ed8",
//                     fontWeight: 600
//                   }}
//                 >
//                   {m}
//                 </span>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }

// export default function ReportTable({
//   reportName,
//   data,
//   headers,                 // explicit headers list from parent
//   mode = "staff",
//   selectedStaff,
//   drillDown = false,
//   onStaffClick,
//   onSeeAll,
//   onTotalLeadsClick,       // Product‑Wise navigation
//   onCellClick              // generic navigation for other reports
// }) {
// console.log(data)
//   // ---- REPORT TYPE FLAGS ----
//   const lowerName = reportName?.toLowerCase() || ""
//   const isProductWise =
//     lowerName.includes("product-wise") || lowerName.includes("product wise")
//   const isFollowup =
//     lowerName.includes("followup") || lowerName.includes("follow-up")
//   const isDailyActivity =
//     lowerName.includes("daily") && lowerName.includes("activity")
//   const isSalesFunnel = lowerName.includes("sales funnel")

//   // ---- STYLES CONFIG ----
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
//     AVATAR_GRADIENTS[Math.abs(name.charCodeAt(0)) % AVATAR_GRADIENTS.length]

//   const initials = (name = "") =>
//     name
//       .split(" ")
//       .slice(0, 2)
//       .map((w) => w[0] || "")
//       .join("")
//       .toUpperCase()

//   // ---- HEADER → DATA KEY MAP (ALL REPORTS) ----
//   const keyMap = {
//     // common
//     Staff: "Staff",
//     staffName: "staffName",

//     // PRODUCTWISE data (from your example)
//     Product: "Product",
//     "Total Leads": "totalLeads",      // overridden for followup below
//     Converted: "totalConverted",      // overridden for followup below
//     Lost: "totalLost",                // overridden for followup below
//     Pending: "totalPending",
//     "Total Value": "totalValue",
//     "Converted Value": "convertedValue",

//     // FOLLOWUP SUMMARY data
//     // staff, Total Leads, Due Today, Overdue, Future, Converted, Lost, Conversion %
//     "Due Today": "dueToday",
//     Overdue: "overDue",
//     Future: "future",
//     "Conversion%": "convertedPercentage",
//     "Conversion %": "convertedPercentage",
//     "Converted %": "convertedPercentage",

//     // DAILY STAFF ACTIVITY data
//     Date: "Date",           // in your data the key is "Date"
//     "New Leads": "newlead", // key is newlead
//     Calls: "Calls",         // key is Calls

//     // SALES FUNNEL data
//     Stage: "stage",
//     Count: "count",
//     Value: "value",
//     "Conv%": "conversion",
//     "Conv %": "conversion",
//     "Conversion %": "conversion",
//     Conversion: "conversion"
//   }

//   // ---- BUILD COLUMNS ----
//   const sourceHeaders =
//     headers && headers.length
//       ? headers
//       : data && data.length
//       ? Object.keys(data[0])
//       : []

//   const rawColumns = sourceHeaders.map((header) => {
//     let accessor = keyMap[header] || header

//     // special overrides where the same header is used in different reports
//     if (isFollowup) {
//       if (header === "Total Leads") accessor = "leadCount"
//       if (header === "Converted") accessor = "converted"
//       if (header === "Lost") accessor = "lost"
//     }

//     if (isDailyActivity) {
//       if (header === "Staff") accessor = "staffName"
//       if (header === "Calls") accessor = "Calls"
//       if (header === "New Leads") accessor = "newlead"
//       // dynamic activity columns use header as key (e.g. "System Study & Demo")
//     }

//     if (isSalesFunnel) {
//       if (header === "Stage") accessor = "stage"
//       if (header === "Count") accessor = "count"
//       if (header === "Value") accessor = "value"
//       if (header === "Conv%") accessor = "conversion"
//       if (header === "Conv %") accessor = "conversion"
//       if (header === "Conversion %") accessor = "conversion"
//     }

//     if (isProductWise) {
//       if (header === "Staff") accessor = "Staff"
//       if (header === "Product") accessor = "Product"
//       // numeric fields already mapped above
//     }

//     return { header, accessor }
//   })

//   const columns = rawColumns.map((col) => {
//     const h = col.header

//     if (["Staff", "staffName"].includes(h)) {
//       return { ...col, type: "staff" }
//     }

//     if (
//       [
//         // productwise / followup
//         "Total Leads",
//         "Converted",
//         "Lost",
//         "Pending",
//         "Total Value",
//         "Converted Value",
//         "Due Today",
//         "Overdue",
//         "Future",
//         "Conversion%",
//         "Conversion %",
//         "Conv %",
//         "Conv%",
//         // daily
//         "Calls",
//         "New Leads",
//         // sales funnel
//         "Count",
//         "Value"
//       ].includes(h)
//     ) {
//       return { ...col, type: "metric" }
//     }

//     return col
//   })

//   // ---- VISIBILITY RULES PER REPORT ----
//   const visibleColumns = columns.filter((col) => {
//     const h = col.header

//     // PRODUCTWISE
//     if (isProductWise) {
//       if (["staffId", "productId", "branchId", "staffRole"].includes(h))
//         return false
//       if (drillDown && h === "Staff") return false
//       if (!drillDown && h === "Product") return false
//     }

//     // FOLLOWUP SUMMARY
//     if (isFollowup) {
//       const allowed = [
//         "Staff",
//         "Total Leads",
//         "Due Today",
//         "Overdue",
//         "Future",
//         "Converted",
//         "Lost",
//         "Conversion%",
//         "Conversion %"
//       ]
//       return allowed.includes(h)
//     }

//     // DAILY STAFF ACTIVITY
//     if (isDailyActivity) {
//       // headers from you: Date, Staff, New Leads, Calls, dynamic array
//       const allowedStatic = ["Date", "Staff", "New Leads", "Calls"]
//       return allowedStatic.includes(h) || !["Date", "Staff"].includes(h)
//     }

//     // SALES FUNNEL
//     if (isSalesFunnel) {
//       const allowed = ["Stage", "Count", "Value", "Conv%", "Conv %", "Conversion %"]
//       return allowed.includes(h)
//     }

//     return true
//   })

//   const showTopBar = (drillDown && selectedStaff) || (drillDown && onSeeAll)

//   // ---- FOOTER METRICS ----
//   const footerMetrics = (() => {
//     if (isProductWise)
//       return ["Total Leads", "Converted", "Pending", "Lost"].filter((m) =>
//         visibleColumns.some((c) => c.header === m)
//       )
//     if (isFollowup)
//       return ["Total Leads", "Converted", "Lost"].filter((m) =>
//         visibleColumns.some((c) => c.header === m)
//       )
//     if (isDailyActivity)
//       return ["Calls", "New Leads"].filter((m) =>
//         visibleColumns.some((c) => c.header === m)
//       )
//     if (isSalesFunnel)
//       return ["Count"].filter((m) =>
//         visibleColumns.some((c) => c.header === m)
//       )
//     return []
//   })()

//   // ---- CELL TYPE DECISION ----
//   const getCellType = (col) => {
//     const h = col.header

//     if (
//       col.type === "staff" &&
//       !drillDown &&
//       onStaffClick &&
//       (isProductWise || isFollowup)
//     )
//       return "staff"

//     if (
//       isProductWise &&
//       ["Total Leads", "Converted", "Pending", "Lost"].includes(h)
//     )
//       return "metric"

//     if (
//       isFollowup &&
//       !["Staff", "Conversion%", "Conversion %"].includes(h)
//     )
//       return "metric"

//     if (isDailyActivity && !["Date", "Staff"].includes(h)) return "metric"

//     if (isSalesFunnel && h === "Count") return "metric"

//     if (col.type) return col.type
//     return "default"
//   }

//   // ---- CLICK HANDLERS ----
//   const handleMetricClick = (row, header) => {
//     if (isProductWise && onTotalLeadsClick) {
//       onTotalLeadsClick(row, header)
//       return
//     }
//     if (onCellClick) {
//       onCellClick({ row, header, reportName })
//     }
//   }

//   const effectiveData = data || []
//   const formatHeaderLabel = (h) => h

//   // ---- RENDER ----
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
//                 : `${effectiveData.length} ${
//                     effectiveData.length === 1 ? "record" : "records"
//                   }`}
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
//                   style={{
//                     fontSize: 12,
//                     fontWeight: 600,
//                     color: "#e2e8f0"
//                   }}
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
//                 {visibleColumns.map((col, i) => (
//                   <th
//                     key={col.header || i}
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
//                         i < visibleColumns.length - 1
//                           ? "1px solid #f1f5f9"
//                           : "none",
//                       whiteSpace: "nowrap"
//                     }}
//                   >
//                     {formatHeaderLabel(col.header)}
//                   </th>
//                 ))}
//               </tr>
//             </thead>

//             <tbody>
//               {effectiveData.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={visibleColumns.length || 1}
//                     style={{ padding: "72px 24px", textAlign: "center" }}
//                   >
//                     No records found
//                   </td>
//                 </tr>
//               ) : (
//                 effectiveData.map((row, rowIdx) => {
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
//                       {visibleColumns.map((col, colIdx) => {
//                         const isFirst = colIdx === 0
//                         const isLast = colIdx === visibleColumns.length - 1

//                         const baseTd = {
//                           padding: "11px 18px",
//                           borderBottom: "1px solid #f1f5f9",
//                           borderRight: !isLast ? "1px solid #f8fafc" : "none",
//                           verticalAlign: "middle",
//                           whiteSpace: "nowrap"
//                         }

//                         const value = row[col.accessor]
//                         const type = getCellType(col)

//                         // STAFF CELL
//                         if (type === "staff") {
//                           const name = String(value || "")
//                           return (
//                             <td
//                               key={col.header || colIdx}
//                               style={{ ...baseTd, cursor: "pointer" }}
//                               onClick={() =>
//                                 typeof name === "string" &&
//                                 onStaffClick?.(name)
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
//                                     background: getGradient(name),
//                                     display: "flex",
//                                     alignItems: "center",
//                                     justifyContent: "center",
//                                     fontSize: 10,
//                                     fontWeight: 800,
//                                     color: "#fff",
//                                     flexShrink: 0,
//                                     boxShadow:
//                                       "0 2px 6px rgba(0,0,0,0.18)"
//                                   }}
//                                 >
//                                   {initials(name)}
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
//                                   {name}
//                                 </span>
//                               </div>
//                             </td>
//                           )
//                         }

//                         // METRIC CELL
//                         if (type === "metric") {
//                           const cfg = METRIC_CONFIG[col.header] || {
//                             bg: "#f8fafc",
//                             text: "#374151",
//                             border: "#e2e8f0",
//                             dot: "#94a3b8",
//                             glow: "transparent"
//                           }
//                           return (
//                             <td
//                               key={col.header || colIdx}
//                               style={{ ...baseTd, cursor: "pointer" }}
//                               onClick={() =>
//                                 handleMetricClick(row, col.header)
//                               }
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
//                                 {value ?? "—"}
//                               </span>
//                             </td>
//                           )
//                         }

//                         // NORMAL CELL
//                         return (
//                           <td
//                             key={col.header || colIdx}
//                             style={{
//                               ...baseTd,
//                               fontSize: 13,
//                               color: isFirst ? "#0f172a" : "#4b5563",
//                               fontWeight: isFirst ? 600 : 400
//                             }}
//                           >
//                             {value ?? (
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

//       {effectiveData.length > 0 && (
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
//               <span
//                 style={{
//                   fontWeight: 700,
//                   color: "#334155"
//                 }}
//               >
//                 {effectiveData.length}
//               </span>{" "}
//               {effectiveData.length === 1 ? "record" : "records"}
//             </span>
//           </div>

//           {footerMetrics.length > 0 && (
//             <div
//               style={{
//                 display: "flex",
//                 flexWrap: "wrap",
//                 gap: 8,
//                 fontSize: 11
//               }}
//             >
//               {footerMetrics.map((m) => (
//                 <span
//                   key={m}
//                   style={{
//                     padding: "3px 9px",
//                     borderRadius: 999,
//                     background: "#e5f0ff",
//                     color: "#1d4ed8",
//                     fontWeight: 600
//                   }}
//                 >
//                   {m}
//                 </span>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }




// export default function ReportTable({
//   reportName,
//   data,
//   headers, // explicit headers list from parent
//   mode = "staff",
//   selectedStaff,
//   drillDown = false,
//   onStaffClick,
//   onSeeAll,
//   onTotalLeadsClick, // Product‑Wise navigation
//   onCellClick // generic navigation for other reports
// }) {

//   // ---- REPORT TYPE FLAGS ----
//   const lowerName = reportName?.toLowerCase() || ""
//   const isProductWise =
//     lowerName.includes("product-wise") || lowerName.includes("product wise")
// console.log(isProductWise)
//   const isFollowup =
//     lowerName.includes("followup") || lowerName.includes("follow-up")
//   const isDailyActivity =
//     lowerName.includes("daily") && lowerName.includes("activity")
//   const isSalesFunnel = lowerName.includes("sales funnel")

//   // ---- STYLES CONFIG ----
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
//     AVATAR_GRADIENTS[Math.abs(name.charCodeAt(0)) % AVATAR_GRADIENTS.length]

//   const initials = (name = "") =>
//     name
//       .split(" ")
//       .slice(0, 2)
//       .map((w) => w[0] || "")
//       .join("")
//       .toUpperCase()

//   // ---- HEADER → DATA KEY MAP (ALL REPORTS) ----
//   const keyMap = {
//     // common
//     Staff: "Staff",
//     staffName: "staffName",

//     // PRODUCTWISE data
//     Product: "Product",
//     "Total Leads": "totalLeads", // overridden for followup below
//     Converted: "totalConverted", // overridden for followup below
//     Lost: "totalLost", // overridden for followup below
//     Pending: "totalPending",
//     "Total Value": "totalValue",
//     "Converted Value": "convertedValue",

//     // FOLLOWUP SUMMARY data
//     "Due Today": "dueToday",
//     Overdue: "overDue",
//     Future: "future",
//     "Conversion%": "convertedPercentage",
//     "Conversion %": "convertedPercentage",
//     "Converted %": "convertedPercentage",

//     // DAILY STAFF ACTIVITY data
//     Date: "Date",
//     "New Leads": "newlead",
//     Calls: "Calls",

//     // SALES FUNNEL data
//     Stage: "stage",
//     Count: "count",
//     Value: "value",
//     "Conv%": "conversion",
//     "Conv %": "conversion",
//     "Conversion %": "conversion",
//     Conversion: "conversion"
//   }

//   // ---- BUILD COLUMNS ----
//   const sourceHeaders =
//     headers && headers.length
//       ? headers
//       : data && data.length
//         ? Object.keys(data[0])
//         : []

//   const rawColumns = sourceHeaders.map((header) => {
//     let accessor = keyMap[header] || header

//     // FOLLOWUP SUMMARY overrides
//     if (isFollowup) {
//       if (header === "Total Leads") accessor = "leadCount"
//       if (header === "Converted") accessor = "converted"
//       if (header === "Lost") accessor = "lost"
//       if (header === "Conversion %") accessor = "convertedPercentage"
//       if (header === "Conversion%") accessor = "convertedPercentage"
//     }

//     // DAILY ACTIVITY overrides
//     if (isDailyActivity) {
//       if (header === "Staff") accessor = "staffName"
//       if (header === "Calls") accessor = "Calls"
//       if (header === "New Leads") accessor = "newlead"
//     }

//     // SALES FUNNEL overrides
//     if (isSalesFunnel) {
//       if (header === "Stage") accessor = "stage"
//       if (header === "Count") accessor = "count"
//       if (header === "Value") accessor = "value"
//       if (header === "Conv%") accessor = "conversion"
//       if (header === "Conv %") accessor = "conversion"
//       if (header === "Conversion %") accessor = "conversion"
//     }

//     // PRODUCTWISE overrides
//     if (isProductWise) {
//       if (header === "Staff") accessor = "Staff"
//       if (header === "Product") accessor = "Product"
//     }

//     return { header, accessor }
//   })

//   const columns = rawColumns.map((col) => {
//     const h = col.header

//     if (["Staff", "staffName"].includes(h)) {
//       return { ...col, type: "staff" }
//     }

//     if (
//       [
//         // productwise / followup
//         "Total Leads",
//         "Converted",
//         "Lost",
//         "Pending",
//         "Total Value",
//         "Converted Value",
//         "Due Today",
//         "Overdue",
//         "Future",
//         "Conversion%",
//         "Conversion %",
//         "Conv %",
//         "Conv%",
//         // daily
//         "Calls",
//         "New Leads",
//         // sales funnel
//         "Count",
//         "Value"
//       ].includes(h)
//     ) {
//       return { ...col, type: "metric" }
//     }

//     return col
//   })

//   // ---- VISIBILITY RULES PER REPORT ----
//   const visibleColumns = columns.filter((col) => {
//     const h = col.header

//     // PRODUCTWISE
//     if (isProductWise) {
//       if (["staffId", "productId", "branchId", "staffRole"].includes(h))
//         return false
//       if (drillDown && h === "Staff") return false
//       if (!drillDown && h === "Product") return false
//     }

//     // FOLLOWUP SUMMARY
//     if (isFollowup) {
//       const allowed = [
//         "Staff",
//         "Total Leads",
//         "Due Today",
//         "Overdue",
//         "Future",
//         "Converted",
//         "Lost",
//         "Conversion%",
//         "Conversion %"
//       ]
//       return allowed.includes(h)
//     }

//     // DAILY STAFF ACTIVITY
//     if (isDailyActivity) {
//       const allowedStatic = ["Date", "Staff", "New Leads", "Calls"]
//       return allowedStatic.includes(h) || !["Date", "Staff"].includes(h)
//     }

//     // SALES FUNNEL
//     if (isSalesFunnel) {
//       const allowed = [
//         "Stage",
//         "Count",
//         "Value",
//         "Conv%",
//         "Conv %",
//         "Conversion %"
//       ]
//       return allowed.includes(h)
//     }

//     return true
//   })

//   const showTopBar = (drillDown && selectedStaff) || (drillDown && onSeeAll)

//   // ---- FOOTER METRICS ----
//   const footerMetrics = (() => {
//     if (isProductWise)
//       return ["Total Leads", "Converted", "Pending", "Lost"].filter((m) =>
//         visibleColumns.some((c) => c.header === m)
//       )
//     if (isFollowup)
//       return ["Total Leads", "Converted", "Lost"].filter((m) =>
//         visibleColumns.some((c) => c.header === m)
//       )
//     if (isDailyActivity)
//       return ["Calls", "New Leads"].filter((m) =>
//         visibleColumns.some((c) => c.header === m)
//       )
//     if (isSalesFunnel)
//       return ["Count"].filter((m) => visibleColumns.some((c) => c.header === m))
//     return []
//   })()

//   // ---- CELL TYPE DECISION ----
//   const getCellType = (col) => {
//     const h = col.header

//     if (
//       col.type === "staff" &&
//       !drillDown &&
//       onStaffClick &&
//       (isProductWise || isFollowup)
//     )
//       return "staff"

//     if (
//       isProductWise &&
//       ["Total Leads", "Converted", "Pending", "Lost"].includes(h)
//     )
//       return "metric"

//     if (isFollowup && !["Staff", "Conversion%", "Conversion %"].includes(h))
//       return "metric"

//     if (isDailyActivity && !["Date", "Staff"].includes(h)) return "metric"

//     if (isSalesFunnel && h === "Count") return "metric"

//     if (col.type) return col.type
//     return "default"
//   }

//   // ---- CLICK HANDLERS ----
//   const handleMetricClick = (row, header) => {
//     if (isProductWise && onTotalLeadsClick) {
//       onTotalLeadsClick(row, header)
//       return
//     }
//     if (onCellClick) {
//       onCellClick({ row, header, reportName })
//     }
//   }

//   const effectiveData = data || []
//   const formatHeaderLabel = (h) => h

//   // ---- RENDER ----
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
//                 : `${effectiveData.length} ${
//                     effectiveData.length === 1 ? "record" : "records"
//                   }`}
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
//                   style={{
//                     fontSize: 12,
//                     fontWeight: 600,
//                     color: "#e2e8f0"
//                   }}
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
//                 {visibleColumns.map((col, i) => (
//                   <th
//                     key={col.header || i}
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
//                         i < visibleColumns.length - 1
//                           ? "1px solid #f1f5f9"
//                           : "none",
//                       whiteSpace: "nowrap"
//                     }}
//                   >
//                     {formatHeaderLabel(col.header)}
//                   </th>
//                 ))}
//               </tr>
//             </thead>

//             <tbody>
//               {effectiveData.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={visibleColumns.length || 1}
//                     style={{ padding: "72px 24px", textAlign: "center" }}
//                   >
//                     No records found
//                   </td>
//                 </tr>
//               ) : (
//                 effectiveData.map((row, rowIdx) => {
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
//                       {visibleColumns.map((col, colIdx) => {
//                         const isFirst = colIdx === 0
//                         const isLast = colIdx === visibleColumns.length - 1

//                         const baseTd = {
//                           padding: "11px 18px",
//                           borderBottom: "1px solid #f1f5f9",
//                           borderRight: !isLast ? "1px solid #f8fafc" : "none",
//                           verticalAlign: "middle",
//                           whiteSpace: "nowrap"
//                         }

//                         const value = row[col.accessor]
//                         const type = getCellType(col)

//                         // STAFF CELL
//                         if (type === "staff") {
//                           const name = String(value || "")
//                           return (
//                             <td
//                               key={col.header || colIdx}
//                               style={{ ...baseTd, cursor: "pointer" }}
//                               onClick={() =>
//                                 typeof name === "string" && onStaffClick?.(name)
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
//                                     background: getGradient(name),
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
//                                   {initials(name)}
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
//                                   {name}
//                                 </span>
//                               </div>
//                             </td>
//                           )
//                         }

//                         // METRIC CELL
//                         if (type === "metric") {
//                           const cfg = METRIC_CONFIG[col.header] || {
//                             bg: "#f8fafc",
//                             text: "#374151",
//                             border: "#e2e8f0",
//                             dot: "#94a3b8",
//                             glow: "transparent"
//                           }
//                           return (
//                             <td
//                               key={col.header || colIdx}
//                               style={{ ...baseTd, cursor: "pointer" }}
//                               onClick={() => handleMetricClick(row, col.header)}
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
//                                 {value ?? "—"}
//                               </span>
//                             </td>
//                           )
//                         }

//                         // NORMAL CELL
//                         return (
//                           <td
//                             key={col.header || colIdx}
//                             style={{
//                               ...baseTd,
//                               fontSize: 13,
//                               color: isFirst ? "#0f172a" : "#4b5563",
//                               fontWeight: isFirst ? 600 : 400
//                             }}
//                           >
//                             {value ?? (
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

//       {effectiveData.length > 0 && (
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
//               <span
//                 style={{
//                   fontWeight: 700,
//                   color: "#334155"
//                 }}
//               >
//                 {effectiveData.length}
//               </span>{" "}
//               {effectiveData.length === 1 ? "record" : "records"}
//             </span>
//           </div>

//           {footerMetrics.length > 0 && (
//             <div
//               style={{
//                 display: "flex",
//                 flexWrap: "wrap",
//                 gap: 8,
//                 fontSize: 11
//               }}
//             >
//               {footerMetrics.map((m) => (
//                 <span
//                   key={m}
//                   style={{
//                     padding: "3px 9px",
//                     borderRadius: 999,
//                     background: "#e5f0ff",
//                     color: "#1d4ed8",
//                     fontWeight: 600
//                   }}
//                 >
//                   {m}
//                 </span>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }





export default function ReportTable({
  reportName,
  data,
  headers,
  mode = "staff",
  selectedStaff,
  drillDown = false,
  onStaffClick,
  onSeeAll,
  onTotalLeadsClick,
  onCellClick
}) {
  // ---- REPORT TYPE FLAGS ----
  const lowerName = reportName?.toLowerCase() || ""
  const isProductWise =
    lowerName.includes("product-wise") || lowerName.includes("product wise")
  const isFollowup =
    lowerName.includes("followup") || lowerName.includes("follow-up")
  const isDailyActivity =
    lowerName.includes("daily") && lowerName.includes("activity")
  const isSalesFunnel = lowerName.includes("sales funnel")

  // ---- STYLES CONFIG ----
  const METRIC_CONFIG = {
    "Total Leads": {
      bg: "#dbeafe",
      text: "#1e40af",
      border: "#93c5fd",
      dot: "#3b82f6",
      glow: "rgba(59,130,246,0.18)",
      amountBg: "#eff6ff",
      amountText: "#1d4ed8",
      amountBorder: "#bfdbfe"
    },
    Converted: {
      bg: "#dcfce7",
      text: "#166534",
      border: "#86efac",
      dot: "#22c55e",
      glow: "rgba(34,197,94,0.18)",
      amountBg: "#f0fdf4",
      amountText: "#15803d",
      amountBorder: "#bbf7d0"
    },
    Pending: {
      bg: "#fef9c3",
      text: "#854d0e",
      border: "#fde047",
      dot: "#eab308",
      glow: "rgba(234,179,8,0.18)",
      amountBg: "#fefce8",
      amountText: "#92400e",
      amountBorder: "#fde68a"
    },
    Lost: {
      bg: "#ffe4e6",
      text: "#9f1239",
      border: "#fda4af",
      dot: "#f43f5e",
      glow: "rgba(244,63,94,0.18)",
      amountBg: "#fff1f2",
      amountText: "#be123c",
      amountBorder: "#fecdd3"
    },
    Count: {
      bg: "#dbeafe",
      text: "#1e40af",
      border: "#93c5fd",
      dot: "#3b82f6",
      glow: "rgba(59,130,246,0.18)",
      amountBg: "#eff6ff",
      amountText: "#1d4ed8",
      amountBorder: "#bfdbfe"
    }
  }

  // ---- Amount field map for product-wise ----
  // maps metric header → the amount accessor key in the row data
  const PRODUCTWISE_AMOUNT_KEY = {
    "Total Leads":  "totalNetAmount",        // total net amount of all leads
    Converted:      "totalConvertedAmount",    // net amount of converted leads
    Pending:        "totalPendingAmount",      // net amount of pending leads
    Lost:           "totalLostAmount"          // net amount of lost leads
  }

  const formatAmount = (val) => {
    const n = parseFloat(val)
    if (!Number.isFinite(n)) return null
    if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(1)}Cr`
    if (n >= 1_00_000)    return `₹${(n / 1_00_000).toFixed(1)}L`
    if (n >= 1_000)       return `₹${(n / 1_000).toFixed(1)}K`
    return `₹${n.toLocaleString("en-IN")}`
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
    AVATAR_GRADIENTS[Math.abs(name.charCodeAt(0)) % AVATAR_GRADIENTS.length]

  const initials = (name = "") =>
    name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0] || "")
      .join("")
      .toUpperCase()

  // ---- HEADER → DATA KEY MAP ----
  const keyMap = {
    Staff: "Staff",
    staffName: "staffName",
    Product: "Product",
    "Total Leads": "totalLeads",
    Converted: "totalConverted",
    Lost: "totalLost",
    Pending: "totalPending",
    "Total Value": "totalValue",
    "Converted Value": "convertedValue",
    "Due Today": "dueToday",
    Overdue: "overDue",
    Future: "future",
    "Conversion%": "convertedPercentage",
    "Conversion %": "convertedPercentage",
    "Converted %": "convertedPercentage",
    Date: "Date",
    "New Leads": "newlead",
    Calls: "Calls",
    Stage: "stage",
    Count: "count",
    Value: "value",
    "Conv%": "conversion",
    "Conv %": "conversion",
    Conversion: "conversion"
  }

  // ---- BUILD COLUMNS ----
  const sourceHeaders =
    headers && headers.length
      ? headers
      : data && data.length
        ? Object.keys(data[0])
        : []

  const rawColumns = sourceHeaders.map((header) => {
    let accessor = keyMap[header] || header

    if (isFollowup) {
      if (header === "Total Leads")    accessor = "leadCount"
      if (header === "Converted")      accessor = "converted"
      if (header === "Lost")           accessor = "lost"
      if (header === "Conversion %")   accessor = "convertedPercentage"
      if (header === "Conversion%")    accessor = "convertedPercentage"
    }

    if (isDailyActivity) {
      if (header === "Staff")     accessor = "staffName"
      if (header === "Calls")     accessor = "Calls"
      if (header === "New Leads") accessor = "newlead"
    }

    if (isSalesFunnel) {
      if (header === "Stage")       accessor = "stage"
      if (header === "Count")       accessor = "count"
      if (header === "Value")       accessor = "value"
      if (header === "Conv%")       accessor = "conversion"
      if (header === "Conv %")      accessor = "conversion"
      if (header === "Conversion %") accessor = "conversion"
    }

    if (isProductWise) {
      if (header === "Staff")   accessor = "Staff"
      if (header === "Product") accessor = "Product"
    }

    return { header, accessor }
  })

  const columns = rawColumns.map((col) => {
    const h = col.header

    if (["Staff", "staffName"].includes(h)) {
      return { ...col, type: "staff" }
    }

    if (
      [
        "Total Leads", "Converted", "Lost", "Pending",
        "Total Value", "Converted Value",
        "Due Today", "Overdue", "Future",
        "Conversion%", "Conversion %", "Conv %", "Conv%",
        "Calls", "New Leads",
        "Count", "Value"
      ].includes(h)
    ) {
      return { ...col, type: "metric" }
    }

    return col
  })

  // ---- VISIBILITY RULES ----
  const visibleColumns = columns.filter((col) => {
    const h = col.header

    if (isProductWise) {
      if (["staffId", "productId", "branchId", "staffRole"].includes(h)) return false
      // hide the standalone "Total Value" and "Converted Value" columns —
      // those amounts are now shown inline inside the metric cells
      if (["Total Value", "Converted Value"].includes(h)) return false
      if (drillDown && h === "Staff")   return false
      if (!drillDown && h === "Product") return false
    }

    if (isFollowup) {
      const allowed = [
        "Staff", "Total Leads", "Due Today", "Overdue",
        "Future", "Converted", "Lost", "Conversion%", "Conversion %"
      ]
      return allowed.includes(h)
    }

    if (isDailyActivity) {
      const allowedStatic = ["Date", "Staff", "New Leads", "Calls"]
      return allowedStatic.includes(h) || !["Date", "Staff"].includes(h)
    }

    if (isSalesFunnel) {
      const allowed = ["Stage", "Count", "Value", "Conv%", "Conv %", "Conversion %"]
      return allowed.includes(h)
    }

    return true
  })

  const showTopBar = (drillDown && selectedStaff) || (drillDown && onSeeAll)

  // ---- FOOTER METRICS ----
  const footerMetrics = (() => {
    if (isProductWise)
      return ["Total Leads", "Converted", "Pending", "Lost"].filter((m) =>
        visibleColumns.some((c) => c.header === m)
      )
    if (isFollowup)
      return ["Total Leads", "Converted", "Lost"].filter((m) =>
        visibleColumns.some((c) => c.header === m)
      )
    if (isDailyActivity)
      return ["Calls", "New Leads"].filter((m) =>
        visibleColumns.some((c) => c.header === m)
      )
    if (isSalesFunnel)
      return ["Count"].filter((m) => visibleColumns.some((c) => c.header === m))
    return []
  })()

  // ---- CELL TYPE ----
  const getCellType = (col) => {
    const h = col.header

    if (
      col.type === "staff" &&
      !drillDown &&
      onStaffClick &&
      (isProductWise || isFollowup)
    )
      return "staff"

    if (
      isProductWise &&
      ["Total Leads", "Converted", "Pending", "Lost"].includes(h)
    )
      return "metric"

    if (isFollowup && !["Staff", "Conversion%", "Conversion %"].includes(h))
      return "metric"

    if (isDailyActivity && !["Date", "Staff"].includes(h)) return "metric"

    if (isSalesFunnel && h === "Count") return "metric"

    if (col.type) return col.type
    return "default"
  }

  // ---- CLICK HANDLERS ----
  const handleMetricClick = (row, header) => {
    if (isProductWise && onTotalLeadsClick) {
      onTotalLeadsClick(row, header)
      return
    }
    if (onCellClick) {
      onCellClick({ row, header, reportName })
    }
  }

  const effectiveData = data || []

  // ---- RENDER ----
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
              width: 38, height: 38, borderRadius: 11,
              background: "rgba(255,255,255,0.09)",
              border: "1px solid rgba(255,255,255,0.14)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
              stroke="rgba(255,255,255,0.82)" strokeWidth="1.8">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <path d="M3 9h18M9 21V9" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", letterSpacing: "0.01em", lineHeight: 1.25 }}>
              {reportName || "Report"}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", marginTop: 3 }}>
              {drillDown && selectedStaff
                ? `Drill-down — ${selectedStaff}`
                : `${effectiveData.length} ${effectiveData.length === 1 ? "record" : "records"}`}
            </div>
          </div>
        </div>

        {showTopBar && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {drillDown && selectedStaff && (
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "5px 12px 5px 6px", borderRadius: 99,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.13)"
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: "50%",
                  background: getGradient(selectedStaff),
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 800, color: "#fff",
                  flexShrink: 0, letterSpacing: "0.02em",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
                }}>
                  {initials(selectedStaff)}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>
                  {selectedStaff}
                </span>
              </div>
            )}

            {drillDown && onSeeAll && (
              <button
                type="button"
                onClick={onSeeAll}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "6px 14px", borderRadius: 99,
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.05em",
                  color: "#7dd3fc", background: "rgba(56,189,248,0.12)",
                  border: "1px solid rgba(56,189,248,0.28)",
                  cursor: "pointer", transition: "background 0.15s"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(56,189,248,0.22)" }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(56,189,248,0.12)" }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5">
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
          style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 transparent" }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {visibleColumns.map((col, i) => (
                  <th
                    key={col.header || i}
                    style={{
                      position: "sticky", top: 0, zIndex: 20,
                      padding: "11px 18px", textAlign: "left",
                      fontSize: 10.5, fontWeight: 700,
                      letterSpacing: "0.08em", textTransform: "uppercase",
                      color: "#64748b", background: "#f8fafc",
                      borderBottom: "2px solid #e2e8f0",
                      borderRight: i < visibleColumns.length - 1 ? "1px solid #f1f5f9" : "none",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {effectiveData.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleColumns.length || 1}
                    style={{ padding: "72px 24px", textAlign: "center" }}
                  >
                    No records found
                  </td>
                </tr>
              ) : (
                effectiveData.map((row, rowIdx) => {
                  const isEven = rowIdx % 2 === 0
                  return (
                    <tr
                      key={rowIdx}
                      style={{ background: isEven ? "#ffffff" : "#fafbfd", transition: "background 0.1s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#eff6ff" }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = isEven ? "#ffffff" : "#fafbfd" }}
                    >
                      {visibleColumns.map((col, colIdx) => {
                        const isFirst = colIdx === 0
                        const isLast  = colIdx === visibleColumns.length - 1

                        const baseTd = {
                          padding: "11px 18px",
                          borderBottom: "1px solid #f1f5f9",
                          borderRight: !isLast ? "1px solid #f8fafc" : "none",
                          verticalAlign: "middle",
                          whiteSpace: "nowrap"
                        }

                        const value = row[col.accessor]
                        const type  = getCellType(col)

                        /* ── STAFF CELL ── */
                        if (type === "staff") {
                          const name = String(value || "")
                          return (
                            <td
                              key={col.header || colIdx}
                              style={{ ...baseTd, cursor: "pointer" }}
                              onClick={() => typeof name === "string" && onStaffClick?.(name)}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                                <div style={{
                                  width: 30, height: 30, borderRadius: "50%",
                                  background: getGradient(name),
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  fontSize: 10, fontWeight: 800, color: "#fff",
                                  flexShrink: 0, boxShadow: "0 2px 6px rgba(0,0,0,0.18)"
                                }}>
                                  {initials(name)}
                                </div>
                                <span
                                  style={{ fontSize: 13, fontWeight: 600, color: "#1d4ed8", transition: "color 0.1s" }}
                                  onMouseEnter={(e) => { e.currentTarget.style.color = "#1e3a8a" }}
                                  onMouseLeave={(e) => { e.currentTarget.style.color = "#1d4ed8" }}
                                >
                                  {name}
                                </span>
                              </div>
                            </td>
                          )
                        }

                        /* ── METRIC CELL ── */
                        if (type === "metric") {
                          const cfg = METRIC_CONFIG[col.header] || {
                            bg: "#f8fafc", text: "#374151", border: "#e2e8f0",
                            dot: "#94a3b8", glow: "transparent",
                            amountBg: "#f1f5f9", amountText: "#475569", amountBorder: "#e2e8f0"
                          }

                          // For product-wise, fetch the matching amount value
                          const amountKey = isProductWise ? PRODUCTWISE_AMOUNT_KEY[col.header] : null
console.log(PRODUCTWISE_AMOUNT_KEY)
console.log(amountKey)
console.log(row)
console.log(row[amountKey])
                          const amountVal = amountKey ? row[amountKey] : undefined
                          const amountFormatted = amountVal !== undefined ? formatAmount(amountVal) : null
console.log(amountFormatted)
                          return (
                            <td
                              key={col.header || colIdx}
                              style={{ ...baseTd, cursor: "pointer" }}
                              onClick={() => handleMetricClick(row, col.header)}
                            >
                              <div style={{ display: "flex", flexDirection: "row", gap: 4, alignItems: "center" }}>

                                {/* Count pill */}
                                <span
                                  style={{
                                    display: "inline-flex", alignItems: "center", gap: 6,
                                    padding: "4px 11px 4px 8px", borderRadius: 99,
                                    background: cfg.bg, color: cfg.text,
                                    border: `1.5px solid ${cfg.border}`,
                                    fontSize: 12, fontWeight: 700,
                                    boxShadow: `0 0 0 3px ${cfg.glow}`,
                                    transition: "box-shadow 0.15s"
                                  }}
                                >
                                  <span style={{
                                    width: 7, height: 7, borderRadius: "50%",
                                    background: cfg.dot, flexShrink: 0,
                                    boxShadow: `0 0 4px ${cfg.dot}`
                                  }} />
                                  {value ?? "—"}
                                </span>

                                {/* Amount tag — only for product-wise when amount is available */}
                                {isProductWise && amountFormatted && (
                                  <span style={{
                                    display: "inline-flex", alignItems: "center", gap: 3,
                                    padding: "2px 8px",
                                    borderRadius: 6,
                                    background: cfg.amountBg,
                                    color: cfg.amountText,
                                    border: `1px solid ${cfg.amountBorder}`,
                                    fontSize: 10.5,
                                    fontWeight: 700,
                                    letterSpacing: "0.02em",
                                  }}>
                                    {/* rupee icon */}
                                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
                                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                      <path d="M6 3h12M6 8h12M12 21L6 8" />
                                      <path d="M6 8a6 6 0 0 0 6 6" />
                                    </svg>
                                    {amountFormatted}
                                  </span>
                                )}
                              </div>
                            </td>
                          )
                        }

                        /* ── DEFAULT CELL ── */
                        return (
                          <td
                            key={col.header || colIdx}
                            style={{
                              ...baseTd,
                              fontSize: 13,
                              color: isFirst ? "#0f172a" : "#4b5563",
                              fontWeight: isFirst ? 600 : 400
                            }}
                          >
                            {value ?? <span style={{ color: "#d1d5db" }}>—</span>}
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
      {effectiveData.length > 0 && (
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
            <div style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "linear-gradient(135deg,#3b82f6,#6366f1)"
            }} />
            <span style={{ fontSize: 11, color: "#94a3b8" }}>
              <span style={{ fontWeight: 700, color: "#334155" }}>{effectiveData.length}</span>
              {" "}{effectiveData.length === 1 ? "record" : "records"}
            </span>
          </div>

          {footerMetrics.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, fontSize: 11 }}>
              {footerMetrics.map((m) => (
                <span key={m} style={{
                  padding: "3px 9px", borderRadius: 999,
                  background: "#e5f0ff", color: "#1d4ed8", fontWeight: 600
                }}>
                  {m}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

