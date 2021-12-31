import { Schema } from "mongoose";
import mongoose from "mongoose";
import { Post } from "../interface/Post";

const postSchema = new Schema<Post>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    text: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    picUrl: { type: String, default: null },
    pic_id: { type: String },
    likes: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    unlikes: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    comments: [
      {
        _id: { type: String, required: true },
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        text: {
          type: String,
          required: true,
        },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

let Post = mongoose.model<Post>("Post", postSchema);

export { Post };
