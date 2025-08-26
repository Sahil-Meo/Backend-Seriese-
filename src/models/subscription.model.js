import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
     {
          subscriber: {
               type: Schema.Types.ObjectId,      // a user who subscribing channel
               ref: "User"
          },
          channel: {
               type: Schema.Types.ObjectId, // a channel tha subscribed
               ref: "User"
          }
     }, { timestamps: true });



export const Subscription = mongoose.model("Subscription", subscriptionSchema);