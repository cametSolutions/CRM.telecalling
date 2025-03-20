import React, { useEffect, useState, useMemo } from "react"
import Select from "react-select"
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
    formState: { errors }
  } = useForm()

  const [selectedCompany, setSelectedCompany] = useState([])
  const [filteredProduct, setFilteredProduct] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState("")
  const [branches, setBranches] = useState([])
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
  const [tableData, setTableData] = useState([])
  const [allStaffs, setallStaffs] = useState([])
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

  const { data: productData, error: productError } = UseFetch(
    "/product/getallProducts"
  )
  const { data } = UseFetch("/auth/getallUsers")
  console.log(productData)
  const { data: customerData } = UseFetch(
    users && users.role === "Admin"
      ? "customer/getallCustomer"
      : branches && branches.length > 0
      ? `/customer/getallCustomer?userbranch=${encodeURIComponent(branches)}`
      : null
  )
  console.log(branches)
  console.log(customerData)
  // const a = customerData?.filter((item)=>item.)
  const accuanetCustomers = customerData?.filter((customer) =>
    customer.selected.some((selection) => selection.branchName === "ACCUANET")
  )
  console.log(accuanetCustomers)
  const cammetCustomers = customerData?.filter((customer) =>
    customer.selected.some((selection) => selection.branchName === "CAMET")
  )
  console.log(cammetCustomers)
  const hasCammetBranch = customerData?.some((customer) =>
    customer.selected.some((selection) => selection.branchName === "CAMET")
  )
  console.log(hasCammetBranch)
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
    if (data) {
      const { allusers = [], allAdmins = [] } = data

      // Combine allusers and allAdmins
      const combinedUsers = [...allusers, ...allAdmins]

      // Set combined names to state
      setallStaffs(combinedUsers)
    }
  }, [data])
  console.log(allStaffs)
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
  console.log(branches)

  const handleEdit = (id) => {
    seteditState(false)
    const itemToEdit = data.products.find((item) => item._id === id)
    if (itemToEdit) {
      setValue("productName", itemToEdit.productName)
      setValue("productPrice", itemToEdit.productPrice)
      setValue("description", itemToEdit.description)
      setValue("company", itemToEdit.company)
      setValue("branch", itemToEdit.branch)
      setValue("brand", itemToEdit.brand)
      setValue("category", itemToEdit.category)
      setValue("hsn", itemToEdit.hsn)
      // Store the ID of the product being edited
    }
  }
  const handleBranchChange = (e) => {
    const branchId = e.target.value
    console.log("fotbraa", filteredBranches)
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

  const customerOptions = customerData?.map((item) => ({
    value: item?._id,
    label: item?.customerName,
    mobile: item?.mobile
  }))
  function generateUniqueNumericToken(length = 5) {
    const timestamp = Math.floor(Date.now() / 1000) // Current time in seconds
    const randomPart = Math.floor(Math.random() * 10 ** (length - 6)) // Random number with remaining digits
    const token = `${timestamp % 10 ** 6}${randomPart
      .toString()
      .padStart(length - 6, "0")}` // Ensure length

    return token
  }
  console.log(generateUniqueNumericToken())

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
    console.log("daaaaaaaaa", data)
    event.preventDefault()

    try {
      if (process === "Registration") {
        console.log("tabledata", tableData)
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

  return (
    <div className="container justify-center items-center  p-2 md:p-8">
      <div className="w-auto bg-white shadow-lg rounded p-5 md:p-8 mx-auto">
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

            {/* Product Price */}
            <div>
              <label
                htmlFor="leadDate"
                className="block text-sm font-medium text-gray-700"
              >
                Lead Date
              </label>
              <input
                id="leadDate"
                type="Date"
                {...register("leadDate")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none focus:border-gray-500"
                placeholder=""
              />
            </div>

            {/* Customer Select Dropdown */}
            <div>
              <label
                htmlFor="customerName"
                className="block text-sm  font-medium text-gray-700"
              >
                Customer Name
              </label>
              <Select
                options={customerOptions}
                getOptionLabel={(option) => option.label} // Show only customer name
                getOptionValue={(option) => option._id}
                filterOption={customFilter} // Enable searching by name & mobile
                onChange={(selectedOption) =>
                  setValue("customerName", selectedOption.value)
                }
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
            </div>
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
                placeholder="Mobile..."
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
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location
              </label>
              <input
                id="location"
                {...register("location")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none focus:border-gray-500"
                placeholder="Location..."
              ></input>
            </div>
            <div>
              <label
                htmlFor="pincode"
                className="block text-sm font-medium text-gray-700"
              >
                Pincode
              </label>
              <input
                id="pincode"
                {...register("pincode")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none focus:border-gray-500"
                placeholder="Pincode..."
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

            {/* Category Select Dropdown */}
            <div>
              <label
                htmlFor="leadFor"
                className="block text-sm font-medium text-gray-700"
              >
                Lead for(Products)
              </label>

              <select
                id="leadFor"
                {...register("leadFor")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
              >
                <option value="">-- Select a Product</option>

                {filteredProduct?.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.productName}
                  </option>
                ))}
              </select>
            </div>
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
      </div>
    </div>
  )
}

export default LeadMaster
