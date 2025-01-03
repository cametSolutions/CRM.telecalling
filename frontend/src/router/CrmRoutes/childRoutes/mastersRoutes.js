import CompanyList from "../../../pages/primaryUser/List/CompanyList"
import CompanyRegistration from "../../../pages/primaryUser/register/CompanyRegistration"
import BranchRegistration from "../../../pages/primaryUser/register/BranchRegistration"
import CustomerRegistration from "../../../pages/secondaryUser/register/CustomerRegistration"
import CustomerEdit from "../../../pages/secondaryUser/edit/CustomerEdit"
import UserRegistration from "../../../pages/primaryUser/register/UserRegistration"
import BranchList from "../../../pages/primaryUser/List/BranchList"
import CompanyEdit from "../../../pages/primaryUser/edit/CompanyEdit"
import BranchEdit from "../../../pages/primaryUser/edit/BranchEdit"
import BrandRegistration from "../../../pages/primaryUser/register/BrandRegistration"
import CategoryRegistration from "../../../pages/primaryUser/register/CategoryRegistration"
import HsnCreation from "../../../pages/primaryUser/register/HsnCreation"
import HsnList from "../../../pages/primaryUser/register/HsnList"
import EditHsn from "../../../pages/primaryUser/edit/EditHsn"
import ProductMaster from "../../../pages/primaryUser/register/ProductMaster"
import DepartmentRegistration from "../../../pages/primaryUser/register/DepartmentRegistration"
import CustomerListform from "../../../components/secondaryUser/CustomerListform"
import ProductList from "../../../pages/primaryUser/List/ProductList"
import UserEdit from "../../../pages/primaryUser/edit/UserEdit"
import PendingCustomer from "../../../components/secondaryUser/PendingCustomer"
import ProductEdit from "../../../pages/primaryUser/edit/ProductEdit"
import UserListform from "../../../pages/primaryUser/List/UserListform"
import UserPermissions from "../../../pages/primaryUser/List/UserPermissions"
import ComingSoon from "../../../pages/common/ComingSoon"
import { CallNoteRegistration } from "../../../pages/primaryUser/register/CallNoteRegistration"

const mastersRoutes = [
  {
    path: "/admin/masters/company",

    component: CompanyList
  },
  {
    path: "/admin/masters/callnotes",
    component: CallNoteRegistration
  },
  {
    path: "/admin/masters/companyRegistration",

    component: CompanyRegistration
  },
  { path: "/admin/masters/companyEdit", component: CompanyEdit },

  { path: "/admin/masters/branch", component: BranchList },
  {
    path: "/admin/masters/branchRegistration",

    component: BranchRegistration
  },

  { path: "/admin/masters/branchEdit", component: BranchEdit },
  { path: "/admin/masters/customer", component: CustomerListform },
  { path: "/admin/masters/pendingCustomer", component: PendingCustomer },
  {
    path: "/admin/masters/customerRegistration",
    component: ComingSoon
  },
  { path: "/admin/masters/customerEdit", component: ComingSoon },
  {
    path: "/admin/masters/userRegistration",
    component: UserRegistration
  },
  {
    path: "/admin/masters/userEdit",
    component: UserEdit
  },
  {
    path: "/admin/masters/inventory/brandRegistration",
    component: BrandRegistration
  },

  {
    path: "/admin/masters/inventory/categoryRegistration",

    component: CategoryRegistration
  },
  {
    path: "/admin/masters/inventory/hsnCreation",

    component: HsnCreation
  },
  {
    path: "/admin/masters/inventory/hsnlist",
    component: HsnList
  },
  {
    path: "/admin/masters/inventory/editHsn",
    component: EditHsn
  },
  {
    path: "/admin/masters/product",
    component: ProductList
  },
  { path: "/admin/masters/productEdit", component: ProductEdit },
  { path: "/admin/masters/productRegistration", component: ProductMaster },
  { path: "/admin/masters/users-&-passwords", component: UserListform },

  { path: "/admin/masters/menurights", component: UserPermissions },

  { path: "/admin/masters/vouchermaster", component: ComingSoon },
  { path: "/admin/masters/target", component: ComingSoon },

  { path: "/admin/masters/partners", component: ComingSoon },
  { path: "/admin/masters/department", component: DepartmentRegistration }
]

export default mastersRoutes
