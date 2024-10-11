import React, { useEffect, useState, useMemo } from "react"
import { useForm, Controller } from "react-hook-form"
import { Country, State } from "country-state-city"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import Select from "react-select"
import UseFetch from "../../hooks/useFetch"

// const useTrimmedValues = (setValue, fields) => {
//   useEffect(() => {
//     fields.forEach((field) => {
//       setValue(field, (value) => value.trim())
//     })
//   }, [setValue, fields])
// }

const UserAdd = ({ process, UserData, handleUserData, handleEditedData }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
    watch
  } = useForm()
  const selectedRole = watch("role")
  const [formMessage, setFormMessage] = useState("")
  const [isEditMode, setIsEditMode] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [branches, setBranch] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [selectedState, setSelectedState] = useState(null)
  const { data: allbranches } = UseFetch("/branch/getBranch")
  useEffect(() => {
    if (allbranches) {
      setBranch(allbranches)
    }
  }, [allbranches])

  const countryOptions = useMemo(
    () =>
      Country.getAllCountries().map((country) => ({
        label: country.name,
        value: country.isoCode
      })),
    [UserData]
  )

  const defaultCountry = useMemo(
    () => countryOptions.find((country) => country.value === "IN"),
    [countryOptions]
  )

  // Set state for country and state

  console.log("sataer", selectedState)
  const stateOptions = selectedCountry
    ? State.getStatesOfCountry(selectedCountry.value).map((state) => ({
        label: state.name,
        value: state.isoCode
      }))
    : []
  useEffect(() => {
    console.log("log at default country")
    if (defaultCountry) {
      setSelectedCountry(defaultCountry)
      setValue("country", defaultCountry.value)

      // setSelectedState() // Reset state when country changes
    }
  }, [defaultCountry])
  console.log("country", defaultCountry)
  useEffect(() => {
    if (UserData) {
      setIsEditMode(true)
      Object.entries(UserData).forEach(([key, value]) => {
        if (key === "country") {
          const country = countryOptions.find((c) => c.value === value)
          setSelectedCountry(country)
        }
        if (key === "state") {
          const state = stateOptions.find((s) => s.value === value)
          setSelectedState(state)
        }
        if (key !== "password") {
          setValue(key, value)
        }
      })
    }
  }, [UserData, countryOptions, selectedCountry])

  // useEffect(() => {
  //   if (UserData) {
  //     const arr = []
  //     setIsEditMode(true)
  //     for (const [key, value] of Object.entries(UserData)) {
  //       if (key !== "password") {
  //         if (key === "state") {
  //           console.log("value", value)
  //           const state = stateOptions.find((s) => s.value === value)
  //           setSelectedState(state)
  //           setValue(key, value)
  //         }
  //         setValue(key, value)
  //       }
  //     }
  //   }
  // }, [])
  console.log("state", selectedState)

  const onSubmit = (data) => {
    if (process === "Registration") {
      const trimmedData = {
        name: data.name.trim(),
        email: data.email.trim(),
        mobile: data.mobile.trim(),
        password: data.password.trim(),
        address: data.address.trim(),
        pincode: data.pincode.trim(),
        designation: data.designation.trim(),
        verified: data.verified
      }

      // Check if any trimmed value is empty
      if (
        !trimmedData.name ||
        !trimmedData.email ||
        !trimmedData.mobile ||
        !trimmedData.password
      ) {
        setFormMessage("Please fill all required fields correctly.")
        return
      }
      handleUserData(data)
    } else if (process === "Edit") {
      handleEditedData(data)
    }
  }
  console.log("is visisbel", passwordVisible)
  return (
    <div
      className="flex flex-col justify-center items-center min-h-screen p-8 bg-gray-100"
      // style={{ backgroundImage: "url('/userbackground.jpg')" }}
    >
      <div className="w-full p-8 border rounded-lg shadow-lg  bg-white ">
        <h2 className="text-2xl font-bold text-center mb-2">
          User Registration
        </h2>
        {/* Display Form Message */}
        {formMessage && (
          <div
            className={`mb-4 ${
              formMessage.includes("successful")
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {formMessage}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
            <div>
              <label className="block mb-1 font-semibold">Name</label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                autoComplete="new-name"
                placeholder="Enter a name"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            {/* Email Field */}
            <div>
              <label className="block mb-1 font-semibold">Email</label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Please enter a valid email address."
                  }
                })}
                autoComplete="new-email"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            {/* Mobile Field */}
            <div>
              <label className="block mb-1 font-semibold">Mobile</label>
              <input
                type="tel"
                {...register("mobile", {
                  required: "Mobile is required",
                  pattern: {
                    value: /^[0-9+-\s]*$/,
                    message: "Please enter a valid mobile number"
                  }
                })}
                autoComplete="new-mobile"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none"
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm">{errors.mobile.message}</p>
              )}
            </div>
            {/* Date of Birth Field */}
            <div>
              <label className="block mb-1 font-semibold">D.O.B</label>
              <input
                type="date"
                {...register("dateofbirth")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
              />
              {errors.dateofbirth && (
                <span className="text-red-500 text-sm">
                  {errors.dateofbirth.message}
                </span>
              )}
            </div>
            {/* Blood Group Field */}
            <div>
              <label className="block mb-1 font-semibold">Blood Group</label>
              <select
                {...register("bloodgroup", {
                  required: "Blood group is required"
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none"
              >
                <option value="">Select a blood group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
              {errors.bloodgroup && (
                <p className="text-red-500 text-sm">
                  {errors.bloodgroup.message}
                </p>
              )}
            </div>
            {/* Gender Field */}
            <div>
              <label className="block mb-1 font-semibold">Gender</label>
              <select
                {...register("gender", { required: "Gender is required" })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none"
              >
                <option value="">Select a gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm">{errors.gender.message}</p>
              )}
            </div>
            {/* Address Field */}
            <div>
              <label className="block mb-1 font-semibold">Address</label>
              <input
                type="text"
                {...register("address", { required: "Address is required" })}
                placeholder="Enter an address"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none"
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div>
            {/* Country Field */}
            <div>
              <label className="block mb-1 font-semibold">Country</label>
              <Select
                options={countryOptions}
                value={selectedCountry}
                onChange={(option) => {
                  setSelectedCountry(option)
                  setValue("country", option.value)
                  // setSelectedState(null) // Reset state when country changes
                }}
              />
              {errors.country && (
                <p className="text-red-500 text-xs mt-1">Country is required</p>
              )}
            </div>
            {/* State Field */}
            <div>
              <label className="block mb-1 font-semibold">State</label>
              <Select
                options={stateOptions}
                value={selectedState}
                onChange={(option) => {
                  setSelectedState(option)
                  setValue("state", option.value)
                }}
                isDisabled={!selectedCountry}
              />
              {errors.state && (
                <p className="text-red-500 text-xs mt-1">State is required</p>
              )}
            </div>
            {/* Pincode Field */}
            <div>
              <label className="block mb-1 font-semibold">Pincode</label>
              <input
                type="number"
                {...register("pincode", { required: "Pincode is required" })}
                placeholder="Enter a pincode"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none"
              />
              {errors.pincode && (
                <p className="text-red-500 text-sm">{errors.pincode.message}</p>
              )}
            </div>
            {/* Joining Date Field */}
            <div>
              <label className="block mb-1 font-semibold">Joining Date</label>
              <input
                type="date"
                {...register("joiningdate")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
              />
              {errors.joiningdate && (
                <span className="text-red-500 text-sm">
                  {errors.joiningdate.message}
                </span>
              )}
            </div>
            {/* Resignation Field */}
            <div>
              <label htmlFor="designation" className="block mb-1 font-semibold">
                Designation
              </label>
              <input
                type="text"
                {...register("designation")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
              />
              {errors.designation && (
                <span className="text-red-500 text-sm">
                  {errors.designation.message}
                </span>
              )}
            </div>
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  {...register("password", {
                    required: "Password is required"
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none"
                />
                {/* Only show the eye icon if it's not in edit mode */}
                {!isEditMode && (
                  <span
                    className="absolute inset-y-0 right-0 flex items-center px-2 cursor-pointer"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    <FontAwesomeIcon
                      icon={passwordVisible ? faEyeSlash : faEye}
                    />
                  </span>
                )}
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="role" className="block mb-1 font-semibold">
                Role
              </label>
              <select
                {...register("role", { required: true })}
                className="w-full mt-1 block border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none"
              >
                <option value="Staff">Staff</option>
                <option value="Admin">Admin</option>
                <option value="Hr">HR</option>
                <option value="Teamleader">Teamleader</option>
                <option value="Assistantmanager">Assistant Manager</option>

                <option value="Seniormanager">Senior Manager</option>
              </select>
            </div>
            {/* <div>
              <label className="block mb-1 font-semibold">Department</label>
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none"
                  >
                    <option value="">Select Department</option>
                    {selectedRole === "Staff"
                      ? branches.map((branch, index) => (
                          <option key={index} value={branch.branchName}>
                            {branch.branchName}
                          </option>
                        ))
                      : departments.map((dept, index) => (
                          <option key={index} value={dept}>
                            {dept}
                          </option>
                        ))}
                  </select>
                )}
              />
              {errors.department && (
                <p className="text-red-500 text-sm">
                  {errors.department.message}
                </p>
              )}
            </div> */}
            <div>
              <label htmlFor="assignedto" className="block mb-1 font-semibold">
                Assigned to
              </label>
              <select
                {...register("assignedto", { required: true })}
                className="w-full mt-1 block border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none"
              >
                <option value="Admin">Admin</option>
                <option value="Hr">HR</option>
                <option value="Teamleader">Teamleader</option>
                <option value="Assistantmanager">Assistant Manager</option>
                <option value="Seniormanager">Senior Manager</option>
              </select>
            </div>
            {/* Verified Field */}
            <div className="">
              <label className="block mb-1 font-semibold">Verified</label>
              <select
                {...register("verified", { required: true })}
                className="w-full mt-1 block border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none"
              >
                <option value={true}>True</option>
                <option value={false}>False</option>
              </select>
            </div>
            {/* Submit Button */}
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className=" mt-7 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserAdd
