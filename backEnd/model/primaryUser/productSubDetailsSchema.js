import mongoose from "mongoose"

const brandSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  // cmp_id: { type: String, required: true },
  // Primary_user_id: { type: String, required: true }
})

const categorySchema = new mongoose.Schema({
  category: { type: String, required: true },
 
})


const HsnSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  hsnSac: String,
  hsnSac: { type: String },
  description: { type: String },
  onValue: {},
  onItem: [],
})

export const Hsn = mongoose.model("Hsn", HsnSchema)

export const Brand = mongoose.model("Brand", brandSchema)
export const Category = mongoose.model("Category", categorySchema)

