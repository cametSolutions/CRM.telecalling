import mongoose from "mongoose"

const dashBoardAnnouncementSchema = new mongoose.Schema({
  announcement: { type: String },
  announcementTitle: { type: String, default: "Announcements" },
  postedBy: { type: String, default: "CAMET CRM" }
}, { timestamps: true })

export default mongoose.model(
  "DashboardAnnouncement",
  dashBoardAnnouncementSchema
)
