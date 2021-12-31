import express from "express";
import {
  authorize,
  login,
  logout,
  messagePopup,
  register,
  updatePassword,
} from "../controllers/auth";
import { userData, userLogin, validate } from "../middlewares/sanitizer";

const router = express.Router();

router.post("/register", register);
router.post("/login", validate(userLogin), login);

router.post("/logout", logout);
router.post("/me/updatepassword", authorize, updatePassword);
router.post("/messagePopup", authorize, messagePopup);

export default router;
