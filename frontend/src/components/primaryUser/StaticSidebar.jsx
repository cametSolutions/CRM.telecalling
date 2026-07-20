// import React from "react"
// import UseFetch from "../../hooks/useFetch"
// import { useEffect, useState } from "react"
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
// import { useFetcher } from "react-router-dom"
// export const StaticSidebar = ({
//   selectedCompanyBranch,
//   setselectedPeriod,
//   handleMoreClick,
//   setselectedCompanyBranch,
//   parenttargetData,
//   parentyear,
//   parentperiodmode
// }) => {
// console.log("hhhh")
//   console.log(parentperiodmode)
//   console.log(parentyear)
//   console.log(selectedCompanyBranch)
//   const [categorylist, setcategorylist] = useState([])
//   const [avatarOpen, setAvatarOpen] = useState(false)
//   const [user, setUser] = useState(null)
//   const now = new Date()
//   // const [selectedPeriod, setselectedPeriod] = useState("")
//   const [selectedUserName, setselecteduserName] = useState(null)
//   const [selectedBranch, setselectedBranch] = useState(null)
//   console.log(selectedCompanyBranch)
//   console.log(selectedBranch)
//   const [periodMode, setperiodMode] = useState(parentperiodmode)
//   console.log(parentperiodmode)
//   console.log(periodMode)
//   const [sidebarOpen, setSidebarOpen] = useState(true)
//   console.log(sidebarOpen)
//   const [branchOptions, setbranchOptions] = useState([])
//   const [selectedMonth, setSelectedMonth] = useState(
//     String(now.getMonth() + 1).padStart(2, "0")
//   )
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
//   console.log(branchlist)
//   console.log(selectedYear)
//   console.log(periodMode)
//   console.log(selectedBranch)
//   console.log(selectedMonth)
//   console.log(selectedYear)
//   console.log(periodMode)
//   console.log(data)
//   useEffect(() => {
//     setperiodMode(parentperiodmode)
//   }, [parentperiodmode])
//   useEffect(() => {
//     setSelectedYear(parentyear)
//   }, [parentyear])
//   useEffect(() => {
//     if (data?.userWiseResults && data?.userWiseResults.length) {
//       parenttargetData(data)
//       setselectedPeriod(data?.selectedPeriodName)
//       const uniqueCategories = [
//         ...new Map(
//           data?.userWiseResults
//             .flatMap((user) => user.categories || [])
//             .map((category) => [
//               category.categoryId,
//               {
//                 categoryId: category.categoryId,
//                 categoryName: category.categoryName
//               }
//             ])
//         ).values()
//       ]
//       const selectedUser = data?.userWiseResults.find(
//         (item) => item.userId === user._id
//       )
//       setloggeduserTarget(selectedUser)
//       setachievedPoints(selectedUser?.incentive)
//       console.log(uniqueCategories)
//       console.log(data?.userWiseResults)
//       const updatedCategories = uniqueCategories.map((cat) => {
//         // Get ALL matching categories (for different months)
//         // const matchedCategories =
//         //   data?.userWiseResults?.categories.filter(
//         //     (c) => c.categoryId === cat.categoryId
//         //   ) || []
//         const matchedCategories =
//           data?.userWiseResults
//             ?.flatMap((user) => user.categories || [])
//             .filter((c) => c.categoryId === cat.categoryId) || []

//         // Sum up all targets and achieved amounts
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
//       console.log(data?.userWiseResults)
//       console.log(updatedCategories)
//       setcategorylist(updatedCategories)
//     }
//   }, [data])
//   useEffect(() => {
//     if (selectedCompanyBranch) {
//       setselectedBranch(selectedCompanyBranch)
//     }
//   }, [selectedCompanyBranch])
//   console.log(data)
//   useEffect(() => {
//     if (!branchlist) return
//     console.log(branchlist)
//     const storedUser = getLocalStorageItem("user")
//     if (storedUser) {
//       setUser(storedUser)
//       setselecteduserName(storedUser.name)
//       //   setselectedBranch(storedUser.selected[0].branch_id)
//       console.log(storedUser)
//       setbranchOptions((prev) => [
//         ...prev,
//         ...storedUser.selected.map((branch) => ({
//           id: branch.branch_id,
//           label: branch.branchName
//         }))
//       ])

//       //  setbranchOptions((prev) => [
//       //         ...prev,
//       //         ...storedUser.selected.map((branch) => ({
//       //           id: branch.branch_id,
//       //           label: branch.branchName
//       //         }))
//       //       ])
//     }
//   }, [branchlist])
//   const handlepasswordChange = async (payload) => {
//     console.log(payload)

//     const updatepassword = await api.put("/auth/updatepassword", payload)
//     console.log(updatepassword)
//     if (updatepassword.status === 200) {
//       console.log("hh")
//       toast.success(updatepassword.data.message)
//     } else {
//       toast.error("Something went wrong")
//       console.log("noee")
//     }
//   }
//   console.log(branchOptions)
//   console.log("b")
//   const toggleSidebar = () => setSidebarOpen((prev) => !prev)
//   return (
//     <div>
//       <Sidebar
//         handleMoreClick={handleMoreClick}
//         achievedPoints={achievedPoints}
//         sidebarOpen={sidebarOpen}
//         toggleSidebar={toggleSidebar}
//         user={user}
//         selectedBranch={selectedBranch}
//         setselectedParentBranch={setselectedCompanyBranch}
//         setselectedBranch={setselectedBranch}
//         branchOptions={branchOptions}
//         categorylist={categorylist}
//         targetLoading={targetLoading}
//         BranchSelect={BranchSelect}
//         SkeletonTable={SkeletonTable}
//         setAvatarOpen={setAvatarOpen}
//         onPasswordChange={handlepasswordChange}
//       />
//     </div>
//   )
// }

import React, { useEffect, useMemo, useState } from "react"
import UseFetch from "../../hooks/useFetch"
import { BranchSelect } from "./BranchSelect"
import {
  getLocalStorageItem,
  setLocalStorageItem
} from "../../helper/localstorage"
import AvatarEditor from "../common/AvatarEditor"
import { PerformanceModal } from "./PerformanceModal"
import api from "../../api/api"
import SkeletonTable from "../loader/SkeletonTable"
import Sidebar from "./Sidebar"
import { toast } from "react-toastify"

export const StaticSidebar = ({
  selectedCompanyBranch,
  setselectedPeriod,
  handleMoreClick,
  setselectedCompanyBranch,
  parenttargetData,
  parentyear,
  parentperiodmode
}) => {
  const now = new Date()

  const [categorylist, setcategorylist] = useState([])
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [selectedUserName, setselecteduserName] = useState(null)
  const [selectedBranch, setselectedBranch] = useState(null)
  const [periodMode, setperiodMode] = useState(parentperiodmode)
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)
  const [branchOptions, setbranchOptions] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(
    String(now.getMonth() + 1).padStart(2, "0")
  )
  const [loggedusedTarget, setloggeduserTarget] = useState([])
  const [selectedYear, setSelectedYear] = useState(parentyear)
  const [achievedPoints, setachievedPoints] = useState(0)

  const { data, loading: targetLoading } = UseFetch(
    selectedBranch &&
      selectedMonth &&
      selectedYear &&
      periodMode &&
      `/target/gettargetresult?month=${selectedMonth}&year=${selectedYear}&periodMode=${periodMode}&selectedBranch=${selectedBranch}`
  )
console.log(selectedBranch)
console.log(selectedMonth)
console.log(selectedYear)
console.log(periodMode)
console.log(data)

  const { data: branchlist } = UseFetch("/branch/getBranch")

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      setSidebarOpen(!mobile)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    setperiodMode(parentperiodmode)
  }, [parentperiodmode])

  useEffect(() => {
    setSelectedYear(parentyear)
  }, [parentyear])

  useEffect(() => {
    if (selectedCompanyBranch) {
      setselectedBranch(selectedCompanyBranch)
    }
  }, [selectedCompanyBranch])

  useEffect(() => {
    if (!branchlist) return

    const storedUser = getLocalStorageItem("user")
    if (storedUser) {
      setUser(storedUser)
      setselecteduserName(storedUser.name)

      const uniqueBranches = storedUser.selected.map((branch) => ({
        id: branch.branch_id,
        label: branch.branchName
      }))

      setbranchOptions(uniqueBranches)
    }
  }, [branchlist])

  useEffect(() => {
    if (data?.userWiseResults && data?.userWiseResults.length && user?._id) {
      parenttargetData(data)
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

      setloggeduserTarget(selectedUser || [])
      setachievedPoints(selectedUser?.incentive || 0)

      const updatedCategories = uniqueCategories.map((cat) => {
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

      setcategorylist(updatedCategories)
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
    }
  }

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev)
  }

  const handleBranchChange = (branch) => {
    setselectedBranch(branch)
    setselectedCompanyBranch(branch)

    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  return (
    <>
      <div
        className={`${
          isMobile ? "fixed left-0 top-0 z-40 h-screen" : "relative h-full"
        }`}
      >
        <div
          className={`h-full transition-transform duration-300 ease-in-out ${
            isMobile
              ? sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full"
              : "translate-x-0"
          }`}
        >
          <div
            className={`h-full ${
              isMobile
                ? "w-[85vw] max-w-[320px] bg-white shadow-2xl"
                : "w-auto"
            }`}
          >
            <Sidebar
              handleMoreClick={handleMoreClick}
              achievedPoints={achievedPoints}
              sidebarOpen={sidebarOpen}
              toggleSidebar={toggleSidebar}
              user={user}
              selectedBranch={selectedBranch}
              setselectedParentBranch={setselectedCompanyBranch}
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
          </div>
        </div>
      </div>

      {isMobile && sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40"
        />
      )}
    </>
  )
}
