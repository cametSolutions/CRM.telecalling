import React, { useState, useEffect } from "react"
import UseFetch from "../../../hooks/useFetch"
import { useLocation } from "react-router-dom"
import { useNavigate, useParams } from "react-router-dom"
// import { Plus, Building2, ChevronDown, BarChart3 } from "lucide-react"
import {
  Plus,
  Building2,
  ChevronDown,
  BarChart3,
  DollarSign,
  IndianRupee
} from "lucide-react"
const TaskAnalysisTable = () => {
  const { label } = useParams()
  const [netAmount, setnetAmount] = useState(0)
  const [selectedLeadId, setselectedLeadId] = useState(null)
  const [selectedCompanyBranch, setSelectedCompanyBranch] = useState(null)
  const [showFullName, setShowFullName] = useState(false)
  const [loggedUser, setLoggedUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [tableData, setTableData] = useState({})
  const [selectedData, setselectedData] = useState([])
  const { data: branches } = UseFetch("/branch/getBranch")
  const [loggedUserBranches, setLoggeduserBranches] = useState([])
  const { data: taskAnalysisLeads, loading } = UseFetch(
    loggedUser &&
      selectedCompanyBranch &&
      `/lead/getalltaskAnalysisLeads?selectedBranch=${selectedCompanyBranch}`
  )
  console.log(taskAnalysisLeads)
  const location = useLocation()
  const { branchid } = location.state || {}
  const navigate = useNavigate()
  console.log("hhhhh")
  useEffect(() => {
    const userData = localStorage.getItem("user")
    const user = JSON.parse(userData)
    setLoggedUser(user)
  }, [])
  useEffect(() => {
    if (loggedUser && branches && branches.length > 0) {
      if (loggedUser.role === "Admin") {
        const isselctedArray = loggedUser?.selected
        if (isselctedArray) {
          const loggeduserBranches = loggedUser.selected.map((item) => {
            return { value: item.branch_id, label: item.branchName }
          })
          setLoggeduserBranches(loggeduserBranches)
          setSelectedCompanyBranch(branchid)
        } else {
          const loggeduserBranches = branches.map((item) => {
            return { value: item._id, label: item.branchName }
          })
          setLoggeduserBranches(loggeduserBranches)
          setSelectedCompanyBranch(branchid)
        }
      } else {
        const loggeduserBranches = loggedUser.selected.map((item) => {
          return { value: item.branch_id, label: item.branchName }
        })
        setLoggeduserBranches(loggeduserBranches)
        setSelectedCompanyBranch(branchid)
      }
    }
  }, [loggedUser, branches])

  useEffect(() => {
    if (taskAnalysisLeads && taskAnalysisLeads.length > 0) {
      console.log(taskAnalysisLeads)
const a=taskAnalysisLeads.map((item)=>item.leadId)
console.log(a)
      console.log(taskAnalysisLeads.length)
      console.log(label)
      const filteredLeads = filterLeadsByLastTaskLabel(taskAnalysisLeads, label)
      const groupedLeads = {}
      let grandTotal = 0 //to hold total across all

      filteredLeads.forEach((lead) => {
        const assignedTo = lead?.allocatedTo?.name
        const amount = lead?.netAmount || 0
        grandTotal += amount
        if (!groupedLeads[assignedTo]) {
          groupedLeads[assignedTo] = []
        }

        groupedLeads[assignedTo].push(lead)
      })
      setnetAmount(parseFloat(grandTotal.toFixed(2)))
      setTableData(groupedLeads)
    }
  }, [taskAnalysisLeads])
  const filterLeadsByLastTaskLabel = (leads, label) => {
    console.log(label)
    return leads.filter((lead) => {
      const logs = lead.activityLog
      if (!logs || logs.length === 0) return false

      // 🔍 Find LAST log that HAS taskTo field
      const lastTaskLog = logs
        .filter((log) => log.taskTo !== undefined && log.taskTo !== null&&log.taskClosed===false&&log.followupClosed===false) // Only logs WITH taskTo
        .pop() // Get the LAST one

      // If no logs have taskTo, return false
      if (!lastTaskLog) return false

      return lastTaskLog.taskId?.taskName.toLowerCase() === label.toLowerCase()
    })
  }

  const getRemainingDays = (dueDate) => {
    const today = new Date()
    const target = new Date(dueDate)
    today.setHours(0, 0, 0, 0)
    target.setHours(0, 0, 0, 0)
    const diffTime = target - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {loading && <div className="w-full h-1 bg-blue-500 animate-pulse"></div>}

      <div className="mx-auto px-3 sm:px-6 lg:px-8 py-2 bg-blue-100 w-full">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
          {/* Left Section: Title + Task Type + Actions */}
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            {/* Icon + Title */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg items-center justify-center shadow-sm">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                Task Analysis
              </h1>
            </div>

            {/* Task Type Badge */}
            <span className="px-2.5 py-1 rounded-md text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-sm uppercase">
              {label || "FOLLOWUP"}
            </span>

            {/* New Lead Button */}
            <button
              onClick={() =>
                loggedUser.role === "Admin"
                  ? navigate("/admin/transaction/lead")
                  : navigate("/staff/transaction/lead")
              }
              className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-medium py-1.5 px-3 sm:px-4 rounded-md text-sm shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Lead</span>
            </button>
          </div>

          {/* Right Section: Total Amount */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Branch Selector */}
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                onChange={(e) => {
                  setTableData([])
                  setSelectedCompanyBranch(e.target.value)
                }}
                className="pl-9 pr-8 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer"
                value={selectedCompanyBranch}
              >
                {loggedUserBranches?.map((branch) => (
                  <option key={branch.value} value={branch.value}>
                    {branch.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-md">
              <IndianRupee className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1">
              <span className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
                Total:
              </span>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {netAmount}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="w-full mx-auto px-4 py-3">
          {tableData && Object.keys(tableData).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(tableData).map(([staffName, leads]) => (
                <div
                  key={staffName}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                >
                  <div className="bg-gray-50 px-4 py-1 border-b">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-blue-600">
                        {staffName}
                      </h3>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                        {leads.length} Lead{leads.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="border-collapse border border-gray-400 w-full text-sm ">
                      <thead className="whitespace-nowrap bg-blue-900 text-white sticky top-0 z-30">
                        <tr>
                          <th className="border border-r-0 border-gray-400 px-4 py-2">
                            SNO.
                          </th>
                          <th className="border border-r-0 border-gray-400 px-4 py-2">
                            Name
                          </th>
                          <th className="border border-r-0 border-l-0 border-gray-400 px-4 py-2 max-w-[200px] min-w-[200px]">
                            Mobile
                          </th>
                          <th className="border border-r-0 border-l-0 border-gray-400 px-4 py-2">
                            Phone
                          </th>
                          <th className="border border-r-0 border-l-0 border-gray-400 px-4 py-2">
                            Email
                          </th>
                          <th className="border border-r-0 border-l-0 border-gray-400 px-4 py-2 min-w-[100px]">
                            Lead Id
                          </th>
                          <th className="border border-r-0 border-l-0 border-gray-400 px-4 py-2 min-w-[100px]">
                            B.Amount
                          </th>

                          <th className="border border-gray-400 px-4 py-2 min-w-[100px]">
                            Action
                          </th>
                          <th className="border border-gray-400 px-4 py-2">
                            Net Amount
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {leads.map((item, index) => (
                          <React.Fragment key={item._id}>
                            <tr className="bg-white border border-gray-400 border-b-0 hover:bg-gray-50 transition-colors text-center ">
                              <td className="px-4 border border-b-0 border-gray-400"></td>
                              <td
                                onClick={() => setShowFullName(!showFullName)}
                                className={`px-4 cursor-pointer overflow-hidden text-black ${
                                  showFullName
                                    ? "whitespace-normal max-h-[3em]"
                                    : "truncate whitespace-nowrap max-w-[120px]"
                                }`}
                                style={{ lineHeight: "1.5em" }}
                              >
                                {item?.customerName?.customerName}
                              </td>
                              <td className="px-4 text-black">
                                {item?.mobile}
                              </td>
                              <td className="px-4 text-black">{item?.phone}</td>
                              <td className="px-4 text-black">{item?.email}</td>
                              <td className="px-4 text-black">
                                {item?.leadId}
                              </td>
                              <td className="border border-b-0 border-gray-400 px-4"></td>

                              <td className="border border-b-0 border-gray-400 px-1 text-yellow-500 font-semibold text-md">
                                <button
                                  onClick={() =>
                                    loggedUser.role === "Admin"
                                      ? navigate(
                                          "/admin/transaction/lead/leadEdit",
                                          {
                                            state: {
                                              leadId: item._id,
                                              isReadOnly: true
                                            }
                                          }
                                        )
                                      : navigate(
                                          "/staff/transaction/lead/leadEdit",
                                          {
                                            state: {
                                              leadId: item._id,
                                              isReadOnly: true
                                            }
                                          }
                                        )
                                  }
                                  className="hover:text-blue-500 cursor-pointer transition-colors"
                                >
                                  View
                                </button>
                              </td>
                              <td className="border border-b-0 border-gray-400 px-4"></td>
                            </tr>

                            <tr className="font-semibold bg-gray-200 text-center">
                              <td className="px-4 border border-b-0 border-t-0 border-gray-400 text-black">
                                {index + 1}
                              </td>
                              <td className="px-4 text-black">LeadDate</td>
                              <td className="px-4 text-black">Due Date</td>
                              <td className="px-4 text-black">Remaing Day's</td>
                              <td className="px-4 text-black">Last Comment</td>

                              <td className="px-4 font-medium"></td>

                              <td className="border border-t-0 border-b-0 border-gray-400 px-4">
                                {item?.balanceAmount}
                              </td>
                              <td className="border border-t-0 border-b-0 border-gray-400 px-4 text-blue-400 hover:text-blue-500 hover:cursor-pointer">
                                <button
                                  onClick={() => {
                                    setselectedData(item?.activityLog)
                                    setselectedLeadId(item?.leadId)
                                    setShowModal(true)
                                  }}
                                  type="button"
                                >
                                  Event Log
                                </button>
                              </td>
                              <td className="border border-t-0 border-b-0 border-gray-400 px-4 text-black">
                                ₹{item.netAmount?.toLocaleString()}
                              </td>
                            </tr>

                            <tr className="bg-white text-center">
                              <td className="border border-t-0 border-r-0 border-b-0 border-gray-400 px-4 py-0.5"></td>
                              <td className="border border-t-0 border-r-0 border-b-0 border-gray-400 px-4 py-0.5 text-black">
                                {new Date(item.leadDate).toLocaleDateString(
                                  "en-GB"
                                )}
                              </td>
                              <td className="border border-t-0 border-r-0 border-l-0 border-b-0 border-gray-400 px-4 py-0.5 text-md text-red-400 font-bold">
                                {new Date(item.dueDate).toLocaleDateString(
                                  "en-GB"
                                )}
                              </td>
                              <td className="border border-t-0 border-r-0 border-l-0 border-b-0 border-gray-400 px-4 py-0.5 text-red-400 text-md font-bold">
                                {getRemainingDays(item.dueDate)} days left
                              </td>
                              <td className="border border-t-0 border-r-0 border-l-0 border-b-0 border-gray-400 px-4 py-0.5 text-black">
                                {item?.activityLog[
                                  item?.activityLog?.length - 1
                                ]?.remarks || "No comments"}
                              </td>
                              <td className="border border-t-0 border-r-0 border-l-0 border-b-0 border-gray-400 px-4 py-0.5 text-black"></td>
                              <td className="border border-t-0 border-b-0 border-gray-400 px-4 py-0.5"></td>
                              <td className="border border-t-0 border-b-0 border-gray-400 px-4 py-0.5"></td>

                              <td className="border border-t-0 border-b-0 border-gray-400 px-4 py-0.5"></td>
                            </tr>
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Loading...</span>
                </div>
              ) : (
                <div className="text-gray-500">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-lg font-medium">No data available</p>
                  <p className="text-sm">
                    There are no leads to display at the moment.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        {showModal && selectedData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-40">
            <div className="relative overflow-x-auto overflow-y-auto md:max-h-64 lg:max-h-96 shadow-xl rounded-lg mx-3 md:mx-5 px-7 p-3 bg-white w-full max-w-4xl">
              {/* Close Button */}
              <button
                onClick={() => {
                  setselectedLeadId(null)
                  setselectedData([])
                  setShowModal(false)
                }}
                className="absolute top-2 right-2  text-red-500 font-bold hover:text-red-600 text-lg"
              >
                ✕
              </button>

              {/* Header */}
              <div className="flex justify-center text-xl font-bold gap-2 mb-3">
                <span>Lead Id:</span>
                <span className="text-indigo-600">{selectedLeadId}</span>
              </div>

              {/* Table */}
              <table className="w-full text-sm border-collapse text-center">
                <thead className="text-center sticky top-0 z-10">
                  <tr className="bg-indigo-100">
                    <th className="border border-indigo-200 p-2 min-w-[100px]">
                      Date
                    </th>
                    <th className="border border-indigo-200 p-2 min-w-[100px]">
                      User
                    </th>
                    <th className="border border-indigo-200 p-2 min-w-[100px]">
                      Task
                    </th>
                    <th className="border border-indigo-200 p-2 w-fit min-w-[200px]">
                      Remark
                    </th>
                    {label === "followup" && (
                      <th className="border border-indigo-200 p-2 min-w-[100px]">
                        Next Follow Up Date
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {selectedData && selectedData.length > 0 ? (
                    selectedData.map((item, index) => {
                      const hasFollowerData =
                        Array.isArray(item.folowerData) &&
                        item.folowerData.length > 0

                      return hasFollowerData ? (
                        item.folowerData.map((subItem, subIndex) => (
                          <tr
                            key={`${index}-${subIndex}`}
                            className={
                              (index + subIndex) % 2 === 0
                                ? "bg-gray-50"
                                : "bg-white"
                            }
                          >
                            {loggedUser?.role === "Admin" && (
                              <td className="border border-gray-200 p-2">
                                {item?.followedId?.name}
                              </td>
                            )}
                            <td className="border border-gray-200 p-2">
                              {new Date(subItem.followerDate)
                                .toLocaleDateString("en-GB")
                                .split("/")
                                .join("-")}
                            </td>
                            <td className="border border-gray-200 p-2">
                              {subItem?.followerDescription || "N/A"}
                            </td>
                            <td className="border border-gray-200 p-2"></td>
                          </tr>
                        ))
                      ) : (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          }
                        >
                          <td className="border border-gray-200 p-2">
                            {new Date(item.submissionDate)
                              .toLocaleDateString("en-GB")
                              .split("/")
                              .join("-")}
                          </td>
                          <td className="border border-gray-200 p-2">
                            {item?.submittedUser?.name}
                          </td>
                          <td className="border border-gray-200 p-2 min-w-[160px]">
                            <div>
                              {item?.taskallocatedTo ? (
                                <>
                                  <span>{item?.taskBy?.taskName || "N/A"}</span>
                                  <span className="text-red-500">
                                    {" "}
                                    - {item?.taskallocatedTo?.name || ""}
                                  </span>
                                  <br />
                                  <span className="text-red-500">
                                    {item?.taskId?.taskName}
                                  </span>
                                  {item.allocationDate && (
                                    <span>
                                      {" "}
                                      - on(
                                      {new Date(
                                        item.allocationDate
                                      ).toLocaleDateString("en-GB")}
                                      )
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span>{item?.taskBy?.taskName}</span>
                              )}
                            </div>
                          </td>
                          <td className="border border-gray-200 p-2">
                            {item?.remarks || "N/A"}
                          </td>
                          {label === "followup" && (
                            <td className="border border-gray-200 p-2">
                              {item?.nextfollowUpDate
                                ? new Date(item.nextfollowUpDate)
                                    .toLocaleDateString("en-GB")
                                    .split("/")
                                    .join("-")
                                : "-"}
                            </td>
                          )}
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center bg-white p-3 text-gray-500 italic"
                      >
                        No followUps
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskAnalysisTable
