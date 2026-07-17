import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
  },

  code: {
    type: String,
  },

  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
});

export default mongoose.model("Department", departmentSchema);