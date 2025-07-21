import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
     username: {
          type: String,
          require: true,
          unique: true,
          lowercase: true,
          trim: true,
          index: true
     },
     email: {
          type: String,
          require: true,
          unique: true,
          lowercase: true,
          trim: true,
     },
     fullname: {
          type: String,
          require: true,
          trim: true,
          index: true
     },
     avatar: {
          type: String,  
          require: true,
          trim:true,
     },
     converImage: {
          type: String, 
     },
     watchHistory: [
          {
               type: Schema.Types.ObjectId,
               ref: "video",
          }
     ],
     password: {
          type: String,
          require: true
     },
     refreshToken: {
          type: String
     }
}, { timestamps: true });


export const User = mongoose.model("User", userSchema)