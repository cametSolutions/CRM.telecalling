import React, { useEffect, useState, useMemo } from "react"
import Select from "react-select"
import { useForm } from "react-hook-form"
import UseFetch from "../../hooks/useFetch"
import { toast } from "react-toastify"
import { FaTrash, FaEdit } from "react-icons/fa" // Import icons

const ProductAdd = ({
  process,
  productData,

  handleProductData
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm()

  const [selectedCompany, setSelectedCompany] = useState([])
  const [selectedBranch, setSelectedBranch] = useState([])
  const [editObject, setEditObject] = useState({
    brands: {},
    categories: {},
    hsn: {}
    // products: [],
  })
  const [showTable, setShowTable] = useState(false)
  const [tableData, setTableData] = useState([])
  // State to toggle the table
  const [editState, seteditState] = useState(true)

  const [data, setData] = useState({
    companies: [],
    brands: [],
    categories: [],
    hsn: []
    // products: [],
  })
  const [tableObject, setTableObject] = useState({
    company_id: "",
    companyName: "",
    branch_id: "",
    branchName: "",
    brand_id: "",
    brandName: "",
    category_id: "",
    categoryName: "",
    hsn_id: "",
    hsnName: ""
  })
  // const { data: productData, error: productError } = UseFetch(
  //   "/product/getallProducts"
  // )
  const { data: companyData, error: companyError } = UseFetch(
    "/company/getCompany"
  )

  const { data: hsnData, error: hsnError } = UseFetch(`/inventory/hsnlist`)
  const { data: brandData, error: brandError } = UseFetch(
    `/inventory/getproductsubDetails?tab=brand`
  )
  const { data: categoryData, error: categoryError } = UseFetch(
    `/inventory/getproductsubDetails?tab=category`
  )
  console.log("com", companyData)
  useEffect(() => {
    if (productData) {
      const selectedObject =
        productData.selected[productData.selected.length - 1]
      // console.log()
      console.log(selectedObject.brandName)
      // Assuming productData contains the data you need to pre-fill the form
      setValue("productName", productData.productName || "")
      setValue("productPrice", productData.productPrice || "")
      setValue("description", productData.description || "")

      setValue("brand", selectedObject.brand_name || "")
      setValue("category", selectedObject.category_name || "")
      setValue("hsn", selectedObject.hsn_name || "")
      setTableData(productData.selected)
      setTableObject(productData.selected[productData.selected.length - 1])
      setEditObject({
        brand: selectedObject.brand_name,
        categories: selectedObject.category_name,
        hsn: selectedObject.hsn_name
      })
    }
  }, [productData])
  console.log("productdataaaaaaaaaaa:", productData)

  useEffect(() => {
    // if (productData) setData((prev) => ({ ...prev, products: productData }))
    if (companyData) setData((prev) => ({ ...prev, companies: companyData }))
    if (hsnData) setData((prev) => ({ ...prev, hsn: hsnData }))
    if (brandData) setData((prev) => ({ ...prev, brands: brandData }))
    if (categoryData) setData((prev) => ({ ...prev, categories: categoryData }))
  }, [companyData, hsnData, brandData, categoryData])
  console.log("data.com", data.companies)
  useEffect(() => {
    if (
      // productError ||
      companyError ||
      hsnError ||
      brandError ||
      categoryError
    ) {
      const message =
        // productError?.response?.data?.message ||
        companyError?.response?.data?.message ||
        hsnError?.response?.data?.message ||
        brandError?.response?.data?.message ||
        categoryError?.response?.data?.message ||
        "Something went wrong!"
      toast.error(message)
    }
  }, [, companyError, hsnError, brandError, categoryError])

  const handleDelete = (id) => {
    const filtereddData = tableData.filter((product, index) => {
      return index !== id
    })

    setTableData(filtereddData)
  }

  const handleEdit = (id) => {
    seteditState(false)
    const itemToEdit = data.products.find((item) => item._id === id)
    if (itemToEdit) {
      setValue("productName", itemToEdit.productName)
      setValue("productPrice", itemToEdit.productPrice)
      setValue("description", itemToEdit.description)
      setValue("company", itemToEdit.company)
      setValue("branch", itemToEdit.branch)
      setValue("brand", itemToEdit.brand)
      setValue("category", itemToEdit.category)
      setValue("hsn", itemToEdit.hsn)
      // Store the ID of the product being edited
    }
  }
  const handleBranchChange = (selectedOption) => {
    const branchId = selectedOption.value
    const branchName = selectedOption.label

    setTableObject((prev) => ({
      ...prev,
      branch_id: branchId,
      branchName: branchName
    }))
    // setSelectedBranch(true)
    setValue("branch", branchId) // Update the value in react-hook-form
  }

  const handleTableData = (e) => {
    e.preventDefault()

    if (tableObject.company_id.trim() === "") {
      toast.error("please select a company")
      return
    } else if (tableObject.branch_id.trim() === "") {
      toast.error("please select a branch")
      return
    } else if (tableObject.brand_id.trim() === "") {
      toast.error("please select a brand")
      return
    } else if (tableObject.category_id.trim() === "") {
      toast.error("please select a category")
      return
    } else if (tableObject.hsn_id.trim() === "") {
      toast.error("please select a hsn")
      return
    }
    const isIncluded = tableData.some(
      (item) => JSON.stringify(item) === JSON.stringify(tableObject)
    )
    if (isIncluded) {
      toast.error("Compnay and brach already added")
      return
    }
    setTableData((prev) => [
      ...prev, // Spread the existing items in the state
      tableObject // Add the new item to the array
    ])

    // setTableObject({
    //   company_id: "",
    //   company_name: "",
    //   branch_id: "",
    //   branch_name: "",
    //   brand_id: "",
    //   brand_name: "",
    //   category_id: "",
    //   category_name: "",
    //   hsn_id: "",
    //   hsn_name: "",
    // })
    // setData({
    //   companies: [],
    //   brands: [],
    //   categories: [],
    //   hsn: [],
    //   // products: [],
    // })
  }
  console.log(tableObject)

  const handleCompanyChange = (selectedOption) => {
    const companyId = selectedOption.value
    const companyName = selectedOption.label

    setTableObject((prev) => ({
      ...prev,
      company_id: companyId,
      companyName: companyName
    }))

    setSelectedCompany(companyId)

    setValue("company", companyId) // Update the value in react-hook-form
    setValue("branch", "")
  }
  const handleBrandChange = (selectedOption) => {
    const brandId = selectedOption.value
    const brandName = selectedOption.label

    setTableObject((prev) => ({
      ...prev,
      brand_id: brandId,
      brandName: brandName
    }))

    setValue("brand", brandId) // Update the value in react-hook-form
  }
  const handleCategoryChange = (selectedOption) => {
    const categoryId = selectedOption.value
    const categoryName = selectedOption.label

    setTableObject((prev) => ({
      ...prev,
      category_id: categoryId,
      categoryName: categoryName
    }))

    setValue("category", categoryId) // Update the value in react-hook-form
  }
  const handleHsnChange = (selectedOption) => {
    const hsnId = selectedOption.value
    const hsnName = selectedOption.label

    setTableObject((prev) => ({
      ...prev,
      hsn_id: hsnId,
      hsnName: hsnName
    }))

    setValue("hsn", hsnId) // Update the value in react-hook-form
  }

  const companyOptions = useMemo(
    () =>
      data.companies.map((company) => ({
        value: company._id,
        label: company.companyName
      })),
    [data.companies]
  )

  const filteredBranches = useMemo(
    () =>
      data.companies.find((company) => company._id === selectedCompany)
        ?.branches || [],
    [data.companies, selectedCompany]
  )

  const branchOptions = useMemo(
    () =>
      filteredBranches.map((branch) => ({
        value: branch._id,
        label: branch.branchName
      })),
    [filteredBranches]
  )
  //options for brands
  const brandOptions = useMemo(
    () =>
      data.brands.map((brand) => ({
        value: brand._id,
        label: brand.brand
      })) || [],
    [data.brands]
  )
  const categoryOptions = useMemo(
    () =>
      data.categories.map((category) => ({
        value: category._id,
        label: category.category
      })) || [],
    [data.categories]
  )
  const hsnOptions = useMemo(
    () =>
      data.hsn.map((hsndata) => ({
        value: hsndata._id,
        label: hsndata.hsnSac
      })) || [],
    [data.hsn]
  )

  const toggleTable = () => {
    setShowTable(!showTable)
  }

  const onSubmit = async (data, event) => {
    console.log("daaaaaaaaa", data)
    event.preventDefault()

    try {
      if (process === "Registration") {
        await handleProductData(data, tableData)
      } else if (process === "Edit") {
        await handleEditedData(data)
      }
      // Refetch the product data
    } catch (error) {
      console.log("error on onsubmit")
      toast.error("Failed to add product!")
    }
  }
  return (
    <div className="container justify-center items-center min-h-screen p-8 bg-gray-100">
      <div className="w-auto bg-white shadow-lg rounded p-8 mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Product Master</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 m-5">
            {/* Other Input Fields */}
            <div>
              <label
                htmlFor="productName"
                className="block text-sm font-medium text-gray-700"
              >
                Product Name
              </label>
              <input
                id="productName"
                type="text"
                {...register("productName", {
                  required: "Product name is required"
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none focus:border-gray-500"
                placeholder="Product Name"
              />
              {errors.productName && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.productName.message}
                </span>
              )}
            </div>

            {/* Product Price */}
            <div>
              <label
                htmlFor="productPrice"
                className="block text-sm font-medium text-gray-700"
              >
                Product Price
              </label>
              <input
                id="productPrice"
                type="number"
                {...register("productPrice", {
                  required: "Product price is required"
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none focus:border-gray-500"
                placeholder="Product Price"
              />
              {errors.productPrice && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.productPrice.message}
                </span>
              )}
            </div>

            {/* Brand Select Dropdown */}
            <div>
              <label
                htmlFor="brand"
                className="block text-sm font-medium text-gray-700"
              >
                Select Brand
              </label>

              <Select
                id="brand"
                options={brandOptions}
                onChange={handleBrandChange}
                className=""
              />
            </div>

            {/* Category Select Dropdown */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Select Category
              </label>
              <Select
                id="category"
                options={categoryOptions}
                onChange={handleCategoryChange}
                className=""
              />
            </div>

            {/* HSN Select Dropdown */}
            <div>
              <label
                htmlFor="hsn"
                className="block text-sm font-medium text-gray-700"
              >
                Select HSN
              </label>
              <Select
                id="hsn"
                options={hsnOptions}
                onChange={handleHsnChange}
                className=""
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                {...register("description", {
                  required: "Description is required"
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none focus:border-gray-500"
                placeholder="Product Description"
              ></textarea>
              {errors.description && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.description.message}
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium text-gray-700"
              >
                Select Company
              </label>
              <Select
                id="company"
                options={companyOptions}
                onChange={handleCompanyChange}
                className=""
              />
            </div>

            <div className="">
              <label
                htmlFor="branch"
                className="block text-sm font-medium text-gray-700 "
              >
                Select Branches
              </label>

              <Select
                id="branch"
                options={branchOptions}
                onChange={handleBranchChange}
                className=""
              />
            </div>
            {selectedBranch && (
              <div className="mt-6">
                <button
                  type="button"
                  // onClick={handleTableData}
                  onClick={(event) => handleTableData(event)}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900">Product List</h3>
            <table className="min-w-full divide-y divide-gray-200 mt-4">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Branch Name
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tableData?.map((product, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product?.companyName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product?.branchName}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FaTrash onClick={() => handleDelete(index)} />
                      </button>

                      {/* Add delete button */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              {process === "Registration" ? "Add Product" : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductAdd
