import mongoose from "mongoose"

const CallRegistrationSchema = new mongoose.Schema(
  {
    customerid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },
    customerName: {
      type: String
    },
    callregistration: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Reference to Product schema
          set: v => (v === "" ? null : v)
        },
        license: Number,
        branchName: [],
        timedata: {
          startTime: Date,
          endTime: Date,
          duration: String,
          token: String,
          time: String
        },
        formdata: {
          incomingNumber: String,
          token: String,
          description: String,
          callnote: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Callnote" // Reference to callnote schema
          },
          solution: String,
          status: String,
          attendedBy: [],
          completedBy: []
        }
      }
    ]
  },
  {
    timestamps: true
  }
)

export default mongoose.model("CallRegistration", CallRegistrationSchema)
