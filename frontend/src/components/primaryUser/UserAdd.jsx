import React, { useEffect, useState, useMemo } from "react"
import { toast } from "react-toastify"
import { useForm, Controller } from "react-hook-form"
import { Country, State } from "country-state-city"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { FaEdit, FaTrash } from "react-icons/fa"
import Select from "react-select"
import ImageInput from "../common/ImageInput"
import UseFetch from "../../hooks/useFetch"

// const useTrimmedValues = (setValue, fields) => {
//   useEffect(() => {
//     fields.forEach((field) => {
//       setValue(field, (value) => value.trim())
//     })
//   }, [setValue, fields])
// }

const UserAdd = ({
  process,
  User,
  Selected,
  handleUserData,
  handleEditedData
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
    watch,
    trigger
  } = useForm()
  const selectedRole = watch("role")
  const [formMessage, setFormMessage] = useState("")
  const [showTable, setShowTable] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [departments, setDepartment] = useState([])
  const [company, setCompanies] = useState([])
  const [branches, setBranches] = useState([])
  const [sections, setSections] = useState([])
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [selectedSection, setSelectedSection] = useState(null)
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [selectedState, setSelectedState] = useState(null)
  const [tableData, setTableData] = useState([])
  const [imageData, setImageData] = useState({
    profileUrl: [],
    documentUrl: []
  })
  const [tableObject, setTableObject] = useState({
    company_id: "",
    companyName: "",
    branch_id: "",
    branchName: "",
    section_id: "",
    sectionName: ""
  })
  const { data: companies } = UseFetch("/company/getCompany")
  const { data: alldepartment } = UseFetch("/master/getDepartmentList")
  const { data: section } = UseFetch("/inventory/getBrand")

  useEffect(() => {
    if (alldepartment || section || companies) {
      setDepartment(alldepartment)
      setSections(section)
      setCompanies(companies)
    }
  }, [alldepartment, section, companies])

  const countryOptions = useMemo(
    () =>
      Country.getAllCountries().map((country) => ({
        label: country.name,
        value: country.isoCode
      })),
    [User, Selected]
  )

  useEffect(() => {
    if (selectedCompany) {
      setValue("companyName", selectedCompany)
      const matchingCompany = company.find(
        (company) => company._id === selectedCompany
      )

      if (matchingCompany) {
        const branch = matchingCompany.branches

        setBranches(branch)
      }
    }
  }, [selectedCompany])
  const defaultCountry = useMemo(
    () => countryOptions.find((country) => country.value === "IN"),
    [countryOptions]
  )
  const stateOptions = selectedCountry
    ? State.getStatesOfCountry(selectedCountry.value).map((state) => ({
        label: state.name,
        value: state.isoCode
      }))
    : []

  const handleTableData = () => {
    if (tableObject.company_id.trim() === "") {
      toast.error("please select a company")
      return
    } else if (tableObject.branch_id.trim() === "") {
      toast.error("please select a branch")
      return
    } else if (tableObject.section_id.trim() === "") {
      toast.error("please select a section")
      return
    }

    if (isEditMode) {
      // If in edit mode, update the existing item
      setTableData((prev) => {
        const newData = [...prev]
        newData[editIndex] = tableObject // Update the specific item
        return newData
      })
      setEditIndex(null)
      seteditState(false) // Reset the edit index
    } else {
      // Otherwise, add a new item

      const isIncluded = tableData.some(
        (item) => JSON.stringify(item) === JSON.stringify(tableObject)
      )

      if (isIncluded) {
        toast.error("already added")
        return
      }
      console.log("tableobject", tableObject)
      setTableData((prev) => [...prev, tableObject])
    }

    // reset()
  }
  const handleCompanyChange = (e) => {
    const companyId = e.target.value
    setSelectedCompany(companyId)

    setValue("companyName", e.target.value)
    trigger("companyName")
    const foundCompany = company.find((company) => company._id === companyId)

    setTableObject((prev) => ({
      ...prev,
      company_id: companyId,
      companyName: foundCompany.companyName
    }))
  }

  const handleBranchChange = (e) => {
    const branchId = e.target.value
    setSelectedBranch(branchId)

    setValue("branchName", e.target.value)
    trigger("branchName")
    const foundBranch = branches.find((branch) => branch._id === branchId)

    setTableObject((prev) => ({
      ...prev,
      branch_id: branchId,
      branchName: foundBranch.branchName
    }))
  }

  const handleSectionChange = (e) => {
    const sectionId = e.target.value
    setSelectedSection(sectionId)
    setShowTable(true)
    setValue("sectionName", e.target.value)
    trigger("sectionName")
    const foundSection = sections.find((section) => section._id === sectionId)

    setTableObject((prev) => ({
      ...prev,
      section_id: sectionId,
      sectionName: foundSection.brand
    }))
  }

  useEffect(() => {
    if (defaultCountry) {
      setSelectedCountry(defaultCountry)
      setValue("country", defaultCountry.value)
    }
  }, [defaultCountry])

  useEffect(() => {
    if (
      User &&
      countryOptions.length > 0 &&
      departments &&
      departments.length > 0 &&
      company &&
      company.length > 0 &&
      sections &&
      sections.length > 0
    ) {
      setIsEditMode(true)
      Object.entries(User).forEach(([key, value]) => {
        if (key === "country") {
          const country = countryOptions.find((c) => c.value === value)
          setSelectedCountry(country)
        }
        if (key === "state") {
          const state = stateOptions.find((s) => s.value === value)
          setSelectedState(state)
        }
        if (key === "department") {
          const department = departments.find((d) => d._id === value)

          setSelectedDepartment(department)
        }

        if (key !== "password") {
          setValue(key, value)
        }
      })
    }
    if (
      Selected &&
      company &&
      company.length > 0 &&
      sections &&
      sections.length > 0 &&
      countryOptions.length > 0
    ) {
      Object.entries(Selected).forEach(([key, value]) => {
        if (key === "company_id") {
          const matchingCompany = company.find(
            (company) => company._id === value
          )

          if (matchingCompany) {
            setSelectedCompany(value)
          }
        }
        if (key === "branchName") {
          const branch = branches.find(
            (branch) => branch._id === Selected.branch_id
          )

          if (branch) {
            setSelectedBranch(branch._id)
            setValue(key, branch._id)
          }
        }
        if (key === "sectionName") {
          const section = sections.find(
            (section) => section._id === Selected.section_id
          )

          if (section) {
            setSelectedSection(Selected.section_id)
            setValue(key, section._id)
          }
        }
      })
    }
  }, [User, departments, company, sections])

  const profileImage = (url) => {
    setImageData((prevData) => ({
      ...prevData,
      profileUrl: url
    }))
  }
  const documentImage = (url) => {
    setImageData((prevData) => ({
      ...prevData,
      documentUrl: Array.isArray(url)
        ? [...prevData.documentUrl, ...url] // Append if 'urls' is an array
        : [...prevData.documentUrl, url] // Add the single URL if it's not an array
    }))
  }

  const onSubmit = (data) => {
    if (process === "Registration") {
      if (data) {
        data.name.trim(),
          data.email.trim(),
          data.mobile.trim(),
          data.password.trim(),
          data.address.trim(),
          data.pincode.trim(),
          data.designation.trim()
      }

      handleUserData(data, imageData, tableData)
    } else if (process === "Edit") {
      handleEditedData(data, UserData?._id)
    }
  }
  console.log("slectebbb", selectedSection)
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
                  pattern: {
                    value: /^[0-9]{10}$/,

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
                {...register("bloodgroup")}
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
                {...register("address")}
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
                {...register("pincode")}
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
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-2 py-1 sm:text-md focus:border-gray-500 outline-none"
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
                    required: "Password is Required"
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
            <div>
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700"
              >
                Department
              </label>

              <select
                id="department"
                {...register("department")}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
              >
                <option value="">-- Select a department --</option>

                {departments?.map((department) => (
                  <option key={department._id} value={department._id}>
                    {department.department}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="assignedto" className="block mb-1 font-semibold">
                Assigned to
              </label>
              <select
                {...register("assignedto")}
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
            <div>
              <label className="block mb-1 font-semibold">Verified</label>
              <select
                {...register("verified", { required: true })}
                className="w-full mt-1 block border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none"
              >
                <option value={true}>True</option>
                <option value={false}>False</option>
              </select>
            </div>

            <ImageInput onSelect={profileImage} tag={"UploadProfile"} />
            <ImageInput onSelect={documentImage} tag={"UploadDocument"} />
          </div>

          <div className="mt-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
              <div>
                <label
                  htmlFor="companyName"
                  className="block mb-1 font-semibold"
                >
                  Select Company
                </label>

                <select
                  id="companyName"
                  {...register("companyName", {
                    required: "Company is required"
                  })}
                  onChange={handleCompanyChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                >
                  <option value="">-- Select a company --</option>

                  {company?.map((company) => (
                    <option key={company._id} value={company._id}>
                      {company.companyName}
                    </option>
                  ))}
                </select>
                {errors.companyName && (
                  <p className="text-red-500 text-sm">
                    {errors.companyName.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="branchName"
                  className="block mb-1 font-semibold"
                >
                  Select Branch
                </label>

                <select
                  id="branchName"
                  {...register("branchName", {
                    required: "branch is required"
                  })}
                  onChange={handleBranchChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                >
                  <option value="">-- Select a Branch--</option>

                  {branches?.map((branch) => (
                    <option key={branch._id} value={branch._id}>
                      {branch.branchName}
                    </option>
                  ))}
                </select>
                {errors.branchName && (
                  <p className="text-red-500 text-sm">
                    {errors.branchName.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="sectionName"
                  className="block mb-1 font-semibold"
                >
                  Section
                </label>

                <select
                  id="sectionName"
                  {...register("sectionName", {
                    required: "Section is required"
                  })}
                  onChange={handleSectionChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                >
                  <option value="">-- Select Section--</option>

                  {sections?.map((section) => (
                    <option key={section._id} value={section._id}>
                      {section.brand}
                    </option>
                  ))}
                </select>
                {errors.sectionName && (
                  <p className="text-red-500 text-sm">
                    {errors.sectionName.message}
                  </p>
                )}
              </div>
            </div>
            {showTable && (
              <div>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleTableData}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  >
                    {isEditMode ? "UPDATE" : "ADD"}
                  </button>
                </div>

                <div className="mt-6 w-lg overflow-y-auto">
                  <table className="bg-green-300 w-full divide-y divide-gray-200  ">
                    <thead>
                      <tr className="text-center">
                        <th className="  py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Company Name
                        </th>
                        <th className=" px-5 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Branch Name
                        </th>
                        <th className=" px-5 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Section
                        </th>

                        <th className="px-4  py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Edit
                        </th>
                        <th className="px-5  py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Delete
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 ">
                      {tableData?.map((product, index) => (
                        <tr key={index} className="text-center">
                          <td className=" py-4 whitespace-nowrap text-sm text-gray-500">
                            {product?.companyName}
                          </td>

                          <td className=" py-4 whitespace-nowrap text-sm text-gray-500">
                            {product?.branchName}
                          </td>

                          <td className=" py-4 whitespace-nowrap text-sm text-gray-500">
                            {product?.sectionName}
                          </td>

                          <td className=" py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              type="button"
                              className="text-green-600 hover:text-green-900 mr-2" // Adjust styles as needed
                            >
                              <FaEdit
                                onClick={() => handleEdit(product.product_id)}
                              />
                            </button>
                          </td>

                          <td className=" py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              type="button"
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <FaTrash onClick={() => handleDelete(index)} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className=" mt-7 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              {isEditMode ? "Update" : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserAdd
