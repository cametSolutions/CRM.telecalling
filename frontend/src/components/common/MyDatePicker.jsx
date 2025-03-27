import React, { useEffect, useState, forwardRef } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { FaCalendarAlt } from "react-icons/fa"
const MyDatePicker = ({ handleSelect, dates, onClear, loader }) => {
  const [dateRange, setDateRange] = useState({
    startDate: dates.startDate,
    endDate: dates?.endDate
  })
  const { startDate, endDate } = dateRange

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      handleSelect(dateRange)
    }
  }, [dateRange])
  const normalizeDateToUTC = (date) => {
    if (!date) return null
    const utcDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    )
    return utcDate
  }
  // const extractDateAndMonth = (date) => {
  //   if (!date) return null
  //   const year = date.getFullYear()
  //   const month = date.getMonth() + 1 // getMonth() is 0-indexed
  //   const day = date.getDate()
  //   return `${year}-${month.toString().padStart(2, "0")}-${day
  //     .toString()
  //     .padStart(2, "0")}`
  // }

  const handleDateRange = (dates) => {
    // setDateRange(dates)
    const normalizedDates = normalizeDateToUTC(dates[0])
    setDateRange({
      startDate: dates[0] ? normalizeDateToUTC(dates[0]) : null,
      endDate: dates[1] ? normalizeDateToUTC(dates[1]) : null
    })
  }

  // const CustomInput = ({ value, onClick }) => (
  //   <div
  //     className="flex items-center border border-gray-300 p-2 rounded-md cursor-pointer  w-[220px] md:w-[250px] gap-2"
  //     onClick={onClick}
  //   >
  //     <FaCalendarAlt className="text-gray-600 md:mr-2" />
  //     <span className={`text-md ${value ? "text-gray-900" : "text-gray-500"}`}>
  //       {value || "Select a date range"}
  //     </span>
  //   </div>
  // )
  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <div
      ref={ref} // Attach ref here
      className="flex items-center border border-gray-300 p-2 rounded-md cursor-pointer w-[220px] md:w-[250px] gap-2"
      onClick={onClick}
    >
      <FaCalendarAlt className="text-gray-600 md:mr-2" />
      <span className={`text-md ${value ? "text-gray-900" : "text-gray-500"}`}>
        {value || "Select a date range"}
      </span>
    </div>
  ))

  return (
    <div className="z-40">
      <DatePicker
        // selected={endDate}
        onChange={handleDateRange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        dateFormat="dd/MM/yyyy"
        customInput={<CustomInput />}
        // isClearable
      />
    </div>
  )
}

export default MyDatePicker
