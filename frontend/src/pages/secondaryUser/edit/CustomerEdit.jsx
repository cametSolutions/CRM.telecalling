import CustomerAdd from "../../../components/secondaryUser/CustomerAdd"
import { useLocation, useNavigate } from "react-router-dom"
import api from "../../../api/api"
import { removeSearch } from "../../../../slices/search"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"

function CustomerEdit() {
  const userData = localStorage.getItem("user")
  const users = JSON.parse(userData)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const customer = location.state?.customer
  const selected = location.state?.selected
  const index = location.state?.index

  const customerId = customer._id
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

  const updatedCustomer = Object.assign({}, customer, {
    selected: selected ? [selected] : [], // If selected is falsy, fall back to an empty object
    index: index !== undefined ? index : null
  })
  const handleSubmit = async (customerData, tableData, index) => {
    try {
      const response = await api.post(
        `/customer/customerEdit?customerid=${customerId}&index=${index}`,
        { customerData, tableData },
        {
          withCredentials: true
        }
      )
      toast.success(response.data.message)
      dispatch(removeSearch(""))
      if (users?.role === "Admin") {
        navigate("/admin/masters/customer")
      } else if (users?.role === "Staff") {
        navigate("/staff/masters/customer")
      }
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
        customer={updatedCustomer}
      />
    </div>
  )
}

export default CustomerEdit
