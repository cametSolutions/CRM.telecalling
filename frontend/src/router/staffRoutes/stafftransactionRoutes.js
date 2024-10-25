import LeaveApplication from "../../components/primaryUser/LeaveApplication"
import CallRegistration from "../../pages/primaryUser/register/CallRegistration"
const stafftransactionsRoutes = [
  { path: "/staff/transaction/lead", title: "Lead" },
  { path: "/staff/transaction/call-registration", component: CallRegistration },
  { path: "/staff/transaction/leave-application", component:LeaveApplication }
]

export default stafftransactionsRoutes
