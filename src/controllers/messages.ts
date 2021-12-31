import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { User } from "../entities/User";
import mongoose, { Schema } from "mongoose";
import { Messages } from "../entities/Messages";
import { Conversation } from "../entities/Conversation";
import { Profile } from "../entities/Profile";
import { Follower } from "../entities/Follower";

const addMessage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const newMessage = new Messages(req.body);
    await newMessage.save();

    res.status(200).json(newMessage);
  }
);

const getAllMessagesInConversation = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const messages = await Messages.find({
      conversationId: req.params.conversationId,
    });

    res.status(200).json(messages);
  }
);

const UserProfileById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    // const { username } = (<any>req).user;

    const user = await User.findById(id);

    if (!user) {
      res.status(401);
      throw new Error("User doesn't exist");
    }

    const profile = await Profile.findOne({ user: user._id }).populate("user");
    const { user: UserProfile }: any = profile;
    const followStats = await Follower.findOne({ user: user._id });

    return res.json({
      UserProfile,
      followersLength: followStats.followers.length
        ? followStats.followers.length
        : 0,
      followingLength: followStats.following.length
        ? followStats.following.length
        : 0,
    });
  }
);

export { addMessage, getAllMessagesInConversation, UserProfileById };
