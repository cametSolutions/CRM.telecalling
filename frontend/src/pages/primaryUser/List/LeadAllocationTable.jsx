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
  const [pedingleadTableData, setpendingLeadTableData] = useState([])
  const [showFullName, setShowFullName] = useState(false)
  const [showFullEmail, setShowFullEmail] = useState(false)
  const [approvedToggleStatus, setapprovedToggleStatus] = useState(false)
  const [submitLoading, setsubmitLoading] = useState(false)
  const [allocationOptions, setAllocationOptions] = useState([])
  const [selectedAllocates, setSelectedAllocates] = useState({})
  const [allStaffs, setallStaffs] = useState([])
  const [loader, setloader] = useState(true)
  const [tableData, setTableData] = useState([])
  const { data: leadPendinglist, loading } = UseFetch(
    status && `/lead/getallLead?Status=${status}`
  )
  const { data } = UseFetch("/auth/getallUsers")
  const navigate = useNavigate()
  const userData = localStorage.getItem("user")
  const user = JSON.parse(userData)

  useEffect(() => {
    if (data) {
      const { allusers = [], allAdmins = [] } = data

      // Combine allusers and allAdmins
      const combinedUsers = [...allusers, ...allAdmins]

      setAllocationOptions(
        combinedUsers.map((item) => ({
          value: item?._id,
          label: item?.name
        }))
      )
    }
  }, [data])
  useEffect(() => {
    if (leadPendinglist) {
      console.log(leadPendinglist)
      setTableData(leadPendinglist)
    }
  }, [leadPendinglist])
  const toggleStatus = async () => {
    setShowFullEmail(false)
    setShowFullName(false)
    if (approvedToggleStatus === false) {
      setsubmitLoading(true)
      const response = await api.get("/lead/getallLead?Status=Approved")
      if (response.status >= 200 && response.status < 300) {
        setTableData(response.data.data)
        setapprovedToggleStatus(!approvedToggleStatus)
        setsubmitLoading(false)
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
      const response = await api.get("/lead/getallLead?Status=Pending")
      if (response.status >= 200 && response.status < 300) {
        setTableData(response.data.data)
        setapprovedToggleStatus(!approvedToggleStatus)
        setsubmitLoading(false)
      }
    }
  }

  const handleSelectedAllocates = (item, value) => {
    console.log(item)
    console.log(value)
    console.log(tableData)
    // setpendingLeadTableData((prevLeads) =>
    //   prevLeads.map((lead) =>
    //     lead._id === id ? { ...lead, allocatedTo: value } : lead
    //   )
    // )
  }
  console.log(pedingleadTableData)

  const handleSubmit = async (leadAllocationData) => {
    console.log(leadAllocationData)
    return
    try {
      setsubmitLoading(true)
      if (approvedToggleStatus) {
      } else {
        const response = await api.post(
          "/lead/leadAllocation?allocationpending=true",
          leadAllocationData
        )

        if (response.status >= 200 && response.status < 300) {
          tableData(response.data.data)
          setsubmitLoading(false)
        }
      }
    } catch (error) {
      console.log("error:", error.message)
    }
  }
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
                  user.role === "Admin"
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
                  <th className="px-4 py-2 text-center">Lead Date</th>
                  <th className="px-4 py-2 text-center">Lead ID</th>
                  <th className="px-4 py-2 text-center">Customer Name</th>
                  <th className="px-4 py-2 text-center">Mobile Number</th>
                  <th className="px-4 py-2 text-center">Phone Number</th>
                  <th className="px-4 py-2 text-center">Email Id</th>
                  <th className="px-2 py-2 text-center">Product/Services</th>
                  <th className="px-4 py-2 text-center">Net Amount</th>
                  <th className="px-4 py-2 text-center">Lead By</th>
                  <th className="px-4 py-2 text-center">Allocated To</th>
                  <th className="px-4 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-center divide-gray-200 bg-gray-200 whitespace-nowrap">
                {tableData && tableData.length > 0 ? (
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
                            user.role === "Admin"
                              ? navigate("/admin/transaction/leadEdit", {
                                  state: {
                                    leadId: item._id
                                  }
                                })
                              : navigate("/staff/transaction/leadEdit", {
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
                      {loading ? (
                        <div className="flex justify-center items-center gap-2">
                          <PropagateLoader color="#3b82f6" size={10} />
                        </div>
                      ) : (
                        "No Allocation Pending"
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeadAllocationTable
