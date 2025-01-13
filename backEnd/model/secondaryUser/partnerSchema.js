import mongoose from "mongoose"

const PartnerSchema = new mongoose.Schema({
  partner: { type: String }
})

export default mongoose.model("Partner", PartnerSchema)
