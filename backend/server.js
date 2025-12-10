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

// =====================================
// ✅ ALLOWED ORIGINS (FRONTEND URLs)
// =====================================
const allowedOrigins = [
  "http://localhost:3000",
  "https://whatsapp-business-dashboard-frontend-git-main-vin-76388345.vercel.app",
  "https://whatsapp-business-dashboard-frontend.vercel.app"
];

console.log("🚀 Allowed origins:", allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ BLOCKED ORIGIN:", origin);
      callback(new Error("CORS blocked: " + origin));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));


// =====================================
// ✅ SOCKET.IO CORS
// =====================================
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Attach io to app
app.set("io", io);

// =====================================
// ✅ CONNECT DATABASE
// =====================================
connectDB();

// =====================================
// ✅ GLOBAL MIDDLEWARE
// =====================================
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static
app.use("/uploads", express.static("uploads"));

// =====================================
// ✅ ROUTES
// =====================================
app.get("/", (req, res) => res.send("WhatsApp Dashboard API running"));

app.use("/api/analytics", analyticsRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/templates", templateRoutes);

// =====================================
// ✅ SOCKET EVENTS
// =====================================
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("joinChat", (phone) => {
    socket.join(phone);
    console.log(`Joined room: ${phone}`);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// =====================================
// ✅ START SERVER
// =====================================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
