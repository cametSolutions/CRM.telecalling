import { useState, useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"
import React from "react"
import { toast } from "react-toastify"
import { PropagateLoader } from "react-spinners"
import SkeletonTable from "../../../components/loader/SkeletonTable"
import { useNavigate, useParams } from "react-router-dom"
import BarLoader from "react-spinners/BarLoader"
import { useSelector } from "react-redux"
import api from "../../../api/api"
import Select from "react-select"
import { CollectionupdateModal } from "../../../components/primaryUser/CollectionupdateModal"
import UseFetch from "../../../hooks/useFetch"
import { PerformanceModal } from "../../../components/primaryUser/PerformanceModal"
import { StaticSidebar } from "../../../components/primaryUser/StaticSidebar"
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
import { getLocalStorageItem } from "../../../helper/localstorage"

const CODING_AND_QC_TASK_ID = "689c23493e94902039b97743"

const ReallocationTable = () => {
  const reduxselectedBranch = useSelector(
    (branch) => branch.companyBranch.selectedBranch
  )
  console.log(reduxselectedBranch)
  console.log("hd")
  const { label } = useParams()
  console.log(label)
  const [status, setStatus] = useState("Pending")

  const [toggleLoading, setToggleLoading] = useState(false)
  const [isClosed, setIsclosed] = useState(false)
  console.log(isClosed)
  const [selectedLeadId, setselectedLeadId] = useState(null)
  const [selectedType, setselectedType] = useState(null)
  const [selectedData, setselectedData] = useState({})
  const [showModal, setShowmodal] = useState(false)
  const [partner, setpartner] = useState([])
  const [submiterror, setsubmitError] = useState("")
  const [selectedAllocationType, setselectedAllocationType] = useState({})
  const [selectedAllocationtypeNames, setselectedallocatiotypeNames] = useState(
    {}
  )
  const [activeUserId, setActiveUserId] = useState(null)
  const [validateError, setValidateError] = useState({})
  const [validatetypeError, setValidatetypeError] = useState({})
  const [loggedUserBranches, setLoggeduserBranches] = useState([])
  const [selectedCompanyBranch, setSelectedCompanyBranch] = useState(null)
  const [showFullName, setShowFullName] = useState(false)
  const [showFullEmail, setShowFullEmail] = useState(false)
  const [approvedToggleStatus, setapprovedToggleStatus] = useState(false)
  const [submitLoading, setsubmitLoading] = useState(false)
  const [allocationOptions, setAllocationOptions] = useState([])
  const [rndAllocationOptions, setRndAllocationOptions] = useState([])
  const [selectedAllocates, setSelectedAllocates] = useState({})
  const [loggedUser, setLoggedUser] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [tableData, setTableData] = useState([])
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
  const { data: branches } = UseFetch("/branch/getBranch")
  const location = useLocation()
  const { id } = location.state || {}
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
      reduxselectedBranch &&
      `/lead/getallreallocatedLead?selectedBranch=${reduxselectedBranch}&role=${loggedUser.role}`
  )
  const { data: branchProduct } = UseFetch(
    `/product/getallbranchProduct?branch=${reduxselectedBranch}`
  )
  const { data: tasks } = UseFetch("/lead/getallTask")
  console.log(tasks)
  console.log(leadreallocation)
  const { data } = UseFetch("/auth/getallUsers")
  const { data: partners } = UseFetch("/customer/getallpartners")
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    const user = JSON.parse(userData)
    setLoggedUser(user)
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
    if (loggedUser && branches && branches.length > 0) {
      if (loggedUser.role === "Admin") {
        const isselctedArray = loggedUser?.selected
        if (isselctedArray) {
          const loggeduserBranches = loggedUser.selected.map((item) => {
            return { value: item.branch_id, label: item.branchName }
          })
          setLoggeduserBranches(loggeduserBranches)
          setSelectedCompanyBranch(id)
        } else {
          const loggeduserBranches = branches.map((item) => {
            return { value: item._id, label: item.branchName }
          })
          setLoggeduserBranches(loggeduserBranches)
          setSelectedCompanyBranch(id)
        }
      } else {
        const loggeduserBranches = loggedUser.selected.map((item) => {
          return { value: item.branch_id, label: item.branchName }
        })
        setLoggeduserBranches(loggeduserBranches)
        setSelectedCompanyBranch(id)
      }
    }
  }, [loggedUser, branches])
  useEffect(() => {
    if (data && selectedCompanyBranch) {
      const { allusers = [], allAdmins = [] } = data

      // Combine allusers and allAdmins

      const filter = allusers.filter(
        (staff) =>
          staff.isVerified === true 
          // staff.selected.some((s) => selectedCompanyBranch === s.branch_id)
      )
      const combinedUsers = [...filter, ...allAdmins]
      setAllocationOptions(
        combinedUsers.map((item) => ({
          value: item._id,
          label: item.name
        }))
      )

      setRndAllocationOptions(
        allusers
          .filter(
            (staff) =>
              staff.isVerified === true &&
              staff.department?.department?.trim().toLowerCase() ===
                "research and development"
          )
          .map((staff) => ({ value: staff._id, label: staff.name }))
      )
    }
  }, [data, selectedCompanyBranch])
  useEffect(() => {
    if (
      leadreallocation &&
      leadreallocation.length > 0 &&
      partners &&
      partners.length > 0
    ) {
      const filteredLeads = filterLeadsByLastTaskLabel(leadreallocation, label)
      setTableData(filteredLeads)
      setpartner(partners)
    }
  }, [leadreallocation])
  const filterLeadsByLastTaskLabel = (leads, label) => {
    console.log(label)
    return leads.filter((lead) => {
      const logs = lead.activityLog
      if (!logs || logs.length === 0) return false

      const lastLog = lead?.lasttask?.taskName
      console.log(lastLog)
      console.log(label)
      return lastLog?.toLowerCase() === label.toLowerCase()
    })
  }

  const handleSelectedAllocates = (item, value) => {
    console.log(item)
    console.log(value)
    setTableData((prevLeads) =>
      prevLeads.map((lead) =>
        lead._id === item._id ? { ...lead, allocatedTo: value } : lead
      )
    )
  }

  const handleSubmit = async () => {
    try {
      const selectedTaskId = selectedAllocationType[selectedItem._id]
      const isCodingAndQc = selectedTaskId === CODING_AND_QC_TASK_ID

      if (
        !isCodingAndQc &&
        !Object.prototype.hasOwnProperty.call(selectedAllocates, selectedItem._id)
      ) {
        setValidateError((prev) => ({
          ...prev,
          [selectedItem._id]: "Allocate to Someone"
        }))
        return
      }
      if (
        !Object.prototype.hasOwnProperty.call(
          selectedAllocationType,
          selectedItem._id
        )
      ) {
        setValidatetypeError((prev) => ({
          ...prev,
          [selectedItem._id]: "Select Type"
        }))
        return
      }
      const selected = selectedTaskId
      console.log(selectedType)
      console.log(selected)
      console.log(selectedItem?.allocatedTo)
      console.log(formData)
      setsubmitLoading(true)

      if (isCodingAndQc) {
        if (
          !formData.allocatedTo ||
          !formData.allocationDate ||
          !formData.allocationTime ||
          !formData.taskTitle?.trim() ||
          !formData.allocationDescription?.trim()
        ) {
          setsubmitError({
            submissionerror:
              "Assigned developer, allocation date/time, task title, and task description are required"
          })
          setsubmitLoading(false)
          return
        }

        const response = await api.post("/lead/rnd-allocation", {
          leadDocId: selectedItem._id,
          allocatedTo: formData.allocatedTo,
          allocationDate: formData.allocationDate,
          allocationTime: formData.allocationTime,
          expectedCompletionDate: formData.expectedCompletionDate || undefined,
          taskTitle: formData.taskTitle,
          allocationDescription: formData.allocationDescription
        })

        toast.success(response.data.message)
        setsubmitLoading(false)
        setShowmodal(false)
        setFormData({ allocationDate: "", allocationDescription: "" })
        refreshHook()
        setTableData([])
        return
      }

      const response = await api.post(
        `/lead/leadReallocation?allocationTypeId=${encodeURIComponent(
          selected
        )}&allocatedBy=${loggedUser._id}&allocationName=${encodeURIComponent(selectedType)}`,
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
      setsubmitError({
        submissionerror:
          error.response?.data?.message || "Unable to reallocate this lead"
      })
      setsubmitLoading(false)
      console.log(error.message)
    }
  }
  const handleCollectionUpdate = async (formData) => {
    try {
      const isfrom = "reallocation"
      const response = await api.post(
        `/lead/collectionUPdate?isFrom=${isfrom}`,
        formData
      )
      if (response.status === 200) {
        refreshHook()
        return response
      }
    } catch (error) {
      toast.error("something went wrong")
      console.log("error", error.message)
    }
  }
  const handleClosed = async () => {
    if (!formData.recievedAmount) {
      setsubmitError((prev) => ({
        ...prev,
        recievedAmount: "Plase add closing amount"
      }))
      return
    }
    // return
    const allocationType = "lead Closed"
    const response = await api.post(
      `/lead/leadClosingAmount?allocationType=${encodeURIComponent(
        allocationType
      )}&allocatedBy=${loggedUser._id}&leadId=${selectedLeadId}`,
      { formData }
    )
    toast.success(response.data.message)
    setsubmitLoading(false)

    setIsclosed(false)
    refreshHook()
    setTableData([])
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
  const isCodingAndQcModal =
    selectedAllocationType[selectedItem?._id] === CODING_AND_QC_TASK_ID

  return (
    <div className="h-full  bg-[#ADD8E6] overflow-hidden">
      <div className="flex h-full flex-row">
        {/* <StaticSidebar
          handleMoreClick={handleMoreClick}
          selectedCompanyBranch={selectedCompanyBranch}
          setselectedCompanyBranch={setSelectedCompanyBranch}
          parenttargetData={settargetData}
          parentperiodmode={periodMode}
          parentyear={selectedYear}
          setselectedPeriod={setselectedPeriod}
        /> */}
        <div className="flex flex-1 flex-col overflow-hidden min-h-0">
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
          {(submitLoading || loading) && (
            <BarLoader
              cssOverride={{ width: "100%", height: "4px" }} // Tailwind's `h-4` corresponds to `16px`
              color="#4A90E2" // Change color as needed
            />
          )}
          <div className="flex flex-col flex-1 bg-[#ADD8E6] min-h-0">
            <div className="flex justify-between items-center mx-3 md:mx-5 mt-3 mb-3 ">
              <h2 className="text-lg font-bold ml-5 mt-3">ReAllocation List</h2>
              <div className="flex justify-end  ml-auto gap-6 items-center">
                <button
                  onClick={() =>
                    loggedUser.role === "Admin"
                      ? navigate("/admin/transaction/lead")
                      : navigate("/staff/transaction/lead")
                  }
                  className="bg-black text-white py-1 px-3 rounded-lg shadow-lg hover:bg-gray-600"
                >
                  New Lead
                </button>
              </div>
            </div>

            {/* Responsive Table Container */}
            <div className=" overflow-auto rounded-lg text-center overflow-y-auto border  shadow-xl mx-3 md:mx-5 mb-3 bg-white">
              <table className="w-full text-sm">
                <thead className=" whitespace-nowrap bg-blue-600 text-white sticky top-0 z-30">
                  <tr>
                    <th className="border border-r-0 border-t-0 border-gray-400 px-4 ">
                      SNO.
                    </th>
                    <th className="border border-r-0 border-t-0 border-gray-400 px-4 ">
                      Name
                    </th>
                    <th className="border border-r-0 border-t-0 border-l-0 border-gray-400  px-4 max-w-[200px] min-w-[200px]">
                      Mobile
                    </th>
                    <th className="border border-r-0 border-l-0 border-t-0 border-gray-400 px-4 ">
                      Phone
                    </th>
                    <th className="border border-r-0 border-l-0 border-t-0 border-gray-400 px-4 ">
                      Email
                    </th>
                    <th className="border  border-l-0 border-t-0 border-gray-400 px-4  min-w-[100px]">
                      Lead Id
                    </th>
                    {/* <th className="border  border-l-0 border-t-0 border-gray-400 px-4  min-w-[100px]">
                      Description
                    </th> */}
                    <th className="border border-t-0   border-blue-500 px-4 ">
                      Allocation Type
                    </th>
                    <th className="border border-t-0 border-gray-400 px-4  min-w-[100px]">
                      Action
                    </th>
                    <th className="border border-t-0 border-gray-400 px-4 py-2">
                      Net Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData && tableData.length > 0 ? (
                    tableData.map((item, index) => (
                      <React.Fragment key={item._id}>
                        <tr className="bg-white  border border-gray-400 border-b-0">
                          <td className="  px-4 "></td>
                          <td
                            onClick={() => setShowFullName(!showFullName)}
                            className={`px-4 cursor-pointer overflow-hidden border border-r-0 border-b-0 border-gray-400 ${
                              showFullName
                                ? "whitespace-normal max-h-[3em]" // ≈2 lines of text (1.5em line-height)
                                : "truncate whitespace-nowrap max-w-[120px]"
                            }`}
                            style={{ lineHeight: "1.5em" }} // fine-tune as needed
                          >
                            {item?.customerName?.customerName}
                          </td>
                          <td className="  px-4 ">{item?.mobile}</td>
                          <td className="px-4 ">{item?.landline}</td>
                          <td className="px-4 ">{item?.email}</td>
                          <td className=" px-4 ">{item?.leadId}</td>
                          {/* <td className=" px-4 border border-b-0 border-gray-400 "></td> */}
                          <td className="border border-b-0 border-gray-400 px-4 "></td>

                          <td className="border border-b-0 border-gray-400 px-1  text-blue-400 min-w-[50px] hover:text-blue-500 hover:cursor-pointer font-semibold">
                            <button
                              onClick={() =>
                                loggedUser.role === "Admin"
                                  ? navigate(
                                      "/admin/transaction/lead/leadEdit",
                                      {
                                        state: {
                                          leadId: item._id,
                                          isReadOnly: false
                                        }
                                      }
                                    )
                                  : navigate(
                                      "/staff/transaction/lead/leadEdit",
                                      {
                                        state: {
                                          leadId: item._id,
                                          isReadOnly: false
                                        }
                                      }
                                    )
                              }
                              className="text-blue-400 hover:text-blue-500 font-semibold cursor-pointer"
                            >
                              View / Modify
                            </button>
                          </td>
                          <td className="border border-b-0 border-gray-400 px-4 "></td>
                        </tr>

                        <tr className=" font-semibold bg-gray-100">
                          <td className=" px-4 border border-b-0 border-t-0 border-r-0 border-gray-400 ">
                            {index + 1}
                          </td>
                          <td className=" px-4 border border-b-0 border-t-0 border-r-0 border-gray-400 ">
                            Leadby
                          </td>
                          <td className=" px-4">Assignedto</td>
                          <td className=" px-4 ">Assignedby</td>
                          <td className="px-4 ">No. of Followups</td>
                          <td className="px-4 min-w-[120px]">Lead Date</td>
                          {/* <td className="px-4 min-w-[120px] border border-t-0 border-b-0 border-gray-400 whitespace-nowrap">
                          
<span className="mx-2 relative group inline-block max-w-[220px] align-middle">
  <span className="block truncate text-[12px] text-slate-700">
    {item?.activityLog?.[item.activityLog.length - 1]?.remarks || "-"}
  </span>

  {item?.activityLog?.[item.activityLog.length - 1]?.remarks && (
    <div className="pointer-events-none absolute left-0 top-full z-50 mt-1 hidden w-80 rounded-md border border-slate-200 bg-slate-700 px-3 py-2 shadow-lg group-hover:block">
      <p className="text-[11px] leading-4 text-white whitespace-normal break-words">
        {item?.activityLog?.[item.activityLog.length - 1]?.remarks}
      </p>
    </div>
  )}
</span>
                          </td> */}
                          <td className=" border border-t-0 border-b-0 border-gray-400 px-1 bg-white ">
                            <select
                              value={selectedAllocationType[item._id] || ""}
                              onChange={(e) => {
                                const selectedtask = tasks.find(
                                  (item) => item._id === e.target.value
                                )

                                setselectedAllocationType((prev) => ({
                                  ...prev,
                                  [item._id]: e.target.value
                                }))
                                setselectedallocatiotypeNames((prev) => ({
                                  ...prev,
                                  [item._id]: selectedtask
                                }))
                                setselectedType(selectedtask?.taskName)
                                setValidatetypeError((prev) => ({
                                  ...prev,
                                  [item._id]: ""
                                }))
                              }}
                              className="py-1 border border-gray-400 rounded-md  w-full focus:outline-none cursor-pointer"
                            >
                              <option>Select Type</option>

                              {tasks &&
                                tasks.map((task) => (
                                  <option key={task._id} value={task._id}>
                                    {task?.taskName}
                                  </option>
                                ))}
                            </select>
                            {validatetypeError[item._id] && (
                              <p className="text-red-500 text-sm">
                                {validatetypeError[item._id]}
                              </p>
                            )}
                          </td>
                          <td
                            className=" border border-t-0 border-b-0 border-gray-400 px-4  text-red-500 hover:cursor-pointer bg-white"
                            onClick={() => {
                              const isCodingAndQc =
                                selectedAllocationType[item._id] ===
                                CODING_AND_QC_TASK_ID
                              if (
                                !isCodingAndQc &&
                                !Object.prototype.hasOwnProperty.call(
                                  selectedAllocates,
                                  item._id
                                )
                              ) {
                                setValidateError((prev) => ({
                                  ...prev,
                                  [item._id]: "Allocate to Someone"
                                }))
                                return
                              }
                              if (
                                !Object.prototype.hasOwnProperty.call(
                                  selectedAllocationType,
                                  item._id
                                )
                              ) {
                                setValidatetypeError((prev) => ({
                                  ...prev,
                                  [item._id]: "please select a Type"
                                }))
                                return
                              }
                              setselectedLeadId(item.leadId)
                              setShowmodal(true)
                              setSelectedItem(item)
                              setsubmitError({ submissionerror: "" })
                              setFormData({
                                allocationDate: new Date().toISOString().slice(0, 10),
                                allocationTime: new Date().toTimeString().slice(0, 5),
                                allocatedTo: "",
                                priority: "Medium",
                                expectedCompletionDate: "",
                                taskTitle: "",
                                allocationDescription: ""
                              })
                            }}
                          >
                            Allocate
                          </td>
                          <td className=" border border-t-0 border-b-0 border-gray-400 px-4 bg-white ">
                            {" "}
                            {item?.netAmount}
                          </td>
                        </tr>

                        <tr className="bg-white">
                          <td className="border border-t-0 border-r-0 border-b-0 border-gray-400 px-4 py-0.5 "></td>
                          <td className="border border-t-0 border-r-0 border-b-0 border-gray-400 px-4 py-0.5 ">
                            {item?.leadBy?.name}
                          </td>
                          <td className="border border-t-0 border-r-0 border-l-0 border-b-0 border-gray-400 px-4 py-0.5 ">
                            <div className="text-center">
                              <div className="inline-block">
                                <Select
                                  options={allocationOptions}
                                  value={selectedAllocates[item._id] || null}
                                  onChange={(selectedOption) => {
                                    setSelectedAllocates((prev) => ({
                                      ...prev,
                                      [item._id]: selectedOption
                                    }))
                                    handleSelectedAllocates(
                                      item,
                                      selectedOption.value
                                    )
                                    setValidateError((prev) => ({
                                      ...prev,
                                      [item._id]: ""
                                    }))
                                  }}
                                  className="w-44 focus:outline-red-500"
                                  styles={{
                                    control: (base) => ({
                                      ...base,
                                      minHeight: "32px", // control height
                                      height: "32px",
                                      boxShadow: "none", // removes blue glow
                                      borderColor: "red",
                                      cursor: "pointer",
                                      "&:hover": {
                                        borderColor: "red" // optional hover styling
                                      }
                                    }),
                                    option: (base, state) => ({
                                      ...base,
                                      cursor: "pointer", // 👈 ensures pointer on option hover
                                      backgroundColor: state.isFocused
                                        ? "#f0f0f0"
                                        : "white", // optional styling
                                      color: "black"
                                    }),
                                    valueContainer: (base) => ({
                                      ...base,
                                      paddingTop: "2px", // Reduce vertical padding
                                      paddingBottom: "2px"
                                    }),
                                    indicatorsContainer: (base) => ({
                                      ...base,
                                      height: "30px"
                                    }),
                                    menu: (provided) => ({
                                      ...provided,
                                      maxHeight: "200px", // Set dropdown max height
                                      overflowY: "auto" // Enable scrolling
                                    }),
                                    menuList: (provided) => ({
                                      ...provided,
                                      maxHeight: "200px", // Ensures dropdown scrolls internally
                                      overflowY: "auto"
                                    })
                                  }}
                                  menuPlacement="auto"
                                  menuPosition="absolute"
                                  menuPortalTarget={document.body} // Prevents nested scrolling issues
                                  menuShouldScrollIntoView={false}
                                />

                                {validateError[item._id] && (
                                  <p className="text-red-500 text-sm">
                                    {validateError[item._id]}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="border  border-t-0 border-r-0 border-l-0 border-b-0 border-gray-400 px-4 py-0.5"></td>
                          <td className="border  border-t-0 border-r-0 border-l-0 border-b-0  border-gray-400  px-4 py-0.5 "></td>
                          <td className="border  border-t-0 border-r-0 border-l-0 border-b-0 border-gray-400 px-4 py-0.5 ">
                            {new Date(item?.leadDate).toLocaleDateString()}
                          </td>
                          {/* <td className="border  border-t-0 border-r-0 border-b-0 border-gray-400 px-4 py-0.5 "></td> */}
                          <td className="border border-t-0 border-b-0 border-gray-400   px-4 py-0.5 "></td>
                          <td
                            className="border border-t-0 border-b-0 border-gray-400   px-4 py-0.5 text-red-400 hover:text-red-500 hover:cursor-pointer font-semibold"
                            // onClick={() => {
                            //   setIsclosed(true)

                            //   setselectedData(item)
                            // }}
                          >
                            <button
                              onClick={() => {
                                console.log("hhh")
                                const breadcrumb = [
                                  { label: "Lead", path: "", state: "" },
                                  {
                                    label: "Re Allocation List",
                                    path:
                                      loggedUser?.role === "Admin"
                                        ? "/admin/transaction/lead/leadReallocation"
                                        : "/staff/transaction/lead/leadReallocation"
                                    // state: {
                                    //   dates,
                                    //   ownLead,
                                    //   selecteduserBranch
                                    // }
                                  },
                                  { label: "Lead Closed", path: "" }
                                ]
                                loggedUser.role === "Admin"
                                  ? navigate(
                                      "/admin/transaction/lead/leadClosed",
                                      {
                                        state: {
                                          leadId: item._id,
                                          breadcrumb,
                                          closingOrigin: "reallocation"
                                        }
                                      }
                                    )
                                  : navigate(
                                      "/staff/transaction/lead/leadClosed",
                                      {
                                        state: {
                                          leadId: item._id,
                                          breadcrumb,
                                          closingOrigin: "reallocation"
                                        }
                                      }
                                    )
                              }}
                            >
                              Closed
                            </button>
                          </td>
                          <td className="border border-t-0 border-b-0 border-gray-400   px-4 py-0.5"></td>
                        </tr>
                        <tr className="bg-gray-100">
                          <td className="border border-l-1 border-t-0 border-gray-400 "></td>
                          <td
                            colSpan={5}
                            className="text-center py-1 font-semibold border border-t-0 border-gray-400"
                          >
                            <div className="flex  w-full">
                              {/* <span className="min-w-[100px]"></span> */}
                              <span className="mx-2">
                                {item?.submittedUser?.name} -
                              </span>
                              <span className="mx-2">
                                {item?.lasttask?.taskName}-
                              </span>
                              {/* <span>
                                {
                                  item?.activityLog[item.activityLog.length - 1]
                                    ?.remarks
                                }
                              </span> */}
                              <span className="mx-2 relative group inline-block max-w-[220px] align-middle">
                                <span className="block truncate text-[12px] text-slate-700">
                                  {item?.activityLog?.[
                                    item.activityLog.length - 1
                                  ]?.remarks || "-"}
                                </span>

                                {item?.activityLog?.[
                                  item.activityLog.length - 1
                                ]?.remarks && (
                                  <div className="pointer-events-none absolute left-0 top-full z-50 mt-1 hidden w-80 rounded-md border border-slate-200 bg-slate-700 px-3 py-2 shadow-lg group-hover:block">
                                    <p className="text-[11px] leading-4 text-white whitespace-normal break-words">
                                      {
                                        item?.activityLog?.[
                                          item.activityLog.length - 1
                                        ]?.remarks
                                      }
                                    </p>
                                  </div>
                                )}
                              </span>
                            </div>
                          </td>
                          {/* <td className="border border-t-0 border-gray-400 "></td> */}
                          <td className="border border-t-0 border-gray-400 "></td>
                          <td className="border border-t-0 border-gray-400"></td>
                          <td className="border border-t-0 border-gray-400 "></td>
                        </tr>
                        <tr>
                          <td colSpan="100%" className="bg-gray-300">
                            <div className="h-1"></div>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={10}
                        className="text-center text-gray-500 py-4"
                      >
                        {approvedToggleStatus ? (
                          toggleLoading ? (
                            <div className="flex justify-center">
                              <SkeletonTable color="#3b82f6" size={10} />
                            </div>
                          ) : (
                            <div>No Allocated Leads</div>
                          )
                        ) : loading ? (
                          <div className="flex justify-center">
                            <SkeletonTable color="#3b82f6" size={10} />
                          </div>
                        ) : toggleLoading ? (
                          <div className="flex justify-center">
                            <SkeletonTable color="#3b82f6" size={10} />
                          </div>
                        ) : (
                          <div>No Reallocation Leads</div>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-3 backdrop-blur-sm sm:p-4">
                  <div className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-h-[calc(100dvh-2rem)]">
                    {submitLoading && <BarLoader cssOverride={{ width: "100%", height: "4px" }} color="#2563eb" />}
                    <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
                      <div>
                        <h1 className="text-lg font-bold text-slate-900">
                          {isCodingAndQcModal ? "Allocate development work" : `Lead Reallocation · ${selectedType || "Task"}`}
                        </h1>
                        <p className="mt-0.5 text-xs text-slate-500">{selectedLeadId} · {selectedItem?.customerName?.customerName || "Lead reallocation"}</p>
                      </div>
                      <button type="button" onClick={() => { setShowmodal(false); setsubmitError({ submissionerror: "" }) }} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X size={18} /></button>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto">
                    {isCodingAndQcModal ? (
                      <div className="space-y-5 p-5">
                        <div className="grid gap-3 rounded-xl bg-slate-50 p-4 text-xs text-slate-600 sm:grid-cols-3">
                          <span><strong className="block text-slate-800">{selectedItem?.customerName?.customerName || "-"}</strong>Customer</span>
                          <span><strong className="block text-slate-800">{selectedLeadId || "-"}</strong>Lead ID</span>
                          <span><strong className="block text-slate-800">R&amp;D</strong>Department</span>
                          <span><strong className="block text-slate-800">{formData.allocationDate || "-"}</strong>Allocation date</span>
                          <span><strong className="block text-slate-800">{formData.allocationTime || "-"}</strong>Allocation time</span>
                          <span><strong className="block text-slate-800">Pending</strong>Initial status</span>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <label className="!text-left block text-xs font-semibold text-slate-700">Assigned by<input readOnly value={loggedUser?.name || "-"} className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-normal text-slate-600" /></label>
                          <label className="!text-left block text-xs font-semibold text-slate-700">Assigned developer<StyledSelect value={formData.allocatedTo || ""} onChange={(value) => setFormData((prev) => ({ ...prev, allocatedTo: value }))} placeholder="Select R&amp;D staff" options={rndAllocationOptions} /></label>
                          <label className="!text-left block text-xs font-semibold text-slate-700">Allocation date<input required type="date" value={formData.allocationDate || ""} onChange={(e) => setFormData((prev) => ({ ...prev, allocationDate: e.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal" /></label>
                          <label className="!text-left block text-xs font-semibold text-slate-700">Allocation time<input required type="time" value={formData.allocationTime || ""} onChange={(e) => setFormData((prev) => ({ ...prev, allocationTime: e.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal" /></label>
                          <label className="!text-left block text-xs font-semibold text-slate-700">Priority<StyledSelect value={formData.priority || "Medium"} onChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))} options={[{ value: "Medium", label: "Medium" }, { value: "High", label: "High" }, { value: "Low", label: "Low" }]} /></label>
                          <label className="!text-left block text-xs font-semibold text-slate-700">Expected completion date<input type="date" min={formData.allocationDate || undefined} value={formData.expectedCompletionDate || ""} onChange={(e) => setFormData((prev) => ({ ...prev, expectedCompletionDate: e.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal" /></label>
                        </div>
                        <label className="!text-left block text-xs font-semibold text-slate-700">Task title<input required value={formData.taskTitle || ""} onChange={(e) => setFormData((prev) => ({ ...prev, taskTitle: e.target.value }))} placeholder="Enter a clear task title" className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal" /></label>
                        <label className="!text-left block text-xs font-semibold text-slate-700">Task description<textarea required rows="5" value={formData.allocationDescription || ""} onChange={(e) => setFormData((prev) => ({ ...prev, allocationDescription: e.target.value }))} placeholder="Describe the work to be completed..." className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal" /></label>
                      </div>
                    ) : (
                      <div className="space-y-4 p-5">
                        <label className="!text-left block text-sm font-semibold text-slate-700">Completion date<input value={formData.allocationDate || ""} type="date" onChange={(e) => setFormData((prev) => ({ ...prev, allocationDate: e.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal" /></label>
                        <label className="!text-left block text-sm font-semibold text-slate-700">Description<textarea value={formData.allocationDescription || ""} onChange={(e) => setFormData((prev) => ({ ...prev, allocationDescription: e.target.value }))} placeholder="Type here..." className="mt-1.5 min-h-28 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal" /></label>
                      </div>
                    )}
                    </div>

                    {submiterror.submissionerror && <p className="px-5 text-sm text-rose-600">{submiterror.submissionerror}</p>}
                    <div className="sticky bottom-0 z-10 flex shrink-0 justify-end gap-3 border-t border-slate-100 bg-white px-5 py-4">
                      <button type="button" onClick={() => { setShowmodal(false); setsubmitError({ submissionerror: "" }) }} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
                      <button type="button" disabled={submitLoading} onClick={handleSubmit} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">{isCodingAndQcModal ? "Allocate task" : "Submit"}</button>
                    </div>
                  </div>
                </div>
              )}
              {isClosed && (
                <CollectionupdateModal
                  isClosed={true}
                  data={selectedData}
                  closemodal={setIsclosed}
                  partnerlist={partner}
                  loggedUser={loggedUser}
                  handleCollectionUpdate={handleCollectionUpdate}
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

function StyledSelect({ value, onChange, options, placeholder = "Select an option" }) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)
  const selected = options.find((option) => String(option.value) === String(value))

  useEffect(() => {
    if (!open) return undefined

    const closeOnOutsideClick = (event) => {
      if (!dropdownRef.current?.contains(event.target)) setOpen(false)
    }

    document.addEventListener("mousedown", closeOnOutsideClick)
    return () => document.removeEventListener("mousedown", closeOnOutsideClick)
  }, [open])

  return (
    <div ref={dropdownRef} className="relative mt-1.5">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`flex h-10 w-full items-center justify-between rounded-lg border bg-white px-3 text-left text-sm shadow-sm outline-none transition ${open ? "border-blue-500 ring-2 ring-blue-100" : "border-slate-200 hover:border-slate-300"}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={selected ? "text-slate-700" : "text-slate-400"}>
          {selected?.label || placeholder}
        </span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-[120] max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-slate-900/5" role="listbox">
          {options.length ? options.map((option) => {
            const isSelected = String(option.value) === String(value)
            return (
              <button
                type="button"
                key={option.value}
                onClick={() => { onChange(option.value); setOpen(false) }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${isSelected ? "bg-blue-50 font-semibold text-blue-700" : "text-slate-700 hover:bg-slate-50"}`}
                role="option"
                aria-selected={isSelected}
              >
                {option.label}
                {isSelected && <span className="text-xs text-blue-600">Selected</span>}
              </button>
            )
          }) : <p className="px-3 py-2.5 text-sm text-slate-400">No options available</p>}
        </div>
      )}
    </div>
  )
}

export default ReallocationTable
