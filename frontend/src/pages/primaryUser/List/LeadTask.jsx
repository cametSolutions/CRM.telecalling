import { useNavigate } from "react-router-dom"
import UseFetch from "../../../hooks/useFetch"
import MyDatePicker from "../../../components/common/MyDatePicker"
import BarLoader from "react-spinners/BarLoader"
import LeadTaskComponent from "../../../components/primaryUser/LeadTaskComponent"
import { useState, useEffect } from "react"
import { getLocalStorageItem } from "../../../helper/localstorage"
import { FaFileInvoiceDollar } from "react-icons/fa"
import { PropagateLoader } from "react-spinners"
const LeadTask = () => {
  const [loggedUser, setloggedUser] = useState(null)
  const [dates, setDates] = useState({ startDate: "", endDate: "" })
  const [type, settype] = useState("leadTask")
  const [filteredData, setFilteredData] = useState([])
  const [netTotalAmount, setnetTotalAmount] = useState(0)
  const [pending, setPending] = useState(true)
  const [ownTask, setownTask] = useState(true)
  const navigate = useNavigate()
  const [loggedUserBranches, setloggedUserBranches] = useState(null)
  const [selectedCompanyBranch, setselectedCompanyBranch] = useState(null)

  const { data: branches } = UseFetch("/branch/getBranch")
  useEffect(() => {
    const now = new Date()
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1) // 1st day of current month

    setDates({ startDate, endDate: now })
  }, [])
  useEffect(() => {
    if (branches) {
      const userData = getLocalStorageItem("user")
      const branch = userData?.selected?.map((branch) => {
        return {
          value: branch.branch_id,
          label: branch.branchName
        }
      })
      setloggedUserBranches(branch)
      setselectedCompanyBranch(branch[0].value)

      setloggedUser(userData)
    }
  }, [branches])

  const { data, error, loading, refreshHook } = UseFetch(
    loggedUser &&
      selectedCompanyBranch &&
      `/lead/getrespectedleadTask?userid=${loggedUser._id}&branchSelected=${selectedCompanyBranch}&role=${loggedUser.role}&ownTask=${ownTask}`
  )
  const formatdate = (date) => new Date(date).toISOString().split("T")[0]
  const getLocalDate = (date) => {
    const local = new Date(date)
    local.setMinutes(date.getMinutes() - date.getTimezoneOffset())
    return local.toISOString().split("T")[0] // e.g., "2025-06-12"
  }
  useEffect(() => {
    if (data && pending && loggedUser && dates && dates.endDate) {
      console.log(data)
      const a = data.filter((item) => item.leadId === "00096")
      console.log(a)
      const finalOutput = []
      data.forEach((entry) => {
        const activitylog = entry.activityLog

        activitylog.forEach((log) => {
          if (
            log.taskClosed === false &&
            log?.taskallocatedTo &&
            log.taskTo &&
            log.taskTo !== "followup"
          ) {
            finalOutput.push({
              leadId: entry.leadId,
              leadDocId: entry._id,
              allocatedTo: entry?.allocatedTo?._id,
              leadDate: entry.leadDate,
              customerName:
                entry?.customerName?.customerName || entry?.customerName,
              leadBy: entry?.leadBy,
              dueDate: entry?.dueDate,
              leadFor: entry?.leadFor,
              netAmount: entry?.netAmount,
              mobile: entry?.mobile,
              email: entry?.email,
              taskTo: log?.taskTo,
              taskBy: log?.taskBy,
              remarks: log.remarks,
              closedDate: log?.submissionDate,
              matchedlog: log,
              activityLog: activitylog,
              taskallocatedTo: entry.taskallocatedTo,
              taskallocatedBy: entry.taskallocatedBy,
              sameUser: loggedUser?._id === entry.taskallocatedTo?._id
            })
          }
        })
      })
      const totalNetAmount = finalOutput
        .reduce((total, lead) => {
          const leadTotal =
            lead.leadFor?.reduce(
              (sum, item) => sum + (item?.netAmount || 0),
              0
            ) || 0
          return total + leadTotal
        }, 0)
        .toFixed(2)
      setnetTotalAmount(totalNetAmount)
      let Data
      if (ownTask) {
        Data = normalizeTableData(finalOutput)
      } else {
        console.log(finalOutput)
        const groupedLeads = {}
        let grandTotal = 0
        finalOutput.forEach((lead) => {
          const assignedTo = lead?.taskallocatedTo?.name
          const amount = lead?.netAmount || 0
          grandTotal += amount
          if (!groupedLeads[assignedTo]) {
            groupedLeads[assignedTo] = []
          }
          groupedLeads[assignedTo].push(lead)
        })
        Data = normalizeTableData(groupedLeads)
      }

      console.log(finalOutput)
      console.log(Data)
      setFilteredData(Data)
    } else if (data && !pending) {
      console.log(data)
      console.log("h")
      const finalOutput = []
      // data.forEach((entry) => {
      //   const activitylog = entry.activityLog

      //   activitylog.some((log) => {
      //     if (
      //       log.taskClosed &&
      //       log?.taskallocatedTo &&
      //       log.taskTo !== "followup"
      //     ) {
      //       finalOutput.push({
      //         leadId: entry.leadId,
      //         leadDocId: entry._id,
      //         leadDate: entry.leadDate,
      //         customerName:
      //           entry?.customerName?.customerName || entry?.customerName,
      //         leadBy: entry?.leadBy,
      //         leadFor: entry?.leadFor,
      //         netAmount: entry?.netAmount,
      //         mobile: entry?.mobile,
      //         email: entry?.email,
      //         // taskTo: log?.taskTo,
      //         // taskBy: log?.taskBy,
      //         // remarks: log.remarks,
      //         // closedDate: log?.submissionDate,
      //         // matchedlog: log,
      //         activityLog: activitylog,
      //         taskallocatedTo: entry?.taskallocatedTo,
      //         taskallocatedBy: entry?.taskallocatedBy,
      //         sameUser: loggedUser?._id === entry.taskallocatedTo?._id
      //       })
      //     }
      //   })
      // })
      data.forEach((entry) => {
        const activitylog = entry.activityLog

        const matchedLog = activitylog.find(
          (log) =>
            log.taskClosed && log?.taskallocatedTo && log.taskTo !== "followup"
        )

        if (matchedLog) {
          finalOutput.push({
            leadId: entry.leadId,
            leadDocId: entry._id,
            leadDate: entry.leadDate,
            customerName:
              entry?.customerName?.customerName || entry?.customerName,
            leadBy: entry?.leadBy,
            leadFor: entry?.leadFor,
            netAmount: entry?.netAmount,
            mobile: entry?.mobile,
            email: entry?.email,
            activityLog: activitylog,
            taskallocatedTo: entry?.taskallocatedTo,
            taskallocatedBy: entry?.taskallocatedBy,
            sameUser: loggedUser?._id === entry.taskallocatedTo?._id
          })
        }
      })

      console.log(finalOutput)
      // const filteredOutput = finalOutput.sort(
      //   (a, b) =>
      //     new Date(b.matchedlog.taskSubmissionDate) -
      //     new Date(a.matchedlog.taskSubmissionDate)
      // )
      // console.log(filteredOutput)
      const totalNetAmount = data
        .reduce((total, lead) => {
          const leadTotal =
            lead.leadFor?.reduce(
              (sum, item) => sum + (item?.netAmount || 0),
              0
            ) || 0
          return total + leadTotal
        }, 0)
        .toFixed(2)

      // then store it in state
      setnetTotalAmount(totalNetAmount)
      let Data
      if (ownTask) {
        Data = normalizeTableData(finalOutput)
      } else {
        console.log(finalOutput)
        const groupedLeads = {}
        let grandTotal = 0
        finalOutput.forEach((lead) => {
          const assignedTo = lead?.taskallocatedTo?.name
          const amount = lead?.netAmount || 0
          grandTotal += amount
          if (!groupedLeads[assignedTo]) {
            groupedLeads[assignedTo] = []
          }
          groupedLeads[assignedTo].push(lead)
        })
        Data = normalizeTableData(groupedLeads)
      }

      setFilteredData(Data)
    }
  }, [data, pending, dates])
  console.log(filteredData)
  const normalizeTableData = (data) => {
    if (Array.isArray(data)) {
      return [{ staffName: null, leads: data }]
    } else if (typeof data === "object" && data !== null) {
      return Object.entries(data).map(([staffName, leads]) => ({
        staffName,
        leads
      }))
    }
    return []
  }
  console.log(type)
  return (
    <div className="h-full flex flex-col ">
      {loading && (
        <BarLoader
          cssOverride={{ width: "100%", height: "4px" }} // Tailwind's `h-4` corresponds to `16px`
          color="#4A90E2" // Change color as needed
        />
      )}
      <div className="flex flex-col md:flex-row  items-start md:items-center mx-3 md:mx-5 mt-3 mb-3 gap-4">
        {/* Title */}
        <h2 className="text-lg font-bold">
          {`Task ${pending ? "Pending" : "Cleared"}`}
        </h2>

        {/* Right Section */}
        <div className="flex flex-wrap gap-3 flex-grow justify-start md:justify-end md:gap-6 items-center w-full md:w-auto">
          {dates.startDate && (
            <MyDatePicker setDates={setDates} dates={dates} />
          )}
          {/* Message Icon with Badge and Popup */}
          <div className="flex flex-grow md:flex-grow-0 items-center justify-end gap-2">
            <span className="text-sm whitespace-nowrap font-semibold">
              {pending ? "Pending" : "Cleared"}
            </span>
            <button
              onClick={() => setPending(!pending)}
              className={`${
                pending ? "bg-green-500" : "bg-gray-300"
              } w-11 h-6 flex items-center rounded-full transition-colors duration-300`}
            >
              <div
                className={`${
                  pending ? "translate-x-5" : "translate-x-0"
                } w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300`}
              ></div>
            </button>
            {loggedUser?.role !== "Staff" && (
              <>
                <span className="text-sm whitespace-nowrap font-semibold">
                  {ownTask ? "Own Task" : "All Task"}
                </span>
                <button
                  onClick={() => setownTask(!ownTask)}
                  className={`${
                    ownTask ? "bg-green-500" : "bg-gray-300"
                  } w-11 h-6 flex items-center rounded-full transition-colors duration-300`}
                >
                  <div
                    className={`${
                      ownTask ? "translate-x-5" : "translate-x-0"
                    } w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300`}
                  ></div>
                </button>
              </>
            )}
          </div>
          {/* Branch Dropdown */}
          <select
            value={selectedCompanyBranch || ""}
            onChange={(e) => setselectedCompanyBranch(e.target.value)}
            className="border border-gray-300 py-1 rounded-md px-2 focus:outline-none min-w-[150px]"
          >
            {loggedUserBranches?.map((branch) => (
              <option key={branch.value} value={branch.value}>
                {branch.label}
              </option>
            ))}
          </select>

          {/* New Lead Button */}
          <div className="">
            <button
              onClick={() =>
                loggedUser.role === "Admin"
                  ? navigate("/admin/transaction/lead")
                  : navigate("/staff/transaction/lead")
              }
              className="bg-black text-white py-1 px-3 rounded-lg shadow-lg hover:bg-gray-600 max-w-[100px] md:w-full"
            >
              New Lead
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-end mr-5">
        <span className="text-blue-700">{`Total Amount - ${netTotalAmount}`}</span>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <PropagateLoader color="#3b82f6" size={12} />
          <p className="text-gray-500 text-sm font-medium">Loading tasks...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      ) : data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
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
          </div>
          <h3 className="text-gray-700 font-semibold text-lg">
            No Tasks Available
          </h3>
        </div>
      ) : filteredData?.length > 0 ? (
        <LeadTaskComponent
          type={type}
          Data={filteredData}
          loggedUser={loggedUser}
          refresh={refreshHook}
          pending={pending}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <p className="text-sm"></p>
        </div>
      )}
    </div>
  )
}
export default LeadTask
