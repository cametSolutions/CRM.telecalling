import React from "react";
import ReportTable from "../../../components/primaryUser/ReportTable";

export default function FollowupSummaryDashboard() {
  const headersName = [
    "Staff",
    "Total Leads",
    "Due Today",
    "Overdue",
    "Future",
    "Converted",
    "Lost",
    "Conversion %",
  ];
  const data = [
    {
      Staff: "Abi",
      Totalleads: 12,
      Duetoday: 3,
      Overdue: 4,
      Future: 5,
      Converted: 5,
      Lost: 4,
      ConversionRate: 23.34,
    },
    {
      Staff: "athul",
      Totalleads: 5,
      Duetoday: 8,
      Overdue: 9,
      Future: 9,
      Converted: 3,
      Lost: 9,
      ConversionRate: 56,
    },
  ];
  console.log("jjjjj");
  return (
    <div className="h-full bg-gray-100">
      <ReportTable
        headers={headersName}
        reportName="Follow-Up Summary"
        data={data}
      />
    </div>
  );
}
