import models from "../model/auth/authSchema.js"
import Leavemaster from "../model/secondaryUser/leavemasterSchema.js"

import QuarterlyAchiever from "../model/primaryUser/quarterlyAchieversSchema.js"
import YearlyAchiever from "../model/primaryUser/yearylyAchieversSchema.js"
import { getStaffSolvedCallCounts } from "../helper/staffHighestandlowestsolvedcallscount.js"
import LeadMaster from "../model/primaryUser/leadmasterSchema.js"
import { checkAcheivementlist } from "../helper/achievementCheck.js"
import { PreviousmonthLeavesummary } from "../helper/previousMonthleaveSummary.js"
import mongoose from "mongoose"
import Branch from "../model/primaryUser/branchSchema.js"
import Attendance from "../model/primaryUser/attendanceSchema.js"
import Holymaster from "../model/secondaryUser/holydaymasterSchema.js"
import Onsite from "../model/primaryUser/onsiteSchema.js"
const { Staff, Admin } = models
import bcrypt from "bcrypt"
import CompensatoryLeave from "../model/primaryUser/compensatoryLeaveSchema.js"
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

        await staff.save()

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
      assignedto,
      attendanceId
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
          attendanceId: Number(attendanceId),
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
  const { userId, userData, tabledata, userlevelPermission, imageData } =
    req.body
  const { profileUrl, documentUrl } = imageData
  const { role } = userData

  const { assignedto, selected, permissionLevel, ...filteredUserData } =
    userData

  const { password } = filteredUserData
  const assignedtoId = assignedto // Assuming assignedto is coming from userDat
  let assignedtoModel
  // Check if assignedto corresponds to a Staff
  const isStaff = await Staff.exists({ _id: assignedtoId })

  // Check if assignedto corresponds to an Admin
  const isAdmin = await Admin.exists({ _id: assignedtoId })
  if (isStaff) {
    assignedtoModel = "Staff"
  } else if (isAdmin) {
    assignedtoModel = "Admin"
  }
  try {
    if (role === "Staff") {
      const updateQuery = {
        $set: {
          assignedtoModel,
          assignedto,
          ...userData, // Other fields to update
          permissionLevel: [userlevelPermission] // Wrap in an array as per schema
        }
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
      if (profileUrl.length > 0) {
        updateQuery.$set.profileUrl = profileUrl
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
    const token = generateToken(res, user._id)
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
export const Getadminpanelcount = async (req, res) => {
  try {
    const { quarter, month, year } = req.query

    let startDate
    let endDate
    let timeFrame
    if (year && month === "null" && quarter === "null") {
      timeFrame = "yearly"
      const now = new Date();
      const month = now.getMonth(); // 0-based (0 = Jan)
      const date = now.getDate();

      // Construct new date with query year and today's month/day

      startDate = new Date(year, 0, 1)
      endDate = new Date(year, month, date);
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(23, 59, 59, 999)
    } else if (year && month && quarter === "null") {
      timeFrame = "monthly"
      const now = new Date();

      const date = now.getDate();
      const numericYear = Number(year) || now.getFullYear(); // fallback if year is missing

      startDate = new Date(numericYear, month, 1); // First day of current month
      endDate = new Date(numericYear, month, date); // Current day of current month
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(23, 59, 59, 999)
    } else if (year && month === "null" && quarter) {
      timeFrame = "quarterly"
      const numericYear = Number(year) || new Date().getFullYear();
      const quarterNum = Number(quarter);

      // Define start and end months for the quarter
      const quarterStartMonth = (quarterNum - 1) * 3; // 0-based (0 = Jan)
      const quarterEndMonth = quarterStartMonth + 2;

      // First day of the quarter
      startDate = new Date(numericYear, quarterStartMonth, 1);
      startDate.setHours(0, 0, 0, 0);

      // Last day of the quarter (set to last day of the quarterEndMonth)
      endDate = new Date(numericYear, quarterEndMonth + 1, 0); // day 0 of next month = last day of current
      endDate.setHours(23, 59, 59, 999);
    }

    const leaveStats = await LeaveRequest.aggregate([
      {
        $match: {
          leaveDate: { $gte: startDate, $lte: endDate }
        }
      },
      { $group: { _id: "$userId", totalLeaves: { $sum: 1 } } },
      { $sort: { totalLeaves: -1 } }
    ])
    const onsiteStats = await Onsite.aggregate([
      {
        $match: {
          onsiteDate: { $gte: startDate, $lte: endDate }
        }
      },
      { $group: { _id: "$userId", totalOnsite: { $sum: 1 } } },
      { $sort: { totalOnsite: -1 } }
    ])
    const leadStats = await LeadMaster.aggregate([
      {
        $match: {
          leadDate: { $gte: startDate, $lte: endDate }
        }
      },
      { $group: { _id: "$leadBy", totalLead: { $sum: 1 } } }
    ])

    const callstatus = await getYearlyStaffPerformance(year, timeFrame, month, quarter)
    const highestLeave = leaveStats[0]
    const lowestLeave = leaveStats[leaveStats.length - 1]
    const highestOnsite = onsiteStats[0]
    const lowestOnsite = onsiteStats[onsiteStats.length - 1]
    const highestLead = leadStats[0]
    const lowestLead = leadStats[leadStats.length - 1]
    // Fetch the staff names using their _id
    const [
      highestLeaveStaff,
      lowestLeaveStaff,
      highestOnsiteStaff,
      lowestOnsiteStaff,
      highestLeadStaff,
      lowestLeadStaff
    ] = await Promise.all([
      highestLeave ? Staff.findById(highestLeave._id).select("name") : null,
      lowestLeave ? Staff.findById(lowestLeave._id).select("name") : null,
      highestOnsite ? Staff.findById(highestOnsite._id).select("name") : null,
      lowestOnsite ? Staff.findById(lowestOnsite._id).select("name") : null,
      highestLead ? Staff.findById(highestLead._id).select("name") : null,
      lowestLead ? Staff.findById(lowestLead._id).select("name") : null
    ])

    // Construct final output
    const result = {
      highestLeave: {
        name: highestLeaveStaff?.name || "",
        count: highestLeave?.totalLeaves,
        title: "Most Leave "
      },
      lowestLeave: {
        name: lowestLeaveStaff?.name || "",
        count: lowestLeave?.totalLeaves,
        title: "Least Leave "
      },
      highestOnsite: {
        name: highestOnsiteStaff?.name || "",
        count: highestOnsite?.totalOnsite,
        title: "Most Onsite"
      },
      lowestOnsite: {
        name: lowestOnsiteStaff?.name || "",
        count: lowestOnsite?.totalOnsite,
        title: "Least Onsite"
      },
      highestLead: {
        name: highestLeadStaff?.name || "",
        count: highestLead?.totalLead,
        title: "Most Lead"
      },
      lowestLead: {
        name: lowestLeadStaff?.name || "",
        title: "Least Lead",
        count: lowestLead?.totalLead
      },
      highestCall: {
        name: callstatus.topCallStaff.staffInfo.name,
        title: "Higest Call",
        count: callstatus?.topCallStaff?.solvedCount
      },
      lowestCall: {
        name: callstatus.leastCallStaff.staffInfo.name,
        title: "Lowest Call",
        count: callstatus?.leastCallStaff?.solvedCount
      }
    }
    return res.status(201).json({
      message: "found counts",
      data: result
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const getYearlyStaffPerformance = async (year, frame, month, quarter) => {
  return await getStaffSolvedCallCounts({
    timeFrame: frame,
    year: year,
    month,
    quarter,
    limit: 15
  })
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
export const GetAllstaffs = async (req, res) => {
  try {
    const allstaffs = await Staff.find({ role: "Staff" }).select("name")
    if (allstaffs && allstaffs.length > 0) {
      return res.status(200).json({ message: "staffs found", data: allstaffs })
    } else {
      return res
        .status(200)
        .json({ message: "no staffs found", data: allstaffs })
    }
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const GetallUsers = async (req, res) => {
  try {
    const allusers = await Staff.find({ isVerified: true })
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
    const { selectedid, attendanceId } = req.query

    if (!selectedid && !attendanceId) {
      return res
        .status(400)
        .json({ message: "Selected ID and attendanceId is required" })
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
        attendanceId: Number(attendanceId),
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

  const objectId = new mongoose.Types.ObjectId(selectedid)
  const assignedTo = new mongoose.Types.ObjectId(assignedto)

  const {
    leaveDate,

    leaveType,
    leaveCategory,
    reason,
    prevCategory,
    halfDayPeriod,
    leaveId = null
  } = formData

  try {


    const existingDateLeave = await LeaveRequest.find({

      leaveDate,
      userId: objectId
    })
    const filteredLeave = existingDateLeave?.filter((leave) => leave._id.equals(leaveId))


    if (filteredLeave && filteredLeave.length) {
      if (existingDateLeave.some((item) => item.leaveType === "Half Day") && leaveType === "Full Day") {
        if (existingDateLeave.length > 1) {
          return res.status(201).json({ message: "Cannot change to Full Day leave as there is already a Half Day leaves for this date!!" })
        }


      }
      if (
        prevCategory &&
        formData.leaveCategory &&
        prevCategory === "compensatory Leave" &&
        prevCategory !== formData.leaveCategory
      ) {
        let remainingToAdd =
          filteredLeave[0].leaveType === "Full Day" ? 1 : 0.5
        const year = new Date(filteredLeave[0].leaveDate).getFullYear()

        const compensatoryLeaves = await CompensatoryLeave.find({
          userId: filteredLeave[0].userId,
          year,
          value: { $lt: 1 }
        }).sort({ value: -1 })
        for (const leave of compensatoryLeaves) {
          const current = leave.value ?? 0
          const spaceLeft = 1 - current

          const addNow = Math.min(spaceLeft, remainingToAdd)
          leave.value = current + addNow
          leave.leaveUsed = leave.value < 1 ? true : false
          await leave.save()

          remainingToAdd -= addNow
          if (remainingToAdd <= 0) break
        }
      } else if (
        prevCategory &&
        formData.leaveCategory &&
        prevCategory === "compensatory Leave" &&
        prevCategory === formData.leaveCategory
      ) {
        const existingValue =
          filteredLeave[0].leaveType === "Full Day" ? 1 : 0.5
        const currentValue = leaveType === "Full Day" ? 1 : 0.5

        if (existingValue > currentValue) {
          //change from full day to half day add value  on compensatory leave
          const year = new Date(existingDateLeave.leaveDate).getFullYear()
          let remainingToAdd = currentValue
          const compensatoryLeaves = await CompensatoryLeave.find({
            userId: filteredLeave[0].userId,
            year,
            value: { $lt: 1 }
          }).sort({ value: -1 })
          for (const leave of compensatoryLeaves) {
            const current = leave.value ?? 0
            const spaceLeft = 1 - current

            const addNow = Math.min(spaceLeft, remainingToAdd)
            leave.value = current + addNow
            leave.leaveUsed = leave.value < 1 ? true : false
            await leave.save()

            remainingToAdd -= addNow
            if (remainingToAdd <= 0) break
          }
        } else if (existingValue < currentValue) {
          //change from half day to  full day substract value on compensatory leave
          const year = new Date(filteredLeave[0].leaveDate).getFullYear()
          const leaveValue = existingValue
          const compensatoryLeave = await CompensatoryLeave.find({
            userId: filteredLeave[0].userId,
            value: { $gt: 0 },
            year
          }).sort({ createdAt: 1 })
          let remaining = leaveValue
          for (const comp of compensatoryLeave) {
            if (remaining <= 0) break
            const deduct = Math.min(comp.value, remaining)
            comp.value -= deduct
            remaining -= deduct
            await comp.save()
          }
        }
      } else if (
        prevCategory &&
        formData.leaveCategory &&
        formData.leaveCategory === "compensatory Leave" &&
        formData.leaveCategory !== prevCategory
      ) {
        const year = new Date(existingDateLeave.leaveDate).getFullYear()
        const leaveValue = leaveType === "Full Day" ? 1 : 0.5
        const compensatoryLeave = await CompensatoryLeave.find({
          userId: filteredLeave[0].userId,
          value: { $gt: 0 },
          year
        }).sort({ createdAt: 1 })
        let remaining = leaveValue
        for (const comp of compensatoryLeave) {
          if (remaining <= 0) break
          const deduct = Math.min(comp.value, remaining)
          comp.value -= deduct
          remaining -= deduct
          comp.leaveUsed = true
          await comp.save()
        }
      }

      const updatedLeave = await LeaveRequest.findByIdAndUpdate(
        filteredLeave[0]._id, // Use the existing leave's ID
        {
          leaveDate, // Update fields with formData
          leaveType,
          ...(leaveType === "Half Day" && { halfDayPeriod }),
          leaveCategory,
          reason,

          userId: objectId,
          assignedto: assignedTo
        },
        { new: true } // Return the updated document
      )
      if (updatedLeave) {
        return res
          .status(200)
          .json({ message: "leave updated", data: updatedLeave })
      }
    } else {
      const checkexistingLeave = await LeaveRequest.find({

        leaveDate,
        userId: objectId
      })

      if (checkexistingLeave) {
        if (checkexistingLeave.some((item) => item.leaveType === "Full Day")) {
          return res.status(201).json({ message: "A full-day leave already exists on this date. You cannot apply for a new one." })
        } else if (checkexistingLeave.some((item) => item.leaveType === "Half Day") && leaveType === "Full Day") {
          return res.status(201).json({ message: "A Half-day leave already exists on this date. You cannot apply a full day for a new one." })
        }

      }

      const newleave = new LeaveRequest({
        leaveDate,
        leaveType,
        ...(leaveType === "Half Day" && { halfDayPeriod }),

        reason,
        leaveCategory,

        userId: objectId,
        assignedto: assignedTo
      })
      await newleave.save()

      if (leaveCategory === "compensatory Leave") {
        const year = new Date(leaveDate).getFullYear()
        const leaveValue = leaveType === "Full Day" ? 1 : 0.5
        const compensatoryLeave = await CompensatoryLeave.find({
          userId: objectId,
          value: { $gt: 0 },
          year
        }).sort({ createdAt: 1 })
        let remaining = leaveValue
        for (const comp of compensatoryLeave) {
          if (remaining <= 0) break
          const deduct = Math.min(comp.value, remaining)
          comp.value -= deduct
          remaining -= deduct
          comp.leaveUsed = true
          await comp.save()
        }
      }
      const allleaves = await LeaveRequest.find({ userId: objectId })

      return res
        .status(200)
        .json({ message: "leave applied successfully", data: allleaves })
    }
  } catch (error) {
    console.log("error:", error.message)
    res.status(500).json({ message: "internal server error" })
  }
}
export const mergeonsite = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find({ onsite: true })

    if (leaveRequests.length === 0) {
      console.log("❌ No onsite leave requests found.")

      return
    }

    // Transform and save each document into the Onsite collection
    const onsiteRecords = leaveRequests.map((record) => ({
      userId: record.userId,
      assignedto: record.assignedto,
      onsiteDate: record.leaveDate,
      onsiteType: record.leaveType,
      ...(record.leaveType === "Half Day" && {
        halfDayPeriod: record.halfDayPeriod
      }),
      description: record.description,
      onsite: record.onsite,
      onsitestatus: record.onsitestatus,
      onsiteData: record.onsiteData,
      adminverified: record.adminverified,
      departmentverified: record.departmentverified,
      departmentstatus: record.departmentstatus,
      hrstatus: record.hrstatus,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt
    }))

    // Insert into the new Onsite collection
    const a = await Onsite.insertMany(onsiteRecords)
    if (a) {
      return res.status(200).json({ message: "sucesss", data: a })
    }
  } catch (error) {
    console.log("error", error)
    return res.status(500).json({ message: "Internal server error" })
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
export const OnsiteApply = async (req, res) => {
  try {
    const { selectedid, assignedto, compensatoryLeave } = req.query

    const { formData, tableRows } = req.body
    const onsiteObjectId = new mongoose.Types.ObjectId(formData.onsiteId)
    const checkForthisonsiteusedforCompensatoryleave = await CompensatoryLeave.findOne({ onsiteId: onsiteObjectId, leaveUsed: true })
    if (checkForthisonsiteusedforCompensatoryleave) {
      return res.status(201).json({ message: "Cant make date change compensatory for this onsite taken" })
    }

    const selectedObjectId = new mongoose.Types.ObjectId(selectedid)
    const assignedObjectId = new mongoose.Types.ObjectId(assignedto)

    if (!tableRows) {
      return res.status(404).json({ message: "no table content" })
    }
    const { onsiteDate, onsiteType, description, halfDayPeriod } = formData

    const existingOnsite = await Onsite.findOne({
      onsiteDate,
      userId: selectedObjectId
    })

    if (existingOnsite) {
      // Merge existing and current onsiteData
      let updatedOnsiteData = tableRows.map((newEntry) => {
        // Check if entry exists in old data
        const existingEntry = existingOnsite.onsiteData?.find(
          (oldEntry) =>
            oldEntry.siteName === newEntry.siteName &&
            oldEntry.place === newEntry.place
        )

        return existingEntry ? { ...existingEntry, ...newEntry } : newEntry
      })
      const formerLeaveType = existingOnsite.onsiteType
      const currentLeaveType = onsiteType

      if (formerLeaveType === "Full Day" && currentLeaveType === "Half Day") {
        const year = new Date(onsiteDate).getFullYear()

        const compensatoryLeave = await CompensatoryLeave.find({
          userId: selectedid,
          value: { $gt: 0 },
          year
        }).sort({ createdAt: 1 })
        if (compensatoryLeave.length === 0) {
          return res.status(409).json({
            message:
              "You can't edit this — a full-day compensatory leave has already been taken for this site"
          })
        }
        let ValueReduced = 0.5
        for (const comp of compensatoryLeave) {
          if (ValueReduced <= 0) break
          const deduct = Math.min(comp.value, ValueReduced)
          comp.value -= deduct
          comp.leaveUsed = comp.value === 0 ? true : comp.leaveUsed
          ValueReduced -= deduct
          await comp.save()
        }
      } else if (
        formerLeaveType === "Half Day" &&
        currentLeaveType === "Full Day"
      ) {
        let ValueAdded = 0.5
        const year = new Date(onsiteDate).getFullYear()

        const compensatoryLeaves = await CompensatoryLeave.find({
          userId: selectedid,
          year,
          value: { $lt: 1 }
        }).sort({ value: -1 })
        for (const leave of compensatoryLeaves) {
          const current = leave.value ?? 0
          const spaceLeft = 1 - current

          const addNow = Math.min(spaceLeft, ValueAdded)
          leave.value = current + addNow
          leave.leaveUsed = leave.value < 1
          await leave.save()

          ValueAdded -= addNow
          if (ValueAdded <= 0) break
        }
      }

      // Update record
      const updatedOnsite = await Onsite.findOneAndUpdate(
        {
          onsiteDate,
          userId: selectedObjectId
        },
        {
          onsiteType,
          ...(onsiteType === "Half Day" && { halfDayPeriod }),
          description,
          assignedto: assignedObjectId,
          onsiteData: updatedOnsiteData // Update onsite data
        },
        { new: true }
      )
      if (updatedOnsite) {
        ////replace with correct compensatory leave
        return res.status(200).json({ message: "Onsite updated" })
      }
    } else {
      // If no existing record, create a new one
      const onsitedata = new Onsite({
        onsiteDate,
        onsiteType,
        ...(onsiteType === "Half Day" && { halfDayPeriod }),
        description,
        userId: selectedObjectId,
        assignedto: assignedObjectId
      })
      if (tableRows) {
        onsitedata.onsiteData.push(tableRows)
      }
      const successonsite = await onsitedata.save()
      if (compensatoryLeave === "true") {
        const year = new Date(onsiteDate).getFullYear()

        const compensatoryleaveapply = new CompensatoryLeave({
          year,
          userId: selectedid,
          onsiteId: successonsite._id,
          value: onsiteType === "Full Day" ? 1 : 0.5
        })
        await compensatoryleaveapply.save()
      }
      if (successonsite) {
        return res.status(200).json({ message: "onsite  applied success" })
      }
    }
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}

export const GetsomeAll = async (req, res, yearParam = {}, monthParam = {}) => {
  try {
    const { year, month } = req.query || { year: yearParam, month: monthParam }

    function getSundays(year, month) {
      const sundays = []
      const date = new Date(year, month - 1, 1) // Start from the 1st day of the month

      while (date.getMonth() === month - 1) {

        if (date.getDay() === 0) {
          // 0 represents Sunday
          sundays.push(date.getDate()) // Get only the day (1-31)
        }
        date.setDate(date.getDate() + 1) // Move to the next day
      }

      return sundays
    }
    function generateMonthDates(year, month) {
      const dates = {}
      const daysInMonth = new Date(year, month, 0).getDate()

      for (let day = 1;day <= daysInMonth;day++) {
        let date = new Date(year, month - 1, day)

        let dateKey =
          date.getFullYear() +
          "-" +
          String(date.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(date.getDate()).padStart(2, "0")

        dates[dateKey] = {
          inTime: "",
          outTime: "",
          present: 0,
          late: "",
          onsite: [],
          early: "",
          reason: "",
          description: "",
          halfDayperiod: "",
          notMarked: 1,
          casualLeave: "",
          privileageLeave: "",
          compensatoryLeave: "",
          otherLeave: "",
          leaveDetails: {}
        } // Initialize empty object for each date
      }

      return dates
    }

    //
    const getMidTime = (startTime, endTime) => {
      const convertToMinutes = (timeString) => {
        const [time, period] = timeString.split(" ")
        let [hours, minutes] = time.split(":").map(Number)

        if (period === "PM" && hours !== 12) hours += 12
        if (period === "AM" && hours === 12) hours = 0

        return hours * 60 + minutes // Convert to total minutes
      }

      const convertToTimeString = (totalMinutes) => {
        let hours = Math.floor(totalMinutes / 60)
        let minutes = (totalMinutes % 60).toString().padStart(2, "0")
        const period = hours >= 12 ? "PM" : "AM"

        if (hours > 12) hours -= 12
        if (hours === 0) hours = 12

        return `${hours}:${minutes} ${period}`
      }

      const startMinutes = convertToMinutes(startTime)
      const endMinutes = convertToMinutes(endTime)
      const midMinutes = Math.floor((startMinutes + endMinutes) / 2)

      return convertToTimeString(midMinutes)
    }

    const sundays = getSundays(year, month)
    const sundayFulldate = createDates(sundays, month, year)
    const startDate = new Date(Date.UTC(year, month - 1, 1))
    const endDate = new Date(Date.UTC(year, month, 0))

    const users = await Staff.aggregate([
      {
        $match: {
          isVerified: true
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          attendanceId: 1,
          assignedto: 1,
          casualleavestartsfrom: { $ifNull: ["$casualleavestartsfrom", null] },
          sickleavestartsfrom: { $ifNull: ["$sickleavestartsfrom", null] },
          privilegeleavestartsfrom: {
            $ifNull: ["$privilegeleavestartsfrom", null]
          }
        }
      }
    ])

    const convertToMinutes = (timeStr) => {
      const [time, modifier] = timeStr.split(" ")
      let [hours, minutes] = time.split(":").map(Number)

      if (modifier === "PM" && hours !== 12) hours += 12 // Convert PM times correctly
      if (modifier === "AM" && hours === 12) hours = 0 // Midnight case

      return hours * 60 + minutes // Return total minutes since midnight
    }
    const leavemaster = await Leavemaster.find({})
    const latecuttingCount = leavemaster[0].deductSalaryMinute
    const addMinutesToTime = (timeString, minutesToAdd) => {
      // Convert to Date object
      const [time, period] = timeString.split(" ")
      let [hours, minutes] = time.split(":").map(Number)

      // Convert to 24-hour format
      if (period === "PM" && hours !== 12) hours += 12
      if (period === "AM" && hours === 12) hours = 0

      // Add minutes
      const newDate = new Date(2000, 0, 1, hours, minutes + minutesToAdd)

      // Convert back to 12-hour format
      let newHours = newDate.getHours()
      const newMinutes = newDate.getMinutes().toString().padStart(2, "0")
      const newPeriod = newHours >= 12 ? "PM" : "AM"

      if (newHours > 12) newHours -= 12
      if (newHours === 0) newHours = 12

      return `${newHours}:${newMinutes} ${newPeriod}`
    }

    function createDates(b, month, year) {
      return b.map((day) => {
        const date = new Date(year, month - 1, day)
        const yyyy = date.getFullYear() // Full year (4 digits)
        const mm = String(date.getMonth() + 1).padStart(2, "0") // Add leading zero
        const dd = String(date.getDate()).padStart(2, "0") // Add leading zero
        return `${yyyy}-${mm}-${dd}` // Full year format
      })
    }

    const morning = addMinutesToTime(
      leavemaster[0].checkIn,
      leavemaster[0].lateArrival
    )
    const evening = leavemaster[0].checkOut
    const noonTime = getMidTime(leavemaster[0].checkIn, leavemaster[0].checkOut)

    const morningLimit = convertToMinutes(morning)

    const lateLimit = convertToMinutes(leavemaster[0].checkInEndAt)
    const minOutTime = convertToMinutes(leavemaster[0].checkOutStartAt)
    const earlyLeaveLimit = convertToMinutes(leavemaster[0].checkOut)

    const noonLimit = convertToMinutes(noonTime)

    let staffAttendanceStats = []
    const holidays = await Holymaster.find({
      holyDate: {
        $gte: startDate,
        $lt: endDate
      }
    })

    const holiday = Array.isArray(holidays)
      ? holidays.map((date) => date.holyDate.getDate())
      : []

    for (const user of users) {
      const userId = user._id
      const attendanceId = user.attendanceId
      const userName = user.name
      const staffId = user.attendanceId
      const assignedto = user.assignedto
      const casualleavestartsfrom = user.casualleavestartsfrom
      const sickleavestartsfrom = user.sickleavestartsfrom
      const privilegeleavestartsfrom = user.privilegeleavestartsfrom

      // Fetch attendance-related data for the given month
      const results = await Promise.allSettled([
        Attendance.find({
          userId,
          attendanceDate: { $gte: startDate, $lte: endDate }
        }),
        Onsite.find({ userId, onsiteDate: { $gte: startDate, $lte: endDate } }),
        LeaveRequest.find({
          userId,
          leaveDate: { $gte: startDate, $lte: endDate }
        })
      ])

      const attendances =
        results[0].status === "fulfilled" ? results[0].value || [] : []
      const onsites =
        results[1].status === "fulfilled" ? results[1].value || [] : []
      const leaves =
        results[2].status === "fulfilled" ? results[2].value || [] : []

      let stats = {
        name: userName,
        casualleavestartsfrom,
        sickleavestartsfrom,
        privilegeleavestartsfrom,
        staffId,
        attendanceId,
        assignedto,
        userId: userId,
        present: 0,
        absent: 0,
        latecutting: 0,
        late: 0,
        earlyGoing: 0,
        halfDayLeave: 0,
        fullDayLeave: 0,
        onsite: 0,
        holiday: 0,
        notMarked: 0,
        attendancedates: generateMonthDates(year, month)
      }

      let daysInMonth = new Set(
        [...Array(endDate.getDate()).keys()].map((i) => i + 1)
      )
      function getTimeDifference(start, end) {
        // Convert times to Date objects using 12-hour format
        const startTime = new Date(`1970-01-01 ${start}`)
        const endTime = new Date(`1970-01-01 ${end}`)

        if (isNaN(startTime) || isNaN(endTime)) {
          return "Invalid date format"
        }

        // Calculate difference in minutes
        const differenceInMinutes = (endTime - startTime) / (1000 * 60)
        return differenceInMinutes >= 0
          ? differenceInMinutes
          : differenceInMinutes + 1440
      }

      const arr = []
      const present = []
      const fulldayarr = []
      const halfdayarr = []

      attendances?.length &&
        attendances?.forEach((att) => {
          const day = att.attendanceDate.getDate()
          const dayTime = att.attendanceDate.toISOString().split("T")[0]

          const punchIn = att.inTime ? convertToMinutes(att.inTime) : null
          const punchOut = att.outTime ? convertToMinutes(att.outTime) : null

          stats.attendancedates[dayTime].inTime = att?.inTime
          stats.attendancedates[dayTime].outTime = att?.outTime
          const isOnsite =
            Array.isArray(onsites) &&
            onsites.some(
              (o) =>
                o.onsiteDate.toISOString().split("T")[0] === dayTime &&
                (o.departmentverified === true || o.adminverified === true)
            )

          const onsiteRecord = Array.isArray(onsites)
            ? onsites.find(
              (o) =>
                o.onsiteDate.toISOString().split("T")[0] === dayTime &&
                (o.departmentverified === true || o.adminverified === true)
            )
            : null

          const onsiteDetails = onsiteRecord
            ? {
              onsiteData: onsiteRecord.onsiteData,
              onsiteType: onsiteRecord.onsiteType,
              halfDayPeriod:
                onsiteRecord.onsiteType === "Half Day"
                  ? onsiteRecord.halfDayPeriod
                  : null
            }
            : null

          const isLeave =
            Array.isArray(leaves) &&
            leaves.some(
              (l) =>
                l.leaveDate.toISOString().split("T")[0] === dayTime &&
                l.onsite === false &&
                (l.departmentverified === true || l.adminverified === true)
            )
          const leaveRecord = Array.isArray(leaves)
            ? leaves.find(
              (l) =>
                l.leaveDate.toISOString().split("T")[0] === dayTime &&
                l.onsite === false &&
                (l.departmentverified === true || l.adminverified === true)
            )
            : null

          const leaveDetails = leaveRecord
            ? {
              _id: leaveRecord._id,
              leaveDate: leaveRecord.leaveDate,
              leaveType: leaveRecord.leaveType,
              halfDayPeriod:
                leaveRecord.leaveType === "Half Day"
                  ? leaveRecord.halfDayPeriod
                  : null,
              leaveCategory: leaveRecord?.leaveCategory || null,
              reason: leaveRecord?.reason || null
            }
            : null

          if (!punchIn || !punchOut) {
            arr.push(day)

            stats.attendancedates[dayTime].notMarked = 1
            if (isOnsite && onsiteDetails.onsiteType === "Full Day") {
              stats.attendancedates[dayTime].present = 1
              stats.attendancedates[dayTime].notMarked = ""
              stats.onsite++
            } else if (isOnsite && onsiteDetails.onsiteType === "Half Day") {
              stats.attendancedates[dayTime].present = 0.5
              stats.attendancedates[dayTime].notMarked = 0.5
            }
            if (isLeave && leaveDetails.leaveType === "Full Day") {
              if (leaveDetails.leaveCategory) {
                switch (leaveDetails.leaveCategory) {
                  case "casual Leave":
                    stats.attendancedates[dayTime].casualLeave = 1
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails

                    break
                  case "other Leave":
                    stats.attendancedates[dayTime].otherLeave = 1
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails

                    break
                  case "privileage Leave":
                    stats.attendancedates[dayTime].privileageLeave = 1
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails

                    break
                  case "compensatory Leave":
                    stats.attendancedates[dayTime].compensatoryLeave = 1
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  default:
                    stats.attendancedates[dayTime].otherLeave = 1 // Default case
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                }
              } else {
                stats.attendancedates[dayTime].otherLeave = 1
                stats.attendancedates[dayTime].reason = leaveDetails.reason
                stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
              }
              stats.attendancedates[dayTime].notMarked = ""
            } else if (isLeave && leaveDetails.leaveType === "Half Day") {
              if (leaveDetails.leaveCategory) {
                switch (leaveDetails.leaveCategory) {
                  case "casual Leave":
                    stats.attendancedates[dayTime].casualLeave = 0.5
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].halfDayperiod =
                      leaveDetails.halfDayPeriod
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails

                    break
                  case "other Leave":
                    stats.attendancedates[dayTime].otherLeave = 0.5
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].halfDayperiod =
                      leaveDetails.halfDayPeriod
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  case "privileage Leave":
                    stats.attendancedates[dayTime].privileageLeave = 0.5
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].halfDayperiod =
                      leaveDetails.halfDayPeriod
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  case "compensatory Leave":
                    stats.attendancedates[dayTime].compensatoryLeave = 0.5
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].halfDayperiod =
                      leaveDetails.halfDayPeriod
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  default:
                    stats.attendancedates[dayTime].otherLeave = 0.5
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].halfDayperiod =
                      leaveDetails.halfDayPeriod // Default case
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                }
              } else {
                stats.attendancedates[dayTime].otherLeave = 0.5

                stats.attendancedates[dayTime].reason = leaveDetails.reason
                stats.attendancedates[dayTime].halfDayperiod =
                  leaveDetails.halfDayPeriod
                stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
              }
              stats.attendancedates[dayTime].notMarked = 0.5
            }
          } else if (punchIn <= morningLimit && punchOut >= earlyLeaveLimit) {
            stats.attendancedates[dayTime].present = 1
            stats.attendancedates[dayTime].inTime = att.inTime
            stats.attendancedates[dayTime].outTime = att.outTime
            stats.attendancedates[dayTime].notMarked = ""

            if (isOnsite && onsiteDetails.onsiteType === "Full Day") {
              stats.onsite++
            } else if (isOnsite && onsiteDetails.onsiteType === "Half Day") {
              stats.onsite += 0.5
            }
          } else if (
            punchIn >= morningLimit &&
            punchIn <= lateLimit &&
            punchOut >= earlyLeaveLimit
          ) {
            const a = getTimeDifference(morning, att.inTime)

            stats.attendancedates[dayTime].late = a
            stats.late++
            stats.attendancedates[dayTime].present = 1
            stats.attendancedates[dayTime].inTime = att.inTime
            stats.attendancedates[dayTime].outTime = att.outTime
            stats.attendancedates[dayTime].notMarked = ""
            if (isOnsite && onsiteDetails.onsiteType === "Full Day") {
              stats.onsite++
            } else if (isOnsite && onsiteDetails.onsiteType === "Half Day") {
              stats.onsite += 0.5
            }
            present.push(day)
          } else if (
            punchOut >= minOutTime &&
            punchOut < earlyLeaveLimit &&
            punchIn <= morningLimit
          ) {
            const b = getTimeDifference(att.outTime, evening)
            stats.attendancedates[dayTime].present = 1
            stats.attendancedates[dayTime].early = b
            stats.attendancedates[dayTime].inTime = att.inTime
            stats.attendancedates[dayTime].outTime = att.outTime
            stats.attendancedates[dayTime].notMarked = ""
            stats.earlyGoing++
            if (isOnsite && onsiteDetails.onsiteType === "Full Day") {
              stats.onsite++
            } else if (isOnsite && onsiteDetails.onsiteType === "Half Day") {
              stats.onsite += 0.5
            }
            present.push(day)
          } else if (
            punchIn <= lateLimit &&
            punchIn > morningLimit &&
            punchOut >= minOutTime &&
            punchOut < earlyLeaveLimit
          ) {
            const a = getTimeDifference(morning, att.inTime)
            const b = getTimeDifference(att.outTime, evening)
            stats.earlyGoing++
            stats.late++
            stats.attendancedates[dayTime].present = 1
            stats.attendancedates[dayTime].inTime = att.inTime
            stats.attendancedates[dayTime].outTime = att.outTime
            stats.attendancedates[dayTime].notMarked = ""
            stats.attendancedates[dayTime].early = b
            stats.attendancedates[dayTime].late = a
            if (isOnsite && onsiteDetails.onsiteType === "Full Day") {
              stats.onsite++
            } else if (isOnsite && onsiteDetails.onsiteType === "Half Day") {
              stats.onsite += 0.5
            }
          } else if (
            (punchIn < noonLimit && punchOut < noonLimit) ||
            (punchIn > noonLimit && punchOut > noonLimit) ||
            (punchIn > lateLimit &&
              punchIn < noonLimit &&
              punchOut < minOutTime &&
              punchOut > noonLimit)
          ) {
            stats.attendancedates[dayTime].notMarked = 1
            if (isOnsite && onsiteDetails.onsiteType === "Full Day") {
              stats.onsite++
              stats.attendancedates[dayTime].present = 1
              stats.attendancedates[dayTime].notMarked = ""
            } else if (isOnsite && onsiteDetails.onsiteType === "Half Day") {
              stats.onsite += 0.5
              stats.attendancedates[dayTime].present = 0.5
              stats.attendancedates[dayTime].notMarked = 0.5
            }
            ///
            fulldayarr.push(day)
            if (isLeave && leaveDetails.leaveType === "Full Day") {
              if (leaveDetails.leaveCategory) {
                switch (leaveDetails.leaveCategory) {
                  case "casual Leave":
                    stats.attendancedates[dayTime].casualLeave = 1
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    stats.attendancedates[dayTime].leaveId = leaveDetails.leaveId
                    break
                  case "other Leave":
                    stats.attendancedates[dayTime].otherLeave = 1
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    stats.attendancedates[dayTime].leaveId = leaveDetails.leaveId
                    break
                  case "privileage Leave":
                    stats.attendancedates[dayTime].privileageLeave = 1
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    stats.attendancedates[dayTime].leaveId = leaveDetails.leaveId
                    break
                  case "compensatory Leave":
                    stats.attendancedates[dayTime].compensatoryLeave = 1
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    stats.attendancedates[dayTime].leaveId = leaveDetails.leaveId
                    break
                  default:
                    stats.attendancedates[dayTime].otherLeave = 1 // Default case
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    stats.attendancedates[dayTime].leaveId = leaveDetails.leaveId
                    break
                }
              } else {
                stats.attendancedates[dayTime].otherLeave = 1
                stats.attendancedates[dayTime].reason = leaveDetails.reason
                stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                stats.attendancedates[dayTime].leaveId = leaveDetails.leaveId
              }
              stats.attendancedates[dayTime].notMarked = ""
            } else if (isLeave && leaveDetails.leaveType === "Half Day") {
              if (leaveDetails.leaveCategory) {
                switch (leaveDetails.leaveCategory) {
                  case "casual Leave":
                    stats.attendancedates[dayTime].casualLeave = 0.5
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].halfDayperiod =
                      leaveDetails.halfDayPeriod
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  case "other Leave":
                    stats.attendancedates[dayTime].otherLeave = 0.5
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].halfDayperiod =
                      leaveDetails.halfDayPeriod
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  case "privileage Leave":
                    stats.attendancedates[dayTime].privileageLeave = 0.5

                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].halfDayperiod =
                      leaveDetails.halfDayPeriod
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  case "compensatory Leave":
                    stats.attendancedates[dayTime].compensatoryLeave = 0.5
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].halfDayperiod =
                      leaveDetails.halfDayPeriod
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  default:
                    stats.attendancedates[dayTime].otherLeave = 0.5
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].halfDayperiod =
                      leaveDetails.halfDayPeriod // Default case
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                }
              } else {
                stats.attendancedates[dayTime].otherLeave = 0.5
                stats.attendancedates[dayTime].reason = leaveDetails.reason
                stats.attendancedates[dayTime].halfDayperiod =
                  leaveDetails.halfDayPeriod
                stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
              }
              stats.attendancedates[dayTime].notMarked = 0.5
            }
          } else if (
            (punchIn == lateLimit &&
              punchOut >= noonLimit &&
              punchOut < minOutTime) ||
            (punchIn <= noonLimit &&
              punchOut == minOutTime &&
              punchIn > lateLimit)
          ) {
            stats.attendancedates[dayTime].present = 0.5
            stats.attendancedates[dayTime].notMarked = 0.5
            if (isOnsite && onsiteDetails.onsiteType === "Full Day") {
              stats.onsite++
              stats.attendancedates[dayTime].present = 1
              stats.attendancedates[dayTime].notMarked = ""
            } else if (isOnsite && onsiteDetails.onsiteType === "Half Day") {
              if (
                punchIn == lateLimit &&
                punchOut >= noonLimit &&
                onsiteDetails.halfDayPeriod === "Afternoon"
              ) {
                stats.onsite += 0.5
                stats.attendancedates[dayTime].present = 1
                stats.attendancedates[dayTime].notMarked = ""
              } else if (
                punchIn == lateLimit &&
                punchOut >= noonLimit &&
                onsiteDetails.halfDayPeriod === "Morning"
              ) {
                stats.onsite += 0.5
              } else if (
                punchIn <= noonLimit &&
                punchOut >= minOutTime &&
                onsiteDetails.halfDayPeriod === "Morning"
              ) {
                stats.onsite += 0.5
                stats.attendancedates[dayTime].present = 1
                stats.attendancedates[dayTime].notMarked = ""
              }
            }
          } else if (
            (punchIn < lateLimit &&
              punchOut >= noonLimit &&
              punchOut < minOutTime) ||
            (punchIn <= noonLimit &&
              punchOut >= earlyLeaveLimit &&
              punchIn > lateLimit)
          ) {
            arr.push(day)
            halfdayarr.push(day)
            stats.attendancedates[dayTime].present = 0.5
            stats.attendancedates[dayTime].notMarked = 0.5
            if (isOnsite && onsiteDetails.onsiteType === "Full Day") {
              stats.onsite++
              stats.attendancedates[dayTime].present = 1
              stats.attendancedates[dayTime].notMarked = ""
            } else if (isOnsite && onsiteDetails.onsiteType === "Half Day") {
              if (
                punchIn < lateLimit &&
                punchOut >= noonLimit &&
                onsiteDetails.halfDayPeriod === "Afternoon"
              ) {
                stats.onsite += 0.5
                stats.attendancedates[dayTime].present = 1
                stats.attendancedates[dayTime].notMarked = ""
              } else if (
                punchIn < lateLimit &&
                punchOut >= noonLimit &&
                onsiteDetails.halfDayPeriod === "Morning"
              ) {
                stats.onsite += 0.5
              } else if (
                punchIn <= noonLimit &&
                punchOut >= earlyLeaveLimit &&
                onsiteDetails.halfDayPeriod === "Afternoon"
              ) {
                stats.onsite += 0.5
              } else if (
                punchIn <= noonLimit &&
                punchOut >= earlyLeaveLimit &&
                onsiteDetails.halfDayPeriod === "Morning"
              ) {
                stats.onsite += 0.5
                stats.attendancedates[dayTime].present = 1
                stats.attendancedates[dayTime].notMarked = ""
              }
            }

            if (isLeave && leaveDetails.leaveType === "Full Day") {
              if (leaveDetails.leaveCategory) {
                switch (leaveDetails.leaveCategory) {
                  case "casual Leave":
                    stats.attendancedates[dayTime].casualLeave = 1
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    stats.attendancedates[dayTime].leaveId = leaveDetails.
                      break
                  case "other Leave":
                    stats.attendancedates[dayTime].otherLeave = 1
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  case "privileage Leave":
                    stats.attendancedates[dayTime].privileageLeave = 1
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  case "compensatory Leave":
                    stats.attendancedates[dayTime].compensatoryLeave = 1
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  default:
                    stats.attendancedates[dayTime].otherLeave = 1 // Default case
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                }
              } else {
                stats.attendancedates[dayTime].otherLeave = 1
                stats.attendancedates[dayTime].reason = leaveDetails.reason
                stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
              }
              stats.attendancedates[dayTime].notMarked = ""
            } else if (isLeave && leaveDetails.leaveType === "Half Day") {
              if (leaveDetails.leaveCategory) {
                switch (leaveDetails.leaveCategory) {
                  case "casual Leave":
                    stats.attendancedates[dayTime].casualLeave = 0.5
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].halfDayperiod =
                      leaveDetails.halfDayPeriod
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  case "other Leave":
                    stats.attendancedates[dayTime].otherLeave = 0.5
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].halfDayperiod =
                      leaveDetails.halfDayPeriod
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  case "privileage Leave":
                    stats.attendancedates[dayTime].privileageLeave = 0.5

                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].halfDayperiod =
                      leaveDetails.halfDayPeriod
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  case "compensatory Leave":
                    stats.attendancedates[dayTime].compensatoryLeave = 0.5
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].halfDayperiod =
                      leaveDetails.halfDayPeriod
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  default:
                    stats.attendancedates[dayTime].otherLeave = 0.5
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].halfDayperiod =
                      leaveDetails.halfDayPeriod // Default case
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                }
              } else {
                stats.attendancedates[dayTime].otherLeave = 0.5
                stats.attendancedates[dayTime].reason = leaveDetails.reason
                stats.attendancedates[dayTime].halfDayperiod =
                  leaveDetails.halfDayPeriod
                stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
              }
              stats.attendancedates[dayTime].notMarked = ""
            }
          }
          daysInMonth.delete(day)
        })

      onsites?.length &&
        onsites?.forEach((onsite) => {
          const onsiteDate = onsite.onsiteDate.toISOString().split("T")[0]

          const isAttendance =
            Array.isArray(attendances) &&
            attendances.some(
              (o) => o.attendanceDate.toISOString().split("T")[0] === onsiteDate
            )
          if (
            Array.isArray(onsite.onsiteData) &&
            (onsite.adminverified === true ||
              onsite.departmentverified === true)
          ) {
            onsite.onsiteData.flat().forEach((item) => {
              stats.attendancedates[onsiteDate].onsite.push({
                place: item?.place,
                siteName: item?.siteName,
                onsiteType: onsite?.onsiteType,
                halfDayPeriod:
                  onsite?.onsiteType === "Half Day"
                    ? onsite?.halfDayPeriod
                    : null,
                description: onsite?.description
              })
            })
          }

          if (
            !isAttendance &&
            (onsite.adminverified === true ||
              onsite.departmentverified === true)
          ) {
            if (onsite.onsiteType === "Full Day") {
              stats.attendancedates[onsiteDate].present = 1
              stats.attendancedates[onsiteDate].notMarked = ""
              stats.onsite++
            } else if (onsite.onsiteType === "Half Day") {
              stats.attendancedates[onsiteDate].present = 0.5
              stats.attendancedates[onsiteDate].notMarked = 0.5
            }
          }
        })

      leaves?.length &&
        leaves.forEach((leave) => {
          const leaveDate = leave.leaveDate.toISOString().split("T")[0]

          const leaveCategory = leave?.leaveCategory

          const isAttendance =
            Array.isArray(attendances) &&
            attendances.some(
              (o) => o.attendanceDate.toISOString().split("T")[0] === leaveDate
            )

          if (!isAttendance) {
            if (
              leave.leaveType === "Full Day" &&
              leave.onsite === false &&
              (leave.adminverified === true ||
                leave.departmentverified === true)
            ) {
              if (leaveCategory) {
                switch (leaveCategory) {
                  case "casual Leave":
                    stats.attendancedates[leaveDate].casualLeave = 1
                    stats.attendancedates[leaveDate].reason = leave.reason
                    stats.attendancedates[leaveDate].leaveDetails[leave._id] = leave
                    // stats.attendancedates[leaveDate].leaveId.leadId = leave._id
                    break
                  case "other Leave":
                    stats.attendancedates[leaveDate].otherLeave = 1
                    stats.attendancedates[leaveDate].reason = leave.reason
                    // stats.attendancedates[leaveDate].leaveId = leave._id
                    stats.attendancedates[leaveDate].leaveDetails[leave._id] = leave
                    // stats.attendancedates[leaveDate].leaveId.leadId = leave._id
                    break
                  case "privileage Leave":
                    stats.attendancedates[leaveDate].privileageLeave = 1
                    stats.attendancedates[leaveDate].reason = leave.reason
                    // stats.attendancedates[leaveDate].leaveId = leave._id
                    stats.attendancedates[leaveDate].leaveDetails[leave._id] = leave
                    // stats.attendancedates[leaveDate].leaveId.leadId = leave._id
                    break
                  case "compensatory Leave":
                    stats.attendancedates[leaveDate].compensatoryLeave = 1
                    stats.attendancedates[leaveDate].reason = leave.reason
                    // stats.attendancedates[leaveDate].leaveId = leave._id
                    stats.attendancedates[leaveDate].leaveDetails[leave._id] = leave
                    // stats.attendancedates[leaveDate].leaveId.leadId = leave._id
                    break
                  default:
                    stats.attendancedates[leaveDate].otherLeave = 1 // Default case
                    stats.attendancedates[leaveDate].reason = leave.reason
                    stats.attendancedates[leaveDate].leaveDetails[leave._id] = leave
                    break
                }
              } else {
                stats.attendancedates[leaveDate].otherLeave = 1
                stats.attendancedates[leaveDate].reason = leave.reason
                stats.attendancedates[leaveDate].leaveDetails[leave._id] = leave
              }

              stats.attendancedates[leaveDate].notMarked = ""
            } else if (
              leave.leaveType === "Half Day" &&
              leave.onsite === false &&
              (leave.adminverified === true ||
                leave.departmentverified === true)
            ) {
              if (leaveCategory) {
                switch (leaveCategory) {
                  case "casual Leave":
                    stats.attendancedates[leaveDate].casualLeave = (stats.attendancedates[leaveDate].casualLeave || 0) + 0.5
                    stats.attendancedates[leaveDate].reason = leave.reason
                    stats.attendancedates[leaveDate].halfDayperiod =
                      leave.halfDayPeriod
                    stats.attendancedates[leaveDate].leaveDetails[leave._id] = leave
                    break
                  case "other Leave":
                    stats.attendancedates[leaveDate].otherLeave = (stats.attendancedates[leaveDate].otherLeave || 0) + 0.5
                    stats.attendancedates[leaveDate].reason = leave.reason
                    stats.attendancedates[leaveDate].halfDayperiod =
                      leave.halfDayPeriod
                    stats.attendancedates[leaveDate].leaveDetails[leave._id] = leave
                    break
                  case "privileage Leave":
                    stats.attendancedates[leaveDate].privileageLeave = (stats.attendancedates[leaveDate].privileageLeave || 0) + 0.5
                    stats.attendancedates[leaveDate].reason = leave.reason
                    stats.attendancedates[leaveDate].halfDayperiod =
                      leave.halfDayPeriod
                    stats.attendancedates[leaveDate].leaveDetails[leave._id] = leave
                    break
                  case "compensatory Leave":
                    stats.attendancedates[leaveDate].compensatoryLeave = (stats.attendancedates[leaveDate].compensatoryLeave || 0) + 0.5
                    stats.attendancedates[leaveDate].reason = leave.reason
                    stats.attendancedates[leaveDate].halfDayperiod =
                      leave.halfDayPeriod
                    stats.attendancedates[leaveDate].leaveDetails[leave._id] = leave
                    break
                  default:
                    stats.attendancedates[leaveDate].otherLeave = (stats.attendancedates[leaveDate].otherLeave || 0) + 0.5
                    stats.attendancedates[leaveDate].reason = leave.reason
                    stats.attendancedates[leaveDate].halfDayperiod =
                      leave.halfDayPeriod // Default case
                    stats.attendancedates[leaveDate].leaveDetails[leave._id] = leave
                    break
                }
              } else {
                stats.attendancedates[leaveDate].otherLeave = (stats.attendancedates[leaveDate].otherLeave || 0) + 0.5
                stats.attendancedates[leaveDate].reason = leave.reason
                stats.attendancedates[leaveDate].halfDayperiod =
                  leave.halfDayPeriod
                stats.attendancedates[leaveDate].leaveDetails[leave._id] = leave
              }
              const totalLeave =
                (stats.attendancedates[leaveDate].casualLeave || 0) +
                (stats.attendancedates[leaveDate].otherLeave || 0) +
                (stats.attendancedates[leaveDate].privileageLeave || 0) +
                (stats.attendancedates[leaveDate].compensatoryLeave || 0)

              stats.attendancedates[leaveDate].notMarked = totalLeave > 0.5 ? "" : totalLeave === 0.5 ? 0.5 : totalLeave === 0 ? "" : ""
              // stats.attendancedates[leaveDate].notMarked = (stats.attendancedates[leaveDate].casualLeave + stats.attendancedates[leaveDate].otherLeave + stats.attendancedates[leaveDate].privileageLeave + stats.attendancedates[leaveDate].compensatoryLeave) > 0.5 ? "" : 1
            }
          }
        })


      const uniqueDates = [...new Set([...sundays, ...holiday])]

      const allholidays = createDates(uniqueDates, month, year)

      function getNextDate(dateString) {
        // Parse the date string (YYYY-MM-DD)

        const [year, month, day] = dateString.split("-").map(Number)

        // Create a date object
        const date = new Date(year, month - 1, day)

        // Add one day
        date.setDate(date.getDate() + 1)

        // Format the result back to 'YYYY-MM-DD'
        const nextDay = String(date.getDate()).padStart(2, "0")
        const nextMonth = String(date.getMonth() + 1).padStart(2, "0")
        const nextYear = date.getFullYear() // Full year

        return `${nextYear}-${nextMonth}-${nextDay}`
      }
      function getPreviousDate(dateString) {
        // Parse the date string (YYYY-MM-DD)
        const [year, month, day] = dateString.split("-").map(Number)

        // Create a date object
        const date = new Date(year, month - 1, day)

        // Subtract one day
        date.setDate(date.getDate() - 1)

        // Format the result back to 'YYYY-MM-DD'
        const prevDay = String(date.getDate()).padStart(2, "0")
        const prevMonth = String(date.getMonth() + 1).padStart(2, "0")
        const prevYear = date.getFullYear() // Full year

        return `${prevYear}-${prevMonth}-${prevDay}`
      }
      (async () => {
        async function calculateAbsences(allholidayfulldate, attendances, onsites) {
          const isPresent = async (date) => {
            const attendance = attendances.attendancedates[date];
            if (attendance) {
              if (
                attendance.otherLeave !== "" ||
                attendance.privileageLeave !== "" ||
                attendance.casualLeave !== "" ||
                attendance.compensatoryLeave !== "" ||
                attendance.notMarked !== ""
              ) {
                return {
                  status: false,
                  present: attendance.present,
                  otherLeave: attendance.otherLeave,
                  notMarked: attendance.notMarked
                };
              } else {
                return {
                  status: true,
                  present: attendance.present,
                  notMarked: attendance.notMarked
                };
              }
            } else {
              const previousMonth = month - 1;
              const previousmonthlastdayleavestatus = await PreviousmonthLeavesummary(previousMonth, year, stats.userId);
              if (previousmonthlastdayleavestatus) {
                return { status: false };
              } else {
                return { status: true };
              }
            }
          };

          const sortedHolidays = allholidayfulldate.sort();
          let groups = [];
          let tempGroup = [];

          for (let i = 0;i < sortedHolidays.length;i++) {
            const currDate = new Date(sortedHolidays[i]);
            const prevDate = i > 0 ? new Date(sortedHolidays[i - 1]) : null;

            if (prevDate && currDate - prevDate === 24 * 60 * 60 * 1000) {
              if (!tempGroup.length) tempGroup.push(prevDate);
              tempGroup.push(currDate);
              groups.push(tempGroup);
              tempGroup = [];
            } else {
              tempGroup.push(currDate);
              groups.push(tempGroup);
              tempGroup = [];
            }
          }

          for (const group of groups) {
            const first = group[0];
            const stringfirst = first.toISOString().split("T")[0];
            const last = group[group.length - 1];
            const stringlast = last.toISOString().split("T")[0];

            const previousDay = getPreviousDate(stringfirst);
            const nextDay = getNextDate(stringlast);

            const prevFullPresent = await isPresent(previousDay);
            const nextFullPresent = await isPresent(nextDay);

            if (prevFullPresent?.status || nextFullPresent?.status) {
              if (attendances.attendancedates[stringfirst]) {
                attendances.attendancedates[stringfirst].present = 1;
                attendances.attendancedates[stringfirst].notMarked = "";
              }
              if (attendances.attendancedates[stringlast]) {
                attendances.attendancedates[stringlast].present = 1;
                attendances.attendancedates[stringlast].notMarked = "";
              }
            }
          }
        }

        // ✅ Call the async absence adjustment and wait for it to finish
        await calculateAbsences(allholidays, stats, onsites);

        // ✅ Now safely process stats
        for (const date in stats.attendancedates) {
          const day = stats.attendancedates[date];

          stats.present += day.present || 0;

          const leaveTypes = ["casualLeave", "otherLeave", "privileageLeave", "compensatoryLeave"];

          leaveTypes.forEach((type) => {
            if (!isNaN(day[type])) {
              stats.absent += Number(day[type]);
            }
          });

          stats.notMarked += day.notMarked !== "" ? Number(day.notMarked) : 0;
        }

      })();


      // ; (async function calculateAbsences(allholidayfulldate, attendances, onsites) {
      //   const isPresent = async (date) => {

      //     const attendance = attendances.attendancedates[date]
      //     if (attendance) {
      //       if (
      //         attendance.otherLeave !== "" ||
      //         attendance.privileageLeave !== "" ||
      //         attendance.casualLeave !== "" ||
      //         attendance.compensatoryLeave !== "" ||
      //         attendance.notMarked !== ""
      //       ) {

      //         return {
      //           status: false,
      //           present: attendance.present,
      //           otherLeave: attendance.otherLeave,
      //           notMarked: attendance.notMarked
      //         }
      //       } else {


      //         return {
      //           status: true,
      //           present: attendance.present,
      //           notMarked: attendance.notMarked
      //         }
      //       }
      //     } else {
      //       const previousMonth = month - 1
      //       const previousmonthlastdayleavestatus = await PreviousmonthLeavesummary(previousMonth, year, stats.userId)
      //       if (previousmonthlastdayleavestatus) {
      //         return { status: false }
      //       } else {
      //         return { status: true }
      //       }

      //     }


      //   }
      //   // Sort dates first to ensure they are in order
      //   const sortedHolidays = allholidayfulldate.sort()


      //   // Find groups of consecutive holidays
      //   let groups = []
      //   let tempGroup = []

      //   for (let i = 0;i < sortedHolidays.length;i++) {
      //     const currDate = new Date(sortedHolidays[i])
      //     const prevDate = i > 0 ? new Date(sortedHolidays[i - 1]) : null

      //     if (
      //       prevDate &&
      //       currDate - prevDate === 24 * 60 * 60 * 1000 // 1 day gap
      //     ) {
      //       if (!tempGroup.length) tempGroup.push(prevDate)
      //       tempGroup.push(currDate)
      //       groups.push(tempGroup)
      //       tempGroup = []
      //     } else {
      //       tempGroup.push(currDate)
      //       groups.push(tempGroup)
      //       tempGroup = []
      //     }
      //   }

      //   for (const group of groups) {
      //     const first = group[0]
      //     const stringfirst = first.toISOString().split("T")[0]
      //     const last = group[group.length - 1]
      //     const stringlast = last.toISOString().split("T")[0]

      //     const previousDay = getPreviousDate(stringfirst)
      //     const nextDay = getNextDate(stringlast)

      //     const prevFullPresent = await isPresent(previousDay)
      //     // if (stats.name === "Aleena Thadevues") {

      //     //   console.log(stringfirst, prevFullPresent.status)
      //     // }

      //     const nextFullPresent = await isPresent(nextDay)

      //     if (prevFullPresent?.status || nextFullPresent?.status) {

      //       stats.attendancedates[stringfirst].present = 1

      //       stats.attendancedates[stringlast].present = 1
      //       stats.attendancedates[stringlast].notMarked = ""
      //       // stats.attendancedates[nextDay].otherLeave = 1
      //       stats.attendancedates[stringfirst].notMarked = ""

      //     }

      //   }


      // })(allholidays, stats, onsites)



      // for (const date in stats.attendancedates) {
      //   const day = stats.attendancedates[date]

      //   stats.present += day.present || 0

      //   // Sum all leave types
      //   const leaveTypes = [
      //     "casualLeave",
      //     "otherLeave",
      //     "privileageLeave",
      //     "compensatoryLeave"
      //   ]

      //   leaveTypes.forEach((type) => {
      //     if (!isNaN(day[type])) {
      //       stats.absent += Number(day[type])
      //     }
      //   })

      //     stats.notMarked += day.notMarked !== "" ? Number(day.notMarked) : 0

      // }


      const combined = stats.earlyGoing + stats.late
      stats.latecutting =
        Math.floor(combined / (latecuttingCount * 2)) * 1 +
        (Math.floor(combined / latecuttingCount) % 2) * 0.5

      stats.present -=
        Math.floor(combined / (latecuttingCount * 2)) * 1 +
        (Math.floor(combined / latecuttingCount) % 2) * 0.5

      staffAttendanceStats.push(stats)
    }
    const listofHolidays = holidays.map((item) => ({
      date: item.holyDate.toISOString().split("T")[0],
      holyname: item.customTextInput
    }))
    return res.status(200).json({
      message: "Attendence report found",
      data: { staffAttendanceStats, listofHolidays, sundayFulldate }

    })
  } catch (error) {
    console.log("error", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}

export const GetAllAttendance = async (req, res) => {
  try {
    const { userid, year, month } = req.query // Extract userid from query parameters
    if (year && month) {
      const startDate = new Date(Date.UTC(year, month - 1, 1))
      const endDate = new Date(Date.UTC(year, month, 0))
      const attendance = await Attendance.find({
        attendanceDate: { $gte: startDate, $lte: endDate }
      })

      if (attendance) {
        return res
          .status(200)
          .json({ message: "attendance found", data: attendance })
      }
    }

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
export const Getallcompensatoryleave = async (req, res) => {
  try {
    const { userid } = req.query
    const objectId = new mongoose.Types.ObjectId(userid)

    // const compensatoryleave = await CompensatoryLeave.find({ userId: userid })
    const result = await CompensatoryLeave.aggregate([
      { $match: { userId: objectId } },
      { $group: { _id: null, total: { $sum: "$value" } } }
    ])

    const totalCompensatoryLeave = result[0]?.total || 0
    return res.status(200).json({
      message: "compensatoryleaves found",
      data: totalCompensatoryLeave
    })
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const GetallOnsite = async (req, res) => {
  try {
    const { userid } = req.query // Extract userid from query parameters

    const objectId = new mongoose.Types.ObjectId(userid)
    if (!userid) {
      return res.status(400).json({ error: "User ID is required" })
    }

    // Fetch all leave records for the specified userid
    const attendance = await Onsite.find({ userId: objectId })

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
export const GetallUsersLeave = async (req, res) => {
  try {
    const { today } = req.query

    let leavelist
    if (today === "true") {
      const today = new Date()
      today.setHours(0, 0, 0, 0) // 00:00:00 of today

      const tomorrow = new Date(today)
      tomorrow.setDate(today.getDate() + 1) // 00:00:00 of next day

      leavelist = await LeaveRequest.find({
        leaveDate: {
          $gte: today,
          $lt: tomorrow
        }
      })
        .populate("userId", "name") // Populates userId with the name field only
        .lean() // Converts to plain JavaScript objects (instead of Mongoose docs)
      const grouped = {};

      leavelist.forEach((item) => {
        const name = item.userId?.name;
        if (!name) return;

        if (!grouped[name]) {
          grouped[name] = {
            hasFullDay: false,
            hasMorning: false,
            hasAfternoon: false,
          };
        }

        if (item.leaveType === "Full Day") {
          grouped[name].hasFullDay = true;
        } else if (item.leaveType === "Half Day") {
          if (item.halfDayPeriod === "Morning") {
            grouped[name].hasMorning = true;
          }
          if (item.halfDayPeriod === "Afternoon") {
            grouped[name].hasAfternoon = true;
          }
        }
      });
      const result = Object.entries(grouped).map(([name, status]) => {
        if (status.hasFullDay || (status.hasMorning && status.hasAfternoon)) {
          return { name, leaveStatus: "Full Day" };
        }
        if (status.hasMorning) {
          return { name, leaveStatus: "Half Day (Morning)" };
        }
        if (status.hasAfternoon) {
          return { name, leaveStatus: "Half Day (Afternoon)" };
        }
        return { name, leaveStatus: "Unknown" };
      });

      if (result) {
        return res
          .status(200)
          .json({ message: "leaves found", data: result })
      } else {
        return res
          .status(200)
          .json({ message: "no leaves found for today", data: result })
      }
    }
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const GetallCurrentMonthbirthDay = async (req, res) => {
  try {
    const currentMonth = new Date().toISOString().slice(5, 7) // "04"

    const staffbirthdays = await Staff.find({
      isVerified: true,
      dateofbirth: { $regex: `^\\d{4}-${currentMonth}` }
    }) // Matches "YYYY-04"})
    const adminbirthdays = await Admin.find({
      dateofbirth: { $regex: `^\\d{4}-${currentMonth}` }
    })

    const currentmonthBirthDays = [...staffbirthdays, ...adminbirthdays].map(
      (item) => ({
        name: item.name,
        dateofbirth: item.dateofbirth,
        profileUrl: item.profileUrl
      })
    )

    if (currentmonthBirthDays && currentmonthBirthDays.length > 0) {
      return res.status(200).json({
        message: "current month birthdays found",
        data: currentmonthBirthDays
      })
    } else {
      return res.status(200).json({
        message: "no birthdays found for current month",
        data: currentmonthBirthDays
      })
    }
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const GetallusersOnsite = async (req, res) => {
  try {
    const { today } = req.query

    if (today === "true") {
      const today = new Date()
      today.setHours(0, 0, 0, 0) // 00:00:00 of today

      const tomorrow = new Date(today)
      tomorrow.setDate(today.getDate() + 1) // 00:00:00 of next day

      const todayOnsites = await Onsite.find({
        onsiteDate: {
          $gte: today,
          $lt: tomorrow
        }
      })
      if (todayOnsites && todayOnsites.length > 0) {
        return res
          .status(200)
          .json({ message: "todays onsites found", data: todayOnsites })
      } else {
        return res
          .status(200)
          .json({ message: "no onsites found for today", data: todayOnsites })
      }
    }
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const GetallLeave = async (req, res) => {
  const { userid } = req.query // Extract userid from query parameters

  const objectId = new mongoose.Types.ObjectId(userid)

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
export const GetAllpendingORonsiteRequest = async (req, res) => {
  try {
    const startdate = req?.query?.startdate
    const start = new Date(startdate);
    start.setHours(0, 0, 0, 0); // Start of the day
    const enddate = req?.query?.enddate

    const end = new Date(enddate);
    end.setHours(23, 59, 59, 999); // End of the day
    // const startDate = startdate.toString().split("T")[0]
    // const endDate = enddate.toString().split("T")[0]

    const onsite = req?.query?.onsite
    const userid = req?.query?.userid
    const role = req?.query?.role
    let query

    const objectId = new mongoose.Types.ObjectId(userid)

    // Initialize the query with common conditions
    if (onsite === "true") {
      query = {
        onsiteDate: {
          $gte: startdate, // Greater than or equal to startDate
          $lte: enddate // Less than or equal to endDate
        }
      }
    } else if (onsite === "false") {
      ////
      query = {
        leaveDate: {
          $gte: startdate, // Greater than or equal to startDate
          $lte: enddate // Less than or equal to endDate
        }
      }
    }

    // Check if the role is not admin
    if (role !== "Admin") {
      query.assignedto = objectId // Only include assignedto for non-admin users
    }

    if (onsite === "true") {
      const allonsite = await Onsite.find(query).populate({
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

      const pendingonsiteRequest = allonsite.filter(
        (item) =>
          item.departmentverified === false && item.adminverified === false
      )

      if (pendingonsiteRequest) {
        return res
          .status(200)
          .json({ message: "leaves found", data: pendingonsiteRequest })
      }
    } else if (onsite === "false") {
      const allleaveRequest = await LeaveRequest.find(query).populate({
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
      const pendingleaveRequest = allleaveRequest.filter(
        (item) =>
          item.departmentverified === false && item.adminverified === false
      )

      if (pendingleaveRequest) {
        return res
          .status(200)
          .json({ message: "leaves found", data: pendingleaveRequest })
      }
    }

    // Execute the query with population
  } catch (error) {
    console.log("error:", error.message)
  }
}

export const GetAllapprovedORonsiteRequest = async (req, res) => {
  try {
    const startdate = new Date(req.query.startdate) // Convert to Date object
    startdate.setUTCHours(0, 0, 0, 0) // Set to start of the day in UTC

    const enddate = new Date(req.query.enddate) // Convert to Date object
    enddate.setUTCHours(23, 59, 59, 999)
    // Convert to Date object

    if (isNaN(startdate) || isNaN(enddate)) {
      return res.status(400).send({ message: "Invalid date format" })
    }

    const onsite = req?.query?.onsite
    const userid = req?.query?.userid
    const role = req?.query?.role
    let query

    const objectId = new mongoose.Types.ObjectId(userid)

    // Ensure the dates are valid and convert them to ISO format
    // Convert to Date object

    // Check if the dates are valid

    if (onsite === "true") {
      // Initialize the query with common conditions
      query = {
        onsiteDate: {
          $gte: startdate,
          $lte: enddate //ess than or equal to endDate
        }
      }
    } else if (onsite === "false") {
      // Initialize the query with common conditions
      query = {
        leaveDate: {
          $gte: startdate,
          $lte: enddate
        }
      }
    }

    if (onsite === "true") {
      const allonsite = await Onsite.find(query).populate({
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

      const approvedonsiteRequest = allonsite.filter(
        (item) =>
          item.departmentverified === true || item.adminverified === true
      )

      if (approvedonsiteRequest) {
        return res
          .status(200)
          .json({ message: "leaves found", data: approvedonsiteRequest })
      }
    } else if (onsite === "false") {
      const allleaveRequest = await LeaveRequest.find(query).populate({
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

      const approvedleaveRequest = allleaveRequest.filter(
        (item) =>
          item.departmentverified === true || item.adminverified === true
      )

      if (approvedleaveRequest) {
        return res
          .status(200)
          .json({ message: "leaves found", data: approvedleaveRequest })
      }
    }

    // Execute the query with population
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
export const cancelLeaveOrOnsiteApproval = async (req, res) => {
  try {
    const { role, userId, selectedId, startDate, endDate, onsite, name } =
      req.query
    // Validate common parameters
    if (!role || !startDate || !endDate || !onsite) {
      return res
        .status(400)
        .json({ message: "Missing required query parameters." })
    }

    // Extract additional query strings, dynamically handle `selectAll` and `single`

    const isSingle = req?.query?.single === "true"

    // Ensure at least one specific query is provided
    if (!isSingle) {
      return res.status(400).json({
        message: "Missing specific action parameter- single."
      })
    }

    // Convert IDs to ObjectId if provided
    const userObjectId = userId ? new mongoose.Types.ObjectId(userId) : null
    const selectedObjectId = selectedId
      ? new mongoose.Types.ObjectId(selectedId)
      : null
    let baseQuery
    const startdate = new Date(startDate)
    startdate.setHours(0, 0, 0, 0)
    const enddate = new Date(endDate)
    enddate.setHours(23, 59, 59, 999)
    // Base query common to both cases
    if (onsite === "true") {
      baseQuery = {
        onsiteDate: { $gte: startdate, $lte: enddate }
      }
    } else if (onsite === "false") {
      baseQuery = {
        leaveDate: { $gte: startdate, $lte: enddate }
      }
    }

    // Add user-specific filtering for non-admin roles
    else if (role !== "Admin" && userObjectId) {
      baseQuery.assignedto = userObjectId
    }

    // Define role-based update fields
    const updateFields =
      role === "Admin"
        ? {
          hrstatus: "Not Approved",
          adminverified: false
        }
        : {
          departmentstatus: "Not Approved",
          departmentverified: false
        }
    let result
    if (isSingle && onsite === "true") {
      if (!selectedObjectId) {
        return res.status(400).json({
          message: "Missing required parameter: selectedId for cancel request"
        })
      }

      result = await Onsite.updateOne(
        { _id: selectedObjectId },
        { $set: updateFields }
      )
    } else if (isSingle && onsite === "false") {
      if (!selectedObjectId) {
        return res.status(400).json({
          message: "Missing required parameter: selectedId for cancel request"
        })
      }

      result = await LeaveRequest.updateOne(
        { _id: selectedObjectId },
        { $set: updateFields }
      )
    }
    if (result && result.modifiedCount > 0 && onsite === "false") {
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

      const filteredApprovedLeave = updatedLeaveList.filter(
        (item) =>
          item.departmentverified === true || item.adminverified === true
      )

      return res.status(200).json({
        message: `cancel leave approval successfully for ${name}`,
        data: filteredApprovedLeave
      })
    } else if (result && result.modifiedCount > 0 && onsite === "true") {
      // Fetch updated leave requests for display
      const updatedOnsiteList = await Onsite.find(baseQuery).populate({
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
      const filteredApprovedOnsite = updatedOnsiteList.filter(
        (item) =>
          item.departmentverified === true || item.adminverified === true
      )

      return res.status(200).json({
        message: `cancel onsite approval successfully for ${name}`,
        data: filteredApprovedOnsite
      })
    }

    return res
      .status(404)
      .json({ message: "No matching  requests found to update." })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const ApproveLeave = async (req, res) => {
  try {
    const {
      role,
      userId,
      selectedId,
      startDate,
      endDate,
      onsite,
      name,
      isPending
    } = req.query

    // Validate common parameters
    if (!role || !startDate || !endDate || !onsite) {
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
    const startdate = new Date(startDate)
    startdate.setHours(0, 0, 0, 0)
    const enddate = new Date(endDate)
    enddate.setHours(23, 59, 59, 99)
    const baseQuery = {
      leaveDate: { $gte: startdate, $lte: enddate }
    }

    // Add user-specific filtering for non-admin roles
    if (role !== "Admin" && userObjectId) {
      baseQuery.assignedto = userObjectId
    }

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
        if (isPending === "true") {
          const filteredPendingLeave = updatedLeaveList.filter(
            (item) =>
              item.departmentverified === false && item.adminverified === false
          )

          return res.status(200).json({
            message: `All leave Approved successfully for ${name}`,
            data: filteredPendingLeave
          })
        } else if (isPending === "false") {
          const filteredApprovedLeave = updatedLeaveList.filter(
            (item) =>
              item.departmentverified === true || item.adminverified === true
          )

          return res.status(200).json({
            message: `All leave Approved successfully for ${name}`,
            data: filteredApprovedLeave
          })
        }
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
      if (isPending === "true") {
        const filteredPendingLeave = updatedLeaveList.filter(
          (item) =>
            item.departmentverified === false && item.adminverified === false
        )

        return res.status(200).json({
          message: `Leave Approved successfully for ${name}`,
          data: filteredPendingLeave
        })
      } else if (isPending === "false") {
        const filteredApprovedLeave = updatedLeaveList.filter(
          (item) =>
            item.departmentverified === true || item.adminverified === true
        )
        return res.status(200).json({
          message: `Leave Approved successfully for ${name}`,
          data: filteredApprovedLeave
        })
      }
    }

    return res
      .status(404)
      .json({ message: "No matching leave requests found to update." })
  } catch (error) {
    console.error("Error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const ApproveOnsite = async (req, res) => {
  try {
    const {
      role,
      userId,
      selectedId,
      startDate,
      endDate,
      name,
      onsite,
      isPending
    } = req.query
    // return

    // Validate common parameters
    if (!role || !startDate || !endDate || !onsite) {
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
    const startdate = new Date(startDate)
    startdate.setHours(0, 0, 0, 0)
    const enddate = new Date(endDate)
    enddate.setHours(23, 59, 59, 999)
    // Base query common to both cases
    const baseQuery = {
      onsiteDate: { $gte: startdate, $lte: enddate }
    }

    // Add user-specific filtering for non-admin roles
    if (role !== "Admin" && userObjectId) {
      baseQuery.assignedto = userObjectId
    }

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
      result = await Onsite.updateMany(queryForUpdate, {
        $set: updateFields
      })
      // Check if any document was updated
      if (result && result.modifiedCount > 0) {
        // Fetch updated leave requests for display
        const updatedOnsiteList = await Onsite.find(baseQuery).populate({
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
        if (isPending === "true") {
          const filteredPendingOnsite = updatedOnsiteList.filter(
            (item) =>
              item.departmentverified === false && item.adminverified === false
          )

          return res.status(200).json({
            message: `All Onsite approved successfully for ${name}`,
            data: filteredPendingOnsite
          })
        } else if (isPending === "false") {
          const filteredApprovedOnsite = updatedOnsiteList.filter(
            (item) =>
              item.departmentverified === true || item.adminverified === true
          )

          return res.status(200).json({
            message: `All Onsite approved successfully for ${name}`,
            data: filteredApprovedOnsite
          })
        }
      }
    } else if (isSingle) {
      // Handle single case
      if (!selectedObjectId) {
        return res.status(400).json({
          message: "Missing required parameter: selectedId for single update."
        })
      }
      result = await Onsite.updateOne(
        { _id: selectedObjectId },
        { $set: updateFields }
      )
    }

    // Check if any document was updated
    if (result && result.modifiedCount > 0) {
      // Fetch updated leave requests for display
      const updatedOnsiteList = await Onsite.find(baseQuery).populate({
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
      if (isPending === "true") {
        const filteredPendingOnsite = updatedOnsiteList.filter(
          (item) =>
            item.adminverified === false && item.departmentverified === false
        )
        return res.status(200).json({
          message: `Onsite Approved successfully for ${name}`,
          data: filteredPendingOnsite
        })
      } else if (isPending === "false") {
        const filteredApprovedOnsite = updatedOnsiteList.filter(
          (item) =>
            item.adminverified === true || item.departmentverified === true
        )
        return res.status(200).json({
          message: `Onsite Approved successfully for ${name}`,
          data: filteredApprovedOnsite
        })
      }
    }

    return res
      .status(404)
      .json({ message: "No matching onsite requests found to update." })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ message: "Onsite approved" })
  }
}
export const RejectOnsite = async (req, res) => {
  try {
    const role = req?.query?.role
    const selectedId = req?.query?.selectedId
    const userId = req?.query?.userId
    const feild = req?.query.feild
    const startdate = req?.query?.startdate

    const enddate = req?.query?.enddate
    // Ensure the dates are valid and convert them to ISO format
    const startDate = new Date(startdate) // Convert to Date object
    startDate.setHours(0, 0, 0, 0)

    const endDate = new Date(enddate) // Convert to Date object
    endDate.setHours(23, 59, 59, 99)

    const selectedObjectId = new mongoose.Types.ObjectId(selectedId)
    const userObjectId = new mongoose.Types.ObjectId(userId)

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" })
    }

    const matchedonsiteRequest = await Onsite.findOne({
      _id: selectedObjectId
    })
    const matchedCompensatoryLeave = await CompensatoryLeave.findOne({
      onsiteId: matchedonsiteRequest
    }).populate({ path: "userId", select: "name" })
    if (matchedCompensatoryLeave?.leaveUsed) {
      return res.status(409).json({
        message: `Cannot delete this onsite entry.${matchedCompensatoryLeave?.userId?.name}  earned a leave for  this site`
      })
    }

    const deletedOnsiteRequest = await Onsite.deleteOne({
      _id: selectedObjectId
    })

    if (deletedOnsiteRequest.deletedCount === 0) {
      return res.status(404).json({ message: "No onsite request found to delete" })
    } else if (deletedOnsiteRequest.deletedCount > 0) {
      const query = {
        onsiteDate: {
          $gte: startDate, // Greater than or equal to startDate
          $lte: endDate // Less than or equal to endDate
        }
      }

      // Check if the role is not admin
      if (role !== "Admin") {
        query.assignedto = userObjectId // Only include assignedto for non-admin users
      }

      // Execute the query with population
      const onsiteList = await Onsite.find(query).populate({
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
      let filteredlist
      if (feild === "pendingOnsite") {
        filteredlist = onsiteList.filter(
          (onsite) =>
            onsite.departmentverified === false &&
            onsite.adminverified === false
        )
        return res.status(200).json({
          message: "onsite request deleted successfully",
          data: filteredlist
        })
      } else if (feild === "approvedOnsite") {
        filteredlist = onsiteList.filter(
          (onsite) =>
            onsite.departmentverified === true || onsite.adminverified === true
        )
        return res.status(200).json({
          message: "onsite request deleted successfully",
          data: filteredlist
        })
      }
    }
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}

export const RejectLeave = async (req, res) => {
  try {
    const leaveCategory = req?.query?.leaveCategory

    const role = req?.query?.role
    const selectedId = req?.query?.selectedId
    const userId = req?.query?.userId
    const feild = req?.query?.feild
    const startdate = req?.query?.startdate

    const enddate = req?.query?.enddate
    // Ensure the dates are valid and convert them to ISO format
    const startDate = new Date(startdate) // Convert to Date object
    startDate.setHours(0, 0, 0, 0)
    const endDate = new Date(enddate) // Convert to Date object
    endDate.setHours(23, 59, 59, 999)

    const selectedObjectId = new mongoose.Types.ObjectId(selectedId)
    const userObjectId = new mongoose.Types.ObjectId(userId)
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" })
    }

    const matchedleaveRequest = await LeaveRequest.findOne({
      _id: selectedObjectId
    })
    const deletedLeaveRequest = await LeaveRequest.deleteOne({
      _id: selectedObjectId
    })

    if (deletedLeaveRequest.deletedCount === 0) {
      return res.status(404).json({ message: "Leave request not found" })
    } else if (deletedLeaveRequest.deletedCount > 0) {
      if (matchedleaveRequest && leaveCategory === "compensatory Leave") {
        let remainingToAdd =
          matchedleaveRequest.leaveType === "Full Day" ? 1 : 0.5

        const year = new Date(matchedleaveRequest.leaveDate).getFullYear()

        const compensatoryLeaves = await CompensatoryLeave.find({
          userId: matchedleaveRequest.userId,
          year,
          value: { $lt: 1 }
        }).sort({ value: -1 })
        for (const leave of compensatoryLeaves) {
          const current = leave.value ?? 0
          const spaceLeft = 1 - current

          const addNow = Math.min(spaceLeft, remainingToAdd)
          leave.value = current + addNow
          leave.leaveUsed = leave.value < 1 ? true : false

          await leave.save()

          remainingToAdd -= addNow
          if (remainingToAdd <= 0) break
        }
      }
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
      let filteredlist
      if (feild === "pendingLeave") {
        filteredlist = leaveList.filter(
          (leave) =>
            leave.departmentverified === false && leave.adminverified === false
        )
        return res.status(200).json({
          message: "Leave request deleted successfully",
          data: filteredlist
        })
      } else if (feild === "approvedLeave") {
        filteredlist = leaveList.filter(
          (leave) =>
            leave.departmentverified === true && leave.adminverified === true
        )
        return res.status(200).json({
          message: "Leave request deleted successfully",
          data: filteredlist
        })
      }
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

export const GetStaffCallList = async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    // Fetch staff details
    const staff = await Staff.find()
    const a = await Staff.find().select("name _id callstatus.totalCall").lean()
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

    if (staff) {
      return res.status(200).json({
        message: "Staff found",
        data: { staff, userCallsCount, a }
      })
    }
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}

export const GetindividualStaffCall = async (req, res) => {
  try {
    // const { startDate } = req.query
    const startDate = new Date("2024-11-16T00:00:00.000Z")
    return res.status(200).json({ message: "no data", data: [] })
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

    const allpopulate = await Promise.all(
      populatedCalls.map(async (item) => {
        // Loop over callregistration (async inside map — better use for...of)
        for (const items of item.callregistration) {
          try {
            // Ensure attendedBy is an array
            if (Array.isArray(items.formdata.attendedBy)) {
              items.formdata.attendedBy = await Promise.all(
                items.formdata.attendedBy.map(async (attended) => {
                  const user = await Staff.findById(attended.callerId).select("name");
                  return { callerId: user?.name };
                })
              );
            } else {
              items.formdata.attendedBy = [];
            }

            // Ensure completedBy is an array
            if (Array.isArray(items.formdata.completedBy)) {
              items.formdata.completedBy = await Promise.all(
                items.formdata.completedBy.map(async (completed) => {
                  const user = await Staff.findById(completed.callerId).select("name");
                  return { callerId: user?.name };
                })
              );
            } else {
              items.formdata.completedBy = [];
            }
          } catch (error) {
            console.log("error:", error)

          }

        }

        // Return modified item
        return item;
      })
    );


    if (calls) {
      // Respond with the filtered call data
      return res
        .status(200)
        .json({ message: "Matched calls found", data: allpopulate })
    }
  } catch (error) {
    console.error("Error fetching staff call data:", error)
    return res
      .status(500)
      .json({ message: "An error occurred while fetching data." })
  }
}
export const UpdateLeaveSummary = async (req, res) => {
  try {
    const { userid } = req.query
    const formData = req.body

    const { editDate, ...dynamicDateDetails } = formData
    const dynamicDateKey = Object.keys(dynamicDateDetails)[0] // Get the key, e.g. '2025-02-01'
    const details = dynamicDateDetails[dynamicDateKey]
    // Define which fields belong to which collection
    const fieldMappings = {
      leave: ["leaveCategory"],
      attendance: ["inTime", "outTime"],
      onsite: ["onsiteType", "halfDayPeriod"]
    }

    const getUpdatedFields = async (collection, fields, dateFeild) => {
      const existingRecord = await collection.findOne({
        userId: userid,
        [dateFeild]: editDate
      })
      if (!existingRecord) return {} // No existing record means nothing to update

      const updatedFields = {}
      fields.forEach((key) => {
        if (
          details[key] !== undefined &&
          (!Object.hasOwn(existingRecord, key) ||
            existingRecord[key] !== details[key])
        ) {
          updatedFields[key] = details[key]
        }
      })

      return updatedFields
    }
    // Get updates for each collection
    const leaveUpdates = await getUpdatedFields(
      LeaveRequest,
      fieldMappings.leave,
      "leaveDate"
    )
    const attendanceUpdates = await getUpdatedFields(
      Attendance,
      fieldMappings.attendance,
      "attendanceDate"
    )
    const onsiteUpdates = await getUpdatedFields(
      Onsite,
      fieldMappings.onsite,
      "onsiteDate"
    )

    // Perform updates only if necessary
    const updateOperations = []

    if (Object.keys(leaveUpdates).length) {
      updateOperations.push(
        LeaveRequest.updateOne(
          { userId: userid, leaveDate: editDate },
          { $set: leaveUpdates }
        )
      )
    }

    if (Object.keys(attendanceUpdates).length) {
      updateOperations.push(
        Attendance.updateOne(
          { userid, attendanceDate: editDate },
          { $set: attendanceUpdates }
        )
      )
    }

    if (Object.keys(onsiteUpdates).length) {
      updateOperations.push(
        Onsite.updateOne(
          { userid, onsiteDate: editDate },
          { $set: onsiteUpdates }
        )
      )
    }

    // Execute all updates in parallel
    await Promise.all(updateOperations)
    return res.status(200).json({ message: "update succesfully" })
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const EditOnsite = async (req, res) => {
  try {
    const { userid } = req.query
    const formData = req.body
    const { onsiteDate, ...updatedFeild } = formData

    const dateObj = new Date(onsiteDate)

    // Extract year and month (without leading zero)
    const year = dateObj.getFullYear() // "2025"
    const month = dateObj.getMonth() + 1
    const result = await Onsite.findOneAndUpdate(
      { userId: userid, onsiteDate: formData.onsiteDate }, // Find criteria
      { $set: updatedFeild }, // Update only selected fields
      { new: true } // Return updated document
    )
    if (result) {
      const fakeReq = { query: { year, month } }

      const a = await GetsomeAllsummary(fakeReq, res)
      if (a) {
        return res.status(200).json({ message: "onsite updated", data: a })
      }
    }
  } catch (error) {
    console.log("error", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const EditLeave = async (req, res) => {
  try {
    const { userid, assignedto } = req.query

    const formData = req.body

    const {
      leaveType,
      halfDayPeriod,
      leaveDate,
      leaveCategory,
      prevCategory,
      reason,
      leaveId = null
    } = formData

    const dateObj = new Date(leaveDate)
    const year = dateObj.getFullYear() // "2025"
    const month = dateObj.getMonth() + 1
    if (!userid && !assignedto && !formData) {
      return res
        .status(400)
        .json({ message: "id or something is missing while updating" })
    }

    const userobjectId = new mongoose.Types.ObjectId(userid)
    const assignedtoObjectId = new mongoose.Types.ObjectId(assignedto)


    const existingDateLeave = await LeaveRequest.find({
      leaveDate,
      userId: userobjectId
    })

    const filteredLeave = existingDateLeave?.filter((leave) => leave._id.equals(leaveId))

    if (filteredLeave && filteredLeave.length) {


      if (existingDateLeave.some((item) => item.leaveType === "Half Day") && leaveType === "Full Day") {
        if (existingDateLeave.length > 1) {
          return res.status(201).json({ message: "Cannot change to Full Day leave as there is already a Half Day leaves for this date!!" })
        }


      }
      // If a leave exists, update the document with the current formData
      if (
        prevCategory &&
        formData.leaveCategory &&
        prevCategory === "compensatory Leave" &&
        prevCategory !== formData.leaveCategory
      ) {
        let remainingToAdd =
          filteredLeave[0].leaveType === "Full Day" ? 1 : 0.5


        const year = new Date(filteredLeave[0].leaveDate).getFullYear()

        const compensatoryLeaves = await CompensatoryLeave.find({
          userId: filteredLeave[0].userId,
          year,
          value: { $lt: 1 }
        }).sort({ value: -1 })
        for (const leave of compensatoryLeaves) {
          const current = leave.value ?? 0
          const spaceLeft = 1 - current

          const addNow = Math.min(spaceLeft, remainingToAdd)
          leave.value = current + addNow

          await leave.save()

          remainingToAdd -= addNow
          if (remainingToAdd <= 0) break
        }
      } else if (
        prevCategory &&
        formData.leaveCategory &&
        prevCategory === "compensatory Leave" &&
        prevCategory === formData.leaveCategory
      ) {
        const existingValue =
          filteredLeave[0].leaveType === "Full Day" ? 1 : 0.5
        const currentValue = leaveType === "Full Day" ? 1 : 0.5

        if (existingValue > currentValue) {
          //change from full day to half day add value  on compensatory leave
          const year = new Date(filteredLeave[0].leaveDate).getFullYear()
          let remainingToAdd = currentValue
          const compensatoryLeaves = await CompensatoryLeave.find({
            userId: filteredLeave[0].userId,
            year,
            value: { $lt: 1 }
          }).sort({ value: -1 })
          for (const leave of compensatoryLeaves) {
            const current = leave.value ?? 0
            const spaceLeft = 1 - current

            const addNow = Math.min(spaceLeft, remainingToAdd)
            leave.value = current + addNow

            await leave.save()

            remainingToAdd -= addNow
            if (remainingToAdd <= 0) break
          }
        } else if (existingValue < currentValue) {
          //change from half day to  full day substract value on compensatory leave

          const leaveValue = existingValue
          const compensatoryLeave = await CompensatoryLeave.find({
            userId: filteredLeave[0].userId,
            value: { $gt: 0 },
            year
          }).sort({ createdAt: 1 })
          let remaining = leaveValue
          for (const comp of compensatoryLeave) {
            if (remaining <= 0) break
            const deduct = Math.min(comp.value, remaining)
            comp.value -= deduct
            remaining -= deduct
            await comp.save()
          }
        }
      } else if (
        prevCategory &&
        formData.leaveCategory &&
        formData.leaveCategory === "compensatory Leave" &&
        formData.leaveCategory !== prevCategory
      ) {
        const year = new Date(filteredLeave[0].leaveDate).getFullYear()
        const leaveValue = leaveType === "Full Day" ? 1 : 0.5
        const compensatoryLeave = await CompensatoryLeave.find({
          userId: userobjectId,
          value: { $gt: 0 },
          year
        }).sort({ createdAt: 1 })
        let remaining = leaveValue
        for (const comp of compensatoryLeave) {
          if (remaining <= 0) break
          const deduct = Math.min(comp.value, remaining)
          comp.value -= deduct
          remaining -= deduct
          comp.leaveUsed = true
          await comp.save()
        }
      }

      const updatedLeave = await LeaveRequest.findByIdAndUpdate(
        filteredLeave[0]._id, // Use the existing leave's ID
        {
          leaveDate, // Update fields with formData
          leaveType,
          ...(leaveType === "Half Day" && { halfDayPeriod }),
          leaveCategory,
          reason,

          userId: userobjectId,
          assignedto: assignedtoObjectId
        },
        { new: true } // Return the updated document
      )
      if (updatedLeave) {
        const fakeReq = { query: { year, month } }

        // Call GetsomeAll with fake req
        const a = await GetsomeAllsummary(fakeReq, res)
        if (a) {
          return res.status(200).json({ message: "leave updated", data: a })
        }
      }
    } else {
      const checkexistingLeave = await LeaveRequest.find({

        leaveDate,
        userId: userobjectId
      })

      if (checkexistingLeave) {
        if (checkexistingLeave.some((item) => item.leaveType === "Full Day")) {
          return res.status(201).json({ message: "A full-day leave already exists on this date. You cannot apply for a new one." })
        } else if (checkexistingLeave.some((item) => item.leaveType === "Half Day")) {

          if (checkexistingLeave.length > 1 || leaveType === "Full Day") {
            return res.status(201).json({ message: `Already have half day leave cant make another ${leaveType} too!.` })
          }


        } else if (checkexistingLeave.some((item) => item.leaveType === "Half Day") && leaveType === "Full Day") {
          return res.status(201).json({ message: "A Half-day leave already exists on this date. You cannot apply a full day for a new one." })
        }

      }
      const leave = new LeaveRequest({
        leaveDate: formData.leaveDate,
        leaveType: formData.leaveType,
        ...(formData.leaveType === "Half Day" && {
          halfDayPeriod: formData.halfDayPeriod
        }),

        reason: formData.reason,
        leaveCategory: formData.leaveCategory,
        userId: userobjectId,
        adminverified: true,

        hrstatus: "HR/Onsite Approved",

        assignedto: assignedtoObjectId
      })
      const savedleave = await leave.save()
      if (leaveCategory === "compensatory Leave") {
        const year = new Date(leaveDate).getFullYear()
        const leaveValue = leaveType === "Full Day" ? 1 : 0.5
        const compensatoryLeave = await CompensatoryLeave.find({
          userId: userobjectId,
          value: { $gt: 0 },
          year
        }).sort({ createdAt: 1 })
        let remaining = leaveValue
        for (const comp of compensatoryLeave) {
          if (remaining <= 0) break
          const deduct = Math.min(comp.value, remaining)
          comp.value -= deduct
          remaining -= deduct
          comp.leaveUsed = true
          await comp.save()
        }
      }
      if (savedleave) {
        const fakeReq = { query: { year, month } }

        // Call GetsomeAll with fake req
        const a = await GetsomeAllsummary(fakeReq, res)
        if (a) {
          return res.status(200).json({ message: "leave updated", data: a })
        }
      }
    }
  } catch (error) {
    console.log("error", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const EditAttendance = async (req, res) => {
  try {
    const { userid, attendanceid } = req.query
    const formData = req.body
    // const { attendanceDate, ...updatedFeild } = formData

    const {
      attendanceDate,
      inTime: { hours: inTimeHours, minutes: inTimeMinutes, amPm: inTimeAmPm },
      outTime: {
        hours: outTimeHours,
        minutes: outTimeMinutes,
        amPm: outTimeAmPm
      }
    } = formData
    const dateObj = new Date(attendanceDate)
    // Merge hours, minutes, and amPm into time strings
    const inTimeString =
      inTimeHours === "00"
        ? ""
        : `${inTimeHours}:${inTimeMinutes} ${inTimeAmPm}`
    const outTimeString =
      outTimeHours === "00"
        ? ""
        : `${outTimeHours}:${outTimeMinutes} ${outTimeAmPm}`
    // Extract year and month (without leading zero)
    const year = dateObj.getFullYear() // "2025"
    const month = dateObj.getMonth() + 1
    const existingAttendance = await Attendance.findOne({
      userId: userid,
      attendanceDate
    })
    if (existingAttendance) {
      // Update existing record with new time data
      existingAttendance.inTime = inTimeString
      existingAttendance.outTime = outTimeString
      existingAttendance.edited = true
      await existingAttendance.save()
      const fakeReq = { query: { year, month } }

      // Call GetsomeAll with fake req
      const a = await GetsomeAllsummary(fakeReq, res)
      if (a) {
        return res.status(200).json({ message: "Attendance updated", data: a })
      }
    } else {
      const saveAttendance = new Attendance({
        userId: userid,

        attendanceId: Number(attendanceid),
        attendanceDate,
        inTime: inTimeString,
        outTime: outTimeString,
        edited: true,
        excel: false
      })
      await saveAttendance.save()
      const fakeReq = { query: { year, month } }

      // Call GetsomeAll with fake req
      const a = await GetsomeAllsummary(fakeReq, res)
      if (a) {
        return res.status(200).json({ message: "Attendance updated", data: a })
      }
    }
  } catch (error) {
    console.log("error", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}

export const GetsomeAllsummary = async (
  req,
  res,
  yearParam = {},
  monthParam = {}
) => {
  try {
    const { year, month } = req.query || { year: yearParam, month: monthParam }

    function getSundays(year, month) {
      const sundays = []
      const date = new Date(year, month - 1, 1) // Start from the 1st day of the month

      while (date.getMonth() === month - 1) {
        if (date.getDay() === 0) {
          // 0 represents Sunday
          sundays.push(date.getDate()) // Get only the day (1-31)
        }
        date.setDate(date.getDate() + 1) // Move to the next day
      }

      return sundays
    }
    function generateMonthDates(year, month) {
      const dates = {}
      const daysInMonth = new Date(year, month, 0).getDate()

      for (let day = 1;day <= daysInMonth;day++) {
        let date = new Date(year, month - 1, day)

        let dateKey =
          date.getFullYear() +
          "-" +
          String(date.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(date.getDate()).padStart(2, "0")

        dates[dateKey] = {
          inTime: "",
          outTime: "",
          present: 0,
          late: "",
          onsite: [],
          early: "",
          halfDayperiod: "",
          notMarked: 1,
          casualLeave: "",
          privileageLeave: "",
          compensatoryLeave: "",
          otherLeave: "",
          leaveDetails: {}
        } // Initialize empty object for each date
      }

      return dates
    }
    const getMidTime = (startTime, endTime) => {
      const convertToMinutes = (timeString) => {
        const [time, period] = timeString.split(" ")
        let [hours, minutes] = time.split(":").map(Number)

        if (period === "PM" && hours !== 12) hours += 12
        if (period === "AM" && hours === 12) hours = 0

        return hours * 60 + minutes // Convert to total minutes
      }

      const convertToTimeString = (totalMinutes) => {
        let hours = Math.floor(totalMinutes / 60)
        let minutes = (totalMinutes % 60).toString().padStart(2, "0")
        const period = hours >= 12 ? "PM" : "AM"

        if (hours > 12) hours -= 12
        if (hours === 0) hours = 12

        return `${hours}:${minutes} ${period}`
      }

      const startMinutes = convertToMinutes(startTime)
      const endMinutes = convertToMinutes(endTime)
      const midMinutes = Math.floor((startMinutes + endMinutes) / 2)

      return convertToTimeString(midMinutes)
    }
    const sundays = getSundays(year, month)

    const startDate = new Date(Date.UTC(year, month - 1, 1))
    const endDate = new Date(Date.UTC(year, month, 0))

    const users = await Staff.aggregate([
      {
        $project: {
          _id: 1,
          name: 1,
          attendanceId: 1,
          assignedto: 1,
          casualleavestartsfrom: { $ifNull: ["$casualleavestartsfrom", null] },
          sickleavestartsfrom: { $ifNull: ["$sickleavestartsfrom", null] },
          privilegeleavestartsfrom: {
            $ifNull: ["$privilegeleavestartsfrom", null]
          }
        }
      }
    ])

    const convertToMinutes = (timeStr) => {
      const [time, modifier] = timeStr.split(" ")
      let [hours, minutes] = time.split(":").map(Number)

      if (modifier === "PM" && hours !== 12) hours += 12 // Convert PM times correctly
      if (modifier === "AM" && hours === 12) hours = 0 // Midnight case

      return hours * 60 + minutes // Return total minutes since midnight
    }
    const leavemaster = await Leavemaster.find({})
    const latecuttingCount = leavemaster[0].deductSalaryMinute
    const addMinutesToTime = (timeString, minutesToAdd) => {
      // Convert to Date object
      const [time, period] = timeString.split(" ")
      let [hours, minutes] = time.split(":").map(Number)

      // Convert to 24-hour format
      if (period === "PM" && hours !== 12) hours += 12
      if (period === "AM" && hours === 12) hours = 0

      // Add minutes
      const newDate = new Date(2000, 0, 1, hours, minutes + minutesToAdd)

      // Convert back to 12-hour format
      let newHours = newDate.getHours()
      const newMinutes = newDate.getMinutes().toString().padStart(2, "0")
      const newPeriod = newHours >= 12 ? "PM" : "AM"

      if (newHours > 12) newHours -= 12
      if (newHours === 0) newHours = 12

      return `${newHours}:${newMinutes} ${newPeriod}`
    }

    function createDates(b, month, year) {
      return b.map((day) => {
        const date = new Date(year, month - 1, day)
        const yyyy = date.getFullYear() // Full year (4 digits)
        const mm = String(date.getMonth() + 1).padStart(2, "0") // Add leading zero
        const dd = String(date.getDate()).padStart(2, "0") // Add leading zero
        return `${yyyy}-${mm}-${dd}` // Full year format
      })
    }

    const morning = addMinutesToTime(
      leavemaster[0].checkIn,
      leavemaster[0].lateArrival
    )
    const noonTime = getMidTime(leavemaster[0].checkIn, leavemaster[0].checkOut)

    const morningLimit = convertToMinutes(morning)
    const lateLimit = convertToMinutes(leavemaster[0].checkInEndAt)
    const minOutTime = convertToMinutes(leavemaster[0].checkOutStartAt)
    const earlyLeaveLimit = convertToMinutes(leavemaster[0].checkOut)
    const noonLimit = convertToMinutes(noonTime)

    let staffAttendanceStats = []
    // const holidays = await Holymaster.find({})
    const holidays = await Holymaster.find({
      holyDate: {
        $gte: startDate,
        $lt: endDate
      }
    })

    const holiday = Array.isArray(holidays)
      ? holidays.map((date) => date.holyDate.getDate())
      : []
    for (const user of users) {
      const userId = user._id
      const userName = user.name
      const attendanceId = user.attendanceId
      const assignedto = user.assignedto
      const staffId = user.attendanceId
      const casualleavestartsfrom = user.casualleavestartsfrom
      const sickleavestartsfrom = user.sickleavestartsfrom
      const privilegeleavestartsfrom = user.privilegeleavestartsfrom

      // Fetch attendance-related data for the given month
      const results = await Promise.allSettled([
        Attendance.find({
          userId,
          attendanceDate: { $gte: startDate, $lte: endDate }
        }),
        Onsite.find({ userId, onsiteDate: { $gte: startDate, $lte: endDate } }),
        LeaveRequest.find({
          userId,
          leaveDate: { $gte: startDate, $lte: endDate }
        }),
        Holymaster.find({ holyDate: { $gte: startDate, $lte: endDate } })
      ])
      const attendances =
        results[0].status === "fulfilled" ? results[0].value || [] : []
      const onsites =
        results[1].status === "fulfilled" ? results[1].value || [] : []
      const leaves =
        results[2].status === "fulfilled" ? results[2].value || [] : []

      const uniqueHolidays = holiday.filter(
        (holiday) => !sundays.includes(holiday)
      )
      let stats = {
        name: userName,
        casualleavestartsfrom,
        sickleavestartsfrom,
        privilegeleavestartsfrom,
        staffId,
        attendanceId,
        assignedto,
        userId: userId,
        present: 0,
        absent: 0,
        latecutting: 0,
        late: 0,
        earlyGoing: 0,
        halfDayLeave: 0,
        fullDayLeave: 0,
        onsite: 0,
        holiday: 0,
        notMarked: 0,
        attendancedates: generateMonthDates(year, month)
      }

      let daysInMonth = new Set(
        [...Array(endDate.getDate()).keys()].map((i) => i + 1)
      )
      function getTimeDifference(start, end) {
        // Convert times to Date objects using 12-hour format
        const startTime = new Date(`1970-01-01 ${start}`)
        const endTime = new Date(`1970-01-01 ${end}`)

        if (isNaN(startTime) || isNaN(endTime)) {
          return "Invalid date format"
        }

        // Calculate difference in minutes
        const differenceInMinutes = (endTime - startTime) / (1000 * 60)
        return differenceInMinutes >= 0
          ? differenceInMinutes
          : differenceInMinutes + 1440
      }

      const arr = []
      const present = []
      const fulldayarr = []
      const halfdayarr = []
      attendances?.length &&
        attendances?.forEach((att) => {
          const day = att.attendanceDate.getDate()
          const dayTime = att.attendanceDate.toISOString().split("T")[0]

          const punchIn = att.inTime ? convertToMinutes(att.inTime) : null
          const punchOut = att.outTime ? convertToMinutes(att.outTime) : null

          stats.attendancedates[dayTime].inTime = att?.inTime
          stats.attendancedates[dayTime].outTime = att?.outTime
          const isOnsite =
            Array.isArray(onsites) &&
            onsites.some(
              (o) =>
                o.onsiteDate.toISOString().split("T")[0] === dayTime &&
                (o.departmentverified === true || o.adminverified === true)
            )

          const onsiteRecord = Array.isArray(onsites)
            ? onsites.find(
              (o) =>
                o.onsiteDate.toISOString().split("T")[0] === dayTime &&
                (o.departmentverified === true || o.adminverified === true)
            )
            : null

          const onsiteDetails = onsiteRecord
            ? {
              onsiteData: onsiteRecord.onsiteData,
              onsiteType: onsiteRecord.onsiteType,
              halfDayPeriod:
                onsiteRecord.onsiteType === "Half Day"
                  ? onsiteRecord.halfDayPeriod
                  : null
            }
            : null

          const isLeave =
            Array.isArray(leaves) &&
            leaves.some(
              (l) =>
                l.leaveDate.toISOString().split("T")[0] === dayTime &&
                l.onsite === false &&
                (l.departmentverified === true || l.adminverified === true)
            )
          const leaveRecord = Array.isArray(leaves)
            ? leaves.find(
              (l) =>
                l.leaveDate.toISOString().split("T")[0] === dayTime &&
                l.onsite === false &&
                (l.departmentverified === true || l.adminverified === true)
            )
            : null

          const leaveDetails = leaveRecord
            ? {
              _id: leaveRecord?._id,
              leaveDate: leaveRecord?.leaveDate,
              leaveType: leaveRecord?.leaveType,
              halfDayPeriod:
                leaveRecord.leaveType === "Half Day"
                  ? leaveRecord.halfDayPeriod
                  : null,
              leaveCategory: leaveRecord?.leaveCategory || null,
              reason: leaveRecord?.reason || ""
            }
            : null

          // const leaveType = leaveRecord ? leaveRecord.leaveType : null

          if (!punchIn || !punchOut) {
            arr.push(day)

            stats.attendancedates[dayTime].notMarked = 1

            if (isOnsite && onsiteDetails.onsiteType === "Full Day") {
              stats.attendancedates[dayTime].present = 1
              stats.attendancedates[dayTime].notMarked = ""
              stats.onsite++
            } else if (isOnsite && onsiteDetails.onsiteType === "Half Day") {
              stats.attendancedates[dayTime].present = 0.5
              stats.attendancedates[dayTime].notMarked = 0.5
            }
            if (isLeave && leaveDetails.leaveType === "Full Day") {
              if (leaveDetails.leaveCategory) {
                switch (leaveDetails.leaveCategory) {
                  case "casual Leave":
                    stats.attendancedates[dayTime].casualLeave = 1
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  case "other Leave":
                    stats.attendancedates[dayTime].otherLeave = 1
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  case "privileage Leave":
                    stats.attendancedates[dayTime].privileageLeave = 1
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  case "compensatory Leave":
                    stats.attendancedates[dayTime].compensatoryLeave = 1
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  default:
                    stats.attendancedates[dayTime].otherLeave = 1 // Default case
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                }
              } else {
                stats.attendancedates[dayTime].otherLeave = 1
                stats.attendancedates[dayTime].reason = leaveDetails.reason
                stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
              }
              stats.attendancedates[dayTime].notMarked = ""
            } else if (isLeave && leaveDetails.leaveType === "Half Day") {
              if (leaveDetails.leaveCategory) {
                switch (leaveDetails.leaveCategory) {
                  case "casual Leave":
                    stats.attendancedates[dayTime].casualLeave = 0.5
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].halfDayperiod =
                      leaveDetails.halfDayPeriod
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  case "other Leave":
                    stats.attendancedates[dayTime].otherLeave = 0.5
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].halfDayperiod =
                      leaveDetails.halfDayPeriod
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  case "privileage Leave":
                    stats.attendancedates[dayTime].privileageLeave = 0.5
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].halfDayperiod =
                      leaveDetails.halfDayPeriod
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  case "compensatory Leave":
                    stats.attendancedates[dayTime].compensatoryLeave = 0.5
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].halfDayperiod =
                      leaveDetails.halfDayPeriod
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  default:
                    stats.attendancedates[dayTime].otherLeave = 0.5
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].halfDayperiod =
                      leaveDetails.halfDayPeriod // Default case
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                }
              } else {
                stats.attendancedates[dayTime].otherLeave = 0.5

                stats.attendancedates[dayTime].reason = leaveDetails.reason
                stats.attendancedates[dayTime].halfDayperiod =
                  leaveDetails.halfDayPeriod
                stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
              }
              stats.attendancedates[dayTime].notMarked = 0.5
            }
          } else if (punchIn <= morningLimit && punchOut >= earlyLeaveLimit) {
            stats.attendancedates[dayTime].present = 1
            stats.attendancedates[dayTime].inTime = att.inTime
            stats.attendancedates[dayTime].outTime = att.outTime
            stats.attendancedates[dayTime].notMarked = ""

            if (isOnsite && onsiteDetails.onsiteType === "Full Day") {
              stats.onsite++
              // stats.attendancedates[dayTime].onsite = 1
            } else if (isOnsite && onsiteDetails.onsiteType === "Half Day") {
              stats.onsite += 0.5
              // stats.attendancedates[dayTime].onsite = 0.5
            }
          } else if (
            punchIn >= morningLimit &&
            punchIn <= lateLimit &&
            punchOut >= earlyLeaveLimit
          ) {
            const a = getTimeDifference("09:35 AM", att.inTime)

            stats.attendancedates[dayTime].late = a
            stats.late++
            stats.attendancedates[dayTime].present = 1
            stats.attendancedates[dayTime].inTime = att.inTime
            stats.attendancedates[dayTime].outTime = att.outTime
            stats.attendancedates[dayTime].notMarked = ""
            if (isOnsite && onsiteDetails.onsiteType === "Full Day") {
              stats.onsite++
              // stats.attendancedates[dayTime].onsite = 1
            } else if (isOnsite && onsiteDetails.onsiteType === "Half Day") {
              stats.onsite += 0.5
              // stats.attendancedates[dayTime].onsite = 0.5
            }
            present.push(day)
          } else if (
            punchOut >= minOutTime &&
            punchOut < earlyLeaveLimit &&
            punchIn <= morningLimit
          ) {
            const b = getTimeDifference(att.outTime, "05:30 PM")
            stats.attendancedates[dayTime].present = 1
            stats.attendancedates[dayTime].early = b
            stats.attendancedates[dayTime].inTime = att.inTime
            stats.attendancedates[dayTime].outTime = att.outTime
            stats.attendancedates[dayTime].notMarked = ""
            stats.earlyGoing++
            if (isOnsite && onsiteDetails.onsiteType === "Full Day") {
              stats.onsite++
              // stats.attendancedates[dayTime].onsite = 1
            } else if (isOnsite && onsiteDetails.onsiteType === "Half Day") {
              stats.onsite += 0.5
              // stats.attendancedates[dayTime].onsite = 0.5
            }
            present.push(day)
          } else if (
            punchIn <= lateLimit &&
            punchIn > morningLimit &&
            punchOut >= minOutTime &&
            punchOut < earlyLeaveLimit
          ) {
            const a = getTimeDifference("09:35 AM", att.inTime)
            const b = getTimeDifference(att.outTime, "05:30 PM")
            stats.earlyGoing++
            stats.late++
            stats.attendancedates[dayTime].present = 1
            stats.attendancedates[dayTime].inTime = att.inTime
            stats.attendancedates[dayTime].outTime = att.outTime
            stats.attendancedates[dayTime].notMarked = ""
            stats.attendancedates[dayTime].early = b
            stats.attendancedates[dayTime].late = a
            if (isOnsite && onsiteDetails.onsiteType === "Full Day") {
              stats.onsite++
              // stats.attendancedates[dayTime].onsite = 1
            } else if (isOnsite && onsiteDetails.onsiteType === "Half Day") {
              stats.onsite += 0.5
              // stats.attendancedates[dayTime].onsite = 0.5
            }
          } else if (
            (punchIn < noonLimit && punchOut < noonLimit) ||
            (punchIn > noonLimit && punchOut > noonLimit) ||
            (punchIn > lateLimit &&
              punchIn < noonLimit &&
              punchOut < minOutTime &&
              punchOut > noonLimit)
          ) {
            stats.attendancedates[dayTime].notMarked = 1
            if (isOnsite && onsiteDetails.onsiteType === "Full Day") {
              stats.onsite++
              stats.attendancedates[dayTime].present = 1
              stats.attendancedates[dayTime].notMarked = ""
            } else if (isOnsite && onsiteDetails.onsiteType === "Half Day") {
              stats.onsite += 0.5
              stats.attendancedates[dayTime].present = 0.5
              stats.attendancedates[dayTime].notMarked = 0.5
            }

            ///NEWLY ADDED
            if (isLeave && leaveDetails.leaveType === "Full Day") {
              if (leaveDetails.leaveCategory) {
                switch (leaveDetails.leaveCategory) {
                  case "casual Leave":
                    stats.attendancedates[dayTime].casualLeave = 1
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  case "other Leave":
                    stats.attendancedates[dayTime].otherLeave = 1
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  case "privileage Leave":
                    stats.attendancedates[dayTime].privileageLeave = 1
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  case "compensatory Leave":
                    stats.attendancedates[dayTime].compensatoryLeave = 1
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  default:
                    stats.attendancedates[dayTime].otherLeave = 1 // Default case
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                }
              } else {
                stats.attendancedates[dayTime].otherLeave = 1
                stats.attendancedates[dayTime].reason = leaveDetails.reason
                stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
              }
              stats.attendancedates[dayTime].notMarked = ""
            } else if (isLeave && leaveDetails.leaveType === "Half Day") {
              if (leaveDetails.leaveCategory) {
                switch (leaveDetails.leaveCategory) {
                  case "casual Leave":
                    stats.attendancedates[dayTime].casualLeave = 0.5
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].halfDayperiod =
                      leaveDetails?.halfDayPeriod
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  case "other Leave":
                    stats.attendancedates[dayTime].otherLeave = 0.5
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].halfDayperiod =
                      leaveDetails?.halfDayPeriod
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  case "privileage Leave":
                    stats.attendancedates[dayTime].privileageLeave = 0.5
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].halfDayperiod =
                      leaveDetails?.halfDayPeriod
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  case "compensatory Leave":
                    stats.attendancedates[dayTime].compensatoryLeave = 0.5
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].halfDayperiod =
                      leaveDetails?.halfDayPeriod
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  default:
                    stats.attendancedates[dayTime].otherLeave = 0.5
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].halfDayperiod =
                      leaveDetails?.halfDayPeriod // Default case
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                }
              } else {
                stats.attendancedates[dayTime].otherLeave = 0.5
                stats.attendancedates[dayTime].reason = leaveDetails.reason
                stats.attendancedates[dayTime].halfDayperiod =
                  leaveDetails?.halfDayPeriod
                stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
              }
              stats.attendancedates[dayTime].notMarked = 0.5
            }

            fulldayarr.push(day)
          } else if (
            (punchIn == lateLimit &&
              punchOut >= noonLimit &&
              punchOut < minOutTime) ||
            (punchIn <= noonLimit &&
              punchOut == minOutTime &&
              punchIn > lateLimit)
          ) {
            stats.attendancedates[dayTime].present = 0.5
            stats.attendancedates[dayTime].notMarked = 0.5
            if (isOnsite && onsiteDetails.onsiteType === "Full Day") {
              stats.onsite++
              stats.attendancedates[dayTime].present = 1
              stats.attendancedates[dayTime].notMarked = ""
            } else if (isOnsite && onsiteDetails.onsiteType === "Half Day") {
              if (
                punchIn == lateLimit &&
                punchOut >= noonLimit &&
                onsiteDetails.halfDayPeriod === "Afternoon"
              ) {
                stats.onsite += 0.5
                stats.attendancedates[dayTime].present = 1
                stats.attendancedates[dayTime].notMarked = ""
              } else if (
                punchIn == lateLimit &&
                punchOut >= noonLimit &&
                onsiteDetails.halfDayPeriod === "Morning"
              ) {
                stats.onsite += 0.5
              } else if (
                punchIn <= noonLimit &&
                punchOut >= minOutTime &&
                onsiteDetails.halfDayPeriod === "Morning"
              ) {
                stats.onsite += 0.5
                stats.attendancedates[dayTime].present = 1
                stats.attendancedates[dayTime].notMarked = ""
              }
            }
          } else if (
            (punchIn < lateLimit &&
              punchOut >= noonLimit &&
              punchOut < minOutTime) ||
            (punchIn <= noonLimit &&
              punchOut >= earlyLeaveLimit &&
              punchIn > lateLimit)
          ) {
            arr.push(day)
            halfdayarr.push(day)
            stats.attendancedates[dayTime].present = 0.5
            stats.attendancedates[dayTime].notMarked = 0.5
            if (isOnsite && onsiteDetails.onsiteType === "Full Day") {
              stats.onsite++
              stats.attendancedates[dayTime].present = 1
              stats.attendancedates[dayTime].notMarked = ""
            } else if (isOnsite && onsiteDetails.onsiteType === "Half Day") {
              if (
                punchIn < lateLimit &&
                punchOut >= noonLimit &&
                onsiteDetails.halfDayPeriod === "Afternoon"
              ) {
                stats.onsite += 0.5
                stats.attendancedates[dayTime].present = 1
                stats.attendancedates[dayTime].notMarked = ""
                // stats.attendancedates[dayTime].onsite = 0.5
              } else if (
                punchIn < lateLimit &&
                punchOut >= noonLimit &&
                onsiteDetails.halfDayPeriod === "Morning"
              ) {
                stats.onsite += 0.5
                // stats.attendancedates[dayTime].onsite = 0.5
              } else if (
                punchIn <= noonLimit &&
                punchOut >= earlyLeaveLimit &&
                onsiteDetails.halfDayPeriod === "Afternoon"
              ) {
                stats.onsite += 0.5
                // stats.attendancedates[dayTime].onsite = 0.5
              } else if (
                punchIn <= noonLimit &&
                punchOut >= earlyLeaveLimit &&
                onsiteDetails.halfDayPeriod === "Morning"
              ) {
                stats.onsite += 0.5
                stats.attendancedates[dayTime].present = 1
                // stats.attendancedates[dayTime].onsite = 0.5
                stats.attendancedates[dayTime].notMarked = ""
              }
            }

            if (isLeave && leaveDetails.leaveType === "Full Day") {
              if (leaveDetails.leaveCategory) {
                switch (leaveDetails.leaveCategory) {
                  case "casual Leave":
                    stats.attendancedates[dayTime].casualLeave = 1
                    stats.attendancedates[dayTime].reason = leaveDetails?.reason
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  case "other Leave":
                    stats.attendancedates[dayTime].otherLeave = 1
                    stats.attendancedates[dayTime].reason = leaveDetails?.reason
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  case "privileage Leave":
                    stats.attendancedates[dayTime].privileageLeave = 1
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  case "compensatory Leave":
                    stats.attendancedates[dayTime].compensatoryLeave = 1
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  default:
                    stats.attendancedates[dayTime].otherLeave = 1 // Default case
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                }
              } else {
                stats.attendancedates[dayTime].otherLeave = 1
                stats.attendancedates[dayTime].reason = leaveDetails.reason
                stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
              }
              // stats.absent++
              stats.attendancedates[dayTime].notMarked = ""
            } else if (isLeave && leaveDetails.leaveType === "Half Day") {
              if (leaveDetails.leaveCategory) {
                switch (leaveDetails.leaveCategory) {
                  case "casual Leave":
                    stats.attendancedates[dayTime].casualLeave = 0.5
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].halfDayperiod =
                      leaveDetails?.halfDayPeriod
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  case "other Leave":
                    stats.attendancedates[dayTime].otherLeave = 0.5
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].halfDayperiod =
                      leaveDetails?.halfDayPeriod
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  case "privileage Leave":
                    stats.attendancedates[dayTime].privileageLeave = 0.5
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].halfDayperiod =
                      leaveDetails?.halfDayPeriod
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  case "compensatory Leave":
                    stats.attendancedates[dayTime].compensatoryLeave = 0.5
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].halfDayperiod =
                      leaveDetails?.halfDayPeriod
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                  default:
                    stats.attendancedates[dayTime].otherLeave = 0.5
                    stats.attendancedates[dayTime].reason = leaveDetails.reason
                    stats.attendancedates[dayTime].halfDayperiod =
                      leaveDetails?.halfDayPeriod // Default case
                    stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
                    break
                }
                // stats.attendancedates[dayTime].leaveDetails.leaveCategory = 0.5
              } else {
                stats.attendancedates[dayTime].otherLeave = 0.5
                stats.attendancedates[dayTime].reason = leaveDetails.reason
                stats.attendancedates[dayTime].halfDayperiod =
                  leaveDetails?.halfDayPeriod
                stats.attendancedates[dayTime].leaveDetails[leaveDetails._id] = leaveDetails
              }
              stats.attendancedates[dayTime].notMarked = ""
            }
          }
          daysInMonth.delete(day)
        })

      onsites?.length &&
        onsites?.forEach((onsite) => {
          const onsiteDate = onsite.onsiteDate.toISOString().split("T")[0]

          const isAttendance =
            Array.isArray(attendances) &&
            attendances.some(
              (o) => o.attendanceDate.toISOString().split("T")[0] === onsiteDate
            )
          if (
            Array.isArray(onsite.onsiteData) &&
            (onsite.adminverified === true ||
              onsite.departmentverified === true)
          ) {
            onsite.onsiteData.flat().forEach((item) => {
              stats.attendancedates[onsiteDate].onsite.push({
                place: item?.place,
                siteName: item?.siteName,
                onsiteType: onsite?.onsiteType,
                halfDayPeriod:
                  onsite?.onsiteType === "Half Day"
                    ? onsite?.halfDayPeriod
                    : null
              })
            })
          }
          if (
            !isAttendance &&
            (onsite.adminverified === true ||
              onsite.departmentverified === true)
          ) {
            if (onsite.onsiteType === "Full Day") {
              stats.attendancedates[onsiteDate].present = 1
              stats.attendancedates[onsiteDate].notMarked = ""
              stats.onsite++
            } else if (onsite.onsiteType === "Half Day") {
              stats.attendancedates[onsiteDate].present = 0.5
              stats.attendancedates[onsiteDate].notMarked = 0.5
            }
          }
        })
      leaves?.length &&
        leaves.forEach((leave) => {
          const leaveDate = leave.leaveDate.toISOString().split("T")[0]
          const leaveCategory = leave?.leaveCategory

          const isAttendance =
            Array.isArray(attendances) &&
            attendances.some(
              (o) => o.attendanceDate.toISOString().split("T")[0] === leaveDate
            )
          if (!isAttendance) {
            if (
              leave.leaveType === "Full Day" &&
              leave.onsite === false &&
              (leave.adminverified === true ||
                leave.departmentverified === true)
            ) {
              if (leaveCategory) {
                switch (leaveCategory) {
                  case "casual Leave":
                    stats.attendancedates[leaveDate].casualLeave = 1
                    stats.attendancedates[leaveDate].reason = leave?.reason
                    stats.attendancedates[leaveDate].leaveDetails[leave._id] = leave
                    break
                  case "other Leave":
                    stats.attendancedates[leaveDate].otherLeave = 1
                    stats.attendancedates[leaveDate].reason = leave?.reason
                    stats.attendancedates[leaveDate].leaveDetails[leave._id] = leave
                    break
                  case "privileage Leave":
                    stats.attendancedates[leaveDate].privileageLeave = 1
                    stats.attendancedates[leaveDate].reason = leave?.reason
                    stats.attendancedates[leaveDate].leaveDetails[leave._id] = leave
                    break
                  case "compensatory Leave":
                    stats.attendancedates[leaveDate].compensatoryLeave = 1
                    stats.attendancedates[leaveDate].reason = leave?.reason
                    stats.attendancedates[leaveDate].leaveDetails[leave._id] = leave
                    break
                  default:
                    stats.attendancedates[leaveDate].otherLeave = 1 // Default case
                    stats.attendancedates[leaveDate].reason = leave?.reason
                    stats.attendancedates[leaveDate].leaveDetails[leave._id] = leave
                    break
                }
              } else {
                stats.attendancedates[leaveDate].otherLeave = 1
                stats.attendancedates[leaveDate].reason = leave?.reason
                stats.attendancedates[leaveDate].leaveDetails[leave._id] = leave
              }
              // stats.absent++

              stats.attendancedates[leaveDate].notMarked = ""
            } else if (
              leave.leaveType === "Half Day" &&
              leave.onsite === false &&
              (leave.adminverified === true ||
                leave.departmentverified === true)
            ) {
              if (leaveCategory) {
                switch (leaveCategory) {
                  case "casual Leave":
                    stats.attendancedates[leaveDate].casualLeave = (stats.attendancedates[leaveDate].casualLeave || 0) + 0.5
                    stats.attendancedates[leaveDate].reason = leave.reason
                    stats.attendancedates[leaveDate].halfDayperiod =
                      leave.halfDayPeriod
                    stats.attendancedates[leaveDate].leaveDetails[leave._id] = leave
                    break
                  case "other Leave":
                    stats.attendancedates[leaveDate].otherLeave = (stats.attendancedates[leaveDate].otherLeave || 0) + 0.5
                    stats.attendancedates[leaveDate].reason = leave.reason
                    stats.attendancedates[leaveDate].halfDayperiod =
                      leave.halfDayPeriod
                    stats.attendancedates[leaveDate].leaveDetails[leave._id] = leave
                    break
                  case "privileage Leave":
                    stats.attendancedates[leaveDate].privileageLeave = (stats.attendancedates[leaveDate].privileageLeave || 0) + 0.5
                    stats.attendancedates[leaveDate].reason = leave.reason
                    stats.attendancedates[leaveDate].halfDayperiod =
                      leave.halfDayPeriod
                    stats.attendancedates[leaveDate].leaveDetails[leave._id] = leave
                    break
                  case "compensatory Leave":
                    stats.attendancedates[leaveDate].compensatoryLeave = (stats.attendancedates[leaveDate].compensatoryLeave || 0) + 0.5
                    stats.attendancedates[leaveDate].reason = leave.reason
                    stats.attendancedates[leaveDate].halfDayperiod =
                      leave.halfDayPeriod
                    stats.attendancedates[leaveDate].leaveDetails[leave._id] = leave
                    break
                  default:
                    stats.attendancedates[leaveDate].otherLeave = (stats.attendancedates[leaveDate].otherLeave || 0) + 0.5
                    stats.attendancedates[leaveDate].reason = leave.reason
                    stats.attendancedates[leaveDate].halfDayperiod =
                      leave.halfDayPeriod // Default case
                    stats.attendancedates[leaveDate].leaveDetails[leave._id] = leave
                    break
                }
                // stats.attendancedates[leaveDate].leaveCategory = 0.5
              } else {
                stats.attendancedates[leaveDate].otherLeave = 0.5
                stats.attendancedates[leaveDate].halfDayperiod =
                  leave.halfDayPeriod
                stats.attendancedates[leaveDate].leaveDetails[leave._id] = leave
              }
              const totalLeave =
                (stats.attendancedates[leaveDate].casualLeave || 0) +
                (stats.attendancedates[leaveDate].otherLeave || 0) +
                (stats.attendancedates[leaveDate].privileageLeave || 0) +
                (stats.attendancedates[leaveDate].compensatoryLeave || 0)

              stats.attendancedates[leaveDate].notMarked = totalLeave > 0.5 ? "" : totalLeave === 0.5 ? 0.5 : totalLeave === 0 ? "" : ""


            }
          }
        })

      const uniqueDates = [...new Set([...sundays, ...holiday])]

      const allholidays = createDates(uniqueDates, month, year)
      function getNextDate(dateString) {
        // Parse the date string (YYYY-MM-DD)
        const [year, month, day] = dateString.split("-").map(Number)

        // Create a date object
        const date = new Date(year, month - 1, day)

        // Add one day
        date.setDate(date.getDate() + 1)

        // Format the result back to 'YYYY-MM-DD'
        const nextDay = String(date.getDate()).padStart(2, "0")
        const nextMonth = String(date.getMonth() + 1).padStart(2, "0")
        const nextYear = date.getFullYear() // Full year

        return `${nextYear}-${nextMonth}-${nextDay}`
      }
      function getPreviousDate(dateString) {
        // Parse the date string (YYYY-MM-DD)
        const [year, month, day] = dateString.split("-").map(Number)

        // Create a date object
        const date = new Date(year, month - 1, day)

        // Subtract one day
        date.setDate(date.getDate() - 1)

        // Format the result back to 'YYYY-MM-DD'
        const prevDay = String(date.getDate()).padStart(2, "0")
        const prevMonth = String(date.getMonth() + 1).padStart(2, "0")
        const prevYear = date.getFullYear() // Full year

        return `${prevYear}-${prevMonth}-${prevDay}`
      }
      (async () => {
        async function calculateAbsences(allholidayfulldate, attendances, onsites) {
          const isPresent = async (date) => {
            const attendance = attendances.attendancedates[date];
            if (attendance) {
              if (
                attendance.otherLeave !== "" ||
                attendance.privileageLeave !== "" ||
                attendance.casualLeave !== "" ||
                attendance.compensatoryLeave !== "" ||
                attendance.notMarked !== ""
              ) {
                return {
                  status: false,
                  present: attendance.present,
                  otherLeave: attendance.otherLeave,
                  notMarked: attendance.notMarked
                };
              } else {
                return {
                  status: true,
                  present: attendance.present,
                  notMarked: attendance.notMarked
                };
              }
            } else {
              const previousMonth = month - 1;
              const previousmonthlastdayleavestatus = await PreviousmonthLeavesummary(previousMonth, year, stats.userId);
              if (previousmonthlastdayleavestatus) {
                return { status: false };
              } else {
                return { status: true };
              }
            }
          };

          const sortedHolidays = allholidayfulldate.sort();
          let groups = [];
          let tempGroup = [];

          for (let i = 0;i < sortedHolidays.length;i++) {
            const currDate = new Date(sortedHolidays[i]);
            const prevDate = i > 0 ? new Date(sortedHolidays[i - 1]) : null;

            if (prevDate && currDate - prevDate === 24 * 60 * 60 * 1000) {
              if (!tempGroup.length) tempGroup.push(prevDate);
              tempGroup.push(currDate);
              groups.push(tempGroup);
              tempGroup = [];
            } else {
              tempGroup.push(currDate);
              groups.push(tempGroup);
              tempGroup = [];
            }
          }

          for (const group of groups) {
            const first = group[0];
            const stringfirst = first.toISOString().split("T")[0];
            const last = group[group.length - 1];
            const stringlast = last.toISOString().split("T")[0];

            const previousDay = getPreviousDate(stringfirst);
            const nextDay = getNextDate(stringlast);

            const prevFullPresent = await isPresent(previousDay);
            const nextFullPresent = await isPresent(nextDay);

            if (prevFullPresent?.status || nextFullPresent?.status) {
              if (attendances.attendancedates[stringfirst]) {
                attendances.attendancedates[stringfirst].present = 1;
                attendances.attendancedates[stringfirst].notMarked = "";
              }
              if (attendances.attendancedates[stringlast]) {
                attendances.attendancedates[stringlast].present = 1;
                attendances.attendancedates[stringlast].notMarked = "";
              }
            }
          }
        }

        // ✅ Call the async absence adjustment and wait for it to finish
        await calculateAbsences(allholidays, stats, onsites);

        // ✅ Now safely process stats
        for (const date in stats.attendancedates) {
          const day = stats.attendancedates[date];

          stats.present += day.present || 0;

          const leaveTypes = ["casualLeave", "otherLeave", "privileageLeave", "compensatoryLeave"];

          leaveTypes.forEach((type) => {
            if (!isNaN(day[type])) {
              stats.absent += Number(day[type]);
            }
          });

          stats.notMarked += day.notMarked !== "" ? Number(day.notMarked) : 0;
        }

      })();




      for (const date in stats.attendancedates) {
        const day = stats.attendancedates[date]

        stats.present += day.present || 0

        // Sum all leave types
        const leaveTypes = [
          "casualLeave",
          "otherLeave",
          "privileageLeave",
          "compensatoryLeave"
        ]

        leaveTypes.forEach((type) => {
          if (!isNaN(day[type])) {
            stats.absent += Number(day[type])
          }
        })

        stats.notMarked += day.notMarked !== "" ? Number(day.notMarked) : 0
      }
      const combined = stats.earlyGoing + stats.late

      stats.latecutting =
        Math.floor(combined / (latecuttingCount * 2)) * 1 +
        (Math.floor(combined / latecuttingCount) % 2) * 0.5

      stats.present -=
        Math.floor(combined / (latecuttingCount * 2)) * 1 +
        (Math.floor(combined / latecuttingCount) % 2) * 0.5

      staffAttendanceStats.push(stats)
    }
    const listofHolidays = holidays.map((item) => ({
      date: item.holyDate.toISOString().split("T")[0],
      holyname: item.customTextInput
    }))
    return {
      message: "Attendence report found",
      data: staffAttendanceStats,
      fulldateholiday: listofHolidays || []
    }
  } catch (error) {
    console.log("error", error)
    return { message: "Internal server error" }
  }
}
export const Check = async (req, res) => {
  try {
    const result = await LeaveRequest.find({ onsite: true })
  } catch (error) { }
}
export const GetleavemasterLeavecount = async (req, res) => {
  try {
    const totalleavecount = await Leavemaster.findOne()
    if (totalleavecount) {
      const totalprivilegeLeave = totalleavecount.privilegeleave
      const totalcasualleave = totalleavecount.casualleave
      return res.status(200).json({
        message: "leavecount found",
        data: { totalprivilegeLeave, totalcasualleave }
      })
    }
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const DeleteEvent = async (req, res) => {
  try {
    const payload = req.body

    const { userid, type } = req.query // Extract userid from query parameters
    if (!userid) {
      return res.status(400).json({ error: "User ID is required" })
    }
    const objectId = new mongoose.Types.ObjectId(userid)

    if (type === "leave") {
      const leaveRequest = await LeaveRequest.findOne({
        userId: objectId,
        leaveType: payload.leaveType,
        reason: payload.reason,
        leaveDate: payload.leaveDate
      })

      if (!leaveRequest) {
        return res
          .status(404)
          .json({ message: "Leave request not found in this Data" })
      }

      // Prevent deletion if approved
      if (
        leaveRequest.departmentstatus === "Dept Approved" ||
        leaveRequest.hrstatus === "HR/Onsite Approved"
      ) {
        return res
          .status(400)
          .json({ message: "Cannot delete an approved leave request" })
      }

      const isDeleteLeave = await LeaveRequest.deleteOne({
        userId: objectId,
        leaveType: payload.leaveType,
        reason: payload.reason,
        leaveDate: payload.leaveDate
      })
      if (isDeleteLeave.deletedCount > 0) {
        ////////
        if (
          payload.prevCategory &&
          payload.leaveCategory &&
          payload.prevCategory === "compensatory Leave" &&
          payload.prevCategory === payload.leaveCategory
        ) {
          let remainingToAdd = leaveRequest.leaveType === "Full Day" ? 1 : 0.5

          const year = new Date(leaveRequest.leaveDate).getFullYear()

          const compensatoryLeaves = await CompensatoryLeave.find({
            userId: leaveRequest.userId,
            year,
            value: { $lt: 1 }
          }).sort({ value: -1 })
          for (const leave of compensatoryLeaves) {
            const current = leave.value ?? 0
            const spaceLeft = 1 - current

            const addNow = Math.min(spaceLeft, remainingToAdd)
            leave.value = current + addNow
            leave.leaveUsed = leave.value < 1 ? true : false

            await leave.save()

            remainingToAdd -= addNow
            if (remainingToAdd <= 0) break
          }
        }
        // const deleteCompensatoryd
        const leaves = await LeaveRequest.find({ userId: objectId })
        // Check if no records found
        if (leaves.length === 0) {
          return res
            .status(201)
            .json({ message: "Leave Deleted Successfully", data: [] })
        }

        // Send the leave records as a JSON response
        res
          .status(200)
          .json({ message: "Leaves Deleted Successfully", data: leaves })
      }
    } else if (type === "onsite") {
      const onsiteRequest = await Onsite.findOne({
        userId: objectId,
        onsiteType: payload.onsiteType,
        description: payload.description,
        onsiteDate: payload.onsiteDate
      })

      if (!onsiteRequest) {
        return res.status(404).json({ message: "Onsite request not found" })
      }

      // Prevent deletion if approved
      if (
        onsiteRequest.departmentstatus === "Dept Approved" ||
        onsiteRequest.hrstatus === "HR/Onsite Approved"
      ) {
        return res
          .status(400)
          .json({ message: "Cannot delete an approved onsite request" })
      }
      const matchedOnsite = await Onsite.findOne({
        userId: objectId,
        onsiteType: payload.onsiteType,
        description: payload.description,
        onsiteDate: payload.onsiteDate
      })
      if (matchedOnsite) {
        const matchedCompensatoryLeave = await CompensatoryLeave.findOne({
          onsiteId: matchedOnsite._id
        })
        if (matchedCompensatoryLeave?.leaveUsed) {
          return res.status(409).json({
            message: `Cannot delete this onsite entry. You earned a leave for this site`
          })
        }
      }
      const isDeleteOnsite = await Onsite.deleteOne({
        userId: objectId,
        onsiteType: payload.onsiteType,
        description: payload.description,
        onsiteDate: payload.onsiteDate
      })
      if (isDeleteOnsite.deletedCount > 0) {
        const findifcompensatoryleave = await CompensatoryLeave.findOne({
          onsiteId: onsiteRequest._id
        })
        if (findifcompensatoryleave) {
          await CompensatoryLeave.deleteOne({
            _id: findifcompensatoryleave._id
          })
        }
        const onsites = await Onsite.find({ userId: objectId })
        // Check if no records found
        if (onsites.length === 0) {
          return res.status(201).json({
            message: "Onsite Deleted Successfully",
            data: []
          })
        }

        // Send the leave records as a JSON response
        res
          .status(200)
          .json({ message: "Onsite Deleted Successfully", data: onsites })
      }
    }
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
