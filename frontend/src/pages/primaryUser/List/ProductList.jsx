import { useEffect, useState } from "react"
import ProductListform from "../../../components/primaryUser/ProductListform"
import UseFetch from "../../../hooks/useFetch"
import toast from "react-hot-toast"
function ProductList() {
  const [products, setProducts] = useState([])
  const [loggeduserBranch, setloggeduserBranch] = useState(null)
  const {
    data: productData,
  
    error
  } = UseFetch(
    loggeduserBranch &&
      `/product/getallProducts?branchselected=${encodeURIComponent(
        JSON.stringify(loggeduserBranch)
      )}`
  )
  const { data: companyBranches } = UseFetch("/branch/getBranch")

  useEffect(() => {
    if (companyBranches&&companyBranches.length) {
      const userData = localStorage.getItem("user")
      const user = JSON.parse(userData)
      if (user.role === "Admin") {
        const branches = companyBranches.map((branch) => branch._id)
        setloggeduserBranch(branches)
      } else {
        const branches = user.selected.map((branch) => branch.branch_id)
        setloggeduserBranch(branches)
      }
    }
  }, [companyBranches])
  useEffect(() => {
    if (productData) {
      setProducts(productData)
      // if (user.role === "Admin") {
      //   setProducts(productData)
      // } else {
      //   const userBranchName = new Set(
      //     user.selected.map((branch) => branch.branchName)
      //   )

      //   const branchNamesArray = Array.from(userBranchName)

      //   // Filter calls to keep only those where branchName matches branchNamesArray
      //   const filteredProducts = productData.filter((product) =>
      //     product.selected.some((item) =>
      //       branchNamesArray.includes(item.branchName)
      //     )
      //   )
      //   // Set the data to the state when it is fetched
      //   setProducts(filteredProducts)
      // }
    }
  }, [productData])
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
