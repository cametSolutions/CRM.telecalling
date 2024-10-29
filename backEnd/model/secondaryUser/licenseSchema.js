import mongoose from "mongoose"

const LicenseSchema = new mongoose.Schema({
  products: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
    // required: true
  },
  customerName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true
  },
  licensenumber: { type: Number }
})

export default mongoose.model("License", LicenseSchema)
