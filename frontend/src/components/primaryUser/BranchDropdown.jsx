import { useState, useEffect } from "react"

export default function BranchDropdown({ branches, onBranchChange,branchSelected }) {
  const [selectedBranch, setSelectedBranch] = useState(null)

  // Set the first branch as default when component mounts
  useEffect(() => {
    if (branches?.length > 0) {

      setSelectedBranch(branchSelected)
      onBranchChange(branchSelected) // notify parent
    }
  }, [branches, onBranchChange])

  const handleChange = (e) => {
    const id = e.target.value

    setSelectedBranch(id)
    onBranchChange(id) // notify parent
  }

  return (
    <select
      value={selectedBranch}
      onChange={(e) => handleChange(e)}
      className="w-40 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-700 bg-white"
    >
      {branches?.map((branch) => (
        <option
          key={branch.id}
          value={branch.id}
        >
          {branch.branchName}
        </option>
      ))}
    </select>
  )
}
