import mongoose from "mongoose";
import { ensureIndexes } from "../model/auth/authSchema.js";

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB is connected ${connect.connection.host}`)
        // Create indexes after successful connection
        await ensureIndexes()

    } catch (error) {
        console.log(`Mongo Connection failed ${error.message}`)
        process.exit(1)
    }
}
export default connectDB