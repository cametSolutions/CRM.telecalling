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
        const addup = [...defaultname, ...tasknames]
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
    // <div className="h-full bg-gray-100">
    //   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md p-4">
    //     <div className="flex flex-col ">
    //       <label className="text-sm font-medium text-gray-600 mb-1">
    //         Start Date
    //       </label>
    //       <input
    //         type="date"
    //         value={date.startDate}
    //         onChange={(e) =>
    //           setdate((prev) => ({
    //             ...prev,
    //             startDate: e.target.value
    //           }))
    //         }
    //         className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    //       />
    //     </div>

    //     <div className="flex flex-col">
    //       <label className="text-sm font-medium text-gray-600 mb-1">
    //         End Date
    //       </label>
    //       <input
    //         type="date"
    //         value={date.endDate}
    //         className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    //       />
    //     </div>
    //   </div>
    //   <ReportTable
    //     headers={headerNames}
    //     reportName="Daily Staff Activity"
    //     data={data}
    //   />
    // </div>
    <div className="h-full bg-blue-50 flex flex-col">
      {/* Top bar */}
      <div className="px-4 md:px-6 py-3 bg-blue-50 border-b border-blue-100">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Title */}
          <h1 className="text-lg md:text-xl font-bold text-gray-900">
            Daily Staff Activity
          </h1>

          {/* Date range */}
          <div className="flex items-center">
            <div className="bg-white rounded-lg px-3 py-1.5 shadow-sm border border-gray-200 flex flex-wrap items-center gap-3">
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-600 mb-0.5">
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
                  className="px-2 py-1 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-600 mb-0.5">
                  End Date
                </label>
                <input
                  type="date"
                  value={date.endDate}
                  onChange={(e) =>
                    setdate((prev) => ({
                      ...prev,
                      endDate: e.target.value
                    }))
                  }
                  className="px-2 py-1 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table wrapper */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full px-3 md:px-6 pb-4">
          <div className="h-full bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <ReportTable
              headers={headerNames}
              reportName="Daily Staff Activity"
              data={data}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
