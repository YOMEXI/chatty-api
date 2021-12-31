import asyncHandler from "express-async-handler";

import { v2 } from "cloudinary";
import { NextFunction, Request, Response } from "express";
import formidable from "formidable";

let cloudinary = v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

//
import { Post } from "../entities/Post";
import { User } from "../entities/User";

const DeletePosts = async (singlePost, res) => {
  if (singlePost.pic_id) {
    cloudinary.uploader.destroy(
      singlePost.pic_id,
      async function (error, result) {}
    );

    await singlePost.deleteOne();
    return res.status(200).json("Post deleted successfully");
  }

  await singlePost.deleteOne();
  return res.status(200).json("Post deleted successfully");
};

const createPost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const form = formidable({ multiples: true });

    form.parse(req, async (err: any, fields: any, files: any) => {
      if (err) {
        res.status(404);
        throw new Error("File  Upload error");
      }

      const { text, title } = fields;
      const { picUrl } = files;

      if (text.length < 1)
        return res.status(401).send("Should be at least 1 character");

      const newPost = new Post({ user: (<any>req).user, text, title });
      //

      if (picUrl) {
        cloudinary.uploader.upload(
          picUrl.path,
          {
            resource_type: "auto",
            public_id: `chat/${picUrl.path}`,
            overwrite: true,
          },
          async function (error, result) {
            (newPost.picUrl = result.url),
              (newPost.pic_id = result.public_id),
              await newPost.save();

            return res.json({ id: newPost._id, msg: " Post created " });
          }
        );
      } else {
        await newPost.save();

        return res.status(201).json({ id: newPost._id, msg: " Post Created " });
      }
    });
  }
);

const getPost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const pageNumber: number = (req.query.pageNumber || 0) as number;
    const postPerPage: number = (req.query.size || 3) as number;

    const allPost = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user")
      .skip(pageNumber * postPerPage)
      .limit(postPerPage)
      .populate("comments.user");

    return res.status(200).json(allPost);
  }
);

const singlePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;

    const singlePost = await Post.findById(postId)
      .populate("user")
      .populate("comments.user");
    if (!singlePost) {
      return res.status(404).json("No Post Found");
    }

    return res.json([singlePost]);
  }
);

const deletePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const { _id } = (<any>req).user;

    const singlePost = await Post.findById(postId);

    if (!singlePost) {
      return res.status(404).json("No Post Found");
    }

    const user = await User.findById(_id);

    if (singlePost.user._id.toString() !== user._id.toString()) {
      if (user.role === "root") {
        DeletePosts(singlePost, res);
      } else {
        return res.status(401).json("Unauthorized");
      }
    }

    DeletePosts(singlePost, res);
  }
);

const likePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const { _id } = (<any>req).user;

    let singlePost = await Post.findById(postId);

    if (!singlePost) {
      return res.status(404).json("No Post Found");
    }

    const isLiked =
      singlePost.likes.filter((like) => like.user.toString() === _id.toString())
        .length > 0;

    if (isLiked) return res.status(401).json("Post already liked");

    singlePost.likes.unshift({ user: _id });
    await singlePost.save();

    return res.status(200).json("Post Liked");
  }
);

const unlikePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const { _id } = (<any>req).user;

    let singlePost = await Post.findById(postId);

    if (!singlePost) {
      return res.status(404).json("No Post Found");
    }

    const isLiked =
      singlePost.likes.filter((like) => String(like.user) === String(_id))
        .length === 0;

    if (isLiked) return res.status(401).json("Post not liked by you");

    const index = singlePost.likes
      .map((like) => String(like.user))
      .indexOf(String(_id));

    singlePost.likes.splice(index, 1);
    await singlePost.save();

    return res.status(200).json("Post unLiked");
  }
);

const AllTheLikes = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;

    let singlePost = await Post.findById(postId).populate("likes.user");

    if (!singlePost) {
      return res.status(404).json("No Post Found");
    }

    return res.status(200).json(singlePost.likes);
  }
);

const getUserPost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const pageNumber: number = (req.query.pageNumber || 0) as number;
    const postPerPage: number = (req.query.size || 2) as number;
    const { username } = req.params;

    const user = await User.findOne({ username });

    const allPost = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate("user")
      .skip(pageNumber * postPerPage)
      .limit(postPerPage)
      .populate("comments.user");

    return res.json(allPost);
  }
);

export {
  AllTheLikes,
  getPost,
  getUserPost,
  createPost,
  singlePost,
  deletePost,
  likePost,
  unlikePost,
};
