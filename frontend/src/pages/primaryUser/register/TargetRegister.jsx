import React, { useState } from "react"
import { Plus, Settings, Users, X, ChevronDown } from "lucide-react"

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
  { id: 1, name: "Riyas", slabslice: 1 },
  { id: 2, name: "Ahmed", slabslice: 2 },
  { id: 3, name: "Sarah", slabslice: 3 },
  { id: 4, name: "John", slabslice: 4 }
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
  const [selectedTargetvalue, settargetValue] = useState(null)
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

  const handleSubmit = () => {
    console.log("Target Data:", targetData)
    console.log("Split Data:", splitData)
    alert("Target data submitted! Check console for details.")
  }

  return (
    <div className="max-h-full min-h-full bg-gray-50 p-4 sm:p-6">
      <div className=" mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-2 sm:p-3 mb-3 flex justify-between">
          <h1 className="text-2xl sm:text-2xl font-bold text-gray-800 mb-6">
            Target Master
          </h1>

          {/* Period Selection */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              {selectedMonths.length > 0 && (
                <div className="inline-flex items-center gap-2 px-4 py-2">
                  <span>Period</span>
                  <span className="text-sm font-medium text-blue-800  bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                    {fromMonth} to {toMonth}
                  </span>
                </div>
              )}
              <span className="text-sm font-semibold text-gray-700">
                From Date:
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
                <span className="text-gray-500 text-sm">To Date</span>
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
          </div>
        </div>

        {/* Selection Icons */}
        <div className="flex gap-3 mb-3">
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
                    className="bg-white"
                    // className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
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
                          <div className="relative flex-shrink-0">
                            <select
                              value={selectedTargetvalue}
                              disabled
                              // onChange={(e) =>
                              //   handleIncentiveInput(
                              //     product.id,
                              //     alloc.id,
                              //     e.target.value,
                              //     "type"
                              //   )
                              // }
                              className="px-2 py-1.5 pr-7 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white text-sm"
                            >
                              {/* <option value="">select</option> */}
                              <option value="amount">₹</option>
                              <option value="quantity">#</option>
                            </select>
                            <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
                          </div>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full ">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between rounded-t-xl">
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
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Split Type
                </label>
                <div className="relative">
                  <select
                    value={selectedTargetvalue}
                    onChange={(e) => settargetValue(e.target.value)}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                  >
                    <option value="quantity">Quantity</option>
                    <option value="amount">Amount</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Assign to Users
                </label>

                {availableUsers.map((user) => {
                  const key = `${splitModalData.productId}-${splitModalData.month}`
                  return (
                    <div key={user.id} className="mb-4">
                      {/* Name and main input */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700 w-24">
                          {user.name}
                        </span>

                        <input
                          type="number"
                          onChange={(e) =>
                            handleSplitChange(user.id, e.target.value)
                          }
                          className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0"
                        />
                        <span className="bg-blue-600 text-white py-1 px-2 rounded-lg">
                          Add slab
                        </span>
                        {Array.from({ length: user.slabslice }, (_, index) => (
                          <div
                            key={index}
                            className="mt-2 ml-2 border border-gray-200 rounded-lg overflow-hidden w-fit flex"
                          >
                            <table className="text-sm text-gray-700">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="px-3 py-1 font-semibold">
                                    From
                                  </th>
                                  <th className="px-3 py-1 font-semibold">
                                    To
                                  </th>
                                  <th className="px-3 py-1 font-semibold">
                                    Amount
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="px-3 py-1">
                                    <input
                                      type="text"
                                      className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                  </td>
                                  <td className="px-3 py-1">
                                    <input
                                      type="text"
                                      className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                  </td>
                                  <td className="px-3 py-1">
                                    <input
                                      type="number"
                                      className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        ))}
                      </div>

                      {/* <div className="mt-2 ml-24 border border-gray-200 rounded-lg overflow-hidden w-fit">
                        <table className="text-sm text-gray-700">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-3 py-1 font-semibold">From</th>
                              <th className="px-3 py-1 font-semibold">To</th>
                              <th className="px-3 py-1 font-semibold">
                                Amount
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="px-3 py-1">
                                <input
                                  type="text"
                                  // placeholder="From"
                                  className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              </td>
                              <td className="px-3 py-1">
                                <input
                                  type="text"
                                  // placeholder="To"
                                  className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              </td>
                              <td className="px-3 py-1">
                                <input
                                  type="number"
                                  // placeholder="Amount"
                                  className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div> */}
                    </div>
                  )
                })}

                {/* {availableUsers.map((user) => {
                  const key = `${splitModalData.productId}-${splitModalData.month}`
                  return (
                    <div key={user.id} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700 w-24">
                        {user.name}
                      </span>
                      <input
                        type="number"
                        value={splitData[key]?.[user.id] || ""}
                        onChange={(e) =>
                          handleSplitChange(user.id, e.target.value)
                        }
                        className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                      <div>
                        <input className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></input>
                        <input className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></input>
                        <input className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></input>
                      </div>
                    </div>
                  )
                })} */}
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Total Target:</span>{" "}
                  {targetData[
                    `${splitModalData.productId}-${splitModalData.month}`
                  ] || 0}
                </p>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end gap-3">
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
