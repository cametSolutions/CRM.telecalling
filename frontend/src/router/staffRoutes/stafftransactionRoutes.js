import LeaveApplication from "../../components/primaryUser/LeaveApplication"
import CallRegistration from "../../pages/primaryUser/register/CallRegistration"
import LeadAllocationTable from "../../pages/primaryUser/List/LeadAllocationTable"
import ComingSoon from "../../pages/common/ComingSoon"
import LeadRegister from "../../pages/primaryUser/register/LeadRegister"
const stafftransactionsRoutes = [
  { path: "/staff/transaction/lead", component: ComingSoon },
  { path: "/staff/transaction/call-registration", component: CallRegistration },
  { path: "/staff/transaction/leave-application", component: LeaveApplication },
  {
    path: "/staff/transaction/lead/leadAllocation",
    component: ComingSoon
  }
]

export default stafftransactionsRoutes
