import Department from "../../../model/primaryUser/departmentSchema.js"
export const DepartmentRegistration = async (req, res) => {
  const formData = req.body
  console.log("fom", formData)
  const { department } = formData

  try {
    const existingItem = await Department.findOne({ department: department })
    if (existingItem) {
      return res
        .status(400)
        .json({ message: "Department is already registered" })
    } else {
      const savingdepartment = new Department({
        department
      })
      const saveddepartment = await savingdepartment.save()
      if (saveddepartment) {
        res.status(200).json({ message: "Department saved succesfully" })
      }
    }
  } catch (error) {
    console.log("error:", error.message)
    res.status(500).json({ message: "Internal server error" })
  }
}
export const GetdepartmentList = async (req, res) => {
  try {
    const departmentlist = await Department.find()
    if (departmentlist) {
      res
        .status(200)
        .json({ message: "Department found", data: departmentlist })
    }
  } catch (error) {
    console.log("Error:", error.message)
  }
}
export const UpdatedepartmentDetails = async (req, res) => {
  const { id } = req.query

  const updateData = req.body

  try {
    const updateddepartmentDetails = await Department.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true
      }
    )

    if (!updateddepartmentDetails) {
      return res.status(404).json({ message: "Department details not found" })
    }

    res.status(200).json({ data: updateddepartmentDetails })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export const DeletedepartmentDetails = async (req, res) => {
  const { id } = req.query

  try {
    // Perform the deletion
    const result = await Department.findByIdAndDelete(id)

    if (result) {
      return res
        .status(200)
        .json({ message: "Department deleted successfully" })
    } else {
      return res.status(404).json({ message: "Department not found" })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Server error" })
  }
}
