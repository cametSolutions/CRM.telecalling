import Department from "../../../model/primaryUser/departmentSchema.js"
import Counter from "../../../model/primaryUser/counterSchema.js";
import mongoose from "mongoose";
// export const DepartmentRegistration = async (req, res) => {
//   const formData = req.body
//   const { department } = formData

//   try {
//     const existingItem = await Department.findOne({ department: department })
//     if (existingItem) {
//       return res
//         .status(400)
//         .json({ message: "Department is already registered" })
//     } else {
//       const savingdepartment = new Department({
//         department
//       })
//       const saveddepartment = await savingdepartment.save()
//       if (saveddepartment) {
//         res.status(200).json({ message: "Department saved succesfully" })
//       }
//     }
//   } catch (error) {
//     console.log("error:", error.message)
//     res.status(500).json({ message: "Internal server error" })
//   }
// }

export const DepartmentRegistration = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
const {cmpid}=req.query
    const { department } = req.body;

    // Check duplicate department
    const existingItem = await Department.findOne({
company_id:cmpid,
      department,
    }).session(session);

    if (existingItem) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        message: "Department is already registered",
      });
    }

    // Generate next sequence number
    const counter = await Counter.findOneAndUpdate(
      { _id: "department" },
      { $inc: { seq: 1 } },
      {
        new: true,
        upsert: true,
        session,
      }
    );

    const code = `DEPARTMENT${counter.seq}`;

    // Save department
    const savingdepartment = new Department({
company_id:cmpid,
      department,
      code,
    });

    await savingdepartment.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: "Department saved successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
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
