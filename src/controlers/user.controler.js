import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.models.js';
import { uploadOnCloudinary } from '../utils/Cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js'
import requareValidateEmail from '../middlewares/validateEmail.js';


const generateAccessAndRefreshToken = async (userId) => {
     try {
          const findUser = await User.findById(userId);
          if (!findUser) {
               throw new ApiError(404, "User not found");
          }

          const accessToken = findUser.generateAccessToken();
          const refreshToken = findUser.generateRefreshToken();

          await findUser.save({ validateBeforeSave: false })

          return { accessToken, refreshToken };
     } catch (error) {
          throw new ApiError(500, "Somthing went wrong while genrating access and refresh token!");
     }
}

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
     // req.user => data
     // check email and password
     // validate email
     // find user
     // check password 
     // access and refresh token
     // send response to user

     try {
          const { username, email, password } = req.body;
          
          if ([username, email, password].some((field) => field?.trim() === "")) {
               throw new ApiError(400, "all fields are required");
          }
          // console.log( "You reach there",email);
          const user = await User.findOne({ email });
          if (!user) {
               throw new ApiError(404, "User not found");
          }

          const isPasswordValid = await user.isPasswordCorrect(password);
          if (!isPasswordValid) {
               throw new ApiError(401, "Invalid password");
          }

          const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
          const loggedInUser = { ...user.toObject(), accessToken, refreshToken }   // at this point we can add a quairy to fetch user again but it's depend on the use case
          const selectedUser = loggedInUser.select("-password -refreshToken")
          const options = {
               httpOnly: true,
               secure: process.env.NODE_ENV === "production",
               sameSite: "Strict",
               maxAge: 24 * 60 * 60 * 1000 // 1 day
          }

          return res.status(200)
               .cookie("refreshToken", refreshToken, options)
               .cookie("accessToken", accessToken, options)
               .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));

     } catch (error) {
          console.log("error occure while login user:", error.message);
          throw new ApiError(500, "Something went wrong while login User")
     }
}

export const logoutUser = async (req, res) => {
     // remove cookie 
     // reset both tokens

     try {
          await User.findByIdAndUpdate(req.user._id, {
               $set: {
                    refreshToken: undefined
               }
          }, { new: true });

          const options = {
               httpOnly: true,
               secure: process.env.NODE_ENV === "production",
               sameSite: "Strict",
               maxAge: 0 // 0 means cookie will be removed
          }

          res
               .status(200)
               .clearCookie("refreshToken", options)
               .clearCookie("accessToken", options)
               .json(new ApiResponse(200, {}, "User logged out successfully"));
     } catch (error) {
          console.log("error occure while logout user:", error.message);
          throw new ApiError(500, "Something went wrong while logout User")
     }
}