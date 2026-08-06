
import { useEffect, useMemo, useState } from "react"
import { Search, TrendingUp } from "lucide-react"
import { useSelector } from "react-redux"
import IncentiveLeadsModal from "./IncentiveLeadsModal"

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
]

export default function IncentiveReport({
  loggedUser,
  fetchIncentiveSummary,
  fetchUserAllocationBreakdown,
  fetchIncentiveLeads
}) {
  const loggeduser = useSelector((state) => state.auth.user)
  const isAdmin = loggeduser?.role === "Admin"

  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [branchId, setBranchId] = useState("all")
  const [search, setSearch] = useState("")

  const [loading, setLoading] = useState(true)
  const [branches, setBranches] = useState([])

  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedAllocation, setSelectedAllocation] = useState(null)
  const [showLeadsModal, setShowLeadsModal] = useState(false)

  const years = useMemo(() => {
    const y = now.getFullYear()
    return [y - 1, y, y + 1]
  }, [])

  // Demo data for layout (replace with `branches` from API later)
  const staticBranches = [
    {
      branchId: "1",
      branchName: "CAMET",
      users: [
        {
          userId: "u1",
          name: "Preetha K.P",
          designation: "General Manager",
          allocations: [
            { key: "coding", label: "Coding", achieved: 4500 },
            { key: "implementation", label: "Implementation", achieved: 3200 },
            { key: "testing", label: "Testing", achieved: 0 },
            { key: "qc", label: "QC", achieved: 1800 },
            { key: "lead", label: "Lead", achieved: 6000 },
            { key: "closing", label: "Closing", achieved: 2000 }
          ]
        },
        {
          userId: "u2",
          name: "Sreeraj Vijay",
          designation: "Programmer",
          allocations: [
            { key: "coding", label: "Coding", achieved: 9000 },
            { key: "implementation", label: "Implementation", achieved: 0 },
            { key: "testing", label: "Testing", achieved: 1500 },
            { key: "qc", label: "QC", achieved: 0 },
            { key: "lead", label: "Lead", achieved: 0 },
            { key: "closing", label: "Closing", achieved: 0 }
          ]
        },
        {
          userId: "u3",
          name: "Ruksana Kasim",
          designation: "Programmer",
          allocations: [
            { key: "coding", label: "Coding", achieved: 5200 },
            { key: "implementation", label: "Implementation", achieved: 2800 },
            { key: "testing", label: "Testing", achieved: 0 },
            { key: "qc", label: "QC", achieved: 0 },
            { key: "lead", label: "Lead", achieved: 0 },
            { key: "closing", label: "Closing", achieved: 0 }
          ]
        }
      ]
    }
  ]

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetchIncentiveSummary({
          branchId: isAdmin ? branchId : loggedUser?.branch?._id,
          month,
          year,
          search
        })
        if (active) setBranches(res?.branches || [])
      } catch (e) {
        console.log(e)
      } finally {
        if (active) setLoading(false)
      }
    }
    // TODO: use API branches; for now, demo uses staticBranches
    // load()
    setLoading(false)
    return () => {
      active = false
    }
  }, [branchId, month, year, search, isAdmin, loggedUser])

  const handleOpenAllocation = (user, allocation) => {
    setSelectedUser(user)
    setSelectedAllocation(allocation)
    setShowLeadsModal(true)
  }

  return (
    <div className="h-full flex flex-col bg-[#ADD8E6] p-3">
      {/* Header */}
      <div className="flex-shrink-0 px-4 sm:px-6 py-5 border-b border-gray-100 bg-white rounded-lg mb-1">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Incentive Report</h1>
              <p className="text-xs text-gray-500">
                {isAdmin ? "Staff-wise achievement" : "Your branch achievement"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search staff..."
                className="pl-9 pr-3 py-2 w-48 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            {/* Month/year/branch selectors can be re-enabled later */}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 bg-white rounded-lg">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : staticBranches.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-sm font-medium">No incentive data found</p>
          </div>
        ) : (
          staticBranches.map((branch) => {
            const firstUser = branch.users?.[0]
            const columns = firstUser?.allocations || []

            return (
              <div key={branch.branchId} className="mb-6">
                {/* Branch header */}
                {isAdmin && (
                  <div className="flex items-center justify-between px-3 mb-1">
                    <h2 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      {branch.branchName}
                    </h2>
                    <span className="text-[11px] text-gray-400 font-medium">
                      {branch.users.length} staff
                    </span>
                  </div>
                )}

                <div className="rounded-xl border border-gray-100 bg-white">
                  {/* Header row: staff + allocation types + total */}
                  <div className="flex items-center px-3 py-2 bg-blue-50 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    <div className="w-56 flex-shrink-0">Staff</div>
                    <div className="flex-1 flex">
                      {columns.map((col) => (
                        <div
                          key={col.key}
                          className="flex-1 min-w-[90px] text-xs text-gray-500"
                        >
                          {col.label}
                        </div>
                      ))}
                    </div>
                    <div className="w-24 flex-shrink-0 text-right text-xs text-gray-500">
                      Total
                    </div>
                  </div>

                  {/* Body rows */}
                  {branch.users.map((user) => {
                    const total = user.allocations.reduce(
                      (sum, a) => sum + (a.achieved || 0),
                      0
                    )

                    return (
                      <div
                        key={user.userId}
                        className="w-full px-3 py-2 flex items-center gap-3 border-t border-gray-50 hover:bg-blue-50 transition-colors"
                      >
                        {/* Staff column */}
                        <div className="flex items-center gap-2 min-w-0 w-56 flex-shrink-0">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
                            {user.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-900 truncate">
                              {user.name}
                            </p>
                            <p className="text-[10px] text-gray-400 truncate">
                              {user.designation}
                            </p>
                          </div>
                        </div>

                        {/* Allocation columns */}
                        <div className="flex-1 flex">
                          {columns.map((col) => {
                            const alloc = user.allocations.find(
                              (a) => a.key === col.key
                            )
                            const value = alloc?.achieved || 0

                            return (
                              <button
                                key={col.key}
                                type="button"
                                onClick={() => handleOpenAllocation(user, alloc)}
                                className="flex-1 min-w-[90px] text-left text-xs text-gray-900 hover:text-blue-700"
                              >
                                {value > 0 ? `₹${value.toLocaleString()}` : "0"}
                              </button>
                            )
                          })}
                        </div>

                        {/* Total column */}
                        <div className="w-24 flex-shrink-0 text-right">
                          <p className="text-[10px] font-semibold text-gray-400 uppercase">
                            Total
                          </p>
                          <p className="text-sm font-bold text-gray-900">
                            ₹{total.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Leads modal */}
      {showLeadsModal && selectedUser && selectedAllocation && (
        <IncentiveLeadsModal
          user={selectedUser}
          allocation={selectedAllocation}
          month={month}
          year={year}
          monthLabel={MONTHS[month - 1]}
          fetchIncentiveLeads={fetchIncentiveLeads}
          onClose={() => setShowLeadsModal(false)}
        />
      )}
    </div>
  )
}
