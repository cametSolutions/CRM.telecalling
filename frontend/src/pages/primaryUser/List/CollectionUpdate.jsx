import React, { useEffect, useState } from "react"
import UseFetch from "../../../hooks/useFetch"
import { useNavigate } from "react-router-dom"
import { PaymentHistoryModal } from "../../../components/primaryUser/PaymentHistoryModal"
import { LeadhistoryModal } from "../../../components/primaryUser/LeadhistoryModal"
import { CollectionupdateModal } from "../../../components/primaryUser/CollectionupdateModal"
import api from "../../../api/api"
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
  History,
  CreditCard, // Payment History
  ClipboardCheck, // Collection Update,
  ChevronDown,
  ChevronRight
} from "lucide-react"
import { getLocalStorageItem } from "../../../helper/localstorage"
import { PropagateLoader } from "react-spinners"
import { toast } from "react-toastify"

export default function CollectionUpdate() {
  const [showFullName, setShowFullName] = useState(false)
  const [tableData, setTableData] = useState([])
  const [isdepartmentisAccountant, setisdepartmentAccountant] = useState(false)
  const [loggedUser, setLoggedUser] = useState(null)
  const [leadId, setleadId] = useState(null)
  const [leadDocId, setleadDocId] = useState(null)
  const [partner, setPartner] = useState([])
  const [showFullEmail, setShowFullEmail] = useState(false)
  const [paymenthistoryModal, setpaymentHistoryModal] = useState(false)
  const [collectionupdateModal, setcollectionUpdateModal] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedData, setselectedData] = useState(null)
  const [selectedLeadId, setselectedLeadId] = useState(null)
  const [verifiedLead, setverifiedLead] = useState(false)
  const [companyBranches, setcompanyBranches] = useState(null)
  const [selectedCompanyBranch, setselectedCompanyBranch] = useState(null)
  const [showhistoryModal, sethistoryModal] = useState(false)
  const [paymentHistoryList, setpaymentHistoryList] = useState([])
  const [historyList, setHistoryList] = useState([])
  const [loggedUserBranches, setloggedUserBranches] = useState([])
  const navigate = useNavigate()
  const { data: companybranches } = UseFetch("/branch/getBranch")
  // const {data}=UseFetch("/lead/fix-leadverified")
  const {
    data: collectionlead,
    loading,
    refreshHook
  } = UseFetch(
    selectedCompanyBranch &&
      `/lead/collectionLeads?selectedBranch=${selectedCompanyBranch}&verified=${verifiedLead}`
  )
  const { data: partners } = UseFetch("/customer/getallpartners")

  useEffect(() => {
    if (companybranches && companybranches.length > 0) {
      const userData = getLocalStorageItem("user")
      if (
        userData.department?.department === "Accountant" ||
        userData.department?._id === "670c863652847bbebbd35743"
      ) {
        setisdepartmentAccountant(true)
      }

      setLoggedUser(userData)
      if (userData.role === "Admin") {
        if (userData?.selected) {
          const branches = userData.selected.map((branch) => {
            return {
              value: branch.branch_id,
              label: branch.branchName
            }
          })
          setloggedUserBranches(branches)
        } else {
          const staffbranches = companybranches.map((branch) => {
            return {
              value: branch._id,
              label: branch.branchName
            }
          })

          setloggedUserBranches(staffbranches)
        }
      } else {
        const branches = userData.selected.map((branch) => {
          return {
            value: branch.branch_id,
            label: branch.branchName
          }
        })
        setloggedUserBranches(branches)
      }
    }
  }, [companybranches])
  useEffect(() => {
    if (loggedUserBranches && loggedUserBranches.length > 0) {
      const defaultbranch = loggedUserBranches[0]
      setselectedCompanyBranch(defaultbranch.value)
    }
  }, [loggedUserBranches])
  useEffect(() => {
    if (
      collectionlead &&
      collectionlead.length > 0 &&
      partners &&
      partners.length > 0 &&
      loggedUser
    ) {
      if (
        loggedUser?.department?._id === "670c863652847bbebbd35743" ||
        loggedUser?.department?.department === "Accounts"
      ) {
        const filteredCollectionleads = collectionlead.filter(
          (item) => item.paymentHistory?.length > 0
        )
        const sortedLeads = filteredCollectionleads.sort((a, b) => {
          const getOldest = (lead) =>
            lead.paymentHistory?.length
              ? Math.min(
                  ...lead.paymentHistory.map((p) => new Date(p.paymentDate))
                )
              : Date.now()

          return getOldest(a) - getOldest(b)
        })
        setTableData(normalizeTableData(sortedLeads))
      } else {
        setTableData(normalizeTableData(collectionlead))
      }

      setPartner(partners)
    }
  }, [collectionlead, partners, loggedUser])
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

  const handleCollection = (item) => {
    setcollectionUpdateModal(true)
    setselectedData(item)
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
  const handleCollectionUpdate = async (formData) => {
    try {
      const response = await api.post("/lead/collectionUPdate", formData)
      if (response.status === 200) {
        toast.success("payment updated successfully")
        refreshHook()
        return response
      }
    } catch (error) {
      toast.error("something went wrong")
      console.log("error", error.message)
    }
  }

  
  const renderTable = (data) => {
    const LeadRow = ({ item, index }) => {
      const [open, setOpen] = useState(false)

      const lastLog = item.activityLog[item.activityLog.length - 1]
      const followupDate = lastLog?.nextFollowUpDate
        ? new Date(lastLog.nextFollowUpDate)
            .toLocaleDateString("en-GB")
            .split("/")
            .join("-")
        : "-"

      return (
        <>
          {/* ── Main row ── */}
          <tr
            onClick={() => setOpen((v) => !v)}
            className="cursor-pointer bg-white hover:bg-blue-50 transition-colors border border-gray-300"
          >
            <td className="pl-2 pr-1 py-2 w-5 border border-gray-300">
              {open ? (
                <ChevronDown className="w-3.5 h-3.5 text-blue-500" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              )}
            </td>
            <td className="px-3 py-2 font-semibold text-gray-900 text-sm border border-gray-300 whitespace-nowrap uppercase">
              {item?.customerName?.customerName}
            </td>
            <td className="px-3 py-2 text-gray-700 text-sm border border-gray-300 whitespace-nowrap">
              {item?.mobile}
            </td>
            <td className="px-3 py-2 text-sm border border-gray-300 max-w-[200px]">
              <span
                className="text-red-600 font-medium truncate block"
                title={lastLog?.remarks}
              >
                {lastLog?.remarks || "-"}
              </span>
            </td>
            <td className="px-3 py-2 text-sm text-gray-700 border border-gray-300 whitespace-nowrap">
              {followupDate}
            </td>
            <td
              className="px-2 py-2 border border-gray-300"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => handleHistory(item)}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-white bg-indigo-600 rounded hover:bg-indigo-700 transition-colors w-full justify-center"
              >
                <BellRing className="w-3.5 h-3.5" />
              </button>
            </td>
            <td
              className="px-2 py-2 border border-gray-300"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                // onClick={() =>
                //   loggedUser.role === "Admin"
                //     ? navigate("/admin/transaction/lead/leadEdit", {
                //         state: {
                //           leadId: item._id,
                //           isReadOnly: !isAllocatedToeditable
                //         }
                //       })
                //     : navigate("/staff/transaction/lead/leadEdit", {
                //         state: {
                //           leadId: item._id,
                //           isReadOnly: !isAllocatedToeditable
                //         }
                //       })
                // }
                onClick={() => {
                  setpaymentHistoryList(item.paymentHistory)
                  setpaymentHistoryModal(true)
                  setleadId(item.leadId)
                  setleadDocId(item._id)
                }}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors w-full justify-center"
              >
                <CreditCard className="w-3.5 h-3.5" />
              </button>
            </td>

            <td
              className="px-2 py-2 border border-gray-300"
              onClick={(e) => e.stopPropagation()}
            >
              {!verifiedLead && (
                <button
                  onClick={() => handleCollection(item)}
                  className="inline-flex items-center gap-1  py-1 text-xs font-semibold text-white bg-green-500 rounded hover:bg-green-600 transition-colors w-full justify-center"
                >
                  <ClipboardCheck className="w-3.5 h-3.5" />
                  
                </button>
              )}
            </td>

            <td className="px-3 py-2 text-sm font-semibold text-green-700 border border-gray-300 whitespace-nowrap text-right">
              <span className="inline-flex items-center gap-0.5 justify-end">
                <IndianRupee className="w-3.5 h-3.5" />
                {item.netAmount?.toLocaleString("en-IN")}
              </span>
            </td>
          </tr>

          {/* ── Expanded rows ── */}
          {open && (
            <>
              {/* Sub-header row */}
              {/* Columns: chevron | leadby | assignedto | assignedby | followups | leaddate | leadid(blue) | phone(blue) | email(blue) */}
              <tr className="text-xs font-medium border border-gray-300 whitespace-nowrap">
                <td className="border border-gray-300 bg-gray-100" />
                <td className="px-3 py-1 border border-gray-300 bg-gray-100 text-gray-600">
                  <div className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>Lead by</span>
                  </div>
                </td>
                <td className="px-3 py-1 border border-gray-300 bg-gray-100 text-gray-600">
                  <div className="flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-green-600" />
                    <span>Assigned to</span>
                  </div>
                </td>
                <td className="px-3 py-1 border border-gray-300 bg-gray-100 text-gray-600">
                  <div className="flex items-center gap-1">
                    <UserPlus className="w-3.5 h-3.5 text-purple-600" />
                    <span>Assigned by</span>
                  </div>
                </td>
                <td className="px-3 py-1 border border-gray-300 bg-gray-100 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-orange-600" />
                    <span>No. of Followups</span>
                  </div>
                </td>
                <td className="px-3 py-1 border border-gray-300 bg-gray-100 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    <span>Lead Date</span>
                  </div>
                </td>
                <td className="px-3 py-1 border border-gray-300 bg-blue-600 text-white">
                  <span>Lead ID</span>
                </td>
                <td className="px-3 py-1 border border-gray-300 bg-blue-600 text-white">
                  <div className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>Phone</span>
                  </div>
                </td>
                <td className="px-3 py-1 border border-gray-300 bg-blue-600 text-white">
                  <div className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </div>
                </td>
              </tr>

              {/* Sub-data row */}
              <tr className="bg-white text-xs border border-b-2 border-gray-300 border-b-gray-400 whitespace-nowrap">
                <td className="border border-gray-300" />
                <td className="px-3 py-1.5 border border-gray-300 text-gray-800 font-medium">
                  {item?.leadBy?.name || "-"}
                </td>
                <td className="px-3 py-1.5 border border-gray-300 text-gray-700 ">
                  {/* {item?.allocatedTo?.name || "-"} */}
                  {item?.taskallocatedTo?.name || "-"}
                </td>
                <td className="px-3 py-1.5 border border-gray-300 text-gray-700">
                  {/* {item?.allocatedBy?.name || "-"} */}
                  {item?.taskallocatedBy?.name || "-"}
                </td>
                <td className="px-3 py-1.5 border border-gray-300 text-gray-700">
                  {/* {item.activityLog.length} */}
                </td>
                <td className="px-3 py-1.5 border border-gray-300 text-gray-700">
                  {item.leadDate?.toString().split("T")[0] || "-"}
                </td>
                <td className="px-3 py-1.5 border border-gray-300 font-bold text-blue-700">
                  {item?.leadId}
                </td>
                <td className="px-3 py-1.5 border border-gray-300 text-gray-700">
                  {item?.phone || "-"}
                </td>
                <td className="px-3 py-1.5 border border-gray-300 text-gray-600">
                  {item?.email || "-"}
                </td>
              </tr>
            </>
          )}
        </>
      )
    }

    return (
      <table className="border-collapse border border-gray-300 w-full text-sm">
        <thead className="whitespace-nowrap bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0 z-30 text-xs">
          <tr>
            <th className="border border-gray-300 w-5" />
            <th className="border border-gray-300 px-3 py-1 text-left">
              <div className="flex items-center gap-1.5">
                <User className="w-3 h-3" />
                <span>Name</span>
              </div>
            </th>
            <th className="border border-gray-300 px-3 py-1 text-left min-w-[130px]">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3 h-3" />
                <span>Mobile</span>
              </div>
            </th>
            <th className="border border-gray-300 px-3 py-1 text-left">
              <span>Last Remark</span>
            </th>
            <th className="border border-gray-300 px-3 py-1 text-left">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                <span>Followup Date</span>
              </div>
            </th>
            <th className="border border-gray-300 px-3 py-1 text-center">
              Event Log
            </th>
            <th className="border border-gray-300 px-3 py-1 text-center">
              Payment History
            </th>
            <th className="border border-gray-300 px-3 py-1 text-center">
              Collection Update
            </th>

            <th className="border border-gray-300 px-3 py-1 text-right">
              <div className="flex items-center gap-1.5 justify-end">
                <IndianRupee className="w-3 h-3" />
                <span>Net Amount</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.length > 0 ? (
            data.map((item, index) => (
              <LeadRow key={item._id ?? index} item={item} index={index} />
            ))
          ) : (
            <tr>
              <td colSpan={9} className="text-center text-gray-500 py-6">
                {loading ? (
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
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
  }
  return (
    <div className="max-h-full flex flex-col ">
      <div className="flex justify-between items-center p-3 md:p-5 mb-3 sticky top-0 z-30 bg-white">
        <h2 className="text-lg font-bold">
          {isdepartmentisAccountant
            ? verifiedLead
              ? "All Verified Payment Leads"
              : "Pending Verified Collections"
            : "Pending Collection Leads"}
        </h2>

        <div className="flex justify-end items-center">
          {isdepartmentisAccountant && (
            <>
              <span className="text-sm whitespace-nowrap font-semibold">
                {verifiedLead ? "All payment Verified" : "Pending Verified"}
              </span>
              <button
                onClick={() => {
                  setTableData([])
                  setverifiedLead(!verifiedLead)
                }}
                className={`${
                  verifiedLead ? "bg-green-500" : "bg-gray-300"
                } w-11 h-6 flex items-center rounded-full transition-colors duration-300 mx-2`}
              >
                <div
                  className={`${
                    verifiedLead ? "translate-x-5" : "translate-x-0"
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
            {loggedUserBranches?.map((branch) => (
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
                  No Data Available
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
      {collectionupdateModal &&
        selectedData &&
        partner &&
        partner.length > 0 && (
          <CollectionupdateModal
            data={selectedData}
            closemodal={setcollectionUpdateModal}
            partnerlist={partner}
            loggedUser={loggedUser}
            // refreshHook={refreshHook}
            handleCollectionUpdate={handleCollectionUpdate}
          />
        )}
      {paymenthistoryModal && (
        <PaymentHistoryModal
          data={paymentHistoryList}
          onClose={setpaymentHistoryModal}
          leadid={leadId}
          leadDocId={leadDocId}
          loggedUser={loggedUser}
          refresh={refreshHook}
          setdata={setTableData}
        />
      )}
    </div>
  )
}
