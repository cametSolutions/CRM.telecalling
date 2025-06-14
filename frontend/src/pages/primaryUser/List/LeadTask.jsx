import { useLocation, useNavigate } from "react-router-dom"
import UseFetch from "../../../hooks/useFetch"
import MyDatePicker from "../../../components/common/MyDatePicker"
import BarLoader from "react-spinners/BarLoader"
import LeadTaskComponent from "../../../components/primaryUser/LeadTaskComponent"
import { useState, useEffect, startTransition } from "react"
const LeadTask = () => {
  const location = useLocation()
  const pagePath = location.pathname
  const [loggedUser, setloggedUser] = useState(null)
  const [dates, setDates] = useState({ startDate: "", endDate: "" })
  const [filteredData, setFilteredData] = useState([])
  const [ownFollowUp, setOwnFollowUp] = useState(null)
  const [url, setUrl] = useState("")
  const [pending, setPending] = useState(true)
  const navigate = useNavigate()
  const [loggedUserBranches, setloggedUserBranches] = useState(null)
  const [selectedCompanyBranch, setselectedCompanyBranch] = useState(null)

  const { data: branches } = UseFetch("/branch/getBranch")
  useEffect(() => {
    if (!pending) {
      const now = new Date()

      const startDate = new Date(now.getFullYear(), now.getMonth(), 1) // 1st day of current month
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0) // 0th day of next month = last day of current

      setDates({ startDate, endDate })
    }
  }, [pending])
  useEffect(() => {
    if (branches) {
      const userData = localStorage.getItem("user")
      const user = JSON.parse(userData)
      if (user.role === "Admin") {
        const branch = branches.map((branch) => {
          return {
            value: branch._id,
            label: branch.branchName
          }
        })
        setloggedUserBranches(branch)
        setselectedCompanyBranch(branch[0].value)
      } else {
        const branches = user.selected.map((branch) => {
          return {
            value: branch.branch_id,
            label: branch.branchName
          }
        })
        setselectedCompanyBranch(branches[0].value)
        setloggedUserBranches(branches)
      }

      setloggedUser(user)
    }
  }, [branches])

  const type = pagePath.includes("leadFollowUp")
    ? "followup"
    : pagePath.includes("leadTask")
    ? "lead-Task"
    : ""
  useEffect(() => {
    if (loggedUser && selectedCompanyBranch) {
      let url
      if (type === "followup") {
        url = `/lead/getallLeadFollowUp?branchSelected=${selectedCompanyBranch}&loggeduserid=${loggedUser._id}&role=${loggedUser.role}`
        setUrl(url)
      } else if (type === "lead-Task") {
        url = `/lead/getrespectedleadprogramming?userid=${loggedUser._id}&branchSelected=${selectedCompanyBranch}&role=${loggedUser.role}`
        setUrl(url)
      }
    }
  }, [selectedCompanyBranch, loggedUser, type])
  const { data, loading, refreshHook } = UseFetch(url)

  useEffect(() => {
    if (data && pending && loggedUser) {
      if (type === "followup") {
        const filteredpendingFollowup = data.followupLeads.filter(
          (item) => item.leadFollowupClosed === false
        )
        if (data.ischekCollegueLeads) {
          setOwnFollowUp(true)
          const filteredownfolowup = filteredpendingFollowup.filter(
            (item) => item.allocatedBy === loggedUser._id
          )
          setFilteredData(filteredownfolowup)
        } else {
          setFilteredData(filteredpendingFollowup)
        }
      } else if (type === "lead-Task") {
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
                leadFor: entry?.leadFor,
                netAmount: entry?.netAmount,
                mobile: entry?.mobile,
                email: entry?.email,
                taskTo: log?.taskTo,
                taskBy: log?.taskBy,
                remarks: log.remarks,
                closedDate: log?.submissionDate,
                matchedlog: log,
                activityLog: activitylog
              })
            }
          })
        })
        setFilteredData(finalOutput)
      }
    } else if (data && !pending) {
      if (type === "followup") {
        const filteredClosedFollowup = data.followupLeads.filter(
          (item) => item.leadFollowupClosed === true
        )
        if (data.ischekCollegueLeads) {
          setOwnFollowUp(true)
          const filteredownfolowup = filteredClosedFollowup.filter(
            (item) => item.allocatedBy === loggedUser._id
          )
          setFilteredData(filteredownfolowup)
        } else {
          setFilteredData(filteredClosedFollowup)
        }
      } else if (type === "lead-Task") {
        const finalOutput = []
        data.forEach((entry) => {
          const activitylog = entry.activityLog

          activitylog.forEach((log) => {
            if (log.taskClosed && log?.taskallocatedTo) {
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
                taskTo: log?.taskTo,
                taskBy: log?.taskBy,
                remarks: log.remarks,
                closedDate: log?.submissionDate,
                matchedlog: log,
                activityLog: activitylog
              })
            }
          })
        })

        const filteredOutput = finalOutput.filter((item) => {
          const submissionDate = new Date(item.matchedlog?.taskSubmissionDate)
          return (
            submissionDate >= dates.startDate && submissionDate <= dates.endDate
          )
        })
        setFilteredData(filteredOutput)
      }
    }
  }, [data, pending, dates])

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
          {`${
            type === "followup"
              ? "Lead FollowUp"
              : type === "lead-Task"
              ? "Task"
              : ""
          } ${pending ? "Pending" : "Cleared"}`}

          {/* {`type === "followup"
            ? "Lead FollowUp"
            : type === "lead-Task"
            ? "Task"
          
            : "" ${pending?"Pending":"Cleared"}`} */}
        </h2>

        {/* Right Section */}
        {/* <div className="grid grid-cols-2 md:flex md:flex-row md:gap-6 gap-3 items-start md:items-center w-full md:w-auto"> */}
        <div className="flex flex-wrap gap-3 flex-grow justify-start md:justify-end md:gap-6 items-center w-full md:w-auto">
          {dates.startDate && (
            <MyDatePicker setDates={setDates} dates={dates} />
          )}
          {/* Message Icon with Badge and Popup */}
          <div className="flex flex-grow md:flex-grow-0 items-center justify-end gap-2">
            <span className="text-sm whitespace-nowrap">
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

          {/* Toggle Switch */}
          {type === "followup" && ownFollowUp && (
            <div className="flex items-center gap-2">
              <span className="text-sm whitespace-nowrap">
                {ownFollowUp ? "Own FollowUp" : "Colleague FollowUp"}
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
          )}

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
      <LeadTaskComponent
        type={type}
        Data={filteredData}
        loading={loading}
        loggedUser={loggedUser}
        refresh={refreshHook}
        pending={pending}
      />
    </div>
  )
}
export default LeadTask
