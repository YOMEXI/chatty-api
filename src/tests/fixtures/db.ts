import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { DB } from "../testHandlers";
import app from "../../app";
import cookieParser from "cookie-parser";
import { User } from "../../entities/User";

export const theUser = {
  email: "norm@gmail.com",
  username: "marcel",
  password: "4444444",
  age: 23,
};

let email = theUser.email;
export const token = jwt.sign({ email }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRY,
});

export const DbSetUp = async () => {
  DB();
  app.use(cookieParser());
  await User.deleteMany();
  await new User(theUser).save();
};
