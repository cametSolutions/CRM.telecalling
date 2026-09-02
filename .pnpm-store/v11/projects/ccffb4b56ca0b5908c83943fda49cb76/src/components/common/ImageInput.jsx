import  { useEffect, useState } from "react"
import uploadImageToCloudinary from "../../utils/uploadImageToCloudinary.js"

function ImageInput({ onSelect, prevUrl, tag }) {
  const [signature, setSignature] = useState("")

  // Set initial signature state if prevUrl is provided
  useEffect(() => {
    if (prevUrl) {
      setSignature(prevUrl)
    }
  }, [prevUrl])

  const handleFileInputChange = async (e) => {
    const files = e.target.files
    if (files.length > 1) {
      const uploadFiles = []
      for (const file of files) {
        const data = await uploadImageToCloudinary(file)
        uploadFiles.push(data.secure_url)
      }
      onSelect(uploadFiles)
    } else if (files.length === 1) {
      const data = await uploadImageToCloudinary(files[0]) // Access the first file
      onSelect(data.secure_url)
    }
  }

  return (
    <div className="mt-1">
      <label htmlFor={tag} className="block text-sm font-medium text-gray-700">
        {tag}
      </label>
      <input
        type="file"
        name={tag}
        multiple
        onChange={handleFileInputChange}
        // className="w-full mt-5  block rounded-xl shadow-sm py-3 sm:text-sm outline-none"
        className="block mt-1 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {signature && (
        <div>
          <img
            src={signature}
            alt="Patient Signature"
            className="mt-4 w-34 h-14"
          />
        </div>
      )}
    </div>
  )
}

export default ImageInput
