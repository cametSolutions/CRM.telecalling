import React, { useState, useEffect, useLocation } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { FaSearch, FaTimes, FaChevronRight } from "react-icons/fa"
import { VscAccount } from "react-icons/vsc"
import { FaUserCircle } from "react-icons/fa" // Import the icon
export default function StaffHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [transactionMenuOpen, setTransactionMenuOpen] = useState(false)
  const [masterMenuOpen, setMasterMenuOpen] = useState(false)
  const [reportsMenuOpen, setReportsMenuOpen] = useState(false)
  const [tasksMenuOpen, setTasksMenuOpen] = useState(false)
  const [crmMenuOpen, setCrmMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [inventoryMenuOpen, setInventoryMenuOpen] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser)) // Parse the user data from string to object
    }
  }, [])

  const logout = () => {
    // Clear the authentication token from local storage
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    localStorage.removeItem("timer")

    // Redirect to login page
    toast.success("Logout successfully")
    navigate("/")
  }
  const links = [
    { to: "/staff/home", label: "Home" },
    { label: "Masters" },
    { label: "Transactions" },
    { label: "Reports" },
    { label: "Task" }
  ]
  const desiredMobileMenu = [
    { to: "/staff/transaction/leave-application", label: "Transactions" },
    { to: "/staff/reports/leave-summary", label: "Reports" }
  ]

  const masters = [
    {
      to: "/staff/masters/company",
      label: "Company",
      control: user?.permissions?.[0]?.Company ?? false
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
      to: "/staff/masters/inventory",
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
      label: "Summary",
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
      to: "/staff/transaction/lead",
      label: "Lead",
      control: user?.permissions?.[0]?.Lead ?? false
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

      {/* Mobile menu */}
      <div
        className={`sm:hidden ${
          mobileMenuOpen
            ? "absolute top-0 left-0 z-50 bg-blue-950 shadow-md w-3/5 h-screen"
            : "hidden"
        }`}
      >
        <div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute right-0 mt-2 mr-2 text-gray-600 hover:text-black"
          >
            <FaTimes className="h-4 w-4 font-extralight text-white" />
          </button>
        </div>
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
        <div className="p-2 flex text-white text-center items-center space-x-4">
          <FaUserCircle className="w-6 h-6" />
          <span>{user?.name}</span>
        </div>
        <div className="text-black bg-gray-50 py-1 px-4">
          {user?.selected?.[0]?.branchName}
        </div>
        <div className="text-gray-50 mt-3 px-4">Menu</div>
        <div className="block leading-10 text-white mt-3">
          {desiredMobileMenu.map((link) => (
            <div
              key={link?.to}
              className="px-8 hover:bg-gray-400 cursor-pointer"
            >
              <Link to={link?.to} className="block w-full h-full py-2">
                {link.label}
              </Link>
            </div>
          ))}
        </div>
        <div
          onClick={logout}
          className="mt-auto bg-red-600 text-white text-center py-3 cursor-pointer"
        >
          Logout
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
                          <Link
                            key={transaction.to}
                            to={transaction.to}
                            className=" block  px-2 py-2 text-gray-600 text-sm hover:bg-gray-100"
                          >
                            {transaction.label}
                          </Link>
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

      <div className=" hidden md:flex flex-grow justify-center items-center ">
        <div className="relative flex items-center">
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
          {profileMenuOpen && (
            <div
              onMouseEnter={() => setProfileMenuOpen(true)}
              onMouseLeave={() => setProfileMenuOpen(false)}
              className="absolute bg-white border rounded top-full mt-0  w-40 shadow-lg"
            >
              <button
                onClick={logout}
                className="block px-4 py-2 text-gray-600 text-sm hover:bg-gray-100 w-full text-left"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
