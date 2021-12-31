import mongoose, { Schema } from "mongoose";
import { User } from "../interface/Document";

const ProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    // bio: { type: String, required: true },
    // social: {},
  },
  { timestamps: true }
);

let Profile = mongoose.model("Profile", ProfileSchema);
export { Profile };
