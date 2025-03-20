import mongoose from "mongoose"

const compensatorySchema = new mongoose.Schema({
  year: { type: Number },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
  compensatoryLeave: {
    type: Boolean,
    default: false
  },
  compensatoryLeaveUsed: { type: Boolean, default: false }
})

export default mongoose.model("CompensatoryLeave", compensatorySchema)
