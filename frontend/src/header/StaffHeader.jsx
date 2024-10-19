import React, { useState, useEffect, useLocation } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { FaSearch, FaTimes, FaChevronRight } from "react-icons/fa"
import { VscAccount } from "react-icons/vsc"

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
    console.log("localsotoratr", storedUser)
    if (storedUser) {
      setUser(JSON.parse(storedUser)) // Parse the user data from string to object
    }
  }, [])
  console.log("afiterlogin", user)
  const logout = () => {
    // Clear the authentication token from local storage
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    localStorage.removeItem("timer")

    // Redirect to login page
    navigate("/")
  }
  const links = [
    { to: "/staff/home", label: "Home" },
    { to: "/staff/masters", label: "Masters" },
    { to: "/staff/transactions", label: "Transactions" },
    { to: "/staff/report", label: "Reports" },
    { to: "/staff/task", label: "Task" }
  ]

  const masters = [
    { to: "/staff/masters/customer", label: "Customer" },

    { to: "/staff/masters/menuRights", label: "Menu Rights" },
    { to: "/staff/masters/voucherMaster", label: "Voucher Master" },
    { to: "/staff/masters/target", label: "Target" },

    { to: "/staff/masters/customerImport", label: "Customer Import" },
    { to: "/staff/masters/partners", label: "Partners" },
    { to: "/staff/masters/department", label: "Department" }
  ]

  const inventorys = [
    { to: "/staff/masters/inventory/brandRegistration", label: "Brand" },
    { to: "/staff/masters/inventory/categoryRegistration", label: "Category" },
    { to: "/staff/masters/inventory/hsnlist", label: "HSN" }
  ]
  const transactions = [
    { to: "/staff/transaction/lead", label: "Lead" },
    {
      to: "/staff/transaction/call-registration",
      label: "Call Registration"
    },
    {
      to: "/staff/transaction/leave-application",
      label: "Leave Application"
    }
  ]
  const tasks = [
    { to: "/staff/tasks/signUp-custmer", label: "Sign Up Custmer" },
    { to: "/staff/tasks/productMerge", label: "Product Merge" },
    {
      to: "/staff/tasks/productAllocation-Pending",
      label: "Product Allocation Pending"
    },
    {
      to: "/staff/tasks/leaveApproval-pending",
      label: "Leave Approval Pending"
    },
    { to: "/staff/tasks/workAllocation", label: "Work Allocation" },
    { to: "/staff/tasks/location", label: "Location" }
  ]
  const reports = [
    { to: "/staff/reports/summary", label: "Summary" },
    { to: "/staff/reports/expiry-register", label: "Expiry Register" },
    {
      to: "/staff/reports/expired-custmerCalls",
      label: "Expired Customer Calls"
    },
    {
      to: "/staff/reports/customer-callsSummary",
      label: "Customer Calls Summary"
    },
    {
      to: "/staff/reports/customer-contacts",
      label: "Customer Contacts"
    },
    {
      to: "/staff/reports/customer-actionsummary",
      label: "Customer Action Summary"
    },
    { to: "/adminr/eports/account-search", label: "Account Search" },
    { to: "/staff/reports/leave-summary", label: "Leave Summary" }
  ]

  return (
    <header className="sticky top-0 z-50 flex bg-white shadow-md h-24 items-center">
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
        <nav className="hidden md:flex  items-center gap-3 space-x-4">
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
          {/* <VscAccount
            className="text-2xl"
            onMouseEnter={() => setProfileMenuOpen(true)}
            onMouseLeave={() => setProfileMenuOpen(false)}
          /> */}
          {user?.profileUrl && (
            <img
              src={user?.profileUrl}
              alt={`${user?.name}'s profile`}
              onMouseEnter={() => setProfileMenuOpen(true)}
              onMouseLeave={() => setProfileMenuOpen(false)}
              className="w-10 h-10 rounded-full" // Add styling as needed
            />
          )}
          <span className="text-gray-700 mx-4 rounded-md cursor-pointer">
            {user?.name || "Profile"}
          </span>
          {profileMenuOpen && (
            <div
              onMouseEnter={() => setProfileMenuOpen(true)}
              onMouseLeave={() => setProfileMenuOpen(false)}
              className="absolute bg-white border rounded top-full mt-0  w-40 shadow-lg"
            >
              {/* <Link
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
              )} */}
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
  )
}
