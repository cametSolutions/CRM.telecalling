// import mongoose from "mongoose"

// const CustomerSchema = new mongoose.Schema({
//   customerName: { type: mongoose.Schema.Types.Mixed },
//   address1: { type: String },
//   address2: { type: String },
//   country: String,
//   registrationType: { type: String },
//   gstNo: { type: String },
//   state: String,
//   city: { type: String },
//   pincode: {
//     type: String

//   },
//   email: { type: String },
//   incomingNumber: { type: String },
//   mobile: { type: String },
//   landline: String,
//   industry: { type: String },
//   partner: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Partner",
//     default: null,
//     set: v => (v === "" ? null : v)
//   },
//   contactPerson: {
//     type: String
//   },

//   selected: [
//     {
//       company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company" }, // if referencing another collection
//       companyName: { type: String },
//       branch_id: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" }, // Adjust for other fields
//       branchName: { type: String },
//       product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // Adjust for product ID as ObjectId
//       productName: { type: String },
//       brandName: { type: String },
//       categoryName: { type: String },
//       licensenumber: { type: Number },
//       noofusers: { type: Number }, // Ensure this is a number
//       version: { type: mongoose.Schema.Types.Mixed },
//       customerAddDate: { type: Date },
// applicationDate:{type:Date},
// nextDue:{type:Date},
//       amcstartDate: { type: Date },
//       amcendDate: { type: Date },
//       amcAmount: { type: Number }, // Ensure this is a number
//       amcDescription: { type: String },
//       licenseExpiryDate: { type: Date },
//       productAmount: { type: Number }, // Ensure this is a number
//       productamountDescription: { type: String },
//       tvuexpiryDate: { type: Date },
//       tvuAmount: { type: Number }, // Ensure this is a number
//       tvuamountDescription: { type: String },
//       isActive: {
//         type: String,

//         enum: ["Running", "Deactive"]
//       },
//       reasonofStatus: { type: String },
//       softwareTrade: { type: String },
// taggedLicenses:[],
// productorservicetype:{type:String}
//     }
//   ],
// createdFrom:{type:String},
//   callregistration: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "CallRegistration"
//   }
// }, { timestamps: true })



// // Customer identity
// CustomerSchema.index({ mobile: 1, email: 1 })
// CustomerSchema.index({ gstNo: 1 })

// CustomerSchema.index({ customerName: "text" })

// // References
// CustomerSchema.index({ partner: 1 })
// CustomerSchema.index({ callregistration: 1 })
// CustomerSchema.index({ "selected.licensenumber": 1 })
// CustomerSchema.index({ "selected.company_id": 1 })
// CustomerSchema.index({ "selected.branch_id": 1 })
// CustomerSchema.index({ "selected.product_id": 1 })

// // Status + expiry
// CustomerSchema.index({ "selected.isActive": 1, "selected.licenseExpiryDate": 1 })

// // AMC dates
// CustomerSchema.index({ "selected.amcstartDate": 1, "selected.amcendDate": 1 })

// // TVU expiry
// CustomerSchema.index({ "selected.tvuexpiryDate": 1 })

// export default mongoose.model("Customer", CustomerSchema)
import mongoose from "mongoose"

const SelectedItemSchema = new mongoose.Schema(
  {
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null
    },
    companyName: {
      type: String,
      trim: true,
      default: ""
    },
createdFrom:{type:String},
productAddedDate:{type:Date},

//  productAddedby: {
//         type: mongoose.Schema.Types.ObjectId,
//         refPath: "userModel",
//         required: true
//     },
//     productAddedmodel: {
//         type: String,
//         required: true, enum: ["Staff", "Admin"]
//     },

    branch_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      default: null
    },
    branchName: {
      type: String,
      trim: true,
      default: ""
    },

    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null
    },
    productName: {
      type: String,
      trim: true,
      default: ""
    },

    brandName: {
      type: String,
      trim: true,
      default: ""
    },
    categoryName: {
      type: String,
      trim: true,
      default: ""
    },

    licensenumber: {
      type: Number,
      default: null,
      set: (v) => {
        if (v === "" || v === null || v === undefined) return null
        if (typeof v === "string" && v.trim() === "") return null

        const num = Number(v)
        return Number.isNaN(num) ? null : num
      }
    },

    noofusers: {
      type: Number,
      default: 0,
      set: (v) => {
        if (v === "" || v === null || v === undefined) return 0
        const num = Number(v)
        return Number.isNaN(num) ? 0 : num
      }
    },

    version: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },

    customerAddDate: {
      type: Date,
      default: null
    },
    applicationDate: {
      type: Date,
      default: null
    },
    nextDue: {
      type: Date,
      default: null
    },
    licenseNumbers: {
      type: [
        {
          licenseNumber: Number,
          productorServiceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
          productorServiceName: String,
          sourceIndex: {
            type: Number,
            default: undefined,
          },
        },
      ],
      default: [],
    },
    taggeddata: {
      type: [
        {
          licensenumber: Number,
          nextDue: Date,
          productAmount: Number,//taxinclusive ,
taxinclusiveamount:Number,
taxexclusiveAmount:Number,//taxexclusive amount
discountAmount:Number,
hsn:Number//taxrate
        },
      ],
      default: [],
    },

    amcstartDate: {
      type: Date,
      default: null
    },
    amcendDate: {
      type: Date,
      default: null
    },
    amcAmount: {
      type: Number,
      default: null
    },
    amcDescription: {
      type: String,
      trim: true,
      default: ""
    },

    licenseExpiryDate: {
      type: Date,
      default: null
    },
    productAmount: {
      type: Number,
      default: null
    },
    productamountDescription: {
      type: String,
      trim: true,
      default: ""
    },

    tvuexpiryDate: {
      type: Date,
      default: null
    },
    tvuAmount: {
      type: Number,
      default: null
    },
    tvuamountDescription: {
      type: String,
      trim: true,
      default: ""
    },

    isActive: {
      type: String,
      trim: true,
      enum: ["Running", "Deactive"],
      default: "Running"
    },

    reasonofStatus: {
      type: String,
      trim: true,
      default: ""
    },

    softwareTrade: {
      type: String,
      trim: true,
      default: ""
    },

    taggedLicenses: {
      type: [
        {
          type: String,
          trim: true
        }
      ],
      default: []
    },

    taggedLicenseDueDates: {
      type: Map,
      of: Date,
      default: {}
    },

    productorservicetype: {
      type: String,
      trim: true,
      default: ""
    }
  },
  { _id: false }
)

const CustomerSchema = new mongoose.Schema(
  {
    customerName: {
      type: mongoose.Schema.Types.Mixed
    },

    address1: {
      type: String,
      trim: true,
      default: ""
    },
    address2: {
      type: String,
      trim: true,
      default: ""
    },

    country: {
      type: String,
      trim: true,
      default: ""
    },

    registrationType: {
      type: String,
      trim: true,
      default: ""
    },

    gstNo: {
      type: String,
      trim: true,
      default: ""
    },

    state: {
      type: String,
      trim: true,
      default: ""
    },

    city: {
      type: String,
      trim: true,
      default: ""
    },

    pincode: {
      type: String,
      trim: true,
      default: ""
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: ""
    },

    incomingNumber: {
      type: String,
      trim: true,
      default: ""
    },

    mobile: {
      type: String,
      trim: true,
      default: ""
    },

    landline: {
      type: String,
      trim: true,
      default: ""
    },

    industry: {
      type: String,
      trim: true,
      default: ""
    },

    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Partner",
      default: null,
      set: (v) => (v === "" ? null : v)
    },

    contactPerson: {
      type: String,
      trim: true,
      default: ""
    },

    selected: {
      type: [SelectedItemSchema],
      default: []
    },

    createdFrom: {
      type: String,
      trim: true,
      default: ""
    },

    callregistration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CallRegistration",
      default: null
    }
  },
  { timestamps: true }
)

CustomerSchema.index({ mobile: 1, email: 1 })
CustomerSchema.index({ gstNo: 1 })
CustomerSchema.index({ customerName: "text" })

CustomerSchema.index({ partner: 1 })
CustomerSchema.index({ callregistration: 1 })
CustomerSchema.index({ "selected.licensenumber": 1 })
CustomerSchema.index({ "selected.company_id": 1 })
CustomerSchema.index({ "selected.branch_id": 1 })
CustomerSchema.index({ "selected.product_id": 1 })

CustomerSchema.index({
  "selected.isActive": 1,
  "selected.licenseExpiryDate": 1
})

CustomerSchema.index({
  "selected.amcstartDate": 1,
  "selected.amcendDate": 1
})

CustomerSchema.index({ "selected.tvuexpiryDate": 1 })

export default mongoose.model("Customer", CustomerSchema)
