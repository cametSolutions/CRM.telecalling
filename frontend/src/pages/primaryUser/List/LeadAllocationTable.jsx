import { useState, useEffect } from "react"
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

  const [toggleLoading, setToggleLoading] = useState(false)
  const [selectedType, setselectedType] = useState(null)
  const [selectedLeadId, setselectedLeadId] = useState(null)
  const [showModal, setShowmodal] = useState(false)
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
      setTableData(leadPendinglist)
    }
  }, [leadPendinglist])
  const toggleStatus = async () => {
    setTableData([])
    setShowFullEmail(false)
    setShowFullName(false)
    if (approvedToggleStatus === false) {
      setToggleLoading(true)
      const response = await api.get(
        `/lead/getallLead?Status=Approved&selectedBranch=${selectedCompanyBranch}&role=${loggedUser.role}`
      )

      if (response.status >= 200 && response.status < 300) {
        const data = response.data.data
        setTableData(data)
        data.forEach((item) => {
          setselectedAllocationType((prev) => ({
            ...prev,
            [item._id]: item.allocationType
          }))
        })
        setapprovedToggleStatus(!approvedToggleStatus)
        setToggleLoading(false)
        const initialSelected = {}

        response.data.data.forEach((item) => {
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
      setToggleLoading(true)
      const response = await api.get(
        `/lead/getallLead?Status=Pending&selectedBranch=${selectedCompanyBranch}&role=${loggedUser.role}`
      )
      if (response.status >= 200 && response.status < 300) {
        setSelectedAllocates({})
        setTableData(response.data.data)
        setapprovedToggleStatus(!approvedToggleStatus)
        setToggleLoading(false)
      }
    }
  }
  const handleSelectedAllocates = (item, value) => {
    setTableData((prevLeads) =>
      prevLeads.map((lead) =>
        lead._id === item._id ? { ...lead, allocatedTo: value } : lead
      )
    )
  }

  const handleSubmit = async () => {
    if (formData.allocationDescription === "") {
      setValidateError((prev) => ({
        ...prev,
        descriptionError: "Please fill it "
      }))
      return
    }

    try {
      if (selectedAllocationType) {
        const selected = selectedAllocationType[selectedItem._id]
console.log(selected)


        setsubmitLoading(true)

        if (approvedToggleStatus) {
          const response = await api.post(
            `/lead/leadAllocation?allocationpending=${!approvedToggleStatus}&selectedbranch=${selectedCompanyBranch}&allocationType=${selected}&allocatedBy=${
              loggedUser._id
            }`,
            { selectedItem, formData }
          )
          if (response.status >= 200 && response.status < 300) {
            setTableData(response.data.data)
            setsubmitLoading(false)
          }
        } else {
          const response = await api.post(
            `/lead/leadAllocation?allocationpending=${!approvedToggleStatus}&selectedbranch=${selectedCompanyBranch}&allocationType=${selected}&allocatedBy=${
              loggedUser._id
            }`,
            { selectedItem, formData }
          )

          if (response.status >= 200 && response.status < 300) {
            setSelectedAllocates((prev) => {
              const updated = { ...prev }
              delete updated[selectedItem._id]
              return updated
            })
            setTableData(response.data.data)
            setsubmitLoading(false)
          }
        }
      }
    } catch (error) {
      console.log("error:", error.message)
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
            className="border border-gray-300 py-1 rounded-md px-2 focus:outline-none min-w-[120px]"
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

          {tableData && tableData.length > 0 ? (
            tableData.map((item, index) => (
              <tbody
                key={index}
                className="border-separate border-sapcing-y-2 [&:not(:first-child)]:pt-2"
              >
                <tr className="bg-white">
                  <td className="border border-l-1 border-b-0 border-t-0 border-gray-400  px-4 "></td>
                  <td
                    onClick={() => setShowFullName(!showFullName)}
                    className={`px-4 cursor-pointer overflow-hidden border border-r-0 border-b-0 border-t-0 border-gray-400 ${
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
                  <td className="border border-b-0 border-t-0 border-gray-400 px-4 "></td>

                  <td className="border border-b-0 border-t-0 border-gray-400 px-1  text-blue-400 min-w-[50px] hover:text-blue-500 hover:cursor-pointer font-semibold">
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
                  <td className="border border-b-0 border-t-0 border-gray-400 px-4 "></td>
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
                  <td className=" border border-t-0 border-b-0 border-gray-400 px-1 bg-white ">
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
                      className="py-0.5 border border-gray-400 rounded-md  w-full focus:outline-none cursor-pointer"
                    >
                      <option>Select Type</option>
                      <option value="followup">Followup</option>
                      <option value="programming">Programming</option>
                      <option value="testing-&-implementation">Testing & Implementation</option>
                      <option value="coding-&-testing">Coding & Testing</option>
                      <option value="software-services">Software Service</option>
                      <option value="customermeet">Customer Meet</option>
                      <option value="demo">Demo</option>
                      <option value="training">Training</option>
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
                    {item.netAmount}
                  </td>
                </tr>

                <tr className="bg-white ">
                  <td className="border border-t-0 border-r-0 border-b-0  border-gray-400 px-4 py-0.5 "></td>
                  <td className="border border-t-0 border-r-0 border-b-0  border-gray-400 px-4 py-0.5 ">
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
                            handleSelectedAllocates(item, selectedOption.value)
                            setValidateError((prev) => ({
                              ...prev,
                              [item._id]: ""
                            }))
                          }}
                          className="w-44 focus:outline-red-500 "
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
                  <td className="border  border-t-0 border-r-0 border-l-0 border-b-0  border-gray-400 px-4 py-0.5">
                    {item.allocatedBy?.name}
                  </td>
                  <td className="border  border-t-0 border-r-0 border-l-0 border-b-0 border-gray-400  px-4 py-0.5 ">
                    {/* {item.followUpDatesandRemarks.length} */}
                  </td>
                  <td className="border  border-t-0 border-r-0 border-l-0 border-b-0 border-gray-400 px-4 py-0.5 ">
                    {item.leadDate?.toString().split("T")[0]}
                  </td>
                  <td className="border border-t-0 border-gray-400 border-b-0  px-4 py-0.5 "></td>
                  <td
                    className="border border-t-0 border-gray-400 border-b-0  px-4 py-0.5 text-red-400 hover:text-red-500 hover:cursor-pointer font-semibold"
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
                  <td className="border border-l-1 border-t-0 border-gray-400"></td>
                  <td
                    colSpan={5}
                    className="text-center py-1 font-semibold border border-t-0 border-gray-400"
                  >
                    <div className="flex  w-full">
                      <span className="min-w-[100px]"></span>
                      <span className="mr-2">Description : </span>
                      <span>
                        {" "}
                        {approvedToggleStatus
                          ? item?.activityLog[1].remarks
                          : item?.remark}{" "}
                      </span>
                    </div>
                  </td>
                  <td className="border border-t-0 border-gray-400 bg-white"></td>
                  <td className="border border-t-0 border-gray-400 bg-white"></td>
                  <td className="border border-t-0 border-gray-400 bg-white"></td>
                </tr>
              </tbody>
            ))
          ) : (
            <tbody>
              <tr>
                <td colSpan={9} className="text-center text-gray-500 py-4">
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
                    <div>No Pending Leads</div>
                  )}
                </td>
              </tr>
            </tbody>
          )}
        </table>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-40 ">
            <div className="bg-white rounded-lg shadow-xl">
              {submitLoading && (
                <BarLoader
                  cssOverride={{ width: "100%", height: "4px" }} // Tailwind's `h-4` corresponds to `16px`
                  color="#4A90E2" // Change color as needed
                />
              )}
              <div className=" w-full md:w-72 p-4 grid grid-cols-1">
                <h2 className="font-semibold text-lg text-gray-700">
                  Task Allocation
                </h2>
                <h2 className="font-semibold text-md text-gray-700">
                  {` ${
                    selectedAllocationType[selectedItem._id] + " of "
                  }LEAD ID-${selectedLeadId}`}
                </h2>
                <div className="p-4 shadow-xl border border-gray-200 rounded-lg">
                  <div>
                    <label className="block text-left">Allocated Date</label>
                    <input
                      readOnly
                      value={
                        formData?.allocationDate
                          ?.toLocaleDateString("en-GB")
                          .split("/")
                          .join("-") || ""
                      }
                      type="text"
                      className="py-1 border border-gray-400 mt-1 text-xl  w-full focus:outline-none cursor-not-allowed rounded-sm px-2"
                    />
                  </div>

                  <div>
                    <label className="block text-left">Description</label>
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
                      className="py-1 px-2 border border-gray-400 mt-1 w-full focus:outline-none rounded-md "
                      placeholder="Type Here...."
                    ></textarea>
                  </div>
                  {validateError.descriptionError && (
                    <p className="text-red-500 text-sm">
                      {validateError.descriptionError}
                    </p>
                  )}
                </div>
                <div className="flex justify-center gap-4 text-white mt-5 md:mt-2">
                  <button
                    onClick={() => setShowmodal(false)}
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
      </div>
    </div>
  )
}

export default LeadAllocationTable
