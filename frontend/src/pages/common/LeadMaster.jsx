import React, { useEffect, useState, useRef } from "react"
import LoadingBar from "react-top-loading-bar"
import ExcelJS from "exceljs"
import { saveAs } from "file-saver"
import Select, { useStateManager } from "react-select"
import { useForm } from "react-hook-form"
import UseFetch from "../../hooks/useFetch"

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
  const [productSelections, setProductSelections] = useState({})
  const [editMode, setEditMode] = useState(false)
  const [licensewithoutProductSelection, setlicenseWithoutProductSelection] =
    useState({})

  const [selectedProducts, setSelectedProducts] = useState(null)
  const [selectedleadlist, setSelectedLeadList] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [selectedLicense, setSelectedLicense] = useState(null)
  const [filteredProduct, setFilteredProduct] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [customerOptions, setCustomerOptions] = useState([])
  const [isleadForOpen, setIsleadForOpen] = useState(false)
  const [isLicenseOpen, setIslicenseOpen] = useState(false)
  const [branches, setBranches] = useState([])
  const [customerTableData, setcustomerTableData] = useState([])
  //State for added products

  // const [dd, setd] = useState(false)

  const [loggeduser, setloggedUser] = useState(null)
  const [allstaff, setallStaffs] = useState([])

  const [allcustomer, setallcustomer] = useState([])
  // State to toggle the table
  const [editState, seteditState] = useState(true)

  // Create a ref for the dropdown container
  const dropdownRef = useRef(null)
  const { data: productData, loading: productLoading } = UseFetch(
    "/product/getallProducts"
  )
  console.log(allstaff)
  const { data: serviceData } = UseFetch("/product/getallServices")
  const { data: allusers } = UseFetch("/auth/getallUsers")
  const { data, loading: usersLoading } = UseFetch("/auth/getallUsers")
  const { data: customerData, loading: customerLoading } = UseFetch(
    loggeduser && loggeduser.role === "Admin"
      ? "customer/getallCustomer"
      : branches && branches.length > 0
      ? `/customer/getallCustomer?userbranch=${encodeURIComponent(branches)}`
      : null
  )
  console.log(customerData)

  useEffect(() => {
    if (allusers && allusers.length > 0) {
      const { allusers = [], allAdmins = [] } = data

      // Combine allusers and allAdmins
      const combinedUsers = [...allusers, ...allAdmins]

      // Set combined names to state
      setallStaffs(combinedUsers)
    }
  }, [allusers])
  useEffect(() => {
    if (loggeduser?._id) {
      setValue("leadBy", loggeduser._id) // Manually set the value
    }
  }, [loggeduser, setValue])
  useEffect(() => {
    const userData = localStorage.getItem("user")
    console.log("daaaaaaaaaaaaaaa", userData)
    if (userData) {
      const user = JSON.parse(userData)
      setloggedUser(user)
      if (user.role === "Staff") {
        const branch = user.selected.map((branch) => branch.branch_id)
        const branches = JSON.stringify(branch)

        setBranches(branches)
      }
    }
  }, [])
  // Close dropdown when clicking outside

  useEffect(() => {
    if (customerData && customerData.length > 0) {
      setallcustomer(customerData)
    }
  }, [customerData])

  useEffect(() => {
    if (customerData) {
      console.log(customerData)
      setCustomerOptions(
        customerData.map((item) => ({
          value: item?._id,
          label: item?.customerName,
          mobile: item?.mobile || "",
          email: item?.email,
          phone: item?.landline
        }))
      )
    }
  }, [customerData])
  console.log(customerOptions)
  useEffect(() => {
    if (selectedCustomer) {
      console.log(selectedCustomer)
      setValue("mobile", selectedCustomer.mobile)
      setValue("phone", selectedCustomer.phone)
      setValue("email", selectedCustomer.email)
    }
  }, [selectedCustomer])
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
    if (productData && productData.length > 0 && loggeduser) {
      if (loggeduser.role === "Staff") {
        const filteredProducts = productData.filter((product) =>
          product.selected.some((selection) =>
            branches.includes(selection.branch_id)
          )
        )
        setFilteredProduct(filteredProducts)
      } else if (loggeduser.role === "Admin") {
        setFilteredProduct(productData)
      }
    }
  }, [productData, loggeduser])
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
        licenseNumber: selectedLicense,
        price: selectedProducts.productPrice
      })
      setSelectedLeadList(mergedproductsandlicense)
    }
  }, [selectedProducts, selectedLicense])
  useEffect(() => {
    setValue("netAmount", calculateTotalAmount())
  }, [selectedleadlist])
  useEffect(() => {
    if (!selectedLicense && productData && productData.length > 0) {
      const initialProductListwithoutlicense = productData?.map((product) => ({
        ...product,
        selected: false
      }))

      setlicenseWithoutProductSelection(initialProductListwithoutlicense)
    }
  }, [productData])
  const handleLicenseSelect = (license) => {
    // Ensure all products are initialized for this license if not already
    if (!productSelections[license]) {
      const initialProductList = productData.map((product) => ({
        ...product,
        selected: false
      }))

      setProductSelections((prev) => ({
        ...prev,
        [license]: initialProductList
      }))
    }
    setIslicenseOpen(false) // Close dropdown
    setSelectedLicense(license)
  }
  // const handleDownloadFailedData = () => {
  //   if (customerData.length > 0) {
  //     // Create a new workbook
  //     const workbook = XLSX.utils.book_new()

  //     // Convert failed data to sheet
  //     const worksheet = XLSX.utils.json_to_sheet(customerData)

  //     // Append sheet to workbook
  //     XLSX.utils.book_append_sheet(
  //       workbook,
  //       worksheet,
  //       "customer without product"
  //     )

  //     // Generate Excel file and trigger download
  //     XLSX.writeFile(workbook, "customerwihoutproduct_data.xlsx")
  //   }
  // }

  const handleDownloadFailedData = async () => {
    if (customerData.length > 0) {
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet("Customer Without Product")

      // Define column structure
      worksheet.columns = [
        { header: "Customer Name", key: "customerName", width: 50 },
        { header: "License Number", key: "licensenumber", width: 20 }
      ]

      // Add header styling
      worksheet.getRow(1).eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFF00" } // Yellow background
        }
        cell.font = { bold: true, color: { argb: "000000" } } // Black bold text
        cell.alignment = { horizontal: "center" } // Center text
      })

      // Add data to sheet
      customerData.forEach((customer) => {
        worksheet.addRow({
          customerName: customer.customerName,
          licensenumber: customer.licensenumber || "N/A"
        })
      })

      // Write to buffer and download
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      })
      saveAs(blob, "customer_without_product.xlsx")
    }
  }

  const handleProductSelect = (productId) => {
    if (selectedLicense) {
      const updatedProductList = productSelections[selectedLicense].map(
        (product) =>
          product._id === productId
            ? { ...product, selected: !product.selected }
            : product
      )
      setProductSelections((prev) => ({
        ...prev,
        [selectedLicense]: updatedProductList
      }))
    } else {
      const updatedProductList = licensewithoutProductSelection.map((product) =>
        product._id === productId ? { ...product, selected: true } : product
      )
      setlicenseWithoutProductSelection(updatedProductList)
    }
  }
  const handleToggleDropdown = () => {
    setIsleadForOpen((prev) => !prev) // Toggle dropdown visibility
  }

  const handleSelectedCustomer = (name) => {
    const filteredcustomer = allcustomer
      ?.filter((item) => item.customerName === name) // Filter customers by name
      ?.flatMap((item) =>
        item.selected.map((sel) => ({
          licenseNumber: sel.licensenumber || "N/A",
          productName: sel.productName || "Unknown"
        }))
      )

    setcustomerTableData(filteredcustomer)
  }
  const handlePriceChange = (index, newPrice) => {
    setSelectedLeadList((prevList) =>
      prevList.map((product, i) =>
        i === index ? { ...product, price: newPrice } : product
      )
    )
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
  const calculateTotalAmount = () => {
    return selectedleadlist.reduce((total, product) => {
      return total + (Number(product.price) || 0) // Ensure price is a number and handle null values
    }, 0)
  }
  const handleAddProducts = () => {
    setSelectedLeadList((prev) => {
      let updatedList = [...prev]

      if (selectedLicense) {
        const selectedProducts = productSelections[selectedLicense]
          .filter((product) => product.selected)
          .map((product) => ({
            licenseNumber: selectedLicense,
            productName: product.productName,
            productId: product._id,
            price: product.productPrice
          }))

        // Filter out products that are already added for the selected license
        const newProducts = selectedProducts.filter(
          (product) =>
            !updatedList.some(
              (p) =>
                p.licensenumber === selectedLicense &&
                p.productId === product.productId
            )
        )

        updatedList = [...updatedList, ...newProducts]
      } else {
        const selectedProducts = licensewithoutProductSelection
          .filter((product) => product.selected)
          .map((product) => ({
            productName: product.productName,
            productId: product._id,
            price: product.productPrice
          }))

        // Filter out products that are already added (without license)
        const newProducts = selectedProducts.filter(
          (product) =>
            !updatedList.some(
              (p) => !p.licensenumber && p.productId === product.productId
            )
        )

        updatedList = [...updatedList, ...newProducts]
      }

      return updatedList
    })
  }
  const onSubmit = async (data, event) => {
    event.preventDefault()

    try {
      if (process === "Registration") {
        // console.log(selectedleadlist)
        // return
        await handleleadData(data, selectedleadlist)
      } else if (process === "edit") {
        await handleEditedData(data, tableObject)
      }
      // Refetch the product data
    } catch (error) {
      console.log("error on onsubmit")
      toast.error("Failed to add product!")
    }
  }
  console.log(allstaff)
  const a = allstaff.filter((i) => i.name === "Riyas")
  console.log(a)
  console.log(loggeduser)
  return (
    <div className="h-full overflow-y-auto container justify-center items-center  p-2 md:p-8 ">

      <div
        className="shadow-lg rounded p-2 md:p-3 mx-auto"
        style={{
          opacity: productLoading || usersLoading || customerLoading ? 0.2 : 1,
          pointerEvents:
            productLoading || usersLoading || customerLoading ? "none" : "auto",
          transition: "opacity 0.3s ease-in-out"
        }}
      >
        {/* <button onClick={handleDownloadFailedData}>click</button> */}
        <h2 className="text-md md:text-2xl font-semibold md:px-5 mb-2 md:mb-1">
          Lead
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-0 md:gap-6 md:mx-5">
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
              <div className="flex w-full text-sm ">
                <Select
                  options={customerOptions}
                  getOptionLabel={(option) =>
                    `${option.label}-(${option.mobile})`
                  } // Show only customer name
                  getOptionValue={(option) => option._id}
                  filterOption={customFilter} // Enable searching by name & mobile
                  {...register("customerName")}
                  onChange={(selectedOption) => {
                    console.log(selectedOption)
                    handleSelectedCustomer(selectedOption.label)
                    setSelectedCustomer(selectedOption)
                    setValue("customerName", selectedOption.value)
                  }}
                  className="mt-1 w-full"
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
                  className="bg-blue-500 hover:bg-blue-600 py-1 px-3 rounded-md text-white "
                >
                  ADD
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-0 md:gap-6 md:mx-5 md:mt-2">
            {/* Other Input Fields */}

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
          </div>
          <div className="md:flex md:gap-6 md:mx-5 md:mt-2">
            <div className="md:w-72">
              <label className="block text-sm font-medium text-gray-700">
                Select License
              </label>
              {/* Button to open dropdown and show selected value */}
              <button
                type="button"
                onClick={() => setIslicenseOpen(!isLicenseOpen)}
                className="border px-2 md:py-1.5 py-2 md:w-72 w-full bg-white text-left rounded flex justify-between items-center"
              >
                {selectedLicense ?? "Select License"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 transition-transform duration-200"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Dropdown List */}
              {isLicenseOpen && (
                <ul className="left-0 md:w-72 mt-1 bg-white border rounded-md shadow-lg z-30">
                  {/* Option to unselect license */}
                  <li
                    className="p-2 hover:bg-gray-200 cursor-pointer font-semibold text-red-500"
                    onClick={() => handleLicenseSelect(null)}
                  >
                    No License
                  </li>

                  {/* List of available licenses */}
                  {customerTableData?.map((item, index) => (
                    <li
                      key={item.licenseNumber || index}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleLicenseSelect(item.licenseNumber)}
                    >
                      {`${item.licenseNumber} - ${item.productName}`}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="relative" ref={dropdownRef}>
              <label
                htmlFor="leadFor"
                className="block text-sm font-medium text-gray-700"
              >
                Lead for
              </label>

              <div className="flex items-center space-x-2">
                {/* Toggle Dropdown Button */}
                <button
                  type="button"
                  onClick={handleToggleDropdown}
                  className="border px-2 md:py-1.5  py-2 md:w-80 w-full bg-white text-left rounded flex justify-between items-center"
                >
                  Select a product/services
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 transition-transform duration-200"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={handleAddProducts}
                  // disabled={
                  //   !productSelections[selectedLicense]?.some((p) => p.selected)
                  // }
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded "
                >
                  Add
                </button>
              </div>

              {/* Product List (Visible when isOpen is true) */}
              {isleadForOpen && (
                <div className="absolute z-30 left-0 mt-2 md:w-80 border bg-white shadow-lg rounded-md p-2 max-h-40 overflow-y-auto">
                  {selectedLicense &&
                    productData?.map((product) => {
                      const currentProductState = productSelections[
                        selectedLicense
                      ]?.find((p) => p._id === product._id) || {
                        selected: false
                      }

                      return (
                        <label
                          key={product._id}
                          className="flex items-center space-x-2 mb-1"
                        >
                          <input
                            type="checkbox"
                            checked={currentProductState.selected}
                            onChange={() => handleProductSelect(product._id)}
                            className="form-checkbox"
                          />
                          <span>{product.productName}</span>
                        </label>
                      )
                    })}
                  {!selectedLicense &&
                    productData?.map((product) => {
                      const currentProductState =
                        licensewithoutProductSelection?.find(
                          (p) => p._id === product._id
                        ) || { selected: false }
                      return (
                        <label
                          key={product._id}
                          className="flex items-center space-x-2 mb-1"
                        >
                          <input
                            type="checkbox"
                            checked={currentProductState.selected}
                            onChange={() => handleProductSelect(product._id)}
                            className="form-checkbox"
                          />
                          <span>{product.productName}</span>
                        </label>
                      )
                    })}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:mx-5 md:mt-2 md:gap-6 ">
            {selectedleadlist && selectedleadlist.length > 0 && (
              <div className=" bg-white border rounded-md  max-h-[200px] overflow-y-auto overflow-x-auto">
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
                    {selectedleadlist.map((product, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          {product.licenseNumber || "Not Selected"}
                        </td>
                        <td className="p-2">{product.productName}</td>
                        {/* Editable Price Input */}
                        <td className="p-2">
                          <input
                            type="number"
                            value={product.price}
                            onChange={(e) =>
                              handlePriceChange(index, e.target.value)
                            }
                            className="w-full border rounded-md px-2 py-1 text-sm"
                          />
                        </td>
                        <td className="p-2 items-center text-center space-x-2">
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
            )}

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
                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none focus:border-gray-500  min-h-[100px]"
                placeholder="Remarks..."
              ></textarea>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 md:gap-6 md:mx-5 md:mt-2 mb-6">
            <div>
              <label
                htmlFor="leadBy"
                className="block text-sm font-medium text-gray-700"
              >
                LeadBy
              </label>
              {editMode ? (
                <select
                  id="leadBy"
                  {...register("leadBy")}
                  className="mt-1 w-full border rounded-md p-2 focus:ring focus:ring-blue-300"
                >
                  {allstaff?.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              ) : (
                <>
                  <input type="hidden" {...register("leadBy")} />
                  <p className="mt-1 w-full border rounded-md p-2 text-gray-600 cursor-not-allowed">
                    {loggeduser?.name}
                  </p>
                </>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Net Amount
              </label>
              <input
                type="number"
                id="netAmount"
                {...register("netAmount")}
                readOnly // Make it non-editable
                // value={calculateTotalAmount()} // Auto-updates with total price
                className=" mt-1 w-full border rounded-md p-2 focus:ring focus:ring-blue-300"
                placeholder="Net Amount"
              />
            </div>

            <div className="h-full flex items-end mt-2 md:mt-0">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                {process === "Registration" ? "SUBMIT" : "UPDATE"}
              </button>
            </div>
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
