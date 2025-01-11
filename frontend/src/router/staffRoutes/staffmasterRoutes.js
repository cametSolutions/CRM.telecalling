import CompanyList from "../../pages/primaryUser/List/CompanyList"
import CompanyRegistration from "../../pages/primaryUser/register/CompanyRegistration"
import BranchRegistration from "../../pages/primaryUser/register/BranchRegistration"
import CustomerRegistration from "../../pages/secondaryUser/register/CustomerRegistration"
import CustomerEdit from "../../pages/secondaryUser/edit/CustomerEdit"
import { CallNoteRegistration } from "../../pages/primaryUser/register/CallNoteRegistration"
import { PartnerRegistration } from "../../pages/primaryUser/register/PartnerRegistration"
import BranchList from "../../pages/primaryUser/List/BranchList"
import CompanyEdit from "../../pages/primaryUser/edit/CompanyEdit"
import BranchEdit from "../../pages/primaryUser/edit/BranchEdit"
import BrandRegistration from "../../pages/primaryUser/register/BrandRegistration"
import CategoryRegistration from "../../pages/primaryUser/register/CategoryRegistration"
import HsnCreation from "../../pages/primaryUser/register/HsnCreation"
import HsnList from "../../pages/primaryUser/register/HsnList"
import EditHsn from "../../pages/primaryUser/edit/EditHsn"
import ProductMaster from "../../pages/primaryUser/register/ProductMaster"
import CustomerListform from "../../components/secondaryUser/CustomerListform"
import ProductList from "../../pages/primaryUser/List/ProductList"
import ComingSoon from "../../pages/common/ComingSoon"
import PendingCustomer from "../../components/secondaryUser/PendingCustomer"
import ProductEdit from "../../pages/primaryUser/edit/ProductEdit"
import UserListform from "../../pages/primaryUser/List/UserListform"
import UserPermissions from "../../pages/primaryUser/List/UserPermissions"

import DepartmentRegistration from "../../pages/primaryUser/register/DepartmentRegistration"
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
  {
    path: "/staff/masters/callnotes",
    component: CallNoteRegistration
  },
  {path:"/staff/masters/partners",component:PartnerRegistration},
  { path: "/staff/masters/branchEdit", component: BranchEdit },
  { path: "/staff/masters/customer", component: CustomerListform },
  { path: "/staff/masters/customerEdit", component: CustomerEdit },
  { path: "/staff/masters/pendingCustomer", component: PendingCustomer },
  {
    path: "/staff/masters/customerRegistration",
    component: CustomerRegistration
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
  { path: "/staff/masters/users-&-passwords", component: UserListform },

  { path: "/staff/masters/menurights", component: UserPermissions },

  { path: "/staff/masters/vouchermaster", component: ComingSoon },
  { path: "/staff/masters/target", component: ComingSoon },
  { path: "/staff/masters/product", component: ProductList },

  { path: "/staff/masters/partners", component: ComingSoon },
  { path: "/staff/masters/department", component: DepartmentRegistration }
]

export default staffmastersRoutes
