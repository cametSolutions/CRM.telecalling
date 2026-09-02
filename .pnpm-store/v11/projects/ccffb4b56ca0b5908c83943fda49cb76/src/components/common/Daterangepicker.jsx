// import { useState, useRef, useEffect, useMemo } from "react";
// import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";

// const DAY_MS = 86400000;
// const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
// const MONTHS = [
//   "January", "February", "March", "April", "May", "June",
//   "July", "August", "September", "October", "November", "December",
// ];

// const startOfDay = (d) => {
//   const n = new Date(d);
//   n.setHours(0, 0, 0, 0);
//   return n;
// };
// const sameDay = (a, b) =>
//   a && b && a.getFullYear() === b.getFullYear() &&
//   a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
// const addDays = (d, n) => new Date(d.getTime() + n * DAY_MS);
// const addMonths = (d, n) => {
//   const r = new Date(d);
//   r.setMonth(r.getMonth() + n);
//   return r;
// };
// const formatDate = (d) =>
//   d
//     ? `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`
//     : "";

// const PRESETS = [
//   { label: "Today", range: () => [new Date(), new Date()] },
//   { label: "Yesterday", range: () => [addDays(new Date(), -1), addDays(new Date(), -1)] },
//   { label: "Last 7 days", range: () => [addDays(new Date(), -6), new Date()] },
//   { label: "Last 30 days", range: () => [addDays(new Date(), -29), new Date()] },
//   {
//     label: "This month",
//     range: () => {
//       const n = new Date();
//       return [new Date(n.getFullYear(), n.getMonth(), 1), n];
//     },
//   },
//   {
//     label: "Last month",
//     range: () => {
//       const n = new Date();
//       const start = new Date(n.getFullYear(), n.getMonth() - 1, 1);
//       const end = new Date(n.getFullYear(), n.getMonth(), 0);
//       return [start, end];
//     },
//   },
// ];

// function buildMonthGrid(monthDate) {
//   const year = monthDate.getFullYear();
//   const month = monthDate.getMonth();
//   const firstOfMonth = new Date(year, month, 1);
//   const startOffset = (firstOfMonth.getDay() + 6) % 7; // Monday-first
//   const gridStart = addDays(firstOfMonth, -startOffset);

//   const cells = [];
//   for (let i = 0; i < 42; i++) {
//     const date = addDays(gridStart, i);
//     cells.push({ date, inMonth: date.getMonth() === month });
//   }
//   return cells;
// }

// function Calendar({ monthDate, onNavigate, range, hoverDate, setHoverDate, onPick, minDate }) {
//   const [start, end] = range;
//   const cells = useMemo(() => buildMonthGrid(monthDate), [monthDate]);
//   const previewEnd = end || hoverDate;

//   return (
//     <div className="w-72 select-none">
//       <div className="flex items-center justify-between px-1 pb-3">
//         <button
//           type="button"
//           onClick={() => onNavigate(-1)}
//           className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
//           aria-label="Previous month"
//         >
//           <ChevronLeft size={16} />
//         </button>
//         <span className="text-sm font-medium text-slate-800">
//           {MONTHS[monthDate.getMonth()]} {monthDate.getFullYear()}
//         </span>
//         <button
//           type="button"
//           onClick={() => onNavigate(1)}
//           className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
//           aria-label="Next month"
//         >
//           <ChevronRight size={16} />
//         </button>
//       </div>

//       <div className="grid grid-cols-7 gap-y-1">
//         {WEEKDAYS.map((d) => (
//           <div key={d} className="flex h-7 items-center justify-center text-[11px] font-medium text-slate-400">
//             {d}
//           </div>
//         ))}

//         {cells.map(({ date, inMonth }, i) => {
//           const disabled = minDate && date < minDate;
//           const isStart = start && sameDay(date, start);
//           const isEnd = end && sameDay(date, end);
//           const inRange =
//             start && previewEnd && date > startOfDay(start < previewEnd ? start : previewEnd) &&
//             date < startOfDay(start < previewEnd ? previewEnd : start);
//           const isEdge = isStart || isEnd;
//           const isToday = sameDay(date, new Date());

//           return (
//             <div
//               key={i}
//               className="relative flex h-9 items-center justify-center"
//               onMouseEnter={() => inMonth && !disabled && setHoverDate(date)}
//             >
//               {(inRange || (isEdge && start && end)) && (
//                 <span
//                   className={`absolute inset-y-0 ${
//                     isStart ? "left-1/2 right-0" : isEnd ? "left-0 right-1/2" : "left-0 right-0"
//                   } bg-indigo-50`}
//                 />
//               )}
//               <button
//                 type="button"
//                 disabled={!inMonth || disabled}
//                 onClick={() => onPick(date)}
//                 className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors
//                   ${!inMonth ? "invisible" : ""}
//                   ${disabled ? "cursor-not-allowed text-slate-300" : "cursor-pointer"}
//                   ${isEdge
//                     ? "bg-indigo-600 font-semibold text-white hover:bg-indigo-600"
//                     : inMonth && !disabled
//                     ? "text-slate-700 hover:bg-slate-100"
//                     : ""}
//                   ${isToday && !isEdge ? "ring-1 ring-inset ring-indigo-300" : ""}
//                 `}
//               >
//                 {date.getDate()}
//               </button>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// export default function DateRangePicker({
//   value,
//   onChange,
//   minDate = null,
//   placeholder = "Select date period",
//   label = "Date period",
// }) {
//   const [open, setOpen] = useState(false);
//   const [range, setRange] = useState(value || [null, null]);
//   const [selecting, setSelecting] = useState(false);
//   const [hoverDate, setHoverDate] = useState(null);
//   const [visibleMonth, setVisibleMonth] = useState(startOfDay(new Date()));
//   const containerRef = useRef(null);

//   const [start, end] = range;

//   useEffect(() => {
//     function handleClick(e) {
//       if (containerRef.current && !containerRef.current.contains(e.target)) {
//         setOpen(false);
//       }
//     }
//     function handleEscape(e) {
//       if (e.key === "Escape") setOpen(false);
//     }
//     document.addEventListener("mousedown", handleClick);
//     document.addEventListener("keydown", handleEscape);
//     return () => {
//       document.removeEventListener("mousedown", handleClick);
//       document.removeEventListener("keydown", handleEscape);
//     };
//   }, []);

//   const commit = (next) => {
//     setRange(next);
//     if (next[0] && next[1]) onChange?.(next);
//   };

//   const handlePick = (date) => {
//     if (!selecting || !start) {
//       commit([date, null]);
//       setSelecting(true);
//       return;
//     }
//     const [a, b] = date < start ? [date, start] : [start, date];
//     commit([a, b]);
//     setSelecting(false);
//   };

//   const applyPreset = (preset) => {
//     const [a, b] = preset.range().map(startOfDay);
//     commit([a, b]);
//     setSelecting(false);
//     setVisibleMonth(startOfDay(b));
//     setOpen(false);
//   };

//   const clear = (e) => {
//     e.stopPropagation();
//     setRange([null, null]);
//     setSelecting(false);
//     onChange?.([null, null]);
//   };

//   const displayValue =
//     start && end
//       ? `${formatDate(start)} — ${formatDate(end)}`
//       : start
//       ? `${formatDate(start)} — …`
//       : "";

//   const nextMonth = addMonths(visibleMonth, 1);

//   return (
//     <div ref={containerRef} className="relative flex flex-col gap-1.5">
//       <label className="text-sm font-medium text-slate-700">{label}</label>

//       <button
//         type="button"
//         onClick={() => setOpen((o) => !o)}
//         className={`group flex w-80 items-center gap-2.5 rounded-lg border bg-white py-2.5 pl-3.5 pr-3 text-left shadow-sm transition-all
//           ${open ? "border-indigo-400 ring-4 ring-indigo-50" : "border-slate-200 hover:border-slate-300"}
//         `}
//       >
//         <CalendarDays size={17} className={open ? "text-indigo-500" : "text-slate-400"} />
//         <span className={`flex-1 truncate text-sm ${displayValue ? "text-slate-800" : "text-slate-400"}`}>
//           {displayValue || placeholder}
//         </span>
//         {displayValue && (
//           <span
//             role="button"
//             tabIndex={0}
//             onClick={clear}
//             className="flex h-5 w-5 items-center justify-center rounded-full text-slate-400 opacity-0 transition-opacity hover:bg-slate-100 hover:text-slate-600 group-hover:opacity-100"
//             aria-label="Clear dates"
//           >
//             <X size={13} />
//           </span>
//         )}
//       </button>

//       {open && (
//         <div className="absolute top-full z-50 mt-2 flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
//           <div className="flex flex-col gap-0.5 border-r border-slate-100 p-2">
//             {PRESETS.map((p) => (
//               <button
//                 key={p.label}
//                 type="button"
//                 onClick={() => applyPreset(p)}
//                 className="whitespace-nowrap rounded-md px-3 py-2 text-left text-sm text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
//               >
//                 {p.label}
//               </button>
//             ))}
//           </div>

//           <div className="flex gap-4 p-4">
//             <Calendar
//               monthDate={visibleMonth}
//               onNavigate={(dir) => setVisibleMonth(addMonths(visibleMonth, dir))}
//               range={range}
//               hoverDate={hoverDate}
//               setHoverDate={setHoverDate}
//               onPick={handlePick}
//               minDate={minDate}
//             />
//             <div className="w-px bg-slate-100" />
//             <Calendar
//               monthDate={nextMonth}
//               onNavigate={(dir) => setVisibleMonth(addMonths(visibleMonth, dir))}
//               range={range}
//               hoverDate={hoverDate}
//               setHoverDate={setHoverDate}
//               onPick={handlePick}
//               minDate={minDate}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import { useState, useRef, useEffect, useLayoutEffect, useMemo } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";

const DAY_MS = 86400000;
const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const startOfDay = (d) => {
  const n = new Date(d);
  n.setHours(0, 0, 0, 0);
  return n;
};
const sameDay = (a, b) =>
  a && b && a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const addDays = (d, n) => new Date(d.getTime() + n * DAY_MS);
const addMonths = (d, n) => {
  const r = new Date(d);
  r.setMonth(r.getMonth() + n);
  return r;
};
const formatDate = (d) =>
  d
    ? `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`
    : "";

const PRESETS = [
  { label: "Today", range: () => [new Date(), new Date()] },
  { label: "Yesterday", range: () => [addDays(new Date(), -1), addDays(new Date(), -1)] },
  { label: "Last 7 days", range: () => [addDays(new Date(), -6), new Date()] },
  { label: "Last 30 days", range: () => [addDays(new Date(), -29), new Date()] },
  {
    label: "This month",
    range: () => {
      const n = new Date();
      return [new Date(n.getFullYear(), n.getMonth(), 1), n];
    },
  },
  {
    label: "Last month",
    range: () => {
      const n = new Date();
      const start = new Date(n.getFullYear(), n.getMonth() - 1, 1);
      const end = new Date(n.getFullYear(), n.getMonth(), 0);
      return [start, end];
    },
  },
];

function buildMonthGrid(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7; // Monday-first
  const gridStart = addDays(firstOfMonth, -startOffset);

  const cells = [];
  for (let i = 0; i < 42; i++) {
    const date = addDays(gridStart, i);
    cells.push({ date, inMonth: date.getMonth() === month });
  }
  return cells;
}

function Calendar({ monthDate, onNavigate, range, hoverDate, setHoverDate, onPick, minDate }) {
  const [start, end] = range;
  const cells = useMemo(() => buildMonthGrid(monthDate), [monthDate]);
  const previewEnd = end || hoverDate;

  return (
    <div className="w-72 select-none">
      <div className="flex items-center justify-between px-1 pb-3">
        <button
          type="button"
          onClick={() => onNavigate(-1)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          aria-label="Previous month"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-medium text-slate-800">
          {MONTHS[monthDate.getMonth()]} {monthDate.getFullYear()}
        </span>
        <button
          type="button"
          onClick={() => onNavigate(1)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          aria-label="Next month"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="flex h-7 items-center justify-center text-[11px] font-medium text-slate-400">
            {d}
          </div>
        ))}

        {cells.map(({ date, inMonth }, i) => {
          const disabled = minDate && date < minDate;
          const isStart = start && sameDay(date, start);
          const isEnd = end && sameDay(date, end);
          const inRange =
            start && previewEnd && date > startOfDay(start < previewEnd ? start : previewEnd) &&
            date < startOfDay(start < previewEnd ? previewEnd : start);
          const isEdge = isStart || isEnd;
          const isToday = sameDay(date, new Date());

          return (
            <div
              key={i}
              className="relative flex h-9 items-center justify-center"
              onMouseEnter={() => inMonth && !disabled && setHoverDate(date)}
            >
              {(inRange || (isEdge && start && end)) && (
                <span
                  className={`absolute inset-y-0 ${
                    isStart ? "left-1/2 right-0" : isEnd ? "left-0 right-1/2" : "left-0 right-0"
                  } bg-indigo-50`}
                />
              )}
              <button
                type="button"
                disabled={!inMonth || disabled}
                onClick={() => onPick(date)}
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors
                  ${!inMonth ? "invisible" : ""}
                  ${disabled ? "cursor-not-allowed text-slate-300" : "cursor-pointer"}
                  ${isEdge
                    ? "bg-indigo-600 font-semibold text-white hover:bg-indigo-600"
                    : inMonth && !disabled
                    ? "text-slate-700 hover:bg-slate-100"
                    : ""}
                  ${isToday && !isEdge ? "ring-1 ring-inset ring-indigo-300" : ""}
                `}
              >
                {date.getDate()}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Drop-in replacement for the old react-datepicker based picker.
 * Matches the calling convention already used in the app:
 *   <DateRangePicker
 *     startDate={startDate}
 *     endDate={endDate}
 *     setStartDate={setStartDate}
 *     setEndDate={setEndDate}
 *   />
 *
 * The panel positions itself with `position: fixed`, measured off the
 * trigger button and clamped to the viewport - so it can never get cut
 * off by a sticky header, an `overflow-hidden` ancestor, or the right
 * edge of the screen (the bug in the screenshot).
 */
export default function DateRangePicker({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  minDate = null,
  placeholder = "Select date period",
  label = "Date period",
  showLabel = true,
}) {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState([
    startDate ? startOfDay(new Date(startDate)) : null,
    endDate ? startOfDay(new Date(endDate)) : null,
  ]);
  const [selecting, setSelecting] = useState(false);
  const [hoverDate, setHoverDate] = useState(null);
  const [visibleMonth, setVisibleMonth] = useState(
    startOfDay(startDate ? new Date(startDate) : new Date())
  );
  const [coords, setCoords] = useState(null);

  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);

  const [start, end] = range;

  // Keep in sync if parent controls the dates externally.
  useEffect(() => {
    setRange([
      startDate ? startOfDay(new Date(startDate)) : null,
      endDate ? startOfDay(new Date(endDate)) : null,
    ]);
  }, [startDate, endDate]);

  // Position the panel using the trigger's real screen position, then
  // clamp so it never overflows the right/bottom edge of the viewport.
  useLayoutEffect(() => {
    if (!open) return;

    const place = () => {
      const trigger = triggerRef.current;
      const panel = panelRef.current;
      if (!trigger || !panel) return;

      const margin = 12;
      const triggerRect = trigger.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();

      let left = triggerRect.left;
      const maxLeft = window.innerWidth - panelRect.width - margin;
      left = Math.min(left, maxLeft);
      left = Math.max(left, margin);

      let top = triggerRect.bottom + 8;
      const overflowsBottom = top + panelRect.height > window.innerHeight - margin;
      if (overflowsBottom) {
        top = triggerRect.top - panelRect.height - 8;
      }

      setCoords({ top, left });
    };

    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, visibleMonth]);

  useEffect(() => {
    function handleClick(e) {
      if (
        wrapperRef.current && !wrapperRef.current.contains(e.target) &&
        panelRef.current && !panelRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    function handleEscape(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const commit = (next) => {
    setRange(next);
    if (next[0] && next[1]) {
      setStartDate?.(next[0]);
      setEndDate?.(next[1]);
    }
  };

  const handlePick = (date) => {
    if (!selecting || !start) {
      commit([date, null]);
      setSelecting(true);
      return;
    }
    const [a, b] = date < start ? [date, start] : [start, date];
    commit([a, b]);
    setSelecting(false);
    setOpen(false);
  };

  const applyPreset = (preset) => {
    const [a, b] = preset.range().map(startOfDay);
    commit([a, b]);
    setSelecting(false);
    setVisibleMonth(startOfDay(b));
    setOpen(false);
  };

  const clear = (e) => {
    e.stopPropagation();
    setRange([null, null]);
    setSelecting(false);
    setStartDate?.(null);
    setEndDate?.(null);
  };

  const displayValue =
    start && end
      ? `${formatDate(start)} — ${formatDate(end)}`
      : start
      ? `${formatDate(start)} — …`
      : "";

  return (
    <div ref={wrapperRef} className="relative flex flex-col gap-1.5">
      {showLabel && <label className="text-sm font-medium text-slate-700">{label}</label>}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`group flex w-72 items-center gap-2.5 rounded-lg border bg-white py-2 pl-3.5 pr-3 text-left shadow-sm transition-all
          ${open ? "border-indigo-400 ring-4 ring-indigo-50" : "border-slate-200 hover:border-slate-300"}
        `}
      >
        <CalendarDays size={17} className={open ? "text-indigo-500" : "text-slate-400"} />
        <span className={`flex-1 truncate text-sm ${displayValue ? "text-slate-800" : "text-slate-400"}`}>
          {displayValue || placeholder}
        </span>
        {displayValue && (
          <span
            role="button"
            tabIndex={0}
            onClick={clear}
            className="flex h-5 w-5 items-center justify-center rounded-full text-slate-400 opacity-0 transition-opacity hover:bg-slate-100 hover:text-slate-600 group-hover:opacity-100"
            aria-label="Clear dates"
          >
            <X size={13} />
          </span>
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          style={{
            position: "fixed",
            top: coords?.top ?? -9999,
            left: coords?.left ?? -9999,
            visibility: coords ? "visible" : "hidden",
          }}
          className="z-[9999] flex max-w-[95vw] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
        >
          <div className="flex flex-col gap-0.5 border-r border-slate-100 p-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => applyPreset(p)}
                className="whitespace-nowrap rounded-md px-3 py-2 text-left text-sm text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="p-4">
            <Calendar
              monthDate={visibleMonth}
              onNavigate={(dir) => setVisibleMonth(addMonths(visibleMonth, dir))}
              range={range}
              hoverDate={hoverDate}
              setHoverDate={setHoverDate}
              onPick={handlePick}
              minDate={minDate}
            />
          </div>
        </div>
      )}
    </div>
  );
}

