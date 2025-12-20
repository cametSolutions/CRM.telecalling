import mongoose from "mongoose";
export const SubmitTargetRegister = async (req, res) => {
    try {
        const formData = req.body
        // console.log(formData,null)
        console.log(JSON.stringify(formData, null, 2))

    } catch (error) {
        console.log("error", error.message)
        return res.status(500).json({ message: "Internal server error" })
    }
}