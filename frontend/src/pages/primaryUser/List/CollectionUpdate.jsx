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
  CreditCard, // Payment History
  ClipboardCheck // Collection Update
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

  const renderTable = (data) => (
    <table className="border-collapse border border-gray-300 w-full text-sm">
      <thead className="whitespace-nowrap bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0 z-20 text-xs">
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

          <th className="border border-gray-300 px-3 py-1 min-w-40">Action</th>
          <th className="border border-gray-300 px-3 py-1">Net Amount</th>
          <th className="border border-gray-300 px-3 py-1 ">Bal.Amount</th>
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

                <td className="border border-b-0 border-gray-300 px-2 py-1 text-center w-20">
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
                {/* <td className="border border-b-0 border-gray-300 px-3 py-1"></td> */}
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

                <td className="border border-t-0 border-b-0 border-gray-300 px-2 py-1 bg-white w-20">
                  <button
                    onClick={() => {
                      setpaymentHistoryList(item.paymentHistory)
                      setpaymentHistoryModal(true)
                      setleadId(item.leadId)
                      setleadDocId(item._id)
                    }}
                    className="inline-flex items-center gap-1  py-1 text-xs font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors w-full justify-center"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    Payment History
                  </button>
                </td>
                <td className="border border-t-0 border-b-0 border-gray-300 px-3  bg-white font-semibold max-w-28">
                  <div className="flex items-center justify-start">
                    <IndianRupee className="w-4 h-3.5 text-green-600 mr-1" />
                    <span className="text-lg font-semibold">
                      {" "}
                      {item?.netAmount}
                    </span>
                  </div>
                </td>
                <td className="border border-t-0 border-b-0 border-gray-300 px-3  bg-white font-semibold max-w-28">
                  <div className="flex items-center justify-start">
                    <IndianRupee className="w-4 h-3.5 text-red-600 mr-1" />
                    <span className="text-lg font-semibold">
                      {" "}
                      {item?.balanceAmount}
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

                <td className="border border-t-0 border-b-0 border-gray-300 px-2 py-1 w-20">
                  {!verifiedLead && (
                    <button
                      onClick={() => handleCollection(item)}
                      className="inline-flex items-center gap-1  py-1 text-xs font-semibold text-white bg-green-500 rounded hover:bg-green-600 transition-colors w-full justify-center"
                    >
                      <ClipboardCheck className="w-3.5 h-3.5" />
                      Collection Update
                    </button>
                  )}
                </td>
                <td className="border border-t-0 border-b-0 border-gray-300 px-3 py-1"></td>
                <td className="border border-t-0 border-b-0 border-gray-300 px-3 py-1"></td>
              </tr>

              <tr className="font-medium bg-gradient-to-r from-gray-100 to-gray-50 text-xs text-gray-600">
                <td colSpan={5} className="px-3 py-1 border-t border-gray-200">
                  <span>Last Payment Remark :</span>
                  <span className="ml-2 text-red-600">
                    {item?.paymentHistory[item?.paymentHistory?.length - 1]
                      ?.remarks || "-"}
                  </span>
                </td>

                <td className="border border-t-0 border-b-0 border-gray-300 px-3 bg-white"></td>
                <td className="border border-t-0 border-b-0 border-gray-300 px-2 py-1 bg-white"></td>
                <td className="border border-t-0 border-b-0 border-gray-300 px-3 bg-white"></td>
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
