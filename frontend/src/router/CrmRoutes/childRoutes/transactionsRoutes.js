import LeaveRegister from "../../../pages/primaryUser/calender/LeaveRegister"
import CallRegistration from "../../../pages/primaryUser/register/CallRegistration"
const transactionsRoutes = [
  { path: "/admin/transaction/lead", title: "Lead" },
  { path: "/admin/transaction/call-registration", component: CallRegistration },
  
  { path: "/admin/transaction/leave-application", component: LeaveRegister }
]

export default transactionsRoutes
