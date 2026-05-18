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
  Settings,
  MessageSquareText,
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
import AdminHeader from "../../../header/AdminHeader"
import StaffHeader from "../../../header/StaffHeader"
import { StaticSidebar } from "../../../components/primaryUser/StaticSidebar"
import { PerformanceModal } from "../../../components/primaryUser/PerformanceModal"
import SkeletonTable from "../../../components/loader/SkeletonTable"
import { PropagateLoader } from "react-spinners"
import { toast } from "react-toastify"

export default function CollectionUpdate() {
  console.log("hh")
  const [showFullName, setShowFullName] = useState(false)
  const [tableData, setTableData] = useState([])
  console.log(tableData)
  const [forcefullyclosedLeads, setforcefullyClosedLeads] = useState([])
  const [isforcefullyclosed, setisforcefullyclosed] = useState(false)
  console.log(tableData)
  const [isdepartmentisAccountant, setisdepartmentAccountant] = useState(false)
  console.log(isdepartmentisAccountant)
  const [loggedUser, setLoggedUser] = useState(null)
  const [leadId, setleadId] = useState(null)
  const [leadDocId, setleadDocId] = useState(null)
  const [partner, setPartner] = useState([])
  const [showFullEmail, setShowFullEmail] = useState(false)
  const [paymenthistoryModal, setpaymentHistoryModal] = useState(false)
  const [collectionupdateModal, setcollectionUpdateModal] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedData, setselectedData] = useState(null)
  console.log(selectedData)
  const [selectedLeadId, setselectedLeadId] = useState(null)
  console.log(selectedLeadId)
  const [verifiedLead, setverifiedLead] = useState(false)
  const [companyBranches, setcompanyBranches] = useState(null)
  const [balanceAmount, setBalanceAmount] = useState(null)
  const [isChecked, setIsChecked] = useState(false)
  const [selectedCompanyBranch, setselectedCompanyBranch] = useState(null)
  const [showhistoryModal, sethistoryModal] = useState(false)
  const [paymentHistoryList, setpaymentHistoryList] = useState([])
  const [historyList, setHistoryList] = useState([])
  const [loggedUserBranches, setloggedUserBranches] = useState([])
  const [selectedUserName, setselecteduserName] = useState(null)
  const [selectedCategory, setselectedCategory] = useState(null)
  const [selectedDatapopup, setselectedDataPopup] = useState({})
  const [selectedYear, setSelectedYear] = useState(null)
  const [periodMode, setperiodMode] = useState("all")
  const [targetData, settargetData] = useState([])
  console.log(targetData)
  const [openModal, setOpenModal] = useState(false)
  const [productlist, setproductList] = useState([])
  const [achievedproducts, setacheivedProducts] = useState([])
  const [selectedPeriod, setselectedPeriod] = useState("")
  const navigate = useNavigate()
  const { data: companybranches } = UseFetch("/branch/getBranch")
  // const {data}=UseFetch("/lead/fix-leadverified")
  const {
    data: collectionlead,
    loading,
    refreshHook
  } = UseFetch(
    selectedCompanyBranch &&
      loggedUser &&
      `/lead/collectionLeads?selectedBranch=${selectedCompanyBranch}&verified=${verifiedLead}&isAccountant=${isdepartmentisAccountant}&loggeduserby=${loggedUser._id}`
  )
  const { data: branchProduct } = UseFetch(
    `/product/getallbranchProduct?branch=${selectedCompanyBranch}`
  )
  console.log(selectedCompanyBranch)
  console.log(verifiedLead)
  console.log(isdepartmentisAccountant)
  console.log(loggedUser)
  console.log(isdepartmentisAccountant)
  console.log(verifiedLead)
  console.log(collectionlead)
  const { data: partners } = UseFetch("/customer/getallpartners")
  console.log("h")
  console.log(paymenthistoryModal)
  useEffect(() => {
    if (companybranches && companybranches.length > 0) {
      const userData = getLocalStorageItem("user")
      console.log(userData.department?.department)
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
    if (paymenthistoryModal && collectionlead && selectedLeadId) {
      console.log("hh")
      const updatedhistorylist = collectionlead.filter(
        (item) => item.leadId === selectedLeadId
      )
      console.log(updatedhistorylist)
      setpaymentHistoryList(updatedhistorylist[0]?.paymentHistory)
      setBalanceAmount(updatedhistorylist[0].balanceAmount)
    }
  })
  console.log(paymentHistoryList)
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
      console.log(loggedUser?.department)
      if (
        loggedUser?.department?._id === "670c863652847bbebbd35743" ||
        loggedUser?.department?.department === "Accounts"
      ) {
        const filteredforcefullyleads = collectionlead.filter(
          (item) => item.forcefullyClosedTarget
        )
        if (filteredforcefullyleads.length) {
          setforcefullyClosedLeads(normalizeTableData(filteredforcefullyleads))
          console.log("Hhh")
        }
        const filteredCollectionleads = collectionlead.filter(
          (item) =>
            item.paymentHistory?.length > 0 && !item.forcefullyClosedTarget
        )
        console.log(collectionlead)
        const sortedLeads = filteredCollectionleads.sort((a, b) => {
          const getOldest = (lead) =>
            lead.paymentHistory?.length
              ? Math.min(
                  ...lead.paymentHistory.map((p) => new Date(p.paymentDate))
                )
              : Date.now()

          return getOldest(a) - getOldest(b)
        })
        console.log(sortedLeads)
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

  const checkIsForcefullyClosed = (dateString, balance, isverified) => {
    console.log(balance)
    console.log(isverified)
    const checkelibleforForcefullyclosed = Number(balance) > 0 && !isverified
    console.log(checkelibleforForcefullyclosed)
    console.log(dateString)
    console.log(dateString)
    const d = new Date(dateString) // e.g. "2026-04-17T09:32:29.127Z"
    if (isNaN(d)) return // invalid date guard

    const now = new Date()

    const sameMonth =
      d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() // month is 0-based

    console.log(sameMonth)
    console.log(d.getMonth())
    console.log(now.getMonth())
    console.log(d.toLocaleDateString())
    const monthName = d.toLocaleString("default", { month: "long" })
    console.log(monthName)
    // If same month as current → not previous target
    if (sameMonth) {
      console.log("hhh")
      // setIsChecked(false)
      setIsChecked({ month: monthName, checked: true })
    } else {
      console.log("hhh")
      setIsChecked({ month: monthName, checked: true })
    }
  }
  const handleCollection = (item) => {
    console.log(item)
    console.log("hh")
    setcollectionUpdateModal(true)
    setselectedData(item)
  }
  const handlecloseModal = () => {
    setHistoryList([])
    sethistoryModal(false)
    setselectedLeadId(null)
  }
  const handleHistory = (Item) => {
    console.log("hh")
    setselectedData(Item.activityLog)
    setHistoryList(Item.activityLog)
    setselectedLeadId(Item.leadId)
    sethistoryModal(true)
  }

  const getDisplayAmount = (item) => {
    console.log(item)

    console.log("h")
    return (item || [])
      .filter((history) => history?.paymentVerified === false)
      .reduce((sum, history) => sum + Number(history?.receivedAmount || 0), 0)
  }
  const handleCollectionUpdate = async (formData, setsubmitLoader) => {
    setsubmitLoader(true)
    console.log(formData)

    try {
      const response = await api.post("/lead/collectionUPdate", formData)
      if (response.status === 200) {
        setsubmitLoader(false)
        toast.success("payment updated successfully")
        refreshHook()
        return response
      }
    } catch (error) {
      toast.error("something went wrong")
      console.log("error", error.message)
    }
  }
  const handleMoreClick = (id, name) => {
    const Datas = targetData?.userWiseResults
    console.log(id)
    console.log(name)
    console.log("hh")
    const filteredList = branchProduct
      .filter(
        (item) =>
          item.selected?.some(
            (selectedItem) => String(selectedItem.category_id) === String(id)
          ) || String(item.category_id) === String(id)
      )
      .map((item) => item.productName || item.serviceName)
    console.log(filteredList)
    setproductList(filteredList)
    setselectedCategory({ Id: id, categoryName: name })
    console.log("J")
    console.log(targetData)
    console.log(loggedUser?._id)
    const filteredloggedUserItem = Datas.filter(
      (item) => item.userId === loggedUser._id
    )
    console.log("hhh")

    console.log(Datas)
    console.log("hhhh")
    console.log(filteredloggedUserItem)
    console.log(id)
    // const filteredselectedCategory =
    //   filteredloggedUserItem[0].categories.filter(
    //     (item) => item.categoryId === id
    //   )
    const filteredselectedCategory = Datas.flatMap(
      (user) => user.categories || []
    ).filter((item) => item.categoryId === id)
    console.log("Hh")
    const summary = filteredselectedCategory.reduce(
      (acc, cur) => {
        acc.target += Number(cur.target || 0)
        acc.achieved += Number(cur.achieved || 0)
        acc.balance += Number(cur.balance || 0)
        return acc
      },
      { target: 0, achieved: 0, balance: 0 }
    )
    console.log("hhh")
    setselectedDataPopup(summary)
    console.log(filteredselectedCategory && filteredselectedCategory.length)
    if (filteredselectedCategory && filteredselectedCategory.length) {
      setacheivedProducts((prev) => [
        ...prev,
        ...filteredselectedCategory.flatMap((item) =>
          (item?.products || []).map((product) => ({
            productname: product.name,
            amount: product.achieved
          }))
        )
      ])
    } else {
      setacheivedProducts([])
    }
    setOpenModal(true)
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
  console.log(forcefullyclosedLeads)
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
            {/* <td className="px-3 py-2 font-semibold text-gray-900 text-sm border border-gray-300 whitespace-nowrap uppercase truncate">
              {item?.customerName?.customerName}
            </td> */}
<td className="px-3 py-2 border border-gray-300">
  <div className="font-semibold text-gray-900 text-sm uppercase max-w-[200px] truncate">
    {item?.customerName?.customerName}
  </div>
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
            <td className="px-3 py-2 text-sm text-gray-700 border border-gray-300 whitespace-nowrap text-center">
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
                onClick={() => {
                  setpaymentHistoryList(item.paymentHistory)
                  setselectedLeadId(item.leadId)
                  checkIsForcefullyClosed(
                    item.leadDate,
                    item.balanceAmount,
                    item.paymentVerified
                  )
                  setBalanceAmount(item.balanceAmount)
                  setpaymentHistoryModal(true)
                  setleadId(item.leadId)
                  setleadDocId(item._id)
                }}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors w-full justify-center"
              >
                <CreditCard className="w-3.5 h-3.5" />
              </button>
            </td>
            {!verifiedLead && (
              <td
                className="px-2 py-2 border border-gray-300"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => handleCollection(item)}
                  className="inline-flex items-center gap-1  py-1 text-xs font-semibold text-white bg-green-500 rounded hover:bg-green-600 transition-colors w-full justify-center"
                >
                  <ClipboardCheck className="w-3.5 h-3.5" />
                </button>
              </td>
            )}

            <td className="px-3 py-2 text-sm font-semibold text-green-700 border border-gray-300 whitespace-nowrap text-right">
              <span className="inline-flex items-center gap-0.5 justify-end">
                <IndianRupee className="w-3.5 h-3.5" />
                {!verifiedLead
                  ? getDisplayAmount(item.paymentHistory)
                  : item?.netAmount?.toLocaleString("en-IN")}
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
                <td className="px-3 py-1 border border-gray-300 bg-gray-100 text-gray-600">
                  <span>Lead ID</span>
                </td>
                <td className="px-3 py-1 border border-gray-300 bg-gray-100 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>Phone</span>
                  </div>
                </td>
                <td className="px-3 py-1 border border-gray-300 bg-gray-100 text-gray-600">
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
                <td className="px-3 py-1.5 border border-gray-300  text-gray-700">
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
            {!verifiedLead && (
              <th className="border border-gray-300 px-3 py-1 text-center">
                Collection Update
              </th>
            )}

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
    <div className="h-full  bg-[#ADD8E6]">
      <div className="flex h-full flex-row">
        <StaticSidebar
          handleMoreClick={handleMoreClick}
          selectedCompanyBranch={selectedCompanyBranch}
          setselectedCompanyBranch={setselectedCompanyBranch}
          parenttargetData={settargetData}
          parentperiodmode={setperiodMode}
          parentyear={setSelectedYear}
          setselectedPeriod={setselectedPeriod}
        />
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex items-center justify-between border-b border-white/10 bg-[#0F172A]/95">
            {loggedUser?.role?.toLowerCase() === "admin" ? (
              <AdminHeader hide={true}/>
            ) : (
              <StaffHeader hide={true} />
            )}

            <div className="flex items-center gap-1.5  border-b border-white/10 bg-[#0F172A]/95 pr-3 h-full">
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
          <div className="flex justify-between items-center p-3 md:p-5 md:pb-2 sticky top-0 z-30">
            <h2 className="text-lg font-bold">
              {isdepartmentisAccountant
                ? verifiedLead
                  ? "All Verified Payment Leads"
                  : forcefullyclosedLeads.length > 0 && isforcefullyclosed
                    ? "Forcefully Closed amount Leads"
                    : "Pending Verified Collections"
                : "Pending Collection Leads"}
            </h2>

            <div className="flex justify-end items-center">
              {isdepartmentisAccountant && (
                <>
                  {!verifiedLead && (
                    <div className="mr-3 flex">
                      <span className="text-sm whitespace-nowrap font-semibold">
                        Forcefully closed Leads
                      </span>
                      <div className="">
                        <button
                          onClick={() => {
                            // setTableData([])
                            setisforcefullyclosed(!isforcefullyclosed)
                            // setverifiedLead(!verifiedLead)
                          }}
                          className={`${
                            isforcefullyclosed ? "bg-green-500" : "bg-gray-300"
                          } w-11 h-6 flex items-center rounded-full transition-colors duration-300 mx-2`}
                        >
                          <div
                            className={`${
                              isforcefullyclosed
                                ? "translate-x-5"
                                : "translate-x-0"
                            } w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300`}
                          ></div>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex">
                    <span className="text-sm whitespace-nowrap font-semibold">
                      {verifiedLead ? "Payment Verified" : "Pending Verified"}
                    </span>
                    <div className="">
                      {" "}
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
                    </div>
                  </div>
                </>
              )}
              <select
                value={selectedCompanyBranch || ""}
                onChange={(e) => {
                  setTableData([])
                  setselectedCompanyBranch(e.target.value)
                }}
                className="border border-gray-300 py-1 rounded-md px-2 focus:outline-none min-w-[150px] mx-2 cursor-pointer "
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
          <div className="h-auto overflow-x-auto rounded-lg overflow-y-auto shadow-xl mx-2 md:mx-3 mb-3 bg-white">
            <>
              {(() => {
                const currentData = isforcefullyclosed
                  ? forcefullyclosedLeads
                  : tableData
                console.log(currentData)
                const hasLeads =
                  Array.isArray(currentData) &&
                  currentData.some(
                    (group) =>
                      Array.isArray(group.leads) && group.leads.length > 0
                  )
                console.log(hasLeads)
                if (!hasLeads || currentData.length === 0) {
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

                return currentData.map(({ staffName, leads }, index) => (
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
        </div>
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
          isChecked={isChecked}
          isforcefullyclosed={isforcefullyclosed}
          balanceAmount={balanceAmount}
          onClose={setpaymentHistoryModal}
          leadid={leadId}
          setselectedLeadId={setselectedLeadId}
          leadDocId={leadDocId}
          loggedUser={loggedUser}
          refresh={refreshHook}
          setdata={setTableData}
          verifiedLead={verifiedLead}
          isdepartmentisAccountant={isdepartmentisAccountant}
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
          setselecteduserName(loggedUser?.name)
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
        targetData={targetData?.userWiseResults}
        loggedUser={loggedUser}
        selectedUser={selectedUserName}
        category={selectedCategory}
        handleSelectedUser={handleSelectedUser}
      />
    </div>
  )
}
