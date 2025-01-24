import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { getDaysInMonth, startOfMonth, endOfMonth } from "date-fns"

function LeaveMaster() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm()
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(null) // To store the selected month
  const [daysInMonth, setDaysInMonth] = useState([]) // To store days in selected month
  const [holidays, setHolidays] = useState({}) // To store holidays keyed by date

  // Generate an array of years (e.g., 2020 to 2030)
  const years = Array.from(
    { length: 11 },
    (_, i) => new Date().getFullYear() + i
  )

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]

  // Function to calculate the number of days in a month using date-fns
  const getDaysInSelectedMonth = (year, month) => {
    const start = startOfMonth(new Date(year, month))
    const end = endOfMonth(start)
    const days = []
    for (let i = 1; i <= end.getDate(); i++) {
      days.push(i)
    }
    return days
  }

  // When year or month is selected, update days
  useEffect(() => {
    if (month !== null) {
      const days = getDaysInSelectedMonth(year, month)
      setDaysInMonth(days)
    }
  }, [year, month])

  // Handle input changes for holidays
  const handleHolidayChange = (day, holidayName) => {
    setHolidays((prev) => ({
      ...prev,
      [`${month + 1}-${day}`]: holidayName // Store holiday keyed by month-day
    }))
  }

  // Handle form submission
  const onSubmit = (data) => {
    console.log("Form submitted with data: ", data)
  }

  return (
    <div className="p-3">
      <h1 className="text-2xl font-bold mb-5">Leave Master</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div>
            <label
              htmlFor="checkInTime"
              className="block text-sm font-medium text-gray-700"
            >
              Check-In Time
            </label>
            <input
              id="checkInTime"
              type="time"
              {...register("checkInTime", {
                required: "Check-In Time is required"
              })}
              className="mt-1 p-2 border rounded w-full"
            />
            {errors.checkInTime && (
              <span className="text-red-500 text-sm">
                {errors.checkInTime.message}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="checkOutTime"
              className="block text-sm font-medium text-gray-700"
            >
              Check-Out Time
            </label>
            <input
              id="checkOutTime"
              type="time"
              {...register("checkOutTime", {
                required: "Check-Out Time is required"
              })}
              className="mt-1 p-2 border rounded "
            />
            {errors.checkOutTime && (
              <span className="text-red-500 text-sm">
                {errors.checkOutTime.message}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="lateArrival"
              className="block text-sm font-medium text-gray-700"
            >
              Late Arrival After (minutes)
            </label>
            <input
              id="lateArrival"
              type="number"
              {...register("lateArrival", {
                required: "Late Arrival is required"
              })}
              className="mt-1 p-2 border rounded "
            />
            {errors.lateArrival && (
              <span className="text-red-500 text-sm">
                {errors.lateArrival.message}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="earlyOut"
              className="block text-sm font-medium text-gray-700"
            >
              Early Out Before (minutes)
            </label>
            <input
              id="earlyOut"
              type="number"
              {...register("earlyOut", { required: "Early Out is required" })}
              className="mt-1 p-2 border rounded "
            />
            {errors.earlyOut && (
              <span className="text-red-500 text-sm">
                {errors.earlyOut.message}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="deductSalary"
              className="block text-sm font-medium text-gray-700"
            >
              Deduct Salary if Late/Early by (minutes)
            </label>
            <input
              id="deductSalary"
              type="number"
              {...register("deductSalary", {
                required: "This field is required"
              })}
              className="mt-1 p-2 border rounded "
            />
            {errors.deductSalary && (
              <span className="text-red-500 text-sm">
                {errors.deductSalary.message}
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div>
            <label
              htmlFor="year"
              className="block text-sm font-medium text-gray-700"
            >
              Select Year
            </label>
            <select
              id="year"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="mt-1 p-2 border rounded "
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="month"
              className="block text-sm font-medium text-gray-700"
            >
              Select Month
            </label>
            <select
              id="month"
              value={month !== null ? month : ""}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="mt-1 p-2 border rounded"
            >
              <option value="">Select Month</option>
              {months.map((m, idx) => (
                <option key={idx} value={idx}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
        {month !== null && (
          <div className="overflow-y-scroll max-h-96 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {daysInMonth.map((day) => (
                <div key={day} className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-700">{`Day ${day}`}</label>
                  <textarea
                    {...register(`holidays.${month + 1}-${day}`)}
                    className="mt-1 p-2 border rounded w-full"
                    placeholder={`Holiday Name for Day ${day}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center mt-5">
          <button
            type="submit"
            className="px-2 py-1 bg-blue-800 text-white rounded  hover:bg-blue-900"
          >
            Save Leave
          </button>
        </div>
      </form>
    </div>
  )
}

export default LeaveMaster
