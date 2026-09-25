

import api from "../../../api/api"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { getLocalStorageItem } from "../../../helper/localstorage"
import ProductAdd from "../../../components/primaryUser/ProductAdd"
import { PackagePlus } from "lucide-react"
function ProductMaster() {
  const user = getLocalStorageItem("user")
console.log(user)
  const navigate = useNavigate()
  const handleSubmit = async (productData, tableData) => {
console.log(productData)
console.log(productData)

    try {
      const response = await api.post(
        "/product/productRegistration",
        { productData: productData, tableData: tableData },
        {
          withCredentials: true
        }
      )
console.log(user.role)
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
    <main className="min-h-full bg-slate-50 p-3 sm:p-4 lg:p-5">
      <div className="mx-auto max-w-7xl">
        <header className="mb-3 flex flex-col gap-2 rounded-xl border border-slate-100 bg-white px-3 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-white shadow-sm"><PackagePlus size={18} /></span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">Masters</p>
              <h1 className="text-lg font-bold leading-tight tracking-tight text-slate-900">Product Master</h1>
            </div>
          </div>
          <span className="w-fit rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">New product</span>
        </header>
        <ProductAdd process="Registration" handleProductData={handleSubmit} showHeading={false} />
      </div>
    </main>
  )
}

export default ProductMaster
