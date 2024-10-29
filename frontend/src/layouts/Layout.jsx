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
    <>
      {adminHeader ? <AdminHeader /> : ""}
      {staffHeader ? <StaffHeader /> : ""}

      <main>
        <Mainrouter />
      </main>

      {/* <Footer /> */}
    </>
  )
}

export default Layout
