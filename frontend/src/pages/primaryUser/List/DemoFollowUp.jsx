import { useState, useEffect, useRef } from "react"
import React from "react"
import { FiMessageCircle } from "react-icons/fi"
import { FaSpinner } from "react-icons/fa"
import { PropagateLoader } from "react-spinners"
import { useNavigate } from "react-router-dom"
import BarLoader from "react-spinners/BarLoader"
import api from "../../../api/api"
import { toast } from "react-toastify"
import UseFetch from "../../../hooks/useFetch"
const DemoFollowUp = () => {
  const [loggeduserBranch, setloggedUserBranch] = useState([])
  const [loader, setLoader] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const containerRef = useRef(null)
  const [selectedCompanyBranch, setselectedCompanyBranch] = useState("")
  const [ownFollowUp, setOwnFollowUp] = useState(true)
  const [loggedUser, setloggedUser] = useState(null)
  const [loggedUserBranches, setloggedUserBranches] = useState(null)
  const [input, setInput] = useState("")
  const [errors, setErrors] = useState({})
  const [demosubmitError, setDemofollowersubmitError] = useState({})
  const [debouncedValue, setDebouncedValue] = useState("")
  const [showFullName, setShowFullName] = useState(false)
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

  const {
    data: demolead,
    loading,
    refreshHook
  } = UseFetch(
    loggedUser &&
      selectedCompanyBranch &&
      `/lead/getrespecteddemolead?userid=${loggedUser._id}&selectedBranch=${selectedCompanyBranch}`
  )
  const { data: branches } = UseFetch("/branch/getBranch")

  useEffect(() => {
    if (branches && loggedUser) {
      if (loggedUser.role === "Admin") {
        const isselectedArray = loggedUser?.selected
        if (isselectedArray) {
          const loggeduserbranches = loggedUser.selected.map((item) => {
            return {
              value: item.branch_id,
              label: item.branchName
            }
          })
          setloggedUserBranch(loggeduserbranches)
          setselectedCompanyBranch(loggeduserbranches[0].value)
        } else {
          const loggeduserbranches = branches.map((item) => {
            return { value: item.branch_id, label: item.branchName }
          })
          setloggedUserBranch(loggeduserbranches)
          setselectedCompanyBranch(loggeduserbranches[0].value)
        }
      } else {
        const loggeduserbranches = loggedUser.selected.map((item) => {
          return { value: item.branch_id, label: item.branchName }
        })
        setloggedUserBranch(loggeduserbranches)
        setselectedCompanyBranch(loggeduserbranches[0].value)
      }
    }
  }, [branches, loggedUser])

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
  useEffect(() => {
    if (ownFollowUp) {
console.log("h")
      refreshHook()
    } else {
console.log("h")
      setTableData([])
    }
  }, [ownFollowUp])
  console.log(tableData)

  useEffect(() => {
    if (demolead && demolead.length > 0) {
      setDemodetails((prev) => ({
        ...prev,
        matchedindex: demolead[0].matchedDemoIndex,
        leadId: demolead[0].leadId,
        leadDocId: demolead[0]._id,
        demoAssignedBy: demolead[0].demoallocatedByDetails.name,
        demoAssignedDate: demolead[0].matchedDemoFollowUp.demoallocatedDate
          .toString()
          .split("T")[0],
        demoAssignedDescription:
          demolead[0].matchedDemoFollowUp.demoDescription,
        followerDescription:
          demolead[0].matchedDemoFollowUp?.demofollowerDescription || "",
        followUpDate: demolead[0].matchedDemoFollowUp?.demofollowerDate || ""
      }))
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

  const handleDemofollowup = async () => {
    try {
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
        return
      }
      setLoader(true)

      const response = await api.post("/lead/demosubmitbyfollower", demoDetails)
      if (response.status === 201) {
        toast.success(response.data.message)
        setMessage("Submitted successfully")
      } else if (response.status === 304) {
        setMessage("not submitted")
        toast.error(response.data.message)
      }
      setLoader(false)
      refreshHook()
    } catch (error) {
      setLoader(false)
      setMessage("not submitted")
      console.log(error)
    }
  }

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
              {ownFollowUp ? "Own Demo" : "Colleague Demo"}
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
                    <td className="borrder border-b-0 border-gray-400 px-4 "></td>
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
                        onClick={() => {
                          const currentDate = new Date()

                          setDemodetails((prev) => ({
                            ...prev,
                            followerDate: currentDate
                          }))
                          setIsOpen(true)
                        }}
                      >
                        Submit
                      </button>
                    </td>
                    <td className=" border border-t-0 border-b-0 border-gray-400 px-4 ">
                      {item.netAmount}
                    </td>
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

        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-40 ">
            <div className=" bg-white shadow-lg border rounded-md w-full md:w-96 ">
              {loader && (
                <BarLoader
                  cssOverride={{ width: "100%", height: "4px" }} // Tailwind's `h-4` corresponds to `16px`
                  color="#4A90E2" // Change color as needed
                />
              )}
              <h1 className="md:text-2xl font-semibold">Task Form</h1>
              <div className="p-3 md:p-5 md:pt-0 ">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 shadow-xl border border-gray-200 p-3 rounded-lg">
                  <div>
                    <label className="block text-sm mb-1 text-gray-700 font-semibold text-left">
                      Demo Assigned By
                    </label>
                    <input
                      type="text"
                      value={demoDetails?.demoAssignedBy || ""}
                      className="w-full border border-gray-300 px-2 py-1 rounded  text-sm cursor-not-allowed bg-gray-200"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-700 font-semibold text-left">
                      Demo Assigned Date
                    </label>
                    <input
                      type="date"
                      value={demoDetails?.demoAssignedDate || ""}
                      readOnly
                      className="w-full border border-gray-300 px-2 py-1 rounded text-sm cursor-not-allowed bg-gray-200"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-1 text-gray-700 font-semibold text-left">
                      Description By Assigner
                    </label>
                    <textarea
                      readOnly
                      value={demoDetails?.demoAssignedDescription || ""}
                      rows={2}
                      className="w-full border border-gray-300 px-2 py-1 rounded text-sm focus:outline-none cursor-not-allowed bg-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-700 font-semibold text-left">
                      Follow-up Date
                    </label>
                    <input
                      type="text"
                      value={
                        demoDetails?.followerDate
                          .toLocaleDateString("en-GB")
                          .split("/")
                          .join("-") || ""
                      }
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
                      className="w-full border border-gray-300 px-2 py-1 rounded  text-sm"
                    />
                    {demosubmitError.dateerror && (
                      <p className="text-red-500 text-left text-sm ">
                        {demosubmitError.dateerror}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-1 text-gray-700 font-semibold text-left">
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
                      className="w-full border border-gray-300 px-2 py-1 rounded text-sm focus:outline-none"
                      placeholder="Enter description..."
                    />
                    {demosubmitError.descriptionerror && (
                      <p className="text-red-500 text-left text-sm ">
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
                <div className="flex justify-center gap-3 mt-2">
                  <button
                    onClick={handleDemofollowup}
                    className="  bg-blue-600 text-white py-2  px-3 rounded text-sm hover:bg-blue-700 flex justify-center items-center focus:outline-none"
                  >
                    {loader ? (
                      <FaSpinner className="animate-spin h-5 w-5  text-white " />
                    ) : demoDetails?.followerDescription ? (
                      "UPDATE"
                    ) : (
                      "SUBMIT"
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      setDemofollowersubmitError({})
                      setMessage("")
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 rounded-sm"
                  >
                    CLOSE
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

export default DemoFollowUp
