import { useState, useEffect } from "react"
import ReallocationTable from "./ReallocationTable"
import { useNavigate } from "react-router-dom"

import { AiOutlineProfile } from "react-icons/ai"
import { toast } from "react-toastify"
import { PropagateLoader } from "react-spinners"
import BarLoader from "react-spinners/BarLoader"
import api from "../../../api/api"
import Select from "react-select"
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
import UseFetch from "../../../hooks/useFetch"
import AdminHeader from "../../../header/AdminHeader"
import StaffHeader from "../../../header/StaffHeader"
import { getLocalStorageItem } from "../../../helper/localstorage"
import SkeletonTable from "../../../components/loader/SkeletonTable"
import { StaticSidebar } from "../../../components/primaryUser/StaticSidebar"
const Reallocation = () => {
  const [status, setStatus] = useState("Pending")
  const [selectedLabel, setSelectedLabel] = useState(null)
  const [showTableList, setshowTableList] = useState(false)
  const [gridList, setgridList] = useState([])
  const [toggleLoading, setToggleLoading] = useState(false)
  const [selectedLeadId, setselectedLeadId] = useState(null)
  const [selectedType, setselectedType] = useState(null)
  const [showModal, setShowmodal] = useState(false)
  const [submiterror, setsubmitError] = useState("")
  const [selectedAllocationType, setselectedAllocationType] = useState({})
  const [validateError, setValidateError] = useState({})
  const [validatetypeError, setValidatetypeError] = useState({})
  const [loggedUserBranches, setLoggeduserBranches] = useState([])
  const [selectedCompanyBranch, setSelectedCompanyBranch] = useState(null)
  const [showFullName, setShowFullName] = useState(false)
  const [showFullEmail, setShowFullEmail] = useState(false)
  const [approvedToggleStatus, setapprovedToggleStatus] = useState(false)
  const [submitLoading, setsubmitLoading] = useState(false)
  const [allocationOptions, setAllocationOptions] = useState([])
  const [selectedAllocates, setSelectedAllocates] = useState({})
  const [loggedUser, setLoggedUser] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [tableData, setTableData] = useState([])
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
  const { data: branches } = UseFetch("/branch/getBranch")
  const { data: branchProduct } = UseFetch(
    `/product/getallbranchProduct?branch=${selectedCompanyBranch}`
  )
  const [formData, setFormData] = useState({
    allocationDate: "",
    allocationDescription: ""
  })
  const {
    data: leadreallocation,
    loading,
    refreshHook
  } = UseFetch(
    loggedUser &&
      selectedCompanyBranch &&
      `/lead/getallreallocatedLead?selectedBranch=${selectedCompanyBranch}&role=${loggedUser.role}`
  )
  const { data } = UseFetch("/auth/getallUsers")
  const navigate = useNavigate()
  // console.log(getallreallocatedLead);
  useEffect(() => {
    const userData = localStorage.getItem("user")
    const user = JSON.parse(userData)
    setLoggedUser(user)
  }, [])
  console.log("hhhh")
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
  useEffect(() => {
    if (data && selectedCompanyBranch) {
      const { allusers = [], allAdmins = [] } = data

      // Combine allusers and allAdmins

      const filter = allusers.filter((staff) =>
        staff.selected.some((s) => selectedCompanyBranch === s.branch_id)
      )
      const combinedUsers = [...filter, ...allAdmins]
      setAllocationOptions(
        combinedUsers.map((item) => ({
          value: item._id,
          label: item.name
        }))
      )
    }
  }, [data, selectedCompanyBranch])
  useEffect(() => {
    if (leadreallocation && leadreallocation.length > 0) {
      const taskByList = leadreallocation.reduce((acc, lead) => {
        const logs = lead.activityLog
        if (logs.length === 0) return acc

        const lastTask = lead.lasttask?.taskName
        console.log(lead?.lasttask)
        // const taskBy = lastTask.taskBy;

        if (lastTask) {
          acc[lastTask] = (acc[lastTask] || 0) + 1
        }

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
      setTableData(leadreallocation)
    }
  }, [leadreallocation])

  const handleSelectedAllocates = (item, value) => {
    setTableData((prevLeads) =>
      prevLeads.map((lead) =>
        lead._id === item._id ? { ...lead, allocatedTo: value } : lead
      )
    )
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

  const handleSubmit = async () => {
    try {
      if (!selectedAllocates.hasOwnProperty(selectedItem._id)) {
        setValidateError((prev) => ({
          ...prev,
          [selectedItem._id]: "Allocate to Someone"
        }))
        return
      }
      if (!selectedAllocationType.hasOwnProperty(selectedItem._id)) {
        setValidatetypeError((prev) => ({
          ...prev,
          [selectedItem._id]: "Select Type"
        }))
        return
      }
      const selected = selectedAllocationType[selectedItem._id]
      setsubmitLoading(true)
      // return
      // const selected = selectedAllocationType[selectedItem._id]
      const response = await api.post(
        `/lead/leadReallocation?allocationType=${encodeURIComponent(
          selected
        )}&allocatedBy=${loggedUser._id}`,
        { selectedItem, formData }
      )
      toast.success(response.data.message)
      setsubmitLoading(false)
      setFormData({
        allocationDate: "",
        allocationDescription: ""
      })
      setShowmodal(false)
      refreshHook()
      setTableData([])
    } catch (error) {
      setsubmitLoading(false)
      console.log(error)
      setsubmitError({ submissionerror: "something went error" })
    }
  }

  // Skeleton component
  const GridSkeleton = ({ rows = 6 }) => (
    <div className="h-full flex flex-col space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 bg-slate-100 p-3 rounded-md shadow-sm"
        >
          <div className="h-10 w-10 rounded-full bg-slate-200 animate-pulse" />
          <div className="flex-1 px-6 py-2 bg-white rounded-md border border-gray-100 flex justify-between items-center">
            <div className="h-3 w-32 bg-slate-200 rounded animate-pulse" />
            <div className="h-3 w-12 bg-slate-200 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )

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
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex items-center justify-between bg-[#ADD8E6]">
            {loggedUser?.role?.toLowerCase() === "admin" ? (
              <AdminHeader hide={true}/>
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
          {(submitLoading || loading) && (
            <BarLoader
              cssOverride={{ width: "100%", height: "4px" }}
              color="#4A90E2"
            />
          )}
          <div className="flex flex-col flex-1">
            {/* Header row (title + branch select) */}
            <div className="flex justify-between mt-2 mb-2 mx-5">
              <h2 className="text-lg font-bold">ReAllocation List</h2>
              <select
                onChange={(e) => {
                  setSelectedCompanyBranch(e.target.value)
                  setStatus(approvedToggleStatus ? "Approved" : "Pending")
                }}
                className="border border-gray-300 py-1 rounded-md px-2 focus:outline-none min-w-[120px] cursor-pointer"
              >
                {loggedUserBranches?.map((branch) => (
                  <option key={branch._id} value={branch.value}>
                    {branch.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Card that fills leftover height */}
            <div className="border border-gray-100 p-3 mx-4 rounded-xl shadow-xl bg-white h-auto overflow-auto">
              {loading ? (
                // dynamic height comes from flex-1 + h-full, rows is just count
                <GridSkeleton rows={6} />
              ) : gridList && gridList.length > 0 ? (
                gridList.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-slate-100 p-3 rounded-md shadow-sm text-black text-lg cursor-pointer mb-2"
                  >
                    <div className="bg-blue-500 text-white rounded-full p-2 md:mr-10">
                      <AiOutlineProfile className="text-xl" />
                    </div>
                    <div
                      onClick={() =>
                        navigate(
                          loggedUser.role === "Admin"
                            ? `/admin/transaction/lead/reallocationTable/${encodeURIComponent(
                                item.label
                              )}`
                            : `/staff/transaction/lead/reallocationTable/${encodeURIComponent(
                                item.label
                              )}`,
                          { state: { id: selectedCompanyBranch } }
                        )
                      }
                      className="flex justify-between w-full px-6 py-2 bg-white shadow-xl rounded-md border border-gray-100"
                    >
                      <span className="font-medium">{item.label}</span>
                      <span className="text-gray-600">{item.value}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="mb-2 h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <AiOutlineProfile className="text-slate-400 text-xl" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">
                    No data available
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    There are no records to display for the selected branch.
                  </p>
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

export default Reallocation
