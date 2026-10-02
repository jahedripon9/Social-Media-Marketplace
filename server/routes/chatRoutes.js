import express from "express";
import {
  getAllUserChats,
  getChat,
  sendChatMessage,
} from "../controllers/chatController.js";
import { protect } from "../middlewares/authMiddleware.js";

const chatRouter = express.Router();

chatRouter.post("/", protect, getChat);
chatRouter.get("/user", protect, getAllUserChats);
chatRouter.post("/send-message", protect, sendChatMessage);

export default chatRouter;
