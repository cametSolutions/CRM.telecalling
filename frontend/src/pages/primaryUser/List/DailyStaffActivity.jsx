import { useState, useEffect } from "react"
import ReportTable from "../../../components/primaryUser/ReportTable"
import UseFetch from "../../../hooks/useFetch"
import { MonthRangePicker } from "../../../components/primaryUser/MonthRangePicker"
import { setDate } from "date-fns"
export default function DailyStaffActivity() {
  const [date, setdate] = useState({
    startDate: "",
    endDate: ""
  })
  const [headerNames, setheadersName] = useState([])
  const [filterRange, setFilterRange] = useState({
    startDate: null,
    endDate: null,
    startMonth: "",
    endMonth: "",
    firstDay: null,
    lastDay: null
  })
  const [data, setData] = useState([])
  const { data: a } = UseFetch(
    filterRange.firstDay &&
      filterRange.lastDay &&
      `/lead/getsalesfunnels?startDate=${filterRange.firstDay}&endDate=${filterRange.lastDay}`
  )
  const { data: task } = UseFetch("/lead/getalltasktoreport")
  console.log(date)
  console.log(filterRange)
  console.log()
  const { data: dailyreport } = UseFetch(
    date.startDate &&
      date.endDate &&
      `/lead/getstaffdailyreports?startDate=${date.startDate}&endDate=${date.endDate}`
  )
  useEffect(() => {
    const today = new Date()

    const formatDate = (date) => date.toISOString().split("T")[0]

    setdate((prev) => ({
      ...prev,
      startDate: formatDate(today),
      endDate: formatDate(today)
    }))
  }, [])
  useEffect(() => {
    if (dailyreport) {
      console.log(dailyreport)
      setData(dailyreport)

      const headers = [
        ...new Set(dailyreport.flatMap((item) => Object.keys(item)))
      ]
      if (headers.length === 0) {
        console.log("hhh")
        console.log(task)
        const tasknames = task.map((item) => item.taskName)
        console.log(tasknames)
        const defaultname = ["Date", "Staff", "New Leads", "Calls"]
const addup=[...defaultname,...tasknames]
// const defaultdata=[{
// data:0,
// staff:}]
        setheadersName(addup)
      } else {
        console.log(headers)
        setheadersName(headers)
      }
    }
  }, [dailyreport])
  // const headersName = ["Date", "Staff", "New Leads", "Calls"]
  const handleDateRange = (range) => {
    setFilterRange(range)
    console.log("Filter range:", range)
    // Fetch data from your Node.js API: /api/leads?start=${range.startDate}&end=${range.endDate}
  }
  return (
    <div className="h-full bg-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md p-4">
        <div className="flex flex-col ">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={date.startDate}
            onChange={(e) =>
              setdate((prev) => ({
                ...prev,
                startDate: e.target.value
              }))
            }
            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={date.endDate}
            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      <ReportTable
        headers={headerNames}
        reportName="Daily Staff Activity"
        data={data}
      />
    </div>
  )
}
