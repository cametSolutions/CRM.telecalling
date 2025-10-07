import mongoose from "mongoose"

const leadSchema = new mongoose.Schema(
  {
    leadId: { type: String, required: true },
    leadDate: { type: Date },
    customerName: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    mobile: { type: String },
    phone: { type: String },
    email: { type: String },
    location: { type: String },
    pincode: { type: String },
    trade: { type: String },
    partner: { type: mongoose.Schema.Types.ObjectId, ref: " Partner" },
    //to know lead is confirmed or reject initially its false 
    leadConfirmed: { type: Boolean, default: false },
    //to show closed lead list 
    leadClosed: { type: Boolean, default: false },
    //may some leads are not confirmed may customers leaves from leads so to check the leads is lost or confirmed
    leadLost: { type: Boolean, default: false },
    //leads are gets from branchwise so to know the leads are in which branch
    leadBranch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
    //task completion date given by the authority
    dueDate: { type: Date },
    //product tagged in the individual leads
    leadFor: [
      {
        productorServiceId: {
          type: mongoose.Schema.Types.ObjectId,
          refpath: "productorServicemodel",
          default: null
        },
        productorServicemodel: { type: String, enum: ["Product", "Service"] },
        licenseNumber: { type: Number },
        productPrice: { type: Number },
        hsn: { type: Number },
        netAmount: { type: Number },
        price: { type: Number }
      }
    ],
    //lead done by
    leadBy: {
      type: mongoose.Schema.Types.ObjectId,
      refpath: "assignedtoleadByModel"
    },
    //lead closed person
    leadClosedModel: {
      type: String,
      enum: ["Staff", "Admin"]
    },
    leadByModel: {
      //this for getting lead done by the user
      type: String,
      enum: ["Staff", "Admin"]
    },
    //amount without tax
    taxableAmount: {
      type: Number
    },
    //tax amount of the total produts 
    taxAmount: { type: Number },
    //total amount of all lead produts includes tax 
    netAmount: {
      type: Number
    },
    //balance amount given by the customer
    balanceAmount: {
      type: Number
    },
    //paid amount by the customer
    totalPaidAmount: {
      type: Number,
      default: 0
    },
    //remarks generated while lead register
    remark: { type: String },
    //payment history of the specified individual leads 
    paymentHistory: [
      {
        paymentDate: { type: Date },
        receivedAmount: { type: Number },
        receivedBy: { type: mongoose.Schema.Types.ObjectId, refpath: "recievedModel" },
        recievedModel: { type: String, enum: ["Staff", "Admin"] }
      }
    ],
    //to know whether its reallocated list or currently task mode
    reallocatedTo: { type: Boolean, default: false },
    //to track all activities of the lead
    activityLog: [{
      submissionDate: { type: Date },
      submittedUser: { type: mongoose.Schema.Types.ObjectId, refpath: "submissiondoneByModel", default: null },
      submissiondoneByModel: { type: String, enum: ["Staff", "Admin"] },
      taskallocatedBy: { type: mongoose.Schema.Types.ObjectId, refpath: "taskallocatedByModel" },
      taskallocatedByModel: { type: String, enum: ["Staff", "Admin"] },
      taskallocatedTo: { type: mongoose.Schema.Types.ObjectId, refpath: "taskallocatedToModel", default: null },
      taskallocatedToModel: { type: String, enum: ["Staff", "Admin"] },
      remarks: { type: String },
      taskBy: { type: String },
      taskTo: { type: String },
      taskDescription: { type: String },
      reallocatedTo: { type: Boolean, default: false },
      taskClosed: { type: Boolean, default: false },
      followupClosed: { type: Boolean },
      allocatedClosed: { type: Boolean, default: false },//block for previously allocated user 
      followUpDate: { type: Date },
      nextFollowUpDate: { type: Date },
      allocationDate: { type: Date },
      taskSubmissionDate: { type: Date },
      taskfromFollowup: { type: Boolean },
      allocationChanged: { type: Boolean },
      changeReason: { type: String }
    }],
    //to know what type of allocation currently goin on,like implemention,programming ,followup to track current allocation status
    allocationType: { type: String },
    //to check whether this lead is initially on which type like implemention,programing
    selfAllocationType: { type: String },
    //if its self allocation to know the allocation date means work completion date
    selfAllocationDueDate: { type: Date },
    //initially check its tru or false
    selfAllocation: { type: Boolean },
    //while tracking the leads on some pages to know whether the current task is gets from followup or directly gets from allocation or re allocation page 
    taskfromFollowup: { type: Boolean, default: false }
  },
  { timestamps: true }
)

export default mongoose.model("LeadMaster", leadSchema)
