import React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { PropagateLoader } from "react-spinners"
import LeadModal from "./LeadModal"
export default function LeadTaskComponent({
  type,
  Data,
  loading,
  loggedUser,
  refresh,
  pending
}) {
  const [showFullName, setShowFullName] = useState(false)
  const [selectedData, setselectedData] = useState({})
  const [showComponent, setShowComponent] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="flex-1 overflow-x-auto rounded-lg text-center overflow-y-auto  shadow-xl md:mx-5 mx-3 mb-3">
      <table className=" border-collapse border border-gray-400 w-full text-sm">
        <thead className=" whitespace-nowrap bg-blue-600 text-white sticky top-0 z-30">
          <tr>
            <th className="border border-r-0 border-gray-400 px-4 ">SNO.</th>
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
        <tbody className="">
          {Data && Data.length > 0 ? (
            Data.map((item, index) => (
              <React.Fragment key={index}>
                <tr className="bg-white border border-gray-400 border-b-0">
                  <td className="  px-4 border border-b-0 border-gray-400"></td>
                  <td
                    onClick={() => setShowFullName(!showFullName)}
                    className={`px-4 cursor-pointer overflow-hidden ${
                      showFullName
                        ? "whitespace-normal max-h-[3em]" // ≈2 lines of text (1.5em line-height)
                        : "truncate whitespace-nowrap max-w-[120px]"
                    }`}
                    style={{ lineHeight: "1.5em" }} // fine-tune as needed
                  >
                    {pending ? item.customerName : item?.customerName}
                  </td>
                  <td className="px-4 ">{item.mobile}</td>
                  <td className="px-4 ">0481</td>
                  <td className="px-4 ">{item.email}</td>
                  <td className=" px-4 ">{item.leadId}</td>
                  <td className="border border-b-0 border-gray-400 px-4 "></td>

                  <td className="border border-b-0 border-gray-400 px-1  text-blue-400 min-w-[50px] hover:text-blue-500 hover:cursor-pointer font-semibold">
                    <button
                      onClick={() =>
                        loggedUser.role === "Admin"
                          ? navigate("/admin/transaction/lead/leadEdit", {
                              state: {
                                leadId: item.leadDocId,
                                isReadOnly: !(item.matchedlog.taskClosed
                                  ? false
                                  : item.matchedlog.taskallocatedTo._id ===
                                    loggedUser._id)
                              }
                            })
                          : navigate("/staff/transaction/lead/leadEdit", {
                              state: {
                                leadId: item.leadDocId,
                                isReadOnly: !(item.matchedlog.taskClosed
                                  ? false
                                  : item.matchedlog.taskallocatedTo._id ===
                                    loggedUser._id)
                              }
                            })
                      }
                      className="text-blue-400 hover:text-blue-500 font-semibold cursor-pointer"
                    >
                      View / Modify
                    </button>
                  </td>
                  <td className="borrder border-b-0 border-gray-400 px-4 "></td>
                </tr>

                <tr className=" font-semibold bg-gray-200">
                  <td className=" px-4 border border-b-0 border-t-0 border-gray-400">
                    {index + 1}
                  </td>
                  <td className=" px-4 ">Leadby</td>
                  <td className=" px-4">Assignedto</td>
                  <td className=" px-4 ">Assignedby</td>
                  <td className="px-4 ">No. of Followups</td>
                  <td className="px-4 min-w-[120px]">Lead Date</td>
                  <td className=" border border-t-0 border-b-0 border-gray-400 px-4 ">
                    {/* {new Date(
                      item.followUpDatesandRemarks[
                        item.followUpDatesandRemarks.length - 1
                      ]?.nextfollowUpDate
                    )
                      .toLocaleDateString("en-GB")
                      .split("/")
                      .join("-")} */}
                  </td>
                  <td className=" border border-t-0 border-b-0 border-gray-400 px-4  text-blue-400 hover:text-blue-500 hover:cursor-pointer">
                    {type === "followup" ? (
                      <button
                        type="button"
                        onClick={() => {
                          setselectedData({
                            activityLog: item?.activityLog,
                            leadId: item?.leadId,
                            leadDocId: item?.leadDocId,
                            allocatedTo: item?.allocatedTo
                          })
                          setShowComponent(true)
                        }}
                      >
                        Follow Up
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setselectedData({
                            activityLog: item?.activityLog,
                            leadId: item?.leadId,
                            leadDocId: item?.leadDocId,
                            allocatedTo: item?.allocatedTo,
                            allocatedtomodel:
                              item?.matchedlog?.taskallocatedToModel,
                            matchedlog: item?.matchedlog
                          })
                          setShowComponent(true)
                        }}
                      >
                        Task
                      </button>
                    )}
                  </td>
                  <td className=" border border-t-0 border-b-0 border-gray-400 px-4 ">
                    {item.netAmount}{" "}
                  </td>
                </tr>

                <tr className="bg-white">
                  <td className="border border-t-0 border-r-0 border-b-0  border-gray-400 px-4 py-0.5 "></td>
                  <td className="border border-t-0 border-r-0 border-b-0 border-gray-400 px-4 py-0.5 ">
                    {item?.leadBy?.name}
                  </td>
                  <td className="border border-t-0 border-r-0 border-l-0 border-b-0 border-gray-400 px-4 py-0.5 ">
                    {item?.matchedlog?.taskallocatedTo?.name}
                  </td>
                  <td className="border  border-t-0 border-r-0 border-l-0 border-b-0 border-gray-400 px-4 py-0.5">
                    {item?.matchedlog?.submittedUser?.name}
                  </td>
                  <td className="border  border-t-0 border-r-0 border-l-0 border-b-0 border-gray-400  px-4 py-0.5 ">
                    {/* {item.followUpDatesandRemarks.length} */}
                  </td>
                  <td className="border  border-t-0 border-r-0 border-l-0 border-b-0 border-gray-400 px-4 py-0.5 ">
                    {new Date(item.leadDate).toLocaleDateString("en-GB")}
                  </td>
                  <td className="border border-t-0 border-b-0 border-gray-400   px-4 py-0.5 "></td>
                  <td className="border border-t-0 border-b-0 border-gray-400   px-4 py-0.5"></td>
                  <td className="border border-t-0 border-b-0 border-gray-400   px-4 py-0.5"></td>
                </tr>

                <tr className="bg-gray-100">
                  <td className="border border-l-1 border-t-0 border-gray-400 "></td>
                  <td
                    colSpan={5}
                    className="text-center py-1 font-semibold border border-t-0 border-gray-400"
                  >
                    <div className="flex  w-full">
                      {/* <span className="min-w-[100px]"></span> */}
                      <span className="mx-2">
                        {item?.matchedlog?.submittedUser?.name} -
                      </span>
                      <span className="mx-2">{item?.matchedlog?.taskBy} -</span>
                      <span>{item?.matchedlog?.remarks}</span>
                    </div>
                  </td>
                  <td className="border border-t-0 border-gray-400 "></td>
                  <td className="border border-t-0 border-gray-400 "></td>
                  <td className="border border-t-0 border-gray-400 "></td>
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
              <td colSpan={9} className="text-center text-gray-500 py-4">
                {loading ? (
                  <div className="justify center">
                    <PropagateLoader color="#3b82f6" size={10} />
                  </div>
                ) : (
                  "No data available."
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {showComponent && selectedData && (
        <LeadModal
          refresh={refresh}
          Data={selectedData}
          loggedUser={loggedUser}
          type={type}
          setShowComponent={setShowComponent}
          pending={pending}
        />
      )}
    </div>
  )
}
