import { useState, useEffect, useRef } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import api from "../api/api"
import { FiMessageCircle } from "react-icons/fi"
import { FiLogOut } from "react-icons/fi"
import { FaChevronRight, FaChevronDown } from "react-icons/fa"
import { FaSignOutAlt } from "react-icons/fa"
import UseFetch from "../hooks/useFetch"
import { FaUserCircle } from "react-icons/fa" // Import the icon
export default function StaffHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mathcheddemoleadcount, setmathcheddemoleadcount] = useState(0)
  const [user, setUser] = useState(null)
  const [leadMenuOpen, setLeadMenuOpen] = useState(false)
  const [transactionMenuOpen, setTransactionMenuOpen] = useState(false)
  const [masterMenuOpen, setMasterMenuOpen] = useState(false)
  const [reportsMenuOpen, setReportsMenuOpen] = useState(false)
  const [tasksMenuOpen, setTasksMenuOpen] = useState(false)

  const [activeSubmenu, setActiveSubmenu] = useState(null)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [inventoryMenuOpen, setInventoryMenuOpen] = useState(false)
  const [openInnerMenu, setOpenInnerMenu] = useState(null) // Inner submenu state
  const navigate = useNavigate()

  const menuContainerRef = useRef(null)
  const { data: demoleadcount } = UseFetch(
    user && `/lead/demoleadcount?loggeduserid=${user._id}`
  )
  useEffect(() => {
    if (demoleadcount > 0) {
      setmathcheddemoleadcount(demoleadcount)
    }
  }, [demoleadcount])
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser)) // Parse the user data from string to object
    }
  }, [])

  const toggleInnerMenu = (innerIndex) => {
    setOpenInnerMenu(openInnerMenu === innerIndex ? null : innerIndex)
  }
  const toggleSubmenu = (index) => {
    const newActiveSubmenu = activeSubmenu === index ? null : index
    setActiveSubmenu(newActiveSubmenu)

    // Scroll to keep the active submenu in view after a small delay to allow render
    if (newActiveSubmenu !== null) {
      setTimeout(() => {
        const menuItem = document.querySelector(`.menu-item-${index}`)
        if (menuItem && menuContainerRef.current) {
          const containerRect = menuContainerRef.current.getBoundingClientRect()
          const itemRect = menuItem.getBoundingClientRect()

          // If submenu would extend beyond visible area, scroll to show it
          if (itemRect.bottom + 200 > containerRect.bottom) {
            // 200px buffer for submenu
            menuContainerRef.current.scrollTop +=
              itemRect.bottom + 200 - containerRect.bottom
          }
        }
      }, 50)
    }
  }
  const logout = async () => {
    try {
      const res = await api.post("/auth/logout") // Call backend

      // ✅ Check if backend returned success
      if (
        res.status === 200 &&
        res.data?.message === "Logged out successfully"
      ) {
        // Clear localStorage only after successful logout
        localStorage.removeItem("authToken")
        localStorage.removeItem("user")
        localStorage.removeItem("timer")
        localStorage.removeItem("wish")

        toast.success("Logout successfully")

        // Redirect to login page
        navigate("/")
      } else {
        toast.error("Logout failed on server")
      }
    } catch (err) {
      console.error("Logout API failed:", err)
      toast.error("Logout failed, please try again")
    }
  }

  // const logout = () => {
  //   // Clear the authentication token from local storage
  //   localStorage.removeItem("authToken")
  //   localStorage.removeItem("user")
  //   localStorage.removeItem("timer")
  //   localStorage.removeItem("wish")
  //   // Redirect to login page
  //   toast.success("Logout successfully")
  //   navigate("/")
  // }
  const links = [
    { to: "/staff/dashBoard", label: "Dashboard" },
    { label: "Masters" },
    { label: "Transactions" },
    { label: "Reports" },
    { label: "Task" }
  ]
  const desiredMobileMenu = [
    { label: "Transactions" },
    { label: "Reports" },
    { label: "Task" }
  ]

  const masters = [
    {
      to: "/staff/masters/company",
      label: "Company",
      control: user?.permissions?.[0]?.Company ?? false
    },
    {
      to: "/staff/masters/taskRegistration",
      label: "Task",
      control: user?.permissions?.[0]?.Task ?? false
    },

    {
      to: "/staff/masters/branch",
      label: "Branch",
      control: user?.permissions?.[0]?.Branch ?? false
    },
    {
      to: "/staff/masters/customer",
      label: "Customer",
      control: user?.permissions?.[0]?.Customer ?? false
    },
    {
      to: "/staff/masters/callnotes",
      label: "Call Notes",
      control: user?.permissions?.[0]?.CallNotes ?? false
    },

    {
      to: "/staff/masters/users-&-passwords",
      label: "users & Passwords",
      control: user?.permissions?.[0]?.UsersAndPasswords ?? false
    },
    {
      to: "/staff/masters/menuRights",
      label: "Menu Rights",
      control: user?.permissions?.[0]?.MenuRights ?? false
    },
    {
      to: "/staff/masters/voucherMaster",
      label: "Voucher Master",
      control: user?.permissions?.[0]?.voucherMaster ?? false
    },
    {
      to: "/staff/masters/target",
      label: "Target",
      control: user?.permissions?.[0]?.Target ?? false
    },
    {
      to: "/staff/masters/product",
      label: "Product",
      control: user?.permissions?.[0]?.Product ?? false
    },
    {
      label: "Inventory",
      hasChildren: true,
      control: user?.permissions?.[0]?.Inventory ?? false
    },

    {
      to: "/staff/masters/partners",
      label: "Partners",
      control: user?.permissions?.[0]?.Partners ?? false
    },
    {
      to: "/staff/masters/department",
      label: "Department",
      control: user?.permissions?.[0]?.Department ?? false
    }
  ]
  const leads = [
    { to: "/staff/transaction/lead", label: "New Lead", control: true },
    {
      to: "/staff/transaction/lead/ownedLeadlist",
      label: "Own Lead",
      control: true
    },

    {
      to: "/staff/transaction/lead/leadAllocation",
      label: "Lead Allocation",
      control: user?.permissions?.[0]?.LeadAllocation ?? false
    },
    {
      to: "/staff/transaction/lead/leadFollowUp",
      label: "Lead Follow Up",
      control: user?.permissions?.[0]?.LeadFollowUp ?? false
    },
    {
      to: "/staff/transaction/lead/leadTask",
      label: "Task",
      control: true
    },

    {
      to: "/staff/transaction/lead/leadReallocation",
      label: "Lead Reallocation",
      control: user?.permissions?.[0]?.LeadReallocation ?? false
    },
    {
      to: "/staff/transaction/lead/taskAnalysis",
      label: "Task Analysis",
      control: user?.permissions?.[0]?.TaskAnalysis ?? false
    }
    // {
    //   to: "/staff/transaction/lead/paymenthistory",
    //   label: "Payment History",
    //   control: true
    // }
  ]
  const inventorys = [
    {
      to: "/staff/masters/inventory/brandRegistration",
      label: "Brand"
      // control: user.permissions[0].Brand
    },
    {
      to: "/staff/masters/inventory/categoryRegistration",
      label: "Category"
      // control: user.permissions[0].Category
    },
    {
      to: "/staff/masters/inventory/hsnlist",
      label: "HSN"
      // control: user.permissions[0].HSN
    }
  ]
  const reports = [
    {
      to: "/staff/reports/summary",
      label: " Call Summary",
      control: user?.permissions?.[0]?.Summary ?? false
    },
    {
      to: "/staff/reports/expiry-register",
      label: "Expiry Register",
      control: user?.permissions?.[0]?.ExpiryRegister ?? false
    },

    {
      to: "/staff/reports/account-search",
      label: "Account Search",
      control: user?.permissions?.[0]?.AccountSearch ?? false
    },
    {
      to: "/staff/reports/leave-summary",
      label: "Leave Summary",
      control: user?.permissions?.[0]?.LeaveSummary ?? false
    }
  ]
  const transactions = [
    {
      label: "Lead",
      control: user?.permissions?.[0]?.Lead ?? false,
      hasChildren: true
    },
    {
      to: "/staff/transaction/call-registration",
      label: "Call Registration",
      control: user?.permissions?.[0]?.CallRegistration ?? false
    },
    {
      to: "/staff/transaction/leave-application",
      label: "Leave Application",
      control: user?.permissions?.[0]?.LeaveApplication ?? false
    }
  ]
  const tasks = [
    {
      to: "/staff/tasks/signUp-customer",
      label: "Sign Up Custmer",
      control: user?.permissions?.[0]?.SignUpCustomer
    },

    {
      to: "/staff/tasks/leaveApproval-pending",
      label: "Leave Approval Pending",
      control: user?.permissions?.[0]?.LeaveApprovalPending ?? false
    },
    {
      to: "/staff/tasks/workAllocation",
      label: "Work Allocation",
      control: user?.permissions?.[0]?.WorkAllocation ?? false
    },
    {
      to: "/staff/tasks/excelconverter",
      label: "Excel Converter",
      control: user?.permissions?.[0]?.ExcelConverter ?? false
    }
  ]
  return (
    <header className="sticky top-0 z-50 flex bg-white shadow-md py-4 items-center">
      {/* Mobile menu button */}
      <div className="md:hidden flex justify-between py-2 px-4">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="hover:text-red-800 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Mobile menu */}
      <div
        className={`sm:hidden fixed top-0 left-0 z-50 bg-white shadow-lg w-3/5 h-screen transition-transform duration-300 flex flex-col ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center space-x-2 p-2">
          <svg
            className="w-12 h-12 text-green-400"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="32"
              cy="32"
              r="30"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              d="M32 2 A30 30 0 0 1 32 62"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              fill="currentColor"
              fontSize="18"
              fontFamily="Arial, Helvetica, sans-serif"
              dy=".3em"
            >
              CRm
            </text>
          </svg>
          <span className="text-md sm:text-2xl md:text-2xl lg:text-3xl font-bold text-green-400">
            MANAGEMENT
          </span>

          {/* <span className="text-3xl font-bold text-green-600">MANAGEMENT</span> */}
        </div>
        <hr className="border-t-4 border-gray-300" />
        <div className="p-2 flex text-black text-center items-center space-x-4">
          <FaUserCircle className="w-6 h-6" />
          <span>{user?.name}</span>
        </div>
        <div className="flex items-center space-x-2 pl-4">
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
          <span>{user?.role}</span>
        </div>

        <div className="text-black bg-gray-200 py-1 px-4">
          {user?.selected?.[0]?.branchName}
        </div>

        <div className="text-gray-500 mt-3 px-4">Menu</div>

        {/* Menu - Scrollable */}
        <div className="flex-grow  block leading-10 text-black">
          {desiredMobileMenu.map((link, index) => (
            <div key={index} className={`relative menu-item-${index}`}>
              <div
                className={`flex items-center px-8 hover:bg-gray-200 cursor-pointer menu-trigger-${index}`}
                onClick={() => toggleSubmenu(index)}
              >
                {link.to ? (
                  <Link
                    to={link.to}
                    className="block  flex-grow"
                    onClick={(e) => {
                      e.stopPropagation()
                      setMobileMenuOpen(false)
                    }}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <span className="block  flex-grow">{link.label}</span>
                )}

                {activeSubmenu === index ? (
                  <FaChevronDown className="w-3 h-3 text-gray-500" />
                ) : (
                  <FaChevronRight className="w-3 h-3 text-gray-500" />
                )}
              </div>

              {/* Submenu */}
              {activeSubmenu === index && (
                <div
                  ref={menuContainerRef}
                  className="bg-white border-l-4 border-green-400 max-h-64 overflow-y-auto"
                >
                  {["Transactions", "Reports", "Task"].includes(link.label)
                    ? (link.label === "Transactions"
                        ? transactions
                        : link.label === "Reports"
                        ? reports
                        : link.label === "Task"
                        ? tasks
                        : null
                      )
                        .filter(
                          (master) =>
                            (master.label === "Leave Application" &&
                              master.control) ||
                            (master.label === "Lead" && master.control) ||
                            (master.label === "Leave Summary" &&
                              master.control) ||
                            (master.label === "Leave Approval Pending" &&
                              master.control)
                        )
                        .map((master, masterIndex) => (
                          <div key={master.to} className="relative ">
                            <div className="flex justify-between items-center px-4 text-gray-600 text-md hover:bg-gray-200">
                              {/* Label Click - Always navigate to the main page */}
                              <span
                                className="cursor-pointer flex-1 py-1"
                                onClick={() => {
                                  // setMobileMenuOpen(false)
                                  navigate(master.to)
                                  toggleInnerMenu(masterIndex)
                                }}

                                // e.stopPropagation() // Prevent label's click event
                              >
                                {master.label}
                              </span>

                              {/* Chevron Click - Only toggles submenu */}
                              {master.hasChildren && (
                                <span
                                  // onClick={() =>
                                  //   // e.stopPropagation() // Prevent label's click event
                                  //   toggleInnerMenu(masterIndex)
                                  // }
                                  className="ml-2 cursor-pointer"
                                >
                                  {openInnerMenu === masterIndex ? (
                                    <FaChevronDown className="w-3 h-3 text-gray-500" />
                                  ) : (
                                    <FaChevronRight className="w-3 h-3 text-gray-500" />
                                  )}
                                </span>
                              )}
                            </div>

                            {/* Submenu: Only for 'Lead' */}
                            {openInnerMenu === masterIndex &&
                              master.hasChildren &&
                              master.label === "Lead" && (
                                <div className="ml-4  border-l-4 border-blue-400 bg-gray-50 p-2 submenu-container">
                                  {leads.map((child) => (
                                    <NavLink
                                      key={child.to}
                                      to={child.to}
                                      end
                                      className={({ isActive }) =>
                                        `block px-4 py-1 text-md ${
                                          isActive
                                            ? "bg-blue-100 text-blue-600 font-semibold"
                                            : "text-gray-600 hover:bg-gray-200"
                                        }`
                                      }
                                    >
                                      {child.label}
                                    </NavLink>
                                    // <Link
                                    //   key={child.to}
                                    //   to={child.to}
                                    //   className="block px-4 py-1 text-gray-600 text-md hover:bg-gray-200"
                                    // >
                                    //   {child.label}
                                    // </Link>
                                  ))}
                                </div>
                              )}
                          </div>
                        ))
                    : null}
                </div>
              )}
            </div>
          ))}
        </div>

        <div
          onClick={logout}
          className=" bg-gray-300  py-5 text-center flex items-center justify-start space-x-2 p-2 cursor-pointer"
        >
          <FaSignOutAlt className="w-5 h-5" /> {/* Logout Icon */}
          <span>Logout</span>
        </div>
      </div>

      {/* Logo and links */}
      <div className="flex items-center space-x-2 sm:px-4">
        <svg
          className="w-12 h-12 text-green-600"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="32"
            cy="32"
            r="30"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            d="M32 2 A30 30 0 0 1 32 62"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            fill="currentColor"
            fontSize="18"
            fontFamily="Arial, Helvetica, sans-serif"
            dy=".3em"
          >
            CRm
          </text>
        </svg>
        <span className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-green-600">
          MANAGEMENT
        </span>

        {/* <span className="text-3xl font-bold text-green-600">MANAGEMENT</span> */}
      </div>
      <div className="flex flex-grow justify-center items-center">
        <nav className="hidden md:flex  items-center md:gap-2 lg:gap-8 ">
          {links.map((link) => (
            <div
              key={link.to}
              className="relative mb-2 "
              onMouseEnter={() => {
                if (
                  link.label === "Masters" &&
                  masters.some((master) => master.control)
                ) {
                  setMasterMenuOpen(true)
                } else if (
                  link.label === "Transactions" &&
                  transactions.some((transaction) => transaction.control)
                ) {
                  setTransactionMenuOpen(true)
                } else if (
                  link.label === "Reports" &&
                  reports.some((report) => report.control)
                ) {
                  setReportsMenuOpen(true)
                } else if (
                  link.label === "Task" &&
                  tasks.some((task) => task.control)
                ) {
                  setTasksMenuOpen(true)
                }
              }}
              onMouseLeave={() => {
                if (
                  link.label === "Masters" &&
                  masters.some((master) => master.control)
                ) {
                  setMasterMenuOpen(false)
                } else if (
                  link.label === "Transactions" &&
                  transactions.some((transaction) => transaction.control)
                ) {
                  setTransactionMenuOpen(false)
                } else if (
                  link.label === "Reports" &&
                  reports.some((report) => report.control)
                ) {
                  setReportsMenuOpen(false)
                } else if (
                  link.label === "Task" &&
                  tasks.some((task) => task.control)
                ) {
                  setTasksMenuOpen(false)
                }
              }}
            >
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  isActive
                    ? "text-primary text-xl leading-7 font-bold"
                    : "text-textColor text-xl leading-7 hover:text-primary"
                }
              >
                {link.label}
              </NavLink>

              {/* Masters dropdown */}
              {link.label === "Masters" &&
                masterMenuOpen &&
                masters.some((master) => master.control) && (
                  <div className="absolute top-full left-0 mt-0 w-48 bg-white border border-gray-200 grid grid-cols-1 shadow-lg rounded-md z-50 ">
                    {masters.map(
                      (master) =>
                        master.control && (
                          <div
                            key={master.to}
                            className="relative mb-2"
                            onMouseEnter={() => {
                              if (master.hasChildren) setInventoryMenuOpen(true)
                            }}
                            onMouseLeave={() => {
                              if (master.hasChildren)
                                setInventoryMenuOpen(false)
                            }}
                          >
                            <Link
                              to={master.to}
                              className="flex justify-between px-4 py-1 text-gray-600 text-sm hover:bg-gray-100"
                            >
                              {master.label}
                              {master.hasChildren && <FaChevronRight />}
                            </Link>

                            {/* Inventory dropdown */}
                            {master.hasChildren && inventoryMenuOpen && (
                              <div
                                className="absolute top-0 left-full w-48 bg-white border border-gray-200 shadow-lg rounded-md"
                                onMouseEnter={() => setInventoryMenuOpen(true)}
                                onMouseLeave={() => setInventoryMenuOpen(false)}
                              >
                                {inventorys.map((inventory) => (
                                  <Link
                                    key={inventory.to}
                                    to={inventory.to}
                                    className="block px-4 py-2 text-gray-600 text-sm hover:bg-gray-100"
                                  >
                                    {inventory.label}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                    )}
                  </div>
                )}
              {link.label === "Transactions" &&
                transactionMenuOpen &&
                transactions.some((transaction) => transaction.control) && (
                  <div className="absolute top-full left-0 mt-0 w-48 bg-white border border-gray-200 shadow-lg block rounded-md z-50">
                    {transactions.map(
                      (transaction) =>
                        transaction.control && (
                          <div
                            key={transaction.to}
                            className="relative mb-2"
                            onMouseEnter={() => {
                              if (
                                transaction.hasChildren &&
                                transaction.label === "Lead"
                              ) {
                                setLeadMenuOpen(true)
                              }
                            }}
                            onMouseLeave={() => {
                              if (
                                transaction.hasChildren &&
                                transaction.label === "Lead"
                              ) {
                                setLeadMenuOpen(false)
                              }
                            }}
                          >
                            <Link
                              to={transaction.to}
                              className="flex justify-between px-4 py-1 text-gray-600 text-sm hover:bg-gray-100 items-center"
                            >
                              {transaction.label}
                              {transaction.hasChildren && <FaChevronRight />}
                            </Link>
                            {/*Lead dropdown*/}
                            {transaction.hasChildren && leadMenuOpen && (
                              <div
                                className="absolute top-0 left-full w-48 bg-white border border-gray-200 shadow-lg rounded-md"
                                onMouseEnter={() => setLeadMenuOpen(true)}
                                onMouseLeave={() => setLeadMenuOpen(false)}
                              >
                                {leads.map(
                                  (lead) =>
                                    lead.control && (
                                      <Link
                                        key={lead.to}
                                        to={lead.to}
                                        className="block px-4 py-2 text-gray-600 text-sm hover:bg-gray-100"
                                      >
                                        {lead.label}
                                      </Link>
                                    )
                                )}
                              </div>
                            )}
                          </div>
                        )
                    )}
                  </div>
                )}

              {link.label === "Reports" &&
                reportsMenuOpen &&
                reports.some((report) => report.control) && (
                  <div className="absolute top-full left-0 mt-0 w-48 bg-white border border-gray-200 grid grid-cols-1 shadow-lg rounded-md z-50">
                    {reports.map(
                      (report) =>
                        report.control && (
                          <Link
                            key={report.to}
                            to={report.to}
                            className=" px-4 py-2 text-gray-600 text-sm hover:bg-gray-100"
                          >
                            {report.label}
                          </Link>
                        )
                    )}
                  </div>
                )}
              {link.label === "Task" &&
                tasksMenuOpen &&
                tasks.some((task) => task.control) && (
                  <div className="absolute top-full left-0 mt-0 w-48 bg-white border border-gray-200 grid grid-cols-1 shadow-lg rounded-md z-50">
                    {tasks.map(
                      (task) =>
                        task.control && (
                          <Link
                            key={task.to}
                            to={task.to}
                            className=" px-4 py-2 text-gray-600 text-sm hover:bg-gray-100"
                          >
                            {task.label}
                          </Link>
                        )
                    )}
                  </div>
                )}
            </div>
          ))}
        </nav>
      </div>
      {mathcheddemoleadcount > 0 && (
        <div
          onClick={() =>
            user?.role === "Admin"
              ? navigate("/admin/transaction/lead/demoFollowup")
              : navigate("/staff/transaction/lead/demoFollowup")
          }
          className="cursor-pointer flex items-center  relative mr-8 md:hidden"
        >
          <FiMessageCircle className="text-4xl text-gray-700" />
          {mathcheddemoleadcount > 0 && (
            <span className="absolute -top-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
              {mathcheddemoleadcount}
            </span>
          )}
        </div>
      )}

      <div className=" hidden md:flex flex-grow justify-center items-center ">
        <div className="relative flex items-center">
          {mathcheddemoleadcount > 0 && (
            <div
              onClick={() =>
                user?.role === "Admin"
                  ? navigate("/admin/transaction/lead/demoFollowup")
                  : navigate("/staff/transaction/lead/demoFollowup")
              }
              className="cursor-pointer flex items-center  relative mr-3"
            >
              <FiMessageCircle className="text-4xl text-gray-700" />
              {mathcheddemoleadcount > 0 && (
                <span className="absolute -top-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {mathcheddemoleadcount}
                </span>
              )}
            </div>
          )}
          {user?.profileUrl && user?.profileUrl?.length > 0 ? (
            <img
              src={user?.profileUrl}
              // alt={`${user?.name}'s profile`}
              onMouseEnter={() => setProfileMenuOpen(true)}
              onMouseLeave={() => setProfileMenuOpen(false)}
              className="w-10 h-10 rounded-full" // Add styling as needed
            />
          ) : (
            <FaUserCircle
              className="text-3xl text-gray-600 cursor-pointer"
              onMouseEnter={() => setProfileMenuOpen(true)}
              onMouseLeave={() => setProfileMenuOpen(false)}
            />
          )}
          <span
            onMouseEnter={() => setProfileMenuOpen(true)}
            onMouseLeave={() => setProfileMenuOpen(false)}
            className="text-gray-700 mx-4 rounded-md cursor-pointer"
          >
            {user?.name || "Profile"}
          </span>

          <div
            onClick={logout}
            className="flex  items-center gap-1 p-2  rounded hover:cursor-pointer hover:scale-110 hover:shadow-lg transform transition-transform duration-300"
          >
            <FiLogOut className="text-blue-800" size={20} />
            <span className="text-blue-800 text-semibold">Logout</span>
          </div>
        </div>
      </div>
    </header>
  )
}
