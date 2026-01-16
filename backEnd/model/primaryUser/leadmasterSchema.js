import mongoose from "mongoose";

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
    partner: { type: mongoose.Schema.Types.ObjectId, ref: "Partner" },
    //to know lead is confirmed or reject initially its false
    leadConfirmed: { type: Boolean, default: false },
    //to show closed lead list
    leadClosed: { type: Boolean, default: false },
    leadClosedDate: { type: Date },
    leadLostDate: { type: Date },
    leadConvertedDate: { type: Date },
    //may some leads are not confirmed may customers leaves from leads so to check the leads is lost or confirmed
    leadLost: { type: Boolean, default: false },
    //leads are gets from branchwise so to know the leads are in which branch
    leadBranch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
    //task completion date given by the authority
    dueDate: { type: Date },
    //for checking payment is completely due
    paymentVerified: { type: Boolean, default: false },
    //product tagged in the individual leads
    leadFor: [
      {
        productorServiceId: {
          type: mongoose.Schema.Types.ObjectId,
          refpath: "productorServicemodel",
          default: null,
        },
        productorServicemodel: { type: String, enum: ["Product", "Service"] },
        licenseNumber: { type: Number },
        productPrice: { type: Number },
        hsn: { type: Number },
        netAmount: { type: Number },
        price: { type: Number },
      },
    ],
    //lead done by
    leadBy: {
      type: mongoose.Schema.Types.ObjectId,
      refpath: "assignedtoleadByModel",
    },
    //lead closed person
    leadClosedModel: {
      type: String,
      enum: ["Staff", "Admin"],
    },
    leadByModel: {
      //this for getting lead done by the user
      type: String,
      enum: ["Staff", "Admin"],
    },
    //amount without tax
    taxableAmount: {
      type: Number,
    },
    //tax amount of the total produts
    taxAmount: { type: Number },
    //total amount of all lead produts includes tax
    netAmount: {
      type: Number,
    },
    //balance amount given by the customer
    balanceAmount: {
      type: Number,
    },
    //paid amount by the customer
    totalPaidAmount: {
      type: Number,
      default: 0,
    },
    //remarks generated while lead register
    remark: { type: String },
    //payment history of the specified individual leads
    paymentHistory: [
      {
        paymentDate: { type: Date },
        paymentVerified: { type: Boolean, defautl: false },
        paymentVerifiedBy: {
          type: mongoose.Schema.Types.ObjectId,
          refpath: "paymentverifiedModel",
        },
        paymentverifiedModel: { type: String, enum: ["Staff", "Admin"] },
        verifiedAt: { type: Date },
        receivedAmount: { type: Number },
        receivedBy: {
          type: mongoose.Schema.Types.ObjectId,
          refpath: "recievedModel",
        },
        receivedModel: { type: String, enum: ["Staff", "Admin"] },
        bankRemarks: { type: String },
        remarks: { type: String },
      },
    ],
    //to know whether its reallocated list or currently task mode
    reallocatedTo: { type: Boolean, default: false },
    //to track all activities of the lead
    activityLog: [
      {
        submissionDate: { type: Date }, //date by which when a task assigning or lead created
        submittedUser: {
          type: mongoose.Schema.Types.ObjectId,
          refpath: "submissiondoneByModel",
          default: null,
        }, //id of user when lead or task is submitted
        submissiondoneByModel: { type: String, enum: ["Staff", "Admin"] }, //its a dynamic model ,who the user is admin or staff.i have two staff and admin
        taskallocatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          refpath: "taskallocatedByModel",
        }, //for lead 1 is creted by user 1 and but this lead is assigned to user 2 by user 3 so the user 3 is the task allocated by
        taskallocatedByModel: { type: String, enum: ["Staff", "Admin"] }, //dynamic model
        taskallocatedTo: {
          type: mongoose.Schema.Types.ObjectId,
          refpath: "taskallocatedToModel",
          default: null,
        }, //its the task get by the user.user 1 is assigned a task to user 2 ,user 2 is the taskallocatedto
        taskallocatedToModel: { type: String, enum: ["Staff", "Admin"] },
        remarks: { type: String },
        taskBy: { type: mongoose.Schema.Types.ObjectId, ref: "Task" }, //name of task done by the submitter user its are lead,allocated,followup,implementation when a lead is created taskby by is lead and when assign to someone its become allocated and later its name of the given task
        taskTo: { type: String }, //name of task given to the assigned user such as fid of  followup,implementation,coding etc..
        taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" }, //id of the task tagged
        taskDescription: { type: String }, //description given by the assigned user while in the task submission
        reallocatedTo: { type: Boolean, default: false }, //if its true then its gone through the reallocation page
        taskClosed: { type: Boolean, default: false }, //if the user submitted the task completion then only its true ,to check the task is completed or pending
        followupClosed: { type: Boolean, default: false }, //to check the followup is closed or its in running
        allocatedClosed: { type: Boolean, default: false }, //block for previously allocated user
        allocationlist: { type: Boolean },
        followUpDate: { type: Date }, //date by the followup happens
        nextFollowUpDate: { type: Date }, //set the date for next followup date
        allocationDate: { type: Date }, //its the completion date given to the user to complete the task
        taskSubmissionDate: { type: Date }, ///its the date by which task completion done by the user
        taskfromFollowup: { type: Boolean }, //in followup phase have a possible to allocate some task to user,so to check the alloation is come from followup ,already have another allocation directly in allocation page so distinguish between them this field is neccessary,for example allocation given to a user is coding in allocation page their allocationtype is coding but allocation given to a user is coding from followup thier allocationtype is followup ,its from followp its always allocation type is followup
        allocationChanged: { type: Boolean }, //allocation can be reassinged to another,but i have the history of reassingnig.for example if assigned a user named 1 to a task coding and later its reassigned to  user 2.in lead task page when the user 1 login wont see the task but user 2 have .so for this createria add this field to extract or filter out respective task in the lead task page
        changeReason: { type: String },
      },
    ],
    //to know what type of allocation currently goin on,like implemention,programming ,followup to track current allocation status
    allocationType: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
    //to check whether this lead is initially on which type like implemention,programing
    selfAllocationType: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
    //if its self allocation to know the allocation date means work completion date
    selfAllocationDueDate: { type: Date },
    //initially check its tru or false
    selfAllocation: { type: Boolean },
    //while tracking the leads on some pages to know whether the current task is gets from followup or directly gets from allocation or re allocation page
    taskfromFollowup: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("LeadMaster", leadSchema);
