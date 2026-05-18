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
    "/admin/transaction/lead/lostLeads"
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
