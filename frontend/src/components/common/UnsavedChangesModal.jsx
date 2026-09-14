import React from "react"
import { AlertTriangle } from "lucide-react"

const UnsavedChangesModal = ({
  open,
  onClose,
  onConfirm,
  title = "Unsaved changes",
  description = "You have unsaved changes. Leaving now will discard them."
}) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/45 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
        <div className="flex items-start gap-3 px-5 py-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-[18px] font-semibold text-slate-800">
              {title}
            </h3>
            <p className="mt-1 text-[14px] leading-6 text-slate-500">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-900"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

export default UnsavedChangesModal