import mongoose from "mongoose"
import bcrypt from "bcrypt"

const { Schema } = mongoose

const staffSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"]
    },
    mobile: {
      type: String,

      match: /^[0-9]{10}$/ // Example for a 10-digit Indian number
    },

    password: {
      type: String,

      required: [true, "Password is required"]
    },
    role: {
      type: String
    },

    isVerified: {
      type: Boolean,
      default: true
    },
    dateofbirth: {
      type: String
    },
    bloodgroup: {
      type: String
    },
    gender: {
      type: String
    },
    address: {
      type: String
    },
    country: {
      type: String
    },
    state: {
      type: String
    },
    pincode: {
      type: String
    },
    joiningdate: {
      type: String
    },
    designation: {
      type: String
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: false, // This makes it optional
      default: null
    },
    assignedto: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "assignedtoModel" // Reference model is dynamically set
    },
    assignedtoModel: {
      type: String,
      enum: ["Staff", "Admin"] // Only these two models are allowed
    },
    profileUrl: {
      type: [String]
    },
    documentUrl: {
      type: [String]
    },
    callstatus: {
      totalCall: { type: Number, default: 0 },
      solvedCalls: { type: Number, default: 0 },
      colleagueSolved: { type: Number, default: 0 },
      pendingCalls: { type: Number, default: 0 },
      totalDuration: { type: Number,default:0 }
    },
    permissions: [
      {
        Company: Boolean,
        Branch: Boolean,
        Customer: Boolean,
        CallNotes:Boolean,
        UsersAndPasswords: Boolean,
        MenuRights: Boolean,
        VoucherMaster: Boolean,
        Target: Boolean,
        Product: Boolean,
        Inventory: Boolean,
        Partners: Boolean,
        Department: Boolean,
        Brand: Boolean,
        Category: Boolean,
        HSN: Boolean,
        Lead: Boolean,
        CallRegistration: Boolean,
        LeaveApplication: { type: Boolean, default: true },
        SignUpCustomer: Boolean,
        ProductMerge: Boolean,
        ProductAllocationPending: Boolean,
        LeaveApprovalPending: Boolean,
        WorkAllocation: Boolean,
        ExcelConverter: Boolean,
        Summary: Boolean,
        ExpiryRegister: Boolean,
        ExpiredCustomerCalls: Boolean,
        CustomerCallsSummary: Boolean,
        CustomerContacts: Boolean,
        CustomerActionSummary: Boolean,
        AccountSearch: Boolean,
        LeaveSummary: Boolean
      }
    ],
    selected: [
      {
        company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
        companyName: { type: String },
        branch_id: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
        branchName: { type: String }
      }
    ]
    // Other staff-specific fields
  },
  { timestamps: true }
)

const adminSchema = new Schema(
  {
    name: {
      type: String
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"]
    },

    mobileno: {
      type: String,

      match: /^[0-9]{10}$/ // Example for a 10-digit Indian number
    },
    password: {
      type: String,
      required: [true, "Password is required"]
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: ["Staff", "Admin"]
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    callstatus: {
      totalCall: { type: Number, default: 0 },
      solvedCalls: { type: Number, default: 0 },
      colleagueSolved: { type: Number, default: 0 },
      pendingCalls: { type: Number, default: 0 },
      totalDuration: { type: Number,default:0 }
    }
    // Other admin-specific fieldss
  },
  { timestamps: true }
)

// Pre-save hook for password hashing
staffSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next()
  }
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    console.log("pssss", this.password)
    next()
  } catch (error) {
    next(error)
  }
})

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next()
  }
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

export default {
  Staff: mongoose.model("Staff", staffSchema),
  Admin: mongoose.model("Admin", adminSchema)
}
