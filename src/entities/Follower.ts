import mongoose, { Schema } from "mongoose";
import { Follower } from "../interface/Post";

const FollowerSchema = new Schema<Follower>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    followers: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
    following: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
  },
  { timestamps: true }
);

let Follower = mongoose.model<Follower>("Follower", FollowerSchema);

export { Follower };
