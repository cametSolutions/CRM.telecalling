import React, { useEffect, useState, useMemo } from "react"
import Select, { components } from "react-select"
import { useForm } from "react-hook-form"
import UseFetch from "../../hooks/useFetch"
import useDebounce from "../../hooks/useDebounce"
import { toast } from "react-toastify"
import { FaEdit, FaTrash } from "react-icons/fa"
const CustomerAdd = ({
  process,
  handleCustomerData,
  handleEditedData,
  customer,
  selected
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    setValue,
    watch,
    formState: { errors }
  } = useForm()

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [filteredCompanies, setfilteredCompanies] = useState([])
  const [filteredBranches, setfilteredBranches] = useState([])
  const [showTable, setShowTable] = useState(false)
  const [tableData, setTableData] = useState([])
  const [editState, seteditState] = useState(false)
  const [licenseAvailable, setLicenseAvailable] = useState(true)
  const [editIndex, setEditIndex] = useState(null)
  const [license, setLicense] = useState([])

  const [isLicense, setlicenseExist] = useState([])
  const [products, setProducts] = useState([])
  const [tableObject, setTableObject] = useState({
    company_id: "",
    companyName: "",
    branch_id: "",
    branchName: "",
    product_id: "",
    productName: "",
    licensenumber: "",
    noofusers: "",
    version: "",
    customerAddDate: "",
    amcstartDate: "",
    amcendDate: "",
    amcAmount: "",
    amcDescription: "",
    licenseExpiryDate: "",
    productAmount: "",
    productamountDescription: "",
    tvuexpiryDate: "",
    tvuAmount: "",
    tvuamountDescription: "",
    isActive: ""
  })
  //now created
  const [isChecking, setIsChecking] = useState(false)
  const { data: productData, error: productError } = UseFetch(
    "/product/getallProducts"
  )
  const { data: licensenumber, error: licensenumberError } = UseFetch(
    "/customer/getLicensenumber"
  )
  useEffect(() => {
    if (productData) {
      setProducts(productData)
      console.log("products")
    } // Directly set products to productData
  }, [productData])

  useEffect(() => {
    if (licensenumber) {
      setLicense(licensenumber)
    }
  })
  useEffect(() => {
    if (selectedProduct) {
      console.log("selcteprro", selectedProduct)
      const product = products.find(
        (product) => product._id === selectedProduct
      )
      console.log("products", product)
      if (product) {
        // Using a Set to track unique company IDs
        const uniqueCompanyIds = new Set()
        const uniqueCompanies = product.selected

          .filter((item) => {
            if (!uniqueCompanyIds.has(item.company_id)) {
              uniqueCompanyIds.add(item.company_id)
              return true // Include this item in the filtered array
            }
            return false // Skip this item as it has a duplicate company_id
          })
          .map((item) => ({
            _id: item.company_id,
            companyName: item.companyName,
            branch_id: item.branch_id,
            branchName: item.branchName
          }))
        console.log("uni", uniqueCompanies)
        setfilteredCompanies(uniqueCompanies)
      }
    }
  }, [products, selectedProduct])

  const debouncedLicenseNo = useDebounce(tableObject.licensenumber, 500)

  useEffect(() => {
    const ignored = ["company_id", "branch_id", "product_id"]
    if (selected && customer) {
      console.log("selc", selected)
      setTableObject({
        company_id: selected.company_id || "",
        companyName: selected.comapanyName || "",
        branch_id: selected.branch_id || "",
        branchName: selected.branchName || "",
        product_id: selected.product_id || "",
        productName: selected.productName || "",
        licensenumber: selected.licensenumber || "",
        noofusers: selected.noofusers || "",
        version: selected.version || "",
        customerAddDate: selected.version || "",
        amcstartDate: selected.amcstartDate || "",
        amcendDate: selected.amcendDate || "",
        amcAmount: selected.amcAmount || "",
        amcDescription: selected.amcDescription || "",
        licenseExpiryDate: selected.licenseExpiryDate || "",
        productAmount: selected.productAmount || "",
        productamountDescription: selected.productamountDescription || "",
        tvuexpiryDate: selected.tvuexpiryDate || "",
        tvuAmount: selected.tvuAmount || "",
        tvuamountDescription: selected.tvuamountDescription || "",
        isActive: selected.isActive || ""
      })
      Object.keys(selected).forEach((key) => {
        if (!ignored.includes(key)) {
          if (key === "productName") {
            console.log("hii")
            console.log("selcdpror", selected.product_id)
            setSelectedProduct(selected.product_id)
            setValue(key, selected.product_id)
            console.log("selell", selectedProduct)
          } else if (key === "companyName") {
            console.log("hii")
            console.log("sdffdf", selected.company_id)

            setSelectedCompany(selected.company_id)
            setValue(key, selected.company_id)
          } else if (key === "branchName") {
            console.log("sdffdf", selected.branch_id)

            console.log("selbrac", selected.branch_id)
            setSelectedBranch(selected.branch_id)
            setValue(key, selected.branch_id)
          } else {
            setValue(key, selected[key])
          }
        }
      })
    }
    // Add the keys you want to ignore here
    const ignoredKeys = [
      "company_id",
      "companyName",
      "branch_id",
      "branchName",
      "product_id",
      "productName",
      "licensenumber",
      "noofusers",
      "version",
      "customerAddDate",
      "amcstartDate",
      "amcendDate",
      "amcAmount",
      "amcDescription",
      "licenseExpiryDate",
      "productAmount",
      "productamountDescription",
      "tvuexpiryDate",
      "tvuAmount",
      "tvuamountDescription",
      "isActive",
      "softwareTrade",
      "_id"
    ]

    if (customer) {
      Object.keys(customer).forEach((key) => {
        if (!ignoredKeys.includes(key)) {
          // Check if the key is not in the ignored list
          console.log(key) // Log the key if necessary
          setValue(key, customer[key])
          setTableObject((prev) => ({
            ...prev,

            key: customer[key]
          }))
        }
      })
    }
    // setTableData((prev) => [...prev, tableObject])
  }, [
    customer,
    selected,
    selectedCompany,
    selectedProduct,
    selectedBranch,
    products
  ])

  useEffect(() => {
    // If there's a debounced license number, check its uniqueness
    console.log("lice", license)
    if (debouncedLicenseNo) {
      if (license.length > 0 && isLicense.length === 0) {
        const checkLicense = license.find(
          (item) => item.licensenumber === debouncedLicenseNo
        )
        if (checkLicense) {
          setLicenseAvailable(false)
          console.log("checked true at license")

          toast.error("license number already exits")
        } else {
          setLicenseAvailable(true)
          setlicenseExist((prevState) => [...prevState, debouncedLicenseNo])
          console.log("checked false at licesnes")
          toast.success("license number is available")
        }
      } else {
        if (isLicense.length > 0) {
          console.log("is", isLicense)
          const checklicense = isLicense.find(
            (item) => item === debouncedLicenseNo
          )
          const licensecheck = license.find(
            (item) => item.licensenumber === debouncedLicenseNo
          )
          if (checklicense || licensecheck) {
            setLicenseAvailable(false)
            console.log("checked false at islicense")

            toast.error("license number is already exist")
          } else {
            setLicenseAvailable(true)
            console.log("checked false at islicense")
            toast.success("license number is available")
          }
        } else {
          setLicenseAvailable(true)
          toast.success("license number is available")
        }
      }
    }

    // checkLicenseNumber(debouncedLicenseNo)
  }, [debouncedLicenseNo])

  console.log("typeof dte", tableObject.amcstartDate)
  const productSelected = watch("productName")
  const companySelected = watch("companyName")
  const branchSelected = watch("branchName")
  // const brandSelected = watch("brandName")
  const licenseSelected = watch("licensenumber")
  const softwaretradeSelected = watch("softwareTrade")
  const noofuserSelected = watch("noofusers")
  const customerAddDateSelected = watch("customerAddDate")
  const amcstartDateSelected = watch("amcstartDate")
  const amcendDateSelected = watch("amcendDate")
  const amcAmountSelected = watch("amcAmount")

  const handleTableData = () => {
    const checklicense = isLicense.find((item) => item === debouncedLicenseNo)
    const licensecheck = license.find(
      (item) => item.licensenumber === debouncedLicenseNo
    )
    if (checklicense && licensecheck) {
      setLicenseAvailable(false)
      console.log("checked false at islicense")

      toast.error("license number is already exist")
    }

    if (tableObject.company_id.trim() === "") {
      toast.error("please select a companyssssss")
      return
    } else if (tableObject.branch_id.trim() === "") {
      toast.error("please select a branch")
      return
    } else if (tableObject.product_id.trim() === "") {
      toast.error("please select a product")
      return
    } else if (tableObject.licensenumber.trim() === "") {
      toast.error("please add a license number")
      return
    } else if (tableObject.noofusers.trim() === "") {
      toast.error("please add users")
      return
    } else if (tableObject.version.trim() === "") {
      toast.error("please add version")
      return
    } else if (tableObject.customerAddDate.trim() === "") {
      toast.error("please choose a date")
      return
    } else if (tableObject.amcstartDate.trim() === "") {
      toast.error("please add amc start date")
      return
    } else if (tableObject.amcendDate.trim() === "") {
      toast.error("please select amc end date")
      return
    } else if (tableObject.amcAmount.trim() === "") {
      toast.error("please fill amc amount")
      return
    } else if (tableObject.amcDescription.trim() === "") {
      toast.error("please add amc description")
      return
    } else if (tableObject.licenseExpiryDate.trim() === "") {
      toast.error("please add license expiryDate")
      return
    } else if (tableObject.productAmount.trim() === "") {
      toast.error("please add product amount")
      return
    } else if (tableObject.productamountDescription.trim() === "") {
      toast.error("please add product description")
      return
    } else if (tableObject.tvuexpiryDate.trim() === "") {
      toast.error("please add tvu expiryDate")
      return
    } else if (tableObject.tvuAmount.trim() === "") {
      toast.error("please add tvu amount")
      return
    } else if (tableObject.tvuamountDescription.trim() === "") {
      toast.error("please add tvu description")
      return
    }

    if (editIndex !== null) {
      // If in edit mode, update the existing item
      setTableData((prev) => {
        const newData = [...prev]
        newData[editIndex] = tableObject // Update the specific item
        return newData
      })
      setEditIndex(null)
      seteditState(false) // Reset the edit index
    } else {
      // Otherwise, add a new item
      console.log("tabledta", tableData)
      console
      const isIncluded =
        tableData.some(
          (item) => JSON.stringify(item) === JSON.stringify(tableObject)
        ) && isLicense.includes(tableObject.licensenumber)

      if (isIncluded) {
        toast.error("already added")
        return
      }
      console.log("tableobject", tableObject)
      setTableData((prev) => [...prev, tableObject])

      setlicenseExist((prev) => [...prev, tableObject.licensenumber])
    }

    // reset()
  }

  useEffect(() => {
    if (productError) {
      toast.error(
        productError?.response?.data?.message || "Something went wrong!"
      )
    }
  }, [productError])

  const softwareTrades = [
    "Agriculture",
    "Business Services",
    "Computer Hardware & Software",
    "Electronics & Electrical Supplies",
    "FMCG-Fast Moving Consumable Goods",
    "Garment,Fashion & Apparel",
    "Health & Beauty",
    "Industrial Supplies",
    "Jewelry & Gemstones",
    "Mobile & Accessories",
    "Pharmaceutical & Chemicals",
    "Textiles & Chemicals",
    "Textiles & Fabrics",
    "Others",
    "Restaurant",
    "Food And Beverage",
    "Accounts & Chartered Account",
    "Stationery",
    "Printing & Publishing",

    "Pipes",
    "Tubes & Fittings"
    // Add more trades as needed
  ]

  const handleDelete = (id) => {
    const filtereddData = tableData.filter((product, index) => {
      return index !== id
    })

    setTableData(filtereddData)
    reset()
  }
  const handleEdit = (id) => {
    seteditState(true) // Close the edit state (or handle according to your logic)

    const itemToEdit = tableData.find((item) => item.product_id === id) // Find the product to edit

    if (itemToEdit) {
      // Set the form values
      const fieldsToSet = {
        productName: itemToEdit.product_name,
        companyName: itemToEdit.company_name,
        branchName: itemToEdit.branch_name,
        productAmount: itemToEdit.product_amount,
        tvuamountDescription: itemToEdit.tvu_description,

        licensenumber: itemToEdit.license_no,
        noofuser: itemToEdit.no_of_users,
        version: itemToEdit.version,
        customerAddDate: itemToEdit.customer_addDate,
        amcstartDate: itemToEdit.amc_startDate,
        amcendDate: itemToEdit.amc_endDate,
        amcAmount: itemToEdit.amc_amount,
        amcDescription: itemToEdit.amc_description,
        licenseExpiryDate: itemToEdit.license_expiryDate,
        productamountDescription: itemToEdit.product_description,
        tvuexpiryDate: itemToEdit.tvu_expiryDate,
        tvuAmount: itemToEdit.tvu_amount,
        tuvamountDescription: itemToEdit.tvu_description
      }

      // Set form values using setValue
      Object.entries(fieldsToSet).forEach(([key, value]) =>
        setValue(key, value)
      )

      // Find index of the item being edited and set it to the state
      const index = tableData.findIndex((item) => item.product_id === id)
      setEditIndex(index)
    }
  }

  const handleProductChange = (e) => {
    console.log("eventidddd", e.target.value)

    const productId = e.target.value
    const selectedProduct = products.find(
      (product) => product._id === productId
    )
    console.log("pp", selectedProduct)
    setTableObject((prev) => ({
      ...prev,
      product_id: productId,
      productName: selectedProduct.productName
    }))
    console.log("id", productId)

    setSelectedProduct(productId)
  }

  const handleCompanyChange = (e) => {
    const companyId = e.target.value
    console.log("compiddddddd", companyId)
    console.log("products", products)
    console.log("seletedprrp", selectedProduct)
    // consolele.log("selectd", selectedCompany)
    const Company = products.find((product) => product._id === selectedProduct)
    // console.log("daf", selectedCompany)
    // const foundCompany = Company.selected.find(
    //   (company) => company.company_id === companyId
    // )
    console.log("selcedcom", Company.selected)
    const foundCompany = Company.selected.find(
      (company) => company.company_id === companyId
    )
    console.log("foundCompany", foundCompany)
    setTableObject((prev) => ({
      ...prev,
      company_id: companyId,
      companyName: foundCompany.companyName
    }))

    console.log("hiii")
    setSelectedCompany(companyId)
  }
  ///now created

  const handleBranchChange = (e) => {
    const branchId = e.target.value
    console.log("branchid", branchId)
    console.log("filete", filteredBranches)
    const Branch = filteredBranches.find(
      (branch) => branch.branch_id === branchId
    )
    console.log("ss", Branch)

    setTableObject((prev) => ({
      ...prev,
      branch_id: branchId,
      branchName: Branch.branchName
    }))

    setShowTable(true)
  }

  //now created

  useEffect(() => {
    console.log("fittt", filteredCompanies)
    console.log("filterdbrances", filteredBranches)
    console.log("prod", products)
    console.log("selet", selectedCompany)
    const company = filteredCompanies.find(
      (company) => company._id === selectedCompany
    )
    console.log("products", company)
    if (company) {
      console.log("commmm", company)
      const branch = [company]
      console.log("branch", branch)

      setfilteredBranches(branch)
    }
  }, [products, selectedProduct, filteredCompanies, selectedCompany])

  const onSubmit = async (data) => {
    try {
      console.log("form", data)

      if (process === "Registration") {
        console.log("tableobject", tableObject)
        await handleCustomerData(data, tableData)
        reset()
      } else if (process === "edit") {
        await handleEditedData(data, tableObject)
      }
    } catch (error) {
      toast.error("Failed to save customer!")
    }
  }

  return (
    <div className="container justify-center items-center min-h-screen p-8 bg-gray-100">
      <div className="w-auto bg-white shadow-lg rounded p-8 mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Customer Master</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 m-5">
            {/* Product Select Dropdown */}

            {/* Customer Name */}
            <div>
              <label
                htmlFor="customerName"
                className="block text-sm font-medium text-gray-700"
              >
                Customer Name
              </label>
              <input
                type="text"
                id="customerName"
                {...register("customerName", {
                  required: "Customer name is required"
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none"
                placeholder="Enter customer name"
              />
              {errors.customerName && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.customerName.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address 1
              </label>
              <input
                type="text"
                {...register("address1")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none focus:border-gray-500"
                placeholder="Address"
              />
              {errors.address1 && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.address1.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address 2
              </label>
              <input
                type="text"
                {...register("address2")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none focus:border-gray-500"
                placeholder="Address"
              />
              {errors.address2 && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.address2.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                {...register("country")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                placeholder="Country"
              />
              {errors.country && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.country.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                {...register("state")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                placeholder="State"
              />
              {errors.state && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.state.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                {...register("city")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                placeholder="City"
              />
              {errors.city && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.city.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Pincode
              </label>
              <input
                type="number"
                {...register("pincode")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                placeholder="Pincode"
              />
              {errors.pincode && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.pincode.message}
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="contactPerson"
                className="block text-sm font-medium text-gray-700"
              >
                Contact Person
              </label>
              <input
                type="text"
                {...register("contactPerson")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                placeholder="Contactperson"
              />
              {errors.contactPerson && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.contactPerson.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Invalid email address"
                  }
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                placeholder="Email"
              />
              {errors.email && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mobile
              </label>
              <input
                type="tel"
                {...register("mobile", { required: "mobile is required" })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                placeholder="Phone"
              />
              {errors.mobile && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.mobile.message}
                </span>
              )}
            </div>
            <div className="">
              <label className="block text-sm font-medium text-gray-700">
                Landline No
              </label>
              <input
                type="tel"
                {...register("landline")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                placeholder="Landline"
              />
              {errors.landline && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.landline.message}
                </span>
              )}
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-semibold mb-6">Product Details</h1>
            <div className="  grid grid-cols-1 sm:grid-cols-4 gap-6 m-5">
              <div>
                <label
                  htmlFor="productName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Product
                </label>

                <select
                  id="productName"
                  {...register("productName")}
                  onChange={handleProductChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                >
                  <option value="">-- Select a product --</option>

                  {products?.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.productName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Associated Company
                </label>

                <select
                  id="companyName"
                  {...register("companyName")}
                  onChange={handleCompanyChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                >
                  <option value="">-- Select a company --</option>
                  {filteredCompanies?.map((company) => (
                    <option key={company._id} value={company._id}>
                      {company.companyName}
                    </option>
                  ))}
                </select>
              </div>
              {/* Branch Display */}
              <div>
                <label
                  htmlFor="branchName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Associated Branch
                </label>

                <select
                  id="branchName"
                  {...register("branchName")}
                  onChange={handleBranchChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                >
                  <option value="">-- Select a branch --</option>

                  {filteredBranches?.map((branch) => (
                    <option key={branch._id} value={branch.branch_id}>
                      {branch.branchName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="licensenumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  License
                </label>
                <input
                  id="licensenumber"
                  type="text"
                  {...register("licensenumber")}
                  onChange={
                    (e) =>
                      setTableObject({
                        ...tableObject,
                        licensenumber: e.target.value
                      }) // Update state on change
                  }
                  className="mt-0 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                  placeholder="License No..."
                />
                {errors.licensenumber && (
                  <span className="mt-2 text-sm text-red-600">
                    {errors.licensenumber.message}
                  </span>
                )}
              </div>
              <div>
                <label htmlFor="softwareTrade">Software Trade</label>
                <select
                  id="softwareTrade"
                  {...register("softwareTrade", { required: true })}
                  onChange={
                    (e) =>
                      setTableObject({
                        ...tableObject,
                        softwareTrade: e.target.value
                      }) // Update state on change
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                >
                  <option value="">Select Software Trade</option>
                  {softwareTrades.map((trade, index) => (
                    <option key={index} value={trade}>
                      {trade}
                    </option>
                  ))}
                </select>
                {errors.softwareTrade && (
                  <p className="text-red-500">
                    Please select a software trade.
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="noofusers"
                  className="block text-sm font-medium text-gray-700"
                >
                  No.of Users
                </label>
                <input
                  type="number"
                  {...register("noofusers")}
                  onChange={
                    (e) =>
                      setTableObject({
                        ...tableObject,
                        noofusers: e.target.value
                      }) // Update state on change
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                  placeholder="No of users.."
                />
                {errors.noofusers && (
                  <span className="mt-2 text-sm text-red-600">
                    {errors.noofuser.message}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="version"
                  className="block text-sm font-medium text-gray-700"
                >
                  Version
                </label>
                <input
                  id="version"
                  type="text"
                  {...register("version")}
                  onChange={
                    (e) =>
                      setTableObject({
                        ...tableObject,
                        version: e.target.value
                      }) // Update state on change
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                  placeholder="Version..."
                />
                {errors.version && (
                  <span className="mt-2 text-sm text-red-600">
                    {errors.version.message}
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor="customerAddDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Customer Add Date
                </label>
                <input
                  id="customerAddDate"
                  type="date"
                  {...register("customerAddDate")}
                  onChange={
                    (e) =>
                      setTableObject({
                        ...tableObject,
                        customerAddDate: e.target.value
                      }) // Update state on change
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                />
                {errors.customerAddDate && (
                  <span className="mt-2 text-sm text-red-600">
                    {errors.customerAddDate.message}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="amcstartDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  AMC Start Date
                </label>
                <input
                  id="amcstartDate"
                  type="date"
                  {...register("amcstartDate")}
                  onChange={
                    (e) =>
                      setTableObject({
                        ...tableObject,
                        amcstartDate: e.target.value
                      })

                    // Update state on change
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                />
                {errors.amcstartDate && (
                  <span className="mt-2 text-sm text-red-600">
                    {errors.amcstartDate.message}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="amcendDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  AMC End Date
                </label>
                <input
                  id="amcendDate"
                  type="date"
                  {...register("amcendDate")}
                  onChange={(e) => {
                    const value = e.target.value

                    setTableObject((prev) => ({
                      ...prev,
                      amcendDate: value // Update local state if needed
                    }))
                  }}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                />
                {errors.amcendDate && (
                  <span className="mt-2 text-sm text-red-600">
                    {errors.amcendDate.message}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="amcAmount"
                  className="block text-sm font-medium text-gray-700"
                >
                  AMC Amount
                </label>
                <input
                  type="number"
                  {...register("amcAmount")}
                  onChange={
                    (e) =>
                      setTableObject({
                        ...tableObject,
                        amcAmount: e.target.value
                      }) // Update state on change
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                  placeholder="Amc amount.."
                />
                {errors.amcAmount && (
                  <span className="mt-2 text-sm text-red-600">
                    {errors.amcAmount.message}
                  </span>
                )}
              </div>
              <div>
                <label
                  id="amcDescription"
                  className="block text-sm font-medium text-gray-700"
                >
                  AMC Description
                </label>
                <textarea
                  id="amcDescription"
                  rows="1"
                  {...register("amcDescription", {
                    maxLength: {
                      value: 500,
                      message: "Description cannot exceed 500 characters"
                    }
                  })}
                  onChange={
                    (e) =>
                      setTableObject({
                        ...tableObject,
                        amcDescription: e.target.value
                      }) // Update state on change
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                  placeholder="Enter a description..."
                />
                {errors.amcDescription && (
                  <span className="mt-2 text-sm text-red-600">
                    {errors.amcDescription.message}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="licenseExpiryDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  License Expiry Date
                </label>
                <input
                  id="licenseExpiryDate"
                  type="date"
                  {...register("licenseExpiryDate")}
                  onChange={
                    (e) =>
                      setTableObject({
                        ...tableObject,
                        licenseExpiryDate: e.target.value
                      }) // Update state on change
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                />
                {errors.licenseExpiryDate && (
                  <span className="mt-2 text-sm text-red-600">
                    {errors.licenseExpiryDate.message}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="productAmount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Product Amount
                </label>
                <input
                  type="number"
                  // value={selectedProduct.}
                  {...register("productAmount")}
                  onChange={
                    (e) =>
                      setTableObject({
                        ...tableObject,
                        productAmount: e.target.value
                      }) // Update state on change
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                  placeholder="Product amount.."
                />
                {errors.productAmount && (
                  <span className="mt-2 text-sm text-red-600">
                    {errors.productAmount.message}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="productamountDescription"
                  className="block text-sm font-medium text-gray-700"
                >
                  Product Description
                </label>
                <textarea
                  id="productamountDescription"
                  rows="1"
                  {...register("productamountDescription", {
                    maxLength: {
                      value: 500,
                      message: "Description cannot exceed 500 characters"
                    }
                  })}
                  onChange={
                    (e) =>
                      setTableObject({
                        ...tableObject,
                        productamountDescription: e.target.value
                      }) // Update state on change
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                  placeholder="Enter a description..."
                />
                {errors.productamountDescription && (
                  <span className="mt-2 text-sm text-red-600">
                    {errors.productamountDescription.message}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="tvuexpiryDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  TVU ExpiryDate
                </label>
                <input
                  id="tvuexpiryDate"
                  type="date"
                  {...register("tvuexpiryDate")}
                  onChange={
                    (e) =>
                      setTableObject({
                        ...tableObject,
                        tvuexpiryDate: e.target.value
                      }) // Update state on change
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                />
                {errors.tvuexpiryDate && (
                  <span className="mt-2 text-sm text-red-600">
                    {errors.tvuexpiryDate.message}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="tvuAmount"
                  className="block text-sm font-medium text-gray-700"
                >
                  TVU Amount
                </label>
                <input
                  id="tvuAmount"
                  type="number"
                  {...register("tvuAmount")}
                  onChange={
                    (e) =>
                      setTableObject({
                        ...tableObject,
                        tvuAmount: e.target.value
                      }) // Update state on change
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                  placeholder="Tvu amount.."
                />
                {errors.tvuAmount && (
                  <span className="mt-2 text-sm text-red-600">
                    {errors.tvuAmount.message}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="tvuamountDescription"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tvu Description
                </label>
                <textarea
                  id="tvuamountDescription"
                  rows="1"
                  {...register("tvuamountDescription", {
                    maxLength: {
                      value: 500,
                      message: "Description cannot exceed 500 characters"
                    }
                  })}
                  onChange={
                    (e) =>
                      setTableObject({
                        ...tableObject,
                        tvuamountDescription: e.target.value
                      }) // Update state on change
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                  placeholder="Enter a description..."
                />
                {errors.tvuamountDescription && (
                  <span className="mt-2 text-sm text-red-600">
                    {errors.tvuamountDescription.message}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="isActive"
                  className="block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <select
                  id="isActive"
                  {...register("isActive", { required: true })}
                  onChange={
                    (e) =>
                      setTableObject({
                        ...tableObject,
                        isActive: e.target.value
                      }) // Update state on change
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                >
                  <option value="">Select Status</option>
                  <option value="Running">Active</option>
                  <option value="Deactive">Deactive</option>
                </select>
                {errors.isActive && (
                  <p className="text-red-500">
                    Please select a status for the customer.
                  </p>
                )}
              </div>
            </div>
            {showTable && (
              <div>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleTableData}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  >
                    {editState ? "UPDATE" : "ADD"}
                  </button>
                </div>

                <div className="mt-6 w-lg overflow-x-auto">
                  <h3 className="text-lg font-medium text-gray-900">
                    Product Details List
                  </h3>
                  <table className="bg-green-300 m-w-full divide-y divide-gray-200 mt-4">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Company Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Branch Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          License No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          No.of Users
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Version
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer addDate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amc startDate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amc endDate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amc amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          License expiry
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product Amount
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tvu expiry
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tvu amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Edit
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Delete
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tableData?.map((product, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product?.productName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product?.companyName}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product?.branchName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product?.licensenumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product?.noofusers}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product?.version}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product?.customerAddDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product?.amcstartDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product?.amcendDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product?.amcAmount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product?.licenseExpiryDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product?.productAmount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product?.tvuexpiryDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product?.tvuAmount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {" "}
                            <button
                              type="button"
                              className="text-green-600 hover:text-green-900 mr-2" // Adjust styles as needed
                              // onClick={() => handleEdit(index)}
                            >
                              <FaEdit
                                onClick={() => handleEdit(product.product_id)}
                              />
                            </button>
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
              </div>
            )}

            {/* tabledata */}

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                {process === "Registration" ? "Save" : "Update "}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CustomerAdd
