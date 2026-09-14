// SkeletonTable.jsx
const SkeletonTable = ({ rows = 5, columns = 4 }) => {
  const cols = Array.from({ length: columns })
  const rws = Array.from({ length: rows })

  return (
    <div className="w-full h-full bg-blue-50 flex flex-col">
      <div className="px-4 md:px-6 py-3">
        <div className="h-5 w-40 bg-gray-200 rounded-md animate-pulse" />
      </div>

      <div className="flex-1 px-3 md:px-6 pb-4">
        <div className="h-full bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          {/* Header skeleton */}
          <div className="border-b border-gray-100 bg-gray-50 px-4 md:px-6 py-2.5">
            <div className="flex gap-3">
              {cols.map((_, i) => (
                <div
                  key={i}
                  className="h-4 flex-1 bg-gray-200 rounded-md animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Rows skeleton */}
          <div className="divide-y divide-gray-100">
            {rws.map((_, r) => (
              <div
                key={r}
                className="px-4 md:px-6 py-3 flex gap-3 items-center"
              >
                {cols.map((_, c) => (
                  <div
                    key={c}
                    className="h-4 flex-1 bg-gray-200 rounded-md animate-pulse"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonTable
