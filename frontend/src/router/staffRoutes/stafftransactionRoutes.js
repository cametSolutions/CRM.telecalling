import LeaveApplication from "../../components/primaryUser/LeaveApplication"
import CallRegistration from "../../pages/primaryUser/register/CallRegistration"
import LeadAllocationTable from "../../pages/primaryUser/List/LeadAllocationTable"
import LeadFollowUp from "../../pages/primaryUser/List/LeadFollowUp"
// import ComingSoon from "../../pages/common/ComingSoon"
import LeadEdit from "../../pages/primaryUser/edit/LeadEdit"
import LeadRegister from "../../pages/primaryUser/register/LeadRegister"
import OwnLeadList from "../../pages/common/OwnLeadList"
import DemoFollowUp from "../../pages/primaryUser/List/DemoFollowUp"
const stafftransactionsRoutes = [
  { path: "/staff/transaction/lead", component: LeadRegister },
  { path: "/staff/transaction/call-registration", component: CallRegistration },
  { path: "/staff/transaction/leave-application", component: LeaveApplication },
  {
    path: "/staff/transaction/lead/leadAllocation",
    component: LeadAllocationTable
  },
  { path: "/staff/transaction/lead/ownedLeadlist", component: OwnLeadList },
  { path: "/staff/transaction/lead/leadEdit", component: LeadEdit },
  { path: "/staff/transaction/lead/leadFollowUp", component: LeadFollowUp },
  { path: "/staff/transaction/lead/demoFollowup", component: DemoFollowUp }
]

export default stafftransactionsRoutes
