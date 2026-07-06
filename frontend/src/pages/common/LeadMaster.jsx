import { useEffect, useState, useMemo, useRef, useLayoutEffect } from "react"
import { useLocation } from "react-router-dom"
import { createPortal } from "react-dom"
import { Country, State } from "country-state-city"
import BarLoader from "react-spinners/BarLoader"
import { FaSpinner } from "react-icons/fa"
import Select from "react-select"
import { useForm, Controller } from "react-hook-form"
import PopUp from "../../components/common/PopUp"
import { toast } from "react-toastify"
import UseFetch from "../../hooks/useFetch"
import api from "../../api/api"
import { useNavigate } from "react-router-dom"
import Breadcrumb from "../../components/common/Breadcrumb"
import { Loader } from "lucide-react"
import { selectedBranch } from "../../../slices/companyBranchSlice"
import FullScreenLoader from "../../components/common/FullScreenLoader"
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

function LicenseDropdown({
  index,
  item,
  isReadOnly,
  customerTableData,
  selectedleadlist,
  setSelectedLeadList,
  setunselectedtaggedlicense,
  setTakenLicense
}) {
  console.log(selectedleadlist)
  console.log(item)
  console.log(index)
  console.log(customerTableData)
  const isMulti = item?.productorservicetype === "Additionalservice"
  console.log(isMulti)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const wrapperRef = useRef(null)
  const inputRef = useRef(null)
  const dropdownId = `license-dropdown-${index}`
const selectedLicenses = isMulti ? item?.licenseNumbers || [] : [];

const multiDisplayValue = selectedLicenses.length
  ? selectedLicenses.length === 1
    ? String(selectedLicenses[0]?.licenseNumber ?? "")
    : `${selectedLicenses[0]?.licenseNumber}`
  : "";
  useEffect(() => {
    if (isMulti) {
      setSearch("")
      console.log(filtered)
      toggleLicense(filtered, true)
    } else {
      console.log("hhh")
      setSearch(String(item?.licenseNumber ?? ""))
    }
  }, [item?.licenseNumber, isMulti])

  useEffect(() => {
    const handlePointerDown = (event) => {
      const target = event.target
      const wrapperEl = wrapperRef.current
      const dropdownEl = document.getElementById(dropdownId)

      const clickedInsideWrapper = wrapperEl && wrapperEl.contains(target)

      const clickedInsideDropdown = dropdownEl && dropdownEl.contains(target)

      if (!clickedInsideWrapper && !clickedInsideDropdown) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("touchstart", handlePointerDown)

    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("touchstart", handlePointerDown)
    }
  }, [dropdownId])

  // const selectedLicenses = isMulti ? item?.licenseNumbers || [] : []
  console.log(customerTableData)
  const filtered = (customerTableData || []).filter((lic) => {
    const q = String(search || "").toLowerCase()
    if (!q) return true
    console.log("h")
    const license = String(lic?.licenseNumber ?? "").toLowerCase()
    const product = String(
      lic?.productName || lic?.productorServiceName || ""
    ).toLowerCase()

    return license.includes(q) || product.includes(q)
  })
  console.log(filtered)

  const updateRow = (newRow) => {
    console.log("h")
    console.log(newRow)
    setSelectedLeadList((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              ...newRow
            }
          : row
      )
    )
  }

  console.log(selectedleadlist)

  const addLicense = (lic) => {
    if (!lic) return
    console.log("hh")
    if (isMulti) {
      const exists = (item?.licenseNumbers || []).some(
        (x) => String(x?.licenseNumber) === String(lic?.licenseNumber)
      )

      if (exists) return
      console.log("hh")
      console.log(lic)
      console.log(item?.licenseNumbers)
      if (!Array.isArray(lic)) {
        updateRow({
          licenseNumbers: [
            ...(item?.licenseNumbers || []),
            {
              licenseNumber: lic?.licenseNumber,
              productorServiceId: lic?.productorServiceId || "",
              productorServiceName:
                lic?.productName || lic?.productorServiceName || "",
              sourceIndex: lic?.sourceIndex
            }
          ]
        })
      }

      return
    }

    updateRow({
      licenseNumber: lic?.licenseNumber || ""
    })

    setSearch(String(lic?.licenseNumber ?? ""))
    setOpen(false)
  }
  console.log(selectedleadlist)

  const removeLicense = (licenseNumber) => {
    if (!isMulti) return

    updateRow({
      licenseNumbers: (item?.licenseNumbers || []).filter(
        (x) => String(x?.licenseNumber) !== String(licenseNumber)
      )
    })
  }

  const toggleLicense = (lic, checked) => {
    if (!lic || isReadOnly) return

    if (checked) {
      addLicense(lic)
    } else {
      removeLicense(lic?.licenseNumber)
    }
  }

  const handleInputChange = (e) => {
    console.log(e.target.value)
    setSearch(e.target.value)
    setOpen(true)
  }
  console.log(filtered)
  console.log(open)
  console.log(item)
  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        disabled={isReadOnly}
        // value={search}
  value={isMulti ? (open ? search : multiDisplayValue) : search}
        onChange={handleInputChange}
        onClick={() => {
          if (!isReadOnly) setOpen(true)
        }}
        placeholder={
          isMulti ? "Search / Add License" : "Search / Select License"
        }
        className={`w-full px-2 py-1 border border-gray-200 rounded text-xs bg-[#EEF2F8] outline-none ${
          isReadOnly ? "cursor-not-allowed opacity-70" : "cursor-text"
        }`}
      />

      {open && (
        <DropdownPortal anchorEl={inputRef.current}>
          <div
            id={dropdownId}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className="max-h-52 overflow-hidden rounded border border-gray-200 bg-white shadow-xl"
          >
            <ul className="max-h-52 overflow-y-auto text-xs">
              {filtered.length === 0 ? (
                <li className="px-3 py-2 italic text-gray-400">
                  No results found
                </li>
              ) : (
                filtered.map((lic, i) => {
                  const valStr = String(lic?.licenseNumber ?? "")
                  const productName =
                    lic?.productName || lic?.productorServiceName || ""
                  console.log(isMulti)
                  console.log(item)
                  console.log(valStr)
                  const alreadyAdded = isMulti
                    ? (item?.licenseNumbers || []).some(
                        (x) => String(x?.licenseNumber) === valStr
                      )
                    : false
                  console.log(alreadyAdded)
                  console.log(valStr, alreadyAdded)
                  return (
                    <li
                      key={lic?.licenseNumber ?? i}
                      className={`flex items-center justify-between gap-2 px-3 py-2 hover:bg-blue-50 ${
                        alreadyAdded
                          ? "bg-blue-50 font-semibold text-[#1B2A4A]"
                          : "text-gray-700"
                      }`}
                    >
                      {isMulti ? (
                        <label className="flex w-full cursor-pointer items-center justify-between gap-2">
                          <div className="flex min-w-0 items-center gap-2">
                            <input
                              type="checkbox"
                              checked={alreadyAdded}
                              disabled={isReadOnly}
                              onChange={(e) => {
                                console.log(e.target?.value)
                                console.log(e.target?.checked)
                                const checkedvalue = e.target.checked
                                // setwarningError((prev) => ({
                                //   ...prev,
                                //   taggedlicenseError: ""
                                // }))
                                const productId = item.productorServiceId
                                setunselectedtaggedlicense((prev) => {
                                  const updated = { ...prev }
                                  delete updated[productId]
                                  return updated
                                })
                                console.log(item)

                                setTakenLicense((prev) => {
                                  console.log(checkedvalue)
                                  const updatedLicenses = checkedvalue
                                    ? [
                                        ...(prev[item?.productorServiceName] ||
                                          []),
                                        valStr
                                      ]
                                    : (
                                        prev[item?.productorServiceName] || []
                                      ).filter((license) => license !== valStr)

                                  const updated = { ...prev }

                                  if (updatedLicenses.length > 0) {
                                    updated[item?.productorServiceName] =
                                      updatedLicenses
                                  } else {
                                    delete updated[item?.productorServiceName]
                                  }

                                  return updated
                                })
                                toggleLicense(lic, e.target.checked)
                              }}
                              // onMouseDown={(e) => e.stopPropagation()}
                              // onTouchStart={(e) => e.stopPropagation()}
                              // onClick={(e) => e.stopPropagation()}
                              className="h-3.5 w-3.5 cursor-pointer accent-blue-600"
                            />
                            <span className="font-medium">{valStr}</span>
                          </div>

                          <span className="truncate text-gray-400">
                            {productName}
                          </span>
                        </label>
                      ) : (
                        <button
                          type="button"
                          disabled={isReadOnly}
                          onMouseDown={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            addLicense(lic)
                          }}
                          className="flex w-full items-center justify-between gap-2 text-left"
                        >
                          <span className="font-medium">{valStr}</span>
                          <span className="truncate text-gray-400">
                            {productName}
                          </span>
                        </button>
                      )}
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
  process,
  isReadOnly,
  leadList,
  selectedleadlist,
  setSelectedLeadList,
  selectedBranch,
  selectedCustomer
}) {
  console.log(item)
  console.log(selectedBranch)
  console.log(leadList)
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
  const [selectionMessage, setselectionMessage] = useState({})
  useEffect(() => {
    console.log("hhh")
    setSearch(item.productorServiceName || "")
  }, [item.productorServiceName])

  useEffect(() => {
    console.log("jjj")
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
    console.log(search)
    console.log(!search)
    console.log("Hhhh")
    const q = search.toLowerCase()
    const name =
      prod.productName?.toLowerCase() || prod.serviceName?.toLowerCase() || ""
    return name.includes(q)
  })
  console.log(filtered)
  console.log(selectedleadlist)

  console.log(selectedCustomer)
  const applySelection = (prod) => {
    console.log(prod)

    const branchdata = (prod?.selected || [])
      .filter((item) => item.branch_id === selectedBranch)
      .map((item) => ({
        company_id: item.company_id,
        branch_id: item.branch_id
      }))
    console.log(branchdata)
    console.log(selectedCustomer)
    if (
      selectedCustomer === null ||
      selectedCustomer === undefined ||
      selectedCustomer === ""
    ) {
      console.log("jjj")
      setselectionMessage({
        productmessage: "Please select the customer first"
      })
      console.log("hhh")
      // Clear the message after 3 seconds (3000ms)
      setTimeout(() => {
        setselectionMessage({ productmessage: "" })
      }, 3000)
      return
    }
    console.log("hhh")
    const getRowId = (value) => {
      console.log(value)
      return String(value?._id || value?.id || value || "")
    }

    const base = selectedleadlist?.length
      ? [...selectedleadlist]
      : [{ ...emptyRow }]

    let updated = [...base]
    console.log(updated)
    // Remove any previously auto-added default services
    updated = updated.filter(
      (row, idx) => idx === index || !row?.isDefaultService
    )

    const filteredbranch = prod?.selected?.filter(
      (item) => item.branch_id === selectedBranch
    )
    console.log(filteredbranch)
    const igstRate = filteredbranch?.[0]?.hsn_id?.onValue?.igstRate
    console.log(prod)
    if (!prod) {
      updated[index] = {
        ...updated[index],
        productorServiceId: "",
        productorServiceName: "",
        itemType: "",
        productPrice: "",
        hsn: "",
        netAmount: ""
      }

      setSearch("")
      setSelectedLeadList(updated)
      return
    }

    const price = Number(prod?.productPrice || 0)
    const igst = Number(igstRate || 0)
    const rawNet = price + (igst / 100) * price
    const netAmount = Math.round(rawNet)

    // Main selected product
    updated[index] = {
      ...updated[index],
      productorServiceId: prod._id,
      productorServiceName: prod.productName || prod.serviceName,
      itemType: prod.productName ? "Product" : "Service",
      productPrice: prod.productPrice || 0,
      productorservicetype: prod?.productorservicetype,
      hsn: igstRate || 0,
      netAmount,
      company_id: branchdata[0].company_id,
      branch_id: branchdata[0].branch_id,
      actualHsn: igstRate,
      actualproductPrice: prod?.productPrice,
      actualNetAmount: netAmount
    }
    console.log(prod)
    console.log(selectedBranch)
    // Add default services immediately after selected product
    if (prod?.defaultservices?.length > 0 && process === "closing") {
      console.log("Hhh")

      const primaryId = getRowId(prod)
      console.log(primaryId)
      console.log("hhh")
      console.log(prod?.defaultservices)
      const defaultServiceRows = prod.defaultservices.map((service) => {
        const matchbranchrate = service.selected.find(
          (b) => b.branch_id === selectedBranch
        )
        const rawRate = matchbranchrate.hsn_id?.onValue?.igstRate ?? 0 // can be '18', 0, null, undefined
        const hsn = Number(rawRate) || 0 // treat null/undefined/NaN as 0

        const price = Number(service.productPrice) || 0 // base price

        const actualNetAmount =
          hsn > 0 ? Number((price * (1 + hsn / 100)).toFixed(2)) : price

        return {
          ...emptyRow,
          licenseNumber: "",
          licenseNumbers: [],
          productorServiceId: getRowId(service),
          productorServiceName:
            service?.productName || service?.serviceName || "",
          itemType: service?.productName ? "Product" : "Service",
          productPrice: 0,
          hsn: 0,
          productorservicetype:
            service?.productorservicetype || "Additionalservice",
          netAmount: 0,
          isDefaultService: true,
          parentPrimaryProductId: primaryId,
          actualHsn: hsn,
          actualproductPrice: service?.productPrice,
          actualNetAmount,
          company_id: branchdata[0].company_id,
          branch_id: branchdata[0].branch_id
        }
      })
      // const defaultServiceRows = (prod?.defaultservices || []).map(
      //   (service) => ({
      //     ...emptyRow,
      //     licenseNumber: "",
      //     licenseNumbers: [],
      //     productorServiceId: getRowId(service),
      //     productorServiceName:
      //       service?.productName || service?.serviceName || "",
      //     itemType: service?.productName ? "Product" : "Service",
      //     productPrice: 0,
      //     hsn: 0,
      //     productorservicetype:
      //       service?.productorservicetype || "Additionalservice",
      //     netAmount: 0,
      //     isDefaultService: true,
      //     parentPrimaryProductId: primaryId,
      //     actualproductPrice: service?.productPrice
      //     // actualNetAmount:netAmount
      //   })
      // )

      updated.splice(index + 1, 0, ...defaultServiceRows)
    }

    setSearch(prod.productName || prod.serviceName || "")
    console.log(updated)
    setSelectedLeadList(updated)
    console.log("hh")
  }
  console.log(selectedleadlist)
  const handleInputChange = (e) => {
    console.log(e)
    const value = e.target.value
    setSearch(value)
    setOpen(true)

    const exact = (leadList || []).find(
      (p) => p.productName === value || p.serviceName === value
    )
    if (exact) applySelection(exact)
    else if (!value) applySelection(null)
  }

  const handleClear = () => {
    applySelection(null)
    setOpen(false)
  }
  console.log(search)
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
      {selectionMessage && selectionMessage.productmessage && (
        <p className="text-red-400">{selectionMessage.productmessage}</p>
      )}
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
  Data = null,
  Breadcrumblist,
  isReadOnly = false,
  from = null,
  handleleadData,
  handleEditData,
  handleclosingData,
  loadingState,
  setLoadingState,
  editloadingState,
  seteditLoadingState,
  showmessage,
  showpopupMessage,
  selectedcompanyBranch
}) => {
  console.log(from)
  console.log(Data)
  console.log(isReadOnly)
  const {
    register: registerMain,
    handleSubmit: handleSubmitMain,
    setValue: setValueMain,
    watch: watchMain,
    control: controlMain,
    reset: resetMain,

    clearErrors: clearMainerrors,
    formState: { errors: errorsMain }
  } = useForm()

  const {
    register: registerModal,
    handleSubmit: handleSubmitModal,
    setValue: setValueModal,
    getValues: getValuesModal,
    watch: watchModal,
    control: controlModal,
    setError,
    clearErrors: clearmodalErros,
    formState: { errors: errorsModal },
    reset: resetModal,
    watch
  } = useForm()

  const [productOrserviceSelections, setProductorServiceSelections] = useState(
    {}
  )
const mobileRegister = registerMain("mobile");
  const today = new Date().toISOString().split("T")[0]
  const [takenLicenses, setTakenLicense] = useState([])
  console.log(takenLicenses)
  const [warningErrors, setwarningError] = useState({})
  const [haveprimaryProduct, sethaveprimaryProduct] = useState(false)
  const [unselectedtaggedlicense, setunselectedtaggedlicense] = useState({})
  console.log(unselectedtaggedlicense)
  console.log(warningErrors)
  const [licenseloading, setlicenseloading] = useState(false)
  const [leadList, setLeadList] = useState([])
  const [submitLoading, setsubmitLoading] = useState(false)
  const [popupOpen, setPopupOpen] = useState(false)
  const [formData, setFormData] = useState(null)
  const [restrictionMessage, setrestrictMessage] = useState()
  const [isEligible, setIseligible] = useState(false)
  const [openLicenseDropdown, setOpenLicenseDropdown] = useState(null)
  const [openProductDropdown, setOpenProductDropdown] = useState(null)
  const [popupMessage, setPopupMessage] = useState("")
  const [warningMessage, setwarningMessage] = useState("")
  console.log(warningErrors)
  const [showdetailsopen, setdetailsopen] = useState(false)
  const [detailsItem, setDetailsItem] = useState(null)
  const [detailsIndex, setDetailsIndex] = useState(null)
  const [detailsForm, setDetailsForm] = useState({
    name: "",
    licenseNumber: "",
    softwareTrade: "",
    applicationDate: "",
    status: "Running",
    nextDue: "",
    quantityUsers: "",
    productAmount: "",
    taggeddata: []
  })
  console.log(detailsForm?.length)
  console.log(detailsForm)
  console.log(warningMessage)
  const [ispopupModalOpen, setIspopupModalOpen] = useState(false)
  const [isSelfAllocationChangable, setselfAllocationChangable] = useState(true)
  const [modalloader, setModalLoader] = useState(false)
  const [selfAllocation, setselfAllocation] = useState(false)
  const [partner, setPartner] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [licensewithoutProductSelection, setlicenseWithoutProductSelection] =
    useState({})
  const [iscustomerchangeandbranch, setcustomerchangeandbranch] =
    useState(isReadOnly)
  const [selectedState, setSelectedState] = useState(null)
  const [selectedleadlist, setSelectedLeadList] = useState([])
  console.log(selectedleadlist)
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
  const [selectedBranch, setSelectedBranch] = useState(selectedcompanyBranch)
  const [tasklist, settasklist] = useState([])
  const [allcustomer, setallcustomer] = useState([])
  const [selectedUserName, setselecteduserName] = useState(null)
  const [selectedCategory, setselectedCategory] = useState(null)
  const [selectedDatapopup, setselectedDataPopup] = useState({})
  const [selectedYear, setSelectedYear] = useState(null)
  const [periodMode, setperiodMode] = useState("all")
  const [targetData, settargetData] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [productlist, setproductList] = useState([])
  const [achievedproducts, setacheivedProducts] = useState([])
  const [selectedPeriod, setselectedPeriod] = useState("")
  const dropdownLicenseRef = useRef(null)
  const dropdownLeadforRef = useRef(null)
  const registrationType = watchModal("registrationType")
  const navigate = useNavigate()
  const location = useLocation()
  const mobileValue = watchModal("mobile")
  const mobileMainValue = watchMain("mobile")
  const customerNameValue = watchModal("customerName")
  const customerMainValue = watchMain("customerName")
  const customerIdValue = watchModal("customerid")
  const customerMainIdValule = watchMain("customerid")
  const [isTradeOpen, setIsTradeOpen] = useState(false)
  const discountAmount = watchMain("discamnt")
  const tradeDropdownRef = useRef(null)
const isFirstRender = useRef(true);
const isMobileTypedByUser = useRef(false);
  console.log(mobileValue)
  console.log(customerNameValue)
  console.log(customerIdValue)
  const [duplicateWarning, setDuplicateWarning] = useState("")
  const [checkingDuplicate, setCheckingDuplicate] = useState(false)
  const { data: productData, loading: productLoading } = UseFetch(
    loggeduser &&
      selectedBranch &&
      selectedBranch.length &&
      `/product/getallProducts?branchselected=${encodeURIComponent(
        JSON.stringify(selectedBranch)
      )}`
  )
  console.log(productData)
  const filter = productData?.filter(
    (item) => item.productName === "MARG ERP NANO"
  )
  console.log(filter)
  const { data: tasks } = UseFetch("lead/getallTask")
  const { data: companybranches } = UseFetch("/branch/getBranch")
  const { data: partners } = UseFetch("/customer/getallpartners")
  const { data: serviceData } = UseFetch(
    loggeduser &&
      selectedBranch &&
      `/product/getallServices?branchselected=${selectedBranch}`
  )

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        tradeDropdownRef.current &&
        !tradeDropdownRef.current.contains(event.target)
      ) {
        setIsTradeOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])
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
  console.log(customerData)
  // Track timers for each row index
  const debounceTimersRef = useRef({})
  console.log(selectedleadlist)
  const emptyRow = {
    licenseNumber: "",
    productorServiceId: "",
    productorServiceName: "",
    productPrice: "",
    hsn: "",
    netAmount: ""
  }

  const canSelfAllocate =
    loggeduser?.department?._id === "670c866552847bbebbd35748" ||
    loggeduser?.department?._id === "670c867352847bbebbd35750"

  useEffect(() => {
    console.log("jjjj")
    setSelectedBranch(selectedcompanyBranch)
  }, [selectedcompanyBranch])
  // useEffect(() => {
  //   if (!selfAllocation) {
  //     setValueMain("allocationType", undefined);
  //     setValueMain("dueDate", undefined);
  //   }
  // }, [selfAllocation]);
  // useEffect(() => {
  //   if (!selfAllocation) {
  //     unregister("allocationType");
  //     unregister("dueDate");
  //   }
  // }, [selfAllocation, unregister]);
  useEffect(() => {
    const cleanedMobile = String(mobileValue || "")
      .replace(/^\+?91/, "")
      .replace(/\D/g, "")
    console.log(cleanedMobile)
    const cleanedName = String(customerNameValue || "").trim()

    if (cleanedMobile.length !== 10 || !cleanedName) {
      setDuplicateWarning("")
      return
    }
    console.log("hh")
    const timer = setTimeout(async () => {
      try {
        setCheckingDuplicate(true)

        const res = await api.post("/lead/check-customer-duplicate", {
          mobile: cleanedMobile,
          customerName: cleanedName,
          customerId: customerIdValue || ""
        })
        console.log(res)
        if (res?.data?.exists) {
          setDuplicateWarning(res.data.message)
        } else {
          setDuplicateWarning("")
        }
      } catch (error) {
        setDuplicateWarning("")
      } finally {
        setCheckingDuplicate(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [mobileValue, customerNameValue, customerIdValue])
  console.log(duplicateWarning)
  console.log(mobileValue)
  console.log(customerNameValue)
  console.log(customerIdValue)
  useEffect(() => {
  if (isFirstRender.current) {
console.log(isFirstRender)
    isFirstRender.current = false;
    return;
  }
console.log(isMobileTypedByUser)
  if (!isMobileTypedByUser.current) return;
    const cleanedMobile = String(mobileMainValue || "")
      .replace(/^\+?91/, "")
      .replace(/\D/g, "")
    const selectedCustomerOption =
      customerOptions.find((o) => o.value === customerMainValue) || null

    const customerName = selectedCustomerOption?.label || ""
    console.log(cleanedMobile)
    const cleanedName = String(customerName || "").trim()
    console.log(cleanedName)

    if (cleanedMobile.length !== 10 || !cleanedName) {
      setDuplicateWarning("")
      return
    }
    console.log("hh")
    const timer = setTimeout(async () => {
      try {
        setCheckingDuplicate(true)

        const res = await api.post("/lead/check-customer-duplicate", {
          mobile: cleanedMobile,
          customerName: cleanedName,
          customerId: customerMainIdValule || ""
        })
        console.log(res)
        if (res?.data?.exists) {
          setDuplicateWarning(res.data.message)
        } else {
          setDuplicateWarning("")
        }
      } catch (error) {
        setDuplicateWarning("")
      } finally {
        setCheckingDuplicate(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [mobileMainValue])
  console.log(duplicateWarning)
  useEffect(() => {
    if (!selectedleadlist || selectedleadlist.length === 0) {
      console.log("hh")
      setSelectedLeadList([{ ...emptyRow }])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const taxableAmount = Number(watch("taxableAmount") || 0)
  const taxAmount = Number(watch("taxAmount") || 0)

  useEffect(() => {
    console.log("hhh")
    const exactTotal = taxableAmount + taxAmount
    const net = +exactTotal.toFixed(2)
    setValueMain("netAmount", net, { shouldValidate: true })
  }, [taxableAmount, taxAmount, setValueMain])

  useEffect(() => {
    console.log("hhhh")
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
      console.log("hhhh")
      settasklist(tasks.filter((item) => item.taskName === "Followup"))
    }
  }, [tasks])

  useEffect(() => {
    console.log("jjj")
    if (showmessage) {
      setIspopupModalOpen(true)
    }
  }, [showmessage])

  useEffect(() => {
    console.log("jj")
    if (selectedBranch) {
      setValueMain("leadBranch", selectedBranch)
    }
  }, [selectedBranch])

  useEffect(() => {
    console.log("hhhh")
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
      const combinedlead = [...productData]
      const productsWithType = productData.filter(
        (item) =>
          item?.productorservicetype !== null &&
          item?.productorservicetype !== undefined &&
          String(item?.productorservicetype).trim() !== ""
      )
      console.log(productsWithType)
      setLeadList(productsWithType)
    }
  }, [loggeduser, branches, productData, serviceData, partners, selectedBranch])

  useEffect(() => {
    console.log("hhhh")
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
    console.log("hhhh")
    if (loggeduser?._id) {
      if (Data && Data.length) {
        setValueMain("leadBy", Data[0].leadBy._id)
      } else {
        setValueMain("leadBy", loggeduser._id)
      }
    }
  }, [loggeduser, setValueMain, Data])

  useEffect(() => {
    console.log("hhh")
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

      setValueMain("leadId", Data[0]?.leadId)
      setValueMain("partner", Data[0]?.partner)
      setValueMain("remark", Data[0].remark)
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
      setValueMain("remark", Data[0].remark)
      setSelectedCustomer(Data[0]?.customerName)
      console.log(Data[0].leadFor)
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
        price: item?.price,
        company_id: item?.company_id,
        branch_id: item?.branch_id,
        productorservicetype: item?.productorservicetype
      }))
      console.log(leadData)
      console.log(process)
      const ihaveprimaryproduct =
        leadData[0]?.productorservicetype === "Primaryproduct"
      if (
        process === "closing" &&
        leadData[0]?.productorservicetype === "Primaryproduct"
      ) {
        sethaveprimaryProduct(true)
        const primary = leadData[0]
        console.log("hh")
        const primaryProductId = getRowId(primary?.productorServiceId)
        const primaryProduct = getPrimaryProductFromLeadList(primary)
        console.log(primaryProduct)
        if (!primaryProduct) {
          toast.error("Primary product details not found")
          return
        }

        const defaultServices = Array.isArray(primaryProduct?.defaultservices)
          ? primaryProduct.defaultservices
          : []

        // Always initialize with the lead data first
        setSelectedLeadList((prev) => {
          const rows = [...leadData]

          // If there are no default services, just return the lead data.
          if (!defaultServices.length) {
            return rows
          }

          const existingIds = getExistingAdditionalServiceIdsForPrimary(
            rows,
            0,
            primaryProductId
          )

          const servicesToAdd = defaultServices.filter((service) => {
            const serviceId = getRowId(service)
            return serviceId && !existingIds.has(serviceId)
          })

          if (!servicesToAdd.length) {
            return rows
          }

          const newRows = servicesToAdd.map((service) => {
            const serviceId = getRowId(service)
            const igstRate = getBranchIgstRate(service)
            const productPrice = Number(service?.productPrice ?? 0)
            const taxAmount = (productPrice * igstRate) / 100
            const actualNetAmount = productPrice + taxAmount
            console.log(service)
            console.log(igstRate)
            console.log(productPrice)
            console.log(taxAmount)
            return {
              ...emptyRow,
              licenseNumber: "",
              licenseNumbers: [],
              productorServiceId: serviceId,
              productorServiceName:
                service?.shortName || service?.productName || "",
              itemType: service?.productName ? "Product" : "Service",
              productorservicetype:
                service?.productorservicetype || "Additionalservice",
              productPrice: 0,
              hsn: 0,
              netAmount: 0,
              isDefaultService: true,
              parentPrimaryProductId: primaryProductId,
              company_id: service?.selected?.[0]?.company_id,
              branch_id: service?.selected?.[0]?.branch_id,
              actualproductPrice: productPrice,
actualHsn:igstRate,
              actualNetAmount: Number(productPrice + taxAmount)
            }
          })

          let insertAt = 1

          while (insertAt < rows.length) {
            const nextType = String(
              rows[insertAt]?.productorservicetype || ""
            ).toLowerCase()

            if (nextType === "primaryproduct") break

            insertAt++
          }

          rows.splice(insertAt, 0, ...newRows)

          return rows
        })
      } else {
        setSelectedLeadList(leadData)
      }

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
      console.log(ihaveprimaryproduct)
      if (!ihaveprimaryproduct) {
        console.log(Data[0])
        const selectedcustomerlicenseandproduct =
          Data[0]?.customerName?.selected
            ?.filter(
              (sel) =>
                sel?.licensenumber != null &&
                String(sel.licensenumber).trim() !== ""
            )
            .map((sel) => ({
              licenseNumber: sel.licensenumber,
              productName: sel?.product_id?.productName || "Unknown",
              productorServiceId: sel?.product_id?._id
            })) || []

        console.log("d")
        setcustomerTableData(selectedcustomerlicenseandproduct)
      }
    }
  }, [customerOptions, Data])

  useEffect(() => {
    if (customerData && customerData.length > 0) {
      setallcustomer(customerData)
    }
  }, [customerData])
  console.log(customerData)
  useEffect(() => {
    if (customerData && customerData.length && selectedBranch) {
      const options = customerData.map((item) => {
        const matchingSelected = item.selected?.find(
          (sel) => sel.branch_id === selectedBranch
        )
        console.log(item?.partner)
        return {
          value: item?._id,
          label: item?.customerName,
          address: item?.address1,
          mobile: item?.mobile || "",
          license: matchingSelected?.licensenumber || "",
          email: item?.email,
          phone: item?.landline,
          partner: item?.partner
        }
      })
      setCustomerOptions(options)
    }
  }, [customerData])

  useEffect(() => {
    console.log("hhh")
    if (selectedCustomer) {
      console.log(selectedCustomer)
      setValueMain("mobile", selectedCustomer.mobile)
      setValueMain("phone", selectedCustomer.phone)
      setValueMain("email", selectedCustomer.email)
      setValueMain(
        "partner",
        selectedCustomer?.partner?._id
          ? selectedCustomer?.partner?._id
          : selectedCustomer?.partner
      )
    }
  }, [selectedCustomer])

  useEffect(() => {
    console.log("hhh")
    if (alluser) {
      const { allusers = [], allAdmins = [] } = alluser
      const combinedUsers = [...allusers, ...allAdmins]
      setallStaffs(combinedUsers)
    }
  }, [alluser])

  // useEffect(() => {
  //   console.log("hhh")
  //   setValueMain("netAmount", calculateTotalAmount())
  //   setValueMain("taxAmount", calculatetaxAmount())
  //   setValueMain("taxableAmount", calculatetaxableAmount())
  // }, [selectedleadlist])
  useEffect(() => {
    const total = Number(calculateTotalAmount()) || 0
    const discount = Number(discountAmount) || 0
    console.log(discount)
    setValueMain("taxAmount", calculatetaxAmount())
    setValueMain("taxableAmount", calculatetaxableAmount())
    console.log(selectedleadlist)
    setValueMain("netAmount", Math.max(total - discount, 0).toFixed(2))
  }, [selectedleadlist, discountAmount])

  useEffect(() => {
    console.log("hhh")
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
  // const updateLicense = (index, licenseNumber) => {
  //   setSelectedLeadList((prev) =>
  //     prev.map((row, i) =>
  //       i === index
  //         ? {
  //             ...row,
  //             licenseNumber
  //           }
  //         : row
  //     )
  //   )
  // }
  const updateLicense = (index, licenseNumber) => {
    console.log(licenseNumber)
    setSelectedLeadList((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              licenseNumber
            }
          : row
      )
    )
  }
  console.log(selectedleadlist)
  // const handleLicenseBlur = async (index, licenseNumber) => {
  //   console.log(licenseNumber)
  //   if (!String(licenseNumber).trim()) return
  //   console.log(licenseNumber)
  //   try {
  //     setlicenseloading(true)
  //     const { data } = await api.get(
  //       `/customer/checkLicense?licenseNumber=${licenseNumber}`
  //     )
  //     console.log(data)
  //     if (data.exists) {
  //       toast.error(`License ${licenseNumber} already exists`)

  //       setSelectedLeadList((prev) =>
  //         prev.map((row, i) => (i === index ? { ...row } : row))
  //       )

  //       return
  //     }
  //     // setlicenseloading(false)
  //     toast.success("License available")
  //   } catch (error) {
  //     // setlicenseloading(false)
  //     console.error(error)
  //     toast.error("Failed to validate license")
  //   } finally {
  //     setlicenseloading(false)
  //   }
  // }
  //   const processLicenseChange = async (index, licenseValue, item) => {
  //     const isValid = await handleLicenseBlur(index, licenseValue)

  //     if (!isValid) return
  // console.log(detailsForm)
  //     setDetailsForm((prev) => {
  //       const tagged = prev.taggeddata || []
  //       const existingIndex = tagged.findIndex((x) => x.sourceIndex === index)

  //       const newEntry = {
  //         sourceIndex: index,
  //         licensenumber: licenseValue,
  //         nextDue: ""
  //       }

  //       const updatedTagged =
  //         existingIndex !== -1
  //           ? tagged.map((x) => (x?.sourceIndex === index ? newEntry : x))
  //           : [...tagged, newEntry]

  //       return {
  //         ...prev,
  //         taggeddata: updatedTagged
  //       }
  //     })

  //     const filteredadditionalservice = selectedleadlist.filter(
  //       (item) => item.productorservicetype?.toLowerCase() === "additionalservice"
  //     )
  // console.log(filteredadditionalservice)
  // console.log(selectedleadlist)
  //     if (filteredadditionalservice.length) {
  //       setSelectedLeadList((prev) =>
  //         prev.map((row) => ({
  //           ...row,
  //           licenseNumbers: (row.licenseNumbers || []).map((lic) =>
  //             lic.sourceIndex === index
  //               ? {
  //                   ...lic,
  //                   licenseNumber: licenseValue,
  //                   nextDue: ""
  //                 }
  //               : lic
  //           )
  //         }))
  //       )
  //     }
  // console.log(customerTableData)
  // const exists = customerTableData.some(
  //   (row) => String(row.licenseNumber) === String(licenseValue)
  // );

  // if (exists) {
  //   console.log("License already present");
  // } else {
  //   console.log("License not found");
  // }
  //     // setcustomerTableData((prev) =>
  //     //   prev.map((row) =>
  //     //     row?.sourceIndex === index
  //     //       ? {
  //     //           ...row,
  //     //           licenseNumber: licenseValue,
  //     //           productName: item?.productorServiceName,
  //     //           productorServiceId: item?.productorServiceId,
  //     //           sourceIndex: index
  //     //         }
  //     //       : row
  //     //   )
  //     // )
  // setcustomerTableData((prev) => {
  //   const existingIndex = prev.findIndex(
  //     (row) => row?.sourceIndex === index
  //   );

  //   const newRow = {
  //     licenseNumber: licenseValue,
  //     productName: item?.productorServiceName,
  //     productorServiceId: item?.productorServiceId,
  //     sourceIndex: index,
  //   };

  //   if (existingIndex !== -1) {
  //     return prev.map((row, i) =>
  //       i === existingIndex ? { ...row, ...newRow } : row
  //     );
  //   }

  //   return [...prev, newRow];
  // });

  //     updateLicense(index, licenseValue)
  //   }
  // const handleLicenseBlur = async (index, licenseNumber) => {
  //   if (!String(licenseNumber).trim()) return false

  //   try {
  //     setlicenseloading(true)

  //     const { data } = await api.get(
  //       `/customer/checkLicense?licenseNumber=${licenseNumber}`
  //     )

  //     if (data.exists) {
  //       toast.error(`License ${licenseNumber} already exists`)
  //       return false
  //     }

  //     toast.success("License available")
  //     return true
  //   } catch (error) {
  //     console.error(error)
  //     toast.error("Failed to validate license")
  //     return false
  //   } finally {
  //     setlicenseloading(false)
  //   }
  // }
  console.log(detailsForm)
  const processLicenseChange = async (index, licenseValue, item) => {
    console.log("hh")
    const isValid = await handleLicenseBlur(index, licenseValue)

    if (!isValid) return

    setDetailsForm((prev) => {
      const tagged = prev.taggeddata || []
      const existingIndex = tagged.findIndex((x) => x.sourceIndex === index)

      const newEntry = {
        sourceIndex: index,
        licensenumber: licenseValue,
        nextDue: ""
      }

      const updatedTagged =
        existingIndex !== -1
          ? tagged.map((x) => (x?.sourceIndex === index ? newEntry : x))
          : [...tagged, newEntry]
      console.log(updatedTagged)
      return {
        ...prev,
        taggeddata: updatedTagged
      }
    })

    setSelectedLeadList((prev) =>
      prev.map((row) => ({
        ...row,
        licenseNumbers: (row.licenseNumbers || []).map((lic) =>
          lic.sourceIndex === index
            ? {
                ...lic,
                licenseNumber: licenseValue,
                nextDue: ""
              }
            : lic
        )
      }))
    )

    setcustomerTableData((prev) => {
      const existingIndex = prev.findIndex((row) => row?.sourceIndex === index)

      const newRow = {
        licenseNumber: licenseValue,
        productName: item?.productorServiceName,
        productorServiceId: item?.productorServiceId,
        sourceIndex: index
      }

      if (existingIndex !== -1) {
        return prev.map((row, i) =>
          i === existingIndex ? { ...row, ...newRow } : row
        )
      }

      return [...prev, newRow]
    })
  }

  const handleLicenseBlur = async (index, licenseNumber) => {
    if (!String(licenseNumber).trim()) return false

    try {
      setlicenseloading(true)

      const { data } = await api.get(
        `/customer/checkLicense?licenseNumber=${licenseNumber}`
      )

      if (data.exists) {
        toast.error(`License ${licenseNumber} already exists`)
        return false
      }
      toast.success(`License ${licenseNumber} available `)
      return true
    } catch (error) {
      console.error(error)
      toast.error("Failed to validate license")
      return false
    } finally {
      setlicenseloading(false)
    }
  }
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
    console.log("hhh")
    if (defaultCountry) {
      setSelectedCountry(defaultCountry)
      setValueModal("country", defaultCountry.value)
    }
  }, [defaultCountry])

  useEffect(() => {
    console.log("hhh")
    const currentState = getValuesModal("state")
    console.log("defaultState:", defaultState)
    console.log("currentState:", currentState)
    console.log("condition:", defaultState && !currentState)
    if (defaultState && !currentState) {
      console.log("jjjj")
      setSelectedState(defaultState)
      setValueModal("state", defaultState.value)
    }
  }, [defaultState, getValuesModal, setValueModal])

  const handleOpenmodal = () => {
    console.log("h")
    setModalOpen(true)
    clearMainerrors()
    if (Data && Data.length) {
      setValueModal("customerName", Data[0]?.customerName?.customerName)
      setValueModal("customerid", Data[0]?.customerName?._id)
      setValueModal("leadid", Data[0]?._id)
      setValueModal("email", Data[0]?.customerName?.email)
      setValueModal("mobile", Data[0]?.customerName?.mobile)
      setValueModal("landline", Data[0]?.customerName?.landline)
      setValueModal("contactPerson", Data[0]?.customerName?.contactPerson)
      setValueModal("address1", Data[0]?.customerName?.address1)
      setValueModal("pincode", Data[0]?.customerName?.pincode)
      setValueModal("partner", Data[0]?.customerName?.partner?._id)
      setValueModal("registrationType", Data[0]?.customerName?.registrationType)
      setValueModal("gstNo", Data[0]?.customerName?.gstNo)
      setValueModal("city", Data[0]?.customerName?.city)
      console.log("hhh")
    }
  }

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
  const getBranchIgstRate = (prod) => {
    const filteredbranch = prod?.selected?.filter(
      (item) => item?.branch_id === selectedBranch
    )
    console.log(prod.selected)
    console.log(selectedBranch)
    console.log(filteredbranch[0])
    return Number(filteredbranch?.[0]?.hsn_id?.onValue?.igstRate || 0)
  }

  // const getRowId = (value) => {
  //   console.log(value)
  //   return String(value?._id || value?.id || value || "")
  // }//old
  const getRowId = (value) => {
    console.log(value)
    if (!value) return ""

    return String(value._id ?? value.id ?? value).trim()
  } //new code

  const getPrimaryProductFromLeadList = (row) => {
    const primaryProductId = getRowId(row?.productorServiceId)
    console.log(leadList)
    return (leadList || []).find((prod) => {
      const prodId = getRowId(prod)
      const prodType = String(prod?.productorservicetype || "").toLowerCase()
      return prodId === primaryProductId && prodType === "primaryproduct"
    })
  }

  // const getExistingAdditionalServiceIdsForPrimary = (
  //   rows,
  //   rowIndex,
  //   primaryProductId
  // ) => {
  //   const existingIds = new Set()
  //   console.log(rows)
  //   console.log(rowIndex)
  //   console.log(primaryProductId)
  //   rows.forEach((item) => {
  //     const itemType = String(item?.productorservicetype || "").toLowerCase()
  //     const parentId = getRowId(item?.parentPrimaryProductId)

  //     if (itemType === "additionalservice" && parentId === primaryProductId) {
  //       existingIds.add(getRowId(item?.productorServiceId))
  //     }
  //   })

  //   let pointer = rowIndex + 1
  //   while (pointer < rows.length) {
  //     const nextRow = rows[pointer]
  //     const nextType = String(nextRow?.productorservicetype || "").toLowerCase()

  //     if (nextType === "primaryproduct") break

  //     if (nextType === "additionalservice") {
  //       existingIds.add(getRowId(nextRow?.productorServiceId))
  //     }

  //     pointer++
  //   }

  //   return existingIds
  // }
  const getExistingAdditionalServiceIdsForPrimary = (
    rows,
    rowIndex,
    primaryProductId
  ) => {
    const existingIds = new Set()

    let pointer = rowIndex + 1

    while (pointer < rows.length) {
      const row = rows[pointer]
      const rowType = String(row?.productorservicetype || "").toLowerCase()

      // Stop when the next primary product starts
      if (rowType === "primaryproduct") break

      if (
        rowType === "additionalservice" &&
        getRowId(row?.parentPrimaryProductId) === getRowId(primaryProductId)
      ) {
        existingIds.add(getRowId(row?.productorServiceId))
      }

      pointer++
    }
    // console.log(existingIds)
    return existingIds
  }
  const getRemainingAdditionalServicesCount = (row, rowIndex) => {
    const primaryProduct = getPrimaryProductFromLeadList(row)
    console.log(primaryProduct)
    if (!primaryProduct) return 0

    const primaryProductId = getRowId(row?.productorServiceId)
    const defaultServices = Array.isArray(primaryProduct?.defaultservices)
      ? primaryProduct.defaultservices
      : []
    console.log(!defaultServices.length)
    if (!defaultServices.length) return 0
    console.log("hhhhh")
    const existingIds = getExistingAdditionalServiceIdsForPrimary(
      selectedleadlist || [],
      rowIndex,
      primaryProductId
    )

    return defaultServices.filter((service) => {
      const serviceId = getRowId(service)
      console.log(serviceId)
      console.log(existingIds)
      console.log(serviceId && !existingIds.has(serviceId))
      return serviceId && !existingIds.has(serviceId)
    }).length
  }

  const addAdditionalServicesForPrimaryRow = (row, rowIndex) => {
    console.log(row)

    if (!row?.productorServiceId) return

    const primaryProductId = getRowId(row?.productorServiceId)
    const primaryProduct = getPrimaryProductFromLeadList(row)
    console.log(primaryProduct)
    if (!primaryProduct) {
      toast.error("Primary product details not found")
      return
    }

    const defaultServices = Array.isArray(primaryProduct?.defaultservices)
      ? primaryProduct.defaultservices
      : []
    console.log(defaultServices)

    if (!defaultServices.length) {
      toast.info("No additional services available for this primary product")
      return
    }
    console.log(selectedleadlist)

    setSelectedLeadList((prev) => {
      const rows = Array.isArray(prev) ? [...prev] : []

      const existingIds = getExistingAdditionalServiceIdsForPrimary(
        rows,
        rowIndex,
        primaryProductId
      )

      const servicesToAdd = defaultServices.filter((service) => {
        const serviceId = getRowId(service)
        return serviceId && !existingIds.has(serviceId)
      })

      if (!servicesToAdd.length) {
        toast.info("Additional services already added for this primary product")
        return prev
      }
      console.log(row)
      console.log(servicesToAdd)

      const newRows = servicesToAdd.map((service) => {
        console.log(service)
        const serviceId = getRowId(service)
        const igstRate = getBranchIgstRate(service)
        const productPrice = Number(service?.productPrice ?? 0)
        const taxAmount = (productPrice * igstRate) / 100
        const actualNetAmount = productPrice + taxAmount
        return {
          ...emptyRow,
          licenseNumber: "",
          licenseNumbers: [],
          productorServiceId: serviceId,
          productorServiceName:
            service?.productName || service?.serviceName || "",
          itemType: service?.productName ? "Product" : "Service",
          productorservicetype:
            service?.productorservicetype || "Additionalservice",
          productPrice: 0,
          hsn: igstRate || 0,
          netAmount: 0,
          isDefaultService: true,
          parentPrimaryProductId: primaryProductId,
          company_id: service?.selected[0]?.company_id,
          branch_id: service?.selected[0]?.branch_id,
          actualNetAmount
        }
      })

      let insertAt = rowIndex + 1
      while (insertAt < rows.length) {
        const nextType = String(
          rows[insertAt]?.productorservicetype || ""
        ).toLowerCase()
        if (nextType === "primaryproduct") break
        insertAt++
      }
      console.log(newRows)
      rows.splice(insertAt, 0, ...newRows)
      return rows
    })
  }
  console.log(selectedleadlist)
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
  console.log(detailsForm)
  // const handleTaggedDueChange = (rowIndex, value, term, hsn) => {
  //   console.log(term)
  //   console.log(value)
  //   console.log(rowIndex)
  //   console.log(detailsForm)
  //   if (!haveprimaryProduct) {
  //     const taxAmount = (Number(hsn) / 100) * Number(value)
  //     console.log(taxAmount)
  //     console.log(hsn)
  //     console.log(value)
  //     const valueNum = Number(value) // or parseFloat(value)
  //     const taxAmountNum = Number(taxAmount) // if taxAmount might be a string

  //     const taxinclusiveamount = valueNum + taxAmountNum
  //   }

  //   console.log(taxinclusiveamount)
  //   setDetailsForm((prev) => ({
  //     ...prev,
  //     taggeddata: prev.taggeddata.map((row, i) =>
  //       i === rowIndex
  //         ? { ...row, [term]: value, actualNetAmount: taxinclusiveamount }
  //         : row
  //     )
  //   }))
  // }
  console.log(detailsForm)
  console.log(selectedleadlist)
  const handleTaggedDueChange = (rowIndex, value, term, hsn, productType) => {
    console.log(rowIndex)
    console.log(value)
    console.log(term)
    console.log(hsn)
    console.log(productType)
    console.log("Hhhz")
    setDetailsForm((prev) => ({
      ...prev,
      taggeddata: prev.taggeddata.map((row, i) => {
        if (i !== rowIndex) return row

        const updatedRow = {
          ...row,
          [term]: value
        }
        if (term !== "nextDue") {
          if (productType.toLowerCase() === "additionalservice") {
            console.log("hhh")
            const taxAmount = (Number(hsn) / 100) * Number(value)
            console.log(value)
            console.log(taxAmount)
            console.log(Number(value) + taxAmount)
            const total = Math.round(Number(value) + taxAmount)
            console.log(total)
            updatedRow.taxinclusiveamount = total
            updatedRow.taxexclusiveAmount = value
            updatedRow.productAmount = total
          }
        }

        return updatedRow
      })
    }))
    console.log("hhh")
  }
  console.log(selectedleadlist)
  console.log(detailsForm)
  const handleSelectedCustomer = (option) => {
    console.log(option)
    console.log(allcustomer)
    const matchedCustomer = allcustomer?.find((item) => {
      return item?._id === option?.value
    })
    console.log(matchedCustomer)

    setSelectedCustomer(option)

    const customerLicense =
      matchedCustomer?.selected?.find(
        (sel) => String(sel.branch_id) === String(selectedBranch)
      )?.licensenumber || ""
    console.log(matchedCustomer)
    setcustomerTableData(
      matchedCustomer?.selected
        ?.filter(
          (sel) =>
            String(sel.branch_id) === String(selectedBranch) &&
            sel?.licensenumber != null &&
            String(sel.licensenumber).trim() !== ""
        )
        ?.map((sel) => ({
          licenseNumber: sel.licensenumber || "",
          productName: sel.productName || "Unknown",
          productorServiceId: sel?.product_id
        })) || []
    )

    setSelectedLeadList((prev) => {
      const rows = prev?.length ? [...prev] : [{ ...emptyRow }]
      return rows.map((row, index) =>
        index === 0
          ? {
              ...row,
              licenseNumber: ""
            }
          : row
      )
    })

    setSelectedLicense(customerLicense || "")
  }

  const handlePriceChange = (index, newPrice) => {
    setSelectedLeadList((prevList) =>
      prevList.map((product, i) => {
        if (i !== index) return product

        const price = Number(newPrice || 0)
        const igst = Number(product.hsn || 0)
        const rawNet = price + (igst / 100) * price
        const netAmount = Math.round(rawNet)

        return {
          ...product,
          productPrice: newPrice,
          netAmount
        }
      })
    )
  }

  const handleHsnChange = (index, newHsn) => {
    setSelectedLeadList((prevList) =>
      prevList.map((product, i) => {
        if (i !== index) return product

        const price = Number(product.productPrice || 0)
        const igst = Number(newHsn || 0)
        const rawNet = price + (igst / 100) * price
        const netAmount = Math.round(rawNet)

        return {
          ...product,
          hsn: newHsn,
          netAmount
        }
      })
    )
  }

  // const handleDeletetableData = (item, indexNum) => {
  //   if (item.licenseNumber) {
  //     const updatedProductList = productOrserviceSelections[
  //       item.licenseNumber
  //     ].map((product) =>
  //       product._id === item.productId
  //         ? { ...product, selected: !product.selected }
  //         : product
  //     )
  //     setProductorServiceSelections((prev) => ({
  //       ...prev,
  //       [item.licenseNumber]: updatedProductList
  //     }))
  //   } else {
  //     const updatedProductList = licensewithoutProductSelection.map(
  //       (product) =>
  //         product._id === item.productId
  //           ? { ...product, selected: !product.selected }
  //           : product
  //     )
  //     setlicenseWithoutProductSelection(updatedProductList)
  //   }
  //   const filteredLeadlist = selectedleadlist.filter(
  //     (row, index) => index !== indexNum
  //   )
  //   setSelectedLeadList(
  //     filteredLeadlist.length ? filteredLeadlist : [{ ...emptyRow }]
  //   )
  // }
  const handleDeletetableData = (item, indexNum) => {
    console.log(item)
    console.log(takenLicenses)
    const productId = item.productorServiceId || item?.productId
    setunselectedtaggedlicense((prev) => {
      const updated = { ...prev }
      delete updated[productId]
      return updated
    })
    setTakenLicense((prev) => {
      const updated = { ...prev }

      const keyToDelete = Object.keys(updated).find(
        (key) => key.toLowerCase() === item.productorServiceName.toLowerCase()
      )

      if (keyToDelete) {
        delete updated[keyToDelete]
      }

      return updated
    })

    if (item?.licenseNumber) {
      const updatedProductList = (
        productOrserviceSelections[item.licenseNumber] || []
      ).map((product) =>
        String(product?.id) === String(productId)
          ? { ...product, selected: false }
          : product
      )

      setProductorServiceSelections((prev) => ({
        ...prev,
        [item.licenseNumber]: updatedProductList
      }))
    } else {
      const updatedProductList = (licensewithoutProductSelection || []).map(
        (product) =>
          String(product?.id) === String(productId)
            ? { ...product, selected: false }
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
    setwarningMessage(
      "You can’t add more products; this is limited to a single product."
    )
    setTimeout(() => {
      setwarningMessage("")
    }, 3000)
    return
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

  const validateLeadData = async (leadData, selectedleadlist, role) => {
    const result = await api.get("/lead/checkexistinglead", {
      params: { leadData, selectedleadlist, role }
    })
    // if (
    //   result.data.message ===
    //     "This customer already has a lead with the same product."
    // ) {
    //   return {
    //     eligible: false,
    //     message: `${result.data.message},You can't make leads`
    //   }
    // } else
console.log(result.data.message)
    if (
      result.data.message ===
      "This customer already has a lead with the same product."
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

  const resetLeadForm = () => {
    const defaultBranch =
      Array.isArray(companybranches) && companybranches.length > 0
        ? companybranches[0]?._id || companybranches[0]?.id
        : ""

    resetMain({
      customerName: "",
      leadBranch: selectedBranch || "",
      email: "",
      phone: "",
      mobile: "",
      source: "",
      partner: "",
      allocationType: null,
      dueDate: "",
      remark: "",
      taxableAmount: "",
      taxAmount: "",
      netAmount: "",
      selfAllocation: false,
      leadId: "",
      leadBy: loggeduser?._id || loggeduser?.id || ""
    })

    clearMainerrors()
    setValidateError({})
    setwarningMessage("")
    setSelectedCustomer(null)
    setSelectedLicense(null)
    setcustomerTableData([])
    setSelectedLeadList([{ ...emptyRow }])
    setProductorServiceSelections({})
    setlicenseWithoutProductSelection([])
    setselfAllocation(false)
    setPopupMessage("")
    setPopupOpen(false)
    setIseligible(false)

    if (defaultBranch) {
      setValueMain("leadBranch", selectedBranch)
    }
  }
  const tradeOptions = [
    { value: "Wholesale Trading", label: "Wholesale Trading" },
    { value: "Retail Trading", label: "Retail Trading" },
    { value: "Import & Export", label: "Import & Export" },
    { value: "Distribution / Dealers", label: "Distribution / Dealers" },
    {
      value: "E-commerce / Online Trading",
      label: "E-commerce / Online Trading"
    },
    { value: "IT Services", label: "IT Services" },
    { value: "Web Design & Development", label: "Web Design & Development" },
    { value: "Cyber Security Services", label: "Cyber Security Services" },
    { value: "Hardware & Networking", label: "Hardware & Networking" },
    { value: "Construction Companies", label: "Construction Companies" },
    {
      value: "Pharmaceutical Manufacturing",
      label: "Pharmaceutical Manufacturing"
    },
    { value: "Food Manufacturing", label: "Food Manufacturing" },
    {
      value: "Textile / Garment Manufacturing",
      label: "Textile / Garment Manufacturing"
    },
    { value: "Chemical Manufacturing", label: "Chemical Manufacturing" },
    { value: "Plastic Manufacturing", label: "Plastic Manufacturing" },
    {
      value: "Steel / Metal Manufacturing",
      label: "Steel / Metal Manufacturing"
    },
    { value: "Furniture Manufacturing", label: "Furniture Manufacturing" },
    { value: "Building Contractors", label: "Building Contractors" },
    { value: "Real Estate Developers", label: "Real Estate Developers" },
    {
      value: "Electrical Equipment Manufacturing",
      label: "Electrical Equipment Manufacturing"
    },
    { value: "Electronics Manufacturing", label: "Electronics Manufacturing" },
    { value: "Automobile Manufacturing", label: "Automobile Manufacturing" },
    { value: "Hospitals", label: "Hospitals" },
    { value: "Clinics", label: "Clinics" },
    { value: "Medical Laboratories", label: "Medical Laboratories" },
    {
      value: "Medical Equipment Suppliers",
      label: "Medical Equipment Suppliers"
    },
    {
      value: "Pharmacies / Medical Stores",
      label: "Pharmacies / Medical Stores"
    },
    { value: "Interior Design", label: "Interior Design" },
    { value: "Vehicle Dealers", label: "Vehicle Dealers" },
    {
      value: "Automobile Service Centres",
      label: "Automobile Service Centres"
    },
    { value: "Insurance Companies", label: "Insurance Companies" },
    { value: "Spare Parts Dealers", label: "Spare Parts Dealers" },
    { value: "Transport & Logistics", label: "Transport & Logistics" },
    { value: "Banks", label: "Banks" },
    { value: "Finance Companies", label: "Finance Companies" },
    { value: "Hotels & Resorts", label: "Hotels & Resorts" },
    { value: "Schools", label: "Schools" },
    { value: "Colleges", label: "Colleges" },
    { value: "Training Institutes", label: "Training Institutes" },
    { value: "Coaching Centers", label: "Coaching Centers" },
    { value: "Educational Consultants", label: "Educational Consultants" },
    { value: "Software Development", label: "Software Development" },
    { value: "Restaurants / Cafes", label: "Restaurants / Cafes" },
    { value: "Travel Agencies", label: "Travel Agencies" },
    { value: "Tourism Operators", label: "Tourism Operators" },
    {
      value: "Advertising & Marketing Agencies",
      label: "Advertising & Marketing Agencies"
    },
    { value: "Event Management", label: "Event Management" },
    { value: "Security Services", label: "Security Services" },
    {
      value: "Cleaning / Facility Management",
      label: "Cleaning / Facility Management"
    },
    {
      value: "Chartered Accountants / Audit Firms",
      label: "Chartered Accountants / Audit Firms"
    },
    { value: "Tax Consultants", label: "Tax Consultants" },
    {
      value: "NGOs / Non-Profit Organizations",
      label: "NGOs / Non-Profit Organizations"
    },
    { value: "Government Organizations", label: "Government Organizations" }
  ]
  console.log(selectedleadlist)
  const validateSelectedLeadList = (selectedleadlist = []) => {
    const hasAdditionalService = selectedleadlist.some(
      (row) =>
        String(row?.productorservicetype || "").toLowerCase() ===
        "additionalservice"
    )
    console.log(selectedleadlist)
    console.log(hasAdditionalService)
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
      const rowNo = i + 1
      const type = String(row?.productorservicetype || "").toLowerCase()

      const hasCompany = !!(
        row?.company_id ||
        row?.companyid ||
        row?.companyName
      )
      const hasBranch = !!(row?.branch_id || row?.branchid || row?.branchName)

      if (!hasCompany) {
        return `Company is required in row ${rowNo}`
      }

      if (!hasBranch) {
        return `Branch is required in row ${rowNo}`
      }
      console.log(row)
      const productPrice = Number(
        row?.productprice ?? row?.productPrice ?? row?.amount ?? 0
      )
      console.log(type)
      console.log(productPrice)
      const netAmount = Number(row?.netamount ?? row?.netAmount ?? 0)
      console.log(
        !String(row?.licensenumber || row?.licenseNumber || "").trim()
      )
      if (type === "primaryproduct") {
        if (!String(row?.licensenumber || row?.licenseNumber || "").trim()) {
          console.log("hhh")
          return `License number is required for  ${row?.productorServiceName || row?.productName}`
        }
        if (!row.applicationDate) {
          return `Application date is requiered for  ${row?.productName || row?.productorServiceName},please add details`
        }
        if (!row?.softwareTrade) {
          return `SoftwareTrade is required for ${row?.productName || row?.productorServiceName}`
        }
        if (!(productPrice > 0)) {
          console.log("hhh")
          return `Product price must be greater than 0 for ${row?.productName || row?.productorServiceName}`
        }

        if (!(netAmount > 0)) {
          return `Net amount is required for ${row?.productName || row?.productorServiceName}`
        }
      }

      if (type === "additionalservice") {
        console.log(row)
        const taggeddata = Array.isArray(row?.taggeddata) ? row.taggeddata : []
        const outerLicense = String(
          row?.licensenumber || row?.licenseNumber || ""
        ).trim()
        const hasTaggedLicense = taggeddata.some((tag) =>
          String(tag?.licensenumber || tag?.licenseNumber || "").trim()
        )

        const hasAnyLicense = !!outerLicense || hasTaggedLicense
        console.log(!hasAdditionalService)
        console.log(!hasAdditionalService && !(productPrice > 0))
        if (!hasAdditionalService && !(productPrice > 0)) {
          console.log("jjjj")
          return `Product price must be greater than 0 for ${row?.productName}`
        }

        if (!hasAdditionalService && !(netAmount > 0)) {
          return `Net amount is required for  ${row?.productName || row?.productorServiceName}`
        }
        console.log(taggeddata)

        if (taggeddata.length > 0) {
          for (let j = 0; j < taggeddata.length; j++) {
            const tag = taggeddata[j]
            const tagLicense = String(
              tag?.licensenumber || tag?.licenseNumber || ""
            ).trim()
            const due = parseDateOnly(tag?.nextDue)
            const productAmount = Number(tag?.productAmount)
            if (!tagLicense) {
              console.log("hh")
              return `Tagged license number is required for ${row?.productName || row?.productorServiceName}`
            }
            if (!productAmount > 0) {
              console.log("hh")
              return `Product amount is required for ${row?.productName || row?.productorServiceName} ${tag?.licensenumber},not less than 0`
            }
            if (!due) {
              return `Next due is required for  ${row?.productName || row?.productorServiceName}`
            }

            if (due < today) {
              return `Next due cannot be less than current date for ${row?.productName || row?.productorServiceName}`
            }
          }
        } else {
          console.log(taggeddata)
          if (!row.nextDue) {
            console.log("hh")
            return `Additonal service  ${row?.productName || row?.productorServiceName} must have a nextDue please add Details`
          }
          if (!outerLicense && taggeddata.length === 0) {
            console.log("hhh")
            return `Additional service  ${row?.productName || row?.productorServiceName} must have a license number or tagged license`
          }

          const due = parseDateOnly(row?.nextDue)
          if (!due) {
            return `Next due is required for ${row?.productName || row?.productorServiceName}`
          }

          if (due < today) {
            return `Next due cannot be less than current date for ${row?.productName || row?.productorServiceName}`
          }
        }

        if (!hasAnyLicense) {
          console.log("Hhh")
          return `Additional service ${row?.productName || row?.productorServiceName} must have a license number or tagged license`
        }
      }
    }

    const primaryProducts = selectedleadlist.filter(
      (row) =>
        String(row?.productorservicetype || "").toLowerCase() ===
        "primaryproduct"
    )

    const additionalServices = selectedleadlist.filter(
      (row) =>
        String(row?.productorservicetype || "").toLowerCase() ===
        "additionalservice"
    )

    if (primaryProducts.length > 0 && additionalServices.length > 0) {
      for (let i = 0; i < additionalServices.length; i++) {
        const row = additionalServices[i]
        const rowNo = selectedleadlist.findIndex((x) => x === row) + 1
        const taggeddata = Array.isArray(row?.taggeddata) ? row.taggeddata : []
        const outerLicense = String(
          row?.licensenumber || row?.licenseNumber || ""
        ).trim()
        const hasTaggedLicense = taggeddata.some((tag) =>
          String(tag?.licensenumber || tag?.licenseNumber || "").trim()
        )

        if (!outerLicense && !hasTaggedLicense) {
          return `Additional service  ${row?.productName || row?.productorServiceName} should have any one license number or tagged license number`
        }
      }
    }

    return null
  }
  const onSubmit = async (data) => {
    console.log(data)
console.log(duplicateWarning)
if(duplicateWarning)return
    if (submitLoading) return
    setsubmitLoading(true)
    if (duplicateWarning) return
    const submitData = { ...data }

    if (!selfAllocation) {
      delete submitData.allocationType
      delete submitData.dueDate
    }
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
        console.log("HHH")
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
          submitData,
          filteredleadlist,
          loggeduser.role
        )
        console.log(validation)
        setFormData(submitData)
        setPopupMessage(validation.message)
        if (validation.message === "") {
          const saved = await handlePopupOk(true, submitData)
          if (saved) {
            if (process === "Registration") {
              toast.success("lead created successfully")
            }
          }
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
        const updated = await handleEditData(
          data,
          selectedleadlist,
          Data[0]?._id
        )
      } else if (process === "closing") {
        const validationMessage = validateSelectedLeadList(selectedleadlist)
        console.log(validationMessage)
        if (validationMessage) {
          toast.error(validationMessage)
          return
        }

        console.log(selectedleadlist)
        console.log(loggeduser)
        console.log(data)

        seteditLoadingState(true)
        const updated = await handleclosingData(
          data,
          selectedleadlist,
          Data[0]?._id,
          loggeduser._id,
          loggeduser?.role
        )
      }
    } catch (error) {
      toast.error("Failed to add product!")
    } finally {
      setsubmitLoading(false)
    }
  }
  console.log(selectedleadlist)
  const handlePopupOk = async (ischek = false, leadData = null) => {
    console.log(formData)
    console.log(leadData)
    setPopupOpen(false)
    const filteredleadlist = selectedleadlist.filter(
      (item) => item.productorServiceId && item.productorServiceId !== ""
    )
    console.log(filteredleadlist)
    let response
    if (isEligible && leadData === null) {
      response = await handleleadData(
        formData,
        filteredleadlist,
        loggeduser.role
      )
    } else if (ischek && leadData) {
      response = await handleleadData(
        leadData,
        filteredleadlist,
        loggeduser.role
      )
    }
    if (response?.success) {
      resetLeadForm()
    }
  }
  const handleDetailsChange = (e) => {
    const { name, value } = e.target
    setDetailsForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  console.log(selectedleadlist)
  console.log(detailsForm)
  const handleDetailsSave = () => {
    const itemType = String(
      detailsItem?.productorservicetype || ""
    ).toLowerCase()
    console.log("hh")
    console.log(detailsForm.taggeddata)
    console.log(selectedleadlist)
    const cleanedTaggedData = Array.isArray(detailsForm.taggeddata)
      ? detailsForm.taggeddata
          .map((tag) => ({
            licensenumber: String(tag?.licensenumber || "").trim(),
            nextDue: String(tag?.nextDue || "").trim(),
            productAmount: tag?.productAmount,
            taxexclusiveAmount: tag?.taxexclusiveAmount,
            taxinclusiveamount: tag?.taxinclusiveamount,
            hsn: tag?.hsn
          }))
          .filter((tag) => tag.licensenumber !== "")
      : []
    console.log(detailsForm)
    const totaltaxexclusiveAmount = detailsForm?.taggeddata.reduce(
      (sum, item) => {
        const amount = Number(item.taxexclusiveAmount) || 0 // safely handle invalid/empty
        return sum + amount
      },
      0
    )
    const taxamount =
      (Number(detailsForm?.taggeddata[0]?.hsn) / 100) * totaltaxexclusiveAmount
    const updatedNetAmount = Math.round(
      Number(totaltaxexclusiveAmount) + taxamount
    )
    console.log(taxamount)
    console.log(totaltaxexclusiveAmount)
    console.log(updatedNetAmount)
    console.log(selectedleadlist)
    console.log(detailsForm)
    setSelectedLeadList((prev) =>
      prev.map((row, i) => {
        if (i !== detailsIndex) return row

        if (itemType === "additionalservice") {
          const hasTaggedLicenses = cleanedTaggedData.length > 0

          return {
            ...row,
            applicationDate: detailsForm.applicationDate,
            productPrice: haveprimaryProduct
              ? row?.productPrice
              : totaltaxexclusiveAmount,
            netAmount: haveprimaryProduct ? row?.netAmount : updatedNetAmount,
            noofusers: detailsForm.quantityUsers,
            amount: detailsForm.amount,
            status: detailsForm.status,
            isActive: detailsForm.status,
            nextDue: hasTaggedLicenses ? "" : detailsForm.nextDue,
            taggeddata: hasTaggedLicenses ? cleanedTaggedData : [],
            licenseNumber: hasTaggedLicenses
              ? row?.licenseNumber || ""
              : detailsForm.licenseNumber || row?.licenseNumber || ""
          }
        }

        return {
          ...row,
          applicationDate: detailsForm.applicationDate,
          softwareTrade: detailsForm.softwareTrade,
          status: detailsForm.status,
          isActive: detailsForm.status
        }
      })
    )

    setdetailsopen(false)
  }
  console.log(detailsForm)
  console.log(selectedleadlist)
  const isRowPriceLocked = (row) => {
    if (!row) return false

    const currentType = String(row?.productorservicetype || "").toLowerCase()
    const hasPrimaryProduct = selectedleadlist.some(
      (item) =>
        String(item?.productorservicetype || "").toLowerCase() ===
        "primaryproduct"
    )
    console.log(hasPrimaryProduct)
    if (!hasPrimaryProduct) return false
    console.log(!hasPrimaryProduct)
    console.log("k")
    if (currentType === "primaryproduct") return false
    if (currentType === "additionalservice") return true

    return false
  }
  const normalizeMobile = (number) => {
    if (!number) return ""
    return number.replace(/\D/g, "").slice(-10)
  }

  const isMobileExists = (
    inputMobile,
    existingCustomers,
    customerid = null
  ) => {
    console.log(customerid)
    console.log(existingCustomers)
    console.log(inputMobile)
    const normalizedInput = normalizeMobile(inputMobile)
    if (customerid) {
      console.log("h")
      return existingCustomers.some((customer) => {
        const normalizedStored = normalizeMobile(customer.mobile)
        return (
          normalizedStored === normalizedInput && customer._id !== customerid
        )
      })
    }
    return existingCustomers.some((customer) => {
      const normalizedStored = normalizeMobile(customer.mobile)
      return normalizedStored === normalizedInput
    })
  }
  console.log(duplicateWarning)
  const onmodalsubmit = async (data) => {
    console.log(data)
    console.log("hhhh")
    console.log(duplicateWarning)
    if (duplicateWarning) return
    console.log(duplicateWarning)

    if (modalloader) return
    try {
      // const checkexistingNumber = isMobileExists(
      //   data?.mobile,
      //   allcustomer,
      //   data?.customerid
      // )

      // if (checkexistingNumber) {
      //   setError("mobile", {
      //     type: "manual",
      //     message: "This mobile number is already used"
      //   })
      //   return
      // }
      setModalLoader(true)
      let response
      if (data?.customerid) {
        response = await api.post("/customer/customereditonlead", {
          customerData: data
        })
      } else {
        const createdFrom = "lead"
        response = await api.post(
          `/customer/customerRegistration?createdfrom=${createdFrom}`,
          {
            customerData: data
          }
        )
      }
      if (data?.customerid && response.status === 200) {
        toast.success("Customer updated successfully")
        setModalLoader(false)
        setModalOpen(false)
        loggeduser?.role === "Admin"
          ? navigate("/admin/transaction/lead/leadEdit", {
              state: {
                leadId: Data[0]?._id,
                isReadOnly: false,
                refreshKey: Date.now()
              }
            })
          : navigate("/staff/transaction/lead/leadEdit", {
              state: {
                leadId: Data[0]?._id,
                isReadOnly: false,
                refreshKey: Date.now()
              }
            })
      } else if (response.status === 200) {
        refreshHook()
        setModalLoader(false)
        resetModal()
        toast.success(response.data.message)
        setModalOpen(false)
        clearmodalErros()
        resetModal()
      }
    } catch (error) {
      toast.error("something went wrong")
      setModalLoader(false)
    }
  }
  console.log(process)
  console.log(warningErrors)
  console.log(detailsForm)
  console.log(selectedleadlist)
  const handleDetails = (item, index) => {
    console.log(detailsForm)
    console.log(selectedCustomer)
    console.log(item)
    console.log(leadList)
    const productId = item.productorServiceId
    if (item?.productorservicetype === "Additionalservice") {
      if (!item?.licenseNumbers?.length) {
        setunselectedtaggedlicense((prev) => ({
          ...prev,
          [productId]: "Please tag any of the license"
        }))
        return
      }

      setunselectedtaggedlicense((prev) => {
        const updated = { ...prev }
        delete updated[productId]
        return updated
      })
    }

    const isAdditionalService =
      String(item?.productorservicetype || "").toLowerCase() ===
      "additionalservice"
    console.log(isAdditionalService)
    console.log(item)
    console.log(selectedCustomer)
    console.log(item?.productorServiceId)
    const filteredproduct = selectedCustomer?.selected.filter(
      (it) => it.product_id?._id === item?.productorServiceId
    )
    console.log(filteredproduct)
    console.log(item?.productorServiceId)
    const a = leadList.map((item) => item.productName)
    console.log(a)
    const newproduct = leadList.filter(
      (it) => it._id === item.productorServiceId
    )
    console.log(newproduct)

    console.log(filteredproduct)
    console.log(leadList)
    console.log(item)
    const normalizedTaggedData =
      isAdditionalService &&
      Array.isArray(item?.licenseNumbers) &&
      item.licenseNumbers.length > 0
        ? item.licenseNumbers.map((lic) => {
            const existing = Array.isArray(item?.taggeddata)
              ? item.taggeddata.find(
                  (tag) =>
                    String(tag?.licensenumber) === String(lic?.licenseNumber)
                )
              : null
            // 1. Pick the one WALLET product row (or all, but you showed one)
            const primaryProduct = Array.isArray(filteredproduct)
              ? filteredproduct[0] // or a .find if there are many
              : null
            console.log(filteredproduct[0])

            // 2. Find tag inside that primary product’s taggeddata
            const existingTag =
              primaryProduct && Array.isArray(primaryProduct.taggeddata)
                ? primaryProduct.taggeddata.find(
                    (tag) =>
                      String(tag?.licensenumber) === String(lic?.licenseNumber)
                  )
                : null
            console.log(existing?.productAmount)
            console.log(existingTag?.productAmount)
            console.log(item?.actualNetAmount)
            console.log(item?.netAmount)
            console.log(existing)
            console.log(existingTag)
            // 3. Decide productAmount
            const productAmount =
              existing?.productAmount ??
              existingTag?.productAmount ??
              item?.actualNetAmount ??
              item?.netAmount ??
              0
            console.log(productAmount)
            return {
              licensenumber: lic?.licenseNumber || "",
              nextDue: existing?.nextDue ?? "",
              sourceIndex: lic?.sourceIndex,
              productAmount,
              taxexclusiveAmount:
                existing?.taxexclusiveAmount ??
                existingTag?.taxexclusiveAmount ??
                item?.actualproductPrice,
              taxinclusiveamount:
                existing?.taxinclusiveamount ??
                existingTag?.taxinclusiveamount ??
                item?.actualNetAmount ??
                item?.netAmount ??
                0,
              hsn: existing?.hsn ?? existingTag?.hsn ?? item?.actualHsn
            }
          })
        : Array.isArray(item?.taggeddata)
          ? item.taggeddata.map((tag) => ({
              licensenumber: tag?.licensenumber || "",
              nextDue: tag?.nextDue || "",
              productAmount:
                tag?.productAmount ??
                item?.actualNetAmount ??
                item?.netAmount ??
                0,
              actualNetAmount: item?.netAmount
            }))
          : []
    console.log(item)
    console.log(normalizedTaggedData)
    setDetailsItem(item)
    setDetailsIndex(index)
    setDetailsForm({
      name: item?.productorServiceName || "",
      licenseNumber: item?.licenseNumber || "",
      softwareTrade: item?.softwareTrade || "",
      applicationDate: item?.applicationDate || "",
      status: item?.status || item?.isActive || "Running",
      nextDue: item?.nextDue || "",
      quantityUsers: item?.quantityUsers || "",
      productAmount: item?.actualNetAmount || 0,
      taggeddata: normalizedTaggedData,
      productType: item?.productorservicetype
    })
    setdetailsopen(true)
    //     const normalizedTaggedData =
    //       isAdditionalService &&
    //       Array.isArray(item?.licenseNumbers) &&
    //       item.licenseNumbers.length > 0
    //         ? item.licenseNumbers.map((lic) => {
    // console.log("hh")
    //             const existingTag = Array.isArray(item?.taggeddata)
    //               ? item.taggeddata.find(
    //                   (tag) =>
    //                     String(tag?.licensenumber) === String(lic?.licenseNumber)
    //                 )
    //               : null

    //             return {
    //               licensenumber: lic?.licenseNumber || "",
    //               nextDue: existingTag?.nextDue || "",
    //               sourceIndex: lic?.sourceIndex,
    //               productAmount: existingTag?.productAmount || item?.actualNetAmount||item?.netAmount
    //             }
    //           })
    //         : Array.isArray(item?.taggeddata)
    //           ? item.taggeddata.map((tag) => ({
    //               licensenumber: tag?.licensenumber || "",
    //               nextDue: tag?.nextDue || "",
    //               productAmount: item?.actualNetAmount
    //             }))
    //           : []
    // const normalizedTaggedData =
    //   isAdditionalService &&
    //   Array.isArray(item?.licenseNumbers) &&
    //   item.licenseNumbers.length > 0
    //     ? item.licenseNumbers.map((lic) => {
    //         // 1. Match tag in current item.taggeddata
    //         const existingTag = Array.isArray(item?.taggeddata)
    //           ? item.taggeddata.find(
    //               (tag) =>
    //                 String(tag?.licensenumber) === String(lic?.licenseNumber)
    //             )
    //           : null;

    //         // 2. Match primary product in filteredproduct that has this license
    //         const matchedPrimaryProduct = Array.isArray(filteredproduct)
    //           ? filteredproduct.find((prod) =>
    //               Array.isArray(prod.licenseNumbers)
    //                 ? prod.licenseNumbers.some(
    //                     (ln) =>
    //                       String(ln.licenseNumber) === String(lic?.licenseNumber)
    //                   )
    //                 : false
    //             )
    //           : null;
    // console.log(matchedPrimaryProduct)
    //         // 3. Decide productAmount
    //         const productAmount =

    //           matchedPrimaryProduct?.productAmount ?? existingTag?.productAmount ??
    //           item?.actualNetAmount ??
    //           item?.netAmount ??
    //           0;
    // console.log(productAmount)
    //         return {
    //           licensenumber: lic?.licenseNumber || "",
    //           nextDue: existingTag?.nextDue || "",
    //           sourceIndex: lic?.sourceIndex,
    //           productAmount,
    //         };
    //       })
    //     : Array.isArray(item?.taggeddata)
    //     ? item.taggeddata.map((tag) => ({
    //         licensenumber: tag?.licensenumber || "",
    //         nextDue: tag?.nextDue || "",
    //         productAmount:
    //           tag?.productAmount ??
    //           item?.actualNetAmount ??
    //           item?.netAmount ??
    //           0,
    //       }))
    //     : [];
  }
  console.log(detailsForm)
  console.log(showdetailsopen)
  const tableRows = selectedleadlist || []
  console.log(tableRows)
  console.log(selectedCustomer)
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[#ADD8E6]">
      {(modalloader ||
        loadingState ||
        editloadingState ||
        productLoading ||
        usersLoading ||
        customerLoading ||
        submitLoading) && (
        <BarLoader
          cssOverride={{ width: "100%", height: "4px" }}
          color="#4A90E2"
        />
      )}
      <Breadcrumb items={Breadcrumblist} />

      <div className="flex-1 min-h-0 overflow-y-auto p-3">
        <div
          className="mx-auto w-full max-w-4xl rounded bg-white shadow-xl"
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
          {licenseloading && <FullScreenLoader text="Checking..." />}

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
                          isDisabled={isReadOnly}
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
                            console.log("hhh")
                            handleSelectedCustomer(sel)
                            console.log("uu")
                            setSelectedCustomer(sel)
                            console.log("hhhhhh")
                            setValueMain("customerName", sel.value, {
                              shouldValidate: true
                            })
                            setValueMain("netAmount", "")
                            setSelectedLicense(null)
                            console.log("hhhh")
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
                              opacity: state.isDisabled ? 1 : 1
                            }),
                            menuList: (base) => ({
                              ...base,
                              maxHeight: 200
                            })
                          }}
                          menuPortalTarget={document.body}
                          menuShouldScrollIntoView={false}
                          className="w-full"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenmodal()}
                        disabled={isReadOnly}
                        className={`bg-[#1B2A4A] hover:bg-[#243660] text-white text-xs font-bold px-4 rounded flex items-center justify-center ${
                          isReadOnly ? "cursor-not-allowed opacity-70" : ""
                        }`}
                      >
                        {Data ? "UPDATE CUSTOMER" : "NEW CUSTOMER"}
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
                      value={selectedBranch}
                      disabled={isReadOnly}
                      onChange={(e) => {
setDuplicateWarning("")
                        setSelectedBranch(e.target.value)
                        setValueMain("customerName", "")
                        setSelectedCustomer(null)
                        setcustomerTableData([])
                        console.log(emptyRow)
                        setSelectedLeadList([{ ...emptyRow }])
                        setValueMain("netAmount", "")
                        setSelectedLicense(null)
                        resetMain({
                          customerName: "",
                          email: "",
                          phone: "",
                          mobile: "",
                          source: "",
                          partner: "",
                          allocationType: null,
                          dueDate: "",
                          remark: "",
                          taxableAmount: "",
                          taxAmount: "",
                          netAmount: "",
                          selfAllocation: false,
                          leadId: ""
                        })
                      }}
                      className={`border border-gray-300 rounded px-3 py-[6px] text-sm bg-[#1B2A4A] hover:bg-[#243660] text-white outline-none min-w-[140px]  ${isReadOnly ? "cursor-not-allowed" : "cursor-pointer "}`}
                    >
                      {companybranches?.map((b, i) => (
                        <option key={i} value={b._id}>
                          {b.branchName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* keep the rest of your JSX exactly as in your original file */}

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
                      {...mobileRegister}
                      readOnly={isReadOnly}
                      placeholder="Mobile..."
onChange={(e) => {
    isMobileTypedByUser.current = true;
    mobileRegister.onChange(e);
  }}
                      className={`w-full border border-gray-300 rounded px-3 py-[7px] text-sm outline-none bg-[#EEF2F8] ${
                        isReadOnly ? "cursor-not-allowed opacity-70" : ""
                      }`}
                    />
                    {duplicateWarning && (
                      <p className="mt-1 text-xs font-medium text-red-500">
                        {duplicateWarning}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Source of Lead
                    </label>
                    <select
                      disabled={isReadOnly}
                      {...registerMain("source", {
                        required: "Source is Required"
                      })}
                      className={`w-full border border-gray-300 rounded px-3 py-[7px] text-sm outline-none bg-[#EEF2F8] ${isReadOnly ? "cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <option value="">Select Source</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="instagram">Instagram</option>
                      <option value="facebook">Facebook</option>
                      <option value="Direct">Direct</option>
                      <option value="justDial">Just Dial</option>
                    </select>
                    {errorsMain.source && (
                      <p className="text-red-500 text-xs mt-1">
                        {errorsMain.source.message}
                      </p>
                    )}
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

                {process === "register" && selfAllocation && (
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
                      {process === "closing" && <col style={{ width: "7%" }} />}
                    </colgroup>
                    <thead>
                      <tr className="bg-[#1B2A4A] text-white">
                        <th
                          rowSpan={2}
                          className="border border-blue-900 px-2 py-2 text-left text-xs"
                        >
                          Product / Service
                        </th>
                        <th
                          rowSpan={2}
                          className="border border-blue-900 px-2 py-2 text-left text-xs"
                        >
                          License No
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
                          Action
                        </th>
                        {process === "closing" && (
                          <th
                            rowSpan={2}
                            className="border border-blue-900 px-2 py-2 text-center text-xs"
                          >
                            Details
                          </th>
                        )}
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
                      {tableRows.map((item, index) => {
                        console.log(item)
                        const showLicenseDropdown =
                          item?.productorservicetype === "Additionalservice"
                        console.log("jjj")
                        console.log(showLicenseDropdown)
                        const isAmountLocked =
                          isReadOnly || isRowPriceLocked(item)
                        const isTaxLocked = isReadOnly || isRowPriceLocked(item)
                        console.log(isReadOnly)
                        console.log(isAmountLocked)
                        const a = isRowPriceLocked(item)
                        console.log(a)
                        const isPrimaryProduct =
                          String(
                            item?.productorservicetype || ""
                          ).toLowerCase() === "primaryproduct"
                        console.log(item)
                        console.log(isPrimaryProduct)
                        const remainingAdditionalServicesCount =
                          isPrimaryProduct
                            ? getRemainingAdditionalServicesCount(item, index)
                            : 0
                        console.log(process)
                        console.log(remainingAdditionalServicesCount)
                        return (
                          <tr
                            key={index}
                            className="border-b even:bg-blue-50 bg-white hover:bg-blue-50 transition-colors"
                          >
                            <td className="border border-gray-300 px-1 py-1">
                              <ProductDropdown
                                index={index}
                                item={item}
                                isReadOnly={isReadOnly}
                                leadList={leadList}
                                selectedleadlist={selectedleadlist}
                                selectedBranch={selectedBranch}
                                selectedCustomer={selectedCustomer}
                                process={process}
                                setSelectedLeadList={setSelectedLeadList}
                              />
                            </td>
                            <td className="border border-gray-300 px-1 py-1">
                              {showLicenseDropdown ? (
                                <LicenseDropdown
                                  index={index}
                                  item={item}
                                  isReadOnly={isReadOnly}
                                  customerTableData={customerTableData}
                                  setunselectedtaggedlicense={
                                    setunselectedtaggedlicense
                                  }
                                  setTakenLicense={setTakenLicense}
                                  selectedleadlist={selectedleadlist}
                                  setSelectedLeadList={setSelectedLeadList}
                                  handleLicenseSelect={handleLicenseSelect}
                                />
                              ) : (
                                // <input
                                //   value={item.licenseNumber}
                                //   readOnly={isReadOnly}
                                //   // className=`py-1 border pl-2 rounded-md border-gray-500 w-full text-xs ${isReadOnly?"cursor-not-allowed":""}`
                                //   className={`py-1 border pl-2 rounded-md border-gray-500 w-full text-xs ${
                                //     isReadOnly ? "cursor-not-allowed" : ""
                                //   }`}
                                //   onChange={(e) => {
                                //     console.log(item)
                                //     const licenseValue = e.target.value
                                //     if (debounceTimersRef.current[index]) {
                                //       clearTimeout(
                                //         debounceTimersRef.current[index]
                                //       )
                                //     }

                                //     debounceTimersRef.current[index] =
                                //       setTimeout(() => {
                                //         handleLicenseBlur(index, licenseValue)
                                //         delete debounceTimersRef.current[index]
                                //       }, 1000)
                                //     console.log(customerTableData)

                                //     console.log(licenseValue)
                                //     console.log(item)
                                //     console.log("hhh")
                                //     console.log(detailsForm)
                                //     console.log(index)
                                //     setDetailsForm((prev) => {
                                //       const tagged = prev.taggeddata || []
                                //       console.log(tagged)
                                //       const existingIndex = tagged.findIndex(
                                //         (x) => x.sourceIndex === index
                                //       )
                                //       console.log(existingIndex)

                                //       const newEntry = {
                                //         sourceIndex: index,
                                //         licensenumber: licenseValue,
                                //         nextDue: ""
                                //       }

                                //       let updatedTagged

                                //       if (existingIndex !== -1) {
                                //         console.log(existingIndex)
                                //         console.log(tagged)
                                //         console.log(newEntry)
                                //         updatedTagged = tagged.map((x, i) =>
                                //           x?.sourceIndex === existingIndex
                                //             ? newEntry
                                //             : x
                                //         )
                                //         console.log(updatedTagged)
                                //       } else {
                                //         console.log(newEntry)
                                //         updatedTagged = [...tagged, newEntry]
                                //       }
                                //       console.log(updatedTagged)
                                //       return {
                                //         ...prev,
                                //         taggeddata: updatedTagged
                                //       }
                                //     })
                                //     console.log(selectedleadlist)
                                //     const filteredadditionalservice =
                                //       selectedleadlist.filter(
                                //         (item) =>
                                //           item.productorservicetype.toLowerCase() ===
                                //           "additionalservice"
                                //       )
                                //     console.log(filteredadditionalservice)
                                //     // setSelectedLeadList((prev)=>({
                                //     // ...prev,
                                //     // }))
                                //     if (
                                //       filteredadditionalservice &&
                                //       filteredadditionalservice.length
                                //     ) {
                                //       setSelectedLeadList((prev) =>
                                //         prev.map((row) => ({
                                //           ...row,
                                //           licenseNumbers: (
                                //             row.licenseNumbers || []
                                //           ).map((lic) =>
                                //             lic.sourceIndex === index
                                //               ? {
                                //                   ...lic,
                                //                   licenseNumber: e.target.value,
                                //                   nextDue: ""
                                //                 }
                                //               : lic
                                //           )
                                //         }))
                                //       )
                                //     }
                                //     console.log(customerTableData)
                                //     setcustomerTableData((prev) =>
                                //       prev.map((row, i) =>
                                //         row?.sourceIndex === index
                                //           ? {
                                //               ...row,
                                //               licenseNumber: licenseValue,
                                //               productName:
                                //                 item?.productorServiceName,
                                //               productorServiceId:
                                //                 item?.productorServiceId,
                                //               sourceIndex: index
                                //             }
                                //           : row
                                //       )
                                //     )
                                //     console.log("hhhhh")
                                //     console.log(licenseValue)
                                //     updateLicense(index, licenseValue)
                                //   }}
                                //   placeholder="Enter License Number"
                                // />
                                // <input
                                //   value={item.licenseNumber}
                                //   readOnly={isReadOnly}
                                //   className={`py-1 border pl-2 rounded-md border-gray-500 w-full text-xs ${
                                //     isReadOnly ? "cursor-not-allowed" : ""
                                //   }`}
                                //   onChange={(e) => {
                                //     const licenseValue = e.target.value

                                //     if (debounceTimersRef.current[index]) {
                                //       clearTimeout(
                                //         debounceTimersRef.current[index]
                                //       )
                                //     }

                                //     debounceTimersRef.current[index] =
                                //       setTimeout(async () => {
                                //         await processLicenseChange(
                                //           index,
                                //           licenseValue,
                                //           item
                                //         )
                                //         delete debounceTimersRef.current[index]
                                //       }, 1000)
                                //   }}
                                //   placeholder="Enter License Number"
                                // />
                                <input
                                  value={item.licenseNumber}
                                  readOnly={isReadOnly}
                                  className={`py-1 border pl-2 rounded-md border-gray-500 w-full text-xs ${
                                    isReadOnly ? "cursor-not-allowed" : ""
                                  }`}
                                  onChange={(e) => {
                                    const licenseValue = e.target.value

                                    updateLicense(index, licenseValue)

                                    if (debounceTimersRef.current[index]) {
                                      clearTimeout(
                                        debounceTimersRef.current[index]
                                      )
                                    }

                                    debounceTimersRef.current[index] =
                                      setTimeout(async () => {
                                        await processLicenseChange(
                                          index,
                                          licenseValue,
                                          item
                                        )
                                        const currentValue =
                                          selectedleadlist[index]?.licenseNumber

                                        if (
                                          String(currentValue) !==
                                          String(licenseValue)
                                        ) {
                                          return
                                        }
                                        delete debounceTimersRef.current[index]
                                      }, 1000)
                                  }}
                                  placeholder="Enter License Number"
                                />
                              )}
                            </td>

                            <td className="border border-gray-300 px-1 py-1">
                              <input
                                type="number"
                                readOnly={isAmountLocked || !haveprimaryProduct}
                                value={item.productPrice}
                                onChange={(e) =>
                                  handlePriceChange(index, e.target.value)
                                }
                                onWheel={(e) => e.currentTarget.blur()}
                                placeholder="0.00"
                                className={`w-full px-2 py-1 border border-gray-200 rounded text-xs outline-none text-right ${
                                  isAmountLocked
                                    ? "cursor-not-allowed bg-gray-100"
                                    : "bg-white"
                                } [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0`}
                              />
                            </td>

                            <td className="border border-gray-300 px-1 py-1">
                              <input
                                type="number"
                                readOnly={isTaxLocked || !haveprimaryProduct}
                                value={item.hsn}
                                onChange={(e) =>
                                  handleHsnChange(index, e.target.value)
                                }
                                onWheel={(e) => e.currentTarget.blur()}
                                placeholder="Tax"
                                className={`w-full px-2 py-1 border border-gray-200 rounded text-xs outline-none text-center ${
                                  isTaxLocked
                                    ? "cursor-not-allowed bg-gray-100"
                                    : "bg-white"
                                } [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0`}
                              />
                            </td>

                            <td className="border border-gray-300 px-1 py-1">
                              <input
                                type="text"
                                readOnly
                                value={item.netAmount}
                                placeholder="0.00"
                                className="w-full px-2 py-1 border border-gray-200 rounded text-xs outline-none text-right cursor-not-allowed bg-gray-100"
                              />
                            </td>

                            <td className="border border-gray-300 px-1 py-1 text-center">
                              <div className="flex items-center justify-center gap-1">
                                {isPrimaryProduct &&
                                  process === "closing" &&
                                  remainingAdditionalServicesCount > 0 && (
                                    <button
                                      type="button"
                                      disabled={isReadOnly}
                                      onClick={() =>
                                        addAdditionalServicesForPrimaryRow(
                                          item,
                                          index
                                        )
                                      }
                                      title={`Add ${remainingAdditionalServicesCount} additional service${
                                        remainingAdditionalServicesCount > 1
                                          ? "s"
                                          : ""
                                      }`}
                                      className="h-6 w-6 rounded-full bg-green-100 text-green-700 hover:bg-green-200 flex items-center justify-center font-bold text-sm"
                                    >
                                      +
                                    </button>
                                  )}

                                <button
                                  type="button"
                                  disabled={isReadOnly}
                                  onClick={() => {
                                    console.log(item)
                                    if (
                                      item?.productorservicetype.toLowerCase() ===
                                      "primaryproduct"
                                    )
                                      return
                                    console.log(selectedleadlist)
                                    if (selectedleadlist.length === 1) return
                                    console.log("jjjjj")
                                    handleDeletetableData(item, index)
                                  }}
                                  className={`h-6 w-6 rounded-full flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors ${
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
                              </div>
                            </td>
                            {process === "closing" && (
                              <td className="border border-gray-300 px-1 py-1 text-center">
                                <div className="relative inline-block group">
                                  <button
                                    type="button"
                                    disabled={isReadOnly}
                                    onClick={() => handleDetails(item, index)}
                                    className={`ml-2 font-bold text-blue-500 ${
                                      isReadOnly
                                        ? "cursor-not-allowed"
                                        : "cursor-pointer"
                                    }`}
                                  >
                                    Add
                                  </button>
                                  {/* {warningErrors?.taggedlicenseError && (
                                    <div className="pointer-events-none absolute bottom-full right-0 z-50 mb-2 hidden whitespace-nowrap rounded bg-red-500 px-2 py-1 text-[11px] text-white shadow-lg group-hover:block">
                                      {warningErrors.taggedlicenseError}
                                    </div>
                                  )} */}
                                  {unselectedtaggedlicense[
                                    item.productorServiceId
                                  ] && (
                                    <div className="pointer-events-none absolute bottom-full right-0 z-50 mb-2 hidden whitespace-nowrap rounded bg-red-500 px-2 py-1 text-[11px] text-white shadow-lg group-hover:block">
                                      {
                                        unselectedtaggedlicense[
                                          item.productorServiceId
                                        ]
                                      }
                                    </div>
                                  )}
                                </div>
                              </td>
                            )}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                {warningMessage && (
                  <p className="text-red-500 text-sm mt-0">{warningMessage}</p>
                )}
                <div className="">
                  {Object.entries(takenLicenses).map(
                    ([productName, licenses]) => (
                      <div
                        key={productName}
                        className="rounded-xl border border-gray-200 bg-white p-1 shadow-sm"
                      >
                        {/* Product Name */}
                        <div className="flex">
                          <div className=" flex items-center gap-3 w-auto">
                            <div className="h-3 w-1 rounded-full bg-blue-600"></div>

                            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 ">
                              {productName}
                            </h2>
                          </div>

                          <div className="flex flex-wrap gap-3 ml-2">
                            {licenses.map((license) => (
                              <button
                                key={license}
                                type="button"
                                disabled
                                className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-0.5 text-sm font-medium text-gray-700 shadow-sm cursor-default min-w-[128px]"
                              >
                                <span className="h-3 w-3 rounded-full border-2 border-blue-600 flex items-center justify-center">
                                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                                </span>

                                {license}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  )}
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
                  <div className="flex flex-col gap-2 md:justify-end md:pt-5 w-64">
                    {[
                      {
                        label: "Taxable Amount",
                        field: "taxableAmount",
                        viewonly: true
                      },
                      {
                        label: "Tax Amount",
                        field: "taxAmount",
                        viewonly: true
                      },
                      ...(process === "closing" && haveprimaryProduct
                        ? [
                            {
                              label: "Disc.Amount",
                              field: "discamnt",
                              viewonly: false
                            }
                          ]
                        : []),
                      {
                        label: "Net Amount",
                        field: "netAmount",
                        viewonly: true
                      }
                    ].map(({ label, field, viewonly }) => (
                      <div key={field} className="flex items-center">
                        <span className="text-xs font-bold text-white px-3 py-[7px] bg-[#1B2A4A] rounded-l w-[130px] text-right whitespace-nowrap flex-shrink-0">
                          {label}
                        </span>
                        <input
                          type="number"
                          {...registerMain(field)}
                          onWheel={(e) => e.currentTarget.blur()}
                          readOnly={viewonly}
                          className={`flex-1 min-w-0 border border-gray-300 rounded-r px-3 py-[6px] text-sm text-right bg-white outline-none ${viewonly ? "cursor-not-allowed" : ""} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0`}
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
                    {process === "register" ? (
                      <>
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
                        <p className="text-sm text-gray-500 whitespace-nowrap uppercase">
                          Lead by:{" "}
                          <span className="font-semibold text-[#1B2A4A]">
                            {Data && Data.length
                              ? Data[0]?.leadBy?.name
                              : loggeduser?.name}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

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
                      disabled={isReadOnly}
                      className={`bg-[#1B2A4A] hover:bg-[#243660] text-white py-2 px-8 rounded text-sm font-semibold tracking-wide transition-colors mt-1 ${isReadOnly ? "cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      {process === "Registration"
                        ? "SUBMIT LEAD"
                        : process === "closing"
                          ? "Closing Lead"
                          : "UPDATE LEAD"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* {popupOpen && (
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
          )} */}
{popupOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
    <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v4m0 4h.01M10.29 3.86l-7.5 13A1 1 0 003.66 18h16.68a1 1 0 00.87-1.5l-7.5-13a1 1 0 00-1.74 0z"
              />
            </svg>
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-800">
              Confirmation
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {popupMessage}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setPopupOpen(false)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handlePopupOk}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  </div>
)}
          {showdetailsopen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">
              <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b bg-[#1B2A4A] text-white">
                  <div>
                    <h2 className="text-sm font-bold">
                      {String(
                        detailsItem?.productorservicetype || ""
                      ).toLowerCase() === "primaryproduct"
                        ? "Primary Product Details"
                        : "Additional Service Details"}
                    </h2>
                    <p className="text-xs text-blue-100 mt-1">
                      Fill the details for the selected item
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setdetailsopen(false)}
                    className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white text-lg flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>

                <div className="p-5">
                  {String(
                    detailsItem?.productorservicetype || ""
                  ).toLowerCase() === "primaryproduct" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          readOnly
                          value={detailsForm.name}
                          onChange={handleDetailsChange}
                          placeholder="List of Primary Products"
                          className="w-full rounded-lg border border-gray-300 bg-[#EEF2F8] px-3 py-2 text-sm outline-none focus:border-[#1B2A4A] cursor-not-allowed"
                        />
                      </div>

                      <div className="relative" ref={tradeDropdownRef}>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          Software Trade
                        </label>

                        <button
                          type="button"
                          onClick={() => setIsTradeOpen((prev) => !prev)}
                          className="flex w-full items-center justify-between rounded-xl border border-gray-300 bg-[#EEF2F8] px-3 py-2 text-sm text-left text-gray-700 outline-none transition-all focus:border-[#1B2A4A] focus:ring-2 focus:ring-[#1B2A4A]/15"
                        >
                          <span
                            className={
                              detailsForm.softwareTrade
                                ? "text-gray-800"
                                : "text-gray-400"
                            }
                          >
                            {detailsForm.softwareTrade ||
                              "Select Software Trade"}
                          </span>

                          <svg
                            className={`h-4 w-4 text-gray-500 transition-transform ${
                              isTradeOpen ? "rotate-180" : ""
                            }`}
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              d="M5 7.5L10 12.5L15 7.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>

                        {isTradeOpen && (
                          <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                            <div className="max-h-56 overflow-y-auto py-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setDetailsForm((prev) => ({
                                    ...prev,
                                    softwareTrade: ""
                                  }))
                                  setIsTradeOpen(false)
                                }}
                                className={`flex w-full items-center justify-between px-3 py-2 text-sm text-left transition-colors ${
                                  !detailsForm.softwareTrade
                                    ? "bg-[#1B2A4A]/8 text-[#1B2A4A] font-medium"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                              >
                                <span>Select Software Trade</span>
                              </button>

                              {softwareTrades.map((trade, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => {
                                    setDetailsForm((prev) => ({
                                      ...prev,
                                      softwareTrade: trade
                                    }))
                                    setIsTradeOpen(false)
                                  }}
                                  className={`flex w-full items-center justify-between px-3 py-2 text-sm text-left transition-colors ${
                                    detailsForm.softwareTrade === trade
                                      ? "bg-[#1B2A4A]/8 text-[#1B2A4A] font-medium"
                                      : "text-gray-700 hover:bg-gray-50"
                                  }`}
                                >
                                  <span>{trade}</span>

                                  {detailsForm.softwareTrade === trade && (
                                    <svg
                                      className="h-4 w-4 text-[#1B2A4A]"
                                      viewBox="0 0 20 20"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                    >
                                      <path
                                        d="M5 10.5L8.5 14L15 7.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          Application Date
                        </label>
                        <input
                          type="date"
                          name="applicationDate"
                          value={detailsForm.applicationDate}
                          onChange={handleDetailsChange}
                          className="w-full rounded-lg border border-gray-300 bg-[#EEF2F8] px-3 py-2 text-sm outline-none focus:border-[#1B2A4A]"
                        />
                      </div>

                      <div className="">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          Status
                        </label>
                        <select
                          name="status"
                          value={detailsForm.status}
                          onChange={handleDetailsChange}
                          className="w-full rounded-lg border border-gray-300 bg-[#EEF2F8] px-3 py-2 text-sm outline-none focus:border-[#1B2A4A]"
                        >
                          <option value="Running">Active</option>
                          <option value="Deactive">DE active</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          Product Name
                        </label>
                        <input
                          type="text"
                          name="productName"
                          readOnly
                          value={detailsForm.name}
                          onChange={handleDetailsChange}
                          placeholder="List of additional service"
                          className="w-full rounded-lg border border-gray-300 bg-[#EEF2F8] px-3 py-2 text-sm outline-none focus:border-[#1B2A4A] cursor-not-allowed"
                        />
                      </div>
                      {detailsForm?.taggeddata?.length ? (
                        <div className="md:col-span-2">
                          <label className="mb-1.5 block text-[11px] font-medium text-[#5d6983]">
                            Tagged License Due Details
                          </label>

                          <div className="overflow-hidden rounded-[8px] border border-[#e7ebf4]">
                            <div className="max-h-40 overflow-y-auto">
                              <table className="w-full border-collapse">
                                <thead className="sticky top-0 bg-[#f8fafc]">
                                  <tr className="text-center">
                                    <th className="border-b border-[#e7ebf4] px-2.5 py-1.5  text-[11px] font-semibold text-[#43506a]">
                                      License Number
                                    </th>
                                    <th className="border-b border-[#e7ebf4] px-2.5 py-1.5  text-[11px] font-semibold text-[#43506a]">
                                      Next Due
                                    </th>

                                    <th className="border-b border-[#e7ebf4] px-2.5 py-1.5  text-[11px] font-semibold text-[#43506a]">
                                      Product price
                                    </th>

                                    <th className="border-b border-[#e7ebf4] px-2.5 py-1.5  text-[11px] font-semibold text-[#43506a]">
                                      Amount(tax.incls)
                                    </th>
                                  </tr>
                                </thead>
                                {/* <tbody>
                                
                                </tbody> */}
                                <tbody>
                                  {detailsForm.taggeddata.map(
                                    (tag, rowIndex) => (
                                      <tr
                                        key={`${tag?.licensenumber}-${rowIndex}`}
                                      >
                                        <td className="border-b border-[#eef2f7] px-2.5 py-1.5">
                                          <input
                                            value={tag?.licensenumber || ""}
                                            readOnly
                                            className="w-full cursor-not-allowed rounded-[7px] border border-[#dfe5ee] bg-[#f3f6fb] px-2 py-1.5 text-[11px] text-[#1f2a3d] outline-none"
                                          />
                                        </td>

                                        <td className="border-b border-[#eef2f7] px-2.5 py-1.5">
                                          <input
                                            type="date"
                                            min={today}
                                            value={tag?.nextDue || ""}
                                            onChange={(e) => {
                                              const selectedDate =
                                                e.target.value

                                              if (
                                                selectedDate &&
                                                selectedDate < today
                                              ) {
                                                setwarningError((prev) => ({
                                                  ...prev,
                                                  nextduewarning: {
                                                    ...(prev.nextduewarning ||
                                                      {}),
                                                    [rowIndex]:
                                                      "Due date must be today or a future date."
                                                  }
                                                }))
                                                return
                                              }

                                              setwarningError((prev) => ({
                                                ...prev,
                                                nextduewarning: {
                                                  ...(prev.nextduewarning ||
                                                    {}),
                                                  [rowIndex]: ""
                                                }
                                              }))

                                              handleTaggedDueChange(
                                                rowIndex,
                                                selectedDate,
                                                "nextDue"
                                              )
                                            }}
                                            className={`w-full rounded-[7px] border bg-white px-2 py-1.5 text-[11px] text-[#1f2a3d] outline-none ${
                                              warningErrors?.nextduewarning?.[
                                                rowIndex
                                              ]
                                                ? "border-red-400"
                                                : "border-[#dfe5ee] focus:border-[#1B2A4A]"
                                            }`}
                                          />

                                          {warningErrors?.nextduewarning?.[
                                            rowIndex
                                          ] && (
                                            <p className="mt-1 text-[10px] text-red-500">
                                              {
                                                warningErrors.nextduewarning[
                                                  rowIndex
                                                ]
                                              }
                                            </p>
                                          )}
                                        </td>

                                        <td className="border-b border-[#eef2f7] px-2.5 py-1.5">
                                          <input
                                            type="number"
                                            value={tag?.taxexclusiveAmount}
                                            onChange={(e) => {
                                              console.log(tag)

                                              handleTaggedDueChange(
                                                rowIndex,
                                                e.target.value,
                                                "taxexclusiveAmount",
                                                tag?.hsn,
                                                detailsForm?.productType
                                              )
                                            }}
                                            onWheel={(e) =>
                                              e.currentTarget.blur()
                                            }
                                            className="w-full rounded-[7px] border text-right border-[#dfe5ee] bg-white px-2 py-1.5 text-[11px] text-[#1f2a3d] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0"
                                          />
                                        </td>

                                        <td className="border-b border-[#eef2f7] px-2.5 py-1.5">
                                          <input
                                            type="number"
                                            readOnly
                                            value={tag?.taxinclusiveamount}
                                            onChange={(e) => {
                                              let productvalue
                                              if (haveprimaryProduct) {
                                                productvalue = "productAmount"
                                              } else {
                                                productvalue = "Net Amount"
                                              }
                                              console.log(haveprimaryProduct)
                                              console.log(productvalue)
                                              handleTaggedDueChange(
                                                rowIndex,
                                                e.target.value,
                                                productvalue
                                              )
                                            }}
                                            onWheel={(e) =>
                                              e.currentTarget.blur()
                                            }
                                            className="w-full rounded-[7px] pr-3 border text-right border-[#dfe5ee] bg-gray-100 px-2 py-1.5 text-[11px] text-[#1f2a3d] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0"
                                          />
                                        </td>
                                      </tr>
                                    )
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Next Due
                          </label>
                          <input
                            type="date"
                            name="nextDue"
                            value={detailsForm.nextDue}
                            onChange={handleDetailsChange}
                            className="w-full rounded-lg border border-gray-300 bg-[#EEF2F8] px-3 py-2 text-sm outline-none focus:border-[#1B2A4A]"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          No of Quantity / Users
                        </label>
                        <input
                          type="number"
                          name="quantityUsers"
                          value={detailsForm.quantityUsers}
                          onChange={handleDetailsChange}
                          onWheel={(e) => e.currentTarget.blur()}
                          placeholder="Optional"
                          className="w-full rounded-lg border border-gray-300 bg-[#EEF2F8] px-3 py-2 text-sm outline-none focus:border-[#1B2A4A] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0"
                        />
                      </div>

                      <div className="">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          Status
                        </label>
                        <select
                          name="status"
                          value={detailsForm.status}
                          onChange={handleDetailsChange}
                          className="w-full rounded-lg border border-gray-300 bg-[#EEF2F8] px-3 py-2 text-sm outline-none focus:border-[#1B2A4A]"
                        >
                          <option value="Running">Active</option>
                          <option value="Deactive">DE active</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 px-5 py-4 border-t bg-gray-50">
                  <button
                    type="button"
                    onClick={() => setdetailsopen(false)}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleDetailsSave}
                    className="rounded-lg bg-[#1B2A4A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#243660]"
                  >
                    Save Details
                  </button>
                </div>
              </div>
            </div>
          )}
          {modalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-3 sm:p-4">
              <div className="flex w-full max-w-4xl max-h-[88vh] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                {/* Header */}
                <div className="flex shrink-0 items-start justify-between border-b border-slate-200 bg-[#1B2A4A] px-5 py-3.5 sm:px-6">
                  <div>
                    <h2 className="text-sm font-semibold tracking-wide text-white sm:text-base">
                      {Data ? "Update Customer Details" : "Add New Customer"}
                    </h2>
                    {!Data && (
                      <p className="mt-0.5 text-[11px] text-blue-200">
                        Fill in the details to register a new customer
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setModalOpen(false)
                      clearmodalErros()
                      resetModal()
                    }}
                    className="rounded-full p-1.5 text-blue-200 transition hover:bg-white/10 hover:text-white"
                  >
                    <svg
                      className="h-5 w-5"
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

                {/* Form */}
                <form
                  onSubmit={handleSubmitModal(onmodalsubmit)}
                  className="flex min-h-0 flex-1 flex-col"
                >
                  {/* Scrollable body only */}
                  <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6">
                    <input
                      type="hidden"
                      {...registerModal("customerid")}
                      onBlur={(e) =>
                        setValueModal("customerid", e.target.value.trim())
                      }
                    />

                    <input
                      type="hidden"
                      {...registerModal("leadid")}
                      onBlur={(e) =>
                        setValueModal("leadid", e.target.value.trim())
                      }
                    />

                    {/* Basic Information */}
                    <div className="mb-4">
                      <p className="mb-2 border-b border-slate-200 pb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1B2A4A]">
                        Basic Information
                      </p>

                      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <div>
                          <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                            Customer Name
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            {...registerModal("customerName", {
                              required: "Customer Name is required"
                            })}
                            onBlur={(e) =>
                              setValueModal(
                                "customerName",
                                e.target.value.trim()
                              )
                            }
                            placeholder="Customer Name"
                            className="h-10 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm outline-none transition focus:border-[#1B2A4A] focus:ring-2 focus:ring-[#1B2A4A]/10"
                          />
                          {errorsModal.customerName && (
                            <p className="mt-1 text-[11px] text-red-500">
                              {errorsModal.customerName.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                            Email
                          </label>
                          <input
                            type="email"
                            {...registerModal("email")}
                            placeholder="Email"
                            className="h-10 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm outline-none transition focus:border-[#1B2A4A] focus:ring-2 focus:ring-[#1B2A4A]/10"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-[11px] font-semibold text-slate-600">
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
                                if (cleaned.length !== 10) {
                                  return "Must be 10 digits after country code"
                                }
                                return true
                              }
                            })}
                            onBlur={(e) =>
                              setValueModal("mobile", e.target.value.trim())
                            }
                            placeholder="Mobile"
                            className="h-10 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm outline-none transition focus:border-[#1B2A4A] focus:ring-2 focus:ring-[#1B2A4A]/10"
                          />
                          {duplicateWarning && (
                            <p className="mt-1 text-xs font-medium text-red-500">
                              {duplicateWarning}
                            </p>
                          )}
                          {errorsModal.mobile && (
                            <p className="mt-1 text-[11px] text-red-500">
                              {errorsModal.mobile.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                            Landline
                          </label>
                          <input
                            type="tel"
                            {...registerModal("landline")}
                            onBlur={(e) =>
                              setValueModal("landline", e.target.value.trim())
                            }
                            placeholder="Landline"
                            className="h-10 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm outline-none transition focus:border-[#1B2A4A] focus:ring-2 focus:ring-[#1B2A4A]/10"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                            Contact Person{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            {...registerModal("contactPerson", {
                              required: "Contact person is Required"
                            })}
                            onBlur={(e) =>
                              setValueModal(
                                "contactPerson",
                                e.target.value.trim()
                              )
                            }
                            placeholder="Contact Person"
                            className="h-10 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm outline-none transition focus:border-[#1B2A4A] focus:ring-2 focus:ring-[#1B2A4A]/10"
                          />
                          {errorsModal.contactPerson && (
                            <p className="mt-1 text-[11px] text-red-500">
                              {errorsModal.contactPerson.message}
                            </p>
                          )}
                        </div>

                        <div className="md:col-span-2">
                          <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                            Address
                          </label>
                          <textarea
                            {...registerModal("address1")}
                            onBlur={(e) =>
                              setValueModal("address1", e.target.value.trim())
                            }
                            placeholder="Address"
                            rows={2}
                            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-[#1B2A4A] focus:ring-2 focus:ring-[#1B2A4A]/10 resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="mb-4">
                      <p className="mb-2 border-b border-slate-200 pb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1B2A4A]">
                        Location
                      </p>

                      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <div>
                          <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                            Country
                          </label>
                          <Controller
                            name="country"
                            control={controlModal}
                            render={({ field }) => (
                              <Select
                                options={countryOptions}
                                value={
                                  countryOptions.find(
                                    (opt) => opt.value === field.value
                                  ) || null
                                }
                                onChange={(option) =>
                                  field.onChange(option?.value || "")
                                }
                                getOptionLabel={(o) => o.label}
                                getOptionValue={(o) => o.value}
                              />
                            )}
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                            State
                          </label>
                          <Controller
                            name="state"
                            control={controlModal}
                            render={({ field }) => (
                              <Select
                                options={stateOptions}
                                value={
                                  stateOptions.find(
                                    (opt) => opt.value === field.value
                                  ) || null
                                }
                                onChange={(option) => {
                                  field.onChange(option?.value || "")
                                  setSelectedState(option)
                                }}
                                isDisabled={!selectedCountry}
                              />
                            )}
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                            City
                          </label>
                          <input
                            type="text"
                            {...registerModal("city")}
                            onBlur={(e) =>
                              setValueModal("city", e.target.value.trim())
                            }
                            placeholder="City"
                            className="h-10 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm outline-none transition focus:border-[#1B2A4A] focus:ring-2 focus:ring-[#1B2A4A]/10"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                            Pincode
                          </label>
                          <input
                            type="text"
                            {...registerModal("pincode")}
                            onBlur={(e) =>
                              setValueModal("pincode", e.target.value.trim())
                            }
                            placeholder="Pincode"
                            className="h-10 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm outline-none transition focus:border-[#1B2A4A] focus:ring-2 focus:ring-[#1B2A4A]/10"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Business Information */}
                    <div>
                      <p className="mb-2 border-b border-slate-200 pb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1B2A4A]">
                        Business Information
                      </p>

                      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <div>
                          <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                            Partnership Type
                          </label>
                          <select
                            {...registerModal("partner")}
                            className="h-10 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm outline-none transition focus:border-[#1B2A4A] focus:ring-2 focus:ring-[#1B2A4A]/10"
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
                          <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                            Registration Type
                          </label>
                          <select
                            {...registerModal("registrationType")}
                            className="h-10 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm outline-none transition focus:border-[#1B2A4A] focus:ring-2 focus:ring-[#1B2A4A]/10"
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
                            <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                              GSTIN / UIN{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              {...registerModal("gstNo", {
                                required: "GST is required"
                              })}
                              placeholder="e.g. 22AAAAA0000A1Z5"
                              className="h-10 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm outline-none transition focus:border-[#1B2A4A] focus:ring-2 focus:ring-[#1B2A4A]/10"
                            />
                            {errorsModal.gstNo && (
                              <p className="mt-1 text-[11px] text-red-500">
                                {errorsModal.gstNo.message}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Fixed footer */}
                  <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-200 bg-white px-5 py-3 sm:px-6">
                    <button
                      type="button"
                      onClick={() => {
                        setModalOpen(false)
                        clearmodalErros()
                        resetModal()
                      }}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-[#1B2A4A] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#243660]"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* {modalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center px-4 z-50">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="bg-[#1B2A4A] px-6 py-4 flex items-center justify-between flex-shrink-0">
                  <div>
                    <h2 className="text-white text-base font-bold tracking-wide">
                      {Data ? "Update Customer Details" : "Add New Customer"}
                    </h2>
                    {!Data && (
                      <p className="text-blue-300 text-xs mt-0.5">
                        Fill in the details to register a new customer
                      </p>
                    )}
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
                  <div>
                    <input
                      type="hidden"
                      {...registerModal("customerid")}
                      onBlur={(e) =>
                        setValueModal("customerid", e.target.value.trim())
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A] bg-gray-50 transition"
                    />
                  </div>
                  <div>
                    <input
                      type="hidden"
                      {...registerModal("leadid")}
                      onBlur={(e) =>
                        setValueModal("leadid", e.target.value.trim())
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A] bg-gray-50 transition"
                    />
                  </div>
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

                      <Controller
                        name="country"
                        control={controlModal}
                        render={({ field }) => (
                          <Select
                            options={countryOptions}
                            value={
                              countryOptions.find(
                                (opt) => opt.value === field.value
                              ) || null
                            }
                            onChange={(option) =>
                              field.onChange(option?.value || "")
                            }
                            getOptionLabel={(o) => o.label}
                            getOptionValue={(o) => o.value}
                          />
                        )}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        State
                      </label>

                      <Controller
                        name="state"
                        control={controlModal}
                        render={({ field }) => (
                          <Select
                            options={stateOptions}
                            value={
                              stateOptions.find(
                                (opt) => opt.value === field.value
                              ) || null
                            }
                            onChange={(option) => {
                              field.onChange(option?.value || "")
                              setSelectedState(option)
                            }}
                            isDisabled={!selectedCountry}
                          />
                        )}
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
          )} */}
        </div>
      </div>
    </div>
  )
}

export default LeadMaster
