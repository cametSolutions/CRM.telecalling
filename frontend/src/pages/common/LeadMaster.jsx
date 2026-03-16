// import { useEffect, useState, useMemo, useRef } from "react"
// import { Country, State } from "country-state-city"
// import BarLoader from "react-spinners/BarLoader"
// import { FaSpinner } from "react-icons/fa"
// import Select from "react-select"
// import { useForm } from "react-hook-form"
// import PopUp from "../../components/common/PopUp"
// import { toast } from "react-toastify"
// import UseFetch from "../../hooks/useFetch"
// import api from "../../api/api"
// import { Loader } from "lucide-react"

// const LeadMaster = ({
//   process,
//   Data,
//   isReadOnly,
//   handleleadData,
//   handleEditData,
//   loadingState,
//   setLoadingState,
//   editloadingState,
//   seteditLoadingState,
//   showmessage,
//   showpopupMessage
// }) => {
//   const {
//     register: registerMain,
//     handleSubmit: handleSubmitMain,
//     setValue: setValueMain,

//     watch: watchMain,

//     clearErrors: clearMainerrors,
//     formState: { errors: errorsMain }
//   } = useForm()
//   // For modal form
//   const {
//     register: registerModal,
//     handleSubmit: handleSubmitModal,
//     setValue: setValueModal,
//     getValues: getValuesModal,
//     watch: watchModal,
//     setError,
//     clearErrors: clearmodalErros,
//     formState: { errors: errorsModal },
//     reset: resetModal
//   } = useForm()
//   const [productOrserviceSelections, setProductorServiceSelections] = useState(
//     {}
//   )
//   const [leadList, setLeadList] = useState([])
//   const [submitLoading, setsubmitLoading] = useState(false)
//   const [popupOpen, setPopupOpen] = useState(false)
//   const [formData, setFormData] = useState(null)
//   const [restrictionMessage, setrestrictMessage] = useState()
//   const [isEligible, setIseligible] = useState(false)
//   const [openLicenseDropdown, setOpenLicenseDropdown] = useState(null)
//   const [openProductDropdown, setOpenProductDropdown] = useState(null)
//   const [popupMessage, setPopupMessage] = useState("")
//   const [ispopupModalOpen, setIspopupModalOpen] = useState(false)
//   const [isSelfAllocationChangable, setselfAllocationChangable] = useState(true)
//   const [modalloader, setModalLoader] = useState(false)
//   const [selfAllocation, setselfAllocation] = useState(false)
//   const [partner, setPartner] = useState([])
//   const [editMode, setEditMode] = useState(false)
//   const [selectedCountry, setSelectedCountry] = useState(null)
//   const [licensewithoutProductSelection, setlicenseWithoutProductSelection] =
//     useState({})
//   const [iscustomerchangeandbranch, setcutomerchangeandbranch] = useState(true)
//   const [selectedState, setSelectedState] = useState(null)
//   const [selectedleadlist, setSelectedLeadList] = useState([])
//   const [selectedCustomer, setSelectedCustomer] = useState(null)
//   const [selectedLicense, setSelectedLicense] = useState(null)
//   const [modalOpen, setModalOpen] = useState(false)
//   const [customerOptions, setCustomerOptions] = useState([])
//   const [isleadForOpen, setIsleadForOpen] = useState(false)
//   const [isLicenseOpen, setIslicenseOpen] = useState(false)
//   const [branches, setBranches] = useState([])
//   const [customerTableData, setcustomerTableData] = useState([])
//   const [validateError, setValidateError] = useState({})
//   const [loggeduser, setloggedUser] = useState(null)
//   const [allstaff, setallStaffs] = useState([])
//   const [selectedBranch, setSelectedBranch] = useState(null)
//   const [tasklist, settasklist] = useState([])
//   console.log(tasklist)
//   const [allcustomer, setallcustomer] = useState([])
//   const dropdownLicenseRef = useRef(null)
//   const dropdownLeadforRef = useRef(null)
//   const registrationType = watchModal("registrationType")

//   const { data: productData, loading: productLoading } = UseFetch(
//     loggeduser &&
//       selectedBranch &&
//       selectedBranch.length &&
//       `/product/getallProducts?branchselected=${encodeURIComponent(
//         JSON.stringify(selectedBranch)
//       )}`
//   )
//   const { data: tasks } = UseFetch("lead/getallTask")
//   const { data: companybranches } = UseFetch("/branch/getBranch")
//   const { data: partners } = UseFetch("/customer/getallpartners")
//   const { data: serviceData } = UseFetch(
//     loggeduser &&
//       selectedBranch &&
//       `/product/getallServices?branchselected=${selectedBranch}`
//   )
//   const { data: alluser, loading: usersLoading } = UseFetch("/auth/getallUsers")
//   const {
//     data: customerData,
//     loading: customerLoading,
//     refreshHook
//   } = UseFetch(
//     loggeduser &&
//       selectedBranch &&
//       `/customer/getallCustomer?branchSelected=${selectedBranch}`
//   )
//   console.log(tasks)
//   useEffect(() => {
//     const userData = localStorage.getItem("user")
//     if (userData) {
//       const user = JSON.parse(userData)
//       setloggedUser(user)
//       if (user.role === "Staff" || user.role === "Manager") {
//         const branch = user.selected.map((branch) => branch.branch_id)
//         const branches = JSON.stringify(branch)

//         setBranches(branches)
//       }
//     }
//   }, [])
//   useEffect(() => {
//     if (tasks) {
//       settasklist(tasks.filter((item) => item.taskName === "Followup"))
//     }
//   }, [tasks])
//   useEffect(() => {
//     if (showmessage) {
//       setIspopupModalOpen(true)
//     }
//   }, [showmessage])
//   useEffect(() => {
//     if (companybranches && companybranches.length > 0) {
//       const defaultBranch = companybranches[0]._id
//       if (Data && Data.length) {
//         const customerBranch = Data[0].leadBranch
//         setSelectedBranch([customerBranch])
//         setValueMain("leadBranch", customerBranch)
//       } else if (defaultBranch) {
//         setSelectedBranch([defaultBranch])
//         setValueMain("leadBranch", defaultBranch)
//       }
//     }
//   }, [companybranches, Data])
//   useEffect(() => {
//     if (
//       loggeduser &&
//       productData &&
//       productData.length &&
//       serviceData &&
//       serviceData.length &&
//       partners &&
//       selectedBranch
//     ) {
//       const filteredPartners = partners.filter((partner) =>
//         partner.relationBranches.some((branch) =>
//           selectedBranch.includes(branch?.branchName?._id)
//         )
//       )
//       setPartner(filteredPartners)
//       const combinedlead = [...productData, ...serviceData]
//       setLeadList(combinedlead)
//     }
//   }, [loggeduser, branches, productData, serviceData, partners, selectedBranch]) //here dependency partners is not state its usefetch data for partners

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         dropdownLicenseRef.current &&
//         !dropdownLicenseRef.current.contains(event.target)
//       ) {
//         setIslicenseOpen(false)
//       }
//       if (
//         dropdownLeadforRef.current &&
//         !dropdownLeadforRef.current.contains(event.target)
//       ) {
//         setIsleadForOpen(false)
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside)
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [])

//   useEffect(() => {
//     if (loggeduser?._id) {
//       setValueMain("leadBy", loggeduser._id) // Manually set the value
//     }
//   }, [loggeduser, setValueMain])
//   useEffect(() => {
//     if (
//       Data &&
//       Data.length > 0 &&
//       customerOptions &&
//       customerOptions.length &&
//       loggeduser
//     ) {
//       if (Data[0]?.selfAllocation) {
//         setselfAllocationChangable(false)
//       }
//       // if (Data[0].activityLog.length === 2) {
//       //   const allocatedtoData =
//       //     Data[0].activityLog[Data[0].activityLog.length - 1]
//       //   if (allocatedtoData.taskallocatedBy === loggeduser._id) {
//       //     setselfAllocationChangable(true)
//       //   } else {
//       //     setselfAllocationChangable(false)
//       //   }
//       // } else if (Data[0].activityLog.length > 2) {
//       //   setselfAllocationChangable(false)
//       // }
//       if (Data[0].activityLog.length === 1) {
//         setcutomerchangeandbranch(true)
//       } else if (Data[0].activityLog.length > 1) {
//         setcutomerchangeandbranch(false)
//       }
//       setValueMain("leadId", Data[0]?.leadId)
//       setValueMain("partner", Data[0]?.partner)
//       setValueMain(
//         "selfAllocation",
//         Data[0]?.selfAllocation === true ? "true" : "false"
//       )
//       if (Data[0].selfAllocation === true) {
//         setselfAllocation(true)
//         setValueMain("allocationType", Data[0].selfAllocationType)
//         const formattedDate = Data[0].selfAllocationDueDate
//           ? Data[0].selfAllocationDueDate.split("T")[0]
//           : ""
//         setValueMain("dueDate", formattedDate)
//       }

//       setValueMain("customerName", Data[0]?.customerName?._id)
//       setValueMain("mobile", Data[0]?.customerName?.mobile)
//       setValueMain("phone", Data[0]?.customerName?.phone)
//       setValueMain("email", Data[0]?.customerName?.email)
//       const leadData = Data[0]?.leadFor.map((item) => ({
//         licenseNumber: item?.licenseNumber,
//         productorServiceName:
//           item?.productorServiceId?.productName ||
//           item?.productorServiceId?.serviceName,
//         productorServiceId: item?.productorServiceId?._id,
//         itemType: item?.productorServicemodel,
//         productPrice: item?.productPrice,
//         hsn: item?.hsn,
//         netAmount: item?.netAmount,
//         price: item?.price
//       }))
//       setSelectedLeadList(leadData)
//       const productListwithoutlicenseOnEdit = leadList?.map((product) => {
//         const match = Data[0].leadFor?.find((lead) => {
//           return (
//             lead.productorServiceId._id === product._id &&
//             !Object.prototype.hasOwnProperty.call(lead, "licenseNumber")
//           )
//         })

//         return {
//           ...product,
//           selected: !!match,
//           selectedArray: product.selected
//         }
//       })
//       setlicenseWithoutProductSelection(productListwithoutlicenseOnEdit)
//       const groupedByLicenseNumber = {}
//       Data[0].leadFor.forEach((lead) => {
//         if (lead.licenseNumber) {
//           if (!groupedByLicenseNumber[lead.licenseNumber]) {
//             groupedByLicenseNumber[lead.licenseNumber] = [] // create array if not exist
//           }
//           leadList?.forEach((product) => {
//             const existingIndex = groupedByLicenseNumber[
//               lead.licenseNumber
//             ].findIndex((item) => item._id === product._id)

//             if (existingIndex !== -1) {
//               // If already exists, just update 'selected' flag
//               if (lead.productorServiceId._id === product._id) {
//                 groupedByLicenseNumber[lead.licenseNumber][
//                   existingIndex
//                 ].selected = product._id === lead.productorServiceId._id
//               }
//             } else {
//               // If not exists, push new product with correct selected
//               const item = {
//                 ...product,
//                 selected: product._id === lead.productorServiceId._id,
//                 selectedArray: product.selected
//               }
//               groupedByLicenseNumber[lead.licenseNumber].push(item)
//             }
//           })
//           return groupedByLicenseNumber
//         }
//       })
//       setProductorServiceSelections(groupedByLicenseNumber)
//       const selectedcustomerlicenseandproduct =
//         Data[0]?.customerName?.selected?.map((sel) => ({
//           licenseNumber: sel.licensenumber || "N/A",
//           productName: sel.productName || "Unknown"
//         }))

//       setcustomerTableData(selectedcustomerlicenseandproduct)
//     }
//   }, [customerOptions, Data])
//   useEffect(() => {
//     if (customerData && customerData.length > 0) {
//       setallcustomer(customerData)
//     }
//   }, [customerData])

//   useEffect(() => {
//     if (customerData && customerData.length && selectedBranch) {
//       const options = customerData.map((item) => {
//         const matchingSelected = item.selected?.find(
//           (sel) => sel.branch_id === selectedBranch[0]
//         )
//         return {
//           value: item?._id,
//           label: item?.customerName,
//           address: item?.address1,
//           mobile: item?.mobile || "",
//           license: matchingSelected?.licensenumber || "",
//           email: item?.email,
//           phone: item?.landline
//         }
//       })
//       setCustomerOptions(options)
//     }
//   }, [customerData])
//   useEffect(() => {
//     if (selectedCustomer) {
//       setValueMain("mobile", selectedCustomer.mobile)
//       setValueMain("phone", selectedCustomer.phone)
//       setValueMain("email", selectedCustomer.email)
//     }
//   }, [selectedCustomer])
//   useEffect(() => {
//     if (alluser) {
//       const { allusers = [], allAdmins = [] } = alluser

//       // Combine allusers and allAdmins
//       const combinedUsers = [...allusers, ...allAdmins]

//       // Set combined names to state
//       setallStaffs(combinedUsers)
//     }
//   }, [alluser])

//   useEffect(() => {
//     setValueMain("netAmount", calculateTotalAmount())
//     setValueMain("taxAmount", calculatetaxAmount())
//     setValueMain("taxableAmount", calculatetaxableAmount())
//   }, [selectedleadlist])
//   useEffect(() => {
//     if (!selectedLicense && leadList && leadList.length > 0 && !Data) {
//       const initialProductListwithoutlicense = leadList?.map((product) => ({
//         ...product,
//         selectedArray: product.selected,
//         selected: false
//       }))

//       setlicenseWithoutProductSelection(initialProductListwithoutlicense)
//     }
//   }, [leadList])

//   const countryOptions = useMemo(
//     () =>
//       Country.getAllCountries().map((country) => ({
//         label: country.name,
//         value: country.isoCode
//       })),
//     []
//   )
//   const stateOptions = selectedCountry
//     ? State.getStatesOfCountry(selectedCountry.value).map((state) => ({
//         label: state.name,
//         value: state.isoCode
//       }))
//     : []
//   const defaultCountry = useMemo(
//     () => countryOptions.find((country) => country.value === "IN"),
//     [countryOptions]
//   )
//   const defaultState = useMemo(
//     () => stateOptions.find((state) => state.value === "KL"),
//     [stateOptions]
//   )
//   useEffect(() => {
//     if (defaultCountry) {
//       setSelectedCountry(defaultCountry)
//       setValueModal("country", defaultCountry.value)
//     }
//   }, [defaultCountry])

//   useEffect(() => {
//     const currentState = getValuesModal("state")
//     if (defaultState && !currentState) {
//       setSelectedState(defaultState)
//       setValueModal("state", defaultState.value)
//     }
//   }, [defaultState, getValuesModal, setValueModal])

//   const Industries = [
//     "Whole sailor/Distributors",
//     "Retailer",
//     "Manufacturer",
//     "Service",
//     "Works Contact"
//   ]
//   const handleLicenseSelect = (license) => {
//     // Ensure all products are initialized for this license if not already
//     if (!productOrserviceSelections[license]) {
//       const initialProductList = leadList.map((product) => ({
//         ...product,
//         selectedArray: product.selected,
//         selected: false
//       }))
//       setProductorServiceSelections((prev) => ({
//         ...prev,
//         [license]: initialProductList
//       }))
//     }
//     setIslicenseOpen(false) // Close dropdown
//     setSelectedLicense(license)
//   }
//   const handleProductORserviceSelect = (productId) => {
//     if (selectedLicense) {
//       if (
//         selectedleadlist.some(
//           (item) =>
//             item.productId === productId &&
//             item.licenseNumber === selectedLicense
//         )
//       )
//         return
//       const updatedProductList = productOrserviceSelections[
//         selectedLicense
//       ].map((product) =>
//         product._id === productId
//           ? {
//               ...product,
//               selected: !product.selected,
//               selectedArray: product?.selectedArray
//             }
//           : product
//       )
//       setProductorServiceSelections((prev) => ({
//         ...prev,
//         [selectedLicense]: updatedProductList
//       }))
//     } else {
//       if (
//         selectedleadlist
//           .filter((items) => !items.licenseNumber)
//           .some((item) => item.productId === productId)
//       )
//         return

//       const updatedProductList = licensewithoutProductSelection.map(
//         (product) =>
//           product._id === productId
//             ? { ...product, selected: !product.selected }
//             : product
//       )
//       setlicenseWithoutProductSelection(updatedProductList)
//     }
//   }
//   const handleToggleDropdown = () => {
//     setIsleadForOpen((prev) => !prev) // Toggle dropdown visibility
//   }
//   const handleSelectedCustomer = (option) => {
//     const filteredcustomerLicenseandproducts = allcustomer
//       ?.filter(
//         (item) =>
//           String(item?.customerName)?.trim() ===
//             String(option?.label)?.trim() &&
//           String(item?.address1)?.trim() === String(option?.address)?.trim()
//       )
//       ?.flatMap((item) =>
//         item.selected
//           .filter((sel) => String(sel.branch_id) === String(selectedBranch))
//           .map((sel) => ({
//             licenseNumber: sel.licensenumber || "N/A",
//             productName: sel.productName || "Unknown"
//           }))
//       )
//     setcustomerTableData(filteredcustomerLicenseandproducts)
//   }
//   const handlePriceChange = (index, newPrice) => {
//     setSelectedLeadList((prevList) =>
//       prevList.map((product, i) =>
//         i === index
//           ? {
//               ...product,
//               productPrice: newPrice,
//               netAmount: (
//                 Number(newPrice) +
//                 (Number(product.hsn) / 100) * Number(newPrice)
//               ).toFixed(2)
//             }
//           : product
//       )
//     )
//   }
//   const handleHsnChange = (index, newHsn) => {
//     setSelectedLeadList((prevList) =>
//       prevList.map((product, i) =>
//         i === index
//           ? {
//               ...product,
//               hsn: newHsn,
//               netAmount: (
//                 Number(product?.productPrice) +
//                 (Number(newHsn) / 100) * Number(product?.productPrice)
//               ).toFixed(2)
//             }
//           : product
//       )
//     )
//   }

//   // const handleHsnChange=(index,newHsn)=>{
//   // selectedleadlist((prevList)=>
//   // prevList.map((product,i)=>
//   // i===index?{
//   // ...product,
//   // hsn:newHsn,
//   // netAmount:(Number(product.productPrice)+(newHsn/100)*Number(product.productPrice).toFixed(2)}:product)}))}
//   const handleDeletetableData = (item, indexNum) => {
//     if (item.licenseNumber) {
//       const updatedProductList = productOrserviceSelections[
//         item.licenseNumber
//       ].map((product) =>
//         product._id === item.productId
//           ? { ...product, selected: !product.selected }
//           : product
//       )

//       setProductorServiceSelections((prev) => ({
//         ...prev,
//         [item.licenseNumber]: updatedProductList
//       }))
//     } else {
//       const updatedProductList = licensewithoutProductSelection.map(
//         (product) =>
//           product._id === item.productId
//             ? { ...product, selected: !product.selected }
//             : product
//       )
//       setlicenseWithoutProductSelection(updatedProductList)
//     }

//     // return
//     const filteredLeadlist = selectedleadlist.filter(
//       (item, index) => index !== indexNum
//     )
//     setSelectedLeadList(filteredLeadlist)
//   }

//   const customFilter = (option, inputValue) => {
//     if (!inputValue) return true
//     // Convert to lowercase for case-insensitive search
//     const searchValue = inputValue.toLowerCase()
//     const label = option.label ? String(option.label).toLowerCase() : "" // Ensure label is a string
//     // const label = option.label ? option.label.toLowerCase() : ""
//     const mobile = option.data?.mobile ? option.data?.mobile.toLowerCase() : ""
//     return (
//       label.includes(searchValue) || // Search by name
//       mobile.includes(searchValue) // Search by mobile number
//     )
//   }
//   const calculateTotalAmount = () => {
//     return selectedleadlist
//       .reduce((total, product) => {
//         return total + (Number(product.netAmount) || 0) // Ensure price is a number and handle null values
//       }, 0)
//       .toFixed(2)
//   }
//   const calculatetaxAmount = () => {
//     return (
//       Math.round(
//         selectedleadlist.reduce((total, product) => {
//           return (
//             total + (Number(product.netAmount) - Number(product.productPrice))
//           )
//         }, 0) * 100
//       ) / 100
//     )
//   }
//   const calculatetaxableAmount = () => {
//     return selectedleadlist.reduce((total, product) => {
//       return total + Number(product.productPrice)
//     }, 0)
//   }
//   console.log(selectedleadlist)
//   const handleAddProducts = () => {
//     setIsleadForOpen(false)
//     if (validateError.emptyleadData) {
//       setValidateError((prev) => ({
//         ...prev,
//         emptyleadData: ""
//       }))
//     }
//     if (validateError.readonlyError) {
//       setValidateError((prev) => ({
//         ...prev,
//         readonlyError: ""
//       }))
//     }

//     setSelectedLeadList((prev) => {
//       let updatedList = [...prev]

//       if (selectedLicense) {
//         const selectedProducts = productOrserviceSelections[selectedLicense]
//           .filter((items) => items.selected)
//           .map((item) => {
//             const igstRate =
//               item?.selectedArray?.[0]?.hsn_id?.onValue?.igstRate ?? 0
//             return {
//               licenseNumber: selectedLicense,
//               productorServiceName: item.productName || item.serviceName,
//               productorServiceId: item._id,
//               itemType: item.productName ? "Product" : "Service",
//               productPrice: item.productPrice,
//               hsn: item?.selectedArray[0]?.hsn_id?.onValue?.igstRate || 0,
//               price: item?.productPrice,

//               netAmount: (
//                 Number(item?.productPrice || 0) +
//                 (Number(igstRate) / 100) * Number(item?.productPrice || 0)
//               ).toFixed(2)
//               // netAmount:
//               //   item?.productPrice +
//               //   (Number(item?.selectedArray[0]?.hsn_id?.onValue?.igstRate) /
//               //     100) *
//               //     item?.productPrice
//             }
//           })

//         // Filter out products that are already added for the selected license
//         const newProducts = selectedProducts.filter(
//           (product) =>
//             !updatedList.some(
//               (p) =>
//                 p.licenseNumber === selectedLicense &&
//                 p.productorServiceId === product.productorServiceId
//             )
//         )

//         updatedList = [...updatedList, ...newProducts]
//       } else {
//         const selectedProducts = licensewithoutProductSelection
//           .filter((items) => items.selected)
//           .map((item) => {
//             const igstRate =
//               item?.selectedArray?.[0]?.hsn_id?.onValue?.igstRate ?? 0
//             return {
//               productorServiceName: item.productName || item.serviceName,
//               productorServiceId: item._id,
//               itemType: item.productName ? "Product" : "Service",
//               productPrice: item?.productPrice,
//               hsn: item?.selectedArray[0]?.hsn_id?.onValue?.igstRate || 0,
//               price: item.productPrice || item.price,
//               netAmount: (
//                 Number(item?.productPrice || 0) +
//                 (Number(igstRate) / 100) * Number(item?.productPrice || 0)
//               ).toFixed(2)
//             }
//           })

//         // Filter out products that are already added (without license)
//         const newProducts = selectedProducts.filter(
//           (product) =>
//             !updatedList.some(
//               (p) =>
//                 !p.licenseNumber &&
//                 p.productorServiceId === product.productorServiceId
//             )
//         )

//         updatedList = [...updatedList, ...newProducts]
//       }
//       return updatedList
//     })
//   }
//   console.log("hhhh")
//   console.log(selectedleadlist)
//   const validateLeadData = async (leadData, selectedleadlist, role) => {
//     console.log("HHhhh")
//     const result = await api.get("/lead/checkexistinglead", {
//       params: {
//         leadData,
//         selectedleadlist,
//         role
//       }
//     })
//     console.log(result.data)

//     if (
//       result.data.message ===
//         "This customer already has a lead with the same product." &&
//       loggeduser.role === "Staff"
//     ) {
//       return {
//         eligible: false,
//         message: `${result.data.message},You can't make leads`
//       }
//     } else if (
//       result.data.message ===
//         "This customer already has a lead with the same product." &&
//       loggeduser.role !== "Staff"
//     ) {
//       return { eligible: true, message: result.data.message }
//     } else if (
//       result.data.message ===
//       "No existing lead for this customer. Safe to create new lead."
//     ) {
//       return { eligible: true, message: "" }
//     } else if (
//       result.data.message ===
//       "This customer already has a lead, but with different product(s)."
//     ) {
//       return {
//         eligible: true,
//         message:
//           "This customer already has a lead, but with different product(s)."
//       }
//     }
//     console.log(result.data.message)
//     setPopupMessage(result.data.message)

//     return isEligible
//   }
//   console.log(selectedleadlist)
//   const onSubmit = async (data) => {
//     setsubmitLoading(true)
//     if (submitLoading) {
//       return
//     }

//     try {
//       if (process === "Registration") {
//         if (selectedleadlist.length === 0) {
//           setValidateError((prev) => ({
//             ...prev,
//             emptyleadData: "No Lead generated do it"
//           }))
//           return
//         }
//         const filteredleadlist = selectedleadlist.filter(
//           (item) => item.productorServiceId && item.productorServiceId !== ""
//         )
//         console.log(filteredleadlist)
//         const validation = await validateLeadData(
//           data,
//           filteredleadlist,
//           loggeduser.role
//         )
//         console.log(validation.message)
//         setFormData(data)
//         setPopupMessage(validation.message)
//         if (validation.message === "") {
//           handlePopupOk(true, data)
//         } else {
//           setPopupOpen(true)
//         }
//         setIseligible(validation.eligible)
//       } else if (process === "edit") {
//         if (isReadOnly) {
//           setValidateError((prev) => ({
//             ...prev,
//             readonlyError:
//               "Can't make changes unless the user is the leadBy or allocatedTo"
//           }))
//           return
//         }

//         seteditLoadingState(true)
//         await handleEditData(data, selectedleadlist, Data[0]?._id)
//       }
//       // Refetch the product data
//     } catch (error) {
//       console.log("error on onsubmit:", error)
//       toast.error("Failed to add product!")
//     }
//   }
//   const handlePopupOk = async (ischek = false, leadData = null) => {
//     setPopupOpen(false)
//     const filteredleadlist = selectedleadlist.filter(
//       (item) => item.productorServiceId && item.productorServiceId !== ""
//     )
//     if (isEligible && leadData === null) {
//       await handleleadData(formData, filteredleadlist, loggeduser.role)
//     } else if (ischek && leadData) {
//       await handleleadData(leadData, filteredleadlist, loggeduser.role)
//     }
//   }
//   const normalizeMobile = (number) => {
//     if (!number) return ""
//     return number.replace(/\D/g, "").slice(-10) // Keep only last 10 digits
//   }

//   const isMobileExists = (inputMobile, existingCustomers) => {
//     const normalizedInput = normalizeMobile(inputMobile)

//     return existingCustomers.some((customer) => {
//       const normalizedStored = normalizeMobile(customer.mobile)
//       return normalizedStored === normalizedInput
//     })
//   }
//   const onmodalsubmit = async (data) => {
//     try {
//       const checkexistingNumber = isMobileExists(data.mobile, allcustomer)
//       if (checkexistingNumber) {
//         setError("mobile", {
//           type: "manual",
//           message: "This mobile number is already used"
//         })
//         return
//       }
//       setModalLoader(true)
//       const response = await api.post("/customer/customerRegistration", {
//         customerData: data
//       })
//       if (response.status === 200) {
//         refreshHook()
//         setModalLoader(false)
//         resetModal()
//         toast.success(response.data.message)
//         setModalOpen(false)
//         clearmodalErros()
//         resetModal()
//       }
//     } catch (error) {
//       console.log(error)
//       toast.error("something went wrong")
//       setModalLoader(false)
//     }
//   }
//   return (
//     <div className="bg-gray-100 h-auto">
//       {(modalloader ||
//         loadingState ||
//         editloadingState ||
//         productLoading ||
//         usersLoading ||
//         customerLoading) && (
//         <BarLoader
//           cssOverride={{ width: "100%", height: "4px" }} // Tailwind's `h-4` corresponds to `16px`
//           color="#4A90E2" // Change color as needed
//         />
//       )}

//       <div className="overflow-y-auto flex justify-center items-center p-3 shadow-xl ">
//         <div
//           className="bg-white shadow-xl rounded md:w-3/5 "
//           style={{
//             opacity:
//               productLoading || usersLoading || customerLoading ? 0.2 : 1,
//             pointerEvents:
//               productLoading || usersLoading || customerLoading
//                 ? "none"
//                 : "auto",
//             transition: "opacity 0.3s ease-in-out"
//           }}
//         >
//           {showmessage && (
//             <PopUp
//               isOpen={ispopupModalOpen}
//               onClose={() => {
//                 setIspopupModalOpen(false)
//                 showpopupMessage("")
//               }}
//               message={showmessage}
//             />
//           )}

//           <form
//             onSubmit={handleSubmitMain(onSubmit)}
//             className="bg-white p-4"
//             style={{ fontFamily: "'Segoe UI', sans-serif" }}
//           >
//             <div className="bg-white rounded-lg border border-gray-300 shadow-md overflow-hidden">
//               {/* ── Header ── */}
//               <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-300">
//                 <div className="text-sm font-bold px-4 py-1 rounded border-2 text-red-600 border-red-500 bg-white">
//                   {process === "Registration" ? "New Lead" : "Edit Lead"}
//                 </div>
//               </div>

//               <div className="p-3 md:p-4 space-y-3">
//                 {/* ── Row 1: Customer Name | Email | Phone | Mobile ── */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
//                   <div className="sm:col-span-2 lg:col-span-1">
//                     <label className="block text-xs font-semibold text-gray-600 mb-1">
//                       Customer Name
//                     </label>
//                     <div className="flex gap-1">
//                       <div className="flex-1 text-sm min-w-0">
//                         <Select
//                           options={customerOptions}
//                           isDisabled={!iscustomerchangeandbranch}
//                           value={
//                             customerOptions.length > 0
//                               ? (customerOptions.find(
//                                   (o) => o.value === watchMain("customerName")
//                                 ) ?? null)
//                               : null
//                           }
//                           getOptionLabel={(o) =>
//                             `${o.label}-(${o.mobile})-(${o.license})`
//                           }
//                           getOptionValue={(o) => o._id}
//                           filterOption={customFilter}
//                           {...registerMain("customerName", {
//                             required: "Customer is Required"
//                           })}
//                           onBlur={() => {
//                             const selected = customerOptions.find(
//                               (o) => o.value === watchMain("customerName")
//                             )
//                             if (selected)
//                               setValueMain("customerName", selected.value)
//                           }}
//                           onChange={(sel) => {
//                             handleSelectedCustomer(sel)
//                             setSelectedCustomer(sel)
//                             setValueMain("customerName", sel.value, {
//                               shouldValidate: true
//                             })
//                             setValueMain("netAmount", "")
//                             setSelectedLeadList([])
//                             setSelectedLicense(null)
//                           }}
//                           styles={{
//                             control: (base, state) => ({
//                               ...base,
//                               backgroundColor: "#EEF2F8",
//                               borderColor: "#D1D5DB",
//                               minHeight: 34,
//                               cursor: state.isDisabled
//                                 ? "not-allowed"
//                                 : "pointer",
//                               opacity: state.isDisabled ? 0.7 : 1
//                             }),
//                             menuList: (base) => ({ ...base, maxHeight: 200 })
//                           }}
//                           menuPortalTarget={document.body}
//                           menuShouldScrollIntoView={false}
//                           className="w-full"
//                         />
//                       </div>
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setModalOpen(true)
//                           clearMainerrors()
//                         }}
//                         disabled={isReadOnly}
//                         className={`bg-[#1B2A4A] hover:bg-[#243660] text-white text-xs font-bold px-3 rounded flex-shrink-0 ${isReadOnly ? "cursor-not-allowed opacity-70" : ""}`}
//                       >
//                         NEW
//                       </button>
//                     </div>
//                     {errorsMain.customerName && (
//                       <p className="text-red-500 text-xs mt-1">
//                         {errorsMain.customerName.message}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <select
//                       {...registerMain("leadBranch")}
//                       disabled={!iscustomerchangeandbranch}
//                       onChange={(e) => {
//                         setSelectedBranch([e.target.value])
//                         setValueMain("customerName", "")
//                         setSelectedCustomer(null)
//                         setcustomerTableData([])
//                         setSelectedLeadList([])
//                         setValueMain("netAmount", "")
//                         setSelectedLicense(null)
//                       }}
//                       className="border border-gray-300 rounded px-3 py-[6px] text-sm mt-5 bg-[#1B2A4A] hover:bg-[#243660] text-white outline-none min-w-[100px] cursor-pointer"
//                     >
//                       {companybranches?.map((b, i) => (
//                         <option key={i} value={b._id}>
//                           {b.branchName}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 {/* ── Row 2: Source | Trade | Associate ── */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//                   <div>
//                     <label className="block text-xs font-semibold text-gray-600 mb-1">
//                       Email id
//                     </label>
//                     <input
//                       {...registerMain("email")}
//                       disabled={isReadOnly}
//                       placeholder="Email..."
//                       className={`w-full border border-gray-300 rounded px-3 py-[7px] text-sm outline-none bg-[#EEF2F8] ${isReadOnly ? "cursor-not-allowed opacity-70" : ""}`}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-xs font-semibold text-gray-600 mb-1">
//                       Phone Number
//                     </label>
//                     <input
//                       {...registerMain("phone")}
//                       disabled={isReadOnly}
//                       placeholder="Landline..."
//                       className={`w-full border border-gray-300 rounded px-3 py-[7px] text-sm outline-none bg-[#EEF2F8] ${isReadOnly ? "cursor-not-allowed opacity-70" : ""}`}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-xs font-semibold text-gray-600 mb-1">
//                       Mobile Number
//                     </label>
//                     <input
//                       {...registerMain("mobile")}
//                       readOnly={isReadOnly}
//                       placeholder="Mobile..."
//                       className={`w-full border border-gray-300 rounded px-3 py-[7px] text-sm outline-none bg-[#EEF2F8] ${isReadOnly ? "cursor-not-allowed opacity-70" : ""}`}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-semibold text-gray-600 mb-1">
//                       Source of Lead
//                     </label>
//                     <select
//                       {...registerMain("source", {
//                         required: "Source is Required"
//                       })}
//                       className="w-full border border-gray-300 rounded px-3 py-[7px] text-sm outline-none bg-[#EEF2F8]"
//                     >
//                       <option value="">Select Source</option>
//                       <option value="whatsapp">WhatsApp</option>
//                       <option value="instagram">Instagram</option>
//                       <option value="facebook">Facebook</option>
//                       <option value="Direct">Direct</option>
//                     </select>
//                     {errorsMain.source && (
//                       <p className="text-red-500 text-xs mt-1">
//                         {errorsMain.source.message}
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <label className="block text-xs font-semibold text-gray-600 mb-1">
//                       Trade
//                     </label>
//                     <input
//                       {...registerMain("trade")}
//                       disabled
//                       placeholder="Trade..."
//                       className="w-full border border-gray-300 rounded px-3 py-[7px] text-sm outline-none bg-[#EEF2F8] cursor-not-allowed opacity-70"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-xs font-semibold text-gray-600 mb-1">
//                       Associate with
//                     </label>
//                     <select
//                       {...registerMain("partner", {
//                         required: "Partnership is Required"
//                       })}
//                       disabled={isReadOnly}
//                       className={`w-full border border-gray-300 rounded px-3 py-[7px] text-sm outline-none bg-[#EEF2F8] ${isReadOnly ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
//                     >
//                       <option value="">Select Partner</option>
//                       {partner?.map((p, i) => (
//                         <option key={i} value={p._id}>
//                           {p.partner}
//                         </option>
//                       ))}
//                     </select>
//                     {errorsMain.partner && (
//                       <p className="text-red-500 text-xs mt-1">
//                         {errorsMain.partner.message}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 {/* ── Self allocation sub-fields ── */}
//                 {process !== "edit" && selfAllocation && (
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                     <div>
//                       <label className="block text-xs font-semibold text-gray-600 mb-1">
//                         Allocation Type
//                       </label>
//                       <select
//                         disabled={!isSelfAllocationChangable}
//                         {...registerMain("allocationType", {
//                           required: "Allocation type is required"
//                         })}
//                         className={`w-full border border-gray-300 rounded px-3 py-[7px] text-sm outline-none bg-[#EEF2F8] ${!isSelfAllocationChangable ? "cursor-not-allowed opacity-70" : ""}`}
//                       >
//                         <option value="followup">Followup</option>
//                       </select>
//                       {errorsMain.allocationType && (
//                         <p className="text-red-500 text-xs mt-1">
//                           {errorsMain.allocationType.message}
//                         </p>
//                       )}
//                     </div>
//                     <div>
//                       <label className="block text-xs font-semibold text-gray-600 mb-1">
//                         Due Date
//                       </label>
//                       <input
//                         type="date"
//                         {...registerMain("dueDate", {
//                           required: "Due Date is required"
//                         })}
//                         className="w-full border border-gray-300 rounded px-3 py-[7px] text-sm outline-none bg-[#EEF2F8]"
//                       />
//                       {errorsMain.dueDate && (
//                         <p className="text-red-500 text-xs mt-1">
//                           {errorsMain.dueDate.message}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {/* ── Product Table ── */}
//                 <div className="border border-gray-300 rounded overflow-hidden">
//                   <div className="overflow-x-auto">
//                     <table className="w-full border-collapse text-xs">
//                       <thead>
//                         <tr className="bg-[#1B2A4A] text-white">
//                           <th
//                             rowSpan="2"
//                             className="border border-blue-900 px-3 py-2 text-left whitespace-nowrap min-w-[160px]"
//                           >
//                             License No
//                           </th>
//                           <th
//                             rowSpan="2"
//                             className="border border-blue-900 px-3 py-2 text-left whitespace-nowrap min-w-[160px]"
//                           >
//                             Product / Service
//                           </th>
//                           <th
//                             colSpan="3"
//                             className="border border-blue-900 px-3 py-2 text-center"
//                           >
//                             Price Details
//                           </th>
//                           <th
//                             rowSpan="2"
//                             className="border border-blue-900 px-3 py-2 text-center w-10"
//                           >
//                             <button
//                               type="button"
//                               disabled={isReadOnly}
//                               onClick={() =>
//                                 setSelectedLeadList((prev) => [
//                                   ...(prev || []),
//                                   {
//                                     licenseNumber: "",
//                                     productorServiceId: "",
//                                     productorServiceName: "",
//                                     productPrice: "",
//                                     hsn: "",
//                                     netAmount: ""
//                                   }
//                                 ])
//                               }
//                               title="Add Row"
//                               className={`mx-auto flex items-center justify-center w-6 h-6 rounded-full bg-white bg-opacity-20 hover:bg-opacity-40 transition ${isReadOnly ? "cursor-not-allowed opacity-50" : ""}`}
//                             >
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 className="h-4 w-4 text-white"
//                                 fill="none"
//                                 viewBox="0 0 24 24"
//                                 stroke="currentColor"
//                                 strokeWidth="2.5"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   d="M12 4v16m8-8H4"
//                                 />
//                               </svg>
//                             </button>
//                           </th>
//                         </tr>
//                         <tr className="bg-[#1B2A4A] text-white">
//                           <th className="border border-blue-900 px-3 py-1 text-center whitespace-nowrap min-w-[80px]">
//                             Amount
//                           </th>
//                           <th className="border border-blue-900 px-3 py-1 text-center whitespace-nowrap min-w-[70px]">
//                             Tax %
//                           </th>
//                           <th className="border border-blue-900 px-3 py-1 text-center whitespace-nowrap min-w-[80px]">
//                             Net Amount
//                           </th>
//                         </tr>
//                       </thead>

//                       <tbody>
//                         {(selectedleadlist && selectedleadlist.length > 0
//                           ? selectedleadlist
//                           : [
//                               {
//                                 licenseNumber: "",
//                                 productorServiceId: "",
//                                 productorServiceName: "",
//                                 productPrice: "",
//                                 hsn: "",
//                                 netAmount: ""
//                               }
//                             ]
//                         ).map((item, index) => (
//                           <tr
//                             key={index}
//                             className="border-b even:bg-blue-50 bg-white hover:bg-blue-50 transition-colors"
//                           >
//                             {/* ── License No dropdown ── */}
//                             <td className="border border-gray-300 px-2 py-1">
//                               <div className="relative">
//                                 <button
//                                   type="button"
//                                   disabled={isReadOnly}
//                                   onClick={() =>
//                                     setOpenLicenseDropdown((prev) =>
//                                       prev === index ? null : index
//                                     )
//                                   }
//                                   className={`w-full border border-gray-200 rounded px-2 py-[5px] text-xs bg-[#EEF2F8] flex justify-between items-center gap-1 ${isReadOnly ? "cursor-not-allowed opacity-70" : ""}`}
//                                 >
//                                   <span
//                                     className={`truncate ${item.licenseNumber ? "text-gray-700" : "text-gray-400"}`}
//                                   >
//                                     {item.licenseNumber || "Select License"}
//                                   </span>
//                                   <svg
//                                     className="w-3 h-3 flex-shrink-0"
//                                     viewBox="0 0 20 20"
//                                     fill="currentColor"
//                                   >
//                                     <path
//                                       fillRule="evenodd"
//                                       d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//                                       clipRule="evenodd"
//                                     />
//                                   </svg>
//                                 </button>

//                                 {openLicenseDropdown === index && (
//                                   <div className="absolute left-0 top-full mt-1 w-full min-w-[200px] bg-white border rounded shadow-lg z-[100] max-h-48 overflow-y-auto">
//                                     <ul>
//                                       <li
//                                         className="p-2 hover:bg-gray-100 cursor-pointer text-xs font-semibold text-red-500"
//                                         onClick={() => {
//                                           const updated = [
//                                             ...(selectedleadlist?.length
//                                               ? selectedleadlist
//                                               : [
//                                                   {
//                                                     licenseNumber: "",
//                                                     productorServiceId: "",
//                                                     productorServiceName: "",
//                                                     productPrice: "",
//                                                     hsn: "",
//                                                     netAmount: ""
//                                                   },
//                                                   {
//                                                     licenseNumber: "",
//                                                     productorServiceId: "",
//                                                     productorServiceName: "",
//                                                     productPrice: "",
//                                                     hsn: "",
//                                                     netAmount: ""
//                                                   }
//                                                 ])
//                                           ]
//                                           updated[index] = {
//                                             ...updated[index],
//                                             licenseNumber: "",
//                                             productorServiceId: "",
//                                             productorServiceName: "",
//                                             productPrice: "",
//                                             hsn: "",
//                                             netAmount: ""
//                                           }
//                                           setSelectedLeadList(updated)
//                                           handleLicenseSelect(null)
//                                           setOpenLicenseDropdown(null)
//                                         }}
//                                       >
//                                         No License
//                                       </li>
//                                       {customerTableData?.map((lic, i) => (
//                                         <li
//                                           key={lic.licenseNumber || i}
//                                           className="p-2 hover:bg-gray-100 cursor-pointer text-xs text-gray-700"
//                                           onClick={() => {
//                                             const updated = [
//                                               ...(selectedleadlist?.length
//                                                 ? selectedleadlist
//                                                 : [
//                                                     {
//                                                       licenseNumber: "",
//                                                       productorServiceId: "",
//                                                       productorServiceName: "",
//                                                       productPrice: "",
//                                                       hsn: "",
//                                                       netAmount: ""
//                                                     },
//                                                     {
//                                                       licenseNumber: "",
//                                                       productorServiceId: "",
//                                                       productorServiceName: "",
//                                                       productPrice: "",
//                                                       hsn: "",
//                                                       netAmount: ""
//                                                     }
//                                                   ])
//                                             ]
//                                             updated[index] = {
//                                               ...updated[index],
//                                               licenseNumber: lic.licenseNumber,
//                                               productorServiceId: "",
//                                               productorServiceName: ""
//                                             }
//                                             setSelectedLeadList(updated)
//                                             handleLicenseSelect(
//                                               lic.licenseNumber
//                                             )
//                                             setOpenLicenseDropdown(null)
//                                           }}
//                                         >
//                                           {lic.licenseNumber} —{" "}
//                                           {lic.productName}
//                                         </li>
//                                       ))}
//                                     </ul>
//                                   </div>
//                                 )}
//                               </div>
//                             </td>

//                             {/* ── Product / Service dropdown with custom blue checkboxes ── */}
//                             <td className="border border-gray-300 px-2 py-1">
//                               <div className="relative">
//                                 <button
//                                   type="button"
//                                   disabled={isReadOnly}
//                                   onClick={() =>
//                                     setOpenProductDropdown((prev) =>
//                                       prev === index ? null : index
//                                     )
//                                   }
//                                   className={`w-full border border-gray-200 rounded px-2 py-[5px] text-xs bg-[#EEF2F8] flex justify-between items-center gap-1 ${isReadOnly ? "cursor-not-allowed opacity-70" : ""}`}
//                                 >
//                                   <span
//                                     className={`truncate ${item.productorServiceName ? "text-gray-700" : "text-gray-400"}`}
//                                   >
//                                     {item.productorServiceName ||
//                                       "Select Product / Service"}
//                                   </span>
//                                   <svg
//                                     className="w-3 h-3 flex-shrink-0"
//                                     viewBox="0 0 20 20"
//                                     fill="currentColor"
//                                   >
//                                     <path
//                                       fillRule="evenodd"
//                                       d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//                                       clipRule="evenodd"
//                                     />
//                                   </svg>
//                                 </button>

//                                 {openProductDropdown === index && (
//                                   <div className="absolute left-0 top-full mt-1 w-full min-w-[200px] bg-white border rounded shadow-lg z-[100] max-h-48 overflow-y-auto p-2">
//                                     {item.licenseNumber
//                                       ? leadList?.map((prod) => {
//                                           const state =
//                                             productOrserviceSelections[
//                                               item.licenseNumber
//                                             ]?.find(
//                                               (p) => p._id === prod._id
//                                             ) || { selected: false }
//                                           return (
//                                             <label
//                                               key={prod._id}
//                                               className="flex items-center gap-2 mb-1 text-xs cursor-pointer hover:bg-gray-50 px-1 py-0.5 rounded"
//                                             >
//                                               <span
//                                                 onClick={() => {
//                                                   handleProductORserviceSelect(
//                                                     prod._id
//                                                   )
//                                                   if (!state.selected) {
//                                                     const igstRate =
//                                                       prod?.selectedArray?.[0]
//                                                         ?.hsn_id?.onValue
//                                                         ?.igstRate ?? 0
//                                                     const newItem = {
//                                                       licenseNumber:
//                                                         item.licenseNumber,
//                                                       productorServiceName:
//                                                         prod.productName ||
//                                                         prod.serviceName,
//                                                       productorServiceId:
//                                                         prod._id,
//                                                       itemType: prod.productName
//                                                         ? "Product"
//                                                         : "Service",
//                                                       productPrice:
//                                                         prod.productPrice,
//                                                       hsn: igstRate,
//                                                       price: prod.productPrice,
//                                                       netAmount: (
//                                                         Number(
//                                                           prod?.productPrice ||
//                                                             0
//                                                         ) +
//                                                         (Number(igstRate) /
//                                                           100) *
//                                                           Number(
//                                                             prod?.productPrice ||
//                                                               0
//                                                           )
//                                                       ).toFixed(2)
//                                                     }
//                                                     setSelectedLeadList(
//                                                       (prev) => {
//                                                         const exists =
//                                                           prev.some(
//                                                             (p) =>
//                                                               p.licenseNumber ===
//                                                                 item.licenseNumber &&
//                                                               p.productorServiceId ===
//                                                                 prod._id
//                                                           )
//                                                         if (exists) return prev
//                                                         const updated = [
//                                                           ...prev
//                                                         ]
//                                                         const emptyRowIndex =
//                                                           updated.findIndex(
//                                                             (r, i) =>
//                                                               i === index &&
//                                                               !r.productorServiceId
//                                                           )
//                                                         if (
//                                                           emptyRowIndex !== -1
//                                                         ) {
//                                                           updated[
//                                                             emptyRowIndex
//                                                           ] = newItem
//                                                           return updated
//                                                         }
//                                                         return [
//                                                           ...updated,
//                                                           newItem
//                                                         ]
//                                                       }
//                                                     )
//                                                   } else {
//                                                     setSelectedLeadList(
//                                                       (prev) =>
//                                                         prev.filter(
//                                                           (p) =>
//                                                             !(
//                                                               p.licenseNumber ===
//                                                                 item.licenseNumber &&
//                                                               p.productorServiceId ===
//                                                                 prod._id
//                                                             )
//                                                         )
//                                                     )
//                                                   }
//                                                 }}
//                                                 className={`w-4 h-4 flex-shrink-0 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
//                                                   state.selected
//                                                     ? "bg-[#1B2A4A] border-[#1B2A4A]"
//                                                     : "bg-white border-gray-300 hover:border-[#1B2A4A]"
//                                                 }`}
//                                               >
//                                                 {state.selected && (
//                                                   <svg
//                                                     className="w-2.5 h-2.5 text-white"
//                                                     fill="none"
//                                                     viewBox="0 0 24 24"
//                                                     stroke="currentColor"
//                                                     strokeWidth="3"
//                                                   >
//                                                     <path
//                                                       strokeLinecap="round"
//                                                       strokeLinejoin="round"
//                                                       d="M5 13l4 4L19 7"
//                                                     />
//                                                   </svg>
//                                                 )}
//                                               </span>
//                                               <span
//                                                 className={
//                                                   state.selected
//                                                     ? "font-semibold text-[#1B2A4A]"
//                                                     : "text-gray-700"
//                                                 }
//                                               >
//                                                 {prod.productName ||
//                                                   prod.serviceName}
//                                               </span>
//                                             </label>
//                                           )
//                                         })
//                                       : leadList?.map((prod) => {
//                                           const state =
//                                             licensewithoutProductSelection?.find(
//                                               (p) => p._id === prod._id
//                                             ) || { selected: false }
//                                           return (
//                                             <label
//                                               key={prod._id}
//                                               className="flex items-center gap-2 mb-1 text-xs cursor-pointer hover:bg-gray-50 px-1 py-0.5 rounded"
//                                             >
//                                               <span
//                                                 onClick={() => {
//                                                   handleProductORserviceSelect(
//                                                     prod._id
//                                                   )
//                                                   if (!state.selected) {
//                                                     const igstRate =
//                                                       prod?.selectedArray?.[0]
//                                                         ?.hsn_id?.onValue
//                                                         ?.igstRate ?? 0
//                                                     const newItem = {
//                                                       productorServiceName:
//                                                         prod.productName ||
//                                                         prod.serviceName,
//                                                       productorServiceId:
//                                                         prod._id,
//                                                       itemType: prod.productName
//                                                         ? "Product"
//                                                         : "Service",
//                                                       productPrice:
//                                                         prod.productPrice,
//                                                       hsn: igstRate,
//                                                       price: prod.productPrice,
//                                                       netAmount: (
//                                                         Number(
//                                                           prod?.productPrice ||
//                                                             0
//                                                         ) +
//                                                         (Number(igstRate) /
//                                                           100) *
//                                                           Number(
//                                                             prod?.productPrice ||
//                                                               0
//                                                           )
//                                                       ).toFixed(2)
//                                                     }
//                                                     setSelectedLeadList(
//                                                       (prev) => {
//                                                         const exists =
//                                                           prev.some(
//                                                             (p) =>
//                                                               !p.licenseNumber &&
//                                                               p.productorServiceId ===
//                                                                 prod._id
//                                                           )
//                                                         if (exists) return prev
//                                                         const updated = [
//                                                           ...prev
//                                                         ]
//                                                         const emptyRowIndex =
//                                                           updated.findIndex(
//                                                             (r, i) =>
//                                                               i === index &&
//                                                               !r.productorServiceId
//                                                           )
//                                                         if (
//                                                           emptyRowIndex !== -1
//                                                         ) {
//                                                           updated[
//                                                             emptyRowIndex
//                                                           ] = newItem
//                                                           return updated
//                                                         }
//                                                         return [
//                                                           ...updated,
//                                                           newItem
//                                                         ]
//                                                       }
//                                                     )
//                                                   } else {
//                                                     setSelectedLeadList(
//                                                       (prev) =>
//                                                         prev.filter(
//                                                           (p) =>
//                                                             !(
//                                                               !p.licenseNumber &&
//                                                               p.productorServiceId ===
//                                                                 prod._id
//                                                             )
//                                                         )
//                                                     )
//                                                   }
//                                                 }}
//                                                 className={`w-4 h-4 flex-shrink-0 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
//                                                   state.selected
//                                                     ? "bg-[#1B2A4A] border-[#1B2A4A]"
//                                                     : "bg-white border-gray-300 hover:border-[#1B2A4A]"
//                                                 }`}
//                                               >
//                                                 {state.selected && (
//                                                   <svg
//                                                     className="w-2.5 h-2.5 text-white"
//                                                     fill="none"
//                                                     viewBox="0 0 24 24"
//                                                     stroke="currentColor"
//                                                     strokeWidth="3"
//                                                   >
//                                                     <path
//                                                       strokeLinecap="round"
//                                                       strokeLinejoin="round"
//                                                       d="M5 13l4 4L19 7"
//                                                     />
//                                                   </svg>
//                                                 )}
//                                               </span>
//                                               <span
//                                                 className={
//                                                   state.selected
//                                                     ? "font-semibold text-[#1B2A4A]"
//                                                     : "text-gray-700"
//                                                 }
//                                               >
//                                                 {prod.productName ||
//                                                   prod.serviceName}
//                                               </span>
//                                             </label>
//                                           )
//                                         })}
//                                   </div>
//                                 )}
//                               </div>
//                             </td>

//                             {/* Amount */}
//                             <td className="border border-gray-300 px-2 py-1">
//                               <input
//                                 type="number"
//                                 readOnly={isReadOnly}
//                                 value={item.productPrice}
//                                 onChange={(e) =>
//                                   handlePriceChange(index, e.target.value)
//                                 }
//                                 placeholder="0.00"
//                                 className={`w-full px-2 py-1 border border-gray-200 rounded text-xs outline-none ${isReadOnly ? "cursor-not-allowed bg-gray-100" : "bg-white"}`}
//                               />
//                             </td>

//                             {/* Tax % */}
//                             <td className="border border-gray-300 px-2 py-1">
//                               <input
//                                 type="number"
//                                 readOnly={isReadOnly}
//                                 value={item.hsn}
//                                 onChange={(e) =>
//                                   handleHsnChange(index, e.target.value)
//                                 }
//                                 placeholder="Tax %"
//                                 className={`w-full px-2 py-1 border border-gray-200 rounded text-xs outline-none bg-gray-100 ${isReadOnly ? "cursor-not-allowed" : ""}`}
//                               />
//                             </td>

//                             {/* Net Amount */}
//                             <td className="border border-gray-300 px-2 py-1">
//                               <input
//                                 type="text"
//                                 readOnly
//                                 value={item.netAmount}
//                                 placeholder="0.00"
//                                 className="w-full px-2 py-1 border border-gray-200 rounded text-xs outline-none cursor-not-allowed bg-gray-100"
//                               />
//                             </td>

//                             {/* Delete */}
//                             <td className="border border-gray-300 px-2 py-1 text-center">
//                               <button
//                                 type="button"
//                                 disabled={isReadOnly}
//                                 onClick={() =>
//                                   handleDeletetableData(item, index)
//                                 }
//                                 className={`text-red-400 hover:text-red-600 p-1 rounded transition-colors ${isReadOnly ? "cursor-not-allowed opacity-30" : ""}`}
//                                 title="Delete row"
//                               >
//                                 <svg
//                                   xmlns="http://www.w3.org/2000/svg"
//                                   className="h-4 w-4"
//                                   fill="none"
//                                   viewBox="0 0 24 24"
//                                   stroke="currentColor"
//                                   strokeWidth="2"
//                                 >
//                                   <path d="M3 6h18" />
//                                   <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
//                                   <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
//                                 </svg>
//                               </button>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>

//                 {/* ── Remark + Amount summary ── */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
//                   <div>
//                     <label className="block text-xs font-semibold text-gray-600 mb-1">
//                       Remark
//                     </label>
//                     <textarea
//                       {...registerMain("remark")}
//                       rows={4}
//                       disabled={isReadOnly}
//                       placeholder="Remarks..."
//                       className={`w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none bg-[#EEF2F8] resize-none ${isReadOnly ? "cursor-not-allowed opacity-70" : ""}`}
//                     />
//                   </div>

//                   <div className="flex flex-col gap-2 md:justify-end md:pt-5">
//                     {[
//                       { label: "Taxable Amount", field: "taxableAmount" },
//                       { label: "Tax Amount", field: "taxAmount" },
//                       { label: "Net Amount", field: "netAmount" }
//                     ].map(({ label, field }) => (
//                       <div key={field} className="flex items-center">
//                         <span className="text-xs font-bold text-white px-3 py-[7px] bg-[#1B2A4A] rounded-l w-[130px] text-right whitespace-nowrap flex-shrink-0">
//                           {label}
//                         </span>
//                         <input
//                           type="number"
//                           {...registerMain(field)}
//                           readOnly
//                           className="flex-1 min-w-0 border border-gray-300 rounded-r px-3 py-[6px] text-sm bg-white outline-none cursor-not-allowed"
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* ── Self Allocation / Lead ID ── */}
//                 {process !== "edit" ? (
//                   <div>
//                     <label className="block text-xs font-semibold text-gray-600 mb-1">
//                       Self Allocation / Other
//                     </label>
//                     <select
//                       disabled={!isSelfAllocationChangable}
//                       {...registerMain("selfAllocation", {
//                         setValueAs: (v) => v === "true",
//                         validate: (v) =>
//                           v === true || v === false
//                             ? true
//                             : "This field is required",
//                         onChange: (e) =>
//                           setselfAllocation(e.target.value === "true")
//                       })}
//                       className={`w-full border border-gray-300 rounded px-3 py-[7px] text-sm outline-none bg-[#EEF2F8] ${!isSelfAllocationChangable ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
//                     >
//                       <option value="">Select</option>
//                       {(loggeduser?.department?._id ===
//                         "670c866552847bbebbd35748" ||
//                         loggeduser?.department?._id ===
//                           "670c867352847bbebbd35750") && (
//                         <option value="true">Self Allocate</option>
//                       )}
//                       <option value="false">Allocate To Other</option>
//                     </select>
//                     {errorsMain.selfAllocation && (
//                       <p className="text-red-500 text-xs mt-1">
//                         {errorsMain.selfAllocation.message}
//                       </p>
//                     )}
//                   </div>
//                 ) : (
//                   <div>
//                     <label className="block text-xs font-semibold text-gray-600 mb-1">
//                       Lead Id
//                     </label>
//                     <input
//                       {...registerMain("leadId")}
//                       disabled
//                       placeholder="Lead Id..."
//                       className="w-full border border-gray-300 rounded px-3 py-[7px] text-sm outline-none bg-[#EEF2F8] cursor-not-allowed opacity-70"
//                     />
//                   </div>
//                 )}

//                 {/* ── Submit + Lead By ── */}
//                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-2">
//                   <div>
//                     {validateError?.emptyleadData && (
//                       <p className="text-red-500 text-xs">
//                         {validateError.emptyleadData}
//                       </p>
//                     )}
//                     {validateError?.readonlyError && (
//                       <p className="text-red-500 text-xs">
//                         {validateError.readonlyError}
//                       </p>
//                     )}
//                     <button
//                       type="submit"
//                       className="bg-[#1B2A4A] hover:bg-[#243660] text-white py-2 px-8 rounded text-sm font-semibold tracking-wide transition-colors mt-1"
//                     >
//                       {process === "Registration" ? "SUBMIT" : "UPDATE"}
//                     </button>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     {editMode ? (
//                       <>
//                         <label className="text-xs font-semibold text-gray-600 italic whitespace-nowrap">
//                           Lead by:
//                         </label>
//                         <select
//                           {...registerMain("leadBy")}
//                           className="border border-gray-300 rounded px-2 py-1 text-sm bg-[#EEF2F8] outline-none"
//                         >
//                           {allstaff?.map((u) => (
//                             <option key={u._id} value={u._id}>
//                               {u.name}
//                             </option>
//                           ))}
//                         </select>
//                       </>
//                     ) : (
//                       <>
//                         <input type="hidden" {...registerMain("leadBy")} />
//                         <p className="text-sm italic text-gray-500">
//                           Lead by:{" "}
//                           <span className="font-semibold text-[#1B2A4A]">
//                             {loggeduser?.name}
//                           </span>
//                         </p>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </form>

//           {popupOpen && (
//             <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
//               <div className="bg-white p-4 rounded shadow-md text-center">
//                 <p className="text-orange-500">{popupMessage}</p>

//                 <button
//                   onClick={handlePopupOk}
//                   className="bg-blue-500 text-white px-4 py-1 rounded mt-3 text-center"
//                 >
//                   OK
//                 </button>
//               </div>
//             </div>
//           )}
//           {modalOpen && (

//             <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center px-4 z-50">
//               <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
//                 {/* ── Header ── */}
//                 <div className="bg-[#1B2A4A] px-6 py-4 flex items-center justify-between flex-shrink-0">
//                   <div>
//                     <h2 className="text-white text-base font-bold tracking-wide">
//                       Add New Customer
//                     </h2>
//                     <p className="text-blue-300 text-xs mt-0.5">
//                       Fill in the details to register a new customer
//                     </p>
//                   </div>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setModalOpen(false)
//                       clearmodalErros()
//                       resetModal()
//                     }}
//                     className="text-blue-200 hover:text-white hover:bg-white hover:bg-opacity-10 rounded-full p-1.5 transition-colors"
//                   >
//                     <svg
//                       className="w-5 h-5"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M6 18L18 6M6 6l12 12"
//                       />
//                     </svg>
//                   </button>
//                 </div>

//                 {/* ── Body ── */}
//                 <form
//                   onSubmit={handleSubmitModal(onmodalsubmit)}
//                   className="overflow-y-auto flex-1 px-6 py-4"
//                 >
//                   {/* Section: Basic Info */}
//                   <p className="text-[10px] font-bold text-[#1B2A4A] uppercase tracking-widest mb-2 border-b border-gray-200 pb-1">
//                     Basic Information
//                   </p>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
//                     <div>
//                       <label className="block text-xs font-semibold text-gray-600 mb-1">
//                         Customer Name <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         {...registerModal("customerName", {
//                           required: "Customer Name is required"
//                         })}
//                         onBlur={(e) =>
//                           setValueModal("customerName", e.target.value.trim())
//                         }
//                         placeholder="Customer Name"
//                         className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A] bg-gray-50 transition"
//                       />
//                       {errorsModal.customerName && (
//                         <p className="text-red-500 text-xs mt-1">
//                           {errorsModal.customerName.message}
//                         </p>
//                       )}
//                     </div>

//                     <div>
//                       <label className="block text-xs font-semibold text-gray-600 mb-1">
//                         Email
//                       </label>
//                       <input
//                         type="email"
//                         {...registerModal("email")}
//                         placeholder="Email"
//                         className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A] bg-gray-50 transition"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-xs font-semibold text-gray-600 mb-1">
//                         Mobile <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="tel"
//                         {...registerModal("mobile", {
//                           required: "Mobile is Required",
//                           validate: (value) => {
//                             const cleaned = value
//                               .replace(/^\+?91/, "")
//                               .replace(/\D/g, "")
//                             if (cleaned.length !== 10)
//                               return "Must be 10 digits after country code"
//                             return true
//                           }
//                         })}
//                         onBlur={(e) =>
//                           setValueModal("mobile", e.target.value.trim())
//                         }
//                         placeholder="Mobile"
//                         className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A] bg-gray-50 transition"
//                       />
//                       {errorsModal.mobile && (
//                         <p className="text-red-500 text-xs mt-1">
//                           {errorsModal.mobile.message}
//                         </p>
//                       )}
//                     </div>

//                     <div>
//                       <label className="block text-xs font-semibold text-gray-600 mb-1">
//                         Landline
//                       </label>
//                       <input
//                         type="tel"
//                         {...registerModal("landline")}
//                         onBlur={(e) =>
//                           setValueModal("landline", e.target.value.trim())
//                         }
//                         placeholder="Landline"
//                         className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A] bg-gray-50 transition"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-xs font-semibold text-gray-600 mb-1">
//                         Contact Person <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         {...registerModal("contactPerson", {
//                           required: "Contact person is Required"
//                         })}
//                         onBlur={(e) =>
//                           setValueModal("contactPerson", e.target.value.trim())
//                         }
//                         placeholder="Contact Person"
//                         className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A] bg-gray-50 transition"
//                       />
//                       {errorsModal.contactPerson && (
//                         <p className="text-red-500 text-xs mt-1">
//                           {errorsModal.contactPerson.message}
//                         </p>
//                       )}
//                     </div>

//                     <div className="md:col-span-2">
//                       <label className="block text-xs font-semibold text-gray-600 mb-1">
//                         Address
//                       </label>
//                       <textarea
//                         {...registerModal("address1")}
//                         onBlur={(e) =>
//                           setValueModal("address1", e.target.value.trim())
//                         }
//                         placeholder="Address"
//                         rows={2}
//                         className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A] bg-gray-50 transition resize-none"
//                       />
//                     </div>
//                   </div>

//                   {/* Section: Location */}
//                   <p className="text-[10px] font-bold text-[#1B2A4A] uppercase tracking-widest mb-2 border-b border-gray-200 pb-1">
//                     Location
//                   </p>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
//                     <div>
//                       <label className="block text-xs font-semibold text-gray-600 mb-1">
//                         Country
//                       </label>
//                       <Select
//                         options={countryOptions}
//                         value={selectedCountry}
//                         getOptionLabel={(o) => o.label}
//                         getOptionValue={(o) => o.value}
//                         {...registerModal("country")}
//                         onChange={(option) => {
//                           setSelectedCountry(option)
//                           setValueModal("country", option.value)
//                         }}
//                         menuPortalTarget={document.body}
//                         menuShouldScrollIntoView={false}
//                         styles={{
//                           control: (base) => ({
//                             ...base,
//                             border: "1px solid #D1D5DB",
//                             borderRadius: "0.5rem",
//                             backgroundColor: "#F9FAFB",
//                             boxShadow: "none",
//                             minHeight: 38,
//                             fontSize: 14,
//                             "&:hover": { borderColor: "#1B2A4A" }
//                           }),
//                           menuList: (base) => ({ ...base, maxHeight: 200 })
//                         }}
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-xs font-semibold text-gray-600 mb-1">
//                         State
//                       </label>
//                       <Select
//                         options={stateOptions}
//                         value={selectedState}
//                         getOptionLabel={(o) => o.label}
//                         getOptionValue={(o) => o.value}
//                         {...registerModal("state")}
//                         onChange={(option) => {
//                           setSelectedState(option)
//                           setValueModal("state", option.value)
//                         }}
//                         isDisabled={!selectedCountry}
//                         menuPortalTarget={document.body}
//                         menuShouldScrollIntoView={false}
//                         styles={{
//                           control: (base, state) => ({
//                             ...base,
//                             border: "1px solid #D1D5DB",
//                             borderRadius: "0.5rem",
//                             backgroundColor: state.isDisabled
//                               ? "#F3F4F6"
//                               : "#F9FAFB",
//                             boxShadow: "none",
//                             minHeight: 38,
//                             fontSize: 14,
//                             "&:hover": { borderColor: "#1B2A4A" }
//                           }),
//                           menuList: (base) => ({ ...base, maxHeight: 200 })
//                         }}
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-xs font-semibold text-gray-600 mb-1">
//                         City
//                       </label>
//                       <input
//                         type="text"
//                         {...registerModal("city")}
//                         onBlur={(e) =>
//                           setValueModal("city", e.target.value.trim())
//                         }
//                         placeholder="City"
//                         className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A] bg-gray-50 transition"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-xs font-semibold text-gray-600 mb-1">
//                         Pincode
//                       </label>
//                       <input
//                         type="text"
//                         {...registerModal("pincode")}
//                         onBlur={(e) =>
//                           setValueModal("pincode", e.target.value.trim())
//                         }
//                         placeholder="Pincode"
//                         className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A] bg-gray-50 transition"
//                       />
//                     </div>
//                   </div>

//                   {/* Section: Business Info */}
//                   <p className="text-[10px] font-bold text-[#1B2A4A] uppercase tracking-widest mb-2 border-b border-gray-200 pb-1">
//                     Business Information
//                   </p>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
//                     <div>
//                       <label className="block text-xs font-semibold text-gray-600 mb-1">
//                         Industry <span className="text-red-500">*</span>
//                       </label>
//                       <select
//                         {...registerModal("industry", {
//                           required: "Industry is required"
//                         })}
//                         className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1B2A4A] bg-gray-50 cursor-pointer transition"
//                       >
//                         <option value="">Select Industry</option>
//                         {Industries.map((industry, index) => (
//                           <option key={index} value={industry}>
//                             {industry}
//                           </option>
//                         ))}
//                       </select>
//                       {errorsModal.industry && (
//                         <p className="text-red-500 text-xs mt-1">
//                           {errorsModal.industry.message}
//                         </p>
//                       )}
//                     </div>

//                     <div>
//                       <label className="block text-xs font-semibold text-gray-600 mb-1">
//                         Partnership Type
//                       </label>
//                       <select
//                         {...registerModal("partner")}
//                         className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1B2A4A] bg-gray-50 cursor-pointer transition"
//                       >
//                         <option value="">Select Partner</option>
//                         {partner?.map((p, i) => (
//                           <option key={i} value={p._id}>
//                             {p.partner}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-xs font-semibold text-gray-600 mb-1">
//                         Registration Type
//                       </label>
//                       <select
//                         {...registerModal("registrationType")}
//                         className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1B2A4A] bg-gray-50 cursor-pointer transition"
//                       >
//                         <option value="">Select Type</option>
//                         <option value="unregistered">
//                           Unregistered / Consumer
//                         </option>
//                         <option value="regular">Regular</option>
//                       </select>
//                     </div>

//                     {registrationType === "regular" && (
//                       <div>
//                         <label className="block text-xs font-semibold text-gray-600 mb-1">
//                           GSTIN / UIN <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           {...registerModal("gstNo", {
//                             required: "GST is required"
//                           })}
//                           placeholder="e.g. 22AAAAA0000A1Z5"
//                           className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A] bg-gray-50 transition"
//                         />
//                         {errorsModal.gstNo && (
//                           <p className="text-red-500 text-xs mt-1">
//                             {errorsModal.gstNo.message}
//                           </p>
//                         )}
//                       </div>
//                     )}
//                   </div>

//                   {/* ── Footer buttons ── */}
//                   <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-3">
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setModalOpen(false)
//                         clearmodalErros()
//                         resetModal()
//                       }}
//                       className="px-5 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="px-6 py-2 rounded-lg bg-[#1B2A4A] hover:bg-[#243660] text-white text-sm font-semibold tracking-wide transition"
//                     >
//                       Submit
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export
import { useEffect, useState, useMemo, useRef, useLayoutEffect } from "react"
import { createPortal } from "react-dom"
import { Country, State } from "country-state-city"
import BarLoader from "react-spinners/BarLoader"
import { FaSpinner } from "react-icons/fa"
import Select from "react-select"
import { useForm } from "react-hook-form"
import PopUp from "../../components/common/PopUp"
import { toast } from "react-toastify"
import UseFetch from "../../hooks/useFetch"
import api from "../../api/api"
import { Loader } from "lucide-react"
import { selectedBranch } from "../../../slices/companyBranchSlice"

// ─────────────────────────────────────────────────────────────────────────────
// DropdownPortal — keeps dropdown aligned on scroll/resize
// ─────────────────────────────────────────────────────────────────────────────
function DropdownPortal({ anchorEl, children }) {
  const [coords, setCoords] = useState(null)

  const reposition = () => {
    if (!anchorEl) return
    const rect = anchorEl.getBoundingClientRect()
    setCoords({
      top: rect.bottom + window.scrollY + 2,
      left: rect.left + window.scrollX,
      width: rect.width
    })
  }

  useLayoutEffect(() => {
    if (!anchorEl) return
    reposition()

    const handleScrollOrResize = () => reposition()

    window.addEventListener("scroll", handleScrollOrResize, true)
    window.addEventListener("resize", handleScrollOrResize)

    let ro
    if (window.ResizeObserver) {
      ro = new ResizeObserver(() => reposition())
      ro.observe(anchorEl)
    }

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true)
      window.removeEventListener("resize", handleScrollOrResize)
      if (ro && anchorEl) ro.unobserve(anchorEl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchorEl])

  if (!coords) return null

  return createPortal(
    <div
      data-lead-portal="true"
      style={{
        position: "absolute",
        top: coords.top,
        left: coords.left,
        minWidth: Math.max(coords.width, 220),
        zIndex: 9999
      }}
    >
      {children}
    </div>,
    document.body
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LicenseDropdown
// ─────────────────────────────────────────────────────────────────────────────
function LicenseDropdown({
  index,
  item,
  isReadOnly,
  customerTableData,
  selectedleadlist,
  setSelectedLeadList,
  handleLicenseSelect
}) {
  const emptyRow = {
    licenseNumber: "",
    productorServiceId: "",
    productorServiceName: "",
    productPrice: "",
    hsn: "",
    netAmount: ""
  }

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState(String(item.licenseNumber ?? ""))
  const inputRef = useRef(null)

  useEffect(() => {
    setSearch(String(item.licenseNumber ?? ""))
  }, [item.licenseNumber])

  useEffect(() => {
    const handler = (e) => {
      const portals = document.querySelectorAll("[data-lead-portal]")
      const inPortal = Array.from(portals).some((p) => p.contains(e.target))
      if (!inPortal && !inputRef.current?.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  const filtered = (customerTableData || []).filter((lic) => {
    if (!search) return true

    const q = String(search).toLowerCase()

    const license =
      lic && lic.licenseNumber !== undefined && lic.licenseNumber !== null
        ? String(lic.licenseNumber).toLowerCase()
        : ""

    const product =
      lic && (lic.productName || lic.productorServiceName)
        ? String(lic.productName || lic.productorServiceName).toLowerCase()
        : ""

    return license.includes(q) || product.includes(q)
  })

  const applySelection = (lic) => {
    const base = selectedleadlist?.length ? selectedleadlist : [{ ...emptyRow }]
    const updated = [...base]

    if (!lic) {
      updated[index] = { ...emptyRow }
      setSearch("")
      handleLicenseSelect(null)
    } else {
      const valueStr = String(lic.licenseNumber ?? "")
      updated[index] = {
        ...updated[index],
        licenseNumber: lic.licenseNumber,
        productorServiceId: "",
        productorServiceName: "",
        productPrice: "",
        hsn: "",
        netAmount: ""
      }
      setSearch(valueStr)
      handleLicenseSelect(lic.licenseNumber)
    }

    setSelectedLeadList(updated)
  }

  const handleInputChange = (e) => {
    console.log("h")
    const value = e.target.value
    setSearch(value)
    setOpen(true)

    const exact = (customerTableData || []).find(
      (lic) => String(lic.licenseNumber ?? "") === value
    )
    if (exact) applySelection(exact)
    else if (!value) applySelection(null)
  }

  const handleClear = () => {
    applySelection(null)
    setOpen(false)
  }

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        disabled={isReadOnly}
        value={search}
        onChange={handleInputChange}
        onClick={() => !isReadOnly && setOpen(true)}
        placeholder="Search / Select License"
        className={`w-full px-2 py-1 border border-gray-200 rounded text-xs bg-[#EEF2F8] outline-none ${
          isReadOnly ? "cursor-not-allowed opacity-70" : "cursor-text"
        }`}
      />
      {search && !isReadOnly && (
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault()
            handleClear()
          }}
          className="absolute right-1.5 top-1.5 text-gray-400 hover:text-red-500 text-[10px]"
        >
          ✕
        </button>
      )}

      {open && (
        <DropdownPortal anchorEl={inputRef.current}>
          <div className="bg-white border border-gray-200 rounded shadow-xl overflow-hidden max-h-52">
            <ul className="max-h-52 overflow-y-auto text-xs">
              {filtered.length === 0 ? (
                <li className="px-3 py-2 text-gray-400 italic">
                  No results found
                </li>
              ) : (
                filtered.map((lic, i) => {
                  const valStr = String(lic.licenseNumber ?? "")
                  const isActive = valStr === String(item.licenseNumber ?? "")
                  return (
                    <li
                      key={lic.licenseNumber ?? i}
                      className={`px-3 py-2 hover:bg-blue-50 cursor-pointer flex items-center justify-between gap-2 ${
                        isActive
                          ? "bg-blue-50 font-semibold text-[#1B2A4A]"
                          : "text-gray-700"
                      }`}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        applySelection(lic)
                        setOpen(false)
                      }}
                    >
                      <span className="font-medium">{valStr}</span>
                      <span className="text-gray-400 truncate">
                        {lic.productName || lic.productorServiceName}
                      </span>
                    </li>
                  )
                })
              )}
            </ul>
          </div>
        </DropdownPortal>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ProductDropdown
// ─────────────────────────────────────────────────────────────────────────────
function ProductDropdown({
  index,
  item,
  isReadOnly,
  leadList,
  selectedleadlist,
  setSelectedLeadList,
  selectedBranch
}) {
  console.log(selectedBranch)
  const emptyRow = {
    licenseNumber: "",
    productorServiceId: "",
    productorServiceName: "",
    productPrice: "",
    hsn: "",
    netAmount: ""
  }

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState(item.productorServiceName || "")
  const inputRef = useRef(null)

  useEffect(() => {
    setSearch(item.productorServiceName || "")
  }, [item.productorServiceName])

  useEffect(() => {
    const handler = (e) => {
      const portals = document.querySelectorAll("[data-lead-portal]")
      const inPortal = Array.from(portals).some((p) => p.contains(e.target))
      if (!inPortal && !inputRef.current?.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  const filtered = (leadList || []).filter((prod) => {
    if (!search) return true
    const q = search.toLowerCase()
    const name =
      prod.productName?.toLowerCase() || prod.serviceName?.toLowerCase() || ""
    return name.includes(q)
  })
  console.log(selectedBranch)
  const applySelection = (prod) => {
    const base = selectedleadlist?.length
      ? [...selectedleadlist]
      : [{ ...emptyRow }]
    const updated = [...base]
    console.log(prod)
    const filteredbranch = prod?.selected.filter(
      (item) => item.branch_id === selectedBranch[0]
    )
    console.log(filteredbranch)
    const igstRate = filteredbranch?.[0]?.hsn_id?.onValue?.igstRate
    console.log("hhh")
    if (!prod) {
      console.log(prod)
      updated[index] = {
        ...updated[index],
        productorServiceId: "",
        productorServiceName: "",
        productPrice: "",
        hsn: "",
        netAmount: ""
      }
      setSearch("")
    } else {
      console.log(igstRate)
      console.log(prod?.selectedArray)
      console.log(prod.productPrice)
      const netAmount = (
        Number(prod?.productPrice || 0) +
        (Number(igstRate || 0) / 100) * Number(prod?.productPrice || 0)
      ).toFixed(2)

      updated[index] = {
        ...updated[index],
        productorServiceId: prod._id,
        productorServiceName: prod.productName || prod.serviceName,
        itemType: prod.productName ? "Product" : "Service",
        productPrice: prod.productPrice,
        hsn: igstRate,
        netAmount
      }
      setSearch(prod.productName || prod.serviceName || "")
    }

    setSelectedLeadList(updated)
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setSearch(value)
    setOpen(true)

    const exact = (leadList || []).find(
      (p) => p.productName === value || p.serviceName === value
    )
    console.log("hh")
    if (exact) applySelection(exact)
    else if (!value) applySelection(null)
  }

  const handleClear = () => {
    applySelection(null)
    setOpen(false)
  }

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        disabled={isReadOnly}
        value={search}
        onChange={handleInputChange}
        onClick={() => !isReadOnly && setOpen(true)}
        placeholder="Search / Select Product"
        className={`w-full px-2 py-1 border border-gray-200 rounded text-xs bg-[#EEF2F8] outline-none ${
          isReadOnly ? "cursor-not-allowed opacity-70" : "cursor-text"
        }`}
      />
      {search && !isReadOnly && (
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault()
            handleClear()
          }}
          className="absolute right-1.5 top-1.5 text-gray-400 hover:text-red-500 text-[10px]"
        >
          ✕
        </button>
      )}

      {open && (
        <DropdownPortal anchorEl={inputRef.current}>
          <div className="bg-white border border-gray-200 rounded shadow-xl overflow-hidden max-h-52">
            <ul className="max-h-52 overflow-y-auto text-xs">
              {filtered.length === 0 ? (
                <li className="px-3 py-2 text-gray-400 italic">
                  No results found
                </li>
              ) : (
                filtered.map((prod) => (
                  <li
                    key={prod._id}
                    className="px-3 py-2 hover:bg-blue-50 cursor-pointer flex items-center gap-2 text-gray-700"
                    onMouseDown={(e) => {
                      e.preventDefault()
                      console.log("hhh")
                      applySelection(prod)
                      setOpen(false)
                    }}
                  >
                    <span className="font-medium text-[#1B2A4A]">
                      {prod.productName || prod.serviceName}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </DropdownPortal>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LeadMaster
// ─────────────────────────────────────────────────────────────────────────────
const LeadMaster = ({
  process,
  Data,
  isReadOnly,
  handleleadData,
  handleEditData,
  loadingState,
  setLoadingState,
  editloadingState,
  seteditLoadingState,
  showmessage,
  showpopupMessage
}) => {
  const {
    register: registerMain,
    handleSubmit: handleSubmitMain,
    setValue: setValueMain,
    watch: watchMain,
    clearErrors: clearMainerrors,
    formState: { errors: errorsMain }
  } = useForm()

  const {
    register: registerModal,
    handleSubmit: handleSubmitModal,
    setValue: setValueModal,
    getValues: getValuesModal,
    watch: watchModal,
    setError,
    clearErrors: clearmodalErros,
    formState: { errors: errorsModal },
    reset: resetModal
  } = useForm()

  const [productOrserviceSelections, setProductorServiceSelections] = useState(
    {}
  )
  const [leadList, setLeadList] = useState([])
  const [submitLoading, setsubmitLoading] = useState(false)
  const [popupOpen, setPopupOpen] = useState(false)
  const [formData, setFormData] = useState(null)
  const [restrictionMessage, setrestrictMessage] = useState()
  const [isEligible, setIseligible] = useState(false)
  const [openLicenseDropdown, setOpenLicenseDropdown] = useState(null)
  const [openProductDropdown, setOpenProductDropdown] = useState(null)
  const [popupMessage, setPopupMessage] = useState("")
  const [ispopupModalOpen, setIspopupModalOpen] = useState(false)
  const [isSelfAllocationChangable, setselfAllocationChangable] = useState(true)
  const [modalloader, setModalLoader] = useState(false)
  const [selfAllocation, setselfAllocation] = useState(false)
  const [partner, setPartner] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [licensewithoutProductSelection, setlicenseWithoutProductSelection] =
    useState({})
  const [iscustomerchangeandbranch, setcutomerchangeandbranch] = useState(true)
  const [selectedState, setSelectedState] = useState(null)
  const [selectedleadlist, setSelectedLeadList] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [selectedLicense, setSelectedLicense] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [customerOptions, setCustomerOptions] = useState([])
  const [isleadForOpen, setIsleadForOpen] = useState(false)
  const [isLicenseOpen, setIslicenseOpen] = useState(false)
  const [branches, setBranches] = useState([])
  const [customerTableData, setcustomerTableData] = useState([])
  const [validateError, setValidateError] = useState({})
  const [loggeduser, setloggedUser] = useState(null)
  const [allstaff, setallStaffs] = useState([])
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [tasklist, settasklist] = useState([])
  const [allcustomer, setallcustomer] = useState([])
  const dropdownLicenseRef = useRef(null)
  const dropdownLeadforRef = useRef(null)
  const registrationType = watchModal("registrationType")

  const { data: productData, loading: productLoading } = UseFetch(
    loggeduser &&
      selectedBranch &&
      selectedBranch.length &&
      `/product/getallProducts?branchselected=${encodeURIComponent(
        JSON.stringify(selectedBranch)
      )}`
  )
  const { data: tasks } = UseFetch("lead/getallTask")
  const { data: companybranches } = UseFetch("/branch/getBranch")
  const { data: partners } = UseFetch("/customer/getallpartners")
  const { data: serviceData } = UseFetch(
    loggeduser &&
      selectedBranch &&
      `/product/getallServices?branchselected=${selectedBranch}`
  )
  const { data: alluser, loading: usersLoading } = UseFetch("/auth/getallUsers")
  console.log(selectedBranch)
  const {
    data: customerData,
    loading: customerLoading,
    refreshHook
  } = UseFetch(
    loggeduser &&
      selectedBranch &&
      `/customer/getallCustomer?branchSelected=${selectedBranch}`
  )

  const emptyRow = {
    licenseNumber: "",
    productorServiceId: "",
    productorServiceName: "",
    productPrice: "",
    hsn: "",
    netAmount: ""
  }
  // decide if user is allowed to self allocate
  const canSelfAllocate =
    loggeduser?.department?._id === "670c866552847bbebbd35748" ||
    loggeduser?.department?._id === "670c867352847bbebbd35750"

  useEffect(() => {
    if (!selectedleadlist || selectedleadlist.length === 0) {
      setSelectedLeadList([{ ...emptyRow }])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      setloggedUser(user)
      if (user.role === "Staff" || user.role === "Manager") {
        const branch = user.selected.map((branch) => branch.branch_id)
        const branches = JSON.stringify(branch)
        setBranches(branches)
      }
    }
  }, [])

  useEffect(() => {
    if (tasks) {
      settasklist(tasks.filter((item) => item.taskName === "Followup"))
    }
  }, [tasks])

  useEffect(() => {
    if (showmessage) {
      setIspopupModalOpen(true)
    }
  }, [showmessage])

  useEffect(() => {
    if (companybranches && companybranches.length > 0) {
      const defaultBranch = companybranches[0]._id
      if (Data && Data.length) {
        const customerBranch = Data[0].leadBranch
        setSelectedBranch([customerBranch])
        setValueMain("leadBranch", customerBranch)
      } else if (defaultBranch) {
        setSelectedBranch([defaultBranch])
        setValueMain("leadBranch", defaultBranch)
      }
    }
  }, [companybranches, Data])

  useEffect(() => {
    if (
      loggeduser &&
      productData &&
      productData.length &&
      serviceData &&
      serviceData.length &&
      partners &&
      selectedBranch
    ) {
      const filteredPartners = partners.filter((partner) =>
        partner.relationBranches.some((branch) =>
          selectedBranch.includes(branch?.branchName?._id)
        )
      )
      setPartner(filteredPartners)
      const combinedlead = [...productData, ...serviceData]
      setLeadList(combinedlead)
    }
  }, [loggeduser, branches, productData, serviceData, partners, selectedBranch])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownLicenseRef.current &&
        !dropdownLicenseRef.current.contains(event.target)
      ) {
        setIslicenseOpen(false)
      }
      if (
        dropdownLeadforRef.current &&
        !dropdownLeadforRef.current.contains(event.target)
      ) {
        setIsleadForOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (loggeduser?._id) {
      setValueMain("leadBy", loggeduser._id)
    }
  }, [loggeduser, setValueMain])

  useEffect(() => {
    if (
      Data &&
      Data.length > 0 &&
      customerOptions &&
      customerOptions.length &&
      loggeduser
    ) {
      console.log("h")
      if (Data[0]?.selfAllocation) {
        setselfAllocationChangable(false)
      }
      if (Data[0].activityLog.length === 1) {
        setcutomerchangeandbranch(true)
      } else if (Data[0].activityLog.length > 1) {
        setcutomerchangeandbranch(false)
      }
      setValueMain("leadId", Data[0]?.leadId)
      setValueMain("partner", Data[0]?.partner)
      setValueMain(
        "selfAllocation",
        Data[0]?.selfAllocation === true ? "true" : "false"
      )
      if (Data[0].selfAllocation === true) {
        setselfAllocation(true)
        setValueMain("allocationType", Data[0].selfAllocationType)
        const formattedDate = Data[0].selfAllocationDueDate
          ? Data[0].selfAllocationDueDate.split("T")[0]
          : ""
        setValueMain("dueDate", formattedDate)
      }
      console.log(Data[0])
      setValueMain("source", Data[0]?.source || "")
      setValueMain("customerName", Data[0]?.customerName?._id)
      setValueMain("mobile", Data[0]?.customerName?.mobile)
      setValueMain("phone", Data[0]?.customerName?.phone)
      setValueMain("email", Data[0]?.customerName?.email)
      const leadData = Data[0]?.leadFor.map((item) => ({
        licenseNumber: item?.licenseNumber,
        productorServiceName:
          item?.productorServiceId?.productName ||
          item?.productorServiceId?.serviceName,
        productorServiceId: item?.productorServiceId?._id,
        itemType: item?.productorServicemodel,
        productPrice: item?.productPrice,
        hsn: item?.hsn,
        netAmount: item?.netAmount,
        price: item?.price
      }))
      setSelectedLeadList(leadData.length ? leadData : [{ ...emptyRow }])
      const productListwithoutlicenseOnEdit = leadList?.map((product) => {
        const match = Data[0].leadFor?.find((lead) => {
          return (
            lead.productorServiceId._id === product._id &&
            !Object.prototype.hasOwnProperty.call(lead, "licenseNumber")
          )
        })
        return {
          ...product,
          selected: !!match,
          selectedArray: product.selected
        }
      })
      setlicenseWithoutProductSelection(productListwithoutlicenseOnEdit)
      const groupedByLicenseNumber = {}
      Data[0].leadFor.forEach((lead) => {
        if (lead.licenseNumber) {
          if (!groupedByLicenseNumber[lead.licenseNumber]) {
            groupedByLicenseNumber[lead.licenseNumber] = []
          }
          leadList?.forEach((product) => {
            const existingIndex = groupedByLicenseNumber[
              lead.licenseNumber
            ].findIndex((item) => item._id === product._id)
            if (existingIndex !== -1) {
              if (lead.productorServiceId._id === product._id) {
                groupedByLicenseNumber[lead.licenseNumber][
                  existingIndex
                ].selected = product._id === lead.productorServiceId._id
              }
            } else {
              const item = {
                ...product,
                selected: product._id === lead.productorServiceId._id,
                selectedArray: product.selected
              }
              groupedByLicenseNumber[lead.licenseNumber].push(item)
            }
          })
        }
      })
      setProductorServiceSelections(groupedByLicenseNumber)
      const selectedcustomerlicenseandproduct =
        Data[0]?.customerName?.selected?.map((sel) => ({
          licenseNumber: sel.licensenumber || "N/A",
          productName: sel.productName || "Unknown"
        }))
      setcustomerTableData(selectedcustomerlicenseandproduct)
    }
  }, [customerOptions, Data])

  useEffect(() => {
    if (customerData && customerData.length > 0) {
      setallcustomer(customerData)
    }
  }, [customerData])

  useEffect(() => {
    if (customerData && customerData.length && selectedBranch) {
      const options = customerData.map((item) => {
        const matchingSelected = item.selected?.find(
          (sel) => sel.branch_id === selectedBranch[0]
        )
        return {
          value: item?._id,
          label: item?.customerName,
          address: item?.address1,
          mobile: item?.mobile || "",
          license: matchingSelected?.licensenumber || "",
          email: item?.email,
          phone: item?.landline
        }
      })
      setCustomerOptions(options)
    }
  }, [customerData])

  useEffect(() => {
    if (selectedCustomer) {
      setValueMain("mobile", selectedCustomer.mobile)
      setValueMain("phone", selectedCustomer.phone)
      setValueMain("email", selectedCustomer.email)
    }
  }, [selectedCustomer])

  useEffect(() => {
    if (alluser) {
      const { allusers = [], allAdmins = [] } = alluser
      const combinedUsers = [...allusers, ...allAdmins]
      setallStaffs(combinedUsers)
    }
  }, [alluser])

  useEffect(() => {
    setValueMain("netAmount", calculateTotalAmount())
    setValueMain("taxAmount", calculatetaxAmount())
    setValueMain("taxableAmount", calculatetaxableAmount())
  }, [selectedleadlist])

  useEffect(() => {
    if (!selectedLicense && leadList && leadList.length > 0 && !Data) {
      const initialProductListwithoutlicense = leadList?.map((product) => ({
        ...product,
        selectedArray: product.selected,
        selected: false
      }))
      setlicenseWithoutProductSelection(initialProductListwithoutlicense)
    }
  }, [leadList])

  const countryOptions = useMemo(
    () =>
      Country.getAllCountries().map((country) => ({
        label: country.name,
        value: country.isoCode
      })),
    []
  )
  const stateOptions = selectedCountry
    ? State.getStatesOfCountry(selectedCountry.value).map((state) => ({
        label: state.name,
        value: state.isoCode
      }))
    : []
  const defaultCountry = useMemo(
    () => countryOptions.find((country) => country.value === "IN"),
    [countryOptions]
  )
  const defaultState = useMemo(
    () => stateOptions.find((state) => state.value === "KL"),
    [stateOptions]
  )

  useEffect(() => {
    if (defaultCountry) {
      setSelectedCountry(defaultCountry)
      setValueModal("country", defaultCountry.value)
    }
  }, [defaultCountry])

  useEffect(() => {
    const currentState = getValuesModal("state")
    if (defaultState && !currentState) {
      setSelectedState(defaultState)
      setValueModal("state", defaultState.value)
    }
  }, [defaultState, getValuesModal, setValueModal])

  const Industries = [
    "Whole sailor/Distributors",
    "Retailer",
    "Manufacturer",
    "Service",
    "Works Contact"
  ]

  const handleLicenseSelect = (license) => {
    if (license && !productOrserviceSelections[license]) {
      const initialProductList = leadList.map((product) => ({
        ...product,
        selectedArray: product.selected,
        selected: false
      }))
      setProductorServiceSelections((prev) => ({
        ...prev,
        [license]: initialProductList
      }))
    }
    setIslicenseOpen(false)
    setSelectedLicense(license)
  }

  const handleProductORserviceSelect = (productId) => {
    if (selectedLicense) {
      if (
        selectedleadlist.some(
          (item) =>
            item.productId === productId &&
            item.licenseNumber === selectedLicense
        )
      )
        return
      const updatedProductList = productOrserviceSelections[
        selectedLicense
      ].map((product) =>
        product._id === productId
          ? {
              ...product,
              selected: !product.selected,
              selectedArray: product?.selectedArray
            }
          : product
      )
      setProductorServiceSelections((prev) => ({
        ...prev,
        [selectedLicense]: updatedProductList
      }))
    } else {
      if (
        selectedleadlist
          .filter((items) => !items.licenseNumber)
          .some((item) => item.productId === productId)
      )
        return
      const updatedProductList = licensewithoutProductSelection.map(
        (product) =>
          product._id === productId
            ? { ...product, selected: !product.selected }
            : product
      )
      setlicenseWithoutProductSelection(updatedProductList)
    }
  }

  const handleToggleDropdown = () => {
    setIsleadForOpen((prev) => !prev)
  }

  const handleSelectedCustomer = (option) => {
    const filteredcustomerLicenseandproducts = allcustomer
      ?.filter(
        (item) =>
          String(item?.customerName)?.trim() ===
            String(option?.label)?.trim() &&
          String(item?.address1)?.trim() === String(option?.address)?.trim()
      )
      ?.flatMap((item) =>
        item.selected
          .filter((sel) => String(sel.branch_id) === String(selectedBranch))
          .map((sel) => ({
            licenseNumber: sel.licensenumber || "N/A",
            productName: sel.productName || "Unknown"
          }))
      )
    setcustomerTableData(filteredcustomerLicenseandproducts)
  }

  const handlePriceChange = (index, newPrice) => {
    setSelectedLeadList((prevList) =>
      prevList.map((product, i) =>
        i === index
          ? {
              ...product,
              productPrice: newPrice,
              netAmount: (
                Number(newPrice) +
                (Number(product.hsn) / 100) * Number(newPrice)
              ).toFixed(2)
            }
          : product
      )
    )
  }

  const handleHsnChange = (index, newHsn) => {
    setSelectedLeadList((prevList) =>
      prevList.map((product, i) =>
        i === index
          ? {
              ...product,
              hsn: newHsn,
              netAmount: (
                Number(product?.productPrice) +
                (Number(newHsn) / 100) * Number(product?.productPrice)
              ).toFixed(2)
            }
          : product
      )
    )
  }

  const handleDeletetableData = (item, indexNum) => {
    if (item.licenseNumber) {
      const updatedProductList = productOrserviceSelections[
        item.licenseNumber
      ].map((product) =>
        product._id === item.productId
          ? { ...product, selected: !product.selected }
          : product
      )
      setProductorServiceSelections((prev) => ({
        ...prev,
        [item.licenseNumber]: updatedProductList
      }))
    } else {
      const updatedProductList = licensewithoutProductSelection.map(
        (product) =>
          product._id === item.productId
            ? { ...product, selected: !product.selected }
            : product
      )
      setlicenseWithoutProductSelection(updatedProductList)
    }
    const filteredLeadlist = selectedleadlist.filter(
      (row, index) => index !== indexNum
    )
    setSelectedLeadList(
      filteredLeadlist.length ? filteredLeadlist : [{ ...emptyRow }]
    )
  }

  const customFilter = (option, inputValue) => {
    if (!inputValue) return true
    const searchValue = inputValue.toLowerCase()
    const label = option.label ? String(option.label).toLowerCase() : ""
    const mobile = option.data?.mobile ? option.data?.mobile.toLowerCase() : ""
    return label.includes(searchValue) || mobile.includes(searchValue)
  }

  const calculateTotalAmount = () => {
    return selectedleadlist
      .reduce((total, product) => {
        return total + (Number(product.netAmount) || 0)
      }, 0)
      .toFixed(2)
  }

  const calculatetaxAmount = () => {
    return (
      Math.round(
        selectedleadlist.reduce((total, product) => {
          return (
            total + (Number(product.netAmount) - Number(product.productPrice))
          )
        }, 0) * 100
      ) / 100
    )
  }

  const calculatetaxableAmount = () => {
    return selectedleadlist.reduce((total, product) => {
      return total + Number(product.productPrice)
    }, 0)
  }

  const handleAddRowFromTable = () => {
    setSelectedLeadList((prev) => {
      if (!prev || prev.length === 0) {
        return [{ ...emptyRow }]
      }
      const last = prev[prev.length - 1]
      const cloned = { ...last }
      return [...prev, cloned]
    })
  }

  const hasDuplicateLeadRows = (rows) => {
    const seen = new Set()
    for (const row of rows) {
      if (!row.productorServiceId) continue
      const key =
        row.licenseNumber && row.licenseNumber !== ""
          ? `LIC:${row.licenseNumber}|PROD:${row.productorServiceId}`
          : `NO_LIC|PROD:${row.productorServiceId}`
      if (seen.has(key)) {
        return true
      }
      seen.add(key)
    }
    return false
  }

  const handleAddProducts = () => {
    setIsleadForOpen(false)
    if (validateError.emptyleadData) {
      setValidateError((prev) => ({ ...prev, emptyleadData: "" }))
    }
    if (validateError.readonlyError) {
      setValidateError((prev) => ({ ...prev, readonlyError: "" }))
    }
    setSelectedLeadList((prev) => {
      let updatedList = [...prev]
      if (selectedLicense) {
        const selectedProducts = productOrserviceSelections[selectedLicense]
          .filter((items) => items.selected)
          .map((item) => {
            const igstRate =
              item?.selectedArray?.[0]?.hsn_id?.onValue?.igstRate ?? 0
            return {
              licenseNumber: selectedLicense,
              productorServiceName: item.productName || item.serviceName,
              productorServiceId: item._id,
              itemType: item.productName ? "Product" : "Service",
              productPrice: item.productPrice,
              hsn: item?.selectedArray[0]?.hsn_id?.onValue?.igstRate || 0,
              price: item?.productPrice,
              netAmount: (
                Number(item?.productPrice || 0) +
                (Number(igstRate) / 100) * Number(item?.productPrice || 0)
              ).toFixed(2)
            }
          })
        const newProducts = selectedProducts.filter(
          (product) =>
            !updatedList.some(
              (p) =>
                p.licenseNumber === selectedLicense &&
                p.productorServiceId === product.productorServiceId
            )
        )
        updatedList = [...updatedList, ...newProducts]
      } else {
        const selectedProducts = licensewithoutProductSelection
          .filter((items) => items.selected)
          .map((item) => {
            const igstRate =
              item?.selectedArray?.[0]?.hsn_id?.onValue?.igstRate ?? 0
            return {
              productorServiceName: item.productName || item.serviceName,
              productorServiceId: item._id,
              itemType: item.productName ? "Product" : "Service",
              productPrice: item?.productPrice,
              hsn: item?.selectedArray[0]?.hsn_id?.onValue?.igstRate || 0,
              price: item.productPrice || item.price,
              netAmount: (
                Number(item?.productPrice || 0) +
                (Number(igstRate) / 100) * Number(item?.productPrice || 0)
              ).toFixed(2)
            }
          })
        const newProducts = selectedProducts.filter(
          (product) =>
            !updatedList.some(
              (p) =>
                !p.licenseNumber &&
                p.productorServiceId === product.productorServiceId
            )
        )
        updatedList = [...updatedList, ...newProducts]
      }
      return updatedList.length ? updatedList : [{ ...emptyRow }]
    })
  }

  const validateLeadData = async (leadData, selectedleadlist, role) => {
    const result = await api.get("/lead/checkexistinglead", {
      params: { leadData, selectedleadlist, role }
    })
    if (
      result.data.message ===
        "This customer already has a lead with the same product." &&
      loggeduser.role === "Staff"
    ) {
      return {
        eligible: false,
        message: `${result.data.message},You can't make leads`
      }
    } else if (
      result.data.message ===
        "This customer already has a lead with the same product." &&
      loggeduser.role !== "Staff"
    ) {
      return { eligible: true, message: result.data.message }
    } else if (
      result.data.message ===
      "No existing lead for this customer. Safe to create new lead."
    ) {
      return { eligible: true, message: "" }
    } else if (
      result.data.message ===
      "This customer already has a lead, but with different product(s)."
    ) {
      return {
        eligible: true,
        message:
          "This customer already has a lead, but with different product(s)."
      }
    }
    setPopupMessage(result.data.message)
    return isEligible
  }

  const onSubmit = async (data) => {
    setsubmitLoading(true)
    if (submitLoading) return
    try {
      if (hasDuplicateLeadRows(selectedleadlist)) {
        setValidateError((prev) => ({
          ...prev,
          duplicate:
            "Duplicate product found for same license or same product without license. Please remove duplicates."
        }))
        setsubmitLoading(false)
        return
      } else if (validateError.duplicate) {
        setValidateError((prev) => ({ ...prev, duplicate: "" }))
      }

      if (process === "Registration") {
        const filteredleadlist = selectedleadlist.filter(
          (item) => item.productorServiceId && item.productorServiceId !== ""
        )
        if (filteredleadlist.length === 0) {
          setValidateError((prev) => ({
            ...prev,
            emptyleadData: "No Lead generated do it"
          }))
          setsubmitLoading(false)
          return
        }
        const validation = await validateLeadData(
          data,
          filteredleadlist,
          loggeduser.role
        )
        setFormData(data)
        setPopupMessage(validation.message)
        if (validation.message === "") {
          await handlePopupOk(true, data)
        } else {
          setPopupOpen(true)
        }
        setIseligible(validation.eligible)
      } else if (process === "edit") {
        if (isReadOnly) {
          setValidateError((prev) => ({
            ...prev,
            readonlyError:
              "Can't make changes unless the user is the leadBy or allocatedTo"
          }))
          setsubmitLoading(false)
          return
        }
        seteditLoadingState(true)
        await handleEditData(data, selectedleadlist, Data[0]?._id)
      }
    } catch (error) {
      console.log("error on onsubmit:", error)
      toast.error("Failed to add product!")
    } finally {
      setsubmitLoading(false)
    }
  }

  const handlePopupOk = async (ischek = false, leadData = null) => {
    setPopupOpen(false)
    const filteredleadlist = selectedleadlist.filter(
      (item) => item.productorServiceId && item.productorServiceId !== ""
    )
    if (isEligible && leadData === null) {
      await handleleadData(formData, filteredleadlist, loggeduser.role)
    } else if (ischek && leadData) {
      await handleleadData(leadData, filteredleadlist, loggeduser.role)
    }
  }

  const normalizeMobile = (number) => {
    if (!number) return ""
    return number.replace(/\D/g, "").slice(-10)
  }

  const isMobileExists = (inputMobile, existingCustomers) => {
    const normalizedInput = normalizeMobile(inputMobile)
    return existingCustomers.some((customer) => {
      const normalizedStored = normalizeMobile(customer.mobile)
      return normalizedStored === normalizedInput
    })
  }

  const onmodalsubmit = async (data) => {
    try {
      const checkexistingNumber = isMobileExists(data.mobile, allcustomer)
      if (checkexistingNumber) {
        setError("mobile", {
          type: "manual",
          message: "This mobile number is already used"
        })
        return
      }
      setModalLoader(true)
      const response = await api.post("/customer/customerRegistration", {
        customerData: data
      })
      if (response.status === 200) {
        refreshHook()
        setModalLoader(false)
        resetModal()
        toast.success(response.data.message)
        setModalOpen(false)
        clearmodalErros()
        resetModal()
      }
    } catch (error) {
      console.log(error)
      toast.error("something went wrong")
      setModalLoader(false)
    }
  }

  const tableRows = selectedleadlist || []
  console.log(tableRows)

  return (
    <div className="bg-blue-50 h-auto">
      {(modalloader ||
        loadingState ||
        editloadingState ||
        productLoading ||
        usersLoading ||
        customerLoading) && (
        <BarLoader
          cssOverride={{ width: "100%", height: "4px" }}
          color="#4A90E2"
        />
      )}

      <div className="overflow-y-auto flex justify-center items-center p-3 shadow-xl ">
        <div
          className="bg-white shadow-xl rounded md:w-3/5 "
          style={{
            opacity:
              productLoading || usersLoading || customerLoading ? 0.2 : 1,
            pointerEvents:
              productLoading || usersLoading || customerLoading
                ? "none"
                : "auto",
            transition: "opacity 0.3s ease-in-out"
          }}
        >
          {showmessage && (
            <PopUp
              isOpen={ispopupModalOpen}
              onClose={() => {
                setIspopupModalOpen(false)
                showpopupMessage("")
              }}
              message={showmessage}
            />
          )}

          <form
            onSubmit={handleSubmitMain(onSubmit)}
            className="bg-white p-4"
            style={{ fontFamily: "'Segoe UI', sans-serif" }}
          >
            <div className="bg-white rounded-lg border border-gray-300 shadow-md overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-300">
                <div className="text-sm font-bold px-4 py-1 rounded border-2 text-red-600 border-red-500 bg-white">
                  {process === "Registration" ? "New Lead" : "Edit Lead"}
                </div>
              </div>

              <div className="p-3 md:p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.8fr)_auto] gap-3">
                  <div className="flex flex-col">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Customer Name
                    </label>
                    <div className="flex gap-2 items-stretch">
                      <div className="flex-1 min-w-0">
                        <Select
                          options={customerOptions}
                          isDisabled={!iscustomerchangeandbranch}
                          value={
                            customerOptions.length > 0
                              ? (customerOptions.find(
                                  (o) => o.value === watchMain("customerName")
                                ) ?? null)
                              : null
                          }
                          getOptionLabel={(o) =>
                            `${o.label}-(${o.mobile})-(${o.license})`
                          }
                          getOptionValue={(o) => o._id}
                          filterOption={customFilter}
                          {...registerMain("customerName", {
                            required: "Customer is Required"
                          })}
                          onBlur={() => {
                            const selected = customerOptions.find(
                              (o) => o.value === watchMain("customerName")
                            )
                            if (selected)
                              setValueMain("customerName", selected.value)
                          }}
                          onChange={(sel) => {
                            handleSelectedCustomer(sel)
                            setSelectedCustomer(sel)
                            setValueMain("customerName", sel.value, {
                              shouldValidate: true
                            })
                            setValueMain("netAmount", "")
                            setSelectedLeadList([{ ...emptyRow }])
                            setSelectedLicense(null)
                          }}
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              backgroundColor: "#EEF2F8",
                              borderColor: "#D1D5DB",
                              minHeight: 34,
                              cursor: state.isDisabled
                                ? "not-allowed"
                                : "pointer",
                              opacity: state.isDisabled ? 0.7 : 1
                            }),
                            menuList: (base) => ({ ...base, maxHeight: 200 })
                          }}
                          menuPortalTarget={document.body}
                          menuShouldScrollIntoView={false}
                          className="w-full"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setModalOpen(true)
                          clearMainerrors()
                        }}
                        disabled={isReadOnly}
                        className={`bg-[#1B2A4A] hover:bg-[#243660] text-white text-xs font-bold px-4 rounded flex items-center justify-center ${
                          isReadOnly ? "cursor-not-allowed opacity-70" : ""
                        }`}
                      >
                        NEW
                      </button>
                    </div>
                    {errorsMain.customerName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errorsMain.customerName.message}
                      </p>
                    )}
                  </div>

                  <div className="flex md:justify-end items-end">
                    <select
                      {...registerMain("leadBranch")}
                      disabled={!iscustomerchangeandbranch}
                      onChange={(e) => {
                        setSelectedBranch([e.target.value])
                        setValueMain("customerName", "")
                        setSelectedCustomer(null)
                        setcustomerTableData([])
                        setSelectedLeadList([{ ...emptyRow }])
                        setValueMain("netAmount", "")
                        setSelectedLicense(null)
                      }}
                      className="border border-gray-300 rounded px-3 py-[6px] text-sm bg-[#1B2A4A] hover:bg-[#243660] text-white outline-none min-w-[140px] cursor-pointer"
                    >
                      {companybranches?.map((b, i) => (
                        <option key={i} value={b._id}>
                          {b.branchName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Email id
                    </label>
                    <input
                      {...registerMain("email")}
                      disabled={isReadOnly}
                      placeholder="Email..."
                      className={`w-full border border-gray-300 rounded px-3 py-[7px] text-sm outline-none bg-[#EEF2F8] ${
                        isReadOnly ? "cursor-not-allowed opacity-70" : ""
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Phone Number
                    </label>
                    <input
                      {...registerMain("phone")}
                      disabled={isReadOnly}
                      placeholder="Landline..."
                      className={`w-full border border-gray-300 rounded px-3 py-[7px] text-sm outline-none bg-[#EEF2F8] ${
                        isReadOnly ? "cursor-not-allowed opacity-70" : ""
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Mobile Number
                    </label>
                    <input
                      {...registerMain("mobile")}
                      readOnly={isReadOnly}
                      placeholder="Mobile..."
                      className={`w-full border border-gray-300 rounded px-3 py-[7px] text-sm outline-none bg-[#EEF2F8] ${
                        isReadOnly ? "cursor-not-allowed opacity-70" : ""
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Source of Lead
                    </label>
                    <select
                      {...registerMain("source", {
                        required: "Source is Required"
                      })}
                      className="w-full border border-gray-300 rounded px-3 py-[7px] text-sm outline-none bg-[#EEF2F8]"
                    >
                      <option value="">Select Source</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="instagram">Instagram</option>
                      <option value="facebook">Facebook</option>
                      <option value="Direct">Direct</option>
                    </select>
                    {errorsMain.source && (
                      <p className="text-red-500 text-xs mt-1">
                        {errorsMain.source.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Trade
                    </label>
                    <input
                      {...registerMain("trade")}
                      disabled
                      placeholder="Trade..."
                      className="w-full border border-gray-300 rounded px-3 py-[7px] text-sm outline-none bg-[#EEF2F8] cursor-not-allowed opacity-70"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Associate with
                    </label>
                    <select
                      {...registerMain("partner", {
                        required: "Partnership is Required"
                      })}
                      disabled={isReadOnly}
                      className={`w-full border border-gray-300 rounded px-3 py-[7px] text-sm outline-none bg-[#EEF2F8] ${
                        isReadOnly
                          ? "cursor-not-allowed opacity-70"
                          : "cursor-pointer"
                      }`}
                    >
                      <option value="">Select Partner</option>
                      {partner?.map((p, i) => (
                        <option key={i} value={p._id}>
                          {p.partner}
                        </option>
                      ))}
                    </select>
                    {errorsMain.partner && (
                      <p className="text-red-500 text-xs mt-1">
                        {errorsMain.partner.message}
                      </p>
                    )}
                  </div>
                </div>

                {process !== "edit" && selfAllocation && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Allocation Type
                      </label>
                      <select
                        disabled={!isSelfAllocationChangable}
                        {...registerMain("allocationType", {
                          required: "Allocation type is required"
                        })}
                        className={`w-full border border-gray-300 rounded px-3 py-[7px] text-sm outline-none bg-[#EEF2F8] ${
                          !isSelfAllocationChangable
                            ? "cursor-not-allowed opacity-70"
                            : ""
                        }`}
                      >
                        <option value="followup">Followup</option>
                      </select>
                      {errorsMain.allocationType && (
                        <p className="text-red-500 text-xs mt-1">
                          {errorsMain.allocationType.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        {...registerMain("dueDate", {
                          required: "Due Date is required"
                        })}
                        className="w-full border border-gray-300 rounded px-3 py-[7px] text-sm outline-none bg-[#EEF2F8]"
                      />
                      {errorsMain.dueDate && (
                        <p className="text-red-500 text-xs mt-1">
                          {errorsMain.dueDate.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="border border-gray-300 rounded">
                  <table className="w-full border-collapse text-xs table-fixed">
                    <colgroup>
                      <col style={{ width: "22%" }} />
                      <col style={{ width: "22%" }} />
                      <col style={{ width: "15%" }} />
                      <col style={{ width: "12%" }} />
                      <col style={{ width: "15%" }} />
                      <col style={{ width: "7%" }} />
                      <col style={{ width: "7%" }} />
                    </colgroup>
                    <thead>
                      <tr className="bg-[#1B2A4A] text-white">
                        <th
                          rowSpan={2}
                          className="border border-blue-900 px-2 py-2 text-left text-xs"
                        >
                          License No
                        </th>
                        <th
                          rowSpan={2}
                          className="border border-blue-900 px-2 py-2 text-left text-xs"
                        >
                          Product / Service
                        </th>
                        <th
                          colSpan={3}
                          className="border border-blue-900 px-2 py-2 text-center text-xs"
                        >
                          Price Details
                        </th>
                        <th
                          rowSpan={2}
                          className="border border-blue-900 px-2 py-2 text-center text-xs"
                        >
                          Del
                        </th>
                        <th
                          rowSpan={2}
                          className="border border-blue-900 px-2 py-2 text-center text-xs"
                        >
                          <button
                            type="button"
                            disabled={isReadOnly}
                            onClick={handleAddRowFromTable}
                            title="Add Row"
                            className={`mx-auto flex items-center justify-center w-5 h-5 rounded-full bg-white bg-opacity-20 hover:bg-opacity-40 transition ${
                              isReadOnly ? "cursor-not-allowed opacity-50" : ""
                            }`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </button>
                        </th>
                      </tr>
                      <tr className="bg-[#1B2A4A] text-white">
                        <th className="border border-blue-900 px-2 py-1 text-center text-xs">
                          Amount
                        </th>
                        <th className="border border-blue-900 px-2 py-1 text-center text-xs">
                          Tax %
                        </th>
                        <th className="border border-blue-900 px-2 py-1 text-center text-xs">
                          Net Amt
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableRows.map((item, index) => (
                        <tr
                          key={index}
                          className="border-b even:bg-blue-50 bg-white hover:bg-blue-50 transition-colors"
                        >
                          <td className="border border-gray-300 px-1 py-1">
                            <LicenseDropdown
                              index={index}
                              item={item}
                              isReadOnly={isReadOnly}
                              customerTableData={customerTableData}
                              selectedleadlist={selectedleadlist}
                              setSelectedLeadList={setSelectedLeadList}
                              handleLicenseSelect={handleLicenseSelect}
                            />
                          </td>

                          <td className="border border-gray-300 px-1 py-1">
                            <ProductDropdown
                              index={index}
                              item={item}
                              isReadOnly={isReadOnly}
                              leadList={leadList}
                              selectedleadlist={selectedleadlist}
                              selectedBranch={selectedBranch}
                              setSelectedLeadList={setSelectedLeadList}
                            />
                          </td>

                          <td className="border border-gray-300 px-1 py-1">
                            <input
                              type="number"
                              readOnly={isReadOnly}
                              value={item.productPrice}
                              onChange={(e) =>
                                handlePriceChange(index, e.target.value)
                              }
                              placeholder="0.00"
                              className={`w-full px-2 py-1 border border-gray-200 rounded text-xs outline-none text-center ${
                                isReadOnly
                                  ? "cursor-not-allowed bg-gray-100"
                                  : "bg-white"
                              }`}
                            />
                          </td>

                          <td className="border border-gray-300 px-1 py-1">
                            <input
                              type="number"
                              readOnly={isReadOnly}
                              value={item.hsn}
                              onChange={(e) =>
                                handleHsnChange(index, e.target.value)
                              }
                              placeholder="Tax %"
                              className={`w-full px-2 py-1 border border-gray-200 rounded text-xs outline-none text-center bg-gray-100 ${
                                isReadOnly ? "cursor-not-allowed" : ""
                              }`}
                            />
                          </td>

                          <td className="border border-gray-300 px-1 py-1">
                            <input
                              type="text"
                              readOnly
                              value={item.netAmount}
                              placeholder="0.00"
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs outline-none text-center cursor-not-allowed bg-gray-100"
                            />
                          </td>

                          <td className="border border-gray-300 px-1 py-1 text-center">
                            <button
                              type="button"
                              disabled={isReadOnly}
                              onClick={() => handleDeletetableData(item, index)}
                              className={`text-red-400 hover:text-red-600 p-1 rounded transition-colors ${
                                isReadOnly
                                  ? "cursor-not-allowed opacity-30"
                                  : ""
                              }`}
                              title="Delete row"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3.5 w-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                              </svg>
                            </button>
                          </td>

                          <td className="border border-gray-300" />
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Remark
                    </label>
                    <textarea
                      {...registerMain("remark")}
                      rows={4}
                      disabled={isReadOnly}
                      placeholder="Remarks..."
                      className={`w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none bg-[#EEF2F8] resize-none ${
                        isReadOnly ? "cursor-not-allowed opacity-70" : ""
                      }`}
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:justify-end md:pt-5">
                    {[
                      { label: "Taxable Amount", field: "taxableAmount" },
                      { label: "Tax Amount", field: "taxAmount" },
                      { label: "Net Amount", field: "netAmount" }
                    ].map(({ label, field }) => (
                      <div key={field} className="flex items-center">
                        <span className="text-xs font-bold text-white px-3 py-[7px] bg-[#1B2A4A] rounded-l w-[130px] text-right whitespace-nowrap flex-shrink-0">
                          {label}
                        </span>
                        <input
                          type="number"
                          {...registerMain(field)}
                          readOnly
                          className="flex-1 min-w-0 border border-gray-300 rounded-r px-3 py-[6px] text-sm text-center bg-white outline-none cursor-not-allowed"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {validateError?.duplicate && (
                  <p className="text-red-500 text-xs">
                    {validateError.duplicate}
                  </p>
                )}
                {/* Self allocation / Lead Id + Lead by in same line */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 pt-2">
                  {/* left: self allocation or lead id */}
                  <div className="w-full sm:w-1/2">
                    {process !== "edit" ? (
                      <>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          Self Allocation / Other
                        </label>
                        {/* <select
                          disabled={!isSelfAllocationChangable}
                          {...registerMain("selfAllocation", {
                            setValueAs: (v) => v === "true",
                            validate: (v) =>
                              v === true || v === false
                                ? true
                                : "This field is required",
                            onChange: (e) =>
                              setselfAllocation(e.target.value === "true")
                          })}
                          className={`w-full border border-gray-300 rounded px-3 py-[7px] text-sm outline-none bg-[#EEF2F8] ${
                            !isSelfAllocationChangable
                              ? "cursor-not-allowed opacity-70"
                              : "cursor-pointer"
                          }`}
                        >
                          <option value="">Select</option>
                          {(loggeduser?.department?._id ===
                            "670c866552847bbebbd35748" ||
                            loggeduser?.department?._id ===
                              "670c867352847bbebbd35750") && (
                            <option value="true">Self Allocate</option>
                          )}
                          <option value="false">Allocate To Other</option>
                        </select> */}
                        <select
                          disabled={!isSelfAllocationChangable}
                          {...registerMain("selfAllocation", {
                            setValueAs: (v) => v === "true",
                            validate: (v) =>
                              v === true || v === false
                                ? true
                                : "This field is required",
                            onChange: (e) =>
                              setselfAllocation(e.target.value === "true")
                          })}
                          defaultValue="false" // default is Allocate To Other
                          className={`w-full border border-gray-300 rounded px-3 py-[7px] text-sm outline-none bg-[#EEF2F8] ${
                            !isSelfAllocationChangable
                              ? "cursor-not-allowed opacity-70"
                              : "cursor-pointer"
                          }`}
                        >
                          {/* always allow 'Allocate To Other' */}
                          {canSelfAllocate && (
                            <option value="true">Self Allocate</option>
                          )}
                          <option value="false">Allocate To Other</option>
                        </select>
                        {errorsMain.selfAllocation && (
                          <p className="text-red-500 text-xs mt-1">
                            {errorsMain.selfAllocation.message}
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          Lead Id
                        </label>
                        <input
                          {...registerMain("leadId")}
                          disabled
                          placeholder="Lead Id..."
                          className="w-full border border-gray-300 rounded px-3 py-[7px] text-sm outline-none bg-[#EEF2F8] cursor-not-allowed opacity-70"
                        />
                      </>
                    )}
                  </div>

                  {/* right: lead by */}
                  <div className="w-full sm:w-1/2 flex justify-start sm:justify-end">
                    {editMode ? (
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-gray-600 italic whitespace-nowrap">
                          Lead by:
                        </label>
                        <select
                          {...registerMain("leadBy")}
                          className="border border-gray-300 rounded px-2 py-1 text-sm bg-[#EEF2F8] outline-none"
                        >
                          {allstaff?.map((u) => (
                            <option key={u._id} value={u._id}>
                              {u.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <input type="hidden" {...registerMain("leadBy")} />
                        <p className="text-sm italic text-gray-500 whitespace-nowrap">
                          Lead by:{" "}
                          <span className="font-semibold text-[#1B2A4A]">
                            {loggeduser?.name}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* {process !== "edit" ? (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Self Allocation / Other
                    </label>
                    <select
                      disabled={!isSelfAllocationChangable}
                      {...registerMain("selfAllocation", {
                        setValueAs: (v) => v === "true",
                        validate: (v) =>
                          v === true || v === false
                            ? true
                            : "This field is required",
                        onChange: (e) =>
                          setselfAllocation(e.target.value === "true")
                      })}
                      className={`w-full border border-gray-300 rounded px-3 py-[7px] text-sm outline-none bg-[#EEF2F8] ${
                        !isSelfAllocationChangable
                          ? "cursor-not-allowed opacity-70"
                          : "cursor-pointer"
                      }`}
                    >
                      <option value="">Select</option>
                      {(loggeduser?.department?._id ===
                        "670c866552847bbebbd35748" ||
                        loggeduser?.department?._id ===
                          "670c867352847bbebbd35750") && (
                        <option value="true">Self Allocate</option>
                      )}
                      <option value="false">Allocate To Other</option>
                    </select>
                    {errorsMain.selfAllocation && (
                      <p className="text-red-500 text-xs mt-1">
                        {errorsMain.selfAllocation.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Lead Id
                    </label>
                    <input
                      {...registerMain("leadId")}
                      disabled
                      placeholder="Lead Id..."
                      className="w-full border border-gray-300 rounded px-3 py-[7px] text-sm outline-none bg-[#EEF2F8] cursor-not-allowed opacity-70"
                    />
                  </div>
                )} */}

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-2">
                  <div>
                    {validateError?.emptyleadData && (
                      <p className="text-red-500 text-xs">
                        {validateError.emptyleadData}
                      </p>
                    )}
                    {validateError?.readonlyError && (
                      <p className="text-red-500 text-xs">
                        {validateError.readonlyError}
                      </p>
                    )}
                    <button
                      type="submit"
                      className="bg-[#1B2A4A] hover:bg-[#243660] text-white py-2 px-8 rounded text-sm font-semibold tracking-wide transition-colors mt-1"
                    >
                      {process === "Registration" ? "SUBMIT" : "UPDATE"}
                    </button>
                  </div>
                  {/* <div className="flex items-center gap-2">
                    {editMode ? (
                      <>
                        <label className="text-xs font-semibold text-gray-600 italic whitespace-nowrap">
                          Lead by:
                        </label>
                        <select
                          {...registerMain("leadBy")}
                          className="border border-gray-300 rounded px-2 py-1 text-sm bg-[#EEF2F8] outline-none"
                        >
                          {allstaff?.map((u) => (
                            <option key={u._id} value={u._id}>
                              {u.name}
                            </option>
                          ))}
                        </select>
                      </>
                    ) : (
                      <>
                        <input type="hidden" {...registerMain("leadBy")} />
                        <p className="text-sm italic text-gray-500">
                          Lead by:{" "}
                          <span className="font-semibold text-[#1B2A4A]">
                            {loggeduser?.name}
                          </span>
                        </p>
                      </>
                    )}
                  </div> */}
                </div>
              </div>
            </div>
          </form>

          {popupOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white p-4 rounded shadow-md text-center">
                <p className="text-orange-500">{popupMessage}</p>
                <button
                  onClick={handlePopupOk}
                  className="bg-blue-500 text-white px-4 py-1 rounded mt-3 text-center"
                >
                  OK
                </button>
              </div>
            </div>
          )}

          {modalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center px-4 z-50">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="bg-[#1B2A4A] px-6 py-4 flex items-center justify-between flex-shrink-0">
                  <div>
                    <h2 className="text-white text-base font-bold tracking-wide">
                      Add New Customer
                    </h2>
                    <p className="text-blue-300 text-xs mt-0.5">
                      Fill in the details to register a new customer
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setModalOpen(false)
                      clearmodalErros()
                      resetModal()
                    }}
                    className="text-blue-200 hover:text-white hover:bg-white hover:bg-opacity-10 rounded-full p-1.5 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <form
                  onSubmit={handleSubmitModal(onmodalsubmit)}
                  className="overflow-y-auto flex-1 px-6 py-4"
                >
                  <p className="text-[10px] font-bold text-[#1B2A4A] uppercase tracking-widest mb-2 border-b border-gray-200 pb-1">
                    Basic Information
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Customer Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...registerModal("customerName", {
                          required: "Customer Name is required"
                        })}
                        onBlur={(e) =>
                          setValueModal("customerName", e.target.value.trim())
                        }
                        placeholder="Customer Name"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A] bg-gray-50 transition"
                      />
                      {errorsModal.customerName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errorsModal.customerName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        {...registerModal("email")}
                        placeholder="Email"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A] bg-gray-50 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Mobile <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        {...registerModal("mobile", {
                          required: "Mobile is Required",
                          validate: (value) => {
                            const cleaned = value
                              .replace(/^\+?91/, "")
                              .replace(/\D/g, "")
                            if (cleaned.length !== 10)
                              return "Must be 10 digits after country code"
                            return true
                          }
                        })}
                        onBlur={(e) =>
                          setValueModal("mobile", e.target.value.trim())
                        }
                        placeholder="Mobile"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A] bg-gray-50 transition"
                      />
                      {errorsModal.mobile && (
                        <p className="text-red-500 text-xs mt-1">
                          {errorsModal.mobile.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Landline
                      </label>
                      <input
                        type="tel"
                        {...registerModal("landline")}
                        onBlur={(e) =>
                          setValueModal("landline", e.target.value.trim())
                        }
                        placeholder="Landline"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A] bg-gray-50 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Contact Person <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...registerModal("contactPerson", {
                          required: "Contact person is Required"
                        })}
                        onBlur={(e) =>
                          setValueModal("contactPerson", e.target.value.trim())
                        }
                        placeholder="Contact Person"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A] bg-gray-50 transition"
                      />
                      {errorsModal.contactPerson && (
                        <p className="text-red-500 text-xs mt-1">
                          {errorsModal.contactPerson.message}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Address
                      </label>
                      <textarea
                        {...registerModal("address1")}
                        onBlur={(e) =>
                          setValueModal("address1", e.target.value.trim())
                        }
                        placeholder="Address"
                        rows={2}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A] bg-gray-50 transition resize-none"
                      />
                    </div>
                  </div>

                  <p className="text-[10px] font-bold text-[#1B2A4A] uppercase tracking-widest mb-2 border-b border-gray-200 pb-1">
                    Location
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Country
                      </label>
                      <Select
                        options={countryOptions}
                        value={selectedCountry}
                        getOptionLabel={(o) => o.label}
                        getOptionValue={(o) => o.value}
                        {...registerModal("country")}
                        onChange={(option) => {
                          setSelectedCountry(option)
                          setValueModal("country", option.value)
                        }}
                        menuPortalTarget={document.body}
                        menuShouldScrollIntoView={false}
                        styles={{
                          control: (base) => ({
                            ...base,
                            border: "1px solid #D1D5DB",
                            borderRadius: "0.5rem",
                            backgroundColor: "#F9FAFB",
                            boxShadow: "none",
                            minHeight: 38,
                            fontSize: 14,
                            "&:hover": { borderColor: "#1B2A4A" }
                          }),
                          menuList: (base) => ({ ...base, maxHeight: 200 })
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        State
                      </label>
                      <Select
                        options={stateOptions}
                        value={selectedState}
                        getOptionLabel={(o) => o.label}
                        getOptionValue={(o) => o.value}
                        {...registerModal("state")}
                        onChange={(option) => {
                          setSelectedState(option)
                          setValueModal("state", option.value)
                        }}
                        isDisabled={!selectedCountry}
                        menuPortalTarget={document.body}
                        menuShouldScrollIntoView={false}
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            border: "1px solid #D1D5DB",
                            borderRadius: "0.5rem",
                            backgroundColor: state.isDisabled
                              ? "#F3F4F6"
                              : "#F9FAFB",
                            boxShadow: "none",
                            minHeight: 38,
                            fontSize: 14,
                            "&:hover": { borderColor: "#1B2A4A" }
                          }),
                          menuList: (base) => ({ ...base, maxHeight: 200 })
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        {...registerModal("city")}
                        onBlur={(e) =>
                          setValueModal("city", e.target.value.trim())
                        }
                        placeholder="City"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A] bg-gray-50 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Pincode
                      </label>
                      <input
                        type="text"
                        {...registerModal("pincode")}
                        onBlur={(e) =>
                          setValueModal("pincode", e.target.value.trim())
                        }
                        placeholder="Pincode"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A] bg-gray-50 transition"
                      />
                    </div>
                  </div>

                  <p className="text-[10px] font-bold text-[#1B2A4A] uppercase tracking-widest mb-2 border-b border-gray-200 pb-1">
                    Business Information
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Industry <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...registerModal("industry", {
                          required: "Industry is required"
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1B2A4A] bg-gray-50 cursor-pointer transition"
                      >
                        <option value="">Select Industry</option>
                        {Industries.map((industry, index) => (
                          <option key={index} value={industry}>
                            {industry}
                          </option>
                        ))}
                      </select>
                      {errorsModal.industry && (
                        <p className="text-red-500 text-xs mt-1">
                          {errorsModal.industry.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Partnership Type
                      </label>
                      <select
                        {...registerModal("partner")}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1B2A4A] bg-gray-50 cursor-pointer transition"
                      >
                        <option value="">Select Partner</option>
                        {partner?.map((p, i) => (
                          <option key={i} value={p._id}>
                            {p.partner}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Registration Type
                      </label>
                      <select
                        {...registerModal("registrationType")}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1B2A4A] bg-gray-50 cursor-pointer transition"
                      >
                        <option value="">Select Type</option>
                        <option value="unregistered">
                          Unregistered / Consumer
                        </option>
                        <option value="regular">Regular</option>
                      </select>
                    </div>
                    {registrationType === "regular" && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          GSTIN / UIN <span className="text-red-500">*</span>
                        </label>
                        <input
                          {...registerModal("gstNo", {
                            required: "GST is required"
                          })}
                          placeholder="e.g. 22AAAAA0000A1Z5"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A] bg-gray-50 transition"
                        />
                        {errorsModal.gstNo && (
                          <p className="text-red-500 text-xs mt-1">
                            {errorsModal.gstNo.message}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setModalOpen(false)
                        clearmodalErros()
                        resetModal()
                      }}
                      className="px-5 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-lg bg-[#1B2A4A] hover:bg-[#243660] text-white text-sm font-semibold tracking-wide transition"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LeadMaster
