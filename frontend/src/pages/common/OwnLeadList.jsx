import React, { useEffect, useState } from "react"
import UseFetch from "../../hooks/useFetch"
import { useNavigate } from "react-router-dom"
import { LeadhistoryModal } from "../../components/primaryUser/LeadhistoryModal"
import {
  Eye,
  Phone,
  Mail,
  User,
  Calendar,
  Clock,
  UserPlus,
  UserCheck,
  IndianRupee,
  BellRing, // Follow-up
  History // Event Log
} from "lucide-react"
import { getLocalStorageItem } from "../../helper/localstorage"
import { PropagateLoader } from "react-spinners"

export default function OwnLeadList() {
  const [showFullName, setShowFullName] = useState(false)
  const [tableData, setTableData] = useState([])
  const [loggedUser, setLoggedUser] = useState(null)
  const [showFullEmail, setShowFullEmail] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedData, setselectedData] = useState([])
  const [selectedLeadId, setselectedLeadId] = useState(null)
  const [ownLead, setownLead] = useState(true)
  const [companyBranches, setcompanyBranches] = useState(null)
  const [selectedCompanyBranch, setselectedCompanyBranch] = useState(null)
  const [showhistoryModal, sethistoryModal] = useState(false)
  const [historyList, setHistoryList] = useState([])
  const navigate = useNavigate()
  const { data: companybranches } = UseFetch("/branch/getBranch")
  const { data: ownedlead, loading } = UseFetch(
    loggedUser &&
      selectedCompanyBranch &&
      `/lead/ownregisteredLead?userId=${loggedUser._id}&role=${loggedUser.role}&selectedBranch=${selectedCompanyBranch}&ownlead=${ownLead}`
  )

  useEffect(() => {
    if (companybranches && companybranches.length > 0) {
      const userData = getLocalStorageItem("user")
      const branch = companybranches?.map((branch) => {
        return {
          value: branch._id,
          label: branch.branchName
        }
      })
      setcompanyBranches(branch)
      setselectedCompanyBranch(branch[0].value)
      setLoggedUser(userData)
    }
  }, [companybranches])

  useEffect(() => {
    if (ownedlead && ownedlead.length > 0) {
      if (ownLead) {
        const Data = normalizeTableData(ownedlead)
        setTableData(Data)
      } else {
        const groupedLeads = {}
        let grandTotal = 0
        ownedlead.forEach((lead) => {
          const assignedTo = lead?.leadBy?.name
          const amount = lead?.netAmount || 0
          grandTotal += amount
          if (!groupedLeads[assignedTo]) {
            groupedLeads[assignedTo] = []
          }
          groupedLeads[assignedTo].push(lead)
        })
        const Data = normalizeTableData(groupedLeads)
        setTableData(Data)
      }
    }
  }, [ownedlead])
  const normalizeTableData = (data) => {
    if (Array.isArray(data)) {
      return [{ staffName: null, leads: data }]
    } else if (typeof data === "object" && data !== null) {
      return Object.entries(data).map(([staffName, leads]) => ({
        staffName,
        leads
      }))
    }
    return []
  }
  const handlecloseModal = () => {
    setHistoryList([])
    sethistoryModal(false)
    setselectedLeadId(null)
  }
  const handleHistory = (Item) => {
    setselectedData(Item.activityLog)
    setHistoryList(Item.activityLog)
    setselectedLeadId(Item.leadId)
    sethistoryModal(true)
  }
  const renderTable = (data) => (
    <table className="border-collapse border border-gray-300 w-full text-sm">
      <thead className="whitespace-nowrap bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0 z-30 text-xs">
        <tr>
          <th className="border border-gray-300 px-3 py-1 text-left">
            <div className="flex items-center gap-1.5">
              <User className="w-3 h-3" />
              <span>Name</span>
            </div>
          </th>
          <th className="border border-gray-300 px-3 py-2 min-w-[140px] text-left">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3 h-3" />
              <span>Mobile</span>
            </div>
          </th>
          <th className="border border-gray-300 px-3 py-2 text-left">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3 h-3" />
              <span>Phone</span>
            </div>
          </th>
          <th className="border border-gray-300 px-3 py-1 text-left">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3 h-3" />
              <span>Email</span>
            </div>
          </th>
          <th className="border border-gray-300 px-3 py-1 min-w-[90px] text-left">
            Lead Id
          </th>

          <th className="border border-gray-300 px-3 py-1 min-w-[90px]">
            Action
          </th>
          <th className="border border-gray-300 px-3 py-1">Net Amount</th>
        </tr>
      </thead>
      <tbody>
        {data?.length > 0 ? (
          data.map((item, index) => (
            <React.Fragment key={index}>
              <tr className="bg-white border border-b-0 border-gray-300 hover:bg-blue-50 transition-colors">
                <td
                  onClick={() => setShowFullName(!showFullName)}
                  className={`px-3 min-w-[120px] py-1 cursor-pointer overflow-hidden font-medium text-gray-900 ${
                    showFullName
                      ? "whitespace-normal max-h-[3em]"
                      : "truncate whitespace-nowrap max-w-[120px]"
                  }`}
                  style={{ lineHeight: "1.5em" }}
                >
                  {item?.customerName?.customerName || item?.customerName}
                </td>
                <td className="px-3 py-1 text-gray-700">{item?.mobile}</td>
                <td className="px-3 py-1 text-gray-700">{item?.phone}</td>
                <td className="px-3 py-1 text-gray-600 truncate max-w-[180px]">
                  {item?.email}
                </td>
                <td className="px-3 py-1 font-medium text-blue-700">
                  {item?.leadId}
                </td>

                <td className="border border-b-0 border-gray-300 px-2 py-1 text-center">
                  <button
                    type="button"
                    onClick={() => handleHistory(item)}
                    className="inline-flex items-center gap-1 px-2  py-1 text-xs font-semibold text-white bg-indigo-600 rounded hover:bg-indigo-700 transition-colors w-full justify-center"
                  >
                    <BellRing className="w-3.5 h-3.5" />
                    Event Log
                  </button>
                </td>
                <td className="border border-b-0 border-gray-300 px-3 py-1"></td>
              </tr>

              <tr className="font-medium bg-gradient-to-r from-gray-100 to-gray-50 text-xs text-gray-600">
                <td className="px-3 py-1 border-t border-gray-200">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>Lead by</span>
                  </div>
                </td>
                <td className="px-3 py-1 border-t border-gray-200">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-green-600" />
                    <span>Assigned to</span>
                  </div>
                </td>
                <td className="px-3 py-1 border-t border-gray-200 text-nowrap">
                  <div className="flex items-center gap-1.5">
                    <UserPlus className="w-3.5 h-3.5 text-purple-600" />
                    <span>Assigned by</span>
                  </div>
                </td>
                <td className="px-3 py-1 border-t border-gray-200">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-orange-600" />
                    <span>No. of Followups</span>
                  </div>
                </td>
                <td className="px-3 py-1 border-t border-gray-200 min-w-[120px]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>Lead Date</span>
                  </div>
                </td>

                <td className="border border-t-0 border-b-0 border-gray-300 px-2 py-1 bg-white">
                  <button
                    onClick={() => {
                      const isAllocatedToeditable = item.activityLog.some(
                        (it) =>
                          it?.taskallocatedTo?._id === loggedUser._id &&
                          it?.taskClosed === false
                      )

                      loggedUser.role === "Admin"
                        ? navigate("/admin/transaction/lead/leadEdit", {
                            state: {
                              leadId: item._id,
                              isReadOnly: !isAllocatedToeditable
                            }
                          })
                        : navigate("/staff/transaction/lead/leadEdit", {
                            state: {
                              leadId: item._id,
                              isReadOnly: !isAllocatedToeditable
                            }
                          })
                    }}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors w-full justify-center"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View/Modify
                  </button>
                </td>
                <td className="border border-t-0 border-b-0 border-gray-300 px-3  bg-white font-semibold">
                  <div className="flex items-center justify-start">
                    <IndianRupee className="w-4 h-3.5 text-green-600 mr-1" />
                    <span className="text-lg font-semibold">
                      {" "}
                      {item.netAmount}
                    </span>
                  </div>
                </td>
              </tr>

              <tr className="bg-white">
                <td className="border border-t-0 border-gray-300 px-3 py-1 text-gray-900">
                  {item?.leadBy?.name}
                </td>
                <td className="border border-t-0 border-gray-300 px-3 py-1 text-gray-700">
                  {item?.taskallocatedTo?.name || "-"}
                </td>
                <td className="border border-t-0 border-gray-300 px-3 py-1 text-gray-700">
                  {item?.taskallocatedBy?.name || "-"}
                </td>
                <td className="border border-t-0 border-gray-300 px-3 py-1 text-gray-700"></td>
                <td className="border border-t-0 border-gray-300 px-3 py-1 text-gray-900">
                  {item.leadDate?.toString().split("T")[0]}
                </td>

                <td className="border border-t-0 border-b-0 border-gray-300 px-2 py-1">
                  {" "}
                </td>
                <td className="border border-t-0 border-b-0 border-gray-300 px-3 py-1"></td>
              </tr>

              {index !== data.length - 1 && (
                <tr>
                  <td colSpan="9" className="bg-gray-300">
                    <div className="h-[2px]"></div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))
        ) : (
          <tr>
            <td colSpan={8} className="text-center text-gray-500 py-6">
              {loading ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div>No Leads</div>
              )}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
  return (
    <div className="h-full ">
      <div className="flex justify-between items-center mx-3 md:mx-5 mt-3 mb-3">
        <h2 className="text-lg font-bold">
          {ownLead ? "Own Lead" : "All Lead"}
        </h2>
        <div className="flex justify-end items-center">
          {loggedUser?.role !== "Staff" && (
            <>
              <span className="text-sm whitespace-nowrap font-semibold">
                {ownLead ? "Own Lead" : "All Lead"}
              </span>
              <button
                onClick={() => {
                  setTableData([])
                  setownLead(!ownLead)
                }}
                className={`${
                  ownLead ? "bg-green-500" : "bg-gray-300"
                } w-11 h-6 flex items-center rounded-full transition-colors duration-300 mx-2`}
              >
                <div
                  className={`${
                    ownLead ? "translate-x-5" : "translate-x-0"
                  } w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300`}
                ></div>
              </button>
            </>
          )}
          <select
            value={selectedCompanyBranch || ""}
            onChange={(e) => {
              setTableData([])
              setselectedCompanyBranch(e.target.value)
            }}
            className="border border-gray-300 py-1 rounded-md px-2 focus:outline-none min-w-[150px] mr-2 cursor-pointer"
          >
            {companyBranches?.map((branch) => (
              <option key={branch.value} value={branch.value}>
                {branch.label}
              </option>
            ))}
          </select>

          <button
            onClick={() =>
              loggedUser?.role === "Admin"
                ? navigate("/admin/transaction/lead")
                : navigate("/staff/transaction/lead")
            }
            className="bg-black text-white py-1 px-3 rounded-lg shadow-lg hover:bg-gray-600"
          >
            New Lead
          </button>
        </div>
      </div>
      {/* Responsive Table Container this is the newest design*/}
      <div className="flex-1 overflow-x-auto rounded-lg overflow-y-auto shadow-xl mx-2 md:mx-3 mb-3">
        <>
          {(() => {
            const hasLeads =
              Array.isArray(tableData) &&
              tableData.some(
                (group) => Array.isArray(group.leads) && group.leads.length > 0
              )

           
            if (!hasLeads || tableData.length === 0) {
              return loading ? (
                <div className="flex justify-center py-6">
                  <PropagateLoader color="#3b82f6" size={10} />
                </div>
              ) : (
                <div className="text-center text-gray-500 py-6">
                  No Lead Available
                </div>
              )
            }

            return tableData.map(({ staffName, leads }, index) => (
              <div key={staffName || `group-${index}`} className="mb-6">
                {staffName && (
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    {staffName}{" "}
                    <span className="text-sm text-gray-500">
                      ({leads?.length || 0} Leads)
                    </span>
                  </h3>
                )}

                {/* only render table if there are leads */}
                {leads.length > 0 ? (
                  renderTable(leads)
                ) : (
                  <div className="text-center text-gray-400 py-3 text-sm">
                    No Lead under {staffName || "this group"}.
                  </div>
                )}
              </div>
            ))
          })()}
        </>
      </div>

      {showhistoryModal && historyList && historyList.length > 0 && (
        <LeadhistoryModal
          selectedLeadId={selectedLeadId}
          historyList={historyList}
          handlecloseModal={handlecloseModal}
        />
      )}
    </div>
  )
}
