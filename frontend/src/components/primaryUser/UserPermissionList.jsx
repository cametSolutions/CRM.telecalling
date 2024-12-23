import React, { useState, useEffect } from "react"
import api from "../../api/api"
import { toast } from "react-toastify"
const UserPermissionList = ({ user, closeModal, Loader }) => {
  const [userPermissions, setUserPermissions] = useState({
    Company: false,
    Branch: false,
    Customer: false,
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
    Category: false,
    HSN: false,
    Lead: false,
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
    LeaveSummary: false
  })
  const [selectAll, setSelectAll] = useState(false)
  const [loading, setLoading] = useState(false)

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

      // Check if all permissions are true
      const allPermissionsTrue = Object.keys(updatedPermissions).every(
        (key) => updatedPermissions[key] === true
      )
      console.log(allPermissionsTrue)
      // Set selectAll based on whether all permissions are true
      setSelectAll(allPermissionsTrue)

      setUserPermissions(updatedPermissions)
    }
  }, [user])

  const handleChange = (e) => {
    const { name, checked } = e.target
    // Update the user permissions
    const updatedPermissions = {
      ...userPermissions,
      [name]: checked
    }

    setUserPermissions(updatedPermissions)

    // Check if all permissions are now true
    const allPermissionsTrue = Object.keys(updatedPermissions).every(
      (key) => updatedPermissions[key] === true
    )

    // Update the selectAll state based on the updated permissions
    setSelectAll(allPermissionsTrue)
  }
  const handleSelectAll = (e) => {
    const checked = e.target.checked

    setSelectAll(checked)

    // Set all permissions to the value of the "Select All" checkbox
    const updatedPermissions = Object.keys(userPermissions).reduce(
      (acc, key) => {
        acc[key] = checked
        return acc
      },
      {}
    )

    setUserPermissions(updatedPermissions)
  }
  console.log(selectAll)

  const handleSubmit = async () => {
    try {
      setLoading(true)
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
        setLoading(false)
        closeModal()
      } else {
        // Handle unexpected status codes (other than 200 or 201)
        toast.error("Unexpected response from the server")
      }
    } catch (error) {
      console.error("Error creating customer:", error.message)
      toast.error("error saving customer")
    }
  }
  console.log(userPermissions)

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full relative">
        <h2 className="text-xl font-bold mb-4">Permissions for {user?.name}</h2>

        {/* Select All Checkbox */}
        <label className="flex items-center px-2 py-1">
          <input
            type="checkbox"
            className="w-4 h-4"
            checked={selectAll}
            onChange={handleSelectAll}
          />
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
                //
                onChange={handleChange}
              />
              <span className="ml-2">{key}</span>
            </label>
          ))}
        </div>

        {/* Modal actions */}
        <div className="mt-4 flex justify-center space-x-2">
          <button
            onClick={closeModal} // Submit logic can go here
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit} // Submit logic can go here
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            {loading ? "Loading..." : "SUBMIT"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserPermissionList
