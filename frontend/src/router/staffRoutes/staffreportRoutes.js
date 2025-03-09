import ComingSoon from "../../pages/common/ComingSoon"
import Summary from "../../pages/primaryUser/List/Summary"
import ExpiredCustomer from "../../pages/primaryUser/List/ExpiredCustomer"
import AccountSearch from "../../pages/primaryUser/List/AccountSearch"
import leaveSummary from "../../components/primaryUser/LeaveSummary"
const staffreportsRoutes = [
  { path: "/staff/reports/summary", component: Summary },
  { path: "/staff/reports/expiry-register", component: ExpiredCustomer },

  { path: "/staff/reports/customer-contact", component: ComingSoon },

  { path: "/staff/reports/account-search", component: AccountSearch },
  { path: "/staff/reports/leave-summary", component: leaveSummary }
]

export default staffreportsRoutes
