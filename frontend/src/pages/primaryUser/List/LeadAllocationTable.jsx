import { useState, useEffect } from "react"
import { PropagateLoader } from "react-spinners"
import { useNavigate } from "react-router-dom"
import BarLoader from "react-spinners/BarLoader"
import api from "../../../api/api"
import Select from "react-select"
import UseFetch from "../../../hooks/useFetch"
import { formatDate } from "../../../utils/dateUtils"
const LeadAllocationTable = () => {
  const [status, setStatus] = useState("Pending")
  const [toggleLoading, setToggleLoading] = useState(false)
  const [loggedUserBranches, setLoggeduserBranches] = useState([])
  const [showFullName, setShowFullName] = useState(false)
  const [showFullEmail, setShowFullEmail] = useState(false)
  const [approvedToggleStatus, setapprovedToggleStatus] = useState(false)
  const [submitLoading, setsubmitLoading] = useState(false)
  const [allocationOptions, setAllocationOptions] = useState([])
  const [selectedAllocates, setSelectedAllocates] = useState({})
  const [loggedUser, setLoggedUser] = useState(null)
  const [tableData, setTableData] = useState([])

  const { data: leadPendinglist, loading } = UseFetch(
    status &&
      loggedUser &&
      loggedUserBranches &&
      `/lead/getallLead?Status=${status}&userBranch=${encodeURIComponent(
        JSON.stringify(loggedUserBranches)
      )}&role=${loggedUser.role}`
  )

  const { data } = UseFetch("/auth/getallUsers")
  const navigate = useNavigate()
  useEffect(() => {
    const userData = localStorage.getItem("user")
    const user = JSON.parse(userData)
    setLoggedUser(user)

    const branches = user?.selected
      ? user.selected.map((branch) => branch.branch_id)
      : []

    setLoggeduserBranches(branches)
  }, [])
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
    if (leadPendinglist) {
      console.log("hhhhh")
      setTableData(leadPendinglist)
      // setapprovedToggleStatus(!approvedToggleStatus)
    }
  }, [leadPendinglist])
  const toggleStatus = async () => {
    setShowFullEmail(false)
    setShowFullName(false)
    if (approvedToggleStatus === false) {
      setToggleLoading(true)
      const response = await api.get(
        `/lead/getallLead?Status=Approved&userBranch=${encodeURIComponent(
          JSON.stringify(loggedUserBranches)
        )}&role=${loggedUser.role}`
      )
      if (response.status >= 200 && response.status < 300) {
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
        `/lead/getallLead?Status=Pending&userBranch=${encodeURIComponent(
          JSON.stringify(loggedUserBranches)
        )}&role=${loggedUser.role}`
      )
      if (response.status >= 200 && response.status < 300) {
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
      }
    } catch (error) {
      console.log("error:", error.message)
    }
  }
  console.log(approvedToggleStatus)
  return (
    <div className="h-full ">
      {submitLoading && (
        <BarLoader
          cssOverride={{ width: "100%", height: "4px" }} // Tailwind's `h-4` corresponds to `16px`
          color="#4A90E2" // Change color as needed
        />
      )}
      <div className="h-full md:p-6 p-3 bg-blue-50">
        <div className="md:px-8 px-3 py-3 shadow-xl h-full border border-gray-100 rounded-xl bg-gray-50 ">
          <div className="flex justify-between items-center mb-4 ">
            <h2 className="text-lg font-bold">
              {approvedToggleStatus ? "Approved" : "Pending"} Allocation List
            </h2>
            <div className="flex gap-6 items-center">
              <button
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
                className="bg-black text-white py-2 px-3 rounded-lg shadow-lg hover:bg-gray-600"
              >
                Go Lead
              </button>
            </div>
          </div>

          {/* Responsive Table Container */}
          <div className="overflow-x-auto rounded-lg text-center ">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-blue-500 text-white text-sm whitespace-nowrap">
                <tr>
                  <th className="px-4 py-2 text-center">Name</th>
                  <th className="px-4 py-2 text-center">Mobile</th>
                  <th className="px-4 py-2 text-center">Phone</th>
                  <th className="px-4 py-2 text-center">Email</th>
                  <th className="px-4 py-2 text-center">Lead Id</th>
                  <th className="px-4 py-2 text-center">Followup Date</th>
                  <th className="px-4 py-2 text-center">Action</th>
                  <th className="px-4 py-2 text-center">Netmount</th>
                </tr>
              </thead>
              <tbody className="text-center divide-gray-200 bg-gray-200 whitespace-nowrap">
                <tr>
                  <td>Abhi</td>
                  <td>9876543210</td>
                  <td>040-123456</td>
                  <td>abhi@example.com</td>
                  <td>Manager</td>
                  <td>John</td>
                  <td>
                    <div className="flex flex-col items-center gap-1">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => openModal("view")}
                      >
                        View
                      </button>
                      <button
                        className="text-green-600 hover:underline"
                        onClick={() => openModal("modify")}
                      >
                        Modify
                      </button>
                    </div>
                  </td>
                  <td>2</td>
                </tr>{" "}
                <tr className="text-xs text-left ">
                  <td >
                    <strong className="font-normal text-sm">LeadBy:</strong>
                    abhi
                  </td>
                  <td>
                    <strong className="font-normal text-sm">AssignedTo:</strong>
                  </td>
                  <td>
                    <strong className="font-normal text-sm">AssignedBy:</strong>
                  </td>
                  <td>
                    <strong className="font-normal text-sm">Lead ID:</strong>
                  </td>
                  <td>
                    <strong className="font-normal text-sm">
                      No.of Followup :
                    </strong>
                  </td>
                  <td colSpan={3}></td>
                  {/* Empty span to fill the remaining 3 columns */}
                </tr>
                {/* {tableData && tableData.length > 0 ? (
                  tableData.map((item) => (
                    <tr key={item.id} className="">
                      <td className="px-1 border border-gray-300">
                        {formatDate(item.leadDate)}
                      </td>
                      <td className="px-4  border border-gray-300">
                        {item?.leadId}
                      </td>{" "}
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
                        {item?.netAmount}
                      </td>
                      <td className="px-4  border border-gray-300">
                        {item?.leadBy.name}
                      </td>
                      <td className="  border border-gray-300">
                        <Select
                          options={allocationOptions}
                          value={selectedAllocates[item._id] || null}
                          onChange={(selectedOption) => {
                            setSelectedAllocates((prev) => ({
                              ...prev,
                              [item._id]: selectedOption
                            }))
                            handleSelectedAllocates(item, selectedOption.value)
                          }}
                          className="w-44 focus:outline-none"
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              boxShadow: "none", // removes blue glow
                              borderColor: state.isFocused
                                ? "#ccc"
                                : base.borderColor, // optional: neutral border on focus
                              "&:hover": {
                                borderColor: "#ccc" // optional hover styling
                              }
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
                      <td className="px-4  border border-gray-300">
                        <button
                          onClick={() => handleSubmit(item)}
                          className="bg-gray-700 hover:bg-gray-800 text-white rounded-lg px-4 shadow-lg"
                        >
                          {approvedToggleStatus ? "UPDATE" : "SUBMIT"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="11"
                      className="px-4 py-4 text-center bg-gray-100"
                    >
                      {loading || toggleLoading ? (
                        <div className="flex justify-center items-center gap-2">
                          <PropagateLoader color="#3b82f6" size={10} />
                        </div>
                      ) : approvedToggleStatus ? (
                        "No Approved allocated Leads"
                      ) : (
                        "No Pending allocated Leads"
                      )}
                    </td>
                  </tr>
                )} */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeadAllocationTable
