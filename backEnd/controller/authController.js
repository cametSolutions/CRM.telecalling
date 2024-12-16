import models from "../model/auth/authSchema.js"
import mongoose from "mongoose"
import Branch from "../model/primaryUser/branchSchema.js"
import Attendance from "../model/primaryUser/attendanceSchema.js"
const { Staff, Admin } = models
import bcrypt from "bcrypt"

import generateToken from "../utils/generateToken.js"
import LeaveRequest from "../model/primaryUser/leaveRequestSchema.js"
import CallRegistration from "../model/secondaryUser/CallRegistrationSchema.js"
export const resetCallStatus = async (req, res) => {
  const { adminid } = req.query

  const objectId = new mongoose.Types.ObjectId(adminid)
  try {
    const a = await Admin.updateOne(
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

      // Check if tableData is empty or not, and update the selected field accordingly
      if (tabledata.length === 0) {
        updateQuery.$set.selected = [] // Explicitly set selected to an empty array
      } else {
        updateQuery.$set.selected = tabledata // Add items to selected field if not empty
      }

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
export const AttendanceApply = async (req, res) => {
  try {
    const selectattendance = req.body
    const { selectedid } = req.query

    if (!selectedid) {
      return res.status(400).json({ message: "Selected ID is required" })
    }

    const objectId = new mongoose.Types.ObjectId(selectedid)
    const {
      attendanceDate,
      inTime: { hours: inTimeHours, minutes: inTimeMinutes, amPm: inTimeAmPm },
      outTime: {
        hours: outTimeHours,
        minutes: outTimeMinutes,
        amPm: outTimeAmPm
      }
    } = selectattendance
    // Merge hours, minutes, and amPm into time strings
    const inTimeString = `${inTimeHours}:${inTimeMinutes} ${inTimeAmPm}`
    const outTimeString = `${outTimeHours}:${outTimeMinutes} ${outTimeAmPm}`

    // Check if attendance for the given date already exists for the selected ID
    const existingAttendance = await Attendance.findOne({
      userId: objectId,
      attendanceDate
    })
    if (existingAttendance) {
      // Update existing record with new time data
      existingAttendance.inTime = inTimeString
      existingAttendance.outTime = outTimeString
      await existingAttendance.save()
      console.log("Hiiiiii")
      return res.status(200).json({
        message: "Attendance updated successfully",
        attendance: existingAttendance
      })
    } else {
      // Create a new attendance record if none exists
      if (!inTimeString) {
        return res
          .status(400)
          .json({ message: "In-time is required for new attendance" })
      }

      const newAttendance = new Attendance({
        userId: objectId,
        attendanceDate,
        inTime: inTimeString,
        outTime: outTimeString || null // Out-time can be added later
      })

      await newAttendance.save()

      return res.status(201).json({
        message: "Attendance recorded successfully",
        attendance: newAttendance
      })
    }
  } catch (error) {
    console.error("Error:", error.message)
    res.status(500).json({
      message: "An error occurred while recording attendance",
      error: error.message
    })
  }
}

export const LeaveApply = async (req, res) => {
  const formData = req.body
  const { selectedid, assignedto } = req.query
  console.log("selectedid", selectedid)

  const objectId = new mongoose.Types.ObjectId(selectedid)
  const assignedTo = new mongoose.Types.ObjectId(assignedto)

  const {
    startDate,

    leaveType,
    onsite,
    reason,
    description,
    halfDayPeriod
  } = formData

  try {
    // Save each date as a separate document

    const leave = new LeaveRequest({
      leaveDate: startDate,
      leaveType,
      ...(leaveType === "Half Day" && { halfDayPeriod }),
      onsite,
      reason,
      description,
      userId: objectId,
      assignedto: assignedTo
    })

    const a = await leave.save()
    if (a) {
      console.log("successsss")
    }

    const leaveSubmit = await LeaveRequest.find({ userId: objectId })

    return res
      .status(200)
      .json({ message: "leave submitted", data: leaveSubmit })
  } catch (error) {
    res.status(500).json({ message: "internal server error" })
  }
}

export const OnsiteleaveApply = async (req, res) => {
  try {
    const { selectedid, assignedto } = req.query

    const { formData, tableRows } = req.body
    const selectedObjectId = new mongoose.Types.ObjectId(selectedid)
    const assignedObjectId = new mongoose.Types.ObjectId(assignedto)

    if (!tableRows) {
      return res.status(404).json({ message: "no table content" })
    }
    const {
      startDate,
      endDate,
      leaveType,
      onsite,

      description,
      halfDayPeriod
    } = formData

    const onsiteLeave = new LeaveRequest({
      leaveDate: new Date(startDate).toISOString().split("T")[0],
      leaveType,
      ...(leaveType === "Half Day" && { halfDayPeriod }),
      onsite,

      description,
      userId: selectedObjectId,
      assignedto: assignedObjectId
    })
    if (tableRows) {
      onsiteLeave.onsiteData.push(tableRows)
    }
    const successonsite = await onsiteLeave.save()
    if (successonsite) {
      return res.status(200).json({ message: "onsite leave applied success" })
    }
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const GetAllAttendance = async (req, res) => {
  try {
    const { userid } = req.query // Extract userid from query parameters
    console.log("tyeeee", typeof userid)

    const objectId = new mongoose.Types.ObjectId(userid)
    if (!userid) {
      return res.status(400).json({ error: "User ID is required" })
    }

    // Fetch all leave records for the specified userid
    const attendance = await Attendance.find({ userId: objectId })

    // Check if no records found
    if (attendance.length === 0) {
      return res
        .status(404)
        .json({ message: "No attendance records found for this user" })
    }

    // Send the leave records as a JSON response
    res.status(200).json({ message: "attendance found", data: attendance })
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const GetallLeave = async (req, res) => {
  const { userid } = req.query // Extract userid from query parameters
  console.log("tyeeee", typeof userid)

  const objectId = new mongoose.Types.ObjectId(userid)
  console.log("idddd", objectId)
  try {
    // Validate userid
    if (!userid) {
      return res.status(400).json({ error: "User ID is required" })
    }

    // Fetch all leave records for the specified userid
    const leaves = await LeaveRequest.find({ userId: objectId })

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
    const startdate = req?.query?.startdate
    const enddate = req?.query?.enddate
    const onsite = req?.query?.onsite
    const userid = req?.query?.userid
    const role = req?.query?.role

    const objectId = new mongoose.Types.ObjectId(userid)

    // Ensure the dates are valid and convert them to ISO format
    const startDate = new Date(startdate) // Convert to Date object
    const endDate = new Date(enddate) // Convert to Date object

    // Check if the dates are valid
    if (isNaN(startDate) || isNaN(endDate)) {
      return res.status(400).send({ message: "Invalid date format" })
    }
    // Initialize the query with common conditions
    const query = {
      leaveDate: {
        $gte: startDate, // Greater than or equal to startDate
        $lte: endDate // Less than or equal to endDate
      }
    }

    // Check if the role is not admin
    if (role !== "Admin") {
      query.assignedto = objectId // Only include assignedto for non-admin users
    }

    // Check for onsite status
    if (onsite === "true") {
      query.onsite = true
    } else {
      query.onsite = false
    }

    // Execute the query with population
    const leaveList = await LeaveRequest.find(query).populate({
      path: "userId",
      select: "name role department", // Select fields from User
      populate: [
        {
          path: "department",
          select: "department",
          options: { strictPopulate: false } // Graceful fallback for missing departments
        },
        {
          path: "selected.branch_id",
          model: "Branch",
          select: "branchName",
          options: { strictPopulate: false } // Avoid errors for missing branches
        }
      ]
    })
    console.log("list", leaveList)

    // if (onsite === "true") {
    //   leaveList = await LeaveRequest.find({
    //     leaveDate: {
    //       $gte: startDate, // Greater than or equal to startDate
    //       $lte: endDate // Less than or equal to endDate
    //     },
    //     onsite: true,
    //     assignedto: objectId
    //   }).populate({
    //     path: "userId",
    //     select: "name role department", // Select fields from User
    //     populate: [
    //       {
    //         path: "department",
    //         select: "department",
    //         options: { strictPopulate: false } // Allow graceful fallback for missing departments
    //       },
    //       {
    //         path: "selected.branch_id",
    //         model: "Branch",
    //         select: "branchName",
    //         options: { strictPopulate: false } // Avoid errors for missing branches
    //       }
    //     ]
    //   })
    // } else {
    //   leaveList = await LeaveRequest.find({
    //     leaveDate: {
    //       $gte: startDate, // Greater than or equal to startDate
    //       $lte: endDate // Less than or equal to endDate
    //     },
    //     onsite: false,
    //     assignedto: objectId
    //   }).populate({
    //     path: "userId",
    //     select: "name role department", // Select fields from User
    //     populate: [
    //       {
    //         path: "department",
    //         select: "department",
    //         options: { strictPopulate: false } // Allow graceful fallback for missing departments
    //       },
    //       {
    //         path: "selected.branch_id",
    //         model: "Branch",
    //         select: "branchName",
    //         options: { strictPopulate: false } // Avoid errors for missing branches
    //       }
    //     ]
    //   })
    // }

    if (leaveList) {
      return res.status(200).json({ message: "leaves found", data: leaveList })
    }
  } catch (error) {
    console.log("error:", error.message)
  }
}
export const GetallusersLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({})
    if (leaves) {
      return res.status(200).json({ message: "leaves found", data: leaves })
    }
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "internal server error" })
  }
}
export const GetallusersAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({})
    if (attendance) {
      return res
        .status(200)
        .json({ message: "attendance found", data: attendance })
    }
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "internal server error" })
  }
}
export const ApproveLeave = async (req, res) => {
  console.log("hiiiii")
  try {
    const { role, userId, selectedId, startDate, endDate, onsite } = req.query

    // Validate common parameters
    if (!role || !startDate || !endDate || !onsite) {
      console.log("onsiteddddddd", onsite)
      return res
        .status(400)
        .json({ message: "Missing required query parameters." })
    }

    // Extract additional query strings, dynamically handle `selectAll` and `single`
    const isSelectAll = req?.query?.selectAll === "true"
    const isSingle = req?.query?.single === "true"

    // Ensure at least one specific query is provided
    if (!isSelectAll && !isSingle) {
      return res.status(400).json({
        message: "Missing specific action parameter (selectAll or single)."
      })
    }

    // Convert IDs to ObjectId if provided
    const userObjectId = userId ? new mongoose.Types.ObjectId(userId) : null
    const selectedObjectId = selectedId
      ? new mongoose.Types.ObjectId(selectedId)
      : null

    // Base query common to both cases
    const baseQuery = {
      leaveDate: { $gte: startDate, $lte: endDate },
      onsite: onsite === "true"
    }

    // Add user-specific filtering for non-admin roles
    if (role !== "Admin" && userObjectId) {
      baseQuery.assignedto = userObjectId
    }
    console.log("base", baseQuery)
    // Define role-based update fields
    const updateFields =
      role === "Admin"
        ? {
            hrstatus: "HR/Onsite Approved",
            adminverified: true,
            ...(onsite === "true" && { onsitestatus: "Approved" })
          }
        : {
            departmentstatus: "Dept Approved",
            departmentverified: true,
            ...(onsite === "true" && { onsitestatus: "Approved" })
          }

    let result

    if (isSelectAll) {
      // Handle selectAll case
      if (!selectedObjectId) {
        return res.status(400).json({
          message: "Missing required parameter: selectedId for selectAll."
        })
      }

      const queryForUpdate = { ...baseQuery, userId: selectedObjectId }
      result = await LeaveRequest.updateMany(queryForUpdate, {
        $set: updateFields
      })
      // Check if any document was updated
      if (result && result.modifiedCount > 0) {
        // Fetch updated leave requests for display
        const updatedLeaveList = await LeaveRequest.find(baseQuery).populate({
          path: "userId",
          select: "name role department",
          populate: [
            {
              path: "department",
              select: "department",
              options: { strictPopulate: false }
            },
            {
              path: "selected.branch_id",
              model: "Branch",
              select: "branchName",
              options: { strictPopulate: false }
            }
          ]
        })

        return res.status(200).json({
          message: "Leave request(s) updated successfully",
          data: updatedLeaveList
        })
      }
    } else if (isSingle) {
      // Handle single case
      if (!selectedObjectId) {
        return res.status(400).json({
          message: "Missing required parameter: selectedId for single update."
        })
      }
      result = await LeaveRequest.updateOne(
        { _id: selectedObjectId },
        { $set: updateFields }
      )
    }

    // Check if any document was updated
    if (result && result.modifiedCount > 0) {
      // Fetch updated leave requests for display
      const updatedLeaveList = await LeaveRequest.find(baseQuery).populate({
        path: "userId",
        select: "name role department",
        populate: [
          {
            path: "department",
            select: "department",
            options: { strictPopulate: false }
          },
          {
            path: "selected.branch_id",
            model: "Branch",
            select: "branchName",
            options: { strictPopulate: false }
          }
        ]
      })

      return res.status(200).json({
        message: "Leave request(s) updated successfully",
        data: updatedLeaveList
      })
    }

    return res
      .status(404)
      .json({ message: "No matching leave requests found to update." })
  } catch (error) {
    console.error("Error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}

export const RejectLeave = async (req, res) => {
  try {
    const role = req?.query?.role
    const selectedId = req?.query?.selectedId
    const userId = req?.query?.userId
    const onsite = req?.query?.onsite
    const startdate = req?.query?.startdate
    console.log("stert", startdate)
    const enddate = req?.query?.enddate
    // Ensure the dates are valid and convert them to ISO format
    const startDate = new Date(startdate) // Convert to Date object
    const endDate = new Date(enddate) // Convert to Date object

    const selectedObjectId = new mongoose.Types.ObjectId(selectedId)
    const userObjectId = new mongoose.Types.ObjectId(userId)
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" })
    }

    const leaveRequest = await LeaveRequest.findOne({ _id: selectedObjectId })

    if (!leaveRequest) {
      return res.status(404).json({ message: "Leave request not found" })
    }
    // Validate the role and update logic
    if (role === "Admin") {
      // Update the leave request for admins
      leaveRequest.hrstatus = "HR Rejected"
    } else if (role === "Staff") {
      // Update the leave request for managers
      leaveRequest.departmentstatus = "Dept Rejected"
    }

    // Save the updated leave request
    const succesreject = await leaveRequest.save()
    if (succesreject) {
      console.log("okkkk")
      // Check if the dates are valid
      if (isNaN(startDate) || isNaN(endDate)) {
        return res.status(400).send({ message: "Invalid date format" })
      }
      // Initialize the query with common conditions
      const query = {
        leaveDate: {
          $gte: startDate, // Greater than or equal to startDate
          $lte: endDate // Less than or equal to endDate
        }
      }

      // Check if the role is not admin
      if (role !== "Admin") {
        query.assignedto = userObjectId // Only include assignedto for non-admin users
      }

      // Check for onsite status
      if (onsite === "true") {
        query.onsite = true
      } else {
        query.onsite = false
      }

      // Execute the query with population
      const leaveList = await LeaveRequest.find(query).populate({
        path: "userId",
        select: "name role department", // Select fields from User
        populate: [
          {
            path: "department",
            select: "department",
            options: { strictPopulate: false } // Graceful fallback for missing departments
          },
          {
            path: "selected.branch_id",
            model: "Branch",
            select: "branchName",
            options: { strictPopulate: false } // Avoid errors for missing branches
          }
        ]
      })
      console.log("list", leaveList)

      return res.status(200).json({
        message: "Leave request updated successfully",
        data: leaveList
      })
    }
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const UpdateLeave = async (req, res) => {
  try {
    const { userId } = req.query
    const { updatedData } = req.body

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" })
    }
    const objectId = new mongoose.Types.ObjectId(userId)
    // Update the leave request data
    const updatedLeaveRequest = await LeaveRequest.findOneAndUpdate(
      { _id: objectId }, // Match the userId
      { $set: updatedData }, // Set the new data
      { new: true } // Return the updated document
    )

    if (!updatedLeaveRequest) {
      return res.status(404).json({ message: "Leave request not found" })
    } else {
      return res.status(200).json({ message: "Leave updates success" })
    }
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
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
// export const GetStaffCallList = async (req, res) => {
//   try {
//     const staff = await Staff.find()
//     const customerCalls = await CallRegistration.find()

//     const userCallsCount = customerCalls
//       .map((item) => {
//         return item.callregistration
//           .filter((calls) =>
//             calls.formdata.attendedBy.some((call) => {
//               const callDate = new Date(call.calldate) // Assuming `callDate` is in a parsable date format
//               const filterDate = new Date("2024-12-10")
//               return callDate > filterDate // Filter out calls after 10-12-2024
//             })
//           )
//           .map((calls) => {
//             return calls.formdata.attendedBy.map((call) => {
//               const isColleagueSolved =
//                 calls.formdata.status === "solved" &&
//                 calls.formdata.attendedBy.lastIndexOf(call.callerId) ===
//                   calls.formdata.completedBy

//               return {
//                 callDate: call.calldate, // Ensure `callDate` exists in each `call`
//                 callerId: call.callerId, // Assuming `callerId` is a property of `call`
//                 callStatus: calls.formdata.status,
//                 colleagueSolved: isColleagueSolved ? 1 : 0
//               }
//             })
//           })
//       })
//       .flat()

//     console.log("counts", userCallsCount)

//     if (staff) {
//       return res
//         .status(200)
//         .json({ message: "Staff founds", data: { staff, userCallsCount } })
//     }
//   } catch (error) {
//     console.log(error.message)
//     return res.status(500).json({ message: "internal server error" })
//   }
// }
export const GetStaffCallList = async (req, res) => {
  try {
    // Fetch staff details
    const staff = await Staff.find()
    const a = await Staff.find().select("name _id callstatus.totalCall").lean()
    console.log("a", a)
    // Fetch customer calls and populate callerId in attendedBy array
    const customerCalls = await CallRegistration.find()
      .populate("callregistration.formdata.attendedBy.callerId") // Populate callerId field
      .exec()

    // Process customer calls
    const userCallsCount = customerCalls
      .map((item) => {
        return item.callregistration
          .filter((calls) =>
            calls.formdata.attendedBy.some((call) => {
              const callDate = new Date(call.calldate) // Assuming `calldate` is a parsable date format
              const filterDate = new Date("2024-12-10")
              return callDate > filterDate // Only include calls after 10-12-2024
            })
          )
          .map((calls) => {
            const uniqueCallerIds = new Set() // Track unique `callerId`

            return calls.formdata.attendedBy
              .filter((call) => {
                if (uniqueCallerIds.has(call.callerId?.toString())) {
                  return false // Skip if already processed
                }
                uniqueCallerIds.add(call.callerId?.toString()) // Add to the set
                return true
              })
              .map((call) => {
                // Get today's date in `YYYY-MM-DD` format
                const today = new Date().toISOString().split("T")[0]
                const callDate = new Date(call.calldate)
                  .toISOString()
                  .split("T")[0]
                // Check if callerId matches any staff _id and add staff name to callerDetails
                const matchedStaff = staff.find(
                  (staffMember) =>
                    staffMember._id.toString() === call?.callerId?.toString()
                )

                const isColleagueSolved =
                  calls.formdata.status === "solved" &&
                  calls.formdata.attendedBy.findIndex(
                    (attendee) =>
                      attendee?.callerId?.toString() ===
                      calls?.formdata?.completedBy[0].callerId
                  ) ===
                    calls.formdata.attendedBy.lastIndexOf((attendee) =>
                      attendee?.callerId?.toString()
                    )

                return {
                  callDate: call.calldate, // Ensure `calldate` exists
                  callerId: call.callerId?._id, // Access the populated `_id` of `callerId`
                  callerName: matchedStaff
                    ? matchedStaff.name // Set the staff name if matched
                    : call.callerId, // Default to original callerDetails if no match
                  callStatus: calls.formdata.status,
                  colleagueSolved:
                    isColleagueSolved && calls.formdata.status === "solved"
                      ? 0
                      : !isColleagueSolved &&
                        calls.formdata.status === "pending"
                      ? 0
                      : 1, // Default value if neither condition is met

                  solvedCalls: isColleagueSolved ? 1 : 0,
                  datecalls: 1,
                  pendingCalls: calls.formdata.completedBy[0]
                    ? 0 // No pending calls
                    : 1, // Increment count if `completedBy[0]` is empty
                  todaysCalls: callDate === today ? 1 : 0 // Count 1 if `call.calldate` matches today's date
                }
              })
          })
      })
      .flat() // Flatten nested arrays into a single array

    // const userCallsCount = customerCalls.map((item) => {
    //   return item.callregistration
    //     .filter((calls) =>
    //       calls.formdata.attendedBy.some((call) => {
    //         const callDate = new Date(call.calldate) // Assuming `calldate` is a parsable date format
    //         const filterDate = new Date("2024-12-10")
    //         return callDate > filterDate // Only include calls after 10-12-2024
    //       })
    //     )
    //     .map((calls) => {
    //       return calls.formdata.attendedBy.map((call) => {
    //         // Check if callerId matches any staff _id and add staff name to callerDetails
    //         const matchedStaff = staff.find(
    //           (staffMember) =>
    //             staffMember._id.toString() === call?.callerId.toString()
    //         )

    //         const isColleagueSolved =
    //           calls.formdata.status === "solved" &&
    //           calls.formdata.attendedBy.findIndex(
    //             (attendee) =>
    //               attendee?.callerId.toString() ===
    //               calls?.formdata?.completedBy[0]
    //           ) ===
    //             calls.formdata.attendedBy.lastIndexOf((attendee) =>
    //               attendee?.callerId.toString()
    //             )

    //         return {
    //           callDate: call.calldate, // Ensure `calldate` exists
    //           callerId: call.callerId?._id, // Access the populated `_id` of `callerId`
    //           callerName: matchedStaff
    //             ? matchedStaff.name // Set the staff name if matched
    //             : call.callerId, // Default to original callerDetails if no match
    //           callStatus: calls.formdata.status,
    //           colleagueSolved: isColleagueSolved ? 0 : 1
    //         }
    //       })
    //     })
    // }).flat()

    // const userCallsCount = customerCalls
    //   .map((item) => {
    //     return item.callregistration
    //       .filter((calls) =>
    //         calls.formdata.attendedBy.some((call) => {
    //           const callDate = new Date(call.calldate) // Assuming `calldate` is a parsable date format
    //           const filterDate = new Date("2024-12-10")
    //           return callDate > filterDate // Only include calls after 10-12-2024
    //         })
    //       )
    //       .map((calls) => {
    //         return calls.formdata.attendedBy.map((call) => {
    //           const isColleagueSolved =
    //             calls.formdata.status === "solved" &&
    //             calls.formdata.attendedBy.findIndex(
    //               (attendee) =>
    //                 attendee.callerId?._id?.toString() ===
    //                 calls.formdata.completedBy
    //             ) ===
    //               calls.formdata.attendedBy.lastIndexOf((attendee) =>
    //                 attendee.callerId?._id?.toString()
    //               )

    //           return {
    //             callDate: call.calldate, // Ensure `calldate` exists
    //             callerId: call.callerId?._id, // Access the populated `_id` of `callerId`
    //             callerDetails: call.callerId, // Include full populated details of `callerId`
    //             callStatus: calls.formdata.status,
    //             colleagueSolved: isColleagueSolved ? 1 : 0
    //           }
    //         })
    //       })
    //   })
    //   .flat() // Flatten nested arrays into a single array

    // Debugging output
    console.log("counts", userCallsCount)

    // Response to client
    if (staff) {
      return res.status(200).json({
        message: "Staff found",
        data: { staff, userCallsCount, a }
      })
    }
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}

export const GetindividualStaffCall = async (req, res) => {
  try {
    const startDate = new Date("2024-11-16T00:00:00.000Z")

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
    const populatedCalls = await CallRegistration.populate(calls, [
      {
        path: "customerid", // The field you want to populate
        select: "customerName " // Fields to include in the populated customer
      },
      {
        path: "callregistration.product", // Populate the product field inside callregistration array
        select: "productName" // Optionally select fields from the Product schema you need
      }
    ])
    for (const call of populatedCalls) {
      for (const registration of call.callregistration) {
        // Ensure attendedBy is an array
        if (Array.isArray(registration.formdata.attendedBy)) {
          // Fetch attendedBy details
          registration.formdata.attendedBy = await Promise.all(
            registration.formdata.attendedBy.map(async (attended) => {
              const user = await Staff.findById(attended.callerId).select(
                "name"
              )
              return {
                callerId: user?.name
              }
            })
          )
        } else {
          registration.attendedBy = [] // Default to an empty array if undefined
        }

        // Ensure completedBy is an array
        if (Array.isArray(registration.formdata.completedBy)) {
          // Fetch completedBy details
          registration.formdata.completedBy = await Promise.all(
            registration.formdata.completedBy.map(async (completed) => {
              const user = await Staff.findById(completed.callerId).select(
                "name"
              )
              return {
                callerId: user?.name
              }
            })
          )
        } else {
          registration.completedBy = [] // Default to an empty array if undefined
        }
      }
    }

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
