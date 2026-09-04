
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getLocalStorageItem } from "../../helper/localstorage";
import { Bug, X, Loader2, CheckCircle2, ChevronLeft, List as ListIcon, Plus } from "lucide-react";
import api from "../../api/api";
/**
 * ReportBugButton — one header icon, one modal, two tabs:
 *   - "New Report": staff submits a bug (title, description, severity)
 *   - "List": staff sees everything THEY submitted, tap one to see its
 *     current status (Pending / Cleared) and details.
 *
 * Usage (inside your header's icon row):
 *   <ReportBugButton api={api} />   // `api` = your existing axios instance
 */

const ENDPOINT = "/bugreports";

const SEVERITIES = [
  { value: "low", label: "Low", tint: "border-slate-200 text-slate-600" },
  { value: "medium", label: "Medium", tint: "border-amber-200 text-amber-700" },
  { value: "high", label: "High", tint: "border-orange-200 text-orange-700" },
  { value: "critical", label: "Critical", tint: "border-red-200 text-red-700" },
];

const EMPTY_FORM = { title: "", description: "", severity: "medium" };

// Collapse the 4 backend statuses down to what staff actually care about
const isCleared = (status) => status === "resolved" || status === "closed";

export default function ReportBugButton() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("form"); // "form" | "list"
  const [selected, setSelected] = useState(null); // report being viewed in detail

  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
const [loggeduser,setloggeduser]=useState(null)
console.log(loggeduser)
  const [reports, setReports] = useState([]);
  const [listLoading, setListLoading] = useState(false);
useEffect(()=>{
const user=getLocalStorageItem("user")
setloggeduser(user)
console.log(user)
},[])
  const resetForm = () => {
    setForm(EMPTY_FORM);
    setError("");
    setSuccess(false);
  };

  const handleClose = () => {
    if (submitting) return;
    setOpen(false);
    setTab("form");
    setSelected(null);
    resetForm();
  };

  const fetchList = async () => {
    setListLoading(true);
    try {
      const res = await api.get(`${ENDPOINT}/mine`);
      setReports(res.data?.data || []);
    } catch (err) {
      console.error("Failed to load your bug reports:", err.message);
    } finally {
      setListLoading(false);
    }
  };

  const goToList = () => {
    setSelected(null);
    setTab("list");
    fetchList();
  };

  const goToForm = () => {
    setSelected(null);
    setTab("form");
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (!form.title.trim() || !form.description.trim()) {
      setError("Please fill in both a title and a description.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await api.post("/bugreport/createbug", {
        title: form.title.trim(),
        description: form.description.trim(),
        severity: form.severity,
        reportedBy:loggeduser
      });
      setSuccess(true);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't submit the report. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Report a Bug"
        className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
      >
        <Bug className="h-[18px] w-[18px]" strokeWidth={2} />
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={handleClose} />

            <div className="relative z-10 my-8 flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-xl bg-white shadow-xl">
              {/* Header */}
              <div className="flex flex-none items-center justify-between bg-[#1e2530] px-5 py-4">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
                  {selected && (
                    <button
                      type="button"
                      onClick={() => setSelected(null)}
                      className="mr-1 rounded p-0.5 hover:bg-white/10"
                      aria-label="Back to list"
                    >
                      <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
                    </button>
                  )}
                  <Bug className="h-4 w-4" strokeWidth={2.25} />
                  {selected ? "Bug Report" : "Report a Bug"}
                </h2>
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-md p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" strokeWidth={2.25} />
                </button>
              </div>

              {/* Tabs */}
              {!selected && (
                <div className="flex flex-none border-b border-slate-100 px-2">
                  <button
                    type="button"
                    onClick={goToForm}
                    className={`flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-xs font-medium transition-colors ${
                      tab === "form"
                        ? "border-[#1e2530] text-slate-800"
                        : "border-transparent text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <Plus className="h-3.5 w-3.5" strokeWidth={2.25} />
                    New Report
                  </button>
                  <button
                    type="button"
                    onClick={goToList}
                    className={`flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-xs font-medium transition-colors ${
                      tab === "list"
                        ? "border-[#1e2530] text-slate-800"
                        : "border-transparent text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <ListIcon className="h-3.5 w-3.5" strokeWidth={2.25} />
                    List
                  </button>
                </div>
              )}

              {/* ---- Detail view ---- */}
              {selected ? (
                <div className="flex-1 overflow-y-auto px-5 py-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold text-slate-800">{selected.title}</h3>
                    <span
                      className={`flex-none rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        isCleared(selected.status)
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {isCleared(selected.status) ? "Cleared" : "Pending"}
                    </span>
                  </div>

                  <p className="mt-3 whitespace-pre-wrap text-sm text-slate-600">
                    {selected.description}
                  </p>

                  {selected.adminNote && (
                    <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                        Note from admin
                      </p>
                      <p className="mt-1 text-sm text-slate-700">{selected.adminNote}</p>
                    </div>
                  )}

                  <div className="mt-4 flex flex-col gap-1 text-xs text-slate-400">
                    <span>Severity: <span className="capitalize text-slate-600">{selected.severity}</span></span>
                    <span>
                      Reported:{" "}
                      {selected.createdAt
                        ? new Date(selected.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit", month: "short", year: "numeric"
                          })
                        : "—"}
                    </span>
                    {selected.pageUrl && <span className="truncate">Page: {selected.pageUrl}</span>}
                  </div>
                </div>
              ) : tab === "list" ? (
                /* ---- List view ---- */
                <div className="flex-1 overflow-y-auto">
                  {listLoading ? (
                    <div className="px-5 py-10 text-center text-sm text-slate-400">Loading…</div>
                  ) : reports.length === 0 ? (
                    <div className="px-5 py-10 text-center text-sm italic text-slate-400">
                      You haven't reported any bugs yet.
                    </div>
                  ) : (
                    <ul className="divide-y divide-slate-100">
                      {reports.map((r) => (
                        <li key={r._id}>
                          <button
                            type="button"
                            onClick={() => setSelected(r)}
                            className="flex w-full items-start justify-between gap-3 px-5 py-3 text-left transition-colors hover:bg-slate-50"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-slate-800">{r.title}</p>
                              <p className="mt-0.5 truncate text-xs text-slate-500">{r.description}</p>
                            </div>
                            <span
                              className={`flex-none rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                isCleared(r.status)
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              {isCleared(r.status) ? "Cleared" : "Pending"}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : success ? (
                /* ---- Success screen ---- */
                <div className="flex flex-col items-center gap-3 overflow-y-auto px-6 py-10 text-center">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" strokeWidth={1.75} />
                  <p className="text-sm font-medium text-slate-800">Thanks — your report was submitted.</p>
                  <p className="text-xs text-slate-500">Check the List tab anytime to see if it's cleared.</p>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="mt-2 rounded-lg bg-[#1e2530] px-4 py-2 text-sm font-medium text-white hover:bg-[#2a3342]"
                  >
                    Report another
                  </button>
                </div>
              ) : (
                /* ---- New report form ---- */
                <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 py-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-600">What's wrong?</label>
                    <input
                      type="text"
                      autoFocus
                      value={form.title}
                      onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                      placeholder="e.g. Save button not working on Leads page"
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-600">Describe the issue</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      placeholder="What did you do, what did you expect, what happened instead?"
                      rows={4}
                      className="resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-600">Severity</label>
                    <div className="grid grid-cols-4 gap-2">
                      {SEVERITIES.map((s) => (
                        <button
                          key={s.value}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, severity: s.value }))}
                          className={`rounded-lg border px-2 py-2 text-xs font-medium transition-all ${
                            form.severity === s.value
                              ? s.tint
                              : "border-slate-200 text-slate-400 hover:border-slate-300"
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                

                  {error && <p className="text-xs font-medium text-red-600">{error}</p>}

                  <div className="flex flex-none items-center justify-end gap-2 border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={submitting}
                      className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center gap-2 rounded-lg bg-[#1e2530] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#2a3342] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2.5} />}
                      {submitting ? "Submitting…" : "Submit"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
