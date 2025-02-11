//import Footer from "../components/Footer/Footer"
import AdminHeader from "../header/AdminHeader.jsx"
import StaffHeader from "../header/StaffHeader.jsx"

import Mainrouter from "../router/Mainrouter.jsx"

import { useLocation } from "react-router-dom"

const Layout = () => {
  const location = useLocation()

  const adminHeader = location.pathname.startsWith("/admin")
  const staffHeader = location.pathname.startsWith("/staff")

  return (
    <div>
      {/* Conditional Header */}
      {adminHeader ? <AdminHeader /> : null}
      {staffHeader ? <StaffHeader /> : null}

      {/* Main Content */}
      <main>
        <Mainrouter />
      </main>
    </div>
    // <>
    //   {adminHeader ? <AdminHeader /> : ""}
    //   {staffHeader ? <StaffHeader /> : ""}

    //   <main>
    //     <Mainrouter />
    //   </main>

    // </>
  )
}

export default Layout
