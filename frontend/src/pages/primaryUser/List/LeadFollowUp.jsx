import { useState, useEffect, useRef } from "react"
import React from "react"
import { formatDate } from "../../../utils/dateUtils"
import MyDatePicker from "../../../components/common/MyDatePicker"
import { FaSpinner } from "react-icons/fa"
import Select from "react-select"
import { FaChevronDown } from "react-icons/fa" // You can use any icon
import { BsFilterLeft } from "react-icons/bs"
import { PropagateLoader } from "react-spinners"
import { useNavigate } from "react-router-dom"
import BarLoader from "react-spinners/BarLoader"
import api from "../../../api/api"
import { toast } from "react-toastify"
import UseFetch from "../../../hooks/useFetch"
const LeadFollowUp = () => {
  const [selectedLeadId, setSelectedLeadId] = useState(null)

  const [demoerror, setDemoError] = useState({
    selectStaff: "",
    allocationDate: "",
    demoDescription: ""
  })
  const [isdemofollownotClosed, setisdemofollowedNotClosed] = useState(false)
  const [ishavePayment, setishavePayment] = useState(false)
  const [isdropdownOpen, setIsdropdownOpen] = useState(false)
  const [taskClosed, setfollowupClosed] = useState(false)
  const [dates, setDates] = useState({ startDate: "", endDate: "" })
  const [editdemoIndex, setdemoEditIndex] = useState(null)
  const [
    editfollowUpDatesandRemarksEditIndex,
    setfollowUpDatesandRemarksEditIndex
  ] = useState(null)
  const [netTotalAmount, setnetTotalAmount] = useState(0)
  const [filterOpen, setfilterOpen] = useState(false)
  const [statusAll, setstatusAll] = useState(false)
  const [isAllocated, setIsAllocated] = useState(false) //for set allocation or not
  const [isOwner, setOwner] = useState(false)
  const [statusAllocated, setstatusAllocated] = useState(false)
  const [pending, setPending] = useState(true)
  const [allocatedLeads, setAllocatedLeads] = useState([])
  const [loader, setLoader] = useState(false)
  const [allocationOptions, setAllocationOptions] = useState([])
  const [selectedCompanyBranch, setselectedCompanyBranch] = useState("")
  const [isHaveEditchoice, setIsEditable] = useState(false)
  const [selectedDocId, setselectedDocid] = useState(null)
  const [selectedTab, setselectedTab] = useState("")
  const [hasOwnLeads, setHasownLeads] = useState(false)
  const [ownFollowUp, setOwnFollowUp] = useState(true)
  const [historyList, setHistoryList] = useState([])
  const [loggedUser, setloggedUser] = useState(null)
  const [loggedUserBranches, setloggedUserBranches] = useState([])
  const [followupDateLoader, setfollowupDateLoader] = useState(false)
  const [input, setInput] = useState("")
  const [showFullRemarks, setShowFullRemarks] = useState("")
  // const [selectedAllocates, setSelectedAllocates] = useState({})
  const [errors, setErrors] = useState({})
  const [demosubmitError, setDemofollowersubmitError] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [debouncedValue, setDebouncedValue] = useState("")
  const [followupDateModal, setfollowupDateModal] = useState(false)
  const [showFullName, setShowFullName] = useState(false)
  const [showFullEmail, setShowFullEmail] = useState(false)
  const dropdownRef = useRef(null)
  const [tableData, setTableData] = useState([])
  const [formData, setFormData] = useState({
    followUpDate: "",
    nextfollowUpDate: "",
    followedId: "",
    followupType: "infollowup",
    Remarks: ""
  })

  const [demoData, setDemodata] = useState({
    demoallocatedTo: "",
    demoallocatedDate: "",
    demoDescription: "",
    selectedType: ""
  })
  const navigate = useNavigate()
  const { data: branches } = UseFetch("/branch/getBranch")
  const { data } = UseFetch("/auth/getallUsers")
  const {
    data: loggedusersallocatedleads,
    loading,
    refreshHook
  } = UseFetch(
    loggedUser &&
      selectedCompanyBranch &&
      `/lead/getallLeadFollowUp?branchSelected=${selectedCompanyBranch}&loggeduserid=${loggedUser._id}&role=${loggedUser.role}&pendingfollowup=${pending}`
  )
  useEffect(() => {
    const now = new Date()
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1) // 1st day of current month
    const endDate = new Date() // 0th day of next month = last day of current

    setDates({ startDate, endDate })
  }, [statusAll])
  useEffect(() => {
    if (data && selectedCompanyBranch) {
      const { allusers = [], allAdmins = [] } = data

      const filteredSelectedBranchStaffs = allusers.filter((user) =>
        user.selected.some((sel) => sel.branch_id === selectedCompanyBranch)
      )
      const filtereduserandadmin = [
        ...filteredSelectedBranchStaffs,
        ...allAdmins
      ]
      setAllocationOptions(
        filtereduserandadmin.map((item) => ({
          value: item?._id,
          label: item?.name
        }))
      )
    }
  }, [data, selectedCompanyBranch])

  useEffect(() => {
    if (branches) {
      const userData = localStorage.getItem("user")
      const user = JSON.parse(userData)
      if (user.role === "Admin") {
        if (user?.selected) {
          const branches = user.selected.map((branch) => {
            return {
              value: branch.branch_id,
              label: branch.branchName
            }
          })
          setloggedUserBranches(branches)
        } else {
          const staffbranches = branches.map((branch) => {
            return {
              value: branch._id,
              label: branch.branchName
            }
          })

          setloggedUserBranches(staffbranches)
        }
      } else {
        const branches = user.selected.map((branch) => {
          return {
            value: branch.branch_id,
            label: branch.branchName
          }
        })
        setloggedUserBranches(branches)
      }

      setloggedUser(user)
    }
  }, [branches])
  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setfilterOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])
  useEffect(() => {
    if (loggedUserBranches && loggedUserBranches.length > 0) {
      const defaultbranch = loggedUserBranches[0]
      setselectedCompanyBranch(defaultbranch.value)
    }
  }, [loggedUserBranches, dates])
  // Close when clicking outside
  const formatdate = (date) => new Date(date).toISOString().split("T")[0]
  const getLocalDate = (date) => {
    const local = new Date(date)
    local.setMinutes(date.getMinutes() - date.getTimezoneOffset())
    return local.toISOString().split("T")[0] // e.g., "2025-06-12"
  }
  useEffect(() => {
    if (loggedusersallocatedleads && dates.endDate && loggedUser) {
      if (pending && ownFollowUp) {
        const ownFollow = loggedusersallocatedleads.followupLeads.filter(
          (lead) =>
            lead.activityLog?.some(
              (log) =>
                log.taskTo === "followup" &&
                log.taskallocatedTo._id === loggedUser._id &&
                log.followupClosed === false
            )
        )
        const currentDate = new Date()
        const endDateLocal = getLocalDate(new Date(dates.endDate))
        formatdate(currentDate)
        const fulldatecurrent =
          formatdate(currentDate) === endDateLocal
            ? // formatdate(dates.endDate)
              formatdate(currentDate)
            : endDateLocal

        const neverfollowupedLeads = ownFollow.filter(
          (lead) => lead.neverfollowuped
        )
        const havenextFollowup = ownFollow.filter(
          (lead) => lead.currentdateNextfollowup
        )
        const filteredcurrentdatefollowupLeads = havenextFollowup.filter(
          (lead) => formatdate(lead.nextFollowUpDate) === fulldatecurrent
        )
        const iscurrent =
          fulldatecurrent === endDateLocal ? fulldatecurrent : endDateLocal
        const overdueFollowups = havenextFollowup.filter(
          (lead) => formatdate(lead.nextFollowUpDate) < iscurrent
        )
        const uniqueoverdueAndcurrentdate = [
          ...new Set([...overdueFollowups, ...filteredcurrentdatefollowupLeads])
        ]

        const taskSubmittedLeads = ownFollow.filter(
          (lead) => lead.allocatedfollowup && lead.allocatedTaskClosed
        )
        const nonsubmittedtakleads = ownFollow.filter(
          (lead) => lead.allocatedfollowup && lead.allocatedTaskClosed === false
        )
        setAllocatedLeads(nonsubmittedtakleads)

        const mergedall = [
          ...neverfollowupedLeads,
          ...uniqueoverdueAndcurrentdate,
          ...taskSubmittedLeads
        ]

        const totalNetAmount = mergedall.reduce((total, lead) => {
          const leadTotal =
            lead.leadFor?.reduce((sum, item) => sum + (item.price || 0), 0) || 0
          return total + leadTotal
        }, 0)

        // then store it in state
        setnetTotalAmount(totalNetAmount)

        // mergedall.forEach((item)=>)
        setTableData(mergedall)
      } else if (pending && !ownFollowUp) {
        const currentDate = new Date()
        const endDateLocal = getLocalDate(new Date(dates.endDate))
        formatdate(currentDate)
        const fulldatecurrent =
          formatdate(currentDate) === endDateLocal
            ? // formatdate(dates.endDate)
              formatdate(currentDate)
            : endDateLocal

        const neverfollowupedLeads =
          loggedusersallocatedleads.followupLeads.filter(
            (lead) => lead.neverfollowuped
          )
        const havenextFollowup = loggedusersallocatedleads.followupLeads.filter(
          (lead) => lead.currentdateNextfollowup
        )
        const filteredcurrentdatefollowupLeads = havenextFollowup.filter(
          (lead) => formatdate(lead.nextFollowUpDate) === fulldatecurrent
        )
        const iscurrent =
          fulldatecurrent === endDateLocal ? fulldatecurrent : endDateLocal
        const overdueFollowups = havenextFollowup.filter(
          (lead) => formatdate(lead.nextFollowUpDate) < iscurrent
        )
        const uniqueoverdueAndcurrentdate = [
          ...new Set([...overdueFollowups, ...filteredcurrentdatefollowupLeads])
        ]

        const taskSubmittedLeads =
          loggedusersallocatedleads.followupLeads.filter(
            (lead) => lead.allocatedfollowup && lead.allocatedTaskClosed
          )
        const nonsubmittedtakleads =
          loggedusersallocatedleads.followupLeads.filter(
            (lead) =>
              lead.allocatedfollowup && lead.allocatedTaskClosed === false
          )
        setAllocatedLeads(nonsubmittedtakleads)

        const mergedall = [
          ...neverfollowupedLeads,
          ...uniqueoverdueAndcurrentdate,
          ...taskSubmittedLeads
        ]
        const totalNetAmount = mergedall.reduce((total, lead) => {
          const leadTotal =
            lead.leadFor?.reduce((sum, item) => sum + (item.price || 0), 0) || 0
          return total + leadTotal
        }, 0)

        // then store it in state
        setnetTotalAmount(totalNetAmount)
        setTableData(mergedall)
      } else if (!pending && ownFollowUp) {
        const totalNetAmount = loggedusersallocatedleads.followupLeads.reduce(
          (total, lead) => {
            const leadTotal =
              lead.leadFor?.reduce((sum, item) => sum + (item.price || 0), 0) ||
              0
            return total + leadTotal
          },
          0
        )

        // then store it in state
        setnetTotalAmount(totalNetAmount)
        setTableData(loggedusersallocatedleads.followupLeads)
      } else if (!pending && !ownFollowUp) {
        setTableData(loggedusersallocatedleads.followupLeads)
      }

      setHasownLeads(loggedusersallocatedleads.ischekCollegueLeads)
    }
  }, [loggedusersallocatedleads, dates, pending, ownFollowUp, loggedUser])

  useEffect(() => {
    if (loggedUser) {
      setFormData((prev) => ({
        ...prev,
        followedId: loggedUser?._id
      }))
    }
  }, [loggedUser])

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(input) // this is your debounced result
    }, 2000) // 500ms debounce delay

    return () => {
      clearTimeout(handler) // cleanup
    }
  }, [input])

  const handleDataChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
    if (isAllocated) {
      setDemodata((prev) => ({
        ...prev,
        ...(name === "nextfollowUpDate" || name === "allocationDate"
          ? { demoallocatedDate: value }
          : { demoDescription: value })
      }))
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" })) //Clear error
    }
    if (name === "Remarks") {
      if (demoerror.demoDescription) {
        setDemoError((prev) => ({ ...prev, demoDescription: "" }))
      }
    } else if (name === "nextfollowUpDate") {
      if (errors.nextfollowUpDate) {
        setErrors((prev) => ({
          ...prev,
          nextfollowUpDate: ""
        }))
      }
    } else if (name === "allocationDate") {
      if (demoerror.allocationDate) {
        setDemoError((prev) => ({
          ...prev,
          allocationDate: ""
        }))
      }
    }
  }
  const handleHistory = (
    history,
    leadid,
    docId,
    allocatedTo,
    taskfromFollowup,
    netAmount,
    balanceAmount
  ) => {
    setFormData((prev) => ({
      ...prev,
      netAmount,
      balanceAmount
    }))
    const owner = loggedUser._id === allocatedTo
    setOwner(owner)
    const isHaveDemo = taskfromFollowup ? history[history.length - 1] : null
    if (isHaveDemo) {
      const demoassignedDate = formatDate(isHaveDemo.submissionDate)
      setdemoEditIndex(history.length - 1)
      setfollowUpDatesandRemarksEditIndex(history.length - 1)
      setDemodata({
        selectedType: isHaveDemo?.taskTo,
        demoallocatedTo: isHaveDemo?.taskallocatedTo?._id,
        demoallocatedDate: isHaveDemo?.allocationDate.toString().split("T")[0],
        demoassignedDate,
        demoDescription: isHaveDemo?.remarks
      })

      setisdemofollowedNotClosed(true)
      setIsEditable(true)
      setIsAllocated(true)
    }

    const userFollowups = history.filter(
      (item) =>
        item.submittedUser._id === loggedUser._id && item.taskBy === "followup"
    )

    const isAllFollowupsClosed =
      userFollowups.length > 0 &&
      userFollowups.every((item) => item.taskClosed === true)
    setfollowupClosed(!pending)

    setselectedDocid(docId)
    setselectedTab("History")
    setShowModal(!showModal)
    setHistoryList(history)
    setSelectedLeadId(leadid)
  }
  const handlefollowupdate = (Id, docId) => {
    setfollowupDateModal(true)
    setSelectedLeadId(Id)
    setselectedDocid(docId)
    if (!demoData.demoallocatedTo) {
      setFormData((prev) => ({
        ...prev,
        followUpDate: new Date().toISOString().split("T")[0]
      }))
    }
  }
  const handleDemoSubmit = async () => {
    if (isdemofollownotClosed) {
      setDemoError((prev) => ({
        ...prev,
        submiterror: "Cant submit, demo is not closed",
        demoDescription: ""
      }))
      return
    }
    const newError = {}
    if (demoData.demoallocatedDate === "") {
      newError.allocationDate = "Allocation Date is  Required"
    }
    if (demoData.demoDescription === "") {
      newError.demoDescription = "Remarks is Required"
    }
    if (demoData.demoallocatedTo === "") {
      newError.selectStaff = "Staff is Required"
    }
    if (demoData.selectedType === "") {
      newError.allocationTyperror = "Type is Required"
    }
    if (Object.keys(newError).length > 0) {
      setDemoError(newError)
      return
    }

    try {
      setLoader(true)

      const response = await api.post(
        `/lead/setdemolead?demoallocatedBy=${loggedUser._id}&leaddocId=${selectedDocId}`,

        demoData
      )

      setLoader(false)
      setFormData((prev) => ({
        ...prev,
        followUpDate: "",
        nextfollowUpDate: "",
        followedId: "",
        Remarks: ""
      }))
      setIsAllocated(false)
      setDemodata((prev) => ({
        ...prev,
        demoallocatedTo: "",
        demoallocatedDate: "",
        demoDescription: "",
        selectedType: ""
      }))
      refreshHook()
      toast.success(response.data.message)
      setShowModal(false)
    } catch (error) {
      toast.error("something went wrong ")
      console.log(error)
    }
  }
  const handleFollowUpDateSubmit = async () => {
    try {
      let newErrors = {}
      if (!formData.followUpDate)
        newErrors.followUpDate = "Follow Up Date is required"
      if (formData.followupType === "infollowup") {
        if (!formData.nextfollowUpDate) {
          newErrors.nextfollowUpDate = "Next Follow Up Date Is Required"
        }
      }
      if (formData.followupType === "closed" && ishavePayment) {
        if (!formData.recievedAmount) {
          newErrors.recievedAmount = "Add recieved Amount"
        }
      }
      if (!formData.Remarks) newErrors.Remarks = "Remarks is Required"
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        return
      }
      setfollowupDateLoader(!followupDateLoader)

      const response = await api.put(
        `/lead/followupDateUpdate?selectedleaddocId=${selectedDocId}&loggeduserid=${loggedUser._id}`,
        formData
      )
      if (response.status === 200) {
        toast.success(response.data.message)
        setIsEditable(false)

        setselectedDocid(null)
        setSelectedLeadId(null)
        setHistoryList([])
        setShowModal(false)
        setfollowupDateModal(false)
        setFormData({
          followUpDate: "",
          nextfollowUpDate: "",

          Remarks: ""
        })
        refreshHook()
      } else {
        toast.error("something went wrong")
      }
      setfollowupDateLoader(false)
    } catch (error) {
      setIsEditable(false)
      console.log("error:", error.message)
    }
  }

  return (
    <div className="h-full flex flex-col ">
      {loading && (
        <BarLoader
          cssOverride={{ width: "100%", height: "4px" }} // Tailwind's `h-4` corresponds to `16px`
          color="#4A90E2" // Change color as needed
        />
      )}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center mx-3 md:mx-5 mt-3 mb-3 gap-4">
        {/* Title */}
        <h2 className="text-lg font-bold">Lead Follow Up</h2>

        {/* Right Section */}
        <div className="grid grid-cols-2 md:flex md:flex-nowrap md:gap-6 gap-3 md:items-center w-full md:w-auto">
          {/* Date Picker */}
          {dates.startDate && (
            <div className="w-full ">
              <MyDatePicker setDates={setDates} dates={dates} />
            </div>
          )}
          {/* Filter Button */}
          <div className="relative flex justify-end " ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setfilterOpen(!filterOpen)}
              className="p-1 rounded-md bg-gray-100 md:bg-white border border-gray-300 shadow-sm hover:shadow-md hover:bg-gray-50 transition"
              title="Filter Options"
            >
              <BsFilterLeft className="text-md md:text-xl text-gray-800 md:text-gray-700 hover:text-black" />
            </button>

            {filterOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white  border border-gray-200 rounded-xl shadow-2xl z-50 p-4 space-y-5 animate-fade-in-down">
                <h3 className="text-base font-semibold text-gray-800 border-b pb-2">
                  Filters
                </h3>

                {/* Filter Toggles */}
                {[
                  {
                    label: statusAll ? "All Leads" : "Filtered Leads",
                    value: statusAll,
                    toggle: () => setstatusAll(!statusAll)
                  },
                  {
                    label: statusAllocated
                      ? "Allocated Leads"
                      : "Unallocated Leads",
                    value: statusAllocated,
                    toggle: () => setstatusAllocated(!statusAllocated)
                  },
                  {
                    label: pending ? "Pending Followup" : "Cleared Followup",
                    value: pending,
                    toggle: () => {
                      setPending(!pending)
                      setTableData([])
                    }
                  },
                  {
                    label: ownFollowUp ? "Own Followup" : "All Followup",
                    value: ownFollowUp,
                    toggle: () => {
                      setOwnFollowUp(!ownFollowUp)
                      setTableData([])
                    }
                  }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-sm font-medium text-gray-700 group"
                  >
                    <span className="group-hover:text-black transition">
                      {item.label}
                    </span>
                    <button
                      onClick={item.toggle}
                      className={`${
                        item.value ? "bg-emerald-400" : "bg-gray-300"
                      } w-8 h-5 flex items-center rounded-full transition-colors duration-300`}
                    >
                      <div
                        className={`${
                          item.value ? "translate-x-3" : "translate-x-0"
                        } w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Branch Dropdown */}
          <select
            value={selectedCompanyBranch || ""}
            onChange={(e) => setselectedCompanyBranch(e.target.value)}
            className="border border-gray-300 py-0.5 rounded-md px-2 focus:outline-none w-36 md:min-w-[120px]"
          >
            {loggedUserBranches?.map((branch) => (
              <option key={branch.value} value={branch.value}>
                {branch.label}
              </option>
            ))}
          </select>
          {/* New Lead Button */}
          <div className="flex justify-end">
            {" "}
            <button
              onClick={() =>
                loggedUser.role === "Admin"
                  ? navigate("/admin/transaction/lead")
                  : navigate("/staff/transaction/lead")
              }
              className="bg-black text-white py-0.5 px-3 rounded-lg shadow-lg hover:bg-gray-600 w-24"
            >
              New Lead
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-end mr-5">
        <span className="text-blue-700">{`Total Amount - ${netTotalAmount}`}</span>
      </div>

      {/* Responsive Table Container */}
      <div className="flex-1 overflow-x-auto rounded-lg text-center overflow-y-auto  shadow-xl md:mx-5 mx-3 mb-3">
        <table className=" border-collapse border border-gray-400 w-full text-sm">
          <thead className=" whitespace-nowrap bg-blue-600 text-white sticky top-0 z-30">
            <tr>
              <th className="border border-r-0 border-gray-400 px-4 ">Name</th>
              <th className="border border-r-0 border-l-0 border-gray-400  px-4 max-w-[200px] min-w-[200px]">
                Mobile
              </th>
              <th className="border border-r-0 border-l-0 border-gray-400 px-4 ">
                Phone
              </th>
              <th className="border border-r-0 border-l-0 border-gray-400 px-4 ">
                Email
              </th>
              <th className="border border-r-0 border-l-0 border-gray-400 px-4  min-w-[100px]">
                Lead Id
              </th>
              <th className="border border-gray-400 px-4 ">Followup Date</th>
              <th className="border border-gray-400 px-4  min-w-[100px]">
                Action
              </th>
              <th className="border border-gray-400 px-4 py-2">Net Amount</th>
            </tr>
          </thead>
          <tbody>
            {(statusAllocated ? allocatedLeads : tableData)?.length > 0 ? (
              (statusAllocated ? allocatedLeads : tableData).map(
                (item, index) => (
                  <React.Fragment key={index}>
                    <tr className="bg-white ">
                      <td
                        onClick={() => setShowFullName(!showFullName)}
                        className={`px-4 cursor-pointer overflow-hidden ${
                          showFullName
                            ? "whitespace-normal max-h-[3em]" // ≈2 lines of text (1.5em line-height)
                            : "truncate whitespace-nowrap max-w-[120px]"
                        }`}
                        style={{ lineHeight: "1.5em" }} // fine-tune as needed
                      >
                        {item.customerName.customerName}
                      </td>
                      <td className="  px-4 ">{item?.mobile}</td>
                      <td className="px-4 ">{item?.phone}</td>
                      <td className="px-4 ">{item?.email}</td>
                      <td className=" px-4 ">{item?.leadId}</td>
                      <td className="border border-b-0 border-gray-400 px-4 "></td>

                      <td className="border border-b-0 border-gray-400 px-1  text-blue-400 min-w-[50px] hover:text-blue-500 hover:cursor-pointer font-semibold">
                        <button
                          onClick={() => {
                            const isAllocatedToeditable = item.activityLog.some(
                              (it) =>
                                it?.taskallocatedTo?._id === loggedUser._id &&
                                it?.taskClosed === false
                            )

                            loggedUser.role === "Admin"
                              ? navigate("/admin/transaction/lead/leadEdit", {
                                  state: {
                                    leadId: item._id,
                                    isReadOnly: !isAllocatedToeditable
                                  }
                                })
                              : navigate("/staff/transaction/lead/leadEdit", {
                                  state: {
                                    leadId: item._id,
                                    isReadOnly: !isAllocatedToeditable
                                  }
                                })
                          }}
                          className="text-blue-400 hover:text-blue-500 font-semibold cursor-pointer"
                        >
                          View / Modify
                        </button>
                      </td>
                      <td className="borrder border-b-0 border-gray-400 px-4 "></td>
                    </tr>

                    <tr className=" font-semibold bg-gray-200">
                      <td className=" px-4 ">Leadby</td>
                      <td className=" px-4">Assignedto</td>
                      <td className=" px-4 ">Assignedby</td>
                      <td className="px-4 ">No. of Followups</td>
                      <td className="px-4 min-w-[120px]">Lead Date</td>
                      <td className=" border border-t-0 border-b-0 border-gray-400 px-4 ">
                        {item.activityLog[item.activityLog.length - 1]
                          ?.nextFollowUpDate
                          ? new Date(
                              item.activityLog[
                                item.activityLog.length - 1
                              ]?.nextFollowUpDate
                            )
                              .toLocaleDateString("en-GB")
                              .split("/")
                              .join("-")
                          : "-"}
                      </td>
                      <td className=" border border-t-0 border-b-0 border-gray-400 px-4  text-blue-400 hover:text-blue-500 hover:cursor-pointer">
                        <button
                          type="button"
                          onClick={() =>
                            handleHistory(
                              item?.activityLog,
                              item.leadId, //like 00001
                              item?._id, //lead doc id
                              item?.allocatedTo?._id,
                              item?.taskfromFollowup,
                              item?.netAmount,
                              item?.balanceAmount
                            )
                          }
                        >
                          Follow Up
                        </button>
                      </td>
                      <td className=" border border-t-0 border-b-0 border-gray-400 px-4 ">
                        {item.netAmount}{" "}
                      </td>
                    </tr>

                    <tr className="bg-white">
                      <td className="border border-t-0 border-r-0  border-gray-400 px-4 py-0.5 ">
                        {item?.leadBy?.name}
                      </td>
                      <td className="border border-t-0 border-r-0 border-l-0  border-gray-400 px-4 py-0.5 ">
                        {item?.allocatedTo?.name}
                      </td>
                      <td className="border  border-t-0 border-r-0 border-l-0  border-gray-400 px-4 py-0.5">
                        {item.allocatedBy?.name}
                      </td>
                      <td className="border  border-t-0 border-r-0 border-l-0  border-gray-400  px-4 py-0.5 "></td>
                      <td className="border  border-t-0 border-r-0 border-l-0  border-gray-400 px-4 py-0.5 ">
                        {item.leadDate?.toString().split("T")[0]}
                      </td>
                      <td className="border border-t-0 border-gray-400   px-4 py-0.5 "></td>
                      <td className="border border-t-0 border-gray-400   px-4 py-0.5"></td>
                      <td className="border border-t-0 border-gray-400   px-4 py-0.5"></td>
                    </tr>
                  </React.Fragment>
                )
              )
            ) : (
              <tr>
                <td colSpan={8} className="text-center text-gray-500 py-4">
                  {loading ? (
                    <div className="justify center">
                      <PropagateLoader color="#3b82f6" size={10} />
                    </div>
                  ) : (
                    "No data available."
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-40 ">
            <div
              className={`bg-white shadow-xl   text-center w-full ${
                selectedTab === "Next Follow Up"
                  ? "md:w-80"
                  : selectedTab === "Demo"
                  ? "md:w-1/3"
                  : "md:w-1/2"
              } px-2 md:px-5 rounded-lg pb-3 `}
            >
              {loader && (
                <BarLoader
                  cssOverride={{ width: "100%", height: "4px" }} // Tailwind's `h-4` corresponds to `16px`
                  color="#4A90E2" // Change color as needed
                />
              )}
              <div className="text-gray-600 font-semibold space-x-6 mb-1">
                <span
                  className={`hover:cursor-pointer pb-1 ${
                    selectedTab === "History"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : ""
                  }`}
                  onClick={() => {
                    setselectedTab("History")
                    setIsAllocated(false)
                    // setfollowupDateModal(false)
                  }}
                >
                  History
                </span>
                {isOwner && !taskClosed && (
                  <span
                    className={`hover:cursor-pointer pb-1 ${
                      selectedTab === "Next Follow Up"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : ""
                    }`}
                    onClick={() => {
                      handlefollowupdate(selectedLeadId, selectedDocId)
                      setselectedTab("Next Follow Up")
                    }}
                  >
                    Next Follow Up
                  </span>
                )}
              </div>

              <h1 className=" font-bold">
                {`${
                  selectedTab === "Next Follow Up"
                    ? isAllocated
                      ? "Demo Follow Up"
                      : selectedTab
                    : selectedTab + " of"
                } LEAD ID - ${selectedLeadId}`}
              </h1>
              {(() => {
                switch (selectedTab) {
                  case "History":
                    return (
                      <div className="overflow-x-auto overflow-y-auto  md:max-h-64 lg:max-h-96 shadow-xl rounded-lg">
                        <table className="w-full text-sm border-collapse">
                          <thead className="text-center sticky top-0 z-10">
                            <tr className="bg-indigo-100">
                              <th className="border border-indigo-200 p-2 min-w-[100px] ">
                                Date
                              </th>
                              <th className="border border-indigo-200 p-2 min-w-[100px] ">
                                User
                              </th>
                              <th className="border border-indigo-200 p-2 min-w-[100px] ">
                                Task
                              </th>
                              <th className="border border-indigo-200 p-2 w-fit min-w-[200px]">
                                Remarks
                              </th>
                              <th className="border border-indigo-200 p-2 min-w-[100px] ">
                                Next Follow Up Date
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {historyList && historyList.length > 0 ? (
                              historyList.map((item, index) => {
                                const hasFollowerData =
                                  Array.isArray(item.folowerData) &&
                                  item.folowerData.length > 0

                                return hasFollowerData ? (
                                  item.folowerData.map((subItem, subIndex) => (
                                    <tr
                                      key={`${index}-${subIndex}`}
                                      className={
                                        (index + subIndex) % 2 === 0
                                          ? "bg-gray-50"
                                          : "bg-white"
                                      }
                                    >
                                      <td className="border border-gray-200 p-2">
                                        {new Date(subItem.followerDate)
                                          .toLocaleDateString("en-GB")
                                          .split("/")
                                          .join("-")}
                                      </td>
                                      <td className="border border-gray-200 p-2">
                                        {item?.followedId?.name}
                                      </td>

                                      <td className="border border-gray-200 p-2">
                                        {subItem?.followerDescription || "N/A"}
                                      </td>
                                      <td className="border border-gray-200 p-2"></td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr
                                    key={index}
                                    className={
                                      index % 2 === 0
                                        ? "bg-gray-50"
                                        : "bg-white"
                                    }
                                  >
                                    <td className="border border-gray-200 p-2">
                                      {new Date(item.submissionDate)
                                        .toLocaleDateString("en-GB")
                                        .split("/")
                                        .join("-")}
                                    </td>
                                    <td className="border border-gray-200 p-2">
                                      {item?.submittedUser?.name}
                                    </td>
                                    <td className="border border-gray-200 p-2 min-w-[160px] text-nowrap">
                                      <div className="flex justify-center">
                                        {item.taskTo ? (
                                          <>
                                            <span>{item.taskBy}</span>-
                                            <span>
                                              {item.taskallocatedTo?.name}
                                            </span>
                                          </>
                                        ) : (
                                          item.taskBy
                                        )}
                                      </div>

                                      {item.taskTo && (
                                        <>
                                          <span>{item.taskTo}</span>
                                          {item.allocationDate && (
                                            <span>
                                              -on(
                                              {new Date(
                                                item.allocationDate
                                              ).toLocaleDateString("en-GB")}
                                              )
                                            </span>
                                          )}
                                        </>
                                      )}
                                    </td>
                                    <td className="border border-gray-200 p-2">
                                      {item?.remarks || "N/A"}
                                    </td>
                                    <td className="border border-gray-200 p-2">
                                      {item?.nextFollowUpDate
                                        ? new Date(item?.nextFollowUpDate)
                                            .toLocaleDateString("en-GB")
                                            .split("/")
                                            .join("-")
                                        : "-"}
                                    </td>
                                  </tr>
                                )
                              })
                            ) : (
                              <tr>
                                <td
                                  colSpan={4}
                                  className="text-center bg-white p-3 text-gray-500 italic"
                                >
                                  No followUp s
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )
                  case "Next Follow Up":
                    return (
                      <div className="text-center w-fullrounded-lg">
                        <div className=" rounded-lg grid grid-cols-1 gap-1  p-3 shadow-xl bg-white">
                          <div>
                            <label className="block text-left font-semibold text-gray-500">
                              Follow Up
                            </label>
                            <input
                              type="text"
                              readOnly
                              name="followUpDate"
                              // value={formData?.followUpDate || ""}
                              value={
                                demoData.demoassignedDate
                                  ? demoData.demoassignedDate
                                      .toString()
                                      .split("T")[0]
                                  : formData?.followUpDate
                                  ? new Date(formData.followUpDate)
                                      .toLocaleDateString("en-GB") // this gives dd/mm/yyyy
                                      .replace(/\//g, "-") // change / to -
                                  : ""
                              }
                              className="rounded-md w-full py-1 px-2 border border-gray-200 focus:outline-none shadow-xl"
                              onChange={handleDataChange}
                            />
                            {errors.followUpDate && (
                              <p className="text-red-500">
                                {errors.followUpDate}
                              </p>
                            )}
                          </div>

                          <div className="flex justify-between gap-2 items-center mt-2">
                            {formData.followupType === "infollowup" && (
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  disabled={isdemofollownotClosed}
                                  id="allocation"
                                  className={`w-4 h-4  ${
                                    isdemofollownotClosed
                                      ? "cursor-not-allowed"
                                      : ""
                                  }`}
                                  checked={isAllocated}
                                  onChange={() => {
                                    if (
                                      formData.followupType === "closed" ||
                                      formData.followupType === "lost"
                                    ) {
                                      return
                                    }
                                    setIsAllocated(!isAllocated)
                                    setFormData((prev) => ({
                                      ...prev,
                                      Remarks: "",
                                      nextfollowUpDate: ""
                                    }))
                                  }}
                                />
                                <label
                                  htmlFor="allocation"
                                  className="text-md ml-2"
                                >
                                  Allocation
                                </label>
                              </div>
                            )}

                            <div className="relative inline-block w-32">
                              <select
                                disabled={isAllocated}
                                onChange={(e) => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    followupType: e.target.value
                                  }))
                                }}
                                onFocus={() => setIsdropdownOpen(true)}
                                onBlur={() => setIsdropdownOpen(false)}
                                className={`appearance-none px-2 border border-gray-300 rounded-md py-1 mr-2 w-full focus:outline-none shadow-md ${
                                  isAllocated
                                    ? "cursor-not-allowed bg-gray-200 border border-gray-300"
                                    : "cursor-pointer"
                                }`}
                              >
                                <option value="infollowup">Infollowup</option>
                                <option value="closed">Closed</option>
                                <option value="lost">Lost</option>
                              </select>

                              <FaChevronDown
                                className={`absolute right-2 ml-2 top-1/2 h-3 w-4  transform -translate-y-1/2 transition-transform duration-200 pointer-events-none ${
                                  isdropdownOpen ? "rotate-180" : "rotate-0"
                                }`}
                              />
                            </div>
                          </div>

                          {isAllocated && (
                            <>
                              <div>
                                <label className="block text-left font-semibold text-gray-500">
                                  Allocation Type
                                </label>
                                <select
                                  disabled={isdemofollownotClosed}
                                  value={demoData?.selectedType || ""}
                                  onChange={(e) => {
                                    setDemodata((prev) => ({
                                      ...prev,
                                      selectedType: e.target.value
                                    }))
                                    setDemoError((prev) => ({
                                      ...prev,
                                      allocationTyperror: ""
                                    }))
                                  }}
                                  className={`py-1 border border-gray-300 shadow-xl rounded-md  w-full focus:outline-none cursor-pointer ${
                                    isdemofollownotClosed ? "bg-gray-200" : ""
                                  }`}
                                >
                                  <option>Select Type</option>

                                  <option value="programming">
                                    Programming
                                  </option>
                                  <option value="testing-&-implementation">
                                    Testing & Implementation
                                  </option>
                                  <option value="coding-&-testing">
                                    Coding & Testing
                                  </option>
                                  <option value="software-services">
                                    Software Service
                                  </option>
                                  <option value="customermeet">
                                    Customer Meet
                                  </option>
                                  <option value="demo">Demo</option>
                                  <option value="training">Training</option>

                                  <option value="onsite">Onsite</option>
                                  <option value="office">Office</option>
                                </select>
                              </div>
                              {demoerror.allocationTyperror && (
                                <p className="text-red-500 text-sm text-left">
                                  {demoerror.allocationTyperror}
                                </p>
                              )}
                              <div className=" text-left">
                                <label
                                  htmlFor="staffName"
                                  className="block text-sm  font-medium  text-gray-700 "
                                >
                                  Select Staff
                                </label>
                                <Select
                                  options={allocationOptions}
                                  isDisabled={isdemofollownotClosed}
                                  value={
                                    allocationOptions.find(
                                      (option) =>
                                        option.value ===
                                        demoData.demoallocatedTo
                                    ) || null
                                  }
                                  onChange={(selectedOption) => {
                                    setDemodata((prev) => ({
                                      ...prev,
                                      demoallocatedTo: selectedOption.value
                                    }))
                                    setDemoError((prev) => ({
                                      ...prev,
                                      selectStaff: ""
                                    }))
                                  }}
                                  className="w-full  focus:outline-none shadow-xl "
                                  styles={{
                                    control: (base, state) => ({
                                      ...base,
                                      minHeight: "32px", // control height
                                      height: "32px",
                                      boxShadow: "none", // removes blue glow
                                      borderColor: "gray",
                                      cursor: state.isDisabled
                                        ? "not-allowed"
                                        : "",
                                      backgroundColor: state.isDisabled
                                        ? "#f3f4f6"
                                        : "white",
                                      color: state.isDisabled
                                        ? "#6b7280"
                                        : "black", // Tailwind's text-gray-500
                                      opacity: state.isDisabled ? 0.7 : 1
                                    }),
                                    option: (base, state) => ({
                                      ...base,
                                      cursor: "pointer", // 👈 ensures pointer on option hover
                                      backgroundColor: state.isFocused
                                        ? "#f9f9f9"
                                        : "white", // optional styling
                                      color: "red",
                                      paddingTop: "6px", // padding for dropdown items
                                      paddingBottom: "6px"
                                    }),
                                    valueContainer: (base) => ({
                                      ...base,
                                      paddingTop: "0px", // Reduce vertical padding
                                      paddingBottom: "0px",
                                      paddingLeft: "8px",
                                      height: "26px"
                                    }),
                                    indicatorsContainer: (base) => ({
                                      ...base,
                                      height: "30px"
                                    }),
                                    menuPortal: (base) => ({
                                      ...base,
                                      zIndex: 9999 // 🔥 Set high z-index here
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
                              </div>
                            </>
                          )}
                          {demoerror.selectStaff && (
                            <p className="text-red-500 text-sm text-left">
                              {demoerror.selectStaff}
                            </p>
                          )}
                          {formData.followupType === "infollowup" && (
                            <div>
                              <label className="block text-left font-semibold text-gray-500">
                                {isAllocated
                                  ? "Allocation Date"
                                  : "Next Follow Up"}
                              </label>
                              <input
                                type="date"
                                name={
                                  isAllocated
                                    ? "allocationDate"
                                    : "nextfollowUpDate"
                                }
                                disabled={isdemofollownotClosed}
                                value={
                                  demoData.demoallocatedDate ||
                                  formData?.nextfollowUpDate
                                }
                                className="rounded-md w-full py-1 px-2 border border-gray-200 focus:outline-none hover:cursor-pointer shadow-xl"
                                onChange={handleDataChange}
                              />
                              <div className="text-left text-sm">
                                {errors.nextfollowUpDate && (
                                  <p className="text-red-500">
                                    {errors.nextfollowUpDate}
                                  </p>
                                )}

                                {demoerror.allocationDate && (
                                  <p className="text-red-500">
                                    {demoerror.allocationDate}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                          {formData.followupType === "closed" && (
                            <>
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={ishavePayment}
                                  onChange={() =>
                                    setishavePayment(!ishavePayment)
                                  }
                                  className="w-4 h-4"
                                />
                                <label
                                  htmlFor="allocation"
                                  className="text-md ml-2"
                                >
                                  Is Have Payment
                                </label>
                              </div>

                              {ishavePayment && (
                                <>
                                  <div>
                                    <label className="block text-left font-semibold text-gray-500">
                                      Net Amount
                                    </label>
                                    <input
                                      disabled
                                      type="number"
                                      value={formData?.netAmount}
                                      className="py-1 pl-2 border border-gray-300 w-full rounded-md shadow-xl cursor-not-allowed bg-gray-100"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-left font-semibold text-gray-500">
                                      Balance Amount
                                    </label>
                                    <input
                                      disabled
                                      type="number"
                                      value={formData?.balanceAmount}
                                      className="py-1 pl-2 border border-gray-300 w-full  rounded-md shadow-xl"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-left font-semibold text-gray-500">
                                      Recieved Amount
                                    </label>
                                    <input
                                      type="number"
                                      value={formData.recievedAmount}
                                      onChange={(e) => {
                                        if (errors.recievedAmount) {
                                          setErrors((prev) => ({
                                            ...prev,
                                            recievedAmount: ""
                                          }))
                                        }
                                        setFormData((prev) => ({
                                          ...prev,
                                          recievedAmount: e.target.value
                                        }))
                                      }}
                                      className="py-1 pl-2 border border-gray-300 w-full  rounded-md shadow-xl focus:outline-none"
                                    />
                                    {errors.recievedAmount && (
                                      <p className="text-red-500">
                                        {errors.recievedAmount}
                                      </p>
                                    )}
                                  </div>
                                </>
                              )}
                            </>
                          )}

                          <div>
                            <label className="block text-left">Remarks</label>
                            <textarea
                              rows={3}
                              disabled={isdemofollownotClosed}
                              name="Remarks"
                              className={`rounded-lg w-full border border-gray-200 shadow-xl focus:outline-none px-2 ${
                                isdemofollownotClosed
                                  ? "cursor-not-allowed bg-gray-200"
                                  : "cursor-text"
                              }`}
                              value={
                                formData?.Remarks || demoData.demoDescription
                              }
                              onChange={handleDataChange}
                            />
                            <div className="text-left text-sm">
                              {errors.Remarks && (
                                <p className="text-red-500">{errors.Remarks}</p>
                              )}
                              {demoerror.demoDescription && (
                                <p className="text-red-500">
                                  {demoerror.demoDescription}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                }
              })()}

              {selectedTab === "Next Follow Up" ? (
                <div className="flex justify-center gap-3 mt-3">
                  <button
                    onClick={() => {
                      setfollowupDateModal(false)
                      setIsEditable(false)
                      setShowModal(false)
                      setselectedDocid(null)
                      setSelectedLeadId(null)
                      setFormData({
                        followUpDate: "",
                        nextfollowUpDate: "",

                        Remarks: ""
                      })
                      setDemodata({
                        demoallocatedTo: "",
                        demoallocatedDate: "",
                        demoDescription: ""
                      })
                    }}
                    className="bg-gray-600 hover:bg-gray-700 rounded-lg px-4 py-1 shadow-xl text-white "
                  >
                    {" "}
                    CLOSE
                  </button>
                  <button
                    onClick={
                      isAllocated ? handleDemoSubmit : handleFollowUpDateSubmit
                    }
                    className="bg-blue-700 hover:bg-blue-800 rounded-lg px-4 py-2  text-white shadow-xl"
                  >
                    {followupDateLoader || loader ? (
                      <div className="flex items-center">
                        Processing
                        <FaSpinner className="animate-spin h-5 w-5  text-white ml-2" />
                      </div>
                    ) : (
                      <div>{isHaveEditchoice ? "UPDATE" : "SUBMIT"}</div>
                    )}
                  </button>
                </div>
              ) : selectedTab === "History" ? (
                <button
                  onClick={() => {
                    setShowModal(false)
                    setIsEditable(false)
                    setfollowupDateModal(false)
                    setSelectedLeadId(null)
                    setselectedDocid(null)
                    setHistoryList([])
                  }}
                  className="bg-gray-500 hover:bg-gray-600 rounded-lg px-3 py-1 mt-3 text-white "
                >
                  CLOSE
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LeadFollowUp
