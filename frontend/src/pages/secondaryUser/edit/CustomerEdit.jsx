import React from "react"
import CustomerAdd from "../../../components/secondaryUser/CustomerAdd"
import { useLocation, useNavigate } from "react-router-dom"
import api from "../../../api/api"
import { toast } from "react-toastify"

function CustomerEdit() {
  const navigate = useNavigate()
  const location = useLocation()
  const customer = location.state?.customer
  const selected = location.state?.selected
  const customerId = customer._id
  console.log("selected", selected)
  console.log(customerId)
  function formatDateString(dateString) {
    const dateObject = new Date(dateString)
    const year = dateObject.getUTCFullYear()
    const month = String(dateObject.getUTCMonth() + 1).padStart(2, "0") // Months are zero-indexed
    const day = String(dateObject.getUTCDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  // Iterate over the keys in the selected object
  for (const key in selected) {
    if (
      selected.hasOwnProperty(key) &&
      key.includes("Date") // Check for date fields
    ) {
      // Format the date
      selected[key] = formatDateString(selected[key])
    }
  }
  const handleSubmit = async (customerData, tableData) => {
    try {
      const response = await api.post(
        `/customer/customerEdit?customerid=${customerId}`,
        { customerData, tableData },
        {
          withCredentials: true
        }
      )
      toast.success(response.data.message)
      navigate("/admin/masters/customer")
    } catch (error) {
      console.error("Error updating branch:", error)
      toast.error(error.response.data.message)
    }
  }
  return (
    <div>
      <CustomerAdd
        process="edit"
        handleEditedData={handleSubmit}
        customer={customer}
        selected={selected}
      />
    </div>
  )
}

export default CustomerEdit
