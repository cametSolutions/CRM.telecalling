import PrimaryUserDashBoard from "../../pages/primaryUser/dashboard/PrimaryUserDashBoard"
import CallregistrationList from "../../pages/secondaryUser/List/CallregistrationList"

const dashBoardRoutes = [
  { path: "/admin/dashBoard", component: PrimaryUserDashBoard },
  { path: "/admin/support&department", component: CallregistrationList },
  { path: "/staff/dashBoard", component: PrimaryUserDashBoard },
  { path: "/staff/support&department", component: CallregistrationList }
]

export default dashBoardRoutes
