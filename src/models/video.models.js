import mongoose, { Schema } from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const videoSchema = new Schema({
     videoFile: {
          type: String,  // Cloudinary Url
          require: true
     },
     thumbnail: {
          type: String,  // Cloudinary Url
          require: true
     },
     title: {
          type: String,  // Cloudinary Url
          require: true
     },
     description: {
          type: String,  // Cloudinary Url
          require: true
     },
     duration: {
          type: Number,  // find from cloudinary url
          require: true
     },
     views: {
          type: Number,
          default: 0,
     },
     isPublished: {
          type: Boolean,
          default: true
     },
     owner: {
          type: Schema.Types.ObjectId,
          ref: "User"
     },
}, { timestamps: true });

videoSchema.plugin(mongooseAggregatePaginate)


export const Video = mongoose.model("Video", videoSchema)