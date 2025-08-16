import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.models.js';
import { uploadOnCloudinary } from '../utils/Cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js'

const registerUser = asyncHandler(async (req, res) => {

     const { fullname, username, email, password } = req.body;
     if ([fullname, username, email, password].some((field) => field?.trim() === "")) {
          throw new ApiError(400, "all fields are required");
     }

     const existingUser = await User.findOne({
          $or: [
               { username: username.toLowerCase() },
               { email: email.toLowerCase() }
          ]
     })
     if (existingUser) {
          throw new ApiError(409, "Username or email already exists");
     }

     const avatarLocalPath = req.files?.avatar[0].path;
     // const coverImageLocalPath = req.files?.coverImage[0].path;
     let coverImageLocalPath = ""

     if (req.file || req.files?.coverImage || req.files?.coverImage[0]) {
          coverImageLocalPath = req.files?.coverImage[0]?.path || "";
     }

     // console.log({ coverImageLocalPath, avatarLocalPath });

     if (!avatarLocalPath) {
          throw new ApiError(400, "Avatar is required");
     }

     const avatar = await uploadOnCloudinary(avatarLocalPath)
     const coverImage = await uploadOnCloudinary(coverImageLocalPath)
     console.log(avatar, coverImage);

     if (!avatar) {
          throw new ApiError(500, "Image upload failed");
     }

     const user = await User.create({
          fullname,
          username: username.toLowerCase(),
          email,
          password,
          avatar: avatar.url,
          coverImage: coverImage?.url || ""
     })

     const createdUser = await User.findById(user._id).select(
          "-password -refreshToken"
     )

     if (!createdUser) {
          throw new ApiError(500, "Something went wrong while creating user")
     }

     return res.status(201).json(
          new ApiResponse(200, createdUser, "User Register successfullty")
     )
})

export { registerUser }

export const loginUser = async (req, res) => {
     try {

          const { email, password } = req.body;
          if ([email, password].some((field) => field?.trim() === "")) {
               throw new ApiError(400, "all fields are required");
          }

          const userExists = await User.findOne({ email });
          if (!userExists) {
               throw new ApiError(404, "User not found");
          }

          

     } catch (error) {
          console.log("error occure while login user:", error.message);
          throw new ApiError(500, "Something went wrong while login User")
     }
}

export const logoutUser = async (req, res) => {
     try {
          const { userId } = req.body;
          if (!userId) {
               throw new ApiError(400, "User ID is required");
          }

          // Perform logout logic here (e.g., invalidate token, etc.)

          return res.status(200).json(
               new ApiResponse(200, null, "User logged out successfully")
          );
     } catch (error) {
          console.log("error occure while logout user:", error.message);
          throw new ApiError(500, "Something went wrong while logout User")
     }
}