import CallRegistration from "../model/secondaryUser/CallRegistrationSchema.js"
export const getStaffSolvedCallCounts = async (options = {}) => {
  const {
    limit = 10,
    timeFrame = "yearly",
    year = new Date().getFullYear(),
    month,
    quarter,
    startDate,
    endDate
  } = options

  // Build date filter based on timeFrame or custom date range
  let dateFilter = {}

  if (timeFrame === "yearly") {
    const yearStart = new Date(year, 0, 1)
    const yearEnd = new Date(year + 1, 0, 0, 23, 59, 59, 999)

    dateFilter["callregistration.timedata.endTime"] = {
      $gte: yearStart,
      $lte: yearEnd
    }
  } else if (timeFrame === "monthly") {
    if (!month || month < 0 || month > 11) {
      throw new Error(
        "Valid month (1-12) is required when timeFrame is 'monthly'"
      )
    }

    // const monthStart = new Date(year, month - 1, 1)

    // const monthEnd = new Date(year, month, 0, 23, 59, 59, 999)

const monthStart = new Date(year, month, 1);
const monthEnd = new Date(year, month + 1, 0, 23, 59, 59, 999);

    dateFilter["callregistration.timedata.endTime"] = {
      $gte: monthStart,
      $lte: monthEnd
    }
  } else if (timeFrame === "quarterly") {
    if (!quarter || quarter < 1 || quarter > 4) {
      throw new Error(
        "Valid quarter (1-4) is required when timeFrame is 'quarterly'"
      )
    }

    const quarterStartMonth = (quarter - 1) * 3
    const quarterEndMonth = quarterStartMonth + 3

    const quarterStart = new Date(year, quarterStartMonth, 1)
    const quarterEnd = new Date(year, quarterEndMonth, 0, 23, 59, 59, 999)

    dateFilter["callregistration.timedata.endTime"] = {
      $gte: quarterStart,
      $lte: quarterEnd
    }
  }
  // Custom date range (overrides timeFrame if both provided)
  else if (startDate || endDate) {
    dateFilter["callregistration.timedata.endTime"] = {}
    if (startDate)
      dateFilter["callregistration.timedata.endTime"]["$gte"] = startDate
    if (endDate)
      dateFilter["callregistration.timedata.endTime"]["$lte"] = endDate
  }

 
  const basePipeline = [
    // Unwind the callregistration array
    { $unwind: "$callregistration" },

    // Filter for solved status and time period using endTime
    {
      $match: {
        "callregistration.formdata.status": "solved",
        ...dateFilter
      }
    },

    // Handle the different formats of completedBy
    {
      $project: {
        callId: "$callregistration._id",
        createdAt: "$callregistration.createdAt",
        endTime: "$callregistration.timedata.endTime",
        status: "$callregistration.formdata.status",
        // Normalize completedBy to always be an array of identifiers
        normalizedCompletedBy: {
          $cond: [
            // If completedBy doesn't exist, use empty array
            { $ifNull: ["$callregistration.formdata.completedBy", false] },
            // If it exists, normalize based on type
            {
              $switch: {
                branches: [
                  // Case 1: completedBy is a string
                  {
                    case: {
                      $eq: [
                        { $type: "$callregistration.formdata.completedBy" },
                        "string"
                      ]
                    },
                    then: [
                      {
                        userId: "$callregistration.formdata.completedBy",
                        type: "string"
                      }
                    ]
                  },
                  // Case 2: completedBy is an array
                  {
                    case: {
                      $eq: [
                        { $type: "$callregistration.formdata.completedBy" },
                        "array"
                      ]
                    },
                    then: {
                      $map: {
                        input: "$callregistration.formdata.completedBy",
                        as: "user",
                        in: {
                          $cond: [
                            // If array element is a string
                            { $eq: [{ $type: "$$user" }, "string"] },
                            { userId: "$$user", type: "string" },
                            // If array element is an object with callerId
                            {
                              $cond: [
                                {
                                  $and: [
                                    { $eq: [{ $type: "$$user" }, "object"] },
                                    { $ifNull: ["$$user.callerId", false] }
                                  ]
                                },
                                { userId: "$$user.callerId", type: "object" },
                                // Skip invalid entries
                                null
                              ]
                            }
                          ]
                        }
                      }
                    }
                  }
                ],
                default: []
              }
            },
            // If completedBy doesn't exist, use empty array
            []
          ]
        }
      }
    },

    // Filter out nulls from the normalized array
    {
      $project: {
        callId: 1,
        createdAt: 1,
        endTime: 1,
        status: 1,
        normalizedCompletedBy: {
          $filter: {
            input: "$normalizedCompletedBy",
            as: "user",
            cond: { $ne: ["$$user", null] }
          }
        }
      }
    },

    // Unwind the normalized completedBy to count each user's solved calls
    { $unwind: "$normalizedCompletedBy" },

    // Handle staff lookup based on type
    {
      $lookup: {
        from: "staffs",
        let: { userId: "$normalizedCompletedBy.userId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: [
                  "$_id",
                  {
                    $convert: {
                      input: "$$userId",
                      to: "objectId",
                      onError: null,
                      onNull: null
                    }
                  }
                ]
              }
            }
          },
          {
            $project: {
              _id: 1,
              name: 1,
              email: 1,
              department: 1,
              role: 1
            }
          }
        ],
        as: "staffInfo"
      }
    },

    // Group by user ID and count solved calls
    {
      $group: {
        _id: "$normalizedCompletedBy.userId",
        userType: { $first: "$normalizedCompletedBy.type" },
        staffInfo: { $first: { $arrayElemAt: ["$staffInfo", 0] } },
        solvedCount: { $sum: 1 }
      }
    },

    // Add formatted user information
    {
      $project: {
        _id: 0,
        userId: "$_id",
        userType: 1,
        staffInfo: 1,
        displayName: {
          $cond: {
            if: { $eq: ["$userType", "string"] },
            then: "$_id", // Use string name directly
            else: {
              $cond: {
                if: { $ne: ["$staffInfo", null] },
                then: "$staffInfo.name", // Use name from staff collection
                else: "Unknown Staff" // Fallback
              }
            }
          }
        },
        department: { $ifNull: ["$staffInfo.department", "N/A"] },
        role: { $ifNull: ["$staffInfo.role", "N/A"] },
        email: { $ifNull: ["$staffInfo.email", "N/A"] },
        solvedCount: 1
      }
    }
  ]

  // Get top staff by solved count
  const topStaff = await CallRegistration.aggregate([
    ...basePipeline,
    { $sort: { solvedCount: -1 } },
    { $limit: limit }
  ])
  const topCallStaff = topStaff[0]

  const leastActiveStaff = await CallRegistration.aggregate([
    ...basePipeline,
    { $sort: { solvedCount: 1 } },
    { $limit: limit }
  ])
  const leastCallStaff = leastActiveStaff[0]

  // Prepare time period information
  let timePeriodInfo = {}

  if (timeFrame === "yearly") {
    timePeriodInfo = {
      timeFrame: "yearly",
      year: year
    }
  } else if (timeFrame === "monthly") {
    timePeriodInfo = {
      timeFrame: "monthly",
      year: year,
      month: month,
      monthName: new Date(year, month - 1, 1).toLocaleString("default", {
        month: "long"
      })
    }
  } else if (timeFrame === "quarterly") {
    timePeriodInfo = {
      timeFrame: "quarterly",
      year: year,
      quarter: quarter
    }
  } else {
    timePeriodInfo = {
      timeFrame: "custom",
      startDate: startDate,
      endDate: endDate
    }
  }

  return {
    topCallStaff,
    leastCallStaff,

    timePeriod: timePeriodInfo
  }
}
