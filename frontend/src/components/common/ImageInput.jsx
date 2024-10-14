import React, { useEffect, useState } from "react"
import uploadImageToCloudinary from "../../utils/uploadImageToCloudinary.js"

function ImageInput({ onSelect, prevUrl }) {
  const [signature, setSignature] = useState("")

  // Set initial signature state if prevUrl is provided
  useEffect(() => {
    if (prevUrl) {
      setSignature(prevUrl)
    }
  }, [prevUrl])

  const handleFileInputChange = async (e) => {
    const file = e.target.files[0]

    if (file) {
      const data = await uploadImageToCloudinary(file)

      onSelect(data.secure_url)
    }
  }

  return (
    <div className="mt-7">
      <input
        type="file"
        name="headerImage"
        onChange={handleFileInputChange}
        // className="w-full mt-5  block rounded-xl shadow-sm py-3 sm:text-sm outline-none"
        className="block  w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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
