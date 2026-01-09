import { useState, useEffect } from "react"
import ReportTable from "../../../components/primaryUser/ReportTable"
import UseFetch from "../../../hooks/useFetch"
import { MonthRangePicker } from "../../../components/primaryUser/MonthRangePicker"

export default function SalesFunnel() {
  const [date, setdate] = useState({
    startDate: "",
    endDate: ""
  })
  const [filterRange, setFilterRange] = useState({
    startDate: null,
    endDate: null,
    startMonth: "",
    endMonth: "",
    firstDay: null,
    lastDay: null
  })
  const [data, setData] = useState([])
const {data:salesfunels}=UseFetch(date.startDate&&date.endDate&&`/lead/getsalesfunnels?startDate=${date.startDate}&endDate=${date.endDate}`)
  const { data: followup } = UseFetch(
    date.startDate &&
      date.endDate &&
      `/lead/getallproductwisereport?startDate=${filterRange.firstDay}&endDate=${filterRange.lastDay}`
  )
  useEffect(() => {
    const endDate = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0
    ).toLocaleDateString("en-CA")
    const startDate = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    ).toLocaleDateString("en-CA")

    console.log(startDate)

    setdate((prev) => ({
      ...prev,
      startDate,
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
    "Stage",
    "Count",
    "Value",
    "Conv.%",
    "Follow-Ups",
    "Future",
    "Converted",
    "Lost",
    "Conversion %"
  ]
  const handleDateRange = (range) => {
    setFilterRange(range)
    console.log("Filter range:", range)
    // Fetch data from your Node.js API: /api/leads?start=${range.startDate}&end=${range.endDate}
  }
  console.log("jjjjjd")
  return (
    <div className="h-full bg-gray-100">
      <MonthRangePicker onChange={handleDateRange} />

      {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
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
      </div> */}

      <ReportTable
        headers={headersName}
        reportName="Sales Funnel"
        data={data}
      />
    </div>
  )
}
