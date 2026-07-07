// import React, { useEffect, useMemo, useState, useRef } from "react"
// import { useNavigate } from "react-router-dom"
// import Select from "react-select"
// import { useSelector } from "react-redux"
// import { useForm, Controller } from "react-hook-form"
// import { toast } from "react-toastify"
// import FullScreenLoader from "../common/FullScreenLoader"
// import api from "../../api/api"
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
// import { has } from "lodash"

// const CustomerAdd = ({
//   navigatebackto,
//   process,
//   handleCustomerData,
//   handleEditedData,
//   customer
// }) => {
//   console.log(process)
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
//       productAmount: "",
//       isActive: "Running",
//       taggedLicenses: [],
//       taggedLicenseDueDates: {}
//     }
//   })

//   const loggeduserBranch = useSelector(
//     (state) => state.companyBranch.loggeduserbranches
//   )
//   const [detailsData, setdetailsData] = useState({})
//   const [duplicatelicense, setduplicatelicense] = useState(null)
//   const debounceTimersRef = useRef({})
//   const [submissionloader, setsubmissionloader] = useState(false)
//   const [licenseloading, setlicenseloading] = useState(false)
//   const [productOptions, setProductOptions] = useState([])
//   const [companyOptions, setCompanyOptions] = useState([])
//   const [branchOptions, setBranchOptions] = useState([])
//   const [partner, setPartner] = useState([])
//   const [license, setLicense] = useState([])
//   const [tableData, setTableData] = useState([])
//   console.log(tableData)
//   const [licenseAvailable, setLicenseAvailable] = useState(true)
//   const [showProductPopup, setShowProductPopup] = useState(false)
//   const [popupType, setPopupType] = useState("")
//   const [editIndex, setEditIndex] = useState(null)

//   const selectedProduct = watch("productName")
//   const registrationType = watch("registrationType")
//   const watchedLicense = watch("licensenumber")
//   const watchedTaggedLicenses = watch("taggedLicenses") || []
//   console.log(watchedTaggedLicenses)
//   const watchedTaggedLicenseDueDates = watch("taggedLicenseDueDates") || {}
//   console.log(watchedTaggedLicenseDueDates)
//   const hasTaggedLicenses =
//     popupType === "Additionalservice" && watchedTaggedLicenses.length > 0

//   const { data: licensenumber } = UseFetch("customer/getLicensenumber")
//   const { data: partners } = UseFetch("customer/getallpartners")
//   // const {
//   //   data: productData,
//   //   error: productError
//   // } = UseFetch(
//   //   loggeduserBranch,
//   //   `product/getallProducts?branchselected=${encodeURIComponent(
//   //     JSON.stringify(loggeduserBranch)
//   //   )}`
//   // )
//   const { data: productData, error: productError } = UseFetch(
//     loggeduserBranch &&
//       `/product/getallProducts?branchselected=${encodeURIComponent(
//         JSON.stringify(loggeduserBranch)
//       )}`
//   )

//   const debouncedLicenseNo = useDebounce(watchedLicense, 1000)

//   // const softwareTrades = [
//   //   "Agriculture",
//   //   "Business Services",
//   //   "Computer Hardware Software",
//   //   "Electronics Electrical Supplies",
//   //   "FMCG-Fast Moving Consumable Goods",
//   //   "Garment,Fashion Apparel",
//   //   "Health Beauty",
//   //   "Industrial Supplies",
//   //   "Jewelry Gemstones",
//   //   "Mobile Accessories",
//   //   "Pharmaceutical Chemicals",
//   //   "Textiles Chemicals",
//   //   "Textiles Fabrics",
//   //   "Others",
//   //   "Restaurant, Food And Beverage",
//   //   "Accounts Chartered Account",
//   //   "Stationery, Printing Publishing",
//   //   "Hotel",
//   //   "Pipes, Tubes Fittings"
//   // ]
// const softwareTrades = [
//   "Agriculture",
//   "Business Services",
//   "Computer Hardware Software",
//   "Electronics Electrical Supplies",
//   "FMCG-Fast Moving Consumable Goods",
//   "Garment,Fashion Apparel",
//   "Health Beauty",
//   "Industrial Supplies",
//   "Jewelry Gemstones",
//   "Mobile Accessories",
//   "Pharmaceutical Chemicals",
//   "Textiles Chemicals",
//   "Textiles Fabrics",
//   "Others",
//   "Restaurant, Food And Beverage",
//   "Accounts Chartered Account",
//   "Stationery, Printing Publishing",
//   "Hotel",
//   "Pipes, Tubes Fittings",

//   "Wholesale Trading",
//   "Retail Trading",
//   "Import & Export",
//   "Distribution / Dealers",
//   "E-commerce / Online Trading",
//   "IT Services",
//   "Web Design & Development",
//   "Cyber Security Services",
//   "Hardware & Networking",
//   "Construction Companies",
//   "Spare Parts Dealers",
//   "Banks",
//   "Printing & Publishing",

//   "Pharmaceutical Manufacturing",
//   "Food Manufacturing",
//   "Textile / Garment Manufacturing",
//   "Chemical Manufacturing",
//   "Plastic Manufacturing",
//   "Steel / Metal Manufacturing",
//   "Furniture Manufacturing",
//   "Building Contractors",
//   "Real Estate Developers",
//   "Property Management",
//   "Transport & Logistics",
//   "Finance Companies",

//   "Electrical Equipment Manufacturing",
//   "Electronics Manufacturing",
//   "Automobile Manufacturing",
//   "Hospitals",
//   "Clinics",
//   "Medical Laboratories",
//   "Medical Equipment Suppliers",
//   "Pharmacies / Medical Stores",
//   "Interior Design",
//   "Vehicle Dealers",
//   "Automobile Service Centres",
//   "Insurance Companies",
//   "Chartered Accountants / Audit Firms",
//   "Tax Consultants",
//   "Hotels & Resorts",

//   "Schools",
//   "Colleges",
//   "Training Institutes",
//   "Coaching Centers",
//   "Educational Consultants",
//   "Software Development",
//   "Restaurants / Cafes",
//   "Travel Agencies",
//   "Tourism Operators",
//   "Advertising & Marketing Agencies",
//   "Event Management",
//   "Security Services",
//   "Cleaning / Facility Management",
//   "NGOs / Non-Profit Organizations",
//   "Government Organizations"
// ];

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
//   console.log(partner)

//   useEffect(() => {
//     if (productData) {
//       console.log(productData)
//       // setProductOptions(
//       //   productData.map((product) => ({
//       //     label: product.productName,
//       //     value: product._id,
//       //     shortName: product?.shortName,
//       //     productorservicetype: product.productorservicetype,
//       //     defaultservices: product?.defaultservices || [],
//       //     company_id: product?.selected[0].company_id,
//       //     companyName: product?.selected[0]?.companyName,

//       //     branch_id: product?.selected[0]?.branch_id,
//       //     branchName: product?.selected[0]?.branchName
//       //   }))
//       // )
//       setProductOptions(
//         productData.map((product) => {
//           const basePrice = Number(product?.productPrice || 0)
//           const igstRate = Number(
//             product?.selected?.[0]?.hsn_id?.onValue?.igstRate || 0
//           )

//           const gstAmount = (basePrice * igstRate) / 100
//           const totalPrice = basePrice + gstAmount

//           return {
//             label: product.productName,
//             value: product._id,
//             shortName: product?.shortName,
//             productorservicetype: product.productorservicetype,
//             defaultservices: product?.defaultservices || [],
//             company_id: product?.selected?.[0]?.company_id,
//             companyName: product?.selected?.[0]?.companyName,
//             branch_id: product?.selected?.[0]?.branch_id,
//             branchName: product?.selected?.[0]?.branchName,
//             productprice: totalPrice,
//             basePrice,
//             igstRate,
//             gstAmount
//           }
//         })
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
//       console.log(productError)
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
//         productAmount: "",
//         isActive: "Running",
//         taggedLicenses: [],
//         taggedLicenseDueDates: {}
//       })
//       console.log(customer.selected)

//       const selectedData =
//         customer?.selected?.map((sel) => ({
//           company_id: sel?.company_id?._id,
//           companyName: sel?.company_id?.companyName,
//           branch_id: sel?.branch_id?._id,
//           branchName: sel?.branch_id?.branchName,
//           product_id: sel?.product_id?._id,
//           productName: sel?.product_id?.productName,
//           brandName: sel?.brandName,
//           categoryName: sel?.categoryName,
//           shortName: sel?.product_id?.shortName,
//           licensenumber: sel?.licensenumber,
//           softwareTrade: sel?.softwareTrade,
//           version: sel?.version,
//           customerAddDate: sel?.customerAddDate,
//           amcstartDate: sel?.amcstartDate,
//           amcendDate: sel?.amcendDate,
//           amcAmount: sel?.amcAmount,
//           amcDescription: sel?.amcDescription,
//           licenseExpiryDate: sel?.licenseExpiryDate,
//           productamountDescription: sel?.productamountDescription,
//           tvuexpiryDate: sel?.tvuexpiryDate,
//           tvuAmount: sel?.tvuAmount,
//           tvuamountDescription: sel?.tvuamountDescription,
//           reasonofStatus: sel?.reasonofStatus,
//           applicationDate: sel?.customerAddDate
//             ? sel?.customerAddDate
//             : sel?.applicationDate,
//           nextDue: sel?.nextDue,
//           noofusers: sel?.noofusers,
//           productAmount: sel?.productAmount,

//           isActive: sel?.isActive || "Running",
//           productorservicetype: sel?.product_id?.productorservicetype,
//           taggedLicenses:
//             sel?.taggedLicenses ||
//             sel?.licenseNumbers ||
//             sel?.taggeddata?.map((item) => String(item?.licensenumber)) ||
//             [],
//           taggeddata: sel?.taggeddata || []
//         })) || []
//       console.log(selectedData)
//       setTableData(selectedData)
//     }
//   }, [customer, reset, partner])

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
// console.log(tableData)
//   // const primaryLicenseOptions = useMemo(() => {
//   //   return [
//   //     ...new Set(
//   //       tableData
//   //         .filter(
//   //           (item) =>
//   //             String(item?.productorservicetype).toLowerCase() ===
//   //             "primaryproduct"
//   //         )
//   //         .map((item) => String(item?.licensenumber).trim())
//   //         .filter(Boolean)
//   //     )
//   //   ]
//   // }, [tableData])

// const primaryLicenseOptions = useMemo(() => {
//   const uniqueMap = new Map();

//   tableData
//     .filter(
//       (item) =>
//         String(item?.productorservicetype).toLowerCase() === "primaryproduct"
//     )
//     .forEach((item) => {
//       const licenseNo = String(item?.licensenumber || "").trim();

//       if (licenseNo && !uniqueMap.has(licenseNo)) {
//         uniqueMap.set(licenseNo, {
//           licenseNo,
//           productName: item?.productName || "",
//         });
//       }
//     });

//   return Array.from(uniqueMap.values());
// }, [tableData]);
// console.log(primaryLicenseOptions)
//   console.log(productData)
//   const handleProductChange = (selectedOption) => {
//     console.log(selectedOption)
//     setValue("productName", selectedOption)
//     setValue("shortName", selectedOption?.shortName)
//     setValue("productAmount", selectedOption?.productprice)
//     setValue("companyName", null)
//     setValue("branchName", null)
//     setValue("licensenumber", "")
//     setValue("taggedLicenses", [])
//     setValue("taggedLicenseDueDates", {})
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
//     setBranchOptions(branches)
//   }
//   console.log(tableData)
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
//       shortName: null,
//       softwareTrade: "",
//       applicationDate: "",
//       nextDue: "",
//       noofusers: "",
//       productAmount: "",
//       isActive: "Running",
//       taggedLicenses: [],
//       taggedLicenseDueDates: {}
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
//     setduplicatelicense(null)
//     setdetailsData([])
//   }
//   console.log(tableData)
//   console.log(licenseloading)
//   const handleLicenseBlur = async (licenseNumber) => {
//     console.log(licenseNumber)
//     if (!String(licenseNumber).trim()) return
//     console.log(licenseNumber)
//     try {
//       console.log(tableData)
//       const existsInTable = tableData?.some(
//         (row) => String(row?.licensenumber) === String(licenseNumber)
//       )
//       if (existsInTable) {
//         toast.error(`License ${licenseNumber} already exists`)
//         return
//       }

//       setlicenseloading(true)
//       const { data } = await api.get(
//         `/customer/checkLicense?licenseNumber=${licenseNumber}`
//       )
//       console.log(data)
//       if (data.exists) {
//         toast.error(`License ${licenseNumber} already exists`)
//         console.log("hhhhh")
//         setduplicatelicense(true)
//         // setSelectedLeadList((prev) =>
//         //   prev.map((row, i) => (i === index ? { ...row } : row))
//         // )

//         return
//       } else {
//         setduplicatelicense(null)
//       }

//       // setlicenseloading(false)
//       toast.success("License available")
//     } catch (error) {
//       // setlicenseloading(false)
//       console.error(error)
//       toast.error("Failed to validate license")
//     } finally {
//       setlicenseloading(false)
//     }
//   }

//   const handleEdit = (item, index) => {
//     console.log(item)
//     setdetailsData(item)
//     console.log(index)
//     setPopupType(item?.productorservicetype)
//     setEditIndex(index)

//     const productOption = productOptions.find(
//       (p) => p.value === item?.product_id
//     ) || {
//       label: item?.productName,
//       value: item?.product_id
//     }

//     const companyOption = item?.company_id
//       ? { label: item?.companyName, value: item?.company_id }
//       : null

//     const branchOption = item?.branch_id
//       ? { label: item?.branchName, value: item?.branch_id }
//       : null

//     const taggedLicensesFromData =
//       item?.taggeddata?.map((entry) => String(entry?.licensenumber)) ||
//       item?.taggedLicenses ||
//       []
//     console.log(item)

//     const taggedLicenseDueDatesFromData =
//       item?.taggeddata?.reduce((acc, entry) => {
//         if (entry?.licensenumber) {
//           acc[String(entry.licensenumber)] = {
//             nextDue: entry?.nextDue || "",
//             productAmount: entry?.productAmount ?? "",
//             taxexclusiveAmount: entry?.taxexclusiveAmount ?? "",
//             taxinclusiveamount: entry?.taxinclusiveamount ?? "",
//             hsn: entry?.hsn ?? ""
//           }
//         }
//         return acc
//       }, {}) || {}
//     console.log(taggedLicenseDueDatesFromData)

//     setCompanyOptions(getCompaniesForProduct(item?.productid))
//     setBranchOptions(getBranchesForCompany(item?.productid, item?.companyid))
//     console.log(item)
//     reset({
//       ...getValues(),
//       productName: productOption,
//       companyName: companyOption,
//       branchName: branchOption,
//       licensenumber: item?.licensenumber || "",
//       softwareTrade: item?.softwareTrade || "",
//       applicationDate: item?.applicationDate || "",
//       nextDue: item?.nextDue || "",
//       shortName: item?.shortName || "",
//       noofusers: item?.noofusers || "",
//       productAmount: item?.productAmount || "",
//       isActive: item?.isActive || "Running",
//       taggedLicenses: taggedLicensesFromData,
//       taggedLicenseDueDates: taggedLicenseDueDatesFromData
//     })
//     console.log("hh")
//     setShowProductPopup(true)
//   }

//   const handleDelete = (index) => {
//     setTableData((prev) => prev.filter((_, i) => i !== index))
//   }

//   // const savePopupData = () => {
//   //   const values = getValues()

//   //   if (!values?.productName?.value) {
//   //     toast.error("Please select product/service")
//   //     return
//   //   }

//   //   if (
//   //     popupType === "Primaryproduct" &&
//   //     !String(values?.licensenumber || "").trim()
//   //   ) {
//   //     setError("licensenumber", {
//   //       type: "manual",
//   //       message: "License number is required for primary product"
//   //     })
//   //     return
//   //   }

//   //   if (
//   //     popupType === "Primaryproduct" &&
//   //     String(values?.licensenumber || "").trim() &&
//   //     !licenseAvailable
//   //   ) {
//   //     setError("licensenumber", {
//   //       type: "manual",
//   //       message: "License number already exists"
//   //     })
//   //     return
//   //   }

//   //   const selectedTaggedLicenses =
//   //     popupType === "Additionalservice" ? values?.taggedLicenses || [] : []

//   //   const dueMap =
//   //     popupType === "Additionalservice"
//   //       ? values?.taggedLicenseDueDates || {}
//   //       : {}

//   //   if (
//   //     popupType === "Additionalservice" &&
//   //     selectedTaggedLicenses.length > 0
//   //   ) {
//   //     const hasEmptyDueDate = selectedTaggedLicenses.some(
//   //       (licenseNo) => !String(dueMap[String(licenseNo)] || "").trim()
//   //     )

//   //     if (hasEmptyDueDate) {
//   //       toast.error("Please enter due date for all tagged licenses")
//   //       return
//   //     }
//   //   }

//   //   const taggeddata =
//   //     popupType === "Additionalservice" && selectedTaggedLicenses.length > 0
//   //       ? selectedTaggedLicenses.map((licenseNo) => ({
//   //           licensenumber: Number(licenseNo),
//   //           nextDue: dueMap[String(licenseNo)] || ""
//   //         }))
//   //       : []

//   //   const row = {
//   //     company_id: values?.companyName?.value,
//   //     companyName: values?.companyName?.label,
//   //     branch_id: values?.branchName?.value,
//   //     branchName: values?.branchName?.label,
//   //     product_id: values?.productName?.value,
//   //     productName: values?.productName?.label,
//   //     shortName: values?.shortName,
//   //     licensenumber:
//   //       popupType === "Additionalservice" && taggeddata.length > 0
//   //         ? null
//   //         : values?.licensenumber
//   //           ? Number(values.licensenumber)
//   //           : null,
//   //     softwareTrade:
//   //       popupType === "Primaryproduct" ? values?.softwareTrade : "",
//   //     applicationDate:
//   //       popupType === "Primaryproduct" ? values?.applicationDate : "",
//   //     nextDue:
//   //       popupType === "Additionalservice" && taggeddata.length > 0
//   //         ? null
//   //         : values?.nextDue || "",
//   //     noofusers: values?.noofusers ? Number(values.noofusers) : 0,
//   //     productAmount: values?.productAmount ? Number(values.productAmount) : 0,
//   //     isActive: values?.isActive || "Running",
//   //     productorservicetype: popupType,
//   //     taggeddata,
//   //     taggedLicenses: selectedTaggedLicenses
//   //   }

//   //   setTableData((prev) => {
//   //     const updated = [...prev]
//   //     if (editIndex !== null) {
//   //       updated[editIndex] = row
//   //     } else {
//   //       updated.push(row)
//   //     }
//   //     return updated
//   //   })

//   //   closePopup()
//   // }
//   console.log(errors)
//   console.log(!licenseAvailable && watchedLicense)
//   console.log(!licenseAvailable)
//   console.log(watchedLicense)

//   const validateSelectedLeadList = (selectedleadlist = []) => {
//     const hasAdditionalService = selectedleadlist.some(
//       (row) =>
//         String(row?.productorservicetype || "").toLowerCase() ===
//         "additionalservice"
//     )
//     console.log(selectedleadlist)
//     console.log(hasAdditionalService)
//     const today = new Date()
//     today.setHours(0, 0, 0, 0)

//     const parseDateOnly = (value) => {
//       if (!value) return null
//       const d = new Date(value)
//       if (Number.isNaN(d.getTime())) return null
//       d.setHours(0, 0, 0, 0)
//       return d
//     }
//     console.log(selectedleadlist)
//     for (let i = 0; i < selectedleadlist.length; i++) {
//       const row = selectedleadlist[i]
//       const rowNo = i + 1
//       const type = String(row?.productorservicetype || "").toLowerCase()

//       const hasCompany = !!(
//         row?.company_id ||
//         row?.companyid ||
//         row?.companyName
//       )
//       const hasBranch = !!(row?.branch_id || row?.branchid || row?.branchName)

//       if (!hasCompany) {
//         return `Company is required for ${row?.productName}`
//       }

//       if (!hasBranch) {
//         return `Branch is required for ${row?.productName}`
//       }
//       console.log(row)
//       const productPrice = Number(
//         row?.productAmount ?? row?.productPrice ?? row?.amount ?? 0
//       )
//       console.log(productPrice)
//       const netAmount = Number(row?.netamount ?? row?.netAmount ?? 0)

//       if (type === "primaryproduct") {
//         if (!String(row?.licensenumber || row?.licenseNumber || "").trim()) {
//           return `License number is required for  ${row?.productName}`
//         }
//         if (!row.applicationDate) {
//           return `Application date is requiered for  ${row?.productName},please add details`
//         }
//         if (!(productPrice > 0)) {
//           console.log("hhh")
//           console.log(row)
//           return `Product price must be greater than 0 for  ${row?.productName} ${row.licensenumber}`
//         }

//         // if (!(netAmount > 0)) {
//         //   return `Net amount is required for primary product in row ${rowNo}`
//         // }
//       }
//       console.log(row)
//       if (type === "additionalservice") {
//         const taggeddata = Array.isArray(row?.taggeddata) ? row.taggeddata : []
//         const outerLicense = String(
//           row?.licensenumber || row?.licenseNumber || ""
//         ).trim()
//         const hasTaggedLicense = taggeddata.some((tag) =>
//           String(tag?.licensenumber || tag?.licenseNumber || "").trim()
//         )
//         const hasAnyLicense = !!outerLicense || hasTaggedLicense
//         console.log(hasAnyLicense)
//         console.log(!hasAdditionalService)
//         console.log(!hasAdditionalService && !(productPrice > 0))
//         if (!hasAdditionalService && !(productPrice > 0)) {
//           console.log("jjjj")
//           return `Product price must be greater than 0 for additional service ${row.productName}`
//         }

//         if (!hasAdditionalService && !(netAmount > 0)) {
//           return `Net amount is required for additional service ${row?.productName}`
//         }
//         console.log(taggeddata)
//         if (taggeddata.length > 0) {
//           for (let j = 0; j < taggeddata.length; j++) {
//             const tag = taggeddata[j]
//             const tagLicense = String(
//               tag?.licensenumber || tag?.licenseNumber || ""
//             ).trim()
//             const due = parseDateOnly(tag?.nextDue)
//             console.log(due)
//             if (!tagLicense) {
//               console.log("hh")
//               return `Tagged license number is required in ${row?.productName}`
//             }

//             if (!due) {
//               return `Next due is required for tagged license ${tagLicense} for ${row?.productName}`
//             }

//             if (due < today) {
//               return `Next due cannot be less than current date for tagged license ${tagLicense} for ${row?.productName}`
//             }
//           }
//         } else {
//           console.log(taggeddata)
//           if (!row.nextDue) {
//             console.log("hh")
//             console.log(row)
//             return `Additonal service ${row?.productName} must have a next Due, please add Details`
//           }
//           if (!outerLicense && taggeddata.length === 0) {
//             console.log("hhh")
//             return `Additional service ${row?.productName} must have a license number or tagged license`
//           }

//           const due = parseDateOnly(row?.nextDue)
//           if (!due) {
//             return `Next due is required for additional service ${row?.productName}`
//           }

//           if (due < today) {
//             return `Next due cannot be less than current date for additional service  ${row?.productName}`
//           }
//         }

//         if (!hasAnyLicense) {
//           console.log("Hhh")

//           return `Additional service  ${row?.productName} must have a license number or tagged license`
//         }
//       }
//     }

//     const primaryProducts = selectedleadlist.filter(
//       (row) =>
//         String(row?.productorservicetype || "").toLowerCase() ===
//         "primaryproduct"
//     )

//     const additionalServices = selectedleadlist.filter(
//       (row) =>
//         String(row?.productorservicetype || "").toLowerCase() ===
//         "additionalservice"
//     )

//     if (primaryProducts.length > 0 && additionalServices.length > 0) {
//       for (let i = 0; i < additionalServices.length; i++) {
//         const row = additionalServices[i]
//         const rowNo = selectedleadlist.findIndex((x) => x === row) + 1
//         const taggeddata = Array.isArray(row?.taggeddata) ? row.taggeddata : []
//         const outerLicense = String(
//           row?.licensenumber || row?.licenseNumber || ""
//         ).trim()
//         const hasTaggedLicense = taggeddata.some((tag) =>
//           String(tag?.licensenumber || tag?.licenseNumber || "").trim()
//         )

//         if (!outerLicense && !hasTaggedLicense) {
//           return `Additional service  ${row?.productName} should have any one license number or tagged license number`
//         }
//       }
//     }

//     return null
//   }
//   const savePopupData = () => {
//     console.log("hhhh")
//     console.log(duplicatelicense)
//     if (duplicatelicense) {
//       console.log("hhh")
//       toast.error("License already exists")
//       return
//     }
//     const values = getValues()
//     console.log(values)
//     if (!values?.productName?.value) {
//       toast.error("Please select product/service")
//       return
//     }
//     console.log(values)

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

//     const selectedTaggedLicenses =
//       popupType === "Additionalservice" ? values?.taggedLicenses || [] : []

//     const dueMap =
//       popupType === "Additionalservice"
//         ? values?.taggedLicenseDueDates || {}
//         : {}

//     if (
//       popupType === "Additionalservice" &&
//       selectedTaggedLicenses.length > 0
//     ) {
//       // const hasEmptyDueDate = selectedTaggedLicenses.some(
//       //   (licenseNo) => !String(dueMap[String(licenseNo)] || "").trim()
//       // )
//       const hasEmptyDueDate = selectedTaggedLicenses.some(
//         (licenseNo) => !String(dueMap[String(licenseNo)]?.nextDue || "").trim()
//       )

//       if (hasEmptyDueDate) {
//         toast.error("Please enter due date for all tagged licenses")
//         return
//       }
//     }

//     // const taggeddata =
//     //   popupType === "Additionalservice" && selectedTaggedLicenses.length > 0
//     //     ? selectedTaggedLicenses.map((licenseNo) => ({
//     //         licensenumber: Number(licenseNo),
//     //         nextDue: dueMap[String(licenseNo)] || ""
//     //       }))
//     //     : []
//     const taggeddata =
//       popupType === "Additionalservice" && selectedTaggedLicenses.length > 0
//         ? selectedTaggedLicenses.map((licenseNo) => ({
//             licensenumber: Number(licenseNo),
//             nextDue: dueMap[String(licenseNo)]?.nextDue || "",
//             productAmount: Number(
//               dueMap[String(licenseNo)]?.productAmount || 0
//             ),
//             taxexclusiveAmount: Number(
//               dueMap[String(licenseNo)]?.taxexclusiveAmount || 0
//             ),
//             taxinclusiveamount: Number(
//               dueMap[String(licenseNo)]?.taxinclusiveamount || 0
//             )
//           }))
//         : []
//     console.log(values)
//     console.log(tableData)
//     console.log(values)
//     const baseRow =
//       editIndex !== null
//         ? tableData[editIndex] // preserve all old fields while editing
//         : {} // or your default schema object
//     const row = {
//       ...baseRow,
//       company_id: values?.productName?.company_id,
//       companyName: values?.productName?.companyName,
//       branch_id: values?.productName?.branch_id,
//       branchName: values?.productName?.branchName,
//       product_id: values?.productName?.value,
//       productName: values?.productName?.label,
//       shortName: values?.shortName,
//       licensenumber:
//         popupType === "Additionalservice" && taggeddata.length > 0
//           ? null
//           : values?.licensenumber
//             ? Number(values.licensenumber)
//             : null,
//       softwareTrade:
//         popupType === "Primaryproduct" ? values?.softwareTrade : "",
//       applicationDate:
//         popupType === "Primaryproduct" ? values?.applicationDate : "",
//       nextDue:
//         popupType === "Additionalservice" && taggeddata.length > 0
//           ? null
//           : values?.nextDue || "",
//       noofusers: values?.noofusers ? Number(values.noofusers) : 0,
//       productAmount: values?.productAmount ? Number(values.productAmount) : 0,
//       isActive: values?.isActive || "Running",
//       productorservicetype: popupType,
//       taggeddata,
//       taggedLicenses: selectedTaggedLicenses
//     }
//     console.log(row)
//     console.log(productOptions)
//     const selectedProductObj = productOptions?.find(
//       (p) => p.value === values?.productName?.value
//     )
//     console.log(selectedProductObj.defaultservices)
//     console.log(selectedProductObj)
//     const defaultServiceRows =
//       popupType === "Primaryproduct" &&
//       selectedProductObj?.defaultservices?.length
//         ? selectedProductObj.defaultservices.map((service) => ({
//             company_id: values?.productName?.company_id,
//             companyName: values?.productName?.companyName,
//             branch_id: values?.productName?.branch_id,
//             branchName: values?.productName?.branchName,
//             product_id: service?._id,
//             productName: service?.productName,
//             shortName: service?.shortName || "",
//             licensenumber: null,
//             softwareTrade: "",
//             applicationDate: "",
//             nextDue: "",
//             noofusers: 0,
//             productAmount: service?.productPrice
//               ? Number(service.productPrice)
//               : 0,
//             isActive: values?.isActive || "Running",
//             productorservicetype: "Additionalservice",
//             taggeddata: [],
//             taggedLicenses: [],
//             parentProductId: values?.productName?.value,
//             parentProductName: values?.productName?.label,
//             autoAddedFromDefaultService: true
//           }))
//         : []
//     console.log(defaultServiceRows)
//     console.log(editIndex)
//     console.log(tableData)
//     console.log("hh")
//     // setTableData((prev) => {
//     //   if (editIndex !== null) {
//     //     const updated = [...prev]
//     //     updated[editIndex] = row
//     //     return updated
//     //   }

//     //   return [...prev, row, ...defaultServiceRows]
//     // })
//     setTableData((prev) => {
//       if (editIndex !== null) {
//         const updated = [...prev]
//         updated[editIndex] = row
//         return updated
//       }

//       // Existing additional service product ids
//       const existingAdditionalServiceIds = new Set(
//         prev
//           .filter(
//             (item) =>
//               String(item.productorservicetype).toLowerCase() ===
//               "additionalservice"
//           )
//           .map((item) => String(item.product_id))
//       )

//       // Only keep default services that don't already exist
//       const newDefaultServices = defaultServiceRows.filter(
//         (service) =>
//           !existingAdditionalServiceIds.has(String(service.product_id))
//       )

//       return [...prev, row, ...newDefaultServices]
//     })

//     closePopup()
//   }
//   console.log(tableData)
//   // const filteredOptionsByType = useMemo(() => {
//   //   return productOptions.filter(
//   //     (item) =>
//   //       String(item?.productorservicetype).toLowerCase() ===
//   //       String(popupType).toLowerCase()
//   //   )
//   // }, [productOptions, popupType])
//   const filteredOptionsByType = useMemo(() => {
//     let options = productOptions.filter(
//       (item) =>
//         String(item?.productorservicetype).toLowerCase() ===
//         String(popupType).toLowerCase()
//     )

//     if (String(popupType).toLowerCase() === "additionalservice") {
//       const existingServiceIds = new Set(
//         tableData
//           .filter(
//             (item) =>
//               String(item?.productorservicetype).toLowerCase() ===
//               "additionalservice"
//           )
//           .map((item) => String(item.product_id))
//       )

//       options = options.filter(
//         (item) => !existingServiceIds.has(String(item.value))
//         // or String(item._id) depending on your productOptions structure
//       )
//     }

//     return options
//   }, [productOptions, popupType, tableData])
//   console.log(popupType)

//   const primaryProducts = useMemo(() => {
//     return tableData.filter(
//       (item) =>
//         String(item?.productorservicetype).toLowerCase() === "primaryproduct"
//     )
//   }, [tableData])
//   console.log(tableData)
//   console.log(primaryProducts)
//   const additionalServices = useMemo(() => {
//     return tableData.filter(
//       (item) =>
//         String(item?.productorservicetype).toLowerCase() === "additionalservice"
//     )
//   }, [tableData])
//   console.log(additionalServices)
//   const formatDateForInput = (date) => {
//     if (!date) return ""
//     return String(date).split("T")[0]
//   }
//   console.log(tableData)
//   console.log(primaryProducts)
//   console.log(tableData)
//   console.log(additionalServices)
//   const onSubmit = async (data) => {
//     console.log(data)
//     console.log(tableData)
//     console.log(submissionloader)
//     const validationMessage = validateSelectedLeadList(tableData)
//     console.log(validationMessage)
//     if (validationMessage) {
//       toast.error(validationMessage)
//       return
//     }
//     if (submissionloader) return

//     setsubmissionloader(true)
//     try {
//       if (process === "Registration") {
//         await handleCustomerData(data, tableData)
//         reset()
//         setTableData([])
//       } else if (process === "edit") {
//         console.log(tableData)
//         await handleEditedData(data, tableData, customer?.index)
//       }
//     } catch (error) {
//       toast.error("Failed to save customer!")
//     } finally {
//       setsubmissionloader(false)
//     }
//   }

//   const compactSelectStyles = {
//     control: (base, state) => ({
//       ...base,
//       minHeight: "36px",
//       borderRadius: "8px",
//       borderColor: state.isFocused ? "#7ba7ff" : "#dfe5ee",
//       boxShadow: "none",
//       fontSize: "12px",
//       "&:hover": {
//         borderColor: "#7ba7ff"
//       }
//     }),
//     valueContainer: (base) => ({
//       ...base,
//       padding: "0 8px"
//     }),
//     indicatorsContainer: (base) => ({
//       ...base,
//       height: "36px"
//     }),
//     menu: (base) => ({
//       ...base,
//       zIndex: 9999
//     })
//   }

//   return (
//     <div className="min-h-screen bg-[#ADD8E6] px-3 py-6 md:px-6">
//       <div className="mx-auto max-w-[1180px]">
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//           {/* your existing top customer form UI remains same */}
//           <div className="rounded-[20px] border border-[#edf1f7] bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.05)] md:p-5">
//             <div className="mb-4 flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef5ff] text-[#4b87ff]">
//                   <FaUser size={14} />
//                 </div>
//                 <div>
//                   <h2 className="text-[16px] font-semibold text-[#162033]">
//                     Customer Details
//                   </h2>
//                   <p className="text-[12px] text-[#7f8aa3]">
//                     Fill customer master information
//                   </p>
//                 </div>
//               </div>

//               <button
//                 type="button"
//                 onClick={() =>
//                   navigatebackto ? navigate(navigatebackto) : navigate(-1)
//                 }
//                 className="rounded-md border border-[#e6ebf3] bg-white px-3 py-2 text-[12px] font-medium text-[#6d7890] hover:bg-[#f8fafc]"
//               >
//                 Cancel
//               </button>
//             </div>

//             <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
//               <InfoInputCard
//                 icon={<FaUser size={12} />}
//                 iconBg="bg-[#edf6ff]"
//                 iconColor="text-[#5aa2ff]"
//                 label="Customer Name"
//                 error={errors.customerName?.message}
//               >
//                 <input
//                   type="text"
//                   {...register("customerName", {
//                     required: "Customer name is required"
//                   })}
//                   onBlur={(e) =>
//                     setValue("customerName", e.target.value.trim())
//                   }
//                   className={tileInputClass}
//                   placeholder="Enter customer name"
//                 />
//               </InfoInputCard>

//               <InfoInputCard
//                 icon={<FaHashtag size={12} />}
//                 iconBg="bg-[#f4efff]"
//                 iconColor="text-[#8a5eff]"
//                 label="Pincode"
//               >
//                 <input
//                   type="number"
//                   {...register("pincode")}
//                   onBlur={(e) => setValue("pincode", e.target.value.trim())}
//                   className={tileInputClass}
//                   placeholder="Pincode"
//                 />
//               </InfoInputCard>

//               <InfoInputCard
//                 icon={<FaBuilding size={12} />}
//                 iconBg="bg-[#fff4ea]"
//                 iconColor="text-[#f0a24d]"
//                 label="City"
//               >
//                 <input
//                   type="text"
//                   {...register("city")}
//                   onBlur={(e) => setValue("city", e.target.value.trim())}
//                   className={tileInputClass}
//                   placeholder="City"
//                 />
//               </InfoInputCard>

//               <InfoInputCard
//                 icon={<FaEnvelope size={12} />}
//                 iconBg="bg-[#eefbf2]"
//                 iconColor="text-[#4cbf73]"
//                 label="Email"
//                 error={errors.email?.message}
//               >
//                 <input
//                   type="email"
//                   {...register("email", {
//                     required: "Email is required",
//                     pattern: {
//                       value: /\S+@\S+\.\S+/,
//                       message: "Invalid email address"
//                     }
//                   })}
//                   onBlur={(e) => setValue("email", e.target.value.trim())}
//                   className={tileInputClass}
//                   placeholder="Email"
//                 />
//               </InfoInputCard>

//               <InfoInputCard
//                 icon={<FaMapMarkerAlt size={12} />}
//                 iconBg="bg-[#fff0f8]"
//                 iconColor="text-[#ef7db2]"
//                 label="Address 1"
//               >
//                 <input
//                   type="text"
//                   {...register("address1")}
//                   onBlur={(e) => setValue("address1", e.target.value.trim())}
//                   className={tileInputClass}
//                   placeholder="Address line 1"
//                 />
//               </InfoInputCard>

//               <InfoInputCard
//                 icon={<FaUser size={12} />}
//                 iconBg="bg-[#ebfbfb]"
//                 iconColor="text-[#43c7cb]"
//                 label="Contact Person"
//               >
//                 <input
//                   type="text"
//                   {...register("contactPerson")}
//                   onBlur={(e) =>
//                     setValue("contactPerson", e.target.value.trim())
//                   }
//                   className={tileInputClass}
//                   placeholder="Contact person"
//                 />
//               </InfoInputCard>

//               <InfoInputCard
//                 icon={<FaPhone size={12} />}
//                 iconBg="bg-[#edf9f0]"
//                 iconColor="text-[#45bf6b]"
//                 label="Mobile No"
//               >
//                 <input
//                   type="tel"
//                   {...register("mobile")}
//                   onBlur={(e) => setValue("mobile", e.target.value.trim())}
//                   className={tileInputClass}
//                   placeholder="Mobile number"
//                 />
//               </InfoInputCard>

//               <InfoInputCard
//                 icon={<FaLandmark size={12} />}
//                 iconBg="bg-[#fff8df]"
//                 iconColor="text-[#d1a91b]"
//                 label="Partnership"
//               >
//                 <select {...register("partner")} className={tileInputClass}>
//                   <option value="">Select Partner</option>
//                   {partner?.map((partnr, index) => (
//                     <option key={index} value={partnr._id}>
//                       {partnr.partner}
//                     </option>
//                   ))}
//                 </select>
//               </InfoInputCard>

//               <InfoInputCard
//                 icon={<FaMapMarkerAlt size={12} />}
//                 iconBg="bg-[#eef5ff]"
//                 iconColor="text-[#3879f2]"
//                 label="Address 2"
//               >
//                 <input
//                   type="text"
//                   {...register("address2")}
//                   onBlur={(e) => setValue("address2", e.target.value.trim())}
//                   className={tileInputClass}
//                   placeholder="Address line 2"
//                 />
//               </InfoInputCard>

//               <InfoInputCard
//                 icon={<FaBuilding size={12} />}
//                 iconBg="bg-[#edf7ff]"
//                 iconColor="text-[#4f98ff]"
//                 label="State"
//               >
//                 <input
//                   type="text"
//                   {...register("state")}
//                   onBlur={(e) => setValue("state", e.target.value.trim())}
//                   className={tileInputClass}
//                   placeholder="State"
//                 />
//               </InfoInputCard>

//               <InfoInputCard
//                 icon={<FaGlobeAsia size={12} />}
//                 iconBg="bg-[#fff2e8]"
//                 iconColor="text-[#ef9a47]"
//                 label="Country"
//               >
//                 <input
//                   type="text"
//                   {...register("country")}
//                   onBlur={(e) => setValue("country", e.target.value.trim())}
//                   className={tileInputClass}
//                   placeholder="Country"
//                 />
//               </InfoInputCard>

//               <InfoInputCard
//                 icon={<FaPhone size={12} />}
//                 iconBg="bg-[#fff1f6]"
//                 iconColor="text-[#f07ab1]"
//                 label="Landline No"
//               >
//                 <input
//                   type="tel"
//                   {...register("landline")}
//                   onBlur={(e) => setValue("landline", e.target.value.trim())}
//                   className={tileInputClass}
//                   placeholder="Landline"
//                 />
//               </InfoInputCard>

//               {/* <InfoInputCard
//                 icon={<FaStar size={12} />}
//                 iconBg="bg-[#eef4ff]"
//                 iconColor="text-[#6d86ff]"
//                 label="Industry"
//               >
//                 <select {...register("industry")} className={tileInputClass}>
//                   <option value="">Select Industry</option>
//                   {industries.map((industry, index) => (
//                     <option key={index} value={industry}>
//                       {industry}
//                     </option>
//                   ))}
//                 </select>
//               </InfoInputCard> */}

//               <InfoInputCard
//                 icon={<FaHashtag size={12} />}
//                 iconBg="bg-[#f5f0ff]"
//                 iconColor="text-[#9967ff]"
//                 label="Registration Type"
//                 error={errors.registrationType?.message}
//               >
//                 <select
//                   {...register("registrationType", {
//                     required: "RegistrationType is required"
//                   })}
//                   className={tileInputClass}
//                 >
//                   <option value="">Select RegistrationType</option>
//                   <option value="unregistered">Unregistered/Consumer</option>
//                   <option value="regular">Regular</option>
//                 </select>
//               </InfoInputCard>

//               {registrationType === "regular" && (
//                 <InfoInputCard
//                   icon={<FaLandmark size={12} />}
//                   iconBg="bg-[#fff1f7]"
//                   iconColor="text-[#ee82a9]"
//                   label="GSTIN / UIN"
//                 >
//                   <input
//                     type="text"
//                     {...register("gstNo")}
//                     onBlur={(e) => setValue("gstNo", e.target.value.trim())}
//                     className={tileInputClass}
//                     placeholder="Enter GSTIN"
//                   />
//                 </InfoInputCard>
//               )}
//             </div>
//           </div>

//           <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
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
//                   Add Products
//                 </button>
//               </div>

//               <div className="min-h-[180px] px-4 py-5">
//                 {primaryProducts.length > 0 ? (
//                   <div className="flex flex-wrap gap-4">
//                     {primaryProducts.map((item) => {
//                       const actualIndex = tableData.findIndex((x) => x === item)
//                       const isDeactive =
//                         String(item?.isActive).toLowerCase() === "deactive"

//                       return (
//                         <ProductCircleCard
//                           key={`primary-${actualIndex}`}
//                           item={item}
//                           productType="Primaryproduct"
//                           actualIndex={actualIndex}
//                           variant={isDeactive ? "danger" : "success"}
//                           topBadgeIcon={<FaBuilding size={10} />}
//                           line1={
//                             item?.shortName
//                               ? item?.shortName
//                               : item?.productName
//                           }
//                           line2={item?.licensenumber}
//                           line3={
//                             item?.applicationDate
//                               ? formatDateToDDMMYYYY(item?.applicationDate)
//                               : ""
//                           }
//                           line4={isDeactive ? "De Active" : "Active"}
//                           onEdit={handleEdit}
//                           onDelete={handleDelete}
//                         />
//                       )
//                     })}
//                   </div>
//                 ) : (
//                   <div className="flex h-[140px] items-center justify-center rounded-[12px] border border-dashed border-[#e7ebf4] bg-[#fbfcff] text-[12px] text-[#8a95ab]">
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

//               <div className="min-h-[180px] px-4 py-5">
//                 {additionalServices.length > 0 ? (
//                   <div className="flex flex-wrap gap-4">
//                     {additionalServices.map((item) => {
//                       const actualIndex = tableData.findIndex((x) => x === item)
//                       const isDeactive =
//                         String(item?.isActive).toLowerCase() === "deactive"
//                       const today = new Date()
//                       today.setHours(0, 0, 0, 0)

//                       const selectedTagged = Array.isArray(item?.taggeddata)
//                         ? (() => {
//                             const tagged = [...item.taggeddata].sort(
//                               (a, b) =>
//                                 new Date(a.nextDue) - new Date(b.nextDue)
//                             )

//                             // 1. Oldest overdue
//                             const overdue = tagged.find((x) => {
//                               const d = new Date(x.nextDue)
//                               d.setHours(0, 0, 0, 0)
//                               return d < today
//                             })

//                             if (overdue) return overdue

//                             // 2. Today
//                             const todayItem = tagged.find((x) => {
//                               const d = new Date(x.nextDue)
//                               d.setHours(0, 0, 0, 0)
//                               return d.getTime() === today.getTime()
//                             })

//                             if (todayItem) return todayItem

//                             // 3. Nearest future
//                             return tagged[0] || null
//                           })()
//                         : null
//                       const dueDate = selectedTagged?.nextDue || item?.nextDue

//                       const isCurrentMonthExpiry = (() => {
//                         if (!dueDate) return false

//                         const date = new Date(dueDate)
//                         const today = new Date()

//                         return (
//                           date.getFullYear() === today.getFullYear() &&
//                           date.getMonth() === today.getMonth()
//                         )
//                       })()

//                       return (
//                         <ProductCircleCard
//                           key={`additional-${actualIndex}`}
//                           item={item}
//                           productType="Additionalservice"
//                           actualIndex={actualIndex}
//                           variant="service"
//                           topBadgeIcon={<FaBuilding size={10} />}
//                           line1={
//                             item?.shortName
//                               ? item?.shortName
//                               : item?.productName
//                           }
//                           line2={
//                             Array.isArray(item?.taggeddata) &&
//                             item.taggeddata.length > 0
//                               ? item.taggeddata
//                                   .map((x) => x.licensenumber)
//                                   .join(", ")
//                                   .slice(0, 18)
//                               : item?.licensenumber
//                           }
//                           // line3={
//                           //   item?.taggeddata?.length > 0
//                           //     ? formatDateToDDMMYYYY(
//                           //         item?.taggeddata?.[0]?.nextDue
//                           //       )
//                           //     : item?.nextDue
//                           //       ? formatDateToDDMMYYYY(item?.nextDue)
//                           //       : ""
//                           // }
//                           line3={
//                             selectedTagged
//                               ? formatDateToDDMMYYYY(selectedTagged.nextDue)
//                               : item?.nextDue
//                                 ? formatDateToDDMMYYYY(item.nextDue)
//                                 : ""
//                           }
//                           line4={isDeactive ? "De Active" : "Active"}
//                           c={item?.taggeddata}
//                           line5={
//                             selectedTagged
//                               ? selectedTagged.productAmount
//                               : item?.productAmount
//                           }
//                           isCurrentMonthExpiry={isCurrentMonthExpiry}
//                           // line5={
//                           //   item?.taggedata
//                           //     ? item?.taggeddata[0]?.productAmount
//                           //     : item?.productAmount
//                           // }
//                           onEdit={handleEdit}
//                           onDelete={handleDelete}
//                         />
//                       )
//                     })}
//                   </div>
//                 ) : (
//                   <div className="flex h-[140px] flex-col items-center justify-center rounded-[12px] border border-dashed border-[#e7ebf4] bg-[#fbfcff] text-center">
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
//       {licenseloading && <FullScreenLoader text="Checking..." />}

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

//                   {/* <PopupField label="Company">
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
//                   </PopupField> */}

//                   {/* <PopupField label="Branch">
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
//                   </PopupField> */}

//                   {/* <PopupField
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
//                         console.log(primaryProducts.length)
//                         console.log(additionalServices.length)
//                         console.log(hasTaggedLicenses)
//                         if (hasTaggedLicenses) return
//                         let index = 0
//                         if (popupType === "Primaryproduct") {
//                           if (primaryProducts.length > 0) {
//                             index++
//                           }
//                           console.log("hhh")
//                         } else if (popupType === "Additionalservice") {
//                           console.log("hh")
//                           if (additionalServices.length > 0) {
//                             index++
//                           }
//                         }
//                         setValue("licensenumber", e.target.value)
//                         console.log(index)
//                         if (debounceTimersRef.current[index]) {
//                           clearTimeout(debounceTimersRef.current[index])
//                         }
//                         const licenseValue = e.target.value
//                         console.log(licenseValue)
//                         debounceTimersRef.current[index] = setTimeout(() => {
//                           handleLicenseBlur(licenseValue)
//                           delete debounceTimersRef.current[index]
//                         }, 1000)
//                         clearErrors("licensenumber")
//                       }}
//                     />
//                   </PopupField> */}
//                   {popupType === "Primaryproduct" && (
//                     <PopupField
//                       label="License Number"
//                       error={
//                         errors.licensenumber?.message ||
//                         (!licenseAvailable && watchedLicense
//                           ? "License number already exists"
//                           : "")
//                       }
//                     >
//                       <input
//                         {...register("licensenumber")}
//                         type="text"
//                         inputMode="numeric"
//                         pattern="[0-9]*"
//                         readOnly={hasTaggedLicenses}
//                         className={`${compactPopupInputClass} ${
//                           hasTaggedLicenses
//                             ? "cursor-not-allowed bg-[#f3f6fb]"
//                             : ""
//                         }`}
//                         placeholder={
//                           popupType === "Primaryproduct"
//                             ? "Enter license number"
//                             : hasTaggedLicenses
//                               ? "Auto handled by tagged licenses"
//                               : "Enter license number"
//                         }
//                         onKeyDown={(e) => {
//                           if (hasTaggedLicenses) return

//                           const allowedKeys = [
//                             "Backspace",
//                             "Delete",
//                             "Tab",
//                             "ArrowLeft",
//                             "ArrowRight",
//                             "Home",
//                             "End"
//                           ]

//                           if (allowedKeys.includes(e.key)) return

//                           if (!/^\d$/.test(e.key)) {
//                             e.preventDefault()
//                           }
//                         }}
//                         onChange={(e) => {
//                           console.log(hasTaggedLicenses)
//                           if (hasTaggedLicenses) return

//                           const numericValue = e.target.value.replace(/\D/g, "")
//                           setValue("licensenumber", numericValue, {
//                             shouldValidate: true
//                           })

//                           let index = 0
//                           if (popupType === "Primaryproduct") {
//                             if (primaryProducts.length > 0) index++
//                           } else if (popupType === "Additionalservice") {
//                             if (additionalServices.length > 0) index++
//                           }

//                           if (debounceTimersRef.current[index]) {
//                             clearTimeout(debounceTimersRef.current[index])
//                           }

//                           debounceTimersRef.current[index] = setTimeout(() => {
//                             handleLicenseBlur(numericValue)
//                             delete debounceTimersRef.current[index]
//                           }, 1000)

//                           clearErrors("licensenumber")
//                         }}
//                       />
//                     </PopupField>
//                   )}

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

//                   {/* {popupType === "Additionalservice" && !hasTaggedLicenses && (
//                     <PopupField label="Next Due">
//                       <input
//                         type="date"
//                         {...register("nextDue")}
//                         className={compactPopupInputClass}
//                       />
//                     </PopupField>
//                   )} */}
//                   {popupType === "Additionalservice" && (
//                     <PopupField label="No of Quantity / Users">
//                       <input
//                         type="number"
//                         {...register("noofusers")}
//                         className={`${compactPopupInputClass} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0`}
//                       />
//                     </PopupField>
//                   )}
//                   {popupType === "Primaryproduct" && (
//                     <PopupField label="Amount">
//                       <input
//                         type="number"
//                         {...register("productAmount")}
//                         className={`${compactPopupInputClass} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0`}
//                       />
//                     </PopupField>
//                   )}

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

//                       {/* <div className="max-h-28 overflow-y-auto rounded-[8px] border border-[#e7ebf4] bg-[#fafcff] p-2">
//                         {
// primaryLicenseOptions.map((option) => {
//   const selectedTaggedLicenses = watch("taggedLicenses") || [];
//   const checked = selectedTaggedLicenses.includes(String(option.licenseNo));

//   return (
//     <label
//       key={option.licenseNo}
//       className="flex items-center gap-2 rounded-md border border-[#edf1f7] bg-white px-2 py-1.5 text-[11px] text-[#4f5d78]"
//     >
//       <input
//         type="checkbox"
//         checked={checked}
//         onChange={(e) => {
//           const licenseNo = String(option.licenseNo);
//           const prev = watch("taggedLicenses") || [];
//           const dueMap = watch("taggedLicenseDueDates") || {};

//           if (e.target.checked) {
//             setValue("taggedLicenses", [...prev, licenseNo]);
//             setValue("licensenumber", "");
//             setValue("taggedLicenseDueDates", {
//               ...dueMap,
//               [licenseNo]: dueMap[licenseNo] || "",
//             });

//             const matched = detailsData?.taggeddata?.find(
//               (item) => String(item.licensenumber) === licenseNo
//             );

//             if (matched) {
//               const currentValues = getValues();

//               reset({
//                 ...currentValues,
//                 taggedLicenseDueDates: {
//                   ...currentValues.taggedLicenseDueDates,
//                   [licenseNo]: {
//                     nextDue: matched.nextDue || "",
//                     productAmount: matched.productAmount ?? "",
//                     taxexclusiveAmount: matched.taxexclusiveAmount ?? "",
//                     taxinclusiveamount: matched.taxinclusiveamount ?? "",
//                     hsn: matched.hsn ?? "",
//                   },
//                 },
//               });
//             }
//           } else {
//             const updatedLicenses = prev.filter(
//               (item) => String(item) !== licenseNo
//             );

//             const updatedDueMap = { ...dueMap };
//             delete updatedDueMap[licenseNo];

//             setValue("taggedLicenses", updatedLicenses);
//             setValue("taggedLicenseDueDates", updatedDueMap);

//             if (updatedLicenses.length === 0) {
//               setValue("licensenumber", "");
//             }
//           }
//         }}
//       />

//       <span>{option.licenseNo}</span>
//       <span className="text-[#7b879c]">- {option.productName}</span>
//     </label>
//   );
// })


//                         ) : (
//                           <p className="text-[11px] italic text-[#96a0b5]">
//                             No primary product license numbers available.
//                           </p>
//                         )}
//                       </div> */}
// <div className="max-h-28 overflow-y-auto rounded-[8px] border border-[#e7ebf4] bg-[#fafcff] p-2">
//   {primaryLicenseOptions.length > 0 ? (
//     <div className="grid grid-cols-1 gap-1.5 md:grid-cols-2">
//       {primaryLicenseOptions.map((option) => {
//         const selectedTaggedLicenses = watch("taggedLicenses") || [];
//         const checked = selectedTaggedLicenses.includes(
//           String(option.licenseNo)
//         );

//         return (
//           <label
//             key={option.licenseNo}
//             className="flex items-center gap-2 rounded-md border border-[#edf1f7] bg-white px-2 py-1.5 text-[11px] text-[#4f5d78]"
//           >
//             <input
//               type="checkbox"
//               checked={checked}
//               onChange={(e) => {
//                 const licenseNo = String(option.licenseNo);
//                 const prev = watch("taggedLicenses") || [];
//                 const dueMap = watch("taggedLicenseDueDates") || {};

//                 if (e.target.checked) {
//                   setValue("taggedLicenses", [...prev, licenseNo]);
//                   setValue("licensenumber", "");
//                   setValue("taggedLicenseDueDates", {
//                     ...dueMap,
//                     [licenseNo]: dueMap[licenseNo] || "",
//                   });

//                   const matched = detailsData?.taggeddata?.find(
//                     (item) => String(item.licensenumber) === licenseNo
//                   );

//                   if (matched) {
//                     const currentValues = getValues();

//                     reset({
//                       ...currentValues,
//                       taggedLicenseDueDates: {
//                         ...currentValues.taggedLicenseDueDates,
//                         [licenseNo]: {
//                           nextDue: matched.nextDue || "",
//                           productAmount: matched.productAmount ?? "",
//                           taxexclusiveAmount: matched.taxexclusiveAmount ?? "",
//                           taxinclusiveamount: matched.taxinclusiveamount ?? "",
//                           hsn: matched.hsn ?? "",
//                         },
//                       },
//                     });
//                   }
//                 } else {
//                   const updatedLicenses = prev.filter(
//                     (item) => String(item) !== licenseNo
//                   );

//                   const updatedDueMap = { ...dueMap };
//                   delete updatedDueMap[licenseNo];

//                   setValue("taggedLicenses", updatedLicenses);
//                   setValue("taggedLicenseDueDates", updatedDueMap);

//                   if (updatedLicenses.length === 0) {
//                     setValue("licensenumber", "");
//                   }
//                 }
//               }}
//             />

//             <span>{option.licenseNo}</span>
//             <span className="text-[#7b879c]">- {option.productName}</span>
//           </label>
//         );
//       })}
//     </div>
//   ) : (
//     <p className="text-[11px] italic text-[#96a0b5]">
//       No primary product license numbers available.
//     </p>
//   )}
// </div>
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

//                                 <th className="border-b border-[#e7ebf4] px-2.5 py-1.5 text-left text-[11px] font-semibold text-[#43506a]">
//                                   Product Price
//                                 </th>
//                                 <th className="border-b border-[#e7ebf4] px-2.5 py-1.5 text-left text-[11px] font-semibold text-[#43506a]">
//                                   Amount(tax.inclusive)
//                                 </th>
//                               </tr>
//                             </thead>
//                             {/* <tbody>
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
                                     
//                                       value={formatDateForInput(
//                                         watchedTaggedLicenseDueDates?.[
//                                           licenseNo
//                                         ]
//                                       )}
//                                       onChange={(e) => {
//                                         console.log(licenseNo)
//                                         const dueMap =
//                                           watch("taggedLicenseDueDates") || {}
//                                         setValue("taggedLicenseDueDates", {
//                                           ...dueMap,
//                                           [licenseNo]: e.target.value
//                                         })
//                                       }}
//                                       className={compactPopupInputClass}
//                                     />
//                                   </td>
//                                 </tr>
//                               ))}
//                             </tbody> */}
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

//                                   <td className="border-b border-[#eef2f7] px-2.5 py-1.5 ">
//                                     <input
//                                       type="date"
//                                       value={formatDateForInput(
//                                         watchedTaggedLicenseDueDates?.[
//                                           licenseNo
//                                         ]?.nextDue
//                                       )}
//                                       onChange={(e) => {
//                                         const dueMap =
//                                           watch("taggedLicenseDueDates") || {}

//                                         setValue("taggedLicenseDueDates", {
//                                           ...dueMap,
//                                           [licenseNo]: {
//                                             ...dueMap[licenseNo],
//                                             nextDue: e.target.value
//                                           }
//                                         })
//                                       }}
//                                       className={compactPopupInputClass}
//                                     />
//                                   </td>

//                                   <td className="border-b border-[#eef2f7] px-2.5 py-1.5">
//                                     <input
//                                       type="number"
//                                       value={
//                                         watchedTaggedLicenseDueDates?.[
//                                           licenseNo
//                                         ]?.taxexclusiveAmount ?? ""
//                                       }
//                                       onChange={(e) => {
//                                         const inputValue = e.target.value
//                                         const dueMap =
//                                           watch("taggedLicenseDueDates") || {}
//                                         console.log(dueMap)
//                                         console.log(dueMap[licenseNo])
//                                         const matchedData = dueMap[licenseNo]
//                                         const taxAmount =
//                                           (Number(matchedData?.hsn) / 100) *
//                                           Number(inputValue)
//                                         const total = Math.round(
//                                           Number(inputValue) + taxAmount
//                                         )
//                                         console.log(taxAmount)
//                                         console.log(total)
//                                         setValue("taggedLicenseDueDates", {
//                                           ...dueMap,
//                                           [licenseNo]: {
//                                             ...dueMap[licenseNo],
//                                             taxexclusiveAmount: inputValue,
//                                             taxinclusiveamount: total,
//                                             productAmount: total
//                                           }
//                                         })
//                                       }}
//                                       onWheel={(e) => e.currentTarget.blur()}
//                                       className={`${compactPopupInputClass} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0`}
//                                     />
//                                   </td>
//                                   <td className="border-b border-[#eef2f7] px-2.5 py-1.5">
//                                     <input
//                                       type="number"
//                                       readOnly
//                                       value={
//                                         watchedTaggedLicenseDueDates?.[
//                                           licenseNo
//                                         ]?.taxinclusiveamount ?? ""
//                                       }
//                                       onChange={(e) => {
//                                         const dueMap =
//                                           watch("taggedLicenseDueDates") || {}

//                                         setValue("taggedLicenseDueDates", {
//                                           ...dueMap,
//                                           [licenseNo]: {
//                                             ...dueMap[licenseNo],
//                                             productAmount: e.target.value,
//                                             taxinclusiveamount: e.target.value
//                                           }
//                                         })
//                                       }}
//                                       onWheel={(e) => e.currentTarget.blur()}
//                                       className={`${compactPopupInputClass} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0 bg-gray-100`}
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
//                   {editIndex !== null ? "Save Details" : "Save Details"}
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
//   productType,
//   variant,
//   topBadgeIcon,
//   line1,
//   line2,
//   line3,
//   line4,
//   line5,
//   onEdit,
//   onDelete,
//   c,
// isCurrentMonthExpiry
// }) => {
//   console.log(line5)
//   console.log(c)
//   const variantClass =
//     variant === "danger"
//       ? "bg-[#ffdedd] border-[#f4c6c2]"
//       : variant === "service"
//         ? "bg-[#fff3c9] border-[#f0e1a2]"
//         : "bg-[#dff3d2] border-[#cce6bc]"

//   return (
//     <div className="group relative">
//       <button
//         type="button"
//         onClick={() => onEdit(item, actualIndex)}
//         className={`relative flex h-[120px] w-[120px]  flex-col items-center justify-center overflow-hidden rounded-full border text-center shadow-sm transition hover:scale-[1.02] ${variantClass}  ${
//       isCurrentMonthExpiry
//         ? "ring-4 ring-red-500 ring-offset-2 animate-pulse"
//         : ""
//     }`}
//       >
//         <div className="flex w-[90px] flex-col items-center justify-center mr-1">
//           <p className="w-full overflow-hidden text-center text-[10px] font-medium leading-[12px] text-[#1e293b] break-words line-clamp-2">
//             {line1}
//           </p>

//           {line2 ? (
//             <p className="mt-1 w-full truncate text-center text-[10px] leading-[12px] text-[#4b5563] font-medium">
//               {line2}
//             </p>
//           ) : null}

//           {line3 ? (
//             <p className="mt-1 w-full whitespace-nowrap text-center text-[10px] font-semibold leading-[10px] text-[#d35c5c]">
//               {productType === "Primaryproduct" ? "Date" : "Due"} : {line3}
//             </p>
//           ) : null}

//           {line4 ? (
//             <p
//               className={`mt-1 w-full truncate text-center text-[9px] font-bold leading-[11px] ${
//                 line4 === "Active" ? "text-green-600" : "text-orange-500"
//               }`}
//             >
//               {line4}
//             </p>
//           ) : null}

//           {line5 ? (
//             <p className="mt-1 w-full truncate text-center text-[9px] font-bold leading-[11px] text-[#0b66e6]">
//               Amount : {line5}
//             </p>
//           ) : null}
//         </div>
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

// const tileInputClass =
//   "w-full border-0 bg-transparent p-0 text-[12px] font-medium text-[#1f2a3d] outline-none placeholder:text-[#c0c8d8]"

// const compactPopupInputClass =
//   "w-full rounded-[8px] border border-[#dfe5ee]  px-2.5 py-1.5 text-[12px] text-[#1f2a3d] outline-none focus:border-[#7ba7ff] "

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
// import { UnsavedChanges } from "../../context/UnsavedChangesContext"
import { useUnsavedChanges } from "../../context/UnsavedChangesContext"
import useUnsavedChangesPrompt from "../../hooks/useUnsavedChangesPrompt"
import UnsavedChangesModal from "../common/UnsavedChangesModal"
const CustomerAdd = ({
  navigatebackto,
  process,
  handleCustomerData,
  handleEditedData,
  customer
}) => {
  const navigate = useNavigate()
const {
  setHasUnsavedChanges,
  requestNavigation
} = useUnsavedChanges()
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
    formState: { errors, isSubmitting, isDirty }
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

  const [detailsData, setdetailsData] = useState({})
  const [duplicatelicense, setduplicatelicense] = useState(null)
  const debounceTimersRef = useRef({})
  const [submissionloader, setsubmissionloader] = useState(false)
  const [licenseloading, setlicenseloading] = useState(false)
  const [productOptions, setProductOptions] = useState([])
  const [companyOptions, setCompanyOptions] = useState([])
  const [branchOptions, setBranchOptions] = useState([])
  const [partner, setPartner] = useState([])
  const [license, setLicense] = useState([])
  const [tableData, setTableData] = useState([])
  const [initialTableData, setInitialTableData] = useState([])
  const [licenseAvailable, setLicenseAvailable] = useState(true)
  const [showProductPopup, setShowProductPopup] = useState(false)
  const [popupType, setPopupType] = useState("")
  const [editIndex, setEditIndex] = useState(null)
const [showUnsavedModal, setShowUnsavedModal] = useState(false)
const [pendingAction, setPendingAction] = useState(null)
  const selectedProduct = watch("productName")
  const registrationType = watch("registrationType")
  const watchedLicense = watch("licensenumber")
  const watchedTaggedLicenses = watch("taggedLicenses") || []
  const watchedTaggedLicenseDueDates = watch("taggedLicenseDueDates") || {}

  const hasTaggedLicenses =
    popupType === "Additionalservice" && watchedTaggedLicenses.length > 0

  const { data: licensenumber } = UseFetch("customer/getLicensenumber")
  const { data: partners } = UseFetch("customer/getallpartners")
  const { data: productData, error: productError } = UseFetch(
    loggeduserBranch &&
      `/product/getallProducts?branchselected=${encodeURIComponent(
        JSON.stringify(loggeduserBranch)
      )}`
  )

  const debouncedLicenseNo = useDebounce(watchedLicense, 1000)
 const isTableDirty =
    JSON.stringify(tableData) !== JSON.stringify(initialTableData)
console.log(initialTableData)
console.log(tableData)
  const hasUnsavedChanges = isDirty || isTableDirty
console.log(hasUnsavedChanges)
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
    "Pipes, Tubes Fittings",
    "Wholesale Trading",
    "Retail Trading",
    "Import & Export",
    "Distribution / Dealers",
    "E-commerce / Online Trading",
    "IT Services",
    "Web Design & Development",
    "Cyber Security Services",
    "Hardware & Networking",
    "Construction Companies",
    "Spare Parts Dealers",
    "Banks",
    "Printing & Publishing",
    "Pharmaceutical Manufacturing",
    "Food Manufacturing",
    "Textile / Garment Manufacturing",
    "Chemical Manufacturing",
    "Plastic Manufacturing",
    "Steel / Metal Manufacturing",
    "Furniture Manufacturing",
    "Building Contractors",
    "Real Estate Developers",
    "Property Management",
    "Transport & Logistics",
    "Finance Companies",
    "Electrical Equipment Manufacturing",
    "Electronics Manufacturing",
    "Automobile Manufacturing",
    "Hospitals",
    "Clinics",
    "Medical Laboratories",
    "Medical Equipment Suppliers",
    "Pharmacies / Medical Stores",
    "Interior Design",
    "Vehicle Dealers",
    "Automobile Service Centres",
    "Insurance Companies",
    "Chartered Accountants / Audit Firms",
    "Tax Consultants",
    "Hotels & Resorts",
    "Schools",
    "Colleges",
    "Training Institutes",
    "Coaching Centers",
    "Educational Consultants",
    "Software Development",
    "Restaurants / Cafes",
    "Travel Agencies",
    "Tourism Operators",
    "Advertising & Marketing Agencies",
    "Event Management",
    "Security Services",
    "Cleaning / Facility Management",
    "NGOs / Non-Profit Organizations",
    "Government Organizations"
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
      setProductOptions(
        productData.map((product) => {
          const basePrice = Number(product?.productPrice || 0)
          const igstRate = Number(
            product?.selected?.[0]?.hsn_id?.onValue?.igstRate || 0
          )

          const gstAmount = (basePrice * igstRate) / 100
          const totalPrice = basePrice + gstAmount

          return {
            label: product.productName,
            value: product._id,
            shortName: product?.shortName,
            productorservicetype: product.productorservicetype,
            defaultservices: product?.defaultservices || [],
            company_id: product?.selected?.[0]?.company_id,
            companyName: product?.selected?.[0]?.companyName,
            branch_id: product?.selected?.[0]?.branch_id,
            branchName: product?.selected?.[0]?.branchName,
            productprice: totalPrice,
            basePrice,
            igstRate,
            gstAmount
          }
        })
      )
    }
  }, [productData])

useEffect(() => {
  setHasUnsavedChanges(hasUnsavedChanges)

  return () => {
    setHasUnsavedChanges(false)
  }
}, [hasUnsavedChanges, setHasUnsavedChanges])
  useEffect(() => {
    if (licensenumber) {
      setLicense(licensenumber)
    }
  }, [licensenumber])

  useEffect(() => {
    if (productError) {
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

      const selectedData =
        customer?.selected?.map((sel) => ({
          company_id: sel?.company_id?._id,
          companyName: sel?.company_id?.companyName,
          branch_id: sel?.branch_id?._id,
          branchName: sel?.branch_id?.branchName,
          product_id: sel?.product_id?._id,
          productName: sel?.product_id?.productName,
          brandName: sel?.brandName,
          categoryName: sel?.categoryName,
          shortName: sel?.product_id?.shortName,
          licensenumber: sel?.licensenumber,
          softwareTrade: sel?.softwareTrade,
          version: sel?.version,
          customerAddDate: sel?.customerAddDate,
          amcstartDate: sel?.amcstartDate,
          amcendDate: sel?.amcendDate,
          amcAmount: sel?.amcAmount,
          amcDescription: sel?.amcDescription,
          licenseExpiryDate: sel?.licenseExpiryDate,
          productamountDescription: sel?.productamountDescription,
          tvuexpiryDate: sel?.tvuexpiryDate,
          tvuAmount: sel?.tvuAmount,
          tvuamountDescription: sel?.tvuamountDescription,
          reasonofStatus: sel?.reasonofStatus,
          applicationDate: sel?.customerAddDate
            ? sel?.customerAddDate
            : sel?.applicationDate,
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

      setTableData(selectedData)
      setInitialTableData(selectedData)
    } else {
      setInitialTableData([])
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
    const uniqueMap = new Map()

    tableData
      .filter(
        (item) =>
          String(item?.productorservicetype).toLowerCase() === "primaryproduct"
      )
      .forEach((item) => {
        const licenseNo = String(item?.licensenumber || "").trim()

        if (licenseNo && !uniqueMap.has(licenseNo)) {
          uniqueMap.set(licenseNo, {
            licenseNo,
            productName: item?.productName || ""
          })
        }
      })

    return Array.from(uniqueMap.values())
  }, [tableData])

  const handleProductChange = (selectedOption) => {
    setValue("productName", selectedOption, { shouldDirty: true })
    setValue("shortName", selectedOption?.shortName, { shouldDirty: true })
    setValue("productAmount", selectedOption?.productprice, { shouldDirty: true })
    setValue("companyName", null, { shouldDirty: true })
    setValue("branchName", null, { shouldDirty: true })
    setValue("licensenumber", "", { shouldDirty: true })
    setValue("taggedLicenses", [], { shouldDirty: true })
    setValue("taggedLicenseDueDates", {}, { shouldDirty: true })
    setCompanyOptions(getCompaniesForProduct(selectedOption?.value))
    setBranchOptions([])
  }

  const handleCompanyChange = (selectedCompanyOption) => {
    setValue("companyName", selectedCompanyOption, { shouldDirty: true })
    setValue("branchName", null, { shouldDirty: true })

    const branches = getBranchesForCompany(
      getValues("productName")?.value,
      selectedCompanyOption?.value
    )
    setBranchOptions(branches)
  }

  const handleBranchChange = (selectedBranchOption) => {
    setValue("branchName", selectedBranchOption, { shouldDirty: true })
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
    setduplicatelicense(null)
    setdetailsData([])
  }
// const handleCancelNavigation = () => {
//   if (hasUnsavedChanges) {
//     const confirmLeave = window.confirm(
//       "You have unsaved customer details. Leaving this page without saving will discard the data. Do you want to continue?"
//     )
//     if (!confirmLeave) return
//   }

//   if (navigatebackto) {
//     navigate(navigatebackto)
//   } else {
//     navigate(-1)
//   }
// }
// const handleCancelNavigation = () => {
//   openUnsavedWarning(() => {
//     if (navigatebackto) {
//       navigate(navigatebackto)
//     } else {
//       navigate(-1)
//     }
//   })
// }
const handleCancelNavigation = () => {
  requestNavigation(() => {
    if (navigatebackto) {
      navigate(navigatebackto)
    } else {
      navigate(-1)
    }
  })
}
  const handleLicenseBlur = async (licenseNumber) => {
    if (!String(licenseNumber).trim()) return

    try {
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

      if (data.exists) {
        toast.error(`License ${licenseNumber} already exists`)
        setduplicatelicense(true)
        return
      } else {
        setduplicatelicense(null)
      }

      toast.success("License available")
    } catch (error) {
      toast.error("Failed to validate license")
    } finally {
      setlicenseloading(false)
    }
  }

  const handleEdit = (item, index) => {
    setdetailsData(item)
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
          acc[String(entry.licensenumber)] = {
            nextDue: entry?.nextDue || "",
            productAmount: entry?.productAmount ?? "",
            taxexclusiveAmount: entry?.taxexclusiveAmount ?? "",
            taxinclusiveamount: entry?.taxinclusiveamount ?? "",
            hsn: entry?.hsn ?? ""
          }
        }
        return acc
      }, {}) || {}

    setCompanyOptions(getCompaniesForProduct(item?.product_id))
    setBranchOptions(getBranchesForCompany(item?.product_id, item?.company_id))

    reset({
      ...getValues(),
      productName: productOption,
      companyName: companyOption,
      branchName: branchOption,
      licensenumber: item?.licensenumber || "",
      softwareTrade: item?.softwareTrade || "",
      applicationDate: item?.applicationDate || "",
      nextDue: item?.nextDue || "",
      shortName: item?.shortName || "",
      noofusers: item?.noofusers || "",
      productAmount: item?.productAmount || "",
      isActive: item?.isActive || "Running",
      taggedLicenses: taggedLicensesFromData,
      taggedLicenseDueDates: taggedLicenseDueDatesFromData
    })

    setShowProductPopup(true)
  }

  const handleDelete = (index) => {
    setTableData((prev) => prev.filter((_, i) => i !== index))
  }

  const validateSelectedLeadList = (selectedleadlist = []) => {
    const hasAdditionalService = selectedleadlist.some(
      (row) =>
        String(row?.productorservicetype || "").toLowerCase() ===
        "additionalservice"
    )

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const parseDateOnly = (value) => {
      if (!value) return null
      const d = new Date(value)
      if (Number.isNaN(d.getTime())) return null
      d.setHours(0, 0, 0, 0)
      return d
    }

    for (let i = 0; i < selectedleadlist.length; i++) {
      const row = selectedleadlist[i]
      const type = String(row?.productorservicetype || "").toLowerCase()

      const hasCompany = !!(row?.company_id || row?.companyid || row?.companyName)
      const hasBranch = !!(row?.branch_id || row?.branchid || row?.branchName)

      if (!hasCompany) {
        return `Company is required for ${row?.productName}`
      }

      if (!hasBranch) {
        return `Branch is required for ${row?.productName}`
      }

      const productPrice = Number(
        row?.productAmount ?? row?.productPrice ?? row?.amount ?? 0
      )

      if (type === "primaryproduct") {
        if (!String(row?.licensenumber || row?.licenseNumber || "").trim()) {
          return `License number is required for ${row?.productName}`
        }
        if (!row.applicationDate) {
          return `Application date is requiered for ${row?.productName}, please add details`
        }
        if (!(productPrice > 0)) {
          return `Product price must be greater than 0 for ${row?.productName}`
        }
      }

      if (type === "additionalservice") {
        const taggeddata = Array.isArray(row?.taggeddata) ? row.taggeddata : []
        const outerLicense = String(
          row?.licensenumber || row?.licenseNumber || ""
        ).trim()
        const hasTaggedLicense = taggeddata.some((tag) =>
          String(tag?.licensenumber || tag?.licenseNumber || "").trim()
        )
        const hasAnyLicense = !!outerLicense || hasTaggedLicense

        if (!hasAdditionalService && !(productPrice > 0)) {
          return `Product price must be greater than 0 for additional service ${row.productName}`
        }

        if (taggeddata.length > 0) {
          for (let j = 0; j < taggeddata.length; j++) {
            const tag = taggeddata[j]
            const tagLicense = String(
              tag?.licensenumber || tag?.licenseNumber || ""
            ).trim()
            const due = parseDateOnly(tag?.nextDue)

            if (!tagLicense) {
              return `Tagged license number is required in ${row?.productName}`
            }

            if (!due) {
              return `Next due is required for tagged license ${tagLicense} for ${row?.productName}`
            }

            if (due < today) {
              return `Next due cannot be less than current date for tagged license ${tagLicense} for ${row?.productName}`
            }
          }
        } else {
          if (!row.nextDue) {
            return `Additional service ${row?.productName} must have a next Due, please add details`
          }
          if (!outerLicense && taggeddata.length === 0) {
            return `Additional service ${row?.productName} must have a license number or tagged license`
          }

          const due = parseDateOnly(row?.nextDue)
          if (!due) {
            return `Next due is required for additional service ${row?.productName}`
          }

          if (due < today) {
            return `Next due cannot be less than current date for additional service ${row?.productName}`
          }
        }

        if (!hasAnyLicense) {
          return `Additional service ${row?.productName} must have a license number or tagged license`
        }
      }
    }

    return null
  }

  const savePopupData = () => {
    if (duplicatelicense) {
      toast.error("License already exists")
      return
    }

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
        (licenseNo) => !String(dueMap[String(licenseNo)]?.nextDue || "").trim()
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
            nextDue: dueMap[String(licenseNo)]?.nextDue || "",
            productAmount: Number(
              dueMap[String(licenseNo)]?.productAmount || 0
            ),
            taxexclusiveAmount: Number(
              dueMap[String(licenseNo)]?.taxexclusiveAmount || 0
            ),
            taxinclusiveamount: Number(
              dueMap[String(licenseNo)]?.taxinclusiveamount || 0
            )
          }))
        : []

    const baseRow = editIndex !== null ? tableData[editIndex] : {}

    const row = {
      ...baseRow,
      company_id: values?.productName?.company_id,
      companyName: values?.productName?.companyName,
      branch_id: values?.productName?.branch_id,
      branchName: values?.productName?.branchName,
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

    const selectedProductObj = productOptions?.find(
      (p) => p.value === values?.productName?.value
    )

    const defaultServiceRows =
      popupType === "Primaryproduct" &&
      selectedProductObj?.defaultservices?.length
        ? selectedProductObj.defaultservices.map((service) => ({
            company_id: values?.productName?.company_id,
            companyName: values?.productName?.companyName,
            branch_id: values?.productName?.branch_id,
            branchName: values?.productName?.branchName,
            product_id: service?._id,
            productName: service?.productName,
            shortName: service?.shortName || "",
            licensenumber: null,
            softwareTrade: "",
            applicationDate: "",
            nextDue: "",
            noofusers: 0,
            productAmount: service?.productPrice
              ? Number(service.productPrice)
              : 0,
            isActive: values?.isActive || "Running",
            productorservicetype: "Additionalservice",
            taggeddata: [],
            taggedLicenses: [],
            parentProductId: values?.productName?.value,
            parentProductName: values?.productName?.label,
            autoAddedFromDefaultService: true
          }))
        : []

    setTableData((prev) => {
      if (editIndex !== null) {
        const updated = [...prev]
        updated[editIndex] = row
        return updated
      }

      const existingAdditionalServiceIds = new Set(
        prev
          .filter(
            (item) =>
              String(item.productorservicetype).toLowerCase() ===
              "additionalservice"
          )
          .map((item) => String(item.product_id))
      )

      const newDefaultServices = defaultServiceRows.filter(
        (service) =>
          !existingAdditionalServiceIds.has(String(service.product_id))
      )

      return [...prev, row, ...newDefaultServices]
    })

    closePopup()
  }

  const filteredOptionsByType = useMemo(() => {
    let options = productOptions.filter(
      (item) =>
        String(item?.productorservicetype).toLowerCase() ===
        String(popupType).toLowerCase()
    )

    if (String(popupType).toLowerCase() === "additionalservice") {
      const existingServiceIds = new Set(
        tableData
          .filter(
            (item) =>
              String(item?.productorservicetype).toLowerCase() ===
              "additionalservice"
          )
          .map((item) => String(item.product_id))
      )

      options = options.filter(
        (item) => !existingServiceIds.has(String(item.value))
      )
    }

    return options
  }, [productOptions, popupType, tableData])

  const primaryProducts = useMemo(() => {
    return tableData.filter(
      (item) =>
        String(item?.productorservicetype).toLowerCase() === "primaryproduct"
    )
  }, [tableData])

  const additionalServices = useMemo(() => {
    return tableData.filter(
      (item) =>
        String(item?.productorservicetype).toLowerCase() === "additionalservice"
    )
  }, [tableData])

  const formatDateForInput = (date) => {
    if (!date) return ""
    return String(date).split("T")[0]
  }

 
  // useUnsavedChangesPrompt(
  //   hasUnsavedChanges,
  //   "You have unsaved customer details. Leaving this page without saving will discard the data. Do you want to continue?"
  // )
useUnsavedChangesPrompt({
  when: hasUnsavedChanges,
  onBlock: ({ proceed, stay }) => {
    setPendingAction(() => ({
      proceed,
      stay
    }))
    setShowUnsavedModal(true)
  }
})
const openUnsavedWarning = (action) => {
  if (!hasUnsavedChanges) {
    action()
    return
  }

  setPendingAction(() => ({
    proceed: action,
    stay: () => {}
  }))
  setShowUnsavedModal(true)
}

const handleStayOnPage = () => {
  pendingAction?.stay?.()
  setShowUnsavedModal(false)
  setPendingAction(null)
}

const handleLeavePage = () => {
  setShowUnsavedModal(false)
  const action = pendingAction?.proceed
  setPendingAction(null)
  action?.()
}
  const onSubmit = async (data) => {
    const validationMessage = validateSelectedLeadList(tableData)

    if (validationMessage) {
      toast.error(validationMessage)
      return
    }

    if (submissionloader) return

    setsubmissionloader(true)
    try {
      if (process === "Registration") {
        await handleCustomerData(data, tableData)
        reset()
        setTableData([])
        setInitialTableData([])
      } else if (process === "edit") {
        await handleEditedData(data, tableData, customer?.index)
        reset(data)
        setInitialTableData(tableData)
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
                // onClick={() =>
                //   navigatebackto ? navigate(navigatebackto) : navigate(-1)
                // }
// onClick={() => navigatebackto ? navigate(navigatebackto) : navigate(-1)}
  onClick={handleCancelNavigation}
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
                    setValue("customerName", e.target.value.trim(), {
                      shouldDirty: true
                    })
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
                  onBlur={(e) =>
                    setValue("pincode", e.target.value.trim(), {
                      shouldDirty: true
                    })
                  }
 onWheel={(e) => e.currentTarget.blur()}
                  className={`${tileInputClass} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0`}
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
                  onBlur={(e) =>
                    setValue("city", e.target.value.trim(), {
                      shouldDirty: true
                    })
                  }
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
                  onBlur={(e) =>
                    setValue("email", e.target.value.trim(), {
                      shouldDirty: true
                    })
                  }
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
                  onBlur={(e) =>
                    setValue("address1", e.target.value.trim(), {
                      shouldDirty: true
                    })
                  }
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
                    setValue("contactPerson", e.target.value.trim(), {
                      shouldDirty: true
                    })
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
                  onBlur={(e) =>
                    setValue("mobile", e.target.value.trim(), {
                      shouldDirty: true
                    })
                  }
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
                    <option key={index} value={partnr._id}>
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
                  onBlur={(e) =>
                    setValue("address2", e.target.value.trim(), {
                      shouldDirty: true
                    })
                  }
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
                  onBlur={(e) =>
                    setValue("state", e.target.value.trim(), {
                      shouldDirty: true
                    })
                  }
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
                  onBlur={(e) =>
                    setValue("country", e.target.value.trim(), {
                      shouldDirty: true
                    })
                  }
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
                  onBlur={(e) =>
                    setValue("landline", e.target.value.trim(), {
                      shouldDirty: true
                    })
                  }
                  className={tileInputClass}
                  placeholder="Landline"
                />
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
                    onBlur={(e) =>
                      setValue("gstNo", e.target.value.trim(), {
                        shouldDirty: true
                      })
                    }
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
                  Add Products
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
                            item?.shortName ? item?.shortName : item?.productName
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
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)

                      const selectedTagged = Array.isArray(item?.taggeddata)
                        ? (() => {
                            const tagged = [...item.taggeddata].sort(
                              (a, b) =>
                                new Date(a.nextDue) - new Date(b.nextDue)
                            )

                            const overdue = tagged.find((x) => {
                              const d = new Date(x.nextDue)
                              d.setHours(0, 0, 0, 0)
                              return d < today
                            })

                            if (overdue) return overdue

                            const todayItem = tagged.find((x) => {
                              const d = new Date(x.nextDue)
                              d.setHours(0, 0, 0, 0)
                              return d.getTime() === today.getTime()
                            })

                            if (todayItem) return todayItem
                            return tagged[0] || null
                          })()
                        : null

                      const dueDate = selectedTagged?.nextDue || item?.nextDue

                      const isCurrentMonthExpiry = (() => {
                        if (!dueDate) return false
                        const date = new Date(dueDate)
                        const today = new Date()

                        return (
                          date.getFullYear() === today.getFullYear() &&
                          date.getMonth() === today.getMonth()
                        )
                      })()

                      return (
                        <ProductCircleCard
                          key={`additional-${actualIndex}`}
                          item={item}
                          productType="Additionalservice"
                          actualIndex={actualIndex}
                          variant="service"
                          topBadgeIcon={<FaBuilding size={10} />}
                          line1={
                            item?.shortName ? item?.shortName : item?.productName
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
                            selectedTagged
                              ? formatDateToDDMMYYYY(selectedTagged.nextDue)
                              : item?.nextDue
                                ? formatDateToDDMMYYYY(item.nextDue)
                                : ""
                          }
                          line4={isDeactive ? "De Active" : "Active"}
                          c={item?.taggeddata}
                          line5={
                            selectedTagged
                              ? selectedTagged.productAmount
                              : item?.productAmount
                          }
                          isCurrentMonthExpiry={isCurrentMonthExpiry}
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
              // onClick={() =>
              //   navigatebackto ? navigate(navigatebackto) : navigate(-1)
              // }
onClick={handleCancelNavigation}
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
<UnsavedChangesModal
  open={showUnsavedModal}
  onClose={handleStayOnPage}
  onConfirm={handleLeavePage}
  title="Leave without saving?"
  description="You have unsaved customer details. If you continue, the entered data will be lost."
/>
      {showProductPopup && (
        <div className="fixed inset-0 z-50 bg-black/30 p-2 sm:p-3">
          <div className="flex min-h-full items-center justify-center">
            <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[14px] bg-white shadow-2xl">
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

                  {popupType === "Primaryproduct" && (
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
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        readOnly={hasTaggedLicenses}
                        className={`${compactPopupInputClass} ${
                          hasTaggedLicenses
                            ? "cursor-not-allowed bg-[#f3f6fb]"
                            : ""
                        }`}
                        placeholder="Enter license number"
                        onKeyDown={(e) => {
                          if (hasTaggedLicenses) return

                          const allowedKeys = [
                            "Backspace",
                            "Delete",
                            "Tab",
                            "ArrowLeft",
                            "ArrowRight",
                            "Home",
                            "End"
                          ]

                          if (allowedKeys.includes(e.key)) return

                          if (!/^\d$/.test(e.key)) {
                            e.preventDefault()
                          }
                        }}
                        onChange={(e) => {
                          if (hasTaggedLicenses) return

                          const numericValue = e.target.value.replace(/\D/g, "")
                          setValue("licensenumber", numericValue, {
                            shouldValidate: true,
                            shouldDirty: true
                          })

                          let index = 0
                          if (popupType === "Primaryproduct") {
                            if (primaryProducts.length > 0) index++
                          } else if (popupType === "Additionalservice") {
                            if (additionalServices.length > 0) index++
                          }

                          if (debounceTimersRef.current[index]) {
                            clearTimeout(debounceTimersRef.current[index])
                          }

                          debounceTimersRef.current[index] = setTimeout(() => {
                            handleLicenseBlur(numericValue)
                            delete debounceTimersRef.current[index]
                          }, 1000)

                          clearErrors("licensenumber")
                        }}
                      />
                    </PopupField>
                  )}

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

                  {popupType === "Additionalservice" && (
                    <PopupField label="No of Quantity / Users">
                      <input
                        type="number"
                        {...register("noofusers")}
 onWheel={(e) => e.currentTarget.blur()}
                        className={`${compactPopupInputClass} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0`}
                      />
                    </PopupField>
                  )}

                  {popupType === "Primaryproduct" && (
                    <PopupField label="Amount">
                      <input
                        type="number"
                        {...register("productAmount")}
                        className={`${compactPopupInputClass} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0`}
                      />
                    </PopupField>
                  )}

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
                            {primaryLicenseOptions.map((option) => {
                              const selectedTaggedLicenses =
                                watch("taggedLicenses") || []
                              const checked = selectedTaggedLicenses.includes(
                                String(option.licenseNo)
                              )

                              return (
                                <label
                                  key={option.licenseNo}
                                  className="flex items-center gap-2 rounded-md border border-[#edf1f7] bg-white px-2 py-1.5 text-[11px] text-[#4f5d78]"
                                >
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={(e) => {
                                      const licenseNo = String(option.licenseNo)
                                      const prev =
                                        watch("taggedLicenses") || []
                                      const dueMap =
                                        watch("taggedLicenseDueDates") || {}

                                      if (e.target.checked) {
                                        setValue(
                                          "taggedLicenses",
                                          [...prev, licenseNo],
                                          { shouldDirty: true }
                                        )
                                        setValue("licensenumber", "", {
                                          shouldDirty: true
                                        })
                                        setValue(
                                          "taggedLicenseDueDates",
                                          {
                                            ...dueMap,
                                            [licenseNo]: dueMap[licenseNo] || ""
                                          },
                                          { shouldDirty: true }
                                        )

                                        const matched =
                                          detailsData?.taggeddata?.find(
                                            (item) =>
                                              String(item.licensenumber) ===
                                              licenseNo
                                          )

                                        if (matched) {
                                          const currentValues = getValues()

                                          reset({
                                            ...currentValues,
                                            taggedLicenseDueDates: {
                                              ...currentValues.taggedLicenseDueDates,
                                              [licenseNo]: {
                                                nextDue: matched.nextDue || "",
                                                productAmount:
                                                  matched.productAmount ?? "",
                                                taxexclusiveAmount:
                                                  matched.taxexclusiveAmount ??
                                                  "",
                                                taxinclusiveamount:
                                                  matched.taxinclusiveamount ??
                                                  "",
                                                hsn: matched.hsn ?? ""
                                              }
                                            }
                                          })
                                        }
                                      } else {
                                        const updatedLicenses = prev.filter(
                                          (item) => String(item) !== licenseNo
                                        )

                                        const updatedDueMap = { ...dueMap }
                                        delete updatedDueMap[licenseNo]

                                        setValue(
                                          "taggedLicenses",
                                          updatedLicenses,
                                          { shouldDirty: true }
                                        )
                                        setValue(
                                          "taggedLicenseDueDates",
                                          updatedDueMap,
                                          { shouldDirty: true }
                                        )

                                        if (updatedLicenses.length === 0) {
                                          setValue("licensenumber", "", {
                                            shouldDirty: true
                                          })
                                        }
                                      }
                                    }}
                                  />

                                  <span>{option.licenseNo}</span>
                                  <span className="text-[#7b879c]">
                                    - {option.productName}
                                  </span>
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
                                <th className="border-b border-[#e7ebf4] px-2.5 py-1.5 text-left text-[11px] font-semibold text-[#43506a]">
                                  Product Price
                                </th>
                                <th className="border-b border-[#e7ebf4] px-2.5 py-1.5 text-left text-[11px] font-semibold text-[#43506a]">
                                  Amount(tax.inclusive)
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
                                      value={formatDateForInput(
                                        watchedTaggedLicenseDueDates?.[
                                          licenseNo
                                        ]?.nextDue
                                      )}
                                      onChange={(e) => {
                                        const dueMap =
                                          watch("taggedLicenseDueDates") || {}

                                        setValue(
                                          "taggedLicenseDueDates",
                                          {
                                            ...dueMap,
                                            [licenseNo]: {
                                              ...dueMap[licenseNo],
                                              nextDue: e.target.value
                                            }
                                          },
                                          { shouldDirty: true }
                                        )
                                      }}
                                      className={compactPopupInputClass}
                                    />
                                  </td>

                                  <td className="border-b border-[#eef2f7] px-2.5 py-1.5">
                                    <input
                                      type="number"
                                      value={
                                        watchedTaggedLicenseDueDates?.[
                                          licenseNo
                                        ]?.taxexclusiveAmount ?? ""
                                      }
                                      onChange={(e) => {
                                        const inputValue = e.target.value
                                        const dueMap =
                                          watch("taggedLicenseDueDates") || {}
                                        const matchedData = dueMap[licenseNo]
                                        const taxAmount =
                                          (Number(matchedData?.hsn) / 100) *
                                          Number(inputValue)
                                        const total = Math.round(
                                          Number(inputValue) + taxAmount
                                        )

                                        setValue(
                                          "taggedLicenseDueDates",
                                          {
                                            ...dueMap,
                                            [licenseNo]: {
                                              ...dueMap[licenseNo],
                                              taxexclusiveAmount: inputValue,
                                              taxinclusiveamount: total,
                                              productAmount: total
                                            }
                                          },
                                          { shouldDirty: true }
                                        )
                                      }}
                                      onWheel={(e) => e.currentTarget.blur()}
                                      className={`${compactPopupInputClass} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0`}
                                    />
                                  </td>
                                  <td className="border-b border-[#eef2f7] px-2.5 py-1.5">
                                    <input
                                      type="number"
                                      readOnly
                                      value={
                                        watchedTaggedLicenseDueDates?.[
                                          licenseNo
                                        ]?.taxinclusiveamount ?? ""
                                      }
                                      onWheel={(e) => e.currentTarget.blur()}
                                      className={`${compactPopupInputClass} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0 bg-gray-100`}
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
                  Save Details
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
  c,
  isCurrentMonthExpiry
}) => {
  const variantClass =
    variant === "danger"
      ? "bg-[#ffdedd] border-[#f4c6c2]"
      : variant === "service"
        ? "bg-[#fff3c9] border-[#f0e1a2]"
        : "bg-[#dff3d2] border-[#cce6bc]"

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={() => onEdit(item, actualIndex)}
        className={`relative flex h-[120px] w-[120px] flex-col items-center justify-center overflow-hidden rounded-full border text-center shadow-sm transition hover:scale-[1.02] ${variantClass} ${
          isCurrentMonthExpiry
            ? "animate-pulse ring-4 ring-red-500 ring-offset-2"
            : ""
        }`}
      >
        <div className="mr-1 flex w-[90px] flex-col items-center justify-center">
          <p className="line-clamp-2 w-full overflow-hidden break-words text-center text-[10px] font-medium leading-[12px] text-[#1e293b]">
            {line1}
          </p>

          {line2 ? (
            <p className="mt-1 w-full truncate text-center text-[10px] font-medium leading-[12px] text-[#4b5563]">
              {line2}
            </p>
          ) : null}

          {line3 ? (
            <p className="mt-1 w-full whitespace-nowrap text-center text-[10px] font-semibold leading-[10px] text-[#d35c5c]">
              {productType === "Primaryproduct" ? "Date" : "Due"} : {line3}
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
  )
}

const tileInputClass =
  "w-full border-0 bg-transparent p-0 text-[12px] font-medium text-[#1f2a3d] outline-none placeholder:text-[#c0c8d8]"

const compactPopupInputClass =
  "w-full rounded-[8px] border border-[#dfe5ee] px-2.5 py-1.5 text-[12px] text-[#1f2a3d] outline-none focus:border-[#7ba7ff]"

export default CustomerAdd
