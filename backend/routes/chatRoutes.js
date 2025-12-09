// backend/routes/chatRoutes.js
import express from "express";
import multer from "multer";
import {
  getChatHistory,
  sendMessage,
  sendFileMessage,
  deleteChatHistory,
} from "../controllers/chatController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    Date.now() + "_" + file.originalname.replace(/\s+/g, "_"),
});

const upload = multer({ storage });

router.get("/:phone/messages", getChatHistory);
router.post("/:phone/messages", sendMessage);
router.post("/upload-file", upload.single("file"), sendFileMessage);
router.delete("/:phone", deleteChatHistory);

export default router;
