import mongoose from "mongoose"

const ServicesSchema = new mongoose.Schema({
  serviceName: { type: String },
  price: { type: Number },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" }
})

export default mongoose.model("Service", ServicesSchema)
