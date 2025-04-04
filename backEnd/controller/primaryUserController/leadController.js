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
    console.log("cstomername", customerName)

    const leadDate = new Date()
    const lastLead = await LeadId.findOne().sort({ leadId: -1 })

    // Generate new leadId
    let newLeadId = "00001" // Default if no leads exist

    if (lastLead) {
      const lastId = parseInt(lastLead.leadId, 10) // Convert to number
      newLeadId = String(lastId + 1).padStart(5, "0") // Convert back to 5-digit string
    }
    let assignedtoleadModel = null // Determine dynamically
    // Check if leadBy exists in Staff or Admin collection
    const isStaff = await Staff.findById(leadBy).lean()
    if (isStaff) {
      assignedtoleadModel = "Staff"
    } else {
      const isAdmin = await Admin.findById(leadBy).lean()
      if (isAdmin) {
        assignedtoleadModel = "Admin"
      }
    }

    if (!assignedtoleadModel) {
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
      assignedtoleadModel, // Now set dynamically
      netAmount: Number(netAmount),
      allocatedTo,
      leadFor:selectedtableLeadData
    })
    await lead.save()
    const leadidonly = new LeadId({
      leadId: newLeadId,
      assignedtoleadModel // Now set dynamically
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
    console.log(Status)
    if (Status === "Pending") {
      const pendingLeads = await LeadMaster.find({
        allocatedTo: null
      })
        .populate({ path: "customerName", select: "customerName" })
        .lean()

      const populatedLeads = await Promise.all(
        pendingLeads.map(async (lead) => {
          if (
            !lead.assignedtoleadModel ||
            !mongoose.models[lead.assignedtoleadModel]
          ) {
            console.error(`Model ${lead.assignedtoleadModel} is not registered`)
            return lead // Return lead as-is if model is invalid
          }

          // Fetch the referenced document manually
          const assignedModel = mongoose.model(lead.assignedtoleadModel)
          const populatedLeadBy = await assignedModel
            .findById(lead.leadBy)
            .select("name")

          return { ...lead, leadBy: populatedLeadBy } // Merge populated data
        })
      )
      if (populatedLeads) {
        return res
          .status(200)
          .json({ message: "pending leads found", data: populatedLeads })
      }
    } else if (Status === "Approved") {
    }
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
