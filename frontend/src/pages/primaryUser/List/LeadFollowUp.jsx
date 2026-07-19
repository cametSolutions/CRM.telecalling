import { useState, useEffect, useRef } from "react"
import { Pencil } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import Breadcrumb from "../../../components/common/Breadcrumb"
import { formatDate } from "../../../utils/dateUtils"
import MyDatePicker from "../../../components/common/MyDatePicker"
import { FaSpinner } from "react-icons/fa"
import { useQuery } from "@tanstack/react-query"
import { LeadhistoryModal } from "../../../components/primaryUser/LeadhistoryModal"
import { CollectionupdateModal } from "../../../components/primaryUser/CollectionupdateModal"
import { BsFilterLeft } from "react-icons/bs"
import {
  Eye,
  Phone,
  Mail,
  Package,
  Settings,
  MessageSquareText,
  User,
  Calendar,
  Clock,
  UserPlus,
  UserCheck,
  IndianRupee,
  BellRing,
  History,
  ChevronDown,
  ChevronRight,
  X
} from "lucide-react"
import BarLoader from "react-spinners/BarLoader"
import AdminHeader from "../../../header/AdminHeader"
import StaffHeader from "../../../header/StaffHeader"
import { getLocalStorageItem } from "../../../helper/localstorage"
import { PerformanceModal } from "../../../components/primaryUser/PerformanceModal"
import api from "../../../api/api"
import SkeletonTable from "../../../components/loader/SkeletonTable"
import { StaticSidebar } from "../../../components/primaryUser/StaticSidebar"
import { toast } from "react-toastify"
import UseFetch from "../../../hooks/useFetch"
import React from "react"

const LeadFollowUp = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const safeState = location?.state || {}
  console.log(location?.state)
  const nav = [
    { label: "Lead", path: "" },
    { label: "Lead follow-up", path: "" }
  ]
  const Breadcrumblist = location?.state?.breadcrumb
    ? location?.state?.breadcrumb
    : nav

  console.log(Breadcrumblist)
  const checkedownfollowup = safeState?.ownfollowp //its from
  console.log(checkedownfollowup)
  console.log(safeState)

  const [selectedLeadId, setSelectedLeadId] = useState(null)
  const [demoerror, setDemoError] = useState({
    selectStaff: "",
    allocationDate: "",
    demoDescription: ""
  })
  const today = new Date().toISOString().split("T")[0]
  const [selectedUserName, setselecteduserName] = useState(null)
  const [selectedCategory, setselectedCategory] = useState(null)
  const [selectedDatapopup, setselectedDataPopup] = useState({})
  const now = new Date()
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()))
  console.log(selectedYear)
  const [periodMode, setperiodMode] = useState("all")
  const [targetData, settargetData] = useState([])
  console.log(targetData)
  const [openModal, setOpenModal] = useState(false)
  const [productlist, setproductList] = useState([])
  const [achievedproducts, setacheivedProducts] = useState([])
  const [selectedPeriod, setselectedPeriod] = useState("")

  const [expandedRows, setExpandedRows] = useState(new Set())
  const [selectedData, setselectedData] = useState(null)

  const [collectionData, setcollectionData] = useState({})
  console.log(collectionData)
  const [collectionupdateModal, setcollectionUpdateModal] = useState(false)
  const [partner, setPartner] = useState([])
  const [isdemofollownotClosed, setisdemofollowedNotClosed] = useState(false)
  console.log(isdemofollownotClosed)
  const [ischangeallocationfortask, setischangeallocationfortask] =
    useState(false)
  console.log(ischangeallocationfortask)
  const [ishavePayment, setishavePayment] = useState(false)
console.log(ishavePayment)
  const [collectionupdatedata, setcollectionupdateData] = useState({})
  const [showfollowupModal, setshowFollowupModal] = useState(false)
  const [isdropdownOpen, setIsdropdownOpen] = useState(false)
  const [taskClosed, setfollowupClosed] = useState(false)
  const [dates, setDates] = useState({ startDate: "", endDate: "" })
  const [editdemoIndex, setdemoEditIndex] = useState(null)
  const [
    editfollowUpDatesandRemarksEditIndex,
    setfollowUpDatesandRemarksEditIndex
  ] = useState(null)

  const [startMonth, setStartMonth] = useState(new Date())
  const [endMonth, setEndMonth] = useState(new Date())
  const [netTotalAmount, setnetTotalAmount] = useState(0)
  const [allocatednetAmount, setallocatednetAmount] = useState(0)
  const [filterOpen, setfilterOpen] = useState(false)
  const [statusAll, setstatusAll] = useState(false)
  const [isAllocated, setIsAllocated] = useState(false)
  const [isOwner, setOwner] = useState(false)
  const [statusAllocated, setstatusAllocated] = useState(false)
  const [pending, setPending] = useState(true)
  const [allocatedLeads, setAllocatedLeads] = useState([])
  const [loader, setLoader] = useState(false)
  const [productwiseloader, setproductwiseloader] = useState(false)
  const [allocationOptions, setAllocationOptions] = useState([])
  const [selectedCompanyBranch, setselectedCompanyBranch] = useState("")
  console.log(selectedCompanyBranch)
  const [isHaveEditchoice, setIsEditable] = useState(false)
  const [selectedDocId, setselectedDocid] = useState(null)
  const [selectedTab, setselectedTab] = useState("")
  const [hasOwnLeads, setHasownLeads] = useState(false)
  // const result =
  //   safeState?.ownlead
  //     ? true
  //     : safeState?.staffId
  //       ? false
  //       : !!safeState?.ownfollowup ?? true;
  const result = safeState?.ownlead
    ? true
    : safeState?.staffId
      ? false
      : (safeState?.ownfollowup ?? true)
  console.log(safeState)
  console.log(result)
  const [ownFollowUp, setOwnFollowUp] = useState(result)

  console.log(safeState?.ownlead)
  console.log(safeState?.ownfollowup)
  console.log(safeState?.staffId)
  console.log(safeState)
  console.log(ownFollowUp)
  console.log(safeState)
  console.log(ownFollowUp)
  console.log(ownFollowUp)
  console.log(safeState?.staffId ? false : true)
  console.log(safeState)
  const [historyList, setHistoryList] = useState([])
  const [loggedUser, setloggedUser] = useState(null)
  const [originalloggeduser, setoriginalloggeduser] = useState(null)
  console.log(originalloggeduser)
  const [loggedUserBranches, setloggedUserBranches] = useState([])
  const [followupDateLoader, setfollowupDateLoader] = useState(false)
  const [input, setInput] = useState("")
  const [showFullRemarks, setShowFullRemarks] = useState("")
  const [errors, setErrors] = useState({})
  const [demosubmitError, setDemofollowersubmitError] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [debouncedValue, setDebouncedValue] = useState("")
  const [followupDateModal, setfollowupDateModal] = useState(false)
  const [showFullName, setShowFullName] = useState(false)
  const [showFullEmail, setShowFullEmail] = useState(false)
  const [selectedLead, setselectedLead] = useState([])
  const dropdownRef = useRef(null)
  const [taskList, settaskList] = useState([])
  const [tableData, setTableData] = useState([])
  const [activeUserId, setActiveUserId] = useState(null)
  // NEW: Track if payment was updated in current session
  const [paymentUpdatedInSession, setPaymentUpdatedInSession] = useState(false)

  const [formData, setFormData] = useState({
    followUpDate: "",
    nextfollowUpDate: "",
    followedId: "",
    followupType: "infollowup",
    Remarks: ""
  })
  console.log(ownFollowUp)
  console.log(pending)
  console.log(checkedownfollowup)

  const [demoData, setDemodata] = useState({
    demoallocatedTo: "",
    demoallocatedDate: "",
    demoDescription: "",
    selectedType: "",
    selectedTypeName: "",
    demoassignedDate: ""
  })
  console.log(demoData)
  const { data: tasks } = UseFetch(`/lead/getallTask?removefollowup=true`)
  console.log(tasks)
  const { data: partners } = UseFetch("/customer/getallpartners")
  const { data: branches } = UseFetch("/branch/getBranch")
  const { data } = UseFetch("/auth/getallUsers")
  const { data: branchProduct } = UseFetch(
    selectedCompanyBranch &&
      `/product/getallbranchProduct?branch=${selectedCompanyBranch}`
  )
  const { data: productwiseResponse, isLoading: productloader } = useQuery({
    queryKey: [
      "productwise-followups",
      safeState?.branchId,
      safeState?.staffId,
      safeState?.productId,
      safeState?.pending,
      dates.startDate,
      dates.endDate,
      safeState?.header
    ],
    enabled:
      safeState?.viewMode === "product" &&
      !!loggedUser &&
      !!safeState?.branchId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // keep cache 10 minutes
    queryFn: async () => {
      const res = await api.get(
        `/lead/getallLeadFollowUpforselectedProduct?branchSelected=${safeState.branchId}` +
          `&loggeduserid=${safeState.staffId}` +
          `&role=${loggedUser.role}` +
          `&pendingfollowup=${safeState.pending}` +
          `&selectedproductId=${safeState.productId}` +
          `&startDate=${dates.startDate}` +
          `&endDate=${dates.endDate}` +
          `&viewmode=${safeState.viewMode}` +
          `&header=${safeState.header}`
      )

      return res.data
    }
  })
  console.log(dates)
  console.log(tasks)
  useEffect(() => {
    if (tasks) {
      const updatedTasks = tasks.map((task) => ({
        ...task,
        taskName: task.taskName.toUpperCase()
      }))
      console.log(updatedTasks)
      settaskList(updatedTasks)
    }
  }, [tasks])
  useEffect(() => {
    if (!productwiseResponse?.followupLeads) return

    const productwisedata = productwiseResponse.followupLeads

    // keep all your existing processing code here
  }, [productwiseResponse, pending, ownFollowUp, loggedUser, dates.endDate])
  console.log(selectedCompanyBranch)
  console.log(pending)
  // console.log((ownFollowUp && pending) || (checkedownfollowup &&pending))
  // [Keep all your existing useEffect hooks here - they remain the same]
  // ... (all the existing useEffect hooks from line 92 to line 600+)
  console.log(ownFollowUp)
  console.log(pending)
  useEffect(() => {
    if (selectedCategory) {
      console.log("jj")
      const Datas = targetData?.userWiseResults
      console.log(selectedCategory)
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
      console.log(loggedUser?._id)
      console.log(Datas)

      const filteredselectedCategory = Datas.flatMap(
        (user) => user.categories || []
      ).filter((item) => item.categoryId === selectedCategory?.Id)
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
    }
  }, [targetData])
  console.log(safeState?.viewMode !== "product")
  console.log(safeState?.viewMode !== "product" || !loggedUser)
  console.log(safeState?.viewMode)

  useEffect(() => {
    if (safeState?.viewMode !== "product" || !loggedUser) return

    setselectedCompanyBranch(safeState.branchId)

    setPending(safeState.pending)

    setOwnFollowUp(safeState.staffId?.toString() === loggedUser._id?.toString())
  }, [safeState, loggedUser])
  useEffect(() => {
    if (safeState?.viewMode !== "product") return
    if (!productwiseResponse?.followupLeads) return
    if (!loggedUser) return

    const productwisedata = productwiseResponse.followupLeads

    const filteredLeads = productwisedata.filter((lead) => {
      const followupAllocations =
        lead.activityLog?.filter(
          (log) =>
            log.taskTo === "followup" &&
            log.taskallocatedTo &&
            log.allocationChanged === false
        ) || []

      if (!followupAllocations.length) return false

      const lastFollowupAllocation =
        followupAllocations[followupAllocations.length - 1]

      return (
        lastFollowupAllocation?.taskallocatedTo?._id?.toString() ===
        safeState?.staffId?.toString()
      )
    })

    if (!filteredLeads.length || !dates.endDate) {
      setTableData([])
      setAllocatedLeads([])
      setnetTotalAmount(0)
      return
    }

    // ==========================================
    // TOTAL LEADS
    // ==========================================

    if (safeState?.header === "Total Leads") {
      const groupedLeads = {}

      filteredLeads.forEach((lead) => {
        const assignedTo = lead?.allocatedTo?.name || "Unassigned"

        if (!groupedLeads[assignedTo]) {
          groupedLeads[assignedTo] = []
        }

        groupedLeads[assignedTo].push(lead)
      })

      setnetTotalAmount(TotalAmount(filteredLeads))
      setTableData(normalizeTableData(groupedLeads))
      return
    }

    // ==========================================
    // PENDING + OWN FOLLOWUP
    // ==========================================

    if (pending && ownFollowUp) {
      const ownFollow = filteredLeads.filter((lead) =>
        lead.activityLog?.some(
          (log) =>
            log.taskTo === "followup" &&
            log.taskallocatedTo?._id === loggedUser._id &&
            log.followupClosed === false &&
            log.allocationChanged === false
        )
      )

      const currentDate = new Date()
      const endDateLocal = getLocalDate(new Date(dates.endDate))

      const fulldatecurrent =
        formatdate(currentDate) === endDateLocal
          ? formatdate(currentDate)
          : endDateLocal

      const neverfollowupedLeads = ownFollow.filter(
        (lead) => lead.neverfollowuped && lead.allocatedfollowup === false
      )

      const havenextFollowup = ownFollow.filter((lead) => lead.Nextfollowup)

      const filteredcurrentdatefollowupLeads = havenextFollowup.filter(
        (lead) => formatdate(lead.nextFollowUpDate) === fulldatecurrent
      )

      const iscurrent =
        fulldatecurrent === endDateLocal ? fulldatecurrent : endDateLocal

      const overdueFollowups = havenextFollowup.filter(
        (lead) => formatdate(lead.nextFollowUpDate) < iscurrent
      )

      const postdatefollowup = havenextFollowup.filter(
        (lead) => formatdate(lead.nextFollowUpDate) > iscurrent
      )

      const uniqueoverdueAndcurrentdate = [
        ...new Set([...overdueFollowups, ...filteredcurrentdatefollowupLeads])
      ]

      const taskSubmittedLeads = ownFollow.filter(
        (lead) => lead.allocatedfollowup && lead.allocatedTaskClosed
      )

      const nonsubmittedtakleads = ownFollow.filter(
        (lead) => lead.allocatedfollowup && lead.allocatedTaskClosed === false
      )

      setAllocatedLeads(normalizeTableData(nonsubmittedtakleads))

      const mergedall = [
        ...neverfollowupedLeads,
        ...uniqueoverdueAndcurrentdate,
        ...postdatefollowup,
        ...(safeState?.viewMode ? [] : taskSubmittedLeads)
      ]

      setnetTotalAmount(TotalAmount(mergedall))
      setTableData(normalizeTableData(mergedall))

      return
    }

    // ==========================================
    // PENDING + COLLEAGUE FOLLOWUP
    // ==========================================

    if (pending && !ownFollowUp) {
      const currentDate = new Date()
      const endDateLocal = getLocalDate(new Date(dates.endDate))

      const fulldatecurrent =
        formatdate(currentDate) === endDateLocal
          ? formatdate(currentDate)
          : endDateLocal

      const neverfollowupedLeads = filteredLeads.filter(
        (lead) => lead.neverfollowuped
      )

      const havenextFollowup = filteredLeads.filter((lead) => lead.Nextfollowup)

      const filteredcurrentdatefollowupLeads = havenextFollowup.filter(
        (lead) => formatdate(lead.nextFollowUpDate) === fulldatecurrent
      )

      const iscurrent =
        fulldatecurrent === endDateLocal ? fulldatecurrent : endDateLocal

      const overdueFollowups = havenextFollowup.filter(
        (lead) => formatdate(lead.nextFollowUpDate) < iscurrent
      )

      const postdatefollowup = havenextFollowup.filter(
        (lead) => formatdate(lead.nextFollowUpDate) > iscurrent
      )

      const uniqueoverdueAndcurrentdate = [
        ...new Set([...overdueFollowups, ...filteredcurrentdatefollowupLeads])
      ]

      const taskSubmittedLeads = filteredLeads.filter(
        (lead) => lead.allocatedfollowup && lead.allocatedTaskClosed
      )

      const nonsubmittedtakleads = filteredLeads.filter(
        (lead) => lead.allocatedfollowup && lead.allocatedTaskClosed === false
      )

      setAllocatedLeads(nonsubmittedtakleads)

      const mergedall = [
        ...neverfollowupedLeads,
        ...uniqueoverdueAndcurrentdate,
        ...postdatefollowup,
        ...(safeState?.viewMode ? [] : taskSubmittedLeads)
      ]

      const groupedLeads = {}

      mergedall.forEach((lead) => {
        const assignedTo = lead?.allocatedTo?.name || "Unassigned"

        if (!groupedLeads[assignedTo]) {
          groupedLeads[assignedTo] = []
        }

        groupedLeads[assignedTo].push(lead)
      })

      setnetTotalAmount(TotalAmount(mergedall))
      setTableData(normalizeTableData(groupedLeads))

      return
    }

    // ==========================================
    // CLEARED OWN FOLLOWUP
    // ==========================================

    if (!pending && ownFollowUp) {
      const ownFollow = filteredLeads.filter((lead) =>
        lead.activityLog?.some(
          (log) =>
            log.taskTo === "followup" &&
            log.taskallocatedTo?._id === loggedUser._id &&
            log.followupClosed === true
        )
      )

      const clearedLeads = ownFollow.filter(
        (lead) =>
          Array.isArray(lead.activityLog) &&
          lead.activityLog.some(
            (entry) =>
              entry.taskTo === "followup" && entry.followupClosed === true
          )
      )

      setnetTotalAmount(TotalAmount(clearedLeads))
      setTableData(normalizeTableData(clearedLeads))

      return
    }

    // ==========================================
    // CLEARED COLLEAGUE FOLLOWUP
    // ==========================================

    if (!pending && !ownFollowUp) {
      const isFollowupActivity = (log) =>
        log?.taskId?.taskName === "Followup" &&
        log?.followupClosed === true &&
        log?.submissionDate

      const getLatestSubmissionDate = (lead) => {
        const datesArr = (lead.activityLog || [])
          .filter(isFollowupActivity)
          .map((log) => new Date(log.submissionDate).getTime())

        return datesArr.length ? Math.max(...datesArr) : null
      }

      const clearedLeads = []

      filteredLeads.forEach((lead) => {
        const latest = getLatestSubmissionDate(lead)

        if (latest) {
          clearedLeads.push({
            ...lead,
            latestSubmissionTime: latest
          })
        }
      })

      clearedLeads.sort(
        (a, b) => b.latestSubmissionTime - a.latestSubmissionTime
      )

      const groupedLeads = {}

      clearedLeads.forEach((lead) => {
        const assignedTo = lead?.allocatedTo?.name || "Unassigned"

        if (!groupedLeads[assignedTo]) {
          groupedLeads[assignedTo] = []
        }

        groupedLeads[assignedTo].push(lead)
      })

      setnetTotalAmount(TotalAmount(clearedLeads))
      setTableData(normalizeTableData(groupedLeads))
    }

    setHasownLeads(productwiseResponse?.ischekCollegueLeads)
  }, [
    productwiseResponse,
    pending,
    ownFollowUp,
    loggedUser,
    dates.endDate,
    safeState
  ])
  // const {
  //   data: productwiseResponse,
  //   isLoading: productwiseLoader,
  //   refetch: refetchProductFollowups,
  // } = useQuery({
  //   queryKey: [
  //     "product-followups",
  //     safeState?.branchId,
  //     safeState?.staffId,
  //     safeState?.productId,
  //     pending,
  //     dates.startDate,
  //     dates.endDate,
  //     safeState?.header,
  //     safeState?.viewMode,
  //   ],
  //   queryFn: async () => {
  //     const res = await api.get(
  //       `/lead/getallLeadFollowUpforselectedProduct?branchSelected=${safeState?.branchId}` +
  //         `&loggeduserid=${safeState?.staffId}` +
  //         `&role=${loggedUser.role}` +
  //         `&pendingfollowup=${pending}` +
  //         `&selectedproductId=${safeState?.productId}` +
  //         `&startDate=${dates.startDate}` +
  //         `&endDate=${dates.endDate}` +
  //         `&viewmode=${safeState?.viewMode}` +
  //         `&header=${safeState?.header}`
  //     );

  //     return res.data;
  //   },
  //   enabled:
  //     !!safeState?.branchId &&
  //     !!safeState?.staffId &&
  //     !!safeState?.productId &&
  //     !!loggedUser,
  // });
  // useEffect(() => {
  //   // run only when location.state or selectedCompanyBranch / loggedUser change
  //   //this from productwisereport
  //   if (safeState?.viewMode !== "product" || !loggedUser) return
  //   console.log("HHH")
  //   const selectedbranch = safeState?.branchId

  //     const fulldatecurrent =
  //       formatdate(currentDate) === endDateLocal
  //         ? formatdate(currentDate)
  //         : endDateLocal;

  //     const neverfollowupedLeads = ownFollow.filter(
  //       (lead) =>
  //         lead.neverfollowuped &&
  //         lead.allocatedfollowup === false
  //     );

  //     const havenextFollowup = ownFollow.filter(
  //       (lead) => lead.Nextfollowup
  //     );

  //     const filteredcurrentdatefollowupLeads =
  //       havenextFollowup.filter(
  //         (lead) =>
  //           formatdate(lead.nextFollowUpDate) ===
  //           fulldatecurrent
  //       );

  //     const iscurrent =
  //       fulldatecurrent === endDateLocal
  //         ? fulldatecurrent
  //         : endDateLocal;

  //     const overdueFollowups = havenextFollowup.filter(
  //       (lead) =>
  //         formatdate(lead.nextFollowUpDate) < iscurrent
  //     );

  //     const postdatefollowup = havenextFollowup.filter(
  //       (lead) =>
  //         formatdate(lead.nextFollowUpDate) > iscurrent
  //     );

  //     const uniqueoverdueAndcurrentdate = [
  //       ...new Set([
  //         ...overdueFollowups,
  //         ...filteredcurrentdatefollowupLeads,
  //       ]),
  //     ];

  //     const taskSubmittedLeads = ownFollow.filter(
  //       (lead) =>
  //         lead.allocatedfollowup &&
  //         lead.allocatedTaskClosed
  //     );

  //     const nonsubmittedtakleads = ownFollow.filter(
  //       (lead) =>
  //         lead.allocatedfollowup &&
  //         lead.allocatedTaskClosed === false
  //     );

  //     setAllocatedLeads(
  //       normalizeTableData(nonsubmittedtakleads)
  //     );

  //     const mergedall = [
  //       ...neverfollowupedLeads,
  //       ...uniqueoverdueAndcurrentdate,
  //       ...postdatefollowup,
  //       ...(safeState?.viewMode ? [] : taskSubmittedLeads),
  //     ];

  //     setnetTotalAmount(TotalAmount(mergedall));
  //     setTableData(normalizeTableData(mergedall));

  //     return;
  //   }

  //   // ==========================================
  //   // PENDING + COLLEAGUE FOLLOWUP
  //   // ==========================================

  //   if (pending && !ownFollowUp) {
  //     const currentDate = new Date();
  //     const endDateLocal = getLocalDate(new Date(dates.endDate));

  //     const fulldatecurrent =
  //       formatdate(currentDate) === endDateLocal
  //         ? formatdate(currentDate)
  //         : endDateLocal;

  //     const neverfollowupedLeads = filteredLeads.filter(
  //       (lead) => lead.neverfollowuped
  //     );

  //     const havenextFollowup = filteredLeads.filter(
  //       (lead) => lead.Nextfollowup
  //     );

  //     const filteredcurrentdatefollowupLeads =
  //       havenextFollowup.filter(
  //         (lead) =>
  //           formatdate(lead.nextFollowUpDate) ===
  //           fulldatecurrent
  //       );

  //     const iscurrent =
  //       fulldatecurrent === endDateLocal
  //         ? fulldatecurrent
  //         : endDateLocal;

  //     const overdueFollowups = havenextFollowup.filter(
  //       (lead) =>
  //         formatdate(lead.nextFollowUpDate) < iscurrent
  //     );

  //     const postdatefollowup = havenextFollowup.filter(
  //       (lead) =>
  //         formatdate(lead.nextFollowUpDate) > iscurrent
  //     );

  //     const uniqueoverdueAndcurrentdate = [
  //       ...new Set([
  //         ...overdueFollowups,
  //         ...filteredcurrentdatefollowupLeads,
  //       ]),
  //     ];

  //     const taskSubmittedLeads = filteredLeads.filter(
  //       (lead) =>
  //         lead.allocatedfollowup &&
  //         lead.allocatedTaskClosed
  //     );

  //     const nonsubmittedtakleads = filteredLeads.filter(
  //       (lead) =>
  //         lead.allocatedfollowup &&
  //         lead.allocatedTaskClosed === false
  //     );

  //     setAllocatedLeads(nonsubmittedtakleads);

  //     const mergedall = [
  //       ...neverfollowupedLeads,
  //       ...uniqueoverdueAndcurrentdate,
  //       ...postdatefollowup,
  //       ...(safeState?.viewMode ? [] : taskSubmittedLeads),
  //     ];

  //     const groupedLeads = {};

  //     mergedall.forEach((lead) => {
  //       const assignedTo =
  //         lead?.allocatedTo?.name || "Unassigned";

  //       if (!groupedLeads[assignedTo]) {
  //         groupedLeads[assignedTo] = [];
  //       }

  //       groupedLeads[assignedTo].push(lead);
  //     });

  //     setnetTotalAmount(TotalAmount(mergedall));
  //     setTableData(normalizeTableData(groupedLeads));

  //     return;
  //   }

  //   // ==========================================
  //   // CLEARED OWN FOLLOWUP
  //   // ==========================================

  //   if (!pending && ownFollowUp) {
  //     const ownFollow = filteredLeads.filter((lead) =>
  //       lead.activityLog?.some(
  //         (log) =>
  //           log.taskTo === "followup" &&
  //           log.taskallocatedTo?._id === loggedUser._id &&
  //           log.followupClosed === true
  //       )
  //     );

  //     const clearedLeads = ownFollow.filter(
  //       (lead) =>
  //         Array.isArray(lead.activityLog) &&
  //         lead.activityLog.some(
  //           (entry) =>
  //             entry.taskTo === "followup" &&
  //             entry.followupClosed === true
  //         )
  //     );

  //     setnetTotalAmount(TotalAmount(clearedLeads));
  //     setTableData(normalizeTableData(clearedLeads));

  //     return;
  //   }

  //   // ==========================================
  //   // CLEARED COLLEAGUE FOLLOWUP
  //   // ==========================================

  //   if (!pending && !ownFollowUp) {
  //     const isFollowupActivity = (log) =>
  //       log?.taskId?.taskName === "Followup" &&
  //       log?.followupClosed === true &&
  //       log?.submissionDate;

  //     const getLatestSubmissionDate = (lead) => {
  //       const datesArr = (lead.activityLog || [])
  //         .filter(isFollowupActivity)
  //         .map((log) =>
  //           new Date(log.submissionDate).getTime()
  //         );

  //       return datesArr.length
  //         ? Math.max(...datesArr)
  //         : null;
  //     };

  //     const clearedLeads = [];

  //     filteredLeads.forEach((lead) => {
  //       const latest = getLatestSubmissionDate(lead);

  //       if (latest) {
  //         clearedLeads.push({
  //           ...lead,
  //           latestSubmissionTime: latest,
  //         });
  //       }
  //     });

  //     clearedLeads.sort(
  //       (a, b) =>
  //         b.latestSubmissionTime -
  //         a.latestSubmissionTime
  //     );

  //     const groupedLeads = {};

  //     clearedLeads.forEach((lead) => {
  //       const assignedTo =
  //         lead?.allocatedTo?.name || "Unassigned";

  //       if (!groupedLeads[assignedTo]) {
  //         groupedLeads[assignedTo] = [];
  //       }

  //       groupedLeads[assignedTo].push(lead);
  //     });

  //     setnetTotalAmount(TotalAmount(clearedLeads));
  //     setTableData(normalizeTableData(groupedLeads));
  //   }

  //   setHasownLeads(
  //     productwiseResponse?.ischekCollegueLeads
  //   );

  // }, [
  //   productwiseResponse,
  //   pending,
  //   ownFollowUp,
  //   loggedUser,
  //   dates.endDate,
  //   safeState,
  // ]);

  useEffect(() => {
    // run only when location.state or selectedCompanyBranch / loggedUser change
    //this from productwisereport
    if (safeState?.viewMode !== "product" || !loggedUser) return
    console.log("HHH")
    const selectedbranch = safeState?.branchId

    setselectedCompanyBranch(selectedbranch)
    const fetchFollowups = async () => {
      console.log("hhhh")
      const staffIdFromState = location.state.staffId
      const pendingFromState = location.state.pending
      // console.log(location.state.istotal)
      // console.log(pendingFromState)
      const selectedproductId = location.state.productId
      console.log(location.state)
      // console.log(staffIdFromState)
      // console.log(selectedproductId)
      // console.log(pendingFromState)
      setPending(pendingFromState)
      // keep full loggedUser object, just compare ids
      setOwnFollowUp(staffIdFromState === loggedUser._id)
      console.log(staffIdFromState === loggedUser._id)
      setproductwiseloader(true)
      try {
        const res = await api.get(
          `/lead/getallLeadFollowUpforselectedProduct?branchSelected=${selectedbranch}` +
            `&loggeduserid=${staffIdFromState}` +
            `&role=${loggedUser.role}` +
            `&pendingfollowup=${pendingFromState}` +
            `&selectedproductId=${selectedproductId}` +
            `&startDate=${safeState?.viewMode ? dates.startDate : null}` +
            `&endDate=${safeState?.viewMode ? dates.endDate : null}` +
            `&viewmode=${safeState?.viewMode}` +
            `&header=${safeState?.header}`
        )
        console.log(res.data)
        // console.log(res.data.followupLeads)
        const productwisedata = res.data.followupLeads
        console.log(productwisedata)
        const a = productwisedata.map((item) => item.leadId)
        console.log(a)
        const filteredLeads = productwisedata.filter((lead) => {
          // 1️⃣ Get only followup allocation logs
          const followupAllocations = lead.activityLog.filter(
            (log) =>
              log.taskTo === "followup" &&
              log.taskallocatedTo && // must exist
              log.allocationChanged === false
          )

          // 2️⃣ If no followup allocations → skip
          if (followupAllocations.length === 0) return false

          // 3️⃣ Take LAST followup allocation
          const lastFollowupAllocation =
            followupAllocations[followupAllocations.length - 1]
          console.log(lastFollowupAllocation)
          // 4️⃣ Match with user
          return lastFollowupAllocation
          return (
            lastFollowupAllocation.taskallocatedTo?._id.toString() ===
            safeState?.staffId?.toString()
          )
        })
        console.log(filteredLeads)
        if (
          filteredLeads &&
          filteredLeads.length &&
          dates.endDate &&
          loggedUser
        ) {
          if (safeState?.header === "Total Leads") {
            const groupedLeads = {}
            let grandTotal = 0
            filteredLeads.forEach((lead) => {
              const assignedTo = lead?.allocatedTo?.name
              const amount = lead?.netAmount || 0
              grandTotal += amount
              if (!groupedLeads[assignedTo]) {
                groupedLeads[assignedTo] = []
              }
              groupedLeads[assignedTo].push(lead)
            })
            const groupedData = normalizeTableData(groupedLeads)
            // console.log(groupedData)
            setnetTotalAmount(TotalAmount(filteredLeads))
            setTableData(groupedData)
          } else {
            if (pending && ownFollowUp) {
              console.log("hhhhh")
              const ownFollow = filteredLeads.filter((lead) =>
                lead.activityLog?.some(
                  (log) =>
                    log.taskTo === "followup" &&
                    log.taskallocatedTo?._id === loggedUser._id &&
                    log.followupClosed === false &&
                    log.allocationChanged === false
                )
              )

              const currentDate = new Date()
              const endDateLocal = getLocalDate(new Date(dates.endDate))
              formatdate(currentDate)
              const fulldatecurrent =
                formatdate(currentDate) === endDateLocal
                  ? // formatdate(dates.endDate)
                    formatdate(currentDate)
                  : endDateLocal
              const neverfollowupedLeads = ownFollow.filter(
                (lead) =>
                  lead.neverfollowuped && lead.allocatedfollowup == false
              )
              const havenextFollowup = ownFollow.filter(
                (lead) => lead.Nextfollowup
              )
              const filteredcurrentdatefollowupLeads = havenextFollowup.filter(
                (lead) => formatdate(lead.nextFollowUpDate) === fulldatecurrent
              )
              const iscurrent =
                fulldatecurrent === endDateLocal
                  ? fulldatecurrent
                  : endDateLocal
              const overdueFollowups = havenextFollowup.filter(
                (lead) => formatdate(lead.nextFollowUpDate) < iscurrent
              )
              const postdatefollowup = havenextFollowup.filter(
                (lead) => formatdate(lead.nextFollowUpDate) > iscurrent
              )
              const uniqueoverdueAndcurrentdate = [
                ...new Set([
                  ...overdueFollowups,
                  ...filteredcurrentdatefollowupLeads
                ])
              ]
              const taskSubmittedLeads = ownFollow.filter(
                (lead) => lead.allocatedfollowup && lead.allocatedTaskClosed
              )
              // console.log(ownFollow)
              const nonsubmittedtakleads = ownFollow.filter(
                (lead) =>
                  lead.allocatedfollowup && lead.allocatedTaskClosed === false
              )
              const allocatedData = normalizeTableData(nonsubmittedtakleads)
              setAllocatedLeads(allocatedData)

              const mergedall = [
                ...neverfollowupedLeads,
                ...uniqueoverdueAndcurrentdate,
                ...postdatefollowup,
                ...(safeState?.viewMode ? [] : taskSubmittedLeads)
              ]
              console.log(mergedall)
              const Data = normalizeTableData(mergedall)
              // then store it in state
              setnetTotalAmount(TotalAmount(mergedall))
              // console.log(Data)
              // mergedall.forEach((item)=>)
              setTableData(Data)
            } else if (pending && !ownFollowUp) {
              console.log("h")
              const currentDate = new Date()
              const endDateLocal = getLocalDate(new Date(dates.endDate))
              formatdate(currentDate)
              const fulldatecurrent =
                formatdate(currentDate) === endDateLocal
                  ? // formatdate(dates.endDate)
                    formatdate(currentDate)
                  : endDateLocal
              const neverfollowupedLeads = filteredLeads.filter(
                (lead) => lead.neverfollowuped
              )

              const havenextFollowup = filteredLeads.filter(
                (lead) => lead.Nextfollowup
              )
              console.log(havenextFollowup)
              const filteredcurrentdatefollowupLeads = havenextFollowup.filter(
                (lead) => formatdate(lead.nextFollowUpDate) === fulldatecurrent
              )
              console.log(filteredcurrentdatefollowupLeads)

              const iscurrent =
                fulldatecurrent === endDateLocal
                  ? fulldatecurrent
                  : endDateLocal
              const overdueFollowups = havenextFollowup.filter(
                (lead) => formatdate(lead.nextFollowUpDate) < iscurrent
              )
              const postdatefollowup = havenextFollowup.filter(
                (lead) => formatdate(lead.nextFollowUpDate) > iscurrent
              )
              const uniqueoverdueAndcurrentdate = [
                ...new Set([
                  ...overdueFollowups,
                  ...filteredcurrentdatefollowupLeads
                ])
              ]

              const taskSubmittedLeads = filteredLeads.filter(
                (lead) => lead.allocatedfollowup && lead.allocatedTaskClosed
              )
              const nonsubmittedtakleads = productwisedata.filter(
                (lead) =>
                  lead.allocatedfollowup && lead.allocatedTaskClosed === false
              )
              setAllocatedLeads(nonsubmittedtakleads)
              console.log(neverfollowupedLeads)
              console.log(uniqueoverdueAndcurrentdate)
              console.log(postdatefollowup)
              console.log(safeState?.viewMode ? [] : taskSubmittedLeads)
              const mergedall = [
                ...neverfollowupedLeads,
                ...uniqueoverdueAndcurrentdate,
                ...postdatefollowup,
                ...(safeState?.viewMode ? [] : taskSubmittedLeads)
              ]
              const groupedLeads = {}
              let grandTotal = 0
              mergedall.forEach((lead) => {
                const assignedTo = lead?.allocatedTo?.name
                const amount = lead?.netAmount || 0
                grandTotal += amount
                if (!groupedLeads[assignedTo]) {
                  groupedLeads[assignedTo] = []
                }
                groupedLeads[assignedTo].push(lead)
              })
              const groupedData = normalizeTableData(groupedLeads)

              setnetTotalAmount(TotalAmount(mergedall))
              setTableData(groupedData)
              console.log(groupedData)
            } else if (!pending && ownFollowUp) {
              console.log("h")
              const ownFollow = filteredLeads.filter((lead) =>
                lead.activityLog?.some(
                  (log) =>
                    log.taskTo === "followup" &&
                    log.taskallocatedTo._id === loggedUser._id &&
                    log.followupClosed === true
                )
              )
              // console.log(ownFollow)
              const clearedLeads = ownFollow.filter(
                (lead) =>
                  Array.isArray(lead.activityLog) &&
                  lead.activityLog.some(
                    (entry) =>
                      entry.taskTo === "followup" &&
                      entry.followupClosed === true
                  )
              )
              // console.log(clearedLeads)

              // then store it in state
              setnetTotalAmount(TotalAmount(clearedLeads))
              const Data = normalizeTableData(clearedLeads)
              setTableData(Data)
            } else if (!pending && !ownFollowUp) {
              console.log("H")

              // console.log(productwisedata)
              // helpers
              const isFollowupActivity = (log) =>
                log?.taskId?.taskName === "Followup" &&
                log?.followupClosed === true &&
                log?.submissionDate

              const getLatestSubmissionDate = (lead) => {
                console.log(lead)
                const dates = (lead.activityLog || [])
                  .filter(isFollowupActivity)
                  .map((log) => new Date(log.submissionDate).getTime())
                if (!dates.length) return null
                return Math.max(...dates) // latest
              }

              const followupLeads = filteredLeads || []
              const clearedLeads = []
              console.log(followupLeads)
              followupLeads.forEach((lead) => {
                const latest = getLatestSubmissionDate(lead)
                console.log(latest)
                if (latest) {
                  // cleared
                  clearedLeads.push({ ...lead, latestSubmissionTime: latest })
                }
              })

              // sort cleared leads: latest cleared first
              clearedLeads.sort(
                (a, b) => b.latestSubmissionTime - a.latestSubmissionTime
              )
              console.log(clearedLeads)
              // optional: group by allocatedTo
              const groupedLeads = {}
              let grandTotal = 0
              clearedLeads.forEach((lead) => {
                const assignedTo = lead?.allocatedTo?.name || "Unassigned"
                const amount = lead?.netAmount || 0
                grandTotal += amount
                if (!groupedLeads[assignedTo]) groupedLeads[assignedTo] = []
                groupedLeads[assignedTo].push(lead)
              })
              const groupedData = normalizeTableData(groupedLeads)
              console.log(groupedData)
              // console.log(groupedData)
              // then store it in state
              setnetTotalAmount(TotalAmount(clearedLeads))
              setTableData(groupedData)
            }
          }

          setHasownLeads(filteredLeads?.ischekCollegueLeads)
        }

        console.log("hh")
        setproductwiseloader(false)
        // console.log(pending)
        // console.log(ownFollowUp)
        // console.log(res.data.followupLeads.length)
        // handle res.data here (set state, etc.)
      } catch (err) {
        console.error(err)
      }
    }
    console.log("hhh")
    fetchFollowups()
  }, [safeState?.state, selectedCompanyBranch, loggedUser])

  console.log(pending)
  console.log(ownFollowUp)

  const handletoogle = (status) => {
    if (!safeState.branchId) return

    setselectedCompanyBranch(safeState.branchId)

    const pendingorcleared = !status

    setPending(pendingorcleared)

    setOwnFollowUp(safeState?.staffId === loggedUser?._id)
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

  // const shouldFetch =
  //   (safeState.istotal &&
  //   safeState.staffId &&
  //   safeState.viewMode !== "product" )
  //   loggedUser &&
  //   selectedCompanyBranch
  // console.log(safeState.istotal)
  const shouldFetch =
    !!loggedUser &&
    !!selectedCompanyBranch &&
    ((safeState?.viewMode !== "product" &&
      safeState?.istotal &&
      !!safeState?.staffId) ||
      safeState?.staffId == null) &&
    pending !== undefined
  console.log(shouldFetch)
  console.log(!!loggedUser)
  console.log(!!safeState.istotal)
  console.log(safeState?.staffId)

  const finalPending = pending !== undefined ? pending : safeState?.pending

  // const followupUrl =
  //   shouldFetch
  //     ? `/lead/getallLeadFollowUp?branchSelected=${selectedCompanyBranch}` +
  //       `&loggeduserid=${safeState.istotal ? safeState.staffId : loggedUser._id}` +
  //       `&role=${safeState.istotal ? safeState.staffRole : loggedUser.role}` +
  //       `&pendingfollowup=${finalPending}` +
  //       `&viewmode=${safeState?.viewMode ? "true" : null}` +
  //       `&startDate=${safeState?.viewMode ? dates.startDate : null}` +
  //       `&endDate=${safeState?.viewMode ? dates.endDate : null}` +
  //       `&header=${safeState?.header}` +
  //       `&from=${safeState?.from ?? null}`
  //     : null;
  const followupUrl = shouldFetch
    ? `/lead/getallLeadFollowUp?branchSelected=${selectedCompanyBranch}` +
      `&loggeduserid=${safeState.istotal ? safeState.staffId : loggedUser._id}` +
      `&role=${safeState.istotal ? safeState.staffRole : loggedUser.role}` +
      `&pendingfollowup=${finalPending}` +
      `${safeState?.viewMode ? `&viewmode=true` : ""}` +
      `&startDate=${safeState?.viewMode ? dates.startDate : null}` +
      `&endDate=${safeState?.viewMode ? dates.endDate : null}` +
      `${safeState?.header ? `&header=${safeState.header}` : ""}` +
      `${safeState?.from ? `&from=${safeState.from}` : ""}`
    : null
// '/lead/getallLeadFollowUp?branchSelected=66f7b26c1e7129afd9aee189&loggeduserid=67220ce51c400b86242fe178&role=undefined&pendingfollowup=true&viewmode=true&startDate=2026-07-01&endDate=2026-07-31&header=Total Leads&from=followupReport'
console.log(followupUrl)

  const {
    data: loggedusersallocatedleads,
    isLoading: loading,
    error,
    refetch: refreshHook
  } = useQuery({
    queryKey: [
      "followups",
      selectedCompanyBranch,
      safeState?.staffId || "",
      finalPending,
      dates.startDate || "",
      dates.endDate || "",
      safeState?.header || "",
      safeState?.from || ""
    ],
    queryFn: async () => {
      const res = await api.get(followupUrl)
      console.log(res)
      return res.data?.data
    },
    enabled: !!followupUrl,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // keep cache 10 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })
  console.log(loggedusersallocatedleads)
  // console.log(url)
  console.log(loggedusersallocatedleads?.followupLeads?.length)

  // Initial loggedUser + branches from dashboard
  useEffect(() => {
    if (!safeState.branchId || !branches || !data) return
    console.log(safeState.branchId)
    console.log(safeState)
    console.log("Hhh")
    const { allusers = [], allAdmins = [] } = data
    const mergeduser = [...allusers, ...allAdmins]
    if (safeState.staffId) {
      const filtereduser = mergeduser.find(
        (item) => item._id === safeState.staffId
      )
      if (filtereduser) {
        setloggedUser(filtereduser)
      }
    }
    setselectedCompanyBranch(safeState.branchId)
    const loggeduserbranchesinproductwise = branches
      .filter((branch) => safeState.branchId === branch._id)
      .map((branch) => ({
        value: branch._id,
        label: branch.branchName
      }))
    setPending(safeState.pending ?? pending)
    setloggedUserBranches(loggeduserbranchesinproductwise)
    const now = new Date()
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    console.log(safeState)
    console.log("hhh")
    setDates({
      startDate: safeState?.filterRange?.startDate,
      endDate: safeState?.filterRange?.endDate
    })
    console.log(safeState?.filterRange)
    // setDates({ startDate, endDate })
  }, [branches, data, safeState.branchId, safeState.staffId])
  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) return
    const user = JSON.parse(userData)
    setoriginalloggeduser(user)
  }, [])
  // When no staffId in state (normal followup screen)
  useEffect(() => {
    if (!branches || safeState.staffId) return
    const userData = localStorage.getItem("user")
    if (!userData) return
    const user = JSON.parse(userData)
    let branchesForUser = []
    if (user.role === "Admin") {
      if (user?.selected?.length) {
        branchesForUser = user.selected.map((branch) => ({
          value: branch.branch_id,
          label: branch.branchName
        }))
      } else {
        branchesForUser = branches.map((branch) => ({
          value: branch._id,
          label: branch.branchName
        }))
      }
    } else {
      branchesForUser = (user.selected || []).map((branch) => ({
        value: branch.branch_id,
        label: branch.branchName
      }))
    }
    setloggedUserBranches(branchesForUser)
    setloggedUser(user)
  }, [branches, safeState.staffId])

  // default selected branch
  useEffect(() => {
    if (
      loggedUserBranches &&
      loggedUserBranches.length > 0 &&
      !safeState.staffId
    ) {
      const defaultbranch = loggedUserBranches[0]
      setselectedCompanyBranch(defaultbranch.value)
    }
  }, [loggedUserBranches])

  // default dates
  useEffect(() => {
    if (!safeState?.staffId) {
      const now = new Date()
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      const endDate = new Date()
      setDates({ startDate, endDate })
    }
  }, [statusAll])

  // partners + allocation options
  useEffect(() => {
    if (data && selectedCompanyBranch && partners && partners.length > 0) {
      setPartner(partners)
      const { allusers = [], allAdmins = [] } = data
      // const filteredSelectedBranchStaffs = allusers.filter((user) =>

      //   user.selected?.some((sel) => sel.branch_id === selectedCompanyBranch)
      // )
      const filteredSelectedBranchStaffs = allusers.filter(
        (staff) =>
          staff.isVerified === true &&
          staff.selected.some((s) => selectedCompanyBranch === s.branch_id)
      )
      console.log(filteredSelectedBranchStaffs)
      const filtereduserandadmin = [
        ...filteredSelectedBranchStaffs,
        ...allAdmins
      ]
      setAllocationOptions(
        filtereduserandadmin.map((item) => ({
          value: item?._id,
          label: item?.name
        }))
      )
    }
  }, [data, selectedCompanyBranch, partners])

  // close filter dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setfilterOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])
  console.log(loggedusersallocatedleads)
  // debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(input)
    }, 2000)
    return () => clearTimeout(handler)
  }, [input])
  console.log(ownFollowUp)
  console.log(pending)
  const formatdate = (date) => new Date(date).toISOString().split("T")[0]
  const getLocalDate = (date) => {
    const local = new Date(date)
    local.setMinutes(date.getMinutes() - date.getTimezoneOffset())
    return local.toISOString().split("T")[0]
  }
  const handleSelectedUser = (category, userId, userName) => {
    console.log("hhh")
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
      console.log("hh")
      setacheivedProducts(
        filteredselectedCategory.flatMap((item) =>
          (item.products || []).map((product) => ({
            productname: product.name,
            amount: product.achieved
          }))
        )
      )
      console.log("hhh")
    } else {
      setacheivedProducts([])
    }
  }
  const TotalAmount = (dataArr) => {
    const total = (dataArr || []).reduce((total, lead) => {
      if (!Array.isArray(lead.leadFor)) return total
      const leadTotal = lead.leadFor.reduce((sum, item) => {
        const amount = Number(item?.netAmount ?? 0)
        return sum + (isNaN(amount) ? 0 : amount)
      }, 0)
      return total + leadTotal
    }, 0)
    return Number(total.toFixed(2))
  }

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
  console.log(!loggedusersallocatedleads || !dates.endDate || !loggedUser)
  console.log(loggedusersallocatedleads)
  console.log(dates.endDate)
  console.log(loggedUser)
  // main followup data from loggedusersallocatedleads
  useEffect(() => {
    // if (!loggedusersallocatedleads || !dates.endDate || !loggedUser) return
    if (loggedusersallocatedleads && dates.endDate && loggedUser) {
      const leads = loggedusersallocatedleads.followupLeads
      console.log("h")
      console.log(pending)
      console.log(ownFollowUp)
      console.log(!pending && !ownFollowUp)
      console.log(safeState?.header)
      if (safeState?.header === "Total Leads") {
        console.log(leads)
        const filteredLeads = leads.filter((lead) => {
          // 1️⃣ Get only followup allocation logs
          const followupAllocations = lead.activityLog.filter(
            (log) =>
              log.taskTo === "followup" &&
              log.taskallocatedTo && // must exist
              log.allocationChanged === false
          )

          // 2️⃣ If no followup allocations → skip
          if (followupAllocations.length === 0) return false

          // 3️⃣ Take LAST followup allocation
          const lastFollowupAllocation =
            followupAllocations[followupAllocations.length - 1]

          // 4️⃣ Match with user
          return (
            lastFollowupAllocation.taskallocatedTo.toString() ===
            safeState?.staffId?.toString()
          )
        })
        console.log(filteredLeads)
        console.log(filteredLeads.length)
        const groupedLeads = {}
        let grandTotal = 0
        filteredLeads.forEach((lead) => {
          const assignedTo = lead?.allocatedTo?.name
          const amount = lead?.netAmount || 0
          grandTotal += amount
          if (!groupedLeads[assignedTo]) {
            groupedLeads[assignedTo] = []
          }
          groupedLeads[assignedTo].push(lead)
        })
        const groupedData = normalizeTableData(groupedLeads)
        // console.log(groupedData)
        setnetTotalAmount(TotalAmount(filteredLeads))
        setTableData(groupedData)

        console.log(safeState)
        console.log(loggedUser)
        console.log(groupedData)
      } else {
        console.log("HH")
        if (safeState?.viewMode === "overDue") {
          console.log("hhh")
          const today = new Date()
          today.setHours(0, 0, 0, 0)

          const overdueLeads = leads.filter((lead) => {
            // 1️⃣ Get logs having nextFollowUpDate
            const followupLogs = lead.activityLog.filter(
              (log) =>
                log.nextFollowUpDate &&
                new Date(log.nextFollowUpDate) > new Date("2000-01-01")
            )

            // 2️⃣ If no followups → NOT overdue
            if (followupLogs.length === 0) return false

            // 3️⃣ Get last followup log
            const lastFollowup = followupLogs[followupLogs.length - 1]

            const nextDate = new Date(lastFollowup.nextFollowUpDate)
            nextDate.setHours(0, 0, 0, 0)
            console.log(nextDate, lead.leadId)

            // 4️⃣ Check overdue
            return nextDate < today && !lead.leadConvertedDate && !lead.leadLost
          })

          console.log("Overdue Leads:", overdueLeads)
          const groupedLeads = {}
          let grandTotal = 0
          overdueLeads.forEach((lead) => {
            const assignedTo = lead?.allocatedTo?.name
            const amount = lead?.netAmount || 0
            grandTotal += amount
            if (!groupedLeads[assignedTo]) {
              groupedLeads[assignedTo] = []
            }
            groupedLeads[assignedTo].push(lead)
          })
          const groupedData = normalizeTableData(groupedLeads)
          // console.log(groupedData)
          setnetTotalAmount(TotalAmount(overdueLeads))
          setTableData(groupedData)
          console.log(groupedData)
        } else if (safeState?.viewMode === "dueToday") {
          console.log("hhhh")
          console.log("hhh")
          const today = new Date()
          today.setHours(0, 0, 0, 0)

          const dueTodayLeads = leads.filter((lead) => {
            // 1️⃣ Get logs having nextFollowUpDate
            const followupLogs = lead.activityLog.filter(
              (log) =>
                log.nextFollowUpDate &&
                new Date(log.nextFollowUpDate) > new Date("2000-01-01")
            )

            // 2️⃣ If no followups → NOT overdue
            if (followupLogs.length === 0) return false

            // 3️⃣ Get last followup log
            const lastFollowup = followupLogs[followupLogs.length - 1]

            const nextDate = new Date(lastFollowup.nextFollowUpDate)
            nextDate.setHours(0, 0, 0, 0)
            console.log(nextDate, lead.leadId)

            // 4️⃣ Check overdue
            return (
              nextDate.getTime() === today.getTime() &&
              !lead.leadConvertedDate &&
              !lead.leadLost
            )
          })
          console.log(leads)
          console.log("due Today Leads:", dueTodayLeads.length)
          const groupedLeads = {}
          let grandTotal = 0
          dueTodayLeads.forEach((lead) => {
            const assignedTo = lead?.allocatedTo?.name
            const amount = lead?.netAmount || 0
            grandTotal += amount
            if (!groupedLeads[assignedTo]) {
              groupedLeads[assignedTo] = []
            }
            groupedLeads[assignedTo].push(lead)
          })
          const groupedData = normalizeTableData(groupedLeads)
          // console.log(groupedData)
          setnetTotalAmount(TotalAmount(dueTodayLeads))
          setTableData(groupedData)
          console.log(groupedData)
        } else if (safeState?.viewMode === "future") {
          console.log("hhh")
          const today = new Date()
          today.setHours(0, 0, 0, 0)

          const futureLeads = leads.filter((lead) => {
            // 1️⃣ Get logs having nextFollowUpDate
            const followupLogs = lead.activityLog.filter(
              (log) =>
                log.nextFollowUpDate &&
                new Date(log.nextFollowUpDate) > new Date("2000-01-01")
            )

            // 2️⃣ If no followups → NOT overdue
            if (followupLogs.length === 0) return false

            // 3️⃣ Get last followup log
            const lastFollowup = followupLogs[followupLogs.length - 1]

            const nextDate = new Date(lastFollowup.nextFollowUpDate)
            nextDate.setHours(0, 0, 0, 0)
            console.log(nextDate, lead.leadId)

            // 4️⃣ Check overdue
            return nextDate > today && !lead.leadConvertedDate && !lead.leadLost
          })

          console.log("Overdue Leads:", futureLeads)
          console.log("length", futureLeads.length)
          const groupedLeads = {}
          let grandTotal = 0
          futureLeads.forEach((lead) => {
            const assignedTo = lead?.allocatedTo?.name
            const amount = lead?.netAmount || 0
            grandTotal += amount
            if (!groupedLeads[assignedTo]) {
              groupedLeads[assignedTo] = []
            }
            groupedLeads[assignedTo].push(lead)
          })
          const groupedData = normalizeTableData(groupedLeads)
          // console.log(groupedData)
          setnetTotalAmount(TotalAmount(futureLeads))
          setTableData(groupedData)
          console.log(groupedData)
        } else if (safeState?.viewMode === "converted") {
          console.log("hhhh")
          console.log("hhhh")
          console.log("hhh")
          const today = new Date()
          today.setHours(0, 0, 0, 0)

          const convertedLeads = leads.filter((lead) => {
            // 4️⃣ Check overdue
            return lead.leadConvertedDate && !lead.leadLost
          })
          console.log(leads)
          console.log("converted Leads:", convertedLeads.length)
          const groupedLeads = {}
          let grandTotal = 0
          convertedLeads.forEach((lead) => {
            const assignedTo = lead?.allocatedTo?.name
            const amount = lead?.netAmount || 0
            grandTotal += amount
            if (!groupedLeads[assignedTo]) {
              groupedLeads[assignedTo] = []
            }
            groupedLeads[assignedTo].push(lead)
          })
          const groupedData = normalizeTableData(groupedLeads)
          // console.log(groupedData)
          setnetTotalAmount(TotalAmount(convertedLeads))
          setTableData(groupedData)
          console.log(groupedData)
        } else if (safeState?.viewMode === "neverfollowup") {
          console.log("HHhh")
          const neverFollowupLeads = leads.filter((lead) => {
            const logs = lead.activityLog || []

            // 1️⃣ Get last followup allocation index
            const lastFollowupIndex = [...logs]
              .map((log, index) => ({ ...log, index }))
              .filter((log) => log.taskTo === "followup")
              .pop()?.index

            // ❌ No followup task at all
            if (lastFollowupIndex === undefined) return false

            // 2️⃣ Get logs AFTER last followup allocation
            const logsAfterFollowup = logs.slice(lastFollowupIndex + 1)

            // 3️⃣ Check if any nextFollowUpDate exists after that
            const hasNextFollowupDate = logsAfterFollowup.some(
              (log) =>
                log.nextFollowUpDate &&
                new Date(log.nextFollowUpDate) > new Date("2000-01-01")
            )

            // 4️⃣ If NOT → it's never followup
            return (
              !hasNextFollowupDate && !lead.leadConvertedDate && !lead.leadLost
            )
          })

          console.log(leads)
          console.log("neverfollowup:", neverFollowupLeads?.length)
          const groupedLeads = {}
          let grandTotal = 0
          neverFollowupLeads.forEach((lead) => {
            const assignedTo = lead?.allocatedTo?.name
            const amount = lead?.netAmount || 0
            grandTotal += amount
            if (!groupedLeads[assignedTo]) {
              groupedLeads[assignedTo] = []
            }
            groupedLeads[assignedTo].push(lead)
          })
          const groupedData = normalizeTableData(groupedLeads)
          // console.log(groupedData)
          setnetTotalAmount(TotalAmount(neverFollowupLeads))
          setTableData(groupedData)
          console.log(groupedData)
        } else {
          console.log(loggedusersallocatedleads?.followupLeads)
          const a = loggedusersallocatedleads.followupLeads.map(
            (item) => item.leadId
          )
          console.log(a)
          console.log(pending)
          console.log(ownFollowUp)
          if (pending && ownFollowUp) {
            console.log("hhhhh")
            console.log(leads)
            const a = leads.map((item) => item.leadId)
            console.log(a)
            const ownFollow = leads.filter((lead) =>
              lead.activityLog?.some(
                (log) =>
                  log.taskTo === "followup" &&
                  log.taskallocatedTo?._id === loggedUser._id &&
                  log.followupClosed === false &&
                  log.allocationChanged === false
              )
            )
            console.log(ownFollow)
            const currentDate = new Date()
            const endDateLocal = getLocalDate(new Date(dates.endDate))
            formatdate(currentDate)
            const fulldatecurrent =
              formatdate(currentDate) === endDateLocal
                ? // formatdate(dates.endDate)
                  formatdate(currentDate)
                : endDateLocal
            const neverfollowupedLeads = ownFollow.filter(
              (lead) => lead.neverfollowuped && lead.allocatedfollowup == false
            )
            const havenextFollowup = ownFollow.filter(
              (lead) => lead.Nextfollowup
            )
            const filteredcurrentdatefollowupLeads = havenextFollowup.filter(
              (lead) => formatdate(lead.nextFollowUpDate) === fulldatecurrent
            )
            const iscurrent =
              fulldatecurrent === endDateLocal ? fulldatecurrent : endDateLocal
            const overdueFollowups = havenextFollowup.filter(
              (lead) => formatdate(lead.nextFollowUpDate) < iscurrent
            )
            const postdatefollowup = havenextFollowup.filter(
              (lead) => formatdate(lead.nextFollowUpDate) > iscurrent
            )
            const uniqueoverdueAndcurrentdate = [
              ...new Set([
                ...overdueFollowups,
                ...filteredcurrentdatefollowupLeads
              ])
            ]
            const taskSubmittedLeads = ownFollow.filter(
              (lead) => lead.allocatedfollowup && lead.allocatedTaskClosed
            )
            // console.log(ownFollow)
            const nonsubmittedtakleads = ownFollow.filter(
              (lead) =>
                lead.allocatedfollowup && lead.allocatedTaskClosed === false
            )
            const allocatedData = normalizeTableData(nonsubmittedtakleads)
            setallocatednetAmount(TotalAmount(nonsubmittedtakleads))
            // console.log(TotalAmount(nonsubmittedtakleads))
            setAllocatedLeads(allocatedData)

            const mergedall = [
              ...neverfollowupedLeads,
              ...uniqueoverdueAndcurrentdate,
              ...postdatefollowup,
              ...taskSubmittedLeads
            ]
            const Data = normalizeTableData(mergedall)
            // then store it in state
            setnetTotalAmount(TotalAmount(mergedall))
            // console.log(Data)
            // mergedall.forEach((item)=>)
            setTableData(Data)
          } else if (pending && !ownFollowUp) {
            console.log("Hhhh")
            if (safeState?.staffId) {
              const filterLeadsByConvertedDate = (
                leads,
                startDate,
                endDate
              ) => {
                const start = new Date(startDate)
                start.setHours(0, 0, 0, 0)

                const end = new Date(endDate)
                end.setHours(23, 59, 59, 999)

                return leads.filter((lead) => {
                  // ❌ Skip if converted OR lost
                  if (lead.leadConvertedDate) return false
                  if (lead.leadLost === true) return false

                  // ✅ Check followup activity within date range
                  const hasFollowupInRange = lead.activityLog?.some((log) => {
                    if (!log.taskallocatedTo) return false
                    if (log.taskTo !== "followup") return false
                    if (!log.submissionDate) return false

                    const submissionDate = new Date(log.submissionDate)

                    return submissionDate >= start && submissionDate <= end
                  })

                  return hasFollowupInRange
                })
              }
              console.log(leads)
              const a = leads.map((item) => item.leadId)
              console.log(a)
              const filteredpending = filterLeadsByConvertedDate(
                leads,
                dates.startDate,
                dates.endDate
              )
              console.log(filteredpending)
              const groupedLeads = {}
              let grandTotal = 0
              filteredpending.forEach((lead) => {
                const assignedTo = lead?.allocatedTo?.name
                const amount = lead?.netAmount || 0
                grandTotal += amount
                if (!groupedLeads[assignedTo]) {
                  groupedLeads[assignedTo] = []
                }
                groupedLeads[assignedTo].push(lead)
              })
              const groupedData = normalizeTableData(groupedLeads)
              // console.log(groupedData)
              setnetTotalAmount(TotalAmount(filteredpending))
              setTableData(groupedData)
            } else {
              console.log(leads)
              const currentDate = new Date()
              const endDateLocal = getLocalDate(new Date(dates.endDate))
              formatdate(currentDate)
              const fulldatecurrent =
                formatdate(currentDate) === endDateLocal
                  ? // formatdate(dates.endDate)
                    formatdate(currentDate)
                  : endDateLocal
              console.log(leads)
              const mapeed = leads.map((item) => item.leadId)
              console.log(mapeed)
              const neverfollowupedLeads = leads.filter(
                (lead) => lead.neverfollowuped
              )
              console.log(neverfollowupedLeads)
              const havenextFollowup =
                loggedusersallocatedleads.followupLeads.filter(
                  (lead) => lead.Nextfollowup
                )
              console.log(havenextFollowup)
              const edd = havenextFollowup.map((item) => item.leadId)
              console.log(edd)
              const filteredcurrentdatefollowupLeads = havenextFollowup.filter(
                (lead) => formatdate(lead.nextFollowUpDate) === fulldatecurrent
              )

              const iscurrent =
                fulldatecurrent === endDateLocal
                  ? fulldatecurrent
                  : endDateLocal
              const overdueFollowups = havenextFollowup.filter(
                (lead) => formatdate(lead.nextFollowUpDate) < iscurrent
              )
              const postdatefollowup = havenextFollowup.filter(
                (lead) => formatdate(lead.nextFollowUpDate) > iscurrent
              )
              const uniqueoverdueAndcurrentdate = [
                ...new Set([
                  ...overdueFollowups,
                  ...filteredcurrentdatefollowupLeads
                ])
              ]

              const taskSubmittedLeads =
                loggedusersallocatedleads.followupLeads.filter(
                  (lead) => lead.allocatedfollowup && lead.allocatedTaskClosed
                )
              console.log(leads)
              const nonsubmittedtakleads = leads.filter(
                (lead) =>
                  lead.allocatedfollowup && lead.allocatedTaskClosed === false
              )
              console.log(nonsubmittedtakleads)
              setallocatednetAmount(TotalAmount(nonsubmittedtakleads))
              // console.log(nonsubmittedtakleads)
              const groupedallocatedleads = {}
              nonsubmittedtakleads.forEach((lead) => {
                const assignedTo = lead?.allocatedTo?.name

                if (!groupedallocatedleads[assignedTo]) {
                  groupedallocatedleads[assignedTo] = []
                }
                groupedallocatedleads[assignedTo].push(lead)
              })
              console.log(groupedallocatedleads)
              const groupedallocatedData = normalizeTableData(
                groupedallocatedleads
              )
              setAllocatedLeads(groupedallocatedData)
              console.log(groupedallocatedData)
              // console.log(groupedallocatedData)
              console.log(neverfollowupedLeads)
              console.log(uniqueoverdueAndcurrentdate)
              console.log(postdatefollowup)
              const b = neverfollowupedLeads.map((it) => it.leadId)
              console.log(b)
              const c = uniqueoverdueAndcurrentdate.map((it) => it.leadId)
              console.log(c)
              const m = postdatefollowup.map((it) => it.leadId)
              console.log(m)
              const mergedall = [
                ...neverfollowupedLeads,
                ...uniqueoverdueAndcurrentdate,
                ...postdatefollowup
                // ...taskSubmittedLeads
              ]
              console.log(mergedall)
              const groupedLeads = {}
              let grandTotal = 0
              mergedall.forEach((lead) => {
                const assignedTo = lead?.allocatedTo?.name
                const amount = lead?.netAmount || 0
                grandTotal += amount
                if (!groupedLeads[assignedTo]) {
                  groupedLeads[assignedTo] = []
                }
                groupedLeads[assignedTo].push(lead)
              })
              const groupedData = normalizeTableData(groupedLeads)
              // console.log(groupedData)
              setnetTotalAmount(TotalAmount(mergedall))
              setTableData(groupedData)
              console.log(groupedData)
            }
          } else if (!pending && ownFollowUp) {
            console.log("h")
            console.log(leads)
            const a = leads.map((item) => item.leadId)
            console.log(a)
            const ownFollow = leads.filter((lead) =>
              lead.activityLog?.some(
                (log) =>
                  log.taskTo === "followup" &&
                  log.taskallocatedTo._id === loggedUser._id &&
                  log.followupClosed === true
              )
            )
            console.log(ownFollow)
            const b = ownFollow.map((item) => item.leadId)
            console.log(b)
            // console.log(ownFollow)
            const clearedLeads = ownFollow.filter(
              (lead) =>
                Array.isArray(lead.activityLog) &&
                lead.activityLog.some(
                  (entry) =>
                    entry.taskTo === "followup" && entry.followupClosed === true
                )
            )
            console.log(clearedLeads)
            const c = clearedLeads.map((it) => it.leadId)
            console.log(c)
            // console.log(clearedLeads)

            // then store it in state
            setnetTotalAmount(TotalAmount(clearedLeads))
            const Data = normalizeTableData(clearedLeads)
            console.log(Data)
            console.log(Data.length)
            const t = Data[0].leads
            console.log(t)
            const e = Data.map((item) => item.leadId)
            console.log(e)
            setTableData(Data)
          } else if (!pending && !ownFollowUp) {
            console.log("H")
            const followupLeads = leads || []
            if (safeState?.staffId) {
              console.log("hhh")
              const filterLeadsByConvertedDate = (
                leads,
                startDate,
                endDate
              ) => {
                const start = new Date(startDate)
                console.log(startDate)
                console.log(endDate)
                start.setHours(0, 0, 0, 0)

                const end = new Date(endDate)
                end.setHours(23, 59, 59, 999)
                console.log(leads)
                return leads.filter((lead) => {
                  // 1️⃣ Check converted date
                  if (!lead.leadConvertedDate) return false
                  console.log("h")
                  const convertedDate = new Date(lead.leadConvertedDate)
                  console.log(convertedDate)
                  const isConvertedInRange =
                    convertedDate >= start && convertedDate <= end
                  console.log(isConvertedInRange)
                  console.log(start)
                  console.log(end)
                  if (!isConvertedInRange) return false

                  // 2️⃣ Check activityLog for followup allocation within same range
                  const hasValidFollowupAllocation = lead.activityLog?.some(
                    (log) => {
                      if (!log.taskallocatedTo) return false
                      if (log.taskTo !== "followup") return false
                      if (!log.submissionDate) return false

                      const submissionDate = new Date(log.submissionDate)

                      return submissionDate >= start && submissionDate <= end
                    }
                  )

                  return hasValidFollowupAllocation
                })
              }
              console.log(dates)
              const filteredLeads = filterLeadsByConvertedDate(
                followupLeads,
                dates.startDate,
                dates.endDate
              )
              console.log(filteredLeads.length)
              console.log(filteredLeads)
              console.log(loggedusersallocatedleads)
              // optional: group by allocatedTo
              const groupedLeads = {}
              let grandTotal = 0
              filteredLeads.forEach((lead) => {
                const assignedTo = lead?.allocatedTo?.name || "Unassigned"
                const amount = lead?.netAmount || 0
                grandTotal += amount
                if (!groupedLeads[assignedTo]) groupedLeads[assignedTo] = []
                groupedLeads[assignedTo].push(lead)
              })
              const groupedData = normalizeTableData(groupedLeads)
              // console.log(groupedData)
              // then store it in state
              setnetTotalAmount(TotalAmount(filteredLeads))
              setTableData(groupedData)
            } else {
              // helpers
              const isFollowupActivity = (log) =>
                log?.taskBy?.taskName === "Followup" &&
                log?.followupClosed === true &&
                log?.submissionDate
              // console.log(isFollowupActivity)
              const getLatestSubmissionDate = (lead) => {
                const dates = (lead.activityLog || [])
                  .filter(isFollowupActivity)
                  .map((log) => new Date(log.submissionDate).getTime())
                if (!dates.length) return null
                return Math.max(...dates) // latest
              }

              const clearedLeads = []
              followupLeads.forEach((lead) => {
                const latest = getLatestSubmissionDate(lead)
                console.log(latest)
                if (latest) {
                  // cleared
                  clearedLeads.push({ ...lead, latestSubmissionTime: latest })
                }
              })

              // sort cleared leads: latest cleared first
              clearedLeads.sort(
                (a, b) => b.latestSubmissionTime - a.latestSubmissionTime
              )
              // optional: group by allocatedTo
              const groupedLeads = {}
              let grandTotal = 0
              clearedLeads.forEach((lead) => {
                const assignedTo = lead?.allocatedTo?.name || "Unassigned"
                const amount = lead?.netAmount || 0
                grandTotal += amount
                if (!groupedLeads[assignedTo]) groupedLeads[assignedTo] = []
                groupedLeads[assignedTo].push(lead)
              })
              const groupedData = normalizeTableData(groupedLeads)
              // console.log(groupedData)
              // then store it in state
              setnetTotalAmount(TotalAmount(clearedLeads))
              setTableData(groupedData)
            }
          }
        }
      }
      //       if (!safeState.staffId) {
      // console.log("hhhh")
      //         setOwnFollowUp(true)
      //       }

      console.log("hhhhdd")
      setHasownLeads(loggedusersallocatedleads.ischekCollegueLeads)
    } else {
      console.log("hh")
      setTableData([])
    }
  }, [
    loggedusersallocatedleads,
    dates,
    pending,
    ownFollowUp,
    loggedUser,
    statusAllocated
  ])
  console.log(ownFollowUp)
  useEffect(() => {
    if (loggedUser) {
      setFormData((prev) => ({
        ...prev,
        followedId: loggedUser?._id
      }))
    }
  }, [loggedUser])

  const handleDataChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
    if (isAllocated) {
      setDemodata((prev) => ({
        ...prev,
        ...(name === "nextfollowUpDate" || name === "allocationDate"
          ? { demoallocatedDate: value }
          : { demoDescription: value })
      }))
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
    if (name === "Remarks") {
      if (demoerror.demoDescription) {
        setDemoError((prev) => ({ ...prev, demoDescription: "" }))
      }
    } else if (name === "nextfollowUpDate") {
      if (errors.nextfollowUpDate) {
        setErrors((prev) => ({
          ...prev,
          nextfollowUpDate: ""
        }))
      }
    } else if (name === "allocationDate") {
      if (demoerror.allocationDate) {
        setDemoError((prev) => ({
          ...prev,
          allocationDate: ""
        }))
      }
    }
  }
  const hasCollectionData =
    collectionData && Object.keys(collectionupdatedata).length > 0
  console.log(collectionupdatedata)
  console.log(hasCollectionData)
  const handleHistory = (
    history,
    leadid,
    docId,
    allocatedTo,
    taskfromFollowup
  ) => {
    if (!loggedUser) return // NEW: guard
    const owner = loggedUser._id === allocatedTo
    setOwner(owner)
    const isHaveDemo = taskfromFollowup ? history[history.length - 1] : null
    if (isHaveDemo) {
      const demoassignedDate = formatDate(isHaveDemo.submissionDate)
      setdemoEditIndex(history.length - 1)
      setfollowUpDatesandRemarksEditIndex(history.length - 1)
      setDemodata({
        selectedType: isHaveDemo?.taskTo,
        demoallocatedTo: isHaveDemo?.taskallocatedTo?._id,
        demoallocatedDate: isHaveDemo?.allocationDate.toString().split("T")[0],
        demoassignedDate,
        demoDescription: isHaveDemo?.remarks,
        selectedTypeName: isHaveDemo?.taskTo
      })
      setIsEditable(true)
      setIsAllocated(true)
    }

    setfollowupClosed(!pending)
    setselectedDocid(docId)
    setselectedTab("History")
    setShowModal(true)
    setHistoryList(history)
    setSelectedLeadId(leadid)
  }

  const handlefollowupdate = (Id, docId) => {
    console.log("hhh")
    setfollowupDateModal(true)
    setSelectedLeadId(Id)
    setselectedDocid(docId)
    if (!demoData.demoallocatedTo) {
      setFormData((prev) => ({
        ...prev,
        followUpDate: new Date().toISOString().split("T")[0]
      }))
    }
  }
  console.log(selectedData)
  // MODIFIED: Fetch updated lead data after collection update
  const fetchUpdatedLeadData = async (leadDocId) => {
    console.log("b")
    try {
      const response = await api.get(`/lead/getLeadById/${leadDocId}`)
      if (response.status === 200) {
        setselectedData(response.data.lead)
        return response.data.lead
      }
    } catch (error) {
      console.error("Error fetching updated lead data:", error)
      toast.error("Failed to refresh lead data")
    }
  }
  console.log(formData)
  // MODIFIED: Handle collection update with refresh
  const handleCollectionUpdate = (formData) => {
    console.log(formData)
    console.log(paymentUpdatedInSession)

    // Add flag to indicate if this is an update within the same session
    const requestData = {
      ...formData,
      overwriteLastPayment: paymentUpdatedInSession // Send flag to backend
    }
    console.log(requestData)
    console.log(requestData)
    setcollectionupdateData(requestData)
    setcollectionUpdateModal(false)
  }
  console.log(collectionData)
  const handleDemoSubmit = async () => {
    console.log("hhh")
    console.log(isdemofollownotClosed)
    // if (isdemofollownotClosed) {
    //   setDemoError((prev) => ({
    //     ...prev,
    //     submiterror: "Cant submit, demo is not closed",
    //     demoDescription: ""
    //   }))
    //   return
    // }

    const newError = {}
    if (!demoData.demoallocatedDate) {
      newError.allocationDate = "Completion Date is Required"
    }
    if (!demoData.demoDescription) {
      newError.demoDescription = "Remarks is Required"
      toast.error("Remark is required")
    }
    if (!demoData.demoallocatedTo) {
      newError.selectStaff = "Staff is Required"
    }
    if (!demoData.selectedType) {
      newError.allocationTyperror = "Allocation Type is Required"
    }
    if (Object.keys(newError).length > 0) {
      setDemoError(newError)
      return
    }

    try {
      if (!loggedUser || !selectedDocId) return
      setLoader(true)

      const response = await api.post(
        `/lead/setdemolead?demoallocatedBy=${loggedUser._id}&leaddocId=${selectedDocId}&editIndex=${editdemoIndex}`,
        demoData
      )

      setLoader(false)
      setFormData((prev) => ({
        ...prev,
        followUpDate: "",
        nextfollowUpDate: "",
        followedId: "",
        Remarks: ""
      }))
      setIsAllocated(false)
      setDemodata({
        demoallocatedTo: "",
        demoallocatedDate: "",
        demoDescription: "",
        selectedType: "",
        selectedTypeName: "",
        demoassignedDate: ""
      })

      // Reset payment session flag
      setPaymentUpdatedInSession(false)

      refreshHook()
      toast.success(response.data.message)
      setshowFollowupModal(false)
    } catch (error) {
      toast.error("something went wrong")
      console.log(error)
      setLoader(false)
    }
  }
  console.log(formData)
  const handleFollowUpDateSubmit = async () => {
    console.log(formData)
    console.log(collectionupdatedata)
    

    if (followupDateLoader) return
    try {
      let newErrors = {}
      if (!formData.followUpDate)
        newErrors.followUpDate = "Follow Up Date is required"
      if (formData.followupType === "infollowup") {
        if (!formData.nextfollowUpDate) {
          newErrors.nextfollowUpDate = "Next Follow Up Date Is Required"
        }
      }
      if (!formData.Remarks) newErrors.Remarks = "Remarks is Required"

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        return
      }
      if (!loggedUser || !selectedDocId) return

      setfollowupDateLoader(true)

      const response = await api.put(
        `/lead/followupDateUpdate?selectedleaddocId=${selectedDocId}&loggeduserid=${loggedUser._id}`,
        { formData, collectionupdatedata }
      )

      if (response.status === 200) {
        toast.success(response?.data?.message)

        setIsEditable(false)
        setselectedDocid(null)
        setSelectedLeadId(null)
        setHistoryList([])
        setshowFollowupModal(false)
        setfollowupDateModal(false)
        setFormData({
          followUpDate: "",
          nextfollowUpDate: "",
          netAmount: "",
          balanceAmount: "",
          followupType: "infollowup",
          Remarks: ""
        })

        // Reset payment session flag
        setPaymentUpdatedInSession(false)

        setTableData([])
        refreshHook()
        setfollowupDateLoader(false)
      } else {
        setfollowupDateLoader(false)
        toast.error("something went wrong")
      }
    } catch (error) {
      toast.error("Something went wrong")
      setIsEditable(false)
      setfollowupDateLoader(false)
      console.log("error:", error.message)
    }
  }

  const handleFollowUp = (Item) => {
    console.log(Item)
    setshowFollowupModal(true)
    setFormData((prev) => ({
      ...prev,
      netAmount: Item.netAmount,
      balanceAmount: Item.balanceAmount,
      customerName: Item?.customerName?.customerName,
      followUpDate: new Date().toISOString().split("T")[0]
    }))

    setselectedData(Item)

    // Reset payment session flag when opening new follow-up
    setPaymentUpdatedInSession(false)

    const ishaveAllocation = Item.taskfromFollowup
      ? (Array.isArray(Item.activityLog) &&
          Item.activityLog[Item.activityLog.length - 1]) ||
        null
      : null
    if (ishaveAllocation) {
      console.log(ishaveAllocation)
      console.log(taskList)
      setdemoEditIndex(Item.activityLog.length - 1)
      setDemodata({
        selectedType: ishaveAllocation?.taskId?._id,
        selectedTypeName: ishaveAllocation?.taskTo.toUpperCase(),
        demoallocatedTo: ishaveAllocation?.taskallocatedTo?._id,
        demoallocatedDate: ishaveAllocation?.allocationDate
          .toString()
          .split("T")[0],
        demoassignedDate: formatDate(ishaveAllocation.submissionDate),
        demoDescription: ishaveAllocation?.remarks
      })
      setisdemofollowedNotClosed(true)

      setIsEditable(true)
      setIsAllocated(true)
    }
    setfollowupClosed(!pending)
    setselectedDocid(Item._id)
    setSelectedLeadId(Item.leadId)
  }

  console.log(!!safeState.staffId || !!safeState?.viewdate)
  const handleeditcollection = () => {
    console.log("dd")
    setcollectionUpdateModal(true)
  }
  const handlecloseModal = () => {
    setSelectedLeadId(null)
    setShowModal(false)
    setHistoryList([])
    // Reset payment session flag
    setPaymentUpdatedInSession(false)
  }

  // MODIFIED: Reset payment session flag when closing follow-up modal
  const handleCloseFollowupModal = () => {
    setshowFollowupModal(false)
    setPaymentUpdatedInSession(false)
    setishavePayment(false)
    setcollectionUpdateModal(false)
    setisdemofollowedNotClosed(false)
  }

  // [Keep all your existing component code - LeadRow, renderTable, etc.]
  // ... (LeadRow component and renderTable function remain the same)

  const LeadRow = ({ item, index }) => {
    console.log(item)
    const [open, setOpen] = useState(false)

    const lastLog =
      Array.isArray(item.activityLog) && item.activityLog.length
        ? item.activityLog[item.activityLog.length - 1]
        : null

    const followupDate =
      pending && lastLog?.nextFollowUpDate
        ? new Date(lastLog.nextFollowUpDate)
            .toLocaleDateString("en-GB")
            .split("/")
            .join("-")
        : "-"

    const isAllocatedToeditable = Array.isArray(item.activityLog)
      ? item.activityLog.some(
          (it) =>
            it?.taskallocatedTo?._id === loggedUser?._id &&
            it?.taskClosed === false
        )
      : false
    const customerName = item?.customerName?.customerName.toUpperCase()
    const shouldShowTooltipCustomer = customerName.length > 20
    const shouldShowTooltipEmail = item?.email.length > 5

    return (
      <>
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
          {/* <td className="px-3 py-2 font-semibold text-gray-900 text-sm border border-gray-300 whitespace-nowrap">
            {item.customerName.customerName.toUpperCase()}
          </td> */}
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
          <td className="px-3 py-2 text-sm border border-gray-300 max-w-[200px] whitespace-nowrap">
            <div className="relative group">
              <span className="block truncate text-xs uppercase text-red-600 font-medium">
                {lastLog?.remarks || "-"}
              </span>
              {lastLog?.remarks && (
                <div className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 z-20 hidden group-hover:block">
                  <div className="max-w-xs rounded-md bg-[#ADD8E6] px-2.5 py-1.5 shadow-lg border border-blue-200">
                    <p className="text-[11px] leading-snug text-slate-700">
                      {lastLog.remarks}
                    </p>
                  </div>
                </div>
              )}
            </div>
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
              onClick={() =>
                handleHistory(
                  item?.activityLog,
                  item.leadId,
                  item?._id,
                  item?.allocatedTo?._id,
                  item?.taskfromFollowup
                )
              }
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
                console.log("hh")
                const breadcrumb = [
                  { label: "Lead", path: "", state: "" },
                  {
                    label: "Lead Follow-Up",
                    path:
                      originalloggeduser?.role === "Admin"
                        ? "/admin/transaction/lead/leadFollowUp"
                        : "/staff/transaction/lead/leadFollowUp",
                    state: { ownfollowup: ownFollowUp, pending }
                  },
                  { label: "New Lead", path: "" }
                ]
                console.log("Hh")
                console.log(!isAllocatedToeditable)
                originalloggeduser?.role === "Admin"
                  ? navigate("/admin/transaction/lead/leadEdit", {
                      state: {
                        leadId: item._id,
                        isReadOnly: !isAllocatedToeditable,
                        breadcrumb
                      }
                    })
                  : navigate("/staff/transaction/lead/leadEdit", {
                      state: {
                        leadId: item._id,
                        isReadOnly: !isAllocatedToeditable,
                        breadcrumb
                      }
                    })
                console.log("hhh")
              }}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors w-full justify-center"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </td>

          {((ownFollowUp && pending) || (checkedownfollowup && pending)) && (
            <td
              className="px-2 py-2 border border-gray-300"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => handleFollowUp(item)}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-white bg-amber-500 rounded hover:bg-amber-600 transition-colors w-full justify-center"
              >
                <History className="w-3.5 h-3.5" />
              </button>
            </td>
          )}
          <td className="px-3 py-2 text-sm font-semibold text-green-700 border border-gray-300 whitespace-nowrap text-right">
            <span className="inline-flex items-center gap-0.5 justify-end">
              <IndianRupee className="w-3.5 h-3.5" />
              {item.netAmount?.toLocaleString("en-IN")}
            </span>
          </td>
        </tr>

        {open && (
          <>
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
                  <span>No. of Calls</span>
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
              {ownFollowUp && checkedownfollowup && (
                <td className="px-3 py-1 border border-gray-300 bg-gray-100 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>Phone</span>
                  </div>
                </td>
              )}

              <td className="px-3 py-1 border border-gray-300 bg-gray-100 text-gray-600">
                <div className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </div>
              </td>
              <td className="px-3 py-1 border border-gray-300 bg-gray-100 text-gray-600">
                <div className="flex items-center gap-1">
                  <Package className="w-3.5 h-3.5" />
                  <span>Product Name</span>
                </div>
              </td>
            </tr>
            <tr className="bg-white text-xs border border-b-2 border-gray-300 border-b-gray-400">
              <td className="border border-gray-300" />
              <td className="px-3 py-1.5 border border-gray-300 text-gray-800 font-medium">
                {item?.leadBy?.name || "-"}
              </td>
              <td className="px-3 py-1.5 border border-gray-300 text-gray-700">
                {item?.allocatedTo?.name || "-"}
              </td>
              <td className="px-3 py-1.5 border border-gray-300 text-gray-700">
                {item?.allocatedBy?.name || "-"}
              </td>
              <td className="px-3 py-1.5 border border-gray-300 text-gray-700 text-center">
                {item?.activityLog?.filter(
                  (log) =>
                    log?.taskBy?.taskName?.toLowerCase() === "followup" &&
                    log?.nextFollowUpDate
                ).length || 0}
              </td>
              <td className="px-3 py-1.5 border border-gray-300 text-gray-700">
                {item.leadDate?.toString().split("T")[0] || "-"}
              </td>
              <td className="px-3 py-1.5 border border-gray-300 font-bold text-blue-700">
                {item?.leadId}
              </td>
              {ownFollowUp && checkedownfollowup && (
                <td className="px-3 py-1.5 border border-gray-300 text-gray-700">
                  {item?.phone || "-"}
                </td>
              )}

              <td className="px-3 py-2 font-semibold text-gray-900 text-sm border border-gray-300 whitespace-nowrap">
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

              <td className="px-3 py-1.5 border border-gray-300 text-blue-500 font-medium whitespace-nowrap">
                {item?.leadFor[0]?.productorServiceId?.shortName?.toUpperCase() ||
                  item?.leadFor[0]?.productorServiceId?.productName?.toUpperCase() ||
                  "-"}
              </td>
            </tr>
          </>
        )}
      </>
    )
  }

  const renderTable = (groupedData) => (
    <table className="border-collapse border border-gray-300 w-full text-sm h-auto">
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
            View/Modify
          </th>
          {(ownFollowUp && pending) || (pending && checkedownfollowup) ? (
            <>
              <th className="border border-gray-300 px-3 py-1 text-center">
                Follow Up
              </th>
              <th className="border border-gray-300 px-3 py-1 text-right">
                <div className="flex items-center gap-1.5 justify-end">
                  <IndianRupee className="w-3 h-3" />
                  <span>Net Amount</span>
                </div>
              </th>
            </>
          ) : ownFollowUp ? (
            <th className="border border-gray-300 px-3 py-1 text-right">
              <div className="flex items-center gap-1.5 justify-end">
                <IndianRupee className="w-3 h-3" />
                <span>Net Amount</span>
              </div>
            </th>
          ) : (
            <th className="border border-gray-300 px-3 py-1 text-right">
              <div className="flex items-center gap-1.5 justify-end">
                <IndianRupee className="w-3 h-3" />
                <span>Net Amount</span>
              </div>
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {groupedData?.length > 0 ? (
          groupedData.map((group, idx) =>
            (group.leads || []).map((item, index) => (
              <LeadRow key={item._id ?? `${idx}-${index}`} item={item} />
            ))
          )
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
  const currentData = statusAllocated ? allocatedLeads : tableData

  return (
    <div className="h-full  bg-[#ADD8E6] overflow-hidden">
      <div className="flex h-full  flex-row">
        <StaticSidebar
          handleMoreClick={handleMoreClick}
          selectedCompanyBranch={selectedCompanyBranch}
          setselectedCompanyBranch={setselectedCompanyBranch}
          parenttargetData={settargetData}
          parentperiodmode={periodMode}
          parentyear={selectedYear}
          setselectedPeriod={setselectedPeriod}
        />

        <div className="flex flex-1 flex-col overflow-hidden min-h-0">
          <header className="flex items-center justify-between ">
            {originalloggeduser?.role?.toLowerCase() === "admin" ? (
              <AdminHeader hide={true} />
            ) : (
              <StaffHeader hide={true} />
            )}

            <div className="flex items-center gap-1.5   pr-3 h-full">
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

          {(loading || productwiseloader) && (
            <BarLoader
              cssOverride={{ width: "100%", height: "4px" }}
              color="#4A90E2"
            />
          )}
          <div className="flex flex-col flex-1 bg-[#ADD8E6] min-h-0">
            <Breadcrumb items={Breadcrumblist} />
            <div className="flex justify-between">
              <h2 className="text-lg font-bold mx-4">Lead Follow Up</h2>

              <div className="grid grid-cols-2 md:flex md:flex-nowrap md:gap-6 gap-3 md:items-center w-full md:w-auto mx-4">
                {dates.startDate && (
                  <div className="w-full ">
                    <MyDatePicker
                      setDates={setDates}
                      dates={dates}
                      view={!!safeState.staffId || !!safeState?.viewdate}
                    />
                  </div>
                )}
                {!safeState?.staffId && (
                  <div className="relative flex justify-end " ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setfilterOpen(!filterOpen)}
                      className="p-1 rounded-md bg-gray-100 md:bg-white border border-gray-300 shadow-sm hover:shadow-md hover:bg-gray-50 transition"
                      title="Filter Options"
                    >
                      <BsFilterLeft className="text-md md:text-xl text-gray-800 md:text-gray-700 hover:text-black" />
                    </button>

                    {filterOpen && (
                      <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 p-4 space-y-5 animate-fade-in-down">
                        <h3 className="text-base font-semibold text-gray-800 border-b pb-2">
                          Filters
                        </h3>

                        {[
                          {
                            label: statusAll ? "All Leads" : "Filtered Leads",
                            value: statusAll,
                            toggle: () => {
                              setstatusAll(!statusAll)
                              setTableData([])
                              setAllocatedLeads([])
                            },
                            show: false,
                            disabled: false
                          },
                          {
                            label: "Task Allocated Followups",
                            value: statusAllocated,
                            toggle: () => {
                              setstatusAllocated(!statusAllocated)
                              setTableData([])
                              setAllocatedLeads([])
                            },
                            show: safeState.staffId ? false : pending === true
                            // disabled: safeState.staffId && safeState.istotal
                          },
                          {
                            label: pending
                              ? "Pending Followup"
                              : "Cleared Followup",
                            value: pending,
                            toggle: () => {
                              setPending(!pending)
                              setTableData([])
                              setAllocatedLeads([])
                              if (safeState.staffId && !safeState.istotal) {
                                console.log("hhh")
                                handletoogle(pending)
                              }
                            },
                            show: true
                            //  disabled: safeState.staffId && safeState.istotal
                          },
                          {
                            label: ownFollowUp
                              ? "Own Followup"
                              : "All Followup",
                            value: ownFollowUp,
                            toggle: () => {
                              console.log(ownFollowUp)
                              setOwnFollowUp(!ownFollowUp)
                              setTableData([])
                              setAllocatedLeads([])
                            },
                            show: safeState.staffId
                              ? false
                              : loggedUser?.role !== "Staff"
                            // disabled: safeState.staffId && safeState.istotal
                          }
                        ]
                          .filter((item) => item.show)
                          .map((item, idx) => {
                            const isDisabled = item.disabled
                            return (
                              <div
                                key={idx}
                                className="flex items-center justify-between text-sm font-medium text-gray-700 group"
                              >
                                <span
                                  className={`transition ${
                                    item.label === "Task Allocated Followups" &&
                                    !item.value
                                      ? "text-gray-400 opacity-60 blur-[1px]"
                                      : isDisabled
                                        ? "text-gray-400 cursor-not-allowed"
                                        : "text-gray-700 group-hover:text-black"
                                  }`}
                                >
                                  {item.label}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (isDisabled) return
                                    item.toggle()
                                  }}
                                  className={`${
                                    item.value
                                      ? "bg-emerald-400"
                                      : "bg-gray-300"
                                  } w-8 h-5 flex items-center rounded-full transition-colors duration-300 ${
                                    isDisabled
                                      ? "cursor-not-allowed opacity-60"
                                      : "cursor-pointer"
                                  }`}
                                >
                                  <div
                                    className={`${
                                      item.value
                                        ? "translate-x-3"
                                        : "translate-x-0"
                                    } w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300`}
                                  />
                                </button>
                              </div>
                            )
                          })}
                      </div>
                    )}
                  </div>
                )}

                {/* <select
                value={selectedCompanyBranch || ""}
                onChange={(e) => setselectedCompanyBranch(e.target.value)}
                className="border border-gray-300 py-0.5 rounded-md px-2 focus:outline-none w-36 md:min-w-[120px] cursor-pointer"
              >
                {loggedUserBranches?.map((branch) => (
                  <option key={branch.value} value={branch.value}>
                    {branch.label}
                  </option>
                ))}
              </select> */}

                <div className="flex justify-end">
                  <button
                    onClick={() =>
                      loggedUser?.role === "Admin"
                        ? navigate("/admin/transaction/lead")
                        : navigate("/staff/transaction/lead")
                    }
                    className="bg-black text-white py-0.5 px-3 rounded-lg shadow-lg hover:bg-gray-600 w-24"
                  >
                    New Lead
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end mr-5">
              <span className="text-blue-700 font-semibold">
                Total Amount -
              </span>
              <div className="flex items-center ml-1">
                <IndianRupee className="w-3 h-3 text-green-600 mr-1" />
                <span>
                  {statusAllocated ? allocatednetAmount : netTotalAmount}
                </span>
              </div>
            </div>

            {/* <div className="h-auto overflow-x-auto rounded-lg overflow-y-auto shadow-xl mx-2 md:mx-3 mb-3 bg-white">
              {renderTable(currentData)}
            </div> */}
            <div className="flex-1 min-h-0 overflow-auto rounded-lg shadow-xl mx-2 md:mx-3 mb-3 bg-white">
              {renderTable(currentData)}
            </div>
          </div>
        </div>
        {showModal && (
          <LeadhistoryModal
            open={showModal}
            handlecloseModal={handlecloseModal}
            historyList={historyList}
            selectedLeadId={selectedLeadId}
            isOwner={isOwner}
            loggedUser={loggedUser}
          />
        )}

        {/* MODIFIED: Follow-up Modal with proper state management */}
        {showfollowupModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#ADD8E6] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="bg-[#ADD8E6] flex items-center justify-between px-6 py-2 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Follow-Up
                  </h2>
                  <p className="text-sm text-blue-600 mt-0.5 font-semibold">
                    {formData?.customerName}
                  </p>
                </div>
                <div className="text-lg font-semibold flex-grow text-end ">
                  <span>Lead ID:</span>
                  <span className="ml-1">{selectedLeadId}</span>
                </div>

                <button
                  type="button"
                  onClick={handleCloseFollowupModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Body - Scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="space-y-2">
                  {/* Follow Up Date - Read Only */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                        Follow Up Date
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          readOnly
                          value={
                            demoData.demoassignedDate
                              ? demoData.demoassignedDate
                                  .toString()
                                  .split("T")[0]
                              : formData?.followUpDate
                                ? new Date(formData.followUpDate)
                                    .toLocaleDateString("en-GB")
                                    .replace(/\//g, "-")
                                : ""
                          }
                          className="w-full px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium cursor-not-allowed focus:outline-none"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    {/* Status Dropdown */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                        Status
                      </label>
                      <div className="relative">
                        <select
                          disabled={isAllocated}
                          value={formData.followupType}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              followupType: e.target.value
                            }))
                          }
                          onFocus={() => setIsdropdownOpen(true)}
                          onBlur={() => setIsdropdownOpen(false)}
                          className="w-full appearance-none px-4 py-1.5 pr-10 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all cursor-pointer"
                        >
                          <option value="infollowup">In Follow-up</option>
                          <option value="closed">Closed</option>
                          <option value="lost">Lost</option>
                        </select>
                        <ChevronDown
                          className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none transition-transform duration-200 ${
                            isdropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Allocation Checkbox */}
                  {formData.followupType === "infollowup" && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-2">
                      <label className="flex items-start cursor-pointer group">
                        <input
                          type="checkbox"
                          disabled={isdemofollownotClosed}
                          checked={isAllocated}
                          onChange={() => {
                            if (
                              formData.followupType === "closed" ||
                              formData.followupType === "lost"
                            )
                              return
                            setIsAllocated(!isAllocated)
                            setFormData((prev) => ({
                              ...prev,
                              Remarks: "",
                              nextfollowUpDate: ""
                            }))
                          }}
                          className="mt-0.5 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
                        />
                        <div className="ml-3">
                          <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                            Enable Allocation
                          </span>
                          <p className="text-xs text-gray-600 mt-0.5">
                            Assign a Task to a team member
                          </p>
                        </div>
                      </label>
                    </div>
                  )}

                  {/* Allocation Details */}
                  {isAllocated && (
                    <div className="border-2 border-blue-200 rounded-xl p-5 bg-gradient-to-br from-blue-50 to-indigo-50">
                      <h3 className="text-sm font-bold text-gray-800 mb-1 flex items-center">
                        <div className="w-1 h-5 bg-blue-600 rounded mr-2"></div>
                        Allocation Details
                      </h3>

                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Allocation Type
                          </label>
                          <select
                            value={
                              demoData.selectedType && demoData.selectedTypeName
                                ? `${demoData.selectedType}||${demoData.selectedTypeName}`
                                : ""
                            }
                            onChange={(e) => {
                              const [id, name] = e.target.value.split("||")
                              setDemodata((prev) => ({
                                ...prev,
                                selectedType: id,
                                selectedTypeName: name
                              }))
                              setDemoError((prev) => ({
                                ...prev,
                                allocationTyperror: ""
                              }))
                            }}
                            className="w-full px-4 py-1.5 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          >
                            <option>Select Type</option>
                            {taskList &&
                              taskList.map((task) => (
                                <option
                                  key={task._id}
                                  value={`${task._id}||${task.taskName}`}
                                >
                                  {task?.taskName}
                                </option>
                              ))}
                          </select>
                          {demoerror.allocationTyperror && (
                            <p className="mt-1.5 text-xs text-red-600 font-medium">
                              {demoerror.allocationTyperror}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Assign To Staff
                          </label>
                          <select
                            value={demoData.demoallocatedTo}
                            onChange={(e) => {
                              setDemodata((prev) => ({
                                ...prev,
                                demoallocatedTo: e.target.value
                              }))
                              setDemoError((prev) => ({
                                ...prev,
                                selectStaff: ""
                              }))
                            }}
                            className="w-full px-4 py-1.5 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          >
                            <option value="">Select staff member...</option>
                            {allocationOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          {demoerror.selectStaff && (
                            <p className="mt-1.5 text-xs text-red-600 font-medium">
                              {demoerror.selectStaff}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Completion Date
                          </label>
                          <input
                            type="date"
                            min={today}
                            value={demoData.demoallocatedDate}
                            onChange={handleDataChange}
                            name="allocationDate"
                            className="w-full px-4 py-1.5 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                          {demoerror.allocationDate && (
                            <p className="mt-1.5 text-xs text-red-600 font-medium">
                              {demoerror.allocationDate}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Next Follow Up Date */}
                  {formData.followupType === "infollowup" && !isAllocated && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                        Next Follow Up Date
                      </label>
                      <input
                        type="date"
                        disabled={isdemofollownotClosed}
                        value={formData.nextfollowUpDate}
                        onChange={handleDataChange}
                        name="nextfollowUpDate"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      {errors.nextfollowUpDate && (
                        <p className="mt-1.5 text-xs text-red-600 font-medium">
                          {errors.nextfollowUpDate}
                        </p>
                      )}
                    </div>
                  )}

                  {/* MODIFIED: Payment Section with updated data */}
                  {formData.followupType === "closed" && (
                    <div className="border-2 border-green-200 rounded-xl p-5 bg-gradient-to-br from-green-50 to-emerald-50">
                      <label className="flex items-start cursor-pointer group mb-4">
                        <input
                          type="checkbox"
                          checked={ishavePayment}
                          onChange={() => {
                            setcollectionUpdateModal(true)
                            setishavePayment(!ishavePayment)
                            if (ishavePayment) {
                              console.log("Hhh")
setcollectionupdateData({})
                            } else {
                              console.log("hhh")
                            }
                          }}
                          className="mt-0.5 w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                        />
                        <div className="ml-3">
                          <span className="text-sm font-semibold text-gray-800 group-hover:text-green-700 transition-colors">
                            Payment Received
                          </span>
                          <p className="text-xs text-gray-600 mt-0.5">
                            Check if payment has been collected
                          </p>
                        </div>
                      </label>

                      {ishavePayment &&
                        selectedData &&
                        collectionupdateModal &&
                        partner &&
                        partner.length > 0 && (
                          <CollectionupdateModal
                            data={selectedData}
                            from="followup"
                            closemodal={setcollectionUpdateModal}
setishavePayment={setishavePayment}
                            partnerlist={partner}
                            loggedUser={loggedUser}
                            setishavePayment={setishavePayment}
                            handleCollectionUpdate={handleCollectionUpdate}
                            isUpdateMode={paymentUpdatedInSession}
                          />
                        )}
                    </div>
                  )}

                  {/* Remarks */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                      Remarks
                    </label>
                    <textarea
                      rows={4}
                      name="Remarks"
                      value={formData.Remarks || demoData.demoDescription}
                      onChange={handleDataChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Add detailed remarks or notes here..."
                    />
                    {errors.Remarks && (
                      <p className="mt-1.5 text-xs text-red-600 font-medium">
                        {errors.Remarks}
                      </p>
                    )}
                    {demoerror.demoDescription && (
                      <p className="mt-1.5 text-xs text-red-600 font-medium">
                        {demoerror.demoDescription}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-2 border-t border-gray-200 bg-[#ADD8E6]">
                <button
                  type="button"
                  onClick={handleCloseFollowupModal}
                  className="px-6 py-1.5 border-2 border-gray-300 rounded-lg text-white font-semibold hover:bg-gray-500 hover:border-gray-400 transition-all bg-gray-500"
                >
                  Cancel
                </button>

                <button
                  onClick={
                    isAllocated ? handleDemoSubmit : handleFollowUpDateSubmit
                  }
                  className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all"
                >
                  {followupDateLoader || loader ? (
                    <div className="flex items-center">
                      Processing
                      <FaSpinner className="animate-spin h-5 w-5 text-white ml-2" />
                    </div>
                  ) : (
                    <div>{isHaveEditchoice ? "UPDATEss" : "SUBMIT"}</div>
                  )}
                </button>
              </div>
            </div>
          </div>
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
    </div>
  )
}

export default LeadFollowUp
