// import { useState, useEffect } from "react"
// import { Plus, Settings, Users, X, ChevronDown } from "lucide-react"
// import { useSelector } from "react-redux"
// import UseFetch from "../../../hooks/useFetch"
// import api from "../../../api/api"
// import { split } from "lodash"
// import { getLocalStorageItem } from "../../../helper/localstorage"

// // Sample data
// const availableProducts = [
//   { id: 1, name: "Tally Prime" },
//   { id: 2, name: "Tally ERP 9" },
//   { id: 3, name: "Tally Server" },
//   { id: 4, name: "Tally Cloud" }
// ]

// const availableAllocations = [
//   { id: 1, name: "Follow Up" },
//   { id: 2, name: "Demo" },
//   { id: 3, name: "Onsite" },
//   { id: 4, name: "Closing" }
// ]

// const months = [
//   "January",
//   "February",
//   "March",
//   "April",
//   "May",
//   "June",
//   "July",
//   "August",
//   "September",
//   "October",
//   "November",
//   "December"
// ]

// export const TargetRegister = () => {
//   const [fromMonth, setFromMonth] = useState("October")
//   const [toMonth, setToMonth] = useState("December")
//   const [userbranches, setuserBranches] = useState([])
//   const [selectedBranch, setselectedBranch] = useState(null)
//   const [selectedProducts, setSelectedProducts] = useState([])
//   const [productandservices, setproductsandservices] = useState([])
//   const [submitdata, setsubmitdata] = useState({})
//   const [respectedmonthtargetType, setrespectedmonthtargetType] = useState({})
//   const [selectedsplitProducts, setselectedsplitProducts] = useState(null)
//   const [selectedsplitmonth, setselectedsplitmonth] = useState(null)
//   const [message, setMessage] = useState(null)
//   const [selectedAllocations, setSelectedAllocations] = useState([
//     availableAllocations[0]
//   ])
//   const [showProductModal, setShowProductModal] = useState(false)
//   const [showAllocationModal, setShowAllocationModal] = useState(false)
//   const [showSplitModal, setShowSplitModal] = useState(false)
//   const [splitModalData, setSplitModalData] = useState(null)
//   const [targetData, setTargetData] = useState({})
//   const [targetpriceorPercentageType, settargetpriceorPercentageType] =
//     useState({})
//   const [targetpriceorpercentageValue, settargetpriceorpercentageValue] =
//     useState({})
//   const [splitData, setSplitData] = useState([])
//   const [userList, setuserList] = useState([])
//   const { data } = UseFetch("/auth/getallusers")
//   const loggeduserBranch = useSelector(
//     (state) => state.companyBranch.loggeduserbranches
//   )
//   const companybranches = useSelector((state) => state.companyBranch.branches)
//   const query = new URLSearchParams({
//     branchselectedArray: JSON.stringify(loggeduserBranch)
//   }).toString()

//   const { data: productslist } = UseFetch(`/product/getallproducts?${query}`)
//   const { data: servicelist } = UseFetch(`/product/getallServices?${query}`)
//   useEffect(() => {
//     const userData = getLocalStorageItem("user")
//     console.log(userData)
//     setselectedBranch(userData.selected[0]?.branch_id)
//     userData.selected.forEach((branch) => {
//       setuserBranches((prev) => [
//         ...prev,
//         {
//           id: branch.branch_id,
//           branchName: branch.branchName
//         }
//       ])
//     })
//   }, [])
//   useEffect(() => {
//     if (productslist && productslist.length) {
//       if (servicelist && servicelist.length) {
//         const a = [...productslist, ...servicelist]
//         console.log(a)
//         const b = a.map((item) => {
//           return {
//             id: item?._id,
//             name: item?.productName || item?.serviceName
//           }
//         })
//         setproductsandservices(b)
//         console.log(b)
//         // console.log(productslist)
//         // console.log(servicelist)
//       } else {
//       }
//     } else if (servicelist && servicelist.length) {
//       if (productslist && productslist.length) {
//       }
//     }
//     console.log("H")
//   }, [productslist, servicelist])
//   console.log(productandservices)
//   console.log(data)
//   useEffect(() => {
//     if (data) {
//       const { allusers = [], allAdmins = [] } = data
//       // Combine allusers and allAdmins
//       const combinedUsers = [...allusers, ...allAdmins]
//       console.log(combinedUsers)
//       const users = combinedUsers.map((user) => {
//         return {
//           id: user._id,
//           name: user.name,
//           givenTarget: "",
//           achievedTarget: ""
//         }
//       })
//       setuserList(users)
//     }
//   }, [data])
//   useEffect(() => {
//     if (
//       selectedAllocations &&
//       selectedAllocations.length &&
//       productandservices &&
//       productandservices.length
//     ) {
//       console.log(productandservices)
//       console.log(selectedAllocations)
//       const updatedEntries = {}

//       productandservices.forEach((productId) => {
//         selectedAllocations.forEach((allocationType) => {
//           updatedEntries[`${productId.id}-${allocationType.id}-type`] = "amount"
//         })
//       })

//       settargetpriceorPercentageType((prev) => ({
//         ...prev,
//         ...updatedEntries
//       }))
//     }
//   }, [selectedAllocations, productandservices])
//   console.log(targetpriceorPercentageType)
//   console.log(splitData)
//   const getMonthsInRange = () => {
//     const fromIndex = months.indexOf(fromMonth)
//     const toIndex = months.indexOf(toMonth)
//     if (fromIndex === -1 || toIndex === -1 || fromIndex > toIndex) return []
//     return months.slice(fromIndex, toIndex + 1)
//   }

//   const selectedMonths = getMonthsInRange()
//   console.log(selectedMonths)

//   const handleProductSelection = (product) => {
//     setSelectedProducts((prev) => {
//       const exists = prev.find((p) => p.id === product.id)
//       if (exists) {
//         return prev.filter((p) => p.id !== product.id)
//       }
//       return [...prev, product]
//     })
//   }

//   const handleAllocationSelection = (allocation) => {
//     setSelectedAllocations((prev) => {
//       const exists = prev.find((a) => a.id === allocation.id)
//       if (exists) {
//         return prev.filter((a) => a.id !== allocation.id)
//       }
//       return [...prev, allocation]
//     })
//   }

//   const handleTargetInput = (productId, month, value) => {
//     setTargetData((prev) => ({
//       ...prev,
//       [`${productId}-${month}`]: value
//     }))
//   }

//   const handleIncentiveInput = (productId, allocId, value, type) => {
//     console.log(type)
//     if (type === "type") {
//       settargetpriceorPercentageType((prev) => ({
//         ...prev,
//         [`${productId}-${allocId}-${type}`]: value
//       }))
//     } else {
//       settargetpriceorpercentageValue((prev) => ({
//         ...prev,
//         [`${productId}-${allocId}-${type}`]: value
//       }))
//     }
//   }
//   console.log(targetpriceorPercentageType)
//   console.log(targetpriceorpercentageValue)

//   const openSplitModal = (productId, month, name) => {
//     const Name = name.trim()

//     setrespectedmonthtargetType((prev) => {
//       const updated = { ...prev }

//       selectedMonths.forEach((m) => {
//         const key = `${productId}-${m}`
//         const keyName = `${Name}-${m}`
//         if (!updated[key]) {
//           updated[key] = "quantity"
//         }
//         if (!updated[keyName]) {
//           updated[keyName] = "quantity"
//         }
//       })
//       return updated
//     })

//     console.log("H")
//     setSplitModalData({ productId, month, name })
//     setShowSplitModal(true)
//     setselectedsplitProducts(productId)
//     setselectedsplitmonth(month)
//   }
//   // console.log({
//   //   selectedsplitProducts,
//   //   selectedsplitmonth,
//   //   formedKey: `${selectedsplitProducts}-${selectedsplitmonth}`,
//   //   respectedmonthtargetType
//   // })
//   console.log(respectedmonthtargetType)
//   console.log(splitData)
//   console.log(userList)
//   console.log(splitModalData)
//   console.log(targetData)
//   const handleSplitChange = (userId, value) => {
//     console.log(userId)
//     if (message?.[userId]) {
//       console.log("H")
//       setMessage((prev) => ({
//         ...prev,
//         [userId]: ""
//       }))
//     }
//     console.log("h")
//     setTargetData((prev) => {
//       const updatedData = { ...prev }

//       const baseKey = `${selectedsplitProducts}-${selectedsplitmonth}`
//       const baseCurrentValue = Number(prev[baseKey] || 0)
//       const baseNewValue = Number(value || 0)

//       // Update the currently selected month
//       updatedData[baseKey] = baseCurrentValue + baseNewValue

//       // Now handle rest of the months
//       selectedMonths.forEach((month) => {
//         const key = `${selectedsplitProducts}-${month}`

//         // If this month data doesn’t exist, copy the updated value
//         if (!updatedData[key]) {
//           updatedData[key] = updatedData[baseKey]
//         }
//       })

//       return updatedData
//     })

//     console.log(selectedsplitmonth)
//     console.log(selectedsplitProducts)
//     const key = `${splitModalData.productId}-${splitModalData.month}`
//     const keyName = `${splitModalData.name}-${splitModalData.month}`
//     console.log(keyName)
//     const slabsKey = "slabs"

//     setSplitData((prev) => {
//       const existingArray = prev[key] || []
//       console.log(existingArray)
//       const existingIndex = existingArray.findIndex(
//         (item) => item.userId === userId
//       )
//       console.log(existingIndex)
//       // Get existing slabs (if any)
//       const existingSlabs =
//         existingIndex !== -1 ? existingArray[existingIndex][slabsKey] || [] : []
//       console.log(existingSlabs)
//       const updatedSlabs =
//         existingSlabs.length > 0
//           ? [
//               {
//                 ...existingSlabs[0],
//                 from: 0,
//                 to: value,
//                 amount: existingSlabs[0]?.amount || ""
//               }
//             ]
//           : [{ from: 0, to: value, amount: "" }]
//       console.log("j")

//       const newUserData = {
//         userId,

//         splitTarget: value,
//         slabs: updatedSlabs //static name
//       }
//       console.log("h")
//       const updatedArray =
//         existingIndex !== -1
//           ? existingArray.map((item, i) =>
//               i === existingIndex ? newUserData : item
//             )
//           : [...existingArray, newUserData]
//       console.log("H")

//       return {
//         ...prev,
//         [key]: updatedArray
//       }
//     })
//     console.log("Hhh")
//     console.log(userList)
//     setuserList((prev) =>
//       prev.map((u) =>
//         u.id === userId
//           ? {
//               ...u,
//               givenTarget: value,
//               slabs:
//                 u.slabs && u.slabs.length > 0
//                   ? [
//                       {
//                         ...u.slabs[0],
//                         from: 0,
//                         to: value,
//                         amount: u.slabs[0]?.amount || ""
//                       },
//                       ...u.slabs.slice(1)
//                     ]
//                   : [{ from: 0, to: value, amount: "" }]
//             }
//           : u
//       )
//     )
//   }
//   console.log(message)
//   console.log(splitData)
//   console.log(userList)
//   const handleCancel = () => {
//     setShowSplitModal(false)
//   }
//   const handleAddSlab = (userId) => {
//     if (userId) {
//       const user = userList.find((u) => u.id === userId)
//       if (user) {
//         if (!user.givenTarget || user.givenTarget.trim() === "") {
//           setMessage((prev) => ({
//             ...prev,
//             [userId]: "Please fill the target first"
//           }))
//           console.log("H")
//           return
//         }
//       }
//     }

//     const key = `${splitModalData.productId}-${splitModalData.month}`

//     setSplitData((prev) => {
//       const existingMonthData = prev[key] || []

//       // Check if the user already has an entry in this month
//       const updatedMonthData = existingMonthData.map((item) => {
//         if (item.userId === userId) {
//           return {
//             ...item,
//             slabs: [...(item.slabs || []), { from: "", to: "", amount: "" }]
//           }
//         }
//         return item
//       })

//       // If user not found, add a new entry
//       const userExists = existingMonthData.some(
//         (item) => item.userId === userId
//       )
//       if (!userExists) {
//         updatedMonthData.push({
//           userId,

//           splitTarget: "",
//           slabs: [{ from: "", to: "", amount: "" }]
//         })
//       }

//       return {
//         ...prev,
//         [key]: updatedMonthData
//       }
//     })

//     // ✅ Update userList for the matching user
//     setuserList((prev) =>
//       prev.map((u) =>
//         u.id === userId
//           ? {
//               ...u,
//               slabs: [
//                 ...(u.slabs || []), // Keep existing slabs if any
//                 { from: "", to: "", amount: "" }
//               ]
//             }
//           : u
//       )
//     )
//   }
//   console.log(userList)

//   const handleRemoveSlab = (userId, slabIndex) => {
//     const key = `${splitModalData.productId}-${splitModalData.month}`

//     setSplitData((prev) => {
//       const existingMonthData = prev[key] || []

//       // Update the user's slabs in the month array
//       const updatedMonthData = existingMonthData.map((item) => {
//         if (item.id === userId) {
//           const updatedSlabs = (item[`${userId}-slabs`] || []).filter(
//             (_, index) => index !== slabIndex
//           )

//           return {
//             ...item,
//             [`${userId}-slabs`]: updatedSlabs
//           }
//         }
//         return item
//       })

//       return {
//         ...prev,
//         [key]: updatedMonthData
//       }
//     })
//   }

//   console.log(userList)
//   const handleSlabChange = (userId, slabIndex, field, value) => {
//     const key = `${splitModalData.productId}-${splitModalData.month}`

//     setSplitData((prev) => {
//       const existingMonthData = prev[key] || []

//       // Map through the month data and update the matching user
//       const updatedMonthData = existingMonthData.map((item) => {
//         if (item.id === userId) {
//           const existingSlabs = [...(item[`${userId}-slabs`] || [])]
//           const updatedSlabs = existingSlabs.map((slab, index) =>
//             index === slabIndex ? { ...slab, [field]: value } : slab
//           )

//           return {
//             ...item,
//             [`${userId}-slabs`]: updatedSlabs
//           }
//         }
//         return item
//       })

//       return {
//         ...prev,
//         [key]: updatedMonthData
//       }
//     })

//     // ✅ Update userList slabs in parallel
//     setuserList((prev) =>
//       prev.map((user) => {
//         if (user.id === userId) {
//           // Copy slabs, initialize if undefined
//           const updatedSlabs = [...(user.slabs || [])]
//           updatedSlabs[slabIndex] = {
//             ...updatedSlabs[slabIndex],
//             [field]: value
//           }
//           return {
//             ...user,
//             slabs: updatedSlabs
//           }
//         }
//         return user
//       })
//     )
//   }

//   const handlesaveSplit = () => {
//     console.log("Before update:", splitData)

//     setSplitData((prev) => {
//       const updatedData = { ...prev }

//       const existingKeys = Object.keys(prev)
//       if (existingKeys.length === 0) return prev

//       // Get the base key (first product-month, e.g., "1-October")
//       const baseKey = existingKeys[0]
//       const baseData = prev[baseKey]
//       const productId = baseKey.split("-")[0]

//       // ✅ Step 1: Update targetType for the BASE month too
//       const updatedBaseData = baseData.map((item) => ({
//         ...item,
//         targetType:
//           respectedmonthtargetType?.[
//             `${selectedsplitProducts}-${selectedsplitmonth}`
//           ]
//       }))
//       updatedData[baseKey] = updatedBaseData

//       // ✅ Step 2: Copy same structure to all selected months if missing
//       selectedMonths.forEach((month) => {
//         const newKey = `${productId}-${month}`

//         if (!updatedData[newKey]) {
//           const clonedData = JSON.parse(JSON.stringify(updatedBaseData))
//           updatedData[newKey] = clonedData
//         }
//       })

//       console.log("After update:", updatedData)
//       return updatedData
//     })

//     setShowSplitModal(false)
//   }

//   console.log(splitData)

//   console.log(splitData)
//   console.log(userList)
//   const handleSubmit = async () => {
//     // setsubmitdata({
//     // })
//     //insplitdata its in the form of {'45454dfa51fasd151sdf-october':}
//     const formData = {
//       targetData,
//       targetpriceorPercentageType,
//       targetpriceorpercentageValue,
//       splitData
//     }
//     const res = api.post("/target/submitTargetRegister", formData)
//     console.log(userList)
//     console.log(targetpriceorPercentageType)
//     console.log(targetpriceorpercentageValue)
//     console.log("Target Data:", targetData)
//     console.log("Split Data:", splitData)
//     // alert("Target data submitted! Check console for details.")
//   }
//   console.log(splitData)
//   console.log(targetpriceorPercentageType)
//   console.log(targetData)
//   return (

//     <div className="h-full bg-[#ADD8E6] px-3 py-4 sm:px-5 sm:py-5">
//       <div className="mx-auto max-w-6xl space-y-3">
//         {/* HEADER */}
//         <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white border border-slate-200 rounded-lg px-3 py-3">
//           {/* left: title + period */}
//           <div className="space-y-1">
//             <h1 className="text-lg sm:text-xl font-semibold text-slate-900">
//               Target Master
//             </h1>
//             {selectedMonths.length > 0 && (
//               <p className="text-xs text-slate-500">
//                 Period{" "}
//                 <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
//                   {fromMonth} – {toMonth}
//                 </span>
//               </p>
//             )}
//           </div>

//           {/* right: branch + period selects */}
//           <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
//             {/* Branch select */}
//             <div className="flex flex-col gap-1">
//               <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
//                 Branch
//               </span>
//               <div className="relative">
//                 <select
//                   value={selectedBranch}
//                   onChange={(e) => setselectedBranch(e.target.value)}
//                   className="h-8 min-w-[150px] rounded-md border border-slate-300 bg-white pr-7 pl-3 text-xs text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
//                 >
//                   {userbranches.map((b) => (
//                     <option key={b.id} value={b.id}>
//                       {b.branchName}
//                     </option>
//                   ))}
//                 </select>
//                 <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
//               </div>
//             </div>

//             <div className="flex flex-col gap-1 mt-2">
//               {/* Label */}
//               <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
//                 Period
//               </span>

//               {/* From / To controls */}
//               <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2 py-1">
//                 <span className="text-[11px] font-medium text-slate-500">
//                   From
//                 </span>
//                 <select
//                   value={fromMonth}
//                   onChange={(e) => setFromMonth(e.target.value)}
//                   className="h-7 rounded-md border border-slate-200 bg-white px-2 pr-6 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/40"
//                 >
//                   {months.map((m) => (
//                     <option key={m}>{m}</option>
//                   ))}
//                 </select>

//                 <span className="text-[11px] font-medium text-slate-500">
//                   To
//                 </span>
//                 <select
//                   value={toMonth}
//                   onChange={(e) => setToMonth(e.target.value)}
//                   className="h-7 rounded-md border border-slate-200 bg-white px-2 pr-6 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/40"
//                 >
//                   {months.map((m) => (
//                     <option key={m}>{m}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* TOP ACTIONS */}
//         <div className="flex flex-wrap gap-2">
//           <button
//             onClick={() => setShowProductModal(true)}
//             className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 shadow-sm hover:border-indigo-500 hover:text-indigo-700 hover:shadow focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
//           >
//             <Settings className="h-3.5 w-3.5 text-indigo-500" />
//             Products ({productandservices.length})
//           </button>
//           <button
//             onClick={() => setShowAllocationModal(true)}
//             className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
//           >
//             <Plus className="h-3.5 w-3.5" />
//             Allocations ({selectedAllocations.length})
//           </button>
//         </div>

//         {/* TABLE CARD */}
//         <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[1100px] border-collapse text-xs">
//               <thead>
//                 {/* main header */}
//                 <tr className="bg-slate-900">
//                   <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-white border-r border-slate-800">
//                     Products &amp; Services
//                   </th>
//                   <th
//                     colSpan={selectedMonths.length}
//                     className="px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-white border-r border-slate-800"
//                   >
//                     Target
//                   </th>
//                   <th
//                     colSpan={selectedAllocations.length}
//                     className="px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-white"
//                   >
//                     Incentive
//                   </th>
//                 </tr>
//                 {/* sub header */}
//                 <tr className="bg-slate-50">
//                   <th className="px-3 py-1.5 text-left text-[11px] font-medium text-slate-500 border-r border-slate-200"></th>
//                   {selectedMonths.map((month) => (
//                     <th
//                       key={month}
//                       className="px-3 py-1.5 text-center text-[11px] font-medium text-slate-600 border-r border-slate-200 whitespace-nowrap"
//                     >
//                       {month}
//                     </th>
//                   ))}
//                   {selectedAllocations.map((alloc) => (
//                     <th
//                       key={alloc.id}
//                       className="px-3 py-1.5 text-center text-[11px] font-medium text-slate-600 border-r border-slate-200 whitespace-nowrap"
//                     >
//                       {alloc.name}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {selectedProducts.map((product, idx) => (
//                   <tr
//                     key={product.id}
//                     className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}
//                   >
//                     <td className="px-3 py-2 border-r border-slate-200 text-[13px] font-medium text-slate-900 whitespace-nowrap">
//                       {product.name}
//                     </td>

//                     {/* Target cells */}
//                     {selectedMonths.map((month) => (
//                       <td
//                         key={month}
//                         className="px-2 py-1.5 border-r border-slate-200 align-middle"
//                       >
//                         <div className="flex items-center gap-1">
//                           <input
//                             type="text"
//                             disabled
//                             value={targetData[`${product.id}-${month}`] || ""}
//                             onChange={(e) =>
//                               handleTargetInput(
//                                 product.id,
//                                 month,
//                                 e.target.value
//                               )
//                             }
//                             className="w-20 rounded-md border border-slate-300 bg-slate-50 px-2 py-1 text-[11px] text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500/40"
//                             placeholder="0"
//                           />
//                           <button
//                             onClick={() =>
//                               openSplitModal(product.id, month, product.name)
//                             }
//                             className="inline-flex items-center justify-center rounded-full bg-slate-900 p-1 text-white text-[10px] hover:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900/70"
//                             title="Split Target"
//                           >
//                             <Users className="h-3 w-3" />
//                           </button>
//                         </div>
//                       </td>
//                     ))}

//                     {/* Incentive cells */}
//                     {selectedAllocations.map((alloc) => (
//                       <td
//                         key={alloc.id}
//                         className="px-2 py-1.5 border-r border-slate-200 align-middle"
//                       >
//                         <div className="flex items-center gap-1">
//                           <input
//                             type="number"
//                             value={
//                               targetpriceorpercentageValue[
//                                 `${product.id}-${alloc.id}-value`
//                               ] || ""
//                             }
//                             onChange={(e) =>
//                               handleIncentiveInput(
//                                 product.id,
//                                 alloc.id,
//                                 e.target.value,
//                                 "value"
//                               )
//                             }
//                             className="max-w-24 rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
//                             placeholder="0"
//                           />
//                           <div className="relative flex-shrink-0">
//                             <select
//                               value={
//                                 targetpriceorPercentageType[
//                                   `${product.id}-${alloc.id}-type`
//                                 ]
//                               }
//                               onChange={(e) =>
//                                 handleIncentiveInput(
//                                   product.id,
//                                   alloc.id,
//                                   e.target.value,
//                                   "type"
//                                 )
//                               }
//                               className="appearance-none rounded-md border border-slate-300 bg-slate-50 px-2 py-1 pr-6 text-[11px] text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
//                             >
//                               <option value="amount">₹</option>
//                               <option value="percentage">%</option>
//                             </select>
//                             <ChevronDown className="pointer-events-none absolute right-1 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-500" />
//                           </div>
//                         </div>
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* FOOTER */}
//           <div className="flex justify-end items-center gap-2 border-t border-slate-200 bg-slate-50 px-3 py-2.5">
//             <span className="hidden text-[11px] text-slate-500 sm:inline">
//               Changes apply for selected branch and period.
//             </span>
//             <button
//               onClick={handleSubmit}
//               className="inline-flex items-center rounded-md bg-slate-900 px-4 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/70"
//             >
//               Save Target
//             </button>
//           </div>
//         </div>

//         {/* Modals: keep same structure, just reduce padding & sizes */}
//         {/* Product Selection Modal */}
//         {showProductModal && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
//             <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
//               <div className="px-4 py-3 flex items-center justify-between border-b border-slate-200 bg-slate-50">
//                 <h3 className="text-sm font-semibold text-slate-900">
//                   Select Products &amp; Services
//                 </h3>
//                 <button
//                   onClick={() => setShowProductModal(false)}
//                   className="rounded-full p-1 text-slate-500 hover:bg-slate-200"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               </div>
//               <div className="p-4 space-y-1 max-h-80 overflow-y-auto">
//                 {productandservices.map((product) => (
//                   <label
//                     key={product.id}
//                     className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-slate-50 cursor-pointer"
//                   >
//                     <input
//                       type="checkbox"
//                       checked={selectedProducts.some(
//                         (p) => p.id === product.id
//                       )}
//                       onChange={() => handleProductSelection(product)}
//                       className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-1 focus:ring-indigo-500"
//                     />
//                     <span className="text-sm text-slate-800">
//                       {product.name}
//                     </span>
//                   </label>
//                 ))}
//               </div>
//               <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
//                 <button
//                   onClick={() => setShowProductModal(false)}
//                   className="px-4 py-1.5 bg-indigo-600 text-xs text-white rounded-md hover:bg-indigo-700"
//                 >
//                   Done
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Allocation Selection Modal (same compact style) */}
//         {showAllocationModal && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
//             <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
//               <div className="px-4 py-3 flex items-center justify-between border-b border-slate-200 bg-slate-50">
//                 <h3 className="text-sm font-semibold text-slate-900">
//                   Select Allocation Types
//                 </h3>
//                 <button
//                   onClick={() => setShowAllocationModal(false)}
//                   className="rounded-full p-1 text-slate-500 hover:bg-slate-200"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               </div>
//               <div className="p-4 space-y-1 max-h-80 overflow-y-auto">
//                 {availableAllocations.map((allocation) => (
//                   <label
//                     key={allocation.id}
//                     className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-slate-50 cursor-pointer"
//                   >
//                     <input
//                       type="checkbox"
//                       checked={selectedAllocations.some(
//                         (a) => a.id === allocation.id
//                       )}
//                       onChange={() => handleAllocationSelection(allocation)}
//                       className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-1 focus:ring-emerald-500"
//                     />
//                     <span className="text-sm text-slate-800">
//                       {allocation.name}
//                     </span>
//                   </label>
//                 ))}
//               </div>
//               <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
//                 <button
//                   onClick={() => setShowAllocationModal(false)}
//                   className="px-4 py-1.5 bg-emerald-600 text-xs text-white rounded-md hover:bg-emerald-700"
//                 >
//                   Done
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Split Target Modal: keep your latest grid change; you can keep paddings similar to these modals */}
//         {/* ...use the last version we just fixed for alignment, but reduce px/py like in product modal... */}
//       </div>
//     </div>
//   )
// }

// export default TargetRegister

// import { useState, useEffect, useRef } from "react"
// import { Plus, Settings, Users, X, ChevronDown } from "lucide-react"
// import { useSelector } from "react-redux"
// import UseFetch from "../../../hooks/useFetch"
// import api from "../../../api/api"
// import { getLocalStorageItem } from "../../../helper/localstorage"
// import { use } from "react"

// const months = [
//   "January",
//   "February",
//   "March",
//   "April",
//   "May",
//   "June",
//   "July",
//   "August",
//   "September",
//   "October",
//   "November",
//   "December"
// ]

// export const TargetRegister = () => {
//   const [fromMonth, setFromMonth] = useState("October")
//   const [toMonth, setToMonth] = useState("December")
// console.log('Hh')
//   const [userbranches, setuserBranches] = useState([])
//   const [selectedBranch, setselectedBranch] = useState(null)
//   const [availableAllocations, setavailableAllocation] = useState([])
//   const [selectedProducts, setSelectedProducts] = useState([])
//   const [productandservices, setproductsandservices] = useState([])
// const [categorylist,setcategoryList]=useState([])

//   const [respectedmonthtargetType, setrespectedmonthtargetType] = useState({})
//   const [selectedsplitProducts, setselectedsplitProducts] = useState(null)
//   const [selectedsplitmonth, setselectedsplitmonth] = useState(null)

//   const [message, setMessage] = useState(null)

//   const [selectedAllocations, setSelectedAllocations] = useState([])

//   const [showProductModal, setShowProductModal] = useState(false)
//   const [showAllocationModal, setShowAllocationModal] = useState(false)
//   const [showSplitModal, setShowSplitModal] = useState(false)
//   const [splitModalData, setSplitModalData] = useState(null)

//   // committedTargetData: what's actually shown in the month input cells
//   // Only updated when "Save Split" is clicked
//   const [committedTargetData, setCommittedTargetData] = useState({})

//   const [targetpriceorPercentageType, settargetpriceorPercentageType] =
//     useState({})
//   const [targetpriceorpercentageValue, settargetpriceorpercentageValue] =
//     useState({})

//   // workingSplitData: live edits inside the modal (not yet committed)
//   const [workingSplitData, setWorkingSplitData] = useState({})

//   // committedSplitData: saved splits used for submission and determining "first time"
//   const [committedSplitData, setCommittedSplitData] = useState({})

//   const [userList, setuserList] = useState([])

//   // Tracks which products have had at least one "Save Split" committed.
//   // Key = productId, value = true
//   const committedProductsRef = useRef({})

//   const { data } = UseFetch("/auth/getallusers?isVerified=true")
//   const loggeduserBranch = useSelector(
//     (state) => state.companyBranch.loggeduserbranches
//   )

//   const query = new URLSearchParams({
//     branchselectedArray: JSON.stringify(loggeduserBranch)
//   }).toString()

//   const { data: productslist } = UseFetch(`/product/getallproducts?${query}`)
//   const { data: servicelist } = UseFetch(`/product/getallServices?${query}`)
// const {data:category}=UseFetch("/inventory/getCategory")
// console.log(category)
//   const { data: tasklist } = UseFetch("/lead/getAlltasktoTarget")

//   const safeNum = (v) => {
//     const n = Number(v)
//     return Number.isFinite(n) ? n : 0
//   }

//   const recomputeTotalTargetForKey = (splitArray) => {
//     if (!splitArray || !splitArray.length) return 0
//     return splitArray.reduce((sum, user) => {
//       const slabs = user.slabs || []
//       if (!slabs.length) return sum
//       return sum + safeNum(slabs[slabs.length - 1].to)
//     }, 0)
//   }

//   useEffect(() => {
//     if (tasklist && tasklist.length) {
//       const filteredtask = tasklist.filter((item) => {
//         const name = (item.taskName || "").trim().toLowerCase()
//         return item.listed || name === "lead" || name === "closing"
//       })

//       const mapped = filteredtask.map((item) => ({
//         id: item._id,
//         name: item.taskName
//       }))

//       setavailableAllocation(mapped)

//       // Auto-select "Followup" by default
//       const followup = mapped.find(
//         (item) => item.name.trim().toLowerCase() === "followup"
//       )
//       if (followup) {
//         setSelectedAllocations((prev) => {
//           const alreadySelected = prev.some((a) => a.id === followup.id)
//           return alreadySelected ? prev : [...prev, followup]
//         })
//       }
//     }
//   }, [tasklist])

//   // init user + branches
//   useEffect(() => {
//     const userData = getLocalStorageItem("user")
//     if (!userData?.selected?.length) return
//     setselectedBranch(userData.selected[0]?.branch_id)
//     const branches = userData.selected.map((branch) => ({
//       id: branch.branch_id,
//       branchName: branch.branchName
//     }))
//     setuserBranches(branches)
//   }, [])
// useEffect(()=>{
// if(!category)return
// console.log(category)
// setcategoryList(category)
// },[category])

//   // products + services combined
//   useEffect(() => {
//     if (!productslist && !servicelist) return
//     const all = []
//     if (productslist && productslist.length) {
//       all.push(
//         ...productslist.map((item) => ({
//           id: item._id,
//           name: item.productName,
//           branchIds: (item.selected || []).map((sel) => sel.branch_id)
//         }))
//       )
//     }
//     if (servicelist && servicelist.length) {
//       all.push(
//         ...servicelist.map((item) => ({
//           id: item._id,
//           name: item.serviceName,
//           branchIds: (item.selected || []).map((it) => it.branch_id)
//         }))
//       )
//     }

// console.log(all)
//     setproductsandservices(all)
//   }, [productslist, servicelist])

//   // users list
//   useEffect(() => {
//     if (!data) return
//     const { allusers = [], allAdmins = [] } = data
//     const combinedUsers = [...allusers, ...allAdmins]
//     const users = combinedUsers
//       .filter(
//         (user) =>
//           Array.isArray(user.selected) &&
//           user.selected.some((sel) => sel.branch_id === selectedBranch)
//       )
//       .map((user) => ({
//         id: user._id,
//         name: user.name,
//         givenTarget: "",
//         achievedTarget: "",
//         slabs: []
//       }))
//     setuserList(users)
//   }, [data, selectedBranch])

//   // default incentive type = amount
//   useEffect(() => {
//     if (!selectedAllocations.length || !productandservices.length) return
//     const updatedEntries = {}
//     productandservices.forEach((product) => {
//       selectedAllocations.forEach((allocationType) => {
//         updatedEntries[`${product.id}-${allocationType.id}-type`] = "amount"
//       })
//     })
//     settargetpriceorPercentageType((prev) => ({ ...prev, ...updatedEntries }))
//   }, [selectedAllocations, productandservices])
// console.log(targetpriceorPercentageType)
//   const filteredProductsForBranch = productandservices.filter((p) =>
//     selectedBranch ? p.branchIds?.includes(selectedBranch) : true
//   )

//   useEffect(() => {
//     setSelectedProducts((prev) =>
//       prev.filter((p) => filteredProductsForBranch.some((fp) => fp.id === p.id))
//     )

//   }, [selectedBranch, productandservices])

//   const getMonthsInRange = () => {
//     const fromIndex = months.indexOf(fromMonth)
//     const toIndex = months.indexOf(toMonth)
//     if (fromIndex === -1 || toIndex === -1 || fromIndex > toIndex) return []
//     return months.slice(fromIndex, toIndex + 1)
//   }

//   const selectedMonths = getMonthsInRange()

//   const handleProductSelection = (product) => {
//     setSelectedProducts((prev) => {
//       const exists = prev.find((p) => p.id === product.id)
//       if (exists) return prev.filter((p) => p.id !== product.id)
//       return [...prev, product]
//     })
//   }

//   const handleAllocationSelection = (allocation) => {
//     setSelectedAllocations((prev) => {
//       const exists = prev.find((a) => a.id === allocation.id)
//       if (exists) return prev.filter((a) => a.id !== allocation.id)
//       return [...prev, allocation]
//     })
//   }

//   const handleRemoveProductRow = (productId) => {
//     setSelectedProducts((prev) => prev.filter((p) => p.id !== productId))

//     setCommittedTargetData((prev) => {
//       const next = { ...prev }
//       Object.keys(next).forEach((key) => {
//         if (key.startsWith(`${productId}-`)) delete next[key]
//       })
//       return next
//     })

//     settargetpriceorpercentageValue((prev) => {
//       const next = { ...prev }
//       Object.keys(next).forEach((key) => {
//         if (key.startsWith(`${productId}-`)) delete next[key]
//       })
//       return next
//     })

//     settargetpriceorPercentageType((prev) => {
//       const next = { ...prev }
//       Object.keys(next).forEach((key) => {
//         if (key.startsWith(`${productId}-`)) delete next[key]
//       })
//       return next
//     })

//     setCommittedSplitData((prev) => {
//       const next = { ...prev }
//       Object.keys(next).forEach((key) => {
//         if (key.startsWith(`${productId}-`)) delete next[key]
//       })
//       return next
//     })

//     setWorkingSplitData((prev) => {
//       const next = { ...prev }
//       Object.keys(next).forEach((key) => {
//         if (key.startsWith(`${productId}-`)) delete next[key]
//       })
//       return next
//     })

//     delete committedProductsRef.current[productId]
//   }

//   const handleIncentiveInput = (productId, allocId, value, type) => {
//     if (type === "type") {
//       settargetpriceorPercentageType((prev) => ({
//         ...prev,
//         [`${productId}-${allocId}-${type}`]: value
//       }))
//     } else {
//       settargetpriceorpercentageValue((prev) => ({
//         ...prev,
//         [`${productId}-${allocId}-${type}`]: value
//       }))
//     }
//   }

//   // ─── Open split modal: load working data from committed data ─────────────────
//   const openSplitModal = (productId, month, name) => {
//     const Name = name.trim()

//     setrespectedmonthtargetType((prev) => {
//       const updated = { ...prev }
//       selectedMonths.forEach((m) => {
//         const key = `${productId}-${m}`
//         const keyName = `${Name}-${m}`
//         if (!updated[key]) updated[key] = "quantity"
//         if (!updated[keyName]) updated[keyName] = "quantity"
//       })
//       return updated
//     })

//     // Populate workingSplitData for this month from committedSplitData
//     // so the modal always starts from the last saved state for that specific month
//     const committedKey = `${productId}-${month}`
//     const existingCommitted = committedSplitData[committedKey]

//     setWorkingSplitData((prev) => ({
//       ...prev,
//       [committedKey]: existingCommitted
//         ? JSON.parse(JSON.stringify(existingCommitted))
//         : []
//     }))

//     // Sync userList givenTarget from committed data for this month
//     setuserList((prevUsers) =>
//       prevUsers.map((u) => {
//         const userEntry = existingCommitted?.find(
//           (item) => item.userId === u.id
//         )
//         return {
//           ...u,
//           givenTarget: userEntry ? String(userEntry.splitTarget || "") : "",
//           slabs: userEntry ? userEntry.slabs || [] : []
//         }
//       })
//     )

//     setSplitModalData({ productId, month, name })
//     setShowSplitModal(true)
//     setselectedsplitProducts(productId)
//     setselectedsplitmonth(month)
//   }

//   // ─── handleSplitChange: only mutates workingSplitData ───────────────────────
//   const handleSplitChange = (userId, rawValue) => {
//     const value = safeNum(rawValue)

//     if (message?.[userId]) {
//       setMessage((prev) => ({ ...prev, [userId]: "" }))
//     }

//     const key = `${splitModalData.productId}-${splitModalData.month}`

//     setWorkingSplitData((prev) => {
//       const existingArray = prev[key] || []
//       const idx = existingArray.findIndex((i) => i.userId === userId)
//       let userEntry =
//         idx !== -1
//           ? { ...existingArray[idx] }
//           : { userId, splitTarget: 0, slabs: [] }

//       let slabs = [...(userEntry.slabs || [])]

//       if (!slabs.length) {
//         slabs = [{ from: 0, to: value, amount: "" }]
//       } else {
//         slabs[slabs.length - 1] = { ...slabs[slabs.length - 1], to: value }
//       }

//       userEntry.slabs = slabs
//       userEntry.splitTarget = value

//       const updatedArray =
//         idx !== -1
//           ? existingArray.map((it, i) => (i === idx ? userEntry : it))
//           : [...existingArray, userEntry]

//       // Update userList for live slab display inside modal
//       setuserList((prevUsers) =>
//         prevUsers.map((u) =>
//           u.id === userId
//             ? { ...u, givenTarget: value.toString(), slabs }
//             : u
//         )
//       )

//       return { ...prev, [key]: updatedArray }
//     })
//   }

//   // ─── handleAddSlab: only mutates workingSplitData ───────────────────────────
//   const handleAddSlab = (userId) => {
//     const key = `${splitModalData.productId}-${splitModalData.month}`

//     const user = userList.find((u) => u.id === userId)
//     const currentInputValue = safeNum(user?.givenTarget)

//     if (!currentInputValue) {
//       setMessage((prev) => ({
//         ...(prev || {}),
//         [userId]: "Please fill the target first"
//       }))
//       return
//     }

//     setWorkingSplitData((prev) => {
//       const existingArray = prev[key] || []
//       const idx = existingArray.findIndex((i) => i.userId === userId)
//       let userEntry =
//         idx !== -1
//           ? { ...existingArray[idx] }
//           : { userId, splitTarget: 0, slabs: [] }

//       const slabs = [...(userEntry.slabs || [])]

//       if (!slabs.length) {
//         slabs.push({ from: 0, to: currentInputValue, amount: "" })
//       } else {
//         const lastTo = safeNum(slabs[slabs.length - 1].to)
//         slabs.push({ from: lastTo, to: currentInputValue, amount: "" })
//       }

//       userEntry.slabs = slabs
//       userEntry.splitTarget = currentInputValue

//       const updatedArray =
//         idx !== -1
//           ? existingArray.map((it, i) => (i === idx ? userEntry : it))
//           : [...existingArray, userEntry]

//       setuserList((prevUsers) =>
//         prevUsers.map((u) => (u.id === userId ? { ...u, slabs } : u))
//       )

//       return { ...prev, [key]: updatedArray }
//     })
//   }

//   // ─── handleRemoveSlab: only mutates workingSplitData ────────────────────────
//   const handleRemoveSlab = (userId, slabIndex) => {
//     const key = `${splitModalData.productId}-${splitModalData.month}`

//     setWorkingSplitData((prev) => {
//       const existingArray = prev[key] || []
//       const idx = existingArray.findIndex((i) => i.userId === userId)
//       if (idx === -1) return prev

//       const entry = { ...existingArray[idx] }
//       let slabs = [...(entry.slabs || [])].filter((_, i) => i !== slabIndex)
//       entry.slabs = slabs
//       entry.splitTarget = slabs.length
//         ? safeNum(slabs[slabs.length - 1].to)
//         : 0

//       const updatedArray = existingArray.map((it, i) =>
//         i === idx ? entry : it
//       )

//       setuserList((prevUsers) =>
//         prevUsers.map((u) => (u.id === userId ? { ...u, slabs } : u))
//       )

//       return { ...prev, [key]: updatedArray }
//     })
//   }

//   // ─── handleSlabChange: only mutates workingSplitData ────────────────────────
//   const handleSlabChange = (userId, slabIndex, field, rawValue) => {
//     const key = `${splitModalData.productId}-${splitModalData.month}`
//     const value = field === "amount" ? rawValue : safeNum(rawValue)

//     setWorkingSplitData((prev) => {
//       const existingArray = prev[key] || []
//       const idx = existingArray.findIndex((i) => i.userId === userId)
//       if (idx === -1) return prev

//       const entry = { ...existingArray[idx] }
//       const slabs = [...(entry.slabs || [])]
//       slabs[slabIndex] = { ...slabs[slabIndex], [field]: value }
//       entry.slabs = slabs
//       if (slabs.length) {
//         entry.splitTarget = safeNum(slabs[slabs.length - 1].to)
//       }

//       const updatedArray = existingArray.map((it, i) =>
//         i === idx ? entry : it
//       )

//       setuserList((prevUsers) =>
//         prevUsers.map((u) => (u.id === userId ? { ...u, slabs } : u))
//       )

//       return { ...prev, [key]: updatedArray }
//     })
//   }

//   const handleCancel = () => {
//     setShowSplitModal(false)
//     // discard working changes — leave committedSplitData untouched
//     setWorkingSplitData({})
//   }

//   // ─── Save Split: commit workingSplitData → committedSplitData + committedTargetData ──
//   const handlesaveSplit = () => {
//     const { productId, month } = splitModalData
//     const key = `${productId}-${month}`
//     const workingArray = workingSplitData[key] || []
//     const total = recomputeTotalTargetForKey(workingArray)

//     const isFirstTime = !committedProductsRef.current[productId]

//     setCommittedSplitData((prev) => {
//       const next = { ...prev }

//       if (isFirstTime) {
//         // Spread this split to all months in range
//         selectedMonths.forEach((m) => {
//           next[`${productId}-${m}`] = JSON.parse(JSON.stringify(workingArray))
//         })
//       } else {
//         // Only update this specific month
//         next[key] = JSON.parse(JSON.stringify(workingArray))
//       }

//       return next
//     })

//     setCommittedTargetData((prev) => {
//       const next = { ...prev }

//       if (isFirstTime) {
//         selectedMonths.forEach((m) => {
//           next[`${productId}-${m}`] = total
//         })
//       } else {
//         next[key] = total
//       }

//       return next
//     })

//     // Mark this product as having been committed at least once
//     committedProductsRef.current[productId] = true

//     setWorkingSplitData({})
//     setShowSplitModal(false)
//   }

//   // ─── Submit ──────────────────────────────────────────────────────────────────
//   const handleSubmit = async () => {
//     const formData = {
//       targetData: committedTargetData,
//       targetpriceorPercentageType,
//       targetpriceorpercentageValue,
//       splitData: committedSplitData
//     }
//     await api.post("/target/submitTargetRegister", formData)
//   }

//   // ─── Live total shown in the split modal header (from workingSplitData) ──────
//   const modalKey =
//     splitModalData && `${splitModalData.productId}-${splitModalData.month}`
//   const modalWorkingArray = modalKey ? workingSplitData[modalKey] || [] : []
//   const modalTotal = recomputeTotalTargetForKey(modalWorkingArray)
//   const currentType =
//     respectedmonthtargetType?.[
//       `${selectedsplitProducts}-${selectedsplitmonth}`
//     ] || "quantity"
//   const totalLabel =
//     currentType === "quantity"
//       ? `${modalTotal} NO`
//       : `₹ ${modalTotal.toLocaleString("en-IN")}`

//   return (
//     <div className="h-full bg-[#ADD8E6] flex flex-col px-3 py-4 sm:px-5 sm:py-5 overflow-hidden">
//       <div className="mx-auto w-full max-w-6xl flex flex-col flex-1 min-h-0 gap-3">
//         {/* HEADER */}
//         <div className="flex-shrink-0 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white border border-slate-200 rounded-lg px-3 py-3">
//           <div className="space-y-1">
//             <h1 className="text-lg sm:text-xl font-semibold text-slate-900">
//               Target Master
//             </h1>
//             {selectedMonths.length > 0 && (
//               <p className="text-xs text-slate-500">
//                 Period{" "}
//                 <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
//                   {fromMonth} – {toMonth}
//                 </span>
//               </p>
//             )}
//           </div>

//           <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
//             <div className="flex flex-col gap-1">
//               <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
//                 Branch
//               </span>
//               <div className="relative">
//                 <select
//                   value={selectedBranch || ""}
//                   onChange={(e) => setselectedBranch(e.target.value)}
//                   className="h-8 min-w-[150px] rounded-md border border-slate-300 bg-white pr-7 pl-3 text-xs text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
//                 >
//                   {userbranches.map((b) => (
//                     <option key={b.id} value={b.id}>
//                       {b.branchName}
//                     </option>
//                   ))}
//                 </select>
//                 <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
//               </div>
//             </div>

//             <div className="flex flex-col gap-1 mt-2 sm:mt-0">
//               <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
//                 Period
//               </span>
//               <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2 py-1">
//                 <span className="text-[11px] font-medium text-slate-500">
//                   From
//                 </span>
//                 <select
//                   value={fromMonth}
//                   onChange={(e) => setFromMonth(e.target.value)}
//                   className="h-7 rounded-md border border-slate-200 bg-white px-2 pr-6 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/40"
//                 >
//                   {months.map((m) => (
//                     <option key={m}>{m}</option>
//                   ))}
//                 </select>
//                 <span className="text-[11px] font-medium text-slate-500">
//                   To
//                 </span>
//                 <select
//                   value={toMonth}
//                   onChange={(e) => setToMonth(e.target.value)}
//                   className="h-7 rounded-md border border-slate-200 bg-white px-2 pr-6 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/40"
//                 >
//                   {months.map((m) => (
//                     <option key={m}>{m}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ACTIONS */}
//         <div className="flex-shrink-0 flex flex-wrap gap-2">
//           <button
//             onClick={() => setShowProductModal(true)}
//             className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 shadow-sm hover:border-indigo-500 hover:text-indigo-700 hover:shadow focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
//           >
//             <Settings className="h-3.5 w-3.5 text-indigo-500" />
//             Products ({filteredProductsForBranch.length})
//           </button>
//           <button
//             onClick={() => setShowAllocationModal(true)}
//             className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
//           >
//             <Plus className="h-3.5 w-3.5" />
//             Allocations ({selectedAllocations.length})
//           </button>
//         </div>

//         {/* TABLE CARD */}
//         <div className="flex-1 min-h-0 flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm">
//           <div className="flex-1 min-h-0 overflow-x-auto overflow-y-auto">
//             <table className="w-full min-w-[1100px] border-collapse text-xs">
//               <thead className="sticky top-0 z-10">
//                 <tr className="bg-slate-900">
//                   <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-white border-r border-slate-800">
//                     Products &amp; Services
//                   </th>
//                   <th
//                     colSpan={selectedMonths.length}
//                     className="px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-white border-r border-slate-800"
//                   >
//                     Target
//                   </th>
//                   <th
//                     colSpan={selectedAllocations.length}
//                     className="px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-white"
//                   >
//                     Incentive
//                   </th>
//                 </tr>
//                 <tr className="bg-slate-50">
//                   <th className="px-3 py-1.5 text-left text-[11px] font-medium text-slate-500 border-r border-slate-200"></th>
//                   {selectedMonths.map((month) => (
//                     <th
//                       key={month}
//                       className="px-3 py-1.5 text-center text-[11px] font-medium text-slate-600 border-r border-slate-200 whitespace-nowrap"
//                     >
//                       {month}
//                     </th>
//                   ))}
//                   {selectedAllocations.map((alloc) => (
//                     <th
//                       key={alloc.id}
//                       className="px-3 py-1.5 text-center text-[11px] font-medium text-slate-600 border-r border-slate-200 whitespace-nowrap"
//                     >
//                       {alloc.name}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>

//               <tbody>
//                 {selectedProducts.map((product, idx) => (
//                   <tr
//                     key={product.id}
//                     className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}
//                   >
//                     <td className="px-3 py-2 border-r border-slate-200 text-[13px] font-medium text-slate-900 whitespace-nowrap">
//                       <div className="flex items-center gap-2">
//                         <button
//                           type="button"
//                           onClick={() => handleRemoveProductRow(product.id)}
//                           className="inline-flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 w-5 h-5 text-[10px]"
//                           title="Remove row"
//                         >
//                           ×
//                         </button>
//                         <span>{product.name}</span>
//                       </div>
//                     </td>

//                     {selectedMonths.map((month) => (
//                       <td
//                         key={month}
//                         className="px-2 py-1.5 border-r border-slate-200 align-middle"
//                       >
//                         <div className="flex items-center gap-1">
//                           {/* ✅ Shows committedTargetData only (updated on Save Split) */}
//                           <input
//                             type="text"
//                             disabled
//                             value={
//                               committedTargetData[`${product.id}-${month}`] ||
//                               ""
//                             }
//                             className="w-20 rounded-md border border-slate-300 bg-slate-50 px-2 py-1 text-[11px] text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500/40"
//                             placeholder="0"
//                           />
//                           <button
//                             type="button"
//                             onClick={() =>
//                               openSplitModal(product.id, month, product.name)
//                             }
//                             className="inline-flex items-center justify-center rounded-full bg-slate-900 p-1 text-white text-[10px] hover:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900/70"
//                             title="Split Target"
//                           >
//                             <Users className="h-3 w-3" />
//                           </button>
//                         </div>
//                       </td>
//                     ))}

//                     {selectedAllocations.map((alloc) => (
//                       <td
//                         key={alloc.id}
//                         className="px-2 py-1.5 border-r border-slate-200 align-middle"
//                       >
//                         <div className="flex items-center gap-1">
//                           <input
//                             type="number"
//                             value={
//                               targetpriceorpercentageValue[
//                                 `${product.id}-${alloc.id}-value`
//                               ] || ""
//                             }
//                             onChange={(e) =>
//                               handleIncentiveInput(
//                                 product.id,
//                                 alloc.id,
//                                 e.target.value,
//                                 "value"
//                               )
//                             }
//                             className="max-w-24 rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
//                             placeholder="0"
//                           />
//                           <div className="relative flex-shrink-0">
//                             <select
//                               value={
//                                 targetpriceorPercentageType[
//                                   `${product.id}-${alloc.id}-type`
//                                 ]
//                               }
//                               onChange={(e) =>
//                                 handleIncentiveInput(
//                                   product.id,
//                                   alloc.id,
//                                   e.target.value,
//                                   "type"
//                                 )
//                               }
//                               className="appearance-none rounded-md border border-slate-300 bg-slate-50 px-2 py-1 pr-6 text-[11px] text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
//                             >
//                               <option value="amount">₹</option>
//                               <option value="percentage">%</option>
//                             </select>
//                             <ChevronDown className="pointer-events-none absolute right-1 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-500" />
//                           </div>
//                         </div>
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="flex-shrink-0 flex justify-end items-center gap-2 border-t border-slate-200 bg-slate-50 px-3 py-2.5">
//             <span className="hidden text-[11px] text-slate-500 sm:inline">
//               Changes apply for selected branch and period.
//             </span>
//             <button
//               onClick={handleSubmit}
//               className="inline-flex items-center rounded-md bg-slate-900 px-4 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/70"
//             >
//               Save Target
//             </button>
//           </div>
//         </div>

//         {/* PRODUCT MODAL */}
//         {showProductModal && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
//             <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
//               <div className="px-4 py-3 flex items-center justify-between border-b border-slate-200 bg-slate-50">
//                 <h3 className="text-sm font-semibold text-slate-900">
//                   Select Products &amp; Services
//                 </h3>
//                 <button
//                   onClick={() => setShowProductModal(false)}
//                   className="rounded-full p-1 text-slate-500 hover:bg-slate-200"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               </div>
//               <div className="p-4 space-y-1 max-h-80 overflow-y-auto">
//                 {filteredProductsForBranch.map((product) => (
//                   <label
//                     key={product.id}
//                     className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-slate-50 cursor-pointer"
//                   >
//                     <input
//                       type="checkbox"
//                       checked={selectedProducts.some(
//                         (p) => p.id === product.id
//                       )}
//                       onChange={() => handleProductSelection(product)}
//                       className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-1 focus:ring-indigo-500"
//                     />
//                     <span className="text-sm text-slate-800">
//                       {product.name}
//                     </span>
//                   </label>
//                 ))}
//                 {filteredProductsForBranch.length === 0 && (
//                   <p className="text-xs text-slate-500 px-2 py-1.5">
//                     No products found for this branch.
//                   </p>
//                 )}
//               </div>
//               <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
//                 <button
//                   onClick={() => setShowProductModal(false)}
//                   className="px-4 py-1.5 bg-indigo-600 text-xs text-white rounded-md hover:bg-indigo-700"
//                 >
//                   Done
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ALLOCATION MODAL */}
//         {showAllocationModal && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
//             <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
//               <div className="px-4 py-3 flex items-center justify-between border-b border-slate-200 bg-slate-50">
//                 <h3 className="text-sm font-semibold text-slate-900">
//                   Select Allocation Types
//                 </h3>
//                 <button
//                   onClick={() => setShowAllocationModal(false)}
//                   className="rounded-full p-1 text-slate-500 hover:bg-slate-200"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               </div>
//               <div className="p-4 space-y-1 max-h-80 overflow-y-auto">
//                 {availableAllocations.map((allocation) => (
//                   <label
//                     key={allocation.id}
//                     className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-slate-50 cursor-pointer"
//                   >
//                     <input
//                       type="checkbox"
//                       checked={selectedAllocations.some(
//                         (a) => a.id === allocation.id
//                       )}
//                       onChange={() => handleAllocationSelection(allocation)}
//                       className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-1 focus:ring-emerald-500"
//                     />
//                     <span className="text-sm text-slate-800">
//                       {allocation.name}
//                     </span>
//                   </label>
//                 ))}
//               </div>
//               <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
//                 <button
//                   onClick={() => setShowAllocationModal(false)}
//                   className="px-4 py-1.5 bg-emerald-600 text-xs text-white rounded-md hover:bg-emerald-700"
//                 >
//                   Done
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* SPLIT TARGET MODAL */}
//         {showSplitModal && splitModalData && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50">
//             <div className="bg-white rounded-xl shadow-2xl w-full flex flex-col overflow-hidden max-h-[90vh]">
//               <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between rounded-t-xl flex-shrink-0">
//                 <div>
//                   <h3 className="text-lg font-semibold text-white">
//                     Split Target
//                   </h3>
//                   <p className="text-sm text-blue-100">
//                     {
//                       productandservices.find(
//                         (p) => p.id === splitModalData.productId
//                       )?.name
//                     }
//                     {" - "}
//                     {splitModalData.month}
//                     {" · "}
//                     <span className="font-semibold">
//                       Total Target: {totalLabel}
//                     </span>
//                   </p>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={handleCancel}
//                   className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               <div className="flex-1 flex flex-col overflow-hidden">
//                 <div className="bg-white sticky top-0 z-10 px-6 py-3 border-b border-gray-200 flex items-center">
//                   <div className="flex items-center gap-2">
//                     <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
//                       Split Type
//                     </label>
//                     <div className="relative">
//                       <select
//                         value={
//                           respectedmonthtargetType?.[
//                             `${selectedsplitProducts}-${selectedsplitmonth}`
//                           ]
//                         }
//                         onChange={(e) =>
//                           setrespectedmonthtargetType((prev) => ({
//                             ...prev,
//                             [`${selectedsplitProducts}-${selectedsplitmonth}`]:
//                               e.target.value
//                           }))
//                         }
//                         className="w-28 px-2 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
//                       >
//                         <option value="quantity">Quantity</option>
//                         <option value="amount">Amount</option>
//                       </select>
//                       <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
//                     </div>
//                   </div>

//                   <div className="flex flex-1 justify-end items-center pr-4">
//                     <p className="text-sm text-gray-700">
//                       <span className="font-semibold">Total Target:</span>{" "}
//                       {totalLabel}
//                     </p>
//                   </div>
//                 </div>

//                 <label className="block text-sm font-medium text-gray-700 px-6 pt-3 pb-1">
//                   Assign to Users
//                 </label>

//                 <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4">
//                   {userList.map((user) => {
//                     const key = `${splitModalData.productId}-${splitModalData.month}`
//                     const userArray = workingSplitData[key] || []
//                     const currentUserData = userArray.find(
//                       (item) => item.userId === user.id
//                     )
//                     const userValue = currentUserData
//                       ? currentUserData.splitTarget || ""
//                       : ""
//                     const userSlabs = currentUserData?.slabs || []

//                     return (
//                       <div
//                         key={user.id}
//                         className="border border-gray-200 rounded-lg p-3 bg-gray-50"
//                       >
//                         <div className="grid grid-cols-[180px,120px,110px,minmax(0,1fr)] gap-2 items-start">
//                           <span className="text-sm font-medium text-gray-700 truncate">
//                             {user.name}
//                           </span>

//                           <div className="flex flex-col">
//                             <input
//                               type="number"
//                               value={userValue || ""}
//                               onChange={(e) =>
//                                 handleSplitChange(user.id, e.target.value)
//                               }
//                               className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                               placeholder="0"
//                             />
//                             {message?.[user.id] && (
//                               <p className="text-red-400 text-xs mt-1">
//                                 {message[user.id]}
//                               </p>
//                             )}
//                           </div>

//                           <button
//                             type="button"
//                             onClick={() => handleAddSlab(user.id)}
//                             className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
//                           >
//                             Add Slab
//                           </button>

//                           <div className="flex flex-wrap gap-2">
//                             {userSlabs.map((slab, index) => (
//                               <div
//                                 key={index}
//                                 className="relative bg-white border border-gray-300 rounded-lg shadow-sm flex-shrink-0"
//                               >
//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     handleRemoveSlab(user.id, index)
//                                   }
//                                   className="absolute -top-2 -right-2 z-10 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
//                                   title="Remove slab"
//                                 >
//                                   <X className="w-3.5 h-3.5" />
//                                 </button>
//                                 <table className="text-xs border-collapse">
//                                   <thead>
//                                     <tr>
//                                       <th className="px-1.5 py-0.5 text-center font-semibold bg-red-100 text-red-800 border-b w-20">
//                                         From
//                                       </th>
//                                       <th className="px-1.5 py-0.5 text-center font-semibold bg-green-100 text-green-800 border-b w-20">
//                                         To
//                                       </th>
//                                       <th className="px-1.5 py-0.5 text-center font-semibold bg-blue-100 text-blue-800 border-b w-20">
//                                         Amount
//                                       </th>
//                                     </tr>
//                                   </thead>
//                                   <tbody>
//                                     <tr>
//                                       <td className="px-1.5 py-1">
//                                         <input
//                                           type="text"
//                                           value={slab.from}
//                                           onChange={(e) =>
//                                             handleSlabChange(
//                                               user.id,
//                                               index,
//                                               "from",
//                                               e.target.value
//                                             )
//                                           }
//                                           className="w-20 px-1.5 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs text-center"
//                                           placeholder="0"
//                                         />
//                                       </td>
//                                       <td className="px-1.5 py-1">
//                                         <input
//                                           type="text"
//                                           value={slab.to}
//                                           onChange={(e) =>
//                                             handleSlabChange(
//                                               user.id,
//                                               index,
//                                               "to",
//                                               e.target.value
//                                             )
//                                           }
//                                           className="w-20 px-1.5 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs text-center"
//                                           placeholder="0"
//                                         />
//                                       </td>
//                                       <td className="px-1.5 py-1">
//                                         <input
//                                           type="number"
//                                           value={slab.amount}
//                                           onChange={(e) =>
//                                             handleSlabChange(
//                                               user.id,
//                                               index,
//                                               "amount",
//                                               e.target.value
//                                             )
//                                           }
//                                           className="w-20 px-1.5 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs text-center"
//                                           placeholder="0"
//                                         />
//                                       </td>
//                                     </tr>
//                                   </tbody>
//                                 </table>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     )
//                   })}
//                 </div>
//               </div>

//               <div className="px-6 py-4 bg-gray-100 rounded-b-xl flex justify-end gap-3 flex-shrink-0">
//                 <button
//                   type="button"
//                   onClick={handleCancel}
//                   className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handlesaveSplit}
//                   className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
//                 >
//                   Save Split
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default TargetRegister

// import { useState, useEffect, useRef } from "react"
// import { Plus, Settings, Users, X, ChevronDown } from "lucide-react"
// import { useSelector } from "react-redux"
// import UseFetch from "../../../hooks/useFetch"
// import api from "../../../api/api"
// import { getLocalStorageItem } from "../../../helper/localstorage"

// const months = [
//   "January",
//   "February",
//   "March",
//   "April",
//   "May",
//   "June",
//   "July",
//   "August",
//   "September",
//   "October",
//   "November",
//   "December"
// ]

// export const TargetRegister = () => {
//   const [fromMonth, setFromMonth] = useState("October")
//   const [toMonth, setToMonth] = useState("December")
//   const [userbranches, setuserBranches] = useState([])
//   const [selectedBranch, setselectedBranch] = useState(null)
//   const [availableAllocations, setavailableAllocation] = useState([])

//   // selected items (CATEGORIES; name kept as products)
//   const [selectedProducts, setSelectedProducts] = useState([])

//   // backing list used in UI (built from categories now)
//   const [productandservices, setproductsandservices] = useState([])

//   const [categorylist, setcategoryList] = useState([])

//   const [respectedmonthtargetType, setrespectedmonthtargetType] = useState({})
//   const [selectedsplitProducts, setselectedsplitProducts] = useState(null)
//   const [selectedsplitmonth, setselectedsplitmonth] = useState(null)
//   console.log("00000000000000000000000000000000000")
//   const [message, setMessage] = useState(null)

//   const [selectedAllocations, setSelectedAllocations] = useState([])

//   const [showProductModal, setShowProductModal] = useState(false)
//   const [showAllocationModal, setShowAllocationModal] = useState(false)
//   const [showSplitModal, setShowSplitModal] = useState(false)
//   const [splitModalData, setSplitModalData] = useState(null)

//   // committedTargetData: what's actually shown in the month input cells
//   // Only updated when "Save Split" is clicked
//   const [committedTargetData, setCommittedTargetData] = useState({})

//   const [targetpriceorPercentageType, settargetpriceorPercentageType] =
//     useState({})
//   const [targetpriceorpercentageValue, settargetpriceorpercentageValue] =
//     useState({})

//   // workingSplitData: live edits inside the modal (not yet committed)
//   const [workingSplitData, setWorkingSplitData] = useState({})

//   // committedSplitData: saved splits used for submission and determining "first time"
//   const [committedSplitData, setCommittedSplitData] = useState({})

//   const [userList, setuserList] = useState([])

//   // Tracks which items (categories) have had at least one "Save Split" committed.
//   // Key = categoryId, value = true
//   const committedProductsRef = useRef({})

//   const { data } = UseFetch("/auth/getallusers?isVerified=true")
//   const loggeduserBranch = useSelector(
//     (state) => state.companyBranch.loggeduserbranches
//   )

//   const query = new URLSearchParams({
//     branchselectedArray: JSON.stringify(loggeduserBranch)
//   }).toString()

//   // OLD:
//   // const { data: productslist } = UseFetch(`/product/getallproducts?${query}`)
//   // const { data: servicelist } = UseFetch(`/product/getallServices?${query}`)

//   // NEW: categories only, no branch filter
//   const { data: category } = UseFetch("/inventory/getCategory")
//   const { data: tasklist } = UseFetch("/lead/getAlltasktoTarget")

//   const safeNum = (v) => {
//     const n = Number(v)
//     return Number.isFinite(n) ? n : 0
//   }

//   const recomputeTotalTargetForKey = (splitArray) => {
//     if (!splitArray || !splitArray.length) return 0
//     return splitArray.reduce((sum, user) => {
//       const slabs = user.slabs || []
//       if (!slabs.length) return sum
//       return sum + safeNum(slabs[slabs.length - 1].to)
//     }, 0)
//   }

//   useEffect(() => {
//     if (tasklist && tasklist.length) {
//       const filteredtask = tasklist.filter((item) => {
//         const name = (item.taskName || "").trim().toLowerCase()
//         return item.listed || name === "lead" || name === "closing"
//       })

//       const mapped = filteredtask.map((item) => ({
//         id: item._id,
//         name: item.taskName
//       }))

//       setavailableAllocation(mapped)

//       const followup = mapped.find(
//         (item) => item.name.trim().toLowerCase() === "followup"
//       )
//       if (followup) {
//         setSelectedAllocations((prev) => {
//           const alreadySelected = prev.some((a) => a.id === followup.id)
//           return alreadySelected ? prev : [...prev, followup]
//         })
//       }
//     }
//   }, [tasklist])

//   // init user + branches
//   useEffect(() => {
//     const userData = getLocalStorageItem("user")
//     if (!userData?.selected?.length) return
//     setselectedBranch(userData.selected[0]?.branch_id)
//     const branches = userData.selected.map((branch) => ({
//       id: branch.branch_id,
//       branchName: branch.branchName
//     }))
//     setuserBranches(branches)
//   }, [])

//   // load categories and mirror into productandservices
//   useEffect(() => {
//     if (!category) return
//     setcategoryList(category)
//     setproductsandservices(
//       category.map((c) => ({
//         id: c._id,
//         // use category display field
//         name: c.category || c.categoryName || c.name || "Category",
//         branchIds: [] // categories do not have branch mapping
//       }))
//     )
//   }, [category])

//   // products + services combined – now no-op
//   useEffect(() => {}, [])

//   // users list
//   useEffect(() => {
//     if (!data) return
//     const { allusers = [], allAdmins = [] } = data
//     const combinedUsers = [...allusers, ...allAdmins]
//     const users = combinedUsers
//       .filter(
//         (user) =>
//           Array.isArray(user.selected) &&
//           user.selected.some((sel) => sel.branch_id === selectedBranch)
//       )
//       .map((user) => ({
//         id: user._id,
//         name: user.name,
//         givenTarget: "",
//         achievedTarget: "",
//         slabs: []
//       }))
//     setuserList(users)
//   }, [data, selectedBranch])

//   // default incentive type = amount
//   useEffect(() => {
//     if (!selectedAllocations.length || !productandservices.length) return
//     const updatedEntries = {}
//     productandservices.forEach((product) => {
//       selectedAllocations.forEach((allocationType) => {
//         updatedEntries[`${product.id}-${allocationType.id}-type`] = "amount"
//       })
//     })
//     settargetpriceorPercentageType((prev) => ({ ...prev, ...updatedEntries }))
//   }, [selectedAllocations, productandservices])

//   // categories have no branch filter → show all items
//   const filteredProductsForBranch = productandservices

//   useEffect(() => {
//     setSelectedProducts((prev) =>
//       prev.filter((p) => filteredProductsForBranch.some((fp) => fp.id === p.id))
//     )
//   }, [selectedBranch, productandservices])

//   const getMonthsInRange = () => {
//     const fromIndex = months.indexOf(fromMonth)
//     const toIndex = months.indexOf(toMonth)
//     if (fromIndex === -1 || toIndex === -1 || fromIndex > toIndex) return []
//     return months.slice(fromIndex, toIndex + 1)
//   }

//   const selectedMonths = getMonthsInRange()

//   const handleProductSelection = (product) => {
//     setSelectedProducts((prev) => {
//       const exists = prev.find((p) => p.id === product.id)
//       if (exists) return prev.filter((p) => p.id !== product.id)
//       return [...prev, product]
//     })
//   }

//   const handleAllocationSelection = (allocation) => {
//     setSelectedAllocations((prev) => {
//       const exists = prev.find((a) => a.id === allocation.id)
//       if (exists) return prev.filter((a) => a.id !== allocation.id)
//       return [...prev, allocation]
//     })
//   }

//   const handleRemoveProductRow = (productId) => {
//     setSelectedProducts((prev) => prev.filter((p) => p.id !== productId))

//     setCommittedTargetData((prev) => {
//       const next = { ...prev }
//       Object.keys(next).forEach((key) => {
//         if (key.startsWith(`${productId}-`)) delete next[key]
//       })
//       return next
//     })

//     settargetpriceorpercentageValue((prev) => {
//       const next = { ...prev }
//       Object.keys(next).forEach((key) => {
//         if (key.startsWith(`${productId}-`)) delete next[key]
//       })
//       return next
//     })

//     settargetpriceorPercentageType((prev) => {
//       const next = { ...prev }
//       Object.keys(next).forEach((key) => {
//         if (key.startsWith(`${productId}-`)) delete next[key]
//       })
//       return next
//     })

//     setCommittedSplitData((prev) => {
//       const next = { ...prev }
//       Object.keys(next).forEach((key) => {
//         if (key.startsWith(`${productId}-`)) delete next[key]
//       })
//       return next
//     })

//     setWorkingSplitData((prev) => {
//       const next = { ...prev }
//       Object.keys(next).forEach((key) => {
//         if (key.startsWith(`${productId}-`)) delete next[key]
//       })
//       return next
//     })

//     delete committedProductsRef.current[productId]
//   }

//   const handleIncentiveInput = (productId, allocId, value, type) => {
//     if (type === "type") {
//       settargetpriceorPercentageType((prev) => ({
//         ...prev,
//         [`${productId}-${allocId}-${type}`]: value
//       }))
//     } else {
//       settargetpriceorpercentageValue((prev) => ({
//         ...prev,
//         [`${productId}-${allocId}-${type}`]: value
//       }))
//     }
//   }

//   // ─── Open split modal ────────────────────────────────────────────────────────
//   const openSplitModal = (productId, month, name) => {
//     const Name = name.trim()

//     setrespectedmonthtargetType((prev) => {
//       const updated = { ...prev }
//       selectedMonths.forEach((m) => {
//         const key = `${productId}-${m}`
//         const keyName = `${Name}-${m}`
//         if (!updated[key]) updated[key] = "quantity"
//         if (!updated[keyName]) updated[keyName] = "quantity"
//       })
//       return updated
//     })

//     const committedKey = `${productId}-${month}`
//     const existingCommitted = committedSplitData[committedKey]

//     setWorkingSplitData((prev) => ({
//       ...prev,
//       [committedKey]: existingCommitted
//         ? JSON.parse(JSON.stringify(existingCommitted))
//         : []
//     }))

//     setuserList((prevUsers) =>
//       prevUsers.map((u) => {
//         const userEntry = existingCommitted?.find(
//           (item) => item.userId === u.id
//         )
//         return {
//           ...u,
//           givenTarget: userEntry ? String(userEntry.splitTarget || "") : "",
//           slabs: userEntry ? userEntry.slabs || [] : []
//         }
//       })
//     )

//     setSplitModalData({ productId, month, name })
//     setShowSplitModal(true)
//     setselectedsplitProducts(productId)
//     setselectedsplitmonth(month)
//   }

//   const handleSplitChange = (userId, rawValue) => {
//     const value = safeNum(rawValue)

//     if (message?.[userId]) {
//       setMessage((prev) => ({ ...prev, [userId]: "" }))
//     }

//     const key = `${splitModalData.productId}-${splitModalData.month}`

//     setWorkingSplitData((prev) => {
//       const existingArray = prev[key] || []
//       const idx = existingArray.findIndex((i) => i.userId === userId)
//       let userEntry =
//         idx !== -1
//           ? { ...existingArray[idx] }
//           : { userId, splitTarget: 0, slabs: [] }

//       let slabs = [...(userEntry.slabs || [])]

//       if (!slabs.length) {
//         slabs = [{ from: 0, to: value, amount: "" }]
//       } else {
//         slabs[slabs.length - 1] = { ...slabs[slabs.length - 1], to: value }
//       }

//       userEntry.slabs = slabs
//       userEntry.splitTarget = value

//       const updatedArray =
//         idx !== -1
//           ? existingArray.map((it, i) => (i === idx ? userEntry : it))
//           : [...existingArray, userEntry]

//       setuserList((prevUsers) =>
//         prevUsers.map((u) =>
//           u.id === userId ? { ...u, givenTarget: value.toString(), slabs } : u
//         )
//       )

//       return { ...prev, [key]: updatedArray }
//     })
//   }

//   const handleAddSlab = (userId) => {
//     const key = `${splitModalData.productId}-${splitModalData.month}`

//     const user = userList.find((u) => u.id === userId)
//     const currentInputValue = safeNum(user?.givenTarget)

//     if (!currentInputValue) {
//       setMessage((prev) => ({
//         ...(prev || {}),
//         [userId]: "Please fill the target first"
//       }))
//       return
//     }

//     setWorkingSplitData((prev) => {
//       const existingArray = prev[key] || []
//       const idx = existingArray.findIndex((i) => i.userId === userId)
//       let userEntry =
//         idx !== -1
//           ? { ...existingArray[idx] }
//           : { userId, splitTarget: 0, slabs: [] }

//       const slabs = [...(userEntry.slabs || [])]

//       if (!slabs.length) {
//         slabs.push({ from: 0, to: currentInputValue, amount: "" })
//       } else {
//         const lastTo = safeNum(slabs[slabs.length - 1].to)
//         slabs.push({ from: lastTo, to: currentInputValue, amount: "" })
//       }

//       userEntry.slabs = slabs
//       userEntry.splitTarget = currentInputValue

//       const updatedArray =
//         idx !== -1
//           ? existingArray.map((it, i) => (i === idx ? userEntry : it))
//           : [...existingArray, userEntry]

//       setuserList((prevUsers) =>
//         prevUsers.map((u) => (u.id === userId ? { ...u, slabs } : u))
//       )

//       return { ...prev, [key]: updatedArray }
//     })
//   }

//   const handleRemoveSlab = (userId, slabIndex) => {
//     const key = `${splitModalData.productId}-${splitModalData.month}`

//     setWorkingSplitData((prev) => {
//       const existingArray = prev[key] || []
//       const idx = existingArray.findIndex((i) => i.userId === userId)
//       if (idx === -1) return prev

//       const entry = { ...existingArray[idx] }
//       let slabs = [...(entry.slabs || [])].filter((_, i) => i !== slabIndex)
//       entry.slabs = slabs
//       entry.splitTarget = slabs.length ? safeNum(slabs[slabs.length - 1].to) : 0

//       const updatedArray = existingArray.map((it, i) =>
//         i === idx ? entry : it
//       )

//       setuserList((prevUsers) =>
//         prevUsers.map((u) => (u.id === userId ? { ...u, slabs } : u))
//       )

//       return { ...prev, [key]: updatedArray }
//     })
//   }

//   const handleSlabChange = (userId, slabIndex, field, rawValue) => {
//     const key = `${splitModalData.productId}-${splitModalData.month}`
//     const value = field === "amount" ? rawValue : safeNum(rawValue)

//     setWorkingSplitData((prev) => {
//       const existingArray = prev[key] || []
//       const idx = existingArray.findIndex((i) => i.userId === userId)
//       if (idx === -1) return prev

//       const entry = { ...existingArray[idx] }
//       const slabs = [...(entry.slabs || [])]
//       slabs[slabIndex] = { ...slabs[slabIndex], [field]: value }
//       entry.slabs = slabs
//       if (slabs.length) {
//         entry.splitTarget = safeNum(slabs[slabs.length - 1].to)
//       }

//       const updatedArray = existingArray.map((it, i) =>
//         i === idx ? entry : it
//       )

//       setuserList((prevUsers) =>
//         prevUsers.map((u) => (u.id === userId ? { ...u, slabs } : u))
//       )

//       return { ...prev, [key]: updatedArray }
//     })
//   }

//   const handleCancel = () => {
//     setShowSplitModal(false)
//     setWorkingSplitData({})
//   }
//   const normalizeSlabs = (slabArray) => {
//     return slabArray
//       .map((slab, index) => ({
//         slabOrder: index + 1,
//         fromValue: Number(slab.from) || 0,
//         toValue: Number(slab.to) || 0
//       }))
//       .filter((s) => s.toValue > s.fromValue)
//   }

//   // const handlesaveSplit = () => {
//   //   const { productId, month } = splitModalData
//   //   const key = `${productId}-${month}`
//   //   const workingArray = workingSplitData[key] || []
//   //   const total = recomputeTotalTargetForKey(workingArray)

//   //   const isFirstTime = !committedProductsRef.current[productId]

//   //   setCommittedSplitData((prev) => {
//   //     const next = { ...prev }

//   //     if (isFirstTime) {
//   //       selectedMonths.forEach((m) => {
//   //         next[`${productId}-${m}`] = JSON.parse(JSON.stringify(workingArray))
//   //       })
//   //     } else {
//   //       next[key] = JSON.parse(JSON.stringify(workingArray))
//   //     }

//   //     return next
//   //   })

//   //   setCommittedTargetData((prev) => {
//   //     const next = { ...prev }

//   //     if (isFirstTime) {
//   //       selectedMonths.forEach((m) => {
//   //         next[`${productId}-${m}`] = total
//   //       })
//   //     } else {
//   //       next[key] = total
//   //     }

//   //     return next
//   //   })

//   //   committedProductsRef.current[productId] = true

//   //   setWorkingSplitData({})
//   //   setShowSplitModal(false)
//   // }
//   const handlesaveSplit = () => {
//     if (!splitModalData) return

//     const { categoryId, monthKey, users } = splitModalData
//     // monthKey like "2024-10", or you already have {month,year}

//     const newCommittedSplit = { ...committedSplitData }

//     users.forEach((user) => {
//       const userSlabs =
//         workingSplitData[categoryId]?.[monthKey]?.[user.id] || []
//       const normalized = normalizeSlabs(userSlabs)

//       if (!normalized.length) return

//       if (!newCommittedSplit[categoryId]) newCommittedSplit[categoryId] = {}
//       if (!newCommittedSplit[categoryId][monthKey]) {
//         newCommittedSplit[categoryId][monthKey] = {}
//       }

//       newCommittedSplit[categoryId][monthKey][user.id] = normalized
//     })

//     setCommittedSplitData(newCommittedSplit)

//     // recompute totals (for main table display)
//     const newCommittedTargets = { ...committedTargetData }

//     Object.entries(newCommittedSplit[categoryId] || {}).forEach(
//       ([monthKey, userMap]) => {
//         const totalForMonth = Object.values(userMap).reduce((sum, slabs) => {
//           if (!slabs.length) return sum
//           const top = slabs[slabs.length - 1].toValue
//           return sum + (Number(top) || 0)
//         }, 0)

//         if (!newCommittedTargets[categoryId])
//           newCommittedTargets[categoryId] = {}
//         newCommittedTargets[categoryId][monthKey] = totalForMonth
//       }
//     )

//     setCommittedTargetData(newCommittedTargets)

//     // track that this category has at least one committed split
//     committedProductsRef.current[categoryId] = true

//     setShowSplitModal(false)
//   }
// console.log(periodName)
// const handleSubmitTarget = async () => {
//   setMessage(null);

//   // 1. Build allocations
//   const allocationsPayload = selectedAllocations.map((alloc) => ({
//     allocationId: alloc.id,
//     value: Number(targetpriceorpercentageValue[alloc.id]) || 0
//   }));

//   // 2. Build monthlyTargets from committedSplitData
//   const monthlyTargetsPayload = [];

//   Object.entries(committedSplitData).forEach(
//     ([categoryId, monthsMap]) => {
//       Object.entries(monthsMap).forEach(([monthKey, usersMap]) => {
//         const [yearStr, monthStr] = monthKey.split("-");
//         const month = Number(monthStr);
//         const year = Number(yearStr);

//         const userTargets = Object.entries(usersMap).map(
//           ([userId, slabs]) => ({
//             userId,
//             slabs // already normalized { slabOrder, fromValue, toValue }
//           })
//         );

//         monthlyTargetsPayload.push({
//           month,
//           year,
//           userTargets
//         });
//       });
//     }
//   );

//   const body = {
//     periodName: /* derived from fromMonth/toMonth or input */,
//     startDate: /* first day of fromMonth */,
//     endDate: /* last day of toMonth */,
//     categoryId: /* selected category id, if applicable */,
//     measurementType: /* 'amount' or 'quantity' from UI */,
//     allocations: allocationsPayload,
//     monthlyTargets: monthlyTargetsPayload
//   };

//   try {
//     const token = getLocalStorageItem("token");
// console.log(body)
// return
//     await api.post("/targets", body, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     setMessage("Target configuration saved successfully");
//   } catch (err) {
//     setMessage("Failed to save target configuration");
//   }
// };

//   const handleSubmit = async () => {
//     const formData = {
//       targetData: committedTargetData,
//       targetpriceorPercentageType,
//       targetpriceorpercentageValue,
//       splitData: committedSplitData
//     }
//     console.log(formData)
//     return
//     await api.post("/target/submitTargetRegister", formData)
//   }

//   const modalKey =
//     splitModalData && `${splitModalData.productId}-${splitModalData.month}`
//   const modalWorkingArray = modalKey ? workingSplitData[modalKey] || [] : []
//   const modalTotal = recomputeTotalTargetForKey(modalWorkingArray)
//   const currentType =
//     respectedmonthtargetType?.[
//       `${selectedsplitProducts}-${selectedsplitmonth}`
//     ] || "quantity"
//   const totalLabel =
//     currentType === "quantity"
//       ? `${modalTotal} NO`
//       : `₹ ${modalTotal.toLocaleString("en-IN")}`

//   return (
//     <div className="h-full bg-[#ADD8E6] flex flex-col px-3 py-4 sm:px-5 sm:py-5 overflow-hidden">
//       <div className="mx-auto w-full max-w-6xl flex flex-col flex-1 min-h-0 gap-3">
//         {/* HEADER */}
//         <div className="flex-shrink-0 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white border border-slate-200 rounded-lg px-3 py-3">
//           <div className="space-y-1">
//             <h1 className="text-lg sm:text-xl font-semibold text-slate-900">
//               Target Master
//             </h1>
//             {selectedMonths.length > 0 && (
//               <p className="text-xs text-slate-500">
//                 Period{" "}
//                 <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
//                   {fromMonth} – {toMonth}
//                 </span>
//               </p>
//             )}
//           </div>

//           <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
//             <div className="flex flex-col gap-1">
//               <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
//                 Branch
//               </span>
//               <div className="relative">
//                 <select
//                   value={selectedBranch || ""}
//                   onChange={(e) => setselectedBranch(e.target.value)}
//                   className="h-8 min-w-[150px] rounded-md border border-slate-300 bg-white pr-7 pl-3 text-xs text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
//                 >
//                   {userbranches.map((b) => (
//                     <option key={b.id} value={b.id}>
//                       {b.branchName}
//                     </option>
//                   ))}
//                 </select>
//                 <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
//               </div>
//             </div>

//             <div className="flex flex-col gap-1 mt-2 sm:mt-0">
//               <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
//                 Period
//               </span>
//               <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2 py-1">
//                 <span className="text-[11px] font-medium text-slate-500">
//                   From
//                 </span>
//                 <select
//                   value={fromMonth}
//                   onChange={(e) => setFromMonth(e.target.value)}
//                   className="h-7 rounded-md border border-slate-200 bg-white px-2 pr-6 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/40"
//                 >
//                   {months.map((m) => (
//                     <option key={m}>{m}</option>
//                   ))}
//                 </select>
//                 <span className="text-[11px] font-medium text-slate-500">
//                   To
//                 </span>
//                 <select
//                   value={toMonth}
//                   onChange={(e) => setToMonth(e.target.value)}
//                   className="h-7 rounded-md border border-slate-200 bg-white px-2 pr-6 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/40"
//                 >
//                   {months.map((m) => (
//                     <option key={m}>{m}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ACTIONS */}
//         <div className="flex-shrink-0 flex flex-wrap gap-2">
//           <button
//             onClick={() => setShowProductModal(true)}
//             className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 shadow-sm hover:border-indigo-500 hover:text-indigo-700 hover:shadow focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
//           >
//             <Settings className="h-3.5 w-3.5 text-indigo-500" />
//             Categories ({filteredProductsForBranch.length})
//           </button>
//           <button
//             onClick={() => setShowAllocationModal(true)}
//             className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
//           >
//             <Plus className="h-3.5 w-3.5" />
//             Allocations ({selectedAllocations.length})
//           </button>
//         </div>

//         {/* TABLE CARD */}
//         <div className="flex-1 min-h-0 flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm">
//           <div className="flex-1 min-h-0 overflow-x-auto overflow-y-auto">
//             <table className="w-full min-w-[1100px] border-collapse text-xs">
//               <thead className="sticky top-0 z-10">
//                 <tr className="bg-slate-900">
//                   <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-white border-r border-slate-800">
//                     Products &amp; Services
//                   </th>
//                   <th
//                     colSpan={selectedMonths.length}
//                     className="px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-white border-r border-slate-800"
//                   >
//                     Target
//                   </th>
//                   <th
//                     colSpan={selectedAllocations.length}
//                     className="px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-white"
//                   >
//                     Incentive
//                   </th>
//                 </tr>
//                 <tr className="bg-slate-50">
//                   <th className="px-3 py-1.5 text-left text-[11px] font-medium text-slate-500 border-r border-slate-200"></th>
//                   {selectedMonths.map((month) => (
//                     <th
//                       key={month}
//                       className="px-3 py-1.5 text-center text-[11px] font-medium text-slate-600 border-r border-slate-200 whitespace-nowrap"
//                     >
//                       {month}
//                     </th>
//                   ))}
//                   {selectedAllocations.map((alloc) => (
//                     <th
//                       key={alloc.id}
//                       className="px-3 py-1.5 text-center text-[11px] font-medium text-slate-600 border-r border-slate-200 whitespace-nowrap"
//                     >
//                       {alloc.name}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>

//               <tbody>
//                 {selectedProducts.map((product, idx) => (
//                   <tr
//                     key={product.id}
//                     className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}
//                   >
//                     <td className="px-3 py-2 border-r border-slate-200 text-[13px] font-medium text-slate-900 whitespace-nowrap">
//                       <div className="flex items-center gap-2">
//                         <button
//                           type="button"
//                           onClick={() => handleRemoveProductRow(product.id)}
//                           className="inline-flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 w-5 h-5 text-[10px]"
//                           title="Remove row"
//                         >
//                           ×
//                         </button>
//                         <span>{product.name}</span>
//                       </div>
//                     </td>

//                     {selectedMonths.map((month) => (
//                       <td
//                         key={month}
//                         className="px-2 py-1.5 border-r border-slate-200 align-middle"
//                       >
//                         <div className="flex items-center gap-1">
//                           <input
//                             type="text"
//                             disabled
//                             value={
//                               committedTargetData[`${product.id}-${month}`] ||
//                               ""
//                             }
//                             className="w-20 rounded-md border border-slate-300 bg-slate-50 px-2 py-1 text-[11px] text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500/40"
//                             placeholder="0"
//                           />
//                           <button
//                             type="button"
//                             onClick={() =>
//                               openSplitModal(product.id, month, product.name)
//                             }
//                             className="inline-flex items-center justify-center rounded-full bg-slate-900 p-1 text-white text-[10px] hover:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900/70"
//                             title="Split Target"
//                           >
//                             <Users className="h-3 w-3" />
//                           </button>
//                         </div>
//                       </td>
//                     ))}

//                     {selectedAllocations.map((alloc) => (
//                       <td
//                         key={alloc.id}
//                         className="px-2 py-1.5 border-r border-slate-200 align-middle"
//                       >
//                         <div className="flex items-center gap-1">
//                           <input
//                             type="number"
//                             value={
//                               targetpriceorpercentageValue[
//                                 `${product.id}-${alloc.id}-value`
//                               ] || ""
//                             }
//                             onChange={(e) =>
//                               handleIncentiveInput(
//                                 product.id,
//                                 alloc.id,
//                                 e.target.value,
//                                 "value"
//                               )
//                             }
//                             className="max-w-24 rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
//                             placeholder="0"
//                           />
//                           <div className="relative flex-shrink-0">
//                             <select
//                               value={
//                                 targetpriceorPercentageType[
//                                   `${product.id}-${alloc.id}-type`
//                                 ]
//                               }
//                               onChange={(e) =>
//                                 handleIncentiveInput(
//                                   product.id,
//                                   alloc.id,
//                                   e.target.value,
//                                   "type"
//                                 )
//                               }
//                               className="appearance-none rounded-md border border-slate-300 bg-slate-50 px-2 py-1 pr-6 text-[11px] text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
//                             >
//                               <option value="amount">₹</option>
//                               <option value="percentage">%</option>
//                             </select>
//                             <ChevronDown className="pointer-events-none absolute right-1 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-500" />
//                           </div>
//                         </div>
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="flex-shrink-0 flex justify-end items-center gap-2 border-t border-slate-200 bg-slate-50 px-3 py-2.5">
//             <span className="hidden text-[11px] text-slate-500 sm:inline">
//               Changes apply for selected branch and period.
//             </span>
//             <button
//               onClick={handleSubmitTarget}
//               className="inline-flex items-center rounded-md bg-slate-900 px-4 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/70"
//             >
//               Save Target
//             </button>
//           </div>
//         </div>

//         {/* PRODUCT (CATEGORY) MODAL */}
//         {showProductModal && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
//             <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
//               <div className="px-4 py-3 flex items-center justify-between border-b border-slate-200 bg-slate-50">
//                 <h3 className="text-sm font-semibold text-slate-900">
//                   Select Categories
//                 </h3>
//                 <button
//                   onClick={() => setShowProductModal(false)}
//                   className="rounded-full p-1 text-slate-500 hover:bg-slate-200"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               </div>
//               <div className="p-4 space-y-1 max-h-80 overflow-y-auto">
//                 {filteredProductsForBranch.map((product) => (
//                   <label
//                     key={product.id}
//                     className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-slate-50 cursor-pointer"
//                   >
//                     <input
//                       type="checkbox"
//                       checked={selectedProducts.some(
//                         (p) => p.id === product.id
//                       )}
//                       onChange={() => handleProductSelection(product)}
//                       className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-1 focus:ring-indigo-500"
//                     />
//                     <span className="text-sm text-slate-800">
//                       {product.name}
//                     </span>
//                   </label>
//                 ))}
//                 {filteredProductsForBranch.length === 0 && (
//                   <p className="text-xs text-slate-500 px-2 py-1.5">
//                     No categories found.
//                   </p>
//                 )}
//               </div>
//               <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
//                 <button
//                   onClick={() => setShowProductModal(false)}
//                   className="px-4 py-1.5 bg-indigo-600 text-xs text-white rounded-md hover:bg-indigo-700"
//                 >
//                   Done
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ALLOCATION MODAL */}
//         {showAllocationModal && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
//             <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
//               <div className="px-4 py-3 flex items-center justify-between border-b border-slate-200 bg-slate-50">
//                 <h3 className="text-sm font-semibold text-slate-900">
//                   Select Allocation Types
//                 </h3>
//                 <button
//                   onClick={() => setShowAllocationModal(false)}
//                   className="rounded-full p-1 text-slate-500 hover:bg-slate-200"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               </div>
//               <div className="p-4 space-y-1 max-h-80 overflow-y-auto">
//                 {availableAllocations.map((allocation) => (
//                   <label
//                     key={allocation.id}
//                     className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-slate-50 cursor-pointer"
//                   >
//                     <input
//                       type="checkbox"
//                       checked={selectedAllocations.some(
//                         (a) => a.id === allocation.id
//                       )}
//                       onChange={() => handleAllocationSelection(allocation)}
//                       className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-1 focus:ring-emerald-500"
//                     />
//                     <span className="text-sm text-slate-800">
//                       {allocation.name}
//                     </span>
//                   </label>
//                 ))}
//               </div>
//               <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
//                 <button
//                   onClick={() => setShowAllocationModal(false)}
//                   className="px-4 py-1.5 bg-emerald-600 text-xs text-white rounded-md hover:bg-emerald-700"
//                 >
//                   Done
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* SPLIT TARGET MODAL – your exact UI */}
//         {showSplitModal && splitModalData && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50">
//             <div className="bg-white rounded-xl shadow-2xl w-full flex flex-col overflow-hidden max-h-[90vh]">
//               <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between rounded-t-xl flex-shrink-0">
//                 <div>
//                   <h3 className="text-lg font-semibold text-white">
//                     Split Target
//                   </h3>
//                   <p className="text-sm text-blue-100">
//                     {
//                       productandservices.find(
//                         (p) => p.id === splitModalData.productId
//                       )?.name
//                     }
//                     {" - "}
//                     {splitModalData.month}
//                     {" · "}
//                     <span className="font-semibold">
//                       Total Target: {totalLabel}
//                     </span>
//                   </p>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={handleCancel}
//                   className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               <div className="flex-1 flex flex-col overflow-hidden">
//                 <div className="bg-white sticky top-0 z-10 px-6 py-3 border-b border-gray-200 flex items-center">
//                   <div className="flex items-center gap-2">
//                     <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
//                       Split Type
//                     </label>
//                     <div className="relative">
//                       <select
//                         value={
//                           respectedmonthtargetType?.[
//                             `${selectedsplitProducts}-${selectedsplitmonth}`
//                           ]
//                         }
//                         onChange={(e) =>
//                           setrespectedmonthtargetType((prev) => ({
//                             ...prev,
//                             [`${selectedsplitProducts}-${selectedsplitmonth}`]:
//                               e.target.value
//                           }))
//                         }
//                         className="w-28 px-2 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
//                       >
//                         <option value="quantity">Quantity</option>
//                         <option value="amount">Amount</option>
//                       </select>
//                       <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
//                     </div>
//                   </div>

//                   <div className="flex flex-1 justify-end items-center pr-4">
//                     <p className="text-sm text-gray-700">
//                       <span className="font-semibold">Total Target:</span>{" "}
//                       {totalLabel}
//                     </p>
//                   </div>
//                 </div>

//                 <label className="block text-sm font-medium text-gray-700 px-6 pt-3 pb-1">
//                   Assign to Users
//                 </label>

//                 <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4">
//                   {userList.map((user) => {
//                     const key = `${splitModalData.productId}-${splitModalData.month}`
//                     const userArray = workingSplitData[key] || []
//                     const currentUserData = userArray.find(
//                       (item) => item.userId === user.id
//                     )
//                     const userValue = currentUserData
//                       ? currentUserData.splitTarget || ""
//                       : ""
//                     const userSlabs = currentUserData?.slabs || []

//                     return (
//                       <div
//                         key={user.id}
//                         className="border border-gray-200 rounded-lg p-3 bg-gray-50"
//                       >
//                         <div className="grid grid-cols-[180px,120px,110px,minmax(0,1fr)] gap-2 items-start">
//                           <span className="text-sm font-medium text-gray-700 truncate">
//                             {user.name}
//                           </span>

//                           <div className="flex flex-col">
//                             <input
//                               type="number"
//                               value={userValue || ""}
//                               onChange={(e) =>
//                                 handleSplitChange(user.id, e.target.value)
//                               }
//                               className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                               placeholder="0"
//                             />
//                             {message?.[user.id] && (
//                               <p className="text-red-400 text-xs mt-1">
//                                 {message[user.id]}
//                               </p>
//                             )}
//                           </div>

//                           <button
//                             type="button"
//                             onClick={() => handleAddSlab(user.id)}
//                             className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
//                           >
//                             Add Slab
//                           </button>

//                           <div className="flex flex-wrap gap-2">
//                             {userSlabs.map((slab, index) => (
//                               <div
//                                 key={index}
//                                 className="relative bg-white border border-gray-300 rounded-lg shadow-sm flex-shrink-0"
//                               >
//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     handleRemoveSlab(user.id, index)
//                                   }
//                                   className="absolute -top-2 -right-2 z-10 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
//                                   title="Remove slab"
//                                 >
//                                   <X className="w-3.5 h-3.5" />
//                                 </button>
//                                 <table className="text-xs border-collapse">
//                                   <thead>
//                                     <tr>
//                                       <th className="px-1.5 py-0.5 text-center font-semibold bg-red-100 text-red-800 border-b w-20">
//                                         From
//                                       </th>
//                                       <th className="px-1.5 py-0.5 text-center font-semibold bg-green-100 text-green-800 border-b w-20">
//                                         To
//                                       </th>
//                                       <th className="px-1.5 py-0.5 text-center font-semibold bg-blue-100 text-blue-800 border-b w-20">
//                                         Amount
//                                       </th>
//                                     </tr>
//                                   </thead>
//                                   <tbody>
//                                     <tr>
//                                       <td className="px-1.5 py-1">
//                                         <input
//                                           type="text"
//                                           value={slab.from}
//                                           onChange={(e) =>
//                                             handleSlabChange(
//                                               user.id,
//                                               index,
//                                               "from",
//                                               e.target.value
//                                             )
//                                           }
//                                           className="w-20 px-1.5 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs text-center"
//                                           placeholder="0"
//                                         />
//                                       </td>
//                                       <td className="px-1.5 py-1">
//                                         <input
//                                           type="text"
//                                           value={slab.to}
//                                           onChange={(e) =>
//                                             handleSlabChange(
//                                               user.id,
//                                               index,
//                                               "to",
//                                               e.target.value
//                                             )
//                                           }
//                                           className="w-20 px-1.5 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs text-center"
//                                           placeholder="0"
//                                         />
//                                       </td>
//                                       <td className="px-1.5 py-1">
//                                         <input
//                                           type="number"
//                                           value={slab.amount}
//                                           onChange={(e) =>
//                                             handleSlabChange(
//                                               user.id,
//                                               index,
//                                               "amount",
//                                               e.target.value
//                                             )
//                                           }
//                                           className="w-20 px-1.5 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs text-center"
//                                           placeholder="0"
//                                         />
//                                       </td>
//                                     </tr>
//                                   </tbody>
//                                 </table>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     )
//                   })}
//                 </div>
//               </div>

//               <div className="px-6 py-4 bg-gray-100 rounded-b-xl flex justify-end gap-3 flex-shrink-0">
//                 <button
//                   type="button"
//                   onClick={handleCancel}
//                   className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handlesaveSplit}
//                   className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
//                 >
//                   Save Split
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default TargetRegister

import { useState, useEffect, useRef } from "react"
import { Plus, Settings, Users, X, ChevronDown } from "lucide-react"
import { useSelector } from "react-redux"
import UseFetch from "../../../hooks/useFetch"
import api from "../../../api/api"
import { getLocalStorageItem } from "../../../helper/localstorage"

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
  const currentMonth = new Date().toLocaleString("default", { month: "long" })
  const [fromMonth, setFromMonth] = useState(currentMonth)
  const [toMonth, setToMonth] = useState(currentMonth)
  const [userbranches, setuserBranches] = useState([])
  const [selectedBranch, setselectedBranch] = useState(null)
  const [availableAllocations, setavailableAllocation] = useState([])

  const [selectedProducts, setSelectedProducts] = useState([])
  console.log(selectedProducts)
  const [productandservices, setproductsandservices] = useState([])
  const [categorylist, setcategoryList] = useState([])

  const [respectedmonthtargetType, setrespectedmonthtargetType] = useState({})
  const [selectedsplitProducts, setselectedsplitProducts] = useState(null)
  const [selectedsplitmonth, setselectedsplitmonth] = useState(null)
  const [incentiveWarnings, setIncentiveWarnings] = useState({})
  const [pageMessage, setPageMessage] = useState("")
  const [userMessages, setUserMessages] = useState({})
  const [splitWarnings, setSplitWarnings] = useState({})
  const [selectedAllocations, setSelectedAllocations] = useState([])
  console.log(selectedAllocations)
  const [showProductModal, setShowProductModal] = useState(false)
  const [showAllocationModal, setShowAllocationModal] = useState(false)
  const [showSplitModal, setShowSplitModal] = useState(false)
  const [splitModalData, setSplitModalData] = useState(null)

  const [committedTargetData, setCommittedTargetData] = useState({})

  const [targetpriceorPercentageType, settargetpriceorPercentageType] =
    useState({})
  const [targetpriceorpercentageValue, settargetpriceorpercentageValue] =
    useState({})

  const [workingSplitData, setWorkingSplitData] = useState({})
  const [committedSplitData, setCommittedSplitData] = useState({})
  const [userList, setuserList] = useState([])
  const [periodName, setperiodName] = useState(null)
  console.log(selectedAllocations)
  const committedProductsRef = useRef({})

  const { data } = UseFetch("/auth/getallusers?isVerified=true")
  const { data: target } = UseFetch(
    `/target/getregisteredTarget?periodName=${periodName}`
  )
console.log(periodName)
  console.log(target)
  const loggeduserBranch = useSelector(
    (state) => state.companyBranch.loggeduserbranches
  )
  console.log(months)
  const query = new URLSearchParams({
    branchselectedArray: JSON.stringify(loggeduserBranch)
  }).toString()

  const { data: category } = UseFetch("/inventory/getCategory")
  const { data: tasklist } = UseFetch("/lead/getAlltasktoTarget")
  console.log(tasklist)
  const safeNum = (v) => {
    const n = Number(v)
    return Number.isFinite(n) ? n : 0
  }
  console.log(splitWarnings)
  const recomputeTotalTargetForKey = (splitArray) => {
    if (!splitArray || !splitArray.length) return 0
    return splitArray.reduce((sum, user) => {
      const slabs = user.slabs || []
      if (!slabs.length) return sum
      const lastSlab = slabs[slabs.length - 1]
      return sum + safeNum(lastSlab.toValue ?? lastSlab.to)
    }, 0)
  }

  const isOverlappingPeriod = () => {
    if (!targetArray?.length) return false

    const newStart = buildStartDate()
    const newEnd = buildEndDate()

    return targetArray.some((item) => {
      const existingStart = new Date(item.startDate)
      const existingEnd = new Date(item.endDate)

      return newStart <= existingEnd && newEnd >= existingStart
    })
  }

  const getMonthNumber = (monthName) => months.indexOf(monthName) + 1
  const getCurrentYear = () => new Date().getFullYear()

  const buildPeriodName = () => {
    return `${fromMonth} - ${toMonth} ${getCurrentYear()}`
  }
  console.log(fromMonth)
  console.log(toMonth)
  const buildStartDate = () => {
    return new Date(getCurrentYear(), getMonthNumber(fromMonth) - 1, 1)
  }
  const isValidIncentiveType = (productId, selectedType) => {
    const splitType =
      respectedmonthtargetType?.[`${productId}-${selectedMonths[0]}`] ||
      "quantity"

    if (splitType === "amount" && selectedType !== "percentage") return false
    if (splitType === "quantity" && selectedType !== "amount") return false

    return true
  }

  const buildEndDate = () => {
    return new Date(getCurrentYear(), getMonthNumber(toMonth), 0)
  }
  useEffect(() => {
    const period = buildPeriodName()
    console.log(period)
    setperiodName(period)
  }, [fromMonth, toMonth])
  console.log(periodName)
  console.log(target)
  useEffect(() => {
    if (!target) return
    if (!productandservices.length) return
    if (!availableAllocations.length) return

    const targetArray = Array.isArray(target?.data)
      ? target.data
      : Array.isArray(target)
        ? target
        : target?.data
          ? [target.data]
          : []

    if (!targetArray.length) return
    console.log("hh")
    const nextSelectedProducts = []
    const nextSelectedAllocationsMap = {}
    const nextCommittedTargetData = {}
    const nextCommittedSplitData = {}
    const nextIncentiveValues = {}
    const nextIncentiveTypes = {}
    const nextMonthTypes = {}
    const committedProducts = {}
    console.log(targetArray)
    targetArray.forEach((targetItem) => {
      const categoryId = targetItem.categoryId?._id || targetItem.categoryId
      console.log(targetItem?.categoryId)
      const matchedProduct = productandservices.find(
        (item) => item.id === categoryId
      )
      console.log(categoryId)
      if (
        matchedProduct &&
        !nextSelectedProducts.some((item) => item.id === matchedProduct.id)
      ) {
        nextSelectedProducts.push(matchedProduct)
      }

      ;(targetItem.allocationValues || []).forEach((allocValue) => {
        const allocId = allocValue.allocationId?._id || allocValue.allocationId
        console.log(allocId)
        const matchedAllocation = availableAllocations.find(
          (item) => item.id === allocId
        )

        if (matchedAllocation) {
          nextSelectedAllocationsMap[matchedAllocation.id] = matchedAllocation
        }

        nextIncentiveValues[`${categoryId}-${allocId}-value`] =
          allocValue.value ?? ""

        nextIncentiveTypes[`${categoryId}-${allocId}-type`] = "amount"
      })
      ;(targetItem.monthlyTargets || []).forEach((monthItem) => {
        const monthName = months[Number(monthItem.month) - 1]
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
    console.log(nextSelectedAllocationsMap)
    console.log(nextSelectedAllocationsMap)
    setSelectedProducts(nextSelectedProducts)
    setSelectedAllocations(Object.values(nextSelectedAllocationsMap))
    setCommittedTargetData(nextCommittedTargetData)
    setCommittedSplitData(nextCommittedSplitData)
    settargetpriceorpercentageValue(nextIncentiveValues)
    settargetpriceorPercentageType(nextIncentiveTypes)
    setrespectedmonthtargetType(nextMonthTypes)
    committedProductsRef.current = committedProducts

    const firstTarget = targetArray[0]
    if (firstTarget?.startDate && firstTarget?.endDate) {
      const start = new Date(firstTarget.startDate)
      const end = new Date(firstTarget.endDate)
      setFromMonth(months[start.getMonth()])
      setToMonth(months[end.getMonth()])
    }
  }, [target, productandservices, availableAllocations])
  console.log(tasklist)
  useEffect(() => {
    if (tasklist && tasklist.length) {
      const filteredtask = tasklist.filter((item) => {
        const name = (item.taskName || "").trim().toLowerCase()
        return item.listed || name === "lead" || name === "closing"
      })

      const mapped = filteredtask.map((item) => ({
        id: item._id,
        name: item.taskName
      }))

      setavailableAllocation(mapped)

      const followup = mapped.find(
        (item) => item.name.trim().toLowerCase() === "followup"
      )
      console.log(selectedAllocations)
      if (followup) {
        console.log("hhh")
        setSelectedAllocations((prev) => {
          const alreadySelected = prev.some((a) => a.id === followup.id)
          return alreadySelected ? prev : [...prev, followup]
        })
      }
    }
  }, [tasklist])
  console.log(selectedAllocations)
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

  useEffect(() => {}, [])

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
        updatedEntries[`${product.id}-${allocationType.id}-type`] = "amount"
      })
    })
    settargetpriceorPercentageType((prev) => ({ ...prev, ...updatedEntries }))
  }, [selectedAllocations, productandservices])

  const filteredProductsForBranch = productandservices
  console.log(selectedProducts)
  useEffect(() => {
    console.log(filteredProductsForBranch)
    setSelectedProducts((prev) =>
      prev.filter((p) => filteredProductsForBranch.some((fp) => fp.id === p.id))
    )
  }, [selectedBranch, productandservices])

  const getMonthsInRange = () => {
    const fromIndex = months.indexOf(fromMonth)
    const toIndex = months.indexOf(toMonth)
    if (fromIndex === -1 || toIndex === -1 || fromIndex > toIndex) return []
    return months.slice(fromIndex, toIndex + 1)
  }

  const selectedMonths = getMonthsInRange()
  console.log(selectedMonths)
  const handleProductSelection = (product) => {
    console
    setSelectedProducts((prev) => {
      const exists = prev.find((p) => p.id === product.id)
      if (exists) return prev.filter((p) => p.id !== product.id)
      return [...prev, product]
    })
  }
  const payloads = selectedProducts.map((product) => {
    const allocationsPayload = selectedAllocations.map((alloc) => ({
      allocationId: alloc.id,
      value:
        Number(
          targetpriceorpercentageValue[`${product.id}-${alloc.id}-value`]
        ) || 0,
      mode: targetpriceorPercentageType[`${product.id}-${alloc.id}-type`]
    }))
    console.log(allocationsPayload)
  })
  const handleAllocationSelection = (allocation) => {
    setSelectedAllocations((prev) => {
      const exists = prev.find((a) => a.id === allocation.id)
      if (exists) return prev.filter((a) => a.id !== allocation.id)
      return [...prev, allocation]
    })
  }

  const handleRemoveProductRow = (productId) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId))

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

    setCommittedSplitData((prev) => {
      const next = { ...prev }
      Object.keys(next).forEach((key) => {
        if (key.startsWith(`${productId}-`)) delete next[key]
      })
      return next
    })

    setWorkingSplitData((prev) => {
      const next = { ...prev }
      Object.keys(next).forEach((key) => {
        if (key.startsWith(`${productId}-`)) delete next[key]
      })
      return next
    })

    delete committedProductsRef.current[productId]
  }
  console.log(targetpriceorPercentageType)
  console.log(targetpriceorpercentageValue)
  // const handleIncentiveInput = (productId, allocId, value, type) => {
  //   console.log(type)
  //   if (type === "type") {
  //     settargetpriceorPercentageType((prev) => ({
  //       ...prev,
  //       [`${productId}-${allocId}-${type}`]: value
  //     }))
  //   } else {
  //     settargetpriceorpercentageValue((prev) => ({
  //       ...prev,
  //       [`${productId}-${allocId}-${type}`]: value
  //     }))
  //   }
  // }
  // const handleIncentiveInput = (productId, allocId, value, field) => {
  //   if (field === "type") {
  //     // 🚨 VALIDATION
  //     if (!isValidIncentiveType(productId, value)) {
  //       alert(
  //         `Invalid selection: ${
  //           respectedmonthtargetType?.[`${productId}-${selectedMonths[0]}`] ===
  //           "amount"
  //             ? "Use % for Amount split"
  //             : "Use ₹ for Quantity split"
  //         }`
  //       )
  //       return
  //     }

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
  const handleIncentiveInput = (productId, allocId, value, field) => {
    if (field === "type") {
      const splitType =
        respectedmonthtargetType?.[`${productId}-${selectedMonths[0]}`] ||
        "quantity"

      let message = ""
      console.log(splitType)
      console.log(value)
      if (splitType === "amount" && value !== "percentage") {
        message = "For Amount split, incentive must be %"
      }

      if (splitType === "quantity" && value !== "amount") {
        message = "For Quantity split, incentive must be ₹"
      }

      if (message) {
        console.log(message)
        setIncentiveWarnings((prev) => ({
          ...prev,
          [`${productId}-${allocId}`]: message
        }))
        // ⏳ auto remove after 3 sec
        setTimeout(() => {
          setIncentiveWarnings((prev) => {
            const updated = { ...prev }
            delete updated[`${productId}-${allocId}`]
            return updated
          })
        }, 3000)

        // also update split warning (global sync)
        setSplitWarnings((prev) => ({
          ...prev,
          [`${productId}`]:
            splitType === "amount"
              ? "Split type 'Amount' requires all incentives to be %"
              : "Split type 'Quantity' requires all incentives to be ₹"
        }))

        return
      }

      // ✅ clear both warnings
      setIncentiveWarnings((prev) => ({
        ...prev,
        [`${productId}-${allocId}`]: ""
      }))

      setSplitWarnings((prev) => ({
        ...prev,
        [`${productId}`]: ""
      }))

      settargetpriceorPercentageType((prev) => ({
        ...prev,
        [`${productId}-${allocId}-type`]: value
      }))
    } else {
      settargetpriceorpercentageValue((prev) => ({
        ...prev,
        [`${productId}-${allocId}-value`]: value
      }))
    }
  }
  console.log(targetpriceorpercentageValue)
  console.log(targetpriceorPercentageType)
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

    setWorkingSplitData((prev) => ({
      ...prev,
      [committedKey]: existingCommitted
        ? JSON.parse(JSON.stringify(existingCommitted))
        : []
    }))

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

  const handleSplitChange = (userId, rawValue) => {
    const value = safeNum(rawValue)

    if (userMessages?.[userId]) {
      setUserMessages((prev) => ({ ...prev, [userId]: "" }))
    }

    const key = `${splitModalData.productId}-${splitModalData.month}`

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

  const handleSlabChange = (userId, slabIndex, field, rawValue) => {
    const key = `${splitModalData.productId}-${splitModalData.month}`
    const value = field === "amount" ? rawValue : safeNum(rawValue)

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

  console.log(splitWarnings[selectedsplitProducts])
  console.log(splitWarnings)
  console.log(incentiveWarnings)
  const handleCancel = () => {
    // setSplitWarnings
    setSplitWarnings((prev) => ({
      ...prev,
      [selectedsplitProducts]: ""
    }))
    setShowSplitModal(false)
    setWorkingSplitData({})
    setUserMessages({})
  }

  const normalizeSlabs = (slabArray = []) => {
    return slabArray
      .map((slab, index) => ({
        slabOrder: index + 1,
        fromValue: Number(slab.from) || 0,
        toValue: Number(slab.to) || 0
      }))
      .filter((s) => s.toValue > s.fromValue)
  }

  const handlesaveSplit = () => {
    if (!splitModalData) return

    const { productId, month } = splitModalData
    const key = `${productId}-${month}`
    const workingArray = workingSplitData[key] || []

    const normalizedArray = workingArray
      .map((userEntry) => ({
        userId: userEntry.userId,
        splitTarget: Number(userEntry.splitTarget) || 0,
        slabs: normalizeSlabs(userEntry.slabs || [])
      }))
      .filter((userEntry) => userEntry.slabs.length > 0)

    const total = normalizedArray.reduce((sum, user) => {
      if (!user.slabs.length) return sum
      return sum + Number(user.slabs[user.slabs.length - 1].toValue || 0)
    }, 0)

    const isFirstTime = !committedProductsRef.current[productId]

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
  console.log(targetpriceorpercentageValue)
  console.log(targetpriceorpercentageValue)
  const handleSubmitTarget = async () => {
    try {
      if (isOverlappingPeriod()) {
        setPageMessage("Target already exists for this period range")
        return
      }
      setPageMessage("")

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
      const periodName = buildPeriodName()

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
                  toValue: Number(slab.toValue ?? slab.to) || 0
                }))
                .filter((slab) => slab.toValue > slab.fromValue)
            }))
            .filter((u) => u.slabs.length > 0)

          return {
            month: monthNumber,
            year: getCurrentYear(),
            userTargets
          }
        })

        return {
          periodName,
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

      const token = getLocalStorageItem("token")
      console.log(payloads)

      await Promise.all(
        payloads.map((body) =>
          api.post("/target/createOrUpdateTargetConfiguration", body, {
            headers: { Authorization: `Bearer ${token}` }
          })
        )
      )
      setPageMessage(
        isUpdateMode
          ? "Target configuration updated successfully"
          : "Target configuration saved successfully"
      )
    } catch (err) {
      console.error(err)
      setPageMessage(
        err?.response?.data?.message || "Failed to save target configuration"
      )
    }
  }
  const targetArray = Array.isArray(target?.data)
    ? target.data
    : Array.isArray(target)
      ? target
      : target?.data
        ? target.data
        : []
console.log(target)
console.log(targetArray)
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
          Number(mt.year) === Number(getCurrentYear()) &&
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

  return (
    <div className="h-full bg-[#ADD8E6] flex flex-col px-3 py-4 sm:px-5 sm:py-5 overflow-hidden">
      <div className="mx-auto w-full max-w-6xl flex flex-col flex-1 min-h-0 gap-3">
        <div className="flex-shrink-0 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white border border-slate-200 rounded-lg px-3 py-3">
          <div className="space-y-1">
            <h1 className="text-lg sm:text-xl font-semibold text-slate-900">
              Target Master
            </h1>
            {selectedMonths.length > 0 && (
              <p className="text-xs text-slate-500">
                Period{" "}
                <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
                  {fromMonth} – {toMonth}
                </span>
              </p>
            )}
            {pageMessage && (
              <p className="text-xs font-medium text-rose-600">{pageMessage}</p>
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

            <div className="flex flex-col gap-1 mt-2 sm:mt-0">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Period
              </span>
              <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2 py-1">
                <span className="text-[11px] font-medium text-slate-500">
                  From
                </span>
                <select
                  value={fromMonth}
                  onChange={(e) => {
                    setFromMonth(e.target.value)
                    setSelectedProducts([])
                    setSelectedAllocations([])
                    setCommittedTargetData({})
                    setCommittedSplitData({})
                    settargetpriceorPercentageType({})
                    settargetpriceorpercentageValue({})
                    setrespectedmonthtargetType({})
                  }}
                  className="h-7 rounded-md border border-slate-200 bg-white px-2 pr-6 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/40"
                >
                  {months.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
                <span className="text-[11px] font-medium text-slate-500">
                  To
                </span>
                <select
                  value={toMonth}
                  onChange={(e) => {
                    setToMonth(e.target.value)
                    setSelectedProducts([])
                    setSelectedAllocations([])
                    setCommittedTargetData([])
                    setCommittedSplitData([])
                    settargetpriceorPercentageType([])
                    settargetpriceorpercentageValue([])
                    setrespectedmonthtargetType([])
                  }}
                  className="h-7 rounded-md border border-slate-200 bg-white px-2 pr-6 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/40"
                >
                  {months.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
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
                    colSpan={selectedMonths?.length}
                    className="px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-white border-r border-slate-800"
                  >
                    Target
                  </th>
                  <th
                    colSpan={selectedAllocations?.length}
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
                  {selectedAllocations?.map((alloc) => (
                    <th
                      key={alloc.id}
                      className="px-3 py-1.5 text-center text-[11px] font-medium text-slate-600 border-r border-slate-200 whitespace-nowrap"
                    >
                      {alloc.name}
                    </th>
                  ))}
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
                            className="w-20 rounded-md border border-slate-300 bg-slate-50 px-2 py-1 text-[11px] text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500/40"
                            placeholder="0"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              openSplitModal(product.id, month, product.name)
                            }
                            className="inline-flex items-center justify-center rounded-full bg-slate-900 p-1 text-white text-[10px] hover:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900/70"
                            title="Split Target"
                          >
                            <Users className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                    ))}

                    {/* {selectedAllocations.map((alloc) => (
                      <td
                        key={alloc.id}
                        className="px-2 py-1.5 border-r border-slate-200 align-middle"
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
                            className="max-w-24 rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                            placeholder="0"
                          />
                          <div className="relative flex-shrink-0">
                            <select
                              value={
                                targetpriceorPercentageType[
                                  `${product.id}-${alloc.id}-type`
                                ] || "amount"
                              }
                              onChange={(e) =>
                                handleIncentiveInput(
                                  product.id,
                                  alloc.id,
                                  e.target.value,
                                  "type"
                                )
                              }
                              className="appearance-none rounded-md border border-slate-300 bg-slate-50 px-2 py-1 pr-6 text-[11px] text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                            >
                              <option value="amount">₹</option>
                              <option value="percentage">%</option>
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-1 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-500" />
                          </div>
                        </div>
                      </td>
                    ))} */}
                    {selectedAllocations.map((alloc) => {
                      const key = `${product.id}-${alloc.id}`

                      return (
                        <td
                          key={alloc.id}
                          className="px-2 py-1.5 border-r border-slate-200 align-middle"
                        >
                          <div className="flex flex-col">
                            {/* INPUT + SELECT */}
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
                                  handleIncentiveInput(
                                    product.id,
                                    alloc.id,
                                    e.target.value,
                                    "type"
                                  )
                                }
                                className="rounded-md border border-slate-300 px-2 py-1 text-[11px]"
                              >
                                <option value="amount">₹</option>
                                <option value="percentage">%</option>
                              </select>
                            </div>

                            {/* 🔴 WARNING MESSAGE */}
                            {incentiveWarnings[key] && (
                              <p className="text-[10px] text-red-500 mt-1">
                                {incentiveWarnings[key]}
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
                        1 + selectedMonths.length + selectedAllocations.length
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
              className="inline-flex items-center rounded-md bg-slate-900 px-4 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/70"
            >
              {isUpdateMode ? "Update Target" : "Save Target"}
            </button>
          </div>
        </div>

        {showProductModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
              <div className="px-4 py-3 flex items-center justify-between border-b border-slate-200 bg-slate-50">
                <h3 className="text-sm font-semibold text-slate-900">
                  Select Categories
                </h3>
                <button
                  onClick={() => {
                    setSplitWarnings((prev) => ({
                      ...prev,
                      [selectedsplitProducts]: ""
                    }))
                    setShowProductModal(false)
                  }}
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
                        (p) => p.id === product.id
                      )}
                      onChange={() => handleProductSelection(product)}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-1 focus:ring-indigo-500"
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
                        (a) => a.id === allocation.id
                      )}
                      onChange={() => handleAllocationSelection(allocation)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-1 focus:ring-emerald-500"
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
                        onChange={(e) => {
                          const newType = e.target.value
                          const productId = selectedsplitProducts

                          // check existing incentive types
                          const invalidAlloc = selectedAllocations.find(
                            (alloc) => {
                              const incentiveType =
                                targetpriceorPercentageType[
                                  `${productId}-${alloc.id}-type`
                                ] || "amount"

                              if (
                                newType === "amount" &&
                                incentiveType !== "percentage"
                              )
                                return true
                              if (
                                newType === "quantity" &&
                                incentiveType !== "amount"
                              )
                                return true

                              return false
                            }
                          )

                          if (invalidAlloc) {
                            setSplitWarnings((prev) => ({
                              ...prev,
                              [`${productId}`]:
                                newType === "amount"
                                  ? "Split type 'Amount' requires all incentives to be %"
                                  : "Split type 'Quantity' requires all incentives to be ₹"
                            }))
                            return
                          }

                          // ✅ clear warning
                          setSplitWarnings((prev) => ({
                            ...prev,
                            [`${productId}`]: ""
                          }))

                          // ✅ apply SAME split type for all months
                          setrespectedmonthtargetType((prev) => {
                            const updated = { ...prev }
                            selectedMonths.forEach((m) => {
                              updated[`${productId}-${m}`] = newType
                            })
                            return updated
                          })
                        }}
                        // onChange={(e) => {
                        //   const newType = e.target.value

                        //   setrespectedmonthtargetType((prev) => {
                        //     const updated = { ...prev }

                        //     // apply SAME type to ALL months of that product
                        //     selectedMonths.forEach((m) => {
                        //       updated[`${selectedsplitProducts}-${m}`] = newType
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
                    const currentUserData = userArray.find(
                      (item) => item.userId === user.id
                    )
                    const userValue = currentUserData
                      ? currentUserData.splitTarget || ""
                      : ""
                    const userSlabs = currentUserData?.slabs || []

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
