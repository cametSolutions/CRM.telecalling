import mongoose, { mongo } from "mongoose"

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
  leadFor: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      licenseNumber: { type: Number }
    }
  ],
  leadBy: {
    type: mongoose.Schema.Types.ObjectId,
    refpath: "assignedtoleadModel"
  },
  assignedtoleadModel: {
    type: String,
    enum: ["Staff", "Admin"]
  },
  netAmount: {
    type: Number
  },
  remark: { type: String },
  allocatedTo: {
    type: mongoose.Schema.Types.ObjectId,
    refpath: "assignedtoMode",
    default: null // Setting default value to null
  },
  assignedtoModel: {
    type: String,
    enum: ["Staff", "Admin"], // Only these two models are allowed
    default: null // Setting default value to null
  }
})

export default mongoose.model("LeadMaster", leadSchema)
