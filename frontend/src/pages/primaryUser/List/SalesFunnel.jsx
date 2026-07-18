import { useState, useEffect } from "react"
import ReportTable from "../../../components/primaryUser/ReportTable"
import UseFetch from "../../../hooks/useFetch"
import { MonthRangePicker } from "../../../components/primaryUser/MonthRangePicker"
import { Navigate, useNavigate } from "react-router-dom"
import { PerformanceModal } from "../../../components/primaryUser/PerformanceModal"
import { StaticSidebar } from "../../../components/primaryUser/StaticSidebar"
import AdminHeader from "../../../header/AdminHeader"
import StaffHeader from "../../../header/StaffHeader"
import { useLocation } from "react-router-dom"
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
export default function SalesFunnel() {
  const [date, setdate] = useState({
    startDate: "",
    endDate: ""
  })
  const [filterRange, setFilterRange] = useState({
    startDate: null,
    endDate: null,
    startMonth: "",
    endMonth: "",
    firstDay: null,
    lastDay: null
  })
  const [data, setData] = useState([])
  const [loggedUser, setloggedUser] = useState(null)
  const [selectedcompanyBranch, setselectedCompanyBranch] = useState(null)
  const [selectedUserName, setselecteduserName] = useState(null)
  const [selectedCategory, setselectedCategory] = useState(null)
  const [selectedDatapopup, setselectedDataPopup] = useState({})
const now=new Date()
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()))
  const [periodMode, setperiodMode] = useState("all")
  const [targetData, settargetData] = useState([])
  console.log(targetData)
  const [openModal, setOpenModal] = useState(false)
  const [productlist, setproductList] = useState([])
  const [achievedproducts, setacheivedProducts] = useState([])
  const [selectedPeriod, setselectedPeriod] = useState("")
  const [activeUserId, setActiveUserId] = useState(null)
  const navigate = useNavigate()
  console.log(date.startDate)
  console.log(date.endDate)
  console.log(filterRange.firstDay)
  console.log(filterRange.lastDay)
  const { data: salesfunnel } = UseFetch(
    filterRange.firstDay &&
      filterRange.lastDay &&
      `/lead/getsalesfunnels?startDate=${filterRange.firstDay}&endDate=${filterRange.lastDay}`
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
  useEffect(() => {
    const userData = getLocalStorageItem("user")
    console.log(userData)
    setloggedUser(userData)
    setselectedCompanyBranch(userData.selected[0].branch_id)
  }, [])
  const { data: branchProduct } = UseFetch(
    `/product/getallbranchProduct?branch=${selectedcompanyBranch}`
  )
  console.log(salesfunnel)
  // const { data: followup } = UseFetch(
  //   date.startDate &&
  //     date.endDate &&
  //     `/lead/getallproductwisereport?startDate=${filterRange.firstDay}&endDate=${filterRange.lastDay}`
  // )
  useEffect(() => {
    const endDate = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0
    ).toLocaleDateString("en-CA")
    const startDate = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    ).toLocaleDateString("en-CA")

    console.log(startDate)

    setdate((prev) => ({
      ...prev,
      startDate,
      endDate
    }))
    console.log(new Date())
    console.log(date)
    console.log(endDate)
  }, [])

  useEffect(() => {
    if (salesfunnel) {
      console.log(salesfunnel)
      setData(salesfunnel)
    }
  }, [salesfunnel])
  console.log(date)
  console.log(data)
  const headersName = ["Stage", "Count", "Value", "Conversion %"]
  const handleDateRange = (range) => {
    setFilterRange(range)
    console.log("Filter range:", range)
    // Fetch data from your Node.js API: /api/leads?start=${range.startDate}&end=${range.endDate}
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
  const handleTotalLeadsClick = (row, header) => {
    console.log(row)
    console.log(header)
    const stage = row.stage
    console.log(stage)
    console.log(row.count)

    // Only navigate for Converted when its count > 0
    if (row.stage === "New Leads" && row.count <= 0) {
      return
    }

    // You can add similar guards for other headers if needed
    if (row.stage === "Contacted" && row.count <= 0) {
      return
    }
    if (row.stage === "System Study" && row.count <= 0) {
      return
    }
    if (row.stage === "Lost" && row.count <= 0) {
      return
    }
    if (row.stage === "Converted" && row.count <= 0) {
      return
    }
    if (stage === "New Leads") {
      navigate("/admin/transaction/lead/ownedLeadlist", {
        state: {
          role: "Admin"
        }
      })
    } else if (stage === "Contacted") {
      navigate("/admin/transaction/lead/leadFollowUp", {
        state: { pending: true }
      })
    }
  }
  console.log("jjjjjd")
  return (
    // <div className="h-full bg-gray-100">
    //   <MonthRangePicker onChange={handleDateRange} />

    //   <ReportTable
    //     headers={headersName}
    //     reportName="Sales Funnel"
    //     data={data}
    //   />
    // </div>
    <div className="h-full bg-[#ADD8E6] overflow-hidden">
      <div className="h-full flex flex-row">
        {/* <StaticSidebar
          handleMoreClick={handleMoreClick}
          selectedCompanyBranch={selectedcompanyBranch}
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
              <button className="rounded-full p-1.5 transition bg-slate-100">
                <User size={15} strokeWidth={2.2} />
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
          <div className="flex flex-col">
            {/* Top bar */}
            <div className="px-4 md:px-6 py-3">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                {/* Title */}
                <h1 className="text-lg md:text-xl font-bold text-gray-900">
                  Sales Funnel
                </h1>

                {/* Date range */}
                <div className="flex items-center">
                  <div className="bg-white rounded-lg px-3 py-1.5 shadow-sm border border-gray-200">
                    <MonthRangePicker onChange={handleDateRange} />
                  </div>
                </div>
              </div>
            </div>

            {/* Table wrapper */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full px-3 md:px-6 pb-4">
                <div className="h-full bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                  <ReportTable
                    headers={headersName}
                    reportName="Sales Funnel"
                    data={data}
                    onTotalLeadsClick={handleTotalLeadsClick}
                  />
                </div>
              </div>
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
