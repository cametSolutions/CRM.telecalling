import React, { useEffect, useState } from "react"
import UseFetch from "../../hooks/useFetch"
import { useNavigate } from "react-router-dom"
import { PropagateLoader } from "react-spinners"

export default function OwnLeadList() {
  const [showFullName, setShowFullName] = useState(false)
  const [tableData, setTableData] = useState([])
  const [loggedUser, setLoggedUser] = useState(null)
  const [showFullEmail, setShowFullEmail] = useState(false)

  const navigate = useNavigate()
  const { data: ownedlead, loading } = UseFetch(
    loggedUser && `/lead/ownregisteredLead?userId=${loggedUser._id}`
  )
  useEffect(() => {
    const userData = localStorage.getItem("user")
    const user = JSON.parse(userData)
    setLoggedUser(user)
  }, [])
  useEffect(() => {
    setTableData(ownedlead)
  }, [ownedlead])
console.log(loggedUser)
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mx-3 md:mx-5 mt-3 mb-3">
        <h2 className="text-lg font-bold">Owned Lead List</h2>

        <button
          onClick={() =>
            loggedUser?.role === "Admin"
              ? navigate("/admin/transaction/lead")
              : navigate("/staff/transaction/lead")
          }
          className="bg-black text-white py-1 px-3 rounded-lg shadow-lg hover:bg-gray-600"
        >
          New Lead
        </button>
      </div>

      {/* Responsive Table Container */}

      <div className=" flex-1 overflow-x-auto rounded-lg text-center overflow-y-auto  shadow-xl mx-3 md:mx-5 mb-4">
        <table className=" border-collapse border border-gray-400 w-full text-sm">
          <thead className=" whitespace-nowrap bg-blue-600 text-white sticky top-0 z-30">
            <tr>
              <th className="border border-r-0 border-gray-400 px-4 ">Name</th>
              <th className="border border-r-0 border-l-0 border-gray-400  px-4 max-w-[200px] min-w-[200px]">
                Mobile
              </th>
              <th className="border border-r-0 border-l-0 border-gray-400 px-4 ">
                Phone
              </th>
              <th className="border border-r-0 border-l-0 border-gray-400 px-4 ">
                Email
              </th>
              <th className="border border-r-0 border-l-0 border-gray-400 px-4  min-w-[100px]">
                Lead Id
              </th>
              <th className="border border-gray-400 px-4 ">Followup Date</th>
              <th className="border border-gray-400 px-4  min-w-[100px]">
                Action
              </th>
              <th className="border border-gray-400 px-4 py-2">Net Amount</th>
            </tr>
          </thead>
          <tbody className="bg-gray-200">
            {tableData && tableData.length > 0 ? (
              tableData.map((item, index) => (
                <React.Fragment key={index}>
                  <tr className="bg-white border border-b-0 border-gray-400">
                    <td
                      onClick={() => setShowFullName(!showFullName)}
                      className={`px-4 cursor-pointer overflow-hidden ${
                        showFullName
                          ? "whitespace-normal max-h-[3em]" // ≈2 lines of text (1.5em line-height)
                          : "truncate whitespace-nowrap max-w-[120px]"
                      }`}
                      style={{ lineHeight: "1.5em" }} // fine-tune as needed
                    >
                      {item.customerName.customerName}
                    </td>
                    <td className="  px-4 ">{item.mobile}</td>
                    <td className="px-4 ">0481</td>
                    <td className="px-4 ">{item.email}</td>
                    <td className=" px-4 ">{item.leadId}</td>
                    <td className="border border-b-0 border-gray-400 px-4 ">
                      {/* {
                        item.followUpDatesandRemarks[
                          item.followUpDatesandRemarks.length - 1
                        ]?.nextfollowpdate
                      } */}
                    </td>

                    <td className="border border-b-0 border-gray-400 px-1  text-blue-400 min-w-[50px] hover:text-blue-500 hover:cursor-pointer font-semibold"></td>
                    <td className="borrder border-b-0 border-gray-400 px-4 "></td>
                  </tr>

                  <tr className=" font-semibold bg-gray-200">
                    <td className=" px-4 ">Leadby</td>
                    <td className=" px-4">Assignedto</td>
                    <td className=" px-4 ">Assignedby</td>
                    <td className="px-4 ">No. of Followups</td>
                    <td className="px-4 min-w-[120px]">Lead Date</td>
                    <td className=" border border-t-0 border-b-0 border-gray-400 px-4 bg-white "></td>
                    <td className=" border border-t-0 border-b-0 border-gray-400 px-4 bg-white ">
                      {" "}
                      <button
                        onClick={() => {

                          const isAllocatedToeditable = item.activityLog.some(
                            (it) =>
                              it?.taskallocatedTo === loggedUser._id &&
                              it?.taskfromFollowup === false &&
                              it?.taskClosed === false
                          )
                          const isleadbyEditable =
                            item.activityLog.length === 1 &&
                            item.leadBy._id === loggedUser._id
                          loggedUser.role === "Admin"
                            ? navigate("/admin/transaction/lead/leadEdit", {
                                state: {
                                  leadId: item._id,
                                  isReadOnly: !(
                                    isAllocatedToeditable||isleadbyEditable
                                  )
                                }
                              })
                            : navigate("/staff/transaction/lead/leadEdit", {
                                state: {
                                  leadId: item._id,
                                  isReadOnly: !(
                                    isAllocatedToeditable||isleadbyEditable
                                  )
                                }
                              })
                        }}
                        className="text-blue-400 hover:text-blue-500 font-semibold cursor-pointer"
                      >
                        View/Modify
                      </button>
                    </td>
                    <td className=" border border-t-0 border-b-0 border-gray-400 px-4 bg-white ">
                      {" "}
                      {item.netAmount}
                    </td>
                  </tr>

                  <tr className="bg-white">
                    <td className="border border-t-0 border-r-0  border-gray-400 px-4 py-0.5 ">
                      {item?.leadBy?.name}
                    </td>
                    <td className="border border-t-0 border-r-0 border-l-0  border-gray-400 px-4 py-0.5 "></td>
                    <td className="border  border-t-0 border-r-0 border-l-0  border-gray-400 px-4 py-0.5">
                      {item.allocatedBy?.name}
                    </td>
                    <td className="border  border-t-0 border-r-0 border-l-0  border-gray-400  px-4 py-0.5 ">
                      {/* {item.followUpDatesandRemarks.length} */}
                    </td>
                    <td className="border  border-t-0 border-r-0 border-l-0  border-gray-400 px-4 py-0.5 ">
                      {item.leadDate?.toString().split("T")[0]}
                    </td>
                    <td className="border border-t-0 border-gray-400   px-4 py-0.5 "></td>
                    <td className="border border-t-0 border-gray-400   px-4 py-0.5">
                      {" "}
                    </td>
                    <td className="border border-t-0 border-gray-400   px-4 py-0.5"></td>
                  </tr>
                  <tr>
                    <td colSpan="100%" className="bg-gray-300">
                      <div className="h-1"></div>
                    </td>
                  </tr>
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center text-gray-500 py-4">
                  {loading ? (
                    <div className="justify center">
                      <PropagateLoader color="#3b82f6" size={10} />
                    </div>
                  ) : (
                    <div>No Own Leads</div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
