import { useState, useEffect } from "react"
import ReportTable from "../../../components/primaryUser/ReportTable"
import UseFetch from "../../../hooks/useFetch"
import { MonthRangePicker } from "../../../components/primaryUser/MonthRangePicker"
import { setDate } from "date-fns"
import { StaticSidebar } from "../../../components/primaryUser/StaticSidebar"
import AdminHeader from "../../../header/AdminHeader"
import StaffHeader from "../../../header/StaffHeader"
import { getLocalStorageItem } from "../../../helper/localstorage"
import { PerformanceModal } from "../../../components/primaryUser/PerformanceModal"
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
export default function DailyStaffActivity() {
  const [date, setdate] = useState({
    startDate: "",
    endDate: ""
  })
  const [headerNames, setheadersName] = useState([])
  const [filterRange, setFilterRange] = useState({
    startDate: null,
    endDate: null,
    startMonth: "",
    endMonth: "",
    firstDay: null,
    lastDay: null
  })
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
  const [data, setData] = useState([])
  const [selectedcompanyBranch, setselectedcompanyBranch] = useState(null)
  const [loggedUser, setloggedUser] = useState(null)

  const { data: task } = UseFetch("/lead/getalltasktoreport")
  console.log(date)
  console.log(filterRange)
  const { data: dailyreport } = UseFetch(
    date.startDate &&
      date.endDate &&
      `/lead/getstaffdailyreports?startDate=${date.startDate}&endDate=${date.endDate}&selectedBranch=${selectedcompanyBranch}`
  )
  console.log(dailyreport)
  const { data: branchProduct } = UseFetch(
    `/product/getallbranchProduct?branch=${selectedcompanyBranch}`
  )

  useEffect(() => {
    const userData = getLocalStorageItem("user")
    setselectedcompanyBranch(userData.selected[0].branch_id)
    setloggedUser(userData)
    const today = new Date()

    const formatDate = (date) => date.toISOString().split("T")[0]

    setdate((prev) => ({
      ...prev,
      startDate: formatDate(today),
      endDate: formatDate(today)
    }))
  }, [])
  useEffect(() => {
    if (dailyreport) {
      console.log(dailyreport)
      setData(dailyreport)

      const headers = [
        ...new Set(dailyreport.flatMap((item) => Object.keys(item)))
      ]
      if (headers.length === 0) {
        console.log("hhh")
        console.log(task)
        const tasknames = task.map((item) => item.taskName)
        console.log(tasknames)
        const defaultname = ["Date", "Staff", "New Leads", "Calls"]
        const addup = [...defaultname, ...tasknames]
        // const defaultdata=[{
        // data:0,
        // staff:}]
        setheadersName(addup)
      } else {
        console.log(headers)
        setheadersName(headers)
      }
    }
  }, [dailyreport])
  // const headersName = ["Date", "Staff", "New Leads", "Calls"]
  const handleDateRange = (range) => {
    setFilterRange(range)
    console.log("Filter range:", range)
    // Fetch data from your Node.js API: /api/leads?start=${range.startDate}&end=${range.endDate}
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
  return (
    // <div className="h-full bg-[#ADD8E6] overflow-hidden">
    //   <div className="flex h-full flex-row">
    //     <StaticSidebar
    //       handleMoreClick={handleMoreClick}
    //       selectedCompanyBranch={selectedcompanyBranch}
    //       setselectedCompanyBranch={setselectedcompanyBranch}
    //       parenttargetData={settargetData}
    //       parentperiodmode={setperiodMode}
    //       parentyear={setSelectedYear}
    //       setselectedPeriod={setselectedPeriod}
    //     />
    //     <div className="flex flex-1 flex-col overflow-hidden">
    //       <header className="flex items-center justify-between border-b border-white/10 bg-[#0F172A]/95">
    //         {loggedUser?.role?.toLowerCase() === "admin" ? (
    //           <AdminHeader hide={true} />
    //         ) : (
    //           <StaffHeader hide={true} />
    //         )}

    //         <div className="flex items-center gap-1.5  border-b border-white/10 bg-[#0F172A]/95 pr-3 h-full">
    //           <button className="rounded-full p-1.5 transition bg-slate-100">
    //             <Mail size={15} strokeWidth={2.2} />
    //           </button>
    //           <div className="relative">
    //             <button className="rounded-full p-1.5 transition bg-slate-100">
    //               <MessageSquareText size={15} strokeWidth={2.2} />
    //             </button>
    //             <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-500" />
    //           </div>
    //           <button className="rounded-full p-1.5 transition bg-slate-100">
    //             <Settings size={15} strokeWidth={2.2} />
    //           </button>
    //           {/* <button className="rounded-full p-1.5 transition bg-slate-100">
    //             <User size={15} strokeWidth={2.2} />
    //           </button> */}

    //           <div className="relative">
    //             <button
    //               onClick={(e) => {
    //                 e.stopPropagation()
    //                 setShowUserMenu((prev) => !prev)
    //               }}
    //               className="rounded-full p-1.5 transition bg-slate-100"
    //             >
    //               <User size={15} strokeWidth={2.2} />
    //             </button>

    //             {/* {showUserMenu && (
    //               <div
    //                 onClick={(e) => e.stopPropagation()}
    //                 className="absolute right-0 mt-2 w-32 bg-white border border-slate-200 rounded-md shadow-lg z-50"
    //               >
    //                 <button
    //                   onClick={handleLogout}
    //                   className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
    //                 >
    //                   Logout
    //                 </button>
    //               </div>
    //             )} */}
    //           </div>
    //         </div>
    //       </header>
    //       <div className=" flex flex-col ">
    //         {/* Top bar */}
    //         <div className="px-4 md:px-6 py-3">
    //           <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
    //             {/* Title */}
    //             <h1 className="text-lg md:text-xl font-bold text-gray-900">
    //               Daily Staff Activity
    //             </h1>

    //             {/* Date range */}
    //             <div className="flex items-center">
    //               <div className="bg-white rounded-lg px-3 py-1.5 shadow-sm border border-gray-200 flex flex-wrap items-center gap-3">
    //                 <div className="flex flex-col">
    //                   <label className="text-xs font-medium text-gray-600 mb-0.5">
    //                     Start Date
    //                   </label>
    //                   <input
    //                     type="date"
    //                     value={date.startDate}
    //                     onChange={(e) =>
    //                       setdate((prev) => ({
    //                         ...prev,
    //                         startDate: e.target.value
    //                       }))
    //                     }
    //                     className="px-2 py-1 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
    //                   />
    //                 </div>

    //                 <div className="flex flex-col">
    //                   <label className="text-xs font-medium text-gray-600 mb-0.5">
    //                     End Date
    //                   </label>
    //                   <input
    //                     type="date"
    //                     value={date.endDate}
    //                     onChange={(e) =>
    //                       setdate((prev) => ({
    //                         ...prev,
    //                         endDate: e.target.value
    //                       }))
    //                     }
    //                     className="px-2 py-1 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
    //                   />
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>

    //         {/* Table wrapper */}
    //         <div className="flex-1 overflow-hidden">
    //           <div className="h-full px-3 md:px-6 pb-4">
    //             <div className="h-full bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
    //               <ReportTable
    //                 headers={headerNames}
    //                 reportName="Daily Staff Activity"
    //                 data={data}
    //               />
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="h-full bg-[#ADD8E6] overflow-hidden">
      <div className="flex h-full flex-row overflow-hidden">
        <StaticSidebar
          handleMoreClick={handleMoreClick}
          selectedCompanyBranch={selectedcompanyBranch}
          setselectedCompanyBranch={setselectedcompanyBranch}
          parenttargetData={settargetData}
          parentperiodmode={setperiodMode}
          parentyear={setSelectedYear}
          setselectedPeriod={setselectedPeriod}
        />

        <div className="flex flex-1 min-h-0 min-w-0 flex-col overflow-hidden">
          <header className="flex items-center justify-between bg-[#ADD8E6]">
            {loggedUser?.role?.toLowerCase() === "admin" ? (
              <AdminHeader hide={true} />
            ) : (
              <StaffHeader hide={true} />
            )}

            <div className="flex h-full items-center gap-1.5 bg-[#ADD8E6] pr-3">
              <button className="rounded-full bg-slate-100 p-1.5 transition">
                <Mail size={15} strokeWidth={2.2} />
              </button>

              <div className="relative">
                <button className="rounded-full bg-slate-100 p-1.5 transition">
                  <MessageSquareText size={15} strokeWidth={2.2} />
                </button>
                <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-500" />
              </div>

              <button className="rounded-full bg-slate-100 p-1.5 transition">
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
                  className="rounded-full bg-slate-100 p-1.5 transition"
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

          <div className="flex flex-1 min-h-0 min-w-0 flex-col">
            {/* Top bar */}
            <div className="shrink-0 px-4 py-3 md:px-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h1 className="text-lg font-bold text-gray-900 md:text-xl">
                  Daily Staff Activity
                </h1>

                <div className="flex items-center">
                  <div className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-1.5 shadow-sm">
                    <div className="flex flex-col">
                      <label className="mb-0.5 text-xs font-medium text-gray-600">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={date.startDate}
                        onChange={(e) =>
                          setdate((prev) => ({
                            ...prev,
                            startDate: e.target.value
                          }))
                        }
                        className="rounded-md border border-gray-200 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="mb-0.5 text-xs font-medium text-gray-600">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={date.endDate}
                        onChange={(e) =>
                          setdate((prev) => ({
                            ...prev,
                            endDate: e.target.value
                          }))
                        }
                        className="rounded-md border border-gray-200 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Table wrapper */}
            <div className="flex-1 min-h-0 min-w-0 overflow-hidden">
              <div className="h-full min-h-0 min-w-0 px-3 pb-4 md:px-6">
                <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md">
                  <div className="flex-1 min-h-0 min-w-0 overflow-auto">
                    <ReportTable
                      headers={headerNames}
                      reportName="Daily Staff Activity"
                      data={data}
                    />
                  </div>
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
    </div>
  )
}
