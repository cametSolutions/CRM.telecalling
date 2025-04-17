import mongoose from "mongoose"
 
const quarterlyAcheiversSchema = new mongoose.Schema({
  achieverId: { type: mongoose.Schema.Types.ObjectId,ref:"Staff" },
  verified: { type: Boolean, default: true },
  startsFrom: { type: Date },
  endTo: { type: Date },
  title: { type: String }
})

export default mongoose.model("QuarterlyAchiever", quarterlyAcheiversSchema)
