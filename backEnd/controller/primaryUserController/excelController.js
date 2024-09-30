import XLSX from "xlsx"

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
    // console.log("jsnnnnnnn", jsonData)
    console.log("hiii")
    // Log the parsed JSON data
    const product = await Product.find()
    const company = await Company.find()
    const branch = await Branch.find()

    for (const item of jsonData) {
      const matchingProduct = product.find(
        (product) => product.productName === item["Type"].toUpperCase()
      )
      const matchingCompany = company.find(
        (company) => company.companyName === "CAMET GROUP"
      )
      console.log("matc", matchingCompany)
      const matchingBranch = branch.find(
        (branch) => branch.branchName === item["Branch"].toUpperCase()
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

      if (item["Wallet Name"]) {
        selectedData.push({
          company_id: matchingCompany ? matchingCompany._id : null,
          companyName: matchingCompany ? matchingCompany.name : "",
          branch_id: matchingBranch ? matchingBranch._id : null,
          branchName: matchingBranch ? matchingBranch.branchName : "",
          product_id: matchingProduct ? matchingProduct._id : null,
          productName: item["Wallet Name"],
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
          amcAmount: item["Total Amount"],
          amcDescription: "",
          licenseExpiryDate: "",
          productAmount: "",
          productamountDescription: "",
          tvuexpiryDate: "",
          tvuAmount: "55555",
          tvuamountDescription: "",
          isActive: item["Party Status"]
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
