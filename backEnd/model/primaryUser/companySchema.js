import mongoose from "mongoose"

const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  address: String,
  city: String,
  pincode: Number,
  country: String,
  state: String,
  email: { type: String, required: true },
  mailserver: String,
  mobile: String,
  website: String,
  pan: String,
  landlineno: String,
  GSTIN: String,

  accountDetails: {
    accountName: String,
    bankName: String,
    branchName: String,
    accountNumber: String,
    ifscCode: String
  },

  branches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Branch" }] // Reference to Branches
})

export default mongoose.model("Company", companySchema)
