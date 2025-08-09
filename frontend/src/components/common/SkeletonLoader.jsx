
const TableSkeletonLoader = ({ 
  rows = 5, 
  showHeader = true, 
  showStaffHeader = true,
  staffCount = 2 
}) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Header Skeleton */}
        {/* <div className="bg-white/80 backdrop-blur-lg border border-white/20 shadow-2xl px-8 py-6 rounded-2xl mb-6 animate-pulse">
          <div className="text-center">
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-80 mx-auto mb-2"></div>
            <div className="w-24 h-1 bg-gradient-to-r from-gray-200 to-gray-300 mx-auto rounded-full"></div>
          </div>
        </div> */}

        {/* Generate multiple staff sections */}
        {[...Array(staffCount)].map((_, staffIndex) => (
          <div key={staffIndex} className="mb-8">
            <div className="bg-white/90 backdrop-blur-sm border border-white/30 shadow-xl rounded-2xl overflow-hidden">
              
              {/* Staff Header Skeleton */}
              {showStaffHeader && (
                <div className="bg-gradient-to-r from-gray-300 to-gray-400 px-6 py-5 relative overflow-hidden animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/30 rounded-full"></div>
                      <div className="h-6 bg-white/40 rounded w-32"></div>
                    </div>
                    <div className="bg-white/30 px-4 py-2 rounded-full">
                      <div className="h-4 bg-white/40 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Table Skeleton */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  
                  {/* Table Header Skeleton */}
                  {showHeader && (
                    <thead className="bg-gradient-to-r from-slate-100 to-slate-200">
                      <tr className="border-b-2 border-blue-200">
                        {['LEAD ID', 'CLIENT NAME', 'LEAD DATE', 'DUE DATE', 'RE.DAYS', 'P.AMOUNT', 'B.AMOUNT'].map((header, index) => (
                          <th key={index} className="px-6 py-4">
                            <div className="h-4 bg-gray-300 rounded animate-pulse" style={{
                              width: `${60 + (index * 10)}px`
                            }}></div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  
                  {/* Table Body Skeleton */}
                  <tbody className="divide-y divide-gray-100">
                    {[...Array(rows)].map((_, rowIndex) => (
                      <tr 
                        key={rowIndex} 
                        className={`${rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}
                      >
                        
                        {/* Lead ID Column */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3 animate-pulse">
                            <div className="w-3 h-3 bg-green-200 rounded-full"></div>
                            <div className="h-8 bg-emerald-100 rounded-lg w-24 border border-emerald-200"></div>
                          </div>
                        </td>
                        
                        {/* Client Name Column */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3 animate-pulse">
                            <div className="w-8 h-8 bg-blue-200 rounded-full"></div>
                            <div className="h-8 bg-blue-100 rounded-lg border border-blue-200" style={{
                              width: `${120 + (rowIndex * 20)}px`
                            }}></div>
                          </div>
                        </td>
                        
                        {/* Lead Date Column */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2 animate-pulse">
                            <div className="w-4 h-4 bg-red-200 rounded"></div>
                            <div className="h-8 bg-red-100 rounded-lg w-20 border border-red-200"></div>
                          </div>
                        </td>
                        
                        {/* Due Date Column */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2 animate-pulse">
                            <div className="w-4 h-4 bg-orange-200 rounded-full"></div>
                            <div className="h-8 bg-orange-100 rounded-lg w-20 border border-orange-200"></div>
                          </div>
                        </td>
                        
                        {/* Remaining Days Column */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2 animate-pulse">
                            <div className="w-3 h-3 bg-yellow-200 rounded-full"></div>
                            <div className="h-8 bg-yellow-100 rounded-lg w-16 border border-yellow-200"></div>
                          </div>
                        </td>
                        
                        {/* Pending Amount Column */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2 animate-pulse">
                            <div className="w-4 h-4 bg-purple-200 rounded"></div>
                            <div className="h-8 bg-purple-100 rounded-lg w-18 border border-purple-200"></div>
                          </div>
                        </td>
                        
                        {/* Billed Amount Column */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2 animate-pulse">
                            <div className="w-4 h-4 bg-green-200 rounded"></div>
                            <div className="h-8 bg-green-100 rounded-lg w-18 border border-green-200"></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Footer Skeleton */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-100 px-6 py-4 border-t border-gray-200">
                <div className="flex justify-between items-center animate-pulse">
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                  <div className="flex space-x-4">
                    <div className="h-6 bg-blue-200 rounded-full w-16"></div>
                    <div className="h-6 bg-green-200 rounded-full w-20"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Loading Indicator */}
        <div className="text-center py-8">
          <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/30">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-gray-600 font-medium">Loading data...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Advanced Skeleton with shimmer effect
const ShimmerTableSkeleton = ({ rows = 5, showHeader = true }) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Enhanced Shimmer Effect */}
        <style jsx>{`
          @keyframes shimmer {
            0% {
              background-position: -468px 0;
            }
            100% {
              background-position: 468px 0;
            }
          }
          .shimmer {
            animation: shimmer 2s infinite linear;
            background: linear-gradient(to right, #eff6ff 4%, #dbeafe 25%, #eff6ff 36%);
            background-size: 1000px 100%;
          }
        `}</style>
        
        {/* Header with Shimmer */}
        <div className="bg-white/90 backdrop-blur-lg shadow-2xl px-8 py-6 rounded-2xl mb-6">
          <div className="text-center">
            <div className="h-8 shimmer rounded-lg w-80 mx-auto mb-2"></div>
            <div className="w-24 h-1 shimmer mx-auto rounded-full"></div>
          </div>
        </div>

        {/* Table with Enhanced Shimmer */}
        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-200 to-blue-300 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 shimmer rounded-full"></div>
                <div className="h-6 shimmer rounded w-32"></div>
              </div>
              <div className="shimmer px-4 py-2 rounded-full w-20 h-8"></div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              {showHeader && (
                <thead className="bg-gradient-to-r from-slate-100 to-slate-200">
                  <tr>
                    {[80, 150, 100, 100, 80, 90, 90].map((width, index) => (
                      <th key={index} className="px-6 py-4">
                        <div className={`h-4 shimmer rounded`} style={{width: `${width}px`}}></div>
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody className="divide-y divide-gray-100">
                {[...Array(rows)].map((_, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}>
                    {[
                      { width: 90, hasIcon: true, color: 'emerald' },
                      { width: 140 + (rowIndex * 10), hasIcon: true, color: 'blue' },
                      { width: 80, hasIcon: true, color: 'red' },
                      { width: 80, hasIcon: true, color: 'orange' },
                      { width: 70, hasIcon: true, color: 'yellow' },
                      { width: 75, hasIcon: true, color: 'purple' },
                      { width: 75, hasIcon: true, color: 'green' }
                    ].map((col, colIndex) => (
                      <td key={colIndex} className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {col.hasIcon && (
                            <div className={`w-4 h-4 shimmer rounded ${colIndex === 0 || colIndex === 4 ? 'rounded-full' : ''}`}></div>
                          )}
                          <div 
                            className={`h-8 shimmer rounded-lg border`}
                            style={{width: `${col.width}px`}}
                          ></div>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-100 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="h-4 shimmer rounded w-24"></div>
              <div className="flex space-x-4">
                <div className="h-6 shimmer rounded-full w-16"></div>
                <div className="h-6 shimmer rounded-full w-20"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center py-8">
          <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-gray-600 font-medium">Loading your data...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export both versions
export default TableSkeletonLoader;
export { ShimmerTableSkeleton };