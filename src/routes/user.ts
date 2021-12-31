import express from "express";
import { authorize } from "../controllers/auth";
import {
  Search,
  UserImage,
  loggedInUserDetails,
  UserProfile,
  getFollowers,
  getFollowing,
  followUser,
  unFollowUser,
  userToFindId,
} from "../controllers/user";

const router = express.Router();

router.get("/:username", UserProfile);
// router.use(authorize);

router.get("/user/me", authorize, loggedInUserDetails);
router.post("/user/follow/:userToFollowId", authorize, followUser);
router.put("/user/unfollow/:userToUnFollowId", authorize, unFollowUser);

//

router.post("/user/imgUpload/:_id", authorize, UserImage);
router.get("/user/:searchText", authorize, Search);
router.get("/chat/user/:userToFindId", authorize, userToFindId);

router.get("/followers/:userId", authorize, getFollowers);
router.get("/following/:userId", authorize, getFollowing);

export default router;
