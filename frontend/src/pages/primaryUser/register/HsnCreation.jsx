import { useEffect, useState } from "react"
import UseFetch from "../../../hooks/useFetch"
import HsnOnValue from "../../../components/TaxRelated/HsnOnValue"
import HsnOnItem from "../../../components/TaxRelated/HsnOnItem"
import api from "../../../api/api"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
function HsnCreation() {
  const navigate = useNavigate()
  //state used to store initial data
  const [formData, setFormData] = useState({
    hsnSac: "",
    description: "",
    onValue: {},
    onItem: []
  })
  const [onValue, setOnValue] = useState(true)
  const [companies, setCompanies] = useState([])
  const [branches, setBranches] = useState([])
  const [onItemRate, setOnItemRate] = useState(false)

  // object used to store error
  const errors = {}
  const userData = localStorage.getItem("user")
  const user = JSON.parse(userData)
  
  // concept used to initialize the value to corresponding form fields
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // function used to handle checkbox
  const handleCheckboxChange = () => {
    setOnItemRate(!onItemRate)
    setOnValue(!onValue) // The opposite of onItemRate
  }

  const handleOnValue = (data) => {
    setFormData((prev) => ({
      ...prev,
      onValue: data
    }))
  }

  const handleOnItem = (data) => {
    setFormData((prev) => ({
      ...prev,
      onItem: data
    }))
  }
  // function used to handle submit
  const handleSubmit = async () => {
    if (formData.onValue.taxabilityType == "" && formData.onItem.length === 0) {
      return toast.error("Please select either On Value or On Item")
    }
    if (
      formData.onValue.taxabilityType !== "" &&
      formData.onItem.length !== 0
    ) {
      return toast.error("Please select  On Value or On Item")
    }
    try {
      const response = await api.post("/inventory/hsnCreation?companyId", {
        hsnData: formData
      })
      toast.success("Hsn created successfully:")
      navigate("/admin/masters/inventory/hsnlist")
    } catch (error) {
      console.error("Error creating company:", error)
    }
  }

  return (
    <div className="container items-center p-8  bg-gray-100 ">
      <div className=" bg-white w-auto p-8 shadow-xl">
        <div className="flex justify-end">
          <button
            className="bg-blue-500 hover:bg-blue-700  text-white font-bold py-2 px-4 rounded"
            onClick={handleSubmit}
          >
            Create
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
              name="hsnSac" // Corrected name to match state key
              value={formData.hsnSac}
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
              name="description" // Corrected name to match state key
              value={formData.description}
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
                checked={onItemRate}
                onClick={handleCheckboxChange}
              />
              <span className="ml-4 text-gray-700 uppercase">
                {" "}
                On Item Rate
              </span>
            </label>
          </div>
          <div>
            {onValue && <HsnOnValue handleOnValue={handleOnValue} />}
            {onItemRate && <HsnOnItem handleOnItem={handleOnItem} />}
          </div>
          <div>hiii</div>
        </div>
      </div>
    </div>
  )
}

export default HsnCreation
