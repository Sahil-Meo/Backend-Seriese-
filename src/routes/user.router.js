import { Router } from "express";
import { registerUser } from '../controlers/user.controler.js';
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();
router.route('/register').post(upload.fields([
     {
          name: 'avatar',
          maxCount: 1
     },
     {
          name: 'cover',
          maxCount: 1
     }
]), registerUser);

export default router;