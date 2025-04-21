import mongoose from "mongoose"
import QuarterlyAchiever from "../../model/primaryUser/quarterlyAchieversSchema.js"
import YearlyAchiever from "../../model/primaryUser/yearylyAchieversSchema.js"
import DashboardAnnouncement from "../../model/primaryUser/dashBoardAnnouncement.js"
export const GetcurrentAchiever = async (req, res) => {
  try {
    const data = {}
    const currentquarterlyachiever = await QuarterlyAchiever.find({
      verified: true
    }).populate("achieverId", "name profileUrl title")
    const currentyearlyachiever = await YearlyAchiever.find({
      verified: true
    }).populate("achieverId", "name profileUrl title")
    data.quarterlyachiever = currentquarterlyachiever
    data.yearlyachiever = currentyearlyachiever
    return res
      .status(200)
      .json({ message: "quarterly and yearlyachievements", data })
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const UpdateAnnouncement = async (req, res) => {
  try {
    const { announcement } = req.body
    console.log("an", announcement)

    const updatedAnnouncement = await DashboardAnnouncement.findOneAndUpdate(
      {}, // empty filter: only one doc exists
      { announcement }, // new announcement content
      {
        new: true, // return the updated doc
        upsert: true // create a new doc if none exists
      }
    )

    return res.status(200).json({
      message: "Dashboard announcement updated Successfully",
      data: updatedAnnouncement
    })
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const GetcurrentAnnouncement = async (req, res) => {
  try {
    const currentannouncement = await DashboardAnnouncement.find({})
    if (currentannouncement.length > 0) {
      return res
        .status(200)
        .json({ message: "Announcement found", data: currentannouncement })
    } else {
      return res
        .status(201)
        .json({ message: "No announcement", data: currentannouncement })
    }
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const UpdateAcheivements = async (req, res) => {
  try {
    const { selectedYearlyStaffs, selectedQuarterlyStaffs, quarterlyTitle } =
      req.body

    for (const [Id, isSelected] of Object.entries(selectedQuarterlyStaffs)) {
      if (isSelected) {
        // Insert or update
        await QuarterlyAchiever.updateOne(
          { achieverId: Id },
          { $set: { verified: true, title: quarterlyTitle } },
          { upsert: true }
        )
      } else {
        // Only update if the document exists (no upsert)
        await QuarterlyAchiever.updateOne(
          { achieverId: Id },
          { $set: { verified: false } }
        )
      }
    }
    for (const [Id, isSelected] of Object.entries(selectedYearlyStaffs)) {
      if (isSelected) {
        // Insert or update
        await YearlyAchiever.updateOne(
          { achieverId: Id },
          { $set: { verified: true, title: quarterlyTitle } },
          { upsert: true }
        )
      } else {
        // Only update if the document exists (no upsert)
        await YearlyAchiever.updateOne(
          { achieverId: Id },
          { $set: { verified: false } }
        )
      }
    }
    return res.status(200).json({
      message: "Achievements updated successfully",
      status: true
    })
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
