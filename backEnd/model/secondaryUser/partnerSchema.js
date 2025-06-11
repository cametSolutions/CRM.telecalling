import mongoose from "mongoose"

const PartnerSchema = new mongoose.Schema({
  partner: { type: String },
  relationBranches: [{ companyName: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true }, branchName: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true } }]
}, {
  strict: "throw", // <-- this will throw on unknown fields
  timestamps: true
}
)

export default mongoose.model("Partner", PartnerSchema)
