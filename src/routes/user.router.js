import { Router } from "express";
import { loginUser, logoutUser, registerUser } from '../controlers/user.controler.js';
// import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { upload } from '../middlewares/multer.middleware.js';
import { varifyToken } from "../middlewares/auth.middleware.js";
import requareValidateEmail from "../middlewares/validateEmail.js";

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
router.route('/logout').post(varifyToken, logoutUser);

export default router;