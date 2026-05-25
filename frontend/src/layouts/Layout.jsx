import { useEffect, useRef, useState } from "react"
import AdminHeader from "../header/AdminHeader.jsx"
import StaffHeader from "../header/StaffHeader.jsx"

import Mainrouter from "../router/Mainrouter.jsx"

import { useLocation, matchPath } from "react-router-dom"
import useAutoLogout from "../hooks/useAutoLogout.jsx"
const Layout = () => {
  const [headerHeight, setHeaderHeight] = useState(0)
  const headerRef = useRef(null)
  const location = useLocation()
  const isAuthPage = location.pathname === "/"
  useAutoLogout(!isAuthPage)
  const adminHeader = location.pathname.startsWith("/admin")
  const staffHeader = location.pathname.startsWith("/staff")
  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight)
    }
  }, [location.pathname]) // Update height on route change
  const hideHeaderRoutes = [
    "/staff/reports/markettingdashboard",
    "/admin/reports/markettingdashboard",
    "/staff/transaction/lead/ownedLeadlist",
    "/admin/transaction/lead/ownedLeadlist",
    "/staff/transaction/lead/leadAllocation",
    "/admin/transaction/lead/leadAllocation",
    "/staff/transaction/lead/leadFollowUp",
    "/admin/transaction/lead/leadFollowUp",

    "/staff/transaction/lead/leadTask",
    "/admin/transaction/lead/leadTask",
    "/staff/transaction/lead/leadReallocation",
    "/admin/transaction/lead/leadReallocation",
    "/staff/transaction/lead/reallocationTable/*",
    "/admin/transaction/lead/reallocationTable/*",
    "/staff/transaction/lead/taskAnalysis",
    "/admin/transaction/lead/taskAnalysis",
    "/staff/transaction/lead/taskanalysisTable/*",
    "/admin/transaction/lead/taskanalysisTable/*",
    "/staff/transaction/lead/collectionUpdate",
    "/admin/transaction/lead/collectionUpdate",
    "/staff/transaction/lead/lostLeads",
    "/admin/transaction/lead/lostLeads",
    "/staff/reports/summary",
    "/admin/reports/summary",
"/staff/reports/expiry-register",
"/admin/reports/expiry-register",
"/staff/reports/leave-summary",
"/admin/reports/leave-summary",
"/staff/reports/product-wise-report",
"/admin/reports/product-wise-report",
"/staff/reports/follow-up-summary",
"/admin/reports/follow-up-summary",
"/staff/reports/sales-funel",
"/admin/reports/sales-funel",
"/staff/reports/dailystaffactivity",
"/admin/reports/dailystaffactivity",
"/staff/transaction/call-registration",
"/admin/transaction/call-registration",
"/staff/transaction/leave-application",
"/admin/transaction/leave-application",
"/staff/reports/account-search",
"/admin/reports/account-search",
"/staff/transaction/lead",
"/admin/transaction/lead",
"/staff/support&department",
"/admin/support&department",
"/staff/transaction/lead/leadEdit",
"/admin/transaction/lead/leadEdit"
  ]

  const shouldHideHeader = hideHeaderRoutes.some((route) =>
    matchPath({ path: route, end: true }, location.pathname)
  )
  return (
    <div className="h-screen flex flex-col">
      {!shouldHideHeader && (
        <div ref={headerRef} className="sticky top-0 z-50 flex-shrink-0">
          {adminHeader && <AdminHeader />}
          {staffHeader && <StaffHeader />}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <Mainrouter headerHeight={headerHeight} />
      </main>
    </div>
  )
}

export default Layout
