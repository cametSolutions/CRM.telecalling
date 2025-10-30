
import { useState, useEffect, useMemo } from "react"
import { Search, Check, X, Shield, ChevronDown, ChevronUp } from "lucide-react"
import api from "../../api/api"


const UserPermissionList = ({ user, closeModal,refresh}) => {
  const [userPermissions, setUserPermissions] = useState({
    Company: false,
    Branch: false,
    Customer: false,
    Services: false,
    CallNotes: false,
    UsersAndPasswords: false,
    MenuRights: false,
    VoucherMaster: false,
    Target: false,
    Product: false,
    Inventory: false,
    Partners: false,
    Department: false,
    Brand: false,
    TaskLevel: false,
    Category: false,
    HSN: false,
    Lead: false,
    LeadAllocation: false,
    LeadFollowUp: false,
    CallRegistration: false,
    LeaveApplication: false,
    SignUpCustomer: false,
    ProductMerge: false,
    ProductAllocationPending: false,
    LeaveApprovalPending: false,
    WorkAllocation: false,
    ExcelConverter: false,
    Summary: false,
    ExpiryRegister: false,
    ExpiredCustomerCalls: false,
    CustomerCallsSummary: false,
    CustomerContacts: false,
    CustomerActionSummary: false,
    AccountSearch: false,
    LeaveSummary: false,
    TaskAnalysis: false,
    LeadReallocation: false,
    ProductandServices: false,
    Employee: false
  })

  const [selectAll, setSelectAll] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    ProductandServices: true,
    Employee: true
  })

  const productAndServiceChildren = [
    "Product",
    "Services",
    "Brand",
    "Category",
    "HSN",
    "CallNotes",
    "TaskLevel"
  ]
  const employeeChildren = [
    "UsersAndPasswords",
    "MenuRights",
    "Target",
    "VoucherMaster"
  ]

  useEffect(() => {
    if (user && user.permissions?.length > 0) {
      const updatedPermissions = { ...userPermissions }
      user.permissions.forEach((permissionObj) => {
        Object.keys(permissionObj).forEach((key) => {
          if (key !== "_id" && typeof permissionObj[key] === "boolean") {
            updatedPermissions[key] = permissionObj[key]
          }
        })
      })

      const allPermissionsTrue = Object.keys(updatedPermissions).every(
        (key) => updatedPermissions[key] === true
      )
      setSelectAll(allPermissionsTrue)
      setUserPermissions(updatedPermissions)
    }
  }, [user])

  const handleChange = (e) => {
    const { name, checked } = e.target
    const updatedPermissions = { ...userPermissions, [name]: checked }

    // Auto-toggle children when parent is toggled
    if (name === "ProductandServices") {
      productAndServiceChildren.forEach((child) => {
        updatedPermissions[child] = checked
      })
    } else if (name === "Employee") {
      employeeChildren.forEach((child) => {
        updatedPermissions[child] = checked
      })
    }

    setUserPermissions(updatedPermissions)

    const allPermissionsTrue = Object.keys(updatedPermissions).every(
      (key) => updatedPermissions[key] === true
    )
    setSelectAll(allPermissionsTrue)
  }

  const handleSelectAll = (e) => {
    const checked = e.target.checked
    setSelectAll(checked)

    const updatedPermissions = Object.keys(userPermissions).reduce(
      (acc, key) => {
        acc[key] = checked
        return acc
      },
      {}
    )
    setUserPermissions(updatedPermissions)
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const response = await api.post(
        `/auth/userPermissionUpdate?Userid=${user?._id}`,
        userPermissions
      )

      if (response.status === 200 || response.status === 201) {
        setLoading(false)
        setShowSuccess(true)

        setTimeout(() => {
          setShowSuccess(false)
          closeModal()
          refresh()
        }, 1500)
      }
    } catch (error) {
      setLoading(false)
      console.error("Error updating permissions:", error)
    }
  }

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const filteredPermissions = useMemo(() => {
    return Object.keys(userPermissions).filter(
      (key) =>
        key.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !productAndServiceChildren.includes(key) &&
        !employeeChildren.includes(key)
    )
  }, [searchTerm, userPermissions])

  const enabledCount = Object.values(userPermissions).filter(Boolean).length
  const totalCount = Object.keys(userPermissions).length

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full relative overflow-hidden transform transition-all">
        {/* Success Overlay */}
        {showSuccess && (
          <div className="absolute inset-0 bg-green-500 z-50 flex items-center justify-center">
            <div className="text-center text-white animate-bounce">
              <Check className="w-20 h-20 mx-auto mb-4" />
              <p className="text-2xl font-bold">Permissions Updated!</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">User Permissions</h2>
                <p className="text-blue-100 text-sm">{user?.name || "User"}</p>
              </div>
            </div>
            <button
              onClick={closeModal}
              className="hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Stats */}
          <div className="mt-1 flex items-center gap-4 text-sm">
            <div className="bg-white/20 px-3 py-1 rounded-full">
              {enabledCount} / {totalCount} enabled
            </div>
            <div className="flex-1 bg-white/20 rounded-full h-2 overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-500"
                style={{ width: `${(enabledCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          {/* Search Bar */}
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search permissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Select All */}
          <label className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors mb-4">
            <span className="font-semibold text-gray-700">
              Select All Permissions
            </span>
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              checked={selectAll}
              onChange={handleSelectAll}
            />
          </label>

          {/* Permissions List */}
          <div className="max-h-96 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {filteredPermissions.map((key) => (
              <div
                key={key}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden"
              >
                <label className="flex items-center justify-between px-3 py-1 cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className="font-medium text-gray-700">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <input
                    type="checkbox"
                    name={key}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    checked={userPermissions[key]}
                    onChange={handleChange}
                  />
                </label>

                {/* Product & Services Children */}
                {key === "ProductandServices" && (
                  <div className="border-t border-gray-200">
                    <button
                      onClick={() => toggleSection("ProductandServices")}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-sm font-medium text-gray-600">
                        Sub-permissions
                      </span>
                      {expandedSections.ProductandServices ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    {expandedSections.ProductandServices && (
                      <div className="p-3 bg-blue-50/50 space-y-2">
                        {productAndServiceChildren.map((child) => (
                          <label
                            key={child}
                            className="flex items-center justify-between p-2 bg-white rounded cursor-pointer hover:bg-blue-50 transition-colors"
                          >
                            <span className="text-sm text-gray-700">
                              {child.replace(/([A-Z])/g, " $1").trim()}
                            </span>
                            <input
                              type="checkbox"
                              name={child}
                              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                              checked={userPermissions[child]}
                              onChange={handleChange}
                            />
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Employee Children */}
                {key === "Employee" && (
                  <div className="border-t border-gray-200">
                    <button
                      onClick={() => toggleSection("Employee")}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-sm font-medium text-gray-600">
                        Sub-permissions
                      </span>
                      {expandedSections.Employee ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    {expandedSections.Employee && (
                      <div className="p-3 bg-purple-50/50 space-y-2">
                        {employeeChildren.map((child) => (
                          <label
                            key={child}
                            className="flex items-center justify-between p-2 bg-white rounded cursor-pointer hover:bg-purple-50 transition-colors"
                          >
                            <span className="text-sm text-gray-700">
                              {child.replace(/([A-Z])/g, " $1").trim()}
                            </span>
                            <input
                              type="checkbox"
                              name={child}
                              className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                              checked={userPermissions[child]}
                              onChange={handleChange}
                            />
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={closeModal}
            disabled={loading}
            className="px-6 py-1 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-1 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  )
}
 export default UserPermissionList


