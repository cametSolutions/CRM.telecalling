import LeadMaster from "../../model/primaryUser/leadmasterSchema.js"
import LeadId from "../../model/primaryUser/leadIdSchema.js"
import Service from "../../model/primaryUser/servicesSchema.js"
export const LeadRegister = async (req, res) => {
  try {
    const leadData = req.body
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
      allocatedTo
    } = leadData

    const leadDate = new Date()
    const lastLead = await LeadId.findOne().sort({ leadId: -1 })

    // Generate new leadId
    let newLeadId = "00001" // Default if no leads exist

    if (lastLead) {
      const lastId = parseInt(lastLead.leadId, 10) // Convert to number
      newLeadId = String(lastId + 1).padStart(5, "0") // Convert back to 5-digit string
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
      allocatedTo
    })
    await lead.save()
    const leadidonly = new LeadId({
      leadId: newLeadId
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
