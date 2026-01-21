

// export default getLeadMetricsForSingleDay;
import mongoose from "mongoose";
// import Staff from "../model/primaryUser/staffSchema.js";
import LeadMaster from "../model/primaryUser/leadmasterSchema.js";
import models from "../../backEnd/model/auth/authSchema.js"
const { Staff, Admin } = models;

async function getLeadMetricsForSingleDay(date, reportEnd) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(reportEnd);
  endOfDay.setHours(23, 59, 59, 999);

  return await Staff.aggregate([

    // =====================================================
    // 1️⃣ LOOKUP NEW LEADS (FIRST ACTIVITY ONLY)
    // =====================================================
    {
      $lookup: {
        from: "leadmasters",
        let: { staffId: "$_id" },
        pipeline: [
          {
            $addFields: {
              firstActivity: { $arrayElemAt: ["$activityLog", 0] }
            }
          },
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$firstActivity.submittedUser", "$$staffId"] },
                  { $gte: ["$firstActivity.submissionDate", startOfDay] },
                  { $lte: ["$firstActivity.submissionDate", endOfDay] }
                ]
              }
            }
          },
          { $count: "count" }
        ],
        as: "newLeads"
      }
    },

    // =====================================================
    // 2️⃣ LOOKUP TASKS (FULL ACTIVITYLOG)
    // =====================================================
    {
      $lookup: {
        from: "leadmasters",
        let: { staffId: "$_id" },
        pipeline: [
          { $unwind: "$activityLog" },
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$activityLog.taskallocatedTo", "$$staffId"] },
                  { $gte: ["$activityLog.submissionDate", startOfDay] },
                  { $lte: ["$activityLog.submissionDate", endOfDay] },
                  { $ne: ["$activityLog.taskId", null] },
                  { $eq: ["$activityLog.allocationChanged", false] }
                ]
              }
            }
          },
          {
            $lookup: {
              from: "tasks",
              localField: "activityLog.taskId",
              foreignField: "_id",
              as: "task"
            }
          },
          { $unwind: "$task" },
          {
            $group: {
              _id: "$task.taskName",
              count: { $sum: 1 }
            }
          },
          {
            $project: {
              k: "$_id",
              v: "$count",
              _id: 0
            }
          }
        ],
        as: "tasks"
      }
    },

    // =====================================================
    // 3️⃣ NORMALIZE COUNTS
    // =====================================================
    {
      $addFields: {
        newlead: {
          $ifNull: [{ $arrayElemAt: ["$newLeads.count", 0] }, 0]
        },
        tasks: {
          $cond: [
            { $gt: [{ $size: "$tasks" }, 0] },
            { $arrayToObject: "$tasks" },
            {}
          ]
        }
      }
    },

    // =====================================================
    // 4️⃣ FINAL SHAPE
    // =====================================================
    {
      $project: {
        _id: 0,
        staffId: "$_id",
        staffName: "$name",
        newlead: 1,
        tasks: 1
      }
    },

    // =====================================================
    // 5️⃣ SORT (OPTIONAL)
    // =====================================================
    { $sort: { staffName: 1 } }
  ]);
}

export default getLeadMetricsForSingleDay;
