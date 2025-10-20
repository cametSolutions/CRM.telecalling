import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Select from "react-select"
import { getLocalStorageItem } from "../../helper/localstorage"
import { useSelector } from "react-redux"
import { useForm, Controller } from "react-hook-form"
import UseFetch from "../../hooks/useFetch"
import useDebounce from "../../hooks/useDebounce"
import { toast } from "react-toastify"
import { FaEdit, FaTrash } from "react-icons/fa"
const CustomerAdd = ({
  navigatebackto,
  process,
  handleCustomerData,
  handleEditedData,
  customer
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    clearErrors,
    getValues,
    setValue,
    watch,

    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      productName: null,
      companyName: null,
      branchName: null,
      customerName: "",
      address1: "",
      address2: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
      email: "",
      mobile: "",
      landline: "",
      licensenumber: "",
      noofusers: "",
      version: "",
      customerAddDate: "",
      amcstartDate: "",
      amcendDate: "",
      amcAmount: "",
      licenseExpiryDate: "",
      productAmount: "",
      productamountDescription: "",
      tvuexpiryDate: "",
      tvuAmount: "",
      tvuamountDescription: "",
      isActive: "Running",
      reasonofStatus: ""
    }
  })

  // const [selectedBranch, setSelectedBranch] = useState(false)
  const [productOptions, setProductOptions] = useState([])
  const [loggeduser, setloggedUser] = useState(null)
  // const [loggeduserBranch, setLoggeduserBranches] = useState(null)
  const [companyOptions, setCompanyOptions] = useState([])
  const [branchOptions, setBranchOptions] = useState([])
  const [selectedproductid, setselectedproductId] = useState(null)
  const [selectedCompanyId, setSelectedCompanyId] = useState(null)
  const [selectedbranchId, setSelectedBranchId] = useState(null)
  const [showTable, setShowTable] = useState(false)
  const [tableData, setTableData] = useState([])
  const [editState, seteditState] = useState(false)
  const [partner, setPartner] = useState([])
  const [editIndex, setEditIndex] = useState(null)
  const [licenseAvailable, setLicenseAvailable] = useState(true)
  const [license, setLicense] = useState([])
  const selectedProduct = watch("productName")
  const selectedCompany = watch("companyName")
  const [isLicense, setlicenseExist] = useState([])
  const registrationType = watch("registrationType")
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
    isActive: "Running",
    industry: "",
    reasonofStatus: ""
  })
  //now created

  const { data: licensenumber } = UseFetch("/customer/getLicensenumber")
  const { data: partners } = UseFetch("/customer/getallpartners")
  const { data: allcompanyBranches } = UseFetch("/branch/getBranch")
  const loggeduserBranch = useSelector(
    (state) => state.companyBranch.loggeduserbranches
  )

  const { data: productData, error: productError } = UseFetch(
    loggeduserBranch &&
      `/product/getallProducts?branchselected=${encodeURIComponent(
        JSON.stringify(loggeduserBranch)
      )}`
  )
  const navigate = useNavigate()
  useEffect(() => {
    if (allcompanyBranches && allcompanyBranches.length) {
      const user = getLocalStorageItem("user")
      setloggedUser(user)
    }
  }, [allcompanyBranches])

  useEffect(() => {
    if (customer && partner && partner.length > 0) {
      setShowTable(true)
      seteditState(true)
      setEditIndex(customer.index ?? 0)
      // Set tableObject using the selected index
      const selectedIndex = customer.index ?? 0
      const selectedItem = customer.selected?.[selectedIndex]
      // setselectedproductId(selectedItem?.product_id)
      //
      // Reset the form
      reset({
        customerName: customer?.customerName,
        address1: customer.address1,
        address2: customer.address2,
        country: customer.country,
        state: customer.state,
        city: customer.city,
        pincode: customer.pincode,
        contactPerson: customer.contactPerson,
        email: customer.email,
        mobile: customer.mobile,
        landline: customer.landline,
        industry: customer.industry,
        partner: customer.partner,
        registrationType: customer.registrationType,

        licensenumber: selectedItem?.licensenumber,
        softwareTrade: selectedItem?.softwareTrade,
        noofusers: selectedItem?.noofusers,
        version: selectedItem?.version,
        customerAddDate: selectedItem?.customerAddDate,
        amcstartDate: selectedItem?.amcstartDate,
        amcendDate: selectedItem?.amcendDate,
        amcAmount: selectedItem?.amcAmount,
        licenseExpiryDate: selectedItem?.licenseExpiryDate,
        productAmount: selectedItem?.productAmount,
        productamountDescription: selectedItem?.productamountDescription,
        tvuexpiryDate: selectedItem?.tvuexpiryDate,
        tvuAmount: selectedItem?.tvuAmount,
        tvuamountDescription: selectedItem?.tvuamountDescription,
        isActive: selectedItem?.isActive,
        reasonofStatus: selectedItem?.reasonofStatus
      })

      if (selectedItem) {
        setTableObject({
          company_id: selectedItem.company_id || "",
          companyName: selectedItem.companyName || "",
          branch_id: selectedItem.branch_id || "",
          branchName: selectedItem.branchName || "",
          licensenumber: selectedItem.licensenumber || "",
          noofusers: selectedItem.noofusers || "",
          version: selectedItem.version || "",
          customerAddDate: selectedItem.customerAddDate || "",
          amcstartDate: selectedItem.amcstartDate || "",
          amcendDate: selectedItem.amcendDate || "",
          amcAmount: selectedItem.amcAmount || "",
          amcDescription: selectedItem.amcDescription || "",
          licenseExpiryDate: selectedItem.licenseExpiryDate || "",
          productAmount: selectedItem.productAmount || "",
          productamountDescription: selectedItem.productamountDescription || "",
          tvuexpiryDate: selectedItem.tvuexpiryDate || "",
          tvuAmount: selectedItem.tvuAmount || "",
          tvuamountDescription: selectedItem.tvuamountDescription || "",
          isActive: selectedItem.isActive || "",
          reasonofStatus: selectedItem.reasonofStatus || ""
        })
      }

      // Map over customer.selected to setTableData once
      const tableDataArray = customer.selected.map((sel) => ({
        company_id: sel.company_id || "",
        companyName: sel.companyName || "",
        branch_id: sel.branch_id || "",
        branchName: sel.branchName || "",
        product_id: sel.product_id || "",
        productName: sel.productName || "",
        licensenumber: sel.licensenumber || "",
        noofusers: sel.noofusers || "",
        version: sel.version || "",
        customerAddDate: sel.customerAddDate || "",
        amcstartDate: sel.amcstartDate || "",
        amcendDate: sel.amcendDate || "",
        amcAmount: sel.amcAmount || "",
        amcDescription: sel.amcDescription || "",
        licenseExpiryDate: sel.licenseExpiryDate || "",
        productAmount: sel.productAmount || "",
        productamountDescription: sel.productamountDescription || "",
        tvuexpiryDate: sel.tvuexpiryDate || "",
        tvuAmount: sel.tvuAmount || "",
        tvuamountDescription: sel.tvuamountDescription || "",
        isActive: sel.isActive || "",
        industry: sel.industry || "",
        reasonofStatus: sel.reasonofStatus || ""
      }))

      setTableData(tableDataArray)
    }
  }, [productData, reset, customer, partner])
  useEffect(() => {
    if (tableData && tableData.length > 0 && tableObject && customer) {
      if (tableObject.product_id) {
        return
      }
      const selectedIndex = customer.index ?? 0
      const selectedItem = customer.selected?.[selectedIndex]
      const editedproductoption = {
        label: selectedItem.productName,
        value: selectedItem.product_id
      }
      handleProductChange(editedproductoption)
    }
  }, [tableData, tableObject])
  // First effect: handles product + sets value
  useEffect(() => {
    if (productData) {
      setPartner(partners)
      setProductOptions(
        productData.map((product) => ({
          label: product.productName,
          value: product._id
        }))
      )
    }
  }, [productData, reset, customer, partners])
  // Second effect: run company handler after product is set

  useEffect(() => {
    if (licensenumber) {
      setLicense(licensenumber)
    }
  }, [licensenumber])

  const debouncedLicenseNo = useDebounce(tableObject.licensenumber, 1000)
  useEffect(() => {
    // If there's a debounced license number, check its uniqueness

    if (debouncedLicenseNo.length > 0) {
      debouncedLicenseNo.trim()

      if (
        license &&
        license.length > 0 &&
        isLicense &&
        isLicense.length === 0
      ) {
        const checkLicense = license.find((item) => {
          if (!item || item.licensenumber === undefined) {
            return false // Skips this and moves to the next item
          }
          return item?.licensenumber.toString() === debouncedLicenseNo
        })

        if (checkLicense) {
          setLicenseAvailable(false)

          toast.error("license number already exits")
        } else {
          setLicenseAvailable(true)

          toast.success("license number is available")
        }
      } else {
        if (isLicense && isLicense.length > 0) {
          const checklicense = isLicense.find(
            (item) => item === debouncedLicenseNo
          )
          const licensecheck = license.find(
            (item) => item?.licensenumber.toString() === debouncedLicenseNo
          )
          if (checklicense || licensecheck) {
            setLicenseAvailable(false)

            toast.error("license number is already exist")
          } else {
            setLicenseAvailable(true)

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

  const handleTableData = () => {
    if (editIndex !== null) {
      // If in edit mode, update the existing item
      setTableData((prev) => {
        const newData = [...prev]
        newData[editIndex] = tableObject // Update the specific item
        return newData
      })
      setlicenseExist((prevState) => {
        const updatedLicenses = [...prevState]
        updatedLicenses[editIndex] = tableObject.licensenumber // Update the license at the editIndex
        return updatedLicenses
      })

      setEditIndex(null)
      seteditState(false) // Reset the edit index
    } else {
      // Otherwise, add a new item

      const istableobjectInclude = tableData.some(
        (item) => JSON.stringify(item) === JSON.stringify(tableObject)
      )

      const islicenseInclude = tableData.some(
        (item) => item.licensenumber === tableObject.licensenumber
      )

      if (istableobjectInclude) {
        toast.error("already added")
        return
      }
      if (islicenseInclude) {
        toast.error("licensenumber is already exist")
        return
      }
      setlicenseExist((prevState) => [...prevState, tableObject.licensenumber])

      setTableData((prev) => [...prev, tableObject])
    }
  }
  useEffect(() => {
    if (selectedproductid) {
      const options = getCompaniesForProduct(selectedproductid) // mapping function
      setCompanyOptions(options)
      if (options.length > 0) {
        const firstCompany = options[0]
        setSelectedCompanyId(firstCompany) // auto select company

        if (branchOptions.length > 0) {
          setSelectedBranchId(branchOptions[0]?.value) // auto select branch
        } else {
          setSelectedBranchId(null)
        }
      } else {
        setSelectedCompanyId(null)
        setBranchOptions([])
        setSelectedBranchId(null)
      }
    } else {
      setCompanyOptions([])
      setSelectedCompanyId(null)
      setBranchOptions([])
      setSelectedBranchId(null)
    }
  }, [selectedproductid])
  useEffect(() => {
    if (selectedCompanyId) {
      setValue("companyName", selectedCompanyId)
      setTableObject((prev) => ({
        ...prev,
        company_id: selectedCompanyId.value,
        companyName: selectedCompanyId.label
      }))
      // also set branches for this company
      const branchOptions = getBranchesForCompany(
        selectedproductid,
        selectedCompanyId.value
      )
      setBranchOptions(branchOptions)
      setSelectedBranchId(branchOptions[0])
    }
  }, [selectedCompanyId])
  useEffect(() => {
    if (selectedbranchId) {
      setValue("branchName", selectedbranchId)
      setTableObject((prev) => ({
        ...prev,
        branch_id: selectedbranchId.value,
        branchName: selectedbranchId.label
      }))
    }
  }, [selectedbranchId])

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
    "Hotel",
    "Pipes",
    "Tubes & Fittings"
    // Add more trades as needed
  ]

  const Industries = [
    "Whole sailor/Distributors",
    "Retailer",
    "Manufacturer",
    "Service",
    "Works Contact"
  ]

  const handleDelete = (id) => {
    const filtereddData = tableData.filter((product, index) => {
      return index !== id
    })

    const updatedIslicense = isLicense.filter((license, index) => {
      return index !== id
    })

    setTableData(filtereddData)
    setlicenseExist(updatedIslicense)
    if (filtereddData && filtereddData.length === 0) {
      setShowTable(false)
    }

    reset()
  }

  const handleEdit = (id) => {
    seteditState(true) // Close the edit state (or handle according to your logic)

    const itemToEdit = tableData.find((item) => item.product_id === id) // Find the product to edit

    if (itemToEdit) {
      // Set form values using setValue
      Object.entries(itemToEdit).forEach(([key, value]) => setValue(key, value))
      // Set React Select fields (assuming product, company, and branch are React Select fields)
      if (itemToEdit.product_id) {
        setValue("productName", {
          value: itemToEdit.product_id,
          label: itemToEdit.productName
        })
      }
      if (itemToEdit.company_id) {
        setValue("companyName", {
          value: itemToEdit.company_id,
          label: itemToEdit.companyName
        })
      }
      if (itemToEdit.branch_id) {
        setValue("branchName", {
          value: itemToEdit.branch_id,
          label: itemToEdit.branchName
        })
      }

      // Find index of the item being edited and set it to the state
      const index = tableData.findIndex((item) => item.product_id === id)

      setEditIndex(index)
    }
  }
  const handleProductChange = (selectedOption) => {
    setValue("productName", selectedOption)
    setselectedproductId(selectedOption.value)
    setShowTable(true)
    setTableObject((prev) => ({
      ...prev,
      product_id: selectedOption.value,
      productName: selectedOption.label
    }))
  }

  const handleCompanyChange = (selectedCompanyOption) => {
    setSelectedCompanyId(selectedCompanyOption.value)
  }
  const handleBranchChange = (selectedBranchOption) => {
    setValue("branchName", selectedBranchOption)
    setTableObject((prev) => ({
      ...prev,
      branch_id: selectedBranchOption.value,
      branchName: selectedBranchOption.label
    }))
  }
  const emailDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"]

  const validateEmailDomain = (email) => {
    const domain = email.split("@")[1]
    return emailDomains.includes(domain) || "Invalid email domain"
  }
  const handleAddNewProduct = () => {
    setTableObject({
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
      isActive: "Running",
      industry: "",
      reasonofStatus: ""
    })
    seteditState(false)
    setEditIndex(null)
    reset({
      productName: "",
      companyName: "",
      branchName: "",
      licensenumber: "",
      softwareTrade: "",
      noofusers: "",
      version: "",
      customerAddDate: "",
      amcstartDate: "",
      amcendDate: "",
      amcAmount: "",
      licenseExpiryDate: "",
      productAmount: "",
      productamountDescription: "",
      tvuexpiryDate: "",
      tvuAmount: "",
      tvuamountDescription: "",
      
      reasonofStatus: ""
    })
  }
  const getCompaniesForProduct = (productId) => {
    const product = productData.find((item) => item._id === productId)
    if (!product) return []

    const seen = new Set()
    return product.selected.reduce((acc, company) => {
      if (!seen.has(company.company_id)) {
        seen.add(company.company_id)
        acc.push({
          label: company.companyName,
          value: company.company_id
        })
      }
      return acc
    }, [])
  }

  const getBranchesForCompany = (productId, companyId) => {
    const product = productData.find((item) => item._id === productId)
    if (!product) return []

    return product.selected
      .filter((c) => c.company_id === companyId)
      .map((branch) => ({
        label: branch.branchName,
        value: branch.branch_id
      }))
  }

  const onSubmit = async (data) => {
    try {
      if (process === "Registration") {
        await handleCustomerData(data, tableData)
        reset()
      } else if (process === "edit") {
        if (tableData.length === 0) {
          setTableData((prev) => [...prev, tableObject])
        }

        await handleEditedData(data, tableData, customer.index)
      }
    } catch (error) {
      toast.error("Failed to save customer!")
    }
  }

  return (
    <div className="justify-center items-center h-full p-2 md:p-4 bg-[#F5F5DC]">
      {/* <div className="bg-white rounded-xl p-3 mb-6 shadow-sm border-l-4 border-blue-600">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Customer Master
        </h2>
        <p className="text-gray-600 text-lg">
          Create and manage customer information for your CRM database
        </p>
      </div> */}
      <div className="w-auto bg-white shadow-lg rounded p-3 md:p-6 mx-auto">
        <h2 className="text-lg md:text-2xl font-semibold ">Customer Master</h2>
        <hr className="my-1 border-gray-200 border-2" />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-2">
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
                  required: "Customer name is required",
                  onBlur: (e) => setValue("customerName", e.target.value.trim())
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
                onBlur={(e) => setValue("address1", e.target.value.trim())}
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
                onBlur={(e) => setValue("address2", e.target.value.trim())}
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
                onBlur={(e) => setValue("country", e.target.value.trim())}
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
                onBlur={(e) => setValue("state", e.target.value.trim())}
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
                onBlur={(e) => setValue("city", e.target.value.trim())}
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
                onBlur={(e) => setValue("pincode", e.target.value.trim())}
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
                onBlur={(e) => setValue("contactPerson", e.target.value.trim())}
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
                  },

                  onBlur: (e) => setValue("email", e.target.value.trim())
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
                {...register("mobile")}
                onBlur={(e) => setValue("mobile", e.target.value.trim())}
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
                onBlur={(e) => setValue("landline", e.target.value.trim())}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                placeholder="Landline"
              />
              {errors.landline && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.landline.message}
                </span>
              )}
            </div>
            <div className="">
              <label className="block text-sm font-medium text-gray-700">
                Type's of Industry
              </label>
              <select
                id="industry"
                {...register("industry")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
              >
                <option value="">Select Industry</option>
                {Industries.map((industry, index) => (
                  <option key={index} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
              {errors.industry && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.industry.message}
                </span>
              )}
            </div>
            <div className="">
              <label className="block text-sm font-medium text-gray-700">
                Partnership
              </label>
              <select
                id="partner"
                {...register("partner")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
              >
                <option value="">Select Partner</option>
                {partner?.map((partnr, index) => (
                  <option key={index} value={partnr._id}>
                    {partnr.partner}
                  </option>
                ))}
              </select>
              {errors.partner && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.partner.message}
                </span>
              )}
            </div>
            <div className="">
              <label className="block text-sm font-medium text-gray-700">
                RegistrationType
              </label>
              <select
                id="registrationType"
                {...register("registrationType", {
                  required: "RegistrationType is required"
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm  focus:outline-none cursor-pointer"
              >
                <option value="">Select RegistrationType</option>
                <option value="unregistered">Unregistered/Consumer</option>
                <option value="regular">Regular</option>
              </select>
              {errors.registrationType && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.registrationType.message}
                </span>
              )}
            </div>
            {registrationType === "regular" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  GSTIN/UIN
                </label>
                <input
                  type="text"
                  {...register("gstNo")}
                  onBlur={(e) => setValue("gstNo", e.target.value.trim())}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                  placeholder="Enter GSTIN (e.g., 22AAAAA0000A1Z5)"
                />
                {errors.gstNo && (
                  <span className="mt-2 text-sm text-red-600">
                    {errors.gstNo.message}
                  </span>
                )}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-lg md:text-2xl font-semibold mt-2 md:mt-0">
              Product Details
            </h1>
            <hr className="my-1 border-gray-300 border-2" />
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mt-2 ">
              <div>
                <label
                  htmlFor="productName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Product
                </label>
                <Controller
                  name="productName"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={productOptions}
                      value={field.value}
                      onChange={(option) => {
                        field.onChange(option)
                        handleProductChange(option)
                      }}
                      placeholder="Select Product"
                    />
                  )}
                />
              </div>
              <div>
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Associated Company
                </label>
                <Controller
                  name="companyName"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={companyOptions}
                      value={field.value}
                      onChange={(option) => {
                        field.onChange(option)
                        handleCompanyChange(option)
                      }}
                      placeholder="Select Company"
                      isDisabled={!selectedProduct}
                    />
                  )}
                />
              </div>
              {/* Branch Display */}
              <div>
                <label
                  htmlFor="branchName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Associated Branch
                </label>
                <Controller
                  name="branchName"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={branchOptions}
                      // value={field.value}
                      onChange={(option) => {
                        field.onChange(option)
                        handleBranchChange(option)
                      }}
                      placeholder="Select Branch"
                      isDisabled={!selectedCompany}
                    />
                  )}
                />
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
                  {...register("licensenumber", {
                    required: selectedProduct
                      ? "License number is required"
                      : false,
                    validate: (value) =>
                      selectedProduct && String(value).trim() === ""
                        ? "License number is required for the selected product"
                        : true
                  })}
                  onBlur={(e) =>
                    setValue("licensenumber", e.target.value.trim())
                  }
                  onChange={(e) => {
                    clearErrors("licensenumber")
                    setTableObject({
                      ...tableObject,
                      licensenumber: e.target.value
                    }) // Update state on change
                  }}
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
                  {...register("softwareTrade")}
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
                  onBlur={(e) => setValue("noofusers", e.target.value.trim())}
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
                  onBlur={(e) => setValue("version", e.target.value.trim())}
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
                  onChange={(e) => {
                    // const dateValue = new Date(e.target.value)
                    setTableObject({
                      ...tableObject,
                      amcstartDate: e.target.value
                    })

                    // Update state on change
                  }}
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
                  onBlur={(e) => setValue("amcAmount", e.target.value.trim())}
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
                    },
                    onBlur: (e) =>
                      setValue("amcDescription", e.target.value.trim())
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
                  onBlur={(e) =>
                    setValue("productAmount", e.target.value.trim())
                  }
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
                    },
                    onBlur: (e) =>
                      setValue(
                        "productamountDescription",
                        e.target.value.trim()
                      )
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
                  onBlur={(e) => setValue("tvuAmount", e.target.value.trim())}
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
                    },
                    onBlur: (e) =>
                      setValue("tvuamountDescription", e.target.value.trim())
                  })}
                  onChange={
                    (e) =>
                      setTableObject({
                        ...tableObject,
                        tvuamountDescription: e.target.value.trim()
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
              {showTable && (
                <>
                  <div>
                    <label
                      htmlFor="isActive"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Status
                    </label>
                    <select
                      id="isActive"
                      {...register("isActive", {
                        required: "Status is Required"
                      })}
                      onChange={(e) => {
                        setTableObject({
                          ...tableObject,
                          isActive: e.target.value
                        }) // Update state on
                        clearErrors("isActive") // ✅ clears the error instantly when a value is selected
                      }}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                    >
                      <option>select a status</option>
                      <option value="Running">Active</option>
                      <option value="Deactive">Deactive</option>
                    </select>
                    {errors.isActive && (
                      <p className="text-red-500">{errors.isActive.message}</p>
                    )}
                  </div>
                  <div>
                    <label
                      id="reasonofStatus"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Reason of Status
                    </label>
                    <textarea
                      id="reasonofStatus"
                      rows="1"
                      {...register("reasonofStatus", {
                        maxLength: {
                          value: 500,
                          message: "Description cannot exceed 500 characters"
                        },
                        onBlur: (e) =>
                          setValue("reasonofStatus", e.target.value.trim())
                      })}
                      onChange={
                        (e) =>
                          setTableObject({
                            ...tableObject,
                            reasonofStatus: e.target.value
                          }) // Update state on change
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                      placeholder="Enter a description..."
                    />
                    {errors.reasonofStatus && (
                      <span className="mt-2 text-sm text-red-600">
                        {errors.reasonofStatus.message}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
            {showTable && (
              <div>
                <div className="mt-6 flex justify-end gap-2">
                  {customer && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleAddNewProduct()}
                        className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
                      >
                        <span className="mr-1">+</span>
                        Add New Product
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      const licenseValue = String(getValues("licensenumber"))

                      if (selectedProduct && !licenseValue.trim()) {
                        // Set error if the license number is missing for a selected product
                        setError("licensenumber", {
                          type: "manual",
                          message:
                            "License number is required for the selected product"
                        })
                        return // Prevent adding to table
                      }

                      handleTableData()
                    }}
                    className="bg-gray-500 text-white py-1 px-2 rounded hover:bg-gray-600"
                  >
                    {editState ? "Update To Table" : "Add To Table"}
                  </button>
                </div>

                <div className="mt-3 w-lg overflow-x-auto">
                  <h3 className="text-lg font-medium text-gray-900">
                    Product Details List
                  </h3>
                  <table className="m-w-full divide-y divide-gray-200 mt-4">
                    <thead className="bg-green-400">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider  text-gray-700">
                          Product Name
                        </th>
                        {loggeduser.role === "Admin" && (
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                            Company Name
                          </th>
                        )}
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                          Branch Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider  text-gray-700">
                          License No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                          No.of Users
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider  text-gray-700">
                          Version
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                          Customer addDate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider  text-gray-700">
                          Amc startDate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider  text-gray-700">
                          Amc endDate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider  text-gray-700">
                          Amc amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider  text-gray-700">
                          License expiry
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider  text-gray-700">
                          Product Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider  text-gray-700">
                          Tvu expiry
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider  text-gray-700">
                          Tvu amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider  text-gray-700">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider  text-gray-700">
                          Edit
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider  text-gray-700">
                          Delete
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                      {tableData && tableData.length > 0 ? (
                        tableData.map((product, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 text-sm text-gray-700 text-nowrap">
                              {product?.productName}
                            </td>
                            {loggeduser.role === "Admin" && (
                              <td className="px-6 py-4 text-sm text-gray-700 ">
                                {product?.companyName}
                              </td>
                            )}
                            <td className="px-6 py-4 text-sm text-gray-700 ">
                              {product?.branchName}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700 ">
                              {product?.licensenumber}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700 ">
                              {product?.noofusers}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              {product?.version}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700 text-nowrap">
                              {product?.customerAddDate}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700 text-nowrap">
                              {product?.amcstartDate}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700 text-nowrap">
                              {product?.amcendDate}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              {product?.amcAmount}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700 text-nowrap">
                              {product?.licenseExpiryDate}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700 ">
                              {product?.productAmount}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700 text-nowrap">
                              {product?.tvuexpiryDate}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              {product?.tvuAmount}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              {product?.isActive}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              <button
                                type="button"
                                className="text-green-600 hover:text-green-900 mr-2"
                              >
                                <FaEdit
                                  onClick={() => handleEdit(product.product_id)}
                                />
                              </button>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700 ">
                              <button
                                type="button"
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <FaTrash onClick={() => handleDelete(index)} />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="16" className="text-center py-4">
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* <table className="bg-green-300 m-w-full divide-y divide-gray-200 mt-4">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product Name
                        </th>
                        {loggeduser.role === "Admin" && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Company Name
                          </th>
                        )}

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
                          Status
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
                      {tableData && tableData.length > 0
                        ? tableData.map((product, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {product?.productName}
                              </td>
                              {loggeduser.role === "Admin" && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {product?.companyName}
                                </td>
                              )}

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
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {product?.tvuAmount}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {product?.isActive}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {" "}
                                <button
                                  type="button"
                                  className="text-green-600 hover:text-green-900 mr-2" // Adjust styles as needed
                                  // onClick={() => handleEdit(index)}
                                >
                                  <FaEdit
                                    onClick={() =>
                                      handleEdit(product.product_id)
                                    }
                                  />
                                </button>
                              </td>

                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  type="button"
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <FaTrash
                                    onClick={() => handleDelete(index)}
                                  />
                                </button>

                              </td>
                            </tr>
                          ))
                        : ""}
                    </tbody>
                  </table> */}
                </div>
              </div>
            )}

            {/* tabledata */}

            {/* Submit Button */}
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() =>
                  navigatebackto ? navigate(navigatebackto) : navigate(-1)
                }
                type="button"
                className="flex items-center justify-center bg-red-500 text-white py-2 px-4 rounded shadow-xl hover:bg-red-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`flex items-center justify-center bg-green-500 text-white py-2 px-4 rounded shadow-xl hover:bg-green-600 ${
                  isSubmitting && "bg-green-400 cursor-not-allowed"
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Submitting...
                  </span>
                ) : process === "Registration" ? (
                  "Save"
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CustomerAdd
