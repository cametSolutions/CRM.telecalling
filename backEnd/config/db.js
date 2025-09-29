import mongoose from "mongoose";
import { ensureIndexes } from "../model/auth/authSchema.js";
import Customer from "../model/secondaryUser/customerSchema.js";
import CallRegistration from "../model/secondaryUser/CallRegistrationSchema.js";

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI)
        // await Customer.syncIndexes()
        await CallRegistration.syncIndexes()
        console.log("Indexes are now created/updated")
        console.log(`MongoDB is connected ${connect.connection.host}`)
        // Create indexes after successful connection
        await ensureIndexes()

    } catch (error) {
        console.log(`Mongo Connection failed ${error.message}`)
        process.exit(1)
    }
}
export default connectDB