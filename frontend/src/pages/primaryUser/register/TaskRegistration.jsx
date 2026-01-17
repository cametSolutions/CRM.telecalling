

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
  const { data, refreshHook } = UseFetch(
    "/lead/getallTask?istaskregistration=true"
  )
  // Sync data from hook
  useEffect(() => {
    if (data && data.length > 0) {
      setItems(data)
    }
  }, [data])
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
      const ispossibleDelete = await api.get(`/lead/checktodelete?id=${id}`)
      if (!ispossibleDelete.data.data) {
        toast.error("Task is in use and cannot be deleted.")
        return
      }

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
                            {item.taskName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            {item.taskName !== "Lead" &&item.taskName!=="Followup"&&
                              item.taskName !== "Allocation" &&
                              item.taskName !== "Reallocation" && (
                                <Edit onEdit={handleEdit} Id={item._id} />
                              )}

                            {item.taskName !== "Lead" &&
                              item.taskName !== "Allocation" &&
                              item.taskName !== "Reallocation" &&item.taskName !=="Followup" &&(
                                <DeleteAlert
                                  onDelete={handleDelete}
                                  Id={item._id}
                                />
                              )}
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
