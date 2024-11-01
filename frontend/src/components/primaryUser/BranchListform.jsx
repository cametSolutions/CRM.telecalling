import React, { useState, useCallback, useEffect } from "react"
import { CiEdit } from "react-icons/ci"
import { useNavigate } from "react-router-dom"
import {
  FaUserPlus,
  FaSearch,
  FaRegFileExcel,
  FaFilePdf,
  FaPrint
} from "react-icons/fa"
import { Link } from "react-router-dom"
import _ from "lodash"

const BranchListform = ({ branchlist }) => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredBranches, setFilteredBranches] = useState(branchlist)
  console.log("branchlist", branchlist)
  const handleSearch = useCallback(
    _.debounce((query) => {
      const lowerCaseQuery = query.toLowerCase()
      setFilteredBranches(
        branchlist.filter((branch) =>
          branch.branchName.toLowerCase().includes(lowerCaseQuery)
        )
      )
    }, 300),
    [branchlist]
  )

  useEffect(() => {
    handleSearch(searchQuery)
  }, [searchQuery, handleSearch])

  return (
    <div className="container mx-auto  p-8">
      <div className="w-auto  bg-white shadow-lg rounded p-8 ">
        <div className="flex justify-between items-center px-4 lg:px-6 xl:px-8 mb-4">
          <h3 className="text-2xl text-black font-bold">BranchList</h3>
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
        <div className="flex flex-wrap space-x-4 mb-4">
          <Link
            to="/admin/masters/branchRegistration"
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
        </div>
        <div className="overflow-x-auto overflow-y-auto text-center max-h-60 sm:max-h-80 md:max-h-96 lg:max-h-[420px]">
        
          <table className="min-w-ful border border-t-0">
          
            <thead className="bg-green-300 sticky top-0 z-10">
              <tr>
                <th className="py-2 px-4 border-b border-gray-300 ">
                  Company Name
                </th>
                <th className="py-2 px-4 border-b border-gray-300 ">
                  Branch Name
                </th>
                <th className="py-2 px-4 border-b border-gray-300 ">
                  Address1
                </th>
                <th className="py-2 px-4 border-b border-gray-300 ">
                  Address2
                </th>

                <th className="py-2 px-4 border-b border-gray-300 ">
                  City
                </th>
                <th className="py-2 px-4 border-b border-gray-300 ">
                  Pin code
                </th>
                <th className="py-2 px-4 border-b border-gray-300 ">
                  Mobile
                </th>
                <th className="py-2 px-4 border-b border-gray-300 ">
                  Telephone
                </th>
                <th className="py-2 px-4 border-b border-gray-300 ">
                  Email
                </th>
                <th className="py-2 px-4 border-b border-gray-300 ">
                  Website
                </th>
                <th className="py-2 px-4 border-b border-gray-300 ">
                  Status
                </th>
                <th className="py-2 px-4 border-b border-gray-300 ">Edit</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBranches?.length > 0 ? (
                filteredBranches.map((branch) => (
                  <tr key={branch?.companyName?._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {branch?.companyName?.companyName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {branch?.branchName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {branch?.address1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {branch?.address2}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {branch?.city}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {branch?.pincode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {branch?.mobile}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {branch?.landlineno}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {branch?.email}
                    </td>

                    <Link to="https://www.flipkart.com/">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700">
                        {branch?.website}
                      </td>
                    </Link>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        branch?.status === "Active"
                          ? "text-blue-700"
                          : "text-red-700"
                      }`}
                    >
                      {branch?.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xl text-black">
                      <CiEdit
                        onClick={() =>
                          navigate("/admin/masters/branchEdit", {
                            state: { branch: branch }
                          })
                        }
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="10"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No branches found in
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

export default BranchListform
