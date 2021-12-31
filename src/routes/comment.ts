import express from "express";
import { authorize } from "../controllers/auth";
import { createComment, deleteComment } from "../controllers/comments";

const router = express.Router();

router.post("/comment/:postId", authorize, createComment);
router.delete("/comment/:postId/:commentId", authorize, deleteComment);

export default router;
