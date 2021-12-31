import express from "express";
import { authorize } from "../controllers/auth";
import {
  AllTheLikes,
  createPost,
  deletePost,
  getPost,
  getUserPost,
  likePost,
  singlePost,
  unlikePost,
} from "../controllers/post";

const router = express.Router();

router.get("/posts/", getPost);
router.get("/posts/user/:username", getUserPost);
router.get("/posts/:postId", singlePost);

router.post("/posts/create", authorize, createPost);
//

router.get("/posts/like/:postId", authorize, AllTheLikes);
router.post("/posts/like/:postId", authorize, likePost);
router.patch("/posts/unlike/:postId", authorize, unlikePost);

//

router.delete("/posts/:postId", authorize, deletePost);

export default router;
