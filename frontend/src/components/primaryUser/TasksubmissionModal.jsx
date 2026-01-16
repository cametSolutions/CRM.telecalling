import { useState } from "react"
import api from "../../api/api"
import { toast } from "react-toastify"
import { PropagateLoader } from "react-spinners"
export default function TasksubmissionModal({
  task,
  refresh,
  pending,
  setShowComponent
}) {
  console.log(task)
  const [isOpen, setIsOpen] = useState(true)
  const [submitloading, setsubmitLoading] = useState(false)
  const [taskDetails, setTaskDetails] = useState({
    leadId: task?.leadId,
    taskassignedBy: task?.matchedlog?.submittedUser?.name,
    taskassignedmodel: task?.matchedlog?.submissiondoneByModel,
    taskassignedDate: task?.matchedlog?.allocationDate,
    taskDescriptionByassigner: task?.matchedlog?.remarks,
    taskName: task?.matchedlog?.taskId?._id,
    submissionDate: new Date(),
    leadDocId: task?.leadDocId,
    allocatedTo: task?.allocatedTo,
    allocatedtomodel: task?.matchedlog?.taskallocatedToModel,
    taskfromFollowup: task?.matchedlog?.taskfromFollowup,
    taskDescription: task?.matchedlog?.taskDescription
  })
  const [error, setError] = useState({
    descriptionerror: ""
  })
  //   const [pending, setPending] = useState(true)

  const handleSubmit = async () => {
    if (!taskDetails.taskDescription.trim()) {
      setError({ descriptionerror: "Description is required" })
      return
    }
    try {
      console.log(taskDetails)
    
      setsubmitLoading(true)
      const response = await api.post("/lead/taskSubmission", taskDetails)
      toast.success(response.data.message)
      setsubmitLoading(false)
      refresh()
    } catch (error) {
      setsubmitLoading(false)
      toast.error("something went wrong")
      console.log(error)
    }
    setIsOpen(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Task Details</h2>
            <div className="text-xl font-semibold">
              <span className="mr-1">LEAD ID :</span>
              <span>{taskDetails?.leadId}</span>
            </div>

            <button
              onClick={() => setShowComponent(false)}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        {submitloading && (
          <div className="flex justify-center mt-1">
            <PropagateLoader color="#3b82f6" size={10} />
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* Task Assigned By */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Task Assigned By
              </label>
              <input
                type="text"
                value={taskDetails?.taskassignedBy?.toUpperCase() || ""}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm bg-gray-50 text-gray-600 cursor-not-allowed focus:outline-none"
                readOnly
              />
            </div>

            {/* Completion Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Completion Date
              </label>
              <input
                type="date"
                value={
                  taskDetails?.taskassignedDate?.toString().split("T")[0] || ""
                }
                readOnly
                className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm bg-gray-50 text-gray-600 cursor-not-allowed focus:outline-none"
              />
            </div>

            {/* Description By Assigner */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description By Assigner
              </label>
              <textarea
                readOnly
                value={taskDetails?.taskDescriptionByassigner || ""}
                rows={3}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm bg-gray-50 text-gray-600 cursor-not-allowed focus:outline-none resize-none"
              />
            </div>

            {/* Task Submission Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Task Submission Date
              </label>
              <input
                type="text"
                readOnly
                value={
                  taskDetails?.submissionDate
                    ?.toLocaleDateString("en-GB")
                    .split("/")
                    .join("-") || ""
                }
                className={`w-full border px-3 py-2 rounded-lg text-sm focus:outline-none ${
                  pending
                    ? "bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    : "bg-gray-50 border-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={4}
                value={taskDetails?.taskDescription || ""}
                readOnly={!pending}
                onChange={(e) => {
                  setTaskDetails((prev) => ({
                    ...prev,
                    taskDescription: e.target.value
                  }))
                  if (error.descriptionerror) {
                    setError((prev) => ({
                      ...prev,
                      descriptionerror: ""
                    }))
                  }
                }}
                className={`w-full border px-3 py-2 rounded-lg text-sm focus:outline-none resize-none ${
                  pending
                    ? "bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    : "bg-gray-50 border-gray-300 text-gray-600 cursor-not-allowed"
                }`}
                placeholder={pending ? "Enter description..." : ""}
              />
              {error.descriptionerror && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error.descriptionerror}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}

        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-xl border-t border-gray-200">
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowComponent(false)}
              className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Cancel
            </button>
            {pending && (
              <button
                onClick={handleSubmit}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
              >
                Submit Task
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
