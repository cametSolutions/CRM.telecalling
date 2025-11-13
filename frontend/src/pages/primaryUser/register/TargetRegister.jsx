import { useState, useEffect } from "react"
import { Plus, Settings, Users, X, ChevronDown } from "lucide-react"
import { useSelector } from "react-redux"
import UseFetch from "../../../hooks/useFetch"
import api from "../../../api/api"
import { split } from "lodash"

// Sample data
const availableProducts = [
  { id: 1, name: "Tally Prime" },
  { id: 2, name: "Tally ERP 9" },
  { id: 3, name: "Tally Server" },
  { id: 4, name: "Tally Cloud" }
]

const availableAllocations = [
  { id: 1, name: "Follow Up" },
  { id: 2, name: "Demo" },
  { id: 3, name: "Onsite" },
  { id: 4, name: "Closing" }
]

const availableUsers = [
  { id: 1, name: "Riyas" },
  { id: 2, name: "Ahmed" },
  { id: 3, name: "Sarah" },
  { id: 4, name: "John" }
]

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

export const TargetRegister = () => {
  const [fromMonth, setFromMonth] = useState("October")
  const [toMonth, setToMonth] = useState("December")
  const [selectedProducts, setSelectedProducts] = useState([])
  const [productandservices, setproductsandservices] = useState([])
  const [submitdata, setsubmitdata] = useState({})
  const [respectedmonthtargetType, setrespectedmonthtargetType] = useState({})
  const [selectedsplitProducts, setselectedsplitProducts] = useState(null)
  const [selectedsplitmonth, setselectedsplitmonth] = useState(null)
  const [message, setMessage] = useState(null)
  const [selectedAllocations, setSelectedAllocations] = useState([
    availableAllocations[0]
  ])
  const [showProductModal, setShowProductModal] = useState(false)
  const [showAllocationModal, setShowAllocationModal] = useState(false)
  const [showSplitModal, setShowSplitModal] = useState(false)
  const [splitModalData, setSplitModalData] = useState(null)
  const [targetData, setTargetData] = useState({})
  const [targetpriceorPercentageType, settargetpriceorPercentageType] =
    useState({})
  const [targetpriceorpercentageValue, settargetpriceorpercentageValue] =
    useState({})
  const [splitData, setSplitData] = useState([])
  const [userList, setuserList] = useState([])
  const { data } = UseFetch("/auth/getallusers")
  const loggeduserBranch = useSelector(
    (state) => state.companyBranch.loggeduserbranches
  )
  const companybranches = useSelector((state) => state.companyBranch.branches)
  const query = new URLSearchParams({
    branchselectedArray: JSON.stringify(loggeduserBranch)
  }).toString()

  const { data: productslist } = UseFetch(`/product/getallproducts?${query}`)
  const { data: servicelist } = UseFetch(`/product/getallServices?${query}`)

  useEffect(() => {
    if (productslist && productslist.length) {
      if (servicelist && servicelist.length) {
        const a = [...productslist, ...servicelist]
        console.log(a)
        const b = a.map((item) => {
          return {
            id: item?._id,
            name: item?.productName || item?.serviceName
          }
        })
        setproductsandservices(b)
        console.log(b)
        // console.log(productslist)
        // console.log(servicelist)
      } else {
      }
    } else if (servicelist && servicelist.length) {
      if (productslist && productslist.length) {
      }
    }
    console.log("H")
  }, [productslist, servicelist])
  console.log(productandservices)
  console.log(data)
  useEffect(() => {
    if (data) {
      const { allusers = [], allAdmins = [] } = data
      // Combine allusers and allAdmins
      const combinedUsers = [...allusers, ...allAdmins]
      console.log(combinedUsers)
      const users = combinedUsers.map((user) => {
        return {
          id: user._id,
          name: user.name,
          givenTarget: "",
          achievedTarget: ""
        }
      })
      setuserList(users)
    }
  }, [data])
  useEffect(() => {
    if (
      selectedAllocations &&
      selectedAllocations.length &&
      productandservices &&
      productandservices.length
    ) {
      console.log(productandservices)
      console.log(selectedAllocations)
      const updatedEntries = {}

      productandservices.forEach((productId) => {
        selectedAllocations.forEach((allocationType) => {
          updatedEntries[`${productId.id}-${allocationType.id}-type`] = "amount"
        })
      })

      settargetpriceorPercentageType((prev) => ({
        ...prev,
        ...updatedEntries
      }))
    }
  }, [selectedAllocations, productandservices])
  console.log(targetpriceorPercentageType)
  console.log(splitData)
  const getMonthsInRange = () => {
    const fromIndex = months.indexOf(fromMonth)
    const toIndex = months.indexOf(toMonth)
    if (fromIndex === -1 || toIndex === -1 || fromIndex > toIndex) return []
    return months.slice(fromIndex, toIndex + 1)
  }

  const selectedMonths = getMonthsInRange()
  console.log(selectedMonths)

  const handleProductSelection = (product) => {
    setSelectedProducts((prev) => {
      const exists = prev.find((p) => p.id === product.id)
      if (exists) {
        return prev.filter((p) => p.id !== product.id)
      }
      return [...prev, product]
    })
  }

  const handleAllocationSelection = (allocation) => {
    setSelectedAllocations((prev) => {
      const exists = prev.find((a) => a.id === allocation.id)
      if (exists) {
        return prev.filter((a) => a.id !== allocation.id)
      }
      return [...prev, allocation]
    })
  }

  const handleTargetInput = (productId, month, value) => {
    setTargetData((prev) => ({
      ...prev,
      [`${productId}-${month}`]: value
    }))
  }

  const handleIncentiveInput = (productId, allocId, value, type) => {
    console.log(type)
    if (type === "type") {
      settargetpriceorPercentageType((prev) => ({
        ...prev,
        [`${productId}-${allocId}-${type}`]: value
      }))
    } else {
      settargetpriceorpercentageValue((prev) => ({
        ...prev,
        [`${productId}-${allocId}-${type}`]: value
      }))
    }
  }
  console.log(targetpriceorPercentageType)
  console.log(targetpriceorpercentageValue)

  const openSplitModal = (productId, month, name) => {
    const Name = name.trim()

    setrespectedmonthtargetType((prev) => {
      const updated = { ...prev }

      selectedMonths.forEach((m) => {
        const key = `${productId}-${m}`
        const keyName = `${Name}-${m}`
        if (!updated[key]) {
          updated[key] = "quantity"
        }
        if (!updated[keyName]) {
          updated[keyName] = "quantity"
        }
      })
      return updated
    })

    console.log("H")
    setSplitModalData({ productId, month, name })
    setShowSplitModal(true)
    setselectedsplitProducts(productId)
    setselectedsplitmonth(month)
  }
  // console.log({
  //   selectedsplitProducts,
  //   selectedsplitmonth,
  //   formedKey: `${selectedsplitProducts}-${selectedsplitmonth}`,
  //   respectedmonthtargetType
  // })
  console.log(respectedmonthtargetType)
  console.log(splitData)
  console.log(userList)
  console.log(splitModalData)
  console.log(targetData)
  const handleSplitChange = (userId, value) => {
    console.log(userId)
    if (message?.[userId]) {
      console.log("H")
      setMessage((prev) => ({
        ...prev,
        [userId]: ""
      }))
    }
    console.log("h")
    setTargetData((prev) => {
      const updatedData = { ...prev }

      const baseKey = `${selectedsplitProducts}-${selectedsplitmonth}`
      const baseCurrentValue = Number(prev[baseKey] || 0)
      const baseNewValue = Number(value || 0)

      // Update the currently selected month
      updatedData[baseKey] = baseCurrentValue + baseNewValue

      // Now handle rest of the months
      selectedMonths.forEach((month) => {
        const key = `${selectedsplitProducts}-${month}`

        // If this month data doesn’t exist, copy the updated value
        if (!updatedData[key]) {
          updatedData[key] = updatedData[baseKey]
        }
      })

      return updatedData
    })

    console.log(selectedsplitmonth)
    console.log(selectedsplitProducts)
    const key = `${splitModalData.productId}-${splitModalData.month}`
    const keyName = `${splitModalData.name}-${splitModalData.month}`
    console.log(keyName)
    const slabsKey = "slabs"

    setSplitData((prev) => {
      const existingArray = prev[key] || []
      console.log(existingArray)
      const existingIndex = existingArray.findIndex(
        (item) => item.userId === userId
      )
      console.log(existingIndex)
      // Get existing slabs (if any)
      const existingSlabs =
        existingIndex !== -1 ? existingArray[existingIndex][slabsKey] || [] : []
      console.log(existingSlabs)
      const updatedSlabs =
        existingSlabs.length > 0
          ? [
              {
                ...existingSlabs[0],
                from: 0,
                to: value,
                amount: existingSlabs[0]?.amount || ""
              }
            ]
          : [{ from: 0, to: value, amount: "" }]
      console.log("j")

      const newUserData = {
        userId,

        splitTarget: value,
        slabs: updatedSlabs //static name
      }
      console.log("h")
      const updatedArray =
        existingIndex !== -1
          ? existingArray.map((item, i) =>
              i === existingIndex ? newUserData : item
            )
          : [...existingArray, newUserData]
      console.log("H")

      return {
        ...prev,
        [key]: updatedArray
      }
    })
    console.log("Hhh")
    console.log(userList)
    setuserList((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              givenTarget: value,
              slabs:
                u.slabs && u.slabs.length > 0
                  ? [
                      {
                        ...u.slabs[0],
                        from: 0,
                        to: value,
                        amount: u.slabs[0]?.amount || ""
                      },
                      ...u.slabs.slice(1)
                    ]
                  : [{ from: 0, to: value, amount: "" }]
            }
          : u
      )
    )
  }
  console.log(message)
  console.log(splitData)
  console.log(userList)
  const handleCancel = () => {
    setShowSplitModal(false)
  }
  const handleAddSlab = (userId) => {
    if (userId) {
      const user = userList.find((u) => u.id === userId)
      if (user) {
        if (!user.givenTarget || user.givenTarget.trim() === "") {
          setMessage((prev) => ({
            ...prev,
            [userId]: "Please fill the target first"
          }))
          console.log("H")
          return
        }
      }
    }

    const key = `${splitModalData.productId}-${splitModalData.month}`

    setSplitData((prev) => {
      const existingMonthData = prev[key] || []

      // Check if the user already has an entry in this month
      const updatedMonthData = existingMonthData.map((item) => {
        if (item.userId === userId) {
          return {
            ...item,
            slabs: [...(item.slabs || []), { from: "", to: "", amount: "" }]
          }
        }
        return item
      })

      // If user not found, add a new entry
      const userExists = existingMonthData.some(
        (item) => item.userId === userId
      )
      if (!userExists) {
        updatedMonthData.push({
          userId,

          splitTarget: "",
          slabs: [{ from: "", to: "", amount: "" }]
        })
      }

      return {
        ...prev,
        [key]: updatedMonthData
      }
    })

    // ✅ Update userList for the matching user
    setuserList((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              slabs: [
                ...(u.slabs || []), // Keep existing slabs if any
                { from: "", to: "", amount: "" }
              ]
            }
          : u
      )
    )
  }
  console.log(userList)

  const handleRemoveSlab = (userId, slabIndex) => {
    const key = `${splitModalData.productId}-${splitModalData.month}`

    setSplitData((prev) => {
      const existingMonthData = prev[key] || []

      // Update the user's slabs in the month array
      const updatedMonthData = existingMonthData.map((item) => {
        if (item.id === userId) {
          const updatedSlabs = (item[`${userId}-slabs`] || []).filter(
            (_, index) => index !== slabIndex
          )

          return {
            ...item,
            [`${userId}-slabs`]: updatedSlabs
          }
        }
        return item
      })

      return {
        ...prev,
        [key]: updatedMonthData
      }
    })
  }

  console.log(userList)
  const handleSlabChange = (userId, slabIndex, field, value) => {
    const key = `${splitModalData.productId}-${splitModalData.month}`

    setSplitData((prev) => {
      const existingMonthData = prev[key] || []

      // Map through the month data and update the matching user
      const updatedMonthData = existingMonthData.map((item) => {
        if (item.id === userId) {
          const existingSlabs = [...(item[`${userId}-slabs`] || [])]
          const updatedSlabs = existingSlabs.map((slab, index) =>
            index === slabIndex ? { ...slab, [field]: value } : slab
          )

          return {
            ...item,
            [`${userId}-slabs`]: updatedSlabs
          }
        }
        return item
      })

      return {
        ...prev,
        [key]: updatedMonthData
      }
    })

    // ✅ Update userList slabs in parallel
    setuserList((prev) =>
      prev.map((user) => {
        if (user.id === userId) {
          // Copy slabs, initialize if undefined
          const updatedSlabs = [...(user.slabs || [])]
          updatedSlabs[slabIndex] = {
            ...updatedSlabs[slabIndex],
            [field]: value
          }
          return {
            ...user,
            slabs: updatedSlabs
          }
        }
        return user
      })
    )
  }

  const handlesaveSplit = () => {
    console.log("Before update:", splitData)

    setSplitData((prev) => {
      const updatedData = { ...prev }

      const existingKeys = Object.keys(prev)
      if (existingKeys.length === 0) return prev

      // Get the base key (first product-month, e.g., "1-October")
      const baseKey = existingKeys[0]
      const baseData = prev[baseKey]
      const productId = baseKey.split("-")[0]

      // ✅ Step 1: Update targetType for the BASE month too
      const updatedBaseData = baseData.map((item) => ({
        ...item,
        targetType:
          respectedmonthtargetType?.[
            `${selectedsplitProducts}-${selectedsplitmonth}`
          ]
      }))
      updatedData[baseKey] = updatedBaseData

      // ✅ Step 2: Copy same structure to all selected months if missing
      selectedMonths.forEach((month) => {
        const newKey = `${productId}-${month}`

        if (!updatedData[newKey]) {
          const clonedData = JSON.parse(JSON.stringify(updatedBaseData))
          updatedData[newKey] = clonedData
        }
      })

      console.log("After update:", updatedData)
      return updatedData
    })

    setShowSplitModal(false)
  }

  console.log(splitData)

  console.log(splitData)
  console.log(userList)
  const handleSubmit = async () => {
    // setsubmitdata({
    // })
    //insplitdata its in the form of {'45454dfa51fasd151sdf-october':}
    const formData = {
      targetData,
      targetpriceorPercentageType,
      targetpriceorpercentageValue,
      splitData
    }
    const res = api.post("/target/submitTargetRegister", formData)
    console.log(userList)
    console.log(targetpriceorPercentageType)
    console.log(targetpriceorpercentageValue)
    console.log("Target Data:", targetData)
    console.log("Split Data:", splitData)
    // alert("Target data submitted! Check console for details.")
  }
  console.log(splitData)
  console.log(targetpriceorPercentageType)
  console.log(targetData)
  return (
    <div className="h-full bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="bg-white flex flex-col lg:flex-row lg:items-center lg:justify-between rounded-xl shadow-sm p-4 sm:p-6 mb-2 gap-4">
          {/* Title */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
            Target Master
          </h1>

          {/* Period Selection */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 lg:gap-4">
            {selectedMonths.length > 0 && (
              <>
                <span>Period:</span>
                <span className="text-sm font-medium text-blue-800 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-center sm:text-left">
                  {fromMonth} to {toMonth}
                </span>
              </>
            )}

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-sm font-semibold text-gray-700">From</span>

              {/* From Month */}
              <div className="relative">
                <select
                  value={fromMonth}
                  onChange={(e) => setFromMonth(e.target.value)}
                  className="px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm w-28 sm:w-auto cursor-pointer"
                >
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>

              <span className="text-gray-500 text-sm">To</span>

              {/* To Month */}
              <div className="relative">
                <select
                  value={toMonth}
                  onChange={(e) => setToMonth(e.target.value)}
                  className="px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm w-28 sm:w-auto cursor-pointer"
                >
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mb-2">
          <button
            onClick={() => setShowProductModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-md text-sm font-medium"
          >
            <Settings className="w-4 h-4" />
            Select Products ({productandservices.length})
          </button>
          <button
            onClick={() => setShowAllocationModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Select Allocations ({selectedAllocations.length})
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[1200px]">
              <thead>
                {/* Main Headers */}
                <tr className="bg-gradient-to-r from-blue-600 to-blue-700">
                  <th className="px-4 py-3 text-left text-white font-semibold border-r border-blue-500 whitespace-nowrap">
                    Products & Services
                  </th>
                  <th
                    colSpan={selectedMonths.length}
                    className="px-4 py-3 text-center text-white font-semibold border-r border-blue-500 whitespace-nowrap"
                  >
                    Target
                  </th>
                  <th
                    colSpan={selectedAllocations.length}
                    className="px-4 py-3 text-center text-white font-semibold whitespace-nowrap"
                  >
                    Incentive
                  </th>
                </tr>
                {/* Sub Headers */}
                <tr className="bg-blue-50">
                  <th className="px-4 py-2 text-left text-gray-700 font-medium border-r border-gray-200 text-sm"></th>
                  {selectedMonths.map((month) => (
                    <th
                      key={month}
                      className="px-4 py-2 text-center text-gray-700 font-medium border-r border-gray-200 text-sm whitespace-nowrap"
                    >
                      {month}
                    </th>
                  ))}
                  {selectedAllocations.map((alloc) => (
                    <th
                      key={alloc.id}
                      className="px-4 py-2 text-center text-gray-700 font-medium border-r border-gray-200 text-sm whitespace-nowrap"
                    >
                      {alloc.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((product, idx) => (
                  <tr
                    key={product.id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-3 font-medium text-gray-800 border-r border-gray-200 text-sm">
                      {product.name}
                    </td>
                    {/* Target Months */}
                    {selectedMonths.map((month) => (
                      <td
                        key={month}
                        className="px-2 py-2 border-r border-gray-200"
                      >
                        <div className="relative flex items-center gap-1">
                          <input
                            type="text"
                            disabled
                            value={targetData[`${product.id}-${month}`] || ""}
                            onChange={(e) =>
                              handleTargetInput(
                                product.id,
                                month,
                                e.target.value
                              )
                            }
                            className="w-fit px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="0"
                          />
                          <button
                            onClick={() =>
                              openSplitModal(product.id, month, product.name)
                            }
                            className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex-shrink-0"
                            title="Split Target"
                          >
                            <Users className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    ))}
                    {/* Incentive Allocations */}
                    {selectedAllocations.map((alloc) => (
                      <td
                        key={alloc.id}
                        className="px-2 py-2 border-r border-gray-200"
                      >
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={
                              targetpriceorpercentageValue[
                                `${product.id}-${alloc.id}-value`
                              ] || ""
                            }
                            onChange={(e) =>
                              handleIncentiveInput(
                                product.id,
                                alloc.id,
                                e.target.value,
                                "value"
                              )
                            }
                            className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                            placeholder="0"
                          />
                          <div className="relative flex-shrink-0">
                            <select
                              value={
                                targetpriceorPercentageType[
                                  `${product.id}-${alloc.id}-type`
                                ]
                              }
                              onChange={(e) =>
                                handleIncentiveInput(
                                  product.id,
                                  alloc.id,
                                  e.target.value,
                                  "type"
                                )
                              }
                              className="px-2 py-1.5 pr-7 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white text-sm"
                            >
                              <option value="amount">₹</option>
                              <option value="percentage">%</option>
                            </select>
                            <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Submit Button */}
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-md"
            >
              Submit Target
            </button>
          </div>
        </div>
      </div>

      {/* Product Selection Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h3 className="text-lg font-semibold text-white">
                Select Products & Services
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-2 max-h-96 overflow-y-auto">
              {productandservices.map((product) => (
                <label
                  key={product.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedProducts.some((p) => p.id === product.id)}
                    onChange={() => handleProductSelection(product)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="text-gray-800 font-medium">
                    {product.name}
                  </span>
                </label>
              ))}
            </div>
            <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end">
              <button
                onClick={() => setShowProductModal(false)}
                className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Allocation Selection Modal */}
      {showAllocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h3 className="text-lg font-semibold text-white">
                Select Allocation Types
              </h3>
              <button
                onClick={() => setShowAllocationModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-2 max-h-96 overflow-y-auto">
              {availableAllocations.map((allocation) => (
                <label
                  key={allocation.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedAllocations.some(
                      (a) => a.id === allocation.id
                    )}
                    onChange={() => handleAllocationSelection(allocation)}
                    className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <span className="text-gray-800 font-medium">
                    {allocation.name}
                  </span>
                </label>
              ))}
            </div>
            <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end">
              <button
                onClick={() => setShowAllocationModal(false)}
                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Split Target Modal */}
      {showSplitModal && splitModalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full  flex flex-col overflow-hidden h-full">
            {/* Modal Header */}
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
                  - {splitModalData.month}
                </p>
              </div>
              <button
                onClick={() => setShowSplitModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Container */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Sticky Top Section (Split Type + Inputs) */}
              <div className="bg-white sticky top-0 z-10 px-6 mt-2 border-b border-gray-200 flex">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Split Type
                  </label>
                  <div className="relative">
                    <select
                      value={
                        respectedmonthtargetType?.[
                          `${selectedsplitProducts}-${selectedsplitmonth}`
                        ]
                      }
                      onChange={(e) =>
                        setrespectedmonthtargetType((prev) => ({
                          ...prev,
                          [`${selectedsplitProducts}-${selectedsplitmonth}`]:
                            e.target.value
                        }))
                      }
                      className="w-28 px-2 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    >
                      <option value="quantity">Quantity</option>
                      <option value="amount">Amount</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
                {/* Total Target */}
                <div className="flex flex-1 justify-end items-center pr-10">
                  <p className="text-lg text-gray-700">
                    <span className="font-semibold">Total Target:</span>{" "}
                    {targetData[
                      `${splitModalData.productId}-${splitModalData.month}`
                    ] || 0}
                  </p>
                </div>
              </div>
              <label className="block text-sm font-medium text-gray-700 bg-white  ml-5 m-3">
                Assign to Users
              </label>

              {/* Scrollable User List Section */}
              <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4">
                {userList.map((user) => {
                  const key = `${splitModalData.productId}-${splitModalData.month}`
                  const userArray = splitData[key] || []
                  console.log(userArray)
                  console.log(user)
                  const currentUserData = userArray.find(
                    (item) => item.userId === user.id
                  )
                  console.log(currentUserData)
                  const userValue = currentUserData
                    ? currentUserData?.splitTarget || ""
                    : ""
                  console.log(userValue)
                  console.log(currentUserData)
                  const userSlabs = currentUserData?.slabs || []
                  console.log(userSlabs)
                  console.log(splitData[key])

                  return (
                    <div
                      key={user.id}
                      className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                    >
                      {/* User Row */}

                      <div className="flex items-start gap-3 mb-3">
                        <span className="text-sm font-medium text-gray-700 min-w-[100px]">
                          {user.name}
                        </span>

                        {/* Wrap input + message in a vertical column */}
                        <div className="flex flex-col">
                          <input
                            type="number"
                            value={userValue || ""}
                            onChange={(e) =>
                              handleSplitChange(user.id, e.target.value)
                            }
                            className="w-32 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                          />
                          {message?.[user?.id] && (
                            <p className="text-red-400 text-sm mt-1">
                              {message[user.id]}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => handleAddSlab(user.id, user)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                          Add Slab
                        </button>
                      </div>

                      {/* Slabs Grid */}
                      {userSlabs.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-3">
                          {userSlabs.map((slab, index) => (
                            <div
                              key={index}
                              className="relative bg-white border border-gray-300 rounded-lg shadow-sm overflow-visible flex-shrink-0 max-w-full"
                            >
                              {/* Close Button */}
                              <button
                                onClick={() => handleRemoveSlab(user.id, index)}
                                className="absolute -top-2 -right-2 z-10 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
                                title="Remove slab"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>

                              {/* Slab Table */}
                              <table className="text-sm border-collapse">
                                <thead>
                                  <tr>
                                    <th className="px-1.5 py-1 text-center text-xs font-semibold bg-red-100 text-red-800 border-b w-20">
                                      From
                                    </th>
                                    <th className="px-1.5 py-1 text-center text-xs font-semibold bg-green-100 text-green-800 border-b w-20">
                                      To
                                    </th>
                                    <th className="px-1.5 py-1 text-center text-xs font-semibold bg-blue-100 text-blue-800 border-b w-20">
                                      Amount
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td className="px-1.5 py-1.5">
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
                                    <td className="px-1.5 py-1.5">
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
                                    <td className="px-1.5 py-1.5">
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
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-100 rounded-b-xl flex justify-end gap-3 flex-shrink-0">
              <button
                onClick={() => handleCancel()}
                className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handlesaveSplit()}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Save Split
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TargetRegister
