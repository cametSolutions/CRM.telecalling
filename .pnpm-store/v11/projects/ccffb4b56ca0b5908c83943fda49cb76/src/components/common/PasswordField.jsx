import { Eye, EyeOff } from "lucide-react"

const PasswordField = ({
  label,
  error,
  visible = false,
  onToggle,
  className = "",
  ...props
}) => {
  return (
    <div className={className}>
      {label ? (
        <label className="mb-1.5 block text-[12px] font-medium text-slate-700">
          {label}
        </label>
      ) : null}

      <div
        className={`flex items-center overflow-hidden rounded-xl border bg-white ${
          error ? "border-red-300" : "border-slate-300"
        }`}
      >
        <input
          type={visible ? "text" : "password"}
          className="h-11 flex-1 border-0 bg-transparent px-3 text-[13px] text-slate-900 outline-none placeholder:text-slate-400"
          {...props}
        />

        <button
          type="button"
          onClick={onToggle}
          className="px-3 text-slate-500 transition hover:text-slate-700"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {error ? (
        <p className="mt-1 text-[11px] font-medium text-red-500">{error}</p>
      ) : null}
    </div>
  )
}

export default PasswordField