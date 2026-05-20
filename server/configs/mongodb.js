import mongoose from "mongoose";

//Connect to the MongoDB database

const connectDB = async ()=>{
    try {
        mongoose.connection.on('connected', ()=> console.log('Database Connected'))
        
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI environment variable is not set')
        }

        await mongoose.connect(`${process.env.MONGODB_URI}/lms`)
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message)
        throw error
    }
}
export default connectDB
