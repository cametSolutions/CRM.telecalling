import { useState } from "react"
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

const workStatuses = [
  { label: "New", count: 8, icon: ClipboardList, accent: "blue" },
  { label: "In Progress", count: 12, icon: LoaderCircle, accent: "violet" },
  { label: "Pending", count: 5, icon: Clock3, accent: "amber" },
  { label: "Overdue", count: 3, icon: CircleAlert, accent: "rose" },
  { label: "Completed", count: 6, icon: CheckCircle2, accent: "emerald" }
]

const priorityWork = [
  { id: "WK1024", customer: "ABC Traders", work: "Invoice Print Format Customization", priority: "High", due: "14 Aug 2026", status: "In Progress", progress: 75 },
  { id: "WK1025", customer: "XYZ Enterprises", work: "E-Invoice Generation Issue", priority: "High", due: "13 Aug 2026", status: "In Progress", progress: 40 },
  { id: "WK1027", customer: "Global Retail", work: "Sales Report Customization", priority: "Medium", due: "14 Aug 2026", status: "New", progress: 0 },
  { id: "WK1028", customer: "Maxima Foods", work: "Item Master Weight Marking", priority: "Medium", due: "12 Aug 2026", status: "Pending", progress: 60 },
  { id: "WK1030", customer: "Delta Solutions", work: "POS Invoice Party Update", priority: "Low", due: "15 Aug 2026", status: "New", progress: 0 }
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

const developmentStaff = ["Aarav Sharma", "Diya Nair", "Rohit Menon", "Sneha Iyer"]
const allocationStatuses = ["Pending", "In Progress", "Hold"]

const getToday = () => new Date().toISOString().slice(0, 10)
const getCurrentTime = () => new Date().toTimeString().slice(0, 5)
const activeSessionStorageKey = "rnd-active-work-sessions"

const readActiveSessions = () => {
  try {
    return JSON.parse(localStorage.getItem(activeSessionStorageKey) || "{}")
  } catch {
    return {}
  }
}

const writeActiveSessions = (sessions) => {
  localStorage.setItem(activeSessionStorageKey, JSON.stringify(sessions))
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

export default function ResearchandDevelopement() {
  const today = new Date()
  const [month, setMonth] = useState(months[today.getMonth()])
  const [year, setYear] = useState(String(today.getFullYear()))
  const [workItems, setWorkItems] = useState(priorityWork)
  const [selectedWork, setSelectedWork] = useState(null)
  const [modal, setModal] = useState(null)
  const [allocation, setAllocation] = useState({})
  const [update, setUpdate] = useState({})
  const [activeSessions, setActiveSessions] = useState(readActiveSessions)

  const openAllocation = (item) => {
    setSelectedWork(item)
    setAllocation({
      allocationDate: getToday(),
      allocationTime: getCurrentTime(),
      assignedBy: developmentStaff[0],
      assignedDeveloper: item.assignedDeveloper || "",
      priority: item.priority,
      status: item.status === "New" ? "Pending" : item.status,
      expectedStartDate: getToday(),
      expectedCompletionDate: ""
    })
    setModal("allocation")
  }

  const openUpdate = (item) => {
    setSelectedWork(item)
    setUpdate({
      status: item.status === "New" ? "Pending" : item.status,
      progress: item.progress || 0,
      acceptedAt: item.acceptedAt || "",
      activeStartedAt: activeSessions[item.id]?.startedAt || "",
      workSessions: [],
      workUpdate: "",
      nextAction: ""
    })
    setModal("update")
  }

  const saveAllocation = (event) => {
    event.preventDefault()
    setWorkItems((items) =>
      items.map((item) =>
        item.id === selectedWork.id
          ? {
              ...item,
              priority: allocation.priority,
              status: allocation.status,
              due: allocation.expectedCompletionDate || item.due,
              assignedDeveloper: allocation.assignedDeveloper,
              allocation
            }
          : item
      )
    )
    setModal(null)
  }

  const startWork = () => {
    const activeStartedAt = getCurrentTime()
    const nextSessions = {
      ...activeSessions,
      [selectedWork.id]: { startedAt: activeStartedAt, date: getToday() }
    }
    setActiveSessions(nextSessions)
    writeActiveSessions(nextSessions)
    setUpdate((current) => ({ ...current, activeStartedAt, status: "In Progress" }))
  }

  const finishWorkSession = () => {
    const endedAt = getCurrentTime()
    const nextSessions = { ...activeSessions }
    delete nextSessions[selectedWork.id]
    setActiveSessions(nextSessions)
    writeActiveSessions(nextSessions)
    setUpdate((current) => ({
      ...current,
      activeStartedAt: "",
      workSessions: [
        ...(current.workSessions || []),
        { startedAt: current.activeStartedAt, endedAt }
      ]
    }))
  }

  const acceptWork = () => {
    const acceptedAt = getCurrentTime()
    setUpdate((current) => ({ ...current, acceptedAt }))
    setWorkItems((items) =>
      items.map((item) =>
        item.id === selectedWork.id ? { ...item, acceptedAt } : item
      )
    )
  }

  const saveUpdate = (event) => {
    event.preventDefault()
    setWorkItems((items) =>
      items.map((item) =>
        item.id === selectedWork.id
          ? {
              ...item,
              status: update.status,
              progress: Number(update.progress),
              lastUpdate: { ...update, date: getToday() },
              updateLog: [...(item.updateLog || []), { ...update, date: getToday() }]
            }
          : item
      )
    )
    setModal(null)
  }

  return (
    <main className="h-full min-h-0 overflow-hidden bg-slate-50 p-3 sm:p-5 lg:p-6">
      <div className="mx-auto flex h-full min-h-0 max-w-7xl flex-col">
        <header className="mb-3 shrink-0 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">Research & Development</p>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">My Work Summary</h1>
            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">A quick view of your current work status.</p>
          </div>
        
        </header>

        <section aria-label="Work status" className="grid shrink-0 grid-cols-2 gap-3 lg:grid-cols-5">
          {workStatuses.map(({ label, count, icon: Icon, accent }) => (
            <article key={label} style={{ height: "88px" }} className="group min-w-0 rounded-xl border border-slate-100 bg-white p-2.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between gap-2">
                <span className={`grid h-8 w-8 place-items-center rounded-lg ring-1 ${accentStyles[accent]}`}><Icon size={16} strokeWidth={2.2} /></span>
                <ChevronRight size={15} className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500" />
              </div>
              <div className="-mt-0.5"><p className="truncate text-xs font-medium text-slate-500">{label}</p><p className="mt-0.5 text-2xl font-bold leading-none tracking-tight text-slate-900">{String(count).padStart(2, "0")}</p></div>
            </article>
          ))}
        </section>

        <section className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600"><FolderKanban size={18} /></span>
              <div><h2 className="text-sm font-semibold text-slate-900">Priority / Due Work</h2><p className="text-xs text-slate-500">Your upcoming and important work items</p></div>
            </div>
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-50 text-slate-500"><CalendarDays size={15} /></span>
              <label className="relative min-w-0 flex-1 sm:w-28 sm:flex-none">
                <span className="sr-only">Select month</span>
                <select value={month} onChange={(event) => setMonth(event.target.value)} className="h-8 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-2.5 pr-7 text-xs font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
                  {months.map((item) => <option key={item}>{item}</option>)}
                </select>
                <ChevronRight size={14} className="pointer-events-none absolute right-2 top-2 rotate-90 text-slate-400" />
              </label>
              <label className="relative w-20 shrink-0">
                <span className="sr-only">Select year</span>
                <select value={year} onChange={(event) => setYear(event.target.value)} className="h-8 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-2.5 pr-6 text-xs font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
                  {[2025, 2026, 2027, 2028].map((item) => <option key={item}>{item}</option>)}
                </select>
                <ChevronRight size={14} className="pointer-events-none absolute right-1.5 top-2 rotate-90 text-slate-400" />
              </label>
            </div>
          </div>

          <div className="hidden min-h-0 flex-1 overflow-auto md:block">
            <table className="w-full min-w-[820px] text-left text-xs">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3 font-semibold">Lead ID</th><th className="px-4 py-3 font-semibold">Customer</th><th className="px-4 py-3 font-semibold">Work Description</th><th className="px-4 py-3 font-semibold">Priority</th><th className="px-4 py-3 font-semibold">Due On</th><th className="px-4 py-3 font-semibold">Status</th><th className="px-5 py-3 text-center font-semibold">Action</th></tr></thead>
              <tbody className="divide-y divide-slate-100">{workItems.map((item) => <WorkRow key={item.id} item={item} onAllocate={openAllocation} onUpdate={openUpdate} />)}</tbody>
            </table>
          </div>
          <div className="min-h-0 flex-1 divide-y divide-slate-100 overflow-y-auto md:hidden">{workItems.map((item) => <WorkCard key={item.id} item={item} onAllocate={openAllocation} onUpdate={openUpdate} />)}</div>
        </section>
      </div>
      {modal === "allocation" && <AllocationModal work={selectedWork} value={allocation} onChange={setAllocation} onClose={() => setModal(null)} onSubmit={saveAllocation} />}
      {modal === "update" && <WorkUpdateModal work={selectedWork} value={update} onChange={setUpdate} onAccept={acceptWork} onStart={startWork} onFinishSession={finishWorkSession} onClose={() => setModal(null)} onSubmit={saveUpdate} />}
    </main>
  )
}

function WorkRow({ item, onAllocate, onUpdate }) {
  const isAllocated = Boolean(item.assignedDeveloper)
  return <tr className="text-slate-600 transition hover:bg-slate-50/80"><td className="whitespace-nowrap px-5 py-3 font-semibold text-blue-600">{item.id}</td><td className="whitespace-nowrap px-4 py-3 font-medium text-slate-700">{item.customer}</td><td className="max-w-[230px] px-4 py-3 font-medium text-slate-700">{item.work}</td><td className="px-4 py-3"><Badge className={priorityStyles[item.priority]}>{item.priority}</Badge></td><td className="whitespace-nowrap px-4 py-3">{item.due}</td><td className="px-4 py-3"><Badge className={statusStyles[item.status]}>{item.status}</Badge></td><td className="px-5 py-3 text-center"><button type="button" onClick={() => isAllocated ? onUpdate(item) : onAllocate(item)} title={isAllocated ? "Work update" : "Allocate work"} className="inline-grid h-8 w-8 place-items-center rounded-md bg-blue-50 text-blue-600 transition hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300">{isAllocated ? <Pencil size={14} /> : <UserRoundCheck size={15} />}</button></td></tr>
}

function WorkCard({ item, onAllocate, onUpdate }) {
  const isAllocated = Boolean(item.assignedDeveloper)
  return <article className="p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-xs font-semibold text-blue-600">{item.id}</p><h3 className="mt-1 text-sm font-semibold text-slate-800">{item.work}</h3><p className="mt-1 text-xs text-slate-500">{item.customer}</p></div><Badge className={priorityStyles[item.priority]}>{item.priority}</Badge></div><div className="mt-3 flex items-center justify-between gap-3 text-xs"><span className="text-slate-500">Due: <strong className="font-medium text-slate-700">{item.due}</strong></span><Badge className={statusStyles[item.status]}>{item.status}</Badge></div><button type="button" onClick={() => isAllocated ? onUpdate(item) : onAllocate(item)} className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-100">{isAllocated ? <Pencil size={13} /> : <UserRoundCheck size={13} />}{isAllocated ? "Work update" : "Allocate work"}</button></article>
}

function ModalShell({ title, subtitle, children, onClose }) {
  return <div className="fixed inset-0 z-50 flex items-end bg-slate-950/40 p-0 backdrop-blur-[1px] sm:items-center sm:justify-center sm:p-4"><section role="dialog" aria-modal="true" aria-label={title} className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-2xl"><header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-100 bg-white px-5 py-4"><div><p className="text-sm font-bold text-slate-900">{title}</p><p className="mt-0.5 text-xs text-slate-500">{subtitle}</p></div><button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><X size={18} /></button></header>{children}</section></div>
}

function Field({ label, children }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>{children}</label>
}

const inputClass = "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"

function AllocationModal({ work, value, onChange, onClose, onSubmit }) {
  const set = (key, nextValue) => onChange((current) => ({ ...current, [key]: nextValue }))
  return <ModalShell title="Allocate development work" subtitle={`${work.id} · ${work.work}`} onClose={onClose}><form onSubmit={onSubmit}><div className="space-y-5 p-5"><div className="grid gap-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 sm:grid-cols-3"><span><strong className="block text-slate-800">{work.customer}</strong>Customer</span><span><strong className="block text-slate-800">{work.id}</strong>Work ID</span><span><strong className="block text-slate-800">R&D</strong>Department</span></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Allocation date"><input required type="date" value={value.allocationDate} onChange={(e) => set("allocationDate", e.target.value)} className={inputClass} /></Field><Field label="Allocation time"><input required type="time" value={value.allocationTime} onChange={(e) => set("allocationTime", e.target.value)} className={inputClass} /></Field><Field label="Assigned by"><select required value={value.assignedBy} onChange={(e) => set("assignedBy", e.target.value)} className={inputClass}>{developmentStaff.map((staff) => <option key={staff}>{staff}</option>)}</select></Field><Field label="Assigned developer"><select required value={value.assignedDeveloper} onChange={(e) => set("assignedDeveloper", e.target.value)} className={inputClass}><option value="">Select R&D staff</option>{developmentStaff.map((staff) => <option key={staff}>{staff}</option>)}</select></Field><Field label="Priority"><select value={value.priority} onChange={(e) => set("priority", e.target.value)} className={inputClass}>{["High", "Medium", "Low"].map((priority) => <option key={priority}>{priority}</option>)}</select></Field><Field label="Initial status"><select value={value.status} onChange={(e) => set("status", e.target.value)} className={inputClass}>{allocationStatuses.map((status) => <option key={status}>{status}</option>)}</select></Field><Field label="Expected start date"><input required type="date" value={value.expectedStartDate} onChange={(e) => set("expectedStartDate", e.target.value)} className={inputClass} /></Field><Field label="Expected completion date"><input required type="date" min={value.expectedStartDate} value={value.expectedCompletionDate} onChange={(e) => set("expectedCompletionDate", e.target.value)} className={inputClass} /></Field></div></div><footer className="flex justify-end gap-3 border-t border-slate-100 px-5 py-4"><button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button><button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"><Save size={15} /> Allocate task</button></footer></form></ModalShell>
}

function WorkUpdateModal({ work, value, onChange, onAccept, onStart, onFinishSession, onClose, onSubmit }) {
  const set = (key, nextValue) => onChange((current) => ({ ...current, [key]: nextValue }))
  const isCompleted = value.status === "Completed"
  const sessions = value.workSessions || []
  const canSubmit = true

  return <ModalShell title="Quick work update" subtitle={`${work.id} · ${work.work}`} onClose={onClose}>
    <form onSubmit={onSubmit}>
      <div className="space-y-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-blue-50 p-3">
          <div><p className="text-xs font-semibold text-blue-800">Assigned developer</p><p className="mt-0.5 text-sm font-bold text-slate-800">{work.assignedDeveloper || "Unassigned"}</p></div>
          <div className="text-right"><p className="text-xs font-semibold text-blue-800">Today’s sessions</p><p className="mt-0.5 text-sm font-bold text-slate-800">{sessions.length}</p></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Task status"><select value={value.status} onChange={(e) => set("status", e.target.value)} className={inputClass}>{["Pending", "In Progress", "Hold", "Completed"].map((status) => <option key={status}>{status}</option>)}</select></Field>
          <Field label="Progress"><div className="flex h-10 items-center gap-3 rounded-lg border border-slate-200 px-3"><input aria-label="Progress percentage" type="range" min="0" max="100" value={value.progress} onChange={(e) => set("progress", e.target.value)} className="w-full accent-blue-600" /><span className="w-9 text-right text-sm font-semibold text-slate-700">{value.progress}%</span></div></Field>
        </div>
        <div className="grid gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 sm:grid-cols-2">
          <div><p className="text-xs font-semibold text-slate-600">Task acceptance</p><p className="mt-1 text-sm font-bold text-slate-800">{value.acceptedAt ? `Accepted at ${value.acceptedAt}` : "Awaiting acceptance"}</p></div>
          <div className="flex items-end sm:justify-end">{value.acceptedAt ? <span className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-50 px-3 text-xs font-semibold text-emerald-700"><CheckCircle2 size={15} /> Accepted</span> : <button type="button" onClick={onAccept} className="inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"><UserRoundCheck size={15} /> Accept task</button>}</div>
          <div><p className="text-xs font-semibold text-slate-600">Active session</p><p className="mt-1 text-sm font-bold text-slate-800">{value.activeStartedAt ? `Started at ${value.activeStartedAt}` : "No active session"}</p></div>
          <div className="flex items-end sm:justify-end">{value.activeStartedAt ? <button type="button" onClick={onFinishSession} className="inline-flex h-10 items-center gap-2 rounded-lg bg-rose-600 px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"><Square size={14} /> Finish session</button> : <button type="button" disabled={!value.acceptedAt} onClick={onStart} className="inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"><Play size={15} /> Start work</button>}</div>
        </div>
        {sessions.length > 0 && <div className="rounded-xl border border-slate-100"><div className="border-b border-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">Today’s recorded sessions</div>{sessions.map((session, index) => <div key={`${session.startedAt}-${index}`} className="flex items-center justify-between px-3 py-2 text-xs"><span>Session {index + 1}</span><span className="font-semibold text-slate-700">{session.startedAt} – {session.endedAt}</span></div>)}</div>}
        <Field label="Today’s work update"><textarea required rows="4" value={value.workUpdate} onChange={(e) => set("workUpdate", e.target.value)} placeholder="Describe today’s completed work, blockers, and testing performed..." className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" /></Field>
        {isCompleted && <Field label="Next action"><textarea required rows="2" value={value.nextAction} onChange={(e) => set("nextAction", e.target.value)} placeholder="Describe the next handoff, verification, or customer action..." className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" /></Field>}
        <p className="text-xs text-slate-500">You can save an update while a session is active. Finish a session only when pausing or stopping work; its end time is then recorded automatically.</p>
      </div>
      <footer className="flex justify-end gap-3 border-t border-slate-100 px-5 py-4"><button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Close</button><button disabled={!canSubmit} type="submit" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"><Save size={15} /> Save update</button></footer>
    </form>
  </ModalShell>
}

function Badge({ children, className }) {
  return <span className={`inline-flex whitespace-nowrap rounded-md px-2 py-1 text-[10px] font-semibold ${className}`}>{children}</span>
}
