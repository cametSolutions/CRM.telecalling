import { useState, useEffect } from "react"
import React from "react"
import { formatDate } from "../../../utils/dateUtils"

import { FaSpinner, FaTable } from "react-icons/fa"
import Select from "react-select"
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
    demoDate: "",
    demoDescription: ""
  })
  const [isdemofollownotClosed, setisdemofollowedNotClosed] = useState(false)

  const [editdemoIndex, setdemoEditIndex] = useState(null)
  const [
    editfollowUpDatesandRemarksEditIndex,
    setfollowUpDatesandRemarksEditIndex
  ] = useState(null)
  const [isAllocated, setIsAllocated] = useState(false) //for set allocation or not
  const [isOwner, setOwner] = useState(false)

  const [message, setMessage] = useState("")
  const [demofollowerLoader, setdemofollowerLoader] = useState(false)
  const [loader, setLoader] = useState(false)
  const [allocationOptions, setAllocationOptions] = useState([])
  const [selectedCompanyBranch, setselectedCompanyBranch] = useState("")
  const [isHaveEditchoice, setIsEditable] = useState(false)
  const [selectedDocId, setselectedDocid] = useState(null)
  const [selectedTab, setselectedTab] = useState("")
  const [leads, setLeads] = useState([])
  const [hasOwnLeads, setHasownLeads] = useState(false)
  const [ownFollowUp, setOwnFollowUp] = useState(true)
  const [historyList, setHistoryList] = useState([])
  const [loggedUser, setloggedUser] = useState(null)
  const [loggedUserBranches, setloggedUserBranches] = useState(null)
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

  const [tableData, setTableData] = useState([])
  const [formData, setFormData] = useState({
    followUpDate: "",
    nextfollowUpDate: "",
    followedId: "",

    Remarks: ""
  })

  const [demoDetails, setDemodetails] = useState({
    matchedindex: "",
    leadId: "",
    leadDocId: "",
    demoAssignedBy: "",
    demoAssignedDate: "",
    demoAssignedDescription: "",
    followerDate: "",
    followerDescription: ""
  })
  const [demoData, setDemodata] = useState({
    demoallocatedTo: "",
    demoallocatedDate: "",
    demoDescription: ""
  })
  const navigate = useNavigate()
  const { data: demolead } = UseFetch(
    loggedUser && `/lead/getrespecteddemolead?userid=${loggedUser._id}`
  )

  const { data: branches } = UseFetch("/branch/getBranch")
  const { data } = UseFetch("/auth/getallUsers")
  const {
    data: loggedusersallocatedleads,
    loading,
    refreshHook
  } = UseFetch(
    loggedUser &&
      selectedCompanyBranch &&
      `/lead/getallLeadFollowUp?branchSelected=${selectedCompanyBranch}&loggeduserid=${loggedUser._id}&role=${loggedUser.role}`
  )

  useEffect(() => {
    if (branches) {
      const defaultbranch = branches[0]
      setselectedCompanyBranch(defaultbranch._id)
    }
  }, [branches])

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
    if (demolead && demolead.length > 0) {
      setDemodetails((prev) => ({
        ...prev,
        matchedindex: demolead[0].matchedDemoIndex,
        leadId: demolead[0].leadId,
        leadDocId: demolead[0]._id,
        demoAssignedBy: demolead[0].demoallocatedByDetails.name,
        demoAssignedDate: demolead[0].matchedDemoFollowUp.demoallocatedDate
          .toString()
          .split("T")[0],
        demoAssignedDescription: demolead[0].matchedDemoFollowUp.demoDescription
      }))
    }
  }, [demolead])
  useEffect(() => {
    if (branches) {
      const userData = localStorage.getItem("user")
      const user = JSON.parse(userData)
      if (user.role === "Admin") {
        const branch = branches.map((branch) => branch._id)
        setloggedUserBranches(branch)
      } else {
        const branches = user.selected.map((branch) => branch.branch_id)
        setloggedUserBranches(branches)
      }

      setloggedUser(user)
    }
  }, [branches])
  // Close when clicking outside

  useEffect(() => {
    if (loggedusersallocatedleads) {
      setLeads(loggedusersallocatedleads.followupLeads)
      setHasownLeads(loggedusersallocatedleads.ischekCollegueLeads)
    }
  }, [loggedusersallocatedleads])
  useEffect(() => {
    if (leads && leads.length && loggedUser && ownFollowUp) {
      console.log(tableData)
      console.log("h")

      const currentDate = new Date()

      // 1. Leads with follow-ups
      const leadsWithFollowUps = leads
        .filter((lead) => lead.allocatedTo._id === loggedUser._id)
        .filter((lead) => lead.followUpDatesandRemarks.length > 0)
        .map((lead) => {
          // Get the closest nextfollowUpDate from the followUpDatesandRemarks array
          const nextFollowUp = lead.followUpDatesandRemarks.reduce(
            (closest, curr) => {
              const currDate = new Date(curr.nextfollowUpDate)
              const closestDate = new Date(closest.nextfollowUpDate)
              return Math.abs(currDate - currentDate) <
                Math.abs(closestDate - currentDate)
                ? curr
                : closest
            }
          )

          return {
            ...lead,
            closestNextFollowUp: new Date(nextFollowUp.nextfollowUpDate)
          }
        })
        .sort((a, b) => a.closestNextFollowUp - b.closestNextFollowUp)

      // 2. Leads with empty followUpDatesandRemarks
      const leadsWithoutFollowUps = leads.filter(
        (lead) => lead.followUpDatesandRemarks.length === 0
      )

      // 3. Combined
      const finalSortedLeads = [...leadsWithFollowUps, ...leadsWithoutFollowUps]

      setTableData(finalSortedLeads)
    } else if (loggedusersallocatedleads && loggedUser) {
      console.log(leads)

      const currentDate = new Date()

      // 1. Leads with follow-ups
      const leadsWithFollowUps = leads
        .filter((lead) => lead.allocatedTo._id !== loggedUser._id)
        .filter((lead) => lead.followUpDatesandRemarks.length > 0)
        .map((lead) => {
          // Get the closest nextfollowUpDate from the followUpDatesandRemarks array
          const nextFollowUp = lead.followUpDatesandRemarks.reduce(
            (closest, curr) => {
              const currDate = new Date(curr.nextfollowUpDate)
              const closestDate = new Date(closest.nextfollowUpDate)
              return Math.abs(currDate - currentDate) <
                Math.abs(closestDate - currentDate)
                ? curr
                : closest
            }
          )

          return {
            ...lead,
            closestNextFollowUp: new Date(nextFollowUp.nextfollowUpDate)
          }
        })
        .sort((a, b) => a.closestNextFollowUp - b.closestNextFollowUp)

      // 2. Leads with empty followUpDatesandRemarks
      const leadsWithoutFollowUps = leads.filter(
        (lead) => lead.followUpDatesandRemarks.length === 0
      )

      // 3. Combined
      const finalSortedLeads = [...leadsWithFollowUps, ...leadsWithoutFollowUps]
      console.log(finalSortedLeads)
      setTableData(finalSortedLeads)
    }
  }, [ownFollowUp, leads, loggedUser])

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
        ...(name === "nextfollowUpDate"
          ? { demoallocatedDate: value }
          : { demoDescription: value })
      }))
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" })) // ✅ Clear error
    }
    if (name === "Remarks") {
      if (demoerror.demoDescription) {
        setDemoError((prev) => ({ ...prev, demoDescription: "" }))
      }
    } else if (name === "nextfollowUpDate") {
      if (demoerror.demoDate) {
        setDemoError((prev) => ({
          ...prev,
          demoDate: ""
        }))
      }
    }
  }

  const handleHistory = (history, leadid, docId, allocatedTo, demofollowUp) => {
 
    const owner = loggedUser._id === allocatedTo
    setOwner(owner)
    const isHaveDemo = demofollowUp?demofollowUp[demofollowUp?.length - 1]:null
    if (isHaveDemo) {
      const isdemofollowupclosed = isHaveDemo?.demofollowerDate === null
      if (isdemofollowupclosed) {
        const respectedfollowUpDatesandRemarks = history[history.length - 1]

        const demoassignedDate = formatDate(
          respectedfollowUpDatesandRemarks.followUpDate
        )

        setFormData((prev) => ({
          ...prev,
          followUpDate: respectedfollowUpDatesandRemarks.followUpDate,
          nextfollowUpDate: respectedfollowUpDatesandRemarks.nextfollowUpDate,
          followedId: respectedfollowUpDatesandRemarks.followedId,
          Remarks: respectedfollowUpDatesandRemarks.Remarks
        }))
        setdemoEditIndex(demofollowUp.length - 1)
        setfollowUpDatesandRemarksEditIndex(history.length - 1)
        setDemodata({
          demoallocatedTo: isHaveDemo.demoallocatedTo,
          demoallocatedDate: isHaveDemo.demoallocatedDate
            .toString()
            .split("T")[0],
          demoassignedDate,
          demoDescription: isHaveDemo.demoDescription
        })

        const isEditable =
          demofollowUp[demofollowUp?.length - 1]?.demofollowerDate === null
        const ischeckdisabled =
          demofollowUp[demofollowUp?.length - 1]?.demofollowerDate !== null
        setisdemofollowedNotClosed(ischeckdisabled)
        setIsEditable(isEditable)
        setIsAllocated(true)
      }
    }

    setselectedDocid(docId)
    setselectedTab("History")
    setShowModal(!showModal)
    setHistoryList(history)
    setSelectedLeadId(leadid)
  }
console.log(showModal)
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
        submiterror: "Cant submit demo is not closed",
        demoDescription: ""
      }))
      return
    }
    const newError = {}
    if (demoData.demoallocatedDate === "") {
      newError.demoDate = "Follow up is Required"
    }
    if (demoData.demoDescription === "") {
      newError.demoDescription = "Remarks is Required"
    }
    if (demoData.demoallocatedTo === "") {
      newError.selectStaff = "Staff is Required"
    }
    if (Object.keys(newError).length > 0) {
      setDemoError(newError)
      return
    }

    try {
      setLoader(true)

      const response = await api.post(
        `/lead/setdemolead?demoallocatedBy=${loggedUser._id}&leaddocId=${selectedDocId}`,
        {
          demoData,
          formData,
          editdemoIndex,
          editfollowUpDatesandRemarksEditIndex
        }
      )

      setLoader(false)
      setFormData((prev) => ({
        ...prev,
        followUpDate: "",
        nextfollowUpDate: "",
        followedId: "",
        Remarks: ""
      }))
      setDemodata((prev) => ({
        ...prev,
        demoallocatedTo: "",
        demoallocatedDate: "",
        demoDescription: ""
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
      if (!formData.nextfollowUpDate)
        newErrors.nextfollowUpDate = "Next Follow Up Date Is Required"
      if (!formData.Remarks)
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

      toast.success(response.data.message)
      setIsEditable(false)
      setfollowupDateLoader(false)
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
    } catch (error) {
      setIsEditable(false)
      console.log("error:", error.message)
    }
  }
  console.log(historyList)
  return (
    <div className="h-full flex flex-col ">
      {loading && (
        <BarLoader
          cssOverride={{ width: "100%", height: "4px" }} // Tailwind's `h-4` corresponds to `16px`
          color="#4A90E2" // Change color as needed
        />
      )}

      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mx-3 md:mx-5 mt-3 mb-3 gap-4">
        {/* Title */}
        <h2 className="text-lg font-bold">Lead Follow Up</h2>

        {/* Right Section */}
        <div className="grid grid-cols-2 md:flex md:flex-row md:gap-6 gap-3 items-start md:items-center w-full md:w-auto">
          {/* Message Icon with Badge and Popup */}

          {/* Branch Dropdown */}
          <select
            value={selectedCompanyBranch || ""}
            onChange={(e) => setselectedCompanyBranch(e.target.value)}
            className="border border-gray-300 py-1 rounded-md px-2 focus:outline-none min-w-[120px] w-full"
          >
            {branches?.map((branch) => (
              <option key={branch._id} value={branch._id}>
                {branch.branchName}
              </option>
            ))}
          </select>

          {/* Toggle Switch */}
          <div className="flex items-center gap-2">
            <span className="text-sm whitespace-nowrap">
              {ownFollowUp ? "Own FollowUp" : "Colleague FollowUp"}
            </span>
            <button
              onClick={() => setOwnFollowUp(!ownFollowUp)}
              className={`${
                ownFollowUp ? "bg-green-500" : "bg-gray-300"
              } w-11 h-6 flex items-center rounded-full transition-colors duration-300`}
            >
              <div
                className={`${
                  ownFollowUp ? "translate-x-5" : "translate-x-0"
                } w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300`}
              ></div>
            </button>
          </div>

          {/* New Lead Button */}
          <button
            onClick={() =>
              loggedUser.role === "Admin"
                ? navigate("/admin/transaction/lead")
                : navigate("/staff/transaction/lead")
            }
            className="bg-black text-white py-1 px-3 rounded-lg shadow-lg hover:bg-gray-600 w-full"
          >
            New Lead
          </button>
        </div>
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
            {tableData && tableData.length > 0 ? (
              tableData.map((item, index) => (
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
                    <td className="  px-4 ">{item.mobile}</td>
                    <td className="px-4 ">0481</td>
                    <td className="px-4 ">{item.email}</td>
                    <td className=" px-4 ">{item.leadId}</td>
                    <td className="border border-b-0 border-gray-400 px-4 "></td>

                    <td className="border border-b-0 border-gray-400 px-1  text-blue-400 min-w-[50px] hover:text-blue-500 hover:cursor-pointer font-semibold">
                      <button
                        onClick={() =>
                          loggedUser.role === "Admin"
                            ? navigate("/admin/transaction/lead/leadEdit", {
                                state: {
                                  leadId: item._id,
                                  isReadOnly: !(
                                    item.allocatedTo._id === loggedUser._id ||
                                    item.leadBy._id === loggedUser._id
                                  )
                                }
                              })
                            : navigate("/staff/transaction/lead/leadEdit", {
                                state: {
                                  leadId: item._id,
                                  isReadOnly: !(
                                    item.allocatedTo._id === loggedUser._id ||
                                    item.leadBy._id === loggedUser._id
                                  )
                                }
                              })
                        }
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
                      {new Date(
                        item.followUpDatesandRemarks[
                          item.followUpDatesandRemarks.length - 1
                        ]?.nextfollowUpDate
                      )
                        .toLocaleDateString("en-GB")
                        .split("/")
                        .join("-")}
                    </td>
                    <td className=" border border-t-0 border-b-0 border-gray-400 px-4  text-blue-400 hover:text-blue-500 hover:cursor-pointer">
                      <button
                        type="button"
                        onClick={() =>
                          handleHistory(
                            item?.followUpDatesandRemarks,
                            item.leadId, //like 00001
                            item?._id, //lead doc id
                            item?.allocatedTo?._id,
                            item?.demofollowUp
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
                    <td className="border  border-t-0 border-r-0 border-l-0  border-gray-400  px-4 py-0.5 ">
                      {item.followUpDatesandRemarks.length}
                    </td>
                    <td className="border  border-t-0 border-r-0 border-l-0  border-gray-400 px-4 py-0.5 ">
                      {item.leadDate?.toString().split("T")[0]}
                    </td>
                    <td className="border border-t-0 border-gray-400   px-4 py-0.5 "></td>
                    <td className="border border-t-0 border-gray-400   px-4 py-0.5"></td>
                    <td className="border border-t-0 border-gray-400   px-4 py-0.5"></td>
                  </tr>
                </React.Fragment>
              ))
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
                {/* isHaveEditchoice &&  */}
                {isOwner && (
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
                              {loggedUser?.role === "Admin" && (
                                <th className="border border-indigo-200 p-2 min-w-[100px] ">
                                  FollowedBy
                                </th>
                              )}

                              <th className="border border-indigo-200 p-2 min-w-[100px] ">
                                Date
                              </th>
                              <th className="border border-indigo-200 p-2 w-fit min-w-[200px]">
                                Remark
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
                                      {loggedUser?.role === "Admin" && (
                                        <td className="border border-gray-200 p-2">
                                          {item?.followedId?.name}
                                        </td>
                                      )}

                                      <td className="border border-gray-200 p-2">
                                        {new Date(subItem.followerDate)
                                          .toLocaleDateString("en-GB")
                                          .split("/")
                                          .join("-")}
                                      </td>
                                      <td className="border border-gray-200 p-2">
                                        {subItem?.followerDescription || "N/A"}
                                      </td>
                                      <td className="border border-gray-200 p-2">
                                        {/* {new Date(item.nextfollowUpDate)
                                          .toLocaleDateString("en-GB")
                                          .split("/")
                                          .join("-")} */}
                                      </td>
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
                                    {loggedUser?.role === "Admin" && (
                                      <td className="border border-gray-200 p-2">
                                        {item?.followedId?.name}
                                      </td>
                                    )}

                                    <td className="border border-gray-200 p-2">
                                      {new Date(item.followUpDate)
                                        .toLocaleDateString("en-GB")
                                        .split("/")
                                        .join("-")}
                                    </td>
                                    <td className="border border-gray-200 p-2">
                                      {item?.Remarks || "N/A"}
                                    </td>
                                    <td className="border border-gray-200 p-2">
                                      {new Date(item.nextfollowUpDate)
                                        .toLocaleDateString("en-GB")
                                        .split("/")
                                        .join("-")}
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
                              className="rounded-md w-full py-1 px-2 border border-gray-200 focus:outline-none"
                              onChange={handleDataChange}
                            />
                            {errors.followUpDate && (
                              <p className="text-red-500">
                                {errors.followUpDate}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-left font-semibold text-gray-500">
                              Next Follow Up
                            </label>
                            <input
                              type="date"
                              name="nextfollowUpDate"
                              disabled={isdemofollownotClosed}
                              value={
                                demoData.demoallocatedDate ||
                                formData?.nextfollowUpDate
                              }
                              className="rounded-md w-full py-1 px-2 border border-gray-200 focus:outline-none hover:cursor-pointer"
                              onChange={handleDataChange}
                            ></input>
                            {errors.nextfollowUpDate && (
                              <p className="text-red-500">
                                {errors.nextfollowUpDate}
                              </p>
                            )}
                            {demoerror.demoDate && (
                              <p className="text-red-500">
                                {demoerror.demoDate}
                              </p>
                            )}
                          </div>
                          <div className="text-left flex items-center  gap-2 ">
                            <input
                              type="checkbox"
                              disabled={demoData.demoDescription}
                              id="allocation"
                              className={`w-4 h-4  ${
                                isdemofollownotClosed
                                  ? "cursor-not-allowed"
                                  : ""
                              }`}
                              checked={isAllocated}
                              onChange={() => {
                                setIsAllocated(!isAllocated)
                                setFormData((prev) => ({
                                  ...prev,
                                  Remarks: "",
                                  nextfollowUpDate: ""
                                }))
                              }}
                            />
                            <label htmlFor="allocation" className="text-sm">
                              Allocation
                            </label>
                          </div>
                          {isAllocated && (
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
                                      option.value === demoData.demoallocatedTo
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
                                className="w-full  focus:outline-none "
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
                          )}
                          {demoerror.selectStaff && (
                            <p className="text-red-500 text-sm text-left">
                              {demoerror.selectStaff}
                            </p>
                          )}
                          <div>
                            <label className="block text-left">Remarks</label>
                            <textarea
                              rows={3}
                              disabled={isdemofollownotClosed}
                              name="Remarks"
                              className={`rounded-lg w-full border border-gray-200 focus:outline-none px-2 ${
                                isdemofollownotClosed
                                  ? "cursor-not-allowed bg-gray-200"
                                  : "cursor-text"
                              }`}
                              value={
                                formData?.Remarks || demoData.demoDescription
                              }
                              onChange={handleDataChange}
                            />
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
                    className="bg-gray-600 rounded-lg px-4 py-1 shadow-xl text-white "
                  >
                    {" "}
                    CLOSE
                  </button>
                  <button
                    onClick={
                      isAllocated ? handleDemoSubmit : handleFollowUpDateSubmit
                    }
                    className="bg-blue-800 rounded-lg px-4 py-2  text-white shadow-xl"
                  >
                    {followupDateLoader ? (
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
