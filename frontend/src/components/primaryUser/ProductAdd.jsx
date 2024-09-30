import React, { useEffect, useState, useMemo } from "react"
import Select from "react-select"
import { useForm } from "react-hook-form"
import UseFetch from "../../hooks/useFetch"
import { toast } from "react-toastify"
import { FaTrash, FaEdit } from "react-icons/fa" // Import icons

const ProductAdd = ({
  process,
  product,
  selected,
  handleProductData,
  handleEditedData
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm()

  const [selectedCompany, setSelectedCompany] = useState([])
  const [dd, setd] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState(false)
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
    console.log("sel", selectedCompany.length)
    if (selected) {
      console.log("pro", product)
      console.log("selected", selected)

      setTableObject({
        company_id: selected.company_id || "",
        companyName: selected.companyName || "",
        branch_id: selected.branch_id || "",
        branchName: selected.branchName || "",
        brand_id: selected.branch_id || "",
        brandName: selected.brandName || "",
        category_id: selected.category_id || "",
        categoryName: selected.categoryName || "",
        hsn_id: selected.categoryName || "",
        hsnName: selected.hsnName || ""
      })

      Object.keys(selected).forEach((key) => {
        console.log("sel", selected)
        if (key === "brandName") {
          console.log(key)

          setValue(key, selected.brand_id)
        } else if (key === "categoryName") {
          setValue(key, selected.category_id)
        } else if (key === "hsnName") {
          setValue(key, selected.hsn_id)
        } else if (key === "companyName") {
          setSelectedCompany(selected.company_id)
          console.log("id", selected.company_id)
          setValue(key, selected.company_id)
        } else if (key === "branchName") {
          console.log("selceid", selected.branch_id)
          setValue(key, selected.branch_id)
        }
        // Log the key if necessary
      })
    }
    if (product) {
      Object.keys(product).forEach((key) => {
        // Check if the key is not in the ignored list
        console.log(key) // Log the key if necessary
        setValue(key, product[key])
      })
    }
  }, [data])

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
  }, [, companyError, hsnError, brandError, categoryError, tableObject])

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
  const handleBranchChange = (e) => {
    const branchId = e.target.value
    console.log("fotbraa", filteredBranches)
    const selectedBranch = filteredBranches.find(
      (branch) => branch._id === branchId
    )
    const branchName = selectedBranch.branchName

    setTableObject((prev) => ({
      ...prev,
      branch_id: branchId,
      branchName: branchName
    }))
    setSelectedBranch(true)
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
    console.log("tableo", tableObject)
    setTableData((prev) => [
      ...prev, // Spread the existing items in the state
      tableObject // Add the new item to the array
    ])
  }
  console.log(tableObject)

  const handleCompanyChange = (e) => {
    const companyId = e.target.value
    console.log("id", companyId)

    const selectedCompany = data.companies.find(
      (branch) => branch._id === companyId
    )
    console.log("selectedcom", selectedCompany.companyName)
    setTableObject((prev) => ({
      ...prev,
      company_id: companyId,
      companyName: selectedCompany.companyName
    }))

    setSelectedCompany(companyId)

    // setValue("companyName", selectedCompany.companyName) // Update the value in react-hook-form
  }
  console.log("id", selectedCompany)
  const handleBrandChange = (e) => {
    const brandId = e.target.value
    const selectedBrand = data.brands.find((brand) => brand._id === brandId)
    console.log("selctedbbb", selectedBrand)
    console.log("brandid", brandId)
    console.log("selecrbrand", selectedBrand.brand)
    console.log("table", tableObject)
    setTableObject((prev) => ({
      ...prev,
      brand_id: brandId,
      brandName: selectedBrand.brand
    }))

    // setValue("brandName", brandId) // Update the value in react-hook-form
  }
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value
    const selectedCategory = data.categories.find(
      (category) => category._id === categoryId
    )
    console.log("selectedcaa", selectedCategory.category)
    setTableObject((prev) => ({
      ...prev,
      category_id: categoryId,
      categoryName: selectedCategory.category
    }))

    setValue("category", categoryId) // Update the value in react-hook-form
  }
  const handleHsnChange = (e) => {
    const hsnId = e.target.value
    const selectedHsn = data.hsn.find((hsn) => hsn._id === hsnId)
    console.log("selectedhsn", selectedHsn.hsnSac)
    setTableObject((prev) => ({
      ...prev,
      hsn_id: hsnId,
      hsnName: selectedHsn.hsnSac
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
  console.log("filteredbranch", filteredBranches)

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
  console.log("category", categoryOptions)
  const hsnOptions = useMemo(
    () =>
      data.hsn.map((hsndata) => ({
        _id: hsndata._id,
        label: hsndata.hsnSac
      })) || [],
    [data.hsn]
  )
  console.log("hsnoptions", hsnOptions)

  const toggleTable = () => {
    setShowTable(!showTable)
  }

  const onSubmit = async (data, event) => {
    console.log("daaaaaaaaa", data)
    event.preventDefault()

    try {
      if (process === "Registration") {
        console.log("tabledata", tableData)
        await handleProductData(data, tableData)
      } else if (process === "edit") {
        await handleEditedData(data, tableObject)
      }
      // Refetch the product data
    } catch (error) {
      console.log("error on onsubmit")
      toast.error("Failed to add product!")
    }
  }
  console.log("category", tableObject)
  console.log("dd", dd)
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
                htmlFor="brandName"
                className="block text-sm font-medium text-gray-700"
              >
                Select Brand
              </label>
              <select
                id="brandName"
                {...register("brandName")}
                onChange={handleBrandChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
              >
                <option value="">-- Select a Brand --</option>

                {data.brands?.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Select Dropdown */}
            <div>
              <label
                htmlFor="categoryName"
                className="block text-sm font-medium text-gray-700"
              >
                Select Category
              </label>

              <select
                id="categoryName"
                {...register("categoryName")}
                onChange={handleCategoryChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
              >
                <option value="">-- Select a company --</option>

                {data.categories?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.category}
                  </option>
                ))}
              </select>
            </div>

            {/* HSN Select Dropdown */}
            <div>
              <label
                htmlFor="hsnName"
                className="block text-sm font-medium text-gray-700"
              >
                Select HSN
              </label>

              <select
                id="hsnName"
                {...register("hsnName")}
                onChange={handleHsnChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
              >
                <option value="">-- Select Hsn--</option>

                {hsnOptions?.map((hsn) => (
                  <option key={hsn._id} value={hsn._id}>
                    {hsn.label}
                  </option>
                ))}
              </select>
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
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-700"
              >
                Select Company
              </label>

              <select
                id="companyName"
                {...register("companyName")}
                onChange={handleCompanyChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
              >
                <option value="">-- Select a company --</option>

                {data.companies?.map((company) => (
                  <option key={company._id} value={company._id}>
                    {company.companyName}
                  </option>
                ))}
              </select>
            </div>

            <div className="">
              <label
                htmlFor="branchName"
                className="block text-sm font-medium text-gray-700 "
              >
                Select Branches
              </label>

              <select
                id="branchName"
                {...register("branchName")}
                onChange={handleBranchChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
              >
                <option value="">-- Select a Branch--</option>

                {filteredBranches?.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.branchName}
                  </option>
                ))}
              </select>
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
          {selectedBranch && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">
                Product List
              </h3>
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

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
