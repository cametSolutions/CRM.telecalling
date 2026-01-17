// import { IoReorderThreeSharp } from "react-icons/io5"
// import { useState } from "react"
// import DeleteAlert from "../../../components/common/DeleteAlert"
// import Edit from "../../../components/common/Edit"
// import api from "../../../api/api"
// import { toast } from "react-toastify"
// import UseFetch from "../../../hooks/useFetch"
// import { useEffect } from "react"
// export default function TaskRegistration() {
//   const [value, setValue] = useState("")
//   const [items, setItems] = useState([])
//   const [editId, setEditId] = useState("")
//   const [editState, seteditState] = useState(true)
//   const { data, refreshHook } = UseFetch("/lead/getallTask")
//   useEffect(() => {
//     if (data && data.length) {
//       setItems(data)
//     }
//   }, [data])
//   const handleEdit = (id) => {
//     seteditState(false)
//     const itemToEdit = items.find((item) => item._id === id)
//     if (itemToEdit) {
//       // reset({ brandName: brandToEdit.brandName })
//       setValue(itemToEdit.task)
//       setEditId(id)

//       // Store the ID of the brand being edited
//     }
//   }
//   const handleDelete = async (id) => {
//     try {
//       await api.delete(`/lead/taskDelete?id=${id}`)

//       // Remove the deleted item from the items array
//       setItems((prevItems) => prevItems.filter((item) => item._id !== id))
//       setValue("")
//     } catch (error) {
//       console.error("Failed to delete item", error)
//       // toast.error("Failed to delete item. Please try again.")
//     }
//   }
//   const handleChange = (e) => {
//     setValue(e.target.value)
//   }

//   const handleSubmit = async () => {
//     const formData = {
//       task: value
//     }
//     try {
//       if (editId) {
//         // Update the existing item
//         await api.put(`/lead/taskEdit?id=${editId}`, formData)

//         toast.success("task updated successfully")
//         seteditState(true)
//       } else {
//         // Create a new item

//         await api.post("/lead/taskRegistration", formData)

//         toast.success("task created successfully")
//       }

//       refreshHook()
//       setValue("")

//       setEditId(null)
//     } catch (error) {
//       console.error(error)
//       toast.error("Something went wrong")
//     }
//   }
//   return (
//     <div>
//       {" "}
//       <div className="bg-[#201450] py-3 px-5 sticky top-0 z-100  text-white text-lg font-bold  items-center flex flex-grow">
//         <IoReorderThreeSharp
//           // onClick={handleToggleSidebar}
//           className="block md:hidden text-3xl"
//         />
//         <p>Add Task</p>
//       </div>
//       <div>
//         <h1 className="text-sm font-bold mb-6  text-gray-800 px-6 pt-6  uppercase">
//           ADD YOUR DESIRED TASK
//         </h1>

//         <div className="flex items-center  w-full px-6  ">
//           <input
//             type="text"
//             onChange={(e) => {
//               handleChange(e)
//             }}
//             placeholder="Enter your brand name"
//             className="w-full md:w-1/2  p-1  border border-gray-300 rounded focus:border-gray-500 outline-none"
//             value={value}
//             //   onChange={(e) => setValue(e.target.value)}
//           />
//           <div className="flex justify-between m-4">
//             <button
//               onClick={handleSubmit}
//               className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-1 rounded "
//             >
//               {editState ? "SUBMIT" : "UPDATE"}
//             </button>
//           </div>
//         </div>
//         <section className=" m-8 ">
//           <div className="w-full xl:mb-0 ">
//             <div className="relative flex flex-col min-w-0 break-words bg-red-50 w-full mb-6 shadow-xl  rounded">
//               <div className=" mb-0 px-4 py-3 border-0">
//                 <div className="flex flex-wrap items-center">
//                   <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">

//                   </div>
//                 </div>
//               </div>

//               <div className="block w-full  overflow-x-auto">
//                 <table className="items-center  w-full border-collapse">
//                   <thead>
//                     <tr>
//                       <th className=" w-3/6  px-6 text-left  text-black border border-solid border-black py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold">
//                         Task Name
//                       </th>
//                       <th className="px-6 w-1/6 text-center  text-blue-500 align-middle border border-solid border-black py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold">
//                         Edit
//                       </th>
//                       <th className="px-6 w-1/6 text-right  text-red-500 align-middle border border-solid border-black py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold">
//                         Delete
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {items && items.length > 0 ? (
//                       items?.map((el) => (
//                         <tr key={el._id}>
//                           <th className="px-6 text-left col-span-2 text-wrap border-t-0 align-middle border-l-0 border-r-0  whitespace-nowrap  text-black p-2">
//                             {el.taskName}
//                           </th>
//                           <td className="cursor-pointer text-center flex justify-center px-6 border-t-0 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 ">
//                             <Edit onEdit={handleEdit} Id={el._id} />
//                           </td>
//                           <td className=" cursor-pointer text-right  px-6 border-t-0 align-middle border-l-0 border-r-0  whitespace-nowrap p-2">
//                             <DeleteAlert onDelete={handleDelete} Id={el._id} />
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td
//                           colSpan="3"
//                           className="text-center py-3 text-gray-500"
//                         >
//                           No data available
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   )
// }

import { useState, useEffect, useCallback } from "react"
import DeleteAlert from "../../../components/common/DeleteAlert"
import Edit from "../../../components/common/Edit"
import api from "../../../api/api"
import { toast } from "react-toastify"
import UseFetch from "../../../hooks/useFetch"

export default function TaskRegistration() {
  const [value, setValue] = useState("")
  const [items, setItems] = useState([])
  const [editId, setEditId] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const { data, refreshHook } = UseFetch("/lead/getallTask")
  console.log(data)
  // Sync data from hook
  useEffect(() => {
    if (data && data.length > 0) {
      setItems(data)
    }
  }, [data])
  console.log(items)
  // Handle Edit
  const handleEdit = useCallback(
    (id) => {
      const itemToEdit = items.find((item) => item._id === id)
      if (itemToEdit) {
        setValue(itemToEdit.task || itemToEdit.taskName || "")
        setEditId(id)
        setIsEditMode(true)
      }
    },
    [items]
  )

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      await api.delete(`/lead/taskDelete?id=${id}`)
      setItems((prev) => prev.filter((item) => item._id !== id))
      return true
      // toast.success("Task deleted successfully")
    } catch (error) {
      console.error("Delete failed:", error)
      toast.error("Failed to delete task")
    }
  }

  // Handle Input Change
  const handleChange = (e) => setValue(e.target.value)

  // Handle Submit
  const handleSubmit = async () => {
    if (!value.trim()) {
      toast.error("Task name is required")
      return
    }

    setLoading(true)
    try {
      const payload = { task: value.trim() }

      if (editId) {
        await api.put(`/lead/taskEdit?id=${editId}`, payload)
        toast.success("Task updated successfully")
      } else {
        await api.post("/lead/taskRegistration", payload)
        toast.success("Task created successfully")
      }

      // Reset form
      refreshHook()
      setValue("")
      setEditId(null)
      setIsEditMode(false)
    } catch (error) {
      console.error("Submit failed:", error)
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  // Handle Cancel Edit
  const handleCancel = () => {
    setValue("")
    setEditId(null)
    setIsEditMode(false)
  }
  console.log(items)
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden px-6 py-4 space-y-6">
        {/* Form Section - Fixed Height */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 shrink-0">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {isEditMode ? "Edit Task" : "Add New Task"}
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <input
              type="text"
              placeholder="Enter task name"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={value}
              onChange={handleChange}
              disabled={loading}
            />

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleSubmit}
                disabled={loading || !value.trim()}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-all shadow-sm focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : isEditMode ? "Update" : "Create"}
              </button>

              {isEditMode && (
                <button
                  onClick={handleCancel}
                  className="px-6 py-2.5 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-all shadow-sm focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table Section - Takes Remaining Space */}
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-0">
          {/* Table Header */}
          <div className="px-6 py-2 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 shrink-0">
            <h3 className="text-lg font-semibold text-gray-800">Task List</h3>
            <p className="text-sm text-gray-500">
              {items.length} tasks available
            </p>
          </div>

          {/* Scrollable Table Body */}
          <div className="flex-1 overflow-hidden min-h-0">
            <div className="h-full overflow-auto">
              <table className="w-full table-auto">
                <thead className="sticky top-0 bg-white/95 backdrop-blur-md border-b-2 border-gray-200 shadow-sm z-20">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider sticky left-0 bg-white/95 z-20">
                      Task Name
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider sticky left-0 bg-white/95 z-20">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {items.length > 0 ? (
                    items.map((item) => (
                      <tr
                        key={item._id}
                        className="hover:bg-gray-50/80 transition-colors group"
                      >
                        <td className="px-6 py-4 whitespace-pre-wrap max-w-md">
                          <div className="text-sm font-medium text-gray-900">
                            {item.taskName || "Unnamed Task"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <Edit onEdit={handleEdit} Id={item._id} />
                            <DeleteAlert
                              onDelete={handleDelete}
                              Id={item._id}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="px-6 py-12 text-center">
                        <div className="text-gray-500 space-y-2">
                          <p className="text-lg font-medium">No tasks found</p>
                          <p>Create your first task above!</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
