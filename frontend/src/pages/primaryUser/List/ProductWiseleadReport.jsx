// import React from "react";
// import { useState, useEffect } from "react";
// import ReportTable from "../../../components/primaryUser/ReportTable";
// import UseFetch from "../../../hooks/useFetch";
// import { MonthRangePicker } from "../../../components/primaryUser/MonthRangePicker";
// export default function ProductWiseleadReport() {
//   const [filterRange, setFilterRange] = useState({
//     startDate: null,
//     endDate: null,
//   });
//   useEffect(() => {
//     if (filterRange.startDate !== null && filterRange.endDate !== null) {
//       console.log(filterRange);
//     }
//   }, [filterRange]);
//   console.log(filterRange);
//   const headersName = [
//     "Staff",
//     "Product",
//     "Total Leads",
//     "Converted",
//     "Lost",
//     "Pending",
//     "Total Value",
//     "Converted Value",
//   ];
//   const data = [
//     {
//       Staff: "John Doe",
//       Product: "CRM Pro",
//       TotalLeads: 245,
//       Converted: 89,
//       Lost: 112,
//       Pending: 44,
//       TotalValue: "₹2,45,000",
//       ConvertedValue: "₹1,78,000",
//     },
//     {
//       Staff: "Jane Smith",
//       Product: "ERP Enterprise",
//       TotalLeads: 198,
//       Converted: 67,
//       Lost: 98,
//       Pending: 33,
//       TotalValue: "₹1,98,000",
//       ConvertedValue: "₹1,34,000",
//     },
//   ];
//   const handleDateRange = (range) => {
//     setFilterRange(range);
//     // Filter your MongoDB data: { $gte: range.startDate, $lte: range.endDate }
//     //fetchFilteredData(range.startDate, range.endDate);
//   };
//   return (
//     <div className="h-full bg-gray-100">
//       <MonthRangePicker
//         onChange={handleDateRange}
//         setFilterRange={setFilterRange}
//       />
//       <ReportTable
//         headers={headersName}
//         reportName="Prouct-Wise Lead Report(Staff Performance)"
//         data={data}
//       />
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import ReportTable from "../../../components/primaryUser/ReportTable";
import { MonthRangePicker } from "../../../components/primaryUser/MonthRangePicker";
import api from "../../../api/api";
import UseFetch from "../../../hooks/useFetch";
export default function ProductWiseleadReport() {
  const [filterRange, setFilterRange] = useState({
    startDate: null,
    endDate: null,
    startMonth: "",
    endMonth: "",
    firstDay: null,
    lastDay: null,
  });
  const [data, setData] = useState([]); // Dynamic data
  //   const { data: report } = UseFetch(
  //     filterRange.firstDay && filterRange.lastDay
  //       ? `/lead/getallproductwisereport?startDate=${filterRange.firstDay}&endDate=${filterRange.lastDay}`
  //       : null
  //   );
  const { data: report } = UseFetch(
    filterRange.firstDay !== null &&
      filterRange.lastDay !== null &&
      `/lead/getallproductwisereport?startDate=${filterRange.firstDay}&endDate=${filterRange.lastDay}`
  );
  console.log(report);

  console.log(filterRange);
  const headersName = [
    "Staff",
    "Product",
    "Total Leads",
    "Converted",
    "Lost",
    "Pending",
    "Total Value",
    "Converted Value",
  ];

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
      ConvertedValue: "₹1,78,000",
    },
    {
      Staff: "Jane Smith",
      Product: "ERP Enterprise",
      TotalLeads: 198,
      Converted: 67,
      Lost: 98,
      Pending: 33,
      TotalValue: "₹1,98,000",
      ConvertedValue: "₹1,34,000",
    },
  ];
  console.log(filterRange);
  const handleDateRange = (range) => {
    setFilterRange(range);
    console.log("Filter range:", range);
    // Fetch data from your Node.js API: /api/leads?start=${range.startDate}&end=${range.endDate}
    setData(mockData); // Replace with API data
  };

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      <MonthRangePicker onChange={handleDateRange} />

      <ReportTable
        headers={headersName}
        reportName={`Product-Wise Lead Report (${filterRange.startMonth} - ${filterRange.endMonth})`}
        data={data}
      />
    </div>
  );
}
