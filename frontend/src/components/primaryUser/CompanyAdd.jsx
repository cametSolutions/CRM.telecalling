import React, { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"

const CompanyAdd = ({
  process,
  CompanyData,
  handleCompanyData,
  handleEditedData
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm()

  useEffect(() => {
    if (CompanyData) {
      for (const [key, value] of Object.entries(CompanyData)) {
        setValue(key, value)
      }
    }
  }, [CompanyData, setValue])

  // const validateGSTIN = gstin => {
  //   const gstinRegex =
  //     /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
  //   return gstinRegex.test(gstin) || "Invalid GSTIN format"
  // }
  const validateGSTIN = (gstin) => {
    // Implement GSTIN validation logic here
    // You can use a regular expression or other validation methods
    // Refer to GSTIN format guidelines for accurate validation
    const gstinRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
    return gstinRegex.test(gstin) || "Invalid GSTIN format"
  }

  const onSubmit = (data) => {
    if (process === "Registration") {
      handleCompanyData(data)
    } else if (process === "Edit") {
      handleEditedData(data)
    }
  }

  return (
    <div className="container justify-center items-center min-h-screen p-8 bg-gray-100">
      <div className="w-auto bg-white shadow-lg rounded p-8 ">
        <h2 className="text-2xl font-semibold mb-6">Company Registration</h2>

        <form
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              type="text"
              {...register("companyName", {
                required: "Company name is required"
              })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
              placeholder="Company Name"
            />
            {errors.companyName && (
              <span className="mt-2 text-sm text-red-600">
                {errors.companyName.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address 1
            </label>
            <input
              type="text"
              {...register("address1")}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none focus:border-gray-500"
              placeholder="Address"
            />
            {errors.address1 && (
              <span className="mt-2 text-sm text-red-600">
                {errors.address1.message}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address 2
            </label>
            <input
              type="text"
              {...register("address2")}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none focus:border-gray-500"
              placeholder="Address"
            />
            {errors.address2 && (
              <span className="mt-2 text-sm text-red-600">
                {errors.address2.message}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              {...register("city")}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
              placeholder="City"
            />
            {errors.city && (
              <span className="mt-2 text-sm text-red-600">
                {errors.city.message}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Pincode
            </label>
            <input
              type="text"
              {...register("pincode")}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
              placeholder="Pincode"
            />
            {errors.pincode && (
              <span className="mt-2 text-sm text-red-600">
                {errors.pincode.message}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <input
              type="text"
              {...register("country")}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
              placeholder="Country"
            />
            {errors.country && (
              <span className="mt-2 text-sm text-red-600">
                {errors.country.message}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              State
            </label>
            <input
              type="text"
              {...register("state")}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
              placeholder="State"
            />
            {errors.state && (
              <span className="mt-2 text-sm text-red-600">
                {errors.state.message}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address"
                }
              })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
              placeholder="Email"
            />
            {errors.email && (
              <span className="mt-2 text-sm text-red-600">
                {errors.email.message}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              {...register("mobile")}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
              placeholder="Phone"
            />
            {errors.mobile && (
              <span className="mt-2 text-sm text-red-600">
                {errors.mobile.message}
              </span>
            )}
          </div>
          <div className="">
            <label className="block text-sm font-medium text-gray-700">
              Website
            </label>
            <input
              type="url"
              {...register("website")}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
              placeholder="Website"
            />
            {errors.website && (
              <span className="mt-2 text-sm text-red-600">
                {errors.website.message}
              </span>
            )}
          </div>
          <div className="">
            <label className="block text-sm font-medium text-gray-700">
              Landline
            </label>
            <input
              type="text"
              {...register("landlineno")}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
              placeholder="Landline"
            />
            {errors.landlineno && (
              <span className="mt-2 text-sm text-red-600">
                {errors.landlineno.message}
              </span>
            )}
          </div>
          {/* Account Details Section */}
          <div className="w-5/6 bg-white shadow-lg rounded p-8 mx-auto mt-12">
            <h3 className="text-xl font-semibold mb-4">Account Details</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Account Name
              </label>
              <input
                type="text"
                {...register("accountDetails.accountName")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                placeholder="Account Name"
              />
              {errors.accountDetails?.accountName && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.accountDetails.accountName.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bank Name
              </label>
              <input
                type="text"
                {...register("accountDetails.bankName")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                placeholder="Bank Name"
              />
              {errors.accountDetails?.bankName && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.accountDetails.bankName.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Branch Name
              </label>
              <input
                type="text"
                {...register("accountDetails.branchName")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                placeholder="Branch Name"
              />
              {errors.accountDetails?.branchName && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.accountDetails.branchName.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Account Number
              </label>
              <input
                type="text"
                {...register("accountDetails.accountNumber")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                placeholder="Account Number"
              />
              {errors.accountDetails?.accountNumber && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.accountDetails.accountNumber.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                IFSC Code
              </label>
              <input
                type="text"
                {...register("accountDetails.ifscCode")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                placeholder="IFSC Code"
              />
              {errors.accountDetails?.ifscCode && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.accountDetails.ifscCode.message}
                </span>
              )}
            </div>
            {/* <div>
              <label className="block text-sm font-medium text-gray-700">
                GSTIN
              </label>
              <input
                type="text"
                {...register("accountDetails.gstin", {
                  required: "GSTIN is required",
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                placeholder="GSTIN"
              />
              {errors.accountDetails?.gstin && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.accountDetails.gstin.message}
                </span>
              )}
            </div> */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                PAN Number
              </label>
              <input
                type="text"
                {...register("accountDetails.pan")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                placeholder="PAN Number"
              />
              {errors.accountDetails?.pan && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.accountDetails.pan.message}
                </span>
              )}
            </div>
          </div>
          <div className="w-5/6 bg-white shadow-lg rounded p-8 mx-auto mt-12">
            <h3 className="text-xl font-semibold mb-4">GST Details</h3>
            <label className="block text-sm font-medium text-gray-700">
              GSTIN
            </label>
            <input
              type="text"
              {...register("gstin")}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
              placeholder="GSTIN"
            />
            {errors.gstin?.type === "required" && (
              <span className="mt-2 text-sm text-red-600">
                GSTIN is required
              </span>
            )}
            {errors.gstin?.type === "validate" && (
              <span className="mt-2 text-sm text-red-600">
                {errors.gstin.message}
              </span>
            )}
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CompanyAdd
