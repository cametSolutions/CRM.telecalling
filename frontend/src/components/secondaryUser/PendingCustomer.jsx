import React, { useState, useCallback, useEffect } from "react"
import { CiEdit } from "react-icons/ci"
import { useNavigate } from "react-router-dom"
import {
  FaUserPlus,
  FaSearch,
  FaRegFileExcel,
  FaFilePdf,
  FaPrint,
  FaHourglassHalf
} from "react-icons/fa"
import { MdPending } from "react-icons/md"

import { Link } from "react-router-dom"
import _ from "lodash"
import UseFetch from "../../hooks/useFetch"

const PendingCustomer = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredCustomer, setFilteredCustomer] = useState([])
  const [userRole, setUserRole] = useState(null)
  const { data: pendingCustomerData } = UseFetch(
    `/customer/getCustomer?pendingCustomerList= ${true}`
  )

  useEffect(() => {
    if (pendingCustomerData) {
      const userData = localStorage.getItem("user")
      const user = JSON.parse(userData)
      setFilteredCustomer(pendingCustomerData)

      if (user && user.role) {
        setUserRole(user.role.toLowerCase())
      }
    }
  }, [pendingCustomerData])

  //   const handleSearch = useCallback(
  //     _.debounce((query) => {
  //       const lowerCaseQuery = query.toLowerCase()
  //       setFilteredCustomer(
  //         customerlist.filter((customer) =>
  //           customer.customerName.toLowerCase().includes(lowerCaseQuery)
  //         )
  //       )
  //     }, 300),
  //     [customerlist]
  //   )

  //   useEffect(() => {
  //     handleSearch(searchQuery)
  //   }, [searchQuery, handleSearch])

  return (
    <div className="container mx-auto min-h-screen py-8 bg-gray-100">
      <div className="w-auto  bg-white shadow-lg rounded p-8  h-screen mx-8">
        <div className="flex justify-between items-center px-4 lg:px-6 xl:px-8 mb-4">
          <h3 className="text-2xl text-black font-bold">
            PendingCustomer List
          </h3>
          {/* Search Bar for large screens */}
          <div className="mx-4 md:block">
            <div className="relative">
              <FaSearch className="absolute w-5 h-5 left-2 top-3 text-gray-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className=" w-full border border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none"
              placeholder="Search for..."
            />
          </div>
        </div>

        <hr className="border-t-2 border-gray-300 mb-4" />
        {/* <div className="flex flex-wrap space-x-4 mb-4">
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
        </div> */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                {/* <th className="py-2 px-4 border-b border-gray-300 text-left">
                  Branch Name
                </th> */}
                <th className="py-2 px-4 border-b border-gray-300 text-left">
                  Customer Name
                </th>
                <th className="py-2 px-4 border-b border-gray-300 text-left">
                  Address1
                </th>
                <th className="py-2 px-4 border-b border-gray-300 text-left">
                  Address2
                </th>

                <th className="py-2 px-4 border-b border-gray-300 text-left">
                  City
                </th>
                <th className="py-2 px-4 border-b border-gray-300 text-left">
                  Pin code
                </th>
                <th className="py-2 px-4 border-b border-gray-300 text-left">
                  Mobile
                </th>
                <th className="py-2 px-4 border-b border-gray-300 text-left">
                  Telephone
                </th>
                <th className="py-2 px-4 border-b border-gray-300 text-left">
                  Email
                </th>
                <th className="py-2 px-4 border-b border-gray-300 text-left">
                  Edit
                </th>

                <th className="py-2 px-4 border-b border-gray-300 text-left"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomer?.length > 0 &&
              filteredCustomer.filter(
                (customer) => customer.selected.length === 0
              ).length > 0 ? (
                filteredCustomer
                  .filter((customer) => customer.selected.length === 0) // Filter customers with an empty selected array
                  .map((customer) => (
                    <tr key={customer._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        No branch selected
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {customer.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {customer.address1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {customer.address2}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {customer.city}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {customer.pincode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {customer.mobile}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {customer.landline}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {customer.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xl text-black">
                        <CiEdit
                          onClick={() =>
                            navigate(`/${userRole}/masters/customerEdit`, {
                              state: {
                                customer: customer
                              }
                            })
                          }
                          className="cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td
                    colSpan="10"
                    className="px-6 py-4 whitespace-nowrap text-sm text-center text-black"
                  >
                    Loading...
                  </td>
                </tr>
              )}

              {/* {filteredCustomer?.length > 0 ? (
                filteredCustomer.map((customer) =>
                  customer.selected.map((item) => (
                    <tr key={customer?._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {item.branch_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {customer?.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {customer?.address1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {customer?.address2}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {customer?.city}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {customer?.pincode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {customer?.mobile}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {customer?.landlineno}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {customer?.email}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-xl text-black">
                        <CiEdit
                          onClick={() =>
                            navigate("/admin/masters/customerRegistration", {
                              state: { customer: customer._id }
                            })
                          }
                        />
                      </td>
                    </tr>
                  ))
                )
              ) : (
                <tr>
                  <td
                    colSpan="10"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No branches found in
                  </td>
                </tr>
              )} */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default PendingCustomer
