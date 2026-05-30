import React, { useEffect, useState } from "react"
import BranchListform from "../../../components/primaryUser/BranchListform"
import UseFetch from "../../../hooks/useFetch"
import toast from "react-hot-toast"
function BranchList() {
  const [branches, setBranch] = useState([])
  const { data: branchData, loading, error } = UseFetch("/branch/getBranch")

  

  return (
    <div className="h-full">
      <BranchListform branchlist={branchData} />
    </div>
  )
}

export default BranchList
