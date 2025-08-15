import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'


cloudinary.config({
     cloud_name: "dyr8pvtyq",
     api_key: "268754762784447",
     api_secret: "n7fY6iWevoAMnfdbk71c7zIUu58"
});

const uploadOnCloudinary = async (localFilePath) => {
     try {
          // console.log(`Uploading file: ${localFilePath}`);

          if (!localFilePath) return null
          console.log("I reach there");

          const response = await cloudinary.uploader.upload(localFilePath, {
               resource_type: "auto"
          })
          console.log("File uploaded to Cloudinary:", response);

          console.log("file has been uploaded successfully", response.url);

          return response
     } catch (error) {
          console.error("Cloudinary upload error:", error);
          if (fs.existsSync(localFilePath)) {
               fs.unlinkSync(localFilePath);
          }
          console.error("Local file deleted after upload error:", localFilePath);
          return null;
     }
}

export { uploadOnCloudinary }