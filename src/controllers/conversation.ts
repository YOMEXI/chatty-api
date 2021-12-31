import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { User } from "../entities/User";

import { Conversation } from "../entities/Conversation";

const newConversation = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { senderId, recieverId } = req.body;

    const newConversation = new Conversation({
      members: [senderId, recieverId],
    });
    await newConversation.save();
    if (!newConversation) {
      return res.status(404).json("Conversation not created");
    }

    res.status(201).json(newConversation);
  }
);

const getUserConversation = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const conversation = await Conversation.find({
      members: { $in: [id] },
    });

    res.status(200).json(conversation);
  }
);

const getTwoUserConversation = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { firstUserId, secondUserId } = req.params;

    const conversation = await Conversation.findOne({
      members: { $all: [firstUserId, secondUserId] },
    });

    res.status(200).json(conversation);
  }
);

export { newConversation, getUserConversation, getTwoUserConversation };
