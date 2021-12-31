import asyncHandler from "express-async-handler";
import mongoose, { Schema } from "mongoose";
import { v2 } from "cloudinary";
import { NextFunction, Request, Response } from "express";
import formidable from "formidable";
import { User } from "../entities/User";
import { Profile } from "../entities/Profile";
import { Follower } from "../entities/Follower";

let cloudinary = v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
//

const UserImage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const form = formidable({ multiples: true });
    const { _id } = req.params;

    form.parse(req, async (err: any, fields: any, files: any) => {
      if (err) {
        res.status(404);
        throw new Error("File  Upload error");
      }

      const { image } = files;

      //
      const user = await User.findOne({ _id });

      if (!user) {
        res.status(404);
        throw new Error("User Doesnt exist");
      }

      if (image === "" || !image) {
        res.status(404);
        throw new Error("Image  Upload error");
      }

      if (image === "" || !image) {
        res.status(404);
        throw new Error("Image  Upload error");
      }

      if (user && image) {
        cloudinary.uploader.upload(
          image.path,
          {
            resource_type: "auto",
            public_id: `chat/${image.path}`,
            overwrite: true,
          },
          async function (error, result) {
            (user.imgUrl = result.url),
              (user.img_id = result.public_id),
              await user.save();

            return res.status(200).json("Image Uploaded");
          }
        );
      }
    });
  }
);

const Search = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { searchText } = req.params;
    const { _id } = (<any>req).user;

    if (searchText.length === 0) return;

    let Pattern = new RegExp(`^${searchText}`);

    const results = await User.find({
      username: {
        $regex: Pattern,
        $options: "i",
      },
    });

    const resultToBeSent =
      results.length > 0 &&
      results.filter((result: any) => String(result._id) !== String(_id));

    return res.status(200).json(resultToBeSent);
  }
);

const loggedInUserDetails = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username } = (<any>req).user;

    const user = await User.findOne({ username });

    if (!user) {
      res.status(401);
      throw new Error("User Deleted");
    }

    return res.json([user]);
  }
);

const UserProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.params;
    // const { username } = (<any>req).user;

    const user = await User.findOne({ username });

    if (!user) {
      res.status(401);
      throw new Error("User doesn't exist at all");
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

const getFollowers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    const user = await Follower.findOne({ user: userId }).populate(
      "followers.user"
    );

    return res.json(user.followers.map((x: any) => x.user));
  }
);

const getFollowing = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    const user = await Follower.findOne({ user: userId }).populate(
      "following.user"
    );

    return res.json(user.following);
  }
);

const followUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userToFollowId } = req.params;
    const { _id } = (<any>req).user;

    let user = await Follower.findOne({ user: _id });

    let userToFollow = await Follower.findOne({ user: userToFollowId });

    if (!user || !userToFollow) {
      res.status(404);
      throw new Error("User Doesnt exist");
    }

    const isFollowing =
      user.following.length &&
      user.following.filter(
        (following: any) => String(following.user) === String(userToFollowId)
      ).length > 0;

    if (isFollowing) {
      res.status(404);
      throw new Error("User already Followed");
    }

    user.following.unshift({
      user: userToFollowId,
    });
    await user.save();

    userToFollow.followers.unshift({ user: _id });
    await userToFollow.save();

    return res.status(200).json("Done");
  }
);

const unFollowUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userToUnFollowId } = req.params;
    const { _id } = (<any>req).user;

    let user = await Follower.findOne({ user: _id });

    let userToUnFollow = await Follower.findOne({ user: userToUnFollowId });

    if (!user || !userToUnFollow) {
      res.status(404);
      throw new Error("User Doesnt exist");
    }

    const isFollowing =
      user.following.length &&
      user.following.filter(
        (following: any) => String(following.user) === String(userToUnFollowId)
      ).length === 0;

    if (isFollowing) {
      res.status(401);
      throw new Error("User Not Followed Previously ");
    }

    const removeFollowing = user.following
      .map((following: any) => String(following.user))
      .indexOf(String(userToUnFollowId));

    user.following.splice(removeFollowing, 1);

    await user.save();

    userToUnFollow.followers.splice(removeFollowing, 1);
    await userToUnFollow.save();

    return res.status(200).json("Done");
  }
);

const userToFindId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userToFindId } = req.params;

    const user: any | number = await User.findById(userToFindId);

    if (!user) {
      res.status(404);
      throw new Error("No User Found");
    }
    console.log();
    return res.status(200).json(user);
  }
);

export {
  userToFindId,
  UserImage,
  Search,
  loggedInUserDetails,
  UserProfile,
  getFollowers,
  getFollowing,
  followUser,
  unFollowUser,
};
