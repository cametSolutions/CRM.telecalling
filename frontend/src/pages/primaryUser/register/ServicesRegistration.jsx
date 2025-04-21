import React, { useState, useEffect, useMemo } from "react"
import DeleteAlert from "../../../components/common/DeleteAlert"
import BarLoader from "react-spinners/BarLoader"
import Edit from "../../../components/common/Edit"
import api from "../../../api/api"
import UseFetch from "../../../hooks/useFetch"
import { toast } from "react-toastify"
export const ServicesRegistration = () => {
  const [service, setService] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("")
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [price, setPrice] = useState("")
  const [items, setItems] = useState([])

  const [editState, seteditState] = useState(true)
  const [editId, setEditId] = useState("")
  const { data, loading, error, refreshHook } = UseFetch("/lead/getallServices")
  const { data: companyData, error: companyError } = UseFetch(
    "/company/getCompany"
  )
  useEffect(() => {
    if (data) {
      setItems(data)
      // setTotalPages(data.data.totalPages)
    }
  }, [data])
  // Set default selected company when data is available
  useEffect(() => {
    const defaultCompany = companyData?.find(
      (company) => company.selectedCompany
    )
    if (defaultCompany) {
      setSelectedCompany(defaultCompany._id)
    }
  }, [companyData])

  const handleEdit = (id) => {
    seteditState(false)
    const itemToEdit = items.find((item) => item._id === id)
    if (itemToEdit) {
      setValue(itemToEdit.serviceName)
      setPrice(itemToEdit.price)
      setEditId(id)

      // Store the ID of the brand being edited
    }
  }
  const filteredBranches = useMemo(
    () =>
      companyData?.find((company) => company._id === selectedCompany)
        ?.branches || [],
    [companyData, selectedCompany]
  )
  const handleDelete = async (id) => {
    try {
      await api.delete(`/customer/serviceDelete?id=${id}`)

      // Remove the deleted item from the items array
      setItems((prevItems) => prevItems.filter((item) => item._id !== id))
      setValue("")
    } catch (error) {
      console.error("Failed to delete item", error)
      // toast.error("Failed to delete item. Please try again.")
    }
  }

  const handleSubmit = async () => {
    const formData = {
      serviceName: service,
      price: price,
      company: selectedCompany,
      branch: selectedBranch
    }

    try {
      if (editId) {
        // Update the existing item

        await api.put(`/customer/serviceEdit?id=${editId}`, formData)

        toast.success("Service updated successfully")
        seteditState(true)
      } else {
        // Create a new item

        await api.post("/customer/servicesRegistration", formData)

        toast.success("Service created successfully")
      }

      refreshHook()
      setService("")
      setPrice("")
      setEditId(null)
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
    }
  }

  return (
    <div className=" px-1 md:px-8 mt-3">
      {loading && (
        <BarLoader
          cssOverride={{ width: "100%", height: "4px" }} // Tailwind's `h-4` corresponds to `16px`
          color="#4A90E2" // Change color as needed
        />
      )}
      <h1 className="text-sm font-bold mb-2 md:mb-6 px-4 md:px-8  text-gray-800 uppercase">
        ADD SERVICES
      </h1>

      <div className="flex flex-col md:flex-row items-center w-full px-4 md:px-8  gap-4">
        <input
          type="text"
          name="serviceName"
          onChange={(e) => setService(e.target.value.trim())}
          placeholder="Enter your service name"
          className="w-full md:w-1/4  p-1  border border-gray-300 rounded focus:border-gray-500 outline-none"
          value={service || ""}
        />
        <input
          type="number"
          name="price"
          placeholder="Enter price.."
          className="w-full md:w-1/4 p-1 border border-gray-300 rounded focus:border-gray-500 outline-none"
          value={price || ""}
          onChange={(e) => setPrice(e.target.value.trim())}
        />
        {/* Select Company */}
        <select
          className="w-full md:w-1/4 p-1 border border-gray-300 rounded focus:border-gray-500 outline-none"
          value={selectedCompany || ""}
          onChange={(e) => setSelectedCompany(e.target.value)}
        >
          <option value="">Select Company</option>
          {companyData?.map((company) => (
            <option key={company._id} value={company._id}>
              {company.companyName}
            </option>
          ))}
        </select>

        {/* Select Branch (Filtered by Company) */}
        <select
          className="w-full md:w-1/4 p-1 border border-gray-300 rounded focus:border-gray-500 outline-none"
          value={selectedBranch || ""}
          onChange={(e) => setSelectedBranch(e.target.value)}
          // disabled={!selectedCompany} // Disable if no company is selected
        >
          <option value="">Select Branch</option>

          {filteredBranches?.map((branch) => (
            <option key={branch._id} value={branch._id}>
              {branch.branchName}
            </option>
          ))}
        </select>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-1 rounded "
        >
          {editState ? "SUBMIT" : "UPDATE"}
        </button>
      </div>
      {items && items.length > 0 ? (
        <section className="md:m-8 m-3">
          <div className="w-full xl:mb-0">
            <div className="relative flex flex-col min-w-0 break-words bg-blue-50 w-full mb-6 p-4 md:p-6 shadow-xl rounded-lg">
              <div className="block w-full overflow-x-auto overflow-y-auto h-[calc(85vh-200px)]">
                <table className="items-center w-full border border-gray-300 rounded-lg">
                  <thead>
                    <tr className="bg-gray-300 sticky top-0 z-10">
                      <th className="w-3/6 px-6 text-left text-black  py-3 text-sm uppercase whitespace-nowrap font-semibold">
                        Services
                      </th>
                      <th className="w-3/6 px-6 text-left text-black  py-3 text-sm uppercase whitespace-nowrap font-semibold">
                        Price
                      </th>
                      <th className="px-6 w-1/6 text-center text-blue-500 align-middle  py-3 text-sm uppercase  whitespace-nowrap font-semibold">
                        Edit
                      </th>
                      <th className="px-6 w-1/6 text-right text-red-500 align-middle  py-3 text-sm uppercase whitespace-nowrap font-semibold">
                        Delete
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-100 divide-y divide-gray-300">
                    {items?.map((el) => (
                      <tr key={el._id}>
                        <th className="px-6 text-left col-span-2 text-wrap border-t-0 align-middle border-l-0 border-r-0 whitespace-nowrap text-black p-2 text-sm uppercase font-semibold">
                          {el.serviceName}
                        </th>
                        <td className="px-6 text-left text-black p-2">
                          {el.price}
                        </td>
                        <td className="cursor-pointer text-center flex justify-center px-6 border-t-0 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                          <Edit onEdit={handleEdit} Id={el._id} />
                        </td>
                        <td className="cursor-pointer text-right px-6 border-t-0 align-middle border-l-0 border-r-0 whitespace-nowrap p-2">
                          <DeleteAlert onDelete={handleDelete} Id={el._id} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="text-blue-400 text-center mt-5">
          Ooops No services Found!...
        </div>
      )}
    </div>
  )
}
