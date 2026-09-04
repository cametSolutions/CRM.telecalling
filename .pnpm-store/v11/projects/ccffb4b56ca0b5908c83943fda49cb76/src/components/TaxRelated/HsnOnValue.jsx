import { useEffect, useState } from "react"

function HsnOnValue({ handleOnValue, editData }) {
  //state used to store initial data
  const [onValue, setOnValue] = useState({
    taxabilityType: "",
    igstRate: "",
    cgstRate: "",
    cgstOrigstRate: "",
    basedOnValue: "",
    basedOnQuantity: "",
  })

  //storing initial data in state at edit time
  useEffect(() => {
    if (editData) {
      setOnValue(editData)
    }
  }, [editData])

  //object used to store error

  const errors = {}

  //function used to handle data change
  const handleChange = (e) => {
    const { name, value } = e.target

    // Create an updated object
    let updatedValue = {
      ...onValue,
      [name]: value,
    }

    // Check if igstRate is being changed and update cgstRate and sgstUgstRate accordingly
    if (name === "igstRate") {
      updatedValue = {
        ...updatedValue,
        cgstRate: value / 2,
        cgstOrigstRate: value / 2,
      }
    }

    // Update the state with the new values
    setOnValue(updatedValue)

    // Pass the updated value to the callback function
    handleOnValue(updatedValue)
  }

  return (
    <>
      <div className="grid md:grid-cols-2 gap-x-14 gap-4  ">
        <div className="items-center p-4">
          <div className="flex gap-2 ">
            <label className="block text-sm font-medium text-gray-700">
              Taxability Type
            </label>
            <span className="text-meta-7"> *</span>
          </div>
          <select
            name="taxabilityType"
            className="mt-1 p-2 block w-full rounded-md shadow-md focus:outline-double"
            value={onValue.taxabilityType}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="exempt">Exempt</option>
            <option value="nilRated">Nil Rated</option>
            <option value="nonGst">Non GST</option>
            <option value="taxable">Taxable</option>
          </select>
          {errors.taxabilityType && (
            <p className="text-meta-1 text-lg">{errors.hsnSac}</p>
          )}
        </div>
        <div className="items-center p-4">
          <div className="flex gap-2">
            <label className="block text-sm font-medium text-gray-700">
              IGST Rate
            </label>
            <span className="text-meta-7"> *</span>
          </div>
          <input
            type="number"
            className="mt-1 p-2 block w-full rounded-md shadow-md focus:outline-double"
            placeholder="igstRate"
            name="igstRate" // Corrected name to match state key
            value={onValue.igstRate}
            onChange={handleChange}
            readOnly={onValue?.taxabilityType !== "taxable"}
          />
          {errors.igstRate && (
            <p className="text-meta-1 text-lg">{errors.description}</p>
          )}
        </div>
        <div className="items-center p-4">
          <div className="flex gap-2">
            <label className="block text-sm font-medium text-gray-700">
              CGST Rate
            </label>
            <span className="text-meta-7"> *</span>
          </div>
          <input
            type="number"
            className="mt-1 p-2 block w-full rounded-md shadow-md focus:outline-double"
            placeholder="cgstRate"
            name="cgstRate" // Corrected name to match state key
            value={onValue.cgstRate}
            onChange={handleChange}
            readOnly={onValue?.taxabilityType !== "taxable"}
          />
          {errors.cgstRate && (
            <p className="text-meta-1 text-lg">{errors.description}</p>
          )}
        </div>
        <div className="items-center p-4">
          <div className="flex gap-2">
            <label className="block text-sm font-medium text-gray-700">
              SGST/UTGST Rate
            </label>
            <span className="text-meta-7"> *</span>
          </div>
          <input
            type="number"
            className="mt-1 p-2 block w-full rounded-md shadow-md focus:outline-double"
            placeholder="cgstOrigstRate"
            name="cgstOrigstRate" // Corrected name to match state key
            value={onValue.cgstOrigstRate}
            onChange={handleChange}
            readOnly={onValue?.taxabilityType !== "taxable"}
          />
          {errors.cgstOrigstRate && (
            <p className="text-meta-1 text-lg">{errors.description}</p>
          )}
        </div>
      </div>
      <div className="text-center font-bold text-xl text-black-2">
        <h1 className="p-4">Cess Rate Details</h1>
      </div>
      <div className="grid md:grid-cols-2 gap-x-14 gap-4 ">
        <div className="items-center p-4">
          <div className="flex gap-2 ">
            <label className="block text-sm font-medium text-gray-700">
              Based On Value
            </label>
            <span className="text-meta-7"> *</span>
          </div>
          <input
            type="number"
            className="mt-1 p-2 block w-full rounded-md shadow-md focus:outline-double"
            placeholder="HSN & SAC"
            name="basedOnValue" // Corrected name to match state key
            value={onValue?.basedOnValue}
            onChange={handleChange}
            readOnly={onValue?.taxabilityType !== "taxable"}
          />
          {errors.basedOnValue && (
            <p className="text-meta-1 text-lg">{errors.hsnSac}</p>
          )}
        </div>
        <div className="items-center p-4">
          <div className="flex gap-2">
            <label className="block text-sm font-medium text-gray-700">
              Based On Quantity
            </label>
            <span className="text-meta-7"> *</span>
          </div>
          <input
            type="number"
            className="mt-1 p-2 block w-full rounded-md shadow-md focus:outline-double"
            placeholder="Description"
            name="basedOnQuantity" // Corrected name to match state key
            value={onValue?.basedOnQuantity}
            onChange={handleChange}
            readOnly={onValue?.taxabilityType !== "taxable"}
          />
          {errors.description && (
            <p className="text-meta-1 text-lg">{errors.description}</p>
          )}
        </div>
      </div>
    </>
  )
}

export default HsnOnValue
