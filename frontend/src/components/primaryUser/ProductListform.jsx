import React, { useState, useCallback, useEffect } from "react"
import { CiEdit } from "react-icons/ci"
import { useNavigate } from "react-router-dom"
import {
  FaUserPlus,
  FaSearch,
  FaRegFileExcel,
  FaFilePdf,
  FaPrint
} from "react-icons/fa"
import { Link } from "react-router-dom"
import _ from "lodash"

const ProductListform = ({ productlist }) => {
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
    <div className="container mx-auto  p-8 ">
      <div className="w-full  bg-white shadow-lg rounded p-6  h-fit ">
        <div className="flex justify-between items-center px-4 lg:px-6 xl:px-8 mb-2">
          <h3 className="text-2xl text-black font-bold">Product List</h3>
          {/* Search Bar for large screens */}
          <div className="mx-4 md:block">
            <div className="relative">
              <FaSearch className="absolute w-5 h-5 left-2 top-3 text-gray-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className=" w-full border border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none"
              placeholder="Search for..."
            />
          </div>
        </div>
        <hr className="border-t-2 border-gray-300 mb-2" />
        <div className="flex justify-between">
          <div className="flex flex-wrap space-x-4 mb-2">
            <Link
              to="/admin/masters/productRegistration"
              className="hover:bg-gray-100 text-black font-bold py-2 px-2 rounded inline-flex items-center"
            >
              <FaUserPlus className="mr-2" />
            </Link>
            <button className="hover:bg-gray-100 text-black font-bold py-2 px-2 rounded inline-flex items-center">
              <FaRegFileExcel className="mr-2" />
            </button>
            <button className="hover:bg-gray-100 text-black font-bold py-2 px-2 rounded inline-flex items-center">
              <FaFilePdf className="mr-2" />
            </button>
            <button className="hover:bg-gray-100 text-black font-bold py-2 px-2 rounded inline-flex items-center">
              <FaPrint className="mr-2" />
            </button>
          </div>
          <label className="mx-8"> {filteredProducts.length}</label>
        </div>

        <div className="overflow-x-auto overflow-y-auto text-center max-h-60 sm:max-h-80 md:max-h-96 lg:max-h-[420px]">
          <table className="min-w-full  border border-t-0">
            <thead className="sticky top-0 z-10 bg-green-300 ">
              <tr>
                <th className="py-3 px-4 border-b border-gray-300 ">
                  Company Name
                </th>
                <th className="py-3 px-4 border-b border-gray-300 ">
                  Branch Name
                </th>
                <th className="py-3 px-4 border-b border-gray-300 ">
                  Product Name
                </th>
                <th className="py-3 px-4 border-b border-gray-300 ">Brand</th>
                <th className="py-3 px-4 border-b border-gray-300 ">
                  Category
                </th>
                <th className="py-3 px-4 border-b border-gray-300 ">Hsn</th>
                {/* <th className="py-3 px-4 border-b border-gray-300 ">
                  Status
                </th> */}
                <th className="py-3 px-4 border-b border-gray-300 ">Edit</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200 ">
              {filteredProducts?.length > 0 ? (
                filteredProducts.map((product) =>
                  product.selected.map((item) => (
                    <tr key={`${product._id}-${item.branch_id}`}>
                      <td className="px-6 py-3     whitespace-nowrap text-sm text-black">
                        {item.companyName}
                      </td>
                      <td className="px-6 py-3     whitespace-nowrap text-sm text-black">
                        {item.branchName}
                      </td>
                      <td className="px-6 py-3     whitespace-nowrap text-sm text-black">
                        {product.productName}
                      </td>
                      <td className="px-6 py-3     whitespace-nowrap text-sm text-black">
                        {/* You can replace these with actual brand, category, and HSN data */}
                        {item.brandName}
                      </td>
                      <td className="px-6 py-3     whitespace-nowrap text-sm text-black">
                        {item.categoryName}
                      </td>
                      <td className="px-6 py-3     whitespace-nowrap text-sm text-black">
                        {item.hsnName}
                      </td>
                      {/* <td
                        className={`px-6 py-3     whitespace-nowrap text-sm ${
                          item.status === "Active"
                            ? "text-blue-700"
                            : "text-red-700"
                        }`}
                      >
                        {item.status || "N/A"}
                      </td> */}
                      <td className="px-6 py-3 whitespace-nowrap text-xl text-black ">
                        {/* Add actions like Edit/Delete here */}

                        <CiEdit
                          className="mx-auto"
                          onClick={() =>
                            navigate("/admin/masters/productEdit", {
                              state: {
                                product: product,
                                selected: item
                              } // pass the correct data here
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
                    colSpan="10"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No branches found
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
