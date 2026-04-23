// import { useEffect, useRef, useState } from "react"

// export function BranchSelect({
//   value,
//   onChange,
//   options,
//   label = "Branch"
// }) {
// console.log(options)
//   const [open, setOpen] = useState(false)
//   const containerRef = useRef(null)

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (containerRef.current && !containerRef.current.contains(event.target)) {
//         setOpen(false)
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside)
//     return () => document.removeEventListener("mousedown", handleClickOutside)
//   }, [])

//   return (
//     <div className="relative mt-2 w-full max-w-[240px]" ref={containerRef}>
//       {/* <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-500">
//         {label}
//       </label> */}

//       <button
//         type="button"
//         onClick={() => setOpen((prev) => !prev)}
//         className={`flex h-10 w-full items-center justify-between rounded-xl border bg-white px-3 text-left text-[12px] font-medium text-slate-700 shadow-sm transition ${
//           open
//             ? "border-slate-300 ring-2 ring-slate-200"
//             : "border-slate-200 hover:border-slate-300"
//         }`}
//       >
//         <span className="truncate">{value || "Select branch"}</span>

//         <svg
//           className={`h-4 w-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
//           viewBox="0 0 20 20"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="1.8"
//         >
//           <path d="M5 7.5L10 12.5L15 7.5" strokeLinecap="round" strokeLinejoin="round" />
//         </svg>
//       </button>

//       {open && (
//         <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
//           <div className="max-h-56 overflow-y-auto p-1">
//             {options.map((branch) => {
//               const selected = value === branch

//               return (
//                 <button
//                   key={branch}
//                   type="button"
//                   onClick={() => {
//                     onChange(branch)
//                     setOpen(false)
//                   }}
//                   className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-[12px] font-medium transition ${
//                     selected
//                       ? "bg-slate-900 text-white"
//                       : "text-slate-700 hover:bg-slate-50"
//                   }`}
//                 >
//                   <span>{branch}</span>

//                   {selected && (
//                     <svg
//                       className="h-4 w-4"
//                       viewBox="0 0 20 20"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                     >
//                       <path
//                         d="M5 10L8.5 13.5L15 7"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                     </svg>
//                   )}
//                 </button>
//               )
//             })}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

import { useEffect, useRef, useState } from "react"

export function BranchSelect({
  value,
  onChange,
  options = [],
  label = "Branch",
  labletrue = false
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  const selectedOption = options.find(
    (item) => String(item.id) === String(value)
  )
  console.log(selectedOption)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])
  console.log(options)
  console.log(value)
  return (
    <div className="relative mt-2 w-full max-w-[240px]" ref={containerRef}>
      {labletrue && (
        <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-500">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex h-8 w-full items-center justify-between rounded-xl border bg-white px-3 text-left text-[12px] font-medium text-slate-700 shadow-sm transition ${
          open
            ? "border-slate-300 ring-2 ring-slate-200"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <span className="truncate">
          {selectedOption?.label || "Select branch"}
        </span>

        <svg
          className={`h-4 w-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          <div className="max-h-56 overflow-y-auto p-1">
            {options.map((branch) => {
              const selected = String(value) === String(branch.id)

              return (
                <button
                  key={branch.id}
                  type="button"
                  onClick={() => {
                    onChange(branch.id)
                    setOpen(false)
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-[12px] font-medium transition ${
                    selected
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{branch.label}</span>

                  {selected && (
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        d="M5 10L8.5 13.5L15 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
