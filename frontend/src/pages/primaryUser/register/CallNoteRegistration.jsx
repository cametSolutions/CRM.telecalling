import React, { useState, useEffect } from "react"
import DeleteAlert from "../../../components/common/DeleteAlert"
import Edit from "../../../components/common/Edit"
import api from "../../../api/api"
import UseFetch from "../../../hooks/useFetch"
import { toast } from "react-toastify"
export const CallNoteRegistration = () => {
  const [value, setValue] = useState("")
  const [items, setItems] = useState([])

  const [editState, seteditState] = useState(true)
  const [editId, setEditId] = useState("")
  const { data, loading, error, refreshHook } = UseFetch(
    "/customer/getallcallNotes"
  )
  useEffect(() => {
    if (data) {
      setItems(data)
      // setTotalPages(data.data.totalPages)
    }
  }, [data])

  const handleEdit = (id) => {
    seteditState(false)
    const itemToEdit = items.find((item) => item._id === id)
    if (itemToEdit) {
      setValue(itemToEdit.callNotes)
      setEditId(id)

      // Store the ID of the brand being edited
    }
  }
  const handleDelete = async (id) => {
    try {
      await api.delete(`/customer/callnoteDelete?id=${id}`)

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
      callNotes: value
    }

    try {
      if (editId) {
        // Update the existing item

        await api.put(`/customer/callnotesEdit?id=${editId}`, formData)

        toast.success("Call notes updated successfully")
        seteditState(true)
      } else {
        // Create a new item

        await api.post("/customer/callnotesRegistration", formData)

        toast.success("callnote created successfully")
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
        ADD YOUR DESIRED CALL NOTE
      </h1>

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
      <section className="m-8">
        <div className="w-full xl:mb-0">
          <div className="relative flex flex-col min-w-0 break-words bg-red-50 w-full mb-6 p-6 shadow-xl rounded">
            <div className="block w-full overflow-x-auto overflow-y-auto h-[calc(80vh-200px)]">
              <table className="items-center w-full border-collapse">
                <thead>
                  <tr className="bg-gray-300 sticky top-0 z-10">
                    <th className="w-3/6 px-6 text-left text-black  py-3 text-sm uppercase whitespace-nowrap font-semibold">
                      Call Note
                    </th>
                    <th className="px-6 w-1/6 text-center text-blue-500 align-middle  py-3 text-sm uppercase  whitespace-nowrap font-semibold">
                      Edit
                    </th>
                    <th className="px-6 w-1/6 text-right text-red-500 align-middle  py-3 text-sm uppercase whitespace-nowrap font-semibold">
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items?.map((el) => (
                    <tr key={el._id}>
                      <th className="px-6 text-left col-span-2 text-wrap border-t-0 align-middle border-l-0 border-r-0 whitespace-nowrap text-black p-2">
                        {el.callNotes}
                      </th>
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

      {/* <section className=" m-8 ">
        <div className="w-full xl:mb-0 ">
          <div className="relative flex flex-col min-w-0 break-words bg-red-50 w-full mb-6 p-6 shadow-xl  rounded">
            <div className="block w-full  overflow-x-auto ">
              <table className="items-center  w-full border-collapse">
                <thead>
                  <tr>
                    <th className=" w-3/6  px-6 text-left  text-black border border-solid border-black py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold">
                      Call Note
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
                        {el.callNotes}
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
          </div>
        </div>
      </section> */}
    </div>
  )
}
