// import { useEffect, useRef, useState } from "react"
// import { useSelector } from "react-redux"
// import AdminHeader from "../header/AdminHeader.jsx"
// import StaffHeader from "../header/StaffHeader.jsx"
// import { NotificationPopup } from "../components/primaryUser/NotificationPopup.jsx"
// import Mainrouter from "../router/Mainrouter.jsx"
// import { StaticSidebar } from "../components/primaryUser/StaticSidebar.jsx"
// import { useLocation, matchPath } from "react-router-dom"
// import useAutoLogout from "../hooks/useAutoLogout.jsx"
// import UseFetch from "../hooks/useFetch.jsx"
// import { getLocalStorageItem } from "../helper/localstorage.js"
// import GlobalUnsavedChangesModal from "../components/common/GlobalUnsavedChangesModal.jsx"
// const Layout = () => {
//   const [headerHeight, setHeaderHeight] = useState(0)
//   const [loggedUser, setloggedUser] = useState(null)
//   const headerRef = useRef(null)
//   const location = useLocation()
//   const isAuthPage = location.pathname === "/"
//   useAutoLogout(!isAuthPage)
//   const adminHeader = location.pathname.startsWith("/admin")
//   const staffHeader = location.pathname.startsWith("/staff")
//   const [notificationPopup, setnotificationPopup] = useState(false)
//   console.log(notificationPopup)
//   const companybranches = useSelector((state) => state.companyBranch.branches)
//   const selectedbranch = useSelector(
//     (state) => state.companyBranch.selectedBranch
//   )
//   const { data: notificationData } = UseFetch(
//     loggedUser &&
//       `/lead/getnotificationData?loggedUser=${loggedUser?._id}&branchSelected=${selectedbranch}`
//   )
//   console.log(notificationData)

//   console.log(selectedbranch)
//   console.log(companybranches)
//   useEffect(() => {
//     const user = getLocalStorageItem("user")
//     setloggedUser(user)
//   }, [])
//   // console.log(notificationData)
//   useEffect(() => {
//     if (headerRef.current) {
//       setHeaderHeight(headerRef.current.offsetHeight)
//     }
//   }, [location.pathname]) // Update height on route change
//   const hideHeaderRoutes = [
//     "/staff/home",
//     "/admin/home",
//     "/staff/reports/markettingdashboard",
//     "/admin/reports/markettingdashboard",
//     "/staff/transaction/lead/ownedLeadlist",
//     "/admin/transaction/lead/ownedLeadlist",
//     "/staff/transaction/lead/leadAllocation",
//     "/admin/transaction/lead/leadAllocation",
//     "/staff/transaction/lead/leadFollowUp",
//     "/admin/transaction/lead/leadFollowUp",

//     "/staff/transaction/lead/leadTask",
//     "/admin/transaction/lead/leadTask",
//     "/staff/transaction/lead/leadReallocation",
//     "/admin/transaction/lead/leadReallocation",
//     "/staff/transaction/lead/reallocationTable/*",
//     "/admin/transaction/lead/reallocationTable/*",
//     "/staff/transaction/lead/taskAnalysis",
//     "/admin/transaction/lead/taskAnalysis",
//     "/staff/transaction/lead/taskanalysisTable/*",
//     "/admin/transaction/lead/taskanalysisTable/*",
//     "/staff/transaction/lead/collectionUpdate",
//     "/admin/transaction/lead/collectionUpdate",
//     "/staff/transaction/lead/lostLeads",
//     "/admin/transaction/lead/lostLeads",
//     "/staff/reports/summary",
//     "/admin/reports/summary",
//     "/staff/reports/expiry-register",
//     "/admin/reports/expiry-register",
//     "/staff/reports/leave-summary",
//     "/admin/reports/leave-summary",
//     "/staff/reports/product-wise-report",
//     "/admin/reports/product-wise-report",
//     "/staff/reports/follow-up-summary",
//     "/admin/reports/follow-up-summary",
//     "/staff/reports/sales-funel",
//     "/admin/reports/sales-funel",
//     "/staff/reports/dailystaffactivity",
//     "/admin/reports/dailystaffactivity",
//     "/staff/transaction/call-registration",
//     "/admin/transaction/call-registration",
//     "/staff/transaction/leave-application",
//     "/admin/transaction/leave-application",
//     "/staff/reports/account-search",
//     "/admin/reports/account-search",
//     "/staff/transaction/lead",
//     "/admin/transaction/lead",
//     "/staff/support&department",
//     "/admin/support&department",
//     "/staff/transaction/lead/leadEdit",
//     "/admin/transaction/lead/leadEdit",
//     "/admin/transaction/lead/leadClosed",
//     "/staff/transaction/lead/leadClosed",
//     "staff/transaction/lead/verifiedCollections"
//   ]

//   const shouldHideHeader = hideHeaderRoutes.some((route) =>
//     matchPath({ path: route, end: true }, location.pathname)
//   )
// console.log(shouldHideHeader)
//   return (
//     <div className="h-screen flex flex-row">
//       <StaticSidebar />
//       <div className="flex flex-col">
//         <div ref={headerRef} className="sticky top-0 z-50 flex-shrink-0">
//           {adminHeader && (
//             <AdminHeader
//               onNotificationClick={() => setnotificationPopup(true)}
//             />
//           )}
//           {staffHeader && (
//             <StaffHeader
//               onNotificationClick={() => setnotificationPopup(true)}
//             />
//           )}
//         </div>

//         <main className="flex-1 overflow-hidden">
//           <Mainrouter headerHeight={headerHeight} />
//         </main>
//       </div>

//       <GlobalUnsavedChangesModal />
//       <NotificationPopup
//         open={notificationPopup}
//         onClose={() => setnotificationPopup(false)}
//         notificationData={notificationData}
//       />
//     </div>
//   )
// }

// export default Layout

import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useLocation, matchPath } from "react-router-dom"
import AdminHeader from "../header/AdminHeader"
import StaffHeader from "../header/StaffHeader"
import ChangePasswordModal from "../components/common/ChangePasswordModal"
import { StaticSidebar } from "../components/primaryUser/StaticSidebar"
import { NotificationPopup } from "../components/primaryUser/NotificationPopup"
import GlobalUnsavedChangesModal from "../components/common/GlobalUnsavedChangesModal"

import Mainrouter from "../router/Mainrouter"
import { PerformanceModal } from "../components/primaryUser/PerformanceModal"
import useAutoLogout from "../hooks/useAutoLogout"
import UseFetch from "../hooks/useFetch"

import { getLocalStorageItem } from "../helper/localstorage"

const Layout = () => {
  const location = useLocation()

  const headerRef = useRef(null)

  const [headerHeight, setHeaderHeight] = useState(0)
  const [notificationPopup, setNotificationPopup] = useState(false)
  const [loggedUser, setLoggedUser] = useState(null)
console.log(loggedUser)
  const [changepasswordOpen, setchangepasswordOpen] = useState(false)
const [performanceModalOpen,setperformanceModalOpen]=useState(false)
const [categoryId,setcategoryId]=useState(null)
console.log(performanceModalOpen)
  const isAuthPage = location.pathname === "/"
const [targetData,setTargetData]=useState([])
  useAutoLogout(!isAuthPage)

  const isAdmin = location.pathname.startsWith("/admin")
  const isStaff = location.pathname.startsWith("/staff")

  const selectedBranch = useSelector(
    (state) => state.companyBranch.selectedBranch
  )
  const hideHeaderRoutes = [
    "/staff/home",
    "/admin/home",
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
    "/admin/transaction/lead/leadEdit",
    "/admin/transaction/lead/leadClosed",
    "/staff/transaction/lead/leadClosed",
    "staff/transaction/lead/verifiedCollections"
  ]

  const shouldshowSidebar = hideHeaderRoutes.some((route) =>
    matchPath({ path: route, end: true }, location.pathname)
  )
  console.log(shouldshowSidebar)
  useEffect(() => {
    setLoggedUser(getLocalStorageItem("user"))
  }, [])

  const { data: notificationData } = UseFetch(
    loggedUser &&
      selectedBranch &&
      `/lead/getnotificationData?loggedUser=${loggedUser._id}&branchSelected=${selectedBranch}`
  )

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight)
    }
  }, [location.pathname])

  if (isAuthPage) {
    return <Mainrouter />
  }

  return (
    <>
      <div className="h-screen flex overflow-hidden">
        {/* Sidebar */}
        {shouldshowSidebar && (
          <StaticSidebar onpasswordClick={()=>setchangepasswordOpen(true)} onperformanceModalClick={()=>setperformanceModalOpen(true)} setTargetData={setTargetData} targetData={targetData} setcategoryId={setcategoryId}/>
        )}

        {/* Right Side */}

        <div className="flex flex-col flex-1 overflow-hidden">
          <div ref={headerRef} className="flex-shrink-0 z-50">
            {isAdmin && (
              <AdminHeader
                sidebarHasProfile={shouldshowSidebar}
                onNotificationClick={() => setNotificationPopup(true)}
              />
            )}

            {isStaff && (
              <StaffHeader
                sidebarHasProfile={shouldshowSidebar}
                onNotificationClick={() => setNotificationPopup(true)}
              />
            )}
          </div>
          {/* <Header /> */}

          <main className="flex-1 overflow-auto">
            <Mainrouter />
          </main>
        </div>
      </div>
      <NotificationPopup
        open={notificationPopup}
        onClose={() => setNotificationPopup(false)}
        notificationData={notificationData}
      />
<PerformanceModal
open={performanceModalOpen}
onClose={()=>setperformanceModalOpen(false)}
targetData={targetData}
loggedUser={loggedUser}
categoryId={categoryId}
/>

      <ChangePasswordModal
        open={changepasswordOpen}
        onClose={() => setchangepasswordOpen(false)}
      />

      <GlobalUnsavedChangesModal />
    </>
  )
}

export default Layout
