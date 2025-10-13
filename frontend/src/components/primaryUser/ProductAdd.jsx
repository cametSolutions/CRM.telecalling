import { useEffect, useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import UseFetch from "../../hooks/useFetch"
import { toast } from "react-toastify"
import { Trash2, Building2, MapPin, Edit2 } from "lucide-react"
import { FaTrash } from "react-icons/fa" // Import icons

const ProductAdd = ({
  process,
  product,
  selected,
  handleProductData,
  handleEditedData,
  index,
  item
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm()

  const [selectedCompany, setSelectedCompany] = useState([])
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

  useEffect(() => {
    if (selected) {
      setShowTable(true)
      setSelectedBranch(true)

      setTableObject({
        company_id: selected.company_id || "",
        companyName: selected.companyName || "",
        branch_id: selected.branch_id || "",
        branchName: selected.branchName || "",
        brand_id: selected.brand_id || "",
        brandName: selected.brandName || "",
        category_id: selected.category_id || "",
        categoryName: selected.categoryName || "",
        hsn_id: selected.hsn_id || "",
        hsnName: selected.hsnName || ""
      })
      const tablearray = item.selected.map((sel) => ({
        company_id: sel.company_id || "",
        companyName: sel.companyName || "",
        branch_id: sel.branch_id || "",
        branchName: sel.branchName || "",
        brand_id: sel.brand_id || "",
        brandName: sel.brandName || "",
        category_id: sel.category_id || "",
        categoryName: sel.categoryName || "",
        hsn_id: sel.hsn_id || "",
        hsnName: sel.hsnName || ""
      }))
      setTableData(tablearray)
      // setTableData([
      //   {
      //     company_id: selected.company_id || "",
      //     companyName: selected.companyName || "",
      //     branch_id: selected.branch_id || "",
      //     branchName: selected.branchName || "",
      //     brand_id: selected.brand_id || "",
      //     brandName: selected.brandName || "",
      //     category_id: selected.category_id || "",
      //     categoryName: selected.categoryName || "",
      //     hsn_id: selected.hsn_id || "",
      //     hsnName: selected.hsnName || ""
      //   }
      // ])

      Object.keys(selected).forEach((key) => {
        if (key === "brandName") {
          setValue(key, selected?.brand_id)
        } else if (key === "categoryName") {
          setValue(key, selected?.category_id)
        } else if (key === "hsnName") {
          setValue(key, selected?.hsn_id?._id)
        } else if (key === "companyName") {
          setSelectedCompany(selected?.company_id)
          setValue(key, selected?.company_id)
        } else if (key === "branchName") {
          setValue(key, selected?.branch_id)
        }
        // Log the key if necessary
      })
    }
    if (product) {
      Object.keys(product).forEach((key) => {
        // Check if the key is not in the ignored list
        setValue(key, product[key])
      })
    }
  }, [data])

  useEffect(() => {
    if (companyData) setData((prev) => ({ ...prev, companies: companyData }))
    if (hsnData) setData((prev) => ({ ...prev, hsn: hsnData }))
    if (brandData) setData((prev) => ({ ...prev, brands: brandData }))
    if (categoryData) setData((prev) => ({ ...prev, categories: categoryData }))
  }, [companyData, hsnData, brandData, categoryData])

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
    setShowTable(true)
    setValue("branch", branchId) // Update the value in react-hook-form
  }
  const handleTableData = (e) => {
    e.preventDefault()
    if (tableObject.product_id === "") {
      toast.error("please select a product")
      return
    } else if (tableObject.company_id.trim() === "") {
      toast.error("please select a company")
      return
    } else if (tableObject.branch_id.trim() === "") {
      toast.error("please select a branch")
      return
    } else if (tableObject.brand_id === "") {
      tableObject.brand_id.trim()
    } else if (tableObject.category_id === "") {
      tableObject.category_id.trim()
    } else if (tableObject.hsn_id === "") {
      tableObject.hsn_id.trim()
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
  }

  const handleCompanyChange = (e) => {
    const companyId = e.target.value

    const selectedCompany = data.companies.find(
      (branch) => branch._id === companyId
    )
    setTableObject((prev) => ({
      ...prev,
      company_id: companyId,
      companyName: selectedCompany.companyName
    }))

    setSelectedCompany(companyId)

    // setValue("companyName", selectedCompany.companyName) // Update the value in react-hook-form
  }

  const handleBrandChange = (e) => {
    const brandId = e.target.value
    const selectedBrand = data.brands.find((brand) => brand._id === brandId)

    setTableObject((prev) => ({
      ...prev,
      brand_id: brandId,
      brandName: selectedBrand.brand
    }))

    setTableData((prev) =>
      prev.map((item) => ({
        ...item,
        brand_id: brandId,
        brandName: selectedBrand.brand
      }))
    )

    // setValue("brandName", brandId) // Update the value in react-hook-form
  }
 
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value
    const selectedCategory = data.categories.find(
      (category) => category._id === categoryId
    )
    setTableObject((prev) => ({
      ...prev,
      category_id: categoryId,
      categoryName: selectedCategory.category
    }))
    setTableData((prev) =>
      prev.map((item) => ({
        ...item,
        category_id: categoryId,
        categoryName: selectedCategory.category
      }))
    )

    setValue("category", categoryId) // Update the value in react-hook-form
  }
  const handleHsnChange = (e) => {
    const hsnId = e.target.value
    const selectedHsn = data.hsn.find((hsn) => hsn._id === hsnId)
    setTableObject((prev) => ({
      ...prev,
      hsn_id: hsnId,
      hsnName: selectedHsn?.hsnSac || ""
    }))
    setTableData((prev) =>
      prev.map((item) => ({
        ...item,
        hsn_id: hsnId,
        hsnName: selectedHsn?.hsnSac || ""
      }))
    )

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
        _id: hsndata._id,
        label: hsndata.hsnSac
      })) || [],
    [data.hsn]
  )

  const toggleTable = () => {
    setShowTable(!showTable)
  }

  const onSubmit = async (data, event) => {
    event.preventDefault()

    try {
      if (process === "Registration") {
        await handleProductData(data, tableData)
      } else if (process === "edit") {
        await handleEditedData(data, tableData)
      }
      // Refetch the product data
    } catch (error) {
      console.log("error on onsubmit", error)
      toast.error("Failed to add product!")
    }
  }

  return (
    <div className="justify-center items-center m-5">
      <div className="w-auto bg-white shadow-lg rounded p-3 md:p-8 mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Product Master</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-6 m-2 md:m-5">
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
                {...register("productPrice")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none focus:border-gray-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="Product Price"
              />
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
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none cursor-pointer"
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
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none cursor-pointer"
              >
                <option value="">-- Select a category --</option>

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
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none cursor-pointer"
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
                {...register("description")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none focus:border-gray-500"
                placeholder="Product Description"
              ></textarea>
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
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none cursor-pointer"
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
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none cursor-pointer"
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
                  Add To Table
                </button>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4  text-xs font-semibold text-gray-700 uppercase tracking-wider text-nowrap">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Company Name
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center items-center text-xs font-semibold text-gray-700 uppercase tracking-wider text-nowrap ">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Branch Name
                    </div>
                  </th>
                  <th className=" py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider text-nowrap w-32 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {tableData.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-5 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Building2 className="w-12 h-12 text-gray-300" />
                        <p className="text-gray-500 font-medium">
                          No data available
                        </p>
                        <p className="text-gray-400 text-sm">
                          Add companies to get started
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  tableData &&
                  tableData.length > 0 &&
                  tableData.map((product, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {product?.companyName?.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product?.companyName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product?.branchName}
                        </div>
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right"></td> */}
                      <td className=" py-4 whitespace-nowrap text-sm font-medium text-center">
                        {/* <button
                          type="button"
                          onClick={() => handleEdit(index)}
                          className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-150 font-medium mr-2 cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                          
                        </button> */}
                        <button
                          type="button"
                          onClick={() => handleDelete(index)}
                          className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-150 font-medium cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              {process === "Registration" ? "SUBMIT" : "SUBMIT"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductAdd
