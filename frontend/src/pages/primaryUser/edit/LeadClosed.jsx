import { useState, useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"
import { BarLoader } from "react-spinners"
import Breadcrumb from "../../../components/common/Breadcrumb"
import LeadMaster from "../../common/LeadMaster"
import api from "../../../api/api"
import { toast } from "react-toastify"
import { getLocalStorageItem } from "../../../helper/localstorage"
import { PerformanceModal } from "../../../components/primaryUser/PerformanceModal"
import { StaticSidebar } from "../../../components/primaryUser/StaticSidebar"
import AdminHeader from "../../../header/AdminHeader"
import StaffHeader from "../../../header/StaffHeader"
import { useNavigate } from "react-router-dom"
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
  BellRing,
  History,
  ChevronDown,
  ChevronRight,
  X
} from "lucide-react"
import UseFetch from "../../../hooks/useFetch"
import useUnsavedChangesPrompt from "../../../hooks/useUnsavedChangesPrompt"
function LeadClosed() {
  const [fetcheddata, setfetchedData] = useState([])
  console.log(fetcheddata)
  const [closedloader, setclosedLoader] = useState(false)
  const [closingFailure, setClosingFailure] = useState(null)
  const [leaveWarning, setLeaveWarning] = useState(null)
  const [closingCompleted, setClosingCompleted] = useState(false)
  const closingCompletedRef = useRef(false)
  const navigate = useNavigate()

  const location = useLocation()
  const closingContextKey = `lead-closing-context:${location.pathname}`
  const closingDraftKey = `lead-closing-draft:${location.pathname}`
  const storedClosingContext = (() => {
    try {
      const stored = sessionStorage.getItem(closingContextKey)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })()
  const closingContext = location.state?.leadId
    ? location.state
    : storedClosingContext
  const {
    leadId,
    isReadOnly,
    refreshKey,
    closingOrigin,
    closingRemark,
    closingFollowUpDate,
    pendingCollection
  } = closingContext || {}
  console.log(isReadOnly)
  console.log(closingContext)
  const nav = [
    { label: "Lead", path: "" },
    {
      label: "New Lead",
      path: ""
    }
  ]
  const Breadcrumblist = closingContext?.breadcrumb || nav
  console.log(Breadcrumblist)
  const userData = getLocalStorageItem("user")

  useEffect(() => {
    if (!location.state?.leadId) return

    try {
      sessionStorage.setItem(closingContextKey, JSON.stringify(location.state))
    } catch {
      // The lead can still be loaded from router state when browser storage
      // is unavailable.
    }
  }, [closingContextKey, location.state])

  const clearClosingContext = () => {
    try {
      sessionStorage.removeItem(closingContextKey)
    } catch {
      // Nothing to clear when browser storage is unavailable.
    }
  }

  const getClosingDraft = () => {
    try {
      const stored = sessionStorage.getItem(closingDraftKey)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }

  const saveClosingDraft = (draft) => {
    try {
      sessionStorage.setItem(closingDraftKey, JSON.stringify(draft))
    } catch {
      // Draft recovery is optional when browser storage is unavailable.
    }
  }

  const clearClosingDraft = () => {
    try {
      sessionStorage.removeItem(closingDraftKey)
    } catch {
      // Nothing to clear when browser storage is unavailable.
    }
  }

  const storedClosingDraft = getClosingDraft()
  const closingDraft =
    storedClosingDraft && String(storedClosingDraft.leadId) === String(leadId)
      ? storedClosingDraft
      : null

  const isFollowupClosing =
    closingOrigin === "followup" &&
    Boolean(leadId)

  const returnToFollowup = () => {
    clearClosingContext()
    clearClosingDraft()
    navigate(
      userData?.role === "Admin"
        ? "/admin/transaction/lead/leadFollowUp"
        : "/staff/transaction/lead/leadFollowUp",
      { state: { refreshKey: Date.now() } }
    )
  }

  useUnsavedChangesPrompt({
    when:
      isFollowupClosing &&
      !closingCompleted &&
      !closingCompletedRef.current,
    onBlock: setLeaveWarning,
    warnBeforeUnload: true
  })

  useEffect(() => {
    const shouldGuardNavigation =
      isFollowupClosing &&
      !closingCompleted &&
      !closingCompletedRef.current

    if (!shouldGuardNavigation) return undefined

    const blockLinkNavigation = (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }

      const link = event.target.closest?.("a[href]")
      if (!link || link.target === "_blank") return

      const destination = new URL(link.href, window.location.origin)
      if (destination.origin !== window.location.origin) return

      event.preventDefault()
      setLeaveWarning((current) => current || { stay: () => {} })
    }

    document.addEventListener("click", blockLinkNavigation, true)
    return () => document.removeEventListener("click", blockLinkNavigation, true)
  }, [isFollowupClosing, closingCompleted])

  useEffect(() => {
    if (closingCompleted) {
      clearClosingContext()
      clearClosingDraft()
      const basePath =
        userData?.role === "Admin"
          ? "/admin/transaction/lead"
          : "/staff/transaction/lead"
      const destination =
        closingOrigin === "reallocation"
          ? `${basePath}/leadReallocation`
          : closingOrigin === "followup"
            ? `${basePath}/leadFollowUp`
            : basePath

      navigate(destination, {
        replace: true,
        state: { refreshKey: Date.now() }
      })
    }
  }, [closingCompleted, closingOrigin, navigate, userData?.role])

  const handleClosingFailure = async (reason) => {
    setclosedLoader(false)
    setClosingFailure({
      message: reason || "The lead was not closed",
      shouldReturnToFollowup: false
    })
  }

  const handleClosingFailureOk = () => {
    const shouldReturnToFollowup = closingFailure?.shouldReturnToFollowup
    setClosingFailure(null)

    if (shouldReturnToFollowup) {
      returnToFollowup()
    }
  }

  const handleStayOnLeadClosing = () => {
    leaveWarning?.stay?.()
    setLeaveWarning(null)
  }

  const handleReturnToFollowup = () => {
    leaveWarning?.stay?.()
    setLeaveWarning(null)
    returnToFollowup()
  }

  const [selectedUserName, setselecteduserName] = useState(null)
  const [selectedcompanyBranch, setselectedcompanyBranch] = useState(
    userData?.selected[0]?.branch_id
  )
  const [selectedleadbranch, setselectedleadbranch] = useState(null)
console.log(selectedleadbranch)
  const [activeUserId, setActiveUserId] = useState(null)
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

  const { data: branchProduct } = UseFetch(
    selectedcompanyBranch &&
      `/product/getallbranchProduct?branch=${selectedcompanyBranch}`
  )
  console.log(selectedcompanyBranch)
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
    console.log("hhhh")
    if (leadId) {
      console.log(leadId)
      const fetchselectedLeadData = async () => {
        const response = await api.get(`/lead/getSelectedLead?leadId=${leadId}`)

        if (response.status >= 200 && response.status < 300) {
          console.log("hhhh")
          console.log(response.data.data)
          setselectedleadbranch(response.data.data[0].leadBranch)
console.log(response.data.data[0].leadBranch)
          setfetchedData(response.data.data)
        }
      }
      fetchselectedLeadData()
    }
  }, [leadId, refreshKey])
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
    console.log(userData?._id)

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
    setActiveUserId(userId)
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
  console.log(leadId)

  const handleSubmit = async (data, leadData, objectId, userId, role) => {
    console.log(data)
    console.log(leadData)
    console.log(objectId)
    console.log(userId)
    console.log(role)

    try {
      setclosedLoader(true)
      const response = await api.put(`/lead/closingleads?docID=${objectId}`, {
        data,
        leadData,
        userId,
        role,
        closingContext:
          closingOrigin === "followup"
            ? {
                origin: "followup",
                remark: closingRemark,
                followUpDate: closingFollowUpDate,
                pendingCollection
              }
            : undefined
      })
      if (response.status === 200 && response.data?.lead?.leadClosed === true) {
        closingCompletedRef.current = true
        setClosingCompleted(true)
        toast.success(response.data.message)
        setclosedLoader(false)
        return
      }

      await handleClosingFailure(
        response.data?.message || "The lead was not closed"
      )
    } catch (error) {
      setclosedLoader(false)
      await handleClosingFailure(
        error?.response?.data?.message || error?.message || "Something went wrong while closing the lead"
      )
      console.error("error:", error)
      console.log(error.message)
    }
  }
  console.log("hhhh")
  return (
    <div className="h-full bg-[#ADD8E6 overflow-hidden">
      {leaveWarning && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-slate-800">
              Lead is not closed
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              The lead is still available in Follow-Up. Return there and start Lead Closing again when you are ready.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleStayOnLeadClosing}
                className="rounded-md border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700"
              >
                Stay on Lead Closing
              </button>
              <button
                type="button"
                onClick={handleReturnToFollowup}
                className="rounded-md bg-[#1B2A4A] px-5 py-2 text-sm font-semibold text-white"
              >
                Return to Follow-Up
              </button>
            </div>
          </div>
        </div>
      )}
      {closingFailure && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-slate-800">
              Lead closing failed
            </h2>
            <p className="mt-3 text-sm text-slate-600">{closingFailure.message}</p>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleClosingFailureOk}
                className="rounded-md bg-[#1B2A4A] px-5 py-2 text-sm font-semibold text-white"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex h-full flex-row overflow-hidden">
       
        <div className="flex flex-1 min-h-0 min-w-0 flex-col overflow-hidden justify-center">
         

          <div className="flex flex-1 flex-col min-h-0 min-w-0 overflow-hidden  w-full justify-center  bg-[#ADD8E6]">
         
            {/* <Breadcrumb items={Breadcrumblist} /> */}
            <LeadMaster
              process="closing"
              handleclosingData={handleSubmit}
              editloadingState={closedloader}
              seteditLoadingState={setclosedLoader}
              Data={fetcheddata}
              isReadOnly={closingCompleted}
              Breadcrumblist={Breadcrumblist}
              selectedcompanyBranch={selectedleadbranch}
              closingDraft={closingDraft}
              initialClosingRemark={closingRemark}
              onClosingDraftChange={(draft) =>
                saveClosingDraft({ ...draft, leadId })
              }
            />
          </div>
        </div>
      
      </div>
    </div>
  )
}

export default LeadClosed
