
import mongoose from "mongoose"

const yearlyAcheiversSchema = new mongoose.Schema({
  achieverId: { type: mongoose.Schema.Types.ObjectId,ref:"Staff" },
  verified: { type: Boolean, default: true },
  startsFrom: { type: Date },
  endTo: { type: Date },
  title: { type: String }
})

export default mongoose.model("YearlyAchiever", yearlyAcheiversSchema)
