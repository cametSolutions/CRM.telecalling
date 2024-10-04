import mongoose from "mongoose"

const CustomerSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  address1: { type: String },
  address2: { type: String },
  country: String,
  state: String,
  city: { type: String },
  pincode: {
    type: Number,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not a valid number!"
    }
  },
  email: { type: String },
  mobile: { type: String },
  landline: String,
  isActive: {
    type: String,

    enum: ["Running", "Not Running"]
  },
  contactPerson: {
    type: String
  },
  parter: { type: String },
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
      customerAddDate: { type: String },
      amcstartDate: { type: String },
      amcendDate: { type: String },
      amcAmount: { type: Number }, // Ensure this is a number
      amcDescription: { type: String },
      licenseExpiryDate: { type: String },
      productAmount: { type: Number }, // Ensure this is a number
      productamountDescription: { type: String },
      tvuexpiryDate: { type: String },
      tvuAmount: { type: Number }, // Ensure this is a number
      tvuamountDescription: { type: String },
      isActive: {
        type: String,

        enum: ["Running", "Not Running"]
      },
      softwareTrade: { type: String }
    }
  ],
  callregistration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CallRegistration"
  }
})

export default mongoose.model("Customer", CustomerSchema)
