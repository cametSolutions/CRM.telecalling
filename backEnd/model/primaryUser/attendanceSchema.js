import mongoose from "mongoose"
const { Schema } = mongoose

const attendanceSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff", // Reference to the user who made the request
    required: true
  },

  attendanceDate: {
    type: Date,
    required: true
  },
  inTime: {
    type: String
  },
  outTime: {
    type: String
  }
})

const Attendance = mongoose.model("Attendance", attendanceSchema)

export default Attendance
