// import { forwardRef } from "react"
// import DatePicker from "react-datepicker"
// import "react-datepicker/dist/react-datepicker.css"
// import { FaCalendarAlt } from "react-icons/fa"
// const MyDatePicker = ({ setDates, dates, onClear, loader, view = false }) => {
//   console.log(view)

//   const handleDateRange = (date) => {
//     setDates({
//       startDate: date[0] ? date[0] : null,
//       endDate: date[1] ? date[1] : null
//     })
//   }

//   const CustomInput = forwardRef(({ value, onClick }, ref) => (
//     <div
//       ref={ref} // Attach ref here
//       className="flex items-center border border-gray-300 px-2 py-0.5 rounded-md cursor-pointer w-[220px] md:w-[250px] gap-2 bg-white"
//       onClick={onClick}
//     >
//       <FaCalendarAlt className="text-gray-600 md:mr-2" />
//       <span className={`text-md ${value ? "text-gray-900" : "text-gray-500"}`}>
//         {value || "Select a date range"}
//       </span>
//     </div>
//   ))

//   return (
//     <div className="z-40 relative">
//       <DatePicker
//         // selected={endDate}
//         onChange={handleDateRange}
//         startDate={dates.startDate}
//         endDate={dates.endDate}
//         selectsRange
//         dateFormat="dd/MM/yyyy"
//         customInput={<CustomInput />}

//       />
//     </div>
//   )
// }

// export default MyDatePicker
import { forwardRef } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { FaCalendarAlt } from "react-icons/fa"

const MyDatePicker = ({
  setDates,
  dates,
  onChange,
  onClear,
  loader,
  view = false,
  fullWidth = false
}) => {
console.log(view)
  const handleDateRange = (date) => {
    if (view) return // block changes in view mode
    setDates({
      startDate: date?.[0] || null,
      endDate: date?.[1] || null
    })
    onChange?.()
  }

  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <div
      ref={ref}
      className={
        "flex items-center border border-gray-300 px-2 py-1.5 rounded-lg gap-2 " +
        (fullWidth ? "w-full " : "w-[220px] md:w-[250px] ") +
        (view ? "bg-white cursor-not-allowed " : "bg-white cursor-pointer")
      }
      onClick={view ? undefined : onClick} // disable opening popup in view mode
    >
      <FaCalendarAlt className="text-gray-600 md:mr-2" />
      <span className={`text-md ${value ? "text-gray-900" : "text-gray-500"}`}>
        {value || "Select a date range"}
      </span>
    </div>
  ))

  return (
    <div className={`z-40 relative ${fullWidth ? "w-full" : ""}`}>
      <DatePicker
        onChange={handleDateRange}
        startDate={dates.startDate}
        endDate={dates.endDate}
        selectsRange
        dateFormat="dd/MM/yyyy"
        customInput={<CustomInput />}
        wrapperClassName={fullWidth ? "w-full" : undefined}
        disabled={view} // extra safety
      />
    </div>
  )
}

export default MyDatePicker
