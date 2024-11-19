import ComingSoon from "../../../pages/common/ComingSoon"
import Summary from "../../../pages/primaryUser/List/Summary"
import ExpiredCustomer from "../../../pages/primaryUser/List/ExpiredCustomer"
import ExpiredCustomerCalls from "../../../pages/primaryUser/List/ExpiredCustomerCalls"
const reportsRoutes = [
  { path: "/admin/reports/summary", component: Summary },

  { path: "/admin/reports/expiry-register", component: ExpiredCustomer },
  {
    path: "/admin/reports/expired-customerCalls",

    component: ExpiredCustomerCalls
  },
  {
    path: "/admin/reports/customer-callSummary",

    component: ComingSoon
  },
  { path: "/admin/reports/customer-contacts", component: ComingSoon },

  {
    path: "/admin/reports/customer-actionSummary",
    component: ComingSoon
  },
  { path: "/admin/reports/account-search", component: ComingSoon },

  { path: "/admin/reports/leave-summary", component: ComingSoon }
]

export default reportsRoutes
