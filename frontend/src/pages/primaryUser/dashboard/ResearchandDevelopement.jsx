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
  Pencil,
  Plus
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
  Pending: "bg-amber-50 text-amber-600"
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

export default function ResearchandDevelopement() {
  const today = new Date()
  const [month, setMonth] = useState(months[today.getMonth()])
  const [year, setYear] = useState(String(today.getFullYear()))

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
              <tbody className="divide-y divide-slate-100">{priorityWork.map((item) => <WorkRow key={item.id} item={item} />)}</tbody>
            </table>
          </div>
          <div className="min-h-0 flex-1 divide-y divide-slate-100 overflow-y-auto md:hidden">{priorityWork.map((item) => <WorkCard key={item.id} item={item} />)}</div>
        </section>
      </div>
    </main>
  )
}

function WorkRow({ item }) {
  return <tr className="text-slate-600 transition hover:bg-slate-50/80"><td className="whitespace-nowrap px-5 py-3 font-semibold text-blue-600">{item.id}</td><td className="whitespace-nowrap px-4 py-3 font-medium text-slate-700">{item.customer}</td><td className="max-w-[230px] px-4 py-3 font-medium text-slate-700">{item.work}</td><td className="px-4 py-3"><Badge className={priorityStyles[item.priority]}>{item.priority}</Badge></td><td className="whitespace-nowrap px-4 py-3">{item.due}</td><td className="px-4 py-3"><Badge className={statusStyles[item.status]}>{item.status}</Badge></td><td className="px-5 py-3 text-center"><button type="button" aria-label={`Edit ${item.id}`} className="inline-grid h-7 w-7 place-items-center rounded-md bg-blue-50 text-blue-600 transition hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300"><Pencil size={14} /></button></td></tr>
}

function WorkCard({ item }) {
  return <article className="p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-xs font-semibold text-blue-600">{item.id}</p><h3 className="mt-1 text-sm font-semibold text-slate-800">{item.work}</h3><p className="mt-1 text-xs text-slate-500">{item.customer}</p></div><Badge className={priorityStyles[item.priority]}>{item.priority}</Badge></div><div className="mt-3 flex items-center justify-between gap-3 text-xs"><span className="text-slate-500">Due: <strong className="font-medium text-slate-700">{item.due}</strong></span><Badge className={statusStyles[item.status]}>{item.status}</Badge></div><button type="button" aria-label={`Edit ${item.id}`} className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"><Pencil size={13} /> Edit work</button></article>
}

function Badge({ children, className }) {
  return <span className={`inline-flex whitespace-nowrap rounded-md px-2 py-1 text-[10px] font-semibold ${className}`}>{children}</span>
}
