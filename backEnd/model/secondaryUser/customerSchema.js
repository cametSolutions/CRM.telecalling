import mongoose from "mongoose"

const CustomerSchema = new mongoose.Schema({
  customerName: { type: mongoose.Schema.Types.Mixed },
  address1: { type: String },
  address2: { type: String },
  country: String,
  registrationType: { type: String },
  gstNo: { type: String },
  state: String,
  city: { type: String },
  pincode: {
    type: String

  },
  email: { type: String },
  incomingNumber: { type: String },
  mobile: { type: String },
  landline: String,
  industry: { type: String },
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Partner",
    default: null,
    set: v => (v === "" ? null : v)
  },
  contactPerson: {
    type: String
  },

  selected: [
    {
      company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company" }, // if referencing another collection
      companyName: { type: String },
      branch_id: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" }, // Adjust for other fields
      branchName: { type: String },
      product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // Adjust for product ID as ObjectId
      productName: { type: String },
      brandName: { type: String },
      categoryName: { type: String },
      licensenumber: { type: Number },
      noofusers: { type: Number }, // Ensure this is a number
      version: { type: mongoose.Schema.Types.Mixed },
      customerAddDate: { type: Date },
      amcstartDate: { type: Date },
      amcendDate: { type: Date },
      amcAmount: { type: Number }, // Ensure this is a number
      amcDescription: { type: String },
      licenseExpiryDate: { type: Date },
      productAmount: { type: Number }, // Ensure this is a number
      productamountDescription: { type: String },
      tvuexpiryDate: { type: Date },
      tvuAmount: { type: Number }, // Ensure this is a number
      tvuamountDescription: { type: String },
      isActive: {
        type: String,

        enum: ["Running", "Deactive"]
      },
      reasonofStatus: { type: String },
      softwareTrade: { type: String }
    }
  ],
  callregistration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CallRegistration"
  }
}, { timestamps: true })

export default mongoose.model("Customer", CustomerSchema)
