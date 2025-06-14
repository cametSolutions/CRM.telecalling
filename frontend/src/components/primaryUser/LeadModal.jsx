import { useEffect, useState } from "react"
import api from "../../api/api"
import { PropagateLoader } from "react-spinners"
import BarLoader from "react-spinners/BarLoader"
import { toast } from "react-toastify"
export default function LeadModal({
  refresh,
  Data,
  loggedUser,
  type,
  setShowComponent,
  pending
}) {
  const [selectedTab, setselectedTab] = useState("History")
  const [error, setError] = useState({})
  const [loading, setLoading] = useState(false)
  const [isOwner, setOwner] = useState(false)
  const [selectedDocId, setselectedDocid] = useState(Data.leadDocId)
  const [historyList, setHistoryList] = useState([])
  const [selectedLeadId, setSelectedLeadId] = useState(Data.leadId)
  const [isdemofollownotClosed, setisdemofollowedNotClosed] = useState(false)
  const [iseditable, setIsEditable] = useState(false)
  const [isAllocated, setIsAllocated] = useState(false)
  const [taskDetails, setTaskDetails] = useState({
    taskDescription: ""
  })
  const [editIndex, setEditIndex] = useState(null)
  const [taskLabel, settaskLabel] = useState("")
  const [formData, setFormData] = useState({})

  useEffect(() => {
    setHistoryList(Data.activityLog)
    let formattedTaskTo
    if (pending) {
      setTaskDetails((prev) => ({
        ...prev,
        taskassignedBy: Data?.matchedlog?.submittedUser,
        taskassignedmodel: Data?.matchedlog?.submissiondoneByModel,
        taskassignedDate: Data?.matchedlog?.allocationDate,
        taskDescriptionByassigner: Data?.matchedlog?.remarks,
        taskName: Data?.matchedlog?.taskTo,
        submissionDate: new Date(),
        leadId: Data.leadId,
        leadDocId: Data.leadDocId,
        allocatedTo: Data.allocatedTo,
        allocatedtomodel: Data?.matchedlog?.taskallocatedToModel,
        taskfromFollowup: Data?.matchedlog?.taskfromFollowup
      }))
      formattedTaskTo =
        Data?.matchedlog?.taskTo.charAt(0).toUpperCase() +
        Data?.matchedlog?.taskTo.slice(1).toLowerCase()
      settaskLabel(formattedTaskTo)
    } else {
      setTaskDetails((prev) => ({
        ...prev,
        taskassignedBy: Data.matchedlog.submittedUser,
        taskassignedmodel: Data.matchedlog?.submissiondoneByModel,
        taskassignedDate: Data.matchedlog?.allocationDate,
        taskDescriptionByassigner: Data.matchedlog?.remarks,
        taskDescription: Data.matchedlog?.taskDescription,
        tasksubmissionDate: Data.matchedlog?.tasksubmissionDate,
        taskName: Data.matchedlog?.taskTo,
        submissionDate: new Date(),
        leadId: Data.leadId,
        leadDocId: Data.leadDocId,
        allocatedTo: Data.allocatedTo,
        allocatedtomodel: Data.matchedlog?.taskallocatedToModel
      }))
      formattedTaskTo =
        Data?.matchedlog?.taskTo.charAt(0).toUpperCase() +
        Data?.matchedlog?.taskTo.slice(1).toLowerCase()
      settaskLabel(formattedTaskTo)
    }

    setOwner(
      Data?.activityLog[Data?.activityLog.length - 1]?.taskallocatedTo?._id ===
        loggedUser._id
    )
  }, [Data])
  const handleTaskSubmit = async () => {
    if (!pending) {
      setError((prev) => ({
        ...prev,
        submiterror: "cant update"
      }))
      return
    }

    if (taskDetails.taskDescription.trim() === "") {
      setError({ descriptionerror: "Please Fill it " })
      return
    }
    try {
      setLoading(true)

      const response = await api.post("/lead/taskSubmission", taskDetails)
      toast.success(response.data.message)
      setLoading(false)
      setShowComponent(false)
      refresh()
    } catch (error) {
      setLoading(false)
      toast.error("something wernt wrong")
      console.log("error:", error.message)
    }
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-40 ">
      <div
        className={`bg-white shadow-xl   text-center w-full ${
          selectedTab === "History" ? "md:w-1/2" : "md:w-1/4"
        } rounded-lg pb-3 `}
      >
        {loading && (
          <BarLoader
            cssOverride={{ width: "100%", height: "4px" }} // Tailwind's `h-4` corresponds to `16px`
            color="#4A90E2" // Change color as needed
          />
        )}
        <div className="text-gray-600 font-semibold space-x-6 mb-1">
          <span
            className={`hover:cursor-pointer pb-1 ${
              selectedTab === "History"
                ? "border-b-2 border-blue-500 text-blue-600"
                : ""
            }`}
            onClick={() => {
              setselectedTab("History")
              setIsAllocated(false)
              // setfollowupDateModal(false)
            }}
          >
            History
          </span>
          {type === "lead-Task" && (
            <span
              className={`hover:cursor-pointer pb-1 ${
                selectedTab === "Task"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : ""
              }`}
              onClick={() => {
                setselectedTab(taskLabel)

                setIsAllocated(false)
                // setfollowupDateModal(false)
              }}
            >
              {taskLabel}
              {/* {taskDetails?.taskName === "demo"
                ? "Demo"
                : taskDetails?.taskName === "programming"
                ? "Programming"
                : taskDetails?.taskName === "testing"
                ? "Testing"
                : ""} */}
            </span>
          )}
          {/* isHaveEditchoice &&  */}
          {/* {isOwner && (
            <span
              className={`hover:cursor-pointer pb-1 ${
                selectedTab === "Next Follow Up"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : ""
              }`}
              onClick={() => {
                // handlefollowupdate(selectedLeadId, selectedDocId)
                setselectedTab("Next Follow Up")
              }}
            >
              Next Follow Up
            </span>
          )} */}
        </div>
        <h1 className=" font-bold">
          {`${(() => {
            switch (selectedTab) {
              case "Next Follow Up":
                return "Next Follow Up"
              case "History":
                return "History"
              case "Demo":
                return "Demo"
              case "Programming":
                return "Programming"
              case "Testing":
                return "Testing"

              default:
                return selectedTab || ""
            }
          })()} of LEAD ID - ${selectedLeadId}`}
        </h1>
        {(() => {
          switch (selectedTab) {
            case "History":
              return (
                <div className="overflow-x-auto overflow-y-auto  md:max-h-64 lg:max-h-96 shadow-xl rounded-lg mx-3 md:mx-5">
                  <table className="w-full text-sm border-collapse">
                    <thead className="text-center sticky top-0 z-10">
                      <tr className="bg-indigo-100">
                        <th className="border border-indigo-200 p-2 min-w-[100px] ">
                          Date
                        </th>

                        <th className="border border-indigo-200 p-2 min-w-[100px] ">
                          User
                        </th>
                        <th className="border border-indigo-200 p-2 min-w-[100px] ">
                          Task
                        </th>

                        <th className="border border-indigo-200 p-2 w-fit min-w-[200px]">
                          Remark
                        </th>
                        <th className="border border-indigo-200 p-2 min-w-[100px] ">
                          Next Follow Up Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyList && historyList.length > 0 ? (
                        historyList.map((item, index) => {
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
                                <td className="border border-gray-200 p-2">
                                  {/* {new Date(item.nextfollowUpDate)
                                                  .toLocaleDateString("en-GB")
                                                  .split("/")
                                                  .join("-")} */}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr
                              key={index}
                              className={
                                index % 2 === 0 ? "bg-gray-50" : "bg-white"
                              }
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
                                        - {item?.taskallocatedTo?.name || ""}
                                      </span>
                                      <br />
                                      <span className="text-red-500">
                                        {item.taskTo}
                                      </span>
                                      {item.allocationDate && (
                                        <span>
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
                              <td className="border border-gray-200 p-2">
                                {item?.nextfollowUpDate
                                  ? new Date(item.nextfollowUpDate)
                                      .toLocaleDateString("en-GB")
                                      .split("/")
                                      .join("-")
                                  : "-"}
                              </td>
                            </tr>
                          )
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            className="text-center bg-white p-3 text-gray-500 italic"
                          >
                            No followUp s
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )
            case "Demo":
            case "Programming":
            case "Testing-&-implementation":
            case "Training":
            case "Coding-&-testing":
            case "Software-services":
            case "Customermeet":
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 shadow-xl border border-gray-200 p-3 rounded-lg mx-3 md:mx-5">
                  <div>
                    <label className="block text-sm mb-1 text-gray-700 font-semibold text-left">
                      Task Assigned By
                    </label>
                    <input
                      type="text"
                      value={taskDetails?.taskassignedBy?.name || ""}
                      className="w-full border border-gray-300 px-2 py-1 rounded  text-sm cursor-not-allowed bg-gray-200"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-700 font-semibold text-left">
                      Assigned Date
                    </label>
                    <input
                      type="date"
                      value={
                        taskDetails?.taskassignedDate
                          ?.toString()
                          .split("T")[0] || ""
                      }
                      readOnly
                      className="w-full border border-gray-300 px-2 py-1 rounded text-sm cursor-not-allowed bg-gray-200"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-1 text-gray-700 font-semibold text-left">
                      Description By Assigner
                    </label>
                    <textarea
                      readOnly
                      value={taskDetails?.taskDescriptionByassigner || ""}
                      rows={2}
                      className="w-full border border-gray-300 px-2 py-1 rounded text-sm focus:outline-none cursor-not-allowed bg-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-700 font-semibold text-left">
                      Task Date
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={
                        taskDetails?.submissionDate
                          .toLocaleDateString("en-GB")
                          .split("/")
                          .join("-") || ""
                      }
                      className={`w-full border border-gray-300 px-2 py-1 rounded  text-sm focus:outline-none ${
                        pending ? "bg-white" : "bg-gray-200 cursor-not-allowed"
                      }`}
                    />
                    {/* {demosubmitError.dateerror && (
                      <p className="text-red-500 text-left text-sm ">
                        {demosubmitError.dateerror}
                      </p>
                    )} */}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-1 text-gray-700 font-semibold text-left">
                      Description
                    </label>

                    <textarea
                      rows={2}
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
                          })) // ✅ Clear error
                        }
                      }}
                      className={`w-full border border-gray-300 px-2 py-1 rounded text-sm focus:outline-none ${
                        pending ? "bg-white" : "bg-gray-200 cursor-not-allowed"
                      }`}
                      placeholder="Enter description..."
                    />
                    <div className="flex justify-center">
                      {error.descriptionerror && (
                        <p className="text-red-500 text-left text-sm ">
                          {error.descriptionerror}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            case "Next Follow Up":
              return (
                <div className="text-center w-fullrounded-lg">
                  <div className=" rounded-lg grid grid-cols-1 gap-1  p-3 shadow-xl bg-white">
                    <div>
                      <label className="block text-left font-semibold text-gray-500">
                        Follow Up
                      </label>
                      <input
                        type="text"
                        readOnly
                        name="followUpDate"
                        // value={formData?.followUpDate || ""}
                        // value={
                        //   demoData.demoassignedDate
                        //     ? demoData.demoassignedDate.toString().split("T")[0]
                        //     : formData?.followUpDate
                        //     ? new Date(formData.followUpDate)
                        //         .toLocaleDateString("en-GB") // this gives dd/mm/yyyy
                        //         .replace(/\//g, "-") // change / to -
                        //     : ""
                        // }
                        className="rounded-md w-full py-1 px-2 border border-gray-200 focus:outline-none"
                        // onChange={handleDataChange}
                      />
                      {/* {errors.followUpDate && (
                        <p className="text-red-500">{errors.followUpDate}</p>
                      )} */}
                    </div>
                    <div>
                      <label className="block text-left font-semibold text-gray-500">
                        Next Follow Up
                      </label>
                      <input
                        type="date"
                        name="nextfollowUpDate"
                        disabled={isdemofollownotClosed}
                        // value={
                        //   demoData.demoallocatedDate ||
                        //   formData?.nextfollowUpDate
                        // }
                        className="rounded-md w-full py-1 px-2 border border-gray-200 focus:outline-none hover:cursor-pointer"
                        // onChange={handleDataChange}
                      ></input>
                      {/* {errors.nextfollowUpDate && (
                        <p className="text-red-500">
                          {errors.nextfollowUpDate}
                        </p>
                      )} */}
                      {/* {demoerror.demoDate && (
                        <p className="text-red-500">{demoerror.demoDate}</p>
                      )} */}
                    </div>
                    <div className="text-left flex items-center  gap-2 ">
                      <input
                        type="checkbox"
                        // disabled={demoData.demoDescription}
                        id="allocation"
                        className={`w-4 h-4  ${
                          isdemofollownotClosed ? "cursor-not-allowed" : ""
                        }`}
                        checked={isAllocated}
                        onChange={() => {
                          setIsAllocated(!isAllocated)
                          setFormData((prev) => ({
                            ...prev,
                            Remarks: "",
                            nextfollowUpDate: ""
                          }))
                        }}
                      />
                      <label htmlFor="allocation" className="text-sm">
                        Allocation
                      </label>
                    </div>
                    {isAllocated && (
                      <div className=" text-left">
                        <label
                          htmlFor="staffName"
                          className="block text-sm  font-medium  text-gray-700 "
                        >
                          Select Staff
                        </label>
                        <Select
                          //   options={allocationOptions}
                          isDisabled={isdemofollownotClosed}
                          //   value={
                          //     allocationOptions.find(
                          //       (option) =>
                          //         option.value === demoData.demoallocatedTo
                          //     ) || null
                          //   }
                          onChange={(selectedOption) => {
                            setDemodata((prev) => ({
                              ...prev,
                              demoallocatedTo: selectedOption.value
                            }))
                            setDemoError((prev) => ({
                              ...prev,
                              selectStaff: ""
                            }))
                          }}
                          className="w-full  focus:outline-none "
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              minHeight: "32px", // control height
                              height: "32px",
                              boxShadow: "none", // removes blue glow
                              borderColor: "gray",
                              cursor: state.isDisabled ? "not-allowed" : "",
                              backgroundColor: state.isDisabled
                                ? "#f3f4f6"
                                : "white",
                              color: state.isDisabled ? "#6b7280" : "black", // Tailwind's text-gray-500
                              opacity: state.isDisabled ? 0.7 : 1
                            }),
                            option: (base, state) => ({
                              ...base,
                              cursor: "pointer", // 👈 ensures pointer on option hover
                              backgroundColor: state.isFocused
                                ? "#f9f9f9"
                                : "white", // optional styling
                              color: "red",
                              paddingTop: "6px", // padding for dropdown items
                              paddingBottom: "6px"
                            }),
                            valueContainer: (base) => ({
                              ...base,
                              paddingTop: "0px", // Reduce vertical padding
                              paddingBottom: "0px",
                              paddingLeft: "8px",
                              height: "26px"
                            }),
                            indicatorsContainer: (base) => ({
                              ...base,
                              height: "30px"
                            }),
                            menuPortal: (base) => ({
                              ...base,
                              zIndex: 9999 // 🔥 Set high z-index here
                            }),
                            menu: (provided) => ({
                              ...provided,
                              maxHeight: "200px", // Set dropdown max height
                              overflowY: "auto" // Enable scrolling
                            }),
                            menuList: (provided) => ({
                              ...provided,
                              maxHeight: "200px", // Ensures dropdown scrolls internally
                              overflowY: "auto"
                            })
                          }}
                          menuPlacement="auto"
                          menuPosition="absolute"
                          menuPortalTarget={document.body} // Prevents nested scrolling issues
                          menuShouldScrollIntoView={false}
                        />
                      </div>
                    )}
                    {/* {demoerror.selectStaff && (
                      <p className="text-red-500 text-sm text-left">
                        {demoerror.selectStaff}
                      </p>
                    )} */}
                    <div>
                      <label className="block text-left">Remarks</label>
                      <textarea
                        rows={3}
                        disabled={isdemofollownotClosed}
                        name="Remarks"
                        className={`rounded-lg w-full border border-gray-200 focus:outline-none px-2 ${
                          isdemofollownotClosed
                            ? "cursor-not-allowed bg-gray-200"
                            : "cursor-text"
                        }`}
                        // value={formData?.Remarks || demoData.demoDescription}
                        // onChange={handleDataChange}
                      />
                      {/* {errors.Remarks && (
                        <p className="text-red-500">{errors.Remarks}</p>
                      )}
                      {demoerror.demoDescription && (
                        <p className="text-red-500">
                          {demoerror.demoDescription}
                        </p>
                      )} */}
                    </div>
                  </div>
                </div>
              )
          }
        })()}
        <div className="text-center flex justify-center">
          {error.submiterror && (
            <p className="text-red-500 text-left text-sm ">
              {error.submiterror}
            </p>
          )}
        </div>

        <div className="flex justify-center gap-3 mt-3 text-white">
          <button
            onClick={() => {
              setShowComponent(false)
              setError({})
            }}
            className="bg-gray-600 py-1 rounded-sm px-3 "
          >
            CLOSE
          </button>
          {selectedTab !== "History" && (
            <button
              onClick={handleTaskSubmit}
              className="bg-blue-600 py-1 rounded-sm px-3"
            >
              SUBMIT
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
