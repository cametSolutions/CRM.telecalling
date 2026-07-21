import React, { useEffect, useState } from "react"
import UseFetch from "../../../hooks/useFetch"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { PaymentHistoryModal } from "../../../components/primaryUser/PaymentHistoryModal"
import { LeadhistoryModal } from "../../../components/primaryUser/LeadhistoryModal"
import { CollectionupdateModal } from "../../../components/primaryUser/CollectionupdateModal"
import api from "../../../api/api"
import SkeletonTable from "../../../components/loader/SkeletonTable"
import DatePeriod from "../../../components/common/DatePeriod"
import DateRangePicker from "../../../components/common/Daterangepicker"

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
import { PropagateLoader } from "react-spinners"
import { toast } from "react-toastify"

export default function VerifiedCollections() {
const reduxselectedBranch=useSelector((branch)=>branch.companyBranch.selectedBranch)
console.log(reduxselectedBranch)
  console.log("hh")
  const [showFullName, setShowFullName] = useState(false)
const location=useLocation()
console.log(location.state)
  const [startDate, setStartDate] = useState(location?.state?.startDate)
  const [endDate, setEndDate] = useState(location?.state?.endDate)
  const [tableData, setTableData] = useState([])
  console.log(tableData)
  console.log(tableData)
  const [forcefullyclosedLeads, setforcefullyClosedLeads] = useState([])
  const [isforcefullyclosed, setisforcefullyclosed] = useState(false)
  console.log(tableData)
  const [isdepartmentisAccountant, setisdepartmentAccountant] = useState(false)
  console.log(isdepartmentisAccountant)
  const [loggedUser, setLoggedUser] = useState(null)
  const [leadId, setleadId] = useState(null)
  const [leadDocId, setleadDocId] = useState(null)
  const [activeUserId, setActiveUserId] = useState(null)
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
  const now = new Date()
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()))
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
    reduxselectedBranch &&
      loggedUser &&
      `/lead/collectionLeads?selectedBranch=${reduxselectedBranch}&verified=${verifiedLead}&isAccountant=${isdepartmentisAccountant}&loggeduserby=${loggedUser._id}`
  )
console.log(collectionlead)
const {
    data: verifiedcollectionlead,
    loading:leadloading,
    refreshHook:leadHook
  } = UseFetch(
    reduxselectedBranch &&
      loggedUser &&
      `/lead/verifiedcollectionLeads?selectedBranch=${reduxselectedBranch}&verified=${true}&startDate=${startDate}&endDate=${endDate}`
  )
console.log(startDate)
console.log(endDate)
console.log(verifiedcollectionlead)
  const { data: branchProduct } = UseFetch(
    `/product/getallbranchProduct?branch=${reduxselectedBranch}`
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
    if (selectedCategory) {
      console.log("jj")
      const Datas = targetData?.userWiseResults

      const filteredList = branchProduct
        .filter(
          (item) =>
            item.selected?.some(
              (selectedItem) =>
                String(selectedItem.category_id) ===
                String(selectedCategory?.Id)
            ) || String(item.category_id) === String(selectedCategory?.Id)
        )
        .map((item) => item.productName || item.serviceName)
      console.log(filteredList)
      setproductList(filteredList)
      console.log("J")
      console.log(targetData)

      console.log("hhh")

      console.log(Datas)
      console.log("hhhh")

      const filteredselectedCategory = Datas.flatMap(
        (user) => user.categories || []
      ).filter((item) => item.categoryId === selectedCategory?.Id)
      console.log(filteredselectedCategory)
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
        console.log("hh")
        console.log(filteredselectedCategory)
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
    }
  }, [targetData])
  useEffect(() => {
    if (paymenthistoryModal && verifiedcollectionlead && selectedLeadId) {
      console.log("hh")
      const updatedhistorylist = verifiedcollectionlead.filter(
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
  console.log("Hh")
  useEffect(() => {
    if (
      verifiedcollectionlead &&
      verifiedcollectionlead.length > 0 &&
      partners &&
      partners.length > 0 &&
      loggedUser
    ) {
      console.log(loggedUser?.department)
     
        setTableData(normalizeTableData(verifiedcollectionlead))
      

      setPartner(partners)
    }
  }, [verifiedcollectionlead, partners, loggedUser])
console.log(tableData)
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
      .filter((history) => history?.paymentVerified === true)
      .reduce((sum, history) => sum + Number(history?.receivedAmount || 0), 0)
  }
  const handleCollectionUpdate = async (
    formData,
    setsubmitLoader,
    submitLoader
  ) => {
    console.log("H")
    if (submitLoader) return
    console.log("Hh")
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
    setActiveUserId(userId)
    setselecteduserName(userName)
    setselectedCategory({
      Id: category.Id,
      categoryName: category.categoryName
    })
    const filteredloggedUserItem = targetData?.userWiseResults.filter(
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
      eivedProducts(
        filteredselectedCategory.flatMap((item) =>
          (item.products || []).map((product) => ({
            productname: product.name,
            amount: product.achieved
          }))
        )
      )
    } else {
      setacheivedProducts([])
    }
  }
  console.log(forcefullyclosedLeads)
  const renderTable = (data) => {
    const LeadRow = ({ item, index }) => {
      console.log(item)
      const [open, setOpen] = useState(false)

      const lastLog = item.activityLog[item.activityLog.length - 1]
      const followupDate = lastLog?.nextFollowUpDate
        ? new Date(lastLog.nextFollowUpDate)
            .toLocaleDateString("en-GB")
            .split("/")
            .join("-")
        : "-"
      const customerName = item?.customerName?.customerName.toUpperCase()
      const shouldShowTooltipCustomer = customerName.length > 20
      const shouldShowTooltipEmail = item?.email.length > 5
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

            <td className="px-3 py-2 font-semibold text-gray-900 text-sm border border-gray-300 whitespace-nowrap">
              <div className="relative group w-[180px]">
                <span
                  tabIndex={0}
                  className="block truncate cursor-pointer"
                  aria-label={customerName}
                >
                  {customerName}
                </span>

                {shouldShowTooltipCustomer && (
                  <div className="pointer-events-none absolute left-0 top-full z-50 mt-2 w-max max-w-xs rounded-xl bg-gray-900 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-xl ring-1 ring-white/10 transition-all duration-200 translate-y-1 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    {customerName}
                    <div className="absolute -top-1 left-4 h-2 w-2 rotate-45 bg-gray-900"></div>
                  </div>
                )}
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
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </div>
                </td>
                <td className="px-3 py-1 border border-gray-300 bg-gray-100 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>ProductName</span>
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
                <td className="px-3 py-2  text-gray-700 text-sm border border-gray-300 whitespace-nowrap">
                  <div className="relative group w-[100px]">
                    <span
                      tabIndex={0}
                      className="block truncate cursor-pointer"
                      aria-label={item?.email}
                    >
                      {item?.email}
                    </span>

                    {shouldShowTooltipEmail && (
                      <div className="pointer-events-none absolute left-0 top-full z-50 mt-2 w-max max-w-xs rounded-xl bg-gray-900 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-xl ring-1 ring-white/10 transition-all duration-200 translate-y-1 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
                        {item?.email}
                        <div className="absolute -top-1 left-4 h-2 w-2 rotate-45 bg-gray-900"></div>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-3 py-1.5 border border-gray-300 text-blue-500 font-medium">
                  {item?.leadFor[0]?.prodproductorServiceId?.shortName ||
                    item?.leadFor[0]?.productorServiceId?.productName ||
                    "-"}
                </td>
              </tr>
            </>
          )}
        </>
      )
    }

    return (
      <table className="border-collapse border border-gray-300 w-full text-sm">
        <thead className="whitespace-nowrap bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0 z-10 text-xs">
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

            <th className="border border-gray-300 px-3 py-1 text-right">
              <div className="flex items-center gap-1.5 justify-end">
                <IndianRupee className="w-3 h-3" />
                <span>Collection Amount</span>
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
        {/* <StaticSidebar
          handleMoreClick={handleMoreClick}
          selectedCompanyBranch={selectedCompanyBranch}
          setselectedCompanyBranch={setselectedCompanyBranch}
          parenttargetData={settargetData}
          parentperiodmode={periodMode}
          parentyear={selectedYear}
          setselectedPeriod={setselectedPeriod}
        /> */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* <header className="flex items-center justify-between bg-[#ADD8E6]">
            {loggedUser?.role?.toLowerCase() === "admin" ? (
              <AdminHeader hide={true} />
            ) : (
              <StaffHeader hide={true} />
            )}

            <div className="flex items-center gap-1.5  pr-3 h-full">
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

                {showUserMenu && (
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
                )}
              </div>
            </div>
          </header> */}

          <div className="flex justify-start items-center p-3 md:p-5 md:pb-2 sticky top-0 z-30 gap-3">
            <h2 className="text-lg font-bold">Verified Collections</h2>
<DateRangePicker
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
              />
              
           
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
                    {loading ? <SkeletonTable /> : renderTable(leads)}
                    {/* {leads.length > 0 ? (
                      renderTable(leads)
                    ) : (
                      <div className="text-center text-gray-400 py-3 text-sm">
                        No Lead under {staffName || "this group"}.
                      </div>
                    )} */}
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
showAction={false}
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
          setacheivedProducts([])
          setselectedDataPopup([])
          setperiodMode(val)
          setselecteduserName(null)
        }}
        onYearChange={(val) => {
          setacheivedProducts([])
          setselectedDataPopup([])
          setSelectedYear(val)
          setselecteduserName(null)
        }}
        productlist={productlist}
        onClose={() => {
          setselecteduserName(null)
          setacheivedProducts([])
          setOpenModal(false)
          setActiveUserId(null)
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
        activeUserId={activeUserId}
      />
    </div>
  )
}
