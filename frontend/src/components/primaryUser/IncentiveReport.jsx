
// import { useEffect, useMemo, useState } from "react"
// import { Search, TrendingUp } from "lucide-react"
// import { useSelector } from "react-redux"
// import IncentiveLeadsModal from "./IncentiveLeadsModal"

// const MONTHS = [
//   "January",
//   "February",
//   "March",
//   "April",
//   "May",
//   "June",
//   "July",
//   "August",
//   "September",
//   "October",
//   "November",
//   "December"
// ]

// export default function IncentiveReport({
//   loggedUser,
//   fetchIncentiveSummary,
//   fetchUserAllocationBreakdown,
//   fetchIncentiveLeads
// }) {
//   const loggeduser = useSelector((state) => state.auth.user)
//   const isAdmin = loggeduser?.role === "Admin"

//   const now = new Date()
//   const [month, setMonth] = useState(now.getMonth() + 1)
//   const [year, setYear] = useState(now.getFullYear())
//   const [branchId, setBranchId] = useState("all")
//   const [search, setSearch] = useState("")

//   const [loading, setLoading] = useState(true)
//   const [branches, setBranches] = useState([])

//   const [selectedUser, setSelectedUser] = useState(null)
//   const [selectedAllocation, setSelectedAllocation] = useState(null)
//   const [showLeadsModal, setShowLeadsModal] = useState(false)

//   const years = useMemo(() => {
//     const y = now.getFullYear()
//     return [y - 1, y, y + 1]
//   }, [])

//   // Demo data for layout (replace with `branches` from API later)
//   const staticBranches = [
//     {
//       branchId: "1",
//       branchName: "CAMET",
//       users: [
//         {
//           userId: "u1",
//           name: "Preetha K.P",
//           designation: "General Manager",
//           allocations: [
//             { key: "coding", label: "Coding", achieved: 4500 },
//             { key: "implementation", label: "Implementation", achieved: 3200 },
//             { key: "testing", label: "Testing", achieved: 0 },
//             { key: "qc", label: "QC", achieved: 1800 },
//             { key: "lead", label: "Lead", achieved: 6000 },
//             { key: "closing", label: "Closing", achieved: 2000 }
//           ]
//         },
//         {
//           userId: "u2",
//           name: "Sreeraj Vijay",
//           designation: "Programmer",
//           allocations: [
//             { key: "coding", label: "Coding", achieved: 9000 },
//             { key: "implementation", label: "Implementation", achieved: 0 },
//             { key: "testing", label: "Testing", achieved: 1500 },
//             { key: "qc", label: "QC", achieved: 0 },
//             { key: "lead", label: "Lead", achieved: 0 },
//             { key: "closing", label: "Closing", achieved: 0 }
//           ]
//         },
//         {
//           userId: "u3",
//           name: "Ruksana Kasim",
//           designation: "Programmer",
//           allocations: [
//             { key: "coding", label: "Coding", achieved: 5200 },
//             { key: "implementation", label: "Implementation", achieved: 2800 },
//             { key: "testing", label: "Testing", achieved: 0 },
//             { key: "qc", label: "QC", achieved: 0 },
//             { key: "lead", label: "Lead", achieved: 0 },
//             { key: "closing", label: "Closing", achieved: 0 }
//           ]
//         },
//  {
//           userId: "u3",
//           name: "Ruksana Kasim",
//           designation: "Programmer",
//           allocations: [
//             { key: "coding", label: "Coding", achieved: 5200 },
//             { key: "implementation", label: "Implementation", achieved: 2800 },
//             { key: "testing", label: "Testing", achieved: 0 },
//             { key: "qc", label: "QC", achieved: 0 },
//             { key: "lead", label: "Lead", achieved: 0 },
//             { key: "closing", label: "Closing", achieved: 0 }
//           ]
//         },
//  {
//           userId: "u3",
//           name: "Ruksana Kasim",
//           designation: "Programmer",
//           allocations: [
//             { key: "coding", label: "Coding", achieved: 5200 },
//             { key: "implementation", label: "Implementation", achieved: 2800 },
//             { key: "testing", label: "Testing", achieved: 0 },
//             { key: "qc", label: "QC", achieved: 0 },
//             { key: "lead", label: "Lead", achieved: 0 },
//             { key: "closing", label: "Closing", achieved: 0 }
//           ]
//         },
//  {
//           userId: "u3",
//           name: "Ruksana Kasim",
//           designation: "Programmer",
//           allocations: [
//             { key: "coding", label: "Coding", achieved: 5200 },
//             { key: "implementation", label: "Implementation", achieved: 2800 },
//             { key: "testing", label: "Testing", achieved: 0 },
//             { key: "qc", label: "QC", achieved: 0 },
//             { key: "lead", label: "Lead", achieved: 0 },
//             { key: "closing", label: "Closing", achieved: 0 }
//           ]
//         },

//       ]
//     }
//   ]

//   useEffect(() => {
//     let active = true
//     const load = async () => {
//       setLoading(true)
//       try {
//         const res = await fetchIncentiveSummary({
//           branchId: isAdmin ? branchId : loggedUser?.branch?._id,
//           month,
//           year,
//           search
//         })
//         if (active) setBranches(res?.branches || [])
//       } catch (e) {
//         console.log(e)
//       } finally {
//         if (active) setLoading(false)
//       }
//     }
//     // TODO: use API branches; for now, demo uses staticBranches
//     // load()
//     setLoading(false)
//     return () => {
//       active = false
//     }
//   }, [branchId, month, year, search, isAdmin, loggedUser])

//   const handleOpenAllocation = (user, allocation) => {
//     setSelectedUser(user)
//     setSelectedAllocation(allocation)
//     setShowLeadsModal(true)
//   }

//   return (
//     <div className="h-full flex flex-col bg-[#ADD8E6] p-3">
//       {/* Header */}
//       <div className="flex-shrink-0 px-4 sm:px-6 py-5 border-b border-gray-100 bg-white rounded-lg mb-1">
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center">
//               <TrendingUp className="w-5 h-5 text-blue-600" />
//             </div>
//             <div>
//               <h1 className="text-xl font-bold text-gray-900">Incentive Report</h1>
//               <p className="text-xs text-gray-500">
//                 {isAdmin ? "Staff-wise achievement" : "Your branch achievement"}
//               </p>
//             </div>
//           </div>

//           <div className="flex flex-wrap items-center gap-2">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <input
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search staff..."
//                 className="pl-9 pr-3 py-2 w-48 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>
//             {/* Month/year/branch selectors can be re-enabled later */}
//           </div>
//         </div>
//       </div>

//       {/* Body */}
//       <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 bg-white rounded-lg">
//         {loading ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {Array.from({ length: 6 }).map((_, i) => (
//               <div key={i} className="h-28 rounded-2xl bg-gray-100 animate-pulse" />
//             ))}
//           </div>
//         ) : staticBranches.length === 0 ? (
//           <div className="text-center py-20 text-gray-400">
//             <p className="text-sm font-medium">No incentive data found</p>
//           </div>
//         ) : (
//           staticBranches.map((branch) => {
//             const firstUser = branch.users?.[0]
//             const columns = firstUser?.allocations || []

//             return (
//               <div key={branch.branchId} className="mb-6">
//                 {/* Branch header */}
//                 {isAdmin && (
//                   <div className="flex items-center justify-between px-3 mb-1">
//                     <h2 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
//                       {branch.branchName}
//                     </h2>
//                     <span className="text-[11px] text-gray-400 font-medium">
//                       {branch.users.length} staff
//                     </span>
//                   </div>
//                 )}

//                 <div className="rounded-xl border border-gray-100 bg-white">
//                   {/* Header row: staff + allocation types + total */}
//                   <div className="flex items-center px-3 py-2 bg-blue-100 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
//                     <div className="w-56 flex-shrink-0">Staff</div>
//                     <div className="flex-1 flex">
//                       {columns.map((col) => (
//                         <div
//                           key={col.key}
//                           className="flex-1 min-w-[90px] text-xs text-gray-500"
//                         >
//                           {col.label}
//                         </div>
//                       ))}
//                     </div>
//                     <div className="w-24 flex-shrink-0 text-right text-xs text-gray-500">
//                       Total
//                     </div>
//                   </div>

//                   {/* Body rows */}
//                   {branch.users.map((user) => {
//                     const total = user.allocations.reduce(
//                       (sum, a) => sum + (a.achieved || 0),
//                       0
//                     )

//                     return (
//                       <div
//                         key={user.userId}
//                         className="w-full px-3 py-2 flex items-center gap-3 border-t border-gray-50 hover:bg-blue-50 transition-colors"
//                       >
//                         {/* Staff column */}
//                         <div className="flex items-center gap-2 min-w-0 w-56 flex-shrink-0">
//                           <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
//                             {user.name?.charAt(0)?.toUpperCase()}
//                           </div>
//                           <div className="min-w-0">
//                             <p className="text-xs font-semibold text-gray-900 truncate">
//                               {user.name}
//                             </p>
//                             <p className="text-[10px] text-gray-400 truncate">
//                               {user.designation}
//                             </p>
//                           </div>
//                         </div>

//                         {/* Allocation columns */}
//                         <div className="flex-1 flex">
//                           {columns.map((col) => {
//                             const alloc = user.allocations.find(
//                               (a) => a.key === col.key
//                             )
//                             const value = alloc?.achieved || 0

//                             return (
//                               <button
//                                 key={col.key}
//                                 type="button"
//                                 onClick={() => handleOpenAllocation(user, alloc)}
//                                 className="flex-1 min-w-[90px] text-left text-xs text-gray-900 hover:text-blue-700"
//                               >
//                                 {value > 0 ? `₹${value.toLocaleString()}` : "0"}
//                               </button>
//                             )
//                           })}
//                         </div>

//                         {/* Total column */}
//                         <div className="w-24 flex-shrink-0 text-right">
//                           <p className="text-[10px] font-semibold text-gray-400 uppercase">
//                             Total
//                           </p>
//                           <p className="text-sm font-bold text-gray-900">
//                             ₹{total.toLocaleString()}
//                           </p>
//                         </div>
//                       </div>
//                     )
//                   })}
//                 </div>
//               </div>
//             )
//           })
//         )}
//       </div>

//       {/* Leads modal */}
//       {showLeadsModal && selectedUser && selectedAllocation && (
//         <IncentiveLeadsModal
//           user={selectedUser}
//           allocation={selectedAllocation}
//           month={month}
//           year={year}
//           monthLabel={MONTHS[month - 1]}
//           fetchIncentiveLeads={fetchIncentiveLeads}
//           onClose={() => setShowLeadsModal(false)}
//         />
//       )}
//     </div>
//   )
// }


import { useEffect, useMemo, useState } from "react";
import { Search, TrendingUp, Users } from "lucide-react";
import { useSelector } from "react-redux";
import IncentiveLeadsModal from "./IncentiveLeadsModal";

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
  "December",
];

/* Change to false when the real incentive-summary API is ready. */
const USE_DEMO_DATA = true;

const DEMO_BRANCHES = [
  {
    branchId: "demo-branch-1",
    branchName: "CAMET",
    users: [
      {
        userId: "demo-user-1",
        name: "Preetha K.P",
        designation: "General Manager",
        allocations: [
          { key: "coding", label: "Coding", achieved: 4500 },
          { key: "implementation", label: "Implementation", achieved: 3200 },
          { key: "testing", label: "Testing", achieved: 0 },
          { key: "qc", label: "QC", achieved: 1800 },
          { key: "lead", label: "Lead", achieved: 6000 },
          { key: "closing", label: "Closing", achieved: 2000 },
        ],
      },
      {
        userId: "demo-user-2",
        name: "Sreeraj Vijay",
        designation: "Programmer",
        allocations: [
          { key: "coding", label: "Coding", achieved: 9000 },
          { key: "implementation", label: "Implementation", achieved: 0 },
          { key: "testing", label: "Testing", achieved: 1500 },
          { key: "qc", label: "QC", achieved: 0 },
          { key: "lead", label: "Lead", achieved: 0 },
          { key: "closing", label: "Closing", achieved: 0 },
        ],
      },
      {
        userId: "demo-user-3",
        name: "Ruksana Kasim",
        designation: "Programmer",
        allocations: [
          { key: "coding", label: "Coding", achieved: 5200 },
          { key: "implementation", label: "Implementation", achieved: 2800 },
          { key: "testing", label: "Testing", achieved: 0 },
          { key: "qc", label: "QC", achieved: 1200 },
          { key: "lead", label: "Lead", achieved: 0 },
          { key: "closing", label: "Closing", achieved: 3500 },
        ],
      },
      {
        userId: "demo-user-4",
        name: "Abhidas S",
        designation: "Marketing Executive",
        allocations: [
          { key: "coding", label: "Coding", achieved: 0 },
          { key: "implementation", label: "Implementation", achieved: 2500 },
          { key: "testing", label: "Testing", achieved: 0 },
          { key: "qc", label: "QC", achieved: 0 },
          { key: "lead", label: "Lead", achieved: 7400 },
          { key: "closing", label: "Closing", achieved: 9800 },
        ],
      },
    ],
  },
];

const formatAmount = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const getUserTotal = (allocations = []) =>
  allocations.reduce(
    (sum, allocation) => sum + Number(allocation?.achieved || 0),
    0
  );

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "U";

function IncentiveTableSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-gray-100">
      <div className="h-11 bg-blue-100" />
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-[220px_repeat(5,minmax(90px,1fr))_120px] items-center gap-3 border-t border-gray-100 px-4 py-3"
        >
          <div className="h-8 w-40 rounded bg-gray-200" />
          {Array.from({ length: 6 }).map((__, cellIndex) => (
            <div key={cellIndex} className="h-4 rounded bg-gray-100" />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function IncentiveReport({
  loggedUser,
  fetchIncentiveSummary,
  fetchUserAllocationBreakdown,
  fetchIncentiveLeads,
}) {
  const loggeduser = useSelector((state) => state.auth.user);
  const isAdmin = loggeduser?.role === "Admin";

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [branchId, setBranchId] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [branches, setBranches] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedAllocation, setSelectedAllocation] = useState(null);
  const [showLeadsModal, setShowLeadsModal] = useState(false);

  const branchForRequest = isAdmin
    ? branchId
    : loggedUser?.branch?._id || loggeduser?.branch?._id || "all";

  useEffect(() => {
    let active = true;
    let demoTimer = null;

    const load = async () => {
      setLoading(true);
      setError("");

      if (USE_DEMO_DATA) {
        demoTimer = setTimeout(() => {
          if (!active) return;
          setBranches(DEMO_BRANCHES);
          setLoading(false);
        }, 450);

        return;
      }

      if (typeof fetchIncentiveSummary !== "function") {
        if (active) {
          setBranches([]);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetchIncentiveSummary({
          branchId: branchForRequest,
          month,
          year,
          search: search.trim(),
        });

        const fetchedBranches = Array.isArray(response?.branches)
          ? response.branches
          : Array.isArray(response?.data?.branches)
            ? response.data.branches
            : [];

        if (active) setBranches(fetchedBranches);
      } catch (requestError) {
        console.error("Failed to load incentive report:", requestError);

        if (active) {
          setBranches([]);
          setError(
            requestError?.response?.data?.message ||
              requestError?.message ||
              "Unable to load incentive report"
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
      if (demoTimer) clearTimeout(demoTimer);
    };
  }, [branchForRequest, fetchIncentiveSummary, month, search, year]);

  const filteredBranches = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return branches;

    return branches
      .map((branch) => ({
        ...branch,
        users: (branch?.users || []).filter((user) =>
          `${user?.name || ""} ${user?.designation || ""}`
            .toLowerCase()
            .includes(keyword)
        ),
      }))
      .filter((branch) => branch.users.length > 0);
  }, [branches, search]);

  const handleOpenUserLeads = (user) => {
    const total = getUserTotal(user?.allocations);

    setSelectedUser(user);
    setSelectedAllocation({
      key: "all",
      label: "All allocations",
      achieved: total,
      allocations: user?.allocations || [],
    });
    setShowLeadsModal(true);
  };

  const closeLeadsModal = () => {
    setShowLeadsModal(false);
    setSelectedUser(null);
    setSelectedAllocation(null);
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#ADD8E6] p-2 sm:p-3">
      <section className="mb-2 shrink-0 rounded-xl bg-white px-4 py-4 shadow-sm ring-1 ring-black/5 sm:px-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600/10">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <h1 className="text-lg font-bold text-gray-900 sm:text-xl">
                Incentive Report
              </h1>
              <p className="text-xs text-gray-500">
                {isAdmin ? "Staff-wise achievement" : "Your branch achievement"}
                <span className="mx-1.5 text-gray-300">•</span>
                {MONTHS[month - 1]} {year}
              </p>
            </div>
          </div>

          <div className="relative w-full sm:w-56 lg:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search staff..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
      </section>

      <main className="min-h-0 flex-1 overflow-y-auto rounded-xl bg-white p-3 shadow-sm ring-1 ring-black/5 sm:p-4">
        {loading ? (
          <IncentiveTableSkeleton />
        ) : error ? (
          <div className="grid min-h-56 place-items-center rounded-xl border border-dashed border-red-200 bg-red-50 px-4 text-center">
            <div>
              <p className="text-sm font-semibold text-red-700">
                Failed to load incentive report
              </p>
              <p className="mt-1 text-xs text-red-500">{error}</p>
            </div>
          </div>
        ) : filteredBranches.length === 0 ? (
          <div className="grid min-h-56 place-items-center rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 text-center">
            <div>
              <Users className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-2 text-sm font-semibold text-gray-600">
                No incentive data found
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Try changing the selected month, branch, or staff search.
              </p>
            </div>
          </div>
        ) : (
          filteredBranches.map((branch) => {
            const users = Array.isArray(branch?.users) ? branch.users : [];
            const columns = users[0]?.allocations || [];

            return (
              <section key={branch.branchId} className="mb-5 last:mb-0">
                {isAdmin && (
                  <div className="mb-2 flex items-center justify-between px-1">
                    <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-700">
                      {branch.branchName || "Unnamed branch"}
                    </h2>
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
                      {users.length} staff
                    </span>
                  </div>
                )}

                <div className="space-y-2 lg:hidden">
                  {users.map((user) => {
                    const total = getUserTotal(user?.allocations);

                    return (
                      <button
                        key={user.userId}
                        type="button"
                        onClick={() => handleOpenUserLeads(user)}
                        className="w-full rounded-xl border border-gray-200 bg-white p-3 text-left shadow-sm transition hover:border-blue-300 hover:bg-blue-50/40 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2.5">
                            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-[10px] font-bold text-white">
                              {getInitials(user?.name)}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-gray-900">
                                {user?.name || "—"}
                              </p>
                              <p className="truncate text-[11px] text-gray-400">
                                {user?.designation || "—"}
                              </p>
                            </div>
                          </div>

                          <p className="shrink-0 text-sm font-bold text-gray-900">
                            {formatAmount(total)}
                          </p>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-gray-100 pt-3">
                          {columns.map((column) => {
                            const allocation = user?.allocations?.find(
                              (item) => item.key === column.key
                            );

                            return (
                              <div key={column.key} className="min-w-0">
                                <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                                  {column.label}
                                </p>
                                <p className="mt-0.5 text-center text-xs font-semibold text-gray-700">
                                  {formatAmount(allocation?.achieved)}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="hidden overflow-x-auto rounded-xl border border-gray-200 lg:block">
                  <table className="w-full min-w-[860px] table-fixed border-collapse text-sm">
                    <thead className="bg-blue-100 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                      <tr>
                        <th className="w-56 px-4 py-3 text-left">Staff</th>
                        {columns.map((column) => (
                          <th
                            key={column.key}
                            className="min-w-[90px] px-2 py-3 text-center"
                          >
                            {column.label}
                          </th>
                        ))}
                        <th className="w-28 px-4 py-3 text-right">Amount</th>
                      </tr>
                    </thead>

                    <tbody>
                      {users.map((user) => {
                        const total = getUserTotal(user?.allocations);

                        return (
                          <tr
                            key={user.userId}
                            role="button"
                            tabIndex={0}
                            onClick={() => handleOpenUserLeads(user)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                handleOpenUserLeads(user);
                              }
                            }}
                            className="cursor-pointer border-t border-gray-100 bg-white transition-colors hover:bg-blue-50/70 focus:bg-blue-50/70 focus:outline-none"
                          >
                            <td className="px-4 py-3">
                              <div className="flex min-w-0 items-center gap-2.5">
                                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-[10px] font-bold text-white">
                                  {getInitials(user?.name)}
                                </div>
                                <div className="min-w-0">
                                  <p className="truncate text-xs font-semibold text-gray-900">
                                    {user?.name || "—"}
                                  </p>
                                  <p className="truncate text-[10px] text-gray-400">
                                    {user?.designation || "—"}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {columns.map((column) => {
                              const allocation = user?.allocations?.find(
                                (item) => item.key === column.key
                              );

                              return (
                                <td
                                  key={column.key}
                                  className="px-2 py-3 text-center text-xs font-semibold text-gray-700"
                                >
                                  {formatAmount(allocation?.achieved)}
                                </td>
                              );
                            })}

                            <td className="px-4 py-3 text-right text-sm font-bold text-gray-900">
                              {formatAmount(total)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            );
          })
        )}
      </main>

      {showLeadsModal && selectedUser && selectedAllocation && (
        <IncentiveLeadsModal
          user={selectedUser}
          allocation={selectedAllocation}
          month={month}
          year={year}
          monthLabel={MONTHS[month - 1]}
          fetchIncentiveSummary={fetchIncentiveSummary}
          fetchUserAllocationBreakdown={fetchUserAllocationBreakdown}
          fetchIncentiveLeads={fetchIncentiveLeads}
          onClose={closeLeadsModal}
        />
      )}
    </div>
  );
}