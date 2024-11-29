import LeaveApprovalAndPending from "../../../components/common/LeaveApprovalAndPending"
import ComingSoon from "../../../pages/common/ComingSoon"
import ExcelUploader from "../../../pages/primaryUser/converter/ExcelUploader"
import LeaveApplication from "../../../components/primaryUser/LeaveApplication"

const tasksRoutes = [
  { path: "/admin/tasks/signUp-customer", component: ComingSoon },

  { path: "/admin/tasks/productMerge", component: ComingSoon },

  {
    path: "/admin/tasks/productAllocation-Pending",
    component: ComingSoon
  },
  {
    path: "/admin/tasks/leaveApproval-pending",
    component: ComingSoon
  },
  { path: "/admin/tasks/workAllocation", component: ComingSoon },
  { path: "/admin/tasks/excelconverter", component: ExcelUploader }
]

export default tasksRoutes
