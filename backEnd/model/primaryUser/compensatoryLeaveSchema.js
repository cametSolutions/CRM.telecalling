import mongoose from "mongoose"

const compensatorySchema = new mongoose.Schema(
  {
    year: { type: Number },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
    onsiteId: { type: mongoose.Schema.Types.ObjectId, ref: "Onsite" },

    value: { type: Number },
    leaveUsed: { type: Boolean, default: false }
  },
  {
    timestamps: true // 👈 this line enables createdAt & updatedAt
  }
)

export default mongoose.model("CompensatoryLeave", compensatorySchema)
