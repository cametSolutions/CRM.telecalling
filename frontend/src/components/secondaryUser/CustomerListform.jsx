// // export default CustomerListform
// import React, { useState, useEffect } from "react"
// import { CiEdit } from "react-icons/ci"
// import { useNavigate } from "react-router-dom"
// import _ from "lodash"
// import {
//   FaUserPlus,
//   FaSearch,
//   FaRegFileExcel,
//   FaFilePdf,
//   FaPrint,
//   FaHourglassHalf
// } from "react-icons/fa"
// import { MdPending } from "react-icons/md"
// import { Link } from "react-router-dom"

// const CustomerListform = ({ customerlist }) => {
//   const navigate = useNavigate()

//   const [searchQuery, setSearchQuery] = useState("")
//   const [displayedCustomers, setDisplayedCustomers] = useState([]) // Initially displayed customers
//   const [loadMoreCount, setLoadMoreCount] = useState(2)
//   const [allCustomers, setAllCustomers] = useState([]) // Initial count to load
//   useEffect(() => {
//     // Set allCustomers whenever customerlist changes
//     setAllCustomers(customerlist)
//     // On initial load, display the first batch of customers
//     if (customerlist && customerlist.length > 0) {
//       setDisplayedCustomers(customerlist.slice(0, loadMoreCount))
//     }
//   }, [customerlist])
//   console.log("displayedcust", displayedCustomers)
//   // Handle search with lodash debounce to optimize search performance
//   const handleSearch = _.debounce((query) => {
//     const lowerCaseQuery = query.toLowerCase()
//     const filtered = allCustomers.filter((customer) =>
//       customer.customerName.toLowerCase().includes(lowerCaseQuery)
//     )
//     setDisplayedCustomers(filtered.slice(0, loadMoreCount)) // Reset to initial count after filtering
//   }, 300)

//   // Handle scroll event to load more data
//   const handleScroll = () => {
//     const scrollHeight = document.documentElement.scrollHeight
//     const scrollTop = document.documentElement.scrollTop
//     const clientHeight = document.documentElement.clientHeight

//     // Check if user has scrolled to the bottom
//     if (scrollTop + clientHeight >= scrollHeight - 50) {
//       // Load more customers if available
//       if (displayedCustomers.length < allCustomers.length) {
//         setLoadMoreCount((prev) => prev + 2) // Increase load count by 20 on each scroll
//       }
//     }
//   }

//   useEffect(() => {
//     window.addEventListener("scroll", handleScroll)
//     return () => window.removeEventListener("scroll", handleScroll) // Clean up event listener
//   }, [displayedCustomers])

//   return (
//     <div className="container mx-auto h-screen py-8 bg-gray-100">
//       <div className="w-auto bg-white shadow-lg rounded p-4  mx-8">
//         <div className="flex justify-between items-center px-4 lg:px-6 xl:px-8 mb-2">
//           <h3 className="text-2xl text-black font-bold">Customer List</h3>
//           {/* Search Bar for large screens */}
//           <div className="mx-4 md:block">
//             <div className="relative">
//               <FaSearch className="absolute w-4 h-4 left-2 top-3 text-gray-500" />
//             </div>
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => {
//                 setSearchQuery(e.target.value)
//                 handleSearch(e.target.value)
//               }}
//               className=" w-full border border-gray-300 rounded-full py-1 px-4 pl-10 focus:outline-none"
//               placeholder="Search for..."
//             />
//           </div>
//         </div>

//         <hr className="border-t-2 border-gray-300 mb-2" />
//         <div className="flex flex-wrap space-x-4 mb-2">
//           <Link
//             to="/admin/masters/customerRegistration"
//             className="hover:bg-gray-100 text-black font-bold py-2 px-2 rounded inline-flex items-center"
//           >
//             <FaUserPlus className="mr-2" />
//           </Link>
//           <button className="hover:bg-gray-100 text-black font-bold py-2 px-2 rounded inline-flex items-center">
//             <FaRegFileExcel className="mr-2" />
//           </button>
//           <button className="hover:bg-gray-100 text-black font-bold py-2 px-2 rounded inline-flex items-center">
//             <FaFilePdf className="mr-2" />
//           </button>
//           <button className="hover:bg-gray-100 text-black font-bold py-2 px-2 rounded inline-flex items-center">
//             <FaPrint className="mr-2" />
//           </button>

//           <Link
//             to="/admin/masters/pendingCustomer"
//             className="hover:bg-gray-100 text-black font-bold py-2 px-2 rounded inline-flex items-center"
//           >
//             <FaHourglassHalf className="mr-2" />
//           </Link>
//         </div>
//         <div className="overflow-y-auto">
//           <table className="min-w-full bg-white border border-gray-300">
//             <thead>
//               {/* Table Headers */}
//               <tr>
//                 <th className="py-1 px-2 border-b border-gray-300 text-left">
//                   Branch Name
//                 </th>
//                 <th className="py-1 px-2 border-b border-gray-300 text-left">
//                   Customer Name
//                 </th>
//                 <th className="py-1 px-2 border-b border-gray-300 text-left">
//                   Product Name
//                 </th>
//                 <th className="py-1 px-2 border-b border-gray-300 text-left">
//                   License
//                 </th>
//                 <th className="py-1 px-2 border-b border-gray-300 text-left">
//                   Address1
//                 </th>

//                 <th className="py-1 px-2 border-b border-gray-300 text-left">
//                   City
//                 </th>
//                 <th className="py-1 px-2 border-b border-gray-300 text-left">
//                   Pin code
//                 </th>
//                 <th className="py-1 px-2 border-b border-gray-300 text-left">
//                   Mobile
//                 </th>

//                 <th className="py-1 px-2 border-b border-gray-300 text-left">
//                   Email
//                 </th>
//                 <th className="py-1 px-2 border-b border-gray-300 text-left">
//                   Status
//                 </th>
//                 <th className="py-1 px-2 border-b border-gray-300 text-left">
//                   Edit
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {displayedCustomers.length > 0 ? (
//                 displayedCustomers.map((customer) =>
//                   customer.selected.map((item) => (
//                     <tr key={customer?._id}>
//                       <td className="px-2 py-2 text-sm text-black">
//                         {item?.branchName}
//                       </td>
//                       <td className="px-2 py-2 text-sm text-black">
//                         {customer?.customerName}
//                       </td>
//                       <td className="px-2 py-2 whitespace-nowrap text-sm text-black">
//                         {item?.productName}
//                       </td>
//                       <td className="px-2 py-2 whitespace-nowrap text-sm text-black">
//                         {item?.licensenumber}
//                       </td>

//                       <td className="px-2 py-2 whitespace-nowrap text-sm text-black">
//                         {customer?.address1}
//                       </td>

//                       <td className="px-2 py-2 whitespace-nowrap text-sm text-black">
//                         {customer?.city}
//                       </td>
//                       <td className="px-2 py-2 whitespace-nowrap text-sm text-black">
//                         {customer?.pincode}
//                       </td>
//                       <td className="px-2 py-2 whitespace-nowrap text-sm text-black">
//                         {customer?.mobile}
//                       </td>

//                       <td className="px-2 py-2 whitespace-nowrap text-sm text-black">
//                         {customer?.email}
//                       </td>
//                       <td className="px-2 py-2 whitespace-nowrap text-sm text-black">
//                         {customer?.isActive ? "Active" : "Inactive"}
//                       </td>
//                       <td className="px-2 py-2 text-xl text-black">
//                         <CiEdit
//                           onClick={() =>
//                             navigate("/admin/masters/customerEdit", {
//                               state: { customer: customer, selected: item }
//                             })
//                           }
//                         />
//                       </td>
//                     </tr>
//                   ))
//                 )
//               ) : (
//                 <tr>
//                   <td
//                     colSpan="3"
//                     className="px-6 py-4 text-center text-sm text-gray-500"
//                   >
//                     No customer found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default CustomerListform
import React, { useState, useEffect, useRef } from "react"
import { CiEdit } from "react-icons/ci"
import { useNavigate } from "react-router-dom"
import _ from "lodash"
import {
  FaUserPlus,
  FaSearch,
  FaRegFileExcel,
  FaFilePdf,
  FaPrint,
  FaHourglassHalf
} from "react-icons/fa"
import { Link } from "react-router-dom"

const CustomerListform = ({ customerlist }) => {
  const navigate = useNavigate()
  const tableContainerRef = useRef(null) // Ref to track table container scrolling

  const [searchQuery, setSearchQuery] = useState("")
  const [displayedCustomers, setDisplayedCustomers] = useState([]) // Initially displayed customers
  const [loadMoreCount, setLoadMoreCount] = useState(6)
  const [allCustomers, setAllCustomers] = useState([]) // All customers list

  useEffect(() => {
    // Set allCustomers whenever customerlist changes
    setAllCustomers(customerlist)
    // On initial load, display the first batch of customers
    if (customerlist && customerlist.length > 0) {
      setDisplayedCustomers(customerlist.slice(0, loadMoreCount))
    }
  }, [customerlist])
  console.log("display", displayedCustomers)

  // Handle search with lodash debounce to optimize search performance
  const handleSearch = _.debounce((query) => {
    const lowerCaseQuery = query.toLowerCase()
    const filtered = allCustomers.filter((customer) =>
      customer.customerName.toLowerCase().includes(lowerCaseQuery)
    )
    setDisplayedCustomers(filtered.slice(0, loadMoreCount)) // Reset to initial count after filtering
  }, 300)

  // Handle scroll event on the table container to load more data
  const handleScroll = () => {
    const tableContainer = tableContainerRef.current
    if (tableContainer) {
      const { scrollTop, scrollHeight, clientHeight } = tableContainer

      // Check if user has scrolled to the bottom of the table container
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        // Load more customers if available
        if (displayedCustomers.length < allCustomers.length) {
          setLoadMoreCount((prev) => prev + 6) // Increase load count by 6 on each scroll
        }
      }
    }
  }

  useEffect(() => {
    const tableContainer = tableContainerRef.current
    if (tableContainer) {
      tableContainer.addEventListener("scroll", handleScroll)
    }

    return () => {
      if (tableContainer) {
        tableContainer.removeEventListener("scroll", handleScroll) // Clean up event listener
      }
    }
  }, [displayedCustomers])

  useEffect(() => {
    setDisplayedCustomers(allCustomers.slice(0, loadMoreCount))
  }, [loadMoreCount, allCustomers])

  return (
    <div className=" mx-auto h-screen p-8 bg-gray-300">
      <div className="w-auto bg-white shadow-lg rounded p-8 ">
        <div className="flex justify-between items-center px-4 lg:px-6 xl:px-8 mb-4">
          <h3 className="text-2xl text-black font-bold">Customer List</h3>
          {/* Search Bar for large screens */}
          <div className="mx-4 md:block">
            <div className="relative">
              <FaSearch className="absolute w-4 h-4 left-2 top-3 text-gray-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                handleSearch(e.target.value)
              }}
              className="w-full border border-gray-300 rounded-full py-1 px-4 pl-10 focus:outline-none"
              placeholder="Search for..."
            />
          </div>
        </div>

        <hr className="border-t-2 border-gray-300 mb-3" />

        <div className="flex flex-wrap space-x-4 mb-2">
          <Link
            to="/admin/masters/customerRegistration"
            className="hover:bg-gray-100 text-black font-bold py-2 px-2 rounded inline-flex items-center"
          >
            <FaUserPlus className="mr-2" />
          </Link>
          <button className="hover:bg-gray-100 text-black font-bold py-2 px-2 rounded inline-flex items-center">
            <FaRegFileExcel className="mr-2" />
          </button>
          <button className="hover:bg-gray-100 text-black font-bold py-2 px-2 rounded inline-flex items-center">
            <FaFilePdf className="mr-2" />
          </button>
          <button className="hover:bg-gray-100 text-black font-bold py-2 px-2 rounded inline-flex items-center">
            <FaPrint className="mr-2" />
          </button>

          <Link
            to="/admin/masters/pendingCustomer"
            className="hover:bg-gray-100 text-black font-bold py-2 px-2 rounded inline-flex items-center"
          >
            <FaHourglassHalf className="mr-2" />
          </Link>
        </div>

        <div
          ref={tableContainerRef}
          className="overflow-y-auto max-h-96" // Fixed height for scrolling
        >
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              {/* Table Headers */}
              <tr>
                <th className="py-1 px-2 border-b border-gray-300 text-left">
                  Branch Name
                </th>
                <th className="py-1 px-2 border-b border-gray-300 text-left">
                  Customer Name
                </th>
                <th className="py-1 px-2 border-b border-gray-300 text-left">
                  Product Name
                </th>
                <th className="py-1 px-2 border-b border-gray-300 text-left">
                  License
                </th>
                <th className="py-1 px-2 border-b border-gray-300 text-left">
                  Address1
                </th>
                <th className="py-1 px-2 border-b border-gray-300 text-left">
                  City
                </th>
                <th className="py-1 px-2 border-b border-gray-300 text-left">
                  Pin code
                </th>
                <th className="py-1 px-2 border-b border-gray-300 text-left">
                  Mobile
                </th>
                <th className="py-1 px-2 border-b border-gray-300 text-left">
                  Email
                </th>
                <th className="py-1 px-2 border-b border-gray-300 text-left">
                  Status
                </th>
                <th className="py-1 px-2 border-b border-gray-300 text-left">
                  Edit
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedCustomers.length > 0 ? (
                displayedCustomers.map((customer) =>
                  customer.selected.map((item) => (
                    <tr key={customer?._id}>
                      <td className="px-2 py-3 text-sm text-black">
                        {item?.branchName}
                      </td>
                      <td className="px-2 py-3 text-sm text-black">
                        {customer?.customerName}
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap text-sm text-black">
                        {item?.productName}
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap text-sm text-black">
                        {item?.licensenumber}
                      </td>

                      <td className="px-2 py-3 whitespace-nowrap text-sm text-black">
                        {customer?.address1}
                      </td>

                      <td className="px-2 py-3 whitespace-nowrap text-sm text-black">
                        {customer?.city}
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap text-sm text-black">
                        {customer?.pincode}
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap text-sm text-black">
                        {customer?.mobile}
                      </td>

                      <td className="px-2 py-3 whitespace-nowrap text-sm text-black">
                        {customer?.email}
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap text-sm text-black">
                        {customer?.isActive ? "Active" : "Inactive"}
                      </td>
                      <td className="px-2 py-3 text-xl text-black">
                        <CiEdit
                          onClick={() =>
                            navigate("/admin/masters/customerEdit", {
                              state: {
                                customer: customer,
                                selected: item
                              }
                            })
                          }
                          className="cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))
                )
              ) : (
                <tr>
                  <td
                    colSpan="11"
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CustomerListform
