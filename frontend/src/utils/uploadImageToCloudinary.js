import { toast } from "react-toastify"

const upload_preset = import.meta.env.VITE_UPLOAD_PRESET
const cloud_name = import.meta.env.VITE_CLOUD_NAME
const api_key = import.meta.env.VITE_API_KEY

const uploadImageToCloudinary = async (file) => {
  try {
    if (
      !file.type.includes("image/jpeg") &&
      !file.type.includes("image/png") &&
      !file.type.includes("image/jpg")
    ) {
      console.error("Only JPEG, JPG, and PNG images are allowed.")
      toast.error("Only JPEG, JPG, and PNG images are allowed.")
      return {
        status: 400,
        message: "Only JPEG, JPG, and PNG images are allowed."
      } // Return error response
    }

    const uploadData = new FormData()
    uploadData.append("file", file)
    uploadData.append("upload_preset", upload_preset)

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
      {
        method: "POST",
        body: uploadData
      }
    )

    console.log(res)

    if (!res.ok) {
      // Handle server errors
      const errorData = await res.json()
      console.error("Upload error:", errorData)
      return { status: res.status, message: errorData.message }
    }

    const data = await res.json()
    console.log(data)
    return data
  } catch (error) {
    console.error("Error uploading image:", error)
    return { status: 500, message: "Internal server error" }
  }
}

export default uploadImageToCloudinary
