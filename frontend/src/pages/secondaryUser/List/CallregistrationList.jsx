import React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import debounce from "lodash.debounce"
import io from "socket.io-client" // Import Socket.IO client
import { FaSearch, FaPhone } from "react-icons/fa"
import Tiles from "../../../components/common/Tiles" // Import the Tile component
import { useNavigate } from "react-router-dom"
import { PropagateLoader } from "react-spinners"
import UseFetch from "../../../hooks/useFetch"
import { getLocalStorageItem } from "../../../helper/localstorage"
import { StaticSidebar } from "../../../components/primaryUser/StaticSidebar"
import AdminHeader from "../../../header/AdminHeader"
import StaffHeader from "../../../header/StaffHeader"
import { PerformanceModal } from "../../../components/primaryUser/PerformanceModal"
// const socket = io("https://www.crm.camet.in");
// const socket = io("http://localhost:9000") // Adjust the URL to your backend
import {
  Eye,
  Phone,
  Mail,
  Settings,
  MessageSquareText,
  User,
  Calendar,
  Clock,
  UserPlus,
  UserCheck,
  IndianRupee,
  BellRing,
  History,
  ChevronDown,
  ChevronRight,
  X
} from "lucide-react"
const CallregistrationList = () => {
  const navigate = useNavigate()
  const [loggedUserBranches, setLoggeduserBranches] = useState([])
  const [today, setToday] = useState(null)
  const [userBranch, setUserBranch] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUser] = useState(null)
  const [expandedRows, setExpandedRows] = useState({})
  const [userCallStatus, setUserCallstatus] = useState([])
  const [callList, setCallList] = useState([])
  const [filteredCalls, setFilteredCalls] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedCompanyBranch, setSelectedCompanyBranch] = useState(null)
  const [selectedcompanybranchId, setselectedcompanybranchId] = useState(null)
  console.log(selectedCompanyBranch)
  // Define states for filtered call counts
  const [pendingCallsCount, setPendingCallsCount] = useState(0)
  const [todayCallsCount, setTodayCallsCount] = useState(0)
  const [solvedCallsCount, setTodaysSolvedCount] = useState(0)
  const [branchids, setbranchids] = useState(null)
  const [selectedUserName, setselecteduserName] = useState(null)
  const [selectedCategory, setselectedCategory] = useState(null)
  const [selectedDatapopup, setselectedDataPopup] = useState({})
  const [selectedYear, setSelectedYear] = useState(null)
  const [periodMode, setperiodMode] = useState("all")
  const [targetData, settargetData] = useState([])
  console.log(targetData)
  const [openModal, setOpenModal] = useState(false)
  const [productlist, setproductList] = useState([])
  const [achievedproducts, setacheivedProducts] = useState([])
  const [selectedPeriod, setselectedPeriod] = useState("")
  // State to track the active filter
  const [activeFilter, setActiveFilter] = useState("All")
  const { data: branches } = UseFetch("/branch/getbranch")
  const { data: callscount, loading: loadingcounts } = UseFetch(
    "/customer/getcallregistrationlist"
  )
  const { data: branchProduct } = UseFetch(
    `/product/getallbranchProduct?branch=${selectedCompanyBranch}`
  )

  // const socketRef = useRef(null)
  // useEffect(() => {
  //   if (!socketRef.current) {
  //     socketRef.current = io("http://localhost:9000", {
  //       transports: ["websocket"], //helps avoid polling issues
  //       reconnection: true, //auto reconnect if dropped
  //       reconnectionAttempts: 5,
  //       timeout: 20000,
  //       // SURVIVES REFRESH - key fix
  //       autoConnect: true
  //     })
  //   }
  //   const socket = socketRef.current
  //   socket.on("connect", () => {
  //     console.log("Connected", socket.id)
  //   })
  //   // socket.on("disconnect", () => {
  //   //   console.log("h")
  //   //   socket.off("connect")
  //   //   socket.off("disconnect")
  //   //   socket.off("updatedCalls")
  //   // })
  //   return () => {
  //     socket.off("connect")
  //     socket.off("disconnect")
  //     socket.off("updatedCalls") // CLEANUP ALL
  //     socket.off("connect_error")
  //     socket.disconnect()
  //   }
  // }, [])
  useEffect(() => {
    if (branches && branches.length > 0) {
      const userData = getLocalStorageItem("user")
      if (userData.role === "Admin") {
        const isselctedArray = userData?.selected
        if (isselctedArray) {
          const loggeduserBranches = userData.selected.map((item) => {
            return { value: item.branch_id, label: item.branchName }
          })

          setLoggeduserBranches(loggeduserBranches)
          setSelectedCompanyBranch(loggeduserBranches[0].label)
        } else {
          const loggeduserBranches = branches.map((item) => {
            return { value: item._id, label: item.branchName }
          })
          setLoggeduserBranches(loggeduserBranches)
          setSelectedCompanyBranch(loggeduserBranches[0].label)
        }
      } else {
        const loggeduserBranches = userData.selected.map((item) => {
          return { value: item.branch_id, label: item.branchName }
        })
        setLoggeduserBranches(loggeduserBranches)
        setSelectedCompanyBranch(loggeduserBranches[0].label)
      }
      setbranchids(userData.selected.map((item) => item.branch_id))

      const branch = userData.selected.map((item) => item.branchName)
      setUserBranch(branch)
      setselectedcompanybranchId(userData.selected[0].branch_id)
      setUser(userData)
    }
  }, [branches])
  const handleMoreClick = (id, name) => {
    const Datas = targetData?.userWiseResults
    console.log(id)
    console.log(name)
    console.log("hh")
    const filteredList = branchProduct
      .filter(
        (item) =>
          item.selected?.some(
            (selectedItem) => String(selectedItem.category_id) === String(id)
          ) || String(item.category_id) === String(id)
      )
      .map((item) => item.productName || item.serviceName)
    console.log(filteredList)
    setproductList(filteredList)
    setselectedCategory({ Id: id, categoryName: name })
    console.log("J")
    console.log(targetData)
    console.log(users?._id)
    const filteredloggedUserItem = Datas.filter(
      (item) => item.userId === users._id
    )
    console.log("hhh")

    console.log(Datas)
    console.log("hhhh")
    console.log(filteredloggedUserItem)
    console.log(id)
    // const filteredselectedCategory =
    //   filteredloggedUserItem[0].categories.filter(
    //     (item) => item.categoryId === id
    //   )
    const filteredselectedCategory = Datas.flatMap(
      (user) => user.categories || []
    ).filter((item) => item.categoryId === id)
    console.log("Hh")
    const summary = filteredselectedCategory.reduce(
      (acc, cur) => {
        acc.target += Number(cur.target || 0)
        acc.achieved += Number(cur.achieved || 0)
        acc.balance += Number(cur.balance || 0)
        return acc
      },
      { target: 0, achieved: 0, balance: 0 }
    )
    console.log("hhh")
    setselectedDataPopup(summary)
    console.log(filteredselectedCategory && filteredselectedCategory.length)
    if (filteredselectedCategory && filteredselectedCategory.length) {
      setacheivedProducts((prev) => [
        ...prev,
        ...filteredselectedCategory.flatMap((item) =>
          (item?.products || []).map((product) => ({
            productname: product.name,
            amount: product.achieved
          }))
        )
      ])
    } else {
      setacheivedProducts([])
    }
    setOpenModal(true)
  }
  const handleSelectedUser = (category, userId, userName) => {
    setselecteduserName(userName)
    setselectedCategory({
      Id: category.Id,
      categoryName: category.categoryName
    })
    const filteredloggedUserItem = data?.userWiseResults.filter(
      (item) => item.userId === userId
    )
    const filteredselectedCategory =
      filteredloggedUserItem[0].categories.filter(
        (item) => item.categoryId === category.Id
      )
    const summary = filteredselectedCategory.reduce(
      (acc, cur) => {
        acc.target += Number(cur.target || 0)
        acc.achieved += Number(cur.achieved || 0)
        acc.balance += Number(cur.balance || 0)
        return acc
      },
      { target: 0, achieved: 0, balance: 0 }
    )

    setselectedDataPopup(summary)
    if (filteredselectedCategory && filteredselectedCategory.length) {
      setacheivedProducts(
        filteredselectedCategory[0]?.products?.map((product) => ({
          productname: product.name,
          amount: product.achieved
        })) || []
      )
    } else {
      setacheivedProducts([])
    }
  }
  const filterCallData = useCallback(
    (calls) => {
      const allCallRegistrations = calls.flatMap(
        (call) => call.callregistration
      )

      // Filter based on status
      const pending = allCallRegistrations.filter(
        (call) => call.formdata?.status?.toLowerCase() === "pending"
      )

      const todaysSolvedCount = getTodaysSolved(calls)
      console.log(todaysSolvedCount.arr)
      console.log(todaysSolvedCount)
      const todaysCallsCount = getTodaysCalls(calls)

      setPendingCallsCount(pending?.length)
      setTodayCallsCount(todaysCallsCount)
      setTodaysSolvedCount(todaysSolvedCount.todaysSolvedCount)
    },
    [users]
  )
  useEffect(() => {
    if (selectedCompanyBranch && callscount) {
      const brancharray = [selectedCompanyBranch]
      const filtered = callscount.filter(
        (call) =>
          Array.isArray(call?.callregistration) && // Check if callregistration is an array
          call.callregistration.some((registration) => {
            const hasMatchingBranch =
              Array.isArray(registration?.branchName) && // Check if branchName is an array
              registration.branchName.some(
                (branch) => brancharray.includes(branch) // Check if any branch matches user's branches
              )

            // If user has only one branch, ensure it matches exactly and no extra branches
            if (brancharray.length === 1) {
              return (
                hasMatchingBranch &&
                registration.branchName.length === 1 &&
                registration.branchName[0] === brancharray[0]
              )
            }

            // If user has more than one branch, just check for any match
            return hasMatchingBranch
          })
      )
      // setLoading(false)
      setCallList(filtered)
    }
  }, [callscount, selectedCompanyBranch])
  // useEffect(() => {
  //   if (users && selectedCompanyBranch) {
  //     console.log("hh")
  //     setLoading(true)
  //     const userId = users._id
  //     socket.emit("updatedCalls", userId)
  //     const brancharray = [selectedCompanyBranch]
  //     // Debounce emits (wait 500ms)
  //     const timeoutId = setTimeout(() => {
  //       socketRef.current?.emit("updatedCalls", { userId, brancharray })
  //     }, 500)
  //     // Listen for initial data from the server
  //     // socket.on("updatedCalls", ({ mergedCalls }) => {
  //     //   const filtered = mergedCalls.filter(
  //     //     (call) =>
  //     //       Array.isArray(call?.callregistration) && // Check if callregistration is an array
  //     //       call.callregistration.some((registration) => {
  //     //         const hasMatchingBranch =
  //     //           Array.isArray(registration?.branchName) && // Check if branchName is an array
  //     //           registration.branchName.some(
  //     //             (branch) => brancharray.includes(branch) // Check if any branch matches user's branches
  //     //           )

  //     //         // If user has only one branch, ensure it matches exactly and no extra branches
  //     //         if (brancharray.length === 1) {
  //     //           return (
  //     //             hasMatchingBranch &&
  //     //             registration.branchName.length === 1 &&
  //     //             registration.branchName[0] === brancharray[0]
  //     //           )
  //     //         }

  //     //         // If user has more than one branch, just check for any match
  //     //         return hasMatchingBranch
  //     //       })
  //     //   )
  //     //   setLoading(false)
  //     //   setCallList(filtered)
  //     // })
  //     // Listen ONCE per effect
  //     const handleUpdatedCalls = ({ mergedCalls }) => {
  //       const filtered = mergedCalls.filter(
  //         (call) =>
  //           Array.isArray(call?.callregistration) &&
  //           call.callregistration.some((registration) => {
  //             const hasMatchingBranch =
  //               Array.isArray(registration?.branchName) &&
  //               registration.branchName.some((branch) =>
  //                 brancharray.includes(branch)
  //               )

  //             if (brancharray.length === 1) {
  //               return (
  //                 hasMatchingBranch &&
  //                 registration.branchName.length === 1 &&
  //                 registration.branchName[0] === brancharray[0]
  //               )
  //             }
  //             return hasMatchingBranch
  //           })
  //       )
  //       setLoading(false)
  //       setCallList(filtered)
  //     }
  //     socketRef.current?.on("updatedCalls", handleUpdatedCalls)

  //     // CLEANUP
  //     return () => {
  //       clearTimeout(timeoutId)
  //       socketRef.current?.off("updatedCalls", handleUpdatedCalls)
  //     }
  //   }
  // }, [users, branchids, selectedCompanyBranch])

  useEffect(() => {
    if (callList && callList.length > 0 && users) {
      const today = new Date().toISOString().split("T")[0]
      setToday(today)
      const stats = getCallStats(callList, users.name)

      setUserCallstatus(stats)

      setFilteredCalls(callList)

      filterCallData(callList)
      setLoading(false)
    }
  }, [callList])

  //   const handleSearch = debounce((search) => {
  //     if(!search||search.toString().trim()===''){
  //       setFilteredCalls(callList)
  //       return
  //     }
  //     setSearchTerm(search)
  //     const searchText = search.toString().toLowerCase().trim()
  // console.log(searchText)
  //     const filteredData = callList.filter((customer) => {
  //       // Check customerName
  //       if(customer.customerName
  //         ?.toLowerCase()
  //         .includes(searchText)){
  //           return true
  //         }
  //         console.log(searchText)
  //         console.log(customer.customerName)
  //       // Check mobile (if exists)
  //       if(customer.mobile?.toString().includes(searchText)){
  //         return true
  //       }

  //       // Check callregistration.incomingNumber or license
  //       if(customer.callregistration?.some((call) => {
  //         if(call.formdata?.incomingNumber
  //           ?.toString()
  //           .includes(searchText)){
  //             return true
  //           }

  //         if(call.branchName?.some((branch) =>
  //           branch.toLowerCase().includes(searchText)
  //         )){
  //           return true
  //         }

  //         if(call.license?.toString().includes(searchText)){
  //           return true
  //         }
  //         return false

  //         })){
  //           return true
  //         }

  //     })
  //     console.log(filteredData)

  //     setFilteredCalls(filteredData)
  //   }, 300)
  const handleSearch = debounce((search) => {
    if (!search || search.toString().trim() === "") {
      setFilteredCalls(callList) // Show all if empty search
      return
    }

    const searchText = search.toString().toLowerCase().trim()

    const filteredData = callList.filter((customer) => {
      // 1. Customer name match
      if (customer.customerName?.toLowerCase().includes(searchText)) {
        return true
      }

      // 2. Mobile match
      if (customer.mobile?.toString().includes(searchText)) {
        return true
      }

      // 3. Call registration match
      if (
        customer.callregistration?.some((call) => {
          // Incoming number
          if (call.formdata?.incomingNumber?.toString().includes(searchText)) {
            return true
          }

          // License
          if (call.license?.toString().includes(searchText)) {
            return true
          }

          // Branch names
          if (
            call.branchName?.some((branch) =>
              branch?.toLowerCase().includes(searchText)
            )
          ) {
            return true
          }

          return false
        })
      ) {
        return true
      }

      return false
    })

    setSearchTerm(search)
    setFilteredCalls(filteredData)
  }, 300)

  const handleChange = (e) => handleSearch(e.target.value)
  const setDateandTime = (dateString) => {
    const dateObj = new Date(dateString)

    const date = dateObj.toLocaleDateString("en-GB") // Format: DD/MM/YYYY
    const time = dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true // ✅ Enables 12-hour format with AM/PM
    })
    return `${date}`
    return `${date} ${time}` // Example: "03/02/2025 02:48:57 PM"
  }
  const getTodaysSolved = (calls) => {
    const today = new Date().toISOString().split("T")[0]
    console.log(today)
    let todaysSolvedCount = 0
    let arr = []

    calls.forEach((customer) => {
      customer.callregistration.forEach((call) => {
        if (call.formdata.status === "solved") {
          const callDate = call.timedata.endTime.split("T")[0]
          console.log(callDate)
          if (callDate === today) {
            todaysSolvedCount++
            arr.push(call.timedata.token)
          }
        }
      })
    })

    return { todaysSolvedCount, arr }
  }
  const getCallStats = (calls, userName) => {
    let totalCalls = 0
    let pendingCalls = 0
    let solvedCalls = 0
    let collegeSolvedCalls = 0
    let totalDuration = 0

    const today = new Date().toISOString().split("T")[0] // Get today's date in YYYY-MM-DD format

    calls.forEach((call) => {
      call.callregistration.forEach((registration) => {
        const { formdata, timedata } = registration
        const callDate = timedata?.endTime?.split("T")[0]
        if (callDate === today) {
          const lastAttended = formdata?.attendedBy?.length
            ? formdata?.attendedBy[formdata.attendedBy.length - 1]
            : null
          if (lastAttended?.callerId?.name === userName) {
            totalCalls++
            // Count all calls for today

            if (
              formdata.status === "pending" &&
              lastAttended?.callerId?.name === userName
            ) {
              pendingCalls++ // Pending call count
            }

            if (
              formdata.status === "solved" &&
              lastAttended?.callerId?.name === userName
            ) {
              if (
                formdata?.completedBy?.length &&
                formdata?.completedBy[formdata?.completedBy?.length - 1]
                  .name === userName
              ) {
                solvedCalls++ // Solved call count
              }

              if (
                formdata?.completedBy?.length &&
                lastAttended?.callerId?.name !==
                  formdata?.completedBy[formdata?.completedBy?.length - 1].name
              ) {
                collegeSolvedCalls++ // College solved call count
              }
            }

            if (
              lastAttended &&
              lastAttended.duration &&
              lastAttended?.callerId?.name === userName
            ) {
              totalDuration += lastAttended.duration // Sum total duration
            }
          }
        }
      })
    })

    return {
      totalCalls,
      pendingCalls,
      solvedCalls,
      collegeSolvedCalls,
      totalDuration
    }
  }

  const getTodaysCalls = (calls) => {
    const today = new Date().toISOString().split("T")[0] // Get today's date in 'YYYY-MM-DD' format

    let todaysCallsCount = 0

    calls.forEach((customer) => {
      customer.callregistration.forEach((call) => {
        const callDate = call?.timedata?.endTime?.split("T")[0] // Get the call date in 'YYYY-MM-DD' format
        if (callDate === today) {
          todaysCallsCount++
        }
      })
    })
    return todaysCallsCount
  }

  // Function to filter calls based on the active tile clicked
  const applyFilter = () => {
    if (activeFilter === "Pending") {
      return callList.filter((call) => call.status === "Pending")
    } else if (activeFilter === "Solved") {
      return callList.filter((call) => call.status === "Solved")
    } else if (activeFilter === "Today") {
      const todayDate = new Date().toISOString().slice(0, 10) // Format today's date as YYYY-MM-DD
      return callList.filter(
        (call) =>
          new Date(call.callDate).toISOString().slice(0, 10) === todayDate
      )
    }
    return callList // Return all if no specific filter is applied
  }

  const formatDuration = (seconds, name) => {
    if (!seconds || isNaN(seconds)) {
      return "0 hr 0 min 0 sec"
    }

    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs} hr ${mins} min ${secs} sec`
  }
  console.log(filteredCalls)
  return (
    // <div className="h-full bg-[#ADD8E6] overflow-hidden">
    //   <div className="flex h-full flex-row">
    //     <StaticSidebar
    //       handleMoreClick={handleMoreClick}
    //       selectedCompanyBranch={selectedcompanybranchId}
    //       setselectedCompanyBranch={setselectedcompanybranchId}
    //       parenttargetData={settargetData}
    //       parentperiodmode={setperiodMode}
    //       parentyear={setSelectedYear}
    //       setselectedPeriod={setselectedPeriod}
    //     />
    //     <div className="flex flex-1 flex-col overflow-hidden">
    //       <header className="flex items-center justify-between border-b border-white/10 bg-[#0F172A]/95">
    //         {users?.role?.toLowerCase() === "admin" ? (
    //           <AdminHeader hide={true} />
    //         ) : (
    //           <StaffHeader hide={true} />
    //         )}

    //         <div className="flex items-center gap-1.5  border-b border-white/10 bg-[#0F172A]/95 pr-3 h-full">
    //           <button className="rounded-full p-1.5 transition bg-slate-100">
    //             <Mail size={15} strokeWidth={2.2} />
    //           </button>
    //           <div className="relative">
    //             <button className="rounded-full p-1.5 transition bg-slate-100">
    //               <MessageSquareText size={15} strokeWidth={2.2} />
    //             </button>
    //             <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-500" />
    //           </div>
    //           <button className="rounded-full p-1.5 transition bg-slate-100">
    //             <Settings size={15} strokeWidth={2.2} />
    //           </button>
    //           {/* <button className="rounded-full p-1.5 transition bg-slate-100">
    //             <User size={15} strokeWidth={2.2} />
    //           </button> */}

    //           <div className="relative">
    //             <button
    //               onClick={(e) => {
    //                 e.stopPropagation()
    //                 setShowUserMenu((prev) => !prev)
    //               }}
    //               className="rounded-full p-1.5 transition bg-slate-100"
    //             >
    //               <User size={15} strokeWidth={2.2} />
    //             </button>

    //             {/* {showUserMenu && (
    //               <div
    //                 onClick={(e) => e.stopPropagation()}
    //                 className="absolute right-0 mt-2 w-32 bg-white border border-slate-200 rounded-md shadow-lg z-50"
    //               >
    //                 <button
    //                   onClick={handleLogout}
    //                   className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
    //                 >
    //                   Logout
    //                 </button>
    //               </div>
    //             )} */}
    //           </div>
    //         </div>
    //       </header>
    //       <div className=" mx-auto p-2  md:p-5 bg-blue-50 h-full">
    //         <div className="w-auto shadow-lg rounded p-4 pt-1 flex flex-col bg-neutral-50 ">
    //           <div className="mb-2 flex flex-col gap-4 px-4 lg:flex-row lg:items-start lg:justify-between lg:px-6 xl:px-8">
    //             {/* Left side */}
    //             <div className="flex w-full flex-col gap-3 lg:max-w-2xl">
    //               <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
    //                 <div className="relative flex-1">
    //                   <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
    //                   <input
    //                     type="text"
    //                     onChange={handleChange}
    //                     className="w-full rounded-full border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
    //                     placeholder="Search for..."
    //                   />
    //                 </div>

    //                 <button
    //                   type="button"
    //                   onClick={() =>
    //                     navigate(
    //                       `/${users.role.toLowerCase()}/transaction/call-registration`
    //                     )
    //                   }
    //                   className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700"
    //                 >
    //                   Call
    //                 </button>

    //                 <select
    //                   onChange={(e) => {
    //                     setLoading(true)
    //                     setFilteredCalls([])
    //                     setSelectedCompanyBranch(e.target.value)
    //                   }}
    //                   className="min-w-[140px] cursor-pointer rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    //                 >
    //                   {loggedUserBranches?.map((branch) => (
    //                     <option key={branch._id} value={branch.label}>
    //                       {branch.label}
    //                     </option>
    //                   ))}
    //                 </select>
    //               </div>
    //             </div>

    //             {/* Right side */}
    //             <div className="w-full lg:w-auto">
    //               <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
    //                 <table className="min-w-max text-center text-sm">
    //                   <tbody>
    //                     <tr className="border-b bg-gray-50">
    //                       <td className="px-3 py-2 font-bold text-[#010bff]">
    //                         Total Calls
    //                       </td>
    //                       <td className="px-3 py-2 font-bold text-purple-700">
    //                         Colleague Solved
    //                       </td>
    //                       <td className="px-3 py-2 font-bold text-red-600">
    //                         Pending Calls
    //                       </td>
    //                       <td className="px-3 py-2 font-bold text-green-600">
    //                         Solved Calls
    //                       </td>
    //                       <td className="px-3 py-2 font-bold text-gray-600">
    //                         Total Duration
    //                       </td>
    //                     </tr>
    //                     <tr>
    //                       <td className="px-3 py-2 text-[#010bff]">
    //                         {userCallStatus?.totalCalls}
    //                       </td>
    //                       <td className="px-3 py-2 text-purple-700">
    //                         {userCallStatus?.collegeSolvedCalls}
    //                       </td>
    //                       <td className="px-3 py-2 text-red-600">
    //                         {userCallStatus?.pendingCalls}
    //                       </td>
    //                       <td className="px-3 py-2 text-green-600">
    //                         {userCallStatus?.solvedCalls}
    //                       </td>
    //                       <td className="px-3 py-2 text-gray-600">
    //                         {formatDuration(userCallStatus?.totalDuration)}
    //                       </td>
    //                     </tr>
    //                   </tbody>
    //                 </table>
    //               </div>
    //             </div>
    //           </div>
    //           <hr className="border-t-2 border-gray-300 mb-2 " />

    //           <div className="flex justify-around">
    //             <Tiles
    //               title="Pending Calls"
    //               count={pendingCallsCount}
    //               style={{
    //                 background: `linear-gradient(135deg, rgba(255, 0, 0, 1), rgba(255, 128, 128, 1))` // Adjust gradient here
    //               }}
    //               onClick={() => {
    //                 setActiveFilter("Pending")
    //                 setFilteredCalls(applyFilter()) // Update filteredCalls when tile is clicked
    //               }}
    //             />

    //             <Tiles
    //               title="Solved Calls"
    //               color="bg-green-500"
    //               count={solvedCallsCount}
    //               style={{
    //                 background: `linear-gradient(135deg, rgba(0, 140, 0, 1), rgba(128, 255, 128,1 ))`
    //               }}
    //               onClick={() => {
    //                 setActiveFilter("Solved")
    //                 setFilteredCalls(applyFilter()) // Update filteredCalls when tile is clicked
    //               }}
    //             />
    //             <Tiles
    //               title="Today's Calls"
    //               color="bg-yellow-500"
    //               count={todayCallsCount}
    //               style={{
    //                 background: `linear-gradient(135deg, rgba(255, 255, 1, 1), rgba(255, 255, 128, 1))`
    //               }}
    //               onClick={() => {
    //                 setActiveFilter("Today")
    //                 setFilteredCalls(applyFilter()) // Update filteredCalls when tile is clicked
    //               }}
    //             />
    //             <Tiles
    //               title="Online Call"
    //               color="bg-blue-500"
    //               count={"0"}
    //               style={{
    //                 background: `linear-gradient(135deg, rgba(0, 0, 270, 0.8), rgba(128, 128, 255, 0.8))`
    //               }}
    //               onClick={() => {
    //                 setActiveFilter("Online")
    //                 setFilteredCalls(applyFilter()) // Update filteredCalls when tile is clicked
    //               }}
    //             />
    //           </div>
    //           <div className="overflow-y-auto overflow-x-auto max-h-96 sm:max-h-80 md:max-h-[380px] lg:max-h-[398px] shadow-md rounded-lg mt-2 ">
    //             <table className="divide-y divide-gray-200 w-full">
    //               <thead className="bg-purple-300 sticky top-0 z-40  ">
    //                 <tr>
    //                   <th className="px-2 py-3 border-b border-gray-300 text-sm text-center whitespace-nowrap">
    //                     Branch Name
    //                   </th>

    //                   <th className="px-2 py-3 border-b border-gray-300 text-sm text-center whitespace-nowrap">
    //                     Token No
    //                   </th>
    //                   <th className="px-2 py-3 border-b border-gray-300 text-sm text-center whitespace-nowrap">
    //                     Customer Name
    //                   </th>
    //                   <th className="px-2 py-3 border-b border-gray-300 text-sm text-center whitespace-nowrap">
    //                     Product Name
    //                   </th>
    //                   <th className="px-2 py-3 border-b border-gray-300 text-sm text-center whitespace-nowrap">
    //                     License No
    //                   </th>

    //                   <th className="px-10 py-3 border-b border-gray-300 text-sm text-center whitespace-nowrap">
    //                     Start <br />
    //                     (D-M-Y)
    //                   </th>
    //                   <th className="px-10 py-3 border-b border-gray-300 text-sm text-center whitespace-nowrap">
    //                     End <br />
    //                     (D-M-Y)
    //                   </th>
    //                   <th className="px-2 py-3 border-b border-gray-300 text-sm text-center whitespace-nowrap">
    //                     Incoming No
    //                   </th>
    //                   <th className="px-2 py-3 border-b border-gray-300 text-sm text-center whitespace-nowrap">
    //                     Status
    //                   </th>

    //                   <th className="px-2 py-3 border-b border-gray-300 text-sm text-center whitespace-nowrap">
    //                     Attended By
    //                   </th>
    //                   <th className="px-2 py-3 border-b border-gray-300 text-sm text-center whitespace-nowrap">
    //                     Completed By
    //                   </th>
    //                   <th className="px-2 py-3 border-b border-gray-300 text-sm text-center whitespace-nowrap">
    //                     Call
    //                   </th>
    //                 </tr>
    //               </thead>
    //               <tbody className="divide-gray-200">
    //                 {/* ///for pending calls/// */}
    //                 {filteredCalls?.length > 0 ? (
    //                   <>
    //                     {filteredCalls
    //                       .flatMap((calls) =>
    //                         calls.callregistration.map((item) => ({
    //                           ...item,
    //                           calls
    //                         }))
    //                       )
    //                       .filter(
    //                         (item) => item?.formdata?.status === "pending"
    //                       )
    //                       .sort((a, b) => {
    //                         const today = new Date().toISOString().split("T")[0]
    //                         // const aDate = new Date(a?.timedata?.endTime)
    //                         //   ?.toISOString()
    //                         //   .split("T")[0];
    //                         // const bDate = new Date(b?.timedata?.endTime)
    //                         //   ?.toISOString()
    //                         //   .split("T")[0];
    //                         // Safe date extraction with validation
    //                         const getDateString = (item) => {
    //                           if (!item?.timedata?.endTime) return null
    //                           const date = new Date(item.timedata.endTime)
    //                           return isNaN(date.getTime())
    //                             ? null
    //                             : date.toISOString().split("T")[0]
    //                         }

    //                         const aDate = getDateString(a)
    //                         const bDate = getDateString(b)

    //                         // Prioritize today's date
    //                         if (aDate === today && bDate !== today) return -1
    //                         if (aDate !== today && bDate === today) return 1

    //                         // For both calls not on today, order by descending date
    //                         return (
    //                           new Date(b?.timedata?.endTime) -
    //                           new Date(a?.timedata?.endTime)
    //                         )
    //                       })
    //                       .map((item) => {
    //                         const today = new Date().toISOString().split("T")[0]
    //                         const startTimeRaw = item?.timedata?.endTime
    //                         const callDate = startTimeRaw
    //                           ? new Date(startTimeRaw.split(" ")[0])
    //                               .toISOString()
    //                               .split("T")[0]
    //                           : null

    //                         if (
    //                           userBranch.some((branch) =>
    //                             item.branchName.includes(branch)
    //                           )
    //                         ) {
    //                           return (
    //                             <>
    //                               <tr
    //                                 key={item.calls?._id}
    //                                 className={`text-center border border-b-0  bg-gray-300 ${
    //                                   callDate === today
    //                                     ? "bg-[linear-gradient(135deg,_rgba(255,255,1,1),_rgba(255,255,128,1))]"
    //                                     : "bg-[linear-gradient(135deg,_rgba(255,0,0,1),_rgba(255,128,128,1))]"
    //                                 }`}
    //                               >
    //                                 <td className="px-2 py-2 w-12 text-sm text-[#010101]">
    //                                   {item.branchName}
    //                                 </td>

    //                                 <td className="px-2 py-2 text-sm w-12 text-[#010101]">
    //                                   {item?.timedata?.token || "abu"}
    //                                 </td>
    //                                 <td className="px-2 py-2 text-sm w-12 text-[#010101]">
    //                                   {item.calls?.customerName}
    //                                 </td>
    //                                 <td className="px-2 py-2 text-sm w-12 text-[#010101]">
    //                                   {
    //                                     item?.calls?.productDetails[0]
    //                                       ?.productName
    //                                   }
    //                                 </td>
    //                                 <td className="px-2 py-2 text-sm w-12 text-[#010101]">
    //                                   {item?.license}
    //                                 </td>
    //                                 <td className="px-2 py-2 text-sm w-12 text-[#010101]">
    //                                   {setDateandTime(
    //                                     item?.timedata?.startTime
    //                                   )}
    //                                 </td>
    //                                 <td className="px-2 py-2 text-sm w-12 text-[#010101]"></td>
    //                                 <td className="px-2 py-2 text-sm w-12 text-[#010101]">
    //                                   {item?.formdata?.incomingNumber}
    //                                 </td>
    //                                 <td className="px-2 py-2 text-sm w-12 text-[#010101]">
    //                                   {item?.formdata?.status}
    //                                 </td>
    //                                 <td className="px-2 py-2 text-sm w-12 text-[#010101]">
    //                                   {Array.isArray(item?.formdata?.attendedBy)
    //                                     ? item.formdata.attendedBy.length > 0
    //                                       ? item.formdata.attendedBy[
    //                                           item.formdata.attendedBy.length -
    //                                             1
    //                                         ]?.callerId?.name ||
    //                                         item.formdata.attendedBy[
    //                                           item.formdata.attendedBy.length -
    //                                             1
    //                                         ]?.name ||
    //                                         item.formdata.attendedBy[
    //                                           item.formdata.attendedBy.length -
    //                                             1
    //                                         ]
    //                                       : null
    //                                     : item?.formdata?.attendedBy?.callerId
    //                                         ?.name}
    //                                 </td>
    //                                 <td className="px-2 py-2 text-sm w-12 text-[#010101]"></td>
    //                                 <td className="px-2 py-2 text-xl w-12 text-blue-800">
    //                                   {item?.formdata?.status !== "solved" ? (
    //                                     <FaPhone
    //                                       onClick={() =>
    //                                         users.role === "Admin"
    //                                           ? navigate(
    //                                               "/admin/transaction/call-registration",
    //                                               {
    //                                                 state: {
    //                                                   calldetails:
    //                                                     item.calls._id,
    //                                                   token: item.timedata.token
    //                                                 }
    //                                               }
    //                                             )
    //                                           : navigate(
    //                                               "/staff/transaction/call-registration",
    //                                               {
    //                                                 state: {
    //                                                   calldetails:
    //                                                     item?.calls._id,
    //                                                   token:
    //                                                     item?.timedata?.token
    //                                                 }
    //                                               }
    //                                             )
    //                                       }
    //                                     />
    //                                   ) : (
    //                                     ""
    //                                   )}
    //                                 </td>
    //                               </tr>
    //                               <tr
    //                                 className={`text-center border-t-0 border-gray-300 ${
    //                                   item?.formdata?.status === "solved"
    //                                     ? "bg-[linear-gradient(135deg,_rgba(0,140,0,1),_rgba(128,255,128,1))]"
    //                                     : item?.formdata?.status === "pending"
    //                                       ? callDate === today
    //                                         ? "bg-[linear-gradient(135deg,_rgba(255,255,1,1),_rgba(255,255,128,1))]"
    //                                         : "bg-[linear-gradient(135deg,_rgba(255,0,0,1),_rgba(255,128,128,1))]"
    //                                       : "bg-[linear-gradient(135deg,_rgba(255,0,0,1),_rgba(255,128,128,1))]"
    //                                 }`}
    //                                 style={{ height: "5px" }}
    //                               >
    //                                 <td
    //                                   colSpan="4"
    //                                   className="py-1 px-8 text-sm text-black text-left"
    //                                 >
    //                                   <strong>Description:</strong>{" "}
    //                                   {item?.formdata?.description || "N/A"}
    //                                 </td>

    //                                 <td
    //                                   colSpan="3"
    //                                   className="py-1 px-8 text-sm text-black text-left"
    //                                 >
    //                                   <strong>Duration:</strong>{" "}
    //                                   <span className="ml-2">
    //                                     {`${Math.floor(
    //                                       (new Date(
    //                                         item?.formdata?.status === "solved"
    //                                           ? item.timedata?.endTime // Use end date if the call is solved
    //                                           : new Date().setHours(0, 0, 0, 0) // Use today's date at midnight if not solved
    //                                       ) -
    //                                         new Date(
    //                                           new Date(
    //                                             item.timedata?.startTime
    //                                           ).setHours(0, 0, 0, 0)
    //                                         )) /
    //                                         (1000 * 60 * 60 * 24)
    //                                     )} days`}
    //                                   </span>
    //                                   <span className="ml-1">
    //                                     {formatDuration(
    //                                       item?.timedata?.duration,
    //                                       item.calls?.customerName
    //                                     ) || "N/A"}
    //                                   </span>
    //                                 </td>
    //                                 <td
    //                                   colSpan="5"
    //                                   className="py-1 px-12 text-sm text-black text-right"
    //                                 >
    //                                   <strong>Solution:</strong>{" "}
    //                                   {item?.formdata?.solution || "N/A"}
    //                                 </td>
    //                               </tr>
    //                             </>
    //                           )
    //                         }
    //                       })}

    //                     {filteredCalls
    //                       .flatMap((calls) =>
    //                         calls.callregistration.map((item) => ({
    //                           ...item,
    //                           calls
    //                         }))
    //                       )
    //                       .filter((item) => {
    //                         // Ensure 'status' is 'solved'
    //                         const isSolved = item?.formdata?.status === "solved"

    //                         // Check if 'startTime' date matches today's date
    //                         const startTimeRaw = item?.timedata?.endTime
    //                         const callDate = startTimeRaw
    //                           ? new Date(startTimeRaw.split(" ")[0])
    //                               .toISOString()
    //                               .split("T")[0]
    //                           : null

    //                         console.log(callDate)

    //                         const isToday = callDate === today
    //                         if (isSolved && isToday) {
    //                           console.log(item.timedata.token)
    //                         }
    //                         return isSolved && isToday // Filter condition for both 'solved' and 'today'
    //                       })

    //                       .sort((a, b) => {
    //                         const endTimeA = new Date(
    //                           a?.timedata?.endTime
    //                         ).getTime()
    //                         const endTimeB = new Date(
    //                           b?.timedata?.endTime
    //                         ).getTime()
    //                         const startTimeA = new Date(
    //                           a?.timedata?.startTime
    //                         ).getTime()
    //                         const startTimeB = new Date(
    //                           b?.timedata?.startTime
    //                         ).getTime()

    //                         return (
    //                           endTimeB - endTimeA || startTimeB - startTimeA
    //                         )
    //                       })
    //                       .map((item) => {
    //                         if (
    //                           userBranch.some((branch) =>
    //                             item.branchName.includes(branch)
    //                           )
    //                         ) {
    //                           console.log(item)
    //                           return (
    //                             <>
    //                               <tr
    //                                 key={item.calls?._id}
    //                                 className="text-center border border-b-0 border-gray-300 bg-[linear-gradient(135deg,_rgba(0,140,0,1),_rgba(128,255,128,1))]"
    //                               >
    //                                 <td className="px-2 py-2 text-sm w-12 text-[#010101]">
    //                                   {item.branchName}
    //                                 </td>

    //                                 <td className="px-2 py-2 text-sm w-12 text-[#010101]">
    //                                   {item?.timedata.token}
    //                                 </td>
    //                                 <td className="px-2 py-2 text-sm w-12 text-[#010101]">
    //                                   {item.calls?.customerName}
    //                                 </td>
    //                                 <td className="px-2 py-2 text-sm w-12 text-[#010101]">
    //                                   {
    //                                     item?.calls?.productDetails[0]
    //                                       ?.productName
    //                                   }
    //                                 </td>
    //                                 <td className="px-2 py-2 text-sm w-12 text-[#010101]">
    //                                   {item?.license}
    //                                 </td>

    //                                 <td className="px-2 py-2 text-sm w-12 text-[#010101]">
    //                                   {setDateandTime(
    //                                     item?.timedata?.startTime
    //                                   )}
    //                                 </td>

    //                                 <td className="px-2 py-2 text-sm w-12 text-[#010101]">
    //                                   {setDateandTime(item?.timedata?.endTime)}
    //                                 </td>
    //                                 <td className="px-2 py-2 text-sm w-12 text-[#010101]">
    //                                   {item?.formdata?.incomingNumber}
    //                                 </td>
    //                                 <td className="px-2 py-2 text-sm w-12 text-[#010101]">
    //                                   {item?.formdata?.status}
    //                                 </td>
    //                                 <td className="px-2 py-2 text-sm w-12 text-[#010101]">
    //                                   {Array.isArray(item?.formdata?.attendedBy)
    //                                     ? item.formdata.attendedBy.length > 0
    //                                       ? item.formdata.attendedBy[
    //                                           item.formdata.attendedBy.length -
    //                                             1
    //                                         ]?.callerId?.name ||
    //                                         item.formdata.attendedBy[
    //                                           item.formdata.attendedBy.length -
    //                                             1
    //                                         ]?.name ||
    //                                         item.formdata.attendedBy[
    //                                           item.formdata.attendedBy.length -
    //                                             1
    //                                         ]
    //                                       : null
    //                                     : item?.formdata?.attendedBy?.callerId
    //                                         ?.name}
    //                                 </td>
    //                                 <td className="px-2 py-2 text-sm w-12 text-[#010101]">
    //                                   {Array.isArray(
    //                                     item?.formdata?.completedBy
    //                                   )
    //                                     ? item.formdata.completedBy.length > 0
    //                                       ? item.formdata.completedBy[
    //                                           item.formdata.completedBy.length -
    //                                             1
    //                                         ]?.callerId?.name ||
    //                                         item.formdata.completedBy[
    //                                           item.formdata.completedBy.length -
    //                                             1
    //                                         ]?.name
    //                                       : null
    //                                     : item?.formdata?.completedBy?.callerId
    //                                         ?.name ||
    //                                       item?.formdata?.completedBy?.name}
    //                                 </td>
    //                                 <td className="px-2 py-2 text-xl w-12 text-blue-800"></td>
    //                               </tr>
    //                               <tr
    //                                 className={`text-center border-t-0 border-gray-300 ${
    //                                   item?.formdata?.status === "solved"
    //                                     ? "bg-[linear-gradient(135deg,_rgba(0,140,0,1),_rgba(128,255,128,1))]"
    //                                     : item?.formdata?.status === "pending"
    //                                       ? new Date(
    //                                           item?.timedata?.endTime.split(
    //                                             ""
    //                                           )[0]
    //                                         )
    //                                           .toString()
    //                                           .split("T")[0] === today
    //                                         ? "bg-[linear-gradient(135deg,_rgba(255,255,1,1),_rgba(255,255,128,1))]"
    //                                         : "bg-[linear-gradient(135deg,_rgba(255,0,0,1),_rgba(255,128,128,1))]"
    //                                       : "bg-[linear-gradient(135deg,_rgba(255,0,0,1),_rgba(255,128,128,1))]"
    //                                 }`}
    //                                 style={{ height: "5px" }}
    //                               >
    //                                 <td
    //                                   colSpan="4"
    //                                   className="py-1 px-8 text-sm text-black text-left"
    //                                 >
    //                                   <strong>Description:</strong>{" "}
    //                                   {item?.formdata?.description || "N/A"}
    //                                 </td>
    //                                 <td
    //                                   colSpan="3"
    //                                   className="py-1 px-8 text-sm text-black text-left"
    //                                 >
    //                                   <strong>Duration:</strong>
    //                                   <span className="ml-2">
    //                                     {`${Math.floor(
    //                                       (new Date(
    //                                         item?.formdata?.status === "solved"
    //                                           ? item.timedata?.endTime // Use end date if the call is solved
    //                                           : new Date().setHours(0, 0, 0, 0) // Use today's date at midnight if not solved
    //                                       ) -
    //                                         new Date(
    //                                           new Date(
    //                                             item.timedata?.startTime
    //                                           ).setHours(0, 0, 0, 0)
    //                                         )) /
    //                                         (1000 * 60 * 60 * 24)
    //                                     )} days`}
    //                                   </span>

    //                                   <span className="ml-1">
    //                                     {formatDuration(
    //                                       item?.timedata?.duration
    //                                     ) || "N/A"}
    //                                   </span>
    //                                 </td>
    //                                 <td
    //                                   colSpan="5"
    //                                   className="py-1 px-12 text-sm text-black text-right"
    //                                 >
    //                                   <strong>Solution:</strong>{" "}
    //                                   {item?.formdata?.solution || "N/A"}
    //                                 </td>
    //                               </tr>
    //                             </>
    //                           )
    //                         }
    //                       })}
    //                   </>
    //                 ) : (
    //                   <tr>
    //                     <td
    //                       colSpan="12"
    //                       className="px-4 py-4 text-center text-sm text-gray-500"
    //                     >
    //                       {loadingcounts ? (
    //                         <div className="justify center">
    //                           <PropagateLoader color="#3b82f6" size={10} />
    //                         </div>
    //                       ) : (
    //                         <div>No Calls</div>
    //                       )}
    //                     </td>
    //                   </tr>
    //                 )}
    //               </tbody>
    //             </table>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    // <div className="h-screen overflow-hidden bg-[#ADD8E6]">
    //   <div className="flex h-full w-full overflow-hidden">
    //     <StaticSidebar
    //       handleMoreClick={handleMoreClick}
    //       selectedCompanyBranch={selectedcompanybranchId}
    //       setselectedCompanyBranch={setselectedcompanybranchId}
    //       parenttargetData={settargetData}
    //       parentperiodmode={setperiodMode}
    //       parentyear={setSelectedYear}
    //       setselectedPeriod={setselectedPeriod}
    //     />

    //     <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
    //       <header className="flex shrink-0 items-center justify-between border-b border-white/10 bg-[#0F172A]/95">
    //         {users?.role?.toLowerCase() === "admin" ? (
    //           <AdminHeader hide={true} />
    //         ) : (
    //           <StaffHeader hide={true} />
    //         )}

    //         <div className="flex h-full items-center gap-1.5 border-b border-white/10 bg-[#0F172A]/95 pr-3">
    //           <button className="rounded-full bg-slate-100 p-1.5 transition">
    //             <Mail size={15} strokeWidth={2.2} />
    //           </button>

    //           <div className="relative">
    //             <button className="rounded-full bg-slate-100 p-1.5 transition">
    //               <MessageSquareText size={15} strokeWidth={2.2} />
    //             </button>
    //             <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-500" />
    //           </div>

    //           <button className="rounded-full bg-slate-100 p-1.5 transition">
    //             <Settings size={15} strokeWidth={2.2} />
    //           </button>

    //           <div className="relative">
    //             <button
    //               onClick={(e) => {
    //                 e.stopPropagation()
    //                 setShowUserMenu((prev) => !prev)
    //               }}
    //               className="rounded-full bg-slate-100 p-1.5 transition"
    //             >
    //               <User size={15} strokeWidth={2.2} />
    //             </button>
    //           </div>
    //         </div>
    //       </header>

    //       <div className="flex min-h-0 flex-1 flex-col overflow-hidden  p-2 md:p-5">
    //         <div className="flex min-h-0 flex-1 flex-col rounded-xl bg-neutral-50 p-4 pt-1 shadow-lg">
    //           <div className="mb-2 flex shrink-0 flex-col gap-4 px-2 lg:flex-row lg:items-start lg:justify-between lg:px-4 xl:px-6">
    //             <div className="flex w-full flex-col gap-3 lg:max-w-2xl">
    //               <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
    //                 <div className="relative flex-1">
    //                   <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
    //                   <input
    //                     type="text"
    //                     onChange={handleChange}
    //                     className="w-full rounded-full border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
    //                     placeholder="Search for..."
    //                   />
    //                 </div>

    //                 <button
    //                   type="button"
    //                   onClick={() =>
    //                     navigate(
    //                       `/${users.role.toLowerCase()}/transaction/call-registration`
    //                     )
    //                   }
    //                   className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700"
    //                 >
    //                   Call
    //                 </button>

    //                 <select
    //                   onChange={(e) => {
    //                     setLoading(true)
    //                     setFilteredCalls([])
    //                     setSelectedCompanyBranch(e.target.value)
    //                   }}
    //                   className="min-w-[140px] cursor-pointer rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    //                 >
    //                   {loggedUserBranches?.map((branch) => (
    //                     <option key={branch._id} value={branch.label}>
    //                       {branch.label}
    //                     </option>
    //                   ))}
    //                 </select>
    //               </div>
    //             </div>

    //             <div className="w-full lg:w-auto">
    //               <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
    //                 <table className="min-w-max text-center text-sm">
    //                   <tbody>
    //                     <tr className="border-b bg-gray-50">
    //                       <td className="px-3 py-2 font-bold text-[#010bff]">
    //                         Total Calls
    //                       </td>
    //                       <td className="px-3 py-2 font-bold text-purple-700">
    //                         Colleague Solved
    //                       </td>
    //                       <td className="px-3 py-2 font-bold text-red-600">
    //                         Pending Calls
    //                       </td>
    //                       <td className="px-3 py-2 font-bold text-green-600">
    //                         Solved Calls
    //                       </td>
    //                       <td className="px-3 py-2 font-bold text-gray-600">
    //                         Total Duration
    //                       </td>
    //                     </tr>
    //                     <tr>
    //                       <td className="px-3 py-2 text-[#010bff]">
    //                         {userCallStatus?.totalCalls}
    //                       </td>
    //                       <td className="px-3 py-2 text-purple-700">
    //                         {userCallStatus?.collegeSolvedCalls}
    //                       </td>
    //                       <td className="px-3 py-2 text-red-600">
    //                         {userCallStatus?.pendingCalls}
    //                       </td>
    //                       <td className="px-3 py-2 text-green-600">
    //                         {userCallStatus?.solvedCalls}
    //                       </td>
    //                       <td className="px-3 py-2 text-gray-600">
    //                         {formatDuration(userCallStatus?.totalDuration)}
    //                       </td>
    //                     </tr>
    //                   </tbody>
    //                 </table>
    //               </div>
    //             </div>
    //           </div>

    //           <hr className="mb-2 shrink-0 border-t-2 border-gray-300" />

    //           <div className="mb-3 flex shrink-0 flex-wrap justify-around gap-3">
    //             <Tiles
    //               title="Pending Calls"
    //               count={pendingCallsCount}
    //               style={{
    //                 background:
    //                   "linear-gradient(135deg, rgba(255, 0, 0, 1), rgba(255, 128, 128, 1))"
    //               }}
    //               onClick={() => {
    //                 setActiveFilter("Pending")
    //                 setFilteredCalls(applyFilter())
    //               }}
    //             />

    //             <Tiles
    //               title="Solved Calls"
    //               color="bg-green-500"
    //               count={solvedCallsCount}
    //               style={{
    //                 background:
    //                   "linear-gradient(135deg, rgba(0, 140, 0, 1), rgba(128, 255, 128,1 ))"
    //               }}
    //               onClick={() => {
    //                 setActiveFilter("Solved")
    //                 setFilteredCalls(applyFilter())
    //               }}
    //             />

    //             <Tiles
    //               title="Today's Calls"
    //               color="bg-yellow-500"
    //               count={todayCallsCount}
    //               style={{
    //                 background:
    //                   "linear-gradient(135deg, rgba(255, 255, 1, 1), rgba(255, 255, 128, 1))"
    //               }}
    //               onClick={() => {
    //                 setActiveFilter("Today")
    //                 setFilteredCalls(applyFilter())
    //               }}
    //             />

    //             <Tiles
    //               title="Online Call"
    //               color="bg-blue-500"
    //               count={"0"}
    //               style={{
    //                 background:
    //                   "linear-gradient(135deg, rgba(0, 0, 270, 0.8), rgba(128, 128, 255, 0.8))"
    //               }}
    //               onClick={() => {
    //                 setActiveFilter("Online")
    //                 setFilteredCalls(applyFilter())
    //               }}
    //             />
    //           </div>

    //           <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-slate-300 bg-slate-50 shadow-[0_8px_24px_rgba(15,23,42,0.10)]">
    //             <div className="h-full overflow-y-auto">
    //               <table className="w-full table-fixed border-separate border-spacing-0 text-[11px] text-slate-700 md:text-xs">
    //                 <thead className="sticky top-0 z-40 bg-slate-200">
    //                   <tr className="bg-gradient-to-r from-slate-300 via-slate-200 to-slate-100 shadow-[inset_0_-1px_0_rgba(100,116,139,0.35)]">
    //                     <th className="w-[5%] border-b border-slate-300 px-2 py-2 text-center font-bold text-slate-700"></th>
    //                     <th className="w-[11%] border-b border-slate-300 px-2 py-2 text-left font-bold text-slate-700">
    //                       Branch
    //                     </th>
    //                     <th className="w-[20%] border-b border-slate-300 px-2 py-2 text-left font-bold text-slate-700">
    //                       Customer Name
    //                     </th>
    //                     <th className="w-[21%] border-b border-slate-300 px-2 py-2 text-left font-bold text-slate-700">
    //                       Product Name
    //                     </th>
    //                     <th className="w-[11%] border-b border-slate-300 px-2 py-2 text-left font-bold text-slate-700">
    //                       License No
    //                     </th>
    //                     <th className="w-[13%] border-b border-slate-300 px-2 py-2 text-left font-bold text-slate-700">
    //                       Call Date
    //                     </th>
    //                     <th className="w-[9%] border-b border-slate-300 px-2 py-2 text-center font-bold text-slate-700">
    //                       Call
    //                     </th>
    //                   </tr>
    //                 </thead>

    //                 <tbody>
    //                   {filteredCalls?.length > 0 ? (
    //                     <>
    //                       {filteredCalls
    //                         .flatMap((calls) =>
    //                           calls.callregistration.map((item) => ({
    //                             ...item,
    //                             calls
    //                           }))
    //                         )
    //                         .filter(
    //                           (item) => item?.formdata?.status === "pending"
    //                         )
    //                         .sort((a, b) => {
    //                           const today = new Date()
    //                             .toISOString()
    //                             .split("T")[0]

    //                           const getDateString = (entry) => {
    //                             if (!entry?.timedata?.endTime) return null
    //                             const date = new Date(entry.timedata.endTime)
    //                             return isNaN(date.getTime())
    //                               ? null
    //                               : date.toISOString().split("T")[0]
    //                           }

    //                           const aDate = getDateString(a)
    //                           const bDate = getDateString(b)

    //                           if (aDate === today && bDate !== today) return -1
    //                           if (aDate !== today && bDate === today) return 1

    //                           return (
    //                             new Date(b?.timedata?.endTime) -
    //                             new Date(a?.timedata?.endTime)
    //                           )
    //                         })
    //                         .map((item, index) => {
    //                           const today = new Date()
    //                             .toISOString()
    //                             .split("T")[0]
    //                           const startTimeRaw = item?.timedata?.endTime
    //                           const callDate = startTimeRaw
    //                             ? new Date(startTimeRaw.split(" ")[0])
    //                                 .toISOString()
    //                                 .split("T")[0]
    //                             : null

    //                           if (
    //                             userBranch.some((branch) =>
    //                               item.branchName.includes(branch)
    //                             )
    //                           ) {
    //                             const isTodayPending = callDate === today
    //                             const rowKey = `${item.calls?._id}-${item?.timedata?.token}-${index}`
    //                             const isExpanded = expandedRows?.[rowKey]

    //                             return (
    //                               <React.Fragment key={rowKey}>
    //                                 <tr
    //                                   className={`transition-all duration-150 ${
    //                                     isTodayPending
    //                                       ? "bg-gradient-to-r from-amber-300 via-orange-200 to-yellow-100 hover:from-amber-400 hover:via-orange-300 hover:to-yellow-200"
    //                                       : "bg-gradient-to-r from-rose-300 via-red-200 to-pink-100 hover:from-rose-400 hover:via-red-300 hover:to-pink-200"
    //                                   }`}
    //                                 >
    //                                   <td className="border-b border-slate-300 px-1 py-1 text-center align-middle">
    //                                     <button
    //                                       type="button"
    //                                       onClick={() =>
    //                                         setExpandedRows((prev) => ({
    //                                           ...prev,
    //                                           [rowKey]: !prev?.[rowKey]
    //                                         }))
    //                                       }
    //                                       className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-400 bg-white/90 text-[9px] font-bold text-slate-700 shadow-sm transition hover:bg-white"
    //                                     >
    //                                       <span
    //                                         className={`transition-transform duration-200 ${
    //                                           isExpanded ? "rotate-180" : ""
    //                                         }`}
    //                                       >
    //                                         ▼
    //                                       </span>
    //                                     </button>
    //                                   </td>

    //                                   <td className="truncate border-b border-slate-300 px-2 py-1 align-top font-semibold text-slate-900">
    //                                     {item.branchName}
    //                                   </td>

    //                                   <td className="break-words border-b border-slate-300 px-2 py-1 align-top text-slate-900">
    //                                     {item.calls?.customerName || "N/A"}
    //                                   </td>

    //                                   <td className="break-words border-b border-slate-300 px-2 py-1 align-top text-slate-900">
    //                                     {item?.calls?.productDetails?.[0]
    //                                       ?.productName || "N/A"}
    //                                   </td>

    //                                   <td className="truncate border-b border-slate-300 px-2 py-1 align-top text-slate-800">
    //                                     {item?.license || "N/A"}
    //                                   </td>

    //                                   <td className="truncate border-b border-slate-300 px-2 py-1 align-top text-slate-800">
    //                                     {setDateandTime(
    //                                       item?.timedata?.startTime
    //                                     )}
    //                                   </td>

    //                                   <td className="border-b border-slate-300 px-2 py-1 text-center align-middle">
    //                                     {item?.formdata?.status !== "solved" ? (
    //                                       <button
    //                                         type="button"
    //                                         className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-blue-600 to-indigo-700 text-white shadow-[0_4px_12px_rgba(37,99,235,0.35)] transition hover:scale-105 hover:from-blue-700 hover:to-indigo-800 active:scale-95"
    //                                         onClick={() =>
    //                                           users.role === "Admin"
    //                                             ? navigate(
    //                                                 "/admin/transaction/call-registration",
    //                                                 {
    //                                                   state: {
    //                                                     calldetails:
    //                                                       item.calls._id,
    //                                                     token:
    //                                                       item.timedata.token
    //                                                   }
    //                                                 }
    //                                               )
    //                                             : navigate(
    //                                                 "/staff/transaction/call-registration",
    //                                                 {
    //                                                   state: {
    //                                                     calldetails:
    //                                                       item?.calls._id,
    //                                                     token:
    //                                                       item?.timedata?.token
    //                                                   }
    //                                                 }
    //                                               )
    //                                         }
    //                                       >
    //                                         <FaPhone className="text-[11px]" />
    //                                       </button>
    //                                     ) : null}
    //                                   </td>
    //                                 </tr>

    //                                 {isExpanded && (
    //                                   <>
    //                                     <tr className="bg-slate-100">
    //                                       <td className="border-b border-slate-300 px-1 py-0.5"></td>

    //                                       <td
    //                                         colSpan="2"
    //                                         className="border-b border-slate-300 px-2 py-1 align-top"
    //                                       >
    //                                         <div className="text-[9px] font-bold uppercase tracking-wide text-slate-600">
    //                                           Status
    //                                         </div>
    //                                         <span
    //                                           className={`mt-0.5 inline-flex rounded-full px-2 py-[2px] text-[9px] font-bold uppercase tracking-wide leading-none shadow-sm ${
    //                                             isTodayPending
    //                                               ? "bg-orange-600 text-white"
    //                                               : "bg-rose-600 text-white"
    //                                           }`}
    //                                         >
    //                                           {item?.formdata?.status || "N/A"}
    //                                         </span>
    //                                       </td>

    //                                       <td className="border-b border-slate-300 px-2 py-1 align-top">
    //                                         <div className="text-[9px] font-bold uppercase tracking-wide text-slate-600">
    //                                           Incoming No
    //                                         </div>
    //                                         <div className="mt-0.5 text-[10px] leading-tight text-slate-900">
    //                                           {item?.formdata?.incomingNumber ||
    //                                             "N/A"}
    //                                         </div>
    //                                       </td>

    //                                       <td
    //                                         colSpan="2"
    //                                         className="border-b border-slate-300 px-2 py-1 align-top"
    //                                       >
    //                                         <div className="text-[9px] font-bold uppercase tracking-wide text-slate-600">
    //                                           Attended By
    //                                         </div>
    //                                         <div className="mt-0.5 text-[10px] leading-tight text-slate-900">
    //                                           {Array.isArray(
    //                                             item?.formdata?.attendedBy
    //                                           )
    //                                             ? item.formdata.attendedBy
    //                                                 .length > 0
    //                                               ? item.formdata.attendedBy[
    //                                                   item.formdata.attendedBy
    //                                                     .length - 1
    //                                                 ]?.callerId?.name ||
    //                                                 item.formdata.attendedBy[
    //                                                   item.formdata.attendedBy
    //                                                     .length - 1
    //                                                 ]?.name ||
    //                                                 item.formdata.attendedBy[
    //                                                   item.formdata.attendedBy
    //                                                     .length - 1
    //                                                 ]
    //                                               : "N/A"
    //                                             : item?.formdata?.attendedBy
    //                                                 ?.callerId?.name || "N/A"}
    //                                         </div>
    //                                       </td>

    //                                       <td className="border-b border-slate-300 px-2 py-1 align-top">
    //                                         <div className="text-[9px] font-bold uppercase tracking-wide text-slate-600">
    //                                           Completed By
    //                                         </div>
    //                                         <div className="mt-0.5 text-[10px] leading-tight text-slate-900">
    //                                           N/A
    //                                         </div>
    //                                       </td>
    //                                     </tr>

    //                                     <tr className="bg-slate-200/70">
    //                                       <td className="border-b border-slate-300 px-1 py-0.5"></td>

    //                                       <td
    //                                         colSpan="3"
    //                                         className="border-b border-slate-300 px-2 py-1 align-top"
    //                                       >
    //                                         <div className="text-[9px] font-bold uppercase tracking-wide text-slate-600">
    //                                           Description
    //                                         </div>
    //                                         <div className="mt-0.5 text-[10px] leading-tight text-slate-900">
    //                                           {item?.formdata?.description ||
    //                                             "N/A"}
    //                                         </div>
    //                                       </td>

    //                                       <td
    //                                         colSpan="3"
    //                                         className="border-b border-slate-300 px-2 py-1 align-top"
    //                                       >
    //                                         <div className="text-[9px] font-bold uppercase tracking-wide text-slate-600">
    //                                           Solution
    //                                         </div>
    //                                         <div className="mt-0.5 text-[10px] leading-tight text-slate-900">
    //                                           {item?.formdata?.solution ||
    //                                             "N/A"}
    //                                         </div>
    //                                       </td>
    //                                     </tr>
    //                                   </>
    //                                 )}
    //                               </React.Fragment>
    //                             )
    //                           }

    //                           return null
    //                         })}

    //                       {filteredCalls
    //                         .flatMap((calls) =>
    //                           calls.callregistration.map((item) => ({
    //                             ...item,
    //                             calls
    //                           }))
    //                         )
    //                         .filter((item) => {
    //                           const today = new Date()
    //                             .toISOString()
    //                             .split("T")[0]
    //                           const isSolved =
    //                             item?.formdata?.status === "solved"
    //                           const startTimeRaw = item?.timedata?.endTime
    //                           const callDate = startTimeRaw
    //                             ? new Date(startTimeRaw.split(" ")[0])
    //                                 .toISOString()
    //                                 .split("T")[0]
    //                             : null
    //                           const isToday = callDate === today
    //                           return isSolved && isToday
    //                         })
    //                         .sort((a, b) => {
    //                           const endTimeA = new Date(
    //                             a?.timedata?.endTime
    //                           ).getTime()
    //                           const endTimeB = new Date(
    //                             b?.timedata?.endTime
    //                           ).getTime()
    //                           const startTimeA = new Date(
    //                             a?.timedata?.startTime
    //                           ).getTime()
    //                           const startTimeB = new Date(
    //                             b?.timedata?.startTime
    //                           ).getTime()

    //                           return (
    //                             endTimeB - endTimeA || startTimeB - startTimeA
    //                           )
    //                         })
    //                         .map((item, index) => {
    //                           if (
    //                             userBranch.some((branch) =>
    //                               item.branchName.includes(branch)
    //                             )
    //                           ) {
    //                             const rowKey = `${item.calls?._id}-solved-${item?.timedata?.token}-${index}`
    //                             const isExpanded = expandedRows?.[rowKey]

    //                             return (
    //                               <React.Fragment key={rowKey}>
    //                                 <tr className="bg-gradient-to-r from-emerald-300 via-green-200 to-teal-100 transition-all duration-150 hover:from-emerald-400 hover:via-green-300 hover:to-teal-200">
    //                                   <td className="border-b border-slate-300 px-1 py-1 text-center align-middle">
    //                                     <button
    //                                       type="button"
    //                                       onClick={() =>
    //                                         setExpandedRows((prev) => ({
    //                                           ...prev,
    //                                           [rowKey]: !prev?.[rowKey]
    //                                         }))
    //                                       }
    //                                       className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-400 bg-white/90 text-[9px] font-bold text-slate-700 shadow-sm transition hover:bg-white"
    //                                     >
    //                                       <span
    //                                         className={`transition-transform duration-200 ${
    //                                           isExpanded ? "rotate-180" : ""
    //                                         }`}
    //                                       >
    //                                         ▼
    //                                       </span>
    //                                     </button>
    //                                   </td>

    //                                   <td className="truncate border-b border-slate-300 px-2 py-1 align-top font-semibold text-slate-900">
    //                                     {item.branchName}
    //                                   </td>

    //                                   <td className="break-words border-b border-slate-300 px-2 py-1 align-top text-slate-900">
    //                                     {item.calls?.customerName || "N/A"}
    //                                   </td>

    //                                   <td className="break-words border-b border-slate-300 px-2 py-1 align-top text-slate-900">
    //                                     {item?.calls?.productDetails?.[0]
    //                                       ?.productName || "N/A"}
    //                                   </td>

    //                                   <td className="truncate border-b border-slate-300 px-2 py-1 align-top text-slate-800">
    //                                     {item?.license || "N/A"}
    //                                   </td>

    //                                   <td className="truncate border-b border-slate-300 px-2 py-1 align-top text-slate-800">
    //                                     {setDateandTime(
    //                                       item?.timedata?.startTime
    //                                     )}
    //                                   </td>

    //                                   <td className="border-b border-slate-300 px-2 py-1 text-center align-middle"></td>
    //                                 </tr>

    //                                 {isExpanded && (
    //                                   <>
    //                                     <tr className="bg-emerald-100/80">
    //                                       <td className="border-b border-slate-300 px-1 py-0.5"></td>

    //                                       <td
    //                                         colSpan="2"
    //                                         className="border-b border-slate-300 px-2 py-1 align-top"
    //                                       >
    //                                         <div className="text-[9px] font-bold uppercase tracking-wide text-slate-700">
    //                                           Status
    //                                         </div>
    //                                         <span className="mt-0.5 inline-flex rounded-full bg-emerald-700 px-2 py-[2px] text-[9px] font-bold uppercase tracking-wide leading-none text-white shadow-sm">
    //                                           {item?.formdata?.status || "N/A"}
    //                                         </span>
    //                                       </td>

    //                                       <td className="border-b border-slate-300 px-2 py-1 align-top">
    //                                         <div className="text-[9px] font-bold uppercase tracking-wide text-slate-700">
    //                                           Incoming No
    //                                         </div>
    //                                         <div className="mt-0.5 text-[10px] leading-tight text-slate-900">
    //                                           {item?.formdata?.incomingNumber ||
    //                                             "N/A"}
    //                                         </div>
    //                                       </td>

    //                                       <td
    //                                         colSpan="2"
    //                                         className="border-b border-slate-300 px-2 py-1 align-top"
    //                                       >
    //                                         <div className="text-[9px] font-bold uppercase tracking-wide text-slate-700">
    //                                           Attended By
    //                                         </div>
    //                                         <div className="mt-0.5 text-[10px] leading-tight text-slate-900">
    //                                           {Array.isArray(
    //                                             item?.formdata?.attendedBy
    //                                           )
    //                                             ? item.formdata.attendedBy
    //                                                 .length > 0
    //                                               ? item.formdata.attendedBy[
    //                                                   item.formdata.attendedBy
    //                                                     .length - 1
    //                                                 ]?.callerId?.name ||
    //                                                 item.formdata.attendedBy[
    //                                                   item.formdata.attendedBy
    //                                                     .length - 1
    //                                                 ]?.name ||
    //                                                 item.formdata.attendedBy[
    //                                                   item.formdata.attendedBy
    //                                                     .length - 1
    //                                                 ]
    //                                               : "N/A"
    //                                             : item?.formdata?.attendedBy
    //                                                 ?.callerId?.name || "N/A"}
    //                                         </div>
    //                                       </td>

    //                                       <td className="border-b border-slate-300 px-2 py-1 align-top">
    //                                         <div className="text-[9px] font-bold uppercase tracking-wide text-slate-700">
    //                                           Completed By
    //                                         </div>
    //                                         <div className="mt-0.5 text-[10px] leading-tight text-slate-900">
    //                                           {Array.isArray(
    //                                             item?.formdata?.completedBy
    //                                           )
    //                                             ? item.formdata.completedBy
    //                                                 .length > 0
    //                                               ? item.formdata.completedBy[
    //                                                   item.formdata.completedBy
    //                                                     .length - 1
    //                                                 ]?.callerId?.name ||
    //                                                 item.formdata.completedBy[
    //                                                   item.formdata.completedBy
    //                                                     .length - 1
    //                                                 ]?.name
    //                                               : "N/A"
    //                                             : item?.formdata?.completedBy
    //                                                 ?.callerId?.name ||
    //                                               item?.formdata?.completedBy
    //                                                 ?.name ||
    //                                               "N/A"}
    //                                         </div>
    //                                       </td>
    //                                     </tr>

    //                                     <tr className="bg-emerald-50/90">
    //                                       <td className="border-b border-slate-300 px-1 py-0.5"></td>

    //                                       <td
    //                                         colSpan="3"
    //                                         className="border-b border-slate-300 px-2 py-1 align-top"
    //                                       >
    //                                         <div className="text-[9px] font-bold uppercase tracking-wide text-slate-700">
    //                                           Description
    //                                         </div>
    //                                         <div className="mt-0.5 text-[10px] leading-tight text-slate-900">
    //                                           {item?.formdata?.description ||
    //                                             "N/A"}
    //                                         </div>
    //                                       </td>

    //                                       <td
    //                                         colSpan="3"
    //                                         className="border-b border-slate-300 px-2 py-1 align-top"
    //                                       >
    //                                         <div className="text-[9px] font-bold uppercase tracking-wide text-slate-700">
    //                                           Solution
    //                                         </div>
    //                                         <div className="mt-0.5 text-[10px] leading-tight text-slate-900">
    //                                           {item?.formdata?.solution ||
    //                                             "N/A"}
    //                                         </div>
    //                                       </td>
    //                                     </tr>
    //                                   </>
    //                                 )}
    //                               </React.Fragment>
    //                             )
    //                           }

    //                           return null
    //                         })}
    //                     </>
    //                   ) : (
    //                     <tr>
    //                       <td
    //                         colSpan="7"
    //                         className="px-3 py-8 text-center text-xs text-slate-500"
    //                       >
    //                         {loadingcounts ? (
    //                           <div className="justify center">
    //                             <PropagateLoader color="#3b82f6" size={10} />
    //                           </div>
    //                         ) : (
    //                           <div className="font-medium">No Calls</div>
    //                         )}
    //                       </td>
    //                     </tr>
    //                   )}
    //                 </tbody>
    //               </table>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="h-screen overflow-hidden bg-[#ADD8E6]">
      <div className="flex h-full w-full overflow-hidden">
        <StaticSidebar
          handleMoreClick={handleMoreClick}
          selectedCompanyBranch={selectedcompanybranchId}
          setselectedCompanyBranch={setselectedcompanybranchId}
          parenttargetData={settargetData}
          parentperiodmode={setperiodMode}
          parentyear={setSelectedYear}
          setselectedPeriod={setselectedPeriod}
        />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className="flex shrink-0 items-center justify-between border-b border-white/10 bg-[#0F172A]/95">
            {users?.role?.toLowerCase() === "admin" ? (
              <AdminHeader hide={true} />
            ) : (
              <StaffHeader hide={true} />
            )}

            <div className="flex h-full items-center gap-1.5 border-b border-white/10 bg-[#0F172A]/95 pr-3">
              <button className="rounded-full bg-slate-100 p-1.5 transition">
                <Mail size={15} strokeWidth={2.2} />
              </button>

              <div className="relative">
                <button className="rounded-full bg-slate-100 p-1.5 transition">
                  <MessageSquareText size={15} strokeWidth={2.2} />
                </button>
                <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-500" />
              </div>

              <button className="rounded-full bg-slate-100 p-1.5 transition">
                <Settings size={15} strokeWidth={2.2} />
              </button>

              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowUserMenu((prev) => !prev)
                  }}
                  className="rounded-full bg-slate-100 p-1.5 transition"
                >
                  <User size={15} strokeWidth={2.2} />
                </button>
              </div>
            </div>
          </header>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-2 md:p-3">
            <div className="flex min-h-0 flex-1 flex-col rounded-xl bg-neutral-50 px-3 py-2 shadow-lg md:px-4">
              <div className="mb-2 flex shrink-0 flex-col gap-2 px-1 lg:flex-row lg:items-start lg:justify-between lg:px-2">
                <div className="flex w-full flex-col gap-2 lg:max-w-2xl">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                      <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        onChange={handleChange}
                        className="w-full rounded-full border border-gray-300 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Search for..."
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/${users.role.toLowerCase()}/transaction/call-registration`
                        )
                      }
                      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700"
                    >
                      Call
                    </button>

                    <select
                      onChange={(e) => {
                        setLoading(true)
                        setFilteredCalls([])
                        setSelectedCompanyBranch(e.target.value)
                      }}
                      className="min-w-[140px] cursor-pointer rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {loggedUserBranches?.map((branch) => (
                        <option key={branch._id} value={branch.label}>
                          {branch.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="w-full lg:w-auto">
                  <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                    <table className="min-w-max text-center text-xs md:text-sm">
                      <tbody>
                        <tr className="border-b bg-gray-50">
                          <td className="px-3 py-1.5 font-bold text-[#010bff]">
                            Total Calls
                          </td>
                          <td className="px-3 py-1.5 font-bold text-purple-700">
                            Colleague Solved
                          </td>
                          <td className="px-3 py-1.5 font-bold text-red-600">
                            Pending Calls
                          </td>
                          <td className="px-3 py-1.5 font-bold text-green-600">
                            Solved Calls
                          </td>
                          <td className="px-3 py-1.5 font-bold text-gray-600">
                            Total Duration
                          </td>
                        </tr>
                        <tr>
                          <td className="px-3 py-1.5 text-[#010bff]">
                            {userCallStatus?.totalCalls}
                          </td>
                          <td className="px-3 py-1.5 text-purple-700">
                            {userCallStatus?.collegeSolvedCalls}
                          </td>
                          <td className="px-3 py-1.5 text-red-600">
                            {userCallStatus?.pendingCalls}
                          </td>
                          <td className="px-3 py-1.5 text-green-600">
                            {userCallStatus?.solvedCalls}
                          </td>
                          <td className="px-3 py-1.5 text-gray-600">
                            {formatDuration(userCallStatus?.totalDuration)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <hr className="mb-2 shrink-0 border-t border-gray-300" />

              <div className="mb-2 grid shrink-0 grid-cols-2 gap-2 lg:grid-cols-4">
                <Tiles
                  title="Pending Calls"
                  count={pendingCallsCount}
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255, 0, 0, 1), rgba(255, 128, 128, 1))"
                  }}
                  onClick={() => {
                    setActiveFilter("Pending")
                    setFilteredCalls(applyFilter())
                  }}
                />

                <Tiles
                  title="Solved Calls"
                  color="bg-green-500"
                  count={solvedCallsCount}
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(0, 140, 0, 1), rgba(128, 255, 128,1 ))"
                  }}
                  onClick={() => {
                    setActiveFilter("Solved")
                    setFilteredCalls(applyFilter())
                  }}
                />

                <Tiles
                  title="Today's Calls"
                  color="bg-yellow-500"
                  count={todayCallsCount}
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255, 255, 1, 1), rgba(255, 255, 128, 1))"
                  }}
                  onClick={() => {
                    setActiveFilter("Today")
                    setFilteredCalls(applyFilter())
                  }}
                />

                <Tiles
                  title="Online Call"
                  color="bg-blue-500"
                  count={"0"}
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(0, 0, 270, 0.8), rgba(128, 128, 255, 0.8))"
                  }}
                  onClick={() => {
                    setActiveFilter("Online")
                    setFilteredCalls(applyFilter())
                  }}
                />
              </div>

              <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-slate-300 bg-slate-50 shadow-[0_8px_24px_rgba(15,23,42,0.10)]">
                <div className="h-full overflow-y-auto">
                  <table className="w-full table-fixed border-separate border-spacing-0 text-[11px] text-slate-700 md:text-xs">
                    <thead className="sticky top-0 z-40 bg-slate-200">
                      <tr className="bg-gradient-to-r from-slate-300 via-slate-200 to-slate-100 shadow-[inset_0_-1px_0_rgba(100,116,139,0.35)]">
                        <th className="w-[5%] border-b border-slate-300 px-2 py-2 text-center font-bold text-slate-700"></th>
                      
                        <th className="w-[20%] border-b border-slate-300 px-2 py-2 text-left font-bold text-slate-700">
                          Customer Name
                        </th>
                        <th className="w-[21%] border-b border-slate-300 px-2 py-2 text-left font-bold text-slate-700">
                          Product Name
                        </th>
                        <th className="w-[11%] border-b border-slate-300 px-2 py-2 text-left font-bold text-slate-700">
                          License No
                        </th>
                        <th className="w-[13%] border-b border-slate-300 px-2 py-2 text-left font-bold text-slate-700">
                          Description
                        </th>
                        <th className="w-[11%] border-b border-slate-300 px-2 py-2 text-left font-bold text-slate-700">
                          Incoming No
                        </th>
                        <th className="w-[9%] border-b border-slate-300 px-2 py-2 text-center font-bold text-slate-700">
                          Call
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredCalls?.length > 0 ? (
                        <>
                          {filteredCalls
                            .flatMap((calls) =>
                              calls.callregistration.map((item) => ({
                                ...item,
                                calls
                              }))
                            )
                            .filter(
                              (item) => item?.formdata?.status === "pending"
                            )
                            .sort((a, b) => {
                              const today = new Date()
                                .toISOString()
                                .split("T")[0]

                              const getDateString = (entry) => {
                                if (!entry?.timedata?.endTime) return null
                                const date = new Date(entry.timedata.endTime)
                                return isNaN(date.getTime())
                                  ? null
                                  : date.toISOString().split("T")[0]
                              }

                              const aDate = getDateString(a)
                              const bDate = getDateString(b)

                              if (aDate === today && bDate !== today) return -1
                              if (aDate !== today && bDate === today) return 1

                              return (
                                new Date(b?.timedata?.endTime) -
                                new Date(a?.timedata?.endTime)
                              )
                            })
                            .map((item, index) => {
                              const today = new Date()
                                .toISOString()
                                .split("T")[0]
                              const startTimeRaw = item?.timedata?.endTime
                              const callDate = startTimeRaw
                                ? new Date(startTimeRaw.split(" ")[0])
                                    .toISOString()
                                    .split("T")[0]
                                : null

                              if (
                                userBranch.some((branch) =>
                                  item.branchName.includes(branch)
                                )
                              ) {
                                const isTodayPending = callDate === today
                                const rowKey = `${item.calls?._id}-${item?.timedata?.token}-${index}`
                                const isExpanded = expandedRows?.[rowKey]

                                return (
                                  <React.Fragment key={rowKey}>
                                    <tr
                                      className={`transition-all duration-150 ${
                                        isTodayPending
                                          ? "bg-gradient-to-r from-amber-300 via-orange-200 to-yellow-100 hover:from-amber-400 hover:via-orange-300 hover:to-yellow-200"
                                          : "bg-gradient-to-r from-rose-300 via-red-200 to-pink-100 hover:from-rose-400 hover:via-red-300 hover:to-pink-200"
                                      }`}
                                    >
                                      <td className="border-b border-slate-300 px-1 py-1 text-center align-middle">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setExpandedRows((prev) => ({
                                              ...prev,
                                              [rowKey]: !prev?.[rowKey]
                                            }))
                                          }
                                          className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-400 bg-white/90 text-[9px] font-bold text-slate-700 shadow-sm transition hover:bg-white"
                                        >
                                          <span
                                            className={`transition-transform duration-200 ${
                                              isExpanded ? "rotate-180" : ""
                                            }`}
                                          >
                                            ▼
                                          </span>
                                        </button>
                                      </td>

                                    
                                      <td className="break-words border-b border-slate-300 px-2 py-1 align-top text-slate-900">
                                        {item.calls?.customerName || "N/A"}
                                      </td>

                                      <td className="break-words border-b border-slate-300 px-2 py-1 align-top text-slate-900">
                                        {item?.calls?.productDetails?.[0]
                                          ?.productName || "N/A"}
                                      </td>

                                      <td className="truncate border-b border-slate-300 px-2 py-1 align-top text-slate-800">
                                        {item?.license || "N/A"}
                                      </td>

                                      {/* <td className="truncate border-b border-slate-300 px-2 py-1 align-top text-slate-800">
                                        {item?.formdata?.description}
                                      </td> */}
<td className="border-b border-slate-300 px-2 py-1 align-top text-slate-800">
  <div className="group relative max-w-full">
    <div className="truncate rounded-md px-1 py-0.5 text-slate-800 cursor-pointer">
      {item?.formdata?.description || "N/A"}
    </div>

    {item?.formdata?.description && (
      <div className="pointer-events-none absolute left-0 top-full z-50 mt-2 w-72 translate-y-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] leading-relaxed text-slate-700 opacity-0 shadow-[0_12px_30px_rgba(15,23,42,0.18)] transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
        <div className="whitespace-normal break-words text-slate-800">
          {item.formdata.description}
        </div>
        <div className="absolute -top-1.5 left-4 h-3 w-3 rotate-45 border-l border-t border-slate-200 bg-white" />
      </div>
    )}
  </div>
</td>

                                      <td className="truncate border-b border-slate-300 px-2 py-1 align-top text-slate-800">
                                        {item?.formdata?.incomingNumber ||
                                          "N/A"}
                                      </td>

                                      <td className="border-b border-slate-300 px-2 py-1 text-center align-middle">
                                        {item?.formdata?.status !== "solved" ? (
                                          <button
                                            type="button"
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-blue-600 to-indigo-700 text-white shadow-[0_4px_12px_rgba(37,99,235,0.35)] transition hover:scale-105 hover:from-blue-700 hover:to-indigo-800 active:scale-95"
                                            onClick={() =>
                                              users.role === "Admin"
                                                ? navigate(
                                                    "/admin/transaction/call-registration",
                                                    {
                                                      state: {
                                                        calldetails:
                                                          item.calls._id,
                                                        token:
                                                          item.timedata.token
                                                      }
                                                    }
                                                  )
                                                : navigate(
                                                    "/staff/transaction/call-registration",
                                                    {
                                                      state: {
                                                        calldetails:
                                                          item?.calls._id,
                                                        token:
                                                          item?.timedata?.token
                                                      }
                                                    }
                                                  )
                                            }
                                          >
                                            <FaPhone className="text-[11px]" />
                                          </button>
                                        ) : null}
                                      </td>
                                    </tr>

                                    {isExpanded && (
                                      <>
                                        <tr className="bg-slate-100">
                                          <td className="border-b border-slate-300 px-1 py-0.5"></td>

                                          <td
                                            colSpan="2"
                                            className="border-b border-slate-300 px-2 py-1 align-top"
                                          >
                                            <div className="text-[9px] font-bold uppercase tracking-wide text-slate-600">
                                              Solution
                                            </div>
                                            <span
                                              className={`mt-0.5 inline-flex rounded-full px-2 py-[2px] text-[9px] font-bold uppercase tracking-wide leading-none shadow-sm ${
                                                isTodayPending
                                                  ? "bg-orange-600 text-white"
                                                  : "bg-rose-600 text-white"
                                              }`}
                                            >
                                              {item?.formdata?.solution ||
                                                "N/A"}
                                            </span>
                                          </td>

                                          <td className="border-b border-slate-300 px-2 py-1 align-top">
                                            <div className="text-[9px] font-bold uppercase tracking-wide text-slate-600">
                                              Call Date
                                            </div>
                                            <div className="mt-0.5 text-[10px] leading-tight text-slate-900">
                                            
                                              {setDateandTime(
                                                item?.timedata?.startTime
                                              )}
                                            </div>
                                          </td>

                                          <td
                                            colSpan="2"
                                            className="border-b border-slate-300 px-2 py-1 align-top"
                                          >
                                            <div className="text-[9px] font-bold uppercase tracking-wide text-slate-600">
                                              Attended By
                                            </div>
                                            <div className="mt-0.5 text-[10px] leading-tight text-slate-900">
                                              {Array.isArray(
                                                item?.formdata?.attendedBy
                                              )
                                                ? item.formdata.attendedBy
                                                    .length > 0
                                                  ? item.formdata.attendedBy[
                                                      item.formdata.attendedBy
                                                        .length - 1
                                                    ]?.callerId?.name ||
                                                    item.formdata.attendedBy[
                                                      item.formdata.attendedBy
                                                        .length - 1
                                                    ]?.name ||
                                                    item.formdata.attendedBy[
                                                      item.formdata.attendedBy
                                                        .length - 1
                                                    ]
                                                  : "N/A"
                                                : item?.formdata?.attendedBy
                                                    ?.callerId?.name || "N/A"}
                                            </div>
                                          </td>

                                          <td className="border-b border-slate-300 px-2 py-1 align-top">
                                            <div className="text-[9px] font-bold uppercase tracking-wide text-slate-600">
                                              Completed By
                                            </div>
                                            <div className="mt-0.5 text-[10px] leading-tight text-slate-900">
                                              N/A
                                            </div>
                                          </td>
                                        </tr>

                                        {/* <tr className="bg-slate-200/70">
                                          <td className="border-b border-slate-300 px-1 py-0.5"></td>

                                          <td
                                            colSpan="3"
                                            className="border-b border-slate-300 px-2 py-1 align-top"
                                          >
                                            <div className="text-[9px] font-bold uppercase tracking-wide text-slate-600">
                                              Description
                                            </div>
                                            <div className="mt-0.5 text-[10px] leading-tight text-slate-900">
                                              {item?.formdata?.description ||
                                                "N/A"}
                                            </div>
                                          </td>

                                          <td
                                            colSpan="3"
                                            className="border-b border-slate-300 px-2 py-1 align-top"
                                          >
                                            <div className="text-[9px] font-bold uppercase tracking-wide text-slate-600">
                                              Solution
                                            </div>
                                            <div className="mt-0.5 text-[10px] leading-tight text-slate-900">
                                              {item?.formdata?.solution ||
                                                "N/A"}
                                            </div>
                                          </td>
                                        </tr> */}
                                      </>
                                    )}
                                  </React.Fragment>
                                )
                              }

                              return null
                            })}

                          {filteredCalls
                            .flatMap((calls) =>
                              calls.callregistration.map((item) => ({
                                ...item,
                                calls
                              }))
                            )
                            .filter((item) => {
                              const today = new Date()
                                .toISOString()
                                .split("T")[0]
                              const isSolved =
                                item?.formdata?.status === "solved"
                              const startTimeRaw = item?.timedata?.endTime
                              const callDate = startTimeRaw
                                ? new Date(startTimeRaw.split(" ")[0])
                                    .toISOString()
                                    .split("T")[0]
                                : null
                              const isToday = callDate === today
                              return isSolved && isToday
                            })
                            .sort((a, b) => {
                              const endTimeA = new Date(
                                a?.timedata?.endTime
                              ).getTime()
                              const endTimeB = new Date(
                                b?.timedata?.endTime
                              ).getTime()
                              const startTimeA = new Date(
                                a?.timedata?.startTime
                              ).getTime()
                              const startTimeB = new Date(
                                b?.timedata?.startTime
                              ).getTime()

                              return (
                                endTimeB - endTimeA || startTimeB - startTimeA
                              )
                            })
                            .map((item, index) => {
                              if (
                                userBranch.some((branch) =>
                                  item.branchName.includes(branch)
                                )
                              ) {
                                const rowKey = `${item.calls?._id}-solved-${item?.timedata?.token}-${index}`
                                const isExpanded = expandedRows?.[rowKey]

                                return (
                                  <React.Fragment key={rowKey}>
                                    <tr className="bg-gradient-to-r from-emerald-300 via-green-200 to-teal-100 transition-all duration-150 hover:from-emerald-400 hover:via-green-300 hover:to-teal-200">
                                      <td className="border-b border-slate-300 px-1 py-1 text-center align-middle">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setExpandedRows((prev) => ({
                                              ...prev,
                                              [rowKey]: !prev?.[rowKey]
                                            }))
                                          }
                                          className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-400 bg-white/90 text-[9px] font-bold text-slate-700 shadow-sm transition hover:bg-white"
                                        >
                                          <span
                                            className={`transition-transform duration-200 ${
                                              isExpanded ? "rotate-180" : ""
                                            }`}
                                          >
                                            ▼
                                          </span>
                                        </button>
                                      </td>


                                      <td className="break-words border-b border-slate-300 px-2 py-1 align-top text-slate-900">
                                        {item.calls?.customerName || "N/A"}
                                      </td>

                                      <td className="break-words border-b border-slate-300 px-2 py-1 align-top text-slate-900">
                                        {item?.calls?.productDetails?.[0]
                                          ?.productName || "N/A"}
                                      </td>

                                      <td className="truncate border-b border-slate-300 px-2 py-1 align-top text-slate-800">
                                        {item?.license || "N/A"}
                                      </td>

                                      {/* <td className="truncate border-b border-slate-300 px-2 py-1 align-top text-slate-800">
                                        {item?.formdata?.description}
                                      </td> */}
{/* <td className="border-b border-slate-300 px-2 py-1 align-top text-slate-800">
  <div className="group relative max-w-full">
    <div className="truncate rounded-md px-1 py-0.5 text-slate-800 cursor-pointer">
      {item?.formdata?.description || "N/A"}
    </div>

    {item?.formdata?.description && (
      <div className="pointer-events-none absolute left-0 top-full z-50 mt-2 w-72 translate-y-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] leading-relaxed text-slate-700 opacity-0 shadow-[0_12px_30px_rgba(15,23,42,0.18)] transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
        <div className="whitespace-normal break-words text-slate-800">
          {item.formdata.description}
        </div>
        <div className="absolute -top-1.5 left-4 h-3 w-3 rotate-45 border-l border-t border-slate-200 bg-white" />
      </div>
    )}
  </div>
</td> */}
<td className="border-b border-slate-300 px-2 py-1 align-top text-slate-800">
  <div className="group relative max-w-full">
    <div className="truncate rounded-md px-1 py-0.5 text-slate-800 cursor-pointer">
      {item?.formdata?.description || "N/A"}
    </div>

    {item?.formdata?.description && (
      <div className="pointer-events-none absolute bottom-full left-0 z-50 mb-2 w-72 -translate-y-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] leading-relaxed text-slate-700 opacity-0 shadow-[0_12px_30px_rgba(15,23,42,0.18)] transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
        <div className="whitespace-normal break-words text-slate-800">
          {item.formdata.description}
        </div>
        <div className="absolute -bottom-1.5 left-4 h-3 w-3 rotate-45 border-b border-r border-slate-200 bg-white" />
      </div>
    )}
  </div>
</td>
                                      <td className="truncate border-b border-slate-300 px-2 py-1 align-top text-slate-800">
                                        {item?.formdata?.incomingNumber ||
                                          "N/A"}
                                      </td>

                                      <td className="border-b border-slate-300 px-2 py-1 text-center align-middle"></td>
                                    </tr>

                                    {isExpanded && (
                                      <>
                                        <tr className="bg-emerald-100/80">
                                          <td className="border-b border-slate-300 px-1 py-0.5"></td>

                                          <td
                                            colSpan="2"
                                            className="border-b border-slate-300 px-2 py-1 align-top"
                                          >
                                            <div className="text-[9px] font-bold uppercase tracking-wide text-slate-700">
                                              Solution
                                            </div>
                                            <span className="mt-0.5 inline-flex rounded-full bg-emerald-700 px-2 py-[2px] text-[9px] font-bold uppercase tracking-wide leading-none text-white shadow-sm">
                                              {item?.formdata?.solution ||
                                                "N/A"}
                                            </span>
                                          </td>

                                          <td className="border-b border-slate-300 px-2 py-1 align-top">
                                            <div className="text-[9px] font-bold uppercase tracking-wide text-slate-700">
                                              Call Date
                                            </div>
                                            <div className="mt-0.5 text-[10px] leading-tight text-slate-900">
                                              {setDateandTime(
                                                item?.timedata?.startTime
                                              )}
                                            </div>
                                          </td>

                                          <td
                                            colSpan="2"
                                            className="border-b border-slate-300 px-2 py-1 align-top"
                                          >
                                            <div className="text-[9px] font-bold uppercase tracking-wide text-slate-700">
                                              Attended By
                                            </div>
                                            <div className="mt-0.5 text-[10px] leading-tight text-slate-900">
                                              {Array.isArray(
                                                item?.formdata?.attendedBy
                                              )
                                                ? item.formdata.attendedBy
                                                    .length > 0
                                                  ? item.formdata.attendedBy[
                                                      item.formdata.attendedBy
                                                        .length - 1
                                                    ]?.callerId?.name ||
                                                    item.formdata.attendedBy[
                                                      item.formdata.attendedBy
                                                        .length - 1
                                                    ]?.name ||
                                                    item.formdata.attendedBy[
                                                      item.formdata.attendedBy
                                                        .length - 1
                                                    ]
                                                  : "N/A"
                                                : item?.formdata?.attendedBy
                                                    ?.callerId?.name || "N/A"}
                                            </div>
                                          </td>

                                          <td className="border-b border-slate-300 px-2 py-1 align-top">
                                            <div className="text-[9px] font-bold uppercase tracking-wide text-slate-700">
                                              Completed By
                                            </div>
                                            <div className="mt-0.5 text-[10px] leading-tight text-slate-900">
                                              {Array.isArray(
                                                item?.formdata?.completedBy
                                              )
                                                ? item.formdata.completedBy
                                                    .length > 0
                                                  ? item.formdata.completedBy[
                                                      item.formdata.completedBy
                                                        .length - 1
                                                    ]?.callerId?.name ||
                                                    item.formdata.completedBy[
                                                      item.formdata.completedBy
                                                        .length - 1
                                                    ]?.name
                                                  : "N/A"
                                                : item?.formdata?.completedBy
                                                    ?.callerId?.name ||
                                                  item?.formdata?.completedBy
                                                    ?.name ||
                                                  "N/A"}
                                            </div>
                                          </td>
                                        </tr>

                                        {/* <tr className="bg-emerald-50/90">
                                          <td className="border-b border-slate-300 px-1 py-0.5"></td>

                                          <td
                                            colSpan="3"
                                            className="border-b border-slate-300 px-2 py-1 align-top"
                                          >
                                            <div className="text-[9px] font-bold uppercase tracking-wide text-slate-700">
                                              Description
                                            </div>
                                            <div className="mt-0.5 text-[10px] leading-tight text-slate-900">
                                              {item?.formdata?.description ||
                                                "N/A"}
                                            </div>
                                          </td>

                                          <td
                                            colSpan="3"
                                            className="border-b border-slate-300 px-2 py-1 align-top"
                                          >
                                            <div className="text-[9px] font-bold uppercase tracking-wide text-slate-700">
                                              Solution
                                            </div>
                                            <div className="mt-0.5 text-[10px] leading-tight text-slate-900">
                                              {item?.formdata?.solution ||
                                                "N/A"}
                                            </div>
                                          </td>
                                        </tr> */}
                                      </>
                                    )}
                                  </React.Fragment>
                                )
                              }

                              return null
                            })}
                        </>
                      ) : (
                        <tr>
                          <td
                            colSpan="7"
                            className="px-3 py-8 text-center text-xs text-slate-500"
                          >
                            {loadingcounts ? (
                              <div className="justify center">
                                <PropagateLoader color="#3b82f6" size={10} />
                              </div>
                            ) : (
                              <div className="font-medium">No Calls</div>
                            )}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CallregistrationList
