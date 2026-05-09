// import { useState, useEffect, useRef } from "react"
// import DeleteAlert from "./DeleteAlert"
// import { CardSkeletonLoader } from "./CardSkeletonLoader"
// import { toast } from "react-toastify"
// import BarLoader from "react-spinners/BarLoader"
// import MyDatePicker from "./MyDatePicker"
// import api from "../../api/api"
// // import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"
// import dayjs from "dayjs"

// const LeaveApprovalAndPending = () => {
//   const [user, setUser] = useState(null)
//   const [mispunchMode, setMispunchMode] = useState(false)
//   const [misspunchlist, setMisspunchList] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [loader, setLoader] = useState(false)
//   console.log(loader)
//   console.log(loading)
//   const [leaveList, setLeaveList] = useState([])
//   const [onsite, setonsite] = useState(false)
//   const [searchQuery, setSearchQuery] = useState("")
//   const [filteredlist, setFilteredlist] = useState([])
//   const [allleaveRequest, setallleaveReques] = useState([])
//   const [ispending, setPending] = useState(true)
//   const [leaveStatus, setLeaveStatus] = useState({})
//   const [isToggled, setIsToggled] = useState({})
//   const [pendingOnsite, setpendingOnsite] = useState(false)
//   const [pendingLeave, setPendingLeave] = useState(true)
//   const [approvedLeave, setApprovedLeave] = useState(false)
//   const [approvedOnsite, setapprovedOnsite] = useState(false)
//   const [isSelected, setIsSelected] = useState({})
//   const headerRef = useRef(null)
//   const [tableHeight, setTableHeight] = useState("auto")
//   const [dates, setDates] = useState({ startDate: "", endDate: "" })
//   // const fetchData = async () => {
//   //   try {
//   //     console.log("hh")
//   //     let response

//   //     if (mispunchMode) {
//   //       setLoader(true)
//   //       console.log("hhh")
//   //       // ✅ MISPUNCH API
//   //       response = await api.get(
//   //         `/auth/getallmisspunch?startDate=${dates.startDate}&endDate=${dates.endDate}`
//   //       )
//   //       console.log("hhhh")
//   //       setMisspunchList(response.data.data || [])
//   //       console.log(response.data?.data)
//   //       console.log("hhh")
//   //     } else {
//   //       const fetchPendingList = async () => {
//   //         if (
//   //           dates.startDate !== "" &&
//   //           dates.startDate !== null &&
//   //           dates.endDate !== "" &&
//   //           dates.endDate !== null &&
//   //           user
//   //         ) {
//   //           console.log("Kkk")
//   //           try {
//   //             setLoader(true)
//   //             console.log(true)
//   //             let response
//   //             if (pendingLeave && !pendingOnsite) {
//   //               response = await api.get(
//   //                 `/auth/pendingleaveList?onsite=false&startdate=${dates.startDate}&enddate=${dates.endDate}&role=${user?.role}&userid=${user?._id}`
//   //               )
//   //             } else if (pendingOnsite && !pendingLeave) {
//   //               response = await api.get(
//   //                 `/auth/pendingOnsiteList?onsite=true&startdate=${dates.startDate}&enddate=${dates.endDate}&userid=${user?._id}&role=${user?.role}`
//   //               )
//   //             }

//   //             const list = response.data.data
//   //             setallleaveReques(list) // Assuming API returns data in response.data

//   //             if (Array.isArray(list) && list.length > 0) {
//   //               const filteredList =
//   //                 searchQuery.trim() === ""
//   //                   ? list // Show all data if search is empty
//   //                   : list?.filter((user) => {
//   //                       const staffName =
//   //                         user?.userId?.name?.toLowerCase() || ""
//   //                       return staffName.includes(searchQuery.toLowerCase())
//   //                     })
//   //               console.log(filteredList)
//   //               setLeaveList(filteredList) // Update state only if the list has items
//   //               setLoading(false)
//   //             } else {
//   //               setLoading(false)
//   //               setLeaveList([])
//   //             }

//   //             // Initialize isToggled state based on the status of each leave request
//   //             const initialToggles = {}
//   //             const initialReject = {}
//   //             const initialSelectAll = {}
//   //             if (user?.role === "Admin") {
//   //               list.forEach((userLeave) => {
//   //                 // Check the `status` field for each leave and set the toggle accordingly
//   //                 initialToggles[userLeave?._id] =
//   //                   userLeave?.hrstatus === "HR/Onsite Approved" // Toggle on if approved
//   //                 initialReject[userLeave?._id] =
//   //                   userLeave?.hrstatus === "HR Rejected"
//   //                 initialSelectAll[userLeave?.userId?._id] =
//   //                   userLeave?.hrstatus === "HR/Onsite Approved"
//   //               })
//   //               console.log("hhhh")
//   //             } else {
//   //               list.forEach((userLeave) => {
//   //                 // Check the `status` field for each leave and set the toggle accordingly
//   //                 initialToggles[userLeave?._id] =
//   //                   userLeave?.departmentstatus === "Dept Approved" // Toggle on if approved
//   //                 initialReject[userLeave._id] =
//   //                   userLeave?.departmentstatus === "Dept Rejected"
//   //                 initialSelectAll[userLeave?.userId?._id] =
//   //                   userLeave?.departmentstatus === "Dept Approved"
//   //               })
//   //             }
//   //             setLoader(false)
//   //             setIsToggled(initialToggles)
//   //             setLeaveStatus(initialReject)
//   //             setIsSelected(initialSelectAll)
//   //           } catch (error) {
//   //             console.error("Error fetching leave list:", error)
//   //           }
//   //         }
//   //       }

//   //       const fetchApprovedList = async () => {
//   //         if (dates.startDate !== "" && dates.endDate !== "" && user) {
//   //           try {
//   //             setLoader(true)
//   //             let response
//   //             if (approvedOnsite && !approvedLeave) {
//   //               console.log("hh")
//   //               response = await api.get(
//   //                 `/auth/approvedOnsiteList?onsite=true&startdate=${dates.startDate}&enddate=${dates.endDate}&role=${user?.role}&userid=${user?._id}`
//   //               )
//   //             } else if (approvedLeave && !approvedOnsite) {
//   //               console.log("hhh")
//   //               response = await api.get(
//   //                 `/auth/approvedLeaveList?onsite=false&startdate=${dates.startDate}&enddate=${dates.endDate}&userid=${user?._id}&role=${user?.role}`
//   //               )
//   //             }

//   //             const list = response.data.data
//   //             setallleaveReques(list) // Assuming API returns data in response.data

//   //             if (Array.isArray(list) && list.length > 0) {
//   //               const filteredList =
//   //                 searchQuery.trim() === ""
//   //                   ? list // Show all data if search is empty
//   //                   : list?.filter((user) => {
//   //                       const staffName =
//   //                         user?.userId?.name?.toLowerCase() || ""
//   //                       return staffName.includes(searchQuery.toLowerCase())
//   //                     })

//   //               setLeaveList(filteredList)
//   //               setLoader(false)
//   //               // Update state only if the list has items
//   //             } else {
//   //               setLoader(false)
//   //               setLeaveList([])
//   //             }

//   //             // Initialize isToggled state based on the status of each leave request
//   //             const initialToggles = {}
//   //             const initialReject = {}
//   //             const initialSelectAll = {}
//   //             if (user.role === "Admin") {
//   //               list.forEach((userLeave) => {
//   //                 const userId = userLeave?.userId?._id
//   //                 // Check the `status` field for each leave and set the toggle accordingly
//   //                 initialToggles[userLeave?._id] =
//   //                   userLeave?.hrstatus === "HR/Onsite Approved" // Toggle on if approved
//   //                 initialReject[userLeave?._id] =
//   //                   userLeave?.hrstatus === "HR Rejected"
//   //                 const userLeaves = list.filter(
//   //                   (leave) => leave?.userId?._id === userId
//   //                 )

//   //                 // Check if all are approved
//   //                 initialSelectAll[userId] = userLeaves.every(
//   //                   (leave) => leave.hrstatus === "HR/Onsite Approved"
//   //                 )
//   //               })
//   //             } else {
//   //               list.forEach((userLeave) => {
//   //                 const userId = userLeave.userId._id
//   //                 // Check the `status` field for each leave and set the toggle accordingly
//   //                 initialToggles[userLeave?._id] =
//   //                   userLeave?.departmentstatus === "Dept Approved" // Toggle on if approved
//   //                 initialReject[userLeave?._id] =
//   //                   userLeave?.departmentstatus === "Dept Rejected"
//   //                 const userLeaves = list.filter(
//   //                   (leave) => leave?.userId?._id === userId
//   //                 )

//   //                 // Check if all are approved
//   //                 initialSelectAll[userId] = userLeaves.every(
//   //                   (leave) => leave.hrstatus === "Dept Approved"
//   //                 )
//   //               })
//   //             }
//   //             setLoader(false)
//   //             setIsToggled(initialToggles)
//   //             setLeaveStatus(initialReject)
//   //             setIsSelected(initialSelectAll)
//   //           } catch (error) {
//   //             console.error("Error fetching leave list:", error)
//   //           }
//   //         }
//   //       }

//   //       if (pendingLeave || pendingOnsite) {
//   //         fetchPendingList()
//   //       } else if (approvedLeave || approvedOnsite) {
//   //         fetchApprovedList()
//   //       }
//   //     }

//   //     setLoader(false)
//   //     setLoading(false)
//   //   } catch (error) {
//   //     setLoader(false)
//   //     console.log("error:", error.message)
//   //   }
//   // }
// const fetchData = async () => {
//   if (!dates.startDate || !dates.endDate || !user) return;

//   setLoader(true);
//   setLoading(true);

//   try {
//     let list = [];

//     if (mispunchMode) {
//       const response = await api.get(
//         `/auth/getallmisspunch?startDate=${dates.startDate}&endDate=${dates.endDate}`
//       );

//       list = response?.data?.data || [];
//       setMisspunchList(list);
//       return;
//     }

//     if (pendingLeave && !pendingOnsite) {
//       const response = await api.get(
//         `/auth/pendingleaveList?onsite=false&startdate=${dates.startDate}&enddate=${dates.endDate}&role=${user?.role}&userid=${user?._id}`
//       );
//       list = response?.data?.data || [];
//     } else if (pendingOnsite && !pendingLeave) {
//       const response = await api.get(
//         `/auth/pendingOnsiteList?onsite=true&startdate=${dates.startDate}&enddate=${dates.endDate}&userid=${user?._id}&role=${user?.role}`
//       );
//       list = response?.data?.data || [];
//     } else if (approvedOnsite && !approvedLeave) {
//       const response = await api.get(
//         `/auth/approvedOnsiteList?onsite=true&startdate=${dates.startDate}&enddate=${dates.endDate}&role=${user?.role}&userid=${user?._id}`
//       );
//       list = response?.data?.data || [];
//     } else if (approvedLeave && !approvedOnsite) {
//       const response = await api.get(
//         `/auth/approvedLeaveList?onsite=false&startdate=${dates.startDate}&enddate=${dates.endDate}&userid=${user?._id}&role=${user?.role}`
//       );
//       list = response?.data?.data || [];
//     }

//     setallleaveReques(list);

//     const filteredList =
//       searchQuery.trim() === ""
//         ? list
//         : list.filter((item) => {
//             const staffName = item?.userId?.name?.toLowerCase() || "";
//             return staffName.includes(searchQuery.toLowerCase());
//           });

//     setLeaveList(filteredList);

//     const initialToggles = {};
//     const initialReject = {};
//     const initialSelectAll = {};

//     if (user?.role === "Admin") {
//       list.forEach((userLeave) => {
//         const userId = userLeave?.userId?._id;

//         initialToggles[userLeave?._id] =
//           userLeave?.hrstatus === "HR/Onsite Approved";
//         initialReject[userLeave?._id] =
//           userLeave?.hrstatus === "HR Rejected";

//         if (userId) {
//           const userLeaves = list.filter(
//             (leave) => leave?.userId?._id === userId
//           );
//           initialSelectAll[userId] = userLeaves.every(
//             (leave) => leave?.hrstatus === "HR/Onsite Approved"
//           );
//         }
//       });
//     } else {
//       list.forEach((userLeave) => {
//         const userId = userLeave?.userId?._id;

//         initialToggles[userLeave?._id] =
//           userLeave?.departmentstatus === "Dept Approved";
//         initialReject[userLeave?._id] =
//           userLeave?.departmentstatus === "Dept Rejected";

//         if (userId) {
//           const userLeaves = list.filter(
//             (leave) => leave?.userId?._id === userId
//           );
//           initialSelectAll[userId] = userLeaves.every(
//             (leave) => leave?.departmentstatus === "Dept Approved"
//           );
//         }
//       });
//     }

//     setIsToggled(initialToggles);
//     setLeaveStatus(initialReject);
//     setIsSelected(initialSelectAll);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   } finally {
//     setLoader(false);
//     setLoading(false);
//   }
// };
//   useEffect(() => {
//     if (user && dates.startDate && dates.endDate) {
//       fetchData()
//     }
//   }, [
//     user,
//     dates,
//     ispending,
//     pendingLeave,
//     pendingOnsite,
//     approvedLeave,
//     approvedOnsite,
//     mispunchMode // 🔥 important
//   ])
//   useEffect(() => {
//     const userData = localStorage.getItem("user")
//     const user = JSON.parse(userData)
//     setUser(user)
//   }, [])
//   useEffect(() => {
//     if (headerRef.current) {
//       const headerHeight = headerRef.current.getBoundingClientRect().height
//       setTableHeight(`calc(80vh - ${headerHeight}px)`) // Subtract header height from full viewport height
//     }
//   }, [])
//   useEffect(() => {
//     if (leaveList) {
//       if (searchQuery) {
//         const filtered = leaveList.filter((item) =>
//           item.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase())
//         )
//         setFilteredlist(filtered)
//       }
//     } else {
//       setFilteredlist([])
//     }
//   }, [searchQuery, leaveList])
//   useEffect(() => {
//     const today = dayjs()

//     // Get the start of the current month (1st day of the month, 00:00:00)
//     const startDate = today.startOf("month").format("YYYY-MM-DD HH:mm:ss")

//     // Get the end of the current month (last day of the month, 23:59:59)
//     const endDate = today.endOf("month").format("YYYY-MM-DD HH:mm:ss")

//     setDates({ startDate, endDate })

//     // Last date of the month
//   }, [])

//   const toggleMispunch = () => {
//     setMispunchMode((prev) => !prev)

//     // Reset other modes when switching
//     setPending(true)
//     setPendingLeave(true)
//     setpendingOnsite(false)
//     setApprovedLeave(false)
//     setapprovedOnsite(false)
//   }
//   const ApprovedToggle = async () => {
//     try {
//       setLoader(true)
//       setLoading(true)
//       let response
//       if (!approvedOnsite) {
//         response = await api.get(
//           `/auth/approvedOnsiteList?startdate=${dates.startDate}&enddate=${
//             dates.endDate
//           }&onsite=${true}&userid=${user?._id}&role=${user?.role}`
//         )
//         setapprovedOnsite(!approvedOnsite)
//         setApprovedLeave(!approvedLeave)
//         setonsite(true)
//       } else {
//         response = await api.get(
//           `/auth/approvedLeaveList?onsite=${false}&startdate=${
//             dates.startDate
//           }&enddate=${dates.endDate}&userid=${user?._id}&role=${user?.role}`
//         )
//         setapprovedOnsite(!approvedOnsite)
//         setApprovedLeave(!approvedLeave)
//         setonsite(false)
//       }

//       const list = response.data.data // Assuming API returns data in response.data
//       if (Array.isArray(list) && list.length > 0) {
//         setLoader(false)
//         setLoading(false)
//         setLeaveList(list) // Update state only if the list has items
//       } else {
//         setLoader(false)
//         setLoading(false)
//         setLeaveList([])
//       }

//       // Initialize isToggled state based on the status of each leave request
//       const initialToggles = {}
//       const initialReject = {}
//       const initialSelectAll = {}
//       if (user?.role === "Admin") {
//         list.forEach((userLeave) => {
//           const userId = userLeave.userId._id
//           // Check the `status` field for each leave and set the toggle accordingly
//           initialToggles[userLeave?._id] =
//             userLeave?.hrstatus === "HR/Onsite Approved" // Toggle on if approved
//           initialReject[userLeave?._id] = userLeave.hrstatus === "HR Rejected"

//           const userLeaves = list.filter(
//             (leave) => leave?.userId?._id === userId
//           )

//           // Check if all are approved
//           initialSelectAll[userId] = userLeaves.every(
//             (leave) => leave.hrstatus === "HR/Onsite Approved"
//           )
//         })
//       } else {
//         list.forEach((userLeave) => {
//           const userId = userLeave?.userId?._id
//           // Check the `status` field for each leave and set the toggle accordingly
//           initialToggles[userLeave?._id] =
//             userLeave?.departmentstatus === "Dept Approved" // Toggle on if approved
//           initialReject[userLeave?._id] =
//             userLeave?.departmentstatus === "Dept Rejected"
//           const userLeaves = list.filter((leave) => leave.userId._id === userId)

//           // Check if all are approved
//           initialSelectAll[userId] = userLeaves.every(
//             (leave) => leave.hrstatus === "Dept Approved"
//           )
//         })
//       }

//       setIsSelected(initialSelectAll)
//       setIsToggled(initialToggles)
//       setLeaveStatus(initialReject)
//     } catch (error) {
//       console.log("error:", error.message)
//     }
//   }

//   const PendingToggle = async () => {
//     try {
//       setLoader(true)
//       setLoading(true)
//       let response
//       if (!pendingOnsite) {
//         response = await api.get(
//           `/auth/pendingonsiteList?onsite=true&startdate=${dates.startDate}&enddate=${dates.endDate}&userid=${user?._id}&role=${user?.role}`
//         )
//         setpendingOnsite(!pendingOnsite)
//         setPendingLeave(!pendingLeave)
//         setonsite(true)
//       } else {
//         response = await api.get(
//           `/auth/pendingleaveList?onsite=false&startdate=${dates.startDate}&enddate=${dates.endDate}&userid=${user?._id}&role=${user?.role}`
//         )
//         setpendingOnsite(!pendingOnsite)
//         setPendingLeave(!pendingLeave)
//         setonsite(false)
//       }

//       const list = response.data.data // Assuming API returns data in response.data
//       if (Array.isArray(list) && list.length > 0) {
//         setLoader(false)
//         setLoading(false)
//         setLeaveList(list) // Update state only if the list has items
//       } else {
//         setLoader(false)
//         setLoading(false)
//         setLeaveList([])
//       }

//       // Initialize isToggled state based on the status of each leave request
//       const initialToggles = {}
//       const initialReject = {}
//       const initialSelectAll = {}
//       if (user?.role === "Admin") {
//         list.forEach((userLeave) => {
//           // Check the `status` field for each leave and set the toggle accordingly
//           initialToggles[userLeave?._id] =
//             userLeave?.hrstatus === "HR/Onsite Approved" // Toggle on if approved
//           initialReject[userLeave?._id] = userLeave.hrstatus === "HR Rejected"
//           initialSelectAll[userLeave?.userId?._id] =
//             userLeave?.hrstatus === "HR/Onsite Approved"
//         })
//       } else {
//         list.forEach((userLeave) => {
//           // Check the `status` field for each leave and set the toggle accordingly
//           initialToggles[userLeave?._id] =
//             userLeave?.departmentstatus === "Dept Approved" // Toggle on if approved
//           initialReject[userLeave?._id] =
//             userLeave?.departmentstatus === "Dept Rejected"
//           initialSelectAll[userLeave?.userId?._id] =
//             userLeave?.departmentstatus === "Dept Approved"
//         })
//       }

//       setIsSelected(initialSelectAll)
//       setIsToggled(initialToggles)
//       setLeaveStatus(initialReject)
//     } catch (error) {
//       console.log("error:", error.message)
//     }
//   }
//   const modeLabel = mispunchMode
//     ? "Mispunch"
//     : ispending
//       ? pendingOnsite
//         ? "Pending Onsite"
//         : "Pending Leave"
//       : approvedOnsite
//         ? "Approved Onsite"
//         : "Approved Leave"

//   const dateColHeader = mispunchMode
//     ? "Mispunch Date"
//     : pendingLeave || approvedLeave
//       ? "Leave Date"
//       : "Onsite Date"
//   console.log(leaveList)
//   console.log(loader)
//   const singleApprovalOrCancel = async (id, userId) => {
//     try {
//       const selectedItem = leaveList.find((item) => item._id === id)
//       console.log(selectedItem)
//       const name = selectedItem?.userId?.name
//       const selectedmispunch = misspunchlist.find((item) => item._id === id)
//       if (mispunchMode) {
//         if (!selectedmispunch) return
//       } else {
//         if (!selectedItem) return
//       }
//       console.log("hhh")
//       setLoader(true)

//       console.log(isToggled)

//       const isTrue = isToggled[id]
//       console.log(isTrue)

//       let response = null

//       // ===============================
//       // 🔴 CANCEL FLOW
//       // ===============================
//       if (isTrue) {
//         // ✅ MISPUNCH CANCEL
//         if (mispunchMode) {
//           response = await api.put(
//             `/auth/cancelMispunchApproval/?role=${user?.role}&selectedId=${id}&userId=${user?._id}&name=${name}`
//           )
//         }

//         // ✅ LEAVE CANCEL
//         else if (approvedLeave && !approvedOnsite) {
//           response = await api.put(
//             `/auth/cancelLeaveApproval/?role=${user?.role}&selectedId=${id}&startDate=${dates.startDate}&endDate=${dates.endDate}&onsite=false&userId=${user?._id}&single=true&name=${name}`
//           )
//         }

//         // ✅ ONSITE CANCEL
//         else if (approvedOnsite && !approvedLeave) {
//           response = await api.put(
//             `/auth/cancelOnsiteApproval/?role=${user?.role}&selectedId=${id}&startDate=${dates.startDate}&endDate=${dates.endDate}&onsite=true&userId=${user?._id}&single=true&name=${name}`
//           )
//         }
//       }

//       // ===============================
//       // 🟢 APPROVE FLOW
//       // ===============================
//       else {
//         // ✅ MISPUNCH APPROVE
//         if (mispunchMode) {
//           console.log("hhh")
//           response = await api.put(
//             `/auth/approveMispunch/?role=${user?.role}&selectedId=${id}&userId=${user?._id}&startDate=${dates.startDate}&endDate=${dates.endDate}&misspunchDate=${selectedmispunch.misspunchDate}&misspunchType=${selectedmispunch.misspunchType}`
//           )
//         }

//         // ✅ PENDING ONSITE
//         else if (pendingOnsite && !pendingLeave) {
//           response = await api.put(
//             `/auth/approveOnsite/?role=${user?.role}&selectedId=${id}&startDate=${dates.startDate}&endDate=${dates.endDate}&onsite=true&userId=${user?._id}&single=true&name=${name}&isPending=true`
//           )
//         }

//         // ✅ PENDING LEAVE
//         else if (!pendingOnsite && pendingLeave) {
//           response = await api.put(
//             `/auth/approveLeave/?role=${user?.role}&selectedId=${id}&userId=${user?._id}&startDate=${dates.startDate}&endDate=${dates.endDate}&single=true&onsite=false&name=${name}&isPending=true`
//           )
//         }

//         // ✅ APPROVED LEAVE (re-approve scenario)
//         else if (approvedLeave && !approvedOnsite) {
//           console.log("ru")
//           response = await api.put(
//             `/auth/approveLeave/?role=${user?.role}&selectedId=${id}&userId=${user?._id}&startDate=${dates.startDate}&endDate=${dates.endDate}&single=true&onsite=false&name=${name}&isPending=false`
//           )
//         }

//         // ✅ APPROVED ONSITE
//         else if (approvedOnsite && !approvedLeave) {
//           console.log("hhh")

//           response = await api.put(
//             `/auth/approveOnsite/?role=${user?.role}&selectedId=${id}&startDate=${dates.startDate}&endDate=${dates.endDate}&onsite=true&userId=${user?._id}&single=true&name=${name}&isPending=false`
//           )
//         }
//       }

//       // ===============================
//       // 🧠 COMMON RESPONSE HANDLING
//       // ===============================
//       if (response && (response.status === 200 || response.status == 201)) {
//         const updatedList = response.data.data

//         toast.success(response.data.message || "Success")
//         if (mispunchMode) {
//           console.log("hhhhh")
//           setMisspunchList(updatedList)
//         } else {
//           console.log("hhh")
//           setLeaveList(updatedList)
//         }

//         // Toggle state
//         setIsToggled((prev) => ({
//           ...prev,
//           [id]: !prev[id]
//         }))

//         setIsSelected((prev) => ({
//           ...prev,
//           [userId]: !prev[userId]
//         }))
//       } else {
//         toast.error("Something went wrong")
//       }
//     } catch (error) {
//       console.error(error.message)
//       console.log(error.response.data.message)
//       toast.error(error.response.data.message)
//     } finally {
//       setLoader(false)
//     }
//   }

//   const toggleReject = async (id, category) => {
//     try {
//       setLoader(true)

//       const states = {
//         pendingOnsite,
//         approvedOnsite,
//         pendingLeave,
//         approvedLeave
//       }

//       const trueState = Object.keys(states).find((key) => states[key] === true)

//       const checkOnsite =
//         pendingOnsite || approvedOnsite
//           ? true
//           : pendingLeave || approvedLeave
//             ? false
//             : false

//       if (checkOnsite) {
//         const onsiteReject = await api.put(
//           `/auth/rejectOnsite/?role=${user.role}&selectedId=${id}&userId=${user._id}&startdate=${dates.startDate}&enddate=${dates.endDate}&feild=${trueState}`
//         )

//         if (onsiteReject.status === 200) {
//           const list = onsiteReject.data.data

//           const initialToggles = {}
//           const initialSelectAll = {}

//           if (user?.role === "Admin") {
//             list.forEach((userOnsite) => {
//               // Check the `status` field for each leave and set the toggle accordingly
//               initialToggles[userOnsite?._id] =
//                 userOnsite?.hrstatus === "HR/Onsite Approved" // Toggle on if approved
//               initialSelectAll[userOnsite._id] =
//                 userOnsite.hrstatus === "HR/Onsite Approved"
//             })
//           } else {
//             list.forEach((userOnsite) => {
//               // Check the `status` field for each leave and set the toggle accordingly
//               initialToggles[userOnsite?._id] =
//                 userOnsite?.departmentstatus === "Dept Approved" // Toggle on if approved
//               initialSelectAll[userOnsite.userId._id] =
//                 userOnsite?.departmentstatus === "Dept Approved"
//             })
//           }
//           setIsToggled(initialToggles)
//           setIsSelected(initialSelectAll)
//           setLeaveList(list)

//           setLeaveStatus((prevState) => ({
//             ...prevState,
//             [id]: !prevState[id] // Toggle the specific user's state
//           }))
//           toast.success(onsiteReject.data.message)
//           setLoader(false)
//         }
//       } else if (!checkOnsite) {
//         const leaveReject = await api.put(
//           `/auth/rejectLeave/?role=${user.role}&selectedId=${id}&userId=${user._id}&startdate=${dates.startDate}&enddate=${dates.endDate}&feild=${trueState}&leaveCategory=${category}`
//         )

//         if (leaveReject.status === 200) {
//           const list = leaveReject.data.data

//           const initialToggles = {}
//           const initialSelectAll = {}

//           if (user?.role === "Admin") {
//             list.forEach((userLeave) => {
//               // Check the `status` field for each leave and set the toggle accordingly
//               initialToggles[userLeave?._id] =
//                 userLeave?.hrstatus === "HR/Onsite Approved" // Toggle on if approved
//               initialSelectAll[userLeave?._id] =
//                 userLeave?.hrstatus === "HR/Onsite Approved"
//             })
//           } else {
//             list.forEach((userLeave) => {
//               // Check the `status` field for each leave and set the toggle accordingly
//               initialToggles[userLeave?._id] =
//                 userLeave?.departmentstatus === "Dept Approved" // Toggle on if approved
//               initialSelectAll[userLeave?.userId?._id] =
//                 userLeave?.departmentstatus === "Dept Approved"
//             })
//           }
//           setIsToggled(initialToggles)
//           setIsSelected(initialSelectAll)
//           setLeaveList(list)

//           setLeaveStatus((prevState) => ({
//             ...prevState,
//             [id]: !prevState[id] // Toggle the specific user's state
//           }))
//           toast.success(leaveReject.data.message)
//           setLoader(false)
//         }
//       }
//     } catch (error) {
//       setLoader(false)
//       console.log("error:", error.message)
//       toast.error("An error occured ")
//     }
//   }

//   const approveAll = async (id, userId) => {
//     const name = leaveList.find((item) => item._id === id)?.userId?.name

//     // return
//     setLoader(true)
//     pendingOnsite
//     pendingLeave
//     approvedLeave
//     approvedOnsite
//     let approveAllRequest
//     let successAll
//     if (pendingLeave) {
//       approveAllRequest = await api.put(
//         `/auth/approveLeave/?role=${
//           user?.role
//         }&selectedId=${userId}&selectAll=${true}&startDate=${
//           dates.startDate
//         }&endDate=${dates.endDate}&userId=${
//           user?._id
//         }&onsite=false&name=${name}&isPending=true`
//       )
//       successAll = approveAllRequest.data.data
//     } else if (pendingOnsite) {
//       approveAllRequest = await api.put(
//         `/auth/approveOnsite/?role=${
//           user?.role
//         }&selectedId=${userId}&selectAll=${true}&startDate=${
//           dates.startDate
//         }&endDate=${dates.endDate}&userId=${
//           user?._id
//         }&onsite=true&isPending=true`
//       )
//       successAll = approveAllRequest.data.data
//     } else if (approvedLeave) {
//       approveAllRequest = await api.put(
//         `/auth/approveLeave/?role=${
//           user?.role
//         }&selectedId=${userId}&selectAll=${true}&startDate=${
//           dates.startDate
//         }&endDate=${dates.endDate}&userId=${
//           user?._id
//         }&onsite=true&isPending=false`
//       )
//       successAll = approveAllRequest.data.data
//     } else if (approvedOnsite) {
//       approveAllRequest = await api.put(
//         `/auth/approveOnsite/?role=${
//           user?.role
//         }&selectedId=${userId}&selectAll=${true}&startDate=${
//           dates.startDate
//         }&endDate=${dates.endDate}&userId=${
//           user?._id
//         }&onsite=true&isPending=false`
//       )
//       successAll = approveAllRequest.data.data
//     }
//     if (approveAllRequest.status === 200) {
//       toast.success(approveAllRequest.data.message)
//       setLeaveList(successAll)
//       const selectedid = successAll
//         .filter((id) => id.userId._id === userId)
//         .map((item) => item._id)

//       setIsToggled((prevState) => {
//         // Create a new state object with toggled values for all userIds in the selectedid array
//         const newState = { ...prevState }

//         // Iterate over each userId in the selectedid array and toggle its state
//         selectedid.forEach((userId) => {
//           newState[userId] = !newState[userId]
//         })

//         return newState
//       })
//       setLeaveStatus((prevState) => {
//         // Create a new state object with toggled values for all userIds in the selectedid array
//         const newState = { ...prevState }

//         // Iterate over each userId in the selectedid array and toggle its state
//         selectedid.forEach((userId) => {
//           newState[userId] = !newState[userId]
//         })

//         return newState
//       })
//       setIsSelected((prevState) => ({
//         ...prevState,
//         [userId]: !prevState[userId] // Toggle the specific user's state
//       }))
//       setLoader(false)
//     }
//   }
//   const handleToggleStatus = (index) => {
//     setLeaveStatus((prevStatus) => {
//       const newStatus = [...prevStatus]
//       newStatus[index] = !newStatus[index] // Toggle the status
//       return newStatus
//     })
//   }
//   const getStatusBadge = (status) => {
//     console.log(status)
//     if (status === "HR/Onsite Approved") {
//       console.log("hhh")
//     }
//     const s = status?.toLowerCase()
//     const map = {
//       approved: "bg-green-100 text-green-700 border-green-200",
//       pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
//       rejected: "bg-red-100 text-red-700 border-red-200"
//     }

//     return (
//       <span
//         className={`px-2 py-0.5 text-xs font-medium rounded-full border ${
//           map[s] || "bg-gray-100 text-gray-600 border-gray-200"
//         }`}
//       >
//         {status || "—"}
//       </span>
//     )
//   }
//   const handleDate = (selectedDate) => {
//     const extractDateAndMonth = (date) => {
//       const year = date.getFullYear()
//       const month = date.getMonth() + 1 // getMonth() is 0-indexed
//       const day = date.getDate()
//       return `${year}-${month.toString().padStart(2, "0")}-${day
//         .toString()
//         .padStart(2, "0")}`
//     }

//     if (
//       selectedDate.startDate instanceof Date &&
//       !isNaN(selectedDate.startDate.getTime()) &&
//       selectedDate.endDate instanceof Date &&
//       !isNaN(selectedDate.endDate.getTime())
//     ) {
//       // If both startDate and endDate are valid Date objects
//       setDates({
//         startDate: extractDateAndMonth(selectedDate.startDate),
//         endDate: extractDateAndMonth(selectedDate.endDate)
//       })
//     } else {
//       // If dates are not valid Date objects, use them as they are
//       setDates({
//         startDate: selectedDate.startDate,
//         endDate: selectedDate.endDate
//       })
//     }
//   }

//   const handleDropdownSelect = (option) => {
//     if (option === "pending") {
//       if (onsite) {
//         setpendingOnsite(true)
//         setPendingLeave(false)
//         setapprovedOnsite(false)
//         setApprovedLeave(false)
//       } else {
//         setPendingLeave(true)
//         setpendingOnsite(false)
//         setapprovedOnsite(false)
//         setApprovedLeave(false)
//       }

//       setLoader(true)
//       setPending(true)
//     } else if (option === "approved") {
//       if (onsite) {
//         setapprovedOnsite(true)
//         setpendingOnsite(!pendingOnsite)
//         setApprovedLeave(false)
//         setPendingLeave(false)
//       } else {
//         setApprovedLeave(true)
//         setapprovedOnsite(false)
//         setpendingOnsite(false)
//         setPendingLeave(false)
//       }
//       setLoader(true)

//       setPending(false)
//     }
//   }
//   return (
//     <div className="h-full overflow-hidden bg-[#ADD8E6] flex flex-col">
//       {loader && (
//         <div className="fixed top-0 left-0 right-0 z-50">
//           <BarLoader
//             cssOverride={{ width: "100%", height: "4px" }}
//             color="#3B82F6"
//           />
//         </div>
//       )}

//       <div className="flex flex-col h-full px-3 sm:px-4 md:px-5 py-2 gap-2">
//         {/* Compact Header */}
//         <div className="shrink-0 bg-white rounded-xl shadow-sm border border-gray-200 p-3">
//           {/* Top row */}
//           <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-2 mb-2">
//             <div>
//               <h1 className="text-lg sm:text-xl font-bold text-gray-800 leading-tight">
//                 {mispunchMode
//                   ? "Mispunch Approval"
//                   : pendingOnsite || approvedOnsite
//                     ? "Onsite Approval"
//                     : "Leave Approval"}
//               </h1>
//             </div>

//             {/* Search on right */}
//             <div className="w-full lg:w-64">
//               <div className="relative">
//                 <svg
//                   className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                   />
//                 </svg>
//                 <input
//                   type="text"
//                   placeholder="Search staff..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full h-9 pl-9 pr-3 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Controls row */}
//           <div
//             className={"grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"}
//           >
//             {/* Mispunch Toggle */}
//             <div className="h-9 flex items-center justify-between rounded-lg border border-gray-300 bg-gray-50 px-3">
//               <span className="text-sm font-medium text-gray-700">
//                 Mispunch
//               </span>
//               <button
//                 onClick={toggleMispunch}
//                 aria-label="Toggle mispunch mode"
//                 className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
//                   mispunchMode ? "bg-indigo-600" : "bg-gray-300"
//                 }`}
//               >
//                 <span
//                   className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
//                     mispunchMode ? "translate-x-5" : "translate-x-1"
//                   }`}
//                 />
//               </button>
//             </div>

//             <div
//               className={`h-9 flex items-center justify-between rounded-lg border px-3 transition-all ${
//                 mispunchMode
//                   ? "border-gray-200 bg-gray-100 opacity-50 pointer-events-none blur-[1px]"
//                   : "border-gray-300 bg-gray-50"
//               }`}
//             >
//               <span className="text-sm font-medium text-gray-700 truncate">
//                 {modeLabel}
//               </span>

//               <button
//                 onClick={ispending ? PendingToggle : ApprovedToggle}
//                 disabled={mispunchMode}
//                 aria-label="Toggle onsite or leave"
//                 className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
//                   (ispending && pendingOnsite) || (!ispending && approvedOnsite)
//                     ? "bg-blue-600"
//                     : "bg-gray-300"
//                 }`}
//               >
//                 <span
//                   className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
//                     (ispending && pendingOnsite) ||
//                     (!ispending && approvedOnsite)
//                       ? "translate-x-5"
//                       : "translate-x-1"
//                   }`}
//                 />
//               </button>
//             </div>
//             <div
//               className={`relative transition-all ${
//                 mispunchMode ? "opacity-50 pointer-events-none blur-[1px]" : ""
//               }`}
//             >
//               <select
//                 onChange={(e) => handleDropdownSelect(e.target.value)}
//                 value={ispending ? "pending" : "approved"}
//                 disabled={mispunchMode}
//                 className="w-full h-9 pl-3 pr-8 text-sm border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer"
//               >
//                 <option value="pending">Pending</option>
//                 <option value="approved">Approved</option>
//               </select>

//               <svg
//                 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M19 9l-7 7-7-7"
//                 />
//               </svg>
//             </div>

//             {/* Date Range */}
//             {dates.startDate && (
//               <MyDatePicker setDates={setDates} dates={dates} compact />
//             )}
//           </div>
//         </div>
//         {loader ? (
//           <CardSkeletonLoader count={5} />
//         ) : (
//           <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
//             <div className="flex-1 overflow-auto">
//               <table className="min-w-full divide-y divide-gray-200 text-xs">
//                 <thead className="bg-gray-50 sticky top-0 z-10">
//                   <tr>
//                     <th className="px-2 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
//                       #
//                     </th>
//                     <th className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
//                       Name
//                     </th>
//                     <th className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">
//                       Dept
//                     </th>

//                     <th className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">
//                       Apply Date
//                     </th>
//                     <th className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
//                       {dateColHeader}
//                     </th>
//                     <th className="px-3 py-2 text-center font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">
//                       Type
//                     </th>
//                     {!mispunchMode && (
//                       <th className="px-3 py-2 text-center font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden xl:table-cell">
//                         Shift
//                       </th>
//                     )}

//                     <th className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden xl:table-cell">
//                       Reason
//                     </th>
//                     <th className="px-3 py-2  font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden xl:table-cell text-center">
//                       Dpt.Status
//                     </th>
//                     <th className="px-3 py-2 text-center font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden xl:table-cell">
//                       HR.Status
//                     </th>
//                     <th className="px-3 py-2 text-center font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
//                       Approve
//                     </th>
//                     <th className="px-3 py-2 text-center font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">
//                       All
//                     </th>
//                     <th className="px-3 py-2 text-center font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
//                       Reject
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody className="bg-white divide-y divide-gray-100">
//                   {(mispunchMode
//                     ? misspunchlist
//                     : searchQuery
//                       ? filteredlist
//                       : leaveList
//                   )?.length > 0 ? (
//                     (mispunchMode
//                       ? misspunchlist
//                       : searchQuery
//                         ? filteredlist
//                         : leaveList
//                     ).map((user, index) => {
//                       const dateVal =
//                         pendingLeave || approvedLeave
//                           ? user?.leaveDate
//                           : mispunchMode
//                             ? user?.mispunchDate
//                             : user?.onsiteDate
//                       console.log(user?.misspunchDate)
//                       console.log(mispunchMode)
//                       return (
//                         <tr
//                           key={user._id}
//                           className="hover:bg-blue-50 transition-colors duration-150"
//                         >
//                           <td className="px-2 py-2 whitespace-nowrap font-medium text-gray-500">
//                             {index + 1}
//                           </td>

//                           <td className="px-3 py-2 whitespace-nowrap">
//                             <div className="flex items-center gap-2">
//                               <div className="h-7 w-7 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shrink-0">
//                                 <span className="text-white text-xs font-semibold">
//                                   {user?.userId?.name?.charAt(0)?.toUpperCase()}
//                                 </span>
//                               </div>
//                               <div className="min-w-0">
//                                 <div className="font-medium text-gray-900 truncate max-w-[100px] sm:max-w-none">
//                                   {user?.userId?.name}
//                                 </div>
//                                 <div className="text-gray-500 sm:hidden truncate max-w-[100px]">
//                                   {user?.userId?.department?.department}
//                                 </div>
//                               </div>
//                             </div>
//                           </td>

//                           <td className="px-3 py-2 text-gray-700 whitespace-nowrap hidden sm:table-cell">
//                             {user?.userId?.department?.department}
//                           </td>

//                           <td className="px-3 py-2 text-gray-700 whitespace-nowrap hidden lg:table-cell">
//                             {new Date(user?.createdAt).toLocaleDateString(
//                               "en-GB"
//                             )}
//                           </td>

//                           <td className="px-3 py-2 text-gray-700 whitespace-nowrap">
//                             {mispunchMode
//                               ? new Date(
//                                   user?.misspunchDate
//                                 ).toLocaleDateString("en-GB")
//                               : new Date(
//                                   user?.leaveDate || user?.onsiteDate
//                                 ).toLocaleDateString("en-GB")}
//                           </td>

//                           <td className="px-3 py-2 whitespace-nowrap hidden md:table-cell text-center">
//                             <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700 border border-purple-200">
//                               {mispunchMode
//                                 ? user?.misspunchType
//                                 : pendingLeave || approvedLeave
//                                   ? user?.leaveType
//                                   : user?.onsiteType}
//                             </span>
//                           </td>
//                           {!mispunchMode && (
//                             <td className="px-3 py-2 text-gray-700 whitespace-nowrap hidden xl:table-cell text-center">
//                               {user?.halfDayPeriod || "—"}
//                             </td>
//                           )}

//                           <td className="px-3 py-2 text-gray-700 hidden xl:table-cell">
//                             <div
//                               className="max-w-[160px] truncate"
//                               title={user?.reason || user?.description}
//                             >
//                               {mispunchMode
//                                 ? user?.remark
//                                 : user?.reason || user?.description || "—"}
//                             </div>
//                           </td>

//                           <td className="px-3 py-2 whitespace-nowrap hidden xl:table-cell text-center">
//                             {getStatusBadge(user?.departmentstatus)}
//                           </td>

//                           <td className="px-3 py-2 whitespace-nowrap hidden xl:table-cell text-center">
//                             {getStatusBadge(user?.hrstatus)}
//                           </td>

//                           <td className="px-3 py-2 whitespace-nowrap">
//                             <div className="flex justify-center">
//                               <button
//                                 onClick={() =>
//                                   singleApprovalOrCancel(
//                                     user?._id,
//                                     user?.userId?._id
//                                   )
//                                 }
//                                 aria-label={
//                                   isToggled[user?._id]
//                                     ? "Revoke approval"
//                                     : "Approve"
//                                 }
//                                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 ${
//                                   isToggled[user?._id]
//                                     ? "bg-green-500"
//                                     : "bg-gray-300"
//                                 }`}
//                               >
//                                 <span
//                                   className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
//                                     isToggled[user?._id]
//                                       ? "translate-x-6"
//                                       : "translate-x-1"
//                                   }`}
//                                 />
//                               </button>
//                             </div>
//                           </td>

//                           <td className="px-3 py-2 whitespace-nowrap hidden md:table-cell">
//                             <div className="flex justify-center">
//                               <button
//                                 onClick={() =>
//                                   approveAll(user?._id, user?.userId?._id)
//                                 }
//                                 className={`px-3 py-1 rounded-lg text-xs font-medium text-white transition-all duration-200 ${
//                                   isSelected[user?.userId?._id]
//                                     ? "bg-green-500 hover:bg-green-600"
//                                     : "bg-orange-500 hover:bg-orange-600"
//                                 }`}
//                               >
//                                 All
//                               </button>
//                             </div>
//                           </td>

//                           <td className="px-3 py-2 whitespace-nowrap">
//                             <div className="flex justify-center">
//                               <DeleteAlert
//                                 onDelete={toggleReject}
//                                 Id={user._id}
//                                 category={user?.leaveCategory}
//                               />
//                             </div>
//                           </td>
//                         </tr>
//                       )
//                     })
//                   ) : (
//                     <tr>
//                       <td colSpan="14" className="px-4 py-10 text-center">
//                         <div className="flex flex-col items-center justify-center gap-2">
//                           <svg
//                             className="w-10 h-10 text-gray-300"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={1.5}
//                               d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                             />
//                           </svg>
//                           <p className="text-gray-500 text-sm font-medium">
//                             {loading
//                               ? "Loading requests..."
//                               : mispunchMode
//                                 ? "No mispunch requests found"
//                                 : pendingOnsite || approvedOnsite
//                                   ? "No onsite requests found"
//                                   : "No leave requests found"}
//                           </p>
//                           <p className="text-gray-400 text-xs">
//                             Try adjusting your filters or date range
//                           </p>
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default LeaveApprovalAndPending

import { useState, useEffect, useMemo, useRef } from "react" /////git code upadted uiiii
import DeleteAlert from "./DeleteAlert"
import { CardSkeletonLoader } from "./CardSkeletonLoader"
import { toast } from "react-toastify"
import BarLoader from "react-spinners/BarLoader"
import MyDatePicker from "./MyDatePicker"
import api from "../../api/api"
import dayjs from "dayjs"

const LeaveApprovalAndPending = () => {
  const [user, setUser] = useState(null)
  const [mispunchMode, setMispunchMode] = useState(false)
  const [misspunchlist, setMisspunchList] = useState([])
  console.log(misspunchlist)
  const [leaveList, setLeaveList] = useState([])
  const [allleaveRequest, setallleaveReques] = useState([])
  const [loading, setLoading] = useState(true)
  const [loader, setLoader] = useState(false)
  const [onsite, setonsite] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [ispending, setPending] = useState(true)
  const [leaveStatus, setLeaveStatus] = useState({})
  const [isToggled, setIsToggled] = useState({})
  const [pendingOnsite, setpendingOnsite] = useState(false)
  const [pendingLeave, setPendingLeave] = useState(true)
  const [approvedLeave, setApprovedLeave] = useState(false)
  const [approvedOnsite, setapprovedOnsite] = useState(false)
  const [isSelected, setIsSelected] = useState({})
  const headerRef = useRef(null)
  const [tableHeight, setTableHeight] = useState("auto")
  const [dates, setDates] = useState({ startDate: "", endDate: "" })

  const getApprovalStatus = (item) => {
    if (!item) return false

    if (mispunchMode) {
      const status =
        item?.hrstatus || item?.departmentstatus || item?.status || ""
      return (
        status === "HR/Onsite Approved" ||
        status === "HR Approved" ||
        status === "Dept Approved" ||
        status === "Approved"
      )
    }

    if (user?.role === "Admin") {
      return (
        item?.hrstatus === "HR/Onsite Approved" ||
        item?.hrstatus === "HR Approved"
      )
    }

    return item?.departmentstatus === "Dept Approved"
  }

  const getRejectStatus = (item) => {
    if (!item) return false

    if (mispunchMode) {
      const status =
        item?.hrstatus || item?.departmentstatus || item?.status || ""
      return (
        status === "HR Rejected" ||
        status === "Dept Rejected" ||
        status === "Rejected"
      )
    }

    if (user?.role === "Admin") {
      return item?.hrstatus === "HR Rejected"
    }

    return item?.departmentstatus === "Dept Rejected"
  }

  const buildStatesFromList = (list) => {
    console.log("h")
    const initialToggles = {}
    const initialReject = {}
    const initialSelectAll = {}

    list.forEach((item) => {
      const rowId = item?._id
      const rowUserId = item?.userId?._id

      initialToggles[rowId] = getApprovalStatus(item)
      initialReject[rowId] = getRejectStatus(item)

      if (rowUserId) {
        const userRows = list.filter((row) => row?.userId?._id === rowUserId)
        initialSelectAll[rowUserId] =
          userRows.length > 0 && userRows.every((row) => getApprovalStatus(row))
      }
    })

    setIsToggled(initialToggles)
    setLeaveStatus(initialReject)
    setIsSelected(initialSelectAll)
  }

  const currentList = useMemo(() => {
    let source = mispunchMode ? misspunchlist : leaveList
    let source2 = []

    if (mispunchMode) {
      source = source.filter((item) => {
        const hrStatus = item?.hrstatus?.toLowerCase() || ""
        const deptStatus = item?.departmentstatus?.toLowerCase() || ""

        const hrApproved =
          hrStatus.includes("approved") && !hrStatus.includes("not approved")

        const deptApproved =
          deptStatus.includes("approved") &&
          !deptStatus.includes("not approved")

        const isApprovedItem = hrApproved || deptApproved

        return ispending ? !isApprovedItem : isApprovedItem
      })
    }
    console.log(source)

    if (!searchQuery.trim()) return source

    return source.filter((item) =>
      (item?.userId?.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
  }, [mispunchMode, misspunchlist, leaveList, searchQuery, ispending])

  const fetchData = async () => {
    if (!dates.startDate || !dates.endDate || !user) return

    setLoader(true)
    setLoading(true)

    try {
      let list = []

      if (mispunchMode) {
        const response = await api.get(
          `/auth/getallmisspunch?startDate=${dates.startDate}&endDate=${dates.endDate}&userid=${user?._id}&role=${user?.role}`
        )

        list = response?.data?.data || []
        setMisspunchList(list)
        buildStatesFromList(list)
        return
      }

      if (pendingLeave && !pendingOnsite) {
        const response = await api.get(
          `/auth/pendingleaveList?onsite=false&startdate=${dates.startDate}&enddate=${dates.endDate}&role=${user?.role}&userid=${user?._id}`
        )
        list = response?.data?.data || []
      } else if (pendingOnsite && !pendingLeave) {
        const response = await api.get(
          `/auth/pendingOnsiteList?onsite=true&startdate=${dates.startDate}&enddate=${dates.endDate}&userid=${user?._id}&role=${user?.role}`
        )
        list = response?.data?.data || []
      } else if (approvedOnsite && !approvedLeave) {
        const response = await api.get(
          `/auth/approvedOnsiteList?onsite=true&startdate=${dates.startDate}&enddate=${dates.endDate}&role=${user?.role}&userid=${user?._id}`
        )
        list = response?.data?.data || []
      } else if (approvedLeave && !approvedOnsite) {
        const response = await api.get(
          `/auth/approvedLeaveList?onsite=false&startdate=${dates.startDate}&enddate=${dates.endDate}&userid=${user?._id}&role=${user?.role}`
        )
        list = response?.data?.data || []
      }

      setallleaveReques(list)
      setLeaveList(list)
      buildStatesFromList(list)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error(error?.response?.data?.message || "Failed to fetch data")
    } finally {
      setLoader(false)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user && dates.startDate && dates.endDate) {
      fetchData()
    }
  }, [
    user,
    dates,
    ispending,
    pendingLeave,
    pendingOnsite,
    approvedLeave,
    approvedOnsite,
    mispunchMode
  ])

  useEffect(() => {
    const userData = localStorage.getItem("user")
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
  }, [])

  useEffect(() => {
    if (headerRef.current) {
      const headerHeight = headerRef.current.getBoundingClientRect().height
      setTableHeight(`calc(80vh - ${headerHeight}px)`)
    }
  }, [])

  useEffect(() => {
    const today = dayjs()
    const startDate = today.startOf("month").format("YYYY-MM-DD HH:mm:ss")
    const endDate = today.endOf("month").format("YYYY-MM-DD HH:mm:ss")
    setDates({ startDate, endDate })
  }, [])

  const toggleMispunch = () => {
    setMispunchMode((prev) => !prev)
    setPending(true)
    setPendingLeave(true)
    setpendingOnsite(false)
    setApprovedLeave(false)
    setapprovedOnsite(false)
    setonsite(false)
  }

  const ApprovedToggle = () => {
    if (mispunchMode) return

    if (!approvedOnsite) {
      setapprovedOnsite(true)
      setApprovedLeave(false)
      setPendingLeave(false)
      setpendingOnsite(false)
      setonsite(true)
    } else {
      setapprovedOnsite(false)
      setApprovedLeave(true)
      setPendingLeave(false)
      setpendingOnsite(false)
      setonsite(false)
    }

    setPending(false)
  }

  const PendingToggle = () => {
    if (mispunchMode) return

    if (!pendingOnsite) {
      setpendingOnsite(true)
      setPendingLeave(false)
      setapprovedOnsite(false)
      setApprovedLeave(false)
      setonsite(true)
    } else {
      setpendingOnsite(false)
      setPendingLeave(true)
      setapprovedOnsite(false)
      setApprovedLeave(false)
      setonsite(false)
    }

    setPending(true)
  }

  const singleApprovalOrCancel = async (id, userId,misspunchTime) => {
    try {
      setLoader(true)

      const selectedItem = currentList.find((item) => item._id === id)
      if (!selectedItem) return

      const name = selectedItem?.userId?.name || ""
      const isApproved = isToggled[id]
      let response = null

      if (mispunchMode) {
        if (isApproved) {
          response = await api.put(
            `/auth/cancelMispunchApproval/?role=${user?.role}&selectedId=${id}&userId=${user?._id}&name=${name}`
          )
        } else {
          response = await api.put(
            `/auth/approveMispunch/?role=${user?.role}&selectedId=${id}&userId=${user?._id}&startDate=${dates.startDate}&endDate=${dates.endDate}&misspunchDate=${selectedItem?.misspunchDate}&misspunchType=${selectedItem?.misspunchType}&misspunchTime=${misspunchTime}`
          )
        }
      } else if (isApproved) {
        if (approvedLeave && !approvedOnsite) {
          response = await api.put(
            `/auth/cancelLeaveApproval/?role=${user?.role}&selectedId=${id}&startDate=${dates.startDate}&endDate=${dates.endDate}&onsite=false&userId=${user?._id}&single=true&name=${name}`
          )
        } else if (approvedOnsite && !approvedLeave) {
          response = await api.put(
            `/auth/cancelOnsiteApproval/?role=${user?.role}&selectedId=${id}&startDate=${dates.startDate}&endDate=${dates.endDate}&onsite=true&userId=${user?._id}&single=true&name=${name}`
          )
        }
      } else {
        if (pendingOnsite && !pendingLeave) {
          response = await api.put(
            `/auth/approveOnsite/?role=${user?.role}&selectedId=${id}&startDate=${dates.startDate}&endDate=${dates.endDate}&onsite=true&userId=${user?._id}&single=true&name=${name}&isPending=true`
          )
        } else if (!pendingOnsite && pendingLeave) {
          response = await api.put(
            `/auth/approveLeave/?role=${user?.role}&selectedId=${id}&userId=${user?._id}&startDate=${dates.startDate}&endDate=${dates.endDate}&single=true&onsite=false&name=${name}&isPending=true`
          )
        } else if (approvedLeave && !approvedOnsite) {
          response = await api.put(
            `/auth/approveLeave/?role=${user?.role}&selectedId=${id}&userId=${user?._id}&startDate=${dates.startDate}&endDate=${dates.endDate}&single=true&onsite=false&name=${name}&isPending=false`
          )
        } else if (approvedOnsite && !approvedLeave) {
          response = await api.put(
            `/auth/approveOnsite/?role=${user?.role}&selectedId=${id}&startDate=${dates.startDate}&endDate=${dates.endDate}&onsite=true&userId=${user?._id}&single=true&name=${name}&isPending=false`
          )
        }
      }

      if (response && (response.status === 200 || response.status === 201)) {
        const updatedList = response?.data?.data || []
        toast.success(response?.data?.message || "Success")

        if (mispunchMode) {
          setMisspunchList(updatedList)
        } else {
          setLeaveList(updatedList)
        }

        buildStatesFromList(updatedList)
      } else {
        toast.error("Something went wrong")
      }
    } catch (error) {
      console.error(error?.message)
      toast.error(error?.response?.data?.message || "Action failed")
    } finally {
      setLoader(false)
    }
  }

  const toggleReject = async (id, category) => {
    console.log(id)
    console.log(category)
    try {
      setLoader(true)

      let response = null

      if (mispunchMode) {
        console.log("Hhh")
        response = await api.put(
          `/auth/rejectMispunch/?role=${user?.role}&selectedId=${id}&userId=${user?._id}&startDate=${dates.startDate}&endDate=${dates.endDate}`
        )
      } else {
        const states = {
          pendingOnsite,
          approvedOnsite,
          pendingLeave,
          approvedLeave
        }

        const trueState = Object.keys(states).find(
          (key) => states[key] === true
        )
        console.log(trueState)

        const checkOnsite = pendingOnsite || approvedOnsite

        if (checkOnsite) {
          response = await api.put(
            `/auth/rejectOnsite/?role=${user?.role}&selectedId=${id}&userId=${user?._id}&startdate=${dates.startDate}&enddate=${dates.endDate}&feild=${trueState}`
          )
        } else {
          response = await api.put(
            `/auth/rejectLeave/?role=${user?.role}&selectedId=${id}&userId=${user?._id}&startdate=${dates.startDate}&enddate=${dates.endDate}&feild=${trueState}&leaveCategory=${category}`
          )
        }
      }

      if (response?.status === 200) {
        console.log("res", response?.data?.data)
        const list = response?.data?.data || []

        if (mispunchMode) {
          setMisspunchList(list)
        } else {
          setLeaveList(list)
        }

        buildStatesFromList(list)
        toast.success(response?.data?.message || "Rejected successfully")
        return true
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred")
    } finally {
      setLoader(false)
    }
  }

  const approveAll = async (id, userId) => {
    try {
      setLoader(true)

      const baseList = mispunchMode ? misspunchlist : leaveList
      const name = baseList.find((item) => item._id === id)?.userId?.name || ""

      let approveAllRequest = null
      let updatedList = []

      if (mispunchMode) {
        approveAllRequest = await api.put(
          `/auth/approveMispunch/?role=${user?.role}&selectedId=${userId}&selectAll=true&startDate=${dates.startDate}&endDate=${dates.endDate}&userId=${user?._id}`
        )
        updatedList = approveAllRequest?.data?.data || []
      } else if (pendingLeave) {
        approveAllRequest = await api.put(
          `/auth/approveLeave/?role=${user?.role}&selectedId=${userId}&selectAll=true&startDate=${dates.startDate}&endDate=${dates.endDate}&userId=${user?._id}&onsite=false&name=${name}&isPending=true`
        )
        updatedList = approveAllRequest?.data?.data || []
      } else if (pendingOnsite) {
        approveAllRequest = await api.put(
          `/auth/approveOnsite/?role=${user?.role}&selectedId=${userId}&selectAll=true&startDate=${dates.startDate}&endDate=${dates.endDate}&userId=${user?._id}&onsite=true&isPending=true`
        )
        updatedList = approveAllRequest?.data?.data || []
      } else if (approvedLeave) {
        approveAllRequest = await api.put(
          `/auth/approveLeave/?role=${user?.role}&selectedId=${userId}&selectAll=true&startDate=${dates.startDate}&endDate=${dates.endDate}&userId=${user?._id}&onsite=false&name=${name}&isPending=false`
        )
        updatedList = approveAllRequest?.data?.data || []
      } else if (approvedOnsite) {
        approveAllRequest = await api.put(
          `/auth/approveOnsite/?role=${user?.role}&selectedId=${userId}&selectAll=true&startDate=${dates.startDate}&endDate=${dates.endDate}&userId=${user?._id}&onsite=true&isPending=false`
        )
        updatedList = approveAllRequest?.data?.data || []
      }

      if (approveAllRequest?.status === 200) {
        toast.success(
          approveAllRequest?.data?.message || "Approved successfully"
        )

        if (mispunchMode) {
          setMisspunchList(updatedList)
        } else {
          setLeaveList(updatedList)
        }

        buildStatesFromList(updatedList)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Approve all failed")
    } finally {
      setLoader(false)
    }
  }

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase()

    const map = {
      approved: "bg-green-100 text-green-700 border-green-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      rejected: "bg-red-100 text-red-700 border-red-200"
    }

    const matchedKey = Object.keys(map).find((key) => s?.includes(key))

    return (
      <span
        className={`px-2 py-0.5 text-xs font-medium rounded-full border ${
          map[matchedKey] || "bg-gray-100 text-gray-600 border-gray-200"
        }`}
      >
        {status || "—"}
      </span>
    )
  }
  console.log("hhh")
  const handleDate = () => {
    console.log("llhhh")
    setMisspunchList([])
    setLeaveList([])
  }

  const handleDropdownSelect = (option) => {
    if (option === "pending") {
      setPending(true)

      if (!mispunchMode) {
        if (onsite) {
          setpendingOnsite(true)
          setPendingLeave(false)
          setapprovedOnsite(false)
          setApprovedLeave(false)
        } else {
          setPendingLeave(true)
          setpendingOnsite(false)
          setapprovedOnsite(false)
          setApprovedLeave(false)
        }
      }
    } else if (option === "approved") {
      setPending(false)

      if (!mispunchMode) {
        if (onsite) {
          setapprovedOnsite(true)
          setpendingOnsite(false)
          setApprovedLeave(false)
          setPendingLeave(false)
        } else {
          setApprovedLeave(true)
          setapprovedOnsite(false)
          setpendingOnsite(false)
          setPendingLeave(false)
        }
      }
    }
  }

  const modeLabel = mispunchMode
    ? ispending
      ? "Pending Mispunch"
      : "Approved Mispunch"
    : ispending
      ? pendingOnsite
        ? "Pending Onsite"
        : "Pending Leave"
      : approvedOnsite
        ? "Approved Onsite"
        : "Approved Leave"

  const dateColHeader = mispunchMode
    ? "Miss punch Date"
    : pendingLeave || approvedLeave
      ? "Leave Date"
      : "Onsite Date"

  return (
    <div className="h-full overflow-hidden bg-[#ADD8E6] flex flex-col">
      {loader && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <BarLoader
            cssOverride={{ width: "100%", height: "4px" }}
            color="#3B82F6"
          />
        </div>
      )}

      <div className="flex flex-col h-full px-3 sm:px-4 md:px-5 py-2 gap-2">
        <div
          ref={headerRef}
          className="shrink-0 bg-white rounded-xl shadow-sm border border-gray-200 p-3"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-2 mb-2">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-800 leading-tight">
                {mispunchMode
                  ? "Mispunch Approval"
                  : pendingOnsite || approvedOnsite
                    ? "Onsite Approval"
                    : "Leave Approval"}
              </h1>
            </div>

            <div className="w-full lg:w-64">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search staff..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="h-9 flex items-center justify-between rounded-lg border border-gray-300 bg-gray-50 px-3">
              <span className="text-sm font-medium text-gray-700">
                Mispunch
              </span>
              <button
                onClick={toggleMispunch}
                aria-label="Toggle mispunch mode"
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
                  mispunchMode ? "bg-indigo-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                    mispunchMode ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div
              className={`h-9 flex items-center justify-between rounded-lg border px-3 transition-all ${
                mispunchMode
                  ? "border-gray-200 bg-gray-100 opacity-50 pointer-events-none blur-[1px]"
                  : "border-gray-300 bg-gray-50"
              }`}
            >
              <span className="text-sm font-medium text-gray-700 truncate">
                {modeLabel}
              </span>

              <button
                onClick={ispending ? PendingToggle : ApprovedToggle}
                disabled={mispunchMode}
                aria-label="Toggle onsite or leave"
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                  (ispending && pendingOnsite) || (!ispending && approvedOnsite)
                    ? "bg-blue-600"
                    : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                    (ispending && pendingOnsite) ||
                    (!ispending && approvedOnsite)
                      ? "translate-x-5"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="relative transition-all">
              <select
                onChange={(e) => handleDropdownSelect(e.target.value)}
                value={ispending ? "pending" : "approved"}
                className="w-full h-9 pl-3 pr-8 text-sm border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
              </select>

              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {dates.startDate && (
              <MyDatePicker
                setDates={setDates}
                dates={dates}
                compact
                onChange={handleDate}
              />
            )}
          </div>
        </div>

        {loader ? (
          <CardSkeletonLoader count={5} />
        ) : (
          <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div
              className="flex-1 overflow-auto"
              style={{ maxHeight: tableHeight }}
            >
              <table className="min-w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-2 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                      #
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                      Name
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">
                      Dept
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">
                      Apply Date
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                      {dateColHeader}
                    </th>
                    <th className="px-3 py-2 text-center font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">
                      Type
                    </th>
                    {mispunchMode && (
                      <th className="px-3 py-2 text-center font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">
                        Miss punch Time
                      </th>
                    )}
                    {!mispunchMode && (
                      <th className="px-3 py-2 text-center font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden xl:table-cell">
                        Shift
                      </th>
                    )}
                    <th className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden xl:table-cell">
                      Reason
                    </th>
                    <th className="px-3 py-2 font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden xl:table-cell text-center">
                      Dpt.Status
                    </th>
                    <th className="px-3 py-2 text-center font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden xl:table-cell">
                      HR.Status
                    </th>
                    <th className="px-3 py-2 text-center font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                      Approve
                    </th>
                    <th className="px-3 py-2 text-center font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">
                      All
                    </th>
                    <th className="px-3 py-2 text-center font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                      Reject
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-100">
                  {currentList?.length > 0 ? (
                    currentList.map((userRow, index) => (
                      <tr
                        key={userRow._id}
                        className="hover:bg-blue-50 transition-colors duration-150"
                      >
                        <td className="px-2 py-2 whitespace-nowrap font-medium text-gray-500">
                          {index + 1}
                        </td>

                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shrink-0">
                              <span className="text-white text-xs font-semibold">
                                {userRow?.userId?.name
                                  ?.charAt(0)
                                  ?.toUpperCase()}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 truncate max-w-[100px] sm:max-w-none">
                                {userRow?.userId?.name}
                              </div>
                              <div className="text-gray-500 sm:hidden truncate max-w-[100px]">
                                {userRow?.userId?.department?.department}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-3 py-2 text-gray-700 whitespace-nowrap hidden sm:table-cell">
                          {userRow?.userId?.department?.department}
                        </td>

                        <td className="px-3 py-2 text-gray-700 whitespace-nowrap hidden lg:table-cell">
                          {userRow?.createdAt
                            ? new Date(userRow.createdAt).toLocaleDateString(
                                "en-GB"
                              )
                            : "—"}
                        </td>

                        <td className="px-3 py-2 text-gray-700 whitespace-nowrap">
                          {mispunchMode
                            ? userRow?.misspunchDate
                              ? new Date(
                                  userRow.misspunchDate
                                ).toLocaleDateString("en-GB")
                              : "—"
                            : new Date(
                                userRow?.leaveDate || userRow?.onsiteDate
                              ).toLocaleDateString("en-GB")}
                        </td>

                        <td className="px-3 py-2 whitespace-nowrap hidden md:table-cell text-center">
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                            {mispunchMode
                              ? userRow?.misspunchType
                              : pendingLeave || approvedLeave
                                ? userRow?.leaveType
                                : userRow?.onsiteType}
                          </span>
                        </td>
                        {mispunchMode && (
                          <td className="px-3 py-2 whitespace-nowrap hidden md:table-cell text-center">
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                              {userRow?.misspunchTime}
                            </span>
                          </td>
                        )}

                        {!mispunchMode && (
                          <td className="px-3 py-2 text-gray-700 whitespace-nowrap hidden xl:table-cell text-center">
                            {userRow?.halfDayPeriod || "—"}
                          </td>
                        )}

                        <td className="px-3 py-2 text-gray-700 hidden xl:table-cell">
                          <div
                            className="max-w-[160px] truncate"
                            title={
                              userRow?.reason ||
                              userRow?.description ||
                              userRow?.remark
                            }
                          >
                            {mispunchMode
                              ? userRow?.remark || "—"
                              : userRow?.reason || userRow?.description || "—"}
                          </div>
                        </td>

                        <td className="px-3 py-2 whitespace-nowrap hidden xl:table-cell text-center">
                          {getStatusBadge(userRow?.departmentstatus)}
                        </td>

                        <td className="px-3 py-2 whitespace-nowrap hidden xl:table-cell text-center">
                          {getStatusBadge(userRow?.hrstatus || userRow?.status)}
                        </td>

                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="flex justify-center">
                            <button
                              onClick={() =>
                                singleApprovalOrCancel(
                                  userRow?._id,
                                  userRow?.userId?._id,
                                  userRow?.misspunchTime
                                )
                              }
                              aria-label={
                                isToggled[userRow?._id]
                                  ? "Revoke approval"
                                  : "Approve"
                              }
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 ${
                                isToggled[userRow?._id]
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                                  isToggled[userRow?._id]
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>
                        </td>

                        <td className="px-3 py-2 whitespace-nowrap hidden md:table-cell">
                          <div className="flex justify-center">
                            <button
                              onClick={() =>
                                approveAll(userRow?._id, userRow?.userId?._id)
                              }
                              className={`px-3 py-1 rounded-lg text-xs font-medium text-white transition-all duration-200 ${
                                isSelected[userRow?.userId?._id]
                                  ? "bg-green-500 hover:bg-green-600"
                                  : "bg-orange-500 hover:bg-orange-600"
                              }`}
                            >
                              All
                            </button>
                          </div>
                        </td>

                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="flex justify-center">
                            <DeleteAlert
                              onDelete={toggleReject}
                              Id={userRow._id}
                              category={userRow?.leaveCategory}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="14" className="px-4 py-10 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <svg
                            className="w-10 h-10 text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <p className="text-gray-500 text-sm font-medium">
                            {loading
                              ? "Loading requests..."
                              : mispunchMode
                                ? `No ${ispending ? "pending" : "approved"} mispunch requests found`
                                : pendingOnsite || approvedOnsite
                                  ? "No onsite requests found"
                                  : "No leave requests found"}
                          </p>
                          <p className="text-gray-400 text-xs">
                            Try adjusting your filters or date range
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LeaveApprovalAndPending
