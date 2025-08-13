import { useEffect, useState } from "react"
import Select from "react-select"

import { useForm, Controller } from "react-hook-form"
import UseFetch from "../../hooks/useFetch"
import useDebounce from "../../hooks/useDebounce"
import { toast } from "react-toastify"
import { FaEdit, FaTrash } from "react-icons/fa"
const CustomerAdd = ({
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
  const [loggeduserBranch, setLoggeduserBranches] = useState(null)
  const [companyOptions, setCompanyOptions] = useState([])
  const [branchOptions, setBranchOptions] = useState([])
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
    isActive: "",
    industry: "",
    reasonofStatus: ""
  })
  //now created
  const [isChecking, setIsChecking] = useState(false)
  const { data: productData, error: productError } = UseFetch(
    loggeduserBranch &&
      `/product/getallProducts?branchselected=${encodeURIComponent(
        JSON.stringify(loggeduserBranch)
      )}`
  )
  const { data: licensenumber, error: licensenumberError } = UseFetch(
    "/customer/getLicensenumber"
  )
  const { data: partners } = UseFetch("/customer/getallpartners")
  const { data: allcompanyBranches } = UseFetch("/branch/getBranch")
  useEffect(() => {
    if (allcompanyBranches && allcompanyBranches.length) {
      const userData = localStorage.getItem("user")
      const user = JSON.parse(userData)
      setloggedUser(user)
      if (user.role === "Admin") {
        const branches = allcompanyBranches.map((branch) => branch._id)
        setLoggeduserBranches(branches)
      } else {
        const branches = user.selected.map((branch) => branch.branch_id)
        setLoggeduserBranches(branches)
      }
    }
  }, [allcompanyBranches])
  useEffect(() => {
    if (productData) {
      setTableObject({
        ...tableObject,
        isActive: "Running"
      })
      setPartner(partners)
      setProductOptions(
        productData.map((product) => ({
          label: product.productName,
          value: product._id
        }))
      )

      if (customer) {
        if (customer.selected.length > 0) {
          setShowTable(true)
        }
        reset({
          customerName: customer.customerName,
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
          productName: customer?.selected[0]?.product_id
            ? {
                label: customer?.selected[0]?.productName,
                value: customer?.selected[0]?.product_id
              }
            : null,
          companyName: customer?.selected[0]?.companyName
            ? {
                label: customer?.selected[0]?.companyName,
                value: customer?.selected[0]?.company_id
              }
            : null,
          branchName: customer?.selected[0]?.branch_id
            ? {
                label: customer?.selected[0]?.branchName,
                value: customer?.selected[0]?.branch_id
              }
            : null,
          licensenumber: customer?.selected[0]?.licensenumber,
          noofusers: customer?.selected[0]?.noofusers,
          version: customer?.selected[0]?.version,
          customerAddDate: customer?.selected[0]?.customerAddDate,
          amcstartDate: customer?.selected[0]?.amcstartDate,
          amcendDate: customer?.selected[0]?.amcendDate,
          amcAmount: customer?.selected[0]?.amcAmount,
          licenseExpiryDate: customer?.selected[0]?.licenseExpiryDate,
          productAmount: customer?.selected[0]?.productAmount,
          productamountDescription:
            customer?.selected[0]?.productamountDescription,
          tvuexpiryDate: customer?.selected[0]?.tvuexpiryDate,
          tvuAmount: customer?.selected[0]?.tvuAmount,
          tvuamountDescription: customer?.selected[0]?.tvuamountDescription,
          isActive: customer?.selected[0]?.isActive,
          reasonofStatus: customer?.selected[0]?.reasonofStatus
        })
        if (Array.isArray(customer.selected) && customer.selected.length > 0) {
          setTableObject({
            company_id: customer?.selected[0]?.company_id || "",
            companyName: customer?.selected[0]?.companyName || "",
            branch_id: customer?.selected[0]?.branch_id || "",
            branchName: customer?.selected[0]?.branchName || "",
            product_id: customer?.selected[0]?.product_id || "",
            productName: customer?.selected[0]?.productName || "",
            licensenumber: customer?.selected[0]?.licensenumber || "",
            noofusers: customer?.selected[0]?.noofusers || "",
            version: customer?.selected[0]?.version || "",
            customerAddDate: customer?.selected[0]?.customerAddDate || "",
            amcstartDate: customer?.selected[0]?.amcstartDate || "",
            amcendDate: customer?.selected[0]?.amcendDate || "",
            amcAmount: customer?.selected[0]?.amcAmount || "",
            amcDescription: customer?.selected[0]?.amcDescription || "",
            licenseExpiryDate: customer?.selected[0]?.licenseExpiryDate || "",
            productAmount: customer?.selected[0]?.productAmount || "",
            productamountDescription:
              customer?.selected[0]?.productamountDescription || "",
            tvuexpiryDate: customer?.selected[0]?.tvuexpiryDate || "",
            tvuAmount: customer?.selected[0]?.tvuAmount || "",
            tvuamountDescription:
              customer?.selected[0]?.tvuamountDescription || "",
            isActive: customer?.selected[0]?.isActive || "",
            reasonofStatus: customer?.selected[0]?.reasonofStatus || ""
          })

          setTableData([
            {
              company_id: customer?.selected[0]?.company_id || "",
              companyName: customer?.selected[0]?.companyName || "",
              branch_id: customer?.selected[0]?.branch_id || "",
              branchName: customer?.selected[0]?.branchName || "",
              product_id: customer?.selected[0]?.product_id || "",
              productName: customer?.selected[0]?.productName || "",
              licensenumber: customer?.selected[0]?.licensenumber || "",
              noofusers: customer?.selected[0]?.noofusers || "",
              version: customer?.selected[0]?.version || "",
              customerAddDate: customer?.selected[0]?.customerAddDate || "",
              amcstartDate: customer?.selected[0]?.amcstartDate || "",
              amcendDate: customer?.selected[0]?.amcendDate || "",
              amcAmount: customer?.selected[0]?.amcAmount || "",
              amcDescription: customer?.selected[0]?.amcDescription || "",
              licenseExpiryDate: customer?.selected[0]?.licenseExpiryDate || "",
              productAmount: customer?.selected[0]?.productAmount || "",
              productamountDescription:
                customer?.selected[0]?.productamountDescription || "",
              tvuexpiryDate: customer?.selected[0]?.tvuexpiryDate || "",
              tvuAmount: customer?.selected[0]?.tvuAmount || "",
              tvuamountDescription:
                customer?.selected[0]?.tvuamountDescription || "",
              isActive: customer?.selected[0]?.isActive || "",
              industry: customer?.selected[0]?.industry || "",
              reasonofStatus: customer?.selected[0]?.reasonofStatus || ""
            }
          ])
          // setTableData((prev) => [...prev, tableObject])
          if (customer?.selected[0]?.productName)
            handleProductChange(
              {
                label: customer?.selected[0]?.productName,
                value: customer?.selected[0]?.product_id
              },
              true
            )
          if (customer?.selected[0]?.companyName)
            handleCompanyChange(
              {
                label: customer?.selected[0]?.companyName,
                value: customer?.selected[0]?.company_id
              },
              true
            )
        }
      }
    }

    // Directly set products to productData
  }, [productData, reset, customer, partners])

  // First effect: handles product + sets value
  useEffect(() => {
    if (productData) {
      setTableObject((prev) => ({
        ...prev,
        isActive: "Running"
      }))
      setPartner(partners)
      setProductOptions(
        productData.map((product) => ({
          label: product.productName,
          value: product._id
        }))
      )

      if (customer?.selected?.length > 0) {
        const selectedCustomer = customer.selected[0]
        setShowTable(true)

        if (selectedCustomer?.productName) {
          handleProductChange(
            {
              label: selectedCustomer.productName,
              value: selectedCustomer.product_id
            },
            true
          )
        }
      }
    }
  }, [productData, reset, customer, partners])

  // Second effect: run company handler after product is set
  useEffect(() => {
    const selectedCustomer = customer?.selected?.[0]
    const selectedProduct = watch("productName")

    if (selectedCustomer?.companyName && selectedProduct?.value) {
      handleCompanyChange(
        {
          label: selectedCustomer.companyName,
          value: selectedCustomer.company_id
        },
        true,
        selectedCustomer
      )
    }
  }, [watch("productName")])

  const handleCompanyChange = (selectedOption, onEdit = false) => {
    setValue("companyName", selectedOption)
    setTableObject((prev) => ({
      ...prev,
      company_id: selectedOption.value,
      companyName: selectedOption.label
    }))

    const selectedProductData = productData.find(
      (product) => product._id === selectedProduct?.value
    )
    const selectedCompanyData = selectedProductData?.selected.filter(
      (company) => company.company_id === selectedOption?.value
    )

    if (selectedCompanyData) {
      setBranchOptions(
        selectedCompanyData.map((branch) => ({
          label: branch.branchName,
          value: branch.branch_id
        }))
      )
      if (!onEdit) {
        setValue("branchName", null)
      }
    }
  }

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
  const handleProductChange = (selectedOption, onEdit = false) => {
    setValue("productName", selectedOption)
    setShowTable(true)
    setTableObject((prev) => ({
      ...prev,
      product_id: selectedOption.value,
      productName: selectedOption.label
    }))

    const selectedProductData = productData.find(
      (product) => product._id === selectedOption?.value
    )

    if (selectedProductData) {
      const companyMap = new Set()
      const uniqueCompanyOptions = selectedProductData.selected.reduce(
        (acc, company) => {
          // If the company has not been added yet, add it to the accumulator
          if (!companyMap.has(company.companyName)) {
            companyMap.add(company.companyName) // Mark this company as added
            acc.push({
              label: company.companyName,
              value: company.company_id
            })
          }
          return acc
        },
        []
      )
      setCompanyOptions(uniqueCompanyOptions)

      if (!onEdit) {
        setValue("company", null)
        setBranchOptions([])
      }
    }
  }

  ///now created
  const emailDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"]

  const validateEmailDomain = (email) => {
    const domain = email.split("@")[1]
    return emailDomains.includes(domain) || "Invalid email domain"
  }
  const handleBranchChange = (selectedOption) => {
    setTableObject((prev) => ({
      ...prev,
      branch_id: selectedOption.value,
      branchName: selectedOption.label
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
            <h1 className="text-2xl font-semibold mb-6">Product Details</h1>
            <div className="  grid grid-cols-1 sm:grid-cols-4 gap-6 m-5">
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

                {/* <select
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
                </select> */}
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

                {/* <select
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
                </select> */}
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
                      onChange={
                        (e) =>
                          setTableObject({
                            ...tableObject,
                            isActive: e.target.value
                          }) // Update state on change
                      }
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
                <div className="mt-6">
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

                                {/* Add delete button */}
                              </td>
                            </tr>
                          ))
                        : ""}
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
                className={`flex items-center justify-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ${
                  isSubmitting && "bg-blue-400 cursor-not-allowed"
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
