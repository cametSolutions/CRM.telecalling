import React, { useEffect, useState } from "react"
import BranchListform from "../../../components/primaryUser/BranchListform"
import UseFetch from "../../../hooks/useFetch"
import toast from "react-hot-toast"
function BranchList() {
  const [branches, setBranch] = useState([])
  const { data: branchData, loading, error } = UseFetch("/branch/getBranch")
  console.log("branchddata", branchData)

  // useEffect(() => {
  //   if (branchData) {
  //     // Set the data to the state when it is fetched
  //     setBranch(branchData)
  //   }
  // }, [branchData])

  // useEffect(() => {
  //   if (error) {
  //     if (error.response) {
  //       toast.error(error.response.data.message)
  //     } else {
  //       toast.error("Something went wrong!")
  //     }
  //   }
  // }, [error])

  return (
    <div>
      <BranchListform branchlist={branchData} />
    </div>
  )
}

export default BranchList
