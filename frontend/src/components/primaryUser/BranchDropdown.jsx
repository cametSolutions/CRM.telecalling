import { useState, useEffect, useRef } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function BranchDropdown({
  branches,
  onBranchChange,
  branchSelected
}) {
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Set the first branch as default when component mounts
  useEffect(() => {
    if (branches?.length > 0) {
console.log(branchSelected)
      setSelectedBranch(branchSelected)
      // onBranchChange(branchSelected)
    }
  }, [branches, onBranchChange, branchSelected])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleOptionClick = (branchId, branchName) => {
    console.log(branchName)
    console.log(branchId)
    setSelectedBranch(branchId)
    onBranchChange(branchId, branchName)
    setIsOpen(false)
  }

  const getSelectedBranchName = () => {
console.log(selectedBranch)
    if (selectedBranch === "All") return "All Branches"
    const branch = branches?.find((b) => b.id === selectedBranch)
    return branch?.branchName
  }

  console.log(branches)
  return (
    <div className="relative min-w-48" ref={dropdownRef}>
      {/* Dropdown Button */}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-1 text-left bg-white border rounded-lg shadow-sm
          flex items-center justify-between
          transition-all duration-200 ease-in-out
          ${
            isOpen
              ? "border-blue-500 ring-2 ring-blue-100 shadow-md"
              : "border-gray-300 hover:border-gray-400"
          }
          focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100
        `}
      >
        <span className="text-gray-700 font-medium truncate">
          {getSelectedBranchName()}
        </span>
        <span
          className={`transition-transform duration-200 text-gray-500 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <ChevronDown size={20} />
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className=" absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {/* All option (if multiple branches) */}
          {branches?.length > 1 && (
            <div
              onClick={() => handleOptionClick("All")}
              className={`
                px-4 py-3 cursor-pointer transition-colors duration-150
                flex items-center justify-between
                ${
                  selectedBranch === "All"
                    ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                    : "hover:bg-gray-50 text-gray-700"
                }
              `}
            >
              <span className="font-medium">All Branches</span>
              {selectedBranch === "All" && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
          )}

          {/* Branch options */}
          {branches?.map((branch, index) => (
            <div
              key={branch.id}
              onClick={() => handleOptionClick(branch.id, branch.branchName)}
              className={`
                px-4 py-3 cursor-pointer transition-colors duration-150
                flex items-center justify-between
                ${
                  selectedBranch === branch.id
                    ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                    : "hover:bg-gray-50 text-gray-700"
                }
                ${
                  index !== branches.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }
              `}
            >
              <div className="flex flex-col">
                <span className="font-medium">{branch.branchName}</span>
                {/* <span className="text-sm text-gray-500">ID: {branch.id}</span> */}
              </div>
              {selectedBranch === branch.id && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
