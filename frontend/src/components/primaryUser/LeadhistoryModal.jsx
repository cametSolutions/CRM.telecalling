
export const LeadhistoryModal = ({ selectedLeadId,historyList,handlecloseModal }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-40 ">
      <div className="bg-white shadow-xl   text-center md:w-auto  w-full px-2 md:px-5 rounded-lg pb-3 ">
        <div className="font-semibold space-x-6 mb-1 text-blue-500">
          <h2 className="text-lg underline decoration-2 underline-offset-8">History</h2>
        </div>

        <h1 className=" font-bold">{` LEAD ID - ${selectedLeadId}`}</h1>

        <div className="overflow-x-auto overflow-y-auto  md:max-h-64 lg:max-h-96 shadow-xl rounded-lg">
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
                  Remarks
                </th>
                <th className="border border-indigo-200 p-2 min-w-[100px] text-nowrap">
                  Next FollowUp Date
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
                        <td className="border border-gray-200 p-2">
                          {new Date(subItem.followerDate)
                            .toLocaleDateString("en-GB")
                            .split("/")
                            .join("-")}
                        </td>
                        <td className="border border-gray-200 p-2">
                          {item?.followedId?.name}
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
                      <td className="border border-gray-200 p-2 text-nowrap">
                        {new Date(item.submissionDate)
                          .toLocaleDateString("en-GB")
                          .split("/")
                          .join("-")}
                      </td>
                      <td className="border border-gray-200 p-2 text-nowrap">
                        {item?.submittedUser?.name}
                      </td>
                      <td className="border border-gray-200 p-2 min-w-[160px] text-nowrap">
                        <div className="flex justify-center">
                          {item.taskTo ? (
                            <>
                              <span>{item.taskBy}</span>-
                              <span>{item.taskallocatedTo?.name}</span>
                            </>
                          ) : (
                            item.taskBy
                          )}
                        </div>

                        {item.taskTo && (
                          <>
                            <span>{item.taskTo}</span>
                            {item.allocationDate && (
                              <span>
                                -on(
                                {new Date(
                                  item.allocationDate
                                ).toLocaleDateString("en-GB")}
                                )
                              </span>
                            )}
                          </>
                        )}
                      </td>
                      <td className="border border-gray-200 p-2">
                        {item?.remarks || "N/A"}
                      </td>
                      <td className="border border-gray-200 p-2">
                        {item?.nextFollowUpDate
                          ? new Date(item?.nextFollowUpDate)
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

        <button
          onClick={() => handlecloseModal()}
          className="bg-gray-500 hover:bg-gray-600 rounded-lg px-3 py-1 mt-3 text-white "
        >
          CLOSE
        </button>
      </div>
    </div>
  )
}
