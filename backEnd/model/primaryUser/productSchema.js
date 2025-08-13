import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productPrice: { type: Number },
  description: { type: String },

  selected: [{
    hsn_id: { type: mongoose.Schema.Types.ObjectId, ref: "Hsn" }
  }],
  GSTIN: String
}, { timestamps: true })

export default mongoose.model("Product", productSchema)
