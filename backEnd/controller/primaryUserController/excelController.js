import XLSX from "xlsx" // Assuming you're using XLSX to parse Excel files
import Product from "../../model/primaryUser/productSchema.js"
import Company from "../../model/primaryUser/companySchema.js"
import Branch from "../../model/primaryUser/branchSchema.js"
import Customer from "../../model/secondaryUser/customerSchema.js"
import License from "../../model/secondaryUser/licenseSchema.js"
import {
  Brand,
  Category
} from "../../model/primaryUser/productSubDetailsSchema.js"

const excelDateToFormatNumber = (value) => {
  // Check if the value is a serial (number) or a string
  if (typeof value === "number") {
    console.log("number")
    // Handle Excel date serials
    // const date1900 = Date.UTC(1900, 0, 1) // Start date for Excel in UTC
    // const jsDate = new Date(date1900 + (value - 2) * 24 * 60 * 60 * 1000) // Add days in milliseconds
    // // Get the components of the date
    // const year = jsDate.getUTCFullYear()
    // const month = String(jsDate.getUTCMonth() + 1).padStart(2, "0") // Months are zero-indexed
    // const day = String(jsDate.getUTCDate()).padStart(2, "0")
    const date1900 = new Date(Date.UTC(1900, 0, 1))
    const jsDate = new Date(date1900.getTime() + (value - 2) * 86400000) // Subtract 2 for 1900 leap year bug

    const year = jsDate.getUTCFullYear()
    const month = String(jsDate.getUTCMonth() + 1).padStart(2, "0")
    const day = String(jsDate.getUTCDate()).padStart(2, "0")
    // Construct the date string in 'YYYY-MM-DD' format
    const formattedDate = `${year}-${month}-${day}`

    return formattedDate // Return the formatted date
  } else {
    console.log("hiiiiiiiii")
  }
}

export const excelDateToFormatString = (value) => {
  if (typeof value === "string") {
    // Try to handle different string date formats
    let jsDate

    // Detect common date formats and parse
    if (/\d{2}\/\d{2}\/\d{2,4}/.test(value)) {
      // Handle 'dd/MM/yyyy' or 'dd/MM/yy'
      jsDate = new Date(value.split("/").reverse().join("-")) // Reformat for JS Date constructor
    } else if (/\d{2}-\d{2}-\d{2,4}/.test(value)) {
      // Handle 'dd-MM-yyyy' or 'dd-MM-yy'
      jsDate = new Date(value.split("-").reverse().join("-")) // Reformat for JS Date constructor
    } else if (/\d{2}-[a-zA-Z]{3}-\d{4}/.test(value)) {
      // Handle 'dd-MMM-yyyy'
      jsDate = new Date(value)
    }

    if (jsDate && !isNaN(jsDate)) {
      const year = jsDate.getUTCFullYear()
      const month = String(jsDate.getUTCMonth() + 1).padStart(2, "0") // Months are zero-indexed
      const day = String(jsDate.getUTCDate()).padStart(2, "0")

      // Construct the date string in 'YYYY-MM-DD' format
      return `${year}-${month}-${day}`
    } else {
      // If parsing fails, return the original value
      return value
    }
  }
}

export const ExceltoJson = async (socket, fileData) => {
  // Parse the uploaded Excel file
  const workbook = XLSX.read(fileData, { type: "buffer" })

  // Initialize tracking for uploads
  let uploadedCount = 0
  let totalData = 0
  const failedData = []

  // Loop through all the sheets in the workbook
  for (const sheetName of workbook.SheetNames) {
    // const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])
    const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
      raw: true // Keep original data types
    })
    totalData += worksheet.length

    // Fetch necessary data for matching
    const product = await Product.find()
    const company = await Company.find()
    const branch = await Branch.find()
    const brand = await Brand.find()
    const category = await Category.find()
    const licenseNumber = await License.find()

    // Process each row of data from the sheet
    for (const item of worksheet) {
      try {
        if (
          item["Software HitDate"] &&
          typeof item["Software HitDate"] === "number"
        ) {
          item["Software HitDate"] = excelDateToFormatNumber(
            item["Software HitDate"]
          )
        } else if (
          item["Software HitDate"] &&
          typeof item["Software HitDate"] === "string"
        ) {
          item["Software HitDate"] = excelDateToFormatString(
            item["Software HitDate"]
          )
        }

        if (
          item["License Expiry"] &&
          typeof item["License Expiry"] === "number"
        ) {
          item["License Expiry"] = excelDateToFormatNumber(
            item["License Expiry"]
          )
        } else if (
          item["License Expiry"] &&
          typeof item["License Expiry"] === "string"
        ) {
          item["License Expiry"] = excelDateToFormatString(
            item["License Expiry"]
          )
        }

        if (item["Due On"] && typeof item["Due On"] === "number") {
          item["Due On"] = excelDateToFormatNumber(item["Due On"])
        } else if (item["Due On"] && typeof item["Due On"] === "string") {
          item["Due On"] = excelDateToFormatString(item["Due On"])
        }

        if (item["Act On"] && typeof item["Act On"] === "number") {
          item["Act On"] = excelDateToFormatNumber(item["Act On"])
        } else if (item["Act On"] && typeof item["Act On"] === "string") {
          item["Act On"] = excelDateToFormatString(item["Act On"])
        }

        if (item["TVU Expiry"] && typeof item["TVU Expiry"] === "number") {
          item["TVU Expiry"] = excelDateToFormatNumber(item["TVU Expiry"])
        } else if (
          item["TVU Expiry"] &&
          typeof item["TVU Expiry"] === "string"
        ) {
          item["TVU Expiry"] = excelDateToFormatString(item["TVU Expiry"])
        }
        const matchingLicensenumber = licenseNumber.find(
          (license) =>
            license.licensenumber === item["CUSTOMER ID"] || item["Wallet Id"]
        )

        if (!matchingLicensenumber) {
          // Your existing logic for matching data (product, company, branch, etc.)
          const matchingCompany = company.find(
            (company) => company.companyName === "CAMET GROUP"
          )
          const matchingProduct = product.find(
            (product) => product.productName === item["Type"]?.toUpperCase()
          )

          const matchingBranch = branch.find(
            (branch) => branch.branchName === item["Branch"]?.toUpperCase()
          )
          const matchingBrand = brand.find(
            (brand) => brand.brand === item["S/W Type"]?.toUpperCase()
          )
          const matchingCategory = category.find(
            (category) => category.category === item["User"]?.toUpperCase()
          )

          // Build the selected data array as in your original code
          const selectedData = [
            {
              company_id: matchingCompany?._id,
              companyName: matchingCompany?.companyName,
              branch_id: matchingBranch?._id,
              branchName: matchingBranch?.branchName,
              product_id: matchingProduct?._id,
              productName: matchingProduct?.productName,
              brandName: matchingBrand?.brand,
              categoryName: matchingCategory?.category,
              licensenumber: item["CUSTOMER ID"],
              softwareTrade: item["Software Trade"],
              noofusers: item["NoOfUser"],
              companyusing: item["CompanyUsing"],
              version: item["Version"],
              customerAddDate: item["Software HitDate"],
              amcstartDate: item["Act On"],
              amcendDate: item["Due On"],
              licenseExpiryDate: item["License Expiry"],
              productAmount: item["Total Amount"],
              tvuexpiryDate: item["TVU Expiry"],
              isActive: item["Party Status"]
            }
          ]

          if (item["Wallet Name"]) {
            const walletName = item["Wallet Name"]?.toUpperCase().trim() || ""
            const matchingWallet = product.find(
              (product) =>
                product.productName.toUpperCase().trim() === walletName
            )
            if (matchingWallet) {
              selectedData.push({
                company_id: matchingCompany?._id,
                companyName: matchingCompany?.name,
                branch_id: matchingBranch?._id,
                branchName: matchingBranch?.branchName,
                product_id: matchingWallet?._id,
                productName: matchingWallet?.productName,
                brandName: item["S/W Type"],
                categoryName: item["User"],
                licensenumber: item["Wallet Id"],
                amcendDate: item["Due On"],
                amcAmount: item["Total Amount"],
                isActive: item["Party Status"]
              })
            }
          }

          // Check if customer with this license already exists
          const existingCustomer = await Customer.findOne({
            "selected.licensenumber": item["CUSTOMER ID"]
          })

          if (!existingCustomer) {
            // Create a new customer entry
            const customerData = new Customer({
              customerName: item["Party Name"],
              address1: item["Address"],
              state: item["State"],
              city: item["City"],
              pincode: item["OnlineZipCode"],
              email: item["EmailID"],
              mobile: item["Mobile"],
              incomingNumber: item["Incoming Number"],
              contactPerson: item["Contact Person"],
              isActive: item["Party Status"],
              selected: selectedData
            })

            const savedCustomer = await customerData.save()

            if (savedCustomer) {
              for (const item of savedCustomer.selected) {
                const license = new License({
                  products: item.product_id,
                  customerName: savedCustomer._id, // Using the customer ID from the parent object
                  licensenumber: item.licensenumber
                })
                await license.save()
              }

              uploadedCount++
              socket.emit("conversionProgress", {
                current: uploadedCount,
                total: totalData
              })
            }
          } else {
            failedData.push(item)
          }
        } else {
          failedData.push(item)
        }
      } catch (error) {
        console.error("Error saving customer data:", error.message)
        failedData.push(item)
      }
    }
  }

  // Final socket emission
  if (uploadedCount > 0) {
    socket.emit("conversionComplete", {
      message:
        failedData.length === 0
          ? "Conversion completed"
          : "Conversion partially completed",
      secondaryMessage: "Some files were not saved due to same license number",
      nonsavingData: failedData
    })
  } else {
    socket.emit("conversionError", {
      message:
        failedData.length === totalData
          ? "This file is already uploaded"
          : "Error occurred during upload"
    })
  }
}
