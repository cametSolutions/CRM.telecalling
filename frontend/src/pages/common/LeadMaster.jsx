import React, { useEffect, useState, useRef } from "react"
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
  const [addedproductlist, setAddedProducts] = useState([])
  const [openDropdown, setOpenDropdown] = useState(null) // Track which dropdown is open
  const [tabledata, setTableData] = useState([])
  const [selectedProducts, setSelectedProducts] = useState(null)
  const [selectedleadlist, setSelectedLeadList] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [selectedLicense, setSelectedLicense] = useState(null)
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
  // Create a ref for the dropdown container
  const dropdownRef = useRef(null)
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
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(null)
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside)

    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
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
          mobile: item?.mobile || ""
        }))
      )
    }
  }, [customerData])
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
  useEffect(() => {
    if (selectedProducts && selectedLicense) {
      const mergedproductsandlicense = []
      mergedproductsandlicense.push({
        productName: selectedProducts.productName,
        licensenumber: selectedLicense,
        price: selectedProducts.productPrice
      })
      setSelectedLeadList(mergedproductsandlicense)
    }
  }, [selectedProducts, selectedLicense])

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

    setcustomerTableData(filteredcustomer)
  }

  const handleProductSelect = (productId, productName, isChecked) => {
    const mergeprodcutandlicensenumber = []
    mergeprodcutandlicensenumber.push({ productName, selectedLicense })

    setSelectedProducts(mergeprodcutandlicensenumber)
  }
  const handleDelete = (name) => {
    const filteredLeadlist = selectedProducts.filter(
      (item) => item.productName !== name
    )
    setSelectedProducts(filteredLeadlist)
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
    setSelectedLicense(licensenumber)
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
  const handlePriceChange = (index, newPrice) => {
    const updatedList = [...selectedleadlist]
    updatedList[index].price = newPrice
    setSelectedLeadList(updatedList)
  }
  const handleAddToTable = (product) => {
    setAddedProducts((prev) => [...prev, product]) // Store added products
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
                placeholder="Landline...dddddddd"
              ></input>
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
                placeholder="Email...ddddd"
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
          </div>
          <div className="flex justify-between gap-3">
            {/* License Selection Dropdown */}
            {customerTableData && customerTableData.length > 0 && (
              <div className="w-1/3">
                <label className="block text-sm font-medium text-gray-700">
                  Select License
                </label>
                <select
                  className="w-full border rounded-md bg-white px-2 py-1.5"
                  value={selectedLicense} // ✅ Keeps only the selected license number
                  onChange={(e) => setSelectedLicense(e.target.value)}
                >
                  <option value="">Select License</option>
                  {customerTableData.map((item, index) => (
                    <option
                      key={item.licensenumber || index}
                      value={item.licensenumber}
                    >
                      {`${item.licensenumber}-${item.productName}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Lead for Toggle & Product Selection */}
            <div className="relative w-1/3" ref={dropdownRef}>
              <label
                htmlFor="leadFor"
                className="block text-sm font-medium text-gray-700"
              >
                Lead for
              </label>
              <select
                className="w-full border rounded-md bg-white px-2 py-1.5"
                value={selectedProducts ? selectedProducts._id : ""}
                onChange={(e) => {
                  const selectedProduct = filteredProduct.find(
                    (item) => item._id === e.target.value
                  )
                  setSelectedProducts(selectedProduct || null) // Store full product details
                }}
              >
                <option value="">Select a Product</option>
                {filteredProduct.map((item, index) => (
                  <option key={item.productName || index} value={item._id}>
                    {item.productName}
                  </option>
                ))}
              </select>
            </div>
            {selectedleadlist?.map((product, index) => (
              <div className="text-center w-full" key={index}>
                <label className="block ">Selected Lead</label>
                <div
                  key={index}
                  className="grid grid-cols-[3fr_3fr_2fr_1fr]  gap-2 mb-2"
                >
                  <input
                    type="text"
                    value={product.licensenumber}
                    className="border p-2 rounded w-full"
                    readOnly
                    placeholder="Serial Number"
                  />
                  <input
                    type="text"
                    value={product.productName}
                    className="border p-2 rounded w-full"
                    readOnly
                    placeholder="Product Name"
                  />
                  <input
                    type="number"
                    value={product.price}
                    onChange={(e) => handlePriceChange(index, e.target.value)}
                    className="border p-2 rounded w-full"
                    placeholder="Price"
                  />

                  <button
                    onClick={() => handleAddToTable(product)}
                    className="bg-blue-500 text-white  p-2 rounded hover:bg-blue-600 transition-colors"
                    type="button"
                  >
                    ADD
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <label
                htmlFor="remark"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Remark
              </label>
              <textarea
                id="description"
                {...register("remark")}
                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none focus:border-gray-500 "
                placeholder="Remarks..."
              ></textarea>
            </div>
            {addedproductlist.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Added Products
                </label>

                <div className="border rounded-md overflow-hidden max-h-[250px] overflow-y-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100 border-b sticky top-0">
                        <th className="p-2 text-left">License Number</th>
                        <th className="p-2 text-left">Product Name</th>
                        <th className="p-2 text-left">Price</th>
                        <th className="p-2 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {addedproductlist.map((product, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-2">{product.licensenumber}</td>
                          <td className="p-2">{product.productName}</td>
                          <td className="p-2">{product.price}</td>
                          <td className="p-2 flex justify-center space-x-2">
                            <button
                              type="button"
                              onClick={() => handleEditProduct(product)}
                              className="text-blue-500 hover:text-blue-700"
                              title="Edit Product"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                              >
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(product)}
                              className="text-red-500 hover:text-red-700"
                              title="Delete Product"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                              >
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                              </svg>
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
          <div className="justify-center items-center text-center">
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
