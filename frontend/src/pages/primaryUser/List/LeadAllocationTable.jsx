import { useState, useEffect } from "react"
import UseFetch from "../../../hooks/useFetch"
import { useFetcher } from "react-router-dom"

const LeadAllocationTable = () => {
  const [status, setStatus] = useState("Pending")

  const [tableData, setTableData] = useState([])
  const { data: leadPendinglist } = UseFetch(
    status && `/lead/getallLead?Status=${status}`
  )
  console.log(leadPendinglist)
  useEffect(() => {
    if (leadPendinglist) {
      setTableData(leadPendinglist)
    }
  }, [leadPendinglist])
  const toggleStatus = () => {
    setStatus(
      status === "Pending Allocation"
        ? "Approved Allocation"
        : "Pending Allocation"
    )
  }
  ;("")
  // Sample data
  const data = [
    { id: 1, name: "John Doe", department: "HR", status: "Pending" },
    { id: 2, name: "Jane Smith", department: "Finance", status: "Approved" },
    { id: 3, name: "Alice Brown", department: "IT", status: "Pending" }
  ]

  return (
    <div className="p-4">
      {/* Toggle Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">{status}</h2>
        {/* <button
          onClick={toggleStatus}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Toggle Allocation
        </button> */}
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-blue-500 text-white text-sm">
            <tr>
              <th className="px-4 py-2 text-center">Lead Date</th>
              <th className="px-4 py-2 text-center">Lead ID</th>
              <th className="px-4 py-2 text-center">Customer Name</th>
              <th className="px-4 py-2 text-center">Mobile Number</th>
              <th className="px-4 py-2 text-center">Phone Number</th>
              <th className="px-4 py-2 text-center">Email Id</th>
              <th className="px-4 py-2 text-center">Product/Services</th>
              <th className="px-4 py-2 text-center">Net Amount</th>
              <th className="px-4 py-2 text-center">Lead By</th>
              <th className="px-4 py-2 text-center">Allocated To</th>
              <th className="px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-center divide-gray-200">
            {tableData?.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2 border border-gray-300">
                  {item.leadDate}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {item.leadId}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {item.customerName}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {item.department}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {item.department}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {item.department}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {item.department}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {item.department}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {item.department}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {item.department}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {item.department}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LeadAllocationTable
