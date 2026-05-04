import { useEffect, useState } from "react"
import { X, Edit2, Save, DollarSign } from "lucide-react"
import { PropagateLoader } from "react-spinners"
import { toast } from "react-toastify"
import api from "../../api/api"
export const PaymentHistoryModal = ({
  data,
  balanceAmount,
  isforcefullyclosed,
  isChecked,
  leadid,
  onClose,
  leadDocId,
  loggedUser,
  refresh,
  setdata,
  verifiedLead,

  setselectedLeadId,
  isdepartmentisAccountant = false
}) => {
  console.log(verifiedLead)
  console.log(data)
  console.log(leadDocId)
  console.log(isChecked)
  console.log(balanceAmount)
  const [messageRowIndex, setMessageRowIndex] = useState(null)
  const [originalIndex, setOriginalIndex] = useState(null)
  const [editingRow, setEditingRow] = useState(null)
  const [editmessage, seteditMessage] = useState("")
  const [warningMessage, setwarningMessage] = useState(
    isChecked?.checked
      ? `This is ${isChecked.month} target,you can forcefully closed this target`
      : `This is ${isChecked.month} target,you can forcefully closed this target`
  )
  console.log(isChecked)
  console.log(warningMessage)
  const [message, setMessage] = useState({})
  const [editedData, setEditedData] = useState({})
  const [checkverified, setcheckverified] = useState({})
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

  const handleEdit = (row, originalIndex, index) => {
    console.log(index)
    console.log("hh")
    if (row.paymentVerified) {
      seteditMessage("Amount is verified, can't edit")
      setMessageRowIndex(index)

      setTimeout(() => {
        seteditMessage("")
        setMessageRowIndex(null)
      }, 2000)

      return
    }
    console.log("hh")
    seteditMessage("")
    setMessageRowIndex(null)
    const checkpermission = loggedUser?._id === row.receivedBy._id
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
    setOriginalIndex(originalIndex)
    setEditedData({
      paymentDate: new Date(),
      receivedAmount: row.receivedAmount,
      remarks: row.remarks,
      bankRemarks: row.bankRemarks
    })
    console.log("hhh")
  }
  console.log(editedData)
  const handleSave = async () => {
    try {
      setsubmitLoading(true)
      const response = await api.post(
        `/lead/updatereceivedAmount?leadDocId=${leadDocId}&index=${originalIndex}`,
        editedData
      )
      if (response.status === 200) {
        setsubmitLoading(false)
        setEditedData({})
        setEditingRow(null)
        setOriginalIndex(null)
        setispermissionEdit(false)
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
    setOriginalIndex(null)
    setEditedData({})
  }
  console.log("h")
  const handleInputChange = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value
    }))
  }
  const handleCloseTarget = async () => {
    onClose(false)
    console.log("h")
    setwarningMessage("")
    const response = await api.post(
      `/lead/approveforcefullyclosetarget?leadDocId=${leadDocId}`
    )
    if (response.status === 200) {
      console.log("Hhhh")
    }
  }

  const handleVerify = async (index, checkverified) => {
    console.log(index)

    try {
      setsubmitLoading(true)
      const payload = {
        isverified: !checkverified?.[index],
        index: index,
        leadId: leadDocId,
        verifiedBy: loggedUser?._id
      }
      const response = await api.put("/lead/paymentverification", payload)
      if (response.status === 204) {
        refresh()
        setdata([])
        setsubmitLoading(false)
        setcheckverified((prev) => ({
          ...prev,
          [index]: !checkverified?.[index]
        }))
      }
      if (checkverified?.[index]) {
        toast.success("Payment univerified succssfully")
      } else {
        toast.success("Payment verified successfully")
      }
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong")
      setsubmitLoading(false)
    }
  }

  const totalAmount = data.reduce(
    (sum, item) => sum + (item.receivedAmount || 0),
    0
  )
  console.log(data)
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
              setselectedLeadId(null)
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
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 px-4 sm:px-6 py-3 flex justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-base font-medium text-gray-700">
              Total Received :
            </span>
            <span className="text-xl sm:text-xl font-bold text-green-700">
              {formatAmount(totalAmount)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-base font-medium text-gray-700">
              Balance Amount :
            </span>
            <span className="text-xl sm:text-xl font-bold text-green-700">
              {formatAmount(balanceAmount)}
            </span>
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 p-3 sm:p-6">
          <div className="overflow-x-auto overflow-y-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 bg-blue-400 text-white">
                <tr className=" border-b-2 border-gray-200">
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold  whitespace-nowrap">
                    Payment Date
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold whitespace-nowrap">
                    Payment Done By
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold  whitespace-nowrap">
                    Payment Amount
                  </th>

                  <th className="px-3 sm:px-4 py-3 text-center text-xs sm:text-sm font-semibold whitespace-nowrap">
                    Bank Remarks
                  </th>
                  {!verifiedLead && (
                    <th className="px-3 sm:px-4 py-3 text-center text-xs sm:text-sm font-semibold  whitespace-nowrap">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => {
                  const isEditing = editingRow === index
                  return (
                    <tr
                      key={row._id}
                      className={`border-b border-r border-l border-t-0 border-gray-200 hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-100"
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

                      <td className="px-3 sm:px-4 py-3 text-sm sm:text-xs ">
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
                          <span className="text-gray-700  block max-w-xs whitespace-normal break-all">
                            
                            {row.bankRemarks || "IMPS/ICIC/610610664157/BENJAMINJOSEPH/adtec/ICIa19a859c6b0345bea3e9c58f070c5601#919946839202#B"}
                          </span>
                        )}
                      </td>
                      {!verifiedLead && (
                        <td className="px-3 sm:px-4 py-3  whitespace-nowrap text-center">
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
                            !isdepartmentisAccountant && (
                              <div className="flex flex-col items-center gap-1">
                                <button
                                  onClick={() =>
                                    handleEdit(row, row.originalIndex, index)
                                  }
                                  className="p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                  title="Edit"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>

                                {editmessage &&
                                  messageRowIndex === row.originalIndex && (
                                    <span className="text-sm text-red-600 font-medium">
                                      {editmessage}
                                    </span>
                                  )}
                              </div>
                            )
                          )}
                          {isdepartmentisAccountant && (
                            <button
                              onClick={() =>
                                handleVerify(row.originalIndex, checkverified)
                              }
                              className={`p-1.5 ${
                                checkverified?.[row.originalIndex]
                                  ? "bg-green-500"
                                  : "bg-orange-400"
                              }  text-white rounded-lg  transition-colors ml-2 font-semibold text-sm`}
                            >
                              {checkverified?.[row.originalIndex]
                                ? "Verified"
                                : "Not Verified"}
                            </button>
                          )}
                        </td>
                      )}
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
          {isdepartmentisAccountant &&
            warningMessage &&
            !isforcefullyclosed && (
              <>
                <p className="text-red-500">{warningMessage}</p>
                <button
                  onClick={() => handleCloseTarget()}
                  className="px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors text-sm font-medium"
                >
                  Closed Target
                </button>
              </>
            )}
          <button
            onClick={() => {
              onClose(false)
              setMessage((prev) => ({
                ...prev,
                warning: ""
              }))
              setselectedLeadId(null)
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
