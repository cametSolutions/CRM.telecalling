
// import { useEffect, useState } from "react"
// import { X, Loader2 } from "lucide-react"


// export default function AnnouncementModal({
//   open,
//   onClose,
//   onSubmit,
//   onSuccess,announcements,isAdmin
// }) {
// console.log(open)
//   const [title, setTitle] = useState("")
//   const [submitting, setSubmitting] = useState(false)
//   const [error, setError] = useState("")

//   // Reset form state each time the popup is opened fresh
//   useEffect(() => {
//     if (open) {
//       setTitle("")
//       setError("")
//       setSubmitting(false)
//     }
//   }, [open])

//   // Close on Escape
//   useEffect(() => {
//     if (!open) return
//     const handleEscape = (e) => e.key === "Escape" && !submitting && onClose?.()
//     document.addEventListener("keydown", handleEscape)
//     return () => document.removeEventListener("keydown", handleEscape)
//   }, [open, submitting, onClose])

//   if (!open) return null

//   const handleCancel = () => {
//     if (submitting) return
//     setTitle("")
//     setError("")
//     onClose?.()
//   }

//   const handleSubmit = async (e) => {
// console.log(e)
//     e?.preventDefault?.()
//     if (!title.trim()) {
//       setError("Announcement text is required.")
//       return
//     }

//     setSubmitting(true)
//     setError("")
//     try {
//       const result = await onSubmit?.(title.trim())
//       onSuccess?.(result)
//       setTitle("")
//     } catch (err) {
//       setError(err?.message || "Something went wrong. Please try again.")
//     } finally {
//       setSubmitting(false)
//     }
//   }

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
//           <label className="text-xs font-medium text-slate-600">
//             Announcement
//           </label>
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
//             {submitting && (
//               <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2.5} />
//             )}
//             {submitting ? "Publishing…" : "Submit"}
//           </button>
//         </div>
//       </form>
//     </div>
//   )
// }
import React, { useEffect, useState } from "react"
import { Loader2, X, Megaphone } from "lucide-react"

export default function AnnouncementModal({
  open,
  onClose,
  onSubmit,
  onSuccess,
  announcements = [],
  isAdmin
}) {
console.log(announcements)
  const [title, setTitle] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (open) {
      setTitle("")
      setError("")
      setSubmitting(false)
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    const handleEscape = (e) => {
      if (e.key === "Escape" && !submitting) {
        handleCancel()
      }
    }

    document.addEventListener("keydown", handleEscape)

    return () => document.removeEventListener("keydown", handleEscape)
  }, [open, submitting])

  if (!open) return null

  const handleCancel = () => {
    if (submitting) return

    setTitle("")
    setError("")
    onClose?.()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

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
      setError(err?.message || "Something went wrong.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleCancel}
      />

      {/* Modal */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-[#1e2530] px-6 py-4">
          <div className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-white" />
            <h2 className="text-lg font-semibold text-white">
              Announcements
            </h2>
          </div>

          <button
            type="button"
            onClick={handleCancel}
            className="rounded-md p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 overflow-y-auto p-6">
          {/* Existing Announcements */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-700">
              Current Announcements
            </h3>

            {/* <div className="max-h-72 space-y-3 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
              {announcements?.length > 0 ? (
                announcements
                  .slice()
                  .reverse()
                  .map((item) => (
                    <div
                      key={item._id}
                      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                          Announcement
                        </span>

                        <span className="text-xs text-slate-400">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleString()
                            : ""}
                        </span>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-slate-700">
                        {item.announcement}
                      </p>

                      {item.postedBy && (
                        <div className="mt-3 text-xs text-slate-500">
                          Posted by{" "}
                          <span className="font-medium">
                            {item.postedBy}
                          </span>
                        </div>
                      )}
                    </div>
                  ))
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white py-10 text-center">
                  <Megaphone className="mx-auto mb-3 h-8 w-8 text-slate-300" />
                  <p className="text-sm text-slate-500">
                    No announcements available.
                  </p>
                </div>
              )}
            </div> */}
<div className="max-h-80 space-y-3 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
  {announcements?.length > 0 ? (
    [...announcements]
      .reverse()
      .map((item) => (
        <div
          key={item._id}
          className="rounded-xl border border-slate-200 bg-white p-4 transition-all hover:shadow-md"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-indigo-100 p-2">
              <Megaphone className="h-4 w-4 text-indigo-600" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold text-slate-800">
                  Announcement
                </span>

                <span className="text-xs text-slate-400">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleString()
                    : ""}
                </span>
              </div>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {item.announcement}
              </p>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Posted by{" "}
                  <span className="font-medium">
                    {item.postedBy || "CAMET CRM"}
                  </span>
                </span>

                {item.badge && (
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                    {item.badge}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))
  ) : (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white py-10 text-center">
      <Megaphone className="mx-auto mb-3 h-8 w-8 text-slate-300" />
      <p className="text-sm text-slate-500">
        No announcements available.
      </p>
    </div>
  )}
</div>
          </div>

          {/* Admin Section */}
          {isAdmin && (
            <div className="space-y-2 border-t border-slate-200 pt-5">
              <h3 className="text-sm font-semibold text-slate-700">
                Publish New Announcement
              </h3>

              <input
                type="text"
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter announcement..."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
              />

              {error && (
                <p className="text-xs font-medium text-red-600">
                  {error}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`flex items-center ${
            isAdmin ? "justify-end" : "justify-center"
          } gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4`}
        >
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Close
          </button>

          {isAdmin && (
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-lg bg-[#1e2530] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#2c3646] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {submitting ? "Publishing..." : "Publish"}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}