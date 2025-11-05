import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { FaSpinner } from "react-icons/fa"

import { toast } from "react-toastify"
import { Country, State } from "country-state-city"

export const CollectionupdateModal = ({
  isClosed = false,
  data,
  closemodal,
  partnerlist,
  loggedUser,

  handleCollectionUpdate,
  setishavePayment = false
}) => {
 
  const [isdropdownOpen, setIsdropdownOpen] = useState(false)
  const [error, setError] = useState({})
  const [noneAmount, setisnoneAmount] = useState(false)
  const [message, setMessage] = useState({ warning: "" })
  const [iscanupateCollection, setcanupdateCollection] = useState(false)
  const [submitloader, setsubmitloader] = useState(false)
  const [isreadytoVarify, setisreadyTovarify] = useState(false)
  const [countryOptions, setcountryOptions] = useState([])
  const [formData, setformData] = useState({
    leadDocId: data?._id,
    customerId: data?.customerName?._id,
    leadId: data.leadId,
    submissionDate: new Date()
      .toLocaleDateString("en-GB") // this gives dd/mm/yyyy
      .replace(/\//g, "-"), // change / to -,

    customerName: data?.customerName?.customerName,

    address: data?.customerName?.address1,
    email: data?.customerName?.email || data?.email,
    mobile: data?.customerName?.mobile || data?.mobile,
    registrationType: data?.customerName?.registrationType,
    partner: data?.partner?._id,
    country: data?.customerName?.country,
    state: data?.customerName?.state,
    city: data?.customerName?.city,
    pincode: data?.customerName?.pincode,
    netAmount: data?.netAmount,
    balanceAmount: data?.balanceAmount,
    remarks: "",
    bankRemarks: "",
    receivedAmount: "",
    totalPaidAmount: data?.totalPaidAmount,
    receivedBy: loggedUser?._id,
    receivedModel: loggedUser?.role === "Admin" ? "Admin" : "Staff"
  })
  useEffect(() => {
    const checkvarify = data?.balanceAmount <= 0
    if (data?.netAmount === 0) {
      setisnoneAmount(true)
    }

    if (checkvarify) {
      if (data?.paymentHistory && data?.paymentHistory.length > 0) {
        const lastrecievedBy =
          data?.paymentHistory[data.paymentHistory.length - 1]

        const matchedrecievedby = loggedUser._id === lastrecievedBy.receivedBy

        // if (!matchedrecievedby) {
        //   setMessage({
        //     warning: "You cant verified ,only last receiver can "
        //   })
        // }
      }
      ///only if the balance is 0 or may have advance payment
      setisreadyTovarify(checkvarify)
      setformData((prev) => ({
        ...prev,
        status: "verified"
      }))
    } else {
      setformData((prev) => ({
        ...prev,
        status: "collectionupdate"
      }))
    }
  }, [])
  useEffect(() => {
    setcountryOptions(
      Country.getAllCountries().map((country) => ({
        label: country.name,
        value: country.isoCode
      }))
    )
  }, [])
  const handleChange = (e) => {
    const { value, name } = e.target

    setformData({ ...formData, [name]: value.trim() })
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (value && !emailRegex.test(value)) {
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
    } else if (name === "pincode") {
      const postalCodePatterns = {
        INDIA: /^[1-9][0-9]{5}$/, // India - 6 digits
        IN: /^[1-9][0-9]{5}$/,
        USA: /^\d{5}(-\d{4})?$/, // USA - 5 or 9 digits
        CA: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, // Canada
        GB: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i, // UK
        AU: /^\d{4}$/, // Australia
        DE: /^\d{5}$/, // Germany
        FR: /^\d{5}$/, // France
        JP: /^\d{3}-?\d{4}$/, // Japan
        SG: /^\d{6}$/ // Singapore
      }
    
      if (formData.country === "" || formData.country === undefined) {
        setError((prev) => ({
          ...prev,
          pincode: "please fill country before pincode"
        }))
        return
      }
      const pattern = postalCodePatterns[formData.country.toUpperCase()]
      if (!pattern) return true
      if (!pattern.test(value)) {
        setError((prev) => ({
          ...prev,
          [name]: "Invalid pincode"
        }))
      } else {
        setError((prev) => ({
          ...prev,
          [name]: ""
        }))
      }
    } else {
      setformData((prev) => ({
        ...prev,
        [name]: value
      }))
      setError((prev) => ({
        ...prev,
        [name]: ""
      }))
    }
  }
  const handleSubmit = async () => {
    try {
      if (error.submitError) {
        setError((prev) => ({
          ...prev,
          submitError: ""
        }))
      }
      if (noneAmount) {
        setMessage((prev) => ({
          ...prev,
          noneAmount:
            "Please add netAmount or add amount on product before update collection "
        }))
        return
      }
      if (message.warning) {
      } else if (
        error &&
        Object.values(error).some(
          (val) => val !== null && val !== undefined && val !== ""
        )
      ) {
       
        return
      }
      setsubmitloader(true)

      // Clone formData fields
      const { bankRemarks, receivedAmount, ...newdata } = formData
      const fields = Object.entries(
        formData.status === "verified" ? newdata : formData
      )
      let newErrors = {}
      let isValid = true

      // Loop through all fields
      for (const [key, value] of fields) {
        if (value === "" || value === null || value === undefined) {
          newErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required`
          isValid = false
        }
      }

      // If any errors, stop submission
      if (!isValid) {
        setError(newErrors)
        setsubmitloader(false)
        return
      }
      const response = await handleCollectionUpdate(formData)
      if (response.status === 200) {
        isClosed
          ? toast.success("Lead is closed and payment updated successfully")
          : toast.success("Payment updated successfully")
        setsubmitloader(false)
        closemodal(false)
        // refreshHook()
      }
    } catch (error) {
      console.log(error.message)
      setsubmitloader(false)
      // toast.error("something went wrong")
      setError((prev) => ({
        ...prev,
        submitError: "something went wrong"
      }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full  max-h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}

        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50">
          {/* Left Section - Title & Subtitle */}
          <div className="min-w-[180px] flex-1 flex flex-col items-start">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 ">
              Collection Update
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 ">
              Update and Manage Collection Details
            </p>
          </div>

          {/* Middle Section - Lead ID */}
          <div className="flex items-center text-sm sm:text-lg font-semibold text-gray-700 whitespace-nowrap">
            <span>Lead ID :</span>
            <span className="ml-1 break-all">{formData?.leadId}</span>
          </div>

          {/* Right Section - Close Button */}
          <button
            type="button"
            onClick={() => {
              closemodal(false)
              if (setishavePayment) {
                setishavePayment(false)
              }
            }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
       
        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-3">
          <div className="space-y-2">
            {/* Follow Up Date - Read Only */}
            <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-start">
              <div className="flex flex-col justify-start">
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Submission Date
                </label>

                <input
                  type="text"
                  readOnly
                  value={formData.submissionDate}
                  className="w-full px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium cursor-not-allowed focus:outline-none"
                />
              </div>

              {/* Status Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Status
                </label>

                <select
                  value={formData.status}
                  onChange={(e) => {
                    if (error.status) {
                      setError((prev) => ({
                        ...prev,
                        status: ""
                      }))
                    } else {
                      setformData((prev) => ({
                        ...prev,
                        status: e.target.value
                      }))
                    }
                    setformData((prev) => ({
                      ...prev,
                      status: e.target.value
                    }))
                  }}
                  onFocus={() => setIsdropdownOpen(true)}
                  onBlur={() => setIsdropdownOpen(false)}
                  className="w-full appearance-none px-4 py-1.5 pr-10 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-all cursor-pointer"
                >
                  {!isreadytoVarify && (
                    <option value="collectionupdate">Collection Update</option>
                  )}
                  {isreadytoVarify && (
                    <option value="verified">Verified</option>
                  )}
                </select>

                {error.status && (
                  <p className="text-red-500 text-xs mt-1">{error?.status}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Customer Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.customerName}
                    className="w-full px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium  focus:outline-none"
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
                    onChange={(e) =>
                      setformData((prev) => ({
                        ...prev,
                        address: e.target.value()
                      }))
                    }
                    className="w-full px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium focus:outline-none"
                  />
                  {error.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {error?.address}
                    </p>
                  )}
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
                {error.email && (
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
                {error.mobile && (
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
                    value={formData.registrationType}
                    onChange={(e) => handleChange(e)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm  focus:outline-none cursor-pointer bg-gray-50"
                  >
                    <option value="">Select RegistrationType</option>
                    <option value="unregistered">Unregistered/Consumer</option>
                    <option value="regular">Regular</option>
                  </select>
                  {error && (
                    <p className="text-red-500 text-xs mt-1">
                      {error?.registrationType}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Partner
                </label>

                <select
                  name="partner"
                  value={formData?.partner}
                  onChange={(e) => {
                    if (error.partner) {
                      setError((prev) => ({
                        ...prev,
                        partner: ""
                      }))
                    }
                    setformData((prev) => ({
                      ...prev,
                      partner: e.target.value
                    }))
                  }}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none bg-gray-50 cursor-pointer"
                >
                  <option value="">Select Partner</option>
                  {partnerlist?.map((partnr, index) => (
                    <option key={index} value={partnr._id}>
                      {partnr.partner}
                    </option>
                  ))}
                </select>
                {error.partner && (
                  <p className="text-red-500 text-xs mt-1">{error?.partner}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Country
                </label>

                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={(e) => handleChange(e)}
                  className="w-full px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium  focus:outline-none"
                />
                {error.country && (
                  <p className="text-red-500 text-xs mt-1">{error?.country}</p>
                )}
                {/* <Select
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
                  /> */}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  State
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => {
                      if (error.state) {
                        setformData((prev) => ({
                          ...prev,
                          state: e.target.value.trim()
                        }))
                      }
                    }}
                    className="w-full px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium  focus:outline-none"
                  />
                  {error.state && (
                    <p className="text-red-500 text-xs mt-1">{error?.state}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  City
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData?.city}
                    onChange={(e) => {
                      if (error.city) {
                        setError((prev) => ({
                          ...prev,
                          city: ""
                        }))
                      }
                      setformData((prev) => ({
                        ...prev,
                        city: e.target.value.trim()
                      }))
                    }}
                    className="w-full px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium  focus:outline-none"
                  />
                  {error.city && (
                    <p className="text-red-500 text-xs mt-1">{error?.city}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Pincode
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={(e) => handleChange(e)}
                    className="w-full px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium focus:outline-none"
                  />
                  {error && (
                    <p className="text-red-500 text-xs mt-1">
                      {error?.pincode}
                    </p>
                  )}
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
                      value={formData.netAmount}
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
                      value={formData.balanceAmount}
                      className="w-full px-4 py-1 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 font-semibold cursor-not-allowed"
                    />
                  </div>
                  {!isreadytoVarify && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Received Amount
                      </label>
                      <input
                        type="number"
                        value={formData.receivedAmount}
                        onChange={(e) => {
                          if (error.receivedAmount) {
                            setError((prev) => ({
                              ...prev,
                              receivedAmount: ""
                            }))
                          }
                          if (e.target.value === "0") {
                            setError((prev) => ({
                              ...prev,
                              receivedAmount:
                                "please input greater than interger 1"
                            }))
                            return
                          }
                          setformData((prev) => ({
                            ...prev,
                            receivedAmount: e.target.value.trim()
                          }))
                          if (isClosed) {
                            setTimeout(() => {
                              if (
                                e.target.value.trim() < formData?.balanceAmount
                              ) {
                                setError((prev) => ({
                                  ...prev,
                                  receivedAmount:
                                    "Received amount is less than balance amount check it"
                                }))
                              } else if (
                                e.target.value.trim() > formData?.balanceAmount
                              ) {
                                setError((prev) => ({
                                  ...prev,
                                  receivedAmount:
                                    "Received amount is more than balance amount check it"
                                }))
                              }
                            }, 2000)
                          }
                        }}
                        className="w-full px-4 py-1 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter received amount..."
                      />
                      {error.receivedAmount && (
                        <p className="mt-1.5 text-xs text-red-500 font-medium">
                          {error.receivedAmount}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-8">
              {!isreadytoVarify && (
                <div className="w-1/2">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                    Bank Remarks
                  </label>
                  <textarea
                    rows={4}
                    value={formData.bankRemarks}
                    onChange={(e) => {
                      if (error.bankRemarks) {
                        setError((prev) => ({
                          ...prev,
                          bankRemarks: ""
                        }))
                      } else {
                        setformData((prev) => ({
                          ...prev,
                          bankRemarks: e.target.value.trim()
                        }))
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Add Bank remarks here..."
                  />
                  {error.bankRemarks && (
                    <p className="mt-1.5 text-xs text-red-500 font-medium">
                      {error.bankRemarks}
                    </p>
                  )}
                </div>
              )}

              <div className="w-1/2">
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Remarks
                </label>
                <textarea
                  rows={4}
                  value={formData.remarks}
                  onChange={(e) => {
                    if (error.remarks) {
                      setError((prev) => ({
                        ...prev,
                        remarks: ""
                      }))
                    } else {
                      setformData((prev) => ({
                        ...prev,
                        remarks: e.target.value.trim()
                      }))
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Add detailed remarks or notes here..."
                />
                {error.remarks && (
                  <p className="mt-1.5 text-xs text-red-500 font-medium">
                    {error.remarks}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center bg-orange-300 mt-0 items-center">
          {error.submitError && (
            <p className="text-xs text-red-500 font-medium">
              {error.submitError}
            </p>
          )}
          {message.warning && (
            <p className="text-xs text-red-500 font-medium">
              {message.warning}
            </p>
          )}
          {message.noneAmount && (
            <p className="text-xs text-red-500 font-medium">
              {message.noneAmount}
            </p>
          )}
        </div>
        {/* Footer */}
        <div className="flex items-center justify-center gap-3 px-6 py-2 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={() => {
              closemodal(false)
              if (setishavePayment) {
                setishavePayment(false)
              }
            }}
            className="px-6 py-1.5 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 hover:border-gray-400 transition-all"
          >
            Cancel
          </button>

          {!message.warning && (
            <button
              onClick={handleSubmit}
              className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all"
            >
              {submitloader ? (
                <div className="flex items-center">
                  Processing
                  <FaSpinner className="animate-spin h-5 w-5  text-white ml-2" />
                </div>
              ) : (
                <div>SUBMIT</div>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
