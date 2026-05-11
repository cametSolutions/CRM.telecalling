import LeadMaster from "../../model/primaryUser/leadmasterSchema.js";
import { isValidObjectId } from "mongoose";
import util from "util";
import mongoose from "mongoose";
import models from "../../model/auth/authSchema.js";
const { Staff, Admin } = models;
import Customer from "../../model/secondaryUser/customerSchema.js";
import Task from "../../model/primaryUser/taskSchema.js";
import LeadId from "../../model/primaryUser/leadIdSchema.js";
import Service from "../../model/primaryUser/servicesSchema.js";
import getLeadMetricsForSingleDay from "../../helper/leadandtaskcount.js";
import { getCallMetricsForSingleDay } from "../../helper/callcount.js";
import { formatDate } from "../../../frontend/src/utils/dateUtils.js";
export const LeadRegister = async (req, res) => {
  try {
    const { leadData, selectedtableLeadData, role } = req.body;

    // return
    const {
      customerName,
      mobile,
      phone,
      email,
      location,
      source,
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
      leadBranch,
    } = leadData;

    const leadDate = new Date();
    const lastLead = await LeadId.findOne().sort({ leadId: -1 });

    // Generate new leadId
    let newLeadId = "00001"; // Default if no leads exist

    if (lastLead) {
      const lastId = parseInt(lastLead.leadId, 10); // Convert to number
      newLeadId = String(lastId + 1).padStart(5, "0"); // Convert back to 5-digit string
    }

    let leadByModel = null; // Determine dynamically
    // Check if leadBy exists in Staff or Admin collection

    const isStaff = await Staff.findById(leadBy).lean();

    if (isStaff) {
      leadByModel = "Staff";
    } else {
      const isAdmin = await Admin.findById(leadBy).lean();
      if (isAdmin) {
        leadByModel = "Admin";
      }
    }

    if (!leadByModel) {
      return res.status(400).json({ message: "Invalid leadBy reference" });
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    const leadtask = await Task.findOne({ taskName: "Lead" });
    let allocationtask = null;
    if (allocationType) {
      allocationtask = await Task.findOne({ taskName: "Allocation" });
    }
    const activityLog = [
      {
        submissionDate: leadDate,
        submittedUser: leadBy,
        submissiondoneByModel: leadByModel,
        remarks: remark,
        taskBy: leadtask?._id,
      },
    ];
    const allocationName = await Task.findOne({
      taskName: { $regex: new RegExp(`^${allocationType}$`, 'i') }
    });
    console.log("alocationtype", allocationType)
    if (allocationType) {
      // const allocationName = await Task.findOne({ taskName: allocationType });

      activityLog.push({
        submissionDate: leadDate,
        submittedUser: leadBy,
        submissiondoneByModel: leadByModel,
        taskallocatedBy: leadBy,
        taskallocatedByModel: leadByModel,
        taskallocatedTo: leadBy,
        taskallocatedToModel: leadByModel,
        remarks: remark,
        taskBy: allocationtask?._id,
        taskTo: allocationName?.taskName.toLowerCase(),
        taskId: allocationName?._id,
        allocationChanged: false,
        followupClosed: false,
        taskfromFollowup: false,
        allocationDate: dueDate,
      });
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
      source,
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
      ...(allocationType && { allocationType: allocationName?._id }),
      ...(selfAllocation && {
        selfAllocationType: allocationName?._id,
        selfAllocationDueDate: dueDate,
      }),
      activityLog,
    });
    selectedtableLeadData.forEach((item) =>
      lead.leadFor.push({
        productorServiceId: item.productorServiceId,
        productorServicemodel: item.itemType,
        licenseNumber: item.licenseNumber,
        productPrice: item.productPrice,
        hsn: item.hsn,
        netAmount: item.netAmount,
        price: item.price,
      })
    );
    await lead.save({ session });
    const leadidonly = new LeadId({
      leadId: newLeadId,
      leadBy,
      assignedtoleadByModel: leadByModel, // Now set dynamically
    });
    await leadidonly.save({ session });
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({
      success: true,
      message: "Lead created successfully",
    });
  } catch (error) {
    console.log("error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const Checkexistinglead = async (req, res) => {
  try {
    const { leadData, role, selectedleadlist } = req.query;

    const productIds = selectedleadlist
      .filter(item => item.productorServiceId && item.productorServiceId !== "")
      .map(item => item.productorServiceId);


    const [customerLeads, anyLeads] = await Promise.all([
      LeadMaster.find(
        {
          customerName: leadData.customerName,
          "leadFor.productorServiceId": { $in: productIds },
        },
        { leadFor: 1, customerName: 1, leadId: 1 }
      ).populate({ path: "customerName", select: "customerName" }),

      LeadMaster.exists({ customerName: leadData.customerName }),
    ]);

    const existingProductIds = customerLeads.flatMap((lead) =>
      lead.leadFor.map((item) => item.productorServiceId.toString())
    );
    const duplicateProducts = productIds.filter((id) =>
      existingProductIds.includes(id)
    );

    if (duplicateProducts.length > 0) {
      console.log("duplicate found")
      // Same customer + same product
      return res.status(200).json({
        message: "This customer already has a lead with the same product.",
        exists: true,
        eligible: false,
      });
    } else if (anyLeads) {
      console.log("have lead with different produts")
      // Same customer + different products
      return res.status(200).json({
        message:
          "This customer already has a lead, but with different product(s).",
        exists: false,
      });
    } else {
      // No lead at all for this customer
      return res.status(200).json({
        message: "No existing lead for this customer. Safe to create new lead.",
        exists: false,
      });
    }
    // return res.status(2001).json({ message: "Already a lead with same product" })
  } catch (error) {
    console.log("error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const getAlltasktoTarget = async (req, res) => {
  try {

    const tasks = await Task.find({});
    if (tasks) {
      return res.status(200).json({ message: "Task found", data: tasks });
    } else {
      return res.status(404).json({ message: "NO tasks found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}
export const GetallTask = async (req, res) => {
  try {
    const { istaskregistration = false } = req.query
    let query = {}
    if (istaskregistration === "false" || istaskregistration === false) {
      query = { listed: true }
    }
    const tasks = await Task.find(query);
    if (tasks) {
      return res.status(200).json({ message: "Task found", data: tasks });
    } else {
      return res.status(404).json({ message: "NO tasks found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const TaskDelete = async (req, res) => {
  try {
    const { id } = req.query;
    const result = await Task.findByIdAndDelete({ _id: id });
    if (result) {
      return res.status(200).json({ message: "Deleted successfully" });
    } else {
      return res.status(404).json({ message: "cant deletet" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const TaskEdit = async (req, res) => {
  try {
    const { id } = req.query;
    const formData = req.body;
    const result = await Task.findByIdAndUpdate(
      id,
      { taskName: formData.task },
      { new: true }
    );
    if (result) {
      return res.status(200).json({ message: "Deleted succesfully" });
    } else {
      return res.status(404).json(404).json({ message: "cant find task" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const UpdatereceivedAmount = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { leadDocId, index } = req.query;
    const editedData = req.body;

    const paymentIndex = Number(index);

    const lead = await LeadMaster.findById(leadDocId).session(session);
    if (!lead) throw new Error("Lead not found");

    if (
      Number.isNaN(paymentIndex) ||
      paymentIndex < 0 ||
      paymentIndex >= lead.paymentHistory.length
    ) {
      throw new Error("Invalid payment history index");
    }

    const payment = lead.paymentHistory[paymentIndex];
    if (!payment) throw new Error("Payment record not found");

    const newReceived = Number(editedData.receivedAmount);
    if (Number.isNaN(newReceived) || newReceived < 0) {
      throw new Error("Invalid received amount");
    }

    const oldReceived = Number(payment.receivedAmount || 0);
    const diff = newReceived - oldReceived;

    payment.receivedAmount = newReceived;
    payment.paymentDate = editedData.paymentDate;

    if (Array.isArray(payment.paymentEntries)) {
      if (payment.paymentEntries.length === 1) {
        payment.paymentEntries[0].receivedAmount = newReceived;
      } else {
        const totalOldEntryReceived = payment.paymentEntries.reduce(
          (sum, entry) => sum + Number(entry.receivedAmount || 0),
          0
        );

        payment.paymentEntries.forEach((entry) => {
          const oldEntryReceived = Number(entry.receivedAmount || 0);
          const updatedEntryReceived =
            totalOldEntryReceived > 0
              ? (oldEntryReceived / totalOldEntryReceived) * newReceived
              : 0;

          entry.receivedAmount = Number(updatedEntryReceived.toFixed(2));
        });

        const sumExceptLast = payment.paymentEntries
          .slice(0, -1)
          .reduce((sum, entry) => sum + Number(entry.receivedAmount || 0), 0);

        payment.paymentEntries[payment.paymentEntries.length - 1].receivedAmount =
          Number((newReceived - sumExceptLast).toFixed(2));
      }
    }

    lead.totalPaidAmount = Number(lead.totalPaidAmount || 0) + diff;
    if (lead.totalPaidAmount < 0) {
      lead.totalPaidAmount = 0;
    }

    for (let i = paymentIndex;i < lead.paymentHistory.length;i++) {
      const currentPayment = lead.paymentHistory[i];
      if (!Array.isArray(currentPayment.paymentEntries)) continue;

      for (let j = 0;j < currentPayment.paymentEntries.length;j++) {
        const currentEntry = currentPayment.paymentEntries[j];
        const currentNetAmount = Number(currentEntry.netAmount || 0);
        const currentReceived = Number(currentEntry.receivedAmount || 0);

        if (i === 0) {
          currentEntry.balanceAmount = currentNetAmount - currentReceived;
        } else {
          const prevPayment = lead.paymentHistory[i - 1];

          const prevMatchingEntry = (prevPayment?.paymentEntries || []).find(
            (entry) =>
              String(entry.productorServiceId) ===
              String(currentEntry.productorServiceId)
          );

          const previousBalance = Number(
            prevMatchingEntry?.balanceAmount ?? currentNetAmount
          );

          currentEntry.balanceAmount = previousBalance - currentReceived;
        }

        if (currentEntry.balanceAmount < 0) {
          currentEntry.balanceAmount = 0;
        }
      }

      currentPayment.receivedAmount = (currentPayment.paymentEntries || []).reduce(
        (sum, entry) => sum + Number(entry.receivedAmount || 0),
        0
      );
    }

    const lastPayment = lead.paymentHistory[lead.paymentHistory.length - 1];
    if (lastPayment?.paymentEntries?.length) {
      const totalLastBalance = lastPayment.paymentEntries.reduce(
        (sum, entry) => sum + Number(entry.balanceAmount || 0),
        0
      );
      lead.balanceAmount = totalLastBalance;
    } else {
      lead.balanceAmount = 0;
    }

    if (lead.balanceAmount < 0) {
      lead.balanceAmount = 0;
    }

    await lead.save({ session });
    await session.commitTransaction();

    return res.status(200).json({
      message: "Payment updated successfully",
      data: lead,
    });
  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};
// export const UpdatereceivedAmount = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { leadDocId, index } = req.query;
//     const editedData = req.body;

//     const paymentIndex = Number(index);

//     const lead = await LeadMaster.findById(leadDocId).session(session);
//     if (!lead) throw new Error("Lead not found");

//     if (
//       Number.isNaN(paymentIndex) ||
//       paymentIndex < 0 ||
//       paymentIndex >= lead.paymentHistory.length
//     ) {
//       throw new Error("Invalid payment history index");
//     }

//     const payment = lead.paymentHistory[paymentIndex];
//     if (!payment) throw new Error("Payment record not found");

//     const newReceived = Number(editedData.receivedAmount || 0);
//     if (Number.isNaN(newReceived) || newReceived < 0) {
//       throw new Error("Invalid received amount");
//     }

//     payment.receivedAmount = newReceived;
//     payment.paymentDate = editedData.paymentDate;

//     if (Array.isArray(payment.paymentEntries)) {
//       payment.paymentEntries.forEach((entry) => {
//         entry.receivedAmount = newReceived;
//       });
//     }

//     for (let i = 0; i < lead.paymentHistory.length; i++) {
//       const currentPayment = lead.paymentHistory[i];

//       if (!Array.isArray(currentPayment.paymentEntries)) continue;

//       for (let j = 0; j < currentPayment.paymentEntries.length; j++) {
//         const currentEntry = currentPayment.paymentEntries[j];
//         const netAmount = Number(currentEntry.netAmount || 0);
//         const currentReceived = Number(currentEntry.receivedAmount || 0);

//         if (i === 0) {
//           currentEntry.balanceAmount = netAmount - currentReceived;
//         } else {
//           const prevPayment = lead.paymentHistory[i - 1];
//           const prevEntry = prevPayment?.paymentEntries?.[j];

//           const prevBalance = Number(
//             prevEntry?.balanceAmount ?? netAmount
//           );

//           currentEntry.balanceAmount = prevBalance - currentReceived;
//         }

//         if (currentEntry.balanceAmount < 0) {
//           currentEntry.balanceAmount = 0;
//         }
//       }

//       currentPayment.receivedAmount = currentPayment.paymentEntries.reduce(
//         (sum, entry) => sum + Number(entry.receivedAmount || 0),
//         0
//       );
//     }

//     lead.totalPaidAmount = lead.paymentHistory.reduce((sum, paymentRow) => {
//       return sum + Number(paymentRow.receivedAmount || 0);
//     }, 0);

//     const allEntries = lead.paymentHistory.flatMap(
//       (paymentRow) => paymentRow.paymentEntries || []
//     );

//     const lastEntry = allEntries.length ? allEntries[allEntries.length - 1] : null;
//     lead.balanceAmount = Number(lastEntry?.balanceAmount || 0);

//     if (lead.totalPaidAmount < 0) lead.totalPaidAmount = 0;
//     if (lead.balanceAmount < 0) lead.balanceAmount = 0;

//     await lead.save({ session });
//     await session.commitTransaction();

//     res.status(200).json({
//       message: "Payment updated successfully",
//       data: lead,
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     res.status(500).json({ message: error.message });
//   } finally {
//     session.endSession();
//   }
// };
// export const UpdatereceivedAmount = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { leadDocId, index } = req.query;
// console.log("indexxxxxxx",index)

//     const editedData = req.body;

//     // // 1️⃣ Fetch lead
//     const lead = await LeadMaster.findById(leadDocId).session(session);
//     if (!lead) throw new Error("Lead not found");



//     const payment = lead.paymentHistory[index];

//     const newReceived = Number(editedData.receivedAmount);
//     const oldReceived = Number(payment.receivedAmount || 0);
//     const diff = newReceived - oldReceived;

//     // update edited payment row
//     payment.receivedAmount = newReceived;
//     payment.paymentDate = editedData.paymentDate;

//     // update lead totals
//     lead.totalPaidAmount = Number(lead.totalPaidAmount || 0) + diff;
//     lead.balanceAmount = Number(lead.balanceAmount || 0) - diff;

//     if (lead.totalPaidAmount < 0) lead.totalPaidAmount = 0;
//     if (lead.balanceAmount < 0) lead.balanceAmount = 0;

//     // recalculate running balances from edited index onward
//     for (let i = index;i < lead.paymentHistory.length;i++) {
//       const currentPayment = lead.paymentHistory[i];

//       if (!Array.isArray(currentPayment.paymentEntries)) continue;

//       currentPayment.receivedAmount = Number(currentPayment.receivedAmount || 0);

//       for (let j = 0;j < currentPayment.paymentEntries.length;j++) {
//         const entry = currentPayment.paymentEntries[j];
//         const netAmount = Number(entry.netAmount || 0);
//         const entryReceived = Number(entry.receivedAmount || 0);

//         if (i === 0) {
//           entry.balanceAmount = netAmount - entryReceived;
//         } else {
//           const prevPayment = lead.paymentHistory[i - 1];
//           const prevEntry = prevPayment?.paymentEntries?.[j];

//           const previousBalance = Number(
//             prevEntry?.balanceAmount ?? netAmount
//           );

//           entry.balanceAmount = previousBalance - entryReceived;
//         }

//         if (entry.balanceAmount < 0) entry.balanceAmount = 0;
//       }
//     }

//     await lead.save({ session });
//     await session.commitTransaction();

//     res.status(200).json({
//       message: "Payment updated successfully",
//       data: lead,
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     res.status(500).json({ message: error.message });
//   } finally {
//     session.endSession();
//   }
// };
export const UpdatepaymentVerification = async (req, res) => {
  try {
    const { leadId, index, isverified, verifiedBy } = req.body;

    // Find the document first
    const lead = await LeadMaster.findOne({ _id: leadId });
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    const isStaff = await Staff.findOne({ _id: verifiedBy });
    let verifiedModel;
    if (isStaff) {
      verifiedModel = "Staff";
    } else {
      const isAdmin = await Admin.findOne({ _id: verifiedBy });
      if (isAdmin) {
        verifiedModel = "Admin";
      }
    }
    // Validate index range
    if (index < 0 || index >= lead.paymentHistory.length) {
      return res.status(400).json({ message: "Invalid index" });
    }
    console.log("leaddddd", lead)
    console.log("index", index)
    // ✅ Update that specific paymentHistory element
    lead.paymentHistory[index].paymentVerified = isverified;
    lead.paymentHistory[index].paymentVerifiedBy = verifiedBy;
    lead.paymentHistory[index].paymentverifiedModel = verifiedModel;
    lead.paymentHistory[index].verifiedAt = new Date();

    // ✅ Check if all payments are verified
    const allVerified = lead.paymentHistory.every(
      (p) => p.paymentVerified === true
    );

    // ✅ Update parent field
    lead.paymentVerified =
      allVerified && Number(lead.totalPaidAmount) === Number(lead.netAmount);

    await lead.save();
    return res.status(204).json({ message: "successfully done" });
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const Getallsalesfunnels = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = new Date(startDate);
    const end = new Date(endDate);


    // 1️⃣ Aggregation Pipeline
    const result = await LeadMaster.aggregate([
      // Unwind activityLog
      { $unwind: "$activityLog" },

      // Filter by date range
      {
        $match: {
          "activityLog.submissionDate": {
            $gte: start,
            $lte: end
          }
        }
      },

      // Classify funnel stage
      {
        $addFields: {
          stage: {
            $switch: {
              branches: [
                {
                  case: {
                    $and: [
                      { $eq: ["$activityLog.allocationChanged", false] },
                      { $eq: ["$activityLog.taskTo", "followup"] }
                    ]
                  },
                  then: "Contacted"
                },
                {
                  case: { $eq: ["$activityLog.taskfromFollowup", true] },
                  then: "System Study"
                },
                {
                  case: { $eq: ["$leadLost", true] },
                  then: "Lost"
                },
                {
                  case: { $eq: ["$activityLog.followupClosed", true] },
                  then: "Converted"
                }
              ],
              default: "New Leads"
            }
          }
        }
      },

      // Group by stage
      {
        $group: {
          _id: "$stage",
          count: { $sum: 1 },
          value: { $sum: "$netAmount" }
        }
      }
    ]);

    // 2️⃣ Define funnel order
    const FUNNEL_STAGES = [
      "New Leads",
      "Contacted",
      "System Study",
      "Lost",
      "Converted"
    ];

    // 3️⃣ Convert aggregation result to map
    const stageMap = result.reduce((acc, item) => {
      acc[item._id] = {
        count: item.count,
        value: item.value
      };
      return acc;
    }, {});

    // 4️⃣ Build final response with default 0 values
    let previousCount = null;

    const formatted = FUNNEL_STAGES.map((stage) => {
      const count = stageMap[stage]?.count || 0;
      const value = stageMap[stage]?.value || 0;

      const conversion =
        previousCount === null || previousCount === 0
          ? "0%"
          : `${((count / previousCount) * 100).toFixed(1)}%`;

      previousCount = count;

      return {
        stage,
        count,
        value,
        conversion
      };
    });


    return res.status(200).json({ message: "data found", data: formatted });

  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const UpdateCollection = async (req, res) => {

  const { isFrom = null } = req.query
  const {
    overwriteLastPayment = false,
    paymentData = null,
    ...formData
  } = req.body

  let model = null
  let session = null

  try {
    const isAdmin = await Admin.findById(formData.receivedBy).lean()
    if (isAdmin) {
      model = "Admin"
    } else {
      const isStaff = await Staff.findById(formData.receivedBy).lean()
      if (isStaff) {
        model = "Staff"
      }
    }


    if (!formData?.leadDocId) {
      return res.status(400).json({ message: "Missing leadid" })
    }

    if (!formData?.customerId) {
      return res.status(400).json({ message: "Missing customerId" })
    }

    const customerId = formData.customerId
    const leadDocId = formData.leadDocId

    session = await mongoose.startSession()

    await session.withTransaction(async () => {
      const updateCustomer = await Customer.findByIdAndUpdate(
        customerId,
        {
          $set: {
            customerName: formData.customerName,
            address1: formData.address,
            email: formData.email,
            mobile: formData?.mobile,
            registrationType: formData?.registrationType,
            partner: formData?.partner,
            country: formData?.country,
            state: formData?.state,
            city: formData?.city,
            pincode: formData?.pincode
          }
        },
        { new: true, session }
      )

      if (!updateCustomer) {
        throw new Error("Customer not found")
      }

      const lead = await LeadMaster.findById(leadDocId).session(session)

      if (!lead) {
        throw new Error("Lead not found")
      }

      const receivedAmount = Number(
        paymentData?.receivedAmount ??
        formData?.totalReceivedAmount ??
        0
      )

      const currentPaidAmount = Number(
        lead.totalPaidAmount ??
        formData.totalpaidAmountBefore ??
        0
      )

      let newTotalPaid = currentPaidAmount
      let previousPaymentAmount = 0

      const normalizedPaymentEntries = (
        paymentData?.paymentEntries ||
        formData?.paymentEntries ||
        []
      ).map((e) => ({
        productorServiceId: e.productorServiceId,
        productorServicemodel: e.productorServicemodel,
        netAmount: Number(e.netAmount || 0),
        receivedAmount: Number(e.receivedAmount || 0),
        balanceAmount: Number(e.balanceAmount || 0)
      }))

      const paymentRecord = {
        paymentDate: paymentData?.paymentDate
          ? new Date(paymentData.paymentDate)
          : new Date(),
        receivedAmount,
        paymentVerified: false,
        paymentEntries: normalizedPaymentEntries,
        receivedBy: paymentData?.receivedBy || formData?.receivedBy,
        receivedModel:
          paymentData?.receivedModel || model || formData?.receivedModel,
        bankRemarks:
          paymentData?.bankRemarks ?? formData?.bankRemarks ?? "",
        updatedAt: new Date()
      }

      if (!Array.isArray(lead.paymentHistory)) {
        lead.paymentHistory = []
      }

      if (overwriteLastPayment && lead.paymentHistory.length > 0) {
        const lastPayment = lead.paymentHistory[lead.paymentHistory.length - 1]

        previousPaymentAmount = Number(lastPayment?.receivedAmount || 0)

        lead.paymentHistory[lead.paymentHistory.length - 1] = {
          ...(typeof lastPayment?.toObject === "function"
            ? lastPayment.toObject()
            : lastPayment),
          ...paymentRecord
        }

        newTotalPaid = currentPaidAmount - previousPaymentAmount + receivedAmount
      } else {
        lead.paymentHistory.push({
          ...paymentRecord,
          createdAt: new Date()
        })

        newTotalPaid = currentPaidAmount + receivedAmount
      }

      const totalNetAmount = Number(
        formData?.totalNetAmount ?? lead.totalNetAmount ?? 0
      )

      const newBalance = Math.max(0, totalNetAmount - newTotalPaid)

      let allocation = null
      if (isFrom === "reallocation") {
        allocation = await Task.findOne({ taskName: "Leadclosed" }).session(session)
      }

      lead.totalPaidAmount = newTotalPaid
      lead.partner = formData.partner
      lead.balanceAmount = newBalance

      if (isFrom === "reallocation") {
        lead.leadClosed = true
        lead.leadClosedBy = formData?.receivedBy
        lead.leadClosedModel = formData?.receivedModel || model
        lead.reallocatedTo = false
        lead.allocationType = allocation?._id || lead.allocationType
      }

      await lead.save({ session })

      await LeadMaster.updateMany(
        { customerName: lead.customerName },
        {
          $set: {
            email: formData?.email,
            mobile: formData?.mobile,
            pincode: formData?.pincode,
            partner: formData?.partner
          }
        },
        { session }
      )
    })

    return res.status(200).json({
      success: true,
      message: overwriteLastPayment
        ? "Payment overwritten successfully"
        : "Payment added successfully"
    })
  } catch (error) {
    console.log("error", error)
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    })
  } finally {
    if (session) {
      session.endSession()
    }
  }
}

export const ChecktodeleteTask = async (req, res) => {
  try {
    const { id } = req.query
    const objectId = new mongoose.Types.ObjectId(id)
    const result = await LeadMaster.find({
      "activityLog.taskId": objectId
    })
    if (result && result.length > 0) {
      return res.status(200).json({ message: "found task", data: false })
    } else {
      return res.status(200).json({ message: "not found to delete", data: true })
    }

  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const TaskRegistration = async (req, res) => {
  try {
    const formData = req.body;
    const existingItem = await Task.findOne({
      taskName: formData.task,
      code: formData.task,
    });
    if (existingItem) {
      return res.status(400).json({ message: "Task is already registere" });
    }

    // Create and save new item
    const collection = new Task({
      taskName: formData.task,
    });
    await collection.save();

    res.status(200).json({
      status: true,
      message: "Task created successfully",
      data: collection,
    });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};
export const UpdateLeadRegister = async (req, res) => {
  try {
    const { data, leadData } = req.body;

    // return
    const { docID } = req.query;
    const objectId = new mongoose.Types.ObjectId(docID);
    const matchedDoc = await LeadMaster.findById(objectId);

    const mappedleadData = leadData.map((item) => {
      return {
        licenseNumber: item.licenseNumber,
        productorServiceId: item.productorServiceId,
        productorServicemodel: item.itemType,
        price: item.price,
        productPrice: Number(item.productPrice),
        hsn: Number(item.hsn),
        netAmount: Number(item.netAmount),
      };
    });

    const newbalance = data.netAmount - matchedDoc.totalPaidAmount;

    const updatedLead = await LeadMaster.findByIdAndUpdate(objectId, {
      ...data,
      balanceAmount: newbalance,
      leadFor: mappedleadData,
    });

    if (!updatedLead) {
      return res.status(404).json({ message: "Lead not found" });
    } else {
      return res.status(200).json({ message: "Lead Updated Successfully" });
    }
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const GetAllservices = async (req, res) => {
  try {
    const allservices = await Service.find({});
    return res
      .status(200)
      .json({ message: "Services found", data: allservices });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const GetallselectedproductFollowup = async (req, res) => {
  try {
    // const { loggeduserid, branchSelected, role, pendingfollowup, selectedproductId } = req.query;
    const { loggeduserid, branchSelected, role, pendingfollowup, selectedproductId, viewmode = null, header = null } = req.query
    const userObjectId = new mongoose.Types.ObjectId(loggeduserid)
    const branchObjectId = new mongoose.Types.ObjectId(branchSelected)
    const productObjectId = selectedproductId ? new mongoose.Types.ObjectId(selectedproductId) : null

    let query
    if (viewmode) {
      query = {
        activityLog: {
          $elemMatch: {
            taskTo: "followup",
            allocationChanged: false,

          },
        },
        leadBranch: branchObjectId,

      }
      if (header !== "Total Leads") {
        query.leadLost = false

      }

    } else {
      if (pendingfollowup === "true") {

        query = {
          activityLog: {
            $elemMatch: {
              taskTo: "followup",
              allocationChanged: false,
              allocatedClosed: false,
              taskClosed: false,
              followupClosed: false,
            },
          },
          leadBranch: branchObjectId,
          reallocatedTo: false,
          leadLost: false,
        }


      } else if (pendingfollowup === "false") {

        query = {
          activityLog: {
            $elemMatch: {
              taskTo: "followup",
              allocationChanged: false,
              allocatedClosed: false,
              taskClosed: true,
              followupClosed: true,
            },
          },
          leadBranch: branchObjectId,
          leadLost: false,
        }


      }
    }


    // optional: add product filter at DB level if provided
    if (productObjectId) {
      query["leadFor.productorServiceId"] = productObjectId
    }
    const selectedfollowup = await LeadMaster.find(query)
      .populate({ path: "customerName" })
      .populate({ path: "partner" })
      .lean()

    const followupLeads = []

    for (const lead of selectedfollowup) {

      const leadForArray = Array.isArray(lead.leadFor) ? lead.leadFor : []

      const hasSelectedProduct = leadForArray.some(
        (lf) =>
          lf.productorServiceId &&
          lf.productorServiceId.toString() === productObjectId.toString()
      )

      if (productObjectId && !hasSelectedProduct) {
        continue
      }


      const activity = Array.isArray(lead.activityLog) ? lead.activityLog : []
      const matchedAllocations = activity
        .map((item, index) => ({ ...item, index }))
        .filter((item) => item.taskTo === "followup")

      if (matchedAllocations.length === 0) continue

      const lastAlloc = matchedAllocations[matchedAllocations.length - 1]
      const lastIndex = lastAlloc.index

      if (
        !lead.leadByModel ||
        !mongoose.models[lead.leadByModel] ||
        !lastAlloc.taskallocatedToModel ||
        !mongoose.models[lastAlloc.taskallocatedToModel] ||
        !lastAlloc.taskallocatedByModel ||
        !mongoose.models[lastAlloc.taskallocatedByModel]
      ) {
        console.log("leadby", lead.leadByModel)
        console.log("taskallocatedtomodel", lastAlloc.taskallocatedToModel)
        console.log("taskallocatedby", lastAlloc.taskallocatedByModel)
        console.error(
          `Model missing for lead ${lead._id}:`,
          lead.leadByModel,
          lastAlloc.taskallocatedToModel,
          lastAlloc.taskallocatedByModel
        )
        continue
      }

      const leadByModel = mongoose.model(lead.leadByModel)
      const allocatedToModel = mongoose.model(lastAlloc.taskallocatedToModel)
      const allocatedByModel = mongoose.model(lastAlloc.taskallocatedByModel)

      const [popLeadBy, popAllocatedTo, popAllocatedBy] = await Promise.all([
        leadByModel
          .findById(lead.leadBy)
          .select("name")
          .lean()
          .catch(() => null),
        allocatedToModel
          .findById(lastAlloc.taskallocatedTo)
          .select("name")
          .lean()
          .catch(() => null),
        allocatedByModel
          .findById(lastAlloc.taskallocatedBy)
          .select("name")
          .lean()
          .catch(() => null),
      ])

      const populatedActivityLog = await Promise.all(
        activity.map(async (log) => {
          let populatedSubmittedUser = null
          let populatedTaskAllocatedTo = null
          let populatedTaskAllocatedBy = null
          let populatedTask = null
          let populatedTaskBy = null

          if (
            log.submittedUser &&
            log.submissiondoneByModel &&
            mongoose.models[log.submissiondoneByModel]
          ) {
            const model = mongoose.model(log.submissiondoneByModel)
            populatedSubmittedUser = await model
              .findById(log.submittedUser)
              .select("name")
              .lean()
              .catch(() => null)
          }

          if (
            log.taskallocatedBy &&
            log.taskallocatedByModel &&
            mongoose.models[log.taskallocatedByModel]
          ) {
            const model = mongoose.model(log.taskallocatedByModel)
            populatedTaskAllocatedBy = await model
              .findById(log.taskallocatedBy)
              .select("name")
              .lean()
              .catch(() => null)
          }

          if (
            log.taskallocatedTo &&
            log.taskallocatedToModel &&
            mongoose.models[log.taskallocatedToModel]
          ) {
            const model = mongoose.model(log.taskallocatedToModel)
            populatedTaskAllocatedTo = await model
              .findById(log.taskallocatedTo)
              .select("name")
              .lean()
              .catch(() => null)
          }

          if (log?.taskId) {
            populatedTask = await Task.findById(log.taskId)
              .select("taskName")
              .lean()
              .catch(() => null)
          }

          if (log?.taskBy) {
            populatedTaskBy = await Task.findById(log.taskBy)
          }

          return {
            ...log,
            taskBy: populatedTaskBy,
            submittedUser: populatedSubmittedUser || log.submittedUser,
            taskallocatedBy: populatedTaskAllocatedBy || log.taskallocatedBy,
            taskallocatedTo: populatedTaskAllocatedTo || log.taskallocatedTo,
            taskId: populatedTask,
          }
        })
      )

      const lastMatched = lastAlloc
      const lastMatchedClosed = !!lastMatched.followupClosed

      // let neverfollowuped = false

      // if (lastMatchedClosed) {
      //   neverfollowuped = true
      // } else {
      //   const afterLogs = activity.slice(lastIndex + 1)
      //   const foundNextFollowUp = afterLogs.some(
      //     (log) => !!log.nextFollowUpDate
      //   )
      //   if (foundNextFollowUp) {
      //     neverfollowuped = false
      //   } else {
      //     if (lastMatched.nextFollowUpDate) neverfollowuped = false
      //     else neverfollowuped = true
      //   }
      // }
      // 1️⃣ Get all followup allocations
      const followupLogs = activity
        .map((item, index) => ({ ...item, index }))
        .filter((item) => item.taskTo === "followup")

      if (followupLogs.length === 0) return

      // 2️⃣ Take LAST followup allocation
      const lastFollowup = followupLogs[followupLogs.length - 1]

      // 3️⃣ Apply your conditions
      let neverfollowuped = false

      if (
        lastFollowup.allocationChanged === false &&
        lastFollowup.followupClosed === false
      ) {
        // 4️⃣ Check logs AFTER this index
        const afterLogs = activity.slice(lastFollowup.index + 1)

        const hasNextFollowUpDate = afterLogs.some(
          (log) => log.nextFollowUpDate
        )

        if (!hasNextFollowUpDate) {
          neverfollowuped = true
        }
      }

      const lastActivity = activity[activity.length - 1] || {}
      const Nextfollowup = !!lastActivity.nextFollowUpDate
      const allocatedfollowup = !!lastActivity.taskfromFollowup
      const allocatedTaskClosed = !!lastActivity.allocatedClosed

      followupLeads.push({
        ...lead,
        leadBy: popLeadBy || lead.leadBy,
        allocatedTo: popAllocatedTo,
        allocatedBy: popAllocatedBy,
        activityLog: populatedActivityLog,
        nextFollowUpDate: lastActivity.nextFollowUpDate ?? null,
        neverfollowuped,
        Nextfollowup,
        allocatedfollowup,
        allocatedTaskClosed,
      })
    }

    return res.status(200).json({ followupLeads })


  } catch (error) {
    console.log("error", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}


// export const GetallfollowupList = async (req, res) => {
//   try {
//     const { loggeduserid, branchSelected, role, pendingfollowup, viewmode = null, startDate, endDate, header } = req.query;
//     console.log("isssssssssssssstotal", viewmode)

//     const userObjectId = new mongoose.Types.ObjectId(loggeduserid);
//     const branchObjectId = new mongoose.Types.ObjectId(branchSelected);
//     // const
//     let query;
//     if (viewmode) {
//       query = {
//         activityLog: {
//           $elemMatch: {
//             taskTo: "followup",
//             $or: [
//               { submittedUser: userObjectId },
//               { taskallocatedTo: userObjectId },
//             ],
//             allocationChanged: false,
//             allocatedClosed: false
//           }
//         },
//         leadBranch: branchObjectId,
//         leadLost: false
//       }
//     } else {
//       if (pendingfollowup === "true") {
//         if (role === "Admin") {
//           query = {
//             activityLog: {
//               $elemMatch: {
//                 taskTo: "followup",

//                 allocationChanged: false,
//                 allocatedClosed: false,
//                 taskClosed: false,
//                 followupClosed: false,
//               },
//             },
//             leadBranch: branchObjectId,
//             reallocatedTo: false,
//             leadLost: false,
//           };
//         } else {
//           query = {
//             activityLog: {
//               $elemMatch: {
//                 taskTo: "followup",
//                 $or: [
//                   { submittedUser: userObjectId },
//                   { taskallocatedTo: userObjectId },
//                 ],
//                 allocationChanged: false,
//                 allocatedClosed: false,
//                 taskClosed: false,
//                 followupClosed: false,
//               },
//             },
//             leadBranch: branchObjectId,
//             reallocatedTo: false,
//             leadLost: false,
//           };
//         }
//       } else if (pendingfollowup === "false") {
//         if (role === "Admin") {
//           query = {
//             activityLog: {
//               $elemMatch: {
//                 taskTo: "followup",
//                 allocationChanged: false,
//                 allocatedClosed: false,
//                 taskClosed: true,
//                 followupClosed: true,
//               },
//             },
//             leadBranch: branchObjectId,

//             leadLost: false,
//           };
//         } else {
//           query = {
//             activityLog: {
//               $elemMatch: {
//                 taskTo: "followup",
//                 $or: [
//                   { submittedUser: userObjectId },
//                   { taskallocatedTo: userObjectId },
//                 ],
//                 taskClosed: true,
//               },
//             },
//             leadBranch: branchObjectId,
//             leadLost: false,
//           };
//         }
//       }
//     }

//     const selectedfollowup = await LeadMaster.find(query)
//       .populate({ path: "customerName" })
//       .populate({ path: "partner" })
//       .lean();
//     console.log("selelltttt", selectedfollowup)
//     const followupLeads = [];
//     for (const lead of selectedfollowup) {
//       // Build matchedAllocations = activityLog entries where taskTo === 'followup'
//       const activity = Array.isArray(lead.activityLog) ? lead.activityLog : [];
//       const matchedAllocations = activity
//         .map((item, index) => ({ ...item, index }))
//         .filter((item) => item.taskTo === "followup");

//       // If no matchedAllocation, skip this lead (or push with flags false if needed)
//       if (matchedAllocations.length === 0) {
//         continue;
//       }

//       // Safety: ensure model names exist before doing mongoose.model(...) calls
//       const lastAlloc = matchedAllocations[matchedAllocations.length - 1];

//       const lastIndex = lastAlloc.index;

//       if (
//         !lead.leadByModel ||
//         !mongoose.models[lead.leadByModel] ||
//         !lastAlloc.taskallocatedToModel ||
//         !mongoose.models[lastAlloc.taskallocatedToModel] ||
//         !lastAlloc.taskallocatedByModel ||
//         !mongoose.models[lastAlloc.taskallocatedByModel]
//       ) {
//         console.log("leadby", lead.leadByModel)
//         console.log("taskallocatedtomodel", lastAlloc.taskallocatedToModel)
//         console.log("taskallocatedy", lastAlloc.taskallocatedByModel)
//         console.error(
//           `Model missing for lead ${lead._id}:`,
//           lead.leadByModel,
//           lastAlloc.taskallocatedToModel,
//           lastAlloc.taskallocatedByModel
//         );
//         // skip this lead (don't `return` from whole function)
//         continue;
//       }

//       // Populate outer fields (await as needed)
//       const leadByModel = mongoose.model(lead.leadByModel);
//       const allocatedToModel = mongoose.model(lastAlloc.taskallocatedToModel);
//       const allocatedByModel = mongoose.model(lastAlloc.taskallocatedByModel);

//       const [popLeadBy, popAllocatedTo, popAllocatedBy] = await Promise.all([
//         leadByModel
//           .findById(lead.leadBy)
//           .select("name")
//           .lean()
//           .catch(() => null),
//         allocatedToModel
//           .findById(lastAlloc.taskallocatedTo)
//           .select("name")
//           .lean()
//           .catch(() => null),
//         allocatedByModel
//           .findById(lastAlloc.taskallocatedBy)
//           .select("name")
//           .lean()
//           .catch(() => null),
//       ]);

//       // Populate activityLog fields that reference other models (submittedUser, taskallocatedTo)
//       const populatedActivityLog = await Promise.all(
//         activity.map(async (log) => {
//           let populatedSubmittedUser = null;
//           let populatedTaskAllocatedTo = null;
//           let populatedTaskAllocatedBy = null
//           let populatedTask = null;
//           let populatedTaskBy = null
//           if (
//             log.submittedUser &&
//             log.submissiondoneByModel &&
//             mongoose.models[log.submissiondoneByModel]
//           ) {
//             const model = mongoose.model(log.submissiondoneByModel);
//             populatedSubmittedUser = await model
//               .findById(log.submittedUser)
//               .select("name")
//               .lean()
//               .catch(() => null);
//           }
//           if (log.taskallocatedBy && log.taskallocatedByModel && mongoose.models[log.taskallocatedByModel]) {
//             const model = mongoose.model(log.taskallocatedByModel);
//             populatedTaskAllocatedBy = await model
//               .findById(log.taskallocatedBy)
//               .select("name")
//               .lean()
//               .catch(() => null);

//           }

//           if (
//             log.taskallocatedTo &&
//             log.taskallocatedToModel &&
//             mongoose.models[log.taskallocatedToModel]
//           ) {
//             const model = mongoose.model(log.taskallocatedToModel);
//             populatedTaskAllocatedTo = await model
//               .findById(log.taskallocatedTo)
//               .select("name")
//               .lean()
//               .catch(() => null);
//           }
//           if (log?.taskId) {
//             populatedTask = await Task.findById(log.taskId)
//               .select("taskName")
//               .lean()
//               .catch(() => null);
//           }
//           if (log?.taskBy) {
//             populatedTaskBy = await Task.findById(log.taskBy)
//           }

//           return {
//             ...log,
//             taskBy: populatedTaskBy,
//             submittedUser: populatedSubmittedUser || log.submittedUser,
//             taskallocatedBy: populatedTaskAllocatedBy || log.taskallocatedBy,
//             taskallocatedTo: populatedTaskAllocatedTo || log.taskallocatedTo,
//             taskId: populatedTask,
//           };
//         })
//       );
//       const populatedLeadFor = await Promise.all(
//         lead.leadFor.map(async (item) => {
//           const productorserviceModel = mongoose.model(
//             item.productorServicemodel
//           );
//           const populatedProductorService = await productorserviceModel
//             .findById(item.productorServiceId)
//             .lean(); // Use lean() to get plain JavaScript objects

//           return { ...item, productorServiceId: populatedProductorService };
//         })
//       );

//       // Determine neverfollowuped:
//       // - If the last matched allocation itself has followupClosed === true => NOT neverfollowuped
//       // - Else, check logs AFTER the lastAlloc.index: if any has nextFollowUpDate (non-null) => NOT neverfollowuped
//       // - Otherwise => neverfollowuped = true
//       const lastMatched = lastAlloc;
//       const lastMatchedClosed = !!lastMatched.followupClosed; // closed flag(s)
//       let neverfollowuped = false;

//       if (lastMatchedClosed) {
//         neverfollowuped = true;
//       } else {
//         const afterLogs = activity.slice(lastIndex + 1);
//         const foundNextFollowUp = afterLogs.some(
//           (log) => !!log.nextFollowUpDate
//         );
//         if (foundNextFollowUp) {
//           neverfollowuped = false;
//         } else {
//           // also, if the matched allocation itself had nextFollowUpDate, treat as not neverfollowuped
//           if (lastMatched.nextFollowUpDate) neverfollowuped = false;
//           else neverfollowuped = true;
//         }
//       }

//       // currentdateNextfollowup: whether the very last activity log entry has nextFollowUpDate (or you can define differently)
//       const lastActivity = activity[activity.length - 1] || {};
//       const Nextfollowup = !!lastActivity.nextFollowUpDate;

//       // allocatedfollowup: whether the last activity entry was created from followup task (taskfromFollowup flag)
//       const allocatedfollowup = !!lastActivity.taskfromFollowup;

//       // allocatedTaskClosed: whether last activity entry's allocatedClosed === true
//       const allocatedTaskClosed = !!lastActivity.allocatedClosed;

//       // push enriched lead
//       followupLeads.push({
//         ...lead,
//         leadBy: popLeadBy || lead.leadBy,
//         leadFor: populatedLeadFor,
//         allocatedTo: popAllocatedTo,
//         allocatedBy: popAllocatedBy,
//         activityLog: populatedActivityLog,
//         nextFollowUpDate: lastActivity.nextFollowUpDate ?? null, //to show the nextfollowupdate in the list
//         neverfollowuped, //to check whether the lead is ever followuped
//         Nextfollowup,
//         allocatedfollowup, //to know whether the lead have any task from followup
//         allocatedTaskClosed, //to know the the task from followup is closed or not
//       });
//     }


//     const ischekCollegueLeads = followupLeads.some((item) =>
//       item.allocatedBy._id.equals(userObjectId)
//     );

//     if (followupLeads && followupLeads.length > 0) {
//       return res.status(201).json({
//         messge: "leadfollowup found",
//         data: { followupLeads, ischekCollegueLeads },
//       });
//     } else {
//       return res
//         .status(404)
//         .json({ message: "leadfollowp not found", data: {} });
//     }
//   } catch (error) {
//     console.log("error:", error.message);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };///old code
export const GetleadById = async (req, res) => {
  const { leadDocId } = req.query
}

export const ApprovedforcefullyClosedTarget = async (req, res) => {
  try {
    const { leadDocId } = req.query

    if (!leadDocId) {
      return res
        .status(400)
        .json({ success: false, message: "leadDocId is required" })
    }

    const result = await LeadMaster.updateOne(
      { _id: leadDocId },
      { $set: { forcefullyClosedTarget: true } }
    )

    // result.matchedCount: how many docs matched filter
    // result.modifiedCount: how many docs actually changed
    if (result.matchedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Lead not found" })
    }

    return res.status(200).json({
      success: true,
      message: "Target forcefully closed successfully",
      data: {
        leadDocId,
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      }
    })
  } catch (error) {
    console.error("ApprovedforcefullyClosedTarget error:", error)
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" })
  }
}

export const GetallfollowupList = async (req, res) => {
  try {
    const {
      loggeduserid,
      branchSelected,
      role,
      pendingfollowup,
      viewmode,
      startDate,
      endDate,
      header,
    } = req.query;

    const userObjectId = new mongoose.Types.ObjectId(loggeduserid);
    const branchObjectId = new mongoose.Types.ObjectId(branchSelected);

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;





    // Check if viewmode is the string "true"
    const isViewMode = viewmode === "true";

    // Check for valid header and date params
    const hasValidHeader = header && header !== "null" && header !== "undefined";
    const hasValidDates = startDate && endDate &&
      startDate !== "null" && endDate !== "null" &&
      startDate !== "undefined" && endDate !== "undefined";

    const isNewMode = isViewMode || hasValidHeader || hasValidDates;

    let query;

    // ✅ VIEW MODE
    if (isViewMode) {

      query = {
        activityLog: {
          $elemMatch: {
            taskTo: "followup",
            $or: [
              { submittedUser: userObjectId },
              { taskallocatedTo: userObjectId },
            ],
            allocationChanged: false,
            allocatedClosed: false,
          },
        },
        leadBranch: branchObjectId,

      };
      // ✅ Add condition only when needed
      if (header !== "Total Leads") {
        query.leadLost = false
      }
    } else {

      // ✅ OLD NORMAL CONDITIONS
      if (pendingfollowup === "true") {
        if (role === "Admin") {
          query = {
            activityLog: {
              $elemMatch: {
                taskTo: "followup",
                allocationChanged: false,
                allocatedClosed: false,
                taskClosed: false,
                followupClosed: false,
              },
            },
            leadBranch: branchObjectId,
            reallocatedTo: false,
            leadLost: false,
          };
        } else {
          query = {
            activityLog: {
              $elemMatch: {
                taskTo: "followup",
                $or: [
                  { submittedUser: userObjectId },
                  { taskallocatedTo: userObjectId },
                ],
                allocationChanged: false,
                allocatedClosed: false,
                taskClosed: false,
                followupClosed: false,
              },
            },
            leadBranch: branchObjectId,
            reallocatedTo: false,
            leadLost: false,
          };
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
                followupClosed: true,
              },
            },
            leadBranch: branchObjectId,
            leadLost: false,
          };
        } else {
          query = {
            activityLog: {
              $elemMatch: {
                taskTo: "followup",
                $or: [
                  { submittedUser: userObjectId },
                  { taskallocatedTo: userObjectId },
                ],
                taskClosed: true,
              },
            },
            leadBranch: branchObjectId,
            leadLost: false,
          };
        }
      }
    }

    const selectedfollowup = await LeadMaster.find(query)
      .populate({ path: "customerName" })
      .populate({ path: "partner" })
      .lean();

    const followupLeads = [];
    // console.log("selctedfollowups",selectedfollowup)

    for (const lead of selectedfollowup) {
      const activity = Array.isArray(lead.activityLog) ? lead.activityLog : [];

      let matchedAllocations;

      // ✅ NEW LOGIC ONLY WHEN REQUIRED
      if (isNewMode) {
        matchedAllocations = activity
          .map((item, index) => ({ ...item, index }))
          .filter((item) => {
            if (item.taskTo !== "followup") return false;
            if (item.allocationChanged !== false) return false;
            if (!item.submissionDate) return false;

            // const subDate = new Date(item.submissionDate);

            // if (start && end) {
            //   if (subDate < start || subDate > end) return false;
            // }

            return true;
          });
      } else {

        // ✅ OLD LOGIC (NO DATE FILTER)
        matchedAllocations = activity
          .map((item, index) => ({ ...item, index }))
          .filter((item) => item.taskTo === "followup");
      }
      if (matchedAllocations.length === 0) continue;
      const lastAlloc = matchedAllocations[matchedAllocations.length - 1];
      const lastIndex = lastAlloc.index;
      // ✅ HEADER FILTER ONLY IN NEW MODE
      if (isNewMode) {
        if (header === "Pending") {
          if (
            lead.leadConvertedDate ||
            lead.leadLostDate ||
            lead.leadLost === true
          ) {
            continue;
          }
        }

        if (header === "Converted") {
          if (!lead.leadConvertedDate) continue;

          const convDate = new Date(lead.leadConvertedDate);

          if (start && end) {
            if (convDate < start || convDate > end) continue;
          }
        }
      }
      // ✅ SAFE POPULATION
      const leadByModel =
        lead.leadByModel && mongoose.models[lead.leadByModel]
          ? mongoose.model(lead.leadByModel)
          : null;

      const allocatedToModel =
        lastAlloc.taskallocatedToModel &&
          mongoose.models[lastAlloc.taskallocatedToModel]
          ? mongoose.model(lastAlloc.taskallocatedToModel)
          : null;

      const allocatedByModel =
        lastAlloc.taskallocatedByModel &&
          mongoose.models[lastAlloc.taskallocatedByModel]
          ? mongoose.model(lastAlloc.taskallocatedByModel)
          : null;

      const [popLeadBy, popAllocatedTo, popAllocatedBy] = await Promise.all([
        leadByModel
          ? leadByModel
            .findById(lead.leadBy)
            .select("name")
            .lean()
            .catch(() => null)
          : null,
        allocatedToModel
          ? allocatedToModel
            .findById(lastAlloc.taskallocatedTo)
            .select("name")
            .lean()
            .catch(() => null)
          : null,
        allocatedByModel
          ? allocatedByModel
            .findById(lastAlloc.taskallocatedBy)
            .select("name")
            .lean()
            .catch(() => null)
          : null,
      ]);
      // ✅ POPULATE activityLog (only in old mode for detailed view)
      let populatedActivityLog = activity;
      if (!isNewMode) {
        populatedActivityLog = await Promise.all(
          activity.map(async (log) => {
            let populatedSubmittedUser = null;
            let populatedTaskAllocatedTo = null;
            let populatedTaskAllocatedBy = null;
            let populatedTask = null;
            let populatedTaskBy = null;

            if (
              log.submittedUser &&
              log.submissiondoneByModel &&
              mongoose.models[log.submissiondoneByModel]
            ) {
              const model = mongoose.model(log.submissiondoneByModel);
              populatedSubmittedUser = await model
                .findById(log.submittedUser)
                .select("name")
                .lean()
                .catch(() => null);
            }

            if (
              log.taskallocatedBy &&
              log.taskallocatedByModel &&
              mongoose.models[log.taskallocatedByModel]
            ) {
              const model = mongoose.model(log.taskallocatedByModel);
              populatedTaskAllocatedBy = await model
                .findById(log.taskallocatedBy)
                .select("name")
                .lean()
                .catch(() => null);
            }

            if (
              log.taskallocatedTo &&
              log.taskallocatedToModel &&
              mongoose.models[log.taskallocatedToModel]
            ) {
              const model = mongoose.model(log.taskallocatedToModel);
              populatedTaskAllocatedTo = await model
                .findById(log.taskallocatedTo)
                .select("name")
                .lean()
                .catch(() => null);
            }

            if (log?.taskId) {
              populatedTask = await Task.findById(log.taskId)
                .select("taskName")
                .lean()
                .catch(() => null);
            }

            if (log?.taskBy) {
              populatedTaskBy = await Task.findById(log.taskBy)
                .lean()
                .catch(() => null);
            }

            return {
              ...log,
              taskBy: populatedTaskBy,
              submittedUser: populatedSubmittedUser || log.submittedUser,
              taskallocatedBy: populatedTaskAllocatedBy || log.taskallocatedBy,
              taskallocatedTo: populatedTaskAllocatedTo || log.taskallocatedTo,
              taskId: populatedTask,
            };
          })
        );
      }
      // ✅ POPULATE leadFor
      const populatedLeadFor = await Promise.all(
        lead.leadFor.map(async (item) => {
          const model = mongoose.model(item.productorServicemodel);
          const populated = await model
            .findById(item.productorServiceId)
            .lean()
            .catch(() => null);

          return { ...item, productorServiceId: populated };
        })
      );
      const populatedpaymentHistory = lead?.paymentHistory?.length
        ? await Promise.all(
          lead.paymentHistory.map(async (history) => {
            const populatedhistory = { ...history.toObject?.() ?? history }

            // populate receivedBy (existing)
            if (history.receivedModel && history.receivedBy) {
              const recvModel = mongoose.model(history.receivedModel)
              populatedhistory.receivedBy = await recvModel
                .findById(history.receivedBy)
                .select("name")
                .lean()
            }

            // populate each paymentEntries[].productId via productorServicemodel
            if (Array.isArray(history.paymentEntries)) {
              populatedhistory.paymentEntries = await Promise.all(
                history.paymentEntries.map(async (entry) => {
                  const populatedEntry = { ...entry }

                  if (entry.productorServicemodel && entry.productorServiceId) {
                    try {
                      const ProdModel = mongoose.model(entry.productorServicemodel)
                      const doc = await ProdModel
                        .findById(entry.productorServiceId)
                        .select("productName name")
                        .lean()

                      populatedEntry.productorServiceId = doc
                    } catch (err) {
                      populatedEntry.productorServiceId = null
                    }
                  }

                  return populatedEntry
                })
              )
            }

            return populatedhistory
          })
        )
        : []
      const lastActivity = activity[activity.length - 1] || {};

      // ✅ CALCULATE FLAGS (only in old mode)
      let neverfollowuped = false;
      let Nextfollowup = false;
      let allocatedfollowup = false;
      let allocatedTaskClosed = false;

      if (!isNewMode) {
        const lastMatched = lastAlloc;
        const lastMatchedClosed = !!lastMatched.followupClosed;

        if (lastMatchedClosed) {
          neverfollowuped = true;
        } else {
          const afterLogs = activity.slice(lastIndex + 1);
          const foundNextFollowUp = afterLogs.some(
            (log) => !!log.nextFollowUpDate
          );
          if (foundNextFollowUp) {
            neverfollowuped = false;
          } else {
            if (lastMatched.nextFollowUpDate) neverfollowuped = false;
            else neverfollowuped = true;
          }
        }

        Nextfollowup = !!lastActivity.nextFollowUpDate;
        allocatedfollowup = !!lastActivity.taskfromFollowup;
        allocatedTaskClosed = !!lastActivity.allocatedClosed;
      }
      // ✅ BUILD LEAD OBJECT
      const leadObject = {
        ...lead,
        leadBy: popLeadBy || lead.leadBy,
        paymentHistory: populatedpaymentHistory,
        leadFor: populatedLeadFor,
        allocatedTo: popAllocatedTo,
        allocatedBy: popAllocatedBy,
        nextFollowUpDate: lastActivity.nextFollowUpDate ?? null,
      };

      // Add detailed fields only in old mode
      if (!isNewMode) {
        leadObject.activityLog = populatedActivityLog;
        leadObject.neverfollowuped = neverfollowuped;
        leadObject.Nextfollowup = Nextfollowup;
        leadObject.allocatedfollowup = allocatedfollowup;
        leadObject.allocatedTaskClosed = allocatedTaskClosed;
      }

      followupLeads.push(leadObject);
    }

    const ischekCollegueLeads = followupLeads.some(
      (item) =>
        item.allocatedBy?._id?.toString() === userObjectId.toString()
    );

    console.log("MODE:", isNewMode ? "NEW" : "OLD");

    if (followupLeads.length > 0) {
      return res.status(201).json({
        messge: "leadfollowup found",
        data: { followupLeads, ischekCollegueLeads },
      });
    } else {
      return res
        .status(404)
        .json({ message: "leadfollowp not found", data: {} });
    }
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};//claude ai

export const SetDemoallocation = async (req, res) => {
  try {
    const { demoallocatedBy, leaddocId, editIndex } = req.query;
    const demoData = req.body;
    const { demoallocatedTo, ...balanceData } = demoData;
    const allocatedToObjectId = new mongoose.Types.ObjectId(demoallocatedTo);

    const allocatedByObjectId = new mongoose.Types.ObjectId(demoallocatedBy);

    let taskallocatedByModel;
    let taskallocatedtoModel;
    const isallocatedbyStaff = await Staff.findOne({
      _id: allocatedByObjectId,
    });
    if (isallocatedbyStaff) {
      taskallocatedByModel = "Staff";
    } else {
      const isallocatedbyAdmin = await Admin.findOne({
        _id: allocatedByObjectId,
      });
      if (isallocatedbyAdmin) {
        taskallocatedByModel = "Admin";
      }
    }
    const isallocatedtoStaff = await Staff.findOne({
      _id: allocatedToObjectId,
    });
    if (isallocatedtoStaff) {
      taskallocatedtoModel = "Staff";
    } else {
      const isallocatedtoAdmin = await Admin.findOne({
        _id: allocatedToObjectId,
      });
      if (isallocatedtoAdmin) {
        taskallocatedtoModel = "Admin";
      }
    }
    const allocationtask = await Task.findOne({ taskName: "Allocation" });
    // await LeadMaster.bulkWrite([
    //   {
    //     updateOne: {
    //       filter: { _id: leaddocId },
    //       update:
    //         editIndex !== undefined && editIndex !== null
    //           ? {
    //             $set: {
    //               [`activityLog.${Number(
    //                 editIndex
    //               )}.allocationChanged`]: true,
    //             },
    //           }
    //           : {},
    //     },
    //   },
    //   // 2️⃣ Set allocationlist = true for matching followup entry
    //   {
    //     updateOne: {
    //       filter: { _id: leaddocId },
    //       update: {
    //         $set: {
    //           "activityLog.$[log].allocationlist": true
    //         }
    //       },
    //       arrayFilters: [
    //         {
    //           "log.taskTo": "followup",
    //           "log.followupClosed": false
    //         }
    //       ]
    //     }
    //   },

    //   {
    //     updateOne: {
    //       filter: { _id: leaddocId },
    //       update: {
    //         $push: {
    //           activityLog: {
    //             submissionDate: new Date(),
    //             allocationDate: demoData.demoallocatedDate,
    //             submittedUser: demoallocatedBy,
    //             submissiondoneByModel: taskallocatedByModel,
    //             taskallocatedBy: demoallocatedBy,
    //             taskallocatedByModel: taskallocatedByModel,
    //             taskallocatedTo: demoallocatedTo,
    //             taskallocatedToModel: taskallocatedtoModel,
    //             remarks: demoData.demoDescription,
    //             taskBy: allocationtask,
    //             taskTo: demoData?.selectedTypeName,
    //             taskId: demoData?.selectedType,
    //             taskfromFollowup: true,
    //             allocationChanged: false,
    //           },
    //         },
    //         $set: { taskfromFollowup: true },
    //       },
    //     },
    //   },
    // ]);
    // const operations = [];

    // // 1️⃣ Mark previous allocationChanged = true (ONLY if editIndex exists)
    // if (editIndex !== undefined && editIndex !== null) {
    //   operations.push({
    //     updateOne: {
    //       filter: { _id: new mongoose.Types.ObjectId(leaddocId) },
    //       update: {
    //         $set: {
    //           [`activityLog.${Number(editIndex)}.allocationChanged`]: true
    //         }
    //       }
    //     }
    //   });
    // }

    // // 2️⃣ Set allocationlist = true for FOLLOWUP entry (SAFE arrayFilters)
    // operations.push({
    //   updateOne: {
    //     filter: { _id: new mongoose.Types.ObjectId(leaddocId) },
    //     update: {
    //       $set: {
    //         "activityLog.$[log].allocationlist": true
    //       }
    //     },
    //     arrayFilters: [
    //       {
    //         "log.taskTo": "followup",
    //         "log.followupClosed": false
    //       }
    //     ]
    //   }
    // });

    // // 3️⃣ Push new allocation activity
    // operations.push({
    //   updateOne: {
    //     filter: { _id: new mongoose.Types.ObjectId(leaddocId) },
    //     update: {
    //       $push: {
    //         activityLog: {
    //           submissionDate: new Date(),
    //           allocationDate: demoData.demoallocatedDate,
    //           submittedUser: demoallocatedBy,
    //           submissiondoneByModel: taskallocatedByModel,
    //           taskallocatedBy: demoallocatedBy,
    //           taskallocatedByModel: taskallocatedByModel,
    //           taskallocatedTo: demoallocatedTo,
    //           taskallocatedToModel: taskallocatedtoModel,
    //           remarks: demoData.demoDescription,
    //           taskBy: allocationtask?._id,
    //           taskTo: demoData?.selectedTypeName,
    //           taskId: demoData?.selectedType,
    //           taskfromFollowup: true,
    //           allocationChanged: false
    //         }
    //       },
    //       $set: {
    //         taskfromFollowup: true
    //       }
    //     }
    //   }
    // });

    // // 4️⃣ Execute bulkWrite (DISABLE timestamps to avoid conflicts)
    // await LeadMaster.bulkWrite(operations, {
    //   timestamps: false
    // });


    const bulkOps = [];

    // 1️⃣ First update (keep with Mongoose)
    if (editIndex !== undefined && editIndex !== null) {
      bulkOps.push({
        updateOne: {
          filter: { _id: leaddocId },
          update: {
            $set: {
              [`activityLog.${Number(editIndex)}.allocationChanged`]: true,
            },
          },
        },
      });
    }

    // 3️⃣ Third update (keep with Mongoose)
    bulkOps.push({
      updateOne: {
        filter: { _id: leaddocId },
        update: {
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
              taskBy: allocationtask?._id,
              taskTo: demoData?.selectedTypeName,
              taskId: demoData?.selectedType,
              taskfromFollowup: true,
              allocationChanged: false,
            },
          },
          $set: { taskfromFollowup: true },
        },
      },
    });
    const objId = new mongoose.Types.ObjectId(leaddocId);  // ✅ Force ObjectId
    const result = await LeadMaster.collection.updateOne(
      { _id: objId },  // Filter
      {
        $set: {
          "activityLog.$[log].allocationlist": true  // Creates field!
        }
      },
      {
        arrayFilters: [
          {
            "log.taskTo": "followup",
            "log.followupClosed": false
          }
        ]
      }
    );

    // Execute main bulkWrite
    await LeadMaster.bulkWrite(bulkOps);

    return res.status(200).json({ message: "Demo added succesfully" });
  } catch (error) {
    console.log("error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const GetdemoleadCount = async (req, res) => {
  try {
    const { loggeduserid } = req.query;
    const objectid = new mongoose.Types.ObjectId(loggeduserid);
    const followupCount = await LeadMaster.find({
      "demofollowUp.demoallocatedTo": objectid,
    });
    const pendingDemoCount = followupCount.filter((item) =>
      item.demofollowUp.some(
        (demo) =>
          demo.demoallocatedTo.equals(objectid) &&
          demo.demofollowerDate === null
      )
    ).length;
    return res
      .status(200)
      .json({ message: "found mathch", data: pendingDemoCount });
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
};
export const GetrepecteduserDemo = async (req, res) => {
  try {
    const { userid, selectedBranch, role } = req.query;
    const userObjectId = new mongoose.Types.ObjectId(userid);
    const branchObjectId = new mongoose.Types.ObjectId(selectedBranch);
    let matchStage = {
      leadBranch: branchObjectId,
    };

    if (role === "Staff") {
      matchStage = {
        leadBranch: branchObjectId,
        $or: [
          {
            demofollowUp: {
              $elemMatch: { demoallocatedTo: userObjectId },
            },
          },
          {
            demofollowUp: {
              $elemMatch: { demoallocatedBy: userObjectId },
            },
          },
        ],
      };
    } else if (role === "Admin") {
      matchStage.$and = [
        { demofollowUp: { $exists: true } },
        { demofollowUp: { $ne: [] } },
      ];
    }

    const matchedLeads = await LeadMaster.aggregate([
      {
        $match: matchStage,
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
                      { $eq: ["$$demo.demoallocatedBy", userObjectId] },
                    ],
                  },
                },
              },
              else: {
                $cond: {
                  if: { $isArray: "$demofollowUp" },
                  then: "$demofollowUp",
                  else: [],
                },
              }, // Admin gets first entry
            },
          },
        },
      },
      {
        $set: {
          demofollowUp: {
            $map: {
              input: "$demofollowUp",
              as: "item",
              in: {
                $mergeObjects: [
                  "$$item",
                  { index: { $indexOfArray: ["$demofollowUp", "$$item"] } },
                ],
              },
            },
          },
        },
      },
      {
        $unwind: "$demofollowUp",
      },
      {
        $facet: {
          staff: [
            {
              $match: {
                "demofollowUp.demoallocatedByModel": "Staff",
              },
            },
            {
              $lookup: {
                from: "staffs",
                let: { userId: "$demofollowUp.demoallocatedBy" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$_id", "$$userId"] },
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      name: 1,
                    },
                  },
                ],
                as: "demoallocatedByDetails",
              },
            },
            {
              $lookup: {
                from: "staffs",
                let: { userId: "$demofollowUp.demoallocatedTo" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$_id", "$$userId"] },
                    },
                  },
                  {
                    $project: { _id: 1, name: 1 },
                  },
                ],
                as: "demoallocatedToDetails",
              },
            },
          ],
          admin: [
            {
              $match: {
                "demofollowUp.demoallocatedByModel": "Admin",
              },
            },
            {
              $lookup: {
                from: "admins",
                let: { userId: "$demofollowUp.demoallocatedBy" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$_id", "$$userId"] },
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      name: 1,
                    },
                  },
                ],
                as: "demoallocatedByDetails",
              },
            },
            {
              $lookup: {
                from: "staffs", // Assuming `demoallocatedToModel` for Admin also refers to staff
                let: { userId: "$demofollowUp.demoallocatedTo" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$_id", "$$userId"] },
                    },
                  },
                  {
                    $project: { _id: 1, name: 1 },
                  },
                ],
                as: "demoallocatedToDetails",
              },
            },
          ],
        },
      },
      {
        $project: {
          results: {
            $concatArrays: ["$staff", "$admin"],
          },
        },
      },
      {
        $unwind: "$results",
      },
      {
        $replaceRoot: {
          newRoot: "$results",
        },
      },
      {
        $unwind: {
          path: "$demoallocatedByDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$demoallocatedToDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $set: {
          "demofollowUp.demoallocatedBy": {
            _id: "$demoallocatedByDetails._id",
            name: "$demoallocatedByDetails.name",
          },
          "demofollowUp.demoallocatedTo": {
            _id: "$demoallocatedToDetails._id",
            name: "$demoallocatedToDetails.name",
          },
        },
      },
      {
        $unset: ["demoallocatedByDetails", "demoallocatedToDetails"],
      },
      // 🔍 Lookup customerName from customers collection
      {
        $lookup: {
          from: "customers",
          localField: "customerName",
          foreignField: "_id",
          as: "customerTmp",
        },
      },
      {
        $unwind: {
          path: "$customerTmp",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $set: {
          customerName: {
            customerName: "$customerTmp.customerName",
            email: "$customerTmp.email",
            mobile: "$customerTmp.mobile",
            landline: "$customerTmp.landline",
          },
        },
      },
      { $unset: "customerTmp" },
      ////Lookup on allocatedby////
      // 1. Lookup from both possible sources (staffs/admins)

      {
        $lookup: {
          from: "staffs",
          localField: "allocatedBy",
          foreignField: "_id",
          as: "allocatedByStaff",
        },
      },
      {
        $lookup: {
          from: "admins",
          localField: "allocatedBy",
          foreignField: "_id",
          as: "allocatedByAdmin",
        },
      },

      // 2. Merge the result based on the model
      {
        $addFields: {
          allocatedByTemp: {
            $cond: [
              { $eq: ["$allocatedByModel", "Staff"] },
              { $arrayElemAt: ["$allocatedByStaff", 0] },
              { $arrayElemAt: ["$allocatedByAdmin", 0] },
            ],
          },
        },
      },

      // 3. Replace original field
      {
        $set: {
          allocatedBy: { name: "$allocatedByTemp.name" },
        },
      },

      // 4. Clean up temp fields
      {
        $unset: ["allocatedByTemp", "allocatedByStaff", "allocatedByAdmin"],
      },
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
                    { $eq: ["$$model", "Staff"] },
                  ],
                },
              },
            },
            { $project: { _id: 0, name: 1 } },
          ],
          as: "allocatedToTmp",
        },
      },
      {
        $unwind: {
          path: "$allocatedToTmp",
          preserveNullAndEmptyArrays: true,
        },
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
                    { $eq: ["$$model", "Staff"] },
                  ],
                },
              },
            },
            { $project: { _id: 0, name: 1 } },
          ],
          as: "leadByTmp",
        },
      },
      {
        $unwind: {
          path: "$leadByTmp",
          preserveNullAndEmptyArrays: true,
        },
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
          allocatedBy: { $first: "$allocatedBy" },
        },
      },
    ]);
    return res
      .status(200)
      .json({ message: "Matched demo found", data: matchedLeads });
  } catch (error) { }
};
export const UpdateOrSubmittaskByfollower = async (req, res) => {
  try {
    const taskDetails = req.body;

    const updatedLead = await LeadMaster.updateOne(
      { _id: taskDetails.leadDocId },
      {
        $set: {
          [`task.${taskDetails.matchedtaskindex}.taskDate`]:
            taskDetails.taskDate,
          [`task.${taskDetails.matchedtaskindex}.taskRemarks`]:
            taskDetails.Remarks,
        },
        reallocation: true,
        allocatedTo: null,
        allocatedToModel: null,
      }
    );
    if (updatedLead.modifiedCount > 0) {
      return res.status(201).json({ message: "Demo submitted Succesfully" });
    } else if (
      updatedLead.matchedCount > 0 &&
      updatedLead.modifiedCount === 0
    ) {
      return res.status(304).json({ message: "Match found ,not submitted" });
    } else {
      return res.status(404).json({ message: "not submitted" });
    }
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const UpdaeOrSubmitdemofollowByfollower = async (req, res) => {
  try {
    const demoDetails = req.body;
    const {
      matcheddemoindex,
      mathchedfollowUpDatesandRemarksIndex,
      leadDocId,
      followerDate,
      followerDescription,
    } = demoDetails;
    const followerData = {
      matcheddemoindex: demoDetails.matcheddemoindex,
      demoAssignedBy: demoDetails.demoAssignedBy,
      demoAssignedDate: demoDetails.demoAssignedDate,
      followerDate: demoDetails.followerDate,
      followerDescription: demoDetails.followerDescription,
    };

    const updatedLead = await LeadMaster.updateOne(
      { _id: leadDocId },
      {
        $set: {
          [`demofollowUp.${matcheddemoindex}.demofollowerDate`]: new Date(
            followerDate
          ),
          [`demofollowUp.${matcheddemoindex}.demofollowerDescription`]:
            followerDescription,
        },
        $push: {
          [`followUpDatesandRemarks.${mathchedfollowUpDatesandRemarksIndex}.folowerData`]:
            followerData,
        },
      }
    );
    if (updatedLead.modifiedCount > 0) {
      return res.status(201).json({ message: "Demo submitted Succesfully" });
    } else if (
      updatedLead.matchedCount > 0 &&
      updatedLead.modifiedCount === 0
    ) {
      return res.status(304).json({ message: "Match found ,not submitted" });
    } else {
      return res.status(404).json({ message: "not submitted" });
    }
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const GetalltaskanalysisLeads = async (req, res) => {
  try {
    const { selectedBranch } = req.query;
    const result = await LeadMaster.find({
      leadBranch: selectedBranch,
      leadClosed: false,
      leadLost: false,
      reallocatedTo: false,
    })
      .populate({ path: "customerName", select: "customerName" })
      .lean();

    const alltaskanalysisleads = [];

    // filter leads that have more than 1 activity
    const filtered = result.filter((item) => item.activityLog.length > 1);

    for (const lead of filtered) {
      // ✅ populate all submittedUser in activityLog
      const populatedActivityLogs = [];
      for (const activity of lead.activityLog) {
        let populatedtaskBy = null;
        let populatedtask = null;
        if (activity.submittedUser && activity.submissiondoneByModel) {
          const SubmittedModel = mongoose.model(activity.submissiondoneByModel);
          const populatedSubmittedUser = await SubmittedModel.findById(
            activity.submittedUser
          )
            .select("name")
            .lean();
          if (activity.taskId && isValidObjectId(activity.taskId)) {
            populatedtask = await Task.findById(activity.taskId)
              .select("taskName")
              .lean();
          }
          if (activity.taskBy && isValidObjectId(activity.taskBy)) {
            populatedtaskBy = await Task.findById(activity.taskBy);
          }

          populatedActivityLogs.push({
            ...activity,
            taskId: populatedtask,
            taskBy: populatedtaskBy,
            submittedUser: populatedSubmittedUser,
          });
        } else {
          populatedActivityLogs.push(activity);
        }
      }

      // ✅ find last activity and resolve allocatedTo
      const lastActivity =
        populatedActivityLogs[populatedActivityLogs.length - 1];

      const taskallocatedtoid = lastActivity?.taskallocatedTo
        ? lastActivity.taskallocatedTo
        : lastActivity.submittedUser?._id; // careful: populated now

      const tasksubmittedmodel = lastActivity?.taskallocatedTo
        ? lastActivity.taskallocatedToModel
        : lastActivity.submissiondoneByModel;

      let populatedtaskAllocatedTo = null;
      if (taskallocatedtoid && tasksubmittedmodel) {
        const TaskAllocatedModel = mongoose.model(tasksubmittedmodel);
        populatedtaskAllocatedTo = await TaskAllocatedModel.findById(
          taskallocatedtoid
        )
          .select("name")
          .lean();
      }

      // ✅ push to final array
      alltaskanalysisleads.push({
        ...lead,
        activityLog: populatedActivityLogs,
        allocatedTo: populatedtaskAllocatedTo,
      });
    }

    if (result && result.length) {
      return res
        .status(200)
        .json({ message: "lead found", data: alltaskanalysisleads });
    } else {
      return res
        .status(404)
        .json({ message: "no leads founds for match", data: [] });
    }
  } catch (error) {
    console.log("error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const GetallReallocatedLead = async (req, res) => {
  try {
    const { selectedBranch } = req.query;
    const branchObjectId = new mongoose.Types.ObjectId(selectedBranch);
    const query = { leadBranch: branchObjectId, reallocatedTo: true };

    const reallocatedLeads = await LeadMaster.find(query)
      .populate({ path: "customerName" })
      .populate({ path: "partner" })
      .lean();

    const populatedreallocatedLeads = await Promise.all(
      reallocatedLeads.map(async (lead) => {
        const submittedusermodel =
          lead.activityLog[lead.activityLog.length - 1];
        if (
          !lead.leadByModel ||
          !mongoose.models[lead.leadByModel] ||
          !submittedusermodel.submissiondoneByModel ||
          !mongoose.models[submittedusermodel.submissiondoneByModel]
        ) {
          console.error(`Model ${lead.leadByModel} is not registered`);
          console.error(`Model ${submittedusermodel} is not registered`);
          return lead; // Return lead as-is if model is invalid
        }

        // Fetch the referenced document manually
        const assignedModel = mongoose.model(lead.leadByModel);
        const submitteduserModel = mongoose.model(
          submittedusermodel.submissiondoneByModel
        );
        const populatedSubmitteduser = await submitteduserModel
          .findById(submittedusermodel.submittedUser)
          .select("name");
        const populatedLeadBy = await assignedModel
          .findById(lead.leadBy)
          .select("name");

        const lasttaskby =
          lead.activityLog[lead.activityLog.length - 1]?.taskBy;
        const populatedlasttaskBy = await Task.findById(lasttaskby)
          .select("taskName")
          .lean();

        return {
          ...lead,
          leadBy: populatedLeadBy,
          lasttask: populatedlasttaskBy,
          submittedUser: populatedSubmitteduser,
        }; // Merge populated data
      })
    );
    if (populatedreallocatedLeads) {
      return res.status(200).json({
        message: "reallocated leads found",
        data: populatedreallocatedLeads,
      });
    }
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const GetallleadOwned = async (req, res) => {
  try {
    const { selectedBranch } = req.query;
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const GetallLead = async (req, res) => {
  try {
    const { Status, selectedBranch, role } = req.query;
    const branchObjectId = new mongoose.Types.ObjectId(selectedBranch);

    if (!Status && !role) {
      return res.status(400).json({ message: "Status or role is missing " });
    }

    if (Status === "Pending") {
      //for getting pending leads means leads not to be allocated to someone
      const query = { leadBranch: branchObjectId, activityLog: { $size: 1 } };

      const pendingLeads = await LeadMaster.find(query)
        .populate({ path: "customerName", select: "customerName" })
        .lean();

      const populatedPendingLeads = await Promise.all(
        pendingLeads.map(async (lead) => {
          if (!lead.leadByModel || !mongoose.models[lead.leadByModel]) {
            console.error(`Model ${lead.leadByModel} is not registered`);
            return lead; // Return lead as-is if model is invalid
          }

          // Fetch the referenced document manually
          const assignedModel = mongoose.model(lead.leadByModel);
          const populatedLeadBy = await assignedModel
            .findById(lead.leadBy)
            .select("name");

          return { ...lead, leadBy: populatedLeadBy }; // Merge populated data
        })
      );
      if (populatedPendingLeads) {
        return res.status(200).json({
          message: "pending leads found",
          data: populatedPendingLeads,
        });
      }
    } else if (Status === "Approved") {
      const query = {
        leadBranch: branchObjectId,
        reallocatedTo: false,
        $and: [{ leadLost: { $ne: true } }, { leadClosed: { $ne: true } }],
        activityLog: { $exists: true, $not: { $size: 0 } },
        $expr: { $gte: [{ $size: "$activityLog" }, 2] },
      };
      const approvedAllocatedLeads = await LeadMaster.find(query)
        .populate({ path: "customerName", select: "customerName" })
        .lean();

      const populatedApprovedLeads = await Promise.all(
        approvedAllocatedLeads.map(async (lead) => {
          const lastMatchingActivity = [...(lead.activityLog || [])]
            .reverse()
            .find((log) => log.taskallocatedTo && log.taskallocatedBy);

          if (
            !lead.leadByModel ||
            !mongoose.models[lead.leadByModel] ||
            !lastMatchingActivity?.taskallocatedBy ||
            !lastMatchingActivity?.taskallocatedByModel ||
            !lastMatchingActivity?.taskallocatedTo ||
            !lastMatchingActivity?.taskallocatedToModel
          ) {
            console.error(`Model ${lead.leadByModel} is not registered`);
            console.error(
              `Model ${lastMatchingActivity?.taskallocatedByModel} is not registered`
            );
            console.error(
              `Model ${lastMatchingActivity?.taskallocatedToModel} is not registered`
            );
            return lead;
          }

          // Fetch the referenced documents
          const leadByModel = mongoose.model(lead.leadByModel);
          const allocatedToModel = mongoose.model(
            lastMatchingActivity.taskallocatedToModel
          );
          const allocatedByModel = mongoose.model(
            lastMatchingActivity.taskallocatedByModel
          );

          const populatedLeadBy = await leadByModel
            .findById(lead.leadBy)
            .select("name");
          const populatedAllocatedTo = await allocatedToModel
            .findById(lastMatchingActivity.taskallocatedTo)
            .select("name");
          const populatedAllocatedBy = await allocatedByModel
            .findById(lastMatchingActivity.taskallocatedBy)
            .select("name");

          // 🔹 Now populate every `submissiondonebyuser` in activityLog
          const populatedActivityLog = await Promise.all(
            (lead.activityLog || []).map(async (log) => {
              if (!log.submissiondoneByModel || !log.submissiondoneByModel) {
                return log; // skip if missing
              }

              // Make sure the model exists before querying
              if (!mongoose.models[log.submissiondoneByModel]) {
                console.error(
                  `Model ${log.submissiondoneByModel} not registered`
                );
                return log;
              }

              const submissionUserModel = mongoose.model(
                log.submissiondoneByModel
              );
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
          data: populatedApprovedLeads,
        });
      }
    }
  } catch (error) {
    console.log(error);
    console.log("error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// export const UpdateLeadfollowUpDate = async (req, res) => {
//   try {
//     const { formData, collectionupdatedata } = req.body;
//     console.log("formdata", formData)
//     console.log("collecton", collectionupdatedata)
//     return
//     const { selectedleaddocId, loggeduserid } = req.query;

//     let followedByModel;
//     const isStaff = await Staff.findOne({ _id: loggeduserid });
//     if (isStaff) {
//       followedByModel = "Staff";
//     } else {
//       const isAdmin = await Admin.findOne({ _id: loggeduserid });
//       if (isAdmin) {
//         followedByModel = "Admin";
//       }
//     }
//     if (!followedByModel) {
//       return res.status(400).json({ message: "Invalid followedid reference" });
//     }
//     if (formData.followupType === "closed") {
//       await LeadMaster.updateOne(
//         { _id: selectedleaddocId },

//         {
//           $set: {
//             "activityLog.$[elem].reallocatedTo": true,
//             "activityLog.$[elem].taskClosed": true,
//             "activityLog.$[elem].followupClosed": true,
//           },
//         },
//         {
//           arrayFilters: [
//             {
//               "elem.taskTo": { $exists: true },
//               "elem.reallocatedTo": false,
//               "elem.taskClosed": false,
//               "elem.followupClosed": false,
//             },
//           ],
//         }
//       );
//     }
//     const allocationTask = await Task.findOne({ taskName: "Closing" });
//     const activityEntry = {
//       submissionDate: formData.followUpDate,
//       submittedUser: loggeduserid,
//       submissiondoneByModel: followedByModel,
//       taskBy: allocationTask?._id,
//       nextFollowUpDate: formData?.nextfollowUpDate,
//       remarks: formData.Remarks,
//       taskfromFollowup: false,
//     };

//     // Conditionally add fields only if `closed` is true
//     if (formData.followupType === "closed") {
//       activityEntry.taskClosed = true;
//       activityEntry.followupClosed = true;
//       activityEntry.reallocatedTo = true;
//     } else if (formData.followupType === "lost") {
//       activityEntry.taskClosed = true;
//     }
//     const updatefollowUpDate = await LeadMaster.findOneAndUpdate(
//       { _id: selectedleaddocId },
//       {
//         $push: {
//           activityLog: activityEntry,
//         },

//         reallocatedTo: formData.followupType === "closed",
//         ...(formData.followupType === "closed" && {
//           leadConvertedDate: new Date()
//         }),
//         ...(formData.followupType === "lost" && {
//           leadLostDate: new Date(),
//           leadLost: true
//         }),
//       },

//       { upsert: true }
//     );
//     const normalizedpaymentEntries = collectionupdatedata.paymentEntries.map((e) => ({
//       productorServiceId: e.productorServiceId,
//       productorServicemodel: e.productorServicemodel,
//       netAmount: Number(e.netAmount || 0),
//       receivedAmount: Number(e.receivedAmount || 0),
//       balanceAmount: Number(e.balanceAmount || 0)
//     }))
//     const receivedAmount = Number(
//       collectionupdatedata?.totalReceivedAmount ??
//       collectionupdatedata?.totalReceivedAmount ??
//       0
//     )
//     const paymentRecord = {
//       paymentDate: new Date(),
//       receivedAmount,
//       paymentVerified: false,
//       paymentEntries: normalizedPaymentEntries,
//       receivedBy: collectionupdatedata?.receivedBy,
//       receivedModel:
//         collectionupdatedata?.receivedModel,
//       bankRemarks:
//         collectionupdatedata?.bankRemark ?? formData?.bankRemarks ?? "",
//       updatedAt: new Date()
//     }
//     if (updatefollowUpDate) {
//       updatefollowUpDate.paymentHistory.push({
//         ...paymentRecord,
//         createdAt: new Date()
//       })
//       return res.status(200).json({ message: "Update followupDate" });
//     }
//   } catch (error) {
//     console.log("errrr:", error);
//     console.log("error:", error.message);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };


export const UpdateLeadfollowUpDate = async (req, res) => {
  try {
    const { formData, collectionupdatedata } = req.body;
    const { selectedleaddocId, loggeduserid } = req.query;

    if (!selectedleaddocId || !loggeduserid) {
      return res.status(400).json({ message: "Missing lead or user reference" });
    }

    if (!formData || !formData.followupType) {
      return res.status(400).json({ message: "Missing followup data" });
    }

    // 1) Resolve followedByModel
    let followedByModel = null;

    const isStaff = await Staff.findById(loggeduserid).lean();
    if (isStaff) {
      followedByModel = "Staff";
    } else {
      const isAdmin = await Admin.findById(loggeduserid).lean();
      if (isAdmin) {
        followedByModel = "Admin";
      }
    }

    if (!followedByModel) {
      return res.status(400).json({ message: "Invalid followed user reference" });
    }

    // 2) If lead is being closed, mark the last open followup in activityLog as closed
    if (formData.followupType === "closed") {
      await LeadMaster.updateOne(
        { _id: selectedleaddocId },
        {
          $set: {
            "activityLog.$[elem].reallocatedTo": true,
            "activityLog.$[elem].taskClosed": true,
            "activityLog.$[elem].followupClosed": true
          }
        },
        {
          arrayFilters: [
            {
              "elem.taskTo": { $exists: true },
              "elem.reallocatedTo": false,
              "elem.taskClosed": false,
              "elem.followupClosed": false
            }
          ]
        }
      );
    }

    // 3) Build new activityLog entry
    const allocationTask = await Task.findOne({ taskName: "Closing" }).lean();

    const activityEntry = {
      submissionDate: formData.followUpDate,
      submittedUser: loggeduserid,
      submissiondoneByModel: followedByModel,
      taskBy: allocationTask?._id || null,
      nextFollowUpDate: formData?.nextfollowUpDate,
      remarks: formData.Remarks,
      taskfromFollowup: false
    };

    if (formData.followupType === "closed") {
      activityEntry.taskClosed = true;
      activityEntry.followupClosed = true;
      activityEntry.reallocatedTo = true;
    } else if (formData.followupType === "lost") {
      activityEntry.taskClosed = true;
    }

    // 4) Build payment record (if any)
    let paymentRecord = null;

    if (collectionupdatedata && Array.isArray(collectionupdatedata.paymentEntries)) {
      const normalizedPaymentEntries = collectionupdatedata.paymentEntries.map((e) => ({
        productorServiceId: e.productorServiceId,
        productorServicemodel: e.productorServicemodel,
        netAmount: Number(e.netAmount || 0),
        receivedAmount: Number(e.receivedAmount || 0),
        balanceAmount: Number(e.balanceAmount || 0)
      }));

      const receivedAmount = Number(collectionupdatedata?.totalReceivedAmount ?? 0);

      // only create record if there is some payment info
      if (normalizedPaymentEntries.length > 0 || receivedAmount > 0) {
        paymentRecord = {
          paymentDate: new Date(),
          receivedAmount,
          paymentVerified: false,
          paymentEntries: normalizedPaymentEntries,
          receivedBy: collectionupdatedata?.receivedBy || null,
          receivedModel: collectionupdatedata?.receivedModel || null,
          bankRemarks:
            collectionupdatedata?.bankRemark ?? formData?.bankRemarks ?? "",
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }
    }

    // 5) Build update doc with $push + $set
    const updateDoc = {
      $push: {
        activityLog: activityEntry
      },
      $set: {}
    };

    // top-level flags for lead
    if (formData.followupType === "closed") {
      updateDoc.$set.reallocatedTo = true;
      updateDoc.$set.leadConvertedDate = new Date();
    }

    if (formData.followupType === "lost") {
      updateDoc.$set.leadLost = true;
      updateDoc.$set.leadLostDate = new Date();
    }

    if (paymentRecord) {
      updateDoc.$push.paymentHistory = paymentRecord;
    }

    // remove empty $set/$push if nothing inside (to avoid Mongo errors)
    if (Object.keys(updateDoc.$set).length === 0) delete updateDoc.$set;
    if (Object.keys(updateDoc.$push).length === 0) delete updateDoc.$push;

    const updatedLead = await LeadMaster.findOneAndUpdate(
      { _id: selectedleaddocId },
      updateDoc,
      {
        upsert: false,
        returnDocument: "after"
      }
    );

    if (!updatedLead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    return res.status(200).json({
      message: "Followup updated successfully",
      data: updatedLead
    });
  } catch (error) {
    console.log("UpdateLeadfollowUpDate error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const LeadClosing = async (req, res) => {
  try {
    const { leadId, allocationType, allocatedBy } = req.query;
    const { formData } = req.body;
    const isStaff = await Staff.findOne({ _id: allocatedBy });
    const isAdmin = await Admin.findOne({ _id: allocatedBy });
    let leadClosedModel;
    if (isStaff) {
      leadClosedModel = "Staff";
    } else {
      if (isAdmin) {
        leadClosedModel = "Admin";
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
        allocationType: allocationType,
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "No lead found" });
    }

    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: "Balance amount not changed" });
    }

    return res
      .status(200)
      .json({ message: "Lead closed successfully with payment" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const UpdateOrleadallocationTask = async (req, res) => {
  try {
    const { allocationpending, allocatedBy, allocationType } = req.query;

    const allocatedbyObjectid = new mongoose.Types.ObjectId(allocatedBy);
    const { selectedItem, formData } = req.body;

    let allocatedToModel;
    let allocatedByModel;

    const isStaffallocatedtomodel = await Staff.findOne({
      _id: selectedItem.allocatedTo,
    });

    if (isStaffallocatedtomodel) {
      allocatedToModel = "Staff";
    } else {
      const isAdminallocatedtomodel = await Admin.findOne({
        _id: selectedItem.allocatdTo,
      });
      if (isAdminallocatedtomodel) {
        allocatedToModel = "Admin";
      }
    }
    const isStaffallocatedbymodel = await Staff.findOne({
      _id: allocatedbyObjectid,
    });
    if (isStaffallocatedbymodel) {
      allocatedByModel = "Staff";
    } else {
      const isAdminallocatedbymodel = await Admin.findOne({
        _id: allocatedbyObjectid,
      });
      if (isAdminallocatedbymodel) {
        allocatedByModel = "Admin";
      }
    }

    if (!allocatedToModel || !allocatedByModel) {
      return res
        .status(400)
        .json({ message: "Invalid allocated/allocatedby reference" });
    }
    const updatedLead = await LeadMaster.findByIdAndUpdate(
      {
        _id: selectedItem._id,
      },
      {
        allocatedTo: selectedItem.allocatedTo,
        allocatedBy,
        allocatedToModel,
        allocatedByModel,
        allocationType,
        task: [
          {
            allocationDate: formData.allocationDate,
            allocatedTo: selectedItem.allocatedTo,
            taskallocatedToModel: allocatedToModel,
            allocatedBy,
            taskallocatedByModel: allocatedByModel,
            allocationDescription: formData.allocationDescription,
          },
        ],
      },
      { new: true }
    );
    if (allocationpending === "true" && updatedLead) {
      const pendingLeads = await LeadMaster.find({
        allocatedTo: null,
      })
        .populate({ path: "customerName", select: "customerName" })
        .lean();

      const populatedLeads = await Promise.all(
        pendingLeads.map(async (lead) => {
          if (
            !lead.assignedtoleadByModel ||
            !mongoose.models[lead.assignedtoleadByModel]
          ) {
            console.error(
              `Model ${lead.assignedtoleadByModel} is not registered`
            );
            return lead; // Return lead as-is if model is invalid
          }

          // Fetch the referenced document manually
          const assignedModel = mongoose.model(lead.assignedtoleadByModel);
          const populatedLeadBy = await assignedModel
            .findById(lead.leadBy)
            .select("name");

          return { ...lead, leadBy: populatedLeadBy }; // Merge populated data
        })
      );
      return res
        .status(201)
        .json({ message: "pending leads found", data: populatedLeads });
    } else if (allocationpending === "false") {
      const allocatedLeads = await LeadMaster.find({
        allocatedTo: { $ne: null },
      })
        .populate({ path: "customerName", select: "customerName" })
        .lean();

      const populatedLeads = await Promise.all(
        allocatedLeads.map(async (lead) => {
          if (
            !lead.assignedtoleadByModel ||
            !mongoose.models[lead.assignedtoleadByModel]
          ) {
            console.error(
              `Model ${lead.assignedtoleadByModel} is not registered`
            );
            return lead; // Return lead as-is if model is invalid
          }

          // Fetch the referenced document manually
          const assignedModel = mongoose.model(lead.assignedtoleadByModel);
          const populatedLeadBy = await assignedModel
            .findById(lead.leadBy)
            .select("name");

          return { ...lead, leadBy: populatedLeadBy }; // Merge populated data
        })
      );
      return res
        .status(201)
        .json({ message: "updated allocation", data: populatedLeads });
    }
  } catch (error) {
    console.log("error:", error.message);
  }
  return res.status(500).json({ message: "Internal server error" });
};
export const updateReallocation = async (req, res) => {
  try {
    const { allocatedBy, selectedbranch, allocationTypeId, allocationName } = req.query;
    const allocatedbyObjectid = new mongoose.Types.ObjectId(allocatedBy);
    // const branchObjectId = new mongoose.Types.ObjectId(selectedbranch)
    const { selectedItem, formData } = req.body;
    let allocatedToModel;
    let allocatedByModel;
    const isStaffallocatedtomodel = await Staff.findOne({
      _id: selectedItem.allocatedTo,
    });
    if (isStaffallocatedtomodel) {
      allocatedToModel = "Staff";
    } else {
      const isAdminallocatedtomodel = await Admin.findOne({
        _id: selectedItem.allocatedTo,
      });
      if (isAdminallocatedtomodel) {
        allocatedToModel = "Admin";
      }
    }
    const isStaffallocatedbymodel = await Staff.findOne({
      _id: allocatedbyObjectid,
    });
    if (isStaffallocatedbymodel) {
      allocatedByModel = "Staff";
    } else {
      const isAdminallocatedbymodel = await Admin.findOne({
        _id: allocatedbyObjectid,
      });
      if (isAdminallocatedbymodel) {
        allocatedByModel = "Admin";
      }
    }
    if (!allocatedToModel || !allocatedByModel) {
      return res
        .status(400)
        .json({ message: "Invalid allocated/allocatedby reference" });
    }

    const matchedTask = await Task.findOne({ taskName: "Reallocation" })
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
      taskBy: matchedTask?._id,
      taskTo: allocationName.toLowerCase(),
      taskId: allocationTypeId,
      allocationChanged: false,
      taskfromFollowup: false,
    };
    if (allocationName.toLowerCase() === "followup") {
      activityLogEntry.followupClosed = false;
    }
    // return
    const updatedLead = await LeadMaster.findByIdAndUpdate(
      {
        _id: selectedItem._id,
      },

      {
        $push: {
          activityLog: activityLogEntry,
        },
        $set: {
          allocationType: allocationTypeId, // Set outside the activityLog array
          reallocatedTo: false,
          dueDate: formData.allocationDate,
        },
      },

      { new: true }
    );
    if (updatedLead) {
      return res.status(200).json({ message: "Re allocated successfully" });
    } else {
      return res.status(404).json({ message: "something went wrong" });
    }
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
};
export const UpadateOrLeadAllocationRegister = async (req, res) => {
  try {
    const {
      allocationpending,
      allocatedBy,
      allocationTypeName,
      selectedbranch,
      allocationtypeId,
    } = req.query;
    const allocatedbyObjectid = new mongoose.Types.ObjectId(allocatedBy);
    const branchObjectId = new mongoose.Types.ObjectId(selectedbranch);
    const { selectedItem, cleanedData } = req.body;

    let allocatedToModel;
    let allocatedByModel;
    const isStaffallocatedtomodel = await Staff.findOne({
      _id: selectedItem.allocatedTo,
    });
    if (isStaffallocatedtomodel) {
      allocatedToModel = "Staff";
    } else {
      const isAdminallocatedtomodel = await Admin.findOne({
        _id: selectedItem.allocatedTo,
      });
      if (isAdminallocatedtomodel) {
        allocatedToModel = "Admin";
      }
    }
    const isStaffallocatedbymodel = await Staff.findOne({
      _id: allocatedbyObjectid,
    });
    if (isStaffallocatedbymodel) {
      allocatedByModel = "Staff";
    } else {
      const isAdminallocatedbymodel = await Admin.findOne({
        _id: allocatedbyObjectid,
      });
      if (isAdminallocatedbymodel) {
        allocatedByModel = "Admin";
      }
    }
    if (!allocatedToModel || !allocatedByModel) {
      return res
        .status(400)
        .json({ message: "Invalid allocated/allocatedby reference" });
    }

    const matchLead = await LeadMaster.findOne({ _id: selectedItem._id });
    const allocationTask = await Task.findOne({ taskName: "Allocation" });
    if (!allocationTask) {
      return res.status(404).json({ message: "allocation taskname not found" });
    }
    if (matchLead.activityLog.length === 1) {
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
        taskBy: allocationTask?._id,
        taskTo: allocationTypeName.toLowerCase(),
        taskId: allocationtypeId,

        allocationChanged: false,
        taskfromFollowup: false,
      };

      // Conditionally add allocationDate
      if (allocationTypeName.toLowerCase() !== "followup") {
        activityLogEntry.allocationDate = cleanedData.allocationDate;
        // activityLogEntry.taskfromFollowup = false
      } else if (allocationTypeName.toLowerCase() === "followup") {
        activityLogEntry.followupClosed = false;
      }
      await LeadMaster.findByIdAndUpdate(
        { _id: selectedItem._id },
        {
          $push: {
            activityLog: activityLogEntry,
          },
          $set: {
            allocationType: allocationtypeId,
            taskfromFollowup: false,
            dueDate: cleanedData.allocationDate,
          },
        },
        { new: true }
      );
    } else if (matchLead.activityLog.length >= 2) {
      // Find index in activityLog that matches the criteria
      const matchingIndex = matchLead.activityLog.findIndex(
        (log) =>
          log.reallocatedTo === false &&
          log.taskClosed === false &&
          // log.followupClosed === false &&
          log.allocatedClosed === false &&
          log.taskTo // ensures the field exists
      );
      const task = matchLead.activityLog[matchingIndex]?.taskId;
      if (task !== allocationtypeId) {
        return res.status(409).json({
          message:
            "Cannot change task name. It's already running.only possible to change the allocatedUser",
        });
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
        taskBy: allocationTask?._id,
        taskTo: allocationTypeName.toLowerCase(),
        taskId: allocationtypeId,
        taskfromFollowup: false,
        taskClosed: false,
        followupClosed: false,
        allocatedClosed: false,
        allocationChanged: false,
      };
      if (allocationTypeName.toLowerCase() !== "followup") {
        activityLogEntry.allocationDate = cleanedData.allocationDate;
        // activityLogEntry.taskfromFollowup = false
      }
      matchLead.dueDate = cleanedData.allocationDate;

      // Push new log
      matchLead.activityLog.push(activityLogEntry);

      await matchLead.save();
    }

    if (allocationpending === "true") {
      const pendingLeads = await LeadMaster.find({
        leadBranch: branchObjectId,
        activityLog: { $size: 1 },
      })
        .populate({ path: "customerName", select: "customerName" })
        .lean();

      const populatedLeads = await Promise.all(
        pendingLeads.map(async (lead) => {
          if (!lead.leadByModel || !mongoose.models[lead.leadByModel]) {
            console.error(`Model ${lead.leadByModel} is not registered`);
            return lead; // Return lead as-is if model is invalid
          }

          // Fetch the referenced document manually
          const assignedModel = mongoose.model(lead.leadByModel);
          const populatedLeadBy = await assignedModel
            .findById(lead.leadBy)
            .select("name");

          return { ...lead, leadBy: populatedLeadBy }; // Merge populated data
        })
      );
      return res
        .status(201)
        .json({ message: "Allocate successfully", data: populatedLeads });
    } else if (allocationpending === "false") {
      const allocatedLeads = await LeadMaster.find({
        allocatedTo: { $ne: null },
      })
        .populate({ path: "customerName", select: "customerName" })
        .lean();

      const populatedLeads = await Promise.all(
        allocatedLeads.map(async (lead) => {
          if (!lead.leadByModel || !mongoose.models[lead.leadByModel]) {
            console.error(`Model ${lead.leadByModel} is not registered`);
            return lead; // Return lead as-is if model is invalid
          }

          // Fetch the referenced document manually
          const assignedModel = mongoose.model(lead.leadByModel);
          const populatedLeadBy = await assignedModel
            .findById(lead.leadBy)
            .select("name");

          return { ...lead, leadBy: populatedLeadBy }; // Merge populated data
        })
      );
      return res
        .status(201)
        .json({ message: "updated allocation", data: populatedLeads });
    }
  } catch (error) {
    console.log("error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const UpdateLeadTask = async (req, res) => {
  try {
    const taskDetails = req.body;
    const leadObjectId = new mongoose.Types.ObjectId(taskDetails.leadDocId);
    const lead = await LeadMaster.findById(leadObjectId);
    const activityLog = [...lead.activityLog];
    const Index = activityLog.length - 1;
    const updateFields = {
      [`activityLog.${Index}.taskSubmissionDate`]: taskDetails.submissionDate,
      [`activityLog.${Index}.taskDescription`]: taskDetails.taskDescription,
      [`activityLog.${Index}.taskClosed`]: true,
    };

    // Conditionally add a field
    if (!taskDetails.taskfromFollowup) {
      updateFields[`activityLog.${Index}.reallocatedTo`] = true;
    }
    await LeadMaster.updateOne({ _id: leadObjectId }, { $set: updateFields });
    const isTaskfromFollowup = taskDetails.taskfromFollowup ? true : false;
    // 2️⃣ 🔑 UPDATE allocationlist = false for matching followup tasks
    await LeadMaster.collection.updateOne(
      { _id: leadObjectId },
      {
        $set: {
          "activityLog.$[log].allocationlist": false  // Set to false
        }
      },
      {
        arrayFilters: [
          {
            "log.taskTo": "followup",
            "log.taskClosed": false,      // ✅ Your condition
            "log.allocationlist": true    // ✅ Your condition
          }
        ]
      }
    );

    // Build the activity log entry
    const activityLogEntry = {
      submissionDate: taskDetails.submissionDate,
      submittedUser: taskDetails.allocatedTo,
      submissiondoneByModel: taskDetails.allocatedtomodel,
      remarks: taskDetails.taskDescription,
      taskBy: taskDetails.taskName,
      taskClosed: true,
      taskfromFollowup: isTaskfromFollowup,
      allocatedClosed: isTaskfromFollowup,
      reallocatedTo: !isTaskfromFollowup,
    };

    const updateleadTask = await LeadMaster.findByIdAndUpdate(leadObjectId, {
      $push: {
        activityLog: activityLogEntry,
      },
      $set: {
        taskfromFollowup: false,
        reallocatedTo: !isTaskfromFollowup,
      },
    });
    if (updateleadTask) {
      return res.status(201).json({ message: "submitted succesfully" });
    } else {
      return res.status(404).json({ message: "something went wrong" });
    }
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const GetrespectedleadTask = async (req, res) => {
  try {
    const { userid, branchSelected, role, ownTask } = req.query;

    const userObjectId = new mongoose.Types.ObjectId(userid);
    const branchObjectId = new mongoose.Types.ObjectId(branchSelected);
    const isAdminOrManager = role === "Admin" || role === "Manager";
    const query = {
      leadBranch: branchObjectId,
      activityLog: {
        $elemMatch: {
          ...(isAdminOrManager ? {} : { taskallocatedTo: userObjectId }), //conditionally include
          allocationChanged: false,
          taskTo: {
            $ne: "followup",
          },
        },
      },
    };

    const selectedfollowup = await LeadMaster.find(query)
      .populate({ path: "customerName", select: "customerName" })
      .lean();

    const taskLeads = [];
    if (ownTask === "false") {
      for (const lead of selectedfollowup) {
        let lastAllocatedItem = null;

        // Populate activityLog
        lead.activityLog = await Promise.all(
          lead.activityLog.map(async (item) => {
            // ✅ Track latest allocation (even followup)
            if (item?.taskallocatedTo) {
              lastAllocatedItem = item;
            }


            let populatedSubmittedUser = null;
            let populatedTaskAllocatedTo = null;
            let populatedTask = null
            let populatedtaskBy = null;

            if (
              item.submittedUser &&
              item.submissiondoneByModel &&
              mongoose.models[item.submissiondoneByModel]
            ) {
              const model = mongoose.model(item.submissiondoneByModel);
              populatedSubmittedUser = await model
                .findById(item.submittedUser)
                .select("name")
                .lean();
            }

            if (
              item.taskallocatedTo &&
              item.taskallocatedToModel &&
              mongoose.models[item.taskallocatedToModel]
            ) {
              const model = mongoose.model(item.taskallocatedToModel);
              populatedTaskAllocatedTo = await model
                .findById(item.taskallocatedTo)
                .select("name")
                .lean();
            }
            if (item?.taskId) {
              populatedTask = await Task.findById(item.taskId)
                .select("taskName")
                .lean();
            }
            if (item?.taskBy && isValidObjectId(item?.taskBy)) {
              populatedtaskBy = await Task.findById(item?.taskBy)
                .select("taskName")
                .lean();
            }

            return {
              ...item,
              taskBy: populatedtaskBy,
              taskId: populatedTask,
              submittedUser: populatedSubmittedUser || item.submittedUser,
              taskallocatedTo:
                populatedTaskAllocatedTo || item.taskallocatedTo,
            };
          })
        );

        // ✅ Populate top-level allocatedTo / allocatedBy (even if followup)
        if (lastAllocatedItem) {
          let populatedAllocatedTo = null;
          let populatedAllocatedBy = null;

          if (
            lastAllocatedItem.taskallocatedTo &&
            lastAllocatedItem.taskallocatedToModel &&
            mongoose.models[lastAllocatedItem.taskallocatedToModel]
          ) {
            const model = mongoose.model(
              lastAllocatedItem.taskallocatedToModel
            );
            populatedAllocatedTo = await model
              .findById(lastAllocatedItem.taskallocatedTo)
              .select("name")
              .lean();
          }

          if (
            lastAllocatedItem.taskallocatedBy &&
            lastAllocatedItem.taskallocatedByModel &&
            mongoose.models[lastAllocatedItem.taskallocatedByModel]
          ) {
            const model = mongoose.model(
              lastAllocatedItem.taskallocatedByModel
            );
            populatedAllocatedBy = await model
              .findById(lastAllocatedItem.taskallocatedBy)
              .select("name")
              .lean();
          }
          const leadByModel = mongoose.model(lead.leadByModel);
          const populatedLeadBy = await leadByModel
            .findById(lead.leadBy)
            .select("name")
            .lean();
          lead.leadBy = populatedLeadBy;
          lead.taskallocatedTo = populatedAllocatedTo;
          lead.taskallocatedBy = populatedAllocatedBy;
        }

        // ✅ Finally, push the fully populated lead to taskLeads
        taskLeads.push(lead);
      }
    } else {
      for (const lead of selectedfollowup) {
        const matchedallocation = lead.activityLog.filter(
          (item) =>
            item?.taskallocatedTo?.equals(userid) &&
            item?.taskTo !== "followup" &&
            !item?.allocationChanged
        );

        if (matchedallocation && matchedallocation.length > 0) {
          // Populate outer fields
          const leadByModel = mongoose.model(lead.leadByModel);
          const allocatedToModel = mongoose.model(
            matchedallocation[0].taskallocatedToModel
          );
          const allocatedByModel = mongoose.model(
            matchedallocation[0].taskallocatedByModel
          );

          const populatedLeadBy = await leadByModel
            .findById(lead.leadBy)
            .select("name")
            .lean();
          const populatedAllocatedTo = await allocatedToModel
            .findById(matchedallocation[0].taskallocatedTo)
            .select("name")
            .lean();
          const populatedAllocatedBy = await allocatedByModel
            .findById(matchedallocation[0].taskallocatedBy)
            .select("name")
            .lean();

          // Populate activityLog (submittedUser, etc.)
          const populatedActivityLog = await Promise.all(
            lead.activityLog.map(async (log) => {
              let populatedSubmittedUser = null;
              let populatedTaskAllocatedTo = null;
              let populatedTask = null;
              let populatedtaskBy = null;

              if (
                log.submittedUser &&
                log.submissiondoneByModel &&
                mongoose.models[log.submissiondoneByModel]
              ) {
                const model = mongoose.model(log.submissiondoneByModel);
                populatedSubmittedUser = await model
                  .findById(log.submittedUser)
                  .select("name")
                  .lean();
              }

              if (
                log.taskallocatedTo &&
                log.taskallocatedToModel &&
                mongoose.models[log.taskallocatedToModel]
              ) {
                const model = mongoose.model(log.taskallocatedToModel);
                populatedTaskAllocatedTo = await model
                  .findById(log.taskallocatedTo)
                  .select("name")
                  .lean();
              }
              if (log?.taskId) {
                populatedTask = await Task.findById(log.taskId)
                  .select("taskName")
                  .lean();
              }
              if (log?.taskBy && isValidObjectId(log.taskBy)) {
                populatedtaskBy = await Task.findById(log.taskBy)
                  .select("taskName")
                  .lean();
              }
              return {
                ...log,
                taskBy: populatedtaskBy,
                taskId: populatedTask,
                submittedUser: populatedSubmittedUser || log.submittedUser,
                taskallocatedTo:
                  populatedTaskAllocatedTo || log.taskallocatedTo,
              };
            })
          );
          taskLeads.push({
            ...lead,
            leadBy: populatedLeadBy || lead.leadBy,
            taskallocatedTo: populatedAllocatedTo,
            taskallocatedBy: populatedAllocatedBy,
            activityLog: populatedActivityLog,
          });
        }
      }
    }

    if (taskLeads && taskLeads.length === 0) {
      return res
        .status(200)
        .json({ message: "No Task found", data: taskLeads });
    } else {
      return res.status(201).json({ messge: "Task found", data: taskLeads });
    }
  } catch (error) {
    console.log("error", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const GetselectedLeadData = async (req, res) => {
  try {
    const { leadId } = req.query;
    if (!leadId) {
      return res.status(400).json({ message: "No leadid reference exists" });
    }
    const selectedLead = await LeadMaster.findById({ _id: leadId })
      .populate({
        path: "customerName",
        populate: {
          path: "partner"
        }
      })
      .lean();

    if (
      !selectedLead.leadByModel ||
      !mongoose.models[selectedLead.leadByModel]
    ) {
      console.error(
        `Model ${selectedLead.assignedtoleadByModel} is not registered`
      );
      console.error(`Model ${selectedLead.allocatedToModel} is not registered`);
      // return selectedLead
      const populatedLeads = await Promise.all(
        selectedLead.leadFor.map(async (item) => {
          const productorserviceModel = mongoose.model(
            item.productorServicemodel
          );
          const populatedProductorService = await productorserviceModel
            .findById(item.productorServiceId)
            .lean(); // Use lean() to get plain JavaScript objects

          return { ...item, productorServiceId: populatedProductorService };
        })
      );

      const mergedleads = { ...selectedLead, leadFor: populatedLeads };
      return res
        .status(200)
        .json({ message: "matched lead found", data: [mergedleads] });
    } else {
      // Fetch the referenced document manually
      const assignedModel = mongoose.model(selectedLead.leadByModel);

      const populatedLeadBy = await assignedModel
        .findById(selectedLead.leadBy)
        .select("name");

      const populatedLeadFor = await Promise.all(
        selectedLead.leadFor.map(async (item) => {
          const productorserviceModel = mongoose.model(
            item.productorServicemodel
          );
          const populatedProductorService = await productorserviceModel
            .findById(item.productorServiceId)
            .lean(); // Use lean() to get plain JavaScript objects

          return { ...item, productorServiceId: populatedProductorService };
        })
      );

      const populatedApprovedLead = {
        ...selectedLead, // convert Mongoose doc to plain object
        leadFor: populatedLeadFor,
        leadBy: populatedLeadBy,
      };
      if (populatedApprovedLead) {
        return res.status(200).json({
          message: "matched lead found",
          data: [populatedApprovedLead],
        });
      }
    }
  } catch (error) {
    console.log("error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const GetallfollowupListfromFollowupSummary = async (req, res) => {
  try {
    const {
      loggeduserid,
      branchSelected,
      role,
      pendingfollowup,
      type          // 'dueToday' | 'overdue' | 'future' | 'converted' | 'lost'
    } = req.query

    const userObjectId = new mongoose.Types.ObjectId(loggeduserid)
    const branchObjectId = new mongoose.Types.ObjectId(branchSelected)

    // base query for leads (same as your old find query)
    let baseMatch
    if (pendingfollowup === "true") {
      if (role === "Admin") {
        baseMatch = {
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
          leadLost: false
        }
      } else {
        baseMatch = {
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
          leadLost: false
        }
      }
    } else if (pendingfollowup === "false") {
      if (role === "Admin") {
        baseMatch = {
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
          leadLost: false
        }
      } else {
        baseMatch = {
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
          leadLost: false
        }
      }
    } else {
      // default: no pending filter
      baseMatch = {
        leadBranch: branchObjectId
      }
    }

    const start = new Date(req.query.startDate)
    start.setHours(0, 0, 0, 0)

    const end = new Date(req.query.endDate)
    end.setHours(23, 59, 59, 999)

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)

    // map query type -> flag field
    const flagFieldMap = {
      dueToday: "dueToday",
      overdue: "overdue",
      future: "future",
      converted: "isConverted",
      lost: "isLost"
    }
    const flagField = type ? flagFieldMap[type] : null

    // aggregation: compute flags at lead level and filter by flagField if given
    const leadsWithFlags = await LeadMaster.aggregate([
      { $match: baseMatch },

      // pick only followup logs
      {
        $addFields: {
          followupLogs: {
            $filter: {
              input: "$activityLog",
              as: "log",
              cond: { $eq: ["$$log.taskTo", "followup"] }
            }
          }
        }
      },

      // last followup log
      {
        $addFields: {
          lastActivity: { $arrayElemAt: ["$followupLogs", -1] }
        }
      },

      {
        $addFields: {
          nextFollowupDate: "$lastActivity.nextFollowUpDate"
        }
      },

      // compute flags (your requested block)
      {
        $addFields: {
          dueToday: {
            $cond: [
              {
                $and: [
                  { $gte: ["$nextFollowupDate", todayStart] },
                  { $lte: ["$nextFollowupDate", todayEnd] }
                ]
              },
              1,
              0
            ]
          },
          overdue: {
            $cond: [{ $lt: ["$nextFollowupDate", todayStart] }, 1, 0]
          },
          future: {
            $cond: [{ $gt: ["$nextFollowupDate", todayEnd] }, 1, 0]
          },
          isConverted: {
            $cond: [
              {
                $and: [
                  { $ne: ["$leadConvertedDate", null] },
                  { $gte: ["$leadConvertedDate", start] },
                  { $lte: ["$leadConvertedDate", end] }
                ]
              },
              1,
              0
            ]
          },
          isLost: {
            $cond: [
              {
                $and: [
                  { $ne: ["$leadLostDate", null] },
                  { $gte: ["$leadLostDate", start] },
                  { $lte: ["$leadLostDate", end] }
                ]
              },
              1,
              0
            ]
          }
        }
      },

      // filter by flag if type is given
      ...(flagField
        ? [
          {
            $match: {
              [flagField]: 1
            }
          }
        ]
        : []),

      // we still want full LeadMaster docs for populate & post-processing
      { $project: { /* keep everything */ } }
    ])

    // now reuse your old enrichment logic on leadsWithFlags instead of find(query)
    const followupLeads = []
    for (const lead of leadsWithFlags) {
      // === your existing code from selectedfollowup loop, unchanged ===
      const activity = Array.isArray(lead.activityLog) ? lead.activityLog : []
      const matchedAllocations = activity
        .map((item, index) => ({ ...item, index }))
        .filter((item) => item.taskTo === "followup")

      if (matchedAllocations.length === 0) continue

      const lastAlloc = matchedAllocations[matchedAllocations.length - 1]
      const lastIndex = lastAlloc.index

      if (
        !lead.leadByModel ||
        !mongoose.models[lead.leadByModel] ||
        !lastAlloc.taskallocatedToModel ||
        !mongoose.models[lastAlloc.taskallocatedToModel] ||
        !lastAlloc.taskallocatedByModel ||
        !mongoose.models[lastAlloc.taskallocatedByModel]
      ) {
        continue
      }

      const leadByModel = mongoose.model(lead.leadByModel)
      const allocatedToModel = mongoose.model(lastAlloc.taskallocatedToModel)
      const allocatedByModel = mongoose.model(lastAlloc.taskallocatedByModel)

      const [popLeadBy, popAllocatedTo, popAllocatedBy] = await Promise.all([
        leadByModel
          .findById(lead.leadBy)
          .select("name")
          .lean()
          .catch(() => null),
        allocatedToModel
          .findById(lastAlloc.taskallocatedTo)
          .select("name")
          .lean()
          .catch(() => null),
        allocatedByModel
          .findById(lastAlloc.taskallocatedBy)
          .select("name")
          .lean()
          .catch(() => null)
      ])

      const populatedActivityLog = await Promise.all(
        activity.map(async (log) => {
          let populatedSubmittedUser = null
          let populatedTaskAllocatedTo = null
          let populatedTaskAllocatedBy = null
          let populatedTask = null
          let populatedTaskBy = null

          if (
            log.submittedUser &&
            log.submissiondoneByModel &&
            mongoose.models[log.submissiondoneByModel]
          ) {
            const model = mongoose.model(log.submissiondoneByModel)
            populatedSubmittedUser = await model
              .findById(log.submittedUser)
              .select("name")
              .lean()
              .catch(() => null)
          }

          if (
            log.taskallocatedBy &&
            log.taskallocatedByModel &&
            mongoose.models[log.taskallocatedByModel]
          ) {
            const model = mongoose.model(log.taskallocatedByModel)
            populatedTaskAllocatedBy = await model
              .findById(log.taskallocatedBy)
              .select("name")
              .lean()
              .catch(() => null)
          }

          if (
            log.taskallocatedTo &&
            log.taskallocatedToModel &&
            mongoose.models[log.taskallocatedToModel]
          ) {
            const model = mongoose.model(log.taskallocatedToModel)
            populatedTaskAllocatedTo = await model
              .findById(log.taskallocatedTo)
              .select("name")
              .lean()
              .catch(() => null)
          }

          if (log?.taskId) {
            populatedTask = await Task.findById(log.taskId)
              .select("taskName")
              .lean()
              .catch(() => null)
          }

          if (log?.taskBy) {
            populatedTaskBy = await Task.findById(log.taskBy)
          }

          return {
            ...log,
            taskBy: populatedTaskBy,
            submittedUser: populatedSubmittedUser || log.submittedUser,
            taskallocatedBy: populatedTaskAllocatedBy || log.taskallocatedBy,
            taskallocatedTo:
              populatedTaskAllocatedTo || log.taskallocatedTo,
            taskId: populatedTask
          }
        })
      )

      const lastMatched = lastAlloc
      const lastMatchedClosed = !!lastMatched.followupClosed
      let neverfollowuped = false

      if (lastMatchedClosed) {
        neverfollowuped = true
      } else {
        const afterLogs = activity.slice(lastIndex + 1)
        const foundNextFollowUp = afterLogs.some(
          (log) => !!log.nextFollowUpDate
        )
        if (foundNextFollowUp) {
          neverfollowuped = false
        } else {
          if (lastMatched.nextFollowUpDate) neverfollowuped = false
          else neverfollowuped = true
        }
      }

      const lastActivity = activity[activity.length - 1] || {}
      const Nextfollowup = !!lastActivity.nextFollowUpDate
      const allocatedfollowup = !!lastActivity.taskfromFollowup
      const allocatedTaskClosed = !!lastActivity.allocatedClosed

      followupLeads.push({
        ...lead,
        leadBy: popLeadBy || lead.leadBy,
        allocatedTo: popAllocatedTo,
        allocatedBy: popAllocatedBy,
        activityLog: populatedActivityLog,
        nextFollowUpDate: lastActivity.nextFollowUpDate ?? null,
        neverfollowuped,
        Nextfollowup,
        allocatedfollowup,
        allocatedTaskClosed
      })
    }

    const ischekCollegueLeads = followupLeads.some((item) =>
      item.allocatedBy?._id?.equals(userObjectId)
    )

    if (followupLeads && followupLeads.length > 0) {
      return res.status(201).json({
        messge: "leadfollowup found",
        data: { followupLeads, ischekCollegueLeads }
      })
    } else {
      return res
        .status(404)
        .json({ message: "leadfollowp not found", data: {} })
    }
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}


export const GetfollowupsummaryReport = async (req, res) => {
  try {

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // const result = await LeadMaster.aggregate([

    //   // 1️⃣ Filter followup assignment logs WITH DATE
    //   {
    //     $addFields: {
    //       followupAssignLogs: {
    //         $filter: {
    //           input: "$activityLog",
    //           as: "log",
    //           cond: {
    //             $and: [
    //               { $eq: ["$$log.taskTo", "followup"] },
    //               { $ne: ["$$log.submissionDate", null] },
    //               // { $gte: ["$$log.submissionDate", start] },
    //               // { $lte: ["$$log.submissionDate", end] }
    //             ]
    //           }
    //         }
    //       }
    //     }
    //   },

    //   // 2️⃣ Latest assign log
    //   {
    //     $addFields: {
    //       assignLog: { $arrayElemAt: ["$followupAssignLogs", -1] }
    //     }
    //   },

    //   // 3️⃣ Keep only valid leads
    //   {
    //     $match: {
    //       assignLog: { $ne: null }
    //     }
    //   },

    //   // 4️⃣ Logs AFTER assignment
    //   {
    //     $addFields: {
    //       logsAfterAssign: {
    //         $filter: {
    //           input: "$activityLog",
    //           as: "log",
    //           cond: {
    //             $gt: ["$$log.submissionDate", "$assignLog.submissionDate"]
    //           }
    //         }
    //       }
    //     }
    //   },

    //   // 5️⃣ Check if any nextFollowUp exists after assignment
    //   {
    //     $addFields: {
    //       hasNextFollowup: {
    //         $gt: [
    //           {
    //             $size: {
    //               $filter: {
    //                 input: "$logsAfterAssign",
    //                 as: "log",
    //                 cond: {
    //                   $and: [
    //                     { $ne: ["$$log.nextFollowUpDate", null] },
    //                     { $gt: ["$$log.nextFollowUpDate", new Date("2000-01-01")] }
    //                   ]
    //                 }
    //               }
    //             }
    //           },
    //           0
    //         ]
    //       }
    //     }
    //   },

    //   // 6️⃣ Extract all valid followup logs
    //   {
    //     $addFields: {
    //       followupLogs: {
    //         $filter: {
    //           input: "$activityLog",
    //           as: "log",
    //           cond: {
    //             $and: [
    //               { $ne: ["$$log.nextFollowUpDate", null] },
    //               { $gt: ["$$log.nextFollowUpDate", new Date("2000-01-01")] }
    //             ]
    //           }
    //         }
    //       }
    //     }
    //   },

    //   // 7️⃣ Get last followup
    //   {
    //     $addFields: {
    //       lastActivity: { $arrayElemAt: ["$followupLogs", -1] }
    //     }
    //   },

    //   // 8️⃣ Unwind leadFor
    //   { $unwind: "$leadFor" },

    //   // 9️⃣ Group per lead
    //   {
    //     $group: {
    //       _id: "$_id",

    //       leadIdStr: { $first: "$leadId" },

    //       staffId: { $first: "$assignLog.taskallocatedTo" },
    //       staffModel: { $first: "$assignLog.taskallocatedToModel" },

    //       nextFollowupDate: { $first: "$lastActivity.nextFollowUpDate" },

    //       leadConvertedDate: { $first: "$leadConvertedDate" },
    //       leadLostDate: { $first: "$leadLostDate" },

    //       netAmount: { $first: "$leadFor.netAmount" },

    //       branchId: { $first: "$leadBranch" },

    //       hasNextFollowup: { $first: "$hasNextFollowup" }
    //     }
    //   },

    //   // 🔟 STATUS FLAGS
    //   {
    //     $addFields: {
    //       isLost: {
    //         $cond: [
    //           {
    //             $and: [
    //               { $ne: ["$leadLostDate", null] },
    //               // { $gte: ["$leadLostDate", start] },
    //               // { $lte: ["$leadLostDate", end] }
    //             ]
    //           },
    //           1,
    //           0
    //         ]
    //       }
    //     }
    //   },
    //   {
    //     $addFields: {
    //       isConverted: {
    //         $cond: [
    //           {
    //             $and: [
    //               { $eq: ["$isLost", 0] },
    //               { $ne: ["$leadConvertedDate", null] },
    //               // { $gte: ["$leadConvertedDate", start] },
    //               // { $lte: ["$leadConvertedDate", end] }
    //             ]
    //           },
    //           1,
    //           0
    //         ]
    //       }
    //     }
    //   },
    //   {
    //     $addFields: {
    //       isActive: {
    //         $cond: [
    //           {
    //             $and: [
    //               { $eq: ["$isLost", 0] },
    //               { $eq: ["$isConverted", 0] }
    //             ]
    //           },
    //           1,
    //           0
    //         ]
    //       }
    //     }
    //   },

    //   // 1️⃣1️⃣ FOLLOWUP BUCKETS
    //   {
    //     $addFields: {
    //       dueToday: {
    //         $cond: [
    //           {
    //             $and: [
    //               { $eq: ["$isActive", 1] },
    //               { $ne: ["$nextFollowupDate", null] },
    //               { $gte: ["$nextFollowupDate", todayStart] },
    //               { $lte: ["$nextFollowupDate", todayEnd] }
    //             ]
    //           },
    //           1,
    //           0
    //         ]
    //       },
    //       overdue: {
    //         $cond: [
    //           {
    //             $and: [
    //               { $eq: ["$isActive", 1] },
    //               { $ne: ["$nextFollowupDate", null] },
    //               { $lt: ["$nextFollowupDate", todayStart] }
    //             ]
    //           },
    //           1,
    //           0
    //         ]
    //       },
    //       future: {
    //         $cond: [
    //           {
    //             $and: [
    //               { $eq: ["$isActive", 1] },
    //               { $ne: ["$nextFollowupDate", null] },
    //               { $gt: ["$nextFollowupDate", todayEnd] }
    //             ]
    //           },
    //           1,
    //           0
    //         ]
    //       }
    //     }
    //   },

    //   // 🔥 NEVER FOLLOWUP LOGIC
    //   {
    //     $addFields: {
    //       neverFollowup: {
    //         $cond: [
    //           {
    //             $and: [
    //               { $eq: ["$isActive", 1] },
    //               { $eq: ["$hasNextFollowup", false] }
    //             ]
    //           },
    //           1,
    //           0
    //         ]
    //       }
    //     }
    //   },

    //   // 1️⃣2️⃣ Amount
    //   {
    //     $addFields: {
    //       convertedNetAmount: {
    //         $cond: [
    //           { $eq: ["$isConverted", 1] },
    //           { $ifNull: ["$netAmount", 0] },
    //           0
    //         ]
    //       }
    //     }
    //   },

    //   // 1️⃣3️⃣ FINAL GROUP
    //   {
    //     $group: {
    //       _id: {
    //         staffId: "$staffId",
    //         staffModel: "$staffModel"
    //       },

    //       leadIds: { $addToSet: "$leadIdStr" },
    //       leadCount: { $sum: 1 },

    //       totalConverted: { $sum: "$isConverted" },
    //       totalLost: { $sum: "$isLost" },

    //       totalDueToday: { $sum: "$dueToday" },
    //       totalOverdue: { $sum: "$overdue" },
    //       totalFuture: { $sum: "$future" },

    //       totalNeverFollowup: { $sum: "$neverFollowup" },

    //       convertedNetAmount: { $sum: "$convertedNetAmount" },

    //       branchIds: { $addToSet: "$branchId" }
    //     }
    //   },

    //   // 1️⃣4️⃣ Lookup STAFF
    //   {
    //     $lookup: {
    //       from: "staffs",
    //       localField: "_id.staffId",
    //       foreignField: "_id",
    //       as: "staff"
    //     }
    //   },

    //   // 1️⃣5️⃣ Lookup ADMIN
    //   {
    //     $lookup: {
    //       from: "admins",
    //       localField: "_id.staffId",
    //       foreignField: "_id",
    //       as: "admin"
    //     }
    //   },

    //   // 1️⃣6️⃣ Resolve user
    //   {
    //     $addFields: {
    //       user: {
    //         $cond: [
    //           { $eq: ["$_id.staffModel", "Admin"] },
    //           { $arrayElemAt: ["$admin", 0] },
    //           { $arrayElemAt: ["$staff", 0] }
    //         ]
    //       }
    //     }
    //   },

    //   // 1️⃣7️⃣ Final output
    //   {
    //     $project: {
    //       _id: 0,

    //       staffId: "$_id.staffId",
    //       staffModel: "$_id.staffModel",

    //       staffName: { $ifNull: ["$user.name", "Unknown"] },
    //       staffRole: "$user.role",

    //       branchIds: 1,
    //       leadIds: 1,

    //       leadCount: 1,
    //       totalConverted: 1,
    //       totalLost: 1,

    //       totalDueToday: 1,
    //       totalOverdue: 1,
    //       totalFuture: 1,

    //       totalNeverFollowup: 1,

    //       convertedNetAmount: 1
    //     }
    //   }
    // ]);
    const result = await LeadMaster.aggregate([
      // 1️⃣ Filter followup assignment logs WITH DATE
      {
        $addFields: {
          followupAssignLogs: {
            $filter: {
              input: "$activityLog",
              as: "log",
              cond: {
                $and: [
                  { $eq: ["$$log.taskTo", "followup"] },
                  { $ne: ["$$log.submissionDate", null] }
                  // { $gte: ["$$log.submissionDate", start] },
                  // { $lte: ["$$log.submissionDate", end] }
                ]
              }
            }
          }
        }
      },

      // 2️⃣ Latest assign log
      {
        $addFields: {
          assignLog: { $arrayElemAt: ["$followupAssignLogs", -1] }
        }
      },

      // 3️⃣ Keep only valid leads
      {
        $match: {
          assignLog: { $ne: null }
        }
      },

      // 4️⃣ Logs AFTER assignment
      {
        $addFields: {
          logsAfterAssign: {
            $filter: {
              input: "$activityLog",
              as: "log",
              cond: {
                $gt: ["$$log.submissionDate", "$assignLog.submissionDate"]
              }
            }
          }
        }
      },

      // 5️⃣ Check if any nextFollowUp exists after assignment
      {
        $addFields: {
          hasNextFollowup: {
            $gt: [
              {
                $size: {
                  $filter: {
                    input: "$logsAfterAssign",
                    as: "log",
                    cond: {
                      $and: [
                        { $ne: ["$$log.nextFollowUpDate", null] },
                        { $gt: ["$$log.nextFollowUpDate", new Date("2000-01-01")] }
                      ]
                    }
                  }
                }
              },
              0
            ]
          }
        }
      },

      // 6️⃣ Extract all valid followup logs
      {
        $addFields: {
          followupLogs: {
            $filter: {
              input: "$activityLog",
              as: "log",
              cond: {
                $and: [
                  { $ne: ["$$log.nextFollowUpDate", null] },
                  { $gt: ["$$log.nextFollowUpDate", new Date("2000-01-01")] }
                ]
              }
            }
          }
        }
      },

      // 7️⃣ Get last followup
      {
        $addFields: {
          lastActivity: { $arrayElemAt: ["$followupLogs", -1] }
        }
      },

      // 8️⃣ Unwind leadFor
      { $unwind: "$leadFor" },

      // 9️⃣ Group per lead
      {
        $group: {
          _id: "$_id",

          leadIdStr: { $first: "$leadId" },

          staffId: { $first: "$assignLog.taskallocatedTo" },
          staffModel: { $first: "$assignLog.taskallocatedToModel" },

          nextFollowupDate: { $first: "$lastActivity.nextFollowUpDate" },

          leadConvertedDate: { $first: "$leadConvertedDate" },
          leadLostDate: { $first: "$leadLostDate" },

          netAmount: { $first: "$leadFor.netAmount" },

          branchId: { $first: "$leadBranch" },

          hasNextFollowup: { $first: "$hasNextFollowup" }
        }
      },

      // 🔟 STATUS FLAGS
      {
        $addFields: {
          isLost: {
            $cond: [
              {
                $and: [
                  { $ne: ["$leadLostDate", null] }
                  // { $gte: ["$leadLostDate", start] },
                  // { $lte: ["$leadLostDate", end] }
                ]
              },
              1,
              0
            ]
          }
        }
      },
      {
        $addFields: {
          isConverted: {
            $cond: [
              {
                $and: [
                  { $eq: ["$isLost", 0] },
                  { $ne: ["$leadConvertedDate", null] }
                  // { $gte: ["$leadConvertedDate", start] },
                  // { $lte: ["$leadConvertedDate", end] }
                ]
              },
              1,
              0
            ]
          }
        }
      },
      {
        $addFields: {
          isActive: {
            $cond: [
              {
                $and: [{ $eq: ["$isLost", 0] }, { $eq: ["$isConverted", 0] }]
              },
              1,
              0
            ]
          }
        }
      },

      // 1️⃣1️⃣ FOLLOWUP BUCKETS (flags)
      {
        $addFields: {
          dueToday: {
            $cond: [
              {
                $and: [
                  { $eq: ["$isActive", 1] },
                  { $ne: ["$nextFollowupDate", null] },
                  { $gte: ["$nextFollowupDate", todayStart] },
                  { $lte: ["$nextFollowupDate", todayEnd] }
                ]
              },
              1,
              0
            ]
          },
          overdue: {
            $cond: [
              {
                $and: [
                  { $eq: ["$isActive", 1] },
                  { $ne: ["$nextFollowupDate", null] },
                  { $lt: ["$nextFollowupDate", todayStart] }
                ]
              },
              1,
              0
            ]
          },
          future: {
            $cond: [
              {
                $and: [
                  { $eq: ["$isActive", 1] },
                  { $ne: ["$nextFollowupDate", null] },
                  { $gt: ["$nextFollowupDate", todayEnd] }
                ]
              },
              1,
              0
            ]
          }
        }
      },

      // 🔥 NEVER FOLLOWUP LOGIC (flag)
      {
        $addFields: {
          neverFollowup: {
            $cond: [
              {
                $and: [
                  { $eq: ["$isActive", 1] },
                  { $eq: ["$hasNextFollowup", false] }
                ]
              },
              1,
              0
            ]
          }
        }
      },

      // 1️⃣2️⃣ Amount (per lead converted)
      {
        $addFields: {
          convertedNetAmount: {
            $cond: [
              { $eq: ["$isConverted", 1] },
              { $ifNull: ["$netAmount", 0] },
              0
            ]
          }
        }
      },

      // 💰 BUCKET AMOUNTS (per lead)
      {
        $addFields: {
          dueTodayAmount: {
            $cond: [
              { $eq: ["$dueToday", 1] },
              { $ifNull: ["$netAmount", 0] },
              0
            ]
          },
          overdueAmount: {
            $cond: [
              { $eq: ["$overdue", 1] },
              { $ifNull: ["$netAmount", 0] },
              0
            ]
          },
          futureAmount: {
            $cond: [
              { $eq: ["$future", 1] },
              { $ifNull: ["$netAmount", 0] },
              0
            ]
          },
          neverFollowupAmount: {
            $cond: [
              { $eq: ["$neverFollowup", 1] },
              { $ifNull: ["$netAmount", 0] },
              0
            ]
          }
        }
      },

      // 1️⃣3️⃣ FINAL GROUP (per staff)
      {
        $group: {
          _id: {
            staffId: "$staffId",
            staffModel: "$staffModel"
          },

          leadIds: { $addToSet: "$leadIdStr" },
          leadCount: { $sum: 1 },

          totalConverted: { $sum: "$isConverted" },
          totalLost: { $sum: "$isLost" },

          totalDueToday: { $sum: "$dueToday" },
          totalOverdue: { $sum: "$overdue" },
          totalFuture: { $sum: "$future" },
          totalNeverFollowup: { $sum: "$neverFollowup" },

          // total lead amount regardless of status
          totalLeadAmount: { $sum: { $ifNull: ["$netAmount", 0] } },

          convertedNetAmount: { $sum: "$convertedNetAmount" },

          dueTodayAmount: { $sum: "$dueTodayAmount" },
          overdueAmount: { $sum: "$overdueAmount" },
          futureAmount: { $sum: "$futureAmount" },
          neverFollowupAmount: { $sum: "$neverFollowupAmount" },

          branchIds: { $addToSet: "$branchId" }
        }
      },

      // 1️⃣4️⃣ Lookup STAFF
      {
        $lookup: {
          from: "staffs",
          localField: "_id.staffId",
          foreignField: "_id",
          as: "staff"
        }
      },

      // 1️⃣5️⃣ Lookup ADMIN
      {
        $lookup: {
          from: "admins",
          localField: "_id.staffId",
          foreignField: "_id",
          as: "admin"
        }
      },

      // 1️⃣6️⃣ Resolve user
      {
        $addFields: {
          user: {
            $cond: [
              { $eq: ["$_id.staffModel", "Admin"] },
              { $arrayElemAt: ["$admin", 0] },
              { $arrayElemAt: ["$staff", 0] }
            ]
          }
        }
      },

      // 1️⃣7️⃣ Final output
      {
        $project: {
          _id: 0,

          staffId: "$_id.staffId",
          staffModel: "$_id.staffModel",

          staffName: { $ifNull: ["$user.name", "Unknown"] },
          staffRole: "$user.role",

          branchIds: 1,
          leadIds: 1,

          leadCount: 1,
          totalConverted: 1,
          totalLost: 1,

          totalDueToday: 1,
          totalOverdue: 1,
          totalFuture: 1,
          totalNeverFollowup: 1,

          totalLeadAmount: 1,
          convertedNetAmount: 1,
          dueTodayAmount: 1,
          overdueAmount: 1,
          futureAmount: 1,
          neverFollowupAmount: 1
        }
      }
    ]);

    const structuredData = result.map((item) => ({
      staffId: item.staffId,
      leadIds: item.leadIds,
      staffRole: item.staffRole,
      branchIds: item.branchIds,
      Staff: item.staffName,

      // counts
      leadCount: item.leadCount,
      dueToday: item.totalDueToday,
      overDue: item.totalOverdue,
      future: item.totalFuture,
      converted: item.totalConverted,
      lost: item.totalLost,
      neverFollowup: item.totalNeverFollowup,

      // amounts
      leadAmount: item.totalLeadAmount,
      convertedAmount: item.convertedNetAmount,
      dueTodayAmount: item.dueTodayAmount,
      overDueAmount: item.overdueAmount,
      futureAmount: item.futureAmount,
      neverFollowupAmount: item.neverFollowupAmount,

      convertedPercentage:
        item.leadCount > 0
          ? Number(((item.totalConverted / item.leadCount) * 100).toFixed(2))
          : 0
    }));

    if (structuredData.length > 0) {
      return res.status(200).json({ message: "summary found", data: structuredData });
    }

    return res.status(404).json({ message: "No data found" });

  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const Getalltasktoreport = async (req, res) => {
  try {
    const result = await Task.find({ listed: true })
    return res.status(200).json({ message: "result found", data: result })
  } catch (error) {
    console.log("error:", error.message)
    res.status(500).json({ message: "Internal server error" })
  }
}
export const Getdailystaffreport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "startDate and endDate required" });
    }
    const allTasks = await Task.find({ listed: true }, { taskName: 1, _id: 0 }).lean();
    const taskNames = allTasks.map(t => t.taskName);

    // Use FULL date range from req.query
    const reportStart = new Date(startDate);
    const reportEnd = new Date(endDate);
    reportEnd.setHours(23, 59, 59, 999);

    console.log(`Full range: ${startDate} to ${endDate}`);

    // **DAILY LOOP** - Process each day between startDate & endDate
    const dailyReports = [];
    let currentDate = new Date(reportStart);


    const dateStr = currentDate.toLocaleDateString('en-IN'); // "25-1-2026"

    // Pass ONLY the day's date to helper - it handles start/end of day
    const leadMetrics = await getLeadMetricsForSingleDay(currentDate, reportEnd);
    const callMetrics = await getCallMetricsForSingleDay(currentDate, reportEnd)

    const dayReport = leadMetrics.map(lead => {
      const callsData = callMetrics.find(
        call => String(call.staffId) === String(lead.staffId)
      );


      // 🔹 Base object
      const row = {
        Date: dateStr,
        staffName: lead.staffName,
        Calls: callsData ? callsData.Calls : 0,
        newlead: lead.newlead || 0
      };

      // 🔹 Add ALL tasks dynamically
      taskNames.forEach(taskName => {
        row[taskName] = lead.tasks?.[taskName] || 0;
      });

      return row;
    });

    dailyReports.push(...dayReport);
    currentDate.setDate(currentDate.getDate() + 1);
    return res.status(200).json({ messaage: "daily report found", data: dailyReports })

  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const GetcollectionLeads = async (req, res) => {
  try {
    const { selectedBranch, isAccountant, loggeduserby, verified } = req.query;
    const verifiedBool = verified === "true";
    const accountantMode = isAccountant === "true";

    const matchedCollectionlead = await LeadMaster.aggregate([
      {
        $match: {
          leadBranch: new mongoose.Types.ObjectId(selectedBranch),
        },
      },
      {
        $addFields: {
          followupActivities: {
            $filter: {
              input: "$activityLog",
              as: "activity",
              cond: { $eq: ["$$activity.taskTo", "followup"] },
            },
          },
        },
      },
      {
        $addFields: {
          latestFollowupActivity: {
            $arrayElemAt: ["$followupActivities", -1],
          },
        },
      },
      {
        $match: {
          "latestFollowupActivity.followupClosed": true,
        },
      },
    ]);

    const populatedLeads = await LeadMaster.populate(matchedCollectionlead, [
      { path: "customerName" },
      { path: "partner" },
    ]);

    const populatedcollectionLeads = await Promise.all(
      populatedLeads.map(async (lead) => {
        if (!lead.leadByModel || !mongoose.models[lead.leadByModel]) {
          console.error(`Model ${lead.leadByModel} is not registered`);
          return null;
        }

        const assignedModel = mongoose.model(lead.leadByModel);
        const populatedLeadBy = await assignedModel
          .findById(lead.leadBy)
          .select("name")
          .lean();

        let lasttaskallocatedto = null;
        let lasttaskallocatedBy = null;

        const populatedActivityLog = await Promise.all(
          (lead.activityLog || []).map(async (activity) => {
            const populatedActivity = { ...activity };

            if (activity.submissiondoneByModel && activity.submittedUser) {
              const model = mongoose.model(activity.submissiondoneByModel);
              populatedActivity.submittedUser = await model
                .findById(activity.submittedUser)
                .select("name")
                .lean();
            }

            if (activity.taskallocatedByModel && activity.taskallocatedBy) {
              const model = mongoose.model(activity.taskallocatedByModel);
              lasttaskallocatedBy = populatedActivity.taskallocatedBy =
                await model.findById(activity.taskallocatedBy).select("name").lean();
            }

            if (activity.taskallocatedToModel && activity.taskallocatedTo) {
              const model = mongoose.model(activity.taskallocatedToModel);
              lasttaskallocatedto = populatedActivity.taskallocatedTo =
                await model.findById(activity.taskallocatedTo).select("name").lean();
            }

            return populatedActivity;
          })
        );

        const latestFollowupActivity = [...(lead.activityLog || [])]
          .filter((activity) => activity?.taskTo === "followup")
          .at(-1);

        const isFollowupClosed = latestFollowupActivity?.followupClosed === true;

        if (!isFollowupClosed) {
          return null;
        }

        const populatedLeadFor = await Promise.all(
          (lead.leadFor || []).map(async (item) => {
            const populatedItem = { ...item };

            if (item.productorServicemodel && item.productorServiceId) {
              try {
                const model = mongoose.model(item.productorServicemodel);
                const productDoc = await model
                  .findById(item.productorServiceId)
                  .select("productName name title")
                  .lean();

                populatedItem.productorServiceId = productDoc;
              } catch (err) {
                populatedItem.productorServiceId = null;
              }
            }

            return populatedItem;
          })
        );

        const paymentHistoryWithIndex = (lead?.paymentHistory || []).map(
          (history, index) => ({
            ...history,
            originalIndex: index,
          })
        );

        let filteredPaymentHistory = paymentHistoryWithIndex;

        if (accountantMode) {
          filteredPaymentHistory = filteredPaymentHistory.filter(
            (history) => history?.paymentVerified === verifiedBool
          );
        } else {
          filteredPaymentHistory = filteredPaymentHistory.filter((history) => {
            const receivedByMatch = loggeduserby
              ? String(history?.receivedBy) === String(loggeduserby)
              : true;

            return receivedByMatch;
          });
        }

        const populatedpaymentHistory = filteredPaymentHistory.length
          ? await Promise.all(
            filteredPaymentHistory.map(async (history) => {
              const populatedhistory = { ...history };

              if (history.receivedModel && history.receivedBy) {
                const recvModel = mongoose.model(history.receivedModel);
                populatedhistory.receivedBy = await recvModel
                  .findById(history.receivedBy)
                  .select("name")
                  .lean();
              }

              if (history.paymentverifiedModel && history.paymentVerifiedBy) {
                const verifiedModel = mongoose.model(
                  history.paymentverifiedModel
                );
                populatedhistory.paymentVerifiedBy = await verifiedModel
                  .findById(history.paymentVerifiedBy)
                  .select("name")
                  .lean();
              }

              if (Array.isArray(history.paymentEntries)) {
                populatedhistory.paymentEntries = await Promise.all(
                  history.paymentEntries.map(async (entry) => {
                    const populatedEntry = { ...entry };

                    if (
                      entry.productorServicemodel &&
                      entry.productorServiceId
                    ) {
                      try {
                        const ProdModel = mongoose.model(
                          entry.productorServicemodel
                        );
                        const doc = await ProdModel.findById(
                          entry.productorServiceId
                        )
                          .select("productName name title")
                          .lean();

                        populatedEntry.productorServiceId = doc;
                      } catch (err) {
                        populatedEntry.productorServiceId = null;
                      }
                    }

                    return populatedEntry;
                  })
                );
              }

              return populatedhistory;
            })
          )
          : [];

        // if (!accountantMode && populatedpaymentHistory.length === 0) {
        //   return null;
        // }

        // if (accountantMode && populatedpaymentHistory.length === 0) {
        //   return null;
        // }

        const lastActivity =
          populatedActivityLog[populatedActivityLog.length - 1];

        return {
          ...lead,
          leadBy: populatedLeadBy,
          paymentHistory: populatedpaymentHistory,
          leadFor: populatedLeadFor,
          activityLog: populatedActivityLog,
          taskallocatedTo: lasttaskallocatedto || null,
          taskallocatedBy: lasttaskallocatedBy || null,
          leadclosedBy: lastActivity?.submittedUser || null,
          followupClosed: isFollowupClosed,
        };
      })
    );

    const finalLeads = populatedcollectionLeads.filter(Boolean);

    if (finalLeads.length > 0) {
      return res.status(201).json({
        message: "lead found",
        data: finalLeads,
      });
    } else {
      return res.status(200).json({
        message: "lead not found",
        data: [],
      });
    }
  } catch (error) {
    console.log("error", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// export const GetcollectionLeads = async (req, res) => {
//   try {
//     const { selectedBranch, isAccountant, loggeduserby } = req.query;


//     const accountantMode = isAccountant === "true";

//     const matchedCollectionlead = await LeadMaster.aggregate([
//       {
//         $match: {
//           leadBranch: new mongoose.Types.ObjectId(selectedBranch),
//         },
//       },
//       {
//         $addFields: {
//           followupActivities: {
//             $filter: {
//               input: "$activityLog",
//               as: "activity",
//               cond: { $eq: ["$$activity.taskTo", "followup"] },
//             },
//           },
//         },
//       },
//       {
//         $addFields: {
//           latestFollowupActivity: {
//             $arrayElemAt: ["$followupActivities", -1],
//           },
//         },
//       },
//       {
//         $match: {
//           "latestFollowupActivity.followupClosed": true,
//         },
//       },
//     ]);


//     const populatedLeads = await LeadMaster.populate(matchedCollectionlead, [
//       { path: "customerName" },
//       { path: "partner" },
//     ]);

//     const populatedcollectionLeads = await Promise.all(
//       populatedLeads.map(async (lead) => {
//         if (!lead.leadByModel || !mongoose.models[lead.leadByModel]) {
//           console.error(`Model ${lead.leadByModel} is not registered`);
//           return null;
//         }

//         const assignedModel = mongoose.model(lead.leadByModel);
//         const populatedLeadBy = await assignedModel
//           .findById(lead.leadBy)
//           .select("name")
//           .lean();

//         let lasttaskallocatedto = null;
//         let lasttaskallocatedBy = null;

//         const populatedActivityLog = await Promise.all(
//           (lead.activityLog || []).map(async (activity) => {
//             const populatedActivity = { ...activity };

//             if (activity.submissiondoneByModel && activity.submittedUser) {
//               const model = mongoose.model(activity.submissiondoneByModel);
//               populatedActivity.submittedUser = await model
//                 .findById(activity.submittedUser)
//                 .select("name")
//                 .lean();
//             }

//             if (activity.taskallocatedByModel && activity.taskallocatedBy) {
//               const model = mongoose.model(activity.taskallocatedByModel);
//               lasttaskallocatedBy = populatedActivity.taskallocatedBy =
//                 await model
//                   .findById(activity.taskallocatedBy)
//                   .select("name")
//                   .lean();
//             }

//             if (activity.taskallocatedToModel && activity.taskallocatedTo) {
//               const model = mongoose.model(activity.taskallocatedToModel);
//               lasttaskallocatedto = populatedActivity.taskallocatedTo =
//                 await model
//                   .findById(activity.taskallocatedTo)
//                   .select("name")
//                   .lean();
//             }

//             return populatedActivity;
//           })
//         );

//         const latestFollowupActivity = [...(lead.activityLog || [])]
//           .filter((activity) => activity?.taskTo === "followup")
//           .at(-1);

//         const isFollowupClosed = latestFollowupActivity?.followupClosed === true;

//         if (!isFollowupClosed) {
//           return null;
//         }

//         const populatedLeadFor = await Promise.all(
//           (lead.leadFor || []).map(async (item) => {
//             const populatedItem = { ...item };

//             if (item.productorServicemodel && item.productorServiceId) {
//               try {
//                 const model = mongoose.model(item.productorServicemodel);
//                 const productDoc = await model
//                   .findById(item.productorServiceId)
//                   .select("productName name title")
//                   .lean();

//                 populatedItem.productorServiceId = productDoc;
//               } catch (err) {
//                 populatedItem.productorServiceId = null;
//               }
//             }

//             return populatedItem;
//           })
//         );

//         let filteredPaymentHistory = lead?.paymentHistory || [];

//         if (accountantMode) {
//           filteredPaymentHistory = filteredPaymentHistory.filter(
//             (history) => history?.paymentVerified === false
//           );
//         } else {
//           filteredPaymentHistory = filteredPaymentHistory.filter((history) => {
//             const receivedByMatch = loggeduserby
//               ? String(history?.receivedBy) === String(loggeduserby)
//               : true;

//             return receivedByMatch;
//           });
//         }

//         const populatedpaymentHistory = filteredPaymentHistory.length
//           ? await Promise.all(
//             filteredPaymentHistory.map(async (history) => {
//               const populatedhistory = { ...history };

//               if (history.receivedModel && history.receivedBy) {
//                 const recvModel = mongoose.model(history.receivedModel);
//                 populatedhistory.receivedBy = await recvModel
//                   .findById(history.receivedBy)
//                   .select("name")
//                   .lean();
//               }

//               if (history.paymentverifiedModel && history.paymentVerifiedBy) {
//                 const verifiedModel = mongoose.model(
//                   history.paymentverifiedModel
//                 );
//                 populatedhistory.paymentVerifiedBy = await verifiedModel
//                   .findById(history.paymentVerifiedBy)
//                   .select("name")
//                   .lean();
//               }

//               if (Array.isArray(history.paymentEntries)) {
//                 populatedhistory.paymentEntries = await Promise.all(
//                   history.paymentEntries.map(async (entry) => {
//                     const populatedEntry = { ...entry };

//                     if (
//                       entry.productorServicemodel &&
//                       entry.productorServiceId
//                     ) {
//                       try {
//                         const ProdModel = mongoose.model(
//                           entry.productorServicemodel
//                         );
//                         const doc = await ProdModel.findById(
//                           entry.productorServiceId
//                         )
//                           .select("productName name title")
//                           .lean();

//                         populatedEntry.productorServiceId = doc;
//                       } catch (err) {
//                         populatedEntry.productorServiceId = null;
//                       }
//                     }

//                     return populatedEntry;
//                   })
//                 );
//               }

//               return populatedhistory;
//             })
//           )
//           : [];

//         if (!accountantMode && populatedpaymentHistory.length === 0) {
//           return null;
//         }

//         if (accountantMode && populatedpaymentHistory.length === 0) {
//           return null;
//         }

//         const lastActivity =
//           populatedActivityLog[populatedActivityLog.length - 1];

//         return {
//           ...lead,
//           leadBy: populatedLeadBy,
//           paymentHistory: populatedpaymentHistory,
//           leadFor: populatedLeadFor,
//           activityLog: populatedActivityLog,
//           taskallocatedTo: lasttaskallocatedto || null,
//           taskallocatedBy: lasttaskallocatedBy || null,
//           leadclosedBy: lastActivity?.submittedUser || null,
//           followupClosed: isFollowupClosed,
//         };
//       })
//     );

//     const finalLeads = populatedcollectionLeads.filter(Boolean);

//     if (finalLeads.length > 0) {
//       return res.status(201).json({
//         message: "lead found",
//         data: finalLeads,
//       });
//     } else {
//       return res.status(200).json({
//         message: "lead not found",
//         data: [],
//       });
//     }
//   } catch (error) {
//     console.log("error", error.message);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
// export const GetcollectionLeads = async (req, res) => {
//   try {
//     const { selectedBranch, verified,isAccountant,loggeduserid } = req.query;
//     const query = {
//       leadBranch: new mongoose.Types.ObjectId(selectedBranch),
//       paymentVerified: verified === "true" ? true : false,
//     };
//     const matchedCollectionlead = await LeadMaster.find(query)
//       .populate({ path: "customerName" })
//       .populate({ path: "partner" })
//       .lean();
//     const populatedcollectionLeads = await Promise.all(
//       matchedCollectionlead.map(async (lead) => {
//         if (!lead.leadByModel || !mongoose.models[lead.leadByModel]) {
//           console.error(`Model ${lead.leadByModel} is not registered`);
//           return lead;
//         }

//         // Fetch leadBy name
//         const assignedModel = mongoose.model(lead.leadByModel);
//         const populatedLeadBy = await assignedModel
//           .findById(lead.leadBy)
//           .select("name")
//           .lean();
//         let lasttaskallocatedto;
//         let lasttaskallocatedBy;
//         // ✅ Populate activityLog fields
//         const populatedActivityLog = await Promise.all(
//           (lead.activityLog || []).map(async (activity) => {
//             const populatedActivity = { ...activity };

//             // Populate taskallocatedTo
//             if (activity.submissiondoneByModel && activity.submittedUser) {
//               const model = mongoose.model(activity.submissiondoneByModel);
//               populatedActivity.submittedUser = await model
//                 .findById(activity.submittedUser)
//                 .select("name")
//                 .lean();
//             }

//             // // Populate taskallocatedBy
//             if (activity.taskallocatedByModel && activity.taskallocatedBy) {
//               const model = mongoose.model(activity.taskallocatedByModel);
//               lasttaskallocatedBy = populatedActivity.taskallocatedBy =
//                 await model
//                   .findById(activity.taskallocatedBy)
//                   .select("name")
//                   .lean();
//             }

//             // ✅ Populate submissionDoneBy
//             if (activity.taskallocatedToModel && activity.taskallocatedTo) {
//               const model = mongoose.model(activity.taskallocatedToModel);
//               lasttaskallocatedto = populatedActivity.taskallocatedTo =
//                 await model
//                   .findById(activity.taskallocatedTo)
//                   .select("name")
//                   .lean();
//             }

//             return populatedActivity;
//           })
//         );
//         const populatedLeadFor = await Promise.all(
//           (lead.leadFor || []).map(async (item) => {
//             const populatedItem = { ...item }

//             if (item.productorServicemodel && item.productorServiceId) {
//               try {
//                 const model = mongoose.model(item.productorServicemodel)
//                 const productDoc = await model
//                   .findById(item.productorServiceId)
//                   .select("productName name title")
//                   .lean()

//                 populatedItem.productorServiceId = productDoc
//               } catch (err) {
//                 populatedItem.productorServiceId = null
//               }
//             }

//             return populatedItem
//           })
//         )





//         const populatedpaymentHistory = lead?.paymentHistory?.length
//           ? await Promise.all(
//             lead.paymentHistory.map(async (history) => {
//               const populatedhistory = { ...history.toObject?.() ?? history }

//               // populate receivedBy (existing)
//               if (history.receivedModel && history.receivedBy) {
//                 const recvModel = mongoose.model(history.receivedModel)
//                 populatedhistory.receivedBy = await recvModel
//                   .findById(history.receivedBy)
//                   .select("name")
//                   .lean()
//               }

//               // populate each paymentEntries[].productId via productorServicemodel
//               if (Array.isArray(history.paymentEntries)) {
//                 populatedhistory.paymentEntries = await Promise.all(
//                   history.paymentEntries.map(async (entry) => {
//                     const populatedEntry = { ...entry }

//                     if (entry.productorServicemodel && entry.productorServiceId) {
//                       try {
//                         const ProdModel = mongoose.model(entry.productorServicemodel)
//                         const doc = await ProdModel
//                           .findById(entry.productorServiceId)
//                           .select("productName name")
//                           .lean()

//                         populatedEntry.productorServiceId = doc
//                       } catch (err) {
//                         populatedEntry.productorServiceId = null
//                       }
//                     }

//                     return populatedEntry
//                   })
//                 )
//               }

//               return populatedhistory
//             })
//           )
//           : []

//         // ✅ Get last activity
//         const lastActivity =
//           populatedActivityLog[populatedActivityLog.length - 1];

//         return {
//           ...lead,
//           leadBy: populatedLeadBy,
//           paymentHistory: populatedpaymentHistory,
//           leadFor: populatedLeadFor,//include populated productorservice
//           activityLog: populatedActivityLog, // include fully populated activity logs
//           taskallocatedTo: lasttaskallocatedto || null,
//           taskallocatedBy: lasttaskallocatedBy || null,
//           leadclosedBy: lastActivity?.submittedUser,
//         };
//       })
//     );
//     if (populatedcollectionLeads && populatedcollectionLeads.length > 0) {
//       return res
//         .status(201)
//         .json({ message: "lead found", data: populatedcollectionLeads });
//     } else {
//       return res
//         .status(200)
//         .json({ message: "lead  not found", data: populatedcollectionLeads });
//     }
//   } catch (error) {
//     console.log("error", error.message);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

export const GetlostLeads = async (req, res) => {
  try {
    const { selectedBranch } = req.query;
    const matchedlostLead = await LeadMaster.find({
      leadBranch: new mongoose.Types.ObjectId(selectedBranch),
      leadLost: true,
    })
      .populate({ path: "customerName", select: "customerName" })
      .lean();
    const populatedlostLeads = await Promise.all(
      matchedlostLead.map(async (lead) => {
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
        let lasttaskallocatedto;
        let lasttaskallocatedBy;
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
              lasttaskallocatedBy = populatedActivity.taskallocatedBy =
                await model
                  .findById(activity.taskallocatedBy)
                  .select("name")
                  .lean();
            }

            // ✅ Populate submissionDoneBy
            if (activity.taskallocatedToModel && activity.taskallocatedTo) {
              const model = mongoose.model(activity.taskallocatedToModel);
              lasttaskallocatedto = populatedActivity.taskallocatedTo =
                await model
                  .findById(activity.taskallocatedTo)
                  .select("name")
                  .lean();
            }

            return populatedActivity;
          })
        );

        // ✅ Get last activity
        const lastActivity =
          populatedActivityLog[populatedActivityLog.length - 1];

        return {
          ...lead,
          leadBy: populatedLeadBy,
          activityLog: populatedActivityLog, // include fully populated activity logs
          taskallocatedTo: lasttaskallocatedto || null,
          taskallocatedBy: lasttaskallocatedBy || null,
          leadclosedBy: lastActivity?.submittedUser,
        };
      })
    );
    if (populatedlostLeads && populatedlostLeads.length > 0) {
      return res
        .status(201)
        .json({ message: "lead found", data: populatedlostLeads });
    } else {
      return res
        .status(200)
        .json({ message: "lead  not found", data: populatedlostLeads });
    }
  } catch (error) {
    console.log("error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const GetallproductwiseReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = new Date(startDate);
    const end = new Date(endDate);
    ///for productwise report

    const result = await LeadMaster.aggregate([

      // 1️⃣ Unwind activityLog
      { $unwind: "$activityLog" },

      // 2️⃣ Only followup allocations
      {
        $match: {
          "activityLog.taskallocatedTo": { $exists: true, $ne: null },
          "activityLog.taskTo": "followup",
          "activityLog.allocationChanged": false,
        },
      },

      // 3️⃣ Sort latest followup first
      {
        $sort: {
          "activityLog.submissionDate": -1,
        },
      },

      // 4️⃣ Unwind leadFor
      { $unwind: "$leadFor" },

      // 5️⃣ DEDUPLICATE (Lead + Staff + Product + Model)
      {
        $group: {
          _id: {
            leadId: "$leadId",
            staffId: "$activityLog.taskallocatedTo",
            model: "$activityLog.taskallocatedToModel", // ✅ IMPORTANT
            productId: "$leadFor.productorServiceId",
            productModel: "$leadFor.productorServicemodel",
          },

          leadLost: { $first: "$leadLost" },
          leadLostDate: { $first: "$leadLostDate" },
          leadConvertedDate: { $first: "$leadConvertedDate" },
          netAmount: { $first: "$leadFor.netAmount" },
        },
      },

      // 6️⃣ STATUS LOGIC (Lost > Converted > Pending)
      {
        $addFields: {
          status: {
            $cond: [
              {
                $and: [
                  { $eq: ["$leadLost", true] },
                  { $ne: ["$leadLostDate", null] },
                ],
              },
              "LOST",
              {
                $cond: [
                  { $ne: ["$leadConvertedDate", null] },
                  "CONVERTED",
                  "PENDING",
                ],
              },
            ],
          },
        },
      },

      // 7️⃣ Flags
      {
        $addFields: {
          isLost: { $cond: [{ $eq: ["$status", "LOST"] }, 1, 0] },
          isConverted: { $cond: [{ $eq: ["$status", "CONVERTED"] }, 1, 0] },
          isPending: { $cond: [{ $eq: ["$status", "PENDING"] }, 1, 0] },
        },
      },

      // 8️⃣ Amount calculations
      {
        $addFields: {
          entryTotalAmount: { $ifNull: ["$netAmount", 0] },

          entryConvertedAmount: {
            $cond: [{ $eq: ["$isConverted", 1] }, { $ifNull: ["$netAmount", 0] }, 0],
          },

          entryLostAmount: {
            $cond: [{ $eq: ["$isLost", 1] }, { $ifNull: ["$netAmount", 0] }, 0],
          },

          entryPendingAmount: {
            $cond: [{ $eq: ["$isPending", 1] }, { $ifNull: ["$netAmount", 0] }, 0],
          },
        },
      },

      // 9️⃣ FINAL GROUP → Staff/Admin + Product
      {
        $group: {
          _id: {
            staffId: "$_id.staffId",
            model: "$_id.model",
            productId: "$_id.productId",
            productModel: "$_id.productModel",
          },

          leadCount: { $sum: 1 },

          totalConverted: { $sum: "$isConverted" },
          totalLost: { $sum: "$isLost" },
          totalPending: { $sum: "$isPending" },

          totalNetAmount: { $sum: "$entryTotalAmount" },
          convertedNetAmount: { $sum: "$entryConvertedAmount" },
          lostNetAmount: { $sum: "$entryLostAmount" },
          totalPendingAmount: { $sum: "$entryPendingAmount" },
        },
      },

      // 🔟 Lookup Staffs
      {
        $lookup: {
          from: "staffs",
          let: { id: "$_id.staffId", model: "$_id.model" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$$model", "Staff"] },
                    { $eq: ["$_id", "$$id"] },
                  ],
                },
              },
            },
          ],
          as: "staffData",
        },
      },

      // 1️⃣1️⃣ Lookup Admins
      {
        $lookup: {
          from: "admins",
          let: { id: "$_id.staffId", model: "$_id.model" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$$model", "Admin"] },
                    { $eq: ["$_id", "$$id"] },
                  ],
                },
              },
            },
          ],
          as: "adminData",
        },
      },

      // 1️⃣2️⃣ Merge user
      {
        $addFields: {
          user: {
            $cond: [
              { $eq: ["$_id.model", "Staff"] },
              { $arrayElemAt: ["$staffData", 0] },
              { $arrayElemAt: ["$adminData", 0] },
            ],
          },
        },
      },

      // 1️⃣3️⃣ Lookup Product
      {
        $lookup: {
          from: "products",
          localField: "_id.productId",
          foreignField: "_id",
          as: "product",
        },
      },

      // 1️⃣4️⃣ Lookup Service
      {
        $lookup: {
          from: "services",
          localField: "_id.productId",
          foreignField: "_id",
          as: "service",
        },
      },

      // 1️⃣5️⃣ Resolve product/service + branch
      {
        $addFields: {
          productName: {
            $cond: [
              { $eq: ["$_id.productModel", "Product"] },
              { $arrayElemAt: ["$product.productName", 0] },
              { $arrayElemAt: ["$service.serviceName", 0] },
            ],
          },

          branch: {
            $cond: [
              { $eq: ["$_id.productModel", "Product"] },
              {
                $arrayElemAt: [
                  {
                    $map: {
                      input: {
                        $ifNull: [
                          { $arrayElemAt: ["$product.selected", 0] },
                          [],
                        ],
                      },
                      as: "sel",
                      in: "$$sel.branch_id",
                    },
                  },
                  0,
                ],
              },
              { $arrayElemAt: ["$service.branch", 0] },
            ],
          },
        },
      },

      // 1️⃣6️⃣ Final output
      {
        $project: {
          _id: 0,

          staffId: "$_id.staffId",
          productId: "$_id.productId",
          productModel: "$_id.productModel",

          staffName: { $ifNull: ["$user.name", "Unknown"] },
          staffRole: "$user.role",

          productName: 1,
          branch: 1,

          leadCount: 1,
          totalConverted: 1,
          totalLost: 1,
          totalPending: 1,

          totalNetAmount: 1,
          convertedNetAmount: 1,
          lostNetAmount: 1,
          totalPendingAmount: 1,
        },
      },

      // 1️⃣7️⃣ Sort
      {
        $sort: {
          staffName: 1,
          productName: 1,
        },
      },

    ]);
    ///stqfffwisereport 
    const re = await LeadMaster.aggregate([
      // 1️⃣ Unwind activity log
      { $unwind: "$activityLog" },

      // 2️⃣ Filter followup tasks
      {
        $match: {
          "activityLog.taskallocatedTo": { $exists: true, $ne: null },
          "activityLog.taskTo": "followup",
          "activityLog.allocationChanged": false,
        },
      },

      // 3️⃣ Sort by latest assignment
      {
        $sort: {
          "activityLog.submissionDate": -1,
        },
      },

      // 4️⃣ One record per lead (latest assignment)
      {
        $group: {
          _id: "$leadId",

          leadId: { $first: "$leadId" },
          branch: { $first: "$leadBranch" },

          leadConvertedDate: { $first: "$leadConvertedDate" },
          leadLostDate: { $first: "$leadLostDate" },
          leadLostFlag: { $first: "$leadLost" },

          netAmount: { $first: "$netAmount" },

          staffId: { $first: "$activityLog.taskallocatedTo" },
          model: { $first: "$activityLog.taskallocatedToModel" },

          assignmentDate: { $first: "$activityLog.submissionDate" },
        },
      },

      // 5️⃣ 🔥 BASE FILTER (THIS IS THE KEY FIX)
      {
        $match: {
          assignmentDate: { $gte: start, $lte: end },
        },
      },

      // 6️⃣ LOST
      {
        $addFields: {
          isLost: {
            $cond: [
              {
                $and: [
                  { $eq: ["$leadLostFlag", true] },
                  { $ne: ["$leadLostDate", null] },
                  { $gte: ["$leadLostDate", start] },
                  { $lte: ["$leadLostDate", end] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },

      // 7️⃣ CONVERTED
      {
        $addFields: {
          isConverted: {
            $cond: [
              {
                $and: [
                  { $eq: ["$isLost", 0] },
                  { $ne: ["$leadConvertedDate", null] },
                  { $gte: ["$leadConvertedDate", start] },
                  { $lte: ["$leadConvertedDate", end] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },

      // 8️⃣ PENDING
      {
        $addFields: {
          isPending: {
            $cond: [
              {
                $and: [
                  { $eq: ["$isLost", 0] },
                  { $eq: ["$isConverted", 0] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },

      // 9️⃣ Group per staff
      {
        $group: {
          _id: {
            staffId: "$staffId",
            branch: "$branch",
            model: "$model",
          },

          leadCount: { $sum: 1 }, // ✅ SAME dataset

          totalConverted: { $sum: "$isConverted" },
          totalLost: { $sum: "$isLost" },
          totalPending: { $sum: "$isPending" },

          totalNetAmount: { $sum: { $ifNull: ["$netAmount", 0] } },

          convertedNetAmount: {
            $sum: {
              $cond: [
                { $eq: ["$isConverted", 1] },
                { $ifNull: ["$netAmount", 0] },
                0,
              ],
            },
          },

          lostNetAmount: {
            $sum: {
              $cond: [
                { $eq: ["$isLost", 1] },
                { $ifNull: ["$netAmount", 0] },
                0,
              ],
            },
          },

          pendingNetAmount: {
            $sum: {
              $cond: [
                { $eq: ["$isPending", 1] },
                { $ifNull: ["$netAmount", 0] },
                0,
              ],
            },
          },
        },
      },

      // 🔟 Lookup staff/admin
      {
        $lookup: {
          from: "staffs",
          localField: "_id.staffId",
          foreignField: "_id",
          as: "staffData",
        },
      },
      {
        $lookup: {
          from: "admins",
          localField: "_id.staffId",
          foreignField: "_id",
          as: "adminData",
        },
      },

      // 1️⃣1️⃣ Resolve user
      {
        $addFields: {
          user: {
            $cond: [
              { $eq: ["$_id.model", "Admin"] },
              { $arrayElemAt: ["$adminData", 0] },
              { $arrayElemAt: ["$staffData", 0] },
            ],
          },
        },
      },

      // 1️⃣2️⃣ Final projection
      {
        $project: {
          _id: 0,
          branch: "$_id.branch",
          staffId: "$_id.staffId",

          staffName: { $ifNull: ["$user.name", "Unknown"] },
          staffRole: { $ifNull: ["$user.role", "Unknown"] },

          leadCount: 1,
          totalConverted: 1,
          totalLost: 1,
          totalPending: 1,

          totalNetAmount: 1,
          convertedNetAmount: 1,
          lostNetAmount: 1,
          pendingNetAmount: 1,
        },
      },

      // 1️⃣3️⃣ Sort
      {
        $sort: { staffName: 1 },
      },
    ]);





    const mappeddata = result.map((item) => ({
      staffId: item.staffId,
      productId: item.productId,
      branch: item?.branch,
      staffName: item.staffName,
      staffRole: item.staffRole,
      productName: item.productName,
      leadCount: item.leadCount,
      totalConverted: item.totalConverted,
      totalLost: item.totalLost,
      totalPending: item.totalPending,
      totalNetAmount: item.totalNetAmount,
      convertedNetAmount: item.convertedNetAmount,
      totalPendingAmount: item.totalPendingAmount,
      lostNetAmount: item.lostNetAmount
    }))


    if (result && result.length > 0) {
      return res.status(200).json({ message: "lead found", data: { mappeddata, re } })
    }
  } catch (error) {
    console.log("error", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const GetownLeadList = async (req, res) => {
  try {
    const { userId, selectedBranch, role, ownlead } = req.query;
    const objectId = new mongoose.Types.ObjectId(userId);

    let query;
    if (ownlead === "true") {
      query = {
        leadBranch: new mongoose.Types.ObjectId(selectedBranch),
        leadBy: objectId,
      };
    } else if (ownlead === "false" && role !== "Staff") {
      query = { leadBranch: new mongoose.Types.ObjectId(selectedBranch) };
    }

    const matchedLead = await LeadMaster.find(query)
      .populate({ path: "customerName", select: "customerName" })
      .lean();

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
        let taskallocatedTo;
        let taskallocatedBy;
        // ✅ Populate activityLog fields
        const populatedActivityLog = await Promise.all(
          (lead.activityLog || []).map(async (activity) => {
            const populatedActivity = { ...activity };

            // Populate taskallocatedTo
            if (activity.submissiondoneByModel && activity.submittedUser) {
              const model = mongoose.model(activity.submissiondoneByModel);
              taskallocatedTo = populatedActivity.submittedUser = await model
                .findById(activity.submittedUser)
                .select("name")
                .lean();
            }

            // // Populate taskallocatedBy
            if (activity.taskallocatedByModel && activity.taskallocatedBy) {
              const model = mongoose.model(activity.taskallocatedByModel);
              taskallocatedBy = populatedActivity.taskallocatedBy = await model
                .findById(activity.taskallocatedBy)
                .select("name")
                .lean();
            }
            if (activity.taskId && isValidObjectId(activity.taskId)) {
              populatedActivity.taskId = await Task.findById(activity.taskId)
                .select("taskName")
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
            if (activity.taskBy && isValidObjectId(activity.taskBy)) {
              populatedActivity.taskBy = await Task.findById(activity.taskBy).select("taskName").lean()
            }
            if (activity.taskId && isValidObjectId(activity.taskId)) {
              populatedActivity.taskId = await Task.findById(activity.taskId).select("taskName").lean()
            }

            return populatedActivity;
          })
        );

        // ✅ Get last activity
        const lastActivity =
          populatedActivityLog[populatedActivityLog.length - 1];

        return {
          ...lead,
          leadBy: populatedLeadBy,
          activityLog: populatedActivityLog, // include fully populated activity logs
          taskallocatedTo: taskallocatedTo || null,
          taskallocatedBy: taskallocatedBy || null,
        };
      })
    );
    if (populatedOwnLeads && populatedOwnLeads.length > 0) {
      return res
        .status(201)
        .json({ message: "lead found", data: populatedOwnLeads });
    } else {
      return res
        .status(200)
        .json({ message: "lead  not found", data: populatedOwnLeads });
    }
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const fixLeadVerifiedField = async (req, res) => {
  try {
    // 1️⃣ Rename the field 'leadVarified' -> 'leadVerified'
    await LeadMaster.updateMany(
      { leadVerified: { $exists: true } },
      {
        $rename: { leadVerified: "paymentVerified" },
      }
    );

    // 2️⃣ Set all documents' leadVerified to false (including newly renamed ones)
    const result = await LeadMaster.updateMany(
      {},
      { $set: { paymentVerified: false } }
    );
    if (result.acknowledged && result.modifiedCount > 0) {
      console.log(`✅ Successfully updated ${result.modifiedCount} leads.`);
      return res.status(200).json({ message: "update all" });
    } else if (result.acknowledged && result.modifiedCount === 0) {
      console.log(
        "ℹ️ No leads were modified — they may already have leadVerified: false."
      );
    } else {
      console.log("❌ Update failed.");
    }

    console.log(
      "✅ Field renamed to 'leadVerified' and set to false for all documents."
    );
  } catch (error) {
    console.error("❌ Error updating field:", error);
  }
};
