
import { useEffect, useState } from "react"
import { FancySelect } from "../common/FancySelect"

export function PerformanceModal({
  modalOpen,
setSelectedMonth,
setSelectedYear,
  productlist,
  onClose,
  summary,
  products,
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  targetData,
  loggedUser,
  category,
  handleSelectedUser,
  selectedUser
}) {
  console.log(loggedUser)
  console.log(selectedUser)
  if (!modalOpen) return null

  const { target, achieved, balance } = summary || {}
  const [activeUserId, setActiveUserId] = useState(loggedUser._id)
  const [activeMetric, setActiveMetric] = useState("achieved")
  const [allusersData, setallusersData] = useState([])

  const monthOptions = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" }
  ]

  const yearOptions = Array.from({ length: 6 }, (_, i) => {
    const year = new Date().getFullYear() - i
    return { value: String(year), label: String(year) }
  })

  useEffect(() => {
    handleMetricTab("achieved")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetData, category])

  const getActiveLabel = () => {
    if (activeMetric === "target") return "Target"
    if (activeMetric === "balance") return "Balance"
    return "Achieved"
  }

  const handleMetricTab = (tab) => {
    setActiveMetric(tab)

    const result =
      targetData
        ?.filter((user) =>
          user.categories?.some(
            (cat) => String(cat.categoryId) === String(category.Id)
          )
        )
        .map((user) => {
          const matchedCategory = user.categories.find(
            (cat) => String(cat.categoryId) === String(category.Id)
          )

          return {
            userId: user.userId,
            userName: user.userName,
            amount:
              tab === "achieved"
                ? Number(matchedCategory?.achieved || 0)
                : tab === "balance"
                  ? matchedCategory.achieved > matchedCategory.target
                    ? 0
                    : Number(matchedCategory?.balance || 0)
                  : Number(matchedCategory?.target || 0)
          }
        }) || []

    setallusersData(result)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-3 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-2xl bg-slate-50 shadow-2xl ring-1 ring-slate-900/10 ">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Performance Summary{" "}
              <span className="text-slate-500">
                ({category?.categoryName?.toUpperCase() || ""})
              </span>
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Target vs Achieved with product-wise breakdown
            </p>
          </div>

          <div className="flex flex-wrap items-end gap-2">
            <FancySelect
              label="Month"
              value={selectedMonth}
              options={monthOptions}
              onChange={onMonthChange}
              width="min-w-[160px]"
            />

            <FancySelect
              label="Year"
              value={selectedYear}
              options={yearOptions}
              onChange={onYearChange}
              width="min-w-[110px]"
            />

            {/* <button
              onClick={onClose}
              className="rounded-full px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100"
            >
              Close
            </button> */}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              Close
            </button>
          </div>
        </div>

        {/* Selected user strip + summary pills */}
        <div className="border-b border-slate-200 bg-slate-100/60 px-5 py-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              {selectedUser || loggedUser?.name || ""}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <SummaryPill
              label="Target"
              value={target}
              tone="slate"
              active={activeMetric === "target"}
              onClick={() => handleMetricTab("target")}
            />
            <SummaryPill
              label="Achieved"
              value={achieved}
              tone="emerald"
              active={activeMetric === "achieved"}
              onClick={() => handleMetricTab("achieved")}
            />
            <SummaryPill
              label="Balance"
              value={balance}
              tone="amber"
              active={activeMetric === "balance"}
              onClick={() => handleMetricTab("balance")}
            />
          </div>
        </div>

        {/* User summary table */}
        {activeMetric && allusersData?.length > 0 && (
          <>
            <div className="px-5 pt-3">
              <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {getActiveLabel()} – Summary (All Users)
              </div>
            </div>

            <div className="px-5 pb-3 pt-2">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <table className="min-w-full border-collapse text-xs">
                  <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-3 py-2 text-left">Name</th>
                      <th className="px-3 py-2 text-right">
                        {getActiveLabel()} Amount
                      </th>
                    
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 bg-white">
                    {allusersData.map((item, index) => {
                      const isActive =
                        String(activeUserId) === String(item.userId)

                      return (
                        <tr
                          key={item.userId || index}
                          onClick={() => {
                            setActiveUserId(item.userId)
                            handleSelectedUser(
                              category,
                              item.userId,
                              item.userName
                            )
                          }}
                          className={`cursor-pointer transition-colors ${
                            isActive ? "bg-blue-100" : "hover:bg-blue-200"
                            // isActive
                            //   ? "bg-emerald-50/60"
                            //   : "hover:bg-slate-50/80"
                          }`}
                        >
                          <td
                            className={`px-3 py-2 text-[12px] font-semibold ${
                              isActive
                                ? "border-l-2 border-emerald-500 text-emerald-900"
                                : "text-slate-800"
                            }`}
                          >
                            {item?.userName?.toUpperCase()}
                          </td>

                          <td className="px-3 py-2 text-right text-[12px] font-semibold text-slate-900">
                            ₹{Number(item?.amount || 0).toLocaleString("en-IN")}
                          </td>

                       
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Product-wise table for selected user */}
        {/* {activeMetric && (
          <div className="px-5 pb-4 pt-2">
            <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {`Product-wise Report – ${
                selectedUser?.toUpperCase() ||
                loggedUser?.name?.toUpperCase() ||
                ""
              }`}
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="max-h-[260px] overflow-auto">
                <table className="min-w-full border-collapse text-xs">
                  <thead className="sticky top-0 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-3 py-2 text-left">Product</th>
                      <th className="px-3 py-2 text-right">Achieved Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {products?.map((p) => (
                      <tr
                        key={p.productname}
                        className="font-semibold transition-colors hover:bg-slate-50/80"
                      >
                        <td className="px-3 py-2 text-[12px] text-slate-700">
                          {p.productname.toUpperCase()}
                        </td>
                        <td className="px-3 py-2 text-right text-[12px] text-slate-900">
                          ₹{Number(p.amount || 0).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}

                    {(!products || products.length === 0) && (
                      <tr>
                        <td
                          colSpan={2}
                          className="px-3 py-6 text-center text-[12px] text-slate-400"
                        >
                          No achieved data available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )} */}
        {activeMetric && (
          <div className="px-5 pb-4 pt-2">
            <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {activeMetric === "target"
                ? `Product List - ${category?.categoryName?.toUpperCase() || ""}`
                : `Product-wise Report - ${
                    selectedUser?.toUpperCase() ||
                    loggedUser?.name?.toUpperCase() ||
                    ""
                  }`}
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              {activeMetric === "target" ? (
                <div className="max-h-[150px] overflow-y-auto px-3 py-3">
                  {productlist?.length > 0 ? (
                    <div className="space-y-2">
                      {productlist.map((product, index) => (
                        <div
                          key={`${product}-${index}`}
                          className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-[12px] font-medium text-slate-700"
                        >
                          {product.toUpperCase()}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-[12px] text-slate-400">
                      No products configured.
                    </div>
                  )}
                </div>
              ) : (
                <div className="max-h-[260px] overflow-auto">
                  <table className="min-w-full border-collapse text-xs">
                    <thead className="sticky top-0 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-3 py-2 text-left">Product</th>
                        <th className="px-3 py-2 text-right">
                          Achieved Amount
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 bg-white">
                      {products?.map((p) => (
                        <tr
                          key={p.productname}
                          className="font-semibold transition-colors hover:bg-slate-50/80"
                        >
                          <td className="px-3 py-2 text-[12px] text-slate-700">
                            {p.productname.toUpperCase()}
                          </td>
                          <td className="px-3 py-2 text-right text-[12px] text-slate-900">
                            ₹{Number(p.amount || 0).toLocaleString("en-IN")}
                          </td>
                        </tr>
                      ))}

                      {(!products || products.length === 0) && (
                        <tr>
                          <td
                            colSpan={2}
                            className="px-3 py-6 text-center text-[12px] text-slate-400"
                          >
                            No achieved data available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SummaryPill({ label, value, tone, active, onClick }) {
  const toneMap = {
    slate: {
      base: "bg-slate-50 text-slate-700 ring-slate-200",
      active:
        "bg-slate-900 text-white ring-slate-900 shadow-sm shadow-slate-300/60"
    },
    emerald: {
      base: "bg-emerald-50 text-emerald-700 ring-emerald-100",
      active:
        "bg-emerald-600 text-white ring-emerald-500 shadow-sm shadow-emerald-300/60"
    },
    amber: {
      base: "bg-amber-50 text-amber-700 ring-amber-100",
      active:
        "bg-amber-500 text-white ring-amber-400 shadow-sm shadow-amber-300/60"
    }
  }

  const styles = toneMap[tone] || toneMap.slate

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group relative flex flex-col justify-between rounded-xl px-4 py-3 text-left ring-1
        transition-all duration-200
        hover:-translate-y-[1px] hover:shadow-md
        ${active ? styles.active : styles.base}
      `}
    >
      <span
        className={`text-[11px] font-medium ${
          active ? "text-white/80" : "text-slate-600"
        }`}
      >
        {label}
      </span>

      <span className="mt-1 text-[15px] font-semibold tracking-tight">
        ₹{Number(value || 0).toLocaleString("en-IN")}
      </span>

      <span
        className={`
          absolute right-3 top-3 h-2 w-2 rounded-full transition-all
          ${
            active
              ? "bg-white/90 shadow-[0_0_0_4px_rgba(255,255,255,0.25)]"
              : "bg-current/20"
          }
        `}
      />
    </button>
  )
}
