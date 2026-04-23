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
  ChevronRight
} from "lucide-react"
import StaffHeader from "../../header/StaffHeader"
import Sidebar from "./Sidebar"
import AdminHeader from "../../header/AdminHeader"
import { BranchSelect } from "./BranchSelect"
import { toast } from "react-toastify"
import { useEffect, useState } from "react"
import UseFetch from "../../hooks/useFetch"
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
const statCards = [
  {
    title: "All Leads",
    value: "866",
    // sub: "All leads",
    right: "15,200",
    icon: <Users size={15} className="text-violet-700" strokeWidth={2.2} />
  },
  {
    title: "Due Today",
    value: "66",
    // sub: "Follow-ups scheduled for today",
    right: "15,200",
    icon: <Send size={15} className="text-sky-700" strokeWidth={2.2} />
  },
  {
    title: "Over Due",
    value: "16",
    // sub: "Missed follow-ups pending",
    right: "15,200",
    icon: <Users size={15} className="text-violet-700" strokeWidth={2.2} />
  },
  {
    title: "Up Coming",
    value: "2",
    // sub: "Upcoming scheduled follow-ups",
    right: "15,200",
    icon: <Send size={15} className="text-sky-700" strokeWidth={2.2} />
  },
  {
    title: "New Lead",
    value: "4",
    // sub: "Missed follow-up",
    right: "15,200",
    icon: <Send size={15} className="text-sky-700" strokeWidth={2.2} />
  },
  {
    title: "Converted",
    value: "60",
    // sub: "converted leads",
    right: "15,200",
    icon: (
      <TrendingUp size={15} className="text-emerald-700" strokeWidth={2.2} />
    )
  }
]

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
  console.log(selectedCategory)
  const [openModal, setOpenModal] = useState(false)
  const [categorylist, setcategorylist] = useState([])
  const [productlist, setproductList] = useState([])
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedDatapopup, setselectedDataPopup] = useState({})
  const [achievedproducts, setacheivedProducts] = useState([])
  console.log(selectedDatapopup)
  const [cardDisplay, setcardDisplay] = useState([])
  console.log(cardDisplay)
  const [selectedBranch, setselectedBranch] = useState(null)
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
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()))
  // const {data:productandServiceslist}=UseFetch("")
  const { data: followup } = UseFetch("/lead/getfollowupsummaryReport")
  console.log(followup)
  console.log(selectedMonth)
  const { data: target, loading: targetLoading } = UseFetch(
    `/target/gettargetresult?month=${selectedMonth}&year=${selectedYear}`
  )
  console.log(selectedMonth)
  console.log(target)
  const { data: branchProduct } = UseFetch(
    `/product/getallbranchProduct?branch=${selectedBranch}`
  )
  console.log(branchProduct)
  console.log(target)
  console.log(followup)
  // useEffect(() => {
  //   if (branchProduct && branchProduct.length) {
  //     const productorservicenames = branchProduct.map(
  //       (item) => item.serviceName || item.productName
  //     )
  //     setproductList(productorservicenames)
  //     console.log(productorservicenames)
  //   }
  // }, [branchProduct])
  useEffect(() => {
    if (followup && followup.length && user) {
      const filteredleadcounts = followup.filter(
        (item) => item.staffId === user._id
      )
      console.log(filteredleadcounts)
      console.log(statCards)
      const item = filteredleadcounts?.[0]

      if (item) {
        //         setcardDisplay([
        //           {
        //             title: "All Leads",
        // detail:""
        //             value: item.leadCount - item.lost,
        //             right: item.leadAmount,
        //             icon: (
        //               <Users size={15} className="text-violet-700" strokeWidth={2.2} />
        //             )
        //           },
        //           {
        //             title: "Due Today",
        //             value: item.dueToday,
        //             right: item.dueTodayAmount,
        //             icon: <Send size={15} className="text-sky-700" strokeWidth={2.2} />
        //           },
        //           {
        //             title: "Over Due",
        //             value: item.overDue,
        //             right: item.overDueAmount,
        //             icon: (
        //               <Users size={15} className="text-violet-700" strokeWidth={2.2} />
        //             )
        //           },
        //           {
        //             title: "Up Coming",
        //             value: item.future,
        //             right: item.futureAmount,
        //             icon: <Send size={15} className="text-sky-700" strokeWidth={2.2} />
        //           },
        //           {
        //             title: "New Lead",
        //             value: item.neverFollowup,
        //             right: item.neverFollowupAmount,
        //             icon: <Send size={15} className="text-sky-700" strokeWidth={2.2} />
        //           },
        //           {
        //             title: "Converted",
        //             value: item.converted,
        //             right: item.convertedAmount,
        //             icon: (
        //               <TrendingUp
        //                 size={15}
        //                 className="text-emerald-700"
        //                 strokeWidth={2.2}
        //               />
        //             )
        //           }
        //         ])
        setcardDisplay([
          {
            title: "All Leads",
            detail: "Active leads",
            value: item.leadCount - item.lost,
            right: item.leadAmount,
            icon: (
              <Users size={15} className="text-violet-700" strokeWidth={2.2} />
            )
          },
          {
            title: "Due Today",
            detail: "Follow-ups scheduled for today",
            value: item.dueToday,
            right: item.dueTodayAmount,
            icon: <Send size={15} className="text-sky-700" strokeWidth={2.2} />
          },
          {
            title: "Over Due",
            detail: "Pending follow-ups past due date",
            value: item.overDue,
            right: item.overDueAmount,
            icon: (
              <Users size={15} className="text-violet-700" strokeWidth={2.2} />
            )
          },
          {
            title: "Up Coming",
            detail: "Future follow-ups",
            value: item.future,
            right: item.futureAmount,
            icon: <Send size={15} className="text-sky-700" strokeWidth={2.2} />
          },
          {
            title: "New Lead",
            detail: "Leads with no follow-up started",
            value: item.neverFollowup,
            right: item.neverFollowupAmount,
            icon: <Send size={15} className="text-sky-700" strokeWidth={2.2} />
          },
          {
            title: "Converted",
            detail: "Leads successfully closed",
            value: item.converted,
            right: item.convertedAmount,
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
            title: "New Lead",
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
    if (target && target.length) {
      console.log(target)

      const uniqueCategories = [
        ...new Map(
          target
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

      // const respectedtarget=target.filter((item)=>item.userId===user._id).map((item)=>item.categories.filter(item)=>uniqueCategories.map(id)=>id.categoryId===item.categoryId)
      // console.log(respectedtarget)
      const selectedUser = target.find((item) => item.userId === user._id)
      setachievedPoints(selectedUser?.incentive)
      console.log(selectedUser.incentive)
      const updatedCategories = uniqueCategories.map((cat) => {
        const matchedCategory = selectedUser?.categories.find(
          (c) => c.categoryId === cat.categoryId
        )

        return {
          ...cat,
          achievedamount: matchedCategory ? matchedCategory.achieved : 0,
          targetamount: matchedCategory ? matchedCategory.target : 0
        }
      })
      setcategorylist(updatedCategories)

      console.log(updatedCategories)
      console.log(user)

      console.log(uniqueCategories)
    }
  }, [target])
  console.log(categorylist)
  console.log(cardDisplay)

  useEffect(() => {
    const storedUser = getLocalStorageItem("user")
    if (storedUser) {
      setUser(storedUser)
      setselecteduserName(storedUser.name)
      setselectedBranch(storedUser.selected[0].branch_id)
      console.log(storedUser.selected)
      setbranchOptions((prev) => [
        ...prev,
        ...storedUser.selected.map((branch) => ({
          id: branch.branch_id,
          label: branch.branchName
        }))
      ])
    }
  }, [])
  console.log(branchOptions)
  console.log(selectedBranch)
  console.log(user)
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
  console.log(selectedBranch)
  console.log(selectedMonth)
  const handleFollowupCellClick = (header, count) => {
    console.log(header)
    console.log(count)

    if (header === "Lead Count") {
      navigate("/admin/transaction/lead/allLeads", {
        state: { staffId: row.staffId }
      })
    } else if (header === "Due Today" && count > 0) {
      navigate("/admin/transaction/lead/leadFollowUp", {
        state: {
          staffId: user?._id,
          dueToday: true,
          branchId: selectedBranch,
          viewMode: "dueToday",
          from: "followupReport",
          istotal: true,
          filterRange: date
        }
      })
      console.log("hhhhh")
    } else if (header === "Over Due" && count > 0) {
      console.log("hhh")
      console.log(date)
      navigate("/admin/transaction/lead/leadFollowUp", {
        state: {
          staffId: user?._id,
          overdue: true,
          branchId: selectedBranch,
          viewMode: "overDue",
          from: "followupReport",
          istotal: true,
          filterRange: date
        }
      })
    } else if (header === "Up Coming" && count > 0) {
      console.log("hhh")
      navigate("/admin/transaction/lead/leadFollowUp", {
        state: {
          staffId: user?._id,
          future: true,
          branchId: selectedBranch,
          viewMode: "future",
          from: "followupReport",
          istotal: true,
          filterRange: date
        }
      })
    } else if (header === "Converted" && count > 0) {
      console.log("hhhhh")
      navigate("/admin/transaction/lead/leadFollowUp", {
        state: {
          staffId: user?._id,
          converted: true,
          branchId: selectedBranch,
          viewMode: "converted",
          from: "followupReport",
          istotal: true,
          filterRange: date
        }
      })
    } else if (header === "New Lead" && count > 0) {
      console.log("hhhhhh")
      console.log("hhhhh")
      navigate("/admin/transaction/lead/leadFollowUp", {
        state: {
          staffId: user?._id,
          neverfollowup: true,
          branchId: selectedBranch,
          viewMode: "neverfollowup",
          from: "followupReport",
          istotal: true,
          filterRange: date
        }
      })
    } else if (header === "All Leads" && count > 0) {
      console.log(date)
      console.log("hhhh")
      navigate("/staff/transaction/lead/leadFollowUp", {
        state: {
          staffId: user?._id,
          filterRange: date,
          from: "followupReport",
          viewMode: "followup",
          istotal: true,
          header: "Total Leads",
          branchId: selectedBranch
        }
      })
      console.log("hhh")
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
  console.log(target)
  const handleSelectedUser = (category, userId, userName) => {
    console.log(category)
    console.log(userId)
    setselecteduserName(userName)
    setselectedCategory({
      Id: category.Id,
      categoryName: category.categoryName
    })
    console.log(target)
    const filteredloggedUserItem = target.filter(
      (item) => item.userId === userId
    )
    console.log(filteredloggedUserItem)
    const filteredselectedCategory =
      filteredloggedUserItem[0].categories.filter(
        (item) => item.categoryId === category.Id
      )
    console.log(filteredselectedCategory)
    console.log(filteredloggedUserItem)
    setselectedDataPopup(filteredselectedCategory)
    if (filteredselectedCategory && filteredselectedCategory.length) {
      console.log("hh")
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
  console.log(selectedDatapopup)
  const handleMoreClick = (id, name) => {
    console.log(id)
    console.log(id)
    // const filteredproduct=branchProduct.filter((product)=>)
    const filteredList = branchProduct
      .filter(
        (item) =>
          item.selected?.some(
            (selectedItem) => String(selectedItem.category_id) === String(id)
          ) || String(item.category_id) === String(id)
      )
      .map((item) => item.productName || item.serviceName)
    setproductList(filteredList)
    console.log(filteredList)
    setselectedCategory({ Id: id, categoryName: name })
    console.log(target)
    const filteredloggedUserItem = target.filter(
      (item) => item.userId === user._id
    )
    console.log(filteredloggedUserItem)
    const filteredselectedCategory =
      filteredloggedUserItem[0].categories.filter(
        (item) => item.categoryId === id
      )
    console.log(filteredselectedCategory)
    console.log(filteredloggedUserItem)
    setselectedDataPopup(filteredselectedCategory)
    if (filteredselectedCategory && filteredselectedCategory.length) {
      console.log("hh")
      setacheivedProducts((prev) => [
        ...prev,
        ...filteredselectedCategory[0]?.products?.map((product) => ({
          productname: product.name,
          amount: product.achieved
        }))
      ])
    } else {
      setacheivedProducts([])
    }
    console.log("hhh")
    setOpenModal(true)

    console.log(true)
  }
  console.log(achievedproducts)
  console.log(user)
  const total = productData.reduce((acc, item) => acc + item.value, 0)

  let cumulative = 0
  const conicStops = productData
    .map((item) => {
      const start = cumulative
      cumulative += (item.value / total) * 360
      return `${item.color} ${start}deg ${cumulative}deg`
    })
    .join(", ")

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

          <header className="flex items-center justify-between border-b border-slate-200 bg-[#0F172A]/95 py-0.5 ">
            {user?.role?.toLowerCase() === "admin" ? (
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
              <button className="rounded-full p-1.5 transition bg-slate-100">
                <User size={15} strokeWidth={2.2} />
              </button>
            </div>
          </header>

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
            ml-1 max-w-[48px] shrink-0 truncate
            font-medium text-slate-500
            text-[clamp(9px,0.75vw,11px)]
          "
                        title={card.right}
                      >
                        {card.right}
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

                {/* Product Performance */}
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
                      Product Performance
                    </h2>
                    <p
                      className="
          font-medium text-slate-600
          [font-size:clamp(10px,1.4vw,12px)]
        "
                    >
                      Total:{" "}
                      <span className="font-semibold text-slate-900">
                        $88,500
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-3 sm:flex-row xl:flex-col xl:items-start">
                    <div className="flex w-full justify-center">
                      <div
                        className="
            relative h-[110px] w-[110px]
            sm:h-[124px] sm:w-[124px]
            rounded-full
          "
                        style={{
                          background: `conic-gradient(${conicStops})`,
                          boxShadow:
                            "inset 0 10px 12px rgba(255,255,255,0.35), inset 0 -10px 14px rgba(0,0,0,0.18), 0 10px 18px rgba(15,23,42,0.14)"
                        }}
                      >
                        <div
                          className="absolute inset-[15px] rounded-full bg-white"
                          style={{
                            boxShadow:
                              "inset 0 5px 10px rgba(255,255,255,0.95), inset 0 -6px 12px rgba(15,23,42,0.08)"
                          }}
                        />
                        <div
                          className="absolute left-[14%] top-[16%] h-[20%] w-[36%] rounded-full"
                          style={{
                            background:
                              "linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0.04))",
                            filter: "blur(2px)",
                            transform: "rotate(-24deg)"
                          }}
                        />
                      </div>
                    </div>

                    <div className="w-full space-y-2">
                      {productData.map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="h-3 w-3 rounded-sm"
                              style={{
                                background: `linear-gradient(180deg, ${item.color} 0%, ${item.dark} 100%)`,
                                boxShadow:
                                  "inset 0 1px 0 rgba(255,255,255,0.35), 0 1px 2px rgba(15,23,42,0.15)"
                              }}
                            />
                            <span
                              className="
                  font-medium text-slate-700
                  [font-size:clamp(10px,1.4vw,12px)]
                "
                            >
                              {item.label}
                            </span>
                          </div>
                          <span
                            className="
                font-semibold text-slate-800
                [font-size:clamp(10px,1.4vw,12px)]
              "
                          >
                            {item.value}%{" "}
                            <span className="text-emerald-600">↗</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p
                    className="
        mt-2.5 font-medium text-slate-600
        [font-size:clamp(10px,1.4vw,12px)]
      "
                  >
                    Total Revenue:{" "}
                    <span className="font-semibold text-slate-900">
                      $88,500
                    </span>
                  </p>
                </div>
              </div>
              {/*bottom div*/}
              {/* <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
                <div
                  className="min-h-[140px] rounded-xl border border-slate-200/90 bg-white"
                  style={{
                    boxShadow:
                      "0 4px 12px rgba(15,23,42,0.05), inset 0 1px 0 rgba(255,255,255,0.85)"
                  }}
                />
                <div
                  className="min-h-[140px] rounded-xl border border-slate-200/90 bg-white"
                  style={{
                    boxShadow:
                      "0 4px 12px rgba(15,23,42,0.05), inset 0 1px 0 rgba(255,255,255,0.85)"
                  }}
                />
              </div> */}
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
        onMonthChange={(val) => setSelectedMonth(val)}
        onYearChange={(val) => setSelectedYear(val)}
        productlist={productlist}
        onClose={() => {
          console.log("hhhh")
          setselecteduserName(user?.name)
          setacheivedProducts([])
          setOpenModal(false)
        }}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        summary={{
          target: selectedDatapopup?.[0]?.target,
          achieved: selectedDatapopup?.[0]?.achieved,
          balance:
            selectedDatapopup?.[0]?.achieved > selectedDatapopup?.[0]?.target
              ? 0
              : selectedDatapopup?.[0]?.balance
        }}
        products={achievedproducts}
        targetData={target}
        loggedUser={user}
        selectedUser={selectedUserName}
        category={selectedCategory}
        handleSelectedUser={handleSelectedUser}
      />
    </div>
  )
}

export default MarketingDashboard
