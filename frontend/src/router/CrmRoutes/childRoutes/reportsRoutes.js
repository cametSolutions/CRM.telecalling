import ComingSoon from "../../../pages/common/ComingSoon"
import Summary from "../../../pages/primaryUser/List/Summary"
import ExpiredCustomer from "../../../pages/primaryUser/List/ExpiredCustomer"
import AccountSearch from "../../../pages/primaryUser/List/AccountSearch"
import LeaveRegister from "../../../pages/primaryUser/calender/LeaveRegister"
const reportsRoutes = [
  { path: "/admin/reports/summary", component: Summary },

  { path: "/admin/reports/expiry-register", component: ExpiredCustomer },

  { path: "/admin/reports/customer-contacts", component: ComingSoon },

  { path: "/admin/reports/account-search", component: AccountSearch },

  { path: "/admin/reports/leave-summary", component: ComingSoon }
]

export default reportsRoutes
