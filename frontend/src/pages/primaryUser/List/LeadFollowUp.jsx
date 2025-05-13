import { useState, useEffect } from "react"
import { PropagateLoader } from "react-spinners"
import { MdOutlineEventAvailable } from "react-icons/md"
import { useNavigate } from "react-router-dom"
import BarLoader from "react-spinners/BarLoader"
import { FaSpinner } from "react-icons/fa"
import { FaHistory } from "react-icons/fa"
import api from "../../../api/api"
import { toast } from "react-toastify"
import UseFetch from "../../../hooks/useFetch"
import { formatDate } from "../../../utils/dateUtils"
const LeadFollowUp = () => {
  const [selectedLeadId, setSelectedLeadId] = useState(null)
  const [historyList, setHistoryList] = useState([])
  const [loggedUser, setloggedUser] = useState(null)
  const [loggedUserBranches, setloggedUserBranches] = useState(null)
  const [followupDateLoader, setfollowupDateLoader] = useState(false)
  const [input, setInput] = useState("")
  const [showFullRemarks, setShowFullRemarks] = useState("")
  const [errors, setErrors] = useState({})
  const [historyModal, setHistoryModal] = useState(false)
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
  const { data: loggedusersallocatedleads, loading } = UseFetch(
    loggedUser &&
      loggedUserBranches &&
      `/lead/getallLeadFollowUp?branchSelected=${encodeURIComponent(
        JSON.stringify(loggedUserBranches)
      )}&loggeduserId=${loggedUser._id}`
  )
  const navigate = useNavigate()
  useEffect(() => {
    console.log(branches)
    if (branches) {
      const userData = localStorage.getItem("user")
      const user = JSON.parse(userData)
      if (user.role === "Admin") {
        const branches = branches.map((branch) => branch._id)
        setloggedUserBranches(branches)
      } else {
        const branches = user.selected.map((branch) => branch.branch_id)
        setloggedUserBranches(branches)
      }

      setloggedUser(user)
    }
  }, [branches])

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
  useEffect(() => {
    if (loggedusersallocatedleads && loggedUser) {
      setTableData(loggedusersallocatedleads)
      // if (loggedUser?.role === "Admin") {
      //   setTableData(loggedusersallocatedleads)
      // } else {
      //   const filteredLeads = loggedusersallocatedleads.filter(
      //     (item) => item?.allocatedTo?._id === user._id
      //   )
      //   setTableData(filteredLeads)
      // }
    }
  }, [loggedusersallocatedleads])

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
  const handleHistory = (history, id) => {
    setHistoryModal(!historyModal)
    setHistoryList(history)
    setSelectedLeadId(id)
  }
const handlefollowupdate=()=>{
 setfollowupDateModal(!followupDateModal)
                            setSelectedLeadId(item?._id)}

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
              {/* <button
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
              </button> */}
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
                  <th className="px-1 py-2 text-center">Select Date</th>
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
                        {formatDate(item.leadDate)}
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
                      <td className="px-4  border border-gray-300">
                        <button
                          onClick={handlefollowupdate}
                          className=" px-4 "
                        >
                          <MdOutlineEventAvailable className="text-green-600 text-xl" />
                        </button>
                      </td>
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
                        type="date"
                        name="followUpDate"
                        value={formData?.followUpDate || ""}
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
                        className="rounded-lg w-full border border-gray-200 focus:outline-none"
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeadFollowUp
