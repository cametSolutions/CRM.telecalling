import { useState, useEffect, useMemo, useRef } from "react"
import DeleteAlert from "../../../components/common/DeleteAlert"
import Edit from "../../../components/common/Edit"
import api from "../../../api/api"
import UseFetch from "../../../hooks/useFetch"
import { toast } from "react-toastify"
export const PartnerRegistration = () => {
  // const [value, setValue] = useState("")
  const [items, setItems] = useState([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [submitError, setSubmiterror] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("")
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [editState, seteditState] = useState(true)
  const [editId, setEditId] = useState("")
  const [formData, setFormData] = useState({
    partnerName: "",
    companyName: "",
    branchName: ""
  })

  const dropdownbranchRef = useRef(null)

  const { data: companyData, error: companyError } = UseFetch(
    "/company/getCompany"
  )
  console.log(companyData)
  const { data, loading, error, refreshHook } = UseFetch(
    "/customer/getallpartners"
  ) 
  useEffect(() => {
    if (data) {
console.log(data)
      setItems(data)
      // setTotalPages(data.data.totalPages)
    }
  }, [data])
  useEffect(() => {
    const defaultCompany = companyData?.find(
      (company) => company.selectedCompany
    )
    if (defaultCompany) {
      setFormData((prev) => ({
        ...prev,
        companyName: defaultCompany._id
      }))
      setSelectedCompany(defaultCompany._id)
    }
  }, [companyData])
  useEffect(() => {
    const handleClickOutside = (event) => {
      
      if (
        dropdownbranchRef.current &&
        !dropdownbranchRef.current.contains(event.target)
      ) {
console.log(
"h")
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])
  const filteredBranches = useMemo(
    () =>
      companyData?.find((company) => company._id === selectedCompany)
        ?.branches || [],
    [companyData, selectedCompany]
  )

  const handleEdit = (id) => {
    seteditState(false)
    const itemToEdit = items.find((item) => item._id === id)
    console.log(itemToEdit)
    if (itemToEdit) {
      setFormData((prev) => ({ ...prev, partnerName: itemToEdit.partner }))
      setEditId(id)

      // Store the ID of the brand being edited
    }
  }
  console.log(formData)
  const handleDelete = async (id) => {
    try {
      await api.delete(`/customer/partnerDelete?id=${id}`)

      // Remove the deleted item from the items array
      setItems((prevItems) => prevItems.filter((item) => item._id !== id))
    } catch (error) {
      console.error("Failed to delete item", error)
      // toast.error("Failed to delete item. Please try again.")
    }
  }

  // const handleChange = (e) => {
  //   setValue(e.target.value)
  // }
  console.log(submitError)
  const handleSubmit = async () => {
console.log(items)
    const newError = {}
    if (formData.partnerName === "")
      newError.partnerError = "Partner Name is required"
    if (formData.companyName === "")
      newError.companyError = "Company is required"
    if (formData.branchName === "") newError.branchError = "Branch is required"
    if (Object.keys(newError).length > 0) {
      setSubmiterror(newError)
      return
    }

    return
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
  console.log(formData)
  return (
    <div>
      <h1 className="text-sm font-bold mb-6  text-gray-800 px-6 pt-6  uppercase">
        ADD PARTNERS
      </h1>

      <div className="flex items-start">
        <div className="grid grid-cols-1 md:grid-cols-4 w-full px-8 gap-6">
          {/* Partner Name Input */}
          <div className="flex flex-col w-full">
            <input
              type="text"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  partnerName: e.target.value
                }))
              }
              placeholder="Enter your brand name"
              className="p-1 border border-gray-300 rounded focus:border-gray-500 outline-none"
              value={formData.partnerName || ""}
            />
            {submitError.partnerError && (
              <p className="text-red-500 text-sm">{submitError.partnerError}</p>
            )}
          </div>

          {/* Company Select */}
          <div className="flex flex-col w-full ">
            <select
              className="p-1 border border-gray-300 rounded focus:border-gray-500 outline-none"
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
            {submitError.companyError && (
              <p className="text-red-500 text-sm">{submitError.companyError}</p>
            )}
          </div>

          <div className=" w-full relative"  ref={dropdownbranchRef}>
            <div
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="py-1 px-2 border border-gray-300 rounded-md flex items-center justify-between w-full cursor-pointer"
            >
              <span>Select Branch</span>
              <svg
                className={`w-4 h-4 text-gray-500 transform transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 bg-gray-50 z-30 px-2 rounded-md w-full">
                {filteredBranches?.map((branch) => (
                  <label
                    key={branch._id}
                    className="flex items-center gap-2 mb-1"
                  >
                    <input
                      type="checkbox"
                      className="h-3 w-3"
                      value={branch._id}
                      checked={formData.branchName?.includes(branch._id)}
                      onChange={(e) => {
                        const isChecked = e.target.checked
                        setFormData((prev) => {
                          const prevSelected = prev.branchName || []
                          return {
                            ...prev,
                            branchName: isChecked
                              ? [...prevSelected, branch._id] // add
                              : prevSelected.filter((id) => id !== branch._id) // remove
                          }
                        })
                      }}
                      disabled={!selectedCompany}
                    />
                    <span>{branch.branchName}</span>
                  </label>
                ))}
              </div>
            )}

            {/* {submitError.branchError && (
              <p className="text-red-500 text-sm">{submitError.branchError}</p>
            )} */}
          </div>
        </div>
        <div className="px-8 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-1 rounded"
          >
            {editState ? "SUBMIT" : "UPDATE"}
          </button>
        </div>
      </div>

      {/* ✅ Separate Button Row (Independent Layout) */}

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
