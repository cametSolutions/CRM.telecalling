import Customer from "../../model/secondaryUser/customerSchema.js"
import Leavemaster from "../../model/secondaryUser/leavemasterSchema.js"
import { generateUniqueNumericToken } from "../../helper/callTokenGeneration.js"
import { sendWhatapp } from "../../helper/whatapp.js"
import moment from "moment" // You can use moment.js to handle date manipulation easily
import { escapeRegExp } from "../../helper/escapeRegExp.js"
import Lead from "../../model/primaryUser/leadmasterSchema.js"
import License from "../../model/secondaryUser/licenseSchema.js"
import CallRegistration from "../../model/secondaryUser/CallRegistrationSchema.js"
import Partner from "../../model/secondaryUser/partnerSchema.js"
import Service from "../../model/primaryUser/servicesSchema.js"
import CallNote from "../../model/secondaryUser/callNotesSchema.js"
import models from "../../model/auth/authSchema.js"
import { sendEmail } from "../../helper/nodemailer.js"
const { Staff, Admin } = models
import mongoose, { isValidObjectId } from "mongoose"
import Holymaster from "../../model/secondaryUser/holydaymasterSchema.js"
import LeadMaster from "../../model/primaryUser/leadmasterSchema.js"
export const duplicate = async (req, res) => {
  // const duplicateCustomers = await Customer.aggregate([
  //   {
  //     $group: {
  //       _id: "$customerName",
  //       count: { $sum: 1 },
  //       customers: { $push: "$$ROOT" }
  //     }
  //   },
  //   {
  //     $match: {
  //       _id: { $ne: null },
  //       count: { $gt: 1 }
  //     }
  //   },
  //   {
  //     $sort: {
  //       count: -1
  //     }
  //   }
  // ]);
  const duplicateCustomers = await Customer.aggregate([
    {
      $group: {
        _id: "$customerName",
        count: { $sum: 1 }
      }
    },
    {
      $match: {
        _id: { $ne: null },
        count: { $gt: 1 }
      }
    },
    {
      $sort: {
        count: -1
      }
    }
  ]);

  return res.status(200).json({ message: "found duplicate", data: duplicateCustomers })
}


//CUSTOMELIST PAGE
// export const GetscrollCustomer = async (req, res) => {
//   try {
//     const { page = 1, limit = 100, search = "", loggeduserBranches, customerType = "Allcustomers" } = req.query;

//     if (!loggeduserBranches) {
//       return res.status(400).json({ message: "loggeduserBranches (branch id) is required" });
//     }

//     const branchId = new mongoose.Types.ObjectId(loggeduserBranches);
//     const pageNum = Math.max(1, parseInt(page));
//     const pageSize = Math.max(1, parseInt(limit));
//     const skip = (pageNum - 1) * pageSize;

//     // -------------------------- Build base match -----------------------
//     let match = {};
// console.log("customertype",customerType)
//     if (customerType === "ProductMissing") {
// console.log("treeeeeeeeeeee")
//       match.$or = [
//         { selected: { $exists: false } },
//         { selected: { $size: 0 } }
//       ];
//     } else {
//       match["selected.branch_id"] = branchId;
//       match.selected = { $exists: true, $ne: [] };

//       if (customerType !== "Allcustomers" && customerType !== "ProductinfoMissing") {
//         match.isActive = customerType;
//       }

//       if (customerType === "ProductinfoMissing") {
//         match.selected = {
//           $elemMatch: {
//             $or: [
//               { product_id: null },
//               { product_id: { $exists: false } }
//             ]
//           }
//         };
//       }
//     }

//     // -------------------------- Search conditions -----------------------
//     const hasSearch = search && search.trim().length > 0;
//     if (hasSearch) {
//       const safe = search.trim();
//       const regex = new RegExp(escapeRegExp(safe), "i");

//       const searchConditions = [
//         { customerName: { $regex: regex } },
//         { mobile: { $regex: regex } }
//       ];

//       const searchNumber = Number(safe);
//       if (!isNaN(searchNumber)) {
//         searchConditions.push({ "selected.licensenumber": searchNumber });
//       }

//       match.$or = searchConditions;
//     }

//     // ✅ COMPLETE OPTIMIZED PIPELINE WITH $facet
//     const pipeline = [
//       { $match: match }, // Filter customers first

//       // Branch-specific $facet for count + paginated data
//       {
//         $facet: {
//           metadata: [
//             // Count distinct customers (handles unwind for accuracy)
//             ...(customerType !== "ProductMissing" ? [
//               {
//                 $addFields: {
//                   selected: {
//                     $filter: {
//                       input: "$selected",
//                       cond: { $eq: ["$$this.branch_id", branchId] }
//                     }
//                   }
//                 }
//               },
//               { $unwind: { path: "$selected", preserveNullAndEmptyArrays: true } },
//               { $group: { _id: "$_id" } }
//             ] : []),
//             { $count: "selectedbranchCustomercount" }
//           ],
//           customers: [
//             ...(customerType !== "ProductMissing" ? [
//               // Filter selected array by branch
//               {
//                 $addFields: {
//                   selected: {
//                     $filter: {
//                       input: "$selected",
//                       cond: { $eq: ["$$this.branch_id", branchId] }
//                     }
//                   }
//                 }
//               },
//               // Unwind filtered selected array
//               { $unwind: { path: "$selected", preserveNullAndEmptyArrays: true } },

//               // ✅ FIXED LOOKUP - Direct field reference
//               {
//                 $lookup: {
//                   from: "products",
//                   localField: "selected.product_id",
//                   foreignField: "_id",
//                   as: "productDetails"
//                 }
//               },
//               { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } },

//               // Add productName to selected
//               {
//                 $addFields: {
//                   "selected.productName": {
//                     $ifNull: ["$productDetails.productName", null]
//                   }
//                 }
//               },

//               // Group back to original customer structure
//               {
//                 $group: {
//                   _id: "$_id",
//                   customerName: { $first: "$customerName" },
//                   address1: { $first: "$address1" },
//                   address2: { $first: "$address2" },
//                   country: { $first: "$country" },
//                   city: { $first: "$city" },
//                   pincode: { $first: "$pincode" },
//                   contactPerson: { $first: "$contactPerson" },
//                   landline: { $first: "$landline" },
//                   industry: { $first: "$industry" },
//                   partner: { $first: "$partner" },
//                   state: { $first: "$state" },
//                   registrationType: { $first: "$registrationType" },
//                   gstNo: { $first: "$gstNo" },
//                   email: { $first: "$email" },
//                   mobile: { $first: "$mobile" },
//                   selected: { $push: "$selected" }
//                 }
//               }
//             ] : [
//               // ProductMissing case - just project basic fields
//               {
//                 $project: {
//                   customerName: 1,
//                   address1: 1,
//                   address2: 1,
//                   country: 1,
//                   city: 1,
//                   pincode: 1,
//                   contactPerson: 1,
//                   landline: 1,
//                   industry: 1,
//                   partner: 1,
//                   state: 1,
//                   registrationType: 1,
//                   gstNo: 1,
//                   email: 1,
//                   mobile: 1
//                 }
//               }
//             ]),

//             // Pagination (applies to final customers only)
//             { $sort: { customerName: 1 } },
//             { $skip: skip },
//             { $limit: pageSize }
//           ]
//         }
//       },
//       {
//         $project: {
//           selectedbranchCustomercount: {
//             $ifNull: [{ $arrayElemAt: ["$metadata.selectedbranchCustomercount", 0] }, 0]
//           },
//           customers: "$customers"
//         }
//       }
//     ];

//     const result = await Customer.aggregate(pipeline);
//     const responseData = result[0] || { selectedbranchCustomercount: 0, customers: [] };

//     return res.status(200).json({
//       message: responseData.customers.length ? "Customer(s) found" : "No customer found",
//       data: responseData
//     });

//   } catch (error) {
//     console.error("GetscrollCustomer error:", error);
//     return res.status(500).json({ message: "Internal server error", error: error.message });
//   }
// };



// export const GetscrollCustomer = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 100,
//       search = "",
//       loggeduserBranches,
//       customerType = "Allcustomers"
//     } = req.query;

//     if (!loggeduserBranches) {
//       return res.status(400).json({
//         message: "loggeduserBranches (branch id) is required"
//       });
//     }

//     const branchId = new mongoose.Types.ObjectId(loggeduserBranches);
//     const pageNum = Math.max(1, parseInt(page));
//     const pageSize = Math.max(1, parseInt(limit));
//     const skip = (pageNum - 1) * pageSize;

//     // -------------------------- Build base match -----------------------
//     let baseMatch = {};


//     if (customerType === "ProductMissing") {
//       baseMatch = {
//         $or: [
//           { selected: { $exists: false } },
//           { selected: { $size: 0 } }
//         ]
//       };
//     } else if (customerType === "ProductinfoMissing") {
//       baseMatch = {
//         "selected.branch_id": branchId,
//         selected: {
//           $elemMatch: {
//             $or: [
//               { product_id: null },
//               { product_id: { $exists: false } }
//             ]
//           }
//         }
//       };
//     } else {
//       baseMatch = {
//         "selected.branch_id": branchId,
//         selected: { $exists: true, $ne: [] }
//       };

//       if (customerType !== "Allcustomers") {
//         baseMatch.isActive = customerType;
//       }
//     }

//     // -------------------------- Search conditions -----------------------
//     let match = baseMatch;

//     const hasSearch = search && search.trim().length > 0;

//     if (hasSearch) {
//       const safe = search.trim();
//       const regex = new RegExp(escapeRegExp(safe), "i");

//       const searchConditions = [
//         { customerName: { $regex: regex } },
//         { mobile: { $regex: regex } }
//       ];

//       const searchNumber = Number(safe);

//       if (!Number.isNaN(searchNumber) && safe !== "") {
//         searchConditions.push({
//           "selected.licensenumber": searchNumber
//         });
//       }

//       match = {
//         $and: [
//           baseMatch,
//           {
//             $or: searchConditions
//           }
//         ]
//       };
//     }

//     // -------------------------- Aggregation Pipeline -----------------------
//     const pipeline = [
//       { $match: match },

//       {
//         $facet: {
//           metadata: [
//             ...(customerType !== "ProductMissing"
//               ? [
//                 {
//                   $addFields: {
//                     selected: {
//                       $filter: {
//                         input: "$selected",
//                         cond: {
//                           $eq: ["$$this.branch_id", branchId]
//                         }
//                       }
//                     }
//                   }
//                 },
//                 {
//                   $unwind: {
//                     path: "$selected",
//                     preserveNullAndEmptyArrays: true
//                   }
//                 },
//                 {
//                   $group: {
//                     _id: "$_id"
//                   }
//                 }
//               ]
//               : []),

//             {
//               $count: "selectedbranchCustomercount"
//             }
//           ],

//           customers: [
//             ...(customerType !== "ProductMissing"
//               ? [
//                 {
//                   $addFields: {
//                     selected: {
//                       $filter: {
//                         input: "$selected",
//                         cond: {
//                           $eq: ["$$this.branch_id", branchId]
//                         }
//                       }
//                     }
//                   }
//                 },

//                 {
//                   $unwind: {
//                     path: "$selected",
//                     preserveNullAndEmptyArrays: true
//                   }
//                 },

//                 {
//                   $lookup: {
//                     from: "products",
//                     localField: "selected.product_id",
//                     foreignField: "_id",
//                     as: "productDetails"
//                   }
//                 },

//                 {
//                   $unwind: {
//                     path: "$productDetails",
//                     preserveNullAndEmptyArrays: true
//                   }
//                 },

//                 {
//                   $addFields: {
//                     "selected.productName": {
//                       $ifNull: [
//                         "$productDetails.productName",
//                         null
//                       ]
//                     }
//                   }
//                 },

//                 {
//                   $group: {
//                     _id: "$_id",

//                     customerName: { $first: "$customerName" },
//                     address1: { $first: "$address1" },
//                     address2: { $first: "$address2" },
//                     country: { $first: "$country" },
//                     city: { $first: "$city" },
//                     pincode: { $first: "$pincode" },
//                     contactPerson: { $first: "$contactPerson" },
//                     landline: { $first: "$landline" },
//                     industry: { $first: "$industry" },
//                     partner: { $first: "$partner" },
//                     state: { $first: "$state" },
//                     registrationType: { $first: "$registrationType" },
//                     gstNo: { $first: "$gstNo" },
//                     email: { $first: "$email" },
//                     mobile: { $first: "$mobile" },

//                     selected: {
//                       $push: "$selected"
//                     }
//                   }
//                 }
//               ]
//               : [
//                 {
//                   $project: {
//                     customerName: 1,
//                     address1: 1,
//                     address2: 1,
//                     country: 1,
//                     city: 1,
//                     pincode: 1,
//                     contactPerson: 1,
//                     landline: 1,
//                     industry: 1,
//                     partner: 1,
//                     state: 1,
//                     registrationType: 1,
//                     gstNo: 1,
//                     email: 1,
//                     mobile: 1
//                   }
//                 }
//               ]),

//             { $sort: { customerName: 1 } },
//             { $skip: skip },
//             { $limit: pageSize }
//           ]
//         }
//       },

//       {
//         $project: {
//           selectedbranchCustomercount: {
//             $ifNull: [
//               {
//                 $arrayElemAt: [
//                   "$metadata.selectedbranchCustomercount",
//                   0
//                 ]
//               },
//               0
//             ]
//           },
//           customers: "$customers"
//         }
//       }
//     ];

//     const result = await Customer.aggregate(pipeline);

//     const responseData = result[0] || {
//       selectedbranchCustomercount: 0,
//       customers: []
//     };

//     return res.status(200).json({
//       message: responseData.customers.length
//         ? "Customer(s) found"
//         : "No customer found",
//       data: responseData
//     });
//   } catch (error) {
//     console.error("GetscrollCustomer error:", error);

//     return res.status(500).json({
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };




export const GetscrollCustomer = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 100,
      search = "",
      loggeduserBranches,
      customerType = "Allcustomers"
    } = req.query;

    if (!loggeduserBranches) {
      return res.status(400).json({
        message: "loggeduserBranches (branch id) is required"
      });
    }

    const branchId = new mongoose.Types.ObjectId(loggeduserBranches);
    const pageNum = Math.max(1, parseInt(page));
    const pageSize = Math.max(1, parseInt(limit));
    const skip = (pageNum - 1) * pageSize;

    let baseMatch = {};

    if (customerType === "ProductMissing") {
      baseMatch = {
        $or: [{ selected: { $exists: false } }, { selected: { $size: 0 } }]
      };
    } else if (customerType === "ProductinfoMissing") {
      baseMatch = {
        "selected.branch_id": branchId,
        selected: {
          $elemMatch: {
            branch_id: branchId,
            $or: [{ product_id: null }, { product_id: { $exists: false } }]
          }
        }
      };
    } else {
      baseMatch = {
        "selected.branch_id": branchId,
        selected: { $exists: true, $ne: [] }
      };

      if (customerType !== "Allcustomers") {
        baseMatch.isActive = customerType;
      }
    }

    let match = baseMatch;
    const hasSearch = search && search.trim().length > 0;

    if (hasSearch) {
      const safe = search.trim();
      const regex = new RegExp(escapeRegExp(safe), "i");

      const searchConditions = [
        { customerName: { $regex: regex } },
        { mobile: { $regex: regex } }
      ];

      const searchNumber = Number(safe);

      if (!Number.isNaN(searchNumber) && safe !== "") {
        searchConditions.push({
          "selected.licensenumber": searchNumber
        });
      }

      match = {
        $and: [
          baseMatch,
          {
            $or: searchConditions
          }
        ]
      };
    }

    const pipeline = [
      { $match: match },

      {
        $facet: {
          metadata: [
            ...(customerType !== "ProductMissing"
              ? [
                {
                  $addFields: {
                    selected: {
                      $filter: {
                        input: "$selected",
                        as: "sel",
                        cond: {
                          $eq: ["$$sel.branch_id", branchId]
                        }
                      }
                    }
                  }
                },
                {
                  $unwind: {
                    path: "$selected",
                    preserveNullAndEmptyArrays: true
                  }
                },
                {
                  $group: {
                    _id: "$_id"
                  }
                }
              ]
              : []),
            {
              $count: "selectedbranchCustomercount"
            }
          ],

          customers: [
            ...(customerType !== "ProductMissing"
              ? [
                {
                  $addFields: {
                    selected: {
                      $filter: {
                        input: "$selected",
                        as: "sel",
                        cond: {
                          $eq: ["$$sel.branch_id", branchId]
                        }
                      }
                    }
                  }
                },
                {
                  $unwind: {
                    path: "$selected",
                    preserveNullAndEmptyArrays: true
                  }
                },

                {
                  $lookup: {
                    from: "products",
                    localField: "selected.product_id",
                    foreignField: "_id",
                    as: "productDetails"
                  }
                },
                {
                  $unwind: {
                    path: "$productDetails",
                    preserveNullAndEmptyArrays: true
                  }
                },

                {
                  $lookup: {
                    from: "branches",
                    localField: "selected.branch_id",
                    foreignField: "_id",
                    as: "branchDetails"
                  }
                },
                {
                  $unwind: {
                    path: "$branchDetails",
                    preserveNullAndEmptyArrays: true
                  }
                },

                {
                  $lookup: {
                    from: "companies",
                    localField: "selected.company_id",
                    foreignField: "_id",
                    as: "companyDetails"
                  }
                },
                {
                  $unwind: {
                    path: "$companyDetails",
                    preserveNullAndEmptyArrays: true
                  }
                },

                {
                  $addFields: {
                    "selected.productName": {
                      $ifNull: ["$productDetails.productName", null]
                    },
                    "selected.branch_id": {
                      $cond: [
                        { $ifNull: ["$branchDetails._id", false] },
                        {
                          _id: "$branchDetails._id",
                          branchName: "$branchDetails.branchName"
                        },
                        null
                      ]
                    },
                    "selected.company_id": {
                      $cond: [
                        { $ifNull: ["$companyDetails._id", false] },
                        {
                          _id: "$companyDetails._id",
                          companyName: "$companyDetails.companyName"
                        },
                        null
                      ]
                    }
                  }
                },

                {
                  $group: {
                    _id: "$_id",
                    customerName: { $first: "$customerName" },
                    address1: { $first: "$address1" },
                    address2: { $first: "$address2" },
                    country: { $first: "$country" },
                    city: { $first: "$city" },
                    pincode: { $first: "$pincode" },
                    contactPerson: { $first: "$contactPerson" },
                    landline: { $first: "$landline" },
                    industry: { $first: "$industry" },
                    partner: { $first: "$partner" },
                    state: { $first: "$state" },
                    registrationType: { $first: "$registrationType" },
                    gstNo: { $first: "$gstNo" },
                    email: { $first: "$email" },
                    mobile: { $first: "$mobile" },
                    selected: {
                      $push: "$selected"
                    }
                  }
                }
              ]
              : [
                {
                  $project: {
                    customerName: 1,
                    address1: 1,
                    address2: 1,
                    country: 1,
                    city: 1,
                    pincode: 1,
                    contactPerson: 1,
                    landline: 1,
                    industry: 1,
                    partner: 1,
                    state: 1,
                    registrationType: 1,
                    gstNo: 1,
                    email: 1,
                    mobile: 1
                  }
                }
              ]),

            { $sort: { customerName: 1 } },
            { $skip: skip },
            { $limit: pageSize }
          ]
        }
      },

      {
        $project: {
          selectedbranchCustomercount: {
            $ifNull: [
              {
                $arrayElemAt: [
                  "$metadata.selectedbranchCustomercount",
                  0
                ]
              },
              0
            ]
          },
          customers: "$customers"
        }
      }
    ];

    const result = await Customer.aggregate(pipeline);
    const responseData = result[0] || {
      selectedbranchCustomercount: 0,
      customers: []
    };

    return res.status(200).json({
      message: responseData.customers.length
        ? "Customer(s) found"
        : "No customer found",
      data: responseData
    });
  } catch (error) {
    console.error("GetscrollCustomer error:", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};





export const GetallCallnotes = async (req, res) => {
  try {
    const callnotes = await CallNote.find({})

    if (callnotes) {
      return res.status(200).json({
        message: "callnotes found",
        data: callnotes
      })
    }
  } catch (error) {
    console.log("error:", error.message)
  }
}
export const GetallPartners = async (req, res) => {
  try {
    console.log("ffffffffffffffffff")
    const partners = await Partner.find({}).populate({
      path: 'relationBranches.companyName',
      select: 'companyName' // Only populate these fields
    }).populate({ path: 'relationBranches.branchName', select: 'branchName' })

    if (partners) {
      return res
        .status(200)
        .json({ message: "callnotes found", data: partners })
    }
  } catch (error) {
    console.log("error:", error.message)
  }
}
export const GetallServices = async (req, res) => {
  try {
    const services = await Service.find({})
    if (services) {
      return res.status(200).json({ message: "Services found", data: services })
    }
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const DeleteCallnotes = async (req, res) => {
  const { id } = req.query

  const objectId = new mongoose.Types.ObjectId(id)

  try {
    // Perform the deletion
    const result = await CallNote.findByIdAndDelete(objectId)

    if (result) {
      return res.status(200).json({ message: " deleted successfully" })
    } else {
      return res.status(404).json({ message: "callnote not found" })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Server error" })
  }
}
export const DeletePartner = async (req, res) => {
  const { id } = req.query

  const objectId = new mongoose.Types.ObjectId(id)

  try {
    // Perform the deletion
    const result = await Partner.findByIdAndDelete(objectId)

    if (result) {
      return res.status(200).json({ message: " deleted successfully" })
    } else {
      return res.status(404).json({ message: "partner not found" })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Server error" })
  }
}
export const DeletepartnerBranch = async (req, res) => {
  try {
    const { branchId, docId } = req.query
    const objectId = new mongoose.Types.ObjectId(docId)
    const branchObjectId = new mongoose.Types.ObjectId(branchId)
    const result = await Partner.findByIdAndUpdate(objectId, {
      $pull: {
        relationBranches: { branchName: branchObjectId }
      }
    })
    if (result) {
      const allpartners = await Partner.find({}).populate({
        path: 'relationBranches.companyName',
        select: 'companyName' // Only populate these fields
      }).populate({ path: 'relationBranches.branchName', select: 'branchName' })
      return res.status(201).json({ message: "Delete successfully", data: allpartners })
    }

  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const DeleteService = async (req, res) => {
  const { id } = req.query

  const objectId = new mongoose.Types.ObjectId(id)

  try {
    // Perform the deletion
    const result = await Service.findByIdAndDelete(objectId)

    if (result) {
      return res.status(200).json({ message: " deleted successfully" })
    } else {
      return res.status(404).json({ message: "partner not found" })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Server error" })
  }
}

export const UpdateCallnotes = async (req, res) => {
  const { id } = req.query

  const objectId = new mongoose.Types.ObjectId(id)
  const formData = req.body
  if (!id) {
    return res.status(400).json({ message: "Invalid id" })
  }

  try {
    const updatedCallnotes = await CallNote.findByIdAndUpdate(
      objectId,
      formData,
      {
        new: true
      }
    )

    if (!updatedCallnotes) {
      return res.status(404).json({ message: "callnotes not found" })
    }

    res.status(200).json({ data: updatedCallnotes })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export const UpdatePartners = async (req, res) => {
  const { id } = req.query

  const objectId = new mongoose.Types.ObjectId(id)
  const formData = req.body
  if (!id) {
    return res.status(400).json({ message: "Invalid id" })
  }

  try {
    const transformedData = {
      partner: formData.partnerName,
      relationBranches: formData.branchName.map(branchId => ({
        companyName: formData.companyName,
        branchName: branchId
      }))
    }
    const updatedPartners = await Partner.findByIdAndUpdate(
      objectId,
      transformedData,
      {
        new: true,

        runValidators: true

      }
    )
    if (!updatedPartners) {
      return res.status(404).json({ message: "partners not found" })
    }

    res.status(200).json({ data: updatedPartners })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}
export const UpdateServices = async (req, res) => {
  const { id } = req.query

  const objectId = new mongoose.Types.ObjectId(id)
  const formData = req.body
  if (!id) {
    return res.status(400).json({ message: "Invalid id" })
  }

  try {
    const updatedService = await Service.findByIdAndUpdate(objectId, formData, {
      new: true
    })

    if (!updatedService) {
      return res.status(404).json({ message: "service not found" })
    }

    res.status(200).json({ data: updatedService })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}
export const GetselectedDateCalls = async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    const start = new Date(startDate);

    start.setHours(0, 0, 0, 0); // Start of the day
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // End of the day


    // const customerCalls = await CallRegistration.aggregate([

    //   {
    //     $match: {
    //       "callregistration": { $exists: true, $ne: [] },
    //       "callregistration.formdata.attendedBy": { $type: "array" }
    //     }
    //   }
    //   ,


    //   {
    //     $addFields: {
    //       callregistration: {
    //         $filter: {
    //           input: "$callregistration",
    //           as: "call",
    //           cond: {
    //             $gt: [
    //               {
    //                 $size: {
    //                   $filter: {
    //                     input: {
    //                       $ifNull: ["$$call.formdata.attendedBy", []]
    //                     },
    //                     as: "attendee",
    //                     cond: {
    //                       $and: [
    //                         { $ne: ["$$attendee.calldate", null] },
    //                         { $ne: ["$$attendee.calldate", ""] },
    //                         { $in: [{ $type: "$$attendee.calldate" }, ["string", "date"]] },
    //                         {
    //                           $gte: [
    //                             { $toDate: "$$attendee.calldate" },
    //                             start
    //                           ]
    //                         },
    //                         {
    //                           $lte: [
    //                             { $toDate: "$$attendee.calldate" },
    //                             end
    //                           ]
    //                         }
    //                       ]
    //                     }
    //                   }
    //                 }
    //               },
    //               0
    //             ]
    //           }
    //         }
    //       }
    //     }
    //   }

    //   ,
    //   {
    //     $match: {
    //       // Ensure callregistration array still contains at least one element after filtering
    //       callregistration: { $ne: [] }
    //     }
    //   },

    //   // Lookup for product details (and directly enrich the existing product field)
    //   {
    //     $lookup: {
    //       from: "products",
    //       localField: "callregistration.product",
    //       foreignField: "_id",
    //       as: "productDetails" // We temporarily store product details here
    //     }
    //   },

    //   // Lookup for attendedBy details (and directly enrich the existing attendedBy field)
    //   {
    //     $lookup: {
    //       from: "staffs",
    //       localField: "callregistration.formdata.attendedBy.callerId",
    //       foreignField: "_id",
    //       as: "attendedByDetails" // Temporary storage for attendedBy details
    //     }
    //   },

    //   // Lookup for completedBy details (and directly enrich the existing completedBy field)
    //   {
    //     $lookup: {
    //       from: "staffs",
    //       localField: "callregistration.formdata.completedBy.callerId",
    //       foreignField: "_id",
    //       as: "completedByDetails" // Temporary storage for completedBy details
    //     }
    //   },
    //   {
    //     $addFields: {
    //       // Map callregistration to include matched product details
    //       callregistration: {
    //         $map: {
    //           input: "$callregistration", // Iterate over callregistration array
    //           as: "registration",
    //           in: {
    //             $mergeObjects: [
    //               "$$registration", // Preserve existing callregistration fields
    //               {
    //                 productdetails: {
    //                   $arrayElemAt: [
    //                     {
    //                       $filter: {
    //                         input: "$productDetails", // Filter joined products
    //                         as: "product",
    //                         cond: {
    //                           $eq: ["$$product._id", "$$registration.product"] // Match product ID
    //                         }
    //                       }
    //                     },
    //                     0
    //                   ]
    //                 }
    //               }
    //             ]
    //           }
    //         }
    //       }
    //     }
    //   },
    //   {
    //     $addFields: {
    //       // Map callregistration to include attendedBy details
    //       callregistration: {
    //         $map: {
    //           input: "$callregistration", // Iterate over callregistration array
    //           as: "registration",
    //           in: {
    //             $mergeObjects: [
    //               "$$registration", // Preserve existing callregistration fields
    //               {
    //                 attendeddetails: {
    //                   $arrayElemAt: [
    //                     {
    //                       $filter: {
    //                         input: "$attendedByDetails", // Filter attendedBy details
    //                         as: "attended",
    //                         cond: {
    //                           $eq: [
    //                             "$$attended._id", // Match attendedBy user ID
    //                             {
    //                               $arrayElemAt: [
    //                                 "$$registration.formdata.attendedBy.callerId",
    //                                 0
    //                               ]
    //                             }
    //                           ]
    //                         }
    //                       }
    //                     },
    //                     0
    //                   ]
    //                 }
    //               }
    //             ]
    //           }
    //         }
    //       }
    //     }
    //   },
    //   {
    //     $addFields: {
    //       // Map callregistration to include completedBy details
    //       callregistration: {
    //         $map: {
    //           input: "$callregistration", // Iterate over callregistration array
    //           as: "registration",
    //           in: {
    //             $mergeObjects: [
    //               "$$registration", // Preserve existing callregistration fields
    //               {
    //                 completedbydetails: {
    //                   $arrayElemAt: [
    //                     {
    //                       $filter: {
    //                         input: "$completedByDetails", // Filter completedBy details
    //                         as: "completed",
    //                         cond: {
    //                           $eq: [
    //                             "$$completed._id", // Match completedBy user ID
    //                             {
    //                               $arrayElemAt: [
    //                                 "$$registration.formdata.completedBy.callerId",
    //                                 0
    //                               ]
    //                             }
    //                           ]
    //                         }
    //                       }
    //                     },
    //                     0
    //                   ]
    //                 }
    //               }
    //             ]
    //           }
    //         }
    //       }
    //     }
    //   },
    //   {
    //     $project: {
    //       customerName: 1, // Include necessary fields in the result

    //       callregistration: 1
    //     }
    //   }
    // ])
    const customerCalls = await CallRegistration.aggregate([
      {
        $match: {
          callregistration: { $exists: true, $ne: [] },
          "callregistration.formdata.attendedBy": { $type: "array" }
        }
      },

      {
        $addFields: {
          callregistration: {
            $filter: {
              input: "$callregistration",
              as: "call",
              cond: {
                $gt: [
                  {
                    $size: {
                      $filter: {
                        input: {
                          $ifNull: ["$$call.formdata.attendedBy", []]
                        },
                        as: "attendee",
                        cond: {
                          $and: [
                            { $ne: ["$$attendee.calldate", null] },
                            { $ne: ["$$attendee.calldate", ""] },
                            {
                              $in: [
                                { $type: "$$attendee.calldate" },
                                ["string", "date"]
                              ]
                            },
                            {
                              $gte: [
                                { $toDate: "$$attendee.calldate" },
                                start
                              ]
                            },
                            {
                              $lte: [
                                { $toDate: "$$attendee.calldate" },
                                end
                              ]
                            }
                          ]
                        }
                      }
                    }
                  },
                  0
                ]
              }
            }
          }
        }
      },

      {
        $match: {
          callregistration: { $ne: [] }
        }
      },

      {
        $lookup: {
          from: "products",
          localField: "callregistration.product",
          foreignField: "_id",
          as: "productDetails"
        }
      },

      {
        $lookup: {
          from: "staffs",
          localField: "callregistration.formdata.attendedBy.callerId",
          foreignField: "_id",
          as: "attendedByStaffDetails"
        }
      },

      {
        $lookup: {
          from: "admins",
          localField: "callregistration.formdata.attendedBy.callerId",
          foreignField: "_id",
          as: "attendedByAdminDetails"
        }
      },

      {
        $lookup: {
          from: "staffs",
          localField: "callregistration.formdata.completedBy.callerId",
          foreignField: "_id",
          as: "completedByStaffDetails"
        }
      },

      {
        $lookup: {
          from: "admins",
          localField: "callregistration.formdata.completedBy.callerId",
          foreignField: "_id",
          as: "completedByAdminDetails"
        }
      },

      {
        $addFields: {
          attendedByDetails: {
            $concatArrays: [
              { $ifNull: ["$attendedByStaffDetails", []] },
              { $ifNull: ["$attendedByAdminDetails", []] }
            ]
          },
          completedByDetails: {
            $concatArrays: [
              { $ifNull: ["$completedByStaffDetails", []] },
              { $ifNull: ["$completedByAdminDetails", []] }
            ]
          }
        }
      },

      {
        $addFields: {
          callregistration: {
            $map: {
              input: "$callregistration",
              as: "registration",
              in: {
                $mergeObjects: [
                  "$$registration",
                  {
                    productdetails: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$productDetails",
                            as: "product",
                            cond: {
                              $eq: ["$$product._id", "$$registration.product"]
                            }
                          }
                        },
                        0
                      ]
                    }
                  }
                ]
              }
            }
          }
        }
      },

      {
        $addFields: {
          callregistration: {
            $map: {
              input: "$callregistration",
              as: "registration",
              in: {
                $mergeObjects: [
                  "$$registration",
                  {
                    attendeddetails: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$attendedByDetails",
                            as: "attended",
                            cond: {
                              $eq: [
                                "$$attended._id",
                                {
                                  $arrayElemAt: [
                                    {
                                      $ifNull: [
                                        "$$registration.formdata.attendedBy.callerId",
                                        []
                                      ]
                                    },
                                    0
                                  ]
                                }
                              ]
                            }
                          }
                        },
                        0
                      ]
                    }
                  }
                ]
              }
            }
          }
        }
      },

      {
        $addFields: {
          callregistration: {
            $map: {
              input: "$callregistration",
              as: "registration",
              in: {
                $mergeObjects: [
                  "$$registration",
                  {
                    completedbydetails: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$completedByDetails",
                            as: "completed",
                            cond: {
                              $eq: [
                                "$$completed._id",
                                {
                                  $arrayElemAt: [
                                    {
                                      $ifNull: [
                                        "$$registration.formdata.completedBy.callerId",
                                        []
                                      ]
                                    },
                                    0
                                  ]
                                }
                              ]
                            }
                          }
                        },
                        0
                      ]
                    }
                  }
                ]
              }
            }
          }
        }
      },

      {
        $project: {
          customerName: 1,
          callregistration: 1
        }
      }
    ])

    return res
      .status(200)
      .json({ message: "customercalls found", data: customerCalls })
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "internal server error" })
  }
}
export const CallnoteRegistration = async (req, res) => {
  try {
    const formdata = req.body

    const existingItem = await CallNote.findOne({
      callNotes: formdata.callNotes
    })
    if (existingItem) {
      return res
        .status(400)
        .json({ message: "This callnotes  is already registered" })
    }

    // Create and save call notes
    const collection = new CallNote({
      callNotes: formdata.callNotes
    })

    await collection.save()

    res.status(200).json({
      status: true,
      message: "Call notes created successfully",
      data: collection
    })
  } catch (error) {
    console.log("error:", error.message)
  }
}
export const PartnerRegistration = async (req, res) => {
  try {
    const formdata = req.body

    const existingItem = await Partner.findOne({
      partner: formdata.partner
    })
    if (existingItem) {
      return res
        .status(400)
        .json({ message: "This callnotes  is already registered" })
    }

    // Create partner

    await Partner.create({
      partner: formdata.partnerName.toUpperCase(),
      relationBranches: formdata.branchName.map(branchId => ({
        companyName: formdata.companyName,
        branchName: branchId
      }))
    });


    res.status(200).json({
      status: true,
      message: "Partner created successfully",

    })
  } catch (error) {
    console.log("error:", error.message)
  }
}
export const ServicesRegistration = async (req, res) => {
  try {
    const formdata = req.body
    const { serviceName, price, company, branch } = formdata

    const existingItem = await Service.findOne({
      serviceName
    })
    if (existingItem) {
      return res
        .status(400)
        .json({ message: "This service is already registered" })
    }

    // Create and save call notes
    const collection = new Service({
      serviceName,
      price,
      company,
      branch
    })

    await collection.save()

    res.status(200).json({
      status: true,
      message: "Service created successfully"
    })
  } catch (error) {
    console.log("error:", error.message)
  }
}

export const CustomerRegister = async (req, res) => {
  const { customerData, tabledata = [] } = req.body
  const { createdfrom } = req.query
  const {
    customerName,
    customerid,
    address1,
    address2,
    country,
    state,
    city,
    pincode,
    contactPerson,
    email,
    mobile,
    landline,
    registrationType,
    gstNo
  } = customerData
  if (tabledata && tabledata?.length > 0) {
    // const licenseNumbers = tabledata.map((item) => item.licensenumber)
    const licenseNumbers = tabledata
      .filter(
        (item) =>
          item?.licensenumber !== null &&
          item?.licensenumber !== undefined &&
          String(item.licensenumber).trim() !== ""
      )
      .map((item) => item.licensenumber)
    // Check if user already exists

    const existingLicenses = await License.find({
      licensenumber: { $in: licenseNumbers }
    })
    if (existingLicenses && existingLicenses?.length > 0) {
      return res
        .status(400)
        .json({ message: "License number already registered" })
    }
  }

  try {
    const normalizedPartner =
      customerData.partner && customerData.partner.trim() !== ""
        ? customerData.partner
        : null
    const customer = new Customer({
      customerName,
      address1,
      address2,
      country,
      state,
      city,
      pincode,
      createdFrom: createdfrom,
      email,

      mobile,
      landline,
      registrationType,
      gstNo,
      partner: normalizedPartner,
      contactPerson,
      selected: tabledata
    })
    const customerdata = await customer.save()
    if (tabledata && tabledata.length > 0) {
      for (const item of customerdata.selected) {
        const license = new License({
          products: item.product_id,
          customerName: customerdata._id, // Using the customer ID from the parent object
          licensenumber: item.licensenumber
        })

        await license.save()
      }
    }

    return res.status(200).json({
      status: true,
      message: "Customer created successfully"
    })
  } catch (error) {
    console.log("error:", error)
    res.status(500).json({ message: "server error" })
  }
}
export const CustomereditonLead = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { customerData } = req.body;


    if (!customerData?.customerid) {
      return res.status(400).json({ message: "Customerid is required" });
    }

    if (!customerData?.leadid) {
      return res.status(400).json({ message: "Leadid is required" });
    }

    if (
      !isValidObjectId(customerData.customerid) ||
      !isValidObjectId(customerData.leadid)
    ) {
      return res
        .status(400)
        .json({ message: "Customerid or leadid is not a valid ObjectId" });
    }

    let updatedcustomer = null;
    let updateleadmaster = null;

    await session.withTransaction(async () => {
      updatedcustomer = await Customer.findOneAndUpdate(
        { _id: customerData.customerid },
        {
          $set: {
            customerName: customerData?.customerName?.trim(),
            email: customerData?.email?.trim(),
            mobile: customerData?.mobile?.trim(),
            landline: customerData?.landline?.trim(),
            contactPerson: customerData?.contactPerson?.trim(),
            address1: customerData?.address1?.trim(),
            country: customerData?.country?.trim(),
            state: customerData?.state?.trim(),
            city: customerData?.city?.trim(),
            pincode: customerData?.pincode?.trim(),
            partner: customerData?.partner || null,
            registrationType: customerData?.registrationType || null
          }
        },
        {
          returnDocument: "after",
          runValidators: true,
          session
        }
      );

      if (!updatedcustomer) {
        throw new Error("Customer not found");
      }

      updateleadmaster = await LeadMaster.findOneAndUpdate(
        { _id: customerData.leadid },
        {
          $set: {
            mobile: customerData?.mobile?.trim(),
            email: customerData?.email?.trim(),
            phone: customerData?.landline?.trim(),
            partner: customerData?.partner || null
          }
        },
        {
          returnDocument: "after",
          runValidators: true,
          session
        }
      );

      if (!updateleadmaster) {
        throw new Error("LeadMaster not found");
      }
    });

    return res.status(200).json({
      message: "Customer and lead updated successfully",
      data: updatedcustomer
    });
  } catch (error) {
    console.log("error", error.message);

    if (error.message === "Customer not found" || error.message === "LeadMaster not found") {
      return res.status(404).json({ message: error.message });
    }

    return res.status(500).json({ message: "Internal server error" });
  } finally {
    await session.endSession();
  }
};
// export const CustomerEdit = async (req, res) => {
//   const { customerData, tableData } = req.body


//   const { customerid, index } = req.query

//   // Ensure index is a number
//   const parsedIndex = parseInt(index, 10)

//   if (!customerid || !customerData) {
//     return res
//       .status(400)
//       .json({ message: "Customer ID and data are required" })
//   }

//   try {
//     const objectId = new mongoose.Types.ObjectId(customerid)

//     // Find the existing customer
//     const existingCustomer = await Customer.findById(objectId)
//     if (!existingCustomer) {
//       return res.status(404).json({ message: "Customer not found" })
//     }

//     // Update formdata (overwrite existing fields with new ones)
//     Object.assign(existingCustomer, customerData)
//     existingCustomer.selected = tableData



//     // Save the updated customer document
//     await existingCustomer.save()

//     res.status(200).json({
//       message: "Customer updated successfully"
//     })
//   } catch (error) {
//     console.error("Error updating customer:", error.message)
//     res.status(500).json({ message: "Internal server error" })
//   }
// }
// export const CustomerEdit = async (req, res) => {
//   const { customerData, tableData = [] } = req.body
//   const { customerid, index } = req.query

//   const parsedIndex = parseInt(index, 10)

//   if (!customerid || !customerData) {
//     return res
//       .status(400)
//       .json({ message: "Customer ID and data are required" })
//   }

//   try {
//     const objectId = new mongoose.Types.ObjectId(customerid)

//     const existingCustomer = await Customer.findById(objectId)
//     if (!existingCustomer) {
//       return res.status(404).json({ message: "Customer not found" })
//     }
// console.log("exissssss",existingCustomer)

//     Object.assign(existingCustomer, customerData)
//     // existingCustomer.selected = tableData
// const updatedSelected = existingCustomer.selected.map((existingItem) => {
//   const incomingItem = tableData.find(
//     (item) =>
//       String(item.productid || item.product_id) ===
//       String(existingItem.productid || existingItem.product_id)
//   );

//   if (!incomingItem) return existingItem;

//   // Merge taggeddata
//   const mergedTaggedData = [...(existingItem.taggeddata || [])];

//   (incomingItem.taggeddata || []).forEach((incomingTag) => {
//     const index = mergedTaggedData.findIndex(
//       (tag) => String(tag.licensenumber) === String(incomingTag.licensenumber)
//     );

//     if (index >= 0) {
//       mergedTaggedData[index] = {
//         ...mergedTaggedData[index],
//         ...incomingTag
//       };
//     } else {
//       mergedTaggedData.push(incomingTag);
//     }
//   });

//   return {
//     ...existingItem,
//     ...incomingItem,
//     taggeddata: mergedTaggedData
//   };
// });

// existingCustomer.selected = updatedSelected;

//     await existingCustomer.save()

//     const directLicenseNumbers = tableData
//       .filter(
//         (item) =>
//           item?.licensenumber !== null &&
//           item?.licensenumber !== undefined &&
//           String(item?.licensenumber).trim() !== ""
//       )
//       .map((item) => ({
//         licensenumber: Number(item.licensenumber),
//         productid: item?.productid || item?.product_id || null
//       }))

//     const taggedLicenseNumbers = tableData.flatMap((item) =>
//       Array.isArray(item?.taggeddata)
//         ? item.taggeddata
//           .filter(
//             (tag) =>
//               tag?.licensenumber !== null &&
//               tag?.licensenumber !== undefined &&
//               String(tag?.licensenumber).trim() !== ""
//           )
//           .map((tag) => ({
//             licensenumber: Number(tag.licensenumber),
//             productid: item?.productid || item?.product_id || null
//           }))
//         : []
//     )

//     const allLicenses = [...directLicenseNumbers]

//     const uniqueLicenseMap = new Map()
//     for (const item of allLicenses) {
//       if (!uniqueLicenseMap.has(String(item.licensenumber))) {
//         uniqueLicenseMap.set(String(item.licensenumber), item)
//       }
//     }

//     const uniqueLicenses = Array.from(uniqueLicenseMap.values())
//     const licenseNumbers = uniqueLicenses.map((item) => item.licensenumber)

//     if (licenseNumbers.length > 0) {
//       const existingLicenses = await License.find({
//         customerName: existingCustomer._id,
//         licensenumber: { $in: licenseNumbers }
//       }).select("licensenumber")

//       const existingLicenseSet = new Set(
//         existingLicenses.map((item) => String(item.licensenumber))
//       )

//       const newLicenses = uniqueLicenses.filter(
//         (item) => !existingLicenseSet.has(String(item.licensenumber))
//       )

//       if (newLicenses.length > 0) {
//         const licenseDocs = newLicenses.map((item) => ({
//           products: item.productid,
//           customerName: existingCustomer._id,
//           licensenumber: item.licensenumber
//         }))

//         await License.insertMany(licenseDocs)
//       }
//     }

//     return res.status(200).json({
//       message: "Customer updated successfully"
//     })
//   } catch (error) {
//     console.error("Error updating customer:", error.message)
//     return res.status(500).json({ message: "Internal server error" })
//   }
// }

/**
 * Lightweight typed error so the catch block can distinguish
 * "expected" failures (bad input, not found) from real server errors
 * and respond with the right status code instead of a blanket 500.
 */
// class AppError extends Error {
//   constructor(message, statusCode = 500) {
//     super(message)
//     this.statusCode = statusCode
//   }
// }

// export const CustomerEdit = async (req, res) => {
//   const { customerData, tableData = [] } = req.body
// console.log("tabledata",tableData)
//   const { customerid } = req.query

//   // ---- Fast-fail validation before we ever open a session ----
//   if (!customerid || !customerData) {
//     return res
//       .status(400)
//       .json({ message: "Customer ID and data are required" })
//   }

//   if (!mongoose.Types.ObjectId.isValid(customerid)) {
//     return res.status(400).json({ message: "Invalid customer ID" })
//   }

//   const session = await mongoose.startSession()

//   try {
//     session.startTransaction()

//     const objectId = new mongoose.Types.ObjectId(customerid)

//     const existingCustomer = await Customer.findById(objectId).session(session)
//     if (!existingCustomer) {
//       throw new AppError("Customer not found", 404)
//     }

//     Object.assign(existingCustomer, customerData)

//     const updatedSelected = existingCustomer.selected.map((existingItem) => {
//       const incomingItem = tableData.find(
//         (item) =>
//           String(item.productid || item.product_id) ===
//           String(existingItem.productid || existingItem.product_id)
//       )

//       if (!incomingItem) return existingItem

//       // Merge taggeddata
//       const mergedTaggedData = [...(existingItem.taggeddata || [])]

//       ;(incomingItem.taggeddata || []).forEach((incomingTag) => {
//         const tagIndex = mergedTaggedData.findIndex(
//           (tag) =>
//             String(tag.licensenumber) === String(incomingTag.licensenumber)
//         )

//         if (tagIndex >= 0) {
//           mergedTaggedData[tagIndex] = {
//             ...mergedTaggedData[tagIndex],
//             ...incomingTag
//           }
//         } else {
//           mergedTaggedData.push(incomingTag)
//         }
//       })

//       return {
//         ...existingItem,
//         ...incomingItem,
//         taggeddata: mergedTaggedData
//       }
//     })

//     existingCustomer.selected = updatedSelected

//     await existingCustomer.save({ session })

//     const directLicenseNumbers = tableData
//       .filter(
//         (item) =>
//           item?.licensenumber !== null &&
//           item?.licensenumber !== undefined &&
//           String(item?.licensenumber).trim() !== ""
//       )
//       .map((item) => ({
//         licensenumber: Number(item.licensenumber),
//         productid: item?.productid || item?.product_id || null
//       }))

//     // NOTE: kept from the original — tagged license numbers are computed
//     // but not currently merged into `allLicenses`. Left as-is since I
//     // don't know if that's intentional; flip the line below if you want
//     // tagged licenses included too:
//     // const allLicenses = [...directLicenseNumbers, ...taggedLicenseNumbers]
//     const taggedLicenseNumbers = tableData.flatMap((item) =>
//       Array.isArray(item?.taggeddata)
//         ? item.taggeddata
//             .filter(
//               (tag) =>
//                 tag?.licensenumber !== null &&
//                 tag?.licensenumber !== undefined &&
//                 String(tag?.licensenumber).trim() !== ""
//             )
//             .map((tag) => ({
//               licensenumber: Number(tag.licensenumber),
//               productid: item?.productid || item?.product_id || null
//             }))
//         : []
//     )

//     const allLicenses = [...directLicenseNumbers]

//     const uniqueLicenseMap = new Map()
//     for (const item of allLicenses) {
//       if (!uniqueLicenseMap.has(String(item.licensenumber))) {
//         uniqueLicenseMap.set(String(item.licensenumber), item)
//       }
//     }

//     const uniqueLicenses = Array.from(uniqueLicenseMap.values())
//     const licenseNumbers = uniqueLicenses.map((item) => item.licensenumber)

//     if (licenseNumbers.length > 0) {
//       const existingLicenses = await License.find({
//         customerName: existingCustomer._id,
//         licensenumber: { $in: licenseNumbers }
//       })
//         .session(session)
//         .select("licensenumber")

//       const existingLicenseSet = new Set(
//         existingLicenses.map((item) => String(item.licensenumber))
//       )

//       const newLicenses = uniqueLicenses.filter(
//         (item) => !existingLicenseSet.has(String(item.licensenumber))
//       )

//       if (newLicenses.length > 0) {
//         const licenseDocs = newLicenses.map((item) => ({
//           products: item.productid,
//           customerName: existingCustomer._id,
//           licensenumber: item.licensenumber
//         }))

//         await License.insertMany(licenseDocs, { session })
//       }
//     }

//     await session.commitTransaction()

//     return res.status(200).json({ message: "Customer updated successfully" })
//   } catch (error) {
//     // Roll back every write made in this session (customer save +
//     // license inserts) so a failure never leaves partial data behind.
//     await session.abortTransaction()

//     console.error("Error updating customer:", error.message)

//     if (error instanceof AppError) {
//       return res.status(error.statusCode).json({ message: error.message })
//     }

//     // Mongoose validation errors -> 400 instead of a generic 500
//     if (error.name === "ValidationError") {
//       return res.status(400).json({ message: error.message })
//     }

//     // Invalid ObjectId thrown further down the pipeline -> 400
//     if (error.name === "CastError") {
//       return res.status(400).json({ message: "Invalid ID format" })
//     }

//     return res.status(500).json({ message: "Internal server error" })
//   } finally {
//     session.endSession()
//   }
// }
/**
 * Lightweight typed error so the catch block can distinguish
 * "expected" failures (bad input, not found) from real server errors
 * and respond with the right status code instead of a blanket 500.
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message)
    this.statusCode = statusCode
  }
}

export const CustomerEdit = async (req, res) => {
  const { customerData, tableData = [] } = req.body
  const { customerid } = req.query


  // ---- Fast-fail validation before we ever open a session ----
  if (!customerid || !customerData) {
    return res
      .status(400)
      .json({ message: "Customer ID and data are required" })
  }

  if (!mongoose.Types.ObjectId.isValid(customerid)) {
    return res.status(400).json({ message: "Invalid customer ID" })
  }

  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    const objectId = new mongoose.Types.ObjectId(customerid)

    const existingCustomer = await Customer.findById(objectId).session(session)
    if (!existingCustomer) {
      throw new AppError("Customer not found", 404)
    }

    Object.assign(existingCustomer, customerData)

    const keyOf = (item) => String(item?.productid || item?.product_id)

    const existingMap = new Map(
      existingCustomer.selected.map((item) => [keyOf(item), item])
    )

    const incomingKeys = new Set(tableData.map((item) => keyOf(item)))

    // Anything already selected that this payload didn't touch — keep as-is.
    const untouchedExisting = existingCustomer.selected.filter(
      (item) => !incomingKeys.has(keyOf(item))
    )

    // Every item in the incoming payload: merge taggeddata if it already
    // existed, or add it outright if it's a brand-new selection (this is
    // the case that was silently getting dropped before — a product with
    // no matching existingItem never got visited by the old .map()).
    const mergedOrNew = tableData.map((incomingItem) => {
      const existingItem = existingMap.get(keyOf(incomingItem))

      if (!existingItem) return incomingItem

      const mergedTaggedData = [...(existingItem.taggeddata || [])]

      ;(incomingItem.taggeddata || []).forEach((incomingTag) => {
        const tagIndex = mergedTaggedData.findIndex(
          (tag) =>
            String(tag.licensenumber) === String(incomingTag.licensenumber)
        )

        if (tagIndex >= 0) {
          mergedTaggedData[tagIndex] = {
            ...mergedTaggedData[tagIndex],
            ...incomingTag
          }
        } else {
          mergedTaggedData.push(incomingTag)
        }
      })

      return {
        ...existingItem,
        ...incomingItem,
        taggeddata: mergedTaggedData
      }
    })

    existingCustomer.selected = [...untouchedExisting, ...mergedOrNew]

    await existingCustomer.save({ session })

    const directLicenseNumbers = tableData
      .filter(
        (item) =>
          item?.licensenumber !== null &&
          item?.licensenumber !== undefined &&
          String(item?.licensenumber).trim() !== ""
      )
      .map((item) => ({
        licensenumber: Number(item.licensenumber),
        productid: item?.productid || item?.product_id || null
      }))

    // NOTE: kept from the original — tagged license numbers are computed
    // but not currently merged into `allLicenses`. Left as-is since I
    // don't know if that's intentional; flip the line below if you want
    // tagged licenses included too:
    // const allLicenses = [...directLicenseNumbers, ...taggedLicenseNumbers]
    const taggedLicenseNumbers = tableData.flatMap((item) =>
      Array.isArray(item?.taggeddata)
        ? item.taggeddata
            .filter(
              (tag) =>
                tag?.licensenumber !== null &&
                tag?.licensenumber !== undefined &&
                String(tag?.licensenumber).trim() !== ""
            )
            .map((tag) => ({
              licensenumber: Number(tag.licensenumber),
              productid: item?.productid || item?.product_id || null
            }))
        : []
    )

    const allLicenses = [...directLicenseNumbers]

    const uniqueLicenseMap = new Map()
    for (const item of allLicenses) {
      if (!uniqueLicenseMap.has(String(item.licensenumber))) {
        uniqueLicenseMap.set(String(item.licensenumber), item)
      }
    }

    const uniqueLicenses = Array.from(uniqueLicenseMap.values())
    const licenseNumbers = uniqueLicenses.map((item) => item.licensenumber)

    if (licenseNumbers.length > 0) {
      const existingLicenses = await License.find({
        customerName: existingCustomer._id,
        licensenumber: { $in: licenseNumbers }
      })
        .session(session)
        .select("licensenumber")

      const existingLicenseSet = new Set(
        existingLicenses.map((item) => String(item.licensenumber))
      )

      const newLicenses = uniqueLicenses.filter(
        (item) => !existingLicenseSet.has(String(item.licensenumber))
      )

      if (newLicenses.length > 0) {
        const licenseDocs = newLicenses.map((item) => ({
          products: item.productid,
          customerName: existingCustomer._id,
          licensenumber: item.licensenumber
        }))

        await License.insertMany(licenseDocs, { session })
      }
    }

    await session.commitTransaction()

    return res.status(200).json({ message: "Customer updated successfully" })
  } catch (error) {
    // Roll back every write made in this session (customer save +
    // license inserts) so a failure never leaves partial data behind.
    await session.abortTransaction()

    console.error("Error updating customer:", error.message)

    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message })
    }

    // Mongoose validation errors -> 400 instead of a generic 500
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message })
    }

    // Invalid ObjectId thrown further down the pipeline -> 400
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid ID format" })
    }

    return res.status(500).json({ message: "Internal server error" })
  } finally {
    session.endSession()
  }
}
export const DeleteCustomer = async (req, res) => {
  const { id } = req.query

  try {
    // Perform the deletion
    const result = await Customer.findByIdAndDelete(id)

    if (result) {
      return res.status(200).json({ message: "Customer deleted successfully" })
    } else {
      return res.status(404).json({ message: "Customer not found" })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Server error" })
  }
}
export const GetallproductmissingCustomer = async (req, res) => {
  try {
    const { branchselected } = req.query
    const branchIds = Array.isArray(branchselected)
      ? branchselected
      : [branchselected];


    const customers = await Customer.find({
      // Match documents where the "selected" array has at least one element that satisfies:
      selected: {
        $elemMatch: {
          branch_id: { $in: branchIds },     // branch_id must match one of the given branchIds
          $or: [
            { product_id: { $exists: false } }, // product_id field is missing
            { product_id: null }                // OR product_id is explicitly null
          ]
        }
      }
    })
      // Use collation to make sorting case-insensitive (so "Apple" and "apple" are treated the same)
      .collation({ locale: "en", strength: 2 })
      // Sort results alphabetically by customerName (A → Z)
      .sort({ customerName: 1 })

    res.status(200).json({ message: "custoemers without productmissing found", data: customers });


  } catch (error) {
    console.log("error", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const GetAllCustomer = async (req, res) => {
  try {
    const { branchSelected } = req.query



    if (!branchSelected) {
      return res.status(400).json({ message: "branch id is missing" })

    }
    //     const customers = await Customer.aggregate([

    //       {
    //         $project: {
    //           _id: 1, // Exclude _id
    //           customerName: 1,
    //           address1: 1,
    //           "selected.licensenumber": 1,
    //           "selected.branch_id": 1,
    //           "selected.branchName": 1,
    //           "selected.productName": 1,
    //           "selected.product_id": 1,
    //           mobile: 1,
    //           landline: 1,
    //           email: 1,
    // partner:1
    //         }
    //       }
    //     ])
    // const customers = await Customer.aggregate([
    //   {
    //     $lookup: {
    //       from: "partners",              // collection name
    //       localField: "partner",         // field in Customer
    //       foreignField: "_id",           // field in Partner
    //       as: "partnerDoc"               // joined array field
    //     }
    //   },
    //   {
    //     $unwind: {
    //       path: "$partnerDoc",
    //       preserveNullAndEmptyArrays: true // keep customers without partner
    //     }
    //   },
    //   {
    //     $project: {
    //       _id: 1,
    //       customerName: 1,
    //       address1: 1,
    //       "selected.licensenumber": 1,
    //       "selected.branch_id": 1,
    //       "selected.branchName": 1,
    //       "selected.productName": 1,
    //       "selected.product_id": 1,
    //       mobile: 1,
    //       landline: 1,
    //       email: 1,
    //       partner: 1,                    // original partner id
    //       // specific partner fields
    //       "partnerDoc._id": 1,
    //       "partnerDoc.name": 1,
    //       "partnerDoc.email": 1
    //     }
    //   }
    // ]);
    // const customers = await Customer.aggregate([
    //   {
    //     $lookup: {
    //       from: "partners",          // collection name
    //       localField: "partner",     // field in Customer
    //       foreignField: "_id",       // field in Partner
    //       as: "partnerDoc"           // joined array
    //     }
    //   },
    //   {
    //     $unwind: {
    //       path: "$partnerDoc",
    //       preserveNullAndEmptyArrays: true, // keep customers without partner
    //     }
    //   },
    //   {
    //     $project: {
    //       _id: 1,
    //       customerName: 1,
    //       address1: 1,
    //       mobile: 1,
    //       landline: 1,
    //       email: 1,
    //       selected: 1,
    //       partner: 1,
    //       "partnerDoc._id": 1,
    //       "partnerDoc.name": 1,
    //     }
    //   },
    // ]);
    const customers = await Customer.aggregate([
      {
        $lookup: {
          from: "partners",        // collection name
          localField: "partner",   // field in Customer
          foreignField: "_id",     // field in Partner
          as: "partnerDoc"
        }
      },
      {
        $unwind: {
          path: "$partnerDoc",
          preserveNullAndEmptyArrays: true,
        }
      },
      {
        $project: {
          _id: 1,
          customerName: 1,
          address1: 1,
          mobile: 1,
          landline: 1,
          email: 1,
          selected: 1,
          partner: 1,
          // pick partner name from the correct field
          "partnerDoc._id": 1,
          "partnerDoc.partner": 1,    // NOT partnerDoc.name
          // or alias it:
          partnerName: "$partnerDoc.partner",
        }
      },
    ]);


    const objectIds = new mongoose.Types.ObjectId(branchSelected)
    const filteredCustomers = customers.filter(
      (customer) =>

        //Include customers where `selected` is undefined or empty
        !Array.isArray(customer.selected) ||
        customer.selected.length === 0 ||
        // Or those with at least one matching branch_id
        customer.selected.some((selection) =>
          objectIds.equals(selection.branch_id))

    )

    return res
      .status(200)
      .json({ message: "customers found", data: filteredCustomers })

  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Internal server error" })
  }
}



export const GetselectedCustomerForCall = async (req, res) => {
  try {
    const customerId = req.params.id;
    // console.log("ciddddd", customerId);

    const customer = await Customer.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(customerId) } },
      {
        $lookup: {
          from: "partners",
          localField: "partner",
          foreignField: "_id",
          as: "partnerDetails"
        }
      },

      // Unwind the 'selected' array to join each branch/product separately
      { $unwind: { path: "$selected", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "companies",
          localField: "selected.company_id",
          foreignField: "_id",
          as: "companyDetails"
        }
      },
      { $unwind: { path: "$companyDetails", preserveNullAndEmptyArrays: true } },

      // Lookup branch details
      {
        $lookup: {
          from: "branches",
          localField: "selected.branch_id",
          foreignField: "_id",
          as: "branchDetails"
        }
      },
      { $unwind: { path: "$branchDetails", preserveNullAndEmptyArrays: true } },

      // Lookup product details
      {
        $lookup: {
          from: "products",
          localField: "selected.product_id",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } },


      {
        $addFields: {
          "selected.product_id": "$productDetails",
          "selected.branch_id": "$branchDetails",
          "selected.company_id": "$companyDetails"
        }
      },

      // Group back to restore original customer document structure
      {
        $group: {
          _id: "$_id",
          customerName: { $first: "$customerName" },
          email: { $first: "$email" },
          mobile: { $first: "$mobile" },
          address1: { $first: "$address1" },
          state: { $first: "$state" },
          pincode: { $first: "$pincode" },
          industry: { $first: "$industry" },

          partner: { $first: "$partnerDetails" },
          selected: { $push: "$selected" } // push all selected with branch/product details
        }
      }
    ]);

    if (!customer || customer.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res.status(200).json({ messaage: "customer found", data: customer });
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// export const GetCustomer = async (req, res) => {
//   const search = req.query?.search
//   const role = req.query?.role
//   const userBranch = req.query?.userBranch

//   const pendingCustomerList = req.query?.pendingCustomerList
//   let objectIds
//   let parsedBranch

//   if (userBranch) {
//     parsedBranch = JSON.parse(decodeURIComponent(userBranch))
//   }

//   if (
//     search &&
//     Array.isArray(parsedBranch) &&
//     parsedBranch.length > 0 &&
//     role !== "Admin"
//   ) {
//     const branches = JSON.parse(decodeURIComponent(userBranch))
//     objectIds = branches?.map((id) => new mongoose.Types.ObjectId(id))
//   } else {
//     objectIds = parsedBranch?.map((id) => new mongoose.Types.ObjectId(id))
//   }

//   try {
//     if (
//       search &&
//       Array.isArray(parsedBranch) &&
//       parsedBranch.length > 0 &&
//       role !== "Admin"
//     ) {
//       if (!isNaN(search)) {
//         const searchRegex = new RegExp(`^${search}`, "i")

//         const mobileCustomer = await Customer.find({
//           mobile: searchRegex
//         }).lean()

//         const licenseCustomer = await Customer.find({
//           $expr: {
//             $gt: [
//               {
//                 $size: {
//                   $filter: {
//                     input: "$selected",
//                     as: "item",
//                     cond: {
//                       $regexMatch: {
//                         input: { $toString: "$$item.licensenumber" }, // Convert to string
//                         regex: search, // your regex pattern
//                         options: "i" // case-insensitive if needed
//                       }
//                     }
//                   }
//                 }
//               },
//               0
//             ]
//           }
//         }).lean()
//         const customers = [...mobileCustomer, ...licenseCustomer]

//         if (!customers || customers.length === 0) {
//           return res
//             .status(404)
//             .json({ message: "No customer found", data: [] })
//         } else {
//           return res
//             .status(200)
//             .json({ message: "Customer(s) found", data: customers })
//         }
//       } else {

//         // Search by customer name
//         const searchRegex = new RegExp(`^${search}`, "i")
//         console.log("searchregex", searchRegex)
//         const customers = await Customer.aggregate([
//           // 1. FIRST: Populate partner to search by partner name
//           {
//             $lookup: {
//               from: "partners",
//               localField: "partner",
//               foreignField: "_id",
//               as: "partnerDetails"
//             }
//           },
//           {
//             $addFields: {
//               partnerName: { $arrayElemAt: ["$partnerDetails.partner", 0] }
//             }
//           },
//           //match customername or partnername

//           {
//             $match: {
//               $or: [
//                 { customerName: searchRegex },
//                 { partnerName: searchRegex }
//               ],
//               "selected.branch_id": { $in: objectIds } // Match branch_id within the selected array
//             }
//           },
//           {
//             $unwind: {
//               path: "$selected", // Unwind the selected array to access individual items
//               preserveNullAndEmptyArrays: true // Keep empty arrays if any
//             }
//           },
//           {
//             $addFields: {
//               "selected.branchObjectId": { $toObjectId: "$selected.branch_id" },
//               "selected.companyObjectId": {
//                 $toObjectId: "$selected.company_id"
//               },
//               "selected.productObjectId": {
//                 $toObjectId: "$selected.product_id"
//               },
//               partnerObjectId: {
//                 $toObjectId: "$partner"
//               }
//             }
//           },

//           {
//             $lookup: {
//               from: "branches", // Name of the Branch collection
//               localField: "selected.branchObjectId", // Field from the customer document
//               foreignField: "_id", // Match the _id field from the Branch collection
//               as: "branchDetails" // Alias for the resulting joined branch documents
//             }
//           },
//           {
//             $lookup: {
//               from: "companies", // Name of the Company collection
//               localField: "selected.companyObjectId", // Field from the customer document
//               foreignField: "_id", // Match the _id field from the Company collection
//               as: "companyDetails" // Alias for the resulting joined company documents
//             }
//           },
//           {
//             $lookup: {
//               from: "products", // Name of the Product collection
//               localField: "selected.productObjectId", // Field from the customer document
//               foreignField: "_id", // Match the _id field from the Product collection
//               as: "productDetails" // Alias for the resulting joined product documents
//             }
//           },

//           {
//             $addFields: {
//               partner: { $arrayElemAt: ["$partnerDetails", 0] },
//               "selected.product_id": { $arrayElemAt: ["$productDetails", 0] },
//               "selected.branch_id": { $arrayElemAt: ["$branchDetails", 0] },
//               "selected.company_id": { $arrayElemAt: ["$companyDetails", 0] } // Replace product_id with populated product data
//             }
//           },

//           {
//             $group: {
//               _id: "$_id", // Group by the customer's _id
//               customerName: { $first: "$customerName" }, // Keep customer name
//               address1: { $first: "$address1" },
//               state: { $first: "$state" },
//               pincode: { $first: "$pincode" },
//               email: { $first: "$email" },
//               mobile: { $first: "$mobile" },
//               partner: { $first: "$partner" },
//               industry: { $first: "$industry" },
//               selected: { $push: "$selected" } // Push the selected data
//             }
//           }
//         ])

//         if (customers.length > 0) {
//           return res
//             .status(200)
//             .json({ message: "Customer(s) found", data: customers })
//         } else {
//           return res
//             .status(200)
//             .json({ message: "No customer found", data: [] })
//         }
//       }
//     } else if (search && role === "Admin") {
//       if (!isNaN(search)) {
//         const searchRegex = new RegExp(`^${search}`, "i")


//         const mobileCustomer = await Customer.aggregate([
//           {
//             $match: {
//               $expr: {
//                 $regexMatch: {
//                   input: { $toString: "$mobile" },
//                   regex: search,
//                   options: "i"
//                 }
//               }
//             }
//           },
//           {
//             $unwind: {
//               path: "$selected", // Unwind the selected array to access individual items
//               preserveNullAndEmptyArrays: true // Keep empty arrays if any
//             }
//           },
//           {
//             $addFields: {
//               "selected.branchObjectId": { $toObjectId: "$selected.branch_id" },
//               "selected.companyObjectId": {
//                 $toObjectId: "$selected.company_id"
//               },
//               "selected.productObjectId": {
//                 $toObjectId: "$selected.product_id"
//               }
//             }
//           },

//           {
//             $lookup: {
//               from: "branches", // Name of the Branch collection
//               localField: "selected.branchObjectId", // Field from the customer document
//               foreignField: "_id", // Match the _id field from the Branch collection
//               as: "branchDetails" // Alias for the resulting joined branch documents
//             }
//           },
//           {
//             $lookup: {
//               from: "companies", // Name of the Company collection
//               localField: "selected.companyObjectId", // Field from the customer document
//               foreignField: "_id", // Match the _id field from the Company collection
//               as: "companyDetails" // Alias for the resulting joined company documents
//             }
//           },
//           {
//             $lookup: {
//               from: "products", // Name of the Product collection
//               localField: "selected.productObjectId", // Field from the customer document
//               foreignField: "_id", // Match the _id field from the Product collection
//               as: "productDetails" // Alias for the resulting joined product documents
//             }
//           },
//           {
//             $addFields: {
//               "selected.product_id": { $arrayElemAt: ["$productDetails", 0] },
//               "selected.branch_id": { $arrayElemAt: ["$branchDetails", 0] },
//               "selected.company_id": { $arrayElemAt: ["$companyDetails", 0] } // Replace product_id with populated product data
//             }
//           },

//           {
//             $group: {
//               _id: "$_id", // Group by the customer's _id
//               customerName: { $first: "$customerName" }, // Keep customer name
//               address1: { $first: "$address1" },
//               state: { $first: "$state" },
//               pincode: { $first: "$pincode" },
//               email: { $first: "$email" },
//               mobile: { $first: "$mobile" },
//               industry: { $first: "$industry" },
//               selected: { $push: "$selected" } // Push the selected data
//             }
//           }
//         ])
//         const licenseCustomer = await Customer.aggregate([
//           {
//             $match: {
//               $expr: {
//                 $gt: [
//                   {
//                     $size: {
//                       $filter: {
//                         input: "$selected",
//                         as: "item",
//                         cond: {
//                           $regexMatch: {
//                             input: { $toString: "$$item.licensenumber" },
//                             regex: search,
//                             options: "i"
//                           }
//                         }
//                       }
//                     }
//                   },
//                   0
//                 ]
//               }
//             }
//           },
//           {
//             $unwind: {
//               path: "$selected", // Unwind the selected array to access individual items
//               preserveNullAndEmptyArrays: true // Keep empty arrays if any
//             }
//           },
//           {
//             $addFields: {
//               "selected.branchObjectId": { $toObjectId: "$selected.branch_id" },
//               "selected.companyObjectId": {
//                 $toObjectId: "$selected.company_id"
//               },
//               "selected.productObjectId": {
//                 $toObjectId: "$selected.product_id"
//               }
//             }
//           },

//           {
//             $lookup: {
//               from: "branches", // Name of the Branch collection
//               localField: "selected.branchObjectId", // Field from the customer document
//               foreignField: "_id", // Match the _id field from the Branch collection
//               as: "branchDetails" // Alias for the resulting joined branch documents
//             }
//           },
//           {
//             $lookup: {
//               from: "companies", // Name of the Company collection
//               localField: "selected.companyObjectId", // Field from the customer document
//               foreignField: "_id", // Match the _id field from the Company collection
//               as: "companyDetails" // Alias for the resulting joined company documents
//             }
//           },
//           {
//             $lookup: {
//               from: "products", // Name of the Product collection
//               localField: "selected.productObjectId", // Field from the customer document
//               foreignField: "_id", // Match the _id field from the Product collection
//               as: "productDetails" // Alias for the resulting joined product documents
//             }
//           },
//           {
//             $addFields: {
//               "selected.product_id": { $arrayElemAt: ["$productDetails", 0] },
//               "selected.branch_id": { $arrayElemAt: ["$branchDetails", 0] },
//               "selected.company_id": { $arrayElemAt: ["$companyDetails", 0] } // Replace product_id with populated product data
//             }
//           },

//           {
//             $group: {
//               _id: "$_id", // Group by the customer's _id
//               customerName: { $first: "$customerName" }, // Keep customer name
//               address1: { $first: "$address1" },
//               state: { $first: "$state" },
//               pincode: { $first: "$pincode" },
//               email: { $first: "$email" },
//               mobile: { $first: "$mobile" },
//               industry: { $first: "$industry" },
//               selected: { $push: "$selected" } // Push the selected data
//             }
//           }
//         ])
//         const customers = [...mobileCustomer, ...licenseCustomer]

//         if (!customers || customers.length === 0) {
//           return res
//             .status(404)
//             .json({ message: "No customer found", data: [] })
//         } else {
//           return res
//             .status(200)
//             .json({ message: "Customer(s) found", data: customers })
//         }
//       } else {
//         // Search by customer name
//         console.log("hhh")
//         // const searchRegex = new RegExp(`^${search}`, "i")
//         // const customers = await Customer.aggregate([
//         //   {
//         //     $lookup: {
//         //       from: "partners",
//         //       localField: "partner",
//         //       foreignField: "_id",
//         //       as: "partnerDetails"
//         //     }
//         //   },
//         //   {
//         //     $addFields: {
//         //       partnerName: { $arrayElemAt: ["$partnerDetails.partner", 0] }
//         //     }
//         //   },

//         //   {
//         //     $match: {
//         //       $or: [
//         //         { customerName: searchRegex },
//         //         { partnerName: searchRegex }
//         //       ]
//         //     }
//         //   },
//         //   {
//         //     $unwind: {
//         //       path: "$selected", // Unwind the selected array to access individual items
//         //       preserveNullAndEmptyArrays: true // Keep empty arrays if any
//         //     }
//         //   },
//         //   {
//         //     $addFields: {
//         //       "selected.branchObjectId": { $toObjectId: "$selected.branch_id" },
//         //       "selected.companyObjectId": {
//         //         $toObjectId: "$selected.company_id"
//         //       },
//         //       "selected.productObjectId": {
//         //         $toObjectId: "$selected.product_id"
//         //       }
//         //     }
//         //   },

//         //   {
//         //     $lookup: {
//         //       from: "branches", // Name of the Branch collection
//         //       localField: "selected.branchObjectId", // Field from the customer document
//         //       foreignField: "_id", // Match the _id field from the Branch collection
//         //       as: "branchDetails" // Alias for the resulting joined branch documents
//         //     }
//         //   },
//         //   {
//         //     $lookup: {
//         //       from: "companies", // Name of the Company collection
//         //       localField: "selected.companyObjectId", // Field from the customer document
//         //       foreignField: "_id", // Match the _id field from the Company collection
//         //       as: "companyDetails" // Alias for the resulting joined company documents
//         //     }
//         //   },
//         //   {
//         //     $lookup: {
//         //       from: "products", // Name of the Product collection
//         //       localField: "selected.productObjectId", // Field from the customer document
//         //       foreignField: "_id", // Match the _id field from the Product collection
//         //       as: "productDetails" // Alias for the resulting joined product documents
//         //     }
//         //   },
//         //   {
//         //     $addFields: {
//         //       "selected.product_id": { $arrayElemAt: ["$productDetails", 0] },
//         //       "selected.branch_id": { $arrayElemAt: ["$branchDetails", 0] },
//         //       "selected.company_id": { $arrayElemAt: ["$companyDetails", 0] } // Replace product_id with populated product data
//         //     }
//         //   },

//         //   {
//         //     $group: {
//         //       _id: "$_id", // Group by the customer's _id
//         //       customerName: { $first: "$customerName" }, // Keep customer name
//         //       address1: { $first: "$address1" },
//         //       state: { $first: "$state" },
//         //       pincode: { $first: "$pincode" },
//         //       email: { $first: "$email" },
//         //       mobile: { $first: "$mobile" },
//         //       industry: { $first: "$industry" },
//         //       selected: { $push: "$selected" } // Push the selected data
//         //     }
//         //   }
//         // ])

//         // testing code
//         const partnerRegex = new RegExp(`^${search}`, "i");

//         const partnerIds = await Partner.find(
//           { partner: partnerRegex },
//           { _id: 1 }
//         ).lean();
//         const matchedPartnerIds = partnerIds.map(p => p._id);
//         const searchRegex = new RegExp(`^${search}`, "i");
//         const licenseNumber = Number(search);

//         const customers = await Customer.aggregate([
//           {
//             $match: {
//               $or: [
//                 { customerName: searchRegex },
//                 { mobile: searchRegex },
//                 ...(Number.isInteger(licenseNumber)
//                   ? [{ "selected.licensenumber": licenseNumber }]
//                   : []),
//                 ...(matchedPartnerIds.length
//                   ? [{ partner: { $in: matchedPartnerIds } }]
//                   : [])
//               ]
//             }
//           },

//           {
//             $project: {
//               customerName: 1,
//               mobile: 1,
//               partner: 1,
//               selected: {
//                 $map: {
//                   input: "$selected",
//                   as: "s",
//                   in: {
//                     licensenumber: "$$s.licensenumber"
//                   }
//                 }
//               }
//             }
//           },

//           { $limit: 20 }
//         ]);


//         if (customers.length > 0) {
//           return res
//             .status(200)
//             .json({ message: "Customer(s) found", data: customers })
//         } else {
//           return res
//             .status(200)
//             .json({ message: "No customer found", data: [] })
//         }
//       }
//     } else {
//       try {
//         let customers
//         if (role === "Admin" || pendingCustomerList) {
//           // Admin: Fetch all customers
//           customers = await Customer.find().sort({ customerName: 1 }).exec()
//         } else {
//           if (pendingCustomerList) {
//             customers = await Customer.find().sort({ customerName: 1 }).exec()
//           } else if (!parsedBranch || parsedBranch.length === 0) {
//             return res
//               .status(403)
//               .json({ message: "No branches assigned to staff" })
//           }

//           // const branchIds = user.selected.map((branch) => branch.branch_id)

//           customers = await Customer.find({
//             "selected.branch_id": { $in: objectIds }
//           })
//             .sort({ customerName: 1 })
//             .exec()
//         }
//         if (customers.length === 0) {
//           return res
//             .status(404)
//             .json({ message: "No customer found", data: [] })
//         }
//         return res
//           .status(200)
//           .json({ message: "Customer(s) found", data: customers })
//       } catch (error) {
//         console.error(error)
//         return res.status(500).json({ message: "Internal server error" })
//       }
//     }
//   } catch (error) {
//     console.error("Error fetching customer data:", error.message)
//     res
//       .status(500)
//       .json({ message: "An error occurred while fetching customer data." })
//   }
// }
// export const GetCustomer = async (req, res) => {
//   const search = req.query?.search
//   const role = req.query?.role
//   const userBranch = req.query?.userBranch
//   const pendingCustomerList = req.query?.pendingCustomerList

//   let objectIds
//   let parsedBranch

//   const hasValidLicense = (value) => {
//     return (
//       value !== undefined &&
//       value !== null &&
//       String(value).trim() !== ""
//     )
//   }

//   const filterSelectedWithLicense = (selected = []) => {
//     return Array.isArray(selected)
//       ? selected.filter((item) => hasValidLicense(item?.licensenumber))
//       : []
//   }

//   const normalizeCustomersWithFilteredSelected = (customers = []) => {
//     return customers
//       .map((customer) => ({
//         ...customer,
//         selected: filterSelectedWithLicense(customer?.selected)
//       }))
//       .filter((customer) => customer.selected.length > 0)
//   }

//   if (userBranch) {
//     parsedBranch = JSON.parse(decodeURIComponent(userBranch))
//   }

//   if (
//     search &&
//     Array.isArray(parsedBranch) &&
//     parsedBranch.length > 0 &&
//     role !== "Admin"
//   ) {
//     const branches = JSON.parse(decodeURIComponent(userBranch))
//     objectIds = branches?.map((id) => new mongoose.Types.ObjectId(id))
//   } else {
//     objectIds = parsedBranch?.map((id) => new mongoose.Types.ObjectId(id))
//   }

//   try {
//     if (
//       search &&
//       Array.isArray(parsedBranch) &&
//       parsedBranch.length > 0 &&
//       role !== "Admin"
//     ) {
//       if (!isNaN(search)) {
//         const searchRegex = new RegExp(`^${search}`, "i")

//         const mobileCustomerRaw = await Customer.find({
//           mobile: searchRegex
//         }).lean()

//         const licenseCustomerRaw = await Customer.find({
//           $expr: {
//             $gt: [
//               {
//                 $size: {
//                   $filter: {
//                     input: "$selected",
//                     as: "item",
//                     cond: {
//                       $and: [
//                         {
//                           $ne: [
//                             { $ifNull: ["$$item.licensenumber", null] },
//                             null
//                           ]
//                         },
//                         {
//                           $ne: [
//                             {
//                               $trim: {
//                                 input: { $toString: "$$item.licensenumber" }
//                               }
//                             },
//                             ""
//                           ]
//                         },
//                         {
//                           $regexMatch: {
//                             input: { $toString: "$$item.licensenumber" },
//                             regex: search,
//                             options: "i"
//                           }
//                         }
//                       ]
//                     }
//                   }
//                 }
//               },
//               0
//             ]
//           }
//         }).lean()

//         const mobileCustomer = mobileCustomerRaw.map((customer) => ({
//           ...customer,
//           selected: filterSelectedWithLicense(customer?.selected)
//         }))

//         const licenseCustomer = licenseCustomerRaw
//           .map((customer) => ({
//             ...customer,
//             selected: filterSelectedWithLicense(customer?.selected).filter(
//               (item) =>
//                 new RegExp(search, "i").test(String(item?.licensenumber))
//             )
//           }))
//           .filter((customer) => customer.selected.length > 0)

//         const customerMap = new Map()

//         ;[...mobileCustomer, ...licenseCustomer].forEach((customer) => {
//           const key = String(customer._id)
//           if (!customerMap.has(key)) {
//             customerMap.set(key, customer)
//           } else {
//             const existing = customerMap.get(key)
//             const mergedSelected = [
//               ...(existing.selected || []),
//               ...(customer.selected || [])
//             ]

//             const uniqueSelected = mergedSelected.filter(
//               (item, index, arr) =>
//                 index ===
//                 arr.findIndex(
//                   (x) =>
//                     String(x?.licensenumber) === String(item?.licensenumber) &&
//                     String(x?.product_id || x?.productid || "") ===
//                       String(item?.product_id || item?.productid || "")
//                 )
//             )

//             customerMap.set(key, {
//               ...existing,
//               ...customer,
//               selected: uniqueSelected
//             })
//           }
//         })

//         const customers = Array.from(customerMap.values())

//         if (!customers || customers.length === 0) {
//           return res
//             .status(404)
//             .json({ message: "No customer found", data: [] })
//         } else {
//           return res
//             .status(200)
//             .json({ message: "Customer(s) found", data: customers })
//         }
//       } else {
//         const searchRegex = new RegExp(`^${search}`, "i")
//         console.log("searchregex", searchRegex)

//         const customers = await Customer.aggregate([
//           {
//             $lookup: {
//               from: "partners",
//               localField: "partner",
//               foreignField: "_id",
//               as: "partnerDetails"
//             }
//           },
//           {
//             $addFields: {
//               partnerName: { $arrayElemAt: ["$partnerDetails.partner", 0] }
//             }
//           },
//           {
//             $match: {
//               $or: [
//                 { customerName: searchRegex },
//                 { partnerName: searchRegex }
//               ],
//               "selected.branch_id": { $in: objectIds }
//             }
//           },
//           {
//             $unwind: {
//               path: "$selected",
//               preserveNullAndEmptyArrays: true
//             }
//           },
//           {
//             $addFields: {
//               "selected.branchObjectId": { $toObjectId: "$selected.branch_id" },
//               "selected.companyObjectId": {
//                 $toObjectId: "$selected.company_id"
//               },
//               "selected.productObjectId": {
//                 $toObjectId: "$selected.product_id"
//               },
//               partnerObjectId: {
//                 $toObjectId: "$partner"
//               }
//             }
//           },
//           {
//             $lookup: {
//               from: "branches",
//               localField: "selected.branchObjectId",
//               foreignField: "_id",
//               as: "branchDetails"
//             }
//           },
//           {
//             $lookup: {
//               from: "companies",
//               localField: "selected.companyObjectId",
//               foreignField: "_id",
//               as: "companyDetails"
//             }
//           },
//           {
//             $lookup: {
//               from: "products",
//               localField: "selected.productObjectId",
//               foreignField: "_id",
//               as: "productDetails"
//             }
//           },
//           {
//             $addFields: {
//               partner: { $arrayElemAt: ["$partnerDetails", 0] },
//               "selected.product_id": { $arrayElemAt: ["$productDetails", 0] },
//               "selected.branch_id": { $arrayElemAt: ["$branchDetails", 0] },
//               "selected.company_id": { $arrayElemAt: ["$companyDetails", 0] }
//             }
//           },
//           {
//             $group: {
//               _id: "$_id",
//               customerName: { $first: "$customerName" },
//               address1: { $first: "$address1" },
//               state: { $first: "$state" },
//               pincode: { $first: "$pincode" },
//               email: { $first: "$email" },
//               mobile: { $first: "$mobile" },
//               partner: { $first: "$partner" },
//               industry: { $first: "$industry" },
//               selected: { $push: "$selected" }
//             }
//           }
//         ])

//         const normalizedCustomers = customers.map((customer) => ({
//           ...customer,
//           selected: Array.isArray(customer?.selected)
//             ? customer.selected.filter((item) => item != null)
//             : []
//         }))
// console.log("jjjjjjjjjjjjdddddddddddddddd",normalizedCustomers)

//         if (normalizedCustomers.length > 0) {
//           return res
//             .status(200)
//             .json({ message: "Customer(s) found", data: normalizedCustomers })
//         } else {
//           return res
//             .status(200)
//             .json({ message: "No customer found", data: [] })
//         }
//       }
//     } else if (search && role === "Admin") {
//       if (!isNaN(search)) {
//         const searchRegex = new RegExp(`^${search}`, "i")

//         const mobileCustomerRaw = await Customer.aggregate([
//           {
//             $match: {
//               $expr: {
//                 $regexMatch: {
//                   input: { $toString: "$mobile" },
//                   regex: search,
//                   options: "i"
//                 }
//               }
//             }
//           },
//           {
//             $unwind: {
//               path: "$selected",
//               preserveNullAndEmptyArrays: true
//             }
//           },
//           {
//             $addFields: {
//               "selected.branchObjectId": { $toObjectId: "$selected.branch_id" },
//               "selected.companyObjectId": {
//                 $toObjectId: "$selected.company_id"
//               },
//               "selected.productObjectId": {
//                 $toObjectId: "$selected.product_id"
//               }
//             }
//           },
//           {
//             $lookup: {
//               from: "branches",
//               localField: "selected.branchObjectId",
//               foreignField: "_id",
//               as: "branchDetails"
//             }
//           },
//           {
//             $lookup: {
//               from: "companies",
//               localField: "selected.companyObjectId",
//               foreignField: "_id",
//               as: "companyDetails"
//             }
//           },
//           {
//             $lookup: {
//               from: "products",
//               localField: "selected.productObjectId",
//               foreignField: "_id",
//               as: "productDetails"
//             }
//           },
//           {
//             $addFields: {
//               "selected.product_id": { $arrayElemAt: ["$productDetails", 0] },
//               "selected.branch_id": { $arrayElemAt: ["$branchDetails", 0] },
//               "selected.company_id": { $arrayElemAt: ["$companyDetails", 0] }
//             }
//           },
//           {
//             $group: {
//               _id: "$_id",
//               customerName: { $first: "$customerName" },
//               address1: { $first: "$address1" },
//               state: { $first: "$state" },
//               pincode: { $first: "$pincode" },
//               email: { $first: "$email" },
//               mobile: { $first: "$mobile" },
//               industry: { $first: "$industry" },
//               selected: { $push: "$selected" }
//             }
//           }
//         ])

//         const licenseCustomerRaw = await Customer.aggregate([
//           {
//             $match: {
//               $expr: {
//                 $gt: [
//                   {
//                     $size: {
//                       $filter: {
//                         input: "$selected",
//                         as: "item",
//                         cond: {
//                           $and: [
//                             {
//                               $ne: [
//                                 { $ifNull: ["$$item.licensenumber", null] },
//                                 null
//                               ]
//                             },
//                             {
//                               $ne: [
//                                 {
//                                   $trim: {
//                                     input: { $toString: "$$item.licensenumber" }
//                                   }
//                                 },
//                                 ""
//                               ]
//                             },
//                             {
//                               $regexMatch: {
//                                 input: { $toString: "$$item.licensenumber" },
//                                 regex: search,
//                                 options: "i"
//                               }
//                             }
//                           ]
//                         }
//                       }
//                     }
//                   },
//                   0
//                 ]
//               }
//             }
//           },
//           {
//             $unwind: {
//               path: "$selected",
//               preserveNullAndEmptyArrays: true
//             }
//           },
//           {
//             $match: {
//               $expr: {
//                 $and: [
//                   {
//                     $ne: [{ $ifNull: ["$selected.licensenumber", null] }, null]
//                   },
//                   {
//                     $ne: [
//                       {
//                         $trim: {
//                           input: { $toString: "$selected.licensenumber" }
//                         }
//                       },
//                       ""
//                     ]
//                   },
//                   {
//                     $regexMatch: {
//                       input: { $toString: "$selected.licensenumber" },
//                       regex: search,
//                       options: "i"
//                     }
//                   }
//                 ]
//               }
//             }
//           },
//           {
//             $addFields: {
//               "selected.branchObjectId": { $toObjectId: "$selected.branch_id" },
//               "selected.companyObjectId": {
//                 $toObjectId: "$selected.company_id"
//               },
//               "selected.productObjectId": {
//                 $toObjectId: "$selected.product_id"
//               }
//             }
//           },
//           {
//             $lookup: {
//               from: "branches",
//               localField: "selected.branchObjectId",
//               foreignField: "_id",
//               as: "branchDetails"
//             }
//           },
//           {
//             $lookup: {
//               from: "companies",
//               localField: "selected.companyObjectId",
//               foreignField: "_id",
//               as: "companyDetails"
//             }
//           },
//           {
//             $lookup: {
//               from: "products",
//               localField: "selected.productObjectId",
//               foreignField: "_id",
//               as: "productDetails"
//             }
//           },
//           {
//             $addFields: {
//               "selected.product_id": { $arrayElemAt: ["$productDetails", 0] },
//               "selected.branch_id": { $arrayElemAt: ["$branchDetails", 0] },
//               "selected.company_id": { $arrayElemAt: ["$companyDetails", 0] }
//             }
//           },
//           {
//             $group: {
//               _id: "$_id",
//               customerName: { $first: "$customerName" },
//               address1: { $first: "$address1" },
//               state: { $first: "$state" },
//               pincode: { $first: "$pincode" },
//               email: { $first: "$email" },
//               mobile: { $first: "$mobile" },
//               industry: { $first: "$industry" },
//               selected: { $push: "$selected" }
//             }
//           }
//         ])

//         const mobileCustomer = mobileCustomerRaw.map((customer) => ({
//           ...customer,
//           selected: Array.isArray(customer?.selected)
//             ? customer.selected.filter((item) => item != null)
//             : []
//         }))

//         const licenseCustomer = licenseCustomerRaw
//           .map((customer) => ({
//             ...customer,
//             selected: filterSelectedWithLicense(customer?.selected)
//           }))
//           .filter((customer) => customer.selected.length > 0)

//         const customerMap = new Map()

//         ;[...mobileCustomer, ...licenseCustomer].forEach((customer) => {
//           const key = String(customer._id)
//           if (!customerMap.has(key)) {
//             customerMap.set(key, customer)
//           } else {
//             const existing = customerMap.get(key)
//             const mergedSelected = [
//               ...(existing.selected || []),
//               ...(customer.selected || [])
//             ]

//             const uniqueSelected = mergedSelected.filter(
//               (item, index, arr) =>
//                 index ===
//                 arr.findIndex(
//                   (x) =>
//                     String(x?.licensenumber ?? "") ===
//                       String(item?.licensenumber ?? "") &&
//                     String(x?.product_id?._id || x?.product_id || "") ===
//                       String(item?.product_id?._id || item?.product_id || "")
//                 )
//             )

//             customerMap.set(key, {
//               ...existing,
//               ...customer,
//               selected: uniqueSelected
//             })
//           }
//         })

//         const customers = Array.from(customerMap.values())

//         if (!customers || customers.length === 0) {
//           return res
//             .status(404)
//             .json({ message: "No customer found", data: [] })
//         } else {
//           return res
//             .status(200)
//             .json({ message: "Customer(s) found", data: customers })
//         }
//       } else {
//         console.log("hhh")

//         const partnerRegex = new RegExp(`^${search}`, "i")

//         const partnerIds = await Partner.find(
//           { partner: partnerRegex },
//           { _id: 1 }
//         ).lean()

//         const matchedPartnerIds = partnerIds.map((p) => p._id)
//         const searchRegex = new RegExp(`^${search}`, "i")
//         const licenseNumber = Number(search)

//         const customers = await Customer.aggregate([
//           {
//             $match: {
//               $or: [
//                 { customerName: searchRegex },
//                 { mobile: searchRegex },
//                 ...(Number.isInteger(licenseNumber)
//                   ? [{ "selected.licensenumber": licenseNumber }]
//                   : []),
//                 ...(matchedPartnerIds.length
//                   ? [{ partner: { $in: matchedPartnerIds } }]
//                   : [])
//               ]
//             }
//           },
//           {
//             $project: {
//               customerName: 1,
//               mobile: 1,
//               partner: 1,
//               selected: {
//                 $filter: {
//                   input: {
//                     $map: {
//                       input: "$selected",
//                       as: "s",
//                       in: {
//                         licensenumber: "$$s.licensenumber"
//                       }
//                     }
//                   },
//                   as: "sel",
//                   cond: {
//                     $and: [
//                       {
//                         $ne: [{ $ifNull: ["$$sel.licensenumber", null] }, null]
//                       },
//                       {
//                         $ne: [
//                           {
//                             $trim: {
//                               input: { $toString: "$$sel.licensenumber" }
//                             }
//                           },
//                           ""
//                         ]
//                       }
//                     ]
//                   }
//                 }
//               }
//             }
//           },
//           { $limit: 20 }
//         ])
// console.log("99999999999",customers)
//         if (customers.length > 0) {
//           return res
//             .status(200)
//             .json({ message: "Customer(s) found", data: customers })
//         } else {
//           return res
//             .status(200)
//             .json({ message: "No customer found", data: [] })
//         }
//       }
//     } else {
//       try {
//         let customers
//         if (role === "Admin" || pendingCustomerList) {
//           customers = await Customer.find().sort({ customerName: 1 }).exec()
//         } else {
//           if (pendingCustomerList) {
//             customers = await Customer.find().sort({ customerName: 1 }).exec()
//           } else if (!parsedBranch || parsedBranch.length === 0) {
//             return res
//               .status(403)
//               .json({ message: "No branches assigned to staff" })
//           }

//           customers = await Customer.find({
//             "selected.branch_id": { $in: objectIds }
//           })
//             .sort({ customerName: 1 })
//             .exec()
//         }

//         const normalizedCustomers = Array.isArray(customers)
//           ? customers.map((customer) => ({
//               ...customer.toObject?.() ? customer.toObject() : customer,
//               selected: Array.isArray(customer?.selected)
//                 ? customer.selected.filter((item) => item != null)
//                 : []
//             }))
//           : []

//         if (normalizedCustomers.length === 0) {
//           return res
//             .status(404)
//             .json({ message: "No customer found", data: [] })
//         }
// console.log("dddddddddddddddddddddddd",normalizedCustomers)
//         return res
//           .status(200)
//           .json({ message: "Customer(s) found", data: normalizedCustomers })
//       } catch (error) {
//         console.error(error)
//         return res.status(500).json({ message: "Internal server error" })
//       }
//     }
//   } catch (error) {
//     console.error("Error fetching customer data:", error.message)
//     res
//       .status(500)
//       .json({ message: "An error occurred while fetching customer data." })
//   }
// }


// export const GetCustomer = async (req, res) => {
//   const search = req.query?.search?.trim() || "";
//   const role = req.query?.role;
//   const userBranch = req.query?.userBranch;
//   const pendingCustomerList = req.query?.pendingCustomerList;

//   let parsedBranch = [];
//   let objectIds = [];

//   const hasValidLicense = (value) => {
//     return value !== undefined && value !== null && String(value).trim() !== "";
//   };

//   const filterSelectedWithLicense = (selected = []) => {
//     return Array.isArray(selected)
//       ? selected.filter((item) => hasValidLicense(item?.licensenumber))
//       : [];
//   };

//   const toObjectIdExpr = (path) => ({
//     $cond: [
//       { $eq: [{ $type: path }, "objectId"] },
//       path,
//       {
//         $cond: [
//           {
//             $and: [
//               { $ne: [path, null] },
//               { $ne: [path, ""] }
//             ]
//           },
//           { $toObjectId: path },
//           null
//         ]
//       }
//     ]
//   });

//   const getPopulateSelectedStages = () => [
//     {
//       $unwind: {
//         path: "$selected",
//         preserveNullAndEmptyArrays: true
//       }
//     },
//     {
//       $addFields: {
//         "selected.branchObjectId": toObjectIdExpr("$selected.branch_id"),
//         "selected.companyObjectId": toObjectIdExpr("$selected.company_id"),
//         "selected.productObjectId": toObjectIdExpr("$selected.product_id"),
//         partnerObjectId: toObjectIdExpr("$partner")
//       }
//     },
//     {
//       $lookup: {
//         from: "branches",
//         localField: "selected.branchObjectId",
//         foreignField: "_id",
//         as: "branchDetails"
//       }
//     },
//     {
//       $lookup: {
//         from: "companies",
//         localField: "selected.companyObjectId",
//         foreignField: "_id",
//         as: "companyDetails"
//       }
//     },
//     {
//       $lookup: {
//         from: "products",
//         localField: "selected.productObjectId",
//         foreignField: "_id",
//         as: "productDetails"
//       }
//     },
//     {
//       $lookup: {
//         from: "partners",
//         localField: "partnerObjectId",
//         foreignField: "_id",
//         as: "partnerDetails"
//       }
//     },
//     {
//       $addFields: {
//         partner: { $arrayElemAt: ["$partnerDetails", 0] },
//         "selected.branch_id": {
//           $let: {
//             vars: { branch: { $arrayElemAt: ["$branchDetails", 0] } },
//             in: {
//               $cond: [
//                 { $ifNull: ["$$branch._id", false] },
//                 {
//                   _id: "$$branch._id",
//                   branchName: "$$branch.branchName"
//                 },
//                 null
//               ]
//             }
//           }
//         },
//         "selected.company_id": {
//           $let: {
//             vars: { company: { $arrayElemAt: ["$companyDetails", 0] } },
//             in: {
//               $cond: [
//                 { $ifNull: ["$$company._id", false] },
//                 {
//                   _id: "$$company._id",
//                   companyName: "$$company.companyName"
//                 },
//                 null
//               ]
//             }
//           }
//         },
//         "selected.product_id": { $arrayElemAt: ["$productDetails", 0] }
//       }
//     },
//     {
//       $project: {
//         branchDetails: 0,
//         companyDetails: 0,
//         productDetails: 0,
//         partnerDetails: 0,
//         partnerObjectId: 0,
//         "selected.branchObjectId": 0,
//         "selected.companyObjectId": 0,
//         "selected.productObjectId": 0
//       }
//     },
//     {
//       $group: {
//         _id: "$_id",
//         customerName: { $first: "$customerName" },
//         address1: { $first: "$address1" },
//         state: { $first: "$state" },
//         pincode: { $first: "$pincode" },
//         email: { $first: "$email" },
//         mobile: { $first: "$mobile" },
//         partner: { $first: "$partner" },
//         industry: { $first: "$industry" },
//         selected: { $push: "$selected" }
//       }
//     },
//     {
//       $addFields: {
//         selected: {
//           $filter: {
//             input: "$selected",
//             as: "item",
//             cond: { $ne: ["$$item", null] }
//           }
//         }
//       }
//     }
//   ];

//   const normalizeCustomers = (customers = []) => {
//     return customers.map((customer) => ({
//       ...customer,
//       selected: Array.isArray(customer?.selected)
//         ? customer.selected.filter((item) => item != null)
//         : []
//     }));
//   };

//   try {
//     if (userBranch) {
//       parsedBranch = JSON.parse(decodeURIComponent(userBranch));
//     }

//     if (Array.isArray(parsedBranch) && parsedBranch.length > 0) {
//       objectIds = parsedBranch.map((id) => new mongoose.Types.ObjectId(id));
//     }

//     if (search && Array.isArray(parsedBranch) && parsedBranch.length > 0 && role !== "Admin") {
//       if (!isNaN(search)) {
//         const searchRegex = new RegExp(`^${search}`, "i");

//         const mobileCustomerRaw = await Customer.find({
//           mobile: searchRegex
//         }).lean();

//         const licenseCustomerRaw = await Customer.find({
//           $expr: {
//             $gt: [
//               {
//                 $size: {
//                   $filter: {
//                     input: "$selected",
//                     as: "item",
//                     cond: {
//                       $and: [
//                         {
//                           $ne: [
//                             { $ifNull: ["$$item.licensenumber", null] },
//                             null
//                           ]
//                         },
//                         {
//                           $ne: [
//                             {
//                               $trim: {
//                                 input: { $toString: "$$item.licensenumber" }
//                               }
//                             },
//                             ""
//                           ]
//                         },
//                         {
//                           $regexMatch: {
//                             input: { $toString: "$$item.licensenumber" },
//                             regex: search,
//                             options: "i"
//                           }
//                         }
//                       ]
//                     }
//                   }
//                 }
//               },
//               0
//             ]
//           }
//         }).lean();

//         const mobileCustomerIds = mobileCustomerRaw.map((c) => c._id);
//         const licenseCustomerIds = licenseCustomerRaw.map((c) => c._id);
//         const allIds = [...new Set([...mobileCustomerIds, ...licenseCustomerIds].map(String))].map(
//           (id) => new mongoose.Types.ObjectId(id)
//         );

//         const customers = await Customer.aggregate([
//           {
//             $match: {
//               _id: { $in: allIds },
//               "selected.branch_id": { $in: objectIds }
//             }
//           },
//           ...getPopulateSelectedStages()
//         ]);

//         const mergedCustomers = normalizeCustomers(customers).map((customer) => {
//           const fromMobile = mobileCustomerRaw.find((x) => String(x._id) === String(customer._id));
//           const fromLicense = licenseCustomerRaw.find((x) => String(x._id) === String(customer._id));

//           let selected = customer.selected || [];

//           if (fromLicense) {
//             selected = selected.filter((item) =>
//               new RegExp(search, "i").test(String(item?.licensenumber ?? ""))
//             );
//           } else if (fromMobile) {
//             selected = filterSelectedWithLicense(selected);
//           }

//           return {
//             ...customer,
//             selected
//           };
//         }).filter((customer) => customer.selected.length > 0);

//         if (!mergedCustomers.length) {
//           return res.status(404).json({ message: "No customer found", data: [] });
//         }

//         return res.status(200).json({
//           message: "Customer(s) found",
//           data: mergedCustomers
//         });
//       } else {
//         const searchRegex = new RegExp(`^${search}`, "i");

//         const customers = await Customer.aggregate([
//           {
//             $lookup: {
//               from: "partners",
//               localField: "partner",
//               foreignField: "_id",
//               as: "partnerDetails"
//             }
//           },
//           {
//             $addFields: {
//               partnerName: { $arrayElemAt: ["$partnerDetails.partner", 0] }
//             }
//           },
//           {
//             $match: {
//               $or: [
//                 { customerName: searchRegex },
//                 { partnerName: searchRegex }
//               ],
//               "selected.branch_id": { $in: objectIds }
//             }
//           },
//           ...getPopulateSelectedStages()
//         ]);

//         const normalizedCustomers = normalizeCustomers(customers);

//         if (normalizedCustomers.length > 0) {
//           return res.status(200).json({
//             message: "Customer(s) found",
//             data: normalizedCustomers
//           });
//         }

//         return res.status(200).json({
//           message: "No customer found",
//           data: []
//         });
//       }
//     } else if (search && role === "Admin") {
//       if (!isNaN(search)) {
//         const mobileCustomerRaw = await Customer.find({
//           $expr: {
//             $regexMatch: {
//               input: { $toString: "$mobile" },
//               regex: search,
//               options: "i"
//             }
//           }
//         }).lean();

//         const licenseCustomerRaw = await Customer.find({
//           $expr: {
//             $gt: [
//               {
//                 $size: {
//                   $filter: {
//                     input: "$selected",
//                     as: "item",
//                     cond: {
//                       $and: [
//                         {
//                           $ne: [
//                             { $ifNull: ["$$item.licensenumber", null] },
//                             null
//                           ]
//                         },
//                         {
//                           $ne: [
//                             {
//                               $trim: {
//                                 input: { $toString: "$$item.licensenumber" }
//                               }
//                             },
//                             ""
//                           ]
//                         },
//                         {
//                           $regexMatch: {
//                             input: { $toString: "$$item.licensenumber" },
//                             regex: search,
//                             options: "i"
//                           }
//                         }
//                       ]
//                     }
//                   }
//                 }
//               },
//               0
//             ]
//           }
//         }).lean();

//         const allIds = [...new Set(
//           [...mobileCustomerRaw, ...licenseCustomerRaw].map((c) => String(c._id))
//         )].map((id) => new mongoose.Types.ObjectId(id));

//         const customers = await Customer.aggregate([
//           {
//             $match: {
//               _id: { $in: allIds }
//             }
//           },
//           ...getPopulateSelectedStages()
//         ]);

//         const mergedCustomers = normalizeCustomers(customers).map((customer) => {
//           const fromLicense = licenseCustomerRaw.find((x) => String(x._id) === String(customer._id));
//           const fromMobile = mobileCustomerRaw.find((x) => String(x._id) === String(customer._id));

//           let selected = customer.selected || [];

//           if (fromLicense) {
//             selected = filterSelectedWithLicense(selected).filter((item) =>
//               new RegExp(search, "i").test(String(item?.licensenumber ?? ""))
//             );
//           } else if (fromMobile) {
//             selected = Array.isArray(selected) ? selected.filter((item) => item != null) : [];
//           }

//           return {
//             ...customer,
//             selected
//           };
//         }).filter((customer) => customer.selected.length > 0 || mobileCustomerRaw.some((x) => String(x._id) === String(customer._id)));

//         if (!mergedCustomers.length) {
//           return res.status(404).json({ message: "No customer found", data: [] });
//         }

//         return res.status(200).json({
//           message: "Customer(s) found",
//           data: mergedCustomers
//         });
//       } else {
//         const partnerRegex = new RegExp(`^${search}`, "i");

//         const partnerIds = await Partner.find(
//           { partner: partnerRegex },
//           { _id: 1 }
//         ).lean();

//         const matchedPartnerIds = partnerIds.map((p) => p._id);
//         const searchRegex = new RegExp(`^${search}`, "i");
//         const licenseNumber = Number(search);

//         const customers = await Customer.aggregate([
//           {
//             $match: {
//               $or: [
//                 { customerName: searchRegex },
//                 { mobile: searchRegex },
//                 ...(Number.isInteger(licenseNumber)
//                   ? [{ "selected.licensenumber": licenseNumber }]
//                   : []),
//                 ...(matchedPartnerIds.length
//                   ? [{ partner: { $in: matchedPartnerIds } }]
//                   : [])
//               ]
//             }
//           },
//           ...getPopulateSelectedStages(),
//           {
//             $addFields: {
//               selected: {
//                 $filter: {
//                   input: "$selected",
//                   as: "sel",
//                   cond: {
//                     $and: [
//                       {
//                         $ne: [{ $ifNull: ["$$sel.licensenumber", null] }, null]
//                       },
//                       {
//                         $ne: [
//                           {
//                             $trim: {
//                               input: { $toString: "$$sel.licensenumber" }
//                             }
//                           },
//                           ""
//                         ]
//                       }
//                     ]
//                   }
//                 }
//               }
//             }
//           },
//           { $limit: 20 }
//         ]);

//         if (customers.length > 0) {
//           return res.status(200).json({
//             message: "Customer(s) found",
//             data: customers
//           });
//         }

//         return res.status(200).json({
//           message: "No customer found",
//           data: []
//         });
//       }
//     } else {
//       let customers;

//       if (role === "Admin" || pendingCustomerList) {
//         customers = await Customer.aggregate([
//           { $sort: { customerName: 1 } },
//           ...getPopulateSelectedStages()
//         ]);
//       } else {
//         if (!parsedBranch || parsedBranch.length === 0) {
//           return res.status(403).json({
//             message: "No branches assigned to staff"
//           });
//         }

//         customers = await Customer.aggregate([
//           {
//             $match: {
//               "selected.branch_id": { $in: objectIds }
//             }
//           },
//           { $sort: { customerName: 1 } },
//           ...getPopulateSelectedStages()
//         ]);
//       }

//       const normalizedCustomers = normalizeCustomers(customers);

//       if (normalizedCustomers.length === 0) {
//         return res.status(404).json({
//           message: "No customer found",
//           data: []
//         });
//       }

//       return res.status(200).json({
//         message: "Customer(s) found",
//         data: normalizedCustomers
//       });
//     }
//   } catch (error) {
//     console.error("Error fetching customer data:", error.message);
//     return res.status(500).json({
//       message: "An error occurred while fetching customer data."
//     });
//   }
// };

export const GetCustomer = async (req, res) => {
  const search = req.query?.search?.trim() || "";
  const role = req.query?.role;
  const userBranch = req.query?.userBranch;
  const pendingCustomerList = req.query?.pendingCustomerList;

  let parsedBranch = [];
  let objectIds = [];

  const escapeRegex = (value = "") =>
    String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const hasValidLicense = (value) => {
    return value !== undefined && value !== null && String(value).trim() !== "";
  };

  const filterSelectedWithLicense = (selected = []) => {
    return Array.isArray(selected)
      ? selected.filter((item) => hasValidLicense(item?.licensenumber))
      : [];
  };

  const toObjectIdExpr = (path) => ({
    $convert: {
      input: path,
      to: "objectId",
      onError: null,
      onNull: null
    }
  });

  const getPopulateSelectedStages = () => [
    {
      $unwind: {
        path: "$selected",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $addFields: {
        "selected.branchObjectId": toObjectIdExpr("$selected.branch_id"),
        "selected.companyObjectId": toObjectIdExpr("$selected.company_id"),
        "selected.productObjectId": toObjectIdExpr("$selected.product_id"),
        partnerObjectId: toObjectIdExpr("$partner")
      }
    },
    {
      $lookup: {
        from: "branches",
        localField: "selected.branchObjectId",
        foreignField: "_id",
        as: "branchDetails"
      }
    },
    {
      $lookup: {
        from: "companies",
        localField: "selected.companyObjectId",
        foreignField: "_id",
        as: "companyDetails"
      }
    },
    {
      $lookup: {
        from: "products",
        localField: "selected.productObjectId",
        foreignField: "_id",
        as: "productDetails"
      }
    },
    {
      $lookup: {
        from: "partners",
        localField: "partnerObjectId",
        foreignField: "_id",
        as: "partnerDetails"
      }
    },
    {
      $addFields: {
        partner: { $arrayElemAt: ["$partnerDetails", 0] },
        "selected.branch_id": {
          $let: {
            vars: { branch: { $arrayElemAt: ["$branchDetails", 0] } },
            in: {
              $cond: [
                { $ifNull: ["$$branch._id", false] },
                {
                  _id: "$$branch._id",
                  branchName: "$$branch.branchName"
                },
                "$selected.branch_id"
              ]
            }
          }
        },
        "selected.company_id": {
          $let: {
            vars: { company: { $arrayElemAt: ["$companyDetails", 0] } },
            in: {
              $cond: [
                { $ifNull: ["$$company._id", false] },
                {
                  _id: "$$company._id",
                  companyName: "$$company.companyName"
                },
                "$selected.company_id"
              ]
            }
          }
        },
        "selected.product_id": {
          $cond: [
            { $gt: [{ $size: "$productDetails" }, 0] },
            { $arrayElemAt: ["$productDetails", 0] },
            "$selected.product_id"
          ]
        }
      }
    },
    {
      $project: {
        branchDetails: 0,
        companyDetails: 0,
        productDetails: 0,
        partnerDetails: 0,
        partnerObjectId: 0,
        "selected.branchObjectId": 0,
        "selected.companyObjectId": 0,
        "selected.productObjectId": 0
      }
    },
    {
      $group: {
        _id: "$_id",
        customerName: { $first: "$customerName" },
        address1: { $first: "$address1" },
        address2: { $first: "$address2" },
        country: { $first: "$country" },
        registrationType: { $first: "$registrationType" },
        state: { $first: "$state" },
        city: { $first: "$city" },
        pincode: { $first: "$pincode" },
        email: { $first: "$email" },
        mobile: { $first: "$mobile" },
        landline: { $first: "$landline" },
        industry: { $first: "$industry" },
        contactPerson: { $first: "$contactPerson" },
        partner: { $first: "$partner" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
        selected: { $push: "$selected" }
      }
    },
    {
      $addFields: {
        selected: {
          $filter: {
            input: "$selected",
            as: "item",
            cond: { $ne: ["$$item", null] }
          }
        }
      }
    }
  ];

  const normalizeCustomers = (customers = []) => {
    return customers.map((customer) => ({
      ...customer,
      selected: Array.isArray(customer?.selected)
        ? customer.selected.filter((item) => item != null)
        : []
    }));
  };

  try {
    if (userBranch) {
      parsedBranch = JSON.parse(decodeURIComponent(userBranch));
    }

    if (Array.isArray(parsedBranch) && parsedBranch.length > 0) {
      objectIds = parsedBranch
        .filter((id) => mongoose.Types.ObjectId.isValid(id))
        .map((id) => new mongoose.Types.ObjectId(id));
    }

    if (
      search &&
      Array.isArray(parsedBranch) &&
      parsedBranch.length > 0 &&
      role !== "Admin"
    ) {
      if (!isNaN(search)) {
        const escapedSearch = escapeRegex(search);
        const searchRegex = new RegExp(`^${escapedSearch}`, "i");

        const mobileCustomerRaw = await Customer.find({
          mobile: searchRegex
        }).lean();

        const licenseCustomerRaw = await Customer.find({
          $expr: {
            $gt: [
              {
                $size: {
                  $filter: {
                    input: { $ifNull: ["$selected", []] },
                    as: "item",
                    cond: {
                      $and: [
                        {
                          $ne: [
                            { $ifNull: ["$$item.licensenumber", null] },
                            null
                          ]
                        },
                        {
                          $ne: [
                            {
                              $trim: {
                                input: { $toString: "$$item.licensenumber" }
                              }
                            },
                            ""
                          ]
                        },
                        {
                          $regexMatch: {
                            input: { $toString: "$$item.licensenumber" },
                            regex: escapedSearch,
                            options: "i"
                          }
                        }
                      ]
                    }
                  }
                }
              },
              0
            ]
          }
        }).lean();

        const mobileCustomerIds = mobileCustomerRaw.map((c) => c._id);
        const licenseCustomerIds = licenseCustomerRaw.map((c) => c._id);

        const allIds = [
          ...new Set(
            [...mobileCustomerIds, ...licenseCustomerIds].map((id) => String(id))
          )
        ]
          .filter((id) => mongoose.Types.ObjectId.isValid(id))
          .map((id) => new mongoose.Types.ObjectId(id));

        if (!allIds.length) {
          return res.status(200).json({
            message: "No customer found",
            data: []
          });
        }

        const customers = await Customer.aggregate([
          {
            $match: {
              _id: { $in: allIds },
              "selected.branch_id": { $in: objectIds }
            }
          },
          ...getPopulateSelectedStages()
        ]);

        const mergedCustomers = normalizeCustomers(customers)
          .map((customer) => {
            const fromMobile = mobileCustomerRaw.find(
              (x) => String(x._id) === String(customer._id)
            );
            const fromLicense = licenseCustomerRaw.find(
              (x) => String(x._id) === String(customer._id)
            );

            let selected = customer.selected || [];

            if (fromLicense) {
              selected = selected.filter((item) =>
                new RegExp(escapedSearch, "i").test(
                  String(item?.licensenumber ?? "")
                )
              );
            } else if (fromMobile) {
              selected = filterSelectedWithLicense(selected);
            }

            return {
              ...customer,
              selected
            };
          })
          .filter((customer) => customer.selected.length > 0);

        if (!mergedCustomers.length) {
          return res.status(404).json({
            message: "No customer found",
            data: []
          });
        }

        return res.status(200).json({
          message: "Customer(s) found",
          data: mergedCustomers
        });
      } else {
        const searchRegex = new RegExp(`^${escapeRegex(search)}`, "i");

        const customers = await Customer.aggregate([
          {
            $lookup: {
              from: "partners",
              localField: "partner",
              foreignField: "_id",
              as: "partnerDetails"
            }
          },
          {
            $addFields: {
              partnerName: { $arrayElemAt: ["$partnerDetails.partner", 0] }
            }
          },
          {
            $match: {
              $or: [{ customerName: searchRegex }, { partnerName: searchRegex }],
              "selected.branch_id": { $in: objectIds }
            }
          },
          ...getPopulateSelectedStages()
        ]);

        const normalizedCustomers = normalizeCustomers(customers);

        if (normalizedCustomers.length > 0) {
          return res.status(200).json({
            message: "Customer(s) found",
            data: normalizedCustomers
          });
        }

        return res.status(200).json({
          message: "No customer found",
          data: []
        });
      }
    } else if (search && role === "Admin") {
      if (!isNaN(search)) {
        const escapedSearch = escapeRegex(search);

        const mobileCustomerRaw = await Customer.find({
          $expr: {
            $regexMatch: {
              input: { $toString: "$mobile" },
              regex: escapedSearch,
              options: "i"
            }
          }
        }).lean();

        const licenseCustomerRaw = await Customer.find({
          $expr: {
            $gt: [
              {
                $size: {
                  $filter: {
                    input: { $ifNull: ["$selected", []] },
                    as: "item",
                    cond: {
                      $and: [
                        {
                          $ne: [
                            { $ifNull: ["$$item.licensenumber", null] },
                            null
                          ]
                        },
                        {
                          $ne: [
                            {
                              $trim: {
                                input: { $toString: "$$item.licensenumber" }
                              }
                            },
                            ""
                          ]
                        },
                        {
                          $regexMatch: {
                            input: { $toString: "$$item.licensenumber" },
                            regex: escapedSearch,
                            options: "i"
                          }
                        }
                      ]
                    }
                  }
                }
              },
              0
            ]
          }
        }).lean();

        const allIds = [
          ...new Set(
            [...mobileCustomerRaw, ...licenseCustomerRaw].map((c) => String(c._id))
          )
        ]
          .filter((id) => mongoose.Types.ObjectId.isValid(id))
          .map((id) => new mongoose.Types.ObjectId(id));

        if (!allIds.length) {
          return res.status(200).json({
            message: "No customer found",
            data: []
          });
        }

        const customers = await Customer.aggregate([
          {
            $match: {
              _id: { $in: allIds }
            }
          },
          ...getPopulateSelectedStages()
        ]);

        const mergedCustomers = normalizeCustomers(customers)
          .map((customer) => {
            const fromLicense = licenseCustomerRaw.find(
              (x) => String(x._id) === String(customer._id)
            );
            const fromMobile = mobileCustomerRaw.find(
              (x) => String(x._id) === String(customer._id)
            );

            let selected = customer.selected || [];

            if (fromLicense) {
              selected = filterSelectedWithLicense(selected).filter((item) =>
                new RegExp(escapedSearch, "i").test(
                  String(item?.licensenumber ?? "")
                )
              );
            } else if (fromMobile) {
              selected = Array.isArray(selected)
                ? selected.filter((item) => item != null)
                : [];
            }

            return {
              ...customer,
              selected
            };
          })
          .filter(
            (customer) =>
              customer.selected.length > 0 ||
              mobileCustomerRaw.some((x) => String(x._id) === String(customer._id))
          );

        if (!mergedCustomers.length) {
          return res.status(404).json({
            message: "No customer found",
            data: []
          });
        }

        return res.status(200).json({
          message: "Customer(s) found",
          data: mergedCustomers
        });
      } else {
        const partnerRegex = new RegExp(`^${escapeRegex(search)}`, "i");

        const partnerIds = await Partner.find(
          { partner: partnerRegex },
          { _id: 1 }
        ).lean();

        const matchedPartnerIds = partnerIds.map((p) => p._id);
        const searchRegex = new RegExp(`^${escapeRegex(search)}`, "i");

        const customers = await Customer.aggregate([
          {
            $match: {
              $or: [
                { customerName: searchRegex },
                { mobile: searchRegex },
                ...(matchedPartnerIds.length
                  ? [{ partner: { $in: matchedPartnerIds } }]
                  : [])
              ]
            }
          },
          ...getPopulateSelectedStages(),
          {
            $addFields: {
              selected: {
                $filter: {
                  input: "$selected",
                  as: "sel",
                  cond: {
                    $and: [
                      {
                        $ne: [{ $ifNull: ["$$sel.licensenumber", null] }, null]
                      },
                      {
                        $ne: [
                          {
                            $trim: {
                              input: { $toString: "$$sel.licensenumber" }
                            }
                          },
                          ""
                        ]
                      }
                    ]
                  }
                }
              }
            }
          },
          { $limit: 20 }
        ]);

        if (customers.length > 0) {
          return res.status(200).json({
            message: "Customer(s) found",
            data: customers
          });
        }

        return res.status(200).json({
          message: "No customer found",
          data: []
        });
      }
    } else {
      let customers;

      if (role === "Admin" || pendingCustomerList) {
        customers = await Customer.aggregate([
          { $sort: { customerName: 1 } },
          ...getPopulateSelectedStages()
        ]);
      } else {
        if (!parsedBranch || parsedBranch.length === 0) {
          return res.status(403).json({
            message: "No branches assigned to staff"
          });
        }

        customers = await Customer.aggregate([
          {
            $match: {
              "selected.branch_id": { $in: objectIds }
            }
          },
          { $sort: { customerName: 1 } },
          ...getPopulateSelectedStages()
        ]);
      }

      const normalizedCustomers = normalizeCustomers(customers);

      if (normalizedCustomers.length === 0) {
        return res.status(404).json({
          message: "No customer found",
          data: []
        });
      }

      return res.status(200).json({
        message: "Customer(s) found",
        data: normalizedCustomers
      });
    }
  } catch (error) {
    console.error("Error fetching customer data:", error);
    return res.status(500).json({
      message: "An error occurred while fetching customer data.",
      error: error.message
    });
  }
};
export const GetLicense = async (req, res) => {
  try {
    const licensenumber = await License.find()

    if (licensenumber.length > 0) {
      res
        .status(200)
        .json({ message: "license number found", data: licensenumber })
    }
  } catch (err) {
    console.log(err.message)
    res.status(500).send("server error")
  }
}
export const ChecklicenseForlead = async (req, res) => {
  try {
    const { licenseNumber } = req.query

    if (!licenseNumber) {
      return res.status(400).json({
        message: "License number is required"
      });
    }

    const licenseNo = Number(licenseNumber);
    // console.log("licneseno,licenseNo", licenseNo)

    const [leadExists, licenseExists] = await Promise.all([
      Lead.findOne({
        "leadFor.licenseNumber": licenseNo
      }).select("_id"),

      License.findOne({
        licensenumber: licenseNo
      }).select("_id")
    ]);

    return res.json({
      exists: !!(leadExists || licenseExists),
      source: leadExists
        ? "Lead"
        : licenseExists
          ? "License"
          : null
    });
  } catch (error) {
    console.log("error", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}

export const customerCallRegistration = async (req, res) => {
  try {
    const { customerid, customer, branchName = {}, username } = req.query // Get customerid from query

    const calldata = req.body // Assuming calldata is sent in the body
    const emailsend = calldata.formdata.emailSend
    // console.log("emailsenddd", emailsend)
    // console.log("branhname", branchName)

    // Convert attendedBy.callerId to ObjectId
    const addTimes = (time1, time2) => {
      const parseTime = (time) => {
        const [hours, minutes, seconds] = time.split(":").map(Number)
        return { hours, minutes, seconds }
      }

      const formatTime = ({ hours, minutes, seconds }) => {
        // Handle overflow
        minutes += Math.floor(seconds / 60)
        seconds = seconds % 60

        hours += Math.floor(minutes / 60)
        minutes = minutes % 60

        return [
          hours.toString().padStart(2, "0"),
          minutes.toString().padStart(2, "0"),
          seconds.toString().padStart(2, "0")
        ].join(":")
      }

      const t1 = parseTime(time1)
      const t2 = parseTime(time2)

      const totalTime = {
        hours: t1.hours + t2.hours,
        minutes: t1.minutes + t2.minutes,
        seconds: t1.seconds + t2.seconds
      }

      return formatTime(totalTime)
    }
    if (
      calldata.formdata &&
      calldata.formdata.attendedBy &&
      calldata.formdata.attendedBy.callerId
    ) {
      calldata.formdata.attendedBy.callerId = new mongoose.Types.ObjectId(
        calldata.formdata.attendedBy.callerId
      )
    }
    if (
      calldata.formdata &&
      calldata.formdata.completedBy &&
      calldata.formdata.completedBy.callerId
    ) {
      calldata.formdata.completedBy.callerId = new mongoose.Types.ObjectId(
        calldata.formdata.completedBy.callerId
      )
    }

    // Convert customerid to ObjectId
    const customerId = new mongoose.Types.ObjectId(customerid)

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      throw new Error("Invalid ObjectId format")
    }

    // Find if there is already a call registration for this customer
    const user = await CallRegistration.findOne({ customerid: customerId })



    if (user) {
      const token = calldata.formdata.token
      if (token) {
        const callToUpdate = user.callregistration.find(
          (call) => call.timedata.token === token
        )

        // Function to convert "HH:MM:SS" format to total seconds

        if (callToUpdate) {
          if (!callToUpdate.timedata.time) {
            callToUpdate.timedata.time = 0 // Initialize time to 0 if it doesn't exist
          }
          // Update the fields with the new data

          callToUpdate.timedata.startTime = callToUpdate.timedata.startTime
          callToUpdate.timedata.endTime = calldata.timedata.endTime
          // Convert the total duration back to "HH:MM:SS" format
          callToUpdate.timedata.duration += calldata.timedata.duration

          callToUpdate.timedata.time = addTimes(
            callToUpdate.timedata.time,
            calldata.timedata.time
          )

          callToUpdate.timedata.token = calldata.timedata.token
          callToUpdate.formdata.incomingNumber =
            calldata.formdata.incomingNumber
          callToUpdate.formdata.token = calldata.formdata.token
          callToUpdate.formdata.description = calldata.formdata.description
          callToUpdate.formdata.callnote = calldata.formdata.callnote

          callToUpdate.formdata.solution = calldata.formdata.solution
          callToUpdate.formdata.status = calldata.formdata.status
          let existingAttendedBy = callToUpdate.formdata.attendedBy;

          // Convert to array if it's a string
          if (!Array.isArray(existingAttendedBy)) {
            existingAttendedBy = existingAttendedBy ? [existingAttendedBy] : [];
          }
          if (calldata.formdata.attendedBy) {
            existingAttendedBy.push(calldata.formdata.attendedBy);
          }

          // Assign it back to the document
          callToUpdate.formdata.attendedBy = existingAttendedBy;
          if (calldata.formdata.status === "solved") {
            const newCompletedBy = calldata.formdata.completedBy;

            if (newCompletedBy) {
              callToUpdate.formdata.completedBy = [];
              callToUpdate.formdata.completedBy.push(calldata.formdata.completedBy)
            } else {
              callToUpdate.formdata.completedBy = [];
            }

          }
          callToUpdate.license = calldata.license

          callToUpdate.branchName = Array.isArray(calldata.branchName)
            ? calldata.branchName
            : [calldata.branchName];

          // Save the updated document
          const updatedCall = await user.save()

          if (updatedCall) {
            const Id = calldata.formdata.attendedBy.callerId

            const staffCaller = await Staff.findOne({
              _id: Id
            })
            if (staffCaller) {
              if (calldata.formdata.status === "pending") {
                staffCaller.callstatus.totalCall += 1

                staffCaller.callstatus.pendingCalls += 1

                staffCaller.callstatus.totalDuration +=
                  calldata.timedata.duration

                const pendingSavedStaff = await staffCaller.save()

                if (pendingSavedStaff) {
                  const emailResponse = await sendEmail(
                    calldata,
                    customer,
                    branchName,
                    username,
                    emailsend
                  )

                  if (emailResponse) {
                    return res.status(200).json({
                      success: true,
                      message: "Call registered"
                    })
                  } else {
                    return res
                      .status(200)
                      .json({ message: "Call registered email not send" })
                  }
                }
              } else if (calldata.formdata.status === "solved") {
                const mapAndCheckAttendedBy = (data, selectedId) => {
                  //  Count how many times callerId matches selectedId
                  const matchCount = data.formdata.attendedBy.filter(
                    (attendee) => attendee?.callerId?.equals(selectedId)
                  ).length

                  // Return true if matchCount >= 2, otherwise false
                  return matchCount >= 2
                }

                // Example operation
                const findMatchingDocAndCheckCallerId = (
                  updatedCall,
                  token,
                  selectedId
                ) => {
                  // Find the matching doc
                  const matchingDoc = updatedCall.callregistration.find(
                    (call) => call.timedata.token === token
                  )

                  // If a matching doc is found, call the mapAndCheckAttendedBy function
                  if (matchingDoc) {
                    const isCallerIdMatched = mapAndCheckAttendedBy(
                      matchingDoc,
                      selectedId
                    )
                    return { matchingDoc, isCallerIdMatched }
                  }

                  // Return false if no matching doc is found
                  return false
                }
                //
                const { matchingDoc, isCallerIdMatched } =
                  findMatchingDocAndCheckCallerId(
                    updatedCall,
                    token,
                    calldata?.formdata?.attendedBy?.callerId
                  )

                staffCaller.callstatus.totalCall = isCallerIdMatched
                  ? staffCaller.callstatus.totalCall
                  : staffCaller.callstatus.totalCall + 1

                staffCaller.callstatus.solvedCalls += 1

                staffCaller.callstatus.totalDuration +=
                  calldata.timedata.duration

                const saved = await staffCaller.save()
                if (saved) {
                  // const stringDoc = JSON.stringify(matchingDoc, null, 2)
                  // const parsedDoc = JSON.parse(stringDoc)

                  const processedAttendedBy = matchingDoc.formdata.attendedBy
                    .slice(0, -1)
                    .map((item) => item)

                  try {
                    const results = await updateProcessedAttendees(
                      processedAttendedBy,
                      Id
                    )

                    // Check if there are any items with a status other than "success"
                    const hasErrors = results.some(
                      (result) => result.status !== "success"
                    )

                    if (hasErrors) {
                      return res.status(207).json({
                        // 207 for multi-status response
                        message: "Update process completed with some errors",
                        results
                      })
                    } else {
                      const emailResponse = await sendEmail(
                        calldata,
                        customer,
                        branchName,
                        username,
                        emailsend
                      )
                      if (emailResponse) {
                        return res.status(200).json({
                          success: true,
                          message: "Call registered"
                        })
                      } else {
                        return res
                          .status(200)
                          .json({ message: "Call registered email not send" })
                      }
                    }
                  } catch (error) {
                    console.error("Error in updateAttendeesController:", error)
                    return res.status(500).json({
                      message: "An error occurred during the update process",
                      error: error.message
                    })
                  }
                }
              }
            } else {
              const adminCaller = await Admin.findOne({
                _id: Id
              })
              if (adminCaller) {
                if (calldata.formdata.status === "pending") {
                  adminCaller.callstatus.totalCall += 1

                  adminCaller.callstatus.pendingCalls += 1

                  adminCaller.callstatus.totalDuration +=
                    calldata.timedata.duration

                  const pendingAdminSaved = await adminCaller.save()
                  if (pendingAdminSaved) {
                    const emailResponse = await sendEmail(
                      calldata,
                      customer,
                      branchName,
                      username,
                      emailsend
                    )

                    if (emailResponse) {
                      return res.status(200).json({
                        success: true,
                        message: "Call registered"
                      })
                    } else {
                      return res
                        .status(200)
                        .json({ message: "Call registered email not send" })
                    }
                  }
                } else if (calldata.formdata.status === "solved") {
                  const mapAndCheckAttendedBy = (data, selectedId) => {
                    // Count how many times callerId matches selectedId
                    const matchCount = data.formdata.attendedBy.filter(
                      (attendee) => attendee.callerId.equals(selectedId)
                    ).length
                    // Return true if matchCount >= 2, otherwise false
                    return matchCount >= 2
                  }

                  // Example operation
                  const findMatchingDocAndCheckCallerId = (
                    updatedCall,
                    token,
                    selectedId
                  ) => {
                    // Find the matching doc
                    const matchingDoc = updatedCall.callregistration.find(
                      (call) => call?.timedata?.token === token
                    )

                    // If a matching doc is found, call the mapAndCheckAttendedBy function
                    if (matchingDoc) {
                      const isCallerIdMatched = mapAndCheckAttendedBy(
                        matchingDoc,
                        selectedId
                      )
                      return { matchingDoc, isCallerIdMatched }
                    }

                    // Return false if no matching doc is found
                    return false
                  }
                  //
                  const { matchingDoc, isCallerIdMatched } =
                    findMatchingDocAndCheckCallerId(
                      updatedCall,
                      token,
                      calldata?.formdata?.attendedBy?.callerId
                    )
                  //

                  adminCaller.callstatus.totalCall = isCallerIdMatched
                    ? adminCaller.callstatus.totalCall
                    : adminCaller.callstatus.totalCall + 1

                  adminCaller.callstatus.solvedCalls += 1

                  adminCaller.callstatus.totalDuration +=
                    calldata.timedata.duration

                  const saved = await adminCaller.save()
                  if (saved) {
                    const processedAttendedBy = matchingDoc.formdata.attendedBy
                      .slice(0, -1)
                      .map((item) => item)

                    try {
                      const results = await updateProcessedAttendees(
                        processedAttendedBy,
                        Id
                      )

                      // Check if there are any items with a status other than "success"
                      const hasErrors = results.some(
                        (result) => result.status !== "success"
                      )

                      if (hasErrors) {
                        return res.status(207).json({
                          // 207 for multi-status response
                          message: "Update process completed with some errors",
                          results
                        })
                      } else {
                        const emailResponse = await sendEmail(
                          calldata,
                          customer,
                          branchName,
                          username,
                          emailsend
                        )
                        if (emailResponse) {
                          return res.status(200).json({
                            success: true,
                            message: "Call registered"
                          })
                        } else {
                          return res
                            .status(200)
                            .json({ message: "Call registered email not send" })
                        }
                      }
                    } catch (error) {
                      console.error(
                        "Error in updateAttendeesController:",
                        error
                      )
                      return res.status(500).json({
                        message: "An error occurred during the update process",
                        error: error.message
                      })
                    }
                  }
                }
              }
            }
          }
        }
      } else {
        const isTokenUsed = await CallRegistration.findOne({
          "callregistration.timedata.token": calldata.timedata.token
        });

        if (isTokenUsed) {
          const newToken = generateUniqueNumericToken()
          const isAgainUsed = await CallRegistration.findOne({
            "callregistration.timedata.token": newToken
          })
          if (isAgainUsed) {

            throw new Error("Token already exists"); // ⛔ Execution jumps to catch block here

          } else {
            calldata.timedata.token = newToken
          }


        }
        // console.log("calldata", calldata)
        user.callregistration.push(calldata)
        const updatedCall = await user.save()
        const Id = calldata.formdata.attendedBy.callerId

        if (updatedCall) {
          const staffCaller = await Staff.findOne({
            _id: Id
          })

          if (staffCaller) {
            if (calldata.formdata.status === "pending") {
              staffCaller.callstatus.totalCall += 1

              staffCaller.callstatus.pendingCalls += 1

              staffCaller.callstatus.totalDuration += calldata.timedata.duration

              const pendingSavedStaff = await staffCaller.save()
              if (pendingSavedStaff) {
                const emailResponse = await sendEmail(
                  calldata,
                  customer,
                  branchName,
                  username,
                  emailsend
                )
                if (emailResponse) {
                  return res.status(200).json({
                    success: true,
                    message: "Call registered"
                  })
                } else {
                  return res
                    .status(200)
                    .json({ message: "Call registered email not send" })
                }
              }
            } else if (calldata.formdata.status === "solved") {
              staffCaller.callstatus.totalCall += 1

              staffCaller.callstatus.solvedCalls += 1

              staffCaller.callstatus.totalDuration += calldata.timedata.duration

              const saved = await staffCaller.save()
              if (saved) {
                const emailResponse = await sendEmail(
                  calldata,
                  customer,
                  branchName,
                  username,
                  emailsend
                )
                if (emailResponse) {
                  return res.status(200).json({
                    success: true,
                    message: "Call registered"
                  })
                } else {
                  return res
                    .status(200)
                    .json({ message: "Call registered email not send" })
                }
              }
            }
          } else {
            const adminCaller = await Admin.findOne({
              _id: Id
            })
            if (adminCaller) {
              if (calldata.formdata.status === "pending") {
                adminCaller.callstatus.totalCall += 1

                adminCaller.callstatus.pendingCalls += 1

                adminCaller.callstatus.totalDuration +=
                  calldata.timedata.duration

                const pendingAdminSaved = await adminCaller.save()
                if (pendingAdminSaved) {
                  const emailResponse = await sendEmail(
                    calldata,
                    customer,
                    branchName,
                    emailsend
                  )
                  if (emailResponse) {
                    return res.status(200).json({
                      success: true,
                      message: "Call registered"
                    })
                  } else {
                    return res
                      .status(200)
                      .json({ message: "Call registered email not send" })
                  }
                }
              } else if (calldata.formdata.status === "solved") {
                adminCaller.callstatus.totalCall += 1

                adminCaller.callstatus.solvedCalls += 1

                adminCaller.callstatus.totalDuration +=
                  calldata.timedata.duration

                const saved = await adminCaller.save()
                if (saved) {
                  const emailResponse = await sendEmail(
                    calldata,
                    customer,
                    branchName,
                    username,
                    emailsend
                  )

                  if (emailResponse) {
                    return res.status(200).json({
                      success: true,
                      message: "Call registered"
                    })
                  } else {
                    return res
                      .status(200)
                      .json({ message: "Call registered email not send" })
                  }
                }
              }
            }
          }
        }
      }
    } else {
      const isTokenUsed = await CallRegistration.findOne({
        "callregistration.timedata.token": calldata.timedata.token
      });

      if (isTokenUsed) {
        const newToken = generateUniqueNumericToken()
        const isAgainUsed = await CallRegistration.findOne({
          "callregistration.timedata.token": newToken
        })
        if (isAgainUsed) {

          throw new Error("Token already exists"); // ⛔ Execution jumps to catch block here

        } else {
          calldata.timedata.token = newToken
        }


      }
      //If no document is found, create a new one with the given call data
      const newCall = new CallRegistration({
        customerid: customerId,
        customerName: customer,
        callregistration: [calldata] // Wrap calldata in an array
      })

      // Save the new document
      const updatedCall = await newCall.save()
      if (updatedCall) {
        const Id = calldata.formdata.attendedBy.callerId

        const staffCaller = await Staff.findOne({
          _id: Id
        })

        if (staffCaller) {
          if (calldata.formdata.status === "pending") {
            staffCaller.callstatus.totalCall += 1

            staffCaller.callstatus.pendingCalls += 1

            staffCaller.callstatus.totalDuration += calldata.timedata.duration

            const pendingSavedStaff = await staffCaller.save()

            if (pendingSavedStaff) {
              const emailResponse = await sendEmail(
                calldata,
                customer,
                branchName,
                username,
                emailsend
              )

              if (emailResponse) {
                return res.status(200).json({
                  success: true,
                  message: "Call registered"
                })
              } else {
                return res
                  .status(200)
                  .json({ message: "Call registered email not send" })
              }
            }
          } else if (calldata.formdata.status === "solved") {
            staffCaller.callstatus.totalCall += 1

            staffCaller.callstatus.solvedCalls += 1

            staffCaller.callstatus.totalDuration += calldata.timedata.duration

            const saved = await staffCaller.save()
            if (saved) {
              const emailResponse = await sendEmail(
                calldata,
                customer,
                branchName,
                username,
                emailsend
              )
              if (emailResponse) {
                return res.status(200).json({
                  success: true,
                  message: "Call registered"
                })
              } else {
                return res
                  .status(200)
                  .json({ message: "Call registered email not send" })
              }
            }
          }
        } else {
          const adminCaller = await Admin.findOne({
            _id: Id
          })
          if (adminCaller) {
            if (calldata.formdata.status === "pending") {
              adminCaller.callstatus.totalCall += 1

              adminCaller.callstatus.pendingCalls += 1

              adminCaller.callstatus.totalDuration += calldata.timedata.duration

              const pendingAdminSaved = await adminCaller.save()
              if (pendingAdminSaved) {
                const emailResponse = await sendEmail(
                  calldata,
                  customer,
                  branchName,
                  username,
                  emailsend
                )
                if (emailResponse) {
                  return res.status(200).json({
                    success: true,
                    message: "Call registered"
                  })
                } else {
                  return res
                    .status(200)
                    .json({ message: "Call registered email not send" })
                }
              }
            } else if (calldata.formdata.status === "solved") {
              adminCaller.callstatus.totalCall += 1

              adminCaller.callstatus.solvedCalls += 1

              adminCaller.callstatus.totalDuration += calldata.timedata.duration

              const saved = await adminCaller.save()
              if (saved) {
                const emailResponse = await sendEmail(
                  calldata,
                  customer,
                  branchName,
                  username,
                  emailsend
                )
                if (emailResponse) {
                  return res.status(200).json({
                    success: true,
                    message: "Call registered"
                  })
                } else {
                  return res
                    .status(200)
                    .json({ message: "Call registered email not send" })
                }
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error saving or updating call registration:", error.message)
    return res.status(500).json({
      status: false,
      message: "Error saving or updating call registration"
    })
  }
}
const updateProcessedAttendees = async (processedAttendedBy, attendedId) => {
  const updateResults = []

  // Helper function to update call status
  const updateCallStatus = async (user, callerId) => {
    user.callstatus.pendingCalls -= 1
    user.callstatus.colleagueSolved = callerId.equals(attendedId)
      ? user.callstatus.colleagueSolved
      : user.callstatus.colleagueSolved + 1

    // Save the updated document
    await user.save()
  }

  for (const item of processedAttendedBy) {
    const { callerId } = item

    try {
      // Try finding staff with the given callerId
      let user = await Staff.findOne({ _id: callerId })

      // If not found in Staff, search in Admin
      if (!user) {
        user = await Admin.findOne({ _id: callerId })
      }

      // If either staff or admin is found, update their call status
      if (user) {
        const a = await updateCallStatus(user, callerId)

        // Record success status for this item
        updateResults.push({ callerId, status: "success" })
      } else {
        // Record not found status if neither staff nor admin is found
        updateResults.push({ callerId, status: "not found" })
      }
    } catch (error) {
      console.error(`Error updating call status for ${callerId}:`, error)
      // Record error status for this item
      updateResults.push({ callerId, status: "error", error: error.message })
    }
  }

  // Return the final status after all updates
  return updateResults
}

export const loggeduserCallsCurrentDateCalls = async (req, res) => {
  try {
    const { loggedUserId } = req.query
    const loggeduserObjectId = new mongoose.Types.ObjectId(loggedUserId)
    const today = new Date()

    const startOfDayStr = new Date(today.setHours(0, 0, 0, 0)).toISOString()
    const endOfDayStr = new Date(today.setHours(23, 59, 59, 999)).toISOString()
    // Build the initial match condition that always includes the user ID

    const pipeline = [
      // Match customers who have calls attended by the logged user today
      {
        $match: {
          callregistration: {
            $elemMatch: {
              "formdata.attendedBy": {
                $elemMatch: {
                  callerId: loggeduserObjectId,
                  calldate: { $gte: startOfDayStr, $lte: endOfDayStr }
                }
              }
            }
          }
        }
      },
      // Unwind the callregistration array to process each call
      {
        $unwind: {
          path: "$callregistration",
          preserveNullAndEmptyArrays: false
        }
      },
      // Filter to keep only calls that were attended by the logged user today
      {
        $match: {
          "callregistration.formdata.attendedBy": {
            $elemMatch: {
              callerId: loggeduserObjectId,
              calldate: { $gte: startOfDayStr, $lte: endOfDayStr }
            }
          }
        }
      },
      // Lookup product details
      {
        $lookup: {
          from: "products",
          localField: "callregistration.product",
          foreignField: "_id",
          as: "callregistration.productDetails"
        }
      },
      {
        $addFields: {
          "callregistration.productDetails": {
            $map: {
              input: "$callregistration.productDetails",
              as: "product",
              in: { productName: "$$product.productName" }
            }
          }
        }
      },
      // Lookup completedBy staff details
      {
        $lookup: {
          from: "staffs",
          localField: "callregistration.formdata.completedBy.callerId",
          foreignField: "_id",
          as: "completedByDetails"
        }
      },
      {
        $addFields: {
          "callregistration.formdata.completedBy.name": {
            $arrayElemAt: ["$completedByDetails.name", 0]
          }
        }
      },
      // Lookup attendedBy staff details
      {
        $lookup: {
          from: "staffs",
          let: { attendedByArray: "$callregistration.formdata.attendedBy" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$attendedByArray.callerId"]
                }
              }
            },
            { $project: { _id: 1, name: 1 } }
          ],
          as: "attendedByStaff"
        }
      },
      // Add staff names to attendedBy entries
      {
        $addFields: {
          "callregistration.formdata.attendedBy": {
            $map: {
              input: "$callregistration.formdata.attendedBy",
              as: "attended",
              in: {
                $mergeObjects: [
                  "$$attended",
                  {
                    name: {
                      $let: {
                        vars: {
                          staff: {
                            $arrayElemAt: [
                              {
                                $filter: {
                                  input: "$attendedByStaff",
                                  as: "staff",
                                  cond: {
                                    $eq: ["$$staff._id", "$$attended.callerId"]
                                  }
                                }
                              },
                              0
                            ]
                          }
                        },
                        in: "$$staff.name"
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      },
      // Group by customer ID to consolidate calls
      {
        $group: {
          _id: "$_id",
          customerid: { $first: "$customerid" },
          customerName: { $first: "$customerName" },
          callregistration: { $push: "$callregistration" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" }
        }
      }
    ]

    const currentDateloggedusercalls = await CallRegistration.aggregate(
      pipeline
    )

    return res
      .status(200)
      .json({ message: "found", data: currentDateloggedusercalls })
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const GetCallRegister = async (req, res) => {
  try {
    const { customerid } = req.query

    const { callId } = req.params
// console.log("callidddddddddddddddddddddddd",callId)
// console.log("customerid",customerid)
    if (customerid !== "null" && customerid) {
// console.log("Hhhhhhhhhhhhhhhhhhhhhhhhhhhh")
      const customerId = new mongoose.Types.ObjectId(customerid)
      const registeredCall = await CallRegistration.findOne({
        customerid: customerId
      }).populate({ path: "callregistration.product", select: "productName shortName productorservicetype" })

      const attendedByIds = new Set()
      const completedByIds = new Set()
      registeredCall.callregistration.map((entry) => {
        // Handle `attendedBy`
        const attendedBy = entry.formdata.attendedBy
        if (Array.isArray(attendedBy)) {
          // If it's an array, iterate over it
          attendedBy.forEach((attendee) => {
            if (attendee.callerId) {
              attendedByIds.add(attendee.callerId.toString())
            } else if (attendee.name) {
              attendedByIds.add(attendee.name)
            }
          })
        } else if (typeof attendedBy === "string") {
          // If it's a string, add it directly
          attendedByIds.add(attendedBy)
        }

        // Handle `completedBy`
        const completedBy = entry.formdata.completedBy
        if (Array.isArray(completedBy) && completedBy.length > 0) {
          const completedByEntry = completedBy[0]
          if (completedByEntry.callerId) {
            completedByIds.add(completedByEntry.callerId.toString())
          } else if (completedByEntry.name) {
            completedByIds.add(completedByEntry.name)
            // Optionally, handle cases where only the name exists
            console.warn(
              `CompletedBy has name but no callerId: ${completedByEntry.name}`
            )
          }
        } else if (typeof completedBy === "string") {
          // If it's a string, add it directly
          completedByIds.add(completedBy)
        }
      })

      // Separate IDs and names from the Sets
      const attendedByIdsArray = Array.from(attendedByIds)
      const attendedByObjectIds = attendedByIdsArray.filter((id) =>
        mongoose.Types.ObjectId.isValid(id)
      )

      const attendedByNames = attendedByIdsArray
        .filter((id) => !mongoose.Types.ObjectId.isValid(id)) // Filter invalid ObjectIds (names)
        .map((name) => ({ name })) // Transform them into objects with a "name" property

      const completedByIdsArray = Array.from(completedByIds)
      const completedByObjectIds = completedByIdsArray.filter((id) =>
        mongoose.Types.ObjectId.isValid(id)
      )

      const completedByNames = completedByIdsArray
        .filter((id) => !mongoose.Types.ObjectId.isValid(id)) // Filter invalid ObjectIds (names)
        .map((name) => ({ name })) // Transform them into objects with a "name" property
      // Query for ObjectIds (staff/admin users)
      const [
        attendedByStaff,
        attendedByAdmin,
        completedByStaff,
        completedByAdmin
      ] = await Promise.all([
        // Search attendedBy IDs in Staff
        mongoose
          .model("Staff")
          .find({ _id: { $in: attendedByObjectIds } })
          .select("name _id ")
          .lean(),

        // Search attendedBy IDs in Admin
        mongoose
          .model("Admin")
          .find({ _id: { $in: attendedByObjectIds } })
          .select("name _id ")
          .lean(),

        // Search completedBy IDs in Staff
        mongoose
          .model("Staff")
          .find({ _id: { $in: completedByObjectIds } })
          .select("name _id ")
          .lean(),

        // Search completedBy IDs in Admin
        mongoose
          .model("Admin")
          .find({ _id: { $in: completedByObjectIds } })
          .select("name _id ")
          .lean()
      ])

      // Combine results for attendedBy and completedBy
      const attendedByUsers = [...attendedByStaff, ...attendedByAdmin]
      const completedByUsers = [...completedByStaff, ...completedByAdmin]

      // Optionally handle name-based entries as well
      const attendedByCombined = [...attendedByUsers, ...attendedByNames]

      const completedByCombined = [...completedByUsers, ...completedByNames]
      const userMap = new Map(
        [...attendedByCombined, ...completedByCombined].map((user) => [
          user._id ? user._id.toString() : user.name,
          user.name
        ])
      )

      registeredCall.callregistration.forEach((entry) => {
        // Handle attendedBy field
        if (Array.isArray(entry?.formdata?.attendedBy)) {
          entry.formdata.attendedBy = entry.formdata.attendedBy
            .flat() // Flatten the array
            .map((attendee) => {
              const name = userMap.get(attendee?.callerId?.toString())
              // If name is found, attach it to the callerId
              return name ? { ...attendee, callerId: { name } } : attendee // Keep original if no name found
            })
        } else if (typeof entry?.formdata?.attendedBy === "string") {
          // If attendedBy is a string (not an array), map it to the name if it exists in userMap
          const name = userMap.get(entry?.formdata?.attendedBy)
          entry.formdata.attendedBy = name
            ? { callerId: { name } } // Map the string to an object with a name
            : { callerId: entry?.formdata?.attendedBy } // Keep the original if no name found
        }

        // Handle completedBy field
        if (
          Array.isArray(entry?.formdata?.completedBy) &&
          entry?.formdata?.completedBy.length > 0
        ) {
          // If completedBy is an array, map over each entry (assuming one entry)
          const completedUser = userMap.get(
            entry?.formdata?.completedBy[0]?.callerId?.toString()
          )
          entry.formdata.completedBy = completedUser
            ? [{ ...entry?.formdata?.completedBy[0], name: completedUser }] // Add the name to the first item
            : entry.formdata.completedBy // Keep as is if no name found
        } else if (typeof entry?.formdata?.completedBy === "string") {
          // If completedBy is a string, map it to the name if it exists in userMap
          const name = userMap.get(entry?.formdata?.completedBy)
          entry.formdata.completedBy = name
            ? { callerId: { name } } // Map the string to an object with a name
            : { callerId: entry?.formdata?.completedBy } // Keep the original if no name found
        }
      })
      if (registeredCall) {
        return res
          .status(200)
          .json({ message: "registered call found", data: registeredCall })
      } else {
        return res.status(404).json({ message: "No registered Calls" })
      }
    } else if (callId) {
// console.log("callid",callId)
      const callDetails = await CallRegistration.findById(callId)
.populate({
    path: "customerid",
    populate: [
      {
        path: "partner",
        model: "Partner" // optional if ref is defined in schema
      },
      {
        path: "selected.company_id",
        model: "Company"
      },
      {
        path: "selected.branch_id",
        model: "Branch"
      },
      {
        path: "selected.product_id",
        model: "Product"
      }
    ]
  }).populate({
          path: "callregistration.product", // Populate the product field inside callregistration array
          model: "Product"
        })
        .populate({ path: "callregistration.formdata.callnote" })
      // console.log("calldetails", callDetails)

      const attendedByIds = new Set()
      const completedByIds = new Set()
      callDetails.callregistration.map((entry) => {
        // Handle `attendedBy`
        const attendedBy = entry.formdata.attendedBy
        if (Array.isArray(attendedBy)) {
          // If it's an array, iterate over it
          attendedBy.forEach((attendee) => {
            if (attendee.callerId) {
              attendedByIds.add(attendee.callerId.toString())
            } else if (attendee.name) {
              attendedByIds.add(attendee.name)
            }
          })
        } else if (typeof attendedBy === "string") {
          // If it's a string, add it directly
          attendedByIds.add(attendedBy)
        }

        // Handle `completedBy`
        const completedBy = entry.formdata.completedBy
        if (Array.isArray(completedBy) && completedBy.length > 0) {
          const completedByEntry = completedBy[0]
          if (completedByEntry.callerId) {
            completedByIds.add(completedByEntry.callerId.toString())
          } else if (completedByEntry.name) {
            completedByIds.add(completedByEntry.name)
            // Optionally, handle cases where only the name exists
            console.warn(
              `CompletedBy has name but no callerId: ${completedByEntry.name}`
            )
          }
        } else if (typeof completedBy === "string") {
          // If it's a string, add it directly
          completedByIds.add(completedBy)
        }
      })

      // Separate IDs and names from the Sets
      const attendedByIdsArray = Array.from(attendedByIds)
      const attendedByObjectIds = attendedByIdsArray.filter((id) =>
        mongoose.Types.ObjectId.isValid(id)
      )

      const attendedByNames = attendedByIdsArray
        .filter((id) => !mongoose.Types.ObjectId.isValid(id)) // Filter invalid ObjectIds (names)
        .map((name) => ({ name })) // Transform them into objects with a "name" property

      const completedByIdsArray = Array.from(completedByIds)
      const completedByObjectIds = completedByIdsArray.filter((id) =>
        mongoose.Types.ObjectId.isValid(id)
      )

      const completedByNames = completedByIdsArray
        .filter((id) => !mongoose.Types.ObjectId.isValid(id)) // Filter invalid ObjectIds (names)
        .map((name) => ({ name })) // Transform them into objects with a "name" property

      // Query for ObjectIds (staff/admin users)
      const [
        attendedByStaff,
        attendedByAdmin,
        completedByStaff,
        completedByAdmin
      ] = await Promise.all([
        // Search attendedBy IDs in Staff
        mongoose
          .model("Staff")
          .find({ _id: { $in: attendedByObjectIds } })
          .select("name _id ")
          .lean(),

        // Search attendedBy IDs in Admin
        mongoose
          .model("Admin")
          .find({ _id: { $in: attendedByObjectIds } })
          .select("name _id ")
          .lean(),

        // Search completedBy IDs in Staff
        mongoose
          .model("Staff")
          .find({ _id: { $in: completedByObjectIds } })
          .select("name _id ")
          .lean(),

        // Search completedBy IDs in Admin
        mongoose
          .model("Admin")
          .find({ _id: { $in: completedByObjectIds } })
          .select("name _id ")
          .lean()
      ])

      // Combine results for attendedBy and completedBy
      const attendedByUsers = [...attendedByStaff, ...attendedByAdmin]
      const completedByUsers = [...completedByStaff, ...completedByAdmin]

      // Optionally handle name-based entries as well
      const attendedByCombined = [...attendedByUsers, ...attendedByNames]

      const completedByCombined = [...completedByUsers, ...completedByNames]
      const userMap = new Map(
        [...attendedByCombined, ...completedByCombined].map((user) => [
          user._id ? user._id.toString() : user.name,
          user.name
        ])
      )

      callDetails.callregistration.forEach((entry) => {
        // Handle attendedBy field
        if (Array.isArray(entry?.formdata?.attendedBy)) {
          entry.formdata.attendedBy = entry.formdata.attendedBy
            .flat() // Flatten the array
            .map((attendee) => {
              const name = userMap.get(attendee?.callerId?.toString())
              // If name is found, attach it to the callerId
              return name ? { ...attendee, callerId: { name } } : attendee // Keep original if no name found
            })
        } else if (typeof entry?.formdata?.attendedBy === "string") {
          // If attendedBy is a string (not an array), map it to the name if it exists in userMap
          const name = userMap.get(entry?.formdata?.attendedBy)
          entry.formdata.attendedBy = name
            ? { callerId: { name } } // Map the string to an object with a name
            : { callerId: entry?.formdata?.attendedBy } // Keep the original if no name found
        }

        // Handle completedBy field
        if (
          Array.isArray(entry?.formdata?.completedBy) &&
          entry?.formdata?.completedBy.length > 0
        ) {
          // If completedBy is an array, map over each entry (assuming one entry)
          const completedUser = userMap.get(
            entry?.formdata?.completedBy[0]?.callerId?.toString()
          )
          entry.formdata.completedBy = completedUser
            ? [{ ...entry?.formdata?.completedBy[0], name: completedUser }] // Add the name to the first item
            : entry.formdata.completedBy // Keep as is if no name found
        } else if (typeof entry?.formdata?.completedBy === "string") {
          // If completedBy is a string, map it to the name if it exists in userMap
          const name = userMap.get(entry?.formdata?.completedBy)
          entry.formdata.completedBy = name
            ? { callerId: { name } } // Map the string to an object with a name
            : { callerId: entry?.formdata?.completedBy } // Keep the original if no name found
        }
      })
      if (!callDetails) {
        return res.status(404).json({ message: "Calls not found" })
      } else {
        return res
          .status(200)
          .json({ message: "calls with respect customer found", callDetails })
      }

      // Send the call details as a response
    }
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: "internal server error" })
  }
}
export const GetAllExpiryRegister = async (req, res) => {
  const { nextmonthReport, startDate, endDate, filterType = "all" } = req.query

  try {
    let startOfNextMonth
    let endOfNextMonth

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (nextmonthReport) {
      startOfNextMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        1
      )

      endOfNextMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 2,
        0
      )

      endOfNextMonth.setHours(23, 59, 59, 999)
    }

    const dateFilter = nextmonthReport
      ? { $gte: startOfNextMonth, $lte: endOfNextMonth }
      : { $gte: new Date(startDate), $lte: new Date(endDate) }

    let elemMatch = {}

    switch (filterType) {
      case "amc":
        elemMatch = {
          amcendDate: dateFilter
        }
        break

      case "tuv":
        elemMatch = {
          tvuexpiryDate: dateFilter
        }
        break

      case "license":
        elemMatch = {
          licenseExpiryDate: dateFilter
        }
        break

      default:
        elemMatch = {
          $or: [
            { licenseExpiryDate: dateFilter },
            { tvuexpiryDate: dateFilter },
            { amcendDate: dateFilter }
          ]
        }
    }

    const customers = await Customer.find({
      selected: {
        $elemMatch: elemMatch
      }
    })

    const expiredCustomers = customers.map((customer) => {
      const selected = customer.selected
        .filter((item) => {
          switch (filterType) {
            case "amc":
              return (
                item.amcendDate &&
                item.amcendDate >= dateFilter.$gte &&
                item.amcendDate <= dateFilter.$lte
              )

            case "tuv":
              return (
                item.tvuexpiryDate &&
                item.tvuexpiryDate >= dateFilter.$gte &&
                item.tvuexpiryDate <= dateFilter.$lte
              )

            case "license":
              return (
                item.licenseExpiryDate &&
                item.licenseExpiryDate >= dateFilter.$gte &&
                item.licenseExpiryDate <= dateFilter.$lte
              )

            default:
              return (
                (item.licenseExpiryDate &&
                  item.licenseExpiryDate >= dateFilter.$gte &&
                  item.licenseExpiryDate <= dateFilter.$lte) ||
                (item.tvuexpiryDate &&
                  item.tvuexpiryDate >= dateFilter.$gte &&
                  item.tvuexpiryDate <= dateFilter.$lte) ||
                (item.amcendDate &&
                  item.amcendDate >= dateFilter.$gte &&
                  item.amcendDate <= dateFilter.$lte)
              )
          }
        })
        .map((item) => {
          const obj = item.toObject ? item.toObject() : { ...item }

          if (filterType === "amc") {
            delete obj.licenseExpiryDate
            delete obj.tvuexpiryDate
          } else if (filterType === "tuv") {
            delete obj.licenseExpiryDate
            delete obj.amcendDate
          } else if (filterType === "license") {
            delete obj.tvuexpiryDate
            delete obj.amcendDate
          }

          return obj
        })

      return {
        ...customer.toObject(),
        selected
      }
    })

    if (expiredCustomers.length > 0) {
      return res.status(200).json({
        message: "Customers found with expiry",
        data: expiredCustomers
      })
    }

    return res.status(404).json({
      message: "No customers with expired Dates",
      data: []
    })
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({
      message: "Internal server error"
    })
  }
}

// export const GetAllExpiryRegister = async (req, res) => {
//   const { nextmonthReport, startDate, endDate } = req.query

//   try {
//     let startOfNextMonth
//     let endOfNextMonth
//     const today = new Date()
//     today.setHours(0, 0, 0, 0)
//     if (nextmonthReport) {
//       // Calculate the start and end of the next month
//       startOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)
//       endOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0)
//       endOfNextMonth.setHours(23, 59, 59, 999) // End of the day
//     }

//     const expiredCustomers = await Customer.find({
//       selected: {
//         $elemMatch: {
//           $or: [
//             {
//               licenseExpiryDate: nextmonthReport
//                 ? { $gte: startOfNextMonth, $lte: endOfNextMonth }
//                 : { $gte: startDate, $lte: endDate }
//             }, // License expiry in the past
//             {
//               tvuexpiryDate: nextmonthReport
//                 ? { $gte: startOfNextMonth, $lte: endOfNextMonth }
//                 : { $gte: startDate, $lte: endDate }
//             }, // TVU expiry in the past
//             {
//               amcendDate: nextmonthReport
//                 ? { $gte: startOfNextMonth, $lte: endOfNextMonth }
//                 : { $gte: startDate, $lte: endDate }
//             } // AMC end in the past
//           ]
//         }
//       }
//     })
//     if (expiredCustomers.length > 0) {
//       return res.status(200).json({
//         message: "Customers found with expiry",
//         data: expiredCustomers
//       })
//     } else {
//       return res
//         .status(404)
//         .json({ message: "No customers with expired Dates", data: [] })
//     }
//   } catch (error) {
//     console.log("error:", error.message)
//     return res.status(500).json({ message: "Internal server error" })
//   }
// }
export const getallExpiredCustomerCalls = async (req, res) => {
  try {
    const { startDate, endDate, isAdmin, userBranchId } = req.body

    const userBranchIds = userBranchId.map((id) => new mongoose.Types.ObjectId(id))

    const expiredCustomers = await Customer.find({
      selected: {
        $elemMatch: {
          ...(isAdmin ? {} : { branch_id: { $in: userBranchIds } }), // only include branch filter if not admin
          $or: [
            {
              licenseExpiryDate: { $gte: startDate, $lte: endDate }
            }, // License expiry in the past
            {
              tvuexpiryDate: { $gte: startDate, $lte: endDate }
            }, // TVU expiry in the past
            {
              amcendDate: { $gte: startDate, $lte: endDate }
            } // AMC end in the past
          ]
        }
      }
    })
    // console.log("expiredcustomere", expiredCustomers.length)
    const expiredCustomerIds = expiredCustomers.map((customer) => customer._id)
    const calls = await CallRegistration.find({
      customerid: { $in: expiredCustomerIds } // Assuming 'customerId' field in CallRegistration matches customer IDs
    })
      .populate([
        {
          path: "callregistration.product",
          select: "productName"
        },
        {
          path: "customerid",
          select: "customerName"
        }
      ])
      .lean()

    const attendedByIds = new Set()
    const completedByIds = new Set()

    calls.forEach((call) =>
      call.callregistration.forEach((entry) => {
        // Handle `attendedBy`
        const attendedBy = entry.formdata.attendedBy
        if (Array.isArray(attendedBy)) {
          // If it's an array, iterate over it
          attendedBy.forEach((attendee) => {
            if (attendee.callerId) {
              attendedByIds.add(attendee.callerId.toString())
            } else if (attendee.name) {
              attendedByIds.add(attendee.name)
            }
          })
        } else if (typeof attendedBy === "string") {
          // If it's a string, add it directly
          attendedByIds.add(attendedBy)
        }

        // Handle `completedBy`
        const completedBy = entry.formdata.completedBy
        if (Array.isArray(completedBy) && completedBy.length > 0) {
          const completedByEntry = completedBy[0]
          if (completedByEntry.callerId) {
            completedByIds.add(completedByEntry.callerId.toString())
          } else if (completedByEntry.name) {
            completedByIds.add(completedByEntry.name)
            // Optionally, handle cases where only the name exists
            console.warn(
              `CompletedBy has name but no callerId: ${completedByEntry.name}`
            )
          }
        } else if (typeof completedBy === "string") {
          // If it's a string, add it directly
          completedByIds.add(completedBy)
        }
      })
    )

    // Separate IDs and names from the Sets
    const attendedByIdsArray = Array.from(attendedByIds)
    const attendedByObjectIds = attendedByIdsArray.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    )

    const attendedByNames = attendedByIdsArray
      .filter((id) => !mongoose.Types.ObjectId.isValid(id)) // Filter invalid ObjectIds (names)
      .map((name) => ({ name })) // Transform them into objects with a "name" property

    const completedByIdsArray = Array.from(completedByIds)
    const completedByObjectIds = completedByIdsArray.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    )

    const completedByNames = completedByIdsArray
      .filter((id) => !mongoose.Types.ObjectId.isValid(id)) // Filter invalid ObjectIds (names)
      .map((name) => ({ name })) // Transform them into objects with a "name" property

    // Query for ObjectIds (staff/admin users)
    const [
      attendedByStaff,
      attendedByAdmin,
      completedByStaff,
      completedByAdmin
    ] = await Promise.all([
      // Search attendedBy IDs in Staff
      mongoose
        .model("Staff")
        .find({ _id: { $in: attendedByObjectIds } })
        .select("name _id ")
        .lean(),

      // Search attendedBy IDs in Admin
      mongoose
        .model("Admin")
        .find({ _id: { $in: attendedByObjectIds } })
        .select("name _id ")
        .lean(),

      // Search completedBy IDs in Staff
      mongoose
        .model("Staff")
        .find({ _id: { $in: completedByObjectIds } })
        .select("name _id ")
        .lean(),

      // Search completedBy IDs in Admin
      mongoose
        .model("Admin")
        .find({ _id: { $in: completedByObjectIds } })
        .select("name _id ")
        .lean()
    ])

    // Combine results for attendedBy and completedBy
    const attendedByUsers = [...attendedByStaff, ...attendedByAdmin]
    const completedByUsers = [...completedByStaff, ...completedByAdmin]

    // Optionally handle name-based entries as well
    const attendedByCombined = [...attendedByUsers, ...attendedByNames]

    const completedByCombined = [...completedByUsers, ...completedByNames]
    const userMap = new Map(
      [...attendedByCombined, ...completedByCombined].map((user) => [
        user._id ? user._id.toString() : user.name,
        user.name
      ])
    )

    calls.forEach((call) =>
      call.callregistration.forEach((entry) => {
        // Handle attendedBy field
        if (Array.isArray(entry?.formdata?.attendedBy)) {
          entry.formdata.attendedBy = entry.formdata.attendedBy
            .flat() // Flatten the array
            .map((attendee) => {
              const name = userMap.get(attendee?.callerId?.toString())
              // If name is found, attach it to the callerId
              return name ? { ...attendee, callerId: { name } } : attendee // Keep original if no name found
            })
        } else if (typeof entry?.formdata?.attendedBy === "string") {
          // If attendedBy is a string (not an array), map it to the name if it exists in userMap
          const name = userMap.get(entry?.formdata?.attendedBy)
          entry.formdata.attendedBy = name
            ? { callerId: { name } } // Map the string to an object with a name
            : { callerId: entry?.formdata?.attendedBy } // Keep the original if no name found
        }

        // Handle completedBy field
        if (
          Array.isArray(entry?.formdata?.completedBy) &&
          entry?.formdata?.completedBy.length > 0
        ) {
          // If completedBy is an array, map over each entry (assuming one entry)
          const completedUser = userMap.get(
            entry?.formdata?.completedBy[0]?.callerId?.toString()
          )
          entry.formdata.completedBy = completedUser
            ? [{ ...entry?.formdata?.completedBy[0], name: completedUser }] // Add the name to the first item
            : entry.formdata.completedBy // Keep as is if no name found
        } else if (typeof entry?.formdata?.completedBy === "string") {
          // If completedBy is a string, map it to the name if it exists in userMap
          const name = userMap.get(entry?.formdata?.completedBy)
          entry.formdata.completedBy = name
            ? { callerId: { name } } // Map the string to an object with a name
            : { callerId: entry?.formdata?.completedBy } // Keep the original if no name found
        }
      })
    )
    if (calls.length > 0) {
      return res
        .status(200)
        .json({ message: "Expired customer calls found", calls })
    } else {
      return res.status(404).json({ message: "No expired calls", calls: [] })
    }
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const LeavemasterRegister = async (req, res) => {
  try {
    // Extract data from request body
    const {
      checkIn,
      checkOut,
      checkInEndAt,
      checkOutStartAt,
      lateArrival,
      privilegeleave,
      casualleave,
      sickleave,
      earlyOut,
      holyDate,
      customTextInput,

      deductSalaryMinute
    } = req.body

    const { editstate } = req.query
    const existingRecord = await Leavemaster.findOne({})
    if (existingRecord) {
      const isSame =
        existingRecord.checkIn === checkIn &&
        existingRecord.checkOut === checkOut &&
        existingRecord.checkInEndAt === checkInEndAt &&
        existingRecord.checkOutStartAt === checkOutStartAt &&
        existingRecord.lateArrival === lateArrival &&
        existingRecord.privilegeleave === privilegeleave &&
        existingRecord.casualleave === casualleave &&
        existingRecord.sickleave === sickleave &&
        existingRecord.deductSalaryMinute === deductSalaryMinute
      // Step 3: If everything is the same, don't create a new instance, just return
      if (isSame) {
        if (editstate === "true") {
          const b = await Holymaster.updateOne(
            { customTextInput }, // Find the existing record using its ID
            {
              $set: {
                holyDate,
                customTextInput
              }
            }
          )

          if (b.modifiedCount > 0) {
            return res
              .status(200)
              .json({ message: "Holiday update succesfully" })
          }
        } else {
          if (holyDate && customTextInput) {
            const year = new Date(holyDate).getFullYear()

            const a = await Holymaster.find({
              $and: [
                {
                  $expr: {
                    $eq: [{ $year: "$holyDate" }, year]
                  }
                },
                {
                  customTextInput
                }
              ]
            })

            // const a = await Holymaster.find({ holyDate })
            if (a && a.length > 0) {
              return res.status(401).json({
                message: `${customTextInput} is already registered with this Year`
              })
            } else {
              const newHoly = await Holymaster({
                holyDate,
                customTextInput,
                newField: true
              })
              await newHoly.save()
              if (newHoly) {
                return res.status(200).json({
                  message: ` ${customTextInput} is succesfully registered`
                })
              }
            }
          }
        }
      } else {
        // Step 4: If the data is different, update the existing record
        const q = await Leavemaster.updateOne(
          { _id: existingRecord._id }, // Find the existing record using its ID
          {
            $set: {
              checkIn,
              checkOut,
              checkInEndAt,
              checkOutStartAt,
              lateArrival,
              privilegeleave,
              casualleave,
              sickleave,
              earlyOut,
              deductSalaryMinute
            }
          },
          { new: true }
        )
        if (q.modifiedCount > 0) {
          return res
            .status(200)
            .json({ message: "Leave master updated succesfully", data: q })
        }
      }
    } else {
      // Create a new document
      const newTime = new Leavemaster({
        checkIn,
        checkOut,
        checkInEndAt,
        checkOutStartAt,
        lateArrival: Number(lateArrival),
        earlyOut: Number(earlyOut),

        deductSalaryMinute: Number(deductSalaryMinute)
      })

      // Save to database
      await newTime.save()
      if (holyDate && customTextInput) {
        const newHoly = await Holymaster({
          holyDate,
          customTextInput,
          newField: true
        })
        await newHoly.save()
        if (newHoly && newTime) {
          res.status(200).json({ message: "saved successfully!" })
        }
      }
      return res.status(200).json({ message: "successfully registered" })
    }
  } catch (error) {
    console.error("Error saving time data:", error)
    res.status(500).json({ error: "Failed to save time data." })
  }
}
export const GetallHoly = async (req, res) => {
  try {
    const a = await Holymaster.find({})
    if (a) {
      return res.status(200).json({ message: "holy found", data: a })
    }
  } catch (error) {
    console.log("error", error.message)
  }
}
export const GetallcurrentMonthHoly = async (req, res) => {
  try {
    const { currentmonth } = req.query
    const [year, month] = currentmonth.split("-").map(Number)
    const holidays = await Holymaster.find({
      holyDate: {
        $gte: new Date(year, month - 1, 1), // Start of the month
        $lt: new Date(year, month, 1) // Start of next month (excludes next month)
      }
    })

    return res.status(200).json({ message: "holyfound", data: holidays })
  } catch (error) {
    console.log("error:", error.message)
  }
}
export const Getleavemaster = async (req, res) => {
  try {
    const leaveMaster = await Leavemaster.find({})
    if (leaveMaster) {
      return res.status(200).json({ message: "Leave master found", data: leaveMaster })
    }
  } catch (error) {
    console.log("error", error.message)
  }
}
export const GeteditedCustomer = async (req, res) => {
  try {
    const { customerid } = req.query
    if (!customerid) {
      return res.status(400).json({ message: "customer id is required" })
    }
    const id = new mongoose.Types.ObjectId(customerid)
    const customer = await Customer.findById(id).populate("selected.product_id selected.company_id selected.branch_id")

    if (customer) {
      return res.status(200).json({ message: "customer found", data: customer })
    }
  } catch (error) {

    console.log("error", error.message)
  }
}
// export const Downloadcustomerlist = async (req, res) => {
//   try {
//     const { customerType, branchselected, searchTerm } = req.query
//     console.log(branchselected)
//     if (!branchselected) {
//       return res.status(400).json({ message: "branchid is missing" })
//     }
//     const branchId = new mongoose.Types.ObjectId(branchselected)
//     const safe = escapeRegExp(String(searchTerm).trim())
//     const regex = new RegExp(safe, "i")
//     let matchConditions = {}
//     let pipeline
//     console.log("tttt")
//     console.log(customerType)
//     if (customerType === "ProductMissing") {
//       console.log('iiii')
//       // Combine both: existing $or + search filters
//       matchConditions = {
//         $and: [
//           {
//             $or: [
//               { selected: { $exists: false } },
//               { selected: { $size: 0 } }
//             ]
//           },
//           {
//             $or: [
//               { customerName: { $regex: regex } },
//               { mobile: { $regex: regex } }
//             ]
//           }
//         ]
//       }


//     } else {
//       matchConditions = {
//         "selected.branch_id": branchId,
//         selected: { $exists: true, $ne: [] },
//         ...(customerType !== "Allcustomers" &&
//           customerType !== "ProductinfoMissing" && {
//           isActive: customerType
//         }),// only include this if not 'allcustomers'
//         ...(customerType === "ProductinfoMissing" && {
//           selected: {
//             $elemMatch: {
//               $or: [
//                 { product_id: null },
//                 { product_id: { $exists: false } }]
//             }
//           }
//         })
//       };
//     }
//     if (customerType === "ProductMissing") {
//       console.log("hhh")
//       pipeline = [
//         { $match: matchConditions },
//         {
//           $group: {                         // group back by customer
//             _id: "$_id",
//             customerName: { $first: "$customerName" },
//             address: { $first: "$address1" },
//             pincode: { $first: "$pincode" },
//             email: { $first: "$email" },
//             mobile: { $first: "$mobile" },

//           }
//         }, { $sort: { customerName: 1 } },
//       ]

//     } else {
//       pipeline = [
//         { $match: matchConditions },        // filter documents first
//         { $unwind: "$selected" },           // expand selected array (for lookup)
//         {
//           $lookup: {                        // populate product
//             from: "products",
//             localField: "selected.product_id",
//             foreignField: "_id",
//             as: "productDetails"
//           }
//         },
//         {
//           $unwind: {
//             path: "$productDetails",
//             preserveNullAndEmptyArrays: true
//           }
//         },
//         {
//           $addFields: {
//             "selected.productName": "$productDetails.productName"
//           }
//         },
//         {
//           $group: {                         // group back by customer
//             _id: "$_id",
//             customerName: { $first: "$customerName" },
//             address: { $first: "$address1" },

//             pincode: { $first: "$pincode" },

//             email: { $first: "$email" },
//             mobile: { $first: "$mobile" },
//             selected: { $push: "$selected" },
//             status: { $first: "$isActive" }
//           }
//         },
//         { $sort: { customerName: 1 } },

//       ];
//     }
//     const customers = await Customer.aggregate(pipeline)
//     const flattened = customers.flatMap((customer) => {
//       // if selected array exists and not empty
//       if (Array.isArray(customer.selected) && customer.selected.length > 0) {
//         return customer.selected.map((item) => ({
//           customerName: customer.customerName,
//           address: customer.address,
//           pincode: customer.pincode,
//           email: customer.email,
//           mobile: customer.mobile,
//           licenseNo: item.licensenumber,
//           status: customer.status,
//           branchName: item.branchName || "-",   // fallback notation if missing
//           productName: item.productName || "-", // fallback notation if missing
//         }));
//       } else {
//         // if selected is empty or missing, still include the customer with "-"
//         return {
//           customerName: customer.customerName,
//           address: customer.address,
//           pincode: customer.pincode,
//           email: customer.email,
//           mobile: customer.mobile,
//           licenseNo: "-",
//           status: "-",
//           branchName: "-",
//           productName: "-",
//         };
//       }
//     });
//     if (flattened && flattened.length > 0) {
//       return res.status(201).json({ message: "Customer found", data: flattened })
//     }

//   } catch (error) {
//     console.log("error:", error)
//     return res.status(500).json({ message: "Internal server error" })
//   }
// }
//api code
// export const Getallcallregistrationlist = async (req, res) => {
//   try {
// const todayStart =
//   new Date().toISOString().split("T")[0] + "T00:00:00.000Z"
// const todayEnd = new Date().toISOString().split("T")[0] + "T23:59:59.999Z"

// const pendingcalls = await CallRegistration.aggregate([
//   {
//     $set: {
//       callregistration: {
//         $filter: {
//           input: "$callregistration",
//           as: "cr",
//           cond: { $eq: ["$$cr.formdata.status", "pending"] }
//         }
//       }
//     }
//   },
//   {
//     $match: { "callregistration.0": { $exists: true } } // Ensures only documents with at least one pending call remain
//   },
//   {
//     $lookup: {
//       from: "products", // Replace with actual product collection name
//       localField: "callregistration.product", // Field in CallRegistration referencing products
//       foreignField: "_id", // Matching field in the Product collection
//       as: "productDetails"
//     }
//   }
// ],

// )
// // ADD THIS LINE:
// // console.log(`📊 DATA SIZE for pending: ${JSON.stringify(pendingcalls).length / 1024 / 1024} MB`);

// const todayscalls = await CallRegistration.aggregate([
//   // Filter the callregistration array to keep only entries with today's attendance
//   {
//     $addFields: {
//       callregistration: {
//         $filter: {
//           input: "$callregistration",
//           as: "call",
//           cond: {
//             $and: [{ $eq: ["$$call.formdata.status", "solved"] },
//             {
//               $anyElementTrue: {
//                 $map: {
//                   input: {
//                     $cond: {
//                       if: {
//                         $isArray: {
//                           $ifNull: ["$$call.formdata.attendedBy", []]
//                         }
//                       },
//                       then: { $ifNull: ["$$call.formdata.attendedBy", []] },
//                       else: []
//                     }
//                   },
//                   as: "attendance",
//                   in: {
//                     $and: [
//                       { $ifNull: ["$$attendance.calldate", false] },
//                       {
//                         $gte: [
//                           {
//                             $ifNull: ["$$attendance.calldate", new Date(0)]
//                           },
//                           todayStart
//                         ]
//                       },
//                       {
//                         $lt: [
//                           {
//                             $ifNull: ["$$attendance.calldate", new Date(0)]
//                           },
//                           todayEnd
//                         ]
//                       }
//                     ]
//                   }
//                 }
//               }
//             }

//             ]

//           }
//         }
//       }
//     }
//   },


//   // Remove documents where the callregistration array is now empty
//   {
//     $match: {
//       "callregistration.0": { $exists: true }
//     }
//   },

//   // For each call in the filtered array, filter the attendedBy array to keep only today's records
//   {
//     $addFields: {
//       callregistration: {
//         $map: {
//           input: "$callregistration",
//           as: "call",
//           in: {
//             $mergeObjects: [
//               "$$call",
//               {
//                 formdata: {
//                   $mergeObjects: [
//                     "$$call.formdata",
//                     {
//                       attendedBy: {
//                         $cond: {
//                           if: {
//                             $isArray: {
//                               $ifNull: ["$$call.formdata.attendedBy", []]
//                             }
//                           },
//                           then: {
//                             $filter: {
//                               input: "$$call.formdata.attendedBy",
//                               as: "attendance",
//                               cond: {
//                                 $and: [
//                                   {
//                                     $ifNull: [
//                                       "$$attendance.calldate",
//                                       false
//                                     ]
//                                   },
//                                   {
//                                     $gte: [
//                                       {
//                                         $ifNull: [
//                                           "$$attendance.calldate",
//                                           new Date(0)
//                                         ]
//                                       },
//                                       todayStart
//                                     ]
//                                   },
//                                   {
//                                     $lt: [
//                                       {
//                                         $ifNull: [
//                                           "$$attendance.calldate",
//                                           new Date(0)
//                                         ]
//                                       },
//                                       todayEnd
//                                     ]
//                                   }
//                                 ]
//                               }
//                             }
//                           },
//                           else: "$$call.formdata.attendedBy" // Keep original if not an array
//                         }
//                       }
//                     }
//                   ]
//                 }
//               }
//             ]
//           }
//         }
//       }
//     }
//   },

//   // Lookup product details
//   {
//     $lookup: {
//       from: "products",
//       localField: "callregistration.product",
//       foreignField: "_id",
//       as: "productDetails"
//     }
//   }
// ])
// // console.log(`📊 DATA SIZE for solved: ${JSON.stringify(todayscalls).length / 1024 / 1024} MB`);
// // Step 1: Use a Map to store unique merged entries by _id
// const mergedMap = new Map();

// pendingcalls.forEach((call) => {
//   mergedMap.set(call._id, { ...call })
// })
// todayscalls.forEach((call) => {
//   if (mergedMap.has(call._id)) {
//     //Merge callregistration arrays
//     const existing = mergedMap.get(call._id)
//     existing.callregistration = [...existing.callregistration,
//     ...call.callregistration]
//     mergedMap.set(call._id, existing)
//   } else {
//     mergedMap.set(call._id, { ...call })
//   }
// })
// // Final merged array
// const mergedCalls = Array.from(mergedMap.values());
// // Extract unique IDs for attendedBy and completedBy
// const attendedByIds = new Set()
// const completedByIds = new Set()
// const beforeSize = JSON.stringify(mergedCalls).length / 1024 / 1024;
// console.log(`📊 BEFORE loop: ${beforeSize.toFixed(2)} MB`);
// mergedCalls.forEach((call) =>
//   call.callregistration.forEach((entry) => {
//     // Handle `attendedBy`
//     const attendedBy = entry.formdata.attendedBy
//     if (Array.isArray(attendedBy)) {
//       // If it's an array, iterate over it
//       attendedBy.forEach((attendee) => {
//         if (attendee.callerId) {
//           attendedByIds.add(attendee.callerId.toString())
//         } else if (attendee.name) {
//           attendedByIds.add(attendee.name)
//         }
//       })
//     } else if (typeof attendedBy === "string") {
//       // If it's a string, add it directly
//       attendedByIds.add(attendedBy)
//     }

//     // Handle `completedBy`
//     const completedBy = entry.formdata.completedBy
//     if (Array.isArray(completedBy) && completedBy.length > 0) {
//       const completedByEntry = completedBy[0]
//       if (completedByEntry.callerId) {
//         completedByIds.add(completedByEntry.callerId.toString())
//       } else if (completedByEntry.name) {
//         completedByIds.add(completedByEntry.name)
//         // Optionally, handle cases where only the name exists
//         console.warn(
//           `CompletedBy has name but no callerId: ${completedByEntry.name}`
//         )
//       }
//     } else if (typeof completedBy === "string") {
//       // If it's a string, add it directly
//       completedByIds.add(completedBy)
//     }
//   })
// )
// // 📊 MEASURE AFTER the loop
// // console.log(`📊 AFTER loop: ${JSON.stringify(mergedCalls).length / 1024 / 1024} MB`);
// // console.log(`📊 SIZE INCREASE: ${((JSON.stringify(mergedCalls).length / 1024 / 1024) - beforeSize).toFixed(2)} MB`);

// // Separate IDs and names from the Sets
// const attendedByIdsArray = Array.from(attendedByIds)
// const attendedByObjectIds = attendedByIdsArray.filter((id) =>
//   mongoose.Types.ObjectId.isValid(id)
// )

// const attendedByNames = attendedByIdsArray
//   .filter((id) => !mongoose.Types.ObjectId.isValid(id)) // Filter invalid ObjectIds (names)
//   .map((name) => ({ name })) // Transform them into objects with a "name" property

// const completedByIdsArray = Array.from(completedByIds)
// const completedByObjectIds = completedByIdsArray.filter((id) =>
//   mongoose.Types.ObjectId.isValid(id)
// )

// const completedByNames = completedByIdsArray
//   .filter((id) => !mongoose.Types.ObjectId.isValid(id)) // Filter invalid ObjectIds (names)
//   .map((name) => ({ name })) // Transform them into objects with a "name" property

// // Query for ObjectIds (staff/admin users)
// const [
//   attendedByStaff,
//   attendedByAdmin,
//   completedByStaff,
//   completedByAdmin
// ] = await Promise.all([
//   // Search attendedBy IDs in Staff
//   mongoose
//     .model("Staff")
//     .find({ _id: { $in: attendedByObjectIds } })
//     .select("name _id ")
//     .lean(),

//   // Search attendedBy IDs in Admin
//   mongoose
//     .model("Admin")
//     .find({ _id: { $in: attendedByObjectIds } })
//     .select("name _id ")
//     .lean(),

//   // Search completedBy IDs in Staff
//   mongoose
//     .model("Staff")
//     .find({ _id: { $in: completedByObjectIds } })
//     .select("name _id ")
//     .lean(),

//   // Search completedBy IDs in Admin
//   mongoose
//     .model("Admin")
//     .find({ _id: { $in: completedByObjectIds } })
//     .select("name _id ")
//     .lean()
// ])

// // Combine results for attendedBy and completedBy
// const attendedByUsers = [...attendedByStaff, ...attendedByAdmin]
// const completedByUsers = [...completedByStaff, ...completedByAdmin]

// // Optionally handle name-based entries as well
// const attendedByCombined = [...attendedByUsers, ...attendedByNames]

// const completedByCombined = [...completedByUsers, ...completedByNames]
// const userMap = new Map(
//   [...attendedByCombined, ...completedByCombined].map((user) => [
//     user._id ? user._id.toString() : user.name,
//     user.name
//   ])
// )
// mergedCalls.forEach((call) =>
//   call.callregistration.forEach((entry) => {
//     // Handle attendedBy field
//     if (Array.isArray(entry?.formdata?.attendedBy)) {
//       entry.formdata.attendedBy = entry.formdata.attendedBy
//         .flat() // Flatten the array
//         .map((attendee) => {
//           const name = userMap.get(attendee?.callerId?.toString())
//           // If name is found, attach it to the callerId
//           return name ? { ...attendee, callerId: { name } } : attendee // Keep original if no name found
//         })
//     } else if (typeof entry?.formdata?.attendedBy === "string") {
//       // If attendedBy is a string (not an array), map it to the name if it exists in userMap
//       const name = userMap.get(entry?.formdata?.attendedBy)
//       entry.formdata.attendedBy = name
//         ? { callerId: { name } } // Map the string to an object with a name
//         : { callerId: entry?.formdata?.attendedBy } // Keep the original if no name found
//     }

//     // Handle completedBy field
//     if (
//       Array.isArray(entry?.formdata?.completedBy) &&
//       entry?.formdata?.completedBy.length > 0
//     ) {
//       // If completedBy is an array, map over each entry (assuming one entry)
//       const completedUser = userMap.get(
//         entry?.formdata?.completedBy[0]?.callerId?.toString()
//       )
//       entry.formdata.completedBy = completedUser
//         ? [{ ...entry?.formdata?.completedBy[0], name: completedUser }] // Add the name to the first item
//         : entry.formdata.completedBy // Keep as is if no name found
//     } else if (typeof entry?.formdata?.completedBy === "string") {
//       // If completedBy is a string, map it to the name if it exists in userMap
//       const name = userMap.get(entry?.formdata?.completedBy)
//       entry.formdata.completedBy = name
//         ? { callerId: { name } } // Map the string to an object with a name
//         : { callerId: entry?.formdata?.completedBy } // Keep the original if no name found
//     }
//   })
// )
// console.log(`📊 AFTER loop: ${JSON.stringify(mergedCalls).length / 1024 / 1024} MB`);
// console.log(`📊 SIZE INCREASE: ${((JSON.stringify(mergedCalls).length / 1024 / 1024) - beforeSize).toFixed(2)} MB`);

// return res.status(200).json({ message: "calllist found", data: mergedCalls })
//   } catch (error) {
//     console.error("Error fetching call data:", error)
//     return res.status(500).json({ message: "Internal server error" })
//   }

// }
// //new api code
// export const Getallcallregistrationlist = async (req, res) => {
//   try {
//     const today = new Date().toISOString().split("T")[0];
//     const todayStart = new Date(`${today}T00:00:00.000Z`);
//     const todayEnd = new Date(`${today}T23:59:59.999Z`);
//     const result = await CallRegistration.aggregate([
//       {
//         $facet: {
//           pending: [
//             {
//               $match: {
//                 "callregistration.formdata.status": "pending"
//               }
//             },
//             {
//               $project: {
//                 callregistration: {
//                   $filter: {
//                     input: "$callregistration",
//                     as: "cr",
//                     cond: { $eq: ["$$cr.formdata.status", "pending"] }
//                   }
//                 }
//               }
//             }
//           ],

//           todaySolved: [
//             {
//               $match: {
//                 "callregistration.formdata.status": "solved",
//                 "callregistration.formdata.attendedBy.calldate": {
//                   $gte: todayStart,
//                   $lt: todayEnd
//                 }
//               }
//             },
//             {
//               $project: {
//                 callregistration: {
//                   $filter: {
//                     input: "$callregistration",
//                     as: "cr",
//                     cond: {
//                       $and: [
//                         { $eq: ["$$cr.formdata.status", "solved"] },
//                         {
//                           $anyElementTrue: {
//                             $map: {
//                               input: { $ifNull: ["$$cr.formdata.attendedBy", []] },
//                               as: "att",
//                               in: {
//                                 $and: [
//                                   { $gte: ["$$att.calldate", todayStart] },
//                                   { $lt: ["$$att.calldate", todayEnd] }
//                                 ]
//                               }
//                             }
//                           }
//                         }
//                       ]
//                     }
//                   }
//                 }
//               }
//             }
//           ]
//         }
//       },

//       /* 🔥 MERGE BOTH ARRAYS */
//       {
//         $project: {
//           data: { $concatArrays: ["$pending", "$todaySolved"] }
//         }
//       },
//       { $unwind: "$data" },
//       { $replaceRoot: { newRoot: "$data" } },

//       /* ✅ RESTORE ORIGINAL SHAPE */
//       {
//         $group: {
//           _id: "$_id",
//           callregistration: { $push: "$callregistration" },
//           root: { $first: "$$ROOT" }
//         }
//       },
//       {
//         $project: {
//           _id: 1,
//           callregistration: {
//             $reduce: {
//               input: "$callregistration",
//               initialValue: [],
//               in: { $concatArrays: ["$$value", "$$this"] }
//             }
//           },
//           root: 1
//         }
//       },
//       {
//         $replaceRoot: {
//           newRoot: {
//             $mergeObjects: ["$root", { callregistration: "$callregistration" }]
//           }
//         }
//       }
//     ]);

//     // const result = await CallRegistration.aggregate([
//     //   {
//     //     $facet: {
//     //       pending: [
//     //         {
//     //           $match: {
//     //             "callregistration.formdata.status": "pending"
//     //           }
//     //         },
//     //         {
//     //           $project: {
//     //             callregistration: {
//     //               $filter: {
//     //                 input: "$callregistration",
//     //                 as: "cr",
//     //                 cond: { $eq: ["$$cr.formdata.status", "pending"] }
//     //               }
//     //             }
//     //           }
//     //         }
//     //       ],

//     //       todaySolved: [
//     //         {
//     //           $match: {
//     //             "callregistration.formdata.status": "solved",
//     //             "callregistration.formdata.attendedBy.calldate": {
//     //               $gte: todayStart,
//     //               $lt: todayEnd
//     //             }
//     //           }
//     //         },
//     //         {
//     //           $project: {
//     //             callregistration: {
//     //               $filter: {
//     //                 input: "$callregistration",
//     //                 as: "cr",
//     //                 cond: {
//     //                   $and: [
//     //                     { $eq: ["$$cr.formdata.status", "solved"] },
//     //                     {
//     //                       $anyElementTrue: {
//     //                         $map: {
//     //                           input: { $ifNull: ["$$cr.formdata.attendedBy", []] },
//     //                           as: "att",
//     //                           in: {
//     //                             $and: [
//     //                               { $gte: ["$$att.calldate", todayStart] },
//     //                               { $lt: ["$$att.calldate", todayEnd] }
//     //                             ]
//     //                           }
//     //                         }
//     //                       }
//     //                     }
//     //                   ]
//     //                 }
//     //               }
//     //             }
//     //           }
//     //         }
//     //       ]
//     //     }
//     //   },
//     //   {
//     //     $project: {
//     //       merged: { $concatArrays: ["$pending", "$todaySolved"] }
//     //     }
//     //   },
//     //   { $unwind: "$merged" },
//     //   { $replaceRoot: { newRoot: "$merged" } }
//     // ]);

//     /* ------------------------------------
//        EXTRACT UNIQUE USER IDS
//     ------------------------------------ */

//     const userIds = new Set();

//     result.forEach(doc =>
//       doc.callregistration.forEach(cr => {
//         const attended = cr.formdata.attendedBy || [];
//         const completed = cr.formdata.completedBy || [];

//         attended.forEach(a => a?.callerId && userIds.add(a.callerId.toString()));
//         completed.forEach(c => c?.callerId && userIds.add(c.callerId.toString()));
//       })
//     );

//     const ids = [...userIds].filter(id => mongoose.Types.ObjectId.isValid(id));

//     /* ------------------------------------
//        FETCH USERS ONCE
//     ------------------------------------ */

//     const [staff, admin] = await Promise.all([
//       mongoose.model("Staff").find({ _id: { $in: ids } }).select("name").lean(),
//       mongoose.model("Admin").find({ _id: { $in: ids } }).select("name").lean()
//     ]);

//     const userMap = new Map(
//       [...staff, ...admin].map(u => [u._id.toString(), u.name])
//     );

//     /* ------------------------------------
//        ATTACH NAMES
//     ------------------------------------ */

//     result.forEach(doc =>
//       doc.callregistration.forEach(cr => {
//         if (Array.isArray(cr.formdata.attendedBy)) {
//           cr.formdata.attendedBy = cr.formdata.attendedBy.map(a => ({
//             ...a,
//             callerId: { name: userMap.get(a.callerId?.toString()) || "Unknown" }
//           }));
//         }

//         if (Array.isArray(cr.formdata.completedBy)) {
//           cr.formdata.completedBy = cr.formdata.completedBy.map(c => ({
//             ...c,
//             name: userMap.get(c.callerId?.toString()) || "Unknown"
//           }));
//         }
//       })
//     );

//     return res.status(200).json({
//       message: "calllist found",
//       data: result
//     });
//   } catch (error) {
//     console.error("Error fetching call data:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
export const existsameCallnote = async (req, res) => {
  try {
    const { customerId, callNoteId } = req.query
    const customerObjectId = new mongoose.Types.ObjectId(customerId)
    // console.log("customerobjectid", customerObjectId)
    const callnoteObjectId = new mongoose.Types.ObjectId(callNoteId)
    // console.log('callnoteid', callnoteObjectId)

    // Pure existence check - FASTEST method
    const pendingCount = await CallRegistration.countDocuments({
      customerid: customerObjectId,
      "callregistration": {
        $elemMatch: {
          "formdata.status": "pending",
          "formdata.callnote": callnoteObjectId
        }
      }
    });


    const exists = pendingCount > 0;
    console.log('Exists:', exists); // This WILL return true ✅


    console.log("existsss", exists)

    return res.status(200).json({
      exists
    });
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }

}

export const Getallcallregistrationlist = async (req, res) => {
  try {
    // Set today start/end in ISO format
    const todayStart = new Date().toISOString().split("T")[0] + "T00:00:00.000Z";
    const todayEnd = new Date().toISOString().split("T")[0] + "T23:59:59.999Z";

    // 1️⃣ Aggregate pending + today's solved calls
    let aggregated = await CallRegistration.aggregate([
      {
        $facet: {
          pending: [
            {
              $set: {
                callregistration: {
                  $filter: {
                    input: "$callregistration",
                    as: "cr",
                    cond: { $eq: ["$$cr.formdata.status", "pending"] }
                  }
                }
              }
            },
            { $match: { "callregistration.0": { $exists: true } } }
          ],
          todaySolved: [
            {
              $set: {
                callregistration: {
                  $filter: {
                    input: "$callregistration",
                    as: "cr",
                    cond: {
                      $and: [
                        { $eq: ["$$cr.formdata.status", "solved"] },
                        {
                          $anyElementTrue: {
                            $map: {
                              input: {
                                $cond: {
                                  if: { $isArray: "$$cr.formdata.attendedBy" },
                                  then: "$$cr.formdata.attendedBy",
                                  else: {
                                    $cond: {
                                      if: { $eq: ["$$cr.formdata.attendedBy", null] },
                                      then: [],
                                      else: ["$$cr.formdata.attendedBy"]
                                    }
                                  }
                                }
                              },
                              as: "att",
                              in: {
                                $and: [
                                  { $gte: ["$$att.calldate", todayStart] },
                                  { $lt: ["$$att.calldate", todayEnd] }
                                ]
                              }
                            }
                          }
                        }
                      ]
                    }
                  }
                }
              }
            },
            { $match: { "callregistration.0": { $exists: true } } }
          ]
        }
      },
      // 2️⃣ Merge both arrays into one
      {
        $project: {
          data: { $concatArrays: ["$pending", "$todaySolved"] }
        }
      },
      { $unwind: "$data" },
      { $replaceRoot: { newRoot: "$data" } },
      {
        $group: {
          _id: "$_id",
          callregistration: { $push: "$callregistration" },
          root: { $first: "$$ROOT" }
        }
      },
      {
        $project: {
          _id: 1,
          callregistration: {
            $reduce: {
              input: "$callregistration",
              initialValue: [],
              in: { $concatArrays: ["$$value", "$$this"] }
            }
          },
          root: 1
        }
      },
      { $replaceRoot: { newRoot: { $mergeObjects: ["$root", { callregistration: "$callregistration" }] } } },

      // 3️⃣ Lookup products ONCE after merging
      {
        $lookup: {
          from: "products",
          localField: "callregistration.product",
          foreignField: "_id",
          as: "productDetails"
        }
      }
    ]);

    const mergedCalls = aggregated;

    // 4️⃣ Collect unique attendedBy & completedBy IDs/names
    const attendedByIds = new Set();
    const completedByIds = new Set();

    mergedCalls.forEach((call) => {
      call.callregistration.forEach((entry) => {
        // attendedBy
        let attendedBy = entry.formdata.attendedBy || [];
        if (!Array.isArray(attendedBy)) attendedBy = [attendedBy];
        attendedBy.forEach((attendee) => {
          if (!attendee) return;
          if (attendee.callerId) attendedByIds.add(attendee.callerId.toString());
          else if (attendee.name) attendedByIds.add(attendee.name);
        });

        // completedBy
        let completedBy = entry.formdata.completedBy || [];
        if (!Array.isArray(completedBy)) completedBy = [completedBy];
        completedBy.forEach((c) => {
          if (!c) return;
          if (c.callerId) completedByIds.add(c.callerId.toString());
          else if (c.name) completedByIds.add(c.name);
        });
      });
    });

    // Separate ObjectIds vs names
    const attendedByObjectIds = Array.from(attendedByIds).filter((id) => mongoose.Types.ObjectId.isValid(id));
    const attendedByNames = Array.from(attendedByIds).filter((id) => !mongoose.Types.ObjectId.isValid(id)).map((name) => ({ name }));
    const completedByObjectIds = Array.from(completedByIds).filter((id) => mongoose.Types.ObjectId.isValid(id));
    const completedByNames = Array.from(completedByIds).filter((id) => !mongoose.Types.ObjectId.isValid(id)).map((name) => ({ name }));

    // 5️⃣ Fetch staff/admin once per type
    const [
      attendedByStaff,
      attendedByAdmin,
      completedByStaff,
      completedByAdmin
    ] = await Promise.all([
      mongoose.model("Staff").find({ _id: { $in: attendedByObjectIds } }).select("name _id").lean(),
      mongoose.model("Admin").find({ _id: { $in: attendedByObjectIds } }).select("name _id").lean(),
      mongoose.model("Staff").find({ _id: { $in: completedByObjectIds } }).select("name _id").lean(),
      mongoose.model("Admin").find({ _id: { $in: completedByObjectIds } }).select("name _id").lean()
    ]);

    const attendedByCombined = [...attendedByStaff, ...attendedByAdmin, ...attendedByNames];
    const completedByCombined = [...completedByStaff, ...completedByAdmin, ...completedByNames];

    const userMap = new Map([...attendedByCombined, ...completedByCombined].map((user) => [
      user._id ? user._id.toString() : user.name, user.name
    ]));

    // 6️⃣ Map names back to attendedBy/completedBy
    mergedCalls.forEach((call) =>
      call.callregistration.forEach((entry) => {
        // attendedBy
        let attendedBy = entry.formdata.attendedBy || [];
        if (!Array.isArray(attendedBy)) attendedBy = [attendedBy];
        entry.formdata.attendedBy = attendedBy.map((att) => {
          if (!att) return att;
          const name = att.callerId ? userMap.get(att.callerId.toString()) : userMap.get(att.name);
          return name ? { ...att, callerId: { name } } : att;
        });

        // completedBy
        let completedBy = entry.formdata.completedBy || [];
        if (!Array.isArray(completedBy)) completedBy = [completedBy];
        entry.formdata.completedBy = completedBy.map((c) => {
          if (!c) return c;
          const name = c.callerId ? userMap.get(c.callerId.toString()) : userMap.get(c.name);
          return name ? { ...c, name } : c;
        });
      })
    );

    return res.status(200).json({ message: "calllist found", data: mergedCalls });
  } catch (error) {
    console.error("Error fetching call data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getunwnanted = async (req, res) => {
  try {
    const unwanted = await Customer.find({
      mobile: { $exists: false }
    });
    const un = await Customer.find({ mobile: "" })

    res.status(200).json({ message: "found customer", data: { unwanted, un } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const Downloadcustomerlist = async (req, res) => {
  try {
    const { customerType, branchselected, searchTerm } = req.query;
    if (!branchselected) {
      return res.status(400).json({ message: "branchid is missing" });
    }

    const branchId = new mongoose.Types.ObjectId(branchselected);
    const safe = escapeRegExp(String(searchTerm || "").trim());
    const regex = new RegExp(safe, "i");

    let matchConditions = {};
    let pipeline = [];

    // Common search filter (applied to all cases)
    const searchFilter = {
      $or: [
        { customerName: { $regex: regex } },
        { mobile: { $regex: regex } },

      ]
    };

    // if (customerType === "ProductMissing") {
    //   matchConditions = {
    //     $and: [
    //       {
    //         $or: [
    //           { selected: { $exists: false } },
    //           { selected: { $size: 0 } }
    //         ]
    //       },
    //       searchFilter
    //     ]
    //   };

    //   pipeline = [
    //     { $match: matchConditions },
    //     {
    //       $group: {
    //         _id: "$_id",
    //         customerName: { $first: "$customerName" },
    //         address: { $first: "$address1" },
    //         pincode: { $first: "$pincode" },
    //         email: { $first: "$email" },
    //         mobile: { $first: "$mobile" }
    //       }
    //     },
    //     { $sort: { customerName: 1 } }
    //   ];
    // } else {
    //   matchConditions = {
    //     $and: [
    //       {
    //         "selected.branch_id": branchId,
    //         selected: { $exists: true, $ne: [] },
    //         ...(customerType !== "Allcustomers" &&
    //           customerType !== "ProductinfoMissing" && {
    //           isActive: customerType
    //         }),
    //         ...(customerType === "ProductinfoMissing" && {
    //           selected: {
    //             $elemMatch: {
    //               $or: [
    //                 { product_id: null },
    //                 { product_id: { $exists: false } }
    //               ]
    //             }
    //           }
    //         })
    //       },
    //       searchFilter // ✅ applies for all other types too
    //     ]
    //   };

    //   pipeline = [
    //     { $match: matchConditions },
    //     { $unwind: "$selected" },
    //     {
    //       $lookup: {
    //         from: "products",
    //         localField: "selected.product_id",
    //         foreignField: "_id",
    //         as: "productDetails"
    //       }
    //     },
    //     {
    //       $unwind: {
    //         path: "$productDetails",
    //         preserveNullAndEmptyArrays: true
    //       }
    //     },
    //     {
    //       $addFields: {
    //         "selected.productName": "$productDetails.productName"
    //       }
    //     },
    //     {
    //       $group: {
    //         _id: "$_id",
    //         customerName: { $first: "$customerName" },
    //         address: { $first: "$address1" },
    //         pincode: { $first: "$pincode" },
    //         email: { $first: "$email" },
    //         mobile: { $first: "$mobile" },
    //         selected: { $push: "$selected" },
    //         status: { $first: "$isActive" }
    //       }
    //     },
    //     { $sort: { customerName: 1 } }
    //   ];
    // }

    if (customerType === "ProductMissing") {
      matchConditions = {
        $and: [
          {
            $or: [
              { selected: { $exists: false } },
              { selected: { $size: 0 } }
            ]
          },
          searchFilter
        ]
      };

      pipeline = [
        { $match: matchConditions },
        {
          $group: {
            _id: "$_id",
            customerName: { $first: "$customerName" },
            address: { $first: "$address1" },
            pincode: { $first: "$pincode" },
            email: { $first: "$email" },
            mobile: { $first: "$mobile" }
          }
        },
        { $sort: { customerName: 1 } }
      ];
    } else {
      // --- MAIN SECTION FOR OTHER TYPES ---
      matchConditions = {
        $and: [
          {
            "selected.branch_id": branchId,
            selected: { $exists: true, $ne: [] },
            ...(customerType !== "Allcustomers" &&
              customerType !== "ProductinfoMissing" && {
              isActive: customerType
            }),
            ...(customerType === "ProductinfoMissing" && {
              selected: {
                $elemMatch: {
                  $or: [
                    { product_id: null },
                    { product_id: { $exists: false } }
                  ]
                }
              }
            })
          },
          {
            $or: [
              { customerName: { $regex: regex } },
              { mobile: { $regex: regex } },
              // ✅ Match inside selected.licensenumber
              {
                $expr: {
                  $gt: [
                    {
                      $size: {
                        $filter: {
                          input: "$selected",
                          as: "item",
                          cond: {
                            $regexMatch: {
                              input: { $toString: "$$item.licensenumber" },
                              regex: regex
                            }
                          }
                        }
                      }
                    },
                    0
                  ]
                }
              }
            ]
          }
        ]
      };

      pipeline = [
        { $match: matchConditions },
        { $unwind: "$selected" },
        {
          $lookup: {
            from: "products",
            localField: "selected.product_id",
            foreignField: "_id",
            as: "productDetails"
          }
        },
        {
          $unwind: {
            path: "$productDetails",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $addFields: {
            "selected.productName": "$productDetails.productName"
          }
        },
        {
          $group: {
            _id: "$_id",
            customerName: { $first: "$customerName" },
            address: { $first: "$address1" },
            pincode: { $first: "$pincode" },
            email: { $first: "$email" },
            mobile: { $first: "$mobile" },
            selected: { $push: "$selected" },
            status: { $first: "$isActive" }
          }
        },
        { $sort: { customerName: 1 } }
      ];
    }

    const customers = await Customer.aggregate(pipeline);

    const flattened = customers.flatMap((customer) => {
      if (Array.isArray(customer.selected) && customer.selected.length > 0) {
        return customer.selected.map((item) => ({
          customerName: customer.customerName,
          address: customer.address,
          pincode: customer.pincode,
          email: customer.email,
          mobile: customer.mobile,
          licenseNo: item.licensenumber || "-",
          status: customer.status || "-",
          branchName: item.branchName || "-",
          productName: item.productName || "-"
        }));
      } else {
        return {
          customerName: customer.customerName,
          address: customer.address,
          pincode: customer.pincode,
          email: customer.email,
          mobile: customer.mobile,
          licenseNo: "-",
          status: "-",
          branchName: "-",
          productName: "-"
        };
      }
    });

    if (flattened && flattened.length > 0) {
      return res.status(201).json({ message: "Customer found", data: flattened });
    } else {
      return res.status(200).json({ message: "No customers found", data: [] });
    }
  } catch (error) {
    console.log("error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


