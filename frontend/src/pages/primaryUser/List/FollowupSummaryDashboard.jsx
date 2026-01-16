import { useState, useEffect } from "react"
import ReportTable from "../../../components/primaryUser/ReportTable"
import UseFetch from "../../../hooks/useFetch"

export default function FollowupSummaryDashboard() {
  const [date, setdate] = useState({
    startDate: new Date().toLocaleDateString("en-CA"),
    endDate: ""
  })
  const [data, setData] = useState([])
  const { data: followup } = UseFetch(
    date.startDate &&
      date.endDate &&
      `/lead/getfollowupsummaryReport?startDate=${date.startDate}&endDate=${date.endDate}`
  )
  useEffect(() => {
    const endDate = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0
    ).toLocaleDateString("en-CA")
    setdate((prev) => ({
      ...prev,
      endDate
    }))
    console.log(new Date())
    console.log(date)
    console.log(endDate)
  }, [])
  useEffect(() => {
    if (followup) {
      console.log(followup)
      setData(followup)
    }
  }, [followup])
  console.log(date)
  const headersName = [
    "Staff",
    "Total Leads",
    "Due Today",
    "Overdue",
    "Future",
    "Converted",
    "Lost",
    "Conversion %"
  ]
  
  console.log("jjjjjd")
  return (
    <div className="h-full bg-gray-100">
      {/* <div className="date-range">
        <label>
          Start Date
          <input
            onChange={(e) => console.log(e.target.value)}
            type="date"
            className="date-input"
          />
        </label>

        <label>
          End Date
          <input type="date" className="date-input" />
        </label>
      </div> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={date.startDate}
            onChange={(e) => console.log(e.target.value)}
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
        headers={headersName}
        reportName="Follow-Up Summary"
        data={data}
      />
    </div>
  )
}
