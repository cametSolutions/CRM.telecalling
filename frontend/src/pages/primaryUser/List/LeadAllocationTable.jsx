import { useState, useEffect } from "react"
import React from "react"

import { PropagateLoader } from "react-spinners"
import { useNavigate } from "react-router-dom"
import BarLoader from "react-spinners/BarLoader"
import api from "../../../api/api"
import Select from "react-select"
import UseFetch from "../../../hooks/useFetch"
const LeadAllocationTable = () => {
  const [status, setStatus] = useState("Pending")

  const [toggleLoading, setToggleLoading] = useState(false)
  const [validateError, setValidateError] = useState({})
  const [loggedUserBranches, setLoggeduserBranches] = useState([])
  const [selectedCompanyBranch, setSelectedCompanyBranch] = useState(null)
  const [showFullName, setShowFullName] = useState(false)
  const [showFullEmail, setShowFullEmail] = useState(false)
  const [approvedToggleStatus, setapprovedToggleStatus] = useState(false)
  const [submitLoading, setsubmitLoading] = useState(false)
  const [allocationOptions, setAllocationOptions] = useState([])
  const [selectedAllocates, setSelectedAllocates] = useState({})
  const [loggedUser, setLoggedUser] = useState(null)
  const [tableData, setTableData] = useState([])
  const { data: branches } = UseFetch("/branch/getBranch")
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
        console.log(response.data.data)
        setTableData(response.data.data)
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

  const handleSubmit = async (leadAllocationData) => {
    if (!selectedAllocates.hasOwnProperty(leadAllocationData._id)) {
      setValidateError((prev) => ({
        ...prev,
        [leadAllocationData._id]: "Allocate to Someone"
      }))
      return
    }

    try {
      setsubmitLoading(true)
      if (approvedToggleStatus) {
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

  return (
    <div className="flex flex-col h-full">
      {(submitLoading || loading) && (
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
                Followup Date
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
                <React.Fragment key={index}>
                  <tr className="bg-white">
                    <td
                      onClick={() => setShowFullName(!showFullName)}
                      className={`px-4 cursor-pointer overflow-hidden border border-r-0 border-b-0 border-gray-400 ${
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
                    <td className="border border-b-0 border-gray-400 px-4 "></td>
                  </tr>

                  <tr className=" font-semibold bg-gray-100">
                    <td className=" px-4 border border-b-0 border-t-0 border-r-0 border-gray-400 ">
                      Leadby
                    </td>
                    <td className=" px-4">Assignedto</td>
                    <td className=" px-4 ">Assignedby</td>
                    <td className="px-4 ">No. of Followups</td>
                    <td className="px-4 min-w-[120px]">Lead Date</td>
                    <td className=" border border-t-0 border-b-0 border-gray-400 px-4 bg-white "></td>
                    <td className=" border border-t-0 border-b-0 border-gray-400 px-4  text-blue-400 hover:text-blue-500 hover:cursor-pointer bg-white">
                      Follow Up
                    </td>
                    <td className=" border border-t-0 border-b-0 border-gray-400 px-4 bg-white ">
                      {" "}
                      {item.netAmount}
                    </td>
                  </tr>

                  <tr className="bg-white">
                    <td className="border border-t-0 border-r-0  border-gray-400 px-4 py-0.5 ">
                      {item?.leadBy?.name}
                    </td>
                    <td className="border border-t-0 border-r-0 border-l-0  border-gray-400 px-4 py-0.5 ">
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
                      className="border border-t-0 border-gray-400   px-4 py-0.5 text-red-400 hover:text-red-500 hover:cursor-pointer font-semibold"
                      onClick={() => handleSubmit(item)}
                    >
                      Allocate
                    </td>
                    <td className="border border-t-0 border-gray-400   px-4 py-0.5"></td>
                  </tr>
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center text-gray-500 py-4">
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
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LeadAllocationTable
