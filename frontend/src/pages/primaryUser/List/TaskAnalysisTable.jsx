import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import TableSkeletonLoader from "../../../components/common/SkeletonLoader"
import BarLoader from "react-spinners/BarLoader"
import UseFetch from "../../../hooks/useFetch"
const TaskAnalysisTable = () => {
  const { label } = useParams()


  const [loggedUserBranches, setLoggeduserBranches] = useState([])
  const [selectedCompanyBranch, setSelectedCompanyBranch] = useState(null)

  const [loggedUser, setLoggedUser] = useState(null)
  const [tableData, setTableData] = useState({})
  const { data: branches } = UseFetch("/branch/getBranch")
 
  const {
    data: taskAnalysisLeads,
    loading,
    
  } = UseFetch(
    loggedUser &&
      selectedCompanyBranch &&
      `/lead/getalltaskAnalysisLeads?selectedBranch=${selectedCompanyBranch}`
  )
  const navigate = useNavigate()
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
          setSelectedCompanyBranch(loggeduserBranches[0].value)
        } else {
          const loggeduserBranches = branches.map((item) => {
            return { value: item._id, label: item.branchName }
          })
          setLoggeduserBranches(loggeduserBranches)
          setSelectedCompanyBranch(loggeduserBranches[0].value)
        }
      } else {
        const loggeduserBranches = loggedUser.selected.map((item) => {
          return { value: item.branch_id, label: item.branchName }
        })
        setLoggeduserBranches(loggeduserBranches)
        setSelectedCompanyBranch(loggeduserBranches[0].value)
      }
    }
  }, [loggedUser, branches])
  
  useEffect(() => {
    if (taskAnalysisLeads && taskAnalysisLeads.length > 0) {
      const filteredLeads = filterLeadsByLastTaskLabel(taskAnalysisLeads, label)
      // const individualanalysis=filteredLeads.map(())
      const groupedLeads = {}
      filteredLeads.forEach((lead) => {
        const assignedTo = lead?.allocatedTo?.name

        if (!groupedLeads[assignedTo]) {
          groupedLeads[assignedTo] = []
        }

        groupedLeads[assignedTo].push(lead)
      })
      
      setTableData(groupedLeads)
    }
  }, [taskAnalysisLeads])
  const filterLeadsByLastTaskLabel = (leads, label) => {
    return leads.filter((lead) => {
      const logs = lead.activityLog
      if (!logs || logs.length === 0) return false

      const lastLog = logs[logs.length - 1]
      return lastLog.taskTo?.toLowerCase() === label.toLowerCase()
    })
  }

 

  
 
  return (
    <div className="flex flex-col h-full">
      <div>
        {loading && (
          <BarLoader
            cssOverride={{ width: "100%", height: "4px" }} // Tailwind's `h-4` corresponds to `16px`
            color="#4A90E2" // Change color as needed
          />
        )}
      </div>
      <div className="flex  sticky top-0 z-40 pt-3 bg-white">
        <h2 className="text-lg font-bold ml-5 ">Task Analysis</h2>

        <div className="flex flex-grow justify-end  mr-4 gap-6 items-center">
          <select
            onChange={(e) => {
              setSelectedCompanyBranch(e.target.value)
            }}
            className="border border-gray-300 py-1 rounded-md px-2 focus:outline-none min-w-[120px]"
          >
            {loggedUserBranches?.map((branch) => (
              <option key={branch._id} value={branch.value}>
                {branch.label}
              </option>
            ))}
          </select>

          <button
            onClick={() =>
              loggedUser.role === "Admin"
                ? navigate("/admin/transaction/lead")
                : navigate("/staff/transaction/lead")
            }
            className="bg-black text-white py-1 px-3 rounded-lg shadow-lg hover:bg-gray-600"
          >
            New Lead
          </button>
        </div>
      </div>
      <div className=" text-left mx-4">
        <h2 className=" text-xl font-bold bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent mb-1">
          {label.toUpperCase()}
        </h2>
      </div>
      <div className="px-4 w-full">
        {Object.entries(tableData) && Object.entries(tableData).length > 0
          ? Object.entries(tableData).map(([staffName, leads]) => (
              <div
                key={staffName}
                className="mb-2 transform hover:scale-[1.01] transition-all duration-300"
              >
                <div className="bg-white/90 backdrop-blur-sm border border-white/30 shadow-xl rounded-2xl overflow-hidden">
                  <div className=" bg-gradient-to-br from-blue-400 to-blue-600 px-6 py-1 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <h2 className="font-bold text-xl text-white tracking-wide">
                          {staffName.toUpperCase()}
                        </h2>
                      </div>
                      <div className="bg-white/20 px-4 py-1 rounded-full backdrop-blur-sm">
                        <span className="text-white font-semibold text-sm">
                          {leads.length} Leads
                        </span>
                      </div>
                    </div>

                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-10 -translate-x-10"></div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm" border="0">
                      <thead className="bg-gradient-to-r from-slate-100 to-slate-200">
                        <tr className="w-full text-left border-b-2 border-blue-200">
                          <th className="px-6 py-2 font-bold text-slate-700 tracking-wide">
                            LEAD ID
                          </th>
                          <th className="px-6 py-2 font-bold text-slate-700 tracking-wide">
                            CLIENT NAME
                          </th>
                          <th className="px-6 py-2 font-bold text-slate-700 tracking-wide">
                            LEAD DATE
                          </th>
                          <th className="px-6 py-2 font-bold text-slate-700 tracking-wide">
                            DUE DATE
                          </th>
                          <th className="px-6 py-2 font-bold text-slate-700 tracking-wide">
                            RE.DAYS
                          </th>
                          <th className="px-6 py-2 font-bold text-slate-700 tracking-wide">
                            P.AMOUNT
                          </th>
                          <th className="px-6 py-2 font-bold text-slate-700 tracking-wide">
                            B.AMOUNT
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {leads.map((lead, index) => (
                          <tr
                            key={lead._id}
                            className={`hover:bg-blue-50/50 transition-all duration-200 transform hover:scale-[1.005] ${
                              index % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                            }`}
                          >
                            <td className="px-6 py-1">
                              <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                                <span className="font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                                  {lead.leadId}
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-1">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">
                                    {lead.customerName?.customerName?.charAt(
                                      0
                                    ) || "C"}
                                  </span>
                                </div>
                                <span className="font-semibold text-blue-800 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                                  {lead.customerName?.customerName}
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-1">
                              <div className="flex items-center space-x-2">
                                <svg
                                  className="w-4 h-4 text-red-500"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-lg font-medium border border-red-200">
                                  {new Date(lead.leadDate).toLocaleDateString()}
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-1">
                              <div className="flex items-center space-x-2">
                                <svg
                                  className="w-4 h-4 text-orange-500"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-lg font-medium border border-orange-200">
                                  {lead.dueDate
                                    ? new Date(
                                        lead.dueDate
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-1">
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
                                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-lg font-bold border border-yellow-200">
                                  {lead.dueDate
                                    ? Math.ceil(
                                        (new Date(lead.dueDate) - new Date()) /
                                          (1000 * 60 * 60 * 24)
                                      ) + " days"
                                    : "N/A"}
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-1">
                              <div className="flex items-center space-x-2">
                                <svg
                                  className="w-4 h-4 text-purple-500"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-lg font-bold border border-purple-200">
                                  {lead?.netAmount}
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-1">
                              <div className="flex items-center space-x-2">
                                <svg
                                  className="w-4 h-4 text-green-500"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-lg font-bold border border-green-200">
                                  0
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-gradient-to-r from-gray-50 to-slate-100 px-6 py-2 border-t border-gray-200">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 font-medium">
                        Total: {leads.length} leads
                      </span>
                      {/* <div className="flex space-x-4">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                          Active: {leads.length}
                        </span>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
                          Completed: 0
                        </span>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            ))
          : loading && <TableSkeletonLoader rows={6} staffCount={2} />}
      </div>
    </div>
  )
}

export default TaskAnalysisTable
