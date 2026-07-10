

import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import ReportTable from "../../../components/primaryUser/ReportTable"
import { MonthRangePicker } from "../../../components/primaryUser/MonthRangePicker"
import UseFetch from "../../../hooks/useFetch"
import { PerformanceModal } from "../../../components/primaryUser/PerformanceModal"
import { StaticSidebar } from "../../../components/primaryUser/StaticSidebar"
import AdminHeader from "../../../header/AdminHeader"
import StaffHeader from "../../../header/StaffHeader"
import SkeletonTable from "../../../components/loader/SkeletonTable"
import NodataAvailable from "../../../components/NodataAvailable"
import { getLocalStorageItem } from "../../../helper/localstorage"
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
import api from "../../../api/api"
import { useQuery } from "@tanstack/react-query"
import { useLocation } from "react-router-dom"
import Breadcrumb from "../../../components/common/Breadcrumb"
import { loggeduserBranches } from "../../../../slices/companyBranchSlice"
export default function ProductWiseleadReport() {
  const location = useLocation()
  console.log(location?.state)
  const [filterRange, setFilterRange] = useState({
    startDate: null,
    endDate: null,
    startMonth: "",
    endMonth: "",
    firstDay: null,
    lastDay: null
  })
  console.log(filterRange)
  const [data, setData] = useState([])
  const [viewMode, setViewMode] = useState("staff") // "staff" | "product"
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [drillDown, setDrillDown] = useState(false)
  const [activeUserId, setActiveUserId] = useState(null)
  const [userbranches, setuserBranches] = useState([])
  const [selectedBranch, setselectedBranch] = useState(null)
  const [selectedUserName, setselecteduserName] = useState(null)
  const [selectedCategory, setselectedCategory] = useState(null)
  const [selectedDatapopup, setselectedDataPopup] = useState({})
  const now = new Date()
const [range,setrange]=useState(location?.state?.filterRange?location?.state?.filterRange:null)
console.log(range)
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()))
  const [periodMode, setperiodMode] = useState("all")
  const [targetData, settargetData] = useState([])
  console.log(targetData)
  const [openModal, setOpenModal] = useState(false)
  const [productlist, setproductList] = useState([])
  const [achievedproducts, setacheivedProducts] = useState([])
  const [selectedPeriod, setselectedPeriod] = useState("")
  const [loggeduser, setloggeduser] = useState(null)
  const navigate = useNavigate()

  // Get logged user branches from localStorage
  useEffect(() => {
    const userData = getLocalStorageItem("user")
    setloggeduser(userData)
    if (!userData?.selected?.length) return
    if (location?.state) {
      console.log("hh")
      setselectedBranch(location?.state?.selectedBranch)
    } else {
      setselectedBranch(userData.selected[0]?.branch_id)
    }

    const branches = userData.selected.map((branch) => ({
      id: branch.branch_id,
      branchName: branch.branchName
    }))
    setuserBranches(branches)
  }, [])
  console.log("Hhhh")
  // API call – includes branchId and date range
  // const { data: report, loading } = UseFetch(
  //   filterRange.firstDay &&
  //     filterRange.lastDay &&
  //     selectedBranch &&
  //     `/lead/getallproductwisereport?startDate=${filterRange.firstDay}&endDate=${filterRange.lastDay}&branchId=${selectedBranch}`
  // )
console.log(filterRange)
  const { data: report, isLoading: loading } = useQuery({
    queryKey: [
      "productWiseReport",
      selectedBranch,
      filterRange.firstDay,
      filterRange.lastDay
    ],

    enabled:
      !!selectedBranch && !!filterRange.firstDay && !!filterRange.lastDay,

    queryFn: async () => {
console.log("query")
      const response = await api.get(`/lead/getallproductwisereport`, {
        params: {
          startDate: filterRange.firstDay,
          endDate: filterRange.lastDay,
          branchId: selectedBranch
        }
      })
console.log("response.data",response.data.data)
      return response.data.data
    },

    staleTime: 1000 * 60 * 5 // 5 minutes
  })
console.log(selectedBranch)
  console.log(report)
  console.log(filterRange.lastDay)
  console.log(filterRange.firstDay)
  // const { data: branchProduct } = UseFetch(
  //   `/product/getallbranchProduct?branch=${selectedBranch}`
  // )
  const { data: branchProduct = [] } = useQuery({
    queryKey: ["branchProducts", selectedBranch],

    enabled: !!selectedBranch,

    queryFn: async () => {
      const response = await api.get(`/product/getallbranchProduct`, {
        params: {
          branch: selectedBranch
        }
      })

      return response.data
    },
    staleTime: 1000 * 60 * 5 // 5 minutes
  })
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
  console.log(report?.re)
  // Aggregate staff data when report or branch changes
  useEffect(() => {
    if (!report || !selectedBranch) return

    const rows = Array.isArray(report.re) ? report.re : []
    const staffMap = {}
    console.log(rows)
    rows.forEach((row) => {
      if (String(row.branch) !== String(selectedBranch)) return
      const staffKey = row.staffId
      if (!staffKey) return

      if (!staffMap[staffKey]) {
        staffMap[staffKey] = {
          staffId: row.staffId,
          staffRole: row.staffRole,
          productId: null,
          branchId: row.branch,
          Staff: row.staffName,
          Product: "",
          totalLeads: 0,
          totalConverted: 0,
          totalLost: 0,
          totalPending: 0,
          totalNetAmount: 0,
          totalConvertedAmount: 0,
          totalLostAmount: 0,
          totalPendingAmount: 0
        }
      }

      staffMap[staffKey].totalLeads += Number(row.leadCount || 0)
      staffMap[staffKey].totalConverted += Number(row.totalConverted || 0)
      staffMap[staffKey].totalLost += Number(row.totalLost || 0)
      staffMap[staffKey].totalPending += Number(row.totalPending || 0)
      staffMap[staffKey].totalNetAmount += Number(row.totalNetAmount || 0)
      staffMap[staffKey].totalConvertedAmount += Number(
        row.convertedNetAmount || 0
      )
      staffMap[staffKey].totalLostAmount += Number(row.lostNetAmount || 0)
      staffMap[staffKey].totalPendingAmount += Number(row.pendingNetAmount || 0)
    })
    console.log(Object.values(staffMap))
    setData(Object.values(staffMap))
    setSelectedStaff(null)
    setDrillDown(false)
    setViewMode("staff")
  }, [report, selectedBranch])

  const headersName = [
    "staffId",
    "productId",
    "branchId",
    "staffRole",
    "Staff",
    "Product",
    "Total Leads",
    "Converted",
    "Lost",
    "Pending"
  ]
  console.log(filterRange)
  const handleDateRange = (range) => {
    console.log(range)
console.log(range?.firstDay)
console.log(location?.state?.filterRange?.firstDay)
    console.log(location?.state)
    if (location?.state&&!location?.state?.change) {
      setFilterRange(location?.state?.filterRange)
    } else {
console.log("hhhhh")
      setFilterRange(range)
    }
  }

  const formattedRange = useMemo(() => {
    if (!filterRange.startMonth || !filterRange.endMonth) return ""
    return `${filterRange.startMonth} – ${filterRange.endMonth}`
  }, [filterRange.startMonth, filterRange.endMonth])

  // Handle staff click - drill down to product view
  const handleStaffClick = (staffName) => {
    if (!report) return
    console.log("hh")
    const rows = Array.isArray(report.mappeddata) ? report.mappeddata : []

    setSelectedStaff(staffName)
    setDrillDown(true)
    setViewMode("product")

    const filtered = rows.filter(
      (row) => row?.staffName?.toLowerCase() === staffName.toLowerCase()
    )
    console.log(filtered)
    const mapped = filtered.map((row) => ({
      staffId: row.staffId,
      productId: row.productId,
      branchId: row.branch,
      staffRole: row.staffRole,
      Staff: row.staffName,
      Product: row.productName,
      totalLeads: Number(row.leadCount || 0),
      totalConverted: Number(row.totalConverted || 0),
      totalLost: Number(row.totalLost || 0),
      totalPending: Number(row.totalPending || 0),
      totalNetAmount: Number(row.totalNetAmount || 0),
      totalConvertedAmount: Number(row.convertedNetAmount || 0),
      totalLostAmount: Number(row.lostNetAmount || 0),
      totalPendingAmount: Number(row.totalPendingAmount || 0)
    }))

    setData(mapped)
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
    console.log(loggeduser?._id)

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
      setacheivedProducts(
        filteredselectedCategory[0]?.products?.map((product) => ({
          productname: product.name,
          amount: product.achieved
        })) || []
      )
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

  // Handle "See All" - return to staff aggregated view
  const handleSeeAll = () => {
    setSelectedStaff(null)
    setDrillDown(false)
    setViewMode("staff")

    if (!report) {
      setData([])
      return
    }

    const rows = Array.isArray(report.re) ? report.re : []
    const staffMap = {}

    rows.forEach((row) => {
      if (String(row.branch) !== String(selectedBranch)) return
      const staffKey = row.staffId
      if (!staffKey) return

      if (!staffMap[staffKey]) {
        staffMap[staffKey] = {
          staffId: row.staffId,
          staffRole: row.staffRole,
          productId: null,
          branchId: row.branch,
          Staff: row.staffName,
          Product: "",
          totalLeads: 0,
          totalConverted: 0,
          totalLost: 0,
          totalPending: 0,
          totalNetAmount: 0,
          totalConvertedAmount: 0,
          totalLostAmount: 0,
          totalPendingAmount: 0
        }
      }

      staffMap[staffKey].totalLeads += Number(row.leadCount || 0)
      staffMap[staffKey].totalConverted += Number(row.totalConverted || 0)
      staffMap[staffKey].totalLost += Number(row.totalLost || 0)
      staffMap[staffKey].totalPending += Number(row.totalPending || 0)
      staffMap[staffKey].totalNetAmount += Number(row.totalNetAmount || 0)
      staffMap[staffKey].totalConvertedAmount += Number(
        row.convertedNetAmount || 0
      )
      staffMap[staffKey].totalLostAmount += Number(row.lostNetAmount || 0)
      staffMap[staffKey].totalPendingAmount += Number(
        row.totalPendingAmount || 0
      )
    })

    setData(Object.values(staffMap))
  }

  // Handle toggle switch to Product view (without drill-down)
  const handleProductToggle = () => {
    if (!report) return

    setSelectedStaff(null)
    setDrillDown(false)
    setViewMode("product")
    console.log("hhhh")
    console.log(report.mappeddata)
    const rows = Array.isArray(report.mappeddata) ? report.mappeddata : []

    // Filter by selected branch and map to product view
    const productData = rows
      .filter((row) => String(row.branch) === String(selectedBranch))
      .map((row) => ({
        staffId: row.staffId,
        productId: row.productId,
        branchId: row.branch,
        staffRole: row.staffRole,
        Staff: row.staffName,
        Product: row.productName,
        totalLeads: Number(row.leadCount || 0),
        totalConverted: Number(row.totalConverted || 0),
        totalLost: Number(row.totalLost || 0),
        totalPending: Number(row.totalPending || 0),
        totalNetAmount: Number(row.totalNetAmount || 0),
        totalConvertedAmount: Number(row.convertedNetAmount || 0),
        totalLostAmount: Number(row.lostNetAmount || 0),
        totalPendingAmount: Number(row.totalPendingAmount || 0)
      }))

    setData(productData)
  }

  const handleTotalLeadsClick = (row, header) => {
    console.log(viewMode)
    console.log("hhh")
    // Only navigate when there is positive count
    if (header === "Converted" && row.totalConverted <= 0) return
    if (header === "Pending" && row.totalPending <= 0) return
    if (header === "Lost" && row.totalLost <= 0) return

    if (header === "Lost") {
      navigate("/admin/transaction/lead/lostLeads", {
        state: {
          staffId: row.staffId,
          productId: row.productId,
          branchId: row.branchId
        }
      })
    } else {
      console.log(headersName)
      console.log(row)
      console.log()
      console.log(header)
      console.log(
        header === "Pending" ||
          (row.totalPending > 0 && header !== "Converted") ||
          !row.totalConverted > 0
      )
      console.log(filterRange)
      console.log(!row.totalConverted > 0)
      console.log(row.staffId)
      console.log(loggeduser?._id)
      const viewdate = true
      const breadcrumb = [
        { label: "Report", path: "", state: "" },
        {
          label: "Product-wise-lead-Report",
          path: "/admin/reports/product-wise-report",
          state: { filterRange, selectedBranch,change:true }
        },
        { label: "Lead Follow-Up", path: "" }
      ]
      navigate("/admin/transaction/lead/leadFollowUp", {
        state: {
          staffId: row.staffId,
          pending:
            header === "Pending" ||
            (row.totalPending > 0 && header !== "Converted") ||
            !row.totalConverted > 0,
          productId: row.productId,
          ownfollowup: row.staffId === loggeduser?._id,
          branchId: row.branchId,
          viewMode,
          header,
          istotal: !drillDown,
          staffRole: row.staffRole,
          filterRange,
          viewdate,

          breadcrumb
        }
      })
    }
  }

  const effectiveData = data
  console.log(data)
  console.log(loggeduser)
  return (
    <div className="h-full bg-[#ADD8E6]">
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
            {loggeduser?.role?.toLowerCase() === "admin" ? (
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
          {/* MAIN CONTAINER */}
          <div className="h-full flex flex-col overflow-hidden">
            {/* ================= HEADER ================= */}
            <Breadcrumb
              items={[
                { label: "Reports", path: "" },
                { label: "Product Wise Report" }
              ]}
            />
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-2 px-3">
              {/* LEFT: TITLE */}
              <div className="flex flex-col gap-1">
                <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
                  Product-Wise Lead Report
                </h1>

                {formattedRange && (
                  <p className="text-xs text-gray-500">
                    Period{" "}
                    <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
                      {formattedRange}
                    </span>
                  </p>
                )}
              </div>

              {/* RIGHT CONTROLS */}
              <div className="flex flex-wrap items-end gap-4">
                {/* Toggle */}
                <div className="flex items-center bg-gray-100 rounded-full p-1 text-xs font-medium">
                  <button
                    onClick={handleSeeAll}
                    className={`px-4 py-1.5 rounded-full transition-all ${
                      viewMode === "staff"
                        ? "bg-blue-600 text-white shadow"
                        : "text-gray-600 hover:text-black"
                    }`}
                  >
                    Staff
                  </button>

                  <button
                    onClick={handleProductToggle}
                    className={`px-4 py-1.5 rounded-full transition-all ${
                      viewMode === "product"
                        ? "bg-blue-600 text-white shadow"
                        : "text-gray-600 hover:text-black"
                    }`}
                  >
                    Product
                  </button>
                </div>

                {/* Date Picker */}
                <div className="bg-white rounded-lg px-3 py-2 border border-gray-200 shadow-sm">
                  <MonthRangePicker onChange={handleDateRange} range={range}/>
                </div>
              </div>
            </div>

            {/* ================= CONTENT ================= */}

            <div className="flex-1 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden mx-3">
              {loading ? (
                <SkeletonTable rows={8} />
              ) : effectiveData.length === 0 ? (
                <NodataAvailable />
              ) : (
                <ReportTable
                  headers={headersName}
                  reportName="Product-Wise Lead Report"
                  data={effectiveData}
                  mode={viewMode}
                  selectedStaff={selectedStaff}
                  drillDown={drillDown}
                  onStaffClick={handleStaffClick}
                  onSeeAll={handleSeeAll}
                  onTotalLeadsClick={handleTotalLeadsClick}
                />
              )}
            </div>
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
          loggedUser={loggeduser}
          selectedUser={selectedUserName}
          category={selectedCategory}
          handleSelectedUser={handleSelectedUser}
          activeUserId={activeUserId}
        />
      </div>
    </div>
  )
}
