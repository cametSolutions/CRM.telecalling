// import { useState, useEffect, useRef } from "react"
// import { Link, NavLink, useNavigate } from "react-router-dom"
// import { toast } from "react-toastify"
// import api from "../api/api"
// import { FiMessageCircle } from "react-icons/fi"
// import { FiLogOut } from "react-icons/fi"
// import { FaChevronRight, FaChevronDown } from "react-icons/fa"
// import { FaSignOutAlt } from "react-icons/fa"
// import UseFetch from "../hooks/useFetch"
// import { FaUserCircle } from "react-icons/fa" // Import the icon
// export default function StaffHeader() {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
//   const [mathcheddemoleadcount, setmathcheddemoleadcount] = useState(0)
//   const [user, setUser] = useState(null)
//   const [leadMenuOpen, setLeadMenuOpen] = useState(false)
//   const [transactionMenuOpen, setTransactionMenuOpen] = useState(false)
//   const [masterMenuOpen, setMasterMenuOpen] = useState(false)
//   const [reportsMenuOpen, setReportsMenuOpen] = useState(false)
//   const [tasksMenuOpen, setTasksMenuOpen] = useState(false)
//   const [openSubmenu, setOpenSubmenu] = useState(null)
//   const [activeSubmenu, setActiveSubmenu] = useState(null)
//   const [profileMenuOpen, setProfileMenuOpen] = useState(false)
//   const [inventoryMenuOpen, setInventoryMenuOpen] = useState(false)
//   const [openInnerMenu, setOpenInnerMenu] = useState(null) // Inner submenu state
//   const navigate = useNavigate()

//   const menuContainerRef = useRef(null)
//   const { data: demoleadcount } = UseFetch(
//     user && `/lead/demoleadcount?loggeduserid=${user._id}`
//   )
//   useEffect(() => {
//     if (demoleadcount > 0) {
//       setmathcheddemoleadcount(demoleadcount)
//     }
//   }, [demoleadcount])
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user")
//     console.log(storedUser)
//     console.log(JSON.parse(storedUser))
//     if (storedUser) {
//       setUser(JSON.parse(storedUser)) // Parse the user data from string to object
//     }
//   }, [])

//   const toggleInnerMenu = (innerIndex) => {
//     setOpenInnerMenu(openInnerMenu === innerIndex ? null : innerIndex)
//   }
//   const toggleSubmenu = (index) => {
//     const newActiveSubmenu = activeSubmenu === index ? null : index
//     setActiveSubmenu(newActiveSubmenu)

//     // Scroll to keep the active submenu in view after a small delay to allow render
//     if (newActiveSubmenu !== null) {
//       setTimeout(() => {
//         const menuItem = document.querySelector(`.menu-item-${index}`)
//         if (menuItem && menuContainerRef.current) {
//           const containerRect = menuContainerRef.current.getBoundingClientRect()
//           const itemRect = menuItem.getBoundingClientRect()

//           // If submenu would extend beyond visible area, scroll to show it
//           if (itemRect.bottom + 200 > containerRect.bottom) {
//             // 200px buffer for submenu
//             menuContainerRef.current.scrollTop +=
//               itemRect.bottom + 200 - containerRect.bottom
//           }
//         }
//       }, 50)
//     }
//   }
//   const logout = async () => {
//     try {
//       const res = await api.post("/auth/logout") // Call backend

//       // ✅ Check if backend returned success
//       if (
//         res.status === 200 &&
//         res.data?.message === "Logged out successfully"
//       ) {
//         // Clear localStorage only after successful logout
//         localStorage.removeItem("authToken")
//         localStorage.removeItem("user")
//         localStorage.removeItem("timer")
//         localStorage.removeItem("wish")

//         toast.success("Logout successfully")

//         // Redirect to login page
//         navigate("/")
//       } else {
//         toast.error("Logout failed on server")
//       }
//     } catch (err) {
//       console.error("Logout API failed:", err)
//       toast.error("Logout failed, please try again")
//     }
//   }

//   const links = [
//     { to: "/staff/dashBoard", label: "Dashboard" },
//     { label: "Masters" },
//     { label: "Transactions" },
//     { label: "Reports" },
//     { label: "Task" }
//   ]
//   const desiredMobileMenu = [
//     { label: "Transactions" },
//     { label: "Reports" },
//     { label: "Task" }
//   ]

//   const masters = [
//     {
//       to: "/staff/masters/company",
//       label: "Company",
//       control: user?.permissions?.[0]?.Company ?? false
//     },
//     {
//       to: "/staff/masters/branch",
//       label: "Branch",
//       control: user?.permissions?.[0]?.Branch ?? false
//     },
//     {
//       to: "/staff/masters/department",
//       label: "Department",
//       control: user?.permissions?.[0]?.Department ?? false
//     },
//     {
//       label: "Product & Service",
//       hasChildren: true,
//       control: user?.permissions?.[0]?.ProductandServices ?? false
//     },
//     {
//       to: "/staff/masters/customer",
//       label: "Customer",
//       control: user?.permissions?.[0]?.Customer ?? false
//     },
//     {
//       label: "Employee",
//       hasChildren: true,
//       control: user?.permissions?.[0]?.Employee ?? false
//     },

//     {
//       to: "/staff/masters/leavemaster",
//       label: "Leavemaster",
//       control: user?.permissions?.[0]?.Leavemaster ?? false
//     },

//     {
//       to: "/staff/masters/partners",
//       label: "Partners",
//       control: user?.permissions?.[0]?.Partners ?? false
//     }
//   ]
//   console.log(user?.permissions)
//   console.log(user?.permissions[0])
//   const ProductandServices = [
//     {
//       to: "/staff/masters/product",
//       label: "Product",
//       control: user?.permissions?.[0]?.Product ?? false
//     },
//     {
//       to: "/staff/masters/servicesRegistration",
//       label: "Services",
//       control: user?.permissions?.[0]?.Services ?? false
//     },
//     {
//       to: "/staff/masters/inventory/brandRegistration",
//       label: "Brand",
//       control: user?.permissions?.[0]?.Brand ?? false
//     },
//     {
//       to: "/staff/masters/inventory/categoryRegistration",
//       label: "Category",
//       control: user?.permissions?.[0]?.Category ?? false
//     },
//     {
//       to: "/staff/masters/inventory/hsnlist",
//       label: "HSN",
//       control: user?.permissions?.[0]?.HSN ?? false
//     },
//     {
//       to: "/staff/masters/callnotes",
//       label: "Call Notes",
//       control: user?.permissions?.[0]?.CallNotes ?? false
//     },
//     {
//       to: "/staff/masters/taskRegistration",
//       label: "Task Level",
//       control: user?.permissions?.[0]?.TaskLevel ?? false
//     }
//   ]
//   const Employee = [
//     {
//       to: "/staff/masters/users-&-passwords",
//       label: "users & Passwords",
//       control: user?.permissions?.[0]?.UsersAndPasswords ?? false
//     },
//     {
//       to: "/staff/masters/menuRights",
//       label: "Menu Rights",
//       control: user?.permissions?.[0]?.MenuRights ?? false
//     },
//     {
//       to: "/staff/masters/target",
//       label: "Target",
//       control: user?.permissions?.[0]?.Target ?? false
//     },
//     {
//       to: "/staff/masters/voucherMaster",
//       label: "Voucher Master",
//       control: user?.permissions?.[0]?.VoucherMaster ?? false
//     }
//   ]
//   const leads = [
//     { to: "/staff/transaction/lead", label: "New Lead", control: true },
//     {
//       to: "/staff/transaction/lead/ownedLeadlist",
//       label: "Own Lead",
//       control: true
//     },

//     {
//       to: "/staff/transaction/lead/leadAllocation",
//       label: "Lead Allocation",
//       control: user?.permissions?.[0]?.LeadAllocation ?? false
//     },
//     {
//       to: "/staff/transaction/lead/leadFollowUp",
//       label: "Lead Follow Up",
//       control: user?.permissions?.[0]?.LeadFollowUp ?? false
//     },
//     {
//       to: "/staff/transaction/lead/leadTask",
//       label: "Task Pending",
//       control: true
//     },

//     {
//       to: "/staff/transaction/lead/leadReallocation",
//       label: "Lead Reallocation",
//       control: user?.permissions?.[0]?.LeadReallocation ?? false
//     },
//     {
//       to: "/staff/transaction/lead/taskAnalysis",
//       label: "Task Analysis",
//       control: user?.permissions?.[0]?.TaskAnalysis ?? false
//     },
//     {
//       to: "/staff/transaction/lead/collectionUpdate",
//       label: "Collection Update",
//       control: user?.permissions?.[0]?.CollectionUpdate
//     }
//     // {
//     //   to: "/staff/transaction/lead/paymenthistory",
//     //   label: "Payment History",
//     //   control: true
//     // }
//   ]
//   console.log(user?.permissions?.[0])
//   console.log(user?.permissions?.[0]?.CollectionUpdate)
//   const inventorys = [
//     {
//       to: "/staff/masters/inventory/brandRegistration",
//       label: "Brand"
//       // control: user.permissions[0].Brand
//     },
//     {
//       to: "/staff/masters/inventory/categoryRegistration",
//       label: "Category"
//       // control: user.permissions[0].Category
//     },
//     {
//       to: "/staff/masters/inventory/hsnlist",
//       label: "HSN"
//       // control: user.permissions[0].HSN
//     }
//   ]
//   console.log(user?.permission?.[0])
//   const reports = [
//     {
//       to: "/staff/reports/summary",
//       label: " Call Summary",
//       control: user?.permissions?.[0]?.Summary ?? false
//     },
//     {
//       to: "/staff/reports/expiry-register",
//       label: "Expiry Register",
//       control: user?.permissions?.[0]?.ExpiryRegister ?? false
//     },

//     {
//       to: "/staff/reports/account-search",
//       label: "Account Search",
//       control: user?.permissions?.[0]?.AccountSearch ?? false
//     },
//     {
//       to: "/staff/reports/leave-summary",
//       label: "Leave Summary",
//       control: user?.permissions?.[0]?.LeaveSummary ?? false
//     },
//     {
//       to: "/staff/reports/markettingdashboard",
//       label: "Marketing Dashboard",
//       control: true
//     }
//   ]
//   const transactions = [
//     {
//       label: "Lead",
//       control: user?.permissions?.[0]?.Lead ?? false,
//       hasChildren: true
//     },
//     {
//       to: "/staff/transaction/call-registration",
//       label: "Call Registration",
//       control: user?.permissions?.[0]?.CallRegistration ?? false
//     },
//     {
//       to: "/staff/transaction/leave-application",
//       label: "Leave Application",
//       control: user?.permissions?.[0]?.LeaveApplication ?? false
//     }
//   ]
//   const tasks = [
//     {
//       to: "/staff/tasks/signUp-customer",
//       label: "Sign Up Custmer",
//       control: user?.permissions?.[0]?.SignUpCustomer
//     },

//     {
//       to: "/staff/tasks/leaveApproval-pending",
//       label: "Leave Approval Pending",
//       control: user?.permissions?.[0]?.LeaveApprovalPending ?? false
//     },
//     {
//       to: "/staff/tasks/workAllocation",
//       label: "Work Allocation",
//       control: user?.permissions?.[0]?.WorkAllocation ?? false
//     },
//     {
//       to: "/staff/tasks/excelconverter",
//       label: "Excel Converter",
//       control: user?.permissions?.[0]?.ExcelConverter ?? false
//     }
//   ]
//   return (
//     <header className="sticky top-0 z-50 flex items-center md:justify-between bg-green-600 px-2 md:px-4 lg:px-6 h-16 md:h-18 lg:h-18">
//       {/* <header className="sticky top-0 z-40 flex items-center justify-between bg-white shadow-md px-2 md:px-4 lg:px-6 h-16 md:h-18 lg:h-20 overflow-hidden"> */}
//       {/* Mobile menu button */}
//       <div className="md:hidden flex justify-between py-2 md:px-4">
//         <button
//           onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//           className="hover:text-red-800 focus:outline-none"
//         >
//           <svg
//             className="w-6 h-6"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M4 6h16M4 12h16m-7 6h7"
//             ></path>
//           </svg>
//         </button>
//       </div>
//       {/* Mobile menu overlay */}
//       {mobileMenuOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40"
//           onClick={() => setMobileMenuOpen(false)}
//         ></div>
//       )}

//       {/* Mobile menu */}
//       <div
//         className={`sm:hidden fixed top-0 left-0 z-50 bg-white shadow-lg w-3/5 h-screen transition-transform duration-300 flex flex-col ${
//           mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         <div className="flex items-center space-x-2 p-2">
//           <svg
//             className="w-12 h-12 text-white"
//             viewBox="0 0 64 64"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <circle
//               cx="32"
//               cy="32"
//               r="30"
//               stroke="currentColor"
//               strokeWidth="4"
//               fill="none"
//             />
//             <path
//               d="M32 2 A30 30 0 0 1 32 62"
//               stroke="currentColor"
//               strokeWidth="4"
//               fill="none"
//             />
//             <text
//               x="50%"
//               y="50%"
//               textAnchor="middle"
//               fill="currentColor"
//               fontSize="18"
//               fontFamily="Arial, Helvetica, sans-serif"
//               dy=".3em"
//             >
//               CRm
//             </text>
//           </svg>
//           <span className="text-md sm:text-2xl md:text-2xl lg:text-3xl font-bold text-white">
//             MANAGEMENT
//           </span>

//           {/* <span className="text-3xl font-bold text-green-600">MANAGEMENT</span> */}
//         </div>
//         <hr className="border-t-4 border-gray-300" />
//         <div className="p-2 flex text-black text-center items-center space-x-4">
//           <FaUserCircle className="w-6 h-6" />
//           <span>{user?.name}</span>
//         </div>
//         <div className="flex items-center space-x-2 pl-4">
//           <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
//           <span>{user?.role}</span>
//         </div>

//         <div className="text-black bg-gray-200 py-1 px-4">
//           {user?.selected?.[0]?.branchName}
//         </div>

//         <div className="text-gray-500 mt-3 px-4">Menu</div>

//         {/* Menu - Scrollable */}
//         <div className="flex-grow  block leading-10 text-black">
//           {desiredMobileMenu.map((link, index) => (
//             <div key={index} className={`relative menu-item-${index}`}>
//               <div
//                 className={`flex items-center px-8 hover:bg-gray-200 cursor-pointer menu-trigger-${index}`}
//                 onClick={() => toggleSubmenu(index)}
//               >
//                 {link.to ? (
//                   <Link
//                     to={link.to}
//                     className="block  flex-grow"
//                     onClick={(e) => {
//                       e.stopPropagation()
//                       setMobileMenuOpen(false)
//                     }}
//                   >
//                     {link.label}
//                   </Link>
//                 ) : (
//                   <span className="block  flex-grow">{link.label}</span>
//                 )}

//                 {activeSubmenu === index ? (
//                   <FaChevronDown className="w-3 h-3 text-gray-500" />
//                 ) : (
//                   <FaChevronRight className="w-3 h-3 text-gray-500" />
//                 )}
//               </div>

//               {/* Submenu */}
//               {activeSubmenu === index && (
//                 <div
//                   ref={menuContainerRef}
//                   className="bg-white border-l-4 border-green-400 max-h-64 overflow-y-auto"
//                 >
//                   {["Transactions", "Reports", "Task"].includes(link.label)
//                     ? (link.label === "Transactions"
//                         ? transactions
//                         : link.label === "Reports"
//                           ? reports
//                           : link.label === "Task"
//                             ? tasks
//                             : null
//                       )
//                         .filter(
//                           (master) =>
//                             (master.label === "Leave Application" &&
//                               master.control) ||
//                             (master.label === "Lead" && master.control) ||
//                             (master.label === "Leave Summary" &&
//                               master.control) ||
//                             (master.label === "Leave Approval Pending" &&
//                               master.control)
//                         )
//                         .map((master, masterIndex) => (
//                           <div key={master.to} className="relative ">
//                             <div className="flex justify-between items-center px-4 text-gray-600 text-md hover:bg-gray-200">
//                               {/* Label Click - Always navigate to the main page */}
//                               <span
//                                 className="cursor-pointer flex-1 py-1"
//                                 onClick={() => {
//                                   // setMobileMenuOpen(false)
//                                   navigate(master.to)
//                                   toggleInnerMenu(masterIndex)
//                                 }}

//                                 // e.stopPropagation() // Prevent label's click event
//                               >
//                                 {master.label}
//                               </span>

//                               {/* Chevron Click - Only toggles submenu */}
//                               {master.hasChildren && (
//                                 <span
//                                   // onClick={() =>
//                                   //   // e.stopPropagation() // Prevent label's click event
//                                   //   toggleInnerMenu(masterIndex)
//                                   // }
//                                   className="ml-2 cursor-pointer"
//                                 >
//                                   {openInnerMenu === masterIndex ? (
//                                     <FaChevronDown className="w-3 h-3 text-gray-500" />
//                                   ) : (
//                                     <FaChevronRight className="w-3 h-3 text-gray-500" />
//                                   )}
//                                 </span>
//                               )}
//                             </div>

//                             {/* Submenu: Only for 'Lead' */}
//                             {openInnerMenu === masterIndex &&
//                               master.hasChildren &&
//                               master.label === "Lead" && (
//                                 <div className="ml-4  border-l-4 border-blue-400 bg-gray-50 p-2 submenu-container">
//                                   {leads.map((child) => (
//                                     <NavLink
//                                       key={child.to}
//                                       to={child.to}
//                                       end
//                                       className={({ isActive }) =>
//                                         `block px-4 py-1 text-md ${
//                                           isActive
//                                             ? "bg-blue-100 text-blue-600 font-semibold"
//                                             : "text-gray-600 hover:bg-gray-200"
//                                         }`
//                                       }
//                                     >
//                                       {child.label}
//                                     </NavLink>
//                                     // <Link
//                                     //   key={child.to}
//                                     //   to={child.to}
//                                     //   className="block px-4 py-1 text-gray-600 text-md hover:bg-gray-200"
//                                     // >
//                                     //   {child.label}
//                                     // </Link>
//                                   ))}
//                                 </div>
//                               )}
//                           </div>
//                         ))
//                     : null}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         <div
//           onClick={logout}
//           className=" bg-gray-300  py-5 text-center flex items-center justify-start space-x-2 p-2 cursor-pointer"
//         >
//           <FaSignOutAlt className="w-5 h-5" /> {/* Logout Icon */}
//           <span>Logout</span>
//         </div>
//       </div>

//       {/* Logo and links */}
//       <div className="flex items-center space-x-2 sm:px-4">
//         <svg
//           className="w-12 h-12 text-white"
//           viewBox="0 0 64 64"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <circle
//             cx="32"
//             cy="32"
//             r="30"
//             stroke="currentColor"
//             strokeWidth="4"
//             fill="none"
//           />
//           <path
//             d="M32 2 A30 30 0 0 1 32 62"
//             stroke="currentColor"
//             strokeWidth="4"
//             fill="none"
//           />
//           <text
//             x="50%"
//             y="50%"
//             textAnchor="middle"
//             fill="currentColor"
//             fontSize="18"
//             fontFamily="Arial, Helvetica, sans-serif"
//             dy=".3em"
//           >
//             CRm
//           </text>
//         </svg>
//         <span className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-white">
//           MANAGEMENT
//         </span>

//         {/* <span className="text-3xl font-bold text-green-600">MANAGEMENT</span> */}
//       </div>

//       <nav className="hidden lg:flex  items-center md:gap-3 lg:gap-8 xl:gap-8 text-white">
//         {links.map((link) => (
//           <div
//             key={link.to}
//             className="relative mb-2 "
//             onMouseEnter={() => {
//               if (
//                 link.label === "Masters" &&
//                 masters.some((master) => master.control)
//               ) {
//                 setMasterMenuOpen(true)
//               } else if (
//                 link.label === "Transactions" &&
//                 transactions.some((transaction) => transaction.control)
//               ) {
//                 setTransactionMenuOpen(true)
//               } else if (
//                 link.label === "Reports" &&
//                 reports.some((report) => report.control)
//               ) {
//                 setReportsMenuOpen(true)
//               } else if (
//                 link.label === "Task" &&
//                 tasks.some((task) => task.control)
//               ) {
//                 setTasksMenuOpen(true)
//               }
//             }}
//             onMouseLeave={() => {
//               if (
//                 link.label === "Masters" &&
//                 masters.some((master) => master.control)
//               ) {
//                 setMasterMenuOpen(false)
//               } else if (
//                 link.label === "Transactions" &&
//                 transactions.some((transaction) => transaction.control)
//               ) {
//                 setTransactionMenuOpen(false)
//               } else if (
//                 link.label === "Reports" &&
//                 reports.some((report) => report.control)
//               ) {
//                 setReportsMenuOpen(false)
//               } else if (
//                 link.label === "Task" &&
//                 tasks.some((task) => task.control)
//               ) {
//                 setTasksMenuOpen(false)
//               }
//             }}
//           >
//             <NavLink
//               to={link.to}
//               className={({ isActive }) =>
//                 isActive
//                   ? "text-primary text-xl leading-7 font-bold"
//                   : "text-textColor text-xl leading-7 hover:text-primary"
//               }
//             >
//               {link.label}
//             </NavLink>

//             {/* Masters dropdown */}
//             {link.label === "Masters" &&
//               masterMenuOpen &&
//               masters.some((master) => master.control) && (
//                 <div className="absolute top-full left-0 mt-0 w-48 bg-white border border-gray-200 grid grid-cols-1 shadow-lg rounded-md z-50 ">
//                   {masters.map(
//                     (master) =>
//                       master.control && (
//                         <div
//                           key={master.to}
//                           className="relative mb-2"
//                           onMouseEnter={() => {
//                             if (master.hasChildren) setOpenSubmenu(master.label)
//                           }}
//                           onMouseLeave={() => {
//                             if (master.hasChildren) setOpenSubmenu(null)
//                           }}
//                         >
//                           <Link
//                             to={master.to}
//                             className="flex justify-between px-4 py-1 text-gray-600 text-sm hover:bg-gray-100"
//                           >
//                             {master.label}
//                             {master.hasChildren && <FaChevronRight />}
//                           </Link>

//                           {/* {master.hasChildren && inventoryMenuOpen && (
//                             <div
//                               className="absolute top-0 left-full w-48 bg-white border border-gray-200 shadow-lg rounded-md"
//                               onMouseEnter={() => setInventoryMenuOpen(true)}
//                               onMouseLeave={() => setInventoryMenuOpen(false)}
//                             >
//                               {inventorys.map((inventory) => (
//                                 <Link
//                                   key={inventory.to}
//                                   to={inventory.to}
//                                   className="block px-4 py-2 text-gray-600 text-sm hover:bg-gray-100"
//                                 >
//                                   {inventory.label}
//                                 </Link>
//                               ))}
//                             </div>
//                           )} */}
//                           {master.hasChildren &&
//                             openSubmenu === "Employee" &&
//                             master.label === "Employee" && (
//                               <div className="absolute top-0 left-full w-48 bg-white border border-gray-200 shadow-lg rounded-md">
//                                 {Employee.map(
//                                   (employee) =>
//                                     employee.control && (
//                                       <Link
//                                         key={employee.to}
//                                         to={employee.to}
//                                         className="block px-4 py-2 text-gray-600 text-sm hover:bg-gray-100"
//                                       >
//                                         {employee.label}
//                                       </Link>
//                                     )
//                                 )}
//                               </div>
//                             )}

//                           {master.hasChildren &&
//                             openSubmenu === "Product & Service" &&
//                             master.label === "Product & Service" && (
//                               <div className="absolute top-0 left-full w-48 bg-white border border-gray-200 shadow-lg rounded-md">
//                                 {ProductandServices.map(
//                                   (product) =>
//                                     product.control && (
//                                       <Link
//                                         key={product.to}
//                                         to={product.to}
//                                         className="block px-4 py-2 text-gray-600 text-sm hover:bg-gray-100"
//                                       >
//                                         {product.label}
//                                       </Link>
//                                     )
//                                 )}
//                               </div>
//                             )}
//                         </div>
//                       )
//                   )}
//                 </div>
//               )}
//             {link.label === "Transactions" &&
//               transactionMenuOpen &&
//               transactions.some((transaction) => transaction.control) && (
//                 <div className="absolute top-full left-0 mt-0 w-48 bg-white border border-gray-200 shadow-lg block rounded-md z-50">
//                   {transactions.map(
//                     (transaction) =>
//                       transaction.control && (
//                         <div
//                           key={transaction.to}
//                           className="relative mb-2"
//                           onMouseEnter={() => {
//                             if (
//                               transaction.hasChildren &&
//                               transaction.label === "Lead"
//                             ) {
//                               setLeadMenuOpen(true)
//                             }
//                           }}
//                           onMouseLeave={() => {
//                             if (
//                               transaction.hasChildren &&
//                               transaction.label === "Lead"
//                             ) {
//                               setLeadMenuOpen(false)
//                             }
//                           }}
//                         >
//                           <Link
//                             to={transaction.to}
//                             className="flex justify-between px-4 py-1 text-gray-600 text-sm hover:bg-gray-100 items-center"
//                           >
//                             {transaction.label}
//                             {transaction.hasChildren && <FaChevronRight />}
//                           </Link>
//                           {/*Lead dropdown*/}
//                           {transaction.hasChildren && leadMenuOpen && (
//                             <div
//                               className="absolute top-0 left-full w-48 bg-white border border-gray-200 shadow-lg rounded-md"
//                               onMouseEnter={() => setLeadMenuOpen(true)}
//                               onMouseLeave={() => setLeadMenuOpen(false)}
//                             >
//                               {leads.map(
//                                 (lead) =>
//                                   lead.control && (
//                                     <Link
//                                       key={lead.to}
//                                       to={lead.to}
//                                       className="block px-4 py-2 text-gray-600 text-sm hover:bg-gray-100"
//                                     >
//                                       {lead.label}
//                                     </Link>
//                                   )
//                               )}
//                             </div>
//                           )}
//                         </div>
//                       )
//                   )}
//                 </div>
//               )}

//             {link.label === "Reports" &&
//               reportsMenuOpen &&
//               reports.some((report) => report.control) && (
//                 <div className="absolute top-full left-0 mt-0 w-48 bg-white border border-gray-200 grid grid-cols-1 shadow-lg rounded-md z-50">
//                   {reports.map(
//                     (report) =>
//                       report.control && (
//                         <Link
//                           key={report.to}
//                           to={report.to}
//                           className=" px-4 py-2 text-gray-600 text-sm hover:bg-gray-100"
//                         >
//                           {report.label}
//                         </Link>
//                       )
//                   )}
//                 </div>
//               )}
//             {link.label === "Task" &&
//               tasksMenuOpen &&
//               tasks.some((task) => task.control) && (
//                 <div className="absolute top-full left-0 mt-0 w-48 bg-white border border-gray-200 grid grid-cols-1 shadow-lg rounded-md z-50">
//                   {tasks.map(
//                     (task) =>
//                       task.control && (
//                         <Link
//                           key={task.to}
//                           to={task.to}
//                           className=" px-4 py-2 text-gray-600 text-sm hover:bg-gray-100"
//                         >
//                           {task.label}
//                         </Link>
//                       )
//                   )}
//                 </div>
//               )}
//           </div>
//         ))}
//       </nav>

//       <div className="hidden md:flex items-center flex-shrink-0 space-x-2">
//         {user?.profileUrl && user?.profileUrl?.length > 0 ? (
//           <img
//             src={user?.profileUrl}
//             // alt={`${user?.name}'s profile`}
//             onMouseEnter={() => setProfileMenuOpen(true)}
//             onMouseLeave={() => setProfileMenuOpen(false)}
//             className="w-10 h-10 rounded-full border-2" // Add styling as needed
//           />
//         ) : (
//           <FaUserCircle
//             className=" text-white text-3xl hover:text-yellow-200 cursor-pointer"
//             onMouseEnter={() => setProfileMenuOpen(true)}
//             onMouseLeave={() => setProfileMenuOpen(false)}
//           />
//         )}
//         <span
//           onMouseEnter={() => setProfileMenuOpen(true)}
//           onMouseLeave={() => setProfileMenuOpen(false)}
//           className="text-white mx-4 rounded-md cursor-pointer hover:text-yellow-200"
//         >
//           {user?.name || "Profile"}
//         </span>

//         <div
//           onClick={logout}
//           className="bg-white text-green-600 border border-green-600 px-3 py-1 flex  items-center gap-1  rounded hover:cursor-pointer hover:scale-110  hover:shadow-lg shadow-xl transform transition-transform duration-300"
//         >
//           <FiLogOut className="text-red-500" size={20} />
//           <span className="text-red-500 hover:text-red-600">Logout</span>
//         </div>
//       </div>
//     </header>
//   )
// }

import { useEffect, useMemo, useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import api from "../api/api"
import UseFetch from "../hooks/useFetch"
import {
  FiMenu,
  FiX,
  FiBell,
  FiSearch,
  FiChevronDown,
  FiChevronRight,
  FiLogOut
} from "react-icons/fi"
import { FaUserCircle } from "react-icons/fa"

export default function StaffHeader({ hide = false }) {
  console.log(hide)
  const [user, setUser] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(null)
  const [mobileChildMenu, setMobileChildMenu] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) setUser(JSON.parse(storedUser))
  }, [])

  const permissions = user?.permissions?.[0] || {}

 

  const masters = useMemo(
    () => [
      {
        to: "/staff/masters/company",
        label: "Company",
        control: permissions.Company ?? false
      },
      {
        to: "/staff/masters/branch",
        label: "Branch",
        control: permissions.Branch ?? false
      },
      {
        to: "/staff/masters/department",
        label: "Department",
        control: permissions.Department ?? false
      },
      {
        label: "Product & Service",
        hasChildren: true,
        control: permissions.ProductandServices ?? false
      },
      {
        to: "/staff/masters/customer",
        label: "Customer",
        control: permissions.Customer ?? false
      },
      {
        label: "Employee",
        hasChildren: true,
        control: permissions.Employee ?? false
      },
      {
        to: "/staff/masters/leavemaster",
        label: "Leave Master",
        control: permissions.Leavemaster ?? false
      },
      {
        to: "/staff/masters/partners",
        label: "Partners",
        control: permissions.Partners ?? false
      }
    ],
    [permissions]
  )

  const productAndServices = useMemo(
    () => [
      {
        to: "/staff/masters/product",
        label: "Product",
        control: permissions.Product ?? false
      },
      {
        to: "/staff/masters/servicesRegistration",
        label: "Services",
        control: permissions.Services ?? false
      },
      {
        to: "/staff/masters/inventory/brandRegistration",
        label: "Brand",
        control: permissions.Brand ?? false
      },
      {
        to: "/staff/masters/inventory/categoryRegistration",
        label: "Category",
        control: permissions.Category ?? false
      },
      {
        to: "/staff/masters/inventory/hsnlist",
        label: "HSN",
        control: permissions.HSN ?? false
      },
      {
        to: "/staff/masters/callnotes",
        label: "Call Notes",
        control: permissions.CallNotes ?? false
      },
      {
        to: "/staff/masters/taskRegistration",
        label: "Task Level",
        control: permissions.TaskLevel ?? false
      }
    ],
    [permissions]
  )

  const employeeMenu = useMemo(
    () => [
      {
        to: "/staff/masters/users-&-passwords",
        label: "Users & Passwords",
        control: permissions.UsersAndPasswords ?? false
      },
      {
        to: "/staff/masters/menuRights",
        label: "Menu Rights",
        control: permissions.MenuRights ?? false
      },
      {
        to: "/staff/masters/target",
        label: "Target",
        control: permissions.Target ?? false
      },
      {
        to: "/staff/masters/voucherMaster",
        label: "Voucher Master",
        control: permissions.VoucherMaster ?? false
      }
    ],
    [permissions]
  )

  const leads = useMemo(
    () => [
      { to: "/staff/transaction/lead", label: "New Lead", control: true },
      {
        to: "/staff/transaction/lead/ownedLeadlist",
        label: "Own Lead",
        control: true
      },
      {
        to: "/staff/transaction/lead/leadAllocation",
        label: "Lead Allocation",
        control: permissions.LeadAllocation ?? false
      },
      {
        to: "/staff/transaction/lead/leadFollowUp",
        label: "Lead Follow Up",
        control: permissions.LeadFollowUp ?? false
      },
      {
        to: "/staff/transaction/lead/leadTask",
        label: "Task Pending",
        control: true
      },
      {
        to: "/staff/transaction/lead/leadReallocation",
        label: "Lead Reallocation",
        control: permissions.LeadReallocation ?? false
      },
      {
        to: "/staff/transaction/lead/taskAnalysis",
        label: "Task Analysis",
        control: permissions.TaskAnalysis ?? false
      },
      {
        to: "/staff/transaction/lead/collectionUpdate",
        label: "Collection Update",
        control: permissions.CollectionUpdate ?? false
      }
    ],
    [permissions]
  )

  const transactions = useMemo(
    () => [
      { label: "Lead", hasChildren: true, control: permissions.Lead ?? false },
      {
        to: "/staff/transaction/call-registration",
        label: "Call Registration",
        control: permissions.CallRegistration ?? false
      },
      {
        to: "/staff/transaction/leave-application",
        label: "Leave Application",
        control: permissions.LeaveApplication ?? false
      }
    ],
    [permissions]
  )

  const reports = useMemo(
    () => [
      {
        to: "/staff/reports/summary",
        label: "Call Summary",
        control: permissions.Summary ?? false
      },
      {
        to: "/staff/reports/expiry-register",
        label: "Expiry Register",
        control: permissions.ExpiryRegister ?? false
      },
      {
        to: "/staff/reports/account-search",
        label: "Account Search",
        control: permissions.AccountSearch ?? false
      },
      {
        to: "/staff/reports/leave-summary",
        label: "Leave Summary",
        control: permissions.LeaveSummary ?? false
      },
      // {
      //   to: "/staff/reports/markettingdashboard",
      //   label: "Marketing Dashboard",
      //   control: true
      // }
    ],
    [permissions]
  )

  const tasks = useMemo(
    () => [
      {
        to: "/staff/tasks/signUp-customer",
        label: "Sign Up Customer",
        control: permissions.SignUpCustomer ?? false
      },
      {
        to: "/staff/tasks/leaveApproval-pending",
        label: "Leave Approval Pending",
        control: permissions.LeaveApprovalPending ?? false
      },
      {
        to: "/staff/tasks/workAllocation",
        label: "Work Allocation",
        control: permissions.WorkAllocation ?? false
      },
      {
        to: "/staff/tasks/excelconverter",
        label: "Excel Converter",
        control: permissions.ExcelConverter ?? false
      }
    ],
    [permissions]
  )

  const menuGroups = useMemo(
    () => [
      { label: "Masters", items: masters },
      { label: "Transactions", items: transactions },
      { label: "Reports", items: reports },
      { label: "Tasks", items: tasks }
    ],
    [masters, transactions, reports, tasks]
  )

  const logout = async () => {
    try {
      const res = await api.post("/auth/logout")
      if (
        res.status === 200 &&
        res.data?.message === "Logged out successfully"
      ) {
        localStorage.removeItem("authToken")
        localStorage.removeItem("user")
        localStorage.removeItem("timer")
        localStorage.removeItem("wish")
        toast.success("Logout successfully")
        navigate("/")
      } else {
        toast.error("Logout failed on server")
      }
    } catch (err) {
      console.error(err)
      toast.error("Logout failed, please try again")
    }
  }

  const getChildItems = (label) => {
    if (label === "Product & Service")
      return productAndServices.filter((i) => i.control)
    if (label === "Employee") return employeeMenu.filter((i) => i.control)
    if (label === "Lead") return leads.filter((i) => i.control)
    return []
  }

  const navLinkClass = ({ isActive }) =>
    `px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 ${
      isActive
        ? "bg-[#243145] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
        : "text-slate-300 hover:text-white hover:bg-[#1E293B]"
    }`

  const DesktopLeafLink = ({ to, label }) => (
    <Link
      to={to}
      className="block rounded-xl px-3 py-2.5 text-[13px] font-medium text-slate-100 transition hover:bg-[#1E293B] hover:text-white"
    >
      {label}
    </Link>
  )

  const DesktopChildPanel = ({ items }) => (
    <div className="invisible absolute left-[calc(100%+8px)] top-0 z-50 min-w-[240px] translate-x-1 rounded-2xl border border-white/10 bg-[#162033] p-2 opacity-0 shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition-all duration-150 group-hover/child:visible group-hover/child:translate-x-0 group-hover/child:opacity-100 group-focus-within/child:visible group-focus-within/child:translate-x-0 group-focus-within/child:opacity-100">
      {items.map((child) => (
        <DesktopLeafLink key={child.to} to={child.to} label={child.label} />
      ))}
    </div>
  )

  const DesktopDropdown = ({ items }) => (
    <div className="invisible absolute left-0 top-[calc(100%+10px)] z-50 min-w-[260px] translate-y-1 rounded-2xl border border-white/10  bg-[#162033] p-2 opacity-0 shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition-all duration-150 group-hover/menu:visible group-hover/menu:translate-y-0 group-hover/menu:opacity-100 group-focus-within/menu:visible group-focus-within/menu:translate-y-0 group-focus-within/menu:opacity-100">
      {items
        .filter((item) => item.control)
        .map((item) => {
          if (!item.hasChildren) {
            return (
              <DesktopLeafLink key={item.to} to={item.to} label={item.label} />
            )
          }

          const childItems = getChildItems(item.label)
          if (!childItems.length) return null

          return (
            <div key={item.label} className="group/child relative">
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[13px] font-medium text-slate-100 transition hover:bg-[#1E293B]"
              >
                <span>{item.label}</span>
                <FiChevronRight className="text-slate-400" size={14} />
              </button>

              <DesktopChildPanel items={childItems} />
            </div>
          )
        })}
    </div>
  )

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b border-white/10 bg-[#0F172A]/95 ${hide?"flex-grow":""} text-white backdrop-blur-xl`}
      >
        <div className={`mx-auto flex ${hide?"h-12":"h-16"} w-full items-center gap-3 px-3 sm:px-4 lg:px-6`}>
          {!hide && (
            <div className="flex min-w-0 items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#162033] text-slate-200 transition hover:bg-[#1E293B] xl:hidden"
              >
                <FiMenu size={18} />
              </button>

              <Link to="/staff/dashBoard" className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-[0_10px_30px_rgba(59,130,246,0.28)]">
                  <span className="text-[16px] font-bold tracking-[0.16em] text-white">
                    CRM
                  </span>
                </div>

                <div className="hidden sm:block">
                  <div className="text-[14px] font-semibold leading-4 text-white">
                    Management Suite
                  </div>
                  <div className="text-[11px] leading-4 text-slate-400">
                    Staff workspace
                  </div>
                </div>
              </Link>
            </div>
          )}

          <div className="hidden min-w-0 flex-1 items-center justify-center xl:flex">
            <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-[#162033]  p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
              <NavLink to="/staff/dashBoard" className={navLinkClass}>
                Dashboard
              </NavLink>

              {menuGroups.map((group) => {
                const visibleItems = group.items.filter((i) => i.control)
                if (!visibleItems.length) return null

                return (
                  <div key={group.label} className="group/menu relative">
                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-[13px] font-medium text-slate-300 transition hover:bg-[#1E293B] hover:text-white"
                    >
                      <span>{group.label}</span>
                      <FiChevronDown size={14} className="text-slate-400" />
                    </button>

                    <DesktopDropdown items={group.items} />
                  </div>
                )
              })}
            </div>
          </div>
          {!hide && (
            <div className="ml-auto flex items-center gap-2">
              <button className="hidden lg:flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-[#162033] px-3 text-slate-400 transition hover:bg-[#1E293B] hover:text-slate-200">
                <FiSearch size={15} />
                <span className="text-[12px]">Search</span>
              </button>
              <div className="hidden md:flex items-center gap-3 rounded-2xl border border-white/10 bg-[#162033] px-2.5 py-1.5">
                <div className="flex min-w-0 items-center gap-2">
                  {user?.profileUrl ? (
                    <img
                      src={user.profileUrl}
                      alt="Profile"
                      className="h-9 w-9 rounded-xl object-cover ring-1 ring-white/10"
                    />
                  ) : (
                    <FaUserCircle className="text-[30px] text-slate-400" />
                  )}

                  <div className="min-w-0">
                    <div className="truncate text-[13px] font-semibold text-white">
                      {user?.name || "Staff User"}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="truncate">
                        {user?.selected?.[0]?.branchName || "Branch"}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-slate-500" />
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-400">
                        {user?.role || "Staff"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={logout}
                className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-[#162033] px-3 text-[13px] font-medium text-slate-300 transition hover:bg-rose-500/10 hover:text-rose-300"
              >
                <FiLogOut size={15} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm xl:hidden"
            onClick={() => setMobileOpen(false)}
          />

          <aside className="fixed left-0 top-0 z-50 h-screen w-[88%] max-w-[360px] overflow-y-auto border-r border-white/10 bg-[#0F172A] text-white shadow-[0_20px_80px_rgba(0,0,0,0.55)] xl:hidden">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600">
                  <span className="text-[11px] font-bold tracking-[0.16em]">
                    CRM
                  </span>
                </div>
                <div>
                  <div className="text-[14px] font-semibold">
                    Management Suite
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Staff workspace
                  </div>
                </div>
              </div>

              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#162033]"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="border-b border-white/10 px-4 py-4">
              <div className="flex items-center gap-3">
                {user?.profileUrl ? (
                  <img
                    src={user.profileUrl}
                    alt="Profile"
                    className="h-11 w-11 rounded-2xl object-cover ring-1 ring-white/10"
                  />
                ) : (
                  <FaUserCircle className="text-[36px] text-slate-400" />
                )}

                <div className="min-w-0">
                  <div className="truncate text-[14px] font-semibold">
                    {user?.name || "Staff User"}
                  </div>
                  <div className="truncate text-[12px] text-slate-400">
                    {user?.selected?.[0]?.branchName || "Branch"}
                  </div>
                </div>
              </div>

            
            </div>

            <div className="p-3">
              <NavLink
                to="/staff/dashBoard"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `mb-2 block rounded-2xl px-4 py-3 text-[14px] font-medium ${
                    isActive
                      ? "bg-[#243145] text-white"
                      : "text-slate-200 hover:bg-[#1E293B]"
                  }`
                }
              >
                Dashboard
              </NavLink>

              {menuGroups.map((group) => {
                const visibleItems = group.items.filter((i) => i.control)
                if (!visibleItems.length) return null

                return (
                  <div
                    key={group.label}
                    className="mb-2 rounded-2xl border border-white/10 bg-[#162033]"
                  >
                    <button
                      onClick={() =>
                        setMobileMenu(
                          mobileMenu === group.label ? null : group.label
                        )
                      }
                      className="flex w-full items-center justify-between px-4 py-3 text-[14px] font-medium text-slate-200"
                    >
                      <span>{group.label}</span>
                      {mobileMenu === group.label ? (
                        <FiChevronDown size={16} className="text-slate-400" />
                      ) : (
                        <FiChevronRight size={16} className="text-slate-400" />
                      )}
                    </button>

                    {mobileMenu === group.label && (
                      <div className="border-t border-white/10 px-2 pb-2">
                        {visibleItems.map((item) => {
                          if (!item.hasChildren) {
                            return (
                              <Link
                                key={item.to}
                                to={item.to}
                                onClick={() => setMobileOpen(false)}
                                className="block rounded-xl px-3 py-2.5 text-[13px] font-medium text-slate-300 hover:bg-[#1E293B]"
                              >
                                {item.label}
                              </Link>
                            )
                          }

                          const childItems = getChildItems(item.label)
                          if (!childItems.length) return null

                          return (
                            <div key={item.label}>
                              <button
                                onClick={() =>
                                  setMobileChildMenu(
                                    mobileChildMenu === item.label
                                      ? null
                                      : item.label
                                  )
                                }
                                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-medium text-slate-300 hover:bg-[#1E293B]"
                              >
                                <span>{item.label}</span>
                                {mobileChildMenu === item.label ? (
                                  <FiChevronDown
                                    size={14}
                                    className="text-slate-500"
                                  />
                                ) : (
                                  <FiChevronRight
                                    size={14}
                                    className="text-slate-500"
                                  />
                                )}
                              </button>

                              {mobileChildMenu === item.label && (
                                <div className="ml-3 border-l border-white/10 pl-2">
                                  {childItems.map((child) => (
                                    <Link
                                      key={child.to}
                                      to={child.to}
                                      onClick={() => setMobileOpen(false)}
                                      className="block rounded-xl px-3 py-2.5 text-[13px] text-slate-300 hover:bg-[#1E293B]"
                                    >
                                      {child.label}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}

              <button
                onClick={logout}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-[14px] font-semibold text-rose-300"
              >
                <FiLogOut size={15} />
                Logout
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  )
}
