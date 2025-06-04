import { forwardRef, useEffect } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { FaCalendarAlt } from "react-icons/fa"
const MyDatePicker = ({ setDates, dates, onClear, loader }) => {
  console.log(setDates)
  // const [dateRange, setDateRange] = useState({
  //   startDate: dates.startDate,
  //   endDate: dates?.endDate
  // })
useEffect(()=>{
  console.log("🧩 setDates changed:", setDates);
},[setDates])
 
  // useEffect(() => {
  //   if (dateRange.startDate && dateRange.endDate) {
  //     handleSelect(dateRange)
  //   }
  // }, [dateRange])
  const normalizeDateToUTC = (date) => {
    if (!date) return null
    const utcDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    )
    return utcDate.toISOString().split("T")[0]
  }

  const handleDateRange = (date) => {
   
   
      setDates({
        startDate: date[0] ? date[0] : null,
        endDate: date[1] ? date[1]: null
      })
    

  }

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
        startDate={dates.startDate}
        endDate={dates.endDate}
        selectsRange
        dateFormat="dd/MM/yyyy"
        customInput={<CustomInput />}
        // isClearable
      />
    </div>
  )
}

export default MyDatePicker
