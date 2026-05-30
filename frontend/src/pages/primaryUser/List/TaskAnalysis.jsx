import UseFetch from "../../../hooks/useFetch"
import { useEffect, useState } from "react"
import { AiOutlineProfile } from "react-icons/ai"
import { useNavigate } from "react-router-dom"
import BarLoader from "react-spinners/BarLoader"
import { PerformanceModal } from "../../../components/primaryUser/PerformanceModal"
import { StaticSidebar } from "../../../components/primaryUser/StaticSidebar"
import { CardSkeletonLoader } from "../../../components/common/CardSkeletonLoader"
import CurrentDate from "../../../components/common/CurrentDate"
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
import AdminHeader from "../../../header/AdminHeader"
import StaffHeader from "../../../header/StaffHeader"
const TaskAnalysis = () => {
  const navigate = useNavigate()
  const [gridList, setgridList] = useState([])
  const [loggedUser, setLoggedUser] = useState(null)
  const [loggedUserBranches, setLoggeduserBranches] = useState([])
  const [selectedCompanyBranch, setSelectedCompanyBranch] = useState(null)
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
  const [selectedUserName, setselecteduserName] = useState(null)
  const { data: analysisleads, loading } = UseFetch(
    selectedCompanyBranch &&
      `/lead/getalltaskAnalysisLeads?selectedBranch=${selectedCompanyBranch}`
  )
  const { data: branchProduct } = UseFetch(
    `/product/getallbranchProduct?branch=${selectedCompanyBranch}`
  )
  const { data: branches } = UseFetch("/branch/getBranch")
  useEffect(() => {
    const userData = localStorage.getItem("user")
    const user = JSON.parse(userData)
    setLoggedUser(user)
  }, [])
  console.log("h")
  useEffect(() => {
    if (loggedUser && branches && branches.length > 0) {
      if (loggedUser.role === "Admin") {
        const isselctedArray = loggedUser?.selected
        if (isselctedArray) {
          const loggeduserBranches = loggedUser.selected.map((item) => {
            return { value: item.branch_id, label: item.branchName }
          })
          setLoggeduserBranches(loggeduserBranches)
          setSelectedCompanyBranch(loggeduserBranches[0].value)
        } else {
          const loggeduserBranches = branches.map((item) => {
            return { value: item._id, label: item.branchName }
          })
          setLoggeduserBranches(loggeduserBranches)
          setSelectedCompanyBranch(loggeduserBranches[0].value)
        }
      } else {
        const loggeduserBranches = loggedUser.selected.map((item) => {
          return { value: item.branch_id, label: item.branchName }
        })
        setLoggeduserBranches(loggeduserBranches)
        setSelectedCompanyBranch(loggeduserBranches[0].value)
      }
    }
  }, [loggedUser, branches])
  console.log("a")
  useEffect(() => {
    if (analysisleads && analysisleads.length > 0) {
      const a = analysisleads.map((item) => item.leadId)
      console.log(a)
      const taskByList = analysisleads.reduce((acc, lead) => {
        const logs = lead.activityLog
        if (logs.length === 0) return acc

        logs.forEach((log) => {
          // Only include logs that are not closed and have a taskTo field
          if (
            log.taskId &&
            (log.taskClosed === false || log.followupClosed === false) &&
            log.taskClosed !== true &&
            log.followupClosed !== true &&
            log?.allocatedClosed === false &&
            (!("allocationlist" in log) || log.allocationlist === false)
          ) {
            console.log(log.taskId.taskName)
            console.log(log.taskClosed)
            console.log(lead.leadId, log.taskId)
            acc[log.taskId.taskName] = (acc[log.taskId.taskName] || 0) + 1
          }
        })

        return acc
      }, {})
      // Convert to array of objects with label and value
      const taskByCountArray = Object.entries(taskByList).map(
        ([label, value]) => ({
          label,
          value
        })
      )
      setgridList(taskByCountArray)
    }
  }, [analysisleads])
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
  return (
    <div className=" h-full bg-[#ADD8E6] overflow-hidden">
      <div className="flex h-full flex-row">
        <StaticSidebar
          handleMoreClick={handleMoreClick}
          selectedCompanyBranch={selectedCompanyBranch}
          setselectedCompanyBranch={setSelectedCompanyBranch}
          parenttargetData={settargetData}
          parentperiodmode={setperiodMode}
          parentyear={setSelectedYear}
          setselectedPeriod={setselectedPeriod}
        />
        <div className="flex flex-1 flex-col overflow-hidden ">
          <header className="flex items-center justify-between bg-[#ADD8E6]">
            {loggedUser?.role?.toLowerCase() === "admin" ? (
              <AdminHeader hide={true}/>
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
          {loading && (
            <BarLoader
              cssOverride={{ width: "100%", height: "4px" }} // Tailwind's `h-4` corresponds to `16px`
              color="#4A90E2" // Change color as needed
            />
          )}
          <div className="flex flex-col flex-1 bg-[#ADD8E6]">
            <div className="flex justify-between m-2 mx-4">
              <h2 className="text-lg font-bold">Task Analysis</h2>
              <div className="flex justify-between ">
              t */}
                <CurrentDate />
              </div>
            </div>

            <div className="h-auto border border-gray-100 p-3 mx-4 rounded-xl shadow-xl bg-white mb-3">
              {loading ? (
                <CardSkeletonLoader count={5} />
              ) : gridList && gridList.length > 0 ? (
                gridList.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-slate-100 p-3 rounded-md shadow-sm text-black text-lg cursor-pointer"
                    >
                      <div className="bg-blue-500 text-white rounded-full p-2 md:mr-10">
                        <AiOutlineProfile className="text-xl " />
                      </div>
                      <div
                        onClick={() =>
                          navigate(
                            loggedUser.role === "Admin"
                              ? `/admin/transaction/lead/taskanalysisTable/${encodeURIComponent(
                                  item.label
                                )}`
                              : `/staff/transaction/lead/taskanalysisTable/${encodeURIComponent(
                                  item.label
                                )}`,
                            {
                              state: { branchid: selectedCompanyBranch }
                            }
                          )
                        }
                        className="flex justify-between w-full px-6 py-2 bg-white shadow-xl rounded-md border border-gray-100"
                      >
                        <span className="font-medium">{item.label}</span>
                        <span className="text-gray-600">{item.value}</span>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                    <AiOutlineProfile className="text-blue-500 text-3xl" />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-700">
                    No Data Found
                  </h3>

                  <p className="text-gray-500 mt-1 text-sm">
                    There are no records available for the selected criteria.
                  </p>

                  <button
                    onClick={() => window.location.reload()}
                    className="mt-5 px-5 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition"
                  >
                    Refresh
                  </button>
                </div>
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
export default TaskAnalysis
