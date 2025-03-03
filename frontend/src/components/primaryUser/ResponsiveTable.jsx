import React from "react"

const ResponsiveTable = ({
  attendee,
  user,
  handleAttendance,
  handleLeave,
  handleOnsite,
  handleScroll,
  modalOpen,
  holiday
}) => {
  return (
    <div className="relative">
      <div
        className="overflow-x-auto max-h-[calc(100vh-270px)]"
        onScroll={handleScroll}
      >
        <table className="w-full min-w-max border-collapse text-sm">
          {/* <thead className={`sticky top-0 z-20 bg-white}> */}
          <thead
            className={` ${
              !modalOpen && " text-sm  sticky top-0 z-20 bg-gray-100"
            }`}
          >
            <tr>
              <th
                rowSpan="2"
                className={`border border-gray-300 p-2 ${
                  !modalOpen ? "sticky left-0 z-10" : ""
                } bg-gray-100`}
                // className={`border border-gray-300 p-2 sticky ${ !modalOpen&&left-0  z-10 }bg-gray-100`}
              >
                Date
              </th>
              <th colSpan="2" className="border border-gray-300 p-1">
                Present
              </th>
              <th colSpan="4" className="border border-gray-300 p-1 ">
                Leave
              </th>
              <th rowSpan="2" className="border border-gray-300 p-2">
                Early Out
              </th>
              <th rowSpan="2" className="border border-gray-300 p-2">
                Late In
              </th>
              <th rowSpan="2" className="border border-gray-300 p-2">
                Not Marked
              </th>
              <th colSpan="4" className="border border-gray-300 p-1">
                Onsite
              </th>
            </tr>
            <tr>
              <th className="border border-gray-300 p-1">In Time</th>
              <th className="border border-gray-300 p-">Out Time</th>
              <th className="border border-gray-300 p-1 ">CL</th>
              <th className="border border-gray-300 p-2">PL</th>
              <th className="border border-gray-300 p-1 ">Comp.leave</th>
              <th className="border border-gray-300 p-1">Others</th>
              <th className="border border-gray-300 p-1 ">Place</th>
              <th className="border border-gray-300 p-1 ">Site Name</th>
              <th className="border border-gray-300 p-1">Onsite Type</th>
              <th className="border border-gray-300 p-1">Period</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(attendee.attendancedates).map(
              ([date, details], idx) => {
                const currentDate = new Date(date)

                const isSunday = currentDate.getDay() === 0 // 0 represents Sunday
                const isHoliday = holiday.some((item) => item.date === date) // Assuming `holidays` is an array of holiday dates
                const holidayName =
                  holiday.find((h) => h.date === date)?.holyname || null
                const highlightClass =
                  isSunday || isHoliday ? "bg-green-200" : "" // Light green background

                return (
                  <tr key={idx} className="hover:bg-gray-50 text-center">
                    <td className="border border-gray-300 p-2 sticky left-0 bg-white">
                      {date}
                    </td>
                    <td
                      className="border border-gray-300 p-2"
                      onClick={() => {
                        if (user?.role === "Admin") {
                          handleAttendance(
                            date,
                            "Attendance",
                            details?.inTime,
                            details?.outTime
                          )
                        }
                      }}
                    >
                      {details?.inTime || "-"}
                    </td>
                    <td
                      className="border border-gray-300 p-2"
                      onClick={() => {
                        if (user?.role === "Admin") {
                          handleAttendance(
                            date,
                            "Attendance",
                            details?.inTime,
                            details?.outTime
                          )
                        }
                      }}
                    >
                      {details?.outTime || "-"}
                    </td>
                    {/* If it's Sunday or Holiday, merge the columns and display text in center */}
                    {isSunday || holidayName ? (
                      <>
                        <td
                          colSpan={6}
                          className={`border border-gray-300 p-2 text-center font-semibold ${highlightClass}`}
                        >
                          {isSunday ? "SUNDAY" : holidayName}
                        </td>
                        <td
                          className={`border border-gray-300 p-2 ${highlightClass}`}
                        >
                          {details?.notMarked}
                        </td>
                      </>
                    ) : (
                      <>
                        <td
                          className={`border border-gray-300 p-2 ${highlightClass}`}
                          onClick={() => {
                            if (user?.role === "Admin") {
                              handleLeave(
                                date,
                                "Leave",
                                {
                                  field: details?.casualLeave
                                    ? "casual Leave"
                                    : details?.compensatoryLeave
                                    ? "compensatory Leave"
                                    : details?.privileageLeave
                                    ? "privileage Leave"
                                    : details?.otherLeave
                                    ? "other Leave"
                                    : null,
                                  value:
                                    details?.casualLeave ||
                                    details?.compensatoryLeave ||
                                    details?.privileageLeave ||
                                    details?.otherLeave
                                },
                                details?.halfDayperiod,
                                details?.reason
                              )
                            }
                          }}
                        >
                          {details?.casualLeave || "-"}
                        </td>
                        <td
                          className={`border border-gray-300 p-2 ${highlightClass}`}
                          onClick={() => {
                            if (user?.role === "Admin") {
                              handleLeave(
                                date,
                                "Leave",
                                {
                                  field: details?.casualLeave
                                    ? "casual Leave"
                                    : details?.compensatoryLeave
                                    ? "compensatory Leave"
                                    : details?.privileageLeave
                                    ? "privileage Leave"
                                    : details?.otherLeave
                                    ? "other Leave"
                                    : null,
                                  value:
                                    details?.casualLeave ||
                                    details?.compensatoryLeave ||
                                    details?.privileageLeave ||
                                    details?.otherLeave
                                },
                                details?.halfDayperiod,
                                details?.reason
                              )
                            }
                          }}
                        >
                          {details?.privileageLeave || "-"}
                        </td>
                        <td
                          className={`border border-gray-300 p-2 ${highlightClass}`}
                          onClick={() => {
                            if (user?.role === "Admin") {
                              handleLeave(
                                date,
                                "Leave",
                                {
                                  field: details?.casualLeave
                                    ? "casual Leave"
                                    : details?.compensatoryLeave
                                    ? "compensatory Leave"
                                    : details?.privileageLeave
                                    ? "privileage Leave"
                                    : details?.otherLeave
                                    ? "other Leave"
                                    : null,
                                  value:
                                    details?.casualLeave ||
                                    details?.compensatoryLeave ||
                                    details?.privileageLeave ||
                                    details?.otherLeave
                                },
                                details?.halfDayperiod,
                                details?.reason
                              )
                            }
                          }}
                        >
                          {details?.compensatoryLeave || "-"}
                        </td>
                        <td
                          className={`border border-gray-300 p-2 ${highlightClass}`}
                          onClick={() => {
                            if (user?.role === "Admin") {
                              handleLeave(
                                date,
                                "Leave",
                                {
                                  field: details?.casualLeave
                                    ? "casual Leave"
                                    : details?.compensatoryLeave
                                    ? "compensatory Leave"
                                    : details?.privileageLeave
                                    ? "privileage Leave"
                                    : details?.otherLeave
                                    ? "other Leave"
                                    : null,
                                  value:
                                    details?.casualLeave ||
                                    details?.compensatoryLeave ||
                                    details?.privileageLeave ||
                                    details?.otherLeave
                                },
                                details?.halfDayperiod,
                                details?.reason
                              )
                            }
                          }}
                        >
                          {details?.otherLeave || "-"}
                        </td>
                        <td
                          className={`border border-gray-300 p-2 ${highlightClass}`}
                        >
                          {details?.early ? `${details.early} minutes` : "-"}
                        </td>
                        <td
                          className={`border border-gray-300 p-2 ${highlightClass}`}
                        >
                          {details?.late ? `${details.late} minutes` : "-"}
                        </td>
                        <td
                          className={`border border-gray-300 p-2 ${highlightClass}`}
                        >
                          {details?.notMarked}
                        </td>
                      </>
                    )}

                    {/* Remaining columns without highlight */}
                    <td className="border border-gray-300 p-2">
                      {details?.onsite?.[0]?.place || "-"}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {details?.onsite?.[0]?.siteName || "-"}
                    </td>
                    <td
                      className="border border-gray-300 p-2"
                      onClick={() => {
                        if (
                          user?.role === "Admin"
                        ) {
                          handleOnsite(
                            date,
                            "Onsite",
                            details?.onsite?.[0]?.onsiteType,
                            details?.onsite?.[0].halfDayperiod,
                            details?.onsite[0]?.description
                          )
                        }
                      }}
                    >
                      {details?.onsite?.[0]?.onsiteType || "-"}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {details?.onsite?.[0]?.onsiteType === "Half Day"
                        ? details?.onsite?.[0].halfDayPeriod
                        : "-"}
                    </td>
                  </tr>
                )
              }
            )}

          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ResponsiveTable
