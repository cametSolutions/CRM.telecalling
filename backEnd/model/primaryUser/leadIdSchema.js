import mongoose from "mongoose"

const leadIdSchema = new mongoose.Schema(
  {
    leadId: { type: String, required: true },
    leadBy: {
      type: mongoose.Schema.Types.ObjectId,
      refpath: "assignedtoleadByModel"
    },
    assignedtoleadByModel: {
      type: String,
      enum: ["Staff", "Admin"]
    }
  },
  { timestamps: true }
)

export default mongoose.model("LeadId", leadIdSchema)
