
import React from "react"
import { FaEdit } from "react-icons/fa"

function Edit({ onEdit, Id }) {
  return (
    <button
      className="hover:text-blue-500"
      onClick={() => onEdit(Id)} // Pass the ID when the button is clicked
    >
      <FaEdit size={18} />
    </button>
  )
}

export default Edit
