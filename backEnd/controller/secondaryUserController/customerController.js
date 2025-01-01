import Customer from "../../model/secondaryUser/customerSchema.js"
import License from "../../model/secondaryUser/licenseSchema.js"
import CallRegistration from "../../model/secondaryUser/CallRegistrationSchema.js"
import CallNote from "../../model/secondaryUser/callNotesSchema.js"
import models from "../../model/auth/authSchema.js"
import { sendEmail } from "../../helper/nodemailer.js"
const { Staff, Admin } = models
import mongoose from "mongoose"
export const GetallCallnotes = async (req, res) => {
  try {
    const callnotes = await CallNote.find({})

    if (callnotes) {
      return res
        .status(200)
        .json({ message: "callnotes found", data: callnotes })
    }
  } catch (error) {
    console.log("error:", error.message)
  }
}
export const DeleteCallnotes = async (req, res) => {
  const { id } = req.query

  const objectId = new mongoose.Types.ObjectId(id)

  try {
    // Perform the deletion
    const result = await CallNote.findByIdAndDelete(objectId)

    if (result) {
      return res.status(200).json({ message: " deleted successfully" })
    } else {
      return res.status(404).json({ message: "callnote not found" })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Server error" })
  }
}

export const UpdateCallnotes = async (req, res) => {
  const { id } = req.query

  const objectId = new mongoose.Types.ObjectId(id)
  const formData = req.body
  if (!id) {
    return res.status(400).json({ message: "Invalid id" })
  }

  try {
    const updatedCallnotes = await CallNote.findByIdAndUpdate(
      objectId,
      formData,
      {
        new: true
      }
    )

    if (!updatedCallnotes) {
      return res.status(404).json({ message: "callnotes not found" })
    }

    res.status(200).json({ data: updatedCallnotes })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}
export const GetselectedDateCalls = async (req, res) => {
  try {
    console.log("koolll")
    const { startDate, endDate } = req.query
    console.log("stardate", startDate)
    console.log(typeof startDate)
    console.log("enddate", endDate)

    const customerCalls = await CallRegistration.aggregate([
      // Stage 1: Unwind the attendedBy array
      {
        $unwind: {
          path: "$callregistration.formdata.attendedBy",
          preserveNullAndEmptyArrays: false // Only keep documents with attendedBy entries
        }
      }
      // Stage 2: Match documents within the date range and ensure calldate is valid
      // {
      //   $match: {
      //     $and: [
      //       {
      //         "callregistration.formdata.attendedBy.calldate": {
      //           $exists: true,
      //           $ne: ""
      //         }
      //       }, // Ensure calldate exists and is not empty
      //       {
      //         "callregistration.formdata.attendedBy.calldate": {
      //           $gte: startDate,
      //           $lte: endDate
      //         }
      //       } // Match date range
      //     ]
      //   }
      // }
      // Stage 3: Group back to reconstruct documents and include only filtered attendedBy entries
      // {
      //   $group: {
      //     _id: "$_id",
      //     attendedBy: {
      //       $push: "$callregistration.formdata.attendedBy" // Recreate the attendedBy array with filtered data
      //     },
      //     // Include other fields if needed
      //     otherFields: { $first: "$otherFields" } // Example: Replace 'otherFields' with the fields you want to preserve
      //   }
      // },
      // // Stage 4: Project the final structure
      // {
      //   $project: {
      //     _id: 1,
      //     "callregistration.formdata.attendedBy": "$attendedBy" // Reassign filtered attendedBy array
      //     // Include additional fields if needed
      //   }
      // }
    ])

    console.log("customercalls", customerCalls)

    res.status(200).send(customerCalls)
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "internal server error" })
  }
}
export const CallnoteRegistration = async (req, res) => {
  try {
    const formdata = req.body

    const existingItem = await CallNote.findOne({
      callNotes: formdata.callNotes
    })
    if (existingItem) {
      return res
        .status(400)
        .json({ message: "This callnotes  is already registered" })
    }

    // Create and save call notes
    const collection = new CallNote({
      callNotes: formdata.callNotes
    })

    await collection.save()

    res.status(200).json({
      status: true,
      message: "Call notes created successfully",
      data: collection
    })
  } catch (error) {
    console.log("error:", error.message)
  }
}

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
    contactPerson,
    email,
    mobile,
    landline,
    industry
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
      industry,
      contactPerson,
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
    console.log("error:", error.message)
    res.status(500).json({ message: "server error" })
  }
}
export const CustomerEdit = async (req, res) => {
  const { customerData, tableData } = req.body
  const customerId = req.query.customerid

  if (!customerId || !customerData) {
    return res
      .status(400)
      .json({ message: "Customer ID and data are required" })
  }

  try {
    const objectId = new mongoose.Types.ObjectId(customerId)

    // Find the existing customer
    const existingCustomer = await Customer.findById(objectId)
    if (!existingCustomer) {
      return res.status(404).json({ message: "Customer not found" })
    }

    // Update formdata (overwrite existing fields with new ones)
    Object.assign(existingCustomer, customerData)

    // Update or add tabledata (handle array of objects)
    if (Array.isArray(tableData) && tableData.length > 0) {
      for (const item of tableData) {
        const existingIndex = existingCustomer.selected.findIndex(
          (selectedItem) =>
            selectedItem.product_id.toString() === item.product_id.toString()
        )

        if (existingIndex !== -1) {
          // Update existing entry
          existingCustomer.selected[existingIndex] = {
            ...existingCustomer.selected[existingIndex],
            ...item
          }
        } else {
          // Add new entry if not found
          existingCustomer.selected.push(item)
        }
      }
    }

    // Save the updated customer document
    await existingCustomer.save()

    res.status(200).json({
      message: "Customer updated successfully"
    })
  } catch (error) {
    console.error("Error updating customer:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
export const DeleteCustomer = async (req, res) => {
  const { id } = req.query

  try {
    // Perform the deletion
    const result = await Customer.findByIdAndDelete(id)

    if (result) {
      return res.status(200).json({ message: "Customer deleted successfully" })
    } else {
      return res.status(404).json({ message: "Customer not found" })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Server error" })
  }
}

export const GetCustomer = async (req, res) => {
  const search = req.query?.search
  const role = req.query?.role
  const userBranch = req.query?.userBranch
  const pendingCustomerList = req.query?.pendingCustomerList
  let objectIds
  let parsedBranch

  if (userBranch) {
    parsedBranch = JSON.parse(decodeURIComponent(userBranch))
  }

  if (
    search &&
    Array.isArray(parsedBranch) &&
    parsedBranch.length > 0 &&
    role !== "Admin"
  ) {
    const branches = JSON.parse(decodeURIComponent(userBranch))
    objectIds = branches?.map((id) => new mongoose.Types.ObjectId(id))
  } else {
    objectIds = parsedBranch?.map((id) => new mongoose.Types.ObjectId(id))
  }

  try {
    if (
      search &&
      Array.isArray(parsedBranch) &&
      parsedBranch.length > 0 &&
      role !== "Admin"
    ) {
      if (!isNaN(search)) {
        const searchRegex = new RegExp(`^${search}`, "i")

        const mobileCustomer = await Customer.find({
          mobile: searchRegex
        }).lean()

        const licenseCustomer = await Customer.find({
          $expr: {
            $gt: [
              {
                $size: {
                  $filter: {
                    input: "$selected",
                    as: "item",
                    cond: {
                      $regexMatch: {
                        input: { $toString: "$$item.licensenumber" }, // Convert to string
                        regex: search, // your regex pattern
                        options: "i" // case-insensitive if needed
                      }
                    }
                  }
                }
              },
              0
            ]
          }
        }).lean()
        const customers = [...mobileCustomer, ...licenseCustomer]

        if (!customers || customers.length === 0) {
          return res
            .status(404)
            .json({ message: "No customer found", data: [] })
        } else {
          return res
            .status(200)
            .json({ message: "Customer(s) found", data: customers })
        }
      } else {
        // Search by customer name

        const searchRegex = new RegExp(`^${search}`, "i")
        const customers = await Customer.aggregate([
          {
            $match: {
              customerName: searchRegex, // Match the customer name using the regex search
              "selected.branch_id": { $in: objectIds } // Match branch_id within the selected array
            }
          },
          {
            $unwind: {
              path: "$selected", // Unwind the selected array to access individual items
              preserveNullAndEmptyArrays: true // Keep empty arrays if any
            }
          },
          {
            $addFields: {
              "selected.branchObjectId": { $toObjectId: "$selected.branch_id" },
              "selected.companyObjectId": {
                $toObjectId: "$selected.company_id"
              },
              "selected.productObjectId": {
                $toObjectId: "$selected.product_id"
              }
            }
          },

          {
            $lookup: {
              from: "branches", // Name of the Branch collection
              localField: "selected.branchObjectId", // Field from the customer document
              foreignField: "_id", // Match the _id field from the Branch collection
              as: "branchDetails" // Alias for the resulting joined branch documents
            }
          },
          {
            $lookup: {
              from: "companies", // Name of the Company collection
              localField: "selected.companyObjectId", // Field from the customer document
              foreignField: "_id", // Match the _id field from the Company collection
              as: "companyDetails" // Alias for the resulting joined company documents
            }
          },
          {
            $lookup: {
              from: "products", // Name of the Product collection
              localField: "selected.productObjectId", // Field from the customer document
              foreignField: "_id", // Match the _id field from the Product collection
              as: "productDetails" // Alias for the resulting joined product documents
            }
          },
          {
            $addFields: {
              "selected.product_id": { $arrayElemAt: ["$productDetails", 0] },
              "selected.branch_id": { $arrayElemAt: ["$branchDetails", 0] },
              "selected.company_id": { $arrayElemAt: ["$companyDetails", 0] } // Replace product_id with populated product data
            }
          },

          {
            $group: {
              _id: "$_id", // Group by the customer's _id
              customerName: { $first: "$customerName" }, // Keep customer name
              address1: { $first: "$address1" },
              state: { $first: "$state" },
              pincode: { $first: "$pincode" },
              email: { $first: "$email" },
              mobile: { $first: "$mobile" },
              selected: { $push: "$selected" } // Push the selected data
            }
          }
        ])

        if (customers.length > 0) {
          return res
            .status(200)
            .json({ message: "Customer(s) found", data: customers })
        } else {
          return res
            .status(200)
            .json({ message: "No customer found", data: [] })
        }
      }
    } else if (search && role === "Admin") {
      if (!isNaN(search)) {
        const searchRegex = new RegExp(`^${search}`, "i")

        const mobileCustomer = await Customer.find({
          mobile: searchRegex
        }).lean()

        const licenseCustomer = await Customer.find({
          $expr: {
            $gt: [
              {
                $size: {
                  $filter: {
                    input: "$selected",
                    as: "item",
                    cond: {
                      $regexMatch: {
                        input: { $toString: "$$item.licensenumber" }, // Convert to string
                        regex: search, // your regex pattern
                        options: "i" // case-insensitive if needed
                      }
                    }
                  }
                }
              },
              0
            ]
          }
        }).lean()
        const customers = [...mobileCustomer, ...licenseCustomer]

        if (!customers || customers.length === 0) {
          return res
            .status(404)
            .json({ message: "No customer found", data: [] })
        } else {
          return res
            .status(200)
            .json({ message: "Customer(s) found", data: customers })
        }
      } else {
        // Search by customer name

        const searchRegex = new RegExp(`^${search}`, "i")
        const customers = await Customer.aggregate([
          {
            $match: {
              customerName: searchRegex // Match the customer name using the regex search
            }
          },
          {
            $unwind: {
              path: "$selected", // Unwind the selected array to access individual items
              preserveNullAndEmptyArrays: true // Keep empty arrays if any
            }
          },
          {
            $addFields: {
              "selected.branchObjectId": { $toObjectId: "$selected.branch_id" },
              "selected.companyObjectId": {
                $toObjectId: "$selected.company_id"
              },
              "selected.productObjectId": {
                $toObjectId: "$selected.product_id"
              }
            }
          },

          {
            $lookup: {
              from: "branches", // Name of the Branch collection
              localField: "selected.branchObjectId", // Field from the customer document
              foreignField: "_id", // Match the _id field from the Branch collection
              as: "branchDetails" // Alias for the resulting joined branch documents
            }
          },
          {
            $lookup: {
              from: "companies", // Name of the Company collection
              localField: "selected.companyObjectId", // Field from the customer document
              foreignField: "_id", // Match the _id field from the Company collection
              as: "companyDetails" // Alias for the resulting joined company documents
            }
          },
          {
            $lookup: {
              from: "products", // Name of the Product collection
              localField: "selected.productObjectId", // Field from the customer document
              foreignField: "_id", // Match the _id field from the Product collection
              as: "productDetails" // Alias for the resulting joined product documents
            }
          },
          {
            $addFields: {
              "selected.product_id": { $arrayElemAt: ["$productDetails", 0] },
              "selected.branch_id": { $arrayElemAt: ["$branchDetails", 0] },
              "selected.company_id": { $arrayElemAt: ["$companyDetails", 0] } // Replace product_id with populated product data
            }
          },

          {
            $group: {
              _id: "$_id", // Group by the customer's _id
              customerName: { $first: "$customerName" }, // Keep customer name
              address1: { $first: "$address1" },
              state: { $first: "$state" },
              pincode: { $first: "$pincode" },
              email: { $first: "$email" },
              mobile: { $first: "$mobile" },
              selected: { $push: "$selected" } // Push the selected data
            }
          }
        ])

        if (customers.length > 0) {
          return res
            .status(200)
            .json({ message: "Customer(s) found", data: customers })
        } else {
          return res
            .status(200)
            .json({ message: "No customer found", data: [] })
        }
      }
    } else {
      try {
        let customers

        if (role === "Admin" || pendingCustomerList) {
          // Admin: Fetch all customers
          customers = await Customer.find().sort({ customerName: 1 }).exec()
        } else {
          if (pendingCustomerList) {
            customers = await Customer.find().sort({ customerName: 1 }).exec()
          } else if (!parsedBranch || parsedBranch.length === 0) {
            return res
              .status(403)
              .json({ message: "No branches assigned to staff" })
          }

          // const branchIds = user.selected.map((branch) => branch.branch_id)

          customers = await Customer.find({
            "selected.branch_id": { $in: objectIds }
          })
            .sort({ customerName: 1 })
            .exec()
        }

        if (customers.length === 0) {
          return res
            .status(404)
            .json({ message: "No customer found", data: [] })
        }

        return res
          .status(200)
          .json({ message: "Customer(s) found", data: customers })
      } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error" })
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
    const { customerid, customer, branchName = {}, username } = req.query // Get customerid from query

    const calldata = req.body // Assuming calldata is sent in the body
    // Convert attendedBy.callerId to ObjectId
    if (
      calldata.formdata &&
      calldata.formdata.attendedBy &&
      calldata.formdata.attendedBy.callerId
    ) {
      calldata.formdata.attendedBy.callerId = new mongoose.Types.ObjectId(
        calldata.formdata.attendedBy.callerId
      )
    }
    if (
      calldata.formdata &&
      calldata.formdata.completedBy &&
      calldata.formdata.completedBy.callerId
    ) {
      calldata.formdata.completedBy.callerId = new mongoose.Types.ObjectId(
        calldata.formdata.completedBy.callerId
      )
    }

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

        // Function to convert "HH:MM:SS" format to total seconds

        if (callToUpdate) {
          // Update the fields with the new data

          callToUpdate.timedata.startTime = calldata.timedata.startTime
          callToUpdate.timedata.endTime = calldata.timedata.endTime
          // Convert the total duration back to "HH:MM:SS" format
          callToUpdate.timedata.duration += calldata.timedata.duration

          callToUpdate.timedata.token = calldata.timedata.token
          callToUpdate.formdata.incomingNumber =
            calldata.formdata.incomingNumber
          callToUpdate.formdata.token = calldata.formdata.token
          callToUpdate.formdata.description = calldata.formdata.description
          callToUpdate.formdata.callnote = calldata.formdata.callnote

          callToUpdate.formdata.solution = calldata.formdata.solution
          callToUpdate.formdata.status = calldata.formdata.status
          callToUpdate.formdata.attendedBy.push(calldata.formdata.attendedBy)
          if (calldata.formdata.status === "solved") {
            callToUpdate.formdata.completedBy.push(
              calldata.formdata.completedBy
            )
          }
          callToUpdate.formdata.completedBy = calldata.formdata.completedBy
          callToUpdate.license = calldata.license
          callToUpdate.branchName = calldata.branchName

          // Save the updated document

          const updatedCall = await user.save()

          if (updatedCall) {
            const Id = calldata.formdata.attendedBy.callerId

            const staffCaller = await Staff.findOne({
              _id: Id
            })
            if (staffCaller) {
              if (calldata.formdata.status === "pending") {
                staffCaller.callstatus.totalCall += 1

                staffCaller.callstatus.pendingCalls += 1

                staffCaller.callstatus.totalDuration +=
                  calldata.timedata.duration

                const pendingSavedStaff = await staffCaller.save()

                if (pendingSavedStaff) {
                  // return res.status(200).json({
                  //   success: true,
                  //   message: "Call registered"
                  // })
                  const emailResponse = await sendEmail(
                    calldata,
                    customer,
                    branchName,
                    username
                  )

                  if (emailResponse) {
                    return res.status(200).json({
                      success: true,
                      message: "Call registered"
                    })
                  } else {
                    return res
                      .status(200)
                      .json({ message: "Call registered email not send" })
                  }
                }
              } else if (calldata.formdata.status === "solved") {
                const mapAndCheckAttendedBy = (data, selectedId) => {
                  //  Count how many times callerId matches selectedId
                  const matchCount = data.formdata.attendedBy.filter(
                    (attendee) => attendee.callerId.equals(selectedId)
                  ).length

                  // Return true if matchCount >= 2, otherwise false
                  return matchCount >= 2
                }

                // Example operation
                const findMatchingDocAndCheckCallerId = (
                  updatedCall,
                  token,
                  selectedId
                ) => {
                  // Find the matching doc
                  const matchingDoc = updatedCall.callregistration.find(
                    (call) => call.timedata.token === token
                  )

                  // If a matching doc is found, call the mapAndCheckAttendedBy function
                  if (matchingDoc) {
                    const isCallerIdMatched = mapAndCheckAttendedBy(
                      matchingDoc,
                      selectedId
                    )
                    return { matchingDoc, isCallerIdMatched }
                  }

                  // Return false if no matching doc is found
                  return false
                }
                //
                const { matchingDoc, isCallerIdMatched } =
                  findMatchingDocAndCheckCallerId(
                    updatedCall,
                    token,
                    calldata?.formdata?.attendedBy?.callerId
                  )

                staffCaller.callstatus.totalCall = isCallerIdMatched
                  ? staffCaller.callstatus.totalCall
                  : staffCaller.callstatus.totalCall + 1

                staffCaller.callstatus.solvedCalls += 1

                staffCaller.callstatus.totalDuration +=
                  calldata.timedata.duration

                const saved = await staffCaller.save()
                if (saved) {
                  // const stringDoc = JSON.stringify(matchingDoc, null, 2)
                  // const parsedDoc = JSON.parse(stringDoc)

                  const processedAttendedBy = matchingDoc.formdata.attendedBy
                    .slice(0, -1)
                    .map((item) => item)

                  try {
                    const results = await updateProcessedAttendees(
                      processedAttendedBy,
                      Id
                    )

                    // Check if there are any items with a status other than "success"
                    const hasErrors = results.some(
                      (result) => result.status !== "success"
                    )

                    if (hasErrors) {
                      return res.status(207).json({
                        // 207 for multi-status response
                        message: "Update process completed with some errors",
                        results
                      })
                    } else {
                      // return res.status(200).json({
                      //   success: true,
                      //   message: "Call registered"
                      // })
                      const emailResponse = await sendEmail(
                        calldata,
                        customer,
                        branchName,
                        username
                      )
                      if (emailResponse) {
                        return res.status(200).json({
                          success: true,
                          message: "Call registered"
                        })
                      } else {
                        return res
                          .status(200)
                          .json({ message: "Call registered email not send" })
                      }
                    }
                  } catch (error) {
                    console.error("Error in updateAttendeesController:", error)
                    return res.status(500).json({
                      message: "An error occurred during the update process",
                      error: error.message
                    })
                  }
                }
              }
            } else {
              const adminCaller = await Admin.findOne({
                _id: Id
              })
              if (adminCaller) {
                if (calldata.formdata.status === "pending") {
                  adminCaller.callstatus.totalCall += 1

                  adminCaller.callstatus.pendingCalls += 1

                  adminCaller.callstatus.totalDuration +=
                    calldata.timedata.duration

                  const pendingAdminSaved = await adminCaller.save()
                  if (pendingAdminSaved) {
                    // return res.status(200).json({
                    //   success: true,
                    //   message: "Call registered"
                    // })
                    const emailResponse = await sendEmail(
                      calldata,
                      customer,
                      branchName,
                      username
                    )

                    if (emailResponse) {
                      return res.status(200).json({
                        success: true,
                        message: "Call registered"
                      })
                    } else {
                      return res
                        .status(200)
                        .json({ message: "Call registered email not send" })
                    }
                  }
                } else if (calldata.formdata.status === "solved") {
                  const mapAndCheckAttendedBy = (data, selectedId) => {
                    // Count how many times callerId matches selectedId
                    const matchCount = data.formdata.attendedBy.filter(
                      (attendee) => attendee.callerId.equals(selectedId)
                    ).length
                    // Return true if matchCount >= 2, otherwise false
                    return matchCount >= 2
                  }

                  // Example operation
                  const findMatchingDocAndCheckCallerId = (
                    updatedCall,
                    token,
                    selectedId
                  ) => {
                    // Find the matching doc
                    const matchingDoc = updatedCall.callregistration.find(
                      (call) => call?.timedata?.token === token
                    )

                    // If a matching doc is found, call the mapAndCheckAttendedBy function
                    if (matchingDoc) {
                      const isCallerIdMatched = mapAndCheckAttendedBy(
                        matchingDoc,
                        selectedId
                      )
                      return { matchingDoc, isCallerIdMatched }
                    }

                    // Return false if no matching doc is found
                    return false
                  }
                  //
                  const { matchingDoc, isCallerIdMatched } =
                    findMatchingDocAndCheckCallerId(
                      updatedCall,
                      token,
                      calldata?.formdata?.attendedBy?.callerId
                    )
                  //

                  adminCaller.callstatus.totalCall = isCallerIdMatched
                    ? adminCaller.callstatus.totalCall
                    : adminCaller.callstatus.totalCall + 1

                  adminCaller.callstatus.solvedCalls += 1

                  adminCaller.callstatus.totalDuration +=
                    calldata.timedata.duration

                  const saved = await adminCaller.save()
                  if (saved) {
                    const processedAttendedBy = matchingDoc.formdata.attendedBy
                      .slice(0, -1)
                      .map((item) => item)

                    try {
                      const results = await updateProcessedAttendees(
                        processedAttendedBy,
                        Id
                      )

                      // Check if there are any items with a status other than "success"
                      const hasErrors = results.some(
                        (result) => result.status !== "success"
                      )

                      if (hasErrors) {
                        return res.status(207).json({
                          // 207 for multi-status response
                          message: "Update process completed with some errors",
                          results
                        })
                      } else {
                        // return res.status(200).json({
                        //   success: true,
                        //   message: "Call registered"
                        // })
                        const emailResponse = await sendEmail(
                          calldata,
                          customer,
                          branchName,
                          username
                        )
                        if (emailResponse) {
                          return res.status(200).json({
                            success: true,
                            message: "Call registered"
                          })
                        } else {
                          return res
                            .status(200)
                            .json({ message: "Call registered email not send" })
                        }
                      }
                    } catch (error) {
                      console.error(
                        "Error in updateAttendeesController:",
                        error
                      )
                      return res.status(500).json({
                        message: "An error occurred during the update process",
                        error: error.message
                      })
                    }
                  }
                }
              }
            }
          }
        }
      } else {
        user.callregistration.push(calldata)
        const updatedCall = await user.save()
        const Id = calldata.formdata.attendedBy.callerId

        if (updatedCall) {
          const staffCaller = await Staff.findOne({
            _id: Id
          })

          if (staffCaller) {
            if (calldata.formdata.status === "pending") {
              staffCaller.callstatus.totalCall += 1

              staffCaller.callstatus.pendingCalls += 1

              staffCaller.callstatus.totalDuration += calldata.timedata.duration

              const pendingSavedStaff = await staffCaller.save()
              if (pendingSavedStaff) {
                // return res.status(200).json({
                //   success: true,
                //   message: "Call registered"
                // })
                const emailResponse = await sendEmail(
                  calldata,
                  customer,
                  branchName,
                  username
                )

                if (emailResponse) {
                  return res.status(200).json({
                    success: true,
                    message: "Call registered"
                  })
                } else {
                  return res
                    .status(200)
                    .json({ message: "Call registered email not send" })
                }
              }
            } else if (calldata.formdata.status === "solved") {
              staffCaller.callstatus.totalCall += 1

              staffCaller.callstatus.solvedCalls += 1

              staffCaller.callstatus.totalDuration += calldata.timedata.duration

              const saved = await staffCaller.save()
              if (saved) {
                // return res.status(200).json({
                //   success: true,
                //   message: "Call registered"
                // })
                const emailResponse = await sendEmail(
                  calldata,
                  customer,
                  branchName,
                  username
                )
                if (emailResponse) {
                  return res.status(200).json({
                    success: true,
                    message: "Call registered"
                  })
                } else {
                  return res
                    .status(200)
                    .json({ message: "Call registered email not send" })
                }
              }
            }
          } else {
            const adminCaller = await Admin.findOne({
              _id: Id
            })
            if (adminCaller) {
              if (calldata.formdata.status === "pending") {
                adminCaller.callstatus.totalCall += 1

                adminCaller.callstatus.pendingCalls += 1

                adminCaller.callstatus.totalDuration +=
                  calldata.timedata.duration

                const pendingAdminSaved = await adminCaller.save()
                if (pendingAdminSaved) {
                  // return res.status(200).json({
                  //   success: true,
                  //   message: "Call registered"
                  // })
                  const emailResponse = await sendEmail(
                    calldata,
                    customer,
                    branchName
                  )
                  if (emailResponse) {
                    return res.status(200).json({
                      success: true,
                      message: "Call registered"
                    })
                  } else {
                    return res
                      .status(200)
                      .json({ message: "Call registered email not send" })
                  }
                }
              } else if (calldata.formdata.status === "solved") {
                adminCaller.callstatus.totalCall += 1

                adminCaller.callstatus.solvedCalls += 1

                adminCaller.callstatus.totalDuration +=
                  calldata.timedata.duration

                const saved = await adminCaller.save()
                if (saved) {
                  // return res.status(200).json({
                  //   success: true,
                  //   message: "Call registered"
                  // })
                  const emailResponse = await sendEmail(
                    calldata,
                    customer,
                    branchName,
                    username
                  )

                  if (emailResponse) {
                    return res.status(200).json({
                      success: true,
                      message: "Call registered"
                    })
                  } else {
                    return res
                      .status(200)
                      .json({ message: "Call registered email not send" })
                  }
                }
              }
            }
          }
        }
      }
    } else {
      //If no document is found, create a new one with the given call data

      const newCall = new CallRegistration({
        customerid: customerId,
        customerName: customer,
        callregistration: [calldata] // Wrap calldata in an array
      })

      // Save the new document
      const updatedCall = await newCall.save()
      if (updatedCall) {
        const Id = calldata.formdata.attendedBy.callerId

        const staffCaller = await Staff.findOne({
          _id: Id
        })

        if (staffCaller) {
          if (calldata.formdata.status === "pending") {
            staffCaller.callstatus.totalCall += 1

            staffCaller.callstatus.pendingCalls += 1

            staffCaller.callstatus.totalDuration += calldata.timedata.duration

            const pendingSavedStaff = await staffCaller.save()

            if (pendingSavedStaff) {
              // return res.status(200).json({
              //   success: true,
              //   message: "Call registered"
              // })
              const emailResponse = await sendEmail(
                calldata,
                customer,
                branchName,
                username
              )

              if (emailResponse) {
                return res.status(200).json({
                  success: true,
                  message: "Call registered"
                })
              } else {
                return res
                  .status(200)
                  .json({ message: "Call registered email not send" })
              }
            }
          } else if (calldata.formdata.status === "solved") {
            staffCaller.callstatus.totalCall += 1

            staffCaller.callstatus.solvedCalls += 1

            staffCaller.callstatus.totalDuration += calldata.timedata.duration

            const saved = await staffCaller.save()
            if (saved) {
              // return res.status(200).json({
              //   success: true,
              //   message: "Call registered"
              // })
              const emailResponse = await sendEmail(
                calldata,
                customer,
                branchName,
                username
              )
              if (emailResponse) {
                return res.status(200).json({
                  success: true,
                  message: "Call registered"
                })
              } else {
                return res
                  .status(200)
                  .json({ message: "Call registered email not send" })
              }
            }
          }
        } else {
          const adminCaller = await Admin.findOne({
            _id: Id
          })
          if (adminCaller) {
            if (calldata.formdata.status === "pending") {
              adminCaller.callstatus.totalCall += 1

              adminCaller.callstatus.pendingCalls += 1

              adminCaller.callstatus.totalDuration += calldata.timedata.duration

              const pendingAdminSaved = await adminCaller.save()
              if (pendingAdminSaved) {
                // return res.status(200).json({
                //   success: true,
                //   message: "Call registered"
                // })
                const emailResponse = await sendEmail(
                  calldata,
                  customer,
                  branchName,
                  username
                )
                if (emailResponse) {
                  return res.status(200).json({
                    success: true,
                    message: "Call registered"
                  })
                } else {
                  return res
                    .status(200)
                    .json({ message: "Call registered email not send" })
                }
              }
            } else if (calldata.formdata.status === "solved") {
              adminCaller.callstatus.totalCall += 1

              adminCaller.callstatus.solvedCalls += 1

              adminCaller.callstatus.totalDuration += calldata.timedata.duration

              const saved = await adminCaller.save()
              if (saved) {
                // return res.status(200).json({
                //   success: true,
                //   message: "Call registered"
                // })
                const emailResponse = await sendEmail(
                  calldata,
                  customer,
                  branchName,
                  username
                )
                if (emailResponse) {
                  return res.status(200).json({
                    success: true,
                    message: "Call registered"
                  })
                } else {
                  return res
                    .status(200)
                    .json({ message: "Call registered email not send" })
                }
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error saving or updating call registration:", error.message)
    return res.status(500).json({
      status: false,
      message: "Error saving or updating call registration"
    })
  }
}
const updateProcessedAttendees = async (processedAttendedBy, attendedId) => {
  const updateResults = []

  // Helper function to update call status
  const updateCallStatus = async (user, callerId) => {
    user.callstatus.pendingCalls -= 1
    user.callstatus.colleagueSolved = callerId.equals(attendedId)
      ? user.callstatus.colleagueSolved
      : user.callstatus.colleagueSolved + 1

    // Save the updated document
    await user.save()
  }

  for (const item of processedAttendedBy) {
    const { callerId } = item

    try {
      // Try finding staff with the given callerId
      let user = await Staff.findOne({ _id: callerId })

      // If not found in Staff, search in Admin
      if (!user) {
        user = await Admin.findOne({ _id: callerId })
      }

      // If either staff or admin is found, update their call status
      if (user) {
        const a = await updateCallStatus(user, callerId)

        // Record success status for this item
        updateResults.push({ callerId, status: "success" })
      } else {
        // Record not found status if neither staff nor admin is found
        updateResults.push({ callerId, status: "not found" })
      }
    } catch (error) {
      console.error(`Error updating call status for ${callerId}:`, error)
      // Record error status for this item
      updateResults.push({ callerId, status: "error", error: error.message })
    }
  }

  // Return the final status after all updates
  return updateResults
}

// const updateProcessedAttendees = async (processedAttendedBy, attendedId) => {
//   const updateResults = []

//   for (const item of processedAttendedBy) {
//     const { callerId } = item

//     try {
//       // Find the staff member by name
//       let staff = await Staff.findOne({ _id: callerId })

//       if (staff) {
//         // Update the pendingCalls and colleagueSolved fields
//         staff.callstatus.pendingCalls = staff.callstatus.pendingCalls - 1
//         staff.callstatus.colleagueSolved = callerId.equals(attendedId)
//           ? staff.callstatus.colleagueSolved
//           : staff.callstatus.colleagueSolved + 1
//         staff.callstatus.solvedCalls = staff.callstatus.solvedCalls
//         staff.callstatus.totalCall = staff.callstatus.totalCall
//         staff.callstatus.totalDuration = staff.callstatus.totalDuration
//         // Save the updated document
//         await staff.save()

//         // Record success status for this item
//         updateResults.push({ callerId, status: "success" })
//       }
//       let admin = await Admin.findOne({ _id: callerId })
//       if (admin) {
//         // Update the pendingCalls and colleagueSolved fields
//         admin.callstatus.pendingCalls-=1
//         admin.callstatus.colleagueSolved = callerId.equals(attendedId)
//           ? admin.callstatus.colleagueSolved
//           : admin.callstatus.colleagueSolved + 1
//         admin.callstatus.solvedCalls = admin.callstatus.solvedCalls
//         admin.callstatus.totalCall = admin.callstatus.totalCall
//         admin.callstatus.totalDuration = admin.callstatus.totalDuration
//         // Save the updated document
//         await admin.save()

//         // Record success status for this item
//         updateResults.push({ callerId, status: "success" })
//       }
//     } catch (error) {
//       console.error(`Error updating call status for ${callerId}:`, error)
//       // Record error status for this item
//       updateResults.push({ callerId, status: "error", error: error.message })
//     }
//   }

//   // Return the final status after all updates
//   return updateResults
// }

export const GetCallRegister = async (req, res) => {
  try {
    const { customerid } = req.query

    console.log("idsss", customerid)

    const { callId } = req.params
    console.log("callidssssss", callId)

    if (customerid !== "null" && customerid) {
      console.log("hiiiiiiiii")
      const customerId = new mongoose.Types.ObjectId(customerid)
      const registeredCall = await CallRegistration.findOne({
        customerid: customerId
      }).populate({ path: "callregistration.product", select: "productName" })

      const attendedByIds = new Set()
      const completedByIds = new Set()
      registeredCall.callregistration.map((entry) => {
        // Handle `attendedBy`
        const attendedBy = entry.formdata.attendedBy
        if (Array.isArray(attendedBy)) {
          // If it's an array, iterate over it
          attendedBy.forEach((attendee) => {
            if (attendee.callerId) {
              attendedByIds.add(attendee.callerId.toString())
            } else if (attendee.name) {
              attendedByIds.add(attendee.name)
            }
          })
        } else if (typeof attendedBy === "string") {
          // If it's a string, add it directly
          attendedByIds.add(attendedBy)
        }

        // Handle `completedBy`
        const completedBy = entry.formdata.completedBy
        if (Array.isArray(completedBy) && completedBy.length > 0) {
          const completedByEntry = completedBy[0]
          if (completedByEntry.callerId) {
            completedByIds.add(completedByEntry.callerId.toString())
          } else if (completedByEntry.name) {
            completedByIds.add(completedByEntry.name)
            // Optionally, handle cases where only the name exists
            console.warn(
              `CompletedBy has name but no callerId: ${completedByEntry.name}`
            )
          }
        } else if (typeof completedBy === "string") {
          // If it's a string, add it directly
          completedByIds.add(completedBy)
        }
      })

      // Separate IDs and names from the Sets
      const attendedByIdsArray = Array.from(attendedByIds)
      const attendedByObjectIds = attendedByIdsArray.filter((id) =>
        mongoose.Types.ObjectId.isValid(id)
      )

      const attendedByNames = attendedByIdsArray
        .filter((id) => !mongoose.Types.ObjectId.isValid(id)) // Filter invalid ObjectIds (names)
        .map((name) => ({ name })) // Transform them into objects with a "name" property

      const completedByIdsArray = Array.from(completedByIds)
      const completedByObjectIds = completedByIdsArray.filter((id) =>
        mongoose.Types.ObjectId.isValid(id)
      )

      const completedByNames = completedByIdsArray
        .filter((id) => !mongoose.Types.ObjectId.isValid(id)) // Filter invalid ObjectIds (names)
        .map((name) => ({ name })) // Transform them into objects with a "name" property
      // Query for ObjectIds (staff/admin users)
      const [
        attendedByStaff,
        attendedByAdmin,
        completedByStaff,
        completedByAdmin
      ] = await Promise.all([
        // Search attendedBy IDs in Staff
        mongoose
          .model("Staff")
          .find({ _id: { $in: attendedByObjectIds } })
          .select("name _id ")
          .lean(),

        // Search attendedBy IDs in Admin
        mongoose
          .model("Admin")
          .find({ _id: { $in: attendedByObjectIds } })
          .select("name _id ")
          .lean(),

        // Search completedBy IDs in Staff
        mongoose
          .model("Staff")
          .find({ _id: { $in: completedByObjectIds } })
          .select("name _id ")
          .lean(),

        // Search completedBy IDs in Admin
        mongoose
          .model("Admin")
          .find({ _id: { $in: completedByObjectIds } })
          .select("name _id ")
          .lean()
      ])

      // Combine results for attendedBy and completedBy
      const attendedByUsers = [...attendedByStaff, ...attendedByAdmin]
      const completedByUsers = [...completedByStaff, ...completedByAdmin]

      // Optionally handle name-based entries as well
      const attendedByCombined = [...attendedByUsers, ...attendedByNames]

      const completedByCombined = [...completedByUsers, ...completedByNames]
      const userMap = new Map(
        [...attendedByCombined, ...completedByCombined].map((user) => [
          user._id ? user._id.toString() : user.name,
          user.name
        ])
      )

      registeredCall.callregistration.forEach((entry) => {
        // Handle attendedBy field
        if (Array.isArray(entry?.formdata?.attendedBy)) {
          entry.formdata.attendedBy = entry.formdata.attendedBy
            .flat() // Flatten the array
            .map((attendee) => {
              const name = userMap.get(attendee?.callerId?.toString())
              // If name is found, attach it to the callerId
              return name ? { ...attendee, callerId: { name } } : attendee // Keep original if no name found
            })
        } else if (typeof entry?.formdata?.attendedBy === "string") {
          // If attendedBy is a string (not an array), map it to the name if it exists in userMap
          const name = userMap.get(entry?.formdata?.attendedBy)
          entry.formdata.attendedBy = name
            ? { callerId: { name } } // Map the string to an object with a name
            : { callerId: entry?.formdata?.attendedBy } // Keep the original if no name found
        }

        // Handle completedBy field
        if (
          Array.isArray(entry?.formdata?.completedBy) &&
          entry?.formdata?.completedBy.length > 0
        ) {
          // If completedBy is an array, map over each entry (assuming one entry)
          const completedUser = userMap.get(
            entry?.formdata?.completedBy[0]?.callerId?.toString()
          )
          entry.formdata.completedBy = completedUser
            ? [{ ...entry?.formdata?.completedBy[0], name: completedUser }] // Add the name to the first item
            : entry.formdata.completedBy // Keep as is if no name found
        } else if (typeof entry?.formdata?.completedBy === "string") {
          // If completedBy is a string, map it to the name if it exists in userMap
          const name = userMap.get(entry?.formdata?.completedBy)
          entry.formdata.completedBy = name
            ? { callerId: { name } } // Map the string to an object with a name
            : { callerId: entry?.formdata?.completedBy } // Keep the original if no name found
        }
      })

      if (registeredCall) {
        return res
          .status(200)
          .json({ message: "registered call found", data: registeredCall })
      } else {
        return res.status(404).json({ message: "No registered Calls" })
      }
    } else if (callId) {
      console.log("slw")
      const callDetails = await CallRegistration.findById(callId)
        .populate("customerid")
        .populate({
          path: "callregistration.product", // Populate the product field inside callregistration array
          model: "Product"
        })
      console.log("calldetaisl", callDetails)

      const attendedByIds = new Set()
      const completedByIds = new Set()
      callDetails.callregistration.map((entry) => {
        // Handle `attendedBy`
        const attendedBy = entry.formdata.attendedBy
        if (Array.isArray(attendedBy)) {
          // If it's an array, iterate over it
          attendedBy.forEach((attendee) => {
            if (attendee.callerId) {
              attendedByIds.add(attendee.callerId.toString())
            } else if (attendee.name) {
              attendedByIds.add(attendee.name)
            }
          })
        } else if (typeof attendedBy === "string") {
          // If it's a string, add it directly
          attendedByIds.add(attendedBy)
        }

        // Handle `completedBy`
        const completedBy = entry.formdata.completedBy
        if (Array.isArray(completedBy) && completedBy.length > 0) {
          const completedByEntry = completedBy[0]
          if (completedByEntry.callerId) {
            completedByIds.add(completedByEntry.callerId.toString())
          } else if (completedByEntry.name) {
            completedByIds.add(completedByEntry.name)
            // Optionally, handle cases where only the name exists
            console.warn(
              `CompletedBy has name but no callerId: ${completedByEntry.name}`
            )
          }
        } else if (typeof completedBy === "string") {
          // If it's a string, add it directly
          completedByIds.add(completedBy)
        }
      })

      // Separate IDs and names from the Sets
      const attendedByIdsArray = Array.from(attendedByIds)
      const attendedByObjectIds = attendedByIdsArray.filter((id) =>
        mongoose.Types.ObjectId.isValid(id)
      )

      const attendedByNames = attendedByIdsArray
        .filter((id) => !mongoose.Types.ObjectId.isValid(id)) // Filter invalid ObjectIds (names)
        .map((name) => ({ name })) // Transform them into objects with a "name" property

      const completedByIdsArray = Array.from(completedByIds)
      const completedByObjectIds = completedByIdsArray.filter((id) =>
        mongoose.Types.ObjectId.isValid(id)
      )

      const completedByNames = completedByIdsArray
        .filter((id) => !mongoose.Types.ObjectId.isValid(id)) // Filter invalid ObjectIds (names)
        .map((name) => ({ name })) // Transform them into objects with a "name" property

      // Query for ObjectIds (staff/admin users)
      const [
        attendedByStaff,
        attendedByAdmin,
        completedByStaff,
        completedByAdmin
      ] = await Promise.all([
        // Search attendedBy IDs in Staff
        mongoose
          .model("Staff")
          .find({ _id: { $in: attendedByObjectIds } })
          .select("name _id ")
          .lean(),

        // Search attendedBy IDs in Admin
        mongoose
          .model("Admin")
          .find({ _id: { $in: attendedByObjectIds } })
          .select("name _id ")
          .lean(),

        // Search completedBy IDs in Staff
        mongoose
          .model("Staff")
          .find({ _id: { $in: completedByObjectIds } })
          .select("name _id ")
          .lean(),

        // Search completedBy IDs in Admin
        mongoose
          .model("Admin")
          .find({ _id: { $in: completedByObjectIds } })
          .select("name _id ")
          .lean()
      ])

      // Combine results for attendedBy and completedBy
      const attendedByUsers = [...attendedByStaff, ...attendedByAdmin]
      const completedByUsers = [...completedByStaff, ...completedByAdmin]

      // Optionally handle name-based entries as well
      const attendedByCombined = [...attendedByUsers, ...attendedByNames]

      const completedByCombined = [...completedByUsers, ...completedByNames]
      const userMap = new Map(
        [...attendedByCombined, ...completedByCombined].map((user) => [
          user._id ? user._id.toString() : user.name,
          user.name
        ])
      )

      callDetails.callregistration.forEach((entry) => {
        // Handle attendedBy field
        if (Array.isArray(entry?.formdata?.attendedBy)) {
          entry.formdata.attendedBy = entry.formdata.attendedBy
            .flat() // Flatten the array
            .map((attendee) => {
              const name = userMap.get(attendee?.callerId?.toString())
              // If name is found, attach it to the callerId
              return name ? { ...attendee, callerId: { name } } : attendee // Keep original if no name found
            })
        } else if (typeof entry?.formdata?.attendedBy === "string") {
          // If attendedBy is a string (not an array), map it to the name if it exists in userMap
          const name = userMap.get(entry?.formdata?.attendedBy)
          entry.formdata.attendedBy = name
            ? { callerId: { name } } // Map the string to an object with a name
            : { callerId: entry?.formdata?.attendedBy } // Keep the original if no name found
        }

        // Handle completedBy field
        if (
          Array.isArray(entry?.formdata?.completedBy) &&
          entry?.formdata?.completedBy.length > 0
        ) {
          // If completedBy is an array, map over each entry (assuming one entry)
          const completedUser = userMap.get(
            entry?.formdata?.completedBy[0]?.callerId?.toString()
          )
          entry.formdata.completedBy = completedUser
            ? [{ ...entry?.formdata?.completedBy[0], name: completedUser }] // Add the name to the first item
            : entry.formdata.completedBy // Keep as is if no name found
        } else if (typeof entry?.formdata?.completedBy === "string") {
          // If completedBy is a string, map it to the name if it exists in userMap
          const name = userMap.get(entry?.formdata?.completedBy)
          entry.formdata.completedBy = name
            ? { callerId: { name } } // Map the string to an object with a name
            : { callerId: entry?.formdata?.completedBy } // Keep the original if no name found
        }
      })

      if (!callDetails) {
        return res.status(404).json({ message: "Calls not found" })
      } else {
        console.log("data", callDetails)
        return res
          .status(200)
          .json({ message: "calls with respect customer found", callDetails })
      }

      // Send the call details as a response
    }
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: "internal server error" })
  }
}

// export const updateBranchNames = async (req, res) => {
//   const users = req.body // Expecting customerName and newBranchNames array in request body
//   console.log("hiiiiiiiii")
//   console.log("usersfss", users)
//   const branches = users.selected.map((item) => item.branchName)
//   console.log("branchessssss", branches)
//   try {
//     // const newBranchNames = ["CAMET", "ACCUANET"]
//     // Find the document by customerName
//     const document = await CallRegistration.find({
//       "callregistration.userName": "Fathima Nazrin CM"
//     })
//     console.log("docccccccccc", document)
//     console.log("doclength", document.length)

//     if (!document) {
//       return res.status(404).json({ message: "No document found" })
//     }

//     // // Update branchName by assigning the newBranchNames array
//     // document.callregistration = document.callregistration.map(
//     //   (registration) => {
//     //     return {
//     //       ...registration,
//     //       branchName: branches // Assign the entire newBranchNames array
//     //     }
//     //   }
//     // )
//     /////
//     const updatedDocuments = document.map((document) => {
//       // Update the callregistration array for each document
//       document.callregistration = document.callregistration.map(
//         (registration) => {
//           if (registration.userName === "Fathima Nazrin CM") {
//             return {
//               ...registration,
//               branchName: branches // Assign the new branch names
//             }
//           }
//         }
//       )
//       return document // Return the updated document
//     })
//     console.log("updateddoc", updatedDocuments)
//     const a = updatedDocuments.map((item) => item.callregistration)
//     console.log("abhidas", a)
//     console.log("updoc", updatedDocuments)

//     await Promise.all(updatedDocuments.map((doc) => doc.save()))

//     // Save the updated document
//     // await document.save()
//     console.log("documme", document)
//     return res
//       .status(200)
//       .json({ message: "Branch names updated successfully", document })
//   } catch (error) {
//     console.error(error)
//     return res
//       .status(500)
//       .json({ message: "Server error", error: error.message })
//   }
// }
export const GetAllExpiryRegister = async (req, res) => {
  const { nextmonthReport } = req.query

  try {
    let startOfNextMonth
    let endOfNextMonth
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (nextmonthReport) {
      // Calculate the start and end of the next month
      startOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)
      endOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0)
      endOfNextMonth.setHours(23, 59, 59, 999) // End of the day
    }

    const expiredCustomers = await Customer.find({
      selected: {
        $elemMatch: {
          $or: [
            {
              licenseExpiryDate: nextmonthReport
                ? { $gte: startOfNextMonth, $lte: endOfNextMonth }
                : { $lt: today }
            }, // License expiry in the past
            {
              tvuexpiryDate: nextmonthReport
                ? { $gte: startOfNextMonth, $lte: endOfNextMonth }
                : { $lt: today }
            }, // TVU expiry in the past
            {
              amcendDate: nextmonthReport
                ? { $gte: startOfNextMonth, $lte: endOfNextMonth }
                : { $lt: today }
            } // AMC end in the past
          ]
        }
      }
    })

    if (expiredCustomers.length > 0) {
      return res.status(200).json({
        message: "Customers found with expiry",
        data: expiredCustomers
      })
    } else {
      return res
        .status(404)
        .json({ message: "No customers with expired Dates", data: [] })
    }
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const getallExpiredCustomerCalls = async (req, res) => {
  try {
    const { expiredCustomerId } = req.body

    const validCustomerIds = expiredCustomerId
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id))

    const calls = await CallRegistration.find({
      customerid: { $in: validCustomerIds } // Assuming 'customerId' field in CallRegistration matches customer IDs
    })
      .populate([
        {
          path: "callregistration.product",
          select: "productName"
        },
        {
          path: "customerid",
          select: "customerName"
        }
      ])
      .lean()

    const attendedByIds = new Set()
    const completedByIds = new Set()

    calls.forEach((call) =>
      call.callregistration.forEach((entry) => {
        // Handle `attendedBy`
        const attendedBy = entry.formdata.attendedBy
        if (Array.isArray(attendedBy)) {
          // If it's an array, iterate over it
          attendedBy.forEach((attendee) => {
            if (attendee.callerId) {
              attendedByIds.add(attendee.callerId.toString())
            } else if (attendee.name) {
              attendedByIds.add(attendee.name)
            }
          })
        } else if (typeof attendedBy === "string") {
          // If it's a string, add it directly
          attendedByIds.add(attendedBy)
        }

        // Handle `completedBy`
        const completedBy = entry.formdata.completedBy
        if (Array.isArray(completedBy) && completedBy.length > 0) {
          const completedByEntry = completedBy[0]
          if (completedByEntry.callerId) {
            completedByIds.add(completedByEntry.callerId.toString())
          } else if (completedByEntry.name) {
            completedByIds.add(completedByEntry.name)
            // Optionally, handle cases where only the name exists
            console.warn(
              `CompletedBy has name but no callerId: ${completedByEntry.name}`
            )
          }
        } else if (typeof completedBy === "string") {
          // If it's a string, add it directly
          completedByIds.add(completedBy)
        }
      })
    )

    // Separate IDs and names from the Sets
    const attendedByIdsArray = Array.from(attendedByIds)
    const attendedByObjectIds = attendedByIdsArray.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    )

    const attendedByNames = attendedByIdsArray
      .filter((id) => !mongoose.Types.ObjectId.isValid(id)) // Filter invalid ObjectIds (names)
      .map((name) => ({ name })) // Transform them into objects with a "name" property

    const completedByIdsArray = Array.from(completedByIds)
    const completedByObjectIds = completedByIdsArray.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    )

    const completedByNames = completedByIdsArray
      .filter((id) => !mongoose.Types.ObjectId.isValid(id)) // Filter invalid ObjectIds (names)
      .map((name) => ({ name })) // Transform them into objects with a "name" property

    // Query for ObjectIds (staff/admin users)
    const [
      attendedByStaff,
      attendedByAdmin,
      completedByStaff,
      completedByAdmin
    ] = await Promise.all([
      // Search attendedBy IDs in Staff
      mongoose
        .model("Staff")
        .find({ _id: { $in: attendedByObjectIds } })
        .select("name _id ")
        .lean(),

      // Search attendedBy IDs in Admin
      mongoose
        .model("Admin")
        .find({ _id: { $in: attendedByObjectIds } })
        .select("name _id ")
        .lean(),

      // Search completedBy IDs in Staff
      mongoose
        .model("Staff")
        .find({ _id: { $in: completedByObjectIds } })
        .select("name _id ")
        .lean(),

      // Search completedBy IDs in Admin
      mongoose
        .model("Admin")
        .find({ _id: { $in: completedByObjectIds } })
        .select("name _id ")
        .lean()
    ])

    // Combine results for attendedBy and completedBy
    const attendedByUsers = [...attendedByStaff, ...attendedByAdmin]
    const completedByUsers = [...completedByStaff, ...completedByAdmin]

    // Optionally handle name-based entries as well
    const attendedByCombined = [...attendedByUsers, ...attendedByNames]

    const completedByCombined = [...completedByUsers, ...completedByNames]
    const userMap = new Map(
      [...attendedByCombined, ...completedByCombined].map((user) => [
        user._id ? user._id.toString() : user.name,
        user.name
      ])
    )

    calls.forEach((call) =>
      call.callregistration.forEach((entry) => {
        // Handle attendedBy field
        if (Array.isArray(entry?.formdata?.attendedBy)) {
          entry.formdata.attendedBy = entry.formdata.attendedBy
            .flat() // Flatten the array
            .map((attendee) => {
              const name = userMap.get(attendee?.callerId?.toString())
              // If name is found, attach it to the callerId
              return name ? { ...attendee, callerId: { name } } : attendee // Keep original if no name found
            })
        } else if (typeof entry?.formdata?.attendedBy === "string") {
          // If attendedBy is a string (not an array), map it to the name if it exists in userMap
          const name = userMap.get(entry?.formdata?.attendedBy)
          entry.formdata.attendedBy = name
            ? { callerId: { name } } // Map the string to an object with a name
            : { callerId: entry?.formdata?.attendedBy } // Keep the original if no name found
        }

        // Handle completedBy field
        if (
          Array.isArray(entry?.formdata?.completedBy) &&
          entry?.formdata?.completedBy.length > 0
        ) {
          // If completedBy is an array, map over each entry (assuming one entry)
          const completedUser = userMap.get(
            entry?.formdata?.completedBy[0]?.callerId?.toString()
          )
          entry.formdata.completedBy = completedUser
            ? [{ ...entry?.formdata?.completedBy[0], name: completedUser }] // Add the name to the first item
            : entry.formdata.completedBy // Keep as is if no name found
        } else if (typeof entry?.formdata?.completedBy === "string") {
          // If completedBy is a string, map it to the name if it exists in userMap
          const name = userMap.get(entry?.formdata?.completedBy)
          entry.formdata.completedBy = name
            ? { callerId: { name } } // Map the string to an object with a name
            : { callerId: entry?.formdata?.completedBy } // Keep the original if no name found
        }
      })
    )
    if (calls.length > 0) {
      return res
        .status(200)
        .json({ message: "Expired customer calls found", calls })
    } else {
      return res.status(404).json({ message: "No expired calls", calls: [] })
    }
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
