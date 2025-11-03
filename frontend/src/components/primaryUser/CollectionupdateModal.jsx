import React, { useState, useEffect } from "react"
import { ChevronDown, X } from "lucide-react"
import { Country, State } from "country-state-city"
import Select from "react-select"
export const CollectionupdateModal = ({ data, closemodal, partnerlist }) => {
  console.log(data?.partner?._id)
  console.log(partnerlist)
  const [isdropdownOpen, setIsdropdownOpen] = useState(false)
  const [error, setError] = useState({})
  const [countryOptions, setcountryOptions] = useState([])
  const [formData, setformData] = useState({
    leadId: data.leadId,
    submissionDate: new Date()
      .toLocaleDateString("en-GB") // this gives dd/mm/yyyy
      .replace(/\//g, "-"), // change / to -,
    status: "",
    customerName: data?.customerName?.customerName,
    address: data?.customerName?.address1,
    email: data?.customerName?.email,
    mobile: data?.customerName?.mobile,
    registrationType: data?.customerName?.registrationType,
    partner: data?.partner?._id,
    country: data?.customerName?.country,
    state: data?.customerName?.state,
    city: data?.customerName?.city,
    pincode: data?.customerName?.pincode
  })
  useEffect(() => {
    setcountryOptions(
      Country.getAllCountries().map((country) => ({
        label: country.name,
        value: country.isoCode
      }))
    )
  }, [])
  console.log(formData?.mobile)
  const handleChange = (e) => {
    console.log("h")
    console.log(e)
    const { value, name } = e.target

    setformData({ ...formData, [name]: value.trim() })
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (value && !emailRegex.test(value)) {
        console.log("h")
        setError((prev) => ({
          ...prev,
          [name]: "Email id is not correct"
        }))
      } else {
        setError((prev) => ({
          ...prev,
          [name]: ""
        }))
      }
    } else if (name === "mobile") {
      // Allow only digits and length 10
      const mobileRegex = /^[6-9]\d{9}$/ // starts with 6–9 and must be exactly 10 digits
      if (!value) {
        setError((prev) => ({
          ...prev,
          [name]: "Mobile number is required"
        }))
      } else if (!/^\d+$/.test(value)) {
        setError((prev) => ({
          ...prev,
          [name]: "Mobile number must contain only digits"
        }))
      } else if (value.length < 10) {
        setError((prev) => ({
          ...prev,
          [name]: "Mobile number must be 10 digits"
        }))
      } else if (value.length > 10) {
        setError((prev) => ({
          ...prev,
          [name]: "Mobile number cannot exceed 10 digits"
        }))
      } else if (!mobileRegex.test(value)) {
        setError((prev) => ({
          ...prev,
          [name]: "Mobile number is not valid"
        }))
      } else {
        setError((prev) => ({
          ...prev,
          [name]: ""
        }))
      }
    } else {
      console.log("h")
      setError((prev) => ({
        ...prev,
        [name]: ""
      }))
    }
  }
  console.log(error)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full  max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-2 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Collection Update
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Update And Manage Collection Details
            </p>
          </div>
          <div className="text-lg font-semibol">
            <span>Lead ID :</span>

            <span className="ml-1">{formData?.leadId}</span>
          </div>

          <button
            type="button"
            onClick={() => closemodal(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-2">
            {/* Follow Up Date - Read Only */}
            <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Submission Date
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={formData.submissionDate}
                    className="w-full px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium cursor-not-allowed focus:outline-none"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Status Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Status
                </label>
                <div className="relative">
                  <select
                    // disabled={isAllocated}
                    value={formData.status}
                    onChange={(e) =>
                      setformData((prev) => ({
                        ...prev,
                        status: e.target.value
                      }))
                    }
                    onFocus={() => setIsdropdownOpen(true)}
                    onBlur={() => setIsdropdownOpen(false)}
                    className="w-full appearance-none px-4 py-1.5 pr-10 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <option value="collectionupdate">Collection Update</option>
                    <option value="varified">Varified</option>
                  </select>
                  <ChevronDown
                    className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none transition-transform duration-200 ${
                      isdropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Customer Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.customerName}
                    className="w-full px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium cursor-not-allowed focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Adress
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.address}
                    className="w-full px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Email
                </label>

                <input
                  type="text"
                  name="email"
                  value={formData?.email}
                  onChange={(e) => handleChange(e)}
                  className="w-full px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium focus:outline-none"
                />
                {error && (
                  <p className="text-red-500 text-xs mt-1">{error?.email}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Mobile
                </label>

                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={(e) => handleChange(e)}
                  className="w-full px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium  focus:outline-none"
                />
                {error && (
                  <p className="text-red-500 text-xs mt-1">{error?.mobile}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Registration Type
                </label>
                <div className="relative">
                  {/* <input
                    type="text"
                    value={formData.registrationType}
                    className="w-full px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium focus:outline-none"
                  /> */}
                  <select
                    name="registrationType"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm  focus:outline-none cursor-pointer bg-gray-50"
                  >
                    <option value="">Select RegistrationType</option>
                    <option value="unregistered">Unregistered/Consumer</option>
                    <option value="regular">Regular</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Partner
                </label>

                <select
                  name="partner"
                  value={formData?.partner}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none bg-gray-50 cursor-pointer"
                >
                  <option value="">Select Partner</option>
                  {partnerlist?.map((partnr, index) => (
                    <option key={index} value={partnr._id}>
                      {partnr.partner}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Country
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={formData.country}
                    className="w-full px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium cursor-not-allowed focus:outline-none"
                  />
                  <Select
                    options={countryOptions}
                    value={formData?.country}
                    onChange={(option) =>
                      setformData((prev) => ({
                        ...prev,
                        country: option
                      }))
                    }
                    styles={{
                      menu: (provided) => ({
                        ...provided,
                        maxHeight: "200px", // Set dropdown max height
                        overflowY: "auto" // Enable scrolling
                      }),
                      menuList: (provided) => ({
                        ...provided,
                        maxHeight: "200px", // Ensures dropdown scrolls internally
                        overflowY: "auto"
                      })
                    }}
                    menuPortalTarget={document.body} // Prevents nested scrolling issues
                    menuShouldScrollIntoView={false}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  State
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={formData.state}
                    className="w-full px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium cursor-not-allowed focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  City
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={formData.city}
                    className="w-full px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium cursor-not-allowed focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Pincode
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={formData.pincode}
                    className="w-full px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium cursor-not-allowed focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="border-2 border-green-200 rounded-xl p-5 bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Net Amount
                    </label>
                    <input
                      type="number"
                      disabled
                      //   value={formData.netAmount}
                      className="w-full px-4 py-1 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 font-semibold cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Balance Amount
                    </label>
                    <input
                      type="number"
                      disabled
                      //   value={formData.balanceAmount}
                      className="w-full px-4 py-1 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 font-semibold cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Received Amount
                    </label>
                    <input
                      type="number"
                      // value={formData.recievedAmount}
                      onChange={(e) => {
                        if (errors.recievedAmount) {
                          setErrors((prev) => ({
                            ...prev,
                            recievedAmount: ""
                          }))
                        }
                        setFormData((prev) => ({
                          ...prev,
                          recievedAmount: e.target.value
                        }))
                      }}
                      className="w-full px-4 py-1 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter received amount..."
                    />
                    {/* {errors.recievedAmount && (
                        <p className="mt-1.5 text-xs text-red-600 font-medium">
                          {errors.recievedAmount}
                        </p>
                      )} */}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-8">
              {/* Remarks */}
              <div className="w-1/2">
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Bank Remarks
                </label>
                <textarea
                  rows={4}
                  // disabled={isdemofollownotClosed}
                  name="bandkRemarks"
                  // value={formData.bankRemarks || demoData.demoDescription}
                  // onChange={handleDataChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Add Bank remarks here..."
                />
                {/* {errors.bankRemarks && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">
                  {errors.Remarks}
                </p>
              )}*/}
              </div>
              <div className="w-1/2">
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Remarks
                </label>
                <textarea
                  rows={4}
                  // disabled={isdemofollownotClosed}
                  name="Remarks"
                  // value={formData.Remarks || demoData.demoDescription}
                  // onChange={handleDataChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Add detailed remarks or notes here..."
                />
                {/* {errors.Remarks && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">
                  {errors.Remarks}
                </p>
              )}
              {demoerror.demoDescription && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">
                  {demoerror.demoDescription}
                </p>
              )} */}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-2 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={() => setshowFollowupModal(false)}
            className="px-6 py-1.5 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 hover:border-gray-400 transition-all"
          >
            Cancel
          </button>
          {/* <button className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all">
                Save Changes
              </button> */}
          {/* <button
            onClick={isAllocated ? handleDemoSubmit : handleFollowUpDateSubmit}
            className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all"
          >
            {followupDateLoader || loader ? (
              <div className="flex items-center">
                Processing
                <FaSpinner className="animate-spin h-5 w-5  text-white ml-2" />
              </div>
            ) : (
              <div>{isHaveEditchoice ? "UPDATE" : "SUBMIT"}</div>
            )}
          </button> */}
        </div>
      </div>
    </div>
  )
}
