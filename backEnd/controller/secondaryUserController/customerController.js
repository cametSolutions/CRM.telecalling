import Customer from "../../model/secondaryUser/customerSchema.js"
import License from "../../model/secondaryUser/licenseSchema.js"
import CallRegistration from "../../model/secondaryUser/CallRegistrationSchema.js"
import mongoose from "mongoose"

export const CustomerRegister = async (req, res) => {
  const { customerData, tabledata = {} } = req.body

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
      message: "Customer created successfully"
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: "server error" })
  }
}
export const CustomerEdit = async (req, res) => {
  const { customerData, tableData } = req.body
  const customerId = req.query.customerid

  try {
    if (customerId && customerData) {
      const objectId = new mongoose.Types.ObjectId(customerId)

      const existingCustomer = await Customer.findById(objectId)

      if (!existingCustomer) {
        return res.status(404).json({ message: "Customer not found" })
      }

      existingCustomer.selected = tableData
      existingCustomer.customerName =
        customerData.customerName || existingCustomer.customerName
      existingCustomer.address1 =
        customerData.address1 || existingCustomer.landline

      existingCustomer.address2 =
        customerData.address2 || existingCustomer.address2
      existingCustomer.country =
        customerData.country || existingCustomer.country
      existingCustomer.state = customerData.state || existingCustomer.state
      existingCustomer.city = customerData.city || existingCustomer.city
      existingCustomer.pincode =
        customerData.pincode || existingCustomer.pincode
      existingCustomer.email = customerData.email || existingCustomer.email
      existingCustomer.mobile = customerData.mobile || existingCustomer.mobile
      existingCustomer.landline =
        customerData.landline || existingCustomer.landline
      existingCustomer.isActive =
        customerData.isActive || existingCustomer.isActive
      // Step 3: Save the changes to the database
      await existingCustomer.save()
      res.status(200).json({ message: "Customer updated succesfully" })
    }
  } catch (error) {
    console.log("Error:", error.message)
    res.status(500).json({ message: "Error updating customer" })
  }
}
export const GetCustomer = async (req, res) => {
  const { search } = req.query
  console.log("seatrj", search)

  try {
    let searchCriteria = {}
    if (search) {
      if (!isNaN(search)) {
        // Search by license number or mobile number using partial match
        const searchRegex = new RegExp(`^${search}`, "i")

        searchCriteria = {
          $or: [
            { "selected.licensenumber": searchRegex },
            { mobile: searchRegex }
          ]
        }
      } else {
        // Search by customer name
        searchCriteria = { customerName: new RegExp(search, "i") }
        console.log("search ", searchCriteria)
      }

      const customers = await Customer.find(searchCriteria)
      // console.log("customeresincontrol", customers)
      if (customers.length === 0) {
        return res.json({ message: "No customer found" })
      } else {
        return res.json({ message: "Customer(s) found", data: customers })
      }
    } else {
      console.log("seaerhcinelse")
      const customers = await Customer.find()
      // .sort({ customerName: 1 })
      if (customers.length === 0) {
        return res.json({ message: "No customer found" })
      } else {
        return res.json({ message: "Customer(s) found", data: customers })
      }
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
    console.log("calldata", calldata)
    // Convert customerid to ObjectId
    const customerId = new mongoose.Types.ObjectId(customerid)

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      throw new Error("Invalid ObjectId format")
    }

    // Find if there is already a call registration for this customer
    const user = await CallRegistration.findOne({ customerid: customerId })
    console.log("user", user)

    if (user) {
      const token = calldata.formdata.token
      if (token) {
        const callToUpdate = user.callregistration.find(
          (call) => call.timedata.token === token
        )
        console.log("calldata", calldata)
        console.log("calltoupadatae", callToUpdate)
        // Function to convert "HH:MM:SS" format to total seconds
        function timeToSeconds(duration) {
          const parts = duration.split(":").map(Number) // split into [hours, minutes, seconds]
          const hours = parts[0] || 0
          const minutes = parts[1] || 0
          const seconds = parts[2] || 0
          return hours * 3600 + minutes * 60 + seconds // convert all to seconds
        }

        // Function to convert total seconds back to "HH:MM:SS" format
        function secondsToTime(totalSeconds) {
          const hours = Math.floor(totalSeconds / 3600)
            .toString()
            .padStart(2, "0")
          const minutes = Math.floor((totalSeconds % 3600) / 60)
            .toString()
            .padStart(2, "0")
          const seconds = (totalSeconds % 60).toString().padStart(2, "0")
          return `${hours}:${minutes}:${seconds}`
        }

        // Assuming callToUpdate.timedata.duration and calldata.timedata.duration are in "HH:MM:SS" format
        const duration1InSeconds = timeToSeconds(callToUpdate.timedata.duration)
        const duration2InSeconds = timeToSeconds(calldata.timedata.duration)

        // Add the durations
        const totalDurationInSeconds = duration1InSeconds + duration2InSeconds
        if (callToUpdate) {
          // Update the fields with the new data

          callToUpdate.timedata.startTime = calldata.timedata.startTime
          callToUpdate.timedata.endTime = calldata.timedata.endTime
          // Convert the total duration back to "HH:MM:SS" format
          callToUpdate.timedata.duration = secondsToTime(totalDurationInSeconds)
          callToUpdate.timedata.token = calldata.timedata.token
          callToUpdate.formdata = calldata.formdata
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
      } else {
        user.callregistration.push(calldata)
      }

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
      // const customer = await Customer({
      //   callregistration: updatedCall._id
      // })
      // await customer.save()
      console.log("uadaredcalls", updatedCall)

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
    console.log("idsssssssss", callId)

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

export const GetallCalls = async (req, res, socket) => {
  try {
    let totalTokens = 0
    let pendingCount = 0
    let solvedCount = 0
    let todayCallsCount = 0
    const allcalls = await CallRegistration.find()
      .populate({
        path: "callregistration.product", // Populate the product field inside callregistration array
        select: "productName" // Optionally select fields from the Product schema you need
      })
      .exec()

    const isToday = (date) => {
      const today = new Date()
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      )
    }

    allcalls.forEach((token) => {
      const callRegistrations = token.callregistration
      totalTokens += callRegistrations.length

      callRegistrations.forEach((call) => {
        if (call.formdata.status === "pending") {
          pendingCount++
        } else {
          solvedCount++
        }

        const startTime = new Date(call.timedata.startTime)
        if (isToday(startTime)) {
          todayCallsCount++
        }
      })
    })

    const alltokens = {
      totalTokens,
      pendingCount,
      solvedCount,
      todayCallsCount
    }
    console.log("alltok", alltokens)

    if (allcalls.length > 0) {
      res.status(200).json({
        message: "calls found",
        data: {
          allcalls,
          alltokens
        }
      })
    } else {
      res.status(400).json({ message: "no calls" })
    }
  } catch (error) {
    console.log("error:", error.message)
    res.status(500).json({ message: "server error" })
  }
}
