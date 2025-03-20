import mongoose from "mongoose"

const leadIdSchema = new mongoose.Schema({
  leadId: { type: String, required: true }
})

export default mongoose.model("LeadId", leadIdSchema)
