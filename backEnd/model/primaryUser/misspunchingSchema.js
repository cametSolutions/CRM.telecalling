import mongoose from "mongoose";
const { Schema } = mongoose
const missPunchSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "userModel",
        required: true
    },
    userModel: {
        type: String,
        required: true, enum: ["Staff", "Admin"]
    },
    departmentverified: { type: Boolean },
    adminverified: { type: Boolean },

    departmentstatus: {
        type: String,
        enum: ["Not Approved", "Dept Approved", "Dept Rejected"],
        default: "Not Approved"
    },
    hrstatus: {
        type: String,
        enum: ["Not Approved", "HR Approved", "HR Rejected"],
        default: "Not Approved"
    },
    assignedto: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "assignedtoModel",
        required: true
    },
    assignedtoModel: {
        type: String,
        required: true, enum: ["Staff", "Admin"]
    },

    attendanceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attendance", required: true
    },
    // branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true }
    remark: { type: String },
    misspunchDate: { type: Date },
    applyDate: { type: Date },
    misspunchType: { type: String },
    misspunchTime: { type: String }
}, { timestamps: true })
const Misspunch = mongoose.model("Misspunch", missPunchSchema)
export default Misspunch