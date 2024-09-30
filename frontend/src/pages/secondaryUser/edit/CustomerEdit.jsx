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
