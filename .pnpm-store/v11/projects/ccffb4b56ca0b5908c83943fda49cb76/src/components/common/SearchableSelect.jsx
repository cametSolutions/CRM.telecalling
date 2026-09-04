import { useState,useEffect,useRef } from "react";
import { ChevronDown ,Search,Check} from "lucide-react";
export const SearchableSelect = ({
  options,          // [{ value, label }]
  value,
  onChange,
  placeholder = "Select...",
  disabled = false,
  error
}) => {
  const [open, setOpen] = useState(false);
console.log(open)
  const [query, setQuery] = useState("");
  const wrapperRef = useRef(null);

  const selected = options.find((o) => o.value === value);

  const filtered =
    query.trim() === ""
      ? options
      : options.filter((o) =>
          o.label.toLowerCase().includes(query.toLowerCase())
        );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white border text-left text-sm font-medium transition-all
          ${
            error
              ? "border-red-300 focus:ring-red-400"
              : "border-gray-200 focus:ring-blue-400"
          }
          ${disabled ? "bg-gray-100 cursor-not-allowed text-gray-400" : "hover:border-blue-300 text-gray-700"}
          focus:outline-none focus:ring-2`}
      >
        <span className={selected ? "text-gray-800" : "text-gray-400"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && !disabled && (
        <div className="absolute z-30 mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-[fadeIn_0.12s_ease-out]">
          <div className="p-2 border-b border-gray-100 sticky top-0 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 rounded-lg border border-transparent focus:border-blue-300 focus:outline-none"
              />
            </div>
          </div>

          <div className="max-h-48 overflow-y-auto py-1">
            {filtered.length > 0 ? (
              filtered.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-blue-50 transition-colors
                    ${
                      option.value === value
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "text-gray-700"
                    }`}
                >
                  {option.label}
                  {option.value === value && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-sm text-gray-400">
                No matches found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};