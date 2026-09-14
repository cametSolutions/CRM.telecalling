// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// const DatePeriod = ({
//   startDate,
//   endDate,
//   setStartDate,
//   setEndDate,
// }) => {
//   return (
//     <div className="flex flex-wrap items-end gap-4">
//       {/* Start Date */}
//       <div className="flex flex-col">
//         <label className="mb-1 text-sm font-medium text-slate-700">
//           Start Date
//         </label>

//         <DatePicker
//           selected={startDate}
//           onChange={(date) => setStartDate(date)}
//           selectsStart
//           startDate={startDate}
//           endDate={endDate}
//           dateFormat="dd/MM/yyyy"
//           className="w-44 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
//           placeholderText="Select Start Date"
//         />
//       </div>

//       {/* End Date */}
//       <div className="flex flex-col">
//         <label className="mb-1 text-sm font-medium text-slate-700">
//           End Date
//         </label>

//         <DatePicker
//           selected={endDate}
//           onChange={(date) => setEndDate(date)}
//           selectsEnd
//           startDate={startDate}
//           endDate={endDate}
//           minDate={startDate}
//           dateFormat="dd/MM/yyyy"
//           className="w-44 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
//           placeholderText="Select End Date"
//         />
//       </div>
//     </div>
//   );
// };

// export default DatePeriod;
import { useState } from "react";
import DatePicker from "react-datepicker";
import { CalendarDays } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";

const DatePeriod = () => {
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-slate-700">
        Date Period
      </label>

      <div className="relative">
        <CalendarDays
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <DatePicker
          selectsRange
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => setDateRange(update)}
          dateFormat="dd/MM/yyyy"
          className="w-72 rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholderText="Select Date Period"
        />
      </div>
    </div>
  );
};

export default DatePeriod;