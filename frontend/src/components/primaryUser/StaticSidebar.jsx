// import React, { useEffect, useMemo, useState } from "react"
// import UseFetch from "../../hooks/useFetch"
// import useMediaQuery from "@mui/material/useMediaQuery"
// import { BranchSelect } from "./BranchSelect"
// import {
//   getLocalStorageItem,
//   setLocalStorageItem
// } from "../../helper/localstorage"
// import AvatarEditor from "../common/AvatarEditor"
// import { PerformanceModal } from "./PerformanceModal"
// import api from "../../api/api"
// import SkeletonTable from "../loader/SkeletonTable"
// import Sidebar from "./Sidebar"
// import { toast } from "react-toastify"

// export const StaticSidebar = ({
//   selectedCompanyBranch,
//   setselectedPeriod,
//   handleMoreClick,
//   setselectedCompanyBranch,
//   parenttargetData,
//   parentyear,
//   parentperiodmode
// }) => {
//   const now = new Date()

//   const [categorylist, setcategorylist] = useState([])
//   const [avatarOpen, setAvatarOpen] = useState(false)
//   const [user, setUser] = useState(null)
//   const [selectedUserName, setselecteduserName] = useState(null)
//   const [selectedBranch, setselectedBranch] = useState(null)
//   const [periodMode, setperiodMode] = useState(parentperiodmode)
//   const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024)
//   // const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)
//   const [branchOptions, setbranchOptions] = useState([])
//   const [selectedMonth, setSelectedMonth] = useState(
//     String(now.getMonth() + 1).padStart(2, "0")
//   )
// const isMobile = useMediaQuery("(max-width:768px)");
//   const [loggedusedTarget, setloggeduserTarget] = useState([])
//   const [selectedYear, setSelectedYear] = useState(parentyear)
//   const [achievedPoints, setachievedPoints] = useState(0)

//   const { data, loading: targetLoading } = UseFetch(
//     selectedBranch &&
//       selectedMonth &&
//       selectedYear &&
//       periodMode &&
//       `/target/gettargetresult?month=${selectedMonth}&year=${selectedYear}&periodMode=${periodMode}&selectedBranch=${selectedBranch}`
//   )

//   const { data: branchlist } = UseFetch("/branch/getBranch")

//   // useEffect(() => {
//   //   const handleResize = () => {
//   //     const mobile = window.innerWidth < 1024
//   //     setIsMobile(mobile)
//   //     setSidebarOpen(!mobile)
//   //   }

//   //   window.addEventListener("resize", handleResize)
//   //   return () => window.removeEventListener("resize", handleResize)
//   // }, [])
// useEffect(() => {
//   const handleResize = () => {
//     const mobile = window.innerWidth < 1024;

//     if (mobile !== isMobile) {
//       setIsMobile(mobile);

//       if (mobile) {
//         setSidebarOpen(false);
//       } else {
//         setSidebarOpen(true);
//       }
//     }
//   };

//   window.addEventListener("resize", handleResize);

//   return () =>
//     window.removeEventListener("resize", handleResize);
// }, [isMobile]);

//   useEffect(() => {
//     setperiodMode(parentperiodmode)
//   }, [parentperiodmode])

//   useEffect(() => {
//     setSelectedYear(parentyear)
//   }, [parentyear])

//   useEffect(() => {
//     if (selectedCompanyBranch) {
//       setselectedBranch(selectedCompanyBranch)
//     }
//   }, [selectedCompanyBranch])

//   useEffect(() => {
//     if (!branchlist) return

//     const storedUser = getLocalStorageItem("user")
//     if (storedUser) {
//       setUser(storedUser)
//       setselecteduserName(storedUser.name)

//       const uniqueBranches = storedUser.selected.map((branch) => ({
//         id: branch.branch_id,
//         label: branch.branchName
//       }))

//       setbranchOptions(uniqueBranches)
//     }
//   }, [branchlist])

//   useEffect(() => {
//     if (data?.userWiseResults && data?.userWiseResults.length && user?._id) {
//       parenttargetData(data)
//       setselectedPeriod(data?.selectedPeriodName)

//       const uniqueCategories = [
//         ...new Map(
//           data.userWiseResults
//             .flatMap((userItem) => userItem.categories || [])
//             .map((category) => [
//               category.categoryId,
//               {
//                 categoryId: category.categoryId,
//                 categoryName: category.categoryName
//               }
//             ])
//         ).values()
//       ]

//       const selectedUser = data.userWiseResults.find(
//         (item) => item.userId === user._id
//       )

//       setloggeduserTarget(selectedUser || [])
//       setachievedPoints(selectedUser?.incentive || 0)

//       const updatedCategories = uniqueCategories.map((cat) => {
//         const matchedCategories =
//           data.userWiseResults
//             ?.flatMap((userItem) => userItem.categories || [])
//             .filter((c) => c.categoryId === cat.categoryId) || []

//         const totalTarget = matchedCategories.reduce(
//           (sum, c) => sum + (c.target || 0),
//           0
//         )

//         const totalAchieved = matchedCategories.reduce(
//           (sum, c) => sum + (c.achieved || 0),
//           0
//         )

//         return {
//           ...cat,
//           achievedamount: totalAchieved,
//           targetamount: totalTarget
//         }
//       })

//       setcategorylist(updatedCategories)
//     }
//   }, [data, user, parenttargetData, setselectedPeriod])

//   const handlepasswordChange = async (payload) => {
//     try {
//       const updatepassword = await api.put("/auth/updatepassword", payload)

//       if (updatepassword.status === 200) {
//         toast.success(updatepassword.data.message)
//       } else {
//         toast.error("Something went wrong")
//       }
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Failed to update password")
//     }
//   }

//   const toggleSidebar = () => {
//     setSidebarOpen((prev) => !prev)
//   }

//   const handleBranchChange = (branch) => {
//     setselectedBranch(branch)
//     setselectedCompanyBranch(branch)

//     if (isMobile) {
//       setSidebarOpen(false)
//     }
//   }

//   return (
//     <>
//       <div
//         className={`${
//           isMobile ? "fixed left-0 top-0 z-40 h-screen" : "relative h-full"
//         }`}
//       >
//         <div
//           className={`h-full transition-transform duration-300 ease-in-out ${
//             isMobile
//               ? sidebarOpen
//                 ? "translate-x-0"
//                 : "-translate-x-full"
//               : "translate-x-0"
//           }`}
//         >
//           <div
//             className={`h-full ${
//               isMobile
//                 ? "w-[85vw] max-w-[320px] bg-white shadow-2xl"
//                 : "w-auto"
//             }`}
//           >
//             <Sidebar
//               handleMoreClick={handleMoreClick}
//               achievedPoints={achievedPoints}
//               sidebarOpen={sidebarOpen}
//               toggleSidebar={toggleSidebar}
//               user={user}
//               selectedBranch={selectedBranch}
//               setselectedParentBranch={setselectedCompanyBranch}
//               setselectedBranch={handleBranchChange}
//               branchOptions={branchOptions}
//               categorylist={categorylist}
//               targetLoading={targetLoading}
//               BranchSelect={BranchSelect}
//               SkeletonTable={SkeletonTable}
//               setAvatarOpen={setAvatarOpen}
//               onPasswordChange={handlepasswordChange}
//               isMobile={isMobile}
//             />
//           </div>
//         </div>
//       </div>

//       {isMobile && sidebarOpen && (
//         <button
//           type="button"
//           aria-label="Close sidebar overlay"
//           onClick={() => setSidebarOpen(false)}
//           className="fixed inset-0 z-30 bg-black/40"
//         />
//       )}
//     </>
//   )
// }

import React, { useEffect, useState } from "react"
import UseFetch from "../../hooks/useFetch"
import useMediaQuery from "@mui/material/useMediaQuery"
import { BranchSelect } from "./BranchSelect"
import {
  getLocalStorageItem,
  setLocalStorageItem
} from "../../helper/localstorage"
import { useNavigate } from "react-router-dom"
import { setsliceselectedBranch } from "../../../slices/companyBranchSlice.js"
// import {setselected}
import { useSelector } from "react-redux"
import AvatarEditor from "../common/AvatarEditor"
import { PerformanceModal } from "./PerformanceModal"
import api from "../../api/api"
import SkeletonTable from "../loader/SkeletonTable"
import Sidebar from "./Sidebar"
import { toast } from "react-toastify"
import { useDispatch } from "react-redux"
export const StaticSidebar = ({
  selectedCompanyBranch,
  selectedMonths,
  yearSelected,
  setcategoryId,
  onselectedPeriodChange,
  setselectedCategory,
setproductList,
selectedCategory,
  // setselectedPeriod,
  // handleMoreClick,
  setselectedCompanyBranch,
  parenttargetData,
  parentyear,
  parentperiodmode,
  onpasswordClick,
  onperformanceModalClick,
  setTargetData,
  targetData,
  onavataropenClick,
setacheivedProducts,
achievedproducts
}) => {
console.log(selectedCategory)
// console.log(setselectedCategory)
  console.log(targetData)
  console.log("hhd")
  // console.log(onpasswordClick)
  const now = new Date()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [categorylist, setcategorylist] = useState([])
  console.log(categorylist)
  // const now = new Date()
  const [selectedPeriod, setselectedPeriod] = useState("")
  const [selectedYear, setSelectedYear] = useState(yearSelected)
  console.log(selectedYear)
  const [periodMode, setperiodMode] = useState(parentperiodmode)
  const [avatarOpen, setAvatarOpen] = useState(false)
  // const [user, setUser] = useState(null)
  const user = useSelector((state) => state.auth.user)
  console.log(user)
  // const [selectedBranch, setselectedBranch] = useState(null)
  // console.log(selectedBranch)
  // const [periodMode, setperiodMode] = useState(parentperiodmode)
  const [branchOptions, setbranchOptions] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(selectedMonths)
  //  const [targetData, settargetData] = useState([])
  const isMobile = useMediaQuery("(max-width:1023px)")
  const [loggedusedTarget, setloggeduserTarget] = useState([])
  // const [selectedYear, setSelectedYear] = useState(parentyear)
  const [achievedPoints, setachievedPoints] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const brand = useSelector((branch) => branch.companyBranch.branches)
  const selectedBranch = useSelector((b) => b.companyBranch.selectedBranch)
  console.log(selectedBranch)
  console.log(brand)
  const { data, loading: targetLoading } = UseFetch(
    selectedBranch &&
      selectedMonth &&
      selectedYear &&
      periodMode &&
      `/target/gettargetresult?month=${selectedMonth}&year=${selectedYear}&periodMode=${periodMode}&selectedBranch=${selectedBranch}`
  )
 const { data: branchProduct } = UseFetch(
    `/product/getallbranchProduct?branch=${selectedBranch}`
  )
  console.log(selectedMonth)
  console.log(data)
  console.log(selectedBranch)
  console.log(selectedYear)
  console.log(periodMode)
  console.log(data)
  const { data: branchlist } = UseFetch("/branch/getBranch")
useEffect(() => {
console.log("hhhhh")
console.log(selectedCategory)
    if (selectedCategory) {
console.log('hhhh')
      const filteredList = branchProduct
        .filter(
          (item) =>
            item.selected?.some(
              (selectedItem) =>
                String(selectedItem.category_id) ===
                String(selectedCategory?.Id)
            ) || String(item.category_id) === String(selectedCategory?.Id)
        )
        .map((item) => item.productName || item.serviceName)
      setproductList(filteredList)

      const filteredloggedUserItem = data?.userWiseResults.filter(
        (item) => item.userId === user._id
      )
      console.log(filteredloggedUserItem)
      const filteredselectedCategory =
        filteredloggedUserItem[0]?.categories.filter(
          (item) => item.categoryId === selectedCategory?.Id
        )
      const summary = filteredselectedCategory?.reduce(
        (acc, cur) => {
          acc.target += Number(cur.target || 0)
          acc.achieved += Number(cur.achieved || 0)
          acc.balance += Number(cur.balance || 0)
          return acc
        },
        { target: 0, achieved: 0, balance: 0 }
      )
console.log(filteredselectedCategory)
      // setselectedDataPopup(summary)
      console.log(summary)
      if (filteredselectedCategory && filteredselectedCategory.length) {
console.log("hhhhha")
console.log(achievedproducts)
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
    }
  }, [data,selectedCategory])
console.log(achievedPoints)
  useEffect(() => {
    setSidebarOpen(!isMobile)
  }, [isMobile])

  useEffect(() => {
    setperiodMode(parentperiodmode)
  }, [parentperiodmode])

  useEffect(() => {
    console.log(yearSelected)
    setSelectedYear(yearSelected)
  }, [yearSelected])

  useEffect(() => {
    setSelectedMonth(selectedMonths)
  }, [selectedMonths])

  useEffect(() => {
    if (!branchlist) return
    if (!user) return

    console.log(user)
    const uniqueBranches = (user.selected || []).map((branch) => ({
      id: branch.branch_id,
      label: branch.branchName
    }))
    console.log(uniqueBranches)
    setbranchOptions(uniqueBranches)
  }, [branchlist, user])
  console.log(branchOptions)
  useEffect(() => {
    if (data?.userWiseResults && data?.userWiseResults.length && user?._id) {
      console.log(data)
      // parenttargetData(data)
      setTargetData(data)
      setselectedPeriod(data?.selectedPeriodName)

      const uniqueCategories = [
        ...new Map(
          data.userWiseResults
            .flatMap((userItem) => userItem.categories || [])
            .map((category) => [
              category.categoryId,
              {
                categoryId: category.categoryId,
                categoryName: category.categoryName
              }
            ])
        ).values()
      ]

      const selectedUser = data.userWiseResults.find(
        (item) => item.userId === user._id
      )
console.log(data.userWiseResults)
const aa=data.userWiseResults.map((item)=>item.incentive)
console.log(aa)
      setloggeduserTarget(selectedUser || null)
console.log(selectedUser)
      setachievedPoints(selectedUser?.incentive || 0)

      const updatedCategories = uniqueCategories
        .map((cat) => {
          const matchedCategories =
            data.userWiseResults
              ?.flatMap((userItem) => userItem.categories || [])
              .filter((c) => c.categoryId === cat.categoryId) || []

          const totalTarget = matchedCategories.reduce(
            (sum, c) => sum + (c.target || 0),
            0
          )

          const totalAchieved = matchedCategories.reduce(
            (sum, c) => sum + (c.achieved || 0),
            0
          )

          return {
            ...cat,
            achievedamount: totalAchieved,
            targetamount: totalTarget
          }
        })
        .sort((a, b) => {
          const aPercent =
            a.targetamount > 0 ? a.achievedamount / a.targetamount : 0
          const bPercent =
            b.targetamount > 0 ? b.achievedamount / b.targetamount : 0
          return bPercent - aPercent
        })
      console.log(updatedCategories)

      setcategorylist(updatedCategories)
    } else {
      setTargetData([])
      setcategorylist([])
    }
  }, [data, user, parenttargetData, setselectedPeriod])

  const handlepasswordChange = async (payload) => {
    try {
      const updatepassword = await api.put("/auth/updatepassword", payload)

      if (updatepassword.status === 200) {
        toast.success(updatepassword.data.message)
      } else {
        toast.error("Something went wrong")
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update password")
      throw error
    }
  }

  const toggleSidebar = () => {
    if (!isMobile) {
      setSidebarOpen((prev) => !prev)
    }
  }
  const handleMoreClick = (categoryid, categoryName) => {
console.log(categoryName)
    console.log(categoryid)
    console.log("hhh")
 const filteredList = branchProduct
        .filter(
          (item) =>
            item.selected?.some(
              (selectedItem) =>
                String(selectedItem.category_id) ===
                String(categoryid)
            ) || String(item.category_id) === String(categoryid)
        )
        .map((item) => item.productName || item.serviceName)
      setproductList(filteredList)
    setselectedCategory({
      Id: categoryid,
      categoryName
    })
    setcategoryId(categoryid)
    onperformanceModalClick()
  }
  const logout = async () => {
    try {
      console.log("hhh")
      const res = await api.post("/auth/logout")
      if (
        res.status === 200 &&
        res.data?.message === "Logged out successfully"
      ) {
        localStorage.removeItem("authToken")
        localStorage.removeItem("user")
        localStorage.removeItem("timer")
        localStorage.removeItem("wish")
        toast.success("Logout successfully")
        navigate("/")
      } else {
        toast.error("Logout failed on server")
      }
    } catch (err) {
      console.error(err)
      toast.error("Logout failed, please try again")
    }
  }
  const handleBranchChange = (branch) => {
    try {
      console.log(branch)

      // setselectedBranch(branch);

      setLocalStorageItem("selectedBranch", branch)

      console.log("bbbb")

      // console.log("dispatch", dispatch);
      console.log("selectedBranch action", selectedBranch)

      dispatch(setsliceselectedBranch(branch))

      console.log("vvvv")
    } catch (err) {
      console.error("Dispatch error:", err)
    }
  }

  return (
    //     <>
    //       <div
    //         className={`${
    //           isMobile
    //             ? `fixed left-0 top-0 z-40 h-screen ${
    //                 sidebarOpen ? "" : "pointer-events-none"
    //               }`
    //             : "relative h-full"
    //         }`}
    //       >
    //         <div
    //           className={`h-full transition-transform duration-300 ease-in-out ${
    //             isMobile
    //               ? sidebarOpen
    //                 ? "translate-x-0 pointer-events-auto"
    //                 : "-translate-x-full pointer-events-none"
    //               : "translate-x-0"
    //           }`}
    //         >
    //           <div
    //             className={`h-full ${
    //               isMobile ? "w-[74vw] max-w-[280px] bg-white shadow-2xl" : "w-auto"
    //             }`}
    //           >
    //             {targetData && (
    //               <Sidebar
    //                 handleMoreClick={handleMoreClick}
    //                 onpasswordClick={onpasswordClick}
    //                 onperformanceModalClick={onperformanceModalClick}
    //                 onLogoutClick={logout}
    // selectedYear={selectedYear}
    // setSelectedYear={setSelectedYear}
    //                 targetData={targetData}
    //                 onselectedPeriodChange={onselectedPeriodChange}
    //                 onavataropenClick={onavataropenClick}
    //                 achievedPoints={achievedPoints}
    //                 sidebarOpen={sidebarOpen}
    //                 toggleSidebar={toggleSidebar}
    //                 user={user}
    //                 selectedBranch={selectedBranch}
    //                 setselectedBranch={handleBranchChange}
    //                 branchOptions={branchOptions}
    //                 categorylist={categorylist}
    //                 targetLoading={targetLoading}
    //                 BranchSelect={BranchSelect}
    //                 SkeletonTable={SkeletonTable}
    //                 setAvatarOpen={setAvatarOpen}
    //                 onPasswordChange={handlepasswordChange}
    //                 isMobile={isMobile}
    //               />
    //             )}
    //           </div>
    //         </div>
    //       </div>

    //       {isMobile && sidebarOpen && (
    //         <button
    //           type="button"
    //           aria-label="Close sidebar overlay"
    //           onClick={() => setSidebarOpen(false)}
    //           className="fixed inset-0 z-30 bg-black/40"
    //         />
    //       )}
    //     </>

    <>
      <div
        className={`${
          isMobile
            ? `fixed left-0 top-0 z-40 h-screen ${
                sidebarOpen ? "" : "pointer-events-none"
              }`
            : "relative h-full"
        }`}
      >
        <div
          className={`h-full transition-transform duration-300 ease-in-out ${
            isMobile
              ? sidebarOpen
                ? "translate-x-0 pointer-events-auto"
                : "-translate-x-full pointer-events-none"
              : "translate-x-0"
          }`}
        >
          <div
            className={`h-full ${
              isMobile ? "w-[74vw] max-w-[320px]" : "w-auto"
            }`}
          >
            {targetData && (
              <Sidebar
                handleMoreClick={handleMoreClick}
                onpasswordClick={onpasswordClick}
                onperformanceModalClick={onperformanceModalClick}
                onLogoutClick={logout}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                targetData={targetData}
                onselectedPeriodChange={onselectedPeriodChange}
                onavataropenClick={onavataropenClick}
                achievedPoints={achievedPoints}
                sidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                user={user}
                selectedBranch={selectedBranch}
                setselectedBranch={handleBranchChange}
                branchOptions={branchOptions}
                categorylist={categorylist}
                targetLoading={targetLoading}
                BranchSelect={BranchSelect}
                SkeletonTable={SkeletonTable}
                setAvatarOpen={setAvatarOpen}
                onPasswordChange={handlepasswordChange}
                isMobile={isMobile}
              />
            )}
          </div>
        </div>
      </div>

      {isMobile && sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/35 backdrop-blur-[2px]"
        />
      )}
    </>
  )
}

export default StaticSidebar
