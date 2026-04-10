import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

export function FancySelect({
  label,
  value,
  options,
  onChange,
  placeholder = "Select",
  width = "min-w-[150px]"
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((opt) => String(opt.value) === String(value));
console.log(options)
console.log(value)
console.log(selected)
console.log(label)
  return (
    <div ref={wrapRef} className={`relative ${width}`}>
      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </label>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`
          group flex w-full items-center justify-between gap-3 rounded-xl
          border border-slate-200/80 bg-white/90 px-3 py-2.5 text-left
          shadow-[0_6px_20px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]
          backdrop-blur transition-all duration-200
          hover:border-slate-300 hover:shadow-[0_10px_24px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.95)]
          focus:outline-none focus:ring-2 focus:ring-emerald-200
          ${open ? "border-emerald-300 ring-2 ring-emerald-100" : ""}
        `}
      >
        <div className="min-w-0">
          <div className="truncate text-[13px] font-semibold text-slate-800">
            {selected?.label || placeholder}
          </div>
        </div>

        <ChevronDown
          size={16}
          className={`shrink-0 text-slate-500 transition-transform duration-200 ${
            open ? "rotate-180 text-slate-700" : ""
          }`}
        />
      </button>

      <div
        className={`
          absolute left-0 right-0 top-[calc(100%+8px)] z-50 origin-top rounded-2xl
          border border-slate-200/80 bg-white/95 p-2 shadow-[0_18px_50px_rgba(15,23,42,0.16)]
          backdrop-blur-xl transition-all duration-200
          ${
            open
              ? "pointer-events-auto scale-100 opacity-100 translate-y-0"
              : "pointer-events-none scale-[0.98] opacity-0 -translate-y-1"
          }
        `}
      >
        <div className="max-h-60 overflow-auto pr-1">
          <div className="space-y-1">
            {options.map((opt) => {
              const active = String(opt.value) === String(value);

              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`
                    flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left
                    transition-all duration-150
                    ${
                      active
                        ? "bg-emerald-50 text-emerald-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
                        : "text-slate-700 hover:bg-slate-50"
                    }
                  `}
                >
                  <span className="truncate text-[13px] font-medium">
                    {opt.label}
                  </span>

                  {/* <span
                    className={`ml-3 shrink-0 transition-opacity ${
                      active ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <Check size={15} />
                  </span> */}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}