import Swal from "sweetalert2"
import { MdDelete } from "react-icons/md"

function DeleteAlert({ onDelete, Id, category }) {
  const handleDelete = async () => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6", // Button color during confirmation
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    })

    if (confirmResult.isConfirmed) {
      const success = await onDelete(Id, category)
      if (success) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
          confirmButtonColor: "#3085d6" // Add the button color here too
        })
      } else {
        Swal.fire({
          title: "Failed!",
          text: "Something went wrong. File was not deleted.",
          icon: "error",
          confirmButtonColor: "#d33"
        })
      }
    }
  }

  return (
    <button className="hover:text-red-500" onClick={handleDelete}>
      <MdDelete size={18} />
    </button>
  )
}

export default DeleteAlert
