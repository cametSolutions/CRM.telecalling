import Company from "../../model/primaryUser/companySchema.js"

export const CompanyRegister = async (req, res) => {
  const { email, companyName } = req.body

  // Check if user already exists
  const userExists = await Company.findOne({ email })
  if (userExists) {
    return res.status(400).json({ message: "Email already registered" })
  }

  try {
    // Create and save new user
    const companies = new Company({
      companyName,
      email
    })
    await companies.save()
    res.status(200).json({
      status: true,
      message: "User created successfully"
    })
  } catch (error) {
    res.status(500).json({ message: "server error" })
  }
}
export const Getcompany = async (req, res) => {
  try {
    const companies = await Company.find().populate("branches")

    if (!companies && companies.length < 0) {
      res.status(404).json({ messsge: "company not found" })
    }
    res.status(200).json({ message: "company found", data: companies })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
}
export const UpdateCompany = async (req, res) => {
  const data = req.body
  const ownerId = req.body.owner
  const id = req.body._id

  try {
    const updatedCompany = await Company.updateOne(
      { _id: id, owner: ownerId },
      {
        name: data.name,
        address: data.ownerId,
        city: data.city,
        pincode: data.pincode,
        country: data.country,
        state: data.state,
        email: data.email,
        mailserver: data.mailserver,
        mobile: data.mobile,
        website: data.website,
        pan: data.pan,
        landlineno: data.landlineno,
        gstin: data.gstin,
        accountDetails: data.accountDetails,
        terms: data.terms,
        parcelServices: data.parcelServices
      }
    )

    return res.status(200).json({
      success: true,
      message: "Company updated successfully",
      data: updatedCompany
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating company",
      error: error.message
    })
  }
}
