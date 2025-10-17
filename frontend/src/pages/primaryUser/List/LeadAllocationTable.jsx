import { useState, useEffect } from "react"
import { X, Calendar, FileText, AlertCircle, IndianRupee } from "lucide-react"

import React from "react"
import { toast } from "react-toastify"
import { PropagateLoader } from "react-spinners"
import { useNavigate } from "react-router-dom"
import BarLoader from "react-spinners/BarLoader"
import api from "../../../api/api"
import Select from "react-select"
import UseFetch from "../../../hooks/useFetch"
const LeadAllocationTable = () => {
  const [status, setStatus] = useState("Pending")
  const [submiterror, setsubmitError] = useState("")
  const [toggleLoading, setToggleLoading] = useState(false)
  const [selectedLeadId, setselectedLeadId] = useState(null)
  const [showModal, setShowmodal] = useState(false)
  const [showeventLog, setshoweventLog] = useState(false)
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
  const [selectedData, setselectedData] = useState([])
  const { data: branches } = UseFetch("/branch/getBranch")
  const [formData, setFormData] = useState({
    allocationDate: "",
    allocationDescription: ""
  })
  const { data: leadPendinglist, loading } = UseFetch(
    status &&
      loggedUser &&
      selectedCompanyBranch &&
      `/lead/getallLead?Status=${status}&selectedBranch=${selectedCompanyBranch}&role=${loggedUser.role}`
  )

  const { data } = UseFetch("/auth/getallUsers")
  const navigate = useNavigate()
  useEffect(() => {
    const userData = localStorage.getItem("user")
    const user = JSON.parse(userData)
    setLoggedUser(user)
  }, [])

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
    if (leadPendinglist) {
      getgroupingData(leadPendinglist)
    }
  }, [leadPendinglist])
  const getgroupingData = (data) => {
    const groupedLeads = {}
    let grandTotal = 0
    data.forEach((lead) => {
      const leadBy = lead?.leadBy?.name
      const amount = lead?.netAmount || 0
      grandTotal += amount
      if (!groupedLeads[leadBy]) {
        groupedLeads[leadBy] = []
      }

      groupedLeads[leadBy].push(lead)
    })

    setTableData(groupedLeads)
  }
  const toggleStatus = async () => {
    setTableData([])
    setShowFullEmail(false)
    setShowFullName(false)
    if (approvedToggleStatus === false) {
      //for getting approved allocation,
      setToggleLoading(true)
      const response = await api.get(
        `/lead/getallLead?Status=Approved&selectedBranch=${selectedCompanyBranch}&role=${loggedUser.role}`
      )

      if (response.status >= 200 && response.status < 300) {
        const data = response.data.data //gets only allocated leads with reallocatedto field false which means reallocatedto true are in the reallocation page not need to display here
        getgroupingData(data)
        // setTableData(data)
        data.forEach((item) => {
          setselectedAllocationType((prev) => ({
            ...prev,
            [item._id]: item.allocationType
          }))
        })
        setapprovedToggleStatus(!approvedToggleStatus)
        setToggleLoading(false)
        const initialSelected = {}
        data.forEach((item) => {
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
      }
    } else {
      //for getting pending allocation
      setToggleLoading(true)
      const response = await api.get(
        `/lead/getallLead?Status=Pending&selectedBranch=${selectedCompanyBranch}&role=${loggedUser.role}`
      )
      if (response.status >= 200 && response.status < 300) {
        setSelectedAllocates({})
        getgroupingData(response.data.data)
        // setTableData(response.data.data)
        setapprovedToggleStatus(!approvedToggleStatus)
        setToggleLoading(false)
      }
    }
  }
  // const handleSelectedAllocates = (item, value, label) => {
  //   setTableData((prevLeads) =>
  //     prevLeads.map((lead) =>
  //       lead._id === item._id
  //         ? { ...lead, allocatedTo: value, allocatedName: label }
  //         : lead
  //     )
  //   )
  // }
  const handleSelectedAllocates = (item, value, label) => {
    setTableData((prevData) => {
      const leadOwner = item.leadBy?.name
      if (!leadOwner || !prevData[leadOwner]) return prevData

      return {
        ...prevData,
        [leadOwner]: prevData[leadOwner].map((lead) =>
          lead._id === item._id
            ? { ...lead, allocatedTo: value, allocatedName: label }
            : lead
        )
      }
    })
  }
  const getRemainingDays = (dueDate) => {
    const today = new Date()
    const target = new Date(dueDate)
    today.setHours(0, 0, 0, 0)
    target.setHours(0, 0, 0, 0)
    const diffTime = target - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }
  const handleSubmit = async () => {
    // sanitize all string fields
    const cleanedData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value
      ])
    )

    // validate on cleaned data
    if (!cleanedData.allocationDescription) {
      setValidateError((prev) => ({
        ...prev,
        descriptionError: "Please fill it"
      }))
      return
    }
    if (!cleanedData.allocationDate) {
      setValidateError((prev) => ({
        ...prev,
        allocationDateError: "Please select a date"
      }))
      return
    }

    // return
    try {
      if (selectedAllocationType) {
        const selected = selectedAllocationType[selectedItem._id]

        setsubmitLoading(true)
        let response
        if (approvedToggleStatus) {
          response = await api.post(
            //change allocation to another staff means reassigning to another one
            `/lead/leadAllocation?allocationpending=${!approvedToggleStatus}&selectedbranch=${selectedCompanyBranch}&allocationType=${encodeURIComponent(
              selected
            )}&allocatedBy=${loggedUser._id}`,
            { selectedItem, cleanedData }
          )
          if (response.status >= 200 && response.status < 300) {
            getgroupingData(response.data.data)
            // setTableData(response.data.data)
            setsubmitLoading(false)
          }
        } else {
          //set allocation to respected staff from allocation pending page
          response = await api.post(
            `/lead/leadAllocation?allocationpending=${!approvedToggleStatus}&selectedbranch=${selectedCompanyBranch}&allocationType=${encodeURIComponent(
              selected
            )}&allocatedBy=${loggedUser._id}`,
            { selectedItem, cleanedData }
          )

          if (response.status >= 200 && response.status < 300) {
            setSelectedAllocates((prev) => {
              const updated = { ...prev }
              delete updated[selectedItem._id]
              return updated
            })
            getgroupingData(response.data.data)
            // setTableData(response.data.data)
            setsubmitLoading(false)
          }
        }
        setShowmodal(false)
        toast.success(response.data.message)
        setsubmitLoading(false)
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response

        if (status === 409) {
          // ⚠️ custom business-rule warning
          toast.warning(
            data.message ||
              "Cannot change task name. It's already running.only possible to change the user"
          )
          setsubmitError({ submissionerror: data.message })
        } else if (status === 400) {
          toast.error(data.message || "Invalid request")
        } else if (status === 500) {
          toast.error("Internal Server Error. Please try again later.")
        } else {
          toast.error(data.message || "Something went wrong")
        }
      } else {
        // if error.response doesn’t exist (like network failure)
        toast.error("Network error. Please check your connection.")
      }

      setsubmitLoading(false)
      console.log("error:", error.message)
    }
  }
  const handleAllocate = (item) => {
    if (!selectedAllocates.hasOwnProperty(item._id)) {
      setValidateError((prev) => ({
        ...prev,
        [item._id]: "Allocate to Someone"
      }))
      return
    }
    if (!selectedAllocationType.hasOwnProperty(item._id)) {
      setValidatetypeError((prev) => ({
        ...prev,
        [item._id]: "please select a Type"
      }))
      return
    }
    setselectedLeadId(item.leadId)
    setShowmodal(true)
    setSelectedItem(item)
    if (selectedAllocationType[item._id] === "followup") {
      setFormData((prev) => ({
        ...prev,
        allocationDate: new Date()
      }))
    }
  }
  return (
    <div className="flex flex-col h-full">
      {loading && (
        <BarLoader
          cssOverride={{ width: "100%", height: "4px" }} // Tailwind's `h-4` corresponds to `16px`
          color="#4A90E2" // Change color as needed
        />
      )}

      <div className="flex justify-between items-center mx-3 md:mx-5 mt-3 mb-3 ">
        <h2 className="text-lg font-bold ">
          {approvedToggleStatus ? "Approved" : "Pending"} Allocation List
        </h2>
        <div className="flex justify-end  ml-auto gap-6 items-center">
          {/* Branch Dropdown */}
          <select
            // value={selectedCompanyBranch || ""}
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
          <button
            aria-pressed={approvedToggleStatus}
            aria-label="Toggle Approval Status"
            onClick={toggleStatus}
            className={`${
              approvedToggleStatus ? "bg-green-500" : "bg-gray-300"
            } w-11 h-6 flex items-center rounded-full transition-colors duration-300`}
          >
            <div
              className={`${
                approvedToggleStatus ? "translate-x-5" : "translate-x-0"
              } w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300`}
            ></div>
          </button>
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
      <div className="flex-1 ">
        <div className="w-full mx-auto px-4 py-3">
          {tableData && Object.keys(tableData).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(tableData).map(([staffName, leads]) => (
                <div
                  key={staffName}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                >
                  <div className="bg-gray-50 px-4 py-1 border-b">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-blue-600">
                        {staffName}
                      </h3>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                        {leads.length} Lead{leads.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="border-collapse border border-gray-400 w-full text-sm ">
                      <thead className="whitespace-nowrap bg-blue-900 text-white ">
                        <tr>
                          <th className="border border-r-0 border-gray-400 px-4 py-2">
                            SNO.
                          </th>
                          <th className="border border-r-0 border-gray-400 px-4 py-2">
                            Name
                          </th>
                          <th className="border border-r-0 border-l-0 border-gray-400 px-4 py-2 max-w-[200px] min-w-[200px]">
                            Mobile
                          </th>
                          <th className="border border-r-0 border-l-0 border-gray-400 px-4 py-2">
                            Phone
                          </th>
                          <th className="border border-r-0 border-l-0 border-gray-400 px-4 py-2">
                            Email
                          </th>
                          <th className="border border-r-0 border-l-0 border-gray-400 px-4 py-2 min-w-[100px]">
                            Lead Id
                          </th>
                          <th className="border border-t-0  w-36">
                            Allocation Type
                          </th>

                          <th className="border border-gray-400 px-4 py-2 w-[100px] text-nowrap">
                            Action
                          </th>
                          <th className="border border-gray-400 px-4 py-2 w-32">
                            Net Amount
                          </th>
                          <th className="border border-r-0 border-l-0 border-gray-400 px-4 py-2 w-32">
                            B.Amount
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {leads.map((item, index) => (
                          <React.Fragment key={item._id}>
                            <tr className="bg-white border border-gray-400 border-b-0 hover:bg-gray-50 transition-colors text-center ">
                              <td className="px-4 border border-b-0 border-gray-400"></td>
                              <td
                                onClick={() => setShowFullName(!showFullName)}
                                className={`px-4 cursor-pointer overflow-hidden text-black ${
                                  showFullName
                                    ? "whitespace-normal max-h-[3em]"
                                    : "truncate whitespace-nowrap max-w-[120px]"
                                }`}
                                style={{ lineHeight: "1.5em" }}
                              >
                                {item?.customerName?.customerName}
                              </td>
                              <td className="px-4 text-black">
                                {item?.mobile}
                              </td>
                              <td className="px-4 text-black">{item?.phone}</td>
                              <td className="px-4 text-black">{item?.email}</td>
                              <td className="px-4 text-black">
                                {item?.leadId}
                              </td>
                              <td className="border border-b-0 border-gray-400 px-4"></td>

                              <td className="border border-b-0 border-gray-400 px-1 text-yellow-500 font-semibold text-md">
                                <button
                                  onClick={() =>
                                    loggedUser.role === "Admin"
                                      ? navigate(
                                          "/admin/transaction/lead/leadEdit",
                                          {
                                            state: {
                                              leadId: item._id,
                                              isReadOnly: true
                                            }
                                          }
                                        )
                                      : navigate(
                                          "/staff/transaction/lead/leadEdit",
                                          {
                                            state: {
                                              leadId: item._id,
                                              isReadOnly: true
                                            }
                                          }
                                        )
                                  }
                                  className="hover:text-blue-500 cursor-pointer transition-colors"
                                >
                                  View
                                </button>
                              </td>
                              <td className="border border-b-0 border-gray-400 px-4"></td>
                            </tr>

                            <tr className="font-semibold bg-gray-200 text-center">
                              <td className="px-4 border border-b-0 border-t-0 border-gray-400 text-black">
                                {index + 1}
                              </td>
                              <td className="px-4 text-black">LeadBy</td>
                              <td className="px-4 text-black">AssignedTo</td>
                              <td className="px-4 text-black">AssignedBy</td>
                              <td className="px-4 text-black">
                                No.of FollowuUps
                              </td>

                              <td className="px-4 font-medium">LeadDate</td>

                              <td className="border border-t-0 border-b-0 border-gray-400 ">
                                {" "}
                                <select
                                  value={selectedAllocationType?.[item._id]}
                                  onChange={(e) => {
                                    setselectedAllocationType((prev) => ({
                                      ...prev,
                                      [item._id]: e.target.value
                                    }))
                                    setValidatetypeError((prev) => ({
                                      ...prev,
                                      [item._id]: ""
                                    }))
                                  }}
                                  className="py-0.5 border border-gray-400 rounded-md   focus:outline-none cursor-pointer"
                                >
                                  <option>Select Type</option>
                                  <option value="followup">Followup</option>
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
                                {validatetypeError[item._id] && (
                                  <p className="text-red-500 text-sm">
                                    {validatetypeError[item._id]}
                                  </p>
                                )}
                              </td>
                              <td className="border border-t-0 border-b-0 border-gray-400 px-4 text-blue-400 hover:text-blue-500 hover:cursor-pointer text-nowrap">
                                {approvedToggleStatus && (
                                  <button
                                    onClick={() => {
                                      setselectedData(item?.activityLog)
                                      setselectedLeadId(item?.leadId)
                                      setShowmodal(true)
                                    }}
                                    type="button"
                                  >
                                    Event Log
                                  </button>
                                )}
                              </td>
                              <td className="border border-t-0 border-b-0 border-gray-400 px-4 text-black">
                                <div className="flex items-center justify-center">
                                  <IndianRupee className="w-3 h-3 text-green-600 mr-1" />
                                  <span>
                                    {item.netAmount?.toLocaleString()}
                                  </span>
                                </div>
                              </td>
                              <td className="border border-t-0 border-b-0 border-gray-400 px-4 text-black">
                                <div className="flex items-center justify-center">
                                  <IndianRupee className="w-3 h-3 text-red-600 mr-1" />
                                  <span> {item?.balanceAmount}</span>
                                </div>
                              </td>
                            </tr>

                            <tr className="bg-white text-center">
                              <td className="border border-t-0 border-r-0 border-b-0 border-gray-400 px-4 py-0.5"></td>
                              <td className="border border-t-0 border-r-0 border-b-0 border-gray-400 px-4 py-0.5 text-black">
                                {item?.leadBy?.name || "-"}
                              </td>
                              <td className="border border-t-0 border-r-0 border-l-0 border-b-0 border-gray-400 px-4 py-0.5 text-md ">
                                <div className="text-center">
                                  <div className="inline-block">
                                    <Select
                                      options={allocationOptions}
                                      value={
                                        selectedAllocates[item._id] || null
                                      }
                                      onChange={(selectedOption) => {
                                        setSelectedAllocates((prev) => ({
                                          ...prev,
                                          [item._id]: selectedOption
                                        }))
                                        handleSelectedAllocates(
                                          item,
                                          selectedOption.value,
                                          selectedOption.label
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
                                          minHeight: "28px", // control height
                                          height: "28px",
                                          boxShadow: "none", // removes blue glow
                                          borderColor: "red",
                                          paddingTop: "0px", // Tailwind py-0.5 = 2px top and bottom
                                          paddingBottom: "0px",
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
                              <td className="border border-t-0 border-r-0 border-l-0 border-b-0 border-gray-400 px-4 py-0.5  text-md ">
                                {item?.allocatedBy?.name || "-"}
                              </td>
                              <td className="border border-t-0 border-r-0 border-l-0 border-b-0 border-gray-400 px-4 py-0.5 text-black"></td>
                              <td className="border border-t-0 border-r-0 border-l-0 border-b-0 border-gray-400 px-4 py-0.5 text-black">
                                {new Date(item.leadDate).toLocaleDateString(
                                  "en-GB"
                                )}
                              </td>
                              <td className="border border-t-0 border-b-0 border-gray-400 px-4 py-0.5"></td>
                              <td
                                onClick={() => handleAllocate(item)}
                                className="border border-t-0 border-gray-400 border-b-0  px-4 py-0.5 text-red-400 hover:text-red-500 hover:cursor-pointer font-semibold"
                              >
                                Allocate
                              </td>

                              <td className="border border-t-0 border-b-0 border-gray-400 px-4 py-0.5"></td>
                            </tr>
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              {(loading ||toggleLoading)? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Loading...</span>
                </div>
              ) : (
                <div className="text-gray-500">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400 mb-4"
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
                  <p className="text-lg font-medium">No data available</p>
                  <p className="text-sm">
                    There are no leads to display at the moment.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        {showModal&&selectedData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all max-h-[95vh] flex flex-col">
              {/* Loading Bar */}
              {submitLoading && (
                <div className="h-1 bg-blue-500 rounded-t-xl animate-pulse" />
              )}

              {/* Header - Compressed */}
              <div className="relative border-b border-gray-200 px-4 py-3">
                <button
                  onClick={() => {
                    setshoweventLog(false)
                    setFormData((prev) => ({
                      ...prev,
                      allocationDate: "",
                      allocationDescription: "",
                      reason: ""
                    }))
                    setsubmitError({
                      submissionerror: ""
                    })
                    setsubmitLoading(false)
                  }}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
                <h2 className="text-xl font-bold text-gray-800 mb-1.5">
                  Task Allocation
                </h2>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-medium text-xs">
                    {selectedAllocationType[selectedItem._id]}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600 font-medium text-xs">
                    LEAD ID-{selectedLeadId}
                  </span>
                </div>
              </div>

              {/* Form Content - Scrollable if needed but compressed */}
              <div className="p-4 space-y-3 overflow-y-auto flex-1">
                {/* Allocated To - Read Only */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                    <FileText size={14} className="text-blue-500" />
                    Allocated To
                  </label>
                  <input
                    readOnly
                    value={
                      selectedItem.allocatedName ||
                      selectedItem?.allocatedTo?.name
                    }
                    type="text"
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
                {/* Completion Date */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                    <Calendar size={14} className="text-blue-500" />
                    Completion Date
                  </label>

                  <input
                    type="date"
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-700"
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        allocationDate: e.target.value
                      }))
                      setValidateError((prev) => ({
                        ...prev,
                        allocationDateError: ""
                      }))
                    }}
                  />
                  {validateError.allocationDateError && (
                    <div className="flex items-center gap-1.5 text-red-600 text-xs bg-red-50 px-2.5 py-1.5 rounded-lg">
                      <AlertCircle size={14} />
                      <span>{validateError.allocationDateError}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                    <FileText size={14} className="text-blue-500" />
                    Description
                  </label>
                  <textarea
                    value={formData.allocationDescription || ""}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        allocationDescription: e.target.value
                      }))
                      if (validateError.descriptionError) {
                        setValidateError((prev) => ({
                          ...prev,
                          descriptionError: ""
                        }))
                      }
                    }}
                    rows="3"
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none text-gray-700"
                    placeholder="Provide detailed task description..."
                  />
                  {validateError.descriptionError && (
                    <div className="flex items-center gap-1.5 text-red-600 text-xs bg-red-50 px-2.5 py-1.5 rounded-lg">
                      <AlertCircle size={14} />
                      <span>{validateError.descriptionError}</span>
                    </div>
                  )}
                </div>

                {/* Reason For Changing - Conditional */}
                {approvedToggleStatus && (
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                      <FileText size={14} className="text-blue-500" />
                      Reason For Changing Staff
                    </label>
                    <textarea
                      value={formData.reason || ""}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          reason: e.target.value
                        }))
                        if (validateError.reasonError) {
                          setValidateError((prev) => ({
                            ...prev,
                            reasonError: ""
                          }))
                        }
                      }}
                      rows="3"
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none text-gray-700"
                      placeholder="Provide reason for changing..."
                    />
                    {validateError.reasonError && (
                      <div className="flex items-center gap-1.5 text-red-600 text-xs bg-red-50 px-2.5 py-1.5 rounded-lg">
                        <AlertCircle size={14} />
                        <span>{validateError.reasonError}</span>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex justify-center">
                  {" "}
                  {submiterror.submissionerror && (
                    <p className="text-red-500 text-sm">
                      {submiterror.submissionerror}
                    </p>
                  )}
                </div>

                {/* Info Message - Compressed */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-2.5">
                  <p className="text-xs text-blue-700 flex items-start gap-1.5">
                    <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                    <span>
                      Please ensure all information is accurate before
                      submitting. This task will be assigned immediately.
                    </span>
                  </p>
                </div>
              </div>

              {/* Footer Actions - Compressed */}
              <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 rounded-b-xl">
                <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
                  <button
                    onClick={() => {
                      setShowmodal(false)
                      setFormData((prev) => ({
                        ...prev,
                        allocationDate: "",
                        allocationDescription: "",
                        reason: ""
                      }))
                      setsubmitError({
                        submiterror: ""
                      })
                    }}
                    disabled={submitLoading}
                    className="w-full sm:w-auto px-5 py-2 text-sm border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitLoading}
                    className="w-full sm:w-auto px-5 py-2 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitLoading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Task"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showeventLog  && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-40">
            <div className="relative overflow-x-auto overflow-y-auto md:max-h-64 lg:max-h-96 shadow-xl rounded-lg mx-3 md:mx-5 px-7 p-3 bg-white w-full max-w-4xl">
              {/* Close Button */}
              <button
                onClick={() => {
                  setselectedLeadId(null)
                  setselectedData([])
                  setshoweventLog(false)
                }}
                className="absolute top-2 right-2  text-red-500 font-bold hover:text-red-600 text-lg"
              >
                ✕
              </button>

              {/* Header */}
              <div className="flex justify-center text-xl font-bold gap-2 mb-3">
                <span>Lead Id:</span>
                <span className="text-indigo-600">{selectedLeadId}</span>
              </div>

              {/* Table */}
              <table className="w-full text-sm border-collapse text-center">
                <thead className="text-center sticky top-0 z-10">
                  <tr className="bg-indigo-100">
                    <th className="border border-indigo-200 p-2 min-w-[100px]">
                      Date
                    </th>
                    <th className="border border-indigo-200 p-2 min-w-[100px]">
                      User
                    </th>
                    <th className="border border-indigo-200 p-2 min-w-[100px]">
                      Task
                    </th>
                    <th className="border border-indigo-200 p-2 w-fit min-w-[200px]">
                      Remark
                    </th>

                    <th className="border border-indigo-200 p-2 min-w-[100px]">
                      Next Follow Up Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedData && selectedData.length > 0 ? (
                    selectedData.map((item, index) => {
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
                            <td className="border border-gray-200 p-2"></td>
                          </tr>
                        ))
                      ) : (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
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
                          <td className="border border-gray-200 p-2 min-w-[160px]">
                            <div>
                              {item?.taskallocatedTo ? (
                                <>
                                  <span>{item?.taskBy || "N/A"}</span>
                                  <span className="text-red-500">
                                    {" "}
                                    - {item?.taskallocatedTo?.name || ""}
                                  </span>
                                  <br />
                                  <span className="text-red-500">
                                    {item.taskTo}
                                  </span>
                                  {item.allocationDate && (
                                    <span>
                                      {" "}
                                      - on(
                                      {new Date(
                                        item.allocationDate
                                      ).toLocaleDateString("en-GB")}
                                      )
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span>{item.taskBy}</span>
                              )}
                            </div>
                          </td>
                          <td className="border border-gray-200 p-2">
                            {item?.remarks || "N/A"}
                          </td>

                          <td className="border border-gray-200 p-2">
                            {item?.nextfollowUpDate
                              ? new Date(item.nextfollowUpDate)
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
                        colSpan={5}
                        className="text-center bg-white p-3 text-gray-500 italic"
                      >
                        No followUps
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LeadAllocationTable
