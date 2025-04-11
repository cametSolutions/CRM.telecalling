import React from "react"

const PopUp = ({ isOpen, onClose, message }) => {
  console.log(isOpen)

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-lg font-semibold">Warning</h2>
        <p className="text-gray-600">{message}</p>
        <button
          onClick={
            () => onClose()
            // handleWhatsapp(report)
          }
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
        >
          OK
        </button>
      </div>
    </div>
  )
}

export default PopUp
