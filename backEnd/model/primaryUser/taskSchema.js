import mongoose from "mongoose"

const taskSchema = new mongoose.Schema({
  taskName: { type: String, required: true }
  // cmp_id: { type: String, required: true },
  // Primary_user_id: { type: String, required: true }
})
export default mongoose.model("Task", taskSchema)