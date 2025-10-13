import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productPrice: { type: Number },
  description: { type: String },

  selected: [{
    hsn_id: { type: mongoose.Schema.Types.ObjectId, ref: "Hsn",set: v => (v === "" ? undefined : v)},
    hsnName: { type: String },
    company_id: { type: String },
    companyName: { type: String },
    branch_id: {
      type: String
    },
    branchName: { type: String },
    brand_id: { type: mongoose.Schema.ObjectId, ref: "Brand",set: v => (v === "" ? undefined : v)},
    brandName: { type: String },
    category_id: { type: mongoose.Schema.ObjectId, ref: "Category",set: v => (v === "" ? undefined : v)},
    categoryName: { type: String },
  }],
  GSTIN: String
}, { timestamps: true })

export default mongoose.model("Product", productSchema)
