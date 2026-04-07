import { Timestamp } from "bson";
import mongoose from "mongoose";
const { Schema } = mongoose
const misspunchSchema = new Schema({
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
    remark: { type: String },
    misspunchDate: { type: Date },
    applyDate: { type: Date },
    misspunchType: { type: String }
}, { timestamps: true })
const Misspunch = mongoose.model("Misspunch", misspunchSchema)
export default Misspunch