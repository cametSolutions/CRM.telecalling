import React, { useEffect, useState } from "react"
import UseFetch from "../../hooks/useFetch"
import { useNavigate } from "react-router-dom"
import { PropagateLoader } from "react-spinners"
import { Eye, Phone, Mail, User, Calendar, ArrowRight } from "lucide-react"

export default function OwnLeadList() {
  const [showFullName, setShowFullName] = useState(false)
  const [tableData, setTableData] = useState([])
  const [loggedUser, setLoggedUser] = useState(null)
  const [showFullEmail, setShowFullEmail] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedData, setselectedData] = useState([])
  const [selectedLeadId, setselectedLeadId] = useState(null)

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
  return (
    <div className="h-full ">
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
          <tbody>
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
                    <td className="  px-4 ">{item?.mobile}</td>
                    <td className="px-4 ">{item?.phone}</td>
                    <td className="px-4 ">{item?.email}</td>
                    <td className=" px-4 ">{item?.leadId}</td>
                    <td className="border border-b-0 border-gray-400 px-4 "></td>

                    <td className="border border-b-0 border-gray-400 px-1  text-blue-400 min-w-[50px] hover:text-blue-500 hover:cursor-pointer font-semibold">
                      <button
                        onClick={() => {
                          setselectedData(item?.activityLog)
                          setselectedLeadId(item?.leadId)
                          setShowModal(true)
                        }}
                      >
                        Event Log
                      </button>
                    </td>
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
                                    isAllocatedToeditable || isleadbyEditable
                                  )
                                }
                              })
                            : navigate("/staff/transaction/lead/leadEdit", {
                                state: {
                                  leadId: item._id,
                                  isReadOnly: !(
                                    isAllocatedToeditable || isleadbyEditable
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
                    <td className="border border-t-0 border-r-0 border-l-0  border-gray-400 px-4 py-0.5 ">
                      {item?.taskallocatedTo?.name || "-"}
                    </td>
                    <td className="border  border-t-0 border-r-0 border-l-0  border-gray-400 px-4 py-0.5">
                      {item.taskallocatedBy?.name || "-"}
                    </td>
                    <td className="border  border-t-0 border-r-0 border-l-0  border-gray-400  px-4 py-0.5 "></td>
                    <td className="border  border-t-0 border-r-0 border-l-0  border-gray-400 px-4 py-0.5 ">
                      {item.leadDate?.toString().split("T")[0]}
                    </td>
                    <td className="border border-t-0 border-gray-400   px-4 py-0.5 "></td>
                    <td className="border border-t-0 border-gray-400   px-4 py-0.5"></td>
                    <td className="border border-t-0 border-gray-400   px-4 py-0.5"></td>
                  </tr>
                  {index !== tableData.length - 1 && (
                    <tr>
                      <td colSpan="100%" className="bg-gray-400">
                        <div className="h-0.5"></div>
                      </td>
                    </tr>
                  )}
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
                    <div>!No Own Leads</div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showModal && selectedData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-40">
          <div className="relative overflow-x-auto overflow-y-auto md:max-h-64 lg:max-h-96 shadow-xl rounded-lg mx-3 md:mx-5 px-7 p-3 bg-white w-full max-w-4xl">
            {/* Close Button */}
            <button
              onClick={() => {
                setselectedLeadId(null)
                setselectedData([])
                setShowModal(false)
              }}
              className="absolute top-2 right-2  text-red-500 font-bold hover:text-red-600 text-lg"
            >
              ✕
            </button>

            {/* Header */}
            <div className="flex justify-center text-xl font-bold gap-2 mb-3">
              <span>Lead Id:</span>
              <span className="text-indigo-600">{selectedLeadId}</span>
            </div>

            {/* Table */}
            <table className="w-full text-sm border-collapse text-center">
              <thead className="text-center sticky top-0 z-10">
                <tr className="bg-indigo-100">
                  <th className="border border-indigo-200 p-2 min-w-[100px]">
                    Date
                  </th>
                  <th className="border border-indigo-200 p-2 min-w-[100px]">
                    User
                  </th>
                  <th className="border border-indigo-200 p-2 min-w-[100px]">
                    Task
                  </th>
                  <th className="border border-indigo-200 p-2 w-fit min-w-[200px]">
                    Remark
                  </th>
                  
                
                </tr>
              </thead>
              <tbody>
                {selectedData && selectedData.length > 0 ? (
                  selectedData.map((item, index) => {
                    const hasFollowerData =
                      Array.isArray(item.folowerData) &&
                      item.folowerData.length > 0

                    return hasFollowerData ? (
                      item.folowerData.map((subItem, subIndex) => (
                        <tr
                          key={`${index}-${subIndex}`}
                          className={
                            (index + subIndex) % 2 === 0
                              ? "bg-gray-50"
                              : "bg-white"
                          }
                        >
                          {loggedUser?.role === "Admin" && (
                            <td className="border border-gray-200 p-2">
                              {item?.followedId?.name}
                            </td>
                          )}
                          <td className="border border-gray-200 p-2">
                            {new Date(subItem.followerDate)
                              .toLocaleDateString("en-GB")
                              .split("/")
                              .join("-")}
                          </td>
                          <td className="border border-gray-200 p-2">
                            {subItem?.followerDescription || "N/A"}
                          </td>
                          <td className="border border-gray-200 p-2"></td>
                        </tr>
                      ))
                    ) : (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="border border-gray-200 p-2">
                          {new Date(item.submissionDate)
                            .toLocaleDateString("en-GB")
                            .split("/")
                            .join("-")}
                        </td>
                        <td className="border border-gray-200 p-2">
                          {item?.submittedUser?.name}
                        </td>
                        <td className="border border-gray-200 p-2 min-w-[160px]">
                          <div>
                            {item?.taskallocatedTo ? (
                              <>
                                <span>{item?.taskBy || "N/A"}</span>
                                <span className="text-red-500">
                                  {" "}
                                  - {item?.taskallocatedTo?.name || ""}
                                </span>
                                <br />
                                <span className="text-red-500">
                                  {item.taskTo}
                                </span>
                                {item.allocationDate && (
                                  <span>
                                    {" "}
                                    - on(
                                    {new Date(
                                      item.allocationDate
                                    ).toLocaleDateString("en-GB")}
                                    )
                                  </span>
                                )}
                              </>
                            ) : (
                              <span>{item.taskBy}</span>
                            )}
                          </div>
                        </td>
                        <td className="border border-gray-200 p-2">
                          {item?.remarks || "N/A"}
                        </td>
                        {/* {label === "followup" && (
                          <td className="border border-gray-200 p-2">
                            {item?.nextfollowUpDate
                              ? new Date(item.nextfollowUpDate)
                                  .toLocaleDateString("en-GB")
                                  .split("/")
                                  .join("-")
                              : "-"}
                          </td>
                        )} */}
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center bg-white p-3 text-gray-500 italic"
                    >
                      No followUps
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
