import mongoose from "mongoose"
const TimeSchema = new mongoose.Schema({
  hour: { type: String, required: true }, // e.g., '9'
  minute: { type: String, required: true }, // e.g., '30'
  period: { type: String, enum: ["AM", "PM"], required: true } // e.g., 'AM'
})

const LeavemasterSchema = new mongoose.Schema({
  checkIn: {
    type: String,
    required: true
  },
  checkOut: {
    type: String,
    required: true
  },
  checkInEndAt: {
    type: String,
    required: true
  },
  checkOutStartAt: {
    type: String,
    required: true
  },
  lateArrival: {
    type: Number,
    required: true,
    min: 0 // Ensure no negative values
  },
  privilegeleave:{
    type:Number
  },
  casualleave:{
    type:Number
  },
  sickleave:{
    type:Number
  },
  earlyOut: {
    type: Number,
    required: true,
    min: 0 // Ensure no negative values
  },
  deductSalaryMinute: {
    type: Number,
    required: true,
    min: 0 // Ensure no negative values
  }
})
const Leavemaster = mongoose.model("Leavemaster", LeavemasterSchema)

export default Leavemaster
