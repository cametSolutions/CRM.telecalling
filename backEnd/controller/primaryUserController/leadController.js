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
      partner,
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

    let leadByModel = null // Determine dynamically
    // Check if leadBy exists in Staff or Admin collection

    const isStaff = await Staff.findById(leadBy).lean()


    if (isStaff) {
      leadByModel = "Staff"
    } else {
      const isAdmin = await Admin.findById(leadBy).lean()
      if (isAdmin) {
        leadByModel = "Admin"
      }
    }

    if (!leadByModel) {
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
      partner,
      leadBranch,
      remark,
      leadBy,
      leadByModel, // Now set dynamically
      netAmount: Number(netAmount),

      activityLog: [{
        submissionDate: leadDate,
        submittedUser: leadBy,
        submissiondoneByModel: leadByModel,
        remarks: remark,
        taskBy: "lead"
      }]

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
      leadByModel // Now set dynamically
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
    const { loggeduserid, branchSelected, role, pendingfollowup } = req.query

    const userObjectId = new mongoose.Types.ObjectId(loggeduserid)
    const branchObjectId = new mongoose.Types.ObjectId(branchSelected)
    let query
    if (role === "Staff") {
      if (pendingfollowup === "true") {
console.log("h")
        query = {

          activityLog: {
            $elemMatch: {
              taskTo: "followup",
              $or: [
                { submittedUser: userObjectId },
                { taskallocatedTo: userObjectId }
              ],
              allocatedClosed: false,

            }
          },
          leadBranch: branchObjectId,
          reallocatedTo: false
        }
      } else if (pendingfollowup === "false") {
        query = {

          activityLog: {
            $elemMatch: {
              taskBy: "followup",
              $or: [
                { submittedUser: userObjectId },
                { taskallocatedTo: userObjectId }
              ],
              taskClosed: true

            }
          },
          leadBranch: branchObjectId,

        }

      }

    } else {
      query = { leadBranch: branchObjectId }

    }
    const selectedfollowup = await LeadMaster.find(query).populate({ path: "customerName", select: "customerName" }).lean()
console.log(selectedfollowup)

    const followupLeads = [];

    for (const lead of selectedfollowup) {
      const matchedallocation = lead.activityLog.filter((item) => item?.taskTo === "followup")
      // console.log("mathched",matchedallocation)
      if (matchedallocation && matchedallocation.length > 0) {
        if (
          !lead.leadByModel || !mongoose.models[lead.leadByModel] ||
          !matchedallocation[matchedallocation.length-1]?.taskallocatedToModel || !mongoose.models[matchedallocation[matchedallocation.length-1]?.taskallocatedToModel] ||
          !matchedallocation[matchedallocation.length-1]?.taskallocatedByModel || !mongoose.models[matchedallocation[matchedallocation.length-1]?.taskallocatedByModel]
        ) {
          console.error(`Model ${lead.leadByModel}, ${matchedallocation[matchedallocation.length-1].taskallocatedToModel}, or ${matchedallocation[matchedallocation.length-1].taskallocatedByModel} is not registered`);
          followupLeads.push(lead);
          continue;
        }

        // Populate outer fields
        const leadByModel = mongoose.model(lead.leadByModel);
        const allocatedToModel = mongoose.model(matchedallocation[matchedallocation.length-1]?.taskallocatedToModel);
        const allocatedByModel = mongoose.model(matchedallocation[matchedallocation.length-1]?.taskallocatedByModel);

        const populatedLeadBy = await leadByModel.findById(lead.leadBy).select("name").lean();
        const populatedAllocatedTo = await allocatedToModel.findById(matchedallocation[matchedallocation.length-1].taskallocatedTo).select("name").lean();
        const populatedAllocatedBy = await allocatedByModel.findById(matchedallocation[matchedallocation.length-1].taskallocatedBy).select("name").lean();

        // Populate activityLog (submittedUser, etc.)
        const populatedActivityLog = await Promise.all(
          lead.activityLog.map(async (log) => {
            let populatedSubmittedUser = null;
            let populatedTaskAllocatedTo = null;

            if (log.submittedUser && log.submissiondoneByModel && mongoose.models[log.submissiondoneByModel]) {
              const model = mongoose.model(log.submissiondoneByModel);
              populatedSubmittedUser = await model.findById(log.submittedUser).select("name").lean();
            }

            if (log.taskallocatedTo && log.taskallocatedToModel && mongoose.models[log.taskallocatedToModel]) {
              const model = mongoose.model(log.taskallocatedToModel);
              populatedTaskAllocatedTo = await model.findById(log.taskallocatedTo).select("name").lean();
            }

            return {
              ...log,
              submittedUser: populatedSubmittedUser || log.submittedUser,
              taskallocatedTo: populatedTaskAllocatedTo || log.taskallocatedTo,
            };
          })
        );

        followupLeads.push({
          ...lead,
          leadBy: populatedLeadBy || lead.leadBy,
          allocatedTo: populatedAllocatedTo ,
          allocatedBy: populatedAllocatedBy ,
          activityLog: populatedActivityLog,
        });
      }


    }

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
    const demoData = req.body
    const { demoallocatedTo, ...balanceData } = demoData
    const allocatedToObjectId = new mongoose.Types.ObjectId(demoallocatedTo)


    const allocatedByObjectId = new mongoose.Types.ObjectId(demoallocatedBy)

    let taskallocatedByModel
    let taskallocatedtoModel
    const isallocatedbyStaff = await Staff.findOne({ _id: allocatedByObjectId })
    if (isallocatedbyStaff) {
      taskallocatedByModel = "Staff"
    } else {
      const isallocatedbyAdmin = await Admin.findOne({ _id: allocatedByObjectId })
      if (isallocatedbyAdmin) {
        taskallocatedByModel = "Admin"
      }
    }
    const isallocatedtoStaff = await Staff.findOne({ _id: allocatedToObjectId })
    if (isallocatedtoStaff) {
      taskallocatedtoModel = "Staff"
    } else {
      isallocatedtoAdmin = await Admin.findOne({ _id: allocatedToObjectId })
      if (isallocatedtoAdmin) {
        taskallocatedtoModel = "Admin"
      }

    }
    await LeadMaster.findByIdAndUpdate({ _id: leaddocId }, {
      $push: {
        activityLog: {
          submissionDate: new Date(),
          allocationDate: demoData.demoallocatedDate,
          submittedUser: demoallocatedBy,
          submissiondoneByModel: taskallocatedByModel,
          taskallocatedBy: demoallocatedBy,
          taskallocatedByModel: taskallocatedByModel,
          taskallocatedTo: demoallocatedTo,
          taskallocatedToModel: taskallocatedtoModel,
          remarks: demoData.demoDescription,
          taskBy: "allocated",
          taskTo: demoData?.selectedType,

        }
      },
      $set: { taskfromFollowup: true }
    }
    )




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
export const UpdateOrSubmittaskfollowByfollower = async (req, res) => {
  try {
    const taskDetails = req.body

    const updatedLead = await LeadMaster.updateOne(
      { _id: taskDetails.leadDocId },
      {
        $set: {
          [`task.${taskDetails.matchedtaskindex}.taskDate`]: taskDetails.taskDate,
          [`task.${taskDetails.matchedtaskindex}.taskRemarks`]: taskDetails.Remarks

        },
        reallocation: true,
        allocatedTo: null,
        allocatedToModel: null

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
export const GetallReallocatedLead = async (req, res) => {
  try {
    const { selectedBranch } = req.query
    const branchObjectId = new mongoose.Types.ObjectId(selectedBranch)
    const query = { leadBranch: branchObjectId, reallocatedTo: true };



    const reallocatedLeads = await LeadMaster.find(query)
      .populate({ path: "customerName", select: "customerName" })
      .lean()

    const populatedreallocatedLeads = await Promise.all(
      reallocatedLeads.map(async (lead) => {
        const submittedusermodel = lead.activityLog[lead.activityLog.length - 1]
        if (
          !lead.leadByModel ||
          !mongoose.models[lead.leadByModel] || !submittedusermodel.submissiondoneByModel || !mongoose.models[submittedusermodel.submissiondoneByModel]
        ) {
          console.error(
            `Model ${lead.leadByModel} is not registered`
          )
          console.error(
            `Model ${submittedusermodel} is not registered`
          )
          return lead // Return lead as-is if model is invalid
        }

        // Fetch the referenced document manually
        const assignedModel = mongoose.model(lead.leadByModel)
        const submitteduserModel = mongoose.model(submittedusermodel.submissiondoneByModel)
        const populatedSubmitteduser = await submitteduserModel.findById(submittedusermodel.submittedUser).select("name")
        const populatedLeadBy = await assignedModel
          .findById(lead.leadBy)
          .select("name")

        return { ...lead, leadBy: populatedLeadBy, submittedUser: populatedSubmitteduser } // Merge populated data
      })
    )
    if (populatedreallocatedLeads) {
      return res
        .status(200)
        .json({ message: "reallocated leads found", data: populatedreallocatedLeads })
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

    if (Status === "Pending") {
      const query = { leadBranch: branchObjectId, activityLog: { $size: 1 } };



      const pendingLeads = await LeadMaster.find(query)
        .populate({ path: "customerName", select: "customerName" })
        .lean()

      const populatedPendingLeads = await Promise.all(
        pendingLeads.map(async (lead) => {
          if (
            !lead.leadByModel ||
            !mongoose.models[lead.leadByModel]
          ) {
            console.error(
              `Model ${lead.leadByModel} is not registered`
            )
            return lead // Return lead as-is if model is invalid
          }

          // Fetch the referenced document manually
          const assignedModel = mongoose.model(lead.leadByModel)
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

      const query = {
        leadBranch: branchObjectId, reallocatedTo: false, activityLog: { $exists: true, $not: { $size: 0 } },
        $expr: { $gte: [{ $size: "$activityLog" }, 2] }
      }



      const approvedAllocatedLeads = await LeadMaster.find(query)
        .populate({ path: "customerName", select: "customerName" })
        .lean()
      const populatedApprovedLeads = await Promise.all(
        approvedAllocatedLeads.map(async (lead) => {
          const selected = lead.activityLog[lead.activityLog.length - 1]
          const lastMatchingActivity = [...(lead.activityLog || [])]
            .reverse()
            .find(log => log.taskallocatedTo && log.taskallocatedBy);

          if (
            !lead.leadByModel ||
            !mongoose.models[lead.leadByModel] ||
            !lastMatchingActivity.taskallocatedBy || !lastMatchingActivity.taskallocatedByModel ||
            !lastMatchingActivity.taskallocatedTo || !lastMatchingActivity.taskallocatedToModel

          ) {
            console.error(
              `Model ${lead.leadByModel} is not registered`
            )
            console.error(`Model ${lastMatchingActivity.taskallocatedByModel} is not registered`)
            console.error(`Model ${lastMatchingActivity.taskallocatedToModel} is not registered`)

            return lead // Return lead as-is if model is invalid
          }

          // Fetch the referenced document manually

          const leadByModel = mongoose.model(lead.leadByModel)
          const allocatedToModel = mongoose.model(lastMatchingActivity.taskallocatedToModel)
          const allocatedByModel = mongoose.model(lastMatchingActivity.taskallocatedByModel)

          const populatedLeadBy = await leadByModel
            .findById(lead.leadBy)
            .select("name")
          const populatedAllocates = await allocatedToModel
            .findById(lastMatchingActivity.taskallocatedTo)
            .select("name")
          const populatedAllocatedBy = await allocatedByModel.findById(lastMatchingActivity.taskallocatedBy).select("name")


          return {
            ...lead,
            leadBy: populatedLeadBy,
            allocatedTo: populatedAllocates,
            allocatedBy: populatedAllocatedBy,
          }
        }
        )
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
    const { formData, closed } = req.body
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
    const activityEntry = {
      submissionDate: formData.followUpDate,
      submittedUser: loggeduserid,
      submissiondoneByModel: followedByModel,
      taskBy: "followup",
      nextFollowUpDate: formData.nextfollowUpDate,
      remarks: formData.Remarks
    };

    // Conditionally add fields only if `closed` is true
    if (closed) {
      activityEntry.taskClosed = true;
      activityEntry.reallocatedTo = true;
    }
    const updatefollowUpDate = await LeadMaster.findOneAndUpdate(
      { _id: selectedleaddocId },
      {
        $push: {
          activityLog: activityEntry
        },
        reallocatedTo: closed
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
export const UpdateOrleadallocationTask = async (req, res) => {
  try {
    const { allocationpending, allocatedBy, allocationType } = req.query

    const allocatedbyObjectid = new mongoose.Types.ObjectId(allocatedBy)
    const { selectedItem, formData } = req.body

    let allocatedToModel
    let allocatedByModel

    const isStaffallocatedtomodel = await Staff.findOne({ _id: selectedItem.allocatedTo })


    if (isStaffallocatedtomodel) {
      allocatedToModel = "Staff"
    } else {
      const isAdminallocatedtomodel = await Admin.findOne({ _id: selectedItem.allocatdTo })
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
        _id: selectedItem._id
      },
      {
        allocatedTo: selectedItem.allocatedTo, allocatedBy, allocatedToModel, allocatedByModel, allocationType, task: [{
          allocationDate: formData.allocationDate,
          allocatedTo: selectedItem.allocatedTo,
          taskallocatedToModel: allocatedToModel,
          allocatedBy,
          taskallocatedByModel: allocatedByModel,
          allocationDescription: formData.allocationDescription

        }]
      },
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
  }
  return res.status(500).json({ message: "Internal server error" })
}
export const updateReallocation = async (req, res) => {
  try {
    const { allocatedBy, selectedbranch, allocationType } = req.query
    const allocatedbyObjectid = new mongoose.Types.ObjectId(allocatedBy)
    // const branchObjectId = new mongoose.Types.ObjectId(selectedbranch)
    const { selectedItem, formData } = req.body

    let allocatedToModel
    let allocatedByModel
    const isStaffallocatedtomodel = await Staff.findOne({ _id: selectedItem.allocatedTo })
    if (isStaffallocatedtomodel) {
      allocatedToModel = "Staff"
    } else {
      const isAdminallocatedtomodel = await Admin.findOne({ _id: selectedItem.allocatdTo })
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
        _id: selectedItem._id
      },

      {

        $push: {
          activityLog: {
            submissionDate: new Date(),
            submittedUser: allocatedBy,
            submissiondoneByModel: allocatedByModel,
            taskallocatedBy: allocatedBy,
            taskallocatedByModel: allocatedByModel,
            taskallocatedTo: selectedItem.allocatedTo,
            taskallocatedToModel: allocatedToModel,
            allocationDate: formData?.allocationDate,
            remarks: formData.allocationDescription,
            taskBy: "reallocated",
            taskTo: allocationType
          }
        },
        $set: {
          allocationType: allocationType, // Set outside the activityLog array
          reallocatedTo: false
        }
      },

      { new: true }
    )
    if (updatedLead) {
      return res.status(200).json({ message: "Re allocated successfully" })
    } else {
      return res.status(404).json({ message: "something went wrong" })
    }

  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "internal server error" })
  }
}
export const UpadateOrLeadAllocationRegister = async (req, res) => {
  try {
    const { allocationpending, allocatedBy, allocationType, selectedbranch } = req.query
    const allocatedbyObjectid = new mongoose.Types.ObjectId(allocatedBy)
    const branchObjectId = new mongoose.Types.ObjectId(selectedbranch)
    const { selectedItem, formData } = req.body
    let allocatedToModel
    let allocatedByModel
    const isStaffallocatedtomodel = await Staff.findOne({ _id: selectedItem.allocatedTo })
    if (isStaffallocatedtomodel) {
      allocatedToModel = "Staff"
    } else {
      const isAdminallocatedtomodel = await Admin.findOne({ _id: selectedItem.allocatdTo })
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

    const matchLead = await LeadMaster.findOne({ _id: selectedItem._id })
    if (matchLead.activityLog.length === 2) {
      const lastIndex = matchLead.activityLog.length - 1
      // Update specific fields of the last activityLog entry
      matchLead.activityLog[lastIndex] = {
        ...matchLead.activityLog[lastIndex], // keep existing fields
        submissionDate: new Date(),
        submittedUser: allocatedBy,
        submissiondoneByModel: allocatedByModel,
        taskallocatedBy: allocatedBy,
        taskallocatedByModel: allocatedByModel,
        taskallocatedTo: selectedItem.allocatedTo,
        taskallocatedToModel: allocatedToModel,
        remarks: formData.allocationDescription,
        taskBy: "allocated",
        taskTo: allocationType
      };

      // Save the document
      await matchLead.save();

    } else if (matchLead.activityLog.length === 1) {
      const updatedLead = await LeadMaster.findByIdAndUpdate(
        {
          _id: selectedItem._id
        },

        {

          $push: {
            activityLog: {
              submissionDate: new Date(),
              submittedUser: allocatedBy,
              submissiondoneByModel: allocatedByModel,
              taskallocatedBy: allocatedBy,
              taskallocatedByModel: allocatedByModel,
              taskallocatedTo: selectedItem.allocatedTo,
              taskallocatedToModel: allocatedToModel,
              remarks: formData.allocationDescription,
              taskBy: "allocated",
              taskTo: allocationType
            }
          },
          $set: {
            allocationType: allocationType // Set outside the activityLog array
          }
        },

        { new: true }
      )

    } else if (matchLead.activityLog.length > 2) {

      matchLead.activityLog.forEach((log) => {
        if ("allocatedClosed" in log) {
          log.allocatedClosed = true;
        }
      })
      // Important for deep changes in arrays
      matchLead.markModified('activityLog');

      // Push new log
      matchLead.activityLog.push({
        submissionDate: new Date(),
        submittedUser: allocatedBy,
        submissiondoneByModel: allocatedByModel,
        taskallocatedBy: allocatedBy,
        taskallocatedByModel: allocatedByModel,
        taskallocatedTo: selectedItem.allocatedTo,
        taskallocatedToModel: allocatedToModel,
        remarks: formData.allocationDescription,
        taskBy: "allocated",
        taskTo: allocationType
      });

      await matchLead.save();

    }


    if (allocationpending === "true") {
      const pendingLeads = await LeadMaster.find({
        leadBranch: branchObjectId,
        activityLog: { $size: 1 }
      })
        .populate({ path: "customerName", select: "customerName" })
        .lean()

      const populatedLeads = await Promise.all(
        pendingLeads.map(async (lead) => {
          if (
            !lead.leadByModel ||
            !mongoose.models[lead.leadByModel]
          ) {
            console.error(
              `Model ${lead.leadByModel} is not registered`
            )
            return lead // Return lead as-is if model is invalid
          }

          // Fetch the referenced document manually
          const assignedModel = mongoose.model(lead.leadByModel)
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
            !lead.leadByModel ||
            !mongoose.models[lead.leadByModel]
          ) {
            console.error(
              `Model ${lead.leadByModel} is not registered`
            )
            return lead // Return lead as-is if model is invalid
          }

          // Fetch the referenced document manually
          const assignedModel = mongoose.model(lead.leadByModel)
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
    console.log("error:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const UpdateLeadTask = async (req, res) => {
  try {
    const taskDetails = req.body
    const leadObjectId = new mongoose.Types.ObjectId(taskDetails.leadDocId)
    const lead = await LeadMaster.findById(leadObjectId);
    const activityLog = [...lead.activityLog]
    const Index = activityLog.length - 1
    const updateFields = {
      [`activityLog.${Index}.taskSubmissionDate`]: taskDetails.submissionDate,
      [`activityLog.${Index}.taskDescription`]: taskDetails.taskDescription,
      [`activityLog.${Index}.taskClosed`]: true
    };
    await LeadMaster.updateOne({ _id: leadObjectId }, { $set: updateFields })
    const updateleadTask = await LeadMaster.findByIdAndUpdate(leadObjectId, {
      $push: {
        activityLog: {
          submissionDate: taskDetails.submissionDate,
          submittedUser: taskDetails.allocatedTo,
          submissiondoneByModel: taskDetails.allocatedtomodel,

          remarks: taskDetails.taskDescription,
          taskBy: taskDetails.taskName,
          taskClosed: true

        }
      },
      $set: { taskfromFollowup: false }

    })
    if (updateleadTask) {
      return res.status(201).json({ message: "submitted succesfully" })
    } else {
      return res.status(404).json({ message: "something went wrong" })
    }
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const GetrespectedprogrammingLead = async (req, res) => {
  try {
    const { userid, branchSelected } = req.query
    const userObjectId = new mongoose.Types.ObjectId(userid)
    const branchObjectId = new mongoose.Types.ObjectId(branchSelected)


    const query = {
      $and: [
        { "activityLog.taskallocatedTo": userObjectId },
        { "activityLog.taskTo": { $in: ["demo", "programming", "testing-&-implementation", "coding-&-testing", "software-services", "customermeet", "training"] } }
      ],
      leadBranch: branchObjectId
    }

    const selectedfollowup = await LeadMaster.find(query).populate({ path: "customerName", select: "customerName" }).lean()
    const taskLeads = []
    for (const lead of selectedfollowup) {

      const matchedallocation = lead.activityLog.filter((item) => item?.taskallocatedTo?.equals(userid) && item?.taskTo !== "followup");

      if (
        !lead.leadByModel || !mongoose.models[lead.leadByModel] ||
        !matchedallocation[0].taskallocatedToModel || !mongoose.models[matchedallocation[0].taskallocatedToModel] ||
        !matchedallocation[0].taskallocatedByModel || !mongoose.models[matchedallocation[0].taskallocatedByModel]
      ) {
        console.error(`Model ${lead.leadByModel}, ${matchedallocation[0].taskallocatedToModel}, or ${matchedallocation[0].taskallocatedByModel} is not registered`);
        followupLeads.push(lead);
        continue;
      }

      // Populate outer fields
      const leadByModel = mongoose.model(lead.leadByModel);
      const allocatedToModel = mongoose.model(matchedallocation[0].taskallocatedToModel);
      const allocatedByModel = mongoose.model(matchedallocation[0].taskallocatedByModel);

      const populatedLeadBy = await leadByModel.findById(lead.leadBy).select("name").lean();
      const populatedAllocatedTo = await allocatedToModel.findById(matchedallocation[0].taskallocatedTo).select("name").lean();
      const populatedAllocatedBy = await allocatedByModel.findById(matchedallocation[0].taskallocatedBy).select("name").lean();

      // Populate activityLog (submittedUser, etc.)
      const populatedActivityLog = await Promise.all(
        lead.activityLog.map(async (log) => {
          let populatedSubmittedUser = null;
          let populatedTaskAllocatedTo = null;

          if (log.submittedUser && log.submissiondoneByModel && mongoose.models[log.submissiondoneByModel]) {
            const model = mongoose.model(log.submissiondoneByModel);
            populatedSubmittedUser = await model.findById(log.submittedUser).select("name").lean();
          }

          if (log.taskallocatedTo && log.taskallocatedToModel && mongoose.models[log.taskallocatedToModel]) {
            const model = mongoose.model(log.taskallocatedToModel);
            populatedTaskAllocatedTo = await model.findById(log.taskallocatedTo).select("name").lean();
          }

          return {
            ...log,
            submittedUser: populatedSubmittedUser || log.submittedUser,
            taskallocatedTo: populatedTaskAllocatedTo || log.taskallocatedTo,
          };
        })
      );
      taskLeads.push({
        ...lead,
        leadBy: populatedLeadBy || lead.leadBy,
        allocatedTo: populatedAllocatedTo || lead.allocatedTo,
        allocatedBy: populatedAllocatedBy || lead.allocatedBy,
        activityLog: populatedActivityLog,

      });
    }


    return res.status(201).json({ messge: "leadfollowup found", data: taskLeads })

  } catch (error) {
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
      !selectedLead.leadByModel ||
      !mongoose.models[selectedLead.leadByModel]

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
      const assignedModel = mongoose.model(selectedLead.leadByModel)


      const populatedLeadBy = await assignedModel
        .findById(selectedLead.leadBy)
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
          !lead.leadByModel ||
          !mongoose.models[lead.leadByModel]
        ) {
          console.error(
            `Model ${lead.leadByModel} is not registered`
          )
          return lead // Return lead as-is if model is invalid
        }

        // Fetch the referenced document manually
        const assignedModel = mongoose.model(lead.leadByModel)
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
