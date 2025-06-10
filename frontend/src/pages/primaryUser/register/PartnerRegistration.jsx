import React, { useState, useEffect,useMemo } from "react"
import DeleteAlert from "../../../components/common/DeleteAlert"
import Edit from "../../../components/common/Edit"
import api from "../../../api/api"
import UseFetch from "../../../hooks/useFetch"
import { toast } from "react-toastify"
export const PartnerRegistration = () => {
  const [value, setValue] = useState("")
  const [items, setItems] = useState([])
 const [selectedCompany, setSelectedCompany] = useState("")
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [editState, seteditState] = useState(true)
  const [editId, setEditId] = useState("")
  const { data: companyData, error: companyError } = UseFetch(
    "/company/getCompany"
  )
console.log(companyData)
  const { data, loading, error, refreshHook } = UseFetch(
    "/customer/getallpartners"
  )
  useEffect(() => {
    if (data) {
      setItems(data)
      // setTotalPages(data.data.totalPages)
    }
  }, [data])
  const filteredBranches = useMemo(
    () =>
      companyData?.find((company) => company._id === selectedCompany)
        ?.branches || [],
    [companyData, selectedCompany]
  )

  const handleEdit = (id) => {
    seteditState(false)
    const itemToEdit = items.find((item) => item._id === id)
    if (itemToEdit) {
      setValue(itemToEdit.partner)
      setEditId(id)

      // Store the ID of the brand being edited
    }
  }
  const handleDelete = async (id) => {
    try {
      await api.delete(`/customer/partnerDelete?id=${id}`)

      // Remove the deleted item from the items array
      setItems((prevItems) => prevItems.filter((item) => item._id !== id))
      setValue("")
    } catch (error) {
      console.error("Failed to delete item", error)
      // toast.error("Failed to delete item. Please try again.")
    }
  }

  const handleChange = (e) => {
    setValue(e.target.value)
  }

  const handleSubmit = async () => {
    const formData = {
      partner: value
    }

    try {
      if (editId) {
        // Update the existing item

        await api.put(`/customer/partnerEdit?id=${editId}`, formData)

        toast.success("Call notes updated successfully")
        seteditState(true)
      } else {
        // Create a new item

        await api.post("/customer/partnerRegistration", formData)

        toast.success("partner created successfully")
      }
      // Refresh the list
      // const response = await api.get(
      //   `/inventory/getproductsubDetails?tab=${tab}`
      // )
      refreshHook()
      //setItems(data.data)
      // Reset form
      // setValue("")
      setEditId(null)
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
    }
  }

  return (
    <div>
      <h1 className="text-sm font-bold mb-6  text-gray-800 px-6 pt-6  uppercase">
        ADD PARTNERS
      </h1>

      <div className="flex items-center  w-full px-8 gap-6 ">
        <input
          type="text"
          onChange={(e) => {
            handleChange(e)
          }}
          placeholder="Enter your brand name"
          className="w-full md:w-1/2  p-1  border border-gray-300 rounded focus:border-gray-500 outline-none"
          value={value}
        />
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
          disabled={!selectedCompany} // Disable if no company is selected
        >
          <option value="">Select Branch</option>

          {filteredBranches?.map((branch) => (
            <option key={branch._id} value={branch._id}>
              {branch.branchName}
            </option>
          ))}
        </select>
        <div className="flex justify-between ">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-1 rounded "
          >
            {editState ? "SUBMIT" : "UPDATE"}
          </button>
        </div>
      </div>
      {items && items.length > 0 && (
        <section className="m-8">
          <div className="w-full xl:mb-0">
            <div className="relative flex flex-col min-w-0 break-words bg-red-50 w-full mb-6 p-6 shadow-xl rounded">
              <div className="block w-full overflow-x-auto overflow-y-auto h-[calc(80vh-200px)] border border-gray-400 rounded-md">
                <table className="items-center w-full border-collapse ">
                  <thead>
                    <tr className="bg-gray-300 sticky top-0 z-10 text-center">
                      <th className=" px-6 text-black  py-3 text-sm uppercase whitespace-nowrap font-semibold">
                        Partner
                      </th>
                      <th className=" px-6  text-black  py-3 text-sm uppercase whitespace-nowrap font-semibold">
                        Company Name
                      </th>
                      <th className="px-6  text-black  py-3 text-sm uppercase whitespace-nowrap font-semibold">
                        Branch Name
                      </th>
                      <th className="px-6   text-blue-500 align-middle  py-3 text-sm uppercase  whitespace-nowrap font-semibold">
                        Edit
                      </th>
                      <th className="px-6  text-red-500 align-middle  py-3 text-sm uppercase whitespace-nowrap font-semibold">
                        Delete
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items?.map((el) => (
                      <tr key={el._id}>
                        <th className="px-6  text-wrap border-t-0 align-middle border-l-0 border-r-0 whitespace-nowrap text-black p-2">
                          {el.partner}
                        </th>
                        <th className="px-6   text-wrap border-t-0 align-middle border-l-0 border-r-0 whitespace-nowrap text-black p-2">
                          {el.partner}
                        </th>
                        <th className="px-6   text-wrap border-t-0 align-middle border-l-0 border-r-0 whitespace-nowrap text-black p-2">
                          {el.partner}
                        </th>
                        <td className="cursor-pointer  px-6 border-t-0 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                          <div className=" flex justify-center">
                            {" "}
                            <Edit onEdit={handleEdit} Id={el._id} />
                          </div>
                        </td>
                        <td className="cursor-pointer flex justify-center px-6 border-t-0 align-middle border-l-0 border-r-0 whitespace-nowrap p-2">
                          <div className="flex justify-center">
                            {" "}
                            <DeleteAlert onDelete={handleDelete} Id={el._id} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
