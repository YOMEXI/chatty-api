import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";

import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import cookie from "cookie";
import { promisify } from "util";

//
import { User } from "./../entities/User";
import { Profile } from "../entities/Profile";
import { Follower } from "../entities/Follower";
import { Notification } from "../entities/Notification";
import { Messages } from "../entities/Messages";
import { AuthInput } from "../interface/Auth";

const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, username, password, age, firstname, lastname } = <AuthInput>(
      req.body
    );

    const emailExist = await User.findOne({ email });
    const userExist = await User.findOne({ username });

    if (emailExist) {
      res.status(404);
      throw new Error("Email already exist");
    }

    if (userExist) {
      res.status(404);
      throw new Error("Username already exist");
    }

    //change password to string in the frontend
    const user = new User({
      email,
      username,
      password,
      age,
      firstname,
      lastname,
    });

    await new Follower({ user: user._id, followers: [], following: [] }).save();

    await new Profile({ user: user._id }).save();
    await new Notification({ user: user._id, notifications: [] }).save();
    await new Messages({ user: user._id, chats: [] }).save();

    await user.save();

    return res.status(200).json({
      message: "Registration Successful, Please Login",
    });

    next();
  }
);

//

const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = <AuthInput>req.body;

    let user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(404);
      throw new Error("User Doesn't Exist ");
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      res.status(404);
      throw new Error("Incorrect password");
    }

    const notification = await Notification.findOne({ user: user._id });

    const message = await Messages.findOne({ user: user._id });

    if (!notification) {
      await new Notification({ user: user._id, notifications: [] }).save();
    }

    if (!message) {
      await new Messages({ user: user._id, chats: [] }).save();
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });

    //
    user.password = undefined;

    //
    res.set(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 360000,
        path: "/",
      })
    );

    res.status(200).json({
      message: "login successfull",
      user,
    });
  }
);

const authorize = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string;

    if (req.headers.cookie) {
      token = req.headers.cookie.split("=")[1];
    }

    if (!token) {
      res.status(401);
      throw new Error("Please Log In  ....");
    }

    const { email }: any = jwt.verify(token, process.env.JWT_SECRET);
    const stillTheUser = await User.findOne({ email });

    if (!stillTheUser) {
      res.status(401);
      throw new Error("User No Longer Exist");
    }

    (<any>req).user = stillTheUser;
    next();
  }
);

const OnlyUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (!req.headers.cookie) {
      return next();
    }
    if (req.headers.cookie) {
      token = req.headers.cookie.split("=")[1];
    }

    const { email }: any = jwt.verify(token, process.env.JWT_SECRET);
    const stillTheUser = await User.findOne({ email });

    (<any>req).user = stillTheUser;
    next();
  }
);

const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.set(
      "Set-Cookie",
      cookie.serialize("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(0),
        path: "/",
      })
    );

    res.status(200).json({ success: true });
  }
);

const updatePassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { CurrentPassword, NewPassword } = req.body;
    const { _id } = (<any>req).user;

    if (NewPassword < 7) {
      res.status(401);
      throw new Error("Should be at least 7 characters");
    }

    const user = await User.findById(_id).select("+password");

    const isPassword = await bcrypt.compare(CurrentPassword, user.password);

    if (!isPassword) {
      res.status(401);
      throw new Error("Password Invalid");
    }

    user.password = await bcrypt.hash(NewPassword, 10);
    await user.save();
    return res.status(200).json("Password updated");
  }
);

const messagePopup = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = (<any>req).user;

    const user = await User.findById(_id).select("+password");

    if (user.newMessagePopup) {
      user.newMessagePopup = false;
      await user.save();
    } else {
      user.newMessagePopup = true;
      await user.save();
    }

    res.status(200).json("Done");
  }
);

export {
  login,
  register,
  authorize,
  OnlyUser,
  logout,
  updatePassword,
  messagePopup,
};
