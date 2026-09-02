// const COLOR_SCHEMES = [
//   {
//     border: "border-l-emerald-500",
//     progress: "bg-emerald-500",
//     progressBg: "bg-emerald-100",
//     badge: "text-emerald-700 bg-emerald-50"
//   },
//   {
//     border: "border-l-blue-500",
//     progress: "bg-blue-500",
//     progressBg: "bg-blue-100",
//     badge: "text-blue-700 bg-blue-50"
//   },
//   {
//     border: "border-l-violet-500",
//     progress: "bg-violet-500",
//     progressBg: "bg-violet-100",
//     badge: "text-violet-700 bg-violet-50"
//   },
//   {
//     border: "border-l-amber-500",
//     progress: "bg-amber-500",
//     progressBg: "bg-amber-100",
//     badge: "text-amber-700 bg-amber-50"
//   },
//   {
//     border: "border-l-rose-500",
//     progress: "bg-rose-500",
//     progressBg: "bg-rose-100",
//     badge: "text-rose-700 bg-rose-50"
//   }
// ]

// const CategoryCardCompact = ({ item, index, onClick }) => {
//   const colorScheme = COLOR_SCHEMES[index % COLOR_SCHEMES.length]

//   const achieved = Number(item?.achievedamount || 0)
//   const target = Number(item?.targetamount || 0)
//   const percentage = target > 0 ? Math.min((achieved / target) * 100, 100) : 0

//   const formatAmount = (num) => {
//     console.log(num)
//     if (num >= 10000000) return (num / 10000000).toFixed(1) + "CR"
//     if (num >= 100000) return (num / 100000).toFixed(1) + "L"
//     if (num >= 1000) return (num / 1000).toFixed(1) + "K"

//     return num.toString()
//   }

//   return (
//     <div
//       onClick={() => onClick(item.categoryId, item.categoryName)}
//       className={`
//         ${colorScheme.border}
//         rounded-lg border border-slate-200 border-l-[3px] bg-white px-3 py-2
//         cursor-pointer shadow-sm transition-all duration-150
//         hover:shadow-md hover:-translate-y-[1px] active:scale-[0.99]
//       `}
//     >
//       <div className="flex items-start justify-between gap-2">
//         <h4 className="line-clamp-1 text-[12px] font-semibold leading-4 text-slate-900">
//           {item?.categoryName}
//         </h4>

//         <span
//           className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${colorScheme.badge}`}
//         >
//           {percentage.toFixed(0)}%
//         </span>
//       </div>

//       <div className="mt-1 flex items-end justify-between ">
//         <p className="text-[13px] font-bold leading-none text-slate-900">
//           {formatAmount(achieved)}
//         </p>

//         <p className="text-[12px] font-bold text-slate-900">
//           {formatAmount(target)}
//         </p>
//       </div>

//       <div className="mt-1.5">
//         <div
//           className={`h-1.5 w-full overflow-hidden rounded-full ${colorScheme.progressBg}`}
//         >
//           <div
//             className={`h-full rounded-full ${colorScheme.progress} transition-all duration-500 ease-out`}
//             style={{ width: `${percentage}%` }}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// const CategoryListIconFirst = ({
//   categorylist,
//   handleMoreClick,
//   sidebarOpen
// }) => {
// console.log(categorylist)
//   return (
//     <div
//       className={`
//         min-h-0 flex-1 overflow-y-auto px-1 py-1
//         ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
//         transition-opacity duration-150
//       `}
//     >
//       <div className="space-y-2">
//         {categorylist && categorylist.length > 0 ? (
//           categorylist.map((item, index) => (
//             <CategoryCardCompact
//               key={`${item.categoryId || item.categoryName}-${index}`}
//               item={item}
//               index={index}
//               onClick={()=>handleMoreClick(item?.categoryId)}
//             />
//           ))
//         ) : (
//           <div className="rounded-lg border border-dashed border-slate-500/50 bg-white/5 px-3 py-6 text-center">
//             <p className="text-[12px] text-slate-400">
//               No categories available
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default CategoryListIconFirst

import {
  Users,
  Building2,
  CircleDollarSign,
  Trophy,
  Boxes,
  ChevronRight
} from "lucide-react"

const COLOR_SCHEMES = [
  {
    line: "from-emerald-400 to-teal-500",
    soft: "bg-emerald-50",
    iconColor: "text-emerald-600",
    bar: "bg-emerald-500",
    barBg: "bg-emerald-100",
    badge: "bg-emerald-50 text-emerald-700",
    icon: Users
  },
  {
    line: "from-blue-400 to-sky-500",
    soft: "bg-blue-50",
    iconColor: "text-blue-600",
    bar: "bg-blue-500",
    barBg: "bg-blue-100",
    badge: "bg-blue-50 text-blue-700",
    icon: Building2
  },
  {
    line: "from-amber-400 to-orange-500",
    soft: "bg-amber-50",
    iconColor: "text-amber-600",
    bar: "bg-amber-500",
    barBg: "bg-amber-100",
    badge: "bg-amber-50 text-amber-700",
    icon: CircleDollarSign
  },
  {
    line: "from-violet-400 to-purple-500",
    soft: "bg-violet-50",
    iconColor: "text-violet-600",
    bar: "bg-violet-500",
    barBg: "bg-violet-100",
    badge: "bg-violet-50 text-violet-700",
    icon: Trophy
  },
  {
    line: "from-rose-400 to-pink-500",
    soft: "bg-rose-50",
    iconColor: "text-rose-600",
    bar: "bg-rose-500",
    barBg: "bg-rose-100",
    badge: "bg-rose-50 text-rose-700",
    icon: Boxes
  }
]

const formatAmount = (num) => {
  const value = Number(num || 0)
  if (value >= 10000000) return (value / 10000000).toFixed(1) + "CR"
  if (value >= 100000) return (value / 100000).toFixed(1) + "L"
  if (value >= 1000) return (value / 1000).toFixed(1) + "K"
  return String(value)
}

const CategoryCardCompact = ({ item, index, onClick }) => {
  const scheme = COLOR_SCHEMES[index % COLOR_SCHEMES.length]
  const Icon = scheme.icon

  const achieved = Number(item?.achievedamount || 0)
  const target = Number(item?.targetamount || 0)
  const percentage = target > 0 ? Math.min((achieved / target) * 100, 100) : 0

  return (
    <button
      type="button"
      onClick={() => onClick(item?.categoryId)}
      className="group relative flex w-full items-start gap-2.5 overflow-hidden rounded-2xl bg-white px-2.5 py-2.5 text-left shadow-sm ring-1 ring-slate-200/70 transition hover:-translate-y-[1px] hover:shadow-md"
    >
      <span className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${scheme.line}`} />

      {/* <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${scheme.soft}`}>
        <Icon size={15} className={scheme.iconColor} strokeWidth={2.1} />
      </div> */}

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div
              className="truncate text-[12.5px] font-semibold leading-4 text-slate-900"
              title={item?.categoryName}
            >
              {item?.categoryName}
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${scheme.badge}`}>
                {percentage.toFixed(0)}%
              </span>
              <span className="text-[10px] text-slate-400">
                {formatAmount(achieved)} / {formatAmount(target)}
              </span>
            </div>
          </div>

          <ChevronRight
            size={14}
            className="mt-0.5 shrink-0 text-slate-300 transition group-hover:text-slate-500"
          />
        </div>

        <div className={`mt-2 h-1.5 w-full overflow-hidden rounded-full ${scheme.barBg}`}>
          <div
            className={`h-full rounded-full ${scheme.bar} transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </button>
  )
}

const CategoryListIconFirst = ({ categorylist, handleMoreClick, sidebarOpen }) => {
  return (
    <div
      className={`
        min-h-0 w-full flex-1 overflow-y-auto overflow-x-hidden
        ${sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"}
        transition-opacity duration-150
      `}
    >
      <div className="space-y-2">
        {categorylist?.length ? (
          categorylist.map((item, index) => (
            <CategoryCardCompact
              key={`${item.categoryId || item.categoryName}-${index}`}
              item={item}
              index={index}
              onClick={handleMoreClick}
            />
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-5 text-center">
            <p className="text-[12px] text-slate-400">No categories available</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryListIconFirst