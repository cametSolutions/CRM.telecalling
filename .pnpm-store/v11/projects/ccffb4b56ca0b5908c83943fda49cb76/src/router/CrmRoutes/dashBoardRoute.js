import PrimaryUserDashBoard from "../../pages/primaryUser/dashboard/PrimaryUserDashBoard"
import CallregistrationList from "../../pages/secondaryUser/List/CallregistrationList"
import AdminPanel from "../../pages/primaryUser/dashboard/AdminPanel"

const dashBoardRoutes = [
  { path: "/admin/dashBoard", component: PrimaryUserDashBoard },
  { path: "/admin/support&department", component: CallregistrationList },
{path:"/admin/adminpanel",component:AdminPanel},
  { path: "/staff/dashBoard", component: PrimaryUserDashBoard },
  { path: "/staff/support&department", component: CallregistrationList }
]

export default dashBoardRoutes
