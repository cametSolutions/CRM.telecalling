import { useMemo } from "react"
import CustomerAdd from "../../../components/secondaryUser/CustomerAdd"
import { useLocation, useNavigate } from "react-router-dom"
import api from "../../../api/api"
import { removeSearch } from "../../../../slices/search"
import { useDispatch } from "react-redux"
import UseFetch from "../../../hooks/useFetch"
import { toast } from "react-toastify"

function CustomerEdit() {
  const userData = localStorage.getItem("user")
  const users = JSON.parse(userData)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const { customerId, index, navigatebackto } = location.state || {}
  const { data: editedCustomer } = UseFetch(
    `/customer/geteditedCustomer?customerid=${customerId}`
  )
  console.log(editedCustomer)
  console.log(customerId)
  console.log(index)
  function formatDateString(dateString) {
    const dateObject = new Date(dateString)
    const year = dateObject.getUTCFullYear()
    const month = String(dateObject.getUTCMonth() + 1).padStart(2, "0") // Months are zero-indexed
    const day = String(dateObject.getUTCDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const updatedCustomer = useMemo(() => {
    if (!editedCustomer) return null

    return {
      ...editedCustomer,
      index: index !== undefined ? index : null,
      selected: editedCustomer.selected?.map((item) => {
        const updatedItem = { ...item }
        for (const key in updatedItem) {
          if (
            Object.prototype.hasOwnProperty.call(updatedItem, key) &&
            key.toLowerCase().includes("date") &&
            updatedItem[key]
          ) {
            updatedItem[key] = formatDateString(updatedItem[key])
          }
        }
        return updatedItem
      })
    }
  }, [editedCustomer, index])

  // const updatedCustomer = useMemo(() => {
  //   if (!editedCustomer) return null
  //   return {
  //     ...editedCustomer,
  //     index: index !== undefined ? index : null
  //   }
  // }, [editedCustomer, index])
  console.log(updatedCustomer)
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
      if (navigatebackto) {
        navigate(navigatebackto)
      } else {
        if (users?.role === "Admin") {
          navigate("/admin/masters/customer")
        } else if (users?.role === "Staff") {
          navigate("/staff/masters/customer")
        }
      }
    } catch (error) {
      console.error("Error updating branch:", error)
      toast.error(error.response.data.message)
    }
  }
  // console.log(updatedCustomer)
  return (
    <div>
      {updatedCustomer && (
        <CustomerAdd
          navigatebackto={navigatebackto}
          process="edit"
          handleEditedData={handleSubmit}
          customer={updatedCustomer}
        />
      )}
    </div>
  )
}

export default CustomerEdit
