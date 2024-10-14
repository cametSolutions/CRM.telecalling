import models from "../model/auth/authSchema.js"
const { Staff, Admin } = models
import bcrypt from "bcrypt"

import generateToken from "../utils/generateToken.js"
import LeaveRequest from "../model/primaryUser/leaveRequestSchema.js"

export const Register = async (req, res) => {
  const { userData, image } = req.body
  const { name, email, mobile, password, role, ...otherfields } = userData
  const { imageUrl } = image

  if (role === "Admin") {
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
        await admin.save()
        res.status(200).json({
          status: true,
          message: "admin created successfully"
        })
      } catch (error) {
        res.status(500).json({ message: "Server error" })
      }
    } else {
      return res
        .status(409)
        .json({ message: "Admin with this email already exists" })
    }
  } else if (
    role === "Staff" ||
    role === "Hr" ||
    role === "Assistantmanager" ||
    role === "Seniormanager" ||
    role === "Teamleader"
  ) {
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
          imageUrl
        })

        const savedstaff = await staff.save()

        res.status(200).json({
          status: true,
          message: "staff created successfully"
        })
      } catch (error) {
        console.log("show the error", error.message)
        res.status(500).json({ message: "Server error" })
      }
    } else {
      return res
        .status(409)
        .json({ message: "staff with this email already exists" })
    }
  }
}
export const UpdateUserandAdmin = async (req, res) => {
  const { userData, userId } = req.body
  const { role } = userData
  try {
    if (role === "Staff") {
      const updateStaff = await Staff.findByIdAndUpdate(
        userId,
        { $set: userData }, // Updating the fields in userData
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
  const { emailOrMobile, password, role } = req.body

  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    let user

    // Determine if the input is an email or a mobile number
    if (emailRegex.test(emailOrMobile)) {
      // If it's an email
      if (role === "Admin") {
        user = await Admin.findOne({ email: emailOrMobile })
      } else if (role === "Staff") {
        user = await Staff.findOne({ email: emailOrMobile })
      }
    } else {
      // If it's a mobile number
      if (role === "Admin") {
        user = await Admin.findOne({ mobile: emailOrMobile })
      } else if (role === "Staff") {
        user = await Staff.findOne({ mobile: emailOrMobile })
      }
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid login credentials" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    console.log("isma", isMatch)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid login credentials" })
    }
    console.log("id", user.id)
    const token = generateToken(res, user.id)
    console.log("tok", token)

    res
      .status(200)
      .json({ message: "Login successful", token, role: user.role, user })
  } catch (error) {
    console.error("Login error:", error.message)
    res.status(500).json({ message: "Server error" })
  }
}

export const GetallUsers = async (req, res) => {
  try {
    const allusers = await Staff.find()
    if (allusers.length > 0) {
      return res.status(200).json({ message: " users found", data: allusers })
    } else {
      res.status(400).json({ message: "users not found" })
    }
  } catch (error) {
    console.log("error:", error.message)
    res.status(500).json({ message: "server error" })
  }
}
export const LeaveApply = async (req, res) => {
  const updatedData = req.body
  console.log("body", req.body)
  console.log("up", updatedData)
  const { startDate, endDate, leaveType, onsite, reason, userid } = updatedData

  try {
    const leave = new LeaveRequest({
      startDate,
      endDate,
      leaveType,
      onsite,
      reason,
      userId: userid
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
