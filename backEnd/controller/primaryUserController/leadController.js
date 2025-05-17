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
    const { loggeduser } = req.query
    const loggeduserId = loggeduser._id
    const userObjectId = new mongoose.Types.ObjectId(loggeduserId)
    let query
    if (loggeduser.role === "Staff") {
      query = {
        allocatedTo: { $ne: null }, $or: [
          { allocatedTo: userObjectId },
          { allocatedBy: userObjectId }
        ]
      }
    } else {
      query = { allocatedTo: { $ne: null } }

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
        const populatedLeadBy = await assignedModel
          .findById(lead.leadBy)
          .select("name")
          .lean()

        const populatedAllocatedTo = await allocatedmodel
          .findById(lead.allocatedTo)
          .select("name")
          .lean()

        return { ...lead, leadBy: populatedLeadBy, allocatedTo: populatedAllocatedTo } // Merge populated data
      })
    )

    const ischekCollegueLeads = followupLeads.some((item) => item.allocatedBy.equals(userObjectId))

    return res.status(201).json({ messge: "leadfollowup found", data: { followupLeads, ischekCollegueLeads } })

  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const GetallLead = async (req, res) => {
  try {
    const { Status, userBranch, role } = req.query
    if (!Status && !role) {
      return res.status(400).json({ message: "Status or role is missing " })
    }
    let branchObjectIds
    if (Status === "Pending") {
      // const pendingLeads = await LeadMaster.find({
      //   allocatedTo: null,assignedto:objectId
      // })
      const query = { allocatedTo: null };

      if (role === "Staff") {
        const decodedbranches = JSON.parse(decodeURIComponent(userBranch))
        branchObjectIds = decodedbranches.map((branch) => new mongoose.Types.ObjectId(branch))

        query.leadBranch = { $in: branchObjectIds }
      } else {
        const decodedbranches = JSON.parse(decodeURIComponent(userBranch))
        if (decodedbranches && decodedbranches.length > 0) {
          branchObjectIds = decodedbranches.map((branch) => new mongoose.Types.ObjectId(branch))
          query.leadBranch = { $in: branchObjectIds }
        }
      }

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

      const query = { allocatedTo: { $ne: null } };

      if (role === "Staff") {
        const decodedbranches = JSON.parse(decodeURIComponent(userBranch))
        branchObjectIds = decodedbranches.map((branch) => new mongoose.Types.ObjectId(branch))

        query.leadBranch = { $in: branchObjectIds }
      } else {
        const decodedbranches = JSON.parse(decodeURIComponent(userBranch))
        if (decodedbranches && decodedbranches.length > 0) {
          branchObjectIds = decodedbranches.map((branch) => new mongoose.Types.ObjectId(branch))
          query.leadBranch = { $in: branchObjectIds }
        }
      }

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
          const populatedAllocatedBy = await allocatedbyModel(lead.allocatedBy)
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

      { allocatedTo: leadAllocationData.allocatedTo, allocatedBy, allocatedToModel,allocatedByModel },
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
    ).populate({ path: "customerName", select: "customerName" })
    return res.status(200).json({ message: "lead found", data: matchedLead })

  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
