import mongoose from "mongoose"
const { Schema } = mongoose

const leaveRequestSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff", // Reference to the user who made the request
      required: true
    },
    leaveDate: {
      type: Date,
      required: true
    },

    leaveType: {
      type: String,
      enum: ["Half Day", "Full Day"],
      required: true
    },
    halfDayPeriod: {
      type: String,
      enum: ["Morning", "Afternoon"],
      required: function () {
        return this.leaveType === "Half Day" // Only required if leaveType is Half Day
      }
    },
    reason: {
      type: String,
      required: function () {
        return !this.onsite // `reason` is required only if `onsite` is false
      }
    },
    description: {
      type: String
    },
    onsite: {
      type: Boolean,
      default: false
    },

    adminverified: {
      type: Boolean,
      default: false
    },
    departmentverified: { type: Boolean, default: false },
    status: {
      type: String,
      enum: [
        "Not Approved",
        "Dept. Approved",
        "HR/Onsite Approved",
        "Cancel Request",
        "Cancelled"
      ],
      default: "Not Approved"
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
)

const LeaveRequest = mongoose.model("LeaveRequest", leaveRequestSchema)

export default LeaveRequest
