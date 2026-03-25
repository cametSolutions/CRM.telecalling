///livee testcode////

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
  console.log(data)
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
                : `${data.length} ${data.length === 1 ? "record" : "records"}`}
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
                          background: "linear-gradient(135deg,#f1f5f9,#e2e8f0)",
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
                        console.log(FIELD_MAP[header])
                        console.log(header)
                        const fieldName = FIELD_MAP[header] ?? header
                        console.log(fieldName)
                        const cellValue = row[fieldName]
                        console.log(row)
                        const type = getCellType(header)
                        console.log(type)
                        const isFirst = colIdx === 0
                        const isLast = colIdx === visibleHeaders.length - 1
                        console.log(type)
                        const baseTd = {
                          padding: "11px 18px",
                          borderBottom: "1px solid #f1f5f9",
                          borderRight: !isLast ? "1px solid #f8fafc" : "none",
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
                                    background: getGradient(String(cellValue)),
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 10,
                                    fontWeight: 800,
                                    color: "#fff",
                                    flexShrink: 0,
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.18)"
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
                                    e.currentTarget.style.color = "#1e3a8a"
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.color = "#1d4ed8"
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
                              onClick={() => onTotalLeadsClick(row, header)}
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
                        console.log(cellValue)
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
// /////
// export default function ReportTable({
//   columns,
//   reportName,
//   data,
//   mode = "staff",
//   selectedStaff,
//   drillDown = false,
//   onStaffClick,
//   onSeeAll,
//   onTotalLeadsClick,
// }) {
// console.log(data)
//   const isProductWise =
//     reportName?.toLowerCase().includes("product-wise") ||
//     reportName?.toLowerCase().includes("product wise");
//   const isSalesfunnel = reportName?.toLowerCase().includes("sales funnel");

//   const METRIC_CONFIG = {
//     "Total Leads": {
//       bg: "#dbeafe",
//       text: "#1e40af",
//       border: "#93c5fd",
//       dot: "#3b82f6",
//       glow: "rgba(59,130,246,0.18)",
//     },
//     Converted: {
//       bg: "#dcfce7",
//       text: "#166534",
//       border: "#86efac",
//       dot: "#22c55e",
//       glow: "rgba(34,197,94,0.18)",
//     },
//     Pending: {
//       bg: "#fef9c3",
//       text: "#854d0e",
//       border: "#fde047",
//       dot: "#eab308",
//       glow: "rgba(234,179,8,0.18)",
//     },
//     Lost: {
//       bg: "#ffe4e6",
//       text: "#9f1239",
//       border: "#fda4af",
//       dot: "#f43f5e",
//       glow: "rgba(244,63,94,0.18)",
//     },
//     Count: {
//       bg: "#dbeafe",
//       text: "#1e40af",
//       border: "#93c5fd",
//       dot: "#3b82f6",
//       glow: "rgba(59,130,246,0.18)",
//     },
//   };

//   const AVATAR_GRADIENTS = [
//     "linear-gradient(135deg,#6366f1,#8b5cf6)",
//     "linear-gradient(135deg,#0ea5e9,#6366f1)",
//     "linear-gradient(135deg,#ec4899,#f43f5e)",
//     "linear-gradient(135deg,#14b8a6,#0ea5e9)",
//     "linear-gradient(135deg,#f59e0b,#ef4444)",
//     "linear-gradient(135deg,#84cc16,#14b8a6)",
//   ];

//   const getGradient = (name = "") =>
//     AVATAR_GRADIENTS[name.charCodeAt(0) % AVATAR_GRADIENTS.length];

//   const initials = (name = "") =>
//     name
//       .split(" ")
//       .slice(0, 2)
//       .map((w) => w[0] || "")
//       .join("")
//       .toUpperCase();

//   const getCellType = (col) => {
//     if (
//       isProductWise &&
//       col.type === "staff" &&
//       mode === "staff" &&
//       !drillDown &&
//       onStaffClick
//     )
//       return "staff";

//     if (
//       isProductWise &&
//       ["Total Leads", "Converted", "Pending", "Lost"].includes(col.header) &&
//       onTotalLeadsClick
//     )
//       return "metric";

//     if (isSalesfunnel && col.header === "Count" && onTotalLeadsClick)
//       return "metric";

//     if (col.type) return col.type;
//     return "default";
//   };

//   const visibleColumns = (columns || []).filter((col) => {
// console.log(!isProductWise)
//     if (!isProductWise) return true;
//     if (col.hideIn?.productWise) return false;
//     if (!drillDown) {
//       if (mode === "staff" && col.hideIn?.productWiseStaffMode) return false;
//       if (mode === "product" && col.hideIn?.productWiseProductMode)
//         return false;
//     }
//     return true;
//   });

//   const showTopBar = (drillDown && selectedStaff) || (drillDown && onSeeAll);

//   const footerMetrics = ["Total Leads", "Converted", "Pending", "Lost"].filter(
//     (m) => visibleColumns.some((c) => c.header === m)
//   );
// console.log(visibleColumns)
//   return (
//     <div
//       className="h-full flex flex-col overflow-hidden"
//       style={{
//         background: "#fff",
//         borderRadius: 18,
//         border: "1px solid #e2e8f0",
//         boxShadow:
//           "0 0 0 1px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.07), 0 32px 64px rgba(0,0,0,0.05)",
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
//           borderBottom: "1px solid rgba(255,255,255,0.07)",
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
//               flexShrink: 0,
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
//                 lineHeight: 1.25,
//               }}
//             >
//               {reportName || "Report"}
//             </div>
//             <div
//               style={{
//                 fontSize: 11,
//                 color: "rgba(255,255,255,0.38)",
//                 marginTop: 3,
//               }}
//             >
//               {drillDown && selectedStaff
//                 ? `Drill-down — ${selectedStaff}`
//                 : `${data.length} ${
//                     data.length === 1 ? "record" : "records"
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
//                   border: "1px solid rgba(255,255,255,0.13)",
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
//                     boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
//                   }}
//                 >
//                   {initials(selectedStaff)}
//                 </div>
//                 <span
//                   style={{
//                     fontSize: 12,
//                     fontWeight: 600,
//                     color: "#e2e8f0",
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
//                   transition: "background 0.15s",
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.background = "rgba(56,189,248,0.22)";
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.background = "rgba(56,189,248,0.12)";
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
//                   <path
//                     d="M3 12h18M3 6h18M3 18h18"
//                     strokeLinecap="round"
//                   />
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
//           style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 transparent" }}
//         >
//           <table
//             style={{
//               width: "100%",
//               borderCollapse: "collapse",
//               fontSize: 13,
//             }}
//           >
//             <thead>
//               <tr>
//                 {visibleColumns.map((col, i) => (
//                   <th
//                     key={col.key || col.header}
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
//                       whiteSpace: "nowrap",
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
//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "center",
//                         gap: 14,
//                       }}
//                     >
//                       <div
//                         style={{
//                           width: 54,
//                           height: 54,
//                           borderRadius: 16,
//                           background:
//                             "linear-gradient(135deg,#f1f5f9,#e2e8f0)",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           boxShadow: "inset 0 1px 3px rgba(0,0,0,0.07)",
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
//                           <path
//                             d="M3 9h18M9 21V9"
//                             strokeLinecap="round"
//                           />
//                         </svg>
//                       </div>
//                       <div>
//                         <p
//                           style={{
//                             fontSize: 14,
//                             fontWeight: 700,
//                             color: "#374151",
//                             margin: 0,
//                           }}
//                         >
//                           No records found
//                         </p>
//                         <p
//                           style={{
//                             fontSize: 12,
//                             color: "#9ca3af",
//                             marginTop: 5,
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
//                   const isEven = rowIdx % 2 === 0;

//                   return (
//                     <tr
//                       key={rowIdx}
//                       style={{
//                         background: isEven ? "#ffffff" : "#fafbfd",
//                         transition: "background 0.1s",
//                       }}
//                       onMouseEnter={(e) => {
//                         e.currentTarget.style.background = "#eff6ff";
//                       }}
//                       onMouseLeave={(e) => {
//                         e.currentTarget.style.background = isEven
//                           ? "#ffffff"
//                           : "#fafbfd";
//                       }}
//                     >
//                       {visibleColumns.map((col, colIdx) => {
// console.log(
// "h")
//                         const isFirst = colIdx === 0;
//                         const isLast =
//                           colIdx === visibleColumns.length - 1;

//                         const baseTd = {
//                           padding: "11px 18px",
//                           borderBottom: "1px solid #f1f5f9",
//                           borderRight: !isLast
//                             ? "1px solid #f8fafc"
//                             : "none",
//                           verticalAlign: "middle",
//                           whiteSpace: "nowrap",
//                         };

//                         const value =
//                           typeof col.render === "function"
//                             ? col.render(row)
//                             : col.accessor
//                             ? row[col.accessor]
//                             : row[col.key || col.header];

//                         const type = getCellType(col);

//                         // Staff clickable cell
//                         if (type === "staff") {
//                           const name = String(value || "");
//                           return (
//                             <td
//                               key={col.key || col.header}
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
//                                   gap: 9,
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
//                                       "0 2px 6px rgba(0,0,0,0.18)",
//                                   }}
//                                 >
//                                   {initials(name)}
//                                 </div>
//                                 <span
//                                   style={{
//                                     fontSize: 13,
//                                     fontWeight: 600,
//                                     color: "#1d4ed8",
//                                     transition: "color 0.1s",
//                                   }}
//                                   onMouseEnter={(e) => {
//                                     e.currentTarget.style.color =
//                                       "#1e3a8a";
//                                   }}
//                                   onMouseLeave={(e) => {
//                                     e.currentTarget.style.color =
//                                       "#1d4ed8";
//                                   }}
//                                 >
//                                   {name}
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
//                           );
//                         }

//                         // Metric pill cell
//                         if (type === "metric") {
//                           const cfg =
//                             METRIC_CONFIG[col.header] || {
//                               bg: "#f8fafc",
//                               text: "#374151",
//                               border: "#e2e8f0",
//                               dot: "#94a3b8",
//                               glow: "transparent",
//                             };
//                           return (
//                             <td
//                               key={col.key || col.header}
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
//                                   transition: "box-shadow 0.15s",
//                                 }}
//                                 onMouseEnter={(e) => {
//                                   e.currentTarget.style.boxShadow = `0 0 0 5px ${cfg.glow}`;
//                                 }}
//                                 onMouseLeave={(e) => {
//                                   e.currentTarget.style.boxShadow = `0 0 0 3px ${cfg.glow}`;
//                                 }}
//                               >
//                                 <span
//                                   style={{
//                                     width: 7,
//                                     height: 7,
//                                     borderRadius: "50%",
//                                     background: cfg.dot,
//                                     flexShrink: 0,
//                                     boxShadow: `0 0 4px ${cfg.dot}`,
//                                   }}
//                                 />
//                                 {value ?? "—"}
//                               </span>
//                             </td>
//                           );
//                         }

//                         // Default cell
//                         return (
//                           <td
//                             key={col.key || col.header}
//                             style={{
//                               ...baseTd,
//                               fontSize: 13,
//                               color: isFirst ? "#0f172a" : "#4b5563",
//                               fontWeight: isFirst ? 600 : 400,
//                             }}
//                           >
//                             {value ?? (
//                               <span style={{ color: "#d1d5db" }}>—</span>
//                             )}
//                           </td>
//                         );
//                       })}
//                     </tr>
//                   );
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
//             borderRadius: "0 0 18px 18px",
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
//             <div
//               style={{
//                 width: 6,
//                 height: 6,
//                 borderRadius: "50%",
//                 background:
//                   "linear-gradient(135deg,#3b82f6,#6366f1)",
//               }}
//             />
//             <span style={{ fontSize: 11, color: "#94a3b8" }}>
//               <span
//                 style={{
//                   fontWeight: 700,
//                   color: "#334155",
//                 }}
//               >
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
//                 flexWrap: "wrap",
//               }}
//             >
//               {footerMetrics.map((m) => {
//                 const cfg = METRIC_CONFIG[m];
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
//                       padding: "2px 9px 2px 7px",
//                     }}
//                   >
//                     <span
//                       style={{
//                         width: 5,
//                         height: 5,
//                         borderRadius: "50%",
//                         background: cfg.dot,
//                         flexShrink: 0,
//                       }}
//                     />
//                     {m}
//                   </span>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

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
