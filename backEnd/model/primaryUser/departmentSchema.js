import mongoose from "mongoose"

const departmentSchema = new mongoose.Schema({
  department: { type: String, required: true }
  // cmp_id: { type: String, required: true },
  // Primary_user_id: { type: String, required: true }
})
export default mongoose.model("Department", departmentSchema)
