import LeadMaster from "../../model/primaryUser/leadmasterSchema.js"
import mongoose from "mongoose"
import models from "../../model/auth/authSchema.js"
const { Staff, Admin } = models
import LeadId from "../../model/primaryUser/leadIdSchema.js"
import Service from "../../model/primaryUser/servicesSchema.js"
export const LeadRegister = async (req, res) => {
  try {
    const { leadData, selectedtableLeadData, assignedto } = req.body

    const {
      customerName,
      mobile,
      phone,
      email,
      location,
      pincode,
      trade,
      leadFor,
      remark,
      netAmount,
      allocatedTo,
      leadBy, leadBranch
    } = leadData

    const checkedHavePendingLeads = await LeadMaster.findOne({
      customerName,
      leadConfirmed: false
    })
    if (checkedHavePendingLeads) {
      return res.status(201).json({
        message:
          "This customer already has pending leads. Please follow up and confirm them."
      })
    }

    const leadDate = new Date()
    const lastLead = await LeadId.findOne().sort({ leadId: -1 })

    // Generate new leadId
    let newLeadId = "00001" // Default if no leads exist

    if (lastLead) {
      const lastId = parseInt(lastLead.leadId, 10) // Convert to number
      newLeadId = String(lastId + 1).padStart(5, "0") // Convert back to 5-digit string
    }
    let assignedModel = null
    let assignedtoleadByModel = null // Determine dynamically
    // Check if leadBy exists in Staff or Admin collection
    const isStaffAssigned = await Staff.findById(assignedto).lean()
    const isStaff = await Staff.findById(leadBy).lean()
    if (isStaffAssigned) {
      assignedModel = "Staff"
    } else {
      const isAdmin = await Admin.findById(assignedto).lean()
      if (isAdmin) {
        assignedModel = "Admin"
      }
    }

    if (isStaff) {
      assignedtoleadByModel = "Staff"
    } else {
      const isAdmin = await Admin.findById(leadBy).lean()
      if (isAdmin) {
        assignedtoleadByModel = "Admin"
      }
    }

    if (!assignedtoleadByModel) {
      return res.status(400).json({ message: "Invalid leadBy reference" })
    }

    const lead = new LeadMaster({
      leadId: newLeadId,
      leadDate,
      customerName,
      mobile,
      phone,
      email,
      location,
      pincode,
      trade,
      leadFor,
      leadBranch,
      remark,
      leadBy,
      assignedto,
      assignedModel,
      assignedtoleadByModel, // Now set dynamically
      netAmount: Number(netAmount),
      allocatedTo
    })
    selectedtableLeadData.forEach((item) =>
      lead.leadFor.push({
        productorServiceId: item.productorServiceId,
        productorServicemodel: item.itemType,
        licenseNumber: item.licenseNumber,
        price: item.price
      })
    )
    await lead.save()
    const leadidonly = new LeadId({
      leadId: newLeadId,
      leadBy,
      assignedtoleadByModel // Now set dynamically
    })
    await leadidonly.save()
    res.status(200).json({
      success: true,
      message: "Lead created successfully"
    })
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const UpdateLeadRegister = async (req, res) => {
  try {
    const { data, leadData } = req.body

    const { docID } = req.query
    const objectId = new mongoose.Types.ObjectId(docID)

    const mappedleadData = leadData.map((item) => {
      return {
        licenseNumber: item.licenseNumber,
        productorServiceId: item.productorServiceId,
        productorServicemodel: item.itemType,
        price: item.price
      }
    })

    const updatedLead = await LeadMaster.findByIdAndUpdate(objectId, {
      ...data,
      leadFor: mappedleadData
    })
    if (!updatedLead) {
      return res.status(404).json({ message: "Lead not found" })
    }
    return res.status(200).json({ message: "Lead Updated Successfully" })
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const GetAllservices = async (req, res) => {
  try {
    const allservices = await Service.find({})
    return res
      .status(200)
      .json({ message: "Services found", data: allservices })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const GetallfollowupList = async (req, res) => {


  try {
    const { loggeduserid, branchSelected, role } = req.query


    const userObjectId = new mongoose.Types.ObjectId(loggeduserid)
    const branchObjectId = new mongoose.Types.ObjectId(branchSelected)
    let query
    if (role === "Staff") {
      query = {
        allocatedTo: { $ne: null }, $or: [
          { allocatedTo: userObjectId },
          { allocatedBy: userObjectId }
        ],
        leadBranch: branchObjectId
      }
    } else {
      query = { allocatedTo: { $ne: null }, leadBranch: branchObjectId }

    }
    const selectedfollowup = await LeadMaster.find(query).populate({ path: "customerName", select: "customerName" }).lean()
    const followupLeads = await Promise.all(
      selectedfollowup.map(async (lead) => {
        if (
          !lead.assignedtoleadByModel ||
          !mongoose.models[lead.assignedtoleadByModel] || !lead.allocatedToModel || !mongoose.models[lead.allocatedToModel]
        ) {
          console.error(
            `Model ${lead.assignedtoleadByModel}or ${lead.allocatedToModel} is not registered`
          )
          return lead // Return lead as-is if model is invalid
        }

        // Fetch the referenced document manually
        const assignedModel = mongoose.model(lead.assignedtoleadByModel)
        const allocatedmodel = mongoose.model(lead.allocatedToModel)
        const allocatedbymodel = mongoose.model(lead.allocatedByModel)
        const populatedLeadBy = await assignedModel
          .findById(lead.leadBy)
          .select("name")
          .lean()

        const populatedAllocatedTo = await allocatedmodel
          .findById(lead.allocatedTo)
          .select("name")
          .lean()
        const populatedallocatedBy = await allocatedbymodel
          .findById(lead.allocatedBy)
          .select("name")
          .lean()

        // Handle followUpDatesandRemarks population
        let populatedFollowUps = []
        if (
          Array.isArray(lead.followUpDatesandRemarks) &&
          lead.followUpDatesandRemarks.length > 0
        ) {
          populatedFollowUps = await Promise.all(
            lead.followUpDatesandRemarks.map(async (entry) => {
              const { followedId, followedByModel } = entry

              // Validate model
              if (followedId && followedByModel && mongoose.models[followedByModel]) {
                const FollowedModel = mongoose.model(followedByModel)
                const followedUser = await FollowedModel
                  .findById(followedId)
                  .select("name")
                  .lean()
                return { ...entry, followedId: followedUser }
              }

              return entry // Leave as is if model not found or invalid
            })
          )
        }

        return { ...lead, leadBy: populatedLeadBy, allocatedTo: populatedAllocatedTo, allocatedBy: populatedallocatedBy, followUpDatesandRemarks: populatedFollowUps } // Merge populated data
      })
    )

    const ischekCollegueLeads = followupLeads.some((item) => item.allocatedBy._id.equals(userObjectId))

    return res.status(201).json({ messge: "leadfollowup found", data: { followupLeads, ischekCollegueLeads } })

  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const SetDemoallocation = async (req, res) => {
  try {
    const { demoallocatedBy, leaddocId } = req.query
    const { demoData, formData, editdemoIndex, editfollowUpDatesandRemarksEditIndex } = req.body



    const { demoallocatedTo, ...balanceData } = demoData
    const allocatedToObjectId = new mongoose.Types.ObjectId(demoallocatedTo)


    const allocatedByObjectId = new mongoose.Types.ObjectId(demoallocatedBy)
    let followedByModel
    let demoallocatedByModel
    let demoallocatedtoModel
    const isallocatedbyStaff = await Staff.findOne({ _id: allocatedByObjectId })
    if (isallocatedbyStaff) {
      demoallocatedByModel = "Staff"
    } else {
      const isallocatedbyAdmin = await Admin.findOne({ _id: allocatedByObjectId })
      if (isallocatedbyAdmin) {
        demoallocatedByModel = "Admin"
      }
    }
    const isallocatedtoStaff = await Staff.findOne({ _id: allocatedToObjectId })
    if (isallocatedtoStaff) {
      demoallocatedtoModel = "Staff"
    } else {
      isallocatedtoAdmin = await Admin.findOne({ _id: allocatedToObjectId })
      if (isallocatedtoAdmin) {
        demoallocatedtoModel = "Admin"
      }

    }
    //////////for push followup data///
    const isstaffFollowedBy = await Staff.findOne({ _id: allocatedByObjectId })//here allocatedByObjectId and followedby is same
    if (isstaffFollowedBy) {
      followedByModel = "Staff"
    } else {
      const isadminFollowedBy = await Admin.findOne({ _id: allocatedByObjectId })//here allocatedByObjectId and followedby is same
      if (isadminFollowedBy) {
        followedByModel = "Admin"
      }
    }
    // const check = await LeadMaster.findOne({ leadId })

    // if (!check) {
    //   return res.status(404).json({ message: "Lead not found" })
    // }
    let updateQuery = {};

    if (typeof editfollowUpDatesandRemarksEditIndex === "number") {
      // Edit existing followUpDatesandRemarks entry
      updateQuery[`followUpDatesandRemarks.${editfollowUpDatesandRemarksEditIndex}.nextfollowUpDate`] = formData.nextfollowUpDate;
      updateQuery[`followUpDatesandRemarks.${editfollowUpDatesandRemarksEditIndex}.followUpDate`] = formData.followUpDate;
      updateQuery[`followUpDatesandRemarks.${editfollowUpDatesandRemarksEditIndex}.Remarks`] = formData.Remarks;
      updateQuery[`followUpDatesandRemarks.${editfollowUpDatesandRemarksEditIndex}.followedId`] = formData.followedId;
      updateQuery[`followUpDatesandRemarks.${editfollowUpDatesandRemarksEditIndex}.followedByModel`] = followedByModel;
    } else {
      // Add new
      updateQuery.$push = {
        followUpDatesandRemarks: {
          nextfollowUpDate: formData.nextfollowUpDate,
          followUpDate: formData.followUpDate,
          Remarks: formData.Remarks,
          followedId: demoallocatedBy,
          followedByModel,
        },
      };

    }
    if (typeof editdemoIndex === "number") {
      // Edit existing demofollowUp entry
      updateQuery[`demofollowUp.${editdemoIndex}.demoallocatedTo`] = demoallocatedTo;
      updateQuery[`demofollowUp.${editdemoIndex}.demoallocatedtoModel`] = demoallocatedtoModel;
      updateQuery[`demofollowUp.${editdemoIndex}.demoallocatedBy`] = demoallocatedBy;
      updateQuery[`demofollowUp.${editdemoIndex}.demoallocatedByModel`] = demoallocatedByModel;
      updateQuery[`demofollowUp.${editdemoIndex}.demoDescription`] = demoData.demoDescription;
      updateQuery[`demofollowUp.${editdemoIndex}.demoallocatedDate`] = demoData.demoallocatedDate;
    } else {
      // Add new
      if (!updateQuery.$push) updateQuery.$push = {};
      updateQuery.$push.demofollowUp = {
        demoallocatedTo,
        demoallocatedtoModel,
        demoallocatedBy,
        demoallocatedByModel,
        demoDescription: demoData.demoDescription,
        demoallocatedDate: demoData.demoallocatedDate,
      };
    }

    await LeadMaster.findOneAndUpdate(
      { _id: leaddocId },
      Object.keys(updateQuery).includes("$push") ? updateQuery : { $set: updateQuery },
      { new: true, upsert: false }
    );


    return res.status(200).json({ message: "Demo added succesfully" })
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const GetdemoleadCount = async (req, res) => {
  try {
    const { loggeduserid } = req.query
    const objectid = new mongoose.Types.ObjectId(loggeduserid)
    const followupCount = await LeadMaster.find({ "demofollowUp.demoallocatedTo": objectid })
    const pendingDemoCount = followupCount.filter((item) => item.demofollowUp.some((demo) => demo.demoallocatedTo.equals(objectid) && demo.demofollowerDate === null)).length
    return res.status(200).json({ message: "found mathch", data: pendingDemoCount })
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "internal server error" })
  }
}
export const GetrepecteduserDemo = async (req, res) => {
  try {
    const { userid, selectedBranch, role } = req.query
    const userObjectId = new mongoose.Types.ObjectId(userid)
    const branchObjectId = new mongoose.Types.ObjectId(selectedBranch)
    let matchStage = {
      leadBranch: branchObjectId
    };

    if (role === "Staff") {
      matchStage = {
        leadBranch: branchObjectId,
        $or: [
          {
            demofollowUp: {
              $elemMatch: { demoallocatedTo: userObjectId }
            }
          },
          {
            demofollowUp: {
              $elemMatch: { demoallocatedBy: userObjectId }
            }
          }
        ]
      }
        ;
    } else if (role === "Admin") {
      matchStage.$and = [
        { demofollowUp: { $exists: true } },
        { demofollowUp: { $ne: [] } }
      ]
    }

    const matchedLeads = await LeadMaster.aggregate([
      {
        $match: matchStage
      },

      {
        $addFields: {

          demofollowUp: {
            $cond: {
              if: { $eq: [role, "Staff"] },
              then: {

                $filter: {
                  input: "$demofollowUp",
                  as: "demo",
                  cond: {
                    $or: [
                      { $eq: ["$$demo.demoallocatedTo", userObjectId] },
                      { $eq: ["$$demo.demoallocatedBy", userObjectId] }
                    ]
                  }
                }

              },
              else: {
                $cond: {
                  if: { $isArray: "$demofollowUp" },
                  then: "$demofollowUp",
                  else: []
                }
              } // Admin gets first entry
            }
          }


        }
      },
      {
        $set: {
          demofollowUp: {
            $map: {
              input: "$demofollowUp",
              as: "item",
              in: {
                $mergeObjects: ["$$item", { index: { $indexOfArray: ["$demofollowUp", "$$item"] } }]
              }
            }
          }
        }
      }
      ,
      {
        $unwind: "$demofollowUp"
      },
      {
        $facet: {
          staff: [
            {
              $match: {
                "demofollowUp.demoallocatedByModel": "Staff",

              }
            },
            {
              $lookup: {
                from: "staffs",
                let: { userId: "$demofollowUp.demoallocatedBy" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$_id", "$$userId"] }
                    }
                  },
                  {
                    $project: {
                      _id: 1,
                      name: 1
                    }
                  }
                ],
                as: "demoallocatedByDetails"
              }
            },
            {
              $lookup: {
                from: "staffs",
                let: { userId: "$demofollowUp.demoallocatedTo" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$_id", "$$userId"] }
                    }
                  },
                  {
                    $project: { _id: 1, name: 1 }
                  }
                ],
                as: "demoallocatedToDetails"
              }
            }
          ],
          admin: [
            {
              $match: {
                "demofollowUp.demoallocatedByModel": "Admin"
              }
            },
            {
              $lookup: {
                from: "admins",
                let: { userId: "$demofollowUp.demoallocatedBy" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$_id", "$$userId"] }
                    }
                  },
                  {
                    $project: {
                      _id: 1,
                      name: 1
                    }
                  }
                ],
                as: "demoallocatedByDetails"
              }
            },
            {
              $lookup: {
                from: "staffs", // Assuming `demoallocatedToModel` for Admin also refers to staff
                let: { userId: "$demofollowUp.demoallocatedTo" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$_id", "$$userId"] }
                    }
                  },
                  {
                    $project: { _id: 1, name: 1 }
                  }
                ],
                as: "demoallocatedToDetails"
              }
            }
          ]
        }
      },
      {
        $project: {
          results: {
            $concatArrays: ["$staff", "$admin"]
          }
        }
      },
      {
        $unwind: "$results"
      },
      {
        $replaceRoot: {
          newRoot: "$results"
        }
      },
      {
        $unwind: {
          path: "$demoallocatedByDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: "$demoallocatedToDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $set: {
          "demofollowUp.demoallocatedBy":
          {
            _id: "$demoallocatedByDetails._id",
            name: "$demoallocatedByDetails.name"
          },
          "demofollowUp.demoallocatedTo": {
            _id: "$demoallocatedToDetails._id",
            name: "$demoallocatedToDetails.name"
          }
        }
      },
      {
        $unset: ["demoallocatedByDetails", "demoallocatedToDetails"]
      },
      // 🔍 Lookup customerName from customers collection
      {
        $lookup: {
          from: "customers",
          localField: "customerName",
          foreignField: "_id",
          as: "customerTmp"
        }
      },
      {
        $unwind: {
          path: "$customerTmp",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $set: {
          customerName: {
            customerName: "$customerTmp.customerName",
            email: "$customerTmp.email",
            mobile: "$customerTmp.mobile",
            landline: "$customerTmp.landline"
          },
        }
      },
      { $unset: "customerTmp" },
      ////Lookup on allocatedby////
      // 1. Lookup from both possible sources (staffs/admins)

      {
        $lookup: {
          from: "staffs",
          localField: "allocatedBy",
          foreignField: "_id",
          as: "allocatedByStaff"
        }
      },
      {
        $lookup: {
          from: "admins",
          localField: "allocatedBy",
          foreignField: "_id",
          as: "allocatedByAdmin"
        }
      },

      // 2. Merge the result based on the model
      {
        $addFields: {
          allocatedByTemp: {
            $cond: [
              { $eq: ["$allocatedByModel", "Staff"] },
              { $arrayElemAt: ["$allocatedByStaff", 0] },
              { $arrayElemAt: ["$allocatedByAdmin", 0] }
            ]
          }
        }
      },

      // 3. Replace original field
      {
        $set: {
          allocatedBy: { name: "$allocatedByTemp.name" }
        }
      },

      // 4. Clean up temp fields
      {
        $unset: ["allocatedByTemp", "allocatedByStaff", "allocatedByAdmin"]
      }
      ,
      // 🔍 Lookup allocatedTo (assumes Staff, adapt if needed)
      {
        $lookup: {
          from: "staffs",
          let: { id: "$allocatedTo", model: "$allocatedToModel" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$id"] },
                    { $eq: ["$$model", "Staff"] }
                  ]
                }
              }
            },
            { $project: { _id: 0, name: 1 } }
          ],
          as: "allocatedToTmp"
        }
      },
      {
        $unwind: {
          path: "$allocatedToTmp",
          preserveNullAndEmptyArrays: true
        }
      },
      { $set: { allocatedTo: "$allocatedToTmp" } },
      { $unset: "allocatedToTmp" },
      // 🔍 Lookup leadBy (assumes Staff, adapt if needed)
      {
        $lookup: {
          from: "staffs",
          let: { id: "$leadBy", model: "$assignedtoleadByModel" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$id"] },
                    { $eq: ["$$model", "Staff"] }
                  ]
                }
              }
            },
            { $project: { _id: 0, name: 1 } }
          ],
          as: "leadByTmp"
        }
      },
      {
        $unwind: {
          path: "$leadByTmp",
          preserveNullAndEmptyArrays: true
        }
      },
      { $set: { leadBy: "$leadByTmp" } },
      { $unset: "leadByTmp" },

      {
        $group: {
          _id: "$_id",
          leadId: { $first: "$leadId" },
          customerName: { $first: "$customerName" },
          leadDate: { $first: "$leadDate" },
          leadFor: { $first: "$leadFor" },
          leadBy: { $first: "$leadBy" },
          leadBranch: { $first: "$leadBranch" },
          demofollowUp: { $push: "$demofollowUp" },
          followUpDatesandRemarks: { $first: "$followUpDatesandRemarks" },
          netAmount: { $first: "$netAmount" },
          remark: { $first: "$remark" },
          allocatedTo: { $first: "$allocatedTo" },
          allocatedBy: { $first: "$allocatedBy" }
        }
      }

    ]);
    return res.status(200).json({ message: "Matched demo found", data: matchedLeads })
  } catch (error) {
  }
}
export const UpdaeOrSubmitdemofollowByfollower = async (req, res) => {
  try {
    const demoDetails = req.body
    const { matcheddemoindex, mathchedfollowUpDatesandRemarksIndex, leadDocId, followerDate, followerDescription } = demoDetails
    const followerData = {
      matcheddemoindex: demoDetails.matcheddemoindex,
      demoAssignedBy: demoDetails.demoAssignedBy,
      demoAssignedDate: demoDetails.demoAssignedDate,
      followerDate: demoDetails.followerDate,
      followerDescription: demoDetails.followerDescription
    }

    const updatedLead = await LeadMaster.updateOne(
      { _id: leadDocId },
      {
        $set: {
          [`demofollowUp.${matcheddemoindex}.demofollowerDate`]: new Date(followerDate),
          [`demofollowUp.${matcheddemoindex}.demofollowerDescription`]: followerDescription

        },
        $push: {
          [`followUpDatesandRemarks.${mathchedfollowUpDatesandRemarksIndex}.folowerData`]: followerData
        }
      }
    )
    if (updatedLead.modifiedCount > 0) {
      return res.status(201).json({ message: "Demo submitted Succesfully" })
    } else if (updatedLead.matchedCount > 0 && updatedLead.modifiedCount === 0) {

      return res.status(304).json({ message: "Match found ,not submitted" })
    } else {
      return res.status(404).json({ message: "not submitted" });
    }
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const GetallLead = async (req, res) => {
  try {
    const { Status, selectedBranch, role } = req.query
    const branchObjectId = new mongoose.Types.ObjectId(selectedBranch)

    if (!Status && !role) {
      return res.status(400).json({ message: "Status or role is missing " })
    }
    let branchObjectIds
    if (Status === "Pending") {
      const query = { allocatedTo: null, leadBranch: branchObjectId };



      const pendingLeads = await LeadMaster.find(query)
        .populate({ path: "customerName", select: "customerName" })
        .lean()

      const populatedPendingLeads = await Promise.all(
        pendingLeads.map(async (lead) => {
          if (
            !lead.assignedtoleadByModel ||
            !mongoose.models[lead.assignedtoleadByModel]
          ) {
            console.error(
              `Model ${lead.assignedtoleadByModel} is not registered`
            )
            return lead // Return lead as-is if model is invalid
          }

          // Fetch the referenced document manually
          const assignedModel = mongoose.model(lead.assignedtoleadByModel)
          const populatedLeadBy = await assignedModel
            .findById(lead.leadBy)
            .select("name")

          return { ...lead, leadBy: populatedLeadBy } // Merge populated data
        })
      )
      if (populatedPendingLeads) {
        return res
          .status(200)
          .json({ message: "pending leads found", data: populatedPendingLeads })
      }
    } else if (Status === "Approved") {

      const query = { allocatedTo: { $ne: null }, leadBranch: branchObjectId };



      const approvedAllocatedLeads = await LeadMaster.find(query)
        .populate({ path: "customerName", select: "customerName" })
        .lean()
      const populatedApprovedLeads = await Promise.all(
        approvedAllocatedLeads.map(async (lead) => {
          if (
            !lead.assignedtoleadByModel ||
            !mongoose.models[lead.assignedtoleadByModel] ||
            !lead.allocatedToModel ||
            !mongoose.models[lead.allocatedToModel] || !lead.allocatedByModel || !mongoose.models[lead.allocatedByModel]
          ) {
            console.error(
              `Model ${lead.assignedtoleadByModel} is not registered`
            )
            console.error(`Model ${lead.allocatedToModel} is not registered`)
            console.error(`Model ${lead.allocatedByModel} is not registered`)

            return lead // Return lead as-is if model is invalid
          }

          // Fetch the referenced document manually

          const assignedModel = mongoose.model(lead.assignedtoleadByModel)
          const allocatedModel = mongoose.model(lead.allocatedToModel)
          const allocatedbyModel = mongoose.model(lead.allocatedByModel)

          const populatedLeadBy = await assignedModel
            .findById(lead.leadBy)
            .select("name")
          const populatedAllocates = await allocatedModel
            .findById(lead.allocatedTo)
            .select("name")
          const populatedAllocatedBy = await allocatedbyModel.findById(lead.allocatedBy).select("name")
          // 👇 Now handle followUpDatesandRemarks population
          const populatedFollowUps = await Promise.all(
            (lead.followUpDatesandRemarks || []).map(async (followUp) => {
              if (
                followUp.followedId &&
                followUp.followedByModel &&
                mongoose.models[followUp.followedByModel]
              ) {
                const FollowedModel = mongoose.model(followUp.followedByModel)
                const populatedFollowed = await FollowedModel.findById(
                  followUp.followedId
                ).select("name") // Or whatever field you want
                return {
                  ...followUp,
                  followedId: populatedFollowed // Replace followedId with populated document
                }
              }
              return followUp // No changes if no followedId or model
            })
          )

          return {
            ...lead,
            leadBy: populatedLeadBy,
            allocatedTo: populatedAllocates,
            allocatedBy: populatedAllocatedBy,
            followUpDatesandRemarks: populatedFollowUps
          } // Merge populated data
        })
      )
      if (populatedApprovedLeads) {
        return res.status(200).json({
          message: "Approved leads found",
          data: populatedApprovedLeads
        })
      }
    }
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const UpdateLeadfollowUpDate = async (req, res) => {
  try {
    const formData = req.body
    const { selectedleaddocId, loggeduserid } = req.query

    let followedByModel
    const isStaff = await Staff.find({ _id: loggeduserid })
    if (isStaff) {
      followedByModel = "Staff"
    } else {
      const isAdmin = await Admin.find({ _id: loggeduserid })
      if (isAdmin) {
        followedByModel = "Admin"
      }
    }
    if (!followedByModel) {
      return res.status(400).json({ message: "Invalid followedid reference" })
    }

    const updatefollowUpDate = await LeadMaster.findOneAndUpdate(
      { _id: selectedleaddocId },
      {
        $push: {
          followUpDatesandRemarks: {
            nextfollowUpDate: formData.nextfollowUpDate,
            followUpDate: formData.followUpDate,
            Remarks: formData.Remarks,
            followedId: loggeduserid,
            followedByModel
          }
        }
      },
      { upsert: true }
    )
    if (updatefollowUpDate) {
      return res.status(200).json({ message: "Update followupDate" })
    }
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}

export const UpadateOrLeadAllocationRegister = async (req, res) => {
  try {
    const { allocationpending, allocatedBy } = req.query

    const allocatedbyObjectid = new mongoose.Types.ObjectId(allocatedBy)
    const leadAllocationData = req.body
    let allocatedToModel
    let allocatedByModel
    const isStaffallocatedtomodel = await Staff.findOne({ _id: leadAllocationData.allocatedTo })


    if (isStaffallocatedtomodel) {
      allocatedToModel = "Staff"
    } else {
      const isAdminallocatedtomodel = await Admin.findOne({ _id: leadAllocationData.allocatdTo })
      if (isAdminallocatedtomodel) {
        allocatedToModel = "Admin"
      }
    }
    const isStaffallocatedbymodel = await Staff.findOne({ _id: allocatedbyObjectid })
    if (isStaffallocatedbymodel) {
      allocatedByModel = "Staff"
    } else {
      const isAdminallocatedbymodel = await Admin.findOne({ _id: allocatedbyObjectid })
      if (isAdminallocatedbymodel) {
        allocatedByModel = "Admin"
      }
    }
    if (!allocatedToModel || !allocatedByModel) {
      return res.status(400).json({ message: "Invalid allocated/allocatedby reference" })
    }
    const updatedLead = await LeadMaster.findByIdAndUpdate(
      {
        _id: leadAllocationData._id
      },

      { allocatedTo: leadAllocationData.allocatedTo, allocatedBy, allocatedToModel, allocatedByModel },
      { new: true }
    )
    if (allocationpending === "true" && updatedLead) {

      const pendingLeads = await LeadMaster.find({
        allocatedTo: null
      })
        .populate({ path: "customerName", select: "customerName" })
        .lean()

      const populatedLeads = await Promise.all(
        pendingLeads.map(async (lead) => {
          if (
            !lead.assignedtoleadByModel ||
            !mongoose.models[lead.assignedtoleadByModel]
          ) {
            console.error(
              `Model ${lead.assignedtoleadByModel} is not registered`
            )
            return lead // Return lead as-is if model is invalid
          }

          // Fetch the referenced document manually
          const assignedModel = mongoose.model(lead.assignedtoleadByModel)
          const populatedLeadBy = await assignedModel
            .findById(lead.leadBy)
            .select("name")

          return { ...lead, leadBy: populatedLeadBy } // Merge populated data
        })
      )
      return res
        .status(201)
        .json({ message: "pending leads found", data: populatedLeads })
    } else if (allocationpending === "false") {
      const allocatedLeads = await LeadMaster.find({
        allocatedTo: { $ne: null }
      })
        .populate({ path: "customerName", select: "customerName" })
        .lean()

      const populatedLeads = await Promise.all(
        allocatedLeads.map(async (lead) => {
          if (
            !lead.assignedtoleadByModel ||
            !mongoose.models[lead.assignedtoleadByModel]
          ) {
            console.error(
              `Model ${lead.assignedtoleadByModel} is not registered`
            )
            return lead // Return lead as-is if model is invalid
          }

          // Fetch the referenced document manually
          const assignedModel = mongoose.model(lead.assignedtoleadByModel)
          const populatedLeadBy = await assignedModel
            .findById(lead.leadBy)
            .select("name")

          return { ...lead, leadBy: populatedLeadBy } // Merge populated data
        })
      )
      return res
        .status(201)
        .json({ message: "updated allocation", data: populatedLeads })
    }
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const GetselectedLeadData = async (req, res) => {
  try {
    const { leadId } = req.query
    if (!leadId) {
      return res.status(400).json({ message: "No leadid reference exists" })
    }
    const selectedLead = await LeadMaster.findById({ _id: leadId })
      .populate({
        path: "customerName"
      })
      .lean()

    if (
      !selectedLead.assignedtoleadByModel ||
      !mongoose.models[selectedLead.assignedtoleadByModel] ||
      !selectedLead.allocatedToModel ||
      !mongoose.models[selectedLead.allocatedToModel]
    ) {
      console.error(
        `Model ${selectedLead.assignedtoleadByModel} is not registered`
      )
      console.error(`Model ${selectedLead.allocatedToModel} is not registered`)
      // return selectedLead
      const populatedLeads = await Promise.all(
        selectedLead.leadFor.map(async (item) => {
          const productorserviceModel = mongoose.model(
            item.productorServicemodel
          )
          const populatedProductorService = await productorserviceModel
            .findById(item.productorServiceId)
            .lean() // Use lean() to get plain JavaScript objects

          return { ...item, productorServiceId: populatedProductorService }
        })
      )

      const mergedleads = { ...selectedLead, leadFor: populatedLeads }
      return res
        .status(200)
        .json({ message: "matched lead found", data: [mergedleads] })
    } else {
      // Fetch the referenced document manually
      const assignedModel = mongoose.model(selectedLead.assignedtoleadByModel)
      const allocatedModel = mongoose.model(selectedLead.allocatedToModel)

      const populatedLeadBy = await assignedModel
        .findById(selectedLead.leadBy)
        .select("name")

      const populatedAllocates = await allocatedModel
        .findById(selectedLead.allocatedTo)
        .select("name")
      const populatedLeadFor = await Promise.all(
        selectedLead.leadFor.map(async (item) => {
          const productorserviceModel = mongoose.model(
            item.productorServicemodel
          )
          const populatedProductorService = await productorserviceModel
            .findById(item.productorServiceId)
            .lean() // Use lean() to get plain JavaScript objects

          return { ...item, productorServiceId: populatedProductorService }
        })
      )

      const populatedApprovedLead = {
        ...selectedLead, // convert Mongoose doc to plain object
        leadFor: populatedLeadFor,
        leadBy: populatedLeadBy,
        allocatedTo: populatedAllocates
      }
      if (populatedApprovedLead) {
        return res.status(200).json({
          message: "matched lead found",
          data: [populatedApprovedLead]
        })
      }
    }
  } catch (error) {
    console.log("error:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const GetownLeadList = async (req, res) => {

  try {
    const { userId } = req.query
    const objectId = new mongoose.Types.ObjectId(userId)
    // const matchedLead=await LeadMaster.find({leadBy:objectId,allocatedTo:null})
    const matchedLead = await LeadMaster.find(
      { leadBy: objectId }
    ).populate({ path: "customerName", select: "customerName" }).lean()
    const populatedOwnLeads = await Promise.all(
      matchedLead.map(async (lead) => {
        if (
          !lead.assignedtoleadByModel ||
          !mongoose.models[lead.assignedtoleadByModel]
        ) {
          console.error(
            `Model ${lead.assignedtoleadByModel} is not registered`
          )
          return lead // Return lead as-is if model is invalid
        }

        // Fetch the referenced document manually
        const assignedModel = mongoose.model(lead.assignedtoleadByModel)
        const populatedLeadBy = await assignedModel
          .findById(lead.leadBy)
          .select("name")

        return { ...lead, leadBy: populatedLeadBy } // Merge populated data
      }))
    return res.status(200).json({ message: "lead found", data: populatedOwnLeads })

  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
