import LeadMaster from "../../model/primaryUser/leadmasterSchema.js"
import mongoose from "mongoose"
import models from "../../model/auth/authSchema.js"
const { Staff, Admin } = models
import Task from "../../model/primaryUser/taskSchema.js"
import LeadId from "../../model/primaryUser/leadIdSchema.js"
import Service from "../../model/primaryUser/servicesSchema.js"
import { formatDate } from "../../../frontend/src/utils/dateUtils.js"
export const LeadRegister = async (req, res) => {
  try {
    const { leadData, selectedtableLeadData, role } = req.body
    // return
    const {
      customerName,
      mobile,
      phone,
      email,
      location,
      pincode,
      trade,
      remark,
      dueDate,
      taxAmount,
      taxableAmount,
      netAmount,
      partner,
      allocationType = null,
      selfAllocation,
      leadBy,
      leadBranch
    } = leadData


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
    const session = await mongoose.startSession()
    session.startTransaction()
    const activityLog = [{
      submissionDate: leadDate,
      submittedUser: leadBy,
      submissiondoneByModel: leadByModel,
      remarks: remark,
      taskBy: "lead"
    }]
    if (allocationType) {
      activityLog.push({
        submissionDate: leadDate,
        submittedUser: leadBy,
        submissiondoneByModel: leadByModel,
        taskallocatedBy: leadBy,
        taskallocatedByModel: leadByModel,
        taskallocatedTo: leadBy,
        taskallocatedToModel: leadByModel,
        remarks: remark,
        taskBy: "allocated",
        taskTo: allocationType,
        ...(allocationType === "followup" && { followupClosed: false }),
        taskfromFollowup: false,
        allocationDate: leadDate
      })
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
      dueDate,
      trade,

      partner,
      leadBranch,
      remark,
      leadBy,
      leadByModel, // Now set dynamically
      taxAmount: Number(taxAmount),
      taxableAmount: Number(taxableAmount),
      netAmount: Number(netAmount),
      balanceAmount: Number(netAmount),
      selfAllocation: selfAllocation,
      ...(allocationType && { allocationType }),
      ...(selfAllocation && { selfAllocationType: allocationType, selfAllocationDueDate: dueDate }),
      activityLog

    })
    selectedtableLeadData.forEach((item) =>
      lead.leadFor.push({
        productorServiceId: item.productorServiceId,
        productorServicemodel: item.itemType,
        licenseNumber: item.licenseNumber,
        productPrice: item.productPrice,
        hsn: item.hsn,
        netAmount: item.netAmount,
        price: item.price
      })
    )
    await lead.save({ session })
    const leadidonly = new LeadId({
      leadId: newLeadId,
      leadBy,
      leadByModel // Now set dynamically
    })
    await leadidonly.save({ session })
    await session.commitTransaction()
    session.endSession()
    res.status(200).json({
      success: true,
      message: "Lead created successfully"
    })
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const Checkexistinglead = async (req, res) => {
  try {
    const { leadData, role, selectedleadlist } = req.query

    const productIds = selectedleadlist.map((item) => item.productorServiceId)

    const [customerLeads, anyLeads] = await Promise.all([
      LeadMaster.find(
        {
          customerName: leadData.customerName,
          "leadFor.productorServiceId": { $in: productIds }
        },
        { leadFor: 1, customerName: 1, leadId: 1 }
      ).populate({ path: "customerName", select: "customerName" }),

      LeadMaster.exists({ customerName: leadData.customerName })
    ]);


    const existingProductIds = customerLeads.flatMap(lead => lead.leadFor.map(item => item.productorServiceId.toString()))
    const duplicateProducts = productIds.filter(id => existingProductIds.includes(id))


    if (duplicateProducts.length > 0) {
      // Same customer + same product
      return res
        .status(200)
        .json({ message: "This customer already has a lead with the same product.", exists: true, eligible: false });
    } else if (anyLeads) {
      // Same customer + different products
      return res
        .status(200)
        .json({ message: "This customer already has a lead, but with different product(s).", exists: false });
    } else {
      // No lead at all for this customer
      return res
        .status(200)
        .json({ message: "No existing lead for this customer. Safe to create new lead.", exists: false });
    }
    // return res.status(2001).json({ message: "Already a lead with same product" })




  } catch (error) {
    console.log("error:", error)
    return res.status(500).json({ message: "Internal server error" })

  }
}
export const GetallTask = async (req, res) => {
  try {
    const tasks = await Task.find({})
    if (tasks) {

      return res.status(200).json({ message: "Task found", data: tasks })
    } else {
      return res.status(404).json({ message: "NO tasks found" })
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" })
  }

}
export const TaskDelete = async (req, res) => {
  try {
    const { id } = req.query
    const result = await Task.findByIdAndDelete({ _id: id })
    if (result) {
      return res.status(200).json({ message: "Deleted successfully" })
    } else {
      return res.status(404).json({ message: "cant deletet" })

    }

  } catch (error) {
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const TaskEdit = async (req, res) => {
  try {
    const { id } = req.query
    const formData = req.body
    const result = await Task.findByIdAndUpdate(id, { taskName: formData.task }, { new: true })
    if (result) {
      return res.status(200).json({ message: "Deleted succesfully" })
    } else {
      return res.status(404).json(404).json({ message: "cant find task" })
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const TaskRegistration = async (req, res) => {
  try {
    const formData = req.body
    const existingItem = await Task.findOne({ taskName: formData.task, code: formData.task })
    if (existingItem) {
      return res.status(400).json({ message: "Task is already registere" })
    }


    // Create and save new item
    const collection = new Task({
      taskName: formData.task
    })
    await collection.save()

    res.status(200).json({
      status: true,
      message: "Task created successfully",
      data: collection
    })
  } catch (error) {
    return res.status(500).json({ message: "internal server error" })
  }


}
export const UpdateLeadRegister = async (req, res) => {
  try {
    const { data, leadData } = req.body

    // return
    const { docID } = req.query
    const objectId = new mongoose.Types.ObjectId(docID)

    const mappedleadData = leadData.map((item) => {
      return {
        licenseNumber: item.licenseNumber,
        productorServiceId: item.productorServiceId,
        productorServicemodel: item.itemType,
        price: item.price,
        productPrice: Number(item.productPrice),
        hsn: Number(item.hsn),
        netAmount: Number(item.netAmount)
      }
    })
    const matchedDoc = await LeadMaster.findOne({ _id: objectId })
    if (data.selfAllocation) {
      let leadByModel
      const isStaff = await Staff.findOne({ _id: leadData.leadBy })
      if (isStaff) {
        leadByModel = "Staff"
      } else {
        const isAdmin = await Admin.findOne({ _id: leadData.leadBy })
        if (isAdmin) {
          leadByModel = "Admin"
        }
      }

      if (!matchedDoc) {
        return res.status(404).json({ message: "Lead not found" })
      }
      if (matchedDoc.activityLog.length === 1 || matchedDoc.activityLog.length === 2) {
        const newActivityData = {
          submissionDate: leadData.leadDate,
          submittedUser: leadData.leadBy,
          submissiondoneByModel: leadByModel,
          taskallocatedBy: leadBy,
          taskallocatedByModel: leadByModel,
          taskallocatedTo: leadBy,
          taskallocatedToModel: leadByModel,
          remarks: leadData.remark,
          taskBy: "allocated",
          taskTo: leadData.allocationType,
          taskfromFollowup: false
        }


        let updatedLead
        if (matchedDoc.activityLog.length === 1) {
          updatedLead = await LeadMaster.findByIdAndUpdate(objectId,
            {
              ...data,
              taxableAmount,
              taxAmount,
              netAmount,
              balanceAmount,
              // selfAllocationDate:

              leadFor: mappedleadData,
              $push: {
                activityLog: {
                  newActivityData
                }
              }
            }
          )

        } else if (matchedDoc.activityLog.length === 2) {
          //update last entry in activitylog
          const lastIndex = matchedDoc.activityLog.length - 1
          //build the path to the last element in the activitylog array
          const updatedPath = `activityLog.${lastIndex}`
          updatedLead = await LeadMaster.findByIdAndUpdate(objectId, { ...data, leadFor: mappedleadData, $set: { [updatedPath]: newActivityData } })
        }

        if (!updatedLead) {
          return res.status(404).json({ message: "Lead not found" })
        }
      } else if (matchedDoc.activityLog.length > 2) {
        updatedLead = await LeadMaster.findByIdAndUpdate(objectId, { ...data, leadFor: mappedleadData })
        if (!updatedLead) {
          return res.status(404).json({ message: "Lead not found" });
        }
      }


    } else {
      let updatedLead
      const { allocationType, ...restData } = data

      if (matchedDoc.activityLog.length > 2) {
        return res.status(404).json({ message: "Cant change to Allocated To Other this leads makes some tasks" })
      } else if (matchedDoc.activityLog.length === 2) {
        // updatedLead = await LeadMaster.findByIdAndUpdate(objectId, {
        //   ...restData,
        //   allocationType: "lead",
        //   leadFor: mappedleadData
        // })
        let lead = await LeadMaster.findById(objectId);

        if (!lead) {
          throw new Error("Lead not found");
        }

        // Remove the second index from activityLog
        lead.activityLog.splice(1, 1); // removes index 1

        // Update the rest of the data
        lead.allocationType = "lead";
        lead.leadFor = mappedleadData;

        // Add any other fields from restData
        Object.assign(lead, restData);

        // Save the updated document
        updatedLead = await lead.save();


      } else if (matchedDoc.activityLog.length === 1) {

        updatedLead = await LeadMaster.findByIdAndUpdate(objectId, {
          ...restData,

          leadFor: mappedleadData
        })
      }

      if (!updatedLead) {
        return res.status(404).json({ message: "Lead not found" })
      }
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
    // const
    let query

    if (pendingfollowup === "true") {
      if (role === "Admin") {
        query = {

          activityLog: {
            $elemMatch: {
              taskTo: "followup",

              allocationChanged: false,
              allocatedClosed: false,
              taskClosed: false,
              followupClosed: false
            }
          },
          leadBranch: branchObjectId,
          reallocatedTo: false,
          leadLost: false,
        }
      } else {

        query = {

          activityLog: {
            $elemMatch: {
              taskTo: "followup",
              $or: [
                { submittedUser: userObjectId },
                { taskallocatedTo: userObjectId }
              ],
              allocationChanged: false,
              allocatedClosed: false,
              taskClosed: false,
              followupClosed: false
            }
          },
          leadBranch: branchObjectId,
          reallocatedTo: false,
          leadLost: false,
        }
      }

    } else if (pendingfollowup === "false") {
      if (role === "Admin") {
        query = {

          activityLog: {
            $elemMatch: {
              taskTo: "followup",
              allocationChanged: false,
              allocatedClosed: false,
              taskClosed: true,
              followupClosed: true
            }
          },
          leadBranch: branchObjectId,
          
          leadLost: false,
        }
      } else {
        query = {

          activityLog: {
            $elemMatch: {
              taskTo: "followup",
              $or: [
                { submittedUser: userObjectId },
                { taskallocatedTo: userObjectId }
              ],
              taskClosed: true

            }
          },
          leadBranch: branchObjectId,
          leadLost: false,


        }
      }


    }

    const selectedfollowup = await LeadMaster.find(query).populate({ path: "customerName", select: "customerName" }).lean()
    const followupLeads = [];

    for (const lead of selectedfollowup) {
      // const matchedallocation = lead.activityLog.filter((item) => item?.taskTo === "followup" && item?.followupClosed === false)

      const matchedAllocations = lead.activityLog
        .map((item, index) => ({ ...item, index })) // add index inside each item
        .filter((item) => item.taskTo === "followup" && (pendingfollowup === "false" ? item.followupClosed === true : item.followupClosed === false));
      const nextfollowUpDate = lead.activityLog[lead.activityLog.length - 1]?.nextFollowUpDate ?? null
      if (matchedAllocations && matchedAllocations.length > 0) {

        if (
          !lead.leadByModel || !mongoose.models[lead.leadByModel] ||
          !matchedAllocations[matchedAllocations.length - 1]?.taskallocatedToModel || !mongoose.models[matchedAllocations[matchedAllocations.length - 1]?.taskallocatedToModel] ||
          !matchedAllocations[matchedAllocations.length - 1]?.taskallocatedByModel || !mongoose.models[matchedAllocations[matchedAllocations.length - 1]?.taskallocatedByModel]
        ) {
          console.error(`Model ${lead.leadByModel}, ${matchedAllocations[matchedAllocations.length - 1].taskallocatedToModel}, or ${matchedAllocations[matchedAllocations.length - 1].taskallocatedByModel} is not registered`);
          // followupLeads.push(lead);
          // continue;
          return
        }

        // Populate outer fields
        const leadByModel = mongoose.model(lead.leadByModel);
        const allocatedToModel = mongoose.model(matchedAllocations[matchedAllocations.length - 1]?.taskallocatedToModel);
        const allocatedByModel = mongoose.model(matchedAllocations[matchedAllocations.length - 1]?.taskallocatedByModel);
        const populatedLeadBy = await leadByModel.findById(lead.leadBy).select("name").lean();
        const populatedAllocatedTo = await allocatedToModel.findById(matchedAllocations[matchedAllocations.length - 1].taskallocatedTo).select("name").lean();
        const populatedAllocatedBy = await allocatedByModel.findById(matchedAllocations[matchedAllocations.length - 1].taskallocatedBy).select("name").lean();

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

        const lastMatchedIndex =
          matchedAllocations.length > 0
            ? matchedAllocations[matchedAllocations.length - 1].index
            : -1;

        const checkneverFollowuped = !lead.activityLog
          .slice(lastMatchedIndex + 1) //gets entries *after* the last matched one
          .some((log) => !!log.nextFollowUpDate); //true if *any* has a date
        followupLeads.push({
          ...lead,
          leadBy: populatedLeadBy || lead.leadBy,
          allocatedTo: populatedAllocatedTo,
          allocatedBy: populatedAllocatedBy,
          activityLog: populatedActivityLog,
          nextFollowUpDate: nextfollowUpDate,
          neverfollowuped: checkneverFollowuped,
          currentdateNextfollowup: lead.activityLog[lead.activityLog.length - 1]?.nextFollowUpDate ? true : false,//check have nextfollowupdate
          allocatedfollowup: lead.activityLog[lead.activityLog.length - 1]?.taskfromFollowup ?? false,//to know whether the followp has task from followup
          allocatedTaskClosed: lead.activityLog[lead.activityLog.length - 1]?.allocatedClosed ?? false//to know taskfrom followp is closed or not
        });
      }


    }
    const ischekCollegueLeads = followupLeads.some((item) => item.allocatedBy._id.equals(userObjectId))

    if (followupLeads && followupLeads.length > 0) {
      return res.status(201).json({ messge: "leadfollowup found", data: { followupLeads, ischekCollegueLeads } })
    } else {
      return res.status(404).json({ message: "leadfollowp not found", data: {} })
    }


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
          taskfromFollowup: true

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
export const UpdateOrSubmittaskByfollower = async (req, res) => {
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

export const GetalltaskanalysisLeads = async (req, res) => {
  try {
    const { selectedBranch } = req.query
    const result = await LeadMaster.find({
      leadBranch: selectedBranch,
      leadClosed: false,
      reallocatedTo: false
    })
      .populate({ path: "customerName", select: "customerName" })
      .lean()

    const alltaskanalysisleads = []

    // filter leads that have more than 1 activity
    const filtered = result.filter((item) => item.activityLog.length > 1)

    for (const lead of filtered) {
      // ✅ populate all submittedUser in activityLog
      const populatedActivityLogs = []
      for (const activity of lead.activityLog) {
        if (activity.submittedUser && activity.submissiondoneByModel) {
          const SubmittedModel = mongoose.model(activity.submissiondoneByModel)
          const populatedSubmittedUser = await SubmittedModel
            .findById(activity.submittedUser)
            .select("name")
            .lean()

          populatedActivityLogs.push({
            ...activity,
            submittedUser: populatedSubmittedUser,
          })
        } else {
          populatedActivityLogs.push(activity)
        }
      }

      // ✅ find last activity and resolve allocatedTo
      const lastActivity = populatedActivityLogs[populatedActivityLogs.length - 1]

      const taskallocatedtoid = lastActivity?.taskallocatedTo
        ? lastActivity.taskallocatedTo
        : lastActivity.submittedUser?._id // careful: populated now

      const tasksubmittedmodel = lastActivity?.taskallocatedTo
        ? lastActivity.taskallocatedToModel
        : lastActivity.submissiondoneByModel

      let populatedtaskAllocatedTo = null
      if (taskallocatedtoid && tasksubmittedmodel) {
        const TaskAllocatedModel = mongoose.model(tasksubmittedmodel)
        populatedtaskAllocatedTo = await TaskAllocatedModel
          .findById(taskallocatedtoid)
          .select("name")
          .lean()
      }

      // ✅ push to final array
      alltaskanalysisleads.push({
        ...lead,
        activityLog: populatedActivityLogs,
        allocatedTo: populatedtaskAllocatedTo,
      })
    }




    if (result && result.length) {
      return res.status(200).json({ message: "lead found", data: alltaskanalysisleads })
    } else {
      return res.status(404).json({ message: "no leads founds for match", data: [] })
    }

  } catch (error) {
    console.log("error:", error)
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
      //for getting pending leads means leads not to be allocated to someone
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
        leadBranch: branchObjectId, reallocatedTo: false, $and: [
          { leadLost: { $ne: true } },
          { leadClosed: { $ne: true } }
        ], activityLog: { $exists: true, $not: { $size: 0 } },
        $expr: { $gte: [{ $size: "$activityLog" }, 2] }
      }
      const approvedAllocatedLeads = await LeadMaster.find(query)
        .populate({ path: "customerName", select: "customerName" })
        .lean()
      // const populatedApprovedLeads = await Promise.all(
      //   approvedAllocatedLeads.map(async (lead) => {
      //     const lastMatchingActivity = [...(lead.activityLog || [])]
      //       .reverse()
      //       .find(log => log.taskallocatedTo && log.taskallocatedBy);

      //     if (
      //       !lead.leadByModel ||
      //       !mongoose.models[lead.leadByModel] ||
      //       !lastMatchingActivity.taskallocatedBy || !lastMatchingActivity.taskallocatedByModel ||
      //       !lastMatchingActivity.taskallocatedTo || !lastMatchingActivity.taskallocatedToModel

      //     ) {
      //       console.error(
      //         `Model ${lead.leadByModel} is not registered`
      //       )
      //       console.error(`Model ${lastMatchingActivity.taskallocatedByModel} is not registered`)
      //       console.error(`Model ${lastMatchingActivity.taskallocatedToModel} is not registered`)

      //       return lead // Return lead as-is if model is invalid
      //     }

      //     // Fetch the referenced document manually

      //     const leadByModel = mongoose.model(lead.leadByModel)
      //     const allocatedToModel = mongoose.model(lastMatchingActivity.taskallocatedToModel)
      //     const allocatedByModel = mongoose.model(lastMatchingActivity.taskallocatedByModel)

      //     const populatedLeadBy = await leadByModel
      //       .findById(lead.leadBy)
      //       .select("name")
      //     const populatedAllocates = await allocatedToModel
      //       .findById(lastMatchingActivity.taskallocatedTo)
      //       .select("name")
      //     const populatedAllocatedBy = await allocatedByModel.findById(lastMatchingActivity.taskallocatedBy).select("name")


      //     return {
      //       ...lead,
      //       leadBy: populatedLeadBy,
      //       allocatedTo: populatedAllocates,
      //       allocatedBy: populatedAllocatedBy,
      //     }
      //   }
      //   )
      // )
      const populatedApprovedLeads = await Promise.all(
        approvedAllocatedLeads.map(async (lead) => {
          const lastMatchingActivity = [...(lead.activityLog || [])]
            .reverse()
            .find(log => log.taskallocatedTo && log.taskallocatedBy);

          if (
            !lead.leadByModel ||
            !mongoose.models[lead.leadByModel] ||
            !lastMatchingActivity?.taskallocatedBy ||
            !lastMatchingActivity?.taskallocatedByModel ||
            !lastMatchingActivity?.taskallocatedTo ||
            !lastMatchingActivity?.taskallocatedToModel
          ) {
            console.error(`Model ${lead.leadByModel} is not registered`);
            console.error(`Model ${lastMatchingActivity?.taskallocatedByModel} is not registered`);
            console.error(`Model ${lastMatchingActivity?.taskallocatedToModel} is not registered`);
            return lead;
          }

          // Fetch the referenced documents
          const leadByModel = mongoose.model(lead.leadByModel);
          const allocatedToModel = mongoose.model(lastMatchingActivity.taskallocatedToModel);
          const allocatedByModel = mongoose.model(lastMatchingActivity.taskallocatedByModel);

          const populatedLeadBy = await leadByModel.findById(lead.leadBy).select("name");
          const populatedAllocatedTo = await allocatedToModel.findById(lastMatchingActivity.taskallocatedTo).select("name");
          const populatedAllocatedBy = await allocatedByModel.findById(lastMatchingActivity.taskallocatedBy).select("name");

          // 🔹 Now populate every `submissiondonebyuser` in activityLog
          const populatedActivityLog = await Promise.all(
            (lead.activityLog || []).map(async (log) => {
              if (!log.submissiondoneByModel || !log.submissiondoneByModel) {
                return log; // skip if missing
              }

              // Make sure the model exists before querying
              if (!mongoose.models[log.submissiondoneByModel]) {
                console.error(`Model ${log.submissiondoneByModel} not registered`);
                return log;
              }

              const submissionUserModel = mongoose.model(log.submissiondoneByModel);
              const populatedSubmissionUser = await submissionUserModel
                .findById(log.submittedUser)
                .select("name");

              return {
                ...log,
                submittedUser: populatedSubmissionUser,
              };
            })
          );

          return {
            ...lead,
            leadBy: populatedLeadBy,
            allocatedTo: populatedAllocatedTo,
            allocatedBy: populatedAllocatedBy,
            activityLog: populatedActivityLog, // updated log with populated submission users
          };
        })
      );
      if (populatedApprovedLeads) {
        return res.status(200).json({
          message: "Approved leads found",
          data: populatedApprovedLeads
        })
      }
    }
  } catch (error) {
    console.log(error)
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
    if (formData.followupType === "closed") {
      await LeadMaster.updateOne(
        { _id: selectedleaddocId },
       
        {
          $set: {
            "activityLog.$[elem].reallocatedTo": true,
            "activityLog.$[elem].taskClosed": true,
            "activityLog.$[elem].followupClosed": true,
          },
        },
        {
          arrayFilters: [
            {
              "elem.taskTo": { $exists: true },
              "elem.reallocatedTo": false,
              "elem.taskClosed": false,
              "elem.followupClosed": false,
            },
          ],
        }
      );
    }

    const activityEntry = {
      submissionDate: formData.followUpDate,
      submittedUser: loggeduserid,
      submissiondoneByModel: followedByModel,
      taskBy: "followup",
      nextFollowUpDate: formData.nextfollowUpDate,
      remarks: formData.Remarks,
      taskfromFollowup: false
    };

    // Conditionally add fields only if `closed` is true
    if (formData.followupType === "closed") {
      activityEntry.taskClosed = true;
      activityEntry.followupClosed = true
      activityEntry.reallocatedTo = true;
    } else if (formData.followupType === "lost") {

      activityEntry.taskClosed = true
    }
    const updatefollowUpDate = await LeadMaster.findOneAndUpdate(
      { _id: selectedleaddocId },
      {
        $push: {
          activityLog: activityEntry,
          ...(Number(formData.recievedAmount) > 0 && {
            paymentHistory: {
              paymentDate: new Date(),
              receivedBy: loggeduserid, // change to your actual field name
              recievedModel: followedByModel,
              receivedAmount: Number(formData.recievedAmount),
            }
          })
        },
        $inc: {
          balanceAmount: -Number(formData.recievedAmount || 0), // subtract value
          totalPaidAmount: +Number(formData.recievedAmount || 0)
        },
        reallocatedTo: formData.followupType === "closed",
        leadLost: formData.followupType === "lost",


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
export const LeadClosing = async (req, res) => {
  try {
    const { leadId, allocationType, allocatedBy } = req.query
    const { formData } = req.body
    const isStaff = await Staff.find({ _id: allocatedBy })
    const isAdmin = await Admin.find({ _id: allocatedBy }
    )
    let leadClosedModel
    if (isStaff) {
      leadClosedModel = "Staff"
    } else {
      if (isAdmin) {
        leadClosedModel = "Admin"
      }
    }

    const result = await LeadMaster.updateOne(
      { _id: leadId },
      {
        $inc: { balanceAmount: -Number(formData.recievedAmount || 0) },
        leadClosed: true,
        leaClosedBy: allocatedBy,
        leadClosedModel,
        reallocatedTo: false,
        allocationType: allocationType
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "No lead found" });
    }

    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: "Balance amount not changed" });
    }

    return res.status(200).json({ message: "Lead closed successfully with payment" })

  } catch (error) {
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
      const isAdminallocatedtomodel = await Admin.findOne({ _id: selectedItem.allocatedTo })
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


    const activityLogEntry = {
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
      taskTo: allocationType,
      allocationChanged: false,
      taskfromFollowup: false
    }
    if (allocationType === "followup") {
      activityLogEntry.followupClosed = false
    }
    // return
    const updatedLead = await LeadMaster.findByIdAndUpdate(
      {
        _id: selectedItem._id
      },

      {

        $push: {
          activityLog: activityLogEntry
        },
        $set: {
          allocationType: allocationType, // Set outside the activityLog array
          reallocatedTo: false,
          dueDate: formData.allocationDate
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
    const { selectedItem, cleanedData } = req.body

    let allocatedToModel
    let allocatedByModel
    const isStaffallocatedtomodel = await Staff.findOne({ _id: selectedItem.allocatedTo })
    if (isStaffallocatedtomodel) {
      allocatedToModel = "Staff"
    } else {
      const isAdminallocatedtomodel = await Admin.findOne({ _id: selectedItem.allocatedTo })
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
        remarks: cleanedData.allocationDescription,
        allocationChanged: true,
        changeReason: cleanedData.reason,
        taskBy: "allocated",
        ...(allocationType === "followup" ? { followupClosed: false } : {}),
        taskTo: allocationType,
        taskfromFollowup: false
      };
      // Conditionally add allocationDate
      if (allocationType !== "followup") {
        matchLead.activityLog[lastIndex].allocationDate = cleanedData.allocationDate;
      }
      matchLead.allocationType = allocationType
      matchLead.allocatedTo = selectedItem.allocatedTo
      // Save the document
      await matchLead.save();

    } else if (matchLead.activityLog.length === 1) {
      // Create base activity log
      const activityLogEntry = {
        submissionDate: new Date(),
        submittedUser: allocatedBy,
        submissiondoneByModel: allocatedByModel,
        taskallocatedBy: allocatedBy,
        taskallocatedByModel: allocatedByModel,
        taskallocatedTo: selectedItem.allocatedTo,
        taskallocatedToModel: allocatedToModel,
        remarks: cleanedData.allocationDescription,
        taskBy: "allocated",
        taskTo: allocationType,
        allocationChanged: false,
        taskfromFollowup: false

      };

      // Conditionally add allocationDate
      if (allocationType !== "followup") {
        activityLogEntry.allocationDate = cleanedData.allocationDate;
        // activityLogEntry.taskfromFollowup = false
      } else if (allocationType === "followup") {
        activityLogEntry.followupClosed = false
      }
      await LeadMaster.findByIdAndUpdate(
        { _id: selectedItem._id },
        {
          $push: {
            activityLog: activityLogEntry
          },
          $set: {
            allocationType: allocationType,
            taskfromFollowup: false,
            dueDate: cleanedData.allocationDate
          }
        },
        { new: true }
      );

    } else if (matchLead.activityLog.length > 2) {
      // Find index in activityLog that matches the criteria
      const matchingIndex = matchLead.activityLog.findIndex(log =>
        log.reallocatedTo === false &&
        log.taskClosed === false &&
        // log.followupClosed === false &&
        log.allocatedClosed === false &&
        log.taskTo // ensures the field exists
      );
      const task = matchLead.activityLog[matchingIndex].taskTo
      if (task !== allocationType) {
        return res.status(409).json({ message: "Cannot change task name. It's already running.only possible to change the user" })
      }

      if (matchingIndex !== -1) {
        // ✅ Update the matched log
        matchLead.activityLog[matchingIndex].allocationChanged = true;
      }

      // Important for deep changes in arrays
      // matchLead.markModified('activityLog');
      const activityLogEntry = {
        submissionDate: new Date(),
        submittedUser: allocatedBy,
        submissiondoneByModel: allocatedByModel,
        taskallocatedBy: allocatedBy,
        taskallocatedByModel: allocatedByModel,
        taskallocatedTo: selectedItem.allocatedTo,
        taskallocatedToModel: allocatedToModel,
        remarks: cleanedData.allocationDescription,
        taskBy: "allocated",
        taskTo: allocationType,
        taskfromFollowup: false,
        taskClosed: false,
        followupClosed: false,
        allocatedClosed: false,
        allocationChanged: false

      }
      if (allocationType !== "followup") {
        activityLogEntry.allocationDate = cleanedData.allocationDate;
        // activityLogEntry.taskfromFollowup = false
      }
      matchLead.dueDate = cleanedData.allocationDate

      // Push new log
      matchLead.activityLog.push(activityLogEntry);


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
        .json({ message: "Allocate successfully", data: populatedLeads })
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
    const isReallocated = taskDetails.taskfromFollowup ? false : true
    // Build the activity log entry
    const activityLogEntry = {
      submissionDate: taskDetails.submissionDate,
      submittedUser: taskDetails.allocatedTo,
      submissiondoneByModel: taskDetails.allocatedtomodel,
      remarks: taskDetails.taskDescription,
      taskBy: taskDetails.taskName,
      taskClosed: true,
    };
    // Conditionally add `reallocated: true` to the activity log
    if (isReallocated) {
      activityLogEntry.reallocatedTo = true;
    } else {
      activityLogEntry.taskfromFollowup = true
    }
    const updateleadTask = await LeadMaster.findByIdAndUpdate(leadObjectId, {
      $push: {
        activityLog: activityLogEntry
      },
      $set: { taskfromFollowup: false, reallocatedTo: isReallocated, allocationType: isReallocated ? "reallocated" : "tasksubmitted" }

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

      if (matchedallocation && matchedallocation.length > 0) {
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
          allocatedTo: populatedAllocatedTo,
          allocatedBy: populatedAllocatedBy,
          activityLog: populatedActivityLog,

        });
      }
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
    const matchedLead = await LeadMaster.find(
      { leadBy: objectId }
    ).populate({ path: "customerName", select: "customerName" }).lean()
    // const populatedOwnLeads = await Promise.all(
    //   matchedLead.map(async (lead) => {
    //     if (
    //       !lead.leadByModel ||
    //       !mongoose.models[lead.leadByModel]
    //     ) {
    //       console.error(
    //         `Model ${lead.leadByModel} is not registered`
    //       )
    //       return lead // Return lead as-is if model is invalid
    //     }

    //     // Fetch the referenced document manually
    //     const assignedModel = mongoose.model(lead.leadByModel)
    //     const populatedLeadBy = await assignedModel
    //       .findById(lead.leadBy)
    //       .select("name")
    //     // ✅ Fix: Use lead.activityLog, not matchedLead.activityLog
    //     const lastActivity = lead.activityLog?.[lead.activityLog.length - 1];
    //     let populatedLastAllocatedTo = null;
    //     let populatedLastAllocatedBy = null

    //     if (lastActivity?.taskallocatedToModel && lastActivity?.taskallocatedTo) {
    //       const lastAssignedModel = mongoose.model(lastActivity.taskallocatedToModel);
    //       populatedLastAllocatedTo = await lastAssignedModel
    //         .findById(lastActivity.taskallocatedTo)
    //         .select("name")
    //         .lean();
    //     } else {
    //       populatedLastAllocatedTo=null

    //     }
    //     if (lastActivity?.taskallocatedByModel && lastActivity?.taskallocatedBy) {

    //       const lastAssignedModel = mongoose.model(lastActivity.taskallocatedByModel);
    //       populatedLastAllocatedBy = await lastAssignedModel
    //         .findById(lastActivity.taskallocatedBy)
    //         .select("name")
    //         .lean();
    //     } else {
    //       populatedLastAllocatedBy = null
    //     }


    //     return { ...lead, taskallocatedTo: populatedLastAllocatedTo, taskallocatedBy: populatedLastAllocatedBy, leadBy: populatedLeadBy } // Merge populated data
    //   }))
    const populatedOwnLeads = await Promise.all(
      matchedLead.map(async (lead) => {
        if (!lead.leadByModel || !mongoose.models[lead.leadByModel]) {
          console.error(`Model ${lead.leadByModel} is not registered`);
          return lead;
        }

        // Fetch leadBy name
        const assignedModel = mongoose.model(lead.leadByModel);
        const populatedLeadBy = await assignedModel
          .findById(lead.leadBy)
          .select("name")
          .lean();

        // ✅ Populate activityLog fields
        const populatedActivityLog = await Promise.all(
          (lead.activityLog || []).map(async (activity) => {
            const populatedActivity = { ...activity };

            // Populate taskallocatedTo
            if (activity.submissiondoneByModel && activity.submittedUser) {
              const model = mongoose.model(activity.submissiondoneByModel);
              populatedActivity.submittedUser = await model
                .findById(activity.submittedUser)
                .select("name")
                .lean();
            }

            // // Populate taskallocatedBy
            if (activity.taskallocatedByModel && activity.taskallocatedBy) {
              const model = mongoose.model(activity.taskallocatedByModel);
              populatedActivity.taskallocatedBy = await model
                .findById(activity.taskallocatedBy)
                .select("name")
                .lean();
            }

            // ✅ Populate submissionDoneBy
            if (activity.taskallocatedToModel && activity.taskallocatedTo) {
              const model = mongoose.model(activity.taskallocatedToModel);
              populatedActivity.taskallocatedTo = await model
                .findById(activity.taskallocatedTo)
                .select("name")
                .lean();
            }

            return populatedActivity;
          })
        );

        // ✅ Get last activity
        const lastActivity = populatedActivityLog[populatedActivityLog.length - 1];

        return {
          ...lead,
          leadBy: populatedLeadBy,
          activityLog: populatedActivityLog, // include fully populated activity logs
          taskallocatedTo: lastActivity?.taskallocatedTo || null,
          taskallocatedBy: lastActivity?.taskallocatedBy || null,
        };
      })
    );
    return res.status(200).json({ message: "lead found", data: populatedOwnLeads })

  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
