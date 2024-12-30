import ComingSoon from "../../pages/common/ComingSoon"
import Summary from "../../pages/primaryUser/List/Summary"
import ExpiredCustomer from "../../pages/primaryUser/List/ExpiredCustomer"
import AccountSearch from "../../pages/primaryUser/List/AccountSearch"
import LeaveRegister from "../../pages/primaryUser/calender/LeaveRegister"
const staffreportsRoutes = [
  { path: "/staff/reports/summary", component: ComingSoon },
  { path: "/staff/reports/expiry-register", component: ExpiredCustomer },

  { path: "/staff/reports/customer-contact", component: ComingSoon },

  { path: "/staff/reports/account-search", component: AccountSearch },
  { path: "/staff/reports/leave-summary", component: ComingSoon }
]

export default staffreportsRoutes
