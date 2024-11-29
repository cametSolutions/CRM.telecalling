import ComingSoon from "../../pages/common/ComingSoon"
import SiteVisit from "../../pages/common/SiteVisit"
import ExcelUploader from "../../pages/primaryUser/converter/ExcelUploader"
import LeaveApprovalAndPending from "../../components/common/LeaveApprovalAndPending"
const stafftasksRoutes = [
  { path: "/staff/tasks/signup-customer", component: ComingSoon },

  {
    path: "/staff/tasks/leaveApproval-pending",
    component: ComingSoon
  },
  { path: "/staff/tasks/workAllocation", component: ComingSoon },

  { path: "/staff/tasks/excelconverter", component: ExcelUploader }
]

export default stafftasksRoutes
