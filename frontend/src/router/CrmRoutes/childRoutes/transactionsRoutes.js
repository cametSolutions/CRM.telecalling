import LeaveApplication from "../../../components/primaryUser/LeaveApplication"
import ComingSoon from "../../../pages/common/ComingSoon"
import CallRegistration from "../../../pages/primaryUser/register/CallRegistration"
const transactionsRoutes = [
  { path: "/admin/transaction/lead", component: ComingSoon },
  { path: "/admin/transaction/call-registration", component: CallRegistration },

  { path: "/admin/transaction/leave-application", component: ComingSoon }
]

export default transactionsRoutes
