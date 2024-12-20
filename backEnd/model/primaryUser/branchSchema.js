import mongoose from "mongoose"

const BranchSchema = new mongoose.Schema({
  companyName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true
  },

  branchName: { type: String, required: true },

  address: String,

  city: String,
  state: String,
  country: String,
  pincode: String,
  mobile: String,
  email: String,
  notificationemail: String,
  mailpassword: String,
  landlineno: String
})

export default mongoose.model("Branch", BranchSchema)
