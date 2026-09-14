import { useEffect, useMemo } from "react"
import { useSelector } from "react-redux"
// import dayjs from 'dayjs';

const useSearch = ({ fullData }) => {
  const SecUser = useSelector((state) => {
    if (state.searchSlice.searchData) {
      return state.searchSlice.searchData
    }
  })


  // Memoize filtered data to avoid unnecessary recalculations
  const searchData = useMemo(() => {
    if (typeof SecUser === "string" && SecUser.trim() !== "") {
      return fullData?.filter((item) => {
        const secLower = SecUser.toString().toLowerCase()

        // Check if any item in 'selected' array has a matching 'licensenumber'
        const licenseMatch = item?.selected?.some((selection) =>
          selection?.licensenumber?.toString().toLowerCase().includes(secLower)
        )
        // Match conditions for filtering
        return (
          item?.customerName?.toString().toLowerCase().includes(secLower) ||
          licenseMatch ||
          item?.mobile?.toString().toLowerCase().includes(secLower) ||
          item?.testSample?.toLowerCase().includes(secLower)
        )
      })
    }
    return fullData // Return original data if no search query
  }, [SecUser, fullData]) // Recompute only when SecUser or fullData changes

  return searchData
}

export default useSearch
