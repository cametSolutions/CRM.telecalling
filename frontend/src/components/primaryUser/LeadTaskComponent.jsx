import React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { LeadhistoryModal } from "./LeadhistoryModal"
import { PropagateLoader } from "react-spinners"
import LeadModal from "./LeadModal"
import TasksubmissionModal from "./TasksubmissionModal"
import {
  Eye,
  Phone,
  Mail,
  User,
  Calendar,
  ArrowRight,
  Clock,
  UserPlus,
  UserCheck,
  IndianRupee,
  BellRing, // Follow-up
  History, // Event Log
  CalendarDays, // For Due Date
  Hourglass, //Remaining days
  RefreshCcw //Update icon
} from "lucide-react"
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
  const [historyList, setHistoryList] = useState([])
  const [showComponent, setShowComponent] = useState(false)
  const [selectedleadId, setselectedleadId] = useState(null)
  const [showhistoryModal, sethistoryModal] = useState(false)
  const navigate = useNavigate()
  const getRemainingDays = (dueDate) => {
    const today = new Date()
    const target = new Date(dueDate)

    // Zero out time to compare only dates
    today.setHours(0, 0, 0, 0)
    target.setHours(0, 0, 0, 0)

    const diffTime = target - today // milliseconds
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
  }
  const handleHistory = (Item) => {
    console.log(Item)
    console.log("h")
    setselectedData(Item.activityLog)
    setHistoryList(Item.activityLog)
    setselectedleadId(Item.leadId)
    sethistoryModal(true)
  }
  console.log(selectedleadId)
  console.log(selectedData)
  console.log(showhistoryModal)
  const handlecloseModal = () => {
    setselectedData([])
    setHistoryList([])
    sethistoryModal(false)
    setselectedleadId(null)
  }
  console.log(Data)
  console.log(selectedData)
  const renderTable = (data) => (
    <table className="border-collapse border border-gray-300 w-full text-sm">
      <thead className="whitespace-nowrap bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0 z-30 text-xs">
        <tr>
          <th className="border border-gray-300 px-3 py-1 text-left">
            <div className="flex items-center gap-1.5">
              <User className="w-3 h-3" />
              <span>Name</span>
            </div>
          </th>
          <th className="border border-gray-300 px-3 py-2 min-w-[140px] text-left">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3 h-3" />
              <span>Mobile</span>
            </div>
          </th>
          <th className="border border-gray-300 px-3 py-2 text-left">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3 h-3" />
              <span>Phone</span>
            </div>
          </th>
          <th className="border border-gray-300 px-3 py-1 text-left">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3 h-3" />
              <span>Email</span>
            </div>
          </th>
          <th className="border border-gray-300 px-3 py-1 min-w-[90px] text-left">
            Lead Id
          </th>
          {pending && (
            <>
              <th className="border border-gray-300 px-3 py-1">
                <div className="flex items-center gap-1.5 justify-center">
                  <CalendarDays className="w-3 h-3" />
                  <span>Due Date</span>
                </div>
              </th>
              <th className="border border-gray-300 px-3 py-1">
                <div className="flex items-center gap-1.5 justify-center">
                  <Hourglass className="w-3 h-3" />
                  <span>Remaining Days</span>
                </div>
              </th>
            </>
          )}

          <th className="border border-gray-300 px-3 py-1 min-w-[90px]">
            Action
          </th>
          <th className="border border-gray-300 px-3 py-1">Net Amount</th>
        </tr>
      </thead>
      <tbody>
        {data?.length > 0 ? (
          data.map((item, index) => (
            <React.Fragment key={index}>
              <tr className="bg-white border border-b-0 border-gray-300 hover:bg-blue-50 transition-colors">
                <td
                  onClick={() => setShowFullName(!showFullName)}
                  className={`px-3 min-w-[120px] py-1 cursor-pointer overflow-hidden font-medium text-gray-900 ${
                    showFullName
                      ? "whitespace-normal max-h-[3em]"
                      : "truncate whitespace-nowrap max-w-[120px]"
                  }`}
                  style={{ lineHeight: "1.5em" }}
                >
                  {item?.customerName?.customerName||item?.customerName}
                </td>
                <td className="px-3 py-1 text-gray-700">{item?.mobile}</td>
                <td className="px-3 py-1 text-gray-700">{item?.phone}</td>
                <td className="px-3 py-1 text-gray-600 truncate max-w-[180px]">
                  {item?.email}
                </td>
                <td className="px-3 py-1 font-medium text-blue-700">
                  {item?.leadId}
                </td>
                {pending && (
                  <>
                    <td className="border border-b-0 border-gray-300 px-3 py-1"></td>
                    <td className="border border-b-0 border-gray-300 px-3 py-1"></td>
                  </>
                )}

                <td className="border border-b-0 border-gray-300 px-2 py-1 text-center">
                  <button
                    type="button"
                    onClick={() => handleHistory(item)}
                    className="inline-flex items-center gap-1 px-2  py-1 text-xs font-semibold text-white bg-indigo-600 rounded hover:bg-indigo-700 transition-colors w-full justify-center"
                  >
                    <BellRing className="w-3.5 h-3.5" />
                    Event Log
                  </button>
                </td>
                <td className="border border-b-0 border-gray-300 px-3 py-1"></td>
              </tr>

              <tr className="font-medium bg-gradient-to-r from-gray-100 to-gray-50 text-xs text-gray-600">
                <td className="px-3 py-1 border-t border-gray-200">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>Lead by</span>
                  </div>
                </td>
                <td className="px-3 py-1 border-t border-gray-200">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-green-600" />
                    <span>Assigned to</span>
                  </div>
                </td>
                <td className="px-3 py-1 border-t border-gray-200 text-nowrap">
                  <div className="flex items-center gap-1.5">
                    <UserPlus className="w-3.5 h-3.5 text-purple-600" />
                    <span>Assigned by</span>
                  </div>
                </td>
                <td className="px-3 py-1 border-t border-gray-200">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-orange-600" />
                    <span>No. of Followups</span>
                  </div>
                </td>
                <td className="px-3 py-1 border-t border-gray-200 min-w-[120px]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>Lead Date</span>
                  </div>
                </td>
                {pending && (
                  <>
                    <td className="border border-t-0 border-b-0 border-gray-300 px-3  bg-white text-center text-lg font-semibold text-red-500">
                      {new Date(item.dueDate).toLocaleDateString("en-GB")}
                    </td>
                    <td className="border border-t-0 border-b-0 border-gray-300 px-3 bg-white text-center text-lg font-semibold text-red-500">
                      {getRemainingDays(item.dueDate)} days left
                    </td>
                  </>
                )}

                <td className="border border-t-0 border-b-0 border-gray-300 px-2 py-1 bg-white">
                  <button
                    onClick={() => {
                      const isAllocatedToeditable = item.activityLog.some(
                        (it) =>
                          it?.taskallocatedTo?._id === loggedUser._id &&
                          it?.taskClosed === false
                      )

                      loggedUser.role === "Admin"
                        ? navigate("/admin/transaction/lead/leadEdit", {
                            state: {
                              leadId: item._id,
                              isReadOnly: !isAllocatedToeditable
                            }
                          })
                        : navigate("/staff/transaction/lead/leadEdit", {
                            state: {
                              leadId: item._id,
                              isReadOnly: !isAllocatedToeditable
                            }
                          })
                    }}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors w-full justify-center"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View/Modify
                  </button>
                </td>
                <td className="border border-t-0 border-b-0 border-gray-300 px-3  bg-white font-semibold">
                  <div className="flex items-center justify-start">
                    <IndianRupee className="w-4 h-3.5 text-green-600 mr-1" />
                    <span className="text-lg font-semibold">
                      {" "}
                      {item.netAmount}
                    </span>
                  </div>
                </td>
              </tr>

              <tr className="bg-white">
                <td className="border border-t-0 border-gray-300 px-3 py-1 text-gray-900">
                  {item?.leadBy?.name}
                </td>
                <td className="border border-t-0 border-gray-300 px-3 py-1 text-gray-700">
                  {item?.taskallocatedTo?.name||"-"}
                </td>
                <td className="border border-t-0 border-gray-300 px-3 py-1 text-gray-700">
                  {item?.taskallocatedBy?.name||"-"}
                </td>
                <td className="border border-t-0 border-gray-300 px-3 py-1 text-gray-700"></td>
                <td className="border border-t-0 border-gray-300 px-3 py-1 text-gray-900">
                  {item.leadDate?.toString().split("T")[0]}
                </td>
                {pending && (
                  <>
                    <td className="border border-t-0 border-b-0 border-gray-300 px-3 py-1"></td>
                    <td className="border border-t-0 border-b-0 border-gray-300 px-3 py-1"></td>
                  </>
                )}

                <td className="border border-t-0 border-b-0 border-gray-300 px-2 py-1">
                  {" "}
                  {pending &&item.sameUser&& (
                    <button
                      onClick={() => {
                        console.log("h")
                        setShowComponent(true)
                        setselectedData(item)
                      }}
                      className="inline-flex items-center gap-1 px-2  py-1 text-xs font-semibold text-white bg-amber-500 rounded hover:bg-amber-600 transition-colors w-full justify-center"
                    >
                      <RefreshCcw className="w-3.5 h-3.5" />
                      Update
                    </button>
                  )}
                </td>
                <td className="border border-t-0 border-b-0 border-gray-300 px-3 py-1"></td>
              </tr>
              {pending && (
                <tr className="font-medium bg-gradient-to-r from-gray-100 to-gray-50 text-xs text-gray-600">
                  <td
                    colSpan={5}
                    className="px-3 py-1 border-t border-gray-200"
                  >
                    <span>Remark :</span>
                    <span className="ml-2 text-red-600">
                      {item?.matchedlog?.remarks}
                    </span>
                  </td>

                  <td className="border border-t-0 border-b-0 border-gray-300 px-3 bg-white"></td>
                  <td className="border border-t-0 border-b-0 border-gray-300 px-2 py-1 bg-white"></td>
                  <td className="border border-t-0 border-b-0 border-gray-300 px-3 bg-white"></td>
                </tr>
              )}

              {index !== data.length - 1 && (
                <tr>
                  <td colSpan="9" className="bg-gray-300">
                    <div className="h-[2px]"></div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))
        ) : (
          <tr>
            <td colSpan={8} className="text-center text-gray-500 py-6">
              {loading ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div>No Leads</div>
              )}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
  // console.log(showComponent)
  // console.log(selectedData)
  // console.log(Data)
  // console.log(Data[0].leads)
  // const a = Data[0]?.leads
  // const b = a.filter((lead) => lead.leadId === "00102")
  // console.log(b)
  return (
    <div className="flex-1 overflow-x-auto rounded-lg  overflow-y-auto  shadow-xl md:mx-5 mx-3 mb-3">
      <>
        {(() => {
          const hasLeads =
            Array.isArray(Data) &&
            Data.some(
              (group) => Array.isArray(group.leads) && group.leads.length > 0
            )

          if (!hasLeads || Data.length === 0) {
            return (
              <div className="text-center text-gray-500 py-6">
                No Task Available
              </div>
            )
          }

          return Data.map(({ staffName, leads }, index) => (
            <div key={staffName || `group-${index}`} className="mb-6">
              {staffName && (
                <h3 className="text-base font-semibold text-gray-800 mb-2">
                  {staffName}{" "}
                  <span className="text-sm text-gray-500">
                    ({leads?.length || 0} Leads)
                  </span>
                </h3>
              )}

              {/* only render table if there are leads */}
              {leads.length > 0 ? (
                renderTable(leads)
              ) : (
                <div className="text-center text-gray-400 py-3 text-sm">
                  No Task under {staffName || "this group"}.
                </div>
              )}
            </div>
          ))
        })()}
      </>
      {/* <>
        {Data && Data?.length > 0 ? (
          Data.map(({ staffName, leads }) => (
            <div key={staffName || "default"} className="mb-6">
              {staffName && (
                <h3 className="text-base font-semibold text-gray-800 mb-2">
                  {staffName}{" "}
                  <span className="text-sm text-gray-500">
                    ({leads?.length || 0} Leads)
                  </span>
                </h3>
              )}
              {renderTable(leads)}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-6">
            No Leads Available
          </div>
        )}
      </> */}
      {/* <table className=" border-collapse border border-gray-400 w-full text-sm">
        <thead className="whitespace-nowrap bg-blue-600 text-white sticky top-0 z-30">
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

            {pending && (
              <>
                <th className="border border-r-0 border-l-0 border-gray-400 px-4  min-w-[100px]">
                  Due Date
                </th>
                <th className="border border-r-0 border-l-0 border-gray-400 px-4  min-w-[100px]">
                  Remaining Days
                </th>
              </>
            )}

            <th className="border border-gray-400 px-4 ">Followup Date</th>
            <th className="border border-gray-400 px-4  min-w-[100px]">
              Action
            </th>
            <th className="border border-gray-400 px-4 py-2">Net Amount</th>
          </tr>
        </thead>
        <tbody className="">
          {Data && Data.length > 0 ? (
            Data?.map((item, index) => (
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
                    {pending ? item?.customerName : item?.customerName}
                  </td>
                  <td className="px-4 ">{item?.mobile}</td>
                  <td className="px-4 ">{item?.phone}</td>
                  <td className="px-4 ">{item?.email}</td>
                  <td className=" px-4 ">{item?.leadId}</td>
                  <td className="border border-b-0 border-gray-400 px-4 "></td>
                  {pending && (
                    <>
                      <td className="border border-b-0 border-gray-400 px-4 "></td>
                      <td className="border border-b-0 border-gray-400 px-4 "></td>
                    </>
                  )}

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
                  {pending && (
                    <>
                      <td className="px-4 min-w-[120px] font-medium text-red-500">
                        {new Date(item.dueDate).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-4 min-w-[120px] font-medium text-red-500">
                        {getRemainingDays(item.dueDate)} days left
                      </td>
                    </>
                  )}

                  <td className=" border border-t-0 border-b-0 border-gray-400 px-4 "></td>
                  <td className=" border border-t-0 border-b-0 border-gray-400 px-4  text-blue-400 hover:text-blue-500 hover:cursor-pointer">
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
                  {pending && (
                    <>
                      <td className="border border-t-0 border-gray-400 "></td>
                      <td className="border border-t-0 border-gray-400 "></td>
                    </>
                  )}
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
              <td colSpan={11} className="text-center text-gray-500 py-4">
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
      </table> */}
      {showhistoryModal && historyList && historyList.length > 0 && (
        <LeadhistoryModal
          selectedLeadId={selectedleadId}
          historyList={historyList}
          handlecloseModal={handlecloseModal}
        />
      )}
      {showComponent && (
        <TasksubmissionModal
          task={selectedData}
          refresh={refresh}
          pending={pending}
          setShowComponent={setShowComponent}
        />
      )}
      
    </div>
  )
}
