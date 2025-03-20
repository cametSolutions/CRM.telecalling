import mongoose from "mongoose"

const leadSchema = new mongoose.Schema({
  leadId: { type: String, required: true },
  leadDate: { type: Date },
  customerName: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  mobile: { type: String },
  phone: { type: String },
  email: { type: String },
  location: { type: String },
  pincode: { type: String },
  trade: { type: String },
  leadFor: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  remark: { type: String },
  allocatedTo: {
    type: mongoose.Schema.Types.ObjectId,
    refpath: "assignedtoMode"
  },
  assignedtoModel: {
    type: String,
    enum: ["Staff", "Admin"] // Only these two models are allowed
  }
})

export default mongoose.model("LeadMaster", leadSchema)
