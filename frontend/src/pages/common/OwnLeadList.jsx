// import { useEffect, useState } from "react"
// import UseFetch from "../../hooks/useFetch"
// import { useLocation } from "react-router-dom"
// import { useNavigate } from "react-router-dom"
// import { LeadhistoryModal } from "../../components/primaryUser/LeadhistoryModal"
// import SkeletonTable from "../../components/loader/SkeletonTable"
// import NodataAvailable from "../../components/NodataAvailable"
// import {
//   Eye,
//   IndianRupee,
//   ChevronDown,
//   ChevronRight,
//   BellRing
// } from "lucide-react"
// import { getLocalStorageItem } from "../../helper/localstorage"
// import { PropagateLoader } from "react-spinners"

// export default function OwnLeadList() {
//   const [showFullName, setShowFullName] = useState(false)
//   const location = useLocation()
//   const [tableData, setTableData] = useState([])
//   const [loggedUser, setLoggedUser] = useState(null)
//   const [showFullEmail, setShowFullEmail] = useState(false)
//   const [showModal, setShowModal] = useState(false)
//   const [selectedData, setselectedData] = useState([])
//   const [anyOpen, setAnyOpen] = useState(false)
//   const [selectedLeadId, setselectedLeadId] = useState(null)
//   const [ownLead, setownLead] = useState(location?.state?.role ? false : true)
//   const [companyBranches, setcompanyBranches] = useState(null)
//   const [selectedCompanyBranch, setselectedCompanyBranch] = useState(null)
//   const [showhistoryModal, sethistoryModal] = useState(false)
//   const [historyList, setHistoryList] = useState([])
//   const [openRow, setOpenRow] = useState(null)

//   const navigate = useNavigate()

//   const { data: companybranches } = UseFetch("/branch/getBranch")

//   const { data: ownedlead, loading } = UseFetch(
//     loggedUser &&
//       selectedCompanyBranch &&
//       `/lead/ownregisteredLead?userId=${loggedUser._id}&role=${location?.state?.role ? location?.state?.role : loggedUser.role}&selectedBranch=${selectedCompanyBranch}&ownlead=${location?.state?.role ? false : ownLead}`
//   )
//   console.log(location?.state?.role)
//   console.log(location?.state)
//   console.log(ownLead)
//   console.log(ownLead)
//   console.log(ownedlead?.length)
//   useEffect(() => {
//     if (companybranches && companybranches.length > 0) {
//       const userData = getLocalStorageItem("user")
//       const branch = userData?.selected?.map((branch) => ({
//         value: branch.branch_id,
//         label: branch.branchName
//       }))
//       setcompanyBranches(branch)
//       setselectedCompanyBranch(branch[0].value)
//       setLoggedUser(userData)
//     }
//   }, [companybranches])

//   useEffect(() => {
//     if (ownedlead && ownedlead.length > 0) {
//       if (ownLead) {
//         const Data = normalizeTableData(ownedlead)
//         setTableData(Data)
//       } else {
//         const groupedLeads = {}
//         ownedlead.forEach((lead) => {
//           const assignedTo = lead?.leadBy?.name
//           if (!groupedLeads[assignedTo]) groupedLeads[assignedTo] = []
//           groupedLeads[assignedTo].push(lead)
//         })
//         setTableData(normalizeTableData(groupedLeads))
//       }
//     }
//   }, [ownedlead])

//   const normalizeTableData = (data) => {
//     if (Array.isArray(data)) return [{ staffName: null, leads: data }]
//     if (typeof data === "object")
//       return Object.entries(data).map(([staffName, leads]) => ({
//         staffName,
//         leads
//       }))
//     return []
//   }

//   const handleHistory = (Item) => {
//     setselectedData(Item.activityLog)
//     setHistoryList(Item.activityLog)
//     setselectedLeadId(Item.leadId)
//     sethistoryModal(true)
//   }

//   const renderTable = (data) => {
//     const LeadRow = ({ item }) => {
//       const open = openRow === item._id

//       const lastLog = item.activityLog[item.activityLog.length - 1]

//       const followupDate = lastLog?.nextFollowUpDate
//         ? new Date(lastLog.nextFollowUpDate)
//             .toLocaleDateString("en-GB")
//             .split("/")
//             .join("-")
//         : "-"

//       return (
//         <>
//           {/* ================= MAIN ROW ================= */}
//           <tr
//             onClick={() =>
//               setOpenRow((prev) => (prev === item._id ? null : item._id))
//             }
//             className="cursor-pointer bg-white hover:bg-blue-50 border border-gray-300"
//           >
//             {/* Arrow */}
//             <td className="pl-2 pr-1 py-2 w-5 border border-gray-300">
//               {open ? (
//                 <ChevronDown className="w-3.5 h-3.5 text-blue-500" />
//               ) : (
//                 <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
//               )}
//             </td>

//             {/* Name */}
//             <td className="px-3 py-2 border border-gray-300 whitespace-nowrap uppercase">
//               {item.customerName?.customerName || item.customerName}
//             </td>

//             {/* Mobile */}
//             <td className="px-3 py-2 border border-gray-300">{item?.mobile}</td>

//             {/* Last Remark */}
//             <td className="px-3 py-2 border border-gray-300 max-w-[200px]">
//               <span
//                 className="text-red-600 font-medium truncate block"
//                 title={lastLog?.remarks}
//               >
//                 {lastLog?.remarks || "-"}
//               </span>
//             </td>

//             {/* Followup */}
//             <td className="px-3 py-2 border border-gray-300">{followupDate}</td>

//             {/* ✅ GAP AFTER FOLLOWUP */}
//             <td
//               className={`transition-all duration-200 ${
//                 open
//                   ? "w-6 border border-gray-200 bg-white"
//                   : "w-0 p-0 border-0"
//               }`}
//             />

//             {/* Event Log */}
//             <td
//               className="px-2 py-2 border border-gray-300 text-right"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <button
//                 onClick={() => handleHistory(item)}
//                 className="bg-indigo-600 text-white px-2 py-1 rounded w-full flex justify-center"
//               >
//                 <BellRing className="w-4 h-4" />
//               </button>
//             </td>

//             {/* View / Modify */}
//             <td
//               className="px-2 py-2 border border-gray-300 text-right"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <button
//                 onClick={() =>
//                   loggedUser.role === "Admin"
//                     ? navigate("/admin/transaction/lead/leadEdit", {
//                         state: { leadId: item._id }
//                       })
//                     : navigate("/staff/transaction/lead/leadEdit", {
//                         state: { leadId: item._id }
//                       })
//                 }
//                 className="bg-blue-600 text-white px-2 py-1 rounded w-full flex justify-center"
//               >
//                 <Eye className="w-4 h-4" />
//               </button>
//             </td>

//             {/* Net Amount */}
//             <td className="px-3 py-2 text-right border border-gray-300">
//               <span className="inline-flex items-center gap-1">
//                 <IndianRupee className="w-3.5 h-3.5" />
//                 {item.netAmount?.toLocaleString("en-IN")}
//               </span>
//             </td>
//           </tr>

//           {/* ================= SECONDARY ROWS ================= */}
//           {open && (
//             <>
//               {/* Secondary Header */}
//               <tr className="text-xs font-semibold border border-gray-300">
//                 <td className="border border-gray-300 px-3 py-1 bg-blue-50"></td>
//                 <td className="border border-gray-300 px-3 py-1 bg-blue-50">
//                   Lead By
//                 </td>
//                 <td className="border border-gray-300 px-3 py-1 bg-blue-50">
//                   Assigned To
//                 </td>
//                 <td className="border border-gray-300 px-3 py-1 bg-blue-50">
//                   Assigned By
//                 </td>
//                 <td className="border border-gray-300 px-3 py-1 bg-blue-50">
//                   No. of Followups
//                 </td>
//                 <td className="border border-gray-300 px-3 py-1 bg-blue-50">
//                   Lead Date
//                 </td>
//                 <td className="border border-gray-300 px-3 py-1 bg-blue-50">
//                   Lead ID
//                 </td>
//                 <td className="border border-gray-300 px-3 py-1 bg-blue-50 ">
//                   Phone
//                 </td>
//                 <td className="border border-gray-300 px-3 py-1  bg-blue-50">
//                   Email
//                 </td>
//               </tr>

//               {/* Secondary Values */}
//               <tr className="bg-slate-50 text-xs text-gray-700 border border-gray-300 whitespace-nowrap">
//                 <td className="border border-gray-300 px-3 py-1"></td>
//                 <td className="border border-gray-300 px-3 py-1">
//                   {item?.leadBy?.name || "-"}
//                 </td>
//                 <td className="border border-gray-300 px-3 py-1">
//                   {item?.taskallocatedTo?.name || "-"}
//                 </td>
//                 <td className="border border-gray-300 px-3 py-1">
//                   {item?.taskallocatedBy?.name || "-"}
//                 </td>
//                 <td className="border border-gray-300 px-3 py-1">
//                   {item.activityLog.length}
//                 </td>
//                 <td className="border border-gray-300 px-3 py-1">
//                   {item.leadDate?.toString().split("T")[0] || "-"}
//                 </td>
//                 <td className="border border-gray-300 px-3 py-1">
//                   {item?.leadId || "-"}
//                 </td>
//                 <td className="border border-gray-300 px-3 py-1">
//                   {item?.phone || "-"}
//                 </td>
//                 <td className="border border-gray-300 px-3 py-1">
//                   {item?.email || "-"}
//                 </td>
//               </tr>
//             </>
//           )}
//         </>
//       )
//     }

//     return (
//       <table className="border-collapse border border-gray-300 w-full text-sm overflow-auto">
//         <thead className="bg-blue-600 text-white text-xs">
//           <tr>
//             <th className="border border-gray-300 w-5" />
//             <th className="border border-gray-300 px-3 py-1 text-left">Name</th>
//             <th className="border border-gray-300 px-3 py-1 text-left">
//               Mobile
//             </th>
//             <th className="border border-gray-300 px-3 py-1 text-left">
//               Last Remark
//             </th>
//             <th className="border border-gray-300 px-3 py-1 text-left">
//               Followup
//             </th>

//             {/* GAP HEADER */}
//             <th className="border border-gray-300 w-6"></th>

//             <th className="border border-gray-300 px-3 py-1 text-right">
//               Event
//             </th>
//             <th className="border border-gray-300 px-3 py-1 text-right">
//               View / Modify
//             </th>
//             <th className="border border-gray-300 px-3 py-1 text-right">
//               Net Amount
//             </th>
//           </tr>
//         </thead>

//         <tbody>
//           {data.map((item) => (
//             <LeadRow key={item._id} item={item} />
//           ))}
//         </tbody>
//       </table>
//     )
//   }

//   return (
//     <div className="h-full bg-[#ADD8E6]">
//       <div className="flex justify-between items-center md:p-5  p-3">
//         <h2 className="text-lg font-bold">
//           {ownLead ? "Own Lead" : "All Lead"}
//         </h2>
//         <div className="flex justify-end items-center">
//           {loggedUser?.role !== "Staff" && (
//             <>
//               <span className="text-sm whitespace-nowrap font-semibold">
//                 {ownLead ? "Own Lead" : "All Lead"}
//               </span>
//               <button
//                 onClick={() => {
//                   setTableData([])
//                   setownLead(!ownLead)
//                 }}
//                 className={`${
//                   ownLead ? "bg-green-500" : "bg-gray-300"
//                 } w-11 h-6 flex items-center rounded-full transition-colors duration-300 mx-2`}
//               >
//                 <div
//                   className={`${
//                     ownLead ? "translate-x-5" : "translate-x-0"
//                   } w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300`}
//                 ></div>
//               </button>
//             </>
//           )}
//           <select
//             value={selectedCompanyBranch || ""}
//             onChange={(e) => {
//               setTableData([])
//               setselectedCompanyBranch(e.target.value)
//             }}
//             className="border border-gray-300 py-1 rounded-md px-2 focus:outline-none min-w-[150px] mr-2 cursor-pointer"
//           >
//             {companyBranches?.map((branch) => (
//               <option key={branch.value} value={branch.value}>
//                 {branch.label}
//               </option>
//             ))}
//           </select>

//           <button
//             onClick={() =>
//               loggedUser?.role === "Admin"
//                 ? navigate("/admin/transaction/lead")
//                 : navigate("/staff/transaction/lead")
//             }
//             className="bg-black text-white py-1 px-3 rounded-lg shadow-lg hover:bg-gray-600"
//           >
//             New Lead
//           </button>
//         </div>
//       </div>

//       <div className="h-auto overflow-auto rounded-lg overflow-y-auto shadow-xl mx-2 md:mx-3 mb-3 bg-white">
//         <>
//           {loading ? (
//             // While fetching → show skeleton loader only
//             <div className="mx-2 md:mx-4">
//               <SkeletonTable rows={5} columns={6} />
//             </div>
//           ) : (
//             (() => {
//               const hasLeads =
//                 Array.isArray(tableData) &&
//                 tableData.some(
//                   (group) =>
//                     Array.isArray(group.leads) && group.leads.length > 0
//                 )

//               // After fetch, but no data
//               if (!hasLeads || tableData.length === 0) {
//                 return (
//                   <div className="mx-2 md:mx-4">
//                     <NodataAvailable
//                       title="No Lead Available"
//                       message="There are no leads to display for the selected filters or date range."
//                     />
//                   </div>
//                 )
//               }

//               // After fetch, with data → render groups
//               return (
//                 <div className="mx-2 md:mx-4 space-y-4">
//                   {tableData.map(({ staffName, leads }, index) => (
//                     <div key={staffName || `group-${index}`} className="mb-4">
//                       {staffName && (
//                         <h3 className="text-base font-semibold text-gray-800 mb-2">
//                           {staffName}{" "}
//                           <span className="text-sm text-gray-500">
//                             ({leads?.length || 0} Leads)
//                           </span>
//                         </h3>
//                       )}

//                       {Array.isArray(leads) && leads.length > 0 ? (
//                         renderTable(leads)
//                       ) : (
//                         <div className="text-center text-gray-400 py-3 text-sm">
//                           No Lead under {staffName || "this group"}.
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )
//             })()
//           )}
//         </>
//       </div>

//       {showhistoryModal && historyList.length > 0 && (
//         <LeadhistoryModal
//           selectedLeadId={selectedLeadId}
//           historyList={historyList}
//           handlecloseModal={() => sethistoryModal(false)}
//         />
//       )}
//     </div>
//   )
// }








import { useEffect, useState } from "react"
import UseFetch from "../../hooks/useFetch"
import { useLocation, useNavigate } from "react-router-dom"
import { LeadhistoryModal } from "../../components/primaryUser/LeadhistoryModal"
import SkeletonTable from "../../components/loader/SkeletonTable"
import NodataAvailable from "../../components/NodataAvailable"
import { Eye, IndianRupee, ChevronDown, ChevronRight, BellRing } from "lucide-react"
import { getLocalStorageItem } from "../../helper/localstorage"

export default function OwnLeadList() {
  const [tableData, setTableData] = useState([])
  const [loggedUser, setLoggedUser] = useState(null)
  const [selectedLeadId, setselectedLeadId] = useState(null)
  const [ownLead, setownLead] = useState(false)
  const [companyBranches, setcompanyBranches] = useState(null)
  const [selectedCompanyBranch, setselectedCompanyBranch] = useState(null)
  const [showhistoryModal, sethistoryModal] = useState(false)
  const [historyList, setHistoryList] = useState([])
  const [openRow, setOpenRow] = useState(null)

  const location = useLocation()
  const navigate = useNavigate()

  const { data: companybranches } = UseFetch("/branch/getBranch")

  const { data: ownedlead, loading } = UseFetch(
    loggedUser &&
      selectedCompanyBranch &&
      `/lead/ownregisteredLead?userId=${loggedUser._id}&role=${
        location?.state?.role ? location?.state?.role : loggedUser.role
      }&selectedBranch=${selectedCompanyBranch}&ownlead=${
        location?.state?.role ? false : ownLead
      }`
  )

  useEffect(() => {
    if (companybranches && companybranches.length > 0) {
      const userData = getLocalStorageItem("user")
      const branch = userData?.selected?.map((b) => ({
        value: b.branch_id,
        label: b.branchName
      }))
console.log(branch)
      setcompanyBranches(branch)
      setselectedCompanyBranch(branch[0].value)
      setLoggedUser(userData)
      setownLead(location?.state?.role ? false : true)
    }
  }, [companybranches])

  useEffect(() => {
    if (ownedlead && ownedlead.length > 0) {
      if (ownLead) {
        setTableData(normalizeTableData(ownedlead))
      } else {
        const groupedLeads = {}
        ownedlead.forEach((lead) => {
          const assignedTo = lead?.leadBy?.name || "Unknown"
          if (!groupedLeads[assignedTo]) groupedLeads[assignedTo] = []
          groupedLeads[assignedTo].push(lead)
        })
        setTableData(normalizeTableData(groupedLeads))
      }
    } else {
      setTableData([])
    }
  }, [ownedlead, ownLead])

  const normalizeTableData = (data) => {
    if (Array.isArray(data)) return [{ staffName: null, leads: data }]
    if (typeof data === "object")
      return Object.entries(data).map(([staffName, leads]) => ({
        staffName,
        leads
      }))
    return []
  }

  const handleHistory = (item) => {
    setHistoryList(item.activityLog)
    setselectedLeadId(item.leadId)
    sethistoryModal(true)
  }

  const LeadRow = ({ item }) => {
    const open = openRow === item._id
    const lastLog = item.activityLog?.[item.activityLog.length - 1]

    const followupDate = lastLog?.nextFollowUpDate
      ? new Date(lastLog.nextFollowUpDate)
          .toLocaleDateString("en-GB")
          .split("/")
          .join("-")
      : "-"

    return (
      <>
        {/* MAIN ROW */}
        <tr
          onClick={() =>
            setOpenRow((prev) => (prev === item._id ? null : item._id))
          }
          className="cursor-pointer bg-white hover:bg-blue-50 border border-gray-200"
        >
          <td className="pl-2 pr-1 py-2 w-5 border border-gray-200">
            {open ? (
              <ChevronDown className="w-3.5 h-3.5 text-blue-500" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            )}
          </td>

          <td className="px-3 py-2 border border-gray-200 whitespace-nowrap uppercase text-xs">
            {item.customerName?.customerName || item.customerName}
          </td>

          <td className="px-3 py-2 border border-gray-200 text-xs">
            {item?.mobile}
          </td>

          <td className="px-3 py-2 border border-gray-200 max-w-[200px] text-xs">
            <span
              className="text-red-500 font-medium truncate block"
              title={lastLog?.remarks}
            >
              {lastLog?.remarks || "-"}
            </span>
          </td>

          <td className="px-3 py-2 border border-gray-200 text-xs">
            {followupDate}
          </td>

          <td
            className="px-2 py-2 border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => handleHistory(item)}
              className="bg-indigo-600 text-white px-2 py-1 rounded flex justify-center w-full"
            >
              <BellRing className="w-3.5 h-3.5" />
            </button>
          </td>

          <td
            className="px-2 py-2 border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() =>
                loggedUser.role === "Admin"
                  ? navigate("/admin/transaction/lead/leadEdit", {
                      state: { leadId: item._id }
                    })
                  : navigate("/staff/transaction/lead/leadEdit", {
                      state: { leadId: item._id }
                    })
              }
              className="bg-blue-600 text-white px-2 py-1 rounded flex justify-center w-full"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </td>

          <td className="px-3 py-2 text-right border border-gray-200 whitespace-nowrap text-xs">
            <span className="inline-flex items-center gap-0.5">
              <IndianRupee className="w-3 h-3" />
              {item.netAmount?.toLocaleString("en-IN")}
            </span>
          </td>
        </tr>

        {/* SECONDARY ROWS */}
        {open && (
          <>
            <tr className="text-xs font-semibold bg-blue-50 border border-gray-200">
              <td className="border border-gray-200 px-3 py-1" />
              <td className="border border-gray-200 px-3 py-1">Lead By</td>
              <td className="border border-gray-200 px-3 py-1">Assigned To</td>
              <td className="border border-gray-200 px-3 py-1">Assigned By</td>
              <td className="border border-gray-200 px-3 py-1">Followups</td>
              <td className="border border-gray-200 px-3 py-1">Lead Date</td>
              <td className="border border-gray-200 px-3 py-1">Lead ID</td>
              <td className="border border-gray-200 px-3 py-1">Phone</td>
            </tr>

            <tr className="bg-slate-50 text-xs text-gray-600 border border-gray-200 whitespace-nowrap">
              <td className="border border-gray-200 px-3 py-1" />
              <td className="border border-gray-200 px-3 py-1">
                {item?.leadBy?.name || "-"}
              </td>
              <td className="border border-gray-200 px-3 py-1">
                {item?.taskallocatedTo?.name || "-"}
              </td>
              <td className="border border-gray-200 px-3 py-1">
                {item?.taskallocatedBy?.name || "-"}
              </td>
              <td className="border border-gray-200 px-3 py-1">
                {item.activityLog?.length || 0}
              </td>
              <td className="border border-gray-200 px-3 py-1">
                {item.leadDate?.toString().split("T")[0] || "-"}
              </td>
              <td className="border border-gray-200 px-3 py-1">
                {item?.leadId || "-"}
              </td>
              <td className="border border-gray-200 px-3 py-1">
                {item?.phone || "-"}
              </td>
            </tr>
          </>
        )}
      </>
    )
  }

  const renderTable = (data) => (
    <table className="border-collapse border border-gray-200 w-full text-sm">
      <thead className="bg-blue-600 text-white text-xs sticky top-0 z-10">
        <tr>
          <th className="border border-blue-500 w-5" />
          <th className="border border-blue-500 px-3 py-2 text-left">Name</th>
          <th className="border border-blue-500 px-3 py-2 text-left">Mobile</th>
          <th className="border border-blue-500 px-3 py-2 text-left">Last Remark</th>
          <th className="border border-blue-500 px-3 py-2 text-left">Followup</th>
          <th className="border border-blue-500 px-3 py-2 text-center">Event</th>
          <th className="border border-blue-500 px-3 py-2 text-center">View</th>
          <th className="border border-blue-500 px-3 py-2 text-right">Net Amount</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <LeadRow key={item._id} item={item} />
        ))}
      </tbody>
    </table>
  )

  const hasLeads =
    Array.isArray(tableData) &&
    tableData.some(
      (group) => Array.isArray(group.leads) && group.leads.length > 0
    )

  return (
    <div className="h-full bg-[#ADD8E6] flex flex-col overflow-hidden">

      {/* ── Top bar ── */}
      <div className="flex-shrink-0 flex justify-between items-center px-3 py-2 md:px-5">
        <h2 className="text-base font-bold">
          {ownLead ? "Own Lead" : "All Lead"}
        </h2>
        <div className="flex items-center gap-2">
          {loggedUser?.role !== "Staff" && (
            <>
              <span className="text-xs font-semibold whitespace-nowrap">
                {ownLead ? "Own Lead" : "All Lead"}
              </span>
              <button
                onClick={() => {
                  setTableData([])
                  setownLead((prev) => !prev)
                }}
                className={`${
                  ownLead ? "bg-green-500" : "bg-gray-300"
                } w-10 h-5 flex items-center rounded-full transition-colors duration-300`}
              >
                <div
                  className={`${
                    ownLead ? "translate-x-5" : "translate-x-0"
                  } w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300`}
                />
              </button>
            </>
          )}

          <select
            value={selectedCompanyBranch || ""}
            onChange={(e) => {
              setTableData([])
              setselectedCompanyBranch(e.target.value)
            }}
            className="border border-gray-300 py-1 rounded px-2 text-xs focus:outline-none min-w-[130px] cursor-pointer"
          >
            {companyBranches?.map((branch) => (
              <option key={branch.value} value={branch.value}>
                {branch.label}
              </option>
            ))}
          </select>

          <button
            onClick={() =>
              loggedUser?.role === "Admin"
                ? navigate("/admin/transaction/lead")
                : navigate("/staff/transaction/lead")
            }
            className="bg-black text-white text-xs py-1 px-3 rounded shadow hover:bg-gray-700 whitespace-nowrap"
          >
            New Lead
          </button>
        </div>
      </div>

      {/* ── Table container ── */}
      <div className="flex-1 mx-2 md:mx-3 mb-2 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col">
        {loading ? (
          <div className="p-4">
            <SkeletonTable rows={5} columns={8} />
          </div>
        ) : !hasLeads ? (
          <div className="p-4">
            <NodataAvailable
              title="No Lead Available"
              message="There are no leads to display for the selected filters."
            />
          </div>
        ) : (
          /* overflow-auto here makes the table scroll; sticky thead works inside */
          <div className="overflow-auto flex-1">
            {tableData.map(({ staffName, leads }, index) => (
              <div key={staffName || `group-${index}`}>
                {staffName && (
                  <h3 className="text-sm font-semibold text-gray-800 px-3 pt-3 pb-1">
                    {staffName}{" "}
                    <span className="text-xs text-gray-500 font-normal">
                      ({leads?.length || 0} Leads)
                    </span>
                  </h3>
                )}
                {Array.isArray(leads) && leads.length > 0 ? (
                  renderTable(leads)
                ) : (
                  <p className="text-center text-gray-400 py-3 text-xs">
                    No leads under {staffName || "this group"}.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showhistoryModal && historyList.length > 0 && (
        <LeadhistoryModal
          selectedLeadId={selectedLeadId}
          historyList={historyList}
          handlecloseModal={() => sethistoryModal(false)}
        />
      )}
    </div>
  )
}
