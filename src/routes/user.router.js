import { Router } from "express";
// import { loginUser, logoutUser, registerUser } from '../controlers/user.controler.js';
// import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { upload } from '../middlewares/multer.middleware.js';
import { verifyToken } from "../middlewares/auth.middleware.js";
import requareValidateEmail from "../middlewares/validateEmail.js";
import { changeCurrentPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, registerUser, updateAccountDetails, updateCoverImage, updateUserAvatar } from "../controllers/user.controller.js";

const router = Router();
router.route('/register').post(upload.fields([
     {
          name: 'avatar',
          maxCount: 1
     },
     {
          name: 'coverImage',
          maxCount: 1
     }
]), registerUser);

router.route('/login').post(requareValidateEmail, loginUser);
router.route('/logout').post(verifyToken, logoutUser);
router.route('/change-password').post(verifyToken, changeCurrentPassword);
router.route('/current-user').get(verifyToken, getCurrentUser);
router.route('/update-account').patch(verifyToken, updateAccountDetails);
router.route('/avatar').patch(verifyToken, upload.single('avatar'), updateUserAvatar);
router.route('/cover-image').patch(verifyToken, upload.single('coverImage'), updateCoverImage);
router.route('/c/:username').get(verifyToken, getUserChannelProfile);
router.route('/watch-history').get(verifyToken, getWatchHistory);

export default router;