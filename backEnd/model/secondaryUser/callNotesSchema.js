import mongoose from "mongoose"

const CallnoteSchema = new mongoose.Schema({
  callNotes: { type: String }
})

export default mongoose.model("Callnote", CallnoteSchema)
