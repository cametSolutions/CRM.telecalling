import React, { useEffect } from "react"
import { useForm } from "react-hook-form"

const YearDropdown = ({ handleyear }) => {
  const { register } = useForm()

  // Get the current year
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    handleyear(currentYear)
  }, [])
  // Generate an array of years starting from 2025
  const years = Array.from(
    { length: currentYear - 2025 + 10 },
    (_, i) => 2025 + i
  )
  const handleYearChange = (event) => {
    const selectedYear = event.target.value // Get the selected year
    handleyear(selectedYear) // Pass the selected year to the parent
  }
  console.log(years)

  return (
    <div className="flex items-center">
      <select
        id="year"
        {...register("year", { required: "Year is required" })}
        defaultValue={currentYear}
        onChange={handleYearChange}
        className="border border-gray-300 rounded-md shadow-sm px-2 py-1  overflow-y-auto"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  )
}

export default YearDropdown
