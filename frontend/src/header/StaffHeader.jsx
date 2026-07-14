

import { act, useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"
import api from "../api/api"
import { useUnsavedChanges } from "../context/UnsavedChangesContext"
import {
  FiMenu,
  FiX,
  FiChevronDown,
  FiChevronRight,
  FiLogOut,
  FiRepeat,
  FiBox,
  FiClock,
  FiFilter,
  FiPhoneCall,
  FiCalendar,
  FiSearch,
  FiClipboard,
  FiActivity,
  FiUserCheck,
  FiUserX
} from "react-icons/fi"
import { FaUserCircle } from "react-icons/fa"

export default function StaffHeader({ hide = false }) {
  const [user, setUser] = useState(null)
console.log(user)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(null)
  const [mobileChildMenu, setMobileChildMenu] = useState(null)

  const navigate = useNavigate()
  const location = useLocation()
  const { requestNavigation } = useUnsavedChanges()
const activeCompany = useSelector(
  state => state.auth.activeCompany
);

console.log(activeCompany)
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) setUser(JSON.parse(storedUser))
  }, [])

  const permissions = user?.permissions?.[0] || {}
console.log(permissions)
  const masters = useMemo(
    () => [
      {
        to: "/staff/masters/company",
        label: "Company",
        control: permissions.Company ?? false
      },
      {
        to: "/staff/masters/branch",
        label: "Branch",
        control: permissions.Branch ?? false
      },
      {
        to: "/staff/masters/department",
        label: "Department",
        control: permissions.Department ?? false
      },
      {
        label: "Product & Service",
        hasChildren: true,
        control: permissions.ProductandServices ?? false
      },
      {
        to: "/staff/masters/customer",
        label: "Customer",
        control: permissions.Customer ?? false
      },
      {
        label: "Employee",
        hasChildren: true,
        control: permissions.Employee ?? false
      },
      {
        to: "/staff/masters/leavemaster",
        label: "Leave Master",
        control: permissions.Leavemaster ?? false
      },
      {
        to: "/staff/masters/partners",
        label: "Partners",
        control: permissions.Partners ?? false
      }
    ],
    [permissions]
  )

  const productAndServices = useMemo(
    () => [
      {
        to: "/staff/masters/product",
        label: "Product",
        control: permissions.Product ?? false
      },
      {
        to: "/staff/masters/servicesRegistration",
        label: "Services",
        control: permissions.Services ?? false
      },
      {
        to: "/staff/masters/inventory/brandRegistration",
        label: "Brand",
        control: permissions.Brand ?? false
      },
      {
        to: "/staff/masters/inventory/categoryRegistration",
        label: "Category",
        control: permissions.Category ?? false
      },
      {
        to: "/staff/masters/inventory/hsnlist",
        label: "HSN",
        control: permissions.HSN ?? false
      },
      {
        to: "/staff/masters/callnotes",
        label: "Call Notes",
        control: permissions.CallNotes ?? false
      },
      {
        to: "/staff/masters/taskRegistration",
        label: "Task Level",
        control: permissions.TaskLevel ?? false
      }
    ],
    [permissions]
  )

  const employeeMenu = useMemo(
    () => [
      {
        to: "/staff/masters/users-&-passwords",
        label: "Users & Passwords",
        control: permissions.UsersAndPasswords ?? false
      },
      {
        to: "/staff/masters/menuRights",
        label: "Menu Rights",
        control: permissions.MenuRights ?? false
      },
      {
        to: "/staff/masters/target",
        label: "Target",
        control: permissions.Target ?? false
      },
      {
        to: "/staff/masters/voucherMaster",
        label: "Voucher Master",
        control: permissions.VoucherMaster ?? false
      }
    ],
    [permissions]
  )

  // Kept for reference / getChildItems("Lead") compatibility, but no menu item
  // currently has label "Lead" with hasChildren, so this flyout is not wired
  // in anywhere right now (mirrors the current AdminHeader structure).
  const leads = useMemo(
    () => [
      { to: "/staff/transaction/lead", label: "New Lead", control: true },
      {
        to: "/staff/transaction/lead/ownedLeadlist",
        label: "Own Lead",
        control: true
      },
      {
        to: "/staff/transaction/lead/leadFollowUp",
        label: "Lead Follow Up",
        control: permissions.LeadFollowUp ?? false
      },
      {
        to: "/staff/transaction/lead/taskAnalysis",
        label: "Task Analysis",
        control: permissions.TaskAnalysis ?? false
      },
      {
        to: "/staff/transaction/lead/lostLeads",
        label: "Lost Leads",
        control: permissions.LostLeads ?? false
      }
    ],
    [permissions]
  )

  const transactions = useMemo(
    () => [
      {
        to: "/staff/transaction/call-registration",
        label: "Call Registration",
        control: permissions.CallRegistration ?? false
      },
 {
        to: "/staff/support&department",
        label: "Support Department",
        control: permissions.SupportDepartment ?? false
      },

      {
        to: "/staff/transaction/leave-application",
        label: "Leave Application",
        control: permissions.LeaveApplication ?? false
      },
      {
        to: "/staff/transaction/lead",
        label: "New Lead",
        control: true
      },
      {
        to: "/staff/transaction/lead/collectionUpdate",
        label: "Collection Update",
        control: permissions.CollectionUpdate ?? false
      }
    ],
    [permissions]
  )

  const tasks = useMemo(
    () => [
      {
        to: "/staff/transaction/lead/leadReallocation",
        label: "Task Allocation",
        control: permissions.LeadReallocation ?? false
      },
      {
        to: "/staff/transaction/lead/leadAllocation",
        label: "Follow-Up Allocation",
        control: permissions.LeadAllocation ?? false
      },
      {
        to: "/staff/transaction/lead/leadTask",
        label: "Task Pending",
        control: true
      },
      {
        to: "/staff/tasks/leaveApproval-pending",
        label: "Leave Approval Pending",
        control: permissions.LeaveApprovalPending ?? false
      },
      {
        to: "/staff/tasks/excelconverter",
        label: "Customer Converter (Excel to JSON)",
        control: permissions.ExcelConverter ?? false
      },
      {
        to: "/staff/tasks/attendanceExcelconverter",
        label: "Attendance Converter",
        control: permissions.AttendanceExcelConverter ?? false
      }
    ],
    [permissions]
  )
console.log(permissions)
  // Reports is now split into labeled groups (Marketing / Service / My Activities),
  // matching the Admin header. Each group renders inline in the same dropdown panel
  // with a highlighted section header instead of a flyout submenu. Every item still
  // respects its own permission via `control`.
  const reports = useMemo(
    () => [
      {
        group: "Marketing",
        items: [
          {
            to: "/staff/reports/follow-up-summary",
            label: "Followup Summary",
            icon: FiRepeat,
            control: permissions.FollowupSummary ?? false
          },
          {
            to: "/staff/reports/product-wise-report",
            label: "Lead ( Staff / Product )",
            icon: FiBox,
            control: permissions.ProductWiseReport ?? false
          },
          {
            to: "/staff/reports/sales-funel",
            label: "Sales Funnel",
            icon: FiFilter,
            control: permissions.SalesFunnel ?? false
          },
          {
            to: "/staff/transaction/lead/leadFollowUp",
            label: "In Follow-Up",
            icon: FiClock,
            control: permissions.LeadFollowUp ?? false
          },
          {
            to: "/staff/transaction/lead/ownedLeadlist",
            label: "Own Lead",
            icon: FiUserCheck,
            control: true
          },
          {
            to: "/staff/transaction/lead/lostLeads",
            label: "Lost Leads",
            icon: FiUserX,
            control: permissions.LostLeads ?? false
          }
        ]
      },
      {
        group: "Service",
        items: [
          {
            to: "/staff/reports/summary",
            label: "Call Summary",
            icon: FiPhoneCall,
            control: permissions.Summary ?? false
          },
          {
            to: "/staff/reports/expiry-register",
            label: "Expiry Register",
            icon: FiCalendar,
            control: permissions.ExpiryRegister ?? false
          },
          {
            to: "/staff/reports/account-search",
            label: "Account Search",
            icon: FiSearch,
            control: permissions.AccountSearch ?? false
          }
        ]
      },
      {
        group: "My Activities",
        items: [
          {
            to: "/staff/reports/leave-summary",
            label: "Attendance Summary",
            icon: FiClipboard,
            control: permissions.LeaveSummary ?? false
          },
          {
            to: "/staff/reports/dailystaffactivity",
            label: "Daily Staff Activity",
            icon: FiActivity,
            control: permissions.DailyStaffActivity ?? false
          }
        ]
      }
    ],
    [permissions]
  )

  const menuGroups = useMemo(
    () => [
      { label: "Masters", items: masters },
      { label: "Transactions", items: transactions },
      { label: "Reports", items: reports },
      { label: "Tasks", items: tasks }
    ],
    [masters, transactions, reports, tasks]
  )

  const getChildItems = (label) => {
    if (label === "Product & Service") {
      return productAndServices.filter((i) => i.control)
    }
    if (label === "Employee") {
      return employeeMenu.filter((i) => i.control)
    }
    if (label === "Lead") {
      return leads.filter((i) => i.control)
    }
    return []
  }

  // Flattens the Reports groups into a single list of permitted items -
  // used to decide whether the top-level "Reports" nav button should show at all.
  const getVisibleReportItems = () =>
    reports.flatMap((groupItem) => groupItem.items).filter((i) => i.control)

  const handleSafeNavigate = (path, options = {}) => {
console.log(path)
console.log(options)
    requestNavigation(() => {
      setMobileOpen(false)
      setMobileMenu(null)
      setMobileChildMenu(null)
      navigate(path, options)
    })
  }

  const isPathActive = (path) => {
    return location.pathname === path
  }

  const isGroupActive = (items) => {
    return items.some((item) => {
      if (item.to && location.pathname === item.to) return true
      if (item.hasChildren) {
        const childItems = getChildItems(item.label)
        return childItems.some((child) => location.pathname === child.to)
      }
      return false
    })
  }

  const isReportsGroupActive = () => {
    return reports.some((groupItem) =>
      groupItem.items.some((child) => location.pathname === child.to)
    )
  }

  const logout = async () => {
    try {
      const res = await api.post("/auth/logout")
      if (
        res.status === 200 &&
        res.data?.message === "Logged out successfully"
      ) {
        localStorage.removeItem("authToken")
        localStorage.removeItem("user")
        localStorage.removeItem("timer")
        localStorage.removeItem("wish")
        toast.success("Logout successfully")
        navigate("/")
      } else {
        toast.error("Logout failed on server")
      }
    } catch (err) {
      console.error(err)
      toast.error("Logout failed, please try again")
    }
  }

  const DesktopLeafLink = ({ to, label }) => (
    <button
      type="button"
      onClick={() => handleSafeNavigate(to)}
      className={`block w-full rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition ${
        isPathActive(to)
          ? "bg-[#243145] text-white"
          : "text-slate-100 hover:bg-[#1E293B] hover:text-white"
      }`}
    >
      {label}
    </button>
  )

  const DesktopChildPanel = ({ items }) => (
    <div className="invisible absolute left-[calc(100%+8px)] top-0 z-50 min-w-[240px] translate-x-1 rounded-2xl border border-white/10 bg-[#162033] p-2 opacity-0 shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition-all duration-150 group-hover/child:visible group-hover/child:translate-x-0 group-hover/child:opacity-100 group-focus-within/child:visible group-focus-within/child:translate-x-0 group-focus-within/child:opacity-100">
      {items.map((child) => (
        <DesktopLeafLink key={child.to} to={child.to} label={child.label} />
      ))}
    </div>
  )

  const DesktopDropdown = ({ items }) => (
    <div className="invisible absolute left-0 top-[calc(100%+10px)] z-50 min-w-[260px] translate-y-1 rounded-2xl border border-white/10 bg-[#162033] p-2 opacity-0 shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition-all duration-150 group-hover/menu:visible group-hover/menu:translate-y-0 group-hover/menu:opacity-100 group-focus-within/menu:visible group-focus-within/menu:translate-y-0 group-focus-within/menu:opacity-100">
      {items
        .filter((item) => item.control)
        .map((item) => {
          if (!item.hasChildren) {
            return (
              <DesktopLeafLink key={item.to} to={item.to} label={item.label} />
            )
          }

          const childItems = getChildItems(item.label)
          if (!childItems.length) return null

          return (
            <div key={item.label} className="group/child relative">
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[13px] font-medium text-slate-100 transition hover:bg-[#1E293B]"
              >
                <span>{item.label}</span>
                <FiChevronRight className="text-slate-400" size={14} />
              </button>

              <DesktopChildPanel items={childItems} />
            </div>
          )
        })}
    </div>
  )

  // Grouped dropdown just for Reports: Marketing / Service / My Activities,
  // each with a highlighted header and icon-led links, all in one panel.
  const DesktopReportsDropdown = ({ groups }) => (
    <div className="invisible absolute left-0 top-[calc(100%+10px)] z-50 w-64 translate-y-1 rounded-2xl border border-white/10 bg-[#162033] p-2 py-2 opacity-0 shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition-all duration-150 group-hover/menu:visible group-hover/menu:translate-y-0 group-hover/menu:opacity-100 group-focus-within/menu:visible group-focus-within/menu:translate-y-0 group-focus-within/menu:opacity-100">
      {groups.map((groupItem, idx) => {
        const visible = groupItem.items.filter((i) => i.control)
        if (!visible.length) return null

        return (
          <div
            key={groupItem.group}
            className={idx !== 0 ? "mt-1 border-t border-white/10 pt-2" : ""}
          >
            <div className="px-3 pb-1.5 pt-1 text-[11px] font-bold uppercase tracking-wider text-sky-400">
              {groupItem.group}
            </div>
            {visible.map((child) => {
              const ChildIcon = child.icon
              return (
                <button
                  key={child.to}
                  type="button"
                  onClick={() => handleSafeNavigate(child.to)}
                  className={`flex w-full items-center gap-1.5 rounded-xl px-3 py-1 text-left text-[13px] font-medium transition ${
                    isPathActive(child.to)
                      ? "bg-[#243145] text-white"
                      : "text-slate-100 hover:bg-[#1E293B] hover:text-white"
                  }`}
                >
                  {ChildIcon && (
                    <ChildIcon
                      className={`h-4 w-4 shrink-0 ${
                        isPathActive(child.to) ? "text-sky-400" : "text-slate-400"
                      }`}
                    />
                  )}
                  <span>{child.label}</span>
                </button>
              )
            })}
          </div>
        )
      })}
    </div>
  )

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-[#ADD8E6] ${hide ? "flex-grow" : ""} text-white backdrop-blur-xl`}
      >
        <div className="mx-auto flex h-14 w-full items-center gap-3 px-3 sm:px-4 lg:px-6">
          {!hide && (
            <div className="flex min-w-0 items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#162033] text-slate-200 transition hover:bg-[#1E293B] xl:hidden"
              >
                <FiMenu size={18} />
              </button>

              <button
                type="button"
                onClick={() => handleSafeNavigate("/staff/dashBoard")}
                className="flex items-center gap-3"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-[0_10px_30px_rgba(59,130,246,0.28)]">
                  <span className="text-[16px] font-bold tracking-[0.16em] text-white">
                    CRM
                  </span>
                </div>

                <div className="hidden sm:block text-left">
                  <div className="text-[14px] font-semibold leading-4 text-black">
                    Management Suite
                  </div>
                  <div className="text-[11px] leading-4 text-black">
                    Staff workspace
                  </div>
                </div>
              </button>
            </div>
          )}

          <div className="hidden min-w-0 flex-1 items-center justify-center md:flex">
            <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-[#162033] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
              <button
                type="button"
                onClick={() =>{
 let userwisepath=null
if (user.role === "Admin") {
            userwisepath="/admin/dashboard"
          } else {
            switch (user.department?.code) {
              case "DEPARTMENT1":
                userwisepath="/staff/dashboard"
                break

              case "DEPARTMENT2":
                userwisepath="/staff/dashboard"
                break

              case "DEPARTMENT3":
                userwisepath="/staff/reports/markettingdashboard"
                break
              case "DEPARTMENT4":
                userwisepath="/staff/support&department"
                break

              default:
                userwisepath="/staff/dashboard"
            }
          }

 handleSafeNavigate(userwisepath)}}
                className={`px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                  isPathActive("/staff/dashBoard")
                    ? "bg-[#243145] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                    : "text-slate-300 hover:text-white hover:bg-[#1E293B]"
                }`}
              >
                Dashboards
              </button>

              {menuGroups.map((group) => {
                const isReports = group.label === "Reports"
                const visibleItems = isReports
                  ? getVisibleReportItems()
                  : group.items.filter((i) => i.control)
                if (!visibleItems.length) return null

                const activeGroup = isReports
                  ? isReportsGroupActive()
                  : isGroupActive(group.items)

                return (
                  <div key={group.label} className="group/menu relative">
                    <button
                      type="button"
                      className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-[13px] font-medium transition ${
                        activeGroup
                          ? "bg-[#243145] text-white"
                          : "text-slate-300 hover:bg-[#1E293B] hover:text-white"
                      }`}
                    >
                      <span>{group.label}</span>
                      <FiChevronDown size={14} className="text-slate-400" />
                    </button>

                    {isReports ? (
                      <DesktopReportsDropdown groups={reports} />
                    ) : (
                      <DesktopDropdown items={group.items} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {!hide && (
            <div className="ml-auto flex items-center gap-2">
              <div className="hidden md:flex items-center gap-3 rounded-2xl border border-white/10 bg-[#162033] px-2.5 py-1.5">
                <div className="flex min-w-0 items-center gap-2">
                  {user?.profileUrl ? (
                    <img
                      src={user.profileUrl}
                      alt="Profile"
                      className="h-9 w-9 rounded-xl object-cover ring-1 ring-white/10"
                    />
                  ) : (
                    <FaUserCircle className="text-[30px] text-slate-400" />
                  )}

                  <div className="min-w-0">
                    <div className="truncate text-[13px] font-semibold text-white">
                      {user?.name || "Staff User"}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="truncate">
                        {user?.selected?.[0]?.branchName || "Branch"}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-slate-500" />
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-400">
                        {user?.role || "Staff"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={logout}
                className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-[#162033] px-3 text-[13px] font-medium text-slate-300 transition hover:bg-rose-500/10 hover:text-rose-300"
              >
                <FiLogOut size={15} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm xl:hidden"
            onClick={() => setMobileOpen(false)}
          />

          <aside className="fixed left-0 top-0 z-50 h-screen w-[88%] max-w-[360px] overflow-y-auto border-r border-white/10 bg-[#0F172A] text-white shadow-[0_20px_80px_rgba(0,0,0,0.55)] xl:hidden">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600">
                  <span className="text-[11px] font-bold tracking-[0.16em]">
                    CRM
                  </span>
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-white">
                    Management Suite
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Staff workspace
                  </div>
                </div>
              </div>

              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#162033]"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="border-b border-white/10 px-4 py-4">
              <div className="flex items-center gap-3">
                {user?.profileUrl ? (
                  <img
                    src={user.profileUrl}
                    alt="Profile"
                    className="h-11 w-11 rounded-2xl object-cover ring-1 ring-white/10"
                  />
                ) : (
                  <FaUserCircle className="text-[36px] text-slate-400" />
                )}

                <div className="min-w-0">
                  <div className="truncate text-[14px] font-semibold">
                    {user?.name || "Staff User"}
                  </div>
                  <div className="truncate text-[12px] text-slate-400">
                    {user?.selected?.[0]?.branchName || "Branch"}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3">
              <button
                type="button"
                onClick={() => handleSafeNavigate("/staff/dashBoard")}
                className={`mb-2 block w-full rounded-2xl px-4 py-3 text-left text-[14px] font-medium ${
                  isPathActive("/staff/dashBoard")
                    ? "bg-[#243145] text-white"
                    : "text-slate-200 hover:bg-[#1E293B]"
                }`}
              >
                Dashboard
              </button>

              {menuGroups.map((group) => {
                const isReports = group.label === "Reports"
                const visibleItems = isReports
                  ? getVisibleReportItems()
                  : group.items.filter((i) => i.control)
                if (!visibleItems.length) return null

                return (
                  <div
                    key={group.label}
                    className="mb-1 rounded-2xl border border-white/10 bg-[#162033]"
                  >
                    <button
                      onClick={() =>
                        setMobileMenu(
                          mobileMenu === group.label ? null : group.label
                        )
                      }
                      className="flex w-full items-center justify-between px-4 py-3 text-[14px] font-medium text-slate-200"
                    >
                      <span>{group.label}</span>
                      {mobileMenu === group.label ? (
                        <FiChevronDown size={16} className="text-slate-400" />
                      ) : (
                        <FiChevronRight size={16} className="text-slate-400" />
                      )}
                    </button>

                    {mobileMenu === group.label && (
                      <div className="border-t border-white/10 px-2 pb-0">
                        {isReports
                          ? // ---- Grouped rendering for Reports: Marketing / Service / My Activities ----
                            reports.map((groupItem) => {
                              const visible = groupItem.items.filter(
                                (i) => i.control
                              )
                              if (!visible.length) return null

                              return (
                                <div key={groupItem.group} className="mb-1">
                                  <div className="px-3 pb-0 pt-0 text-[11px] font-bold uppercase tracking-wider text-sky-400">
                                    {groupItem.group}
                                  </div>
                                  {visible.map((child) => {
                                    const ChildIcon = child.icon
                                    return (
                                      <button
                                        key={child.to}
                                        type="button"
                                        onClick={() =>
                                          handleSafeNavigate(child.to)
                                        }
                                        className={`flex w-full items-center gap-1 rounded-xl px-3 py-1 text-left text-[13px] font-medium ${
                                          isPathActive(child.to)
                                            ? "bg-[#243145] text-white"
                                            : "text-slate-300 hover:bg-[#1E293B]"
                                        }`}
                                      >
                                        {ChildIcon && (
                                          <ChildIcon
                                            className={`h-4 w-4 shrink-0 ${
                                              isPathActive(child.to)
                                                ? "text-sky-400"
                                                : "text-slate-400"
                                            }`}
                                          />
                                        )}
                                        <span>{child.label}</span>
                                      </button>
                                    )
                                  })}
                                </div>
                              )
                            })
                          : visibleItems.map((item) => {
                              if (!item.hasChildren) {
                                return (
                                  <button
                                    key={item.to}
                                    type="button"
                                    onClick={() => handleSafeNavigate(item.to)}
                                    className={`block w-full rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition ${
                                      isPathActive(item.to)
                                        ? "bg-[#243145] text-white"
                                        : "text-slate-300 hover:bg-[#1E293B]"
                                    }`}
                                  >
                                    {item.label}
                                  </button>
                                )
                              }

                              const childItems = getChildItems(item.label)
                              if (!childItems.length) return null

                              return (
                                <div key={item.label}>
                                  <button
                                    onClick={() =>
                                      setMobileChildMenu(
                                        mobileChildMenu === item.label
                                          ? null
                                          : item.label
                                      )
                                    }
                                    className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-medium text-slate-300 hover:bg-[#1E293B]"
                                  >
                                    <span>{item.label}</span>
                                    {mobileChildMenu === item.label ? (
                                      <FiChevronDown
                                        size={14}
                                        className="text-slate-500"
                                      />
                                    ) : (
                                      <FiChevronRight
                                        size={14}
                                        className="text-slate-500"
                                      />
                                    )}
                                  </button>

                                  {mobileChildMenu === item.label && (
                                    <div className="ml-3 border-l border-white/10 pl-2">
                                      {childItems.map((child) => (
                                        <button
                                          key={child.to}
                                          type="button"
                                          onClick={() =>
                                            handleSafeNavigate(child.to)
                                          }
                                          className={`block w-full rounded-xl px-3 py-2.5 text-left text-[13px] transition ${
                                            isPathActive(child.to)
                                              ? "bg-[#243145] text-white"
                                              : "text-slate-300 hover:bg-[#1E293B]"
                                          }`}
                                        >
                                          {child.label}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                      </div>
                    )}
                  </div>
                )
              })}

              <button
                onClick={logout}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-[14px] font-semibold text-rose-300"
              >
                <FiLogOut size={15} />
                Logout
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  )
}

