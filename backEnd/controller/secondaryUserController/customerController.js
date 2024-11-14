import Customer from "../../model/secondaryUser/customerSchema.js"
import License from "../../model/secondaryUser/licenseSchema.js"
import CallRegistration from "../../model/secondaryUser/CallRegistrationSchema.js"
import models from "../../model/auth/authSchema.js"
const { Staff, Admin } = models
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
    contactPerson,
    email,
    mobile,
    landline
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
      // Now handle the update of `selected` data
      if (tableData.length > 0) {
        // Iterate over the new selected data (tabledata)
        for (const item of tableData) {
          // Find the index of the entry in `customer.selected` array that matches the product_id
          const selectedIndex = existingCustomer.selected.findIndex(
            (selectedItem) =>
              selectedItem.product_id.toString() === item.product_id.toString()
          )

          if (selectedIndex !== -1) {
            // If we found the product in the existingCustomer's `selected` array, update it
            existingCustomer.selected[selectedIndex] = {
              ...existingCustomer.selected[selectedIndex], // Retain other data
              ...item // Update with new data from tabledata
            }
          } else {
            // If the product_id doesn't exist in the existingCustomer's selected array, push a new entry
            existingCustomer.selected.push(item)
          }
        }
      }

      if (!existingCustomer) {
        return res.status(404).json({ message: "Customer not found" })
      }

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
    if (search) {
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

        if (customers.length === 0) {
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
        const customers = await Customer.find({ customerName: searchRegex })

        if (customers.length === 0) {
          return res
            .status(404)
            .json({ message: "No customer found", data: [] })
        } else {
          return res
            .status(200)
            .json({ message: "Customer(s) found", data: customers })
        }
      }
    } else {
      const customers = await Customer.find().sort({ customerName: 1 })
      if (customers.length === 0) {
        return res.status(404).json({ message: "No customer found", data: [] })
      } else {
        return res
          .status(200)
          .json({ message: "Customer(s) found", data: customers })
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
          callToUpdate.timedata.duration =
            callToUpdate.timedata.duration + calldata.timedata.duration
          callToUpdate.timedata.token = calldata.timedata.token
          callToUpdate.formdata.incomingNumber =
            calldata.formdata.incomingNumber
          callToUpdate.formdata.token = calldata.formdata.token
          callToUpdate.formdata.description = calldata.formdata.description
          callToUpdate.formdata.solution = calldata.formdata.solution
          callToUpdate.formdata.status = calldata.formdata.status
          callToUpdate.formdata.attendedBy.push(calldata.formdata.attendedBy)
          callToUpdate.formdata.completedBy = calldata.formdata.completedBy
          callToUpdate.license = calldata.license
          callToUpdate.branchName = calldata.branchName

          // Save the updated document

          const updatedCall = await user.save()

          if (updatedCall) {
            const Name = calldata.userName

            const staffCaller = await Staff.findOne({
              name: Name
            })
            if (staffCaller) {
              if (calldata.formdata.status === "pending") {
                staffCaller.callstatus.totalCall =
                  staffCaller.callstatus.totalCall + 1

                staffCaller.callstatus.pendingCalls =
                  staffCaller.callstatus.pendingCalls + 1
                staffCaller.callstatus.solvedCalls =
                  staffCaller.callstatus.solvedCalls
                staffCaller.callstatus.colleagueSolved =
                  staffCaller.callstatus.colleagueSolved
                staffCaller.callstatus.totalDuration =
                  staffCaller.callstatus.totalDuration +
                  calldata.timedata.duration
                const pendingSavedStaff = await staffCaller.save()
                if (pendingSavedStaff) {
                  return res.status(200).json({ message: "all successed" })
                }
              } else if (calldata.formdata.status === "solved") {
                staffCaller.callstatus.totalCall =
                  staffCaller.callstatus.totalCall + 1

                staffCaller.callstatus.solvedCalls =
                  staffCaller.callstatus.solvedCalls + 1

                staffCaller.callstatus.pendingCalls =
                  staffCaller.callstatus.pendingCalls

                staffCaller.callstatus.totalDuration =
                  staffCaller.callstatus.totalDuration +
                  calldata.timedata.duration

                const saved = await staffCaller.save()
                if (saved) {
                  const matchingDoc = updatedCall.callregistration.find(
                    (call) => call.timedata.token === token
                  )

                  const stringDoc = JSON.stringify(matchingDoc, null, 2)
                  const parsedDoc = JSON.parse(stringDoc)

                  const processedAttendedBy = parsedDoc.formdata.attendedBy
                    .slice(0, -1)
                    .map((item) => item)

                  try {
                    const results = await updateProcessedAttendees(
                      processedAttendedBy
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
                      return res.status(200).json({
                        message: "All updates completed successfully",
                        results
                      })
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
                name: Name
              })
              if (adminCaller) {
                if (calldata.formdata.status === "pending") {
                  adminCaller.callstatus.totalCall =
                    adminCaller.callstatus.totalCall + 1

                  adminCaller.callstatus.pendingCalls =
                    adminCaller.callstatus.pendingCalls + 1
                  adminCaller.callstatus.solvedCalls =
                    adminCaller.callstatus.solvedCalls
                  adminCaller.callstatus.colleagueSolved =
                    adminCaller.callstatus.colleagueSolved
                  adminCaller.callstatus.totalDuration =
                    adminCaller.callstatus.totalDuration +
                    calldata.timedata.duration
                  const pendingAdminSaved = await adminCaller.save()
                  if (pendingAdminSaved) {
                    return res.status(200).json({ message: "All success" })
                  }
                } else if (calldata.formdata.status === "solved") {
                  adminCaller.callstatus.totalCall =
                    adminCaller.callstatus.totalCall + 1

                  adminCaller.callstatus.solvedCalls =
                    adminCaller.callstatus.solvedCalls + 1
                  adminCaller.callstatus.colleagueSolved =
                    adminCaller.callstatus.colleagueSolved

                  adminCaller.callstatus.pendingCalls =
                    adminCaller.callstatus.pendingCalls

                  adminCaller.callstatus.totalDuration =
                    adminCaller.callstatus.totalDuration +
                    calldata.timedata.duration

                  const saved = await adminCaller.save()
                  if (saved) {
                    const matchingDoc = updatedCall.callregistration.find(
                      (call) => call.timedata.token === token
                    )

                    const stringDoc = JSON.stringify(matchingDoc, null, 2)
                    const parsedDoc = JSON.parse(stringDoc)

                    const processedAttendedBy = parsedDoc.formdata.attendedBy
                      .slice(0, -1)
                      .map((item) => item)

                    try {
                      const results = await updateProcessedAttendees(
                        processedAttendedBy
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
                        return res.status(200).json({
                          message: "All updates completed successfully",
                          results
                        })
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

        const Name = calldata.userName

        if (updatedCall) {
          const staffCaller = await Staff.findOne({
            name: Name
          })

          if (staffCaller) {
            if (calldata.formdata.status === "pending") {
              staffCaller.callstatus.totalCall =
                staffCaller.callstatus.totalCall + 1

              staffCaller.callstatus.pendingCalls =
                staffCaller.callstatus.pendingCalls + 1
              staffCaller.callstatus.solvedCalls =
                staffCaller.callstatus.solvedCalls
              staffCaller.callstatus.colleagueSolved =
                staffCaller.callstatus.colleagueSolved
              staffCaller.callstatus.totalDuration =
                staffCaller.callstatus.totalDuration +
                calldata.timedata.duration
              const pendingSavedStaff = await staffCaller.save()
              if (pendingSavedStaff) {
                return res.status(200).json({ message: "all successed" })
              }
            } else if (calldata.formdata.status === "solved") {
              staffCaller.callstatus.totalCall =
                staffCaller.callstatus.totalCall + 1

              staffCaller.callstatus.solvedCalls =
                staffCaller.callstatus.solvedCalls + 1

              staffCaller.callstatus.pendingCalls =
                staffCaller.callstatus.pendingCalls

              staffCaller.callstatus.totalDuration =
                staffCaller.callstatus.totalDuration +
                calldata.timedata.duration

              const saved = await staffCaller.save()
              if (saved) {
                return res.status(200).json({ message: "All success" })
              }
            }
          } else {
            const adminCaller = await Admin.findOne({
              name: Name
            })
            if (adminCaller) {
              if (calldata.formdata.status === "pending") {
                adminCaller.callstatus.totalCall =
                  adminCaller.callstatus.totalCall + 1

                adminCaller.callstatus.pendingCalls =
                  adminCaller.callstatus.pendingCalls + 1
                adminCaller.callstatus.solvedCalls =
                  adminCaller.callstatus.solvedCalls
                adminCaller.callstatus.colleagueSolved =
                  adminCaller.callstatus.colleagueSolved
                adminCaller.callstatus.totalDuration =
                  adminCaller.callstatus.totalDuration +
                  calldata.timedata.duration
                const pendingAdminSaved = await adminCaller.save()
                if (pendingAdminSaved) {
                  return res.status(200).json({ message: "All success" })
                }
              } else if (calldata.formdata.status === "solved") {
                adminCaller.callstatus.totalCall =
                  adminCaller.callstatus.totalCall + 1

                adminCaller.callstatus.solvedCalls =
                  adminCaller.callstatus.solvedCalls + 1
                adminCaller.callstatus.colleagueSolved =
                  adminCaller.callstatus.colleagueSolved

                adminCaller.callstatus.pendingCalls =
                  adminCaller.callstatus.pendingCalls

                adminCaller.callstatus.totalDuration =
                  adminCaller.callstatus.totalDuration +
                  calldata.timedata.duration

                const saved = await adminCaller.save()
                if (saved) {
                  return res.status(200).json({ message: "All success" })
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
        const Name = calldata.userName

        const staffCaller = await Staff.findOne({
          name: Name
        })

        ////
        if (staffCaller) {
          if (calldata.formdata.status === "pending") {
            staffCaller.callstatus.totalCall =
              staffCaller.callstatus.totalCall + 1

            staffCaller.callstatus.pendingCalls =
              staffCaller.callstatus.pendingCalls + 1
            staffCaller.callstatus.solvedCalls =
              staffCaller.callstatus.solvedCalls
            staffCaller.callstatus.colleagueSolved =
              staffCaller.callstatus.colleagueSolved
            staffCaller.callstatus.totalDuration =
              staffCaller.callstatus.totalDuration + calldata.timedata.duration
            const pendingSavedStaff = await staffCaller.save()

            if (pendingSavedStaff) {
              return res.status(200).json({ message: "all successed" })
            }
          } else if (calldata.formdata.status === "solved") {
            staffCaller.callstatus.totalCall =
              staffCaller.callstatus.totalCall + 1

            staffCaller.callstatus.solvedCalls =
              staffCaller.callstatus.solvedCalls + 1

            staffCaller.callstatus.pendingCalls =
              staffCaller.callstatus.pendingCalls

            staffCaller.callstatus.totalDuration =
              staffCaller.callstatus.totalDuration + calldata.timedata.duration

            const saved = await staffCaller.save()
            if (saved) {
              return res.status(200).json({ message: "All success" })
            }
          }
        } else {
          const adminCaller = await Admin.findOne({
            name: Name
          })
          if (adminCaller) {
            if (calldata.formdata.status === "pending") {
              adminCaller.callstatus.totalCall =
                adminCaller.callstatus.totalCall + 1

              adminCaller.callstatus.pendingCalls =
                adminCaller.callstatus.pendingCalls + 1
              adminCaller.callstatus.solvedCalls =
                adminCaller.callstatus.solvedCalls
              adminCaller.callstatus.colleagueSolved =
                adminCaller.callstatus.colleagueSolved
              adminCaller.callstatus.totalDuration =
                adminCaller.callstatus.totalDuration +
                calldata.timedata.duration
              const pendingAdminSaved = await adminCaller.save()
              if (pendingAdminSaved) {
                return res.status(200).json({ message: "All success" })
              }
            } else if (calldata.formdata.status === "solved") {
              adminCaller.callstatus.totalCall =
                adminCaller.callstatus.totalCall + 1

              adminCaller.callstatus.solvedCalls =
                adminCaller.callstatus.solvedCalls + 1
              adminCaller.callstatus.colleagueSolved =
                adminCaller.callstatus.colleagueSolved

              adminCaller.callstatus.pendingCalls =
                adminCaller.callstatus.pendingCalls

              adminCaller.callstatus.totalDuration =
                adminCaller.callstatus.totalDuration +
                calldata.timedata.duration

              const saved = await adminCaller.save()
              if (saved) {
                return res.status(200).json({ message: "All success" })
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

const updateProcessedAttendees = async (processedAttendedBy) => {
  const updateResults = []

  for (const item of processedAttendedBy) {
    const { name } = item

    try {
      // Find the staff member by name
      let staff = await Staff.findOne({ name })

      if (staff) {
        // Update the pendingCalls and colleagueSolved fields
        staff.callstatus.pendingCalls = staff.callstatus.pendingCalls - 1
        staff.callstatus.colleagueSolved = staff.callstatus.colleagueSolved + 1
        staff.callstatus.solvedCalls = staff.callstatus.solvedCalls
        staff.callstatus.totalCall = staff.callstatus.totalCall
        staff.callstatus.totalDuration = staff.callstatus.totalDuration
        // Save the updated document
        await staff.save()

        // Record success status for this item
        updateResults.push({ name, status: "success" })
      } else {
        console.error(`Staff member not found with name: ${name}`)
        // Record failure status for this item
        updateResults.push({ name, status: "not found" })
      }
    } catch (error) {
      console.error(`Error updating call status for ${name}:`, error)
      // Record error status for this item
      updateResults.push({ name, status: "error", error: error.message })
    }
  }

  // Return the final status after all updates
  return updateResults
}

export const GetCallRegister = async (req, res) => {
  try {
    const { customerid } = req.query

    const { callId } = req.params

    if (customerid !== "null" && customerid) {
      const customerId = new mongoose.Types.ObjectId(customerid)
      const registeredCall = await CallRegistration.findOne({
        customerid: customerId
      })

      if (registeredCall) {
        return res
          .status(200)
          .json({ message: "registered call found", data: registeredCall })
      } else {
        return res.status(404).json({ message: "No registered Calls" })
      }
    } else if (callId) {
      const callDetails = await CallRegistration.findById(callId)
        .populate("customerid")
        .populate({
          path: "callregistration.product", // Populate the product field inside callregistration array
          model: "Product"
        })

      if (!callDetails) {
        return res.status(404).json({ message: "Calls not found" })
      } else {
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
