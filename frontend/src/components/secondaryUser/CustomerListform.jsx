// import { useState, useEffect, useRef, useMemo } from "react"
// import { BarLoader } from "react-spinners"
// import ExcelJS from "exceljs"
// import { saveAs } from "file-saver"
// import api from "../../api/api"
// import { CustomSelect } from "../common/CustomSelect"
// import { getLocalStorageItem } from "../../helper/localstorage"
// import { CiEdit } from "react-icons/ci"
// import { PropagateLoader } from "react-spinners"
// import { useNavigate } from "react-router-dom"
// import UseFetch from "../../hooks/useFetch"
// import debounce from "lodash.debounce"
// import ClipLoader from "react-spinners/ClipLoader"
// import TooltipIcon from "../TooltipIcon"
// import BranchDropdown from "../primaryUser/BranchDropdown"
// import { useInfiniteQuery } from "@tanstack/react-query"
// import {
//   FaUserPlus,
//   FaRegFileExcel,
//   FaFilePdf,
//   FaPrint,
//   FaHourglassHalf,
//   FaExclamationTriangle
// } from "react-icons/fa"

// const CustomerListform = () => {
//   const navigate = useNavigate()
//   // const tableContainerRef = useRef(null) // Ref to track table container scrolling

//   const [searchTerm, setsearchTerm] = useState("")
//   const [pages, setPages] = useState(1)
//   const [selectedstatus, setselectedStatus] = useState("Allcustomers")
//   const [tableHeight, setTableHeight] = useState("auto")
//   const [customerCount, setcustomerCount] = useState(0)
//   const [statusfilteredCustomer, setstatusfilteredcustomer] = useState([])
//   const [showFullAddress, setShowFullAddress] = useState({})
//   const [showFullEmail, setShowFullEmail] = useState({})
//   const [searchAfterData, setAfterSearchData] = useState([])
//   const [alldata, setalldata] = useState([])
//   const [user, setUser] = useState(null)
//   const [selectedBranch, setselectedBranch] = useState(null)
//   const [userBranches, setuserBranches] = useState([])
//   const [userRole, setUserRole] = useState(null)
//   const [apiSearchTerm, setApiSearchTerm] = useState("") // only when we want API call
//   const headerRef = useRef(null)
//   const [productType, setproductType] = useState("Product")
//   const scrollTriggeredRef = useRef(false)
//   const containerRef = useRef(null)
//   const firstLoad = useRef(true)
//   const hasLoadedEmpty = useRef(false)

//   const fetchCustomers = async ({ pageParam = 1, queryKey }) => {
//     const [_key, { branch, search, status }] = queryKey
//     const res = await api.get(
//       `/customer/getcust?limit=100&page=${pageParam}&search=${search}&loggeduserBranches=${branch}&customerType=${status}`
//     )

//     return res.data.data
//   }
//   const { data: dupi } = UseFetch("/customer/duplicate")
//   const { data: unwanted } = UseFetch("/customer/getunwanted")

//   const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
//     useInfiniteQuery({
//       queryKey: [
//         "customers",
//         {
//           branch: selectedBranch,
//           search: apiSearchTerm,
//           status: selectedstatus
//         }
//       ],
//       queryFn: fetchCustomers,
//       getNextPageParam: (lastPage, allPages) =>
//         lastPage.customers.length === 100 ? allPages.length + 1 : undefined,
//       enabled: !!selectedBranch
//     })
//   //intialize user
//   useEffect(() => {
//     const userData = getLocalStorageItem("user")
//     if (userData?.selected?.[0]) {
//       setselectedBranch(userData.selected[0].branch_id)
//       userData.selected.forEach((branch) => {
//         setuserBranches((prev) => [
//           ...prev,
//           {
//             id: branch.branch_id,
//             branchName: branch.branchName
//           }
//         ])
//       })
//       setUser(userData)

//       if (userData && userData.role) {
//         setUserRole(userData.role.toLowerCase())
//       } else {
//         setUserRole(null) // Handle case where user or role doesn't exist
//       }
//     }
//   }, [])

//   useEffect(() => {
//     if (headerRef.current) {
//       const headerHeight = headerRef.current.getBoundingClientRect().height
//       setTableHeight(`calc(60vh - ${headerHeight}px)`) // Subtract header height from full viewport height
//     }
//   }, [])

//   useEffect(() => {
//     if (data?.pages?.length) {
//       // all pages combined
//       const allCustomers = data.pages.flatMap((page) => page.customers)

//       const filteredCustomers = allCustomers.map((customer) => ({
//         ...customer,
//         selected: (customer.selected || []).filter(
//           (item) =>
//             !item.productorservicetype ||
//             item.productorservicetype === "Primaryproduct"
//         )
//       }))
//       console.log(filteredCustomers)
//       setAfterSearchData(filteredCustomers)
//       setAfterSearchData(filteredCustomers)
//       setcustomerCount(data.pages[0].selectedbranchCustomercount || 0)
//     }
//   }, [data])
//   const handleScroll = () => {
//     const container = containerRef.current
//     if (!container) return
//     const { clientHeight, scrollHeight, scrollTop } = container
//     if (
//       scrollTop / (scrollHeight - clientHeight) >= 0.9 &&
//       hasNextPage &&
//       !isFetchingNextPage
//     ) {
//       fetchNextPage()
//     }
//   }

//   //Handle search with lodash debounce to optimize search performance
//   const handleSearch = debounce((query) => {
//     const term = query.trim().toLowerCase()
//     setsearchTerm(query)

//     setPages(1)
//     if (!query) {
//       setApiSearchTerm("")
//       setAfterSearchData(alldata)

//       return
//     }

//     // 1️⃣ check locally first
//     const localMatches = alldata.filter(
//       (cust) =>
//         cust.customerName?.toLowerCase().includes(term) ||
//         cust.mobile?.toLowerCase().includes(term) ||
//         cust.selected?.some((sel) =>
//           sel.licensenumber?.toString().toLowerCase().includes(term)
//         )
//     )

//     if (localMatches.length > 0) {
//       setAfterSearchData(localMatches)
//       setcustomerCount(localMatches.length)
//     } else {
//       // 2️⃣ only here trigger API
//       setApiSearchTerm(query) // 👈 not searchTerm
//       setAfterSearchData([])
//       // setalldata([])
//     }
//   }, 600)
//   const handleBranchChange = (e) => {
//     setselectedBranch(e)
//   }

//   const handleChange = (e) => handleSearch(e.target.value)

//   // Function to toggle showing full address
//   const handleShowMoreAddress = (customerId) => {
//     setShowFullAddress((prevState) => ({
//       ...prevState,
//       [customerId]: !prevState[customerId] // Toggle the state for the specific customer
//     }))
//   }
//   //Function to toggle showing full email
//   const handleShowMoreEmail = (customerId) => {
//     setShowFullEmail((prevState) => ({
//       ...prevState,
//       [customerId]: !prevState[customerId] //Toggle the state for the specific customer
//     }))
//   }

//   const truncateAddress = (address) => {
//     const maxLength = 20 // Define how many characters to show before truncating
//     return address?.length > maxLength
//       ? `${address?.slice(0, maxLength)}...`
//       : address
//   }

//   const handleDownload = async () => {
//     const response = await api.get(
//       `/customer/downloadcustomerlistexcel?customerType=${selectedstatus}&branchselected=${selectedBranch}&searchTerm=${apiSearchTerm}`
//     )
//     const data = response.data.data

//     const workbook = new ExcelJS.Workbook()
//     const worksheet = workbook.addWorksheet("Customer List")

//     // Determine heading and filename based on selectedstatus
//     let headingText = ""
//     let fileName = ""

//     switch (selectedstatus) {
//       case "Allcustomers":
//         headingText = "All Customers"
//         fileName = "AllCustomers_Report.xlsx"
//         break
//       case "ProductMissing":
//         headingText = "Product Missing Customers"
//         fileName = "ProductMissing_Customers.xlsx"
//         break
//       case "ProductinfoMissing":
//         headingText = "Product Info Missing Customers"
//         fileName = "ProductInfoMissing_Customers.xlsx"
//         break
//       case "Running":
//         headingText = "Running Customers"
//         fileName = "Running_Customers.xlsx"
//         break
//       case "Deactive":
//         headingText = "Deactive Customer List"
//         fileName = "DeactiveCustomerList_Report.xlsx"
//         break
//       default:
//         headingText = "Customer Report"
//         fileName = "Customer_Report.xlsx"
//     }

//     // --- Add heading row (Row 1) ---
//     worksheet.mergeCells("A1:I1")
//     const headingCell = worksheet.getCell("A1")
//     headingCell.value = headingText
//     headingCell.font = { size: 18, bold: true, color: { argb: "FFFFFFFF" } }
//     headingCell.alignment = { horizontal: "center", vertical: "middle" }
//     headingCell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "FF305496" } // Dark blue background
//     }
//     worksheet.getRow(1).height = 30

//     // --- Add a blank row for spacing (Row 2) ---
//     worksheet.addRow([])

//     // --- Define columns (Header Row = Row 3) ---
//     worksheet.columns = [
//       { header: "BRANCH NAME", key: "branchName", width: 20 },
//       { header: "CUSTOMER NAME", key: "customerName", width: 25 },
//       { header: "PRODUCT NAME", key: "productName", width: 20 },
//       { header: "LICENSE NO", key: "licenseNo", width: 18 },
//       { header: "ADDRESS", key: "address", width: 40 },
//       { header: "PINCODE", key: "pincode", width: 10 },
//       { header: "MOBILE", key: "mobile", width: 15 },
//       { header: "EMAIL", key: "email", width: 35 },
//       { header: "STATUS", key: "status", width: 12 }
//     ]

//     // --- Style header row (Row 3) ---
//     const headerRow = worksheet.getRow(3)
//     headerRow.eachCell((cell) => {
//       cell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: "FF4472C4" } // Medium blue
//       }
//       cell.font = { bold: true, color: { argb: "FFFFFFFF" } }
//       cell.alignment = {
//         horizontal: "center",
//         vertical: "middle",
//         wrapText: true
//       }
//       cell.border = {
//         top: { style: "thin" },
//         left: { style: "thin" },
//         bottom: { style: "thin" },
//         right: { style: "thin" }
//       }
//     })
//     headerRow.height = 22

//     // --- Add data rows (start from Row 4) ---
//     data.forEach((customer) => {
//       const row = worksheet.addRow({
//         branchName: customer.branchName,
//         customerName: customer.customerName,
//         productName: customer.productName,
//         licenseNo: customer.licenseNo,
//         address: customer.address,
//         pincode: customer.pincode,
//         mobile: customer.mobile,
//         email: customer.email,
//         status: customer.status
//       })

//       row.eachCell((cell, colNumber) => {
//         const key = worksheet.columns[colNumber - 1].key

//         // Wrap long text for address/email/name
//         if (["address", "email", "customerName"].includes(key)) {
//           cell.alignment = { wrapText: true, vertical: "top" }
//         } else {
//           cell.alignment = { horizontal: "center", vertical: "middle" }
//         }

//         // Border
//         cell.border = {
//           top: { style: "thin" },
//           left: { style: "thin" },
//           bottom: { style: "thin" },
//           right: { style: "thin" }
//         }

//         // Zebra stripe
//         if (row.number % 2 === 0) {
//           cell.fill = {
//             type: "pattern",
//             pattern: "solid",
//             fgColor: { argb: "FFF2F2F2" }
//           }
//         }
//       })
//     })

//     // --- Adjust row height for readability ---
//     worksheet.eachRow((row, rowNumber) => {
//       if (rowNumber > 3) {
//         row.height = 30
//       }
//     })

//     // --- Export file ---
//     const buffer = await workbook.xlsx.writeBuffer()
//     const blob = new Blob([buffer], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     })
//     saveAs(blob, fileName)
//   }

//   return (
//     <div className="h-full overflow-hidden bg-[#ADD8E6]">
//       {/* {scrollLoading && (
//         <BarLoader
//           cssOverride={{ width: "100%", height: "4px" }}
//           color="#4A90E2"
//         />
//       )} */}

//       <div className="w-full shadow-lg rounded p-8 h-full flex flex-col">
//         {/* Sticky Header Section */}
//        <div className="shrink-0 bg-white px-4 lg:px-6 xl:px-8">
//   <div className="mb-3 flex items-center justify-between gap-3">
//     <h3 className="text-2xl font-bold text-black">
//       {selectedstatus === "ProductinfoMissing"
//         ? "Product Details Missing Customer List"
//         : selectedstatus === "ProductMissing"
//           ? "Product Missing Customer List"
//           : selectedstatus === "Deactive"
//             ? "Deactive Customer List"
//             : selectedstatus === "Running"
//               ? "Active Customer List"
//               : "Customer List"}
//     </h3>

//     <div className="relative w-full max-w-md mt-1">
//       <input
//         type="text"
//         onChange={handleChange}
//         className="w-full rounded-full border border-gray-300 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//         placeholder="Search for..."
//       />
//     </div>
//   </div>

//   <hr className="mb-3 border-t border-gray-300" />

//   <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
//     <div className="flex flex-wrap items-center gap-2">
//       <TooltipIcon
//         icon={FaUserPlus}
//         tooltip="Add Customer"
//         to={
//           user?.role === "Admin"
//             ? "/admin/masters/customerRegistration"
//             : "/staff/masters/customerRegistration"
//         }
//       />

//       {userRole === "admin" && (
//         <TooltipIcon
//           icon={FaRegFileExcel}
//           tooltip="Excel Download"
//           button
//           onClick={handleDownload}
//         />
//       )}

//       <TooltipIcon icon={FaFilePdf} tooltip="PDF Download" button />
//       <TooltipIcon icon={FaPrint} tooltip="Print" button />

//       <BranchDropdown
//         branches={userBranches}
//         onBranchChange={handleBranchChange}
//         branchSelected={selectedBranch}
//         className="w-[180px]"
// label="Branch"
// labletrue
//       />

// <div className="flex flex-col gap-1">
//   <label
//     htmlFor="customer-status"
//     className="text-[10px] font-medium uppercase text-slate-500"
//   >
//     Customer Status
//   </label>

//   <select
//     id="customer-status"
//     value={selectedstatus}
//     onChange={(e) => {
//       setselectedStatus(e.target.value)
//       setAfterSearchData([])
//     }}
//     className="h-8 min-w-[170px] rounded-xl border border-slate-200 bg-white px-3 text-[12px] font-medium text-slate-700 shadow-sm outline-none"
//   >
//     <option value="Allcustomers">All Customer</option>
//     <option value="Running">Running</option>
//     <option value="Deactive">Deactive</option>
//     <option value="ProductinfoMissing">Product Info Missing</option>
//     <option value="ProductMissing">Product Missing</option>
//   </select>
// </div>

//       <CustomSelect
//         value={productType}
//         onChange={(value) => setproductType(value)}
//         options={[
//           { label: "Product" },
//           { label: "Additional Service" }
//         ]}
//         className="w-[180px]"
// label="Product Type"
// labletrue
//       />
//     </div>

//     <div className="rounded-lg bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-800">
//       Total: {customerCount}
//     </div>
//   </div>
// </div>

//         {/* Scrollable Table Section */}
//         <div className="flex-1 overflow-hidden">
//           <div
//             onScroll={handleScroll}
//             ref={containerRef}
//             className="h-full overflow-y-auto overflow-x-auto rounded-lg border border-gray-200"
//           >
//             <table className="min-w-full bg-white">
//               <thead className="bg-gray-50 sticky top-0 z-10">
//                 <tr className="text-nowrap">
//                   <th className="py-3 px-4 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     S.NO
//                   </th>
//                   <th className="py-3 px-4 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-nowrap">
//                     Branch Name
//                   </th>
//                   <th className="py-3 px-4 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Customer Name
//                   </th>
//                   <th className="py-3 px-4 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-nowrap">
//                     Product Name
//                   </th>
//                   <th className="py-3 px-4 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     License
//                   </th>
//                   <th className="py-3 px-4 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Address
//                   </th>
//                   <th className="py-3 px-4 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Pin Code
//                   </th>
//                   <th className="py-3 px-4 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Mobile
//                   </th>
//                   <th className="py-3 px-4 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Email
//                   </th>
//                   <th className="py-3 px-4 border-b border-gray-300 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="py-3 px-4 border-b border-gray-300 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {searchAfterData && searchAfterData.length > 0 ? (
//                   searchAfterData.map((customer, index) => {
//                     //listing of productmissing customers
//                     if (!customer.selected || customer.selected.length === 0) {
//                       return (
//                         <tr
//                           key={customer._id}
//                           className="hover:bg-gray-50 transition-colors"
//                         >
//                           <td className="px-4 py-3 text-sm text-gray-900">
//                             {index + 1}
//                           </td>
//                           <td className="px-4 py-3 text-sm text-gray-900">-</td>
//                           <td className="px-4 py-3 text-sm text-gray-900 font-medium uppercase">
//                             {customer?.customerName}
//                           </td>
//                           <td className="px-4 py-3 text-sm text-red-600">
//                             Missing Product
//                           </td>
//                           <td className="px-4 py-3 text-sm text-gray-900 font-mono">
//                             -
//                           </td>
//                           <td className="px-4 py-3 text-sm text-gray-900 max-w-xs">
//                             {showFullAddress[customer?._id] ? (
//                               <span>
//                                 {customer?.address1}{" "}
//                                 <button
//                                   onClick={() =>
//                                     handleShowMoreAddress(customer?._id)
//                                   }
//                                   className="text-blue-600 hover:text-blue-800 font-medium"
//                                 >
//                                   Show less
//                                 </button>
//                               </span>
//                             ) : (
//                               <span>
//                                 {truncateAddress(customer?.address1)}{" "}
//                                 {customer?.address1?.length > 20 && (
//                                   <button
//                                     onClick={() =>
//                                       handleShowMoreAddress(customer?._id)
//                                     }
//                                     className="text-blue-600 hover:text-blue-800 font-medium"
//                                   >
//                                     ...more
//                                   </button>
//                                 )}
//                               </span>
//                             )}
//                           </td>
//                           <td className="px-4 py-3 text-sm text-gray-900">
//                             {customer?.pincode}
//                           </td>
//                           <td className="px-4 py-3 text-sm text-gray-900">
//                             {customer?.mobile}
//                           </td>
//                           <td className="px-4 py-3 text-sm text-gray-900">
//                             {showFullEmail[customer?._id] ? (
//                               <span>
//                                 {customer?.email}{" "}
//                                 <button
//                                   onClick={() =>
//                                     handleShowMoreEmail(customer?._id)
//                                   }
//                                   className="text-blue-600 hover:text-blue-800 font-medium"
//                                 >
//                                   Show less
//                                 </button>
//                               </span>
//                             ) : (
//                               <span>
//                                 {truncateAddress(customer?.email)}{" "}
//                                 {customer?.email?.length > 20 && (
//                                   <button
//                                     onClick={() =>
//                                       handleShowMoreEmail(customer?._id)
//                                     }
//                                     className="text-blue-600 hover:text-blue-800 font-medium"
//                                   >
//                                     ...more
//                                   </button>
//                                 )}
//                               </span>
//                             )}
//                           </td>
//                           <td className="px-4 py-3 text-sm">
//                             <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
//                               No Status
//                             </span>
//                           </td>
//                           <td className="px-4 py-3">
//                             <div className="flex justify-center items-center">
//                               <CiEdit
//                                 onClick={() =>
//                                   navigate(
//                                     userRole === "admin"
//                                       ? "/admin/masters/customerEdit"
//                                       : "/staff/masters/customerEdit",
//                                     {
//                                       state: { customerId: customer._id }
//                                     }
//                                   )
//                                 }
//                                 className="cursor-pointer text-blue-600 hover:text-blue-800 transition-colors text-xl md:text-2xl"
//                                 title="Edit Customer"
//                               />
//                             </div>
//                           </td>
//                         </tr>
//                       )
//                     }
//                     return customer.selected.map((item, itemIndex) => (
//                       <tr
//                         key={`${customer._id}-${item.licensenumber}-${itemIndex}`}
//                         className="hover:bg-gray-50 transition-colors"
//                       >
//                         <td className="px-4 py-3 text-sm text-gray-900">
//                           {itemIndex === 0 ? index + 1 : ""}
//                         </td>
//                         <td className="px-4 py-3 text-sm text-gray-900">
//                           {item?.branch_id?.branchName}
//                         </td>
//                         <td className="px-4 py-3 text-sm text-gray-900 font-medium uppercase">
//                           {customer?.customerName}
//                         </td>
//                         <td className="px-4 py-3 text-sm text-gray-900">
//                           {item?.productName}
//                         </td>
//                         <td className="px-4 py-3 text-sm text-gray-900 font-mono">
//                           {item?.licensenumber}
//                         </td>
//                         <td className="px-4 py-3 text-sm text-gray-900 max-w-xs">
//                           {showFullAddress[customer?._id] ? (
//                             <span>
//                               {customer?.address1}{" "}
//                               <button
//                                 onClick={() =>
//                                   handleShowMoreAddress(customer?._id)
//                                 }
//                                 className="text-blue-600 hover:text-blue-800 font-medium"
//                               >
//                                 Show less
//                               </button>
//                             </span>
//                           ) : (
//                             <span>
//                               {truncateAddress(customer?.address1)}{" "}
//                               {customer?.address1?.length > 20 && (
//                                 <button
//                                   onClick={() =>
//                                     handleShowMoreAddress(customer?._id)
//                                   }
//                                   className="text-blue-600 hover:text-blue-800 font-medium"
//                                 >
//                                   ...more
//                                 </button>
//                               )}
//                             </span>
//                           )}
//                         </td>
//                         <td className="px-4 py-3 text-sm text-gray-900">
//                           {customer?.pincode}
//                         </td>
//                         <td className="px-4 py-3 text-sm text-gray-900">
//                           {customer?.mobile}
//                         </td>
//                         <td className="px-4 py-3 text-sm text-gray-900">
//                           {/* {customer?.email} */}
//                           {showFullEmail[customer?._id] ? (
//                             <span>
//                               {customer?.email}{" "}
//                               <button
//                                 onClick={() =>
//                                   handleShowMoreEmail(customer?._id)
//                                 }
//                                 className="text-blue-600 hover:text-blue-800 font-medium"
//                               >
//                                 Show less
//                               </button>
//                             </span>
//                           ) : (
//                             <span>
//                               {truncateAddress(customer?.email)}{" "}
//                               {customer?.email?.length > 20 && (
//                                 <button
//                                   onClick={() =>
//                                     handleShowMoreEmail(customer?._id)
//                                   }
//                                   className="text-blue-600 hover:text-blue-800 font-medium"
//                                 >
//                                   ...more
//                                 </button>
//                               )}
//                             </span>
//                           )}
//                         </td>
//                         <td className="px-4 py-3 text-sm">
//                           <span
//                             className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                               item.isActive === "Running"
//                                 ? "bg-green-100 text-green-800"
//                                 : "bg-red-100 text-red-800"
//                             }`}
//                           >
//                             {item.isActive}
//                           </span>
//                         </td>
//                         <td className="px-4 py-3">
//                           <div className="items-center flex justify-center">
//                             <CiEdit
//                               onClick={() =>
//                                 navigate(
//                                   userRole === "admin"
//                                     ? "/admin/masters/customerEdit"
//                                     : "/staff/masters/customerEdit",
//                                   {
//                                     state: {
//                                       customerId: customer._id,

//                                       index: itemIndex
//                                     }
//                                   }
//                                 )
//                               }
//                               className="cursor-pointer text-blue-600 hover:text-blue-800 transition-colors text-xl md:text-2xl"
//                               title="Edit Customer"
//                             />
//                             {/* <div className="text-red-500 hover:text-red-700 transition-colors p-1 rounded hover:bg-red-100">
//                             <DeleteAlert
//                               onDelete={handleDelete}
//                               Id={customer._id}
//                             />
//                           </div> */}
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   })
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan="11"
//                       className="px-4 py-12 text-center text-gray-500"
//                     >
//                       {isFetching ? (
//                         <div className="flex justify-center">
//                           <PropagateLoader color="#3b82f6" size={10} />
//                         </div>
//                       ) : (
//                         <div className="text-lg">No Data Found</div>
//                       )}
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default CustomerListform

import { useState, useEffect, useRef, useMemo } from "react"
import ExcelJS from "exceljs"
import { saveAs } from "file-saver"
import api from "../../api/api"
import { CustomSelect } from "../common/CustomSelect"
import { getLocalStorageItem } from "../../helper/localstorage"
import { CiEdit } from "react-icons/ci"
import { PropagateLoader } from "react-spinners"
import { useNavigate } from "react-router-dom"
import UseFetch from "../../hooks/useFetch"
import debounce from "lodash.debounce"
import TooltipIcon from "../TooltipIcon"
import BranchDropdown from "../primaryUser/BranchDropdown"
import { useInfiniteQuery } from "@tanstack/react-query"
// import SkeletonTable from "../common/SkeletonTable"
import SkeletonTable from "../loader/SkeletonTable"
import { FaUserPlus, FaRegFileExcel, FaFilePdf, FaPrint } from "react-icons/fa"

const CustomerListform = () => {
  const navigate = useNavigate()
  const containerRef = useRef(null)

  const [searchTerm, setsearchTerm] = useState("")
  const [apiSearchTerm, setApiSearchTerm] = useState("")
  const [selectedstatus, setselectedStatus] = useState("Allcustomers")
  const [customerCount, setcustomerCount] = useState(0)
  const [showFullAddress, setShowFullAddress] = useState({})
  const [showFullEmail, setShowFullEmail] = useState({})
  const [user, setUser] = useState(null)
  const [selectedBranch, setselectedBranch] = useState(null)
  const [userBranches, setuserBranches] = useState([])
  const [userRole, setUserRole] = useState(null)
  const [productType, setproductType] = useState("All")

  const { data: dupi } = UseFetch("/customer/duplicate")
  const { data: unwanted } = UseFetch("/customer/getunwanted")
  const { data: productlist } = UseFetch(
    selectedBranch &&
      `/product/getallProducts?branchselected=${encodeURIComponent(
        JSON.stringify(selectedBranch)
      )}`
  )
  console.log(productlist)
  const fetchCustomers = async ({ pageParam = 1, queryKey }) => {
    const [_key, { branch, search, status, productfilter }] = queryKey
    console.log(productfilter)

    const res = await api.get(
      `/customer/getcust?limit=100&page=${pageParam}&search=${search}&loggeduserBranches=${branch}&customerType=${status}&productfilter=${productfilter}`
    )

    return res.data.data
  }
  // console.log(productfilter)
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isLoading
  } = useInfiniteQuery({
    queryKey: [
      "customers",
      {
        branch: selectedBranch,
        search: apiSearchTerm,
        status: selectedstatus,
        productfilter: productType
      }
    ],
    queryFn: fetchCustomers,
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.customers?.length === 100 ? allPages.length + 1 : undefined,
    enabled: !!selectedBranch
  })
  console.log(apiSearchTerm)
  useEffect(() => {
    const userData = getLocalStorageItem("user")
    if (!userData) return

    setUser(userData)
    setUserRole(userData?.role?.toLowerCase?.() || null)

    const branches =
      userData?.selected?.map((branch) => ({
        id: branch.branch_id,
        branchName: branch.branchName
      })) || []

    setuserBranches(branches)

    if (userData?.selected?.[0]?.branch_id) {
      setselectedBranch(userData.selected[0].branch_id)
    }
  }, [])

  const allCustomers = useMemo(() => {
    return data?.pages?.flatMap((page) => page?.customers || []) || []
  }, [data])
console.log(allCustomers)
  const productOptions = useMemo(() => {
    if (!productlist?.length) return []

    return productlist.map((it) => ({
      value: it._id,
      label: (it?.shortName ?? it.productName).toUpperCase()
    }))
  }, [productlist])
const normalizedCustomers = useMemo(() => {
  return allCustomers.filter((customer) => {
    if (selectedstatus === "ProductMissing") {
      return !Array.isArray(customer.selected) || customer.selected.length === 0
    }

    if (!Array.isArray(customer.selected)) return false

    if (productType === "All") return customer.selected.length > 0

    return customer.selected.some((item) => {
      const itemProductId =
        item?.product_id?._id || item?.product_id || item?.productid || ""

      return String(itemProductId) === String(productType)
    })
  }).map((customer) => {
    if (!Array.isArray(customer.selected)) return customer

    if (productType === "All") return customer

    return {
      ...customer,
      selected: customer.selected.filter((item) => {
        const itemProductId =
          item?.product_id?._id || item?.product_id || item?.productid || ""

        return String(itemProductId) === String(productType)
      })
    }
  })
}, [allCustomers, productType, selectedstatus])
  // const normalizedCustomers = useMemo(() => {
  //   return allCustomers
  //     .map((customer) => {
  //       const selectedItems = customer.selected || []

  //       const filteredByProduct = selectedItems.filter((item) => {
  //         if (productType === "All") return true

  //         const itemProductId =
  //           item?.product_id?._id || item?.product_id || item?.productid || ""

  //         return String(itemProductId) === String(productType)
  //       })

  //       return {
  //         ...customer,
  //         selected: filteredByProduct
  //       }
  //     })
  //     .filter((customer) => customer.selected?.length > 0 || !customer.selected)
  // }, [allCustomers, productType])

  // const filteredCustomers = useMemo(() => {
  //   const normalize = (value) =>
  //     String(value ?? "")
  //       .trim()
  //       .toLowerCase()

  //   const term = normalize(searchTerm)
  //   console.log(term)
  //   if (!term) return normalizedCustomers
  //   console.log(normalizedCustomers)
  //   const a = normalizedCustomers.filter(
  //     (item) =>
  //       item.customerName ===
  //       "QUALITY INNOVATIONS AND PHARMACEUTICALS INDIA (PVT) LTD"
  //   )
  //   console.log(a)
  //   return normalizedCustomers.filter((cust) => {
  //     const matchesCustomer =
  //       normalize(cust.customerName).includes(term) ||
  //       normalize(cust.mobile).includes(term)
  //     // normalize(cust.email).includes(term) ||
  //     // normalize(cust.address1).includes(term)

  //     const matchesSelected =
  //       Array.isArray(cust.selected) &&
  //       cust.selected.some(
  //         (sel) => normalize(sel?.licensenumber).includes(term)
  //         // ||
  //         //         normalize(sel?.productName).includes(term) ||
  //         //         normalize(sel?.branch_id?.branchName).includes(term)
  //       )

  //     return matchesCustomer || matchesSelected
  //   })
  // }, [normalizedCustomers, searchTerm])
const normalize = (value) =>
  String(value ?? "").trim().toLowerCase()

const customerMatchesSearch = (cust, term) => {
  const matchesCustomer =
    normalize(cust.customerName).includes(term) ||
    normalize(cust.mobile).includes(term) ||
    normalize(cust.email).includes(term) ||
    normalize(cust.address1).includes(term)

  const matchesSelected =
    Array.isArray(cust.selected) &&
    cust.selected.some(
      (sel) =>
        normalize(sel?.licensenumber).includes(term) ||
        normalize(sel?.productName).includes(term) ||
        normalize(sel?.branch_id?.branchName).includes(term)
    )

  return matchesCustomer || matchesSelected
}
const filteredCustomers = useMemo(() => {
  const term = normalize(searchTerm)
  if (!term) return normalizedCustomers
  return normalizedCustomers.filter((cust) => customerMatchesSearch(cust, term))
}, [normalizedCustomers, searchTerm])
const handleChange = (e) => {
  const value = e.target.value
  setsearchTerm(value)

  const term = normalize(value)

  if (!term) {
    debouncedApiSearch.cancel()
    setApiSearchTerm("")
    return
  }

  const hasLocalMatch = normalizedCustomers.some((cust) =>
    customerMatchesSearch(cust, term)
  )

  if (!hasLocalMatch) {
    debouncedApiSearch(value)
  } else {
    debouncedApiSearch.cancel()
    setApiSearchTerm("")
  }
}
// const handleChange = (e) => {
//   const value = e.target.value
//   setsearchTerm(value)

//   const term = normalize(value)

//   if (!term) {
//     debouncedApiSearch.cancel()
//     setApiSearchTerm("")
//     return
//   }

//   const hasLocalMatch = normalizedCustomers.some((cust) =>
//     customerMatchesSearch(cust, term)
//   )

//   if (!hasLocalMatch) {
//     debouncedApiSearch(value)
//   } else {
//     debouncedApiSearch.cancel()
//     setApiSearchTerm("")
//   }
// }
  useEffect(() => {
    if (searchTerm.trim()) {
      setcustomerCount(filteredCustomers.length)
    } else {
      setcustomerCount(data?.pages?.[0]?.selectedbranchCustomercount || 0)
    }
  }, [filteredCustomers, data, searchTerm])

  const debouncedApiSearch = useMemo(
    () =>
      debounce((value) => {
        setApiSearchTerm(value.trim())
      }, 600),
    []
  )

  useEffect(() => {
    return () => {
      debouncedApiSearch.cancel()
    }
  }, [debouncedApiSearch])

  // const handleChange = (e) => {
  //   const value = e.target.value
  //   setsearchTerm(value)
  //   console.log(value)
  //   if (!value.trim()) {
  //     debouncedApiSearch.cancel()
  //     setApiSearchTerm("")
  //     return
  //   }

  //   const term = value.trim().toLowerCase()
  //   console.log(normalizedCustomers)
  //   console.log(term)
  //   const hasLocalMatch = normalizedCustomers.some(
  //     (cust) =>
  //       cust.customerName?.includes(term) ||
  //       cust.mobile?.includes(term) ||
  //       cust.email?.includes(term) ||
  //       cust.selected?.some(
  //         (sel) =>
  //           sel?.licensenumber?.toString().toLowerCase().includes(term) ||
  //           sel?.productName?.toLowerCase().includes(term)
  //       )
  //   )
  //   console.log(hasLocalMatch)
  //   if (!hasLocalMatch) {
  //     console.log(value)
  //     console.log("h")
  //     debouncedApiSearch(value)
  //   }
  // }
// const handleChange = (e) => {
//   const value = e.target.value
//   setsearchTerm(value)

//   const term = normalize(value)

//   if (!term) {
//     debouncedApiSearch.cancel()
//     setApiSearchTerm("")
//     return
//   }

//   const hasLocalMatch = normalizedCustomers.some((cust) => {
//     const matchesCustomer =
//       normalize(cust.customerName).includes(term) ||
//       normalize(cust.mobile).includes(term) ||
//       normalize(cust.email).includes(term) ||
//       normalize(cust.address1).includes(term)

//     const matchesSelected =
//       Array.isArray(cust.selected) &&
//       cust.selected.some(
//         (sel) =>
//           normalize(sel?.licensenumber).includes(term) ||
//           normalize(sel?.productName).includes(term) ||
//           normalize(sel?.branch_id?.branchName).includes(term)
//       )

//     return matchesCustomer || matchesSelected
//   })

//   if (!hasLocalMatch) {
//     debouncedApiSearch(value)
//   } else {
//     debouncedApiSearch.cancel()
//     setApiSearchTerm("")
//   }
// }

  const handleBranchChange = (branch) => {
    setselectedBranch(branch)
    setsearchTerm("")
    setApiSearchTerm("")
    setShowFullAddress({})
    setShowFullEmail({})
  }

  const handleScroll = () => {
    const container = containerRef.current
    if (!container) return

    const { clientHeight, scrollHeight, scrollTop } = container

    if (
      scrollTop / (scrollHeight - clientHeight) >= 0.9 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage()
    }
  }

  const handleShowMoreAddress = (customerId) => {
    setShowFullAddress((prev) => ({
      ...prev,
      [customerId]: !prev[customerId]
    }))
  }

  const handleShowMoreEmail = (customerId) => {
    setShowFullEmail((prev) => ({
      ...prev,
      [customerId]: !prev[customerId]
    }))
  }

  const truncateText = (value, maxLength = 20) => {
    if (!value) return "-"
    return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value
  }

  const getPageTitle = () => {
    switch (selectedstatus) {
      case "ProductinfoMissing":
        return "Product Details Missing Customer List"
      case "ProductMissing":
        return "Product Missing Customer List"
      case "Deactive":
        return "Deactive Customer List"
      case "Running":
        return "Active Customer List"
      default:
        return "Customer List"
    }
  }

  const handleDownload = async () => {
    const response = await api.get(
      `/customer/downloadcustomerlistexcel?customerType=${selectedstatus}&branchselected=${selectedBranch}&searchTerm=${apiSearchTerm}`
    )

    const exportData = response.data.data
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Customer List")

    let headingText = ""
    let fileName = ""

    switch (selectedstatus) {
      case "Allcustomers":
        headingText = "All Customers"
        fileName = "AllCustomers_Report.xlsx"
        break
      case "ProductMissing":
        headingText = "Product Missing Customers"
        fileName = "ProductMissing_Customers.xlsx"
        break
      case "ProductinfoMissing":
        headingText = "Product Info Missing Customers"
        fileName = "ProductInfoMissing_Customers.xlsx"
        break
      case "Running":
        headingText = "Running Customers"
        fileName = "Running_Customers.xlsx"
        break
      case "Deactive":
        headingText = "Deactive Customer List"
        fileName = "DeactiveCustomerList_Report.xlsx"
        break
      default:
        headingText = "Customer Report"
        fileName = "Customer_Report.xlsx"
    }

    worksheet.mergeCells("A1:I1")
    const headingCell = worksheet.getCell("A1")
    headingCell.value = headingText
    headingCell.font = { size: 18, bold: true, color: { argb: "FFFFFFFF" } }
    headingCell.alignment = { horizontal: "center", vertical: "middle" }
    headingCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF305496" }
    }
    worksheet.getRow(1).height = 30

    worksheet.addRow([])

    worksheet.columns = [
      { header: "BRANCH NAME", key: "branchName", width: 20 },
      { header: "CUSTOMER NAME", key: "customerName", width: 25 },
      { header: "PRODUCT NAME", key: "productName", width: 20 },
      { header: "LICENSE NO", key: "licenseNo", width: 18 },
      { header: "ADDRESS", key: "address", width: 40 },
      { header: "PINCODE", key: "pincode", width: 10 },
      { header: "MOBILE", key: "mobile", width: 15 },
      { header: "EMAIL", key: "email", width: 35 },
      { header: "STATUS", key: "status", width: 12 }
    ]

    const headerRow = worksheet.getRow(3)
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF4472C4" }
      }
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } }
      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true
      }
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      }
    })
    headerRow.height = 22

    exportData.forEach((customer) => {
      const row = worksheet.addRow({
        branchName: customer.branchName,
        customerName: customer.customerName,
        productName: customer.productName,
        licenseNo: customer.licenseNo,
        address: customer.address,
        pincode: customer.pincode,
        mobile: customer.mobile,
        email: customer.email,
        status: customer.status
      })

      row.eachCell((cell, colNumber) => {
        const key = worksheet.columns[colNumber - 1].key

        if (["address", "email", "customerName"].includes(key)) {
          cell.alignment = { wrapText: true, vertical: "top" }
        } else {
          cell.alignment = { horizontal: "center", vertical: "middle" }
        }

        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" }
        }

        if (row.number % 2 === 0) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF2F2F2" }
          }
        }
      })
    })

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 3) row.height = 30
    })

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    })
    saveAs(blob, fileName)
  }

  return (
    <div className="h-full overflow-hidden bg-[#ADD8E6] p-3 md:p-4">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="shrink-0 border-b border-slate-200 bg-gradient-to-r from-white via-slate-50 to-white px-4 py-4 md:px-6">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
                {getPageTitle()}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Manage customer records, filters, and exports.
              </p>
            </div>

            <div className="relative w-full max-w-md">
              <input
                type="text"
                value={searchTerm}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-4 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                placeholder="Search customer, product, mobile..."
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-end gap-2">
              <TooltipIcon
                icon={FaUserPlus}
                tooltip="Add Customer"
                to={
                  user?.role === "Admin"
                    ? "/admin/masters/customerRegistration"
                    : "/staff/masters/customerRegistration"
                }
              />

              {userRole === "admin" && (
                <TooltipIcon
                  icon={FaRegFileExcel}
                  tooltip="Excel Download"
                  button
                  onClick={handleDownload}
                />
              )}

              <TooltipIcon icon={FaFilePdf} tooltip="PDF Download" button />
              <TooltipIcon icon={FaPrint} tooltip="Print" button />

              <BranchDropdown
                branches={userBranches}
                onBranchChange={handleBranchChange}
                branchSelected={selectedBranch}
                className="w-[180px]"
                label="Branch"
                labletrue
              />

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="customer-status"
                  className="text-[10px] font-medium uppercase tracking-wide text-slate-500"
                >
                  Customer Status
                </label>

                <select
                  id="customer-status"
                  value={selectedstatus}
                  onChange={(e) => setselectedStatus(e.target.value)}
                  className="h-8 min-w-[170px] rounded-xl border border-slate-200 bg-white px-3 text-[12px] font-medium text-slate-700 shadow-sm outline-none transition hover:border-slate-300 focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
                >
                  <option value="Allcustomers">All Customer</option>
                  <option value="Running">Running</option>
                  <option value="Deactive">Deactive</option>
                  <option value="ProductinfoMissing">
                    Product Info Missing
                  </option>
                  <option value="ProductMissing">Product Missing</option>
                </select>
              </div>

              <CustomSelect
                value={productType}
                onChange={(value) => setproductType(value)}
                options={[{ id: "All", label: "All" }, ...productOptions]}
                className="w-[220px]"
                label="Product Filter"
                labletrue
              />
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-blue-100">
              <span className="text-slate-500">Total</span>
              <span className="text-base font-semibold text-blue-700">
                {customerCount}
              </span>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 p-3 md:p-4">
          {isLoading ? (
            <SkeletonTable />
          ) : (
            <div
              onScroll={handleScroll}
              ref={containerRef}
              className="h-full overflow-auto rounded-2xl border border-slate-200 bg-white shadow-inner"
            >
              <table className="min-w-full bg-white">
                <thead className="sticky top-0 z-10 bg-slate-50">
                  <tr className="text-nowrap">
                    <th className="border-b border-slate-200 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      S.No
                    </th>
                    <th className="border-b border-slate-200 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Branch Name
                    </th>
                    <th className="border-b border-slate-200 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Customer Name
                    </th>
                    <th className="border-b border-slate-200 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Product Name
                    </th>
                    <th className="border-b border-slate-200 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      License
                    </th>
                    <th className="border-b border-slate-200 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Address
                    </th>
                    <th className="border-b border-slate-200 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Pin Code
                    </th>
                    <th className="border-b border-slate-200 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Mobile
                    </th>
                    <th className="border-b border-slate-200 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Email
                    </th>
                    <th className="border-b border-slate-200 px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>
                    <th className="border-b border-slate-200 px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer, index) => {
                      if (
                        !customer.selected ||
                        customer.selected.length === 0
                      ) {
                        return (
                          <tr
                            key={customer._id}
                            className="transition-colors hover:bg-slate-50"
                          >
                            <td className="px-4 py-3 text-sm text-slate-700">
                              {index + 1}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-500">
                              -
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold uppercase text-slate-900">
                              {customer?.customerName}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-rose-600">
                              Missing Product
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-500">
                              -
                            </td>
                            <td className="max-w-xs px-4 py-3 text-sm text-slate-700">
                              {showFullAddress[customer?._id] ? (
                                <span>
                                  {customer?.address1}{" "}
                                  <button
                                    onClick={() =>
                                      handleShowMoreAddress(customer?._id)
                                    }
                                    className="font-medium text-blue-600 hover:text-blue-800"
                                  >
                                    Show less
                                  </button>
                                </span>
                              ) : (
                                <span>
                                  {truncateText(customer?.address1)}{" "}
                                  {customer?.address1?.length > 20 && (
                                    <button
                                      onClick={() =>
                                        handleShowMoreAddress(customer?._id)
                                      }
                                      className="font-medium text-blue-600 hover:text-blue-800"
                                    >
                                      ...more
                                    </button>
                                  )}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-700">
                              {customer?.pincode}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-700">
                              {customer?.mobile}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-700">
                              {showFullEmail[customer?._id] ? (
                                <span>
                                  {customer?.email}{" "}
                                  <button
                                    onClick={() =>
                                      handleShowMoreEmail(customer?._id)
                                    }
                                    className="font-medium text-blue-600 hover:text-blue-800"
                                  >
                                    Show less
                                  </button>
                                </span>
                              ) : (
                                <span>
                                  {truncateText(customer?.email)}{" "}
                                  {customer?.email?.length > 20 && (
                                    <button
                                      onClick={() =>
                                        handleShowMoreEmail(customer?._id)
                                      }
                                      className="font-medium text-blue-600 hover:text-blue-800"
                                    >
                                      ...more
                                    </button>
                                  )}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center text-sm">
                              <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                                No Status
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() =>
                                    navigate(
                                      userRole === "admin"
                                        ? "/admin/masters/customerEdit"
                                        : "/staff/masters/customerEdit",
                                      { state: { customerId: customer._id } }
                                    )
                                  }
                                  className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50 hover:text-blue-800"
                                  title="Edit Customer"
                                >
                                  <CiEdit className="text-xl md:text-2xl" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      }

                      return customer.selected.map((item, itemIndex) => (
                        <tr
                          key={`${customer._id}-${item.licensenumber || itemIndex}-${itemIndex}`}
                          className="transition-colors hover:bg-slate-50"
                        >
                          <td className="px-4 py-3 text-sm text-slate-700">
                            {itemIndex === 0 ? index + 1 : ""}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700">
                            {item?.branch_id?.branchName || "-"}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold uppercase text-slate-900">
                            {customer?.customerName}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700">
                            {item?.productName || "-"}
                          </td>
                          <td className="px-4 py-3 font-mono text-sm text-slate-700">
                            {item?.licensenumber || "-"}
                          </td>
                          <td className="max-w-xs px-4 py-3 text-sm text-slate-700">
                            {showFullAddress[customer?._id] ? (
                              <span>
                                {customer?.address1}{" "}
                                <button
                                  onClick={() =>
                                    handleShowMoreAddress(customer?._id)
                                  }
                                  className="font-medium text-blue-600 hover:text-blue-800"
                                >
                                  Show less
                                </button>
                              </span>
                            ) : (
                              <span>
                                {truncateText(customer?.address1)}{" "}
                                {customer?.address1?.length > 20 && (
                                  <button
                                    onClick={() =>
                                      handleShowMoreAddress(customer?._id)
                                    }
                                    className="font-medium text-blue-600 hover:text-blue-800"
                                  >
                                    ...more
                                  </button>
                                )}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700">
                            {customer?.pincode}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700">
                            {customer?.mobile}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700">
                            {showFullEmail[customer?._id] ? (
                              <span>
                                {customer?.email}{" "}
                                <button
                                  onClick={() =>
                                    handleShowMoreEmail(customer?._id)
                                  }
                                  className="font-medium text-blue-600 hover:text-blue-800"
                                >
                                  Show less
                                </button>
                              </span>
                            ) : (
                              <span>
                                {truncateText(customer?.email)}{" "}
                                {customer?.email?.length > 20 && (
                                  <button
                                    onClick={() =>
                                      handleShowMoreEmail(customer?._id)
                                    }
                                    className="font-medium text-blue-600 hover:text-blue-800"
                                  >
                                    ...more
                                  </button>
                                )}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center text-sm">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
                                item?.isActive === "Running"
                                  ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                                  : "bg-rose-50 text-rose-700 ring-rose-200"
                              }`}
                            >
                              {item?.isActive || "No Status"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    userRole === "admin"
                                      ? "/admin/masters/customerEdit"
                                      : "/staff/masters/customerEdit",
                                    {
                                      state: {
                                        customerId: customer._id,
                                        index: itemIndex
                                      }
                                    }
                                  )
                                }
                                className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50 hover:text-blue-800"
                                title="Edit Customer"
                              >
                                <CiEdit className="text-xl md:text-2xl" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="11"
                        className="px-4 py-12 text-center text-slate-500"
                      >
                        {isFetching ? (
                          <div className="flex justify-center">
                            <PropagateLoader color="#3b82f6" size={10} />
                          </div>
                        ) : (
                          <div className="text-lg">No Data Found</div>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {isFetchingNextPage && (
                <div className="flex justify-center border-t border-slate-100 py-3">
                  <PropagateLoader color="#3b82f6" size={8} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CustomerListform
