import mongoose, { mongo } from "mongoose"

const leadSchema = new mongoose.Schema(
  {
    leadId: { type: String, required: true },
    leadDate: { type: Date },
    customerName: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    assignedto: {
      type: mongoose.Schema.Types.ObjectId,
      refpath: "assignedModel",
      default: null
    },
    assignedModel: { type: String, enum: ["Staff", "Admin"] },
    mobile: { type: String },
    phone: { type: String },
    email: { type: String },
    location: { type: String },
    pincode: { type: String },
    trade: { type: String },
    leadConfirmed: { type: Boolean, default: false },
    leadBranch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
    leadFor: [
      {
        productorServiceId: {
          type: mongoose.Schema.Types.ObjectId,
          refpath: "productorServicemodel",
          default: null
        },
        productorServicemodel: { type: String, enum: ["Product", "Service"] },
        licenseNumber: { type: Number },
        price: { type: Number }
      }
    ],

    leadBy: {
      type: mongoose.Schema.Types.ObjectId,
      refpath: "assignedtoleadByModel"
    },
    assignedtoleadByModel: {
      //this for getting lead done by the user
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
    allocatedToModel: {
      type: String,
      enum: ["Staff", "Admin"], // Only these two models are allowed
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
        },
        followedByModel: { type: String, enum: ["Staff", "Admin"] },
        folowerData: []

      }
    ],
    demofollowUp: {
      type: [{
        demoallocatedTo: { type: mongoose.Schema.Types.ObjectId, refpath: "demoallocatedtoModel", default: null },
        demoallocatedtoModel: { type: String, enum: ["Staff", "Admin"] },
        demoallocatedBy: { type: mongoose.Schema.Types.ObjectId, refpath: "demoallocatedByModel", default: null },
        demoallocatedByModel: { type: String, enum: ["Staff", "Admin"] },
        demoDescription: { type: String },
        demoallocatedDate: { type: Date },
        demofollowerDate: { type: Date, default: null },
        demofollowerDescription: { type: String, default: null }
      }], default: []
    },
    allocatedBy: { type: mongoose.Schema.Types.ObjectId, refpath: "allocatedByModel" },
    allocatedByModel: {
      type: String,
      enum: ["Staff", "Admin"]
    },


  },
  { timestamps: true }
)

export default mongoose.model("LeadMaster", leadSchema)
