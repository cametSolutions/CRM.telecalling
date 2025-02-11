import LeaveApprovalAndPending from "../../../components/common/LeaveApprovalAndPending"
import ComingSoon from "../../../pages/common/ComingSoon"
import ExcelUploader from "../../../pages/primaryUser/converter/ExcelUploader"
import LeaveApplication from "../../../components/primaryUser/LeaveApplication"
import AttendanceExcelUploader from "../../../pages/primaryUser/converter/AttendanceExcelUploader"

const tasksRoutes = [
  { path: "/admin/tasks/signUp-customer", component: ComingSoon },

  { path: "/admin/tasks/productMerge", component: ComingSoon },

  {
    path: "/admin/tasks/productAllocation-Pending",
    component: ComingSoon
  },
  {
    path: "/admin/tasks/leaveApproval-pending",
    component: LeaveApprovalAndPending
  },
  { path: "/admin/tasks/workAllocation", component: ComingSoon },
  { path: "/admin/tasks/excelconverter", component: ExcelUploader },

  {
    path: "/admin/tasks/attendanceExcelconverter",
    component: AttendanceExcelUploader
  }
]

export default tasksRoutes
