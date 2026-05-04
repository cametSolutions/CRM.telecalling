// import { useEffect, useState, useRef } from "react"
// import {
//   MdSupportAgent,
//   MdAdminPanelSettings,
//   MdScience,
//   MdBarChart
// } from "react-icons/md"
// import { FiChevronDown, FiX } from "react-icons/fi"
// import { FaSpinner, FaUserCircle } from "react-icons/fa"
// import { toast } from "react-toastify"
// import { Link } from "react-router-dom"
// import UseFetch from "../../../hooks/useFetch"
// import { getLocalStorageItem } from "../../../helper/localstorage"

// import api from "../../../api/api"
// export default function PrimaryUserDashBoard() {
//   const [leaveList, setTodayLeaveList] = useState([])
//   const [announcement, setAnnouncementText] = useState("")
//   const [achieverLoader, setachieverLoader] = useState(false)
//   const [announcementLoader, setannouncementLoader] = useState(false)
//   const [birthdayAlreadyShown, setbirthdayshown] = useState(false)
//   const [selectedQuarterlyStaffs, setSelectedQuarterlyStaffs] = useState([])
//   const [quarterlyTitle, setQuarterlyTitle] = useState("")
//   const [selectedYearlyStaffs, setSelectedYearlyStaffs] = useState([])
//   const [birthdays, setCurrentmonthBirthdays] = useState([])
//   const [allStaffs, setallStaffs] = useState([])
//   const [onsitelist, setOnsitelist] = useState([])
//   const [showQuarterly, setShowQuarterly] = useState(false)
//   const [showYearly, setShowYearly] = useState(false)
//   const [user, setUser] = useState(null)
//   const [showBirthdayPopup, setShowBirthdayPopup] = useState(false)
//   const [birthdayPerson, setBirthdayPerson] = useState(null)
//   const [dashboardHeight, setDashboardHeight] = useState("auto")
//   const [currentyearholydays, setcurrentyearHoliday] = useState([])
//   const headerRef = useRef(null)
//   const { data: todayleavelist } = UseFetch("/auth/getallUsersLeave?today=true")
//   const { data: currrentMonthBirthDays } = UseFetch(
//     "/auth/getallcurrentmonthBirthdays"
//   )
//   const { data: todayOnsite } = UseFetch("/auth/getallUsersOnsite?today=true")
//   const { data: staffs } = UseFetch("/auth/getallStaffs")
//   const { data: acheivementlist, refreshHook } = UseFetch(
//     "/dashboard/getcurrentquarterlyAchiever"
//   )
// console.log("hh")
//   const { data: holydata } = UseFetch("/customer/getallholy")
//   const { data: announcementlist } = UseFetch(
//     "/dashboard/getcurrentAnnouncement"
//   )
//   useEffect(() => {
//     const userData = getLocalStorageItem("user")

//     setUser(userData)
//   }, [])

//   useEffect(() => {
//     if (headerRef.current) {
//       const headerHeight = headerRef.current.getBoundingClientRect().height
//       setDashboardHeight(`calc(100vh - ${headerHeight}px)`) // Subtract header height from full viewport height
//     }
//   }, [])
//   useEffect(() => {
//     if (holydata && holydata.length) {
//       const now = new Date()
//       const currentMonth = now.getMonth() // 0 = Jan, 11 = Dec
//       const currentYear = now.getFullYear()

//       const currentMonthHolidays = holydata.filter((item) => {
//         const date = new Date(item.holyDate)
//         return (
//           date.getFullYear() === currentYear && date.getMonth() === currentMonth
//         )
//       })

//       setcurrentyearHoliday(currentMonthHolidays)
//     }
//   }, [holydata])
//   console.log("hhh")
//   useEffect(() => {
//     const wishValue = JSON.parse(localStorage.getItem("wish"))
//     if (wishValue) {
//       setbirthdayshown(true)
//     }
//   })
//   useEffect(() => {
//     if (birthdays && birthdays.length > 0 && !birthdayAlreadyShown) {
//       // Show popup for the first birthday person
//       // In real implementation, you might want to handle multiple birthdays differently

//       // setShowBirthdayPopup(true)
//       const today = new Date()
//       const todayMonthDay = `${String(today.getMonth() + 1).padStart(
//         2,
//         "0"
//       )}-${String(today.getDate()).padStart(2, "0")}`

//       const birthdaysToday = birthdays.filter((person) => {
//         const dobMonthDay = person.dateofbirth.slice(5) // Gets MM-DD
//         return dobMonthDay === todayMonthDay
//       })
//       // setBirthdayPerson(birthdaysToday)
//       if (birthdaysToday.length > 0) {
//         setBirthdayPerson(birthdaysToday)
//         setShowBirthdayPopup(true)
//       }
//     }
//   }, [birthdays])

//   useEffect(() => {
//     if (staffs) {
//       setallStaffs(staffs)
//     }
//   }, [staffs])
//   useEffect(() => {
//     setAnnouncementText(announcementlist?.[0]?.announcement)
//   }, [announcementlist])

//   useEffect(() => {
//     if (
//       allStaffs &&
//       allStaffs.length > 0 &&
//       acheivementlist &&
//       ((acheivementlist.quarterlyachiever.length > 0 &&
//         acheivementlist.quarterlyachiever[0].achieverId) ||
//         (acheivementlist.yearlyachiever.length > 0 &&
//           acheivementlist.yearlyachiever[0].achieverId))
//     ) {
//       const title =
//         acheivementlist.quarterlyachiever[0]?.title ||
//         acheivementlist.yearlyachiever[0]?.title
//       setQuarterlyTitle(title)
//       const quarterlyIds = acheivementlist.quarterlyachiever.map(
//         (item) => item.achieverId._id
//       )
//       const yearlyIds = acheivementlist.yearlyachiever.map(
//         (item) => item.achieverId._id
//       )
//       // Initialize the selectedStaffs state with staff names and their selection status (true/false)
//       const updatedSelectedStaffs = allStaffs.reduce((acc, staff) => {
//         acc[staff._id] = quarterlyIds.includes(staff._id) // If staff name is in `a`, set to true, otherwise false
//         return acc
//       }, {}) // Initialize the accumulator object as an empty object

//       setSelectedQuarterlyStaffs(updatedSelectedStaffs) // Update the state
//       const updatedSelectedQuarterlyStaffs = allStaffs.reduce((acc, staff) => {
//         acc[staff._id] = yearlyIds.includes(staff._id)
//         return acc
//       }, {})
//       setSelectedYearlyStaffs(updatedSelectedQuarterlyStaffs)
//     }
//   }, [allStaffs, acheivementlist]) // Re-run whenever `allStaffs` or `a` changes

//   useEffect(() => {
//     setTodayLeaveList(todayleavelist)
//     setCurrentmonthBirthdays(currrentMonthBirthDays)
//     setOnsitelist(todayOnsite)
//   }, [todayleavelist, currrentMonthBirthDays, todayOnsite])
//   const handleQuarterlyStaffToggle = (Id) => {
//     setSelectedQuarterlyStaffs((prev) => ({
//       ...prev,
//       [Id]: !prev[Id]
//     }))
//   }
//   const handleYearlyStaffToggle = (Id) => {
//     setSelectedYearlyStaffs((prev) => ({
//       ...prev,
//       [Id]: !prev[Id]
//     }))
//   }
//   const cards = [
//     {
//       label: "support department",
//       to:
//         user?.role === "Admin"
//           ? "/admin/support&department"
//           : "/staff/support&department",
//       icon: MdSupportAgent
//     },
//     {
//       label: "sales & marketing",
//       to: "",
//       icon: MdBarChart
//     },
//     {
//       label: "research & development",
//       to: "",
//       icon: MdScience
//     },
//     {
//       label: "admin",
//       to: user?.role === "Admin" ? "/admin/adminpanel" : "",
//       icon: MdAdminPanelSettings
//     }
//   ]
//   const handleSubmit = async (e) => {
//     setachieverLoader(true)

//     e.preventDefault()
//     try {
//       const response = await api.post("/dashboard/updateAcheivements", {
//         selectedQuarterlyStaffs,
//         selectedYearlyStaffs,
//         quarterlyTitle
//       })
//       if (response.status === 200) {
//         setachieverLoader(false)
//         toast.success(response.data.message)
//         refreshHook()
//       }
//     } catch (error) {
//       console.log("error:", error.message)
//     }
//   }
//   const handleAnnouncementSubmit = async (e) => {
//     setannouncementLoader(true)
//     e.preventDefault()
//     try {
//       const response = await api.post("/dashboard/updateAnnouncement", {
//         announcement
//       })
//       setannouncementLoader(false)
//       setAnnouncementText(response.data.data.announcement)
//       toast.success(response.data.message)
//     } catch (error) {
//       setannouncementLoader(false)
//       console.log("error:", error.message)
//     }
//   }
//   const closeBirthdayPopup = () => {
//     setShowBirthdayPopup(false)

//     const wish = true
//     localStorage.setItem("wish", JSON.stringify(wish))
//   }
//   return (
//     <div className="h-full bg-[#bfdbf7] ">
//       {showBirthdayPopup && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
//           <div
//             className="relative max-w-md w-full rounded-lg shadow-lg p-6 overflow-hidden"
//             style={{
//               background: "linear-gradient(135deg, #fdf2f8, #fce7f3, #fbcfe8)"
//             }}
//           >
//             {/* Close button */}
//             <button
//               onClick={closeBirthdayPopup}
//               className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
//             >
//               <FiX size={24} />
//             </button>

//             {/* Celebration elements */}
//             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300"></div>
//             <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-pink-300 via-purple-300 to-pink-300"></div>
//             <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300"></div>
//             <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-pink-300 via-purple-300 to-pink-300"></div>

//             <div className="text-center pt-4">
//               <div className="flex justify-center mb-4">
//                 <div className="w-34 h-34 rounded-full bg-pink-100 flex items-center justify-center">
//                   {/* This would be replaced with actual profile image if available */}

//                   {birthdayPerson.map((person, index) =>
//                     person.profileUrl.length > 0 ? (
//                       <img
//                         key={index}
//                         src={person.profileUrl}
//                         alt=""
//                         className="w-28 h-28 rounded-full border-2 border-purple-300"
//                       />
//                     ) : (
//                       <div
//                         key={index}
//                         className="w-24 h-24 rounded-full border-2 flex items-center justify-center bg-green-100 "
//                       >
//                         <FaUserCircle className="text-9xl text-gray-600 cursor-pointer" />
//                       </div>
//                     )
//                   )}
//                 </div>
//               </div>

//               <h2 className="text-2xl font-bold text-pink-700 mb-2">
//                 Happy Birthday!
//               </h2>
//               <h3 className="text-xl font-semibold text-pink-600 mb-4">
//                 {birthdayPerson.map((person, index) => (
//                   <p key={index}>{person.name}</p>
//                 ))}
//               </h3>

//               <p className="text-gray-700 mb-6">
//                 Wishing you a fantastic birthday filled with joy, laughter, and
//                 wonderful moments! May this special day bring you all the
//                 happiness you deserve.
//               </p>

//               <div className="flex justify-center space-x-2 mb-3">
//                 <span className="text-2xl">🎉</span>
//                 <span className="text-2xl">🎈</span>
//                 <span className="text-2xl">🎁</span>
//                 <span className="text-2xl">🎊</span>
//               </div>

//               <div className="text-center mt-4">
//                 <button
//                   onClick={closeBirthdayPopup}
//                   className="px-6 py-2 rounded-full font-medium text-white shadow-md relative overflow-hidden"
//                   style={{
//                     background: "linear-gradient(to right, #ec4899, #db2777)"
//                   }}
//                 >
//                   Thanks!
//                   <span className="absolute inset-0 flex items-center justify-center opacity-0 animate-heart">
//                     <svg className="w-4 h-4 text-white" viewBox="0 0 24 24">
//                       <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
//                     </svg>
//                   </span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Navigation Cards */}
//       <div className="flex flex-col sticky top-0 z-40 md:flex-row md:justify-evenly md:gap-4 space-y-2 md:space-y-0 p-4  border-b shadow-lg md:py-3 bg-[#023e7d]">
//         {cards.map((item, index) => {
//           const Icon = item.icon
//           return (
//             <Link to={item.to} key={index} className="w-full md:w-60">
//               <div className="w-full h-12 md:h-16 font-semibold shadow-md p-3 rounded-md flex items-center gap-3  bg-gradient-to-r from-blue-50 via-white to-blue-100 hover:bg-blue-100 hover:shadow-xl hover:scale-105 hover:-translate-y-1 transform transition-all duration-300 ease-in-out">
//                 <div className="bg-blue-600 p-2 rounded-full text-white">
//                   <Icon className="md:text-xl" />
//                 </div>
//                 <span className="text-blue-800">
//                   {item.label.toUpperCase()}
//                 </span>
//               </div>
//             </Link>
//           )
//         })}
//       </div>

//       {/* Main Content */}
//       <div
//         className="flex flex-col lg:flex-row md:gap-6 gap-3 m-2 p-2 md:p-4  "
//         style={{ minHeight: "calc(100vh - 200px)" }}
//       >
//         {/* LEFT SIDE */}
//         <div className="lg:w-1/2 flex flex-col md:gap-6 gap-3">
//           {/* Top Row - Leave and Birthday */}
//           <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6 gap-3 min-h-60">
//             {/* Leave List */}
//             <div className="p-4 rounded-lg  shadow-md bg-white border-l-4 border-orange-500">
//               <h2 className="font-bold text-lg mb-3 text-orange-700">
//                 Today's Leave
//               </h2>
//               {leaveList && leaveList.length > 0 ? (
//                 leaveList.map((item, index) => (
//                   <div
//                     key={index}
//                     className="text-left py-1 border-b border-gray-100"
//                   >
//                     {/* {item.name}-{item.leaveStatus} */}
//                     <p>
//                       <span className="font-medium text-gray-700">
//                         {index + 1}.
//                       </span>
//                       <span className="font-semibold">{item.name}</span> -
//                       <span className="text-blue-600 ml-1">
//                         {item.leaveStatus}
//                       </span>
//                     </p>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-gray-500 italic">No leaves today</div>
//               )}
//             </div>

//             {/* Birthday List */}
//             <div className="p-4 rounded-lg  shadow-md bg-white border-l-4 border-pink-500">
//               <h2 className="font-bold text-lg mb-3 text-pink-700">
//                 Birthdays
//               </h2>
//               {birthdays && birthdays.length > 0 ? (
//                 birthdays.map((item, index) => {
//                   const isToday = birthdayPerson?.some(
//                     (person) => person?.name === item?.name
//                   )
//                   return (
//                     <div
//                       key={index}
//                       className={`text-left py-1 border-b border-gray-100 ${
//                         isToday ? "bg-yellow-100 font-semibold" : ""
//                       }`}
//                     >
//                       <span className="font-medium text-gray-700">
//                         {index + 1}.
//                       </span>{" "}
//                       {item?.name} -
//                       <span className="text-pink-500 ml-1">
//                         {item?.dateofbirth
//                           ? new Date(item.dateofbirth).toLocaleDateString(
//                               "en-US",
//                               {
//                                 month: "long",
//                                 day: "numeric"
//                               }
//                             )
//                           : ""}
//                       </span>
//                       {isToday && <span className="ml-2">🎂</span>}
//                     </div>
//                   )
//                 })
//               ) : (
//                 <div className="text-gray-500 italic">No birthdays today</div>
//               )}
//             </div>
//           </div>

//           {/* Onsite List */}
//           <div className="p-4 rounded-lg shadow-md bg-white border-l-4 border-indigo-500 flex-1">
//             <h2 className="font-bold text-lg mb-3 text-indigo-700">
//               Today Onsite
//             </h2>
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm border-collapse">
//                 <thead>
//                   <tr className="bg-indigo-100">
//                     <th className="border border-indigo-200 p-2 text-left">
//                       Name
//                     </th>
//                     <th className="border border-indigo-200 p-2 text-left">
//                       Customer Name
//                     </th>
//                     <th className="border border-indigo-200 p-2 text-left">
//                       Place
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {onsitelist && onsitelist.length > 0 ? (
//                     onsitelist.map((item, index) => (
//                       <tr
//                         key={index}
//                         className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
//                       >
//                         <td className="border border-gray-200 p-2">
//                           {item?.name || "N/A"}
//                         </td>
//                         <td className="border border-gray-200 p-2">
//                           {item?.customer || "N/A"}
//                         </td>
//                         <td className="border border-gray-200 p-2">
//                           {item?.place}
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td
//                         colSpan={3}
//                         className="text-center bg-white p-3 text-gray-500 italic"
//                       >
//                         No onsites scheduled for today
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         {/* RIGHT SIDE */}
//         <div className="flex flex-col  lg:w-1/2 ">
//           <div className="flex flex-col lg:flex-row md:gap-6 gap-3 h-full">
//             {/* Target & Achievements */}
//             <div className="p-4 rounded-lg flex-1 shadow-md bg-white border-l-4 border-green-500">
//               <h2 className="font-bold text-lg mb-3 text-green-700">
//                 Monthly Holiday's
//               </h2>

//               {currentyearholydays && currentyearholydays.length > 0 && (
//                 <div className="space-y-2">
//                   {currentyearholydays
//                     .sort((a, b) => new Date(a.holyDate) - new Date(b.holyDate)) // sort by date
//                     .map((holiday) => (
//                       <div
//                         key={holiday._id}
//                         className="flex items-center justify-between border-b pb-1"
//                       >
//                         <span className="font-medium text-red-400">
//                           {holiday.customTextInput}
//                         </span>
//                         <span className=" text-blue-700">
//                           {new Date(holiday.holyDate).toLocaleDateString(
//                             "en-IN",
//                             {
//                               day: "2-digit",
//                               month: "short",
//                               year: "numeric"
//                             }
//                           )}
//                         </span>
//                       </div>
//                     ))}
//                 </div>
//               )}
//             </div>

//             {/* Achievers & Announcements */}
//             <div className="p-4 rounded-lg shadow-md flex-1 flex flex-col gap-4 group  border-l-4 border-purple-500 relative min-h-[500px] md:min-h-fit bg-white ">
//               {/* Admin Popup */}
//               {user?.role === "Admin" && (
//                 <div className="md:absolute md:left-1/2 md:top-1/4 md:-translate-x-1/2 md:-translate-y-1/2 md:inset-auto sm:w-[90%] border bg-white border-gray-300 rounded shadow-lg p-4 text-sm hidden group-hover:block z-30 m-4 md:m-0  max-h-[90vh] md:max-h-96">
//                   <h3 className="font-bold text-center text-purple-700">
//                     Update Achievers
//                   </h3>

//                   <input
//                     type="text"
//                     placeholder="Enter Title"
//                     value={quarterlyTitle || ""}
//                     onChange={(e) => setQuarterlyTitle(e.target.value)}
//                     className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
//                   />

//                   {/* Quarterly Achievers Dropdown */}
//                   <div className="relative">
//                     <div
//                       onClick={() => setShowQuarterly(!showQuarterly)}
//                       className="border rounded px-3 py-2 bg-white cursor-pointer flex items-center justify-between hover:bg-purple-50 mb-2"
//                     >
//                       Select Quarterly Achiever
//                       <FiChevronDown
//                         className={`transition-transform duration-200 ${
//                           showQuarterly ? "rotate-180" : ""
//                         }`}
//                       />
//                     </div>

//                     {showQuarterly && (
//                       <div className="absolute z-40 mt-1 border rounded shadow-lg p-2 w-full text-left bg-white max-h-52 overflow-y-auto ">
//                         {allStaffs?.map((staff) => (
//                           <label
//                             key={staff._id}
//                             className="block py-1 px-2 hover:bg-purple-50 rounded"
//                           >
//                             <input
//                               type="checkbox"
//                               className="mr-2 accent-purple-600"
//                               checked={
//                                 selectedQuarterlyStaffs[staff._id] || false
//                               }
//                               onChange={() =>
//                                 handleQuarterlyStaffToggle(staff._id)
//                               }
//                             />
//                             {staff.name.toUpperCase()}
//                           </label>
//                         ))}
//                       </div>
//                     )}
//                   </div>

//                   {/* Yearly Achievers Dropdown */}
//                   <div className="relative">
//                     <div
//                       onClick={() => setShowYearly(!showYearly)}
//                       className="border rounded px-3 py-2 bg-white cursor-pointer flex items-center justify-between hover:bg-purple-50 mb-2"
//                     >
//                       Select Yearly Achiever
//                       <FiChevronDown
//                         className={`transition-transform duration-200 ${
//                           showYearly ? "rotate-180" : ""
//                         }`}
//                       />
//                     </div>

//                     {showYearly && (
//                       <div className="absolute z-30 mt-1 border rounded shadow-lg p-2 w-full text-left bg-white max-h-52 overflow-y-auto ">
//                         {allStaffs?.map((staff) => (
//                           <label
//                             key={staff._id}
//                             className="block py-1 px-2 hover:bg-purple-50 rounded"
//                           >
//                             <input
//                               type="checkbox"
//                               className="mr-2 accent-purple-600"
//                               checked={selectedYearlyStaffs[staff._id] || false}
//                               onChange={() =>
//                                 handleYearlyStaffToggle(staff._id)
//                               }
//                             />
//                             {staff.name.toUpperCase()}
//                           </label>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                   <div className="flex justify-center">
//                     <button
//                       onClick={handleSubmit}
//                       className="bg-purple-600 text-white px-3 py-2 rounded hover:bg-purple-700 transition-colors flex items-center justify-center"
//                     >
//                       {achieverLoader ? (
//                         <span className="flex items-center gap-2">
//                           Processing{" "}
//                           <FaSpinner className="animate-spin h-5 w-5 text-white" />
//                         </span>
//                       ) : (
//                         "Submit"
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* Quarterly Achievers Display */}
//               <div className="rounded flex-1 w-full max-w-full overflow-hidden min-h-52">
//                 <h3 className="font-bold text-lg mb-1 text-purple-700">
//                   Quarterly Achiever
//                 </h3>
//                 <p className="text-center break-all text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 font-bold text-lg drop-shadow-sm">
//                   {quarterlyTitle}
//                 </p>
//                 {acheivementlist?.quarterlyachiever &&
//                 acheivementlist.quarterlyachiever.length > 0 ? (
//                   <div className="space-y-2">
//                     {acheivementlist.quarterlyachiever.map(
//                       (achiever, index) => (
//                         <div
//                           key={index}
//                           className="flex justify-between items-center p-2 bg-purple-50 rounded-lg border border-purple-100"
//                         >
//                           <div className="font-medium">
//                             {index + 1}.{" "}
//                             {achiever?.achieverId?.name || "Unknown"}
//                           </div>
//                           {achiever?.achieverId?.profileUrl?.[0] && (
//                             <img
//                               src={achiever.achieverId.profileUrl[0]}
//                               alt={achiever?.achieverId?.name}
//                               className="w-10 h-10 rounded-full border-2 border-purple-300"
//                             />
//                           )}
//                         </div>
//                       )
//                     )}
//                   </div>
//                 ) : (
//                   <div className="text-gray-500 italic">
//                     No quarterly achievers yet
//                   </div>
//                 )}
//                 <h3 className="font-bold text-lg mb-3 text-purple-700">
//                   Yearly Achiever
//                 </h3>
//                 {acheivementlist?.yearlyachiever &&
//                 acheivementlist.yearlyachiever.length > 0 ? (
//                   <div className="space-y-2">
//                     {acheivementlist.yearlyachiever.map((achiever, index) => (
//                       <div
//                         key={index}
//                         className="flex justify-between items-center p-2 bg-purple-50 rounded-lg border border-purple-100"
//                       >
//                         <div className="font-medium">
//                           {index + 1}. {achiever?.achieverId?.name || "Unknown"}
//                         </div>
//                         {achiever?.achieverId?.profileUrl?.[0] && (
//                           <img
//                             src={achiever.achieverId.profileUrl[0]}
//                             alt={achiever?.achieverId?.name}
//                             className="w-10 h-10 rounded-full border-2 border-purple-300"
//                           />
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-gray-500 italic">
//                     No yearly achievers yet
//                   </div>
//                 )}
//               </div>

//               {/* Announcements */}
//               <div className="rounded flex-1 mt-4 group relative ">
//                 <h3 className="font-bold text-lg mb-3 text-purple-700">
//                   Announcement
//                 </h3>
//                 {user?.role === "Admin" && (
//                   <div className="md:absolute  md:inset-auto md:w-full border border-gray-300 rounded shadow-lg p-4 text-sm hidden group-hover:block z-20 m-4 md:m-0 max-h-[90vh] md:max-h-fit bg-white ">
//                     <h4 className="text-purple-700 font-bold text-center">
//                       Update Announcement
//                     </h4>

//                     <textarea
//                       placeholder="Enter announcement..."
//                       value={announcement || ""}
//                       onChange={(e) => setAnnouncementText(e.target.value)}
//                       className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
//                       rows={5}
//                     />
//                     <div className="flex justify-center">
//                       <button
//                         onClick={handleAnnouncementSubmit}
//                         className="bg-purple-600 text-white px-3 py-2 rounded hover:bg-purple-700 transition-colors flex items-center justify-center"
//                       >
//                         {announcementLoader ? (
//                           <span className="flex items-center gap-2">
//                             Processing{" "}
//                             <FaSpinner className="animate-spin h-5 w-5 text-white" />
//                           </span>
//                         ) : (
//                           "Submit Announcement"
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 {announcement ? (
//                   <div className="relative bg-yellow-100 p-5 rounded-lg shadow-lg border border-yellow-300 transform rotate-1 mx-auto max-w-xs md:max-w-lg">
//                     {/* Push Pin or Thumbtack Icon */}
//                     <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
//                       <div className="w-4 h-4 bg-red-600 rounded-full shadow-md ring-2 ring-white"></div>
//                     </div>

//                     {/* Content */}
//                     <div className="transform -rotate-1">
//                       <div className="text-yellow-900 font-semibold text-center whitespace-pre-wrap italic">
//                         {announcement ?? "No announcement yet."}
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="flex flex-col items-center justify-center py-6 text-amber-700">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-10 w-10 mb-2 opacity-50"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
//                       />
//                     </svg>
//                     <p className="italic text-center">No announcement yet</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
import { useEffect, useState, useRef } from "react"
import {
  MdSupportAgent,
  MdAdminPanelSettings,
  MdScience,
  MdBarChart
} from "react-icons/md"
import { FiChevronDown, FiX } from "react-icons/fi"
import { FaSpinner, FaUserCircle } from "react-icons/fa"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import UseFetch from "../../../hooks/useFetch"
import { getLocalStorageItem } from "../../../helper/localstorage"
import api from "../../../api/api"

export default function PrimaryUserDashBoard() {
  const [leaveList, setTodayLeaveList] = useState([])
  const [announcement, setAnnouncementText] = useState("")
  const [achieverLoader, setachieverLoader] = useState(false)
  const [announcementLoader, setannouncementLoader] = useState(false)
  const [birthdayAlreadyShown, setbirthdayshown] = useState(false)
  const [selectedQuarterlyStaffs, setSelectedQuarterlyStaffs] = useState({})
  const [quarterlyTitle, setQuarterlyTitle] = useState("")
  const [selectedYearlyStaffs, setSelectedYearlyStaffs] = useState({})
  const [birthdays, setCurrentmonthBirthdays] = useState([])
  const [allStaffs, setallStaffs] = useState([])
  const [onsitelist, setOnsitelist] = useState([])
  const [showQuarterly, setShowQuarterly] = useState(false)
  const [showYearly, setShowYearly] = useState(false)
  const [user, setUser] = useState(null)
  const [showBirthdayPopup, setShowBirthdayPopup] = useState(false)
  const [birthdayPerson, setBirthdayPerson] = useState(null)
  const [currentyearholydays, setcurrentyearHoliday] = useState([])
  const headerRef = useRef(null)

  const { data: todayleavelist } = UseFetch("/auth/getallUsersLeave?today=true")
  const { data: currrentMonthBirthDays } = UseFetch(
    "/auth/getallcurrentmonthBirthdays"
  )
  const { data: todayOnsite } = UseFetch("/auth/getallUsersOnsite?today=true")
  const { data: staffs } = UseFetch("/auth/getallStaffs")
  const { data: acheivementlist, refreshHook } = UseFetch(
    "/dashboard/getcurrentquarterlyAchiever"
  )
  const { data: holydata } = UseFetch("/customer/getallholy")
  const { data: announcementlist } = UseFetch(
    "/dashboard/getcurrentAnnouncement"
  )

  useEffect(() => {
    const userData = getLocalStorageItem("user")
    setUser(userData)
  }, [])

  useEffect(() => {
    if (holydata && holydata.length) {
      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()

      const currentMonthHolidays = holydata.filter((item) => {
        const date = new Date(item.holyDate)
        return (
          date.getFullYear() === currentYear && date.getMonth() === currentMonth
        )
      })

      setcurrentyearHoliday(currentMonthHolidays)
    }
  }, [holydata])

  useEffect(() => {
    const wishValue = JSON.parse(localStorage.getItem("wish"))
    if (wishValue) {
      setbirthdayshown(true)
    }
  })

  useEffect(() => {
    if (birthdays && birthdays.length > 0 && !birthdayAlreadyShown) {
      const today = new Date()
      const todayMonthDay = `${String(today.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(today.getDate()).padStart(2, "0")}`

      const birthdaysToday = birthdays.filter((person) => {
        const dobMonthDay = person.dateofbirth.slice(5)
        return dobMonthDay === todayMonthDay
      })

      if (birthdaysToday.length > 0) {
        setBirthdayPerson(birthdaysToday)
        setShowBirthdayPopup(true)
      }
    }
  }, [birthdays, birthdayAlreadyShown])

  useEffect(() => {
    if (staffs) {
      setallStaffs(staffs)
    }
  }, [staffs])

  useEffect(() => {
    setAnnouncementText(announcementlist?.[0]?.announcement || "")
  }, [announcementlist])

  useEffect(() => {
    if (
      allStaffs &&
      allStaffs.length > 0 &&
      acheivementlist &&
      ((acheivementlist.quarterlyachiever.length > 0 &&
        acheivementlist.quarterlyachiever[0].achieverId) ||
        (acheivementlist.yearlyachiever.length > 0 &&
          acheivementlist.yearlyachiever[0].achieverId))
    ) {
      const title =
        acheivementlist.quarterlyachiever[0]?.title ||
        acheivementlist.yearlyachiever[0]?.title
      setQuarterlyTitle(title)

      const quarterlyIds = acheivementlist.quarterlyachiever.map(
        (item) => item.achieverId._id
      )
      const yearlyIds = acheivementlist.yearlyachiever.map(
        (item) => item.achieverId._id
      )

      const updatedSelectedQuarterly = allStaffs.reduce((acc, staff) => {
        acc[staff._id] = quarterlyIds.includes(staff._id)
        return acc
      }, {})
      setSelectedQuarterlyStaffs(updatedSelectedQuarterly)

      const updatedSelectedYearly = allStaffs.reduce((acc, staff) => {
        acc[staff._id] = yearlyIds.includes(staff._id)
        return acc
      }, {})
      setSelectedYearlyStaffs(updatedSelectedYearly)
    }
  }, [allStaffs, acheivementlist])

  useEffect(() => {
    setTodayLeaveList(todayleavelist || [])
    setCurrentmonthBirthdays(currrentMonthBirthDays || [])
    setOnsitelist(todayOnsite || [])
  }, [todayleavelist, currrentMonthBirthDays, todayOnsite])

  const handleQuarterlyStaffToggle = (Id) => {
    setSelectedQuarterlyStaffs((prev) => ({
      ...prev,
      [Id]: !prev[Id]
    }))
  }

  const handleYearlyStaffToggle = (Id) => {
    setSelectedYearlyStaffs((prev) => ({
      ...prev,
      [Id]: !prev[Id]
    }))
  }
  console.log(user)
  console.log(
    user?.department?._id === "670c866552847bbebbd35748" ? true : false
  )
  // 670c866552847bbebbd35748
  const cards = [
    {
      label: "support department",
      to: user?.role==="Admin"?"/admin/support&department":"/staff/support&department",
      icon: MdSupportAgent,
      show: true
    },
    {
      label: "sales & marketing",
      show: user?.department?._id === "670c866552847bbebbd35748" ? true : false,
      to:
        user?.department?._id === "670c866552847bbebbd35748" &&
        user.role.trim() === "Admin"
          ? "/admin/reports/markettingdasboard"
          : user?.department?._id === "670c866552847bbebbd35748"
            ? "/staff/reports/markettingdashboard"
            : "",
      icon: MdBarChart
    },
    {
      label: "research & development",
      to: "",
      icon: MdScience,
      show: false
    },
    {
      label: "admin",
      to: user?.role === "Admin" ? "/admin/adminpanel" : "",
      icon: MdAdminPanelSettings,
      show: true
    }
  ]
  console.log("h")
  const handleSubmit = async (e) => {
    e.preventDefault()
    setachieverLoader(true)
    try {
      const response = await api.post("/dashboard/updateAcheivements", {
        selectedQuarterlyStaffs,
        selectedYearlyStaffs,
        quarterlyTitle
      })
      if (response.status === 200) {
        toast.success(response.data.message)
        refreshHook()
      }
    } catch (error) {
      console.log("error:", error.message)
    } finally {
      setachieverLoader(false)
    }
  }

  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault()
    setannouncementLoader(true)
    try {
      const response = await api.post("/dashboard/updateAnnouncement", {
        announcement
      })
      setAnnouncementText(response.data.data.announcement)
      toast.success(response.data.message)
    } catch (error) {
      console.log("error:", error.message)
    } finally {
      setannouncementLoader(false)
    }
  }

  const closeBirthdayPopup = () => {
    setShowBirthdayPopup(false)
    const wish = true
    localStorage.setItem("wish", JSON.stringify(wish))
  }

  return (
    <div className="min-h-screen bg-[#ADD8E6]">
      {/* Birthday popup */}
      {showBirthdayPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div
            className="relative max-w-md w-full rounded-xl shadow-2xl p-6 overflow-hidden border border-pink-200"
            style={{
              background: "linear-gradient(135deg, #fdf2f8, #fce7f3, #fbcfe8)"
            }}
          >
            <button
              onClick={closeBirthdayPopup}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              <FiX size={22} />
            </button>

            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-pink-300 via-purple-300 to-pink-300" />
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300" />
              <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-pink-300 via-purple-300 to-pink-300" />
            </div>

            <div className="text-center pt-4 relative z-10">
              <div className="flex justify-center mb-4">
                <div className="w-34 h-34 rounded-full bg-pink-100 flex items-center justify-center border border-pink-200 shadow-md">
                  {birthdayPerson?.map((person, index) =>
                    person.profileUrl.length > 0 ? (
                      <img
                        key={index}
                        src={person.profileUrl}
                        alt=""
                        className="w-28 h-28 rounded-full border-2 border-purple-300 object-cover"
                      />
                    ) : (
                      <div
                        key={index}
                        className="w-24 h-24 rounded-full border-2 flex items-center justify-center bg-pink-50"
                      >
                        <FaUserCircle className="text-6xl text-gray-500" />
                      </div>
                    )
                  )}
                </div>
              </div>

              <h2 className="text-2xl font-extrabold text-pink-700 mb-1 tracking-wide">
                Happy Birthday!
              </h2>
              <h3 className="text-lg font-semibold text-pink-600 mb-3">
                {birthdayPerson?.map((person, index) => (
                  <p key={index}>{person.name}</p>
                ))}
              </h3>

              <p className="text-gray-700 mb-5 text-sm leading-relaxed">
                Wishing you a fantastic birthday filled with joy, laughter and
                memorable moments. Have an amazing year ahead!
              </p>

              <div className="flex justify-center space-x-2 mb-3 text-2xl">
                <span>🎉</span>
                <span>🎈</span>
                <span>🎁</span>
                <span>🎊</span>
              </div>

              <button
                onClick={closeBirthdayPopup}
                className="px-6 py-2 rounded-full font-semibold text-white shadow-md"
                style={{
                  background: "linear-gradient(to right, #ec4899, #db2777)"
                }}
              >
                Thanks!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Cards – assume header above is green, so keep this dark-green/navy band */}
      <div
        ref={headerRef}
        className="flex flex-col sticky top-0 z-40 md:flex-row md:justify-evenly md:gap-4 space-y-2 md:space-y-0 p-4 border-b shadow-lg md:py-3 bg-[#023e7d]"
      >
        {cards.map((item, index) => {
          const Icon = item.icon
          return (
            <Link to={item.to} key={index} className="w-full md:w-60">
              <div className="w-full h-12 md:h-16 font-semibold shadow-md p-3 rounded-md flex items-center gap-3 bg-gradient-to-r from-white via-sky-50 to-sky-100 hover:shadow-lg hover:scale-[1.02] transform transition-all duration-200 border border-sky-100">
                <div className="bg-emerald-600 p-2 rounded-full text-white shadow-sm">
                  <Icon className="md:text-xl" />
                </div>
                <span className="text-slate-800 tracking-wide text-xs md:text-sm">
                  {item.label.toUpperCase()}
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Main Content */}
      <div
        className="flex flex-col lg:flex-row md:gap-6 gap-3 m-2 p-2 md:p-4"
        style={{ minHeight: "calc(100vh - 200px)" }}
      >
        {/* LEFT SIDE */}
        <div className="lg:w-1/2 flex flex-col md:gap-6 gap-3">
          {/* Top Row - Leave and Birthday */}
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6 gap-3 min-h-60">
            {/* Leave List */}
            <div className="p-4 rounded-lg shadow-md bg-white/90 border border-orange-200">
              <h2 className="font-semibold text-base md:text-lg mb-3 text-orange-700 flex items-center justify-between">
                <span>Today's Leave</span>
                <span className="text-[11px] text-orange-500">
                  {leaveList.length || 0} staff
                </span>
              </h2>
              {leaveList && leaveList.length > 0 ? (
                leaveList.map((item, index) => (
                  <div
                    key={index}
                    className="text-left py-1.5 border-b border-orange-50 last:border-none"
                  >
                    <p className="text-[13px] text-slate-700">
                      <span className="font-medium text-gray-600 mr-1">
                        {index + 1}.
                      </span>
                      <span className="font-semibold">{item.name}</span>
                      <span className="text-orange-600 ml-1">
                        {" "}
                        – {item.leaveStatus}
                      </span>
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 italic text-sm">
                  No leaves today
                </div>
              )}
            </div>

            {/* Birthday List */}
            <div className="p-4 rounded-lg shadow-md bg-white/90 border border-pink-200">
              <h2 className="font-semibold text-base md:text-lg mb-3 text-pink-700 flex items-center justify-between">
                <span>Birthdays</span>
                <span className="text-[11px] text-pink-500">
                  {birthdays.length || 0} this month
                </span>
              </h2>
              {birthdays && birthdays.length > 0 ? (
                birthdays.map((item, index) => {
                  const isToday = birthdayPerson?.some(
                    (person) => person?.name === item?.name
                  )
                  return (
                    <div
                      key={index}
                      className={`text-left py-1.5 border-b border-pink-50 last:border-none ${
                        isToday ? "bg-yellow-50 font-semibold" : ""
                      }`}
                    >
                      <span className="font-medium text-gray-600">
                        {index + 1}.
                      </span>{" "}
                      <span className="text-slate-800">{item?.name}</span>{" "}
                      <span className="text-pink-500 ml-1 text-[13px]">
                        {item?.dateofbirth
                          ? new Date(item.dateofbirth).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric"
                              }
                            )
                          : ""}
                      </span>
                      {isToday && <span className="ml-2">🎂</span>}
                    </div>
                  )
                })
              ) : (
                <div className="text-gray-500 italic text-sm">
                  No birthdays today
                </div>
              )}
            </div>
          </div>

          {/* Onsite List */}
          <div className="p-4 rounded-lg shadow-md bg-white/90 border border-indigo-200 flex-1">
            <h2 className="font-semibold text-base md:text-lg mb-3 text-indigo-700 flex items-center justify-between">
              <span>Today Onsite</span>
              <span className="text-[11px] text-indigo-500">
                {onsitelist.length || 0} visit
                {onsitelist.length === 1 ? "" : "s"}
              </span>
            </h2>
            <div className="overflow-x-auto rounded-md border border-indigo-100">
              <table className="w-full text-xs md:text-sm border-collapse">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="border border-indigo-100 p-2 text-left text-[11px] uppercase tracking-wide text-indigo-700">
                      Name
                    </th>
                    <th className="border border-indigo-100 p-2 text-left text-[11px] uppercase tracking-wide text-indigo-700">
                      Customer
                    </th>
                    <th className="border border-indigo-100 p-2 text-left text-[11px] uppercase tracking-wide text-indigo-700">
                      Place
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {onsitelist && onsitelist.length > 0 ? (
                    onsitelist.map((item, index) => (
                      <tr
                        key={index}
                        className={
                          index % 2 === 0 ? "bg-white" : "bg-indigo-50/40"
                        }
                      >
                        <td className="border border-gray-100 p-2 text-slate-700">
                          {item?.name || "N/A"}
                        </td>
                        <td className="border border-gray-100 p-2 text-slate-700">
                          {item?.customer || "N/A"}
                        </td>
                        <td className="border border-gray-100 p-2 text-slate-700">
                          {item?.place || "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="text-center bg-white p-3 text-gray-500 italic"
                      >
                        No onsites scheduled for today
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col lg:w-1/2">
          <div className="flex flex-col lg:flex-row md:gap-6 gap-3 h-full">
            {/* Monthly Holidays */}
            <div className="p-4 rounded-lg flex-1 shadow-md bg-white/90 border border-emerald-200">
              <h2 className="font-semibold text-base md:text-lg mb-3 text-emerald-700">
                Monthly Holidays
              </h2>
              {currentyearholydays && currentyearholydays.length > 0 ? (
                <div className="space-y-2 text-sm">
                  {currentyearholydays
                    .sort((a, b) => new Date(a.holyDate) - new Date(b.holyDate))
                    .map((holiday) => (
                      <div
                        key={holiday._id}
                        className="flex items-center justify-between border-b border-emerald-50 pb-1 last:border-none"
                      >
                        <span className="font-medium text-emerald-700">
                          {holiday.customTextInput}
                        </span>
                        <span className="text-sky-700 text-xs">
                          {new Date(holiday.holyDate).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric"
                            }
                          )}
                        </span>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-gray-500 italic text-sm">
                  No holidays this month
                </div>
              )}
            </div>

            {/* Achievers & Announcements */}
            <div className="p-4 rounded-lg shadow-md flex-1 flex flex-col gap-4 group border border-purple-200 relative min-h-[500px] md:min-h-fit bg-white/95">
              {/* Admin Popup – Achievers */}
              {user?.role === "Admin" && (
                <div className="md:absolute md:left-1/2 md:top-1/4 md:-translate-x-1/2 md:-translate-y-1/2 md:inset-auto sm:w-[90%] border border-purple-200 bg-white rounded-lg shadow-xl p-4 text-sm hidden group-hover:block z-30 m-4 md:m-0 max-h-[90vh] md:max-h-96">
                  <h3 className="font-bold text-center text-purple-700 mb-2">
                    Update Achievers
                  </h3>

                  <input
                    type="text"
                    placeholder="Quarterly title"
                    value={quarterlyTitle || ""}
                    onChange={(e) => setQuarterlyTitle(e.target.value)}
                    className="border border-purple-200 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-500/60 mb-3 text-sm"
                  />

                  {/* Quarterly Achievers Dropdown */}
                  <div className="relative mb-2">
                    <div
                      onClick={() => setShowQuarterly(!showQuarterly)}
                      className="border border-purple-200 rounded px-3 py-2 bg-white cursor-pointer flex items-center justify-between hover:bg-purple-50 text-xs"
                    >
                      Select Quarterly Achiever
                      <FiChevronDown
                        className={`transition-transform duration-200 ${
                          showQuarterly ? "rotate-180" : ""
                        }`}
                      />
                    </div>

                    {showQuarterly && (
                      <div className="absolute z-40 mt-1 border border-purple-200 rounded shadow-lg p-2 w-full text-left bg-white max-h-52 overflow-y-auto text-xs">
                        {allStaffs?.map((staff) => (
                          <label
                            key={staff._id}
                            className="block py-1 px-2 hover:bg-purple-50 rounded cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              className="mr-2 accent-purple-600"
                              checked={
                                selectedQuarterlyStaffs[staff._id] || false
                              }
                              onChange={() =>
                                handleQuarterlyStaffToggle(staff._id)
                              }
                            />
                            {staff.name.toUpperCase()}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Yearly Achievers Dropdown */}
                  <div className="relative mb-3">
                    <div
                      onClick={() => setShowYearly(!showYearly)}
                      className="border border-purple-200 rounded px-3 py-2 bg-white cursor-pointer flex items-center justify-between hover:bg-purple-50 text-xs"
                    >
                      Select Yearly Achiever
                      <FiChevronDown
                        className={`transition-transform duration-200 ${
                          showYearly ? "rotate-180" : ""
                        }`}
                      />
                    </div>

                    {showYearly && (
                      <div className="absolute z-30 mt-1 border border-purple-200 rounded shadow-lg p-2 w-full text-left bg-white max-h-52 overflow-y-auto text-xs">
                        {allStaffs?.map((staff) => (
                          <label
                            key={staff._id}
                            className="block py-1 px-2 hover:bg-purple-50 rounded cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              className="mr-2 accent-purple-600"
                              checked={selectedYearlyStaffs[staff._id] || false}
                              onChange={() =>
                                handleYearlyStaffToggle(staff._id)
                              }
                            />
                            {staff.name.toUpperCase()}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={handleSubmit}
                      className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center text-xs font-semibold"
                    >
                      {achieverLoader ? (
                        <span className="flex items-center gap-2">
                          Processing
                          <FaSpinner className="animate-spin h-4 w-4 text-white" />
                        </span>
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Quarterly + Yearly Achievers Display */}
              <div className="rounded flex-1 w-full max-w-full overflow-hidden min-h-52">
                <h3 className="font-bold text-lg mb-1 text-purple-700">
                  Quarterly Achiever
                </h3>
                <p className="text-center break-all text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 font-bold text-lg drop-shadow-sm mb-2">
                  {quarterlyTitle || "—"}
                </p>

                {acheivementlist?.quarterlyachiever &&
                acheivementlist.quarterlyachiever.length > 0 ? (
                  <div className="space-y-2 text-sm">
                    {acheivementlist.quarterlyachiever.map(
                      (achiever, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-2 bg-purple-50 rounded-lg border border-purple-100"
                        >
                          <div className="font-medium text-slate-800 text-sm">
                            {index + 1}.{" "}
                            {achiever?.achieverId?.name || "Unknown"}
                          </div>
                          {achiever?.achieverId?.profileUrl?.[0] && (
                            <img
                              src={achiever.achieverId.profileUrl[0]}
                              alt={achiever?.achieverId?.name}
                              className="w-10 h-10 rounded-full border-2 border-purple-300 object-cover"
                            />
                          )}
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="text-gray-500 italic text-sm">
                    No quarterly achievers yet
                  </div>
                )}

                <h3 className="font-bold text-lg mt-4 mb-2 text-purple-700">
                  Yearly Achiever
                </h3>
                {acheivementlist?.yearlyachiever &&
                acheivementlist.yearlyachiever.length > 0 ? (
                  <div className="space-y-2 text-sm">
                    {acheivementlist.yearlyachiever.map((achiever, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 bg-purple-50 rounded-lg border border-purple-100"
                      >
                        <div className="font-medium text-slate-800 text-sm">
                          {index + 1}. {achiever?.achieverId?.name || "Unknown"}
                        </div>
                        {achiever?.achieverId?.profileUrl?.[0] && (
                          <img
                            src={achiever.achieverId.profileUrl[0]}
                            alt={achiever?.achieverId?.name}
                            className="w-10 h-10 rounded-full border-2 border-purple-300 object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 italic text-sm">
                    No yearly achievers yet
                  </div>
                )}
              </div>

              {/* Announcements */}
              <div className="rounded flex-1 mt-4 group relative">
                <h3 className="font-bold text-lg mb-2 text-purple-700">
                  Announcement
                </h3>

                {user?.role === "Admin" && (
                  <div className="md:absolute md:inset-auto md:w-full border border-amber-200 rounded-lg shadow-xl p-4 text-sm hidden group-hover:block z-20 m-4 md:m-0 max-h-[90vh] md:max-h-fit bg-white">
                    <h4 className="text-purple-700 font-bold text-center mb-2">
                      Update Announcement
                    </h4>

                    <textarea
                      placeholder="Enter announcement..."
                      value={announcement || ""}
                      onChange={(e) => setAnnouncementText(e.target.value)}
                      className="w-full p-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                      rows={5}
                    />
                    <div className="flex justify-center mt-2">
                      <button
                        onClick={handleAnnouncementSubmit}
                        className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition-colors flex items-center justify-center text-xs font-semibold"
                      >
                        {announcementLoader ? (
                          <span className="flex items-center gap-2">
                            Processing
                            <FaSpinner className="animate-spin h-4 w-4 text-white" />
                          </span>
                        ) : (
                          "Submit Announcement"
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {announcement ? (
                  <div className="relative bg-yellow-100/90 p-4 rounded-lg shadow-md border border-yellow-300 mx-auto max-w-xs md:max-w-lg">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <div className="w-4 h-4 bg-red-600 rounded-full shadow-md ring-2 ring-white" />
                    </div>
                    <div className="mt-1 text-yellow-900 font-medium text-center whitespace-pre-wrap text-sm">
                      {announcement ?? "No announcement yet."}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-amber-700 text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 mb-2 opacity-60"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                      />
                    </svg>
                    <p className="italic text-center text-xs">
                      No announcement yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
