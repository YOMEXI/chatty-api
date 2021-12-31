import express from "express";
import { authorize } from "../controllers/auth";
import {
  newConversation,
  getUserConversation,
  getTwoUserConversation,
} from "../controllers/conversation";

const router = express.Router();

router.post("/conversation", newConversation);
router.get("/conversation/:id", getUserConversation);
router.get("/conversation/:firstUserId/:secondUserId", getTwoUserConversation);

export default router;
