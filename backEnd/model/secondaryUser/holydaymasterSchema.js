import mongoose from "mongoose"

const HolymasterSchema = new mongoose.Schema({
  customTextInput: {
    type: String,
    required: false, // Optional
    trim: true // Removes leading and trailing whitespace
  },
  holyDate: {
    type: Date,
    required: true
  }
})
const Holymaster = mongoose.model("Holymaster", HolymasterSchema)

export default Holymaster
