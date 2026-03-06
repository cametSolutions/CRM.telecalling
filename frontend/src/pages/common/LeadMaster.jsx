import { useEffect, useState, useMemo, useRef } from "react"
import { Country, State } from "country-state-city"
import BarLoader from "react-spinners/BarLoader"
import Select from "react-select"
import { useForm } from "react-hook-form"
import PopUp from "../../components/common/PopUp"
import { toast } from "react-toastify"
import UseFetch from "../../hooks/useFetch"
import api from "../../api/api"

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
  // For modal form
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
  const { data: companybranches } = UseFetch("/branch/getBranch")
  const { data: partners } = UseFetch("/customer/getallpartners")
  const { data: serviceData } = UseFetch(
    loggeduser &&
      selectedBranch &&
      `/product/getallServices?branchselected=${selectedBranch}`
  )
  const { data: alluser, loading: usersLoading } = UseFetch("/auth/getallUsers")
  const {
    data: customerData,
    loading: customerLoading,
    refreshHook
  } = UseFetch(
    loggeduser &&
      selectedBranch &&
      `/customer/getallCustomer?branchSelected=${selectedBranch}`
  )
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
  }, [loggeduser, branches, productData, serviceData, partners, selectedBranch]) //here dependency partners is not state its usefetch data for partners

  // Close dropdown when clicking outside
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
      setValueMain("leadBy", loggeduser._id) // Manually set the value
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
      if (Data[0]?.selfAllocation) {
        setselfAllocationChangable(false)
      }
      // if (Data[0].activityLog.length === 2) {
      //   const allocatedtoData =
      //     Data[0].activityLog[Data[0].activityLog.length - 1]
      //   if (allocatedtoData.taskallocatedBy === loggeduser._id) {
      //     setselfAllocationChangable(true)
      //   } else {
      //     setselfAllocationChangable(false)
      //   }
      // } else if (Data[0].activityLog.length > 2) {
      //   setselfAllocationChangable(false)
      // }
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
      setSelectedLeadList(leadData)
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
            groupedByLicenseNumber[lead.licenseNumber] = [] // create array if not exist
          }
          leadList?.forEach((product) => {
            const existingIndex = groupedByLicenseNumber[
              lead.licenseNumber
            ].findIndex((item) => item._id === product._id)

            if (existingIndex !== -1) {
              // If already exists, just update 'selected' flag
              if (lead.productorServiceId._id === product._id) {
                groupedByLicenseNumber[lead.licenseNumber][
                  existingIndex
                ].selected = product._id === lead.productorServiceId._id
              }
            } else {
              // If not exists, push new product with correct selected
              const item = {
                ...product,
                selected: product._id === lead.productorServiceId._id,
                selectedArray: product.selected
              }
              groupedByLicenseNumber[lead.licenseNumber].push(item)
            }
          })
          return groupedByLicenseNumber
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

      // Combine allusers and allAdmins
      const combinedUsers = [...allusers, ...allAdmins]

      // Set combined names to state
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
    // Ensure all products are initialized for this license if not already
    if (!productOrserviceSelections[license]) {
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
    setIslicenseOpen(false) // Close dropdown
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
    setIsleadForOpen((prev) => !prev) // Toggle dropdown visibility
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

  // const handleHsnChange=(index,newHsn)=>{
  // selectedleadlist((prevList)=>
  // prevList.map((product,i)=>
  // i===index?{
  // ...product,
  // hsn:newHsn,
  // netAmount:(Number(product.productPrice)+(newHsn/100)*Number(product.productPrice).toFixed(2)}:product)}))}
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

    // return
    const filteredLeadlist = selectedleadlist.filter(
      (item, index) => index !== indexNum
    )
    setSelectedLeadList(filteredLeadlist)
  }

  const customFilter = (option, inputValue) => {
    if (!inputValue) return true
    // Convert to lowercase for case-insensitive search
    const searchValue = inputValue.toLowerCase()
    const label = option.label ? String(option.label).toLowerCase() : "" // Ensure label is a string
    // const label = option.label ? option.label.toLowerCase() : ""
    const mobile = option.data?.mobile ? option.data?.mobile.toLowerCase() : ""
    return (
      label.includes(searchValue) || // Search by name
      mobile.includes(searchValue) // Search by mobile number
    )
  }
  const calculateTotalAmount = () => {
    return selectedleadlist
      .reduce((total, product) => {
        return total + (Number(product.netAmount) || 0) // Ensure price is a number and handle null values
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
  console.log(selectedleadlist)
  const handleAddProducts = () => {
    setIsleadForOpen(false)
    if (validateError.emptyleadData) {
      setValidateError((prev) => ({
        ...prev,
        emptyleadData: ""
      }))
    }
    if (validateError.readonlyError) {
      setValidateError((prev) => ({
        ...prev,
        readonlyError: ""
      }))
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
              // netAmount:
              //   item?.productPrice +
              //   (Number(item?.selectedArray[0]?.hsn_id?.onValue?.igstRate) /
              //     100) *
              //     item?.productPrice
            }
          })

        // Filter out products that are already added for the selected license
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

        // Filter out products that are already added (without license)
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
      return updatedList
    })
  }
  console.log("hhhh")
  console.log(selectedleadlist)
  const validateLeadData = async (leadData, selectedleadlist, role) => {
    console.log("HHhhh")
    const result = await api.get("/lead/checkexistinglead", {
      params: {
        leadData,
        selectedleadlist,
        role
      }
    })
    console.log(result.data)

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
    console.log(result.data.message)
    setPopupMessage(result.data.message)

    return isEligible
  }
  console.log(selectedleadlist)
  const onSubmit = async (data) => {
    try {
      if (process === "Registration") {
        if (selectedleadlist.length === 0) {
          setValidateError((prev) => ({
            ...prev,
            emptyleadData: "No Lead generated do it"
          }))
          return
        }
        const filteredleadlist = selectedleadlist.filter(
          (item) => item.productorServiceId && item.productorServiceId !== ""
        )
        console.log(filteredleadlist)
        const validation = await validateLeadData(
          data,
          filteredleadlist,
          loggeduser.role
        )
        console.log(validation.message)
        setFormData(data)
        setPopupMessage(validation.message)
        if (validation.message === "") {
          handlePopupOk(true, data)
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
          return
        }

        seteditLoadingState(true)
        await handleEditData(data, selectedleadlist, Data[0]?._id)
      }
      // Refetch the product data
    } catch (error) {
      console.log("error on onsubmit:", error)
      toast.error("Failed to add product!")
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
    return number.replace(/\D/g, "").slice(-10) // Keep only last 10 digits
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
  return (
    <div className="bg-gray-100 h-auto">
      {(modalloader ||
        loadingState ||
        editloadingState ||
        productLoading ||
        usersLoading ||
        customerLoading) && (
        <BarLoader
          cssOverride={{ width: "100%", height: "4px" }} // Tailwind's `h-4` corresponds to `16px`
          color="#4A90E2" // Change color as needed
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

          {/* <form onSubmit={handleSubmitMain(onSubmit)} className="">
            <div className="md:flex items-start">
              <div className="md:w-1/2  grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 md:mr-2">
                <div>
                  <label
                    htmlFor="leadBranch"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Branch
                  </label>
                  <select
                    id="leadBranch"
                    disabled={!iscustomerchangeandbranch}
                    {...registerMain("leadBranch")}
                    onChange={
                      (e) => {
                        setSelectedBranch([e.target.value])
                        setValueMain("customerName", "") // Clear customer in the form
                        setSelectedCustomer(null)
                        setcustomerTableData([])
                        setSelectedLeadList([])
                        setValueMain("netAmount", "")
                        setSelectedLicense(null)
                      } // Update state on change
                    }
                    className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none ${
                      iscustomerchangeandbranch
                        ? ""
                        : "cursor-not-allowed bg-gray-100 text-black"
                    }`}
                  >
                    <option value="">Select Branch</option>
                    {companybranches?.map((branch, index) => (
                      <option key={index} value={branch._id}>
                        {branch.branchName}
                      </option>
                    ))}
                  </select>
                </div>

              
                <div>
                  <label
                    htmlFor="customerName"
                    className="block text-sm  font-medium text-gray-700"
                  >
                    Customer Name
                  </label>
                  <div className="flex w-full text-sm mt-1">
                    <Select
                      options={customerOptions}
                      isDisabled={!iscustomerchangeandbranch}
                      value={
                        customerOptions.length > 0
                          ? customerOptions.find(
                              (option) =>
                                option.value === watchMain("customerName")
                            ) ?? null
                          : null
                      }
                      getOptionLabel={(option) =>
                        `${option.label}-(${option.mobile})-(${option.license})`
                      } // Show only customer name
                      getOptionValue={(option) => option._id}
                      filterOption={customFilter} // Enable searching by name & mobile
                      {...registerMain("customerName", {
                        required: "Customer is Required"
                      })}
                      onBlur={() => {
                        const selected = customerOptions.find(
                          (option) => option.value === watchMain("customerName")
                        )
                        if (selected) {
                          setValueMain("customerName", selected.value)
                        }
                      }}
                      onChange={(selectedOption) => {
                        handleSelectedCustomer(selectedOption)
                        setSelectedCustomer(selectedOption)
                        setValueMain("customerName", selectedOption.value, {
                          shouldValidate: true
                        })
                        setValueMain("netAmount", "")
                        setSelectedLeadList([])
                        setSelectedLicense(null)
                      }}
                      className={`w-full ${
                        iscustomerchangeandbranch
                          ? "cursor-pointer"
                          : "cursor-not-allowed bg-gray-100 text-black"
                      }`}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          cursor: state.isDisabled ? "not-allowed" : "pointer",
                          backgroundColor: state.isDisabled
                            ? "#f3f4f6"
                            : "white",

                          opacity: state.isDisabled ? 0.7 : 1
                        }),
                        singleValue: (base, state) => ({
                          ...base,
                          color: state.isDisabled ? "#4b5563" : "#111827",
                          cursor: state.isDisabled ? "not-allowed" : "pointer",
                          userSelect: state.isDisabled ? "none" : "auto",
                          // ensure text doesn't show caret on hover
                          WebkitUserSelect: state.isDisabled ? "none" : "auto"
                        }),
                        menu: (provided) => ({
                          ...provided,
                          maxHeight: "200px", // Set dropdown max height
                          overflowY: "auto" // Enable scrolling
                        }),
                        menuList: (provided) => ({
                          ...provided,
                          maxHeight: "200px", // Ensures dropdown scrolls internally
                          overflowY: "auto"
                        })
                      }}
                      menuPortalTarget={document.body} // Prevents nested scrolling issues
                      menuShouldScrollIntoView={false}
                    />

                    <button
                      type="button" // Prevents form submission
                      onClick={() => {
                        setModalOpen(true)
                        clearMainerrors()
                      }}
                      className={` border  bg-blue-600 hover:bg-blue-700 text-white text-left rounded px-3 py-[0.30rem] text-lg  flex justify-between items-center ${
                        isReadOnly ? "cursor-not-allowed " : ""
                      } `}
                    >
                      NEW
                    </button>
                  </div>
                  {errorsMain.customerName && (
                    <p className="text-red-500 text-sm">
                      {errorsMain.customerName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="mobile"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mobile
                  </label>
                  <input
                    id="mobile"
                    readOnly={isReadOnly}
                    {...registerMain("mobile")}
                    className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none focus:outline-none ${
                      isReadOnly
                        ? "cursor-not-allowed bg-gray-100 text-black"
                        : ""
                    }`}
                    placeholder="Mobile..."
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone
                  </label>
                  <input
                    id="phone"
                    disabled={isReadOnly}
                    {...registerMain("phone")}
                    className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none focus:outline-none ${
                      isReadOnly
                        ? "cursor-not-allowed bg-gray-100 text-black"
                        : ""
                    }`}
                    placeholder="Landline..."
                  ></input>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    disabled={isReadOnly}
                    {...registerMain("email")}
                    className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none focus:border-gray-500 ${
                      isReadOnly
                        ? "cursor-not-allowed bg-gray-100 text-black"
                        : ""
                    }`}
                    placeholder="Email..."
                  ></input>
                </div>

                <div>
                  <label
                    htmlFor="trade"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Trade
                  </label>
                  <input
                    id="trade"
                    disabled
                    {...registerMain("trade")}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm cursor-not-allowed"
                    placeholder="Trade..."
                  />
                </div>
                <div>
                  <label
                    htmlFor="remark"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Remark
                  </label>
                  <textarea
                    id="description"
                    {...registerMain("remark")}
                    className={`block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm  focus:outline-none  max-h-[100p] ${
                      isReadOnly
                        ? "cursor-not-allowed bg-gray-100 text-black"
                        : ""
                    }`}
                    placeholder="Remarks..."
                  />
                </div>
                {process !== "edit" && (
                  <>
                    <div>
                      <label
                        htmlFor="selfAllocation"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Self Allocation/Other
                      </label>
                      <select
                        disabled={!isSelfAllocationChangable}
                        {...registerMain("selfAllocation", {
                          setValueAs: (value) => value === "true",
                          validate: (value) =>
                            value === true || value === false
                              ? true
                              : "This field is requireded",
                          onChange: (e) =>
                            setselfAllocation(e.target.value === "true")
                        })}
                        className={`w-full border border-gray-300 rounded-md p-2 focus:outline-none ${
                          isSelfAllocationChangable
                            ? "cursor-pointer"
                            : "bg-gray-200 cursor-not-allowed"
                        }
                    `}
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
                        <p className="text-red-500 text-sm">
                          {errorsMain.selfAllocation.message}
                        </p>
                      )}
                    </div>
                    {selfAllocation && (
                      <>
                        {" "}
                        <div>
                          <label
                            htmlFor="allocationType"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Allocation Type
                          </label>
                          <select
                            disabled={!isSelfAllocationChangable}
                            {...registerMain("allocationType", {
                              required: "Allocation type is required"
                            })}
                            className={`w-full focus:outline-none rounded-md py-1 border border-gray-300 px-2 ${
                              isSelfAllocationChangable
                                ? ""
                                : "bg-gray-200 cursor-not-allowed"
                            }`}
                          >
                            <option value="followup">Followup</option>
                          </select>
                          {errorsMain.allocationType && (
                            <p className="text-red-500 text-sm">
                              {errorsMain.allocationType.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="dueDate"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Due Date
                          </label>
                          <input
                            type="date"
                            {...registerMain("dueDate", {
                              required: "Due Date is required"
                            })}
                            className="w-full focus:outline-none rounded-md py-1 border border-gray-300 px-2"
                          />

                          {errorsMain.dueDate && (
                            <p className="text-red-500 text-sm">
                              {errorsMain.dueDate.message}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </>
                )}

                <div className="">
                  <label
                    htmlFor="partner"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Partnership Type
                  </label>
                  <select
                    id="partner"
                    disabled={isReadOnly}
                    {...registerMain("partner", {
                      required: "Partnership is Required"
                    })}
                    className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:outline-none  ${
                      isReadOnly
                        ? "cursor-not-allowed bg-gray-100"
                        : "cursor-pointer"
                    }`}
                  >
                    <option value="">Select Partner</option>
                    {partner?.map((partnr, index) => (
                      <option key={index} value={partnr._id}>
                        {partnr.partner}
                      </option>
                    ))}
                  </select>
                  {errorsMain.partner && (
                    <p className="text-red-500 text-sm">
                      {errorsMain.partner.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="md:ml-2  md:w-1/2">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:gap-4">
                  {process === "edit" && (
                    <div>
                      <label
                        htmlFor="leadId"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Lead Id
                      </label>
                      <input
                        id="leadId"
                        disabled
                        type="text"
                        {...registerMain("leadId")}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none bg-gray-100 cursor-not-allowed"
                        placeholder="Lead Id..."
                      />
                      {errorsMain.leadId && (
                        <span className="mt-2 text-sm text-red-600">
                          {errorsMain.leadId.message}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="w-full relative " ref={dropdownLicenseRef}>
                    <label className="block text-sm font-medium text-gray-700">
                      Select License
                    </label>
                    <button
                      type="button"
                      disabled={isReadOnly}
                      onClick={() => setIslicenseOpen(!isLicenseOpen)}
                      className={`mt-1 border px-2 md:py-1.5 py-2 w-full text-left rounded flex justify-between items-center ${
                        isReadOnly
                          ? "cursor-not-allowed bg-gray-100 text-gray-500"
                          : ""
                      }`}
                    >
                      {selectedLicense ?? "Select License"}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 transition-transform duration-200"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {isLicenseOpen && (
                      <div className=" w-full mt-1 bg-white border rounded-md shadow-lg z-30  max-h-60 absolute overflow-y-auto ">
                        <ul className="">
                          <li
                            className="p-2 hover:bg-gray-200 cursor-pointer font-semibold text-red-500"
                            onClick={() => handleLicenseSelect(null)}
                          >
                            No License
                          </li>

                          {customerTableData?.map((item, index) => (
                            <li
                              key={item.licenseNumber || index}
                              className="p-2 hover:bg-gray-200 cursor-pointer"
                              onClick={() =>
                                handleLicenseSelect(item.licenseNumber)
                              }
                            >
                              {`${item.licenseNumber} - ${item.productName}`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="relative " ref={dropdownLeadforRef}>
                    <label
                      htmlFor="leadFor"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Lead for
                    </label>

                    <div className="flex items-center ">
                      <button
                        type="button"
                        disabled={isReadOnly}
                        onClick={handleToggleDropdown}
                        className={`mt-1 border px-2 md:py-1.5  py-2 w-full text-left rounded flex justify-between items-center ${
                          isReadOnly
                            ? "cursor-not-allowed bg-gray-100 text-gray-500"
                            : ""
                        }`}
                      >
                        Product/Services
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 transition-transform duration-200"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      <button
                        type="button"
                        onClick={handleAddProducts}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-lg"
                      >
                        ADD
                      </button>
                    </div>
                    {isleadForOpen && (
                      <div className="absolute w-full z-30 left-0 mt-2 md:w-80 border bg-white shadow-lg rounded-md p-2 max-h-40 overflow-y-auto">
                        {selectedLicense &&
                          leadList?.map((item) => {
                            const currentProductState =
                              productOrserviceSelections[selectedLicense]?.find(
                                (p) => p._id === item._id
                              ) || {
                                selected: false
                              }

                            return (
                              <label
                                key={item._id}
                                className="flex items-center space-x-2 mb-1"
                              >
                                <input
                                  type="checkbox"
                                  checked={currentProductState.selected}
                                  onChange={() =>
                                    handleProductORserviceSelect(item._id)
                                  }
                                  className="form-checkbox"
                                />
                                <span>
                                  {item.productName || item.serviceName}
                                </span>
                              </label>
                            )
                          })}
                        {!selectedLicense &&
                          leadList?.map((item) => {
                            const currentProductState =
                              licensewithoutProductSelection?.find(
                                (p) => p._id === item._id
                              ) || { selected: false }
                            return (
                              <label
                                key={item._id}
                                className="flex items-center space-x-2 mb-1"
                              >
                                <input
                                  type="checkbox"
                                  checked={currentProductState.selected}
                                  onChange={() =>
                                    handleProductORserviceSelect(item._id)
                                  }
                                  className="form-checkbox"
                                />
                                <span>
                                  {item.productName || item.serviceName}
                                </span>
                              </label>
                            )
                          })}
                      </div>
                    )}
                  </div>
                </div>

                {selectedleadlist && selectedleadlist.length > 0 && (
                  <div className="mt-4 bg-white border rounded-md overflow-hidden">
                    <div className="max-h-[200px] overflow-y-auto">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-sm">
                          <thead
                            className={`bg-gray-100 ${
                              popupOpen ? "" : "sticky top-0 z-10"
                            }`}
                          >
                            <tr>
                              <th
                                rowSpan="2"
                                className="border border-gray-300 px-3 py-2 text-left font-medium text-gray-700 whitespace-nowrap"
                              >
                                License No
                              </th>
                              <th
                                rowSpan="2"
                                className="border border-gray-300 px-3 py-2 text-left font-medium text-gray-700 whitespace-nowrap"
                              >
                                Product/Service
                              </th>
                              <th
                                colSpan="3"
                                className="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700 "
                              >
                                Price Details
                              </th>
                              <th
                                rowSpan="2"
                                className="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700"
                              >
                                Action
                              </th>
                            </tr>
                            <tr>
                              <th className="border border-gray-300 px-3 py-2 text-center font-medium text-gray-600 bg-gray-50 whitespace-nowrap min-w-24">
                                Price
                              </th>
                              <th className="border border-gray-300 px-3 py-2 text-center font-medium text-gray-600 bg-gray-50 whitespace-nowrap min-w-20">
                                Tax
                              </th>
                              <th className="border border-gray-300 px-3 py-2 text-center font-medium text-gray-600 bg-gray-50 whitespace-nowrap">
                                Price Incl. Tax
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedleadlist.map((item, index) => (
                              <tr
                                key={index}
                                className="border-b even:bg-gray-50 hover:bg-gray-100 transition-colors"
                              >
                                <td className="border border-gray-300 px-3 py-2 whitespace-nowrap">
                                  {item.licenseNumber || "Not Selected"}
                                </td>
                                <td className="border border-gray-300 px-3 py-2 whitespace-nowrap">
                                  {item.productorServiceName}
                                </td>

                                <td className="border border-gray-300 px-2 py-2">
                                  <input
                                    type="number"
                                    readOnly={isReadOnly}
                                    value={item.productPrice}
                                    onChange={(e) =>
                                      handlePriceChange(index, e.target.value)
                                    }
                                    className={`w-full px-2 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                      isReadOnly
                                        ? "cursor-not-allowed bg-gray-100 text-gray-700"
                                        : "bg-white"
                                    }`}
                                    placeholder="0.00"
                                  />
                                </td>

                                <td className="border border-gray-300 px-2 py-2">
                                  <input
                                    type="number"
                                    value={item.hsn}
                                    onChange={(e) =>
                                      handleHsnChange(index, e.target.value)
                                    }
                                    className={`w-full px-2 py-1 border rounded-md text-sm focus:outline-none bg-gray-100 text-gray-700 ${
                                      isReadOnly ? "cursor-not-allowed" : ""
                                    }`}
                                    placeholder="HSN"
                                    readOnly={isReadOnly}
                                  />
                                </td>

                                <td className="border border-gray-300 px-2 py-2">
                                  <input
                                    type="text"
                                    value={item.netAmount}
                                    className="w-full px-2 py-1 border rounded-md text-sm focus:outline-none cursor-not-allowed bg-gray-100 text-gray-700"
                                    placeholder="0.00"
                                    readOnly
                                  />
                                </td>

                                <td className="border border-gray-300 px-3 py-2 text-center">
                                  <button
                                    type="button"
                                    disabled={isReadOnly}
                                    onClick={() =>
                                      handleDeletetableData(item, index)
                                    }
                                    className={`text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors duration-200 ${
                                      isReadOnly ? "cursor-not-allowed" : ""
                                    }`}
                                    title="Delete Product"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                    >
                                      <path d="M3 6h18" />
                                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                    </svg>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:gap-4">
                  <div>
                    <label
                      htmlFor="leadBy"
                      className="block text-sm font-medium text-gray-700"
                    >
                      LeadBy
                    </label>
                    {editMode ? (
                      <select
                        id="leadBy"
                        {...registerMain("leadBy")}
                        className={`mt-1 w-full border rounded-md p-2  ${
                          isReadOnly
                            ? "cursor-not-allowed bg-gray-100 text-black"
                            : ""
                        }`}
                      >
                        {allstaff?.map((user) => (
                          <option key={user._id} value={user._id}>
                            {user.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <>
                        <input type="hidden" {...registerMain("leadBy")} />
                        <p className="mt-1 w-full border rounded-md p-2 cursor-not-allowed bg-gray-100  border-gray-300">
                          {loggeduser?.name}
                        </p>
                      </>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tax Amount
                    </label>
                    <input
                      type="number"
                      id="taxAmount"
                      {...registerMain("taxAmount")}
                      readOnly // Make it non-editable
                      // value={calculateTotalAmount()} // Auto-updates with total price
                      className="mt-1 w-full border rounded-md p-2 focus:outline-none bg-gray-100 cursor-not-allowed border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Taxable Amount
                    </label>
                    <input
                      type="number"
                      id="taxableAmount"
                      {...registerMain("taxableAmount")}
                      readOnly // Make it non-editable
                      // value={calculateTotalAmount()} // Auto-updates with total price
                      className="mt-1 w-full border rounded-md p-2 focus:outline-none bg-gray-100 cursor-not-allowed border-gray-300"
                      // placeholder="Net Amount"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Net Amount
                    </label>
                    <input
                      type="number"
                      id="netAmount"
                      {...registerMain("netAmount")}
                      readOnly // Make it non-editable
                      // value={calculateTotalAmount()} // Auto-updates with total price
                      className="mt-1 w-full border rounded-md p-2 focus:outline-none bg-gray-100 cursor-not-allowed border-gray-300"
                      placeholder="Net Amount"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="justify-center items-center text-center mt-4 ">
              <div>
                {validateError.emptyleadData && (
                  <p className="text-red-500 text-sm">
                    {validateError.emptyleadData}
                  </p>
                )}
                {validateError.readonlyError && (
                  <p className="text-red-500 text-sm">
                    {validateError.readonlyError}
                  </p>
                )}
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 mt-3 rounded hover:bg-blue-700"
                >
                  {process === "Registration" ? "SUBMIT" : "UPDATE"}
                </button>
              </div>
            </div>
          </form> */}

          <form
            onSubmit={handleSubmitMain(onSubmit)}
            className="bg-white p-4"
            style={{ fontFamily: "'Segoe UI', sans-serif" }}
          >
            <div className="bg-white rounded-lg border border-gray-300 shadow-md overflow-hidden">
              {/* ── Header ── */}
              <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-300">
                <div className="text-sm font-bold px-4 py-1 rounded border-2 text-red-600 border-red-500 bg-white">
                  {process === "Registration" ? "New Lead" : "Edit Lead"}
                </div>
              </div>

              <div className="p-3 md:p-4 space-y-3">
                {/* ── Row 1: Customer Name | Email | Phone | Mobile ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Customer Name
                    </label>
                    <div className="flex gap-1">
                      <div className="flex-1 text-sm min-w-0">
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
                            setSelectedLeadList([])
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
                        className={`bg-[#1B2A4A] hover:bg-[#243660] text-white text-xs font-bold px-3 rounded flex-shrink-0 ${isReadOnly ? "cursor-not-allowed opacity-70" : ""}`}
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
                  <div>
                    <select
                      {...registerMain("leadBranch")}
                      disabled={!iscustomerchangeandbranch}
                      onChange={(e) => {
                        setSelectedBranch([e.target.value])
                        setValueMain("customerName", "")
                        setSelectedCustomer(null)
                        setcustomerTableData([])
                        setSelectedLeadList([])
                        setValueMain("netAmount", "")
                        setSelectedLicense(null)
                      }}
                      className="border border-gray-300 rounded px-3 py-[6px] text-sm mt-5 bg-[#1B2A4A] hover:bg-[#243660] text-white outline-none min-w-[100px] cursor-pointer"
                    >
                      {companybranches?.map((b, i) => (
                        <option key={i} value={b._id}>
                          {b.branchName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* ── Row 2: Source | Trade | Associate ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Email id
                    </label>
                    <input
                      {...registerMain("email")}
                      disabled={isReadOnly}
                      placeholder="Email..."
                      className={`w-full border border-gray-300 rounded px-3 py-[7px] text-sm outline-none bg-[#EEF2F8] ${isReadOnly ? "cursor-not-allowed opacity-70" : ""}`}
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
                      className={`w-full border border-gray-300 rounded px-3 py-[7px] text-sm outline-none bg-[#EEF2F8] ${isReadOnly ? "cursor-not-allowed opacity-70" : ""}`}
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
                      className={`w-full border border-gray-300 rounded px-3 py-[7px] text-sm outline-none bg-[#EEF2F8] ${isReadOnly ? "cursor-not-allowed opacity-70" : ""}`}
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
                      className={`w-full border border-gray-300 rounded px-3 py-[7px] text-sm outline-none bg-[#EEF2F8] ${isReadOnly ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
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

                {/* ── Self allocation sub-fields ── */}
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
                        className={`w-full border border-gray-300 rounded px-3 py-[7px] text-sm outline-none bg-[#EEF2F8] ${!isSelfAllocationChangable ? "cursor-not-allowed opacity-70" : ""}`}
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

                {/* ── Product Table ── */}
                <div className="border border-gray-300 rounded overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#1B2A4A] text-white">
                          <th
                            rowSpan="2"
                            className="border border-blue-900 px-3 py-2 text-left whitespace-nowrap min-w-[160px]"
                          >
                            License No
                          </th>
                          <th
                            rowSpan="2"
                            className="border border-blue-900 px-3 py-2 text-left whitespace-nowrap min-w-[160px]"
                          >
                            Product / Service
                          </th>
                          <th
                            colSpan="3"
                            className="border border-blue-900 px-3 py-2 text-center"
                          >
                            Price Details
                          </th>
                          <th
                            rowSpan="2"
                            className="border border-blue-900 px-3 py-2 text-center w-10"
                          >
                            <button
                              type="button"
                              disabled={isReadOnly}
                              onClick={() =>
                                setSelectedLeadList((prev) => [
                                  ...(prev || []),
                                  {
                                    licenseNumber: "",
                                    productorServiceId: "",
                                    productorServiceName: "",
                                    productPrice: "",
                                    hsn: "",
                                    netAmount: ""
                                  }
                                ])
                              }
                              title="Add Row"
                              className={`mx-auto flex items-center justify-center w-6 h-6 rounded-full bg-white bg-opacity-20 hover:bg-opacity-40 transition ${isReadOnly ? "cursor-not-allowed opacity-50" : ""}`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2.5"
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
                          <th className="border border-blue-900 px-3 py-1 text-center whitespace-nowrap min-w-[80px]">
                            Amount
                          </th>
                          <th className="border border-blue-900 px-3 py-1 text-center whitespace-nowrap min-w-[70px]">
                            Tax %
                          </th>
                          <th className="border border-blue-900 px-3 py-1 text-center whitespace-nowrap min-w-[80px]">
                            Net Amount
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {(selectedleadlist && selectedleadlist.length > 0
                          ? selectedleadlist
                          : [
                              {
                                licenseNumber: "",
                                productorServiceId: "",
                                productorServiceName: "",
                                productPrice: "",
                                hsn: "",
                                netAmount: ""
                              }
                            ]
                        ).map((item, index) => (
                          <tr
                            key={index}
                            className="border-b even:bg-blue-50 bg-white hover:bg-blue-50 transition-colors"
                          >
                            {/* ── License No dropdown ── */}
                            <td className="border border-gray-300 px-2 py-1">
                              <div className="relative">
                                <button
                                  type="button"
                                  disabled={isReadOnly}
                                  onClick={() =>
                                    setOpenLicenseDropdown((prev) =>
                                      prev === index ? null : index
                                    )
                                  }
                                  className={`w-full border border-gray-200 rounded px-2 py-[5px] text-xs bg-[#EEF2F8] flex justify-between items-center gap-1 ${isReadOnly ? "cursor-not-allowed opacity-70" : ""}`}
                                >
                                  <span
                                    className={`truncate ${item.licenseNumber ? "text-gray-700" : "text-gray-400"}`}
                                  >
                                    {item.licenseNumber || "Select License"}
                                  </span>
                                  <svg
                                    className="w-3 h-3 flex-shrink-0"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </button>

                                {openLicenseDropdown === index && (
                                  <div className="absolute left-0 top-full mt-1 w-full min-w-[200px] bg-white border rounded shadow-lg z-[100] max-h-48 overflow-y-auto">
                                    <ul>
                                      <li
                                        className="p-2 hover:bg-gray-100 cursor-pointer text-xs font-semibold text-red-500"
                                        onClick={() => {
                                          const updated = [
                                            ...(selectedleadlist?.length
                                              ? selectedleadlist
                                              : [
                                                  {
                                                    licenseNumber: "",
                                                    productorServiceId: "",
                                                    productorServiceName: "",
                                                    productPrice: "",
                                                    hsn: "",
                                                    netAmount: ""
                                                  },
                                                  {
                                                    licenseNumber: "",
                                                    productorServiceId: "",
                                                    productorServiceName: "",
                                                    productPrice: "",
                                                    hsn: "",
                                                    netAmount: ""
                                                  }
                                                ])
                                          ]
                                          updated[index] = {
                                            ...updated[index],
                                            licenseNumber: "",
                                            productorServiceId: "",
                                            productorServiceName: "",
                                            productPrice: "",
                                            hsn: "",
                                            netAmount: ""
                                          }
                                          setSelectedLeadList(updated)
                                          handleLicenseSelect(null)
                                          setOpenLicenseDropdown(null)
                                        }}
                                      >
                                        No License
                                      </li>
                                      {customerTableData?.map((lic, i) => (
                                        <li
                                          key={lic.licenseNumber || i}
                                          className="p-2 hover:bg-gray-100 cursor-pointer text-xs text-gray-700"
                                          onClick={() => {
                                            const updated = [
                                              ...(selectedleadlist?.length
                                                ? selectedleadlist
                                                : [
                                                    {
                                                      licenseNumber: "",
                                                      productorServiceId: "",
                                                      productorServiceName: "",
                                                      productPrice: "",
                                                      hsn: "",
                                                      netAmount: ""
                                                    },
                                                    {
                                                      licenseNumber: "",
                                                      productorServiceId: "",
                                                      productorServiceName: "",
                                                      productPrice: "",
                                                      hsn: "",
                                                      netAmount: ""
                                                    }
                                                  ])
                                            ]
                                            updated[index] = {
                                              ...updated[index],
                                              licenseNumber: lic.licenseNumber,
                                              productorServiceId: "",
                                              productorServiceName: ""
                                            }
                                            setSelectedLeadList(updated)
                                            handleLicenseSelect(
                                              lic.licenseNumber
                                            )
                                            setOpenLicenseDropdown(null)
                                          }}
                                        >
                                          {lic.licenseNumber} —{" "}
                                          {lic.productName}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* ── Product / Service dropdown with custom blue checkboxes ── */}
                            <td className="border border-gray-300 px-2 py-1">
                              <div className="relative">
                                <button
                                  type="button"
                                  disabled={isReadOnly}
                                  onClick={() =>
                                    setOpenProductDropdown((prev) =>
                                      prev === index ? null : index
                                    )
                                  }
                                  className={`w-full border border-gray-200 rounded px-2 py-[5px] text-xs bg-[#EEF2F8] flex justify-between items-center gap-1 ${isReadOnly ? "cursor-not-allowed opacity-70" : ""}`}
                                >
                                  <span
                                    className={`truncate ${item.productorServiceName ? "text-gray-700" : "text-gray-400"}`}
                                  >
                                    {item.productorServiceName ||
                                      "Select Product / Service"}
                                  </span>
                                  <svg
                                    className="w-3 h-3 flex-shrink-0"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </button>

                                {openProductDropdown === index && (
                                  <div className="absolute left-0 top-full mt-1 w-full min-w-[200px] bg-white border rounded shadow-lg z-[100] max-h-48 overflow-y-auto p-2">
                                    {item.licenseNumber
                                      ? leadList?.map((prod) => {
                                          const state =
                                            productOrserviceSelections[
                                              item.licenseNumber
                                            ]?.find(
                                              (p) => p._id === prod._id
                                            ) || { selected: false }
                                          return (
                                            <label
                                              key={prod._id}
                                              className="flex items-center gap-2 mb-1 text-xs cursor-pointer hover:bg-gray-50 px-1 py-0.5 rounded"
                                            >
                                              <span
                                                onClick={() => {
                                                  handleProductORserviceSelect(
                                                    prod._id
                                                  )
                                                  if (!state.selected) {
                                                    const igstRate =
                                                      prod?.selectedArray?.[0]
                                                        ?.hsn_id?.onValue
                                                        ?.igstRate ?? 0
                                                    const newItem = {
                                                      licenseNumber:
                                                        item.licenseNumber,
                                                      productorServiceName:
                                                        prod.productName ||
                                                        prod.serviceName,
                                                      productorServiceId:
                                                        prod._id,
                                                      itemType: prod.productName
                                                        ? "Product"
                                                        : "Service",
                                                      productPrice:
                                                        prod.productPrice,
                                                      hsn: igstRate,
                                                      price: prod.productPrice,
                                                      netAmount: (
                                                        Number(
                                                          prod?.productPrice ||
                                                            0
                                                        ) +
                                                        (Number(igstRate) /
                                                          100) *
                                                          Number(
                                                            prod?.productPrice ||
                                                              0
                                                          )
                                                      ).toFixed(2)
                                                    }
                                                    setSelectedLeadList(
                                                      (prev) => {
                                                        const exists =
                                                          prev.some(
                                                            (p) =>
                                                              p.licenseNumber ===
                                                                item.licenseNumber &&
                                                              p.productorServiceId ===
                                                                prod._id
                                                          )
                                                        if (exists) return prev
                                                        const updated = [
                                                          ...prev
                                                        ]
                                                        const emptyRowIndex =
                                                          updated.findIndex(
                                                            (r, i) =>
                                                              i === index &&
                                                              !r.productorServiceId
                                                          )
                                                        if (
                                                          emptyRowIndex !== -1
                                                        ) {
                                                          updated[
                                                            emptyRowIndex
                                                          ] = newItem
                                                          return updated
                                                        }
                                                        return [
                                                          ...updated,
                                                          newItem
                                                        ]
                                                      }
                                                    )
                                                  } else {
                                                    setSelectedLeadList(
                                                      (prev) =>
                                                        prev.filter(
                                                          (p) =>
                                                            !(
                                                              p.licenseNumber ===
                                                                item.licenseNumber &&
                                                              p.productorServiceId ===
                                                                prod._id
                                                            )
                                                        )
                                                    )
                                                  }
                                                }}
                                                className={`w-4 h-4 flex-shrink-0 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
                                                  state.selected
                                                    ? "bg-[#1B2A4A] border-[#1B2A4A]"
                                                    : "bg-white border-gray-300 hover:border-[#1B2A4A]"
                                                }`}
                                              >
                                                {state.selected && (
                                                  <svg
                                                    className="w-2.5 h-2.5 text-white"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                  >
                                                    <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      d="M5 13l4 4L19 7"
                                                    />
                                                  </svg>
                                                )}
                                              </span>
                                              <span
                                                className={
                                                  state.selected
                                                    ? "font-semibold text-[#1B2A4A]"
                                                    : "text-gray-700"
                                                }
                                              >
                                                {prod.productName ||
                                                  prod.serviceName}
                                              </span>
                                            </label>
                                          )
                                        })
                                      : leadList?.map((prod) => {
                                          const state =
                                            licensewithoutProductSelection?.find(
                                              (p) => p._id === prod._id
                                            ) || { selected: false }
                                          return (
                                            <label
                                              key={prod._id}
                                              className="flex items-center gap-2 mb-1 text-xs cursor-pointer hover:bg-gray-50 px-1 py-0.5 rounded"
                                            >
                                              <span
                                                onClick={() => {
                                                  handleProductORserviceSelect(
                                                    prod._id
                                                  )
                                                  if (!state.selected) {
                                                    const igstRate =
                                                      prod?.selectedArray?.[0]
                                                        ?.hsn_id?.onValue
                                                        ?.igstRate ?? 0
                                                    const newItem = {
                                                      productorServiceName:
                                                        prod.productName ||
                                                        prod.serviceName,
                                                      productorServiceId:
                                                        prod._id,
                                                      itemType: prod.productName
                                                        ? "Product"
                                                        : "Service",
                                                      productPrice:
                                                        prod.productPrice,
                                                      hsn: igstRate,
                                                      price: prod.productPrice,
                                                      netAmount: (
                                                        Number(
                                                          prod?.productPrice ||
                                                            0
                                                        ) +
                                                        (Number(igstRate) /
                                                          100) *
                                                          Number(
                                                            prod?.productPrice ||
                                                              0
                                                          )
                                                      ).toFixed(2)
                                                    }
                                                    setSelectedLeadList(
                                                      (prev) => {
                                                        const exists =
                                                          prev.some(
                                                            (p) =>
                                                              !p.licenseNumber &&
                                                              p.productorServiceId ===
                                                                prod._id
                                                          )
                                                        if (exists) return prev
                                                        const updated = [
                                                          ...prev
                                                        ]
                                                        const emptyRowIndex =
                                                          updated.findIndex(
                                                            (r, i) =>
                                                              i === index &&
                                                              !r.productorServiceId
                                                          )
                                                        if (
                                                          emptyRowIndex !== -1
                                                        ) {
                                                          updated[
                                                            emptyRowIndex
                                                          ] = newItem
                                                          return updated
                                                        }
                                                        return [
                                                          ...updated,
                                                          newItem
                                                        ]
                                                      }
                                                    )
                                                  } else {
                                                    setSelectedLeadList(
                                                      (prev) =>
                                                        prev.filter(
                                                          (p) =>
                                                            !(
                                                              !p.licenseNumber &&
                                                              p.productorServiceId ===
                                                                prod._id
                                                            )
                                                        )
                                                    )
                                                  }
                                                }}
                                                className={`w-4 h-4 flex-shrink-0 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
                                                  state.selected
                                                    ? "bg-[#1B2A4A] border-[#1B2A4A]"
                                                    : "bg-white border-gray-300 hover:border-[#1B2A4A]"
                                                }`}
                                              >
                                                {state.selected && (
                                                  <svg
                                                    className="w-2.5 h-2.5 text-white"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                  >
                                                    <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      d="M5 13l4 4L19 7"
                                                    />
                                                  </svg>
                                                )}
                                              </span>
                                              <span
                                                className={
                                                  state.selected
                                                    ? "font-semibold text-[#1B2A4A]"
                                                    : "text-gray-700"
                                                }
                                              >
                                                {prod.productName ||
                                                  prod.serviceName}
                                              </span>
                                            </label>
                                          )
                                        })}
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Amount */}
                            <td className="border border-gray-300 px-2 py-1">
                              <input
                                type="number"
                                readOnly={isReadOnly}
                                value={item.productPrice}
                                onChange={(e) =>
                                  handlePriceChange(index, e.target.value)
                                }
                                placeholder="0.00"
                                className={`w-full px-2 py-1 border border-gray-200 rounded text-xs outline-none ${isReadOnly ? "cursor-not-allowed bg-gray-100" : "bg-white"}`}
                              />
                            </td>

                            {/* Tax % */}
                            <td className="border border-gray-300 px-2 py-1">
                              <input
                                type="number"
                                readOnly={isReadOnly}
                                value={item.hsn}
                                onChange={(e) =>
                                  handleHsnChange(index, e.target.value)
                                }
                                placeholder="Tax %"
                                className={`w-full px-2 py-1 border border-gray-200 rounded text-xs outline-none bg-gray-100 ${isReadOnly ? "cursor-not-allowed" : ""}`}
                              />
                            </td>

                            {/* Net Amount */}
                            <td className="border border-gray-300 px-2 py-1">
                              <input
                                type="text"
                                readOnly
                                value={item.netAmount}
                                placeholder="0.00"
                                className="w-full px-2 py-1 border border-gray-200 rounded text-xs outline-none cursor-not-allowed bg-gray-100"
                              />
                            </td>

                            {/* Delete */}
                            <td className="border border-gray-300 px-2 py-1 text-center">
                              <button
                                type="button"
                                disabled={isReadOnly}
                                onClick={() =>
                                  handleDeletetableData(item, index)
                                }
                                className={`text-red-400 hover:text-red-600 p-1 rounded transition-colors ${isReadOnly ? "cursor-not-allowed opacity-30" : ""}`}
                                title="Delete row"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <path d="M3 6h18" />
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ── Remark + Amount summary ── */}
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
                      className={`w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none bg-[#EEF2F8] resize-none ${isReadOnly ? "cursor-not-allowed opacity-70" : ""}`}
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
                          className="flex-1 min-w-0 border border-gray-300 rounded-r px-3 py-[6px] text-sm bg-white outline-none cursor-not-allowed"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Self Allocation / Lead ID ── */}
                {process !== "edit" ? (
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
                      className={`w-full border border-gray-300 rounded px-3 py-[7px] text-sm outline-none bg-[#EEF2F8] ${!isSelfAllocationChangable ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
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
                )}

                {/* ── Submit + Lead By ── */}
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

                  <div className="flex items-center gap-2">
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
                  </div>
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
            // <div className="fixed top-16 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center px-4">
            //   <div className="bg-white px-6 pt-2 pb-4 rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] z-50 overflow-auto">
            //     <h2 className="text-lg font-semibold mb-4 text-center">
            //       Add New Customer
            //     </h2>

            //     <form onSubmit={handleSubmitModal(onmodalsubmit)}>
            //       <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            //         {/* Customer Name */}
            //         <div>
            //           <label className="block text-sm font-medium text-gray-700">
            //             Customer Name
            //           </label>
            //           <input
            //             type="text"
            //             {...registerModal("customerName", {
            //               required: "CustomerName is Required"
            //             })}
            //             onBlur={(e) =>
            //               setValueModal("customerName", e.target.value.trim())
            //             }
            //             className="w-full border border-gray-400 rounded-md p-2 focus:outline-none"
            //             placeholder="Customer Name"
            //           />
            //           {errorsModal.customerName && (
            //             <p className="text-red-500 text-sm">
            //               {errorsModal.customerName.message}
            //             </p>
            //           )}
            //         </div>

            //         {/* Email */}
            //         <div>
            //           <label className="block text-sm font-medium text-gray-700">
            //             Email
            //           </label>
            //           <input
            //             type="email"
            //             {...registerModal("email")}
            //             className="w-full border border-gray-400 rounded-md p-2 focus:outline-none"
            //             placeholder="Email"
            //           />
            //         </div>

            //         <div>
            //           <label className="block text-sm font-medium text-gray-700">
            //             Mobile
            //           </label>
            //           <input
            //             type="tel"
            //             {...registerModal("mobile", {
            //               required: "Mobile is Required",
            //               validate: (value) => {
            //                 const cleaned = value
            //                   .replace(/^\+?91/, "")
            //                   .replace(/\D/g, "") // remove +91 or 91 and non-digits
            //                 if (cleaned.length !== 10) {
            //                   return "Mobile number must be exactly 10 digits after removing country code"
            //                 }
            //                 return true
            //               }
            //             })}
            //             onBlur={(e) =>
            //               setValueModal("mobile", e.target.value.trim())
            //             }
            //             className="w-full border border-gray-400 rounded-md p-2 focus:outline-none"
            //             placeholder="Mobile"
            //           />
            //           {errorsModal.mobile && (
            //             <p className="text-red-500 text-sm">
            //               {errorsModal.mobile.message}
            //             </p>
            //           )}
            //         </div>

            //         <div>
            //           <label className="block text-sm font-medium text-gray-700">
            //             Landline
            //           </label>
            //           <input
            //             type="tel"
            //             {...registerModal("landline")}
            //             onBlur={(e) =>
            //               setValueModal("landline", e.target.value.trim())
            //             }
            //             className="w-full border border-gray-400 rounded-md p-2 focus:outline-none"
            //             placeholder="Phone"
            //           />
            //         </div>

            //         <div className="col-span-1 md:col-span-2">
            //           <label className="block text-sm font-medium text-gray-700">
            //             Address
            //           </label>
            //           <textarea
            //             {...registerModal("address1")}
            //             onBlur={(e) =>
            //               setValueModal("address1", e.target.value.trim())
            //             }
            //             className="w-full border border-gray-400 rounded-md p-2 focus:outline-none"
            //             placeholder="Address"
            //           />
            //         </div>

            //         <div>
            //           <label className="block text-sm font-medium text-gray-700">
            //             Country
            //           </label>
            //           <Select
            //             options={countryOptions}
            //             value={selectedCountry}
            //             // value={User && User.assignedto._id}
            //             getOptionLabel={(option) => option.label} // Add this
            //             getOptionValue={(option) => option.value} // Add this
            //             {...registerModal("country")}
            //             onChange={(option) => {
            //               setSelectedCountry(option)
            //               setValueModal("country", option.value)
            //               // setSelectedState(null) // Reset state when country changes
            //             }}
            //             className="border focus:outline-none"
            //             styles={{
            //               control: (provided) => ({
            //                 ...provided,
            //                 border: "1px solid #d1d5db", // Tailwind's border-gray-300
            //                 boxShadow: "none",
            //                 outline: "none",
            //                 "&:hover": {
            //                   borderColor: "#9ca3af" // Tailwind's border-gray-400
            //                 }
            //               }),
            //               menu: (provided) => ({
            //                 ...provided,
            //                 maxHeight: "200px", // Set dropdown max height
            //                 overflowY: "auto" // Enable scrolling
            //               }),
            //               menuList: (provided) => ({
            //                 ...provided,
            //                 maxHeight: "200px", // Ensures dropdown scrolls internally
            //                 overflowY: "auto"
            //               })
            //             }}
            //             menuPortalTarget={document.body} // Prevents nested scrolling issues
            //             menuShouldScrollIntoView={false}
            //           />
            //         </div>

            //         <div>
            //           <label className="block text-sm font-medium text-gray-700">
            //             State
            //           </label>

            //           <Select
            //             options={stateOptions}
            //             value={selectedState}
            //             getOptionLabel={(option) => option.label} // Add this
            //             getOptionValue={(option) => option.value} // Add this
            //             {...registerModal("state")}
            //             onChange={(option) => {
            //               setSelectedState(option)
            //               setValueModal("state", option.value)
            //             }}
            //             styles={{
            //               control: (provided) => ({
            //                 ...provided,
            //                 border: "1px solid #d1d5db", // Tailwind's border-gray-300
            //                 boxShadow: "none",
            //                 outline: "none",
            //                 "&:hover": {
            //                   borderColor: "#9ca3af" // Tailwind's border-gray-400
            //                 }
            //               }),
            //               menu: (provided) => ({
            //                 ...provided,
            //                 maxHeight: "200px", // Set dropdown max height
            //                 overflowY: "auto" // Enable scrolling
            //               }),
            //               menuList: (provided) => ({
            //                 ...provided,
            //                 maxHeight: "200px", // Ensures dropdown scrolls internally
            //                 overflowY: "auto"
            //               })
            //             }}
            //             menuPortalTarget={document.body} // Prevents nested scrolling issues
            //             menuShouldScrollIntoView={false}
            //             isDisabled={!selectedCountry}
            //           />
            //         </div>

            //         <div>
            //           <label className="block text-sm font-medium text-gray-700">
            //             City
            //           </label>
            //           <input
            //             type="text"
            //             {...registerModal("city")}
            //             onBlur={(e) =>
            //               setValueModal("city", e.target.value.trim())
            //             }
            //             className="w-full border border-gray-400 rounded-md p-2 focus:outline-none"
            //             placeholder="City"
            //           />
            //         </div>

            //         <div>
            //           <label className="block text-sm font-medium text-gray-700">
            //             Pincode
            //           </label>
            //           <input
            //             type="text"
            //             {...registerModal("pincode")}
            //             onBlur={(e) =>
            //               setValueModal("pincode", e.target.value.trim())
            //             }
            //             className="w-full border border-gray-400 rounded-md p-2 focus:outline-none"
            //             placeholder="Pincode"
            //           />
            //         </div>

            //         <div>
            //           <label className="block text-sm font-medium text-gray-700">
            //             Contact Person
            //           </label>
            //           <input
            //             type="text"
            //             {...registerModal("contactPerson", {
            //               required: "Contact person is Required"
            //             })}
            //             onBlur={(e) =>
            //               setValueModal("contactPerson", e.target.value.trim())
            //             }
            //             className="w-full border border-gray-400 rounded-md p-2 focus:outline-none"
            //             placeholder="Contact Person"
            //           />
            //           {errorsModal.contactPerson && (
            //             <p className="text-red-500 text-sm">
            //               {errorsModal.contactPerson.message}
            //             </p>
            //           )}
            //         </div>

            //         <div>
            //           <label className="block text-sm font-medium text-gray-700">
            //             Types of Industry
            //           </label>
            //           <select
            //             id="industry"
            //             {...registerModal("industry", {
            //               required: "Industry is required"
            //             })}
            //             className="w-full border border-gray-400 rounded-md p-2  focus:outline-none"
            //           >
            //             <option value="">Select Industry</option>
            //             {Industries.map((industry, index) => (
            //               <option key={index} value={industry}>
            //                 {industry}
            //               </option>
            //             ))}
            //           </select>
            //           {errorsModal.industry && (
            //             <p className="text-red-500 text-sm">
            //               {errorsModal.industry.message}
            //             </p>
            //           )}
            //         </div>

            //         <div>
            //           <label className="block text-sm font-medium text-gray-700">
            //             Partnership Type
            //           </label>

            //           <select
            //             id="partner"
            //             {...registerModal("partner")}
            //             className="mt-1 block w-full border border-gray-400 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
            //           >
            //             <option value="">Select Partner</option>
            //             {partner?.map((partnr, index) => (
            //               <option key={index} value={partnr._id}>
            //                 {partnr.partner}
            //               </option>
            //             ))}
            //           </select>
            //         </div>
            //         <div>
            //           <label className="block text-sm font-medium text-gray-700">
            //             RegistrationType
            //           </label>

            //           <select
            //             id="registrationType"
            //             {...registerModal("registrationType")}
            //             className="mt-1 block w-full border border-gray-400 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
            //           >
            //             <option value="">Select RegistrationType</option>
            //             <option value="unregistered">
            //               Unregistered/Consumer
            //             </option>
            //             <option value="regular">Regular</option>
            //           </select>
            //         </div>
            //         {registrationType === "regular" && (
            //           <div>
            //             <label className="block text-sm font-medium text-gray-700">
            //               GSTIN/UIN
            //             </label>
            //             <input
            //               id="gstNo"
            //               {...registerModal("gstNo", {
            //                 required: "GST is required"
            //               })}
            //               className="mt-1 block w-full border border-gray-400 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
            //               placeholder="Enter GSTIN (e.g., 22AAAAA0000A1Z5)"
            //             />
            //             {errorsModal.gstNo && (
            //               <p className="text-red-500 text-sm">
            //                 {errorsModal.gstNo.message}
            //               </p>
            //             )}
            //           </div>
            //         )}
            //       </div>

            //       {/* Buttons */}
            //       <div className="mt-6 flex justify-center space-x-3">
            //         <button
            //           type="button"
            //           onClick={() => {
            //             setModalOpen(false)
            //             clearmodalErros()
            //             resetModal()
            //           }}
            //           className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
            //         >
            //           Cancel
            //         </button>
            //         <button
            //           type="submit"
            //           className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            //         >
            //           Submit
            //         </button>
            //       </div>
            //     </form>
            //   </div>
            // </div>
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center px-4 z-50">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* ── Header ── */}
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

                {/* ── Body ── */}
                <form
                  onSubmit={handleSubmitModal(onmodalsubmit)}
                  className="overflow-y-auto flex-1 px-6 py-4"
                >
                  {/* Section: Basic Info */}
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

                  {/* Section: Location */}
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

                  {/* Section: Business Info */}
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

                  {/* ── Footer buttons ── */}
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
