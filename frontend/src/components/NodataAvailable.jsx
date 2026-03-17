// components/NoDataState.jsx
import { TbDatabaseOff } from "react-icons/tb"

const NodataAvailable= ({
  title = "No data available",
  message = "There is no data to display for the selected filters or date range.",
}) => {
  return (
    <div className="w-full h-full flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-xl border border-dashed border-gray-300 shadow-sm px-6 py-6 flex flex-col items-center text-center">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
          <TbDatabaseOff className="h-6 w-6 text-blue-500" />
        </div>

        <h2 className="text-sm md:text-base font-semibold text-gray-800">
          {title}
        </h2>

        <p className="mt-1 text-xs md:text-sm text-gray-500">
          {message}
        </p>
      </div>
    </div>
  )
}

export default NodataAvailable
