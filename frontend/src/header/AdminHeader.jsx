
import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import ReportBugButton from "../components/developer/ReportBugButton"
import {
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronDown,
  FiChevronRight,
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
import { toast } from "react-toastify"
import api from "../api/api"
import { useUnsavedChanges } from "../context/UnsavedChangesContext"

export default function AdminHeader({ hide = false }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  const [openMenu, setOpenMenu] = useState(null)
  const [openChildMenu, setOpenChildMenu] = useState(null)

  const [activeSubmenu, setActiveSubmenu] = useState(null)
  const [openInnerMenu, setOpenInnerMenu] = useState(null)

  const navigate = useNavigate()
  const location = useLocation()
  const { requestNavigation } = useUnsavedChanges()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleSafeNavigate = (path, options = {}) => {
    requestNavigation(() => {
      setMobileMenuOpen(false)
      setProfileMenuOpen(false)
      setOpenMenu(null)
      setOpenChildMenu(null)
      setActiveSubmenu(null)
      setOpenInnerMenu(null)
      navigate(path, options)
    })
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
      console.error("Logout API failed:", err)
      toast.error("Logout failed, please try again")
    }
  }

  const toggleSubmenu = (index) => {
    setActiveSubmenu(activeSubmenu === index ? null : index)
  }

  const toggleInnerMenu = (innerIndex) => {
    setOpenInnerMenu(openInnerMenu === innerIndex ? null : innerIndex)
  }

  const links = [
    { to: "/admin/dashBoard", label: "Dashboard" },
    { label: "Masters", key: "Masters" },
    { label: "Transactions", key: "Transactions" },
    { label: "Reports", key: "Reports" },
    { label: "Task", key: "Task" }
  ]

  const desiredMobileMenu = [
    { label: "Transactions" },
    { label: "Reports" },
    { label: "Task" }
  ]

  const masters = useMemo(
    () => [
      { to: "/admin/masters/company", label: "Company" },
      { to: "/admin/masters/branch", label: "Branch" },
      { to: "/admin/masters/department", label: "Department" },
      { label: "Product & Service", hasChildren: true, key: "Product & Service" },
      { to: "/admin/masters/customer", label: "Customer" },
      { label: "Employee", hasChildren: true, key: "Employee" },
      { to: "/admin/masters/leavemaster", label: "Leave Master" },
      { to: "/admin/masters/partners", label: "Partners" }
    ],
    []
  )

  const productAndServices = useMemo(
    () => [
      { to: "/admin/masters/product", label: "Product" },
      { to: "/admin/masters/servicesRegistration", label: "Services" },
      { to: "/admin/masters/inventory/brandRegistration", label: "Brand" },
      { to: "/admin/masters/inventory/categoryRegistration", label: "Category" },
      { to: "/admin/masters/inventory/hsnlist", label: "HSN" },
      { to: "/admin/masters/callnotes", label: "Call Notes" },
      { to: "/admin/masters/taskRegistration", label: "Task Level" }
    ],
    []
  )

  const employee = useMemo(
    () => [
      { to: "/admin/masters/users-&-passwords", label: "Users & Passwords" },
      { to: "/admin/masters/menuRights", label: "Menu Rights" },
      { to: "/admin/masters/target", label: "Target" },
      { to: "/admin/masters/voucherMaster", label: "Voucher Master" }
    ],
    []
  )

  const leads = useMemo(
    () => [
      { to: "/admin/transaction/lead", label: "New Lead" },
      { to: "/admin/transaction/lead/ownedLeadlist", label: "Own Lead" },
     ,
      { to: "/admin/transaction/lead/leadFollowUp", label: "Lead Follow Up" },
    
    ,
      { to: "/admin/transaction/lead/taskAnalysis", label: "Task Analysis" },
      { to: "/admin/transaction/lead/lostLeads", label: "Lost Leads" },
    
    ],
    []
  )

  const transactions = useMemo(
    () => [
      { to: "/admin/transaction/call-registration", label: "Call Registration" },
      { to: "/admin/transaction/leave-application", label: "Leave Application" },
 {
        to: "/admin/support&department",
        label: "Support Department",
        
      },
 { to: "/admin/transaction/lead", label: "New Lead" },
      { to: "/admin/transaction/lead/collectionUpdate", label: "Collection Update" }
    ],
    []
  )

  const tasks = useMemo(
    () => [
      // { to: "/admin/tasks/signUp-customer", label: "Sign Up Customer" },
  { to: "/admin/transaction/lead/leadReallocation", label: "Task Allocation" },
 { to: "/admin/transaction/lead/leadAllocation", label: "Follow-Up Allocation" },
  { to: "/admin/transaction/lead/leadTask", label: "Task Pending" },
      { to: "/admin/tasks/leaveApproval-pending", label: "Leave Approval Pending" },
      // { to: "/admin/tasks/workAllocation", label: "Work Allocation" },
      { to: "/admin/tasks/excelconverter", label: "Customer Converter (Excel to JSON)" },
      { to: "/admin/tasks/attendanceExcelconverter", label: "Attendance Converter" }
    ],
    []
  )

  // Reports is now split into labeled groups (Marketing / Service / My Activities).
  // Each group renders inline inside the same dropdown panel with a highlighted
  // section header, NOT as a flyout submenu (Masters keeps its flyout behavior).
  const reports = useMemo(
    () => [
      {
        group: "Marketing",
        items: [
          { to: "/admin/reports/follow-up-summary", label: "Followup Summary", icon: FiRepeat },
          { to: "/admin/reports/product-wise-report", label: "Lead ( Staff / Product )", icon: FiBox },
          { to: "/admin/reports/sales-funel", label: "Sales Funnel", icon: FiFilter },
{ to: "/admin/transaction/lead/leadFollowUp", label: "In Follow-Up",icon:FiClock },
 { to: "/admin/transaction/lead/ownedLeadlist", label: "Own Lead",icon:FiUserCheck },
  { to: "/admin/transaction/lead/lostLeads", label: "Lost Leads",icon:FiUserX }
        ]
      },
      {
        group: "Service",
        items: [
          { to: "/admin/reports/summary", label: "Call Summary", icon: FiPhoneCall },
          { to: "/admin/reports/expiry-register", label: "Expiry Register", icon: FiCalendar },
          { to: "/admin/reports/account-search", label: "Account Search", icon: FiSearch }
        ]
      },
      {
        group: "My Activities",
        items: [
          { to: "/admin/reports/leave-summary", label: "Attendance Summary", icon: FiClipboard },
          { to: "/admin/reports/dailystaffactivity", label: "Daily Staff Activity", icon: FiActivity }
        ]
      }
    ],
    []
  )

  const getMenuItems = (label) => {
    if (label === "Masters") return masters
    if (label === "Transactions") return transactions
    if (label === "Reports") return reports
    if (label === "Task") return tasks
    return []
  }

  const getChildItems = (label) => {
    if (label === "Employee") return employee
    if (label === "Product & Service") return productAndServices
    if (label === "Lead") return leads
    return []
  }

  const isPathActive = (path) => {
    return location.pathname === path
  }

  const isAnyChildActive = (items) => {
    return items.some((item) => {
      // Grouped items (currently only Reports uses this shape)
      if (item.group) {
        return item.items.some((child) => location.pathname === child.to)
      }
      if (item.to && location.pathname === item.to) return true
      if (item.hasChildren) {
        const childItems = getChildItems(item.label)
        return childItems.some((child) => location.pathname === child.to)
      }
      return false
    })
  }

  const isTopMenuActive = (label) => {
    return isAnyChildActive(getMenuItems(label))
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-[#ADD8E6] ${
          hide ? "flex-grow" : ""
        } text-white backdrop-blur-xl`}
      >
        <div className="mx-auto flex h-14 w-full items-center gap-3 px-3 sm:px-4 lg:px-6">
          {!hide && (
            <div className="flex min-w-0 items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#162033] text-slate-200 transition hover:bg-[#1E293B] xl:hidden"
              >
                <FiMenu size={18} />
              </button>

              <button
                type="button"
                onClick={() => handleSafeNavigate("/admin/dashBoard")}
                className="flex items-center gap-3"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-[0_10px_30px_rgba(59,130,246,0.28)]">
                  <span className="text-[16px] font-bold tracking-[0.16em] text-white">
                    CRM
                  </span>
                </div>

                <div className="hidden sm:block text-left">
                  <div className="text-[14px] font-semibold leading-4 text-white">
                    Management Suite
                  </div>
                  <div className="text-[11px] leading-4 text-slate-400">
                    Admin panel
                  </div>
                </div>
              </button>
            </div>
          )}

          <div className="hidden min-w-0 flex-1 items-center justify-center md:flex">
            <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-[#162033] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
              {links.map((link) => {
                const hasDropdown = !link.to
                const menuOpen = openMenu === link.label
                const activeTopMenu = hasDropdown
                  ? isTopMenuActive(link.label)
                  : isPathActive(link.to)

                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => {
                      if (hasDropdown) {
                        setOpenMenu(link.label)
                        setOpenChildMenu(null)
                      }
                    }}
                    onMouseLeave={() => {
                      if (hasDropdown) {
                        setOpenMenu(null)
                        setOpenChildMenu(null)
                      }
                    }}
                  >
                    {link.to ? (
                      <button
                        type="button"
                        onClick={() => handleSafeNavigate(link.to)}
                        className={`rounded-xl px-3.5 py-2 text-[13px] font-medium transition ${
                          activeTopMenu
                            ? "bg-[#243145] text-white"
                            : "text-slate-300 hover:bg-[#1E293B] hover:text-white"
                        }`}
                      >
                        {link.label}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-[13px] font-medium transition ${
                          menuOpen || activeTopMenu
                            ? "bg-[#1E293B] text-white"
                            : "text-slate-300 hover:bg-[#1E293B] hover:text-white"
                        }`}
                      >
                        <span>{link.label}</span>
                        <FiChevronDown
                          size={14}
                          className={`text-slate-400 transition ${
                            menuOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    )}

                    {hasDropdown && menuOpen && (
                      <div className="absolute left-0 top-full pt-2">
                        <div
                          className={`relative rounded-2xl border border-white/10 bg-[#162033] shadow-[0_20px_60px_rgba(0,0,0,0.45)] ${
                            link.label === "Reports" ? "w-64 py-2" : "w-56"
                          }`}
                        >
                          {link.label === "Reports"
                            ? // ---- Grouped rendering for Reports: Marketing / Service / My Activities ----
                              reports.map((groupItem, groupIdx) => (
                                <div
                                  key={groupItem.group}
                                  className={
                                    groupIdx !== 0
                                      ? "mt-1 border-t border-white/10 pt-2"
                                      : ""
                                  }
                                >
                                  <div className="px-4 pb-1.5 pt-1 text-[11px] font-bold uppercase tracking-wider text-sky-400">
                                    {groupItem.group}
                                  </div>
                                  {groupItem.items.map((child) => {
                                    const ChildIcon = child.icon
                                    return (
                                      <button
                                        key={child.to}
                                        type="button"
                                        onClick={() => handleSafeNavigate(child.to)}
                                        className={`flex w-full items-center gap-1.5 px-4 py-1 text-left text-[13px] font-medium transition ${
                                          isPathActive(child.to)
                                            ? "bg-[#243145] text-white"
                                            : "text-slate-300 hover:bg-[#1E293B]"
                                        }`}
                                      >
                                        {ChildIcon && (
                                          <ChildIcon
                                            className={`h-4 w-4 ml-3 shrink-0 ${
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
                              ))
                            : // ---- Existing rendering for Masters / Transactions / Task ----
                              getMenuItems(link.label).map((item) => {
                                const childOpen = openChildMenu === item.label
                                const childActive = item.to
                                  ? isPathActive(item.to)
                                  : getChildItems(item.label).some((child) =>
                                      isPathActive(child.to)
                                    )

                                return (
                                  <div
                                    key={item.label}
                                    className="relative"
                                    onMouseEnter={() => {
                                      if (item.hasChildren) {
                                        setOpenChildMenu(item.label)
                                      }
                                    }}
                                  >
                                    {item.to ? (
                                      <button
                                        type="button"
                                        onClick={() => handleSafeNavigate(item.to)}
                                        className={`block w-full px-4 py-2.5 text-left text-[13px] font-medium transition ${
                                          childActive
                                            ? "bg-[#243145] text-white"
                                            : "text-slate-300 hover:bg-[#1E293B]"
                                        }`}
                                      >
                                        {item.label}
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        className={`flex w-full items-center justify-between px-4 py-2.5 text-[13px] font-medium transition ${
                                          childOpen || childActive
                                            ? "bg-[#1E293B] text-white"
                                            : "text-slate-300 hover:bg-[#1E293B]"
                                        }`}
                                      >
                                        <span>{item.label}</span>
                                        <FiChevronRight className="h-4 w-4 text-slate-400" />
                                      </button>
                                    )}

                                    {item.hasChildren && childOpen && (
                                      <div className="absolute left-full top-0 -ml-1 pl-2">
                                        <div className="w-56 rounded-2xl border border-white/10 bg-[#162033] shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                                          {getChildItems(item.label).map((child) => (
                                            <button
                                              key={child.to}
                                              type="button"
                                              onClick={() => handleSafeNavigate(child.to)}
                                              className={`block w-full px-4 py-2.5 text-left text-[13px] font-medium transition ${
                                                isPathActive(child.to)
                                                  ? "bg-[#243145] text-white"
                                                  : "text-slate-300 hover:bg-[#1E293B]"
                                              }`}
                                            >
                                              {child.label}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          
            <div className="ml-auto flex items-center gap-2">
              <div
                className="relative hidden md:block"
                onMouseEnter={() => setProfileMenuOpen(true)}
                onMouseLeave={() => setProfileMenuOpen(false)}
              >
                <button className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#162033] px-2.5 py-1.5 transition hover:bg-[#1E293B]">
                  <div className="flex min-w-0 items-center gap-2">
                    {user?.profileUrl ? (
                      <img
                        src={user.profileUrl}
                        alt={user?.name || "Profile"}
                        className="h-9 w-9 rounded-xl object-cover ring-1 ring-white/10"
                      />
                    ) : (
                      <FaUserCircle className="text-[30px] text-slate-400" />
                    )}

                    <div className="min-w-0 text-left">
                      <div className="truncate text-[13px] font-semibold text-white">
                        {user?.name || "Admin User"}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="truncate">
                          {Array.isArray(user?.branchName)
                            ? user.branchName.join(" | ")
                            : user?.branchName || "Branch"}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-slate-500" />
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-400">
                          {user?.role || "Admin"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <FiChevronDown className="h-4 w-4 text-slate-400" />
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 top-full pt-2">
                    <div className="w-56 rounded-2xl border border-white/10 bg-[#162033] shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                      <div className="border-b border-white/10 px-4 py-3">
                        <p className="truncate text-sm font-semibold text-white">
                          {user?.name}
                        </p>
                        <p className="text-xs text-slate-400">{user?.role}</p>
                        <p className="mt-1 line-clamp-2 text-[11px] text-slate-300">
                          {Array.isArray(user?.branchName)
                            ? user.branchName.join(" | ")
                            : user?.branchName}
                        </p>
                      </div>

                      <button
                        onClick={logout}
                        className="flex w-full items-center gap-2 px-4 py-3 text-sm text-rose-300 transition hover:bg-[#1E293B]"
                      >
                        <FiLogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={logout}
                className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-[#162033] px-3 text-[13px] font-medium text-slate-300 transition hover:bg-rose-500/10 hover:text-rose-300"
              >
                <FiLogOut size={15} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          <ReportBugButton/>
        </div>
      </header>

      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm xl:hidden"
            onClick={() => setMobileMenuOpen(false)}
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
                  <div className="text-[14px] font-semibold">Management Suite</div>
                  <div className="text-[11px] text-slate-400">Admin panel</div>
                </div>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
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
                    alt={user?.name || "Profile"}
                    className="h-11 w-11 rounded-2xl object-cover ring-1 ring-white/10"
                  />
                ) : (
                  <FaUserCircle className="text-[36px] text-slate-400" />
                )}

                <div className="min-w-0">
                  <div className="truncate text-[14px] font-semibold">
                    {user?.name || "Admin User"}
                  </div>
                  <div className="truncate text-[12px] text-slate-400">
                    {user?.role || "Admin"}
                  </div>
                </div>
              </div>

              <p className="mt-2 line-clamp-2 text-[11px] text-slate-400">
                {Array.isArray(user?.branchName)
                  ? user.branchName.join(" | ")
                  : user?.branchName || "Branch"}
              </p>
            </div>

            <div className="p-3">
              <button
                type="button"
                onClick={() => handleSafeNavigate("/admin/dashBoard")}
                className={`mb-2 block w-full rounded-2xl px-4 py-3 text-left text-[14px] font-medium ${
                  isPathActive("/admin/dashBoard")
                    ? "bg-[#243145] text-white"
                    : "text-slate-200 hover:bg-[#1E293B]"
                }`}
              >
                Dashboard
              </button>

              {desiredMobileMenu.map((link, index) => (
                <div
                  key={index}
                  className="mb-1 rounded-2xl border border-white/10 bg-[#162033]"
                >
                  <button
                    onClick={() => toggleSubmenu(index)}
                    className="flex w-full items-center justify-between px-4 py-3 text-[14px] font-medium text-slate-200"
                  >
                    <span>{link.label}</span>
                    {activeSubmenu === index ? (
                      <FiChevronDown size={16} className="text-slate-400" />
                    ) : (
                      <FiChevronRight size={16} className="text-slate-400" />
                    )}
                  </button>

                  {activeSubmenu === index && (
                    <div className="border-t border-white/10 px-2 pb-0">
                      {link.label === "Reports"
                        ? // ---- Grouped rendering for Reports on mobile ----
                          reports.map((groupItem) => (
                            <div key={groupItem.group} className="mb-1">
                              <div className="px-3 pb-0 pt-0 text-[11px] font-bold uppercase tracking-wider text-sky-400">
                                {groupItem.group}
                              </div>
                              {groupItem.items.map((child) => {
                                const ChildIcon = child.icon
                                return (
                                  <button
                                    key={child.to}
                                    type="button"
                                    onClick={() => handleSafeNavigate(child.to)}
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
                          ))
                        : (link.label === "Transactions" ? transactions : tasks).map(
                            (item, innerIndex) => (
                              <div key={item.label}>
                                {item.hasChildren ? (
                                  <>
                                    <button
                                      onClick={() => toggleInnerMenu(innerIndex)}
                                      className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-medium text-slate-300 hover:bg-[#1E293B]"
                                    >
                                      <span>{item.label}</span>
                                      {openInnerMenu === innerIndex ? (
                                        <FiChevronDown className="h-4 w-4 text-slate-400" />
                                      ) : (
                                        <FiChevronRight className="h-4 w-4 text-slate-400" />
                                      )}
                                    </button>

                                    {openInnerMenu === innerIndex &&
                                      item.label === "Lead" && (
                                        <div className="ml-3 border-l border-white/10 pl-2">
                                          {leads.map((child) => (
                                            <button
                                              key={child.to}
                                              type="button"
                                              onClick={() => handleSafeNavigate(child.to)}
                                              className={`block w-full rounded-xl px-3 py-2.5 text-left text-[13px] ${
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
                                  </>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleSafeNavigate(item.to)}
                                    className={`block w-full rounded-xl px-3 py-2.5 text-left text-[13px] font-medium ${
                                      isPathActive(item.to)
                                        ? "bg-[#243145] text-white"
                                        : "text-slate-300 hover:bg-[#1E293B]"
                                    }`}
                                  >
                                    {item.label}
                                  </button>
                                )}
                              </div>
                            )
                          )}
                    </div>
                  )}
                </div>
              ))}

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
