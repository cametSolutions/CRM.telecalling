
// import CallRegistration from "../model/secondaryUser/CallRegistrationSchema.js";

// export const getCallMetricsForSingleDay = async (dayDate, reportEnd) => {

//   const startOfDay = new Date(dayDate);
//   startOfDay.setHours(0, 0, 0, 0);

//   const endOfDay = new Date(reportEnd);
//   endOfDay.setHours(23, 59, 59, 999);

//   return await CallRegistration.aggregate([

//     // 1️⃣ unwind callregistration array
//     { $unwind: "$callregistration" },

//     // 2️⃣ unwind attendedBy array
//     { $unwind: "$callregistration.formdata.attendedBy" },

//     // 3️⃣ convert calldate STRING → DATE
//     {
//       $addFields: {
//         callDateObj: {
//           $toDate: "$callregistration.formdata.attendedBy.calldate"
//         }
//       }
//     },

//     // 4️⃣ match date range
//     {
//       $match: {
//         callDateObj: {
//           $gte: startOfDay,
//           $lte: endOfDay
//         }
//       }
//     },

//     // 5️⃣ group by caller
//     {
//       $group: {
//         _id: "$callregistration.formdata.attendedBy.callerId",
//         role: { $first: "$callregistration.formdata.attendedBy.role" },
//         Calls: { $sum: 1 }
//       }
//     },

//     // 6️⃣ lookup STAFF
//     {
//       $lookup: {
//         from: "staffs",
//         localField: "_id",
//         foreignField: "_id",
//         as: "staffUser"
//       }
//     },

//     // 7️⃣ lookup ADMIN
//     {
//       $lookup: {
//         from: "admins",
//         localField: "_id",
//         foreignField: "_id",
//         as: "adminUser"
//       }
//     },

//     // 8️⃣ pick correct user based on role
//     {
//       $addFields: {
//         user: {
//           $cond: [
//             { $eq: ["$role", "Staff"] },
//             { $arrayElemAt: ["$staffUser", 0] },
//             { $arrayElemAt: ["$adminUser", 0] }
//           ]
//         }
//       }
//     },

//     // 9️⃣ final output
//     {
//       $project: {
//         staffId: "$_id",
//         staffName: "$user.name",
//         Calls: 1,
//         _id: 0
//       }
//     }
//   ]);
// };

import CallRegistration from "../model/secondaryUser/CallRegistrationSchema.js";

export const getCallMetricsForSingleDay = async (dayDate, reportEnd) => {

  const startOfDay = new Date(dayDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(reportEnd);
  endOfDay.setHours(23, 59, 59, 999);

  return await CallRegistration.aggregate([

    // 1️⃣ unwind callregistration
    { $unwind: "$callregistration" },

    // 2️⃣ unwind attendedBy
    { $unwind: "$callregistration.formdata.attendedBy" },

    // 3️⃣ normalize calldate (array OR string)
    {
      $addFields: {
        callDateObj: {
          $convert: {
            input: {
              $cond: [
                { $isArray: "$callregistration.formdata.attendedBy.calldate" },
                { $arrayElemAt: ["$callregistration.formdata.attendedBy.calldate", 0] },
                "$callregistration.formdata.attendedBy.calldate"
              ]
            },
            to: "date",
            onError: null,
            onNull: null
          }
        }
      }
    },

    // 4️⃣ match valid date range
    {
      $match: {
        callDateObj: {
          $ne: null,
          $gte: startOfDay,
          $lte: endOfDay
        }
      }
    },

    // 5️⃣ group by caller
    {
      $group: {
        _id: "$callregistration.formdata.attendedBy.callerId",
        role: { $first: "$callregistration.formdata.attendedBy.role" },
        Calls: { $sum: 1 }
      }
    },

    // 6️⃣ lookup STAFF
    {
      $lookup: {
        from: "staffs",
        localField: "_id",
        foreignField: "_id",
        as: "staffUser"
      }
    },

    // 7️⃣ lookup ADMIN
    {
      $lookup: {
        from: "admins",
        localField: "_id",
        foreignField: "_id",
        as: "adminUser"
      }
    },

    // 8️⃣ select correct user by role
    {
      $addFields: {
        user: {
          $cond: [
            { $eq: ["$role", "Staff"] },
            { $arrayElemAt: ["$staffUser", 0] },
            { $arrayElemAt: ["$adminUser", 0] }
          ]
        }
      }
    },

    // 9️⃣ final output
    {
      $project: {
        staffId: "$_id",
        staffName: "$user.name",
        Calls: 1,
        _id: 0
      }
    }
  ]);
};
