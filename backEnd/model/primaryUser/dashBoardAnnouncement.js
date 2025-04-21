import mongoose from "mongoose"

const dashBoardAnnouncementSchema = new mongoose.Schema({
  announcement: { type: String }
})

export default mongoose.model(
  "DashboardAnnouncement",
  dashBoardAnnouncementSchema
)
