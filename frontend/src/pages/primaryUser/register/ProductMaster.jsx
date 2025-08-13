

import api from "../../../api/api"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import ProductAdd from "../../../components/primaryUser/ProductAdd"
function ProductMaster() {
  const user = localStorage.getItem("user")

  const navigate = useNavigate()
  const handleSubmit = async (productData, tableData) => {
    try {
      const response = await api.post(
        "/product/productRegistration",
        { productData: productData, tableData: tableData },
        {
          withCredentials: true
        }
      )

      toast.success(response && response.data && response.data.message)
      if (user.role === "Admin") {
        navigate("/admin/masters/product")
      } else {
        navigate("/staff/masters/product")
      }
    } catch (error) {
      console.error("Error creating product:", error)
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message) // Display the backend error message
      } else {
        toast.error("An unexpected error occurred. Please try again.") // Fallback message
      }
    }
  }
  return (
    <div>
      <ProductAdd process="Registration" handleProductData={handleSubmit} />
    </div>
  )
}

export default ProductMaster
