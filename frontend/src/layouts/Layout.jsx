import { useEffect, useRef, useState } from "react"
import AdminHeader from "../header/AdminHeader.jsx"
import StaffHeader from "../header/StaffHeader.jsx"

import Mainrouter from "../router/Mainrouter.jsx"

import { useLocation } from "react-router-dom"

const Layout = () => {
  const [headerHeight, setHeaderHeight] = useState(0)
  const headerRef = useRef(null)
  const location = useLocation()

  const adminHeader = location.pathname.startsWith("/admin")
  const staffHeader = location.pathname.startsWith("/staff")
  useEffect(() => {
    if (headerRef.current) {
      
      setHeaderHeight(headerRef.current.offsetHeight)
    }
  }, [location.pathname]) // Update height on route change
 console.log(headerHeight)
  return (
    <div className="h-screen flex flex-col">
      <div ref={headerRef} className="sticky top-0 z-50 flex-shrink-0">
        {/* Conditional Header */}
        {adminHeader &&<AdminHeader /> }
        {staffHeader &&<StaffHeader />}
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <Mainrouter headerHeight={headerHeight} />
      </main>
    </div>
    
  )
}

export default Layout
