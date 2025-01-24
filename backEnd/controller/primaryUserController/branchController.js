import Branch from "../../model/primaryUser/branchSchema.js"
import Company from "../../model/primaryUser/companySchema.js"
import mongoose from "mongoose"
export const BranchRegister = async (req, res) => {
  const {
    branchName,
    email,
    ccmail,
    whatsappnumber,
    mailpassword,
    notificationemail,
    companyName,
    mobile,
    landlineno,
    address,
    pincode,
    country,
    state,
    city
  } = req.body

  // Check if user already exists
  // const branchExists = await Branch.findOne({ email })
  const branchExists = await Branch.findOne({
    $or: [
      { email: email }, // Condition 1: Match a document with the same email
      { branchName: branchName } // Condition 2: Match a document with the same branch name
    ]
  })
  if (branchExists) {
    return res.status(400).json({ message: "Branch already exist" })
  }

  try {
    // Create and save new user
    const branches = new Branch({
      companyName,
      email,
      ccmail,
      whatsappnumber,
      notificationemail,
      mailpassword,
      branchName,
      mobile,
      landlineno,
      address,
      pincode,
      country,
      state,
      city
    })
    const savedBranch = await branches.save()
    await Company.findByIdAndUpdate(
      companyName,
      { $push: { branches: savedBranch._id } },
      { new: true }
    )
    res.status(200).json({
      status: true,
      message: "Branch created successfully"
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "server errorsssss" })
  }
}
export const Getbranch = async (req, res) => {
  console.log("ggggg")
  try {
    const branchData = await Branch.find().populate({
      path: "companyName",
      model: "Company",
      select: "companyName"
    })
    if (!branchData && branchData.length < 0) {
      res.status(404).json({ messsge: "company not found" })
    }
    res.status(200).json({ message: "branch found", data: branchData })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
}
export const BranchEdit = async (req, res) => {
  const { branchData, branchId } = req.body

  try {
    const objectId = new mongoose.Types.ObjectId(branchId)

    await Branch.findByIdAndUpdate(
      objectId,
      {
        companyName: branchData?.companyName,
        branchName: branchData?.branchName,
        address: branchData?.adress,
        city: branchData?.city,
        pincode: branchData?.pincode,
        country: branchData?.country,
        state: branchData?.state,
        email: branchData?.email,
        ccmail: branchData?.ccmail,
        notificationemail: branchData?.notificationemail,
        mailpassword: branchData?.mailpassword,
        whatsappnumber: branchData?.whatsappnumber,
        mobile: branchData?.mobile,
        landlineno: branchData?.landlineno
      },
      { new: true }
    )

    return res.status(200).json({
      success: true,
      message: "Branch updated successfully"
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: "Error updating branch",
      error: error.message
    })
  }
}
