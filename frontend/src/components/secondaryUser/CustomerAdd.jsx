// import { useEffect, useState } from "react"
// import { useNavigate } from "react-router-dom"
// import Select from "react-select"
// import { getLocalStorageItem } from "../../helper/localstorage"
// import { useSelector } from "react-redux"
// import { useForm, Controller } from "react-hook-form"
// import UseFetch from "../../hooks/useFetch"
// import useDebounce from "../../hooks/useDebounce"
// import { toast } from "react-toastify"
// import { FaEdit, FaTrash } from "react-icons/fa"
// const CustomerAdd = ({
//   navigatebackto,
//   process,
//   handleCustomerData,
//   handleEditedData,
//   customer
// }) => {
// console.log(customer)
//   const {
//     register,
//     handleSubmit,
//     reset,
//     control,
//     setError,
//     clearErrors,
//     getValues,
//     setValue,
//     watch,

//     formState: { errors, isSubmitting }
//   } = useForm({
//     defaultValues: {
//       productName: null,
//       companyName: null,
//       branchName: null,
//       customerName: "",
//       address1: "",
//       address2: "",
//       country: "",
//       state: "",
//       city: "",
//       pincode: "",
//       email: "",
//       mobile: "",
//       landline: "",
//       licensenumber: "",
//       noofusers: "",
//       version: "",
//       customerAddDate: "",
//       amcstartDate: "",
//       amcendDate: "",
//       amcAmount: "",
//       licenseExpiryDate: "",
//       productAmount: "",
//       productamountDescription: "",
//       tvuexpiryDate: "",
//       tvuAmount: "",
//       tvuamountDescription: "",
//       isActive: "Running",
//       reasonofStatus: ""
//     }
//   })

//   // const [selectedBranch, setSelectedBranch] = useState(false)
//   const [productOptions, setProductOptions] = useState([])
//   const [loggeduser, setloggedUser] = useState(null)
//   // const [loggeduserBranch, setLoggeduserBranches] = useState(null)
//   const [companyOptions, setCompanyOptions] = useState([])
//   const [branchOptions, setBranchOptions] = useState([])
//   const [selectedproductid, setselectedproductId] = useState(null)
//   const [selectedCompanyId, setSelectedCompanyId] = useState(null)
//   const [selectedbranchId, setSelectedBranchId] = useState(null)
//   const [showTable, setShowTable] = useState(false)
//   const [tableData, setTableData] = useState([])
//   const [editState, seteditState] = useState(false)
//   const [partner, setPartner] = useState([])
//   const [editIndex, setEditIndex] = useState(null)
//   const [licenseAvailable, setLicenseAvailable] = useState(true)
//   const [license, setLicense] = useState([])
//   const selectedProduct = watch("productName")
//   const selectedCompany = watch("companyName")
//   const [isLicense, setlicenseExist] = useState([])
//   const registrationType = watch("registrationType")
//   const [tableObject, setTableObject] = useState({
//     company_id: "",
//     companyName: "",
//     branch_id: "",
//     branchName: "",
//     product_id: "",
//     productName: "",
//     licensenumber: "",
//     noofusers: "",
//     version: "",
//     customerAddDate: "",
//     amcstartDate: "",
//     amcendDate: "",
//     amcAmount: "",
//     amcDescription: "",
//     licenseExpiryDate: "",
//     productAmount: "",
//     productamountDescription: "",
//     tvuexpiryDate: "",
//     tvuAmount: "",
//     tvuamountDescription: "",
//     isActive: "Running",
//     reasonofStatus: ""
//   })
//   //now created

//   const { data: licensenumber } = UseFetch("/customer/getLicensenumber")
//   const { data: partners } = UseFetch("/customer/getallpartners")
//   const { data: allcompanyBranches } = UseFetch("/branch/getBranch")
// const loggeduserBranch = useSelector(
//   (state) => state.companyBranch.loggeduserbranches
// )

// const { data: productData, error: productError } = UseFetch(
//   loggeduserBranch &&
//     `/product/getallProducts?branchselected=${encodeURIComponent(
//       JSON.stringify(loggeduserBranch)
//     )}`
// )
// console.log(productData)
//   const navigate = useNavigate()
//   useEffect(() => {
//     if (allcompanyBranches && allcompanyBranches.length) {
//       const user = getLocalStorageItem("user")
//       setloggedUser(user)
//     }
//   }, [allcompanyBranches])

//   useEffect(() => {
//     if (customer && partner && partner.length > 0) {
//       setShowTable(true)
//       seteditState(true)
//       setEditIndex(customer.index ?? 0)
//       // Set tableObject using the selected index
//       const selectedIndex = customer.index ?? 0
//       const selectedItem = customer.selected?.[selectedIndex]

//       // Reset the form
//       reset({
//         customerName: customer?.customerName,
//         address1: customer.address1,
//         address2: customer.address2,
//         country: customer.country,
//         state: customer.state,
//         city: customer.city,
//         pincode: customer.pincode,
//         contactPerson: customer.contactPerson,
//         email: customer.email,
//         mobile: customer.mobile,
//         landline: customer.landline,
//         partner: customer.partner,
//         registrationType: customer.registrationType,

//         licensenumber: selectedItem?.licensenumber,
//         softwareTrade: selectedItem?.softwareTrade,
//         noofusers: selectedItem?.noofusers,
//         version: selectedItem?.version,
//         customerAddDate: selectedItem?.customerAddDate,
//         amcstartDate: selectedItem?.amcstartDate,
//         amcendDate: selectedItem?.amcendDate,
//         amcAmount: selectedItem?.amcAmount,
//         licenseExpiryDate: selectedItem?.licenseExpiryDate,
//         productAmount: selectedItem?.productAmount,
//         productamountDescription: selectedItem?.productamountDescription,
//         tvuexpiryDate: selectedItem?.tvuexpiryDate,
//         tvuAmount: selectedItem?.tvuAmount,
//         tvuamountDescription: selectedItem?.tvuamountDescription,
//         isActive: selectedItem?.isActive,
//         reasonofStatus: selectedItem?.reasonofStatus
//       })

//       if (selectedItem) {
//         setTableObject({
//           company_id: selectedItem.company_id || "",
//           companyName: selectedItem.companyName || "",
//           branch_id: selectedItem.branch_id || "",
//           branchName: selectedItem.branchName || "",
//           licensenumber: selectedItem.licensenumber || "",
//           noofusers: selectedItem.noofusers || "",
//           version: selectedItem.version || "",
//           customerAddDate: selectedItem.customerAddDate || "",
//           amcstartDate: selectedItem.amcstartDate || "",
//           amcendDate: selectedItem.amcendDate || "",
//           amcAmount: selectedItem.amcAmount || "",
//           amcDescription: selectedItem.amcDescription || "",
//           licenseExpiryDate: selectedItem.licenseExpiryDate || "",
//           productAmount: selectedItem.productAmount || "",
//           productamountDescription: selectedItem.productamountDescription || "",
//           tvuexpiryDate: selectedItem.tvuexpiryDate || "",
//           tvuAmount: selectedItem.tvuAmount || "",
//           tvuamountDescription: selectedItem.tvuamountDescription || "",
//           isActive: selectedItem.isActive || "",
//           reasonofStatus: selectedItem.reasonofStatus || ""
//         })
//       }

//       // Map over customer.selected to setTableData once
//       const tableDataArray = customer.selected.map((sel) => ({
//         company_id: sel.company_id || "",
//         companyName: sel.companyName || "",
//         branch_id: sel.branch_id || "",
//         branchName: sel.branchName || "",
//         product_id: sel.product_id || "",
//         productName: sel.productName || "",
//         licensenumber: sel.licensenumber || "",
//         noofusers: sel.noofusers || "",
//         version: sel.version || "",
//         customerAddDate: sel.customerAddDate || "",
//         amcstartDate: sel.amcstartDate || "",
//         amcendDate: sel.amcendDate || "",
//         amcAmount: sel.amcAmount || "",
//         amcDescription: sel.amcDescription || "",
//         licenseExpiryDate: sel.licenseExpiryDate || "",
//         productAmount: sel.productAmount || "",
//         productamountDescription: sel.productamountDescription || "",
//         tvuexpiryDate: sel.tvuexpiryDate || "",
//         tvuAmount: sel.tvuAmount || "",
//         tvuamountDescription: sel.tvuamountDescription || "",
//         isActive: sel.isActive || "",
//         reasonofStatus: sel.reasonofStatus || ""
//       }))

//       setTableData(tableDataArray)
//     }
//   }, [productData, reset, customer, partner])
//   useEffect(() => {
//     if (tableData && tableData.length > 0 && tableObject && customer) {
//       if (tableObject.product_id) {
//         return
//       }
//       const selectedIndex = customer.index ?? 0
//       const selectedItem = customer.selected?.[selectedIndex]
//       const editedproductoption = {
//         label: selectedItem.productName,
//         value: selectedItem.product_id
//       }
//       handleProductChange(editedproductoption)
//     }
//   }, [tableData, tableObject])
//   // First effect: handles product + sets value
//   useEffect(() => {
//     if (productData) {
//       setPartner(partners)
//       setProductOptions(
//         productData.map((product) => ({
//           label: product.productName,
//           value: product._id
//         }))
//       )
//     }
//   }, [productData, reset, customer, partners])
//   // Second effect: run company handler after product is set

//   useEffect(() => {
//     if (licensenumber) {
//       setLicense(licensenumber)
//     }
//   }, [licensenumber])

//   const debouncedLicenseNo = useDebounce(tableObject.licensenumber, 1000)
//   useEffect(() => {
//     // If there's a debounced license number, check its uniqueness

//     if (debouncedLicenseNo.length > 0) {
//       debouncedLicenseNo.trim()

//       if (
//         license &&
//         license.length > 0 &&
//         isLicense &&
//         isLicense.length === 0
//       ) {
//         const checkLicense = license.find((item) => {
//           if (!item || item.licensenumber === undefined) {
//             return false // Skips this and moves to the next item
//           }
//           return item?.licensenumber.toString() === debouncedLicenseNo
//         })

//         if (checkLicense) {
//           setLicenseAvailable(false)

//           toast.error("license number already exits")
//         } else {
//           setLicenseAvailable(true)

//           toast.success("license number is available")
//         }
//       } else {
//         if (isLicense && isLicense.length > 0) {
//           const checklicense = isLicense.find(
//             (item) => item === debouncedLicenseNo
//           )
//           const licensecheck = license.find(
//             (item) => item?.licensenumber.toString() === debouncedLicenseNo
//           )
//           if (checklicense || licensecheck) {
//             setLicenseAvailable(false)

//             toast.error("license number is already exist")
//           } else {
//             setLicenseAvailable(true)

//             toast.success("license number is available")
//           }
//         } else {
//           setLicenseAvailable(true)
//           toast.success("license number is available")
//         }
//       }
//     }

//     // checkLicenseNumber(debouncedLicenseNo)
//   }, [debouncedLicenseNo])

//   const handleTableData = () => {
//     if (editIndex !== null) {
//       // If in edit mode, update the existing item
//       setTableData((prev) => {
//         const newData = [...prev]
//         newData[editIndex] = tableObject // Update the specific item
//         return newData
//       })
//       setlicenseExist((prevState) => {
//         const updatedLicenses = [...prevState]
//         updatedLicenses[editIndex] = tableObject.licensenumber // Update the license at the editIndex
//         return updatedLicenses
//       })

//       setEditIndex(null)
//       seteditState(false) // Reset the edit index
//     } else {
//       // Otherwise, add a new item

//       const istableobjectInclude = tableData.some(
//         (item) => JSON.stringify(item) === JSON.stringify(tableObject)
//       )

//       const islicenseInclude = tableData.some(
//         (item) => item.licensenumber === tableObject.licensenumber
//       )

//       if (istableobjectInclude) {
//         toast.error("already added")
//         return
//       }
//       if (islicenseInclude) {
//         toast.error("licensenumber is already exist")
//         return
//       }
//       setlicenseExist((prevState) => [...prevState, tableObject.licensenumber])

//       setTableData((prev) => [...prev, tableObject])
//     }
//   }
//   useEffect(() => {
//     if (selectedproductid) {
//       const options = getCompaniesForProduct(selectedproductid) // mapping function
//       setCompanyOptions(options)
//       if (options.length > 0) {
//         const firstCompany = options[0]
//         setSelectedCompanyId(firstCompany) // auto select company

//         if (branchOptions.length > 0) {
//           setSelectedBranchId(branchOptions[0]?.value) // auto select branch
//         } else {
//           setSelectedBranchId(null)
//         }
//       } else {
//         setSelectedCompanyId(null)
//         setBranchOptions([])
//         setSelectedBranchId(null)
//       }
//     } else {
//       setCompanyOptions([])
//       setSelectedCompanyId(null)
//       setBranchOptions([])
//       setSelectedBranchId(null)
//     }
//   }, [selectedproductid])
//   useEffect(() => {
//     if (selectedCompanyId) {
//       setValue("companyName", selectedCompanyId)
//       setTableObject((prev) => ({
//         ...prev,
//         company_id: selectedCompanyId.value,
//         companyName: selectedCompanyId.label
//       }))
//       // also set branches for this company
//       const branchOptions = getBranchesForCompany(
//         selectedproductid,
//         selectedCompanyId.value
//       )
//       setBranchOptions(branchOptions)
//       setSelectedBranchId(branchOptions[0])
//     }
//   }, [selectedCompanyId])
//   useEffect(() => {
//     if (selectedbranchId) {
//       setValue("branchName", selectedbranchId)
//       setTableObject((prev) => ({
//         ...prev,
//         branch_id: selectedbranchId.value,
//         branchName: selectedbranchId.label
//       }))
//     }
//   }, [selectedbranchId])

//   useEffect(() => {
//     if (productError) {
//       toast.error(
//         productError?.response?.data?.message || "Something went wrong!"
//       )
//     }
//   }, [productError])

//   const softwareTrades = [
//     "Agriculture",
//     "Business Services",
//     "Computer Hardware & Software",
//     "Electronics & Electrical Supplies",
//     "FMCG-Fast Moving Consumable Goods",
//     "Garment,Fashion & Apparel",
//     "Health & Beauty",
//     "Industrial Supplies",
//     "Jewelry & Gemstones",
//     "Mobile & Accessories",
//     "Pharmaceutical & Chemicals",
//     "Textiles & Chemicals",
//     "Textiles & Fabrics",
//     "Others",
//     "Restaurant",
//     "Food And Beverage",
//     "Accounts & Chartered Account",
//     "Stationery",
//     "Printing & Publishing",
//     "Hotel",
//     "Pipes",
//     "Tubes & Fittings"
//     // Add more trades as needed
//   ]

//   const Industries = [
//     "Whole sailor/Distributors",
//     "Retailer",
//     "Manufacturer",
//     "Service",
//     "Works Contact"
//   ]

//   const handleDelete = (id) => {
//     const filtereddData = tableData.filter((product, index) => {
//       return index !== id
//     })

//     const updatedIslicense = isLicense.filter((license, index) => {
//       return index !== id
//     })

//     setTableData(filtereddData)
//     setlicenseExist(updatedIslicense)
//     if (filtereddData && filtereddData.length === 0) {
//       setShowTable(false)
//     }

//     reset()
//   }

//   const handleEdit = (id) => {
//     seteditState(true) // Close the edit state (or handle according to your logic)

//     const itemToEdit = tableData.find((item) => item.product_id === id) // Find the product to edit

//     if (itemToEdit) {
//       // Set form values using setValue
//       Object.entries(itemToEdit).forEach(([key, value]) => setValue(key, value))
//       // Set React Select fields (assuming product, company, and branch are React Select fields)
//       if (itemToEdit.product_id) {
//         setValue("productName", {
//           value: itemToEdit.product_id,
//           label: itemToEdit.productName
//         })
//       }
//       if (itemToEdit.company_id) {
//         setValue("companyName", {
//           value: itemToEdit.company_id,
//           label: itemToEdit.companyName
//         })
//       }
//       if (itemToEdit.branch_id) {
//         setValue("branchName", {
//           value: itemToEdit.branch_id,
//           label: itemToEdit.branchName
//         })
//       }

//       // Find index of the item being edited and set it to the state
//       const index = tableData.findIndex((item) => item.product_id === id)

//       setEditIndex(index)
//     }
//   }
//   const handleProductChange = (selectedOption) => {
//     setValue("productName", selectedOption)
//     setselectedproductId(selectedOption.value)
//     setShowTable(true)
//     setTableObject((prev) => ({
//       ...prev,
//       product_id: selectedOption.value,
//       productName: selectedOption.label
//     }))
//   }

//   const handleCompanyChange = (selectedCompanyOption) => {
//     setSelectedCompanyId(selectedCompanyOption.value)
//   }
//   const handleBranchChange = (selectedBranchOption) => {
//     setValue("branchName", selectedBranchOption)
//     setTableObject((prev) => ({
//       ...prev,
//       branch_id: selectedBranchOption.value,
//       branchName: selectedBranchOption.label
//     }))
//   }
//   const emailDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"]

//   const validateEmailDomain = (email) => {
//     const domain = email.split("@")[1]
//     return emailDomains.includes(domain) || "Invalid email domain"
//   }
//   const handleAddNewProduct = () => {
//     setTableObject({
//       company_id: "",
//       companyName: "",
//       branch_id: "",
//       branchName: "",
//       product_id: "",
//       productName: "",
//       licensenumber: "",
//       noofusers: "",
//       version: "",
//       customerAddDate: "",
//       amcstartDate: "",
//       amcendDate: "",
//       amcAmount: "",
//       amcDescription: "",
//       licenseExpiryDate: "",
//       productAmount: "",
//       productamountDescription: "",
//       tvuexpiryDate: "",
//       tvuAmount: "",
//       tvuamountDescription: "",
//       isActive: "Running",
//       reasonofStatus: ""
//     })
//     seteditState(false)
//     setEditIndex(null)
//     reset({
//       productName: "",
//       companyName: "",
//       branchName: "",
//       licensenumber: "",
//       softwareTrade: "",
//       noofusers: "",
//       version: "",
//       customerAddDate: "",
//       amcstartDate: "",
//       amcendDate: "",
//       amcAmount: "",
//       licenseExpiryDate: "",
//       productAmount: "",
//       productamountDescription: "",
//       tvuexpiryDate: "",
//       tvuAmount: "",
//       tvuamountDescription: "",

//       reasonofStatus: ""
//     })
//   }
//   const getCompaniesForProduct = (productId) => {
//     const product = productData.find((item) => item._id === productId)
//     if (!product) return []

//     const seen = new Set()
//     return product.selected.reduce((acc, company) => {
//       if (!seen.has(company.company_id)) {
//         seen.add(company.company_id)
//         acc.push({
//           label: company.companyName,
//           value: company.company_id
//         })
//       }
//       return acc
//     }, [])
//   }

//   const getBranchesForCompany = (productId, companyId) => {
//     const product = productData.find((item) => item._id === productId)
//     if (!product) return []

//     return product.selected
//       .filter((c) => c.company_id === companyId)
//       .map((branch) => ({
//         label: branch.branchName,
//         value: branch.branch_id
//       }))
//   }

//   const onSubmit = async (data) => {
//     try {
//       if (process === "Registration") {
//         await handleCustomerData(data, tableData)
//         reset()
//       } else if (process === "edit") {
//         if (tableData.length === 0) {
//           setTableData((prev) => [...prev, tableObject])
//         }

//         await handleEditedData(data, tableData, customer.index)
//       }
//     } catch (error) {
//       toast.error("Failed to save customer!")
//     }
//   }

//   return (
//     <div className="justify-center items-center h-full p-2 md:p-4 bg-[#F5F5DC]">
//       {/* <div className="bg-white rounded-xl p-3 mb-6 shadow-sm border-l-4 border-blue-600">
//         <h2 className="text-3xl font-bold text-gray-900 mb-2">
//           Customer Master
//         </h2>
//         <p className="text-gray-600 text-lg">
//           Create and manage customer information for your CRM database
//         </p>
//       </div> */}
//       <div className="w-auto bg-white shadow-lg rounded p-3 md:p-6 mx-auto">
//         <h2 className="text-lg md:text-2xl font-semibold ">Customer Master</h2>
//         <hr className="my-1 border-gray-200 border-2" />
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-2">
//             {/* Product Select Dropdown */}

//             {/* Customer Name */}
//             <div>
//               <label
//                 htmlFor="customerName"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Customer Name
//               </label>
//               <input
//                 type="text"
//                 id="customerName"
//                 {...register("customerName", {
//                   required: "Customer name is required",
//                   onBlur: (e) => setValue("customerName", e.target.value.trim())
//                 })}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none"
//                 placeholder="Enter customer name"
//               />
//               {errors.customerName && (
//                 <span className="mt-2 text-sm text-red-600">
//                   {errors.customerName.message}
//                 </span>
//               )}
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Address 1
//               </label>
//               <input
//                 type="text"
//                 {...register("address1")}
//                 onBlur={(e) => setValue("address1", e.target.value.trim())}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none focus:border-gray-500"
//                 placeholder="Address"
//               />
//               {errors.address1 && (
//                 <span className="mt-2 text-sm text-red-600">
//                   {errors.address1.message}
//                 </span>
//               )}
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Address 2
//               </label>
//               <input
//                 type="text"
//                 {...register("address2")}
//                 onBlur={(e) => setValue("address2", e.target.value.trim())}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none focus:border-gray-500"
//                 placeholder="Address"
//               />
//               {errors.address2 && (
//                 <span className="mt-2 text-sm text-red-600">
//                   {errors.address2.message}
//                 </span>
//               )}
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Country
//               </label>
//               <input
//                 type="text"
//                 {...register("country")}
//                 onBlur={(e) => setValue("country", e.target.value.trim())}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
//                 placeholder="Country"
//               />
//               {errors.country && (
//                 <span className="mt-2 text-sm text-red-600">
//                   {errors.country.message}
//                 </span>
//               )}
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 State
//               </label>
//               <input
//                 type="text"
//                 {...register("state")}
//                 onBlur={(e) => setValue("state", e.target.value.trim())}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
//                 placeholder="State"
//               />
//               {errors.state && (
//                 <span className="mt-2 text-sm text-red-600">
//                   {errors.state.message}
//                 </span>
//               )}
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 City
//               </label>
//               <input
//                 type="text"
//                 {...register("city")}
//                 onBlur={(e) => setValue("city", e.target.value.trim())}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
//                 placeholder="City"
//               />
//               {errors.city && (
//                 <span className="mt-2 text-sm text-red-600">
//                   {errors.city.message}
//                 </span>
//               )}
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Pincode
//               </label>
//               <input
//                 type="number"
//                 {...register("pincode")}
//                 onBlur={(e) => setValue("pincode", e.target.value.trim())}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
//                 placeholder="Pincode"
//               />
//               {errors.pincode && (
//                 <span className="mt-2 text-sm text-red-600">
//                   {errors.pincode.message}
//                 </span>
//               )}
//             </div>

//             <div>
//               <label
//                 htmlFor="contactPerson"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Contact Person
//               </label>
//               <input
//                 type="text"
//                 {...register("contactPerson")}
//                 onBlur={(e) => setValue("contactPerson", e.target.value.trim())}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
//                 placeholder="Contactperson"
//               />
//               {errors.contactPerson && (
//                 <span className="mt-2 text-sm text-red-600">
//                   {errors.contactPerson.message}
//                 </span>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 {...register("email", {
//                   required: "Email is required",
//                   pattern: {
//                     value: /\S+@\S+\.\S+/,
//                     message: "Invalid email address"
//                   },

//                   onBlur: (e) => setValue("email", e.target.value.trim())
//                 })}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
//                 placeholder="Email"
//               />
//               {errors.email && (
//                 <span className="mt-2 text-sm text-red-600">
//                   {errors.email.message}
//                 </span>
//               )}
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Mobile
//               </label>
//               <input
//                 type="tel"
//                 {...register("mobile")}
//                 onBlur={(e) => setValue("mobile", e.target.value.trim())}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
//                 placeholder="Phone"
//               />
//               {errors.mobile && (
//                 <span className="mt-2 text-sm text-red-600">
//                   {errors.mobile.message}
//                 </span>
//               )}
//             </div>
//             <div className="">
//               <label className="block text-sm font-medium text-gray-700">
//                 Landline No
//               </label>
//               <input
//                 type="tel"
//                 {...register("landline")}
//                 onBlur={(e) => setValue("landline", e.target.value.trim())}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
//                 placeholder="Landline"
//               />
//               {errors.landline && (
//                 <span className="mt-2 text-sm text-red-600">
//                   {errors.landline.message}
//                 </span>
//               )}
//             </div>
//             {/* <div className="">
//               <label className="block text-sm font-medium text-gray-700">
//                 Type's of Industry
//               </label>
//               <select
//                 id="industry"
//                 {...register("industry")}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
//               >
//                 <option value="">Select Industry</option>
//                 {Industries.map((industry, index) => (
//                   <option key={index} value={industry}>
//                     {industry}
//                   </option>
//                 ))}
//               </select>
//               {errors.industry && (
//                 <span className="mt-2 text-sm text-red-600">
//                   {errors.industry.message}
//                 </span>
//               )}
//             </div> */}
//             <div className="">
//               <label className="block text-sm font-medium text-gray-700">
//                 Partnership
//               </label>
//               <select
//                 id="partner"
//                 {...register("partner")}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
//               >
//                 <option value="">Select Partner</option>
//                 {partner?.map((partnr, index) => (
//                   <option key={index} value={partnr._id}>
//                     {partnr.partner}
//                   </option>
//                 ))}
//               </select>
//               {errors.partner && (
//                 <span className="mt-2 text-sm text-red-600">
//                   {errors.partner.message}
//                 </span>
//               )}
//             </div>
//             <div className="">
//               <label className="block text-sm font-medium text-gray-700">
//                 RegistrationType
//               </label>
//               <select
//                 id="registrationType"
//                 {...register("registrationType", {
//                   required: "RegistrationType is required"
//                 })}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm  focus:outline-none cursor-pointer"
//               >
//                 <option value="">Select RegistrationType</option>
//                 <option value="unregistered">Unregistered/Consumer</option>
//                 <option value="regular">Regular</option>
//               </select>
//               {errors.registrationType && (
//                 <span className="mt-2 text-sm text-red-600">
//                   {errors.registrationType.message}
//                 </span>
//               )}
//             </div>
//             {registrationType === "regular" && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   GSTIN/UIN
//                 </label>
//                 <input
//                   type="text"
//                   {...register("gstNo")}
//                   onBlur={(e) => setValue("gstNo", e.target.value.trim())}
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
//                   placeholder="Enter GSTIN (e.g., 22AAAAA0000A1Z5)"
//                 />
//                 {errors.gstNo && (
//                   <span className="mt-2 text-sm text-red-600">
//                     {errors.gstNo.message}
//                   </span>
//                 )}
//               </div>
//             )}
//           </div>

//           <div>
//             <h1 className="text-lg md:text-2xl font-semibold mt-2 md:mt-0">
//               Product Details
//             </h1>
//             <hr className="my-1 border-gray-300 border-2" />
//             <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mt-2 ">
//               <div>
//                 <label
//                   htmlFor="productName"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Select Product
//                 </label>
//                 <Controller
//                   name="productName"
//                   control={control}
//                   render={({ field }) => (
//                     <Select
//                       {...field}
//                       options={productOptions}
//                       value={field.value}
//                       onChange={(option) => {
//                         field.onChange(option)
//                         handleProductChange(option)
//                       }}
//                       placeholder="Select Product"
//                     />
//                   )}
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="companyName"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Associated Company
//                 </label>
//                 <Controller
//                   name="companyName"
//                   control={control}
//                   render={({ field }) => (
//                     <Select
//                       {...field}
//                       options={companyOptions}
//                       value={field.value}
//                       onChange={(option) => {
//                         field.onChange(option)
//                         handleCompanyChange(option)
//                       }}
//                       placeholder="Select Company"
//                       isDisabled={!selectedProduct}
//                     />
//                   )}
//                 />
//               </div>
//               {/* Branch Display */}
//               <div>
//                 <label
//                   htmlFor="branchName"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Associated Branch
//                 </label>
//                 <Controller
//                   name="branchName"
//                   control={control}
//                   render={({ field }) => (
//                     <Select
//                       {...field}
//                       options={branchOptions}
//                       // value={field.value}
//                       onChange={(option) => {
//                         field.onChange(option)
//                         handleBranchChange(option)
//                       }}
//                       placeholder="Select Branch"
//                       isDisabled={!selectedCompany}
//                     />
//                   )}
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="licensenumber"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   License
//                 </label>
//                 <input
//                   id="licensenumber"
//                   type="text"
//                   {...register("licensenumber", {
//                     required: selectedProduct
//                       ? "License number is required"
//                       : false,
//                     validate: (value) =>
//                       selectedProduct && String(value).trim() === ""
//                         ? "License number is required for the selected product"
//                         : true
//                   })}
//                   onBlur={(e) =>
//                     setValue("licensenumber", e.target.value.trim())
//                   }
//                   onChange={(e) => {
//                     clearErrors("licensenumber")
//                     setTableObject({
//                       ...tableObject,
//                       licensenumber: e.target.value
//                     }) // Update state on change
//                   }}
//                   className="mt-0 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
//                   placeholder="License No..."
//                 />
//                 {errors.licensenumber && (
//                   <span className="mt-2 text-sm text-red-600">
//                     {errors.licensenumber.message}
//                   </span>
//                 )}
//               </div>
//               <div>
//                 <label htmlFor="softwareTrade">Software Trade</label>
//                 <select
//                   id="softwareTrade"
//                   {...register("softwareTrade")}
//                   onChange={
//                     (e) =>
//                       setTableObject({
//                         ...tableObject,
//                         softwareTrade: e.target.value
//                       }) // Update state on change
//                   }
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
//                 >
//                   <option value="">Select Software Trade</option>
//                   {softwareTrades.map((trade, index) => (
//                     <option key={index} value={trade}>
//                       {trade}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.softwareTrade && (
//                   <p className="text-red-500">
//                     Please select a software trade.
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label
//                   htmlFor="noofusers"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   No.of Users
//                 </label>
//                 <input
//                   type="number"
//                   {...register("noofusers")}
//                   onBlur={(e) => setValue("noofusers", e.target.value.trim())}
//                   onChange={
//                     (e) =>
//                       setTableObject({
//                         ...tableObject,
//                         noofusers: e.target.value
//                       }) // Update state on change
//                   }
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
//                   placeholder="No of users.."
//                 />
//                 {errors.noofusers && (
//                   <span className="mt-2 text-sm text-red-600">
//                     {errors.noofuser.message}
//                   </span>
//                 )}
//               </div>
//               <div>
//                 <label
//                   htmlFor="version"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Version
//                 </label>
//                 <input
//                   id="version"
//                   type="text"
//                   {...register("version")}
//                   onBlur={(e) => setValue("version", e.target.value.trim())}
//                   onChange={
//                     (e) =>
//                       setTableObject({
//                         ...tableObject,
//                         version: e.target.value
//                       }) // Update state on change
//                   }
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
//                   placeholder="Version..."
//                 />
//                 {errors.version && (
//                   <span className="mt-2 text-sm text-red-600">
//                     {errors.version.message}
//                   </span>
//                 )}
//               </div>

//               <div>
//                 <label
//                   htmlFor="customerAddDate"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Customer Add Date
//                 </label>
//                 <input
//                   id="customerAddDate"
//                   type="date"
//                   {...register("customerAddDate")}
//                   onChange={
//                     (e) =>
//                       setTableObject({
//                         ...tableObject,
//                         customerAddDate: e.target.value
//                       }) // Update state on change
//                   }
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
//                 />
//                 {errors.customerAddDate && (
//                   <span className="mt-2 text-sm text-red-600">
//                     {errors.customerAddDate.message}
//                   </span>
//                 )}
//               </div>
//               <div>
//                 <label
//                   htmlFor="amcstartDate"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   AMC Start Date
//                 </label>
//                 <input
//                   id="amcstartDate"
//                   type="date"
//                   {...register("amcstartDate")}
//                   onChange={(e) => {
//                     // const dateValue = new Date(e.target.value)
//                     setTableObject({
//                       ...tableObject,
//                       amcstartDate: e.target.value
//                     })

//                     // Update state on change
//                   }}
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
//                 />
//                 {errors.amcstartDate && (
//                   <span className="mt-2 text-sm text-red-600">
//                     {errors.amcstartDate.message}
//                   </span>
//                 )}
//               </div>
//               <div>
//                 <label
//                   htmlFor="amcendDate"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   AMC End Date
//                 </label>
//                 <input
//                   id="amcendDate"
//                   type="date"
//                   {...register("amcendDate")}
//                   onChange={(e) => {
//                     const value = e.target.value

//                     setTableObject((prev) => ({
//                       ...prev,
//                       amcendDate: value // Update local state if needed
//                     }))
//                   }}
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
//                 />
//                 {errors.amcendDate && (
//                   <span className="mt-2 text-sm text-red-600">
//                     {errors.amcendDate.message}
//                   </span>
//                 )}
//               </div>
//               <div>
//                 <label
//                   htmlFor="amcAmount"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   AMC Amount
//                 </label>
//                 <input
//                   type="number"
//                   {...register("amcAmount")}
//                   onBlur={(e) => setValue("amcAmount", e.target.value.trim())}
//                   onChange={
//                     (e) =>
//                       setTableObject({
//                         ...tableObject,
//                         amcAmount: e.target.value
//                       }) // Update state on change
//                   }
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
//                   placeholder="Amc amount.."
//                 />
//                 {errors.amcAmount && (
//                   <span className="mt-2 text-sm text-red-600">
//                     {errors.amcAmount.message}
//                   </span>
//                 )}
//               </div>
//               <div>
//                 <label
//                   id="amcDescription"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   AMC Description
//                 </label>
//                 <textarea
//                   id="amcDescription"
//                   rows="1"
//                   {...register("amcDescription", {
//                     maxLength: {
//                       value: 500,
//                       message: "Description cannot exceed 500 characters"
//                     },
//                     onBlur: (e) =>
//                       setValue("amcDescription", e.target.value.trim())
//                   })}
//                   onChange={
//                     (e) =>
//                       setTableObject({
//                         ...tableObject,
//                         amcDescription: e.target.value
//                       }) // Update state on change
//                   }
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
//                   placeholder="Enter a description..."
//                 />
//                 {errors.amcDescription && (
//                   <span className="mt-2 text-sm text-red-600">
//                     {errors.amcDescription.message}
//                   </span>
//                 )}
//               </div>
//               <div>
//                 <label
//                   htmlFor="licenseExpiryDate"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   License Expiry Date
//                 </label>
//                 <input
//                   id="licenseExpiryDate"
//                   type="date"
//                   {...register("licenseExpiryDate")}
//                   onChange={
//                     (e) =>
//                       setTableObject({
//                         ...tableObject,
//                         licenseExpiryDate: e.target.value
//                       }) // Update state on change
//                   }
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
//                 />
//                 {errors.licenseExpiryDate && (
//                   <span className="mt-2 text-sm text-red-600">
//                     {errors.licenseExpiryDate.message}
//                   </span>
//                 )}
//               </div>
//               <div>
//                 <label
//                   htmlFor="productAmount"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Product Amount
//                 </label>
//                 <input
//                   type="number"
//                   // value={selectedProduct.}
//                   {...register("productAmount")}
//                   onBlur={(e) =>
//                     setValue("productAmount", e.target.value.trim())
//                   }
//                   onChange={
//                     (e) =>
//                       setTableObject({
//                         ...tableObject,
//                         productAmount: e.target.value
//                       }) // Update state on change
//                   }
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
//                   placeholder="Product amount.."
//                 />
//                 {errors.productAmount && (
//                   <span className="mt-2 text-sm text-red-600">
//                     {errors.productAmount.message}
//                   </span>
//                 )}
//               </div>
//               <div>
//                 <label
//                   htmlFor="productamountDescription"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Product Description
//                 </label>
//                 <textarea
//                   id="productamountDescription"
//                   rows="1"
//                   {...register("productamountDescription", {
//                     maxLength: {
//                       value: 500,
//                       message: "Description cannot exceed 500 characters"
//                     },
//                     onBlur: (e) =>
//                       setValue(
//                         "productamountDescription",
//                         e.target.value.trim()
//                       )
//                   })}
//                   onChange={
//                     (e) =>
//                       setTableObject({
//                         ...tableObject,
//                         productamountDescription: e.target.value
//                       }) // Update state on change
//                   }
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
//                   placeholder="Enter a description..."
//                 />
//                 {errors.productamountDescription && (
//                   <span className="mt-2 text-sm text-red-600">
//                     {errors.productamountDescription.message}
//                   </span>
//                 )}
//               </div>
//               <div>
//                 <label
//                   htmlFor="tvuexpiryDate"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   TVU ExpiryDate
//                 </label>
//                 <input
//                   id="tvuexpiryDate"
//                   type="date"
//                   {...register("tvuexpiryDate")}
//                   onChange={
//                     (e) =>
//                       setTableObject({
//                         ...tableObject,
//                         tvuexpiryDate: e.target.value
//                       }) // Update state on change
//                   }
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
//                 />
//                 {errors.tvuexpiryDate && (
//                   <span className="mt-2 text-sm text-red-600">
//                     {errors.tvuexpiryDate.message}
//                   </span>
//                 )}
//               </div>
//               <div>
//                 <label
//                   htmlFor="tvuAmount"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   TVU Amount
//                 </label>
//                 <input
//                   id="tvuAmount"
//                   type="number"
//                   {...register("tvuAmount")}
//                   onBlur={(e) => setValue("tvuAmount", e.target.value.trim())}
//                   onChange={
//                     (e) =>
//                       setTableObject({
//                         ...tableObject,
//                         tvuAmount: e.target.value
//                       }) // Update state on change
//                   }
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
//                   placeholder="Tvu amount.."
//                 />
//                 {errors.tvuAmount && (
//                   <span className="mt-2 text-sm text-red-600">
//                     {errors.tvuAmount.message}
//                   </span>
//                 )}
//               </div>
//               <div>
//                 <label
//                   htmlFor="tvuamountDescription"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Tvu Description
//                 </label>
//                 <textarea
//                   id="tvuamountDescription"
//                   rows="1"
//                   {...register("tvuamountDescription", {
//                     maxLength: {
//                       value: 500,
//                       message: "Description cannot exceed 500 characters"
//                     },
//                     onBlur: (e) =>
//                       setValue("tvuamountDescription", e.target.value.trim())
//                   })}
//                   onChange={
//                     (e) =>
//                       setTableObject({
//                         ...tableObject,
//                         tvuamountDescription: e.target.value.trim()
//                       }) // Update state on change
//                   }
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
//                   placeholder="Enter a description..."
//                 />
//                 {errors.tvuamountDescription && (
//                   <span className="mt-2 text-sm text-red-600">
//                     {errors.tvuamountDescription.message}
//                   </span>
//                 )}
//               </div>
//               {showTable && (
//                 <>
//                   <div>
//                     <label
//                       htmlFor="isActive"
//                       className="block text-sm font-medium text-gray-700"
//                     >
//                       Status
//                     </label>
//                     <select
//                       id="isActive"
//                       {...register("isActive", {
//                         required: "Status is Required"
//                       })}
//                       onChange={(e) => {
//                         setTableObject({
//                           ...tableObject,
//                           isActive: e.target.value
//                         }) // Update state on
//                         clearErrors("isActive") // ✅ clears the error instantly when a value is selected
//                       }}
//                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
//                     >
//                       <option>select a status</option>
//                       <option value="Running">Active</option>
//                       <option value="Deactive">Deactive</option>
//                     </select>
//                     {errors.isActive && (
//                       <p className="text-red-500">{errors.isActive.message}</p>
//                     )}
//                   </div>
//                   <div>
//                     <label
//                       id="reasonofStatus"
//                       className="block text-sm font-medium text-gray-700"
//                     >
//                       Reason of Status
//                     </label>
//                     <textarea
//                       id="reasonofStatus"
//                       rows="1"
//                       {...register("reasonofStatus", {
//                         maxLength: {
//                           value: 500,
//                           message: "Description cannot exceed 500 characters"
//                         },
//                         onBlur: (e) =>
//                           setValue("reasonofStatus", e.target.value.trim())
//                       })}
//                       onChange={
//                         (e) =>
//                           setTableObject({
//                             ...tableObject,
//                             reasonofStatus: e.target.value
//                           }) // Update state on change
//                       }
//                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
//                       placeholder="Enter a description..."
//                     />
//                     {errors.reasonofStatus && (
//                       <span className="mt-2 text-sm text-red-600">
//                         {errors.reasonofStatus.message}
//                       </span>
//                     )}
//                   </div>
//                 </>
//               )}
//             </div>
//             {showTable && (
//               <div>
//                 <div className="mt-6 flex justify-end gap-2">
//                   {customer && (
//                     <>
//                       <button
//                         type="button"
//                         onClick={() => handleAddNewProduct()}
//                         className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
//                       >
//                         <span className="mr-1">+</span>
//                         Add New Product
//                       </button>
//                     </>
//                   )}
//                   <button
//                     type="button"
//                     onClick={() => {
//                       const licenseValue = String(getValues("licensenumber"))

//                       if (selectedProduct && !licenseValue.trim()) {
//                         // Set error if the license number is missing for a selected product
//                         setError("licensenumber", {
//                           type: "manual",
//                           message:
//                             "License number is required for the selected product"
//                         })
//                         return // Prevent adding to table
//                       }

//                       handleTableData()
//                     }}
//                     className="bg-gray-500 text-white py-1 px-2 rounded hover:bg-gray-600"
//                   >
//                     {editState ? "Update To Table" : "Add To Table"}
//                   </button>
//                 </div>

//                 <div className="mt-3 w-lg overflow-x-auto">
//                   <h3 className="text-lg font-medium text-gray-900">
//                     Product Details List
//                   </h3>
//                   <table className="m-w-full divide-y divide-gray-200 mt-4">
//                     <thead className="bg-green-400">
//                       <tr>
//                         <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider  text-gray-700">
//                           Product Name
//                         </th>
//                         {loggeduser.role === "Admin" && (
//                           <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
//                             Company Name
//                           </th>
//                         )}
//                         <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
//                           Branch Name
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider  text-gray-700">
//                           License No
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
//                           No.of Users
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider  text-gray-700">
//                           Version
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
//                           Customer addDate
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider  text-gray-700">
//                           Amc startDate
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider  text-gray-700">
//                           Amc endDate
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider  text-gray-700">
//                           Amc amount
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider  text-gray-700">
//                           License expiry
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider  text-gray-700">
//                           Product Amount
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider  text-gray-700">
//                           Tvu expiry
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider  text-gray-700">
//                           Tvu amount
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider  text-gray-700">
//                           Status
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider  text-gray-700">
//                           Edit
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider  text-gray-700">
//                           Delete
//                         </th>
//                       </tr>
//                     </thead>

//                     <tbody className="divide-y divide-gray-200">
//                       {tableData && tableData.length > 0 ? (
//                         tableData.map((product, index) => (
//                           <tr key={index}>
//                             <td className="px-6 py-4 text-sm text-gray-700 text-nowrap">
//                               {product?.productName}
//                             </td>
//                             {loggeduser.role === "Admin" && (
//                               <td className="px-6 py-4 text-sm text-gray-700 ">
//                                 {product?.companyName}
//                               </td>
//                             )}
//                             <td className="px-6 py-4 text-sm text-gray-700 ">
//                               {product?.branchName}
//                             </td>
//                             <td className="px-6 py-4 text-sm text-gray-700 ">
//                               {product?.licensenumber}
//                             </td>
//                             <td className="px-6 py-4 text-sm text-gray-700 ">
//                               {product?.noofusers}
//                             </td>
//                             <td className="px-6 py-4 text-sm text-gray-700">
//                               {product?.version}
//                             </td>
//                             <td className="px-6 py-4 text-sm text-gray-700 text-nowrap">
//                               {product?.customerAddDate}
//                             </td>
//                             <td className="px-6 py-4 text-sm text-gray-700 text-nowrap">
//                               {product?.amcstartDate}
//                             </td>
//                             <td className="px-6 py-4 text-sm text-gray-700 text-nowrap">
//                               {product?.amcendDate}
//                             </td>
//                             <td className="px-6 py-4 text-sm text-gray-700">
//                               {product?.amcAmount}
//                             </td>
//                             <td className="px-6 py-4 text-sm text-gray-700 text-nowrap">
//                               {product?.licenseExpiryDate}
//                             </td>
//                             <td className="px-6 py-4 text-sm text-gray-700 ">
//                               {product?.productAmount}
//                             </td>
//                             <td className="px-6 py-4 text-sm text-gray-700 text-nowrap">
//                               {product?.tvuexpiryDate}
//                             </td>
//                             <td className="px-6 py-4 text-sm text-gray-700">
//                               {product?.tvuAmount}
//                             </td>
//                             <td className="px-6 py-4 text-sm text-gray-700">
//                               {product?.isActive}
//                             </td>
//                             <td className="px-6 py-4 text-sm text-gray-700">
//                               <button
//                                 type="button"
//                                 className="text-green-600 hover:text-green-900 mr-2"
//                               >
//                                 <FaEdit
//                                   onClick={() => handleEdit(product.product_id)}
//                                 />
//                               </button>
//                             </td>
//                             <td className="px-6 py-4 text-sm text-gray-700 ">
//                               <button
//                                 type="button"
//                                 className="text-blue-600 hover:text-blue-900"
//                               >
//                                 <FaTrash onClick={() => handleDelete(index)} />
//                               </button>
//                             </td>
//                           </tr>
//                         ))
//                       ) : (
//                         <tr>
//                           <td colSpan="16" className="text-center py-4">
//                             No data available
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>

//                   {/* <table className="bg-green-300 m-w-full divide-y divide-gray-200 mt-4">
//                     <thead>
//                       <tr>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Product Name
//                         </th>
//                         {loggeduser.role === "Admin" && (
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Company Name
//                           </th>
//                         )}

//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Branch Name
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           License No
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           No.of Users
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Version
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Customer addDate
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Amc startDate
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Amc endDate
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Amc amount
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           License expiry
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Product Amount
//                         </th>

//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Tvu expiry
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Tvu amount
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Status
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Edit
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Delete
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {tableData && tableData.length > 0
//                         ? tableData.map((product, index) => (
//                             <tr key={index}>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                 {product?.productName}
//                               </td>
//                               {loggeduser.role === "Admin" && (
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                   {product?.companyName}
//                                 </td>
//                               )}

//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                 {product?.branchName}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                 {product?.licensenumber}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                 {product?.noofusers}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                 {product?.version}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                 {product?.customerAddDate}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                 {product?.amcstartDate}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                 {product?.amcendDate}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                 {product?.amcAmount}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                 {product?.licenseExpiryDate}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                 {product?.productAmount}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                 {product?.tvuexpiryDate}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                 {product?.tvuAmount}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                 {product?.tvuAmount}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                 {product?.isActive}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                 {" "}
//                                 <button
//                                   type="button"
//                                   className="text-green-600 hover:text-green-900 mr-2" // Adjust styles as needed
//                                   // onClick={() => handleEdit(index)}
//                                 >
//                                   <FaEdit
//                                     onClick={() =>
//                                       handleEdit(product.product_id)
//                                     }
//                                   />
//                                 </button>
//                               </td>

//                               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                 <button
//                                   type="button"
//                                   className="text-blue-600 hover:text-blue-900"
//                                 >
//                                   <FaTrash
//                                     onClick={() => handleDelete(index)}
//                                   />
//                                 </button>

//                               </td>
//                             </tr>
//                           ))
//                         : ""}
//                     </tbody>
//                   </table> */}
//                 </div>
//               </div>
//             )}

//             {/* tabledata */}

//             {/* Submit Button */}
//             <div className="mt-6 flex justify-end gap-4">
//               <button
//                 onClick={() =>
//                   navigatebackto ? navigate(navigatebackto) : navigate(-1)
//                 }
//                 type="button"
//                 className="flex items-center justify-center bg-red-500 text-white py-2 px-4 rounded shadow-xl hover:bg-red-600"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className={`flex items-center justify-center bg-green-500 text-white py-2 px-4 rounded shadow-xl hover:bg-green-600 ${
//                   isSubmitting && "bg-green-400 cursor-not-allowed"
//                 }`}
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? (
//                   <span className="flex items-center">
//                     <svg
//                       className="animate-spin h-5 w-5 mr-2 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                       ></path>
//                     </svg>
//                     Submitting...
//                   </span>
//                 ) : process === "Registration" ? (
//                   "Save"
//                 ) : (
//                   "Update"
//                 )}
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default CustomerAdd

// import React, { useEffect, useMemo, useState } from "react"
// import { useNavigate } from "react-router-dom"
// import Select from "react-select"
// import { useSelector } from "react-redux"
// import { useForm, Controller } from "react-hook-form"
// import { toast } from "react-toastify"
// import {
//   FaEdit,
//   FaTrash,
//   FaTimes,
//   FaUser,
//   FaHashtag,
//   FaBuilding,
//   FaEnvelope,
//   FaMapMarkerAlt,
//   FaPhone,
//   FaGlobeAsia,
//   FaStar,
//   FaLandmark
// } from "react-icons/fa"

// import { getLocalStorageItem } from "../../helper/localstorage"
// import UseFetch from "../../hooks/useFetch"
// import useDebounce from "../../hooks/useDebounce"

// const CustomerAdd = ({
//   navigatebackto,
//   process,
//   handleCustomerData,
//   handleEditedData,
//   customer
// }) => {
//   const navigate = useNavigate()

//   const {
//     register,
//     handleSubmit,
//     reset,
//     control,
//     setError,
//     clearErrors,
//     getValues,
//     setValue,
//     watch,
//     formState: { errors, isSubmitting }
//   } = useForm({
//     defaultValues: {
//       productName: null,
//       companyName: null,
//       branchName: null,
//       customerName: "",
//       address1: "",
//       address2: "",
//       country: "",
//       state: "",
//       city: "",
//       pincode: "",
//       contactPerson: "",
//       email: "",
//       mobile: "",
//       landline: "",
//       partner: "",
//       industry: "",
//       registrationType: "",
//       gstNo: "",
//       licensenumber: "",
//       softwareTrade: "",
//       applicationDate: "",
//       nextDue: "",
//       noofusers: "",
//       amount: "",
//       isActive: "Running",
//       taggedLicenses: []
//     }
//   })

//   const loggeduserBranch = useSelector(
//     (state) => state.companyBranch.loggeduserbranches
//   )

//   const [productOptions, setProductOptions] = useState([])
//   const [companyOptions, setCompanyOptions] = useState([])
//   const [branchOptions, setBranchOptions] = useState([])
//   const [partner, setPartner] = useState([])
//   const [license, setLicense] = useState([])
//   const [tableData, setTableData] = useState([])
//   const [licenseAvailable, setLicenseAvailable] = useState(true)
//   const [showProductPopup, setShowProductPopup] = useState(false)
//   const [popupType, setPopupType] = useState("")
//   const [editIndex, setEditIndex] = useState(null)

//   const selectedProduct = watch("productName")
//   const registrationType = watch("registrationType")
//   const watchedLicense = watch("licensenumber")

//   const { data: licensenumber } = UseFetch("customer/getLicensenumber")
//   const { data: partners } = UseFetch("customer/getallpartners")
//   console.log(loggeduserBranch)
//   const watchedTaggedLicenses = watch("taggedLicenses") || []
//   const watchedTaggedLicenseDueDates = watch("taggedLicenseDueDates") || {}

//   const hasTaggedLicenses =
//     popupType === "Additionalservice" && watchedTaggedLicenses.length > 0
// const { data: productData, error: productError } = UseFetch(
//   loggeduserBranch &&
//     `/product/getallProducts?branchselected=${encodeURIComponent(
//       JSON.stringify(loggeduserBranch)
//     )}`
// )
//   console.log(productError)
//   console.log(productData)
//   console.log(loggeduserBranch)
//   const debouncedLicenseNo = useDebounce(watchedLicense, 1000)

//   const softwareTrades = [
//     "Agriculture",
//     "Business Services",
//     "Computer Hardware Software",
//     "Electronics Electrical Supplies",
//     "FMCG-Fast Moving Consumable Goods",
//     "Garment,Fashion Apparel",
//     "Health Beauty",
//     "Industrial Supplies",
//     "Jewelry Gemstones",
//     "Mobile Accessories",
//     "Pharmaceutical Chemicals",
//     "Textiles Chemicals",
//     "Textiles Fabrics",
//     "Others",
//     "Restaurant, Food And Beverage",
//     "Accounts Chartered Account",
//     "Stationery, Printing Publishing",
//     "Hotel",
//     "Pipes, Tubes Fittings"
//   ]

//   const industries = [
//     "Whole sailor/Distributors",
//     "Retailer",
//     "Manufacturer",
//     "Service",
//     "Works Contract"
//   ]

//   useEffect(() => {
//     const user = getLocalStorageItem("user")
//     if (user) {
//     }
//   }, [])

//   useEffect(() => {
//     if (partners) {
//       setPartner(partners)
//     }
//   }, [partners])
//   console.log(productData)
//   useEffect(() => {
//     if (productData) {
//       setProductOptions(
//         productData.map((product) => ({
//           label: product.productName,
//           value: product._id,
//           productorservicetype: product.productorservicetype,
//           shortName: product?.shortName || ""
//         }))
//       )
//     }
//   }, [productData])

//   useEffect(() => {
//     if (licensenumber) {
//       setLicense(licensenumber)
//     }
//   }, [licensenumber])

//   useEffect(() => {
//     if (productError) {
//       toast.error(
//         productError?.response?.data?.message || "Something went wrong!"
//       )
//     }
//   }, [productError])

//   const formatDateToDDMMYYYY = (dateValue) => {
//     if (!dateValue) return ""
//     const date = new Date(dateValue)
//     if (Number.isNaN(date.getTime())) return ""
//     const day = String(date.getDate()).padStart(2, "0")
//     const month = String(date.getMonth() + 1).padStart(2, "0")
//     const year = date.getFullYear()
//     return `${day}-${month}-${year}`
//   }

//   useEffect(() => {
//     if (customer) {
//       reset({
//         customerName: customer?.customerName || "",
//         address1: customer?.address1 || "",
//         address2: customer?.address2 || "",
//         country: customer?.country || "",
//         state: customer?.state || "",
//         city: customer?.city || "",
//         pincode: customer?.pincode || "",
//         contactPerson: customer?.contactPerson || "",
//         email: customer?.email || "",
//         mobile: customer?.mobile || "",
//         landline: customer?.landline || "",
//         partner: customer?.partner || "",
//         industry: customer?.industry || "",
//         registrationType: customer?.registrationType || "",
//         gstNo: customer?.gstNo || "",
//         productName: null,
//         companyName: null,
//         branchName: null,
//         licensenumber: "",
//         softwareTrade: "",
//         applicationDate: "",
//         nextDue: "",
//         noofusers: "",
//         amount: "",
//         isActive: "Running",
//         taggedLicenses: []
//       })
// console.log(customer.selected)
//       const selectedData =
//         customer?.selected?.map((sel) => ({
//           company_id: sel?.company_id?._id,

//           companyName: sel?.company_id?.companyName,
//           branch_id: sel?.branch_id?._id,
//           branchName: sel?.branch_id?.branchName,
//           product_id: sel?.product_id?._id,
//           productName: sel?.product_id?.productName,
//           shortName: sel?.product_id?.shortName,
//           licensenumber: sel?.licensenumber,
//           softwareTrade: sel?.softwareTrade,
//           applicationDate: sel?.applicationDate || sel?.customerAddDate,
//           nextDue:
//             sel?.nextDue ||
//             sel?.amcendDate ||
//             sel?.licenseExpiryDate ||
//             sel?.tvuexpiryDate,
//           noofusers: sel?.noofusers,
//           amount:
//             sel?.amount ||
//             sel?.productAmount ||
//             sel?.amcAmount ||
//             sel?.tvuAmount,
//           isActive: sel?.isActive || "Running",
//           productorservicetype: sel?.productorservicetype,
//           taggedLicenses: sel?.taggedLicenses || sel?.licenseNumbers || []
//         })) || []

//       setTableData(selectedData)
//     }
//   }, [customer, reset])

//   useEffect(() => {
//     if (!debouncedLicenseNo || !String(debouncedLicenseNo).trim()) return

//     const checkLicense = license.find(
//       (item) => String(item?.licensenumber) === String(debouncedLicenseNo)
//     )

//     const currentEditing = editIndex !== null ? tableData[editIndex] : null
//     const isSameEditingLicense =
//       currentEditing &&
//       String(currentEditing?.licensenumber) === String(debouncedLicenseNo)

//     setLicenseAvailable(!(checkLicense && !isSameEditingLicense))
//   }, [debouncedLicenseNo, license, editIndex, tableData])

//   const getCompaniesForProduct = (productId) => {
//     const product = productData?.find((item) => item._id === productId)
//     if (!product) return []
//     console.log(product)
//     const seen = new Set()
//     return product.selected.reduce((acc, company) => {
//       if (!seen.has(company.company_id)) {
//         seen.add(company.company_id)
//         acc.push({
//           label: company.companyName,
//           value: company.company_id
//         })
//       }
//       return acc
//     }, [])
//   }

//   const getBranchesForCompany = (productId, companyId) => {
//     const product = productData?.find((item) => item._id === productId)
//     if (!product) return []

//     return product.selected
//       .filter((c) => c.company_id === companyId)
//       .map((branch) => ({
//         label: branch.branchName,
//         value: branch.branch_id
//       }))
//   }

//   const primaryLicenseOptions = useMemo(() => {
//     return [
//       ...new Set(
//         tableData
//           .filter(
//             (item) =>
//               String(item?.productorservicetype).toLowerCase() ===
//               "primaryproduct"
//           )
//           .map((item) => String(item?.licensenumber).trim())
//           .filter(Boolean)
//       )
//     ]
//   }, [tableData])

//   const handleProductChange = (selectedOption) => {
//     console.log(selectedOption)
//     setValue("productName", selectedOption)
//     setValue("shortName", selectedOption?.shortName)
//     setValue("companyName", null)
//     setValue("branchName", null)
//     setCompanyOptions(getCompaniesForProduct(selectedOption?.value))
//     setBranchOptions([])
//   }

//   const handleCompanyChange = (selectedCompanyOption) => {
//     setValue("companyName", selectedCompanyOption)
//     setValue("branchName", null)

//     const branches = getBranchesForCompany(
//       getValues("productName")?.value,
//       selectedCompanyOption?.value
//     )
//     console.log(selectedCompanyOption)
//     console.log(branches)
//     setBranchOptions(branches)
//   }

//   const handleBranchChange = (selectedBranchOption) => {
//     setValue("branchName", selectedBranchOption)
//   }

//   const openAddPopup = (type) => {
//     setPopupType(type)
//     setEditIndex(null)

//     reset({
//       ...getValues(),
//       productName: null,
//       companyName: null,
//       branchName: null,
//       licensenumber: "",
//       softwareTrade: "",
//       applicationDate: "",
//       nextDue: "",
//       noofusers: "",
//       amount: "",
//       isActive: "Running",
//       taggedLicenses: []
//     })

//     setCompanyOptions([])
//     setBranchOptions([])
//     setShowProductPopup(true)
//   }

//   const closePopup = () => {
//     setShowProductPopup(false)
//     setPopupType("")
//     setEditIndex(null)
//     clearErrors()
//   }

//   const handleEdit = (item, index) => {
//     console.log(item)
//     console.log(index)
//     setPopupType(item?.productorservicetype)
//     setEditIndex(index)

//     const productOption = productOptions.find(
//       (p) => p.value === item?.product_id
//     ) || {
//       label: item?.productName,
//       value: item?.productid
//     }

//     const companyOption = item?.company_id
//       ? { label: item?.companyName, value: item?.companyid }
//       : null

//     const branchOption = item?.branch_id
//       ? { label: item?.branchName, value: item?.branchid }
//       : null

//     setCompanyOptions(getCompaniesForProduct(item?.product_id))
//     setBranchOptions(getBranchesForCompany(item?.product_id, item?.company_id))

//     reset({
//       ...getValues(),
//       productName: productOption,
//       companyName: companyOption,
//       branchName: branchOption,
//       shortName: item?.shortName,
//       licensenumber: item?.licensenumber || "",
//       softwareTrade: item?.softwareTrade || "",
//       applicationDate: item?.applicationDate || "",
//       nextDue: item?.nextDue || "",
//       noofusers: item?.noofusers || "",
//       amount: item?.amount || "",
//       isActive: item?.isActive || "Running",
//       taggedLicenses: item?.taggedLicenses || []
//     })

//     setShowProductPopup(true)
//   }

//   const handleDelete = (index) => {
//     setTableData((prev) => prev.filter((_, i) => i !== index))
//   }

//   const savePopupData = () => {
//     const values = getValues()
//     console.log(values)
//     if (!values?.productName?.value) {
//       toast.error("Please select product/service")
//       return
//     }

//     if (
//       popupType === "Primaryproduct" &&
//       !String(values?.licensenumber || "").trim()
//     ) {
//       setError("licensenumber", {
//         type: "manual",
//         message: "License number is required for primary product"
//       })
//       return
//     }

//     if (
//       popupType === "Primaryproduct" &&
//       String(values?.licensenumber || "").trim() &&
//       !licenseAvailable
//     ) {
//       setError("licensenumber", {
//         type: "manual",
//         message: "License number already exists"
//       })
//       return
//     }

//     const row = {
//       company_id: values?.companyName?.value,
//       companyName: values?.companyName?.label,
//       branch_id: values?.branchName?.value,
//       branchName: values?.branchName?.label,
//       product_id: values?.productName?.value,
//       productName: values?.productName?.label,
//       shortName: values?.shortName,
//       licensenumber: values?.licensenumber,
//       softwareTrade: values?.softwareTrade,
//       applicationDate: values?.applicationDate,
//       nextDue: values?.nextDue,
//       noofusers: values?.noofusers,
//       amount: values?.amount,
//       isActive: values?.isActive || "Running",
//       productorservicetype: popupType,
//       taggedLicenses:
//         popupType === "Additionalservice" ? values?.taggedLicenses || [] : []
//     }

//     setTableData((prev) => {
//       const updated = [...prev]
//       if (editIndex !== null) {
//         updated[editIndex] = row
//       } else {
//         updated.push(row)
//       }
//       return updated
//     })

//     closePopup()
//   }

//   const filteredOptionsByType = useMemo(() => {
//     return productOptions.filter(
//       (item) =>
//         String(item?.productorservicetype).toLowerCase() ===
//         String(popupType).toLowerCase()
//     )
//   }, [productOptions, popupType])

//   const primaryProducts = useMemo(() => {
//     return tableData.filter(
//       (item) =>
//         String(item?.productorservicetype).toLowerCase() === "primaryproduct"
//     )
//   }, [tableData])

//   const additionalServices = useMemo(() => {
//     return tableData.filter(
//       (item) =>
//         String(item?.productorservicetype).toLowerCase() === "additionalservice"
//     )
//   }, [tableData])
// console.log(tableData)
// console.log(additionalServices)
//   const onSubmit = async (data) => {
// console.log(data)
// console.log(tableData)
// const a=tableData
// console.log(a)
// const c={
// ...a,
// }
// return
//     try {
//       if (process === "Registration") {
//         await handleCustomerData(data, tableData)
//         reset()
//         setTableData([])
//       } else if (process === "edit") {
//         await handleEditedData(data, tableData, customer?.index)
//       }
//     } catch (error) {
//       toast.error("Failed to save customer!")
//     }
//   }
// console.log(primaryProducts)
//   return (
//     <div className="min-h-screen bg-[#ADD8E6] px-3 py-6 md:px-6">
//       <div className="mx-auto max-w-[1180px]">
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
// <div className="rounded-[20px] border border-[#edf1f7] bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.05)] md:p-5">
//   <div className="mb-4 flex items-center justify-between">
//     <div className="flex items-center gap-3">
//       <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef5ff] text-[#4b87ff]">
//         <FaUser size={14} />
//       </div>
//       <div>
//         <h2 className="text-[16px] font-semibold text-[#162033]">
//           Customer Details
//         </h2>
//         <p className="text-[12px] text-[#7f8aa3]">
//           Fill customer master information
//         </p>
//       </div>
//     </div>

//     <button
//       type="button"
//       onClick={() =>
//         navigatebackto ? navigate(navigatebackto) : navigate(-1)
//       }
//       className="rounded-md border border-[#e6ebf3] bg-white px-3 py-2 text-[12px] font-medium text-[#6d7890] hover:bg-[#f8fafc]"
//     >
//       Cancel
//     </button>
//   </div>

//   <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
//     <InfoInputCard
//       icon={<FaUser size={12} />}
//       iconBg="bg-[#edf6ff]"
//       iconColor="text-[#5aa2ff]"
//       label="Customer Name"
//       error={errors.customerName?.message}
//     >
//       <input
//         type="text"
//         {...register("customerName", {
//           required: "Customer name is required"
//         })}
//         onBlur={(e) =>
//           setValue("customerName", e.target.value.trim())
//         }
//         className={tileInputClass}
//         placeholder="Enter customer name"
//       />
//     </InfoInputCard>

//     <InfoInputCard
//       icon={<FaHashtag size={12} />}
//       iconBg="bg-[#f4efff]"
//       iconColor="text-[#8a5eff]"
//       label="Pincode"
//     >
//       <input
//         type="number"
//         {...register("pincode")}
//         onBlur={(e) => setValue("pincode", e.target.value.trim())}
//         className={tileInputClass}
//         placeholder="Pincode"
//       />
//     </InfoInputCard>

//     <InfoInputCard
//       icon={<FaBuilding size={12} />}
//       iconBg="bg-[#fff4ea]"
//       iconColor="text-[#f0a24d]"
//       label="City"
//     >
//       <input
//         type="text"
//         {...register("city")}
//         onBlur={(e) => setValue("city", e.target.value.trim())}
//         className={tileInputClass}
//         placeholder="City"
//       />
//     </InfoInputCard>

//     <InfoInputCard
//       icon={<FaEnvelope size={12} />}
//       iconBg="bg-[#eefbf2]"
//       iconColor="text-[#4cbf73]"
//       label="Email"
//       error={errors.email?.message}
//     >
//       <input
//         type="email"
//         {...register("email", {
//           required: "Email is required",
//           pattern: {
//             value: /\S+@\S+\.\S+/,
//             message: "Invalid email address"
//           }
//         })}
//         onBlur={(e) => setValue("email", e.target.value.trim())}
//         className={tileInputClass}
//         placeholder="Email"
//       />
//     </InfoInputCard>

//     <InfoInputCard
//       icon={<FaMapMarkerAlt size={12} />}
//       iconBg="bg-[#fff0f8]"
//       iconColor="text-[#ef7db2]"
//       label="Address 1"
//     >
//       <input
//         type="text"
//         {...register("address1")}
//         onBlur={(e) => setValue("address1", e.target.value.trim())}
//         className={tileInputClass}
//         placeholder="Address line 1"
//       />
//     </InfoInputCard>

//     <InfoInputCard
//       icon={<FaUser size={12} />}
//       iconBg="bg-[#ebfbfb]"
//       iconColor="text-[#43c7cb]"
//       label="Contact Person"
//     >
//       <input
//         type="text"
//         {...register("contactPerson")}
//         onBlur={(e) =>
//           setValue("contactPerson", e.target.value.trim())
//         }
//         className={tileInputClass}
//         placeholder="Contact person"
//       />
//     </InfoInputCard>

//     <InfoInputCard
//       icon={<FaPhone size={12} />}
//       iconBg="bg-[#edf9f0]"
//       iconColor="text-[#45bf6b]"
//       label="Mobile No"
//     >
//       <input
//         type="tel"
//         {...register("mobile")}
//         onBlur={(e) => setValue("mobile", e.target.value.trim())}
//         className={tileInputClass}
//         placeholder="Mobile number"
//       />
//     </InfoInputCard>

//     <InfoInputCard
//       icon={<FaLandmark size={12} />}
//       iconBg="bg-[#fff8df]"
//       iconColor="text-[#d1a91b]"
//       label="Partnership"
//     >
//       <select {...register("partner")} className={tileInputClass}>
//         <option value="">Select Partner</option>
//         {partner?.map((partnr, index) => (
//           <option key={index} value={partnr.id}>
//             {partnr.partner}
//           </option>
//         ))}
//       </select>
//     </InfoInputCard>

//     <InfoInputCard
//       icon={<FaMapMarkerAlt size={12} />}
//       iconBg="bg-[#eef5ff]"
//       iconColor="text-[#3879f2]"
//       label="Address 2"
//     >
//       <input
//         type="text"
//         {...register("address2")}
//         onBlur={(e) => setValue("address2", e.target.value.trim())}
//         className={tileInputClass}
//         placeholder="Address line 2"
//       />
//     </InfoInputCard>

//     <InfoInputCard
//       icon={<FaBuilding size={12} />}
//       iconBg="bg-[#edf7ff]"
//       iconColor="text-[#4f98ff]"
//       label="State"
//     >
//       <input
//         type="text"
//         {...register("state")}
//         onBlur={(e) => setValue("state", e.target.value.trim())}
//         className={tileInputClass}
//         placeholder="State"
//       />
//     </InfoInputCard>

//     <InfoInputCard
//       icon={<FaGlobeAsia size={12} />}
//       iconBg="bg-[#fff2e8]"
//       iconColor="text-[#ef9a47]"
//       label="Country"
//     >
//       <input
//         type="text"
//         {...register("country")}
//         onBlur={(e) => setValue("country", e.target.value.trim())}
//         className={tileInputClass}
//         placeholder="Country"
//       />
//     </InfoInputCard>

//     <InfoInputCard
//       icon={<FaPhone size={12} />}
//       iconBg="bg-[#fff1f6]"
//       iconColor="text-[#f07ab1]"
//       label="Landline No"
//     >
//       <input
//         type="tel"
//         {...register("landline")}
//         onBlur={(e) => setValue("landline", e.target.value.trim())}
//         className={tileInputClass}
//         placeholder="Landline"
//       />
//     </InfoInputCard>

//     <InfoInputCard
//       icon={<FaStar size={12} />}
//       iconBg="bg-[#eef4ff]"
//       iconColor="text-[#6d86ff]"
//       label="Industry"
//     >
//       <select {...register("industry")} className={tileInputClass}>
//         <option value="">Select Industry</option>
//         {industries.map((industry, index) => (
//           <option key={index} value={industry}>
//             {industry}
//           </option>
//         ))}
//       </select>
//     </InfoInputCard>

//     <InfoInputCard
//       icon={<FaHashtag size={12} />}
//       iconBg="bg-[#f5f0ff]"
//       iconColor="text-[#9967ff]"
//       label="Registration Type"
//       error={errors.registrationType?.message}
//     >
//       <select
//         {...register("registrationType", {
//           required: "RegistrationType is required"
//         })}
//         className={tileInputClass}
//       >
//         <option value="">Select RegistrationType</option>
//         <option value="unregistered">Unregistered/Consumer</option>
//         <option value="regular">Regular</option>
//       </select>
//     </InfoInputCard>

//     {registrationType === "regular" && (
//       <InfoInputCard
//         icon={<FaLandmark size={12} />}
//         iconBg="bg-[#fff1f7]"
//         iconColor="text-[#ee82a9]"
//         label="GSTIN / UIN"
//       >
//         <input
//           type="text"
//           {...register("gstNo")}
//           onBlur={(e) => setValue("gstNo", e.target.value.trim())}
//           className={tileInputClass}
//           placeholder="Enter GSTIN"
//         />
//       </InfoInputCard>
//     )}
//   </div>
// </div>

//           <div className="space-y-4">
//             <div className="rounded-[14px] border border-[#edf1f7] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
//               <div className="flex items-center justify-between border-b border-[#f1f4f8] px-4 py-3">
//                 <div className="flex items-center gap-2">
//                   <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#eef5ff] text-[#3a7afe]">
//                     <FaBuilding size={10} />
//                   </div>
//                   <h3 className="text-[13px] font-semibold text-[#1b2437]">
//                     Primary Products
//                   </h3>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={() => openAddPopup("Primaryproduct")}
//                   className="text-[11px] font-medium text-[#2f80ed] hover:underline"
//                 >
//                   Add Product
//                 </button>
//               </div>

//               <div className="min-h-[170px] px-4 py-5">
//                 {primaryProducts.length > 0 ? (
//                   <div className="flex items-center gap-4 overflow-x-auto pb-2">
//                     {primaryProducts.map((item) => {
//                       const actualIndex = tableData.findIndex((x) => x === item)
//                       const isDeactive =
//                         String(item?.isActive).toLowerCase() === "deactive"

//                       return (
//                         <ProductCircleCard
//                           key={`primary-${actualIndex}`}
//                           item={item}
//                           actualIndex={actualIndex}
//                           variant={isDeactive ? "danger" : "success"}
//                           topBadgeIcon={<FaBuilding size={10} />}
//                           line1={
//                             item?.shortName ? item?.shortName : item.productName
//                           }
//                           line2={item?.licensenumber}
//                           line3={
//                             item?.nextDue
//                               ? formatDateToDDMMYYYY(item?.nextDue)
//                               : ""
//                           }
//                           line4={isDeactive ? "De Active" : ""}
//                           onEdit={handleEdit}
//                           onDelete={handleDelete}
//                         />
//                       )
//                     })}
//                   </div>
//                 ) : (
//                   <div className="flex h-[120px] items-center justify-center rounded-[12px] border border-dashed border-[#e7ebf4] bg-[#fbfcff] text-[12px] text-[#8a95ab]">
//                     No primary products added.
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="rounded-[14px] border border-[#edf1f7] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
//               <div className="flex items-center justify-between border-b border-[#f1f4f8] px-4 py-3">
//                 <div className="flex items-center gap-2">
//                   <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#eef5ff] text-[#3a7afe]">
//                     <FaBuilding size={10} />
//                   </div>
//                   <h3 className="text-[13px] font-semibold text-[#1b2437]">
//                     Additional Services
//                   </h3>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={() => openAddPopup("Additionalservice")}
//                   className="text-[11px] font-medium text-[#2f80ed] hover:underline"
//                 >
//                   Add Service
//                 </button>
//               </div>

//               <div className="min-h-[170px] px-4 py-5">
//                 {additionalServices.length > 0 ? (
//                   <div className="flex items-center gap-4 overflow-x-auto pb-2">
//                     {additionalServices.map((item) => {
//                       const actualIndex = tableData.findIndex((x) => x === item)

//                       return (
//                         <ProductCircleCard
//                           key={`additional-${actualIndex}`}
//                           item={item}
//                           actualIndex={actualIndex}
//                           variant="service"
//                           topBadgeIcon={<FaBuilding size={10} />}
//                           line1={item?.shortName?item?.shortName:item?.productName}
//                           line2={item?.amount ? `Rs. ${item.amount}` : ""}
//                           line3={
//                             item?.nextDue
//                               ? formatDateToDDMMYYYY(item?.nextDue)
//                               : ""
//                           }
//                           line4={
//                             Array.isArray(item?.taggedLicenses) &&
//                             item.taggedLicenses.length > 0
//                               ? `Tagged ${item.taggedLicenses.length}`
//                               : ""
//                           }
//                           onEdit={handleEdit}
//                           onDelete={handleDelete}
//                         />
//                       )
//                     })}
//                   </div>
//                 ) : (
//                   <div className="flex h-[120px] flex-col items-center justify-center rounded-[12px] border border-dashed border-[#e7ebf4] bg-[#fbfcff] text-center">
//                     <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#f2f4f8] text-[#9ca8be]">
//                       <FaBuilding size={12} />
//                     </div>
//                     <p className="text-[12px] text-[#76839d]">
//                       No additional services added.
//                     </p>
//                     <p className="mt-1 text-[11px] text-[#a0abc0]">
//                       Click Add Service to get started.
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-end gap-3">
//             <button
//               type="button"
//               onClick={() =>
//                 navigatebackto ? navigate(navigatebackto) : navigate(-1)
//               }
//               className="rounded-lg border border-[#f1c7cc] bg-white px-5 py-2.5 text-[13px] font-semibold text-[#d65b68] hover:bg-[#fff6f7]"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="rounded-lg bg-[#1f2937] px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#111827] disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               {isSubmitting
//                 ? "Submitting..."
//                 : process === "Registration"
//                   ? "Save"
//                   : "Update"}
//             </button>
//           </div>
//         </form>
//       </div>

//       {showProductPopup && (
//         <div className="fixed inset-0 z-50 bg-black/30 p-2 sm:p-3">
//           <div className="flex min-h-full items-center justify-center">
//             <div className="flex w-full max-w-3xl max-h-[92vh] flex-col overflow-hidden rounded-[14px] bg-white shadow-2xl">
//               <div className="flex shrink-0 items-center justify-between border-b border-[#edf1f7] px-3 py-2.5">
//                 <div>
//                   <h3 className="text-[14px] font-semibold text-[#162033]">
//                     {popupType === "Primaryproduct"
//                       ? "Primary Product"
//                       : "Additional Service"}
//                   </h3>
//                   <p className="text-[10px] text-[#7f8aa3]">
//                     Add product or service details
//                   </p>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={closePopup}
//                   className="rounded-full p-1 text-[#7f8aa3] hover:bg-[#f4f7fb]"
//                 >
//                   <FaTimes size={14} />
//                 </button>
//               </div>

//               <div className="flex-1 overflow-y-auto px-3 py-2.5">
//                 <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
//                   <div>
//                     <label className="mb-1 block text-[11px] font-medium text-[#5d6983]">
//                       Product / Service
//                     </label>
//                     <Controller
//                       name="productName"
//                       control={control}
//                       render={({ field }) => (
//                         <Select
//                           {...field}
//                           options={filteredOptionsByType}
//                           value={field.value}
//                           onChange={(option) => {
//                             field.onChange(option)
//                             handleProductChange(option)
//                           }}
//                           placeholder="Select name"
//                           styles={compactSelectStyles}
//                         />
//                       )}
//                     />
//                   </div>

//                   <PopupField
//                     label="Short Name"
//                     error={errors.shortName?.message}
//                   >
//                     <input
//                       readOnly
//                       {...register("shortName")}
//                       className="w-full cursor-not-allowed rounded-[8px] border border-[#dfe5ee] bg-[#f3f6fb] px-2.5 py-1.5 text-[12px] text-[#1f2a3d] outline-none"
//                       placeholder="Enter Short Name"
//                     />
//                   </PopupField>

//                   <PopupField label="Company">
//                     <Controller
//                       name="companyName"
//                       control={control}
//                       render={({ field }) => (
//                         <Select
//                           {...field}
//                           options={companyOptions}
//                           value={field.value}
//                           onChange={(option) => {
//                             field.onChange(option)
//                             handleCompanyChange(option)
//                           }}
//                           placeholder="Select company"
//                           isDisabled={!selectedProduct}
//                           styles={compactSelectStyles}
//                         />
//                       )}
//                     />
//                   </PopupField>

//                   <PopupField label="Branch">
//                     <Controller
//                       name="branchName"
//                       control={control}
//                       render={({ field }) => (
//                         <Select
//                           {...field}
//                           options={branchOptions}
//                           value={field.value}
//                           onChange={(option) => {
//                             field.onChange(option)
//                             handleBranchChange(option)
//                           }}
//                           placeholder="Select branch"
//                           isDisabled={!watch("companyName")}
//                           styles={compactSelectStyles}
//                         />
//                       )}
//                     />
//                   </PopupField>

//                   <PopupField
//                     label="License Number"
//                     error={
//                       errors.licensenumber?.message ||
//                       (!licenseAvailable && watchedLicense
//                         ? "License number already exists"
//                         : "")
//                     }
//                   >
//                     <input
//                       {...register("licensenumber")}
//                       readOnly={hasTaggedLicenses}
//                       className={`${compactPopupInputClass} ${
//                         hasTaggedLicenses
//                           ? "cursor-not-allowed bg-[#f3f6fb]"
//                           : ""
//                       }`}
//                       placeholder={
//                         popupType === "Primaryproduct"
//                           ? "Enter license number"
//                           : hasTaggedLicenses
//                             ? "Auto handled by tagged licenses"
//                             : "Enter license number"
//                       }
//                       onChange={(e) => {
//                         if (hasTaggedLicenses) return
//                         setValue("licensenumber", e.target.value)
//                         clearErrors("licensenumber")
//                       }}
//                     />
//                   </PopupField>

//                   {popupType === "Primaryproduct" && (
//                     <PopupField label="Software Trade">
//                       <select
//                         {...register("softwareTrade")}
//                         className={compactPopupInputClass}
//                       >
//                         <option value="">Select Software Trade</option>
//                         {softwareTrades.map((trade, index) => (
//                           <option key={index} value={trade}>
//                             {trade}
//                           </option>
//                         ))}
//                       </select>
//                     </PopupField>
//                   )}

//                   {popupType === "Primaryproduct" && (
//                     <PopupField label="Application Date">
//                       <input
//                         type="date"
//                         {...register("applicationDate")}
//                         className={compactPopupInputClass}
//                       />
//                     </PopupField>
//                   )}

//                   {popupType === "Additionalservice" && !hasTaggedLicenses && (
//                     <PopupField label="Next Due">
//                       <input
//                         type="date"
//                         {...register("nextDue")}
//                         className={compactPopupInputClass}
//                       />
//                     </PopupField>
//                   )}

//                   <PopupField label="No of Quantity / Users">
//                     <input
//                       type="number"
//                       {...register("noofusers")}
//                       className={compactPopupInputClass}
//                     />
//                   </PopupField>

//                   <PopupField label="Amount">
//                     <input
//                       type="number"
//                       {...register("amount")}
//                       className={compactPopupInputClass}
//                     />
//                   </PopupField>

//                   <PopupField label="Status">
//                     <select
//                       {...register("isActive")}
//                       className={compactPopupInputClass}
//                     >
//                       <option value="Running">Active</option>
//                       <option value="Deactive">Deactive</option>
//                     </select>
//                   </PopupField>

//                   {popupType === "Additionalservice" && (
//                     <div className="md:col-span-2">
//                       <label className="mb-1 block text-[11px] font-medium text-[#5d6983]">
//                         Tagged License Numbers
//                       </label>

//                       <div className="max-h-28 overflow-y-auto rounded-[8px] border border-[#e7ebf4] bg-[#fafcff] p-2">
//                         {primaryLicenseOptions.length > 0 ? (
//                           <div className="grid grid-cols-1 gap-1.5 md:grid-cols-2">
//                             {primaryLicenseOptions.map((licenseNo) => {
//                               const selectedTaggedLicenses =
//                                 watch("taggedLicenses") || []
//                               const checked = selectedTaggedLicenses.includes(
//                                 String(licenseNo)
//                               )

//                               return (
//                                 <label
//                                   key={licenseNo}
//                                   className="flex items-center gap-2 rounded-md border border-[#edf1f7] bg-white px-2 py-1.5 text-[11px] text-[#4f5d78]"
//                                 >
//                                   <input
//                                     type="checkbox"
//                                     checked={checked}
//                                     onChange={(e) => {
//                                       const prev = watch("taggedLicenses") || []
//                                       const dueMap =
//                                         watch("taggedLicenseDueDates") || {}

//                                       if (e.target.checked) {
//                                         setValue("taggedLicenses", [
//                                           ...prev,
//                                           String(licenseNo)
//                                         ])
//                                         setValue("licensenumber", "")
//                                         setValue("taggedLicenseDueDates", {
//                                           ...dueMap,
//                                           [String(licenseNo)]:
//                                             dueMap[String(licenseNo)] || ""
//                                         })
//                                       } else {
//                                         const updatedLicenses = prev.filter(
//                                           (item) =>
//                                             String(item) !== String(licenseNo)
//                                         )

//                                         const updatedDueMap = { ...dueMap }
//                                         delete updatedDueMap[String(licenseNo)]

//                                         setValue(
//                                           "taggedLicenses",
//                                           updatedLicenses
//                                         )
//                                         setValue(
//                                           "taggedLicenseDueDates",
//                                           updatedDueMap
//                                         )

//                                         if (updatedLicenses.length === 0) {
//                                           setValue("licensenumber", "")
//                                         }
//                                       }
//                                     }}
//                                   />
//                                   <span>{licenseNo}</span>
//                                 </label>
//                               )
//                             })}
//                           </div>
//                         ) : (
//                           <p className="text-[11px] italic text-[#96a0b5]">
//                             No primary product license numbers available.
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   )}

//                   {popupType === "Additionalservice" && hasTaggedLicenses && (
//                     <div className="md:col-span-2">
//                       <label className="mb-1.5 block text-[11px] font-medium text-[#5d6983]">
//                         Tagged License Due Details
//                       </label>

//                       <div className="overflow-hidden rounded-[8px] border border-[#e7ebf4]">
//                         <div className="max-h-40 overflow-y-auto">
//                           <table className="w-full border-collapse">
//                             <thead className="sticky top-0 bg-[#f8fafc]">
//                               <tr>
//                                 <th className="border-b border-[#e7ebf4] px-2.5 py-1.5 text-left text-[11px] font-semibold text-[#43506a]">
//                                   License Number
//                                 </th>
//                                 <th className="border-b border-[#e7ebf4] px-2.5 py-1.5 text-left text-[11px] font-semibold text-[#43506a]">
//                                   Next Due
//                                 </th>
//                               </tr>
//                             </thead>
//                             <tbody>
//                               {watchedTaggedLicenses.map((licenseNo) => (
//                                 <tr key={licenseNo}>
//                                   <td className="border-b border-[#eef2f7] px-2.5 py-1.5">
//                                     <input
//                                       value={licenseNo}
//                                       readOnly
//                                       className="w-full cursor-not-allowed rounded-[7px] border border-[#dfe5ee] bg-[#f3f6fb] px-2 py-1.5 text-[11px] text-[#1f2a3d] outline-none"
//                                     />
//                                   </td>
//                                   <td className="border-b border-[#eef2f7] px-2.5 py-1.5">
//                                     <input
//                                       type="date"
//                                       value={
//                                         watchedTaggedLicenseDueDates?.[
//                                           licenseNo
//                                         ] || ""
//                                       }
//                                       onChange={(e) => {
//                                         const dueMap =
//                                           watch("taggedLicenseDueDates") || {}
//                                         setValue("taggedLicenseDueDates", {
//                                           ...dueMap,
//                                           [licenseNo]: e.target.value
//                                         })
// console.log(tableData)
//                                       }}
//                                       className={compactPopupInputClass}
//                                     />
//                                   </td>
//                                 </tr>
//                               ))}
//                             </tbody>
//                           </table>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="flex shrink-0 justify-end gap-2 border-t border-[#edf1f7] bg-white px-3 py-2.5">
//                 <button
//                   type="button"
//                   onClick={closePopup}
//                   className="rounded-md border border-[#e4e9f2] px-3 py-1.5 text-[12px] text-[#5c6981] hover:bg-[#f8fafc]"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   onClick={savePopupData}
//                   className="rounded-md bg-[#2f80ed] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[#246cd0]"
//                 >
//                   {editIndex !== null ? "Update" : "Save"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// const InfoInputCard = ({ icon, iconBg, iconColor, label, children, error }) => {
//   return (
//     <div className="rounded-[14px] border border-[#edf1f7] bg-white px-3 py-3 transition hover:border-[#dbe6ff]">
//       <div className="flex items-start gap-3">
//         <div
//           className={`mt-[2px] flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${iconBg} ${iconColor}`}
//         >
//           {icon}
//         </div>

//         <div className="min-w-0 flex-1">
//           <p className="mb-1 text-[11px] font-medium text-[#8c96ad]">{label}</p>
//           {children}
//           {error ? (
//             <p className="mt-1 text-[11px] text-red-500">{error}</p>
//           ) : null}
//         </div>
//       </div>
//     </div>
//   )
// }

// const PopupField = ({ label, children, error }) => {
//   return (
//     <div>
//       <label className="mb-1 block text-[12px] font-medium text-[#5d6983]">
//         {label}
//       </label>
//       {children}
//       {error ? <p className="mt-1 text-[11px] text-red-500">{error}</p> : null}
//     </div>
//   )
// }

// const ProductCircleCard = ({
//   item,
//   actualIndex,
//   variant,
//   topBadgeIcon,
//   line1,
//   line2,
//   line3,
//   line4,
//   onEdit,
//   onDelete
// }) => {
//   const variantClass =
//     variant === "danger"
//       ? "bg-[#ffdedd] border-[#f4c6c2]"
//       : variant === "service"
//         ? "bg-[#fff3c9] border-[#f0e1a2]"
//         : "bg-[#dff3d2] border-[#cce6bc]"

//   return (
//     <div className="group relative shrink-0">
//       <button
//         type="button"
//         onClick={() => onEdit(item, actualIndex)}
//         className={`relative flex h-[108px] w-[108px] flex-col items-center justify-center rounded-full border text-center shadow-sm transition hover:scale-[1.02] ${variantClass}`}
//       >
//         <div className="mb-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-[#4e5a72] shadow-sm">
//           {topBadgeIcon}
//         </div>

//         <p className="px-2 text-[9.5px] font-semibold leading-3 text-[#1e293b]">
//           {line1}
//         </p>

//         {line2 ? (
//           <p className="mt-1 px-2 text-[8.5px] leading-3 text-[#4b5563]">
//             {line2}
//           </p>
//         ) : null}

//         {line3 ? (
//           <p className="mt-1 px-2 text-[8.5px] leading-3 text-[#4b5563]">
//             {line3}
//           </p>
//         ) : null}

//         {line4 ? (
//           <p className="mt-1 px-2 text-[8.5px] font-semibold leading-3 text-[#d35c5c]">
//             {line4}
//           </p>
//         ) : null}
//       </button>

//       <div className="absolute -right-2 -top-2 hidden gap-1 group-hover:flex">
//         <button
//           type="button"
//           onClick={() => onEdit(item, actualIndex)}
//           className="rounded-full bg-white p-2 text-green-600 shadow"
//         >
//           <FaEdit size={10} />
//         </button>
//         <button
//           type="button"
//           onClick={() => onDelete(actualIndex)}
//           className="rounded-full bg-white p-2 text-red-600 shadow"
//         >
//           <FaTrash size={10} />
//         </button>
//       </div>
//     </div>
//   )
// }
// const compactPopupInputClass =
//   "h-[34px] w-full rounded-[8px] border border-[#dfe5ee] bg-white px-2.5 py-1 text-[12px] text-[#1f2a3d] outline-none focus:border-[#7ba7ff]"

// const compactSelectStyles = {
//   control: (base, state) => ({
//     ...base,
//     minHeight: "34px",
//     height: "34px",
//     borderRadius: "8px",
//     borderColor: state.isFocused ? "#7ba7ff" : "#dfe5ee",
//     boxShadow: "none",
//     fontSize: "12px"
//   }),
//   valueContainer: (base) => ({
//     ...base,
//     height: "34px",
//     padding: "0 8px"
//   }),
//   input: (base) => ({
//     ...base,
//     margin: "0px",
//     padding: "0px"
//   }),
//   indicatorsContainer: (base) => ({
//     ...base,
//     height: "34px"
//   }),
//   dropdownIndicator: (base) => ({
//     ...base,
//     padding: "6px"
//   }),
//   clearIndicator: (base) => ({
//     ...base,
//     padding: "6px"
//   }),
//   menu: (base) => ({
//     ...base,
//     fontSize: "12px",
//     zIndex: 60
//   }),
//   option: (base) => ({
//     ...base,
//     fontSize: "12px",
//     padding: "6px 10px"
//   }),
//   placeholder: (base) => ({
//     ...base,
//     fontSize: "12px"
//   }),
//   singleValue: (base) => ({
//     ...base,
//     fontSize: "12px"
//   })
// }
// const tileInputClass =
//   "w-full border-0 bg-transparent p-0 text-[12px] font-medium text-[#1f2a3d] outline-none placeholder:text-[#c0c8d8]"

// const popupInputClass =
//   "w-full rounded-[10px] border border-[#dfe5ee] bg-white px-3 py-2 text-[13px] text-[#1f2a3d] outline-none focus:border-[#7ba7ff]"

// export default CustomerAdd

import React, { useEffect, useMemo, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Select from "react-select"
import { useSelector } from "react-redux"
import { useForm, Controller } from "react-hook-form"
import { toast } from "react-toastify"
import FullScreenLoader from "../common/FullScreenLoader"
import api from "../../api/api"
import {
  FaEdit,
  FaTrash,
  FaTimes,
  FaUser,
  FaHashtag,
  FaBuilding,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaGlobeAsia,
  FaStar,
  FaLandmark
} from "react-icons/fa"

import { getLocalStorageItem } from "../../helper/localstorage"
import UseFetch from "../../hooks/useFetch"
import useDebounce from "../../hooks/useDebounce"

const CustomerAdd = ({
  navigatebackto,
  process,
  handleCustomerData,
  handleEditedData,
  customer
}) => {
  const navigate = useNavigate()

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
      contactPerson: "",
      email: "",
      mobile: "",
      landline: "",
      partner: "",
      industry: "",
      registrationType: "",
      gstNo: "",
      licensenumber: "",
      softwareTrade: "",
      applicationDate: "",
      nextDue: "",
      noofusers: "",
      productAmount: "",
      isActive: "Running",
      taggedLicenses: [],
      taggedLicenseDueDates: {}
    }
  })

  const loggeduserBranch = useSelector(
    (state) => state.companyBranch.loggeduserbranches
  )
  const debounceTimersRef = useRef({})
  const [submissionloader, setsubmissionloader] = useState(false)
  const [licenseloading, setlicenseloading] = useState(false)
  const [productOptions, setProductOptions] = useState([])
  const [companyOptions, setCompanyOptions] = useState([])
  const [branchOptions, setBranchOptions] = useState([])
  const [partner, setPartner] = useState([])
  const [license, setLicense] = useState([])
  const [tableData, setTableData] = useState([])
  console.log(tableData)
  const [licenseAvailable, setLicenseAvailable] = useState(true)
  const [showProductPopup, setShowProductPopup] = useState(false)
  const [popupType, setPopupType] = useState("")
  const [editIndex, setEditIndex] = useState(null)

  const selectedProduct = watch("productName")
  const registrationType = watch("registrationType")
  const watchedLicense = watch("licensenumber")
  const watchedTaggedLicenses = watch("taggedLicenses") || []
  const watchedTaggedLicenseDueDates = watch("taggedLicenseDueDates") || {}
  const hasTaggedLicenses =
    popupType === "Additionalservice" && watchedTaggedLicenses.length > 0

  const { data: licensenumber } = UseFetch("customer/getLicensenumber")
  const { data: partners } = UseFetch("customer/getallpartners")
  // const {
  //   data: productData,
  //   error: productError
  // } = UseFetch(
  //   loggeduserBranch,
  //   `product/getallProducts?branchselected=${encodeURIComponent(
  //     JSON.stringify(loggeduserBranch)
  //   )}`
  // )
  const { data: productData, error: productError } = UseFetch(
    loggeduserBranch &&
      `/product/getallProducts?branchselected=${encodeURIComponent(
        JSON.stringify(loggeduserBranch)
      )}`
  )

  const debouncedLicenseNo = useDebounce(watchedLicense, 1000)

  const softwareTrades = [
    "Agriculture",
    "Business Services",
    "Computer Hardware Software",
    "Electronics Electrical Supplies",
    "FMCG-Fast Moving Consumable Goods",
    "Garment,Fashion Apparel",
    "Health Beauty",
    "Industrial Supplies",
    "Jewelry Gemstones",
    "Mobile Accessories",
    "Pharmaceutical Chemicals",
    "Textiles Chemicals",
    "Textiles Fabrics",
    "Others",
    "Restaurant, Food And Beverage",
    "Accounts Chartered Account",
    "Stationery, Printing Publishing",
    "Hotel",
    "Pipes, Tubes Fittings"
  ]

  const industries = [
    "Whole sailor/Distributors",
    "Retailer",
    "Manufacturer",
    "Service",
    "Works Contract"
  ]

  useEffect(() => {
    const user = getLocalStorageItem("user")
    if (user) {
    }
  }, [])

  useEffect(() => {
    if (partners) {
      setPartner(partners)
    }
  }, [partners])

  useEffect(() => {
    if (productData) {
      console.log(productData)
      setProductOptions(
        productData.map((product) => ({
          label: product.productName,
          value: product._id,
          shortName: product?.shortName,
          productorservicetype: product.productorservicetype
        }))
      )
    }
  }, [productData])

  useEffect(() => {
    if (licensenumber) {
      setLicense(licensenumber)
    }
  }, [licensenumber])

  useEffect(() => {
    if (productError) {
      console.log(productError)
      toast.error(
        productError?.response?.data?.message || "Something went wrong!"
      )
    }
  }, [productError])

  const formatDateToDDMMYYYY = (dateValue) => {
    if (!dateValue) return ""
    const date = new Date(dateValue)
    if (Number.isNaN(date.getTime())) return ""
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  useEffect(() => {
    if (customer) {
      reset({
        customerName: customer?.customerName || "",
        address1: customer?.address1 || "",
        address2: customer?.address2 || "",
        country: customer?.country || "",
        state: customer?.state || "",
        city: customer?.city || "",
        pincode: customer?.pincode || "",
        contactPerson: customer?.contactPerson || "",
        email: customer?.email || "",
        mobile: customer?.mobile || "",
        landline: customer?.landline || "",
        partner: customer?.partner || "",
        industry: customer?.industry || "",
        registrationType: customer?.registrationType || "",
        gstNo: customer?.gstNo || "",
        productName: null,
        companyName: null,
        branchName: null,
        licensenumber: "",
        softwareTrade: "",
        applicationDate: "",
        nextDue: "",
        noofusers: "",
        productAmount: "",
        isActive: "Running",
        taggedLicenses: [],
        taggedLicenseDueDates: {}
      })
      console.log(customer.selected)
      const selectedData =
        customer?.selected?.map((sel) => ({
          company_id: sel?.company_id?._id,
          companyName: sel?.company_id?.companyName,
          branch_id: sel?.branch_id?._id,
          branchName: sel?.branch_id?.branchName,
          product_id: sel?.product_id?._id,
          productName: sel?.product_id?.productName,
          shortName: sel?.product_id?.shortName,
          licensenumber: sel?.licensenumber,
          softwareTrade: sel?.softwareTrade,
          applicationDate: sel?.customerAddDate,
          nextDue: sel?.nextDue,
          noofusers: sel?.noofusers,
          productAmount: sel?.productAmount,

          isActive: sel?.isActive || "Running",
          productorservicetype: sel?.product_id?.productorservicetype,
          taggedLicenses:
            sel?.taggedLicenses ||
            sel?.licenseNumbers ||
            sel?.taggeddata?.map((item) => String(item?.licensenumber)) ||
            [],
          taggeddata: sel?.taggeddata || []
        })) || []
      console.log(selectedData)
      setTableData(selectedData)
    }
  }, [customer, reset])

  useEffect(() => {
    if (!debouncedLicenseNo || !String(debouncedLicenseNo).trim()) return

    const checkLicense = license.find(
      (item) => String(item?.licensenumber) === String(debouncedLicenseNo)
    )

    const currentEditing = editIndex !== null ? tableData[editIndex] : null
    const isSameEditingLicense =
      currentEditing &&
      String(currentEditing?.licensenumber) === String(debouncedLicenseNo)

    setLicenseAvailable(!(checkLicense && !isSameEditingLicense))
  }, [debouncedLicenseNo, license, editIndex, tableData])

  const getCompaniesForProduct = (productId) => {
    const product = productData?.find((item) => item._id === productId)
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
    const product = productData?.find((item) => item._id === productId)
    if (!product) return []

    return product.selected
      .filter((c) => c.company_id === companyId)
      .map((branch) => ({
        label: branch.branchName,
        value: branch.branch_id
      }))
  }

  const primaryLicenseOptions = useMemo(() => {
    return [
      ...new Set(
        tableData
          .filter(
            (item) =>
              String(item?.productorservicetype).toLowerCase() ===
              "primaryproduct"
          )
          .map((item) => String(item?.licensenumber).trim())
          .filter(Boolean)
      )
    ]
  }, [tableData])

  const handleProductChange = (selectedOption) => {
    console.log(selectedOption)
    setValue("productName", selectedOption)
    setValue("shortName", selectedOption?.shortName)
    setValue("companyName", null)
    setValue("branchName", null)
    setValue("licensenumber", "")
    setValue("taggedLicenses", [])
    setValue("taggedLicenseDueDates", {})
    setCompanyOptions(getCompaniesForProduct(selectedOption?.value))
    setBranchOptions([])
  }

  const handleCompanyChange = (selectedCompanyOption) => {
    setValue("companyName", selectedCompanyOption)
    setValue("branchName", null)

    const branches = getBranchesForCompany(
      getValues("productName")?.value,
      selectedCompanyOption?.value
    )
    setBranchOptions(branches)
  }
  console.log(tableData)
  const handleBranchChange = (selectedBranchOption) => {
    setValue("branchName", selectedBranchOption)
  }

  const openAddPopup = (type) => {
    setPopupType(type)
    setEditIndex(null)

    reset({
      ...getValues(),
      productName: null,
      companyName: null,
      branchName: null,
      licensenumber: "",
      shortName: null,
      softwareTrade: "",
      applicationDate: "",
      nextDue: "",
      noofusers: "",
      productAmount: "",
      isActive: "Running",
      taggedLicenses: [],
      taggedLicenseDueDates: {}
    })

    setCompanyOptions([])
    setBranchOptions([])
    setShowProductPopup(true)
  }

  const closePopup = () => {
    setShowProductPopup(false)
    setPopupType("")
    setEditIndex(null)
    clearErrors()
  }
  console.log(tableData)
  console.log(licenseloading)
  const handleLicenseBlur = async (licenseNumber) => {
    console.log(licenseNumber)
    if (!String(licenseNumber).trim()) return
    console.log(licenseNumber)
    try {
      console.log(tableData)
      const existsInTable = tableData?.some(
        (row) => String(row?.licensenumber) === String(licenseNumber)
      )
      if (existsInTable) {
        toast.error(`License ${licenseNumber} already exists`)
        return
      }

      setlicenseloading(true)
      const { data } = await api.get(
        `/customer/checkLicense?licenseNumber=${licenseNumber}`
      )
      console.log(data)
      if (data.exists) {
        toast.error(`License ${licenseNumber} already exists`)

        // setSelectedLeadList((prev) =>
        //   prev.map((row, i) => (i === index ? { ...row } : row))
        // )

        return
      }
      // setlicenseloading(false)
      toast.success("License available")
    } catch (error) {
      // setlicenseloading(false)
      console.error(error)
      toast.error("Failed to validate license")
    } finally {
      setlicenseloading(false)
    }
  }

  const handleEdit = (item, index) => {
    console.log(item)
    console.log(index)
    setPopupType(item?.productorservicetype)
    setEditIndex(index)

    const productOption = productOptions.find(
      (p) => p.value === item?.product_id
    ) || {
      label: item?.productName,
      value: item?.product_id
    }

    const companyOption = item?.company_id
      ? { label: item?.companyName, value: item?.company_id }
      : null

    const branchOption = item?.branch_id
      ? { label: item?.branchName, value: item?.branch_id }
      : null

    const taggedLicensesFromData =
      item?.taggeddata?.map((entry) => String(entry?.licensenumber)) ||
      item?.taggedLicenses ||
      []

    const taggedLicenseDueDatesFromData =
      item?.taggeddata?.reduce((acc, entry) => {
        if (entry?.licensenumber) {
          acc[String(entry.licensenumber)] = entry?.nextDue || ""
        }
        return acc
      }, {}) || {}

    setCompanyOptions(getCompaniesForProduct(item?.productid))
    setBranchOptions(getBranchesForCompany(item?.productid, item?.companyid))
    console.log(item)
    reset({
      ...getValues(),
      productName: productOption,
      companyName: companyOption,
      branchName: branchOption,
      licensenumber: item?.licensenumber || "",
      softwareTrade: item?.softwareTrade || "",
      applicationDate: item?.applicationDate || "",
      nextDue: item?.nextDue || "",
      noofusers: item?.noofusers || "",
      productAmount: item?.productAmount || "",
      isActive: item?.isActive || "Running",
      taggedLicenses: taggedLicensesFromData,
      taggedLicenseDueDates: taggedLicenseDueDatesFromData
    })
    console.log("hh")
    setShowProductPopup(true)
  }

  const handleDelete = (index) => {
    setTableData((prev) => prev.filter((_, i) => i !== index))
  }

  const savePopupData = () => {
    const values = getValues()

    if (!values?.productName?.value) {
      toast.error("Please select product/service")
      return
    }

    if (
      popupType === "Primaryproduct" &&
      !String(values?.licensenumber || "").trim()
    ) {
      setError("licensenumber", {
        type: "manual",
        message: "License number is required for primary product"
      })
      return
    }

    if (
      popupType === "Primaryproduct" &&
      String(values?.licensenumber || "").trim() &&
      !licenseAvailable
    ) {
      setError("licensenumber", {
        type: "manual",
        message: "License number already exists"
      })
      return
    }

    const selectedTaggedLicenses =
      popupType === "Additionalservice" ? values?.taggedLicenses || [] : []

    const dueMap =
      popupType === "Additionalservice"
        ? values?.taggedLicenseDueDates || {}
        : {}

    if (
      popupType === "Additionalservice" &&
      selectedTaggedLicenses.length > 0
    ) {
      const hasEmptyDueDate = selectedTaggedLicenses.some(
        (licenseNo) => !String(dueMap[String(licenseNo)] || "").trim()
      )

      if (hasEmptyDueDate) {
        toast.error("Please enter due date for all tagged licenses")
        return
      }
    }

    const taggeddata =
      popupType === "Additionalservice" && selectedTaggedLicenses.length > 0
        ? selectedTaggedLicenses.map((licenseNo) => ({
            licensenumber: Number(licenseNo),
            nextDue: dueMap[String(licenseNo)] || ""
          }))
        : []

    const row = {
      company_id: values?.companyName?.value,
      companyName: values?.companyName?.label,
      branch_id: values?.branchName?.value,
      branchName: values?.branchName?.label,
      product_id: values?.productName?.value,
      productName: values?.productName?.label,
      shortName: values?.shortName,
      licensenumber:
        popupType === "Additionalservice" && taggeddata.length > 0
          ? null
          : values?.licensenumber
            ? Number(values.licensenumber)
            : null,
      softwareTrade:
        popupType === "Primaryproduct" ? values?.softwareTrade : "",
      applicationDate:
        popupType === "Primaryproduct" ? values?.applicationDate : "",
      nextDue:
        popupType === "Additionalservice" && taggeddata.length > 0
          ? null
          : values?.nextDue || "",
      noofusers: values?.noofusers ? Number(values.noofusers) : 0,
      productAmount: values?.productAmount ? Number(values.productAmount) : 0,
      isActive: values?.isActive || "Running",
      productorservicetype: popupType,
      taggeddata,
      taggedLicenses: selectedTaggedLicenses
    }

    setTableData((prev) => {
      const updated = [...prev]
      if (editIndex !== null) {
        updated[editIndex] = row
      } else {
        updated.push(row)
      }
      return updated
    })

    closePopup()
  }

  const filteredOptionsByType = useMemo(() => {
    return productOptions.filter(
      (item) =>
        String(item?.productorservicetype).toLowerCase() ===
        String(popupType).toLowerCase()
    )
  }, [productOptions, popupType])

  const primaryProducts = useMemo(() => {
    return tableData.filter(
      (item) =>
        String(item?.productorservicetype).toLowerCase() === "primaryproduct"
    )
  }, [tableData])
  console.log(tableData)
  console.log(primaryProducts)
  const additionalServices = useMemo(() => {
    return tableData.filter(
      (item) =>
        String(item?.productorservicetype).toLowerCase() === "additionalservice"
    )
  }, [tableData])
  console.log(additionalServices)
  const onSubmit = async (data) => {
    console.log(data)
    console.log(tableData)
    console.log(submissionloader)
    if (submissionloader) return
    setsubmissionloader(true)
    try {
      if (process === "Registration") {
        await handleCustomerData(data, tableData)
        reset()
        setTableData([])
      } else if (process === "edit") {
        await handleEditedData(data, tableData, customer?.index)
      }
    } catch (error) {
      toast.error("Failed to save customer!")
    } finally {
      setsubmissionloader(false)
    }
  }

  const compactSelectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "36px",
      borderRadius: "8px",
      borderColor: state.isFocused ? "#7ba7ff" : "#dfe5ee",
      boxShadow: "none",
      fontSize: "12px",
      "&:hover": {
        borderColor: "#7ba7ff"
      }
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0 8px"
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: "36px"
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999
    })
  }

  return (
    <div className="min-h-screen bg-[#ADD8E6] px-3 py-6 md:px-6">
      <div className="mx-auto max-w-[1180px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* your existing top customer form UI remains same */}
          <div className="rounded-[20px] border border-[#edf1f7] bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.05)] md:p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef5ff] text-[#4b87ff]">
                  <FaUser size={14} />
                </div>
                <div>
                  <h2 className="text-[16px] font-semibold text-[#162033]">
                    Customer Details
                  </h2>
                  <p className="text-[12px] text-[#7f8aa3]">
                    Fill customer master information
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigatebackto ? navigate(navigatebackto) : navigate(-1)
                }
                className="rounded-md border border-[#e6ebf3] bg-white px-3 py-2 text-[12px] font-medium text-[#6d7890] hover:bg-[#f8fafc]"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              <InfoInputCard
                icon={<FaUser size={12} />}
                iconBg="bg-[#edf6ff]"
                iconColor="text-[#5aa2ff]"
                label="Customer Name"
                error={errors.customerName?.message}
              >
                <input
                  type="text"
                  {...register("customerName", {
                    required: "Customer name is required"
                  })}
                  onBlur={(e) =>
                    setValue("customerName", e.target.value.trim())
                  }
                  className={tileInputClass}
                  placeholder="Enter customer name"
                />
              </InfoInputCard>

              <InfoInputCard
                icon={<FaHashtag size={12} />}
                iconBg="bg-[#f4efff]"
                iconColor="text-[#8a5eff]"
                label="Pincode"
              >
                <input
                  type="number"
                  {...register("pincode")}
                  onBlur={(e) => setValue("pincode", e.target.value.trim())}
                  className={tileInputClass}
                  placeholder="Pincode"
                />
              </InfoInputCard>

              <InfoInputCard
                icon={<FaBuilding size={12} />}
                iconBg="bg-[#fff4ea]"
                iconColor="text-[#f0a24d]"
                label="City"
              >
                <input
                  type="text"
                  {...register("city")}
                  onBlur={(e) => setValue("city", e.target.value.trim())}
                  className={tileInputClass}
                  placeholder="City"
                />
              </InfoInputCard>

              <InfoInputCard
                icon={<FaEnvelope size={12} />}
                iconBg="bg-[#eefbf2]"
                iconColor="text-[#4cbf73]"
                label="Email"
                error={errors.email?.message}
              >
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Invalid email address"
                    }
                  })}
                  onBlur={(e) => setValue("email", e.target.value.trim())}
                  className={tileInputClass}
                  placeholder="Email"
                />
              </InfoInputCard>

              <InfoInputCard
                icon={<FaMapMarkerAlt size={12} />}
                iconBg="bg-[#fff0f8]"
                iconColor="text-[#ef7db2]"
                label="Address 1"
              >
                <input
                  type="text"
                  {...register("address1")}
                  onBlur={(e) => setValue("address1", e.target.value.trim())}
                  className={tileInputClass}
                  placeholder="Address line 1"
                />
              </InfoInputCard>

              <InfoInputCard
                icon={<FaUser size={12} />}
                iconBg="bg-[#ebfbfb]"
                iconColor="text-[#43c7cb]"
                label="Contact Person"
              >
                <input
                  type="text"
                  {...register("contactPerson")}
                  onBlur={(e) =>
                    setValue("contactPerson", e.target.value.trim())
                  }
                  className={tileInputClass}
                  placeholder="Contact person"
                />
              </InfoInputCard>

              <InfoInputCard
                icon={<FaPhone size={12} />}
                iconBg="bg-[#edf9f0]"
                iconColor="text-[#45bf6b]"
                label="Mobile No"
              >
                <input
                  type="tel"
                  {...register("mobile")}
                  onBlur={(e) => setValue("mobile", e.target.value.trim())}
                  className={tileInputClass}
                  placeholder="Mobile number"
                />
              </InfoInputCard>

              <InfoInputCard
                icon={<FaLandmark size={12} />}
                iconBg="bg-[#fff8df]"
                iconColor="text-[#d1a91b]"
                label="Partnership"
              >
                <select {...register("partner")} className={tileInputClass}>
                  <option value="">Select Partner</option>
                  {partner?.map((partnr, index) => (
                    <option key={index} value={partnr.id}>
                      {partnr.partner}
                    </option>
                  ))}
                </select>
              </InfoInputCard>

              <InfoInputCard
                icon={<FaMapMarkerAlt size={12} />}
                iconBg="bg-[#eef5ff]"
                iconColor="text-[#3879f2]"
                label="Address 2"
              >
                <input
                  type="text"
                  {...register("address2")}
                  onBlur={(e) => setValue("address2", e.target.value.trim())}
                  className={tileInputClass}
                  placeholder="Address line 2"
                />
              </InfoInputCard>

              <InfoInputCard
                icon={<FaBuilding size={12} />}
                iconBg="bg-[#edf7ff]"
                iconColor="text-[#4f98ff]"
                label="State"
              >
                <input
                  type="text"
                  {...register("state")}
                  onBlur={(e) => setValue("state", e.target.value.trim())}
                  className={tileInputClass}
                  placeholder="State"
                />
              </InfoInputCard>

              <InfoInputCard
                icon={<FaGlobeAsia size={12} />}
                iconBg="bg-[#fff2e8]"
                iconColor="text-[#ef9a47]"
                label="Country"
              >
                <input
                  type="text"
                  {...register("country")}
                  onBlur={(e) => setValue("country", e.target.value.trim())}
                  className={tileInputClass}
                  placeholder="Country"
                />
              </InfoInputCard>

              <InfoInputCard
                icon={<FaPhone size={12} />}
                iconBg="bg-[#fff1f6]"
                iconColor="text-[#f07ab1]"
                label="Landline No"
              >
                <input
                  type="tel"
                  {...register("landline")}
                  onBlur={(e) => setValue("landline", e.target.value.trim())}
                  className={tileInputClass}
                  placeholder="Landline"
                />
              </InfoInputCard>

              <InfoInputCard
                icon={<FaStar size={12} />}
                iconBg="bg-[#eef4ff]"
                iconColor="text-[#6d86ff]"
                label="Industry"
              >
                <select {...register("industry")} className={tileInputClass}>
                  <option value="">Select Industry</option>
                  {industries.map((industry, index) => (
                    <option key={index} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </InfoInputCard>

              <InfoInputCard
                icon={<FaHashtag size={12} />}
                iconBg="bg-[#f5f0ff]"
                iconColor="text-[#9967ff]"
                label="Registration Type"
                error={errors.registrationType?.message}
              >
                <select
                  {...register("registrationType", {
                    required: "RegistrationType is required"
                  })}
                  className={tileInputClass}
                >
                  <option value="">Select RegistrationType</option>
                  <option value="unregistered">Unregistered/Consumer</option>
                  <option value="regular">Regular</option>
                </select>
              </InfoInputCard>

              {registrationType === "regular" && (
                <InfoInputCard
                  icon={<FaLandmark size={12} />}
                  iconBg="bg-[#fff1f7]"
                  iconColor="text-[#ee82a9]"
                  label="GSTIN / UIN"
                >
                  <input
                    type="text"
                    {...register("gstNo")}
                    onBlur={(e) => setValue("gstNo", e.target.value.trim())}
                    className={tileInputClass}
                    placeholder="Enter GSTIN"
                  />
                </InfoInputCard>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[14px] border border-[#edf1f7] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
              <div className="flex items-center justify-between border-b border-[#f1f4f8] px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#eef5ff] text-[#3a7afe]">
                    <FaBuilding size={10} />
                  </div>
                  <h3 className="text-[13px] font-semibold text-[#1b2437]">
                    Primary Products
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => openAddPopup("Primaryproduct")}
                  className="text-[11px] font-medium text-[#2f80ed] hover:underline"
                >
                  Add Product
                </button>
              </div>

              <div className="min-h-[180px] px-4 py-5">
                {primaryProducts.length > 0 ? (
                  <div className="flex flex-wrap gap-4">
                    {primaryProducts.map((item) => {
                      const actualIndex = tableData.findIndex((x) => x === item)
                      const isDeactive =
                        String(item?.isActive).toLowerCase() === "deactive"

                      return (
                        <ProductCircleCard
                          key={`primary-${actualIndex}`}
                          item={item}
                          productType="Primaryproduct"
                          actualIndex={actualIndex}
                          variant={isDeactive ? "danger" : "success"}
                          topBadgeIcon={<FaBuilding size={10} />}
                          line1={
                            item?.shortName
                              ? item?.shortName
                              : item?.productName
                          }
                          line2={item?.licensenumber}
                          line3={
                            item?.applicationDate
                              ? formatDateToDDMMYYYY(item?.applicationDate)
                              : ""
                          }
                          line4={isDeactive ? "De Active" : "Active"}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex h-[140px] items-center justify-center rounded-[12px] border border-dashed border-[#e7ebf4] bg-[#fbfcff] text-[12px] text-[#8a95ab]">
                    No primary products added.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[14px] border border-[#edf1f7] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
              <div className="flex items-center justify-between border-b border-[#f1f4f8] px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#eef5ff] text-[#3a7afe]">
                    <FaBuilding size={10} />
                  </div>
                  <h3 className="text-[13px] font-semibold text-[#1b2437]">
                    Additional Services
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => openAddPopup("Additionalservice")}
                  className="text-[11px] font-medium text-[#2f80ed] hover:underline"
                >
                  Add Service
                </button>
              </div>

              <div className="min-h-[180px] px-4 py-5">
                {additionalServices.length > 0 ? (
                  <div className="flex flex-wrap gap-4">
                    {additionalServices.map((item) => {
                      const actualIndex = tableData.findIndex((x) => x === item)
                      const isDeactive =
                        String(item?.isActive).toLowerCase() === "deactive"
                      return (
                        <ProductCircleCard
                          key={`additional-${actualIndex}`}
                          item={item}
                          productType="Additionalservice"
                          actualIndex={actualIndex}
                          variant="service"
                          topBadgeIcon={<FaBuilding size={10} />}
                          line1={
                            item?.shortName
                              ? item?.shortName
                              : item?.productName
                          }
                          line2={
                            Array.isArray(item?.taggeddata) &&
                            item.taggeddata.length > 0
                              ? item.taggeddata
                                  .map((x) => x.licensenumber)
                                  .join(", ")
                                  .slice(0, 18)
                              : item?.licensenumber
                          }
                          line3={
                            item?.taggeddata?.length > 0
                              ? formatDateToDDMMYYYY(
                                  item?.taggeddata?.[0]?.nextDue
                                )
                              : item?.nextDue
                                ? formatDateToDDMMYYYY(item?.nextDue)
                                : ""
                          }
                          line4={isDeactive ? "De Active" : "Active"}
line5={item?.productAmount}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex h-[140px] flex-col items-center justify-center rounded-[12px] border border-dashed border-[#e7ebf4] bg-[#fbfcff] text-center">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#f2f4f8] text-[#9ca8be]">
                      <FaBuilding size={12} />
                    </div>
                    <p className="text-[12px] text-[#76839d]">
                      No additional services added.
                    </p>
                    <p className="mt-1 text-[11px] text-[#a0abc0]">
                      Click Add Service to get started.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() =>
                navigatebackto ? navigate(navigatebackto) : navigate(-1)
              }
              className="rounded-lg border border-[#f1c7cc] bg-white px-5 py-2.5 text-[13px] font-semibold text-[#d65b68] hover:bg-[#fff6f7]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-[#1f2937] px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#111827] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Submitting..."
                : process === "Registration"
                  ? "Save"
                  : "Update"}
            </button>
          </div>
        </form>
      </div>
      {licenseloading && <FullScreenLoader text="Checking..." />}

      {showProductPopup && (
        <div className="fixed inset-0 z-50 bg-black/30 p-2 sm:p-3">
          <div className="flex min-h-full items-center justify-center">
            <div className="flex w-full max-w-3xl max-h-[92vh] flex-col overflow-hidden rounded-[14px] bg-white shadow-2xl">
              <div className="flex shrink-0 items-center justify-between border-b border-[#edf1f7] px-3 py-2.5">
                <div>
                  <h3 className="text-[14px] font-semibold text-[#162033]">
                    {popupType === "Primaryproduct"
                      ? "Primary Product"
                      : "Additional Service"}
                  </h3>
                  <p className="text-[10px] text-[#7f8aa3]">
                    Add product or service details
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closePopup}
                  className="rounded-full p-1 text-[#7f8aa3] hover:bg-[#f4f7fb]"
                >
                  <FaTimes size={14} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-2.5">
                <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-[#5d6983]">
                      Product / Service
                    </label>
                    <Controller
                      name="productName"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={filteredOptionsByType}
                          value={field.value}
                          onChange={(option) => {
                            field.onChange(option)
                            handleProductChange(option)
                          }}
                          placeholder="Select name"
                          styles={compactSelectStyles}
                        />
                      )}
                    />
                  </div>

                  <PopupField
                    label="Short Name"
                    error={errors.shortName?.message}
                  >
                    <input
                      readOnly
                      {...register("shortName")}
                      className="w-full cursor-not-allowed rounded-[8px] border border-[#dfe5ee] bg-[#f3f6fb] px-2.5 py-1.5 text-[12px] text-[#1f2a3d] outline-none"
                      placeholder="Enter Short Name"
                    />
                  </PopupField>

                  <PopupField label="Company">
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
                          placeholder="Select company"
                          isDisabled={!selectedProduct}
                          styles={compactSelectStyles}
                        />
                      )}
                    />
                  </PopupField>

                  <PopupField label="Branch">
                    <Controller
                      name="branchName"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={branchOptions}
                          value={field.value}
                          onChange={(option) => {
                            field.onChange(option)
                            handleBranchChange(option)
                          }}
                          placeholder="Select branch"
                          isDisabled={!watch("companyName")}
                          styles={compactSelectStyles}
                        />
                      )}
                    />
                  </PopupField>

                  <PopupField
                    label="License Number"
                    error={
                      errors.licensenumber?.message ||
                      (!licenseAvailable && watchedLicense
                        ? "License number already exists"
                        : "")
                    }
                  >
                    <input
                      {...register("licensenumber")}
                      readOnly={hasTaggedLicenses}
                      className={`${compactPopupInputClass} ${
                        hasTaggedLicenses
                          ? "cursor-not-allowed bg-[#f3f6fb]"
                          : ""
                      }`}
                      placeholder={
                        popupType === "Primaryproduct"
                          ? "Enter license number"
                          : hasTaggedLicenses
                            ? "Auto handled by tagged licenses"
                            : "Enter license number"
                      }
                      onChange={(e) => {
                        console.log(primaryProducts.length)
                        console.log(additionalServices.length)
                        console.log(hasTaggedLicenses)
                        if (hasTaggedLicenses) return
                        let index = 0
                        if (popupType === "Primaryproduct") {
                          if (primaryProducts.length > 0) {
                            index++
                          }
                          console.log("hhh")
                        } else if (popupType === "Additionalservice") {
                          console.log("hh")
                          if (additionalServices.length > 0) {
                            index++
                          }
                        }
                        setValue("licensenumber", e.target.value)
                        console.log(index)
                        if (debounceTimersRef.current[index]) {
                          clearTimeout(debounceTimersRef.current[index])
                        }
                        const licenseValue = e.target.value
                        console.log(licenseValue)
                        debounceTimersRef.current[index] = setTimeout(() => {
                          handleLicenseBlur(licenseValue)
                          delete debounceTimersRef.current[index]
                        }, 1000)
                        clearErrors("licensenumber")
                      }}
                    />
                  </PopupField>

                  {popupType === "Primaryproduct" && (
                    <PopupField label="Software Trade">
                      <select
                        {...register("softwareTrade")}
                        className={compactPopupInputClass}
                      >
                        <option value="">Select Software Trade</option>
                        {softwareTrades.map((trade, index) => (
                          <option key={index} value={trade}>
                            {trade}
                          </option>
                        ))}
                      </select>
                    </PopupField>
                  )}

                  {popupType === "Primaryproduct" && (
                    <PopupField label="Application Date">
                      <input
                        type="date"
                        {...register("applicationDate")}
                        className={compactPopupInputClass}
                      />
                    </PopupField>
                  )}

                  {popupType === "Additionalservice" && !hasTaggedLicenses && (
                    <PopupField label="Next Due">
                      <input
                        type="date"
                        {...register("nextDue")}
                        className={compactPopupInputClass}
                      />
                    </PopupField>
                  )}

                  <PopupField label="No of Quantity / Users">
                    <input
                      type="number"
                      {...register("noofusers")}
                      // className={`${compactPopupInputClass} no-spinner`}
                      className={`${compactPopupInputClass} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0`}
                    />
                  </PopupField>

                  <PopupField label="Amount">
                    <input
                      type="number"
                      {...register("productAmount")}
                      // className={compactPopupInputClass}
                      className={`${compactPopupInputClass} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0`}
                    />
                  </PopupField>

                  <PopupField label="Status">
                    <select
                      {...register("isActive")}
                      className={compactPopupInputClass}
                    >
                      <option value="Running">Active</option>
                      <option value="Deactive">Deactive</option>
                    </select>
                  </PopupField>

                  {popupType === "Additionalservice" && (
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-[11px] font-medium text-[#5d6983]">
                        Tagged License Numbers
                      </label>

                      <div className="max-h-28 overflow-y-auto rounded-[8px] border border-[#e7ebf4] bg-[#fafcff] p-2">
                        {primaryLicenseOptions.length > 0 ? (
                          <div className="grid grid-cols-1 gap-1.5 md:grid-cols-2">
                            {primaryLicenseOptions.map((licenseNo) => {
                              const selectedTaggedLicenses =
                                watch("taggedLicenses") || []
                              const checked = selectedTaggedLicenses.includes(
                                String(licenseNo)
                              )

                              return (
                                <label
                                  key={licenseNo}
                                  className="flex items-center gap-2 rounded-md border border-[#edf1f7] bg-white px-2 py-1.5 text-[11px] text-[#4f5d78]"
                                >
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={(e) => {
                                      const prev = watch("taggedLicenses") || []
                                      const dueMap =
                                        watch("taggedLicenseDueDates") || {}

                                      if (e.target.checked) {
                                        setValue("taggedLicenses", [
                                          ...prev,
                                          String(licenseNo)
                                        ])
                                        setValue("licensenumber", "")
                                        setValue("taggedLicenseDueDates", {
                                          ...dueMap,
                                          [String(licenseNo)]:
                                            dueMap[String(licenseNo)] || ""
                                        })
                                      } else {
                                        const updatedLicenses = prev.filter(
                                          (item) =>
                                            String(item) !== String(licenseNo)
                                        )

                                        const updatedDueMap = { ...dueMap }
                                        delete updatedDueMap[String(licenseNo)]

                                        setValue(
                                          "taggedLicenses",
                                          updatedLicenses
                                        )
                                        setValue(
                                          "taggedLicenseDueDates",
                                          updatedDueMap
                                        )

                                        if (updatedLicenses.length === 0) {
                                          setValue("licensenumber", "")
                                        }
                                      }
                                    }}
                                  />
                                  <span>{licenseNo}</span>
                                </label>
                              )
                            })}
                          </div>
                        ) : (
                          <p className="text-[11px] italic text-[#96a0b5]">
                            No primary product license numbers available.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {popupType === "Additionalservice" && hasTaggedLicenses && (
                    <div className="md:col-span-2">
                      <label className="mb-1.5 block text-[11px] font-medium text-[#5d6983]">
                        Tagged License Due Details
                      </label>

                      <div className="overflow-hidden rounded-[8px] border border-[#e7ebf4]">
                        <div className="max-h-40 overflow-y-auto">
                          <table className="w-full border-collapse">
                            <thead className="sticky top-0 bg-[#f8fafc]">
                              <tr>
                                <th className="border-b border-[#e7ebf4] px-2.5 py-1.5 text-left text-[11px] font-semibold text-[#43506a]">
                                  License Number
                                </th>
                                <th className="border-b border-[#e7ebf4] px-2.5 py-1.5 text-left text-[11px] font-semibold text-[#43506a]">
                                  Next Due
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {watchedTaggedLicenses.map((licenseNo) => (
                                <tr key={licenseNo}>
                                  <td className="border-b border-[#eef2f7] px-2.5 py-1.5">
                                    <input
                                      value={licenseNo}
                                      readOnly
                                      className="w-full cursor-not-allowed rounded-[7px] border border-[#dfe5ee] bg-[#f3f6fb] px-2 py-1.5 text-[11px] text-[#1f2a3d] outline-none"
                                    />
                                  </td>
                                  <td className="border-b border-[#eef2f7] px-2.5 py-1.5">
                                    <input
                                      type="date"
                                      value={
                                        watchedTaggedLicenseDueDates?.[
                                          licenseNo
                                        ] || ""
                                      }
                                      onChange={(e) => {
                                        const dueMap =
                                          watch("taggedLicenseDueDates") || {}
                                        setValue("taggedLicenseDueDates", {
                                          ...dueMap,
                                          [licenseNo]: e.target.value
                                        })
                                      }}
                                      className={compactPopupInputClass}
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 justify-end gap-2 border-t border-[#edf1f7] bg-white px-3 py-2.5">
                <button
                  type="button"
                  onClick={closePopup}
                  className="rounded-md border border-[#e4e9f2] px-3 py-1.5 text-[12px] text-[#5c6981] hover:bg-[#f8fafc]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={savePopupData}
                  className="rounded-md bg-[#2f80ed] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[#246cd0]"
                >
                  {editIndex !== null ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const InfoInputCard = ({ icon, iconBg, iconColor, label, children, error }) => {
  return (
    <div className="rounded-[14px] border border-[#edf1f7] bg-white px-3 py-3 transition hover:border-[#dbe6ff]">
      <div className="flex items-start gap-3">
        <div
          className={`mt-[2px] flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <p className="mb-1 text-[11px] font-medium text-[#8c96ad]">{label}</p>
          {children}
          {error ? (
            <p className="mt-1 text-[11px] text-red-500">{error}</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

const PopupField = ({ label, children, error }) => {
  return (
    <div>
      <label className="mb-1 block text-[12px] font-medium text-[#5d6983]">
        {label}
      </label>
      {children}
      {error ? <p className="mt-1 text-[11px] text-red-500">{error}</p> : null}
    </div>
  )
}

// const ProductCircleCard = ({
//   item,
//   actualIndex,
//   productType,
//   variant,
//   topBadgeIcon,
//   line1,
//   line2,
//   line3,
//   line4,
// line5,
//   onEdit,
//   onDelete
// }) => {
//   const variantClass =
//     variant === "danger"
//       ? "bg-[#ffdedd] border-[#f4c6c2]"
//       : variant === "service"
//         ? "bg-[#fff3c9] border-[#f0e1a2]"
//         : "bg-[#dff3d2] border-[#cce6bc]"
//   console.log(line3)
//   console.log(line4)
//   return (
//   //   <div className="group relative">
//   //     <button
//   //       type="button"
//   //       onClick={() => onEdit(item, actualIndex)}
//   //       className={`relative flex h-[120px] w-[120px] flex-col items-center justify-center rounded-full border text-center shadow-sm transition hover:scale-[1.02] ${variantClass}`}
//   //     >
//   //       {/* <div className="mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-[#4e5a72] shadow-sm">
//   //         {topBadgeIcon}
//   //       </div> */}

//   //       <p className="px-2 text-[11px] font-medium leading-3 text-[#1e293b]">
//   //         {line1}
//   //       </p>

//   //       {line2 ? (
//   //         <p className="mt-1 px-2 text-[11px] leading-3 text-[#4b5563] font-medium">
//   //           {line2}
//   //         </p>
//   //       ) : null}
//   //       {line3 ? (
//   //         <p className="mt-1 px-2 text-[8.5px] font-semibold leading-3 text-[#d35c5c]">
//   //           {productType === "Primaryproduct" ? "App.Date" : "Due Date"} :{" "}
//   //           {line3}
//   //         </p>
//   //       ) : null}
//   //       {line4 ? (
//   //         <p
//   //           className={`mt-1 px-2 text-[10px] leading-3 text-[#4b5563] font-bold ${
//   //             line4 === "Active" ? "text-green-600" : "text-orange-500"
//   //           }`}
//   //         >
//   //           {line4}
//   //         </p>
//   //       ) : null}
//   // {line5 ? (
//   //         <p
//   //           className="mt-1 px-2 text-[10px] leading-3 text-[#0b66e6] font-bold "
//   //         >
//   //           Amount : {line5}
//   //         </p>
//   //       ) : null}

//   //       {/* {line3 ? (
//   //         <p className="mt-1 px-2 text-[8.5px] leading-3 text-[#4b5563]">
//   //           {`"NextDue":${line3}`}
//   //         </p>
//   //       ) : null} */}
//   //     </button>

//   //     <div className="absolute -right-2 -top-2 hidden gap-1 group-hover:flex">
//   //       <button
//   //         type="button"
//   //         onClick={() => onEdit(item, actualIndex)}
//   //         className="rounded-full bg-white p-2 text-green-600 shadow"
//   //       >
//   //         <FaEdit size={10} />
//   //       </button>
//   //       <button
//   //         type="button"
//   //         onClick={() => onDelete(actualIndex)}
//   //         className="rounded-full bg-white p-2 text-red-600 shadow"
//   //       >
//   //         <FaTrash size={10} />
//   //       </button>
//   //     </div>
//   //   </div>
// <div className="group relative">
//   {/* <button
//     type="button"
//     onClick={() => onEdit(item, actualIndex)}
//     className={`relative flex h-[120px] w-[120px] min-w-0 flex-col items-center justify-center rounded-full border text-center shadow-sm transition hover:scale-[1.02] ${variantClass}`}
//   >
//     <p className="px-2 text-[11px] font-medium leading-3 text-[#1e293b] text-wrap break-words">
//       {line1}
//     </p>

//     {line2 ? (
//       <p className="mt-1 px-2 text-[11px] leading-3 text-[#4b5563] font-medium text-wrap break-words">
//         {line2}
//       </p>
//     ) : null}

//     {line3 ? (
//       <p className="mt-1 px-2 text-[8.5px] font-semibold leading-3 text-[#d35c5c] text-wrap break-words">
//         {productType === "Primaryproduct" ? "App.Date" : "Due Date"} : {line3}
//       </p>
//     ) : null}

//     {line4 ? (
//       <p
//         className={`mt-1 px-2 text-[10px] leading-3 font-bold break-words ${
//           line4 === "Active" ? "text-green-600" : "text-orange-500"
//         }`}
//       >
//         {line4}
//       </p>
//     ) : null}

//     {line5 ? (
//       <p className="mt-1 px-2 text-[10px] leading-3 text-[#0b66e6] font-bold break-words">
//         Amount : {line5}
//       </p>
//     ) : null}
//   </button> */}
// <button
//   type="button"
//   onClick={() => onEdit(item, actualIndex)}
//   className={`relative flex h-[120px] w-[120px] flex-col items-center justify-center overflow-hidden rounded-full border text-center shadow-sm transition hover:scale-[1.02] ${variantClass}`}
// >
//   <div className="flex w-[76px] flex-col items-center justify-center">
//     <p className="w-full overflow-hidden text-center text-[10px] font-medium leading-[12px] text-[#1e293b] break-words line-clamp-2">
//       {line1}
//     </p>

//     {line2 ? (
//       <p className="mt-1 w-full truncate text-center text-[10px] leading-[12px] text-[#4b5563] font-medium">
//         {line2}
//       </p>
//     ) : null}

//     {line3 ? (
//       <p className="mt-1 w-full  text-center text-[10px] font-semibold leading-[11px] text-[#d35c5c]">
//         {productType === "Primaryproduct" ? "App.Date" : "Due Date"} : {line3}
//       </p>
//     ) : null}

//     {line4 ? (
//       <p
//         className={`mt-1 w-full truncate text-center text-[9px] font-bold leading-[11px] ${
//           line4 === "Active" ? "text-green-600" : "text-orange-500"
//         }`}
//       >
//         {line4}
//       </p>
//     ) : null}

//     {line5 ? (
//       <p className="mt-1 w-full truncate text-center text-[9px] font-bold leading-[11px] text-[#0b66e6]">
//         Amount : {line5}
//       </p>
//     ) : null}
//   </div>
// </button>

//   <div className="absolute -right-2 -top-2 hidden gap-1 group-hover:flex">
//     <button
//       type="button"
//       onClick={() => onEdit(item, actualIndex)}
//       className="rounded-full bg-white p-2 text-green-600 shadow"
//     >
//       <FaEdit size={10} />
//     </button>
//     <button
//       type="button"
//       onClick={() => onDelete(actualIndex)}
//       className="rounded-full bg-white p-2 text-red-600 shadow"
//     >
//       <FaTrash size={10} />
//     </button>
//   </div>
// </div>
//   )
// }
const ProductCircleCard = ({
  item,
  actualIndex,
  productType,
  variant,
  topBadgeIcon,
  line1,
  line2,
  line3,
  line4,
  line5,
  onEdit,
  onDelete,
}) => {
  const variantClass =
    variant === "danger"
      ? "bg-[#ffdedd] border-[#f4c6c2]"
      : variant === "service"
      ? "bg-[#fff3c9] border-[#f0e1a2]"
      : "bg-[#dff3d2] border-[#cce6bc]";

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={() => onEdit(item, actualIndex)}
        className={`relative flex h-[120px] w-[120px] flex-col items-center justify-center overflow-hidden rounded-full border text-center shadow-sm transition hover:scale-[1.02] ${variantClass}`}
      >
        {/* <div className="flex w-[76px] flex-col items-center justify-center">
          <p className="w-full overflow-hidden text-center text-[10px] font-medium leading-[12px] text-[#1e293b] break-words line-clamp-2">
            {line1}
          </p>

          {line2 ? (
            <p className="mt-1 w-full truncate text-center text-[10px] leading-[12px] text-[#4b5563] font-medium">
              {line2}
            </p>
          ) : null}

          {line3 ? (
            <p className="mt-1 w-full  text-center text-[10px] font-semibold leading-[11px] text-[#d35c5c]">
              {productType === "Primaryproduct" ? "App.Date" : "Due Date"} : {line3}
            </p>
          ) : null}

          {line4 ? (
            <p
              className={`mt-1 w-full truncate text-center text-[9px] font-bold leading-[11px] ${
                line4 === "Active" ? "text-green-600" : "text-orange-500"
              }`}
            >
              {line4}
            </p>
          ) : null}

          {line5 ? (
            <p className="mt-1 w-full truncate text-center text-[9px] font-bold leading-[11px] text-[#0b66e6]">
              Amount : {line5}
            </p>
          ) : null}
        </div> */}
<div className="flex w-[90px] flex-col items-center justify-center">
  <p className="w-full overflow-hidden text-center text-[10px] font-medium leading-[12px] text-[#1e293b] break-words line-clamp-2">
    {line1}
  </p>

  {line2 ? (
    <p className="mt-1 w-full truncate text-center text-[10px] leading-[12px] text-[#4b5563] font-medium">
      {line2}
    </p>
  ) : null}

  {line3 ? (
    <p className="mt-1 w-full whitespace-nowrap text-center text-[10px] font-semibold leading-[10px] text-[#d35c5c]">
      {productType === "Primaryproduct" ? "App.Date" : "Due Date"} : {line3}
    </p>
  ) : null}

  {line4 ? (
    <p
      className={`mt-1 w-full truncate text-center text-[9px] font-bold leading-[11px] ${
        line4 === "Active" ? "text-green-600" : "text-orange-500"
      }`}
    >
      {line4}
    </p>
  ) : null}

  {line5 ? (
    <p className="mt-1 w-full truncate text-center text-[9px] font-bold leading-[11px] text-[#0b66e6]">
      Amount : {line5}
    </p>
  ) : null}
</div>
      </button>

      <div className="absolute -right-2 -top-2 hidden gap-1 group-hover:flex">
        <button
          type="button"
          onClick={() => onEdit(item, actualIndex)}
          className="rounded-full bg-white p-2 text-green-600 shadow"
        >
          <FaEdit size={10} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(actualIndex)}
          className="rounded-full bg-white p-2 text-red-600 shadow"
        >
          <FaTrash size={10} />
        </button>
      </div>
    </div>
  );
};

const tileInputClass =
  "w-full border-0 bg-transparent p-0 text-[12px] font-medium text-[#1f2a3d] outline-none placeholder:text-[#c0c8d8]"

const compactPopupInputClass =
  "w-full rounded-[8px] border border-[#dfe5ee] bg-white px-2.5 py-1.5 text-[12px] text-[#1f2a3d] outline-none focus:border-[#7ba7ff]"

export default CustomerAdd
