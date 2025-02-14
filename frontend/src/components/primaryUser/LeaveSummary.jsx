import React, { useState, useEffect } from "react"

import UseFetch from "../../hooks/useFetch"

const leaveSummary = () => {
  const [selectedIndex, setSelectedIndex] = useState(null)
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1 // JavaScript months are 0-based, so adding 1

  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [onsiteTypes, setOnsiteTypes] = useState({})

  // API URL with selected year and month
  const apiUrl = `/auth/getsomeall?year=${selectedYear}&month=${selectedMonth}`

  // Use custom useFetch hook
  const { data: newattende, loading, refreshHook } = UseFetch(apiUrl)
  const { data: attendance } = UseFetch(
    `/auth/getallAttendance?year=${selectedYear}&month=${selectedMonth}`
  )
 
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i)
  const months = [
    { name: "January", value: 1 },
    { name: "February", value: 2 },
    { name: "March", value: 3 },
    { name: "April", value: 4 },
    { name: "May", value: 5 },
    { name: "June", value: 6 },
    { name: "July", value: 7 },
    { name: "August", value: 8 },
    { name: "September", value: 9 },
    { name: "October", value: 10 },
    { name: "November", value: 11 },
    { name: "December", value: 12 }
  ]
  const selectedUser = (attendeeid) => {
    const filteredAttendance = attendance.filter((id) => {
      console.log(attendeeid)
      console.log(id.userId)
      return id.userId === attendeeid
    })
  }
  // Handle onsite type change
  const handleOnsiteTypeChange = (date, index, newType) => {
    setOnsiteTypes((prev) => ({
      ...prev,
      [`${date}-${index}`]: newType
    }))
  }
  
  return (
    <div className="p-3 text-center ">
     
      <h1 className="text-2xl font-bold mb-1">User Leave Summary</h1>
      <div className="flex justify-end space-x-4 m-4">
        {/* Year Select */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border p-2 rounded"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        {/* Month Select */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="border p-2 rounded"
        >
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.name}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="text-lg font-semibold text-blue-600">
          Loading users...
        </div>
      ) : (
        <div className="max-h-[500px] overflow-auto">
          {newattende?.length > 0 &&
            newattende.map((attendee, index) => (
              <div key={index}>
                {selectedIndex === null || selectedIndex === index ? (
                  <>
                    <div
                      className={`bg-white p-2 w-full shadow-lg rounded-xl mb-2 border flex items-center cursor-pointer overflow-x-auto max-w-full
                      ${
                        selectedIndex === index
                          ? "sticky top-0 z-20 bg-blue-400"
                          : "bg-green-300"
                      }
                    `}
                      // className="bg-white p-2 w-full shadow-lg rounded-xl mb-2 border flex items-center cursor-pointer overflow-x-auto max-w-full"
                      onClick={() => {
                        setSelectedIndex(selectedIndex === index ? null : index)
                        selectedUser(attendee.userId)
                      }}
                    >
                      <div className="text-md font-semibold text-gray-800 w-[215px] text-left p-2">
                        {attendee.name}
                      </div>

                      <div className="w-full sm:w-10/12 flex text-center ">
                        {[
                          {
                            label: "Present",
                            value: attendee.present,
                            // bg: "bg-green-300",
                            width: "w-[230px]"
                          },
                          {
                            label: "Absent",
                            value: attendee.absent,
                            // bg: "bg-orange-200",
                            width: "w-[115px]"
                          },
                          {
                            label: "Late Coming",
                            value: attendee.late,
                            // bg: "bg-pink-500",
                            width: "w-[110px]"
                          },
                          {
                            label: "Early Going",
                            value: attendee.earlyGoing,
                            // bg: "bg-green-700",
                            width: "w-[100px]"
                          },
                          {
                            label: "Not Marked",
                            value: attendee.notMarked,
                            // bg: "bg-rose-300",
                            width: "w-[130px]"
                          },
                          {
                            label: "Onsite",
                            value: attendee.onsite,
                            // bg: "bg-green-400",
                            width: "w-[510px]"
                          }
                          // {
                          //   label: "Edited",
                          //   value: attendee.edited,
                          //   // bg: "bg-gray-400",
                          //   width: "w-[106px]"
                          // }
                        ].map((item, idx) => (
                          <div
                            key={idx}
                            className={`flex flex-col items-center p-1 ${item.bg} ${item.width}`}
                          >
                            <span className="font-medium text-gray-600 text-sm">
                              {item.label}
                            </span>
                            <span>{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedIndex === index && (
                      <div className="bg-gray-100 rounded-lg shadow-md mt-2 p-4 overflow-auto max-h-[500px]">
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse table-fixed">
                            <thead className="bg-gray-300 sticky top-0">
                              <tr className="text-left text-xs sm:text-sm">
                                {[
                                  {
                                    label: "Date",
                                    width: "w-[180px] min-w-[180px]"
                                  },
                                  {
                                    label: "In Time",
                                    width: "w-[90px] min-w-[200px]"
                                  },
                                  {
                                    label: "Out Time",
                                    width: "w-[90px] min-w-[50px]"
                                  },
                                  {
                                    label: "Absent",
                                    width: "w-[100px] min-w-[60px]"
                                  },
                                  {
                                    label: "Late Coming",
                                    width: "w-[80px] min-w-[80px]"
                                  },
                                  {
                                    label: "Early Going",
                                    width: "w-[100px] min-w-[100px]"
                                  },
                                  {
                                    label: "Not Marked",
                                    width: "w-[100px] min-w-[100px]"
                                  },
                                  {
                                    label: "Onsite Place",
                                    width: "w-[120px] min-w-[120px]"
                                  },
                                  {
                                    label: "Onsite Name",
                                    width: "w-[130px] min-w-[130px]"
                                  },
                                  {
                                    label: "Onsite Type",
                                    width: "w-[100px] min-w-[120px]"
                                  },
                                  {
                                    label: "Onsite Period",
                                    width: "w-[100px] min-w-[110px]"
                                  }
                                  // {
                                  //   label: "Actions",
                                  //   width: "w-[100px] min-w-[100px]"
                                  // }
                                ].map((heading, i) => (
                                  <th
                                    key={i}
                                    className={`p-2 border border-gray-400 text-center ${heading.width}`}
                                  >
                                    {heading.label}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-300 bg-white text-xs sm:text-sm">
                              {Object.entries(attendee.attendancedates).map(
                                ([date, details], idx) => (
                                  <tr key={idx} className="text-center ">
                                    <td className="p-2 border border-gray-300 text-left w-[105px] min-w-[105px]">
                                      {date}
                                    </td>
                                    <td className="p-2 border border-gray-300 w-[200px] min-w-[200px]">
                                      <input
                                        type="text"
                                        className="w-full text-center border rounded p-1"
                                        defaultValue={details?.inTime || ""}
                                      />
                                    </td>
                                    <td className="p-2 border border-gray-300 w-[50px] min-w-[50px]">
                                      <input
                                        type="text"
                                        className="w-full text-center border rounded p-1"
                                        defaultValue={details?.outTime || ""}
                                      />
                                    </td>
                                    <td className="p-2 border border-gray-300 w-[80px] min-w-[80px]">
                                      {details?.absent || "-"}
                                    </td>
                                    <td className="p-2 border border-gray-300 w-[80px] min-w-[80px]">
                                      {details?.late
                                        ? `${details.late} minutes`
                                        : "-"}
                                    </td>
                                    <td className="p-2 border border-gray-300 w-[100px] min-w-[100px]">
                                      {details?.early
                                        ? `${details.early} minutes`
                                        : "-"}
                                    </td>
                                    <td className="p-2 border border-gray-300 w-[100px] min-w-[100px]">
                                      {details?.notemarked || "-"}
                                    </td>
                                    <td
                                      title={details?.onsite?.[0]?.place}
                                      className="p-2 border border-gray-300 w-[120px] min-w-[120px] truncate overflow-hidden whitespace-nowrap cursor-pointer"
                                    >
                                      {details?.onsite?.[0]?.place || "-"}
                                    </td>
                                    <td
                                      title={details?.onsite?.[0]?.siteName}
                                      className="p-2 border border-gray-300 w-[130px] min-w-[130px] truncate overflow-hidden whitespace-nowrap cursor-pointer"
                                    >
                                      {details?.onsite?.[0]?.siteName || "-"}
                                    </td>
                                    <td className="p-2 border border-gray-300 w-[120px] min-w-[120px]">
                                      {details?.onsite?.[0]?.onsiteType || "-"}
                                    </td>
                                    <td className="p-2 border border-gray-300 w-[110px] min-w-[110px]">
                                      {details?.onsite?.[0]?.period || "-"}
                                    </td>
                                    {/* <td className="p-2 border border-gray-300 w-[100px] min-w-[100px]">
                                      <button className="text-blue-500 hover:text-blue-700">
                                        <CiEdit size={20} />
                                      </button>
                                    </td> */}
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      // <div className="bg-gray-100 rounded-lg shadow-md mt-2 p-4 overflow-auto max-h-[500px]">
                      //   <div className="overflow-x-auto">
                      //     <table className="w-full border-collapse">
                      //       <thead className="bg-gray-300 sticky top-0">
                      //         <tr className="text-left text-xs sm:text-sm">
                      //           {[
                      //             { label: "Date", width: "min-w-[105px]" },
                      //             { label: "In Time", width: "min-w-[200px]" },
                      //             { label: "Out Time", width: "min-w-[50px]" },
                      //             { label: "Absent", width: "min-w-[80px]" },
                      //             { label: "Late", width: "min-w-[80px]" },
                      //             { label: "Early", width: "min-w-[100px]" },
                      //             {
                      //               label: "Not Marked",
                      //               width: "min-w-[10px]"
                      //             },
                      //             {
                      //               label: "Onsite Place",
                      //               width: "min-w-[10px]"
                      //             },
                      //             {
                      //               label: "Onsite Name",
                      //               width: "min-w-[13px]"
                      //             },
                      //             {
                      //               label: "Onsite Type",
                      //               width: "min-w-[10px]"
                      //             },
                      //             {
                      //               label: "Onsite Period",
                      //               width: "min-w-[110px]"
                      //             },
                      //             { label: "Actions", width: "min-w-[100px]" }
                      //           ].map((heading, i) => (
                      //             <th
                      //               key={i}
                      //               className={`p-2 border border-gray-400 ${heading.width} text-center`}
                      //             >
                      //               {heading.label}
                      //             </th>
                      //           ))}
                      //         </tr>
                      //       </thead>
                      //       <tbody className="divide-y divide-gray-300 bg-white text-xs sm:text-sm">
                      //         {Object.entries(attendee.attendancedates).map(
                      //           ([date, details], idx) => (
                      //             <tr key={idx} className="text-center">
                      //               <td className="p-2 border border-gray-300 bg-gray-300 text-left">
                      //                 {date}
                      //               </td>
                      //               <td className="p-2 border border-gray-300 bg-green-300">
                      //                 <input
                      //                   type="text"
                      //                   className=" text-center border rounded p-1"
                      //                   defaultValue={details?.inTime || ""}
                      //                 />
                      //               </td>
                      //               <td className="p-2 border border-gray-300">
                      //                 <input
                      //                   type="text"
                      //                   className=" text-center border rounded p-1"
                      //                   defaultValue={details?.outTime || ""}
                      //                 />
                      //               </td>
                      //               <td className="p-2 border border-gray-300">
                      //                 {details?.absent || "-"}
                      //               </td>
                      //               <td className="p-2 border border-gray-300">
                      //                 {details?.late || "-"}
                      //               </td>
                      //               <td className="p-2 border border-gray-300">
                      //                 {details?.early || "-"}
                      //               </td>
                      //               <td className="p-2 border border-gray-300">
                      //                 {details?.notMarked || "-"}
                      //               </td>
                      //               <td className="p-2 border border-gray-300">
                      //                 {details?.onsite?.[0]?.place || "-"}
                      //               </td>
                      //               <td className="p-2 border border-gray-300">
                      //                 {details?.onsite?.[0]?.siteName || "-"}
                      //               </td>
                      //               <td className="p-2 border border-gray-300">
                      //                 {details?.onsite?.[0]?.onsiteType || "-"}
                      //               </td>
                      //               <td className="p-2 border border-gray-300">
                      //                 {details?.onsite?.[0]?.period || "-"}
                      //               </td>
                      //               <td className="p-2 border border-gray-300">
                      //                 <button className="text-blue-500 hover:text-blue-700">
                      //                   <CiEdit size={20} />
                      //                 </button>
                      //               </td>
                      //             </tr>
                      //           )
                      //         )}
                      //       </tbody>
                      //     </table>
                      //   </div>
                      // </div>
                    )}
                  </>
                ) : null}
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default leaveSummary
