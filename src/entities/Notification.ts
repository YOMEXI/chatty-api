import mongoose, { Schema } from "mongoose";
import { Notification } from "../interface/Post";

const NotificationSchema = new Schema<Notification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    notifications: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        type: { type: String, enum: ["newLike", "newComment", "newFollower"] },
        post: { type: Schema.Types.ObjectId, ref: "Post" },
        commentId: { type: String },
        text: { type: String },
        date: { type: Date, default: Date.now() },
      },
    ],
  },
  { timestamps: true }
);

let Notification = mongoose.model<Notification>(
  "Notification",
  NotificationSchema
);

export { Notification };
