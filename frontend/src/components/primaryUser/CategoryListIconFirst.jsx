// import React from "react"
// import { TrendingUp, TrendingDown, Minus } from "lucide-react"

// // Dynamic color palette with left border colors
// const COLOR_SCHEMES = [
//   {
//     border: "border-l-emerald-500",
//     bg: "bg-emerald-50/50",
//     text: "text-emerald-700",
//     progress: "bg-emerald-500",
//     progressBg: "bg-emerald-100",
//     label: "text-emerald-600"
//   },
//   {
//     border: "border-l-amber-500",
//     bg: "bg-amber-50/50",
//     text: "text-amber-700",
//     progress: "bg-amber-500",
//     progressBg: "bg-amber-100",
//     label: "text-amber-600"
//   },
//   {
//     border: "border-l-rose-500",
//     bg: "bg-rose-50/50",
//     text: "text-rose-700",
//     progress: "bg-rose-500",
//     progressBg: "bg-rose-100",
//     label: "text-rose-600"
//   },
//   {
//     border: "border-l-blue-500",
//     bg: "bg-blue-50/50",
//     text: "text-blue-700",
//     progress: "bg-blue-500",
//     progressBg: "bg-blue-100",
//     label: "text-blue-600"
//   },
//   {
//     border: "border-l-purple-500",
//     bg: "bg-purple-50/50",
//     text: "text-purple-700",
//     progress: "bg-purple-500",
//     progressBg: "bg-purple-100",
//     label: "text-purple-600"
//   },
//   {
//     border: "border-l-teal-500",
//     bg: "bg-teal-50/50",
//     text: "text-teal-700",
//     progress: "bg-teal-500",
//     progressBg: "bg-teal-100",
//     label: "text-teal-600"
//   },
//   {
//     border: "border-l-indigo-500",
//     bg: "bg-indigo-50/50",
//     text: "text-indigo-700",
//     progress: "bg-indigo-500",
//     progressBg: "bg-indigo-100",
//     label: "text-indigo-600"
//   },
//   {
//     border: "border-l-pink-500",
//     bg: "bg-pink-50/50",
//     text: "text-pink-700",
//     progress: "bg-pink-500",
//     progressBg: "bg-pink-100",
//     label: "text-pink-600"
//   },
//   {
//     border: "border-l-cyan-500",
//     bg: "bg-cyan-50/50",
//     text: "text-cyan-700",
//     progress: "bg-cyan-500",
//     progressBg: "bg-cyan-100",
//     label: "text-cyan-600"
//   },
//   {
//     border: "border-l-orange-500",
//     bg: "bg-orange-50/50",
//     text: "text-orange-700",
//     progress: "bg-orange-500",
//     progressBg: "bg-orange-100",
//     label: "text-orange-600"
//   }
// ]

// const CategoryCardCompact = ({ item, index, onClick }) => {
//   console.log(item)
//   const colorScheme = COLOR_SCHEMES[index % COLOR_SCHEMES.length]

//   const achieved = item?.achievedamount || 0
//   const target = item?.targetamount || 0
//   const percentage = target > 0 ? Math.min((achieved / target) * 100, 100) : 0
//   console.log(target)
//   console.log(achieved)
//   console.log(percentage)
//   // Calculate trend (you can pass this from backend)
//   const previousAchieved = item?.previousAchieved || 0
//   const change = achieved - previousAchieved
//   console.log(change)
//   const changePercentage =
//     previousAchieved > 0 ? ((change / previousAchieved) * 100).toFixed(2) : 0

//   const getTrendIcon = () => {
//     if (changePercentage > 0) return <TrendingUp size={16} strokeWidth={2.5} />
//     if (changePercentage < 0)
//       return <TrendingDown size={16} strokeWidth={2.5} />
//     return <Minus size={16} strokeWidth={2.5} />
//   }

//   const getTrendColor = () => {
//     if (changePercentage > 0) return "text-emerald-600"
//     if (changePercentage < 0) return "text-rose-600"
//     return "text-slate-600"
//   }
//   const formatAmount = (num) => {
//     if (num >= 10000000) return (num / 10000000).toFixed(1) + "Cr" // Crore
//     if (num >= 100000) return (num / 100000).toFixed(1) + "L" // Lakh
//     if (num >= 1000) return (num / 1000).toFixed(1) + "k" // Thousand
//     return num.toString()
//   }

//   return (
//     <div
//       onClick={() => onClick(item.categoryId, item.categoryName)}
//       className={`
//         ${colorScheme.bg} ${colorScheme.border}
//         bg-white border-l-4 rounded-lg p-3 cursor-pointer
//         transition-all duration-200 hover:shadow-md hover:translate-x-1
//         active:scale-[0.98]
//       `}
//     >
//       <div className="flex justify-between">
//         {/* Category Name */}
//         <h4
//           className={`text-md font-semibold ${colorScheme.text}  leading-tight`}
//         >
//           {item?.categoryName}
//         </h4>
//         <p
//           className={`text-md font-bold text-end ${colorScheme.text} leading-none`}
//         >
//           {formatAmount(achieved)}
//         </p>
//       </div>

//       {/* Achievement Value */}
//       <div className="mb-2">
//         <p className="text-[10px] text-black ">
//           of {target.toLocaleString()} target
//         </p>
//       </div>

//       {/* Horizontal Progress Bar */}
//       <div className="space-y-1">
//         <div
//           className={`w-full h-1.5 ${colorScheme.progressBg} rounded-full overflow-hidden`}
//         >
//           <div
//             className={`h-full ${colorScheme.progress} transition-all duration-500 ease-out rounded-full`}
//             style={{ width: `${percentage}%` }}
//           />
//         </div>

//         {/* Percentage Text */}
//         <div className="flex items-center justify-between">
//           <span className="text-[10px] text-black font-medium">
//             {percentage.toFixed(1)}% Complete
//           </span>
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
//   return (
//     <div
//       className={`
//         min-h-0 flex-1 overflow-y-auto px-3 py-1
//         ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
//         transition-opacity duration-150
//       `}
//     >
//       <div className="space-y-2.5">
//         {categorylist && categorylist.length > 0 ? (
//           categorylist.map((item, index) => (
//             <CategoryCardCompact
//               key={`${item.categoryName}-${index}`}
//               item={item}
//               index={index}
//               onClick={handleMoreClick}
//             />
//           ))
//         ) : (
//           <div className="text-center py-8">
//             <p className="text-sm text-slate-500">No categories available</p>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default CategoryListIconFirst
// import React from "react"

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
//     if (num >= 10000000) return (num / 10000000).toFixed(1) + "Cr"
//     if (num >= 100000) return (num / 100000).toFixed(1) + "L"
//     if (num >= 1000) return (num / 1000).toFixed(1) + "k"
//     return num.toString()
//   }

//   return (
//     <div
//       onClick={() => onClick(item.categoryId, item.categoryName)}
//       className={`
//         ${colorScheme.border}
//         rounded-xl border border-slate-200 border-l-4 bg-white p-3
//         cursor-pointer shadow-sm transition-all duration-200
//         hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]
//       `}
//     >
//       <div className="flex items-start justify-between gap-2">
//         <h4 className="line-clamp-2 text-[13px] font-semibold leading-4 text-slate-900">
//           {item?.categoryName}
//         </h4>

//         <span
//           className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${colorScheme.badge}`}
//         >
//           {percentage.toFixed(0)}%
//         </span>
//       </div>

//       <div className="mt-2 flex items-end justify-between gap-2">
//         <p className="text-[16px] font-bold leading-none text-slate-900">
//           {formatAmount(achieved)}
//         </p>

//         <p className="text-[10px] text-slate-500">
//           of {target.toLocaleString()} target
//         </p>
//       </div>

//       <div className="mt-2">
//         <div
//           className={`h-1.5 w-full overflow-hidden rounded-full ${colorScheme.progressBg}`}
//         >
//           <div
//             className={`h-full rounded-full ${colorScheme.progress} transition-all duration-500 ease-out`}
//             style={{ width: `${percentage}%` }}
//           />
//         </div>

//         <div className="mt-1 flex items-center justify-between">
//           <span className="text-[10px] font-medium text-slate-600">
//             {percentage.toFixed(1)}% Complete
//           </span>
//           <span className="text-[10px] font-medium text-slate-400">
//             View
//           </span>
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
//   return (
//     <div
//       className={`
//         min-h-0 flex-1 overflow-y-auto px-3 py-1
//         ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
//         transition-opacity duration-150
//       `}
//     >
//       <div className="space-y-2.5">
//         {categorylist && categorylist.length > 0 ? (
//           categorylist.map((item, index) => (
//             <CategoryCardCompact
//               key={`${item.categoryId || item.categoryName}-${index}`}
//               item={item}
//               index={index}
//               onClick={handleMoreClick}
//             />
//           ))
//         ) : (
//           <div className="rounded-xl border border-dashed border-slate-600 bg-white/5 px-3 py-8 text-center">
//             <p className="text-sm text-slate-400">No categories available</p>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default CategoryListIconFirst
import React from "react"

const COLOR_SCHEMES = [
  {
    border: "border-l-emerald-500",
    progress: "bg-emerald-500",
    progressBg: "bg-emerald-100",
    badge: "text-emerald-700 bg-emerald-50"
  },
  {
    border: "border-l-blue-500",
    progress: "bg-blue-500",
    progressBg: "bg-blue-100",
    badge: "text-blue-700 bg-blue-50"
  },
  {
    border: "border-l-violet-500",
    progress: "bg-violet-500",
    progressBg: "bg-violet-100",
    badge: "text-violet-700 bg-violet-50"
  },
  {
    border: "border-l-amber-500",
    progress: "bg-amber-500",
    progressBg: "bg-amber-100",
    badge: "text-amber-700 bg-amber-50"
  },
  {
    border: "border-l-rose-500",
    progress: "bg-rose-500",
    progressBg: "bg-rose-100",
    badge: "text-rose-700 bg-rose-50"
  }
]

const CategoryCardCompact = ({ item, index, onClick }) => {
  const colorScheme = COLOR_SCHEMES[index % COLOR_SCHEMES.length]

  const achieved = Number(item?.achievedamount || 0)
  const target = Number(item?.targetamount || 0)
  const percentage = target > 0 ? Math.min((achieved / target) * 100, 100) : 0

  const formatAmount = (num) => {
    if (num >= 10000000) return (num / 10000000).toFixed(1) + "Cr"
    if (num >= 100000) return (num / 100000).toFixed(1) + "L"
    if (num >= 1000) return (num / 1000).toFixed(1) + "k"
    return num.toString()
  }

  return (
    <div
      onClick={() => onClick(item.categoryId, item.categoryName)}
      className={`
        ${colorScheme.border}
        rounded-lg border border-slate-200 border-l-[3px] bg-white px-3 py-2
        cursor-pointer shadow-sm transition-all duration-150
        hover:shadow-md hover:-translate-y-[1px] active:scale-[0.99]
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="line-clamp-1 text-[12px] font-semibold leading-4 text-slate-900">
          {item?.categoryName}
        </h4>

        <span
          className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${colorScheme.badge}`}
        >
          {percentage.toFixed(0)}%
        </span>
      </div>

      <div className="mt-1 flex items-end justify-between ">
        <p className="text-[13px] font-bold leading-none text-slate-900">
          {formatAmount(achieved)}
        </p>

        <p className="text-[12px] font-bold text-slate-900">/ {formatAmount(target)}</p>
      </div>

      <div className="mt-1.5">
        <div
          className={`h-1.5 w-full overflow-hidden rounded-full ${colorScheme.progressBg}`}
        >
          <div
            className={`h-full rounded-full ${colorScheme.progress} transition-all duration-500 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>

       
      </div>
    </div>
  )
}

const CategoryListIconFirst = ({
  categorylist,
  handleMoreClick,
  sidebarOpen
}) => {
  return (
    <div
      className={`
        min-h-0 flex-1 overflow-y-auto px-2 py-1
        ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        transition-opacity duration-150
      `}
    >
      <div className="space-y-2">
        {categorylist && categorylist.length > 0 ? (
          categorylist.map((item, index) => (
            <CategoryCardCompact
              key={`${item.categoryId || item.categoryName}-${index}`}
              item={item}
              index={index}
              onClick={handleMoreClick}
            />
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-slate-500/50 bg-white/5 px-3 py-6 text-center">
            <p className="text-[12px] text-slate-400">
              No categories available
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryListIconFirst
