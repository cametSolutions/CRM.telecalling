import React, { useEffect, useState } from "react"
import UseFetch from "../../../hooks/useFetch"
import BarLoader from "react-spinners/BarLoader"
import api from "../../../api/api"
import Select from "react-select"
import { useFetcher } from "react-router-dom"
export default function AdminPanel() {
  const [leave, setleave] = useState([])
  const [selected, setselected] = useState(null)
  const [isToggled, setIsToggled] = useState(false)
  const [isYearlyToggled, setIsYearlyToggled] = useState(false)
  const [mode, setMode] = useState("month")
  const [quarter, setQuarter] = useState(null)
  const [month, setMonth] = useState(null)
  const [selectedYear, setselectedYear] = useState(null)
  const [loader, setloader] = useState(false)
  const [stats, setStats] = useState(null)
  const { data, loading, refreshHook } = UseFetch(
    selectedYear &&
      selected &&
      `/auth/adminpanelleavecount?quarter=${quarter}&month=${month}&year=${selectedYear}`
  )
  console.log(selected)
  console.log(selectedYear)
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

  const options = Array.from({ length: 20 }, (_, i) => {
    const year = 2024 + i
    return { value: year, label: year.toString() }
  })
  const monthOptions = months.map((month, index) => ({
    value: index,
    label: month
  }))
  useEffect(() => {
    setStats(data)
  }, [data])
  useEffect(() => {
    if (options) {
      const fullyear = new Date().getFullYear()
      const yearselected = options.find((item) => item.value === fullyear)
      const currentMonth = new Date().getMonth()

      const currentmonth = monthOptions.find(
        (item) => item.value === currentMonth
      )
      setMonth(currentmonth.value)
      setselectedYear(yearselected.value)
      setselected("monthly")
    }
  }, [])
  const handleYearlyToogle = () => {
    if (!isYearlyToggled) {
      setIsYearlyToggled(!isYearlyToggled)
      setselected("yearly")
      setIsToggled(false)
      setMonth(null)
      setQuarter(null)
    } else {
      setIsYearlyToggled(!isYearlyToggled)
      setselected("monthly")
      setIsToggled(false)
      setQuarter(null)

      const currentMonth = new Date().getMonth()

      const c = monthOptions.find((item) => item.value === currentMonth)
      setMonth(c.value)
    }
  }
  const handleQuarter = () => {
    if (isToggled) {
      setQuarter(null)
      const currentMonth = new Date().getMonth()

      const c = monthOptions.find((item) => item.value === currentMonth)
      setMonth(c.value)
      setIsToggled(!isToggled)
    } else {
      setIsToggled(!isToggled)
      setselected(null)
      setMonth(null)
    }
  }
  const commonStyles = {
    menuList: (base) => ({
      ...base,
      maxHeight: "150px",
      overflowY: "auto"
    })
  }
  const quarterOptions = [
    { label: "Q1 (Jan - Mar)", value: "1" },
    { label: "Q2 (Apr - Jun)", value: "2" },
    { label: "Q3 (Jul - Sep)", value: "3" },
    { label: "Q4 (Oct - Dec)", value: "4" }
  ]

  const renderStatList = (title1, title2) => (
    <div className="px-3 py-3   bg-[#023e7d] bg-gradient-to-r from-blu-900 via--100 to-blue-500 rounded shadow-md text-left text-sm border border-gray-200 text-white">
      <div className="">
        <p className="font-bold mb-1">
          {title1?.title} - {title1?.name ? title1?.name : "N/A"} -
          {title1?.count}
        </p>
      </div>
      <div className="">
        <p className="font-bold mb-1">
          {title2?.title} - {title2?.name ? title2?.name : "N/A"} -
          {title2?.count}
        </p>
      </div>
    </div>
  )

  return (
    <div className="h-full overflow-y-auto bg-white">
      {loading && (
        <BarLoader
          cssOverride={{ width: "100%", height: "4px" }} // Tailwind's `h-4` corresponds to `16px`
          color="#4A90E2" // Change color as needed
        />
      )}
      <div className="md:p-6 p-3 h-full">
        {" "}
        <div className="rounded-lg shadow-xl h-full bg-green-100 md:bg-white md:py-2">
          <h1 className="text-2xl font-semibold text-center md:mb-1 mt-1 ">
            Admin Panel
          </h1>

          <div className="flex flex-col md:flex-row md:justify-start gap-3 w-full mb-3 md:px-6 p-2 items-start md:items-center">
            <Select
              options={options}
              value={options.find((opt) => opt.value === selectedYear)}
              placeholder="Select Year"
              className="w-full md:w-36 shadow-xl"
              onChange={(selectedOption) =>
                setselectedYear(selectedOption.value)
              }
              styles={commonStyles}
            />

            <div className="flex items-center justify-between w-full md:w-auto">
              <span className="text-gray-600 mr-2 font-bold">
                {isToggled ? "Select Quarter" : "Select Month"}
              </span>
              <button
                onClick={handleQuarter}
                className={`${
                  isToggled ? "bg-green-500" : "bg-gray-300"
                } w-12 h-6 flex items-center rounded-full transition-colors duration-300 shadow-xl`}
              >
                <div
                  className={`${
                    isToggled ? "translate-x-6" : "translate-x-0"
                  } w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300`}
                ></div>
              </button>
            </div>

            {!isToggled && (
              <Select
                options={monthOptions}
                value={monthOptions.find((opt) => opt.value === month)}
                onChange={(selectedOption) => setMonth(selectedOption.value)}
                placeholder="Select Month"
                className="w-full md:w-40 shadow-xl"
                styles={commonStyles}
              />
            )}

            {isToggled && (
              <Select
                options={quarterOptions}
                value={quarterOptions.find((opt) => opt.value === quarter)}
                onChange={(selectedOption) => {
                  setQuarter(selectedOption.value)
                  setselected("quarter")
                }}
                placeholder="Select Quarter"
                className="w-full md:w-40 shadow-xl"
                styles={commonStyles}
              />
            )}

            <div className="flex items-center justify-between w-full md:w-auto">
              <span className="text-gray-600 mr-2 font-bold">Yearly</span>
              <button
                onClick={handleYearlyToogle}
                className={`${
                  isYearlyToggled ? "bg-green-500" : "bg-gray-300"
                } w-12 h-6 flex items-center shadow-xl rounded-full transition-colors duration-300`}
              >
                <div
                  className={`${
                    isYearlyToggled ? "translate-x-6" : "translate-x-0"
                  } w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300`}
                ></div>
              </button>
            </div>
          </div>

          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4  px-6 ">
              {renderStatList(stats?.highestLeave, stats?.lowestLeave)}
              {renderStatList(stats?.highestOnsite, stats?.lowestOnsite)}

              {renderStatList(stats?.highestLead, stats?.lowestLead)}
              {renderStatList(stats?.highestCall, stats?.lowestCall)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
