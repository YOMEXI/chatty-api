import express from "express";
import { authorize } from "../controllers/auth";
import {
  addMessage,
  getAllMessagesInConversation,
  UserProfileById,
} from "../controllers/messages";

const router = express.Router();

router.post("/message", addMessage);
router.get("/message/:conversationId", getAllMessagesInConversation);
router.get("/message/getuser/:id", UserProfileById);

export default router;
