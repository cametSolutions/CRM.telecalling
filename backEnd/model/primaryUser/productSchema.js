import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productPrice: { type: Number },
  description: { type: String },

  selected: [],
  GSTIN: String
}, { timestamps: true })

export default mongoose.model("Product", productSchema)
