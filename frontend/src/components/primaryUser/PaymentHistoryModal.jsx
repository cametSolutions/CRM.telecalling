import { useState } from "react"
import { X, Edit2, Save, DollarSign } from "lucide-react"
import { PropagateLoader } from "react-spinners"
import { toast } from "react-toastify"
import api from "../../api/api"
export const PaymentHistoryModal = ({
  data,
  leadid,
  onClose,
  leadDocId,
  loggedUserId,
  refresh
}) => {
  const [editingRow, setEditingRow] = useState(null)
  const [message, setMessage] = useState({})
  const [editedData, setEditedData] = useState({})
  const [ispermissionEdit, setispermissionEdit] = useState(false)
  const [submitLoading, setsubmitLoading] = useState(false)
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0
    }).format(amount)
  }

  const handleEdit = (row, index) => {
    const checkpermission = loggedUserId === row.receivedBy._id
    setispermissionEdit(checkpermission)
    if (!checkpermission) {
      setMessage((prev) => ({
        ...prev,
        warning: "You cant update this fields only former receiver can"
      }))
      return
    }
    if (message.warning) {
      setMessage((prev) => ({
        ...prev,
        warning: ""
      }))
    }
    setEditingRow(index)
    setEditedData({
      paymentDate: new Date(),
      receivedAmount: row.receivedAmount,
      remarks: row.remarks,
      bankRemarks: row.bankRemarks
    })
  }

  const handleSave = async () => {
    try {
      setsubmitLoading(true)
      const response = await api.post(
        `/lead/updatereceivedAmount?leadDocId=${leadDocId}&index=${editingRow}`,
        editedData
      )
      if (response.status === 200) {
        setsubmitLoading(false)
        toast.success("payment updated succesfully")
        refresh()
      }
    } catch (error) {
      console.log("error", error.messgae)
      toast.error("something went wrong")
      setsubmitLoading(false)
    }
  }

  const handleCancel = () => {
    setEditingRow(null)
    setEditedData({})
  }

  const handleInputChange = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const totalAmount = data.reduce(
    (sum, item) => sum + (item.receivedAmount || 0),
    0
  )
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-2 md:py-3 lg:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <DollarSign className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Payment History
              </h2>
              <p className="text-xs sm:text-sm text-blue-100">
                Lead ID: {leadid}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setMessage((prev) => ({
                ...prev,
                warning: ""
              }))
              onClose(false)
            }}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        {submitLoading && (
          <div className="flex justify-center  py-3">
            <PropagateLoader color="#3b82f6" size={10} />
          </div>
        )}

        {/* Total Amount Card */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-base font-medium text-gray-700">
              Total Received
            </span>
            <span className="text-xl sm:text-2xl font-bold text-green-700">
              {formatAmount(totalAmount)}
            </span>
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-auto p-3 sm:p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                    Payment Date
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                    Payment Done By
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                    Payment Amount
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                    Remarks
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                    Bank Remarks
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-center text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => {
                  const isEditing = editingRow === index
                  return (
                    <tr
                      key={row._id}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-25"
                      }`}
                    >
                      <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-gray-700 whitespace-nowrap">
                        {formatDate(row.paymentDate)}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-gray-700 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
                          {row?.receivedBy?.name}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm whitespace-nowrap">
                        {isEditing && ispermissionEdit ? (
                          <input
                            type="number"
                            value={editedData.receivedAmount}
                            onChange={(e) =>
                              handleInputChange(
                                "receivedAmount",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-32 px-2 py-1.5 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        ) : (
                          <span
                            className={`font-semibold ${
                              row.receivedAmount > 0
                                ? "text-green-600"
                                : "text-gray-400"
                            }`}
                          >
                            {formatAmount(row.receivedAmount)}
                          </span>
                        )}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm">
                        {isEditing && ispermissionEdit ? (
                          <input
                            type="text"
                            value={editedData.remarks}
                            onChange={(e) =>
                              handleInputChange("remarks", e.target.value)
                            }
                            className="w-full px-2 py-1.5 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="Enter remarks"
                          />
                        ) : (
                          <span className="text-gray-700">
                            {row.remarks || "-"}
                          </span>
                        )}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm">
                        {isEditing && ispermissionEdit ? (
                          <input
                            type="text"
                            value={editedData.bankRemarks}
                            onChange={(e) =>
                              handleInputChange("bankRemarks", e.target.value)
                            }
                            className="w-full px-2 py-1.5 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="Enter bank remarks"
                          />
                        ) : (
                          <span className="text-gray-700">
                            {row.bankRemarks || "-"}
                          </span>
                        )}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-center whitespace-nowrap">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleSave()}
                              className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                              title="Save"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancel}
                              className="p-1.5 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEdit(row, index)}
                            className="p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {data.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-sm sm:text-base">
                No payment history available
              </p>
            </div>
          )}
          <div className="flex justify-center">
            {" "}
            {message.warning && (
              <p className="text-red-500">{message.warning}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 sm:px-6 py-3 border-t border-gray-200 flex justify-between items-center">
          <p className="text-xs sm:text-sm text-gray-600">
            Total Records:{" "}
            <span className="font-semibold text-gray-800">{data.length}</span>
          </p>
          <button
            onClick={() => {
              onClose(false)
              setMessage((prev) => ({
                ...prev,
                warning: ""
              }))
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
