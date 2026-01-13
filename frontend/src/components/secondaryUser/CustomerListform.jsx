import { useState, useEffect, useRef, useMemo } from "react"
import { BarLoader } from "react-spinners"
import ExcelJS from "exceljs"
import { saveAs } from "file-saver"
import api from "../../api/api"
import { getLocalStorageItem } from "../../helper/localstorage"
import { CiEdit } from "react-icons/ci"
import { PropagateLoader } from "react-spinners"
import { useNavigate } from "react-router-dom"
import UseFetch from "../../hooks/useFetch"
import debounce from "lodash.debounce"
import ClipLoader from "react-spinners/ClipLoader"
import TooltipIcon from "../TooltipIcon"
import BranchDropdown from "../primaryUser/BranchDropdown"
import { useInfiniteQuery } from "@tanstack/react-query"
import {
  FaUserPlus,
  FaRegFileExcel,
  FaFilePdf,
  FaPrint,
  FaHourglassHalf,
  FaExclamationTriangle
} from "react-icons/fa"

const CustomerListform = () => {
  const navigate = useNavigate()
  // const tableContainerRef = useRef(null) // Ref to track table container scrolling

  const [searchTerm, setsearchTerm] = useState("")
  const [pages, setPages] = useState(1)
  const [selectedstatus, setselectedStatus] = useState("Allcustomers")
  const [tableHeight, setTableHeight] = useState("auto")
  const [customerCount, setcustomerCount] = useState(0)
  const [statusfilteredCustomer, setstatusfilteredcustomer] = useState([])
  const [showFullAddress, setShowFullAddress] = useState({})
  const [showFullEmail, setShowFullEmail] = useState({})
  const [searchAfterData, setAfterSearchData] = useState([])
  const [alldata, setalldata] = useState([])
  const [user, setUser] = useState(null)
  const [selectedBranch, setselectedBranch] = useState(null)
  const [userBranches, setuserBranches] = useState([])
  const [userRole, setUserRole] = useState(null)
  const [apiSearchTerm, setApiSearchTerm] = useState("") // only when we want API call
  const headerRef = useRef(null)
  const scrollTriggeredRef = useRef(false)
  const containerRef = useRef(null)
  const firstLoad = useRef(true)
  const hasLoadedEmpty = useRef(false)

  const fetchCustomers = async ({ pageParam = 1, queryKey }) => {
    const [_key, { branch, search, status }] = queryKey
    const res = await api.get(
      `/customer/getcust?limit=100&page=${pageParam}&search=${search}&loggeduserBranches=${branch}&customerType=${status}`
    )
    return res.data.data
  }
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: [
        "customers",
        {
          branch: selectedBranch,
          search: apiSearchTerm,
          status: selectedstatus
        }
      ],
      queryFn: fetchCustomers,
      getNextPageParam: (lastPage, allPages) =>
        lastPage.customers.length === 100 ? allPages.length + 1 : undefined,
      enabled: !!selectedBranch
    })
console.log(data)
  //intialize user
  useEffect(() => {
    const userData = getLocalStorageItem("user")
    if (userData?.selected?.[0]) {
      setselectedBranch(userData.selected[0].branch_id)
      userData.selected.forEach((branch) => {
        setuserBranches((prev) => [
          ...prev,
          {
            id: branch.branch_id,
            branchName: branch.branchName
          }
        ])
      })
      setUser(userData)

      if (userData && userData.role) {
        setUserRole(userData.role.toLowerCase())
      } else {
        setUserRole(null) // Handle case where user or role doesn't exist
      }
    }
  }, [])

  useEffect(() => {
    if (headerRef.current) {
      const headerHeight = headerRef.current.getBoundingClientRect().height
      setTableHeight(`calc(60vh - ${headerHeight}px)`) // Subtract header height from full viewport height
    }
  }, [])

  useEffect(() => {
    if (data?.pages?.length) {
      // all pages combined
      const allCustomers = data.pages.flatMap((page) => page.customers)

      setAfterSearchData(allCustomers)
      setcustomerCount(data.pages[0].selectedbranchCustomercount || 0)
    }
  }, [data])
  const handleScroll = () => {
    const container = containerRef.current
    if (!container) return
    const { clientHeight, scrollHeight, scrollTop } = container
    if (
      scrollTop / (scrollHeight - clientHeight) >= 0.9 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage()
    }
  }

  //Handle search with lodash debounce to optimize search performance
  const handleSearch = debounce((query) => {
    const term = query.trim().toLowerCase()
    setsearchTerm(query)

    setPages(1)
    if (!query) {
      setApiSearchTerm("")
      setAfterSearchData(alldata)

      return
    }

    // 1️⃣ check locally first
    const localMatches = alldata.filter(
      (cust) =>
        cust.customerName?.toLowerCase().includes(term) ||
        cust.mobile?.toLowerCase().includes(term) ||
        cust.selected?.some((sel) =>
          sel.licensenumber?.toString().toLowerCase().includes(term)
        )
    )

    if (localMatches.length > 0) {
      setAfterSearchData(localMatches)
      setcustomerCount(localMatches.length)
    } else {
      // 2️⃣ only here trigger API
      setApiSearchTerm(query) // 👈 not searchTerm
      setAfterSearchData([])
      // setalldata([])
    }
  }, 600)
  const handleBranchChange = (e) => {
    setselectedBranch(e)
  }

  const handleChange = (e) => handleSearch(e.target.value)

  // Function to toggle showing full address
  const handleShowMoreAddress = (customerId) => {
    setShowFullAddress((prevState) => ({
      ...prevState,
      [customerId]: !prevState[customerId] // Toggle the state for the specific customer
    }))
  }
  //Function to toggle showing full email
  const handleShowMoreEmail = (customerId) => {
    setShowFullEmail((prevState) => ({
      ...prevState,
      [customerId]: !prevState[customerId] //Toggle the state for the specific customer
    }))
  }

  const truncateAddress = (address) => {
    const maxLength = 20 // Define how many characters to show before truncating
    return address?.length > maxLength
      ? `${address?.slice(0, maxLength)}...`
      : address
  }
 
  const handleDownload = async () => {
    const response = await api.get(
      `/customer/downloadcustomerlistexcel?customerType=${selectedstatus}&branchselected=${selectedBranch}&searchTerm=${apiSearchTerm}`
    )
    const data = response.data.data

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Customer List")

    // Determine heading and filename based on selectedstatus
    let headingText = ""
    let fileName = ""

    switch (selectedstatus) {
      case "Allcustomers":
        headingText = "All Customers"
        fileName = "AllCustomers_Report.xlsx"
        break
      case "ProductMissing":
        headingText = "Product Missing Customers"
        fileName = "ProductMissing_Customers.xlsx"
        break
      case "ProductinfoMissing":
        headingText = "Product Info Missing Customers"
        fileName = "ProductInfoMissing_Customers.xlsx"
        break
      case "Running":
        headingText = "Running Customers"
        fileName = "Running_Customers.xlsx"
        break
      case "Deactive":
        headingText = "Deactive Customer List"
        fileName = "DeactiveCustomerList_Report.xlsx"
        break
      default:
        headingText = "Customer Report"
        fileName = "Customer_Report.xlsx"
    }

    // --- Add heading row (Row 1) ---
    worksheet.mergeCells("A1:I1")
    const headingCell = worksheet.getCell("A1")
    headingCell.value = headingText
    headingCell.font = { size: 18, bold: true, color: { argb: "FFFFFFFF" } }
    headingCell.alignment = { horizontal: "center", vertical: "middle" }
    headingCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF305496" } // Dark blue background
    }
    worksheet.getRow(1).height = 30

    // --- Add a blank row for spacing (Row 2) ---
    worksheet.addRow([])

    // --- Define columns (Header Row = Row 3) ---
    worksheet.columns = [
      { header: "BRANCH NAME", key: "branchName", width: 20 },
      { header: "CUSTOMER NAME", key: "customerName", width: 25 },
      { header: "PRODUCT NAME", key: "productName", width: 20 },
      { header: "LICENSE NO", key: "licenseNo", width: 18 },
      { header: "ADDRESS", key: "address", width: 40 },
      { header: "PINCODE", key: "pincode", width: 10 },
      { header: "MOBILE", key: "mobile", width: 15 },
      { header: "EMAIL", key: "email", width: 35 },
      { header: "STATUS", key: "status", width: 12 }
    ]

    // --- Style header row (Row 3) ---
    const headerRow = worksheet.getRow(3)
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF4472C4" } // Medium blue
      }
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } }
      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true
      }
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      }
    })
    headerRow.height = 22

    // --- Add data rows (start from Row 4) ---
    data.forEach((customer) => {
      const row = worksheet.addRow({
        branchName: customer.branchName,
        customerName: customer.customerName,
        productName: customer.productName,
        licenseNo: customer.licenseNo,
        address: customer.address,
        pincode: customer.pincode,
        mobile: customer.mobile,
        email: customer.email,
        status: customer.status
      })

      row.eachCell((cell, colNumber) => {
        const key = worksheet.columns[colNumber - 1].key

        // Wrap long text for address/email/name
        if (["address", "email", "customerName"].includes(key)) {
          cell.alignment = { wrapText: true, vertical: "top" }
        } else {
          cell.alignment = { horizontal: "center", vertical: "middle" }
        }

        // Border
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" }
        }

        // Zebra stripe
        if (row.number % 2 === 0) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF2F2F2" }
          }
        }
      })
    })

    // --- Adjust row height for readability ---
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 3) {
        row.height = 30
      }
    })

    // --- Export file ---
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    })
    saveAs(blob, fileName)
  }

  return (
    <div className="h-full overflow-hidden">
      {/* {scrollLoading && (
        <BarLoader
          cssOverride={{ width: "100%", height: "4px" }}
          color="#4A90E2"
        />
      )} */}

      <div className="w-full shadow-lg rounded p-8 h-full flex flex-col">
        {/* Sticky Header Section */}
        <div className="flex-shrink-0 bg-white">
          {/* Title and Search Bar */}
          <div className="flex justify-between items-center px-4 lg:px-6 xl:px-8 mb-4">
            <h3 className="text-2xl text-black font-bold">
              {selectedstatus === "ProductinfoMissing"
                ? " Product Details Missing Customer List"
                : selectedstatus === "ProductMissing"
                ? "Product Missing Customer List"
                : selectedstatus === "Deactive"
                ? "Deactive Customer List"
                : selectedstatus === "Running"
                ? "Active Customer List"
                : "Customer List"}
            </h3>

            {/* Search Bar */}
            <div className="mx-4 relative flex-1 max-w-md">
              <input
                type="text"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search for..."
              />
              {/* {scrollLoading && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ClipLoader
                    color="#36D7B7"
                    loading={scrollLoading}
                    size={20}
                  />
                </div>
              )} */}
            </div>
          </div>

          <hr className="border-t-2 border-gray-300 mb-4" />

          {/* Action Buttons and Counter */}
          <div className="flex justify-between items-center px-4 lg:px-6 xl:px-8 mb-4">
            <div className="flex flex-wrap gap-2 ">
              <TooltipIcon
                icon={FaUserPlus}
                tooltip="Add Customer"
                to={
                  user?.role === "Admin"
                    ? "/admin/masters/customerRegistration"
                    : "/staff/masters/customerRegistration"
                }
              />
              {userRole === "admin" && (
                <TooltipIcon
                  icon={FaRegFileExcel}
                  tooltip="Excel Download"
                  button
                  onClick={handleDownload}
                />
              )}

              <TooltipIcon icon={FaFilePdf} tooltip="PDF Download" button />

              <TooltipIcon icon={FaPrint} tooltip="Print" button />

              <BranchDropdown
                branches={userBranches}
                onBranchChange={handleBranchChange}
                branchSelected={selectedBranch}
              />
              <select
                value={selectedstatus}
                onChange={(e) => {
                  setselectedStatus(e.target.value)
                  setAfterSearchData([])
                }}
                className="w-auto px-2 py-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-700 bg-white cursor-pointer font-semibold"
              >
                <option value="Allcustomers">All Customer</option>
                <option value="Running">Running</option>
                <option value="Deactive">Deactive</option>
                {/*some customers have missing or product ids */}
                <option value="ProductinfoMissing">Product Info.Missing</option>

                {/*some customers wont buy products*/}
                <option value="ProductMissing">Product Missing</option>
              </select>
            </div>

            <div className="bg-blue-100 px-4 py-2 rounded-lg text-blue-800">
              <span className="text-sm font-medium mr-1">Total:</span>
              <span>{customerCount}</span>
            </div>
          </div>
        </div>

        {/* Scrollable Table Section */}
        <div className="flex-1 overflow-hidden">
          <div
            onScroll={handleScroll}
            ref={containerRef}
            className="h-full overflow-y-auto overflow-x-auto rounded-lg border border-gray-200"
          >
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr className="text-nowrap">
                  <th className="py-3 px-4 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    S.NO
                  </th>
                  <th className="py-3 px-4 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-nowrap">
                    Branch Name
                  </th>
                  <th className="py-3 px-4 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Name
                  </th>
                  <th className="py-3 px-4 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-nowrap">
                    Product Name
                  </th>
                  <th className="py-3 px-4 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    License
                  </th>
                  <th className="py-3 px-4 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="py-3 px-4 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pin Code
                  </th>
                  <th className="py-3 px-4 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mobile
                  </th>
                  <th className="py-3 px-4 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="py-3 px-4 border-b border-gray-300 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-4 border-b border-gray-300 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {searchAfterData && searchAfterData.length > 0 ? (
                  searchAfterData.map((customer, index) => {
                    //listing of productmissing customers
                    if (!customer.selected || customer.selected.length === 0) {
                      return (
                        <tr
                          key={customer._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">-</td>
                          <td className="px-4 py-3 text-sm text-gray-900 font-medium uppercase">
                            {customer?.customerName}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-red-600">
                            Missing Product
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 font-mono">
                            -
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 max-w-xs">
                            {showFullAddress[customer?._id] ? (
                              <span>
                                {customer?.address1}{" "}
                                <button
                                  onClick={() =>
                                    handleShowMoreAddress(customer?._id)
                                  }
                                  className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                  Show less
                                </button>
                              </span>
                            ) : (
                              <span>
                                {truncateAddress(customer?.address1)}{" "}
                                {customer?.address1?.length > 20 && (
                                  <button
                                    onClick={() =>
                                      handleShowMoreAddress(customer?._id)
                                    }
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                  >
                                    ...more
                                  </button>
                                )}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {customer?.pincode}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {customer?.mobile}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {showFullEmail[customer?._id] ? (
                              <span>
                                {customer?.email}{" "}
                                <button
                                  onClick={() =>
                                    handleShowMoreEmail(customer?._id)
                                  }
                                  className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                  Show less
                                </button>
                              </span>
                            ) : (
                              <span>
                                {truncateAddress(customer?.email)}{" "}
                                {customer?.email?.length > 20 && (
                                  <button
                                    onClick={() =>
                                      handleShowMoreEmail(customer?._id)
                                    }
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                  >
                                    ...more
                                  </button>
                                )}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                              No Status
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-center items-center">
                              <CiEdit
                                onClick={() =>
                                  navigate(
                                    userRole === "admin"
                                      ? "/admin/masters/customerEdit"
                                      : "/staff/masters/customerEdit",
                                    {
                                      state: { customerId: customer._id }
                                    }
                                  )
                                }
                                className="cursor-pointer text-blue-600 hover:text-blue-800 transition-colors text-xl md:text-2xl"
                                title="Edit Customer"
                              />
                            </div>
                          </td>
                        </tr>
                      )
                    }
                    return customer.selected.map((item, itemIndex) => (
                      <tr
                        key={`${customer._id}-${item.licensenumber}-${itemIndex}`}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {itemIndex === 0 ? index + 1 : ""}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {item?.branchName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium uppercase">
                          {customer?.customerName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {item?.productName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-mono">
                          {item?.licensenumber}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 max-w-xs">
                          {showFullAddress[customer?._id] ? (
                            <span>
                              {customer?.address1}{" "}
                              <button
                                onClick={() =>
                                  handleShowMoreAddress(customer?._id)
                                }
                                className="text-blue-600 hover:text-blue-800 font-medium"
                              >
                                Show less
                              </button>
                            </span>
                          ) : (
                            <span>
                              {truncateAddress(customer?.address1)}{" "}
                              {customer?.address1?.length > 20 && (
                                <button
                                  onClick={() =>
                                    handleShowMoreAddress(customer?._id)
                                  }
                                  className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                  ...more
                                </button>
                              )}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {customer?.pincode}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {customer?.mobile}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {/* {customer?.email} */}
                          {showFullEmail[customer?._id] ? (
                            <span>
                              {customer?.email}{" "}
                              <button
                                onClick={() =>
                                  handleShowMoreEmail(customer?._id)
                                }
                                className="text-blue-600 hover:text-blue-800 font-medium"
                              >
                                Show less
                              </button>
                            </span>
                          ) : (
                            <span>
                              {truncateAddress(customer?.email)}{" "}
                              {customer?.email?.length > 20 && (
                                <button
                                  onClick={() =>
                                    handleShowMoreEmail(customer?._id)
                                  }
                                  className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                  ...more
                                </button>
                              )}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              item.isActive === "Running"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.isActive}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="items-center flex justify-center">
                            <CiEdit
                              onClick={() =>
                                navigate(
                                  userRole === "admin"
                                    ? "/admin/masters/customerEdit"
                                    : "/staff/masters/customerEdit",
                                  {
                                    state: {
                                      customerId: customer._id,

                                      index: itemIndex
                                    }
                                  }
                                )
                              }
                              className="cursor-pointer text-blue-600 hover:text-blue-800 transition-colors text-xl md:text-2xl"
                              title="Edit Customer"
                            />
                            {/* <div className="text-red-500 hover:text-red-700 transition-colors p-1 rounded hover:bg-red-100">
                            <DeleteAlert
                              onDelete={handleDelete}
                              Id={customer._id}
                            />
                          </div> */}
                          </div>
                        </td>
                      </tr>
                    ))
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="11"
                      className="px-4 py-12 text-center text-gray-500"
                    >
                      {isFetching ? (
                        <div className="flex justify-center">
                          <PropagateLoader color="#3b82f6" size={10} />
                        </div>
                      ) : (
                        <div className="text-lg">No Data Found</div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerListform
