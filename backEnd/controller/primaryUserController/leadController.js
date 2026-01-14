import LeadMaster from "../../model/primaryUser/leadmasterSchema.js";
import { isValidObjectId } from "mongoose";
import mongoose from "mongoose";
import models from "../../model/auth/authSchema.js";
const { Staff, Admin } = models;
import Customer from "../../model/secondaryUser/customerSchema.js";
import Task from "../../model/primaryUser/taskSchema.js";
import LeadId from "../../model/primaryUser/leadIdSchema.js";
import Service from "../../model/primaryUser/servicesSchema.js";
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
    if (allocationType) {
      const allocationName = await Task.findOne({ _id: allocationType });
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
        taskTo: allocationName?.taskName,
        taskId: allocationType,
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
      ...(selfAllocation && {
        selfAllocationType: allocationType,
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
      leadByModel, // Now set dynamically
    });
    await leadidonly.save({ session });
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({
      success: true,
      message: "Lead created successfully",
    });
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const Checkexistinglead = async (req, res) => {
  try {
    const { leadData, role, selectedleadlist } = req.query;

    const productIds = selectedleadlist.map((item) => item.productorServiceId);

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
      // Same customer + same product
      return res.status(200).json({
        message: "This customer already has a lead with the same product.",
        exists: true,
        eligible: false,
      });
    } else if (anyLeads) {
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
export const GetallTask = async (req, res) => {
  try {
    const tasks = await Task.find({ listed: true });
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

    // 1️⃣ Fetch lead
    const lead = await LeadMaster.findById(leadDocId).session(session);
    if (!lead) throw new Error("Lead not found");

    // 2️⃣ Find payment record
    const payment = lead.paymentHistory[index];
    if (!payment) throw new Error("Payment record not found");

    const oldReceivedAmount = payment.receivedAmount;
    const diff = editedData.receivedAmount - oldReceivedAmount;

    // 3️⃣ Update payment record
    payment.receivedAmount = editedData.receivedAmount;
    //update paymentdate
    payment.paymentDate = editedData.paymentDate;

    // 4️⃣ Adjust totals
    if (diff !== 0) {
      lead.totalPaidAmount += diff;
      lead.balanceAmount -= diff;
    }

    // Ensure no negatives or overpaid balances
    if (lead.totalPaidAmount < 0) lead.totalPaidAmount = 0;
    if (lead.balanceAmount < 0) lead.balanceAmount = 0;

    await lead.save({ session });
    await session.commitTransaction();

    res.status(200).json({
      message: "Payment updated successfully",
      data: lead,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};
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
export const UpdateCollection = async (req, res) => {
  const { isFrom = null } = req.query;
  const formData = req.body;
  let model;
  const isAdmin = await Admin.findOne({ _id: formData.receivedBy });
  if (isAdmin) {
    model = "Admin";
  } else {
    const isstaff = await Staff.findOne({ _id: formData.receivedBy });
    if (isstaff) {
      model = "Staff";
    }
  }

  const session = await mongoose.startSession();
  try {
    // const toBoolean = (value, defaultValue = false) => {
    //   if (value === null || value === undefined || value === "")
    //     return defaultValue;
    //   return value === "true" || value === true || value === 1 || value === "1";
    // };
    // const followupClosed = toBoolean(req.query.followupclosed);
    const customerId = formData?.customerId;
    const leadDocId = formData?.leadDocId;

    if (!formData.leadDocId) {
      return res.status(400).json({ message: "Missing leadid" });
    }

    session.startTransaction();
    const updatecustomer = await Customer.findByIdAndUpdate(
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
          pincode: formData?.pincode,
        },
      },
      { new: true, session }
    );
    if (!updatecustomer) {
      throw new Error("Customer not found");
    }
    // 2️⃣ Calculate updated totals
    const newTotalPaid =
      Number(formData.totalPaidAmount || 0) + Number(formData?.receivedAmount);

    const newBalance = Math.max(0, (formData?.netAmount || 0) - newTotalPaid);

    // 3️⃣ Create payment record
    const paymentRecord = {
      paymentDate: new Date(),
      receivedAmount: formData?.receivedAmount || 0,
      receivedBy: formData?.receivedBy,
      receivedModel: model,
      bankRemarks: formData?.bankRemarks || "",
      remarks: formData?.remarks,
    };
    let allocation = null;
    if (isFrom) {
      allocation = await Task.findOne({ taskName: "Leadclosed" });
    }
    const updateLead = await LeadMaster.findByIdAndUpdate(
      leadDocId,
      {
        $push: { paymentHistory: paymentRecord },
        $set: {
          totalPaidAmount: newTotalPaid,
          partner: formData.partner,
          balanceAmount: newBalance,
          ...(isFrom === "reallocation" && {
            leadClosed: true,
            leadClosedBy: formData?.receivedBy,
            leadClosedModel: formData?.receivedModel,
            reallocatedTo: false,
            allocationType: allocation?._id,
          }),
          // ///set followupclosed:true for all activitlylog array elements
          // ...(followupClosed && {
          //   "activityLog.$[].followupClosed": true,
          //   reallocatedTo: true,
          // }),
        },
      },
      { new: true, session }
    );
    await LeadMaster.updateMany(
      { customerName: updateLead.customerName },
      {
        $set: {
          email: formData?.email,
          mobile: formData?.mobile,
          pincode: formData?.pincode,
          partner: formData?.partner,
        },
      },
      {
        new: true,
        session,
      }
    );
    if (!updateLead) {
      throw new Error("lead not found");
    }
    await session.commitTransaction();
    session.endSession();
    return res.status(200).json({
      success: true,
      message: "Payment added succesfully",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.log("error", error.message);
    return res
      .status(500)
      .json({ successs: false, message: "Internal server error" });
  }
};
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
export const GetallfollowupList = async (req, res) => {
  try {
    const { loggeduserid, branchSelected, role, pendingfollowup } = req.query;

    const userObjectId = new mongoose.Types.ObjectId(loggeduserid);
    const branchObjectId = new mongoose.Types.ObjectId(branchSelected);
    // const
    let query;

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
    const selectedfollowup = await LeadMaster.find(query)
      .populate({ path: "customerName" })
      .populate({ path: "partner" })
      .lean();
    const followupLeads = [];
    for (const lead of selectedfollowup) {
      // Build matchedAllocations = activityLog entries where taskTo === 'followup'
      const activity = Array.isArray(lead.activityLog) ? lead.activityLog : [];
      const matchedAllocations = activity
        .map((item, index) => ({ ...item, index }))
        .filter((item) => item.taskTo === "followup");

      // If no matchedAllocation, skip this lead (or push with flags false if needed)
      if (matchedAllocations.length === 0) {
        continue;
      }

      // Safety: ensure model names exist before doing mongoose.model(...) calls
      const lastAlloc = matchedAllocations[matchedAllocations.length - 1];

      const lastIndex = lastAlloc.index;

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
        console.log("taskallocatedy", lastAlloc.taskallocatedByModel)
        console.error(
          `Model missing for lead ${lead._id}:`,
          lead.leadByModel,
          lastAlloc.taskallocatedToModel,
          lastAlloc.taskallocatedByModel
        );
        // skip this lead (don't `return` from whole function)
        continue;
      }

      // Populate outer fields (await as needed)
      const leadByModel = mongoose.model(lead.leadByModel);
      const allocatedToModel = mongoose.model(lastAlloc.taskallocatedToModel);
      const allocatedByModel = mongoose.model(lastAlloc.taskallocatedByModel);

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
      ]);

      // Populate activityLog fields that reference other models (submittedUser, taskallocatedTo)
      const populatedActivityLog = await Promise.all(
        activity.map(async (log) => {
          let populatedSubmittedUser = null;
          let populatedTaskAllocatedTo = null;
          let populatedTask = null;
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

          return {
            ...log,
            submittedUser: populatedSubmittedUser || log.submittedUser,
            taskallocatedTo: populatedTaskAllocatedTo || log.taskallocatedTo,
            taskId: populatedTask,
          };
        })
      );

      // Determine neverfollowuped:
      // - If the last matched allocation itself has followupClosed === true => NOT neverfollowuped
      // - Else, check logs AFTER the lastAlloc.index: if any has nextFollowUpDate (non-null) => NOT neverfollowuped
      // - Otherwise => neverfollowuped = true
      const lastMatched = lastAlloc;
      const lastMatchedClosed = !!lastMatched.followupClosed; // closed flag(s)
      let neverfollowuped = false;

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
          // also, if the matched allocation itself had nextFollowUpDate, treat as not neverfollowuped
          if (lastMatched.nextFollowUpDate) neverfollowuped = false;
          else neverfollowuped = true;
        }
      }

      // currentdateNextfollowup: whether the very last activity log entry has nextFollowUpDate (or you can define differently)
      const lastActivity = activity[activity.length - 1] || {};
      const Nextfollowup = !!lastActivity.nextFollowUpDate;

      // allocatedfollowup: whether the last activity entry was created from followup task (taskfromFollowup flag)
      const allocatedfollowup = !!lastActivity.taskfromFollowup;

      // allocatedTaskClosed: whether last activity entry's allocatedClosed === true
      const allocatedTaskClosed = !!lastActivity.allocatedClosed;

      // push enriched lead
      followupLeads.push({
        ...lead,
        leadBy: popLeadBy || lead.leadBy,
        allocatedTo: popAllocatedTo,
        allocatedBy: popAllocatedBy,
        activityLog: populatedActivityLog,
        nextFollowUpDate: lastActivity.nextFollowUpDate ?? null, //to show the nextfollowupdate in the list
        neverfollowuped, //to check whether the lead is ever followuped
        Nextfollowup,
        allocatedfollowup, //to know whether the lead have any task from followup
        allocatedTaskClosed, //to know the the task from followup is closed or not
      });
    }

    // for (const lead of selectedfollowup) {
    //   // const matchedallocation = lead.activityLog.filter((item) => item?.taskTo === "followup" && item?.followupClosed === false)

    //   const matchedAllocations = lead.activityLog
    //     .map((item, index) => ({ ...item, index })) // add index inside each item
    //     .filter((item) => item.taskTo === "followup" && (pendingfollowup === "false" ? item.followupClosed === true : item.followupClosed === false));
    //   const nextfollowUpDate = lead.activityLog[lead.activityLog.length - 1]?.nextFollowUpDate ?? null
    //   if (matchedAllocations && matchedAllocations.length > 0) {

    //     if (
    //       !lead.leadByModel || !mongoose.models[lead.leadByModel] ||
    //       !matchedAllocations[matchedAllocations.length - 1]?.taskallocatedToModel || !mongoose.models[matchedAllocations[matchedAllocations.length - 1]?.taskallocatedToModel] ||
    //       !matchedAllocations[matchedAllocations.length - 1]?.taskallocatedByModel || !mongoose.models[matchedAllocations[matchedAllocations.length - 1]?.taskallocatedByModel]
    //     ) {
    //       console.error(`Model ${lead.leadByModel}, ${matchedAllocations[matchedAllocations.length - 1].taskallocatedToModel}, or ${matchedAllocations[matchedAllocations.length - 1].taskallocatedByModel} is not registered`);
    //       // followupLeads.push(lead);
    //       // continue;
    //       return
    //     }

    //     // Populate outer fields
    //     const leadByModel = mongoose.model(lead.leadByModel);
    //     const allocatedToModel = mongoose.model(matchedAllocations[matchedAllocations.length - 1]?.taskallocatedToModel);
    //     const allocatedByModel = mongoose.model(matchedAllocations[matchedAllocations.length - 1]?.taskallocatedByModel);
    //     const populatedLeadBy = await leadByModel.findById(lead.leadBy).select("name").lean();
    //     const populatedAllocatedTo = await allocatedToModel.findById(matchedAllocations[matchedAllocations.length - 1].taskallocatedTo).select("name").lean();
    //     const populatedAllocatedBy = await allocatedByModel.findById(matchedAllocations[matchedAllocations.length - 1].taskallocatedBy).select("name").lean();

    //     // Populate activityLog (submittedUser, etc.)
    //     const populatedActivityLog = await Promise.all(
    //       lead.activityLog.map(async (log) => {
    //         let populatedSubmittedUser = null;
    //         let populatedTaskAllocatedTo = null;

    //         if (log.submittedUser && log.submissiondoneByModel && mongoose.models[log.submissiondoneByModel]) {
    //           const model = mongoose.model(log.submissiondoneByModel);
    //           populatedSubmittedUser = await model.findById(log.submittedUser).select("name").lean();
    //         }

    //         if (log.taskallocatedTo && log.taskallocatedToModel && mongoose.models[log.taskallocatedToModel]) {
    //           const model = mongoose.model(log.taskallocatedToModel);
    //           populatedTaskAllocatedTo = await model.findById(log.taskallocatedTo).select("name").lean();
    //         }

    //         return {
    //           ...log,
    //           submittedUser: populatedSubmittedUser || log.submittedUser,
    //           taskallocatedTo: populatedTaskAllocatedTo || log.taskallocatedTo,
    //         };
    //       })
    //     );

    //     const lastMatchedIndex =
    //       matchedAllocations.length > 0
    //         ? matchedAllocations[matchedAllocations.length - 1].index
    //         : -1;

    //     const checkneverFollowuped = !lead.activityLog
    //       .slice(lastMatchedIndex + 1) //gets entries *after* the last matched one
    //       .some((log) => !!log.nextFollowUpDate); //true if *any* has a date
    //     followupLeads.push({
    //       ...lead,
    //       leadBy: populatedLeadBy || lead.leadBy,
    //       allocatedTo: populatedAllocatedTo,
    //       allocatedBy: populatedAllocatedBy,
    //       activityLog: populatedActivityLog,
    //       nextFollowUpDate: nextfollowUpDate,
    //       neverfollowuped: checkneverFollowuped,
    //       currentdateNextfollowup: lead.activityLog[lead.activityLog.length - 1]?.nextFollowUpDate ? true : false,//check have nextfollowupdate
    //       allocatedfollowup: lead.activityLog[lead.activityLog.length - 1]?.taskfromFollowup ?? false,//to know whether the followp has task from followup
    //       allocatedTaskClosed: lead.activityLog[lead.activityLog.length - 1]?.allocatedClosed ?? false//to know taskfrom followp is closed or not
    //     });
    //   }

    // }
    const ischekCollegueLeads = followupLeads.some((item) =>
      item.allocatedBy._id.equals(userObjectId)
    );

    if (followupLeads && followupLeads.length > 0) {
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
};
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
   
    await LeadMaster.bulkWrite([
      {
        updateOne: {
          filter: { _id: leaddocId },
          update:
            editIndex !== undefined && editIndex !== null
              ? {
                  $set: {
                    [`activityLog.${Number(
                      editIndex
                    )}.allocationChanged`]: true,
                  },
                }
              : {},
        },
      },
      {
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
                taskBy: "allocated",
                taskTo: demoData?.selectedType,
                taskfromFollowup: true,
                allocationChanged: false,
              },
            },
            $set: { taskfromFollowup: true },
          },
        },
      },
    ]);

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
  } catch (error) {}
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
export const UpdateLeadfollowUpDate = async (req, res) => {
  try {
    const formData = req.body;
    const { selectedleaddocId, loggeduserid } = req.query;

    let followedByModel;
    const isStaff = await Staff.findOne({ _id: loggeduserid });
    if (isStaff) {
      followedByModel = "Staff";
    } else {
      const isAdmin = await Admin.findOne({ _id: loggeduserid });
      if (isAdmin) {
        followedByModel = "Admin";
      }
    }
    if (!followedByModel) {
      return res.status(400).json({ message: "Invalid followedid reference" });
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
    const allocationTask = await Task.findOne({ taskName: "Followup" });
    const activityEntry = {
      submissionDate: formData.followUpDate,
      submittedUser: loggeduserid,
      submissiondoneByModel: followedByModel,
      taskBy: allocationTask?._id,
      nextFollowUpDate: formData.nextfollowUpDate,
      remarks: formData.Remarks,
      taskfromFollowup: false,
    };

    // Conditionally add fields only if `closed` is true
    if (formData.followupType === "closed") {
      activityEntry.taskClosed = true;
      activityEntry.followupClosed = true;
      activityEntry.reallocatedTo = true;
    } else if (formData.followupType === "lost") {
      activityEntry.taskClosed = true;
    }
    const updatefollowUpDate = await LeadMaster.findOneAndUpdate(
      { _id: selectedleaddocId },
      {
        $push: {
          activityLog: activityEntry,
        },

        reallocatedTo: formData.followupType === "closed",
        leadLost: formData.followupType === "lost",
      },

      { upsert: true }
    );
    if (updatefollowUpDate) {
      return res.status(200).json({ message: "Update followupDate" });
    }
  } catch (error) {
    console.log("errrr:", error);
    console.log("error:", error.message);
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
    const { allocatedBy, selectedbranch, allocationType } = req.query;
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
      taskfromFollowup: false,
    };
    if (allocationType === "followup") {
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
          allocationType: allocationType, // Set outside the activityLog array
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

            // ✅ Populate for non-followup logs only
            if (item?.taskallocatedTo && item?.taskTo !== "followup") {
              let populatedSubmittedUser = null;
              let populatedTaskAllocatedTo = null;
              let populatedTask;

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

              return {
                ...item,
                taskId: populatedTask,
                submittedUser: populatedSubmittedUser || item.submittedUser,
                taskallocatedTo:
                  populatedTaskAllocatedTo || item.taskallocatedTo,
              };
            } else {
              return item;
            }
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
              let populatedleadBy = null;

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
                populatedleadBy = await Task.findById(log.taskBy)
                  .select("taskName")
                  .lean();
              }
              return {
                ...log,
                taskBy: populatedleadBy,
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
export const GetcollectionLeads = async (req, res) => {
  try {
    const { selectedBranch, verified } = req.query;
    const query = {
      leadBranch: new mongoose.Types.ObjectId(selectedBranch),
      paymentVerified: verified === "true" ? true : false,
    };
    const matchedCollectionlead = await LeadMaster.find(query)
      .populate({ path: "customerName" })
      .populate({ path: "partner" })
      .lean();
    const populatedcollectionLeads = await Promise.all(
      matchedCollectionlead.map(async (lead) => {
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

        const populatedpaymentHistory = lead?.paymentHistory?.length
          ? await Promise.all(
              lead.paymentHistory.map(async (history) => {
                const populatedhistory = { ...history }; // if it's a mongoose subdoc
                if (history.receivedModel && history.receivedBy) {
                  const model = mongoose.model(history.receivedModel);
                  populatedhistory.receivedBy = await model
                    .findById(history.receivedBy)
                    .select("name")
                    .lean();
                }
                return populatedhistory;
              })
            )
          : [];

        // ✅ Get last activity
        const lastActivity =
          populatedActivityLog[populatedActivityLog.length - 1];

        return {
          ...lead,
          leadBy: populatedLeadBy,
          paymentHistory: populatedpaymentHistory,
          activityLog: populatedActivityLog, // include fully populated activity logs
          taskallocatedTo: lasttaskallocatedto || null,
          taskallocatedBy: lasttaskallocatedBy || null,
          leadclosedBy: lastActivity?.submittedUser,
        };
      })
    );
    if (populatedcollectionLeads && populatedcollectionLeads.length > 0) {
      return res
        .status(201)
        .json({ message: "lead found", data: populatedcollectionLeads });
    } else {
      return res
        .status(200)
        .json({ message: "lead  not found", data: populatedcollectionLeads });
    }
  } catch (error) {
    console.log("error", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
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
    console.log("error:", error.message);
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
