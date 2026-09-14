import { useMemo, useState } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown, Pencil, Eye, ChevronLeft, ChevronRight } from "lucide-react";

// ---- Mock data (swap with your real `expiredCustomerList` shape) ----
const MOCK_DATA = [
  { id: 1, customerName: "APPLE BAKERY", mobile: "9895903152", productName: "MARG ERP SILVER", licenseNo: "3347931", amcEnd: "2026-07-05", tuvExpiry: null, licenseExpiry: "2026-07-05", status: "Expired" },
  { id: 2, customerName: "Pittapillil Steels", mobile: "9072445726", productName: "TALLY PRIME SILVER", licenseNo: "715439403", amcEnd: null, tuvExpiry: null, licenseExpiry: "2026-07-31", status: "Expiring Soon" },
  { id: 3, customerName: "Fresh Made", mobile: "7902315978", productName: "TALLY PRIME SILVER", licenseNo: "747798660", amcEnd: null, tuvExpiry: null, licenseExpiry: "2026-07-31", status: "Expiring Soon" },
  { id: 4, customerName: "Buyroot Homeware LLP (Rental) — Kerala Regional Distribution Unit", mobile: "9961633552", productName: "Tally Prime Silver on Rent", licenseNo: "779680845", amcEnd: "2027-02-12", tuvExpiry: null, licenseExpiry: "2026-07-12", status: "Active" },
  { id: 5, customerName: "Greenleaf Traders", mobile: "9847012345", productName: "MARG ERP GOLD", licenseNo: "882910334", amcEnd: "2026-09-18", tuvExpiry: "2026-08-01", licenseExpiry: "2026-09-18", status: "Active" },
  { id: 6, customerName: "Sunrise Motors", mobile: "9744556677", productName: "TALLY PRIME SILVER", licenseNo: "112938475", amcEnd: null, tuvExpiry: null, licenseExpiry: "2026-06-30", status: "Expired" },
  { id: 7, customerName: "Coastal Spices Pvt Ltd", mobile: "9037281910", productName: "MARG ERP SILVER", licenseNo: "556677889", amcEnd: "2026-08-22", tuvExpiry: null, licenseExpiry: "2026-08-22", status: "Active" },
  { id: 8, customerName: "Riverside Furniture", mobile: "8891234567", productName: "TALLY PRIME GOLD", licenseNo: "334455667", amcEnd: null, tuvExpiry: "2026-07-15", licenseExpiry: "2026-07-15", status: "Expiring Soon" },
];

const COLUMNS = [
  { key: "customerName", label: "Customer Name", sortable: true, sticky: true, width: "min-w-[220px] max-w-[220px]" },
  { key: "mobile", label: "Mobile/Phn", sortable: false, width: "min-w-[130px]" },
  { key: "productName", label: "Product Name", sortable: true, width: "min-w-[170px] max-w-[170px]" },
  { key: "licenseNo", label: "License No", sortable: false, width: "min-w-[120px]" },
  { key: "amcEnd", label: "AMC End", sortable: true, width: "min-w-[110px]" },
  { key: "tuvExpiry", label: "TUV Expiry", sortable: true, width: "min-w-[110px]" },
  { key: "licenseExpiry", label: "License Expiry", sortable: true, width: "min-w-[120px]" },
  { key: "status", label: "Status", sortable: true, width: "min-w-[130px]" },
];

const STATUS_STYLES = {
  Active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  "Expiring Soon": "bg-amber-50 text-amber-700 ring-amber-600/20",
  Expired: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

const STATUS_DOT = {
  Active: "bg-emerald-500",
  "Expiring Soon": "bg-amber-500",
  Expired: "bg-rose-500",
};

function formatDate(value) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-GB");
}

function Tooltip({ label, children, width = "max-w-xs" }) {
  return (
    <span className="relative inline-block group/tip">
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute left-1/2 bottom-full z-30 mb-2 -translate-x-1/2 whitespace-normal ${width}
          rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-medium leading-snug text-white shadow-lg
          opacity-0 scale-95 transition-all duration-100 group-hover/tip:opacity-100 group-hover/tip:scale-100`}
      >
        {label}
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
      </span>
    </span>
  );
}

function SortIcon({ active, direction }) {
  if (!active) return <ArrowUpDown className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-400" />;
  return direction === "asc" ? (
    <ArrowUp className="w-3.5 h-3.5 text-teal-600" />
  ) : (
    <ArrowDown className="w-3.5 h-3.5 text-teal-600" />
  );
}

export default function ExpiryRegisterTable({
  data = MOCK_DATA,
  onEdit = (row) => console.log("edit", row),
  onView = (row) => console.log("view", row),
}) {
  const [sort, setSort] = useState({ key: "licenseExpiry", direction: "asc" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const sorted = useMemo(() => {
    const rows = [...data];
    const { key, direction } = sort;
    rows.sort((a, b) => {
      let va = a[key];
      let vb = b[key];
      const isDateCol = ["amcEnd", "tuvExpiry", "licenseExpiry"].includes(key);
      if (isDateCol) {
        va = va ? new Date(va).getTime() : -Infinity;
        vb = vb ? new Date(vb).getTime() : -Infinity;
      } else {
        va = (va ?? "").toString().toLowerCase();
        vb = (vb ?? "").toString().toLowerCase();
      }
      if (va < vb) return direction === "asc" ? -1 : 1;
      if (va > vb) return direction === "asc" ? 1 : -1;
      return 0;
    });
    return rows;
  }, [data, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const clampedPage = Math.min(page, totalPages);
  const start = (clampedPage - 1) * pageSize;
  const pageRows = sorted.slice(start, start + pageSize);

  function toggleSort(key) {
    setSort((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
    setPage(1);
  }

  return (
    <div className="w-full">
      <style>{`
        .ert-scroll::-webkit-scrollbar { height: 8px; width: 8px; }
        .ert-scroll::-webkit-scrollbar-track { background: transparent; }
        .ert-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 9999px; }
        .ert-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="ert-scroll overflow-x-auto overflow-y-auto max-h-[480px]">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="bg-white">
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className={`${col.width} ${col.sticky ? "sticky left-0 z-30 bg-white" : ""}
                      px-4 py-3 whitespace-nowrap border-b border-slate-200 text-left`}
                  >
                    {col.sortable ? (
                      <button
                        onClick={() => toggleSort(col.key)}
                        className="group inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-700 transition-colors"
                      >
                        {col.label}
                        <SortIcon active={sort.key === col.key} direction={sort.direction} />
                      </button>
                    ) : (
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        {col.label}
                      </span>
                    )}
                  </th>
                ))}
                <th
                  scope="col"
                  className="px-4 py-3 whitespace-nowrap border-b border-slate-200 text-center bg-white text-[11px] font-semibold uppercase tracking-wider text-slate-500 min-w-[110px]"
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={COLUMNS.length + 1} className="px-4 py-14 text-center">
                    <div className="flex flex-col items-center gap-1 text-slate-400">
                      <span className="text-sm font-medium text-slate-500">No records found</span>
                      <span className="text-xs">Try adjusting your filters or date range.</span>
                    </div>
                  </td>
                </tr>
              )}

              {pageRows.map((row) => (
                <tr key={row.id} className="group/row hover:bg-slate-50 transition-colors">
                  <td className="sticky left-0 z-10 bg-white group-hover/row:bg-slate-50 px-4 py-3 align-top transition-colors">
                    <Tooltip label={row.customerName}>
                      <span className="block max-w-[200px] truncate font-medium text-slate-800 cursor-default">
                        {row.customerName}
                      </span>
                    </Tooltip>
                  </td>
                  <td className="px-4 py-3 align-top text-slate-600 tabular-nums whitespace-nowrap">
                    {row.mobile || <span className="text-slate-400">N/A</span>}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <Tooltip label={row.productName}>
                      <span className="block max-w-[150px] truncate text-slate-600 cursor-default">
                        {row.productName || "N/A"}
                      </span>
                    </Tooltip>
                  </td>
                  <td className="px-4 py-3 align-top text-slate-600 font-mono text-[13px] whitespace-nowrap">
                    {row.licenseNo || <span className="text-slate-400 font-sans">N/A</span>}
                  </td>
                  <td className="px-4 py-3 align-top text-slate-600 tabular-nums whitespace-nowrap">
                    {formatDate(row.amcEnd) || <span className="text-slate-400">N/A</span>}
                  </td>
                  <td className="px-4 py-3 align-top text-slate-600 tabular-nums whitespace-nowrap">
                    {formatDate(row.tuvExpiry) || <span className="text-slate-400">N/A</span>}
                  </td>
                  <td className="px-4 py-3 align-top text-slate-600 tabular-nums whitespace-nowrap">
                    {formatDate(row.licenseExpiry) || <span className="text-slate-400">N/A</span>}
                  </td>
                  <td className="px-4 py-3 align-top whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${STATUS_STYLES[row.status] || "bg-slate-50 text-slate-600 ring-slate-500/20"}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[row.status] || "bg-slate-400"}`} />
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-center justify-center gap-1.5">
                      <Tooltip label="Edit customer" width="max-w-[8rem]">
                        <button
                          onClick={() => onEdit(row)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-teal-50 transition-colors"
                          aria-label="Edit customer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </Tooltip>
                      <Tooltip label="View details" width="max-w-[8rem]">
                        <button
                          onClick={() => onView(row)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-teal-50 transition-colors"
                          aria-label="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer: summary + pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 bg-slate-50/60">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>
              Showing <span className="font-medium text-slate-700">{sorted.length === 0 ? 0 : start + 1}</span>
              {"–"}
              <span className="font-medium text-slate-700">{Math.min(start + pageSize, sorted.length)}</span>
              {" of "}
              <span className="font-medium text-slate-700">{sorted.length}</span>
            </span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="ml-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
            >
              {[5, 10, 25, 50].map((n) => (
                <option key={n} value={n}>
                  {n} / page
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={clampedPage === 1}
              className="inline-flex items-center justify-center w-7 h-7 rounded-md text-slate-500 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs font-medium text-slate-600 tabular-nums">
              {clampedPage} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={clampedPage === totalPages}
              className="inline-flex items-center justify-center w-7 h-7 rounded-md text-slate-500 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
