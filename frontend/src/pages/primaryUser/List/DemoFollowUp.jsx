import { useState, useEffect, useRef } from "react"
import React from "react"
import { FiMessageCircle } from "react-icons/fi"
import { FaSpinner } from "react-icons/fa"
import Select from "react-select"
import { PropagateLoader } from "react-spinners"
import { useNavigate } from "react-router-dom"
import BarLoader from "react-spinners/BarLoader"
import api from "../../../api/api"
import { toast } from "react-toastify"
import UseFetch from "../../../hooks/useFetch"
const DemoFollowUp = () => {
  const [selectedLeadId, setSelectedLeadId] = useState(null)

  const [demoerror, setDemoError] = useState({
    selectStaff: "",
    demoDate: "",
    demoDescription: ""
  })
  const [isdemofollownotClosed, setisdemofollowedNotClosed] = useState(false)
  const [loggeduserBranch, setloggedUserBranch] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [demofollowerLoader, setdemofollowerLoader] = useState(false)
  const containerRef = useRef(null)
  const [allocationOptions, setAllocationOptions] = useState([])
  const [selectedCompanyBranch, setselectedCompanyBranch] = useState("")
  const [isHaveEditchoice, setIsEditable] = useState(false)
  const [selectedDocId, setselectedDocid] = useState(null)
  const [selectedTab, setselectedTab] = useState("")
  const [demoLead, setdemoLeads] = useState([])
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
  const { data: demolead, loading } = UseFetch(
    loggedUser &&
      selectedCompanyBranch &&
      `/lead/getrespecteddemolead?userid=${loggedUser._id}&selectedBranch=${selectedCompanyBranch}`
  )
  console.log(demolead)
  const { data: branches } = UseFetch("/branch/getBranch")
console.log(branches)
  const { data } = UseFetch("/auth/getallUsers")
  // const {
  //   data: loggedusersallocatedleads,
  //   loading,
  //   refreshHook
  // } = UseFetch(
  //   loggedUser &&
  //     loggedUserBranches &&
  //     `/lead/getallLeadFollowUp?branchSelected=${encodeURIComponent(
  //       JSON.stringify(loggedUserBranches)
  //     )}&loggeduser=${loggedUser}`
  // )
  useEffect(() => {
    if (branches && loggedUser) {
      console.log(loggedUser)
      if (loggedUser.role === "Admin") {
        const isselectedArray = loggedUser?.selected
        if (isselectedArray) {
          console.log("hhh")
          const loggeduserbranches = loggedUser.selected.map((item) => {
            return {
              value: item.branch_id,
              label: item.branchName
            }
          })
          setloggedUserBranch(loggeduserbranches)
          console.log(loggeduserbranches)
          setselectedCompanyBranch(loggeduserbranches[0].value)
          console.log(loggeduserbranches[0].value)
        } else {
          const loggeduserbranches = branches.map((item) => {
            return { value: item.branch_id, label: item.branchName }
          })
          setloggedUserBranch(loggeduserbranches)
          setselectedCompanyBranch(loggeduserbranches[0].value)
        }

        console.log(isselectedArray)
      } else {
        const loggeduserbranches = loggedUser.selected.map((item) => {
          return { value: item.branch_id, label: item.branchName }
        })
console.log(loggeduserbranches)
        setloggedUserBranch(loggeduserbranches)
        setselectedCompanyBranch(loggeduserbranches[0].value)
      }
    }
  }, [branches, loggedUser])
  useEffect(() => {
    console.log(data)
    if (data && selectedCompanyBranch) {
      console.log("h")
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
      console.log(demolead)

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
  console.log(demoDetails)
  console.log(allocationOptions)
  console.log(loggedUserBranches)
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
  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false)
        setMessage("")
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])
  console.log(message)

  useEffect(() => {
    if (demolead && demolead.length > 0) {
      const currentDate = new Date()

      // 1. Leads with follow-ups
      const leadsWithFollowUps = demolead
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
      const leadsWithoutFollowUps = demolead.filter(
        (lead) => lead.followUpDatesandRemarks.length === 0
      )

      // 3. Combined
      const finalSortedLeads = [...leadsWithFollowUps, ...leadsWithoutFollowUps]
      setTableData(finalSortedLeads)
    }
  }, [demolead])
  console.log(tableData)
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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" })) // ✅ Clear error
    }
  }
  console.log(demoData)
  const handleHistory = (history, id, docId, allocatedTo, demofollowUp) => {
    console.log(demofollowUp)
    const a = demofollowUp[demofollowUp.length - 1]
    console.log(a)

    setDemodata({
      demoallocatedTo: a.demoallocatedTo,
      demoallocatedDate: a.demoallocatedDate.toString().split("T")[0],
      demoDescription: a.demoDescription
    })
    const isdemofollowed =
      demofollowUp[demofollowUp.length - 1].demofollowerDate === null
    console.log(isdemofollowed)
    setisdemofollowedNotClosed(isdemofollowed)
    console.log(allocatedTo)
    console.log(loggedUser)
    const isEditable = loggedUser._id === allocatedTo
    setIsEditable(isEditable)
    setselectedDocid(docId)
    setselectedTab("History")
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
  const handleDemoSubmit = async () => {
    console.log("hh")
    if (isdemofollownotClosed) {
      console.log("H")
      setDemoError((prev) => ({
        ...prev,
        submiterror: "Cant submit demo is not closed",
        demoDescription: ""
      }))
      return
    }

    try {
      console.log(demoData)
      console.log(loggedUser)
      console.log(selectedLeadId)
      const response = await api.post(
        `/lead/setdemolead?demoallocatedBy=${loggedUser._id}&leadId=${selectedLeadId}`,
        demoData
      )
      console.log(response.data)
      toast.success(response.data.message)
    } catch (error) {
      console.log(error)
    }
  }
  const handleDemofollowup = async () => {
    console.log("HH")
    try {
      setdemofollowerLoader(true)

      const demofollowuperror = {}
      if (demoDetails.followerDescription === "") {
        demofollowuperror.descriptionerror =
          "Description is empty please fill it"
      }
      if (demoDetails.followerDate === "") {
        demofollowuperror.dateerror = "Please select a Date"
      }
      if (Object.keys(demofollowuperror).length > 0) {
        setDemofollowersubmitError(demofollowuperror)
      }
      console.log(demoDetails)
      const response = await api.post("/lead/demosubmitbyfollower", demoDetails)
      if (response.status === 201) {
        toast.success(response.data.message)
        setMessage("Submitted successfully")
      } else if (response.status === 304) {
        setMessage("not submitted")
        toast.error(response.data.message)
      }
      setdemofollowerLoader(false)
    } catch (error) {
      setdemofollowerLoader(false)
      setMessage("not submitted")
      console.log(error)
    }
  }
  console.log(demolead)
  // const handleFollowUpDateSubmit = async () => {
  //   try {
  //     let newErrors = {}
  //     if (!formData.followUpDate)
  //       newErrors.followUpDate = "Follow Up Date is required"
  //     if (!formData.nextfollowUpDate)
  //       newErrors.nextfollowUpDate = "Next Follow Up Date Is Required"
  //     if (!formData.Remarks)
  //       if (!formData.Remarks) newErrors.Remarks = "Remarks is Required"

  //     if (Object.keys(newErrors).length > 0) {
  //       setErrors(newErrors)
  //       return
  //     }
  //     setfollowupDateLoader(!followupDateLoader)

  //     const response = await api.put(
  //       `/lead/followupDateUpdate?selectedleaddocId=${selectedDocId}&loggeduserid=${loggedUser._id}`,
  //       formData
  //     )

  //     toast.success(response.data.message)
  //     setIsEditable(false)
  //     setfollowupDateLoader(false)
  //     setselectedDocid(null)
  //     setSelectedLeadId(null)
  //     setHistoryList([])
  //     setShowModal(false)
  //     setfollowupDateModal(false)
  //     setFormData({
  //       followUpDate: "",
  //       nextfollowUpDate: "",

  //       Remarks: ""
  //     })
  //     refreshHook()
  //   } catch (error) {
  //     setIsEditable(false)
  //     console.log("error:", error.message)
  //   }
  // }
  console.log(selectedCompanyBranch)
  console.log(tableData)
  console.log(allocationOptions)
  console.log(demoData)
  console.log(demoerror)
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
        <h2 className="text-lg font-bold">Demo Follow Up</h2>

        {/* Right Section */}
        <div className="grid grid-cols-2 md:flex md:flex-row md:gap-6 gap-3 items-start md:items-center w-full md:w-auto">
          {/* Message Icon with Badge and Popup */}
          <div className="relative col-span-2 sm:col-span-1" ref={containerRef}>
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer flex items-center gap-1 relative"
            >
              <FiMessageCircle className="text-3xl text-gray-700" />
              {1 > 0 && (
                <span className="absolute -top-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {1}
                </span>
              )}
            </div>

            {isOpen && (
              <div className="absolute top-10 right-0 bg-white shadow-lg border rounded-md p-4 w-80 md:w-96 z-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ">
                  <div>
                    <label className="block text-sm mb-1 text-gray-700 font-semibold">
                      Search
                    </label>
                    <input
                      type="text"
                      // value={demoDetails?.demoAssignedBy || ""}
                      className="w-full border px-2 py-1 rounded mb-1 text-sm cursor-not-allowed bg-gray-100"
                      placeholder="Search Customer..."
                    />
                    <label className="block text-sm mb-1 text-gray-700 font-semibold">
                      Demo Assigned By
                    </label>
                    <input
                      type="text"
                      value={demoDetails?.demoAssignedBy || ""}
                      className="w-full border px-2 py-1 rounded mb-1 text-sm cursor-not-allowed bg-gray-100"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-700 font-semibold">
                      Demo Assigned Date
                    </label>
                    <input
                      type="date"
                      value={demoDetails?.demoAssignedDate || ""}
                      readOnly
                      className="w-full border px-2 py-1 rounded mb-1 text-sm cursor-not-allowed bg-gray-100"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-1 text-gray-700 font-semibold">
                      Description By Assigner
                    </label>
                    <textarea
                      readOnly
                      value={demoDetails?.demoAssignedDescription || ""}
                      rows={2}
                      className="w-full border px-2 py-1 rounded text-sm focus:outline-none cursor-not-allowed bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-700 font-semibold">
                      Follow-up Date
                    </label>
                    <input
                      type="date"
                      value={demoDetails?.followerDate || ""}
                      onChange={(e) => {
                        setDemodetails((prev) => ({
                          ...prev,
                          followerDate: e.target.value
                        }))
                        if (demosubmitError.dateerror) {
                          setDemofollowersubmitError((prev) => ({
                            ...prev,
                            dateerror: ""
                          })) // ✅ Clear error
                        }
                      }}
                      className="w-full border px-2 py-1 rounded mb-1 text-sm"
                    />
                    {demosubmitError.dateerror && (
                      <p className="text-red-500">
                        {demosubmitError.dateerror}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-1 text-gray-700 font-semibold">
                      Description
                    </label>

                    <textarea
                      rows={2}
                      value={demoDetails?.followerDescription || ""}
                      onChange={(e) => {
                        setDemodetails((prev) => ({
                          ...prev,
                          followerDescription: e.target.value
                        }))
                        if (demosubmitError.descriptionerror) {
                          setDemofollowersubmitError((prev) => ({
                            ...prev,
                            descriptionerror: ""
                          })) // ✅ Clear error
                        }
                      }}
                      className="w-full border px-2 py-1 rounded text-sm focus:outline-none"
                      placeholder="Enter description..."
                    />
                    {demosubmitError.descriptionerror && (
                      <p className="text-red-500">
                        {demosubmitError.descriptionerror}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  {message && (
                    <p
                      className={
                        message === "Submitted successfully"
                          ? "text-green-600"
                          : message === "not submitted"
                          ? "text-red-500"
                          : "text-gray-600"
                      }
                    >
                      {message}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleDemofollowup()}
                  className="mt-2 w-full bg-blue-600 text-white py-1 rounded text-sm hover:bg-blue-700 flex justify-center items-center"
                >
                  {demofollowerLoader ? (
                    <FaSpinner className="animate-spin h-5 w-5  text-white " />
                  ) : (
                    "SUBMIT"
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Branch Dropdown */}
          <select
            // value={selectedCompanyBranch || ""}
            onChange={(e) => selectedCompanyBranch(e.target.value)}
            className="border border-gray-300 py-1 rounded-md px-2 focus:outline-none min-w-[120px] w-full"
          >
            {loggeduserBranch?.map((branch) => (
              <option key={branch._id} value={branch.value}>
                {branch.label}
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

      {/* <div className="flex flex-col md:flex  md:justify-between items-center mx-3 md:mx-5 mt-3 mb-3 ">
        <h2 className="text-lg font-bold">Lead Follow Up</h2>
        <div className=" md:flex md:gap-6 items-center bg-red-200">
         
          <div className="relative inline-block bg-green-300 items-center" ref={containerRef}>
            
            <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer items-center flex">
              <FiMessageCircle  className="text-4xl text-gray-700" />
              {1 > 0 && (
                <span className="relative  bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {1}
                </span>
              )}
            </div>

            
            {isOpen && (
              <div className="absolute top-8 right-0 bg-white shadow-lg border rounded-md p-4 w-64 z-50">
                <label className="block text-sm mb-1 text-gray-700">
                  Demo Assigned Date
                </label>
                <input
                  type="date"
                  readOnly
                  className="w-full border px-2 py-1 rounded mb-3 text-sm cursor-not-allowed bg-gray-100"
                />
                <label className="block text-sm mb-1 text-gray-700">
                  Description By Assigner
                </label>
                <textarea
                  readOnly
                  rows={3}
                  className="w-full border px-2 py-1 rounded text-sm focus:outline-none cursor-not-allowed bg-gray-100"
                />
                <label className="block text-sm mb-1 text-gray-700">
                  Follow-up Date
                </label>
                <input
                  type="date"
                  className="w-full border px-2 py-1 rounded mb-3 text-sm"
                />
                <label className="block text-sm mb-1 text-gray-700">
                  Description
                </label>
                <textarea
                  rows={2}
                  className="w-full border px-2 py-1 rounded text-sm focus:outline-none"
                  placeholder="Enter description..."
                />
                <button className="mt-3 w-full bg-blue-600 text-white py-1 rounded text-sm hover:bg-blue-700">
                  Submit
                </button>
              </div>
            )}
          </div>
          <select
            value={selectedCompanyBranch || ""}
            onChange={() => handleChange}
            className="border border-gray-300 py-1 rounded-md px-2  mr-2 focus:outline-none min-w-[120px] cursor-pointer"
          >
            {branches?.map((branch) => (
              <option key={branch._id} value={branch._id}>
                {branch.branchName}
              </option>
            ))}
          </select>
          <>
            <span>{ownFollowUp ? "Own FollowUp" : "Colleague  FollowUp"}</span>
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
      </div> */}
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
                            item._id, //lead doc id
                            item.allocatedTo._id,
                            item.demofollowUp
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
              } p-2 md:p-5 rounded-lg `}
            >
              <div className="text-gray-600 font-semibold space-x-6 mb-1">
                <span
                  className={`hover:cursor-pointer pb-1 ${
                    selectedTab === "History"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : ""
                  }`}
                  onClick={() => {
                    setselectedTab("History")
                    // setfollowupDateModal(false)
                  }}
                >
                  History
                </span>
                {/* isHaveEditchoice &&  */}
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

                <span
                  className={`hover:cursor-pointer pb-1 ${
                    selectedTab === "Demo"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : ""
                  }`}
                  onClick={() => setselectedTab("Demo")}
                >
                  Demo
                </span>
              </div>

              <h1 className=" font-bold">
                {`${
                  selectedTab === "Next Follow Up"
                    ? selectedTab
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
                    )
                  case "Next Follow Up":
                    return (
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
                              className="rounded-md w-full py-1 px-2 border border-gray-200 focus:outline-none hover:cursor-pointer"
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
                    )
                  case "Demo":
                    return (
                      <div className="min-h-24 mt-2">
                        <div className="flex flex-col md:flex-row justify-start px-4 gap-3 ">
                          <div className="flex flex-col text-left">
                            <div
                              onClick={() =>
                                setDemoError((prev) => ({
                                  ...prev,
                                  selectStaff:
                                    "Cant change staff demo is not closed",
                                  demoDate: "",
                                  demoDescription: ""
                                }))
                              }
                            >
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
                                }}
                                className={`w-full md:w-52 focus:outline-none ${
                                  isdemofollownotClosed
                                    ? "bg-gray-100 cursor-not-allowed"
                                    : ""
                                }`}
                                styles={{
                                  control: (base) => ({
                                    ...base,
                                    minHeight: "32px", // control height
                                    height: "32px",
                                    boxShadow: "none", // removes blue glow
                                    borderColor: "gray"
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
                            {demoerror.selectStaff && (
                              <p className="text-red-500 text-sm">
                                {demoerror.selectStaff}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col text-left">
                            <div
                              onClick={() =>
                                setDemoError((prev) => ({
                                  ...prev,
                                  demoDate:
                                    "Cant change Date demo is not closed",
                                  demoDescription: "",
                                  selectStaff: ""
                                }))
                              }
                            >
                              <label
                                htmlFor="demoDate"
                                className="block text-sm  font-medium  text-gray-700 "
                              >
                                Select Demo Date
                              </label>

                              <input
                                type="date"
                                readOnly={isdemofollownotClosed}
                                value={demoData.demoallocatedDate || ""}
                                name="demoallocatedDate"
                                onChange={(e) => {
                                  setDemoError((prev) => ({
                                    ...prev,
                                    demoDate:
                                      "Cant select a date demo is not closed"
                                  }))
                                  setDemodata((prev) => ({
                                    ...prev,
                                    demoallocatedDate: e.target.value
                                  }))
                                }}
                                className={`border border-gray-400 rounded-md py-1 w-full md:w-52 px-3 focus:outline-none  ${
                                  isdemofollownotClosed
                                    ? "bg-gray-100 cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                              />
                            </div>
                            {demoerror.demoDate && (
                              <p className="text-red-500 text-sm">
                                {demoerror.demoDate}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="mt-3 w-full px-4">
                          <div
                            onClick={() =>
                              setDemoError((prev) => ({
                                ...prev,
                                demoDescription:
                                  "Cant Type  demo is not closed",
                                selectStaff: "",
                                demoDate: ""
                              }))
                            }
                            className="text-left"
                          >
                            <label
                              htmlFor="demoDate"
                              className="block text-sm  font-medium  text-gray-700 "
                            >
                              Description
                            </label>
                            <textarea
                              name="demoDescription"
                              value={demoData.demoDescription || ""}
                              readOnly={isdemofollownotClosed}
                              onChange={(e) => {
                                setDemoError((prev) => ({
                                  ...prev,
                                  demoDescription:
                                    "Cant Type nothing demo is not closed"
                                }))
                                setDemodata((prev) => ({
                                  ...prev,
                                  demoDescription: e.target.value
                                }))
                              }}
                              className={`border border-gray-400 rounded-md min-h-24 w-full focus:outline-none tex-black  mt-1 px-3 ${
                                isdemofollownotClosed
                                  ? "bg-gray-100 cursor-not-allowed"
                                  : ""
                              }`}
                              placeholder="Type..."
                            />
                          </div>
                          {demoerror.demoDescription && (
                            <p className="text-red-500 text-sm">
                              {demoerror.demoDescription}
                            </p>
                          )}
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
                    }}
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
                <div>
                  {demoerror.submiterror && (
                    <p className="text-red-500 text-sm">
                      {demoerror.submiterror}
                    </p>
                  )}
                  <div className="flex justify-center  space-x-3 mt-2">
                    <button
                      onClick={() => {
                        setShowModal(false)
                        setDemoError({
                          selectStaff: "",
                          demoDate: "",
                          demoDescription: "",
                          submiterror: ""
                        })
                      }}
                      className="bg-gray-500 hover:bg-gray-600 rounded-lg px-3 py-2  text-white"
                    >
                      CLOSE
                    </button>
                    <button
                      className="bg-blue-700 hover:bg-blue-800 rounded-lg px-3 py-2  text-white shadow-xl"
                      onClick={handleDemoSubmit}
                    >
                      SUBMIT
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DemoFollowUp
