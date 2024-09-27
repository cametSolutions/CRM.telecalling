import fs from "fs"
import XLSX from "xlsx"
import Excel from "../../model/primaryUser/excelSchema.js"
import Customer from "../../model/secondaryUser/customerSchema.js"
import Product from "../../model/primaryUser/productSchema.js"
import Company from "../../model/primaryUser/companySchema.js"
import Branch from "../../model/primaryUser/branchSchema.js"
const convertExcelToJson = (filePath) => {
  const workbook = XLSX.readFile(filePath)
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]

  const jsonData = XLSX.utils.sheet_to_json(sheet, {
    raw: false, // Set raw to false to convert dates automatically
    dateNF: "yyyy-mm-dd", // Specify the desired date format
    cellDates: true // Keep this to ensure date parsing is applied
  })

  return jsonData
}

export const ExceltoJson = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.")
    }

    // Get the path from req.file
    const filePath = req.file.path

    // Convert the uploaded Excel file to JSON
    const jsonData = convertExcelToJson(filePath)
    console.log("jsnnnnnnn", jsonData)
    // Log the parsed JSON data
    const product = await Product.find()
    const company = await Company.find()
    const branch = await Branch.find()

    for (const item of jsonData) {
      const matchingProduct = product.find(
        (product) => product.productName === item["Type"]
      )
      const matchingCompany = company.find(
        (company) => company.name === "CAMET GROUP"
      )
      const matchingBranch = branch.find(
        (branch) => branch.branchName === "ACCUANET"
      )

      const selectedData = [
        {
          company_id: matchingCompany ? matchingCompany._id : null,
          companyName: matchingCompany ? matchingCompany.name : "",
          branch_id: matchingBranch ? matchingBranch._id : null,
          branchName: matchingBranch ? matchingBranch.branchName : "",
          product_id: matchingProduct ? matchingProduct._id : null,
          productName: item["Type"],
          brandName: item["S/W Type"],
          categoryName: item["User"],
          licensenumber: item["CUSTOMER ID"],
          softwareTrade: item["Software Trade"],
          noofusers: item["NoOfUser"],
          companyusing: item["CompanyUsing"],
          version: item["Version"],
          customerAddDate: item["Act On"],
          amcstartDate: item["Software HitDate"],
          amcendDate: item["Due On"],
          amcAmount: "",
          amcDescription: "",
          licenseExpiryDate: "",
          productAmount: item["Total Amount"],
          productamountDescription: "",
          tvuexpiryDate: "",
          tvuAmount: "",
          tvuamountDescription: "",
          isActive: item["Party Status"]
        }
      ]

      // Conditionally add the Wallet Id only if it exists
      if (item["Wallet Id"]) {
        selectedData.push({
          productName: "Wallet Id",
          licensenumber: item["Wallet Id"]
        })
      }

      const customerData = new Customer({
        customerName: item["Party Name"],
        address1: item["Address"],
        country: item["Country"],
        state: item["State"],
        city: item["City"],
        pincode: item["OnlineZipCode"],
        email: item["EmailID"],
        mobile: item["Mobile"],
        landline: item["Landline"],
        contactPerson: item["Contact Person"],
        selected: selectedData
      })

      await customerData.save()
    }

    res.status(200).send("File uploaded and data stored successfully!")
  } catch (error) {
    console.error("Error uploading file:", error.message)
    res.status(500).send("Error processing file.")
  }
}
// import fs from "fs"
// import XLSX from "xlsx"
// import Excel from "../../model/primaryUser/excelSchema.js"
// import Customer from "../../model/secondaryUser/customerSchema.js"
// import Product from "../../model/primaryUser/productSchema.js"
// import Company from "../../model/primaryUser/companySchema.js"
// import Branch from "../../model/primaryUser/branchSchema.js"
// // const excelDateToJSDate = (serial) => {
// //   const utc_days = Math.floor(serial - 25569)
// //   const utc_value = utc_days * 86400 // 86400 seconds per day
// //   return new Date(utc_value * 1000) // Convert to milliseconds
// // }
// const originalDates = [] // Array to store the original date strings
// const convertedDates = []
// const convertDateFormat = (dateString) => {
//   console.log("datestrnggg", dateString)
//   console.log("hllllaallla")
//   const ddMmYyPattern =
//     /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{2}|\d{4})$/ // dd-mm-yy

//   if (ddMmYyPattern.test(dateString)) {
//     console.log("hii")
//     originalDates.push(dateString)
//     // Split and reformat the date
//     const [day, month, year] = dateString.split("-")
//     const convertedDate = `${day}/${month}/${year}` // Change to dd/mm/yy
//     convertedDates.push(convertedDate)

//     return convertedDate
//   }
//   return dateString // Return the original string if format is unrecognized
// }
// const convertExcelToJson = (filePath) => {
//   // Read the file and create a workbook
//   const workbook = XLSX.readFile(filePath)

//   // Get the first sheet name
//   const sheetName = workbook.SheetNames[0]

//   // Get the first worksheet
//   const worksheet = workbook.Sheets[sheetName]

//   for (const cell in worksheet) {
//     // Parse the cell reference to get its row and column

//     if (worksheet[cell].v && typeof worksheet[cell].v === "string") {
//       // Check if the cell value is in dd-mm-yy format
//       worksheet[cell].v = convertDateFormat(worksheet[cell].v)
//     } else if (worksheet[cell].v && typeof worksheet[cell].v === "number") {
//       // Log the header (column name) and the value

//       console.log("values", worksheet[cell].v)
//     }
//   }

//   console.log("Original Dates:", originalDates) // Array of original date strings
//   console.log("Converted Dates:", convertedDates)
//   // Convert the worksheet to JSON
//   const jsonData = XLSX.utils.sheet_to_json(worksheet, {
//     defval: "", // Optional: Fill empty cells with empty string
//     raw: false // Optional: Format dates, numbers, etc.
//   })

//   return jsonData
// }

// export const ExceltoJson = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send("No file uploaded.")
//     }

//     const filePath = req.file.path

//     // Convert the uploaded Excel file to JSON (example conversion function)
//     const jsonData = convertExcelToJson(filePath)
//     console.log("jsnnnnnnn", jsonData)

//     const product = await Product.find()
//     const company = await Company.find()
//     const branch = await Branch.find()

//     for (const item of jsonData) {
//       const matchingProduct = product.find(
//         (product) => product.productName === item["Type"]
//       )
//       const matchingCompany = company.find(
//         (company) => company.name === "CAMET GROUP"
//       )
//       const matchingBranch = branch.find(
//         (branch) => branch.branchName === "ACCUANET"
//       )

//       const selectedData = [
//         {
//           company_id: matchingCompany ? matchingCompany._id : null,
//           companyName: matchingCompany ? matchingCompany.name : "",
//           branch_id: matchingBranch ? matchingBranch._id : null,
//           branchName: matchingBranch ? matchingBranch.branchName : "",
//           product_id: matchingProduct ? matchingProduct._id : null,
//           productName: item["Type"],
//           brandName: item["S/W Type"],
//           categoryName: item["User"],
//           licensenumber: item["CUSTOMER ID"],
//           softwareTrade: item["Software Trade"],
//           noofusers: item["NoOfUser"],
//           companyusing: item["CompanyUsing"],
//           version: item["Version"],
//           customerAddDate: actOn, // Use converted date
//           amcstartDate: softwareHitDate, // Use converted date
//           amcendDate: dueOn, // Use converted date
//           amcAmount: "",
//           amcDescription: "",
//           licenseExpiryDate: "",
//           productAmount: item["Total Amount"],
//           productamountDescription: "",
//           tvuexpiryDate: "",
//           tvuAmount: "",
//           tvuamountDescription: "",
//           isActive: item["Party Status"]
//         }
//       ]

//       if (item["Wallet Id"]) {
//         selectedData.push({
//           productName: "Wallet Id",
//           licensenumber: item["Wallet Id"]
//         })
//       }

//       const customerData = new Customer({
//         customerName: item["Party Name"],
//         address1: item["Address"],
//         country: item["Country"],
//         state: item["State"],
//         city: item["City"],
//         pincode: item["OnlineZipCode"],
//         email: item["EmailID"],
//         mobile: item["Mobile"],
//         landline: item["Landline"],
//         contactPerson: item["Contact Person"],
//         selected: selectedData
//       })

//       await customerData.save()
//     }

//     res.status(200).send("File uploaded and data stored successfully!")
//   } catch (error) {
//     console.error("Error uploading file:", error.message)
//     res.status(500).send("Error processing file.")
//   }
// }
// // const convertExcelToJson = (filePath) => {
// //   const workbook = XLSX.readFile(filePath)
// //   const sheetName = workbook.SheetNames[0]
// //   const sheet = workbook.Sheets[sheetName]
// //   Object.keys(sheet).forEach((cell) => {
// //     // Skip metadata entries like '!ref', '!merges', etc.
// //     if (cell[0] === "!") return

// //     const cellValue = sheet[cell].v // The value of the cell
// //     const cellType = sheet[cell].t // The type of the cell

// //     // Log the cell reference, type, and value
// //     console.log(`Cell: ${cell}, Type: ${cellType}, Value: ${cellValue}`)
// //   })
// //   const jsonData = XLSX.utils.sheet_to_json(sheet, {
// //     raw: true,
// //     cellDates: true
// //   })

// //   return jsonData.map((row) => {
// //     Object.keys(row).forEach((key) => {
// //       let value = row[key]
// //       console.log("Original Value:", value, typeof value)

// //       // Check if the field contains a Date object
// //       if (value instanceof Date) {
// //         console.log("Found a date:", value)
// //         row[key] = value
// //       } else if (typeof value === "string") {
// //         // Handle date strings
// //         const dateFormats = [
// //           { regex: /^\d{1,2}-\d{1,2}-\d{4}$/, separator: "-" }, // DD-MM-YYYY
// //           { regex: /^\d{1,2}\/\d{1,2}\/\d{2,4}$/, separator: "/" } // DD/MM/YYYY
// //         ]

// //         for (const { regex, separator } of dateFormats) {
// //           if (regex.test(value)) {
// //             console.log("Date detected:", value)

// //             // Split the date string and create a Date object
// //             const [day, month, year] = value.split(separator).map(Number)

// //             // Adjust year for two-digit format
// //             const fullYear =
// //               year < 100 ? (year < 50 ? 2000 + year : 1900 + year) : year // Adjust for 2-digit year

// //             // Create a date in UTC to avoid time zone issues
// //             const parsedDate = new Date(Date.UTC(fullYear, month - 1, day))

// //             if (!isNaN(parsedDate.getTime())) {
// //               row[key] = parsedDate // Replace with Date object
// //               console.log("Parsed Date:", parsedDate)
// //             } else {
// //               console.error("Failed to parse date:", value)
// //             }
// //             break // Exit loop after the first match
// //           }
// //         }
// //       }
// //     })
// //     return row
// //   })
// // }

// // export const ExceltoJson = async (req, res) => {
// //   try {
// //     if (!req.file) {
// //       return res.status(400).send("No file uploaded.")
// //     }

// //     // Get the path from req.file
// //     const filePath = req.file.path

// //     // Convert the uploaded Excel file to JSON
// //     const jsonData = convertExcelToJson(filePath)
// //     console.log("jsnnnnnnn", jsonData)
// //     // Log the parsed JSON data
// //     const product = await Product.find()
// //     const company = await Company.find()
// //     const branch = await Branch.find()

// //     for (const item of jsonData) {
// //       const matchingProduct = product.find(
// //         (product) => product.productName === item["Type"]
// //       )
// //       const matchingCompany = company.find(
// //         (company) => company.name === "CAMET GROUP"
// //       )
// //       const matchingBranch = branch.find(
// //         (branch) => branch.branchName === "ACCUANET"
// //       )

// //       const selectedData = [
// //         {
// //           company_id: matchingCompany ? matchingCompany._id : null,
// //           companyName: matchingCompany ? matchingCompany.name : "",
// //           branch_id: matchingBranch ? matchingBranch._id : null,
// //           branchName: matchingBranch ? matchingBranch.branchName : "",
// //           product_id: matchingProduct ? matchingProduct._id : null,
// //           productName: item["Type"],
// //           brandName: item["S/W Type"],
// //           categoryName: item["User"],
// //           licensenumber: item["CUSTOMER ID"],
// //           softwareTrade: item["Software Trade"],
// //           noofusers: item["NoOfUser"],
// //           companyusing: item["CompanyUsing"],
// //           version: item["Version"],
// //           customerAddDate: item["Act On"],
// //           amcstartDate: item["Software HitDate"],
// //           amcendDate: item["Due On"],
// //           amcAmount: "",
// //           amcDescription: "",
// //           licenseExpiryDate: "",
// //           productAmount: item["Total Amount"],
// //           productamountDescription: "",
// //           tvuexpiryDate: "",
// //           tvuAmount: "",
// //           tvuamountDescription: "",
// //           isActive: item["Party Status"]
// //         }
// //       ]

// //       // Conditionally add the Wallet Id only if it exists
// //       if (item["Wallet Id"]) {
// //         selectedData.push({
// //           productName: "Wallet Id",
// //           licensenumber: item["Wallet Id"]
// //         })
// //       }

// //       const customerData = new Customer({
// //         customerName: item["Party Name"],
// //         address1: item["Address"],
// //         country: item["Country"],
// //         state: item["State"],
// //         city: item["City"],
// //         pincode: item["OnlineZipCode"],
// //         email: item["EmailID"],
// //         mobile: item["Mobile"],
// //         landline: item["Landline"],
// //         contactPerson: item["Contact Person"],
// //         selected: selectedData
// //       })

// //       await customerData.save()
// //     }

// //     res.status(200).send("File uploaded and data stored successfully!")
// //   } catch (error) {
// //     console.error("Error uploading file:", error.message)
// //     res.status(500).send("Error processing file.")
// //   }
// // }
