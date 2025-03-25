import mongoose from "mongoose"

const ServicesSchema = new mongoose.Schema({
  serviceName: { type: String },
  price: { type: Number }
})

export default mongoose.model("Service", ServicesSchema)
