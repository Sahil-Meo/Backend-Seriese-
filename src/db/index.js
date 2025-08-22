import mongoose from 'mongoose'

const connectDB = async () => {
     try {
          // console.log(process.env.MONGO_URI)
          const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`)
          console.log("\n MongoDB connected !! DB Host:", connectionInstance.connection.host);
          console.log('MongoDB Connected Succesfully!')
     } catch (error) {
          console.log('MongoDB connection error: ', error);
     }
}

export default connectDB;