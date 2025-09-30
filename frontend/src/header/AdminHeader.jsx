import { useEffect, useState, useRef } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { FiLogOut } from "react-icons/fi"
import api from "../api/api"
import { FaChevronRight, FaChevronDown } from "react-icons/fa"
import { FaSignOutAlt } from "react-icons/fa"
import { FaUserCircle } from "react-icons/fa" // Import the icon
import { toast } from "react-toastify"
export default function AdminHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [transactionMenuOpen, setTransactionMenuOpen] = useState(false)
  const [masterMenuOpen, setMasterMenuOpen] = useState(false)
  const [reportsMenuOpen, setReportsMenuOpen] = useState(false)
  const [tasksMenuOpen, setTasksMenuOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState(null)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [inventoryMenuOpen, setInventoryMenuOpen] = useState(false)
  const [leadMenuOpen, setLeadMenuOpen] = useState(false)
  const [openInnerMenu, setOpenInnerMenu] = useState(null) // Inner submenu state
  const navigate = useNavigate()
  const menuContainerRef = useRef(null)

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

  // const logout = async () => {
  //   try {
  //     await api.post("/auth/logout") // 🚀 Call backend to clear cookie
  //     toast.success("Logout successfully")
  //   } catch (err) {
  //     console.error("Logout API failed:", err)
  //   }
  //   // Clear the authentication token from local storage
  //   localStorage.removeItem("authToken")
  //   localStorage.removeItem("user")
  //   localStorage.removeItem("timer")
  //   localStorage.removeItem("wish")

  //   // Redirect to login page
  //   navigate("/")
  // }
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

  const links = [
    // {to:"/admin/home",label:"Home"},
    { to: "/admin/dashBoard", label: "Dashboard" },
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
      to: "/admin/masters/company",
      label: "Company"
    },
    {
      to: "/admin/masters/leavemaster",
      label: "Leavemaster"
    },
    {
      to: "/admin/masters/branch",
      label: "Branch"
    },
    { to: "/admin/masters/taskRegistration", label: "Task" },
    {
      to: "/admin/masters/callnotes",
      label: "Call Notes"
    },
    {
      to: "/admin/masters/customer",
      label: "Customer"
    },
    {
      to: "/admin/masters/users-&-passwords",
      label: "users & Passwords"
    },
    {
      to: "/admin/masters/menuRights",
      label: "Menu Rights"
    },
    {
      to: "/admin/masters/voucherMaster",
      label: "Voucher Master"
    },
    {
      to: "/admin/masters/target",
      label: "Target"
    },
    {
      to: "/admin/masters/product",
      label: "Product"
    },
    {
      label: "Inventory",
      hasChildren: true
    },

    {
      to: "/admin/masters/partners",
      label: "Partners"
    },
    {
      to: "/admin/masters/servicesRegistration",
      label: "Services"
    },
    {
      to: "/admin/masters/department",
      label: "Department"
    }
  ]
  const leads = [
    { to: "/admin/transaction/lead", label: "New Lead" },
    { to: "/admin/transaction/lead/ownedLeadlist", label: "Own Lead" },

    {
      to: "/admin/transaction/lead/leadAllocation",
      label: "Lead Allocation"
    },
    {
      to: "/admin/transaction/lead/leadFollowUp",
      label: "Lead Follow Up"
    },
    {
      to: "/admin/transaction/lead/leadTask",
      label: "Task",
      control: true
    },
    {
      to: "/admin/transaction/lead/leadReallocation",
      label: "Lead Reallocation",
      control: true
    },
    {
      to: "/admin/transaction/lead/taskAnalysis",
      label: "Task Analysis",
      control: true
    }
  ]
  const inventorys = [
    {
      to: "/admin/masters/inventory/brandRegistration",
      label: "Brand"
    },
    {
      to: "/admin/masters/inventory/categoryRegistration",
      label: "Category"
    },
    {
      to: "/admin/masters/inventory/hsnlist",
      label: "HSN"
    }
  ]
  const transactions = [
    {
      label: "Lead",
      hasChildren: true
    },
    {
      to: "/admin/transaction/call-registration",
      label: "Call Registration"
    },
    {
      to: "/admin/transaction/leave-application",
      label: "Leave Application"
    }
  ]
  const tasks = [
    {
      to: "/admin/tasks/signUp-customer",
      label: "Sign Up Custmer"
    },

    {
      to: "/admin/tasks/leaveApproval-pending",
      label: "Leave Approval Pending"
    },
    {
      to: "/admin/tasks/workAllocation",
      label: "Work Allocation"
    },
    {
      to: "/admin/tasks/excelconverter",
      label: "Customer Converter(excel to Json)"
    },
    // {
    //   to: "/admin/tasks/excelconvertertoproductaddonly",
    //   label: "productadd(excel to Json)"
    // },
    {
      to: "/admin/tasks/attendanceExcelconverter",
      label: "Attendance Converter"
    }
  ]
  const reports = [
    {
      to: "/admin/reports/summary",
      label: " Call Summary"
    },
    {
      to: "/admin/reports/expiry-register",
      label: "Expiry Register"
    },

    {
      to: "/admin/reports/account-search",
      label: "Account Search"
    },
    {
      to: "/admin/reports/leave-summary",
      label: "Leave Summary"
    }
  ]
  return (
    <>
      <header className=" bg-gray-3s00 md:bg-white sticky top-0 z-40 h-16 lg:h-20 flex  shadow-md items-center">
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
          <div className="flex p-2 text-black text-center items-center space-x-4">
            <FaUserCircle className="h-6 w-6" />
            <span>{user?.name}</span>
          </div>
          <div className="flex items-center space-x-2 pl-4">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
            <span>{user?.role}</span>
          </div>
          <div className="text-black bg-gray-200 py-1 px-4">
            {user?.branchName?.join(" | ")}
          </div>
          <div className="text-gray-500 mt-3 px-4">Menu</div>

          {/* Menu - Scrollable */}
          <div className="flex flex-grow flex-col overflow-y-auto leading-10 text-black">
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
                    // ref={(el) => (menuRefs.current[index] = el)}
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
                              master.label === "Lead" ||
                              master.label === "Leave Application" ||
                              master.label === "Leave Summary" ||
                              master.label === "Leave Approval Pending"
                          )
                          .map((master, masterIndex) => (
                            <div key={master.to} className="relative py-2">
                              <div className="flex justify-between items-center px-4 text-gray-600 text-sm hover:bg-gray-100">
                                {/* Label Click - Always navigate to the main page */}
                                <span
                                  className="cursor-pointer flex-1"
                                  onClick={() => {
                                    // setMobileMenuOpen(false)
                                    toggleInnerMenu(masterIndex)
                                    navigate(master.to)
                                  }}
                                >
                                  {master.label}
                                </span>

                                {/* Chevron Click - Only toggles submenu */}
                                {master.hasChildren && (
                                  <span
                                    // onClick={(e) => {
                                    //   e.stopPropagation() // Prevent label's click event
                                    //   toggleInnerMenu(masterIndex)
                                    // }}
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
                                  <div className="ml-4 mt-2 border-l-4 border-blue-400 bg-gray-50 p-2 submenu-container">
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
                                      //   className="block px-4 py-1 text-gray-600 text-sm hover:bg-gray-200"
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
              CRM
            </text>
          </svg>
          <span className="text-xl sm:text-2xl md:text-3xl  font-bold text-green-600">
            MANAGEMENT
          </span>
        </div>
        <div className="flex flex-grow justify-center items-center">
          <nav className="hidden md:flex items-center md:gap-2 lg:gap-8">
            {links.map((link) => (
              <div
                key={link.to}
                className="relative mb-2"
                onMouseEnter={() => {
                  if (link.label === "Masters") {
                    setMasterMenuOpen(true)
                  } else if (link.label === "Transactions") {
                    setTransactionMenuOpen(true)
                  } else if (link.label === "Reports") {
                    setReportsMenuOpen(true)
                  } else if (link.label === "Task") {
                    setTasksMenuOpen(true)
                  }
                }}
                onMouseLeave={() => {
                  if (link.label === "Masters") {
                    setMasterMenuOpen(false)
                  } else if (link.label === "Transactions") {
                    setTransactionMenuOpen(false)
                  } else if (link.label === "Reports") {
                    setReportsMenuOpen(false)
                  } else if (link.label === "Task") {
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
                {link.label === "Masters" && masterMenuOpen && (
                  <div className="absolute top-full left-0 mt-0 w-48 bg-white border border-gray-200 grid grid-cols-1 shadow-lg rounded-md sz-50">
                    {masters.map((master) => (
                      <div
                        key={master.to}
                        className="relative mb-2"
                        onMouseEnter={() => {
                          if (
                            master.hasChildren &&
                            master.label === "Inventory"
                          ) {
                            setInventoryMenuOpen(true)
                          }
                        }}
                        onMouseLeave={() => {
                          if (
                            master.hasChildren &&
                            master.label === "Inventory"
                          ) {
                            setInventoryMenuOpen(false)
                          }
                        }}
                      >
                        <Link
                          to={master.to}
                          className="flex justify-between px-4 py-1 text-gray-600 text-sm hover:bg-gray-100 items-center"
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
                    ))}
                  </div>
                )}
                {link.label === "Transactions" && transactionMenuOpen && (
                  <div className="absolute top-full left-0 mt-0 w-48 bg-white border border-gray-200 shadow-lg block rounded-md z-50">
                    {transactions.map((transaction) => (
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
                            {leads.map((lead) => (
                              <Link
                                key={lead.to}
                                to={lead.to}
                                className="block px-4 py-2 text-gray-600 text-sm hover:bg-gray-100"
                              >
                                {lead.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {link.label === "Reports" && reportsMenuOpen && (
                  <div className="absolute top-full left-0 mt-0 w-48 bg-white border border-gray-200 grid grid-cols-1 shadow-lg rounded-md z-50">
                    {reports.map((report) => (
                      <Link
                        key={report.to}
                        to={report.to}
                        className=" px-4 py-2 text-gray-600 text-sm hover:bg-gray-100"
                      >
                        {report.label}
                      </Link>
                    ))}
                  </div>
                )}
                {link.label === "Task" && tasksMenuOpen && (
                  <div className="absolute top-full left-0 mt-0 w-48 bg-white border border-gray-200 grid grid-cols-1 shadow-lg rounded-md z-50">
                    {tasks.map((task) => (
                      <Link
                        key={task.to}
                        to={task.to}
                        className=" px-4 py-2 text-gray-600 text-sm hover:bg-gray-100"
                      >
                        {task.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
        {/* {mathcheddemoleadcount > 0 && (
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
        )} */}

        <div className=" hidden md:flex flex-grow justify-center items-center ">
          <div className="relative flex items-center">
            {/* {mathcheddemoleadcount > 0 && (
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
            )} */}
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
              <span className="text-blue-800">Logout</span>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
