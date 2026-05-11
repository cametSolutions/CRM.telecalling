import { useEffect, useState } from "react"
import UseFetch from "../../hooks/useFetch"
import { useLocation, useNavigate } from "react-router-dom"
import { LeadhistoryModal } from "../../components/primaryUser/LeadhistoryModal"
import { PerformanceModal } from "../../components/primaryUser/PerformanceModal"
import SkeletonTable from "../../components/loader/SkeletonTable"
import NodataAvailable from "../../components/NodataAvailable"
import {
  Mail,
  MessageSquareText,
  Settings,
  User,
  Users,
  Send,
  TrendingUp,
  Menu,
  ChevronLeft,
  ChevronRight,
  Eye,
  IndianRupee,
  ChevronDown,
  BellRing
} from "lucide-react"

import AdminHeader from "../../header/AdminHeader"
import StaffHeader from "../../header/StaffHeader"
import { StaticSidebar } from "../../components/primaryUser/StaticSidebar"
import { getLocalStorageItem } from "../../helper/localstorage"

export default function OwnLeadList() {
  const [tableData, setTableData] = useState([])
const [targetData,settargetData]=useState([])
 const [periodMode, setperiodMode] = useState("all")
  const [productlist, setproductList] = useState([])
 const [selectedYear, setSelectedYear] = useState(null)
  const [selectedDatapopup, setselectedDataPopup] = useState({})
 const [selectedPeriod, setselectedPeriod] = useState("")
  const [openModal, setOpenModal] = useState(false)
  const [loggedUser, setLoggedUser] = useState(null)
  const [selectedLeadId, setselectedLeadId] = useState(null)
  const [ownLead, setownLead] = useState(false)
  const [companyBranches, setcompanyBranches] = useState(null)
  const [selectedCompanyBranch, setselectedCompanyBranch] = useState(null)
  const [showhistoryModal, sethistoryModal] = useState(false)
  const [historyList, setHistoryList] = useState([])
  const [openRow, setOpenRow] = useState(null)

  const location = useLocation()
  const navigate = useNavigate()

  const { data: companybranches } = UseFetch("/branch/getBranch")

  const { data: ownedlead, loading } = UseFetch(
    loggedUser &&
      selectedCompanyBranch &&
      `/lead/ownregisteredLead?userId=${loggedUser._id}&role=${
        location?.state?.role ? location?.state?.role : loggedUser.role
      }&selectedBranch=${selectedCompanyBranch}&ownlead=${
        location?.state?.role ? false : ownLead
      }`
  )

  useEffect(() => {
    if (companybranches && companybranches.length > 0) {
      const userData = getLocalStorageItem("user")
      const branch = userData?.selected?.map((b) => ({
        value: b.branch_id,
        label: b.branchName
      }))
      console.log(branch)
      setcompanyBranches(branch)
      setselectedCompanyBranch(branch[0].value)
      setLoggedUser(userData)
      setownLead(location?.state?.role ? false : true)
    }
  }, [companybranches])

  useEffect(() => {
    if (ownedlead && ownedlead.length > 0) {
      if (ownLead) {
        setTableData(normalizeTableData(ownedlead))
      } else {
        const groupedLeads = {}
        ownedlead.forEach((lead) => {
          const assignedTo = lead?.leadBy?.name || "Unknown"
          if (!groupedLeads[assignedTo]) groupedLeads[assignedTo] = []
          groupedLeads[assignedTo].push(lead)
        })
        setTableData(normalizeTableData(groupedLeads))
      }
    } else {
      setTableData([])
    }
  }, [ownedlead, ownLead])

  const normalizeTableData = (data) => {
    if (Array.isArray(data)) return [{ staffName: null, leads: data }]
    if (typeof data === "object")
      return Object.entries(data).map(([staffName, leads]) => ({
        staffName,
        leads
      }))
    return []
  }

  const handleHistory = (item) => {
    setHistoryList(item.activityLog)
    setselectedLeadId(item.leadId)
    sethistoryModal(true)
  }
const handleSelectedUser = (category, userId, userName) => {
    setselecteduserName(userName)
    setselectedCategory({
      Id: category.Id,
      categoryName: category.categoryName
    })
    const filteredloggedUserItem = data?.userWiseResults.filter(
      (item) => item.userId === userId
    )
    const filteredselectedCategory =
      filteredloggedUserItem[0].categories.filter(
        (item) => item.categoryId === category.Id
      )
    const summary = filteredselectedCategory.reduce(
      (acc, cur) => {
        acc.target += Number(cur.target || 0)
        acc.achieved += Number(cur.achieved || 0)
        acc.balance += Number(cur.balance || 0)
        return acc
      },
      { target: 0, achieved: 0, balance: 0 }
    )

    setselectedDataPopup(summary)
    if (filteredselectedCategory && filteredselectedCategory.length) {
      setacheivedProducts(
        filteredselectedCategory[0]?.products?.map((product) => ({
          productname: product.name,
          amount: product.achieved
        })) || []
      )
    } else {
      setacheivedProducts([])
    }
  }
  const LeadRow = ({ item }) => {
    const open = openRow === item._id
    const lastLog = item.activityLog?.[item.activityLog.length - 1]

    const followupDate = lastLog?.nextFollowUpDate
      ? new Date(lastLog.nextFollowUpDate)
          .toLocaleDateString("en-GB")
          .split("/")
          .join("-")
      : "-"

    return (
      <>
        {/* MAIN ROW */}
        <tr
          onClick={() =>
            setOpenRow((prev) => (prev === item._id ? null : item._id))
          }
          className="cursor-pointer bg-white hover:bg-blue-50 border border-gray-200"
        >
          <td className="pl-2 pr-1 py-2 w-5 border border-gray-200">
            {open ? (
              <ChevronDown className="w-3.5 h-3.5 text-blue-500" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            )}
          </td>

          <td className="px-3 py-2 border border-gray-200 whitespace-nowrap uppercase text-xs">
            {item.customerName?.customerName || item.customerName}
          </td>

          <td className="px-3 py-2 border border-gray-200 text-xs">
            {item?.mobile}
          </td>

          <td className="px-3 py-2 border border-gray-200 max-w-[200px] text-xs">
            <span
              className="text-red-500 font-medium truncate block"
              title={lastLog?.remarks}
            >
              {lastLog?.remarks || "-"}
            </span>
          </td>

          <td className="px-3 py-2 border border-gray-200 text-xs">
            {followupDate}
          </td>

          <td
            className="px-2 py-2 border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => handleHistory(item)}
              className="bg-indigo-600 text-white px-2 py-1 rounded flex justify-center w-full"
            >
              <BellRing className="w-3.5 h-3.5" />
            </button>
          </td>

          <td
            className="px-2 py-2 border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() =>
                loggedUser.role === "Admin"
                  ? navigate("/admin/transaction/lead/leadEdit", {
                      state: { leadId: item._id }
                    })
                  : navigate("/staff/transaction/lead/leadEdit", {
                      state: { leadId: item._id }
                    })
              }
              className="bg-blue-600 text-white px-2 py-1 rounded flex justify-center w-full"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </td>

          <td className="px-3 py-2 text-right border border-gray-200 whitespace-nowrap text-xs">
            <span className="inline-flex items-center gap-0.5">
              <IndianRupee className="w-3 h-3" />
              {item.netAmount?.toLocaleString("en-IN")}
            </span>
          </td>
        </tr>

        {/* SECONDARY ROWS */}
        {open && (
          <>
            <tr className="text-xs font-semibold bg-blue-50 border border-gray-200">
              <td className="border border-gray-200 px-3 py-1" />
              <td className="border border-gray-200 px-3 py-1">Lead By</td>
              <td className="border border-gray-200 px-3 py-1">Assigned To</td>
              <td className="border border-gray-200 px-3 py-1">Assigned By</td>
              <td className="border border-gray-200 px-3 py-1">Followups</td>
              <td className="border border-gray-200 px-3 py-1">Lead Date</td>
              <td className="border border-gray-200 px-3 py-1">Lead ID</td>
              <td className="border border-gray-200 px-3 py-1">Phone</td>
            </tr>

            <tr className="bg-slate-50 text-xs text-gray-600 border border-gray-200 whitespace-nowrap">
              <td className="border border-gray-200 px-3 py-1" />
              <td className="border border-gray-200 px-3 py-1">
                {item?.leadBy?.name || "-"}
              </td>
              <td className="border border-gray-200 px-3 py-1">
                {item?.taskallocatedTo?.name || "-"}
              </td>
              <td className="border border-gray-200 px-3 py-1">
                {item?.taskallocatedBy?.name || "-"}
              </td>
              <td className="border border-gray-200 px-3 py-1">
                {item.activityLog?.length || 0}
              </td>
              <td className="border border-gray-200 px-3 py-1">
                {item.leadDate?.toString().split("T")[0] || "-"}
              </td>
              <td className="border border-gray-200 px-3 py-1">
                {item?.leadId || "-"}
              </td>
              <td className="border border-gray-200 px-3 py-1">
                {item?.phone || "-"}
              </td>
            </tr>
          </>
        )}
      </>
    )
  }
  console.log("hhh")
  const renderTable = (data) => (
    <table className="border-collapse border border-gray-200 w-full text-sm">
      <thead className="bg-blue-600 text-white text-xs sticky top-0 z-10">
        <tr>
          <th className="border border-blue-500 w-5" />
          <th className="border border-blue-500 px-3 py-2 text-left">Name</th>
          <th className="border border-blue-500 px-3 py-2 text-left">Mobile</th>
          <th className="border border-blue-500 px-3 py-2 text-left">
            Last Remark
          </th>
          <th className="border border-blue-500 px-3 py-2 text-left">
            Followup
          </th>
          <th className="border border-blue-500 px-3 py-2 text-center">
            Event
          </th>
          <th className="border border-blue-500 px-3 py-2 text-center">View</th>
          <th className="border border-blue-500 px-3 py-2 text-right">
            Net Amount
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <LeadRow key={item._id} item={item} />
        ))}
      </tbody>
    </table>
  )

  const hasLeads =
    Array.isArray(tableData) &&
    tableData.some(
      (group) => Array.isArray(group.leads) && group.leads.length > 0
    )
  console.log(selectedCompanyBranch)
  return (
    <div className="h-full bg-[#ADD8E6]  overflow-hidden">
      <div className="flex h-full  lg:flex-row">
        {selectedCompanyBranch && (
          <StaticSidebar
            selectedCompanyBranch={selectedCompanyBranch}
            setselectedCompanyBranch={setselectedCompanyBranch}
parenttargetData={settargetData}
parentperiodmode={setperiodMode}
parentyear={setSelectedYear}
          />
        )}

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <header className="flex items-center justify-between border-b border-slate-200 bg-[#0F172A]/95 py-0.5 ">
            {loggedUser?.role?.toLowerCase() === "admin" ? (
              <AdminHeader />
            ) : (
              <StaffHeader hide={true} />
            )}

            <div className="flex items-center gap-1.5 text-slate-700 mr-3">
              <button className="rounded-full p-1.5 transition bg-slate-100">
                <Mail size={15} strokeWidth={2.2} />
              </button>
              <div className="relative">
                <button className="rounded-full p-1.5 transition bg-slate-100">
                  <MessageSquareText size={15} strokeWidth={2.2} />
                </button>
                <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-500" />
              </div>
              <button className="rounded-full p-1.5 transition bg-slate-100">
                <Settings size={15} strokeWidth={2.2} />
              </button>
              {/* <button className="rounded-full p-1.5 transition bg-slate-100">
                <User size={15} strokeWidth={2.2} />
              </button> */}

              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowUserMenu((prev) => !prev)
                  }}
                  className="rounded-full p-1.5 transition bg-slate-100"
                >
                  <User size={15} strokeWidth={2.2} />
                </button>

                {/* {showUserMenu && (
                  <div
                    onClick={(e) => e.stopPropagation()} 
                    className="absolute right-0 mt-2 w-32 bg-white border border-slate-200 rounded-md shadow-lg z-50"
                  >
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      Logout
                    </button>
                  </div>
                )} */}
              </div>
            </div>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <h2 className="text-base font-bold">
              {ownLead ? "Own Lead" : "All Lead"}
            </h2>
            <div className="flex items-center gap-2">
              {loggedUser?.role !== "Staff" && (
                <>
                  <span className="text-xs font-semibold whitespace-nowrap">
                    {ownLead ? "Own Lead" : "All Lead"}
                  </span>
                  <button
                    onClick={() => {
                      setTableData([])
                      setownLead((prev) => !prev)
                    }}
                    className={`${
                      ownLead ? "bg-green-500" : "bg-gray-300"
                    } w-10 h-5 flex items-center rounded-full transition-colors duration-300`}
                  >
                    <div
                      className={`${
                        ownLead ? "translate-x-5" : "translate-x-0"
                      } w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300`}
                    />
                  </button>
                </>
              )}

              <button
                onClick={() =>
                  loggedUser?.role === "Admin"
                    ? navigate("/admin/transaction/lead")
                    : navigate("/staff/transaction/lead")
                }
                className="bg-black text-white text-xs py-1 px-3 rounded shadow hover:bg-gray-700 whitespace-nowrap"
              >
                New Lead
              </button>
            </div>
            {/* ── Table container ── */}
            <div className="flex-1 mx-2 md:mx-3 mb-2 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col">
              {loading ? (
                <div className="p-4">
                  <SkeletonTable rows={5} columns={8} />
                </div>
              ) : !hasLeads ? (
                <div className="p-4">
                  <NodataAvailable
                    title="No Lead Available"
                    message="There are no leads to display for the selected filters."
                  />
                </div>
              ) : (
                /* overflow-auto here makes the table scroll; sticky thead works inside */
                <div className="overflow-auto flex-1">
                  {tableData.map(({ staffName, leads }, index) => (
                    <div key={staffName || `group-${index}`}>
                      {staffName && (
                        <h3 className="text-sm font-semibold text-gray-800 px-3 pt-3 pb-1">
                          {staffName}{" "}
                          <span className="text-xs text-gray-500 font-normal">
                            ({leads?.length || 0} Leads)
                          </span>
                        </h3>
                      )}
                      {Array.isArray(leads) && leads.length > 0 ? (
                        renderTable(leads)
                      ) : (
                        <p className="text-center text-gray-400 py-3 text-xs">
                          No leads under {staffName || "this group"}.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {showhistoryModal && historyList.length > 0 && (
          <LeadhistoryModal
            selectedLeadId={selectedLeadId}
            historyList={historyList}
            handlecloseModal={() => sethistoryModal(false)}
          />
        )}
        <PerformanceModal
          modalOpen={openModal}
          splitType={targetData?.selectedMeasurementType}
          selectedperiod={selectedPeriod}
          allperiods={targetData?.periods}
          onselectedPeriodChange={(val, val2) => {
            setSelectedMonth(val2)
            setselectedPeriod(val)
          }}
          onMonthChange={(val) => {
            setcategorylist([])
            setacheivedProducts([])
            setselectedDataPopup([])
            setperiodMode(val)
          }}
          onYearChange={(val) => {
            setcategorylist([])
            setacheivedProducts([])
            setselectedDataPopup([])
            setSelectedYear(val)
          }}
          productlist={productlist}
          onClose={() => {
            setselecteduserName(user?.name)
            setacheivedProducts([])
            setOpenModal(false)
          }}
          selectedMonth={periodMode}
          selectedYear={selectedYear}
          summary={{
            target: selectedDatapopup?.target,
            achieved: selectedDatapopup?.achieved,
            balance:
              selectedDatapopup?.achieved > selectedDatapopup?.target
                ? 0
                : selectedDatapopup?.balance
          }}
          products={achievedproducts}
          targetData={targetData}
          loggedUser={user}
          selectedUser={selectedUserName}
          category={selectedCategory}
          handleSelectedUser={handleSelectedUser}
        />
      </div>
    </div>
  )
}
