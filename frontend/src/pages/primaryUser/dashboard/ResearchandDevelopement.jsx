import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  ClipboardList,
  Clock3,
  FolderKanban,
  LoaderCircle,
  Play,
  Pencil,
  Save,
  Square,
  UserRoundCheck,
  X
} from "lucide-react"
import api from "../../../api/api"
import { toast } from "react-toastify"

const workStatuses = [
  { label: "New", count: 8, icon: ClipboardList, accent: "blue" },
  { label: "In Progress", count: 12, icon: LoaderCircle, accent: "violet" },
  { label: "Pending", count: 5, icon: Clock3, accent: "amber" },
  { label: "Overdue", count: 3, icon: CircleAlert, accent: "rose" },
  { label: "Completed", count: 6, icon: CheckCircle2, accent: "emerald" }
]

const accentStyles = {
  blue: "bg-blue-50 text-blue-600 ring-blue-100",
  violet: "bg-violet-50 text-violet-600 ring-violet-100",
  amber: "bg-amber-50 text-amber-600 ring-amber-100",
  rose: "bg-rose-50 text-rose-600 ring-rose-100",
  emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100"
}

const priorityStyles = {
  High: "bg-rose-50 text-rose-600",
  Medium: "bg-amber-50 text-amber-600",
  Low: "bg-emerald-50 text-emerald-600"
}

const statusStyles = {
  New: "bg-blue-50 text-blue-600",
  "In Progress": "bg-violet-50 text-violet-600",
  Pending: "bg-amber-50 text-amber-600",
  Hold: "bg-orange-50 text-orange-600",
  Completed: "bg-emerald-50 text-emerald-600"
}

const getToday = () => new Date().toISOString().slice(0, 10)
const getCurrentTime = () => new Date().toTimeString().slice(0, 5)
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const formatWorkDate = (value) => {
  if (!value) return "-"
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      })
}

const toDateInputValue = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return getToday()

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const formatDate = (value) => value ? new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value)) : "-"

const getWorkedDuration = (sessions = [], activeStartedAt) => {
  const now = Date.now()
  const total = sessions.reduce((sum, session) => {
    const startedAt = new Date(session.startedAt).getTime()
    const endedAt = session.endedAt ? new Date(session.endedAt).getTime() : now
    return sum + (Number.isNaN(startedAt) ? 0 : Math.max(0, endedAt - startedAt))
  }, 0) || (activeStartedAt ? Math.max(0, now - new Date(activeStartedAt).getTime()) : 0)
  const minutes = Math.floor(total / 60000)
  return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, "0")}m`
}

const getRemainingDays = (status, expectedCompletionDate) => {
  if (status !== "In Progress" || !expectedCompletionDate) return "-"
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const completion = new Date(expectedCompletionDate)
  completion.setHours(0, 0, 0, 0)
  const days = Math.ceil((completion - today) / 86400000)
  if (days < 0) return `${Math.abs(days)}d overdue`
  return days === 0 ? "Due today" : `${days}d left`
}

const isOverdue = (item) => {
  if (item.status !== "In Progress" || !item.expectedCompletionDate) return false
  const expectedDate = new Date(item.expectedCompletionDate)
  expectedDate.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return expectedDate < today
}

const getCompletedAt = (item) => item.taskCompletedAt || [...(item.taskTimeline || [])]
  .reverse()
  .find((event) => event.event === "Development Completed")?.at

const toWorkItem = (lead) => ({
  id: lead.leadId,
  leadDocId: lead.leadDocId,
  customer: lead.customerName || "-",
  work:
    lead.products
      ?.map((product) => product.shortName || product.productName)
      .filter(Boolean)
      .join(", ") || "Coding & QC",
  taskTitle: lead.taskTitle || "",
  allocationDescription: lead.allocationDescription || "",
  priority: "Medium",
  due: formatWorkDate(lead.followupClosedDate),
  followupClosedDate: toDateInputValue(lead.followupClosedDate),
  status: lead.assignedDeveloper ? lead.taskStatus || "Pending" : "New",
  progress: 0,
  assignedDeveloper: lead.assignedDeveloper || "",
  allocatedBy: lead.allocatedBy || "",
  allocatedTo: lead.allocatedTo || lead.assignedDeveloper || "",
  isSelfAllocated: Boolean(lead.isSelfAllocated),
  taskRemark: lead.taskRemark || "",
  nextAllocationTask: lead.nextAllocationTask || "",
  taskStartedAt: lead.taskStartedAt || "",
  taskEndedAt: lead.taskEndedAt || "",
  taskCompletedAt: lead.taskCompletedAt || "",
  taskSessions: lead.taskSessions || [],
  allocationDate: lead.allocationDate || "",
  allocationTime: lead.allocationTime || "",
  expectedCompletionDate: lead.expectedCompletionDate || "",
  taskTimeline: lead.taskTimeline || [],
  assignedTask: lead.assignedTask,
  latestActivityLog: lead.latestActivityLog
})

export default function ResearchandDevelopement() {
  const today = new Date()
  const [, setTimerTick] = useState(0)
  const selectedBranch = useSelector(
    (state) => state.companyBranch.selectedBranch
  )
  const [loggedUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null")
    } catch {
      return null
    }
  })
  const [month, setMonth] = useState(months[today.getMonth()])
  const [year, setYear] = useState(String(today.getFullYear()))
  const [workItems, setWorkItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState("")
  const [developmentStaff, setDevelopmentStaff] = useState([])
  const [nextAllocationTasks, setNextAllocationTasks] = useState([])
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedWork, setSelectedWork] = useState(null)
  const [modal, setModal] = useState(null)
  const [allocation, setAllocation] = useState({})
  const [update, setUpdate] = useState({})
  const [endTaskWork, setEndTaskWork] = useState(null)
  const [taskDescription, setTaskDescription] = useState("")
  const [timelineWork, setTimelineWork] = useState(null)
  const [descriptionWork, setDescriptionWork] = useState(null)
  const [activeStatusFilter, setActiveStatusFilter] = useState("New")
  const [completedFilterMenu, setCompletedFilterMenu] = useState(null)

  useEffect(() => {
    let active = true

    const fetchWorkItems = async () => {
      setIsLoading(true)
      setLoadError("")

      try {
        const response = await api.get("/lead/rnd-leads", {
          params: selectedBranch ? { branchId: selectedBranch } : undefined
        })

        if (active) {
          setWorkItems((response.data?.data || []).map(toWorkItem))
        }
      } catch (error) {
        if (active) {
          setWorkItems([])
          setLoadError(
            error.response?.data?.message || "Unable to load R&D leads"
          )
        }
      } finally {
        if (active) setIsLoading(false)
      }
    }

    fetchWorkItems()
    return () => {
      active = false
    }
  }, [selectedBranch, refreshKey])

  useEffect(() => {
    let active = true

    const fetchDevelopmentStaff = async () => {
      try {
        const response = await api.get("/auth/getallUsers?isVerified=true")
        const users = response.data?.data?.allusers || []
        const researchAndDevelopmentUsers = users.filter(
          (user) =>
            user.department?.department?.trim().toLowerCase() ===
            "research and development"
        )

        if (active) setDevelopmentStaff(researchAndDevelopmentUsers)
      } catch {
        if (active) setDevelopmentStaff([])
      }
    }

    fetchDevelopmentStaff()
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => setTimerTick((tick) => tick + 1), 60000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    let active = true

    api.get("/lead/getallTask")
      .then((response) => {
        const tasks = (response.data?.data || []).filter(
          (task) => task.listed && task._id !== "69671a6ce2872bca1b9e60df"
        )
        if (active) setNextAllocationTasks(tasks)
      })
      .catch(() => {
        if (active) setNextAllocationTasks([])
      })

    return () => {
      active = false
    }
  }, [])

  const statusCounts = workStatuses.map((status) => ({
    ...status,
    count: workItems.filter((item) => status.label === "Overdue" ? isOverdue(item) : item.status === status.label).length
  }))
  const filteredWorkItems = workItems.filter((item) => {
    if (activeStatusFilter === "Overdue") return isOverdue(item)
    if (item.status !== activeStatusFilter) return false
    if (activeStatusFilter !== "Completed") return true

    const completedAt = getCompletedAt(item)
    if (!completedAt) return false
    const completedDate = new Date(completedAt)
    return completedDate.getFullYear() === Number(year) && months[completedDate.getMonth()] === month
  })

  const openAllocation = (item) => {
    setSelectedWork(item)
    setAllocation({
      allocationDate: item.followupClosedDate,
      allocationTime: getCurrentTime(),
      assignedBy: loggedUser?.name || "",
      assignedDeveloper: item.assignedDeveloper || "",
      priority: item.priority,
      expectedCompletionDate: "",
      taskTitle: "",
      allocationDescription: ""
    })
    setModal("allocation")
  }

  const openUpdate = (item) => {
    setSelectedWork(item)
    setUpdate({
      status: item.status === "New" ? "Pending" : item.status,
      remark: item.taskRemark || "",
      allocationDate: toDateInputValue(item.allocationDate),
      expectedCompletionDate: item.expectedCompletionDate ? toDateInputValue(item.expectedCompletionDate) : "",
      isNeedChangeDate: false
    })
    setModal("update")
  }

  const saveAllocation = async (event) => {
    event.preventDefault()
    try {
      await api.post("/lead/rnd-allocation", {
        leadDocId: selectedWork.leadDocId,
        allocatedTo: allocation.assignedDeveloper,
        allocationDate: allocation.allocationDate,
        allocationTime: allocation.allocationTime,
        expectedCompletionDate: allocation.expectedCompletionDate,
        taskTitle: allocation.taskTitle,
        allocationDescription: allocation.allocationDescription
      })

      toast.success("Coding & QC task allocated")
      setModal(null)
      setRefreshKey((current) => current + 1)
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to allocate Coding & QC task"
      )
    }
  }

  const startTask = async (item) => {
    try {
      const response = await api.post("/lead/rnd-task-update", {
        leadDocId: item.leadDocId,
        action: "start"
      })
      const task = response.data?.data || {}
      setWorkItems((items) => items.map((workItem) => workItem.id === item.id ? { ...workItem, status: task.taskStatus || "In Progress", taskStartedAt: task.taskStartedAt, taskEndedAt: task.taskEndedAt || "", taskSessions: task.taskSessions || workItem.taskSessions, taskTimeline: task.taskTimeline || workItem.taskTimeline } : workItem))
      toast.success("Task start time saved")
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to start task")
    }
  }

  const openEndTask = (item) => {
    setEndTaskWork(item)
    setTaskDescription("")
    setModal("end-task")
  }

  const saveEndTask = async (event) => {
    event.preventDefault()
    try {
      const response = await api.post("/lead/rnd-task-update", {
        leadDocId: endTaskWork.leadDocId,
        action: "end",
        taskDescription
      })
      const task = response.data?.data || {}
      setWorkItems((items) => items.map((item) => item.id === endTaskWork.id ? { ...item, taskEndedAt: task.taskEndedAt, taskSessions: task.taskSessions || item.taskSessions, taskTimeline: task.taskTimeline || item.taskTimeline } : item))
      setModal(null)
      setEndTaskWork(null)
      toast.success("Task end time and description saved")
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to end task")
    }
  }

  const saveUpdate = async (event) => {
    event.preventDefault()
    try {
      const response = await api.post("/lead/rnd-task-update", {
        leadDocId: selectedWork.leadDocId,
        action: "status",
        status: update.status,
        remark: update.remark,
        isNeedChangeDate: update.isNeedChangeDate,
        expectedCompletionDate: update.isNeedChangeDate ? update.expectedCompletionDate : undefined
      })
      const task = response.data?.data || {}
      setWorkItems((items) => items.map((item) => item.id === selectedWork.id ? { ...item, status: task.taskStatus, taskRemark: task.taskRemark, expectedCompletionDate: task.expectedCompletionDate || item.expectedCompletionDate, taskCompletedAt: task.taskCompletedAt || item.taskCompletedAt, taskTimeline: task.taskTimeline || item.taskTimeline } : item))
      setModal(null)
      toast.success("Task status updated")
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update task status")
    }
  }

  return (
    <main className="h-full min-h-0 overflow-hidden bg-slate-50 p-3 sm:p-5 lg:p-6">
      <div className="mx-auto flex h-full min-h-0 max-w-7xl flex-col">
        <header className="mb-3 shrink-0 border-l-2 border-blue-500 pl-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600 sm:text-xs">Research & Development</p>
          <div className="mt-0.5 flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2.5">
            <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">My Work Summary</h1>
            <p className="text-xs text-slate-500 sm:text-sm">A quick view of your current work status.</p>
          </div>
        </header>

        <section aria-label="Work status" className="grid shrink-0 grid-cols-2 gap-2 lg:grid-cols-5">
          {statusCounts.map(({ label, count, icon: Icon, accent }) => {
            const isActive = activeStatusFilter === label
            return <button type="button" key={label} onClick={() => { setActiveStatusFilter(label); setCompletedFilterMenu(null) }} aria-pressed={isActive} className={`group flex min-w-0 items-center gap-2 rounded-xl border px-2.5 py-2 text-left shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-300 ${isActive ? "border-blue-400 bg-blue-50 shadow-md ring-1 ring-blue-200" : "border-slate-100 bg-white hover:-translate-y-0.5 hover:shadow-md"}`}>
              <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ring-1 ${accentStyles[accent]}`}><Icon size={15} strokeWidth={2.2} /></span>
              <p className="min-w-0 flex-1 truncate text-xs font-medium text-slate-600">{label}</p>
              <span className="text-lg font-bold leading-none tracking-tight text-slate-900">{String(count).padStart(2, "0")}</span>
            </button>
          })}
        </section>

        <section className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600"><FolderKanban size={18} /></span>
              <div><h2 className="text-sm font-semibold text-slate-900">{activeStatusFilter} leads</h2><p className="text-xs text-slate-500">Click a status tile to change the list</p></div>
            </div>
            {activeStatusFilter === "Completed" && <div className="flex w-full items-center gap-2 sm:w-auto">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-50 text-slate-500"><CalendarDays size={15} /></span>
              <div className="relative min-w-0 flex-1 sm:w-32 sm:flex-none"><button type="button" onClick={() => setCompletedFilterMenu(completedFilterMenu === "month" ? null : "month")} className="flex h-8 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"><span>{month}</span><ChevronRight size={14} className={`transition ${completedFilterMenu === "month" ? "-rotate-90 text-blue-600" : "rotate-90 text-slate-400"}`} /></button>{completedFilterMenu === "month" && <div className="absolute right-0 top-10 z-30 grid w-64 grid-cols-3 gap-1 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"><p className="col-span-3 px-2 pb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Select month</p>{months.map((item) => <button type="button" key={item} onClick={() => { setMonth(item); setCompletedFilterMenu(null) }} className={`rounded-lg px-2 py-2 text-xs font-semibold transition ${month === item ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"}`}>{item.slice(0, 3)}</button>)}</div>}</div>
              <div className="relative w-24 shrink-0"><button type="button" onClick={() => setCompletedFilterMenu(completedFilterMenu === "year" ? null : "year")} className="flex h-8 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"><span>{year}</span><ChevronRight size={14} className={`transition ${completedFilterMenu === "year" ? "-rotate-90 text-blue-600" : "rotate-90 text-slate-400"}`} /></button>{completedFilterMenu === "year" && <div className="absolute right-0 top-10 z-30 w-28 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">{[2025, 2026, 2027, 2028].map((item) => <button type="button" key={item} onClick={() => { setYear(String(item)); setCompletedFilterMenu(null) }} className={`w-full rounded-lg px-2 py-2 text-left text-xs font-semibold transition ${year === String(item) ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"}`}>{item}</button>)}</div>}</div>
            </div>}
          </div>

          <div className="hidden min-h-0 flex-1 overflow-auto md:block">
            <table className="w-full min-w-[820px] text-left text-xs">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3 font-semibold">Lead ID</th><th className="px-4 py-3 font-semibold">Customer</th><th className="px-4 py-3 font-semibold">Task title</th><th className="px-4 py-3 font-semibold">Priority</th><th className="px-4 py-3 font-semibold">Remaining</th><th className="px-4 py-3 font-semibold">Status</th><th className="px-4 py-3 text-center font-semibold">Start / Time worked</th><th className="px-4 py-3 text-center font-semibold">End</th><th className="px-4 py-3 text-center font-semibold">Timeline</th><th className="px-5 py-3 text-center font-semibold">Action</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr><td colSpan="10" className="px-5 py-10 text-center text-sm text-slate-500">Loading R&D leads...</td></tr>
                ) : loadError ? (
                  <tr><td colSpan="10" className="px-5 py-10 text-center text-sm text-rose-600">{loadError}</td></tr>
                ) : filteredWorkItems.length === 0 ? (
                  <tr><td colSpan="10" className="px-5 py-10 text-center text-sm text-slate-500">No {activeStatusFilter.toLowerCase()} leads found.</td></tr>
                ) : (
                  filteredWorkItems.map((item) => <WorkRow key={item.leadDocId} item={item} isActive={Boolean(item.taskStartedAt && !item.taskEndedAt)} onAllocate={openAllocation} onUpdate={openUpdate} onStart={startTask} onEnd={openEndTask} onDescription={(work) => { setDescriptionWork(work); setModal("description") }} onTimeline={(work) => { setTimelineWork(work); setModal("timeline") }} />)
                )}
              </tbody>
            </table>
          </div>
          <div className="min-h-0 flex-1 divide-y divide-slate-100 overflow-y-auto md:hidden">
            {isLoading && <p className="p-5 text-center text-sm text-slate-500">Loading R&D leads...</p>}
            {!isLoading && loadError && <p className="p-5 text-center text-sm text-rose-600">{loadError}</p>}
            {!isLoading && !loadError && filteredWorkItems.length === 0 && <p className="p-5 text-center text-sm text-slate-500">No {activeStatusFilter.toLowerCase()} leads found.</p>}
            {!isLoading && !loadError && filteredWorkItems.map((item) => <WorkCard key={item.leadDocId} item={item} isActive={Boolean(item.taskStartedAt && !item.taskEndedAt)} onAllocate={openAllocation} onUpdate={openUpdate} onStart={startTask} onEnd={openEndTask} onDescription={(work) => { setDescriptionWork(work); setModal("description") }} onTimeline={(work) => { setTimelineWork(work); setModal("timeline") }} />)}
          </div>
        </section>
      </div>
      {modal === "allocation" && <AllocationModal work={selectedWork} value={allocation} developmentStaff={developmentStaff} onChange={setAllocation} onClose={() => setModal(null)} onSubmit={saveAllocation} />}
      {modal === "update" && <WorkUpdateModal work={selectedWork} value={update} onChange={setUpdate} onClose={() => setModal(null)} onSubmit={saveUpdate} />}
      {modal === "end-task" && <EndTaskModal work={endTaskWork} value={taskDescription} onChange={setTaskDescription} onClose={() => setModal(null)} onSubmit={saveEndTask} />}
      {modal === "timeline" && <TaskTimelineModal work={timelineWork} onClose={() => setModal(null)} />}
      {modal === "description" && <WorkDescriptionModal work={descriptionWork} onClose={() => setModal(null)} />}
    </main>
  )
}

function WorkRow({ item, isActive, onAllocate, onUpdate, onStart, onEnd, onDescription, onTimeline }) {
  const isAllocated = Boolean(item.assignedDeveloper)
  const isStartEndBlocked = ["Hold", "Completed"].includes(item.status)
  const disabledClass = "cursor-not-allowed bg-slate-100 text-slate-300"
  const workedDuration = getWorkedDuration(item.taskSessions, item.taskStartedAt)
  const remainingDays = getRemainingDays(item.status, item.expectedCompletionDate)
  const startDisabled = !isAllocated || isActive || isStartEndBlocked
  const endDisabled = !isAllocated || !isActive || isStartEndBlocked
  const blockedTitle = isStartEndBlocked ? "Tasks on hold or completed cannot be started or ended" : "Allocate a developer first"
  const title = item.taskTitle || item.work
  return <tr className="text-slate-600 transition hover:bg-slate-50/80"><td className="whitespace-nowrap px-5 py-3 font-semibold text-blue-600">{item.id}</td><td className="whitespace-nowrap px-4 py-3 font-medium text-slate-700">{item.customer}</td><td className="max-w-[230px] px-4 py-3"><button type="button" onClick={() => onDescription(item)} className="max-w-full truncate text-left font-semibold text-blue-600 transition hover:text-blue-800 hover:underline" title="View task description">{title}</button></td><td className="px-4 py-3"><Badge className={priorityStyles[item.priority]}>{item.priority}</Badge></td><td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600">{remainingDays}</td><td className="px-4 py-3"><Badge className={statusStyles[item.status]}>{item.status}</Badge></td><td className="px-4 py-3 text-center"><button type="button" disabled={startDisabled} onClick={() => onStart(item)} title={startDisabled ? blockedTitle : "Start task"} className={`inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs font-semibold transition ${startDisabled ? disabledClass : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"}`}><Play size={13} />Start</button><p className="mt-1 text-[10px] font-semibold text-slate-500">{workedDuration}</p></td><td className="px-4 py-3 text-center"><button type="button" disabled={endDisabled} onClick={() => onEnd(item)} title={endDisabled ? blockedTitle : "End task"} className={`inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs font-semibold transition ${endDisabled ? disabledClass : "bg-rose-50 text-rose-600 hover:bg-rose-100"}`}><Square size={12} />End</button></td><td className="px-4 py-3 text-center"><button type="button" disabled={!isAllocated} onClick={() => onTimeline(item)} title={isAllocated ? "View Coding & QC timeline" : "Allocate a developer first"} className={`inline-grid h-8 w-8 place-items-center rounded-md transition ${isAllocated ? "bg-violet-50 text-violet-600 hover:bg-violet-100" : disabledClass}`}><Clock3 size={14} /></button></td><td className="px-5 py-3 text-center"><button type="button" onClick={() => isAllocated ? onUpdate(item) : onAllocate(item)} title={isAllocated ? "Task status" : "Allocate work"} className="inline-grid h-8 w-8 place-items-center rounded-md bg-blue-50 text-blue-600 transition hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300">{isAllocated ? <Pencil size={14} /> : <UserRoundCheck size={15} />}</button></td></tr>
}

function WorkCard({ item, isActive, onAllocate, onUpdate, onStart, onEnd, onDescription, onTimeline }) {
  const isAllocated = Boolean(item.assignedDeveloper)
  const isStartEndBlocked = ["Hold", "Completed"].includes(item.status)
  return <article className="p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-xs font-semibold text-blue-600">{item.id}</p><button type="button" onClick={() => onDescription(item)} className="mt-1 text-left text-sm font-semibold text-blue-600 hover:underline">{item.taskTitle || item.work}</button><p className="mt-1 text-xs text-slate-500">{item.customer}</p></div><Badge className={priorityStyles[item.priority]}>{item.priority}</Badge></div><div className="mt-3 flex items-center justify-between gap-3 text-xs"><span className="text-slate-500">Due: <strong className="font-medium text-slate-700">{item.due}</strong></span><Badge className={statusStyles[item.status]}>{item.status}</Badge></div><div className="mt-3 flex flex-wrap gap-2"><button type="button" disabled={!isAllocated || isActive || isStartEndBlocked} onClick={() => onStart(item)} className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-300"><Play size={13} />Start</button><button type="button" disabled={!isAllocated || !isActive || isStartEndBlocked} onClick={() => onEnd(item)} className="inline-flex items-center gap-1.5 rounded-md bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-600 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-300"><Square size={12} />End</button>{isAllocated && <button type="button" onClick={() => onTimeline(item)} className="inline-flex items-center gap-1.5 rounded-md bg-violet-50 px-2.5 py-1.5 text-xs font-semibold text-violet-600"><Clock3 size={13} />Timeline</button>}<button type="button" onClick={() => isAllocated ? onUpdate(item) : onAllocate(item)} className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-100">{isAllocated ? <Pencil size={13} /> : <UserRoundCheck size={13} />}{isAllocated ? "Task acceptance" : "Allocate work"}</button></div></article>
}

function ModalShell({ title, subtitle, children, onClose }) {
  return <div className="fixed inset-0 z-50 flex items-end bg-slate-950/40 p-0 backdrop-blur-[1px] sm:items-center sm:justify-center sm:p-4"><section role="dialog" aria-modal="true" aria-label={title} className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-2xl"><header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-100 bg-white px-5 py-4"><div><p className="text-sm font-bold text-slate-900">{title}</p><p className="mt-0.5 text-xs text-slate-500">{subtitle}</p></div><button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><X size={18} /></button></header>{children}</section></div>
}

function Field({ label, children }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>{children}</label>
}

const inputClass = "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
const selectClass = "h-10 w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 shadow-sm outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"

function AllocationModal({ work, value, developmentStaff, onChange, onClose, onSubmit }) {
  const set = (key, nextValue) => onChange((current) => ({ ...current, [key]: nextValue }))
  return <ModalShell title="Allocate development work" subtitle={`${work.id} · ${work.work}`} onClose={onClose}><form onSubmit={onSubmit}><div className="space-y-5 p-5"><div className="grid gap-x-4 gap-y-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 sm:grid-cols-3"><span><strong className="block text-slate-800">{work.customer}</strong>Customer</span><span><strong className="block text-slate-800">{work.id}</strong>Work ID</span><span><strong className="block text-slate-800">R&D</strong>Department</span><span><strong className="block text-slate-800">{formatDate(value.allocationDate)}</strong>Allocation date</span><span><strong className="block text-slate-800">{value.allocationTime || "-"}</strong>Allocation time</span><span><strong className="block text-slate-800">Pending</strong>Initial status</span></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Assigned by"><input readOnly value={value.assignedBy || "-"} className={inputClass} /></Field><Field label="Assigned developer"><select required value={value.assignedDeveloper} onChange={(e) => set("assignedDeveloper", e.target.value)} className={selectClass} disabled={developmentStaff.length === 0}><option value="">{developmentStaff.length ? "Select R&D staff" : "No R&D staff available"}</option>{developmentStaff.map((staff) => <option key={staff._id} value={staff._id}>{staff.name}</option>)}</select></Field><Field label="Priority"><select value={value.priority} onChange={(e) => set("priority", e.target.value)} className={selectClass}>{["High", "Medium", "Low"].map((priority) => <option key={priority}>{priority}</option>)}</select></Field><Field label="Expected completion date"><input type="date" min={toDateInputValue(value.allocationDate)} value={value.expectedCompletionDate} onChange={(e) => set("expectedCompletionDate", e.target.value)} className={inputClass} /></Field></div><Field label="Task title"><input required value={value.taskTitle} onChange={(e) => set("taskTitle", e.target.value)} placeholder="Enter a clear task title" className={inputClass} /></Field><Field label="Task description"><textarea required rows="5" value={value.allocationDescription} onChange={(e) => set("allocationDescription", e.target.value)} placeholder="Describe the work to be completed..." className="min-h-[120px] w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" /></Field></div><footer className="flex justify-end gap-3 border-t border-slate-100 px-5 py-4"><button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button><button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"><Save size={15} /> Allocate task</button></footer></form></ModalShell>
}

function WorkUpdateModal({ work, value, onChange, onClose, onSubmit }) {
  const set = (key, nextValue) => onChange((current) => ({ ...current, [key]: nextValue }))
  const canManageDates = ["Pending", "In Progress"].includes(value.status)
  return <ModalShell title="Update task status" subtitle={`${work.id} · ${work.work}`} onClose={onClose}>
    <form onSubmit={onSubmit}>
      <div className="space-y-5 p-5">
        <Field label="Task status"><select value={value.status} onChange={(e) => onChange((current) => ({ ...current, status: e.target.value, isNeedChangeDate: ["Pending", "In Progress"].includes(e.target.value) ? current.isNeedChangeDate : false }))} className={selectClass}>{["Pending", "In Progress", "Hold", "Completed"].map((status) => <option key={status}>{status}</option>)}</select></Field>
        {canManageDates && <div className="space-y-4"><Field label="Allocation date"><input readOnly type="date" value={value.allocationDate} className={inputClass} /></Field><label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700"><input type="checkbox" checked={Boolean(value.isNeedChangeDate)} onChange={(e) => set("isNeedChangeDate", e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" /><span>Need to change the expected completion date?</span></label>{value.isNeedChangeDate && <Field label="Expected completion date"><input required type="date" min={value.allocationDate} value={value.expectedCompletionDate} onChange={(e) => set("expectedCompletionDate", e.target.value)} className={inputClass} /></Field>}</div>}
        <Field label="Remark"><textarea rows="4" value={value.remark} onChange={(e) => set("remark", e.target.value)} placeholder="Add a remark about this status update..." className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" /></Field>
      </div>
      <footer className="flex justify-end gap-3 border-t border-slate-100 px-5 py-4"><button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Close</button><button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"><Save size={15} /> Save status</button></footer>
    </form>
  </ModalShell>
}

function EndTaskModal({ work, value, onChange, onClose, onSubmit }) {
  return <ModalShell title="End task" subtitle={`${work.id} · ${work.work}`} onClose={onClose}><form onSubmit={onSubmit}><div className="space-y-5 p-5"><Field label="Task description"><textarea required rows="5" value={value} onChange={(event) => onChange(event.target.value)} placeholder="Describe the work completed in this task session..." className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" /></Field></div><footer className="flex justify-end gap-3 border-t border-slate-100 px-5 py-4"><button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button><button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"><Square size={14} /> End task</button></footer></form></ModalShell>
}

function WorkDescriptionModal({ work, onClose }) {
  const title = work?.taskTitle || work?.work || "Task description"
  const description = work?.allocationDescription || "No allocation description was provided for this task."
  return <ModalShell title={title} subtitle={`${work?.id || ""} · Task details`} onClose={onClose}><div className="p-5"><p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">{description}</p><div className="mt-6 flex justify-end"><button type="button" onClick={onClose} className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">Close</button></div></div></ModalShell>
}

function TaskTimelineModal({ work, onClose }) {
  const events = [...(work?.taskTimeline || [])].sort(
    (left, right) => new Date(left.at) - new Date(right.at)
  )
  const formatTimelineTime = (value) => new Date(value).toLocaleString("en-GB", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: true
  })
  const eventDetail = (event) => {
    if (event.event !== "Work Allocated") return event.detail
    if (work.isSelfAllocated) return "Self allocated"
    return `Allocated by ${work.allocatedBy || "Unknown"} · Received by ${work.allocatedTo || "Unknown"}`
  }

  return <ModalShell title="Coding & QC timeline" subtitle={`${work.id} · ${work.work}`} onClose={onClose}><div className="p-5">{events.length === 0 ? <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No Coding & QC activity has been recorded yet.</p> : <ol className="space-y-0">{events.map((event, index) => <li key={`${event.at}-${index}`} className="relative grid grid-cols-[112px_20px_1fr] gap-3 pb-6 last:pb-0"><time className="pt-0.5 text-right text-xs font-semibold leading-5 text-slate-500">{formatTimelineTime(event.at)}</time><div className="relative flex justify-center"><span className="z-10 mt-1 h-3 w-3 rounded-full border-[3px] border-white bg-blue-600 shadow-sm" />{index < events.length - 1 && <span className="absolute top-4 h-full w-px bg-slate-200" />}</div><div><p className="text-sm font-semibold text-slate-800">{event.event}</p>{eventDetail(event) && <p className="mt-1 text-xs leading-5 text-slate-500">{eventDetail(event)}</p>}</div></li>)}</ol>}</div></ModalShell>
}

function Badge({ children, className }) {
  return <span className={`inline-flex whitespace-nowrap rounded-md px-2 py-1 text-[10px] font-semibold ${className}`}>{children}</span>
}
