// import { useState, useCallback, useEffect } from "react"
// import { CiEdit } from "react-icons/ci"
// import { PropagateLoader } from "react-spinners"
// import { useNavigate } from "react-router-dom"
// import { useSelector } from "react-redux"
// import {
//   getLocalStorageItem,
//   setLocalStorageItem
// } from "../../helper/localstorage"
// import {
//   FaUserPlus,
//   FaSearch,
//   FaRegFileExcel,
//   FaFilePdf,
//   FaPrint
// } from "react-icons/fa"
// import { Link } from "react-router-dom"
// import _ from "lodash"
// import { BranchSelect } from "./BranchSelect"
// const ProductListform = ({ productlist, loading }) => {
//   const user = getLocalStorageItem("user")
// const branchOptions=useSelector((branch)=>branch.companyBranch.userbranchOptions)
// const reduxselectedBranch=useSelector((branch)=>branch.companyBranch.selectedBranch)
// console.log(reduxselectedBranch)
// console.log(branchOptions)
//   console.log(user)
//   const navigate = useNavigate()
//   const [searchQuery, setSearchQuery] = useState("")
//   const [filteredProducts, setFilteredProducts] = useState([])

// const handleSearch = useCallback(
//   _.debounce((query) => {
//     const lowerCaseQuery = query.toLowerCase()

//     setFilteredProducts(
//       productlist.filter((product) => {
//         const matchesSearch = product.productName
//           ?.toLowerCase()
//           .includes(lowerCaseQuery)

//         const matchesBranch = product.selected?.some(
//           (item) => item.branch_id === reduxselectedBranch
//         )

//         return matchesSearch && matchesBranch
//       })
//     )
//   }, 300),
//   [productlist, reduxselectedBranch]
// )
// console.log(productlist)
// console.log(filteredProducts)
//   useEffect(() => {
// console.log(searchQuery)
//     handleSearch(searchQuery)
//   }, [searchQuery, handleSearch])
//   console.log(user)
//   return (
//     <div className="flex h-full min-h-0 w-full flex-col rounded bg-white p-6 shadow-lg">
//       <div className="mb-2 flex shrink-0 items-center justify-between px-4 lg:px-6 xl:px-8">
//         <h3 className="text-2xl font-bold text-black">Product List</h3>

//         <div className="mx-4 md:block">
//           <div className="relative">
//             <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full rounded-full border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/40"
//               placeholder="Search for..."
//             />
//           </div>
//         </div>
//       </div>

//       <hr className="mb-2 shrink-0 border-t-2 border-gray-200" />

//       <div className="mb-2 flex shrink-0 items-center justify-between gap-2">
//         <div className="flex flex-wrap items-center gap-2 ">
//           <Link
//             to={
//               user.role === "Admin"
//                 ? "/admin/masters/productRegistration"
//                 : "/staff/masters/productRegistration"
//             }
//             className="inline-flex items-center rounded-md px-2 py-2 text-sm font-semibold text-black hover:bg-gray-100"
//           >
//             <FaUserPlus className="mr-2 h-4 w-4" />
//             <span className="hidden sm:inline">Add</span>
//           </Link>

//           <button className="inline-flex items-center rounded-md px-2 py-2 text-sm font-semibold text-black hover:bg-gray-100">
//             <FaRegFileExcel className="mr-2 h-4 w-4" />
//             <span className="hidden sm:inline">Excel</span>
//           </button>

//           <button className="inline-flex items-center rounded-md px-2 py-2 text-sm font-semibold text-black hover:bg-gray-100">
//             <FaFilePdf className="mr-2 h-4 w-4" />
//             <span className="hidden sm:inline">PDF</span>
//           </button>

//           <button className="inline-flex items-center rounded-md px-2 py-2 text-sm font-semibold text-black hover:bg-gray-100">
//             <FaPrint className="mr-2 h-4 w-4" />
//             <span className="hidden sm:inline">Print</span>
//           </button>
//           <BranchSelect value={reduxselectedBranch} options={branchOptions}  className="w-[220px] shrink-0"/>
//         </div>

//         <span className="mr-1 text-sm text-gray-700">
//           {filteredProducts.length}
//         </span>
//       </div>

//       <div className="flex-1 min-h-0 overflow-hidden">
//         <div className="h-full overflow-auto rounded-md border border-gray-200">
//           <table className="min-w-full text-center text-sm">
//             <thead className="sticky top-0 z-10 bg-green-300">
//               <tr>
//                 <th className="border-b border-gray-300 px-4 py-3">
//                   Company Name
//                 </th>
//                 <th className="border-b border-gray-300 px-4 py-3">
//                   Branch Name
//                 </th>
//                 <th className="border-b border-gray-300 px-4 py-3">
//                   Product Name
//                 </th>
//                 <th className="border-b border-gray-300 px-4 py-3">Brand</th>
//                 <th className="border-b border-gray-300 px-4 py-3">Category</th>
//                 <th className="border-b border-gray-300 px-4 py-3">HSN</th>
//                 <th className="border-b border-gray-300 px-4 py-3">Edit</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-gray-200 bg-white">
//               {filteredProducts?.length > 0 ? (
//                 filteredProducts.map((product) =>
//                   product.selected.map((item, itemIndex) => (
//                     <tr key={`${product._id}-${item.branch_id}`}>
//                       <td className="whitespace-nowrap px-4 py-3 text-xs text-black sm:text-sm">
//                         {item.companyName}
//                       </td>
//                       <td className="whitespace-nowrap px-4 py-3 text-xs text-black sm:text-sm">
//                         {item.branchName}
//                       </td>
//                       <td className="whitespace-nowrap px-4 py-3 text-xs text-black sm:text-sm">
//                         {product.productName}
//                       </td>
//                       <td className="whitespace-nowrap px-4 py-3 text-xs text-black sm:text-sm">
//                         {item.brandName}
//                       </td>
//                       <td className="whitespace-nowrap px-4 py-3 text-xs text-black sm:text-sm">
//                         {item.categoryName}
//                       </td>
//                       <td className="whitespace-nowrap px-4 py-3 text-xs text-black sm:text-sm">
//                         {item.hsnName}
//                       </td>
//                       <td className="whitespace-nowrap px-4 py-3 text-xl text-black">
//                         <CiEdit
//                           className="mx-auto cursor-pointer"
//                           onClick={() =>
//                             user?.role === "Admin"
//                               ? navigate("/admin/masters/productEdit", {
//                                   state: {
//                                     product,
//                                     selected: item,
//                                     item: product,
//                                     index: itemIndex
//                                   }
//                                 })
//                               : navigate("/staff/masters/productEdit", {
//                                   state: {
//                                     product,
//                                     selected: item,
//                                     item: product,
//                                     index: itemIndex
//                                   }
//                                 })
//                           }
//                         />
//                       </td>
//                     </tr>
//                   ))
//                 )
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={7}
//                     className="px-6 py-4 text-center text-sm text-gray-500"
//                   >
//                     {loading ? (
//                       <div className="flex justify-center">
//                         <PropagateLoader color="#3b82f6" size={10} />
//                       </div>
//                     ) : (
//                       "No products found."
//                     )}
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProductListform


import { useState, useMemo, useEffect } from "react"
import { CiEdit } from "react-icons/ci"
import { PropagateLoader } from "react-spinners"
import { useNavigate, Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import {
  getLocalStorageItem
} from "../../helper/localstorage"
import { CustomSelect } from "../common/CustomSelect.jsx"
import {
  FaUserPlus,
  FaSearch,
  FaRegFileExcel,
  FaFilePdf,
  FaPrint
} from "react-icons/fa"
import debounce from "lodash/debounce"
import { BranchSelect } from "./BranchSelect"
// import { setsliceselectedBranch } from "../../redux/companyBranchSlice.js" 
import { setsliceselectedBranch } from "../../../slices/companyBranchSlice.js"
const ProductListform = ({ productlist = [], loading }) => {
  const user = getLocalStorageItem("user")
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const branchOptions = useSelector(
    (state) => state.companyBranch.userbranchOptions
  )
  const reduxselectedBranch = useSelector(
    (state) => state.companyBranch.selectedBranch
  )

  const [searchInput, setSearchInput] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
const [productType,setproductType]=useState("All")
  const debouncedUpdateSearch = useMemo(
    () =>
      debounce((value) => {
        setDebouncedSearch(value.toLowerCase())
      }, 300),
    []
  )

  useEffect(() => {
    return () => {
      debouncedUpdateSearch.cancel()
    }
  }, [debouncedUpdateSearch])

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchInput(value)
    debouncedUpdateSearch(value)
  }

  const handleBranchChange = (branchId) => {
    dispatch(setsliceselectedBranch(branchId))
  }
const filteredProducts = useMemo(() => {
  return productlist
    .map((product) => {
      const filteredSelected = (product.selected || []).filter((item) => {
        const matchesBranch = reduxselectedBranch
          ? String(item.branch_id) === String(reduxselectedBranch)
          : true

        return matchesBranch
      })

      const matchesSearch = product.productName
        ?.toLowerCase()
        .includes(debouncedSearch)

      const rawType = String(product?.productorservicetype || "")
        .toLowerCase()
        .trim()

      const normalizedType = rawType || "unspecified"

      const matchesProductType =
        productType === "All"
          ? true
          : productType === "Product"
            ? normalizedType === "primaryproduct"
            : productType === "Additional Service"
              ? normalizedType === "additionalservice"
              : productType === "Unspecified"
                ? normalizedType === "unspecified"
                : true

      if (!matchesSearch || !matchesProductType || filteredSelected.length === 0) {
        return null
      }

      return {
        ...product,
        selected: filteredSelected
      }
    })
    .filter(Boolean)
    .sort((a, b) => {
      const getStatusOrder = (product) => {
        const status = product?.status?.toLowerCase?.().trim()

        if (!status) return 0
        if (status === "active") return 0
        if (status === "inactive") return 1

        return 0
      }

      const statusCompare = getStatusOrder(a) - getStatusOrder(b)

      if (statusCompare !== 0) return statusCompare

      return String(a?.productName || "").localeCompare(
        String(b?.productName || "")
      )
    })
}, [productlist, debouncedSearch, reduxselectedBranch, productType])
// const filteredProducts = useMemo(() => {
//   return productlist
//     .map((product) => {
//       const filteredSelected = (product.selected || []).filter((item) => {
//         const matchesBranch = reduxselectedBranch
//           ? String(item.branch_id) === String(reduxselectedBranch)
//           : true

//         return matchesBranch
//       })

//       const matchesSearch = product.productName
//         ?.toLowerCase()
//         .includes(debouncedSearch)

//       if (!matchesSearch || filteredSelected.length === 0) {
//         return null
//       }

//       return {
//         ...product,
//         selected: filteredSelected
//       }
//     })
//     .filter(Boolean)
//     .sort((a, b) => {
//       const getStatusOrder = (product) => {
//         const status = product?.status?.toLowerCase?.().trim()

//         if (!status) return 0
//         if (status === "active") return 0
//         if (status === "inactive") return 1

//         return 0
//       }

//       const statusCompare = getStatusOrder(a) - getStatusOrder(b)

//       if (statusCompare !== 0) return statusCompare

//       return String(a?.productName || "").localeCompare(
//         String(b?.productName || "")
//       )
//     })
// }, [productlist, debouncedSearch, reduxselectedBranch])
  // const filteredProducts = useMemo(() => {
  //   return productlist
  //     .map((product) => {
  //       const filteredSelected = (product.selected || []).filter((item) => {
  //         const matchesBranch = reduxselectedBranch
  //           ? String(item.branch_id) === String(reduxselectedBranch)
  //           : true

  //         return matchesBranch
  //       })

  //       const matchesSearch = product.productName
  //         ?.toLowerCase()
  //         .includes(debouncedSearch)

  //       if (!matchesSearch || filteredSelected.length === 0) {
  //         return null
  //       }

  //       return {
  //         ...product,
  //         selected: filteredSelected
  //       }
  //     })
  //     .filter(Boolean)
  // }, [productlist, debouncedSearch, reduxselectedBranch])
console.log(filteredProducts)

  const totalRows = filteredProducts.reduce(
    (count, product) => count + product.selected.length,
    0
  )

  return (
    <div className="flex h-full min-h-0 w-full flex-col rounded bg-white p-6 shadow-lg">
      <div className="mb-2 flex shrink-0 items-center justify-between px-4 lg:px-6 xl:px-8">
        <h3 className="text-2xl font-bold text-black">Product List</h3>

        <div className="mx-4 md:block">
          <div className="relative">
            <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchChange}
              className="w-full rounded-full border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/40"
              placeholder="Search for..."
            />
          </div>
        </div>
      </div>

      <hr className="mb-2 shrink-0 border-t-2 border-gray-200" />

      <div className="mb-2 flex shrink-0 items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={
              user.role === "Admin"
                ? "/admin/masters/productRegistration"
                : "/staff/masters/productRegistration"
            }
            className="inline-flex items-center rounded-md px-2 py-2 text-sm font-semibold text-black hover:bg-gray-100"
          >
            <FaUserPlus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Add</span>
          </Link>

          <button className="inline-flex items-center rounded-md px-2 py-2 text-sm font-semibold text-black hover:bg-gray-100">
            <FaRegFileExcel className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Excel</span>
          </button>

          <button className="inline-flex items-center rounded-md px-2 py-2 text-sm font-semibold text-black hover:bg-gray-100">
            <FaFilePdf className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">PDF</span>
          </button>

          <button className="inline-flex items-center rounded-md px-2 py-2 text-sm font-semibold text-black hover:bg-gray-100">
            <FaPrint className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Print</span>
          </button>

 <BranchSelect
            value={reduxselectedBranch}
            onChange={handleBranchChange}
            options={branchOptions}
            className="w-[220px] shrink-0"
labletrue
          />

<CustomSelect
  value={productType}
  onChange={(value) => setproductType(value)}
  options={[
    { label: "All" },
    { label: "Product" },
    { label: "Additional Service" },
    { label: "Unspecified" }
  ]}
  className="w-[220px] shrink-0"
  label="Product Type"
  labletrue
/>

         
        </div>

        <span className="mr-1 text-sm text-gray-700">{totalRows}</span>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <div className="h-full overflow-auto rounded-md border border-gray-200">
          <table className="min-w-full text-center text-sm">
            <thead className="sticky top-0 z-10 bg-green-300">
              <tr>
                <th className="border-b border-gray-300 px-4 py-3">
                  Company Name
                </th>
               
                <th className="border-b border-gray-300 px-4 py-3">
                  Product Name
                </th>
                <th className="border-b border-gray-300 px-4 py-3">Brand</th>
                <th className="border-b border-gray-300 px-4 py-3">Category</th>
                <th className="border-b border-gray-300 px-4 py-3">HSN</th>
 <th className="border-b border-gray-300 px-4 py-3">
                  Status
                </th>
                <th className="border-b border-gray-300 px-4 py-3">Edit</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) =>
                  product.selected.map((item, itemIndex) => (
                    <tr key={`${product._id}-${item.branch_id}-${itemIndex}`}>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-black sm:text-sm">
                        {item.companyName}
                      </td>
                     
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-black sm:text-sm">
                        {product.productName}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-black sm:text-sm">
                        {item.brandName}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-black sm:text-sm">
                        {item.categoryName}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-black sm:text-sm">
                        {item.hsnName}
                      </td>
 <td className="whitespace-nowrap px-4 py-3 text-xs text-black sm:text-sm">
                        {product?.status||"N/A"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xl text-black">
                        <CiEdit
                          className="mx-auto cursor-pointer"
                          onClick={() =>
                            user?.role === "Admin"
                              ? navigate("/admin/masters/productEdit", {
                                  state: {
                                    product,
                                    selected: item,
                                    item: product,
                                    index: itemIndex
                                  }
                                })
                              : navigate("/staff/masters/productEdit", {
                                  state: {
                                    product,
                                    selected: item,
                                    item: product,
                                    index: itemIndex
                                  }
                                })
                          }
                        />
                      </td>
                    </tr>
                  ))
                )
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    {loading ? (
                      <div className="flex justify-center">
                        <PropagateLoader color="#3b82f6" size={10} />
                      </div>
                    ) : (
                      "No products found."
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ProductListform
