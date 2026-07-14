import {
  Mail,
  MessageSquareText,
  Bell,
  X,
  Settings,
  User,
  Users,
  Send,
  TrendingUp,
  Menu,
  ChevronLeft,
  ChevronRight,
ChevronDown, ChevronUp
} from "lucide-react"
import { IndianRupee, Wallet, CalendarDays, CalendarRange, PiggyBank } from "lucide-react";
import StaffHeader from "../../header/StaffHeader"
import Sidebar from "./Sidebar"
import AdminHeader from "../../header/AdminHeader"
import { BranchSelect } from "./BranchSelect"
import { toast } from "react-toastify"
import { useEffect, useState } from "react"
import UseFetch from "../../hooks/useFetch"
import AnnouncementBanner from "./AnnouncementBanner"
import {
  getLocalStorageItem,
  setLocalStorageItem
} from "../../helper/localstorage"
import AvatarEditor from "../common/AvatarEditor"
import { PerformanceModal } from "./PerformanceModal"
import TableSkeletonLoader from "../common/SkeletonLoader"
import SkeletonTable from "../loader/SkeletonTable"
import api from "../../api/api"
import { useNavigate } from "react-router-dom"

const scoreItems = [
  { label: "Product", value: "25%" },
  { label: "Renewal", value: "25%" },
  { label: "AMC", value: "25%" },
  { label: "Module", value: "25%" },
  { label: "Customisation", value: "25%" },
  { label: "Implementation", value: "25%" },
  { label: "Support", value: "25%" }
]

const monthlyData = [
  { month: "Jan", target: 28, achieved: 36, line: 46 },
  { month: "Feb", target: 35, achieved: 31, line: 48 },
  { month: "Mar", target: 34, achieved: 42, line: 60 },
  { month: "Apr", target: 41, achieved: 50, line: 69 },
  { month: "May", target: 45, achieved: 49, line: 68 },
  { month: "Jun", target: 56, achieved: 66, line: 81 }
]

const productData = [
  { label: "CRM", value: 32, color: "#367AF6", dark: "#2459c4" },
  { label: "ERP", value: 28, color: "#67B95E", dark: "#478d42" },
  { label: "Cloud Solutions", value: 26, color: "#5E6BDA", dark: "#3f49ae" },
  { label: "Cybersecurity", value: 14, color: "#F29C85", dark: "#cb745f" }
]

const maxBarValue = 80

const appTextStyle = {
  fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif",
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
  textRendering: "optimizeLegibility"
}

const getBarStyle = (value, colorA, colorB) => ({
  height: `${(value / maxBarValue) * 100}%`,
  background: `linear-gradient(180deg, ${colorA} 0%, ${colorB} 100%)`,
  boxShadow: `inset 1px 0 0 rgba(255,255,255,0.35), inset -1px 0 0 rgba(0,0,0,0.08), 0 3px 8px rgba(15,23,42,0.12)`
})

const MarketingDashboard = () => {
  const [user, setUser] = useState(null)
  const [branchOptions, setbranchOptions] = useState([])
  const [selectedUserName, setselecteduserName] = useState(null)
  const [selectedCategory, setselectedCategory] = useState(null)
  const [Branch, setBranch] = useState("Accuanet")
  const [openModal, setOpenModal] = useState(false)
  const [categorylist, setcategorylist] = useState([])
  console.log(categorylist)
  const [productlist, setproductList] = useState([])
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedDatapopup, setselectedDataPopup] = useState({})
  const [achievedproducts, setacheivedProducts] = useState([])
  const [selectedPeriod, setselectedPeriod] = useState("")
  const [showNotification, setShowNotification] = useState(false)
  const [cardDisplay, setcardDisplay] = useState([])
  const [selectedBranch, setselectedBranch] = useState(null)
  console.log(selectedBranch)
  const [achievedPoints, setachievedPoints] = useState(0)
  const now = new Date()
  const navigate = useNavigate()
  const [date, setdate] = useState({
    startDate: "",
    endDate: ""
  })
  const [selectedMonth, setSelectedMonth] = useState(
    String(now.getMonth() + 1).padStart(2, "0")
  )
  const [showUserMenu, setShowUserMenu] = useState(false)
  console.log(showUserMenu)
  const [periodMode, setperiodMode] = useState("all")
  const [loggedusedTarget, setloggeduserTarget] = useState([])
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()))
  const { data: followup } = UseFetch(
    `/lead/getfollowupsummaryReport?branchId=${selectedBranch}`
  )
  console.log(selectedBranch)
  const { data, loading: targetLoading } = UseFetch(
    selectedBranch &&
      selectedMonth &&
      selectedYear &&
      periodMode &&
      `/target/gettargetresult?month=${selectedMonth}&year=${selectedYear}&periodMode=${periodMode}&selectedBranch=${selectedBranch}`
  )
  console.log(data)
  const { data: branchProduct } = UseFetch(
    `/product/getallbranchProduct?branch=${selectedBranch}`
  )
const {data:pendingTask}=UseFetch(`/lead//branchwise-marketing-pending-tasks?branchId=${selectedBranch}`)
console.log(pendingTask)
useEffect(() => {
  const handleClickOutside = (e) => {
    if (!e.target.closest(".user-menu-container")) {
      setShowUserMenu(false)
    }
  }

  document.addEventListener("mousedown", handleClickOutside)

  return () => {
    document.removeEventListener("mousedown", handleClickOutside)
  }
}, [])

  // useEffect(() => {
  //   const handleClickOutside = (e) => {
  //     if (!e.target.closest(".user-menu-container")) {
  //       setShowUserMenu(false)
  //     }
  //   }

  //   document.addEventListener("mousedown", handleClickOutside)

  //   return () => document.removeEventListener("mousedown", handleClickOutside)
  // }, [])
  useEffect(() => {
    if (followup && followup.length && user) {
      const filteredleadcounts = followup.filter(
        (item) => item.staffId === user._id
      )

      const item = filteredleadcounts?.[0]

      if (item) {
        setcardDisplay([
          {
            title: "All Leads",
            detail: "Active leads",
            value: item.leadCount - item.lost,
            right: formatAmount(item.leadAmount),
            icon: (
              <Users size={15} className="text-violet-700" strokeWidth={2.2} />
            )
          },
          {
            title: "New Lead",
            detail: "Leads with no follow-up started",
            value: item.neverFollowup,
            right: formatAmount(item.neverFollowupAmount),
            icon: <Send size={15} className="text-sky-700" strokeWidth={2.2} />
          },

          {
            title: "Due Today",
            detail: "Follow-ups scheduled for today",
            value: item.dueToday,
            right: formatAmount(item.dueTodayAmount),
            icon: <Send size={15} className="text-sky-700" strokeWidth={2.2} />
          },
          {
            title: "Over Due",
            detail: "Pending follow-ups past due date",
            value: item.overDue,
            right: formatAmount(item.overDueAmount),
            icon: (
              <Users size={15} className="text-violet-700" strokeWidth={2.2} />
            )
          },
          {
            title: "Up Coming",
            detail: "Future follow-ups",
            value: item.future,
            right: formatAmount(item.futureAmount),
            icon: <Send size={15} className="text-sky-700" strokeWidth={2.2} />
          },

          {
            title: "Converted",
            detail: "Leads successfully closed",
            value: item.converted,
            right: formatAmount(item.convertedAmount),
            icon: (
              <TrendingUp
                size={15}
                className="text-emerald-700"
                strokeWidth={2.2}
              />
            )
          }
        ])
      } else {
        setcardDisplay([
          {
            title: "All Leads",
            value: 0,
            right: 0,
            icon: (
              <Users size={15} className="text-violet-700" strokeWidth={2.2} />
            )
          },
          {
            title: "New Lead",
            value: 0,
            right: 0,
            icon: <Send size={15} className="text-sky-700" strokeWidth={2.2} />
          },
          {
            title: "Due Today",
            value: 0,
            right: 0,
            icon: <Send size={15} className="text-sky-700" strokeWidth={2.2} />
          },
          {
            title: "Over Due",
            value: 0,
            right: 0,
            icon: (
              <Users size={15} className="text-violet-700" strokeWidth={2.2} />
            )
          },
          {
            title: "Up Coming",
            value: 0,
            right: 0,
            icon: <Send size={15} className="text-sky-700" strokeWidth={2.2} />
          },

          {
            title: "Converted",
            value: 0,
            right: 0,
            icon: (
              <TrendingUp
                size={15}
                className="text-emerald-700"
                strokeWidth={2.2}
              />
            )
          }
        ])
      }
    }
  }, [followup])

  useEffect(() => {
    if (data?.userWiseResults && data?.userWiseResults.length) {
      setselectedPeriod(data?.selectedPeriodName)
      const uniqueCategories = [
        ...new Map(
          data?.userWiseResults
            .flatMap((user) => user.categories || [])
            .map((category) => [
              category.categoryId,
              {
                categoryId: category.categoryId,
                categoryName: category.categoryName
              }
            ])
        ).values()
      ]
      const selectedUser = data?.userWiseResults.find(
        (item) => item.userId === user._id
      )
      setloggeduserTarget(selectedUser)
      setachievedPoints(selectedUser?.incentive)
      console.log(uniqueCategories)
      console.log(data?.userWiseResults)
      const updatedCategories = uniqueCategories.map((cat) => {
        const matchedCategories =
          data?.userWiseResults
            ?.flatMap((user) => user.categories || [])
            .filter((c) => c.categoryId === cat.categoryId) || []

        // Sum up all targets and achieved amounts
        const totalTarget = matchedCategories.reduce(
          (sum, c) => sum + (c.target || 0),
          0
        )
        const totalAchieved = matchedCategories.reduce(
          (sum, c) => sum + (c.achieved || 0),
          0
        )

        return {
          ...cat,
          achievedamount: totalAchieved,
          targetamount: totalTarget
        }
      })
      console.log(data?.userWiseResults)
      console.log(updatedCategories)
      console.log(updatedCategories)
      setcategorylist(updatedCategories)
    }
  }, [data])
  console.log(loggedusedTarget)
  useEffect(() => {
    const storedUser = getLocalStorageItem("user")
    if (storedUser) {
      setUser(storedUser)
      setselecteduserName(storedUser.name)
      setselectedBranch(storedUser.selected[0].branch_id)
      setbranchOptions((prev) => [
        ...prev,
        ...storedUser.selected.map((branch) => ({
          id: branch.branch_id,
          label: branch.branchName
        }))
      ])
    }
  }, [])
  useEffect(() => {
    if (selectedCategory) {
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
      setproductList(filteredList)

      const filteredloggedUserItem = data?.userWiseResults.filter(
        (item) => item.userId === user._id
      )
      const filteredselectedCategory =
        filteredloggedUserItem[0]?.categories.filter(
          (item) => item.categoryId === selectedCategory?.Id
        )
      const summary = filteredselectedCategory?.reduce(
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
  }, [data])

  useEffect(() => {
    const now = new Date()
    const startDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    ).toLocaleDateString("en-CA")
    const endDate = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).toLocaleDateString("en-CA")
    setdate({ startDate, endDate })
  }, [])
  const pendingTasks = [
    {
      staffName: "Arun",
      taskName: "Customer Follow-up",
      completionDate: "2026-07-15"
    },
    {
      staffName: "Rahul",
      taskName: "Generate Report",
      completionDate: "2026-07-18"
    }
  ]
  const handleLogout = async () => {
    try {
      console.log("hhh")
      const res = await api.post("/auth/logout")
      console.log(res)
      if (
        res.status === 200 &&
        res.data?.message === "Logged out successfully"
      ) {
        localStorage.removeItem("authToken")
        localStorage.removeItem("user")
        localStorage.removeItem("timer")
        localStorage.removeItem("wish")
        toast.success("Logout successfully")
        navigate("/")
      } else {
        toast.error("Logout failed on server")
      }
    } catch (err) {
      console.error(err)
      toast.error("Logout failed, please try again")
    }
  }

  const handleFollowupCellClick = (header, count) => {
    if (header === "Lead Count") {
      navigate("/admin/transaction/lead/allLeads", {
        state: { staffId: row.staffId }
      })
    } else if (header === "Due Today" && count > 0) {
      navigate("/admin/transaction/lead/leadFollowUp", {
        state: {
          staffId: user?._id,
          dueToday: true,
          ownlead: true,
          branchId: selectedBranch,
          viewMode: "dueToday",
          from: "followupReport",
          istotal: true,
          filterRange: date
        }
      })
    } else if (header === "Over Due" && count > 0) {
      navigate("/admin/transaction/lead/leadFollowUp", {
        state: {
          staffId: user?._id,
          overdue: true,
          ownlead: true,
          branchId: selectedBranch,
          viewMode: "overDue",
          from: "followupReport",
          istotal: true,
          filterRange: date
        }
      })
    } else if (header === "Up Coming" && count > 0) {
      navigate("/admin/transaction/lead/leadFollowUp", {
        state: {
          staffId: user?._id,
          future: true,
          ownlead: true,

          branchId: selectedBranch,
          viewMode: "future",
          from: "followupReport",
          istotal: true,
          filterRange: date
        }
      })
    } else if (header === "Converted" && count > 0) {
      navigate("/admin/transaction/lead/leadFollowUp", {
        state: {
          staffId: user?._id,
          converted: true,
          branchId: selectedBranch,
          viewMode: "converted",
          from: "followupReport",
          ownlead: true,

          istotal: true,
          filterRange: date
        }
      })
    } else if (header === "New Lead" && count > 0) {
      navigate("/admin/transaction/lead/leadFollowUp", {
        state: {
          staffId: user?._id,
          neverfollowup: true,
          branchId: selectedBranch,
          viewMode: "neverfollowup",
          from: "followupReport",
          ownlead: true,

          istotal: true,
          filterRange: date
        }
      })
    } else if (header === "All Leads" && count > 0) {
      navigate("/staff/transaction/lead/leadFollowUp", {
        state: {
          staffId: user?._id,
          filterRange: date,
          from: "followupReport",
          viewMode: "followup",
          istotal: true,
          header: "Total Leads",
          ownlead: true,

          branchId: selectedBranch
        }
      })
    }
  }
  const toggleSidebar = () => setSidebarOpen((prev) => !prev)
  const handleAvatarUploaded = async (url) => {
    try {
      const updateurl = await api.post(
        `/auth/uploadimage?userId=${user?._id}`,
        { url }
      )

      if (updateurl.status === 200) {
        toast.success("Profile updated successfully")
        setUser((prev) => {
          const updated = { ...(prev || {}), profileUrl: url }
          setLocalStorageItem("user", JSON.stringify(updated))
          return updated
        })
      }
    } catch (error) {
      console.log("error", error)
      toast.error("Profile not uploaded")
    }
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
const formatDateToDDMMYYYY = (dateValue) => {
    if (!dateValue) return ""
    const date = new Date(dateValue)
    if (Number.isNaN(date.getTime())) return ""
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }
  const formatAmount = (value) => Number(value || 0).toLocaleString("en-IN") //amount shown like 12,000 with commmas
  const handleMoreClick = (id, name) => {
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
    const filteredloggedUserItem = data?.userWiseResults.filter(
      (item) => item.userId === user._id
    )
    const Datas = data?.userWiseResults
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

  const total = productData.reduce((acc, item) => acc + item.value, 0)

  let cumulative = 0
  const conicStops = productData
    .map((item) => {
      const start = cumulative
      cumulative += (item.value / total) * 360
      return `${item.color} ${start}deg ${cumulative}deg`
    })
    .join(", ")
console.log(selectedBranch)
// console.log(BranchSelect)
  return (
    <div
      className="h-full overflow-hidden bg-[#ADD8E6] text-slate-800"
      style={appTextStyle}
    >
      <div className="flex h-full flex-col lg:flex-row">
        <Sidebar
          handleMoreClick={handleMoreClick}
          achievedPoints={achievedPoints}
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          user={user}
          selectedBranch={selectedBranch}
          setselectedBranch={setselectedBranch}
          branchOptions={branchOptions}
          categorylist={categorylist}
          targetLoading={targetLoading}
          BranchSelect={BranchSelect}
          SkeletonTable={SkeletonTable}
          setAvatarOpen={setAvatarOpen}
        />
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {/* TOP NAVBAR */}

          <header className="flex items-center justify-between bg-[#ADD8E6] py-0.5 ">
            {user?.role?.toLowerCase() === "admin" ? (
              <AdminHeader />
            ) : (
              <StaffHeader hide={true} />
            )}

            <div className="flex items-center gap-1.5 text-slate-700 mr-3">
              {/* <button className="rounded-full p-1.5 transition bg-slate-100">
                <Mail size={15} strokeWidth={2.2} />
              </button> */}
              <div className="relative">
                <button
                  onClick={() => setShowNotification(true)}
                  className="rounded-full p-1.5 transition bg-slate-100"
                >
                  <MessageSquareText size={15} strokeWidth={2.2} />
                </button>
                <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-500" />
              </div>
              {/* <button className="rounded-full p-1.5 transition bg-slate-100">
                <Settings size={15} strokeWidth={2.2} />
              </button> */}
              {/* <button className="rounded-full p-1.5 transition bg-slate-100">
                <User size={15} strokeWidth={2.2} />
              </button> */}

              {/* <div className="relative">
                <button
                  type="button"
                  onClick={(e) => setShowUserMenu((prev) => !prev)}
                  className="rounded-full p-1.5 transition bg-slate-100"
                >
                  <User size={15} strokeWidth={2.2} />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border border-slate-200 rounded-md shadow-lg z-50">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        console.log("logout clicked")
                        handleLogout()
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div> */}
<div className="relative user-menu-container">
  <button
    type="button"
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
      className="
        absolute right-0 mt-2
        w-32
        bg-white
        border border-slate-200
        rounded-md
        shadow-lg
        z-[9999]
      "
      onMouseDown={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          console.log("logout clicked")
          handleLogout()
        }}
        className="
          w-full
          text-left
          px-3
          py-2
          text-sm
          text-slate-700
          hover:bg-slate-100
          rounded-md
        "
      >
        Logout
      </button>
    </div>
  )}
</div>
            </div>
          </header>
          {showNotification && (
            <NotificationPopup onClose={() => setShowNotification(false)} />
          )}
          {/* <div className="px-4">
            <AnnouncementBanner />
          </div> */}
          <main className="min-h-0 flex-1 overflow-y-auto">
            <section className="p-3 sm:p-4 lg:p-4">
              <div className="grid grid-cols-6 gap-2">
                {cardDisplay.slice(0, 6).map((card) => (
                  <div
                    key={card.title}
                    onClick={() =>
                      handleFollowupCellClick(card.title, card.value)
                    }
                    className="
        min-w-0
        flex flex-col justify-between
        rounded-lg border border-slate-200/90 bg-white
        px-2.5 py-2.5
        min-h-[78px]
cursor-pointer
      "
                    style={{
                      boxShadow:
                        "0 3px 10px rgba(15,23,42,0.05), inset 0 1px 0 rgba(255,255,255,0.8)"
                    }}
                  >
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="flex min-w-0 items-center gap-2">
                        <div
                          className="
              flex h-[28px] w-[28px] shrink-0 items-center justify-center
              rounded-md bg-slate-50
              sm:h-[30px] sm:w-[30px]
              lg:h-[32px] lg:w-[32px]
            "
                          style={{
                            boxShadow:
                              "inset 0 1px 0 rgba(255,255,255,0.85), 0 1px 2px rgba(15,23,42,0.06)"
                          }}
                        >
                          <div className="scale-[0.9] sm:scale-100">
                            {card.icon}
                          </div>
                        </div>

                        <div className="min-w-0">
                          <h3
                            className="
                truncate
                font-semibold leading-none text-slate-900
                text-[clamp(14px,1.2vw,18px)]
              "
                            title={card.value}
                          >
                            {card.value}
                          </h3>
                        </div>
                      </div>

                      <span
                        className="
            ml-1 max-w-[48px] shrink-0
            font-medium text-black
            text-[clamp(11px,0.9vw,13px)]
          "
                        title={card.right}
                      >
                        ₹{card.right}
                      </span>
                    </div>

                    <p
                      className="
          mt-1.5 line-clamp-2
          font-medium leading-[1.25] text-slate-600
          text-[clamp(10px,0.95vw,13px)]
        "
                      title={card.title}
                    >
                      {card.title}
                    </p>
                    <p
                      className="
          mt-1 line-clamp-2
          font-medium leading-[1.25] text-slate-600
text-[clamp(9px,0.75vw,11px)]
          
        "
                      title={card.title}
                    >
                      {card.detail}
                    </p>
                  </div>
                ))}
              </div>

              <div
                className="
    mt-4 grid gap-4
    grid-cols-1          /* mobile: stacked (one below the other) */
    lg:grid-cols-2       /* desktop/tablet+: two diagrams side by side */
  "
              >
                {/* Monthly Performance */}
                <div
                  className="
      rounded-xl border border-slate-200/90 bg-white
      p-2.5 sm:p-3
    "
                  style={{
                    boxShadow:
                      "0 4px 12px rgba(15,23,42,0.05), inset 0 1px 0 rgba(255,255,255,0.85)"
                  }}
                >
                  <div className="mb-2.5 flex items-center justify-between">
                    <h2
                      className="
          font-semibold leading-4 text-slate-900
          [font-size:clamp(11px,1.5vw,13px)]
        "
                    >
                      Monthly Performance
                    </h2>
                    <div
                      className="
          flex items-center gap-1.5 font-medium text-slate-600
          [font-size:clamp(10px,1.4vw,12px)]
        "
                    >
                      <span>*14.4</span>
                      <span>SQL</span>
                    </div>
                  </div>

                  <div className="w-full">
                    <div className="flex h-[180px] sm:h-[210px] lg:h-[224px] gap-2">
                      {/* Y axis */}
                      <div
                        className="
            flex h-full flex-col justify-between pb-4
            font-medium text-slate-500
            [font-size:clamp(9px,1.3vw,12px)]
          "
                      >
                        {[80, 60, 40, 20, 0].map((tick) => (
                          <span key={tick}>{tick}%</span>
                        ))}
                      </div>

                      {/* Chart body */}
                      <div className="relative flex-1">
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pb-4">
                          {[0, 1, 2, 3, 4].map((line) => (
                            <div
                              key={line}
                              className="border-t border-dashed border-slate-200"
                            />
                          ))}
                        </div>

                        {/* Bars + line */}
                        <div className="relative z-10 flex h-full items-end justify-between gap-1.5 pb-4">
                          {monthlyData.map((item, index) => (
                            <div
                              key={item.month}
                              className="flex h-full flex-1 flex-col items-center justify-end gap-1"
                            >
                              <div className="relative flex h-[130px] sm:h-[150px] items-end gap-1.5">
                                <div
                                  className="w-3.5 sm:w-4 rounded-t-[4px]"
                                  style={getBarStyle(
                                    item.target,
                                    "#67A9FF",
                                    "#2F6FE4"
                                  )}
                                />
                                <div
                                  className="w-3.5 sm:w-4 rounded-t-[4px]"
                                  style={getBarStyle(
                                    item.achieved,
                                    "#86D37A",
                                    "#4EAF47"
                                  )}
                                />

                                <div
                                  className="absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-white bg-slate-700"
                                  style={{
                                    top: `${100 - (item.line / maxBarValue) * 100}%`,
                                    boxShadow: "0 2px 6px rgba(15,23,42,0.25)"
                                  }}
                                />

                                {index < monthlyData.length - 1 && (
                                  <div
                                    className="absolute h-[2px] origin-left rounded-full"
                                    style={{
                                      left: "50%",
                                      top: `${100 - (item.line / maxBarValue) * 100}%`,
                                      width: "40px",
                                      transform: `rotate(${
                                        ((monthlyData[index + 1].line -
                                          item.line) /
                                          30) *
                                        -14
                                      }deg)`,
                                      background:
                                        "linear-gradient(90deg, #334155 0%, #0f172a 100%)",
                                      boxShadow: "0 1px 3px rgba(15,23,42,0.22)"
                                    }}
                                  />
                                )}
                              </div>

                              <span
                                className="
                    font-medium text-slate-600
                    [font-size:clamp(9px,1.3vw,12px)]
                  "
                              >
                                {item.month}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="
        mt-2 flex flex-wrap items-center gap-3
        font-medium text-slate-600
        [font-size:clamp(9px,1.4vw,12px)]
      "
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-sm bg-blue-500" />
                      <span>Target</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-sm bg-green-500" />
                      <span>Achieved</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                      <span>Revenue %</span>
                    </div>
                  </div>
                </div>

              
                <div
                  className="
    rounded-xl border border-slate-200/90 bg-white
    p-2.5 sm:p-3
  "
                  style={{
                    boxShadow:
                      "0 4px 12px rgba(15,23,42,0.05), inset 0 1px 0 rgba(255,255,255,0.85)"
                  }}
                >
                  {/* Header */}
                  <div className="mb-3 flex items-center justify-between">
                    <h2
                      className="
        font-semibold leading-4 text-slate-900
        [font-size:clamp(11px,1.5vw,13px)]
      "
                    >
                      Task Pending
                    </h2>

                    <p
                      className="
        font-medium text-slate-600
        [font-size:clamp(10px,1.4vw,12px)]
      "
                    >
                      Pending Tasks:
                      <span className="ml-1 font-semibold text-slate-900">
                        {pendingTask?.length || 0}
                      </span>
                    </p>
                  </div>

                  {/* Table Wrapper */}
                  <div
                    className="
      max-h-[260px]
      overflow-auto
      rounded-lg
      border border-slate-200
    "
                  >
                    <table className="w-full border-collapse text-left">
                      {/* Table Header */}
                      <thead
                        className="
          sticky top-0 z-10
          bg-slate-50
          backdrop-blur
        "
                      >
                        <tr>
                          {["Staff Name", "Task Name", "Completion Date"].map(
                            (header) => (
                              <th
                                key={header}
                                className="
                whitespace-nowrap
                border-b border-slate-200
                px-3 py-2
                font-semibold
                text-slate-700
                [font-size:clamp(10px,1.4vw,12px)]
              "
                              >
                                {header}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>

                      {/* Table Body */}
                      <tbody>
                        {pendingTask&&pendingTask?.length > 0 ? (
                          pendingTask.map((task, index) => (
                            <tr
                              key={index}
                              className="
                transition
                hover:bg-slate-50
              "
                            >
                              {/* Staff Name */}
                              <td
                                className="
                  border-b border-slate-100
                  px-3 py-2
                  text-slate-700
                  [font-size:clamp(10px,1.4vw,12px)]
                "
                              >
                                <div className="flex items-center gap-2">
                                 

                                  <span className="font-medium">
                                    {task?.staffName.toUpperCase()}
                                  </span>
                                </div>
                              </td>

                              {/* Task Name */}
                              <td
                                className="
                  border-b border-slate-100
                  px-3 py-2
                  font-medium
                  text-slate-800
                  [font-size:clamp(10px,1.4vw,12px)]
                "
                              >
                                {task.taskName}
                              </td>

                              {/* Completion Date */}
                              <td
                                className="
                  border-b border-slate-100
                  px-3 py-2
                "
                              >
                                <span
                                  className="
                    rounded-full
                    bg-amber-100
                    px-2 py-1
                    font-medium
                    text-amber-700
                    [font-size:clamp(9px,1.3vw,11px)]
                  "
                                >
                                  {formatDateToDDMMYYYY(task.completionDate)}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="3"
                              className="
                py-8
                text-center
                text-slate-500
                [font-size:clamp(10px,1.4vw,12px)]
              "
                            >
                              No pending tasks found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
  {/* <CollectionDetails/> */}

              </div>
           
            </section>
          </main>
        </div>
      </div>
      <AvatarEditor
        open={avatarOpen}
        onClose={() => setAvatarOpen(false)}
        onUploaded={handleAvatarUploaded}
      />
      <PerformanceModal
        modalOpen={openModal}
        splitType={data?.selectedMeasurementType}
        selectedperiod={selectedPeriod}
        allperiods={data?.periods}
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
        targetData={data?.userWiseResults}
        loggedUser={user}
        selectedUser={selectedUserName}
        category={selectedCategory}
        handleSelectedUser={handleSelectedUser}
      />
    </div>
  )
}

export default MarketingDashboard
function NotificationPopup({ onClose }) {

const [showTasks, setShowTasks] = useState(false);
const [showFollowups, setShowFollowups] = useState(false);
  const notifications = [
    {
      type: "news",
      title: "New Notification",
      unread: true,
      


 data: {
    tasks: [
      {
        taskName: "System and study",
        remark: "Make it clear vision about the system",
        dueDate: "14 Jul 2026"
      },
      {
        taskName: "Coding",
        remark: "Customized coding needed",
        dueDate: "15 Jul 2026"
      }
    ],
    followups: [
      {
        customerName: "ABC Traders",
        lastRemark: "Requested demo next week"
      },
      {
        customerName: "XYZ Industries",
        lastRemark: "Waiting for quotation approval"
      }
    ]
  }
    },
    {
      type: "leave",
      title: "Today's Leave",
      unread: true,
      data: [{ name: "Rahul" }, { name: "Arun" }, { name: "Sneha" }]
    },
    {
      type: "birthday",
      title: "Today's Birthdays",
      unread: false,
      data: [
        { name: "Rahul", dob: "11 Jul" },
        { name: "Anu", dob: "11 Jul" }
      ]
    },
    {
      type: "holiday",
      title: "Monthly Holidays",
      unread: false,
      data: [
        { holiday: "Bakrid", date: "12 Jul" },
        { holiday: "Independence Day", date: "15 Aug" }
      ]
    },
    {
      type: "quarterly",
      title: "Quarterly Achievers",
      unread: false,
      data: [
        {
          name: "Rahul",
          photo: "https://i.pravatar.cc/100?img=1"
        },
        {
          name: "Arun",
          photo: "https://i.pravatar.cc/100?img=2"
        }
      ]
    },
    {
      type: "yearly",
      title: "Yearly Achievers",
      unread: false,
      data: [
        {
          name: "Sneha",
          photo: "https://i.pravatar.cc/100?img=3"
        }
      ]
    }
  ]
  
  return (
    <div className="fixed bottom-3 right-3 z-50 flex w-72 max-h-[calc(100vh-24px)] flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700 bg-slate-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/15">
            <Bell size={16} className="text-blue-400" />
          </div>

          <span className="text-sm font-semibold text-white">
            Notifications
          </span>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-700 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto bg-slate-900 p-3 space-y-3">
        {/* Read Notifications */}
        {/* {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-700 bg-slate-800 p-3 transition-all duration-200 hover:bg-slate-700"
          >
            <p className="text-sm font-semibold text-white">
              Task Assigned
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-300">
              A new support ticket has been assigned to you.
            </p>

            <p className="mt-2 text-[11px] text-slate-500">
              {index + 1} hour ago
            </p>
          </div>
        ))} */}
        <div className="flex-1 space-y-3 overflow-y-auto bg-slate-900 ">
          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-900 ">
            {notifications.map((item, index) => (
              <div
                key={index}
                className={`rounded-lg border p-2 transition-colors ${
                  item.unread
                    ? "border-blue-500/20 bg-slate-800"
                    : "border-slate-700 bg-slate-800"
                }`}
              >
                {/* Header */}
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-xs font-semibold tracking-wide text-white">
                    {item.title}
                  </h3>


                  {item.unread && (
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                  )}
                </div>
{item.type === "news" && (
  <div className="space-y-2">

   

    {/* Pending Tasks */}
    <div className="rounded-md border border-orange-500/20 bg-slate-700/40">
      <button
        onClick={() => setShowTasks(!showTasks)}
        className="flex w-full items-center justify-between px-3 py-2"
      >
        <div className="flex items-center gap-2">
          <span>📋</span>

          <span className="text-[11px] font-semibold text-orange-300">
            Pending Tasks
          </span>

          <span className="rounded bg-orange-500/20 px-1.5 py-0.5 text-[10px] text-orange-300">
            {item.data.tasks.length}
          </span>
        </div>

        {showTasks ? (
          <ChevronUp size={15} className="text-slate-400" />
        ) : (
          <ChevronDown size={15} className="text-slate-400" />
        )}
      </button>

      {showTasks && (
        <div className="space-y-1 border-t border-slate-600 px-2 py-2">
          {item.data.tasks.map((task, i) => (
            <div
              key={i}
              className="rounded bg-slate-800 px-2 py-1.5"
            >
              <div className="flex items-center justify-between">
                <p className="truncate text-[11px] font-medium text-white">
                  {task.taskName}
                </p>

                <span className="text-[10px] font-medium text-red-400">
                  {task.dueDate}
                </span>
              </div>

              <p className="mt-0.5 truncate text-[10px] text-slate-400">
                {task.remark}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Pending Follow-ups */}
    <div className="rounded-md border border-blue-500/20 bg-slate-700/40">
      <button
        onClick={() => setShowFollowups(!showFollowups)}
        className="flex w-full items-center justify-between px-3 py-2"
      >
        <div className="flex items-center gap-2">
          <span>📞</span>

          <span className="text-[11px] font-semibold text-blue-300">
            Pending Follow-ups
          </span>

          <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] text-blue-300">
            {item.data.followups.length}
          </span>
        </div>

        {showFollowups ? (
          <ChevronUp size={15} className="text-slate-400" />
        ) : (
          <ChevronDown size={15} className="text-slate-400" />
        )}
      </button>

      {showFollowups && (
        <div className="space-y-1 border-t border-slate-600 px-2 py-2">
          {item.data.followups.map((followup, i) => (
            <div
              key={i}
              className="rounded bg-slate-800 px-2 py-1.5"
            >
              <p className="truncate text-[11px] font-medium text-white">
                {followup.customerName}
              </p>

              <p className="mt-0.5 truncate text-[10px] text-slate-400">
                {followup.lastRemark}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)}
{/* {item.type === "news" && (
  <div className="space-y-2">

  
    <div className="rounded-md border border-orange-500/20 bg-slate-700/40 p-2">
      <div className="mb-1 flex items-center justify-between">
        <p className="text-[11px] font-semibold text-orange-300">
          📋 Pending Tasks
        </p>
        <span className="rounded bg-orange-500/20 px-1.5 py-0.5 text-[10px] text-orange-300">
          {item.data.tasks.length}
        </span>
      </div>

      <div className="space-y-1">
        {item.data.tasks.map((task, i) => (
          <div
            key={i}
            className="flex items-start justify-between rounded bg-slate-800 px-2 py-1"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-medium text-white">
                {task.taskName}
              </p>

              <p className="truncate text-[10px] text-slate-400">
                {task.remark}
              </p>
            </div>

            <span className="ml-2 whitespace-nowrap text-[10px] text-red-400">
              {task.dueDate}
            </span>
          </div>
        ))}
      </div>
    </div>

    
    <div className="rounded-md border border-blue-500/20 bg-slate-700/40 p-2">
      <div className="mb-1 flex items-center justify-between">
        <p className="text-[11px] font-semibold text-blue-300">
          📞 Pending Follow-ups
        </p>

        <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] text-blue-300">
          {item.data.followups.length}
        </span>
      </div>

      <div className="space-y-1">
        {item.data.followups.map((followup, i) => (
          <div
            key={i}
            className="rounded bg-slate-800 px-2 py-1"
          >
            <p className="truncate text-[11px] font-medium text-white">
              {followup.customerName}
            </p>

            <p className="truncate text-[10px] text-slate-400">
              {followup.lastRemark}
            </p>
          </div>
        ))}
      </div>
    </div>

  </div>
)} */}

                {/* Leave */}
                {item.type === "leave" && (
                  <div className="space-y-1">
                    {item.data.map((staff, i) => (
                      <div
                        key={i}
                        className="rounded-md bg-slate-700 px-2 py-1 text-xs text-slate-200"
                      >
                        {staff.name}
                      </div>
                    ))}
                  </div>
                )}

                {/* Birthday */}
                {item.type === "birthday" && (
                  <div className="space-y-1">
                    {item.data.map((staff, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-md bg-slate-700 px-2 py-1"
                      >
                        <span className="text-xs text-white">
                          🎂 {staff.name}
                        </span>

                        <span className="text-[10px] text-slate-300">
                          {staff.dob}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Holidays */}
                {item.type === "holiday" && (
                  <div className="space-y-1">
                    {item.data.map((holiday, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-md bg-slate-700 px-2 py-1"
                      >
                        <span className="text-xs text-white">
                          📅 {holiday.holiday}
                        </span>

                        <span className="text-[10px] text-slate-300">
                          {holiday.date}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quarterly & Yearly */}
                {(item.type === "quarterly" || item.type === "yearly") && (
                  <div className="space-y-1">
                    {item.data.map((staff, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded-md bg-slate-700 px-2 py-1"
                      >
                        <img
                          src={staff.photo}
                          alt={staff.name}
                          className="h-8 w-8 rounded-full border border-yellow-400 object-cover"
                        />

                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium text-white">
                            {staff.name}
                          </p>

                          <p className="text-[10px] text-yellow-400">
                            🏆 Achiever
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Swap this mock data with your API response — shape: { key, label, subtext, amount, count, icon, accent }
const DEFAULT_COLLECTIONS = [
  {
    key: "today",
    label: "Today's Collection",
    subtext: "Payments verified today",
    amount: 18450,
    count: 6,
    icon: CalendarDays,
    accent: "teal",
  },
  // {
  //   key: "week",
  //   label: "This Week",
  //   subtext: "Collections since Monday",
  //   amount: 86230,
  //   count: 24,
  //   icon: CalendarRange,
  //   accent: "indigo",
  // },
  // {
  //   key: "month",
  //   label: "This Month",
  //   subtext: "Total collected in July",
  //   amount: 160173,
  //   count: 71,
  //   icon: Wallet,
  //   accent: "violet",
  // },
  // {
  //   key: "pending",
  //   label: "Pending Collection",
  //   subtext: "Balance yet to be collected",
  //   amount: 42300,
  //   count: 9,
  //   icon: PiggyBank,
  //   accent: "amber",
  // },
];

const ACCENTS = {
  teal: { icon: "bg-teal-50 text-teal-600", btn: "bg-teal-50 text-teal-700 hover:bg-teal-100" },
  indigo: { icon: "bg-indigo-50 text-indigo-600", btn: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100" },
  violet: { icon: "bg-violet-50 text-violet-600", btn: "bg-violet-50 text-violet-700 hover:bg-violet-100" },
  amber: { icon: "bg-amber-50 text-amber-600", btn: "bg-amber-50 text-amber-700 hover:bg-amber-100" },
};

function formatINR(value) {
  return new Intl.NumberFormat("en-IN").format(value);
}

function CollectionDetails({
  collections = DEFAULT_COLLECTIONS,
  basePath = "/staff/reports/collection-details",
}) {
  const navigate = useNavigate();

  function handleNavigate(item) {
    navigate(basePath, { state: { period: item.key, label: item.label } });
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Collection Details</h3>
          <p className="text-xs text-slate-400 mt-0.5">Tap an amount to view the full breakdown</p>
        </div>
      </div>

      <div className=" gap-4">
        {collections.map((item) => {
          const Icon = item.icon;
          const accent = ACCENTS[item.accent] || ACCENTS.teal;
          return (
            <div
              key={item.key}
              className="rounded-xl border border-slate-100 p-4 flex flex-col gap-3 hover:shadow-md hover:border-slate-200 transition-all"
            >
              <div className="flex items-center justify-between gap-2.5">
                <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${accent.icon}`}>
                  <Icon className="w-4.5 h-4.5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{item.label}</p>
                  <p className="text-[11px] text-slate-400 truncate">{item.subtext}</p>
                </div>
 <button
                onClick={() => handleNavigate(item)}
                className={`group inline-flex items-center justify-between gap-2 rounded-lg px-3 py-2 font-semibold text-sm transition-colors ${accent.btn}`}
              >
                <span className="inline-flex items-center gap-1 tabular-nums">
                  <IndianRupee className="w-3.5 h-3.5" />
                  {formatINR(item.amount)}
                </span>
                <span className="inline-flex items-center gap-0.5 text-[11px] font-medium opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                  {item.count} {item.count === 1 ? "entry" : "entries"}
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </button>
              </div>

             
            </div>
          );
        })}
      </div>
    </div>
  );
}

