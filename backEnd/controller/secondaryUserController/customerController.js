import Customer from "../../model/secondaryUser/customerSchema.js"
import License from "../../model/secondaryUser/licenseSchema.js"
import CallRegistration from "../../model/secondaryUser/CallRegistrationSchema.js"
import mongoose from "mongoose"

export const CustomerRegister = async (req, res) => {
  const { customerData, tabledata = {} } = req.body
  console.log("table", tabledata)
  console.log("pin", customerData.pincode)
  console.log("pinty", typeof customerData.pincode)

  const {
    customerName,
    address1,
    address2,
    country,
    state,
    city,
    pincode,
    email,
    mobile,
    landline,
    isActive
  } = customerData

  // Check if user already exists
  const customerExists = await Customer.findOne({ customerName })

  if (customerExists) {
    return res.status(400).json({ message: "Customer already registered" })
  }

  try {
    const customer = new Customer({
      customerName,
      address1,
      address2,
      country,
      state,
      city,
      pincode,
      email,
      mobile,
      landline,
      isActive,
      selected: tabledata
    })

    const customerData = await customer.save()

    if (tabledata) {
      for (const item of customerData.selected) {
        const license = new License({
          products: item.product_id,
          customerName: customerData._id, // Using the customer ID from the parent object
          licensenumber: item.licensenumber
        })

        await license.save()
      }
    }

    return res.status(200).json({
      status: true,
      message: "Customer created successfullyddddddddd"
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: "server error" })
  }
}
export const GetCustomer = async (req, res) => {
  const { search } = req.query

  try {
    let searchCriteria = {}

    if (!isNaN(search)) {
      // Search by license number or mobile number using partial match
      const searchRegex = new RegExp(`^${search}`, "i")

      searchCriteria = {
        $or: [{ "selected.license_no": searchRegex }, { mobile: searchRegex }]
      }
    } else {
      // Search by customer name
      searchCriteria = { customerName: new RegExp(search, "i") }
    }

    let customers = await Customer.find(searchCriteria)

    if (customers.length === 0) {
      res.json({ message: "No customer found" })
    } else {
      res.json({ message: "Customer(s) found", data: customers })
    }
  } catch (error) {
    console.error("Error fetching customer data:", error.message)
    res
      .status(500)
      .json({ message: "An error occurred while fetching customer data." })
  }
}

export const GetLicense = async (req, res) => {
  try {
    const licensenumber = await License.find()
    console.log("license number:", licensenumber)
    if (licensenumber.length > 0) {
      res
        .status(200)
        .json({ message: "license number found", data: licensenumber })
    }
  } catch (err) {
    console.log(err.message)
    res.status(500).send("server error")
  }
}
export const customerCallRegistration = async (req, res) => {
  try {
    const { customerid, customer } = req.query // Get customerid from query
    const calldata = req.body // Assuming calldata is sent in the body
    console.log("calldatasssss", calldata)
    console.log("customeridddd", customerid)

    // Convert customerid to ObjectId
    const customerId = new mongoose.Types.ObjectId(customerid)

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      throw new Error("Invalid ObjectId format")
    }

    // Find if there is already a call registration for this customer
    const user = await CallRegistration.findOne({ customerid: customerId })

    if (user) {
      const token = calldata.formdata.token
      if (token) {
        const callToUpdate = user.callregistration.find(
          (call) => call.timedata.token === token
        )
        if (callToUpdate) {
          // Update the fields with the new data
          callToUpdate.timedata = calldata.timedata
          callToUpdate.formdata = calldata.formdata
          callToUpdate.userName = calldata.userName
          callToUpdate.product = calldata.product
          callToUpdate.license = calldata.license
          callToUpdate.branchName = calldata.branchName

          // Save the updated document
          const updatedCall = await user.save()
          return res.status(200).json({
            status: true,
            message: "New call added successfully",
            updatedCall
          })
          // Return or log the updated call if needed
        }
      }

      // If a document is found, update it by pushing new call data to callregistration array
      else user.callregistration.push(calldata)

      // Save the updated document
      const updatedCall = await user.save()

      return res.status(200).json({
        status: true,
        message: "New call added successfully",
        updatedCall
      })
    } else {
      // If no document is found, create a new one with the given call data
      const newCall = new CallRegistration({
        customerid: customerId,
        customerName: customer,
        callregistration: [calldata] // Wrap calldata in an array
      })

      // Save the new document
      const updatedCall = await newCall.save()

      return res.status(200).json({
        status: true,
        message: "Call registered successfully",
        updatedCall
      })
    }
  } catch (error) {
    console.error("Error saving or updating call registration:", error.message)
    return res.status(500).json({
      status: false,
      message: "Error saving or updating call registration"
    })
  }
}

export const GetCallRegister = async (req, res) => {
  try {
    const { customerid, customer } = req.query
    const { callId } = req.params

    if (customerid !== "null" && customerid) {
      const customerId = new mongoose.Types.ObjectId(customerid)
      const registeredCall = await CallRegistration.findOne({
        customerid: customerId
      })

      if (registeredCall) {
        res
          .status(200)
          .json({ message: "registered call found", data: registeredCall })
      }
    } else if (callId) {
      console.log("callid", callId)
      const callDetails = await CallRegistration.findById(callId)
        .populate("customerid")
        .populate({
          path: "callregistration.product", // Populate the product field inside callregistration array
          model: "Product"
        })
      console.log("custojmer found", callDetails)

      if (!callDetails) {
        return res.status(404).json({ message: "Call not found" })
      }

      // Send the call details as a response
      res
        .status(200)
        .json({ message: "calls with respect customer found", callDetails })
    } else {
      return res
        .status(200)
        .json({ message: "this customer doesnt make calls" })
    }
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: "internal server error" })
  }
}
export const GetallCalls = async (req, res) => {
  try {
    const allcalls = await CallRegistration.find()
      .populate({
        path: "callregistration.product", // Populate the product field inside callregistration array
        select: "productName" // Optionally select fields from the Product schema you need
      })
      .exec()
    console.log("allcalls", allcalls)

    if (allcalls.length > 0) {
      res.status(200).json({ message: "calls found", data: allcalls })
    } else {
      res.status(400).json({ message: "no calls" })
    }
  } catch (error) {
    console.log("error:", error.message)
    res.status(500).json({ message: "server error" })
  }
}
