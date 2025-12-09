// backend/controllers/chatController.js
import Message from "../models/Message.js";
import Contact from "../models/Contact.js";
import { emitDashboardStats } from "./analyticsController.js";

/* ============================================================
   HELPER: Validate Phone Number (GLOBAL FIX)
============================================================ */
function validatePhone(phone) {
  return (
    typeof phone === "string" &&
    phone.trim() !== "" &&
    phone.trim().length >= 5
  );
}

/* ============================================================
   GET CHAT HISTORY
============================================================ */
export const getChatHistory = async (req, res) => {
  try {
    const { phone } = req.params;

    if (!validatePhone(phone)) {
      return res.status(400).json({ error: "Invalid phone number" });
    }

    console.log("LOAD HISTORY FOR:", phone);

    const messages = await Message.find({ phone_number: phone }).sort({
      createdAt: 1,
    });

    res.json(
      messages.map((m) => ({
        ...m._doc,
        id: m._id.toString(),
      }))
    );
  } catch (err) {
    console.error("Chat history error:", err);
    res.status(500).json({ message: "Failed to load messages" });
  }
};

/* ============================================================
   SEND TEXT MESSAGE
============================================================ */
export const sendMessage = async (req, res) => {
  try {
    const { phone } = req.params;
    let { text, from = "business" } = req.body;

    console.log("SEND TEXT:", { phone, text, from });

    // STRICT VALIDATION
    if (!validatePhone(phone)) {
      console.log("❌ INVALID PHONE:", phone);
      return res.status(400).json({ error: "Invalid phone number" });
    }

    if (!text || typeof text !== "string" || text.trim() === "") {
      console.log("❌ INVALID TEXT PAYLOAD");
      return res.status(400).json({ error: "Text is required" });
    }

    // Ensure contact exists (SAFE)
    let contact = await Contact.findOne({ phone_number: phone });

    if (!contact) {
      console.log("ℹ️ Auto-creating new contact:", phone);

      contact = await Contact.create({
        name: phone,
        phone_number: phone,
        tags: ["New"],
      });
    }

    // Save message
    const msg = await Message.create({
      phone_number: phone,
      text: text.trim(),
      from,
      status: "sent",
    });

    console.log("✔️ Message saved:", msg._id.toString());

    // Real-time push
    const io = req.app.get("io");
    if (io) io.to(phone).emit("newMessage", msg);

    // Update dashboard stats
    await emitDashboardStats(req.app);

    res.status(201).json({
      ...msg._doc,
      id: msg._id.toString(),
      time: msg.createdAt,
    });
  } catch (err) {
    console.error("🔥 SEND MESSAGE ERROR:", err);
    res.status(500).json({
      message: "Failed to send message",
      error: err.message,
    });
  }
};

/* ============================================================
   SEND FILE MESSAGE
============================================================ */
export const sendFileMessage = async (req, res) => {
  try {
    const phone = req.body.phone || req.params.phone; // FIXED

    console.log("UPLOAD FILE:", { phone });

    if (!validatePhone(phone)) {
      return res.status(400).json({ error: "Invalid phone number" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const fileName = req.file.originalname;
    const mime = req.file.mimetype;

    const fileType = mime.startsWith("image")
      ? "image"
      : mime.startsWith("audio")
      ? "audio"
      : "document";

    const msg = await Message.create({
      phone_number: phone,
      from: "business",
      fileUrl,
      fileName,
      fileType,
      status: "sent",
    });

    console.log("✔️ File message saved:", msg._id.toString());

    const io = req.app.get("io");
    if (io) io.to(phone).emit("newMessage", msg);

    await emitDashboardStats(req.app);

    res.json({
      ...msg._doc,
      id: msg._id.toString(),
      time: msg.createdAt,
    });
  } catch (err) {
    console.error("🔥 FILE MESSAGE ERROR:", err);
    res.status(500).json({
      message: "Failed to upload file",
      error: err.message,
    });
  }
};

/* ============================================================
   DELETE CHAT HISTORY
============================================================ */
export const deleteChatHistory = async (req, res) => {
  try {
    const { phone } = req.params;

    if (!validatePhone(phone)) {
      return res.status(400).json({ error: "Invalid phone number" });
    }

    console.log("DELETING CHAT HISTORY:", phone);

    await Message.deleteMany({ phone_number: phone });

    await emitDashboardStats(req.app);

    res.json({
      success: true,
      message: "Chat history deleted successfully",
    });
  } catch (err) {
    console.error("🔥 DELETE CHAT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete chat history",
    });
  }
};
