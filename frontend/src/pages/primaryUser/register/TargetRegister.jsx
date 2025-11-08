import { useState, useEffect } from "react"
import { Plus, Settings, Users, X, ChevronDown } from "lucide-react"
import UseFetch from "../../../hooks/useFetch"
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
  const [selectedProducts, setSelectedProducts] = useState([
    availableProducts[0]
  ])
  const [selectedAllocations, setSelectedAllocations] = useState([
    availableAllocations[0]
  ])
  const [showProductModal, setShowProductModal] = useState(false)
  const [showAllocationModal, setShowAllocationModal] = useState(false)
  const [showSplitModal, setShowSplitModal] = useState(false)
  const [splitModalData, setSplitModalData] = useState(null)
  const [targetData, setTargetData] = useState({})
  const [splitData, setSplitData] = useState({})
  const [userList, setuserList] = useState([])
  const { data } = UseFetch("/auth/getallusers")
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
          name: user.name
        }
      })
console.log(users)

      console.log(allusers)
      console.log(allAdmins)
      console.log("h")
    }
  }, [data])
  const getMonthsInRange = () => {
    const fromIndex = months.indexOf(fromMonth)
    const toIndex = months.indexOf(toMonth)
    if (fromIndex === -1 || toIndex === -1 || fromIndex > toIndex) return []
    return months.slice(fromIndex, toIndex + 1)
  }

  const selectedMonths = getMonthsInRange()

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
    setTargetData((prev) => ({
      ...prev,
      [`${productId}-${allocId}-${type}`]: value
    }))
  }

  const openSplitModal = (productId, month) => {
    setSplitModalData({ productId, month })
    setShowSplitModal(true)
  }

  const handleSplitChange = (userId, value) => {
    const key = `${splitModalData.productId}-${splitModalData.month}`
    setSplitData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [userId]: value
      }
    }))
  }

  const handleAddSlab = (userId) => {
    const key = `${splitModalData.productId}-${splitModalData.month}`
    setSplitData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [`${userId}-slabs`]: [
          ...(prev[key]?.[`${userId}-slabs`] || []),
          { from: "", to: "", amount: "" }
        ]
      }
    }))
  }

  const handleRemoveSlab = (userId, slabIndex) => {
    const key = `${splitModalData.productId}-${splitModalData.month}`
    setSplitData((prev) => {
      const slabs = prev[key]?.[`${userId}-slabs`] || []
      return {
        ...prev,
        [key]: {
          ...prev[key],
          [`${userId}-slabs`]: slabs.filter((_, index) => index !== slabIndex)
        }
      }
    })
  }

  const handleSlabChange = (userId, slabIndex, field, value) => {
    const key = `${splitModalData.productId}-${splitModalData.month}`
    setSplitData((prev) => {
      const slabs = [...(prev[key]?.[`${userId}-slabs`] || [])]
      slabs[slabIndex] = { ...slabs[slabIndex], [field]: value }
      return {
        ...prev,
        [key]: {
          ...prev[key],
          [`${userId}-slabs`]: slabs
        }
      }
    })
  }

  const handleSubmit = () => {
    console.log("Target Data:", targetData)
    console.log("Split Data:", splitData)
    alert("Target data submitted! Check console for details.")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
            Target Master
          </h1>

          {/* Period Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-gray-700">
                Period:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <select
                    value={fromMonth}
                    onChange={(e) => setFromMonth(e.target.value)}
                    className="px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-sm"
                  >
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
                <span className="text-gray-500 text-sm">to</span>
                <div className="relative">
                  <select
                    value={toMonth}
                    onChange={(e) => setToMonth(e.target.value)}
                    className="px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-sm"
                  >
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {selectedMonths.length > 0 && (
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                <span className="text-sm font-medium text-blue-800">
                  {fromMonth} to {toMonth}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Selection Icons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setShowProductModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-md text-sm font-medium"
          >
            <Settings className="w-4 h-4" />
            Select Products ({selectedProducts.length})
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
                            type="number"
                            value={targetData[`${product.id}-${month}`] || ""}
                            onChange={(e) =>
                              handleTargetInput(
                                product.id,
                                month,
                                e.target.value
                              )
                            }
                            className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="0"
                          />
                          <button
                            onClick={() => openSplitModal(product.id, month)}
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
                              targetData[`${product.id}-${alloc.id}-value`] ||
                              ""
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
                                targetData[`${product.id}-${alloc.id}-type`] ||
                                "amt"
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
                              <option value="amt">₹</option>
                              <option value="percent">%</option>
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
              {availableProducts.map((product) => (
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-2 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full  flex flex-col overflow-hidden max-h-full">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between rounded-t-xl flex-shrink-0">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Split Target
                </h3>
                <p className="text-sm text-blue-100">
                  {
                    selectedProducts.find(
                      (p) => p.id === splitModalData.productId
                    )?.name
                  }{" "}
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
                    <select className="w-28 px-2 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white">
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
              <label className="block text-sm font-medium text-gray-700 bg-white ml-5 mt-3">
                Assign to Users
              </label>

              {/* Scrollable User List Section */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {availableUsers.map((user) => {
                  const key = `${splitModalData.productId}-${splitModalData.month}`
                  const userSlabs = splitData[key]?.[`${user.id}-slabs`] || []

                  return (
                    <div
                      key={user.id}
                      className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                    >
                      {/* User Row */}
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-sm font-medium text-gray-700 min-w-[100px]">
                          {user.name}
                        </span>
                        <input
                          type="number"
                          value={splitData[key]?.[user.id] || ""}
                          onChange={(e) =>
                            handleSplitChange(user.id, e.target.value)
                          }
                          className="w-32 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0"
                        />
                        <button
                          onClick={() => handleAddSlab(user.id)}
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
                onClick={() => setShowSplitModal(false)}
                className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowSplitModal(false)}
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
