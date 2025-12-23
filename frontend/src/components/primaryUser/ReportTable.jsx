// import React from "react";

// export default function ReportTable({ headers, reportName, data }) {
//   return (
//     <div>
//       <div class="max-w-7xl mx-auto">
//         <h2 class="text-2xl font-bold text-gray-900 mb-6">{reportName}</h2>

//         <div class="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
//           <div class="table-container overflow-auto">
//             <table class="w-full table-auto">
//               <thead>
//                 <tr>
//                   {headers.map((header, idx) => (
//                     <th
//                       key={idx}
//                       className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider sticky top-0 z-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm"
//                     >
//                       {header}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody class="divide-y divide-gray-200">
//                 {data.map((row, rowIdx) => (
//                   <tr
//                     key={rowIdx}
//                     className="hover:bg-blue-50 transition-colors"
//                   >
//                     {Object.values(row).map((cell, cellIdx) => (
//                       <td
//                         key={cellIdx}
//                         className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
//                       >
//                         {cell}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React from "react";

export default function ReportTable({ headers, reportName, data }) {
  return (
    <div className="h-full overflow-hidden flex flex-col">
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">{reportName}</h2>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto">
          <table className="w-full">
            <thead>
              <tr>
                {headers.map((header, idx) => (
                  <th
                    key={idx}
                    className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider sticky top-0 z-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={headers.length}
                    className="px-6 py-12 text-center text-gray-500 text-sm"
                  >
                    No data available for selected range
                  </td>
                </tr>
              ) : (
                data.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    {Object.values(row).map((cell, cellIdx) => (
                      <td
                        key={cellIdx}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-t border-gray-100"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
