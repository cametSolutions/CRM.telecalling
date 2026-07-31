
// import React, { useEffect, useMemo, useState } from "react"
// import { Loader2, X, Megaphone } from "lucide-react"

// export default function AnnouncementModal({
//   open,
//   onClose,
//   onSubmit,
//   onSuccess,
//   announcements = [],
//   isAdmin
// }) {
//   const [title, setTitle] = useState("")
//   const [submitting, setSubmitting] = useState(false)
//   const [error, setError] = useState("")

//   useEffect(() => {
//     if (open) {
//       setTitle("")
//       setError("")
//       setSubmitting(false)
//     }
//   }, [open])
//   useEffect(() => {
//     console.log(announcements)
//     console.log("first item:", announcements?.[0])
//     console.log(
//       "keys:",
//       announcements?.[0] ? Object.keys(announcements[0]) : []
//     )
//   }, [announcements])

//   useEffect(() => {
//     if (!open) return

//     const handleEscape = (e) => {
//       if (e.key === "Escape" && !submitting) {
//         handleCancel()
//       }
//     }

//     document.addEventListener("keydown", handleEscape)
//     return () => document.removeEventListener("keydown", handleEscape)
//   }, [open, submitting])
//   console.log(announcements)
  
//   const cleanAnnouncementText = (raw = "") => {
//     let text = String(raw).trim()

//     text = text.replace(/'\s*\+\s*'/g, "")
//     text = text.replace(/'\s*\+\s*/g, "")
//     text = text.replace(/\s*\+\s*'/g, "")
//     text = text.replace(/^\s*'/, "")
//     text = text.replace(/'\s*$/, "")
//     text = text.replace(/\\n/g, "\n")
//     text = text.replace(/\\'/g, "'")
//     text = text.replace(/\\"/g, '"')
//     text = text.replace(/\r\n/g, "\n")
//     text = text.replace(/\n{3,}/g, "\n\n")

//     return text.trim()
//   }

//   const normalizedAnnouncements = useMemo(() => {
//     return [...announcements].reverse().map((item, index) => ({
//       _id: index,
//       cleanText: cleanAnnouncementText(item)
//     }))
//   }, [announcements])
//   const cleanText = cleanAnnouncementText(announcements)
//   console.log(normalizedAnnouncements)
//   if (!open) return null

//   const handleCancel = () => {
//     if (submitting) return
//     setTitle("")
//     setError("")
//     onClose?.()
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

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
//       setError(err?.message || "Something went wrong.")
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   return (
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
//       <div
//         className="absolute inset-0 bg-black/40 backdrop-blur-sm"
//         onClick={handleCancel}
//       />

//       <form
//         onSubmit={handleSubmit}
//         className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
//       >
//         <div className="flex items-center justify-between bg-[#1e2530] px-6 py-4">
//           <div className="flex items-center gap-2">
//             <Megaphone className="h-5 w-5 text-white" />
//             <h2 className="text-lg font-semibold text-white">Announcements</h2>
//           </div>

//           <button
//             type="button"
//             onClick={handleCancel}
//             className="rounded-md p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         <div className="space-y-6 overflow-y-auto p-6">
//           <div>
//             <h3 className="mb-3 text-sm font-semibold text-slate-700">
//               Current Announcements
//             </h3>

//             <div className="max-h-80 space-y-3 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
//               <div className="rounded-xl border border-slate-200 bg-white p-4 transition-all hover:shadow-md">
//                 <p className="whitespace-pre-line break-words text-sm leading-6 text-slate-700">
//                   {cleanText}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {isAdmin && (
//             <div className="space-y-2 border-t border-slate-200 pt-5">
//               <h3 className="text-sm font-semibold text-slate-700">
//                 Publish New Announcement
//               </h3>

//               <textarea
//                 autoFocus
//                 rows={5}
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 placeholder="Enter announcement..."
//                 className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
//               />

//               {error && (
//                 <p className="text-xs font-medium text-red-600">{error}</p>
//               )}
//             </div>
//           )}
//         </div>

//         <div
//           className={`flex items-center ${
//             isAdmin ? "justify-end" : "justify-center"
//           } gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4`}
//         >
//           <button
//             type="button"
//             onClick={handleCancel}
//             className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
//           >
//             Close
//           </button>

//           {isAdmin && (
//             <button
//               type="submit"
//               disabled={submitting}
//               className="flex items-center gap-2 rounded-lg bg-[#1e2530] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#2c3646] disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
//               {submitting ? "Publishing..." : "Publish"}
//             </button>
//           )}
//         </div>
//       </form>
//     </div>
//   )
// }

// import React, { useEffect, useMemo, useState } from "react"
// import { Loader2, X, Megaphone, Plus, PenSquare } from "lucide-react"

// export default function AnnouncementModal({
//   open,
//   onClose,
//   onSubmit,
//   onSuccess,
//   announcements = "",
//   isAdmin,
//   action = false
// }) {
//   const [title, setTitle] = useState("")
//   const [submitting, setSubmitting] = useState(false)
//   const [error, setError] = useState("")
//   const [showComposer, setShowComposer] = useState(false)

//   useEffect(() => {
//     if (open) {
//       setTitle("")
//       setError("")
//       setSubmitting(false)
//       setShowComposer(false)
//     }
//   }, [open])

//   useEffect(() => {
//     if (!open) return

//     const handleEscape = (e) => {
//       if (e.key === "Escape" && !submitting) {
//         handleCancel()
//       }
//     }

//     document.addEventListener("keydown", handleEscape)
//     return () => document.removeEventListener("keydown", handleEscape)
//   }, [open, submitting])

//   const cleanAnnouncementText = (raw = "") => {
//     let text = String(raw).trim()

//     text = text.replace(/'\s*\+\s*'/g, "")
//     text = text.replace(/'\s*\+\s*/g, "")
//     text = text.replace(/\s*\+\s*'/g, "")
//     text = text.replace(/^\s*'/, "")
//     text = text.replace(/'\s*$/, "")
//     text = text.replace(/\\n/g, "\n")
//     text = text.replace(/\\'/g, "'")
//     text = text.replace(/\\"/g, '"')
//     text = text.replace(/\r\n/g, "\n")
//     text = text.replace(/\n{3,}/g, "\n\n")

//     return text.trim()
//   }

//   const normalizedAnnouncements = useMemo(() => {
//     const list = Array.isArray(announcements) ? announcements : [announcements]

//     return list
//       .filter(Boolean)
//       .reverse()
//       .map((item, index) => ({
//         _id: index,
//         cleanText: cleanAnnouncementText(item)
//       }))
//   }, [announcements])

//   if (!open) return null

//   const handleCancel = () => {
//     if (submitting) return
//     setTitle("")
//     setError("")
//     setShowComposer(false)
//     onClose?.()
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

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
//       setShowComposer(false)
//     } catch (err) {
//       setError(err?.message || "Something went wrong.")
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   return (
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
//       <div
//         className="absolute inset-0 bg-black/40 backdrop-blur-sm"
//         onClick={handleCancel}
//       />

//       <form
//         onSubmit={handleSubmit}
//         className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
//       >
//         <div className="flex items-center justify-between bg-[#1e2530] px-6 py-4">
//           <div className="flex items-center gap-2">
//             <Megaphone className="h-5 w-5 text-white" />
//             <h2 className="text-lg font-semibold text-white">Announcements</h2>
//           </div>

//           <button
//             type="button"
//             onClick={handleCancel}
//             className="rounded-md p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         <div className="space-y-6 overflow-y-auto p-6">
//           <div>
//             <div className="mb-3 flex items-center justify-between">
             

//               {isAdmin && !showComposer && (
//                 <button
//                   type="button"
//                   onClick={() => setShowComposer(true)}
//                   className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1e2530] text-white shadow-sm transition hover:bg-[#2c3646]"
//                   title="New announcement"
//                 >
//                   <Plus className="h-4 w-4" />
//                 </button>
//               )}
//             </div>

//             <div className="max-h-80 space-y-3 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
//               {normalizedAnnouncements.length > 0 ? (
//                 normalizedAnnouncements.map((item) => (
//                   <div
//                     key={item._id}
//                     className="rounded-xl border border-slate-200 bg-white p-4 transition-all hover:shadow-md"
//                   >
//                     <p className="whitespace-pre-line break-words text-sm leading-6 text-slate-700">
//                       {item.cleanText}
//                     </p>
//                   </div>
//                 ))
//               ) : (
//                 <div className="rounded-xl border border-dashed border-slate-300 bg-white py-10 text-center">
//                   <Megaphone className="mx-auto mb-3 h-8 w-8 text-slate-300" />
//                   <p className="text-sm text-slate-500">
//                     No announcements available.
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {isAdmin  && showComposer && (
//             <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <PenSquare className="h-4 w-4 text-slate-700" />
//                   <h3 className="text-sm font-semibold text-slate-700">
//                     Publish New Announcement
//                   </h3>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowComposer(false)
//                     setTitle("")
//                     setError("")
//                   }}
//                   className="text-xs font-medium text-slate-500 transition hover:text-slate-700"
//                 >
//                   Cancel
//                 </button>
//               </div>

//               <textarea
//                 autoFocus
//                 rows={5}
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 placeholder="Enter announcement..."
//                 className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
//               />

//               {error && (
//                 <p className="text-xs font-medium text-red-600">{error}</p>
//               )}
//             </div>
//           )}
//         </div>

//         <div
//           className={`flex items-center ${
//             isAdmin && showComposer ? "justify-end" : "justify-center"
//           } gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4`}
//         >
//           <button
//             type="button"
//             onClick={handleCancel}
//             className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
//           >
//             Close
//           </button>

//           {isAdmin  && showComposer && (
//             <button
//               type="submit"
//               disabled={submitting}
//               className="flex items-center gap-2 rounded-lg bg-[#1e2530] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#2c3646] disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
//               {submitting ? "Publishing..." : "Publish"}
//             </button>
//           )}
//         </div>
//       </form>
//     </div>
//   )
// }
import React, { useEffect, useMemo, useRef, useState } from "react"
import { Loader2, X, Megaphone, Plus, PenSquare, Send, Sparkles } from "lucide-react"

export default function AnnouncementModal({
  open,
  onClose,
  onSubmit,
  onSuccess,
  announcements = "",
  isAdmin,
  action = false
}) {
  const [title, setTitle] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [showComposer, setShowComposer] = useState(false)
  const [visible, setVisible] = useState(false)
  const textareaRef = useRef(null)

  const MAX_LENGTH = 500

  useEffect(() => {
    if (open) {
      setTitle("")
      setError("")
      setSubmitting(false)
      setShowComposer(false)
      // trigger enter transition on next frame
      const raf = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(raf)
    } else {
      setVisible(false)
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

  useEffect(() => {
    if (showComposer) {
      // small delay so the expand transition has started before focusing
      const t = setTimeout(() => textareaRef.current?.focus(), 120)
      return () => clearTimeout(t)
    }
  }, [showComposer])

  const cleanAnnouncementText = (raw = "") => {
    let text = String(raw).trim()

    text = text.replace(/'\s*\+\s*'/g, "")
    text = text.replace(/'\s*\+\s*/g, "")
    text = text.replace(/\s*\+\s*'/g, "")
    text = text.replace(/^\s*'/, "")
    text = text.replace(/'\s*$/, "")
    text = text.replace(/\\n/g, "\n")
    text = text.replace(/\\'/g, "'")
    text = text.replace(/\\"/g, '"')
    text = text.replace(/\r\n/g, "\n")
    text = text.replace(/\n{3,}/g, "\n\n")

    return text.trim()
  }

  const normalizedAnnouncements = useMemo(() => {
    const list = Array.isArray(announcements) ? announcements : [announcements]

    return list
      .filter(Boolean)
      .reverse()
      .map((item, index) => ({
        _id: index,
        cleanText: cleanAnnouncementText(item)
      }))
  }, [announcements])

  if (!open) return null

  const handleCancel = () => {
    if (submitting) return
    setVisible(false)
    setTimeout(() => {
      setTitle("")
      setError("")
      setShowComposer(false)
      onClose?.()
    }, 150)
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
      setShowComposer(false)
    } catch (err) {
      setError(err?.message || "Something went wrong.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      handleSubmit(e)
    }
  }

  const charCount = title.length
  const nearLimit = charCount > MAX_LENGTH * 0.85

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Announcements"
    >
      <div
        className={`absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleCancel}
      />

      <form
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        className={`relative z-10 flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 transition-all duration-200 ease-out ${
          visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-[0.98] opacity-0"
        }`}
      >
        {/* Header */}
        <div className="relative flex items-center justify-between overflow-hidden bg-gradient-to-br from-[#1e2530] to-[#0f1318] px-6 py-5">
          <div
            className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl"
            aria-hidden="true"
          />
          <div className="relative flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
              <Megaphone className="h-5 w-5 text-white" strokeWidth={2} />
            </span>
            <div>
              <h2 className="text-base font-semibold leading-tight text-white">Announcements</h2>
              <p className="text-xs text-slate-400">
                {normalizedAnnouncements.length > 0
                  ? `${normalizedAnnouncements.length} update${normalizedAnnouncements.length === 1 ? "" : "s"}`
                  : "Nothing posted yet"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCancel}
            aria-label="Close"
            className="relative rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {isAdmin && !showComposer && (
            <button
              type="button"
              onClick={() => setShowComposer(true)}
              className="group flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-4 py-3 text-sm font-medium text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50/60 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200"
            >
              <Plus className="h-4 w-4 transition group-hover:rotate-90" />
              New announcement
            </button>
          )}

          {isAdmin && showComposer && (
            <div className="space-y-3 rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100">
                    <PenSquare className="h-3.5 w-3.5 text-indigo-600" />
                  </span>
                  <h3 className="text-sm font-semibold text-slate-700">
                    New announcement
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowComposer(false)
                    setTitle("")
                    setError("")
                  }}
                  className="text-xs font-medium text-slate-500 transition hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>

              <div>
                <textarea
                  ref={textareaRef}
                  rows={5}
                  maxLength={MAX_LENGTH}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Share an update with everyone…"
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                />
                <div className="mt-1.5 flex items-center justify-between px-0.5">
                  <span className="text-[11px] text-slate-400">
                    ⌘ / Ctrl + Enter to publish
                  </span>
                  <span
                    className={`text-[11px] tabular-nums ${
                      nearLimit ? "font-medium text-amber-600" : "text-slate-400"
                    }`}
                  >
                    {charCount}/{MAX_LENGTH}
                  </span>
                </div>
              </div>

              {error && (
                <p className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                  <span className="h-1 w-1 rounded-full bg-red-600" />
                  {error}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2.5">
            {normalizedAnnouncements.length > 0 ? (
              normalizedAnnouncements.map((item, i) => (
                <div
                  key={item._id}
                  style={{ animationDelay: `${Math.min(i, 6) * 40}ms` }}
                  className="animate-[fadeInUp_0.25s_ease-out_both] rounded-xl border border-slate-200 bg-white p-4 pl-4 shadow-sm ring-1 ring-transparent transition hover:shadow-md hover:ring-slate-100"
                >
                  <div className="flex gap-3">
                    <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-slate-100">
                      <Sparkles className="h-3 w-3 text-slate-400" />
                    </span>
                    <p className="whitespace-pre-line break-words text-sm leading-6 text-slate-700">
                      {item.cleanText}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 py-12 text-center">
                <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
                  <Megaphone className="h-5 w-5 text-slate-300" />
                </span>
                <p className="text-sm font-medium text-slate-500">No announcements yet</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {isAdmin ? "Post one to keep everyone in the loop." : "Check back later for updates."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className={`flex items-center ${
            isAdmin && showComposer ? "justify-end" : "justify-center"
          } gap-3 border-t border-slate-100 bg-white px-6 py-4`}
        >
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-200"
          >
            Close
          </button>

          {isAdmin && showComposer && (
            <button
              type="submit"
              disabled={submitting || !title.trim()}
              className="flex items-center gap-2 rounded-xl bg-[#1e2530] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#2c3646] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              {submitting ? "Publishing…" : "Publish"}
            </button>
          )}
        </div>
      </form>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
