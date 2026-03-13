import { useState, useEffect } from "react"
import ReportTable from "../../../components/primaryUser/ReportTable"
import UseFetch from "../../../hooks/useFetch"
import { MonthRangePicker } from "../../../components/primaryUser/MonthRangePicker"
import { Navigate, useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom"
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

  const navigate = useNavigate()
  console.log(date.startDate)
  console.log(date.endDate)
  console.log(filterRange.firstDay)
  console.log(filterRange.lastDay)
  const { data: salesfunnel } = UseFetch(
    filterRange.firstDay &&
      filterRange.lastDay &&
      `/lead/getsalesfunnels?startDate=${filterRange.firstDay}&endDate=${filterRange.lastDay}`
  )
  console.log(salesfunnel)
  // const { data: followup } = UseFetch(
  //   date.startDate &&
  //     date.endDate &&
  //     `/lead/getallproductwisereport?startDate=${filterRange.firstDay}&endDate=${filterRange.lastDay}`
  // )
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
    if (salesfunnel) {
      console.log(salesfunnel)
      setData(salesfunnel)
    }
  }, [salesfunnel])
  console.log(date)
  console.log(data)
  const headersName = ["Stage", "Count", "Value", "Conversion %"]
  const handleDateRange = (range) => {
    setFilterRange(range)
    console.log("Filter range:", range)
    // Fetch data from your Node.js API: /api/leads?start=${range.startDate}&end=${range.endDate}
  }
  const handleTotalLeadsClick = (row, header) => {
    console.log(row)
    console.log(header)
    const stage = row.stage
    console.log(stage)
    console.log(row.count)

    // Only navigate for Converted when its count > 0
    if (row.stage === "New Leads" && row.count <= 0) {
      return
    }

    // You can add similar guards for other headers if needed
    if (row.stage === "Contacted" && row.count <= 0) {
      return
    }
    if (row.stage === "System Study" && row.count <= 0) {
      return
    }
    if (row.stage === "Lost" && row.count <= 0) {
      return
    }
    if (row.stage === "Converted" && row.count <= 0) {
      return
    }
    if (stage === "New Leads") {
      navigate("/admin/transaction/lead/ownedLeadlist", {
        state: {
          role: "Admin"
        }
      })
    } else if (stage === "Contacted") {
      navigate("/admin/transaction/lead/leadFollowUp", {
        state: { pending: true }
      })
    }
  }
  console.log("jjjjjd")
  return (
    // <div className="h-full bg-gray-100">
    //   <MonthRangePicker onChange={handleDateRange} />

    //   <ReportTable
    //     headers={headersName}
    //     reportName="Sales Funnel"
    //     data={data}
    //   />
    // </div>
    <div className="h-full bg-blue-50 flex flex-col">
      {/* Top bar */}
      <div className="px-4 md:px-6 py-3 bg-blue-50 border-b border-blue-100">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Title */}
          <h1 className="text-lg md:text-xl font-bold text-gray-900">
            Sales Funnel
          </h1>

          {/* Date range */}
          <div className="flex items-center">
            <div className="bg-white rounded-lg px-3 py-1.5 shadow-sm border border-gray-200">
              <MonthRangePicker onChange={handleDateRange} />
            </div>
          </div>
        </div>
      </div>

      {/* Table wrapper */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full px-3 md:px-6 pb-4">
          <div className="h-full bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <ReportTable
              headers={headersName}
              reportName="Sales Funnel"
              data={data}
              onTotalLeadsClick={handleTotalLeadsClick}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
