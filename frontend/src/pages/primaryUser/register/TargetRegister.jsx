import { useEffect, useMemo, useRef, useState } from "react"
import { Plus, Settings, Users, X, ChevronDown, Pencil } from "lucide-react"
import { useSelector } from "react-redux"
import UseFetch from "../../../hooks/useFetch"
import api from "../../../api/api"
import { getLocalStorageItem } from "../../../helper/localstorage"
import { toast } from "react-toastify"
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
]

const getMonthNumber = (monthName) => months.indexOf(monthName) + 1
const monthLabelFromNumber = (monthNo) => months[Number(monthNo) - 1] || ""

const buildPeriodNameWithYear = (fromMonth, toMonth, year) =>
  `${fromMonth}-${toMonth} ${year}`

const buildPeriodLabelWithoutYear = (fromMonth, toMonth) =>
  `${fromMonth}-${toMonth}`

const safeNum = (v) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

const getPeriodDisplayWithoutYear = (item) => {
  if (typeof item === "string") {
    return item.replace(/\s+\d{4}$/, "").trim()
  }

  if (item?.periodName) {
    return item.periodName.replace(/\s+\d{4}$/, "").trim()
  }

  if (item?.startDate && item?.endDate) {
    const start = new Date(item.startDate)
    const end = new Date(item.endDate)
    return buildPeriodLabelWithoutYear(
      months[start.getMonth()],
      months[end.getMonth()]
    )
  }

  return ""
}

const getPeriodFullName = (item, fallbackYear) => {
  if (typeof item === "string") {
    return item
  }

  if (item?.periodName) {
    return item.periodName
  }

  if (item?.startDate && item?.endDate) {
    const start = new Date(item.startDate)
    const end = new Date(item.endDate)
    const year = start.getFullYear() || fallbackYear
    return buildPeriodNameWithYear(
      months[start.getMonth()],
      months[end.getMonth()],
      year
    )
  }

  return ""
}

const getMonthsCoveredByPeriod = (period) => {
  if (!period) return []

  let startMonth = ""
  let endMonth = ""

  if (typeof period === "string") {
    const withoutYear = period.replace(/\s+\d{4}$/, "").trim()
    const [from, to] = withoutYear.split("-").map((v) => v?.trim())
    startMonth = from
    endMonth = to
  } else if (period?.periodName) {
    const withoutYear = period.periodName.replace(/\s+\d{4}$/, "").trim()
    const [from, to] = withoutYear.split("-").map((v) => v?.trim())
    startMonth = from
    endMonth = to
  } else if (period?.startDate && period?.endDate) {
    const start = new Date(period.startDate)
    const end = new Date(period.endDate)
    startMonth = months[start.getMonth()]
    endMonth = months[end.getMonth()]
  }

  const fromIndex = months.indexOf(startMonth)
  const toIndex = months.indexOf(endMonth)

  if (fromIndex === -1 || toIndex === -1 || fromIndex > toIndex) return []
  return months.slice(fromIndex, toIndex + 1)
}

const normalizePeriods = (periods = [], fallbackYear) => {
  const unique = new Map()

  periods.forEach((item) => {
    const label = getPeriodDisplayWithoutYear(item)
    const fullName = getPeriodFullName(item, fallbackYear)

    if (!label) return

    if (!unique.has(label)) {
      unique.set(label, {
        label,
        value: label,
        fullName
      })
    }
  })

  return Array.from(unique.values())
}

export const TargetRegister = () => {
  const currentDate = new Date()
  const currentMonth = currentDate.toLocaleString("default", { month: "long" })
  const currentYear = currentDate.getFullYear()

  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [userbranches, setuserBranches] = useState([])
  const [selectedBranch, setselectedBranch] = useState(null)

  const [availableAllocations, setavailableAllocation] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  const [productandservices, setproductsandservices] = useState([])
  const [categorylist, setcategoryList] = useState([])
  const [isCreateNewMode, setIsCreateNewMode] = useState(false)
  const [respectedmonthtargetType, setrespectedmonthtargetType] = useState({})
  const [selectedsplitProducts, setselectedsplitProducts] = useState(null)
  const [selectedsplitmonth, setselectedsplitmonth] = useState(null)
  const [incentiveWarnings, setIncentiveWarnings] = useState({})
  const [pageMessage, setPageMessage] = useState("")
  const [userMessages, setUserMessages] = useState({})
  const [splitWarnings, setSplitWarnings] = useState({})
  const [selectedAllocations, setSelectedAllocations] = useState([])
  const [submitLoader, setsubmitLoader] = useState(false)
  const [showProductModal, setShowProductModal] = useState(false)
  const [showAllocationModal, setShowAllocationModal] = useState(false)
  const [showSplitModal, setShowSplitModal] = useState(false)
  const [splitModalData, setSplitModalData] = useState(null)

  const [showCreatePeriodModal, setShowCreatePeriodModal] = useState(false)
  console.log(showCreatePeriodModal)
  const [showEditPeriodModal, setShowEditPeriodModal] = useState(false)

  const [fromMonth, setFromMonth] = useState(currentMonth)
  const [toMonth, setToMonth] = useState(currentMonth)
  const [draftFromMonth, setDraftFromMonth] = useState(currentMonth)
  const [draftToMonth, setDraftToMonth] = useState(currentMonth)

  const [committedTargetData, setCommittedTargetData] = useState({})
  const [targetpriceorPercentageType, settargetpriceorPercentageType] =
    useState({})
  const [targetpriceorpercentageValue, settargetpriceorpercentageValue] =
    useState({})
  const [workingSplitData, setWorkingSplitData] = useState({})
  const [committedSplitData, setCommittedSplitData] = useState({})
  const [userList, setuserList] = useState([])

  const [allPeriods, setAllPeriods] = useState([])
  const [targetData, setTargetData] = useState([])
  const [periodOptions, setPeriodOptions] = useState([])
  const [selectedPeriodOption, setSelectedPeriodOption] = useState("")
  const [fetchedPeriodWithoutYear, setFetchedPeriodWithoutYear] = useState("")
  const [activeFetchedPeriodName, setActiveFetchedPeriodName] = useState("")
  const [isInitialPeriodResolved, setIsInitialPeriodResolved] = useState(false)
  const [isLoadingPeriods, setIsLoadingPeriods] = useState(false)

  const committedProductsRef = useRef({})
  const activeRequestRef = useRef(0)

  const { data } = UseFetch("/auth/getallusers?isVerified=true")
  const { data: category } = UseFetch("/inventory/getCategory")
  const { data: tasklist } = UseFetch("/lead/getAlltasktoTarget")

  const loggeduserBranch = useSelector(
    (state) => state.companyBranch.loggeduserbranches
  )

  const query = new URLSearchParams({
    branchselectedArray: JSON.stringify(loggeduserBranch)
  }).toString()

  const resetTargetStates = () => {
    setSelectedProducts([])
    setSelectedAllocations([])
    setCommittedTargetData({})
    setCommittedSplitData({})
    settargetpriceorPercentageType({})
    settargetpriceorpercentageValue({})
    setrespectedmonthtargetType({})
    setWorkingSplitData({})
    committedProductsRef.current = {}
  }

  const getMonthsInRange = (startMonth = fromMonth, endMonth = toMonth) => {
    const fromIndex = months.indexOf(startMonth)
    const toIndex = months.indexOf(endMonth)
    if (fromIndex === -1 || toIndex === -1 || fromIndex > toIndex) return []
    return months.slice(fromIndex, toIndex + 1)
  }

  const selectedMonths = useMemo(
    () => getMonthsInRange(fromMonth, toMonth),
    [fromMonth, toMonth]
  )

  const buildStartDate = (startMonth = fromMonth, year = selectedYear) =>
    new Date(year, getMonthNumber(startMonth) - 1, 1)

  const buildEndDate = (endMonth = toMonth, year = selectedYear) =>
    new Date(year, getMonthNumber(endMonth), 0)

  const recomputeTotalTargetForKey = (splitArray) => {
    if (!splitArray || !splitArray.length) return 0
    return splitArray.reduce((sum, user) => {
      const slabs = user.slabs || []
      if (!slabs.length) return sum
      const lastSlab = slabs[slabs.length - 1]
      return sum + safeNum(lastSlab.toValue ?? lastSlab.to)
    }, 0)
  }

  const hydrateTargetIntoState = (targets) => {
    if (
      !targets?.length ||
      !productandservices.length ||
      !availableAllocations.length
    ) {
      resetTargetStates()
      return
    }

    const nextSelectedProducts = []
    const nextSelectedAllocationsMap = {}
    const nextCommittedTargetData = {}
    const nextCommittedSplitData = {}
    const nextIncentiveValues = {}
    const nextIncentiveTypes = {}
    const nextMonthTypes = {}
    const committedProducts = {}

    targets.forEach((targetItem) => {
      const categoryId = targetItem.categoryId?._id || targetItem.categoryId

      const matchedProduct = productandservices.find(
        (item) => String(item.id) === String(categoryId)
      )

      if (
        matchedProduct &&
        !nextSelectedProducts.some(
          (item) => String(item.id) === String(matchedProduct.id)
        )
      ) {
        nextSelectedProducts.push(matchedProduct)
      }

      ;(targetItem.allocationValues || targetItem.allocations || []).forEach(
        (allocValue) => {
          const allocId =
            allocValue.allocationId?._id || allocValue.allocationId

          const matchedAllocation = availableAllocations.find(
            (item) => String(item.id) === String(allocId)
          )

          if (matchedAllocation)
            nextSelectedAllocationsMap[matchedAllocation.id] = matchedAllocation

          nextIncentiveValues[`${categoryId}-${allocId}-value`] =
            allocValue.value ?? ""
          nextIncentiveTypes[`${categoryId}-${allocId}-type`] =
            allocValue.mode || "amount"
        }
      )
      ;(targetItem.monthlyTargets || []).forEach((monthItem) => {
        const monthName = monthLabelFromNumber(monthItem.month)
        if (!monthName) return

        const splitKey = `${categoryId}-${monthName}`
        nextMonthTypes[splitKey] = targetItem.measurementType || "quantity"

        const users = (monthItem.userTargets || []).map((userTarget) => {
          const normalizedSlabs = (userTarget.slabs || []).map((slab) => ({
            from: Number(slab.fromValue) || 0,
            to: Number(slab.toValue) || 0,
            amount: slab.amount || ""
          }))

          const splitTarget = normalizedSlabs.length
            ? Number(normalizedSlabs[normalizedSlabs.length - 1].to) || 0
            : 0

          return {
            userId: userTarget.userId?._id || userTarget.userId,
            splitTarget,
            slabs: normalizedSlabs
          }
        })

        nextCommittedSplitData[splitKey] = users

        const total = users.reduce((sum, user) => {
          const slabs = user.slabs || []
          if (!slabs.length) return sum
          return sum + (Number(slabs[slabs.length - 1].to) || 0)
        }, 0)

        nextCommittedTargetData[splitKey] = total
      })

      committedProducts[categoryId] = true
    })

    setSelectedProducts(nextSelectedProducts)
    setSelectedAllocations(() => {
      const merged = [...Object.values(nextSelectedAllocationsMap)]
      const followup = availableAllocations.find(
        (item) => item.name?.trim()?.toLowerCase() === "followup"
      )

      if (
        followup &&
        !merged.some((a) => String(a.id) === String(followup.id))
      ) {
        merged.push(followup)
      }

      return merged
    })
    console.log(nextCommittedSplitData)
    console.log(nextCommittedTargetData)
    setCommittedTargetData(nextCommittedTargetData)
    setCommittedSplitData(nextCommittedSplitData)
    settargetpriceorpercentageValue(nextIncentiveValues)
    settargetpriceorPercentageType(nextIncentiveTypes)
    setrespectedmonthtargetType(nextMonthTypes)
    committedProductsRef.current = committedProducts
  }

  const fetchTargets = async ({
    periodName,
    branchId,
    year,
    silent = false
  }) => {
    if (!branchId || !year) return null

    const requestId = Date.now()
    activeRequestRef.current = requestId

    try {
      if (!silent) setPageMessage("")

      const token = getLocalStorageItem("token")
      console.log("Hhz")
      console.log(year)
      const response = await api.get("/target/getregisteredTarget", {
        params: {
          periodName,
          branchId,
          year
        },
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })

      if (activeRequestRef.current !== requestId) {
        return null
      }
      console.log(response?.data?.data)
      return response?.data?.data || null
    } catch (err) {
      if (!silent) {
        setPageMessage(
          err?.response?.data?.message || "Failed to fetch target data"
        )
      }
      return null
    }
  }

  const applyBackendResponse = (payload, year) => {
    const targets = payload?.targets || []
    const allperiods = payload?.allperiods || []
    const selectedperiod = payload?.selectedperiod || null
    const selectedPeriodName = payload?.selectedPeriodName || ""

    const normalizedOptions = normalizePeriods(allperiods, year)
    console.log("hh")
    console.log(allperiods)
    setAllPeriods(allperiods)
    setPeriodOptions(normalizedOptions)
    setTargetData(targets)

    const selectedDisplay =
      getPeriodDisplayWithoutYear(selectedperiod) ||
      getPeriodDisplayWithoutYear(selectedPeriodName)

    const selectedFull =
      getPeriodFullName(selectedperiod, year) ||
      selectedPeriodName ||
      (selectedDisplay ? `${selectedDisplay} ${year}` : "")

    setSelectedPeriodOption(selectedDisplay || "")
    setFetchedPeriodWithoutYear(selectedDisplay || "")
    setActiveFetchedPeriodName(selectedFull || "")

    if (selectedperiod?.startDate && selectedperiod?.endDate) {
      const start = new Date(selectedperiod.startDate)
      const end = new Date(selectedperiod.endDate)
      setFromMonth(months[start.getMonth()])
      setToMonth(months[end.getMonth()])
    } else if (selectedDisplay?.includes("-")) {
      const [from, to] = selectedDisplay.split("-").map((v) => v?.trim())
      if (from && to) {
        setFromMonth(from)
        setToMonth(to)
      }
    } else {
      setFromMonth(currentMonth)
      setToMonth(currentMonth)
    }

    if (targets?.length) {
      console.log("hhh")
      hydrateTargetIntoState(targets)
    } else {
      resetTargetStates()
    }
  }

  const resolveInitialPeriodLoad = async (branchId, year) => {
    if (!branchId || !year) return

    setIsLoadingPeriods(true)
    setPageMessage("")

    try {
      const currentPeriodName = buildPeriodNameWithYear(
        currentMonth,
        currentMonth,
        year
      )

      const payload = await fetchTargets({
        periodName: currentPeriodName,
        branchId,
        year,
        silent: true
      })

      if (payload) {
        applyBackendResponse(payload, year)
      } else {
        setPeriodOptions([])
        setAllPeriods([])
        setTargetData([])
        setSelectedPeriodOption("")
        setFetchedPeriodWithoutYear("")
        setActiveFetchedPeriodName("")
        resetTargetStates()
      }

      setIsInitialPeriodResolved(true)
    } finally {
      setIsLoadingPeriods(false)
    }
  }

  const applyPeriodSelection = async ({
    displayPeriod,
    branchId = selectedBranch,
    year = selectedYear
  }) => {
    if (!displayPeriod) return

    const fullPeriodName = `${displayPeriod} ${year}`

    const payload = await fetchTargets({
      periodName: fullPeriodName,
      branchId,
      year
    })

    if (!payload) return
    applyBackendResponse(payload, year)
  }

  const getUsedMonthsMap = (excludeCurrentFetchedPeriod = false) => {
    const used = new Set()
    console.log("hhh")
    console.log(allPeriods.length)
    allPeriods.forEach((period) => {
      const display = getPeriodDisplayWithoutYear(period)
      console.log(display)
      console.log(fetchedPeriodWithoutYear)
      if (excludeCurrentFetchedPeriod && display === fetchedPeriodWithoutYear) {
        console.log("hhh")
        return
      }
      console.log("h")
      getMonthsCoveredByPeriod(period).forEach((month) => used.add(month))
    })
    console.log(used)
    return used
  }

  const getAvailableMonthsForCreate = (draftStartMonth = null) => {
    console.log("hh")
    const usedMonths = getUsedMonthsMap(false)
    const startIndex =
      draftStartMonth && months.includes(draftStartMonth)
        ? months.indexOf(draftStartMonth)
        : 0

    return months.filter((month, index) => {
      if (usedMonths.has(month)) return false
      return index >= startIndex
    })
  }

  const getAllowedMonthsForEdit = () => {
    const usedMonths = getUsedMonthsMap(true)
    const currentFromIndex = months.indexOf(fromMonth)
    const currentToIndex = months.indexOf(toMonth)

    return months.filter((month, index) => {
      if (index < currentFromIndex) return false
      if (index <= currentToIndex) return true
      return !usedMonths.has(month)
    })
  }
console.log(committedSplitData)
console.log(workingSplitData)
  const validateCreatePeriod = (startMonth, endMonth) => {
    const fromIndex = months.indexOf(startMonth)
    const toIndex = months.indexOf(endMonth)

    if (fromIndex === -1 || toIndex === -1 || fromIndex > toIndex) {
      return "Please select a valid month range"
    }

    const usedMonths = getUsedMonthsMap(false)
    const range = months.slice(fromIndex, toIndex + 1)
    const exists = range.find((month) => usedMonths.has(month))

    if (exists) {
      return `${exists} already exists in another period`
    }

    return ""
  }

  const validateEditPeriod = (startMonth, endMonth) => {
    console.log(startMonth)
    console.log(endMonth)
    const fromIndex = months.indexOf(startMonth)
    const toIndex = months.indexOf(endMonth)
    console.log(fromIndex)
    console.log(toIndex)
    if (fromIndex === -1 || toIndex === -1 || fromIndex > toIndex) {
      return "Please select a valid month range"
    }

    const currentFromIndex = months.indexOf(fromMonth)
    const currentToIndex = months.indexOf(toMonth)
    console.log(currentFromIndex)
    console.log(currentToIndex)
    if (fromIndex !== currentFromIndex) {
      return "From month cannot be changed while editing saved target"
    }

    const usedMonths = getUsedMonthsMap(true)
    console.log(usedMonths)
    for (let i = currentToIndex + 1; i <= toIndex; i++) {
      if (usedMonths.has(months[i])) {
        return `${months[i]} already exists in other period`
      }
    }

    return ""
  }

  useEffect(() => {
    if (tasklist && tasklist.length) {
      console.log(tasklist)
      //       const filteredtask = tasklist.filter((item) => {
      //         const name = (item.taskName || "").trim().toLowerCase()
      // console.log(name)
      //         return (
      //           (item.listed && name !== "Followup") ||
      //           name !== "followup" ||
      //           name === "lead" ||
      //           name === "closing"
      //         )
      //       })
      const filteredtask = tasklist.filter((item) => {
        const name = (item.taskName || "").trim().toLowerCase()

        // keep lead/closing always, drop followup, keep others
        if (name === "lead" || name === "closing") return true
        if (name === "followup") return false
        if (item.listed) return true
      })
      console.log(filteredtask)

      const mapped = filteredtask.map((item) => ({
        id: item._id,
        name: item.taskName
      }))

      setavailableAllocation(mapped)
    }
  }, [tasklist])

  useEffect(() => {
    const userData = getLocalStorageItem("user")
    if (!userData?.selected?.length) return

    setselectedBranch(userData.selected[0]?.branch_id)
    const branches = userData.selected.map((branch) => ({
      id: branch.branch_id,
      branchName: branch.branchName
    }))
    setuserBranches(branches)
  }, [])

  useEffect(() => {
    if (!category) return
    setcategoryList(category)
    setproductsandservices(
      category.map((c) => ({
        id: c._id,
        name: c.category || c.categoryName || c.name || "Category",
        branchIds: []
      }))
    )
  }, [category])

  useEffect(() => {
    if (!data) return
    const { allusers = [], allAdmins = [] } = data
    const combinedUsers = [...allusers, ...allAdmins]

    const users = combinedUsers
      .filter(
        (user) =>
          Array.isArray(user.selected) &&
          user.selected.some((sel) => sel.branch_id === selectedBranch)
      )
      .map((user) => ({
        id: user._id,
        name: user.name,
        givenTarget: "",
        achievedTarget: "",
        slabs: []
      }))

    setuserList(users)
  }, [data, selectedBranch])

  useEffect(() => {
    if (!selectedAllocations?.length || !productandservices?.length) return
    const updatedEntries = {}
    productandservices.forEach((product) => {
      selectedAllocations.forEach((allocationType) => {
        updatedEntries[`${product.id}-${allocationType.id}-type`] =
          updatedEntries[`${product.id}-${allocationType.id}-type`] || "amount"
      })
    })
    settargetpriceorPercentageType((prev) => ({ ...updatedEntries, ...prev }))
  }, [selectedAllocations, productandservices])

  useEffect(() => {
    if (
      !selectedBranch ||
      !selectedYear ||
      !productandservices.length ||
      !availableAllocations.length
    ) {
      return
    }

    resolveInitialPeriodLoad(selectedBranch, selectedYear)
  }, [
    selectedBranch,
    selectedYear,
    productandservices.length,
    availableAllocations.length
  ])

  const filteredProductsForBranch = productandservices

  const handleProductSelection = (product) => {
    setSelectedProducts((prev) => {
      const exists = prev.find((p) => String(p.id) === String(product.id))
      if (exists) return prev.filter((p) => String(p.id) !== String(product.id))
      return [...prev, product]
    })
  }
  console.log(periodOptions)
  const handleAllocationSelection = (allocation) => {
    setSelectedAllocations((prev) => {
      const exists = prev.find((a) => String(a.id) === String(allocation.id))
      if (exists)
        return prev.filter((a) => String(a.id) !== String(allocation.id))
      return [...prev, allocation]
    })
  }

  const handleRemoveProductRow = (productId) => {
    setSelectedProducts((prev) =>
      prev.filter((p) => String(p.id) !== String(productId))
    )

    setCommittedTargetData((prev) => {
      const next = { ...prev }
      Object.keys(next).forEach((key) => {
        if (key.startsWith(`${productId}-`)) delete next[key]
      })
      return next
    })

    settargetpriceorpercentageValue((prev) => {
      const next = { ...prev }
      Object.keys(next).forEach((key) => {
        if (key.startsWith(`${productId}-`)) delete next[key]
      })
      return next
    })

    settargetpriceorPercentageType((prev) => {
      const next = { ...prev }
      Object.keys(next).forEach((key) => {
        if (key.startsWith(`${productId}-`)) delete next[key]
      })
      return next
    })
console.log(committedSplitData)
    setCommittedSplitData((prev) => {
      const next = { ...prev }
      Object.keys(next).forEach((key) => {
        if (key.startsWith(`${productId}-`)) delete next[key]
      })
      return next
    })
    console.log(workingSplitData)
    setWorkingSplitData((prev) => {
      const next = { ...prev }
      Object.keys(next).forEach((key) => {
        if (key.startsWith(`${productId}-`)) delete next[key]
      })
      return next
    })

    delete committedProductsRef.current[productId]
  }
  const handleIncentiveInput = ({
    productId,
    allocId,
    field,
    value,
    month // optional: the month for which you are editing, if relevant
  }) => {
    if (field === "type") {
      // pick a month key; if you're not month-specific, use fromMonth or any selectedMonths[0]
      const effectiveMonth = month || selectedMonths[0] || fromMonth
      const splitTypeKey = `${productId}-${effectiveMonth}`
      const currentSplitType = respectedmonthtargetType[splitTypeKey]

      const normalizedType = normalizeIncentiveTypeForSplit(
        currentSplitType,
        value
      )

      if (normalizedType !== value) {
        toast.warn(
          `Incentive type '${value}' is not allowed for ${currentSplitType} targets. Changed to '${normalizedType}'.`
        )
      }

      settargetpriceorPercentageType((prev) => ({
        ...prev,
        [`${productId}-${allocId}-type`]: normalizedType
      }))
    } else {
      // field === "value"
      settargetpriceorpercentageValue((prev) => ({
        ...prev,
        [`${productId}-${allocId}-value`]: value
      }))
    }
  }
  // const handleIncentiveInput = (productId, allocId, value, field) => {
  //   if (field === "type") {
  //     const splitType =
  //       respectedmonthtargetType?.[`${productId}-${selectedMonths[0]}`] ||
  //       "quantity"

  //     let message = ""

  //     if (splitType === "amount" && value !== "percentage") {
  //       message = "For Amount split, incentive must be %"
  //     }

  //     if (splitType === "quantity" && value !== "amount") {
  //       message = "For Quantity split, incentive must be ₹"
  //     }

  //     if (message) {
  //       setIncentiveWarnings((prev) => ({
  //         ...prev,
  //         [`${productId}-${allocId}`]: message
  //       }))

  //       setTimeout(() => {
  //         setIncentiveWarnings((prev) => {
  //           const updated = { ...prev }
  //           delete updated[`${productId}-${allocId}`]
  //           return updated
  //         })
  //       }, 3000)

  //       setSplitWarnings((prev) => ({
  //         ...prev,
  //         [`${productId}`]:
  //           splitType === "amount"
  //             ? "Split type 'Amount' requires all incentives to be %"
  //             : "Split type 'Quantity' requires all incentives to be ₹"
  //       }))

  //       return
  //     }

  //     setIncentiveWarnings((prev) => ({
  //       ...prev,
  //       [`${productId}-${allocId}`]: ""
  //     }))

  //     setSplitWarnings((prev) => ({
  //       ...prev,
  //       [`${productId}`]: ""
  //     }))

  //     settargetpriceorPercentageType((prev) => ({
  //       ...prev,
  //       [`${productId}-${allocId}-type`]: value
  //     }))
  //   } else {
  //     settargetpriceorpercentageValue((prev) => ({
  //       ...prev,
  //       [`${productId}-${allocId}-value`]: value
  //     }))
  //   }
  // }
  console.log(userList)
  const openSplitModal = (productId, month, name) => {
    const Name = name.trim()

    setrespectedmonthtargetType((prev) => {
      const updated = { ...prev }
      selectedMonths.forEach((m) => {
        const key = `${productId}-${m}`
        const keyName = `${Name}-${m}`
        if (!updated[key]) updated[key] = "quantity"
        if (!updated[keyName]) updated[keyName] = "quantity"
      })
      return updated
    })

    const committedKey = `${productId}-${month}`
    const existingCommitted = committedSplitData[committedKey]
    console.log(existingCommitted)
    console.log(workingSplitData)
    setWorkingSplitData((prev) => ({
      ...prev,
      [committedKey]: existingCommitted
        ? JSON.parse(JSON.stringify(existingCommitted))
        : []
    }))
    console.log(userList)
    setuserList((prevUsers) =>
      prevUsers.map((u) => {
        const userEntry = existingCommitted?.find(
          (item) => item.userId === u.id
        )
        return {
          ...u,
          givenTarget: userEntry ? String(userEntry.splitTarget || "") : "",
          slabs: userEntry
            ? (userEntry.slabs || []).map((slab) => ({
                from: slab.fromValue ?? slab.from ?? 0,
                to: slab.toValue ?? slab.to ?? 0,
                amount: slab.amount ?? ""
              }))
            : []
        }
      })
    )

    setSplitModalData({ productId, month, name })
    setShowSplitModal(true)
    setselectedsplitProducts(productId)
    setselectedsplitmonth(month)
    setUserMessages({})
  }
  console.log(workingSplitData)
  const handleSplitChange = (userId, rawValue) => {
    const value = safeNum(rawValue)
    console.log(value)
    if (userMessages?.[userId]) {
      setUserMessages((prev) => ({ ...prev, [userId]: "" }))
    }

    const key = `${splitModalData.productId}-${splitModalData.month}`
    console.log(workingSplitData)
    setWorkingSplitData((prev) => {
      const existingArray = prev[key] || []
      const idx = existingArray.findIndex((i) => i.userId === userId)
      let userEntry =
        idx !== -1
          ? { ...existingArray[idx] }
          : { userId, splitTarget: 0, slabs: [] }

      let slabs = [...(userEntry.slabs || [])]

      if (!slabs.length) {
        slabs = [{ from: 0, to: value, amount: "" }]
      } else {
        slabs[slabs.length - 1] = { ...slabs[slabs.length - 1], to: value }
      }

      userEntry.slabs = slabs
      userEntry.splitTarget = value

      const updatedArray =
        idx !== -1
          ? existingArray.map((it, i) => (i === idx ? userEntry : it))
          : [...existingArray, userEntry]

      setuserList((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId ? { ...u, givenTarget: value.toString(), slabs } : u
        )
      )

      return { ...prev, [key]: updatedArray }
    })
  }

  const handleAddSlab = (userId) => {
    const key = `${splitModalData.productId}-${splitModalData.month}`

    const user = userList.find((u) => u.id === userId)
    const currentInputValue = safeNum(user?.givenTarget)

    if (!currentInputValue) {
      setUserMessages((prev) => ({
        ...(prev || {}),
        [userId]: "Please fill the target first"
      }))
      return
    }
    console.log(workingSplitData)
    setWorkingSplitData((prev) => {
      const existingArray = prev[key] || []
      const idx = existingArray.findIndex((i) => i.userId === userId)
      let userEntry =
        idx !== -1
          ? { ...existingArray[idx] }
          : { userId, splitTarget: 0, slabs: [] }

      const slabs = [...(userEntry.slabs || [])]

      if (!slabs.length) {
        slabs.push({ from: 0, to: currentInputValue, amount: "" })
      } else {
        const lastTo = safeNum(slabs[slabs.length - 1].to)
        slabs.push({ from: lastTo, to: currentInputValue, amount: "" })
      }

      userEntry.slabs = slabs
      userEntry.splitTarget = currentInputValue

      const updatedArray =
        idx !== -1
          ? existingArray.map((it, i) => (i === idx ? userEntry : it))
          : [...existingArray, userEntry]

      setuserList((prevUsers) =>
        prevUsers.map((u) => (u.id === userId ? { ...u, slabs } : u))
      )

      return { ...prev, [key]: updatedArray }
    })
  }

  const handleRemoveSlab = (userId, slabIndex) => {
    const key = `${splitModalData.productId}-${splitModalData.month}`
    console.log(workingSplitData)
    setWorkingSplitData((prev) => {
      const existingArray = prev[key] || []
      const idx = existingArray.findIndex((i) => i.userId === userId)
      if (idx === -1) return prev

      const entry = { ...existingArray[idx] }
      const slabs = [...(entry.slabs || [])].filter((_, i) => i !== slabIndex)

      entry.slabs = slabs
      entry.splitTarget = slabs.length ? safeNum(slabs[slabs.length - 1].to) : 0

      const updatedArray = existingArray.map((it, i) =>
        i === idx ? entry : it
      )

      setuserList((prevUsers) =>
        prevUsers.map((u) => (u.id === userId ? { ...u, slabs } : u))
      )

      return { ...prev, [key]: updatedArray }
    })
  }
  // const handleSplitTypeChange = (productId, month, newSplitType) => {
  //   const key = `${productId}-${month}`

  //   setrespectedmonthtargetType((prev) => ({
  //     ...prev,
  //     [key]: newSplitType
  //   }))

  //   // Normalize incentive types for this product when split type changes
  //   settargetpriceorPercentageType((prev) => {
  //     const next = { ...prev }

  //     Object.keys(prev).forEach((k) => {
  //       const [pId, allocId] = k.split("-")

  //       if (String(pId) === String(productId)) {
  //         const currentType = prev[k]
  //         const normalized = normalizeIncentiveTypeForSplit(
  //           newSplitType,
  //           currentType
  //         )
  //         if (normalized !== currentType) {
  //           next[k] = normalized
  //         }
  //       }
  //     })

  //     return next
  //   })

  //   toast.info(
  //     `Split type changed to ${newSplitType}. Incompatible incentive types were adjusted automatically.`
  //   )
  // }
  const handleSplitTypeChange = (productId, newType) => {
    // 1) Update split type for all selected months of this product
    setrespectedmonthtargetType((prev) => {
      const updated = { ...prev }
      selectedMonths.forEach((m) => {
        updated[`${productId}-${m}`] = newType
      })
      return updated
    })

    // 2) Normalize incentive types for this product under new split type
    settargetpriceorPercentageType((prev) => {
      const next = { ...prev }

      Object.keys(prev).forEach((key) => {
        const [pId, allocId] = key.split("-")
        if (String(pId) !== String(productId)) return

        const currentType = prev[key]
        const normalized = normalizeIncentiveTypeForSplit(newType, currentType)

        if (normalized !== currentType) {
          next[key] = normalized
        }
      })

      return next
    })

    setSplitWarnings((prev) => ({
      ...prev,
      [`${productId}`]: ""
    }))

    toast.info(
      `Split type changed to ${newType}. Incompatible incentive types were adjusted automatically.`
    )
  }
  const handleSlabChange = (userId, slabIndex, field, rawValue) => {
    const key = `${splitModalData.productId}-${splitModalData.month}`
    const value = field === "amount" ? rawValue : safeNum(rawValue)
    console.log(workingSplitData)
    setWorkingSplitData((prev) => {
      const existingArray = prev[key] || []
      const idx = existingArray.findIndex((i) => i.userId === userId)
      if (idx === -1) return prev

      const entry = { ...existingArray[idx] }
      const slabs = [...(entry.slabs || [])]

      slabs[slabIndex] = { ...slabs[slabIndex], [field]: value }

      if (field === "to") {
        for (let i = slabIndex + 1; i < slabs.length; i++) {
          slabs[i] = {
            ...slabs[i],
            from: safeNum(slabs[i - 1].to)
          }
        }
      }

      entry.slabs = slabs
      if (slabs.length) {
        entry.splitTarget = safeNum(slabs[slabs.length - 1].to)
      }

      const updatedArray = existingArray.map((it, i) =>
        i === idx ? entry : it
      )

      setuserList((prevUsers) =>
        prevUsers.map((u) => (u.id === userId ? { ...u, slabs } : u))
      )

      return { ...prev, [key]: updatedArray }
    })
  }

  const handleCancel = () => {
    setSplitWarnings((prev) => ({
      ...prev,
      [selectedsplitProducts]: ""
    }))
    setShowSplitModal(false)
    setWorkingSplitData({})
    setUserMessages({})
  }
console.log(userList)
  const normalizeSlabs = (slabArray = []) => {
console.log(slabArray)
    return slabArray
      .map((slab, index) => ({
        slabOrder: index + 1,
        from: Number(slab.from) || 0,
        to: Number(slab.to) || 0,
        amount: slab.amount || ""
      }))
      .filter((s) => s.to > s.from)
  }

  const handlesaveSplit = () => {
    if (!splitModalData) return

    const { productId, month } = splitModalData
    const key = `${productId}-${month}`
    const workingArray = workingSplitData[key] || []
console.log(workingArray)
// console.log(normalizeSlabs)
    const normalizedArray = workingArray
      .map((userEntry) => ({
        userId: userEntry.userId,
        splitTarget: Number(userEntry.splitTarget) || 0,
        slabs: normalizeSlabs(userEntry.slabs || [])
      }))
      .filter((userEntry) => userEntry.slabs.length > 0)

    const total = normalizedArray.reduce((sum, user) => {
      if (!user.slabs.length) return sum
      return sum + Number(user.slabs[user.slabs.length - 1].to || 0)
    }, 0)

    const isFirstTime = !committedProductsRef.current[productId]
console.log(committedSplitData)
console.log(normalizedArray)
    setCommittedSplitData((prev) => {
      const next = { ...prev }

      if (isFirstTime) {
        selectedMonths.forEach((m) => {
          next[`${productId}-${m}`] = JSON.parse(
            JSON.stringify(normalizedArray)
          )
        })
      } else {
        next[key] = JSON.parse(JSON.stringify(normalizedArray))
      }

      return next
    })

    setCommittedTargetData((prev) => {
      const next = { ...prev }

      if (isFirstTime) {
        selectedMonths.forEach((m) => {
          next[`${productId}-${m}`] = total
        })
      } else {
        next[key] = total
      }

      return next
    })

    committedProductsRef.current[productId] = true
    setWorkingSplitData({})
    setShowSplitModal(false)
    setUserMessages({})
  }

  const targetArray = targetData || []

  const hasExistingTargetForProduct = (productId) =>
    targetArray.some(
      (item) =>
        String(item.categoryId?._id || item.categoryId) === String(productId)
    )

  const hasExistingSplitForProductMonth = (productId, monthName) => {
    const monthNumber = getMonthNumber(monthName)

    return targetArray.some((item) => {
      const sameCategory =
        String(item.categoryId?._id || item.categoryId) === String(productId)

      if (!sameCategory) return false

      return (item.monthlyTargets || []).some(
        (mt) =>
          Number(mt.month) === Number(monthNumber) &&
          Number(mt.year) === Number(selectedYear) &&
          Array.isArray(mt.userTargets) &&
          mt.userTargets.length > 0
      )
    })
  }

  const isSplitUpdateMode =
    splitModalData &&
    hasExistingSplitForProductMonth(
      splitModalData.productId,
      splitModalData.month
    )

  const isUpdateMode =
    !!targetArray.length &&
    selectedProducts?.length > 0 &&
    selectedProducts.every((product) => hasExistingTargetForProduct(product.id))

  const modalKey =
    splitModalData && `${splitModalData.productId}-${splitModalData.month}`
  const modalWorkingArray = modalKey ? workingSplitData[modalKey] || [] : []
  const modalTotal = recomputeTotalTargetForKey(modalWorkingArray)

  const currentType =
    respectedmonthtargetType?.[
      `${selectedsplitProducts}-${selectedsplitmonth}`
    ] || "quantity"

  const totalLabel =
    currentType === "quantity"
      ? `${modalTotal} NO`
      : `₹ ${modalTotal.toLocaleString("en-IN")}`

  // const handlePeriodChange = async (value) => {
  //   setPageMessage("")
  //   await applyPeriodSelection({ displayPeriod: value })
  // }//old
  const handlePeriodChange = async (value) => {
    setPageMessage("")

    setSelectedPeriodOption(value)
    setIsCreateNewMode(false)
    await applyPeriodSelection({ displayPeriod: value })
  }

  // const handleOpenCreatePeriod = () => {
  //   setDraftFromMonth(currentMonth)
  //   setDraftToMonth(currentMonth)
  //   setShowCreatePeriodModal(true)
  // }
  const handleOpenCreatePeriod = () => {
    const availableFromMonths = months.filter(
      (month) => !getUsedMonthsMap(false).has(month)
    )

    const firstAvailableMonth = availableFromMonths[0] || currentMonth

    setDraftFromMonth(firstAvailableMonth)
    setDraftToMonth(firstAvailableMonth)
    setShowCreatePeriodModal(true)
  }

  const handleOpenEditPeriod = () => {
    setDraftFromMonth(fromMonth)
    setDraftToMonth(toMonth)
    setShowEditPeriodModal(true)
  }

  // const handleConfirmCreatePeriod = () => {
  //   const error = validateCreatePeriod(draftFromMonth, draftToMonth)
  //   if (error) {
  //     setPageMessage(error)
  //     return
  //   }

  //   const display = buildPeriodLabelWithoutYear(draftFromMonth, draftToMonth)
  //   setFromMonth(draftFromMonth)
  //   setToMonth(draftToMonth)
  //   setSelectedPeriodOption("")
  //   setFetchedPeriodWithoutYear(display)
  //   setActiveFetchedPeriodName(
  //     buildPeriodNameWithYear(draftFromMonth, draftToMonth, selectedYear)
  //   )
  //   resetTargetStates()
  //   setTargetData([])
  //   setShowCreatePeriodModal(false)
  //   setPageMessage("")
  // }old
  const handleConfirmCreatePeriod = () => {
    const error = validateCreatePeriod(draftFromMonth, draftToMonth)

    if (error) {
      setPageMessage(error)
      return
    }

    const display = buildPeriodLabelWithoutYear(draftFromMonth, draftToMonth)
    const fullName = buildPeriodNameWithYear(
      draftFromMonth,
      draftToMonth,
      selectedYear
    )
    console.log(fullName)
    console.log("hhh")
    setFromMonth(draftFromMonth)
    setToMonth(draftToMonth)

    setFetchedPeriodWithoutYear(display)
    setActiveFetchedPeriodName(fullName)
    console.log("hhh")
    setSelectedPeriodOption(display)
    setIsCreateNewMode(true)
    console.log("hh")
    setPeriodOptions((prev) => {
      const safePrev = Array.isArray(prev) ? prev : []

      const alreadyExists = safePrev.some((item) => item.value === display)
      if (alreadyExists) return safePrev

      return [
        ...safePrev,
        {
          label: display,
          value: display,
          fullName
        }
      ]
    })
    console.log("Hh")

    console.log("hh")

    resetTargetStates()
    console.log("hhh")
    setTargetData([])
    console.log("hh")
    setShowCreatePeriodModal(false)
    console.log("hh")
    setPageMessage("")
  }

  const handleConfirmEditPeriod = () => {
    const error = validateEditPeriod(draftFromMonth, draftToMonth)
    console.log(error)

    if (error) {
      setPageMessage(error)
      return
    }

    setFromMonth(draftFromMonth)
    setToMonth(draftToMonth)

    const display = buildPeriodLabelWithoutYear(draftFromMonth, draftToMonth)
    console.log(display)
    setFetchedPeriodWithoutYear(display)
    setActiveFetchedPeriodName(
      buildPeriodNameWithYear(draftFromMonth, draftToMonth, selectedYear)
    )
    setSelectedPeriodOption(display)
    setShowEditPeriodModal(false)
    setPageMessage("")
  }
  // const normalizeIncentiveTypeForSplit = (splitType, newIncentiveType) => {
  //   if (!splitType) return newIncentiveType

  //   const type = String(newIncentiveType).toLowerCase()

  //   if (splitType === "quantity") {
  //     // quantity-based targets: cannot be percentage
  //     if (type === "percentage" || type === "%") {
  //       return "amount" // or "rupee" depending on what you treat as fixed
  //     }
  //   }

  //   if (splitType === "amount") {
  //     // amount-based targets: cannot be rupee
  //     if (type === "rupee" || type === "₹") {
  //       return "percentage"
  //     }
  //   }

  //   return newIncentiveType
  // }
  const normalizeIncentiveTypeForSplit = (splitType, newIncentiveType) => {
    if (!splitType) return newIncentiveType

    const t = String(newIncentiveType).toLowerCase()

    // quantity: incentives must be amount (₹), not %
    if (splitType === "quantity") {
      if (t === "percentage" || t === "%") return "amount"
    }

    // amount: incentives must be percentage, not rupee
    if (splitType === "amount") {
      if (t === "amount" || t === "rupee" || t === "₹") return "percentage"
    }

    return newIncentiveType
  }

  const handleSubmitTarget = async () => {
    try {
      setsubmitLoader(true)
      setPageMessage("")

      if (!selectedBranch) {
        setPageMessage("Please select branch")
        return
      }

      if (!selectedProducts.length) {
        setPageMessage("Please select at least one category")
        return
      }

      if (!selectedAllocations.length) {
        setPageMessage("Please select at least one allocation")
        return
      }

      if (!selectedMonths.length) {
        setPageMessage("Please select a valid month range")
        return
      }

      const startDate = buildStartDate()
      const endDate = buildEndDate()
      const finalPeriodName = buildPeriodNameWithYear(
        fromMonth,
        toMonth,
        selectedYear
      )

      const payloads = selectedProducts.map((product) => {
        const allocationsPayload = selectedAllocations.map((alloc) => ({
          allocationId: alloc.id,
          value:
            Number(
              targetpriceorpercentageValue[`${product.id}-${alloc.id}-value`]
            ) || 0,
          mode: targetpriceorPercentageType[`${product.id}-${alloc.id}-type`]
        }))

        const monthlyTargetsPayload = selectedMonths.map((monthName) => {
          const splitKey = `${product.id}-${monthName}`
          const monthNumber = getMonthNumber(monthName)
          const savedUsers = committedSplitData[splitKey] || []

          const userTargets = savedUsers
            .map((user) => ({
              userId: user.userId,
              slabs: (user.slabs || [])
                .map((slab, index) => ({
                  slabOrder: index + 1,
                  fromValue: Number(slab.fromValue ?? slab.from) || 0,
                  toValue: Number(slab.toValue ?? slab.to) || 0,
                  amount: slab.amount || ""
                }))
                .filter((slab) => slab.toValue > slab.fromValue)
            }))
            .filter((u) => u.slabs.length > 0)

          return {
            month: monthNumber,
            year: selectedYear,
            userTargets
          }
        })

        return {
          periodName: finalPeriodName,
          branchId: selectedBranch,
          year: selectedYear,
          startDate,
          endDate,
          categoryId: product.id,
          measurementType:
            respectedmonthtargetType?.[`${product.id}-${selectedMonths[0]}`] ||
            "quantity",
          allocations: allocationsPayload,
          monthlyTargets: monthlyTargetsPayload
        }
      })
      console.log(payloads)
      const token = getLocalStorageItem("token")

      await Promise.all(
        payloads.map((body) =>
          api.post("/target/createOrUpdateTargetConfiguration", body, {
            headers: { Authorization: `Bearer ${token}` }
          })
        )
      )
      setsubmitLoader(false)
      toast.success(
        isUpdateMode
          ? "Target updated Successfully"
          : "Target saved Successfully"
      )
      setPageMessage(
        isUpdateMode
          ? "Target configuration updated successfully"
          : "Target configuration saved successfully"
      )

      await resolveInitialPeriodLoad(selectedBranch, selectedYear)

      const latestDisplay = buildPeriodLabelWithoutYear(fromMonth, toMonth)
      if (latestDisplay) {
        await applyPeriodSelection({
          displayPeriod: latestDisplay,
          branchId: selectedBranch,
          year: selectedYear
        })
      }
    } catch (err) {
      toast.error("Submission failed")
      setPageMessage(
        err?.response?.data?.message || "Failed to save target configuration"
      )
    }
  }

  const availableCreateFromMonths = months.filter(
    (month) => !getUsedMonthsMap(false).has(month)
  )
  const availableCreateToMonths = getAvailableMonthsForCreate(draftFromMonth)
  const availableEditToMonths = getAllowedMonthsForEdit()

  return (
    <div className="h-full bg-[#ADD8E6] flex flex-col px-3 py-4 sm:px-5 sm:py-5 overflow-hidden">
      <div className="mx-auto  w-auto flex flex-col flex-1 min-h-0 gap-3">
        <div className="flex-shrink-0 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white border border-slate-200 rounded-lg px-3 py-3">
          <div className="space-y-1">
            <h1 className="text-lg sm:text-xl font-semibold text-slate-900">
              Target Master
            </h1>

            {isInitialPeriodResolved && (
              <p className="text-xs text-slate-500">
                Period{" "}
                <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
                  {fetchedPeriodWithoutYear || `${fromMonth}-${toMonth}`}
                </span>
              </p>
            )}

            {pageMessage && (
              <p className="text-xs font-medium text-rose-600">{pageMessage}</p>
            )}

            {isLoadingPeriods && (
              <p className="text-xs font-medium text-blue-600">
                Loading target periods...
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Branch
              </span>
              <div className="relative">
                <select
                  value={selectedBranch || ""}
                  onChange={(e) => setselectedBranch(e.target.value)}
                  className="h-8 min-w-[150px] rounded-md border border-slate-300 bg-white pr-7 pl-3 text-xs text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                >
                  {userbranches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.branchName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Year
              </span>
              <input
                type="number"
                value={selectedYear}
                onChange={(e) =>
                  setSelectedYear(Number(e.target.value) || currentYear)
                }
                className="h-8 w-[110px] rounded-md border border-slate-300 bg-white px-3 text-xs text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div className="flex flex-col gap-1 mt-2 sm:mt-0">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Period
              </span>
              <div className="relative">
                <select
                  value={selectedPeriodOption || ""}
                  onChange={(e) => handlePeriodChange(e.target.value)}
                  className="h-8 min-w-[220px] rounded-md border border-slate-300 bg-white pr-8 pl-3 text-xs text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                >
                  <option value="" disabled>
                    Select period
                  </option>
                  {periodOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {!!fetchedPeriodWithoutYear && (
              <button
                type="button"
                onClick={handleOpenEditPeriod}
                className="mt-5 inline-flex items-center gap-1.5 rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 shadow-sm hover:bg-amber-100"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit Period
              </button>
            )}

            {/* {!isCreateNewMode && (
              <button
                type="button"
                className="mt-5 inline-flex items-center gap-1.5 rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 shadow-sm hover:bg-amber-100"
                onClick={handleOpenEditPeriod}
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit Period
              </button>
            )} */}

            <button
              type="button"
              onClick={handleOpenCreatePeriod}
              className="mt-5 inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              <Plus className="h-3.5 w-3.5" />
              New Period
            </button>
          </div>
        </div>

        <div className="flex-shrink-0 flex flex-wrap gap-2">
          <button
            onClick={() => setShowProductModal(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 shadow-sm hover:border-indigo-500 hover:text-indigo-700 hover:shadow focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          >
            <Settings className="h-3.5 w-3.5 text-indigo-500" />
            Categories ({selectedProducts?.length})
          </button>

          <button
            onClick={() => setShowAllocationModal(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
          >
            <Plus className="h-3.5 w-3.5" />
            Allocations ({selectedAllocations?.length})
          </button>
        </div>

        <div className="flex-1 min-h-0 flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="flex-1 min-h-0 overflow-x-auto overflow-y-auto">
            <table className="w-full min-w-[1100px] border-collapse text-xs">
              <thead className="sticky top-0 z-10">
                <tr className="bg-slate-900">
                  <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-white border-r border-slate-800">
                    Products &amp; Services
                  </th>
                  <th
                    colSpan={selectedMonths?.length || 1}
                    className="px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-white border-r border-slate-800"
                  >
                    Target
                  </th>
                  <th
                    colSpan={selectedAllocations?.length || 1}
                    className="px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-white"
                  >
                    Incentive
                  </th>
                </tr>

                <tr className="bg-slate-50">
                  <th className="px-3 py-1.5 text-left text-[11px] font-medium text-slate-500 border-r border-slate-200"></th>

                  {selectedMonths?.map((month) => (
                    <th
                      key={month}
                      className="px-3 py-1.5 text-center text-[11px] font-medium text-slate-600 border-r border-slate-200 whitespace-nowrap"
                    >
                      {month}
                    </th>
                  ))}

                  {!selectedMonths.length && (
                    <th className="px-3 py-1.5 text-center text-[11px] font-medium text-slate-600 border-r border-slate-200 whitespace-nowrap">
                      Month
                    </th>
                  )}

                  {selectedAllocations?.map((alloc) => (
                    <th
                      key={alloc.id}
                      className="px-3 py-1.5 text-center text-[11px] font-medium text-slate-600 border-r border-slate-200 whitespace-nowrap"
                    >
                      {alloc.name}
                    </th>
                  ))}

                  {!selectedAllocations.length && (
                    <th className="px-3 py-1.5 text-center text-[11px] font-medium text-slate-600 border-r border-slate-200 whitespace-nowrap">
                      Allocation
                    </th>
                  )}
                </tr>
              </thead>

              <tbody>
                {selectedProducts?.map((product, idx) => (
                  <tr
                    key={product.id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}
                  >
                    <td className="px-3 py-2 border-r border-slate-200 text-[13px] font-medium text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleRemoveProductRow(product.id)}
                          className="inline-flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 w-5 h-5 text-[10px]"
                          title="Remove row"
                        >
                          ×
                        </button>
                        <span>{product.name}</span>
                      </div>
                    </td>

                    {selectedMonths.map((month) => (
                      <td
                        key={month}
                        className="px-2 py-1.5 border-r border-slate-200 align-middle"
                      >
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            disabled
                            value={
                              committedTargetData[`${product.id}-${month}`] ||
                              ""
                            }
                            className="w-20 rounded-md border border-slate-300 bg-slate-50 px-2 py-1 text-[11px] text-slate-800"
                            placeholder="0"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              openSplitModal(product.id, month, product.name)
                            }
                            className="inline-flex items-center justify-center rounded-full bg-slate-900 p-1 text-white text-[10px] hover:bg-slate-800"
                            title="Split Target"
                          >
                            <Users className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                    ))}

                    {selectedAllocations.map((alloc) => {
                      const warningKey = `${product.id}-${alloc.id}`
                      return (
                        <td
                          key={alloc.id}
                          className="px-2 py-1.5 border-r border-slate-200 align-middle"
                        >
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                value={
                                  targetpriceorpercentageValue[
                                    `${product.id}-${alloc.id}-value`
                                  ] || ""
                                }
                                onChange={(e) =>
                                  // handleIncentiveInput(
                                  //   product.id,
                                  //   alloc.id,
                                  //   e.target.value,
                                  //   "value"
                                  // )
                                  handleIncentiveInput({
                                    productId: product.id,
                                    allocId: alloc.id,
                                    field: "value",
                                    value: e.target.value
                                  })
                                }
                                className="max-w-24 rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px]"
                                placeholder="0"
                              />

                              <select
                                value={
                                  targetpriceorPercentageType[
                                    `${product.id}-${alloc.id}-type`
                                  ] || "amount"
                                }
                                onChange={(e) =>
                                  // handleIncentiveInput(
                                  //   product.id,
                                  //   alloc.id,
                                  //   e.target.value,
                                  //   "type"
                                  // )
                                  handleIncentiveInput({
                                    productId: product.id,
                                    allocId: alloc.id,
                                    field: "type",
                                    value: e.target.value
                                    // if you know the month context here, also pass month
                                  })
                                }
                                className="rounded-md border border-slate-300 px-2 py-1 text-[11px]"
                              >
                                <option value="amount">₹</option>
                                <option value="percentage">%</option>
                              </select>
                            </div>

                            {incentiveWarnings[warningKey] && (
                              <p className="text-[10px] text-red-500 mt-1">
                                {incentiveWarnings[warningKey]}
                              </p>
                            )}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}

                {selectedProducts?.length === 0 && (
                  <tr>
                    <td
                      colSpan={
                        1 +
                        Math.max(selectedMonths.length, 1) +
                        Math.max(selectedAllocations.length, 1)
                      }
                      className="px-3 py-8 text-center text-sm text-slate-500"
                    >
                      No categories selected.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex-shrink-0 flex justify-end items-center gap-2 border-t border-slate-200 bg-slate-50 px-3 py-2.5">
            <span className="hidden text-[11px] text-slate-500 sm:inline">
              Changes apply for selected branch and period.
            </span>
            <button
              onClick={handleSubmitTarget}
              className="inline-flex items-center rounded-md bg-slate-900 px-4 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-slate-800"
            >
              {isUpdateMode ? "Update Target" : "Save Target"}
            </button>
          </div>
        </div>

        {showCreatePeriodModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
              <div className="px-4 py-3 flex items-center justify-between border-b border-slate-200 bg-slate-50">
                <h3 className="text-sm font-semibold text-slate-900">
                  Create New Target Period
                </h3>
                <button
                  onClick={() => setShowCreatePeriodModal(false)}
                  className="rounded-full p-1 text-slate-500 hover:bg-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    From Month
                  </label>
                  <select
                    value={draftFromMonth}
                    onChange={(e) => {
                      setDraftFromMonth(e.target.value)
                      if (
                        months.indexOf(draftToMonth) <
                        months.indexOf(e.target.value)
                      ) {
                        setDraftToMonth(e.target.value)
                      }
                    }}
                    className="w-full h-9 rounded-md border border-slate-300 px-3 text-sm"
                  >
                    {availableCreateFromMonths.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    To Month
                  </label>
                  <select
                    value={draftToMonth}
                    onChange={(e) => setDraftToMonth(e.target.value)}
                    className="w-full h-9 rounded-md border border-slate-300 px-3 text-sm"
                  >
                    {availableCreateToMonths.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
                <button
                  onClick={() => setShowCreatePeriodModal(false)}
                  className="px-4 py-1.5 bg-slate-200 text-xs rounded-md hover:bg-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmCreatePeriod}
                  className="px-4 py-1.5 bg-indigo-600 text-xs text-white rounded-md hover:bg-indigo-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {showEditPeriodModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
              <div className="px-4 py-3 flex items-center justify-between border-b border-slate-200 bg-slate-50">
                <h3 className="text-sm font-semibold text-slate-900">
                  Edit Saved Target Period
                </h3>
                <button
                  onClick={() => setShowEditPeriodModal(false)}
                  className="rounded-full p-1 text-slate-500 hover:bg-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    From Month
                  </label>
                  <input
                    value={draftFromMonth}
                    disabled
                    className="w-full h-9 rounded-md border border-slate-300 bg-slate-100 px-3 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    To Month
                  </label>
                  <select
                    value={draftToMonth}
                    onChange={(e) => setDraftToMonth(e.target.value)}
                    className="w-full h-9 rounded-md border border-slate-300 px-3 text-sm"
                  >
                    {availableEditToMonths.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
                <button
                  onClick={() => setShowEditPeriodModal(false)}
                  className="px-4 py-1.5 bg-slate-200 text-xs rounded-md hover:bg-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmEditPeriod}
                  className="px-4 py-1.5 bg-amber-600 text-xs text-white rounded-md hover:bg-amber-700"
                >
                  Update Period
                </button>
              </div>
            </div>
          </div>
        )}

        {showProductModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
              <div className="px-4 py-3 flex items-center justify-between border-b border-slate-200 bg-slate-50">
                <h3 className="text-sm font-semibold text-slate-900">
                  Select Categories
                </h3>
                <button
                  onClick={() => setShowProductModal(false)}
                  className="rounded-full p-1 text-slate-500 hover:bg-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 space-y-1 max-h-80 overflow-y-auto">
                {filteredProductsForBranch?.map((product) => (
                  <label
                    key={product.id}
                    className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-slate-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedProducts?.some(
                        (p) => String(p.id) === String(product.id)
                      )}
                      onChange={() => handleProductSelection(product)}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300"
                    />
                    <span className="text-sm text-slate-800">
                      {product.name}
                    </span>
                  </label>
                ))}
                {filteredProductsForBranch.length === 0 && (
                  <p className="text-xs text-slate-500 px-2 py-1.5">
                    No categories found.
                  </p>
                )}
              </div>
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-1.5 bg-indigo-600 text-xs text-white rounded-md hover:bg-indigo-700"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {showAllocationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
              <div className="px-4 py-3 flex items-center justify-between border-b border-slate-200 bg-slate-50">
                <h3 className="text-sm font-semibold text-slate-900">
                  Select Allocation Types
                </h3>
                <button
                  onClick={() => setShowAllocationModal(false)}
                  className="rounded-full p-1 text-slate-500 hover:bg-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 space-y-1 max-h-80 overflow-y-auto">
                {availableAllocations?.map((allocation) => (
                  <label
                    key={allocation.id}
                    className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-slate-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAllocations?.some(
                        (a) => String(a.id) === String(allocation.id)
                      )}
                      onChange={() => handleAllocationSelection(allocation)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300"
                    />
                    <span className="text-sm text-slate-800">
                      {allocation.name}
                    </span>
                  </label>
                ))}
              </div>
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setShowAllocationModal(false)}
                  className="px-4 py-1.5 bg-emerald-600 text-xs text-white rounded-md hover:bg-emerald-700"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {showSplitModal && splitModalData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full flex flex-col overflow-hidden max-h-[90vh]">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between rounded-t-xl flex-shrink-0">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Split Target
                  </h3>
                  <p className="text-sm text-blue-100">
                    {
                      productandservices.find(
                        (p) => p.id === splitModalData.productId
                      )?.name
                    }
                    {" - "}
                    {splitModalData.month}
                    {" · "}
                    <span className="font-semibold">
                      Total Target: {totalLabel}
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="bg-white sticky top-0 z-10 px-6 py-3 border-b border-gray-200 flex items-center">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                      Split Type
                    </label>
                    <div className="relative">
                      <select
                        value={
                          respectedmonthtargetType?.[
                            `${selectedsplitProducts}-${selectedsplitmonth}`
                          ] || "quantity"
                        }
                        onChange={(e) =>
                          handleSplitTypeChange(
                            selectedsplitProducts,
                            e.target.value
                          )
                        }
                        // onChange={(e) => {
                        //   const newType = e.target.value
                        //   const productId = selectedsplitProducts

                        //   const invalidAlloc = selectedAllocations.find(
                        //     (alloc) => {
                        //       const incentiveType =
                        //         targetpriceorPercentageType[
                        //           `${productId}-${alloc.id}-type`
                        //         ] || "amount"

                        //       if (
                        //         newType === "amount" &&
                        //         incentiveType !== "percentage"
                        //       ) {
                        //         return true
                        //       }
                        //       if (
                        //         newType === "quantity" &&
                        //         incentiveType !== "amount"
                        //       ) {
                        //         return true
                        //       }

                        //       return false
                        //     }
                        //   )

                        //   if (invalidAlloc) {
                        //     setSplitWarnings((prev) => ({
                        //       ...prev,
                        //       [`${productId}`]:
                        //         newType === "amount"
                        //           ? "Split type 'Amount' requires all incentives to be %"
                        //           : "Split type 'Quantity' requires all incentives to be ₹"
                        //     }))
                        //     return
                        //   }

                        //   setSplitWarnings((prev) => ({
                        //     ...prev,
                        //     [`${productId}`]: ""
                        //   }))

                        //   setrespectedmonthtargetType((prev) => {
                        //     const updated = { ...prev }
                        //     selectedMonths.forEach((m) => {
                        //       updated[`${productId}-${m}`] = newType
                        //     })
                        //     return updated
                        //   })
                        // }}
                        className="w-28 px-2 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                      >
                        <option value="quantity">Quantity</option>
                        <option value="amount">Amount</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                    {splitWarnings[selectedsplitProducts] && (
                      <p className="text-xs text-red-500 mt-1">
                        {splitWarnings[selectedsplitProducts]}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-1 justify-end items-center pr-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Total Target:</span>{" "}
                      {totalLabel}
                    </p>
                  </div>
                </div>

                <label className="block text-sm font-medium text-gray-700 px-6 pt-3 pb-1">
                  Assign to Users
                </label>

                <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4">
                  {userList.map((user) => {
                    const key = `${splitModalData.productId}-${splitModalData.month}`
                    const userArray = workingSplitData[key] || []
                    console.log(userArray)
                    console.log(user.id)
                    const currentUserData = userArray.find(
                      (item) => item.userId === user.id
                    )
                    const userValue = currentUserData
                      ? currentUserData.splitTarget || ""
                      : ""
                    const userSlabs = currentUserData?.slabs || []
                    console.log(userSlabs)
                    return (
                      <div
                        key={user.id}
                        className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                      >
                        <div className="grid grid-cols-[180px,120px,110px,minmax(0,1fr)] gap-2 items-start">
                          <span className="text-sm font-medium text-gray-700 truncate">
                            {user.name}
                          </span>

                          <div className="flex flex-col">
                            <input
                              type="number"
                              value={userValue || ""}
                              onChange={(e) =>
                                handleSplitChange(user.id, e.target.value)
                              }
                              className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="0"
                            />
                            {userMessages?.[user.id] && (
                              <p className="text-red-400 text-xs mt-1">
                                {userMessages[user.id]}
                              </p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAddSlab(user.id)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
                          >
                            Add Slab
                          </button>

                          <div className="flex flex-wrap gap-2">
                            {userSlabs.map((slab, index) => (
                              <div
                                key={index}
                                className="relative bg-white border border-gray-300 rounded-lg shadow-sm flex-shrink-0"
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveSlab(user.id, index)
                                  }
                                  className="absolute -top-2 -right-2 z-10 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
                                  title="Remove slab"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                                <table className="text-xs border-collapse">
                                  <thead>
                                    <tr>
                                      <th className="px-1.5 py-0.5 text-center font-semibold bg-red-100 text-red-800 border-b w-20">
                                        From
                                      </th>
                                      <th className="px-1.5 py-0.5 text-center font-semibold bg-green-100 text-green-800 border-b w-20">
                                        To
                                      </th>
                                      <th className="px-1.5 py-0.5 text-center font-semibold bg-blue-100 text-blue-800 border-b w-20">
                                        Amount
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className="px-1.5 py-1">
                                        <input
                                          type="text"
                                          value={slab.from}
                                          onChange={(e) =>
                                            handleSlabChange(
                                              user.id,
                                              index,
                                              "from",
                                              e.target.value
                                            )
                                          }
                                          className="w-20 px-1.5 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs text-center"
                                          placeholder="0"
                                        />
                                      </td>
                                      <td className="px-1.5 py-1">
                                        <input
                                          type="text"
                                          value={slab.to}
                                          onChange={(e) =>
                                            handleSlabChange(
                                              user.id,
                                              index,
                                              "to",
                                              e.target.value
                                            )
                                          }
                                          className="w-20 px-1.5 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs text-center"
                                          placeholder="0"
                                        />
                                      </td>
                                      <td className="px-1.5 py-1">
                                        <input
                                          type="number"
                                          value={slab.amount}
                                          onChange={(e) =>
                                            handleSlabChange(
                                              user.id,
                                              index,
                                              "amount",
                                              e.target.value
                                            )
                                          }
                                          className="w-20 px-1.5 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs text-center"
                                          placeholder="0"
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-100 rounded-b-xl flex justify-end gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlesaveSplit}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {isSplitUpdateMode ? "Update Splits" : "Save Split"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TargetRegister
