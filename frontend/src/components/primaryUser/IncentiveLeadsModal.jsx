// // import { useEffect, useState } from "react"
// // import { X, Search, FileSpreadsheet } from "lucide-react"

// // export default function IncentiveLeadsModal({
// //   user,
// //   allocation,
// //   month,
// //   year,
// //   monthLabel,
// //   fetchIncentiveLeads,
// //   onClose
// // }) {
// //   const [loading, setLoading] = useState(true)
// //   const [leads, setLeads] = useState([])
// //   const [search, setSearch] = useState("")

// //   useEffect(() => {
// //     let active = true
// //     const load = async () => {
// //       setLoading(true)
// //       try {
// //         const res = await fetchIncentiveLeads({
// //           userId: user.userId,
// //           allocationKey: allocation.key,
// //           month,
// //           year
// //         })
// //         if (active) setLeads(res || [])
// //       } catch (e) {
// //         console.log(e)
// //       } finally {
// //         if (active) setLoading(false)
// //       }
// //     }
// //     load()
// //     return () => {
// //       active = false
// //     }
// //   }, [user, allocation, month, year])

// //   const filtered = leads.filter(
// //     (l) =>
// //       l.leadId?.toLowerCase().includes(search.toLowerCase()) ||
// //       l.partyName?.toLowerCase().includes(search.toLowerCase())
// //   )

// //   const total = filtered.reduce((sum, l) => sum + (l.amount || 0), 0)

// //   return (
// //     <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-[60] p-3 sm:p-4">
// //       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden">
// //         {/* Header */}
// //         <div className="flex-shrink-0 px-6 py-4 border-b border-gray-100">
// //           <div className="flex items-start justify-between gap-4">
// //             <div>
// //               <h2 className="text-base font-bold text-gray-900">{allocation.label}</h2>
// //               <p className="text-xs text-gray-500 mt-0.5">
// //                 {user.name} · {monthLabel} {year}
// //               </p>
// //             </div>
// //             <button
// //               onClick={onClose}
// //               className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1.5 transition-colors flex-shrink-0"
// //             >
// //               <X className="w-5 h-5" />
// //             </button>
// //           </div>

// //           <div className="flex items-center justify-between mt-3 gap-3">
// //             <div className="relative flex-1 max-w-xs">
// //               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
// //               <input
// //                 value={search}
// //                 onChange={(e) => setSearch(e.target.value)}
// //                 placeholder="Search lead ID or party..."
// //                 className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
// //               />
// //             </div>
// //             <div className="text-xs font-semibold text-gray-500 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full whitespace-nowrap">
// //               ₹{total.toLocaleString()} total
// //             </div>
// //           </div>
// //         </div>

// //         {/* Table */}
// //         <div className="flex-1 overflow-y-auto">
// //           {loading ? (
// //             <div className="p-6 space-y-2">
// //               {Array.from({ length: 5 }).map((_, i) => (
// //                 <div key={i} className="h-10 rounded-lg bg-gray-100 animate-pulse" />
// //               ))}
// //             </div>
// //           ) : filtered.length === 0 ? (
// //             <div className="flex flex-col items-center justify-center py-16 text-gray-400">
// //               <FileSpreadsheet className="w-8 h-8 mb-2" />
// //               <p className="text-sm font-medium">No leads found</p>
// //             </div>
// //           ) : (
// //             <table className="min-w-full">
// //               <thead className="sticky top-0 bg-gray-50 border-b border-gray-100">
// //                 <tr>
// //                   <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
// //                     Lead ID
// //                   </th>
// //                   <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
// //                     Party Name
// //                   </th>
// //                   <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
// //                     Date
// //                   </th>
// //                   <th className="px-6 py-3 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
// //                     Amount
// //                   </th>
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-gray-50">
// //                 {filtered.map((lead, i) => (
// //                   <tr key={`${lead.leadId}-${i}`} className="hover:bg-blue-50/40 transition-colors">
// //                     <td className="px-6 py-3.5 text-sm font-semibold text-blue-700">
// //                       {lead.leadId}
// //                     </td>
// //                     <td className="px-6 py-3.5 text-sm text-gray-800">{lead.partyName}</td>
// //                     <td className="px-6 py-3.5 text-sm text-gray-500">
// //                       {lead.date
// //                         ? new Date(lead.date).toLocaleDateString("en-GB", {
// //                             day: "2-digit",
// //                             month: "short",
// //                             year: "numeric"
// //                           })
// //                         : "—"}
// //                     </td>
// //                     <td className="px-6 py-3.5 text-sm font-semibold text-gray-900 text-right">
// //                       ₹{Number(lead.amount || 0).toLocaleString()}
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }


// import { useEffect, useState } from "react"
// import { X, Search, FileSpreadsheet } from "lucide-react"

// export default function IncentiveLeadsModal({
//   user,
//   allocation,
//   month,
//   year,
//   monthLabel,
//   fetchIncentiveLeads,
//   onClose
// }) {
//   const [loading, setLoading] = useState(true)
//   const [leads, setLeads] = useState([])
//   const [search, setSearch] = useState("")

//   useEffect(() => {
//     let active = true
//     const load = async () => {
//       setLoading(true)
//       try {
//         const res = await fetchIncentiveLeads({
//           userId: user.userId,
//           allocationKey: allocation.key,
//           month,
//           year
//         })
//         if (active) setLeads(res || [])
//       } catch (e) {
//         console.log(e)
//       } finally {
//         if (active) setLoading(false)
//       }
//     }
//     load()
//     return () => {
//       active = false
//     }
//   }, [user, allocation, month, year, fetchIncentiveLeads])

//   const filtered = leads.filter(
//     (l) =>
//       l.leadId?.toLowerCase().includes(search.toLowerCase()) ||
//       l.partyName?.toLowerCase().includes(search.toLowerCase())
//   )
// console.log(leads)
// console.log(filtered)
//   const total = filtered.reduce((sum, l) => sum + (l.amount || 0), 0)

//   return (
//     <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-[60] p-3 sm:p-4">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden">
//         {/* Header */}
//         <div className="flex-shrink-0 px-6 py-4 border-b border-gray-100">
//           <div className="flex items-start justify-between gap-4">
//             <div>
//               <h2 className="text-base font-bold text-gray-900">{allocation.label}</h2>
//               <p className="text-xs text-gray-500 mt-0.5">
//                 {user.name} · {monthLabel} {year}
//               </p>
//             </div>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1.5 transition-colors flex-shrink-0"
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>

//           <div className="flex items-center justify-between mt-3 gap-3">
//             <div className="relative flex-1 max-w-xs">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
//               <input
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search lead ID or party..."
//                 className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>
//             <div className="text-xs font-semibold text-gray-500 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full whitespace-nowrap">
//               ₹{total.toLocaleString()} total
//             </div>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="flex-1 overflow-y-auto">
//           {loading ? (
//             <div className="p-6 space-y-2">
//               {Array.from({ length: 5 }).map((_, i) => (
//                 <div key={i} className="h-10 rounded-lg bg-gray-100 animate-pulse" />
//               ))}
//             </div>
//           ) : filtered.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-16 text-gray-400">
//               <FileSpreadsheet className="w-8 h-8 mb-2" />
//               <p className="text-sm font-medium">No leads found</p>
//             </div>
//           ) : (
//             <table className="min-w-full">
//               <thead className="sticky top-0 bg-gray-50 border-b border-gray-100">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
//                     Lead ID
//                   </th>
//                   <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
//                     Party Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
//                     Date
//                   </th>
//                   <th className="px-6 py-3 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
//                     Amount
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-50">
//                 {filtered.map((lead, i) => (
//                   <tr
//                     key={`${lead.leadId}-${i}`}
//                     className="hover:bg-blue-50/40 transition-colors"
//                   >
//                     <td className="px-6 py-3.5 text-sm font-semibold text-blue-700">
//                       {lead.leadId}
//                     </td>
//                     <td className="px-6 py-3.5 text-sm text-gray-800">
//                       {lead.partyName}
//                     </td>
//                     <td className="px-6 py-3.5 text-sm text-gray-500">
//                       {lead.date
//                         ? new Date(lead.date).toLocaleDateString("en-GB", {
//                             day: "2-digit",
//                             month: "short",
//                             year: "numeric"
//                           })
//                         : "—"}
//                     </td>
//                     <td className="px-6 py-3.5 text-sm font-semibold text-gray-900 text-right">
//                       ₹{Number(lead.amount || 0).toLocaleString()}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }
import { useEffect, useState } from "react"
import { X, Search, FileSpreadsheet } from "lucide-react"

// Static mock — replace with your real API call later.
// Signature matches what the component expects:
// async ({ userId, allocationKey, month, year }) => [{ leadId, partyName, date, amount }]
const fetchIncentiveLeads = async ({ userId, allocationKey, month, year }) => {
  console.log("fetchIncentiveLeads called with", { userId, allocationKey, month, year })

  // simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return [
    { leadId: "00013", partyName: "capson marketing", date: "2026-08-02", amount: 1500 },
    { leadId: "00021", partyName: "vijaya park", date: "2026-08-04", amount: 2200 },
    { leadId: "00034", partyName: "roy international", date: "2026-08-06", amount: 800 },
    { leadId: "00041", partyName: "mercedez", date: "2026-08-09", amount: 3000 },

  ]
}

export default function IncentiveLeadsModal({
  user = { userId: "u1", name: "Preetha K.P" },
  allocation = { key: "coding", label: "Coding" },
  month = 8,
  year = 2026,
  monthLabel = "August",
  onClose = () => {}
}) {
  const [loading, setLoading] = useState(true)
  const [leads, setLeads] = useState([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetchIncentiveLeads({
          userId: user.userId,
          allocationKey: allocation.key,
          month,
          year
        })
        if (active) setLeads(res || [])
      } catch (e) {
        console.log(e)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [user, allocation, month, year])

  const filtered = leads.filter(
    (l) =>
      l.leadId?.toLowerCase().includes(search.toLowerCase()) ||
      l.partyName?.toLowerCase().includes(search.toLowerCase())
  )

  const total = filtered.reduce((sum, l) => sum + (l.amount || 0), 0)

  return (
    <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-[60] p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-gray-100">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">{allocation.label}</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {user.name} · {monthLabel} {year}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1.5 transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between mt-3 gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search lead ID or party..."
                className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="text-xs font-semibold text-gray-500 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full whitespace-nowrap">
              ₹{total.toLocaleString()} total
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-6 space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 rounded-lg bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FileSpreadsheet className="w-8 h-8 mb-2" />
              <p className="text-sm font-medium">No leads found</p>
            </div>
          ) : (
            <table className="min-w-full">
              <thead className="sticky top-0 bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                    Lead ID
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                    Party Name
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                    Date
                  </th>
                  {/* <th className="px-6 py-3 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                    Amount
                  </th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((lead, i) => (
                  <tr
                    key={`${lead.leadId}-${i}`}
                    className="hover:bg-blue-50/40 transition-colors"
                  >
                    <td className="px-6 py-3.5 text-sm font-semibold text-blue-700">
                      {lead.leadId}
                    </td>
                    <td className="px-6 py-3.5 text-sm text-gray-800">
                      {lead.partyName}
                    </td>
                    <td className="px-6 py-3.5 text-sm text-gray-500">
                      {lead.date
                        ? new Date(lead.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          })
                        : "—"}
                    </td>
                    {/* <td className="px-6 py-3.5 text-sm font-semibold text-gray-900 text-right">
                      ₹{Number(lead.amount || 0).toLocaleString()}
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}