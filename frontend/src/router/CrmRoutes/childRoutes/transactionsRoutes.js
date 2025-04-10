import LeaveApplication from "../../../components/primaryUser/LeaveApplication"
import ComingSoon from "../../../pages/common/ComingSoon"
import CallRegistration from "../../../pages/primaryUser/register/CallRegistration"
import LeadRegister from "../../../pages/primaryUser/register/LeadRegister"
import LeadAllocationTable from "../../../pages/primaryUser/List/LeadAllocationTable"
import LeadEdit from "../../../pages/primaryUser/edit/LeadEdit"
import { components } from "react-select"
const transactionsRoutes = [
  { path: "/admin/transaction/lead", component: LeadRegister },
  { path: "/admin/transaction/leadEdit", component: LeadEdit },

  { path: "/admin/transaction/call-registration", component: CallRegistration },

  { path: "/admin/transaction/leave-application", component: LeaveApplication },
  {
    path: "/admin/transaction/lead/leadAllocation",
    component: LeadAllocationTable
  }
]

export default transactionsRoutes
