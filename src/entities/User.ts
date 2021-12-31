import mongoose, { Schema } from "mongoose";
import { User } from "../interface/Document";
import bcrypt from "bcrypt";

const UserSchema = new Schema<User>(
  {
    email: {
      type: String,
      require: true,
      unique: true,
    },
    firstname: {
      type: String,
      require: true,
    },
    lastname: {
      type: String,
      require: true,
    },
    age: {
      type: Number,
      require: true,
    },
    password: {
      type: String,
      require: true,
      select: false,
    },
    username: {
      type: String,
      require: true,
      unique: true,
      trim: true,
    },
    imgUrl: {
      type: String,
    },
    unreadMessage: {
      type: Boolean,
      default: false,
    },
    unreadNotification: {
      type: Boolean,
      default: false,
    },
    newMessagePopup: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "root"],
    },
    img_id: {
      type: String,
    },
    resetToken: {
      type: String,
    },
    expireToken: {
      type: String,
    },
    country: {
      type: String,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

let User = mongoose.model<User>("User", UserSchema);
export { User };
