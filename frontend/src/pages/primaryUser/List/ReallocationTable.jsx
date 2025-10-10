import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import React from "react"
import { toast } from "react-toastify"
import { PropagateLoader } from "react-spinners"
import { useNavigate, useParams } from "react-router-dom"
import BarLoader from "react-spinners/BarLoader"
import api from "../../../api/api"
import Select from "react-select"
import UseFetch from "../../../hooks/useFetch"
const ReallocationTable = () => {
  const { label } = useParams()
  const [status, setStatus] = useState("Pending")

  const [toggleLoading, setToggleLoading] = useState(false)
  const [isClosed, setIsclosed] = useState(false)
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
      selectedCompanyBranch &&
      `/lead/getallreallocatedLead?selectedBranch=${selectedCompanyBranch}&role=${loggedUser.role}`
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
      const filteredLeads = filterLeadsByLastTaskLabel(leadreallocation, label)
      setTableData(filteredLeads)
    }
  }, [leadreallocation])
  const filterLeadsByLastTaskLabel = (leads, label) => {
    return leads.filter((lead) => {
      const logs = lead.activityLog
      if (!logs || logs.length === 0) return false

      const lastLog = logs[logs.length - 1]
      return lastLog.taskBy?.toLowerCase() === label.toLowerCase()
    })
  }

  const handleSelectedAllocates = (item, value) => {
    setTableData((prevLeads) =>
      prevLeads.map((lead) =>
        lead._id === item._id ? { ...lead, allocatedTo: value } : lead
      )
    )
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
      
      setsubmitError({ submissionerror: "something went wrong" })
      setsubmitLoading(false)
      console.log(error)
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
    setFormData({
      netAmount: "",
      balanceAmount: ""
    })
    setIsclosed(false)
    refreshHook()
    setTableData([])
  }
  return (
    <div className="flex flex-col h-full">
      {(submitLoading || loading) && (
        <BarLoader
          cssOverride={{ width: "100%", height: "4px" }} // Tailwind's `h-4` corresponds to `16px`
          color="#4A90E2" // Change color as needed
        />
      )}

      <div className="flex justify-between items-center mx-3 md:mx-5 mt-3 mb-3 ">
        <h2 className="text-lg font-bold ml-5 mt-3">ReAllocation List</h2>
        <div className="flex justify-end  ml-auto gap-6 items-center">
          {/* Branch Dropdown */}
          <select
            value={selectedCompanyBranch || ""}
            onChange={(e) => {
              setSelectedCompanyBranch(e.target.value)
              setStatus(approvedToggleStatus ? "Approved" : "Pending")
            }}
            className="border border-gray-300 py-1 rounded-md px-2 focus:outline-none min-w-[120px]"
          >
            {loggedUserBranches?.map((branch) => (
              <option key={branch._id} value={branch.value}>
                {branch.label}
              </option>
            ))}
          </select>

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
      <div className="flex-1  overflow-x-auto rounded-lg text-center overflow-y-auto border  shadow-xl mx-3 md:mx-5 mb-3">
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
              <th className="border  border-l-0 border-t-0 border-gray-400 px-4  min-w-[100px]">
                Description
              </th>
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
                    <td className=" px-4 border border-b-0 border-gray-400 "></td>
                    <td className="border border-b-0 border-gray-400 px-4 "></td>

                    <td className="border border-b-0 border-gray-400 px-1  text-blue-400 min-w-[50px] hover:text-blue-500 hover:cursor-pointer font-semibold">
                      <button
                        onClick={() =>
                          loggedUser.role === "Admin"
                            ? navigate("/admin/transaction/lead/leadEdit", {
                                state: {
                                  leadId: item._id,
                                  isReadOnly: true
                                }
                              })
                            : navigate("/staff/transaction/lead/leadEdit", {
                                state: {
                                  leadId: item._id,
                                  isReadOnly: true
                                }
                              })
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
                    <td className="px-4 min-w-[120px] border border-t-0 border-b-0 border-gray-400">
                      {item?.activityLog[item.activityLog.length - 1].remarks}
                    </td>
                    <td className=" border border-t-0 border-b-0 border-gray-400 px-1 bg-white ">
                      <select
                        value={selectedAllocationType?.item_id?.value}
                        onChange={(e) => {
                          setselectedAllocationType((prev) => ({
                            ...prev,
                            [item._id]: e.target.value
                          }))
                          setselectedType(e.target.value)
                          setValidatetypeError((prev) => ({
                            ...prev,
                            [item._id]: ""
                          }))
                        }}
                        className="py-1 border border-gray-400 rounded-md  w-full focus:outline-none cursor-pointer"
                      >
                        <option>Select Type</option>

                        <option value="followup">Followup</option>
                        <option value="programming">Programming</option>
                        <option value="testing-&-implementation">
                          Testing & Implementation
                        </option>
                        <option value="coding-&-testing">
                          Coding & Testing
                        </option>
                        <option value="software-services">
                          Software Service
                        </option>
                        <option value="customermeet">Customer Meet</option>
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
                    <td
                      className=" border border-t-0 border-b-0 border-gray-400 px-4  text-red-500 hover:cursor-pointer bg-white"
                      onClick={() => {
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
                        setFormData((prev) => ({
                          ...prev,
                          allocationDate: new Date()
                        }))
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
                    <td className="border  border-t-0 border-r-0 border-b-0 border-gray-400 px-4 py-0.5 "></td>
                    <td className="border border-t-0 border-b-0 border-gray-400   px-4 py-0.5 "></td>
                    <td
                      className="border border-t-0 border-b-0 border-gray-400   px-4 py-0.5 text-red-400 hover:text-red-500 hover:cursor-pointer font-semibold"
                      onClick={() => {
                        setIsclosed(true)
                        setFormData((prev) => ({
                          ...prev,
                          netAmount: item?.netAmount,
                          balanceAmount: item?.balanceAmount
                        }))
                        setselectedLeadId(item?._id)
                      }}
                    >
                      Closed
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
                          {
                            item?.activityLog[item.activityLog.length - 1]
                              .taskBy
                          }{" "}
                          -
                        </span>
                        <span>
                          {
                            item?.activityLog[item.activityLog.length - 1]
                              ?.remarks
                          }
                        </span>
                      </div>
                    </td>
                    <td className="border border-t-0 border-gray-400 "></td>
                    <td className="border border-t-0 border-gray-400 "></td>
                    <td
                      // onClick={() => {
                      //   if (!selectedAllocates.hasOwnProperty(item._id)) {
                      //     setValidateError((prev) => ({
                      //       ...prev,
                      //       [item._id]: "Allocate to Someone"
                      //     }))
                      //     return
                      //   }
                      //   if (!selectedAllocationType.hasOwnProperty(item._id)) {
                      //     setValidatetypeError((prev) => ({
                      //       ...prev,
                      //       [item._id]: "please select a Type"
                      //     }))
                      //     return
                      //   }
                      //   setselectedLeadId(item.leadId)
                      //   setShowmodal(true)
                      //   setSelectedItem(item)
                      //   setFormData((prev) => ({
                      //     ...prev,
                      //     allocationDate: new Date()
                      //   }))
                      // }}
                      className="border border-t-0 border-gray-400"
                    ></td>
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
                <td colSpan={10} className="text-center text-gray-500 py-4">
                  {approvedToggleStatus ? (
                    toggleLoading ? (
                      <div className="flex justify-center">
                        <PropagateLoader color="#3b82f6" size={10} />
                      </div>
                    ) : (
                      <div>No Allocated Leads</div>
                    )
                  ) : loading ? (
                    <div className="flex justify-center">
                      <PropagateLoader color="#3b82f6" size={10} />
                    </div>
                  ) : toggleLoading ? (
                    <div className="flex justify-center">
                      <PropagateLoader color="#3b82f6" size={10} />
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-40 ">
            <div className="bg-white md:w-1/4 grid grid-cols-1 rounded-lg shadow-xl ">
              {submitLoading && (
                <BarLoader
                  cssOverride={{ width: "100%", height: "4px" }} // Tailwind's `h-4` corresponds to `16px`
                  color="#4A90E2" // Change color as needed
                />
              )}
              <div className="md:px-6 md:py-4 py-2 px-3">
                <h1 className="font-semibold text-xl">{`Lead Reallocation for ${selectedType}-LeadId:${selectedLeadId}`}</h1>
                <div>
                  <label className="block text-left">Allocated Date</label>
                  <input
                    value={formData.allocationDate || ""}
                    type="date"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        allocationDate: e.target.value
                      }))
                    }
                    className="py-1 border border-gray-400 mt-1  w-full rounded-md px-2 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-left">Description</label>
                  <textarea
                    value={formData.allocationDescription || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        allocationDescription: e.target.value
                      }))
                    }
                    className="py-1 px-2 border border-gray-400 mt-1 w-full focus:outline-none rounded-md"
                    placeholder="Type Here..."
                  ></textarea>
                </div>
                <div className="flex justify-center">
                  {" "}
                  {submiterror.submissionerror && (
                    <p className="text-red-500 text-sm">
                      {submiterror.submissionerror}
                    </p>
                  )}
                </div>
                <div className="flex justify-center gap-4 text-white mt-2">
                  <button
                    onClick={() => {
                      setShowmodal(false)
                      setsubmitError({ submissionerror: "" })
                    }}
                    className="bg-gray-600 py-1 px-3 rounded-md hover:bg-gray-700 cursor-pointer"
                  >
                    CLOSE
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="bg-blue-500 py-1 px-3 rounded-md hover:bg-blue-600 cursor-pointer"
                  >
                    SUBMIT
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {isClosed && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-40 ">
            <div className="bg-white md:w-1/4 grid grid-cols-1 rounded-lg shadow-xl p-5">
              <h1 className="text-xl font-semibold">Lead Closed Amount</h1>
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
                  value={formData?.recievedAmount}
                  onChange={(e) => {
                    if (submiterror.recievedAmount) {
                      setsubmitError((prev) => ({
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
                {submiterror.recievedAmount && (
                  <p className="text-red-500">{submiterror.recievedAmount}</p>
                )}
              </div>
              <div className="mt-3 flex space-x-3 justify-center">
                <button
                  onClick={() => setIsclosed(false)}
                  className="bg-gray-600 py-1 px-3 rounded-md hover:bg-gray-700 cursor-pointer text-white"
                >
                  Close
                </button>
                <button
                  onClick={() => handleClosed()}
                  className="bg-blue-500 py-1 px-3 rounded-md hover:bg-blue-600 cursor-pointer text-white"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReallocationTable
