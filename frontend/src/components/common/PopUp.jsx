// import React from "react"

// const PopUp = ({ isOpen, onClose, message,onConfirm }) => {
// console.log(isOpen)
// console.log(message)
//   if (!isOpen) return null
//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
//         <h2 className="text-lg font-semibold">Warning</h2>
//         <p className="text-gray-600">{message}</p>
//         <button
//           onClick={
//             () =>{onClose()
// onConfirm()}
            
//           }
//           className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
//         >
//           OK
//         </button>
//       </div>
//     </div>
//   )
// }

// export default PopUp
import React from "react";

const PopUp = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  title = "Warning",
  confirmText = "OK"
}) => {
  if (!isOpen) return null;

  const handleClick = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose?.();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-96 rounded-lg bg-white p-6 text-center shadow-lg">
        <h2 className="text-lg font-semibold">{title}</h2>

        <p className="mt-2 text-gray-600">{message}</p>

        <button
          onClick={handleClick}
          className="mt-4 rounded-md bg-red-500 px-4 py-2 text-white"
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
};

export default PopUp;
