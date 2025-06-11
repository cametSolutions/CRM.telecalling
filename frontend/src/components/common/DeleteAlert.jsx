import Swal from "sweetalert2"
import { MdDelete } from "react-icons/md"

function DeleteAlert({ onDelete, Id, category, branchId }) {
console.log(onDelete)
  console.log(category === undefined)
  //catergory used in leaveapplication delete
  const handleDelete = async () => {
    if (category === null || category === undefined) {
      console.log(category)
    }
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6", // Button color during confirmation
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    })
    if (category === null || category === undefined) {
      console.log(category)
    }

    if (confirmResult.isConfirmed) {
      let success
      if (category === null || category === undefined) {
        console.log("hdfdf")
        success = await onDelete(Id, branchId)
        console.log(success)
      } else {
        success = await onDelete(Id, category)
      }

      if (success) {
console.log(success)
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
