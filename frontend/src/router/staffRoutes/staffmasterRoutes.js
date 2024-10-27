// import CompanyList from "../../pages/primaryUser/List/CompanyList"
import CompanyList from "../../pages/primaryUser/List/CompanyList"
import CompanyRegistration from "../../pages/primaryUser/register/CompanyRegistration"
import BranchRegistration from "../../pages/primaryUser/register/BranchRegistration"
import CustomerRegistration from "../../pages/secondaryUser/register/CustomerRegistration"
import CustomerEdit from "../../pages/secondaryUser/edit/CustomerEdit"
import UserRegistration from "../../pages/primaryUser/register/UserRegistration"
import BranchList from "../../pages/primaryUser/List/BranchList"
import CompanyEdit from "../../pages/primaryUser/edit/CompanyEdit"
import BranchEdit from "../../pages/primaryUser/edit/BranchEdit"
import BrandRegistration from "../../pages/primaryUser/register/BrandRegistration"
import CategoryRegistration from "../../pages/primaryUser/register/CategoryRegistration"
import HsnCreation from "../../pages/primaryUser/register/HsnCreation"
import HsnList from "../../pages/primaryUser/register/HsnList"
import EditHsn from "../../pages/primaryUser/edit/EditHsn"
import ProductMaster from "../../pages/primaryUser/register/ProductMaster"
// import CustomerList from "../../pages/primaryUser/List/CustomerList"
import CustomerListform from "../../components/secondaryUser/CustomerListform"
import ProductList from "../../pages/primaryUser/List/ProductList"

import PendingCustomer from "../../components/secondaryUser/PendingCustomer"
import ProductEdit from "../../pages/primaryUser/edit/ProductEdit"
const staffmastersRoutes = [
  {
    path: "/staff/masters/company",

    component: CompanyList
  },
  {
    path: "/staff/masters/companyRegistration",

    component: CompanyRegistration
  },
  { path: "/staff/masters/companyEdit", component: CompanyEdit },

  { path: "/staff/masters/branch", component: BranchList },
  {
    path: "/staff/masters/branchRegistration",

    component: BranchRegistration
  },
  { path: "/staff/masters/branchEdit", component: BranchEdit },
  { path: "/staff/masters/customer", component: CustomerListform },
  { path: "/staff/masters/pendingCustomer", component: PendingCustomer },
  {
    path: "/staff/masters/customerRegistration",
    component: CustomerRegistration
  },
  { path: "/staff/maseters/customerEdit", component: CustomerEdit },
  {
    path: "/staff/masters/users&passwords",
    component: UserRegistration
  },
  {
    path: "/staff/masters/inventory/brandRegistration",
    component: BrandRegistration
  },

  {
    path: "/staff/masters/inventory/categoryRegistration",

    component: CategoryRegistration
  },
  {
    path: "/staff/masters/inventory/hsnCreation",

    component: HsnCreation
  },
  {
    path: "/staff/masters/inventory/hsnlist",
    component: HsnList
  },
  {
    path: "/staff/masters/inventory/editHsn",
    component: EditHsn
  },
  {
    path: "/staff/masters/product",
    component: ProductList
  },
  { path: "/staff/masters/productEdit", component: ProductEdit },
  { path: "/staff/masters/productRegistration", component: ProductMaster },
  { path: "/staff/masters/users-&-passwords", component: UserRegistration },

  { path: "/staff/masters/menurights", title: "Menu Rights" },

  { path: "/staff/masters/vouchermaster", title: "Voucher Master" },
  { path: "/staff/masters/target", title: "Target" },
  { path: "/staff/masters/product", title: "Product" },
  { path: "/staff/masters/customerImport", title: "Customer Import" },
  { path: "/staff/masters/partners", title: "Partners" },
  { path: "/staff/masters/deapartment", title: "Department" }
]

export default staffmastersRoutes
