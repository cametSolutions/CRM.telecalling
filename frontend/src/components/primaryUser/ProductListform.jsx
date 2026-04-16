import { useState, useCallback, useEffect } from "react"
import { CiEdit } from "react-icons/ci"
import { PropagateLoader } from "react-spinners"
import { useNavigate } from "react-router-dom"
import { getLocalStorageItem,setLocalStorageItem } from "../../helper/localstorage"
import {
  FaUserPlus,
  FaSearch,
  FaRegFileExcel,
  FaFilePdf,
  FaPrint
} from "react-icons/fa"
import { Link } from "react-router-dom"
import _ from "lodash"

const ProductListform = ({ productlist, loading }) => {
  const user = getLocalStorageItem("user")
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredProducts, setFilteredProducts] = useState(productlist)

  const handleSearch = useCallback(
    _.debounce((query) => {
      const lowerCaseQuery = query.toLowerCase()
      setFilteredProducts(
        productlist.filter((product) =>
          product.productName.toLowerCase().includes(lowerCaseQuery)
        )
      )
    }, 300),
    [productlist]
  )

  useEffect(() => {
    handleSearch(searchQuery)
  }, [searchQuery, handleSearch])

  return (
    // <div className=" mx-auto  p-8 ">
    //   <div className="w-full  bg-white shadow-lg rounded p-6  h-fit ">
    //     <div className="flex justify-between items-center px-4 lg:px-6 xl:px-8 mb-2">
    //       <h3 className="text-2xl text-black font-bold">Product List</h3>
    //       {/* Search Bar for large screens */}
    //       <div className="mx-4 md:block">
    //         <div className="relative">
    //           <FaSearch className="absolute w-5 h-5 left-2 top-3 text-gray-500" />
    //         </div>
    //         <input
    //           type="text"
    //           value={searchQuery}
    //           onChange={(e) => setSearchQuery(e.target.value)}
    //           className=" w-full border border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none"
    //           placeholder="Search for..."
    //         />
    //       </div>
    //     </div>
    //     <hr className="border-t-2 border-gray-300 mb-2" />
    //     <div className="flex justify-between">
    //       <div className="flex flex-wrap space-x-4 mb-2">
    //         <Link
    //           to={
    //             user.role === "Admin"
    //               ? "/admin/masters/productRegistration"
    //               : "/staff/masters/productRegistration"
    //           }
    //           className="hover:bg-gray-100 text-black font-bold py-2 px-2 rounded inline-flex items-center"
    //         >
    //           <FaUserPlus className="mr-2" />
    //         </Link>
    //         <button className="hover:bg-gray-100 text-black font-bold py-2 px-2 rounded inline-flex items-center">
    //           <FaRegFileExcel className="mr-2" />
    //         </button>
    //         <button className="hover:bg-gray-100 text-black font-bold py-2 px-2 rounded inline-flex items-center">
    //           <FaFilePdf className="mr-2" />
    //         </button>
    //         <button className="hover:bg-gray-100 text-black font-bold py-2 px-2 rounded inline-flex items-center">
    //           <FaPrint className="mr-2" />
    //         </button>
    //       </div>
    //       <label className="mx-8"> {filteredProducts.length}</label>
    //     </div>

    //     <div className="overflow-x-auto overflow-y-auto text-center max-h-60 sm:max-h-80 md:max-h-96 lg:max-h-[420px]">
    //       <table className="min-w-full  border border-t-0">
    //         <thead className="sticky top-0 z-10 bg-green-300 ">
    //           <tr>
    //             <th className="py-3 px-4 border-b border-gray-300 ">
    //               Company Name
    //             </th>
    //             <th className="py-3 px-4 border-b border-gray-300 ">
    //               Branch Name
    //             </th>
    //             <th className="py-3 px-4 border-b border-gray-300 ">
    //               Product Name
    //             </th>
    //             <th className="py-3 px-4 border-b border-gray-300 ">Brand</th>
    //             <th className="py-3 px-4 border-b border-gray-300 ">
    //               Category
    //             </th>
    //             <th className="py-3 px-4 border-b border-gray-300 ">Hsn</th>
    //             {/* <th className="py-3 px-4 border-b border-gray-300 ">
    //               Status
    //             </th> */}
    //             <th className="py-3 px-4 border-b border-gray-300 ">Edit</th>
    //           </tr>
    //         </thead>

    //         <tbody className="bg-white divide-y divide-gray-200 ">
    //           {filteredProducts?.length > 0 ? (
    //             filteredProducts.map((product) =>
    //               product.selected.map((item, itemIndex) => (
    //                 <tr key={`${product._id}-${item.branch_id}`}>
    //                   <td className="px-6 py-3     whitespace-nowrap text-sm text-black">
    //                     {item.companyName}
    //                   </td>
    //                   <td className="px-6 py-3     whitespace-nowrap text-sm text-black">
    //                     {item.branchName}
    //                   </td>
    //                   <td className="px-6 py-3     whitespace-nowrap text-sm text-black">
    //                     {product.productName}
    //                   </td>
    //                   <td className="px-6 py-3     whitespace-nowrap text-sm text-black">
    //                     {/* You can replace these with actual brand, category, and HSN data */}
    //                     {item.brandName}
    //                   </td>
    //                   <td className="px-6 py-3     whitespace-nowrap text-sm text-black">
    //                     {item.categoryName}
    //                   </td>
    //                   <td className="px-6 py-3     whitespace-nowrap text-sm text-black">
    //                     {item.hsnName}
    //                   </td>
    //                   {/* <td
    //                     className={`px-6 py-3     whitespace-nowrap text-sm ${
    //                       item.status === "Active"
    //                         ? "text-blue-700"
    //                         : "text-red-700"
    //                     }`}
    //                   >
    //                     {item.status || "N/A"}
    //                   </td> */}
    //                   <td className="px-6 py-3 whitespace-nowrap text-xl text-black cursor-pointer">
    //                     {/* Add actions like Edit/Delete here */}

    //                     <CiEdit
    //                       className="mx-auto"
    //                       onClick={() =>
    //                         navigate("/admin/masters/productEdit", {
    //                           state: {
    //                             product: product,
    //                             selected: item,
    //                             item: product,
    //                             index: itemIndex
    //                           } // pass the correct data here
    //                         })
    //                       }
    //                     />
    //                   </td>
    //                 </tr>
    //               ))
    //             )
    //           ) : (
    //             <tr>
    //               <td
    //                 colSpan="10"
    //                 className="px-6 py-4 text-center text-sm text-gray-500"
    //               >
    //                 {loading && (
    //                   <div className="flex justify-center">
    //                     <PropagateLoader color="#3b82f6" size={10} />
    //                   </div>
    //                 )}
    //               </td>
    //             </tr>
    //           )}
    //         </tbody>
    //       </table>
    //     </div>
    //   </div>
    // </div>
    <div className="h-full w-full px-3 py-4">
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col rounded-lg bg-white p-4 shadow-lg sm:p-6">
        {/* Header row */}
        <div className="mb-2 flex flex-col items-start gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-bold text-black sm:text-2xl">
            Product List
          </h3>

          {/* Search */}
          <div className="w-full max-w-xs">
            <div className="relative">
              <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/40"
                placeholder="Search for..."
              />
            </div>
          </div>
        </div>

        <hr className="mb-2 border-t-2 border-gray-200" />

        {/* Actions row */}
        <div className="mb-2 flex items-center justify-between gap-2">
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
          </div>

          <span className="mr-1 text-sm text-gray-700">
            {filteredProducts.length}
          </span>
        </div>

        {/* Scrollable table area */}
        <div className="relative flex-1 overflow-hidden">
          <div className="max-h-full overflow-x-auto overflow-y-auto rounded-md border border-gray-200">
            <table className="min-w-full text-center text-sm">
              <thead className="sticky top-0 z-10 bg-green-300">
                <tr>
                  <th className="border-b border-gray-300 px-4 py-3">
                    Company Name
                  </th>
                  <th className="border-b border-gray-300 px-4 py-3">
                    Branch Name
                  </th>
                  <th className="border-b border-gray-300 px-4 py-3">
                    Product Name
                  </th>
                  <th className="border-b border-gray-300 px-4 py-3">Brand</th>
                  <th className="border-b border-gray-300 px-4 py-3">
                    Category
                  </th>
                  <th className="border-b border-gray-300 px-4 py-3">HSN</th>
                  <th className="border-b border-gray-300 px-4 py-3">Edit</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredProducts?.length > 0 ? (
                  filteredProducts.map((product) =>
                    product.selected.map((item, itemIndex) => (
                      <tr key={`${product._id}-${item.branch_id}`}>
                        <td className="whitespace-nowrap px-4 py-3 text-xs sm:text-sm text-black">
                          {item.companyName}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-xs sm:text-sm text-black">
                          {item.branchName}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-xs sm:text-sm text-black">
                          {product.productName}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-xs sm:text-sm text-black">
                          {item.brandName}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-xs sm:text-sm text-black">
                          {item.categoryName}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-xs sm:text-sm text-black">
                          {item.hsnName}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-xl text-black">
                          <CiEdit
                            className="mx-auto cursor-pointer"
                            onClick={() =>
                              navigate("/admin/masters/productEdit", {
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
    </div>
  )
}

export default ProductListform
