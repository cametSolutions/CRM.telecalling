import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import UseFetch from "../../hooks/useFetch"
import { toast } from "react-toastify"
const BranchAdd = ({
  process,
  BranchData,
  handleBranchData,
  handleEditData,
  branchdata
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm()

  const [companies, SetCompanies] = useState([])

  const { data: companyData, loading, error } = UseFetch("/company/getCompany")

  useEffect(() => {
    if (companyData) {
      SetCompanies(companyData)
    }
  }, [companyData])
  useEffect(() => {
    if (branchdata && companies.length > 0) {
      console.log("brrrr", branchdata)
      console.log("com", companies)
      setValue("companyName", branchdata.companyName._id)
      setValue("branchName", branchdata.branchName)
      setValue("address", branchdata.address)
      setValue("city", branchdata.city)
      setValue("pincode", branchdata.pincode)
      setValue("country", branchdata.country)
      setValue("state", branchdata.state)
      setValue("mobile", branchdata.mobile)
      setValue("landlineno", branchdata.landlineno)
      setValue("email", branchdata.email)
    }
  }, [companies])

  useEffect(() => {
    if (error) {
      if (error.response) {
        toast.error(error.response.data.message)
      } else {
        toast.error("Something went wrong!")
      }
    }
  }, [error])

  const onSubmit = (data) => {
    if (process === "Registration") {
      handleBranchData(data)
    } else if (process === "edit") {
      handleEditData(data, branchdata._id)
    }
  }

  return (
    <div className="container justify-center items-center min-h-screen py-5 bg-gray-100">
      <div className="w-5/6 bg-white shadow-lg rounded p-5 mx-auto">
        <h2 className="text-2xl font-semibold mb-2">Branch Registration</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-700"
              >
                Select Company
              </label>
              <select
                id="companyName"
                {...register("companyName", {
                  required: "Company name is required"
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
              >
                <option value="">-- Select a company --</option>

                {companies?.map((company) => (
                  <option key={company._id} value={company._id}>
                    {company.companyName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Branch Name
              </label>
              <input
                type="text"
                {...register("branchName", {
                  required: "Branch name is required"
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                placeholder="Enter a branch Name"
              />
              {errors.branchName && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.branchName.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                {...register("address")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none focus:border-gray-500"
                placeholder="Address"
              />
              {errors.address && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.address.message}
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
                Notification Mail
              </label>
              <input
                type="notificationemail"
                {...register("notificationemail", {
                  required: " notification Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address"
                  }
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                placeholder="Email"
              />
              {errors.notificationemail && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.notificationemail.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mail Password
              </label>
              <input
                type="text"
                {...register("mailpassword")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                placeholder="mail password..."
              />
              {errors.mailpassword && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.mailpassword.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mobile
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
          </div>

          <div className="flex justify-end p-4">
            <button
              type="submit"
              className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BranchAdd
