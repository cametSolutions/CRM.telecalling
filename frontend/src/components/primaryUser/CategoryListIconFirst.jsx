

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
