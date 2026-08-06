import { useEffect, useState } from "react"
import { X, ChevronRight, Target, Award } from "lucide-react"
import IncentiveLeadsModal from "./IncentiveLeadsModal"

// Default static allocation categories shown before real data loads / as fallback
const DEFAULT_ALLOCATION_TYPES = [
  { key: "new_registration", label: "New Registration" },
  { key: "renewal", label: "Renewal" },
  { key: "upsell", label: "Upsell / Cross-sell" },
  { key: "referral", label: "Referral Bonus" }
]

export default function UserIncentiveModal({
  user,
  month,
  year,
  monthLabel,
  fetchUserAllocationBreakdown,
  fetchIncentiveLeads,
  onClose
}) {
  const [loading, setLoading] = useState(true)
  const [allocations, setAllocations] = useState(
    DEFAULT_ALLOCATION_TYPES.map((a) => ({ ...a, target: 0, achieved: 0, count: 0 }))
  )

  const [selectedAllocation, setSelectedAllocation] = useState(null)
  const [showLeadsModal, setShowLeadsModal] = useState(false)

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetchUserAllocationBreakdown({
          userId: user.userId,
          month,
          year
        })
        if (active && Array.isArray(res) && res.length > 0) {
          setAllocations(res)
        }
      } catch (e) {
        console.log(e)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [user, month, year])

  const totalAchieved = allocations.reduce((sum, a) => sum + (a.achieved || 0), 0)

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[88vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-white font-bold flex-shrink-0">
                {user.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-bold text-white truncate">{user.name}</h2>
                <p className="text-xs text-blue-100">{monthLabel} {year}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/90 hover:text-white hover:bg-white/15 rounded-full p-1.5 transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2.5 w-fit">
            <Award className="w-4 h-4 text-white" />
            <span className="text-xs text-blue-100 font-medium">Total Achieved</span>
            <span className="text-sm font-bold text-white ml-1">
              ₹{totalAchieved.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />
            ))
          ) : (
            allocations.map((alloc) => {
              const pct = alloc.target
                ? Math.min(100, Math.round((alloc.achieved / alloc.target) * 100))
                : 0
              return (
                <button
                  key={alloc.key}
                  onClick={() => {
                    setSelectedAllocation(alloc)
                    setShowLeadsModal(true)
                  }}
                  className="w-full text-left bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 rounded-xl px-4 py-3.5 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                        {alloc.label}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {alloc.count || 0} leads
                        </span>
                        {alloc.target > 0 && (
                          <span className="text-xs text-gray-400">
                            Target ₹{alloc.target.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-sm font-bold text-gray-900">
                        ₹{Number(alloc.achieved || 0).toLocaleString()}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>

                  {alloc.target > 0 && (
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mt-2.5">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  )}
                </button>
              )
            })
          )}
        </div>
      </div>

      {showLeadsModal && selectedAllocation && (
        <IncentiveLeadsModal
          user={user}
          allocation={selectedAllocation}
          month={month}
          year={year}
          monthLabel={monthLabel}
          fetchIncentiveLeads={fetchIncentiveLeads}
          onClose={() => setShowLeadsModal(false)}
        />
      )}
    </div>
  )
}