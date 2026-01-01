
import { useState, useEffect } from "react"
import ReportTable from "../../../components/primaryUser/ReportTable"
import { MonthRangePicker } from "../../../components/primaryUser/MonthRangePicker"

import UseFetch from "../../../hooks/useFetch"
export default function ProductWiseleadReport() {
  const [filterRange, setFilterRange] = useState({
    startDate: null,
    endDate: null,
    startMonth: "",
    endMonth: "",
    firstDay: null,
    lastDay: null
  })
  const [data, setData] = useState([]) // Dynamic data
  const [search, setsearch] = useState("")

  const { data: report } = UseFetch(
    filterRange.firstDay !== null &&
      filterRange.lastDay !== null &&
      `/lead/getallproductwisereport?startDate=${filterRange.firstDay}&endDate=${filterRange.lastDay}`
  )
  console.log(report)

  console.log(filterRange)
  const headersName = [
    "Staff",
    "Product",
    "Total Leads",
    "Converted",
    "Lost",
    "Pending",
    "Total Value",
    "Converted Value"
  ]

  // Mock data - replace with your API call
  const mockData = [
    {
      Staff: "John Doe",
      Product: "CRM Pro",
      TotalLeads: 245,
      Converted: 89,
      Lost: 112,
      Pending: 44,
      TotalValue: "₹2,45,000",
      ConvertedValue: "₹1,78,000"
    },
    {
      Staff: "Jane Smith",
      Product: "ERP Enterprise",
      TotalLeads: 198,
      Converted: 67,
      Lost: 98,
      Pending: 33,
      TotalValue: "₹1,98,000",
      ConvertedValue: "₹1,34,000"
    }
  ]
  useEffect(() => {
    if (report) {
      setData(report) // Replace with API data
    }
  }, [report])

  const handleDateRange = (range) => {
    setFilterRange(range)
    console.log("Filter range:", range)
    // Fetch data from your Node.js API: /api/leads?start=${range.startDate}&end=${range.endDate}
  }
  const handleChange = (e) => {
    console.log(e)
    if (e === "") {
      setData(report)
      console.log(e)
    }
    console.log(data)
    const filtered = report.filter((item) =>
      item.staffName?.toLowerCase().includes(e.toLowerCase().trim())
    )
    console.log(filtered)

    setData(filtered)
    setsearch(e)
  }

  return (
    <div className="h-full bg-gray-50 overflow-hidden items-center">
      <div className="flex">
        <MonthRangePicker onChange={handleDateRange} />
        <div className="flex items-center w-96 px-4">
          <input
            type="text"
            value={search}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Search..."
            className="py-2 border border-gray-400 rounded-lg w-full px-4 "
          />
        </div>
      </div>

      <ReportTable
        headers={headersName}
        reportName={`Product-Wise Lead Report (${filterRange.startMonth} - ${filterRange.endMonth})`}
        data={data}
      />
    </div>
  )
}
