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
      if (Data[0].activityLog.length === 2) {
        const allocatedtoData =
          Data[0].activityLog[Data[0].activityLog.length - 1]
        if (allocatedtoData.taskallocatedBy === loggeduser._id) {
          setselfAllocationChangable(true)
        } else {
          setselfAllocationChangable(false)
        }
      } else if (Data[0].activityLog.length > 2) {
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
          selected: !!match
        }
      })
      setlicenseWithoutProductSelection(productListwithoutlicenseOnEdit)
      const groupedByLicenseNumber = {}
      // const productlistwithlicenseonEdit = Data[0].leadFor.map((lead) => {
      //   if (lead.licenseNumber) {
      //     if (!groupedByLicenseNumber[lead.licenseNumber]) {
      //       groupedByLicenseNumber[lead.licenseNumber] = [] // create array if not exist
      //     }
      //     leadList?.forEach((product) => {
      //       const existingIndex = groupedByLicenseNumber[
      //         lead.licenseNumber
      //       ].findIndex((item) => item._id === product._id)

      //       if (existingIndex !== -1) {
      //         // If already exists, just update 'selected' flag
      //         if (lead.productorServiceId._id === product._id) {
      //           groupedByLicenseNumber[lead.licenseNumber][
      //             existingIndex
      //           ].selected = product._id === lead.productorServiceId._id
      //         }
      //       } else {
      //         // If not exists, push new product with correct selected
      //         const item = {
      //           ...product,
      //           selected: product._id === lead.productorServiceId._id
      //         }
      //         groupedByLicenseNumber[lead.licenseNumber].push(item)
      //       }
      //     })
      //     return groupedByLicenseNumber
      //   }
      // })
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
          ? { ...product, selected: !product.selected }
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

      const updatedProductList = licensewithoutProductSelection.map((product) =>
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
                (product.hsn / 100) * Number(newPrice)
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
      const updatedProductList = licensewithoutProductSelection.map((product) =>
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
    return selectedleadlist.reduce((total, product) => {
      return total + (Number(product.netAmount) || 0) // Ensure price is a number and handle null values
    }, 0)
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
          .map((item) => ({
            licenseNumber: selectedLicense,
            productorServiceName: item.productName || item.serviceName,
            productorServiceId: item._id,
            itemType: item.productName ? "Product" : "Service",
            price: item.productPrice || item.price
          }))

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
          .map((item) => ({
            productorServiceName: item.productName || item.serviceName,
            productorServiceId: item._id,
            itemType: item.productName ? "Product" : "Service",
            productPrice: item.productPrice || item.price,
            hsn: item?.selectedArray[0]?.hsn_id?.onValue?.igstRate || 0,
            price: item.productPrice || item.price,
            netAmount:
              (item?.productPrice || item?.price) +
              (item?.selectedArray[0]?.hsn_id?.onValue?.igstRate / 100) *
                (item?.price || item?.productPrice)
          }))

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
        setLoadingState(true)

        await handleleadData(data, selectedleadlist)
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
    <div>
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
      <div className="h-full overflow-y-auto container justify-center items-center p-3 md:p-8 shadow-xl">
        <div
          className="shadow-lg rounded p-2 md:p-3 lg:p-8 mx-auto "
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
          <div className="flex justify-between">
            <h2 className="text-xl md:text-2xl font-semibold  mb-2 md:mb-1">
              {Data && Data?.length > 0 ? "Lead Edit" : "Lead"}
            </h2>
          </div>

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

          <form onSubmit={handleSubmitMain(onSubmit)} className="md:py-5">
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

                {/* Customer Select Dropdown */}
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
                          color: state.isDisabled ? "black" : "black", // Tailwind's text-gray-500
                          opacity: state.isDisabled ? 0.7 : 1
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
                      required: "This feild is required",
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
                    <option value="true">Self Allocate</option>
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
                        {...registerMain("allocationType", {
                          required: "Allocation type is required"
                        })}
                        className="w-full focus:outline-none rounded-md py-1 border border-gray-300 px-2"
                      >
                        <option value="">Select Allocationtype</option>
                        <option value="followup">Followup</option>
                        <option value="programming">Programming</option>
                        <option value="testing-&-implementation">
                          Testing & Implementation
                        </option>
                        <option value="coding-&-testing">
                          Coding & Testing
                        </option>
                        <option value="software-services">
                          Software Service
                        </option>
                        <option value="customermeet">Customer Meet</option>
                        <option value="demo">Demo</option>
                        <option value="training">Training</option>

                        <option value="onsite">Onsite</option>
                        <option value="office">Office</option>
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
                    {/* Button to open dropdown and show selected value */}
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

                    {/* Dropdown List */}
                    {isLicenseOpen && (
                      <div className=" w-full mt-1 bg-white border rounded-md shadow-lg z-30  max-h-60 absolute overflow-y-auto ">
                        <ul className="">
                          {/* Option to unselect license */}
                          <li
                            className="p-2 hover:bg-gray-200 cursor-pointer font-semibold text-red-500"
                            onClick={() => handleLicenseSelect(null)}
                          >
                            No License
                          </li>

                          {/* List of available licenses */}
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
                      {/* Toggle Dropdown Button */}
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
                    {/* Product List (Visible when isOpen is true) */}
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

                {selectedleadlist && selectedleadlist.length > 0 && (
                  <div className=" flex flex-col-1 bg-white border rounded-md  max-h-[200px] overflow-y-auto overflow-x-auto mt-4">
                   
                    <table className="w-full border-collapse border border-gray-300">
                      <thead className="bg-gray-50 ">
                        <tr className="">
                          <th
                            rowSpan="2"
                            className="border border-gray-300 px-1 py-1 text-left font-normal"
                          >
                            License No
                          </th>
                          <th
                            rowSpan="2"
                            className="border border-gray-300 px-1 py-1 text-left font-normal"
                          >
                            Product/Service
                          </th>
                          <th
                            className="border border-gray-300 px-1 py-1 text-center font-normal"
                            colSpan="3"
                          >
                            Price Details
                          </th>
                          <th
                            rowSpan="2"
                            className="border border-gray-300 px-1 py-1 text-center font-normal"
                          >
                            Action
                          </th>
                        </tr>
                        {/* Subheading row */}
                        <tr>
                          <th className="border border-gray-300 px-1 py-1 text-center  bg-gray-100 font-normal">
                            Price
                          </th>
                          <th className="border border-gray-300 px-1 py-1 text-center bg-gray-100 font-normal">
                            Tax
                          </th>
                          <th className="border border-gray-300 px-0.5 py-1 text-center  bg-gray-100 font-normal">
                            Price Incl. Tax
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedleadlist.map((item, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="border border-gray-300 px-3 py-2">
                              {item.licenseNumber || "Not Selected"}
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              {item.productorServiceName}
                            </td>

                            {/* Price Input - First column of Price Details */}
                            <td className="border border-gray-300 px-2 py-2">
                              <input
                                type="number"
                                readOnly={isReadOnly}
                                value={item.productPrice}
                                onChange={(e) =>
                                  handlePriceChange(index, e.target.value)
                                }
                                className={`w-full border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                  isReadOnly
                                    ? "cursor-not-allowed bg-gray-100 text-gray-700"
                                    : "bg-white"
                                }`}
                                placeholder="0.00"
                              />
                            </td>

                            {/* HSN/Tax Input - Second column of Price Details */}
                            <td className="border border-gray-300 px-2 py-2">
                              <input
                                type="text"
                                value={item.hsn}
                                className="w-full border rounded-md px-2 py-1 text-sm focus:outline-none cursor-not-allowed bg-gray-100 text-gray-700"
                                placeholder="HSN"
                                readOnly
                              />
                            </td>

                            {/* Net Amount Input - Third column of Price Details */}
                            <td className="border border-gray-300 px-2 py-2">
                              <input
                                type="text"
                                value={item.netAmount}
                                className="w-full border rounded-md px-2 py-1 text-sm focus:outline-none cursor-not-allowed bg-gray-100 text-gray-700"
                                placeholder="0.00"
                                readOnly
                              />
                            </td>

                            {/* Actions */}
                            <td className="border border-gray-300 px-3 py-2 text-center">
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeletetableData(item, index)
                                }
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors duration-200"
                                title="Delete Product"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 24 24"
                                  fill="none"
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
                        <p className="mt-1 w-full border rounded-md p-2 cursor-not-allowed bg-gray-100 shadow-xl">
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
                      className="mt-1 w-full border rounded-md p-2 focus:outline-none bg-gray-100 cursor-not-allowed shadow-xl"
                      // placeholder="Net Amount"
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
                      className="mt-1 w-full border rounded-md p-2 focus:outline-none bg-gray-100 cursor-not-allowed shadow-xl"
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
                      className="mt-1 w-full border rounded-md p-2 focus:outline-none bg-gray-100 cursor-not-allowed shadow-xl"
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
          </form>
          {modalOpen && (
            <div className="fixed top-16 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center px-4">
              <div className="bg-white px-6 pt-2 pb-4 rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] z-50 overflow-auto">
                <h2 className="text-lg font-semibold mb-4 text-center">
                  Add New Customer
                </h2>

                <form onSubmit={handleSubmitModal(onmodalsubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Customer Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Customer Name
                      </label>
                      <input
                        type="text"
                        {...registerModal("customerName", {
                          required: "CustomerName is Required"
                        })}
                        onBlur={(e) =>
                          setValueModal("customerName", e.target.value.trim())
                        }
                        className="w-full border border-gray-400 rounded-md p-2 focus:outline-none"
                        placeholder="Customer Name"
                      />
                      {errorsModal.customerName && (
                        <p className="text-red-500 text-sm">
                          {errorsModal.customerName.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        {...registerModal("email")}
                        className="w-full border border-gray-400 rounded-md p-2 focus:outline-none"
                        placeholder="Email"
                      />
                     
                    </div>

                    {/* Mobile */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Mobile
                      </label>
                      <input
                        type="tel"
                        {...registerModal("mobile", {
                          required: "Mobile is Required",
                          validate: (value) => {
                            const cleaned = value
                              .replace(/^\+?91/, "")
                              .replace(/\D/g, "") // remove +91 or 91 and non-digits
                            if (cleaned.length !== 10) {
                              return "Mobile number must be exactly 10 digits after removing country code"
                            }
                            return true
                          }
                        })}
                        onBlur={(e) =>
                          setValueModal("mobile", e.target.value.trim())
                        }
                        className="w-full border border-gray-400 rounded-md p-2 focus:outline-none"
                        placeholder="Mobile"
                      />
                      {errorsModal.mobile && (
                        <p className="text-red-500 text-sm">
                          {errorsModal.mobile.message}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Landline
                      </label>
                      <input
                        type="tel"
                        {...registerModal("landline")}
                        onBlur={(e) =>
                          setValueModal("landline", e.target.value.trim())
                        }
                        className="w-full border border-gray-400 rounded-md p-2 focus:outline-none"
                        placeholder="Phone"
                      />
                    </div>

                    {/* Address */}
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <textarea
                        {...registerModal("address1")}
                        onBlur={(e) =>
                          setValueModal("address1", e.target.value.trim())
                        }
                        className="w-full border border-gray-400 rounded-md p-2 focus:outline-none"
                        placeholder="Address"
                      />
                      
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Country
                      </label>
                      <Select
                        options={countryOptions}
                        value={selectedCountry}
                        // value={User && User.assignedto._id}
                        getOptionLabel={(option) => option.label} // Add this
                        getOptionValue={(option) => option.value} // Add this
                        {...registerModal("country")}
                        onChange={(option) => {
                          setSelectedCountry(option)
                          setValueModal("country", option.value)
                          // setSelectedState(null) // Reset state when country changes
                        }}
                        className="border focus:outline-none"
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            border: "1px solid #d1d5db", // Tailwind's border-gray-300
                            boxShadow: "none",
                            outline: "none",
                            "&:hover": {
                              borderColor: "#9ca3af" // Tailwind's border-gray-400
                            }
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
                    </div>

                    {/* State */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        State
                      </label>

                      <Select
                        options={stateOptions}
                        value={selectedState}
                        getOptionLabel={(option) => option.label} // Add this
                        getOptionValue={(option) => option.value} // Add this
                        {...registerModal("state")}
                        onChange={(option) => {
                          setSelectedState(option)
                          setValueModal("state", option.value)
                        }}
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            border: "1px solid #d1d5db", // Tailwind's border-gray-300
                            boxShadow: "none",
                            outline: "none",
                            "&:hover": {
                              borderColor: "#9ca3af" // Tailwind's border-gray-400
                            }
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
                        isDisabled={!selectedCountry}
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        {...registerModal("city")}
                        onBlur={(e) =>
                          setValueModal("city", e.target.value.trim())
                        }
                        className="w-full border border-gray-400 rounded-md p-2 focus:outline-none"
                        placeholder="City"
                      />
                    </div>

                    {/* Pincode */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Pincode
                      </label>
                      <input
                        type="text"
                        {...registerModal("pincode")}
                        onBlur={(e) =>
                          setValueModal("pincode", e.target.value.trim())
                        }
                        className="w-full border border-gray-400 rounded-md p-2 focus:outline-none"
                        placeholder="Pincode"
                      />
                    </div>

                    {/* Contact Person */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Contact Person
                      </label>
                      <input
                        type="text"
                        {...registerModal("contactPerson", {
                          required: "Contact person is Required"
                        })}
                        onBlur={(e) =>
                          setValueModal("contactPerson", e.target.value.trim())
                        }
                        className="w-full border border-gray-400 rounded-md p-2 focus:outline-none"
                        placeholder="Contact Person"
                      />
                      {errorsModal.contactPerson && (
                        <p className="text-red-500 text-sm">
                          {errorsModal.contactPerson.message}
                        </p>
                      )}
                    </div>

                    {/* Types of Industry Dropdown */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Types of Industry
                      </label>
                      <select
                        id="industry"
                        {...registerModal("industry", {
                          required: "Industry is required"
                        })}
                        className="w-full border border-gray-400 rounded-md p-2  focus:outline-none"
                      >
                        <option value="">Select Industry</option>
                        {Industries.map((industry, index) => (
                          <option key={index} value={industry}>
                            {industry}
                          </option>
                        ))}
                      </select>
                      {errorsModal.industry && (
                        <p className="text-red-500 text-sm">
                          {errorsModal.industry.message}
                        </p>
                      )}
                    </div>

                    {/* Partnership Dropdown */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Partnership Type
                      </label>

                      <select
                        id="partner"
                        {...registerModal("partner")}
                        className="mt-1 block w-full border border-gray-400 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                      >
                        <option value="">Select Partner</option>
                        {partner?.map((partnr, index) => (
                          <option key={index} value={partnr._id}>
                            {partnr.partner}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        RegistrationType
                      </label>

                      <select
                        id="registrationType"
                        {...registerModal("registrationType")}
                        className="mt-1 block w-full border border-gray-400 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                      >
                        <option value="">Select RegistrationType</option>
                        <option value="unregistered">
                          Unregistered/Consumer
                        </option>
                        <option value="regular">Regular</option>
                      </select>
                    </div>
                    {registrationType === "regular" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          GSTIN/UIN
                        </label>
                        <input
                          id="gstNo"
                          {...registerModal("gstNo", {
                            required: "GST is required"
                          })}
                          className="mt-1 block w-full border border-gray-400 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                          placeholder="Enter GSTIN (e.g., 22AAAAA0000A1Z5)"
                        />
                        {errorsModal.gstNo && (
                          <p className="text-red-500 text-sm">
                            {errorsModal.gstNo.message}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="mt-6 flex justify-center space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setModalOpen(false)
                        clearmodalErros()
                        resetModal()
                      }}
                      className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
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
