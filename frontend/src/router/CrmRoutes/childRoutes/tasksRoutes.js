import LeaveApprovalAndPending from "../../../components/common/LeaveApprovalAndPending"
import ExcelUploader from "../../../pages/primaryUser/converter/ExcelUploader"

const tasksRoutes = [
  { path: "/admin/tasks/signup-customer", title: "SignUp Customer" },
  { path: "/admin/tasks/productMerge", title: "Product Merge" },

  {
    path: "/admin/tasks/productAllocation-Pending",
    title: "Product Allocation Pending"
  },
  {
    path: "/admin/tasks/leaveApproval-pending",
    component: LeaveApprovalAndPending
  },
  { path: "/admin/tasks/workAllocation", title: "Work Allocation" },
  { path: "/admin/tasks/excelconverter", component: ExcelUploader }
]

export default tasksRoutes
