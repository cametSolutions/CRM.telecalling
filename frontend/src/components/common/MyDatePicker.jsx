import React, { useEffect, useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { FaCalendarAlt } from "react-icons/fa"
const MyDatePicker = ({ handleSelect, dates, onClear, loader }) => {
  console.log(dates)
  const [dateRange, setDateRange] = useState({
    startDate: dates.startDate,
    endDate: dates?.endDate
  })
  console.log(dateRange)
  const { startDate, endDate } = dateRange

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      console.log("hiii")
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
    console.log(dates)
    // setDateRange(dates)
    const normalizedDates = normalizeDateToUTC(dates[0])
    // console.log(normalizedDates)
    setDateRange({
      startDate: dates[0] ? normalizeDateToUTC(dates[0]) : null,
      endDate: dates[1] ? normalizeDateToUTC(dates[1]) : null
    })
  }
  console.log(startDate)

  const CustomInput = ({ value, onClick }) => (
    <div
      className="flex items-center border border-gray-300 p-2 rounded-md cursor-pointer md:w-[250px] gap-2"
      onClick={onClick}
    >
      <FaCalendarAlt className="text-gray-600 mr-2" />
      <span className={`text-sm ${value ? "text-gray-900" : "text-gray-500"}`}>
        {value || "Select a date range"}
      </span>
    </div>
  )

  return (
    <div className="relative z-40">
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
      {/* Clear Button */}
      {/* {startDate && endDate && (
        <button
          className="absolute top-0 right-0 p-1 text-red-500"
          onClick={() => handleDateRange([null, null])}
        ></button>
      )} */}
    </div>
  )
}

export default MyDatePicker
