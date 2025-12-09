// backend/server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import analyticsRoutes from "./routes/analyticsRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import templateRoutes from "./routes/templateRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Attach io to app so controllers can access it
app.set("io", io);

// DB
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Routes
app.get("/", (req, res) => res.send("WhatsApp Dashboard API running"));
app.use("/api/analytics", analyticsRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/templates", templateRoutes);

// Socket events
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  socket.on("joinChat", (phone) => {
    socket.join(phone);
    console.log(`User joined chat room: ${phone}`);
  });
  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
});
