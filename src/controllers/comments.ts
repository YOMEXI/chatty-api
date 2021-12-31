import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
uuidv4();

//
import { Post } from "../entities/Post";
import { User } from "../entities/User";

import { CommentInput } from "../interface/others";

const createComment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = <CommentInput>req.params;
    const { text } = <CommentInput>req.body;
    const { _id } = (<any>req).user;
    //
    if (text.length < 1)
      return res.status(401).json("Comments should be at least one character");

    const singlePost = await Post.findById(postId);

    if (!singlePost) {
      return res.status(404).json("No Post Found");
    }

    const newComment = {
      _id: uuidv4(),
      text,
      user: (<any>req).user,
      date: Date.now(),
    };

    singlePost.comments.unshift(newComment);
    singlePost.save();

    //
    return res
      .status(201)
      .json({ id: newComment._id, msg: "comment submitted" });
  }
);

const deleteComment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId, commentId } = req.params;
    const { _id } = (<any>req).user;

    const singlePost = await Post.findById(postId);

    if (!singlePost) {
      return res.status(404).json("No Post Found");
    }

    const comment = singlePost.comments.find(
      (comment: any) => comment._id === commentId
    );

    if (!comment) {
      res.status(404);
      throw new Error("No comment Found");
    }
    const delComment = async () => {
      const indexof = singlePost.comments
        .map((comment: any) => comment._id)
        .indexOf(commentId);

      singlePost.comments.splice(indexof, 1);
      await singlePost.save();

      res.status(200).json("comment deleted");
    };

    const user = await User.findById(_id);

    if (String(comment.user) !== String(_id) && user.role === "root") {
      await delComment();
    }

    if (String(comment.user) !== String(_id)) {
      res.status(404);
      throw new Error("You did not make this comment");
    }

    await delComment();
  }
);

export { createComment, deleteComment };
