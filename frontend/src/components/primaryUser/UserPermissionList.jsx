import React, { useState, useEffect } from "react"
import api from "../../api/api"
import { toast } from "react-toastify"
const UserPermissionList = ({ user, closeModal }) => {
  const [userPermissions, setUserPermissions] = useState({
    Company: false,
    Branch: false,
    Customer: false,
    UsersAndPasswords: false,
    MenuRights: false,
    VoucherMaster: false,
    Target: false,
    Product: false,
    Inventory: false,
    Partners: false,
    Department: false,
    Brand: false,
    Category: false,
    HSN: false,
    Lead: false,
    CallRegistration: false,
    LeaveApplication: true,
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
    LeaveSummary: false
  })

  useEffect(() => {
    // Initialize user permissions based on the user object
    if (user && user.permissions.length > 0) {
      const updatedPermissions = { ...userPermissions }
      user.permissions.forEach((permissionObj) => {
        Object.keys(permissionObj).forEach((key) => {
          // Only update if the key is a valid permission, not an _id or an object
          if (key !== "_id" && typeof permissionObj[key] === "boolean") {
            updatedPermissions[key] = permissionObj[key]
          }
        })
      })

      setUserPermissions(updatedPermissions)
    }
  }, [user])

  const handleChange = (e) => {
    const { name, checked } = e.target
    setUserPermissions((prev) => ({
      ...prev,
      [name]: checked
    }))
  }

  const handleSubmit = async () => {
    try {
      const response = await api.post(
        `/auth/userPermissionUpdate?Userid=${user._id}`,
        userPermissions,
        {
          withCredentials: true
        }
      )
      if (response.status === 200 || response.status === 201) {
        // Display success toast and navigate
        toast.success(response.data.message)
      } else {
        // Handle unexpected status codes (other than 200 or 201)
        toast.error("Unexpected response from the server")
      }
    } catch (error) {
      console.error("Error creating customer:", error.message)
      toast.error("error saving customer")
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full relative">
        <h2 className="text-xl font-bold mb-4">Permissions for {user?.name}</h2>

        {/* Select All Checkbox */}
        <label className="flex items-center px-2 py-1">
          <input type="checkbox" className="w-4 h-4" checked="" onChange="" />
          <span className="ml-2">Select All</span>
        </label>

        {/* Permissions List */}
        <div className="max-h-48 overflow-y-auto">
          {Object.keys(userPermissions).map((key, index) => (
            <label key={index} className="flex items-center px-2 py-1">
              <input
                type="checkbox"
                key={key}
                name={key}
                className="w-4 h-4"
                checked={userPermissions[key]}
                onChange={(e) => handleChange(e)}
              />
              <span className="ml-2">{key}</span>
            </label>
          ))}
        </div>

        {/* Modal actions */}
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={closeModal} // Close the modal on Cancel
            className="bg-gray-300 px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit} // Submit logic can go here
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserPermissionList
