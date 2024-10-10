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

// const excelDateToFormattedString = (value) => {
//   // Check if the value is a serial (number) or a string
//   if (typeof value === 'number') {
//     // Handle Excel date serials
//     const date1900 = new Date(1900, 0, 1); // Start date for Excel
//     const jsDate = new Date(date1900.setDate(date1900.getDate() + value - 1));

//     // Format the date to 'dd-MMM-yyyy'
//     const options = { day: '2-digit', month: 'short', year: 'numeric' };
//     return jsDate.toLocaleDateString('en-GB', options).replace(',', '');
//   } else if (typeof value === 'string') {
//     // Try to handle different string date formats
//     let jsDate;

//     // Detect common date formats and parse
//     if (/\d{2}\/\d{2}\/\d{2,4}/.test(value)) {
//       // Handle 'dd/MM/yyyy' or 'dd/MM/yy'
//       jsDate = new Date(value.split('/').reverse().join('-')); // Reformat for JS Date constructor
//     } else if (/\d{2}-\d{2}-\d{2,4}/.test(value)) {
//       // Handle 'dd-MM-yyyy' or 'dd-MM-yy'
//       jsDate = new Date(value.split('-').reverse().join('-')); // Reformat for JS Date constructor
//     } else if (/\d{2}-[a-zA-Z]{3}-\d{4}/.test(value)) {
//       // Handle 'dd-MMM-yyyy'
//       jsDate = new Date(value);
//     }

//     if (jsDate && !isNaN(jsDate)) {
//       // Format the date to 'dd-MMM-yyyy'
//       const options = { day: '2-digit', month: 'short', year: 'numeric' };
//       return jsDate.toLocaleDateString('en-GB', options).replace(',', '');
//     } else {
//       // If parsing fails, return the original value
//       return value;
//     }
//   } else {
//     // If it's neither a number nor a valid string, return the value as-is
//     return value;
//   }
// };
const excelDateToFormattedString = (value) => {
  // Check if the value is a serial (number) or a string
  if (typeof value === "number") {
    // Handle Excel date serials
    const date1900 = Date.UTC(1900, 0, 1) // Start date for Excel in UTC
    const jsDate = new Date(date1900 + (value - 1) * 24 * 60 * 60 * 1000) // Add days in milliseconds

    // Format the date to 'dd-MMM-yyyy' in UTC
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC"
    }
    return jsDate.toLocaleDateString("en-GB", options).replace(",", "")
  } else if (typeof value === "string") {
    // Try to handle different string date formats
    let jsDate

    // Detect common date formats and parse
    if (/\d{2}\/\d{2}\/\d{2,4}/.test(value)) {
      // Handle 'dd/MM/yyyy' or 'dd/MM/yy'
      const [day, month, year] = value.split("/")
      jsDate = new Date(
        Date.UTC(year.length === 2 ? `20${year}` : year, month - 1, day)
      )
    } else if (/\d{2}-\d{2}-\d{2,4}/.test(value)) {
      // Handle 'dd-MM-yyyy' or 'dd-MM-yy'
      const [day, month, year] = value.split("-")
      jsDate = new Date(
        Date.UTC(year.length === 2 ? `20${year}` : year, month - 1, day)
      )
    } else if (/\d{2}-[a-zA-Z]{3}-\d{4}/.test(value)) {
      // Handle 'dd-MMM-yyyy'
      jsDate = new Date(value)
    }

    if (jsDate && !isNaN(jsDate)) {
      // Format the date to 'dd-MMM-yyyy' in UTC
      const options = {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC"
      }
      return jsDate.toLocaleDateString("en-GB", options).replace(",", "")
    } else {
      // If parsing fails, return the original value
      return value
    }
  } else {
    // If it's neither a number nor a valid string, return the value as-is
    return value
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
          item["Software HitDate"] = excelDateToFormattedString(
            item["Software HitDate"]
          )
        }

        if (
          item["License Expiry"] &&
          typeof item["License Expiry"] === "number"
        ) {
          item["License Expiry"] = excelDateToFormattedString(
            item["License Expiry"]
          )
        }

        if (item["Due On"] && typeof item["Due On"] === "number") {
          item["Due On"] = excelDateToFormattedString(item["Due On"])
        }

        if (item["Act On"] && typeof item["Act On"] === "number") {
          item["Act On"] = excelDateToFormattedString(item["Act On"])
        }

        if (item["TVU Expiry"] && typeof item["TVU Expiry"] === "number") {
          item["TVU Expiry"] = excelDateToFormattedString(item["TVU Expiry"])
        }
        const matchingLicensenumber = licenseNumber.find(
          (license) => license.licensenumber === item["CUSTOMER ID"]
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
            selectedData.push({
              company_id: matchingCompany?._id,
              companyName: matchingCompany?.name,
              branch_id: matchingBranch?._id,
              branchName: matchingBranch?.branchName,
              product_id: matchingProduct?._id,
              productName: matchingProduct?.productName,
              brandName: item["S/W Type"],
              categoryName: item["User"],
              licensenumber: item["Wallet Id"],
              amcendDate: item["Due On"],
              amcAmount: item["Total Amount"],
              isActive: item["Party Status"]
            })
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
            // for (const item of savedCustomer.selected) {
            //   const license = new License({
            //     products: item.product_id,
            //     customerName: savedCustomer._id, // Using the customer ID from the parent object
            //     licensenumber: item.licensenumber
            //   })
            //   await license.save()
            // }
            if (savedCustomer) {
              const license = new License({
                products: savedCustomer?.selected?.product_id,
                customerName: savedCustomer?._id,
                licensenumber: savedCustomer?.selected?.licensenumber
              })
              const savedLicense = await license.save()
              if (savedLicense) {
                uploadedCount++
                socket.emit("conversionProgress", {
                  current: uploadedCount,
                  total: totalData
                })
              }
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
