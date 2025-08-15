import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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
          type: String,  // cloudanry database url
          require: true,
     },
     coverImage: {
          type: String,  // cloudanry database url
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

userSchema.pre("save", async function (next) {
     if (!this.isModified('password')) return next(); 
     this.password = await bcrypt.hash(this.password, 5)
     next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
     return await bcrypt.compare(password, this.password)
}


userSchema.methods.generateAccesToken = function () {
     return jwt.sign(
          {
               _id: this._id,
               email: this.email,
               username: this.username,
               fullname: this.fullname,
          },
          process.env.ACCESS_TOKEN_SECRET,
          {
               expiresIn: process.env.ACCESS_TOKEN_EXPIRY
          }
     )
}


userSchema.methods.generateRefreshToken = function (password) {
     return jwt.sign(
          {
               _id: this._id,
          },
          process.env.ACCESS_TOKEN_SECRET,
          {
               expiresIn: process.env.ACCESS_TOKEN_EXPIRY
          }
     )
}

export const User = mongoose.model("User", userSchema)