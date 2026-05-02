// import { useEffect, useState, useRef } from "react"
// import { Link, NavLink, useNavigate } from "react-router-dom"
// import { FiLogOut } from "react-icons/fi"
// import api from "../api/api"
// import { FaChevronRight, FaChevronDown } from "react-icons/fa"
// import { FaSignOutAlt } from "react-icons/fa"
// import { FaUserCircle } from "react-icons/fa" // Import the icon
// import { toast } from "react-toastify"
// export default function AdminHeader() {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
//   const [user, setUser] = useState(null)
//   const [transactionMenuOpen, setTransactionMenuOpen] = useState(false)
//   const [masterMenuOpen, setMasterMenuOpen] = useState(false)
//   const [reportsMenuOpen, setReportsMenuOpen] = useState(false)
//   const [tasksMenuOpen, setTasksMenuOpen] = useState(false)
//   const [activeSubmenu, setActiveSubmenu] = useState(null)
//   const [profileMenuOpen, setProfileMenuOpen] = useState(false)

//   const [openSubmenu, setOpenSubmenu] = useState(null)
//   const [leadMenuOpen, setLeadMenuOpen] = useState(false)
//   const [openInnerMenu, setOpenInnerMenu] = useState(null) // Inner submenu state
//   const navigate = useNavigate()
//   const menuContainerRef = useRef(null)

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user")
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
//     // {to:"/admin/home",label:"Home"},
//     { to: "/admin/dashBoard", label: "Dashboard" },
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
//       to: "/admin/masters/company",
//       label: "Company"
//     },
//     {
//       to: "/admin/masters/branch",
//       label: "Branch"
//     },
//     {
//       to: "/admin/masters/department",
//       label: "Department"
//     },
//     { label: "Product & Service", hasChildren: true },

//     {
//       to: "/admin/masters/customer",
//       label: "Customer"
//     },
//     {
//       label: "Employee",
//       hasChildren: true
//     },

//     {
//       to: "/admin/masters/leavemaster",
//       label: "Leavemaster"
//     },
//     {
//       to: "/admin/masters/partners",
//       label: "Partners"
//     }
//   ]
//   const Productandservices = [
//     {
//       to: "/admin/masters/product",
//       label: "Product"
//     },
//     {
//       to: "/admin/masters/servicesRegistration",
//       label: "Services"
//     },
//     {
//       to: "/admin/masters/inventory/brandRegistration",
//       label: "Brand"
//     },
//     {
//       to: "/admin/masters/inventory/categoryRegistration",
//       label: "Category"
//     },
//     {
//       to: "/admin/masters/inventory/hsnlist",
//       label: "HSN"
//     },
//     {
//       to: "/admin/masters/callnotes",
//       label: "Call Notes"
//     },
//     { to: "/admin/masters/taskRegistration", label: "Task Level" }
//   ]
//   const Employee = [
//     {
//       to: "/admin/masters/users-&-passwords",
//       label: "users & Passwords"
//     },
//     {
//       to: "/admin/masters/menuRights",
//       label: "Menu Rights"
//     },
//     {
//       to: "/admin/masters/target",
//       label: "Target"
//     },
//     {
//       to: "/admin/masters/voucherMaster",
//       label: "Voucher Master"
//     }
//   ]
//   //old
//   // const masters = [
//   //   {
//   //     to: "/admin/masters/company",
//   //     label: "Company"
//   //   },
//   //   {
//   //     to: "/admin/masters/leavemaster",
//   //     label: "Leavemaster"
//   //   },
//   //   {
//   //     to: "/admin/masters/branch",
//   //     label: "Branch"
//   //   },
//   //   { to: "/admin/masters/taskRegistration", label: "Task" },
//   //   {
//   //     to: "/admin/masters/callnotes",
//   //     label: "Call Notes"
//   //   },
//   //   {
//   //     to: "/admin/masters/customer",
//   //     label: "Customer"
//   //   },
//   //   {
//   //     to: "/admin/masters/users-&-passwords",
//   //     label: "users & Passwords"
//   //   },
//   //   {
//   //     to: "/admin/masters/menuRights",
//   //     label: "Menu Rights"
//   //   },
//   //   {
//   //     to: "/admin/masters/voucherMaster",
//   //     label: "Voucher Master"
//   //   },
//   //   {
//   //     to: "/admin/masters/target",
//   //     label: "Target"
//   //   },
//   //   {
//   //     to: "/admin/masters/product",
//   //     label: "Product"
//   //   },
//   //   {
//   //     label: "Inventory",
//   //     hasChildren: true
//   //   },

//   //   {
//   //     to: "/admin/masters/partners",
//   //     label: "Partners"
//   //   },
//   //   {
//   //     to: "/admin/masters/servicesRegistration",
//   //     label: "Services"
//   //   },
//   //   {
//   //     to: "/admin/masters/department",
//   //     label: "Department"
//   //   }
//   // ]
//   const leads = [
//     { to: "/admin/transaction/lead", label: "New Lead" },
//     { to: "/admin/transaction/lead/ownedLeadlist", label: "Own Lead" },

//     {
//       to: "/admin/transaction/lead/leadAllocation",
//       label: "Lead Allocation"
//     },
//     {
//       to: "/admin/transaction/lead/leadFollowUp",
//       label: "Lead Follow Up"
//     },
//     {
//       to: "/admin/transaction/lead/leadTask",
//       label: "Task Pending"
//     },
//     {
//       to: "/admin/transaction/lead/leadReallocation",
//       label: "Lead Reallocation"
//     },
//     {
//       to: "/admin/transaction/lead/taskAnalysis",
//       label: "Task Analysis"
//     },
//     { to: "/admin/transaction/lead/lostLeads", label: "Lost Leads" },
//     {
//       to: "/admin/transaction/lead/collectionUpdate",
//       label: "Collection Update"
//     }
//   ]

//   const transactions = [
//     {
//       label: "Lead",
//       hasChildren: true
//     },
//     {
//       to: "/admin/transaction/call-registration",
//       label: "Call Registration"
//     },
//     {
//       to: "/admin/transaction/leave-application",
//       label: "Leave Application"
//     }
//   ]
//   const tasks = [
//     {
//       to: "/admin/tasks/signUp-customer",
//       label: "Sign Up Custmer"
//     },

//     {
//       to: "/admin/tasks/leaveApproval-pending",
//       label: "Leave Approval Pending"
//     },
//     {
//       to: "/admin/tasks/workAllocation",
//       label: "Work Allocation"
//     },
//     {
//       to: "/admin/tasks/excelconverter",
//       label: "Customer Converter(excel to Json)"
//     },
//     // {
//     //   to: "/admin/tasks/excelconvertertoproductaddonly",
//     //   label: "productadd(excel to Json)"
//     // },
//     {
//       to: "/admin/tasks/attendanceExcelconverter",
//       label: "Attendance Converter"
//     }
//   ]
//   const reports = [
//     {
//       to: "/admin/reports/summary",
//       label: " Call Summary"
//     },
//     {
//       to: "/admin/reports/expiry-register",
//       label: "Expiry Register"
//     },

//     {
//       to: "/admin/reports/account-search",
//       label: "Account Search"
//     },
//     {
//       to: "/admin/reports/leave-summary",
//       label: "Leave Summary"
//     },
//     { to: "/admin/reports/product-wise-report", label: "Product Report" },
//     { to: "/admin/reports/follow-up-summary", label: "Followup Summary" },
//     { to: "/admin/reports/sales-funel", label: "Sales Funnel" },
//     { to: "/admin/reports/dailystaffactivity", label: "Daily Staff Activity" }
//   ]
//   return (
//     <header className="sticky top-0 z-50 flex items-center md:justify-between bg-green-600 shadow-md px-2 md:px-4 lg:px-6 h-16 md:h-18 lg:h-18">
//       {/* Mobile menu button */}
//       <div className="md:hidden flex justify-between py-2 px-1 md:px-4">
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
//         </div>
//         <hr className="border-t-4 border-gray-300" />
//         <div className="flex p-2 text-black text-center items-center space-x-4">
//           <FaUserCircle className="h-6 w-6" />
//           <span>{user?.name}</span>
//         </div>
//         <div className="flex items-center space-x-2 pl-4">
//           <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
//           <span>{user?.role}</span>
//         </div>
//         <div className="text-black bg-gray-200 py-1 px-4">
//           {user?.branchName?.join(" | ")}
//         </div>
//         <div className="text-gray-500 mt-3 px-4">Menu</div>

//         <div className="flex flex-grow flex-col overflow-y-auto leading-10 text-black">
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

//               {activeSubmenu === index && (
//                 <div
//                   // ref={(el) => (menuRefs.current[index] = el)}
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
//                             master.label === "Lead" ||
//                             master.label === "Leave Application" ||
//                             master.label === "Leave Summary" ||
//                             master.label === "Leave Approval Pending"
//                         )
//                         .map((master, masterIndex) => (
//                           <div key={master.to} className="relative py-2">
//                             <div className="flex justify-between items-center px-4 text-gray-600 text-sm hover:bg-gray-100">
//                               <span
//                                 className="cursor-pointer flex-1"
//                                 onClick={() => {
//                                   // setMobileMenuOpen(false)
//                                   toggleInnerMenu(masterIndex)
//                                   navigate(master.to)
//                                 }}
//                               >
//                                 {master.label}
//                               </span>

//                               {master.hasChildren && (
//                                 <span
//                                   // onClick={(e) => {
//                                   //   e.stopPropagation() // Prevent label's click event
//                                   //   toggleInnerMenu(masterIndex)
//                                   // }}
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

//                             {openInnerMenu === masterIndex &&
//                               master.hasChildren &&
//                               master.label === "Lead" && (
//                                 <div className="ml-4 mt-2 border-l-4 border-blue-400 bg-gray-50 p-2 submenu-container">
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
//                                     //   className="block px-4 py-1 text-gray-600 text-sm hover:bg-gray-200"
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
//           <FaSignOutAlt className="w-5 h-5" />
//           <span>Logout</span>
//         </div>
//       </div>
//       {/* Logo and links */}
//       <div className="flex items-center space-x-2 md:space-x-4">
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
//             CRM
//           </text>
//         </svg>
//         <span className="text-xl sm:text-2xl md:text-3xl  font-bold text-white">
//           MANAGEMENT
//         </span>
//       </div>
//       <nav className="hidden lg:flex items-center md:gap-2 lg:gap-3 xl:gap-8 text-white">
//         {links.map((link) => (
//           <div
//             key={link.to}
//             className="relative mb-2"
//             onMouseEnter={() => {
//               if (link.label === "Masters") {
//                 setMasterMenuOpen(true)
//               } else if (link.label === "Transactions") {
//                 setTransactionMenuOpen(true)
//               } else if (link.label === "Reports") {
//                 setReportsMenuOpen(true)
//               } else if (link.label === "Task") {
//                 setTasksMenuOpen(true)
//               }
//             }}
//             onMouseLeave={() => {
//               if (link.label === "Masters") {
//                 setMasterMenuOpen(false)
//               } else if (link.label === "Transactions") {
//                 setTransactionMenuOpen(false)
//               } else if (link.label === "Reports") {
//                 setReportsMenuOpen(false)
//               } else if (link.label === "Task") {
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
//             {link.label === "Masters" && masterMenuOpen && (
//               <div className="absolute top-full left-0 mt-0 w-48 bg-white border border-gray-200 grid grid-cols-1 shadow-lg rounded-md z-50">
//                 {masters.map((master) => (
//                   <div
//                     key={master.to}
//                     className="relative mb-2"
//                     onMouseEnter={() => {
//                       if (master.hasChildren) {
//                         setOpenSubmenu(master.label)
//                       }
//                     }}
//                     onMouseLeave={() => {
//                       if (master.hasChildren) {
//                         setOpenSubmenu(null)
//                       }
//                     }}
//                   >
//                     <Link
//                       to={master.to}
//                       className="flex justify-between px-4 py-1 text-gray-600 text-sm hover:bg-gray-100 items-center"
//                     >
//                       {master.label}
//                       {master.hasChildren && <FaChevronRight />}
//                     </Link>

//                     {master.hasChildren &&
//                       openSubmenu === "Employee" &&
//                       master.label === "Employee" && (
//                         <div className="absolute top-0 left-full w-48 bg-white border border-gray-200 shadow-lg rounded-md">
//                           {Employee.map((employee) => (
//                             <Link
//                               key={employee.to}
//                               to={employee.to}
//                               className="block px-4 py-2 text-gray-600 text-sm hover:bg-gray-100"
//                             >
//                               {employee.label}
//                             </Link>
//                           ))}
//                         </div>
//                       )}

//                     {master.hasChildren &&
//                       openSubmenu === "Product & Service" &&
//                       master.label === "Product & Service" && (
//                         <div className="absolute top-0 left-full w-48 bg-white border border-gray-200 shadow-lg rounded-md">
//                           {Productandservices.map((product) => (
//                             <Link
//                               key={product.to}
//                               to={product.to}
//                               className="block px-4 py-2 text-gray-600 text-sm hover:bg-gray-100"
//                             >
//                               {product.label}
//                             </Link>
//                           ))}
//                         </div>
//                       )}
//                   </div>
//                 ))}
//               </div>
//             )}
//             {link.label === "Transactions" && transactionMenuOpen && (
//               <div className="absolute top-full left-0 mt-0 w-48 bg-white border border-gray-200 shadow-lg block rounded-md z-50">
//                 {transactions.map((transaction) => (
//                   <div
//                     key={transaction.to}
//                     className="relative mb-2"
//                     onMouseEnter={() => {
//                       if (
//                         transaction.hasChildren &&
//                         transaction.label === "Lead"
//                       ) {
//                         setLeadMenuOpen(true)
//                       }
//                     }}
//                     onMouseLeave={() => {
//                       if (
//                         transaction.hasChildren &&
//                         transaction.label === "Lead"
//                       ) {
//                         setLeadMenuOpen(false)
//                       }
//                     }}
//                   >
//                     <Link
//                       to={transaction.to}
//                       className="flex justify-between px-4 py-1 text-gray-600 text-sm hover:bg-gray-100 items-center"
//                     >
//                       {transaction.label}
//                       {transaction.hasChildren && <FaChevronRight />}
//                     </Link>
//                     {/*Lead dropdown*/}
//                     {transaction.hasChildren && leadMenuOpen && (
//                       <div
//                         className="absolute top-0 left-full w-48 bg-white border border-gray-200 shadow-lg rounded-md"
//                         onMouseEnter={() => setLeadMenuOpen(true)}
//                         onMouseLeave={() => setLeadMenuOpen(false)}
//                       >
//                         {leads.map((lead) => (
//                           <Link
//                             key={lead.to}
//                             to={lead.to}
//                             className="block px-4 py-2 text-gray-600 text-sm hover:bg-gray-100"
//                           >
//                             {lead.label}
//                           </Link>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//             {link.label === "Reports" && reportsMenuOpen && (
//               <div className="absolute top-full left-0 mt-0 w-48 bg-white border border-gray-200 grid grid-cols-1 shadow-lg rounded-md z-50">
//                 {reports.map((report) => (
//                   <Link
//                     key={report.to}
//                     to={report.to}
//                     className=" px-4 py-2 text-gray-600 text-sm hover:bg-gray-100"
//                   >
//                     {report.label}
//                   </Link>
//                 ))}
//               </div>
//             )}
//             {link.label === "Task" && tasksMenuOpen && (
//               <div className="absolute top-full left-0 mt-0 w-48 bg-white border border-gray-200 grid grid-cols-1 shadow-lg rounded-md z-50">
//                 {tasks.map((task) => (
//                   <Link
//                     key={task.to}
//                     to={task.to}
//                     className=" px-4 py-2 text-gray-600 text-sm hover:bg-gray-100"
//                   >
//                     {task.label}
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}
//       </nav>

//       <div className=" hidden md:flex items-center flex-shrink-0 space-x-2">
//         {user?.profileUrl && user?.profileUrl?.length > 0 ? (
//           <img
//             src={user?.profileUrl}
//             // alt={`${user?.name}'s profile`}
//             onMouseEnter={() => setProfileMenuOpen(true)}
//             onMouseLeave={() => setProfileMenuOpen(false)}
//             className="w-10 h-10 rounded-full border-2 border-white" // Add styling as needed
//           />
//         ) : (
//           <FaUserCircle
//             className="text-white text-3xl hover:text-yellow-200 cursor-pointer"
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
//           className=" bg-white text-green-600 border border-green-600 px-3 py-1 flex  items-center gap-1  rounded hover:cursor-pointer hover:scale-110  hover:shadow-lg shadow-xl transform transition-transform duration-300"
//         >
//           <FiLogOut className="text-red-500" size={20} />
//           <span className="text-red-500 hover:text-red-600">Logout</span>
//         </div>
//       </div>
//     </header>
//   )
// }




import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiLogOut, FiMenu, FiX, FiChevronDown, FiChevronRight } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../api/api";

export default function AdminHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const [openMenu, setOpenMenu] = useState(null);
  const [openChildMenu, setOpenChildMenu] = useState(null);

  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [openInnerMenu, setOpenInnerMenu] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const logout = async () => {
    try {
      const res = await api.post("/auth/logout");

      if (res.status === 200 && res.data?.message === "Logged out successfully") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        localStorage.removeItem("timer");
        localStorage.removeItem("wish");

        toast.success("Logout successfully");
        navigate("/");
      } else {
        toast.error("Logout failed on server");
      }
    } catch (err) {
      console.error("Logout API failed:", err);
      toast.error("Logout failed, please try again");
    }
  };

  const toggleSubmenu = (index) => {
    setActiveSubmenu(activeSubmenu === index ? null : index);
  };

  const toggleInnerMenu = (innerIndex) => {
    setOpenInnerMenu(openInnerMenu === innerIndex ? null : innerIndex);
  };

  const links = [
    { to: "/admin/dashBoard", label: "Dashboard" },
    { label: "Masters", key: "Masters" },
    { label: "Transactions", key: "Transactions" },
    { label: "Reports", key: "Reports" },
    { label: "Task", key: "Task" },
  ];

  const desiredMobileMenu = [
    { label: "Transactions" },
    { label: "Reports" },
    { label: "Task" },
  ];

  const masters = useMemo(
    () => [
      { to: "/admin/masters/company", label: "Company" },
      { to: "/admin/masters/branch", label: "Branch" },
      { to: "/admin/masters/department", label: "Department" },
      { label: "Product & Service", hasChildren: true, key: "Product & Service" },
      { to: "/admin/masters/customer", label: "Customer" },
      { label: "Employee", hasChildren: true, key: "Employee" },
      { to: "/admin/masters/leavemaster", label: "Leave Master" },
      { to: "/admin/masters/partners", label: "Partners" },
    ],
    []
  );

  const productAndServices = useMemo(
    () => [
      { to: "/admin/masters/product", label: "Product" },
      { to: "/admin/masters/servicesRegistration", label: "Services" },
      { to: "/admin/masters/inventory/brandRegistration", label: "Brand" },
      { to: "/admin/masters/inventory/categoryRegistration", label: "Category" },
      { to: "/admin/masters/inventory/hsnlist", label: "HSN" },
      { to: "/admin/masters/callnotes", label: "Call Notes" },
      { to: "/admin/masters/taskRegistration", label: "Task Level" },
    ],
    []
  );

  const employee = useMemo(
    () => [
      { to: "/admin/masters/users-&-passwords", label: "Users & Passwords" },
      { to: "/admin/masters/menuRights", label: "Menu Rights" },
      { to: "/admin/masters/target", label: "Target" },
      { to: "/admin/masters/voucherMaster", label: "Voucher Master" },
    ],
    []
  );

  const leads = useMemo(
    () => [
      { to: "/admin/transaction/lead", label: "New Lead" },
      { to: "/admin/transaction/lead/ownedLeadlist", label: "Own Lead" },
      { to: "/admin/transaction/lead/leadAllocation", label: "Lead Allocation" },
      { to: "/admin/transaction/lead/leadFollowUp", label: "Lead Follow Up" },
      { to: "/admin/transaction/lead/leadTask", label: "Task Pending" },
      { to: "/admin/transaction/lead/leadReallocation", label: "Lead Reallocation" },
      { to: "/admin/transaction/lead/taskAnalysis", label: "Task Analysis" },
      { to: "/admin/transaction/lead/lostLeads", label: "Lost Leads" },
      { to: "/admin/transaction/lead/collectionUpdate", label: "Collection Update" },
    ],
    []
  );

  const transactions = useMemo(
    () => [
      { label: "Lead", hasChildren: true, key: "Lead" },
      { to: "/admin/transaction/call-registration", label: "Call Registration" },
      { to: "/admin/transaction/leave-application", label: "Leave Application" },
    ],
    []
  );

  const tasks = useMemo(
    () => [
      { to: "/admin/tasks/signUp-customer", label: "Sign Up Customer" },
      { to: "/admin/tasks/leaveApproval-pending", label: "Leave Approval Pending" },
      { to: "/admin/tasks/workAllocation", label: "Work Allocation" },
      { to: "/admin/tasks/excelconverter", label: "Customer Converter (Excel to JSON)" },
      { to: "/admin/tasks/attendanceExcelconverter", label: "Attendance Converter" },
    ],
    []
  );

  const reports = useMemo(
    () => [
      { to: "/admin/reports/summary", label: "Call Summary" },
      { to: "/admin/reports/expiry-register", label: "Expiry Register" },
      { to: "/admin/reports/account-search", label: "Account Search" },
      { to: "/admin/reports/leave-summary", label: "Leave Summary" },
      { to: "/admin/reports/product-wise-report", label: "Product Report" },
      { to: "/admin/reports/follow-up-summary", label: "Followup Summary" },
      { to: "/admin/reports/sales-funel", label: "Sales Funnel" },
      { to: "/admin/reports/dailystaffactivity", label: "Daily Staff Activity" },
    ],
    []
  );

  const getMenuItems = (label) => {
    if (label === "Masters") return masters;
    if (label === "Transactions") return transactions;
    if (label === "Reports") return reports;
    if (label === "Task") return tasks;
    return [];
  };

  const getChildItems = (label) => {
    if (label === "Employee") return employee;
    if (label === "Product & Service") return productAndServices;
    if (label === "Lead") return leads;
    return [];
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950 text-slate-100 border-b border-slate-800 shadow-md">
      <div className="mx-auto max-w-7xl px-3 md:px-5">
        <div className="flex h-16 items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-100 hover:bg-slate-800 transition lg:hidden"
            >
              <FiMenu className="h-6 w-6" />
            </button>

            <Link to="/admin/dashBoard" className="flex items-center gap-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300 text-md font-bold tracking-[0.18em] border border-cyan-400/20">
                CRM
              </div>
              <div className="leading-tight">
                <p className="text-sm md:text-base font-semibold tracking-wide text-white">
                  MANAGEMENT
                </p>
                <p className="hidden md:block text-[11px] text-slate-400">
                  Admin Panel
                </p>
              </div>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-2 text-sm">
            {links.map((link) => {
              const hasDropdown = !link.to;
              const menuOpen = openMenu === link.label;

              return (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => {
                    if (hasDropdown) {
                      setOpenMenu(link.label);
                      setOpenChildMenu(null);
                    }
                  }}
                  onMouseLeave={() => {
                    if (hasDropdown) {
                      setOpenMenu(null);
                      setOpenChildMenu(null);
                    }
                  }}
                >
                  {link.to ? (
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        `rounded-lg px-3 py-2 transition ${
                          isActive
                            ? "bg-cyan-500/10 text-cyan-300"
                            : "text-slate-200 hover:bg-slate-800 hover:text-white"
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  ) : (
                    <button
                      className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 transition ${
                        menuOpen
                          ? "bg-slate-800 text-white"
                          : "text-slate-200 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <span>{link.label}</span>
                      <FiChevronDown
                        className={`h-4 w-4 transition ${menuOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  )}

                  {hasDropdown && menuOpen && (
                    <div className="absolute left-0 top-full pt-2">
                      <div className="relative w-56 rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
                        {getMenuItems(link.label).map((item) => {
                          const childOpen = openChildMenu === item.label;

                          return (
                            <div
                              key={item.label}
                              className="relative"
                              onMouseEnter={() => {
                                if (item.hasChildren) {
                                  setOpenChildMenu(item.label);
                                }
                              }}
                            >
                              {item.to ? (
                                <NavLink
                                  to={item.to}
                                  className={({ isActive }) =>
                                    `block px-4 py-2 text-sm transition ${
                                      isActive
                                        ? "bg-cyan-500/10 text-cyan-300"
                                        : "text-slate-200 hover:bg-slate-800"
                                    }`
                                  }
                                >
                                  {item.label}
                                </NavLink>
                              ) : (
                                <button
                                  type="button"
                                  className={`flex w-full items-center justify-between px-4 py-2 text-sm transition ${
                                    childOpen
                                      ? "bg-slate-800 text-white"
                                      : "text-slate-200 hover:bg-slate-800"
                                  }`}
                                >
                                  <span>{item.label}</span>
                                  <FiChevronRight className="h-4 w-4 text-slate-400" />
                                </button>
                              )}

                              {item.hasChildren && childOpen && (
                                <div className="absolute top-0 left-full -ml-1 pl-2">
                                  <div className="w-56 rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
                                    {getChildItems(item.label).map((child) => (
                                      <NavLink
                                        key={child.to}
                                        to={child.to}
                                        className={({ isActive }) =>
                                          `block px-4 py-2 text-sm transition ${
                                            isActive
                                              ? "bg-cyan-500/10 text-cyan-300"
                                              : "text-slate-200 hover:bg-slate-800"
                                          }`
                                        }
                                      >
                                        {child.label}
                                      </NavLink>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <div
              className="relative"
              onMouseEnter={() => setProfileMenuOpen(true)}
              onMouseLeave={() => setProfileMenuOpen(false)}
            >
              <button className="flex items-center gap-2 rounded-full bg-slate-800 px-2 py-1.5 text-sm hover:bg-slate-700 transition">
                {user?.profileUrl ? (
                  <img
                    src={user.profileUrl}
                    alt={user?.name || "Profile"}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="h-8 w-8 text-slate-100" />
                )}
                <span className="max-w-[130px] truncate font-medium text-slate-100">
                  {user?.name || "Profile"}
                </span>
                <FiChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 top-full pt-2">
                  <div className="w-56 rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
                    <div className="border-b border-slate-800 px-4 py-3">
                      <p className="truncate text-sm font-semibold text-white">
                        {user?.name}
                      </p>
                      <p className="text-xs text-slate-400">{user?.role}</p>
                      <p className="mt-1 line-clamp-2 text-[11px] text-slate-300">
                        {user?.branchName?.join(" | ")}
                      </p>
                    </div>

                    <button
                      onClick={logout}
                      className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-300 transition hover:bg-slate-800"
                    >
                      <FiLogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={logout}
              className="hidden xl:inline-flex items-center gap-2 rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-300 hover:bg-red-500/20 transition"
            >
              <FiLogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 z-50 flex h-screen w-[85%] max-w-xs flex-col bg-slate-950 text-slate-100 shadow-xl transition-transform duration-300 lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300 text-[11px] font-bold tracking-[0.18em] border border-cyan-400/20">
              CRM
            </div>
            <div>
              <p className="text-sm font-semibold text-white">MANAGEMENT</p>
              <p className="text-[11px] text-slate-400">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-md p-2 hover:bg-slate-800"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-slate-800 px-4 py-4">
          <div className="flex items-center gap-3">
            {user?.profileUrl ? (
              <img
                src={user.profileUrl}
                alt={user?.name || "Profile"}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <FaUserCircle className="h-9 w-9 text-slate-100" />
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.role}</p>
            </div>
          </div>
          <p className="mt-2 line-clamp-2 text-[11px] text-slate-400">
            {user?.branchName?.join(" | ")}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-3">
          {desiredMobileMenu.map((link, index) => (
            <div key={index} className="mb-1">
              <button
                onClick={() => toggleSubmenu(index)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm text-slate-100 hover:bg-slate-800"
              >
                <span>{link.label}</span>
                {activeSubmenu === index ? (
                  <FiChevronDown className="h-4 w-4 text-slate-400" />
                ) : (
                  <FiChevronRight className="h-4 w-4 text-slate-400" />
                )}
              </button>

              {activeSubmenu === index && (
                <div className="ml-2 rounded-lg border-l border-slate-700 bg-slate-900/70 py-2">
                  {(link.label === "Transactions"
                    ? transactions
                    : link.label === "Reports"
                    ? reports
                    : tasks
                  ).map((item, innerIndex) => (
                    <div key={item.label}>
                      {item.hasChildren ? (
                        <>
                          <button
                            onClick={() => toggleInnerMenu(innerIndex)}
                            className="flex w-full items-center justify-between px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
                          >
                            <span>{item.label}</span>
                            {openInnerMenu === innerIndex ? (
                              <FiChevronDown className="h-4 w-4 text-slate-400" />
                            ) : (
                              <FiChevronRight className="h-4 w-4 text-slate-400" />
                            )}
                          </button>

                          {openInnerMenu === innerIndex && item.label === "Lead" && (
                            <div className="ml-3 border-l border-slate-700 pl-2">
                              {leads.map((child) => (
                                <NavLink
                                  key={child.to}
                                  to={child.to}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className={({ isActive }) =>
                                    `block rounded-md px-3 py-2 text-sm ${
                                      isActive
                                        ? "bg-cyan-500/10 text-cyan-300"
                                        : "text-slate-300 hover:bg-slate-800"
                                    }`
                                  }
                                >
                                  {child.label}
                                </NavLink>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <NavLink
                          to={item.to}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `block px-4 py-2 text-sm ${
                              isActive
                                ? "bg-cyan-500/10 text-cyan-300"
                                : "text-slate-300 hover:bg-slate-800"
                            }`
                          }
                        >
                          {item.label}
                        </NavLink>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 p-3">
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300 hover:bg-red-500/20 transition"
          >
            <FiLogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}