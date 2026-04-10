
// import { useState } from "react"
// import { FancySelect } from "../common/FancySelect"

// export function PerformanceModal({
//   modalOpen,
//   onClose,
//   summary,
//   products,
//   selectedMonth,
//   selectedYear,
//   onMonthChange,
//   onYearChange
// }) {
//   if (!modalOpen) return null

//   const { target, achieved, balance } = summary || {}
//   const [activeMetric, setActiveMetric] = useState("achieved")

//   const monthOptions = [
//     { value: "01", label: "January" },
//     { value: "02", label: "February" },
//     { value: "03", label: "March" },
//     { value: "04", label: "April" },
//     { value: "05", label: "May" },
//     { value: "06", label: "June" },
//     { value: "07", label: "July" },
//     { value: "08", label: "August" },
//     { value: "09", label: "September" },
//     { value: "10", label: "October" },
//     { value: "11", label: "November" },
//     { value: "12", label: "December" }
//   ]

//   const yearOptions = Array.from({ length: 6 }, (_, i) => {
//     const year = new Date().getFullYear() - i
//     return { value: String(year), label: String(year) }
//   })

//   return (
//     <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-3 backdrop-blur-sm">
//       <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl">
//         {/* Header */}
//         <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
//           <div>
//             <h2 className="text-base font-semibold text-slate-900">
//               Performance Summary
//             </h2>
//             <p className="text-xs text-slate-500">
//               Target vs Achieved with product-wise breakdown
//             </p>
//           </div>

//           <div className="flex flex-wrap items-end gap-2">
//             <FancySelect
//               label="Month"
//               value={selectedMonth}
//               options={monthOptions}
//               onChange={onMonthChange}
//               width="min-w-[170px]"
//             />

//             <FancySelect
//               label="Year"
//               value={selectedYear}
//               options={yearOptions}
//               onChange={onYearChange}
//               width="min-w-[120px]"
//             />

//             <button
//               onClick={onClose}
//               className="rounded-full px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100"
//             >
//               Close
//             </button>
//           </div>
//         </div>

//         {/* Clickable summary tiles */}
//         <div className="grid grid-cols-1 gap-3 border-b border-slate-100 px-5 py-3 text-xs sm:grid-cols-3">
//           <SummaryPill
//             label="Target"
//             value={target}
//             tone="slate"
//             active={activeMetric === "target"}
//             onClick={() => setActiveMetric("target")}
//           />
//           <SummaryPill
//             label="Achieved"
//             value={achieved}
//             tone="emerald"
//             active={activeMetric === "achieved"}
//             onClick={() => setActiveMetric("achieved")}
//           />
//           <SummaryPill
//             label="Balance"
//             value={balance}
//             tone="amber"
//             active={activeMetric === "balance"}
//             onClick={() => setActiveMetric("balance")}
//           />
//         </div>

//         {/* Only Achieved shows table */}
//         {activeMetric === "achieved" && (
//           <div className="px-5 pb-4 pt-3">
//             <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
//               <div className="flex items-center gap-2">
//                 <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
//                   <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
//                   Achieved – product wise
//                 </div>

//                 <span className="text-[11px] text-slate-500">
//                   {products?.length || 0} products
//                 </span>
//               </div>

//               <div className="text-[11px] font-medium text-slate-500">
//                 Selected:{" "}
//                 <span className="text-slate-700">
//                   {monthOptions.find((m) => m.value === selectedMonth)?.label}{" "}
//                   {selectedYear}
//                 </span>
//               </div>
//             </div>

//             <div className="overflow-hidden rounded-xl border border-slate-100">
//               <div className="max-h-[280px] overflow-auto">
//                 <table className="min-w-full border-collapse text-xs">
//                   <thead className="sticky top-0 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
//                     <tr>
//                       <th className="px-3 py-2 text-left">Product</th>
//                       <th className="px-3 py-2 text-right">Achieved Value</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-100 bg-white">
//                     {products?.map((p) => (
//                       <tr
//                         key={p.name}
//                         className="transition-colors hover:bg-slate-50/80"
//                       >
//                         <td className="px-3 py-2 text-[12px] text-slate-700">
//                           {p.name}
//                         </td>
//                         <td className="px-3 py-2 text-right text-[12px] font-semibold text-slate-900">
//                           ₹{Number(p.value || 0).toLocaleString("en-IN")}
//                         </td>
//                       </tr>
//                     ))}

//                     {(!products || products.length === 0) && (
//                       <tr>
//                         <td
//                           colSpan={2}
//                           className="px-3 py-6 text-center text-[12px] text-slate-400"
//                         >
//                           No achieved data available.
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Optional placeholder for others */}
//         {activeMetric !== "achieved" && (
//           <div className="px-5 py-8">
//             <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-8 text-center">
//               <p className="text-sm font-medium text-slate-700">
//                 {activeMetric === "target" ? "Target" : "Balance"} details not added yet
//               </p>
//               <p className="mt-1 text-xs text-slate-500">
//                 You can plug a separate table or chart here.
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// function SummaryPill({ label, value, tone, active, onClick }) {
//   const toneMap = {
//     slate: {
//       base: "bg-slate-50 text-slate-700 ring-slate-200",
//       active: "bg-slate-900 text-white ring-slate-900 shadow-lg shadow-slate-200"
//     },
//     emerald: {
//       base: "bg-emerald-50 text-emerald-700 ring-emerald-100",
//       active: "bg-emerald-600 text-white ring-emerald-500 shadow-lg shadow-emerald-100"
//     },
//     amber: {
//       base: "bg-amber-50 text-amber-700 ring-amber-100",
//       active: "bg-amber-500 text-white ring-amber-400 shadow-lg shadow-amber-100"
//     }
//   }

//   const styles = toneMap[tone] || toneMap.slate

//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       className={`
//         group relative flex flex-col justify-between rounded-2xl px-4 py-3 text-left ring-1
//         transition-all duration-200
//         hover:-translate-y-[1px] hover:shadow-md
//         ${active ? styles.active : styles.base}
//       `}
//     >
//       <span
//         className={`text-[11px] font-medium ${
//           active ? "text-white/80" : ""
//         }`}
//       >
//         {label}
//       </span>

//       <span className="mt-2 text-[15px] font-semibold tracking-tight">
//         ₹{Number(value || 0).toLocaleString("en-IN")}
//       </span>

//       <span
//         className={`
//           absolute right-3 top-3 h-2 w-2 rounded-full transition-all
//           ${active ? "bg-white/90 shadow-[0_0_0_4px_rgba(255,255,255,0.15)]" : "bg-current/20"}
//         `}
//       />
//     </button>
//   )
// }
import { useState } from "react"
import { FancySelect } from "../common/FancySelect"

export function PerformanceModal({
  modalOpen,
  onClose,
  summary,
  products,
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange
}) {
  const [activeMetric, setActiveMetric] = useState(null)

  if (!modalOpen) return null

  const { target, achieved, balance } = summary || {}

  const monthOptions = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" }
  ]

  const yearOptions = Array.from({ length: 6 }, (_, i) => {
    const year = new Date().getFullYear() - i
    return { value: String(year), label: String(year) }
  })

  const handleAchievedToggle = () => {
    setActiveMetric((prev) => (prev === "achieved" ? null : "achieved"))
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-3 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Performance Summary
            </h2>
            <p className="text-xs text-slate-500">
              Target vs Achieved with product-wise breakdown
            </p>
          </div>

          <div className="flex flex-wrap items-end gap-2">
            <FancySelect
              label="Month"
              value={selectedMonth}
              options={monthOptions}
              onChange={onMonthChange}
              width="min-w-[170px]"
            />

            <FancySelect
              label="Year"
              value={selectedYear}
              options={yearOptions}
              onChange={onYearChange}
              width="min-w-[120px]"
            />

            <button
              onClick={onClose}
              className="rounded-full px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100"
            >
              Close
            </button>
          </div>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-1 gap-3 border-b border-slate-100 px-5 py-3 text-xs sm:grid-cols-3">
          <SummaryPill label="Target" value={target} tone="slate" />

          <SummaryPill
            label="Achieved"
            value={achieved}
            tone="emerald"
            active={activeMetric === "achieved"}
            clickable
            onClick={handleAchievedToggle}
          />

          <SummaryPill label="Balance" value={balance} tone="amber" />
        </div>

        {/* Achieved table only when active */}
        {activeMetric === "achieved" && (
          <div className="px-5 pb-4 pt-3">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Achieved – product wise
                </div>

                <span className="text-[11px] text-slate-500">
                  {products?.length || 0} products
                </span>
              </div>

              <div className="text-[11px] font-medium text-slate-500">
                Selected:{" "}
                <span className="text-slate-700">
                  {monthOptions.find((m) => m.value === selectedMonth)?.label}{" "}
                  {selectedYear}
                </span>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-100">
              <div className="max-h-[280px] overflow-auto">
                <table className="min-w-full border-collapse text-xs">
                  <thead className="sticky top-0 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-3 py-2 text-left">Product</th>
                      <th className="px-3 py-2 text-right">Achieved Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {products?.map((p) => (
                      <tr
                        key={p.name}
                        className="transition-colors hover:bg-slate-50/80"
                      >
                        <td className="px-3 py-2 text-[12px] text-slate-700">
                          {p.name}
                        </td>
                        <td className="px-3 py-2 text-right text-[12px] font-semibold text-slate-900">
                          ₹{Number(p.value || 0).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}

                    {(!products || products.length === 0) && (
                      <tr>
                        <td
                          colSpan={2}
                          className="px-3 py-6 text-center text-[12px] text-slate-400"
                        >
                          No achieved data available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SummaryPill({
  label,
  value,
  tone,
  active = false,
  clickable = false,
  onClick
}) {
  const toneMap = {
    slate: {
      base: "bg-slate-50 text-slate-700 ring-slate-100",
      active: "bg-slate-900 text-white ring-slate-900 shadow-lg shadow-slate-200"
    },
    emerald: {
      base: "bg-emerald-50 text-emerald-700 ring-emerald-100",
      active: "bg-emerald-600 text-white ring-emerald-500 shadow-lg shadow-emerald-100"
    },
    amber: {
      base: "bg-amber-50 text-amber-700 ring-amber-100",
      active: "bg-amber-500 text-white ring-amber-400 shadow-lg shadow-amber-100"
    }
  }

  const styles = toneMap[tone] || toneMap.slate

  const commonClass = `
    relative flex flex-col justify-between rounded-2xl px-4 py-3 text-left ring-1
    transition-all duration-200
    ${active ? styles.active : styles.base}
    ${clickable ? "cursor-pointer hover:-translate-y-[1px] hover:shadow-md" : "cursor-default"}
  `

  if (clickable) {
    return (
      <button type="button" onClick={onClick} className={commonClass}>
        <span className={`text-[11px] font-medium ${active ? "text-white/80" : ""}`}>
          {label}
        </span>

        <span className="mt-2 text-[15px] font-semibold tracking-tight">
          ₹{Number(value || 0).toLocaleString("en-IN")}
        </span>

        <span
          className={`
            absolute right-3 top-3 h-2 w-2 rounded-full transition-all
            ${active ? "bg-white/90 shadow-[0_0_0_4px_rgba(255,255,255,0.15)]" : "bg-current/20"}
          `}
        />
      </button>
    )
  }

  return (
    <div className={commonClass}>
      <span className="text-[11px] font-medium">{label}</span>

      <span className="mt-2 text-[15px] font-semibold tracking-tight">
        ₹{Number(value || 0).toLocaleString("en-IN")}
      </span>
    </div>
  )
}