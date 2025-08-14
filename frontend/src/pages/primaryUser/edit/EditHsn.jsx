import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import api from "../../../api/api"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import HsnOnValue from "../../../components/TaxRelated/HsnOnValue"
import HsnOnItem from "../../../components/TaxRelated/HsnOnItem"

function EditHsn() {
  const navigate = useNavigate()

  // concept used to get the hsn data that is passed from HsnList
  const location = useLocation()
  const hsn = location.state?.hsnData
  const [hsnData, setHsnData] = useState(hsn)

  // state used to handle the onValue and onItem (select box)
  const [onValue, setOnValue] = useState(true)
  const [onItem, setOnItem] = useState(false)

  // object used to store error
  const errors = {}

  // concept used to initialize the value to corresponding form fields
  const handleChange = (e) => {
    const { name, value } = e.target
    setHsnData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // function used to handle checkbox
  const handleCheckboxChange = () => {
    setOnItem(!onItem)
    setOnValue(!onValue) // The opposite of onItemRate
  }

  // function used to handle data from onValue component
  const handleOnValue = (data) => {
    setHsnData((prev) => ({
      ...prev,
      onValue: data,
    }))
  }

  // function used to handle data from onItem component
  const handleOnItem = (data) => {
    setHsnData((prev) => ({
      ...prev,
      onItem: data,
    }))
  }

  // function used to edit the hsn
  const handleEdit = async (userType) => {
    try {
      const response = await api.put("/inventory/hsnEdit", {
        hsnData: hsnData,
      })
      toast.success("HSN Updated successfully:")
      navigate("/admin/masters/inventory/hsnlist")
    } catch (error) {
      console.error("Error creating branch:", error)
    }
  }
  return (
    <div className="container items-center p-8 bg-gray-100">
      {/* <Breadcrumb pageName="Edit HSN" /> */}
      <div className="bg-white w-auto p-8 shadow-xl">
        <div className="flex justify-end">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleEdit}
          >
            Update
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-x-14 gap-4  ">
          <div className="items-center pt-4">
            <div className="flex gap-2 ">
              <label className="block text-sm font-medium text-gray-700">
                HSN & SAC
              </label>
              <span className="text-meta-7"> *</span>
            </div>
            <input
              type="text"
              className="mt-1 p-2 block w-full rounded-md shadow-md focus:outline-double"
              placeholder="HSN & SAC"
              name="hsnSac"
              value={hsnData.hsnSac}
              onChange={handleChange}
            />
            {errors.hsnSac && (
              <p className="text-meta-1 text-lg">{errors.hsnSac}</p>
            )}
          </div>
          <div className="items-center pt-4">
            <div className="flex gap-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <span className="text-meta-7"> *</span>
            </div>
            <input
              type="text"
              className="mt-1 p-2 block w-full rounded-md shadow-md focus:outline-double"
              placeholder="Description"
              name="description"
              value={hsnData.description}
              onChange={handleChange}
            />
            {errors.description && (
              <p className="text-meta-1 text-lg">{errors.description}</p>
            )}
          </div>
        </div>
        <div>
          <div className="flex gap-4 justify-center p-4 text-xl font-bold text-black-2  md:m-8">
            <label>
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                name="onValue"
                checked={onValue}
                onClick={handleCheckboxChange}
              />
              <span className="ml-4 text-gray-700 uppercase">On Value</span>
            </label>
            <label>
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out "
                name="onItemRate"
                checked={onItem}
                onClick={handleCheckboxChange}
              />
              <span className="ml-4 text-gray-700 uppercase">
                {" "}
                On Item Rate
              </span>
            </label>
          </div>
          <div>
            {onValue && (
              <HsnOnValue
                handleOnValue={handleOnValue}
                editData={hsnData.onValue}
              />
            )}
            {onItem && (
              <HsnOnItem handleOnItem={handleOnItem} data={hsnData.onItem} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditHsn
