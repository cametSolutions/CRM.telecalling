import React, { useEffect, useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { FaSearch, FaTimes, FaChevronRight } from "react-icons/fa"
import { VscAccount } from "react-icons/vsc"

export default function AdminHeader() {
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
    navigate("/")
  }
  const links = [
    { to: "/admin/home", label: "Home" },
    { to: "/admin/masters", label: "Masters" },
    { to: "/admin/transactions", label: "Transactions" },
    { to: "/admin/report", label: "Reports" },
    { to: "/admin/task", label: "Task" }
  ]

  const masters = [
    { to: "/admin/masters/company", label: "Company" },
    { to: "/admin/masters/branch", label: "Branch" },
    { to: "/admin/masters/customer", label: "Customer" },
    { to: "/admin/masters/users-&-passwords", label: "Users & Passwords" },
    { to: "/admin/masters/menuRights", label: "Menu Rights" },
    { to: "/admin/masters/voucherMaster", label: "Voucher Master" },
    { to: "/admin/masters/target", label: "Target" },
    { to: "/admin/masters/product", label: "Product" },
    { to: "/admin/masters/inventory", label: "Inventory", hasChildren: true },

    { to: "/admin/masters/partners", label: "Partners" },
    { to: "/admin/masters/department", label: "Department" }
  ]

  const inventorys = [
    { to: "/admin/masters/inventory/brandRegistration", label: "Brand" },
    { to: "/admin/masters/inventory/categoryRegistration", label: "Category" },
    { to: "/admin/masters/inventory/hsnlist", label: "HSN" }
  ]
  const transactions = [
    { to: "/admin/transaction/lead", label: "Lead" },
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
    { to: "/admin/tasks/signUp-custmer", label: "Sign Up Custmer" },
    { to: "/admin/tasks/productMerge", label: "Product Merge" },
    {
      to: "/admin/tasks/productAllocation-Pending",
      label: "Product Allocation Pending"
    },
    {
      to: "/admin/tasks/leaveApproval-pending",
      label: "Leave Approval Pending"
    },
    { to: "/admin/tasks/workAllocation", label: "Work Allocation" },
    { to: "/admin/tasks/excelconverter", label: "Excel Converter" }
  ]
  const reports = [
    { to: "/admin/reports/summary", label: "Summary" },
    { to: "/admin/reports/expiry-register", label: "Expiry Register" },
    {
      to: "/admin/reports/expired-custmerCalls",
      label: "Expired Customer Calls"
    },
    {
      to: "/admin/reports/customer-callsSummary",
      label: "Customer Calls Summary"
    },
    {
      to: "/admin/reports/customer-contacts",
      label: "Customer Contacts"
    },
    {
      to: "/admin/reports/customer-actionsummary",
      label: "Customer Action Summary"
    },
    { to: "/adminr/eports/account-search", label: "Account Search" },
    { to: "/admin/reports/leave-summary", label: "Leave Summary" }
  ]

  return (
    <>
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
          className={`lg:hidden ${
            mobileMenuOpen
              ? "absolute top-0 left-0 z-50 bg-white shadow-md"
              : "hidden"
          }`}
        >
          <div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute right-0 mt-2 mr-2 text-gray-600 hover:text-black"
            >
              <FaTimes className="h-3 font-extralight" />
            </button>
          </div>
          <div className="block leading-10 text-blue-600 mt-5">
            {links.map((link) => (
              <div key={link.to}>
                <Link to={link.to} className="block px-4 hover:bg-gray-300">
                  {link.label}
                </Link>
              </div>
            ))}
          </div>
        </div>
        {/* Logo and links */}
        <div className="flex items-center space-x-2 sm:px-12">
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
          <span className="text-3xl font-bold text-green-600">CAMET</span>
        </div>
        <div className="flex flex-grow justify-center items-center">
          <nav className="hidden md:flex items-center gap-3 space-x-4">
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
                  <div className="absolute top-full left-0 mt-0 w-48 bg-white border border-gray-200 grid grid-cols-1 shadow-lg rounded-md">
                    {masters.map((master) => (
                      <div
                        key={master.to}
                        className="relative mb-2"
                        onMouseEnter={() => {
                          if (master.hasChildren) setInventoryMenuOpen(true)
                        }}
                        onMouseLeave={() => {
                          if (master.hasChildren) setInventoryMenuOpen(false)
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
                    ))}
                  </div>
                )}
                {link.label === "Transactions" && transactionMenuOpen && (
                  <div className="absolute top-full left-0 mt-0 w-48 bg-white border border-gray-200 shadow-lg block rounded-md ">
                    {transactions.map((transaction) => (
                      <Link
                        key={transaction.to}
                        to={transaction.to}
                        className=" block  px-2 py-2 text-gray-600 text-sm hover:bg-gray-100"
                      >
                        {transaction.label}
                      </Link>
                    ))}
                  </div>
                )}
                {link.label === "Reports" && reportsMenuOpen && (
                  <div className="absolute top-full left-0 mt-0 w-48 bg-white border border-gray-200 grid grid-cols-1 shadow-lg rounded-md">
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
                  <div className="absolute top-full left-0 mt-0 w-48 bg-white border border-gray-200 grid grid-cols-1 shadow-lg rounded-md">
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

        <div className="flex flex-grow justify-center items-center">
          <div className="relative flex items-center">
            <VscAccount
              className="text-2xl"
              onMouseEnter={() => setProfileMenuOpen(true)}
              onMouseLeave={() => setProfileMenuOpen(false)}
            />
            {/* {user?.imageUrl && (
              <img
                src={user?.imageUrl}
                // alt={`${userData.name}'s profile`}
                onMouseEnter={() => setProfileMenuOpen(true)}
                onMouseLeave={() => setProfileMenuOpen(false)}
                className="w-20 h-20 rounded-full" // Add styling as needed
              />
            )} */}
            <span
              className="text-gray-700 mx-4 rounded-md cursor-pointer"
              onMouseEnter={() => setProfileMenuOpen(true)}
              onMouseLeave={() => setProfileMenuOpen(false)}
            >
              {user?.name || "Profile"}
            </span>
            {profileMenuOpen && (
              <div
                onMouseEnter={() => setProfileMenuOpen(true)}
                onMouseLeave={() => setProfileMenuOpen(false)}
                className="absolute bg-white border rounded top-full mt-0 right-8 w-40 shadow-lg"
              >
                <Link
                  to="/admin/crm/crm"
                  onMouseEnter={() => setCrmMenuOpen(true)}
                  onMouseLeave={() => setCrmMenuOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-200 cursor-pointer"
                >
                  CRM
                </Link>
                {crmMenuOpen && (
                  <div
                    onMouseEnter={() => setCrmMenuOpen(true)}
                    onMouseLeave={() => setCrmMenuOpen(false)}
                    className="absolute bg-white border rounded top-full mt-0 left-full w-40 shadow-lg"
                  >
                    <Link
                      to="/admin/crm/crm/activity"
                      className="block px-4 py-2 hover:bg-gray-200 cursor-pointer"
                    >
                      Activity
                    </Link>
                  </div>
                )}
                <Link
                  to="/admin/profile"
                  className="block px-4 py-2 hover:bg-gray-200 cursor-pointer"
                >
                  View Profile
                </Link>
                <button
                  onClick={logout}
                  className="block px-4 py-2 text-gray-600 text-sm hover:bg-gray-100 w-full text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          {/* <span>
          <FaSearch className="h-3 text-gray-500 ml-12 cursor-pointer" />
        </span> */}
        </div>
      </header>
    </>
  )
}
