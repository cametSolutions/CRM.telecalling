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
  const [submitLoading, setsubmitLoading] = useState(false)
  const [allocationOptions, setAllocationOptions] = useState([])
  const [selectedAllocates, setSelectedAllocates] = useState({})
  const [allStaffs, setallStaffs] = useState([])
  const [loader, setloader] = useState(true)
  const [pendingLeadtableData, setpendingLeadTableData] = useState([])
  const { data: leadPendinglist, loading } = UseFetch(
    status && `/lead/getallLead?Status=${status}`
  )
  const { data } = UseFetch("/auth/getallUsers")
  const navigate = useNavigate()
  const userData = localStorage.getItem("user")
  const user = JSON.parse(userData)

  console.log(leadPendinglist)
  useEffect(() => {
    if (data) {
      console.log("h")
      const { allusers = [], allAdmins = [] } = data
      console.log(allusers)

      // Combine allusers and allAdmins
      const combinedUsers = [...allusers, ...allAdmins]

      // Set combined names to state
      // setallStaffs(combinedUsers)

      setAllocationOptions(
        combinedUsers.map((item) => ({
          value: item?._id,
          label: item?.name
        }))
      )
    }
  }, [data])
  console.log(allocationOptions)
  console.log(allStaffs)
  useEffect(() => {
    if (leadPendinglist) {
      setpendingLeadTableData(leadPendinglist)
    }
  }, [leadPendinglist])
  const toggleStatus = () => {
    setStatus(
      status === "Pending Allocation"
        ? "Approved Allocation"
        : "Pending Allocation"
    )
  }
  ;("")
  const handleSelectedAllocates = (id, value) => {
    console.log(id)
    console.log(value)
    setpendingLeadTableData((prevLeads) =>
      prevLeads.map((lead) =>
        lead._id === id ? { ...lead, allocatedTo: value } : lead
      )
    )
  }

  console.log(pendingLeadtableData)
  const handleSubmit = async (leadAllocationData) => {
    setsubmitLoading(true)
    console.log(leadAllocationData)
    const response = await api.post(
      "/lead/leadAllocation?allocationpending=true",
      leadAllocationData
    )

    if (response.status >= 200 && response.status < 300) {
      setpendingLeadTableData(response.data.data)
      setsubmitLoading(false)
    }
  }
  return (
    <div>
      {submitLoading && (
        <BarLoader
          cssOverride={{ width: "100%", height: "4px" }} // Tailwind's `h-4` corresponds to `16px`
          color="#4A90E2" // Change color as needed
        />
      )}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4 ">
          <h2 className="text-lg font-bold">{status} Allocation List</h2>
          {/* <button
         onClick={toggleStatus}
         className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
       >
         Toggle Allocation
       </button> */}
          <button
            onClick={() =>
              user.role === "Admin"
                ? navigate("/admin/transaction/lead")
                : navigate("/staff/transaction/lead")
            }
            className="bg-black text-white px-2 rounded-lg shadow-lg"
          >
            Go Lead Register
          </button>
        </div>

        {/* Responsive Table Container */}
        <div className="overflow-x-auto rounded-lg text-center">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-blue-500 text-white text-sm">
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
            <tbody className="text-center divide-gray-200 bg-gray-200">
              {pendingLeadtableData && pendingLeadtableData.length > 0 ? (
                pendingLeadtableData.map((item) => (
                  <tr key={item.id} className="">
                    <td className="px-1 border border-gray-300">
                      {formatDate(item.leadDate)}
                    </td>
                    <td className="px-4  border border-gray-300">
                      {item?.leadId}
                    </td>
                    <td className="px-4  border border-gray-300">
                      {item?.customerName?.customerName}
                    </td>
                    <td className="px-4  border border-gray-300">
                      {item?.mobile}
                    </td>
                    <td className="px-4  border border-gray-300">
                      {item.phone}
                    </td>
                    <td className="px-4  border border-gray-300">
                      {item?.email}
                    </td>
                    <td className="px-4  border border-gray-300">
                      <button
                        // onClick={}
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
                          console.log(selectedOption)
                          setSelectedAllocates((prev) => ({
                            ...prev,
                            [item._id]: selectedOption
                          }))
                          handleSelectedAllocates(
                            item._id,
                            selectedOption.value
                          )
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
                        SUBMIT
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
  )
}

export default LeadAllocationTable
