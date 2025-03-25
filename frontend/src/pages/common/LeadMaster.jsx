import React, { useEffect, useState, useMemo } from "react"

import LoadingBar from "react-top-loading-bar"
import Select, { useStateManager } from "react-select"
import { useForm } from "react-hook-form"
import UseFetch from "../../hooks/useFetch"
import { toast } from "react-toastify"
import { FaTrash, FaEdit } from "react-icons/fa" // Import icons
import { use } from "react"

const LeadMaster = ({
  process,

  handleleadData,
  handleEditedData
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm()
  const [showDropdown, setShowDropdown] = useState(false)
  const [tabledata, setTableData] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [selectedLicenses, setSelectedLicenses] = useState([])
  const [selectedOption, setSelectedOption] = useState("Products")
  const [filteredProduct, setFilteredProduct] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [customerOptions, setCustomerOptions] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState("")
  const [branches, setBranches] = useState([])
  const [customerTableData, setcustomerTableData] = useState([])

  // const [dd, setd] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState(false)
  const [editObject, setEditObject] = useState({
    brands: {},
    categories: {},
    hsn: {}
    // products: [],
  })
  const [showTable, setShowTable] = useState(false)
  const [users, setUsers] = useState(null)
  const [allStaffs, setallStaffs] = useState([])
  const [allcustomer, setallcustomer] = useState([])
  // State to toggle the table
  const [editState, seteditState] = useState(true)

  const [tableObject, setTableObject] = useState({
    company_id: "",
    companyName: "",
    branch_id: "",
    branchName: "",
    brand_id: "",
    brandName: "",
    category_id: "",
    categoryName: "",
    hsn_id: "",
    hsnName: ""
  })

  const { data: productData, loading: productLoading } = UseFetch(
    "/product/getallProducts"
  )
  const { data, loading: usersLoading } = UseFetch("/auth/getallUsers")
  const { data: customerData, loading: customerLoading } = UseFetch(
    users && users.role === "Admin"
      ? "customer/getallCustomer"
      : branches && branches.length > 0
      ? `/customer/getallCustomer?userbranch=${encodeURIComponent(branches)}`
      : null
  )

  const a = customerData?.filter(
    (item) => item.customerName === "CAPSON MARKETING"
  )
  const accuanetCustomers = customerData?.filter((customer) =>
    customer.selected.some((selection) => selection.branchName === "ACCUANET")
  )
  const cammetCustomers = customerData?.filter((customer) =>
    customer.selected.some((selection) => selection.branchName === "CAMET")
  )
  const hasCammetBranch = customerData?.some((customer) =>
    customer.selected.some((selection) => selection.branchName === "CAMET")
  )
  useEffect(() => {
    const userData = localStorage.getItem("user")
    const user = JSON.parse(userData)
    if (user.role === "Staff") {
      const branch = user.selected.map((branch) => branch.branch_id)
      const branches = JSON.stringify(branch)

      setBranches(branches)
    }

    setUsers(user)
  }, [])
  useEffect(() => {
    if (customerData && customerData.length > 0) {
      setallcustomer(customerData)
    }
  }, [customerData])
  // useEffect(() => {
  //   if (customerTableData && customerTableData.length > 0) {
  //     const matchingCustomers = customerTableData
  //     ?.filter((customer) =>
  //       customer.selected.some((item) => item.product_id === productId)
  //     )
  //     .flatMap((customer) =>
  //       customer.selected
  //         .filter((item) => item.product_id === productId)
  //         .map((item) => ({
  //           productName: item.productName,
  //           licensenumber: item.licensenumber
  //         }))
  //     )
  //   }
  // }, [customerTableData])
  useEffect(() => {
    if (customerData) {
      setCustomerOptions(
        customerData.map((item) => ({
          value: item?._id,
          label: item?.customerName,
          mobile: item?.mobile
        }))
      )
    }
  }, [customerData])
  console.log("yyyyyyyyyyyyy", customerTableData)
  useEffect(() => {
    if (data) {
      const { allusers = [], allAdmins = [] } = data

      // Combine allusers and allAdmins
      const combinedUsers = [...allusers, ...allAdmins]

      // Set combined names to state
      setallStaffs(combinedUsers)
    }
  }, [data])
  useEffect(() => {
    if (productData && productData.length > 0 && users) {
      if (users.role === "Staff") {
        const filteredProducts = productData.filter((product) =>
          product.selected.some((selection) =>
            branches.includes(selection.branch_id)
          )
        )
        setFilteredProduct(filteredProducts)
      } else if (users.role === "Admin") {
        setFilteredProduct(productData)
      }
    }
  }, [productData, users])
  useEffect(() => {
    if (productLoading || usersLoading || customerLoading) {
      setProgress(50) // Mid-way loading
    } else {
      setProgress(100) // Complete when all are loaded
    }
  }, [productLoading, usersLoading, customerLoading])

  const handleToggle = () => {
    setSelectedOption((prev) => (prev === "Products" ? "Services" : "Products"))
  }

  const handleSelectedCustomer = (name) => {
    const filteredcustomer = allcustomer
      ?.filter((item) => item.customerName === name) // Filter customers by name
      ?.flatMap((item) =>
        item.selected.map((sel) => ({
          licensenumber: sel.licensenumber || "N/A",
          productName: sel.productName || "Unknown"
        }))
      )
    console.log("filttttttttttttttt", filteredcustomer)

    setcustomerTableData(filteredcustomer)
  }

  const handleProductSelect = (productId, productName, isChecked) => {
    setTableData((prevData) => {
      let updatedData = [...prevData]

      if (isChecked) {
        const data = [...productName, ...selectedLicenses]
        console.log("dataaaaaaaaaaaaaa", data)
      } else {
        // If unchecked, remove the corresponding product from the table
        updatedData = prevData.filter(
          (item) => item.productName !== productName
        )
      }

      return updatedData
    })

    // if (isChecked) {
    //   updatedSelection.push(productId) // ✅ Add product if checked
    // } else {
    //   updatedSelection = updatedSelection.filter((id) => id !== productId) // ❌ Remove product if unchecked
    // }
    // setValue("leadFor", updatedSelection, {
    //   shouldValidate: true,
    //   shouldDirty: true
    // })
  }
  const handleBranchChange = (e) => {
    const branchId = e.target.value
    const selectedBranch = filteredBranches.find(
      (branch) => branch._id === branchId
    )
    const branchName = selectedBranch.branchName

    setTableObject((prev) => ({
      ...prev,
      branch_id: branchId,
      branchName: branchName
    }))
    setSelectedBranch(true)
    setValue("branch", branchId) // Update the value in react-hook-form
  }
  const handleCheckboxChange = (e, licensenumber) => {
    setSelectedLicenses(
      (prev) =>
        e.target.checked
          ? [...prev, licensenumber] // Add license number if checked
          : prev.filter((num) => num !== licensenumber) // Remove if unchecked
    )
  }

  const customFilter = (option, inputValue) => {
    if (!inputValue) return true
    // Convert to lowercase for case-insensitive search
    const searchValue = inputValue.toLowerCase()
    const label = option.label ? String(option.label).toLowerCase() : "" // Ensure label is a string
    // const label = option.label ? option.label.toLowerCase() : ""
    const mobile = option.data?.mobile ? option.data?.mobile.toLowerCase() : ""
    return (
      label.includes(searchValue) || // Search by name
      mobile.includes(searchValue) // Search by mobile number
    )
  }

  const onSubmit = async (data, event) => {
    event.preventDefault()

    try {
      if (process === "Registration") {
        await handleleadData(data)
      } else if (process === "edit") {
        await handleEditedData(data, tableObject)
      }
      // Refetch the product data
    } catch (error) {
      console.log("error on onsubmit")
      toast.error("Failed to add product!")
    }
  }
  console.log("hhh")
  return (
    <div className="h-full overflow-y-auto container justify-center items-center  p-2 md:p-8 ">
      {/* Top Loading Bar */}
      {/* <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      /> */}

      <div
        className="w-auto bg-white shadow-lg rounded p-5 md:p-8 mx-auto"
        // style={{
        //   opacity: productLoading || usersLoading || customerLoading ? 0.2 : 1,
        //   pointerEvents:
        //     productLoading || usersLoading || customerLoading ? "none" : "auto",
        //   transition: "opacity 0.3s ease-in-out"
        // }}
      >
        <h2 className="text-md md:text-2xl font-semibold mb-2 md:mb-6">
          Lead Master
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 md:gap-6 md:m-5">
            {/* Other Input Fields */}
            {process === "edit" && (
              <div>
                <label
                  htmlFor="leadId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Lead Id
                </label>
                <input
                  id="leadId"
                  type="text"
                  {...register("leadId")}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none focus:border-gray-500"
                  placeholder="Lead Id..."
                />
                {errors.leadId && (
                  <span className="mt-2 text-sm text-red-600">
                    {errors.leadId.message}
                  </span>
                )}
              </div>
            )}

            {/* Customer Select Dropdown */}
            <div>
              <label
                htmlFor="customerName"
                className="block text-sm  font-medium text-gray-700"
              >
                Customer Name
              </label>
              <div className="flex">
                <Select
                  options={customerOptions}
                  getOptionLabel={(option) =>
                    `${option.label}-(${option.mobile})`
                  } // Show only customer name
                  getOptionValue={(option) => option._id}
                  filterOption={customFilter} // Enable searching by name & mobile
                  onChange={(selectedOption) => {
                    handleSelectedCustomer(selectedOption.label)
                    setValue("customerName", selectedOption.value)
                  }}
                  className="w-full"
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
                <button
                  type="button" // Prevents form submission
                  onClick={() => setModalOpen(true)}
                  className="bg-blue-500 hover:bg-blue-600 py-1 px-4 rounded-md"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Table (Fixed Height & Above Other Inputs) */}
            {customerTableData && customerTableData.length > 0 && (
              <div className=" w-full bg-white shadow-lg rounded-md border border-gray-300 z-50">
                <table className="w-full border border-gray-300 rounded-md shadow-sm">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="border p-2 text-left text-sm font-medium text-gray-700">
                        License No
                      </th>
                      <th className="border p-2 text-left text-sm font-medium text-gray-700">
                        Product Name
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerTableData?.map((item, index) => (
                      <tr key={item.licensenumber || index} className="border">
                        <td className="border p-2">
                          <input
                            type="checkbox"
                            className="mr-2"
                            onChange={(e) =>
                              handleCheckboxChange(e, item.licensenumber)
                            }
                          />
                          {item?.licensenumber || "N/A"}
                        </td>
                        <td className="border p-2">{item?.productName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div>
              <label
                htmlFor="mobile"
                className="block text-sm font-medium text-gray-700"
              >
                Mobile
              </label>
              <input
                id="mobile"
                {...register("mobile")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none focus:border-gray-500"
                placeholder="Mobile..."
              ></input>
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <input
                id="phone"
                {...register("phone")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none focus:border-gray-500"
                placeholder="Landline..."
              ></input>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                {...register("email")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none focus:border-gray-500"
                placeholder="Email..."
              ></input>
            </div>

            <div>
              <label
                htmlFor="trade"
                className="block text-sm font-medium text-gray-700"
              >
                Trade
              </label>
              <input
                id="trade"
                {...register("trade")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none focus:border-gray-500"
                placeholder="Trade..."
              ></input>
            </div>

            <div className="relative">
              {/* Toggle Switch */}
              <div className="flex justify-between">
                <label
                  htmlFor="leadFor"
                  className="block text-sm font-medium text-gray-700"
                >
                  Lead for-
                  {`(${
                    selectedOption === "Products" ? "Products" : "Services"
                  })`}
                </label>

                <div className="flex items-center">
                  <span className="text-gray-600 mr-2 font-bold">
                    {selectedOption === "Products" ? "Products" : "Services"}
                  </span>
                  <button
                    type="button"
                    onClick={handleToggle}
                    className={`${
                      selectedOption === "Products"
                        ? "bg-green-500"
                        : "bg-gray-300"
                    } w-11 h-6 flex items-center rounded-full transition-colors duration-300`}
                  >
                    <div
                      className={`${
                        selectedOption === "Products"
                          ? "translate-x-5"
                          : "translate-x-0"
                      } w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300`}
                    ></div>
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none text-left"
              >
                {selectedOption === "Products"
                  ? "--select Products--"
                  : "--select Services--"}
              </button>
              {showDropdown && (
                <div className="absolute z-50 bg-white border border-gray-300 rounded-md shadow-lg w-full mt-1 max-h-60 overflow-auto">
                  {filteredProduct?.map((product) => {
                    const selectedValues = watch("leadFor") || [] // ✅ Get selected values

                    return (
                      <label
                        key={product._id}
                        className="flex items-center px-2 py-1 hover:bg-gray-100"
                      >
                        <input
                          type="checkbox"
                          value={product._id}
                          checked={selectedValues.includes(product._id)} // ✅ Ensures checked state
                          onChange={(e) => {
                            const newValues = e.target.checked
                              ? [...selectedValues, product._id] // ✅ Add checked value
                              : selectedValues.filter(
                                  (id) => id !== product._id
                                ) // ❌ Remove unchecked value

                            setValue("leadFor", newValues, {
                              shouldDirty: true,
                              shouldValidate: true
                            }) // ✅ Update form values
                            handleProductSelect(
                              product._id,
                              product.productName,
                              e.target.checked
                            ) // ✅ Call function
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-200"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {product.productName}
                        </span>
                      </label>
                    )
                  })}

                  {/* Hidden input to store selected products inside form */}
                  <input
                    type="hidden"
                    {...register("leadFor")}
                    value={JSON.stringify(selectedProducts)}
                  />
                </div>
              )}
            </div>
            {tabledata && tabledata.length > 0 && (
              <div className="col-span-1 sm:col-span-1 mt-6">
                <table className="w-full border border-gray-300 rounded-md shadow-sm">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="border p-2 text-left text-sm font-medium text-gray-700">
                        License No
                      </th>
                      <th className="border p-2 text-left text-sm font-medium text-gray-700">
                        Product Name
                      </th>
                      <th className="border p-2 text-left text-sm font-medium text-gray-700">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tabledata?.map((item, index) => (
                      <tr key={index} className="border">
                        <td className="border p-2">{item?.licensenumber}</td>
                        <td className="border p-2">{item?.productName}</td>
                        <td className="border p-2">{item?.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div>
              <label
                htmlFor="remark"
                className="block text-sm font-medium text-gray-700"
              >
                Remark
              </label>
              <textarea
                id="description"
                {...register("remark")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none focus:border-gray-500"
                placeholder="Remarks..."
              ></textarea>
            </div>

            {/* HSN Select Dropdown */}
            <div>
              <label
                htmlFor="allocatedTo"
                className="block text-sm font-medium text-gray-700"
              >
                Allocated To
              </label>

              <select
                id="allocatedTo"
                {...register("allocatedTo")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
              >
                <option value="">-- Select User--</option>

                {allStaffs?.map((staff) => (
                  <option key={staff._id} value={staff._id}>
                    {staff.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 justify-center items-center text-center">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              {process === "Registration" ? "SUBMIT" : "UPDATE"}
            </button>
          </div>
        </form>
        {modalOpen && (
          <div className="fixed top-16 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center px-4">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] z-50 overflow-auto">
              <h2 className="text-lg font-semibold mb-4 text-center">
                Add New Customer
              </h2>

              <form>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Customer Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300"
                      placeholder="Customer Name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300"
                      placeholder="Email"
                    />
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mobile
                    </label>
                    <input
                      type="tel"
                      className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300"
                      placeholder="Mobile"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300"
                      placeholder="Phone"
                    />
                  </div>

                  {/* Address */}
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <textarea
                      className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300"
                      placeholder="Address"
                    ></textarea>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <select className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300">
                      <option value="">Select Country</option>
                      <option value="India">India</option>
                      <option value="USA">USA</option>
                    </select>
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <select className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300">
                      <option value="">Select State</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="California">California</option>
                    </select>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300"
                      placeholder="City"
                    />
                  </div>

                  {/* Pincode */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Pincode
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300"
                      placeholder="Pincode"
                    />
                  </div>

                  {/* Contact Person */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300"
                      placeholder="Contact Person"
                    />
                  </div>

                  {/* Types of Industry Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Types of Industry
                    </label>
                    <select className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300">
                      <option value="">Select Industry</option>
                      <option value="Agriculture">Agriculture</option>
                      <option value="IT">IT</option>
                    </select>
                  </div>

                  {/* Partnership Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Partnership Type
                    </label>
                    <select className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300">
                      <option value="">Select Partnership Type</option>
                      <option value="Sole Proprietorship">
                        Sole Proprietorship
                      </option>
                      <option value="Partnership">Partnership</option>
                    </select>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-6 flex justify-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LeadMaster
