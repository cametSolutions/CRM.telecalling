// FollowupSummaryDashboard.jsx
import { useState, useEffect } from "react"
import ReportTable from "../../../components/primaryUser/ReportTable"
import UseFetch from "../../../hooks/useFetch"
import { getLocalStorageItem } from "../../../helper/localstorage"
import { useNavigate } from "react-router-dom"
import { PerformanceModal } from "../../../components/primaryUser/PerformanceModal"
import { StaticSidebar } from "../../../components/primaryUser/StaticSidebar"
import AdminHeader from "../../../header/AdminHeader"
import StaffHeader from "../../../header/StaffHeader"
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
export default function FollowupSummaryDashboard() {
  const navigate = useNavigate()

  const [date, setdate] = useState({
    startDate: "",
    endDate: ""
  })
  const [data, setData] = useState([])
  const [selectedBranch, setselectedBranch] = useState(null)
  const [userbranches, setuserBranches] = useState([])
  const [selectedUserName, setselecteduserName] = useState(null)
  const [selectedCategory, setselectedCategory] = useState(null)
  const [selectedDatapopup, setselectedDataPopup] = useState({})
const now=new Date()
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()))
  const [periodMode, setperiodMode] = useState("all")
  const [loggedUser, setloggedUser] = useState(null)
  const [targetData, settargetData] = useState([])
const [activeUserId, setActiveUserId] = useState(null)
  console.log(targetData)
  const [openModal, setOpenModal] = useState(false)
  const [productlist, setproductList] = useState([])
  const [achievedproducts, setacheivedProducts] = useState([])
  const [selectedPeriod, setselectedPeriod] = useState("")
  const { data: followup } = UseFetch(
    date.startDate &&
      date.endDate &&
      selectedBranch &&
      `/lead/getfollowupsummaryReport?startDate=${date.startDate}&endDate=${date.endDate}&branchId=${selectedBranch}`
  )
  const { data: branchProduct } = UseFetch(
    selectedBranch && `/product/getallbranchProduct?branch=${selectedBranch}`
  )
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
  console.log(followup)
  // set end of current month once
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
  console.log(date)

  // branches
  useEffect(() => {
    const userData = getLocalStorageItem("user")
    if (!userData?.selected?.length) return
    setloggedUser(userData)
    setselectedBranch(userData.selected[0]?.branch_id)
    const branches = userData.selected.map((branch) => ({
      id: branch.branch_id,
      branchName: branch.branchName
    }))
    setuserBranches(branches)
  }, [])

  // followup data
  useEffect(() => {
    if (followup) {
      console.log(followup)
      const filteredbranchwisedata = followup.filter((item) =>
        item.branchIds.includes(selectedBranch)
      )
      console.log(filteredbranchwisedata)

      setData(filteredbranchwisedata)
    }
  }, [followup])
  console.log(data)
  const headersName = [
    "Staff",
    "Total Leads",
    "Due Today",
    "Overdue",
    "Upcoming",
    "New Lead",
    "Converted",
    "Lost",
    "Conversion %"
  ]

  const handleStartChange = (value) => {
    setdate((prev) => ({ ...prev, startDate: value }))
  }

  const handleEndChange = (value) => {
    setdate((prev) => ({ ...prev, endDate: value }))
  }
  console.log(date)
  console.log("hhhh")
  // navigation logic for metric cells
  const handleMetricClick = (row, header, key) => {
    // row has: staffName, leadCount, dueToday, overDue, future, converted, lost, leadid[]
    const staffName = row.staffName
    console.log("hh")
    if (header === "Lost") {
      navigate("/lostleads", {
        state: {
          staffName,
          branchId: selectedBranch,
          startDate: date.startDate,
          endDate: date.endDate,
          count: row[key],
          leadIds: row.leadid
        }
      })
      return
    } else {
      console.log("hhhh")
      // all others go to followup page
      navigate("/leadfollowup", {
        state: {
          staffName,
          branchId: selectedBranch,
          startDate: date.startDate,
          endDate: date.endDate,
          type: header, // "Total Leads", "Due Today", etc.
          count: row[key],
          leadIds: row.leadid
        }
      })
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
      // setacheivedProducts(
      //   filteredselectedCategory[0]?.products?.map((product) => ({
      //     productname: product.name,
      //     amount: product.achieved
      //   })) || []
      // )
 setacheivedProducts(
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
  const handleFollowupCellClick = ({ row, header }) => {
    console.log(header)
    console.log(row)
    if (header === "Staff") return
    if (header === "Conversion %") return

    if (header === "Lost") {
      console.log("jjj")
      navigate("/admin/transaction/lead/lostLeads", {
        state: {
          staffId: row.staffId,
          productId: row.productId,
          branchId: row?.branchIds?.[0],
          viewMode: "lostlead"
        }
      })
    } else if (header === "Lead Count") {
      navigate("/admin/transaction/lead/allLeads", {
        state: { staffId: row.staffId }
      })
    } else if (header === "Due Today") {
      console.log(date)
      navigate("/admin/transaction/lead/leadFollowUp", {
        state: {
          staffId: row.staffId,
          dueToday: true,
          branchId: row.branchIds?.[0],
          viewMode: "dueToday",
          from: "followupReport",
          istotal: true,
          filterRange: date
        }
      })
      console.log("hhhhh")
    } else if (header === "Overdue") {
      console.log("hhh")
      console.log(date)
      navigate("/admin/transaction/lead/leadFollowUp", {
        state: {
          staffId: row.staffId,
          overdue: true,
          branchId: row.branchIds?.[0],
          viewMode: "overDue",
          from: "followupReport",
          istotal: true,
          filterRange: date
        }
      })
    } else if (header === "Future") {
      console.log("hhh")
      navigate("/admin/transaction/lead/leadFollowUp", {
        state: {
          staffId: row.staffId,
          future: true,
          branchId: row.branchIds?.[0],
          viewMode: "future",
          from: "followupReport",
          istotal: true,
          filterRange: date
        }
      })
    } else if (header === "Converted") {
      console.log("hhhhh")
      navigate("/admin/transaction/lead/leadFollowUp", {
        state: {
          staffId: row.staffId,
          converted: true,
          branchId: row.branchIds?.[0],
          viewMode: "converted",
          from: "followupReport",
          istotal: true,
          filterRange: date
        }
      })
    } else if (header === "Never Follow Up") {
      console.log("hhhhhh")
      console.log("hhhhh")
      navigate("/admin/transaction/lead/leadFollowUp", {
        state: {
          staffId: row.staffId,
          neverfollowup: true,
          branchId: row.branchIds?.[0],
          viewMode: "neverfollowup",
          from: "followupReport",
          istotal: true,
          filterRange: date
        }
      })
    } else if (header === "Total Leads") {
      console.log(date)
      console.log("hhhh")
      navigate("/admin/transaction/lead/leadFollowUp", {
        state: {
          staffId: row.staffId,
          filterRange: date,
          from: "followupReport",
          viewMode: "followup",
          istotal: true,
          header: "Total Leads",
          branchId: row.branchIds?.[0]
        }
      })
      console.log("hhh")
    }
  }

  const handleStaffClick = (row) => {
    // you can later use this for staff drill-down if needed
    // example:
    // navigate("/staff-followup-summary", { state: { staffName: row.staffName, ... } });
  }

  return (
    <div className="h-full bg-[#ADD8E6] ">
      <div className="flex h-full flex-row">
        <StaticSidebar
          handleMoreClick={handleMoreClick}
          selectedCompanyBranch={selectedBranch}
          setselectedCompanyBranch={setselectedBranch}
          parenttargetData={settargetData}
          parentperiodmode={periodMode}
          parentyear={selectedYear}
          setselectedPeriod={setselectedPeriod}
        />
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex items-center justify-between bg-[#ADD8E6]">
            {loggedUser?.role?.toLowerCase() === "admin" ? (
              <AdminHeader hide={true} />
            ) : (
              <StaffHeader hide={true} />
            )}

            <div className="flex items-center gap-1.5  bg-[#ADD8E6] pr-3 h-full">
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
          {/* Top bar */}
          <div className="px-4 md:px-6 py-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              {/* Title */}
              <h1 className="text-lg md:text-xl font-bold text-gray-900">
                Follow‑Up Summary Report
              </h1>

              <div className="flex flex-wrap items-center gap-3 md:gap-4">
                {/* Branch select */}
                {/* <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Branch
                  </label>

                  <div className="relative inline-flex items-center">
                    <select
                      value={selectedBranch || ""}
                      onChange={(e) => setselectedBranch(e.target.value)}
                      className="h-9 min-w-[180px] rounded-md border border-slate-200 bg-white pr-9 pl-3 text-xs font-medium text-slate-800 shadow-sm
                 outline-none transition-colors duration-150
                 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
                 hover:border-slate-300 cursor-pointer appearance-none"
                    >
                      {userbranches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.branchName}
                        </option>
                      ))}
                    </select>

                    <span className="pointer-events-none absolute right-2.5 text-slate-400">
                      <svg
                        className="h-3.5 w-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        strokeWidth="1.8"
                        stroke="currentColor"
                      >
                        <path
                          d="M7 10l5 5 5-5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </div> */}

                {/* Date range */}
                <div className="inline-flex items-center gap-3 rounded-xl bg-white px-3 py-2 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-2 pr-3 border-r border-slate-200">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-slate-500">
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        strokeWidth="1.7"
                        stroke="currentColor"
                      >
                        <rect x="3" y="4" width="18" height="17" rx="2" />
                        <path d="M8 3v3M16 3v3M3 10h18" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                        Date Range
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Filter reports by period
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-slate-500">
                      From
                    </span>
                    <input
                      type="date"
                      value={date.startDate}
                      onChange={(e) => handleStartChange(e.target.value)}
                      className="h-8 rounded-md border border-slate-200 bg-slate-50 px-2 text-xs text-slate-800
                 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-slate-500">
                      To
                    </span>
                    <input
                      type="date"
                      value={date.endDate}
                      onChange={(e) => handleEndChange(e.target.value)}
                      className="h-8 rounded-md border border-slate-200 bg-slate-50 px-2 text-xs text-slate-800
                 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Table wrapper */}
          <div className="flex-1 overflow-hidden mb-3 mx-3">
            <ReportTable
              headers={headersName}
              reportName="Follow-Up Summary"
              data={data}
              onStaffClick={handleStaffClick}
              onMetricClick={handleMetricClick}
              onCellClick={handleFollowupCellClick}
            />
          </div>
        </div>
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
