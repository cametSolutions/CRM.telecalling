// // export const LeadhistoryModal = ({
// //   selectedLeadId,
// //   historyList,
// //   handlecloseModal
// // }) => {
// //   console.log(historyList)
// //   return (
// //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50 ">
// //       <div className="bg-white shadow-xl   text-center md:w-auto w-full px-2 md:px-5 rounded-lg pb-3 ">
// //         <div className="font-semibold space-x-6 mb-1 text-blue-500">
// //           <h2 className="text-lg underline decoration-2 underline-offset-8">
// //             History
// //           </h2>
// //         </div>

// //         <h1 className=" font-bold">{` LEAD ID - ${selectedLeadId}`}</h1>

// //         <div className="overflow-x-auto overflow-y-auto  md:max-h-64 lg:max-h-96 shadow-xl rounded-lg">
// //           <table className="w-full text-sm border-collapse">
// //             <thead className="text-center sticky top-0 z-10">
// //               <tr className="bg-indigo-100">
// //                 <th className="border border-indigo-200 p-2 min-w-[100px] ">
// //                   Date
// //                 </th>
// //                 <th className="border border-indigo-200 p-2 min-w-[100px] ">
// //                   User
// //                 </th>
// //                 <th className="border border-indigo-200 p-2 min-w-[100px] ">
// //                   Task
// //                 </th>
// //                 <th className="border border-indigo-200 p-2 w-fit min-w-[200px]">
// //                   Remarks
// //                 </th>
// //                 <th className="border border-indigo-200 p-2 min-w-[100px] text-nowrap">
// //                   Next FollowUp Date
// //                 </th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {historyList && historyList.length > 0 ? (
// //                 historyList.map((item, index) => {
// //                   console.log(item)
// //                   const hasFollowerData =
// //                     Array.isArray(item.folowerData) &&
// //                     item.folowerData.length > 0
// //                   console.log(hasFollowerData)
// // console.log(item)
// //                   return hasFollowerData ? (
// //                     item.folowerData.map((subItem, subIndex) => (
// //                       <tr
// //                         key={`${index}-${subIndex}`}
// //                         className={
// //                           (index + subIndex) % 2 === 0
// //                             ? "bg-gray-50"
// //                             : "bg-white"
// //                         }
// //                       >
// //                         <td className="border border-gray-200 p-2">
// //                           {new Date(subItem.followerDate)
// //                             .toLocaleDateString("en-GB")
// //                             .split("/")
// //                             .join("-")}
// //                         </td>
// //                         <td className="border border-gray-200 p-2">
// //                           {item?.followedId?.name}
// //                         </td>

// //                         <td className="border border-gray-200 p-2">
// //                           {subItem?.followerDescription || "N/A"}
// //                         </td>
// //                         <td className="border border-gray-200 p-2"></td>
// //                       </tr>
// //                     ))
// //                   ) : (
// //                     <tr
// //                       key={item._id}
// //                       className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
// //                     >
// //                       <td className="border border-gray-200 p-2 text-nowrap">
// //                         {new Date(item.submissionDate)
// //                           .toLocaleDateString("en-GB")
// //                           .split("/")
// //                           .join("-")}
// //                       </td>
// //                       <td className="border border-gray-200 p-2 text-nowrap">
// //                         {item?.submittedUser?.name}
// //                       </td>
// //                       <td className="border border-gray-200 p-2 min-w-[160px] text-nowrap">
// //                         <div className="flex justify-center">
// //                           {item?.taskTo ? (
// //                             <>
// //                               <span>{item?.taskBy?.taskName}</span>-
// //                               <span className="mx-1">
// //                                 {item?.taskallocatedTo?.name}
// //                               </span>
// //                               -
// //                             </>
// //                           ) : (
// //                             (item?.taskBy?.taskName ?? "")
// //                           )}
// //                           {item?.taskId && (
// //                             <>
// //                               <span className="text-red-600 mx-1">
// //                                 {item?.taskId?.taskName}
// //                               </span>
// //                               {item.allocationDate && (
// //                                 <span>
// //                                   -on(
// //                                   {new Date(
// //                                     item.allocationDate
// //                                   ).toLocaleDateString("en-GB")}
// //                                   )
// //                                 </span>
// //                               )}
// //                             </>
// //                           )}
// //                         </div>
// //                       </td>
// //                       <td className="border border-gray-200 p-2">
// //                         {item?.remarks || item?.changeReason}
// //                       </td>
// //                       <td className="border border-gray-200 p-2">
// //                         {item?.nextFollowUpDate
// //                           ? new Date(item?.nextFollowUpDate)
// //                               .toLocaleDateString("en-GB")
// //                               .split("/")
// //                               .join("-")
// //                           : "-"}
// //                       </td>
// //                     </tr>
// //                   )
// //                 })
// //               ) : (
// //                 <tr>
// //                   <td
// //                     colSpan={4}
// //                     className="text-center bg-white p-3 text-gray-500 italic"
// //                   >
// //                     No followUp s
// //                   </td>
// //                 </tr>
// //               )}
// //             </tbody>
// //           </table>
// //         </div>

// //         <button
// //           onClick={() => handlecloseModal()}
// //           className="bg-gray-500 hover:bg-gray-600 rounded-lg px-3 py-1 mt-3 text-white "
// //         >
// //           CLOSE
// //         </button>
// //       </div>
// //     </div>
// //   )
// // }

// import { useEffect, useMemo } from "react";
// import {
//   CalendarDays,
//   ClipboardList,
//   MessageSquareText,
//   UserRound,
//   X,
// } from "lucide-react";

// const formatDate = (value) => {
//   if (!value) return "—";

//   const date = new Date(value);
//   if (Number.isNaN(date.getTime())) return "—";

//   return date.toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// const getName = (value) => {
//   if (!value) return "—";
//   if (typeof value === "string") return value;
//   return value.name || value.customerName || "—";
// };

// const getTaskDetails = (item) => ({
//   taskBy: item?.taskBy?.taskName || "",
//   allocatedTo: getName(item?.taskallocatedTo),
//   taskName: item?.taskId?.taskName || item?.taskTo || "",
//   allocationDate: item?.allocationDate || null,
// });

// function TaskPreview({ task, isFollowUp = false }) {
//   if (isFollowUp) {
//     return (
//       <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
//         {task || "Follow-up"}
//       </span>
//     );
//   }

//   const hasTask = task?.taskBy || task?.allocatedTo || task?.taskName;

//   if (!hasTask) {
//     return <span className="text-gray-400">—</span>;
//   }

//   return (
//     <div className="flex flex-wrap items-center gap-1 leading-5">
//       {task?.taskBy && (
//         <span className="font-semibold text-blue-700">{task.taskBy}</span>
//       )}

//       {task?.allocatedTo && task.allocatedTo !== "—" && (
//         <>
//           <span className="text-gray-300">→</span>
//           <span className="font-medium text-violet-700">{task.allocatedTo}</span>
//         </>
//       )}

//       {task?.taskName && (
//         <>
//           <span className="text-gray-300">·</span>
//           <span className="rounded bg-rose-50 px-1.5 py-0.5 font-semibold text-rose-600">
//             {task.taskName}
//           </span>
//         </>
//       )}

//       {task?.allocationDate && (
//         <span className="ml-1 text-[11px] text-gray-400">
//           {formatDate(task.allocationDate)}
//         </span>
//       )}
//     </div>
//   );
// }

// function RemarkPreview({ text }) {
//   const remark = String(text || "").trim();

//   if (!remark) return <span className="text-gray-400">—</span>;

//   return (
//     <div className="group relative min-w-0" tabIndex={0}>
//       <p
//         title={remark}
//         className="cursor-help truncate rounded px-1 py-0.5 text-gray-700 transition-colors group-hover:bg-blue-50 group-hover:text-blue-700 group-focus:bg-blue-50 group-focus:text-blue-700"
//       >
//         {remark}
//       </p>

//       <div
//         role="tooltip"
//         className="pointer-events-none invisible absolute right-0 top-full z-50 mt-2 w-max max-w-[min(24rem,calc(100vw-2rem))] origin-top-right translate-y-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs leading-5 text-white opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus:visible group-focus:translate-y-0 group-focus:opacity-100"
//       >
//         <span className="block whitespace-normal break-words">{remark}</span>
//         <span className="absolute -top-1 right-4 h-2 w-2 rotate-45 border-l border-t border-slate-700 bg-slate-900" />
//       </div>
//     </div>
//   );
// }


import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  ClipboardList,
  MessageSquareText,
  UserRound,
  X,
} from "lucide-react";

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getName = (value) => {
  if (!value) return "—";
  if (typeof value === "string") return value;
  return value.name || value.customerName || "—";
};

const getTaskDetails = (item) => ({
  taskBy: item?.taskBy?.taskName || "",
  allocatedTo: getName(item?.taskallocatedTo),
  taskName: item?.taskId?.taskName || item?.taskTo || "",
  allocationDate: item?.allocationDate || null,
});

function TaskPreview({ task, isFollowUp = false }) {
  if (isFollowUp) {
    return (
      <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
        {task || "Follow-up"}
      </span>
    );
  }

  const hasTask = task?.taskBy || task?.allocatedTo || task?.taskName;

  if (!hasTask) return <span className="text-gray-400">—</span>;

  return (
    <div className="flex flex-wrap items-center gap-1 leading-5">
      {task?.taskBy && (
        <span className="font-semibold text-blue-700">{task.taskBy}</span>
      )}

      {task?.allocatedTo && task.allocatedTo !== "—" && (
        <>
          <span className="text-gray-500">→</span>
          <span className="font-medium text-violet-700">{task.allocatedTo}</span>
        </>
      )}

      {task?.taskName && (
        <>
          <span className="text-gray-500">→</span>
          <span className="rounded bg-rose-50 px-1.5 py-0.5 font-semibold text-rose-600">
            {task.taskName}
          </span>
        </>
      )}

      {task?.allocationDate && (
        <span className="ml-1 text-[11px] text-gray-600">
          {formatDate(task.allocationDate)}
        </span>
      )}
    </div>
  );
}

function RemarkPreview({ text }) {
  const remark = String(text || "").trim();
  const triggerRef = useRef(null);
  const [tooltip, setTooltip] = useState({
    open: false,
    placement: "bottom",
    top: 0,
    left: 8,
  });

  useEffect(() => {
    if (!tooltip.open) return undefined;

    const closeTooltip = () => {
      setTooltip((current) => ({ ...current, open: false }));
    };

    window.addEventListener("scroll", closeTooltip, true);
    window.addEventListener("resize", closeTooltip);

    return () => {
      window.removeEventListener("scroll", closeTooltip, true);
      window.removeEventListener("resize", closeTooltip);
    };
  }, [tooltip.open]);

  if (!remark) return <span className="text-gray-400">—</span>;

  const openTooltip = () => {
    const element = triggerRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const estimatedTooltipHeight = 100;
    const gap = 10;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const tooltipWidth = Math.min(384, viewportWidth - 16);
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    const placement =
      spaceBelow >= estimatedTooltipHeight || spaceBelow >= spaceAbove
        ? "bottom"
        : "top";

    const top =
      placement === "bottom"
        ? rect.bottom + gap
        : Math.max(8, rect.top - estimatedTooltipHeight - gap);

    const left = Math.max(
      8,
      Math.min(rect.right - tooltipWidth, viewportWidth - tooltipWidth - 8)
    );

    setTooltip({ open: true, placement, top, left });
  };

  const closeTooltip = () => {
    setTooltip((current) => ({ ...current, open: false }));
  };

  return (
    <>
      <div
        ref={triggerRef}
        tabIndex={0}
        onMouseEnter={openTooltip}
        onMouseLeave={closeTooltip}
        onFocus={openTooltip}
        onBlur={closeTooltip}
        className="min-w-0 rounded px-1 py-0.5 transition-colors hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
      >
        <p className="cursor-help truncate text-gray-700 transition-colors hover:text-blue-700">
          {remark}
        </p>
      </div>

      {tooltip.open && (
        <div
          role="tooltip"
          className="pointer-events-none fixed z-[70] w-[min(24rem,calc(100vw-1rem))] rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs leading-5 text-white shadow-2xl"
          style={{ top: tooltip.top, left: tooltip.left }}
        >
          <span className="block break-words">{remark}</span>
          <span
            className={`absolute h-2 w-2 rotate-45 border-slate-700 bg-slate-900 ${
              tooltip.placement === "bottom"
                ? "-top-1 right-4 border-l border-t"
                : "-bottom-1 right-4 border-b border-r"
            }`}
          />
        </div>
      )}
    </>
  );
}

export const LeadhistoryModal = ({
  selectedLeadId,
  historyList,
  handlecloseModal,
}) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") handlecloseModal();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [handlecloseModal]);

  const historyRows = useMemo(() => {
    const logs = Array.isArray(historyList) ? historyList.filter(Boolean) : [];

    return logs.flatMap((item, index) => {
      const followerData = Array.isArray(item?.folowerData)
        ? item.folowerData.filter(Boolean)
        : [];

      if (followerData.length > 0) {
        return followerData.map((subItem, subIndex) => ({
          id: subItem?._id || `${item?._id || index}-follower-${subIndex}`,
          date: subItem?.followerDate || item?.submissionDate,
          user: getName(item?.followedId || item?.submittedUser),
          task: subItem?.followerDescription || "Follow-up",
          remarks: subItem?.remarks || item?.remarks || "",
          nextFollowUpDate:
            subItem?.nextFollowUpDate || item?.nextFollowUpDate,
          isFollowUp: true,
        }));
      }

      return [
        {
          id: item?._id || `history-${index}`,
          date: item?.submissionDate,
          user: getName(item?.submittedUser),
          task: getTaskDetails(item),
          remarks: item?.remarks || item?.changeReason || "",
          nextFollowUpDate: item?.nextFollowUpDate,
          isFollowUp: false,
        },
      ];
    });
  }, [historyList]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-2 backdrop-blur-[2px] sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handlecloseModal();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-history-title"
        className="flex w-full max-w-4xl max-h-[calc(100dvh-1rem)] flex-col overflow-hidden rounded-xl bg-white shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:rounded-2xl"
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 sm:px-5 sm:py-4">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
              <ClipboardList className="h-3.5 w-3.5" />
              Activity timeline
            </p>
            <h2
              id="lead-history-title"
              className="mt-0.5 text-base font-bold text-slate-900 sm:text-lg"
            >
              History
            </h2>
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              Lead ID{" "}
              <span className="font-bold text-slate-700">
                {selectedLeadId || "—"}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={handlecloseModal}
            aria-label="Close lead history"
            className="shrink-0 rounded-lg p-1.5 text-slate-500 transition hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
          {historyRows.length === 0 ? (
            <div className="grid min-h-40 place-items-center rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 text-center text-sm text-gray-500">
              No history available for this lead.
            </div>
          ) : (
            <>
              <div className="space-y-2 lg:hidden">
                {historyRows.map((row) => (
                  <article
                    key={row.id}
                    className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50/30"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
                          <CalendarDays className="h-3.5 w-3.5 text-blue-500" />
                          {formatDate(row.date)}
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-gray-600">
                          <UserRound className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                          {row.user}
                        </p>
                      </div>

                      {row.isFollowUp && (
                        <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                          Follow-up
                        </span>
                      )}
                    </div>

                    <div className="mt-2 border-t border-gray-100 pt-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                        Task
                      </p>
                      <div className="mt-1">
                        <TaskPreview task={row.task} isFollowUp={row.isFollowUp} />
                      </div>
                    </div>

                    {row.remarks && (
                      <div className="mt-2 rounded-md bg-gray-50 px-2.5 py-2">
                        <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                          <MessageSquareText className="h-3 w-3" />
                          Remarks
                        </p>
                        <p className="mt-1 break-words text-xs leading-5 text-gray-700">
                          {row.remarks}
                        </p>
                      </div>
                    )}

                    {row.nextFollowUpDate && (
                      <p className="mt-2 text-[11px] font-medium text-blue-700">
                        Next follow-up: {formatDate(row.nextFollowUpDate)}
                      </p>
                    )}
                  </article>
                ))}
              </div>

              <div className="hidden overflow-visible rounded-lg border border-gray-200 lg:block">
                <table className="w-full table-fixed border-collapse text-xs">
                  <thead className="sticky top-0 z-20 bg-indigo-50 text-slate-700">
                    <tr>
                      <th className="w-28 border-b border-indigo-100 px-3 py-2 text-left font-semibold">
                        Date
                      </th>
                      <th className="w-28 border-b border-indigo-100 px-3 py-2 text-left font-semibold">
                        User
                      </th>
                      <th className="w-[27%] border-b border-indigo-100 px-3 py-2 text-left font-semibold">
                        Task
                      </th>
                      <th className="border-b border-indigo-100 px-3 py-2 text-left font-semibold">
                        Remarks
                      </th>
                      <th className="w-32 border-b border-indigo-100 px-3 py-2 text-left font-semibold">
                        Next follow-up
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {historyRows.map((row, index) => (
                      <tr
                        key={row.id}
                        className={`transition-colors hover:bg-blue-50/70 ${
                          index % 2 === 0 ? "bg-white" : "bg-slate-50/70"
                        }`}
                      >
                        <td className="border-b border-gray-100 px-3 py-2 align-top font-medium text-slate-700">
                          {formatDate(row.date)}
                        </td>
                        <td className="border-b border-gray-100 px-3 py-2 align-top">
                          <span className="block truncate text-gray-700">
                            {row.user}
                          </span>
                        </td>
                        <td className="border-b border-gray-100 px-3 py-2 align-top">
                          <TaskPreview task={row.task} isFollowUp={row.isFollowUp} />
                        </td>
                        <td className="border-b border-gray-100 px-3 py-2 align-top">
                          <RemarkPreview text={row.remarks} />
                        </td>
                        <td className="border-b border-gray-100 px-3 py-2 align-top text-gray-600">
                          {formatDate(row.nextFollowUpDate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        <footer className="flex shrink-0 justify-end border-t border-gray-100 bg-gray-50 px-4 py-3 sm:px-5">
          <button
            type="button"
            onClick={handlecloseModal}
            className="rounded-lg bg-slate-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            Close
          </button>
        </footer>
      </section>
    </div>
  );
};