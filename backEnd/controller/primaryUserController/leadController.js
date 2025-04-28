import LeadMaster from "../../model/primaryUser/leadmasterSchema.js"
import mongoose from "mongoose"
import models from "../../model/auth/authSchema.js"
const { Staff, Admin } = models
import LeadId from "../../model/primaryUser/leadIdSchema.js"
import Service from "../../model/primaryUser/servicesSchema.js"
export const LeadRegister = async (req, res) => {
  try {
    const { leadData, selectedtableLeadData } = req.body

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
      leadBy
    } = leadData

    // return

    const leadDate = new Date()
    const lastLead = await LeadId.findOne().sort({ leadId: -1 })

    // Generate new leadId
    let newLeadId = "00001" // Default if no leads exist

    if (lastLead) {
      const lastId = parseInt(lastLead.leadId, 10) // Convert to number
      newLeadId = String(lastId + 1).padStart(5, "0") // Convert back to 5-digit string
    }
    let assignedtoleadByModel = null // Determine dynamically
    // Check if leadBy exists in Staff or Admin collection
    const isStaff = await Staff.findById(leadBy).lean()
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
      remark,
      leadBy,
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
      assignedtoleadByModel // Now set dynamically
    })
    await leadidonly.save()
    res.status(201).json({
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

    if (!docID) {
      return res.status(400).json({ message: "Lead Id is required" })
    }
    const updatedLead = await LeadMaster.findByIdAndUpdate(objectId, {
      ...data,
      leadFor: leadData
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
export const GetallLead = async (req, res) => {
  try {
    const { Status } = req.query
    if (Status === "Pending") {
      const pendingLeads = await LeadMaster.find({
        allocatedTo: null
      })
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
      const approvedAllocatedLeads = await LeadMaster.find({
        allocatedTo: { $ne: null }
      })
        .populate({ path: "customerName", select: "customerName" })
        .lean()
      const populatedApprovedLeads = await Promise.all(
        approvedAllocatedLeads.map(async (lead) => {
          if (
            !lead.assignedtoleadByModel ||
            !mongoose.models[lead.assignedtoleadByModel] ||
            !lead.allocatedToModel ||
            !mongoose.models[lead.allocatedToModel]
          ) {
            console.error(
              `Model ${lead.assignedtoleadByModel} is not registered`
            )
            console.error(`Model ${lead.allocatedToModel} is not registered`)

            return lead // Return lead as-is if model is invalid
          }

          // Fetch the referenced document manually

          const assignedModel = mongoose.model(lead.assignedtoleadByModel)
          const allocatedModel = mongoose.model(lead.allocatedToModel)
          const populatedLeadBy = await assignedModel
            .findById(lead.leadBy)
            .select("name")
          const populatedAllocates = await allocatedModel
            .findById(lead.allocatedTo)
            .select("name")
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
            nextfollowUpDate:formData.nextfollowUpDate,
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
    const { allocationpending } = req.query

    const leadAllocationData = req.body
    let allocatedToModel
    const isStaff = await Staff.find({ _id: leadAllocationData.allocatedTo })
    if (isStaff) {
      allocatedToModel = "Staff"
    } else {
      const isAdmin = await Admin.find({ _id: leadAllocationData.allocatdTo })
      if (isAdmin) {
        allocatedToModel = "Admin"
      }
    }
    if (!allocatedToModel) {
      return res.status(400).json({ message: "Invalid allocated reference" })
    }
    const updatedLead = await LeadMaster.findByIdAndUpdate(
      {
        _id: leadAllocationData._id
      },
      { allocatedTo: leadAllocationData.allocatedTo, allocatedToModel },
      { new: true }
    )
    if (allocationpending && updatedLead) {
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
    } else {
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
          // Convert the item to a plain object and then replace the ID with the populated object
          // const plainItem = item.toObject ? item.toObject() : { ...item._doc }
          // console.log("IT", plainItem)
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

      const populatedApprovedLead = {
        ...selectedLead.toObject(), // convert Mongoose doc to plain object
        leadBy: populatedLeadBy,
        allocatedTo: populatedAllocates
      }

      if (populatedApprovedLead) {
        return res
          .status(200)
          .json({ message: "matched lead found", data: populatedApprovedLead })
      }
    }
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
