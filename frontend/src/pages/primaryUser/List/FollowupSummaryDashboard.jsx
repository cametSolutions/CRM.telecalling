// FollowupSummaryDashboard.jsx
import { useState, useEffect } from "react"
import ReportTable from "../../../components/primaryUser/ReportTable"
import UseFetch from "../../../hooks/useFetch"
import { getLocalStorageItem } from "../../../helper/localstorage"
import { useNavigate } from "react-router-dom"

export default function FollowupSummaryDashboard() {
  const navigate = useNavigate()

  const [date, setdate] = useState({
    startDate: "",
    endDate: ""
  })
  const [data, setData] = useState([])
  const [selectedBranch, setselectedBranch] = useState(null)
  const [userbranches, setuserBranches] = useState([])

  const { data: followup } = UseFetch(
    date.startDate &&
      date.endDate &&
      selectedBranch &&
      `/lead/getfollowupsummaryReport?startDate=${date.startDate}&endDate=${date.endDate}&branchId=${selectedBranch}`
  )
  console.log(followup)
  // set end of current month once
  useEffect(() => {
    const now = new Date()
    const startDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    ).toLocaleDateString("en-CA")
    const endDate = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).toLocaleDateString("en-CA")
    setdate((prev) => ({ startDate, endDate }))
  }, [])

  // branches
  useEffect(() => {
    const userData = getLocalStorageItem("user")
    if (!userData?.selected?.length) return

    setselectedBranch(userData.selected[0]?.branch_id)
    const branches = userData.selected.map((branch) => ({
      id: branch.branch_id,
      branchName: branch.branchName
    }))
    setuserBranches(branches)
  }, [])

  // followup data
  useEffect(() => {
    if (followup) {
      console.log(followup)
      const filteredbranchwisedata = followup.filter((item) =>
        item.branchIds.includes(selectedBranch)
      )
      console.log(filteredbranchwisedata)

      setData(filteredbranchwisedata)
    }
  }, [followup])
  console.log(data)
  const headersName = [
    "Staff",
    "Total Leads",
    "Due Today",
    "Overdue",
    "Future",
    "Never Follow Up",
    "Converted",
    "Lost",
    "Conversion %"
  ]

  const handleStartChange = (value) => {
    setdate((prev) => ({ ...prev, startDate: value }))
  }

  const handleEndChange = (value) => {
    setdate((prev) => ({ ...prev, endDate: value }))
  }
  console.log("hhhh")
  // navigation logic for metric cells
  const handleMetricClick = (row, header, key) => {
    // row has: staffName, leadCount, dueToday, overDue, future, converted, lost, leadid[]
    const staffName = row.staffName
    console.log("hh")
    if (header === "Lost") {
      navigate("/lostleads", {
        state: {
          staffName,
          branchId: selectedBranch,
          startDate: date.startDate,
          endDate: date.endDate,
          count: row[key],
          leadIds: row.leadid
        }
      })
      return
    } else {
      console.log("hhhh")
      // all others go to followup page
      navigate("/leadfollowup", {
        state: {
          staffName,
          branchId: selectedBranch,
          startDate: date.startDate,
          endDate: date.endDate,
          type: header, // "Total Leads", "Due Today", etc.
          count: row[key],
          leadIds: row.leadid
        }
      })
    }
  }

  const handleFollowupCellClick = ({ row, header }) => {
    console.log(header)
    console.log(row)
    if (header === "Staff") return
    if (header === "Conversion %") return

    if (header === "Lost") {
      console.log("jjj")
      navigate("/admin/transaction/lead/lostLeads", {
        state: {
          staffId: row.staffId,
          productId: row.productId,
          branchId: row?.branchIds?.[0],
          viewMode: "lostlead"
        }
      })
    } else if (header === "Lead Count") {
      navigate("/admin/transaction/lead/allLeads", {
        state: { staffId: row.staffId }
      })
    } else if (header === "Due Today") {
      navigate("/admin/transaction/lead/leadFollowUp", {
        state: {
          staffId: row.staffId,
          dueToday: true,
          branchId: row.branchIds?.[0],
          viewMode: "dueToday",
          from: "followupReport",
          istotal: true,
          filterRange: date
        }
      })
      console.log("hhhhh")
    } else if (header === "Overdue") {
      console.log("hhh")
      navigate("/admin/transaction/lead/leadFollowUp", {
        state: {
          staffId: row.staffId,
          overdue: true,
          branchId: row.branchIds?.[0],
          viewMode: "overDue",
          from: "followupReport",
          istotal: true,
          filterRange: date
        }
      })
    } else if (header === "Future") {
      console.log("hhh")
      navigate("/admin/transaction/lead/leadFollowUp", {
        state: {
          staffId: row.staffId,
          future: true,
          branchId: row.branchIds?.[0],
          viewMode: "future",
          from: "followupReport",
          istotal: true,
          filterRange: date
        }
      })
    } else if (header === "Converted") {
      console.log("hhhhh")
      navigate("/admin/transaction/lead/leadFollowUp", {
        state: {
          staffId: row.staffId,
          converted: true,
          branchId: row.branchIds?.[0],
          viewMode: "converted",
          from: "followupReport",
          istotal: true,
          filterRange: date
        }
      })
    } else if (header === "Never Follow Up") {
      console.log("hhhhhh")
      console.log("hhhhh")
      navigate("/admin/transaction/lead/leadFollowUp", {
        state: {
          staffId: row.staffId,
          neverfollowup: true,
          branchId: row.branchIds?.[0],
          viewMode: "neverfollowup",
          from: "followupReport",
          istotal: true,
          filterRange: date
        }
      })
    } else if (header === "Total Leads") {
      // navigate("/admin/transaction/lead/leadFollowUp", {
      //   state: { staffId: row.staffId ,branchId:row.branchIds?.[0],istotal:true}
      // })
      console.log(date)
      console.log("hhhh")
      navigate("/admin/transaction/lead/leadFollowUp", {
        state: {
          staffId: row.staffId,
          filterRange: date,
          from: "followupReport",
          viewMode: "followup",
          istotal: true,
          header: "Total Leads",
          branchId: row.branchIds?.[0]
        }
      })
      console.log("hhh")
    }
  }

  const handleStaffClick = (row) => {
    // you can later use this for staff drill-down if needed
    // example:
    // navigate("/staff-followup-summary", { state: { staffName: row.staffName, ... } });
  }

  return (
    <div className="h-full bg-[#ADD8E6] flex flex-col">
      {/* Top bar */}
      <div className="px-4 md:px-6 py-3 bg-blue-50 border-b border-blue-100">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Title */}
          <h1 className="text-lg md:text-xl font-bold text-gray-900">
            Follow‑Up Summary Report
          </h1>

          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            {/* Branch select */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Branch
              </label>

              <div className="relative inline-flex items-center">
                <select
                  value={selectedBranch || ""}
                  onChange={(e) => setselectedBranch(e.target.value)}
                  className="h-9 min-w-[180px] rounded-md border border-slate-200 bg-white pr-9 pl-3 text-xs font-medium text-slate-800 shadow-sm
                 outline-none transition-colors duration-150
                 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
                 hover:border-slate-300 cursor-pointer appearance-none"
                >
                  {userbranches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.branchName}
                    </option>
                  ))}
                </select>

                <span className="pointer-events-none absolute right-2.5 text-slate-400">
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="1.8"
                    stroke="currentColor"
                  >
                    <path
                      d="M7 10l5 5 5-5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </div>

            {/* Date range */}
            <div className="inline-flex items-center gap-3 rounded-xl bg-white px-3 py-2 shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 pr-3 border-r border-slate-200">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-slate-500">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="1.7"
                    stroke="currentColor"
                  >
                    <rect x="3" y="4" width="18" height="17" rx="2" />
                    <path d="M8 3v3M16 3v3M3 10h18" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Date Range
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Filter reports by period
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-medium text-slate-500">
                  From
                </span>
                <input
                  type="date"
                  value={date.startDate}
                  onChange={(e) => handleStartChange(e.target.value)}
                  className="h-8 rounded-md border border-slate-200 bg-slate-50 px-2 text-xs text-slate-800
                 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-medium text-slate-500">
                  To
                </span>
                <input
                  type="date"
                  value={date.endDate}
                  onChange={(e) => handleEndChange(e.target.value)}
                  className="h-8 rounded-md border border-slate-200 bg-slate-50 px-2 text-xs text-slate-800
                 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table wrapper */}
      <div className="flex-1 overflow-hidden mb-3 mx-3">
        <ReportTable
          headers={headersName}
          reportName="Follow-Up Summary"
          data={data}
          onStaffClick={handleStaffClick}
          onMetricClick={handleMetricClick}
          onCellClick={handleFollowupCellClick}
        />
      </div>
    </div>
  )
}
