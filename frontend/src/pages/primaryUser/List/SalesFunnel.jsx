
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
console.log(date.startDate)
console.log(date.endDate)
console.log(filterRange.firstDay)
console.log(filterRange.lastDay)
const {data:a}=UseFetch(filterRange.firstDay&&filterRange.lastDay&&`/lead/getsalesfunnels?startDate=${filterRange.firstDay}&endDate=${filterRange.lastDay}`)
console.log(a)
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
    if (a) {
      console.log(a)
      setData(a)
    }
  }, [a])
  console.log(date)
  const headersName = [
    "Stage",
    "Count",
    "Value",
    
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

     
      <ReportTable
        headers={headersName}
        reportName="Sales Funnel"
        data={data}
      />
    </div>
  )
}

