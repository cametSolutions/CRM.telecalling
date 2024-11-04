import React, { useEffect, useState } from "react"
import ProductListform from "../../../components/primaryUser/ProductListform"
import UseFetch from "../../../hooks/useFetch"
import toast from "react-hot-toast"
function ProductList() {
  const [products, setProducts] = useState([])
  const {
    data: productData,
    loading,
    error
  } = UseFetch("/product/getallProducts")
  const userData = localStorage.getItem("user")
  const user = JSON.parse(userData)
  useEffect(() => {
    if (productData) {
      if (user.role === "Admin") {
        setProducts(productData)
      } else {
        const userBranchName = new Set(
          user.selected.map((branch) => branch.branchName)
        )

        const branchNamesArray = Array.from(userBranchName)

        // Filter calls to keep only those where branchName matches branchNamesArray
        const filteredProducts = productData.filter((product) =>
          product.selected.some((item) =>
            branchNamesArray.includes(item.branchName)
          )
        )
        // Set the data to the state when it is fetched
        setProducts(filteredProducts)
      }
    }
  }, [productData])
  console.log("products in backend :", products)
  useEffect(() => {
    if (error) {
      if (error.response) {
        toast.error(error.response.data.message)
      } else {
        toast.error("Something went wrong!")
      }
    }
  }, [error])

  return (
    <div>
      <ProductListform productlist={products} />
    </div>
  )
}

export default ProductList
