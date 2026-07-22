import { useEffect, useState } from "react"
import { getLocalStorageItem } from "../../../helper/localstorage"
import { useLocation } from "react-router-dom"
import UseFetch from "../../../hooks/useFetch"
import ProductAdd from "../../../components/primaryUser/ProductAdd"
import api from "../../../api/api"
import {toast} from"react-toastify"
import { useNavigate } from "react-router-dom"
function ProductEdit() {
  const [data, setData] = useState([])
  const [loggeduser, setloggedUser] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { product, selected, index, item } = location.state
  const productId = product._id
  useEffect(() => {
    setloggedUser(getLocalStorageItem("user"))
  }, [])
  const handleSubmit = async (productData, editData) => {
    console.log(productData)
    console.log(editData)

    try {
      await api.post(
        `/product/productEdit?productid=${productId}`,
        { productData, editData },
        {
          withCredentials: true
        }
      )
      toast.success("Product updated Successfully")
      if (loggeduser.role === "Admin") {
        navigate("/admin/masters/product")
      } else {
        navigate("/staff/masters/product")
      }
    } catch (error) {
      console.error("Error updating company:", error)
    }
  }
  return (
    <div>
      <ProductAdd
        process="edit"
        handleEditedData={handleSubmit}
        product={product}
        selected={selected}
        index={index}
        item={item}
      />
    </div>
  )
}

export default ProductEdit
