import mongoose from "mongoose"
import QuarterlyAchiever from "../../model/primaryUser/quarterlyAchieversSchema.js"
import YearlyAchiever from "../../model/primaryUser/yearylyAchieversSchema.js"
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
