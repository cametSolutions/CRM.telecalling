// // components/NoDataState.jsx
// import { TbDatabaseOff } from "react-icons/tb"

// const NodataAvailable= ({
//   title = "No data available",
//   message = "There is no data to display for the selected filters or date range.",
// }) => {
//   return (
//     <div className="w-full h-full flex items-center justify-center px-4 py-8">
//       <div className="max-w-md w-full bg-white rounded-xl border border-dashed border-gray-300 shadow-sm px-6 py-6 flex flex-col items-center text-center">
//         <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
//           <TbDatabaseOff className="h-6 w-6 text-blue-500" />
//         </div>

//         <h2 className="text-sm md:text-base font-semibold text-gray-800">
//           {title}
//         </h2>

//         <p className="mt-1 text-xs md:text-sm text-gray-500">
//           {message}
//         </p>
//       </div>
//     </div>
//   )
// }

// export default NodataAvailable
import { TbDatabaseOff } from "react-icons/tb"

const NoDataAvailable = ({
  title = "No Data Found",
  message = "We couldn’t find any data for the selected filters or date range.",
  actionLabel,
  onAction
}) => {
  return (
    <div className="w-full h-full flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full backdrop-blur-md bg-white/70 border border-white/40 shadow-lg rounded-2xl px-8 py-8 flex flex-col items-center text-center transition-all">

        {/* Icon */}
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 shadow-inner">
          <TbDatabaseOff className="h-7 w-7 text-blue-600" />
        </div>

        {/* Title */}
        <h2 className="text-base md:text-lg font-semibold text-gray-800">
          {title}
        </h2>

        {/* Message */}
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          {message}
        </p>

        {/* Optional Action */}
        {actionLabel && (
          <button
            onClick={onAction}
            className="mt-5 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  )
}

export default NoDataAvailable