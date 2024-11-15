import models from "../model/auth/authSchema.js"
import mongoose from "mongoose"
import Branch from "../model/primaryUser/branchSchema.js"
const { Staff, Admin } = models
import bcrypt from "bcrypt"

import generateToken from "../utils/generateToken.js"
import LeaveRequest from "../model/primaryUser/leaveRequestSchema.js"
import CallRegistration from "../model/secondaryUser/CallRegistrationSchema.js"
export const resetCallStatus = async (req, res) => {
  const { adminid } = req.query

  const objectId = new mongoose.Types.ObjectId(adminid)
  try {
    const a = await Staff.updateOne(
      { _id: objectId }, // Find the user by their ID
      {
        $set: {
          "callstatus.colleagueSolved": 0,
          "callstatus.pendingCalls": 0,
          "callstatus.solvedCalls": 0,
          "callstatus.totalCall": 0,
          "callstatus.totalDuration": 0
        }
      }
    )
    if (a) {
      res.status(200).json({ message: "Admin status updated" })
    }
  } catch (error) {
    console.error("Error resetting call status fields:", error)
  }
}
/////
export const Register = async (req, res) => {
  let isaved = false
  const { userData, image, tabledata } = req.body
  const { name, email, mobile, password, ...otherfields } = userData
  const { profileUrl, documentUrl } = image
  const {
    verified,
    dateofbirth,
    bloodgroup,
    address,
    country,
    state,
    pincode,
    joiningdate,
    designation,
    gender,
    department,
    assignedto
  } = otherfields

  const admin = await Admin.findOne({ email })
  if (!admin) {
    try {
      // Create and save new user
      const admin = new Admin({
        name,
        email,
        mobileno,
        password, // This will be hashed by the pre-save middleware
        role
      })
      const savedAdmin = await admin.save()
      if (savedAdmin) {
        isaved = true
        return res.status(200).json({
          status: true,
          message: "admin created successfully"
        })
      }
    } catch (error) {
      return res.status(500).json({ message: "Server error" })
    }
  } else {
    return res
      .status(409)
      .json({ message: "Admin with this email already exists" })
  }

  if (!isaved) {
    const staff = await Staff.findOne({ email })

    if (!staff) {
      try {
        console.log("hiii")
        // Create and save new user
        const staff = new Staff({
          name,
          email,
          mobile,
          password,
          isVerified: verified === "true",

          dateofbirth,
          bloodgroup,
          gender,
          address,
          country,
          state,
          pincode,
          joiningdate,
          designation,
          department,
          assignedto,
          profileUrl,
          documentUrl,
          selected: tabledata
        })

        const savedstaff = await staff.save()

        return res.status(200).json({
          status: true,
          message: "staff created successfully"
        })
      } catch (error) {
        console.log("show the error", error.message)
        return res.status(500).json({ message: "Server error" })
      }
    } else {
      return res
        .status(409)
        .json({ message: "staff with this email already exists" })
    }
  }
}

export const StaffRegister = async (req, res) => {
  try {
    const { userData, image, tabledata } = req.body
    const assignedtoId = req.body.userData.assignedto // Assuming assignedto is coming from userDat
    let assignedtoModel
    // Check if assignedto corresponds to a Staff
    const isStaff = await Staff.exists({ _id: assignedtoId })

    // Check if assignedto corresponds to an Admin
    const isAdmin = await Admin.exists({ _id: assignedtoId })

    // Set assignedtoModel based on the checks
    if (isStaff) {
      assignedtoModel = "Staff"
    } else if (isAdmin) {
      assignedtoModel = "Admin"
    } else {
      // Handle the case where assignedto is neither Staff nor Admin
      console.log("Assigned to does not exist in either model")
      return res
        .status(400)
        .json({ message: "Assigned to user does not exist." })
    }

    const {
      name,
      email,
      mobile,
      password,
      verified,
      dateofbirth,
      bloodgroup,
      address,
      country,
      state,
      pincode,
      joiningdate,
      designation,
      gender,
      role,
      department,
      assignedto
    } = userData
    const { profileUrl, documentUrl } = image

    const isStaffExist = await Staff.findOne({ email })

    if (!isStaffExist) {
      try {
        // Create and save new user
        const staff = new Staff({
          name,
          email,
          mobile,
          password,
          isVerified: verified === "true",
          role,
          dateofbirth,
          bloodgroup,
          gender,
          address,
          country,
          state,
          pincode,
          joiningdate,
          designation,
          department,
          assignedto,
          assignedtoModel,
          profileUrl,
          documentUrl,
          selected: tabledata
        })

        const savedstaff = await staff.save()

        if (savedstaff) {
          return res.status(200).json({
            status: true,
            message: "staff created successfully"
          })
        }
      } catch (error) {
        console.log("show the error", error.message)
        return res.status(500).json({ message: "Server error" })
      }
    } else {
      return res
        .status(409)
        .json({ message: "staff with this email already exists" })
    }
  } catch (error) {
    console.log("ERROR:", error.message)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export const UpdateUserandAdmin = async (req, res) => {
  const { userId, userData, tabledata } = req.body

  const { role } = userData

  const { selected, ...filteredUserData } = userData
  const { password } = filteredUserData

  try {
    if (role === "Staff") {
      const updateQuery = {
        $set: filteredUserData // Set the fields from userData without 'selected'
      }
      // console.log("tabledata", tabledata)

      // Check if tableData is empty or not, and update the selected field accordingly
      if (tabledata.length === 0) {
        updateQuery.$set.selected = [] // Explicitly set selected to an empty array
      } else {
        updateQuery.$set.selected = tabledata // Add items to selected field if not empty
      }
      // console.log("qury", updateQuery.$set.password)
      if (updateQuery.$set.password) {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        updateQuery.$set.password = hashedPassword
      } else {
        delete updateQuery.$set.password
      }
      // Perform the update with findByIdAndUpdate
      const updateStaff = await Staff.findByIdAndUpdate(
        userId,
        updateQuery,
        { new: true } // Return the updated document
      )

      if (!updateStaff) {
        return res.status(404).json({ message: "Staff member not found" })
      }

      return res.status(200).json({ message: "Staff updated succesfully" })
    }
  } catch (error) {
    console.log("error:", error.message)
    res.status(500).json({ message: "Internal servor error" })
  }
}

export const Login = async (req, res) => {
  const { emailOrMobile, password } = req.body

  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    let user
    let branch
    // Determine if the input is an email or a mobile number
    if (emailRegex.test(emailOrMobile)) {
      // If it's an email

      user = await Admin.findOne({ email: emailOrMobile }).lean()
      if (!user) {
        user = await Staff.findOne({ email: emailOrMobile }).lean()
      }
    } else {
      // If it's a mobile number

      user = await Admin.findOne({ mobile: emailOrMobile }).lean()
      if (!user) {
        user = await Staff.findOne({ mobile: emailOrMobile }).lean()
      }
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid login credentials" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid login credentials" })
    }

    const token = generateToken(res, user.id)
    if (user.role === "Admin") {
      const allbranches = await Branch.find()
      const branch = allbranches.map((branch) => branch.branchName)

      user.branchName = branch
    }

    if (token) {
      const { password, ...userwithoutpassword } = user

      res.status(200).json({
        message: "Login successful",
        token,

        User: userwithoutpassword,
        branch
      })
    }
  } catch (error) {
    console.error("Login error:", error.message)
    res.status(500).json({ message: "Server error" })
  }
}
export const UpdateUserPermission = async (req, res) => {
  try {
    const userPermissions = req.body

    const { Userid } = req.query

    // Validate input
    if (!Userid || !userPermissions) {
      return res
        .status(400)
        .json({ message: "User ID and permissions are required." })
    }

    // Find the user by ID
    const user = await Staff.findById(Userid)
    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }

    // Update user permissions
    user.permissions = userPermissions // Assuming `permissions` is the field in your User schema
    await user.save()

    // Respond with the updated user information
    return res
      .status(200)
      .json({ message: "Permissions updated successfully.", user })
  } catch (error) {
    console.log("Error:", error.message)
  }
}

// export const GetallUsers = async (req, res) => {
//   try {
//     // const allusers = await Staff.find()
//     //   .populate({
//     //     path: "department",
//     //     model: "Department",
//     //     select: "department" // Select only the department field
//     //   })
//     //   .populate({
//     //     path: "assignedto", // Mongoose will handle the model based on assignedtoModel
//     //     select: "name" // Select only the name field
//     //   })
//     //   .then((data) => {
//     //     console.log("Fetched all users:", JSON.stringify(data, null, 2))
//     //     return data
//     //   })
//     //   .catch((error) => {
//     //     console.error("Error fetching users:", error)
//     //     throw error // Rethrow error if necessary
//     //   })
//     const allusers = await Staff.find().lean() // Convert to plain JavaScript objects
//     console.log(
//       "Raw users before population:",
//       JSON.stringify(allusers, null, 2)
//     )

//     // Populate the data after fetching
//     const populatedUsers = await Staff.populate(allusers, [
//       {
//         path: "department",
//         model: "Department",
//         select: "department"
//       },
//       {
//         path: "assignedto",
//         select: "name" // Ensure this is correctly referencing the assigned model
//       }
//     ])
//     console.log("indoallusrs", populatedUsers)
//     // const allusers = await Staff.find()
//     //   .populate({
//     //     path: "department",
//     //     model: "Department",
//     //     select: "department" // Select only the department field
//     //   })
//     //   .populate({
//     //     path: "assignedto",
//     //     model: function (doc) {
//     //       return doc.assignedModel
//     //     }
//     //   })

//     // const allusers = await Staff.find()
//     //   .populate({
//     //     path: "department",
//     //     model: "Department",
//     //     select: "department"
//     //   })
//     //   .populate({
//     //     path: "assignedto", // This will use refPath to determine the correct model
//     //     select: "name" // Select only the name field from either Staff or Admin
//     //   })
//     //   .then((data) => console.log(data))
//     //   .catch((error) => console.log(error))

//     // const populatedUsers = await Promise.all(
//     //   allusers.map(async (user) => {
//     //     if (user.assignedtoModel === "Admin") {
//     //       // If assignedtoModel is "Admin", populate from Admin collection
//     //       await user.populate({
//     //         path: "assignedto",
//     //         model: "Admin", // Directly specify the model
//     //         select: "name"
//     //       })
//     //     } else if (user.assignedtoModel === "Staff") {
//     //       // If assignedtoModel is "Staff", populate from Staff collection
//     //       await user.populate({
//     //         path: "assignedto",
//     //         model: "Staff", // Directly specify the model
//     //         select: "name"
//     //       })
//     //     }
//     //     return user // Return the populated user
//     //   })
//     // )
//     // console.log("populatedusers", populatedUsers)

//     const allAdmins = await Admin.find()

//     if (allusers.length || allAdmins.length) {
//       const data = {}

//       if (allusers.length) {
//         data.allusers = allusers
//       }

//       if (allAdmins.length) {
//         data.allAdmins = allAdmins
//       }
//       console.log("alldata", data)
//       return res.status(200).json({
//         message: "Users found",
//         data: data
//       })
//     } else {
//       return res.status(404).json({ message: "No users or admins found" })
//     }

//     // const allusers = await Staff.find()
//     // const allAdmins = await Admin.find()
//     // if (allusers || allAdmins) {
//     //   return res
//     //     .status(200)
//     //     .json({ message: " users found", data: { allusers, allAdmins } })
//     // } else {
//     //   res.status(400).json({ message: "users not found" })
//     // }
//   } catch (error) {
//     console.log("error:", error)
//     res.status(500).json({ message: "server error" })
//   }
// }

export const GetallUsers = async (req, res) => {
  try {
    const allusers = await Staff.find()
      .populate({ path: "department", select: "department" })
      .populate({ path: "assignedto", select: "name" })

    const allAdmins = await Admin.find()

    if (allusers.length || allAdmins.length) {
      const data = {}

      if (allusers.length) {
        data.allusers = allusers
      }

      if (allAdmins.length) {
        data.allAdmins = allAdmins
      }

      return res.status(200).json({
        message: "Users found",
        data: data
      })
    } else {
      return res.status(404).json({ message: "No users or admins found" })
    }
  } catch (error) {
    console.log("error:", error)
    res.status(500).json({ message: "server error" })
  }
}

export const LeaveApply = async (req, res) => {
  const formData = req.body
  const { Userid } = req.query

  const { startDate, endDate, leaveType, onsite, reason, description } =
    formData

  const start = new Date(startDate)

  try {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const dates = []

    let current = new Date(start)
    while (current <= end) {
      dates.push(new Date(current).toISOString().split("T")[0]) // Format as 'YYYY-MM-DD'
      current.setDate(current.getDate() + 1) // Increment by one day
    }

    // Save each date as a separate document
    for (const leaveDate of dates) {
      const leave = new LeaveRequest({
        leaveDate,
        leaveType,
        onsite,

        description,
        userId: Userid
      })
      // Only add 'reason' if 'onsite' is false
      if (!onsite) {
        leave.reason = reason
      }
      await leave.save()
    }

    const leaveSubmit = await LeaveRequest.find({ userId: Userid })

    return res
      .status(200)
      .json({ message: "leave submitted", data: leaveSubmit })
  } catch (error) {
    res.status(500).json({ message: "internal server error" })
  }
}
export const GetallLeave = async (req, res) => {
  const { userid } = req.query // Extract userid from query parameters

  try {
    // Validate userid
    if (!userid) {
      return res.status(400).json({ error: "User ID is required" })
    }

    // Fetch all leave records for the specified userid
    const leaves = await LeaveRequest.find({ userId: userid })

    // Check if no records found
    if (leaves.length === 0) {
      return res
        .status(404)
        .json({ message: "No leave records found for this user" })
    }

    // Send the leave records as a JSON response
    res.status(200).json({ message: "leaves found", data: leaves })
  } catch (error) {
    console.error("Error fetching leave records:", error)
    res
      .status(500)
      .json({ error: "An error occurred while fetching leave records" })
  }
}
export const GetAllLeaveRequest = async (req, res) => {
  try {
  } catch (error) {}
}

export const DeleteUser = async (req, res) => {
  const { id } = req.query

  try {
    // Perform the deletion
    const result = await Staff.findByIdAndDelete(id)

    if (result) {
      return res.status(200).json({ message: "User deleted successfully" })
    } else {
      return res.status(404).json({ message: "User not found" })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Server error" })
  }
}
export const GetStaffCallList = async (req, res) => {
  try {
    const staff = await Staff.find()
    if (staff) {
      return res.status(200).json({ message: "Staff founds", data: staff })
    }
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ message: "internal server error" })
  }
}
export const GetindividualStaffCall = async (req, res) => {
  try {
    const startDate = new Date("2024-11-15T00:00:00.000Z")

    const calls = await CallRegistration.aggregate([
      {
        $project: {
          _id: 1, // Include the _id field
          customerid: 1, // Include the customerid field
          callregistration: {
            $filter: {
              input: "$callregistration", // The array to filter
              as: "call", // Alias for each element in the array
              cond: { $gte: ["$$call.timedata.startTime", startDate] } // Condition to match startTime
            }
          }
        }
      },
      {
        // Optionally, you can add a match stage to exclude documents without any valid calls in the array
        $match: {
          "callregistration.0": { $exists: true } // Ensure there is at least one matching call in the array
        }
      }
    ])
    // Now use populate to fetch customer details using the customerid
    const populatedCalls = await CallRegistration.populate(calls, {
      path: "customerid", // The field you want to populate
      select: "customerName " // Fields to include in the populated customer
    })
    // const calls = await CallRegistration.aggregate([
    //   {
    //     $project: {
    //       // Only include the calls that match the startDate in the 'callregistration' array
    //       callregistration: {
    //         $filter: {
    //           input: "$callregistration", // The array to filter
    //           as: "call", // Alias for each element in the array
    //           cond: { $gte: ["$$call.timedata.startTime", startDate] } // Condition to match startTime
    //         }
    //       }
    //     }
    //   },
    //   {
    //     // Optionally, you can add a match stage to exclude documents without any valid calls in the array
    //     $match: {
    //       "callregistration.0": { $exists: true } // Ensure there is at least one matching call in the array
    //     }
    //   }
    // ]);
    ////
    // const startDate = new Date("2024-11-15").toISOString().split("T")[0]
    // const calls = await CallRegistration.find({
    //   "callregistration.timedata.startTime": {
    //     $gte: startDate // Fetch calls with startTime greater than or equal to this date
    //   }
    // })

    console.log("abhiiiiii")
    console.log("calllsddddd", calls)
    if (calls) {
      // Respond with the filtered call data
      return res
        .status(200)
        .json({ message: "Matched calls found", data: populatedCalls })
    }
  } catch (error) {
    console.error("Error fetching staff call data:", error)
    return res
      .status(500)
      .json({ message: "An error occurred while fetching data." })
  }
}
