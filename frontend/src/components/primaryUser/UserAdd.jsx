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
    reset,
    watch,
    trigger
  } = useForm()

  const [formMessage, setFormMessage] = useState("")
  const [showTable, setShowTable] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [tableEdit, settableEdit] = useState(false)
  const [editIndex, setEditIndex] = useState(null)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [departments, setDepartment] = useState([])
  const [company, setCompanies] = useState([])
  const [branches, setBranches] = useState([])
  const [selectedAssignedto, setSelectedAssignedto] = useState(null)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [users, setUsers] = useState([])
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
    branchName: ""
  })
  const { data: companies } = UseFetch("/company/getCompany")
  const { data: alldepartment } = UseFetch("/master/getDepartmentList")
  const { data: section } = UseFetch("/inventory/getBrand")
  const { data } = UseFetch("/auth/getallUsers")

  useEffect(() => {
    if (alldepartment || companies) {
      setDepartment(alldepartment)

      setCompanies(companies)
      // setUsers(use)
    }
  }, [alldepartment, section, companies])

  useEffect(() => {
    if (data) {
      const { allusers = [], allAdmins = [] } = data

      // Combine allusers and allAdmins
      const combinedUsers = [...allusers, ...allAdmins]

      // Set combined names to state
      setUsers(combinedUsers)
    }
  }, [data])

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
    if (selectedBranch) {
      setValue("branchName", selectedBranch)
    }
    if (selectedDepartment) {
      setValue("department", selectedDepartment)
    }
    if (selectedAssignedto) {
      setValue("assignedto", selectedAssignedto)
    }
  }, [selectedCompany, selectedBranch, selectedDepartment])

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
    }

    if (tableEdit) {
      const isIncluded = tableData.some(
        (item) => JSON.stringify(item) === JSON.stringify(tableObject)
      )

      if (isIncluded) {
        toast.error("already added")
        return
      }
      setTableData((prev) => {
        const newData = [...prev]
        newData[editIndex] = tableObject // Update the specific item
        return newData
      })

      setEditIndex(null)
      settableEdit(false) // Reset the edit index
    } else {
      // Otherwise, add a new item

      const isIncluded = tableData.some(
        (item) => JSON.stringify(item) === JSON.stringify(tableObject)
      )

      if (isIncluded) {
        toast.error("already added")
        return
      }

      setTableData((prev) => [...prev, tableObject])
    }
  }

  const handleCompanyChange = (e) => {
    if (isEditMode) {
      // settableEdit(true)
    }
    const companyId = e.target.value
    setSelectedCompany(companyId)

    setValue("companyName", e.target.value)
    trigger("companyName")
    const foundCompany = company.find((company) => company._id === companyId)

    setTableObject((prev) => ({
      ...prev,
      company_id: companyId,
      companyName: foundCompany?.companyName
    }))
  }

  const handleBranchChange = (e) => {
    if (isEditMode) {
      // settableEdit(true)
    }
    const branchId = e.target.value
    setSelectedBranch(branchId)
    setShowTable(true)
    setValue("branchName", e.target.value)
    trigger("branchName")
    const foundBranch = branches.find((branch) => branch._id === branchId)

    setTableObject((prev) => ({
      ...prev,
      branch_id: branchId,
      branchName: foundBranch.branchName
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
      // branches &&
      // branches.length > 0 &&
      users &&
      users.length > 0
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
          const department = departments.find((d) => d._id === value._id)

          setSelectedDepartment(department._id)
          // setValue(key, department._id)
        }
        if (key === "assignedto") {
          const assigned = users.find((item) => item._id === value._id)

          setSelectedAssignedto(assigned._id)
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
      users &&
      users.length > 0 &&
      countryOptions.length > 0
    ) {
      setShowTable(true)

      // setTableData([
      //   {
      //     company_id: User.selected.company_id || "",
      //     companyName: User.selected.companyName || "",
      //     branch_id: User.selected.branch_id || "",
      //     branchName: User.selected.branchName || ""
      //   }
      // ])
      const tabledataWithoutId = User.selected.map(({ _id, ...rest }) => rest)
      setTableData(User.selected)
      setTableObject({
        company_id: Selected.company_id || "",
        companyName: Selected.companyName || "",
        branch_id: Selected.branch_id || "",
        branchName: Selected.branchName || ""
      })

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
      })
      // setTableData((prev) => [...prev, tableObject])
      // setTableData(() => tableObject)
    }
  }, [
    User,
    departments,
    company,
    selectedCompany,
    branches,
    users,
    selectedDepartment
  ])
  const handleEdit = (id) => {
    settableEdit(true) // Close the edit state (or handle according to your logic)

    const itemToEdit = tableData.find((item) => item.branch_id === id)

    if (itemToEdit) {
      // Set the form values
      const fieldsToSet = {
        company_id: itemToEdit.company_id,
        companyName: itemToEdit.companyName,
        branch_id: itemToEdit.branch_id,
        branchName: itemToEdit.branchName
      }

      console.log(itemToEdit.branchName)
      console.log(itemToEdit.branch_id)
      setSelectedCompany(fieldsToSet.company_id)
      setSelectedBranch(fieldsToSet.branch_id)

      // Find index of the item being edited and set it to the state
      const index = tableData.findIndex((item) => item.branch_id === id)
      setEditIndex(index)
    }
  }

  const handleDelete = (id) => {
    const filtereddData = tableData.filter((item, index) => {
      return index !== id
    })

    setTableData(filtereddData)
  }

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
      const formattedData = {
        ...data,
        department: data.department || null, // Set to null if empty
        assignedto: data.assignedto || null // Set to null if empty
      }

      handleUserData(formattedData, imageData, tableData)
    } else if (process === "Edit") {
      handleEditedData(data, User?._id, tableData)
    }
  }

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
            <div>
              <label htmlFor="department" className="block mb-1 font-semibold">
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
            <div className="relative">
              <label htmlFor="password" className="block mb-1 font-semibold">
                Password
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  // {...register("password", {
                  //   required: "Password is Required"
                  // })}
                  {...register("password", {
                    // Conditionally required: true only in register mode
                    required: !isEditMode && "Password is Required",
                    // Optionally, you can add minLength or other rules based on your use case
                    minLength: !isEditMode && {
                      value: 6,
                      message: "Password must be at least 6 characters"
                    }
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
              </select>
            </div>

            <div>
              <label htmlFor="assignedto" className="block mb-1 font-semibold">
                Assigned to
              </label>
              <select
                {...register("assignedto")}
                className="w-full mt-1 block border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none max-h-40 overflow-y-auto"
              >
                <option value="">-assignedto --</option>

                {users?.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
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

              {/* <div>
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
              </div> */}
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

                        <th className="px-4  py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Edit
                        </th>
                        <th className="px-5  py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Delete
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 ">
                      {tableData?.map((item, index) => (
                        <tr key={index} className="text-center">
                          <td className=" py-4 whitespace-nowrap text-sm text-gray-500">
                            {item?.companyName}
                          </td>

                          <td className=" py-4 whitespace-nowrap text-sm text-gray-500">
                            {item?.branchName}
                          </td>

                          <td className=" py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              type="button"
                              className="text-green-600 hover:text-green-900 mr-2" // Adjust styles as needed
                            >
                              <FaEdit
                                onClick={() => handleEdit(item.branch_id)}
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

// import React, { useEffect, useState, useMemo } from "react"
// import { toast } from "react-toastify"
// import { useForm, Controller } from "react-hook-form"
// import { Country, State } from "country-state-city"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
// import { FaEdit, FaTrash } from "react-icons/fa"
// import Select from "react-select"
// import ImageInput from "../common/ImageInput"
// import UseFetch from "../../hooks/useFetch"

// // const useTrimmedValues = (setValue, fields) => {
// //   useEffect(() => {
// //     fields.forEach((field) => {
// //       setValue(field, (value) => value.trim())
// //     })
// //   }, [setValue, fields])
// // }

// const UserAdd = ({
//   process,
//   User,
//   Selected,
//   handleUserData,
//   handleEditedData
// }) => {
//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//     control,
//     reset,
//     watch,
//     trigger
//   } = useForm()

//   const [formMessage, setFormMessage] = useState("")
//   const [showTable, setShowTable] = useState(false)
//   const [isEditMode, setIsEditMode] = useState(false)
//   const [tableEdit, settableEdit] = useState(false)
//   const [editIndex, setEditIndex] = useState(null)
//   const [passwordVisible, setPasswordVisible] = useState(false)
//   const [departments, setDepartment] = useState([])
//   const [company, setCompanies] = useState([])
//   const [branches, setBranches] = useState([])
//   const [selectedAssignedto, setSelectedAssignedto] = useState(null)
//   const [selectedCompany, setSelectedCompany] = useState(null)
//   const [selectedBranch, setSelectedBranch] = useState(null)
//   const [users, setUsers] = useState([])
//   const [selectedDepartment, setSelectedDepartment] = useState(null)
//   const [selectedCountry, setSelectedCountry] = useState(null)
//   const [selectedState, setSelectedState] = useState(null)
//   const [tableData, setTableData] = useState([])

//   const [imageData, setImageData] = useState({
//     profileUrl: "",
//     documentUrl: []
//   })
//   console.log(imageData)
//   const [tableObject, setTableObject] = useState({
//     _id: "",
//     company_id: "",
//     companyName: "",
//     branch_id: "",
//     branchName: ""
//   })

//   //useEffect used to setup the table data
//   useEffect(() => {
//     setTableData(User?.selected)
//   }, [User])
//   const { data: companies } = UseFetch("/company/getCompany")
//   const { data: alldepartment } = UseFetch("/master/getDepartmentList")
//   const { data: section } = UseFetch("/inventory/getBrand")
//   const { data } = UseFetch("/auth/getallUsers")

//   useEffect(() => {
//     if (alldepartment || companies) {
//       setDepartment(alldepartment)

//       setCompanies(companies)
//       // setUsers(use)
//     }
//   }, [alldepartment, section, companies])

//   useEffect(() => {
//     if (data) {
//       const { allusers = [], allAdmins = [] } = data
//       console.log(allusers)
//       // Combine allusers and allAdmins
//       const combinedUsers = [...allusers, ...allAdmins]

//       // Set combined names to state
//       setUsers(combinedUsers)
//     }
//   }, [data])
//   console.log(departments)
//   console.log(users)

//   const countryOptions = useMemo(
//     () =>
//       Country.getAllCountries().map((country) => ({
//         label: country.name,
//         value: country.isoCode
//       })),
//     [User, Selected]
//   )

//   useEffect(() => {
//     if (selectedCompany) {
//       setValue("companyName", selectedCompany)
//       const matchingCompany = company.find(
//         (company) => company._id === selectedCompany
//       )

//       if (matchingCompany) {
//         const branch = matchingCompany.branches

//         setBranches(branch)
//       }
//     }
//     if (selectedBranch) {
//       console.log(selectedBranch)
//       setValue("branchName", selectedBranch)
//     }
//   }, [selectedCompany, selectedBranch])

//   const defaultCountry = useMemo(
//     () => countryOptions.find((country) => country.value === "IN"),
//     [countryOptions]
//   )

//   const stateOptions = selectedCountry
//     ? State.getStatesOfCountry(selectedCountry.value).map((state) => ({
//         label: state.name,
//         value: state.isoCode
//       }))
//     : []
//   console.log(tableData)
//   console.log(tableObject)
//   const handleTableData = () => {
//     if (!selectedCompany) {
//       toast.error("please select a company")
//       return
//     } else if (!selectedBranch) {
//       toast.error("please select a branch")
//       return
//     }

//     if (tableEdit) {
//       const alreadySelcted = tableData.find((item) => {
//         return (
//           item._id === tableObject._id &&
//           item.company_id === tableObject.company_id &&
//           item.branch_id === tableObject.branch_id
//         )
//       })
//       if (alreadySelcted) {
//         toast.error("Already Exists")
//       }
//       const isIncluded = tableData.find((item) => {
//         return item._id === tableObject._id
//       })
//       console.log(isIncluded)
//       if (isIncluded) {
//         setTableData((prev) => {
//           const newData = [...prev]
//           newData[editIndex] = tableObject // Update the specific item
//           return newData
//         })
//       }
//       setTableData((prev) => {
//         const newData = [...prev]
//         newData[editIndex] = tableObject // Update the specific item
//         return newData
//       })

//       setEditIndex(null)
//       settableEdit(false) // Reset the edit index
//     } else {
//       // Otherwise, add a new item
//       console.log(tableObject)
//       setTableData((prev) => ({
//         ...prev,
//         tableObject
//       }))
//     }
//     // setValue("companyName", null)
//     // setValue("branchName", null)
//     // setSelectedCompany(null)
//     // setSelectedBranch(null)
//   }

//   const handleCompanyChange = (e) => {
//     if (isEditMode) {
//       settableEdit(true)
//     }
//     const companyId = e.target.value
//     setSelectedCompany(companyId)

//     setValue("companyName", e.target.value)
//     trigger("companyName")
//     const foundCompany = company.find((company) => company._id === companyId)

//     setTableObject((prev) => ({
//       ...prev,
//       company_id: companyId,
//       companyName: foundCompany.companyName
//     }))
//   }

//   const handleBranchChange = (e) => {
//     if (isEditMode) {
//       settableEdit(true)
//     }
//     const branchId = e.target.value
//     setSelectedBranch(branchId)
//     setShowTable(true)
//     setValue("branchName", e.target.value)
//     trigger("branchName")
//     const foundBranch = branches.find((branch) => branch._id === branchId)
//     const foundCompany = company.find(
//       (company) => company._id === foundBranch.companyName
//     )
//     console.log(foundCompany)
//     setTableObject((prev) => ({
//       ...prev,
//       branch_id: branchId,
//       branchName: foundBranch.branchName,
//       company_id: foundCompany._id,
//       companyName: foundCompany.companyName
//     }))
//   }

//   useEffect(() => {
//     if (defaultCountry) {
//       setSelectedCountry(defaultCountry)
//       setValue("country", defaultCountry.value)
//     }
//   }, [defaultCountry])

//   useEffect(() => {
//     if (
//       User &&
//       countryOptions.length > 0 &&
//       departments &&
//       departments.length > 0 &&
//       company &&
//       company.length > 0 &&
//       // branches &&
//       // branches.length > 0 &&
//       users &&
//       users.length > 0
//     ) {
//       console.log("hii")
//       setIsEditMode(true)
//       Object.entries(User).forEach(([key, value]) => {
//         if (key === "country") {
//           const country = countryOptions.find((c) => c.value === value)
//           setSelectedCountry(country)
//         }
//         if (key === "state") {
//           const state = stateOptions.find((s) => s.value === value)
//           setSelectedState(state)
//         }
//         if (key === "department") {
//           const department = departments.find((d) => d._id === value)

//           setSelectedDepartment(department)
//         }
//         if (key === "assignedto") {
//           const assigned = users.find((item) => item._id === value)
//           console.log(assigned)
//           setSelectedAssignedto(assigned)
//         }
//         if (key !== "password") {
//           setValue(key, value)
//         }
//       })
//     }
//     if (
//       Selected &&
//       company &&
//       company.length > 0 &&
//       users &&
//       users.length > 0 &&
//       countryOptions.length > 0
//     ) {
//       setShowTable(true)
//       console.log(User.selected)
//       // setTableData([
//       //   {
//       //     company_id: User.selected.company_id || "",
//       //     companyName: User.selected.companyName || "",
//       //     branch_id: User.selected.branch_id || "",
//       //     branchName: User.selected.branchName || ""
//       //   }
//       // ])
//       const tabledataWithoutId = User.selected.map(({ _id, ...rest }) => rest)
//       // setTableData(User.selected)
//       // setTableObject({
//       //   company_id: Selected.company_id || "",
//       //   companyName: Selected.companyName || "",
//       //   branch_id: Selected.branch_id || "",
//       //   branchName: Selected.branchName || ""
//       // })
//       console.log(Selected)
//       console.log(User)

//       Object.entries(Selected).forEach(([key, value]) => {
//         if (key === "company_id") {
//           const matchingCompany = company.find(
//             (company) => company._id === value
//           )

//           if (matchingCompany) {
//             setSelectedCompany(value)
//           }
//         }
//         if (key === "branchName") {
//           const branch = branches.find(
//             (branch) => branch._id === Selected.branch_id
//           )

//           if (branch) {
//             setSelectedBranch(branch._id)
//             setValue(key, branch._id)
//           }
//         }
//       })
//       // setTableData((prev) => [...prev, tableObject])
//       // setTableData(() => tableObject)
//     }
//   }, [User, departments, company, selectedCompany, branches, users])

//   console.log(tableObject)
//   console.log(tableData)
//   console.log("hii")
//   const handleEdit = (id) => {
//     settableEdit(true) // Close the edit state (or handle according to your logic)

//     const itemToEdit = tableData.find((item) => item._id === id)
//     console.log(itemToEdit)
//     if (itemToEdit) {
//       setTableObject((prev) => ({
//         ...prev,
//         _id: id,
//         companyName: itemToEdit.companyName,
//         company_id: itemToEdit?.company_id,
//         branch_id: itemToEdit?.branch_id,
//         branchName: itemToEdit?.branchName
//       }))
//       // Set the form values
//       setSelectedCompany(itemToEdit.company_id)
//       setSelectedBranch(itemToEdit.branch_id)

//       // Find index of the item being edited and set it to the state
//       const index = tableData.findIndex((item) => item._id === id)
//       setEditIndex(index)
//     }
//   }
//   console.log(selectedBranch)

//   const handleDelete = (id) => {
//     console.log(id)
//     const filtereddData = tableData.filter((item, index) => {
//       return index !== id
//     })

//     console.log(filtereddData)

//     setTableData(filtereddData)
//   }
//   console.log(tableData)

//   const profileImage = (url) => {
//     console.log(url)
//     setImageData((prevData) => ({
//       ...prevData,
//       profileUrl: url
//     }))
//   }
//   const documentImage = (url) => {
//     setImageData((prevData) => ({
//       ...prevData,
//       documentUrl: Array.isArray(url)
//         ? [...prevData.documentUrl, ...url] // Append if 'urls' is an array
//         : [...prevData.documentUrl, url] // Add the single URL if it's not an array
//     }))
//   }

//   const onSubmit = (data) => {
//     // if (process === "Registration") {
//     //   if (data) {
//     //     data.name.trim(),
//     //       data.email.trim(),
//     //       data.mobile.trim(),
//     //       data.password.trim(),
//     //       data.address.trim(),
//     //       data.pincode.trim(),
//     //       data.designation.trim()
//     //   }
//     //   console.log(imageData)
//     //   handleUserData(data, imageData, tableData)

//     // }else
//     if (process === "Edit") {
//       console.log(User)
//       console.log(data)
//       handleEditedData(data, User?._id, tableData)
//     }
//   }
//   console.log(selectedDepartment)
//   console.log(tableObject)

//   return (
//     <div
//       className="flex flex-col justify-center items-center min-h-screen p-8 bg-gray-100"
//       // style={{ backgroundImage: "url('/userbackground.jpg')" }}
//     >
//       <div className="w-full p-8 border rounded-lg shadow-lg  bg-white ">
//         <h2 className="text-2xl font-bold text-center mb-2">
//           User Registration
//         </h2>
//         {/* Display Form Message */}
//         {formMessage && (
//           <div
//             className={`mb-4 ${
//               formMessage.includes("successful")
//                 ? "text-green-500"
//                 : "text-red-500"
//             }`}
//           >
//             {formMessage}
//           </div>
//         )}
//         <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
//             <div>
//               <label className="block mb-1 font-semibold">Name</label>
//               <input
//                 type="text"
//                 {...register("name", { required: "Name is required" })}
//                 autoComplete="new-name"
//                 placeholder="Enter a name"
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none"
//               />
//               {errors.name && (
//                 <p className="text-red-500 text-sm">{errors.name.message}</p>
//               )}
//             </div>
//             {/* Email Field */}
//             <div>
//               <label className="block mb-1 font-semibold">Email</label>
//               <input
//                 type="email"
//                 {...register("email", {
//                   required: "Email is required",
//                   pattern: {
//                     value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
//                     message: "Please enter a valid email address."
//                   }
//                 })}
//                 autoComplete="new-email"
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none"
//               />
//               {errors.email && (
//                 <p className="text-red-500 text-sm">{errors.email.message}</p>
//               )}
//             </div>
//             {/* Mobile Field */}
//             <div>
//               <label className="block mb-1 font-semibold">Mobile</label>
//               <input
//                 type="tel"
//                 {...register("mobile", {
//                   pattern: {
//                     value: /^[0-9]{10}$/,

//                     message: "Please enter a valid mobile number"
//                   }
//                 })}
//                 autoComplete="new-mobile"
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none"
//               />
//               {errors.mobile && (
//                 <p className="text-red-500 text-sm">{errors.mobile.message}</p>
//               )}
//             </div>
//             {/* Date of Birth Field */}
//             <div>
//               <label className="block mb-1 font-semibold">D.O.B</label>
//               <input
//                 type="date"
//                 {...register("dateofbirth")}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
//               />
//               {errors.dateofbirth && (
//                 <span className="text-red-500 text-sm">
//                   {errors.dateofbirth.message}
//                 </span>
//               )}
//             </div>
//             {/* Blood Group Field */}
//             <div>
//               <label className="block mb-1 font-semibold">Blood Group</label>
//               <select
//                 {...register("bloodgroup")}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none"
//               >
//                 <option value="">Select a blood group</option>
//                 <option value="A+">A+</option>
//                 <option value="A-">A-</option>
//                 <option value="B+">B+</option>
//                 <option value="B-">B-</option>
//                 <option value="AB+">AB+</option>
//                 <option value="AB-">AB-</option>
//                 <option value="O+">O+</option>
//                 <option value="O-">O-</option>
//               </select>
//               {errors.bloodgroup && (
//                 <p className="text-red-500 text-sm">
//                   {errors.bloodgroup.message}
//                 </p>
//               )}
//             </div>
//             {/* Gender Field */}
//             <div>
//               <label className="block mb-1 font-semibold">Gender</label>
//               <select
//                 {...register("gender", { required: "Gender is required" })}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none"
//               >
//                 <option value="">Select a gender</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//               </select>
//               {errors.gender && (
//                 <p className="text-red-500 text-sm">{errors.gender.message}</p>
//               )}
//             </div>
//             {/* Address Field */}
//             <div>
//               <label className="block mb-1 font-semibold">Address</label>
//               <input
//                 type="text"
//                 {...register("address")}
//                 placeholder="Enter an address"
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none"
//               />
//               {errors.address && (
//                 <p className="text-red-500 text-sm">{errors.address.message}</p>
//               )}
//             </div>
//             {/* Country Field */}
//             <div>
//               <label className="block mb-1 font-semibold">Country</label>
//               <Select
//                 options={countryOptions}
//                 value={selectedCountry}
//                 onChange={(option) => {
//                   setSelectedCountry(option)
//                   setValue("country", option.value)
//                   // setSelectedState(null) // Reset state when country changes
//                 }}
//               />
//               {errors.country && (
//                 <p className="text-red-500 text-xs mt-1">Country is required</p>
//               )}
//             </div>
//             {/* State Field */}
//             <div>
//               <label className="block mb-1 font-semibold">State</label>
//               <Select
//                 options={stateOptions}
//                 value={selectedState}
//                 onChange={(option) => {
//                   setSelectedState(option)
//                   setValue("state", option.value)
//                 }}
//                 isDisabled={!selectedCountry}
//               />
//               {errors.state && (
//                 <p className="text-red-500 text-xs mt-1">State is required</p>
//               )}
//             </div>
//             {/* Pincode Field */}
//             <div>
//               <label className="block mb-1 font-semibold">Pincode</label>
//               <input
//                 type="number"
//                 {...register("pincode")}
//                 placeholder="Enter a pincode"
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none"
//               />
//               {errors.pincode && (
//                 <p className="text-red-500 text-sm">{errors.pincode.message}</p>
//               )}
//             </div>
//             {/* Joining Date Field */}
//             <div>
//               <label className="block mb-1 font-semibold">Joining Date</label>
//               <input
//                 type="date"
//                 {...register("joiningdate")}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-2 py-1 sm:text-md focus:border-gray-500 outline-none"
//               />
//               {errors.joiningdate && (
//                 <span className="text-red-500 text-sm">
//                   {errors.joiningdate.message}
//                 </span>
//               )}
//             </div>
//             {/* Resignation Field */}
//             <div>
//               <label htmlFor="designation" className="block mb-1 font-semibold">
//                 Designation
//               </label>
//               <input
//                 type="text"
//                 {...register("designation")}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
//               />
//               {errors.designation && (
//                 <span className="text-red-500 text-sm">
//                   {errors.designation.message}
//                 </span>
//               )}
//             </div>
//             <div>
//               <label htmlFor="department" className="block mb-1 font-semibold">
//                 Department
//               </label>

//               <select
//                 id="department"
//                 {...register("department")}
//                 onChange={(e) => setSelectedDepartment(e.target.value)}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
//               >
//                 <option value="">-- Select a department --</option>

//                 {departments?.map((department) => (
//                   <option key={department._id} value={department._id}>
//                     {department.department}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="relative">
//               <label htmlFor="password" className="block mb-1 font-semibold">
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   type={passwordVisible ? "text" : "password"}
//                   id="password"
//                   // {...register("password", {
//                   //   required: "Password is Required"
//                   // })}
//                   {...register("password", {
//                     // Conditionally required: true only in register mode
//                     required: !isEditMode && "Password is Required",
//                     // Optionally, you can add minLength or other rules based on your use case
//                     minLength: !isEditMode && {
//                       value: 6,
//                       message: "Password must be at least 6 characters"
//                     }
//                   })}
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none"
//                 />
//                 {/* Only show the eye icon if it's not in edit mode */}
//                 {!isEditMode && (
//                   <span
//                     className="absolute inset-y-0 right-0 flex items-center px-2 cursor-pointer"
//                     onClick={() => setPasswordVisible(!passwordVisible)}
//                   >
//                     <FontAwesomeIcon
//                       icon={passwordVisible ? faEyeSlash : faEye}
//                     />
//                   </span>
//                 )}
//               </div>
//               {errors.password && (
//                 <p className="mt-2 text-sm text-red-600">
//                   {errors.password.message}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label htmlFor="role" className="block mb-1 font-semibold">
//                 Role
//               </label>
//               <select
//                 {...register("role", { required: true })}
//                 className="w-full mt-1 block border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none"
//               >
//                 <option value="Staff">Staff</option>
//                 <option value="Admin">Admin</option>
//               </select>
//             </div>

//             <div>
//               <label htmlFor="assignedto" className="block mb-1 font-semibold">
//                 Assigned to
//               </label>
//               <select
//                 {...register("assignedto")}
//                 className="w-full mt-1 block border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none max-h-40 overflow-y-auto"
//               >
//                 <option value="">-assignedto --</option>

//                 {users?.map((user) => (
//                   <option key={user._id} value={user._id}>
//                     {user.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             {/* Verified Field */}
//             <div>
//               <label className="block mb-1 font-semibold">Verified</label>
//               <select
//                 {...register("verified", { required: true })}
//                 className="w-full mt-1 block border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none"
//               >
//                 <option value={true}>True</option>
//                 <option value={false}>False</option>
//               </select>
//             </div>

//             <ImageInput onSelect={profileImage} tag={"UploadProfile"} />
//             <ImageInput onSelect={documentImage} tag={"UploadDocument"} />
//           </div>

//           <div className="mt-5">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
//               <div>
//                 <label
//                   htmlFor="companyName"
//                   className="block mb-1 font-semibold"
//                 >
//                   Select Company
//                 </label>

//                 <select
//                   id="companyName"
//                   {...register("companyName", {
//                     required: "Company is required"
//                   })}
//                   onChange={handleCompanyChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
//                 >
//                   <option value="">-- Select a company --</option>

//                   {company?.map((company) => (
//                     <option key={company._id} value={company._id}>
//                       {company.companyName}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.companyName && (
//                   <p className="text-red-500 text-sm">
//                     {errors.companyName.message}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label
//                   htmlFor="branchName"
//                   className="block mb-1 font-semibold"
//                 >
//                   Select Branch
//                 </label>

//                 <select
//                   id="branchName"
//                   {...register("branchName", {
//                     required: "branch is required"
//                   })}
//                   onChange={handleBranchChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
//                 >
//                   <option value="">-- Select a Branch--</option>

//                   {branches?.map((branch) => (
//                     <option key={branch._id} value={branch._id}>
//                       {branch.branchName}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.branchName && (
//                   <p className="text-red-500 text-sm">
//                     {errors.branchName.message}
//                   </p>
//                 )}
//               </div>

//               {/* <div>
//                 <label
//                   htmlFor="sectionName"
//                   className="block mb-1 font-semibold"
//                 >
//                   Section
//                 </label>

//                 <select
//                   id="sectionName"
//                   {...register("sectionName", {
//                     required: "Section is required"
//                   })}
//                   onChange={handleSectionChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
//                 >
//                   <option value="">-- Select Section--</option>

//                   {sections?.map((section) => (
//                     <option key={section._id} value={section._id}>
//                       {section.brand}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.sectionName && (
//                   <p className="text-red-500 text-sm">
//                     {errors.sectionName.message}
//                   </p>
//                 )}
//               </div> */}
//             </div>
//             {showTable && (
//               <div>
//                 <div className="mt-6">
//                   <button
//                     type="button"
//                     onClick={handleTableData}
//                     className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
//                   >
//                     {isEditMode ? "UPDATE" : "ADD"}
//                   </button>
//                 </div>

//                 <div className="mt-6 w-lg overflow-y-auto">
//                   <table className="bg-green-300 w-full divide-y divide-gray-200  ">
//                     <thead>
//                       <tr className="text-center">
//                         <th className="  py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Company Name
//                         </th>
//                         <th className=" px-5 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Branch Name
//                         </th>

//                         <th className="px-4  py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Edit
//                         </th>
//                         <th className="px-5  py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Delete
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200 ">
//                       {tableData?.map((item, index) => (
//                         <tr key={index} className="text-center">
//                           <td className=" py-4 whitespace-nowrap text-sm text-gray-500">
//                             {item?.companyName}
//                           </td>

//                           <td className=" py-4 whitespace-nowrap text-sm text-gray-500">
//                             {item?.branchName}
//                           </td>

//                           <td className=" py-4 whitespace-nowrap text-sm font-medium">
//                             <button
//                               type="button"
//                               className="text-green-600 hover:text-green-900 mr-2" // Adjust styles as needed
//                             >
//                               <FaEdit onClick={() => handleEdit(item._id)} />
//                             </button>
//                           </td>

//                           <td className=" py-4 whitespace-nowrap text-sm font-medium">
//                             <button
//                               type="button"
//                               className="text-blue-600 hover:text-blue-900"
//                             >
//                               <FaTrash onClick={() => handleDelete(index)} />
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="flex justify-center">
//             <button
//               type="submit"
//               className=" mt-7 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
//             >
//               {isEditMode ? "Update" : "Register"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default UserAdd
