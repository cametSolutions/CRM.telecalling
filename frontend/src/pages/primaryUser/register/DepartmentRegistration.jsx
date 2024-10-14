import React, { useState, useEffect } from "react"
import { IoReorderThreeSharp } from "react-icons/io5"
import api from "../../../api/api"
import DeleteAlert from "../../../components/common/DeleteAlert"
import Edit from "../../../components/common/Edit"

import { toast } from "react-toastify"
import UseFetch from "../../../hooks/useFetch"
export default function DepartmentRegistration() {
  const [editState, seteditState] = useState(true)
  const [value, setValue] = useState("")
  const [items, setItems] = useState([])
  const [editId, setEditId] = useState("")
  const { data, loading, error, refreshHook } = UseFetch(`/master/getDepartmentList`)
  useEffect(() => {
    if (data) {
      setItems(data)
      // setTotalPages(data.data.totalPages)
    }
  }, [data])
  console.log("d", value)
  console.log("data", data)
  const handleChange = (e) => {
    setValue(e.target.value)
  }
  const handleEdit = (id) => {
    seteditState(false)
    const itemToEdit = items.find((item) => item._id === id)
    if (itemToEdit) {
      // reset({ brandName: brandToEdit.brandName })
      setValue(itemToEdit.department)
      setEditId(id)

      // Store the ID of the brand being edited
    }
  }
  const handleDelete = async (id) => {
    try {
      await api.delete(`/master/departmentDelete?id=${id}`)

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
      department: value
    }

    try {
      if (editId) {
        // Update the existing item

        await api.put(`/master/departmentEdit?id=${editId}`, formData)

        toast.success("Department updated successfully")
        seteditState(true)
      } else {
        // Create a new item

        await api.post("/master/departmentRegistration", formData)

        toast.success("Department created successfully")
      }
      // Refresh the list
      // const response = await api.get(
      //   `/inventory/getproductsubDetails?tab=${tab}`
      // )
      refreshHook()
      //setItems(data.data)
      // Reset form
      setValue("")
      setEditId(null)
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
    }
  }
  return (
    <div className=" ">
      <div className="bg-[#201450] py-3 px-5 sticky top-0 z-100  text-white text-lg font-bold  items-center flex flex-grow">
        <IoReorderThreeSharp
          // onClick={handleToggleSidebar}
          className="block md:hidden text-3xl"
        />
        <p>Add Department</p>
      </div>
      <div>
        <div className="flex items-center  w-full px-6  ">
          <input
            type="text"
            //   onKeyDown={(e) => {
            //     if (e.key === "Enter") {
            //       handleSubmit(value)
            //     }
            //   }}
            onChange={(e) => {
              handleChange(e)
            }}
            placeholder="Enter your brand name"
            className="w-full md:w-1/2  p-1  border border-gray-300 rounded focus:border-gray-500 outline-none"
            value={value}
            //   onChange={(e) => setValue(e.target.value)}
          />
          <div className="flex justify-between m-4">
            <button
              // onClick={
              //   edit?.enabled
              //     ? () => editSubDetails(edit.id, value)
              //     : () => handleSubmit(value)
              // }
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-1 rounded "
            >
              {editState ? "SUBMIT" : "UPDATE"}
            </button>
          </div>
        </div>
        <section className=" m-8 ">
          <div className="w-full xl:mb-0 ">
            <div className="relative flex flex-col min-w-0 break-words bg-red-50 w-full mb-6 shadow-xl  rounded">
              <div className=" mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                  <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                    <button
                      className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none  mb-1 ease-linear transition-all duration-150"
                      type="button"
                    >
                      See all
                    </button>
                  </div>
                </div>
              </div>

              <div className="block w-full  overflow-x-auto">
                <table className="items-center  w-full border-collapse">
                  <thead>
                    <tr>
                      <th className=" w-3/6  px-6 text-left  text-black border border-solid border-black py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold">
                        Department
                      </th>
                      <th className="px-6 w-1/6 text-center  text-blue-500 align-middle border border-solid border-black py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold">
                        Edit
                      </th>
                      <th className="px-6 w-1/6 text-right  text-red-500 align-middle border border-solid border-black py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold">
                        Delete
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {items?.map((el) => (
                      <tr key={el._id}>
                        <th className="px-6 text-left col-span-2 text-wrap border-t-0 align-middle border-l-0 border-r-0  whitespace-nowrap  text-black p-2">
                          {el.department}
                        </th>
                        <td className="cursor-pointer text-center flex justify-center px-6 border-t-0 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 ">
                          <Edit onEdit={handleEdit} Id={el._id} />
                        </td>
                        <td className=" cursor-pointer text-right  px-6 border-t-0 align-middle border-l-0 border-r-0  whitespace-nowrap p-2">
                          <DeleteAlert onDelete={handleDelete} Id={el._id} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            /> */}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
