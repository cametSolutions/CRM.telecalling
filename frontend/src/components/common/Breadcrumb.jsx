// import React from "react";
// import { Link } from "react-router-dom";

// const Breadcrumb = ({ items = [] }) => {
//   return (
//     <div className="flex items-center text-sm text-gray-600 mb-4">
//       {items.map((item, index) => (
//         <React.Fragment key={index}>
//           {index > 0 && (
//             <span className="mx-2 text-gray-400">/</span>
//           )}

//           {index === items.length - 1 ? (
//             <span className="font-semibold text-gray-800">
//               {item.label}
//             </span>
//           ) : (
//             <Link
//               to={item.path}
//               state={item.state}
//               className="hover:text-blue-600"
//             >
//               {item.label}
//             </Link>
//           )}
//         </React.Fragment>
//       ))}
//     </div>
//   );
// };

// export default Breadcrumb;

import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const Breadcrumb = ({ items = [] }) => {
console.log(items)
  return (
    <nav className="flex items-center flex-wrap gap-1 text-sm m-3 mb-0">
      <div className="flex items-center bg-white shadow-sm border rounded-lg px-1 py-1">
        <Home size={16} className="text-blue-600" />

        {items.map((item, index) => (
          <React.Fragment key={index}>
            <ChevronRight
              size={16}
              className="mx-1 text-gray-400"
            />

            {index === items.length - 1|| !item.path ? (
              <span className="font-semibold text-blue-700">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                state={item.state}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

export default Breadcrumb;