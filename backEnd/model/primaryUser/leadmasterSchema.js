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
      productorServiceId: {
        type: mongoose.Schema.Types.ObjectId,
        refpath: "productorServicemodel",
        default: null
      },
productorServicemodel:{type:String,enum:["Product","Service"]},
      licenseNumber: { type: Number },
      price: { type: Number }
    }
  ],

  leadBy: {
    type: mongoose.Schema.Types.ObjectId,
    refpath: "assignedtoleadByModel"
  },
  assignedtoleadByModel: {
    type: String,
    enum: ["Staff", "Admin"]
  },
  netAmount: {
    type: Number
  },
  remark: { type: String },
  allocatedTo: {
    type: mongoose.Schema.Types.ObjectId,
    refpath: " allocatedToModel",
    default: null // Setting default value to null
  },
  followUpDatesandRemarks: [
    {
      followUpDate: { type: Date },
      nextfollowUpDate: { type: Date },
      Remarks: { type: String },
      followedId: {
        type: mongoose.Schema.Types.ObjectId,
        refpath: "followedByModel",
        default: null
      }
    }
  ],
  followedByModel: { type: String, enum: ["Staff", "Admin"], defalult: null },
  allocatedToModel: {
    type: String,
    enum: ["Staff", "Admin"], // Only these two models are allowed
    default: null // Setting default value to null
  }
})

export default mongoose.model("LeadMaster", leadSchema)
