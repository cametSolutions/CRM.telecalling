import { useState, useEffect } from "react"
import ReallocationTable from "./ReallocationTable"
import { useNavigate } from "react-router-dom"

import { AiOutlineProfile } from "react-icons/ai"
import { toast } from "react-toastify"
import { PropagateLoader } from "react-spinners"
import BarLoader from "react-spinners/BarLoader"
import api from "../../../api/api"
import Select from "react-select"
import UseFetch from "../../../hooks/useFetch"
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
  const { data: branches } = UseFetch("/branch/getBranch")
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

        const lastTask = logs[logs.length - 1]
        const taskBy = lastTask.taskBy

        if (taskBy) {
          acc[taskBy] = (acc[taskBy] || 0) + 1
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
 
  return (
    <div className="flex flex-col h-full">
      {(submitLoading || loading) && (
        <BarLoader
          cssOverride={{ width: "100%", height: "4px" }} // Tailwind's `h-4` corresponds to `16px`
          color="#4A90E2" // Change color as needed
        />
      )}
      <h2 className="text-lg font-bold ml-5 mt-3">ReAllocation List</h2>

      <div className="border border-gray-100 p-3 mx-4 rounded-xl shadow-xl bg-white  ">
        {gridList &&
          gridList.length > 0 &&
          gridList.map((item) => {
            return (
              <div className="flex items-center gap-3 bg-slate-100 p-3 rounded-md shadow-sm text-black text-lg cursor-pointer">
                <div className="bg-blue-500 text-white rounded-full p-2 md:mr-10">
                  <AiOutlineProfile className="text-xl " />
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
                          )}`
                    )
                  }
                  className="flex justify-between w-full px-6 py-2 bg-white shadow-xl rounded-md border border-gray-100"
                >
                  <span className="font-medium">{item.label}</span>
                  <span className="text-gray-600">{item.value}</span>
                </div>
              </div>
            )
          })}
      </div>

      {/* <div className="flex justify-between items-center mx-3 md:mx-5 mt-3 mb-3 ">
        <h2 className="text-lg font-bold ">ReAllocation List</h2>
        <div className="flex justify-end  ml-auto gap-6 items-center">
          <select
            // value={selectedCompanyBranch || ""}
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
      </div> */}

      {/* <div className="flex-1  overflow-x-auto rounded-lg text-center overflow-y-auto border  shadow-xl mx-3 md:mx-5 mb-3">
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
                    <td className="border border-b-0 border-gray-400 px-4 ">
                     
                    </td>

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
                    <td className=" border border-t-0 border-b-0 border-gray-400 px-4  text-blue-400 hover:text-blue-500 hover:cursor-pointer bg-white">
                      Follow Up
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
                    <td className="border  border-t-0 border-r-0 border-l-0 border-b-0 border-gray-400 px-4 py-0.5">
                    </td>
                    <td className="border  border-t-0 border-r-0 border-l-0 border-b-0  border-gray-400  px-4 py-0.5 ">
                    </td>
                    <td className="border  border-t-0 border-r-0 border-l-0 border-b-0 border-gray-400 px-4 py-0.5 ">
                      {new Date(item?.leadDate).toLocaleDateString()}
                    </td>
                    <td className="border  border-t-0 border-r-0 border-b-0 border-gray-400 px-4 py-0.5 ">
                    </td>
                    <td className="border border-t-0 border-b-0 border-gray-400   px-4 py-0.5 "></td>
                    <td
                      className="border border-t-0 border-b-0 border-gray-400   px-4 py-0.5 text-red-400 hover:text-red-500 hover:cursor-pointer font-semibold"
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
                    <td className="border border-t-0 border-b-0 border-gray-400   px-4 py-0.5"></td>
                  </tr>
                  <tr className="bg-gray-100">
                    <td className="border border-l-1 border-t-0 border-gray-400 "></td>
                    <td
                      colSpan={5}
                      className="text-center py-1 font-semibold border border-t-0 border-gray-400"
                    >
                      <div className="flex  w-full">
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
                    <td className="border border-t-0 border-gray-400 "></td>
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
      </div> */}
    </div>
  )
}

export default Reallocation
