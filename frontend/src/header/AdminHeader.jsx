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
    { label: "Masters" },
    { label: "Transactions" },
    { label: "Reports" },
    { label: "Task" }
  ]

  const masters = [
    {
      to: "/admin/masters/company",
      label: "Company"
      // control: user.permissions[0].Company
    },
    {
      to: "/admin/masters/branch",
      label: "Branch"
      // control: user.permissions[0].Branch
    },
    {
      to: "/admin/masters/customer",
      label: "Customer"
      // control: user.permissions[0].Customer
    },
    {
      to: "/admin/masters/users-&-passwords",
      label: "users & Passwords"
      // control: user.permissions[0].UsersAndPasswords
    },
    {
      to: "/admin/masters/menuRights",
      label: "Menu Rights"
      // control: user.permissions[0].MenuRights
    },
    {
      to: "/admin/masters/voucherMaster",
      label: "Voucher Master"
      // control: user.permissions[0].VoucherMaster
    },
    {
      to: "/admin/masters/target",
      label: "Target"
      // control: user.permissions[0].Target
    },
    {
      to: "/admin/masters/product",
      label: "Product"
      // control: user.permissions[0].Product
    },
    {
      to: "/admin/masters/inventory",
      label: "Inventory",
      hasChildren: true
      // control: user.permissions[0].Inventory
    },

    {
      to: "/admin/masters/partners",
      label: "Partners"
      // control: user.permissions[0].Partners
    },
    {
      to: "/admin/masters/department",
      label: "Department"
      // control: user.permissions[0].Department
    }
  ]

  const inventorys = [
    {
      to: "/admin/masters/inventory/brandRegistration",
      label: "Brand"
      // control: user.permissions[0].Brand
    },
    {
      to: "/admin/masters/inventory/categoryRegistration",
      label: "Category"
      // control: user.permissions[0].Category
    },
    {
      to: "/admin/masters/inventory/hsnlist",
      label: "HSN"
      // control: user.permissions[0].HSN
    }
  ]

  const transactions = [
    {
      to: "/admin/transaction/lead",
      label: "Lead"
      // control: user.permissions[0].Lead
    },
    {
      to: "/admin/transaction/call-registration",
      label: "Call Registration"
      // control: user.permissions[0].CallRegistration
    },
    {
      to: "/admin/transaction/leave-application",
      label: "Leave Application"
      // control: user.permissions[0].LeaveApplication
    }
  ]
  const tasks = [
    {
      to: "/admin/tasks/signUp-customer",
      label: "Sign Up Custmer"
      // control: user.permissions[0].SignUpCustomer
    },

    {
      to: "/admin/tasks/leaveApproval-pending",
      label: "Leave Approval Pending"
      // control: user.permissions[0].LeaveApprovalPending
    },
    {
      to: "/admin/tasks/workAllocation",
      label: "Work Allocation"
      // control: user.permissions[0].WorkAllocation
    },
    {
      to: "/admin/tasks/excelconverter",
      label: "Excel Converter"
      // control: user.permissions[0].ExcelConverter
    }
  ]
  const reports = [
    {
      to: "/admin/reports/summary",
      label: "Summary"
      // control: user.permissions[0].Summary
    },
    {
      to: "/admin/reports/expiry-register",
      label: "Expiry Register"
      // control: user.permissions[0].ExpiryRegister
    },
    {
      to: "/admin/reports/expired-customerCalls",
      label: "Expired Customer Calls"
      // control: user.permissions[0].ExpiredCustomerCalls
    },

    {
      to: "/admin/reports/account-search",
      label: "Account Search"
      // control: user.permissions[0].AccountSearch
    },
    {
      to: "/admin/reports/leave-summary",
      label: "Leave Summary"
      // control: user.permissions[0].LeaveSummary
    }
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
              <div key={link?.to}>
                <Link to={link?.to} className="block px-4 hover:bg-gray-300">
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
          <span className="text-3xl font-bold text-green-600">MANAGEMENT</span>
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

        <div className="relative flex items-center flex-grow">
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
              className="absolute bg-white border rounded top-full l-0 mt-0  w-40 shadow-lg"
            >
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
      </header>
    </>
  )
}
