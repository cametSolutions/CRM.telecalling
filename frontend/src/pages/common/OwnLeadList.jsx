import  { useState } from "react"
import UseFetch from "../../hooks/useFetch"
import { useNavigate } from "react-router-dom"
import { PropagateLoader } from "react-spinners"
import { formatDate } from "../../utils/dateUtils"

export default function OwnLeadList() {
  const [showFullName, setShowFullName] = useState(false)
  const [showFullEmail, setShowFullEmail] = useState(false)
  const userData = localStorage.getItem("user")
  const user = JSON.parse(userData)
  const navigate = useNavigate()
  const { data: ownedlead, loading } = UseFetch(
    user && `/lead/ownregisteredLead?userId=${user._id}`
  )
  return (
    <div className="h-full md:p-6 p-3 bg-blue-50">
      <div className="md:px-8 px-3 py-3 shadow-xl h-full border border-gray-100 rounded-xl bg-gray-50 ">
        <div className="flex justify-between items-center mb-4 ">
          <h2 className="text-lg font-bold">Owned Lead List</h2>

          <button
            onClick={() => 
              
              user?.role === "Admin"
                ? navigate("/admin/transaction/lead")
                : navigate("/staff/transaction/lead")
            }
            className="bg-black text-white py-2 px-3 rounded-lg shadow-lg hover:bg-gray-600"
          >
            New Lead
          </button>
        </div>

        {/* Responsive Table Container */}
        <div className="overflow-x-auto rounded-lg text-center ">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-blue-500 text-white text-sm whitespace-nowrap">
              <tr>
                <th className="px-4 py-2 text-center">Lead Date</th>
                <th className="px-4 py-2 text-center">Lead ID</th>
                <th className="px-4 py-2 text-center">Customer Name</th>
                <th className="px-4 py-2 text-center">Mobile Number</th>
                <th className="px-4 py-2 text-center">Phone Number</th>
                <th className="px-4 py-2 text-center">Email Id</th>
                <th className="px-2 py-2 text-center">Product/Services</th>
                <th className="px-4 py-2 text-center">Net Amount</th>
                {/* <th className="px-4 py-2 text-center">Lead By</th> */}
              </tr>
            </thead>
            <tbody className="text-center divide-gray-200 bg-gray-200 whitespace-nowrap">
              {ownedlead && ownedlead.length > 0 ? (
                ownedlead.map((item) => (
                  <tr key={item.id} className="">
                    <td className="px-1 border border-gray-300">
                      {formatDate(item.leadDate)}
                    </td>
                    <td className="px-4  border border-gray-300">
                      {item?.leadId}
                    </td>{" "}
                    <td
                      className="px-4 border border-gray-300 cursor-pointer"
                      onClick={() => setShowFullName(!showFullName)}
                    >
                      <div
                        className={`truncate overflow-hidden ${
                          !showFullName ? "max-w-[100px]" : ""
                        }`}
                      >
                        {item?.customerName?.customerName}
                      </div>
                    </td>
                    <td className="px-4  border border-gray-300">
                      {item?.mobile}
                    </td>
                    <td className="px-4  border border-gray-300">
                      {item.phone}
                    </td>
                    <td
                      className="px-4  border border-gray-300 cursor-pointer"
                      onClick={() => setShowFullEmail(!showFullEmail)}
                    >
                      <div
                        className={`truncate overflow-hidden ${
                          !showFullEmail ? "max-w-[100px]" : ""
                        }`}
                      >
                        {item?.email}
                      </div>
                    </td>
                    <td className="px-4  border border-gray-300">
                      <button
                        onClick={() => 
                          user.role === "Admin"
                            ? navigate("/admin/transaction/lead/leadEdit", {
                                state: {
                                  leadId: item._id,
                                  isReadOnly: item.leadBy !== item.allocatedTo
                                }
                              })
                            : navigate("/staff/transaction/lead/leadEdit", {
                                state: {
                                  leadId: item._id,
                                  isReadOnly: item.leadBy !== item.allocatedTo
                                }
                              })
                        }
                        className="bg-blue-700 hover:bg-blue-800 text-white rounded-lg px-4 shadow-md"
                      >
                        View
                      </button>
                    </td>
                    <td className="px-4  border border-gray-300">
                      {item?.netAmount}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-4 py-4 text-center bg-gray-100">
                    {loading ? (
                      <div className="flex justify-center items-center gap-2">
                        <PropagateLoader color="#3b82f6" size={10} />
                      </div>
                    ) : (
                      "No Owned Leads/Leads are Allocated"
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
