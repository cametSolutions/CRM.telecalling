import { useNavigate } from "react-router-dom"
import UseFetch from "../../../hooks/useFetch"
import MyDatePicker from "../../../components/common/MyDatePicker"
import BarLoader from "react-spinners/BarLoader"
import LeadTaskComponent from "../../../components/primaryUser/LeadTaskComponent"
import { PerformanceModal } from "../../../components/primaryUser/PerformanceModal"
import { useState, useEffect } from "react"
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
import { FaFileInvoiceDollar } from "react-icons/fa"
import SkeletonTable from "../../../components/loader/SkeletonTable"
import AdminHeader from "../../../header/AdminHeader"
import { StaticSidebar } from "../../../components/primaryUser/StaticSidebar"
import StaffHeader from "../../../header/StaffHeader"
import { PropagateLoader } from "react-spinners"
const LeadTask = () => {
  const [loggedUser, setloggedUser] = useState(null)
  const [dates, setDates] = useState({ startDate: "", endDate: "" })
  console.log(dates)
  const [type, settype] = useState("leadTask")
  const [filteredData, setFilteredData] = useState([])
console.log(filteredData)
  const [netTotalAmount, setnetTotalAmount] = useState(0)
  const [pending, setPending] = useState(true)
  const [ownTask, setownTask] = useState(true)
console.log(ownTask)
  const navigate = useNavigate()
  const [activeUserId, setActiveUserId] = useState(null)
  const [loggedUserBranches, setloggedUserBranches] = useState(null)
  const [selectedCompanyBranch, setselectedCompanyBranch] = useState(null)
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
  const [selectedUserName, setselecteduserName] = useState(null)
  useEffect(() => {
    const now = new Date()
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1) // 1st day of current month

    setDates({ startDate, endDate: now })
  }, [])
  useEffect(() => {
    const userData = getLocalStorageItem("user")
    const branch = userData?.selected?.map((branch) => {
      return {
        value: branch.branch_id,
        label: branch.branchName
      }
    })

    setloggedUserBranches(branch)
    setselectedCompanyBranch(branch[0].value)

    setloggedUser(userData)
  }, [])
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
      const filteredloggedUserItem = Datas.filter(
        (item) => item.userId === loggedUser._id
      )
      console.log("hhh")

      console.log(Datas)
      console.log("hhhh")
      console.log(filteredloggedUserItem)

      const filteredselectedCategory = filteredloggedUserItem
        .flatMap((user) => user.categories || [])
        .filter((item) => item.categoryId === selectedCategory?.Id)
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

  const { data, error, loading, refreshHook } = UseFetch(
    loggedUser &&
      selectedCompanyBranch &&
      `/lead/getrespectedleadTask?userid=${loggedUser._id}&branchSelected=${selectedCompanyBranch}&role=${loggedUser.role}&ownTask=${ownTask}`
  )
  const { data: branchProduct } = UseFetch(
    `/product/getallbranchProduct?branch=${selectedCompanyBranch}`
  )
  const formatdate = (date) => new Date(date).toISOString().split("T")[0]
  const getLocalDate = (date) => {
    const local = new Date(date)
    local.setMinutes(date.getMinutes() - date.getTimezoneOffset())
    return local.toISOString().split("T")[0] // e.g., "2025-06-12"
  }
  useEffect(() => {
    if (data && pending && loggedUser && dates && dates.endDate) {
      // const finalOutput = []
      // data.forEach((entry) => {
      //   const activitylog = entry.activityLog

      //   activitylog.forEach((log) => {
      //     if (
      //       log.taskClosed === false &&
      //       log?.taskallocatedTo &&
      //       log.taskTo &&
      //       log.taskTo !== "followup"
      //     ) {
      //       console.log(log.taskallocatedTo)
      //       finalOutput.push({
      //         leadId: entry.leadId,
      //         leadDocId: entry._id,
      //         allocatedTo: log?.taskallocatedTo?._id,
      //         leadDate: entry.leadDate,
      //         customerName:
      //           entry?.customerName?.customerName || entry?.customerName,
      //         leadBy: entry?.leadBy,
      //         dueDate: entry?.dueDate,
      //         leadFor: entry?.leadFor,
      //         netAmount: entry?.netAmount,
      //         mobile: entry?.mobile,
      //         email: entry?.email,
      //         taskTo: log?.taskTo,
      //         taskBy: log?.taskBy,
      //         remarks: log.remarks,
      //         closedDate: log?.submissionDate,
      //         matchedlog: log,
      //         activityLog: activitylog,
      //         taskallocatedTo: entry.taskallocatedTo,
      //         taskallocatedBy: entry.taskallocatedBy,
      //         sameUser: loggedUser?._id === entry.taskallocatedTo?._id
      //       })
      //     }
      //   })
      // })
const finalOutput = []
data.forEach((entry) => {
  const activitylog = entry.activityLog

  activitylog.forEach((log) => {
    if (
      log.taskClosed === false &&
      log?.taskallocatedTo &&
      log.taskTo &&
      log.taskTo !== "followup" &&
      log.allocationChanged !== true   // <-- skip superseded allocations
    ) {
      finalOutput.push({
        leadId: entry.leadId,
        leadDocId: entry._id,
        allocatedTo: log?.taskallocatedTo?._id,
        leadDate: entry.leadDate,
        customerName:
          entry?.customerName?.customerName || entry?.customerName,
        leadBy: entry?.leadBy,
        dueDate: entry?.dueDate,
        leadFor: entry?.leadFor,
        netAmount: entry?.netAmount,
        mobile: entry?.mobile,
        email: entry?.email,
        taskTo: log?.taskTo,
        taskBy: log?.taskBy,
        remarks: log.remarks,
        closedDate: log?.submissionDate,
        matchedlog: log,
        activityLog: activitylog,
        taskallocatedTo: entry.taskallocatedTo,
        taskallocatedBy: entry.taskallocatedBy,
        sameUser: loggedUser?._id === entry.taskallocatedTo?._id
      })
    }
  })
})
console.log(data)
console.log(data.length)
console.log(finalOutput)
console.log('H')
      const totalNetAmount = finalOutput
        .reduce((total, lead) => {
          const leadTotal =
            lead.leadFor?.reduce(
              (sum, item) => sum + (item?.netAmount || 0),
              0
            ) || 0
          return total + leadTotal
        }, 0)
        .toFixed(2)
      setnetTotalAmount(totalNetAmount)
      let Data
      if (ownTask) {
        Data = normalizeTableData(finalOutput)
      } else {
        const groupedLeads = {}
        let grandTotal = 0
        finalOutput.forEach((lead) => {
          const assignedTo = lead?.taskallocatedTo?.name
          const amount = lead?.netAmount || 0
          grandTotal += amount
          if (!groupedLeads[assignedTo]) {
            groupedLeads[assignedTo] = []
          }
          groupedLeads[assignedTo].push(lead)
        })
        Data = normalizeTableData(groupedLeads)
      }

      setFilteredData(Data)
    } else if (data && !pending) {
console.log("hh")
      const finalOutput = []

      data.forEach((entry) => {
        const activitylog = entry.activityLog

        const matchedLog = activitylog.find(
          (log) =>
            log.taskClosed && log?.taskallocatedTo && log.taskTo !== "followup"
        )

        if (matchedLog) {
          finalOutput.push({
            leadId: entry.leadId,
            leadDocId: entry._id,
            leadDate: entry.leadDate,
            customerName:
              entry?.customerName?.customerName || entry?.customerName,
            leadBy: entry?.leadBy,
            leadFor: entry?.leadFor,
            netAmount: entry?.netAmount,
            mobile: entry?.mobile,
            email: entry?.email,
            activityLog: activitylog,
            taskallocatedTo: entry?.taskallocatedTo,
            taskallocatedBy: entry?.taskallocatedBy,
            sameUser: loggedUser?._id === entry.taskallocatedTo?._id
          })
        }
      })

      const totalNetAmount = data
        .reduce((total, lead) => {
          const leadTotal =
            lead.leadFor?.reduce(
              (sum, item) => sum + (item?.netAmount || 0),
              0
            ) || 0
          return total + leadTotal
        }, 0)
        .toFixed(2)

      // then store it in state
      setnetTotalAmount(totalNetAmount)
      let Data
      if (ownTask) {
        Data = normalizeTableData(finalOutput)
      } else {
        const groupedLeads = {}
        let grandTotal = 0
        finalOutput.forEach((lead) => {
          const assignedTo = lead?.taskallocatedTo?.name
          const amount = lead?.netAmount || 0
          grandTotal += amount
          if (!groupedLeads[assignedTo]) {
            groupedLeads[assignedTo] = []
          }
          groupedLeads[assignedTo].push(lead)
        })
        Data = normalizeTableData(groupedLeads)
      }

      setFilteredData(Data)
    }
  }, [data, pending, dates])
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
  console.log(type)
  console.log(pending)
  console.log("hhhh")
  return (
    <div className="h-full  bg-[#ADD8E6]">
      <div className="flex h-full flex-row">
        <StaticSidebar
          handleMoreClick={handleMoreClick}
          selectedCompanyBranch={selectedCompanyBranch}
          setselectedCompanyBranch={setselectedCompanyBranch}
          parenttargetData={settargetData}
          parentperiodmode={periodMode}
          parentyear={selectedYear}
          setselectedPeriod={setselectedPeriod}
        />
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex items-center justify-between">
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
          {loading && (
            <BarLoader
              cssOverride={{ width: "100%", height: "4px" }} // Tailwind's `h-4` corresponds to `16px`
              color="#4A90E2" // Change color as needed
            />
          )}

          <div className="flex flex-col md:flex-row  items-start md:items-center mx-3 md:mx-5 mt-3 mb-3 gap-4">
            {/* Title */}
            <h2 className="text-lg font-bold">
              {`Task ${pending ? "Pending" : "Cleared"}`}
            </h2>

            {/* Right Section */}
            <div className="flex flex-wrap gap-3 flex-grow justify-start md:justify-end md:gap-6 items-center w-full md:w-auto">
              {dates.startDate && (
                <MyDatePicker setDates={setDates} dates={dates} />
              )}
              {/* Message Icon with Badge and Popup */}
              <div className="flex flex-grow md:flex-grow-0 items-center justify-end gap-2">
                <span className="text-sm whitespace-nowrap font-semibold">
                  {pending ? "Pending" : "Cleared"}
                </span>
                <button
                  onClick={() => setPending(!pending)}
                  className={`${
                    pending ? "bg-green-500" : "bg-gray-300"
                  } w-11 h-6 flex items-center rounded-full transition-colors duration-300`}
                >
                  <div
                    className={`${
                      pending ? "translate-x-5" : "translate-x-0"
                    } w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300`}
                  ></div>
                </button>
                {loggedUser?.role !== "Staff" && (
                  <>
                    <span className="text-sm whitespace-nowrap font-semibold">
                      {ownTask ? "Own Task" : "All Task"}
                    </span>
                    <button
                      onClick={() => setownTask(!ownTask)}
                      className={`${
                        ownTask ? "bg-green-500" : "bg-gray-300"
                      } w-11 h-6 flex items-center rounded-full transition-colors duration-300`}
                    >
                      <div
                        className={`${
                          ownTask ? "translate-x-5" : "translate-x-0"
                        } w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300`}
                      ></div>
                    </button>
                  </>
                )}
              </div>

              {/* <select
                value={selectedCompanyBranch || ""}
                onChange={(e) => setselectedCompanyBranch(e.target.value)}
                className="border border-gray-300 py-1 rounded-md px-2 focus:outline-none min-w-[150px]"
              >
                {loggedUserBranches?.map((branch) => (
                  <option key={branch.value} value={branch.value}>
                    {branch.label}
                  </option>
                ))}
              </select> */}

              {/* New Lead Button */}
              <div className="">
                <button
                  onClick={() =>
                    loggedUser.role === "Admin"
                      ? navigate("/admin/transaction/lead")
                      : navigate("/staff/transaction/lead")
                  }
                  className="bg-black text-white py-1 px-3 rounded-lg shadow-lg hover:bg-gray-600 max-w-[100px] md:w-full"
                >
                  New Lead
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-end mr-5">
            <span className="text-blue-700">{`Total Amount - ${netTotalAmount}`}</span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <PropagateLoader color="#3b82f6" size={12} />
              <p className="text-gray-500 text-sm font-medium">
                Loading tasks...
              </p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          ) : data?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-gray-700 font-semibold text-lg">
                No Tasks Available
              </h3>
            </div>
          ) : filteredData?.length > 0 ? (
            <LeadTaskComponent
              type={type}
              Data={filteredData}
              loggedUser={loggedUser}
              refresh={refreshHook}
              pending={pending}
ownTask={ownTask}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <p className="text-sm"></p>
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
    </div>
  )
}
export default LeadTask
