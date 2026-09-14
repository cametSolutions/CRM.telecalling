
// import React from "react"
// import { useState } from "react"
// import { useNavigate } from "react-router-dom"
// import { LeadhistoryModal } from "./LeadhistoryModal"
// import LeadModal from "./LeadModal"
// import TasksubmissionModal from "./TasksubmissionModal"
// import NoDataAvailable from "../NodataAvailable"
// import {
//   Eye,
//   IndianRupee,
//   BellRing,
//   ChevronRight,
//   ChevronDown,
//   RefreshCcw
// } from "lucide-react"

// export default function LeadTaskComponent({
//   type,
//   Data,
//   loading,
//   loggedUser,
//   refresh,
//   pending,
// ownTask
// }) {
// console.log(Data)
//   const [selectedData, setselectedData] = useState({})
//   const [historyList, setHistoryList] = useState([])
//   const [showComponent, setShowComponent] = useState(false)
//   const [selectedleadId, setselectedleadId] = useState(null)
//   const [showhistoryModal, sethistoryModal] = useState(false)

//   const navigate = useNavigate()

//   // when type is leadTask and pending is false → compact mode
//   const isLeadTaskClosed = type === "leadTask" && !pending

//   const getRemainingDays = (dueDate) => {
//     const today = new Date()
//     const target = new Date(dueDate)
//     today.setHours(0, 0, 0, 0)
//     target.setHours(0, 0, 0, 0)
//     return Math.ceil((target - today) / (1000 * 60 * 60 * 24))
//   }

//   const handleHistory = (item) => {
//     setselectedData(item.activityLog)
//     setHistoryList(item.activityLog)
//     setselectedleadId(item.leadId)
//     sethistoryModal(true)
//   }

//   const handlecloseModal = () => {
//     setselectedData([])
//     setHistoryList([])
//     sethistoryModal(false)
//     setselectedleadId(null)
//   }
// console.log(Data)
//   const renderTable = (data) => {
//     const LeadRow = ({ item, index }) => {
// console.log(item)
//       const [open, setOpen] = useState(false)

//       const lastLog = item.activityLog[item.activityLog.length - 1]

//       const followupDate =
//         pending && lastLog?.nextFollowUpDate
//           ? new Date(lastLog.nextFollowUpDate)
//               .toLocaleDateString("en-GB")
//               .split("/")
//               .join("-")
//           : "-"

//       const isAllocatedToeditable = item.activityLog.some(
//         (it) =>
//           it?.taskallocatedTo?._id === loggedUser._id &&
//           it?.taskClosed === false
//       )

//       return (
//         <>
//           {/* ── Main row ── */}
//           <tr
//             onClick={() => setOpen((v) => !v)}
//             className="cursor-pointer bg-white hover:bg-blue-50 transition-colors border border-gray-200"
//           >
//             {/* Arrow */}
//             <td className="pl-2 pr-1 py-2 w-5 border border-gray-200">
//               {open ? (
//                 <ChevronDown className="w-3.5 h-3.5 text-blue-500" />
//               ) : (
//                 <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
//               )}
//             </td>

//             {/* Name */}
//             <td className="px-3 py-2 font-semibold text-gray-900 text-xs border border-gray-200 whitespace-nowrap uppercase">
//               {item?.customerName?.customerName || item?.customerName}
//             </td>

//             {/* Mobile */}
//             <td className="px-3 py-2 text-gray-700 text-xs border border-gray-200 whitespace-nowrap">
//               {item?.mobile}
//             </td>

//             {/* pending‑only columns */}
//             {pending && (
//               <>
//                 <td className="px-3 py-2 text-xs border border-gray-200">
//                   <span className="text-red-600 font-medium">
//                     {new Date(
//                       item?.matchedlog?.allocationDate
//                     ).toLocaleDateString("en-GB")}
//                   </span>
//                 </td>
//                 <td className="px-3 py-2 text-xs text-blue-600 border border-gray-200 whitespace-nowrap">
//                   {getRemainingDays(item?.matchedlog?.allocationDate)} days left
//                 </td>
//                 <td className="px-3 py-2 text-xs text-red-600 border border-gray-200 whitespace-nowrap">
//                   {item?.matchedlog?.remarks}
//                 </td>
//               </>
//             )}

//             {/* Event Log */}
//             <td
//               className="px-2 py-2 border border-gray-200"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <button
//                 type="button"
//                 onClick={() => handleHistory(item)}
//                 className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-white bg-indigo-600 rounded hover:bg-indigo-700 w-full justify-center"
//               >
//                 <BellRing className="w-3.5 h-3.5" />
//               </button>
//             </td>

//             {/* View / Modify */}
//             <td
//               className="px-2 py-2 border border-gray-200"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <button
//                 type="button"
//                 onClick={() =>
//                   loggedUser.role === "Admin"
//                     ? navigate("/admin/transaction/lead/leadEdit", {
//                         state: {
//                           leadId: item.leadDocId,
//                           isReadOnly:true
//                         }
//                       })
//                     : navigate("/staff/transaction/lead/leadEdit", {
//                         state: {
//                           leadId: item.leadDocId,
//                           isReadOnly: true
//                         }
//                       })
//                 }
//                 className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 w-full justify-center"
//               >
//                 <Eye className="w-3.5 h-3.5" />
//               </button>
//             </td>

//             {/* Update button (pending only) */}
//             {pending &&ownTask&& (
//               <td
//                 className="px-2 py-2 border border-gray-200"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowComponent(true)
//                     setselectedData(item)
//                   }}
//                   className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-white bg-amber-500 rounded hover:bg-amber-600 w-full justify-center"
//                 >
//                   <RefreshCcw className="w-3.5 h-3.5" />
//                 </button>
//               </td>
//             )}

//             {/* Net Amount */}
//             <td className="px-3 py-2 text-xs font-semibold text-green-700 border border-gray-200 whitespace-nowrap text-center">
//               <span className="inline-flex items-center gap-0.5 justify-center">
//                 <IndianRupee className="w-3 h-3" />
//                 {item.netAmount?.toLocaleString("en-IN")}
//               </span>
//             </td>
//           </tr>

//           {/* ── Expanded rows ── */}
//           {open && (
//             <>
//               {/* Sub-header */}
//               <tr className="text-xs font-medium border border-gray-200 bg-blue-50 whitespace-nowrap">
//                 <td className="border border-gray-200 px-3 py-1" />
//                 <td className="px-3 py-1 border border-gray-200 text-gray-600">
//                   Lead By
//                 </td>
//                 <td className="px-3 py-1 border border-gray-200 text-gray-600">
//                   Assigned To
//                 </td>
//                 <td className="px-3 py-1 border border-gray-200 text-gray-600">
//                   Assigned By
//                 </td>

//                 {/* isLeadTaskClosed: show Lead ID, skip No. of Followups */}
//                 {isLeadTaskClosed ? (
//                   <td className="px-3 py-1 border border-gray-200 text-gray-600">
//                     Lead ID
//                   </td>
//                 ) : (
//                   <>
//                     <td className="px-3 py-1 border border-gray-200 text-gray-600 text-center">
//                       No. of Calls
//                     </td>
//                     {pending &&ownTask&& (
//                       <td className="px-3 py-1 border border-gray-200" />
//                     )}
//                   </>
//                 )}

//                 <td className="px-3 py-1 border border-gray-200 text-gray-600">
//                   Lead Date
//                 </td>

//                 {/* show Lead ID in normal mode */}
//                 {!isLeadTaskClosed && (
//                   <td className="px-3 py-1 border border-gray-200 text-gray-600">
//                     Lead ID
//                   </td>
//                 )}

//                 {/* Phone & Email only when NOT isLeadTaskClosed */}
//                 {!isLeadTaskClosed && (
//                   <>
//                     <td className="px-3 py-1 border border-gray-200 text-gray-600">
//                       Phone
//                     </td>
//                     <td className="px-3 py-1 border border-gray-200 text-gray-600">
//                       Product Name
//                     </td>
//                   </>
//                 )}
//               </tr>

//               {/* Sub-values */}
//               <tr className="bg-white text-xs border border-gray-200 whitespace-nowrap">
//                 <td className="border border-gray-200 px-3 py-1" />
//                 <td className="px-3 py-1.5 border border-gray-200">
//                   {item?.leadBy?.name || "-"}
//                 </td>
//                 <td className="px-3 py-1.5 border border-gray-200">
//                   {item?.taskallocatedTo?.name || "-"}
//                 </td>
//                 <td className="px-3 py-1.5 border border-gray-200">
//                   {item?.taskallocatedBy?.name || "-"}
//                 </td>

//                 {isLeadTaskClosed ? (
//                   // Lead ID in place of No. of Followups
//                   <td className="px-3 py-1.5 border border-gray-200 font-bold text-blue-700">
//                     {item?.leadId || "-"}
//                   </td>
//                 ) : (
//                   <>
//                     <td className="px-3 py-1.5 border border-gray-200 text-center">
//                       {/* {item.activityLog?.length || 0} */}
//  {item?.activityLog?.filter(
//                   (log) =>
//                     log?.taskBy?.taskName?.toLowerCase() === "followup" &&
//                     log?.nextFollowUpDate
//                 ).length || 0}
//                     </td>
//                     {pending &&ownTask&& (
//                       <td className="px-3 py-1.5 border border-gray-200" />
//                     )}
//                   </>
//                 )}

//                 <td className="px-3 py-1.5 border border-gray-200">
//                   {item.leadDate?.toString().split("T")[0] || "-"}
//                 </td>

//                 {/* Lead ID in normal mode */}
//                 {!isLeadTaskClosed && (
//                   <td className="px-3 py-1.5 border border-gray-200 font-bold text-blue-700">
//                     {item?.leadId || "-"}
//                   </td>
//                 )}

//                 {/* Phone & Email only when NOT isLeadTaskClosed */}
//                 {!isLeadTaskClosed && (
//                   <>
//                     <td className="px-3 py-1.5 border border-gray-200">
//                       {item?.phone || "-"}
//                     </td>
//                     <td className="px-3 py-1.5 border border-gray-200 text-blue-500 font-medium">
//                       {item?.leadFor[0]?.productorServiceId?.shortName || item?.leadFor[0]?.productorServiceId?.productName||"-"}
//                     </td>
//                   </>
//                 )}
//               </tr>
//             </>
//           )}
//         </>
//       )
//     }

//     // column count for empty state colspan
//     const colCount = isLeadTaskClosed
//       ? 6   // arrow + name + mobile + event + view + netAmount
//       : pending
//       ? 10
//       : 7

//     return (
//       <table className="border-collapse border border-gray-200 w-full text-sm">
//         <thead className="whitespace-nowrap bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0 z-30 text-xs">
//           <tr>
//             <th className="border border-blue-500 w-5" />
//             <th className="border border-blue-500 px-3 py-2 text-left">Customer Name</th>
//             <th className="border border-blue-500 px-3 py-2 text-left">Mobile</th>

//             {pending && (
//               <>
//                 <th className="border border-blue-500 px-3 py-2 text-left">Due Date</th>
//                 <th className="border border-blue-500 px-3 py-2 text-left">Remaining Days</th>
//                 <th className="border border-blue-500 px-3 py-2 text-center">Remark</th>
//               </>
//             )}

//             <th className="border border-blue-500 px-3 py-2 text-center">Event Log</th>
//             <th className="border border-blue-500 px-3 py-2 text-center">View </th>

//             {pending &&ownTask&& (
//               <th className="border border-blue-500 px-3 py-2 text-center">Update</th>
//             )}

//             <th className="border border-blue-500 px-3 py-2 text-center">Net Amount</th>
//           </tr>
//         </thead>

//         <tbody>
//           {data?.length > 0 ? (
//             data.map((item, index) => (
//               <LeadRow key={item._id ?? index} item={item} index={index} />
//             ))
//           ) : (
//             <tr>
//               <td colSpan={colCount} className="text-center py-6 text-gray-400 text-xs">
//                 No Leads
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     )
//   }

//   return (
//     <div className="overflow-auto rounded-lg shadow-xl md:mx-5 mx-3 mb-3 bg-white">
//       {(() => {
//         const hasLeads =
//           Array.isArray(Data) &&
//           Data.some(
//             (group) => Array.isArray(group.leads) && group.leads.length > 0
//           )

//         if (!hasLeads || Data.length === 0) {
//           return (
           
// <NoDataAvailable/>
//           )
//         }

//         return Data.map(({ staffName, leads }, index) => (
//           <div key={staffName || `group-${index}`} className="mb-4">
//             {staffName && (
//               <h3 className="text-sm font-semibold text-gray-800 px-3 pt-3 pb-1">
//                 {staffName}{" "}
//                 <span className="text-xs text-gray-500 font-normal">
//                   ({leads?.length || 0} Leads)
//                 </span>
//               </h3>
//             )}
//             {leads.length > 0 ? (
//               renderTable(leads)
//             ) : (
//               <div className="text-center text-gray-400 py-3 text-xs">
//                 No Task under {staffName || "this group"}.
//               </div>
//             )}
//           </div>
//         ))
//       })()}

//       {showhistoryModal && historyList && historyList.length > 0 && (
//         <LeadhistoryModal
//           selectedLeadId={selectedleadId}
//           historyList={historyList}
//           handlecloseModal={handlecloseModal}
//         />
//       )}

//       {showComponent && (
//         <TasksubmissionModal
//           task={selectedData}
//           refresh={refresh}
//           pending={pending}
//           setShowComponent={setShowComponent}
//         />
//       )}
//     </div>
//   )
// }

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LeadhistoryModal } from "./LeadhistoryModal";
import TasksubmissionModal from "./TasksubmissionModal";
import NoDataAvailable from "../NodataAvailable";
import {
  Eye,
  IndianRupee,
  BellRing,
  ChevronRight,
  ChevronDown,
  RefreshCcw,
} from "lucide-react";

export default function LeadTaskComponent({
  type,
  Data,
  loading,
  loggedUser,
  refresh,
  pending,
  ownTask,
}) {
  const [selectedData, setselectedData] = useState({});
  const [historyList, setHistoryList] = useState([]);
  const [showComponent, setShowComponent] = useState(false);
  const [selectedleadId, setselectedleadId] = useState(null);
  const [showhistoryModal, sethistoryModal] = useState(false);

  const navigate = useNavigate();
  const isLeadTaskClosed = type === "leadTask" && !pending;

  const getRemainingDays = (dueDate) => {
    const today = new Date();
    const target = new Date(dueDate);

    if (Number.isNaN(target.getTime())) return "-";

    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  };

  const handleHistory = (item) => {
    const logs = Array.isArray(item?.activityLog)
      ? item.activityLog.filter(Boolean)
      : [];

    setselectedData(logs);
    setHistoryList(logs);
    setselectedleadId(item?.leadId || null);
    sethistoryModal(true);
  };

  const handlecloseModal = () => {
    setselectedData([]);
    setHistoryList([]);
    sethistoryModal(false);
    setselectedleadId(null);
  };

  const renderTable = (data) => {
    const LeadRow = ({ item, index }) => {
      const [open, setOpen] = useState(false);
      const activityLogs = Array.isArray(item?.activityLog)
        ? item.activityLog.filter(Boolean)
        : [];
      const lastLog = activityLogs[activityLogs.length - 1];
      const remark = item?.matchedlog?.remarks;
      const customerName =
        item?.customerName?.customerName || item?.customerName || "-";

      const isAllocatedToeditable = activityLogs.some(
        (it) =>
          String(it?.taskallocatedTo?._id || it?.taskallocatedTo) ===
            String(loggedUser?._id) && it?.taskClosed === false
      );

      return (
        <>
          <tr
            onClick={() => setOpen((v) => !v)}
            className="cursor-pointer bg-white hover:bg-blue-50 transition-colors border border-gray-200"
          >
            <td className="pl-2 pr-1 py-2 w-5 border border-gray-200">
              {open ? (
                <ChevronDown className="w-3.5 h-3.5 text-blue-500" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              )}
            </td>

            <td className="max-w-0 overflow-hidden border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-900">
              <span
                title={customerName}
                className="block w-full truncate uppercase"
              >
                {customerName}
              </span>
            </td>

            <td className="px-3 py-2 text-gray-700 text-xs border border-gray-200 whitespace-nowrap">
              {item?.mobile || "-"}
            </td>

            {pending && (
              <>
                <td className="px-3 py-2 text-xs border border-gray-200 whitespace-nowrap">
                  <span className="text-red-600 font-medium">
                    {item?.matchedlog?.allocationDate
                      ? new Date(item.matchedlog.allocationDate).toLocaleDateString(
                          "en-GB"
                        )
                      : "-"}
                  </span>
                </td>

                <td className="px-3 py-2 text-xs text-blue-600 border border-gray-200 whitespace-nowrap">
                  {getRemainingDays(item?.matchedlog?.allocationDate)} days left
                </td>

                {/* Layout fix: text is truncated, tooltip shows the full remark. */}
                <td className="relative px-3 py-2 text-xs border border-gray-200">
                  {remark ? (
                    <div className="group relative min-w-0" tabIndex={0}>
                      <p
                        title={remark}
                        className="cursor-help truncate text-red-600"
                      >
                        {remark}
                      </p>

                      <div
                        role="tooltip"
                        className="pointer-events-none absolute left-0 top-full z-50 mt-2 hidden w-max max-w-[min(22rem,calc(100vw-2rem))] rounded-lg bg-slate-900 px-3 py-2 text-xs leading-5 text-white shadow-xl lg:group-hover:block lg:group-focus:block"
                      >
                        <span className="block whitespace-normal break-words">
                          {remark}
                        </span>
                        <span className="absolute -top-1 left-4 h-2 w-2 rotate-45 bg-slate-900" />
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </>
            )}

            <td
              className="px-2 py-2 border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => handleHistory(item)}
                title="Event Log"
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-white bg-indigo-600 rounded hover:bg-indigo-700 w-full justify-center"
              >
                <BellRing className="w-3.5 h-3.5" />
              </button>
            </td>

            <td
              className="px-2 py-2 border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() =>
                  loggedUser?.role === "Admin"
                    ? navigate("/admin/transaction/lead/leadEdit", {
                        state: {
                          leadId: item?.leadDocId,
                          isReadOnly: true,
                        },
                      })
                    : navigate("/staff/transaction/lead/leadEdit", {
                        state: {
                          leadId: item?.leadDocId,
                          isReadOnly: true,
                        },
                      })
                }
                title="View Lead"
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 w-full justify-center"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </td>

            {pending && ownTask && (
              <td
                className="px-2 py-2 border border-gray-200"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowComponent(true);
                    setselectedData(item);
                  }}
                  title="Update Task"
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-white bg-amber-500 rounded hover:bg-amber-600 w-full justify-center"
                >
                  <RefreshCcw className="w-3.5 h-3.5" />
                </button>
              </td>
            )}

            <td className="px-3 py-2 text-xs font-semibold text-green-700 border border-gray-200 whitespace-nowrap text-center">
              <span className="inline-flex items-center gap-0.5 justify-center">
                <IndianRupee className="w-3 h-3" />
                {Number(item?.netAmount || 0).toLocaleString("en-IN")}
              </span>
            </td>
          </tr>

          {open && (
            <>
              <tr className="text-xs font-medium border border-gray-200 bg-blue-50">
                <td className="border border-gray-200 px-3 py-1" />
                <td className="px-3 py-1 border border-gray-200 text-gray-600">
                  Lead By
                </td>
                <td className="px-3 py-1 border border-gray-200 text-gray-600">
                  Assigned To
                </td>
                <td className="px-3 py-1 border border-gray-200 text-gray-600">
                  Assigned By
                </td>

                {isLeadTaskClosed ? (
                  <td className="px-3 py-1 border border-gray-200 text-gray-600">
                    Lead ID
                  </td>
                ) : (
                  <>
                    <td className="px-3 py-1 border border-gray-200 text-gray-600 text-center">
                      No. of Calls
                    </td>
                    {pending && ownTask && (
                      <td className="px-3 py-1 border border-gray-200" />
                    )}
                  </>
                )}

                <td className="px-3 py-1 border border-gray-200 text-gray-600">
                  Lead Date
                </td>

                {!isLeadTaskClosed && (
                  <td className="px-3 py-1 border border-gray-200 text-gray-600">
                    Lead ID
                  </td>
                )}

                {!isLeadTaskClosed && (
                  <>
                    <td className="px-3 py-1 border border-gray-200 text-gray-600">
                      Phone
                    </td>
                    <td className="px-3 py-1 border border-gray-200 text-gray-600">
                      Product Name
                    </td>
                  </>
                )}
              </tr>

              <tr className="bg-white text-xs border border-gray-200">
                <td className="border border-gray-200 px-3 py-1" />
                <td className="px-3 py-1.5 border border-gray-200">
                  {item?.leadBy?.name || "-"}
                </td>
                <td className="px-3 py-1.5 border border-gray-200">
                  {item?.taskallocatedTo?.name || "-"}
                </td>
                <td className="px-3 py-1.5 border border-gray-200">
                  {item?.taskallocatedBy?.name || "-"}
                </td>

                {isLeadTaskClosed ? (
                  <td className="px-3 py-1.5 border border-gray-200 font-bold text-blue-700">
                    {item?.leadId || "-"}
                  </td>
                ) : (
                  <>
                    <td className="px-3 py-1.5 border border-gray-200 text-center">
                      {activityLogs.filter(
                        (log) =>
                          log?.taskBy?.taskName?.toLowerCase() === "followup" &&
                          log?.nextFollowUpDate
                      ).length || 0}
                    </td>
                    {pending && ownTask && (
                      <td className="px-3 py-1.5 border border-gray-200" />
                    )}
                  </>
                )}

                <td className="px-3 py-1.5 border border-gray-200">
                  {item?.leadDate?.toString().split("T")[0] || "-"}
                </td>

                {!isLeadTaskClosed && (
                  <td className="px-3 py-1.5 border border-gray-200 font-bold text-blue-700">
                    {item?.leadId || "-"}
                  </td>
                )}

                {!isLeadTaskClosed && (
                  <>
                    <td className="px-3 py-1.5 border border-gray-200">
                      {item?.phone || "-"}
                    </td>
                    <td className="px-3 py-1.5 border border-gray-200 text-blue-500 font-medium">
                      {item?.leadFor?.[0]?.productorServiceId?.shortName ||
                        item?.leadFor?.[0]?.productorServiceId?.productName ||
                        "-"}
                    </td>
                  </>
                )}
              </tr>
            </>
          )}
        </>
      );
    };

    const colCount = isLeadTaskClosed ? 6 : pending ? (ownTask ? 10 : 9) : 6;

    return (
      <table className="border-collapse border border-gray-200 w-full min-w-[780px] table-fixed text-sm lg:min-w-0">
        <thead className="whitespace-nowrap bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0 z-30 text-xs">
          <tr>
            <th className="border border-blue-500 w-5" />
            <th className="w-[18%] border border-blue-500 px-3 py-2 text-left">
              Customer Name
            </th>
            <th className="border border-blue-500 px-3 py-2 text-left">Mobile</th>

            {pending && (
              <>
                <th className="border border-blue-500 px-3 py-2 text-left">Due Date</th>
                <th className="border border-blue-500 px-3 py-2 text-left">Remaining Days</th>
                <th className="border border-blue-500 px-3 py-2 text-center">Remark</th>
              </>
            )}

            <th className="border border-blue-500 px-3 py-2 text-center">Event Log</th>
            <th className="border border-blue-500 px-3 py-2 text-center">View</th>

            {pending && ownTask && (
              <th className="border border-blue-500 px-3 py-2 text-center">Update</th>
            )}

            <th className="border border-blue-500 px-3 py-2 text-center">Net Amount</th>
          </tr>
        </thead>

        <tbody>
          {data?.length > 0 ? (
            data.map((item, index) => (
              <LeadRow key={item?._id ?? index} item={item} index={index} />
            ))
          ) : (
            <tr>
              <td colSpan={colCount} className="text-center py-6 text-gray-400 text-xs">
                No Leads
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };

  const hasLeads =
    Array.isArray(Data) &&
    Data.some((group) => Array.isArray(group?.leads) && group.leads.length > 0);

  return (
    <div className="overflow-x-auto overflow-y-visible rounded-lg shadow-xl md:mx-5 mx-3 mb-3 bg-white lg:overflow-x-visible">
      {!hasLeads || Data?.length === 0 ? (
        <NoDataAvailable />
      ) : (
        Data.map(({ staffName, leads }, index) => (
          <div key={staffName || `group-${index}`} className="mb-4">
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
              <div className="text-center text-gray-400 py-3 text-xs">
                No Task under {staffName || "this group"}.
              </div>
            )}
          </div>
        ))
      )}

      {showhistoryModal && historyList.length > 0 && (
        <LeadhistoryModal
          selectedLeadId={selectedleadId}
          historyList={historyList}
          handlecloseModal={handlecloseModal}
        />
      )}

      {showComponent && (
        <TasksubmissionModal
          task={selectedData}
          refresh={refresh}
          pending={pending}
          setShowComponent={setShowComponent}
        />
      )}
    </div>
  );
}
