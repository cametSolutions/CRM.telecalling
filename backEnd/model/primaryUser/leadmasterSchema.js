// import mongoose from "mongoose";
// const paymentEntrySchema = new mongoose.Schema(
//   {
//     productorServiceId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Product",
//       required: true,
//     },
//     productorServicemodel: { type: String },
//     netAmount: { type: Number, required: true },
//     receivedAmount: { type: Number, required: true },
//     balanceAmount: { type: Number, required: true },
//   },
//   { _id: false }
// )

// const leadSchema = new mongoose.Schema(
//   {
//     leadId: { type: String, required: true },
//     leadDate: { type: Date },
//     customerName: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
//     mobile: { type: String },
//     phone: { type: String },
//     email: { type: String },
//     location: { type: String },
//     pincode: { type: String },
//     trade: { type: String },
//     partner: { type: mongoose.Schema.Types.ObjectId, ref: "Partner" },
//     //to know lead is confirmed or reject initially its false
//     leadConfirmed: { type: Boolean, default: false },//this only true if lead is closed form lead closed page
//     //to show closed lead list
//     leadClosed: { type: Boolean, default: false },//this is true when followup is closed
//     leadClosedDate: { type: Date },
//     leadLostDate: { type: Date },
//     leadConvertedDate: { type: Date },
//     forcefullyClosedTarget: { type: Boolean },
//     //may some leads are not confirmed may customers leaves from leads so to check the leads is lost or confirmed
//     leadLost: { type: Boolean, default: false },
//     //leads are gets from branchwise so to know the leads are in which branch
//     leadBranch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
//     //task completion date given by the authority
//     dueDate: { type: Date },
//     //for checking payment is completely due
//     paymentVerified: { type: Boolean, default: false },
//     source: { type: String },
//     //product tagged in the individual leads
//     leadFor: [
//       {
//         productorServiceId: {
//           type: mongoose.Schema.Types.ObjectId,
//           refpath: "productorServicemodel",
//           default: null,
//         },
//         productorservicetype: { type: String },
//         company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
//         branch_id: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
//         productorServicemodel: { type: String, enum: ["Product", "Service"] },
//         licenseNumber: { type: Number },
//         productPrice: { type: Number },
//         hsn: { type: Number },
//         netAmount: { type: Number },
//         price: { type: Number },
//         licenseNumbers: {
//           type: [
//             {
//               licenseNumber: Number,
//               productorServiceId: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: "Product",
//               },
//               productorServiceName: String,
//               sourceIndex: {
//                 type: Number,
//                 default: undefined,
//               },
//             },
//           ],
//           default: [],
//         },

//         taggeddata: {
//           type: [
//             {
//               licensenumber: Number,
//               nextDue: Date,
//               productAmount: Number,
//             },
//           ],
//           default: [],
//         },

//       },
//     ],
//     //lead done by
//     leadBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       refpath: "assignedtoleadByModel",
//     },
//     //lead closed person
//     leadClosedModel: {
//       type: String,
//       enum: ["Staff", "Admin"],
//     },
//     leadByModel: {
//       //this for getting lead done by the user
//       type: String,
//       enum: ["Staff", "Admin"],
//     },
//     //amount without tax
//     taxableAmount: {
//       type: Number,
//     },
//     //tax amount of the total produts
//     taxAmount: { type: Number },
//     //total amount of all lead produts includes tax
//     netAmount: {
//       type: Number,
//     },
// discountAmount:{type:Number},
//     //balance amount given by the customer
//     balanceAmount: {
//       type: Number,
//     },
//     //paid amount by the customer
//     totalPaidAmount: {
//       type: Number,
//       default: 0,
//     },
//     //remarks generated while lead register
//     remark: { type: String },
//     //payment history of the specified individual leads
//     paymentHistory: [
//       {
//         paymentDate: { type: Date },
//         paymentVerified: { type: Boolean, defautl: false },
//         paymentVerifiedBy: {
//           type: mongoose.Schema.Types.ObjectId,
//           refpath: "paymentverifiedModel",
//         },
//         paymentverifiedModel: { type: String, enum: ["Staff", "Admin"] },
//         verifiedAt: { type: Date },
//         receivedAmount: { type: Number },
//         paymentEntries: [paymentEntrySchema],
//         receivedBy: {
//           type: mongoose.Schema.Types.ObjectId,
//           refpath: "recievedModel",
//         },
//         receivedModel: { type: String, enum: ["Staff", "Admin"] },
//         bankRemarks: { type: String },
//         remarks: { type: String },
//       },
//     ],
//     //to know whether its reallocated list or currently task mode
//     reallocatedTo: { type: Boolean, default: false },
//     //to track all activities of the lead
//     activityLog: [
//       {
//         submissionDate: { type: Date }, //date by which when a task assigning or lead created
//         submittedUser: {
//           type: mongoose.Schema.Types.ObjectId,
//           refpath: "submissiondoneByModel",
//           default: null,
//         }, //id of user when lead or task is submitted
//         submissiondoneByModel: { type: String, enum: ["Staff", "Admin"] }, //its a dynamic model ,who the user is admin or staff.i have two staff and admin
//         taskallocatedBy: {
//           type: mongoose.Schema.Types.ObjectId,
//           refpath: "taskallocatedByModel",
//         }, //for lead 1 is creted by user 1 and but this lead is assigned to user 2 by user 3 so the user 3 is the task allocated by
//         taskallocatedByModel: { type: String, enum: ["Staff", "Admin"] }, //dynamic model
//         taskallocatedTo: {
//           type: mongoose.Schema.Types.ObjectId,
//           refpath: "taskallocatedToModel",
//           default: null,
//         }, //its the task get by the user.user 1 is assigned a task to user 2 ,user 2 is the taskallocatedto
//         taskallocatedToModel: { type: String, enum: ["Staff", "Admin"] },
//         remarks: { type: String },
//         taskBy: { type: mongoose.Schema.Types.ObjectId, ref: "Task" }, //name of task done by the submitter user its are lead,allocated,followup,implementation when a lead is created taskby by is lead and when assign to someone its become allocated and later its name of the given task
//         taskTo: { type: String }, //name of task given to the assigned user such as fid of  followup,implementation,coding etc..
//         taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" }, //id of the task tagged
//         taskDescription: { type: String }, //description given by the assigned user while in the task submission
//         reallocatedTo: { type: Boolean, default: false }, //if its true then its gone through the reallocation page
//         taskClosed: { type: Boolean, default: false }, //if the user submitted the task completion then only its true ,to check the task is completed or pending
//         followupClosed: { type: Boolean, default: false }, //to check the followup is closed or its in running
//         allocatedClosed: { type: Boolean, default: false }, //block for previously allocated user
//         allocationlist: { type: Boolean },
//         followUpDate: { type: Date }, //date by the followup happens
//         nextFollowUpDate: { type: Date }, //set the date for next followup date
//         allocationDate: { type: Date }, //its the completion date given to the user to complete the task
//         taskSubmissionDate: { type: Date }, ///its the date by which task completion done by the user
//         taskfromFollowup: { type: Boolean }, //in followup phase have a possible to allocate some task to user,so to check the alloation is come from followup ,already have another allocation directly in allocation page so distinguish between them this field is neccessary,for example allocation given to a user is coding in allocation page their allocationtype is coding but allocation given to a user is coding from followup thier allocationtype is followup ,its from followp its always allocation type is followup
//         allocationChanged: { type: Boolean }, //allocation can be reassinged to another,but i have the history of reassingnig.for example if assigned a user named 1 to a task coding and later its reassigned to  user 2.in lead task page when the user 1 login wont see the task but user 2 have .so for this createria add this field to extract or filter out respective task in the lead task page
//         changeReason: { type: String },
//       },
//     ],
//     followupClosed: { type: Boolean, default: false },
//     //to know what type of allocation currently goin on,like implemention,programming ,followup to track current allocation status
//     allocationType: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
//     //to check whether this lead is initially on which type like implemention,programing
//     selfAllocationType: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
//     //if its self allocation to know the allocation date means work completion date
//     selfAllocationDueDate: { type: Date },
//     //initially check its tru or false
//     selfAllocation: { type: Boolean },
//     //while tracking the leads on some pages to know whether the current task is gets from followup or directly gets from allocation or re allocation page
//     taskfromFollowup: { type: Boolean, default: false },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("LeadMaster", leadSchema);
// import mongoose from "mongoose";

// const paymentEntrySchema = new mongoose.Schema(
//   {
//     productorServiceId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Product",
//       required: true,
//     },
//     productorServicemodel: { type: String, trim: true },
//     netAmount: { type: Number, required: true },
//     receivedAmount: { type: Number, required: true },
//     balanceAmount: { type: Number, required: true },
//   },
//   { _id: false }
// );

// const leadSchema = new mongoose.Schema(
//   {
//     leadId: { type: String, required: true, trim: true },
//     leadDate: { type: Date },
//     customerName: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
//     mobile: { type: String, trim: true },
//     phone: { type: String, trim: true },
//     email: { type: String, trim: true },
//     location: { type: String, trim: true },
//     pincode: { type: String, trim: true },
//     trade: { type: String, trim: true },
//     partner: { type: mongoose.Schema.Types.ObjectId, ref: "Partner" },
//     leadConfirmed: { type: Boolean, default: false },
//     leadClosed: { type: Boolean, default: false },
//     leadClosedDate: { type: Date },
//     leadLostDate: { type: Date },
//     leadConvertedDate: { type: Date },
//     forcefullyClosedTarget: { type: Boolean },
//     leadLost: { type: Boolean, default: false },
//     leadBranch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
//     dueDate: { type: Date },
//     paymentVerified: { type: Boolean, default: false },
//     source: { type: String, trim: true },
// excessPaidAmount:{type:Number},

//     leadFor: [
//       {
//         productorServiceId: {
//           type: mongoose.Schema.Types.ObjectId,
//           refpath: "productorServicemodel",
//           default: null,
//         },
//         productorservicetype: { type: String, trim: true },
//         company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
//         branch_id: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
//         productorServicemodel: {
//           type: String,
//           enum: ["Product", "Service"],
//           trim: true,
//         },
//         licenseNumber: { type: Number },
//         productPrice: { type: Number },
//         hsn: { type: Number },
//         netAmount: { type: Number },
//         price: { type: Number },

//         licenseNumbers: {
//           type: [
//             {
//               licenseNumber: Number,
//               productorServiceId: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: "Product",
//               },
//               productorServiceName: { type: String, trim: true },
//               sourceIndex: {
//                 type: Number,
//                 default: undefined,
//               },
//             },
//           ],
//           default: [],
//         },

//         taggeddata: {
//           type: [
//             {
//               licensenumber: Number,
//               nextDue: Date,
//               productAmount: Number,
//               taxinclusiveamount: Number,
//               taxexclusiveAmount: Number,
// discountAmount:Number,
//               hsn: Number
//             },
//           ],
//           default: [],
//         },
//       },
//     ],

//     leadBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       refpath: "assignedtoleadByModel",
//     },

//     leadClosedModel: {
//       type: String,
//       enum: ["Staff", "Admin"],
//       trim: true,
//     },

//     leadByModel: {
//       type: String,
//       enum: ["Staff", "Admin"],
//       trim: true,
//     },

//     taxableAmount: { type: Number },
//     taxAmount: { type: Number },
//     netAmount: { type: Number },
//     discountAmount: { type: Number },
//     balanceAmount: { type: Number },

//     totalPaidAmount: {
//       type: Number,
//       default: 0,
//     },

//     remark: { type: String, trim: true },

//     paymentHistory: [
//       {
//         paymentDate: { type: Date },
//         paymentVerified: { type: Boolean, defautl: false },
//         paymentVerifiedBy: {
//           type: mongoose.Schema.Types.ObjectId,
//           refpath: "paymentverifiedModel",
//         },
//         paymentverifiedModel: {
//           type: String,
//           enum: ["Staff", "Admin"],
//           trim: true,
//         },
//         verifiedAt: { type: Date },
//         receivedAmount: { type: Number },
//         paymentEntries: [paymentEntrySchema],
//         receivedBy: {
//           type: mongoose.Schema.Types.ObjectId,
//           refpath: "recievedModel",
//         },
//         receivedModel: {
//           type: String,
//           enum: ["Staff", "Admin"],
//           trim: true,
//         },
//         bankRemarks: { type: String, trim: true },
//         remarks: { type: String, trim: true },
//       },
//     ],

//     reallocatedTo: { type: Boolean, default: false },

//     activityLog: [
//       {
//         submissionDate: { type: Date },
//         submittedUser: {
//           type: mongoose.Schema.Types.ObjectId,
//           refpath: "submissiondoneByModel",
//           default: null,
//         },
//         submissiondoneByModel: {
//           type: String,
//           enum: ["Staff", "Admin"],
//           trim: true,
//         },
//         taskallocatedBy: {
//           type: mongoose.Schema.Types.ObjectId,
//           refpath: "taskallocatedByModel",
//         },
//         taskallocatedByModel: {
//           type: String,
//           enum: ["Staff", "Admin"],
//           trim: true,
//         },
//         taskallocatedTo: {
//           type: mongoose.Schema.Types.ObjectId,
//           refpath: "taskallocatedToModel",
//           default: null,
//         },
//         taskallocatedToModel: {
//           type: String,
//           enum: ["Staff", "Admin"],
//           trim: true,
//         },
//         remarks: { type: String, trim: true },
//         taskBy: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
//         taskTo: { type: String, trim: true },
//         taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
//         taskDescription: { type: String, trim: true },
//         reallocatedTo: { type: Boolean, default: false },
//         taskClosed: { type: Boolean, default: false },
//         followupClosed: { type: Boolean, default: false },
//         allocatedClosed: { type: Boolean, default: false },
//         allocationlist: { type: Boolean },
//         followUpDate: { type: Date },
//         nextFollowUpDate: { type: Date },
//         allocationDate: { type: Date },
//         taskSubmissionDate: { type: Date },
//         taskfromFollowup: { type: Boolean },
//         allocationChanged: { type: Boolean },
//         changeReason: { type: String, trim: true },
//       },
//     ],

//     followupClosed: { type: Boolean, default: false },
//     allocationType: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
//     selfAllocationType: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
//     selfAllocationDueDate: { type: Date },
//     selfAllocation: { type: Boolean },
//     taskfromFollowup: { type: Boolean, default: false },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("LeadMaster", leadSchema);


import mongoose from "mongoose";

const toNullableNumber = (v) => {
  if (v === "" || v === null || v === undefined) return null;
  if (typeof v === "string" && v.trim() === "") return null;

  const num = Number(v);
  return Number.isNaN(num) ? null : num;
};

const toZeroNumber = (v) => {
  if (v === "" || v === null || v === undefined) return 0;
  const num = Number(v);
  return Number.isNaN(num) ? 0 : num;
};

const paymentEntrySchema = new mongoose.Schema(
  {
    productorServiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productorServicemodel: {
      type: String,
      trim: true,
    },
    netAmount: {
      type: Number,
      required: true,
    },
    receivedAmount: {
      type: Number,
      required: true,
    },
    balanceAmount: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const LicenseNumberItemSchema = new mongoose.Schema(
  {
    licenseNumber: {
      type: Number,
      default: null,
      set: toNullableNumber,
    },
    productorServiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },
    productorServiceName: {
      type: String,
      trim: true,
      default: "",
    },
    sourceIndex: {
      type: Number,
      default: undefined,
    },
  },
  { _id: false }
);

const TaggedDataSchema = new mongoose.Schema(
  {
    licensenumber: {
      type: Number,
      default: null,
      set: toNullableNumber,
    },
    nextDue: {
      type: Date,
      default: null,
    },

    productAmount: {
      type: Number,
      default: 0,
      set: toZeroNumber,
    },

    taxinclusiveamount: {
      type: Number,
      default: 0,
      set: toZeroNumber,
    },

    taxexclusiveAmount: {
      type: Number,
      default: 0,
      set: toZeroNumber,
    },

    discountAmount: {
      type: Number,
      default: 0,
      set: toZeroNumber,
    },

    hsn: {
      type: Number,
      default: 0,
      set: toZeroNumber,
    },

    noofusers: {
      type: Number,
      default: 0,
      set: toZeroNumber,
    },

    serialNumber: {
      type: String,
      default: null,
      set: toNullableNumber,
    },

    nextDueAmount: {
      type: Number,
      default: 0,
      set: toZeroNumber,
    },

    originalHsn: {
      type: Number,
      default: 0,
      set: toZeroNumber,
    },

    leadAmount: {
      type: Number,
      default: 0,
      set: toZeroNumber,
    },

    totalleadAmount: {
      type: Number,
      default: 0,
      set: toZeroNumber,
    },

    totalnextDueAmount: {
      type: Number,
      default: 0,
      set: toZeroNumber,
    },

    leadTax: {
      type: Number,
      default: 0,
      set: toZeroNumber,
    },

    nextDueTax: {
      type: Number,
      default: 0,
      set: toZeroNumber,
    },
  },
  { _id: false }
);

const leadForItemSchema = new mongoose.Schema(
  {
    productorServiceId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "productorServicemodel",
      default: null,
    },

    productorservicetype: {
      type: String,
      trim: true,
      default: "",
    },

    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },

    branch_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      default: null,
    },

    productorServicemodel: {
      type: String,
      enum: ["Product", "Service"],
      trim: true,
      default: "Product",
    },

    productorServiceName: {
      type: String,
      trim: true,
      default: "",
    },

    licenseNumber: {
      type: Number,
      default: null,
      set: toNullableNumber,
    },

    productPrice: {
      type: Number,
      default: 0,
      set: toZeroNumber,
    },

    taxAmount: {
      type: Number,
      default: 0,
      set: toZeroNumber,
    },

    hsn: {
      type: Number,
      default: 0,
      set: toZeroNumber,
    },

    netAmount: {
      type: Number,
      default: 0,
      set: toZeroNumber,
    },

    price: {
      type: Number,
      default: null,
      set: toNullableNumber,
    },

    licenseNumbers: {
      type: [LicenseNumberItemSchema],
      default: [],
    },

    taggeddata: {
      type: [TaggedDataSchema],
      default: [],
    },

    applicationDate: {
      type: Date,
      default: null,
    },

    softwareTrade: {
      type: String,
      trim: true,
      default: "",
    },

    nextDue: {
      type: Date,
      default: null,
    },

    noofusers: {
      type: Number,
      default: 0,
      set: toZeroNumber,
    },

    version: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    isActive: {
      type: String,
      trim: true,
      default: "Running",
    },

    status: {
      type: String,
      trim: true,
      default: "Running",
    },

    actualproductPrice: {
      type: Number,
      default: 0,
      set: toZeroNumber,
    },

    actualHsn: {
      type: Number,
      default: 0,
      set: toZeroNumber,
    },

    actualNetAmount: {
      type: Number,
      default: 0,
      set: toZeroNumber,
    },

    parentPrimaryProductId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },

    isDefaultService: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const leadSchema = new mongoose.Schema(
  {
    leadId: {
      type: String,
      required: true,
      trim: true,
    },

    leadDate: {
      type: Date,
      default: null,
    },

    customerName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
    },

    mobile: {
      type: String,
      trim: true,
      default: "",
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      trim: true,
      default: "",
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    pincode: {
      type: String,
      trim: true,
      default: "",
    },

    trade: {
      type: String,
      trim: true,
      default: "",
    },

    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Partner",
      default: null,
    },

    leadConfirmed: {
      type: Boolean,
      default: false,
    },

    leadClosed: {
      type: Boolean,
      default: false,
    },

    leadClosedDate: {
      type: Date,
      default: null,
    },

    leadLostDate: {
      type: Date,
      default: null,
    },

    leadConvertedDate: {
      type: Date,
      default: null,
    },

    forcefullyClosedTarget: {
      type: Boolean,
      default: false,
    },

    leadLost: {
      type: Boolean,
      default: false,
    },

    leadBranch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      default: null,
    },

    dueDate: {
      type: Date,
      default: null,
    },

    paymentVerified: {
      type: Boolean,
      default: false,
    },

    source: {
      type: String,
      trim: true,
      default: "",
    },

    excessPaidAmount: {
      type: Number,
      default: 0,
      set: toZeroNumber,
    },

    leadFor: {
      type: [leadForItemSchema],
      default: [],
    },

    leadBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "assignedtoleadByModel",
      default: null,
    },

    leadClosedModel: {
      type: String,
      enum: ["Staff", "Admin"],
      trim: true,
      default: null,
    },

    leadByModel: {
      type: String,
      enum: ["Staff", "Admin"],
      trim: true,
      default: null,
    },

    taxableAmount: {
      type: Number,
      default: 0,
      set: toZeroNumber,
    },

    taxAmount: {
      type: Number,
      default: 0,
      set: toZeroNumber,
    },

    netAmount: {
      type: Number,
      default: 0,
      set: toZeroNumber,
    },

    discountAmount: {
      type: Number,
      default: 0,
      set: toZeroNumber,
    },

    balanceAmount: {
      type: Number,
      default: 0,
      set: toZeroNumber,
    },

    totalPaidAmount: {
      type: Number,
      default: 0,
      set: toZeroNumber,
    },

    remark: {
      type: String,
      trim: true,
      default: "",
    },

    paymentHistory: [
      {
        paymentDate: {
          type: Date,
          default: null,
        },

        paymentVerified: {
          type: Boolean,
          default: false,
        },

        paymentVerifiedBy: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "paymentverifiedModel",
          default: null,
        },

        paymentverifiedModel: {
          type: String,
          enum: ["Staff", "Admin"],
          trim: true,
          default: null,
        },

        verifiedAt: {
          type: Date,
          default: null,
        },

        receivedAmount: {
          type: Number,
          default: 0,
          set: toZeroNumber,
        },

        paymentEntries: {
          type: [paymentEntrySchema],
          default: [],
        },

        receivedBy: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "recievedModel",
          default: null,
        },

        receivedModel: {
          type: String,
          enum: ["Staff", "Admin"],
          trim: true,
          default: null,
        },

        bankRemarks: {
          type: String,
          trim: true,
          default: "",
        },

        remarks: {
          type: String,
          trim: true,
          default: "",
        },
      },
    ],

    reallocatedTo: {
      type: Boolean,
      default: false,
    },

    activityLog: [
      {
        submissionDate: {
          type: Date,
          default: null,
        },

        submittedUser: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "submissiondoneByModel",
          default: null,
        },

        submissiondoneByModel: {
          type: String,
          enum: ["Staff", "Admin"],
          trim: true,
          default: null,
        },

        taskallocatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "taskallocatedByModel",
          default: null,
        },

        taskallocatedByModel: {
          type: String,
          enum: ["Staff", "Admin"],
          trim: true,
          default: null,
        },

        taskallocatedTo: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "taskallocatedToModel",
          default: null,
        },

        taskallocatedToModel: {
          type: String,
          enum: ["Staff", "Admin"],
          trim: true,
          default: null,
        },

        remarks: {
          type: String,
          trim: true,
          default: "",
        },

        taskBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Task",
          default: null,
        },

        taskTo: {
          type: String,
          trim: true,
          default: "",
        },

        taskId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Task",
          default: null,
        },

        taskDescription: {
          type: String,
          trim: true,
          default: "",
        },

        reallocatedTo: {
          type: Boolean,
          default: false,
        },

        taskClosed: {
          type: Boolean,
          default: false,
        },

        followupClosed: {
          type: Boolean,
          default: false,
        },

        allocatedClosed: {
          type: Boolean,
          default: false,
        },

        allocationlist: {
          type: Boolean,
          default: false,
        },

        followUpDate: {
          type: Date,
          default: null,
        },

        nextFollowUpDate: {
          type: Date,
          default: null,
        },

        allocationDate: {
          type: Date,
          default: null,
        },

        taskSubmissionDate: {
          type: Date,
          default: null,
        },

        taskfromFollowup: {
          type: Boolean,
          default: false,
        },

        allocationChanged: {
          type: Boolean,
          default: false,
        },

        changeReason: {
          type: String,
          trim: true,
          default: "",
        },
      },
    ],

    followupClosed: {
      type: Boolean,
      default: false,
    },

    allocationType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },

    selfAllocationType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },

    selfAllocationDueDate: {
      type: Date,
      default: null,
    },

    selfAllocation: {
      type: Boolean,
      default: false,
    },

    taskfromFollowup: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("LeadMaster", leadSchema);