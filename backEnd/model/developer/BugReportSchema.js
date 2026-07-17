import mongoose from "mongoose"

const BugReportSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        severity: {
            type: String,
            enum: ["low", "medium", "high", "critical"],
            default: "medium"
        },
        status: {
            type: String,
            enum: ["in-progress","closed"],
            default: "in-progress"
        },
        pageUrl: {
            type: String,
            default: ""
        },
        reportedBy: {
            type: mongoose.Schema.Types.ObjectId, refPath: "reportedByModel", default: null,

        },
        reportedByModel: {
            type: String,
            enum: ["Staff", "Admin"],
            trim: true,
            default: null
        },
        resolvedBy: {
            type: mongoose.Schema.Types.ObjectId, refPath: "resolvedByModel", default: null 

        },
        resolvedByModel: {
            type: String,
            enum: ["Staff", "Admin"],
            trim: true,
            default: null
        },
        resolvedAt: {
            type: Date,
            default: null
        },
        adminNote: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
)
export default mongoose.model("BugReport", BugReportSchema)
