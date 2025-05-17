import { useState, useEffect } from "react"
import React from "react"
import Select from "react-select"
import { flushSync } from "react-dom"
import { PropagateLoader } from "react-spinners"
import { MdOutlineEventAvailable } from "react-icons/md"
import { useFetcher, useNavigate } from "react-router-dom"
import BarLoader from "react-spinners/BarLoader"
import { FaSpinner } from "react-icons/fa"
import { FaHistory } from "react-icons/fa"
import api from "../../../api/api"
import { toast } from "react-toastify"
import UseFetch from "../../../hooks/useFetch"
import { formatDate } from "../../../utils/dateUtils"
import { all } from "axios"
const LeadFollowUp = () => {
  const [selectedLeadId, setSelectedLeadId] = useState(null)
  const [selectedDocId, setselectedDocid] = useState(null)
  const [selectedTab, setselectedTab] = useState("")
  const [allocationOptions, setAllocationOptions] = useState([])
  const [leads, setLeads] = useState([])
  const [hasOwnLeads, setHasownLeads] = useState(false)
  const [ownFollowUp, setOwnFollowUp] = useState(true)
  const [historyList, setHistoryList] = useState([])
  const [loggedUser, setloggedUser] = useState(null)
  const [loggedUserBranches, setloggedUserBranches] = useState(null)
  const [followupDateLoader, setfollowupDateLoader] = useState(false)
  const [input, setInput] = useState("")
  const [showFullRemarks, setShowFullRemarks] = useState("")
  const [selectedAllocates, setSelectedAllocates] = useState({})
  const [errors, setErrors] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [debouncedValue, setDebouncedValue] = useState("")
  const [followupDateModal, setfollowupDateModal] = useState(false)
  const [showFullName, setShowFullName] = useState(false)
  const [showFullEmail, setShowFullEmail] = useState(false)
  // const [submitLoading, setsubmitLoading] = useState(false)
  const [tableData, setTableData] = useState([])
  const [formData, setFormData] = useState({
    followUpDate: "",
    nextfollowUpDate: "",
    followedId: "",

    Remarks: ""
  })
  const { data: branches } = UseFetch("/branch/getBranch")
  const { data } = UseFetch("/auth/getallUsers")
  const {
    data: loggedusersallocatedleads,
    loading,
    refreshHook
  } = UseFetch(
    loggedUser &&
      loggedUserBranches &&
      `/lead/getallLeadFollowUp?branchSelected=${encodeURIComponent(
        JSON.stringify(loggedUserBranches)
      )}&loggeduser=${loggedUser}`
  )
  const navigate = useNavigate()
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
  useEffect(() => {
    if (data) {
      const { allusers = [], allAdmins = [] } = data

      // Combine allusers and allAdmins
      const combinedUsers = [...allusers, ...allAdmins]
      if (loggedUser.role === "Staff") {
        const filteredBranchStaffs = allusers.filter((staff) =>
          staff.selected.some((s) => loggedUserBranches.includes(s.branch_id))
        )

        setAllocationOptions(
          filteredBranchStaffs.map((item) => ({
            value: item?._id,
            label: item?.name
          }))
        )
      } else {
        setAllocationOptions(
          combinedUsers.map((item) => ({
            value: item?._id,
            label: item?.name
          }))
        )
      }
    }
  }, [data])
  useEffect(() => {
    let initialSelected = {}
    tableData.forEach((item) => {

      if (item.allocatedTo?._id) {
        const match = allocationOptions.find(
          (opt) => opt.value === item.allocatedTo._id
        )

        if (match) {
          initialSelected[item._id] = match
        }
      }
    })

    setSelectedAllocates(initialSelected)
  }, [allocationOptions, tableData])
  useEffect(() => {
    if (loggedusersallocatedleads) {
      setLeads(loggedusersallocatedleads.followupLeads)
      setHasownLeads(loggedusersallocatedleads.ischekCollegueLeads)
    }
  }, [loggedusersallocatedleads])
  useEffect(() => {
    if (leads && leads.length && loggedUser && ownFollowUp) {
    
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

  const handleSubmit = async (leadAllocationData) => {

    try {
      setsubmitLoading(true)
      if (approvedToggleStatus) {
        console.log(approvedToggleStatus)

        const response = await api.post(
          `/lead/leadAllocation?allocationpending=${!approvedToggleStatus}&allocatedBy=${
            loggedUser._id
          }`,
          leadAllocationData
        )
        if (response.status >= 200 && response.status < 300) {

          setTableData(response.data.data)
          setsubmitLoading(false)
        }
      } else {

        const response = await api.post(
          `/lead/leadAllocation?allocationpending=${!approvedToggleStatus}&allocatedBy=${
            loggedUser._id
          }`,
          leadAllocationData
        )

        if (response.status >= 200 && response.status < 300) {
          setSelectedAllocates((prev) => {
            const updated = { ...prev }
            delete updated[leadAllocationData._id]
            return updated
          })
          setTableData(response.data.data)
          setsubmitLoading(false)
        }
      }
    } catch (error) {
      console.log("error:", error.message)
    }
  }

  const handleDataChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" })) // ✅ Clear error
    }
  }

  const handleHistory = (history, id, docId) => {
  
    setselectedDocid(docId)
   
    setShowModal(!showModal)
    setHistoryList(history)
    setSelectedLeadId(id)
  }
  const handlefollowupdate = (Id, docId) => {
    setfollowupDateModal(true)
    setSelectedLeadId(Id)
    setselectedDocid(docId)
    setFormData((prev) => ({
      ...prev,
      followUpDate: new Date().toISOString().split("T")[0]
    }))
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
        `/lead/followupDateUpdate?selectedleaddocId=${selectedLeadId}&loggeduserid=${loggedUser._id}`,
        formData
      )

      toast.success(response.data.message)
      setfollowupDateLoader(false)
      setfollowupDateModal(false)
      setFormData({
        followUpDate: "",
        nextfollowUpDate: "",

        Remarks: ""
      })
      refreshHook()
    } catch (error) {
      console.log("error:", error.message)
    }
  }
  return (
    <div className="h-full ">
      {loading && (
        <BarLoader
          cssOverride={{ width: "100%", height: "4px" }} // Tailwind's `h-4` corresponds to `16px`
          color="#4A90E2" // Change color as needed
        />
      )}
      <div className="h-full md:p-6 p-3 bg-blue-50">
        <div className="md:px-8 px-3 md:py-3  shadow-xl h-full border border-gray-100 rounded-xl bg-gray-50 ">
          <div className="flex justify-between items-center mb-4 ">
            <h2 className="text-lg font-bold">Lead Follow Up</h2>
            <div className="flex gap-6 items-center">
              {hasOwnLeads && (
                <>
                  <span>
                    {ownFollowUp ? "Own FollowUp" : "Colleague  FollowUp"}
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
                </>
              )}

              <button
                onClick={() =>
                  loggedUser.role === "Admin"
                    ? navigate("/admin/transaction/lead")
                    : navigate("/staff/transaction/lead")
                }
                className="bg-black text-white py-2 px-3 rounded-lg shadow-lg hover:bg-gray-600"
              >
                Go Lead
              </button>
            </div>
          </div>
          {/* Responsive Table Container */}
          <div className="overflow-x-auto rounded-lg text-center overflow-y-auto max-h-96 shadow-xl">
            <table className=" border-collapse border border-gray-400 w-full text-sm">
              <thead className=" whitespace-nowrap bg-blue-600 text-white sticky top-0 z-30">
                <tr>
                  <th className="border border-r-0 border-gray-400 px-4 ">
                    Name
                  </th>
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
                  <th className="border border-gray-400 px-4 ">
                    Followup Date
                  </th>
                  <th className="border border-gray-400 px-4  min-w-[100px]">
                    Action
                  </th>
                  <th className="border border-gray-400 px-4 py-2">
                    Net Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData && tableData.length > 0 ? (
                  tableData.map((item, index) => (
                    <React.Fragment key={index}>
                      <tr className="bg-white ">
                        <td
                          onClick={() => setShowFullName(!showFullName)}
                          // className={`px-4 cursor-pointer ${
                          //   showFullName
                          //     ? "whitespace-normal"
                          //     : "truncate whitespace-nowrap overflow-hidden max-w-[150px]"
                          // }`}
                          className={`px-4 cursor-pointer overflow-hidden ${
                            showFullName
                              ? "whitespace-normal max-h-[3em]" // ≈2 lines of text (1.5em line-height)
                              : "truncate whitespace-nowrap max-w-[120px]"
                          }`}
                          style={{ lineHeight: "1.5em" }} // fine-tune as needed
                          // className={`truncate overflow-hidden px-4 ${
                          //   !showFullName ? "max-w-[150px]" : ""
                          // }`}
                        >
                          {item.customerName.customerName}
                        </td>
                        <td className="  px-4 ">{item.mobile}</td>
                        <td className="px-4 ">0481</td>
                        <td className="px-4 ">{item.email}</td>
                        <td className=" px-4 ">{item.leadId}</td>
                        <td className="border border-b-0 border-gray-400 px-4 ">
                          {
                            item.followUpDatesandRemarks[
                              item.followUpDatesandRemarks.length - 1
                            ]?.nextfollowpdate
                          }
                        </td>

                        <td className="border border-b-0 border-gray-400 px-1  text-blue-400 min-w-[50px] hover:text-blue-500 hover:cursor-pointer font-semibold">
                          <button
                            onClick={() =>
                              loggedUser.role === "Admin"
                                ? navigate("/admin/transaction/lead/leadEdit", {
                                    state: {
                                      leadId: item._id,
                                      isReadOnly: !(
                                        item.allocatedTo === loggedUser._id ||
                                        item.leadBy === loggedUser._id
                                      )
                                    }
                                  })
                                : navigate("/staff/transaction/lead/leadEdit", {
                                    state: {
                                      leadId: item._id,
                                      isReadOnly: !(
                                        item.allocatedTo === loggedUser._id ||
                                        item.leadBy === loggedUser._id
                                      )
                                    }
                                  })
                            }
                            className="text-blue-400 hover:text-blue-500 font-semibold cursor-pointer"
                          >
                            View / Modify
                          </button>
                        </td>
                        <td className="borrder border-b-0 border-gray-400 px-4 ">
                          {item.netAmount}
                        </td>
                      </tr>

                      <tr className=" font-semibold bg-gray-200">
                        <td className=" px-4 ">Leadby</td>
                        <td className=" px-4">Assignedto</td>
                        <td className=" px-4 ">Assignedby</td>
                        <td className="px-4 ">No. of Followups</td>
                        <td className="px-4 min-w-[120px]">Lead Date</td>
                        <td className=" border border-t-0 border-b-0 border-gray-400 px-4 "></td>
                        <td className=" border border-t-0 border-b-0 border-gray-400 px-4  text-blue-400 hover:text-blue-500 hover:cursor-pointer">
                          <button
                            type="button"
                            onClick={() =>
                              handleHistory(
                                item?.followUpDatesandRemarks,
                                item.leadId,
                                item._id
                              )
                            }
                          >
                            Follow Up
                          </button>
                        </td>
                        <td className=" border border-t-0 border-b-0 border-gray-400 px-4 "></td>
                      </tr>

                      <tr className="bg-white">
                        <td className="border border-t-0 border-r-0  border-gray-400 px-4 py-0.5 ">
                          {item?.leadBy?.name}
                        </td>
                        <td className="border border-t-0 border-r-0 border-l-0  border-gray-400 px-4 py-0.5 ">
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
                            }}
                            className="w-44 focus:outline-none"
                            styles={{
                              control: (base, state) => ({
                                ...base,
                                minHeight: "32px", // control height
                                height: "32px",
                                boxShadow: "none", // removes blue glow
                                borderColor: state.isFocused
                                  ? "#ccc"
                                  : base.borderColor, // optional: neutral border on focus
                                "&:hover": {
                                  borderColor: "#ccc" // optional hover styling
                                }
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
                            menuPortalTarget={document.body} // Prevents nested scrolling issues
                            menuShouldScrollIntoView={false}
                          />
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
                        <td
                          className="border border-t-0 border-gray-400   px-4 py-0.5 text-blue-400 hover:text-blue-500 hover:cursor-pointer font-semibold"
                          onClick={() => handleSubmit(item)}
                        >
                          Allocates
                        </td>
                        <td className="border border-t-0 border-gray-400   px-4 py-0.5"></td>
                      </tr>
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center text-gray-500 py-4">
                      No data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-40 ">
                <div
                  className={`bg-gray-100   text-center w-full ${
                    selectedTab === "Next Follow Up" ? "md:w-80" : "md:w-1/2"
                  } p-5 rounded-lg `}
                >
                  {/* <div className="text-gray-600 font-semibold space-x-6">
                    <span
                      className="hover:cursor-pointer"
                      onClick={() => {
                        setselectedTab("Follow Up History")
                        setfollowupDateModal(false)
                      }}
                    >
                      History
                    </span>
                    <span
                      className="hover:cursor-pointer"
                      onClick={() => {
                        handlefollowupdate(selectedLeadId, selectedDocId)
                        setselectedTab("Next Follow Up")
                      }}
                    >
                      Next Follow Up
                    </span>
                  </div> */}
                  <div className="text-gray-600 font-semibold space-x-6">
                    <span
                      className={`hover:cursor-pointer pb-1 ${
                        selectedTab === "Follow Up History"
                          ? "border-b-2 border-blue-500 text-blue-600"
                          : ""
                      }`}
                      onClick={() => {
                        setselectedTab("Follow Up History")
                        setfollowupDateModal(false)
                      }}
                    >
                      History
                    </span>
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
                  </div>

                  <h1 className=" font-bold">
                    {`${
                      selectedTab === "Next Follow Up"
                        ? selectedTab
                        : selectedTab + " of"
                    } LEAD ID - ${selectedLeadId}`}
                  </h1>
                  {!followupDateModal ? (
                    <div className="overflow-x-auto overflow-y-auto  md:max-h-64 lg:max-h-96 shadow-xl">
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
                            historyList.map((item, index) => (
                              <tr
                                key={index}
                                className={
                                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                }
                              >
                                {loggedUser?.role === "Admin" && (
                                  <td className="border border-gray-200 p-2">
                                    {item?.followedId?.name}
                                  </td>
                                )}

                                <td className="border border-gray-200 p-2">
                                  {item?.followUpDate
                                    ?.toString()
                                    .split("T")[0] || "N/A"}
                                </td>
                                <td className="border border-gray-200 p-2">
                                  {item?.Remarks || "N/A"}
                                </td>
                                <td className="border border-gray-200 p-2">
                                  {
                                    item?.nextfollowUpDate
                                      ?.toString()
                                      .split("T")[0]
                                  }
                                </td>
                              </tr>
                            ))
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
                  ) : (
                    <div className="text-center w-fullrounded-lg">
                      <div className=" rounded-lg grid grid-cols-1 gap-3 p-3 shadow-xl bg-white">
                        <div>
                          <label className="block text-left font-semibold text-gray-500">
                            Select Follow Up Date
                          </label>
                          <input
                            type="text"
                            readOnly
                            name="followUpDate"
                            // value={formData?.followUpDate || ""}
                            value={
                              formData?.followUpDate
                                ? new Date(formData.followUpDate)
                                    .toLocaleDateString("en-GB") // this gives dd/mm/yyyy
                                    .replace(/\//g, "-") // change / to -
                                : ""
                            }
                            className="rounded-md w-full py-1 px-2 border border-gray-200 focus:outline-none"
                            onChange={handleDataChange}
                          ></input>
                          {errors.followUpDate && (
                            <p className="text-red-500">
                              {errors.followUpDate}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-left font-semibold text-gray-500">
                            Select Next Follow Up Date
                          </label>
                          <input
                            type="date"
                            name="nextfollowUpDate"
                            value={formData?.nextfollowUpDate || ""}
                            className="rounded-md w-full py-1 px-2 border border-gray-200 focus:outline-none"
                            onChange={handleDataChange}
                          ></input>
                          {errors.nextfollowUpDate && (
                            <p className="text-red-500">
                              {errors.nextfollowUpDate}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-left">Remarks</label>
                          <textarea
                            rows={4}
                            name="Remarks"
                            className="rounded-lg w-full border border-gray-200 focus:outline-none p-3"
                            value={formData?.Remarks || ""}
                            onChange={handleDataChange}
                          ></textarea>
                          {errors.Remarks && (
                            <p className="text-red-500">{errors.Remarks}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedTab === "Next Follow Up" ? (
                    <div className="flex justify-center gap-3 mt-3">
                      <button
                        onClick={() => setfollowupDateModal(!followupDateModal)}
                        className="bg-gray-600 rounded-lg px-4 py-1 shadow-xl text-white "
                      >
                        {" "}
                        CLOSE
                      </button>
                      <button
                        onClick={handleFollowUpDateSubmit}
                        className="bg-blue-800 rounded-lg px-4 py-2  text-white shadow-xl"
                      >
                        {followupDateLoader ? (
                          <div className="flex items-center">
                            Processing
                            <FaSpinner className="animate-spin h-5 w-5  text-white ml-2" />
                          </div>
                        ) : (
                          <div>SUBMIT</div>
                        )}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setShowModal(!showModal)
                        setSelectedLeadId(null)
                      }}
                      className="bg-gray-500 hover:bg-gray-600 rounded-lg px-3 py-1 mt-3 text-white "
                    >
                      CLOSE
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* <div className="overflow-x-auto rounded-lg text-center ">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-blue-500 text-white text-sm ">
                <tr>
                  <th className="px-4 py-2 text-center">Lead Date</th>
                  <th className="px-1 py-2 text-center min-w-[80px]">
                    No Of <br />
                    Follow Up
                  </th>
                  <th className="px-4 py-2 text-center">Lead ID</th>
                  <th className="px-4 py-2 text-center">Customer Name</th>
                  <th className="px-4 py-2 text-center">Mobile Number</th>
                  <th className="px-4 py-2 text-center">Phone Number</th>
                  <th className="px-2 py-2 text-center">Email Id</th>
                  <th className="px-4 py-2 text-center">
                    Product
                    <br />
                    Services
                  </th>
                  <th className="px-4 py-2 text-center">Lead By</th>
                  <th className="px-4 py-2 text-center">Lead Allocated To</th>
                  <th className="px-4 py-2 text-center">Net Amount</th>
                  <th className="px-1 py-2 text-center min-w-[100px]">
                    Next Follow
                    <br /> Up Date
                  </th>
                  <th className="px-4 py-2 text-center">Remark</th>
                  <th className="px-1 py-2 text-center">History</th>
                  {ownFollowUp && (
                    <th className="px-1 py-2 text-center">Select Date</th>
                  )}
                </tr>
              </thead>
              <tbody className="text-center divide-gray-200 bg-gray-200 whitespace-nowrap">
                {tableData && tableData.length > 0 ? (
                  tableData.map((item) => (
                    <tr key={item.id} className="">
                      <td className="px-1 py-1.5 border border-gray-300">
                        {formatDate(item.leadDate)}
                      </td>
                      <td className="px-1  border border-gray-300">
                        {item?.followUpDatesandRemarks?.length}
                      </td>
                      <td className="px-4  border border-gray-300">
                        {item?.leadId}
                      </td>
                      <td
                        className="px-4 border border-gray-300 cursor-pointer"
                        onClick={() => setShowFullName(!showFullName)}
                      >
                        <div
                          className={`truncate overflow-hidden ${
                            !showFullName ? "max-w-[100px]" : ""
                          }`}
                        >
                          {item?.customerName?.customerName}
                        </div>
                      </td>
                      <td className="px-4  border border-gray-300">
                        {item?.mobile}
                      </td>
                      <td className="px-4  border border-gray-300">
                        {item.phone}
                      </td>
                      <td
                        className="px-4  border border-gray-300 cursor-pointer"
                        onClick={() => setShowFullEmail(!showFullEmail)}
                      >
                        <div
                          className={`truncate overflow-hidden ${
                            !showFullEmail ? "max-w-[100px]" : ""
                          }`}
                        >
                          {item?.email}
                        </div>
                      </td>
                      <td className="px-4  border border-gray-300">
                        <button
                          onClick={() =>
                            loggedUser.role === "Admin"
                              ? navigate("/admin/transaction/lead/leadEdit", {
                                  state: {
                                    leadId: item._id
                                  }
                                })
                              : navigate("/staff/transaction/lead/leadEdit", {
                                  state: {
                                    leadId: item._id
                                  }
                                })
                          }
                          className="bg-blue-700 hover:bg-blue-800 text-white rounded-lg px-4 shadow-md"
                        >
                          View
                        </button>
                      </td>
                      <td className="px-4  border border-gray-300">
                        {item?.leadBy?.name}
                      </td>
                      <td className="px-1  border border-gray-300">
                        {item?.allocatedTo?.name}
                      </td>
                      <td className="px-4  border border-gray-300">
                        {item?.netAmount}
                      </td>
                      <td className="px-1 border border-gray-300">
                        {item.followUpDatesandRemarks.length
                          ? formatDate(
                              item.followUpDatesandRemarks[
                                item.followUpDatesandRemarks.length - 1
                              ].nextfollowUpDate
                            )
                          : "Not selected"}
                      </td>

                      <td
                        className="px-2 border border-gray-300 text-blue-800 hover:cursor-pointer"
                        onClick={() => setShowFullRemarks(!showFullRemarks)}
                      >
                        <div
                          className={`truncate overflow-hidden ${
                            !showFullRemarks ? "max-w-[150px]" : ""
                          }`}
                        >
                          {item?.followUpDatesandRemarks?.length > 0 &&
                            item.followUpDatesandRemarks[
                              item.followUpDatesandRemarks.length - 1
                            ]?.Remarks}
                        </div>
                      </td>
                      <td className="px-4  border border-gray-300">
                        <button
                          onClick={() =>
                            handleHistory(
                              item?.followUpDatesandRemarks,
                              item.leadId
                            )
                          }
                        >
                          <FaHistory className="text-xl text-green-500" />
                        </button>
                      </td>
                      {ownFollowUp && (
                        <td className="px-4  border border-gray-300">
                          <button
                            onClick={() => handlefollowupdate(item._id)}
                            className=" px-4 "
                          >
                            <MdOutlineEventAvailable className="text-green-600 text-xl" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="15"
                      className="px-4 py-4 text-center bg-gray-100"
                    >
                      {loading ? (
                        <div className="flex justify-center items-center gap-2">
                          <PropagateLoader color="#3b82f6" size={10} />
                        </div>
                      ) : (
                        "No Lead Follow Up"
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {historyModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 ">
                <div className="bg-gray-100   text-center w-full  md:w-1/2 p-5 rounded-lg">
                  <h1 className=" font-bold">
                    {`Follow Up History of LEAD ID
                  -${selectedLeadId}`}
                  </h1>
                  <div className="overflow-x-auto overflow-y-auto  md:max-h-64 lg:max-h-96 shadow-xl">
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
                          historyList.map((item, index) => (
                            <tr
                              key={index}
                              className={
                                index % 2 === 0 ? "bg-gray-50" : "bg-white"
                              }
                            >
                              {loggedUser?.role === "Admin" && (
                                <td className="border border-gray-200 p-2">
                                  {item?.followedId?.name}
                                </td>
                              )}

                              <td className="border border-gray-200 p-2">
                                {item?.followUpDate?.toString().split("T")[0] ||
                                  "N/A"}
                              </td>
                              <td className="border border-gray-200 p-2">
                                {item?.Remarks || "N/A"}
                              </td>
                              <td className="border border-gray-200 p-2">
                                {
                                  item?.nextfollowUpDate
                                    ?.toString()
                                    .split("T")[0]
                                }
                              </td>
                            </tr>
                          ))
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
                  <button
                    onClick={() => {
                      setHistoryModal(!historyModal)
                      setSelectedLeadId(null)
                    }}
                    className="bg-gray-500 hover:bg-gray-600 rounded-lg px-3 py-1 mt-3 text-white "
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            )}
            {followupDateModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 ">
                <div className="bg-gray-100   text-center w-full  md:w-96 p-5 rounded-lg">
                  <div className=" rounded-lg grid grid-cols-1 gap-3 p-3 shadow-xl bg-white">
                    <div>
                      <label className="block text-left font-semibold text-gray-500">
                        Select Follow Up Date
                      </label>
                      <input
                        type="text"
                        readOnly
                        name="followUpDate"
                        // value={formData?.followUpDate || ""}
                        value={
                          formData?.followUpDate
                            ? new Date(formData.followUpDate)
                                .toLocaleDateString("en-GB") // this gives dd/mm/yyyy
                                .replace(/\//g, "-") // change / to -
                            : ""
                        }
                        className="rounded-md w-full py-1 px-2 border border-gray-200 focus:outline-none"
                        onChange={handleDataChange}
                      ></input>
                      {errors.followUpDate && (
                        <p className="text-red-500">{errors.followUpDate}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-left font-semibold text-gray-500">
                        Select Next Follow Up Date
                      </label>
                      <input
                        type="date"
                        name="nextfollowUpDate"
                        value={formData?.nextfollowUpDate || ""}
                        className="rounded-md w-full py-1 px-2 border border-gray-200 focus:outline-none"
                        onChange={handleDataChange}
                      ></input>
                      {errors.nextfollowUpDate && (
                        <p className="text-red-500">
                          {errors.nextfollowUpDate}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-left">Remarks</label>
                      <textarea
                        rows={4}
                        name="Remarks"
                        className="rounded-lg w-full border border-gray-200 focus:outline-none p-3"
                        value={formData?.Remarks || ""}
                        onChange={handleDataChange}
                      ></textarea>
                      {errors.Remarks && (
                        <p className="text-red-500">{errors.Remarks}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-center gap-3 mt-3">
                    <button
                      onClick={() => setfollowupDateModal(!followupDateModal)}
                      className="bg-gray-600 rounded-lg px-4 py-1 shadow-xl text-white "
                    >
                      {" "}
                      CLOSE
                    </button>
                    <button
                      onClick={handleFollowUpDateSubmit}
                      className="bg-blue-800 rounded-lg px-4 py-2  text-white shadow-xl"
                    >
                      {followupDateLoader ? (
                        <div className="flex items-center">
                          Processing
                          <FaSpinner className="animate-spin h-5 w-5  text-white ml-2" />
                        </div>
                      ) : (
                        <div>SUBMIT</div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default LeadFollowUp
