import models from "../model/auth/authSchema.js"
const { Staff, Admin } = models
import bcrypt from "bcrypt"

import generateToken from "../utils/generateToken.js"
import LeaveRequest from "../model/primaryUser/leaveRequestSchema.js"

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
  console.log("hiii")
  // console.log(image)
  // console.log(profileUrl)
  // console.log(documentUrl)

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
  console.log(isaved)
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
        console.log(savedstaff)

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
  console.log("hiii")

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
        console.log("hiii")
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
        console.log(savedstaff)
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

  const { selected, password, ...filteredUserData } = userData

  console.log("role", role)

  try {
    if (role === "Staff") {
      const updateQuery = {
        $set: filteredUserData // Set the fields from userData without 'selected'
      }
      console.log("tabledata", tabledata)

      // Check if tableData is empty or not, and update the selected field accordingly
      if (tabledata.length === 0) {
        updateQuery.$set.selected = [] // Explicitly set selected to an empty array
      } else {
        updateQuery.$set.selected = tabledata // Add items to selected field if not empty
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
    // Determine if the input is an email or a mobile number
    if (emailRegex.test(emailOrMobile)) {
      // If it's an email

      user = await Admin.findOne({ email: emailOrMobile })
      if (!user) {
        user = await Staff.findOne({ email: emailOrMobile })
      }
    } else {
      // If it's a mobile number

      user = await Admin.findOne({ mobile: emailOrMobile })
      if (!user) {
        user = await Staff.findOne({ mobile: emailOrMobile })
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
    console.log("userssbckkkk", user)
    console.log("role", user.role)
    res
      .status(200)
      .json({ message: "Login successful", token, role: user.role, user })
  } catch (error) {
    console.error("Login error:", error.message)
    res.status(500).json({ message: "Server error" })
  }
}
export const UpdateUserPermission = async (req, res) => {
  try {
    const userPermissions = req.body

    console.log("prmsisson", userPermissions)
    const { Userid } = req.query
    console.log("userid", Userid)
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
    const allusers = await Staff.find().populate([
      {
        path: "department",
        model: "Department",
        select: "department"
      },
      {
        path: "assignedto",
        select: "name"
      }
    ])

    // console.log("allusers", populatedUsers)

    const allAdmins = await Admin.find()

    if (allusers.length || allAdmins.length) {
      const data = {}

      if (allusers.length) {
        data.allusers = allusers
      }

      if (allAdmins.length) {
        data.allAdmins = allAdmins
      }
      console.log("alldata", data)
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
  console.log("hlwererer")
  const formData = req.body
  const { Userid } = req.query

  const { startDate, endDate, leaveType, onsite, reason } = formData

  try {
    const leave = new LeaveRequest({
      startDate,
      endDate,
      leaveType,
      onsite,
      reason,
      userId: Userid
    })
    const leaveSubmit = await leave.save()
    console.log(leaveSubmit)
    return res
      .status(200)
      .json({ message: "leave submitted", data: leaveSubmit })
  } catch (error) {
    console.log("error", error.message)
    res.status(500).json({ message: "internal server error" })
  }
}
export const GetallLeave = async (req, res) => {
  const { userid } = req.query // Extract userid from query parameters

  console.log("userid", userid)

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
    console.log("leavessss", leaves)

    // Send the leave records as a JSON response
    res.status(200).json({ message: "leaves found", data: leaves })
  } catch (error) {
    console.error("Error fetching leave records:", error)
    res
      .status(500)
      .json({ error: "An error occurred while fetching leave records" })
  }
}
export const DeleteUser = async (req, res) => {
  const { id } = req.query
  console.log("id", id)

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
