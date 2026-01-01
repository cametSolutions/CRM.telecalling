// import React, { useState, useEffect } from "react";
// import { format, startOfMonth, endOfMonth, addMonths } from "date-fns";

// export const MonthRangePicker = ({
//   onChange,
//   initialStart,
//   initialEnd,
//   setFilterRange,
// }) => {
//   const [startMonth, setStartMonth] = useState(initialStart || new Date());
//   const [endMonth, setEndMonth] = useState(initialEnd || new Date());

//   console.log(format(startMonth, "yyyy-MM"));
//   console.log(format(endMonth, "yyyy-MM"));

//   const months = Array.from({ length: 24 }, (_, i) =>
//     addMonths(new Date(), i - 12)
//   );

//   useEffect(() => {
//     setFilterRange({
//       startDate: format(startMonth, "yyyy-MM"),
//       endDate: format(endMonth, "yyyy-MM"),
//     });
//   }, []);
//   const handleRangeChange = () => {
//     const startDate = startOfMonth(startMonth); // Always 1st of month
//     const endDate = endOfMonth(endMonth); // Always last day of month
//     onChange({
//       startDate,
//       endDate,
//       startMonth: format(startDate, "MMM yyyy"),
//       endMonth: format(endDate, "MMM yyyy"),
//     });
//   };

//   return (
//     <div className="flex gap-4 items-end  p-2 rounded-xl shadow-lg border">
//       {/* Start Month */}
//       <div className="flex-1">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Start Month
//         </label>
//         <select
//           value={format(startMonth, "yyyy-MM")}
//           onChange={(e) => {
//             setStartMonth(new Date(e.target.value + "-01"));
//             handleRangeChange();
//           }}
//           className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//         >
//           {months.map((month) => (
//             <option key={month.toISOString()} value={format(month, "yyyy-MM")}>
//               {format(month, "MMM yyyy")}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Arrow */}
//       <div className="text-2xl font-bold text-gray-400 self-center">→</div>

//       {/* End Month */}
//       <div className="flex-1">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           End Month
//         </label>
//         <select
//           value={format(endMonth, "yyyy-MM")}
//           onChange={(e) => {
//             setEndMonth(new Date(e.target.value + "-01"));
//             handleRangeChange();
//           }}
//           className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//         >
//           {months.map((month) => (
//             <option key={month.toISOString()} value={format(month, "yyyy-MM")}>
//               {format(month, "MMM yyyy")}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Display Actual Range */}
//       <div className="text-sm text-gray-500 ml-4">
//         <div>
//           {format(startOfMonth(startMonth), "MMM 1, yyyy")} -{" "}
//           {format(endOfMonth(endMonth), "MMM d, yyyy")}
//         </div>
//       </div>
//     </div>
//   );
// };
import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, addMonths } from "date-fns";

export const MonthRangePicker = ({ onChange }) => {
  const [startMonth, setStartMonth] = useState(new Date());
  const [endMonth, setEndMonth] = useState(new Date());

  const months = Array.from({ length: 24 }, (_, i) =>
    addMonths(new Date(), i - 12)
  );

  const handleRangeChange = () => {
    const startDate = startOfMonth(startMonth);
    const endDate = endOfMonth(endMonth);
    onChange({
      startDate,
      endDate,
      startMonth: format(startDate, "MMM yyyy"),
      endMonth: format(endDate, "MMM yyyy"),
      firstDay: format(startOfMonth(startMonth), "MMM 1,yyyy"),
      lastDay: format(endOfMonth(endMonth), "MMM d, yyyy"),
    });
  };

  useEffect(() => {
    handleRangeChange(); // Initial call
  }, [startMonth, endMonth]);

  return (
    <div className="flex flex-grow items-center gap-3 px-4 bg-white border-b border-gray-200">
      {/* Start Month */}
      <div className="flex-1">
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Start
        </label>
        <select
          value={format(startMonth, "yyyy-MM")}
          onChange={(e) => {
            console.log("h");
            setStartMonth(new Date(e.target.value + "-01"));
          }}
          className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
        >
          {months.map((month) => (
            <option key={month.toISOString()} value={format(month, "yyyy-MM")}>
              {format(month, "MMM yyyy")}
            </option>
          ))}
        </select>
      </div>

      <div className="text-lg font-bold text-gray-400">→</div>

      {/* End Month */}
      <div className="flex-1">
        <label className="block text-xs font-medium text-gray-500 mb-1">
          End
        </label>
        <select
          value={format(endMonth, "yyyy-MM")}
          onChange={(e) => {
            setEndMonth(new Date(e.target.value + "-01"));
          }}
          className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
        >
          {months.map((month) => (
            <option key={month.toISOString()} value={format(month, "yyyy-MM")}>
              {format(month, "MMM yyyy")}
            </option>
          ))}
        </select>
      </div>

      {/* Display Range */}
      <div className="text-xs text-gray-500 font-medium min-w-[180px]">
        {format(startOfMonth(startMonth), "MMM 1")} -{" "}
        {format(endOfMonth(endMonth), "MMM d, yyyy")}
      </div>
    </div>
  );
};
