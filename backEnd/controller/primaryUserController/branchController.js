import Branch from "../../model/primaryUser/branchSchema.js"
import Company from "../../model/primaryUser/companySchema.js"
import mongoose from "mongoose"
export const BranchRegister = async (req, res) => {
  const {
    branchName,
    email,
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
      branchName,
      mobile,
      landlineno,
      address,
      pincode,
      country,
      state,
      city
    })
    console.log("control branch:", branches)
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
  try {
    const branchData = await Branch.find().populate({
      path: "companyName",
      model: "Company",
      select: "companyName"
    })
    console.log("branchdata :", branchData)
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
  const branchdata = req.body
  console.log("bodyyyy", req.body)

  const branchId = req.body

  try {
    const objectId = new mongoose.Types.ObjectId(branchId)
    // const updatedBranch = await Branch.updateOne(
    //   { _id: branchId },
    //   {
    //     companyName: branchdata.companyName,
    //     branchName: branchdata.branchName,
    //     address: branchdata.adress,
    //     city: branchdata.city,
    //     pincode: branchdata.pincode,
    //     country: branchdata.country,
    //     state: branchdata.state,
    //     email: branchdata.email,

    //     mobile: branchdata.mobile,

    //     landlineno: branchdata.landlineno
    //   }
    // )
    await Branch.findByIdAndUpdate(objectId,{
      companyName: branchdata.companyName,
      branchName: branchdata.branchName,
      address: branchdata.adress,
      city: branchdata.city,
      pincode: branchdata.pincode,
      country: branchdata.country,
      state: branchdata.state,
      email: branchdata.email,

      mobile: branchdata.mobile,

      landlineno: branchdata.landlineno
    } , { new: true })

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
