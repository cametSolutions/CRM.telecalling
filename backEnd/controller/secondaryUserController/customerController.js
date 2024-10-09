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
      console.log("search ", searchCriteria)
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

// export const customerCallRegistration = async (reqOrSocket, resOrData) => {
//   try {
//     let customerid, calldata;

//     // Check if it's an HTTP request (req/res) or WebSocket (socket/data)
//     if (reqOrSocket.query && resOrData.json) {
//       // It's an API call
//       customerid = reqOrSocket.query.customerid;
//       calldata = reqOrSocket.body;
//     } else {
//       // It's a WebSocket call
//       customerid = resOrData.customerid;
//       calldata = resOrData;
//     }

//     // Convert customerid to ObjectId
//     const customerId = new mongoose.Types.ObjectId(customerid);

//     if (!mongoose.Types.ObjectId.isValid(customerId)) {
//       throw new Error("Invalid ObjectId format");
//     }

//     // Find if there is already a call registration for this customer
//     const user = await CallRegistration.findOne({ customerid: customerId });

//     if (user) {
//       const token = calldata.formdata.token;
//       if (token) {
//         const callToUpdate = user.callregistration.find(
//           (call) => call.timedata.token === token
//         );
//         if (callToUpdate) {
//           // Update the fields with the new data
//           callToUpdate.timedata = calldata.timedata;
//           callToUpdate.formdata = calldata.formdata;
//           callToUpdate.userName = calldata.userName;
//           callToUpdate.product = calldata.product;
//           callToUpdate.license = calldata.license;
//           callToUpdate.branchName = calldata.branchName;

//           // Save the updated document
//           const updatedCall = await user.save();

//           // Send response based on type
//           if (reqOrSocket.query && resOrData.json) {
//             // API response
//             return resOrData.status(200).json({
//               status: true,
//               message: "New call updated successfully",
//               updatedCall,
//             });
//           } else {
//             // WebSocket response
//             reqOrSocket.emit("initialData", { updatedCall });
//             return reqOrSocket.emit("success", {
//               status: true,
//               message: "New call updated successfully",
//               updatedCall,
//             });
//           }
//         }
//       }

//       // If no token matches, push new call data to callregistration array
//       user.callregistration.push(calldata);

//       // Save the updated document
//       const updatedCall = await user.save();

//       // Send response based on type
//       if (reqOrSocket.query && resOrData.json) {
//         // API response
//         return resOrData.status(200).json({
//           status: true,
//           message: "New call added successfully",
//           updatedCall,
//         });
//       } else {
//         // WebSocket response
//         reqOrSocket.emit("initialData", { updatedCall });
//         return reqOrSocket.emit("success", {
//           status: true,
//           message: "New call added successfully",
//           updatedCall,
//         });
//       }
//     } else {
//       // If no document is found, create a new one with the given call data
//       const newCall = new CallRegistration({
//         customerid: customerId,
//         customerName: calldata.customer,
//         callregistration: [calldata], // Wrap calldata in an array
//       });

//       // Save the new document
//       const savedCall = await newCall.save();

//       // Send response based on type
//       if (reqOrSocket.query && resOrData.json) {
//         // API response
//         return resOrData.status(200).json({
//           status: true,
//           message: "Call registered successfully",
//           savedCall,
//         });
//       } else {
//         // WebSocket response
//         reqOrSocket.emit("initialData", { savedCall });
//         return reqOrSocket.emit("success", {
//           status: true,
//           message: "Call registered successfully",
//           savedCall,
//         });
//       }
//     }
//   } catch (error) {
//     console.error("Error saving or updating call registration:", error.message);

//     // Send error based on type
//     if (reqOrSocket.query && resOrData.json) {
//       // API error response
//       return resOrData.status(500).json({
//         status: false,
//         message: "Error saving or updating call registration",
//       });
//     } else {
//       // WebSocket error response
//       return reqOrSocket.emit("error", {
//         status: false,
//         message: "Error saving or updating call registration",
//       });
//     }
//   }
// };

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
