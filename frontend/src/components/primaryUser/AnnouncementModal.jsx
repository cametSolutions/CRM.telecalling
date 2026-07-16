// import { useEffect, useState } from "react";
// import { X, Loader2 } from "lucide-react";

// /**
//  * AnnouncementModal — popup form for publishing a single-line announcement.
//  *
//  * Usage:
//  *   const [open, setOpen] = useState(false);
//  *
//  *   const handleAnnouncementSubmit = async (text) => {
//  *     const response = await api.post("/dashboard/updateAnnouncement", {
//  *       announcement: text,
//  *     });
//  *     setAnnouncementText(response.data.data.announcement);
//  *     toast.success(response.data.message);
//  *   };
//  *
//  *   <button onClick={() => setOpen(true)}>New Announcement</button>
//  *   <AnnouncementModal
//  *     open={open}
//  *     onClose={() => setOpen(false)}
//  *     onSubmit={handleAnnouncementSubmit}
//  *     onSuccess={() => setOpen(false)}
//  *   />
//  *
//  * `onSubmit` receives the trimmed announcement text and should return a
//  * promise (or just be an async function). The modal awaits it, shows the
//  * spinner while it's pending, and only calls `onSuccess` / clears the
//  * field if it resolves. If it throws, the thrown error's message is shown
//  * inline and the modal stays open so the user can retry.
//  */
// export default function AnnouncementModal({ open, onClose, onSubmit, onSuccess }) {
//   const [title, setTitle] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");

//   // Reset form state each time the popup is opened fresh
//   useEffect(() => {
//     if (open) {
//       setTitle("");
//       setError("");
//       setSubmitting(false);
//     }
//   }, [open]);

//   // Close on Escape
//   useEffect(() => {
//     if (!open) return;
//     const handleEscape = (e) => e.key === "Escape" && !submitting && onClose?.();
//     document.addEventListener("keydown", handleEscape);
//     return () => document.removeEventListener("keydown", handleEscape);
//   }, [open, submitting, onClose]);

//   if (!open) return null;

//   const handleCancel = () => {
//     if (submitting) return;
//     setTitle("");
//     setError("");
//     onClose?.();
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!title.trim()) {
//       setError("Announcement text is required.");
//       return;
//     }

//     setSubmitting(true);
//     setError("");
//     try {
//       const result = await onSubmit?.(title.trim());
//       onSuccess?.(result);
//       setTitle("");
//     } catch (err) {
// console.log(err)
//       setError(err?.message || "Something went wrong. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
//       {/* Backdrop */}
//       <div
//         className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
//         onClick={handleCancel}
//       />

//       {/* Modal */}
//       <form
//         onSubmit={handleSubmit}
//         className="relative z-10 w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl"
//       >
//         {/* Header — matches the app's dark navbar tone */}
//         <div className="flex items-center justify-between bg-[#1e2530] px-5 py-4">
//           <h2 className="text-sm font-semibold text-white">New Announcement</h2>
//           <button
//             type="button"
//             onClick={handleCancel}
//             className="rounded-md p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
//             aria-label="Close"
//           >
//             <X className="h-4 w-4" strokeWidth={2.25} />
//           </button>
//         </div>

//         <div className="flex flex-col gap-1.5 px-5 py-5">
//           <label className="text-xs font-medium text-slate-600">Announcement</label>
//           <input
//             type="text"
//             autoFocus
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="e.g. Scheduled Maintenance on Sunday, 10 PM"
//             className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
//           />
//           {error && <p className="text-xs font-medium text-red-600">{error}</p>}
//         </div>

//         {/* Footer actions */}
//         <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50 px-5 py-3">
//           <button
//             type="button"
//             onClick={handleCancel}
//             disabled={submitting}
//             className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-50"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={submitting}
//             className="flex items-center gap-2 rounded-lg bg-[#1e2530] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#2a3342] disabled:cursor-not-allowed disabled:opacity-60"
//           >
//             {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2.5} />}
//             {submitting ? "Publishing…" : "Submit"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
import { useEffect, useState } from "react"
import { X, Loader2 } from "lucide-react"

/**
 * AnnouncementModal — popup form for publishing a single-line announcement.
 *
 * Usage:
 *   const [open, setOpen] = useState(false);
 *
 *   const handleAnnouncementSubmit = async (text) => {
 *     const response = await api.post("/dashboard/updateAnnouncement", {
 *       announcement: text,
 *     });
 *     setAnnouncementText(response.data.data.announcement);
 *     toast.success(response.data.message);
 *   };
 *
 *   <button onClick={() => setOpen(true)}>New Announcement</button>
 *   <AnnouncementModal
 *     open={open}
 *     onClose={() => setOpen(false)}
 *     onSubmit={handleAnnouncementSubmit}
 *     onSuccess={() => setOpen(false)}
 *   />
 *
 * `onSubmit` receives the trimmed announcement text and should return a
 * promise (or just be an async function). The modal awaits it, shows the
 * spinner while it's pending, and only calls `onSuccess` / clears the
 * field if it resolves. If it throws, the thrown error's message is shown
 * inline and the modal stays open so the user can retry.
 */
export default function AnnouncementModal({
  open,
  onClose,
  onSubmit,
  onSuccess
}) {
  const [title, setTitle] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Reset form state each time the popup is opened fresh
  useEffect(() => {
    if (open) {
      setTitle("")
      setError("")
      setSubmitting(false)
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handleEscape = (e) => e.key === "Escape" && !submitting && onClose?.()
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [open, submitting, onClose])

  if (!open) return null

  const handleCancel = () => {
    if (submitting) return
    setTitle("")
    setError("")
    onClose?.()
  }

  const handleSubmit = async (e) => {
console.log(e)
    e?.preventDefault?.()
    if (!title.trim()) {
      setError("Announcement text is required.")
      return
    }

    setSubmitting(true)
    setError("")
    try {
      const result = await onSubmit?.(title.trim())
      onSuccess?.(result)
      setTitle("")
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
        onClick={handleCancel}
      />

      {/* Modal */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl"
      >
        {/* Header — matches the app's dark navbar tone */}
        <div className="flex items-center justify-between bg-[#1e2530] px-5 py-4">
          <h2 className="text-sm font-semibold text-white">New Announcement</h2>
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-md p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" strokeWidth={2.25} />
          </button>
        </div>

        <div className="flex flex-col gap-1.5 px-5 py-5">
          <label className="text-xs font-medium text-slate-600">
            Announcement
          </label>
          <input
            type="text"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Scheduled Maintenance on Sunday, 10 PM"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
          />
          {error && <p className="text-xs font-medium text-red-600">{error}</p>}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50 px-5 py-3">
          <button
            type="button"
            onClick={handleCancel}
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
            {submitting && (
              <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2.5} />
            )}
            {submitting ? "Publishing…" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  )
}
